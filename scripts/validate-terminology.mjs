import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import terminology from '../src/data/site/terminology.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const required = [
  'hamiltonian', 'operator', 'observable', 'eigenvalue', 'state', 'wavefunction', 'orbital',
  'density', 'charge-density', 'pseudo-density', 'spin-density', 'density-matrix',
  'effective-potential', 'external-potential', 'coulomb-interaction', 'exchange', 'correlation',
  'basis', 'representation', 'discretization', 'self-consistency', 'residual', 'convergence',
  'response-function', 'excitation', 'quasiparticle', 'phonon', 'electron-phonon-coupling',
  'wannier-function', 'berry-phase', 'topological-invariant',
];

assert(new Set(terminology.map((item) => item.id)).size === terminology.length, 'terminology IDs must be unique');
for (const id of required) assert(terminology.some((item) => item.id === id), `required term missing: ${id}`);
for (const item of terminology) {
  assert(Boolean(item.termEn && item.termZh && item.preferredUsage), `incomplete terminology record: ${item.id}`);
}
const route = path.join(root, 'src/content/docs/reference/terminology-and-symbols.mdx');
assert(fs.existsSync(route), 'terminology route is missing');
const routeSource = fs.readFileSync(route, 'utf8');
assert(routeSource.includes('不通过全局字符串替换'), 'terminology page lacks the no-global-replacement boundary');

if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Terminology validation passed: ${terminology.length} scoped records; no global replacement contract.`);
