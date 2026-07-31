import assert from 'node:assert/strict';
import {
  dot2,
  foldedFreeElectronBand,
  foldedFreeElectronBands,
  latticeFromShape2D,
  monkhorstPack1D,
  parabolicDOS,
  reciprocalLattice2D,
  regularizedParabolicDOS,
  sampleFoldedBands,
  sampleParabolicDOS,
} from '../src/lib/chapter04Models.mjs';

const close = (actual, expected, tolerance = 1e-10, label = 'value') => {
  assert.ok(Number.isFinite(actual), `${label} must be finite, received ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} != ${expected}`);
};

const square = reciprocalLattice2D({ a1: [2, 0], a2: [0, 2] });
close(square.b1[0], Math.PI, 1e-12, 'square b1x');
close(square.b1[1], 0, 1e-12, 'square b1y');
close(square.b2[0], 0, 1e-12, 'square b2x');
close(square.b2[1], Math.PI, 1e-12, 'square b2y');
close(square.directArea, 4, 1e-12, 'square direct area');
close(square.reciprocalArea, Math.PI ** 2, 1e-12, 'square reciprocal area');
close(square.areaProduct, (2 * Math.PI) ** 2, 1e-10, '2D cell-area product');

const obliqueVectors = latticeFromShape2D({ length: 1.7, ratio: 1.3, angleDegrees: 73 });
const oblique = reciprocalLattice2D(obliqueVectors);
close(dot2(oblique.a1, oblique.b1), 2 * Math.PI, 1e-10, 'a1 dot b1');
close(dot2(oblique.a1, oblique.b2), 0, 1e-10, 'a1 dot b2');
close(dot2(oblique.a2, oblique.b1), 0, 1e-10, 'a2 dot b1');
close(dot2(oblique.a2, oblique.b2), 2 * Math.PI, 1e-10, 'a2 dot b2');
close(oblique.areaProduct, (2 * Math.PI) ** 2, 1e-9, 'oblique area product');

const zoneBoundary = foldedFreeElectronBands({ reducedK: 1, minimumBand: -2, maximumBand: 2 });
const m0 = zoneBoundary.find((item) => item.bandIndex === 0);
const mMinus1 = zoneBoundary.find((item) => item.bandIndex === -1);
assert.ok(m0 && mMinus1);
close(m0.energy, 1, 1e-12, 'zone-edge m=0 energy');
close(mMinus1.energy, 1, 1e-12, 'zone-edge m=-1 energy');

for (const reducedK of [-0.83, -0.2, 0.41, 0.92]) {
  for (const bandIndex of [-2, -1, 0, 1]) {
    const shifted = foldedFreeElectronBand({ reducedK: reducedK + 2, bandIndex });
    const relabelled = foldedFreeElectronBand({ reducedK, bandIndex: bandIndex + 1 });
    close(shifted.energy, relabelled.energy, 1e-12, 'band periodicity under k→k+G');
  }
}

const foldedSamples = sampleFoldedBands({ count: 51, minimumBand: -2, maximumBand: 2 });
assert.equal(foldedSamples.length, 51);
assert.equal(foldedSamples[0].bands.length, 5);
assert.ok(foldedSamples.every((point) => point.bands.every((band) => band.energy >= 0)));

close(parabolicDOS({ dimension: 1, energy: 4 }), 0.5, 1e-12, '1D DOS at E=4');
close(parabolicDOS({ dimension: 1, energy: 1 }), 1, 1e-12, '1D DOS at E=1');
close(parabolicDOS({ dimension: 2, energy: 1 }), 1, 1e-12, '2D DOS at E=1');
close(parabolicDOS({ dimension: 2, energy: 4 }), 1, 1e-12, '2D DOS at E=4');
close(parabolicDOS({ dimension: 3, energy: 1 }), 1, 1e-12, '3D DOS at E=1');
close(parabolicDOS({ dimension: 3, energy: 4 }), 2, 1e-12, '3D DOS at E=4');
assert.equal(parabolicDOS({ dimension: 3, energy: -1 }), 0);
assert.equal(parabolicDOS({ dimension: 1, energy: 0 }), Number.POSITIVE_INFINITY);

const regularized1D = regularizedParabolicDOS({ dimension: 1, energy: 0, eta: 0.04 });
const regularized2D = regularizedParabolicDOS({ dimension: 2, energy: 0, eta: 0.04 });
const regularized3D = regularizedParabolicDOS({ dimension: 3, energy: 0, eta: 0.04 });
assert.ok(regularized1D > regularized2D);
assert.ok(regularized2D > regularized3D);

for (const dimension of [1, 2, 3]) {
  const samples = sampleParabolicDOS({ dimension, count: 101, eta: 0.04 });
  assert.equal(samples.length, 101);
  assert.ok(samples.every((point) => Number.isFinite(point.energy) && Number.isFinite(point.density)));
  assert.ok(samples.every((point) => point.density >= 0));
}

for (const count of [1, 2, 5, 8]) {
  const grid = monkhorstPack1D({ count });
  assert.equal(grid.length, count);
  close(grid.reduce((sum, point) => sum + point.weight, 0), 1, 1e-12, `MP${count} weights`);
  assert.ok(grid.every((point) => point.reducedK > -1 && point.reducedK < 1));
}

assert.throws(() => reciprocalLattice2D({ a1: [1, 0], a2: [2, 0] }), RangeError);
assert.throws(() => latticeFromShape2D({ length: 0, ratio: 1, angleDegrees: 60 }), RangeError);
assert.throws(() => foldedFreeElectronBand({ reducedK: 0, bandIndex: 0.5 }), TypeError);
assert.throws(() => parabolicDOS({ dimension: 4, energy: 1 }), RangeError);
assert.throws(() => regularizedParabolicDOS({ dimension: 2, energy: 1, eta: 0 }), RangeError);
assert.throws(() => monkhorstPack1D({ count: 0 }), RangeError);

console.log('Chapter 4 teaching-model validation passed: reciprocal-lattice duality, zone folding, parabolic DOS scaling, and k-grid weights checked.');
