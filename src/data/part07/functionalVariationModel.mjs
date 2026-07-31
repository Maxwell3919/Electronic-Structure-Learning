const ensureFinite = (value, label) => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${label} must be finite.`);
  }
  return value;
};

export const variationModel = Object.freeze({
  domain: Object.freeze([0, 1]),
  baseIntegral: 1 / 30,
  crossIntegral: 4 / Math.PI ** 3,
  directionIntegral: 1 / 2,
  firstVariation: 8 / Math.PI ** 3,
  secondVariation: 1,
  epsilonRange: Object.freeze([-0.5, 0.5]),
  defaultEpsilon: 0,
});

export function baseFunction(x) {
  ensureFinite(x, 'x');
  return x * (1 - x);
}

export function directionFunction(x) {
  ensureFinite(x, 'x');
  return Math.sin(Math.PI * x);
}

export function variedFunction(x, epsilon) {
  ensureFinite(epsilon, 'epsilon');
  return baseFunction(x) + epsilon * directionFunction(x);
}

export function functionalExact(epsilon) {
  ensureFinite(epsilon, 'epsilon');
  return variationModel.baseIntegral
    + 2 * variationModel.crossIntegral * epsilon
    + variationModel.directionIntegral * epsilon ** 2;
}

export function directionalDerivativeCentral(step = 1e-4) {
  ensureFinite(step, 'step');
  if (step <= 0) throw new RangeError('step must be positive.');
  return (functionalExact(step) - functionalExact(-step)) / (2 * step);
}

export function secondDirectionalDerivativeCentral(step = 1e-3) {
  ensureFinite(step, 'step');
  if (step <= 0) throw new RangeError('step must be positive.');
  return (functionalExact(step) - 2 * functionalExact(0) + functionalExact(-step)) / step ** 2;
}

export function sampleVariation(epsilon = 0, count = 121) {
  ensureFinite(epsilon, 'epsilon');
  if (!Number.isInteger(count) || count < 2 || count > 5001) {
    throw new RangeError('count must be an integer between 2 and 5001.');
  }
  return Array.from({ length: count }, (_, index) => {
    const x = index / (count - 1);
    return {
      x,
      base: baseFunction(x),
      direction: directionFunction(x),
      varied: variedFunction(x, epsilon),
    };
  });
}

export function trapezoidFunctional(epsilon = 0, intervals = 2000) {
  ensureFinite(epsilon, 'epsilon');
  if (!Number.isInteger(intervals) || intervals < 2 || intervals > 100000) {
    throw new RangeError('intervals must be an integer between 2 and 100000.');
  }
  const h = 1 / intervals;
  let sum = 0;
  for (let index = 0; index <= intervals; index += 1) {
    const x = index * h;
    const value = variedFunction(x, epsilon) ** 2;
    sum += (index === 0 || index === intervals ? 0.5 : 1) * value;
  }
  return h * sum;
}

export function boundaryContribution({
  kappa = 1,
  derivativeLeft = 0,
  derivativeRight = 0,
  variationLeft = 0,
  variationRight = 0,
} = {}) {
  [kappa, derivativeLeft, derivativeRight, variationLeft, variationRight].forEach((value, index) => {
    ensureFinite(value, `boundary argument ${index + 1}`);
  });
  return kappa * (derivativeRight * variationRight - derivativeLeft * variationLeft);
}
