import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import contentStatus from '../src/data/site/contentStatus.mjs';
import testRegistry from './test-registry.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const list = (directory) => fs.readdirSync(path.join(root, directory), { withFileTypes: true })
  .flatMap((entry) => entry.isDirectory()
    ? list(path.join(directory, entry.name))
    : [path.join(directory, entry.name)]);

const styleFiles = list('src/styles').filter((name) => name.endsWith('.css'));
const styleSource = styleFiles.map(read).join('\n');
const definedTokens = new Set([...styleSource.matchAll(/(--esl-[\w-]+)\s*:/g)].map((match) => match[1]));
const usedTokens = new Set([...styleSource.matchAll(/var\((--esl-[\w-]+)/g)].map((match) => match[1]));
for (const token of usedTokens) assert(definedTokens.has(token), `undefined design token: ${token}`);

for (const token of [
  '--esl-page', '--esl-surface', '--esl-surface-muted', '--esl-ink', '--esl-ink-muted',
  '--esl-border', '--esl-accent', '--esl-accent-soft', '--esl-science', '--esl-science-soft',
  '--esl-warning', '--esl-warning-soft', '--esl-danger', '--esl-danger-soft',
  '--esl-reading-width', '--esl-wide-width', '--esl-full-width', '--esl-radius-sm',
  '--esl-radius-md', '--esl-radius-lg', '--esl-border-width', '--esl-rule-width',
]) assert(definedTokens.has(token), `required token is missing: ${token}`);

const keyComponentFiles = [
  ...list('src/components/design'), ...list('src/components/site'),
  ...list('src/components/learning'), ...list('src/components/interaction'),
];
for (const relativePath of keyComponentFiles) {
  assert(!/#[0-9a-f]{3,8}\b/i.test(read(relativePath)), `hard-coded brand color in shared component: ${relativePath}`);
}

const templates = new Map([
  ['src/content/docs/index.mdx', 'pageType="home"'],
  ['src/content/docs/learning-paths/index.mdx', 'pageType="learning"'],
  ['src/content/docs/theory/index.mdx', 'pageType="theory"'],
  ['src/content/docs/labs/index.mdx', 'pageType="lab"'],
  ['src/content/docs/cases/index.mdx', 'pageType="case"'],
  ['src/content/docs/reference/index.mdx', 'pageType="reference"'],
]);
for (const [relativePath, marker] of templates) {
  assert(read(relativePath).includes(marker), `${relativePath} does not use its page template`);
}

const bilingual = read('src/components/design/BilingualModeControl.astro');
for (const mode of ['parallel', 'zh', 'en']) assert(bilingual.includes(`data-bilingual-mode="${mode}"`), `missing bilingual mode: ${mode}`);
assert(read('src/components/BilingualSection.astro').includes('lang="en"'), 'bilingual English region lacks lang="en"');
assert(styleSource.includes('@media print'), 'print completeness rule is missing');
assert(styleSource.includes('prefers-reduced-motion: reduce'), 'reduced-motion CSS is missing');
assert(!styleSource.includes('outline: none'), 'focus outline must not be removed');

const readme = read('README.md');
assert(readme.includes('不存在隶属、合作、赞助或背书关系'), 'README lacks the Chinese no-affiliation statement');
assert(readme.includes('does not copy their prose, illustrations, brand assets'), 'README lacks the English no-copy boundary');
assert(fs.existsSync(path.join(root, 'docs/credits-and-inspiration.md')), 'credits-and-inspiration.md is missing');

for (const relativePath of [
  'src/content/docs/index.mdx', 'src/content/docs/start-here.mdx', 'src/content/docs/learning-paths/index.mdx',
  'src/content/docs/theory/index.mdx', 'src/content/docs/labs/index.mdx', 'src/content/docs/cases/index.mdx',
  'src/content/docs/interactive-labs/index.mdx', 'src/content/docs/reference/index.mdx',
  'src/content/docs/reference/design-system.mdx',
]) assert(read(relativePath).length < 12_000, `framework/specimen page is unexpectedly long: ${relativePath}`);

for (const route of [
  'src/content/docs/part-01-overview-and-background/chapter-03-theoretical-background.mdx',
  'src/content/docs/part-07-appendices/appendix-j-scattering-and-phase-shifts.mdx',
  'src/content/docs/labs/scf-fixed-point-and-mixing.mdx',
]) assert(fs.existsSync(path.join(root, route)), `representative old route is missing: ${route}`);

assert(contentStatus.every((item) => item.scientificReviewState !== 'reviewed'), 'scientific review was promoted by visual work');
assert(contentStatus.every((item) => item.learnerTestState === 'not-tested'), 'learner testing was promoted by visual work');

const validators = new Set(testRegistry.filter((item) => item.validator).map((item) => item.validator));
const smokes = new Set(testRegistry.filter((item) => item.smokeScript).map((item) => item.smokeScript));
assert(validators.size >= 37, `validator registry shrank below expected visual-phase floor: ${validators.size}`);
assert(smokes.size >= 38, `smoke registry shrank below expected visual-phase floor: ${smokes.size}`);

const tracked = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
for (const relativePath of tracked) {
  assert(!/\.(?:woff2?|ttf|otf|eot)$/i.test(relativePath), `font file must not be committed: ${relativePath}`);
  assert(!relativePath.includes('DFT-Learning-Benchmarks'), `reference benchmark asset entered the repository: ${relativePath}`);
}

if (failures.length) {
  console.error(`Design-system validation failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Design-system validation passed: ${definedTokens.size} tokens, ${validators.size} validators, ${smokes.size} browser smokes.`);
