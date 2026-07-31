const TAU = 2 * Math.PI;

function finite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
  return value;
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function cross(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function normalize(vector) {
  const radius = Math.hypot(vector.x, vector.y, vector.z);
  if (radius === 0) return null;
  return { x: vector.x / radius, y: vector.y / radius, z: vector.z / radius };
}

function solidAngle(a, b, c) {
  const numerator = dot(a, cross(b, c));
  const denominator = 1 + dot(a, b) + dot(b, c) + dot(c, a);
  return 2 * Math.atan2(numerator, denominator);
}

function multiplyComplex(left, right) {
  return {
    re: left.re * right.re - left.im * right.im,
    im: left.re * right.im + left.im * right.re,
  };
}

function lowerBandSpinor(vector) {
  const radius = Math.hypot(vector.x, vector.y, vector.z);
  if (radius === 0) throw new RangeError('lower-band spinor is undefined at a gap closing');

  if (radius + vector.z > 1e-12) {
    const denominator = Math.sqrt(2 * radius * (radius + vector.z));
    return [
      { re: -vector.x / denominator, im: vector.y / denominator },
      { re: (radius + vector.z) / denominator, im: 0 },
    ];
  }

  const denominator = Math.sqrt(2 * radius * (radius - vector.z));
  return [
    { re: -(radius - vector.z) / denominator, im: 0 },
    { re: vector.x / denominator, im: vector.y / denominator },
  ];
}

function spinorOverlap(left, right) {
  let re = 0;
  let im = 0;
  for (let index = 0; index < left.length; index += 1) {
    re += left[index].re * right[index].re + left[index].im * right[index].im;
    im += left[index].re * right[index].im - left[index].im * right[index].re;
  }
  return { re, im };
}

export function wrapAngle(angle) {
  finite(angle, 'angle');
  return ((angle + Math.PI) % TAU + TAU) % TAU - Math.PI;
}

export function twoBandState(theta, phi, radius = 1, d0 = 0) {
  finite(theta, 'theta');
  finite(phi, 'phi');
  finite(radius, 'radius');
  finite(d0, 'd0');
  if (radius < 0) throw new RangeError('radius must be non-negative');

  const s = Math.sin(theta);
  const unit = {
    x: s * Math.cos(phi),
    y: s * Math.sin(phi),
    z: Math.cos(theta),
  };
  const vector = {
    x: radius * unit.x,
    y: radius * unit.y,
    z: radius * unit.z,
  };
  return {
    unit: radius === 0 ? null : unit,
    vector,
    lower: d0 - radius,
    upper: d0 + radius,
    gap: 2 * radius,
    closed: radius === 0,
  };
}

export function twoSiteSpectrum(k, t1, t2, delta = 0, d0 = 0) {
  [k, t1, t2, delta, d0].forEach((value, index) => finite(value, ['k', 't1', 't2', 'delta', 'd0'][index]));
  const dx = t1 + t2 * Math.cos(k);
  const dy = t2 * Math.sin(k);
  const radius = Math.hypot(dx, dy, delta);
  return {
    dx,
    dy,
    dz: delta,
    lower: d0 - radius,
    upper: d0 + radius,
    gap: 2 * radius,
  };
}

export function analyticTwoSiteGap(t1, t2, delta = 0) {
  [t1, t2, delta].forEach((value, index) => finite(value, ['t1', 't2', 'delta'][index]));
  return 2 * Math.hypot(Math.abs(t1) - Math.abs(t2), delta);
}

export function sampledTwoSiteGap(t1, t2, delta = 0, samples = 2001) {
  if (!Number.isInteger(samples) || samples < 3) throw new RangeError('samples must be an integer >= 3');
  let minimum = Infinity;
  let kAtMinimum = 0;
  for (let index = 0; index < samples; index += 1) {
    const k = -Math.PI + (TAU * index) / (samples - 1);
    const gap = twoSiteSpectrum(k, t1, t2, delta).gap;
    if (gap < minimum) {
      minimum = gap;
      kAtMinimum = k;
    }
  }
  return { gap: minimum, k: kAtMinimum };
}

export function sshWinding(t1, t2, tolerance = 1e-12) {
  [t1, t2, tolerance].forEach((value, index) => finite(value, ['t1', 't2', 'tolerance'][index]));
  if (tolerance < 0) throw new RangeError('tolerance must be non-negative');
  const difference = Math.abs(t2) - Math.abs(t1);
  if (Math.abs(difference) <= tolerance) {
    return { winding: null, berryPhase: null, gapClosed: true };
  }
  const winding = difference > 0 ? 1 : 0;
  return {
    winding,
    berryPhase: winding === 1 ? Math.PI : 0,
    gapClosed: false,
  };
}

export function sshEdgeProfile(t1, t2, cells = 12) {
  [t1, t2].forEach((value, index) => finite(value, ['t1', 't2'][index]));
  if (!Number.isInteger(cells) || cells < 1) throw new RangeError('cells must be a positive integer');
  if (t2 === 0) {
    return { normalizable: false, ratio: null, localizationLength: Infinity, amplitudes: [] };
  }

  const ratio = -t1 / t2;
  const magnitude = Math.abs(ratio);
  const normalizable = magnitude < 1;
  const amplitudes = Array.from({ length: cells }, (_, index) => ratio ** index);
  const norm = Math.sqrt(amplitudes.reduce((sum, value) => sum + value * value, 0));
  const normalized = norm === 0 ? amplitudes : amplitudes.map((value) => value / norm);
  const localizationLength = magnitude === 0 ? 0 : magnitude === 1 ? Infinity : 1 / Math.abs(Math.log(magnitude));

  return {
    normalizable,
    ratio,
    localizationLength,
    amplitudes: normalized,
  };
}

export function pumpVector(k, lambda, center = 1, radius = 0.65, v = 1, w = 1) {
  [k, lambda, center, radius, v, w].forEach((value, index) => finite(value, ['k', 'lambda', 'center', 'radius', 'v', 'w'][index]));
  if (radius < 0) throw new RangeError('radius must be non-negative');
  return {
    x: center + radius * Math.cos(lambda) + v * Math.cos(k),
    y: w * Math.sin(k),
    z: radius * Math.sin(lambda),
  };
}

export function pumpCriticalDistance(center = 1, radius = 0.65, v = 1) {
  [center, radius, v].forEach((value, index) => finite(value, ['center', 'radius', 'v'][index]));
  if (radius < 0) throw new RangeError('radius must be non-negative');
  return Math.min(
    Math.abs(Math.abs(center - v) - radius),
    Math.abs(Math.abs(center + v) - radius),
  );
}

export function samplePumpTopology(center = 1, radius = 0.65, v = 1, w = 1, mesh = 31) {
  [center, radius, v, w].forEach((value, index) => finite(value, ['center', 'radius', 'v', 'w'][index]));
  if (!Number.isInteger(mesh) || mesh < 5) throw new RangeError('mesh must be an integer >= 5');
  if (pumpCriticalDistance(center, radius, v) < 1e-12) {
    return { gapClosed: true, minimumGap: 0, mappingDegree: null, lowerBandChern: null, residual: null };
  }

  let totalSolidAngle = 0;
  let minimumRadius = Infinity;
  for (let i = 0; i < mesh; i += 1) {
    const k0 = (TAU * i) / mesh;
    const k1 = (TAU * ((i + 1) % mesh)) / mesh;
    for (let j = 0; j < mesh; j += 1) {
      const lambda0 = (TAU * j) / mesh;
      const lambda1 = (TAU * ((j + 1) % mesh)) / mesh;
      const raw = [
        pumpVector(k0, lambda0, center, radius, v, w),
        pumpVector(k1, lambda0, center, radius, v, w),
        pumpVector(k1, lambda1, center, radius, v, w),
        pumpVector(k0, lambda1, center, radius, v, w),
      ];
      raw.forEach((vector) => {
        minimumRadius = Math.min(minimumRadius, Math.hypot(vector.x, vector.y, vector.z));
      });
      const unit = raw.map(normalize);
      if (unit.some((vector) => vector === null)) {
        return { gapClosed: true, minimumGap: 0, mappingDegree: null, lowerBandChern: null, residual: null };
      }
      totalSolidAngle += solidAngle(unit[0], unit[1], unit[2]) + solidAngle(unit[0], unit[2], unit[3]);
    }
  }

  const mappingDegreeRaw = totalSolidAngle / (4 * Math.PI);
  const mappingDegree = Math.round(mappingDegreeRaw);
  return {
    gapClosed: false,
    minimumGap: 2 * minimumRadius,
    mappingDegree,
    lowerBandChern: -mappingDegree,
    residual: mappingDegreeRaw - mappingDegree,
  };
}

export function pumpBerryPhase(lambda, center = 1, radius = 0.65, v = 1, w = 1, samples = 181) {
  [lambda, center, radius, v, w].forEach((value, index) => finite(value, ['lambda', 'center', 'radius', 'v', 'w'][index]));
  if (!Number.isInteger(samples) || samples < 5) throw new RangeError('samples must be an integer >= 5');

  const spinors = Array.from({ length: samples }, (_, index) => {
    const k = (TAU * index) / samples;
    return lowerBandSpinor(pumpVector(k, lambda, center, radius, v, w));
  });

  let product = { re: 1, im: 0 };
  for (let index = 0; index < samples; index += 1) {
    const overlap = spinorOverlap(spinors[index], spinors[(index + 1) % samples]);
    const magnitude = Math.hypot(overlap.re, overlap.im);
    if (magnitude < 1e-14) throw new RangeError('adjacent lower-band states became numerically orthogonal');
    product = multiplyComplex(product, { re: overlap.re / magnitude, im: overlap.im / magnitude });
  }
  return wrapAngle(-Math.atan2(product.im, product.re));
}

export function pumpWannierFlow(center = 1, radius = 0.65, v = 1, w = 1, lambdaSamples = 65, kSamples = 181) {
  [center, radius, v, w].forEach((value, index) => finite(value, ['center', 'radius', 'v', 'w'][index]));
  if (!Number.isInteger(lambdaSamples) || lambdaSamples < 3) throw new RangeError('lambdaSamples must be an integer >= 3');
  if (pumpCriticalDistance(center, radius, v) < 1e-12) throw new RangeError('Wannier flow is undefined when the pump cycle crosses a gap closing');

  const wrapped = Array.from({ length: lambdaSamples }, (_, index) => {
    const lambda = (TAU * index) / (lambdaSamples - 1);
    return pumpBerryPhase(lambda, center, radius, v, w, kSamples);
  });
  const unwrapped = [wrapped[0]];
  for (let index = 1; index < wrapped.length; index += 1) {
    let value = wrapped[index];
    const previous = unwrapped[index - 1];
    while (value - previous > Math.PI) value -= TAU;
    while (value - previous < -Math.PI) value += TAU;
    unwrapped.push(value);
  }

  const centers = unwrapped.map((phase) => phase / TAU);
  return {
    wrapped,
    unwrapped,
    centers,
    netShift: centers.at(-1) - centers[0],
  };
}
