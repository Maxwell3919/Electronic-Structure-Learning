import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  grapheneBands,
  grapheneKPoint,
  grapheneStructureFactor,
  nanotubeZoneFolding,
  nonorthogonalChain,
  slaterKosterPP,
  slaterKosterSP,
  twoBandSpectrum,
} from '../src/data/part04/ch14TeachingModels.mjs';

const approx = (actual, expected, tolerance = 1e-10, label = 'value') => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, received ${actual}`);
};

// 1. Orthogonal and nonorthogonal one-band limits.
for (const k of [-Math.PI, -0.7, 0, 1.1, Math.PI]) {
  const result = nonorthogonalChain({ k, hopping: -1.2, overlap: 0, onsite: 0.3 });
  approx(result.energy, 0.3 - 2.4 * Math.cos(k), 1e-12, 'orthogonal chain energy');
  approx(result.metric, 1, 1e-12, 'orthogonal metric');
}
assert.equal(nonorthogonalChain({ k: 0, hopping: -1, overlap: 0.49 }).globallyPositiveNearestNeighbourMetric, true);
assert.equal(nonorthogonalChain({ k: Math.PI, hopping: -1, overlap: -0.5 }).positiveMetricAtK, false);
assert.equal(nonorthogonalChain({ k: 0, hopping: -1, overlap: 0.5 }).globallyPositiveNearestNeighbourMetric, false);

// 2. Two-band trace, gap, and mixing limits.
const resonance = twoBandSpectrum({ epsilonA: 0, epsilonB: 0, couplingReal: 0.7 });
approx(resonance.gap, 1.4, 1e-12, 'resonant avoided-crossing gap');
approx(resonance.lowerAWeight, 0.5, 1e-12, 'resonant A weight');
const general = twoBandSpectrum({ epsilonA: 1.1, epsilonB: -0.4, couplingReal: 0.3, couplingImaginary: 0.2 });
approx(general.lower + general.upper, 0.7, 1e-12, 'two-band trace');
approx(general.lowerAWeight + general.lowerBWeight, 1, 1e-12, 'two-band weight sum');

// 3. Slater–Koster bond-axis and diagonal-bond limits.
approx(slaterKosterSP({ directionCosine: 1, spSigma: 2.2 }), 2.2, 1e-12, 's-p bond-axis element');
approx(slaterKosterSP({ directionCosine: 0, spSigma: 2.2 }), 0, 1e-12, 'orthogonal s-p element');
const axis = slaterKosterPP({ l: 1, m: 0, ppSigma: 3, ppPi: -1 });
approx(axis.pxx, 3, 1e-12, 'p_x p_x sigma limit');
approx(axis.pyy, -1, 1e-12, 'p_y p_y pi limit');
approx(axis.pxy, 0, 1e-12, 'p_x p_y axis limit');
const diagonal = slaterKosterPP({ l: Math.SQRT1_2, m: Math.SQRT1_2, ppSigma: 3, ppPi: -1 });
approx(diagonal.pxx, 1, 1e-12, 'diagonal p_x p_x');
approx(diagonal.pyy, 1, 1e-12, 'diagonal p_y p_y');
approx(diagonal.pxy, 2, 1e-12, 'diagonal p_x p_y');

// 4. Graphene K point and sublattice-mass gap.
const K = grapheneKPoint();
const factor = grapheneStructureFactor({ kx: K.kx, ky: K.ky });
assert.ok(factor.magnitude < 1e-12, `graphene |f(K)| should vanish, received ${factor.magnitude}`);
const massless = grapheneBands({ kx: K.kx, ky: K.ky, hopping: -1, sublatticeMass: 0 });
assert.ok(massless.directGap < 1e-12, `massless K gap should vanish, received ${massless.directGap}`);
const massive = grapheneBands({ kx: K.kx, ky: K.ky, hopping: -1, sublatticeMass: 0.35 });
approx(massive.directGap, 0.7, 1e-12, 'graphene mass gap');

// 5. Nanotube mod-three families.
assert.equal(nanotubeZoneFolding({ n: 10, m: 10 }).zoneFoldingMetallic, true);
assert.equal(nanotubeZoneFolding({ n: 12, m: 0 }).zoneFoldingMetallic, true);
assert.equal(nanotubeZoneFolding({ n: 13, m: 0 }).zoneFoldingMetallic, false);
assert.equal(nanotubeZoneFolding({ n: 6, m: 1 }).family, '3q+2');

// 6. Content and assembly gates.
const paths = {
  route: 'src/content/docs/part-04-determination-of-electronic-structure/chapter-14-localized-orbitals-tight-binding.mdx',
  body: 'src/components/part04/ch14/Chapter14Body.astro',
  sourceMap: 'src/components/part04/ch14/Chapter14SourceMap.astro',
  contents: 'src/components/part04/ch14/Chapter14Contents.astro',
  foundations: 'src/components/part04/ch14/Chapter14LocalizedFoundations.mdx',
  bands: 'src/components/part04/ch14/Chapter14BandModels.mdx',
  graphene: 'src/components/part04/ch14/Chapter14GrapheneAndLattices.mdx',
  materials: 'src/components/part04/ch14/Chapter14MaterialsAndTransfer.mdx',
  review: 'src/components/part04/ch14/Chapter14Review.mdx',
};
const content = Object.fromEntries(await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])));
assert.match(content.route, /status="draft"|status="review"/);
assert.doesNotMatch(content.route, /ReadingOutline|正文待填充|outline ·/);
for (const component of ['Chapter14LocalizedFoundations', 'Chapter14BandModels', 'Chapter14GrapheneAndLattices', 'Chapter14MaterialsAndTransfer', 'Chapter14Review']) {
  assert.match(content.body, new RegExp(`<${component} \/>`), `body must render ${component}`);
}
const joined = Object.values(content).join('\n');
for (let section = 1; section <= 12; section += 1) {
  assert.match(joined, new RegExp(`section-14-${section}`), `missing section 14.${section}`);
}
for (const id of ['ch14-nonorthogonal-chain', 'ch14-slater-koster', 'ch14-two-band', 'ch14-graphene-dirac', 'ch14-nanotube-zone-folding']) {
  assert.match(joined, new RegExp(id), `missing visualization ${id}`);
}
assert.equal((content.sourceMap.match(/body and derivations filled|正文与推导已填充/g) ?? []).length >= 1, true);
assert.equal((content.contents.match(/section-14-/g) ?? []).length, 12);
assert.doesNotMatch(joined, /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/, 'content contains a disallowed control character');
assert.doesNotMatch(joined, /教材习题|source exercise text|答案如下/);

console.log('Part IV Chapter 14 validation passed: 6 deterministic/content groups.');
