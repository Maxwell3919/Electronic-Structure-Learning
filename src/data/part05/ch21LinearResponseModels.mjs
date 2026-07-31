const finite = (name, value) => {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
};

const positive = (name, value) => {
  finite(name, value);
  if (value <= 0) throw new RangeError(`${name} must be positive`);
};

/**
 * Two-transition Tamm-Dancoff-like Hermitian response model.
 *
 * H = [[energy1 + shift1, coupling],
 *      [coupling, energy2 + shift2]]
 *
 * The oscillator amplitudes are the orthogonal rotation of the input dipole
 * vector. This is a finite teaching kernel, not a production Casida solver.
 */
export const coupledTransitionModes = ({
  energy1 = 3,
  energy2 = 5,
  shift1 = 0,
  shift2 = 0,
  coupling = 0.5,
  dipole1 = 1,
  dipole2 = 1,
} = {}) => {
  positive('energy1', energy1);
  positive('energy2', energy2);
  finite('shift1', shift1);
  finite('shift2', shift2);
  finite('coupling', coupling);
  finite('dipole1', dipole1);
  finite('dipole2', dipole2);

  const diagonal1 = energy1 + shift1;
  const diagonal2 = energy2 + shift2;
  const centre = 0.5 * (diagonal1 + diagonal2);
  const halfDifference = 0.5 * (diagonal1 - diagonal2);
  const splitting = Math.hypot(halfDifference, coupling);
  const lowerEnergy = centre - splitting;
  const upperEnergy = centre + splitting;

  const angle = 0.5 * Math.atan2(2 * coupling, diagonal1 - diagonal2);
  const sine = Math.sin(angle);
  const cosine = Math.cos(angle);

  const lowerVector = [-sine, cosine];
  const upperVector = [cosine, sine];
  const lowerAmplitude = lowerVector[0] * dipole1 + lowerVector[1] * dipole2;
  const upperAmplitude = upperVector[0] * dipole1 + upperVector[1] * dipole2;
  const lowerStrength = lowerAmplitude ** 2;
  const upperStrength = upperAmplitude ** 2;

  return {
    input: {
      diagonal1,
      diagonal2,
      strength1: dipole1 ** 2,
      strength2: dipole2 ** 2,
    },
    lower: {
      energy: lowerEnergy,
      vector: lowerVector,
      amplitude: lowerAmplitude,
      strength: lowerStrength,
    },
    upper: {
      energy: upperEnergy,
      vector: upperVector,
      amplitude: upperAmplitude,
      strength: upperStrength,
    },
    centre,
    splitting: upperEnergy - lowerEnergy,
    mixingAngle: angle,
    inputStrength: dipole1 ** 2 + dipole2 ** 2,
    outputStrength: lowerStrength + upperStrength,
  };
};

export const sampleCouplingScan = ({
  energy1 = 3,
  energy2 = 5,
  shift1 = 0,
  shift2 = 0,
  dipole1 = 1,
  dipole2 = 1,
  minCoupling = -2,
  maxCoupling = 2,
  points = 161,
} = {}) => {
  finite('minCoupling', minCoupling);
  finite('maxCoupling', maxCoupling);
  if (maxCoupling <= minCoupling) throw new RangeError('maxCoupling must exceed minCoupling');
  if (!Number.isInteger(points) || points < 3 || points > 5001) {
    throw new RangeError('points must be an integer between 3 and 5001');
  }

  return Array.from({ length: points }, (_, index) => {
    const coupling = minCoupling + (maxCoupling - minCoupling) * index / (points - 1);
    return {
      coupling,
      ...coupledTransitionModes({
        energy1,
        energy2,
        shift1,
        shift2,
        coupling,
        dipole1,
        dipole2,
      }),
    };
  });
};
