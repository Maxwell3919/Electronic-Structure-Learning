import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import registry from '../src/data/literature/registry.mjs';
import topics from '../src/data/literature/topics.mjs';
import queue from '../src/data/literature/readingQueue.mjs';
import claims from '../src/data/literature/claimLedger.mjs';
import discussions from '../src/data/literature/discussions.mjs';
import { readingStatuses, evidenceRoles, currentAssessments } from '../src/data/literature/schema.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const routes = ['literature', 'literature/topics', 'literature/reading-queue', 'literature/claims', 'literature/discussions'];
for (const route of routes) assert(fs.existsSync(path.join(root, 'src/content/docs', route, 'index.mdx')), `literature route missing: ${route}`);
assert(registry.length === 0 && topics.length === 0 && queue.length === 0 && claims.length === 0 && discussions.length === 0, 'literature infrastructure must begin with empty data');
assert(readingStatuses.length === 6, 'reading-status enum drift');
assert(evidenceRoles.length === 9, 'evidence-role enum drift');
assert(currentAssessments.length === 6 && currentAssessments.includes('not-assessed'), 'claim assessment enum drift');

const components = [
  'LiteratureEntry', 'LiteratureLayer', 'ReadingStatusBadge', 'TopicReadingMap',
  'ClaimLedgerEntry', 'SourceComparison', 'LiteratureUpdate', 'OpenQuestion', 'DiscussionPrompt',
];
for (const name of components) assert(fs.existsSync(path.join(root, `src/components/literature/${name}.astro`)), `literature component missing: ${name}`);
for (const route of routes) {
  const source = fs.readFileSync(path.join(root, 'src/content/docs', route, 'index.mdx'), 'utf8');
  assert(!/\.pdf\b/i.test(source), `PDF link entered literature route: ${route}`);
  assert(source.length < 4_000, `literature route contains long placeholder content: ${route}`);
}
const layer = fs.readFileSync(path.join(root, 'src/components/literature/LiteratureLayer.astro'), 'utf8');
assert(layer.includes('entries.length > 0'), 'empty literature registry would render full entries');

if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('Literature-layer validation passed: five routes, nine components, empty registries, and bounded evidence enums.');
