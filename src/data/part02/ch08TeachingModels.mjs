const TWO_PI = 2 * Math.PI;
export const PBE_KAPPA = 0.804;
export const PBE_MU = 0.2195149727645171;
export const CX_UNPOLARIZED = (3 / 4) * (3 / Math.PI) ** (1 / 3);

function requireFinite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
}

function requirePositive(value, name) {
  requireFinite(value, name);
  if (value <= 0) throw new RangeError(`${name} must be positive`);
}

function requireInteger(value, name, minimum, maximum) {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(`${name} must be an integer in [${minimum}, ${maximum}]`);
  }
}

export function trapezoidIntegral(samples, xKey = 'x', yKey = 'y') {
  if (!Array.isArray(samples) || samples.length < 2) {
    throw new RangeError('samples must contain at least two points');
  }
  let total = 0;
  for (let index = 1; index < samples.length; index += 1) {
    const left = samples[index - 1];
    const right = samples[index];
    const dx = right[xKey] - left[xKey];
    total += 0.5 * dx * (left[yKey] + right[yKey]);
  }
  return total;
}

export function gaussianHoleValue(radius, width = 1) {
  requireFinite(radius, 'radius');
  requirePositive(width, 'width');
  if (radius < 0) throw new RangeError('radius must be nonnegative');
  const normalization = (TWO_PI ** 1.5) * width ** 3;
  return -Math.exp(-(radius ** 2) / (2 * width ** 2)) / normalization;
}

export function sampleGaussianHole({ width = 1, maximumRadius = 6, sampleCount = 601 } = {}) {
  requirePositive(width, 'width');
  requirePositive(maximumRadius, 'maximumRadius');
  requireInteger(sampleCount, 'sampleCount', 21, 5001);
  const samples = Array.from({ length: sampleCount }, (_, index) => {
    const radius = (maximumRadius * index) / (sampleCount - 1);
    const hole = gaussianHoleValue(radius, width);
    return {
      radius,
      hole,
      radialCharge: 4 * Math.PI * radius ** 2 * hole,
    };
  });
  return {
    width,
    maximumRadius,
    samples,
    integratedCharge: trapezoidIntegral(samples, 'radius', 'radialCharge'),
  };
}

export function densityParameterRs(density) {
  requirePositive(density, 'density');
  return (3 / (4 * Math.PI * density)) ** (1 / 3);
}

export function fermiWavevector(density) {
  requirePositive(density, 'density');
  return (3 * Math.PI ** 2 * density) ** (1 / 3);
}

export function exchangeSpinScaling(spinPolarization = 0) {
  requireFinite(spinPolarization, 'spinPolarization');
  if (spinPolarization < -1 || spinPolarization > 1) {
    throw new RangeError('spinPolarization must lie in [-1, 1]');
  }
  return (
    (1 + spinPolarization) ** (4 / 3) +
    (1 - spinPolarization) ** (4 / 3)
  ) / 2;
}

export function uniformGasExchangePerElectron(density, spinPolarization = 0) {
  requirePositive(density, 'density');
  return -CX_UNPOLARIZED * density ** (1 / 3) * exchangeSpinScaling(spinPolarization);
}

export function uniformGasQuantities(density, spinPolarization = 0) {
  return {
    density,
    spinPolarization,
    rs: densityParameterRs(density),
    kF: fermiWavevector(density),
    exchangeSpinScaling: exchangeSpinScaling(spinPolarization),
    exchangePerElectron: uniformGasExchangePerElectron(density, spinPolarization),
  };
}

export function periodicDensityAt(x, {
  averageDensity = 0.02,
  modulation = 0.4,
  length = 1,
} = {}) {
  requireFinite(x, 'x');
  requirePositive(averageDensity, 'averageDensity');
  requirePositive(length, 'length');
  requireFinite(modulation, 'modulation');
  if (modulation < 0 || modulation >= 1) {
    throw new RangeError('modulation must lie in [0, 1)');
  }
  return averageDensity * (1 + modulation * Math.cos((TWO_PI * x) / length));
}

export function reducedGradient(density, gradientMagnitude) {
  requirePositive(density, 'density');
  requireFinite(gradientMagnitude, 'gradientMagnitude');
  if (gradientMagnitude < 0) throw new RangeError('gradientMagnitude must be nonnegative');
  return gradientMagnitude / (2 * fermiWavevector(density) * density);
}

export function samplePeriodicDensity({
  averageDensity = 0.02,
  modulation = 0.4,
  length = 1,
  sampleCount = 801,
} = {}) {
  requireInteger(sampleCount, 'sampleCount', 21, 5001);
  const samples = Array.from({ length: sampleCount }, (_, index) => {
    const x = (length * index) / (sampleCount - 1);
    const phase = (TWO_PI * x) / length;
    const density = periodicDensityAt(x, { averageDensity, modulation, length });
    const derivative = -averageDensity * modulation * (TWO_PI / length) * Math.sin(phase);
    const s = reducedGradient(density, Math.abs(derivative));
    const exchangeEnergyDensity = -CX_UNPOLARIZED * density ** (4 / 3);
    return { x, density, derivative, reducedGradient: s, exchangeEnergyDensity };
  });
  const averageFromGrid = trapezoidIntegral(samples, 'x', 'density') / length;
  const exchangeEnergy = trapezoidIntegral(samples, 'x', 'exchangeEnergyDensity');
  return {
    averageDensity,
    modulation,
    length,
    samples,
    averageFromGrid,
    exchangeEnergy,
  };
}

export function pbeExchangeEnhancement(s, { kappa = PBE_KAPPA, mu = PBE_MU } = {}) {
  requireFinite(s, 's');
  requirePositive(kappa, 'kappa');
  requirePositive(mu, 'mu');
  if (s < 0) throw new RangeError('s must be nonnegative');
  return 1 + kappa - kappa / (1 + (mu * s ** 2) / kappa);
}

export function discreteSemilocalEnergyAndGradient(
  density,
  { localCoefficient = 0.75, gradientCoefficient = 0.12, length = 1 } = {},
) {
  if (!Array.isArray(density)) throw new TypeError('density must be an array');
  requireInteger(density.length, 'density.length', 5, 4096);
  requireFinite(localCoefficient, 'localCoefficient');
  requireFinite(gradientCoefficient, 'gradientCoefficient');
  requirePositive(length, 'length');
  density.forEach((value, index) => {
    requirePositive(value, `density[${index}]`);
  });

  const count = density.length;
  const dx = length / count;
  const centralGradient = density.map((_, index) => {
    const previous = density[(index - 1 + count) % count];
    const next = density[(index + 1) % count];
    return (next - previous) / (2 * dx);
  });

  let energy = 0;
  for (let index = 0; index < count; index += 1) {
    energy += dx * (
      localCoefficient * density[index] ** (4 / 3) +
      0.5 * gradientCoefficient * centralGradient[index] ** 2
    );
  }

  const gradient = density.map((value, index) => {
    const previousGradient = centralGradient[(index - 1 + count) % count];
    const nextGradient = centralGradient[(index + 1) % count];
    return (
      dx * localCoefficient * (4 / 3) * value ** (1 / 3) +
      0.5 * gradientCoefficient * (previousGradient - nextGradient)
    );
  });

  return { energy, gradient, centralGradient, dx };
}
