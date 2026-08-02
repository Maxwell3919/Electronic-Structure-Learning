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
  'brillouin-zone-sampling',
  'calculus-and-analysis',
  'crystallography',
  'density-functional-theory-foundations',
  'differential-equations',
  'discretization-and-basis-representations',
  'exchange-correlation-functionals-and-approximations',
  'fourier-analysis',
  'group-theory-and-symmetry',
  'hartree-and-hartree-fock-theory',
  'kohn-sham-density-functional-theory',
  'linear-algebra',
  'many-electron-problem',
  'numerical-analysis',
  'plane-wave-and-real-space-methods',
  'pseudopotentials-paw-and-core-valence-treatments',
  'quantum-chemistry',
  'quantum-mechanics',
  'relativistic-electronic-structure-spin-and-magnetism',
  'self-consistent-field-methods',
  'solid-state-physics',
];

const expectedPages = [
  'src/pages/404.astro',
  'src/pages/computational-tools/index.astro',
  'src/pages/index.astro',
  'src/pages/methods/index.astro',
  'src/pages/reference/index.astro',
  'src/pages/theory/index.astro',
  ...theorySlugs.map((slug) => `src/pages/theory/${slug}/index.astro`),
].sort();

const expectedHtml = [
  '404.html',
  'computational-tools/index.html',
  'index.html',
  'methods/index.html',
  'reference/index.html',
  'theory/index.html',
  ...theorySlugs.map((slug) => `theory/${slug}/index.html`),
].sort();

const reviewedTheoryPages = {
  'linear-algebra': ['generalized eigenvalue problem', 'The obsolete Cambridge resource link was removed'],
  'calculus-and-analysis': ['Two layers hidden under one title', 'Computational calculus'],
  'differential-equations': ['An equation is incomplete without its domain and conditions', 'Continuous and discrete problems must remain distinguishable'],
  'fourier-analysis': ['The DFT and FFT are finite numerical objects', 'Reciprocal lattice and Brillouin-zone variables are not the same index'],
  'numerical-analysis': ['Four error sources must remain separate', 'Algorithmic convergence is not observable convergence'],
  'group-theory-and-symmetry': ['Representations describe how symmetry acts on a space', 'Symmetry reduction is not automatically physically harmless'],
  'quantum-mechanics': ['Identical electrons require antisymmetry'],
  'solid-state-physics': ["Bloch's theorem reorganizes the one-electron problem", 'A plotted band path shows selected eigenvalues'],
  'crystallography': ['A crystal combines a lattice with a basis', 'Structure standardization is useful but not neutral provenance'],
  'quantum-chemistry': ['The clamped-nuclei electronic Hamiltonian', 'A Slater determinant enforces it'],
  'many-electron-problem': ['Finite bases expose combinatorial growth', 'Correlation terminology needs a declared convention'],
  'hartree-and-hartree-fock-theory': ['The occupied subspace is more fundamental than canonical orbitals', "Koopmans' theorem"],
  'density-functional-theory-foundations': ['Levy–Lieb constrained search defines the universal functional', 'This page stops before Kohn–Sham theory'],
  'kohn-sham-density-functional-theory': ['The auxiliary system preserves the density, not the interacting wavefunction', 'Kohn–Sham orbitals are auxiliary variables'],
  'exchange-correlation-functionals-and-approximations': ['No material-type lookup table can select a universal best functional', 'Self-interaction and delocalization error'],
  'self-consistent-field-methods': ['The fixed-point problem', 'Four separate conclusions'],
  'discretization-and-basis-representations': ['Basis, quadrature, and grid are distinct choices', 'Convergence is observable-specific'],
  'plane-wave-and-real-space-methods': ['Real-space methods form a family, not one algorithm', 'Representation-specific artifacts'],
  'pseudopotentials-paw-and-core-valence-treatments': ['Verification, validation, and convergence are different', 'A library benchmark can reduce risk'],
  'brillouin-zone-sampling': ['Three meshes must not be conflated', 'A smooth band plot'],
  'relativistic-electronic-structure-spin-and-magnetism': ['A magnetic calculation searches a nonlinear landscape', 'Resource-review boundary'],
};

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
  'linear-response-and-excited-states', 'berry-phases-and-electronic-topology', 'learning-map',
];

const internalRoutes = new Set([
  '', 'theory/', ...theorySlugs.map((slug) => `theory/${slug}/`),
  'methods/', 'computational-tools/', 'reference/',
]);
const deadCambridgeId = '8C2B8F7F4C94A903A9018E9D8A42B9A7';
const count = (text, expression) => (text.match(expression) ?? []).length;

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

const checkReviewedPages = (baseDirectory, mode) => {
  for (const [slug, markers] of Object.entries(reviewedTheoryPages)) {
    const relative = mode === 'source'
      ? `src/pages/theory/${slug}/index.astro`
      : `theory/${slug}/index.html`;
    const text = fs.readFileSync(path.join(baseDirectory, relative), 'utf8');
    for (const marker of markers) assert(text.includes(marker), `${relative} is missing reviewed content marker: ${marker}`);
    checkMathMl(text, relative, mode === 'source');
  }
};

if (sourceMode) {
  const tracked = execFileSync('git', ['ls-files', '-co', '--exclude-standard'], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  const actualPages = tracked.filter((file) => file.startsWith('src/pages/')).sort();
  assert(JSON.stringify(actualPages) === JSON.stringify(expectedPages), `public page sources must match the reviewed static set: ${actualPages.join(', ')}`);

  for (const directory of ['src/content', 'src/components', 'src/data', 'src/lib', 'schemas', 'templates']) {
    assert(!fs.existsSync(path.join(root, directory)), `legacy directory still exists: ${directory}`);
  }
  for (const prefix of ['part-', 'practice-sholl-steckel', 'learning-paths', 'reading-system', 'labs', 'cases', 'interactive-labs', 'literature', 'book-map']) {
    assert(!tracked.some((file) => file.includes(prefix)), `legacy tracked path remains: ${prefix}`);
  }
  const expectedScripts = ['scripts/smoke-clean-slate.py', 'scripts/validate-build-budget.mjs', 'scripts/validate-clean-slate.mjs'];
  const scriptFiles = tracked.filter((file) => file.startsWith('scripts/')).sort();
  assert(JSON.stringify(scriptFiles) === JSON.stringify(expectedScripts), `scripts must remain the minimal suite: ${scriptFiles.join(', ')}`);

  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert(JSON.stringify(Object.keys(packageJson.dependencies ?? {}).sort()) === JSON.stringify(['astro']), 'Astro must be the only production dependency');
  assert(JSON.stringify(Object.keys(packageJson.devDependencies ?? {}).sort()) === JSON.stringify(['@astrojs/check', 'typescript']), 'only Astro check and TypeScript may remain as dev dependencies');

  const sourceFiles = tracked.filter((file) => file.startsWith('src/'));
  const sources = sourceFiles.map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
  assert(!sources.includes('/Electronic-Structure-Learning/'), 'source hard-codes the GitHub Pages base path');
  assert(!/\bclient:(?:load|idle|visible|media|only)\b/.test(sources), 'client hydration directive remains');
  assert(!/<script(?:\s|>)/i.test(sources), 'page-specific client script remains');
  assert(!sources.includes(deadCambridgeId), 'dead Cambridge Linear Algebra resource remains in public source');
  for (const term of ['checkpoint', 'claim ledger', 'reading mode', 'card grid', 'status badge']) {
    assert(!sources.toLowerCase().includes(term), `legacy content or UI term remains in public source: ${term}`);
  }
  for (const privatePath of [['/home', 'talos'].join('/'), ['/Users', ''].join('')]) {
    assert(!sources.includes(privatePath), `private local path remains in public source: ${privatePath}`);
  }
  assert(!tracked.some((file) => /(?:^|\/)(?:POTCAR|.*\.(?:pdf|zip|key|pem))$/i.test(file)), 'restricted or archive file remains tracked');

  const theorySource = fs.readFileSync(path.join(root, 'src/pages/theory/index.astro'), 'utf8');
  for (const anchor of expectedTheoryAnchors) assert(theorySource.includes(`id="${anchor}"`), `Theory source is missing directory anchor: ${anchor}`);
  for (const slug of theorySlugs) assert(theorySource.includes(`/theory/${slug}/`), `Theory directory is missing reviewed page link: ${slug}`);
  for (const label of ['Plane-Wave and Real-Space Methods', 'Pseudopotentials, PAW, and Core–Valence Treatments', 'Brillouin-Zone Sampling', 'Relativistic Electronic Structure, Spin, and Magnetism']) {
    assert(theorySource.includes(label), `Theory directory is missing reviewed display label: ${label}`);
  }

  checkReviewedPages(root, 'source');

  const methods = fs.readFileSync(path.join(root, 'src/pages/methods/index.astro'), 'utf8');
  for (const marker of ['Ground-State Density-Functional Methods', 'From methods to a reliable workflow', 'DFT-Research-Workflow']) {
    assert(methods.includes(marker), `Methods page is missing reviewed marker: ${marker}`);
  }

  const styles = fs.readFileSync(path.join(root, 'src/styles/global.css'), 'utf8');
  for (const marker of ['.math-display', 'math.math-inline', 'math annotation']) assert(styles.includes(marker), `global stylesheet is missing MathML presentation rule: ${marker}`);
  assert(!styles.includes('.equation'), 'removed code-style equation rule remains in the stylesheet');
}

if (builtMode) {
  const dist = path.join(root, 'dist');
  assert(fs.existsSync(dist), 'dist does not exist; build before --built validation');
  const files = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      entry.isDirectory() ? walk(absolute) : files.push(absolute);
    }
  };
  walk(dist);
  const htmlFiles = files.filter((file) => file.endsWith('.html')).map((file) => path.relative(dist, file)).sort();
  assert(JSON.stringify(htmlFiles) === JSON.stringify(expectedHtml), `built HTML must match the reviewed static set: ${htmlFiles.join(', ')}`);
  assert(!files.some((file) => file.endsWith('.js')), 'built site contains JavaScript');
  assert(!files.some((file) => /\.(?:woff2?|ttf|otf)$/i.test(file)), 'built site contains packaged fonts');

  for (const htmlFile of htmlFiles) {
    const html = fs.readFileSync(path.join(dist, htmlFile), 'utf8');
    assert(!html.includes(deadCambridgeId), `dead Cambridge resource remains in built HTML: ${htmlFile}`);
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1];
      if (/^(?:https?:|mailto:|tel:|#)/.test(href)) continue;
      const route = href.replace(/^\/[^/]+\//, '').replace(/^\//, '').split(/[?#]/)[0];
      assert(internalRoutes.has(route), `broken or unexpected internal link in ${htmlFile}: ${href}`);
    }
  }
  checkReviewedPages(dist, 'built');
}

if (failures.length) {
  console.error(`Clean-slate validation failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Clean-slate ${builtMode ? 'built' : 'source'} validation passed.`);
