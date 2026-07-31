import assert from 'node:assert/strict';
import {
  constrainedFamilyA,
  constrainedFamilyB,
  constrainedOuterMinimum,
  constrainedUniversal,
  sampleConstrainedCurves,
  twoSiteGroundState,
} from '../src/data/part02/ch06TeachingModels.mjs';

const close = (actual, expected, tolerance = 1e-12, label = 'value') => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected}, received ${actual}`,
  );
};

const symmetric = twoSiteGroundState(0, 0, 1);
close(symmetric.nLeft, 0.5, 1e-12, 'symmetric left density');
close(symmetric.nRight, 0.5, 1e-12, 'symmetric right density');
close(symmetric.energy, -1, 1e-12, 'symmetric ground energy');

for (const delta of [-4, -1, 0, 1, 4]) {
  const state = twoSiteGroundState(delta, 0, 1);
  close(state.nLeft + state.nRight, 1, 1e-12, `density normalization at delta=${delta}`);
  assert.ok(state.nLeft >= 0 && state.nLeft <= 1, `left occupation outside [0,1] at delta=${delta}`);
  assert.ok(state.nRight >= 0 && state.nRight <= 1, `right occupation outside [0,1] at delta=${delta}`);
}

const unshifted = twoSiteGroundState(1.7, 0, 1);
const shifted = twoSiteGroundState(1.7, 1.25, 1);
close(shifted.nLeft, unshifted.nLeft, 1e-12, 'additive-shift left-density invariance');
close(shifted.nRight, unshifted.nRight, 1e-12, 'additive-shift right-density invariance');
close(shifted.energy - unshifted.energy, 1.25, 1e-12, 'additive energy shift');

for (const q of [-1, -0.35, 0, 0.4, 1]) {
  const inner = constrainedUniversal(q);
  close(inner.value, Math.min(constrainedFamilyA(q), constrainedFamilyB(q)), 1e-12, `inner minimum at q=${q}`);
  assert.equal(inner.family, inner.a <= inner.b ? 'A' : 'B', `inner family at q=${q}`);
}

const zeroSlope = constrainedOuterMinimum(0);
close(zeroSlope.q, 0, 1e-12, 'zero-slope minimizing density');
close(zeroSlope.energy, 0.55, 1e-12, 'zero-slope minimum energy');
assert.equal(zeroSlope.family, 'A', 'zero-slope minimizing family');

const negativeSlope = constrainedOuterMinimum(-0.2);
close(negativeSlope.q, 1, 1e-12, 'negative-slope boundary minimum');
close(negativeSlope.energy, 0.438375, 1e-12, 'negative-slope minimum energy');
assert.equal(negativeSlope.family, 'B', 'negative-slope minimizing family');

const positiveSlope = constrainedOuterMinimum(0.5);
close(positiveSlope.q, -0.3125, 1e-12, 'positive-slope interior minimum');
close(positiveSlope.energy, 0.471875, 1e-12, 'positive-slope minimum energy');
assert.equal(positiveSlope.family, 'A', 'positive-slope minimizing family');

for (const slope of [-0.5, -0.2, 0, 0.2, 0.5]) {
  const outer = constrainedOuterMinimum(slope);
  const samples = sampleConstrainedCurves(slope, 2001);
  const sampledMinimum = samples.reduce((best, point) => point.total < best.total ? point : best);
  assert.ok(
    outer.energy <= sampledMinimum.total + 2e-6,
    `analytic outer minimum is inconsistent with dense sampling at slope=${slope}`,
  );
}

const endpoints = sampleConstrainedCurves(0.1, 3);
assert.equal(endpoints.length, 3, 'sample count');
close(endpoints[0].q, -1, 1e-12, 'sample lower endpoint');
close(endpoints[2].q, 1, 1e-12, 'sample upper endpoint');

console.log('Part II Chapter 6 teaching-model validation passed: 8 deterministic groups.');
