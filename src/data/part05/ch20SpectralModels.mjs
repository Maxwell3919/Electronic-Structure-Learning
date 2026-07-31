const requirePositive = (name, value) => {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be a finite positive number`);
  }
};

const requireNonNegative = (name, value) => {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite non-negative number`);
  }
};

export const gaussian = (x, centre, width) => {
  requirePositive('width', width);
  if (!Number.isFinite(x) || !Number.isFinite(centre)) {
    throw new RangeError('x and centre must be finite');
  }
  return Math.exp(-0.5 * ((x - centre) / width) ** 2)
    / (Math.sqrt(2 * Math.PI) * width);
};

export const sampleEliashbergSpectrum = ({
  modes = [
    { frequency: 12, weight: 0.8 },
    { frequency: 28, weight: 0.55 },
    { frequency: 52, weight: 0.35 },
  ],
  width = 1.8,
  maxFrequency = 70,
  points = 701,
} = {}) => {
  requirePositive('width', width);
  requirePositive('maxFrequency', maxFrequency);
  if (!Number.isInteger(points) || points < 50 || points > 10001) {
    throw new RangeError('points must be an integer between 50 and 10001');
  }
  if (!Array.isArray(modes) || modes.length === 0) {
    throw new TypeError('modes must be a non-empty array');
  }
  modes.forEach(({ frequency, weight }) => {
    requirePositive('mode frequency', frequency);
    requireNonNegative('mode weight', weight);
  });

  const delta = maxFrequency / (points - 1);
  const spectrum = Array.from({ length: points }, (_, index) => {
    const frequency = index * delta;
    const alpha2F = modes.reduce(
      (sum, mode) => sum + mode.weight * gaussian(frequency, mode.frequency, width),
      0,
    );
    return { frequency, alpha2F };
  });

  let lambda = 0;
  let logMomentIntegral = 0;
  const cumulative = [];

  for (let index = 1; index < spectrum.length; index += 1) {
    const left = spectrum[index - 1];
    const right = spectrum[index];
    const leftFrequency = Math.max(left.frequency, delta / 2);
    const rightFrequency = Math.max(right.frequency, delta / 2);
    const leftLambdaIntegrand = 2 * left.alpha2F / leftFrequency;
    const rightLambdaIntegrand = 2 * right.alpha2F / rightFrequency;
    const lambdaIncrement = 0.5 * (leftLambdaIntegrand + rightLambdaIntegrand) * delta;
    lambda += lambdaIncrement;

    const leftLogIntegrand = left.alpha2F * Math.log(leftFrequency) / leftFrequency;
    const rightLogIntegrand = right.alpha2F * Math.log(rightFrequency) / rightFrequency;
    logMomentIntegral += 0.5 * (leftLogIntegrand + rightLogIntegrand) * delta;
    cumulative.push({ frequency: right.frequency, lambda });
  }

  const omegaLog = lambda > 0
    ? Math.exp((2 / lambda) * logMomentIntegral)
    : 0;

  return {
    spectrum,
    cumulative,
    lambda,
    omegaLog,
    delta,
    width,
  };
};

export const dampedSpinResponse = ({ frequency, modeFrequency, damping }) => {
  requirePositive('modeFrequency', modeFrequency);
  requireNonNegative('damping', damping);
  if (!Number.isFinite(frequency) || frequency < 0) {
    throw new RangeError('frequency must be finite and non-negative');
  }
  const numerator = 2 * damping * frequency;
  const denominator = (modeFrequency ** 2 - frequency ** 2) ** 2
    + (2 * damping * frequency) ** 2;
  return denominator === 0 ? Number.POSITIVE_INFINITY : numerator / denominator;
};

export const sampleDampedSpinSpectrum = ({
  modeFrequency = 1,
  damping = 0.1,
  maxFrequency = 2.5,
  points = 501,
} = {}) => {
  requirePositive('modeFrequency', modeFrequency);
  requireNonNegative('damping', damping);
  requirePositive('maxFrequency', maxFrequency);
  if (!Number.isInteger(points) || points < 20 || points > 10001) {
    throw new RangeError('points must be an integer between 20 and 10001');
  }
  return Array.from({ length: points }, (_, index) => {
    const frequency = maxFrequency * index / (points - 1);
    return {
      frequency,
      intensity: dampedSpinResponse({ frequency, modeFrequency, damping }),
    };
  });
};
