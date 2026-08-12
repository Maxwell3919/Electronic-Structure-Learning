import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const failures = [];

const normalized = read('src/reference/normalized-works.ts');
const literature = read('src/reading/literature.ts');
const publication = read('src/reading/literature-publication.ts');
const annotations = read('src/reading/literature-annotations.ts');
const groupPattern = /\{\n    "title": "([^"]+)",\n    "entries": \[\n([\s\S]*?)\n    \]\n  \}/g;
const topicForGroup = {
  'Foundational papers': 'Foundations of electronic structure',
  'Major reviews': 'Reviews and field maps',
  'Electronic-structure methods': 'Electronic-structure methods',
  'Response, phonons, and EPC': 'Response, phonons, and electron–phonon coupling',
  'Many-body, GW, and BSE': 'Many-body and excitations',
  'Wannier, Berry, and topology': 'Wannier, Berry, and topology',
  'Materials and application case studies': 'Applications and representative systems',
};
const doiFromUrl = (url) => {
  const doi = url.match(/doi\.org\/(10\.[^"?#]+)/i)?.[1];
  if (doi) return doi.toLowerCase();
  const arxiv = url.match(/arxiv\.org\/abs\/([^/?#]+)/i)?.[1];
  return arxiv ? `10.48550/arxiv.${arxiv.toLowerCase()}` : null;
};

const baseRecords = [];
for (const match of normalized.matchAll(groupPattern)) {
  const [, group, body] = match;
  if (group === 'Books and monographs') continue;
  for (const urlMatch of body.matchAll(/"url": "([^"]+)"/g)) {
    const doi = doiFromUrl(urlMatch[1]);
    if (doi) baseRecords.push({ doi, topic: topicForGroup[group] ?? group });
  }
}

const extraStart = literature.indexOf('const extraLiterature');
const extraEnd = literature.indexOf('const baseLiterature');
const extraSource = literature.slice(extraStart, extraEnd);
const extraRecords = [...extraSource.matchAll(/^    id: '([^']+)',[\s\S]*?^    doi: '([^']+)',[\s\S]*?^    topic: '([^']+)',/gm)].map((match) => ({ id: match[1], doi: match[2].toLowerCase(), topic: match[3] }));
const allDois = [...baseRecords.map((record) => record.doi), ...extraRecords.map((record) => record.doi)];
const uniqueDois = [...new Set(allDois)];
const publicationKeys = [...publication.matchAll(/^  "(10\.[^"]+)":/gm)].map((match) => match[1].toLowerCase());
const missingMetadata = uniqueDois.filter((doi) => !publicationKeys.includes(doi));
const duplicateDois = allDois.filter((doi, index) => allDois.indexOf(doi) !== index);

const genericBibliographyPhrases = [
  'Use it as a case study of lattice response',
  'Use it for the reported computational method, approximation, or design strategy',
  'Use it for a concrete symmetry, Wannier, Berry, or topological analysis',
  'Use it as a bounded material or interface case study',
  'remain model- and convergence-dependent',
  'are not interchangeable evidence',
];
const legacyBibliographyProse = genericBibliographyPhrases.reduce((total, phrase) => total + (normalized.split(phrase).length - 1), 0);
const publicAnnotationEntries = [...annotations.matchAll(/^  '(10\.[^']+)': \{ sourceRead: '[^']+', text: '([^']+)' \},$/gm)]
  .map((match) => ({ doi: match[1].toLowerCase(), text: match[2] }));
const duplicateAnnotations = publicAnnotationEntries.filter((entry, index, entries) => entries.findIndex((candidate) => candidate.text === entry.text) !== index);
const normalizedEntries = [...normalized.matchAll(/"whyUse": "([^"]*)",\n\s+"boundary": "([^"]*)"/g)];
const duplicateNonempty = (values) => values.filter((value, index) => values.indexOf(value) !== index);
const duplicateWhyUse = [...new Set(duplicateNonempty(normalizedEntries.map((match) => match[1]).filter(Boolean)))];
const duplicateBoundary = [...new Set(duplicateNonempty(normalizedEntries.map((match) => match[2]).filter(Boolean)))];
const sourceFiles = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const entryPath = path.join(directory, entry.name);
  if (entry.isDirectory()) return sourceFiles(entryPath);
  return /\.(?:astro|ts|tsx|js|mjs)$/.test(entry.name) ? [fs.readFileSync(entryPath, 'utf8')] : [];
});
const publicSource = sourceFiles(path.join(root, 'src')).join('\n');
const privateReadingLeaks = [
  /\bP-[0-9a-f]{12}\b/i,
  /NEWT-DATA/i,
  /Research-Workflow-Records/i,
  /(?:^|\/)literature\/mineru\//i,
  /(?:^|\/)assets\/mineru\//i,
].filter((pattern) => pattern.test(publicSource)).map((pattern) => pattern.toString());

const literatureDirectory = path.join(root, 'src/pages/reading/literature');
const guideFiles = fs.readdirSync(literatureDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(literatureDirectory, entry.name, 'index.astro')))
  .map((entry) => entry.name)
  .sort();
const coreGuideIds = [
  'hohenberg-kohn-1964', 'kohn-sham-1965', 'levy-1979', 'hedin-1965', 'lieb-1983',
  'onida-reining-rubio-2002', 'ceperley-alder-1980', 'perdew-zunger-1981',
  'perdew-burke-ernzerhof-1996', 'vanderbilt-1990', 'blochl-1994', 'baroni-2001',
  'runge-gross-1984', 'marzari-vanderbilt-1997', 'king-smith-vanderbilt-1993',
  'fu-kane-mele-2007', 'zhong-vanderbilt-rabe-1995',
];
const coreWithoutGuide = coreGuideIds.filter((id) => !guideFiles.includes(id));
const visualGuideIds = ['hohenberg-kohn-1964', 'hedin-1965', 'zhong-vanderbilt-rabe-1995'];
const unresolvedVisualGuideIds = [];
const topicGuideIds = {
  'Foundations of electronic structure': ['hohenberg-kohn-1964', 'kohn-sham-1965', 'levy-1979', 'lieb-1983'],
  'Exchange and correlation': ['ceperley-alder-1980', 'perdew-zunger-1981', 'perdew-burke-ernzerhof-1996'],
  'Electronic-structure methods': ['vanderbilt-1990', 'blochl-1994'],
  'Response, phonons, and electron–phonon coupling': ['baroni-2001'],
  'Many-body and excitations': ['hedin-1965', 'onida-reining-rubio-2002', 'runge-gross-1984'],
  'Wannier, Berry, and topology': ['marzari-vanderbilt-1997', 'king-smith-vanderbilt-1993', 'fu-kane-mele-2007'],
  'Applications and representative systems': ['zhong-vanderbilt-rabe-1995'],
};
for (const [topic, ids] of Object.entries(topicGuideIds)) {
  for (const id of ids) if (!guideFiles.includes(id)) failures.push(`${topic}: missing guide route ${id}`);
}
if (baseRecords.length !== 69) failures.push(`expected 69 paper-like records from normalized groups, found ${baseRecords.length}`);
if (extraRecords.length !== 12) failures.push(`expected 12 explicit literature records, found ${extraRecords.length}`);
if (guideFiles.length !== coreGuideIds.length) failures.push(`expected ${coreGuideIds.length} guide routes, found ${guideFiles.length}`);
if (missingMetadata.length > 0) failures.push(`missing publication metadata: ${missingMetadata.join(', ')}`);
if (duplicateDois.length > 0) failures.push(`duplicate DOI records: ${[...new Set(duplicateDois)].join(', ')}`);
if (legacyBibliographyProse > 0) failures.push(`legacy bibliography prose retained: ${legacyBibliographyProse}`);
if (duplicateAnnotations.length > 0) failures.push(`duplicate paper-specific annotations: ${duplicateAnnotations.map((entry) => entry.doi).join(', ')}`);
if (duplicateWhyUse.length > 0) failures.push(`duplicate nonempty paper-specific whyUse: ${duplicateWhyUse.join(' | ')}`);
if (duplicateBoundary.length > 0) failures.push(`duplicate nonempty paper-specific boundary: ${duplicateBoundary.join(' | ')}`);
if (privateReadingLeaks.length > 0) failures.push(`private reading identifiers leaked into public source: ${privateReadingLeaks.join(', ')}`);

const report = {
  generated_at: new Date().toISOString(),
  TOTAL_PAPER_REFERENCES: uniqueDois.length,
  LITERATURE_GUIDES: guideFiles.length,
  BIBLIOGRAPHY_ONLY: uniqueDois.length - guideFiles.length,
  CORE_WITHOUT_GUIDE: coreWithoutGuide.length,
  UNRESOLVED_METADATA: missingMetadata.length,
  DUPLICATE_REFERENCES: new Set(duplicateDois).size,
  GUIDES_WITH_SOURCE_VISUAL: visualGuideIds.length,
  GUIDES_NO_VISUAL_NEEDED: guideFiles.length - visualGuideIds.length - unresolvedVisualGuideIds.length,
  UNRESOLVED_VISUALS: unresolvedVisualGuideIds.length,
  TOPIC_GUIDE_COUNTS: Object.fromEntries(Object.entries(topicGuideIds).map(([topic, ids]) => [topic, ids.length])),
  BASE_NORMALIZED_PAPER_REFERENCES: baseRecords.length,
  EXPLICIT_CORE_RECORDS: extraRecords.length,
  LEGACY_BIBLIOGRAPHY_PROSE: legacyBibliographyProse,
  DUPLICATE_PAPER_SPECIFIC_ANNOTATIONS: duplicateAnnotations.length,
  DUPLICATE_PAPER_SPECIFIC_WHY_USE: duplicateWhyUse.length,
  DUPLICATE_PAPER_SPECIFIC_BOUNDARY: duplicateBoundary.length,
  PRIVATE_READING_LEAKS: privateReadingLeaks.length,
  guide_routes: guideFiles,
  failures,
};

if (process.argv.includes('--json')) process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
else {
  console.log('LITERATURE AUDIT');
  for (const key of ['TOTAL_PAPER_REFERENCES', 'LITERATURE_GUIDES', 'BIBLIOGRAPHY_ONLY', 'CORE_WITHOUT_GUIDE', 'UNRESOLVED_METADATA', 'DUPLICATE_REFERENCES', 'GUIDES_WITH_SOURCE_VISUAL', 'GUIDES_NO_VISUAL_NEEDED', 'UNRESOLVED_VISUALS']) console.log(`${key}: ${report[key]}`);
  console.log('TOPIC_GUIDE_COUNTS:');
  for (const [topic, count] of Object.entries(report.TOPIC_GUIDE_COUNTS)) console.log(`- ${topic}: ${count}`);
  if (failures.length > 0) { console.log('FAILURES:'); for (const failure of failures) console.log(`- ${failure}`); }
}
if (failures.length > 0) process.exitCode = 1;
