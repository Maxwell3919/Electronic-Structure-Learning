const ensureFinite = (value, label) => {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite.`);
  return value;
};

const ensurePositive = (value, label) => {
  ensureFinite(value, label);
  if (value <= 0) throw new RangeError(`${label} must be positive.`);
  return value;
};

export const dielectricModelDefaults = Object.freeze({
  epsilonInfinity: 2.5,
  totalStrength: 1.6,
  weightFraction: 0.55,
  omega1: 0.8,
  omega2: 1.55,
  damping: 0.08,
  epsilon00: 5,
  epsilon11: 3,
  localFieldCoupling: 1.2,
  polarModeStrength: 1.8,
  omegaTO: 0.75,
});

export function longitudinalTransverseDecomposition({ vector, wavevector }) {
  if (!Array.isArray(vector) || !Array.isArray(wavevector) || vector.length !== wavevector.length || vector.length === 0) {
    throw new TypeError('vector and wavevector must be non-empty arrays of equal length.');
  }
  vector.forEach((value, index) => ensureFinite(value, `vector[${index}]`));
  wavevector.forEach((value, index) => ensureFinite(value, `wavevector[${index}]`));
  const q2 = wavevector.reduce((sum, value) => sum + value ** 2, 0);
  if (q2 <= 1e-20) throw new RangeError('wavevector norm must be non-zero.');
  const dot = vector.reduce((sum, value, index) => sum + value * wavevector[index], 0);
  const longitudinal = wavevector.map((value) => value * dot / q2);
  const transverse = vector.map((value, index) => value - longitudinal[index]);
  return Object.freeze({
    longitudinal: Object.freeze(longitudinal),
    transverse: Object.freeze(transverse),
    longitudinalDotTransverse: longitudinal.reduce((sum, value, index) => sum + value * transverse[index], 0),
  });
}

export function lorentzDielectric({
  omega,
  epsilonInfinity,
  resonances,
  damping,
}) {
  ensureFinite(omega, 'omega');
  ensurePositive(epsilonInfinity, 'epsilonInfinity');
  ensurePositive(damping, 'damping');
  if (!Array.isArray(resonances) || resonances.length === 0) {
    throw new TypeError('resonances must be a non-empty array.');
  }
  let real = epsilonInfinity;
  let imaginary = 0;
  let totalStrength = 0;
  resonances.forEach((resonance, index) => {
    const frequency = ensurePositive(resonance.frequency, `resonances[${index}].frequency`);
    const strength = ensureFinite(resonance.strength, `resonances[${index}].strength`);
    if (strength < 0) throw new RangeError('oscillator strengths must be non-negative.');
    totalStrength += strength;
    const a = frequency ** 2 - omega ** 2;
    const b = damping * omega;
    const denominator = a ** 2 + b ** 2;
    real += strength * a / denominator;
    imaginary += strength * b / denominator;
  });
  const conductivityReal = omega * imaginary / (4 * Math.PI);
  const conductivityImaginary = -omega * (real - 1) / (4 * Math.PI);
  const inverseDenominator = real ** 2 + imaginary ** 2;
  return Object.freeze({
    omega,
    real,
    imaginary,
    conductivityReal,
    conductivityImaginary,
    inverseReal: real / inverseDenominator,
    inverseImaginary: -imaginary / inverseDenominator,
    lossFunction: imaginary / inverseDenominator,
    totalStrength,
  });
}

export function splitOscillatorStrength({ totalStrength, fraction, omega1, omega2 }) {
  ensurePositive(totalStrength, 'totalStrength');
  ensureFinite(fraction, 'fraction');
  if (fraction < 0 || fraction > 1) throw new RangeError('fraction must lie in [0, 1].');
  ensurePositive(omega1, 'omega1');
  ensurePositive(omega2, 'omega2');
  return Object.freeze([
    Object.freeze({ frequency: omega1, strength: totalStrength * fraction }),
    Object.freeze({ frequency: omega2, strength: totalStrength * (1 - fraction) }),
  ]);
}

export function integrateFSum({
  epsilonInfinity,
  resonances,
  damping,
  maxOmega = 12,
  intervals = 60000,
}) {
  ensurePositive(maxOmega, 'maxOmega');
  if (!Number.isInteger(intervals) || intervals < 100 || intervals > 300000) {
    throw new RangeError('intervals must be an integer between 100 and 300000.');
  }
  const step = maxOmega / intervals;
  let epsilonMoment = 0;
  let conductivityWeight = 0;
  for (let index = 0; index <= intervals; index += 1) {
    const omega = index * step;
    const response = lorentzDielectric({ omega, epsilonInfinity, resonances, damping });
    const weight = index === 0 || index === intervals ? 0.5 : 1;
    epsilonMoment += weight * omega * response.imaginary;
    conductivityWeight += weight * response.conductivityReal;
  }
  return Object.freeze({
    epsilonMoment: step * epsilonMoment,
    conductivityWeight: step * conductivityWeight,
    expectedEpsilonMoment: 0.5 * Math.PI * resonances.reduce((sum, item) => sum + item.strength, 0),
    expectedConductivityWeight: resonances.reduce((sum, item) => sum + item.strength, 0) / 8,
  });
}

export function macroscopicDielectricFromMatrix({ epsilon00, epsilon11, coupling }) {
  ensurePositive(epsilon00, 'epsilon00');
  ensurePositive(epsilon11, 'epsilon11');
  ensureFinite(coupling, 'coupling');
  const determinant = epsilon00 * epsilon11 - coupling ** 2;
  if (determinant <= 1e-12) throw new RangeError('dielectric matrix must be positive and invertible.');
  const inverse00 = epsilon11 / determinant;
  const macroscopic = 1 / inverse00;
  const schurComplement = epsilon00 - coupling ** 2 / epsilon11;
  return Object.freeze({
    determinant,
    inverse00,
    macroscopic,
    schurComplement,
    localFieldCorrection: epsilon00 - macroscopic,
  });
}

export function polarModeResponse({
  omega,
  epsilonInfinity,
  strength,
  omegaTO,
  damping,
}) {
  ensureFinite(omega, 'omega');
  ensurePositive(epsilonInfinity, 'epsilonInfinity');
  ensurePositive(strength, 'strength');
  ensurePositive(omegaTO, 'omegaTO');
  ensurePositive(damping, 'damping');
  const response = lorentzDielectric({
    omega,
    epsilonInfinity,
    resonances: [{ frequency: omegaTO, strength }],
    damping,
  });
  const omegaLO = Math.sqrt(omegaTO ** 2 + strength / epsilonInfinity);
  const epsilonStatic = epsilonInfinity + strength / omegaTO ** 2;
  return Object.freeze({
    ...response,
    omegaLO,
    omegaTO,
    epsilonStatic,
    lstRatio: epsilonStatic / epsilonInfinity,
    frequencyRatioSquared: omegaLO ** 2 / omegaTO ** 2,
  });
}

export function nonanalyticModeShift({ direction, bornChargeVector, epsilonTensor, prefactor = 1 }) {
  if (!Array.isArray(direction) || !Array.isArray(bornChargeVector) || direction.length !== bornChargeVector.length || direction.length === 0) {
    throw new TypeError('direction and bornChargeVector must be non-empty arrays of equal length.');
  }
  if (!Array.isArray(epsilonTensor) || epsilonTensor.length !== direction.length || epsilonTensor.some((row) => !Array.isArray(row) || row.length !== direction.length)) {
    throw new TypeError('epsilonTensor must be a square matrix matching the direction dimension.');
  }
  ensurePositive(prefactor, 'prefactor');
  const norm = Math.sqrt(direction.reduce((sum, value) => sum + value ** 2, 0));
  if (norm <= 1e-12) throw new RangeError('direction norm must be non-zero.');
  const unit = direction.map((value) => value / norm);
  bornChargeVector.forEach((value, index) => ensureFinite(value, `bornChargeVector[${index}]`));
  epsilonTensor.flat().forEach((value, index) => ensureFinite(value, `epsilonTensor[${index}]`));
  const projectedCharge = unit.reduce((sum, value, index) => sum + value * bornChargeVector[index], 0);
  const dielectricProjection = unit.reduce(
    (sum, value, i) => sum + value * epsilonTensor[i].reduce((rowSum, entry, j) => rowSum + entry * unit[j], 0),
    0,
  );
  if (dielectricProjection <= 0) throw new RangeError('projected dielectric constant must be positive.');
  return prefactor * projectedCharge ** 2 / dielectricProjection;
}
