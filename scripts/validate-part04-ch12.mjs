import assert from 'node:assert/strict';

import {
  centralDifferenceKinetic,
  finiteDifferenceDispersionRatio,
  nearlyFreeElectronEigenvalues,
  nearlyFreeElectronGap,
  oneDimensionalPlaneWaveCount,
  planeWaveSeriesValue,
  twoSiteStructureFactor,
} from '../src/data/part04/ch12TeachingModels.mjs';

const close = (actual, expected, tolerance, label) => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected}, received ${actual}`,
  );
};

assert.equal(oneDimensionalPlaneWaveCount(0), 1, 'N=0 has one constant plane wave');
assert.equal(oneDimensionalPlaneWaveCount(4), 9, 'N=4 contains harmonics -4...4');
for (let cutoff = 0; cutoff < 12; cutoff += 1) {
  assert.ok(
    oneDimensionalPlaneWaveCount(cutoff + 1) > oneDimensionalPlaneWaveCount(cutoff),
    'basis count must increase monotonically with the harmonic cutoff',
  );
}
close(planeWaveSeriesValue(0.73, 0), 0.5, 1e-14, 'zero-cutoff Fourier limit');

const coupling = 0.37;
const atBraggPlane = nearlyFreeElectronEigenvalues({ q: 0, velocity: 1.4, coupling });
close(atBraggPlane[1] - atBraggPlane[0], nearlyFreeElectronGap(coupling), 1e-14, 'NFE Bragg-plane gap');
const uncoupled = nearlyFreeElectronEigenvalues({ q: 0.61, velocity: 1.2, coupling: 0 });
close(uncoupled[0], -Math.abs(0.61 * 1.2), 1e-14, 'uncoupled lower branch');
close(uncoupled[1], Math.abs(0.61 * 1.2), 1e-14, 'uncoupled upper branch');

for (const oddOrder of [1, 3, 5, 7]) {
  const factor = twoSiteStructureFactor({ order: oddOrder, fractionalOffset: 0.5 });
  close(factor.intensity, 0, 1e-12, `half-cell odd-order extinction m=${oddOrder}`);
}
for (const evenOrder of [0, 2, 4, 6]) {
  const factor = twoSiteStructureFactor({ order: evenOrder, fractionalOffset: 0.5 });
  close(factor.real, 2, 1e-12, `half-cell even-order amplitude m=${evenOrder}`);
  close(factor.imaginary, 0, 1e-12, `half-cell even-order phase m=${evenOrder}`);
  close(factor.intensity, 4, 1e-12, `half-cell even-order intensity m=${evenOrder}`);
}

close(finiteDifferenceDispersionRatio(1e-3), 1, 1e-6, 'long-wavelength finite-difference limit');
close(finiteDifferenceDispersionRatio(Math.PI), 4 / (Math.PI * Math.PI), 1e-14, 'Nyquist-edge finite-difference ratio');
assert.ok(
  centralDifferenceKinetic(0.8) < 0.8 ** 2,
  'second-order central difference underestimates k² away from the long-wavelength limit',
);

console.log('Part IV Chapter 12 teaching-model validation passed.');
