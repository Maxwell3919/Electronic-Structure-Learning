import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  formatZ2Indices,
  indicesFromTrimParities,
  trimOrder3D,
  weakReciprocalVector,
} from '../src/data/part06/ch28TeachingModels.mjs';
import {
  domainWallSurface,
  latticeDiracMass,
  latticeDiracSpectrum,
  latticeDiracTrimMasses,
  surfaceDiracSpectrum,
} from '../src/data/part06/ch28DiracModels.mjs';
import {
  codimensionResidual,
  diracZeemanPhase,
  diracZeemanSpectrum,
  fermiArcPoint,
  linearWeylSpectrum,
  sliceChernBetweenWeylNodes,
  weylFluxCharge,
} from '../src/data/part06/ch28WeylModels.mjs';

const tolerance = 1e-10;

function close(actual, expected, limit = tolerance, message = '') {
  assert.ok(
    Math.abs(actual - expected) <= limit,
    `${message || 'value mismatch'}: ${actual} vs ${expected} (limit ${limit})`,
  );
}

// Eight-TRIM ordering and four Z2 indicators.
assert.deepEqual(trimOrder3D(), [
  [0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0],
  [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1],
]);
const trivial = indicesFromTrimParities([1, 1, 1, 1, 1, 1, 1, 1]);
assert.deepEqual(trivial, {
  nu0: 0,
  nu1: 0,
  nu2: 0,
  nu3: 0,
  strongProduct: 1,
  weakProducts: [1, 1, 1],
  phase: 'trivial',
});
const strong000 = indicesFromTrimParities([-1, 1, 1, 1, 1, 1, 1, 1]);
assert.equal(formatZ2Indices(strong000), '(1;000)');
assert.equal(strong000.phase, 'strong');
assert.deepEqual(weakReciprocalVector(strong000), [0, 0, 0]);
const weak001 = indicesFromTrimParities([-1, 1, 1, 1, -1, 1, 1, 1]);
assert.equal(formatZ2Indices(weak001), '(0;001)');
assert.equal(weak001.phase, 'weak');
assert.deepEqual(weakReciprocalVector(weak001), [0, 0, 0.5]);
const strong100 = indicesFromTrimParities([1, -1, 1, 1, 1, 1, 1, 1]);
assert.equal(formatZ2Indices(strong100), '(1;100)');
assert.throws(() => indicesFromTrimParities([1, 1]), RangeError);
assert.throws(() => indicesFromTrimParities([1, 1, 1, 1, 1, 1, 1, 0]), RangeError);

// Lattice Dirac regularization and domain-wall surface state.
close(latticeDiracMass(0, 0, 0, -1, 1), -1);
close(latticeDiracMass(Math.PI, 0, 0, -1, 1), 1);
close(latticeDiracMass(Math.PI, Math.PI, Math.PI, -1, 1), 5);
const trimMasses = latticeDiracTrimMasses(-1, 1);
assert.equal(trimMasses.length, 8);
assert.deepEqual(trimMasses.map(({ label }) => label), ['000', '100', '010', '110', '001', '101', '011', '111']);
assert.deepEqual(trimMasses.map(({ mass }) => mass), [-1, 1, 1, 3, 1, 3, 3, 5]);
const gammaDirac = latticeDiracSpectrum(0, 0, 0, { m: -1, b: 1, velocity: 0.8 });
close(gammaDirac.lower, -1);
close(gammaDirac.upper, 1);
close(gammaDirac.gap, 2);
const wall = domainWallSurface(-1, 2, 1, 0.3);
assert.equal(wall.signChange, true);
close(wall.localizationLength, 1);
close(wall.surfaceGap, 0.6);
const noWall = domainWallSurface(1, 2, 1, 0);
assert.equal(noWall.signChange, false);
assert.equal(noWall.surfaceGap, null);
assert.equal(Number.isFinite(noWall.localizationLength), false);
assert.deepEqual(surfaceDiracSpectrum(0, 0, 1, 0.25), [-0.25, 0.25]);

// Martin mass-field model: gapped, critical, and Weyl regimes.
assert.deepEqual(diracZeemanPhase(1, 0.4, 1), {
  phase: 'gapped', nodes: [], nodeSeparation: 0, bulkGap: 1.2,
});
assert.deepEqual(diracZeemanPhase(1, 1, 1), {
  phase: 'critical', nodes: [0], nodeSeparation: 0, bulkGap: 0,
});
const weyl = diracZeemanPhase(0.7, 1, 1);
assert.equal(weyl.phase, 'weyl');
close(weyl.nodes[0], -Math.sqrt(0.51));
close(weyl.nodes[1], Math.sqrt(0.51));
close(weyl.nodeSeparation, 2 * Math.sqrt(0.51));
const nodeSpectrum = diracZeemanSpectrum(0, 0, weyl.nodes[1], {
  mass: 0.7, zeeman: 1, velocity: 1,
});
close(nodeSpectrum[1], 0);
close(nodeSpectrum[2], 0);
const originSpectrum = diracZeemanSpectrum(0, 0, 0, {
  mass: 0.7, zeeman: 1, velocity: 1,
});
close(originSpectrum[1], -0.3);
close(originSpectrum[2], 0.3);
assert.deepEqual(linearWeylSpectrum(3, 4, 0, 2), [-10, 10]);
assert.equal(weylFluxCharge(1), 1);
assert.equal(weylFluxCharge(-1), -1);
assert.equal(weylFluxCharge(1, -1), -1);
assert.throws(() => weylFluxCharge(0), RangeError);

// Momentum-slice Chern number and surface-arc window.
assert.equal(sliceChernBetweenWeylNodes(0, 1), 1);
assert.equal(sliceChernBetweenWeylNodes(0.999, 1), 1);
assert.equal(sliceChernBetweenWeylNodes(1, 1), 0);
assert.equal(sliceChernBetweenWeylNodes(-1.2, 1), 0);
assert.deepEqual(fermiArcPoint(0.4, 0.2, 2, 1), { ky: 0.1, kz: 0.4 });
assert.equal(fermiArcPoint(1.1, 0, 1, 1), null);
close(codimensionResidual(3, 4, 12), 13);
close(codimensionResidual(0, 0, 0), 0);

// Static chapter contracts: five Martin sections, full-BZ evidence boundaries,
// material/model separation, copyright boundary, and four original visuals.
const contentFiles = [
  '../src/components/part06/ch28/Chapter28Orientation.mdx',
  '../src/components/part06/ch28/Chapter28WeakStrongFoundations.mdx',
  '../src/components/part06/ch28/Chapter28TightBindingMaterials.mdx',
  '../src/components/part06/ch28/Chapter28WeylDiracFermiArcs.mdx',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));
const chapterText = contentFiles.join('\n');
for (const section of ['28.1', '28.2', '28.3', '28.4', '28.5']) {
  assert.ok(chapterText.includes(section), `Chapter 28 section ${section} is missing`);
}
for (const phrase of [
  'full-BZ',
  'complete occupied',
  'surface Dirac cone',
  'bulk Dirac node',
  'Weyl',
  'Fermi arc',
  '【版权边界】',
]) {
  assert.ok(chapterText.includes(phrase), `Chapter 28 evidence phrase missing: ${phrase}`);
}

for (const visual of [
  '../src/components/part06/ch28/WeakStrongIndexExplorer.astro',
  '../src/components/part06/ch28/SurfaceDomainWallExplorer.astro',
  '../src/components/part06/ch28/DiracWeylTransitionExplorer.astro',
  '../src/components/part06/ch28/FermiArcSliceExplorer.astro',
]) {
  const source = readFileSync(new URL(visual, import.meta.url), 'utf8');
  assert.ok(source.includes('chapter-visual__contract'), `${visual} lacks an evidence contract`);
  assert.ok(
    source.includes('<noscript>') || source.includes('chapter-visual__fallback'),
    `${visual} lacks a static no-JavaScript fallback`,
  );
  assert.ok(source.includes('<svg'), `${visual} lacks a static SVG`);
}

console.log('Part VI Chapter 28 teaching-model validation passed.');
console.log('Checked four 3D Z2 indices, lattice Dirac masses, domain-wall surfaces, Dirac-to-Weyl splitting, Weyl charge, slice Chern numbers, Fermi arcs, chapter completeness, and visual evidence contracts.');
