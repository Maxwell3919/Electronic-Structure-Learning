import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  frozenReferenceDifference,
  pressureEquationOfState,
  rectangularStressFlux,
  rigidRegionBookkeeping,
  stationaryPathModel,
} from '../src/data/part07/alternativeForceModel.mjs';

const close = (actual, expected, tolerance = 1e-11, label = 'value') => {
  assert.ok(Number.isFinite(actual), `${label}: non-finite value ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, received ${actual}`);
};

const derivative = (fn, x, step = 1e-6) => (fn(x + step) - fn(x - step)) / (2 * step);
const secondDerivative = (fn, x, step = 1e-4) => (fn(x + step) - 2 * fn(x) + fn(x - step)) / step ** 2;
const trapezoid = (fn, start, end, intervals = 20000) => {
  const step = (end - start) / intervals;
  let total = 0.5 * (fn(start) + fn(end));
  for (let index = 1; index < intervals; index += 1) total += fn(start + index * step);
  return total * step;
};

// Variational path freedom: first derivative invariant, curvature and finite-step error path dependent.
const slopes = [-0.7, 0, 0.35, 0.8, 1.4];
const firstDerivatives = slopes.map((pathSlope) => {
  const energy = (lambda) => stationaryPathModel({ pathSlope, lambda }).pathEnergy;
  return derivative(energy, 0, 1e-7);
});
for (const value of firstDerivatives) close(value, -1.2, 2e-9, 'stationary first derivative');
const curvatures = slopes.map((pathSlope) => {
  const model = stationaryPathModel({ pathSlope, lambda: 0.2 });
  const numerical = secondDerivative((lambda) => stationaryPathModel({ pathSlope, lambda }).pathEnergy, 0);
  close(numerical, model.pathSecondDerivative, 2e-7, `path curvature at s=${pathSlope}`);
  return model.pathSecondDerivative;
});
assert.ok(Math.max(...curvatures) - Math.min(...curvatures) > 1, 'second-order curvature must depend on path');
close(stationaryPathModel({ pathSlope: 0.8 }).pathError, 0, 2e-15, 'stationary response path must have zero relaxation error');
assert.ok(stationaryPathModel({ pathSlope: -0.7 }).pathError > 0, 'nonstationary trial path must have positive quadratic error');
assert.throws(() => stationaryPathModel({ stiffness: 0 }), RangeError, 'nonpositive variational stiffness must fail closed');

// Frozen-reference energy difference: common first derivative and exact quadratic relaxation correction.
for (const stiffness of [1.8, 4, 7.5]) {
  const frozenDerivative = derivative((lambda) => frozenReferenceDifference({ stiffness, lambda }).frozenDifference, 0, 1e-7);
  const relaxedDerivative = derivative((lambda) => frozenReferenceDifference({ stiffness, lambda }).relaxedDifference, 0, 1e-7);
  close(frozenDerivative, relaxedDerivative, 2e-9, `frozen/relaxed first derivative at K=${stiffness}`);
  close(frozenDerivative, 1.12, 2e-9, `common reference first derivative at K=${stiffness}`);
  for (const lambda of [-0.35, -0.12, 0.17, 0.31]) {
    const result = frozenReferenceDifference({ stiffness, lambda });
    close(result.relaxationCorrection, result.predictedQuadraticCorrection, 2e-14, `quadratic relaxation at K=${stiffness}, lambda=${lambda}`);
    close(result.frozenDifference, result.linearDifference, 2e-14, 'frozen difference must equal linear estimate');
  }
}
assert.throws(
  () => frozenReferenceDifference({ stiffness: 1, referenceDensity: 0.1, sourceCoupling: 4, lambda: 1 }),
  RangeError,
  'teaching regime with nonpositive relaxed density must fail closed',
);

// Pressure: analytic derivative, equilibrium, bulk modulus, and independent pressure quadrature.
for (const attractionCoefficient of [3, 4, 5.5]) {
  const equilibrium = pressureEquationOfState({ attractionCoefficient, volume: 10 }).equilibriumVolume;
  const equilibriumModel = pressureEquationOfState({ attractionCoefficient, volume: equilibrium });
  close(equilibriumModel.pressure, 0, 3e-15, `zero pressure at equilibrium B=${attractionCoefficient}`);
  assert.ok(equilibriumModel.bulkModulus > 0, 'equilibrium bulk modulus must be positive');
  for (const volume of [6, 11, 19, 25]) {
    const model = pressureEquationOfState({ attractionCoefficient, volume });
    const numericalPressure = -derivative(model.energyAt, volume, 1e-5);
    close(numericalPressure, model.pressure, 3e-10, `pressure derivative at V=${volume}`);
    const numericalBulk = -volume * derivative(model.pressureAt, volume, 1e-5);
    close(numericalBulk, model.bulkModulus, 5e-10, `bulk derivative at V=${volume}`);
    const integral = -trapezoid(model.pressureAt, model.referenceVolume, volume, 24000);
    close(integral, model.energyDifference, 2e-9, `pressure integral at V=${volume}`);
  }
}
assert.throws(() => pressureEquationOfState({ volume: 0 }), RangeError, 'zero volume must fail closed');

// Closed-surface force theorem and open-patch failure.
for (const normalGradient of [-0.1, 0.4, 1.1]) {
  for (const crossingShear of [-0.5, 0.2, 0.8]) {
    const result = rectangularStressFlux({ normalGradient, crossingShear });
    close(result.closedSurfaceFlux[0], result.volumeForce[0], 2e-14, 'closed-surface x flux');
    close(result.closedSurfaceFlux[1], result.volumeForce[1], 2e-14, 'closed-surface y flux');
    close(result.openSurfaceFlux[0] + result.omittedBottomFlux[0], result.closedSurfaceFlux[0], 2e-14, 'open x plus omitted face');
    close(result.openSurfaceFlux[1] + result.omittedBottomFlux[1], result.closedSurfaceFlux[1], 2e-14, 'open y plus omitted face');
    assert.ok(Math.hypot(...result.omittedBottomFlux) > 0, 'open patch must retain a boundary error in the sampled model');
  }
}
assert.throws(() => rectangularStressFlux({ xMin: 1, xMax: 1 }), RangeError, 'zero-area control volume must fail closed');

// Rigid-region bookkeeping.
for (const displacement of [-0.08, -0.02, 0.04, 0.09]) {
  const result = rigidRegionBookkeeping({ displacement, crossingForce: 0.75 });
  close(result.internalChange, 0, 2e-15, 'rigid internal region cancellation');
  close(result.totalEnergyChange, -result.force * displacement, 2e-15, 'crossing energy work');
}

// Content and actual render-tree assembly.
const paths = {
  route: 'src/content/docs/part-07-appendices/appendix-i-alternative-force-expressions.mdx',
  index: 'src/content/docs/part-07-appendices/index.mdx',
  body: 'src/components/part07/appI/AppendixIBody.astro',
  contents: 'src/components/part07/appI/AppendixIContents.astro',
  orientation: 'src/components/part07/appI/AppendixIOrientation.mdx',
  variational: 'src/components/part07/appI/AppendixIVariationalEnergy.mdx',
  pressureSurface: 'src/components/part07/appI/AppendixIPressureSurface.mdx',
  review: 'src/components/part07/appI/AppendixIApwReview.mdx',
  pathVisual: 'src/components/part07/appI/VariationalPathExplorer.astro',
  frozenVisual: 'src/components/part07/appI/FrozenReferenceExplorer.astro',
  pressureVisual: 'src/components/part07/appI/PressureEosExplorer.astro',
  surfaceVisual: 'src/components/part07/appI/SurfaceForceExplorer.astro',
};
const content = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
);
assert.match(content.route, /<AppendixIBody\s*\/>/, 'Appendix I route must render AppendixIBody');
assert.match(content.route, /status="appendix-content-complete"/, 'Appendix I route status must be content complete');
for (const component of ['AppendixIContents', 'AppendixIOrientation', 'AppendixIVariationalEnergy', 'AppendixIPressureSurface', 'AppendixIApwReview']) {
  assert.match(content.body, new RegExp(`<${component}\\s*/>`), `body must render ${component}`);
}
for (const section of ['I.1', 'I.2', 'I.3', 'I.4', 'I.5']) assert.ok(content.contents.includes(section), `source map must contain ${section}`);
const combinedSections = `${content.variational}\n${content.pressureSurface}\n${content.review}`;
for (const marker of ['section-i-1', 'section-i-2', 'section-i-3', 'section-i-4', 'section-i-5', 'review']) assert.ok(combinedSections.includes(marker), `content must expose ${marker}`);
for (const [container, visual] of [
  ['orientation', 'VariationalPathExplorer'],
  ['variational', 'FrozenReferenceExplorer'],
  ['pressureSurface', 'PressureEosExplorer'],
  ['pressureSurface', 'SurfaceForceExplorer'],
]) assert.match(content[container], new RegExp(`<${visual}\\s*/>`), `${visual} must be assembled in ${container}`);
const visualContracts = ['pathVisual', 'frozenVisual', 'pressureVisual', 'surfaceVisual']
  .map((key) => (content[key].match(/chapter-visual__contract/g) ?? []).length)
  .reduce((sum, count) => sum + count, 0);
assert.equal(visualContracts, 4, 'four visualization contracts must be present');
const combinedText = Object.values(content).join('\n');
assert.doesNotMatch(combinedText, /目录级阅读骨架|outline · 正文待填充|TODO/i, 'Appendix I must not retain outline or TODO markers');
assert.ok((combinedText.match(/bilingual-section__zh/g) ?? []).length >= 24, 'substantive Chinese bilingual coverage');
assert.ok((combinedText.match(/bilingual-section__en/g) ?? []).length >= 24, 'substantive English bilingual coverage');
for (const required of ['variational residual', 'same reference', 'closed surface', 'Pulay-like', 'Source Figure I.1', 'not reproduced']) {
  assert.ok(combinedText.includes(required), `required scientific boundary missing: ${required}`);
}
assert.ok((content.review.match(/<li><strong>/g) ?? []).length >= 10, 'ten original exercises must be present');
assert.match(content.index, /\| H · Energy and Stress Densities \| complete and deployed \|/, 'Part VII index must retain Appendix H deployed state');
assert.match(content.index, /\| I · Alternative Force Expressions \| content complete;/, 'Part VII index must expose Appendix I content-complete state');
assert.match(content.index, /\| J–R \| outline \|/, 'Part VII index must preserve J–R as outlines');

console.log('Part VII Appendix I validation passed: variational path freedom, frozen-reference error order, pressure integration, closed-surface force, rigid-region bookkeeping, and route assembly.');
