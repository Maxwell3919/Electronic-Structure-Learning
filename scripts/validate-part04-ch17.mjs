import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  fullPotentialAngularProduct,
  lapwBoundaryMatch,
  nmtoInterpolation,
  normalizedRadialState,
  radialEnergyDerivative,
  radialLinearization,
  screenedStructureBand,
} from '../src/data/part04/ch17TeachingModels.mjs';

const approx = (actual, expected, tolerance = 1e-10, label = 'value') => {
  assert.ok(Number.isFinite(actual), `${label} must be finite, received ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, received ${actual}`);
};

for (const energy of [0.8, 2, 4]) {
  const state = normalizedRadialState({ energy, radius: 4, points: 401 });
  approx(state.norm, 1, 5e-12, `radial norm at E=${energy}`);
  const derivative = radialEnergyDerivative({ energy, radius: 4, points: 401 });
  assert.ok(Math.abs(derivative.overlap) < 5e-8, `u/u-dot overlap at E=${energy}: ${derivative.overlap}`);
  assert.ok(derivative.derivativeNorm > 0, 'energy derivative must be nonzero in the sampled family');
}

const error05 = radialLinearization({ referenceEnergy: 2, targetEnergy: 2.05 }).errorNorm;
const error10 = radialLinearization({ referenceEnergy: 2, targetEnergy: 2.10 }).errorNorm;
const error20 = radialLinearization({ referenceEnergy: 2, targetEnergy: 2.20 }).errorNorm;
assert.ok(error05 < error10 && error10 < error20, 'linearization error must grow across the positive offset scan');
approx(error10 / error05, 4, 0.15, 'quadratic error ratio 0.10/0.05');
approx(error20 / error10, 4, 0.2, 'quadratic error ratio 0.20/0.10');
approx(radialLinearization({ referenceEnergy: 2, targetEnergy: 2 }).errorNorm, 0, 1e-12, 'zero-offset linearization');

for (const referenceEnergy of [0.8, 2, 3.6]) {
  const match = lapwBoundaryMatch({ referenceEnergy, planeWaveNumber: 2.1, radius: 1 });
  assert.ok(Math.abs(match.determinant) > 1e-6, `LAPW matching determinant at E=${referenceEnergy}`);
  approx(match.valueResidual, 0, 2e-12, `LAPW value residual at E=${referenceEnergy}`);
  approx(match.slopeResidual, 0, 2e-12, `LAPW slope residual at E=${referenceEnergy}`);
}

const weakScreen = screenedStructureBand({ screening: 0.1, cutoff: 3 });
const strongScreen = screenedStructureBand({ screening: 0.9, cutoff: 3 });
assert.ok(strongScreen.maxError < weakScreen.maxError, 'screening must reduce fixed-cutoff band error in the teaching model');
const shortRange = screenedStructureBand({ screening: 0.5, cutoff: 2 });
const longRange = screenedStructureBand({ screening: 0.5, cutoff: 7 });
assert.ok(longRange.maxError < shortRange.maxError, 'retaining more shells must reduce band error');
assert.ok(longRange.maxError <= longRange.omittedTailBound + 1e-12, 'max error must lie below the absolute tail bound');

for (const energy of [-1, 0, 1]) {
  const result = nmtoInterpolation({ energy, spacing: 1 });
  approx(result.error, 0, 1e-13, `NMTO mesh exactness at E=${energy}`);
}
for (const energy of [-1.3, -0.45, 0.45, 1.3]) {
  const result = nmtoInterpolation({ energy, spacing: 1 });
  approx(result.error, result.predictedError, 5e-14, `NMTO error product at E=${energy}`);
}
for (const lWave of [0, 1, 2, 5]) {
  const result = fullPotentialAngularProduct({ lWave });
  assert.equal(result.densityMaximumL, 2 * lWave);
  assert.equal(result.potentialCouplingMaximumL, 2 * lWave);
}

const paths = {
  route: 'src/content/docs/part-04-determination-of-electronic-structure/chapter-17-augmented-functions-linear-methods.mdx',
  body: 'src/components/part04/ch17/Chapter17Body.astro',
  contents: 'src/components/part04/ch17/Chapter17Contents.astro',
  sourceMap: 'src/components/part04/ch17/Chapter17SourceMap.astro',
  orientation: 'src/components/part04/ch17/Chapter17Orientation.mdx',
  linearization: 'src/components/part04/ch17/Chapter17Linearization.mdx',
  lapw: 'src/components/part04/ch17/Chapter17LAPW.mdx',
  lmto: 'src/components/part04/ch17/Chapter17LMTO.mdx',
  nmto: 'src/components/part04/ch17/Chapter17NMTOFullPotential.mdx',
  review: 'src/components/part04/ch17/Chapter17Review.mdx',
  linearVisual: 'src/components/part04/ch17/LinearizationErrorExplorer.astro',
  derivativeVisual: 'src/components/part04/ch17/EnergyDerivativeExplorer.astro',
  lapwVisual: 'src/components/part04/ch17/LAPWMatchingExplorer.astro',
  lmtoVisual: 'src/components/part04/ch17/LMTOBandRangeExplorer.astro',
  nmtoVisual: 'src/components/part04/ch17/NMTOInterpolationExplorer.astro',
};
const content = Object.fromEntries(await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])));
assert.match(content.route, /status="draft"|status="review"|status="validated"/);
assert.doesNotMatch(content.route, /ReadingOutline|正文待填充|outline ·/);
for (const component of ['Chapter17Linearization', 'Chapter17LAPW', 'Chapter17LMTO', 'Chapter17NMTOFullPotential', 'Chapter17Review']) assert.match(content.body, new RegExp(`<${component} \/>`), `body must render ${component}`);
const joined = Object.values(content).join('\n');
for (let section = 1; section <= 10; section += 1) assert.match(joined, new RegExp(`section-17-${section}`), `missing section 17.${section}`);
for (const id of ['ch17-linearization-error', 'ch17-energy-derivative', 'ch17-lapw-matching', 'ch17-lmto-range', 'ch17-nmto-interpolation']) assert.match(joined, new RegExp(id), `missing visualization ${id}`);
for (const key of ['linearVisual', 'derivativeVisual', 'lapwVisual', 'lmtoVisual', 'nmtoVisual']) {
  assert.match(content[key], /chapter-visual__contract/, `${key} must expose a visual contract`);
  assert.match(content[key], /<noscript>/, `${key} must expose a no-JavaScript fallback`);
  assert.match(content[key], /无 JavaScript fallback/, `${key} must label the fallback`);
  assert.match(content[key], /<svg/, `${key} must expose a static SVG`);
}
assert.equal((content.contents.match(/section-17-/g) ?? []).length, 10);
assert.match(content.sourceMap, /正文、推导与边界已填充/);
assert.match(content.review, /十道原创练习/);
assert.match(joined, /energy derivative/);
assert.match(joined, /full potential/);
assert.doesNotMatch(joined, /教材习题|source exercise text|答案如下/);
for (const [key, text] of Object.entries(content)) {
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    if (code <= 8 || code === 11 || code === 12 || (code >= 14 && code <= 31)) {
      const before = text.slice(0, index), line = before.split('\n').length, column = index - before.lastIndexOf('\n');
      assert.fail(`${key} (${paths[key]}) contains U+${code.toString(16).toUpperCase().padStart(4, '0')} at ${line}:${column}`);
    }
  }
}
console.log('Part IV Chapter 17 validation passed: 6 deterministic/content groups.');
