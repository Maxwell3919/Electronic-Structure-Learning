import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const count = (text, expression) => (text.match(expression) ?? []).length;
const sourceMode = process.argv.includes('--source') || !process.argv.includes('--built');
const builtMode = process.argv.includes('--built');

const theorySlugs = [
  'atomic-and-molecular-physics', 'berry-phases-and-electronic-topology',
  'brillouin-zone-sampling', 'calculus-and-analysis',
  'chemical-bonding-and-molecular-structure', 'classical-mechanics', 'crystallography',
  'density-functional-theory-foundations', 'differential-equations',
  'discretization-and-basis-representations', 'electromagnetism',
  'exchange-correlation-functionals-and-approximations', 'fourier-analysis',
  'functional-analysis-and-variational-methods', 'general-chemistry',
  'group-theory-and-symmetry', 'hartree-and-hartree-fock-theory', 'inorganic-chemistry',
  'kohn-sham-density-functional-theory', 'linear-algebra',
  'linear-response-and-excited-states', 'localized-orbital-methods',
  'many-body-perturbation-theory-and-quasiparticles', 'many-body-physics',
  'many-electron-problem', 'numerical-analysis', 'physical-chemistry',
  'plane-wave-and-real-space-methods', 'probability-and-statistics',
  'pseudopotentials-paw-and-core-valence-treatments', 'quantum-chemistry',
  'quantum-mechanics', 'relativistic-electronic-structure-spin-and-magnetism',
  'self-consistent-field-methods', 'solid-state-chemistry', 'solid-state-physics',
  'statistical-mechanics', 'surface-and-interface-chemistry', 'thermodynamics',
];
const coreSlugs = ['orientation', 'part-i', 'part-ii', 'part-iii', 'part-iv', 'part-v', 'part-vi', 'part-vii', 'part-viii'];
const forbiddenCorePartSlugs = [];
const researchTopicSlugs = [
  'structures-phase-competition', 'electronic-character', 'defects-disorder', 'interfaces-heterostructures',
  'magnetism-correlation', 'lattice-dynamics', 'electron-phonon-superconductivity', 'polarization-response',
  'quasiparticles-excitons', 'transport-scattering', 'quantum-geometry-topology', 'reliability-validation',
];
const literatureSlugs = researchTopicSlugs;
const pilotPaperRoute = 'reading/literature/electron-phonon-superconductivity/hbn-sin-superconductivity-cdw/';
const pilotPdfRoute = 'papers/hbn-sin-superconductivity-cdw.pdf';
const literatureLibrary = JSON.parse(fs.readFileSync(path.join(root, 'src/reading/literature-library.json'), 'utf8'));
const publishedLibrary = literatureLibrary.papers.filter((entry) => entry.status === 'published');
const libraryPaperRoutes = publishedLibrary
  .map((entry) => `reading/literature/${entry.primary_category}/${entry.paper_id}/`);
const libraryPdfRoutes = publishedLibrary.map((entry) => `papers/${entry.paper_id}.pdf`);
const martinPartSlugs = ['part-i', 'part-ii', 'part-iii', 'part-iv', 'part-v', 'part-vi', 'part-vii'];
const martinChapterSlugs = Array.from({ length: 28 }, (_, index) => `chapter-${String(index + 1).padStart(2, '0')}`);
const martinAppendixSlugs = 'abcdefghijklmnopqr'.split('').map((letter) => `appendix-${letter}`);
const martinUnitSlugs = [...martinChapterSlugs, ...martinAppendixSlugs];
const chapterLoaderSource = fs.readFileSync(path.join(root, 'src/reading/books/martin/chapter-content.ts'), 'utf8');
const martinPublishedUnitSlugs = [...chapterLoaderSource.matchAll(/'((?:chapter-\d{2}|appendix-[a-r]))'\s*:/g)].map((match) => match[1]);
const martinUnpublishedUnitSlugs = martinUnitSlugs.filter((slug) => !martinPublishedUnitSlugs.includes(slug));
const martinPublishedSlugs = [...martinPartSlugs, ...martinPublishedUnitSlugs];
const martinRoutes = martinPublishedSlugs.map((slug) => `reading/books/martin/${slug}/`);
const shollSteckelChapterSlugs = Array.from({ length: 10 }, (_, index) => `chapter-${String(index + 1).padStart(2, '0')}`);
const shollSteckelRoutes = shollSteckelChapterSlugs.map((slug) => `reading/books/sholl-steckel/${slug}/`);
const cohenLouiePartSlugs = ['part-i', 'part-ii', 'part-iii', 'part-iv'];
const cohenLouieChapterSlugs = Array.from({ length: 16 }, (_, index) => `chapter-${String(index + 1).padStart(2, '0')}`);
const cohenLouieSlugs = [...cohenLouiePartSlugs, ...cohenLouieChapterSlugs];
const cohenLouieRoutes = cohenLouieSlugs.map((slug) => `reading/books/cohen-louie/${slug}/`);
const giustinoChapterSlugs = Array.from({ length: 11 }, (_, index) => `chapter-${String(index + 1).padStart(2, '0')}`);
const giustinoAppendixSlugs = 'abcde'.split('').map((letter) => `appendix-${letter}`);
const giustinoSlugs = [...giustinoChapterSlugs, ...giustinoAppendixSlugs];
const giustinoRoutes = giustinoSlugs.map((slug) => `reading/books/giustino/${slug}/`);

const expectedPages = [
  'src/pages/404.astro', 'src/pages/computational-tools/index.astro', 'src/pages/index.astro',
  'src/pages/methods/index.astro', 'src/pages/reading/books/index.astro',
  'src/pages/reading/books/martin/[slug].astro', 'src/pages/reading/books/martin/index.astro',
  'src/pages/reading/books/sholl-steckel/[slug].astro', 'src/pages/reading/books/sholl-steckel/index.astro',
  'src/pages/reading/books/cohen-louie/[slug].astro', 'src/pages/reading/books/cohen-louie/index.astro',
  'src/pages/reading/books/giustino/[slug].astro', 'src/pages/reading/books/giustino/index.astro',
  'src/pages/reading/literature/[slug].astro', 'src/pages/reading/literature/index.astro',
  'src/pages/reading/literature/[topic]/[paper].astro',
  'src/pages/reading/index.astro', 'src/pages/reference/index.astro', 'src/pages/robots.txt.ts',
  'src/pages/sitemap.xml.ts', 'src/pages/theory/index.astro', 'src/pages/core/index.astro',
  ...coreSlugs.map((slug) => `src/pages/core/${slug}/index.astro`),
  ...theorySlugs.map((slug) => `src/pages/theory/${slug}/index.astro`),
].sort();
const expectedHtml = [
  '404.html', 'computational-tools/index.html', 'core/index.html',
  ...coreSlugs.map((slug) => `core/${slug}/index.html`),
  'index.html', 'methods/index.html',
  'reading/books/index.html', 'reading/books/martin/index.html',
  ...martinPublishedSlugs.map((slug) => `reading/books/martin/${slug}/index.html`),
  'reading/books/sholl-steckel/index.html',
  ...shollSteckelChapterSlugs.map((slug) => `reading/books/sholl-steckel/${slug}/index.html`),
  'reading/books/cohen-louie/index.html',
  ...cohenLouieSlugs.map((slug) => `reading/books/cohen-louie/${slug}/index.html`),
  'reading/books/giustino/index.html',
  ...giustinoSlugs.map((slug) => `reading/books/giustino/${slug}/index.html`),
  'reading/literature/index.html',
  ...literatureSlugs.map((slug) => `reading/literature/${slug}/index.html`),
  ...libraryPaperRoutes.map((route) => `${route}index.html`),
  'reading/index.html', 'reading/martin/index.html', 'reference/index.html', 'theory/index.html',
  ...theorySlugs.map((slug) => `theory/${slug}/index.html`),
].sort();
const internalRoutes = new Set([
  'core/', ...coreSlugs.map((slug) => `core/${slug}/`),
  '', 'theory/', ...theorySlugs.map((slug) => `theory/${slug}/`),
  'reading/', 'reading/books/', 'reading/books/martin/', 'reading/martin/', ...martinRoutes,
  'reading/books/sholl-steckel/', ...shollSteckelRoutes,
  'reading/books/cohen-louie/', ...cohenLouieRoutes,
  'reading/books/giustino/', ...giustinoRoutes,
  'reading/literature/', ...literatureSlugs.map((slug) => `reading/literature/${slug}/`),
  pilotPaperRoute,
  pilotPdfRoute,
  ...libraryPaperRoutes,
  ...libraryPdfRoutes,
  'methods/', 'computational-tools/', 'reference/',
]);

const walk = (directory) => {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    entry.isDirectory() ? files.push(...walk(absolute)) : files.push(absolute);
  }
  return files;
};

const checkMathMl = (text, label, source = false) => {
  const math = count(text, /<math(?:\s|>)/g);
  const semantics = count(text, /<semantics(?:\s|>)/g);
  const annotations = count(text, /<annotation\s+encoding="application\/x-tex">/g);
  assert(math > 0, `${label} contains no native MathML`);
  assert(math === semantics, `${label} must give every MathML expression one semantics element`);
  assert(math === annotations, `${label} must give every MathML expression one TeX annotation`);
  assert(text.includes('class="math-display"'), `${label} contains no display-math wrapper`);
  assert(count(text, /class="math-display" tabindex="0"/g) === count(text, /class="math-display"/g), `${label} has non-focusable display mathematics`);
  if (source) {
    for (const match of text.matchAll(/<annotation\s+encoding="application\/x-tex">([\s\S]*?)<\/annotation>/g)) {
      assert(!/[{}]/.test(match[1]), `${label} has unescaped TeX grouping braces`);
    }
  }
};

const checkTheoryPages = (baseDirectory, mode) => {
  for (const slug of theorySlugs) {
    const relative = mode === 'source' ? `src/pages/theory/${slug}/index.astro` : `theory/${slug}/index.html`;
    const text = fs.readFileSync(path.join(baseDirectory, relative), 'utf8');
    assert(text.length > 1200, `${relative} is unexpectedly short`);
    assert(!/<(?:aside|div)[^>]*class="[^"]*\breview-note\b/.test(text), `${relative} contains public review metadata`);
    checkMathMl(text, relative, mode === 'source');
  }
};

const checkCorePages = (baseDirectory, mode) => {
  const prefix = mode === 'source' ? 'src/pages/core' : 'core';
  const extension = mode === 'source' ? 'index.astro' : 'index.html';
  const landing = fs.readFileSync(path.join(baseDirectory, prefix, extension), 'utf8');
  if (mode === 'source') {
    assert(landing.includes('current="core"'), `${prefix}/${extension} lacks the independent Core navigation context`);
  } else {
    assert(landing.includes('aria-current="page">Core</a>'), `${prefix}/${extension} does not render Core as the current primary destination`);
  }
  assert(!landing.includes('class="breadcrumbs"'), `${prefix}/${extension} must not render a parent breadcrumb for the peer-level Core landing`);
  for (const slug of coreSlugs) {
    assert(landing.includes(`/core/${slug}/`), `${prefix}/${extension} is missing Core entry ${slug}`);
  }
  for (const slug of forbiddenCorePartSlugs) {
    assert(!landing.includes(`/core/${slug}/`), `${prefix}/${extension} links unpublished Core ${slug}`);
  }
  assert(!/coming soon|placeholder/i.test(landing), `${prefix}/${extension} contains placeholder wording`);

  for (const slug of coreSlugs) {
    const relative = `${prefix}/${slug}/${extension}`;
    const text = fs.readFileSync(path.join(baseDirectory, relative), 'utf8');
    assert(text.length > 2400, `${relative} is unexpectedly short`);
    assert(text.includes('class="breadcrumbs"'), `${relative} lacks breadcrumbs`);
    assert(text.includes('class="sequence-nav"'), `${relative} lacks sequence navigation`);
    if (mode === 'source') {
      assert(text.includes('current="core"'), `${relative} lacks the independent Core navigation context`);
    } else {
      assert(text.includes('aria-current="page">Core</a>'), `${relative} does not render Core as the current primary destination`);
    }
    const breadcrumb = text.match(/<nav class="breadcrumbs"[\s\S]*?<\/nav>/)?.[0] ?? '';
    assert(breadcrumb.includes('Core'), `${relative} breadcrumb does not begin from Core`);
    assert(!breadcrumb.includes('Foundations'), `${relative} breadcrumb incorrectly nests Core below Foundations`);
    assert(count(text, /<h1(?:\s|>)/g) === 1, `${relative} must contain one h1`);
    assert(!/coming soon|placeholder/i.test(text), `${relative} contains placeholder wording`);
    for (const forbidden of forbiddenCorePartSlugs) {
      assert(!text.includes(`/core/${forbidden}/`), `${relative} links unpublished Core ${forbidden}`);
    }
  }
  for (const slug of ['part-i', 'part-ii', 'part-iii', 'part-iv', 'part-v', 'part-vi', 'part-vii', 'part-viii']) {
    const relative = `${prefix}/${slug}/${extension}`;
    checkMathMl(fs.readFileSync(path.join(baseDirectory, relative), 'utf8'), relative, mode === 'source');
  }
  const orientation = fs.readFileSync(path.join(baseDirectory, `${prefix}/orientation/${extension}`), 'utf8');
  for (const marker of ['Electronic structure is a hierarchy of quantum information', 'calculated object is therefore an ingredient', 'Sources and further reading', 'class="source-map"']) {
    assert(orientation.includes(marker), `${prefix}/orientation/${extension} lacks teaching-depth marker ${marker}`);
  }
  const partI = fs.readFileSync(path.join(baseDirectory, `${prefix}/part-i/${extension}`), 'utf8');
  for (const marker of ['<figure class="energy-curve"', '<figure class="hamiltonian-map"', '<svg viewBox=', 'role="img"', '<title id=', '<desc id=', '<figcaption']) {
    assert(partI.includes(marker), `${prefix}/part-i/${extension} lacks accessible original diagram marker ${marker}`);
  }
  for (const marker of ['joint function of both electrons', 'genuine many-body coupling', 'Read the numerator from right to left', 'restricting the allowed trial states', 'This is a change of problem, not the deletion of nuclear physics', 'Sources and further reading']) {
    assert(partI.includes(marker), `${prefix}/part-i/${extension} lacks equation-pedagogy marker ${marker}`);
  }
  assert(count(partI, /class="equation-source"/g) >= 4, `${prefix}/part-i/${extension} lacks nearby canonical equation sources`);
  const partII = fs.readFileSync(path.join(baseDirectory, `${prefix}/part-ii/${extension}`), 'utf8');
  for (const marker of ['<figure class="scf-flow"', '<figure class="h2-reference"', 'instantaneous positions of the other electrons', 'restricts the allowed many-electron state', 'crosses the orbital labels', 'not a universal substance', 'Sources and further reading']) {
    assert(partII.includes(marker), `${prefix}/part-ii/${extension} lacks teaching-depth marker ${marker}`);
  }
  assert(count(partII, /class="equation-source"/g) >= 5, `${prefix}/part-ii/${extension} lacks nearby canonical equation sources`);
  const partIII = fs.readFileSync(path.join(baseDirectory, `${prefix}/part-iii/${extension}`), 'utf8');
  for (const marker of ['lattice-duality', 'bloch-phase', 'band-formation', 'band-dos']) {
    assert(partIII.includes(`class="core-diagram ${marker}"`), `${prefix}/part-iii/${extension} lacks original diagram ${marker}`);
  }
  assert(count(partIII, /class="equation-source"/g) === 1, `${prefix}/part-iii/${extension} must keep one nearby lattice source without a citation forest`);
  for (const marker of ['Sources and further reading', 'class="source-map"', 'Sec. 4.3', 'Ch. 14', 'unitary', 't\\to 0', 'whole Brillouin zone']) {
    assert(partIII.includes(marker), `${prefix}/part-iii/${extension} lacks equation-pedagogy marker ${marker}`);
  }
  const partIV = fs.readFileSync(path.join(baseDirectory, `${prefix}/part-iv/${extension}`), 'utf8');
  for (const marker of ['class="density-reduction"', 'class="dft-logic"', 'class="ks-bridge"', 'class="ks-scf-loop"']) {
    assert(partIV.includes(marker), `${prefix}/part-iv/${extension} lacks semantic teaching diagram ${marker}`);
  }
  for (const marker of ['marginalization', 'existence and uniqueness statement', 'not by itself a computational closure', 'not necessarily small', 'came from translation symmetry before DFT entered', 'solution requirement for the nonlinear Kohn–Sham equations', 'Sources and further reading']) {
    assert(partIV.includes(marker), `${prefix}/part-iv/${extension} lacks equation-pedagogy marker ${marker}`);
  }
  assert(count(partIV, /class="equation-source"/g) >= 6, `${prefix}/part-iv/${extension} lacks nearby canonical equation sources`);
  const partV = fs.readFileSync(path.join(baseDirectory, `${prefix}/part-v/${extension}`), 'utf8');
  for (const marker of ['finite-representation', 'core-treatment-map', 'bz-quadrature', 'nested-solve', 'calculation-stack']) {
    assert(partV.includes(marker), `${prefix}/part-v/${extension} lacks semantic teaching diagram ${marker}`);
  }
  for (const marker of ['finite coordinates', 'not automatically physical electron states', 'does not select crystal momenta', 'versioned scientific datasets', 'represent integration volume', 'Inner eigensolver convergence', 'What a ground-state DFT calculation actually solves', 'Sources and further reading']) {
    assert(partV.includes(marker), `${prefix}/part-v/${extension} lacks equation-pedagogy marker ${marker}`);
  }
  assert(count(partV, /class="equation-source"/g) >= 5, `${prefix}/part-v/${extension} lacks nearby canonical equation sources`);
  const partVI = fs.readFileSync(path.join(baseDirectory, `${prefix}/part-vi/${extension}`), 'utf8');
  for (const marker of ['derivative-map', 'structure-loop', 'structure-energy-curve', 'stability-ladder']) {
    assert(partVI.includes(marker), `${prefix}/part-vi/${extension} lacks semantic teaching diagram ${marker}`);
  }
  for (const marker of ['direction of the comparison', 'Force and stress are not additional ground-state energies', 'first-order contribution', 'outer search on the Born–Oppenheimer surface', 'positive local Hessian', 'not automatically a physical temperature', 'Sources and further reading']) {
    assert(partVI.includes(marker), `${prefix}/part-vi/${extension} lacks equation-pedagogy marker ${marker}`);
  }
  assert(count(partVI, /class="equation-source"/g) >= 5, `${prefix}/part-vi/${extension} lacks nearby canonical equation sources`);
  const partVII = fs.readFileSync(path.join(baseDirectory, `${prefix}/part-vii/${extension}`), 'utf8');
  for (const marker of ['response-map', 'response-routes', 'phonon-chain', 'reciprocal-roles']) {
    assert(partVII.includes(marker), `${prefix}/part-vii/${extension} lacks semantic teaching diagram ${marker}`);
  }
  for (const marker of ['cause–effect pair', 'different computational routes to the same harmonic derivative', 'interatomic force constant', 'not a trajectory assigned independently', 'not arbitrary atomic motion', 'large aggregate coupling parameter', 'Sources and further reading']) {
    assert(partVII.includes(marker), `${prefix}/part-vii/${extension} lacks equation-pedagogy marker ${marker}`);
  }
  assert(count(partVII, /class="equation-source"/g) >= 6, `${prefix}/part-vii/${extension} lacks nearby canonical equation sources`);
  const partVIII = fs.readFileSync(path.join(baseDirectory, `${prefix}/part-viii/${extension}`), 'utf8');
  for (const marker of ['excitation-sectors', 'spectral-weight', 'neutral-route', 'gap-ledger']) {
    assert(partVIII.includes(marker), `${prefix}/part-viii/${extension} lacks semantic teaching diagram ${marker}`);
  }
  for (const marker of ['different many-body sectors', 'fundamental charged gap', 'dominant pole', 'not one unique correction button', 'same particle-number sector', 'matching unbound electron–hole continuum', 'Sources and further reading']) {
    assert(partVIII.includes(marker), `${prefix}/part-viii/${extension} lacks equation-pedagogy marker ${marker}`);
  }
  assert(count(partVIII, /class="equation-source"/g) >= 6, `${prefix}/part-viii/${extension} lacks nearby canonical equation sources`);
};

const checkLiteraturePages = (baseDirectory, mode) => {
  const prefix = mode === 'source' ? 'src/pages/reading/literature' : 'reading/literature';
  const extension = mode === 'source' ? 'index.astro' : 'index.html';
  const landing = fs.readFileSync(path.join(baseDirectory, prefix, extension), 'utf8');
  assert(landing.includes('Research Questions'), `${prefix}/${extension} lacks the Research Topic Map`);
  assert(!landing.includes('Learning guides'), `${prefix}/${extension} retains the former paper-library entry point`);
  for (const slug of researchTopicSlugs) {
    if (mode === 'built') assert(landing.includes(`/reading/literature/${slug}/`), `${prefix}/${extension} is missing research topic ${slug}`);
    const relative = mode === 'source' ? `${prefix}/[slug].astro` : `${prefix}/${slug}/${extension}`;
    const text = fs.readFileSync(path.join(baseDirectory, relative), 'utf8');
    assert(text.length > (mode === 'built' ? 900 : 200), `${relative} is unexpectedly short`);
    if (mode === 'built') {
      assert(count(text, /<h1(?:\s|>)/g) === 1, `${relative} must contain one h1`);
      assert(text.includes('class="breadcrumbs"'), `${relative} lacks breadcrumbs`);
      for (const heading of ['Central Question', 'What researchers ask', 'Evidence', 'Literature Routes', 'Connections']) {
        assert(!new RegExp(`<h[2-6][^>]*>${heading}<\\/h[2-6]>`, 'i').test(text), `${relative} retains former topic teaching section ${heading}`);
      }
    }
    if (mode === 'source') assert(text.includes('current="reading"'), `${relative} lacks Guided Reading navigation context`);
    else assert(text.includes('aria-current="page">Guided Reading</a>'), `${relative} does not render Guided Reading as current`);
  }
  if (mode === 'source') {
    const route = fs.readFileSync(path.join(baseDirectory, prefix, '[topic]/[paper].astro'), 'utf8');
    const shell = fs.readFileSync(path.join(baseDirectory, 'src/layouts/LiteratureReaderPage.astro'), 'utf8');
    for (const marker of ['LiteratureReaderPage', 'readingAnalysisUrl']) {
      assert(route.includes(marker), `${prefix}/[topic]/[paper].astro lacks unified Reader marker ${marker}`);
    }
    for (const marker of ['Reading analysis pending.', 'Open PDF', 'data-reading-analysis-url', 'literature-reader.ts']) {
      assert(shell.includes(marker), `unified Literature Reader lacks ${marker}`);
    }
    assert(!publishedLibrary.some((paper) => route.includes(paper.paper_id)), 'dynamic Reader route hard-codes a paper ID');
  } else {
    for (const [index, route] of libraryPaperRoutes.entries()) {
      const relative = `${route}index.html`;
      const text = fs.readFileSync(path.join(baseDirectory, relative), 'utf8');
      const hasAnalysis = Boolean(publishedLibrary[index].reading_analysis_path);
      assert(text.includes(hasAnalysis ? 'Curated reading analysis is available' : 'Reading analysis pending'), `${relative} has the wrong reading-analysis state`);
      assert(text.includes(`/papers/${route.split('/').at(-2)}.pdf`) || text.includes('data-paper-id='), `${relative} lacks a PDF runtime mapping`);
      assert(text.includes('>Open PDF</a>'), `${relative} lacks the standard PDF label`);
      assert(text.includes('data-shared-annotations-url='), `${relative} lacks the shared-annotation bootstrap`);
    }
  }
};

const checkReadingManifest = () => {
  const mainRelative = 'src/reading/books/martin.ts';
  const dataDirectory = path.join(root, 'src/reading/books/martin');
  const text = [
    fs.readFileSync(path.join(root, mainRelative), 'utf8'),
    ...walk(dataDirectory).filter((file) => file.endsWith('.ts')).map((file) => fs.readFileSync(file, 'utf8')),
  ].join('\n');
  assert(count(text, /chapter\(\d+,/g) === 28, `Martin data must define 28 chapters`);
  assert(count(text, /appendix\("[A-R]",/g) === 18, `Martin data must define 18 appendices`);
  assert(count(text, /id: "martin-part-[ivx]+"/g) === 7, `Martin data must define 7 parts`);
  for (const marker of ['contribution:', 'coreIdea:', 'overview:', 'sections:', 'martinReadingSlugs']) {
    assert(text.includes(marker), `Martin data is missing ${marker}`);
  }
  assert(!text.includes('route: null'), `Martin data contains an unpublished unit route`);
  assert(!text.includes('sourceText'), `Martin data must not contain extracted textbook text`);
  assert(martinPublishedUnitSlugs.length > 0, 'Martin detailed-content loader publishes no reviewed units');
  assert(new Set(martinPublishedUnitSlugs).size === martinPublishedUnitSlugs.length, 'Martin detailed-content loader contains duplicate unit slugs');
  for (const slug of martinPublishedUnitSlugs) {
    assert(martinUnitSlugs.includes(slug), `Martin detailed-content loader contains an unknown unit slug: ${slug}`);
    assert(fs.existsSync(path.join(root, `src/reading/books/martin/content/${slug}.astro`)), `Martin detailed content is missing for ${slug}`);
  }

  const shollMain = fs.readFileSync(path.join(root, 'src/reading/books/sholl-steckel.ts'), 'utf8');
  const shollLoader = fs.readFileSync(path.join(root, 'src/reading/books/sholl-steckel/chapter-content.ts'), 'utf8');
  assert(count(shollMain, /chapter\(\s*\d+,/g) === 10, 'Sholl & Steckel data must define ten chapters');
  assert(count(shollLoader, /'chapter-\d{2}'\s*:/g) === 10, 'Sholl & Steckel loader must publish ten reviewed chapters');
  assert(!shollMain.includes('sourceText'), 'Sholl & Steckel data must not contain extracted textbook text');
  for (const slug of shollSteckelChapterSlugs) {
    assert(shollLoader.includes(`'${slug}'`), `Sholl & Steckel loader is missing ${slug}`);
    assert(fs.existsSync(path.join(root, `src/reading/books/sholl-steckel/content/${slug}.astro`)), `Sholl & Steckel detailed content is missing for ${slug}`);
  }

  const cohenMain = fs.readFileSync(path.join(root, 'src/reading/books/cohen-louie.ts'), 'utf8');
  const cohenLoader = fs.readFileSync(path.join(root, 'src/reading/books/cohen-louie/chapter-content.ts'), 'utf8');
  assert(count(cohenMain, /chapter\(\s*\d+,/g) === 16, 'Cohen & Louie data must define sixteen chapters');
  assert(count(cohenMain, /id: 'cohen-louie-part-[iv]+'/g) === 4, 'Cohen & Louie data must define four parts');
  assert(count(cohenLoader, /'chapter-\d{2}'\s*:/g) === 16, 'Cohen & Louie loader must publish sixteen reviewed chapters');
  assert(!cohenMain.includes('sourceText'), 'Cohen & Louie data must not contain extracted textbook text');
  for (const slug of cohenLouieChapterSlugs) {
    assert(cohenLoader.includes(`'${slug}'`), `Cohen & Louie loader is missing ${slug}`);
    assert(fs.existsSync(path.join(root, `src/reading/books/cohen-louie/content/${slug}.astro`)), `Cohen & Louie detailed content is missing for ${slug}`);
  }

  const giustinoMain = fs.readFileSync(path.join(root, 'src/reading/books/giustino.ts'), 'utf8');
  const giustinoLoader = fs.readFileSync(path.join(root, 'src/reading/books/giustino/chapter-content.ts'), 'utf8');
  const giustinoSourceReading = fs.readFileSync(path.join(root, 'src/reading/books/giustino/source-reading.ts'), 'utf8');
  assert(count(giustinoMain, /unit\('chapter'/g) === 11, 'Giustino data must define eleven chapters');
  assert(count(giustinoMain, /unit\('appendix'/g) === 5, 'Giustino data must define five appendices');
  assert(count(giustinoLoader, /'(?:chapter-\d{2}|appendix-[a-e])'\s*:/g) === 16, 'Giustino loader must publish sixteen reviewed units');
  assert(count(giustinoSourceReading, /\{ locator:/g) >= 16, 'Giustino guide must include source-reading locators for every unit');
  assert(!giustinoMain.includes('sourceText') && !giustinoSourceReading.includes('assets/mineru'), 'Giustino public data must not contain extracted textbook text or MinerU assets');
  for (const slug of giustinoSlugs) {
    assert(giustinoLoader.includes(`'${slug}'`), `Giustino loader is missing ${slug}`);
    assert(fs.existsSync(path.join(root, `src/reading/books/giustino/content/${slug}.astro`)), `Giustino detailed content is missing for ${slug}`);
    const content = fs.readFileSync(path.join(root, `src/reading/books/giustino/content/${slug}.astro`), 'utf8');
    assert(content.length > 2200, `Giustino detailed content is unexpectedly short for ${slug}`);
    if (slug !== 'chapter-01') checkMathMl(content, `src/reading/books/giustino/content/${slug}.astro`, true);
  }
};

if (sourceMode) {
  const trackedOutput = execFileSync('git', ['ls-files', '-co', '--exclude-standard'], { cwd: root, encoding: 'utf8' }).trim();
  const tracked = (trackedOutput ? trackedOutput.split('\n').filter(Boolean) : []).filter((file) => fs.existsSync(path.join(root, file)));
  const actualPages = tracked.filter((file) => file.startsWith('src/pages/')).sort();
  assert(JSON.stringify(actualPages) === JSON.stringify(expectedPages), `public page sources differ from the reviewed set: ${actualPages.join(', ')}`);

  for (const directory of ['src/content', 'src/components', 'src/data', 'src/lib', 'schemas', 'templates']) {
    assert(!fs.existsSync(path.join(root, directory)), `legacy directory still exists: ${directory}`);
  }
  assert(!tracked.some((file) => file.startsWith('src/pages/reading/lectures/')), 'empty lecture routes must not be published');
  for (const slug of forbiddenCorePartSlugs) {
    assert(!tracked.some((file) => file.startsWith(`src/pages/core/${slug}/`)), `unpublished Core route is present: ${slug}`);
  }

  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert(JSON.stringify(Object.keys(packageJson.dependencies ?? {}).sort()) === JSON.stringify(['@embedpdf/snippet', 'astro']), 'production dependencies must remain limited to Astro and the pinned PDF viewer');
  assert(packageJson.dependencies?.['@embedpdf/snippet'] === '2.15.0', 'EmbedPDF must remain pinned to reviewed stable v2.15.0');
  assert(JSON.stringify(Object.keys(packageJson.devDependencies ?? {}).sort()) === JSON.stringify(['@astrojs/check', 'typescript']), 'unexpected development dependency');

  const sources = tracked.filter((file) => file.startsWith('src/')).map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
  assert(!sources.includes('/Electronic-Structure-Learning/'), 'source hard-codes the Pages base path');
  assert(!/\bclient:(?:load|idle|visible|media|only)\b/.test(sources), 'client hydration directive remains');
  const scriptedPages = tracked.filter((file) => file.endsWith('.astro') && /<script(?:\s|>)/i.test(fs.readFileSync(path.join(root, file), 'utf8')));
  assert(scriptedPages.every((file) => file === 'src/pages/reading/literature/[slug].astro' || file === 'src/layouts/LiteratureReaderPage.astro'), `client scripts exist outside the Literature list and PDF Readers: ${scriptedPages.join(', ')}`);
  for (const term of ['checkpoint', 'claim ledger', 'reading mode', 'reading contract', 'card grid', 'status badge']) {
    assert(!sources.toLowerCase().includes(term), `legacy or administrative term remains in public source: ${term}`);
  }
  assert(!tracked.some((file) => /(?:^|\/)(?:POTCAR|.*\.(?:pdf|zip|key|pem))$/i.test(file)), 'restricted or archive file remains tracked');
  assert(!tracked.some((file) => /(?:^|\/)(?:mineru|ocr|source-cache|searchable-cache)(?:\/|$)/i.test(file)), 'source extraction or searchable cache remains tracked');
  for (const file of tracked.filter((item) => item.endsWith('.astro'))) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    assert(!/<aside class="callout"/.test(text), `${file} contains a nested complementary landmark callout`);
    assert(count(text, /class="math-display" tabindex="0"/g) === count(text, /class="math-display"/g), `${file} has non-focusable display mathematics`);
  }

  const theorySource = fs.readFileSync(path.join(root, 'src/pages/theory/index.astro'), 'utf8');
  assert(theorySource.includes('<h1>Foundations</h1>'), 'Foundations title is missing');
  assert(theorySource.includes('id="research-chain"'), 'Foundations research chain is missing');
  assert(theorySource.includes('DFT-Research-Workflow'), 'Foundations workflow handoff is missing');
  for (const slug of theorySlugs) assert(theorySource.includes(`/theory/${slug}/`), `Foundations is missing ${slug}`);
  checkTheoryPages(root, 'source');
  checkCorePages(root, 'source');
  checkLiteraturePages(root, 'source');

  const book = fs.readFileSync(path.join(root, 'src/pages/reading/books/martin/index.astro'), 'utf8');
  for (const marker of ['part.summary', 'part.route', 'Read Part']) {
    assert(book.includes(marker), `Martin book page is missing ${marker}`);
  }
  assert(!book.includes('part.progression'), 'Martin book page duplicates Part progression');
  assert(!book.includes('martinReadingUnits.length'), 'Martin book page exposes unit-count metadata');
  const routePage = fs.readFileSync(path.join(root, 'src/pages/reading/books/martin/[slug].astro'), 'utf8');
  for (const marker of ['getStaticPaths', 'martinChapterSlugs', 'Core Idea.', 'Chapter structure', 'Appendix structure', 'entry.contribution', 'href(entry.route)']) {
    assert(routePage.includes(marker), `Martin route page is missing ${marker}`);
  }
  assert(routePage.includes('class="source-outline"'), 'Martin source outline lacks its marker-suppression class');
  assert(!routePage.includes('Detailed section-by-section reading will be added'), 'Martin route page still renders unfinished-unit placeholder copy');
  assert(!routePage.includes('Read Section'), 'Martin route page creates section-level navigation');
  const shollBook = fs.readFileSync(path.join(root, 'src/pages/reading/books/sholl-steckel/index.astro'), 'utf8');
  for (const marker of ['Source sequence', 'Reported', 'DFT Research Workflow', 'chapter.contribution']) {
    assert(shollBook.includes(marker), `Sholl & Steckel book page is missing ${marker}`);
  }
  const shollRoutePage = fs.readFileSync(path.join(root, 'src/pages/reading/books/sholl-steckel/[slug].astro'), 'utf8');
  for (const marker of ['getStaticPaths', 'shollSteckelChapterSlugs', 'Core Idea.', 'Chapter structure', 'Source visuals and reading notes', 'Source anchor']) {
    assert(shollRoutePage.includes(marker), `Sholl & Steckel route page is missing ${marker}`);
  }
  for (const slug of shollSteckelChapterSlugs.slice(0, 9)) {
    checkMathMl(fs.readFileSync(path.join(root, `src/reading/books/sholl-steckel/content/${slug}.astro`), 'utf8'), `src/reading/books/sholl-steckel/content/${slug}.astro`, true);
  }
  const cohenBook = fs.readFileSync(path.join(root, 'src/pages/reading/books/cohen-louie/index.astro'), 'utf8');
  for (const marker of ['Source sequence', 'Part {part.number}', 'chapter.title', 'DFT Research Workflow']) {
    assert(cohenBook.includes(marker), `Cohen & Louie book page is missing ${marker}`);
  }
  const cohenRoutePage = fs.readFileSync(path.join(root, 'src/pages/reading/books/cohen-louie/[slug].astro'), 'utf8');
  for (const marker of ['getStaticPaths', 'cohenLouieReadingSlugs', 'Core Idea.', 'Chapter structure', 'Source visuals and reading notes', 'Source anchor', 'Part synthesis']) {
    assert(cohenRoutePage.includes(marker), `Cohen & Louie route page is missing ${marker}`);
  }
  for (const slug of cohenLouieChapterSlugs.slice(1)) {
    checkMathMl(fs.readFileSync(path.join(root, `src/reading/books/cohen-louie/content/${slug}.astro`), 'utf8'), `src/reading/books/cohen-louie/content/${slug}.astro`, true);
  }
  const giustinoBook = fs.readFileSync(path.join(root, 'src/pages/reading/books/giustino/index.astro'), 'utf8');
  for (const marker of ['all eleven chapters and five appendices', 'DFT Research Workflow', 'entry.contribution', 'Read {entry.label}']) {
    assert(giustinoBook.includes(marker), `Giustino book page is missing ${marker}`);
  }
  const giustinoRoutePage = fs.readFileSync(path.join(root, 'src/pages/reading/books/giustino/[slug].astro'), 'utf8');
  for (const marker of ['getStaticPaths', 'giustinoUnitSlugs', 'Core Idea.', "unit.kind === 'chapter'", 'unit-structure', 'Source visuals and reading notes', 'Source anchor']) {
    assert(giustinoRoutePage.includes(marker), `Giustino route page is missing ${marker}`);
  }
  const styles = fs.readFileSync(path.join(root, 'src/styles/global.css'), 'utf8');
  assert(styles.includes('.source-outline') && styles.includes('list-style: none'), 'Martin source outline does not suppress automatic list markers');
  checkReadingManifest();

  const astroConfig = fs.readFileSync(path.join(root, 'astro.config.mjs'), 'utf8');
  assert(astroConfig.includes("'/reading/martin/': '/reading/books/martin/'"), 'Martin compatibility redirect is missing');
}

if (builtMode) {
  const dist = path.join(root, 'dist');
  assert(fs.existsSync(dist), 'dist does not exist; run the production build first');
  if (fs.existsSync(dist)) {
    const actualHtml = walk(dist).filter((file) => file.endsWith('.html')).map((file) => path.relative(dist, file)).sort();
    assert(JSON.stringify(actualHtml) === JSON.stringify(expectedHtml), `built HTML differs from the reviewed set: ${actualHtml.join(', ')}`);
    const builtFiles = walk(dist);
    const builtScripts = builtFiles.filter((file) => /\.(?:js|mjs|cjs)$/i.test(file));
    assert(builtScripts.length > 0 && builtScripts.every((file) => path.relative(dist, file).startsWith('_astro/')), 'built client JavaScript must remain bundled and limited to Astro assets');
    assert(!builtFiles.some((file) => /\.(?:woff2?|ttf|otf)$/i.test(file)), 'built site contains packaged fonts');
    const sitemapPath = path.join(dist, 'sitemap.xml');
    const robotsPath = path.join(dist, 'robots.txt');
    assert(fs.existsSync(sitemapPath), 'built site has no sitemap.xml');
    assert(fs.existsSync(robotsPath), 'built site has no robots.txt');
    if (fs.existsSync(sitemapPath)) {
      const sitemap = fs.readFileSync(sitemapPath, 'utf8');
      const expectedSitemapRoutes = 96 + literatureSlugs.length + 1 + shollSteckelChapterSlugs.length + 1 + cohenLouieSlugs.length + 1 + giustinoSlugs.length + libraryPaperRoutes.length;
      assert(count(sitemap, /<url>/g) === expectedSitemapRoutes, `sitemap must contain exactly ${expectedSitemapRoutes} canonical public routes`);
      assert(!sitemap.includes('/reading/martin/'), 'sitemap includes the compatibility redirect');
      assert(!sitemap.includes('/404'), 'sitemap includes the 404 page');
      for (const slug of forbiddenCorePartSlugs) assert(!sitemap.includes(`/core/${slug}/`), `sitemap includes unpublished Core ${slug}`);
    }
    if (fs.existsSync(robotsPath)) assert(fs.readFileSync(robotsPath, 'utf8').includes('/sitemap.xml'), 'robots.txt lacks the sitemap pointer');

    for (const relative of expectedHtml) {
      const text = fs.readFileSync(path.join(dist, relative), 'utf8');
      if (relative !== 'reading/literature/index.html' && !relative.startsWith('reading/literature/')) assert(!/<script(?:\s|>)/i.test(text), `${relative} contains an out-of-scope script element`);
      assert(!text.includes('/Electronic-Structure-Learning//'), `${relative} contains a malformed base path`);
      if (relative === '404.html') {
        assert(text.includes('name="robots" content="noindex"'), '404 is not marked noindex');
        assert(!text.includes('rel="canonical"'), '404 emits a canonical URL');
      } else if (relative !== 'reading/martin/index.html') {
        assert(count(text, /rel="canonical"/g) === 1, `${relative} must emit one canonical URL`);
      }
      assert(!/<aside class="callout"/.test(text), `${relative} contains a complementary landmark callout`);
      assert(count(text, /class="math-display" tabindex="0"/g) === count(text, /class="math-display"/g), `${relative} has non-focusable display mathematics`);
      for (const match of text.matchAll(/href="([^"]+)"/g)) {
        const target = match[1];
        if (/^(?:https?:|mailto:|#)/.test(target)) continue;
        const normalized = target.replace(/^\.\//, '').replace(/^\//, '').replace(/^Electronic-Structure-Learning\//, '');
        const route = normalized.split('#')[0];
        if (!route || route.startsWith('../')) continue;
        if (route.startsWith('_astro/')) {
          assert(fs.existsSync(path.join(dist, route)), `${relative} links to a missing built asset: ${target}`);
          continue;
        }
        assert(internalRoutes.has(route) || route === '404.html', `${relative} links to an undeclared route: ${target}`);
      }
    }
    checkTheoryPages(dist, 'built');
    checkCorePages(dist, 'built');
    checkLiteraturePages(dist, 'built');

    for (const slug of forbiddenCorePartSlugs) {
      assert(!fs.existsSync(path.join(dist, `core/${slug}/index.html`)), `unpublished Core route was built: ${slug}`);
    }

    const book = fs.readFileSync(path.join(dist, 'reading/books/martin/index.html'), 'utf8');
    assert(book.includes('Read Part I'), 'built Martin page does not link Part I');
    const partI = fs.readFileSync(path.join(dist, 'reading/books/martin/part-i/index.html'), 'utf8');
    assert(partI.includes('Read Chapter 1'), 'built Part I does not link Chapter 1');
    const chapter1 = fs.readFileSync(path.join(dist, 'reading/books/martin/chapter-01/index.html'), 'utf8');
    for (const marker of ['Core Idea.', 'Chapter overview', '1.1 Quantum Theory and the Origins of Electronic Structure', 'class="source-outline"']) {
      assert(chapter1.includes(marker), `built Chapter 1 is missing ${marker}`);
    }
    for (const slug of martinUnpublishedUnitSlugs) {
      assert(!fs.existsSync(path.join(dist, `reading/books/martin/${slug}/index.html`)), `unfinished Martin unit was published: ${slug}`);
    }
    const shollBook = fs.readFileSync(path.join(dist, 'reading/books/sholl-steckel/index.html'), 'utf8');
    assert(shollBook.includes('Read Chapter 1'), 'built Sholl & Steckel page does not link Chapter 1');
    for (const slug of shollSteckelChapterSlugs) {
      const relative = `reading/books/sholl-steckel/${slug}/index.html`;
      const text = fs.readFileSync(path.join(dist, relative), 'utf8');
      for (const marker of ['Core Idea.', 'Chapter overview', 'Source visuals and reading notes', 'Source anchor']) {
        assert(text.includes(marker), `${relative} is missing ${marker}`);
      }
    }
    const cohenBook = fs.readFileSync(path.join(dist, 'reading/books/cohen-louie/index.html'), 'utf8');
    for (const marker of ['Read the Part I guide', 'Chapter 1', 'Cambridge record for the book']) {
      assert(cohenBook.includes(marker), `built Cohen & Louie page is missing ${marker}`);
    }
    for (const slug of cohenLouiePartSlugs) {
      const relative = `reading/books/cohen-louie/${slug}/index.html`;
      const text = fs.readFileSync(path.join(dist, relative), 'utf8');
      for (const marker of ['How this Part moves', 'Part synthesis', 'Read Chapter']) assert(text.includes(marker), `${relative} is missing ${marker}`);
    }
    for (const slug of cohenLouieChapterSlugs) {
      const relative = `reading/books/cohen-louie/${slug}/index.html`;
      const text = fs.readFileSync(path.join(dist, relative), 'utf8');
      for (const marker of ['Core Idea.', 'Chapter overview', 'Source visuals and reading notes', 'Source anchor']) assert(text.includes(marker), `${relative} is missing ${marker}`);
    }
    const giustinoBook = fs.readFileSync(path.join(dist, 'reading/books/giustino/index.html'), 'utf8');
    for (const marker of ['Read Chapter 1', 'Read Appendix A', 'Oxford University Press record']) {
      assert(giustinoBook.includes(marker), `built Giustino page is missing ${marker}`);
    }
    for (const slug of giustinoSlugs) {
      const relative = `reading/books/giustino/${slug}/index.html`;
      const text = fs.readFileSync(path.join(dist, relative), 'utf8');
      for (const marker of ['Core Idea.', 'overview', 'Source visuals and reading notes', 'Source anchor']) assert(text.includes(marker), `${relative} is missing ${marker}`);
    }
    const redirect = fs.readFileSync(path.join(dist, 'reading/martin/index.html'), 'utf8');
    assert(redirect.includes('reading/books/martin'), 'Martin compatibility redirect target is missing');
  }
}

if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Clean-slate validation passed in ${sourceMode && builtMode ? 'source+built' : sourceMode ? 'source' : 'built'} mode.`);
