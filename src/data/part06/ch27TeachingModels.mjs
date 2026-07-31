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

export function chernVector(kx, ky, xi = 1, V = -0.75, v = Math.SQRT1_2 / 2) {
  [kx, ky, xi, V, v].forEach((value, index) => finite(value, ['kx', 'ky', 'xi', 'V', 'v'][index]));
  return {
    x: v * Math.sin(ky),
    y: v * Math.sin(kx),
    z: xi + V * (Math.cos(kx) + Math.cos(ky)),
  };
}

export function chernSpectrum(kx, ky, xi = 1, V = -0.75, v = Math.SQRT1_2 / 2, d0 = 0) {
  finite(d0, 'd0');
  const vector = chernVector(kx, ky, xi, V, v);
  const radius = Math.hypot(vector.x, vector.y, vector.z);
  return {
    vector,
    lower: d0 - radius,
    upper: d0 + radius,
    gap: 2 * radius,
  };
}

export function chernTrimMasses(xi = 1, V = -0.75) {
  [xi, V].forEach((value, index) => finite(value, ['xi', 'V'][index]));
  return {
    gamma: xi + 2 * V,
    x: xi,
    y: xi,
    m: xi - 2 * V,
  };
}

export function chernCriticalXi(V = -0.75) {
  finite(V, 'V');
  return [2 * V, 0, -2 * V].sort((a, b) => a - b);
}

export function sampleChernModel(xi = 1, V = -0.75, v = Math.SQRT1_2 / 2, mesh = 31) {
  [xi, V, v].forEach((value, index) => finite(value, ['xi', 'V', 'v'][index]));
  if (!Number.isInteger(mesh) || mesh < 5) throw new RangeError('mesh must be an integer >= 5');
  const critical = chernCriticalXi(V).some((value) => Math.abs(xi - value) < 1e-12);
  if (critical) {
    return {
      gapClosed: true,
      minimumGap: 0,
      mappingDegree: null,
      lowerBandChern: null,
      absoluteChern: null,
      residual: null,
    };
  }

  let totalSolidAngle = 0;
  let minimumRadius = Infinity;
  for (let ix = 0; ix < mesh; ix += 1) {
    const kx0 = (TAU * ix) / mesh;
    const kx1 = (TAU * ((ix + 1) % mesh)) / mesh;
    for (let iy = 0; iy < mesh; iy += 1) {
      const ky0 = (TAU * iy) / mesh;
      const ky1 = (TAU * ((iy + 1) % mesh)) / mesh;
      const raw = [
        chernVector(kx0, ky0, xi, V, v),
        chernVector(kx1, ky0, xi, V, v),
        chernVector(kx1, ky1, xi, V, v),
        chernVector(kx0, ky1, xi, V, v),
      ];
      raw.forEach((vector) => {
        minimumRadius = Math.min(minimumRadius, Math.hypot(vector.x, vector.y, vector.z));
      });
      const unit = raw.map(normalize);
      if (unit.some((vector) => vector === null)) {
        return {
          gapClosed: true,
          minimumGap: 0,
          mappingDegree: null,
          lowerBandChern: null,
          absoluteChern: null,
          residual: null,
        };
      }
      totalSolidAngle += solidAngle(unit[0], unit[1], unit[2]) + solidAngle(unit[0], unit[2], unit[3]);
    }
  }

  const rawDegree = totalSolidAngle / (4 * Math.PI);
  const mappingDegree = Math.round(rawDegree);
  const lowerBandChern = -mappingDegree;
  return {
    gapClosed: false,
    minimumGap: 2 * minimumRadius,
    mappingDegree,
    lowerBandChern,
    absoluteChern: Math.abs(lowerBandChern),
    residual: rawDegree - mappingDegree,
  };
}

export function spinlessTimeReversalResidual(kx, ky, xi = 1, V = -0.75, v = Math.SQRT1_2 / 2) {
  const vector = chernVector(kx, ky, xi, V, v);
  // For spinless T=K, H(k)-H*(-k)=2 d_x sigma_x in Martin's convention.
  return 2 * Math.abs(vector.x);
}

export function doubledSpinChernBlocks(xi = 1, V = -0.75, v = Math.SQRT1_2 / 2, mesh = 31) {
  const up = sampleChernModel(xi, V, v, mesh);
  if (up.gapClosed) {
    return {
      gapClosed: true,
      cUp: null,
      cDown: null,
      totalChern: null,
      z2FromSpinBlock: null,
    };
  }
  return {
    gapClosed: false,
    cUp: up.lowerBandChern,
    cDown: -up.lowerBandChern,
    totalChern: 0,
    z2FromSpinBlock: Math.abs(up.lowerBandChern) % 2,
  };
}

export function helicalEdgeSpectrum(k, pairs = 1, mixing = 0, velocity = 1) {
  [k, mixing, velocity].forEach((value, index) => finite(value, ['k', 'mixing', 'velocity'][index]));
  if (![1, 2].includes(pairs)) throw new RangeError('pairs must be 1 or 2');
  if (mixing < 0) throw new RangeError('mixing must be non-negative');
  const linear = velocity * k;
  if (pairs === 1) {
    return {
      pairs,
      mixingAllowed: false,
      energies: [-linear, linear].sort((a, b) => a - b),
      directGapAtTrim: 0,
      z2Parity: 1,
    };
  }
  const energy = Math.hypot(linear, mixing);
  return {
    pairs,
    mixingAllowed: true,
    energies: [-energy, -energy, energy, energy],
    directGapAtTrim: 2 * mixing,
    z2Parity: 0,
  };
}

export function inversionParityZ2(paritiesByTrim) {
  if (!Array.isArray(paritiesByTrim) || paritiesByTrim.length !== 4) {
    throw new RangeError('paritiesByTrim must contain four TRIM arrays');
  }
  let product = 1;
  const trimProducts = paritiesByTrim.map((trim, trimIndex) => {
    if (!Array.isArray(trim) || trim.length === 0) {
      throw new RangeError(`TRIM ${trimIndex} must contain at least one occupied Kramers-pair parity`);
    }
    const value = trim.reduce((accumulator, parity) => {
      if (parity !== 1 && parity !== -1) throw new RangeError('each parity must be +1 or -1');
      return accumulator * parity;
    }, 1);
    product *= value;
    return value;
  });
  return {
    trimProducts,
    globalProduct: product,
    nu: product === -1 ? 1 : 0,
  };
}
