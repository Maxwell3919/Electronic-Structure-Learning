import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));
const read = (path) => readFileSync(join(repositoryRoot, path), 'utf8');

const canonicalStatuses = new Set(['outline', 'draft', 'review', 'validated']);
const acceptedDeclarations = new Set([...canonicalStatuses, 'chapter-complete']);
const part01Directory = 'src/content/docs/part-01-overview-and-background';
const chapterRoutes = [
  ['chapter-01-introduction.mdx', 'validated', 'printed pages 1–14', 'sections 1.1–1.8'],
  ['chapter-02-overview.mdx', 'review', 'printed pages 15–59', 'sections 2.1–2.17'],
  ['chapter-03-theoretical-background.mdx', 'review', 'printed pages 60–80', 'sections 3.1–3.7'],
  ['chapter-04-periodic-solids-and-electron-bands.mdx', 'review', 'printed pages 81–108', 'sections 4.1–4.7'],
  ['chapter-05-uniform-electron-gas-and-sp-bonded-metals.mdx', 'review', 'printed pages 109–126', 'sections 5.1–5.5'],
];

const sourceNote = read('src/components/SourceNote.astro');
for (const status of canonicalStatuses) {
  assert.ok(sourceNote.includes(`'${status}'`), `SourceNote must declare ${status}`);
}
assert.ok(
  sourceNote.includes("'chapter-complete': 'validated'"),
  'SourceNote must normalize the legacy chapter-complete declaration to validated',
);
assert.match(sourceNote, /Invalid SourceNote status/);
assert.match(sourceNote, /来源定位 \/ Source locator/);
assert.match(sourceNote, /页面状态 \/ Page status/);

for (const [fileName, expectedStatus, pageLocator, sectionLocator] of chapterRoutes) {
  const route = read(`${part01Directory}/${fileName}`);
  const statusMatch = route.match(/<SourceNote[\s\S]*?status="([^"]+)"[\s\S]*?\/>/);
  assert.ok(statusMatch, `${fileName} must declare one SourceNote status`);
  assert.ok(canonicalStatuses.has(statusMatch[1]), `${fileName} uses noncanonical SourceNote status ${statusMatch[1]}`);
  assert.equal(statusMatch[1], expectedStatus, `${fileName} status drift`);
  assert.ok(route.includes(pageLocator), `${fileName} must retain ${pageLocator}`);
  assert.ok(route.includes(sectionLocator), `${fileName} must retain ${sectionLocator}`);
}

const walk = (directory) => {
  const entries = [];
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) entries.push(...walk(path));
    else if (path.endsWith('.mdx') || path.endsWith('.astro')) entries.push(path);
  }
  return entries;
};

for (const filePath of walk(join(repositoryRoot, 'src'))) {
  const content = readFileSync(filePath, 'utf8');
  const matches = content.matchAll(/<SourceNote[\s\S]*?status="([^"]+)"[\s\S]*?\/>/g);
  for (const match of matches) {
    const path = relative(repositoryRoot, filePath);
    assert.ok(acceptedDeclarations.has(match[1]), `${path} uses unsupported SourceNote status ${match[1]}`);
  }
}

const partIndex = read(`${part01Directory}/index.mdx`);
const expectedLinks = chapterRoutes.map(([fileName]) => `./${fileName.replace(/\.mdx$/, '')}/`);
for (const link of expectedLinks) {
  assert.ok(partIndex.includes(`href="${link}"`), `Part I synthesis must link ${link}`);
}
assert.ok(partIndex.includes('All five chapters of Part I are complete.'));
assert.ok(partIndex.includes('Chapter 6'));
assert.ok(partIndex.includes('Part II'));
assert.ok(!partIndex.includes('chapter-complete'), 'Part I synthesis must not use the legacy status');

console.log('Part I closure validation passed: canonical Part I statuses, legacy-alias normalization, source locators, five chapter links, bilingual accessibility labels, and the Part II handoff are consistent.');
