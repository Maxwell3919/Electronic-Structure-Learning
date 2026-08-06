import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const sourceMode = process.argv.includes('--source') || !process.argv.includes('--built');
const builtMode = process.argv.includes('--built');

const theorySlugs = [
  'atomic-and-molecular-physics',
  'berry-phases-and-electronic-topology',
  'brillouin-zone-sampling',
  'calculus-and-analysis',
  'chemical-bonding-and-molecular-structure',
  'classical-mechanics',
  'crystallography',
  'density-functional-theory-foundations',
  'differential-equations',
  'discretization-and-basis-representations',
  'electromagnetism',
  'exchange-correlation-functionals-and-approximations',
  'fourier-analysis',
  'functional-analysis-and-variational-methods',
  'general-chemistry',
  'group-theory-and-symmetry',
  'hartree-and-hartree-fock-theory',
  'inorganic-chemistry',
  'kohn-sham-density-functional-theory',
  'linear-algebra',
  'linear-response-and-excited-states',
  'localized-orbital-methods',
  'many-body-perturbation-theory-and-quasiparticles',
  'many-body-physics',
  'many-electron-problem',
  'numerical-analysis',
  'physical-chemistry',
  'plane-wave-and-real-space-methods',
  'probability-and-statistics',
  'pseudopotentials-paw-and-core-valence-treatments',
  'quantum-chemistry',
  'quantum-mechanics',
  'relativistic-electronic-structure-spin-and-magnetism',
  'self-consistent-field-methods',
  'solid-state-chemistry',
  'solid-state-physics',
  'statistical-mechanics',
  'surface-and-interface-chemistry',
  'thermodynamics',
];

const expectedPages = [
  'src/pages/404.astro',
  'src/pages/computational-tools/index.astro',
  'src/pages/index.astro',
  'src/pages/methods/index.astro',
  'src/pages/reading/index.astro',
  'src/pages/reading/martin/index.astro',
  'src/pages/reference/index.astro',
  'src/pages/theory/index.astro',
  ...theorySlugs.map((slug) => `src/pages/theory/${slug}/index.astro`),
].sort();

const expectedHtml = [
  '404.html',
  'computational-tools/index.html',
  'index.html',
  'methods/index.html',
  'reading/index.html',
  'reading/martin/index.html',
  'reference/index.html',
  'theory/index.html',
  ...theorySlugs.map((slug) => `theory/${slug}/index.html`),
].sort();

const expectedTheoryAnchors = [
  'mathematical-foundations', 'linear-algebra', 'calculus-and-analysis', 'differential-equations',
  'fourier-analysis', 'functional-analysis-and-variational-methods', 'numerical-analysis',
  'probability-and-statistics', 'group-theory-and-symmetry', 'physical-foundations',
  'classical-mechanics', 'electromagnetism', 'quantum-mechanics', 'thermodynamics',
  'statistical-mechanics', 'atomic-and-molecular-physics', 'solid-state-physics',
  'crystallography', 'many-body-physics', 'chemical-foundations', 'general-chemistry',
  'physical-chemistry', 'quantum-chemistry', 'chemical-bonding-and-molecular-structure',
  'inorganic-chemistry', 'solid-state-chemistry', 'surface-and-interface-chemistry',
  'electronic-structure-theory', 'many-electron-problem', 'hartree-and-hartree-fock-methods',
  'density-functional-theory', 'kohn-sham-theory', 'exchange-correlation-theory',
  'self-consistent-field-methods', 'basis-sets-and-numerical-representations',
  'plane-wave-and-real-space-methods', 'localized-orbital-methods', 'pseudopotentials-and-paw',
  'brillouin-zone-sampling', 'relativistic-electronic-structure-spin-and-magnetism',
  'linear-response-and-excited-states', 'many-body-perturbation-theory-and-quasiparticles',
  'berry-phases-and-electronic-topology', 'reviewed-study-routes', 'learning-map',
  'continue-guided-reading',
];

const internalRoutes = new Set([
  '', 'theory/', ...theorySlugs.map((slug) => `theory/${slug}/`),
  'reading/', 'reading/martin/', 'methods/', 'computational-tools/', 'reference/',
]);
const count = (text, expression) => (text.match(expression) ?? []).length;

const walk = (directory) => {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    else files.push(absolute);
  }
  return files;
};

const checkMathMl = (text, label, source = false) => {
  const math = count(text, /<math(?:\s|>)/g);
  const semantics = count(text, /<semantics(?:\s|>)/g);
  const annotations = count(text, /<annotation\s+encoding="application\/x-tex">/g);
  assert(math > 0, `${label} contains no native MathML`);
  assert(math === semantics, `${label} must give every MathML expression one semantics element: ${math} math, ${semantics} semantics`);
  assert(math === annotations, `${label} must give every MathML expression one TeX annotation: ${math} math, ${annotations} annotations`);
  assert(text.includes('class="math-display"'), `${label} contains no shared display-math wrapper`);
  assert(!text.includes('class="equation"'), `${label} still uses the removed code-style equation class`);
  if (source) {
    for (const match of text.matchAll(/<annotation\s+encoding="application\/x-tex">([\s\S]*?)<\/annotation>/g)) {
      assert(!/[{}]/.test(match[1]), `${label} has unescaped TeX grouping braces that Astro will parse as expressions`);
    }
  }
};

const checkTheoryPages = (baseDirectory, mode) => {
  for (const slug of theorySlugs) {
    const relative = mode === 'source'
      ? `src/pages/theory/${slug}/index.astro`
      : `theory/${slug}/index.html`;
    const text = fs.readFileSync(path.join(baseDirectory, relative), 'utf8');
    assert(text.length > 1200, `${relative} is unexpectedly short`);
    checkMathMl(text, relative, mode === 'source');
  }
};

const checkReadingManifest = () => {
  const relative = 'src/reading/martin.ts';
  const text = fs.readFileSync(path.join(root, relative), 'utf8');
  const chapters = count(text, /chapter\(\d+,/g);
  const appendices = count(text, /appendix\('[A-R]',/g);
  const parts = count(text, /id: 'martin-part-[ivx]+'/g);
  assert(chapters === 28, `${relative} must define 28 chapters; observed ${chapters}`);
  assert(appendices === 18, `${relative} must define 18 appendices; observed ${appendices}`);
  assert(parts === 7, `${relative} must define 7 parts; observed ${parts}`);
  assert(text.includes('martinReadingUnits'), `${relative} must export the flattened reading spine`);
  assert(!text.includes('sourceText'), `${relative} must not contain extracted textbook text`);
};

if (sourceMode) {
  const trackedOutput = execFileSync('git', ['ls-files', '-co', '--exclude-standard'], { cwd: root, encoding: 'utf8' }).trim();
  const tracked = trackedOutput ? trackedOutput.split('\n').filter(Boolean) : [];
  const actualPages = tracked.filter((file) => file.startsWith('src/pages/')).sort();
  assert(JSON.stringify(actualPages) === JSON.stringify(expectedPages), `public page sources must match the reviewed static set: ${actualPages.join(', ')}`);

  for (const directory of ['src/content', 'src/components', 'src/data', 'src/lib', 'schemas', 'templates']) {
    assert(!fs.existsSync(path.join(root, directory)), `legacy directory still exists: ${directory}`);
  }
  for (const prefix of ['part-', 'practice-sholl-steckel', 'learning-paths', 'reading-system', 'labs', 'cases', 'interactive-labs', 'literature', 'book-map']) {
    assert(!tracked.some((file) => file.includes(prefix)), `legacy tracked path remains: ${prefix}`);
  }
  const expectedScripts = ['scripts/smoke-clean-slate.py', 'scripts/validate-build-budget.mjs', 'scripts/validate-clean-slate.mjs'];
  assert(JSON.stringify(tracked.filter((file) => file.startsWith('scripts/')).sort()) === JSON.stringify(expectedScripts), 'scripts must remain the minimal suite');

  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert(JSON.stringify(Object.keys(packageJson.dependencies ?? {}).sort()) === JSON.stringify(['astro']), 'Astro must be the only production dependency');
  assert(JSON.stringify(Object.keys(packageJson.devDependencies ?? {}).sort()) === JSON.stringify(['@astrojs/check', 'typescript']), 'only Astro check and TypeScript may remain as dev dependencies');

  const sources = tracked.filter((file) => file.startsWith('src/')).map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
  assert(!sources.includes('/Electronic-Structure-Learning/'), 'source hard-codes the GitHub Pages base path');
  assert(!/\bclient:(?:load|idle|visible|media|only)\b/.test(sources), 'client hydration directive remains');
  assert(!/<script(?:\s|>)/i.test(sources), 'page-specific client script remains');
  for (const term of ['checkpoint', 'claim ledger', 'reading mode', 'card grid', 'status badge']) {
    assert(!sources.toLowerCase().includes(term), `legacy content or UI term remains in public source: ${term}`);
  }
  for (const privatePath of [['/home', 'talos'].join('/'), ['/Users', ''].join('')]) {
    assert(!sources.includes(privatePath), `private local path remains in public source: ${privatePath}`);
  }
  assert(!tracked.some((file) => /(?:^|\/)(?:POTCAR|.*\.(?:pdf|zip|key|pem))$/i.test(file)), 'restricted or archive file remains tracked');

  const layout = fs.readFileSync(path.join(root, 'src/layouts/BaseLayout.astro'), 'utf8');
  for (const marker of ["label: 'Foundations'", "label: 'Guided Reading'", "route: '/reading/'"]) {
    assert(layout.includes(marker), `primary navigation is missing: ${marker}`);
  }

  const home = fs.readFileSync(path.join(root, 'src/pages/index.astro'), 'utf8');
  for (const marker of ['Foundations', 'Guided Reading', '/reading/', '/methods/', '/computational-tools/', '/reference/']) {
    assert(home.includes(marker), `home page is missing framework marker: ${marker}`);
  }

  const theorySource = fs.readFileSync(path.join(root, 'src/pages/theory/index.astro'), 'utf8');
  assert(theorySource.includes('<h1>How Much Theory Do You Need?</h1>'), 'Foundations landing title is not applied');
  assert(theorySource.includes('/reading/martin/'), 'Foundations landing does not continue to Martin Guided Reading');
  for (const anchor of expectedTheoryAnchors) assert(theorySource.includes(`id="${anchor}"`), `Foundations source is missing directory anchor: ${anchor}`);
  for (const slug of theorySlugs) assert(theorySource.includes(`/theory/${slug}/`), `Foundations directory is missing reviewed page link: ${slug}`);
  checkTheoryPages(root, 'source');

  const reading = fs.readFileSync(path.join(root, 'src/pages/reading/index.astro'), 'utf8');
  for (const marker of ['Guided Reading', 'Martin · Electronic Structure', '/reading/martin/', '/theory/']) {
    assert(reading.includes(marker), `Guided Reading entrance is missing: ${marker}`);
  }
  const martin = fs.readFileSync(path.join(root, 'src/pages/reading/martin/index.astro'), 'utf8');
  for (const marker of ['martinParts', 'martinReadingUnits.length', 'Reading contract', 'Source spine', 'Chapters 1, 7, and 11']) {
    assert(martin.includes(marker), `Martin overview is missing: ${marker}`);
  }
  checkReadingManifest();

  const methods = fs.readFileSync(path.join(root, 'src/pages/methods/index.astro'), 'utf8');
  for (const marker of ['Ground-State Density-Functional Methods', 'From methods to a reliable workflow', 'DFT-Research-Workflow']) {
    assert(methods.includes(marker), `Methods page is missing reviewed marker: ${marker}`);
  }
  const styles = fs.readFileSync(path.join(root, 'src/styles/global.css'), 'utf8');
  for (const marker of ['.math-display', 'math.math-inline', 'math annotation']) {
    assert(styles.includes(marker), `global stylesheet is missing MathML presentation rule: ${marker}`);
  }
}

if (builtMode) {
  const dist = path.join(root, 'dist');
  assert(fs.existsSync(dist), 'dist does not exist; run the production build first');
  if (fs.existsSync(dist)) {
    const actualHtml = walk(dist).filter((file) => file.endsWith('.html')).map((file) => path.relative(dist, file)).sort();
    assert(JSON.stringify(actualHtml) === JSON.stringify(expectedHtml), `built HTML must match the reviewed static set: ${actualHtml.join(', ')}`);

    const builtFiles = walk(dist);
    assert(!builtFiles.some((file) => /\.(?:js|mjs|cjs)$/i.test(file)), 'built site contains client JavaScript');
    assert(!builtFiles.some((file) => /\.(?:woff2?|ttf|otf)$/i.test(file)), 'built site contains packaged fonts');

    for (const relative of expectedHtml) {
      const text = fs.readFileSync(path.join(dist, relative), 'utf8');
      assert(!/<script(?:\s|>)/i.test(text), `${relative} contains a script element`);
      assert(!text.includes('/Electronic-Structure-Learning//'), `${relative} contains a malformed Pages base path`);
      for (const match of text.matchAll(/href="([^"]+)"/g)) {
        const target = match[1];
        if (/^(?:https?:|mailto:|#)/.test(target)) continue;
        const normalized = target.replace(/^\.\//, '').replace(/^\//, '').replace(/^Electronic-Structure-Learning\//, '');
        const route = normalized.split('#')[0];
        if (!route || route.startsWith('../')) continue;
        assert(internalRoutes.has(route) || route === '404.html', `${relative} links to an undeclared internal route: ${target}`);
      }
    }
    checkTheoryPages(dist, 'built');

    const theoryBuilt = fs.readFileSync(path.join(dist, 'theory/index.html'), 'utf8');
    assert(theoryBuilt.includes('How Much Theory Do You Need?'), 'built Foundations landing title is missing');
    const readingBuilt = fs.readFileSync(path.join(dist, 'reading/index.html'), 'utf8');
    assert(readingBuilt.includes('Guided Reading'), 'built Guided Reading entrance is missing');
    const martinBuilt = fs.readFileSync(path.join(dist, 'reading/martin/index.html'), 'utf8');
    assert(martinBuilt.includes('46 stable units'), 'built Martin overview does not expose the 46-unit spine');
  }
}

if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Clean-slate validation passed in ${sourceMode && builtMode ? 'source+built' : sourceMode ? 'source' : 'built'} mode.`);
