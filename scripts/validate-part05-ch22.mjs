import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  dipoleSheetStep,
  slabWorkFunction,
  tammBoundaryState,
  tammAmplitudes,
  interfaceBandOffsets,
  polarDiscontinuityProfile,
  parabolicDOS,
  sampleDimensionalDOS,
} from '../src/data/part05/ch22TeachingModels.mjs';

const close = (actual, expected, tolerance = 1e-10, label = 'value') => {
  assert.ok(Number.isFinite(actual), `${label} must be finite`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} != ${expected}`);
};

const groups = [];
const group = async (name, fn) => {
  await fn();
  groups.push(name);
};

await group('dipole-sheet linearity', () => {
  close(dipoleSheetStep({ arealDipole: 2, permittivity: 4 }), 0.5, 1e-12, 'dipole step');
  close(
    dipoleSheetStep({ arealDipole: 4, permittivity: 4 }),
    2 * dipoleSheetStep({ arealDipole: 2, permittivity: 4 }),
    1e-12,
    'dipole linearity',
  );
});

await group('symmetric slab and work-function identities', () => {
  const symmetric = slabWorkFunction({ leftDipole: 2.1, rightDipole: 2.1, vacuumThickness: 12, fermiEnergy: -5 });
  close(symmetric.residualField, 0, 1e-12, 'symmetric residual field');
  close(symmetric.leftWorkFunction, symmetric.rightWorkFunction, 1e-12, 'symmetric work functions');
  const shiftedFermi = slabWorkFunction({ leftDipole: 2.1, rightDipole: 2.1, vacuumThickness: 12, fermiEnergy: -4.5 });
  close(shiftedFermi.leftWorkFunction - symmetric.leftWorkFunction, -0.5, 1e-12, 'Fermi shift');
  assert.deepEqual(
    shiftedFermi.profile.map(({ potential }) => potential),
    symmetric.profile.map(({ potential }) => potential),
    'Fermi energy must not alter the teaching potential profile',
  );
});

await group('asymmetric slab inverse-vacuum field scaling', () => {
  const short = slabWorkFunction({ leftDipole: 1, rightDipole: 3, vacuumThickness: 10 });
  const long = slabWorkFunction({ leftDipole: 1, rightDipole: 3, vacuumThickness: 20 });
  close(long.residualField, short.residualField / 2, 1e-12, 'inverse vacuum scaling');
});

await group('Tamm bound-state threshold and energy', () => {
  assert.equal(tammBoundaryState({ hopping: -1, boundaryShift: 0.9 }).hasBoundState, false);
  assert.equal(tammBoundaryState({ hopping: -1, boundaryShift: 1 }).hasBoundState, false);
  const upper = tammBoundaryState({ hopping: -1, boundaryShift: 2 });
  assert.equal(upper.hasBoundState, true);
  close(upper.energy, 2.5, 1e-12, 'upper Tamm energy');
  close(upper.decayRatio, 0.5, 1e-12, 'Tamm decay ratio');
  assert.equal(upper.side, 'above');
  const lower = tammBoundaryState({ hopping: -1, boundaryShift: -2 });
  close(lower.energy, -2.5, 1e-12, 'lower Tamm energy');
  assert.equal(lower.side, 'below');
});

await group('Tamm probability normalization and localization', () => {
  const localized = tammAmplitudes({ hopping: -1, boundaryShift: 2, sites: 200 });
  close(localized.amplitudes.reduce((sum, item) => sum + item.probability, 0), 1, 1e-12, 'Tamm probability');
  const weak = tammBoundaryState({ hopping: -1, boundaryShift: 1.1 });
  const strong = tammBoundaryState({ hopping: -1, boundaryShift: 2.5 });
  assert.ok(strong.localizationLength < weak.localizationLength, 'stronger boundary shift must localize more strongly');
});

await group('interface-lineup decomposition', () => {
  const base = interfaceBandOffsets({ lineup: 0.1, strainValenceB: 0, strainConductionB: 0 });
  const shifted = interfaceBandOffsets({ lineup: 0.35, strainValenceB: 0, strainConductionB: 0 });
  close(shifted.valenceOffset - base.valenceOffset, 0.25, 1e-12, 'valence lineup derivative');
  close(shifted.conductionOffset - base.conductionOffset, 0.25, 1e-12, 'conduction lineup derivative');
  const strain = interfaceBandOffsets({ lineup: 0.1, strainValenceB: -0.2, strainConductionB: 0.3 });
  close(strain.valenceOffset - base.valenceOffset, -0.2, 1e-12, 'valence strain isolation');
  close(strain.conductionOffset - base.conductionOffset, 0.3, 1e-12, 'conduction strain isolation');
});

await group('polar-discontinuity compensation limit', () => {
  const uncompensated = polarDiscontinuityProfile({ layers: 20, layerCharge: 1, compensation: 0 });
  const half = polarDiscontinuityProfile({ layers: 20, layerCharge: 1, compensation: 0.5 });
  close(half.averageSlope, 0, 1e-12, 'half-compensated slope');
  assert.ok(Math.abs(uncompensated.averageSlope) > 0.1, 'uncompensated stack must retain a macroscopic slope');
  const short = polarDiscontinuityProfile({ layers: 8, layerCharge: 1, compensation: 0 });
  assert.ok(uncompensated.potentialRange > short.potentialRange, 'uncompensated potential range must grow with thickness');
});

await group('dimensional DOS analytic exponents', () => {
  close(parabolicDOS({ energy: 0.25, edge: 0, dimension: 2, broadening: 0.01 }), 1, 1e-12, '2D constant DOS');
  close(parabolicDOS({ energy: 0.25, edge: 0, dimension: 3, broadening: 0.01 }), 0.5, 1e-12, '3D square-root DOS');
  close(parabolicDOS({ energy: 0.25, edge: 0, dimension: 1, broadening: 0.01 }), 2, 1e-12, '1D inverse-root DOS');
  const broad = parabolicDOS({ energy: 0, edge: 0, dimension: 1, broadening: 0.04 });
  const narrow = parabolicDOS({ energy: 0, edge: 0, dimension: 1, broadening: 0.01 });
  close(narrow / broad, 2, 1e-12, '1D broadening scaling');
  assert.equal(sampleDimensionalDOS({ points: 41 }).length, 41);
});

const paths = {
  route: 'src/content/docs/part-05-properties-of-matter/chapter-22-surfaces-interfaces-and-lower-dimensional-systems.mdx',
  orientation: 'src/components/part05/ch22/Chapter22OrientationAndTerms.mdx',
  sourceMap: 'src/components/part05/ch22/Chapter22SourceMap.astro',
  electrostatics: 'src/components/part05/ch22/Chapter22ElectrostaticsSlabs.mdx',
  surfaces: 'src/components/part05/ch22/Chapter22SurfaceStates.mdx',
  interfaces: 'src/components/part05/ch22/Chapter22Interfaces.mdx',
  lowdimensional: 'src/components/part05/ch22/Chapter22LowDimensional.mdx',
  closing: 'src/components/part05/ch22/Chapter22Closing.mdx',
};
const text = Object.fromEntries(await Promise.all(Object.entries(paths).map(async ([key, path]) => [
  key,
  await readFile(resolve(path), 'utf8'),
])));

await group('source-map and section completeness', () => {
  for (let section = 1; section <= 9; section += 1) {
    const id = `22.${section}`;
    assert.ok(text.sourceMap.includes(`'${id}'`), `source map missing ${id}`);
    assert.ok(Object.values(text).some((value) => value.includes(`id=\"section-22-${section}\"`)), `body missing section anchor ${id}`);
  }
  assert.match(text.route, /Chapter22Contents/);
  assert.match(text.route, /Chapter22Body/);
  assert.doesNotMatch(Object.values(text).join('\n'), /outline · 正文待填充|正文待填充|TODO|TBD/);
});

await group('bilingual and evidence-boundary coverage', () => {
  const corpus = Object.values(text).join('\n');
  const bilingualCount = (corpus.match(/<BilingualSection/g) ?? []).length;
  assert.ok(bilingualCount >= 20, `expected at least 20 bilingual sections, got ${bilingualCount}`);
  for (const term of [
    'projected bulk continuum', 'surface resonance', 'Tamm', 'Shockley', 'Rashba',
    'work function', 'interface lineup', 'polar discontinuity', 'Coulomb truncation',
    '不能自动', 'not automatically', '科学证据矩阵', 'Scientific Evidence Matrix',
  ]) assert.ok(corpus.includes(term), `missing boundary term: ${term}`);
  assert.ok((text.closing.match(/<li>/g) ?? []).length >= 18, 'expected misconceptions plus at least ten exercises');
});

await group('visualization accessibility contracts', async () => {
  const components = [
    'SlabWorkFunctionExplorer.astro',
    'SurfaceStateExplorer.astro',
    'InterfaceLineupExplorer.astro',
    'PolarDiscontinuityExplorer.astro',
    'DimensionalDOSExplorer.astro',
  ];
  for (const name of components) {
    const value = await readFile(resolve('src/components/part05/ch22', name), 'utf8');
    assert.match(value, /class=\"chapter-visual/);
    assert.match(value, /chapter-visual__contract/);
    assert.match(value, /<noscript>/);
    assert.match(value, /无 JavaScript fallback/);
    assert.match(value, /aria-labelledby|role=\"img\"/);
    assert.doesNotMatch(value, /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/, `${name} contains control characters`);
  }
});

await group('copyright and repository hygiene', () => {
  const corpus = Object.values(text).join('\n');
  assert.match(corpus, /不转录原书正文|不转录原书|source prose/);
  assert.match(corpus, /原创教学模型|Original teaching model|Original analytic model/);
  assert.doesNotMatch(corpus, /POTCAR|WAVECAR|CHGCAR|BEGIN PRIVATE KEY|ghp_[A-Za-z0-9]/);
  assert.doesNotMatch(corpus, /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/, 'content contains control characters');
});

console.log(`Part V Chapter 22 validation passed: ${groups.length} deterministic/content groups.`);
console.log(groups.map((name, index) => `${index + 1}. ${name}`).join('\n'));
