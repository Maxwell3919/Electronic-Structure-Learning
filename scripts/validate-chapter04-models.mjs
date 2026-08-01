import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

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

const body = read('src/components/chapter04/Chapter04Body.astro');
assert.match(body, /Chapter04DOSNormalizationAudit/);
assert.ok(
  body.indexOf('<IntegrationDOS />') < body.indexOf('<DOSNormalizationAudit />')
    && body.indexOf('<DOSNormalizationAudit />') < body.indexOf('<Visualizations />'),
  'The DOS normalization audit must follow Section 4.7 and precede the teaching models',
);

const audit = read('src/components/chapter04/Chapter04DOSNormalizationAudit.mdx');
assert.match(audit, /data-ch4-dos-normalization-audit/);
assert.match(audit, /data-source-locators="4\.34,4\.35,4\.46"/);
assert.match(audit, /data-cell-dos-prefactor="Omega-cell-over-2pi-d"/);
assert.match(audit, /data-volume-dos-prefactor="one-over-2pi-d"/);
for (const equation of ['4.34', '4.35', '4.46']) {
  assert.ok(audit.includes(equation), `DOS normalization audit must identify Eq. (${equation})`);
}
assert.ok(audit.includes('\\rho_{\\mathrm{cell}}'), 'Audit must define the per-cell DOS');
assert.ok(audit.includes('\\rho_{\\mathrm{vol}}'), 'Audit must define the per-volume DOS');
assert.ok(audit.includes('\\Omega_{\\mathrm{cell}}'), 'Audit must expose the primitive-cell volume factor');
assert.match(audit, /归一化不一致|normalization mismatch/);
assert.match(audit, /不推断作者|without claiming which expression/);
assert.match(audit, /每原胞一个 state|one state per spin-resolved band per primitive cell/);

const integrationDOS = read('src/components/chapter04/Chapter04IntegrationDOS.mdx');
assert.ok(
  integrationDOS.includes('\\frac{1}{(2\\pi)^d}'),
  'Chapter 4 must retain the explicit per-volume DOS prefactor',
);

const visualFiles = [
  ['src/components/ReciprocalLatticeExplorer.astro', ['data-ch04-areas-en', 'data-ch04-product-en']],
  ['src/components/BlochBandFoldingExplorer.astro', ['data-ch04-fold-unfolded-en', 'data-ch04-fold-periodicity-en']],
  ['src/components/DOSDimensionalityExplorer.astro', ['data-ch04-dos-edge-en', 'data-ch04-dos-note-en']],
];
for (const [path, markers] of visualFiles) {
  const source = read(path);
  assert.match(source, /aria-live="polite" aria-atomic="true" data-ch04-live-contract="bilingual-atomic"/);
  for (const marker of markers) {
    assert.ok(source.includes(marker), `${path} must contain ${marker}`);
  }
  assert.match(source, /[一-鿿]/, `${path} must retain Chinese live-status text`);
  assert.match(source, /lang="en"/, `${path} must retain English live-status text`);
}

console.log('Chapter 4 validation passed: reciprocal duality, zone folding, DOS scaling, k-grid weights, Eq. (4.46) cell/volume normalization, and three bilingual atomic live regions checked.');
