import assert from 'node:assert/strict';
import {
  baseFunction,
  boundaryContribution,
  directionFunction,
  directionalDerivativeCentral,
  functionalExact,
  sampleVariation,
  secondDirectionalDerivativeCentral,
  trapezoidFunctional,
  variationModel,
  variedFunction,
} from '../src/data/part07/functionalVariationModel.mjs';

const close = (actual, expected, tolerance = 1e-12, label = 'value') => {
  assert.ok(Number.isFinite(actual), `${label}: received a non-finite value.`);
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected}, received ${actual}`,
  );
};

close(baseFunction(0), 0, 1e-15, 'base left boundary');
close(baseFunction(1), 0, 1e-15, 'base right boundary');
close(baseFunction(0.5), 0.25, 1e-15, 'base midpoint');
close(directionFunction(0), 0, 1e-15, 'direction left boundary');
close(directionFunction(1), 0, 1e-15, 'direction right boundary');
close(directionFunction(0.5), 1, 1e-15, 'direction midpoint');

for (const epsilon of variationModel.epsilonRange) {
  close(variedFunction(0, epsilon), 0, 1e-15, `fixed left endpoint at epsilon=${epsilon}`);
  close(variedFunction(1, epsilon), 0, 1e-15, `fixed right endpoint at epsilon=${epsilon}`);
}

close(functionalExact(0), 1 / 30, 1e-15, 'base functional');
close(
  directionalDerivativeCentral(1e-4),
  variationModel.firstVariation,
  1e-12,
  'first directional derivative',
);
close(
  secondDirectionalDerivativeCentral(1e-3),
  variationModel.secondVariation,
  2e-11,
  'second directional derivative',
);

for (const epsilon of [-0.5, -0.2, 0, 0.2, 0.5]) {
  close(
    trapezoidFunctional(epsilon, 4000),
    functionalExact(epsilon),
    2e-8,
    `trapezoid benchmark at epsilon=${epsilon}`,
  );
}

const samples = sampleVariation(0.3, 101);
assert.equal(samples.length, 101, 'sample count');
close(samples[0].x, 0, 1e-15, 'sample lower endpoint');
close(samples.at(-1).x, 1, 1e-15, 'sample upper endpoint');
samples.forEach((point, index) => {
  assert.ok(Number.isFinite(point.varied), `sample ${index} is not finite.`);
  close(
    point.varied,
    point.base + 0.3 * point.direction,
    1e-14,
    `linear path identity at sample ${index}`,
  );
});

close(
  boundaryContribution({
    kappa: 2,
    derivativeLeft: 3,
    derivativeRight: 5,
    variationLeft: 0,
    variationRight: 0,
  }),
  0,
  1e-15,
  'Dirichlet boundary contribution',
);
close(
  boundaryContribution({
    kappa: 2,
    derivativeLeft: 3,
    derivativeRight: 5,
    variationLeft: -0.25,
    variationRight: 0.5,
  }),
  6.5,
  1e-15,
  'free-endpoint boundary contribution',
);

assert.throws(() => sampleVariation(0, 1), RangeError, 'invalid sample count must fail');
assert.throws(() => directionalDerivativeCentral(0), RangeError, 'zero derivative step must fail');
assert.throws(() => functionalExact(Number.NaN), TypeError, 'NaN epsilon must fail');

console.log('Part VII Appendix A validation passed: analytic variation, quadrature, boundary, and failure checks.');
