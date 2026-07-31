import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  chernCriticalXi,
  chernSpectrum,
  chernTrimMasses,
  doubledSpinChernBlocks,
  helicalEdgeSpectrum,
  inversionParityZ2,
  sampleChernModel,
  spinlessTimeReversalResidual,
} from '../src/data/part06/ch27TeachingModels.mjs';
import {
  grapheneEdgeWindow,
  grapheneProjectedDiracMomenta,
  grapheneZigzagEffective,
} from '../src/data/part06/ch27GrapheneModels.mjs';

const tolerance = 1e-10;

function close(actual, expected, limit = tolerance, message = '') {
  assert.ok(
    Math.abs(actual - expected) <= limit,
    `${message || 'value mismatch'}: ${actual} vs ${expected} (limit ${limit})`,
  );
}

// Martin/QWZ-type Chern precursor: four TRIM masses and all three critical xi values.
assert.deepEqual(chernTrimMasses(1, -0.75), {
  gamma: -0.5,
  x: 1,
  y: 1,
  m: 2.5,
});
assert.deepEqual(chernCriticalXi(-0.75), [-1.5, 0, 1.5]);
const gammaSpectrum = chernSpectrum(0, 0, 1, -0.75, Math.SQRT1_2 / 2);
close(gammaSpectrum.gap, 1);
close(gammaSpectrum.lower, -0.5);
close(gammaSpectrum.upper, 0.5);

for (const mesh of [15, 21, 31, 41]) {
  const farNegative = sampleChernModel(-2, -0.75, Math.SQRT1_2 / 2, mesh);
  const positiveChern = sampleChernModel(-1, -0.75, Math.SQRT1_2 / 2, mesh);
  const negativeChern = sampleChernModel(1, -0.75, Math.SQRT1_2 / 2, mesh);
  const farPositive = sampleChernModel(2, -0.75, Math.SQRT1_2 / 2, mesh);

  assert.equal(farNegative.gapClosed, false);
  close(farNegative.lowerBandChern, 0);
  close(farNegative.absoluteChern, 0);
  assert.equal(positiveChern.lowerBandChern, 1);
  assert.equal(positiveChern.absoluteChern, 1);
  assert.equal(negativeChern.lowerBandChern, -1);
  assert.equal(negativeChern.absoluteChern, 1);
  close(farPositive.lowerBandChern, 0);
  close(farPositive.absoluteChern, 0);
  for (const result of [farNegative, positiveChern, negativeChern, farPositive]) {
    assert.ok(result.minimumGap > 0);
    assert.ok(Math.abs(result.residual) < 1e-8);
  }
}

for (const criticalXi of [-1.5, 0, 1.5]) {
  const result = sampleChernModel(criticalXi, -0.75, Math.SQRT1_2 / 2, 31);
  assert.equal(result.gapClosed, true);
  assert.equal(result.minimumGap, 0);
  assert.equal(result.mappingDegree, null);
  assert.equal(result.lowerBandChern, null);
}

// The selected p+ block breaks spinless time reversal away from ky=0,pi.
close(spinlessTimeReversalResidual(0.4, 0, 1, -0.75, 0.35), 0);
close(spinlessTimeReversalResidual(0.4, Math.PI / 2, 1, -0.75, 0.35), 0.7);

// In the declared spin-conserving block limit, opposite Chern blocks cancel in charge
// while their odd/even parity produces the Z2 label.
const doubledTopological = doubledSpinChernBlocks(1, -0.75, Math.SQRT1_2 / 2, 31);
assert.deepEqual(doubledTopological, {
  gapClosed: false,
  cUp: -1,
  cDown: 1,
  totalChern: 0,
  z2FromSpinBlock: 1,
});
const doubledTrivial = doubledSpinChernBlocks(2, -0.75, Math.SQRT1_2 / 2, 31);
close(doubledTrivial.cUp, 0);
close(doubledTrivial.cDown, 0);
close(doubledTrivial.totalChern, 0);
assert.equal(doubledTrivial.z2FromSpinBlock, 0);
assert.equal(doubledSpinChernBlocks(1.5, -0.75, Math.SQRT1_2 / 2, 31).gapClosed, true);

// Odd/even helical-pair algebra: one pair cannot acquire the displayed TR-even mass;
// two pairs admit an interpair mass and open a 2m gap.
const onePair = helicalEdgeSpectrum(0, 1, 0.6, 0.8);
assert.equal(onePair.mixingAllowed, false);
assert.equal(onePair.z2Parity, 1);
close(onePair.directGapAtTrim, 0);
assert.deepEqual(onePair.energies, [0, 0]);
const twoPairs = helicalEdgeSpectrum(0, 2, 0.35, 0.8);
assert.equal(twoPairs.mixingAllowed, true);
assert.equal(twoPairs.z2Parity, 0);
close(twoPairs.directGapAtTrim, 0.7);
assert.deepEqual(twoPairs.energies, [-0.35, -0.35, 0.35, 0.35]);
const finiteK = helicalEdgeSpectrum(0.5, 2, 0.3, 0.8);
close(finiteK.energies[0], -0.5);
close(finiteK.energies[3], 0.5);
assert.throws(() => helicalEdgeSpectrum(0, 3, 0), RangeError);

// Fu-Kane inversion shortcut over complete occupied Kramers pairs.
assert.deepEqual(inversionParityZ2([
  [1, 1],
  [1, -1],
  [1, 1],
  [1, 1],
]), {
  trimProducts: [1, -1, 1, 1],
  globalProduct: -1,
  nu: 1,
});
assert.deepEqual(inversionParityZ2([
  [-1],
  [-1],
  [1],
  [1],
]), {
  trimProducts: [-1, -1, 1, 1],
  globalProduct: 1,
  nu: 0,
});
assert.throws(() => inversionParityZ2([[1], [1], [1]]), RangeError);
assert.throws(() => inversionParityZ2([[1], [1], [1], [0]]), RangeError);

// Momentum-resolved zigzag graphene mapping to a two-site chain.
const [kMinus, kPlus] = grapheneProjectedDiracMomenta();
close(kMinus, -2 * Math.PI / 3);
close(kPlus, 2 * Math.PI / 3);
assert.equal(grapheneEdgeWindow(0), false);
assert.equal(grapheneEdgeWindow(0.85 * Math.PI), true);
const center = grapheneZigzagEffective(0, 1, 20);
close(center.t1, 2);
close(center.t2, 1);
assert.equal(center.edgeAllowed, false);
const dirac = grapheneZigzagEffective(2 * Math.PI / 3, 1, 20);
close(dirac.projectedBulkGap, 0, 1e-12);
assert.ok(!Number.isFinite(dirac.localizationLength) || dirac.localizationLength > 1e10);
const boundary = grapheneZigzagEffective(Math.PI, 1, 20);
close(boundary.t1, 0, 1e-12);
assert.equal(boundary.edgeAllowed, true);
close(boundary.amplitudes[0], 1, 1e-12);
for (const amplitude of boundary.amplitudes.slice(1)) close(amplitude, 0, 1e-12);
const localized = grapheneZigzagEffective(0.85 * Math.PI, 1, 20);
assert.equal(localized.edgeAllowed, true);
close(localized.amplitudes.reduce((sum, value) => sum + value * value, 0), 1, 1e-12);
for (let index = 0; index < localized.amplitudes.length - 1; index += 1) {
  close(localized.amplitudes[index + 1] / localized.amplitudes[index], localized.ratio, 1e-10);
}

// Static chapter contracts: nine Martin sections, full-SOC/block-limit distinction,
// complete occupied-manifold requirements, copyright boundary, and three visuals.
const contentFiles = [
  '../src/components/part06/ch27/Chapter27ChernFoundations.mdx',
  '../src/components/part06/ch27/Chapter27SpinOrbitAndZ2.mdx',
  '../src/components/part06/ch27/Chapter27SquareChainsHgTe.mdx',
  '../src/components/part06/ch27/Chapter27GrapheneHoneycombReview.mdx',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));
const chapterText = contentFiles.join('\n');
for (const section of ['27.1', '27.2', '27.3', '27.4', '27.5', '27.6', '27.7', '27.8', '27.9']) {
  assert.ok(chapterText.includes(section), `Chapter 27 section ${section} is missing`);
}
for (const phrase of [
  'diagonal approximation',
  'full-BZ',
  'complete occupied',
  'Kramers',
  'partner switching',
  '【版权边界】',
]) {
  assert.ok(chapterText.includes(phrase), `Chapter 27 evidence phrase missing: ${phrase}`);
}

for (const visual of [
  '../src/components/part06/ch27/ChernMassExplorer.astro',
  '../src/components/part06/ch27/KramersParityExplorer.astro',
  '../src/components/part06/ch27/GrapheneZigzagExplorer.astro',
]) {
  const source = readFileSync(new URL(visual, import.meta.url), 'utf8');
  assert.ok(source.includes('chapter-visual__contract'), `${visual} lacks an evidence contract`);
  assert.ok(source.includes('<noscript>'), `${visual} lacks a no-JavaScript fallback`);
  assert.ok(source.includes('<svg'), `${visual} lacks a static SVG`);
}

console.log('Part VI Chapter 27 teaching-model validation passed.');
console.log('Checked Chern phases and critical masses, TR breaking, doubled spin blocks, Kramers-pair parity, inversion Z2 products, zigzag edge recursion, chapter completeness, and visual evidence contracts.');
