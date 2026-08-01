import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import navigation from '../src/data/site/navigation.mjs';
import learningPaths from '../src/data/site/learningPaths.mjs';
import contentStatus from '../src/data/site/contentStatus.mjs';
import labs from '../src/data/site/labs.mjs';
import cases from '../src/data/site/cases.mjs';
import referenceSections from '../src/data/site/referenceSections.mjs';
import {
  navigationStatuses,
  learningPathStatuses,
  catalogStatuses,
  structuralStates,
  technicalStates,
  scientificReviewStates,
  learnerTestStates,
} from '../src/data/site/schema.mjs';
import testRegistry from './test-registry.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsRoot = path.join(repositoryRoot, 'src/content/docs');
const failures = [];
const forbiddenLocalPaths = [
  ['/home', 'talos', 'work', 'References'].join('/') + '/',
  ['/Users', 'paquette'].join('/') + '/',
];

const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const assertUnique = (items, field, label) => {
  const values = items.map((item) => item[field]);
  assert(new Set(values).size === values.length, `${label} ${field} values must be unique`);
};

const routeExists = (route) => {
  const pathname = route.split('#')[0].replace(/^\//, '').replace(/\/$/, '');
  if (!pathname) return fs.existsSync(path.join(docsRoot, 'index.mdx'));
  return fs.existsSync(path.join(docsRoot, `${pathname}.mdx`))
    || fs.existsSync(path.join(docsRoot, pathname, 'index.mdx'));
};

assert(navigation.length === 7, 'navigation must contain exactly seven top-level entries');
assert(learningPaths.length === 3, 'learningPaths must contain exactly three routes');
assert(contentStatus.length === 56, 'contentStatus must cover 46 Martin and 10 Sholl-Steckel units');
assert(labs.length === 9, 'labs must contain exactly nine planned entries');
assert(cases.length === 6, 'cases must contain exactly six planned entries');
assert(referenceSections.length === 7, 'referenceSections must contain exactly seven entries');

for (const [items, label] of [
  [navigation, 'navigation'],
  [learningPaths, 'learningPaths'],
  [contentStatus, 'contentStatus'],
  [labs, 'labs'],
  [cases, 'cases'],
  [referenceSections, 'referenceSections'],
  [testRegistry, 'testRegistry'],
]) {
  assertUnique(items, 'id', label);
}

assertUnique(navigation, 'href', 'navigation');
assertUnique(contentStatus, 'route', 'contentStatus');
assertUnique(labs, 'route', 'labs');
assertUnique(cases, 'route', 'cases');

for (const item of navigation) {
  assert(navigationStatuses.includes(item.status), `invalid navigation status for ${item.id}`);
  assert(routeExists(item.href), `navigation route does not exist: ${item.href}`);
  assert(item.href.startsWith('/'), `navigation href must be site-root relative: ${item.id}`);
  assert(!item.href.includes('/Electronic-Structure-Learning/'), `navigation href hard-codes the Pages base: ${item.id}`);
}

for (const learningPath of learningPaths) {
  assert(learningPathStatuses.includes(learningPath.status), `invalid learning-path status: ${learningPath.id}`);
  assert(routeExists(`/learning-paths/${learningPath.id}/`), `learning-path route does not exist: ${learningPath.id}`);
  assertUnique(learningPath.milestones, 'id', `milestones for ${learningPath.id}`);
  for (const milestone of learningPath.milestones) {
    assert(routeExists(milestone.href), `milestone route does not exist: ${learningPath.id}/${milestone.id}`);
  }
}

for (const item of contentStatus) {
  assert(routeExists(item.route), `content status route does not exist: ${item.id}`);
  assert(structuralStates.includes(item.structuralState), `invalid structural state: ${item.id}`);
  assert(technicalStates.includes(item.technicalState), `invalid technical state: ${item.id}`);
  assert(scientificReviewStates.includes(item.scientificReviewState), `invalid scientific-review state: ${item.id}`);
  assert(learnerTestStates.includes(item.learnerTestState), `invalid learner-test state: ${item.id}`);
  assert(item.scientificReviewState !== 'reviewed', `scientific review was promoted without a site-wide acceptance record: ${item.id}`);
  assert(item.learnerTestState === 'not-tested', `learner testing was promoted without real learner evidence: ${item.id}`);
  if (item.technicalState === 'validated') {
    assert(Boolean(item.validator), `validated unit lacks validator: ${item.id}`);
    assert(Boolean(item.smokeTest), `validated unit lacks smoke test: ${item.id}`);
    assert(/^[0-9a-f]{40}$/.test(item.lastAcceptedSha ?? ''), `validated unit lacks accepted SHA: ${item.id}`);
  }
}

for (const item of [...labs, ...cases]) {
  assert(catalogStatuses.includes(item.status), `catalog item must remain planned: ${item.id}`);
  assert(routeExists(item.route), `catalog route does not exist: ${item.route}`);
}

const registeredValidators = new Set(testRegistry.filter((item) => item.validator).map((item) => item.validator));
const validatorFiles = fs.readdirSync(path.join(repositoryRoot, 'scripts'))
  .filter((name) => name.startsWith('validate-') && name.endsWith('.mjs'))
  .map((name) => `scripts/${name}`)
  .filter((name) => !['scripts/validate-framework.mjs', 'scripts/validate-scf-model.mjs'].includes(name));
assert(validatorFiles.every((name) => registeredValidators.has(name)), 'every deterministic validator must be registered');
assert([...registeredValidators].every((name) => fs.existsSync(path.join(repositoryRoot, name))), 'registry references a missing validator');

const registeredSmokes = new Set(testRegistry.filter((item) => item.smokeScript).map((item) => item.smokeScript));
const smokeFiles = fs.readdirSync(path.join(repositoryRoot, 'scripts'))
  .filter((name) => name.startsWith('smoke') && name.endsWith('.py'))
  .map((name) => `scripts/${name}`);
assert(smokeFiles.every((name) => registeredSmokes.has(name)), 'every browser smoke script must be registered');
assert([...registeredSmokes].every((name) => fs.existsSync(path.join(repositoryRoot, name))), 'registry references a missing smoke script');

const publicFiles = execFileSync('git', ['ls-files', '-co', '--exclude-standard'], {
  cwd: repositoryRoot,
  encoding: 'utf8',
}).trim().split('\n').filter(Boolean);
for (const relativePath of publicFiles) {
  const absolutePath = path.join(repositoryRoot, relativePath);
  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) continue;
  assert(!relativePath.includes('DFT-Learning-Benchmarks'), `reference clone entered the website tree: ${relativePath}`);
  assert(fs.statSync(absolutePath).size < 5_000_000, `unexpected large file in website tree: ${relativePath}`);
  if (/\.(?:md|mdx|mjs|astro|css|json|ya?ml)$/.test(relativePath)) {
    const source = fs.readFileSync(absolutePath, 'utf8');
    for (const forbiddenPath of forbiddenLocalPaths) {
      assert(!source.includes(forbiddenPath), `public source contains a private local path: ${relativePath}`);
    }
  }
}

for (const relativePath of [
  'src/content/docs/index.mdx',
  'src/content/docs/start-here.mdx',
  'src/content/docs/learning-paths/index.mdx',
  'src/content/docs/learning-paths/dft-foundations.mdx',
  'src/content/docs/learning-paths/first-real-calculation.mdx',
  'src/content/docs/learning-paths/properties-and-advanced-topics.mdx',
  'src/content/docs/theory/index.mdx',
  'src/content/docs/labs/index.mdx',
  'src/content/docs/cases/index.mdx',
  'src/content/docs/interactive-labs/index.mdx',
  'src/content/docs/reference/index.mdx',
]) {
  const size = fs.statSync(path.join(repositoryRoot, relativePath)).size;
  assert(size < 6_000, `framework route contains oversized placeholder prose: ${relativePath}`);
}

if (failures.length > 0) {
  console.error(`Site architecture validation failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Site architecture validation passed: ${navigation.length} entries, ${learningPaths.length} paths, ${contentStatus.length} content states, ${labs.length} labs, ${cases.length} cases.`);
