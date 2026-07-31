import assert from 'node:assert/strict';

import {
  dampedDispersionEnergy,
  dudarevOccupationModel,
  erfApprox,
  hybridExchangeProfile,
  metaGgaIndicators,
  numericalCasimirPolderC6,
  rangeSeparatedCoulomb,
  singlePoleC6,
  singlePolePolarizability,
} from '../src/data/part02/ch09TeachingModels.mjs';

function close(actual, expected, tolerance = 1e-10, label = 'value') {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected}, received ${actual}`,
  );
}

function relativeClose(actual, expected, tolerance = 1e-8, label = 'value') {
  const scale = Math.max(1, Math.abs(expected));
  assert.ok(
    Math.abs(actual - expected) / scale <= tolerance,
    `${label}: expected ${expected}, received ${actual}`,
  );
}

// 1. Error-function approximation reproduces reference values and oddness.
close(erfApprox(0), 0, 1.1e-9, 'erf(0)');
close(erfApprox(1), 0.8427007929497149, 1.5e-7, 'erf(1)');
close(erfApprox(2), 0.9953222650189527, 1.5e-7, 'erf(2)');
for (const value of [0.1, 0.4, 1, 2.5]) {
  close(erfApprox(-value), -erfApprox(value), 1e-14, `erf oddness at ${value}`);
}

// 2. Coulomb range separation is an algebraic partition of 1/r.
for (const distance of [0.1, 0.5, 1, 3, 10]) {
  for (const omega of [0.1, 0.3, 0.8]) {
    const split = rangeSeparatedCoulomb(distance, omega);
    close(split.shortFraction + split.longFraction, 1, 1e-14, 'fraction sum');
    close(split.shortRange + split.longRange, split.full, 1e-13, 'kernel sum');
    assert.ok(split.shortFraction >= 0 && split.shortFraction <= 1);
    assert.ok(split.longFraction >= 0 && split.longFraction <= 1);
  }
}

// 3. The screened short-range fraction decays with distance and the long-range fraction grows.
let previousShort = 1;
let previousLong = 0;
for (let index = 1; index <= 1000; index += 1) {
  const split = rangeSeparatedCoulomb(index / 100, 0.3);
  assert.ok(split.shortFraction <= previousShort + 1e-14, `short-range monotonicity at ${index}`);
  assert.ok(split.longFraction >= previousLong - 1e-14, `long-range monotonicity at ${index}`);
  previousShort = split.shortFraction;
  previousLong = split.longFraction;
}

// 4. Global and screened hybrid weights obey their definitions.
for (const distance of [0.2, 1, 5, 20]) {
  const global = hybridExchangeProfile(distance, { exactFraction: 0.25, omega: 0.3, screened: false });
  close(global.exactWeight, 0.25, 1e-14, 'global exact weight');
  close(global.semilocalWeight, 0.75, 1e-14, 'global semilocal weight');
  const screened = hybridExchangeProfile(distance, { exactFraction: 0.25, omega: 0.3, screened: true });
  close(screened.exactWeight, 0.25 * screened.shortFraction, 1e-14, 'screened exact weight');
}
assert.ok(
  hybridExchangeProfile(0.01, { exactFraction: 0.25, omega: 0.3, screened: true }).exactWeight > 0.249,
);
assert.ok(
  hybridExchangeProfile(20, { exactFraction: 0.25, omega: 0.3, screened: true }).exactWeight < 1e-12,
);

// 5. Meta-GGA indicators reproduce one-orbital and uniform-gas limits.
{
  const density = 0.04;
  const gradientMagnitude = 0.02;
  const preliminary = metaGgaIndicators({
    density,
    gradientMagnitude,
    kineticEnergyDensity: gradientMagnitude ** 2 / (8 * density),
  });
  close(preliminary.alpha, 0, 1e-14, 'one-orbital alpha');
  close(preliminary.z, 1, 1e-14, 'one-orbital z');
  const uniform = metaGgaIndicators({
    density,
    gradientMagnitude: 0,
    kineticEnergyDensity: preliminary.tauUnif,
  });
  close(uniform.alpha, 1, 1e-14, 'uniform-gas alpha');
  close(uniform.z, 0, 1e-14, 'uniform-gas z');
}

// 6. tauW and tauUnif have the declared density/gradient scaling.
{
  const first = metaGgaIndicators({ density: 0.02, gradientMagnitude: 0.01, kineticEnergyDensity: 0.2 });
  const second = metaGgaIndicators({ density: 0.16, gradientMagnitude: 0.08, kineticEnergyDensity: 2.0 });
  close(second.tauW / first.tauW, 8, 1e-12, 'tauW scaling for the chosen inputs');
  close(second.tauUnif / first.tauUnif, 32, 1e-11, 'tauUnif density scaling');
}

// 7. Dudarev correction vanishes at integers and is maximal at one half.
for (const occupation of [0, 1]) {
  const model = dudarevOccupationModel({ occupation, baseCurvature: 2, uEffective: 1.5 });
  close(model.correctionEnergy, 0, 1e-14, `integer correction at ${occupation}`);
}
const half = dudarevOccupationModel({ occupation: 0.5, baseCurvature: 2, uEffective: 1.5 });
close(half.correctionEnergy, 1.5 / 8, 1e-14, 'half-occupation correction');
close(half.correctionPotential, 0, 1e-14, 'half-occupation correction potential');

// 8. Choosing Ueff equal to base curvature restores the straight line exactly.
for (let index = 0; index <= 100; index += 1) {
  const occupation = index / 100;
  const model = dudarevOccupationModel({ occupation, additionEnergy: 1.2, baseCurvature: 2.4, uEffective: 2.4 });
  close(model.correctedEnergy, model.straightLineEnergy, 2e-14, `piecewise linearity at ${occupation}`);
  close(model.correctedCurvature, 0, 1e-14, 'corrected curvature');
}

// 9. Correction potential is the finite-difference derivative of the correction energy.
for (const occupation of [0.1, 0.3, 0.7, 0.9]) {
  const step = 1e-7;
  const plus = dudarevOccupationModel({ occupation: occupation + step, uEffective: 1.7 }).correctionEnergy;
  const minus = dudarevOccupationModel({ occupation: occupation - step, uEffective: 1.7 }).correctionEnergy;
  const numerical = (plus - minus) / (2 * step);
  const analytic = dudarevOccupationModel({ occupation, uEffective: 1.7 }).correctionPotential;
  close(numerical, analytic, 3e-10, `Dudarev derivative at ${occupation}`);
}

// 10. Single-pole dynamic polarizability has the correct limits and monotonicity.
close(singlePolePolarizability(0, 10, 0.5), 10, 1e-14, 'static polarizability');
let previousPolarizability = 10;
for (let index = 1; index <= 1000; index += 1) {
  const value = singlePolePolarizability(index / 100, 10, 0.5);
  assert.ok(value < previousPolarizability, `polarizability monotonicity at ${index}`);
  previousPolarizability = value;
}
assert.ok(singlePolePolarizability(100, 10, 0.5) < 0.001);

// 11. Analytic Casimir-Polder C6 is symmetric, linear in each alpha, and matches quadrature.
const parameters = {
  staticPolarizabilityA: 10,
  poleFrequencyA: 0.5,
  staticPolarizabilityB: 8,
  poleFrequencyB: 0.8,
};
const analyticC6 = singlePoleC6(parameters);
const swappedC6 = singlePoleC6({
  staticPolarizabilityA: parameters.staticPolarizabilityB,
  poleFrequencyA: parameters.poleFrequencyB,
  staticPolarizabilityB: parameters.staticPolarizabilityA,
  poleFrequencyB: parameters.poleFrequencyA,
});
close(analyticC6, swappedC6, 1e-14, 'C6 symmetry');
close(
  singlePoleC6({ ...parameters, staticPolarizabilityA: 20 }),
  2 * analyticC6,
  1e-14,
  'C6 alpha linearity',
);
const numericalC6 = numericalCasimirPolderC6({ ...parameters, maximumFrequency: 100, intervals: 200000 });
relativeClose(numericalC6, analyticC6, 2e-8, 'Casimir-Polder quadrature');

// 12. Damped dispersion has the finite short-range limit and long-range R^-6 behavior.
{
  const c6 = analyticC6;
  const dampingLength = 3;
  const short = dampedDispersionEnergy(0.2, c6, dampingLength);
  relativeClose(short.damped, short.shortRangeLimit, 1e-7, 'short-range damped limit');
  const far = dampedDispersionEnergy(30, c6, dampingLength);
  const twiceFar = dampedDispersionEnergy(60, c6, dampingLength);
  close(far.damping, 1, 1e-14, 'far damping');
  close(twiceFar.damped / far.damped, 1 / 64, 1e-14, 'R^-6 scaling');
}

// Invalid-input boundaries.
assert.throws(() => rangeSeparatedCoulomb(0, 0.3), RangeError);
assert.throws(() => hybridExchangeProfile(1, { exactFraction: 1.1 }), RangeError);
assert.throws(() => metaGgaIndicators({ density: 0.04, gradientMagnitude: 0.02, kineticEnergyDensity: 0 }), RangeError);
assert.throws(() => dudarevOccupationModel({ occupation: -0.1 }), RangeError);
assert.throws(() => singlePolePolarizability(-1, 10, 0.5), RangeError);
assert.throws(() => dampedDispersionEnergy(1, -1, 3), RangeError);

console.log('Part II Chapter 9 teaching-model validation passed: 12 deterministic groups.');
