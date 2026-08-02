import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import inventoryRules, { inventoryDispositions, inventorySnapshot } from '../src/data/atlas/migration/inventory.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const repositoryFiles = execFileSync('git', ['ls-files', '-co', '--exclude-standard'], {
  cwd: root,
  encoding: 'utf8',
}).trim().split('\n').filter(Boolean);
const inventoryFiles = repositoryFiles.filter((relativePath) =>
  inventorySnapshot.explicitFiles.includes(relativePath)
  || inventorySnapshot.scopeRoots.some((scopeRoot) => relativePath.startsWith(`${scopeRoot}/`)),
).sort();

assert(/^[0-9a-f]{40}$/.test(inventorySnapshot.baselineSha), 'inventory baseline must be an exact commit SHA');
assert(new Set(inventoryRules.map((item) => item.id)).size === inventoryRules.length, 'inventory rule IDs must be unique');

for (const item of inventoryRules) {
  assert(inventoryDispositions.includes(item.disposition), `invalid disposition: ${item.id}`);
  for (const field of ['kind', 'role', 'target', 'basis']) {
    assert(Boolean(item[field]), `${item.id} lacks ${field}`);
  }
  assert(Array.isArray(item.consumers) && item.consumers.length > 0, `${item.id} lacks consumers`);
  assert(Array.isArray(item.prerequisites) && item.prerequisites.length > 0, `${item.id} lacks prerequisites`);
  try { new RegExp(item.pattern); } catch { assert(false, `invalid pattern: ${item.id}`); }
  if (item.disposition === 'REMOVE_CANDIDATE') {
    const joined = item.prerequisites.join(' ');
    for (const gate of ['引用清单', '重定向', '兼容期', 'validator', 'Pages', '用户明确授权']) {
      assert(joined.includes(gate), `${item.id} removal prerequisites omit ${gate}`);
    }
  }
}

const assignments = new Map();
for (const relativePath of inventoryFiles) {
  const matches = inventoryRules.filter((item) => new RegExp(item.pattern).test(relativePath));
  assert(matches.length === 1, `${relativePath} must match exactly one inventory rule; matched ${matches.map((item) => item.id).join(', ') || 'none'}`);
  if (matches.length === 1) assignments.set(relativePath, matches[0]);
}

const docsRoot = path.join(root, 'src/content/docs');
const routeForSource = (relativePath) => {
  const contentRelative = path.posix.relative('src/content/docs', relativePath).replace(/\.mdx?$/, '');
  if (contentRelative === 'index') return '/';
  return `/${contentRelative.replace(/\/index$/, '')}/`;
};
const routeFiles = inventoryFiles.filter((item) => /^src\/content\/docs\/.+\.mdx?$/.test(item));
for (const relativePath of routeFiles) {
  const route = routeForSource(relativePath);
  const routePath = route === '/' ? 'index.mdx' : route.slice(1, -1);
  assert(
    fs.existsSync(path.join(docsRoot, routePath)) || fs.existsSync(path.join(docsRoot, `${routePath}.mdx`)) || fs.existsSync(path.join(docsRoot, routePath, 'index.mdx')),
    `route source cannot resolve: ${relativePath} -> ${route}`,
  );
  assert(assignments.get(relativePath)?.stablePublicUrl.startsWith('yes:'), `public route lacks stable-URL declaration: ${relativePath}`);
}

const inventoryDoc = fs.readFileSync(path.join(root, 'docs/atlas-v3-inventory.md'), 'utf8');
for (const item of inventoryRules) assert(inventoryDoc.includes(`\`${item.id}\``), `inventory doc omits rule ${item.id}`);
for (const heading of ['当前路径', '当前职责', '消费者', '稳定公开 URL', '验证', 'Atlas v3 目标', '分类', '判断依据', '前置条件']) {
  assert(inventoryDoc.includes(heading), `inventory doc omits required field heading: ${heading}`);
}

const countsByKind = Object.fromEntries([...new Set(inventoryRules.map((item) => item.kind))]
  .map((kind) => [kind, [...assignments.values()].filter((item) => item.kind === kind).length]));
const countsByDisposition = Object.fromEntries(inventoryDispositions
  .map((disposition) => [disposition, [...assignments.values()].filter((item) => item.disposition === disposition).length]));

if (failures.length) {
  console.error(`Atlas v3 inventory validation failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  baselineSha: inventorySnapshot.baselineSha,
  coveredFiles: inventoryFiles.length,
  publicRoutes: routeFiles.length,
  countsByKind,
  countsByDisposition,
}, null, 2));
console.log('Atlas v3 inventory validation passed: every in-scope object matched exactly one documented rule.');
