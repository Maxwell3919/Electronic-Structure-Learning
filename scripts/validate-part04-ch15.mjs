import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  gaussianProduct,
  integrateChainDOS,
  movingBasisDimer,
  movingBasisFiniteDifference,
  oneDimensionalExponentialTail,
  smoothConfinedExponential,
  twoBasisDensityMatrix,
  uniformChainContinuedFraction,
} from '../src/data/part04/ch15TeachingModels.mjs';

const approx = (actual, expected, tolerance = 1e-10, label = 'value') => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, received ${actual}`);
};

// 1. Gaussian-product algebra and symmetry.
const coincident = gaussianProduct({ alpha: 1.2, beta: 0.7, centerA: 0.4, centerB: 0.4 });
approx(coincident.center, 0.4, 1e-12, 'coincident product centre');
approx(coincident.prefactor, 1, 1e-12, 'coincident prefactor');
approx(coincident.gamma, 1.9, 1e-12, 'combined exponent');
const forward = gaussianProduct({ alpha: 1.3, beta: 0.4, centerA: -1.1, centerB: 0.8 });
const reflectedSwap = gaussianProduct({ alpha: 0.4, beta: 1.3, centerA: -0.8, centerB: 1.1 });
approx(forward.overlap1D, reflectedSwap.overlap1D, 1e-12, 'Gaussian overlap swap/reflection symmetry');
const separated = gaussianProduct({ alpha: 1.3, beta: 0.4, centerA: -3, centerB: 3 });
assert.ok(separated.overlap1D < forward.overlap1D, 'Gaussian overlap must decrease for the larger separation in this comparison');

// 2. Confinement support and exact tail norm.
const inside = smoothConfinedExponential({ radius: 1, decay: 0.9, cutoff: 3 });
assert.ok(inside.value > 0 && inside.value < inside.unconfined, 'confined orbital should be positive and reduced inside support');
approx(smoothConfinedExponential({ radius: 3, decay: 0.9, cutoff: 3 }).value, 0, 1e-15, 'cutoff value');
approx(smoothConfinedExponential({ radius: 4, decay: 0.9, cutoff: 3 }).value, 0, 1e-15, 'outside-support value');
const tail = oneDimensionalExponentialTail({ decay: 0.9, cutoff: 3 });
approx(tail.omittedDensityNorm, Math.exp(-5.4), 1e-15, 'analytic tail norm');
assert.ok(
  oneDimensionalExponentialTail({ decay: 0.9, cutoff: 4 }).omittedDensityNorm < tail.omittedDensityNorm,
  'tail norm must decrease with cutoff',
);

// 3. Nonorthogonal density matrix and electron count.
for (const overlap of [-0.5, 0, 0.4]) {
  for (const angle of [0, 0.37, Math.PI / 2]) {
    const model = twoBasisDensityMatrix({ overlap, mixingAngle: angle, occupation: 1.7 });
    approx(model.electronCount, 1.7, 1e-12, 'Tr(PS) electron count');
  }
}
const orthogonal = twoBasisDensityMatrix({ overlap: 0, mixingAngle: 0.41, occupation: 2 });
approx(orthogonal.densityMatrix[0][0] + orthogonal.densityMatrix[1][1], 2, 1e-12, 'orthogonal Tr(P)');
const nonorthogonal = twoBasisDensityMatrix({ overlap: 0.35, mixingAngle: 0.41, occupation: 2 });
assert.ok(
  Math.abs(nonorthogonal.densityMatrix[0][0] + nonorthogonal.densityMatrix[1][1] - 2) > 1e-3,
  'ordinary Tr(P) should differ from the electron count for this nonorthogonal example',
);

// 4. Moving-basis force derivative and zero-overlap limit.
for (const distance of [0.9, 1.8, 3.5]) {
  const parameters = { distance, overlap0: 0.35 };
  const analytic = movingBasisDimer(parameters);
  const finiteDifference = movingBasisFiniteDifference(parameters, 1e-5);
  approx(analytic.eigenvalueDerivative, finiteDifference.derivative, 2e-8, 'moving-basis eigenvalue derivative');
  approx(analytic.force, finiteDifference.force, 2e-8, 'moving-basis force');
}
const zeroOverlap = movingBasisDimer({ distance: 1.8, overlap0: 0 });
approx(zeroOverlap.overlap, 0, 1e-15, 'zero overlap');
approx(zeroOverlap.overlapDerivativeExpectation, 0, 1e-15, 'zero overlap derivative contribution');

// 5. Continued-fraction spectral limits and normalization.
const eta = 0.2;
const lorentzianCentre = uniformChainContinuedFraction({ energy: 0, hopping: 0, broadening: eta, depth: 5 });
approx(lorentzianCentre.localDensityOfStates, 1 / (Math.PI * eta), 1e-12, 'zero-hopping Lorentzian centre');
for (const energy of [-3, -1, 0, 1, 3]) {
  const spectral = uniformChainContinuedFraction({ energy, hopping: -1, broadening: 0.12, depth: 20 });
  assert.ok(spectral.localDensityOfStates >= 0, `DOS must be nonnegative at E=${energy}`);
}
const integrated = integrateChainDOS({ hopping: -1, broadening: 0.12, depth: 20, energyLimit: 8, points: 4001 });
assert.ok(Math.abs(integrated - 1) < 0.02, `integrated local DOS should be near one, received ${integrated}`);

// 6. Content, assembly, and visualization gates.
const paths = {
  route: 'src/content/docs/part-04-determination-of-electronic-structure/chapter-15-localized-orbitals-full-calculations.mdx',
  body: 'src/components/part04/ch15/Chapter15Body.astro',
  contents: 'src/components/part04/ch15/Chapter15Contents.astro',
  sourceMap: 'src/components/part04/ch15/Chapter15SourceMap.astro',
  orientation: 'src/components/part04/ch15/Chapter15Orientation.mdx',
  basis: 'src/components/part04/ch15/Chapter15BasisAndGaussians.mdx',
  numerical: 'src/components/part04/ch15/Chapter15NumericalOrbitals.mdx',
  forces: 'src/components/part04/ch15/Chapter15EnergyForces.mdx',
  green: 'src/components/part04/ch15/Chapter15GreenMixed.mdx',
  review: 'src/components/part04/ch15/Chapter15Review.mdx',
  gaussianVisual: 'src/components/part04/ch15/GaussianProductExplorer.astro',
  confinementVisual: 'src/components/part04/ch15/BasisConfinementExplorer.astro',
  densityVisual: 'src/components/part04/ch15/DensityMatrixExplorer.astro',
  pulayVisual: 'src/components/part04/ch15/PulayForceExplorer.astro',
  recursionVisual: 'src/components/part04/ch15/RecursionExplorer.astro',
};
const content = Object.fromEntries(await Promise.all(
  Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')]),
));
assert.match(content.route, /status="draft"|status="review"/);
assert.doesNotMatch(content.route, /ReadingOutline|正文待填充|outline ·/);
for (const component of [
  'Chapter15BasisAndGaussians',
  'Chapter15NumericalOrbitals',
  'Chapter15EnergyForces',
  'Chapter15GreenMixed',
  'Chapter15Review',
]) {
  assert.match(content.body, new RegExp(`<${component} \/>`), `body must render ${component}`);
}
const joined = Object.values(content).join('\n');
for (let section = 1; section <= 8; section += 1) {
  assert.match(joined, new RegExp(`section-15-${section}`), `missing section 15.${section}`);
}
for (const id of [
  'ch15-gaussian-product',
  'ch15-basis-confinement',
  'ch15-density-matrix',
  'ch15-pulay-force',
  'ch15-recursion',
]) {
  assert.match(joined, new RegExp(id), `missing visualization ${id}`);
}
for (const key of ['gaussianVisual', 'confinementVisual', 'densityVisual', 'pulayVisual', 'recursionVisual']) {
  assert.match(content[key], /chapter-visual__contract/, `${key} must expose a visualization contract`);
  assert.match(content[key], /<noscript>/, `${key} must expose a no-JavaScript fallback`);
  assert.match(content[key], /<svg/, `${key} must expose a static SVG`);
}
assert.equal((content.contents.match(/section-15-/g) ?? []).length, 8);
assert.match(content.sourceMap, /正文与推导已填充/);
assert.doesNotMatch(joined, /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/, 'content contains a disallowed control character');
assert.doesNotMatch(joined, /教材习题|source exercise text|答案如下/);

console.log('Part IV Chapter 15 validation passed: 6 deterministic/content groups.');
