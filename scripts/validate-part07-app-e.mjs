import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  dielectricModelDefaults,
  integrateFSum,
  longitudinalTransverseDecomposition,
  lorentzDielectric,
  macroscopicDielectricFromMatrix,
  nonanalyticModeShift,
  polarModeResponse,
  splitOscillatorStrength,
} from '../src/data/part07/dielectricOpticsModel.mjs';

const close = (actual, expected, tolerance = 1e-12, label = 'value') => {
  assert.ok(Number.isFinite(actual), `${label}: non-finite value ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, received ${actual}`);
};

// Longitudinal/transverse projector identities.
const decomposition = longitudinalTransverseDecomposition({
  vector: [2, -1, 3],
  wavevector: [1, 2, -1],
});
for (let index = 0; index < 3; index += 1) {
  close(
    decomposition.longitudinal[index] + decomposition.transverse[index],
    [2, -1, 3][index],
    1e-14,
    `field reconstruction component ${index}`,
  );
}
close(decomposition.longitudinalDotTransverse, 0, 1e-14, 'longitudinal-transverse orthogonality');
const transverseDotQ = decomposition.transverse.reduce((sum, value, index) => sum + value * [1, 2, -1][index], 0);
close(transverseDotQ, 0, 1e-14, 'transverse field orthogonal to q');
assert.throws(
  () => longitudinalTransverseDecomposition({ vector: [1, 0], wavevector: [0, 0] }),
  RangeError,
  'zero wave vector must fail closed',
);

// Lorentz dielectric and Gaussian conductivity relations.
const singleResonance = [{ frequency: 1, strength: 1.6 }];
const staticResponse = lorentzDielectric({
  omega: 0,
  epsilonInfinity: 2.5,
  resonances: singleResonance,
  damping: 0.08,
});
close(staticResponse.real, 4.1, 1e-15, 'static Lorentz dielectric');
close(staticResponse.imaginary, 0, 1e-15, 'static loss');
close(staticResponse.conductivityReal, 0, 1e-15, 'static regular conductivity');
const resonantResponse = lorentzDielectric({
  omega: 1,
  epsilonInfinity: 2.5,
  resonances: singleResonance,
  damping: 0.08,
});
assert.ok(resonantResponse.imaginary > 0, 'retarded dielectric loss must be positive at positive frequency');
close(
  resonantResponse.conductivityReal,
  resonantResponse.omega * resonantResponse.imaginary / (4 * Math.PI),
  1e-14,
  'Gaussian Re sigma relation',
);
const highFrequency = lorentzDielectric({
  omega: 100,
  epsilonInfinity: 1,
  resonances: singleResonance,
  damping: 0.08,
});
close(highFrequency.real, 1 - 1.6 / 100 ** 2, 2e-8, 'high-frequency free-electron coefficient');

// f-sum is invariant under redistribution of a fixed total strength.
for (const fraction of [0.15, 0.55, 0.85]) {
  const resonances = splitOscillatorStrength({
    totalStrength: dielectricModelDefaults.totalStrength,
    fraction,
    omega1: dielectricModelDefaults.omega1,
    omega2: dielectricModelDefaults.omega2,
  });
  close(
    resonances.reduce((sum, entry) => sum + entry.strength, 0),
    dielectricModelDefaults.totalStrength,
    1e-15,
    `fixed oscillator strength at fraction ${fraction}`,
  );
  const sum = integrateFSum({
    epsilonInfinity: dielectricModelDefaults.epsilonInfinity,
    resonances,
    damping: dielectricModelDefaults.damping,
    maxOmega: 12,
    intervals: 48000,
  });
  close(sum.epsilonMoment, sum.expectedEpsilonMoment, 0.012, `epsilon f-sum at fraction ${fraction}`);
  close(sum.conductivityWeight, sum.expectedConductivityWeight, 0.001, `conductivity f-sum at fraction ${fraction}`);
}
assert.throws(
  () => splitOscillatorStrength({ totalStrength: 1, fraction: 1.1, omega1: 1, omega2: 2 }),
  RangeError,
  'invalid oscillator fraction must fail',
);

// Microscopic dielectric matrix and macroscopic Schur complement.
const uncoupled = macroscopicDielectricFromMatrix({ epsilon00: 5, epsilon11: 3, coupling: 0 });
close(uncoupled.macroscopic, 5, 1e-15, 'uncoupled macroscopic dielectric');
close(uncoupled.localFieldCorrection, 0, 1e-15, 'uncoupled local-field correction');
const localField = macroscopicDielectricFromMatrix({ epsilon00: 5, epsilon11: 3, coupling: 1.2 });
close(localField.macroscopic, localField.schurComplement, 1e-15, 'Schur-complement identity');
close(localField.macroscopic, 4.52, 1e-14, 'local-field corrected dielectric');
assert.ok(localField.macroscopic < 5, 'positive symmetric local-field coupling lowers epsilon_M in this model');
assert.throws(
  () => macroscopicDielectricFromMatrix({ epsilon00: 1, epsilon11: 1, coupling: 1 }),
  RangeError,
  'singular dielectric matrix must fail closed',
);

// Single polar mode and Lyddane-Sachs-Teller relation.
for (const strength of [0.2, 0.6, 1.8, 3.0]) {
  const response = polarModeResponse({
    omega: 1,
    epsilonInfinity: dielectricModelDefaults.epsilonInfinity,
    strength,
    omegaTO: dielectricModelDefaults.omegaTO,
    damping: dielectricModelDefaults.damping,
  });
  close(response.lstRatio, response.frequencyRatioSquared, 1e-14, `LST relation at strength ${strength}`);
  assert.ok(response.omegaLO > response.omegaTO, `positive polar strength must produce LO above TO at ${strength}`);
  assert.ok(response.lossFunction >= 0, `loss function must be non-negative at ${strength}`);
}
const weakPolar = polarModeResponse({
  omega: 1,
  epsilonInfinity: 2.5,
  strength: 1e-10,
  omegaTO: 0.75,
  damping: 0.08,
});
close(weakPolar.omegaLO, weakPolar.omegaTO, 3e-11, 'zero-strength LO-TO limit');

// Directional nonanalytic Born-charge projection.
const epsilonTensor = [
  [4, 0, 0],
  [0, 2, 0],
  [0, 0, 5],
];
close(
  nonanalyticModeShift({
    direction: [1, 0, 0],
    bornChargeVector: [2, 0, 0],
    epsilonTensor,
  }),
  1,
  1e-15,
  'parallel x nonanalytic shift',
);
close(
  nonanalyticModeShift({
    direction: [0, 1, 0],
    bornChargeVector: [2, 0, 0],
    epsilonTensor,
  }),
  0,
  1e-15,
  'perpendicular nonanalytic shift',
);
close(
  nonanalyticModeShift({
    direction: [1, 1, 0],
    bornChargeVector: [2, 0, 0],
    epsilonTensor,
  }),
  2 / 3,
  1e-14,
  'anisotropic directional shift',
);
assert.throws(
  () => nonanalyticModeShift({
    direction: [0, 0, 0],
    bornChargeVector: [1, 0, 0],
    epsilonTensor,
  }),
  RangeError,
  'zero direction must fail closed',
);

// Content and actual render-tree assembly.
const paths = {
  route: 'src/content/docs/part-07-appendices/appendix-e-dielectric-functions-and-optical-properties.mdx',
  body: 'src/components/part07/appE/AppendixEBody.astro',
  contents: 'src/components/part07/appE/AppendixEContents.astro',
  orientation: 'src/components/part07/appE/AppendixEOrientation.mdx',
  maxwell: 'src/components/part07/appE/AppendixEMaxwellConductivity.mdx',
  longTrans: 'src/components/part07/appE/AppendixELongitudinalTransverse.mdx',
  lattice: 'src/components/part07/appE/AppendixELatticeReview.mdx',
  fieldMap: 'src/components/part07/appE/FieldConventionMap.astro',
  spectral: 'src/components/part07/appE/SpectralWeightExplorer.astro',
  localField: 'src/components/part07/appE/LocalFieldMatrixExplorer.astro',
  polar: 'src/components/part07/appE/PolarModeExplorer.astro',
};
const content = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
);

assert.match(content.route, /<AppendixEBody\s*\/>/, 'route must render AppendixEBody');
for (const component of [
  'AppendixEContents',
  'AppendixEOrientation',
  'AppendixEMaxwellConductivity',
  'AppendixELongitudinalTransverse',
  'AppendixELatticeReview',
]) {
  assert.match(content.body, new RegExp(`<${component}\\s*/>`), `body must render ${component}`);
}
for (const section of ['E.1', 'E.2', 'E.3', 'E.4', 'E.5', 'E.6']) {
  assert.ok(content.contents.includes(section), `source map must contain ${section}`);
}
const combinedSections = `${content.maxwell}\n${content.longTrans}\n${content.lattice}`;
for (const marker of [
  'section-e-1',
  'section-e-2',
  'section-e-3',
  'section-e-4',
  'section-e-5',
  'section-e-6',
]) {
  assert.ok(combinedSections.includes(marker), `content must expose ${marker}`);
}
for (const [container, visual] of [
  ['orientation', 'FieldConventionMap'],
  ['maxwell', 'SpectralWeightExplorer'],
  ['longTrans', 'LocalFieldMatrixExplorer'],
  ['lattice', 'PolarModeExplorer'],
]) {
  assert.match(content[container], new RegExp(`<${visual}\\s*/>`), `${visual} must be assembled in ${container}`);
}
const visualContracts = ['fieldMap', 'spectral', 'localField', 'polar']
  .map((key) => (content[key].match(/chapter-visual__contract/g) ?? []).length)
  .reduce((sum, count) => sum + count, 0);
assert.equal(visualContracts, 4, 'four visual contracts must be present');
const combinedText = Object.values(content).join('\n');
assert.doesNotMatch(combinedText, /outline · 正文待填充|TODO/i, 'Appendix E must not retain outline or TODO markers');
assert.ok((combinedText.match(/bilingual-section__zh/g) ?? []).length >= 20, 'substantive Chinese bilingual coverage');
assert.ok((combinedText.match(/bilingual-section__en/g) ?? []).length >= 20, 'substantive English bilingual coverage');
assert.ok(combinedText.includes('e^{-i\\omega t}') || combinedText.includes('e^{-i\omega t}'), 'time convention must be explicit');
assert.ok(combinedText.includes('Gaussian'), 'Gaussian-unit convention must be explicit');
assert.ok(combinedText.includes('Martin p.602'), 'source convention mismatch must be documented');
assert.ok(combinedText.includes('Schur complement'), 'local-field Schur-complement derivation must be present');
assert.ok(combinedText.includes('Lyddane') && combinedText.includes('Sachs') && combinedText.includes('Teller'), 'LST relation must be named');

console.log('Part VII Appendix E validation passed: field projectors, dielectric-conductivity relation, f-sum, local fields, LST, nonanalytic shifts, and route assembly.');
