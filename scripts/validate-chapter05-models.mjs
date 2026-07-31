import assert from 'node:assert/strict';
import {
  densityMatrixKernel,
  electronGasScales,
  exchangeHoleDimensionless,
  hfExchangeFactor,
  sameSpinPairDistribution,
  sampleExchangeHole,
  sampleStaticLindhard,
  staticLindhardShape,
  staticRpaScreening,
} from '../src/lib/chapter05Models.mjs';

const close = (actual, expected, tolerance = 1e-10, label = 'value') => {
  assert.ok(Number.isFinite(actual), `${label} must be finite, received ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} != ${expected}`);
};

const rs2 = electronGasScales({ rs: 2, zeta: 0 });
const rs4 = electronGasScales({ rs: 4, zeta: 0 });
close(rs2.density / rs4.density, 8, 1e-12, 'density scaling');
close(rs2.kF / rs4.kF, 2, 1e-12, 'kF scaling');
close(rs2.fermiEnergy / rs4.fermiEnergy, 4, 1e-12, 'Fermi-energy scaling');
close(rs2.kineticPerElectron / rs4.kineticPerElectron, 4, 1e-12, 'kinetic scaling');
close(rs2.exchangePerElectron / rs4.exchangePerElectron, 2, 1e-12, 'exchange scaling');
close(rs2.plasmaFrequency / rs4.plasmaFrequency, 2 ** 1.5, 1e-12, 'plasma scaling');
close(rs2.thomasFermiWavevector / rs4.thomasFermiWavevector, Math.sqrt(2), 1e-12, 'TF scaling');

const polarized = electronGasScales({ rs: 3, zeta: 1 });
const unpolarized = electronGasScales({ rs: 3, zeta: 0 });
close(polarized.densityDown, 0, 1e-14, 'fully polarized minority density');
close(polarized.kineticSpinFactor, 2 ** (2 / 3), 1e-12, 'kinetic spin factor');
close(polarized.exchangeSpinFactor, 2 ** (1 / 3), 1e-12, 'exchange spin factor');
assert.ok(polarized.kineticPerElectron > unpolarized.kineticPerElectron);
assert.ok(polarized.exchangePerElectron < unpolarized.exchangePerElectron);

close(densityMatrixKernel(0), 1, 1e-14, 'density-matrix origin');
close(densityMatrixKernel(1e-7), 1, 1e-12, 'density-matrix small-y limit');
close(sameSpinPairDistribution(0), 0, 1e-14, 'Pauli contact');
close(exchangeHoleDimensionless(0), -1, 1e-14, 'exchange-hole contact');
assert.ok(Math.abs(densityMatrixKernel(20)) < 0.02, 'density matrix must decay');
const holeSamples = sampleExchangeHole({ maximumY: 30, count: 601 });
assert.equal(holeSamples.length, 601);
assert.ok(holeSamples.every((point) => Number.isFinite(point.kernel) && point.pair >= -1e-12 && point.pair <= 1 + 1e-12));

const maximumY = 180;
const intervals = 180000;
const step = maximumY / intervals;
let radialIntegral = 0;
for (let index = 0; index <= intervals; index += 1) {
  const y = index * step;
  const weight = index === 0 || index === intervals ? 0.5 : 1;
  radialIntegral += weight * y * y * exchangeHoleDimensionless(y);
}
radialIntegral *= step;
const exchangeHoleCharge = 2 * radialIntegral / (3 * Math.PI);
close(exchangeHoleCharge, -1, 8e-3, 'exchange-hole normalization');

close(staticLindhardShape(0), 1, 1e-14, 'Lindhard q=0');
close(staticLindhardShape(1), 0.5, 1e-14, 'Lindhard 2kF value');
assert.ok(staticLindhardShape(0.5) > staticLindhardShape(1));
assert.ok(staticLindhardShape(1) > staticLindhardShape(2));
assert.ok(staticLindhardShape(10) > 0);
close(staticLindhardShape(10) * 3 * 10 ** 2, 1, 1.1e-2, 'large-q Lindhard asymptote');

const leftSlope = (staticLindhardShape(1 - 1e-4) - staticLindhardShape(1 - 2e-4)) / 1e-4;
const farSlope = (staticLindhardShape(0.8) - staticLindhardShape(0.7)) / 0.1;
assert.ok(Math.abs(leftSlope) > Math.abs(farSlope), '2kF derivative must sharpen');

const qZero = staticRpaScreening({ rs: 3, x: 0 });
assert.equal(qZero.dielectric, Number.POSITIVE_INFINITY);
close(qZero.screenedToBare, 0, 0, 'q=0 screened ratio');
const finiteScreening = staticRpaScreening({ rs: 3, x: 0.5 });
assert.ok(finiteScreening.dielectric > 1);
assert.ok(finiteScreening.screenedToBare > 0 && finiteScreening.screenedToBare < 1);
const responseSamples = sampleStaticLindhard({ rs: 3, maximumX: 2.5, count: 301 });
assert.equal(responseSamples.length, 301);
assert.ok(responseSamples.slice(1).every((point) => Number.isFinite(point.shape) && Number.isFinite(point.dielectric)));

close(hfExchangeFactor(0), -2, 1e-12, 'HF factor at zero');
close(hfExchangeFactor(1), -1, 1e-12, 'HF factor at kF');
assert.ok(hfExchangeFactor(10) < 0 && Math.abs(hfExchangeFactor(10)) < 0.01);

assert.throws(() => electronGasScales({ rs: 0 }), RangeError);
assert.throws(() => electronGasScales({ rs: 2, zeta: 1.1 }), RangeError);
assert.throws(() => staticLindhardShape(-1), RangeError);
assert.throws(() => sampleExchangeHole({ count: 1 }), RangeError);
assert.throws(() => staticRpaScreening({ rs: -1, x: 1 }), RangeError);
assert.throws(() => hfExchangeFactor(-0.1), RangeError);

console.log('Chapter 5 teaching-model validation passed: electron-gas scaling, exchange-hole normalization, static Lindhard response, screening, and Hartree-Fock limits checked.');
