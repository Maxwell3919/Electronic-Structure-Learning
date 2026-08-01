const TAU = 2 * Math.PI;

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

const oddDoubleFactorial = (l) => {
  let value = 1;
  for (let n = 1; n <= l; n += 1) value *= 2 * n + 1;
  return value;
};

const complex = (re = 0, im = 0) => ({ re, im });
const add = (a, b) => complex(a.re + b.re, a.im + b.im);
const multiply = (a, b) => complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const scale = (a, value) => complex(a.re * value, a.im * value);
const magnitudeSquared = (a) => a.re ** 2 + a.im ** 2;
const expI = (angle) => complex(Math.cos(angle), Math.sin(angle));

export const scatteringDefaults = Object.freeze({
  expansion: Object.freeze({ kr: 5.2, theta: 0.8, lMax: 8 }),
  matching: Object.freeze({ l: 1, k: 1.15, radius: 1.5, wellDepth: 2.4 }),
  crossSection: Object.freeze({ k: 1.2, radius: 1.4, lMax: 6, points: 181 }),
  boundState: Object.freeze({ radius: 1.5, wellDepth: 2.8, samples: 700 }),
});

export function wrapPhaseModuloPi(value) {
  finite(value, 'phase');
  let wrapped = value % Math.PI;
  if (wrapped <= -Math.PI / 2) wrapped += Math.PI;
  if (wrapped > Math.PI / 2) wrapped -= Math.PI;
  return wrapped;
}

export function sphericalBesselJ(l, x) {
  integerInRange(l, 'l', 0, 20);
  finite(x, 'x');
  const ax = Math.abs(x);
  if (ax < 1e-8) {
    if (l === 0) return 1 - x ** 2 / 6;
    if (l === 1) return x / 3;
    return x ** l / oddDoubleFactorial(l);
  }
  const j0 = Math.sin(x) / x;
  if (l === 0) return j0;
  const j1 = Math.sin(x) / x ** 2 - Math.cos(x) / x;
  if (l === 1) return j1;

  // Upward recursion follows the physical solution when l is not far above |x|.
  if (l <= ax + 4) {
    let previous = j0;
    let current = j1;
    for (let n = 1; n < l; n += 1) {
      const next = ((2 * n + 1) / x) * current - previous;
      previous = current;
      current = next;
    }
    return current;
  }

  // For l >> |x|, upward recursion amplifies the complementary solution.
  // Use the convergent power series instead:
  // j_l(x)=x^l/(2l+1)!! * sum_m (-x^2)^m/[2^m m! product_s(2l+2s+1)].
  let term = 1;
  let sum = 1;
  for (let m = 1; m <= 100; m += 1) {
    term *= -x ** 2 / (2 * m * (2 * l + 2 * m + 1));
    sum += term;
    if (Math.abs(term) < Math.max(1, Math.abs(sum)) * 1e-16) break;
  }
  return (x ** l / oddDoubleFactorial(l)) * sum;
}

export function sphericalNeumannN(l, x) {
  integerInRange(l, 'l', 0, 20);
  finite(x, 'x');
  if (Math.abs(x) < 1e-8) throw new RangeError('spherical Neumann functions are singular at x=0');
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
  integerInRange(l, 'l', 0, 20);
  positive(Math.abs(x), '|x|');
  const fn = kind === 'j' ? sphericalBesselJ : kind === 'n' ? sphericalNeumannN : null;
  if (!fn) throw new RangeError("kind must be 'j' or 'n'");
  if (l === 0) return -fn(1, x);
  return fn(l - 1, x) - ((l + 1) / x) * fn(l, x);
}

export function legendreP(l, value) {
  integerInRange(l, 'l', 0, 40);
  finite(value, 'value');
  if (value < -1 - 1e-12 || value > 1 + 1e-12) throw new RangeError('Legendre argument must lie in [-1,1]');
  const x = Math.max(-1, Math.min(1, value));
  if (l === 0) return 1;
  if (l === 1) return x;
  let previous = 1;
  let current = x;
  for (let n = 1; n < l; n += 1) {
    const next = ((2 * n + 1) * x * current - n * previous) / (n + 1);
    previous = current;
    current = next;
  }
  return current;
}

export function planeWavePartialExpansion({
  kr = scatteringDefaults.expansion.kr,
  theta = scatteringDefaults.expansion.theta,
  lMax = scatteringDefaults.expansion.lMax,
} = {}) {
  finite(kr, 'kr');
  finite(theta, 'theta');
  integerInRange(lMax, 'lMax', 0, 20);
  const cosine = Math.cos(theta);
  let partial = complex();
  const terms = [];
  for (let l = 0; l <= lMax; l += 1) {
    const phase = expI(l * Math.PI / 2);
    const coefficient = (2 * l + 1) * sphericalBesselJ(l, kr) * legendreP(l, cosine);
    const term = scale(phase, coefficient);
    partial = add(partial, term);
    terms.push({ l, coefficient, term, cumulative: { ...partial } });
  }
  const exact = expI(kr * cosine);
  const difference = complex(partial.re - exact.re, partial.im - exact.im);
  return {
    kr,
    theta,
    lMax,
    exact,
    partial,
    terms,
    absoluteError: Math.sqrt(magnitudeSquared(difference)),
    boundary: 'Convergence is pointwise in kr and theta; larger kr requires larger lMax. The identity uses a consistent i^l spherical-harmonic convention.',
  };
}

export function phaseShiftFromLogDerivative({ l, k, radius, logDerivative }) {
  integerInRange(l, 'l', 0, 20);
  positive(k, 'k');
  positive(radius, 'radius');
  finite(logDerivative, 'logDerivative');
  const x = k * radius;
  const j = sphericalBesselJ(l, x);
  const n = sphericalNeumannN(l, x);
  const xJPrime = x * sphericalDerivative('j', l, x);
  const xNPrime = x * sphericalDerivative('n', l, x);
  const numerator = xJPrime - logDerivative * j;
  const denominator = xNPrime - logDerivative * n;
  if (Math.hypot(numerator, denominator) < 1e-14) {
    throw new RangeError('matching equation is indeterminate at this parameter set');
  }
  const rawPhase = Math.atan2(numerator, denominator);
  const phase = wrapPhaseModuloPi(rawPhase);
  return {
    l,
    k,
    radius,
    logDerivative,
    numerator,
    denominator,
    rawPhase,
    phase,
    tanPhase: numerator / denominator,
    sMatrix: expI(2 * phase),
    invariantSinSquared: Math.sin(phase) ** 2,
  };
}

export function squareWellPhaseShift({
  l = scatteringDefaults.matching.l,
  k = scatteringDefaults.matching.k,
  radius = scatteringDefaults.matching.radius,
  wellDepth = scatteringDefaults.matching.wellDepth,
  radialPoints = 220,
} = {}) {
  integerInRange(l, 'l', 0, 8);
  positive(k, 'k');
  positive(radius, 'radius');
  positive(wellDepth, 'wellDepth');
  integerInRange(radialPoints, 'radialPoints', 40, 2000);

  // Hartree atomic units: H=-1/2 nabla^2+V and E=k^2/2.
  const q = Math.sqrt(k ** 2 + 2 * wellDepth);
  const innerX = q * radius;
  const innerValueAtBoundary = sphericalBesselJ(l, innerX);
  if (Math.abs(innerValueAtBoundary) < 1e-10) {
    throw new RangeError('inner logarithmic derivative is singular at a square-well node');
  }
  const logDerivative = innerX * sphericalDerivative('j', l, innerX) / innerValueAtBoundary;
  const matching = phaseShiftFromLogDerivative({ l, k, radius, logDerivative });
  const phase = matching.phase;
  const exteriorAtBoundary = sphericalBesselJ(l, k * radius) - Math.tan(phase) * sphericalNeumannN(l, k * radius);
  if (Math.abs(exteriorAtBoundary) < 1e-12) throw new RangeError('exterior normalization is singular');
  const exteriorScale = innerValueAtBoundary / exteriorAtBoundary;
  const maxRadius = 3.2 * radius;
  const grid = Array.from({ length: radialPoints }, (_, index) => maxRadius * index / (radialPoints - 1));
  const inner = grid.map((r) => (r <= radius ? sphericalBesselJ(l, q * r) : null));
  const exterior = grid.map((r) => (
    r >= radius
      ? exteriorScale * (sphericalBesselJ(l, k * r) - Math.tan(phase) * sphericalNeumannN(l, k * r))
      : null
  ));
  const exteriorDerivativeAtBoundary = exteriorScale * k * (
    sphericalDerivative('j', l, k * radius) - Math.tan(phase) * sphericalDerivative('n', l, k * radius)
  );
  const innerDerivativeAtBoundary = q * sphericalDerivative('j', l, q * radius);

  return {
    ...matching,
    energy: 0.5 * k ** 2,
    q,
    wellDepth,
    grid,
    inner,
    exterior,
    innerValueAtBoundary,
    exteriorValueAtBoundary: exteriorScale * exteriorAtBoundary,
    innerDerivativeAtBoundary,
    exteriorDerivativeAtBoundary,
    valueMismatch: exteriorScale * exteriorAtBoundary - innerValueAtBoundary,
    derivativeMismatch: exteriorDerivativeAtBoundary - innerDerivativeAtBoundary,
    boundary: 'Finite spherical square well in Hartree atomic units. The matching radius is the potential edge; the model is single-channel, elastic, nonrelativistic, and spherical.',
  };
}

export function hardSpherePhaseShifts({ k, radius, lMax }) {
  positive(k, 'k');
  positive(radius, 'radius');
  integerInRange(lMax, 'lMax', 0, 20);
  const x = k * radius;
  return Array.from({ length: lMax + 1 }, (_, l) => {
    const j = sphericalBesselJ(l, x);
    const n = sphericalNeumannN(l, x);
    const phase = wrapPhaseModuloPi(Math.atan2(j, n));
    return { l, phase, sinSquared: Math.sin(phase) ** 2, sMatrix: expI(2 * phase) };
  });
}

export function partialWaveCrossSection({
  k = scatteringDefaults.crossSection.k,
  radius = scatteringDefaults.crossSection.radius,
  lMax = scatteringDefaults.crossSection.lMax,
  points = scatteringDefaults.crossSection.points,
  phaseShifts = null,
} = {}) {
  positive(k, 'k');
  positive(radius, 'radius');
  integerInRange(lMax, 'lMax', 0, 20);
  integerInRange(points, 'points', 31, 2001);
  const phases = phaseShifts == null
    ? hardSpherePhaseShifts({ k, radius, lMax })
    : phaseShifts.map((phase, l) => ({ l, phase: wrapPhaseModuloPi(phase), sinSquared: Math.sin(phase) ** 2, sMatrix: expI(2 * phase) }));
  if (phases.length !== lMax + 1) throw new RangeError('phaseShifts length must equal lMax+1');

  const amplitudeAt = (theta) => {
    const cosine = Math.cos(theta);
    let amplitude = complex();
    for (const { l, phase } of phases) {
      const coefficient = (2 * l + 1) * Math.sin(phase) * legendreP(l, cosine) / k;
      amplitude = add(amplitude, scale(expI(phase), coefficient));
    }
    return amplitude;
  };
  const angular = Array.from({ length: points }, (_, index) => {
    const theta = Math.PI * index / (points - 1);
    const amplitude = amplitudeAt(theta);
    return { theta, amplitude, differential: magnitudeSquared(amplitude) };
  });
  const total = (4 * Math.PI / k ** 2) * phases.reduce(
    (sum, { l, sinSquared }) => sum + (2 * l + 1) * sinSquared,
    0,
  );
  const forward = amplitudeAt(0);
  const opticalTheoremTotal = 4 * Math.PI * forward.im / k;
  let transport = 0;
  for (let l = 0; l < phases.length - 1; l += 1) {
    transport += (l + 1) * Math.sin(phases[l + 1].phase - phases[l].phase) ** 2;
  }
  transport *= 4 * Math.PI / k ** 2;

  return {
    k,
    radius,
    lMax,
    phases,
    angular,
    total,
    opticalTheoremTotal,
    opticalTheoremError: opticalTheoremTotal - total,
    transport,
    unitarityError: Math.max(...phases.map(({ sMatrix }) => Math.abs(magnitudeSquared(sMatrix) - 1))),
    boundary: 'Elastic single-site spherical scattering. The total cross section is not a transport lifetime; the transport expression is supplemental and requires a density of scatterers and kinetic theory for resistivity.',
  };
}

const sWaveBoundResidual = ({ bindingEnergy, radius, wellDepth }) => {
  const binding = positive(bindingEnergy, 'bindingEnergy');
  positive(radius, 'radius');
  positive(wellDepth, 'wellDepth');
  if (!(binding < wellDepth)) throw new RangeError('bindingEnergy must be below wellDepth');
  const q = Math.sqrt(2 * (wellDepth - binding));
  const kappa = Math.sqrt(2 * binding);
  const tangent = Math.tan(q * radius);
  if (Math.abs(tangent) < 1e-12) return Number.NaN;
  return q / tangent + kappa;
};

export function squareWellBoundStates({
  radius = scatteringDefaults.boundState.radius,
  wellDepth = scatteringDefaults.boundState.wellDepth,
  samples = scatteringDefaults.boundState.samples,
} = {}) {
  positive(radius, 'radius');
  positive(wellDepth, 'wellDepth');
  integerInRange(samples, 'samples', 100, 10000);
  const thresholdDepth = Math.PI ** 2 / (8 * radius ** 2);
  const epsilon = Math.max(1e-8, wellDepth * 1e-7);
  const grid = Array.from({ length: samples }, (_, index) => epsilon + (wellDepth - 2 * epsilon) * index / (samples - 1));
  const values = grid.map((bindingEnergy) => {
    const residual = sWaveBoundResidual({ bindingEnergy, radius, wellDepth });
    return { bindingEnergy, residual };
  });
  const roots = [];
  for (let index = 0; index < values.length - 1; index += 1) {
    const left = values[index];
    const right = values[index + 1];
    if (!Number.isFinite(left.residual) || !Number.isFinite(right.residual)) continue;
    if (left.residual === 0) roots.push(left.bindingEnergy);
    if (left.residual * right.residual >= 0) continue;
    let a = left.bindingEnergy;
    let b = right.bindingEnergy;
    let fa = left.residual;
    for (let iteration = 0; iteration < 80; iteration += 1) {
      const midpoint = 0.5 * (a + b);
      const fm = sWaveBoundResidual({ bindingEnergy: midpoint, radius, wellDepth });
      if (!Number.isFinite(fm)) break;
      if (Math.abs(fm) < 1e-12 || Math.abs(b - a) < 1e-12) {
        a = midpoint;
        b = midpoint;
        break;
      }
      if (fa * fm <= 0) {
        b = midpoint;
      } else {
        a = midpoint;
        fa = fm;
      }
    }
    const root = 0.5 * (a + b);
    if (!roots.some((existing) => Math.abs(existing - root) < 1e-6)) roots.push(root);
  }
  roots.sort((a, b) => b - a);
  return {
    radius,
    wellDepth,
    thresholdDepth,
    grid: values,
    roots,
    count: roots.length,
    hasAtLeastOne: roots.length > 0,
    boundary: 's-wave finite square well only. The residual q cot(q a)+kappa=0 uses the decaying exterior reduced radial solution and excludes pole discontinuities from root bracketing.',
  };
}

export function phaseEquivalentShift(phase, branchInteger = 1) {
  finite(phase, 'phase');
  if (!Number.isInteger(branchInteger)) throw new TypeError('branchInteger must be an integer');
  const shifted = phase + branchInteger * Math.PI;
  return {
    phase,
    shifted,
    sinSquaredOriginal: Math.sin(phase) ** 2,
    sinSquaredShifted: Math.sin(shifted) ** 2,
    sMatrixOriginal: expI(2 * phase),
    sMatrixShifted: expI(2 * shifted),
  };
}

export const complexHelpers = Object.freeze({ add, multiply, scale, magnitudeSquared, expI, TAU });
