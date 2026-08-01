const TWO_PI = 2 * Math.PI;
const FOUR_PI = 4 * Math.PI;

const finite = (value, label) => {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite`);
  return value;
};

const positive = (value, label) => {
  finite(value, label);
  if (!(value > 0)) throw new RangeError(`${label} must be positive`);
  return value;
};

const integerInRange = (value, label, min, max) => {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${label} must be an integer in [${min}, ${max}]`);
  }
  return value;
};

const factorial = (value) => {
  integerInRange(value, 'factorial argument', 0, 170);
  let result = 1;
  for (let n = 2; n <= value; n += 1) result *= n;
  return result;
};

const oddDoubleFactorial = (l) => {
  integerInRange(l, 'l', 0, 40);
  let result = 1;
  for (let n = 1; n <= l; n += 1) result *= 2 * n + 1;
  return result;
};

const complex = (re = 0, im = 0) => ({ re, im });
const complexMagnitudeSquared = (value) => value.re ** 2 + value.im ** 2;
const expI = (angle) => complex(Math.cos(angle), Math.sin(angle));

export const usefulRelationsDefaults = Object.freeze({
  radial: Object.freeze({ l: 2, xMin: 0.15, xMax: 12, points: 260 }),
  harmonic: Object.freeze({ l: 3, m: 2, phi: 0.7, points: 241 }),
  coupling: Object.freeze({ l1: 2, m1: 0, l2: 2, m2: 0, l3: 2, m3: 0 }),
  chebyshev: Object.freeze({ order: 10, intervalMin: -1, intervalMax: 1, points: 241 }),
});

export function sphericalBesselJ(l, x) {
  integerInRange(l, 'l', 0, 40);
  finite(x, 'x');
  const ax = Math.abs(x);
  if (ax < 1e-10) {
    if (l === 0) return 1;
    return x ** l / oddDoubleFactorial(l);
  }
  if (l > ax + 4) {
    const leading = x ** l / oddDoubleFactorial(l);
    let sum = leading;
    let term = leading;
    for (let p = 1; p <= 120; p += 1) {
      term *= -(x ** 2) / (2 * p * (2 * l + 2 * p + 1));
      sum += term;
      if (Math.abs(term) <= Math.max(1, Math.abs(sum)) * Number.EPSILON * 4) break;
    }
    return sum;
  }
  const j0 = Math.sin(x) / x;
  if (l === 0) return j0;
  const j1 = Math.sin(x) / x ** 2 - Math.cos(x) / x;
  if (l === 1) return j1;
  let previous = j0;
  let current = j1;
  for (let n = 1; n < l; n += 1) {
    const next = ((2 * n + 1) / x) * current - previous;
    previous = current;
    current = next;
  }
  return current;
}

export function sphericalNeumannN(l, x) {
  integerInRange(l, 'l', 0, 40);
  finite(x, 'x');
  if (Math.abs(x) < 1e-10) throw new RangeError('spherical Neumann functions are singular at x=0');
  const n0 = -Math.cos(x) / x;
  if (l === 0) return n0;
  const n1 = -Math.cos(x) / x ** 2 - Math.sin(x) / x;
  if (l === 1) return n1;
  let previous = n0;
  let current = n1;
  for (let n = 1; n < l; n += 1) {
    const next = ((2 * n + 1) / x) * current - previous;
    previous = current;
    current = next;
  }
  return current;
}

export function sphericalDerivative(kind, l, x) {
  integerInRange(l, 'l', 0, 40);
  if (Math.abs(finite(x, 'x')) < 1e-10) throw new RangeError('derivative recurrence requires nonzero x');
  const fn = kind === 'j' ? sphericalBesselJ : kind === 'n' ? sphericalNeumannN : null;
  if (!fn) throw new RangeError("kind must be 'j' or 'n'");
  if (l === 0) return -fn(1, x);
  return fn(l - 1, x) - ((l + 1) / x) * fn(l, x);
}

export function sphericalHankel(l, x, kind = 1) {
  if (kind !== 1 && kind !== 2) throw new RangeError('Hankel kind must be 1 or 2');
  const j = sphericalBesselJ(l, x);
  const n = sphericalNeumannN(l, x);
  return complex(j, kind === 1 ? n : -n);
}

export function radialFunctionProfile({
  l = usefulRelationsDefaults.radial.l,
  xMin = usefulRelationsDefaults.radial.xMin,
  xMax = usefulRelationsDefaults.radial.xMax,
  points = usefulRelationsDefaults.radial.points,
} = {}) {
  integerInRange(l, 'l', 0, 12);
  positive(xMin, 'xMin');
  positive(xMax, 'xMax');
  if (!(xMax > xMin)) throw new RangeError('xMax must exceed xMin');
  integerInRange(points, 'points', 60, 2000);
  const samples = Array.from({ length: points }, (_, index) => {
    const x = xMin + (xMax - xMin) * index / (points - 1);
    const j = sphericalBesselJ(l, x);
    const n = sphericalNeumannN(l, x);
    return { x, j, n, hankelMagnitude: Math.sqrt(j ** 2 + n ** 2) };
  });
  return {
    l,
    samples,
    originPowerEstimate: xMin ** l / oddDoubleFactorial(l),
    wronskianAtMidpoint: (() => {
      const x = 0.5 * (xMin + xMax);
      return sphericalBesselJ(l, x) * sphericalDerivative('n', l, x)
        - sphericalDerivative('j', l, x) * sphericalNeumannN(l, x);
    })(),
    boundary: 'The real-axis teaching profile excludes x=0 for n_l. Imaginary-argument bound-state continuations require modified spherical functions or a declared analytic continuation.',
  };
}

export function legendreP(l, x) {
  integerInRange(l, 'l', 0, 40);
  finite(x, 'x');
  if (x < -1 - 1e-12 || x > 1 + 1e-12) throw new RangeError('Legendre argument must lie in [-1,1]');
  const value = Math.max(-1, Math.min(1, x));
  if (l === 0) return 1;
  if (l === 1) return value;
  let previous = 1;
  let current = value;
  for (let n = 1; n < l; n += 1) {
    const next = ((2 * n + 1) * value * current - n * previous) / (n + 1);
    previous = current;
    current = next;
  }
  return current;
}

export function associatedLegendre(l, m, x) {
  integerInRange(l, 'l', 0, 20);
  if (!Number.isInteger(m) || Math.abs(m) > l) throw new RangeError('|m| must not exceed l');
  finite(x, 'x');
  if (x < -1 - 1e-12 || x > 1 + 1e-12) throw new RangeError('associated-Legendre argument must lie in [-1,1]');
  const value = Math.max(-1, Math.min(1, x));
  const absM = Math.abs(m);
  let pmm = 1;
  if (absM > 0) {
    const root = Math.sqrt(Math.max(0, 1 - value ** 2));
    let factor = 1;
    for (let n = 1; n <= absM; n += 1) {
      pmm *= -factor * root; // Condon-Shortley (-1)^m included.
      factor += 2;
    }
  }
  let result;
  if (l === absM) result = pmm;
  else {
    let pmmp1 = value * (2 * absM + 1) * pmm;
    if (l === absM + 1) result = pmmp1;
    else {
      let previous = pmm;
      let current = pmmp1;
      for (let degree = absM + 2; degree <= l; degree += 1) {
        const next = ((2 * degree - 1) * value * current - (degree + absM - 1) * previous) / (degree - absM);
        previous = current;
        current = next;
      }
      result = current;
    }
  }
  if (m < 0) {
    result *= (-1) ** absM * factorial(l - absM) / factorial(l + absM);
  }
  return result;
}

export function sphericalHarmonic(l, m, theta, phi) {
  integerInRange(l, 'l', 0, 20);
  if (!Number.isInteger(m) || Math.abs(m) > l) throw new RangeError('|m| must not exceed l');
  finite(theta, 'theta');
  finite(phi, 'phi');
  const absM = Math.abs(m);
  const normalization = Math.sqrt((2 * l + 1) * factorial(l - absM) / (FOUR_PI * factorial(l + absM)));
  if (m >= 0) {
    const amplitude = normalization * associatedLegendre(l, m, Math.cos(theta));
    const phase = expI(m * phi);
    return complex(amplitude * phase.re, amplitude * phase.im);
  }
  const positiveM = sphericalHarmonic(l, absM, theta, phi);
  const sign = (-1) ** absM;
  return complex(sign * positiveM.re, -sign * positiveM.im);
}

/** Martin K.11 source convention for m>0: sqrt(2) Re/Im Y_lm. */
export function sourceRealSphericalHarmonic(l, m, theta, phi, channel = 'cos') {
  integerInRange(l, 'l', 0, 20);
  integerInRange(m, 'm', 0, l);
  if (m === 0) return sphericalHarmonic(l, 0, theta, phi).re;
  const y = sphericalHarmonic(l, m, theta, phi);
  if (channel === 'cos') return Math.SQRT2 * y.re;
  if (channel === 'sin') return Math.SQRT2 * y.im;
  throw new RangeError("channel must be 'cos' or 'sin'");
}

export function harmonicProfile({
  l = usefulRelationsDefaults.harmonic.l,
  m = usefulRelationsDefaults.harmonic.m,
  phi = usefulRelationsDefaults.harmonic.phi,
  points = usefulRelationsDefaults.harmonic.points,
} = {}) {
  integerInRange(l, 'l', 0, 8);
  integerInRange(m, 'm', 0, l);
  finite(phi, 'phi');
  integerInRange(points, 'points', 61, 1001);
  const samples = Array.from({ length: points }, (_, index) => {
    const theta = Math.PI * index / (points - 1);
    const y = sphericalHarmonic(l, m, theta, phi);
    return {
      theta,
      associated: associatedLegendre(l, m, Math.cos(theta)),
      real: y.re,
      imaginary: y.im,
      cosineRealBasis: sourceRealSphericalHarmonic(l, m, theta, phi, 'cos'),
      sineRealBasis: sourceRealSphericalHarmonic(l, m, theta, phi, 'sin'),
      density: complexMagnitudeSquared(y),
    };
  });
  return {
    l,
    m,
    phi,
    samples,
    conjugationCheck: (() => {
      const theta = 1.1;
      const positiveM = sphericalHarmonic(l, m, theta, phi);
      const negativeM = sphericalHarmonic(l, -m, theta, phi);
      return complex(negativeM.re - (-1) ** m * positiveM.re, negativeM.im + (-1) ** m * positiveM.im);
    })(),
    boundary: 'The real basis follows Martin K.11 for m>0. Other electronic-structure codes may reorder channels or attach additional (-1)^m signs; compare transformation matrices, not labels alone.',
  };
}

const triangleAllowed = (j1, j2, j3) => (
  Math.abs(j1 - j2) <= j3 && j3 <= j1 + j2
);

/** Integer-angular-momentum subset of the Wigner 3j symbol. */
export function wigner3j(j1, j2, j3, m1, m2, m3) {
  for (const [value, label] of [[j1, 'j1'], [j2, 'j2'], [j3, 'j3']]) integerInRange(value, label, 0, 12);
  for (const [m, j, label] of [[m1, j1, 'm1'], [m2, j2, 'm2'], [m3, j3, 'm3']]) {
    if (!Number.isInteger(m) || Math.abs(m) > j) throw new RangeError(`${label} must be an integer with |m|<=j`);
  }
  if (m1 + m2 + m3 !== 0 || !triangleAllowed(j1, j2, j3)) return 0;
  const delta = factorial(j1 + j2 - j3) * factorial(j1 - j2 + j3) * factorial(-j1 + j2 + j3)
    / factorial(j1 + j2 + j3 + 1);
  const norm = Math.sqrt(
    delta
    * factorial(j1 + m1) * factorial(j1 - m1)
    * factorial(j2 + m2) * factorial(j2 - m2)
    * factorial(j3 + m3) * factorial(j3 - m3),
  );
  const zMin = Math.max(0, j2 - j3 - m1, j1 - j3 + m2);
  const zMax = Math.min(j1 + j2 - j3, j1 - m1, j2 + m2);
  let sum = 0;
  for (let z = zMin; z <= zMax; z += 1) {
    const denominator = factorial(z)
      * factorial(j1 + j2 - j3 - z)
      * factorial(j1 - m1 - z)
      * factorial(j2 + m2 - z)
      * factorial(j3 - j2 + m1 + z)
      * factorial(j3 - j1 - m2 + z);
    sum += (-1) ** z / denominator;
  }
  return (-1) ** (j1 - j2 - m3) * norm * sum;
}

export function clebschGordan(j1, m1, j2, m2, j3, m3) {
  if (m1 + m2 !== m3) return 0;
  return (-1) ** (j1 - j2 + m3) * Math.sqrt(2 * j3 + 1)
    * wigner3j(j1, j2, j3, m1, m2, -m3);
}

export function gauntCoefficient(l1, m1, l2, m2, l3, m3) {
  const prefactor = Math.sqrt((2 * l1 + 1) * (2 * l2 + 1) * (2 * l3 + 1) / FOUR_PI);
  return prefactor
    * wigner3j(l1, l2, l3, 0, 0, 0)
    * wigner3j(l1, l2, l3, m1, m2, m3);
}

export function angularCouplingAudit({
  l1 = usefulRelationsDefaults.coupling.l1,
  m1 = usefulRelationsDefaults.coupling.m1,
  l2 = usefulRelationsDefaults.coupling.l2,
  m2 = usefulRelationsDefaults.coupling.m2,
  l3 = usefulRelationsDefaults.coupling.l3,
  m3 = usefulRelationsDefaults.coupling.m3,
} = {}) {
  const gaunt = gauntCoefficient(l1, m1, l2, m2, l3, m3);
  return {
    l1, m1, l2, m2, l3, m3,
    gaunt,
    triangleAllowed: triangleAllowed(l1, l2, l3),
    magneticAllowed: m1 + m2 + m3 === 0,
    parityAllowed: (l1 + l2 + l3) % 2 === 0,
    clebsch: clebschGordan(l1, m1, l2, m2, l3, m1 + m2),
    boundary: 'The deterministic kernel implements nonnegative integer j only. Half-integer spin coupling needs a doubled-integer or gamma-function implementation and is outside this finite Gaunt-focused kernel.',
  };
}

export function chebyshevT(order, x) {
  integerInRange(order, 'order', 0, 200);
  finite(x, 'x');
  if (order === 0) return 1;
  if (order === 1) return x;
  let previous = 1;
  let current = x;
  for (let n = 1; n < order; n += 1) {
    const next = 2 * x * current - previous;
    previous = current;
    current = next;
  }
  return current;
}

export function mapToChebyshevInterval(value, intervalMin, intervalMax) {
  finite(value, 'value');
  finite(intervalMin, 'intervalMin');
  finite(intervalMax, 'intervalMax');
  if (!(intervalMax > intervalMin)) throw new RangeError('intervalMax must exceed intervalMin');
  return (2 * value - intervalMin - intervalMax) / (intervalMax - intervalMin);
}

export function chebyshevCoefficients(fn, order, sampleCount = null) {
  if (typeof fn !== 'function') throw new TypeError('fn must be callable');
  integerInRange(order, 'order', 0, 80);
  const count = sampleCount == null ? Math.max(64, 4 * (order + 1)) : integerInRange(sampleCount, 'sampleCount', order + 1, 2000);
  return Array.from({ length: order + 1 }, (_, n) => {
    let sum = 0;
    for (let k = 0; k < count; k += 1) {
      const theta = Math.PI * (k + 0.5) / count;
      sum += finite(fn(Math.cos(theta)), 'function sample') * Math.cos(n * theta);
    }
    return 2 * sum / count;
  });
}

export function evaluateChebyshev(coefficients, x) {
  if (!Array.isArray(coefficients) || coefficients.length === 0) throw new TypeError('coefficients must be a nonempty array');
  finite(x, 'x');
  let bNext = 0;
  let bNextNext = 0;
  for (let n = coefficients.length - 1; n >= 1; n -= 1) {
    const bCurrent = 2 * x * bNext - bNextNext + finite(coefficients[n], `coefficient ${n}`);
    bNextNext = bNext;
    bNext = bCurrent;
  }
  return 0.5 * finite(coefficients[0], 'coefficient 0') + x * bNext - bNextNext;
}

const factorialDenominator = (order) => factorial(order);
const taylorExp = (x, order) => {
  let sum = 0;
  for (let n = 0; n <= order; n += 1) sum += x ** n / factorialDenominator(n);
  return sum;
};

export function chebyshevApproximationProfile({
  order = usefulRelationsDefaults.chebyshev.order,
  intervalMin = usefulRelationsDefaults.chebyshev.intervalMin,
  intervalMax = usefulRelationsDefaults.chebyshev.intervalMax,
  points = usefulRelationsDefaults.chebyshev.points,
  functionName = 'exp',
} = {}) {
  integerInRange(order, 'order', 0, 30);
  finite(intervalMin, 'intervalMin');
  finite(intervalMax, 'intervalMax');
  if (!(intervalMax > intervalMin)) throw new RangeError('intervalMax must exceed intervalMin');
  integerInRange(points, 'points', 61, 2001);
  const target = functionName === 'exp'
    ? (value) => Math.exp(value)
    : functionName === 'runge'
      ? (value) => 1 / (1 + 25 * value ** 2)
      : null;
  if (!target) throw new RangeError("functionName must be 'exp' or 'runge'");
  const mappedFunction = (x) => {
    const value = 0.5 * ((intervalMax - intervalMin) * x + intervalMax + intervalMin);
    return target(value);
  };
  const coefficients = chebyshevCoefficients(mappedFunction, order);
  const samples = Array.from({ length: points }, (_, index) => {
    const value = intervalMin + (intervalMax - intervalMin) * index / (points - 1);
    const mapped = mapToChebyshevInterval(value, intervalMin, intervalMax);
    const exact = target(value);
    const chebyshev = evaluateChebyshev(coefficients, mapped);
    const taylor = functionName === 'exp' ? taylorExp(value, order) : Number.NaN;
    return { value, mapped, exact, chebyshev, taylor, chebyshevError: chebyshev - exact, taylorError: taylor - exact };
  });
  return {
    order,
    intervalMin,
    intervalMax,
    functionName,
    coefficients,
    samples,
    maxChebyshevError: Math.max(...samples.map((entry) => Math.abs(entry.chebyshevError))),
    maxTaylorError: functionName === 'exp' ? Math.max(...samples.map((entry) => Math.abs(entry.taylorError))) : null,
    boundary: 'The target interval must be mapped to [-1,1]. Polynomial convergence depends on function regularity and spectral bounds; the teaching error is not a production time-propagation or matrix-function guarantee.',
  };
}

export const usefulRelationsConstants = Object.freeze({ TWO_PI, FOUR_PI });
