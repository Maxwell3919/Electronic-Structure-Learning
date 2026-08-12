import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceMediaPath = path.join(root, 'src/reading/source-media.ts');
const sourceMediaText = fs.readFileSync(sourceMediaPath, 'utf8');
const failures = [];

const walk = (directory) => {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    entry.isDirectory() ? files.push(...walk(absolute)) : files.push(absolute);
  }
  return files;
};

const bookContentFiles = walk(path.join(root, 'src/reading/books')).filter((file) => file.includes(`${path.sep}content${path.sep}`) && file.endsWith('.astro'));
const pageFiles = [
  ...walk(path.join(root, 'src/pages/reading')).filter((file) => file.endsWith('.astro')),
  ...walk(path.join(root, 'src/pages/theory')).filter((file) => file.endsWith('.astro')),
  ...bookContentFiles,
];
const sourceReadingFiles = walk(path.join(root, 'src/reading/books')).filter((file) => file.endsWith('source-reading.ts'));
const relative = (file) => path.relative(root, file).replaceAll(path.sep, '/');

const visualBlock = sourceMediaText.match(/visuals:\s*\{([\s\S]*?)\n\s*\}\s+satisfies Record<SourceVisualId, SourceVisual>/)?.[1] ?? '';
const visualEntries = [];
for (const match of visualBlock.matchAll(/\n\s*'([^']+)': \{\n\s*id: '([^']+)',([\s\S]*?)\n\s*\},/g)) {
  const [, key, id, body] = match;
  const localAsset = body.match(/local_asset: '([^']+)'/)?.[1];
  const sha256 = body.match(/sha256: '([^']+)'/)?.[1];
  const usagePages = [...body.matchAll(/'\/(?:reading|theory)\/[^']+\/'/g)].map((entry) => entry[0].slice(1, -1));
  if (key !== id || !localAsset || !sha256) failures.push(`Malformed visual manifest record: ${key}`);
  visualEntries.push({ id, localAsset, sha256, usagePages });
}
const visualById = new Map(visualEntries.map((entry) => [entry.id, entry]));

for (const entry of visualEntries) {
  const assetPath = path.join(root, 'public', entry.localAsset);
  if (!fs.existsSync(assetPath)) {
    failures.push(`${entry.id}: missing ${entry.localAsset}`);
    continue;
  }
  const digest = crypto.createHash('sha256').update(fs.readFileSync(assetPath)).digest('hex');
  if (digest !== entry.sha256) failures.push(`${entry.id}: SHA-256 mismatch (manifest ${entry.sha256}, file ${digest})`);
}

const pageRecords = [];
const realPlacements = [];
const bookVisualPlacements = [];
const textOnlyReferences = [];
const contentSourceReferences = [];
const svgSubstitutes = [];
const oldVisualKinds = /(?:bloch-phase|smearing-cutoff|pairing-gap|phonon-chain|hk-response|hedin-diagrams)/g;
const concreteVisualReference = /\b(?:Figs?\.?|Figures?|Tables?)\s+\d+(?:\.\d+)?(?:\s*[–-]\s*\d+(?:\.\d+)?)?(?:\s+(?:and|,)\s*\d+(?:\.\d+)?(?:\s*[–-]\s*\d+(?:\.\d+)?)?)*(?=\W|$)|\bsource\s+(?:figures?|diagrams?)\b/gi;
const visualTokens = (text) => {
  const tokens = new Set([...text.matchAll(/\b\d+\.\d+\b/g)].map((match) => match[0]));
  for (const match of text.matchAll(/\b(\d+)\.(\d+)\s*[–-]\s*(?:(\d+)\.)?(\d+)\b/g)) {
    const [, firstMajor, firstMinor, secondMajor, secondMinor] = match;
    const major = secondMajor ?? firstMajor;
    if (major !== firstMajor) continue;
    for (let minor = Number(firstMinor); minor <= Number(secondMinor); minor += 1) tokens.add(`${major}.${minor}`);
  }
  return [...tokens];
};

const bookLocators = [];
for (const file of sourceReadingFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const book = relative(file).split('/')[3];
  const canonicalMatch = text.match(/export const \w+CanonicalSource\s*=\s*\{[\s\S]*?href:\s*'([^']+)'[\s\S]*?label:\s*'([^']+)'[\s\S]*?\};/);
  const canonicalSource = canonicalMatch ? { href: canonicalMatch[1], label: canonicalMatch[2] } : null;
  const hasCanonicalSource = Boolean(canonicalSource && /^https?:\/\//.test(canonicalSource.href));
  let visualLocatorCount = 0;

  for (const match of text.matchAll(/\{\s*locator:\s*'([^']+)',([\s\S]*?)\},/g)) {
    const locator = match[1];
    if (!/(?:Fig|Table)/i.test(locator)) continue;
    visualLocatorCount += 1;
    const slug = [...text.slice(0, match.index).matchAll(/^\s*'([^']+)':\s*\[/gm)].at(-1)?.[1] ?? 'unknown';
    const visualMatch = match[2].match(/visuals:\s*\[([^\]]*)\]/);
    const visuals = visualMatch ? [...visualMatch[1].matchAll(/'([^']+)'/g)].map((entry) => entry[1]) : [];
    let visualRecordValid = visuals.length > 0;

    for (const id of visuals) {
      if (!visualById.has(id)) {
        failures.push(`${book} ${locator}: unknown source visual ${id}`);
        visualRecordValid = false;
        continue;
      }
      bookVisualPlacements.push({ page: visualById.get(id).usagePages[0] ?? `/reading/books/${book}/`, id, locator, source_file: relative(file) });
    }

    const status = visuals.length > 0 && visualRecordValid
      ? 'REAL_PRESENT'
      : hasCanonicalSource
        ? 'SOURCE_CITED'
        : 'SOURCE_UNRESOLVED';

    bookLocators.push({
      book,
      slug,
      locator,
      locator_tokens: visualTokens(locator),
      source_file: relative(file),
      source_href: canonicalSource?.href ?? null,
      source_label: canonicalSource?.label ?? null,
      visuals,
      status,
    });
  }

  if (visualLocatorCount > 0 && !hasCanonicalSource) failures.push(`${book}: Figure/Table locators have no authoritative canonical source URL`);
}

for (const file of pageFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const page = relative(file);
  const calls = [...text.matchAll(/<SourceVisual\s+kind="([^"]+)"\s*\/?\s*>/g)].map((match) => match[1]);
  const realCalls = calls.filter((id) => visualById.has(id));
  const badCalls = calls.filter((id) => !visualById.has(id));
  for (const id of realCalls) realPlacements.push({ page, id });
  for (const id of badCalls) svgSubstitutes.push({ page, id });
  const oldKinds = text.match(oldVisualKinds) ?? [];
  for (const id of oldKinds) svgSubstitutes.push({ page, id });
  const references = [...text.matchAll(concreteVisualReference)].map((match) => match[0]);
  const isDynamicBookTemplate = page.includes('src/pages/reading/books/') && page.includes('[slug]');
  const isBookContentPage = page.startsWith('src/reading/books/') && page.includes('/content/');

  if (references.length > 0 && isBookContentPage) {
    const pathParts = page.split('/');
    const book = pathParts[3];
    const slug = path.basename(file, '.astro');
    const candidates = bookLocators.filter((entry) => entry.book === book && entry.slug === slug);
    for (const reference of [...new Set(references)]) {
      const tokens = visualTokens(reference);
      const matching = candidates.filter((entry) => tokens.length > 0 && tokens.every((token) => entry.locator_tokens.includes(token)));
      if (matching.length === 0) {
        textOnlyReferences.push({ page, references: [reference], reason: 'book body reference has no matching source-reading locator' });
        continue;
      }
      const status = matching.some((entry) => entry.status === 'REAL_PRESENT')
        ? 'REAL_PRESENT'
        : matching.some((entry) => entry.status === 'SOURCE_CITED')
          ? 'SOURCE_CITED'
          : 'SOURCE_UNRESOLVED';
      contentSourceReferences.push({ page, reference, status, source_locators: matching.map((entry) => entry.locator) });
    }
  } else if (references.length > 0 && realCalls.length === 0 && !isDynamicBookTemplate) {
    textOnlyReferences.push({ page, references: [...new Set(references)] });
  }

  pageRecords.push({ page, real_visuals: realCalls, explicit_visual_references: [...new Set(references)] });
}

const allRealPlacements = [...realPlacements, ...bookVisualPlacements];
const sourceCitedBookLocators = bookLocators.filter((entry) => entry.status === 'SOURCE_CITED');
const unresolvedBookLocators = bookLocators.filter((entry) => entry.status === 'SOURCE_UNRESOLVED');
const unresolvedContentReferences = contentSourceReferences.filter((entry) => entry.status === 'SOURCE_UNRESOLVED');

const literatureStatus = [
  { id: 'hohenberg-kohn-1964', status: 'REAL_PRESENT', visual_count: 2 },
  { id: 'hedin-1965', status: 'REAL_PRESENT', visual_count: 12 },
  { id: 'zhong-vanderbilt-rabe-1995', status: 'REAL_PRESENT', visual_count: 1 },
  { id: 'kohn-sham-1965', status: 'NO_VISUAL_NEEDED', visual_count: 0 },
  { id: 'levy-1979', status: 'NO_VISUAL_NEEDED', visual_count: 0 },
  { id: 'lieb-1983', status: 'NO_VISUAL_NEEDED', visual_count: 0 },
  { id: 'ceperley-alder-1980', status: 'NO_VISUAL_NEEDED', visual_count: 0 },
  { id: 'perdew-zunger-1981', status: 'NO_VISUAL_NEEDED', visual_count: 0 },
  { id: 'perdew-burke-ernzerhof-1996', status: 'NO_VISUAL_NEEDED', visual_count: 0 },
  { id: 'vanderbilt-1990', status: 'NO_VISUAL_NEEDED', visual_count: 0 },
  { id: 'blochl-1994', status: 'NO_VISUAL_NEEDED', visual_count: 0 },
  { id: 'baroni-2001', status: 'NO_VISUAL_NEEDED', visual_count: 0 },
  { id: 'onida-reining-rubio-2002', status: 'NO_VISUAL_NEEDED', visual_count: 0 },
  { id: 'runge-gross-1984', status: 'NO_VISUAL_NEEDED', visual_count: 0 },
  { id: 'marzari-vanderbilt-1997', status: 'NO_VISUAL_NEEDED', visual_count: 0 },
  { id: 'king-smith-vanderbilt-1993', status: 'NO_VISUAL_NEEDED', visual_count: 0 },
  { id: 'fu-kane-mele-2007', status: 'NO_VISUAL_NEEDED', visual_count: 0 },
];

const report = {
  generated_at: new Date().toISOString(),
  scope: {
    page_roots: ['src/pages/reading', 'src/pages/theory', 'src/reading/books/*/content'],
    page_files: pageFiles.map(relative),
    source_reading_manifests: sourceReadingFiles.map(relative),
  },
  counts: {
    REAL_PRESENT: allRealPlacements.length,
    SOURCE_CITED: sourceCitedBookLocators.length,
    TEXT_ONLY_REFERENCE: textOnlyReferences.length,
    SVG_SUBSTITUTE: svgSubstitutes.length,
    SOURCE_UNRESOLVED: unresolvedBookLocators.length,
    NO_VISUAL_NEEDED: literatureStatus.filter((entry) => entry.status === 'NO_VISUAL_NEEDED').length,
  },
  real_present: {
    unique_assets: [...new Set(allRealPlacements.map((entry) => entry.id))].sort(),
    placements: allRealPlacements,
  },
  books: {
    visual_locator_groups: bookLocators.length,
    real_visual_locator_groups: bookLocators.filter((entry) => entry.status === 'REAL_PRESENT').length,
    source_cited_locator_groups: sourceCitedBookLocators.length,
    unresolved_locator_groups: unresolvedBookLocators.length,
    by_book: Object.fromEntries([...new Set(bookLocators.map((entry) => entry.book))].sort().map((book) => [book, bookLocators.filter((entry) => entry.book === book).length])),
  },
  literature: literatureStatus,
  text_only_references: textOnlyReferences,
  content_source_references: contentSourceReferences,
  content_source_unresolved_references: unresolvedContentReferences,
  svg_substitutes: svgSubstitutes,
  source_cited: sourceCitedBookLocators,
  source_unresolved: unresolvedBookLocators,
  manifest_visual_records: visualEntries.length,
  manifest_asset_failures: failures,
};

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  console.log('SOURCE VISUAL AUDIT');
  console.log(`Scope: ${pageFiles.length} Astro content files + ${sourceReadingFiles.length} book source manifests`);
  console.log(`REAL_PRESENT: ${report.counts.REAL_PRESENT} placements / ${report.real_present.unique_assets.length} unique assets`);
  console.log(`SOURCE_CITED: ${report.counts.SOURCE_CITED} book Figure/Table locator groups`);
  console.log(`TEXT_ONLY_REFERENCE: ${report.counts.TEXT_ONLY_REFERENCE}`);
  console.log(`SVG_SUBSTITUTE: ${report.counts.SVG_SUBSTITUTE}`);
  console.log(`SOURCE_UNRESOLVED: ${report.counts.SOURCE_UNRESOLVED} book Figure/Table locator groups`);
  console.log(`CONTENT_SOURCE_UNRESOLVED: ${unresolvedContentReferences.length} book-body references`);
  console.log(`NO_VISUAL_NEEDED: ${report.counts.NO_VISUAL_NEEDED} literature guides`);
  console.log(`Book locator groups: ${JSON.stringify(report.books.by_book)}`);
  console.log(`Manifest visual records: ${report.manifest_visual_records}`);
  if (textOnlyReferences.length > 0) {
    console.log('TEXT_ONLY_REFERENCE details:');
    for (const entry of textOnlyReferences) console.log(`- ${entry.page}: ${entry.references.join('; ')}`);
  }
  if (svgSubstitutes.length > 0) {
    console.log('SVG_SUBSTITUTE details:');
    for (const entry of svgSubstitutes) console.log(`- ${entry.page}: ${entry.id}`);
  }
  if (unresolvedBookLocators.length > 0) {
    console.log('SOURCE_UNRESOLVED details:');
    for (const entry of unresolvedBookLocators) console.log(`- ${entry.book} ${entry.slug}: ${entry.locator}`);
  }
  if (failures.length > 0) {
    console.log('MANIFEST FAILURES:');
    for (const failure of failures) console.log(`- ${failure}`);
  }
}

if (
  failures.length > 0
  || textOnlyReferences.length > 0
  || svgSubstitutes.length > 0
  || unresolvedBookLocators.length > 0
  || unresolvedContentReferences.length > 0
) process.exitCode = 1;
