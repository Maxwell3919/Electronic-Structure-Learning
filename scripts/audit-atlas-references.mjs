import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const target = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(target) : [target];
});
const relative = (target) => path.relative(root, target).split(path.sep).join('/');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const sourceFiles = walk(path.join(root, 'src'));
const cssPath = path.join(root, 'src/styles/global.css');
const sourceCorpus = sourceFiles
  .filter((file) => file !== cssPath)
  .map((file) => fs.readFileSync(file, 'utf8'))
  .join('\n');
const css = fs.readFileSync(cssPath, 'utf8');
const cssClasses = [...new Set([...css.matchAll(/\.([A-Za-z_][\w-]*)/g)].map((match) => match[1]))];
for (const className of cssClasses) {
  assert(sourceCorpus.includes(className), `CSS class has no source reference: ${className}`);
}

for (const asset of walk(path.join(root, 'public'))) {
  const publicPath = relative(asset).replace(/^public\//, '');
  assert(sourceCorpus.includes(publicPath), `public asset has no source reference: ${publicPath}`);
}

for (const component of [
  ...walk(path.join(root, 'src/layouts')).filter((file) => file.endsWith('.astro')),
  ...walk(path.join(root, 'src/reading')).filter((file) => file.endsWith('.astro')),
]) {
  const name = path.basename(component);
  assert(sourceCorpus.includes(name), `Astro component has no importer: ${relative(component)}`);
}

for (const removedLegacyFile of [
  'src/scripts/shared-pdf-annotations.ts',
  'src/scripts/shared-annotation-lifecycle.mjs',
  'scripts/test-shared-annotation-lifecycle.mjs',
]) {
  assert(!fs.existsSync(path.join(root, removedLegacyFile)), `retired shared-write implementation returned: ${removedLegacyFile}`);
}

const astroConfig = fs.readFileSync(path.join(root, 'astro.config.mjs'), 'utf8');
assert(astroConfig.includes("'/reading/martin/': '/reading/books/martin/'"), 'Martin compatibility route no longer targets its canonical route');

if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Atlas reference audit passed: ${cssClasses.length} CSS classes, ${walk(path.join(root, 'public')).length} public assets, and all Astro components are referenced.`);
