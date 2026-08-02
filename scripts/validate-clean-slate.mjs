import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const sourceMode = process.argv.includes('--source') || !process.argv.includes('--built');
const builtMode = process.argv.includes('--built');
const expectedPages = [
  'src/pages/404.astro',
  'src/pages/computational-tools/index.astro',
  'src/pages/index.astro',
  'src/pages/methods/index.astro',
  'src/pages/reference/index.astro',
  'src/pages/theory/index.astro',
];

if (sourceMode) {
  const tracked = execFileSync('git', ['ls-files', '-co', '--exclude-standard'], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  const actualPages = tracked.filter((file) => file.startsWith('src/pages/')).sort();
  assert(JSON.stringify(actualPages) === JSON.stringify(expectedPages), `public page sources must be exactly the clean-slate set: ${actualPages.join(', ')}`);

  for (const directory of ['src/content', 'src/components', 'src/data', 'src/lib', 'schemas', 'templates']) {
    assert(!fs.existsSync(path.join(root, directory)), `legacy directory still exists: ${directory}`);
  }
  for (const prefix of ['part-', 'practice-sholl-steckel', 'learning-paths', 'reading-system', 'labs', 'cases', 'interactive-labs', 'literature', 'book-map']) {
    assert(!tracked.some((file) => file.includes(prefix)), `legacy tracked path remains: ${prefix}`);
  }
  const scriptFiles = tracked.filter((file) => file.startsWith('scripts/')).sort();
  const expectedScripts = ['scripts/smoke-clean-slate.py', 'scripts/validate-build-budget.mjs', 'scripts/validate-clean-slate.mjs'];
  assert(JSON.stringify(scriptFiles) === JSON.stringify(expectedScripts), `scripts must be exactly the minimal suite: ${scriptFiles.join(', ')}`);

  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert(JSON.stringify(Object.keys(packageJson.dependencies ?? {}).sort()) === JSON.stringify(['astro']), 'Astro must be the only production dependency');
  assert(JSON.stringify(Object.keys(packageJson.devDependencies ?? {}).sort()) === JSON.stringify(['@astrojs/check', 'typescript']), 'only Astro check and TypeScript may remain as dev dependencies');

  const sourceFiles = tracked.filter((file) => file.startsWith('src/'));
  const sources = sourceFiles.map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
  assert(!sources.includes('/Electronic-Structure-Learning/'), 'source hard-codes the GitHub Pages base path');
  assert(!/\bclient:(?:load|idle|visible|media|only)\b/.test(sources), 'client hydration directive remains');
  assert(!/<script(?:\s|>)/i.test(sources), 'page-specific client script remains');
  for (const term of ['Martin', 'Sholl', 'checkpoint', 'claim ledger', 'reading mode', 'card grid', 'status badge']) {
    assert(!sources.toLowerCase().includes(term.toLowerCase()), `legacy content or UI term remains in public source: ${term}`);
  }
  for (const privatePath of [['/home', 'talos'].join('/'), ['/Users', ''].join('')]) {
    assert(!sources.includes(privatePath), `private local path remains in public source: ${privatePath}`);
  }
  assert(!tracked.some((file) => /(?:^|\/)(?:POTCAR|.*\.(?:pdf|zip|key|pem))$/i.test(file)), 'restricted or archive file remains tracked');

  const layout = fs.readFileSync(path.join(root, 'src/layouts/BaseLayout.astro'), 'utf8');
  for (const route of ['/theory/', '/methods/', '/computational-tools/', '/reference/']) {
    assert(layout.includes(`route: '${route}'`), `navigation target is missing: ${route}`);
  }
}

if (builtMode) {
  const dist = path.join(root, 'dist');
  assert(fs.existsSync(dist), 'dist does not exist; build before --built validation');
  const files = [];
  const walk = (directory) => { for (const entry of fs.readdirSync(directory, { withFileTypes: true })) { const absolute = path.join(directory, entry.name); entry.isDirectory() ? walk(absolute) : files.push(absolute); } };
  walk(dist);
  const htmlFiles = files.filter((file) => file.endsWith('.html')).map((file) => path.relative(dist, file)).sort();
  const expectedHtml = ['404.html', 'computational-tools/index.html', 'index.html', 'methods/index.html', 'reference/index.html', 'theory/index.html'];
  assert(JSON.stringify(htmlFiles) === JSON.stringify(expectedHtml), `built HTML must be exactly six files: ${htmlFiles.join(', ')}`);
  assert(!files.some((file) => file.endsWith('.js')), 'built site contains JavaScript');
  assert(!files.some((file) => /\.(?:woff2?|ttf|otf)$/i.test(file)), 'built site contains packaged fonts');

  const routeFiles = new Set(['', 'theory/', 'methods/', 'computational-tools/', 'reference/']);
  for (const htmlFile of htmlFiles) {
    const html = fs.readFileSync(path.join(dist, htmlFile), 'utf8');
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1];
      if (/^(?:https?:|mailto:|tel:|#)/.test(href)) continue;
      const withoutBase = href.replace(/^\/[^/]+\//, '').replace(/^\//, '');
      const route = withoutBase.split(/[?#]/)[0];
      assert(routeFiles.has(route), `broken or unexpected internal link in ${htmlFile}: ${href}`);
    }
  }
}

if (failures.length) {
  console.error(`Clean-slate validation failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Clean-slate ${builtMode ? 'built' : 'source'} validation passed.`);
