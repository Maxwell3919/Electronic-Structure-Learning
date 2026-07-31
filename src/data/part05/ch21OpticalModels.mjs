const finite = (name, value) => {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
};

const positive = (name, value) => {
  finite(name, value);
  if (value <= 0) throw new RangeError(`${name} must be positive`);
};

const symmetricEigen2x2 = ({ a, b, d }) => {
  finite('a', a);
  finite('b', b);
  finite('d', d);
  const centre = 0.5 * (a + d);
  const halfDifference = 0.5 * (a - d);
  const radius = Math.hypot(halfDifference, b);
  const angle = 0.5 * Math.atan2(2 * b, a - d);
  const sine = Math.sin(angle);
  const cosine = Math.cos(angle);
  return {
    lower: {
      value: centre - radius,
      vector: [-sine, cosine],
    },
    upper: {
      value: centre + radius,
      vector: [cosine, sine],
    },
  };
};

/**
 * Two-transition effective electron-hole Hamiltonian with an attractive
 * normalized rank-one kernel: H = diag(E1,E2) - g |u><u|.
 */
export const excitonTransitionModel = ({
  continuumEdge = 6,
  offset1 = 0.25,
  offset2 = 1.2,
  attraction = 0.8,
  channelRatio = 0.7,
  dipole1 = 1,
  dipole2 = 0.6,
} = {}) => {
  positive('continuumEdge', continuumEdge);
  positive('offset1', offset1);
  positive('offset2', offset2);
  if (offset2 <= offset1) throw new RangeError('offset2 must exceed offset1');
  finite('attraction', attraction);
  if (attraction < 0) throw new RangeError('attraction must be non-negative');
  finite('channelRatio', channelRatio);
  finite('dipole1', dipole1);
  finite('dipole2', dipole2);

  const normalization = Math.hypot(1, channelRatio);
  const u1 = 1 / normalization;
  const u2 = channelRatio / normalization;
  const energy1 = continuumEdge + offset1;
  const energy2 = continuumEdge + offset2;
  const a = energy1 - attraction * u1 ** 2;
  const d = energy2 - attraction * u2 ** 2;
  const b = -attraction * u1 * u2;
  const eigensystem = symmetricEigen2x2({ a, b, d });

  const strength = (vector) => (vector[0] * dipole1 + vector[1] * dipole2) ** 2;
  const lowerStrength = strength(eigensystem.lower.vector);
  const upperStrength = strength(eigensystem.upper.vector);
  const bindingEnergy = continuumEdge - eigensystem.lower.value;

  return {
    continuumEdge,
    independentTransitions: [energy1, energy2],
    kernel: { a, b, d, u: [u1, u2] },
    lower: {
      energy: eigensystem.lower.value,
      vector: eigensystem.lower.vector,
      strength: lowerStrength,
    },
    upper: {
      energy: eigensystem.upper.value,
      vector: eigensystem.upper.vector,
      strength: upperStrength,
    },
    bindingEnergy,
    isBound: bindingEnergy > 0,
    totalStrength: lowerStrength + upperStrength,
    inputStrength: dipole1 ** 2 + dipole2 ** 2,
  };
};

export const sampleExcitonAttractionScan = ({
  continuumEdge = 6,
  offset1 = 0.25,
  offset2 = 1.2,
  channelRatio = 0.7,
  dipole1 = 1,
  dipole2 = 0.6,
  maxAttraction = 2.5,
  points = 201,
} = {}) => {
  positive('maxAttraction', maxAttraction);
  if (!Number.isInteger(points) || points < 3 || points > 5001) {
    throw new RangeError('points must be an integer between 3 and 5001');
  }
  return Array.from({ length: points }, (_, index) => {
    const attraction = maxAttraction * index / (points - 1);
    return {
      attraction,
      ...excitonTransitionModel({
        continuumEdge,
        offset1,
        offset2,
        attraction,
        channelRatio,
        dipole1,
        dipole2,
      }),
    };
  });
};

/**
 * Two-component microscopic dielectric matrix.
 * epsilon_M = 1 / (epsilon^{-1})_00 = head - wing^2 / body.
 */
export const dielectricLocalFieldModel = ({
  head = 8,
  wing = 2,
  body = 5,
} = {}) => {
  positive('head', head);
  finite('wing', wing);
  positive('body', body);
  const determinant = head * body - wing ** 2;
  if (determinant <= 0) {
    throw new RangeError('dielectric matrix must have a positive determinant');
  }
  const inverse00 = body / determinant;
  const inverse01 = -wing / determinant;
  const inverse11 = head / determinant;
  const macroscopic = 1 / inverse00;
  const naiveInverseHead = 1 / head;
  return {
    matrix: [[head, wing], [wing, body]],
    inverse: [[inverse00, inverse01], [inverse01, inverse11]],
    determinant,
    macroscopic,
    bareHead: head,
    localFieldCorrection: macroscopic - head,
    naiveInverseHead,
    inverse00,
  };
};
