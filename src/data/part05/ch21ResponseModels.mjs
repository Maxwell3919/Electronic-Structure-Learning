const requireFinite = (name, value) => {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be finite`);
  }
};

const requirePositive = (name, value) => {
  requireFinite(name, value);
  if (value <= 0) throw new RangeError(`${name} must be positive`);
};

const requireNonNegative = (name, value) => {
  requireFinite(name, value);
  if (value < 0) throw new RangeError(`${name} must be non-negative`);
};

/**
 * Retarded two-level polarizability for the e^{-i omega t} convention.
 *
 * alpha(omega) = 2 Omega d2 / [Omega^2 - (omega + i eta)^2]
 *
 * The parameter `strength` represents |<0|x|1>|^2 in model units. For
 * omega > 0 and eta > 0, Im alpha is non-negative under this convention.
 */
export const twoLevelPolarizability = ({
  frequency,
  transitionEnergy,
  strength,
  damping,
}) => {
  requireNonNegative('frequency', frequency);
  requirePositive('transitionEnergy', transitionEnergy);
  requireNonNegative('strength', strength);
  requirePositive('damping', damping);

  const realDenominator = transitionEnergy ** 2 - frequency ** 2 + damping ** 2;
  const imaginaryDenominator = -2 * frequency * damping;
  const denominatorNorm = realDenominator ** 2 + imaginaryDenominator ** 2;
  const numerator = 2 * transitionEnergy * strength;

  const real = numerator * realDenominator / denominatorNorm;
  const imaginary = -numerator * imaginaryDenominator / denominatorNorm;

  return {
    frequency,
    real,
    imaginary,
    absorption: frequency * imaginary,
    staticLimit: 2 * strength / transitionEnergy,
  };
};

export const sampleTwoLevelSpectrum = ({
  transitionEnergy = 4,
  strength = 1,
  damping = 0.25,
  maxFrequency = 10,
  points = 501,
} = {}) => {
  requirePositive('transitionEnergy', transitionEnergy);
  requireNonNegative('strength', strength);
  requirePositive('damping', damping);
  requirePositive('maxFrequency', maxFrequency);
  if (!Number.isInteger(points) || points < 3 || points > 10001) {
    throw new RangeError('points must be an integer between 3 and 10001');
  }

  return Array.from({ length: points }, (_, index) => {
    const frequency = maxFrequency * index / (points - 1);
    return twoLevelPolarizability({
      frequency,
      transitionEnergy,
      strength,
      damping,
    });
  });
};

export const integrateSpectrum = (samples, key) => {
  if (!Array.isArray(samples) || samples.length < 2) {
    throw new TypeError('samples must contain at least two points');
  }
  if (typeof key !== 'string' || key.length === 0) {
    throw new TypeError('key must be a non-empty string');
  }

  let integral = 0;
  for (let index = 1; index < samples.length; index += 1) {
    const left = samples[index - 1];
    const right = samples[index];
    requireFinite('left frequency', left.frequency);
    requireFinite('right frequency', right.frequency);
    requireFinite(`left ${key}`, left[key]);
    requireFinite(`right ${key}`, right[key]);
    const delta = right.frequency - left.frequency;
    if (delta <= 0) throw new RangeError('sample frequencies must be increasing');
    integral += 0.5 * (left[key] + right[key]) * delta;
  }
  return integral;
};

export const locateSpectrumMaximum = (samples, key = 'absorption') => {
  if (!Array.isArray(samples) || samples.length === 0) {
    throw new TypeError('samples must be non-empty');
  }
  return samples.reduce((best, point) => {
    requireFinite(key, point[key]);
    return point[key] > best[key] ? point : best;
  }, samples[0]);
};
