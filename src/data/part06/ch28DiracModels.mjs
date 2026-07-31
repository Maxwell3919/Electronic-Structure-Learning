function assertFinite(value, label) {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite`);
}

export function latticeDiracMass(kx, ky, kz, m = -1, b = 1) {
  for (const [value, label] of [[kx, 'kx'], [ky, 'ky'], [kz, 'kz'], [m, 'm'], [b, 'b']]) {
    assertFinite(value, label);
  }
  if (b <= 0) throw new RangeError('b must be positive');
  return m + b * (3 - Math.cos(kx) - Math.cos(ky) - Math.cos(kz));
}

export function latticeDiracSpectrum(kx, ky, kz, parameters = {}) {
  const { m = -1, b = 1, velocity = 1 } = parameters;
  assertFinite(velocity, 'velocity');
  if (velocity <= 0) throw new RangeError('velocity must be positive');
  const mass = latticeDiracMass(kx, ky, kz, m, b);
  const kineticSquared = velocity ** 2 * (
    Math.sin(kx) ** 2 + Math.sin(ky) ** 2 + Math.sin(kz) ** 2
  );
  const energy = Math.sqrt(kineticSquared + mass ** 2);
  return { mass, lower: -energy, upper: energy, gap: 2 * energy };
}

export function latticeDiracTrimMasses(m = -1, b = 1) {
  const values = [];
  for (const kz of [0, Math.PI]) {
    for (const ky of [0, Math.PI]) {
      for (const kx of [0, Math.PI]) {
        values.push({
          label: `${kx ? 1 : 0}${ky ? 1 : 0}${kz ? 1 : 0}`,
          mass: latticeDiracMass(kx, ky, kz, m, b),
        });
      }
    }
  }
  return values;
}

export function domainWallSurface(leftMass, rightMass, velocity = 1, surfaceMass = 0) {
  for (const [value, label] of [
    [leftMass, 'leftMass'],
    [rightMass, 'rightMass'],
    [velocity, 'velocity'],
    [surfaceMass, 'surfaceMass'],
  ]) assertFinite(value, label);
  if (velocity <= 0) throw new RangeError('velocity must be positive');
  const signChange = leftMass * rightMass < 0;
  const minimumMagnitude = Math.min(Math.abs(leftMass), Math.abs(rightMass));
  return {
    signChange,
    localizationLength: signChange && minimumMagnitude > 0
      ? velocity / minimumMagnitude
      : Number.POSITIVE_INFINITY,
    surfaceGap: signChange ? 2 * Math.abs(surfaceMass) : null,
  };
}

export function surfaceDiracSpectrum(kx, ky, velocity = 1, surfaceMass = 0) {
  for (const [value, label] of [[kx, 'kx'], [ky, 'ky'], [velocity, 'velocity'], [surfaceMass, 'surfaceMass']]) {
    assertFinite(value, label);
  }
  if (velocity <= 0) throw new RangeError('velocity must be positive');
  const energy = Math.sqrt(velocity ** 2 * (kx ** 2 + ky ** 2) + surfaceMass ** 2);
  return [-energy, energy];
}
