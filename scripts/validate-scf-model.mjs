import assert from 'node:assert/strict';

import { classifyScfIteration, iterateScf } from '../src/lib/scfToyModel.mjs';

function almostEqual(actual, expected, tolerance = 1e-12) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `Expected ${actual} to equal ${expected} within ${tolerance}.`,
  );
}

{
  const result = iterateScf({
    responseSlope: 0,
    mixing: 1,
    initialValue: -2,
    tolerance: 1e-12,
  });

  assert.equal(result.kind, 'one-step');
  assert.equal(result.converged, true);
  assert.equal(result.convergenceIteration, 1);
  almostEqual(result.rows.at(-1).input, 1);
  almostEqual(result.rows.at(-1).residual, 0);
}

{
  const result = iterateScf({
    responseSlope: 0.5,
    mixing: 0.5,
    initialValue: -1,
    tolerance: 1e-14,
    maxIterations: 4,
  });

  assert.equal(result.kind, 'monotone');
  almostEqual(result.q, 0.75);
  for (let index = 1; index < result.rows.length; index += 1) {
    almostEqual(
      result.rows[index].error / result.rows[index - 1].error,
      result.q,
    );
  }
}

{
  const result = iterateScf({
    responseSlope: -1,
    mixing: 0.75,
    initialValue: -1,
    tolerance: 1e-14,
    maxIterations: 5,
  });

  assert.equal(result.kind, 'oscillatory');
  almostEqual(result.q, -0.5);
  for (let index = 1; index < result.rows.length; index += 1) {
    assert.ok(result.rows[index].error * result.rows[index - 1].error < 0);
    assert.ok(
      Math.abs(result.rows[index].error) <
        Math.abs(result.rows[index - 1].error),
    );
  }
}

{
  const result = iterateScf({
    responseSlope: -2,
    mixing: 1,
    initialValue: 0,
    maxIterations: 5,
  });

  assert.equal(result.kind, 'divergent');
  almostEqual(result.q, -2);
  assert.equal(result.converged, false);
  assert.ok(
    Math.abs(result.rows.at(-1).error) > Math.abs(result.rows[0].error),
  );
}

{
  const classification = classifyScfIteration(1, 0.5);
  const result = iterateScf({
    responseSlope: 1,
    mixing: 0.5,
    initialValue: 0,
  });

  assert.equal(classification.kind, 'degenerate');
  assert.equal(result.converged, false);
  assert.equal(result.stoppedReason, 'degenerate-map');
  assert.equal(result.rows.length, 1);
}

console.log('SCF toy-model validation passed: 5 deterministic regimes checked.');
