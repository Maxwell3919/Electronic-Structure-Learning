import assert from 'node:assert/strict';
import {
  compareQuadraticPhases,
  gapHierarchy,
  minimizeQuadraticEnthalpy,
  propertyRoutes,
  quadraticPhaseEnergy,
} from '../src/lib/chapter02Models.mjs';

const close = (actual, expected, tolerance = 1e-10) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
};

const phaseA = { equilibriumVolume: 20, curvature: 0.5, offset: 0 };
const phaseB = { equilibriumVolume: 16, curvature: 0.5, offset: 0.2 };

close(quadraticPhaseEnergy(20, phaseA), 0);
close(quadraticPhaseEnergy(18, phaseA), 1);

const zeroPressureA = minimizeQuadraticEnthalpy(0, phaseA);
close(zeroPressureA.volume, 20);
close(zeroPressureA.enthalpy, 0);

assert.equal(compareQuadraticPhases(0, phaseA, phaseB).stablePhase, 'A');
assert.equal(compareQuadraticPhases(0.2, phaseA, phaseB).stablePhase, 'B');

const equalOffsetLarge = { equilibriumVolume: 20, curvature: 1, offset: 0 };
const equalOffsetDense = { equilibriumVolume: 16, curvature: 1, offset: 0 };
assert.equal(compareQuadraticPhases(0, equalOffsetLarge, equalOffsetDense).stablePhase, 'coexistence');
assert.equal(compareQuadraticPhases(0.1, equalOffsetLarge, equalOffsetDense).stablePhase, 'B');

const gaps = gapHierarchy({ ksGap: 1.1, derivativeCorrection: 0.7, excitonBinding: 0.3 });
close(gaps.fundamentalGap, 1.8);
close(gaps.opticalGap, 1.5);
assert.equal(gaps.bindingClamped, false);

const clamped = gapHierarchy({ ksGap: 0.2, derivativeCorrection: 0.1, excitonBinding: 0.5 });
close(clamped.opticalGap, 0);
assert.equal(clamped.bindingClamped, true);

assert.deepEqual(Object.keys(propertyRoutes), [
  'structure',
  'phonon',
  'quasiparticle',
  'optical',
  'topology',
]);
for (const [routeId, route] of Object.entries(propertyRoutes)) {
  for (const key of ['labelZh', 'labelEn', 'objectZh', 'objectEn', 'methodZh', 'methodEn', 'boundaryZh', 'boundaryEn']) {
    assert.equal(typeof route[key], 'string', `${routeId}.${key} must be a string`);
    assert.ok(route[key].length > 0, `${routeId}.${key} must not be empty`);
  }
}

console.log('Chapter 2 teaching-model validation passed: EOS competition, gap hierarchy, and 5 property routes checked.');
