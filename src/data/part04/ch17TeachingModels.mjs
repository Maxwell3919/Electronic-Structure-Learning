const finite = (value, label) => {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite`);
  return value;
};

const positive = (value, label) => {
  finite(value, label);
  if (value <= 0) throw new RangeError(`${label} must be positive`);
  return value;
};

const trapezoid = (values, step) => {
  if (values.length < 2) throw new RangeError('at least two samples are required');
  return step * (0.5 * values[0] + values.slice(1, -1).reduce((sum, value) => sum + value, 0) + 0.5 * values.at(-1));
};

const dotGrid = (left, right, step) => trapezoid(left.map((value, index) => value * right[index]), step);
const normGrid = (values, step) => Math.sqrt(Math.max(0, dotGrid(values, values, step)));
const sinc = (x) => Math.abs(x) < 1e-8 ? 1 - x * x / 6 + x ** 4 / 120 : Math.sin(x) / x;
const sincRadiusDerivative = (waveNumber, radius) => {
  const x = waveNumber * radius;
  if (Math.abs(x) < 1e-6) return -waveNumber * x / 3;
  return waveNumber * (x * Math.cos(x) - Math.sin(x)) / (x * x);
};

export function normalizedRadialState({ energy = 2, radius = 4, points = 401 } = {}) {
  positive(energy, 'energy');
  positive(radius, 'radius');
  if (!Number.isInteger(points) || points < 51) throw new RangeError('points must be an integer >= 51');
  const step = radius / (points - 1);
  const waveNumber = Math.sqrt(energy);
  const radii = Array.from({ length: points }, (_, index) => index * step);
  const raw = radii.map((r) => Math.sin(waveNumber * r));
  const rawNorm = normGrid(raw, step);
  if (rawNorm < 1e-10) throw new RangeError('radial state norm is too small');
  const values = raw.map((value) => value / rawNorm);
  return { energy, radius, points, step, waveNumber, radii, values, norm: normGrid(values, step) };
}

export function radialEnergyDerivative({ energy = 2, radius = 4, points = 401, energyStep = 1e-4 } = {}) {
  positive(energy, 'energy');
  positive(energyStep, 'energyStep');
  if (energy <= energyStep) throw new RangeError('energy must exceed energyStep');
  const centre = normalizedRadialState({ energy, radius, points });
  const plus = normalizedRadialState({ energy: energy + energyStep, radius, points });
  const minus = normalizedRadialState({ energy: energy - energyStep, radius, points });
  const derivative = centre.values.map((_, index) => (plus.values[index] - minus.values[index]) / (2 * energyStep));
  const overlap = dotGrid(centre.values, derivative, centre.step);
  const derivativeNorm = normGrid(derivative, centre.step);
  return { ...centre, derivative, overlap, derivativeNorm, energyStep };
}

export function radialLinearization({ referenceEnergy = 2, targetEnergy = 2.2, radius = 4, points = 401, energyStep = 1e-4 } = {}) {
  positive(referenceEnergy, 'referenceEnergy');
  positive(targetEnergy, 'targetEnergy');
  const reference = radialEnergyDerivative({ energy: referenceEnergy, radius, points, energyStep });
  const target = normalizedRadialState({ energy: targetEnergy, radius, points });
  const deltaEnergy = targetEnergy - referenceEnergy;
  const approximation = reference.values.map((value, index) => value + deltaEnergy * reference.derivative[index]);
  const difference = target.values.map((value, index) => value - approximation[index]);
  const errorNorm = normGrid(difference, reference.step);
  const approximationNorm = normGrid(approximation, reference.step);
  const targetOverlap = dotGrid(target.values, approximation, reference.step) / approximationNorm;
  return { reference, target, deltaEnergy, approximation, difference, errorNorm, approximationNorm, targetOverlap };
}

const boundaryValues = ({ energy, radius }) => {
  positive(energy, 'energy'); positive(radius, 'radius');
  const k = Math.sqrt(energy);
  return { value: sinc(k * radius), derivative: sincRadiusDerivative(k, radius) };
};

export function lapwBoundaryMatch({ referenceEnergy = 2, planeWaveNumber = 2.1, radius = 1, energyStep = 1e-5 } = {}) {
  positive(referenceEnergy, 'referenceEnergy'); positive(planeWaveNumber, 'planeWaveNumber'); positive(radius, 'radius'); positive(energyStep, 'energyStep');
  if (referenceEnergy <= energyStep) throw new RangeError('referenceEnergy must exceed energyStep');
  const centre = boundaryValues({ energy: referenceEnergy, radius });
  const plus = boundaryValues({ energy: referenceEnergy + energyStep, radius });
  const minus = boundaryValues({ energy: referenceEnergy - energyStep, radius });
  const energyDerivative = {
    value: (plus.value - minus.value) / (2 * energyStep),
    derivative: (plus.derivative - minus.derivative) / (2 * energyStep),
  };
  const outside = { value: sinc(planeWaveNumber * radius), derivative: sincRadiusDerivative(planeWaveNumber, radius) };
  const determinant = centre.value * energyDerivative.derivative - centre.derivative * energyDerivative.value;
  if (Math.abs(determinant) < 1e-10) throw new RangeError('LAPW boundary system is ill-conditioned');
  const coefficientU = (outside.value * energyDerivative.derivative - outside.derivative * energyDerivative.value) / determinant;
  const coefficientDotU = (centre.value * outside.derivative - centre.derivative * outside.value) / determinant;
  const matchedValue = coefficientU * centre.value + coefficientDotU * energyDerivative.value;
  const matchedDerivative = coefficientU * centre.derivative + coefficientDotU * energyDerivative.derivative;
  return {
    referenceEnergy, planeWaveNumber, radius, coefficientU, coefficientDotU,
    centre, energyDerivative, outside,
    valueResidual: matchedValue - outside.value,
    slopeResidual: matchedDerivative - outside.derivative,
    determinant,
  };
}

export function screenedStructureBand({ screening = 0.5, cutoff = 3, maxShell = 40, points = 181 } = {}) {
  finite(screening, 'screening');
  if (screening < 0) throw new RangeError('screening must be non-negative');
  if (!Number.isInteger(cutoff) || cutoff < 1) throw new RangeError('cutoff must be a positive integer');
  if (!Number.isInteger(maxShell) || maxShell <= cutoff) throw new RangeError('maxShell must exceed cutoff');
  if (!Number.isInteger(points) || points < 21) throw new RangeError('points must be an integer >= 21');
  const coupling = (shell) => Math.exp(-screening * shell) / (shell * shell);
  const wavevectors = Array.from({ length: points }, (_, index) => Math.PI * index / (points - 1));
  const band = (limit, k) => 2 * Array.from({ length: limit }, (_, index) => coupling(index + 1) * Math.cos((index + 1) * k)).reduce((sum, value) => sum + value, 0);
  const exact = wavevectors.map((k) => band(maxShell, k));
  const truncated = wavevectors.map((k) => band(cutoff, k));
  const maxError = Math.max(...exact.map((value, index) => Math.abs(value - truncated[index])));
  const omittedTailBound = 2 * Array.from({ length: maxShell - cutoff }, (_, index) => coupling(cutoff + index + 1)).reduce((sum, value) => sum + Math.abs(value), 0);
  return { screening, cutoff, maxShell, wavevectors, exact, truncated, maxError, omittedTailBound, firstCoupling: coupling(1), lastRetainedCoupling: coupling(cutoff) };
}

export function lagrangeInterpolate(nodes, values, x) {
  if (!Array.isArray(nodes) || !Array.isArray(values) || nodes.length !== values.length || nodes.length === 0) throw new TypeError('nodes and values must be non-empty equal-length arrays');
  finite(x, 'x');
  return nodes.reduce((sum, node, index) => {
    finite(node, `node ${index}`); finite(values[index], `value ${index}`);
    let basis = 1;
    for (let other = 0; other < nodes.length; other += 1) {
      if (other === index) continue;
      const denominator = node - nodes[other];
      if (Math.abs(denominator) < 1e-12) throw new RangeError('nodes must be distinct');
      basis *= (x - nodes[other]) / denominator;
    }
    return sum + values[index] * basis;
  }, 0);
}

export function nmtoInterpolation({ energy = 0.45, spacing = 1 } = {}) {
  finite(energy, 'energy'); positive(spacing, 'spacing');
  const target = (x) => 1 + 0.4 * x - 0.15 * x * x + 0.05 * x ** 3;
  const nodes = [-spacing, 0, spacing];
  const values = nodes.map(target);
  const interpolated = lagrangeInterpolate(nodes, values, energy);
  const exact = target(energy);
  const predictedError = 0.05 * (energy + spacing) * energy * (energy - spacing);
  return { energy, spacing, nodes, values, exact, interpolated, error: exact - interpolated, predictedError };
}

export function fullPotentialAngularProduct({ lWave = 2 } = {}) {
  if (!Number.isInteger(lWave) || lWave < 0) throw new RangeError('lWave must be a non-negative integer');
  return { lWave, densityMaximumL: 2 * lWave, potentialCouplingMaximumL: 2 * lWave };
}
