const finite = (name, value) => {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
  return value;
};

const positive = (name, value) => {
  finite(name, value);
  if (value <= 0) throw new RangeError(`${name} must be positive`);
  return value;
};

const integerInRange = (name, value, min, max) => {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${name} must be an integer from ${min} to ${max}`);
  }
  return value;
};

const complexAdd = (a, b) => ({ re: a.re + b.re, im: a.im + b.im });
const complexExp = (phase) => ({ re: Math.cos(phase), im: Math.sin(phase) });
const complexAbs2 = (z) => z.re ** 2 + z.im ** 2;

export const sampleGaugeWannier = ({
  kPoints = 41,
  phaseShift = 0,
  phaseRipple = 0,
  rippleHarmonic = 1,
} = {}) => {
  integerInRange('kPoints', kPoints, 11, 401);
  if (kPoints % 2 === 0) throw new RangeError('kPoints must be odd');
  integerInRange('phaseShift', phaseShift, -8, 8);
  finite('phaseRipple', phaseRipple);
  integerInRange('rippleHarmonic', rippleHarmonic, 1, 6);

  const half = (kPoints - 1) / 2;
  const cells = Array.from({ length: kPoints }, (_, index) => index - half);
  const kMesh = Array.from({ length: kPoints }, (_, index) => 2 * Math.PI * index / kPoints);
  const amplitudes = cells.map((cell) => {
    let sum = { re: 0, im: 0 };
    for (const k of kMesh) {
      const alpha = phaseShift * k + phaseRipple * Math.sin(rippleHarmonic * k);
      sum = complexAdd(sum, complexExp(alpha - k * cell));
    }
    return { cell, re: sum.re / kPoints, im: sum.im / kPoints };
  });
  const rawNorm = amplitudes.reduce((sum, item) => sum + complexAbs2(item), 0);
  const probabilities = amplitudes.map((item) => ({
    ...item,
    probability: complexAbs2(item) / rawNorm,
  }));
  const center = probabilities.reduce((sum, item) => sum + item.cell * item.probability, 0);
  const spread = probabilities.reduce(
    (sum, item) => sum + (item.cell - center) ** 2 * item.probability,
    0,
  );
  const band = kMesh.map((k) => ({ k, energy: -2 * Math.cos(k) }));
  const peak = probabilities.reduce(
    (best, item) => item.probability > best.probability ? item : best,
    probabilities[0],
  );
  return { probabilities, center, spread, norm: 1, peakCell: peak.cell, band };
};

export const compositeGaugeRotation = ({ theta = 0, separation = 0.5 } = {}) => {
  finite('theta', theta);
  positive('separation', separation);
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const centers = [s ** 2 * separation, c ** 2 * separation];
  const variance = c ** 2 * s ** 2 * separation ** 2;
  const frame = [
    [c, s],
    [-s, c],
  ];
  const projector = [
    [frame[0][0] ** 2 + frame[1][0] ** 2, frame[0][0] * frame[0][1] + frame[1][0] * frame[1][1]],
    [frame[0][1] * frame[0][0] + frame[1][1] * frame[1][0], frame[0][1] ** 2 + frame[1][1] ** 2],
  ];
  return {
    frame,
    projector,
    centers,
    centerSum: centers[0] + centers[1],
    spreads: [variance, variance],
    totalSpread: 2 * variance,
  };
};

export const twoLevelEntangledPoint = ({
  k = 0,
  coupling = 0.12,
  outerMin = -1,
  outerMax = 1,
} = {}) => {
  [k, coupling, outerMin, outerMax].forEach((value, index) =>
    finite(['k', 'coupling', 'outerMin', 'outerMax'][index], value));
  if (outerMax <= outerMin) throw new RangeError('outerMax must exceed outerMin');
  if (coupling < 0) throw new RangeError('coupling must be non-negative');

  const a = -0.15 + 0.75 * Math.cos(k);
  const b = 0.15 - 0.75 * Math.cos(k);
  const delta = a - b;
  const radius = Math.hypot(delta, 2 * coupling);
  const lower = 0.5 * (a + b - radius);
  const upper = 0.5 * (a + b + radius);
  const lowerAWeight = radius === 0 ? 0.5 : 0.5 * (1 - delta / radius);
  const states = [
    { energy: lower, targetWeight: lowerAWeight, label: 'lower' },
    { energy: upper, targetWeight: 1 - lowerAWeight, label: 'upper' },
  ];
  const included = states.filter(({ energy }) => energy >= outerMin && energy <= outerMax);
  const fidelity = included.reduce((sum, state) => sum + state.targetWeight, 0);
  return { k, a, b, states, included, fidelity, selectedCount: included.length };
};

export const sampleEntangledWindow = ({
  coupling = 0.12,
  outerMin = -1,
  outerMax = 1,
  points = 161,
} = {}) => {
  integerInRange('points', points, 21, 2001);
  const samples = Array.from({ length: points }, (_, index) => {
    const k = -Math.PI + 2 * Math.PI * index / (points - 1);
    return twoLevelEntangledPoint({ k, coupling, outerMin, outerMax });
  });
  const minFidelity = Math.min(...samples.map(({ fidelity }) => fidelity));
  const meanFidelity = samples.reduce((sum, item) => sum + item.fidelity, 0) / samples.length;
  const missingPoints = samples.filter(({ fidelity }) => fidelity < 1 - 1e-10).length;
  return { samples, minFidelity, meanFidelity, missingPoints };
};

export const exponentiallyDecayingHoppings = ({
  maxRange = 12,
  decayLength = 1.8,
  nearestHopping = -1,
} = {}) => {
  integerInRange('maxRange', maxRange, 1, 100);
  positive('decayLength', decayLength);
  finite('nearestHopping', nearestHopping);
  return Array.from({ length: maxRange }, (_, index) => {
    const R = index + 1;
    return { R, hopping: nearestHopping * Math.exp(-(R - 1) / decayLength) / R };
  });
};

export const sampleInterpolationError = ({
  cutoff = 3,
  maxRange = 12,
  decayLength = 1.8,
  nearestHopping = -1,
  points = 401,
} = {}) => {
  integerInRange('cutoff', cutoff, 1, maxRange);
  integerInRange('maxRange', maxRange, 1, 100);
  integerInRange('points', points, 21, 4001);
  const hoppings = exponentiallyDecayingHoppings({ maxRange, decayLength, nearestHopping });
  const samples = Array.from({ length: points }, (_, index) => {
    const k = -Math.PI + 2 * Math.PI * index / (points - 1);
    const exact = 2 * hoppings.reduce((sum, { R, hopping }) => sum + hopping * Math.cos(k * R), 0);
    const interpolated = 2 * hoppings
      .filter(({ R }) => R <= cutoff)
      .reduce((sum, { R, hopping }) => sum + hopping * Math.cos(k * R), 0);
    return { k, exact, interpolated, error: interpolated - exact };
  });
  const maxError = Math.max(...samples.map(({ error }) => Math.abs(error)));
  const rmsError = Math.sqrt(samples.reduce((sum, { error }) => sum + error ** 2, 0) / samples.length);
  return { hoppings, samples, maxError, rmsError };
};

export const hybridCenter = ({
  transverseMomentum = 0,
  baseCenter = 0.35,
  modulation = 0.18,
  winding = 0,
} = {}) => {
  [transverseMomentum, baseCenter, modulation, winding].forEach((value, index) =>
    finite(['transverseMomentum', 'baseCenter', 'modulation', 'winding'][index], value));
  const unwrapped = baseCenter
    + modulation * Math.sin(transverseMomentum)
    + winding * transverseMomentum / (2 * Math.PI);
  const wrapped = ((unwrapped % 1) + 1) % 1;
  return { transverseMomentum, unwrapped, wrapped };
};
