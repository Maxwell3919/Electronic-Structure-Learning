import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  integrateSpectrum,
  locateSpectrumMaximum,
  sampleTwoLevelSpectrum,
  twoLevelPolarizability,
} from '../src/data/part05/ch21ResponseModels.mjs';
import {
  coupledTransitionModes,
  sampleCouplingScan,
} from '../src/data/part05/ch21LinearResponseModels.mjs';
import {
  cayleyFactor,
  estimateAngularFrequencyResolution,
  finiteTimeSpectrum,
  propagateScalarMode,
  sampleDampedSignal,
  secondOrderTaylorFactor,
} from '../src/data/part05/ch21TimePropagationModels.mjs';
import {
  dielectricLocalFieldModel,
  excitonTransitionModel,
  sampleExcitonAttractionScan,
} from '../src/data/part05/ch21OpticalModels.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const near = (actual, expected, tolerance, message) => {
  assert(Number.isFinite(actual), `${message}: actual is not finite`);
  assert(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} vs ${expected}`);
};

const checks = [];
const check = (name, fn) => {
  fn();
  checks.push(name);
};

check('causal two-level polarizability', () => {
  const transitionEnergy = 4;
  const strength = 1.3;
  const damping = 0.2;
  const spectrum = sampleTwoLevelSpectrum({
    transitionEnergy,
    strength,
    damping,
    maxFrequency: 20,
    points: 4001,
  });
  assert(spectrum.every((point) => point.imaginary >= -1e-14), 'positive-frequency absorption sign');
  assert(spectrum.every((point) => point.absorption >= -1e-14), 'non-negative absorption');

  const staticResponse = twoLevelPolarizability({
    frequency: 0,
    transitionEnergy,
    strength,
    damping: 1e-6,
  });
  near(staticResponse.real, 2 * strength / transitionEnergy, 1e-10, 'static zero-damping limit');
  near(staticResponse.staticLimit, 2 * strength / transitionEnergy, 1e-15, 'declared static limit');

  const doubled = sampleTwoLevelSpectrum({
    transitionEnergy,
    strength: 2 * strength,
    damping,
    maxFrequency: 20,
    points: 4001,
  });
  for (let index = 0; index < spectrum.length; index += 157) {
    near(doubled[index].imaginary, 2 * spectrum[index].imaginary, 1e-12, 'strength scaling of Im alpha');
    near(doubled[index].real, 2 * spectrum[index].real, 1e-12, 'strength scaling of Re alpha');
  }
  near(
    integrateSpectrum(doubled, 'absorption'),
    2 * integrateSpectrum(spectrum, 'absorption'),
    1e-10,
    'integrated absorption strength scaling',
  );

  const peak = locateSpectrumMaximum(spectrum, 'imaginary');
  assert(Math.abs(peak.frequency - transitionEnergy) < 2 * damping, 'resonance near transition energy');
});

check('coupled-transition eigenvalues and strength conservation', () => {
  const uncoupled = coupledTransitionModes({
    energy1: 3,
    energy2: 5,
    coupling: 0,
    dipole1: 1,
    dipole2: 0.4,
  });
  near(uncoupled.lower.energy, 3, 1e-14, 'uncoupled lower energy');
  near(uncoupled.upper.energy, 5, 1e-14, 'uncoupled upper energy');

  const coupling = 0.7;
  const coupled = coupledTransitionModes({
    energy1: 3,
    energy2: 5,
    coupling,
    dipole1: 1,
    dipole2: 0.4,
  });
  const expectedRadius = Math.hypot(-1, coupling);
  near(coupled.lower.energy, 4 - expectedRadius, 1e-14, 'analytic lower eigenvalue');
  near(coupled.upper.energy, 4 + expectedRadius, 1e-14, 'analytic upper eigenvalue');
  near(coupled.outputStrength, coupled.inputStrength, 1e-14, 'oscillator-strength norm');
  assert(coupled.splitting > 2, 'level repulsion');

  const symmetric = coupledTransitionModes({
    energy1: 4,
    energy2: 4,
    coupling: 0.6,
    dipole1: 1,
    dipole2: 1,
  });
  near(symmetric.lower.strength, 0, 1e-14, 'dark antisymmetric combination');
  near(symmetric.upper.strength, 2, 1e-14, 'bright symmetric combination');

  const scan = sampleCouplingScan({ points: 51 });
  assert(scan.length === 51, 'coupling scan length');
  assert(scan.every((point) => Math.abs(point.outputStrength - point.inputStrength) < 1e-13), 'scan strength conservation');
});

check('unitary Cayley propagation and Taylor drift', () => {
  const cayley = cayleyFactor({ energy: 5, timeStep: 0.15 });
  const taylor = secondOrderTaylorFactor({ energy: 5, timeStep: 0.15 });
  near(cayley.real ** 2 + cayley.imaginary ** 2, 1, 1e-15, 'Cayley factor norm');
  assert(taylor.real ** 2 + taylor.imaginary ** 2 > 1, 'Taylor factor must drift upward in this model');

  const cayleyTrajectory = propagateScalarMode({
    energy: 5,
    timeStep: 0.15,
    steps: 200,
    method: 'cayley',
  });
  const taylorTrajectory = propagateScalarMode({
    energy: 5,
    timeStep: 0.15,
    steps: 200,
    method: 'taylor2',
  });
  near(cayleyTrajectory.normSquared, 1, 5e-14, 'repeated Cayley norm');
  assert(taylorTrajectory.normSquared > 10, 'repeated Taylor norm drift');
});

check('finite-time frequency resolution', () => {
  near(
    estimateAngularFrequencyResolution(80),
    2 * Math.PI / 80,
    1e-15,
    'resolution formula',
  );
  near(
    estimateAngularFrequencyResolution(80) / estimateAngularFrequencyResolution(40),
    0.5,
    1e-15,
    'inverse-time scaling',
  );

  const signal = sampleDampedSignal({
    modes: [{ frequency: 4, amplitude: 1 }],
    timeStep: 0.025,
    totalTime: 80,
  });
  const spectrum = finiteTimeSpectrum({
    signal,
    windowDamping: 0.03,
    maxFrequency: 8,
    points: 1601,
  });
  const peak = spectrum.reduce(
    (best, point) => point.magnitude > best.magnitude ? point : best,
    spectrum[0],
  );
  assert(Math.abs(peak.frequency - 4) < estimateAngularFrequencyResolution(80), 'finite-time peak localization');
  assert(spectrum.every((point) => point.magnitude >= 0), 'non-negative Fourier magnitude');

  const inputModes = [{ frequency: 4, amplitude: 1 }];
  sampleDampedSignal({ modes: inputModes, totalTime: 1, timeStep: 0.1 });
  assert(!Object.hasOwn(inputModes[0], 'damping'), 'signal helper must not mutate caller input');
});

check('effective exciton model and binding threshold', () => {
  const zeroAttraction = excitonTransitionModel({ attraction: 0 });
  near(zeroAttraction.lower.energy, 6.25, 1e-14, 'zero-attraction lower transition');
  near(zeroAttraction.upper.energy, 7.2, 1e-14, 'zero-attraction upper transition');
  assert(!zeroAttraction.isBound, 'zero-attraction state is above the declared edge');
  near(zeroAttraction.totalStrength, zeroAttraction.inputStrength, 1e-14, 'zero-attraction strength');

  const strong = excitonTransitionModel({ attraction: 2.5 });
  assert(strong.lower.energy < zeroAttraction.lower.energy, 'attraction lowers the lowest pole');
  assert(strong.isBound && strong.bindingEnergy > 0, 'strong attraction produces a bound model pole');
  near(strong.totalStrength, strong.inputStrength, 1e-13, 'interacting strength conservation');

  const scan = sampleExcitonAttractionScan({ points: 101 });
  assert(scan.every((point, index, array) => index === 0 || point.lower.energy <= array[index - 1].lower.energy + 1e-13), 'lowest pole is non-increasing with attraction');
  assert(scan.some((point) => point.isBound), 'scan crosses the declared continuum edge');
});

check('dielectric-matrix inversion and local fields', () => {
  const diagonal = dielectricLocalFieldModel({ head: 8, wing: 0, body: 5 });
  near(diagonal.macroscopic, 8, 1e-15, 'zero-wing macroscopic dielectric');
  near(diagonal.inverse00, 1 / 8, 1e-15, 'zero-wing inverse head');

  const result = dielectricLocalFieldModel({ head: 8, wing: 2, body: 5 });
  near(result.determinant, 36, 1e-15, 'dielectric determinant');
  near(result.macroscopic, 8 - 4 / 5, 1e-15, 'Schur-complement macroscopic dielectric');
  assert(Math.abs(result.inverse00 - result.naiveInverseHead) > 1e-3, 'local-field inversion order must matter');

  const [[a, b], [, d]] = result.matrix;
  const [[ia, ib], [, id]] = result.inverse;
  near(a * ia + b * ib, 1, 1e-14, 'inverse product 00');
  near(a * ib + b * id, 0, 1e-14, 'inverse product 01');
  near(b * ia + d * ib, 0, 1e-14, 'inverse product 10');
  near(b * ib + d * id, 1, 1e-14, 'inverse product 11');
});

check('chapter content completeness and hygiene', () => {
  const routePath = 'src/content/docs/part-05-properties-of-matter/chapter-21-excitation-spectra-and-optical-properties.mdx';
  const bodyPath = 'src/components/part05/ch21/Chapter21Body.astro';
  const contentsPath = 'src/components/part05/ch21/Chapter21Contents.astro';
  const contentPaths = [
    'src/components/part05/ch21/Chapter21OrientationAndTerms.mdx',
    'src/components/part05/ch21/Chapter21SourceMap.astro',
    'src/components/part05/ch21/Chapter21Foundations.mdx',
    'src/components/part05/ch21/Chapter21LinearResponse.mdx',
    'src/components/part05/ch21/Chapter21RealTime.mdx',
    'src/components/part05/ch21/Chapter21OpticalSystems.mdx',
    'src/components/part05/ch21/Chapter21BeyondAdiabatic.mdx',
    'src/components/part05/ch21/Chapter21Closing.mdx',
  ];
  const visualPaths = [
    'src/components/part05/ch21/TwoLevelPolarizabilityExplorer.astro',
    'src/components/part05/ch21/CoupledTransitionExplorer.astro',
    'src/components/part05/ch21/RealTimeResolutionExplorer.astro',
    'src/components/part05/ch21/ExcitonBindingExplorer.astro',
    'src/components/part05/ch21/DielectricLocalFieldExplorer.astro',
  ];

  const route = read(routePath);
  const body = read(bodyPath);
  const contents = read(contentsPath);
  const content = contentPaths.map(read).join('\n');
  const allChapterText = [route, body, contents, content, ...visualPaths.map(read)].join('\n');

  assert(route.includes('<SourceNote'), 'route SourceNote');
  assert(route.includes('<Chapter21Contents />') && route.includes('<Chapter21Body />'), 'route assembly');
  assert(!route.includes('<ReadingOutline'), 'outline component must be removed');
  assert(!route.includes('正文待填充'), 'outline placeholder must be removed');

  for (let section = 1; section <= 9; section += 1) {
    assert(content.includes(`id=\"section-21-${section}\"`), `missing section 21.${section}`);
  }
  assert((contents.match(/<li>/g) ?? []).length === 13, 'contents link count');
  assert((content.match(/<BilingualSection/g) ?? []).length >= 20, 'bilingual section count');
  assert(content.includes('Original Exercises') && content.includes('原创练习'), 'original exercises');
  assert(content.includes('Kohn–Sham gap') && content.includes('optical gap'), 'gap evidence boundary');
  assert(content.includes('numerical $\\eta$') || content.includes('数值 $\\eta$'), 'broadening evidence boundary');
  assert(content.includes('double excitation') || content.includes('双激发'), 'beyond-adiabatic boundary');

  const sourceMap = read('src/components/part05/ch21/Chapter21SourceMap.astro');
  for (let section = 1; section <= 9; section += 1) {
    assert(sourceMap.includes(`'21.${section}'`), `source-map treatment 21.${section}`);
  }

  for (const visualPath of visualPaths) {
    const visual = read(visualPath);
    assert(visual.includes('<figure class=\"chapter-visual'), `${visualPath}: figure class`);
    assert(visual.includes('chapter-visual__contract'), `${visualPath}: model contract`);
    assert(visual.includes('<noscript>'), `${visualPath}: no-JS fallback`);
    assert(visual.includes('<input'), `${visualPath}: keyboard-operable input`);
  }

  const controlCharacters = allChapterText.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g) ?? [];
  assert(controlCharacters.length === 0, `forbidden control characters: ${controlCharacters.length}`);
  assert(!/\bTODO\b|\bTBD\b|lorem ipsum/i.test(allChapterText), 'unfinished placeholders');
});

console.log(`Chapter 21 validation passed (${checks.length} checks):`);
for (const name of checks) console.log(`  - ${name}`);
