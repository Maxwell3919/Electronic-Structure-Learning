const ensureFinite = (value, label) => {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite.`);
  return value;
};

const ensurePositive = (value, label) => {
  ensureFinite(value, label);
  if (value <= 0) throw new RangeError(`${label} must be positive.`);
  return value;
};

const vector3 = (value, label) => {
  if (!Array.isArray(value) || value.length !== 3) {
    throw new TypeError(`${label} must be a three-component vector.`);
  }
  value.forEach((entry, index) => ensureFinite(entry, `${label}[${index}]`));
  return value;
};

const norm3 = (vector) => Math.hypot(vector[0], vector[1], vector[2]);
const identity3 = () => [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
const outer3 = (left, right) => left.map((entry, row) => right.map((_, column) => entry * right[column]));
const scaleMatrix = (matrix, factor) => matrix.map((row) => row.map((entry) => factor * entry));
const addMatrices = (left, right) => left.map((row, i) => row.map((entry, j) => entry + right[i][j]));
const trace3 = (matrix) => matrix[0][0] + matrix[1][1] + matrix[2][2];

export const stressModelDefaults = Object.freeze({
  strain2D: Object.freeze({ exx: 0.08, eyy: -0.03, exy: 0.06, rotation: 18 }),
  cubic: Object.freeze({ C11: 1.8, C12: 0.7, strain: Object.freeze([0.04, -0.01, 0.02]) }),
  pair: Object.freeze({ vector: Object.freeze([1.2, 0.8, 0]), restLength: 1.1, springConstant: 2.4, volume: 3 }),
  chain: Object.freeze({ R1: 1, R2: 1.4, K1: 6, K2: 1.5, strain: 0.08 }),
});

export function deformation2D({ exx = 0, eyy = 0, exy = 0, rotation = 0 } = {}) {
  [exx, eyy, exy, rotation].forEach((value, index) => ensureFinite(value, ['exx', 'eyy', 'exy', 'rotation'][index]));
  const angle = rotation * Math.PI / 180;
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const stretch = [[1 + exx, exy], [exy, 1 + eyy]];
  const rigidRotation = [[cosine, -sine], [sine, cosine]];
  const deformation = [
    [
      rigidRotation[0][0] * stretch[0][0] + rigidRotation[0][1] * stretch[1][0],
      rigidRotation[0][0] * stretch[0][1] + rigidRotation[0][1] * stretch[1][1],
    ],
    [
      rigidRotation[1][0] * stretch[0][0] + rigidRotation[1][1] * stretch[1][0],
      rigidRotation[1][0] * stretch[0][1] + rigidRotation[1][1] * stretch[1][1],
    ],
  ];
  const metric = [
    [
      deformation[0][0] ** 2 + deformation[1][0] ** 2,
      deformation[0][0] * deformation[0][1] + deformation[1][0] * deformation[1][1],
    ],
    [
      deformation[0][1] * deformation[0][0] + deformation[1][1] * deformation[1][0],
      deformation[0][1] ** 2 + deformation[1][1] ** 2,
    ],
  ];
  const linearMetric = [[1 + 2 * exx, 2 * exy], [2 * exy, 1 + 2 * eyy]];
  const areaRatio = deformation[0][0] * deformation[1][1] - deformation[0][1] * deformation[1][0];
  const mean = 0.5 * (exx + eyy);
  const radius = Math.hypot(0.5 * (exx - eyy), exy);
  const principalStrains = [mean + radius, mean - radius];
  const principalAngle = 0.5 * Math.atan2(2 * exy, exx - eyy);
  return Object.freeze({
    symmetricStrain: Object.freeze([[exx, exy], [exy, eyy]]),
    rigidRotation: Object.freeze(rigidRotation.map((row) => Object.freeze(row))),
    deformation: Object.freeze(deformation.map((row) => Object.freeze(row))),
    metric: Object.freeze(metric.map((row) => Object.freeze(row))),
    linearMetric: Object.freeze(linearMetric.map((row) => Object.freeze(row))),
    areaRatio,
    principalStrains: Object.freeze(principalStrains),
    principalAngle,
    rotationDegrees: rotation,
    boundary: 'finite rigid rotation composed with a symmetric small-strain stretch; Martin G.1-G.3 are linear-strain relations',
  });
}

export function transform2D({ deformation, vector }) {
  if (!Array.isArray(deformation) || deformation.length !== 2 || deformation.some((row) => !Array.isArray(row) || row.length !== 2)) {
    throw new TypeError('deformation must be a 2x2 matrix.');
  }
  if (!Array.isArray(vector) || vector.length !== 2) throw new TypeError('vector must have two components.');
  vector.forEach((entry, index) => ensureFinite(entry, `vector[${index}]`));
  return Object.freeze([
    deformation[0][0] * vector[0] + deformation[0][1] * vector[1],
    deformation[1][0] * vector[0] + deformation[1][1] * vector[1],
  ]);
}

export function cubicNormalElasticResponse({ C11, C12, strain, volume = 1 }) {
  ensurePositive(C11, 'C11');
  ensureFinite(C12, 'C12');
  ensurePositive(volume, 'volume');
  vector3(strain, 'strain');
  if (C11 + 2 * C12 <= 0 || C11 - C12 <= 0) {
    throw new RangeError('Cubic normal-strain stability requires C11+2C12>0 and C11-C12>0.');
  }
  const [exx, eyy, ezz] = strain;
  const energyDensity = 0.5 * C11 * (exx ** 2 + eyy ** 2 + ezz ** 2)
    + C12 * (exx * eyy + eyy * ezz + ezz * exx);
  const internalStress = [
    -(C11 * exx + C12 * (eyy + ezz)),
    -(C11 * eyy + C12 * (exx + ezz)),
    -(C11 * ezz + C12 * (exx + eyy)),
  ];
  const pressure = -(internalStress[0] + internalStress[1] + internalStress[2]) / 3;
  return Object.freeze({
    energyDensity,
    energy: volume * energyDensity,
    internalStress: Object.freeze(internalStress),
    pressure,
    bulkModulus: (C11 + 2 * C12) / 3,
    tetragonalModulus: C11 - C12,
    convention: 'Martin internal stress: sigma = -(1/Omega) dE/du',
  });
}

export function pairVirialStress({ vector, dVdr, volume = 1 }) {
  vector3(vector, 'vector');
  ensureFinite(dVdr, 'dVdr');
  ensurePositive(volume, 'volume');
  const distance = norm3(vector);
  if (distance === 0) throw new RangeError('pair separation must be non-zero.');
  const tensor = scaleMatrix(outer3(vector, vector), dVdr / (volume * distance));
  return Object.freeze({
    distance,
    tensor: Object.freeze(tensor.map((row) => Object.freeze(row))),
    trace: trace3(tensor),
    pressure: -trace3(tensor) / 3,
    principalValue: distance * dVdr / volume,
    convention: 'one unique central-force pair; equivalent to the ordered-pair form of Martin G.6-G.7',
  });
}

export function harmonicPairVirial({ vector, restLength, springConstant, volume = 1 }) {
  vector3(vector, 'vector');
  ensurePositive(restLength, 'restLength');
  ensurePositive(springConstant, 'springConstant');
  const distance = norm3(vector);
  const dVdr = springConstant * (distance - restLength);
  return pairVirialStress({ vector, dVdr, volume });
}

export function hartreeModeStress({ wavevector, densityAmplitude, eSquared = 1 }) {
  vector3(wavevector, 'wavevector');
  ensureFinite(densityAmplitude, 'densityAmplitude');
  ensurePositive(eSquared, 'eSquared');
  const magnitude = norm3(wavevector);
  if (magnitude === 0) throw new RangeError('Hartree stress excludes the G=0 mode.');
  const direction = wavevector.map((entry) => entry / magnitude);
  const projector = outer3(direction, direction);
  const weight = 2 * Math.PI * eSquared * densityAmplitude ** 2 / magnitude ** 2;
  const tensor = scaleMatrix(addMatrices(scaleMatrix(projector, 2), scaleMatrix(identity3(), -1)), weight);
  return Object.freeze({
    direction: Object.freeze(direction),
    weight,
    tensor: Object.freeze(tensor.map((row) => Object.freeze(row))),
    trace: trace3(tensor),
    eigenvalues: Object.freeze([weight, -weight, -weight]),
    convention: 'single listed non-zero reciprocal contribution in the normalization of Martin G.8',
  });
}

export function kineticModeStress({ momentum, occupationWeight = 1, prefactor = 1 }) {
  vector3(momentum, 'momentum');
  ensureFinite(occupationWeight, 'occupationWeight');
  ensurePositive(prefactor, 'prefactor');
  const tensor = scaleMatrix(outer3(momentum, momentum), prefactor * occupationWeight);
  return Object.freeze({
    tensor: Object.freeze(tensor.map((row) => Object.freeze(row))),
    trace: trace3(tensor),
    principalValue: prefactor * occupationWeight * norm3(momentum) ** 2,
    convention: 'one normalized plane-wave kinetic contribution corresponding to the dyadic structure of Martin G.10',
  });
}

export function internalStrainChain({ R1, R2, K1, K2, strain }) {
  ensurePositive(R1, 'R1');
  ensurePositive(R2, 'R2');
  ensurePositive(K1, 'K1');
  ensurePositive(K2, 'K2');
  ensureFinite(strain, 'strain');
  const referenceLength = R1 + R2;
  const extension = referenceLength * strain;
  const effectiveSpring = K1 * K2 / (K1 + K2);
  const relaxedBond1Change = K2 / (K1 + K2) * extension;
  const relaxedBond2Change = K1 / (K1 + K2) * extension;
  const uniformBond1Change = R1 * strain;
  const uniformBond2Change = R2 * strain;
  const internalShift = relaxedBond1Change - uniformBond1Change;
  const internalStrainParameter = referenceLength * K2 / (K1 + K2) - R1;
  const force1 = K1 * relaxedBond1Change;
  const force2 = K2 * relaxedBond2Change;
  const relaxedEnergy = 0.5 * K1 * relaxedBond1Change ** 2 + 0.5 * K2 * relaxedBond2Change ** 2;
  const clampedEnergy = 0.5 * K1 * uniformBond1Change ** 2 + 0.5 * K2 * uniformBond2Change ** 2;
  return Object.freeze({
    referenceLength,
    strainedLength: referenceLength + extension,
    extension,
    effectiveSpring,
    relaxedBond1: R1 + relaxedBond1Change,
    relaxedBond2: R2 + relaxedBond2Change,
    relaxedBond1Change,
    relaxedBond2Change,
    uniformBond1Change,
    uniformBond2Change,
    internalShift,
    internalStrainParameter,
    force1,
    force2,
    relaxedEnergy,
    clampedEnergy,
    relaxedStrainStiffness: effectiveSpring * referenceLength ** 2,
    clampedStrainStiffness: K1 * R1 ** 2 + K2 * R2 ** 2,
    boundary: 'one-dimensional harmonic diatomic-chain benchmark with one internal coordinate and fixed total cell extension',
  });
}

export function relaxedElasticConstant({ clampedElastic, strainInternalCoupling, internalForceConstant }) {
  ensureFinite(clampedElastic, 'clampedElastic');
  ensureFinite(strainInternalCoupling, 'strainInternalCoupling');
  ensurePositive(internalForceConstant, 'internalForceConstant');
  const relaxationReduction = strainInternalCoupling ** 2 / internalForceConstant;
  return Object.freeze({
    clampedElastic,
    relaxationReduction,
    relaxedElastic: clampedElastic - relaxationReduction,
    boundary: 'single harmonic internal coordinate; multi-coordinate crystals require a force-constant matrix inverse',
  });
}
