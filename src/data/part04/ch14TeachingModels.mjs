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
