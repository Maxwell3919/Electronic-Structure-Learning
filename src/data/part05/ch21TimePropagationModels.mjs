const finite = (name, value) => {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
};

const positive = (name, value) => {
  finite(name, value);
  if (value <= 0) throw new RangeError(`${name} must be positive`);
};

export const cayleyFactor = ({ energy, timeStep }) => {
  finite('energy', energy);
  positive('timeStep', timeStep);
  const half = 0.5 * energy * timeStep;
  const denominator = 1 + half ** 2;
  return {
    real: (1 - half ** 2) / denominator,
    imaginary: -2 * half / denominator,
  };
};

export const secondOrderTaylorFactor = ({ energy, timeStep }) => {
  finite('energy', energy);
  positive('timeStep', timeStep);
  const phase = energy * timeStep;
  return {
    real: 1 - 0.5 * phase ** 2,
    imaginary: -phase,
  };
};

const multiplyComplex = (left, right) => ({
  real: left.real * right.real - left.imaginary * right.imaginary,
  imaginary: left.real * right.imaginary + left.imaginary * right.real,
});

const normSquared = (value) => value.real ** 2 + value.imaginary ** 2;

export const propagateScalarMode = ({
  energy = 4,
  timeStep = 0.1,
  steps = 100,
  method = 'cayley',
} = {}) => {
  finite('energy', energy);
  positive('timeStep', timeStep);
  if (!Number.isInteger(steps) || steps < 0 || steps > 1000000) {
    throw new RangeError('steps must be an integer between 0 and 1000000');
  }
  if (!['cayley', 'taylor2'].includes(method)) {
    throw new RangeError('method must be cayley or taylor2');
  }

  const factor = method === 'cayley'
    ? cayleyFactor({ energy, timeStep })
    : secondOrderTaylorFactor({ energy, timeStep });
  let amplitude = { real: 1, imaginary: 0 };
  for (let step = 0; step < steps; step += 1) {
    amplitude = multiplyComplex(amplitude, factor);
  }

  return {
    amplitude,
    normSquared: normSquared(amplitude),
    time: steps * timeStep,
    factorNormSquared: normSquared(factor),
  };
};

export const sampleDampedSignal = ({
  modes = [
    { frequency: 4, amplitude: 1, damping: 0 },
    { frequency: 4.5, amplitude: 0.8, damping: 0 },
  ],
  timeStep = 0.05,
  totalTime = 40,
} = {}) => {
  positive('timeStep', timeStep);
  positive('totalTime', totalTime);
  if (!Array.isArray(modes) || modes.length === 0) {
    throw new TypeError('modes must be a non-empty array');
  }
  for (const mode of modes) {
    positive('mode frequency', mode.frequency);
    finite('mode amplitude', mode.amplitude);
    if (mode.damping === undefined) mode.damping = 0;
    finite('mode damping', mode.damping);
    if (mode.damping < 0) throw new RangeError('mode damping must be non-negative');
  }

  const steps = Math.floor(totalTime / timeStep);
  return Array.from({ length: steps + 1 }, (_, index) => {
    const time = index * timeStep;
    const value = modes.reduce(
      (sum, mode) => sum
        + mode.amplitude * Math.sin(mode.frequency * time) * Math.exp(-mode.damping * time),
      0,
    );
    return { time, value };
  });
};

export const finiteTimeSpectrum = ({
  signal,
  windowDamping = 0.05,
  maxFrequency = 8,
  points = 321,
} = {}) => {
  if (!Array.isArray(signal) || signal.length < 2) {
    throw new TypeError('signal must contain at least two samples');
  }
  finite('windowDamping', windowDamping);
  if (windowDamping < 0) throw new RangeError('windowDamping must be non-negative');
  positive('maxFrequency', maxFrequency);
  if (!Number.isInteger(points) || points < 3 || points > 5001) {
    throw new RangeError('points must be an integer between 3 and 5001');
  }

  const timeStep = signal[1].time - signal[0].time;
  positive('signal time step', timeStep);

  return Array.from({ length: points }, (_, frequencyIndex) => {
    const frequency = maxFrequency * frequencyIndex / (points - 1);
    let real = 0;
    let imaginary = 0;
    for (let index = 0; index < signal.length; index += 1) {
      const { time, value } = signal[index];
      const endpointWeight = index === 0 || index === signal.length - 1 ? 0.5 : 1;
      const window = Math.exp(-windowDamping * time);
      const weighted = endpointWeight * value * window * timeStep;
      real += weighted * Math.cos(frequency * time);
      imaginary += weighted * Math.sin(frequency * time);
    }
    return {
      frequency,
      real,
      imaginary,
      magnitude: Math.hypot(real, imaginary),
    };
  });
};

export const estimateAngularFrequencyResolution = (totalTime) => {
  positive('totalTime', totalTime);
  return 2 * Math.PI / totalTime;
};
