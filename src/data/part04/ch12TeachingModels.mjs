export const planeWaveSeriesValue = (x, maxHarmonic) => {
  if (!Number.isFinite(x) || !Number.isInteger(maxHarmonic) || maxHarmonic < 0) {
    throw new TypeError('x must be finite and maxHarmonic must be a non-negative integer.');
  }

  let value = 0.5;
  for (let harmonic = 1; harmonic <= maxHarmonic; harmonic += 1) {
    value += Math.cos(harmonic * x) / (1 + harmonic * harmonic);
  }
  return value;
};

export const oneDimensionalPlaneWaveCount = (maxHarmonic) => {
  if (!Number.isInteger(maxHarmonic) || maxHarmonic < 0) {
    throw new TypeError('maxHarmonic must be a non-negative integer.');
  }
  return 2 * maxHarmonic + 1;
};

export const nearlyFreeElectronEigenvalues = ({ q, velocity = 1, coupling }) => {
  if (![q, velocity, coupling].every(Number.isFinite)) {
    throw new TypeError('q, velocity, and coupling must be finite.');
  }
  const splitting = Math.hypot(velocity * q, coupling);
  return [-splitting, splitting];
};

export const nearlyFreeElectronGap = (coupling) => {
  if (!Number.isFinite(coupling)) throw new TypeError('coupling must be finite.');
  return 2 * Math.abs(coupling);
};

export const twoSiteStructureFactor = ({ order, fractionalOffset }) => {
  if (!Number.isInteger(order)) throw new TypeError('order must be an integer.');
  if (!Number.isFinite(fractionalOffset)) {
    throw new TypeError('fractionalOffset must be finite.');
  }
  const phase = 2 * Math.PI * order * fractionalOffset;
  return {
    real: 1 + Math.cos(phase),
    imaginary: Math.sin(phase),
    intensity: 2 + 2 * Math.cos(phase),
  };
};

export const centralDifferenceKinetic = (kh) => {
  if (!Number.isFinite(kh)) throw new TypeError('kh must be finite.');
  return 2 * (1 - Math.cos(kh));
};

export const exactDimensionlessKinetic = (kh) => {
  if (!Number.isFinite(kh)) throw new TypeError('kh must be finite.');
  return kh * kh;
};

export const finiteDifferenceDispersionRatio = (kh) => {
  if (!Number.isFinite(kh)) throw new TypeError('kh must be finite.');
  if (kh === 0) return 1;
  return centralDifferenceKinetic(kh) / exactDimensionlessKinetic(kh);
};
