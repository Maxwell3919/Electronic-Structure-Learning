const assertFinite = (value, label) => {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite`);
};

const assertPositive = (value, label) => {
  assertFinite(value, label);
  if (!(value > 0)) throw new RangeError(`${label} must be positive`);
};

export function gaussianProduct({ alpha, beta, centerA = 0, centerB = 0 }) {
  assertPositive(alpha, 'alpha');
  assertPositive(beta, 'beta');
  assertFinite(centerA, 'centerA');
  assertFinite(centerB, 'centerB');
  const gamma = alpha + beta;
  const center = (alpha * centerA + beta * centerB) / gamma;
  const separation = centerA - centerB;
  const prefactor = Math.exp(-(alpha * beta / gamma) * separation ** 2);
  const overlap1D = Math.sqrt(Math.PI / gamma) * prefactor;
  const overlap3D = (Math.PI / gamma) ** 1.5 * prefactor;
  return { gamma, center, separation, prefactor, overlap1D, overlap3D };
}

export function smoothConfinedExponential({ radius, decay = 1, cutoff = 4 }) {
  assertFinite(radius, 'radius');
  assertPositive(decay, 'decay');
  assertPositive(cutoff, 'cutoff');
  const r = Math.abs(radius);
  const unconfined = Math.exp(-decay * r);
  if (r >= cutoff) return { value: 0, unconfined, cutoffFactor: 0 };
  const x = r / cutoff;
  const cutoffFactor = 1 - 3 * x ** 2 + 2 * x ** 3;
  return { value: unconfined * cutoffFactor, unconfined, cutoffFactor };
}

export function oneDimensionalExponentialTail({ decay = 1, cutoff = 4 }) {
  assertPositive(decay, 'decay');
  assertPositive(cutoff, 'cutoff');
  // For the normalized even density decay*exp(-2*decay*|x|), the omitted two-sided tail is exact.
  const omittedDensityNorm = Math.exp(-2 * decay * cutoff);
  return { omittedDensityNorm, retainedDensityNorm: 1 - omittedDensityNorm };
}

export function twoBasisDensityMatrix({ overlap = 0.2, mixingAngle = Math.PI / 4, occupation = 2 }) {
  assertFinite(overlap, 'overlap');
  assertFinite(mixingAngle, 'mixingAngle');
  assertFinite(occupation, 'occupation');
  if (Math.abs(overlap) >= 1) throw new RangeError('|overlap| must be smaller than 1');
  if (occupation < 0) throw new RangeError('occupation must be non-negative');
  const raw = [Math.cos(mixingAngle), Math.sin(mixingAngle)];
  const metricNorm = raw[0] ** 2 + raw[1] ** 2 + 2 * overlap * raw[0] * raw[1];
  if (!(metricNorm > 0)) throw new RangeError('coefficient metric norm must be positive');
  const c = raw.map((value) => value / Math.sqrt(metricNorm));
  const P = [
    [occupation * c[0] * c[0], occupation * c[0] * c[1]],
    [occupation * c[1] * c[0], occupation * c[1] * c[1]],
  ];
  const electronCount = P[0][0] + P[1][1] + overlap * (P[0][1] + P[1][0]);
  return { coefficients: c, densityMatrix: P, electronCount, metricNorm };
}

export function twoGaussianDensityAt({ x, overlap = 0.2, mixingAngle = Math.PI / 4, occupation = 2, width = 1, separation = 2 }) {
  assertFinite(x, 'x');
  assertPositive(width, 'width');
  assertPositive(separation, 'separation');
  const model = twoBasisDensityMatrix({ overlap, mixingAngle, occupation });
  const centers = [-separation / 2, separation / 2];
  const phi = centers.map((center) => Math.exp(-width * (x - center) ** 2));
  const P = model.densityMatrix;
  const density = P[0][0] * phi[0] ** 2 + 2 * P[0][1] * phi[0] * phi[1] + P[1][1] * phi[1] ** 2;
  return { density, phi, ...model };
}

const lowerGeneralizedEigenpair = ({ onsiteA, onsiteB, hopping, overlap }) => {
  const a = 1 - overlap ** 2;
  if (!(a > 0)) throw new RangeError('overlap metric must be positive definite');
  // det(H-eS)=0 -> a e^2 + b e + c = 0.
  const b = 2 * hopping * overlap - onsiteA - onsiteB;
  const c0 = onsiteA * onsiteB - hopping ** 2;
  const discriminant = Math.max(0, b ** 2 - 4 * a * c0);
  const eigenvalue = (-b - Math.sqrt(discriminant)) / (2 * a);
  let vector = [hopping - eigenvalue * overlap, -(onsiteA - eigenvalue)];
  if (Math.hypot(...vector) < 1e-13) vector = [-(onsiteB - eigenvalue), hopping - eigenvalue * overlap];
  const norm2 = vector[0] ** 2 + vector[1] ** 2 + 2 * overlap * vector[0] * vector[1];
  vector = vector.map((value) => value / Math.sqrt(norm2));
  return { eigenvalue, vector };
};

export function movingBasisDimer({
  distance,
  onsiteA = 0,
  onsiteB = 0.5,
  hopping0 = -2,
  hoppingDecay = 1,
  overlap0 = 0.35,
  overlapDecay = 1.2,
}) {
  assertPositive(distance, 'distance');
  [onsiteA, onsiteB, hopping0, hoppingDecay, overlap0, overlapDecay].forEach((value, index) => assertFinite(value, `parameter ${index}`));
  const hopping = hopping0 * Math.exp(-hoppingDecay * distance);
  const overlap = overlap0 * Math.exp(-overlapDecay * distance);
  const hoppingDerivative = -hoppingDecay * hopping;
  const overlapDerivative = -overlapDecay * overlap;
  const pair = lowerGeneralizedEigenpair({ onsiteA, onsiteB, hopping, overlap });
  const [c0, c1] = pair.vector;
  const explicitHamiltonianDerivative = 2 * c0 * c1 * hoppingDerivative;
  const overlapDerivativeExpectation = 2 * c0 * c1 * overlapDerivative;
  const eigenvalueDerivative = explicitHamiltonianDerivative - pair.eigenvalue * overlapDerivativeExpectation;
  return {
    ...pair,
    hopping,
    overlap,
    hoppingDerivative,
    overlapDerivative,
    explicitHamiltonianDerivative,
    overlapDerivativeExpectation,
    eigenvalueDerivative,
    force: -eigenvalueDerivative,
  };
}

export function movingBasisFiniteDifference(parameters, step = 1e-5) {
  assertPositive(step, 'step');
  const distance = parameters.distance;
  if (!(distance > step)) throw new RangeError('distance must exceed finite-difference step');
  const plus = movingBasisDimer({ ...parameters, distance: distance + step }).eigenvalue;
  const minus = movingBasisDimer({ ...parameters, distance: distance - step }).eigenvalue;
  return { derivative: (plus - minus) / (2 * step), force: -(plus - minus) / (2 * step) };
}

export function uniformChainContinuedFraction({ energy, hopping = -1, broadening = 0.1, depth = 12 }) {
  assertFinite(energy, 'energy');
  assertFinite(hopping, 'hopping');
  assertPositive(broadening, 'broadening');
  if (!Number.isInteger(depth) || depth < 1 || depth > 200) throw new RangeError('depth must be an integer from 1 to 200');
  let real = energy;
  let imag = broadening;
  const b2 = hopping ** 2;
  for (let level = depth - 1; level >= 1; level -= 1) {
    const denominator = real ** 2 + imag ** 2;
    real = energy - b2 * real / denominator;
    imag = broadening + b2 * imag / denominator;
  }
  const denominator = real ** 2 + imag ** 2;
  const greenReal = real / denominator;
  const greenImag = -imag / denominator;
  const localDensityOfStates = -greenImag / Math.PI;
  return { greenReal, greenImag, localDensityOfStates };
}

export function integrateChainDOS({ hopping = -1, broadening = 0.1, depth = 20, energyLimit = 8, points = 20001 }) {
  assertPositive(energyLimit, 'energyLimit');
  if (!Number.isInteger(points) || points < 3 || points % 2 === 0) throw new RangeError('points must be an odd integer >= 3');
  const step = 2 * energyLimit / (points - 1);
  let sum = 0;
  for (let index = 0; index < points; index += 1) {
    const energy = -energyLimit + index * step;
    const weight = index === 0 || index === points - 1 ? 0.5 : 1;
    sum += weight * uniformChainContinuedFraction({ energy, hopping, broadening, depth }).localDensityOfStates;
  }
  return sum * step;
}
