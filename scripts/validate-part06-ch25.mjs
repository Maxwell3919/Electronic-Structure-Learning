import assert from 'node:assert/strict';
import {
  analyticGap,
  berryPhase,
  fhsChernNumber,
  qwzDirectGap,
  sampledGap,
} from '../src/data/part06/ch25TeachingModels.mjs';

const tolerance = 1e-10;

for (const mass of [-2.2, -1.4, -1, -0.3, 0, 0.7, 1, 1.8, 2.4]) {
  const sampled = sampledGap(mass, 4001).gap;
  assert.ok(
    Math.abs(sampled - analyticGap(mass)) < 2e-3,
    `sampled gap mismatch at m=${mass}: ${sampled} vs ${analyticGap(mass)}`,
  );
}
assert.ok(analyticGap(-1) < tolerance, 'm=-1 must close the 1D model gap');
assert.ok(analyticGap(1) < tolerance, 'm=1 must close the 1D model gap');
assert.ok(analyticGap(0) > 1.9, 'm=0 must be gapped in the declared 1D model');

for (const theta of [0, Math.PI / 5, Math.PI / 2, 0.9 * Math.PI, Math.PI]) {
  const reference = berryPhase(theta, 0);
  for (const winding of [-2, -1, 1, 2]) {
    const transformed = berryPhase(theta, winding);
    assert.ok(
      Math.abs(transformed.gaugeShifted - reference.base + 2 * Math.PI * winding) < tolerance,
      `gauge shift mismatch for theta=${theta}, winding=${winding}`,
    );
    assert.ok(Math.abs(transformed.invariant.re - reference.invariant.re) < tolerance);
    assert.ok(Math.abs(transformed.invariant.im - reference.invariant.im) < tolerance);
  }
}

const regimes = [
  { mass: -3, expected: 0 },
  { mass: -1, expected: -1 },
  { mass: 1, expected: 1 },
  { mass: 3, expected: 0 },
];
for (const grid of [11, 21, 41, 61]) {
  for (const { mass, expected } of regimes) {
    const plain = fhsChernNumber(mass, grid, false);
    const gauged = fhsChernNumber(mass, grid, true);
    assert.equal(plain.chern, expected, `Chern mismatch at m=${mass}, N=${grid}`);
    assert.equal(gauged.chern, expected, `gauged Chern mismatch at m=${mass}, N=${grid}`);
    assert.ok(Math.abs(plain.raw - expected) < 1e-8);
    assert.ok(Math.abs(gauged.raw - expected) < 1e-8);
    assert.ok(Math.abs(plain.raw - gauged.raw) < 1e-8);
  }
}

for (const closing of [-2, 0, 2]) {
  assert.equal(qwzDirectGap(closing), 0);
  const result = fhsChernNumber(closing, 31);
  assert.equal(result.valid, false);
  assert.equal(result.chern, null);
}

console.log('Part VI Chapter 25 teaching-model validation passed.');
console.log('Checked 1D gap closures, gauge-invariant Berry phase, QWZ integer regimes, gauge invariance, and gap-closing rejection.');
