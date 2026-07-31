const assertFinite = (value, label) => {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite`);
};

export const electronGasScales = ({ rs, zeta = 0 }) => {
  assertFinite(rs, 'rs');
  assertFinite(zeta, 'zeta');
  if (rs <= 0) throw new RangeError('rs must be positive');
  if (zeta < -1 || zeta > 1) throw new RangeError('zeta must lie in [-1,1]');

  const density = 3 / (4 * Math.PI * rs ** 3);
  const densityUp = density * (1 + zeta) / 2;
  const densityDown = density * (1 - zeta) / 2;
  const kF = (3 * Math.PI ** 2 * density) ** (1 / 3);
  const kFUp = densityUp === 0 ? 0 : (6 * Math.PI ** 2 * densityUp) ** (1 / 3);
  const kFDown = densityDown === 0 ? 0 : (6 * Math.PI ** 2 * densityDown) ** (1 / 3);
  const fermiEnergy = kF ** 2 / 2;
  const kineticSpinFactor = ((1 + zeta) ** (5 / 3) + (1 - zeta) ** (5 / 3)) / 2;
  const exchangeSpinFactor = ((1 + zeta) ** (4 / 3) + (1 - zeta) ** (4 / 3)) / 2;
  const kineticPerElectron = 3 * kF ** 2 / 10 * kineticSpinFactor;
  const exchangeUnpolarized = -3 * kF / (4 * Math.PI);
  const exchangePerElectron = exchangeUnpolarized * exchangeSpinFactor;
  const plasmaFrequency = Math.sqrt(4 * Math.PI * density);
  const thomasFermiWavevector = Math.sqrt(4 * kF / Math.PI);

  return {
    rs,
    zeta,
    density,
    densityUp,
    densityDown,
    kF,
    kFUp,
    kFDown,
    fermiEnergy,
    kineticSpinFactor,
    exchangeSpinFactor,
    kineticPerElectron,
    exchangeUnpolarized,
    exchangePerElectron,
    plasmaFrequency,
    thomasFermiWavevector,
  };
};

export const densityMatrixKernel = (y) => {
  assertFinite(y, 'y');
  const magnitude = Math.abs(y);
  if (magnitude < 1e-4) {
    const y2 = y * y;
    return 1 - y2 / 10 + y2 * y2 / 280 - y2 * y2 * y2 / 15120;
  }
  return 3 * (Math.sin(y) - y * Math.cos(y)) / y ** 3;
};

export const sameSpinPairDistribution = (y) => {
  const kernel = densityMatrixKernel(y);
  return 1 - kernel ** 2;
};

export const exchangeHoleDimensionless = (y) => -densityMatrixKernel(y) ** 2;

export const sampleExchangeHole = ({ maximumY = 24, count = 481 } = {}) => {
  assertFinite(maximumY, 'maximumY');
  if (maximumY <= 0) throw new RangeError('maximumY must be positive');
  if (!Number.isInteger(count) || count < 2) throw new RangeError('count must be an integer at least two');
  return Array.from({ length: count }, (_, index) => {
    const y = maximumY * index / (count - 1);
    return {
      y,
      kernel: densityMatrixKernel(y),
      pair: sameSpinPairDistribution(y),
      hole: exchangeHoleDimensionless(y),
    };
  });
};

export const staticLindhardShape = (x) => {
  assertFinite(x, 'x');
  if (x < 0) throw new RangeError('x must be nonnegative');
  if (x < 1e-5) {
    const x2 = x * x;
    return 1 - x2 / 3 - x2 * x2 / 15;
  }
  if (Math.abs(x - 1) < 1e-8) return 0.5;
  const logarithm = Math.log(Math.abs((1 + x) / (1 - x)));
  return 0.5 + (1 - x * x) * logarithm / (4 * x);
};

export const staticRpaScreening = ({ rs, x }) => {
  const scales = electronGasScales({ rs, zeta: 0 });
  assertFinite(x, 'x');
  if (x < 0) throw new RangeError('x must be nonnegative');
  const shape = staticLindhardShape(x);
  const q = 2 * scales.kF * x;
  if (q === 0) {
    return {
      ...scales,
      x,
      q,
      shape,
      dielectric: Number.POSITIVE_INFINITY,
      screenedToBare: 0,
    };
  }
  const dielectric = 1 + scales.thomasFermiWavevector ** 2 * shape / q ** 2;
  return {
    ...scales,
    x,
    q,
    shape,
    dielectric,
    screenedToBare: 1 / dielectric,
  };
};

export const sampleStaticLindhard = ({ maximumX = 2.5, count = 401, rs = 3 } = {}) => {
  assertFinite(maximumX, 'maximumX');
  if (maximumX <= 0) throw new RangeError('maximumX must be positive');
  if (!Number.isInteger(count) || count < 2) throw new RangeError('count must be an integer at least two');
  return Array.from({ length: count }, (_, index) => {
    const x = maximumX * index / (count - 1);
    return staticRpaScreening({ rs, x });
  });
};

export const hfExchangeFactor = (x) => {
  assertFinite(x, 'x');
  if (x < 0) throw new RangeError('x must be nonnegative');
  if (x < 1e-6) return -2 + 2 * x * x / 3;
  if (Math.abs(x - 1) < 1e-8) return -1;
  return -(1 + (1 - x * x) * Math.log(Math.abs((1 + x) / (1 - x))) / (2 * x));
};
