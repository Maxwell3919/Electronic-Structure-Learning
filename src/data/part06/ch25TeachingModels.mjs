const TWO_PI = 2 * Math.PI;

export const gapModel = {
  id: 'ch25-gap-closing',
  hamiltonian: 'H(k;m)=sin(k) sigma_x + [m+cos(k)] sigma_z',
  parameter: { name: 'm', min: -2.5, max: 2.5, step: 0.05, default: 1.5 },
  momentum: { min: -Math.PI, max: Math.PI, samples: 401 },
  phaseBoundaries: [-1, 1],
  boundary:
    'Original two-band teaching model. It demonstrates a gap-closing requirement inside this model; it is not a material calculation or a complete classification of Chapter 26.',
};

export const berryLoopModel = {
  id: 'ch25-berry-gauge-loop',
  state: '|u(phi)>=cos(theta/2)|0>+exp(i phi)sin(theta/2)|1>',
  theta: { min: 0, max: Math.PI, step: Math.PI / 100, default: Math.PI / 2 },
  gaugeWinding: { min: -2, max: 2, step: 1, default: 0 },
  samples: 160,
  boundary:
    'The loop is a spin-1/2 parameter-space model. It illustrates gauge covariance and phase modulo 2pi, not a Bloch band of a specific crystal.',
};

export const chernModel = {
  id: 'ch25-qwz-chern',
  hamiltonian:
    'H(k)=sin(kx) sigma_x + sin(ky) sigma_y + [m+cos(kx)+cos(ky)] sigma_z',
  mass: { min: -3, max: 3, step: 0.1, default: -1 },
  grid: { allowed: [11, 21, 31, 41, 61], default: 31 },
  orientation: '(kx,ky) with +z normal',
  expected: [
    { range: 'm < -2', chern: 0 },
    { range: '-2 < m < 0', chern: -1 },
    { range: '0 < m < 2', chern: 1 },
    { range: 'm > 2', chern: 0 },
  ],
  gapClosings: [-2, 0, 2],
  boundary:
    'Original implementation of a standard two-band lattice model. The integer is meaningful only away from gap closings and with the stated occupied-band and orientation conventions.',
};

export function analyticGap(m) {
  return 2 * Math.abs(Math.abs(m) - 1);
}

export function sampledGap(m, samples = gapModel.momentum.samples) {
  if (!Number.isInteger(samples) || samples < 3) {
    throw new RangeError('samples must be an integer >= 3');
  }
  let minimum = Number.POSITIVE_INFINITY;
  let kAtMinimum = 0;
  for (let index = 0; index < samples; index += 1) {
    const k = -Math.PI + (TWO_PI * index) / (samples - 1);
    const dx = Math.sin(k);
    const dz = m + Math.cos(k);
    const gap = 2 * Math.hypot(dx, dz);
    if (gap < minimum) {
      minimum = gap;
      kAtMinimum = k;
    }
  }
  return { gap: minimum, k: kAtMinimum };
}

export function principalPhase(value) {
  let result = ((value + Math.PI) % TWO_PI + TWO_PI) % TWO_PI - Math.PI;
  if (Math.abs(result + Math.PI) < 1e-12) result = Math.PI;
  return result;
}

export function berryPhase(theta, gaugeWinding = 0) {
  if (!Number.isFinite(theta) || theta < 0 || theta > Math.PI) {
    throw new RangeError('theta must lie in [0, pi]');
  }
  if (!Number.isInteger(gaugeWinding)) {
    throw new TypeError('gaugeWinding must be an integer');
  }
  const base = -Math.PI * (1 - Math.cos(theta));
  const gaugeShifted = base - TWO_PI * gaugeWinding;
  return {
    base,
    gaugeShifted,
    principal: principalPhase(gaugeShifted),
    invariant: { re: Math.cos(gaugeShifted), im: Math.sin(gaugeShifted) },
  };
}

function lowerBandSpinor(dx, dy, dz) {
  const radius = Math.hypot(dx, dy, dz);
  if (radius < 1e-12) {
    throw new RangeError('The occupied eigenvector is undefined at a gap closing');
  }

  let a;
  let b;
  if (radius + dz > 1e-10) {
    a = { re: -dx, im: dy };
    b = { re: radius + dz, im: 0 };
  } else {
    a = { re: dz - radius, im: 0 };
    b = { re: dx, im: dy };
  }
  const norm = Math.sqrt(a.re ** 2 + a.im ** 2 + b.re ** 2 + b.im ** 2);
  return [
    { re: a.re / norm, im: a.im / norm },
    { re: b.re / norm, im: b.im / norm },
  ];
}

function conjugateMultiply(left, right) {
  return {
    re: left.re * right.re + left.im * right.im,
    im: left.re * right.im - left.im * right.re,
  };
}

function overlap(left, right) {
  const first = conjugateMultiply(left[0], right[0]);
  const second = conjugateMultiply(left[1], right[1]);
  return { re: first.re + second.re, im: first.im + second.im };
}

function unitComplex(value) {
  const magnitude = Math.hypot(value.re, value.im);
  if (magnitude < 1e-13) {
    throw new RangeError('Adjacent states have a vanishing overlap; refine or shift the mesh');
  }
  return { re: value.re / magnitude, im: value.im / magnitude };
}

function multiply(left, right) {
  return {
    re: left.re * right.re - left.im * right.im,
    im: left.re * right.im + left.im * right.re,
  };
}

function conjugate(value) {
  return { re: value.re, im: -value.im };
}

function deterministicGauge(spinor, ix, iy, grid) {
  const phase =
    0.37 * Math.sin((TWO_PI * ix) / grid) +
    0.23 * Math.cos((TWO_PI * iy) / grid) +
    0.11 * Math.sin((TWO_PI * (ix + iy)) / grid);
  const factor = { re: Math.cos(phase), im: Math.sin(phase) };
  return spinor.map((value) => multiply(value, factor));
}

export function qwzDirectGap(m) {
  return 2 * Math.min(Math.abs(m + 2), Math.abs(m), Math.abs(m - 2));
}

export function fhsChernNumber(m, grid = chernModel.grid.default, applyGauge = false) {
  if (!Number.isInteger(grid) || grid < 5) {
    throw new RangeError('grid must be an integer >= 5');
  }
  if (qwzDirectGap(m) < 1e-10) {
    return { chern: null, raw: null, gap: 0, valid: false };
  }

  const states = Array.from({ length: grid }, () => Array(grid));
  for (let ix = 0; ix < grid; ix += 1) {
    const kx = -Math.PI + (TWO_PI * ix) / grid;
    for (let iy = 0; iy < grid; iy += 1) {
      const ky = -Math.PI + (TWO_PI * iy) / grid;
      let spinor = lowerBandSpinor(
        Math.sin(kx),
        Math.sin(ky),
        m + Math.cos(kx) + Math.cos(ky),
      );
      if (applyGauge) spinor = deterministicGauge(spinor, ix, iy, grid);
      states[ix][iy] = spinor;
    }
  }

  let flux = 0;
  for (let ix = 0; ix < grid; ix += 1) {
    const nextX = (ix + 1) % grid;
    for (let iy = 0; iy < grid; iy += 1) {
      const nextY = (iy + 1) % grid;
      const ux = unitComplex(overlap(states[ix][iy], states[nextX][iy]));
      const uyAtNextX = unitComplex(overlap(states[nextX][iy], states[nextX][nextY]));
      const uxAtNextY = unitComplex(overlap(states[ix][nextY], states[nextX][nextY]));
      const uy = unitComplex(overlap(states[ix][iy], states[ix][nextY]));
      const plaquette = multiply(multiply(ux, uyAtNextX), multiply(conjugate(uxAtNextY), conjugate(uy)));
      flux += Math.atan2(plaquette.im, plaquette.re);
    }
  }

  const raw = flux / TWO_PI;
  const rounded = Math.round(raw);
  return {
    chern: Object.is(rounded, -0) ? 0 : rounded,
    raw,
    gap: qwzDirectGap(m),
    valid: true,
  };
}
