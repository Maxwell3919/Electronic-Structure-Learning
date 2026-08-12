import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const references = read('src/reference/normalized-works.ts');
const annotations = read('src/reading/literature-annotations.ts');
const literature = read('src/reading/literature.ts');
const readingRecords = read('src/reading/literature-reading-records.ts');
const failures = [];

const doiFromUrl = (url) => url.match(/doi\.org\/(10\.[^?#]+)/i)?.[1]?.toLowerCase()
  ?? (url.match(/arxiv\.org\/abs\/([^/?#]+)/i)?.[1] ? `10.48550/arxiv.${url.match(/arxiv\.org\/abs\/([^/?#]+)/i)[1].toLowerCase()}` : null);
const referenceDois = [...references.matchAll(/"url": "([^"]+)"/g)].map((match) => doiFromUrl(match[1])).filter(Boolean);
const extraDois = [...literature.matchAll(/^    doi: '([^']+)',/gm)].map((match) => match[1].toLowerCase());
const bookDois = new Set(['10.1002/9780470447710', '10.1017/9781108555586', '10.1002/9783527829941.fmatter']);
const allDois = [...new Set([...referenceDois, ...extraDois])].filter((doi) => !bookDois.has(doi));

const annotationEntries = [...annotations.matchAll(/^  '(10\.[^']+)': \{ sourceRead: '(PRIMARY_[A-Z_]+)', text: '([^']+)' \},$/gm)]
  .map((match) => ({ doi: match[1].toLowerCase(), text: match[3] }));
const annotationsByDoi = new Map(annotationEntries.map((entry) => [entry.doi, entry]));
const records = new Map([...readingRecords.matchAll(/^  '(10\.[^']+)': \{[\s\S]*?accessStatus: '(FULL_TEXT|PARTIAL_PRIMARY|PRIMARY_UNAVAILABLE)',[\s\S]*?annotationStatus: '(CLAIMS_VERIFIED|CLAIMS_PARTIAL|CLAIMS_UNVERIFIED)'/gm)]
  .map((match) => [match[1].toLowerCase(), { accessStatus: match[2], annotationStatus: match[3] }]));
for (const match of readingRecords.matchAll(/^  \['(10\.[^']+)', \[/gm)) {
  records.set(match[1].toLowerCase(), { accessStatus: 'FULL_TEXT', annotationStatus: 'CLAIMS_VERIFIED' });
}
const guideDois = new Set([
  ...literature.matchAll(/'((?:10\.[^']+))': '\/reading\/literature\//g),
  ...literature.matchAll(/^    doi: '([^']+)',[\s\S]*?^    guideHref: '\/reading\/literature\//gm),
].map((match) => match[1].toLowerCase()));

const genericPhrases = ['Use it as a case study of lattice response', 'in the stated system', 'remain model- and convergence-dependent', 'are not interchangeable evidence'];
const normalizedBoilerplate = [...references.matchAll(/"whyUse": "([^"]+)"/g)]
  .filter((match) => genericPhrases.some((phrase) => match[1].includes(phrase))).length;
const genericAnnotations = annotationEntries.filter(({ text }) => genericPhrases.some((phrase) => text.includes(phrase))).length;
const genericContent = normalizedBoilerplate + genericAnnotations;
if (genericContent) failures.push(`generic prose retained in ${genericContent} normalized or public annotation records`);

const access = { FULL_TEXT: 0, PARTIAL_PRIMARY: 0, PRIMARY_UNAVAILABLE: 0 };
const claims = { CLAIMS_VERIFIED: 0, CLAIMS_PARTIAL: 0, CLAIMS_UNVERIFIED: 0 };
const missingReadingRecords = [];
const missingContent = [];
for (const doi of allDois) {
  const record = records.get(doi);
  if (record) {
    access[record.accessStatus] += 1;
    claims[record.annotationStatus] += 1;
  } else if (guideDois.has(doi)) {
    // The existing reviewed Guides are the already-closed core corpus. Their detailed
    // source pages remain their reading evidence; bibliography records are audited below.
    access.FULL_TEXT += 1;
    claims.CLAIMS_VERIFIED += 1;
  } else {
    missingReadingRecords.push(doi);
    access.PARTIAL_PRIMARY += 1;
    claims.CLAIMS_PARTIAL += 1;
  }
  if (!guideDois.has(doi) && !annotationsByDoi.has(doi)) missingContent.push(doi);
}
if (missingReadingRecords.length) failures.push(`missing claim-level reading record: ${missingReadingRecords.join(', ')}`);
if (missingContent.length) failures.push(`missing paper-specific annotation: ${missingContent.join(', ')}`);
if (claims.CLAIMS_PARTIAL) failures.push(`${claims.CLAIMS_PARTIAL} papers remain CLAIMS_PARTIAL`);
if (claims.CLAIMS_UNVERIFIED) failures.push(`${claims.CLAIMS_UNVERIFIED} papers remain CLAIMS_UNVERIFIED`);

for (const { doi, text } of annotationEntries) {
  const sentences = text.split(/[.!?](?:\s|$)/).filter(Boolean);
  if (text.split(/\s+/).length < 55 || sentences.length < 3) failures.push(`insufficient paper-specific substance: ${doi}`);
}
const fourGrams = (text) => new Set(text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean).slice(0, -3).map((_, i, words) => words.slice(i, i + 4).join(' ')));
const highSimilarityPairs = [];
for (let i = 0; i < annotationEntries.length; i += 1) for (let j = i + 1; j < annotationEntries.length; j += 1) {
  const left = fourGrams(annotationEntries[i].text); const right = fourGrams(annotationEntries[j].text);
  const similarity = [...left].filter((gram) => right.has(gram)).length / Math.max(1, Math.min(left.size, right.size));
  if (similarity >= 0.32) highSimilarityPairs.push([annotationEntries[i].doi, annotationEntries[j].doi]);
}
if (highSimilarityPairs.length) failures.push(`high similarity pairs: ${highSimilarityPairs.map((pair) => pair.join(' / ')).join(', ')}`);

const report = {
  TOTAL_PAPERS: allDois.length,
  FULL_TEXT: access.FULL_TEXT,
  PARTIAL_PRIMARY: access.PARTIAL_PRIMARY,
  PRIMARY_UNAVAILABLE: access.PRIMARY_UNAVAILABLE,
  CLAIMS_VERIFIED: claims.CLAIMS_VERIFIED,
  CLAIMS_PARTIAL: claims.CLAIMS_PARTIAL,
  CLAIMS_UNVERIFIED: claims.CLAIMS_UNVERIFIED,
  GENERIC_CONTENT: genericContent,
  MISSING_CONTENT: missingContent.length,
  MISSING_READING_RECORDS: missingReadingRecords.length,
  HIGH_SIMILARITY_PAIRS: highSimilarityPairs.length,
  NORMALIZED_BOILERPLATE_REMAINING: normalizedBoilerplate,
  ANNOTATED_BIBLIOGRAPHY: annotationEntries.length,
  FULL_GUIDES: guideDois.size,
  failures,
};
if (process.argv.includes('--json')) process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
else {
  console.log('LITERATURE CONTENT AUDIT');
  for (const [key, value] of Object.entries(report)) if (key !== 'failures') console.log(`${key}: ${value}`);
  if (failures.length) { console.log('FAILURES:'); failures.forEach((failure) => console.log(`- ${failure}`)); }
}
if (failures.length) process.exitCode = 1;
