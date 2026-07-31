function assertFinite(value, label) {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite`);
}

export function diracZeemanSpectrum(kx, ky, kz, parameters = {}) {
  const { mass = 0.7, zeeman = 1, velocity = 1 } = parameters;
  for (const [value, label] of [
    [kx, 'kx'], [ky, 'ky'], [kz, 'kz'],
    [mass, 'mass'], [zeeman, 'zeeman'], [velocity, 'velocity'],
  ]) assertFinite(value, label);
  if (mass < 0 || zeeman < 0 || velocity <= 0) {
    throw new RangeError('mass and zeeman must be non-negative and velocity must be positive');
  }
  const transverse = velocity ** 2 * (kx ** 2 + ky ** 2);
  const longitudinal = Math.sqrt(mass ** 2 + velocity ** 2 * kz ** 2);
  const low = Math.sqrt(transverse + (longitudinal - zeeman) ** 2);
  const high = Math.sqrt(transverse + (longitudinal + zeeman) ** 2);
  return [-high, -low, low, high];
}

export function diracZeemanPhase(mass = 0.7, zeeman = 1, velocity = 1) {
  for (const [value, label] of [[mass, 'mass'], [zeeman, 'zeeman'], [velocity, 'velocity']]) {
    assertFinite(value, label);
  }
  if (mass < 0 || zeeman < 0 || velocity <= 0) {
    throw new RangeError('mass and zeeman must be non-negative and velocity must be positive');
  }
  const tolerance = 1e-12;
  if (Math.abs(zeeman - mass) <= tolerance) {
    return { phase: 'critical', nodes: [0], nodeSeparation: 0, bulkGap: 0 };
  }
  if (zeeman < mass) {
    return { phase: 'gapped', nodes: [], nodeSeparation: 0, bulkGap: 2 * (mass - zeeman) };
  }
  const k0 = Math.sqrt(zeeman ** 2 - mass ** 2) / velocity;
  return {
    phase: 'weyl',
    nodes: [-k0, k0],
    nodeSeparation: 2 * k0,
    bulkGap: 0,
  };
}

export function linearWeylSpectrum(px, py, pz, velocity = 1) {
  for (const [value, label] of [[px, 'px'], [py, 'py'], [pz, 'pz'], [velocity, 'velocity']]) {
    assertFinite(value, label);
  }
  if (velocity <= 0) throw new RangeError('velocity must be positive');
  const energy = velocity * Math.hypot(px, py, pz);
  return [-energy, energy];
}

export function weylFluxCharge(chirality, orientation = 1) {
  if (chirality !== 1 && chirality !== -1) throw new RangeError('chirality must be +1 or -1');
  if (orientation !== 1 && orientation !== -1) throw new RangeError('orientation must be +1 or -1');
  return chirality * orientation;
}

export function sliceChernBetweenWeylNodes(kz, k0, convention = 1) {
  for (const [value, label] of [[kz, 'kz'], [k0, 'k0']]) assertFinite(value, label);
  if (k0 < 0) throw new RangeError('k0 must be non-negative');
  if (convention !== 1 && convention !== -1) throw new RangeError('convention must be +1 or -1');
  if (k0 === 0 || Math.abs(kz) >= k0) return 0;
  return convention;
}

export function fermiArcPoint(kz, energy = 0, velocity = 1, k0 = 1) {
  for (const [value, label] of [[kz, 'kz'], [energy, 'energy'], [velocity, 'velocity'], [k0, 'k0']]) {
    assertFinite(value, label);
  }
  if (velocity <= 0 || k0 < 0) throw new RangeError('velocity must be positive and k0 non-negative');
  if (Math.abs(kz) > k0) return null;
  return { ky: energy / velocity, kz };
}

export function codimensionResidual(hx, hy, hz) {
  for (const [value, label] of [[hx, 'hx'], [hy, 'hy'], [hz, 'hz']]) assertFinite(value, label);
  return Math.hypot(hx, hy, hz);
}
