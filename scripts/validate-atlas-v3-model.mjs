import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  theoryDomains, electronicStructureTopics, learningMapNodes, learningMapEdges,
  methodCategories, methodPageContract, computationalToolCategories, computationalTools,
  toolKinds, commandEvidenceContract, referenceResources, referenceResourceTypes,
  martinMappings, legacyAreaMappings,
} from '../src/data/atlas/index.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsRoot = path.join(root, 'src/content/docs');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const unique = (items, label, field = 'id') => {
  const ids = items.map((item) => item[field]);
  assert(new Set(ids).size === ids.length, `${label} IDs must be unique`);
};
const routeExists = (route) => {
  const pathname = route.split('#')[0].replace(/^\//, '').replace(/\/$/, '');
  return fs.existsSync(path.join(docsRoot, `${pathname}.mdx`)) || fs.existsSync(path.join(docsRoot, pathname, 'index.mdx'));
};
const registerRoute = (entry, label) => {
  assert(entry.route?.startsWith('/'), `${label} route must be root-relative: ${entry.id}`);
  assert(!entry.route?.includes('/Electronic-Structure-Learning/'), `${label} hard-codes Pages base: ${entry.id}`);
  assert(routeExists(entry.route ?? ''), `${label} route does not exist: ${entry.id}`);
};

const courses = theoryDomains.flatMap((domain) => domain.courses);
const programs = computationalTools.flatMap((tool) => tool.programs);
const allEntries = [...theoryDomains, ...courses, ...electronicStructureTopics, ...learningMapNodes,
  ...methodCategories, ...computationalToolCategories, ...computationalTools, ...programs,
  ...referenceResources, ...legacyAreaMappings];
unique(allEntries, 'Atlas v3 global');
unique(learningMapEdges, 'Learning Map edges');
unique(martinMappings, 'Martin mappings', 'legacyId');

for (const entry of [...theoryDomains, ...courses, ...electronicStructureTopics, ...methodCategories,
  ...computationalToolCategories, ...computationalTools, ...programs]) registerRoute(entry, 'Atlas');
for (const item of legacyAreaMappings) {
  registerRoute({ id: `${item.id}:legacy`, route: item.legacyRoute }, 'Legacy');
  registerRoute({ id: `${item.id}:target`, route: item.targetRoute }, 'Migration target');
}

const courseIds = new Set(courses.map((item) => item.id));
const topicIds = new Set(electronicStructureTopics.map((item) => item.id));
const nodeIds = new Set(learningMapNodes.map((item) => item.id));
for (const node of learningMapNodes) {
  for (const id of node.courseIds) assert(courseIds.has(id), `Learning Map node references missing course: ${node.id} -> ${id}`);
  for (const id of node.topicIds) assert(topicIds.has(id), `Learning Map node references missing topic: ${node.id} -> ${id}`);
  assert(node.basis && node.version, `Learning Map node lacks basis/version: ${node.id}`);
}
for (const edge of learningMapEdges) {
  assert(nodeIds.has(edge.from), `Learning Map edge has missing source: ${edge.id}`);
  assert(nodeIds.has(edge.to), `Learning Map edge has missing target: ${edge.id}`);
  assert(['strict-prerequisite', 'recommended-prerequisite'].includes(edge.strictness), `Learning Map edge prerequisite type is invalid: ${edge.id}`);
  assert(['concept-derived', 'implementation-link'].includes(edge.relation), `Learning Map edge relation is invalid: ${edge.id}`);
  assert(edge.basis && edge.version, `Learning Map edge lacks basis/version: ${edge.id}`);
}

assert(methodCategories.length === 10, 'Methods must expose ten foundation categories');
assert(methodPageContract.excluded.includes('paperIds') && methodPageContract.excluded.includes('claimLedger'), 'Methods contract must exclude literature records');
assert(computationalToolCategories.length === 5, 'Computational Tools must expose five top-level categories');
for (const item of [...computationalToolCategories, ...computationalTools, ...programs]) assert(toolKinds.includes(item.kind), `invalid tool kind: ${item.id}`);
assert(commandEvidenceContract.length === 9, 'command evidence contract must retain nine evidence fields');
for (const resource of referenceResources) {
  assert(referenceResourceTypes.includes(resource.type), `invalid reference type: ${resource.id}`);
  for (const field of ['reason', 'stage', 'scope', 'source', 'license']) assert(resource[field], `reference resource lacks ${field}: ${resource.id}`);
}
assert(referenceResources.length === 0, 'unreviewed resources must not be bulk-filled during the foundation migration');
assert(martinMappings.length === 46, 'Martin migration mappings must cover 46 units');
assert(martinMappings.every((item) => item.reviewState === 'specialist-review-required'), 'Martin mappings must remain pending specialist review');
assert(legacyAreaMappings.every((item) => item.compatibility === 'legacy-route-retained'), 'legacy areas must retain route compatibility');

const atlasRoot = path.join(root, 'src/data/atlas');
const modelFiles = fs.readdirSync(atlasRoot).filter((name) => name.endsWith('.mjs'));
const publicSources = modelFiles.map((name) => fs.readFileSync(path.join(atlasRoot, name), 'utf8')).join('\n');
for (const forbidden of [['/home', 'talos'].join('/'), ['/Users', ''].join(''), 'POT' + 'CAR']) {
  assert(!publicSources.includes(forbidden), `Atlas model contains private or restricted token: ${forbidden}`);
}

if (failures.length) {
  console.error(`Atlas v3 model validation failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Atlas v3 model validation passed: ${courses.length} courses, ${learningMapNodes.length} nodes, ${learningMapEdges.length} edges, ${methodCategories.length} method categories, ${computationalTools.length} representative package, ${martinMappings.length} Martin mappings.`);
