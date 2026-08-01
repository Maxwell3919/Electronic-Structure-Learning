const finite = (name, value) => {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
  return value;
};

const positive = (name, value) => {
  finite(name, value);
  if (value <= 0) throw new RangeError(`${name} must be positive`);
  return value;
};

const nonNegative = (name, value) => {
  finite(name, value);
  if (value < 0) throw new RangeError(`${name} must be non-negative`);
  return value;
};

export const dipoleSheetStep = ({ arealDipole, permittivity = 1 }) => {
  finite('arealDipole', arealDipole);
  positive('permittivity', permittivity);
  return arealDipole / permittivity;
};

export const slabWorkFunction = ({
  bulkReference = -8,
  fermiEnergy = -5,
  leftDipole = 2,
  rightDipole = 2,
  vacuumThickness = 18,
  screeningLength = 1.4,
  points = 241,
} = {}) => {
  [bulkReference, fermiEnergy, leftDipole, rightDipole].forEach((value, index) =>
    finite(['bulkReference', 'fermiEnergy', 'leftDipole', 'rightDipole'][index], value));
  positive('vacuumThickness', vacuumThickness);
  positive('screeningLength', screeningLength);
  if (!Number.isInteger(points) || points < 41 || points > 4001) {
    throw new RangeError('points must be an integer from 41 to 4001');
  }

  const slabThickness = 12;
  const length = slabThickness + vacuumThickness;
  const leftSurface = vacuumThickness / 2;
  const rightSurface = leftSurface + slabThickness;
  const leftVacuum = bulkReference + leftDipole;
  const rightVacuum = bulkReference + rightDipole;
  const residualField = (rightVacuum - leftVacuum) / vacuumThickness;
  const profile = [];

  for (let index = 0; index < points; index += 1) {
    const z = length * index / (points - 1);
    let potential;
    if (z < leftSurface) {
      potential = leftVacuum + residualField * (z - leftSurface / 2);
    } else if (z <= rightSurface) {
      const leftBlend = 0.5 * (1 + Math.tanh((z - leftSurface) / screeningLength));
      const rightBlend = 0.5 * (1 + Math.tanh((rightSurface - z) / screeningLength));
      const bulkWeight = leftBlend * rightBlend;
      const surfaceInterpolation = leftVacuum
        + (rightVacuum - leftVacuum) * (z - leftSurface) / slabThickness;
      potential = bulkWeight * bulkReference + (1 - bulkWeight) * surfaceInterpolation;
    } else {
      potential = rightVacuum + residualField * (z - rightSurface - vacuumThickness / 2);
    }
    profile.push({ z, potential });
  }

  return {
    profile,
    length,
    leftSurface,
    rightSurface,
    leftVacuum,
    rightVacuum,
    leftWorkFunction: leftVacuum - fermiEnergy,
    rightWorkFunction: rightVacuum - fermiEnergy,
    residualField,
    symmetric: Math.abs(leftDipole - rightDipole) < 1e-12,
  };
};

export const tammBoundaryState = ({ hopping = -1, boundaryShift = 1.8 } = {}) => {
  finite('hopping', hopping);
  finite('boundaryShift', boundaryShift);
  if (hopping === 0) throw new RangeError('hopping must be non-zero');
  const threshold = Math.abs(hopping);
  const hasBoundState = Math.abs(boundaryShift) > threshold;
  const bandMin = -2 * Math.abs(hopping);
  const bandMax = 2 * Math.abs(hopping);
  if (!hasBoundState) {
    return {
      hasBoundState,
      bandMin,
      bandMax,
      threshold,
      energy: null,
      decayRatio: null,
      localizationLength: null,
      side: null,
    };
  }
  const energy = boundaryShift + hopping ** 2 / boundaryShift;
  const decayRatio = Math.abs(hopping / boundaryShift);
  return {
    hasBoundState,
    bandMin,
    bandMax,
    threshold,
    energy,
    decayRatio,
    localizationLength: -1 / Math.log(decayRatio),
    side: energy > bandMax ? 'above' : 'below',
  };
};

export const tammAmplitudes = ({ hopping = -1, boundaryShift = 1.8, sites = 20 } = {}) => {
  if (!Number.isInteger(sites) || sites < 2 || sites > 500) {
    throw new RangeError('sites must be an integer from 2 to 500');
  }
  const state = tammBoundaryState({ hopping, boundaryShift });
  if (!state.hasBoundState) return { ...state, amplitudes: [] };
  const raw = Array.from({ length: sites }, (_, index) => state.decayRatio ** index);
  const norm = Math.sqrt(raw.reduce((sum, value) => sum + value ** 2, 0));
  const sign = Math.sign(-hopping / boundaryShift) || 1;
  return {
    ...state,
    amplitudes: raw.map((value, index) => ({
      site: index + 1,
      amplitude: value * sign ** index / norm,
      probability: value ** 2 / norm ** 2,
    })),
  };
};

export const interfaceBandOffsets = ({
  valenceA = -1.2,
  valenceB = -0.4,
  conductionA = 1.1,
  conductionB = 1.5,
  averagePotentialA = -9.5,
  averagePotentialB = -8.9,
  lineup = 0.25,
  strainValenceB = -0.12,
  strainConductionB = 0.18,
} = {}) => {
  const values = {
    valenceA,
    valenceB,
    conductionA,
    conductionB,
    averagePotentialA,
    averagePotentialB,
    lineup,
    strainValenceB,
    strainConductionB,
  };
  Object.entries(values).forEach(([name, value]) => finite(name, value));

  const bulkValenceTerm = (valenceB - averagePotentialB)
    - (valenceA - averagePotentialA);
  const bulkConductionTerm = (conductionB - averagePotentialB)
    - (conductionA - averagePotentialA);
  const valenceOffset = bulkValenceTerm + lineup + strainValenceB;
  const conductionOffset = bulkConductionTerm + lineup + strainConductionB;

  return {
    bulkValenceTerm,
    bulkConductionTerm,
    lineup,
    strainValenceB,
    strainConductionB,
    valenceOffset,
    conductionOffset,
    gapA: conductionA - valenceA,
    gapBStrained: conductionB + strainConductionB - valenceB - strainValenceB,
  };
};

export const polarDiscontinuityProfile = ({
  layers = 12,
  layerCharge = 1,
  compensation = 0,
  spacing = 1,
  permittivity = 1,
} = {}) => {
  if (!Number.isInteger(layers) || layers < 2 || layers > 200) {
    throw new RangeError('layers must be an integer from 2 to 200');
  }
  finite('layerCharge', layerCharge);
  finite('compensation', compensation);
  positive('spacing', spacing);
  positive('permittivity', permittivity);

  let field = 0;
  let potential = 0;
  const profile = [{ plane: 0, charge: -compensation, field, potential }];
  field += -compensation / permittivity;

  for (let plane = 1; plane <= layers; plane += 1) {
    potential -= field * spacing;
    const charge = (plane % 2 === 1 ? layerCharge : -layerCharge);
    field += charge / permittivity;
    profile.push({ plane, charge, field, potential });
  }

  const evenPlanePotentials = profile.filter(({ plane }) => plane % 2 === 0);
  const averageSlope = evenPlanePotentials.length > 1
    ? (evenPlanePotentials.at(-1).potential - evenPlanePotentials[0].potential)
      / ((evenPlanePotentials.at(-1).plane - evenPlanePotentials[0].plane) * spacing)
    : 0;

  return {
    profile,
    averageSlope,
    finalField: field,
    potentialRange: Math.max(...profile.map((item) => item.potential))
      - Math.min(...profile.map((item) => item.potential)),
  };
};

export const parabolicDOS = ({
  energy,
  edge = 0,
  dimension = 2,
  broadening = 0.02,
  prefactor = 1,
} = {}) => {
  finite('energy', energy);
  finite('edge', edge);
  positive('broadening', broadening);
  positive('prefactor', prefactor);
  if (![1, 2, 3].includes(dimension)) throw new RangeError('dimension must be 1, 2, or 3');
  const x = Math.max(energy - edge, broadening);
  if (energy < edge - 5 * broadening) return 0;
  if (dimension === 1) return prefactor / Math.sqrt(x);
  if (dimension === 2) return prefactor;
  return prefactor * Math.sqrt(x);
};

export const sampleDimensionalDOS = ({
  edge = 0,
  broadening = 0.02,
  energyMin = -0.1,
  energyMax = 1,
  points = 221,
} = {}) => {
  finite('edge', edge);
  positive('broadening', broadening);
  finite('energyMin', energyMin);
  finite('energyMax', energyMax);
  if (energyMax <= energyMin) throw new RangeError('energyMax must exceed energyMin');
  if (!Number.isInteger(points) || points < 21 || points > 4001) {
    throw new RangeError('points must be an integer from 21 to 4001');
  }
  return Array.from({ length: points }, (_, index) => {
    const energy = energyMin + (energyMax - energyMin) * index / (points - 1);
    return {
      energy,
      dos1d: parabolicDOS({ energy, edge, dimension: 1, broadening }),
      dos2d: parabolicDOS({ energy, edge, dimension: 2, broadening }),
      dos3d: parabolicDOS({ energy, edge, dimension: 3, broadening }),
    };
  });
};
