import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const target = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(target) : [target];
});

const sources = walk(path.join(root, 'src'))
  .filter((file) => /\.(?:astro|js|mjs|ts|tsx)$/.test(file))
  .map((file) => ({ file, relative: path.relative(root, file), source: fs.readFileSync(file, 'utf8') }));

for (const { relative, source } of sources) {
  if (/\bsetInterval\s*\(/.test(source)) {
    assert(/\bclearInterval\s*\(/.test(source), `${relative}: setInterval lacks clearInterval`);
  }
  if (/\brequestAnimationFrame\s*\(/.test(source)) {
    assert(/\bcancelAnimationFrame\s*\(/.test(source), `${relative}: requestAnimationFrame lacks cancelAnimationFrame`);
  }
  if (/new\s+(?:Intersection|Resize|Mutation)Observer\s*\(/.test(source)) {
    assert(/\.disconnect\s*\(/.test(source), `${relative}: observer lacks disconnect`);
  }
  if (/(?:window|document|globalThis)\.addEventListener\s*\(/.test(source)) {
    assert(
      /AbortController|\.removeEventListener\s*\(/.test(source),
      `${relative}: global listener lacks AbortController or explicit removal`,
    );
  }
}

const toolbar = fs.readFileSync(path.join(root, 'src/components/reading/UnitReadingToolbar.astro'), 'utf8');
assert(toolbar.includes('button.dataset.bound'), 'reading-layout buttons lack an idempotent binding guard');
const bilingual = fs.readFileSync(path.join(root, 'src/components/design/BilingualModeControl.astro'), 'utf8');
assert(bilingual.includes('button.dataset.bound'), 'language buttons lack an idempotent binding guard');

const sourceText = sources.map(({ source }) => source).join('\n');
assert(!sourceText.includes('runtime-diagnostics'), 'diagnostic harness entered the production source tree');

if (failures.length) {
  console.error(`Runtime-lifecycle validation failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Runtime-lifecycle validation passed: ${sources.length} client-capable source files audited.`);
