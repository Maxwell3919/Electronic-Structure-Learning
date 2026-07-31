import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  diagonalDerivativeScale,
  harmonicFrequency,
  harmonicZeroPointEnergy,
  localAdiabaticityIndicator,
  sampleAvoidedCrossing,
  twoLevelAdiabaticState,
} from '../src/data/part07/adiabaticCouplingModel.mjs';

const close = (actual, expected, tolerance = 1e-12, label = 'value') => {
  assert.ok(Number.isFinite(actual), `${label}: non-finite value ${actual}`);
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected}, received ${actual}`,
  );
};

// Analytic two-level avoided-crossing identities.
const slope = 1.4;
const coupling = 0.35;
const crossing = twoLevelAdiabaticState(0, { slope, coupling });
close(crossing.lower, -coupling, 1e-15, 'lower energy at crossing');
close(crossing.upper, coupling, 1e-15, 'upper energy at crossing');
close(crossing.gap, 2 * coupling, 1e-15, 'minimum gap');
close(crossing.derivativeCoupling, slope / (2 * coupling), 1e-14, 'derivative coupling at crossing');
close(crossing.potentialDerivativeMatrix, slope, 1e-14, 'potential derivative at crossing');
close(
  crossing.potentialDerivativeMatrix / crossing.gap,
  crossing.derivativeCoupling,
  1e-14,
  'Eq. C.8 at crossing',
);

for (const coordinate of [-2.3, -0.7, 0, 0.4, 1.8]) {
  const state = twoLevelAdiabaticState(coordinate, { slope, coupling });
  close(state.upper, -state.lower, 1e-14, `spectral symmetry R=${coordinate}`);
  close(
    state.potentialDerivativeMatrix / state.gap,
    state.derivativeCoupling,
    1e-14,
    `Eq. C.8 R=${coordinate}`,
  );
}

// The derivative coupling peaks at the avoided crossing and decreases away from it.
const samples = sampleAvoidedCrossing({ slope, coupling, count: 401 });
const maximum = samples.reduce((current, point) => (
  point.derivativeCoupling > current.derivativeCoupling ? point : current
));
close(maximum.coordinate, 0, 1e-15, 'derivative-coupling peak coordinate');
close(maximum.derivativeCoupling, crossing.derivativeCoupling, 1e-14, 'derivative-coupling peak');

// Local mixing indicator: linear in velocity and inverse-quadratic in coupling at R=0.
const indicatorA = localAdiabaticityIndicator({ slope: 1, coupling: 0.2, velocity: 0.03 });
const indicatorB = localAdiabaticityIndicator({ slope: 1, coupling: 0.2, velocity: 0.06 });
close(indicatorB / indicatorA, 2, 1e-14, 'velocity scaling');
const indicatorWideGap = localAdiabaticityIndicator({ slope: 1, coupling: 0.4, velocity: 0.03 });
close(indicatorA / indicatorWideGap, 4, 1e-13, 'inverse-square gap scaling at crossing');

// Diagonal derivative magnitude scales as 1/M for fixed electronic geometry.
const derivativeScaleLight = diagonalDerivativeScale({ coupling: 0.3, massRatio: 1000 });
const derivativeScaleHeavy = diagonalDerivativeScale({ coupling: 0.3, massRatio: 4000 });
close(derivativeScaleLight / derivativeScaleHeavy, 4, 1e-14, 'diagonal derivative mass scaling');

// Harmonic frequency and zero-point energy scale as M^(-1/2).
const omegaLight = harmonicFrequency({ forceConstant: 0.8, massRatio: 1200 });
const omegaHeavy = harmonicFrequency({ forceConstant: 0.8, massRatio: 4800 });
close(omegaLight / omegaHeavy, 2, 1e-14, 'harmonic frequency mass scaling');
close(
  harmonicZeroPointEnergy({ forceConstant: 0.8, massRatio: 1200 }),
  0.5 * omegaLight,
  1e-15,
  'harmonic zero-point energy',
);

// Fail closed on invalid physical/numerical inputs.
assert.throws(() => twoLevelAdiabaticState(Number.NaN), TypeError);
assert.throws(() => twoLevelAdiabaticState(0, { coupling: 0 }), RangeError);
assert.throws(() => twoLevelAdiabaticState(0, { slope: -1 }), RangeError);
assert.throws(() => localAdiabaticityIndicator({ velocity: -0.1 }), RangeError);
assert.throws(() => diagonalDerivativeScale({ massRatio: 0 }), RangeError);
assert.throws(() => harmonicFrequency({ forceConstant: 0, massRatio: 1 }), RangeError);
assert.throws(() => sampleAvoidedCrossing({ count: 1 }), RangeError);
assert.throws(() => sampleAvoidedCrossing({ minCoordinate: 2, maxCoordinate: 1 }), RangeError);

// Content and assembly contract.
const [
  body,
  contents,
  orientation,
  coupled,
  limits,
  electronPhonon,
  review,
  channelDiagram,
  avoidedExplorer,
  epDiagram,
] = await Promise.all([
  readFile('src/components/part07/appC/AppendixCBody.astro', 'utf8'),
  readFile('src/components/part07/appC/AppendixCContents.astro', 'utf8'),
  readFile('src/components/part07/appC/AppendixCOrientation.mdx', 'utf8'),
  readFile('src/components/part07/appC/AppendixCCoupledEquations.mdx', 'utf8'),
  readFile('src/components/part07/appC/AppendixCAdiabaticLimits.mdx', 'utf8'),
  readFile('src/components/part07/appC/AppendixCElectronPhonon.mdx', 'utf8'),
  readFile('src/components/part07/appC/AppendixCReview.mdx', 'utf8'),
  readFile('src/components/part07/appC/BornHuangChannelDiagram.astro', 'utf8'),
  readFile('src/components/part07/appC/AvoidedCrossingExplorer.astro', 'utf8'),
  readFile('src/components/part07/appC/ElectronPhononCouplingDiagram.astro', 'utf8'),
]);

const combined = [
  body,
  contents,
  orientation,
  coupled,
  limits,
  electronPhonon,
  review,
  channelDiagram,
  avoidedExplorer,
  epDiagram,
].join('\n');

for (const marker of [
  'section-c-1',
  'coupled-equations',
  'adiabatic-equation',
  'breakdown',
  'section-c-2',
  'cross-references',
  'review',
]) {
  assert.ok(combined.includes(marker), `missing Appendix C marker: ${marker}`);
}
assert.equal(
  (combined.match(/chapter-visual__contract/g) ?? []).length,
  3,
  'Appendix C must define three visualization contracts',
);

const visualAssembly = [
  {
    name: 'BornHuangChannelDiagram',
    source: coupled,
    importPattern: "import BornHuangChannelDiagram from './BornHuangChannelDiagram.astro';",
  },
  {
    name: 'AvoidedCrossingExplorer',
    source: limits,
    importPattern: "import AvoidedCrossingExplorer from './AvoidedCrossingExplorer.astro';",
  },
  {
    name: 'ElectronPhononCouplingDiagram',
    source: electronPhonon,
    importPattern: "import ElectronPhononCouplingDiagram from './ElectronPhononCouplingDiagram.astro';",
  },
];
for (const { name, source, importPattern } of visualAssembly) {
  assert.ok(source.includes(importPattern), `${name} import is missing from its assembled parent`);
  assert.ok(source.includes(`<${name} />`), `${name} is defined but not rendered`);
}

for (const component of [
  'AppendixCContents',
  'AppendixCOrientation',
  'AppendixCCoupledEquations',
  'AppendixCAdiabaticLimits',
  'AppendixCElectronPhonon',
  'AppendixCReview',
]) {
  assert.ok(body.includes(`<${component} />`), `${component} is not assembled in Appendix C body`);
}
assert.ok(!combined.includes('outline · 正文待填充'), 'Appendix C still contains an outline placeholder');

console.log('Part VII Appendix C validation passed: channel identities, gap/coupling limits, mass scaling, failures, visual assembly, and content contracts.');
