import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  hardSpherePhaseShifts,
  partialWaveCrossSection,
  phaseEquivalentShift,
  planeWavePartialExpansion,
  sphericalBesselJ,
  sphericalDerivative,
  sphericalNeumannN,
  squareWellBoundStates,
  squareWellPhaseShift,
  wrapPhaseModuloPi,
} from '../src/data/part07/scatteringPhaseModel.mjs';

const close = (actual, expected, tolerance = 1e-11, label = 'value') => {
  assert.ok(Number.isFinite(actual), `${label}: non-finite value ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, received ${actual}`);
};
const closeRelative = (actual, expected, relativeTolerance, label) => {
  assert.ok(Number.isFinite(actual), `${label}: non-finite value ${actual}`);
  const scale = Math.max(Math.abs(expected), Number.MIN_VALUE);
  assert.ok(Math.abs(actual - expected) <= relativeTolerance * scale, `${label}: expected ${expected}, received ${actual}`);
};
const oddDoubleFactorial = (l) => {
  let result = 1;
  for (let n = 1; n <= l; n += 1) result *= 2 * n + 1;
  return result;
};

// Spherical Bessel/Neumann identities, parity, derivatives, and high-l stability.
for (const x of [0.2, 0.7, 1.8, 5.4]) {
  close(sphericalBesselJ(0, x), Math.sin(x) / x, 3e-15, `j0 at x=${x}`);
  close(sphericalNeumannN(0, x), -Math.cos(x) / x, 3e-15, `n0 at x=${x}`);
  for (let l = 0; l <= 8; l += 1) {
    close(sphericalBesselJ(l, -x), (-1) ** l * sphericalBesselJ(l, x), 2e-13, `j parity l=${l}, x=${x}`);
  }
}
// The direct Wronskian subtraction is tested only where j_l and n_l are not separated by extreme dynamic range.
for (const x of [0.7, 1.8, 5.4]) {
  for (let l = 0; l <= 8; l += 1) {
    const wronskian = sphericalBesselJ(l, x) * sphericalDerivative('n', l, x)
      - sphericalDerivative('j', l, x) * sphericalNeumannN(l, x);
    closeRelative(wronskian, 1 / x ** 2, 2e-8, `Wronskian l=${l}, x=${x}`);
  }
}
// High-l, small-x behavior is validated independently against j_l(x)~x^l/(2l+1)!!.
for (const l of [8, 12, 16, 20]) {
  const x = 0.2;
  const expected = x ** l / oddDoubleFactorial(l);
  const actual = sphericalBesselJ(l, x);
  assert.ok(Number.isFinite(actual) && actual > 0, `high-l j_${l} must remain finite and positive`);
  closeRelative(actual, expected, 0.006, `high-l small-x asymptotic l=${l}`);
}
assert.throws(() => sphericalNeumannN(0, 0), RangeError, 'Neumann singularity at zero must fail closed');

// Plane-wave partial-wave identity across easy and demanding regimes.
const expansionChecks = [
  { kr: 0.2, theta: 0.8, lMax: 8, tolerance: 1e-9 },
  { kr: 1, theta: 1.1, lMax: 12, tolerance: 1e-10 },
  { kr: 5.2, theta: 0.8, lMax: 16, tolerance: 1e-7 },
  { kr: 8, theta: 1.3, lMax: 20, tolerance: 2e-7 },
];
for (const check of expansionChecks) {
  const result = planeWavePartialExpansion(check);
  assert.ok(result.absoluteError < check.tolerance, `plane-wave expansion failed at kr=${check.kr}: ${result.absoluteError}`);
}
assert.throws(() => planeWavePartialExpansion({ lMax: 21 }), RangeError, 'unsupported lMax must fail closed');

// Phase shifts are modulo pi; S and sin^2(delta) are invariant.
for (const phase of [-1.2, -0.3, 0.2, 1.1]) {
  const equivalent = phaseEquivalentShift(phase, 3);
  close(equivalent.sinSquaredOriginal, equivalent.sinSquaredShifted, 2e-15, 'sin-squared branch invariance');
  close(equivalent.sMatrixOriginal.re, equivalent.sMatrixShifted.re, 2e-15, 'S-matrix real branch invariance');
  close(equivalent.sMatrixOriginal.im, equivalent.sMatrixShifted.im, 2e-15, 'S-matrix imaginary branch invariance');
  assert.ok(wrapPhaseModuloPi(phase) > -Math.PI / 2 - 1e-15 && wrapPhaseModuloPi(phase) <= Math.PI / 2 + 1e-15, 'wrapped phase range');
}

// Square-well value/slope matching and log-derivative reconstruction.
for (const l of [0, 1, 2, 3]) {
  for (const k of [0.55, 1.15, 1.8]) {
    const result = squareWellPhaseShift({ l, k, radius: 1.35, wellDepth: 1.7 });
    close(result.valueMismatch, 0, 2e-13, `value match l=${l}, k=${k}`);
    close(result.derivativeMismatch, 0, 3e-12, `slope match l=${l}, k=${k}`);
    close(result.sMatrix.re ** 2 + result.sMatrix.im ** 2, 1, 3e-15, `elastic S unitarity l=${l}, k=${k}`);
    close(Math.tan(result.phase), result.tanPhase, 2e-12, `tan phase reconstruction l=${l}, k=${k}`);
  }
}
assert.throws(() => squareWellPhaseShift({ radius: 0 }), RangeError, 'zero matching radius must fail closed');

// Hard-sphere cross section, optical theorem, unitarity, and low-energy s-wave limit.
for (const k of [0.35, 0.9, 1.6, 2.5]) {
  const result = partialWaveCrossSection({ k, radius: 1.2, lMax: 8, points: 181 });
  close(result.opticalTheoremTotal, result.total, 2e-12, `optical theorem at k=${k}`);
  assert.ok(result.total >= 0 && result.transport >= 0, 'cross sections must be nonnegative');
  assert.ok(result.unitarityError < 3e-15, `elastic unitarity at k=${k}`);
  for (const channel of result.phases) {
    const contribution = (4 * Math.PI / k ** 2) * (2 * channel.l + 1) * channel.sinSquared;
    const limit = (4 * Math.PI / k ** 2) * (2 * channel.l + 1);
    assert.ok(contribution <= limit + 1e-12, `partial-wave unitarity limit l=${channel.l}`);
  }
}
const lowEnergy = partialWaveCrossSection({ k: 1e-3, radius: 1, lMax: 0, points: 61 });
close(lowEnergy.total, 4 * Math.PI, 2e-5, 'low-energy hard-sphere s-wave cross section');
assert.equal(hardSpherePhaseShifts({ k: 1, radius: 1, lMax: 4 }).length, 5, 'hard-sphere channel count');

// s-wave square-well threshold and bound-state roots in a pole-free teaching interval.
const radius = 1.5;
const threshold = Math.PI ** 2 / (8 * radius ** 2);
const below = squareWellBoundStates({ radius, wellDepth: 0.9 * threshold, samples: 900 });
const above = squareWellBoundStates({ radius, wellDepth: 1.5 * threshold, samples: 900 });
close(below.thresholdDepth, threshold, 2e-15, 'analytic first-state threshold');
assert.equal(below.count, 0, 'no s-wave bound state below threshold');
assert.equal(above.count, 1, 'one s-wave bound state above threshold in first interval');
assert.ok(above.roots[0] > 0 && above.roots[0] < above.wellDepth, 'bound-state root must lie inside the well-depth interval');
assert.throws(() => squareWellBoundStates({ wellDepth: 0 }), RangeError, 'nonpositive well depth must fail closed');

// Content and actual render-tree assembly.
const paths = {
  route: 'src/content/docs/part-07-appendices/appendix-j-scattering-and-phase-shifts.mdx',
  index: 'src/content/docs/part-07-appendices/index.mdx',
  body: 'src/components/part07/appJ/AppendixJBody.astro',
  contents: 'src/components/part07/appJ/AppendixJContents.astro',
  orientation: 'src/components/part07/appJ/AppendixJOrientation.mdx',
  matching: 'src/components/part07/appJ/AppendixJMatching.mdx',
  review: 'src/components/part07/appJ/AppendixJCrossBoundReview.mdx',
  expansionVisual: 'src/components/part07/appJ/PartialWaveExpansionExplorer.astro',
  matchingVisual: 'src/components/part07/appJ/PhaseShiftMatchingExplorer.astro',
  crossVisual: 'src/components/part07/appJ/CrossSectionExplorer.astro',
  boundVisual: 'src/components/part07/appJ/BoundStateContinuationExplorer.astro',
};
const content = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
);
assert.match(content.route, /<AppendixJBody\s*\/>/, 'Appendix J route must render AppendixJBody');
assert.match(content.route, /status="appendix-content-complete"/, 'Appendix J route status must be content complete');
for (const component of ['AppendixJContents', 'AppendixJOrientation', 'AppendixJMatching', 'AppendixJCrossBoundReview']) {
  assert.match(content.body, new RegExp(`<${component}\\s*/>`), `body must render ${component}`);
}
for (const marker of ['partial-wave-expansion', 'radial-matching', 'phase-shift-cross-sections', 'negative-energy-bound-states', 'review']) {
  assert.ok(Object.values(content).join('\n').includes(marker), `Appendix J must expose ${marker}`);
}
assert.ok(content.contents.includes('J.1'), 'source map must contain the sole source section J.1');
for (const [container, visual] of [
  ['orientation', 'PartialWaveExpansionExplorer'],
  ['matching', 'PhaseShiftMatchingExplorer'],
  ['review', 'CrossSectionExplorer'],
  ['review', 'BoundStateContinuationExplorer'],
]) {
  assert.match(content[container], new RegExp(`<${visual}\\s*/>`), `${visual} must be assembled in ${container}`);
}
const visualContracts = ['expansionVisual', 'matchingVisual', 'crossVisual', 'boundVisual']
  .map((key) => (content[key].match(/chapter-visual__contract/g) ?? []).length)
  .reduce((sum, count) => sum + count, 0);
assert.equal(visualContracts, 4, 'four visualization contracts must be present');
const combined = Object.values(content).join('\n');
assert.doesNotMatch(combined, /目录级阅读骨架|outline · 正文待填充|TODO/i, 'Appendix J must not retain outline or TODO markers');
assert.ok((combined.match(/bilingual-section__zh/g) ?? []).length >= 20, 'substantive Chinese bilingual coverage');
assert.ok((combined.match(/bilingual-section__en/g) ?? []).length >= 20, 'substantive English bilingual coverage');
for (const required of ['κ²=ε', 'ε=k²/2', 'modulo', 'optical theorem', 'single-centre', 'Figure J.1', 'no exercise section']) {
  assert.ok(combined.includes(required), `required Appendix J boundary missing: ${required}`);
}
assert.ok((content.review.match(/<li><strong>/g) ?? []).length >= 10, 'ten original exercises must be present');
assert.match(content.index, /\| I · Alternative Force Expressions \| complete and deployed \|/, 'Part VII index must retain Appendix I deployed state');
assert.match(
  content.index,
  /\| J · Scattering and Phase Shifts \| (?:content complete(?:; deployment identity follows the site manifest)?|complete and deployed) \|/,
  'Part VII index must expose Appendix J as content-complete or deployed',
);
assert.doesNotMatch(content.index, /\| J · Scattering and Phase Shifts \| outline \|/, 'Appendix J must never regress to outline state');

console.log('Part VII Appendix J validation passed: stable spherical functions, plane-wave expansion, radial matching, phase branches, optical theorem, hard-sphere limit, bound-state threshold, and route assembly.');
