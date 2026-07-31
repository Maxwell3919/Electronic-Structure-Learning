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

export const monoatomicFrequency = ({ q, spring, mass, latticeConstant = 1 }) => {
  requirePositive('spring', spring);
  requirePositive('mass', mass);
  requirePositive('latticeConstant', latticeConstant);
  if (!Number.isFinite(q)) throw new RangeError('q must be finite');
  return 2 * Math.sqrt(spring / mass) * Math.abs(Math.sin(0.5 * q * latticeConstant));
};

export const diatomicFrequencies = ({
  q,
  spring,
  mass1,
  mass2,
  latticeConstant = 1,
}) => {
  requirePositive('spring', spring);
  requirePositive('mass1', mass1);
  requirePositive('mass2', mass2);
  requirePositive('latticeConstant', latticeConstant);
  if (!Number.isFinite(q)) throw new RangeError('q must be finite');

  const sum = spring / mass1 + spring / mass2;
  const discriminant = Math.max(
    0,
    sum ** 2
      - (4 * spring ** 2 / (mass1 * mass2))
        * Math.sin(0.5 * q * latticeConstant) ** 2,
  );
  const root = Math.sqrt(discriminant);

  return {
    acoustic: Math.sqrt(Math.max(0, sum - root)),
    optical: Math.sqrt(Math.max(0, sum + root)),
  };
};

export const sampleDiatomicDispersion = ({
  spring = 1,
  mass1 = 1,
  mass2 = 2,
  latticeConstant = 1,
  points = 101,
} = {}) => {
  if (!Number.isInteger(points) || points < 3 || points > 2001) {
    throw new RangeError('points must be an integer between 3 and 2001');
  }

  return Array.from({ length: points }, (_, index) => {
    const q = (Math.PI / latticeConstant) * index / (points - 1);
    return {
      q,
      ...diatomicFrequencies({ q, spring, mass1, mass2, latticeConstant }),
    };
  });
};

export const forceConstantRowSums = (matrix) => {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    throw new TypeError('matrix must be a non-empty square array');
  }
  const size = matrix.length;
  if (!matrix.every((row) => Array.isArray(row) && row.length === size)) {
    throw new TypeError('matrix must be square');
  }
  return matrix.map((row) => row.reduce((sum, value) => {
    if (!Number.isFinite(value)) throw new RangeError('matrix entries must be finite');
    return sum + value;
  }, 0));
};

export const enforceAcousticSumRule = (matrix) => {
  const corrected = matrix.map((row) => [...row]);
  const rowSums = forceConstantRowSums(corrected);
  for (let index = 0; index < corrected.length; index += 1) {
    corrected[index][index] -= rowSums[index];
  }
  return corrected;
};

export const quarticEnergy = ({ displacement, curvature, quartic }) => {
  if (!Number.isFinite(displacement)) throw new RangeError('displacement must be finite');
  requirePositive('curvature', curvature);
  requireNonNegative('quartic', quartic);
  return 0.5 * curvature * displacement ** 2 + 0.25 * quartic * displacement ** 4;
};

export const frozenPhononCurvature = ({
  displacement,
  curvature = 1,
  quartic = 0.4,
  energyNoise = 0,
}) => {
  requirePositive('displacement', displacement);
  requirePositive('curvature', curvature);
  requireNonNegative('quartic', quartic);
  requireNonNegative('energyNoise', energyNoise);

  const plus = quarticEnergy({ displacement, curvature, quartic }) + energyNoise;
  const minus = quarticEnergy({ displacement: -displacement, curvature, quartic }) + energyNoise;
  const zero = quarticEnergy({ displacement: 0, curvature, quartic }) - energyNoise;
  const estimate = (plus - 2 * zero + minus) / displacement ** 2;

  return {
    displacement,
    exactCurvature: curvature,
    estimate,
    signedError: estimate - curvature,
    absoluteError: Math.abs(estimate - curvature),
    anharmonicError: 0.5 * quartic * displacement ** 2,
    noiseError: energyNoise === 0 ? 0 : 4 * energyNoise / displacement ** 2,
    energies: { minus, zero, plus },
  };
};

export const sampleFrozenPhononError = ({
  curvature = 1,
  quartic = 0.4,
  energyNoise = 1e-6,
  minDisplacement = 0.005,
  maxDisplacement = 0.4,
  points = 120,
} = {}) => {
  requirePositive('minDisplacement', minDisplacement);
  requirePositive('maxDisplacement', maxDisplacement);
  if (maxDisplacement <= minDisplacement) {
    throw new RangeError('maxDisplacement must exceed minDisplacement');
  }
  if (!Number.isInteger(points) || points < 3 || points > 2001) {
    throw new RangeError('points must be an integer between 3 and 2001');
  }

  return Array.from({ length: points }, (_, index) => {
    const fraction = index / (points - 1);
    const displacement = minDisplacement
      * (maxDisplacement / minDisplacement) ** fraction;
    return frozenPhononCurvature({ displacement, curvature, quartic, energyNoise });
  });
};

export const projectedTwoLevelResponse = ({
  occupiedEnergy = -1,
  emptyEnergy = 2,
  coupling = 0.2,
}) => {
  if (![occupiedEnergy, emptyEnergy, coupling].every(Number.isFinite)) {
    throw new RangeError('energies and coupling must be finite');
  }
  if (emptyEnergy <= occupiedEnergy) {
    throw new RangeError('emptyEnergy must exceed occupiedEnergy');
  }
  const denominator = occupiedEnergy - emptyEnergy;
  const emptyAmplitude = coupling / denominator;
  return {
    denominator,
    emptyAmplitude,
    explicitSumAmplitude: emptyAmplitude,
    projectedLinearSolveAmplitude: emptyAmplitude,
  };
};

export const loToFrequencies = ({
  transverseFrequency,
  effectiveCharge,
  dielectricConstant,
  volume,
  directionCosine = 1,
}) => {
  requirePositive('transverseFrequency', transverseFrequency);
  requireNonNegative('effectiveCharge', effectiveCharge);
  requirePositive('dielectricConstant', dielectricConstant);
  requirePositive('volume', volume);
  if (!Number.isFinite(directionCosine) || Math.abs(directionCosine) > 1) {
    throw new RangeError('directionCosine must lie between -1 and 1');
  }

  const nonanalyticShift = (effectiveCharge ** 2 * directionCosine ** 2)
    / (dielectricConstant * volume);
  return {
    transverse: transverseFrequency,
    longitudinal: Math.sqrt(transverseFrequency ** 2 + nonanalyticShift),
    nonanalyticShift,
  };
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
  let logMomentNumerator = 0;
  const cumulative = [];
  for (let index = 1; index < spectrum.length; index += 1) {
    const left = spectrum[index - 1];
    const right = spectrum[index];
    const safeLeftFrequency = Math.max(left.frequency, delta / 2);
    const safeRightFrequency = Math.max(right.frequency, delta / 2);
    const lambdaIncrement = (
      left.alpha2F / safeLeftFrequency
      + right.alpha2F / safeRightFrequency
    ) * delta;
    lambda += lambdaIncrement;
    logMomentNumerator += (
      left.alpha2F * Math.log(safeLeftFrequency) / safeLeftFrequency
      + right.alpha2F * Math.log(safeRightFrequency) / safeRightFrequency
    ) * delta;
    cumulative.push({ frequency: right.frequency, lambda });
  }

  const omegaLog = lambda > 0
    ? Math.exp((2 / lambda) * logMomentNumerator)
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
