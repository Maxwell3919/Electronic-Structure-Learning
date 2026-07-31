import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  reducedAllElectron,
  reducedPseudo,
  normInside,
  logDerivativeS,
  matchedWeakWellDepth,
  residualFourierTail,
  cutoffForTail,
  augmentationNorm,
} from '../src/data/part03/ch11TeachingModels.mjs';

const close = (actual, expected, tolerance, message) => {
  assert.ok(Number.isFinite(actual), `${message}: value is not finite`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message}: expected ${expected}, received ${actual}`);
};

// Exterior matching and norm-conservation teaching model.
for (const coreRadius of [1.2, 1.8, 2.2, 2.6]) {
  const aeNorm = normInside(reducedAllElectron, coreRadius);
  const pseudoNorm = normInside((r) => reducedPseudo(r, coreRadius, true), coreRadius);
  close(pseudoNorm, aeNorm, 1e-10, `Interior norm at rc=${coreRadius}`);

  for (const radius of [coreRadius, coreRadius + 0.2, coreRadius + 1.0, 5.5]) {
    close(
      reducedPseudo(radius, coreRadius, true),
      reducedAllElectron(radius),
      1e-13,
      `Exterior match at rc=${coreRadius}, r=${radius}`,
    );
  }

  const boundaryOnlyNorm = normInside((r) => reducedPseudo(r, coreRadius, false), coreRadius);
  assert.ok(
    Math.abs(boundaryOnlyNorm - aeNorm) > 1e-5,
    `Boundary-only model should expose a norm mismatch at rc=${coreRadius}`,
  );
}

// Equal logarithmic derivatives at the reference energy for strong and weak wells.
// The cases lie in the declared domain where a unique positive-depth weak root
// exists on the first branch 0 < q rc < pi.
for (const [energy, depth] of [[0.1, 10.5], [0.2, 12], [0.4, 13.5]]) {
  const weakDepth = matchedWeakWellDepth(energy, depth, 1);
  assert.ok(Number.isFinite(weakDepth), `Expected a finite weak-well match for E=${energy}, depth=${depth}`);
  assert.ok(weakDepth > 0, `Expected a positive weak-well depth for E=${energy}, depth=${depth}`);
  assert.ok(weakDepth < depth - 0.5, `Expected a distinct weaker well for E=${energy}, depth=${depth}`);
  close(
    logDerivativeS(energy, weakDepth, 1),
    logDerivativeS(energy, depth, 1),
    1e-9,
    `Reference logarithmic derivative at E=${energy}`,
  );

  const shiftedEnergy = energy + 0.17;
  const shiftedDifference = Math.abs(
    logDerivativeS(shiftedEnergy, weakDepth, 1) - logDerivativeS(shiftedEnergy, depth, 1),
  );
  assert.ok(shiftedDifference > 1e-4, 'One-energy matching must not imply identical energy dependence');
}

// Fourier-tail proxy identities.
for (const tolerance of [1e-4, 1e-6, 1e-8]) {
  const q1 = cutoffForTail(1.0, tolerance);
  const q2 = cutoffForTail(2.0, tolerance);
  close(q1, 2 * q2, 1e-13, `Cutoff inverse-radius scaling at tolerance ${tolerance}`);
  close(residualFourierTail(1.0, q1), tolerance, tolerance * 1e-10, 'Tail at solved cutoff');
  close(residualFourierTail(2.0, q2), tolerance, tolerance * 1e-10, 'Tail at solved cutoff');
  close((q1 ** 2 / 2) / (q2 ** 2 / 2), 4, 1e-12, 'Kinetic-energy proxy scaling');
}

// The logarithmic tail axis must use the conventional orientation: the largest
// tail (log10 T = 0) is at the top, and smaller tails descend toward -12.
const hardnessSvgY = (tail) => 35 + (-Math.log10(Math.max(tail, 1e-12)) / 12) * 245;
close(hardnessSvgY(1), 35, 1e-13, 'Hardness axis top at log10 tail = 0');
close(hardnessSvgY(1e-6), 157.5, 1e-13, 'Hardness axis midpoint at log10 tail = -6');
close(hardnessSvgY(1e-12), 280, 1e-13, 'Hardness axis bottom at log10 tail = -12');
assert.ok(hardnessSvgY(1) < hardnessSvgY(1e-6), 'Smaller Fourier tails must plot lower on the SVG axis');
assert.ok(hardnessSvgY(1e-6) < hardnessSvgY(1e-12), 'The log-tail axis must remain monotone');

// Generalized-overlap charge accounting teaching identity.
for (const [smooth, correction] of [[0.82, 0.18], [1.1, -0.1], [0.6, 0.4]]) {
  close(augmentationNorm(smooth, correction), 1, 1e-14, 'Augmented norm');
}

// Finite projector algebra in a two-state example.
const B = [[2, 0.5], [0.5, 1.5]];
const det = B[0][0] * B[1][1] - B[0][1] * B[1][0];
assert.ok(Math.abs(det) > 0.1, 'Projector matrix must be invertible');
const inverse = [
  [B[1][1] / det, -B[0][1] / det],
  [-B[1][0] / det, B[0][0] / det],
];
for (let row = 0; row < 2; row += 1) {
  for (let column = 0; column < 2; column += 1) {
    const product = B[row][0] * inverse[0][column] + B[row][1] * inverse[1][column];
    close(product, row === column ? 1 : 0, 1e-13, 'B times inverse');
  }
}

const routePath = new URL('../src/content/docs/part-03-important-preliminaries-on-atoms/chapter-11-pseudopotentials.mdx', import.meta.url);
const route = await readFile(routePath, 'utf8');
assert.match(route, /status="chapter-complete"/, 'Chapter 11 route must declare complete content status');
assert.doesNotMatch(route, /ReadingOutline|正文待填充|outline ·|TODO/i, 'Chapter 11 route retains an outline marker');

const contentsPath = new URL('../src/components/part03/ch11/Chapter11Contents.astro', import.meta.url);
const contents = await readFile(contentsPath, 'utf8');
for (let section = 1; section <= 13; section += 1) {
  assert.match(contents, new RegExp(`section-11-${section}`), `Missing Chapter 11.${section} navigation anchor`);
}

const sourceMapPath = new URL('../src/components/part03/ch11/Chapter11SourceMap.astro', import.meta.url);
const sourceMap = await readFile(sourceMapPath, 'utf8');
const sourceRows = [...sourceMap.matchAll(/\['11\.[0-9]+'/g)].length;
assert.equal(sourceRows, 13, 'Chapter 11 source map must contain thirteen sections');

const componentFiles = [
  'PseudoWaveMatchingExplorer.astro',
  'LogDerivativeExplorer.astro',
  'HardnessExplorer.astro',
  'ProjectorFlowDiagram.astro',
  'AugmentationComparisonDiagram.astro',
];
for (const filename of componentFiles) {
  const content = await readFile(new URL(`../src/components/part03/ch11/${filename}`, import.meta.url), 'utf8');
  assert.match(content, /chapter-visual/, `${filename} is not registered as a chapter visualization`);
  assert.match(content, /Acceptance:|验收：/, `${filename} lacks an acceptance contract`);
  assert.match(content, /Boundary:|边界：/, `${filename} lacks a boundary contract`);
}

const hardnessComponent = await readFile(
  new URL('../src/components/part03/ch11/HardnessExplorer.astro', import.meta.url),
  'utf8',
);
const axisMappingPattern = /const y = \(tail\) => 35 \+ \(-Math\.log10\(Math\.max\(tail, 1e-12\)\) \/ 12\) \* 245;/g;
assert.equal(
  [...hardnessComponent.matchAll(axisMappingPattern)].length,
  2,
  'Hardness explorer must use the accepted log-tail axis mapping in both static and interactive rendering',
);
for (const label of ['>0</text>', '>−6</text>', '>−12</text>']) {
  assert.ok(hardnessComponent.includes(label), `Hardness explorer is missing the ${label} axis tick`);
}

console.log('Part III Chapter 11 deterministic validation passed: wave matching, log derivatives, hardness axis, augmentation, projector algebra, route, source map, and visualization contracts.');
