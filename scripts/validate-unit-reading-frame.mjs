import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { allUnits, martinUnits, practiceUnits, unitDisplayTitle } from '../src/lib/unitCatalog.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const strip = (value) => value.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const htmlForRoute = (route) => fs.readFileSync(path.join(dist, route.replace(/^\//, ''), 'index.html'), 'utf8');
const anchor = (id) => `catalog-section-${String(id).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

assert(fs.existsSync(dist), 'dist is missing; run npm run build first');
assert(martinUnits.length === 46, `expected 46 Martin units, found ${martinUnits.length}`);
assert(practiceUnits.length === 10, `expected 10 practice units, found ${practiceUnits.length}`);

for (const unit of allUnits) {
  const html = htmlForRoute(unit.route);
  assert(html.includes('data-unit-reading-frame="true"'), `unit frame marker missing: ${unit.route}`);
  assert(html.includes(`data-unit-id="${unit.unitId}"`), `unit identity marker missing: ${unit.route}`);
  assert(html.includes('data-content-layer="textbook-baseline"'), `source layer missing: ${unit.route}`);
  assert(html.includes('data-content-layer="later-literature"'), `literature bridge missing: ${unit.route}`);
  assert(html.includes('data-reading-mode="parallel"') && html.includes('data-reading-mode="focus"') && html.includes('data-reading-mode="atlas"'), `reading modes missing: ${unit.route}`);
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
  assert(h1.length === 1, `expected one H1, found ${h1.length}: ${unit.route}`);
  if (h1.length === 1) assert(strip(h1[0][1]) === unitDisplayTitle(unit), `H1/catalog mismatch: ${unit.route}`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  assert(duplicates.length === 0, `duplicate IDs in ${unit.route}: ${duplicates.join(', ')}`);
  for (const section of unit.sections) assert(ids.includes(anchor(section.id)), `source-section anchor missing in ${unit.route}: ${section.id}`);
  assert(html.includes('lang="en"'), `English language marker missing: ${unit.route}`);
}

const frameRoutes = [
  ['theory-map', '/theory/'], ['theory-map', '/theory/atlas/'], ['theory-map', '/book-map/'],
  ['lab', '/labs/scf-fixed-point-and-mixing/'],
  ...[...new Set(martinUnits.map((unit) => unit.part.slug))].map((slug) => ['part-index', `/${slug}/`]),
  ['part-index', '/practice-sholl-steckel/'],
];
for (const [type, route] of frameRoutes) assert(htmlForRoute(route).includes(`data-reading-frame="${type}"`), `reading frame type missing: ${route}`);

const htmlFiles = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name.endsWith('.html')) htmlFiles.push(absolute);
  }
};
walk(dist);
const basePath = '/Electronic-Structure-Learning/';
const routeForFile = (file) => {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  if (relative === 'index.html') return basePath;
  return `${basePath}${relative.replace(/index\.html$/, '')}`;
};
const outputForPathname = (pathname) => {
  const relative = pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname.replace(/^\//, '');
  if (!relative) return path.join(dist, 'index.html');
  if (path.extname(relative)) return path.join(dist, relative);
  return path.join(dist, relative.endsWith('/') ? relative : `${relative}/`, 'index.html');
};
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const route = routeForFile(file);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert(new Set(ids).size === ids.length, `duplicate IDs in built HTML: ${path.relative(dist, file)}`);
  assert(!html.includes('/home/talos/') && !html.includes('/Users/'), `local absolute path in built HTML: ${path.relative(dist, file)}`);
  assert(!/<(?:script|img|source)[^>]+(?:src|href)="https?:/i.test(html), `unexpected external asset in built HTML: ${path.relative(dist, file)}`);
  assert(!/href="[^"]+\.pdf(?:[?#][^"]*)?"/i.test(html), `PDF link in built HTML: ${path.relative(dist, file)}`);
  if (!file.endsWith(`${path.sep}404.html`)) {
    const h1Count = (html.match(/<h1\b/g) ?? []).length;
    assert(h1Count === 1, `expected one H1 in built HTML, found ${h1Count}: ${path.relative(dist, file)}`);
  }
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/g)].map((match) => Number(match[1]));
  for (let index = 1; index < headings.length; index += 1) {
    assert(headings[index] <= headings[index - 1] + 1, `heading level skips H${headings[index - 1]} to H${headings[index]}: ${path.relative(dist, file)}`);
  }
  for (const match of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (/^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    const resolved = new URL(href, `https://example.invalid${route}`);
    if (!resolved.pathname.startsWith(basePath)) {
      assert(false, `local link escapes Pages base (${href}): ${path.relative(dist, file)}`);
      continue;
    }
    const targetFile = outputForPathname(resolved.pathname);
    assert(fs.existsSync(targetFile), `broken local link (${href}): ${path.relative(dist, file)}`);
    if (resolved.hash && resolved.hash !== '#_top' && fs.existsSync(targetFile)) {
      const targetHtml = fs.readFileSync(targetFile, 'utf8');
      const targetId = decodeURIComponent(resolved.hash.slice(1));
      assert(new RegExp(`\\sid=["']${targetId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`).test(targetHtml), `missing local anchor (${href}): ${path.relative(dist, file)}`);
    }
  }
}

if (failures.length) {
  console.error(`Unit reading-frame validation failed with ${failures.length} issue(s):`);
  failures.slice(0, 100).forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Unit reading-frame validation passed: ${martinUnits.length} Martin, ${practiceUnits.length} practice, ${htmlFiles.length} built HTML pages.`);
