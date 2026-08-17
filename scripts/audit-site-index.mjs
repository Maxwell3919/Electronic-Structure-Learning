import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const built = process.argv.includes('--built');
const layout = fs.readFileSync(path.join(root, 'src/layouts/BaseLayout.astro'), 'utf8');
const indexSource = fs.readFileSync(path.join(root, 'src/pages/index/index.astro'), 'utf8');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const primaryBlock = layout.match(/const navigation = \[([\s\S]*?)\] as const;/)?.[1] ?? '';
for (const label of ['Core', 'Foundations', 'Reading', 'Methods']) assert(primaryBlock.includes(`label: '${label}'`), `primary navigation lacks ${label}`);
for (const label of ['Computational Tools', 'Reference']) assert(!primaryBlock.includes(`label: '${label}'`), `${label} remains in primary navigation`);
assert(layout.includes("href('/index/')") && layout.includes("href('/reference/')"), 'supporting navigation lacks Index or Reference');
assert(!indexSource.includes('<script'), 'Atlas Index must have zero client JavaScript');

if (built) {
  const html = fs.readFileSync(path.join(root, 'dist/index/index.html'), 'utf8');
  const sitemap = fs.readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8');
  const routes = [...sitemap.matchAll(/<loc>[^<]+\/Electronic-Structure-Learning(\/[^<]*)<\/loc>/g)].map((match) => match[1]);
  const intentionallyUnlisted = new Set(['/', '/index/', '/reading/martin/']);
  for (const route of routes.filter((entry) => !intentionallyUnlisted.has(entry))) {
    assert(html.includes(`href="/Electronic-Structure-Learning${route}"`), `Atlas Index lacks public route ${route}`);
  }
  assert(routes.includes('/index/'), 'sitemap lacks Atlas Index');
}

if (failures.length) { failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log(`Atlas information architecture and ${built ? 'built route coverage' : 'source'} index audit passed.`);
