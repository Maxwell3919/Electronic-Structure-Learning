#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const built = process.argv.includes('--built');
const map = JSON.parse(fs.readFileSync(path.join(root, 'src/reading/literature-concept-map.json'), 'utf8'));
const ownership = JSON.parse(fs.readFileSync(path.join(root, 'src/research/concept-ownership.json'), 'utf8'));
const statuses = ['adequate', 'too_shallow', 'duplicated', 'misplaced', 'missing'];
const ids = map.concepts.map((concept) => concept.id).sort();
const reviewed = statuses.flatMap((status) => ownership.coverage_review[status] ?? []).sort();

assert.equal(ownership.schema_version, 1);
assert.deepEqual(reviewed, ids, 'every normalized concept must have exactly one coverage classification');
assert.equal(new Set(reviewed).size, reviewed.length, 'concept appears in more than one coverage classification');

const prefixes = Object.entries(ownership.owner_route_prefixes);
for (const concept of map.concepts) {
  const owners = prefixes.filter(([, routes]) => routes.some((route) => concept.canonical_route.startsWith(route)));
  assert.equal(owners.length, 1, `${concept.id} must have exactly one canonical owner`);
  const [route, fragment] = concept.canonical_route.split('#');
  if (built) {
    const output = path.join(root, 'dist', route.replace(/^\//, ''), 'index.html');
    assert(fs.existsSync(output), `missing canonical route for ${concept.id}: ${route}`);
    if (fragment) assert(fs.readFileSync(output, 'utf8').includes(`id="${fragment}"`), `missing canonical fragment for ${concept.id}: ${fragment}`);
  }
}

for (const id of ownership.precision_anchor_concepts) {
  const concept = map.concepts.find((entry) => entry.id === id);
  assert(concept?.canonical_route.includes('#'), `${id} must link to its precise primary explanation`);
}

const counts = Object.fromEntries(statuses.map((status) => [status, ownership.coverage_review[status].length]));
console.log(`Concept ownership audit passed: ${ids.length} concepts, ${counts.adequate} adequate, ${counts.too_shallow} too shallow, ${counts.duplicated} duplicated, ${counts.misplaced} misplaced, ${counts.missing} missing.`);
