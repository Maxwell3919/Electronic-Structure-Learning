const finite = (value, label) => {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite`);
  return value;
};
const positive = (value, label) => {
  finite(value, label);
  if (value <= 0) throw new RangeError(`${label} must be positive`);
  return value;
};
const sinc = (x) => Math.abs(x) < 1e-8 ? 1 - x * x / 6 : Math.sin(x) / x;
const sincDerivative = (k, r) => {
  const x = k * r;
  return Math.abs(x) < 1e-6 ? -k * x / 3 : k * (x * Math.cos(x) - Math.sin(x)) / (x * x);
};

export function muffinTinPartition({ cellWidth = 10, cellHeight = 6, radius = 1, centres = [[2.5, 3], [5, 3], [7.5, 3]] } = {}) {
  positive(cellWidth, 'cellWidth'); positive(cellHeight, 'cellHeight'); positive(radius, 'radius');
  if (!Array.isArray(centres) || centres.length === 0) throw new TypeError('centres must be non-empty');
  const checked = centres.map(([x, y], index) => {
    finite(x, `centre ${index} x`); finite(y, `centre ${index} y`);
    if (x - radius < 0 || x + radius > cellWidth || y - radius < 0 || y + radius > cellHeight) throw new RangeError(`sphere ${index} crosses the cell boundary`);
    return [x, y];
  });
  let nearestGap = Infinity;
  for (let i = 0; i < checked.length; i += 1) for (let j = i + 1; j < checked.length; j += 1) {
    const gap = Math.hypot(checked[i][0] - checked[j][0], checked[i][1] - checked[j][1]) - 2 * radius;
    nearestGap = Math.min(nearestGap, gap);
    if (gap < -1e-12) throw new RangeError(`spheres ${i} and ${j} overlap`);
  }
  const cellArea = cellWidth * cellHeight;
  const sphereArea = checked.length * Math.PI * radius ** 2;
  if (sphereArea >= cellArea) throw new RangeError('sphere area must remain below cell area');
  return { cellArea, sphereArea, sphereFraction: sphereArea / cellArea, interstitialArea: cellArea - sphereArea, interstitialFraction: 1 - sphereArea / cellArea, nearestGap, centres: checked };
}

export function apwBoundaryMatching({ energy = 2, depth = 4, radius = 0.9 } = {}) {
  positive(energy, 'energy'); finite(depth, 'depth'); positive(radius, 'radius');
  if (energy + depth <= 0) throw new RangeError('energy + depth must be positive');
  const k = Math.sqrt(energy), q = Math.sqrt(energy + depth);
  const inside = sinc(q * radius), outside = sinc(k * radius);
  if (Math.abs(inside) < 1e-7 || Math.abs(outside) < 1e-7) throw new RangeError('boundary value is too close to a radial node');
  const insideD = radius * sincDerivative(q, radius) / inside;
  const outsideD = radius * sincDerivative(k, radius) / outside;
  return { k, q, radius, amplitude: outside / inside, interiorBoundary: inside, exteriorBoundary: outside, interiorLogDerivative: insideD, exteriorLogDerivative: outsideD, mismatch: outsideD - insideD };
}

const wrapHalfPi = (angle) => {
  let result = angle;
  while (result <= -Math.PI / 2) result += Math.PI;
  while (result > Math.PI / 2) result -= Math.PI;
  return result;
};
export function squareWellSPhaseShift({ energy = 2, depth = 4, radius = 1 } = {}) {
  positive(energy, 'energy'); finite(depth, 'depth'); positive(radius, 'radius');
  if (energy + depth <= 0) throw new RangeError('energy + depth must be positive');
  const k = Math.sqrt(energy), q = Math.sqrt(energy + depth);
  const phaseShift = wrapHalfPi(Math.atan2(k * Math.sin(q * radius), q * Math.cos(q * radius)) - k * radius);
  const sin2 = Math.sin(phaseShift) ** 2;
  return { k, q, phaseShift, sin2: Math.min(1, Math.max(0, sin2)) };
}

const z = (re = 0, im = 0) => ({ re, im });
const add = (a, b) => z(a.re + b.re, a.im + b.im);
const sub = (a, b) => z(a.re - b.re, a.im - b.im);
const mul = (a, b) => z(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const scale = (a, s) => z(a.re * s, a.im * s);
const abs = (a) => Math.hypot(a.re, a.im);
const div = (a, b) => {
  const d = b.re ** 2 + b.im ** 2;
  if (d < 1e-24) throw new RangeError('complex denominator is too small');
  return z((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d);
};
const sqrt = (a) => {
  const m = abs(a), re = Math.sqrt(Math.max(0, (m + a.re) / 2)), im = Math.sqrt(Math.max(0, (m - a.re) / 2));
  return z(re, a.im < 0 ? -im : im);
};
const residual = ({ sigma, concentration, potentialA, potentialB, g }) => {
  const a = z(potentialA - sigma.re, -sigma.im), b = z(potentialB - sigma.re, -sigma.im);
  return add(scale(div(a, sub(z(1), mul(g, a))), concentration), scale(div(b, sub(z(1), mul(g, b))), 1 - concentration));
};
export function scalarCPA({ concentration = 0.5, potentialA = -1, potentialB = 1, cavityImag = -0.8 } = {}) {
  finite(concentration, 'concentration'); finite(potentialA, 'potentialA'); finite(potentialB, 'potentialB'); finite(cavityImag, 'cavityImag');
  if (concentration < 0 || concentration > 1) throw new RangeError('concentration must lie in [0,1]');
  if (cavityImag >= 0) throw new RangeError('retarded cavityImag must be negative');
  const g = z(0, cavityImag), average = concentration * potentialA + (1 - concentration) * potentialB;
  const a = g, b = sub(z(1), scale(g, potentialA + potentialB)), c = sub(scale(g, potentialA * potentialB), z(average));
  const root = sqrt(sub(mul(b, b), scale(mul(a, c), 4))), denominator = scale(a, 2);
  const roots = [div(add(scale(b, -1), root), denominator), div(sub(scale(b, -1), root), denominator)];
  const candidates = roots.filter((item) => item.im <= 1e-10);
  const pool = candidates.length ? candidates : roots;
  pool.sort((left, right) => Math.hypot(left.re - average, left.im) - Math.hypot(right.re - average, right.im) || left.re - right.re);
  const sigma = pool[0], error = residual({ sigma, concentration, potentialA, potentialB, g });
  return { concentration, averagePotential: average, sigma, residual: error, residualNorm: abs(error), disorderWidth: Math.max(0, -sigma.im), roots };
}

export function mtoScreening({ distance = 4, power = 2, screening = 0.5 } = {}) {
  positive(distance, 'distance'); positive(power, 'power'); finite(screening, 'screening');
  if (screening < 0) throw new RangeError('screening must be non-negative');
  const bareTail = distance ** (-power), screenedTail = bareTail * Math.exp(-screening * distance);
  return { bareTail, screenedTail, reduction: bareTail - screenedTail, ratio: screenedTail / bareTail };
}

export function canonicalBandEnergy({ structureEigenvalue = 0, bandCentre = 0, bandScale = 1 } = {}) {
  finite(structureEigenvalue, 'structureEigenvalue'); finite(bandCentre, 'bandCentre'); finite(bandScale, 'bandScale');
  return bandCentre + bandScale * structureEigenvalue;
}
