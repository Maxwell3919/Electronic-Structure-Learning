import assert from 'node:assert/strict';

import {
  diagonalPreconditioner,
  iterateLinearMixingMode,
  linearMixingMode,
  pawTeachingProfile,
  periodicImageTeachingError,
} from '../src/data/part04/ch13TeachingModels.mjs';

const close = (actual, expected, tolerance = 1e-12, message = '') => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${message} expected ${expected}, received ${actual}`,
  );
};

// One-step and spectral classification for the affine SCF mode.
const oneStep = linearMixingMode({ responseSlope: 0, alpha: 1 });
close(oneStep.factor, 0, 1e-14, 'one-step factor');
assert.equal(oneStep.oneStep, true);
assert.equal(oneStep.stable, true);

const damped = linearMixingMode({ responseSlope: -3, alpha: 0.2 });
close(damped.factor, 0.2, 1e-14, 'damped factor');
assert.equal(damped.stable, true);
assert.equal(damped.oscillatory, false);

const oscillatory = linearMixingMode({ responseSlope: -3, alpha: 0.4 });
close(oscillatory.factor, -0.6, 1e-14, 'oscillatory factor');
assert.equal(oscillatory.stable, true);
assert.equal(oscillatory.oscillatory, true);

const divergent = linearMixingMode({ responseSlope: -3, alpha: 0.6 });
close(divergent.factor, -1.4, 1e-14, 'divergent factor');
assert.equal(divergent.stable, false);

const trace = iterateLinearMixingMode({ responseSlope: -3, alpha: 0.2, initialError: 1, steps: 5 });
assert.equal(trace.values.length, 6);
trace.values.forEach((value, index) => close(value, 0.2 ** index, 1e-13, `trace step ${index}`));

// Reciprocal-space diagonal preconditioner limits.
close(diagonalPreconditioner({ wavevector: 0, screeningWavevector: 1 }), 0, 1e-14, 'G=0 preconditioner');
close(diagonalPreconditioner({ wavevector: 1, screeningWavevector: 1 }), 0.5, 1e-14, 'G=G0 preconditioner');
close(diagonalPreconditioner({ wavevector: 10, screeningWavevector: 1 }), 100 / 101, 1e-14, 'large-G preconditioner');

// PAW teaching correction is compactly supported and vanishes at zero amplitude.
for (const radius of [1.6, 2, 3.5, 5]) {
  const profile = pawTeachingProfile({ radius, augmentationRadius: 1.6, amplitude: 1.1 });
  close(profile.correction, 0, 1e-14, `PAW correction outside sphere at r=${radius}`);
  close(profile.reconstructed, profile.smooth, 1e-14, `PAW reconstruction outside sphere at r=${radius}`);
  assert.equal(profile.outsideAugmentation, true);
}
for (const radius of [0, 0.3, 1, 1.6, 3]) {
  const profile = pawTeachingProfile({ radius, augmentationRadius: 1.6, amplitude: 0 });
  close(profile.reconstructed, profile.smooth, 1e-14, `zero-amplitude PAW profile at r=${radius}`);
}
assert.notEqual(
  pawTeachingProfile({ radius: 0.4, augmentationRadius: 1.6, amplitude: 0.8 }).correction,
  0,
  'PAW correction should be nonzero at a representative interior point',
);

// The declared short-range periodic-image model has an exact e^-1 ratio per decay length.
const imageAt6 = periodicImageTeachingError({ cellLength: 6, decayLength: 2 });
const imageAt8 = periodicImageTeachingError({ cellLength: 8, decayLength: 2 });
close(imageAt8 / imageAt6, Math.exp(-1), 1e-14, 'image-error ratio');
let previous = periodicImageTeachingError({ cellLength: 4, decayLength: 2 });
for (let length = 5; length <= 20; length += 1) {
  const current = periodicImageTeachingError({ cellLength: length, decayLength: 2 });
  assert.ok(current < previous, `image error must decrease at L=${length}`);
  previous = current;
}

console.log('Part IV Chapter 13 teaching-model validation passed: 5 deterministic groups.');
