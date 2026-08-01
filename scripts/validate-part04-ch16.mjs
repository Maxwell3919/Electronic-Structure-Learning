import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { apwBoundaryMatching, canonicalBandEnergy, mtoScreening, muffinTinPartition, scalarCPA, squareWellSPhaseShift } from '../src/data/part04/ch16TeachingModels.mjs';

const approx = (actual, expected, tolerance = 1e-10, label = 'value') => {
  assert.ok(Number.isFinite(actual), `${label} must be finite, received ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, received ${actual}`);
};

for (const radius of [0.5, 0.9, 1.15]) {
  const partition = muffinTinPartition({ radius });
  approx(partition.sphereFraction + partition.interstitialFraction, 1, 1e-12, 'partition unity');
  assert.ok(partition.nearestGap >= -1e-12, 'accepted spheres must not overlap');
}
assert.ok(muffinTinPartition({ radius: 1.1 }).sphereFraction > muffinTinPartition({ radius: 0.6 }).sphereFraction);
assert.throws(() => muffinTinPartition({ radius: 1.3 }), RangeError);

const freeMatch = apwBoundaryMatching({ energy: 2, depth: 0, radius: 0.9 });
approx(freeMatch.amplitude, 1, 1e-12, 'free APW amplitude');
approx(freeMatch.mismatch, 0, 1e-12, 'free APW log derivative');
for (const energy of [0.4, 2, 5]) {
  const match = apwBoundaryMatching({ energy, depth: 4, radius: 0.9 });
  assert.ok(Number.isFinite(match.amplitude) && Number.isFinite(match.mismatch));
}
assert.throws(() => apwBoundaryMatching({ energy: 1, depth: Math.PI ** 2 - 1, radius: 1 }), RangeError);

for (const energy of [0.3, 2, 7]) {
  const transparent = squareWellSPhaseShift({ energy, depth: 0, radius: 1 });
  approx(transparent.phaseShift, 0, 1e-12, `zero-depth phase at E=${energy}`);
  approx(transparent.sin2, 0, 1e-12, `zero-depth scattering at E=${energy}`);
}
for (const depth of [0, 2, 6, 10]) {
  const phase = squareWellSPhaseShift({ energy: 2, depth, radius: 1 });
  assert.ok(phase.sin2 >= 0 && phase.sin2 <= 1);
}

const pureB = scalarCPA({ concentration: 0, potentialA: -1, potentialB: 1, cavityImag: -0.8 });
const pureA = scalarCPA({ concentration: 1, potentialA: -1, potentialB: 1, cavityImag: -0.8 });
approx(pureB.sigma.re, 1, 1e-12, 'pure B CPA');
approx(pureA.sigma.re, -1, 1e-12, 'pure A CPA');
approx(pureB.disorderWidth, 0, 1e-12, 'pure B width');
approx(pureA.disorderWidth, 0, 1e-12, 'pure A width');
for (const concentration of [0.1, 0.25, 0.5, 0.75, 0.9]) {
  const result = scalarCPA({ concentration, potentialA: -1, potentialB: 1, cavityImag: -0.8 });
  assert.ok(result.sigma.im <= 1e-10, `retarded CPA branch at c=${concentration}`);
  assert.ok(result.residualNorm < 1e-12, `CPA residual at c=${concentration}: ${result.residualNorm}`);
}
const c25 = scalarCPA({ concentration: 0.25 }), c75 = scalarCPA({ concentration: 0.75 });
approx(c25.sigma.re, -c75.sigma.re, 1e-12, 'CPA real symmetry');
approx(c25.disorderWidth, c75.disorderWidth, 1e-12, 'CPA width symmetry');

for (const distance of [1, 2, 4, 8]) {
  const bare = mtoScreening({ distance, power: 2, screening: 0 });
  const screened = mtoScreening({ distance, power: 2, screening: 0.6 });
  approx(bare.screenedTail, bare.bareTail, 1e-14, `bare tail R=${distance}`);
  assert.ok(screened.screenedTail < bare.bareTail);
  approx(screened.ratio, Math.exp(-0.6 * distance), 1e-14, `screening ratio R=${distance}`);
}
assert.ok(mtoScreening({ distance: 6, screening: 0.9 }).screenedTail < mtoScreening({ distance: 6, screening: 0.2 }).screenedTail);
approx(canonicalBandEnergy({ structureEigenvalue: 0.4, bandCentre: 2, bandScale: 3 }), 3.2, 1e-12, 'canonical scaling');

const paths = {
  route: 'src/content/docs/part-04-determination-of-electronic-structure/chapter-16-augmented-functions-apw-kkr-mto.mdx',
  body: 'src/components/part04/ch16/Chapter16Body.astro',
  contents: 'src/components/part04/ch16/Chapter16Contents.astro',
  sourceMap: 'src/components/part04/ch16/Chapter16SourceMap.astro',
  orientation: 'src/components/part04/ch16/Chapter16Orientation.mdx',
  apwFoundations: 'src/components/part04/ch16/Chapter16APWFoundations.mdx',
  apwExamples: 'src/components/part04/ch16/Chapter16APWExamples.mdx',
  kkr: 'src/components/part04/ch16/Chapter16KKR.mdx',
  cpa: 'src/components/part04/ch16/Chapter16CPA.mdx',
  mtoCanonical: 'src/components/part04/ch16/Chapter16MTOCanonical.mdx',
  mtoLocalized: 'src/components/part04/ch16/Chapter16MTOLocalized.mdx',
  energyForces: 'src/components/part04/ch16/Chapter16EnergyForces.mdx',
  review: 'src/components/part04/ch16/Chapter16Review.mdx',
  partitionVisual: 'src/components/part04/ch16/MuffinTinPartitionExplorer.astro',
  apwVisual: 'src/components/part04/ch16/APWMatchingExplorer.astro',
  phaseVisual: 'src/components/part04/ch16/PhaseShiftKKRExplorer.astro',
  cpaVisual: 'src/components/part04/ch16/CPAEffectiveMediumExplorer.astro',
  mtoVisual: 'src/components/part04/ch16/MTOScreeningExplorer.astro',
};
const content = Object.fromEntries(await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])));
assert.match(content.route, /status="draft"|status="review"|status="validated"/);
assert.doesNotMatch(content.route, /ReadingOutline|正文待填充|outline ·/);
for (const component of ['Chapter16APWFoundations','Chapter16APWExamples','Chapter16KKR','Chapter16CPA','Chapter16MTOCanonical','Chapter16MTOLocalized','Chapter16EnergyForces','Chapter16Review']) assert.match(content.body, new RegExp(`<${component} \/>`), `body must render ${component}`);
const joined = Object.values(content).join('\n');
for (let section = 1; section <= 8; section += 1) assert.match(joined, new RegExp(`section-16-${section}`), `missing section 16.${section}`);
for (const id of ['ch16-muffin-tin-partition','ch16-apw-matching','ch16-phase-shift-kkr','ch16-cpa-effective-medium','ch16-mto-screening']) assert.match(joined, new RegExp(id), `missing visualization ${id}`);
for (const key of ['partitionVisual','apwVisual','phaseVisual','cpaVisual','mtoVisual']) {
  assert.match(content[key], /chapter-visual__contract/); assert.match(content[key], /<noscript>/); assert.match(content[key], /无 JavaScript fallback/); assert.match(content[key], /<svg/);
}
assert.equal((content.contents.match(/section-16-/g) ?? []).length, 8);
assert.match(content.sourceMap, /正文、推导与边界已填充/);
assert.match(content.review, /十道原创练习/);
assert.doesNotMatch(joined, /教材习题|source exercise text|答案如下/);
for (const [key, text] of Object.entries(content)) for (let index = 0; index < text.length; index += 1) {
  const code = text.charCodeAt(index);
  if (code <= 8 || code === 11 || code === 12 || (code >= 14 && code <= 31)) {
    const before = text.slice(0, index), line = before.split('\n').length, column = index - before.lastIndexOf('\n');
    assert.fail(`${key} (${paths[key]}) contains U+${code.toString(16).toUpperCase().padStart(4, '0')} at ${line}:${column}`);
  }
}
console.log('Part IV Chapter 16 validation passed: 6 deterministic/content groups.');
