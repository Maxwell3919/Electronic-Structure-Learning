const assertFinite = (value, label) => {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite`);
};

const assertVector2 = (vector, label) => {
  if (!Array.isArray(vector) || vector.length !== 2) {
    throw new TypeError(`${label} must be a two-component array`);
  }
  vector.forEach((value, index) => assertFinite(value, `${label}[${index}]`));
};

export const dot2 = (left, right) => {
  assertVector2(left, 'left');
  assertVector2(right, 'right');
  return left[0] * right[0] + left[1] * right[1];
};

export const reciprocalLattice2D = ({ a1, a2 }) => {
  assertVector2(a1, 'a1');
  assertVector2(a2, 'a2');
  const signedArea = a1[0] * a2[1] - a1[1] * a2[0];
  if (Math.abs(signedArea) < 1e-10) {
    throw new RangeError('primitive vectors must be linearly independent');
  }
  const scale = 2 * Math.PI / signedArea;
  const b1 = [scale * a2[1], -scale * a2[0]];
  const b2 = [-scale * a1[1], scale * a1[0]];
  const reciprocalSignedArea = b1[0] * b2[1] - b1[1] * b2[0];
  return {
    a1: [...a1],
    a2: [...a2],
    b1,
    b2,
    directArea: Math.abs(signedArea),
    reciprocalArea: Math.abs(reciprocalSignedArea),
    signedArea,
    reciprocalSignedArea,
    areaProduct: Math.abs(signedArea * reciprocalSignedArea),
    dualityMatrix: [
      [dot2(a1, b1), dot2(a1, b2)],
      [dot2(a2, b1), dot2(a2, b2)],
    ],
  };
};

export const latticeFromShape2D = ({ length = 1, ratio = 1, angleDegrees = 60 }) => {
  [length, ratio, angleDegrees].forEach((value, index) => assertFinite(value, ['length', 'ratio', 'angleDegrees'][index]));
  if (length <= 0 || ratio <= 0) throw new RangeError('length and ratio must be positive');
  if (angleDegrees <= 5 || angleDegrees >= 175) throw new RangeError('angle must lie between 5 and 175 degrees');
  const angle = angleDegrees * Math.PI / 180;
  return {
    a1: [length, 0],
    a2: [length * ratio * Math.cos(angle), length * ratio * Math.sin(angle)],
  };
};

export const foldedFreeElectronBand = ({ reducedK, bandIndex = 0 }) => {
  assertFinite(reducedK, 'reducedK');
  assertFinite(bandIndex, 'bandIndex');
  if (!Number.isInteger(bandIndex)) throw new TypeError('bandIndex must be an integer');
  const unfoldedReducedK = reducedK + 2 * bandIndex;
  return {
    reducedK,
    bandIndex,
    unfoldedReducedK,
    energy: unfoldedReducedK ** 2,
  };
};

export const foldedFreeElectronBands = ({ reducedK, minimumBand = -3, maximumBand = 3 }) => {
  assertFinite(reducedK, 'reducedK');
  if (!Number.isInteger(minimumBand) || !Number.isInteger(maximumBand) || minimumBand > maximumBand) {
    throw new RangeError('invalid band-index range');
  }
  return Array.from(
    { length: maximumBand - minimumBand + 1 },
    (_, offset) => foldedFreeElectronBand({ reducedK, bandIndex: minimumBand + offset }),
  );
};

export const sampleFoldedBands = ({
  minimumK = -1,
  maximumK = 1,
  count = 161,
  minimumBand = -2,
  maximumBand = 2,
} = {}) => {
  [minimumK, maximumK].forEach((value, index) => assertFinite(value, ['minimumK', 'maximumK'][index]));
  if (!Number.isInteger(count) || count < 2) throw new RangeError('count must be an integer at least two');
  if (minimumK >= maximumK) throw new RangeError('minimumK must be less than maximumK');
  return Array.from({ length: count }, (_, index) => {
    const reducedK = minimumK + (maximumK - minimumK) * index / (count - 1);
    return {
      reducedK,
      bands: foldedFreeElectronBands({ reducedK, minimumBand, maximumBand }),
    };
  });
};

export const parabolicDOS = ({ dimension, energy, edge = 0, prefactor = 1 }) => {
  [dimension, energy, edge, prefactor].forEach((value, index) => {
    assertFinite(value, ['dimension', 'energy', 'edge', 'prefactor'][index]);
  });
  if (![1, 2, 3].includes(dimension)) throw new RangeError('dimension must be 1, 2, or 3');
  if (prefactor < 0) throw new RangeError('prefactor must be nonnegative');
  const excess = energy - edge;
  if (excess < 0) return 0;
  if (excess === 0) {
    if (dimension === 1) return Number.POSITIVE_INFINITY;
    if (dimension === 2) return prefactor;
    return 0;
  }
  return prefactor * excess ** (dimension / 2 - 1);
};

export const regularizedParabolicDOS = ({ dimension, energy, edge = 0, prefactor = 1, eta = 0.04 }) => {
  assertFinite(eta, 'eta');
  if (eta <= 0) throw new RangeError('eta must be positive');
  const excess = energy - edge;
  if (excess < 0) return 0;
  return prefactor * (excess + eta) ** (dimension / 2 - 1);
};

export const sampleParabolicDOS = ({
  dimension,
  minimumEnergy = 0,
  maximumEnergy = 4,
  count = 161,
  edge = 0,
  prefactor = 1,
  eta = 0.04,
}) => {
  [minimumEnergy, maximumEnergy].forEach((value, index) => assertFinite(value, ['minimumEnergy', 'maximumEnergy'][index]));
  if (!Number.isInteger(count) || count < 2) throw new RangeError('count must be an integer at least two');
  if (minimumEnergy >= maximumEnergy) throw new RangeError('minimumEnergy must be less than maximumEnergy');
  return Array.from({ length: count }, (_, index) => {
    const energy = minimumEnergy + (maximumEnergy - minimumEnergy) * index / (count - 1);
    return {
      energy,
      density: regularizedParabolicDOS({ dimension, energy, edge, prefactor, eta }),
    };
  });
};

export const monkhorstPack1D = ({ count, shift = 0 }) => {
  if (!Number.isInteger(count) || count <= 0) throw new RangeError('count must be a positive integer');
  assertFinite(shift, 'shift');
  return Array.from({ length: count }, (_, index) => ({
    reducedK: -1 + 2 * (index + 0.5 + shift) / count,
    weight: 1 / count,
  }));
};
