import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  cubicNormalElasticResponse,
  deformation2D,
  harmonicPairVirial,
  hartreeModeStress,
  internalStrainChain,
  kineticModeStress,
  pairVirialStress,
  relaxedElasticConstant,
} from '../src/data/part07/stressStrainModel.mjs';

const close = (actual, expected, tolerance = 1e-12, label = 'value') => {
  assert.ok(Number.isFinite(actual), `${label}: non-finite value ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, received ${actual}`);
};

const matrixClose = (actual, expected, tolerance, label) => {
  assert.equal(actual.length, expected.length, `${label}: row count`);
  actual.forEach((row, i) => row.forEach((value, j) => close(value, expected[i][j], tolerance, `${label}[${i},${j}]`)));
};

// Symmetric strain, metric, and rigid-rotation invariance.
const strainInput = { exx: 0.08, eyy: -0.03, exy: 0.06 };
const unrotated = deformation2D({ ...strainInput, rotation: 0 });
const rotated = deformation2D({ ...strainInput, rotation: 37 });
matrixClose(rotated.metric, unrotated.metric, 2e-14, 'metric invariant under rigid rotation');
close(rotated.areaRatio, unrotated.areaRatio, 2e-14, 'area invariant under rigid rotation');
close(rotated.principalStrains[0], unrotated.principalStrains[0], 2e-14, 'principal strain 1 invariant');
close(rotated.principalStrains[1], unrotated.principalStrains[1], 2e-14, 'principal strain 2 invariant');
close(unrotated.linearMetric[0][1], 2 * strainInput.exy, 1e-15, 'linear metric off-diagonal');
const pureRotation = deformation2D({ exx: 0, eyy: 0, exy: 0, rotation: 29 });
matrixClose(pureRotation.metric, [[1, 0], [0, 1]], 2e-14, 'pure rigid rotation metric');
close(pureRotation.areaRatio, 1, 2e-14, 'pure rigid rotation area');

// Cubic elastic energy, Martin stress sign, and finite-difference derivative.
const elasticInput = { C11: 2.1, C12: 0.65, strain: [0.035, -0.012, 0.018], volume: 2.7 };
const elastic = cubicNormalElasticResponse(elasticInput);
const step = 1e-6;
const plus = cubicNormalElasticResponse({ ...elasticInput, strain: [elasticInput.strain[0] + step, ...elasticInput.strain.slice(1)] });
const minus = cubicNormalElasticResponse({ ...elasticInput, strain: [elasticInput.strain[0] - step, ...elasticInput.strain.slice(1)] });
const derivative = (plus.energy - minus.energy) / (2 * step);
close(elastic.internalStress[0], -derivative / elasticInput.volume, 2e-10, 'Martin internal-stress sign from energy derivative');
const eta = 0.04;
const hydrostatic = cubicNormalElasticResponse({ C11: 2.1, C12: 0.65, strain: [eta, eta, eta] });
close(hydrostatic.pressure, 3 * hydrostatic.bulkModulus * eta, 2e-14, 'hydrostatic pressure and bulk modulus');
assert.throws(
  () => cubicNormalElasticResponse({ C11: 1, C12: 1.2, strain: [0, 0, 0] }),
  RangeError,
  'unstable cubic normal elastic constants must fail closed',
);

// Central-pair virial: symmetry, trace, rank-one direction, and harmonic derivative.
const pairVector = [1.2, -0.7, 0.5];
const dVdr = 0.83;
const pair = pairVirialStress({ vector: pairVector, dVdr, volume: 3.4 });
for (let i = 0; i < 3; i += 1) {
  for (let j = 0; j < 3; j += 1) close(pair.tensor[i][j], pair.tensor[j][i], 1e-15, `pair symmetry ${i}${j}`);
}
const pairDistance = Math.hypot(...pairVector);
close(pair.trace, pairDistance * dVdr / 3.4, 2e-14, 'pair virial trace');
close(pair.principalValue, pair.trace, 2e-14, 'pair rank-one principal value');
const harmonic = harmonicPairVirial({ vector: [1.4, 0, 0], restLength: 1.1, springConstant: 2.5, volume: 2 });
close(harmonic.trace, 1.4 * 2.5 * 0.3 / 2, 2e-14, 'harmonic pair virial');
assert.throws(
  () => pairVirialStress({ vector: [0, 0, 0], dVdr: 1, volume: 1 }),
  RangeError,
  'zero pair separation must fail closed',
);

// Hartree and kinetic Fourier-mode tensor structures.
const hartree = hartreeModeStress({ wavevector: [1, 1, 0], densityAmplitude: 0.4 });
const unitG = [1 / Math.sqrt(2), 1 / Math.sqrt(2), 0];
const transverse = [1 / Math.sqrt(2), -1 / Math.sqrt(2), 0];
const quadratic = (vector, tensor) => vector.reduce((sum, left, i) => sum + left * tensor[i].reduce((inner, value, j) => inner + value * vector[j], 0), 0);
close(quadratic(unitG, hartree.tensor), hartree.weight, 2e-14, 'Hartree longitudinal eigenvalue');
close(quadratic(transverse, hartree.tensor), -hartree.weight, 2e-14, 'Hartree transverse eigenvalue');
close(quadratic([0, 0, 1], hartree.tensor), -hartree.weight, 2e-14, 'Hartree second transverse eigenvalue');
close(hartree.trace, -hartree.weight, 2e-14, 'Hartree mode trace');
assert.throws(
  () => hartreeModeStress({ wavevector: [0, 0, 0], densityAmplitude: 1 }),
  RangeError,
  'Hartree G=0 must fail closed',
);
const kinetic = kineticModeStress({ momentum: [1.2, -0.5, 0.7], occupationWeight: 0.8, prefactor: 1.3 });
const perpendicular = [0.5, 1.2, 0];
close(quadratic(perpendicular, kinetic.tensor), 0, 2e-14, 'kinetic dyadic annihilates perpendicular vector');
close(kinetic.trace, kinetic.principalValue, 2e-14, 'kinetic rank-one trace');

// Internal strain: zero-force relaxation, series spring, symmetric limit, and stiffness reduction.
const chain = internalStrainChain({ R1: 1, R2: 1.4, K1: 6, K2: 1.5, strain: 0.08 });
close(chain.relaxedBond1Change + chain.relaxedBond2Change, chain.extension, 2e-14, 'chain extension constraint');
close(chain.force1, chain.force2, 2e-14, 'chain internal force balance');
close(chain.effectiveSpring, 6 * 1.5 / 7.5, 2e-14, 'series effective spring');
assert.ok(chain.relaxedEnergy <= chain.clampedEnergy + 1e-15, 'internal relaxation must not raise harmonic energy');
assert.ok(chain.relaxedStrainStiffness <= chain.clampedStrainStiffness + 1e-15, 'relaxed stiffness must not exceed clamped stiffness');
const symmetricChain = internalStrainChain({ R1: 1, R2: 1, K1: 2, K2: 2, strain: 0.07 });
close(symmetricChain.internalStrainParameter, 0, 2e-14, 'symmetric chain Gamma');
const stiffMolecule = internalStrainChain({ R1: 1, R2: 1.4, K1: 1000, K2: 1, strain: 0.08 });
assert.ok(Math.abs(stiffMolecule.relaxedBond1Change) < 0.001 * Math.abs(stiffMolecule.extension), 'stiff bond must be nearly incompressible');
const schur = relaxedElasticConstant({ clampedElastic: 8, strainInternalCoupling: 3, internalForceConstant: 6 });
close(schur.relaxedElastic, 6.5, 2e-14, 'single-coordinate Schur complement');

// Content and actual render-tree assembly.
const paths = {
  route: 'src/content/docs/part-07-appendices/appendix-g-stress-from-electronic-structure.mdx',
  index: 'src/content/docs/part-07-appendices/index.mdx',
  body: 'src/components/part07/appG/AppendixGBody.astro',
  contents: 'src/components/part07/appG/AppendixGContents.astro',
  orientation: 'src/components/part07/appG/AppendixGOrientation.mdx',
  macroscopic: 'src/components/part07/appG/AppendixGMacroscopicStress.mdx',
  pairFourier: 'src/components/part07/appG/AppendixGPairFourier.mdx',
  internalReview: 'src/components/part07/appG/AppendixGInternalReview.mdx',
  strainVisual: 'src/components/part07/appG/StrainMetricExplorer.astro',
  elasticVisual: 'src/components/part07/appG/ElasticStressExplorer.astro',
  contributionVisual: 'src/components/part07/appG/StressContributionExplorer.astro',
  chainVisual: 'src/components/part07/appG/InternalStrainChainExplorer.astro',
};
const content = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
);

assert.match(content.route, /<AppendixGBody\s*\/>/, 'route must render AppendixGBody');
assert.match(content.route, /status="appendix-content-complete"/, 'route status must be content complete');
for (const component of [
  'AppendixGContents',
  'AppendixGOrientation',
  'AppendixGMacroscopicStress',
  'AppendixGPairFourier',
  'AppendixGInternalReview',
]) {
  assert.match(content.body, new RegExp(`<${component}\\s*/>`), `body must render ${component}`);
}
for (const section of ['G.1', 'G.2', 'G.3', 'G.4']) {
  assert.ok(content.contents.includes(section), `source map and navigation must contain ${section}`);
}
const combinedSections = `${content.macroscopic}\n${content.pairFourier}\n${content.internalReview}`;
for (const marker of ['section-g-1', 'section-g-2', 'section-g-3', 'section-g-4', 'review']) {
  assert.ok(combinedSections.includes(marker), `content must expose ${marker}`);
}
for (const [container, visual] of [
  ['orientation', 'StrainMetricExplorer'],
  ['macroscopic', 'ElasticStressExplorer'],
  ['pairFourier', 'StressContributionExplorer'],
  ['internalReview', 'InternalStrainChainExplorer'],
]) {
  assert.match(content[container], new RegExp(`<${visual}\\s*/>`), `${visual} must be assembled in ${container}`);
}
const visualContracts = ['strainVisual', 'elasticVisual', 'contributionVisual', 'chainVisual']
  .map((key) => (content[key].match(/chapter-visual__contract/g) ?? []).length)
  .reduce((sum, count) => sum + count, 0);
assert.equal(visualContracts, 4, 'four visualization contracts must be present');

const combinedText = Object.values(content).join('\n');
assert.doesNotMatch(combinedText, /目录级阅读骨架|outline · 正文待填充|TODO/i, 'Appendix G must not retain outline or TODO markers');
assert.ok((combinedText.match(/bilingual-section__zh/g) ?? []).length >= 24, 'substantive Chinese bilingual coverage');
assert.ok((combinedText.match(/bilingual-section__en/g) ?? []).length >= 24, 'substantive English bilingual coverage');
for (const required of [
  'Martin internal stress',
  'pair-force contribution',
  'clamped-ion',
  'relaxed-ion',
  'Pulay',
  'source figure',
]) {
  assert.ok(combinedText.includes(required), `required scientific boundary missing: ${required}`);
}
assert.ok((content.internalReview.match(/<li><strong>/g) ?? []).length >= 10, 'ten original exercises must be present');
assert.match(
  content.index,
  /\| G · Stress from Electronic Structure \| (?:content complete(?:; deployment identity follows the site manifest)?|complete and deployed) \|/,
  'Part VII index must expose Appendix G as content-complete or deployed',
);
assert.doesNotMatch(
  content.index,
  /\| G · Stress from Electronic Structure \| outline \|/,
  'Appendix G must never regress to outline state',
);

console.log('Part VII Appendix G validation passed: strain/metric invariance, Martin stress sign, cubic elasticity, pair and Fourier tensors, internal relaxation, and route assembly.');
