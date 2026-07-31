import assert from 'node:assert/strict';
import {
  exchangeCorrelationHole,
  holeAnalyticIntegrals,
  normalizedGaussian,
  sampleHole,
  twoLevelAdiabatic,
  twoLevelCanonical,
} from '../src/lib/chapter03Models.mjs';

const close = (actual, expected, tolerance = 1e-10, label = '') => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label || 'value'}: ${actual} != ${expected} within ${tolerance}`,
  );
};

const uncoupled = twoLevelAdiabatic(2, 0, 1);
close(uncoupled.lowerEnergy, -2, 1e-12, 'uncoupled lower energy');
close(uncoupled.upperEnergy, 2, 1e-12, 'uncoupled upper energy');
close(uncoupled.gap, 4, 1e-12, 'uncoupled gap');
close(uncoupled.lowerState1Weight, 0, 1e-12, 'uncoupled state-1 weight');
close(uncoupled.lowerState2Weight, 1, 1e-12, 'uncoupled state-2 weight');
close(uncoupled.lowerForce, 1, 1e-12, 'uncoupled lower force');

const avoidedCrossing = twoLevelAdiabatic(0, 0.5, 1);
close(avoidedCrossing.lowerEnergy, -0.5, 1e-12, 'crossing lower energy');
close(avoidedCrossing.upperEnergy, 0.5, 1e-12, 'crossing upper energy');
close(avoidedCrossing.gap, 1, 1e-12, 'avoided-crossing gap');
close(avoidedCrossing.lowerState1Weight, 0.5, 1e-12, 'crossing state-1 weight');
close(avoidedCrossing.lowerForce, 0, 1e-12, 'crossing force');

const exactCrossing = twoLevelAdiabatic(0, 0, 1);
assert.equal(exactCrossing.crossingIsDegenerate, true);
close(exactCrossing.gap, 0, 1e-12, 'exact crossing gap');

const zeroTemperature = twoLevelCanonical(1, 0);
close(zeroTemperature.p0, 1, 1e-12, 'zero-T ground probability');
close(zeroTemperature.p1, 0, 1e-12, 'zero-T excited probability');
close(zeroTemperature.purity, 1, 1e-12, 'zero-T purity');
close(zeroTemperature.entropy, 0, 1e-12, 'zero-T entropy');

const thermal = twoLevelCanonical(1.2, 0.8);
close(thermal.p0 + thermal.p1, 1, 1e-12, 'probability normalization');
close(thermal.freeEnergy, thermal.internalEnergy - thermal.temperature * thermal.entropy, 1e-12, 'F=U-TS');
assert.ok(thermal.p0 > thermal.p1, 'ground state must be more probable for positive gap');
assert.ok(thermal.purity < 1 && thermal.purity > 0.5, 'two-level thermal purity must lie in (1/2,1)');

const highTemperature = twoLevelCanonical(1, 1e6);
close(highTemperature.p0, 0.5, 3e-7, 'high-T p0');
close(highTemperature.p1, 0.5, 3e-7, 'high-T p1');
close(highTemperature.entropy, Math.log(2), 1e-10, 'high-T entropy');

const degenerateZeroTemperature = twoLevelCanonical(0, 0);
close(degenerateZeroTemperature.p0, 0.5, 1e-12, 'degenerate zero-T p0');
close(degenerateZeroTemperature.entropy, Math.log(2), 1e-12, 'degenerate zero-T entropy convention');

close(normalizedGaussian(0, 1), 1 / Math.sqrt(2 * Math.PI), 1e-12, 'Gaussian origin');
const atOrigin = exchangeCorrelationHole(0, {
  exchangeWidth: 1,
  correlationAmplitude: 0.4,
  correlationNarrowWidth: 0.5,
  correlationBroadWidth: 2,
});
assert.ok(atOrigin.exchange < 0, 'exchange hole must be negative at origin');
assert.ok(atOrigin.correlation < 0, 'chosen correlation hole must deepen the origin');

const analytic = holeAnalyticIntegrals();
assert.deepEqual(analytic, {
  exchange: -1,
  correlation: 0,
  exchangeCorrelation: -1,
});

const samples = sampleHole(
  {
    exchangeWidth: 1,
    correlationAmplitude: 0.4,
    correlationNarrowWidth: 0.5,
    correlationBroadWidth: 2,
  },
  { minimum: -12, maximum: 12, count: 12001 },
);
const step = samples[1].x - samples[0].x;
const trapezoid = (key) => samples.reduce((sum, point, index) => {
  const weight = index === 0 || index === samples.length - 1 ? 0.5 : 1;
  return sum + weight * point[key] * step;
}, 0);
close(trapezoid('exchange'), -1, 1e-10, 'numeric exchange-hole integral');
close(trapezoid('correlation'), 0, 2e-9, 'numeric correlation-hole integral');
close(trapezoid('exchangeCorrelation'), -1, 2e-9, 'numeric xc-hole integral');

assert.throws(() => twoLevelAdiabatic(0, -1), RangeError);
assert.throws(() => twoLevelCanonical(-1, 1), RangeError);
assert.throws(() => normalizedGaussian(0, 0), RangeError);

console.log('Chapter 3 teaching-model validation passed: avoided crossing, two-level density matrix, and exchange-correlation-hole sum rules checked.');
