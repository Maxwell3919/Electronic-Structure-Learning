export const linearMixingMode = ({ responseSlope, alpha }) => {
  if (!Number.isFinite(responseSlope) || !Number.isFinite(alpha)) {
    throw new TypeError('responseSlope and alpha must be finite');
  }
  if (alpha < 0 || alpha > 1) {
    throw new RangeError('alpha must lie in [0, 1]');
  }
  const factor = 1 + alpha * (responseSlope - 1);
  return {
    factor,
    magnitude: Math.abs(factor),
    stable: Math.abs(factor) < 1,
    oneStep: Math.abs(factor) < 1e-12,
    oscillatory: factor < 0 && Math.abs(factor) < 1,
  };
};

export const iterateLinearMixingMode = ({
  responseSlope,
  alpha,
  initialError = 1,
  steps = 16,
}) => {
  if (!Number.isInteger(steps) || steps < 0 || steps > 200) {
    throw new RangeError('steps must be an integer in [0, 200]');
  }
  const mode = linearMixingMode({ responseSlope, alpha });
  const values = [initialError];
  for (let index = 0; index < steps; index += 1) {
    values.push(values.at(-1) * mode.factor);
  }
  return { ...mode, values };
};

export const diagonalPreconditioner = ({ wavevector, screeningWavevector }) => {
  if (!Number.isFinite(wavevector) || wavevector < 0) {
    throw new RangeError('wavevector must be finite and nonnegative');
  }
  if (!Number.isFinite(screeningWavevector) || screeningWavevector < 0) {
    throw new RangeError('screeningWavevector must be finite and nonnegative');
  }
  const denominator = wavevector ** 2 + screeningWavevector ** 2;
  if (denominator === 0) return 1;
  return wavevector ** 2 / denominator;
};

export const pawTeachingProfile = ({ radius, augmentationRadius = 1.6, amplitude = 0.7 }) => {
  if (!Number.isFinite(radius) || radius < 0) {
    throw new RangeError('radius must be finite and nonnegative');
  }
  if (!Number.isFinite(augmentationRadius) || augmentationRadius <= 0) {
    throw new RangeError('augmentationRadius must be positive');
  }
  if (!Number.isFinite(amplitude)) {
    throw new TypeError('amplitude must be finite');
  }
  const smooth = radius * Math.exp(-0.7 * radius);
  const reduced = radius / augmentationRadius;
  const window = reduced < 1 ? (1 - reduced) ** 2 : 0;
  const correction = amplitude * window * Math.exp(-1.8 * radius) * Math.cos(4 * radius);
  return {
    smooth,
    correction,
    reconstructed: smooth + correction,
    outsideAugmentation: radius >= augmentationRadius,
  };
};

export const periodicImageTeachingError = ({ cellLength, decayLength = 2 }) => {
  if (!Number.isFinite(cellLength) || cellLength <= 0) {
    throw new RangeError('cellLength must be positive');
  }
  if (!Number.isFinite(decayLength) || decayLength <= 0) {
    throw new RangeError('decayLength must be positive');
  }
  return Math.exp(-cellLength / decayLength);
};
