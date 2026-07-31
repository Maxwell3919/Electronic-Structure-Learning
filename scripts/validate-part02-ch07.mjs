import assert from 'node:assert/strict';
import {
  boxDensityAt,
  boxKineticEnergy,
  boxOrbitalValue,
  kohnShamEnergyFromEigenvalueSum,
  sampleBoxDensity,
  spinDegenerateOccupations,
  trapezoidIntegral,
} from '../src/data/part02/ch07TeachingModels.mjs';

const close = (actual, expected, tolerance = 1e-10, label = 'value') => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected}, received ${actual}`,
  );
};

const initialEnergy = kohnShamEnergyFromEigenvalueSum({
  eigenvalueSum: -12,
  hartreeEnergy: 4,
  exchangeCorrelationEnergy: -2.2,
  exchangeCorrelationPotentialIntegral: -3,
  ionIonEnergy: 1.5,
});
close(initialEnergy.hartreeCorrection, -4, 1e-12, 'Hartree correction');
close(initialEnergy.exchangeCorrelationCorrection, 0.8, 1e-12, 'XC correction');
close(initialEnergy.totalEnergy, -13.7, 1e-12, 'default total energy');

for (const inputs of [
  { eigenvalueSum: -8, hartreeEnergy: 0, exchangeCorrelationEnergy: 0, exchangeCorrelationPotentialIntegral: 0, ionIonEnergy: 0 },
  { eigenvalueSum: -15.5, hartreeEnergy: 6.2, exchangeCorrelationEnergy: -3.4, exchangeCorrelationPotentialIntegral: -4.1, ionIonEnergy: 2.3 },
]) {
  const result = kohnShamEnergyFromEigenvalueSum(inputs);
  close(
    result.totalEnergy,
    inputs.eigenvalueSum - inputs.hartreeEnergy + inputs.exchangeCorrelationEnergy - inputs.exchangeCorrelationPotentialIntegral + inputs.ionIonEnergy,
    1e-12,
    'energy algebra identity',
  );
}

assert.deepEqual(spinDegenerateOccupations(1, 4), [1, 0, 0, 0]);
assert.deepEqual(spinDegenerateOccupations(4, 4), [2, 2, 0, 0]);
assert.deepEqual(spinDegenerateOccupations(7, 4), [2, 2, 2, 1]);
assert.deepEqual(spinDegenerateOccupations(8, 4), [2, 2, 2, 2]);

for (let index = 1; index <= 4; index += 1) {
  const samples = Array.from({ length: 4001 }, (_, point) => {
    const x = point / 4000;
    return { x, density: boxOrbitalValue(index, x, 1) ** 2 };
  });
  close(trapezoidIntegral(samples), 1, 2e-10, `orbital ${index} normalization`);
  close(boxOrbitalValue(index, 0, 1), 0, 1e-12, `orbital ${index} lower boundary`);
  close(boxOrbitalValue(index, 1, 1), 0, 2e-15, `orbital ${index} upper boundary`);
}

for (let electrons = 1; electrons <= 8; electrons += 1) {
  const model = sampleBoxDensity({
    electronCount: electrons,
    orbitalCount: 4,
    length: 1,
    sampleCount: 4001,
  });
  close(trapezoidIntegral(model.samples), electrons, 2e-9, `density normalization for N=${electrons}`);
  close(model.samples[0].density, 0, 1e-12, `density lower boundary for N=${electrons}`);
  close(model.samples.at(-1).density, 0, 1e-12, `density upper boundary for N=${electrons}`);

  for (const point of [0.1, 0.23, 0.5, 0.77, 0.9]) {
    close(
      boxDensityAt(point, electrons, 4, 1),
      boxDensityAt(1 - point, electrons, 4, 1),
      2e-12,
      `box-density reflection symmetry for N=${electrons}, x=${point}`,
    );
  }
}

close(boxKineticEnergy(1, 4, 1), Math.PI ** 2 / 2, 1e-12, 'N=1 kinetic energy');
close(boxKineticEnergy(2, 4, 1), Math.PI ** 2, 1e-12, 'N=2 kinetic energy');
close(boxKineticEnergy(3, 4, 1), 3 * Math.PI ** 2, 1e-12, 'N=3 kinetic energy');
close(boxKineticEnergy(4, 4, 1), 5 * Math.PI ** 2, 1e-12, 'N=4 kinetic energy');
close(boxKineticEnergy(8, 4, 1), 30 * Math.PI ** 2, 1e-12, 'N=8 kinetic energy');

assert.throws(() => spinDegenerateOccupations(0, 4), RangeError);
assert.throws(() => spinDegenerateOccupations(9, 4), RangeError);
assert.throws(() => boxOrbitalValue(1, -0.1, 1), RangeError);
assert.throws(() => sampleBoxDensity({ electronCount: 4, sampleCount: 2 }), RangeError);

console.log('Part II Chapter 7 teaching-model validation passed: 11 deterministic groups.');
