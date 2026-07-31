import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  diatomicFrequencies,
  enforceAcousticSumRule,
  forceConstantRowSums,
  frozenPhononCurvature,
  loToFrequencies,
  monoatomicFrequency,
  projectedTwoLevelResponse,
  sampleDiatomicDispersion,
  sampleFrozenPhononError,
} from '../src/data/part05/ch20LatticeModels.mjs';
import {
  dampedSpinResponse,
  sampleDampedSpinSpectrum,
  sampleEliashbergSpectrum,
} from '../src/data/part05/ch20SpectralModels.mjs';

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

check('monoatomic dispersion and mass scaling', () => {
  near(monoatomicFrequency({ q: 0, spring: 2, mass: 3 }), 0, 1e-14, 'omega(0)');
  const q = 0.61;
  const positive = monoatomicFrequency({ q, spring: 2, mass: 3 });
  const negative = monoatomicFrequency({ q: -q, spring: 2, mass: 3 });
  near(positive, negative, 1e-14, 'omega(q)=omega(-q)');
  const doubledMass = monoatomicFrequency({ q, spring: 2, mass: 6 });
  near(doubledMass / positive, 1 / Math.sqrt(2), 1e-13, 'mass scaling');
});

check('diatomic acoustic and optical limits', () => {
  const spring = 1.7;
  const mass1 = 1.2;
  const mass2 = 2.8;
  const gamma = diatomicFrequencies({ q: 0, spring, mass1, mass2 });
  near(gamma.acoustic, 0, 1e-13, 'Gamma acoustic mode');
  near(
    gamma.optical,
    Math.sqrt(2 * spring * (1 / mass1 + 1 / mass2)),
    1e-13,
    'Gamma optical mode',
  );
  const dispersion = sampleDiatomicDispersion({ spring, mass1, mass2, points: 41 });
  assert(dispersion.length === 41, 'dispersion point count');
  assert(dispersion.every((point) => point.acoustic >= 0 && point.optical >= point.acoustic), 'branch ordering');
});

check('acoustic sum-rule correction', () => {
  const matrix = [
    [2.1, -1.0, -0.8],
    [-1.0, 2.0, -0.9],
    [-0.8, -0.9, 1.6],
  ];
  assert(forceConstantRowSums(matrix).some((value) => Math.abs(value) > 1e-8), 'fixture must violate ASR');
  const corrected = enforceAcousticSumRule(matrix);
  assert(forceConstantRowSums(corrected).every((value) => Math.abs(value) < 1e-13), 'ASR row sums');
});

check('frozen-phonon truncation and noise balance', () => {
  const h = 0.12;
  const quartic = 0.6;
  const noiseless = frozenPhononCurvature({ displacement: h, curvature: 1.3, quartic });
  near(noiseless.signedError, 0.5 * quartic * h ** 2, 1e-13, 'quartic truncation error');
  const noisy = frozenPhononCurvature({
    displacement: h,
    curvature: 1.3,
    quartic,
    energyNoise: 2e-6,
  });
  near(
    noisy.signedError,
    noisy.anharmonicError + noisy.noiseError,
    1e-12,
    'declared noise plus anharmonic error',
  );
  const window = sampleFrozenPhononError({
    curvature: 1.3,
    quartic,
    energyNoise: 2e-6,
    minDisplacement: 0.005,
    maxDisplacement: 0.4,
    points: 121,
  });
  const bestIndex = window.reduce(
    (best, point, index, array) => point.absoluteError < array[best].absoluteError ? index : best,
    0,
  );
  assert(bestIndex > 0 && bestIndex < window.length - 1, 'optimal displacement should lie inside the sampled window');
});

check('projected Sternheimer equivalence', () => {
  const response = projectedTwoLevelResponse({ occupiedEnergy: -1.4, emptyEnergy: 2.2, coupling: 0.31 });
  near(response.explicitSumAmplitude, response.projectedLinearSolveAmplitude, 1e-15, 'sum and linear solve');
  near(response.emptyAmplitude, 0.31 / (-3.6), 1e-15, 'response denominator');
});

check('LO-TO nonanalytic scaling', () => {
  const base = loToFrequencies({
    transverseFrequency: 4,
    effectiveCharge: 2,
    dielectricConstant: 5,
    volume: 8,
  });
  const zeroCharge = loToFrequencies({
    transverseFrequency: 4,
    effectiveCharge: 0,
    dielectricConstant: 5,
    volume: 8,
  });
  near(zeroCharge.longitudinal, zeroCharge.transverse, 1e-15, 'zero-charge splitting');
  const doubleCharge = loToFrequencies({
    transverseFrequency: 4,
    effectiveCharge: 4,
    dielectricConstant: 5,
    volume: 8,
  });
  near(doubleCharge.nonanalyticShift / base.nonanalyticShift, 4, 1e-14, 'charge-squared scaling');
  const transverseDirection = loToFrequencies({
    transverseFrequency: 4,
    effectiveCharge: 2,
    dielectricConstant: 5,
    volume: 8,
    directionCosine: 0,
  });
  near(transverseDirection.nonanalyticShift, 0, 1e-15, 'transverse direction');
});

check('Eliashberg spectrum quadrature', () => {
  const result = sampleEliashbergSpectrum({ width: 1.5, maxFrequency: 75, points: 1501 });
  assert(result.lambda > 0, 'lambda must be positive');
  assert(result.omegaLog > 0 && result.omegaLog < 75, 'omega_log range');
  assert(result.cumulative.length === result.spectrum.length - 1, 'cumulative length');
  assert(result.cumulative.every((point, index, array) => index === 0 || point.lambda >= array[index - 1].lambda), 'cumulative lambda monotonicity');
  near(result.cumulative.at(-1).lambda, result.lambda, 1e-13, 'cumulative endpoint');
  const refined = sampleEliashbergSpectrum({ width: 1.5, maxFrequency: 75, points: 3001 });
  assert(Math.abs(refined.lambda - result.lambda) / refined.lambda < 5e-3, 'lambda quadrature refinement');
});

check('damped spin-response limits', () => {
  near(dampedSpinResponse({ frequency: 0.4, modeFrequency: 1, damping: 0 }), 0, 1e-15, 'zero damping away from pole');
  assert(dampedSpinResponse({ frequency: 1, modeFrequency: 1, damping: 0 }) === Number.POSITIVE_INFINITY, 'undamped pole');
  const weak = dampedSpinResponse({ frequency: 1, modeFrequency: 1, damping: 0.05 });
  const broad = dampedSpinResponse({ frequency: 1, modeFrequency: 1, damping: 0.2 });
  assert(weak > broad, 'peak height should fall as damping rises');
  const spectrum = sampleDampedSpinSpectrum({ modeFrequency: 1, damping: 0.12, points: 401 });
  assert(spectrum.every((point) => point.intensity >= 0), 'non-negative spectral weight');
});

check('chapter content completeness and hygiene', () => {
  const routePath = 'src/content/docs/part-05-properties-of-matter/chapter-20-response-functions-phonons-and-magnons.mdx';
  const bodyPath = 'src/components/part05/ch20/Chapter20Body.astro';
  const contentPaths = [
    'src/components/part05/ch20/Chapter20OrientationAndTerms.mdx',
    'src/components/part05/ch20/Chapter20SourceMap.astro',
    'src/components/part05/ch20/Chapter20LatticeAndDirect.mdx',
    'src/components/part05/ch20/Chapter20DensityResponse.mdx',
    'src/components/part05/ch20/Chapter20VariationalAndPeriodic.mdx',
    'src/components/part05/ch20/Chapter20EffectiveCharges.mdx',
    'src/components/part05/ch20/Chapter20EPCSpin.mdx',
    'src/components/part05/ch20/Chapter20Closing.mdx',
  ];
  const visualPaths = [
    'src/components/part05/ch20/ChainDispersionExplorer.astro',
    'src/components/part05/ch20/FrozenPhononCurvatureExplorer.astro',
    'src/components/part05/ch20/SternheimerResponseExplorer.astro',
    'src/components/part05/ch20/LOTOEffectiveChargeExplorer.astro',
    'src/components/part05/ch20/EliashbergSpectrumExplorer.astro',
  ];

  const route = read(routePath);
  const body = read(bodyPath);
  const content = contentPaths.map(read).join('\n');
  const allChapterText = [route, body, content, ...visualPaths.map(read)].join('\n');

  assert(route.includes('<SourceNote'), 'route SourceNote');
  assert(route.includes('<Chapter20Contents />') && route.includes('<Chapter20Body />'), 'route assembly');
  assert(!route.includes('<ReadingOutline'), 'outline component must be removed');
  assert(!route.includes('正文待填充'), 'outline placeholder must be removed');

  for (let section = 1; section <= 9; section += 1) {
    assert(content.includes(`id=\"section-20-${section}\"`), `missing section 20.${section}`);
  }
  assert((content.match(/<BilingualSection/g) ?? []).length >= 16, 'bilingual section count');
  assert(content.includes('Original Exercises') && content.includes('原创练习'), 'original exercises');
  assert(content.includes('Gamma') && content.includes('full zone'), 'full-zone evidence boundary');
  assert(content.includes('DOS') && content.includes('superconduct'), 'EPC evidence boundary');

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

console.log(`Chapter 20 validation passed (${checks.length} checks):`);
for (const name of checks) console.log(`  - ${name}`);
