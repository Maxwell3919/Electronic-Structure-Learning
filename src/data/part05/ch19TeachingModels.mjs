const assertFinitePositive = (name, value) => {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be a finite positive number`);
  }
};

export const harmonicExactState = ({ omega, time, x0 = 1, v0 = 0 }) => {
  assertFinitePositive('omega', omega);
  if (!Number.isFinite(time)) throw new RangeError('time must be finite');
  if (!Number.isFinite(x0) || !Number.isFinite(v0)) {
    throw new RangeError('x0 and v0 must be finite');
  }

  const phase = omega * time;
  return {
    time,
    position: x0 * Math.cos(phase) + (v0 / omega) * Math.sin(phase),
    velocity: -x0 * omega * Math.sin(phase) + v0 * Math.cos(phase),
  };
};

export const simulateVelocityVerlet = ({
  omega,
  dt,
  steps,
  x0 = 1,
  v0 = 0,
}) => {
  assertFinitePositive('omega', omega);
  assertFinitePositive('dt', dt);
  if (!Number.isInteger(steps) || steps < 1 || steps > 20000) {
    throw new RangeError('steps must be an integer between 1 and 20000');
  }
  if (!Number.isFinite(x0) || !Number.isFinite(v0)) {
    throw new RangeError('x0 and v0 must be finite');
  }

  let position = x0;
  let velocity = v0;
  let acceleration = -(omega ** 2) * position;
  const initialEnergy = 0.5 * velocity ** 2 + 0.5 * (omega * position) ** 2;
  const points = [{
    step: 0,
    time: 0,
    position,
    velocity,
    energy: initialEnergy,
    exactPosition: x0,
  }];

  let maxPositionError = 0;
  let maxRelativeEnergyDeviation = 0;

  for (let step = 1; step <= steps; step += 1) {
    position += velocity * dt + 0.5 * acceleration * dt ** 2;
    const nextAcceleration = -(omega ** 2) * position;
    velocity += 0.5 * (acceleration + nextAcceleration) * dt;
    acceleration = nextAcceleration;

    const time = step * dt;
    const exact = harmonicExactState({ omega, time, x0, v0 });
    const energy = 0.5 * velocity ** 2 + 0.5 * (omega * position) ** 2;
    const positionError = Math.abs(position - exact.position);
    const relativeEnergyDeviation = initialEnergy === 0
      ? Math.abs(energy - initialEnergy)
      : Math.abs((energy - initialEnergy) / initialEnergy);

    maxPositionError = Math.max(maxPositionError, positionError);
    maxRelativeEnergyDeviation = Math.max(
      maxRelativeEnergyDeviation,
      relativeEnergyDeviation,
    );

    points.push({
      step,
      time,
      position,
      velocity,
      energy,
      exactPosition: exact.position,
    });
  }

  return {
    model: 'dimensionless harmonic oscillator integrated with velocity Verlet',
    omega,
    dt,
    steps,
    stabilityParameter: omega * dt,
    initialEnergy,
    maxPositionError,
    maxRelativeEnergyDeviation,
    points,
  };
};

export const carParrinelloFrequencyModel = ({ gap, fictitiousMass }) => {
  assertFinitePositive('gap', gap);
  assertFinitePositive('fictitiousMass', fictitiousMass);
  return gap / Math.sqrt(fictitiousMass);
};

export const adiabaticSeparationRatio = ({
  ionicFrequency,
  gap,
  fictitiousMass,
}) => {
  assertFinitePositive('ionicFrequency', ionicFrequency);
  const electronicFrequency = carParrinelloFrequencyModel({ gap, fictitiousMass });
  return {
    electronicFrequency,
    ratio: electronicFrequency / ionicFrequency,
  };
};

export const forceNoiseSequence = ({ amplitude, steps, mode = 'alternating' }) => {
  if (!Number.isFinite(amplitude) || amplitude < 0) {
    throw new RangeError('amplitude must be finite and non-negative');
  }
  if (!Number.isInteger(steps) || steps < 1 || steps > 20000) {
    throw new RangeError('steps must be an integer between 1 and 20000');
  }
  if (!['alternating', 'biased'].includes(mode)) {
    throw new RangeError('mode must be alternating or biased');
  }

  return Array.from({ length: steps }, (_, index) => {
    if (mode === 'biased') return amplitude;
    return index % 2 === 0 ? amplitude : -amplitude;
  });
};
