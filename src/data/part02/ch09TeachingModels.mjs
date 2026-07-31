const SQRT_PI = Math.sqrt(Math.PI);
const PI_SQUARED = Math.PI ** 2;

function requireFinite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
}

function requirePositive(value, name) {
  requireFinite(value, name);
  if (value <= 0) throw new RangeError(`${name} must be positive`);
}

function requireUnitInterval(value, name) {
  requireFinite(value, name);
  if (value < 0 || value > 1) throw new RangeError(`${name} must lie in [0, 1]`);
}

/** Abramowitz-Stegun-style approximation, sufficient for deterministic teaching plots. */
export function erfApprox(value) {
  requireFinite(value, 'value');
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value);
  const t = 1 / (1 + 0.3275911 * x);
  const polynomial =
    (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;
  return sign * (1 - polynomial * Math.exp(-x * x));
}

export function rangeSeparatedCoulomb(distance, omega) {
  requirePositive(distance, 'distance');
  requirePositive(omega, 'omega');
  const argument = omega * distance;
  const longFraction = erfApprox(argument);
  const shortFraction = 1 - longFraction;
  const full = 1 / distance;
  return {
    distance,
    omega,
    shortFraction,
    longFraction,
    shortRange: shortFraction * full,
    longRange: longFraction * full,
    full,
  };
}

export function hybridExchangeProfile(distance, {
  exactFraction = 0.25,
  omega = 0.3,
  screened = false,
} = {}) {
  requireUnitInterval(exactFraction, 'exactFraction');
  const split = rangeSeparatedCoulomb(distance, omega);
  const exactWeight = screened
    ? exactFraction * split.shortFraction
    : exactFraction;
  return {
    ...split,
    exactFraction,
    screened,
    exactWeight,
    semilocalWeight: 1 - exactWeight,
  };
}

export function metaGgaIndicators({ density, gradientMagnitude, kineticEnergyDensity }) {
  requirePositive(density, 'density');
  requireFinite(gradientMagnitude, 'gradientMagnitude');
  requireFinite(kineticEnergyDensity, 'kineticEnergyDensity');
  if (gradientMagnitude < 0) throw new RangeError('gradientMagnitude must be nonnegative');
  if (kineticEnergyDensity < 0) throw new RangeError('kineticEnergyDensity must be nonnegative');

  const tauW = gradientMagnitude ** 2 / (8 * density);
  const tauUnif = (3 / 10) * (3 * PI_SQUARED) ** (2 / 3) * density ** (5 / 3);
  if (kineticEnergyDensity < tauW - 1e-14) {
    throw new RangeError('kineticEnergyDensity must not be below the von Weizsacker bound');
  }
  const alpha = (kineticEnergyDensity - tauW) / tauUnif;
  const z = kineticEnergyDensity === 0 ? 0 : tauW / kineticEnergyDensity;
  return {
    density,
    gradientMagnitude,
    kineticEnergyDensity,
    tauW,
    tauUnif,
    alpha,
    z,
  };
}

export function dudarevOccupationModel({
  occupation,
  additionEnergy = 1,
  baseCurvature = 2,
  uEffective = 0,
} = {}) {
  requireUnitInterval(occupation, 'occupation');
  requireFinite(additionEnergy, 'additionEnergy');
  requireFinite(baseCurvature, 'baseCurvature');
  requireFinite(uEffective, 'uEffective');
  if (baseCurvature < 0) throw new RangeError('baseCurvature must be nonnegative');
  if (uEffective < 0) throw new RangeError('uEffective must be nonnegative');

  const fractionalFactor = occupation * (1 - occupation);
  const straightLineEnergy = additionEnergy * occupation;
  const approximateEnergy = straightLineEnergy - 0.5 * baseCurvature * fractionalFactor;
  const correctionEnergy = 0.5 * uEffective * fractionalFactor;
  const correctedEnergy = approximateEnergy + correctionEnergy;
  const correctionPotential = uEffective * (0.5 - occupation);
  const correctedCurvature = baseCurvature - uEffective;
  return {
    occupation,
    additionEnergy,
    baseCurvature,
    uEffective,
    straightLineEnergy,
    approximateEnergy,
    correctionEnergy,
    correctedEnergy,
    correctionPotential,
    correctedCurvature,
  };
}

export function singlePolePolarizability(imaginaryFrequency, staticPolarizability, poleFrequency) {
  requireFinite(imaginaryFrequency, 'imaginaryFrequency');
  requirePositive(staticPolarizability, 'staticPolarizability');
  requirePositive(poleFrequency, 'poleFrequency');
  if (imaginaryFrequency < 0) throw new RangeError('imaginaryFrequency must be nonnegative');
  return staticPolarizability * poleFrequency ** 2 /
    (poleFrequency ** 2 + imaginaryFrequency ** 2);
}

export function singlePoleC6({
  staticPolarizabilityA,
  poleFrequencyA,
  staticPolarizabilityB,
  poleFrequencyB,
}) {
  requirePositive(staticPolarizabilityA, 'staticPolarizabilityA');
  requirePositive(staticPolarizabilityB, 'staticPolarizabilityB');
  requirePositive(poleFrequencyA, 'poleFrequencyA');
  requirePositive(poleFrequencyB, 'poleFrequencyB');
  return (3 / 2) * staticPolarizabilityA * staticPolarizabilityB *
    (poleFrequencyA * poleFrequencyB) / (poleFrequencyA + poleFrequencyB);
}

export function numericalCasimirPolderC6({
  staticPolarizabilityA,
  poleFrequencyA,
  staticPolarizabilityB,
  poleFrequencyB,
  maximumFrequency = 100,
  intervals = 200000,
}) {
  requirePositive(maximumFrequency, 'maximumFrequency');
  if (!Number.isInteger(intervals) || intervals < 100 || intervals > 1000000) {
    throw new RangeError('intervals must be an integer in [100, 1000000]');
  }
  const step = maximumFrequency / intervals;
  let integral = 0;
  for (let index = 0; index <= intervals; index += 1) {
    const u = index * step;
    const integrand =
      singlePolePolarizability(u, staticPolarizabilityA, poleFrequencyA) *
      singlePolePolarizability(u, staticPolarizabilityB, poleFrequencyB);
    const weight = index === 0 || index === intervals ? 0.5 : 1;
    integral += weight * integrand;
  }
  return (3 / Math.PI) * step * integral;
}

export function dampedDispersionEnergy(distance, c6, dampingLength) {
  requirePositive(distance, 'distance');
  requirePositive(c6, 'c6');
  requirePositive(dampingLength, 'dampingLength');
  const ratio = distance / dampingLength;
  const damping = 1 - Math.exp(-(ratio ** 6));
  return {
    distance,
    c6,
    dampingLength,
    damping,
    undamped: -c6 / distance ** 6,
    damped: -damping * c6 / distance ** 6,
    shortRangeLimit: -c6 / dampingLength ** 6,
  };
}

export const MODEL_CONSTANTS = Object.freeze({ SQRT_PI });
