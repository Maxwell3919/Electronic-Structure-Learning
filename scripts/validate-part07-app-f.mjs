import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  complementaryErrorFunction,
  errorFunction,
  ewaldEnergy,
  ewaldPotentialSplit,
  gaussianPairPotential,
  gaussianSelfEnergy,
  leadingChargedImageEnergy,
  planarDipolePotentialStep,
  reciprocalSmallGTerm,
  slabDipoleImageEnergy,
} from '../src/data/part07/ewaldCoulombModel.mjs';

const close = (actual, expected, tolerance = 1e-12, label = 'value') => {
  assert.ok(Number.isFinite(actual), `${label}: non-finite value ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, received ${actual}`);
};

const relativeClose = (actual, expected, relativeTolerance = 1e-10, label = 'value') => {
  const scale = Math.max(1, Math.abs(expected));
  close(actual, expected, relativeTolerance * scale, label);
};

// Error-function complement and exact Coulomb partition.
for (const value of [-3.2, -0.5, 0, 0.7, 4.1]) {
  close(
    errorFunction(value) + complementaryErrorFunction(value),
    1,
    2e-15,
    `erf+erfc complement at ${value}`,
  );
}
for (const [distance, alpha] of [[0.17, 2.2], [0.8, 4], [3.4, 0.9]]) {
  const split = ewaldPotentialSplit({ distance, alpha });
  relativeClose(split.total, 1 / distance, 2e-14, `Ewald Coulomb split at r=${distance}`);
  assert.ok(split.shortRange >= 0, 'short-range Ewald term must be non-negative for positive distance');
  assert.ok(split.smoothLongRange >= 0, 'smooth Ewald term must be non-negative for positive distance');
}
assert.throws(
  () => ewaldPotentialSplit({ distance: 0, alpha: 4 }),
  RangeError,
  'zero pair distance must fail closed in the split helper',
);

// A converged neutral teaching cell must be independent of the numerical splitting parameter.
const convergedTotals = [2.8, 4.0, 5.2].map((alpha) => ewaldEnergy({
  alpha,
  realCutoff: 8,
  reciprocalCutoff: 8,
}).total);
for (let index = 1; index < convergedTotals.length; index += 1) {
  close(
    convergedTotals[index],
    convergedTotals[0],
    3e-6,
    `converged Ewald alpha invariance at sample ${index}`,
  );
}
close(convergedTotals[1], -2.0353615, 3e-6, 'neutral cubic teaching-cell reference');

// Explicit components redistribute with alpha even though the converged total does not.
const lowAlpha = ewaldEnergy({ alpha: 2.8, realCutoff: 8, reciprocalCutoff: 8 });
const highAlpha = ewaldEnergy({ alpha: 5.2, realCutoff: 8, reciprocalCutoff: 8 });
assert.ok(
  Math.abs(lowAlpha.realSpace - highAlpha.realSpace) > 1e-3,
  'real-space component must respond across alpha for the teaching cell',
);
assert.ok(
  Math.abs(lowAlpha.reciprocalSpace - highAlpha.reciprocalSpace) > 1,
  'reciprocal-space component must redistribute strongly across alpha',
);
assert.ok(
  Math.abs(lowAlpha.selfEnergy - highAlpha.selfEnergy) > 1,
  'self component must redistribute strongly across alpha',
);
assert.equal(lowAlpha.netCharge, 0, 'default Ewald teaching cell must be neutral');
assert.match(lowAlpha.boundary, /three-dimensional periodic tin-foil/, 'boundary contract must be explicit');

// Net-charge background term and the G -> 0 divergence scale.
const chargedInput = {
  charges: [1, 1],
  positions: [[0, 0, 0], [0.5, 0.5, 0.5]],
  alpha: 4,
  realCutoff: 7,
  reciprocalCutoff: 7,
};
const withBackground = ewaldEnergy({ ...chargedInput, includeBackground: true });
const withoutBackground = ewaldEnergy({ ...chargedInput, includeBackground: false });
close(
  withBackground.backgroundEnergy,
  -Math.PI / 8,
  2e-14,
  'uniform-background analytic energy',
);
close(
  withBackground.total - withoutBackground.total,
  withBackground.backgroundEnergy,
  2e-14,
  'background term must enter total with the declared sign',
);
const gOne = reciprocalSmallGTerm({ netCharge: 2, volume: 3, gMagnitude: 1 });
const gTwo = reciprocalSmallGTerm({ netCharge: 2, volume: 3, gMagnitude: 2 });
close(gOne / gTwo, 4, 2e-14, 'small-G monopole term must scale as 1/G^2');
assert.throws(
  () => reciprocalSmallGTerm({ netCharge: 1, volume: 0, gMagnitude: 1 }),
  RangeError,
  'zero volume must fail closed',
);

// Gaussian pseudocharge limits and self-energy relation.
const width = 0.4;
const coincidentPair = gaussianPairPotential({ distance: 0, charge1: 2, charge2: 2, width });
const self = gaussianSelfEnergy({ charge: 2, width });
close(coincidentPair, 2 * self, 2e-14, 'coincident equal-Gaussian pair equals twice the self energy');
const farDistance = 12 * width;
const farGaussian = gaussianPairPotential({ distance: farDistance, charge1: 1.5, charge2: -0.6, width });
relativeClose(farGaussian, 1.5 * -0.6 / farDistance, 3e-9, 'Gaussian pair must recover point Coulomb at long range');
assert.throws(
  () => gaussianSelfEnergy({ charge: 1, width: 0 }),
  RangeError,
  'zero Gaussian width must fail closed',
);

// Planar dipole step and periodic-image scaling.
const step = planarDipolePotentialStep({ surfaceChargeDensity: 0.08, separation: 1.7 });
close(step, 4 * Math.PI * 0.08 * 1.7, 2e-14, 'Gaussian planar dipole step');
close(
  planarDipolePotentialStep({ surfaceChargeDensity: -0.08, separation: 1.7 }),
  -step,
  2e-14,
  'dipole-step sign reversal',
);
close(
  planarDipolePotentialStep({ surfaceChargeDensity: 0.16, separation: 1.7 }),
  2 * step,
  2e-14,
  'dipole step linear in sheet charge',
);
const slabShort = slabDipoleImageEnergy({ dipoleMoment: 0.7, area: 2.5, cellLength: 12 });
const slabLong = slabDipoleImageEnergy({ dipoleMoment: 0.7, area: 2.5, cellLength: 24 });
close(slabShort / slabLong, 2, 2e-14, 'slab dipole image energy must scale as 1/Lz');
const chargedSmall = leadingChargedImageEnergy({ charge: 1, madelungMagnitude: 2.837297, dielectricConstant: 4, length: 10 });
const chargedLarge = leadingChargedImageEnergy({ charge: 1, madelungMagnitude: 2.837297, dielectricConstant: 4, length: 20 });
close(chargedSmall / chargedLarge, 2, 2e-14, 'leading charged-image term must scale as 1/L');
close(
  leadingChargedImageEnergy({ charge: 2, madelungMagnitude: 2.837297, dielectricConstant: 4, length: 10 }) / chargedSmall,
  4,
  2e-14,
  'leading charged-image term must scale as q^2',
);

// Content and actual render-tree assembly.
const paths = {
  route: 'src/content/docs/part-07-appendices/appendix-f-coulomb-interactions-in-extended-systems.mdx',
  index: 'src/content/docs/part-07-appendices/index.mdx',
  body: 'src/components/part07/appF/AppendixFBody.astro',
  contents: 'src/components/part07/appF/AppendixFContents.astro',
  orientation: 'src/components/part07/appF/AppendixFOrientation.mdx',
  pointEwald: 'src/components/part07/appF/AppendixFPointEwald.mdx',
  smearedReference: 'src/components/part07/appF/AppendixFSmearedReference.mdx',
  surfaceImages: 'src/components/part07/appF/AppendixFSurfaceImages.mdx',
  review: 'src/components/part07/appF/AppendixFReview.mdx',
  neutrality: 'src/components/part07/appF/NeutralityGZeroMap.astro',
  ewald: 'src/components/part07/appF/EwaldSplitExplorer.astro',
  gaussian: 'src/components/part07/appF/GaussianChargeExplorer.astro',
  slab: 'src/components/part07/appF/SlabDipoleImageExplorer.astro',
};
const content = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
);

assert.match(content.route, /<AppendixFBody\s*\/>/, 'route must render AppendixFBody');
assert.match(content.route, /status="appendix-content-complete"/, 'route status must be content complete');
for (const component of [
  'AppendixFContents',
  'AppendixFOrientation',
  'AppendixFPointEwald',
  'AppendixFSmearedReference',
  'AppendixFSurfaceImages',
  'AppendixFReview',
]) {
  assert.match(content.body, new RegExp(`<${component}\\s*/>`), `body must render ${component}`);
}
for (const section of ['F.1', 'F.2', 'F.3', 'F.4', 'F.5', 'F.6']) {
  assert.ok(content.contents.includes(section), `source map must contain ${section}`);
}
const combinedSections = `${content.pointEwald}\n${content.smearedReference}\n${content.surfaceImages}\n${content.review}`;
for (const marker of [
  'section-f-1',
  'section-f-2',
  'section-f-3',
  'section-f-4',
  'section-f-5',
  'section-f-6',
  'review',
]) {
  assert.ok(combinedSections.includes(marker), `content must expose ${marker}`);
}
for (const [container, visual] of [
  ['orientation', 'NeutralityGZeroMap'],
  ['pointEwald', 'EwaldSplitExplorer'],
  ['smearedReference', 'GaussianChargeExplorer'],
  ['surfaceImages', 'SlabDipoleImageExplorer'],
]) {
  assert.match(content[container], new RegExp(`<${visual}\\s*/>`), `${visual} must be assembled in ${container}`);
}
const visualContracts = ['neutrality', 'ewald', 'gaussian', 'slab']
  .map((key) => (content[key].match(/chapter-visual__contract/g) ?? []).length)
  .reduce((sum, count) => sum + count, 0);
assert.equal(visualContracts, 4, 'four visual contracts must be present');

const combinedText = Object.values(content).join('\n');
assert.doesNotMatch(combinedText, /目录级阅读骨架|outline · 正文待填充|TODO/i, 'Appendix F must not retain outline or TODO markers');
assert.ok((combinedText.match(/bilingual-section__zh/g) ?? []).length >= 24, 'substantive Chinese bilingual coverage');
assert.ok((combinedText.match(/bilingual-section__en/g) ?? []).length >= 24, 'substantive English bilingual coverage');
for (const required of [
  'three-dimensional periodic tin-foil',
  'uniform compensating background',
  'Makov-Payne',
  'Coulomb cutoff',
  'Martin Eq. F.22',
  'source exercises not reproduced',
]) {
  assert.ok(combinedText.includes(required), `required scientific boundary missing: ${required}`);
}
assert.ok((content.review.match(/<li><strong>/g) ?? []).length >= 10, 'ten original exercises must be present');
assert.match(
  content.index,
  /\| F · Coulomb Interactions in Extended Systems \| (?:content complete(?:; deployment identity follows the site manifest)?|complete and deployed) \|/,
  'Part VII index must expose Appendix F as content-complete or deployed',
);
assert.doesNotMatch(
  content.index,
  /\| F · Coulomb Interactions in Extended Systems \| outline \|/,
  'Appendix F must never regress to outline state',
);

console.log('Part VII Appendix F validation passed: Ewald split and alpha invariance, background/G=0 behavior, Gaussian limits, dipole/image scaling, and route assembly.');
