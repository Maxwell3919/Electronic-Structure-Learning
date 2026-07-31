const ensureFinite = (name, value) => {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
};

export const nonorthogonalChain = ({
  k,
  hopping,
  overlap,
  onsite = 0,
}) => {
  [
    ['k', k],
    ['hopping', hopping],
    ['overlap', overlap],
    ['onsite', onsite],
  ].forEach(([name, value]) => ensureFinite(name, value));
  const cosine = Math.cos(k);
  const hamiltonian = onsite + 2 * hopping * cosine;
  const metric = 1 + 2 * overlap * cosine;
  return {
    hamiltonian,
    metric,
    energy: hamiltonian / metric,
    positiveMetricAtK: metric > 0,
    globallyPositiveNearestNeighbourMetric: Math.abs(overlap) < 0.5,
  };
};

export const twoBandSpectrum = ({
  epsilonA,
  epsilonB,
  couplingReal,
  couplingImaginary = 0,
}) => {
  [
    ['epsilonA', epsilonA],
    ['epsilonB', epsilonB],
    ['couplingReal', couplingReal],
    ['couplingImaginary', couplingImaginary],
  ].forEach(([name, value]) => ensureFinite(name, value));
  const centre = 0.5 * (epsilonA + epsilonB);
  const halfDifference = 0.5 * (epsilonA - epsilonB);
  const couplingMagnitudeSquared = couplingReal ** 2 + couplingImaginary ** 2;
  const radius = Math.sqrt(halfDifference ** 2 + couplingMagnitudeSquared);
  const lower = centre - radius;
  const upper = centre + radius;
  const lowerAWeight = radius === 0 ? 0.5 : 0.5 * (1 - halfDifference / radius);
  return {
    lower,
    upper,
    gap: 2 * radius,
    centre,
    halfDifference,
    couplingMagnitudeSquared,
    lowerAWeight,
    lowerBWeight: 1 - lowerAWeight,
  };
};

export const slaterKosterSP = ({ directionCosine, spSigma }) => {
  ensureFinite('directionCosine', directionCosine);
  ensureFinite('spSigma', spSigma);
  if (Math.abs(directionCosine) > 1) {
    throw new RangeError('directionCosine must lie in [-1, 1]');
  }
  return directionCosine * spSigma;
};

export const slaterKosterPP = ({
  l,
  m,
  ppSigma,
  ppPi,
}) => {
  [
    ['l', l],
    ['m', m],
    ['ppSigma', ppSigma],
    ['ppPi', ppPi],
  ].forEach(([name, value]) => ensureFinite(name, value));
  if (l ** 2 + m ** 2 > 1 + 1e-12) {
    throw new RangeError('l and m must be compatible direction cosines');
  }
  return {
    pxx: l ** 2 * ppSigma + (1 - l ** 2) * ppPi,
    pyy: m ** 2 * ppSigma + (1 - m ** 2) * ppPi,
    pxy: l * m * (ppSigma - ppPi),
  };
};

export const grapheneStructureFactor = ({ kx, ky, bondLength = 1 }) => {
  [
    ['kx', kx],
    ['ky', ky],
    ['bondLength', bondLength],
  ].forEach(([name, value]) => ensureFinite(name, value));
  if (bondLength <= 0) throw new RangeError('bondLength must be positive');
  const bonds = [
    [0, bondLength],
    [Math.sqrt(3) * bondLength / 2, -bondLength / 2],
    [-Math.sqrt(3) * bondLength / 2, -bondLength / 2],
  ];
  let real = 0;
  let imaginary = 0;
  bonds.forEach(([x, y]) => {
    const phase = kx * x + ky * y;
    real += Math.cos(phase);
    imaginary += Math.sin(phase);
  });
  return {
    real,
    imaginary,
    magnitude: Math.hypot(real, imaginary),
  };
};

export const grapheneBands = ({
  kx,
  ky,
  hopping = -1,
  sublatticeMass = 0,
  bondLength = 1,
}) => {
  [
    ['hopping', hopping],
    ['sublatticeMass', sublatticeMass],
  ].forEach(([name, value]) => ensureFinite(name, value));
  const factor = grapheneStructureFactor({ kx, ky, bondLength });
  const radius = Math.sqrt(sublatticeMass ** 2 + (hopping * factor.magnitude) ** 2);
  return {
    lower: -radius,
    upper: radius,
    directGap: 2 * radius,
    structureFactorMagnitude: factor.magnitude,
  };
};

export const grapheneKPoint = ({ bondLength = 1 } = {}) => {
  ensureFinite('bondLength', bondLength);
  if (bondLength <= 0) throw new RangeError('bondLength must be positive');
  return {
    kx: 4 * Math.PI / (3 * Math.sqrt(3) * bondLength),
    ky: 0,
  };
};

export const nanotubeZoneFolding = ({ n, m }) => {
  if (!Number.isInteger(n) || !Number.isInteger(m) || n < 0 || m < 0 || (n === 0 && m === 0)) {
    throw new RangeError('n and m must be nonnegative integers and not both zero');
  }
  const difference = n - m;
  const remainder = ((difference % 3) + 3) % 3;
  const zoneFoldingMetallic = remainder === 0;
  return {
    difference,
    remainder,
    zoneFoldingMetallic,
    family: zoneFoldingMetallic ? '3q' : remainder === 1 ? '3q+1' : '3q+2',
  };
};
