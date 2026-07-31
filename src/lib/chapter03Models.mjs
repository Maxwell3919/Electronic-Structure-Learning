const assertFinite = (value, label) => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${label} must be finite`);
  }
};

const assertPositive = (value, label) => {
  assertFinite(value, label);
  if (value <= 0) {
    throw new RangeError(`${label} must be positive`);
  }
};

export function twoLevelAdiabatic(position, coupling, slope = 1) {
  assertFinite(position, 'position');
  assertFinite(coupling, 'coupling');
  assertPositive(slope, 'slope');
  if (coupling < 0) {
    throw new RangeError('coupling must be non-negative');
  }

  const diabaticOffset = slope * position;
  const radius = Math.hypot(diabaticOffset, coupling);
  const gap = 2 * radius;
  const lowerEnergy = -radius;
  const upperEnergy = radius;

  let lowerState1Weight;
  let lowerState2Weight;
  let lowerForce;
  if (radius === 0) {
    lowerState1Weight = 0.5;
    lowerState2Weight = 0.5;
    lowerForce = 0;
  } else {
    const sigmaZ = -diabaticOffset / radius;
    lowerState1Weight = 0.5 * (1 + sigmaZ);
    lowerState2Weight = 1 - lowerState1Weight;
    lowerForce = (slope * slope * position) / radius;
  }

  return {
    position,
    coupling,
    slope,
    diabaticState1Energy: diabaticOffset,
    diabaticState2Energy: -diabaticOffset,
    lowerEnergy,
    upperEnergy,
    gap,
    lowerState1Weight,
    lowerState2Weight,
    lowerForce,
    crossingIsDegenerate: radius === 0,
  };
}

export function twoLevelCanonical(gap, temperature) {
  assertFinite(gap, 'gap');
  assertFinite(temperature, 'temperature');
  if (gap < 0 || temperature < 0) {
    throw new RangeError('gap and temperature must be non-negative');
  }

  if (temperature === 0) {
    const degenerate = gap === 0;
    const p0 = degenerate ? 0.5 : 1;
    const p1 = degenerate ? 0.5 : 0;
    return {
      gap,
      temperature,
      p0,
      p1,
      internalEnergy: p1 * gap,
      entropy: degenerate ? Math.log(2) : 0,
      purity: p0 * p0 + p1 * p1,
      freeEnergy: 0,
    };
  }

  const excitedWeight = Math.exp(-gap / temperature);
  const partition = 1 + excitedWeight;
  const p0 = 1 / partition;
  const p1 = excitedWeight / partition;
  const entropy = -[p0, p1]
    .filter((probability) => probability > 0)
    .reduce((sum, probability) => sum + probability * Math.log(probability), 0);
  const internalEnergy = p1 * gap;
  const freeEnergy = -temperature * Math.log(partition);

  return {
    gap,
    temperature,
    p0,
    p1,
    internalEnergy,
    entropy,
    purity: p0 * p0 + p1 * p1,
    freeEnergy,
  };
}

export function normalizedGaussian(x, width) {
  assertFinite(x, 'x');
  assertPositive(width, 'width');
  return Math.exp(-0.5 * (x / width) ** 2) / (Math.sqrt(2 * Math.PI) * width);
}

export function exchangeCorrelationHole(
  x,
  {
    exchangeWidth = 1,
    correlationAmplitude = 0.35,
    correlationNarrowWidth = 0.55,
    correlationBroadWidth = 1.8,
  } = {},
) {
  assertFinite(x, 'x');
  assertPositive(exchangeWidth, 'exchangeWidth');
  assertFinite(correlationAmplitude, 'correlationAmplitude');
  assertPositive(correlationNarrowWidth, 'correlationNarrowWidth');
  assertPositive(correlationBroadWidth, 'correlationBroadWidth');
  if (correlationAmplitude < 0) {
    throw new RangeError('correlationAmplitude must be non-negative');
  }

  const exchange = -normalizedGaussian(x, exchangeWidth);
  const correlation = correlationAmplitude * (
    normalizedGaussian(x, correlationBroadWidth)
    - normalizedGaussian(x, correlationNarrowWidth)
  );

  return {
    x,
    exchange,
    correlation,
    exchangeCorrelation: exchange + correlation,
  };
}

export function holeAnalyticIntegrals() {
  return {
    exchange: -1,
    correlation: 0,
    exchangeCorrelation: -1,
  };
}

export function sampleHole(options = {}, { minimum = -6, maximum = 6, count = 241 } = {}) {
  assertFinite(minimum, 'minimum');
  assertFinite(maximum, 'maximum');
  if (!Number.isInteger(count) || count < 3) {
    throw new RangeError('count must be an integer at least 3');
  }
  if (!(maximum > minimum)) {
    throw new RangeError('maximum must be greater than minimum');
  }
  return Array.from({ length: count }, (_, index) => {
    const x = minimum + (maximum - minimum) * index / (count - 1);
    return exchangeCorrelationHole(x, options);
  });
}
