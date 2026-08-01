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

const determinant2 = (matrix) => matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
const inverse2 = (matrix) => {
  const determinant = determinant2(matrix);
  assert.ok(Math.abs(determinant) > 1e-12, 'Two-state matrix is singular');
  return [
    [matrix[1][1] / determinant, -matrix[0][1] / determinant],
    [-matrix[1][0] / determinant, matrix[0][0] / determinant],
  ];
};
const multiply2 = (left, right) => [
  [
    left[0][0] * right[0][0] + left[0][1] * right[1][0],
    left[0][0] * right[0][1] + left[0][1] * right[1][1],
  ],
  [
    left[1][0] * right[0][0] + left[1][1] * right[1][0],
    left[1][0] * right[0][1] + left[1][1] * right[1][1],
  ],
];
const add2 = (left, right) => [
  [left[0][0] + right[0][0], left[0][1] + right[0][1]],
  [left[1][0] + right[1][0], left[1][1] + right[1][1]],
];
const quadratic2 = (vector, matrix) => (
  vector[0] * (matrix[0][0] * vector[0] + matrix[0][1] * vector[1])
  + vector[1] * (matrix[1][0] * vector[0] + matrix[1][1] * vector[1])
);
const isSymmetric2 = (matrix, tolerance = 1e-13) => Math.abs(matrix[0][1] - matrix[1][0]) <= tolerance;

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

// USPP unscreening identity. The derivative of the bare-ion one-particle
// contribution plus the Hartree-XC response equals the screened effective
// coefficient. Adding the response to the screened form a second time is a
// reproducible double-counting error.
const bareLocal = -5.4;
const hxcLocal = 1.25;
const screenedLocal = bareLocal + hxcLocal;
const bareProjector = [[1.8, 0.25], [0.25, 1.1]];
const hxcProjector = [[0.35, -0.08], [-0.08, 0.22]];
const screenedProjector = add2(bareProjector, hxcProjector);
const projectorCoefficients = [0.72, -0.31];
const bareContribution = bareLocal + quadratic2(projectorCoefficients, bareProjector);
const hxcContribution = hxcLocal + quadratic2(projectorCoefficients, hxcProjector);
const screenedContribution = screenedLocal + quadratic2(projectorCoefficients, screenedProjector);
close(
  bareContribution + hxcContribution,
  screenedContribution,
  1e-13,
  'Bare-ion plus Hartree-XC response must equal the screened USPP operator',
);
assert.ok(
  Math.abs((screenedContribution + hxcContribution) - screenedContribution) > 0.1,
  'Adding Hartree-XC to the screened USPP operator must be detected as double counting',
);

// Multiprojector algebra has separate reproduction and Hermiticity gates.
// A symmetric, invertible B has a symmetric inverse and can define a Hermitian
// chi B^{-1} chi^T operator for real projectors.
const B = [[2, 0.5], [0.5, 1.5]];
assert.ok(Math.abs(determinant2(B)) > 0.1, 'Projector matrix must be invertible');
assert.ok(isSymmetric2(B), 'Generalized norm conservation should supply a symmetric real B matrix');
const inverse = inverse2(B);
assert.ok(isSymmetric2(inverse), 'The inverse of the accepted symmetric B matrix must remain symmetric');
const identity = multiply2(B, inverse);
for (let row = 0; row < 2; row += 1) {
  for (let column = 0; column < 2; column += 1) {
    close(identity[row][column], row === column ? 1 : 0, 1e-13, 'B times inverse');
  }
}

// Invertibility alone is insufficient. With chi equal to the identity in this
// finite toy basis, V_NL = B^{-1}; an invertible but nonsymmetric B therefore
// gives a non-Hermitian operator even though the inverse exists.
const invertibleButNonHermitianB = [[2, 0.7], [0.2, 1.5]];
assert.ok(Math.abs(determinant2(invertibleButNonHermitianB)) > 0.1, 'Counterexample B must be invertible');
assert.ok(!isSymmetric2(invertibleButNonHermitianB), 'Counterexample B must violate Hermiticity');
const nonHermitianOperator = inverse2(invertibleButNonHermitianB);
assert.ok(
  !isSymmetric2(nonHermitianOperator),
  'An invertible nonsymmetric B must not be accepted as a Hermitian multiprojector operator',
);

const routePath = new URL('../src/content/docs/part-03-important-preliminaries-on-atoms/chapter-11-pseudopotentials.mdx', import.meta.url);
const route = await readFile(routePath, 'utf8');
assert.match(route, /status="chapter-complete"/, 'Chapter 11 route must declare complete content status');
assert.doesNotMatch(route, /ReadingOutline|正文待填充|outline ·|TODO/i, 'Chapter 11 route retains an outline marker');
assert.match(
  route,
  /NormConservationConventionAudit/,
  'Chapter 11 route must register the norm-conservation source-convention audit',
);

const conventionAudit = await readFile(
  new URL('../src/components/part03/ch11/NormConservationConventionAudit.mdx', import.meta.url),
  'utf8',
);
assert.match(
  conventionAudit,
  /data-norm-conservation-convention-audit/,
  'Norm-conservation convention audit marker is missing',
);
for (const equationNumber of ['11.24', '11.25', '11.27', '11.28']) {
  assert.ok(
    conventionAudit.includes(equationNumber),
    `Norm-conservation convention audit must identify Eq. (${equationNumber})`,
  );
}
assert.match(conventionAudit, /=\s*-2/, 'Convention audit must show the Hartree-energy derivative coefficient -2');
assert.match(conventionAudit, /Rydberg/, 'Convention audit must explain the alternative Rydberg energy scaling');
assert.match(
  conventionAudit,
  /因子不一致|factor inconsistency/,
  'Convention audit must label the adjacent printed formulas as an unresolved factor inconsistency',
);
assert.match(
  conventionAudit,
  /不能在同一个[^\n]+混用|cannot be mixed under one definition/,
  'Convention audit must prohibit mixing coefficients under one energy definition',
);

const projectors = await readFile(
  new URL('../src/components/part03/ch11/Chapter11Projectors.mdx', import.meta.url),
  'utf8',
);
assert.match(projectors, /data-multiprojector-hermiticity-audit/);
assert.match(projectors, /data-reference-reproduction="separate-gate"/);
assert.match(projectors, /data-hermiticity-condition="B-Hermitian"/);
assert.match(projectors, /generalized norm-conserving \/ ONCV/);
assert.match(projectors, /\\langle\\phi_i\|\\phi_j\\rangle_\{r_c\}/);
assert.match(projectors, /\\langle\\psi_i\|\\psi_j\\rangle_\{r_c\}/);
assert.match(projectors, /B=B\^\\dagger/);
assert.match(projectors, /\\chi B\^{-1\}\\chi\^\\dagger/);
assert.match(projectors, /\|\\chi_s\\rangle\(B\^{-1\}\)_\{ss'\}\\langle\\chi_\{s'\}\|/);
assert.match(projectors, /Reference-state reproduction, matrix Hermiticity, numerical conditioning, and ghost-state scans/);
assert.match(projectors, /参考态复现、矩阵 Hermiticity、数值条件数和 ghost-state 扫描/);
assert.match(projectors, /Invertibility alone/);
assert.doesNotMatch(
  projectors,
  /The construction requires an invertible, well-conditioned finite matrix; equivalent implementations/,
  'The old invertibility-only acceptance statement must not remain',
);

const ultrasoftPaw = await readFile(
  new URL('../src/components/part03/ch11/Chapter11UltrasoftPAW.mdx', import.meta.url),
  'utf8',
);
assert.match(ultrasoftPaw, /data-uspp-unscreening-audit/);
assert.match(ultrasoftPaw, /data-energy-functional-convention="bare-ion"/);
assert.match(ultrasoftPaw, /data-generalized-eigenproblem-convention="screened-effective"/);
assert.match(ultrasoftPaw, /data-source-locators="11\.57,11\.58,11\.59"/);
for (const equationNumber of ['11.57', '11.58', '11.59']) {
  assert.ok(
    ultrasoftPaw.includes(equationNumber),
    `USPP convention audit must identify Eq. (${equationNumber})`,
  );
}
assert.match(ultrasoftPaw, /V_\{\\mathrm\{loc\}\}\^\{\\mathrm\{ion\}\}/);
assert.match(ultrasoftPaw, /D_\{ij\}\^\{\\mathrm\{ion\}\}/);
assert.match(ultrasoftPaw, /D_\{ij\}\^\{Hxc\}/);
assert.match(ultrasoftPaw, /\\hat H_\{\\mathrm\{eff\}\}\^\{US\}/);
assert.match(
  ultrasoftPaw,
  /重复计数|double count/,
  'USPP convention audit must state the Hartree-XC double-counting boundary',
);
assert.match(
  ultrasoftPaw,
  /bare-ion 还是 screened representation|bare-ion or screened representation/,
  'USPP convention audit must require coefficient-role provenance',
);
assert.ok(
  !ultrasoftPaw.includes('+V_H[n]+V_{xc}[n].'),
  'The old ambiguous screened-plus-explicit-Hxc Hamiltonian must not remain',
);

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

console.log('Part III Chapter 11 deterministic validation passed: wave matching, log derivatives, norm-conservation source convention, hardness axis, augmentation, USPP unscreening, multiprojector reproduction and Hermiticity, route, source map, and visualization contracts.');