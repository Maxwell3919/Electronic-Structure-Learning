const ensureFinite = (value, label) => {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite.`);
  return value;
};

const ensurePositive = (value, label) => {
  ensureFinite(value, label);
  if (value <= 0) throw new RangeError(`${label} must be positive.`);
  return value;
};

export const adiabaticModelDefaults = Object.freeze({
  slope: 1,
  coupling: 0.3,
  velocity: 0.05,
  massRatio: 1836,
  coordinateRange: Object.freeze([-3, 3]),
});

export function twoLevelAdiabaticState(
  coordinate,
  {
    slope = adiabaticModelDefaults.slope,
    coupling = adiabaticModelDefaults.coupling,
  } = {},
) {
  ensureFinite(coordinate, 'coordinate');
  ensurePositive(slope, 'slope');
  ensurePositive(coupling, 'coupling');

  const diabatic = slope * coordinate;
  const radius = Math.hypot(diabatic, coupling);
  const lower = -radius;
  const upper = radius;
  const gap = upper - lower;
  const derivativeCoupling = (slope * coupling) / (2 * radius ** 2);
  const potentialDerivativeMatrix = (slope * coupling) / radius;

  return Object.freeze({
    coordinate,
    diabatic,
    lower,
    upper,
    gap,
    derivativeCoupling,
    potentialDerivativeMatrix,
  });
}

export function localAdiabaticityIndicator({
  coordinate = 0,
  slope = adiabaticModelDefaults.slope,
  coupling = adiabaticModelDefaults.coupling,
  velocity = adiabaticModelDefaults.velocity,
} = {}) {
  ensureFinite(velocity, 'velocity');
  if (velocity < 0) throw new RangeError('velocity must be non-negative.');
  const state = twoLevelAdiabaticState(coordinate, { slope, coupling });
  return (velocity * Math.abs(state.derivativeCoupling)) / state.gap;
}

export function diagonalDerivativeScale({
  coordinate = 0,
  slope = adiabaticModelDefaults.slope,
  coupling = adiabaticModelDefaults.coupling,
  massRatio = adiabaticModelDefaults.massRatio,
} = {}) {
  ensurePositive(massRatio, 'massRatio');
  const state = twoLevelAdiabaticState(coordinate, { slope, coupling });
  return state.derivativeCoupling ** 2 / (2 * massRatio);
}

export function harmonicFrequency({ forceConstant, massRatio }) {
  ensurePositive(forceConstant, 'forceConstant');
  ensurePositive(massRatio, 'massRatio');
  return Math.sqrt(forceConstant / massRatio);
}

export function harmonicZeroPointEnergy({ forceConstant, massRatio }) {
  return 0.5 * harmonicFrequency({ forceConstant, massRatio });
}

export function sampleAvoidedCrossing({
  slope = adiabaticModelDefaults.slope,
  coupling = adiabaticModelDefaults.coupling,
  minCoordinate = adiabaticModelDefaults.coordinateRange[0],
  maxCoordinate = adiabaticModelDefaults.coordinateRange[1],
  count = 181,
} = {}) {
  ensurePositive(slope, 'slope');
  ensurePositive(coupling, 'coupling');
  ensureFinite(minCoordinate, 'minCoordinate');
  ensureFinite(maxCoordinate, 'maxCoordinate');
  if (!(maxCoordinate > minCoordinate)) {
    throw new RangeError('maxCoordinate must exceed minCoordinate.');
  }
  if (!Number.isInteger(count) || count < 2 || count > 5001) {
    throw new RangeError('count must be an integer between 2 and 5001.');
  }

  return Array.from({ length: count }, (_, index) => {
    const coordinate = minCoordinate
      + ((maxCoordinate - minCoordinate) * index) / (count - 1);
    return twoLevelAdiabaticState(coordinate, { slope, coupling });
  });
}
