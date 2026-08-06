import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const sourceMode = process.argv.includes('--source') || !process.argv.includes('--built');
const builtMode = process.argv.includes('--built');
const count = (text, expression) => (text.match(expression) ?? []).length;

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
const martinPartSlugs = ['part-i', 'part-ii', 'part-iii', 'part-iv', 'part-v', 'part-vi', 'part-vii'];
const martinChapterSlugs = Array.from({ length: 28 }, (_, index) => `chapter-${String(index + 1).padStart(2, '0')}`);
const martinAppendixSlugs = 'abcdefghijklmnopqr'.split('').map((letter) => `appendix-${letter}`);
const martinSlugs = [...martinPartSlugs, ...martinChapterSlugs, ...martinAppendixSlugs];
const martinRoutes = martinSlugs.map((slug) => `reading/books/martin/${slug}/`);

const expectedPages = [
  'src/pages/404.astro', 'src/pages/computational-tools/index.astro', 'src/pages/index.astro',
  'src/pages/methods/index.astro', 'src/pages/reading/books/index.astro',
  'src/pages/reading/books/martin/[slug].astro', 'src/pages/reading/books/martin/index.astro',
  'src/pages/reading/index.astro', 'src/pages/reference/index.astro', 'src/pages/theory/index.astro',
  ...theorySlugs.map((slug) => `src/pages/theory/${slug}/index.astro`),
].sort();
const expectedHtml = [
  '404.html', 'computational-tools/index.html', 'index.html', 'methods/index.html',
  'reading/books/index.html', 'reading/books/martin/index.html',
  ...martinSlugs.map((slug) => `reading/books/martin/${slug}/index.html`),
  'reading/index.html', 'reading/martin/index.html', 'reference/index.html', 'theory/index.html',
  ...theorySlugs.map((slug) => `theory/${slug}/index.html`),
].sort();
const internalRoutes = new Set([
  '', 'theory/', ...theorySlugs.map((slug) => `theory/${slug}/`),
  'reading/', 'reading/books/', 'reading/books/martin/', 'reading/martin/', ...martinRoutes,
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
    checkMathMl(text, relative, mode === 'source');
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
};

if (sourceMode) {
  const trackedOutput = execFileSync('git', ['ls-files', '-co', '--exclude-standard'], { cwd: root, encoding: 'utf8' }).trim();
  const tracked = trackedOutput ? trackedOutput.split('\n').filter(Boolean) : [];
  const actualPages = tracked.filter((file) => file.startsWith('src/pages/')).sort();
  assert(JSON.stringify(actualPages) === JSON.stringify(expectedPages), `public page sources differ from the reviewed set: ${actualPages.join(', ')}`);

  for (const directory of ['src/content', 'src/components', 'src/data', 'src/lib', 'schemas', 'templates']) {
    assert(!fs.existsSync(path.join(root, directory)), `legacy directory still exists: ${directory}`);
  }
  assert(!tracked.some((file) => file.startsWith('src/pages/reading/lectures/')), 'empty lecture routes must not be published');

  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert(JSON.stringify(Object.keys(packageJson.dependencies ?? {}).sort()) === JSON.stringify(['astro']), 'Astro must be the only production dependency');
  assert(JSON.stringify(Object.keys(packageJson.devDependencies ?? {}).sort()) === JSON.stringify(['@astrojs/check', 'typescript']), 'unexpected development dependency');

  const sources = tracked.filter((file) => file.startsWith('src/')).map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
  assert(!sources.includes('/Electronic-Structure-Learning/'), 'source hard-codes the Pages base path');
  assert(!/\bclient:(?:load|idle|visible|media|only)\b/.test(sources), 'client hydration directive remains');
  assert(!/<script(?:\s|>)/i.test(sources), 'page-specific client script remains');
  for (const term of ['checkpoint', 'claim ledger', 'reading mode', 'reading contract', 'card grid', 'status badge']) {
    assert(!sources.toLowerCase().includes(term), `legacy or administrative term remains in public source: ${term}`);
  }
  assert(!tracked.some((file) => /(?:^|\/)(?:POTCAR|.*\.(?:pdf|zip|key|pem))$/i.test(file)), 'restricted or archive file remains tracked');

  const theorySource = fs.readFileSync(path.join(root, 'src/pages/theory/index.astro'), 'utf8');
  assert(theorySource.includes('<h1>How Much Theory Do You Need?</h1>'), 'Foundations title is missing');
  for (const slug of theorySlugs) assert(theorySource.includes(`/theory/${slug}/`), `Foundations is missing ${slug}`);
  checkTheoryPages(root, 'source');

  const book = fs.readFileSync(path.join(root, 'src/pages/reading/books/martin/index.astro'), 'utf8');
  for (const marker of ['part.summary', 'part.progression', 'part.route', 'Read Part', 'martinReadingUnits.length']) {
    assert(book.includes(marker), `Martin book page is missing ${marker}`);
  }
  const routePage = fs.readFileSync(path.join(root, 'src/pages/reading/books/martin/[slug].astro'), 'utf8');
  for (const marker of ['getStaticPaths', 'Core Idea.', 'Chapter structure', 'Appendix structure', 'entry.contribution', 'href(entry.route)']) {
    assert(routePage.includes(marker), `Martin route page is missing ${marker}`);
  }
  assert(!routePage.includes('Read Section'), 'Martin route page creates section-level navigation');
  checkReadingManifest();

  const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
  assert(agents.includes('.github/agent-guides/book-guided-reading-style.md'), 'AGENTS.md does not require the book-writing guide');
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
    assert(!builtFiles.some((file) => /\.(?:js|mjs|cjs)$/i.test(file)), 'built site contains client JavaScript');
    assert(!builtFiles.some((file) => /\.(?:woff2?|ttf|otf)$/i.test(file)), 'built site contains packaged fonts');

    for (const relative of expectedHtml) {
      const text = fs.readFileSync(path.join(dist, relative), 'utf8');
      assert(!/<script(?:\s|>)/i.test(text), `${relative} contains a script element`);
      assert(!text.includes('/Electronic-Structure-Learning//'), `${relative} contains a malformed base path`);
      for (const match of text.matchAll(/href="([^"]+)"/g)) {
        const target = match[1];
        if (/^(?:https?:|mailto:|#)/.test(target)) continue;
        const normalized = target.replace(/^\.\//, '').replace(/^\//, '').replace(/^Electronic-Structure-Learning\//, '');
        const route = normalized.split('#')[0];
        if (!route || route.startsWith('../')) continue;
        assert(internalRoutes.has(route) || route === '404.html', `${relative} links to an undeclared route: ${target}`);
      }
    }
    checkTheoryPages(dist, 'built');

    const book = fs.readFileSync(path.join(dist, 'reading/books/martin/index.html'), 'utf8');
    assert(book.includes('Read Part I'), 'built Martin page does not link Part I');
    const partI = fs.readFileSync(path.join(dist, 'reading/books/martin/part-i/index.html'), 'utf8');
    assert(partI.includes('Read Chapter 1'), 'built Part I does not link Chapter 1');
    const chapter1 = fs.readFileSync(path.join(dist, 'reading/books/martin/chapter-01/index.html'), 'utf8');
    for (const marker of ['Core Idea.', 'Chapter overview', '1.1 Quantum Theory and the Origins of Electronic Structure']) {
      assert(chapter1.includes(marker), `built Chapter 1 is missing ${marker}`);
    }
    const appendixR = fs.readFileSync(path.join(dist, 'reading/books/martin/appendix-r/index.html'), 'utf8');
    for (const marker of ['Core Idea.', 'Appendix overview', 'Plane-wave codes']) {
      assert(appendixR.includes(marker), `built Appendix R is missing ${marker}`);
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
