import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pagesRoot = path.join(root, 'src/pages/reading/literature');
const dynamicRoute = path.join(pagesRoot, '[topic]/[paper].astro');
const routeSource = fs.readFileSync(dynamicRoute, 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src/reading/literature-library.json'), 'utf8'));
const published = manifest.papers.filter((paper) => paper.status === 'published');

const dedicatedPages = fs.readdirSync(pagesRoot, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name === 'index.astro')
  .map((entry) => path.join(entry.parentPath, entry.name))
  .filter((file) => !new Set([
    path.join(pagesRoot, 'index.astro'),
    path.join(pagesRoot, 'concepts/index.astro'),
    path.join(pagesRoot, 'synthesis/index.astro'),
  ]).has(file));

assert.equal(dedicatedPages.length, 0, `dedicated paper pages are forbidden: ${dedicatedPages.map((file) => path.relative(root, file)).join(', ')}`);
assert(!published.some((paper) => routeSource.includes(`'${paper.paper_id}'`) || routeSource.includes(`\"${paper.paper_id}\"`)), 'dynamic route hard-codes a published paper ID');
assert(routeSource.includes('LiteratureReaderPage'), 'dynamic route must render the unified LiteratureReaderPage component');
assert(!routeSource.includes('.filter('), 'all published papers must be emitted without route exceptions');
assert(routeSource.includes('readingAnalysisUrl'), 'optional curated analysis must be passed as data');
assert(routeSource.includes('Open PDF') || fs.existsSync(path.join(root, 'src/layouts/LiteratureReaderPage.astro')), 'unified Reader must use the Open PDF label');
assert(fs.existsSync(path.join(root, 'src/scripts/literature-reader.ts')), 'the single literature-reader bootstrap is missing');
assert(!fs.existsSync(path.join(root, 'src/scripts/paper-reader.ts')), 'legacy paper-reader bootstrap still exists');
assert(!fs.existsSync(path.join(root, 'src/scripts/pre-reading-reader.ts')), 'legacy pre-reading bootstrap still exists');
console.log(`Unified Literature Reader structural audit passed for ${published.length} published papers.`);
