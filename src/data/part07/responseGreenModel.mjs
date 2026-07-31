const ensureFinite = (value, label) => {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite.`);
  return value;
};

const ensurePositive = (value, label) => {
  ensureFinite(value, label);
  if (value <= 0) throw new RangeError(`${label} must be positive.`);
  return value;
};

export const responseModelDefaults = Object.freeze({
  bareResponse: -0.8,
  kernel: 0.6,
  oscillatorFrequency: 1,
  damping: 0.12,
  broadening: 0.08,
});

export function twoLevelPerturbation({ gap, coupling, observableCoupling = 1 }) {
  ensurePositive(gap, 'gap');
  ensureFinite(coupling, 'coupling');
  ensureFinite(observableCoupling, 'observableCoupling');
  const discriminant = Math.sqrt(gap ** 2 + 4 * coupling ** 2);
  const exactGroundEnergy = 0.5 * (gap - discriminant);
  const exactExcitedEnergy = 0.5 * (gap + discriminant);
  return Object.freeze({
    gap,
    coupling,
    firstStateCoefficient: -coupling / gap,
    secondEnergy: -(coupling ** 2) / gap,
    observableResponse: -2 * observableCoupling * coupling / gap,
    exactGroundEnergy,
    exactExcitedEnergy,
    exactGap: discriminant,
  });
}

export function scalarDysonResponse({ bareResponse, kernel }) {
  ensureFinite(bareResponse, 'bareResponse');
  ensureFinite(kernel, 'kernel');
  if (Math.abs(bareResponse) < 1e-15) {
    throw new RangeError('bareResponse must be non-zero for the inverse-response check.');
  }
  const denominator = 1 - bareResponse * kernel;
  if (Math.abs(denominator) < 1e-12) {
    throw new RangeError('Dyson denominator is singular or numerically unresolved.');
  }
  return Object.freeze({
    bareResponse,
    kernel,
    denominator,
    screenedResponse: bareResponse / denominator,
    inverseBare: 1 / bareResponse,
    inverseScreened: 1 / bareResponse - kernel,
  });
}

export function oscillatorResponse({ omega, omega0, damping, force = 1 }) {
  ensureFinite(omega, 'omega');
  ensurePositive(omega0, 'omega0');
  ensureFinite(damping, 'damping');
  ensureFinite(force, 'force');
  if (damping < 0) throw new RangeError('damping must be non-negative.');
  const realDenominator = omega0 ** 2 - omega ** 2;
  const imaginaryDenominator = -damping * omega;
  const norm = realDenominator ** 2 + imaginaryDenominator ** 2;
  if (norm === 0) throw new RangeError('Undamped response is singular at resonance.');
  return Object.freeze({
    omega,
    real: force * realDenominator / norm,
    imaginary: -force * imaginaryDenominator / norm,
    magnitude: Math.abs(force) / Math.sqrt(norm),
  });
}

export function oscillatorPoles({ omega0, damping }) {
  ensurePositive(omega0, 'omega0');
  ensureFinite(damping, 'damping');
  if (damping < 0) throw new RangeError('damping must be non-negative.');
  const halfGamma = damping / 2;
  const radicand = omega0 ** 2 - halfGamma ** 2;
  if (radicand < 0) {
    const root = Math.sqrt(-radicand);
    return Object.freeze([
      Object.freeze({ real: 0, imaginary: -halfGamma + root }),
      Object.freeze({ real: 0, imaginary: -halfGamma - root }),
    ]);
  }
  const root = Math.sqrt(radicand);
  return Object.freeze([
    Object.freeze({ real: root, imaginary: -halfGamma }),
    Object.freeze({ real: -root, imaginary: -halfGamma }),
  ]);
}

export function oscillatorImpulse({ time, omega0, damping }) {
  ensureFinite(time, 'time');
  ensurePositive(omega0, 'omega0');
  ensureFinite(damping, 'damping');
  if (damping < 0) throw new RangeError('damping must be non-negative.');
  if (time < 0) return 0;
  const halfGamma = damping / 2;
  const squared = omega0 ** 2 - halfGamma ** 2;
  if (squared <= 0) throw new RangeError('This teaching kernel requires underdamped motion.');
  const dampedFrequency = Math.sqrt(squared);
  return Math.exp(-halfGamma * time) * Math.sin(dampedFrequency * time) / dampedFrequency;
}

export function complexGreen({ energy, broadening, levels, weights }) {
  ensureFinite(energy, 'energy');
  ensurePositive(broadening, 'broadening');
  if (!Array.isArray(levels) || !Array.isArray(weights) || levels.length !== weights.length || levels.length === 0) {
    throw new TypeError('levels and weights must be non-empty arrays of equal length.');
  }
  let real = 0;
  let imaginary = 0;
  levels.forEach((level, index) => {
    ensureFinite(level, `levels[${index}]`);
    ensureFinite(weights[index], `weights[${index}]`);
    if (weights[index] < 0) throw new RangeError('spectral weights must be non-negative.');
    const delta = energy - level;
    const denominator = delta ** 2 + broadening ** 2;
    real += weights[index] * delta / denominator;
    imaginary -= weights[index] * broadening / denominator;
  });
  return Object.freeze({ real, imaginary });
}

export function spectralDensity({ energy, broadening, levels, weights }) {
  return -complexGreen({ energy, broadening, levels, weights }).imaginary / Math.PI;
}

export function integrateSpectralDensity({
  minEnergy,
  maxEnergy,
  intervals = 20000,
  broadening,
  levels,
  weights,
}) {
  ensureFinite(minEnergy, 'minEnergy');
  ensureFinite(maxEnergy, 'maxEnergy');
  if (!(maxEnergy > minEnergy)) throw new RangeError('maxEnergy must exceed minEnergy.');
  if (!Number.isInteger(intervals) || intervals < 10 || intervals > 200000) {
    throw new RangeError('intervals must be an integer between 10 and 200000.');
  }
  const step = (maxEnergy - minEnergy) / intervals;
  let sum = 0;
  for (let index = 0; index <= intervals; index += 1) {
    const energy = minEnergy + index * step;
    const value = spectralDensity({ energy, broadening, levels, weights });
    sum += (index === 0 || index === intervals ? 0.5 : 1) * value;
  }
  return step * sum;
}

export function twoNPlusOneCoefficients({ a, b, c, d }) {
  ensurePositive(a, 'a');
  [b, c, d].forEach((value, index) => ensureFinite(value, ['b', 'c', 'd'][index]));
  const x1 = -b / a;
  const x2 = -(c * x1 ** 2 + d * x1) / a;
  const energy2 = 0.5 * a * x1 ** 2 + b * x1;
  const energy3FromFirstOrder = (c / 3) * x1 ** 3 + 0.5 * d * x1 ** 2;
  const energy3IncludingX2 = a * x1 * x2 + b * x2 + energy3FromFirstOrder;
  return Object.freeze({
    x1,
    x2,
    energy2,
    energy3FromFirstOrder,
    energy3IncludingX2,
  });
}

export function variationalEnergy({ x, lambda, a, b, c, d }) {
  ensureFinite(x, 'x');
  ensureFinite(lambda, 'lambda');
  ensurePositive(a, 'a');
  [b, c, d].forEach((value, index) => ensureFinite(value, ['b', 'c', 'd'][index]));
  return 0.5 * a * x ** 2 + (c / 3) * x ** 3 + lambda * (b * x + 0.5 * d * x ** 2);
}

export function sampleOscillator({
  omega0 = responseModelDefaults.oscillatorFrequency,
  damping = responseModelDefaults.damping,
  maxOmega = 2.5,
  count = 301,
} = {}) {
  ensurePositive(omega0, 'omega0');
  ensureFinite(damping, 'damping');
  ensurePositive(maxOmega, 'maxOmega');
  if (damping <= 0) throw new RangeError('sampled damping must be positive.');
  if (!Number.isInteger(count) || count < 2 || count > 5001) {
    throw new RangeError('count must be an integer between 2 and 5001.');
  }
  return Array.from({ length: count }, (_, index) => {
    const omega = (maxOmega * index) / (count - 1);
    return { omega, ...oscillatorResponse({ omega, omega0, damping }) };
  });
}
