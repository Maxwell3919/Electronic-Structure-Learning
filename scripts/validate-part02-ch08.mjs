import assert from 'node:assert/strict';

import {
  CX_UNPOLARIZED,
  PBE_KAPPA,
  PBE_MU,
  densityParameterRs,
  discreteSemilocalEnergyAndGradient,
  exchangeSpinScaling,
  fermiWavevector,
  gaussianHoleValue,
  pbeExchangeEnhancement,
  sampleGaussianHole,
  samplePeriodicDensity,
  uniformGasExchangePerElectron,
  uniformGasQuantities,
} from '../src/data/part02/ch08TeachingModels.mjs';

function close(actual, expected, tolerance = 1e-10, label = 'value') {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected}, received ${actual}`,
  );
}

// 1. Gaussian model hole is non-positive.
for (const radius of [0, 0.1, 0.5, 1, 2, 5]) {
  assert.ok(gaussianHoleValue(radius, 0.8) <= 0, `hole sign at radius ${radius}`);
}

// 2. The six-sigma radial charge approaches the exact -1 sum rule.
for (const width of [0.45, 0.8, 1.25]) {
  const model = sampleGaussianHole({ width, maximumRadius: 6 * width, sampleCount: 4001 });
  close(model.integratedCharge, -1, 1e-7, `hole charge for width ${width}`);
}

// 3. Width changes shape but not total charge.
const narrowHole = sampleGaussianHole({ width: 0.5, maximumRadius: 3, sampleCount: 4001 });
const broadHole = sampleGaussianHole({ width: 1, maximumRadius: 6, sampleCount: 4001 });
close(narrowHole.integratedCharge, broadHole.integratedCharge, 1e-8, 'width-invariant charge');
assert.ok(Math.abs(gaussianHoleValue(0, 0.5)) > Math.abs(gaussianHoleValue(0, 1)));

// 4. Density parameter and Fermi wavevector have the exact density scaling.
const n1 = 0.01;
const n2 = 0.08;
close(densityParameterRs(n2) / densityParameterRs(n1), 0.5, 1e-12, 'rs scaling');
close(fermiWavevector(n2) / fermiWavevector(n1), 2, 1e-12, 'kF scaling');

// 5. Exchange spin scaling is even and has the exact endpoints.
close(exchangeSpinScaling(0), 1, 1e-12, 'unpolarized spin factor');
close(exchangeSpinScaling(1), 2 ** (1 / 3), 1e-12, 'fully polarized spin factor');
for (const zeta of [0.1, 0.35, 0.7, 1]) {
  close(exchangeSpinScaling(zeta), exchangeSpinScaling(-zeta), 1e-12, `spin evenness at ${zeta}`);
}

// 6. Uniform-gas exchange scales as n^(1/3) and becomes more negative with polarization.
close(
  uniformGasExchangePerElectron(n2, 0) / uniformGasExchangePerElectron(n1, 0),
  2,
  1e-12,
  'exchange density scaling',
);
assert.ok(uniformGasExchangePerElectron(0.02, 1) < uniformGasExchangePerElectron(0.02, 0));
const ueg = uniformGasQuantities(0.02, 0.4);
close(ueg.rs, densityParameterRs(0.02), 1e-12, 'UEG rs forwarding');
close(ueg.kF, fermiWavevector(0.02), 1e-12, 'UEG kF forwarding');

// 7. Periodic density keeps its declared spatial average.
for (const modulation of [0, 0.2, 0.5, 0.85]) {
  const model = samplePeriodicDensity({ averageDensity: 0.02, modulation, sampleCount: 4001 });
  close(model.averageFromGrid, 0.02, 2e-12, `periodic average at a=${modulation}`);
  close(model.samples[0].density, model.samples.at(-1).density, 1e-12, 'periodic endpoint');
}

// 8. Uniform LDA exchange matches the analytic constant-density integral.
const uniform = samplePeriodicDensity({ averageDensity: 0.02, modulation: 0, length: 2, sampleCount: 4001 });
close(
  uniform.exchangeEnergy,
  -CX_UNPOLARIZED * 2 * 0.02 ** (4 / 3),
  2e-12,
  'uniform LDA exchange integral',
);

// 9. Modulation at fixed mean makes the convex exchange integral more negative.
const weak = samplePeriodicDensity({ averageDensity: 0.02, modulation: 0.2, sampleCount: 4001 });
const strong = samplePeriodicDensity({ averageDensity: 0.02, modulation: 0.8, sampleCount: 4001 });
assert.ok(weak.exchangeEnergy < uniform.exchangeEnergy / 2);
assert.ok(strong.exchangeEnergy < weak.exchangeEnergy);

// 10. PBE-type enhancement has the declared limits, bound, and monotonicity.
close(pbeExchangeEnhancement(0), 1, 1e-12, 'PBE uniform limit');
let previous = pbeExchangeEnhancement(0);
for (let index = 1; index <= 1000; index += 1) {
  const s = (10 * index) / 1000;
  const current = pbeExchangeEnhancement(s);
  assert.ok(current >= previous - 1e-14, `PBE monotonicity at s=${s}`);
  assert.ok(current < 1 + PBE_KAPPA, `PBE upper bound at s=${s}`);
  previous = current;
}
close(pbeExchangeEnhancement(1e5), 1 + PBE_KAPPA, 1e-9, 'PBE large-s limit');

// 11. The small-gradient coefficient is mu.
for (const s of [1e-4, 3e-4, 1e-3]) {
  close((pbeExchangeEnhancement(s) - 1) / s ** 2, PBE_MU, 5e-7, `PBE small-s coefficient at ${s}`);
}

// 12. Analytic discrete semilocal gradient matches independent finite differences.
const density = Array.from({ length: 31 }, (_, index) => 0.03 * (1 + 0.35 * Math.cos((2 * Math.PI * index) / 31)));
const baseline = discreteSemilocalEnergyAndGradient(density, {
  localCoefficient: 0.75,
  gradientCoefficient: 0.12,
  length: 1,
});
const step = 1e-7;
for (const index of [0, 1, 7, 15, 23, 30]) {
  const plus = density.slice();
  const minus = density.slice();
  plus[index] += step;
  minus[index] -= step;
  const numerical = (
    discreteSemilocalEnergyAndGradient(plus).energy -
    discreteSemilocalEnergyAndGradient(minus).energy
  ) / (2 * step);
  close(numerical, baseline.gradient[index], 2e-8, `discrete chain-rule gradient at ${index}`);
}

// Invalid-input boundaries.
assert.throws(() => gaussianHoleValue(-0.1, 1), RangeError);
assert.throws(() => sampleGaussianHole({ width: 0 }), RangeError);
assert.throws(() => uniformGasQuantities(0), RangeError);
assert.throws(() => exchangeSpinScaling(1.1), RangeError);
assert.throws(() => samplePeriodicDensity({ modulation: 1 }), RangeError);
assert.throws(() => pbeExchangeEnhancement(-0.1), RangeError);
assert.throws(() => discreteSemilocalEnergyAndGradient([1, 1, 1, 1]), RangeError);

console.log('Part II Chapter 8 teaching-model validation passed: 12 deterministic groups.');
