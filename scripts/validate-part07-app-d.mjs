import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  complexGreen,
  integrateSpectralDensity,
  oscillatorImpulse,
  oscillatorPoles,
  oscillatorResponse,
  sampleOscillator,
  scalarDysonResponse,
  spectralDensity,
  twoLevelPerturbation,
  twoNPlusOneCoefficients,
  variationalEnergy,
} from '../src/data/part07/responseGreenModel.mjs';

const close = (actual, expected, tolerance = 1e-12, label = 'value') => {
  assert.ok(Number.isFinite(actual), `${label}: non-finite value ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, received ${actual}`);
};

// D.1: two-level perturbation and its exact small-coupling limit.
const weak = twoLevelPerturbation({ gap: 2, coupling: 0.1, observableCoupling: 0.7 });
close(weak.firstStateCoefficient, -0.05, 1e-15, 'first state coefficient');
close(weak.secondEnergy, -0.005, 1e-15, 'second-order energy');
close(weak.observableResponse, -0.07, 1e-15, 'observable response');
assert.ok(Math.abs(weak.exactGroundEnergy - weak.secondEnergy) < 2e-5, 'exact ground energy must approach second-order perturbation');
close(twoLevelPerturbation({ gap: 2, coupling: 0 }).exactGroundEnergy, 0, 1e-15, 'zero-coupling exact energy');

// D.3: scalar Dyson and inverse-response identity.
const noFeedback = scalarDysonResponse({ bareResponse: -0.8, kernel: 0 });
close(noFeedback.screenedResponse, -0.8, 1e-15, 'zero-kernel Dyson limit');
const screened = scalarDysonResponse({ bareResponse: -0.8, kernel: 0.6 });
close(screened.screenedResponse, -0.8 / 1.48, 1e-15, 'screened response');
close(1 / screened.screenedResponse, screened.inverseScreened, 1e-14, 'inverse response identity');
assert.throws(() => scalarDysonResponse({ bareResponse: 0, kernel: 1 }), RangeError, 'zero bare response must fail closed');
assert.throws(() => scalarDysonResponse({ bareResponse: -1, kernel: -1 }), RangeError, 'singular Dyson denominator must fail closed');

// D.4: causal oscillator limits and pole positions.
const staticOscillator = oscillatorResponse({ omega: 0, omega0: 1, damping: 0.12 });
close(staticOscillator.real, 1, 1e-15, 'static oscillator response');
close(staticOscillator.imaginary, 0, 1e-15, 'static oscillator loss');
const resonance = oscillatorResponse({ omega: 1, omega0: 1, damping: 0.1 });
close(resonance.real, 0, 1e-14, 'resonance real part');
close(resonance.imaginary, 10, 1e-12, 'resonance imaginary part');
const negativeFrequency = oscillatorResponse({ omega: -1, omega0: 1, damping: 0.1 });
close(negativeFrequency.imaginary, -10, 1e-12, 'odd loss under frequency reversal');
oscillatorPoles({ omega0: 1, damping: 0.12 }).forEach((pole, index) => {
  assert.ok(pole.imaginary < 0, `retarded pole ${index} must be in the lower half-plane`);
});
close(oscillatorImpulse({ time: -0.5, omega0: 1, damping: 0.12 }), 0, 1e-15, 'causal impulse at negative time');
assert.ok(oscillatorImpulse({ time: 0.5, omega0: 1, damping: 0.12 }) > 0, 'positive-time impulse must be finite');
const oscillatorSamples = sampleOscillator({ damping: 0.12, count: 301 });
assert.equal(oscillatorSamples.length, 301, 'oscillator sample count');
oscillatorSamples.forEach((point, index) => {
  assert.ok(Number.isFinite(point.real) && Number.isFinite(point.imaginary), `oscillator sample ${index} must be finite`);
});

// D.5: Green-function sign, positivity, and integrated spectral weight.
const levels = [-0.9, 0.15, 1.0];
const weights = [0.7, 1.0, 0.55];
const poleValue = complexGreen({ energy: 0.15, broadening: 0.08, levels, weights });
assert.ok(poleValue.imaginary < 0, 'retarded diagonal Green function must have negative imaginary part');
for (const energy of [-2, -0.9, 0, 0.15, 1, 2]) {
  assert.ok(spectralDensity({ energy, broadening: 0.08, levels, weights }) >= 0, `spectral density at ${energy} must be non-negative`);
}
const integrated = integrateSpectralDensity({
  minEnergy: -10,
  maxEnergy: 10,
  intervals: 60000,
  broadening: 0.08,
  levels,
  weights,
});
close(integrated, weights.reduce((sum, value) => sum + value, 0), 0.015, 'finite-window spectral weight');
assert.ok(
  spectralDensity({ energy: 0.15, broadening: 0.04, levels, weights })
  > spectralDensity({ energy: 0.15, broadening: 0.20, levels, weights }),
  'smaller broadening must raise the on-pole peak',
);
assert.throws(
  () => complexGreen({ energy: 0, broadening: 0.1, levels: [0], weights: [-1] }),
  RangeError,
  'negative spectral weights must fail closed',
);

// D.6: explicit 2n+1 cancellation in the scalar stationary model.
const parameters = { a: 2.4, b: -0.8, c: 0.35, d: -0.25 };
const order = twoNPlusOneCoefficients(parameters);
close(order.energy3IncludingX2, order.energy3FromFirstOrder, 1e-14, '2n+1 x2 cancellation');
close(parameters.a * order.x1 + parameters.b, 0, 1e-15, 'first-order stationarity');
const lambda = 1e-4;
const trial = lambda * order.x1 + lambda ** 2 * order.x2;
const series = lambda ** 2 * order.energy2 + lambda ** 3 * order.energy3FromFirstOrder;
close(variationalEnergy({ x: trial, lambda, ...parameters }), series, 2e-13, 'variational energy through third order');

// Content and assembly checks: source sections, route imports, and rendered visual tree.
const paths = {
  route: 'src/content/docs/part-07-appendices/appendix-d-perturbation-theory-response-functions-and-green-s-functions.mdx',
  body: 'src/components/part07/appD/AppendixDBody.astro',
  contents: 'src/components/part07/appD/AppendixDContents.astro',
  orientation: 'src/components/part07/appD/AppendixDOrientation.mdx',
  perturbation: 'src/components/part07/appD/AppendixDPerturbationStatic.mdx',
  dynamic: 'src/components/part07/appD/AppendixDDynamicGreen.mdx',
  review: 'src/components/part07/appD/AppendixDTwoNPlusOneReview.mdx',
  map: 'src/components/part07/appD/PerturbationResponseMap.astro',
  dyson: 'src/components/part07/appD/DysonFeedbackExplorer.astro',
  oscillator: 'src/components/part07/appD/CausalOscillatorExplorer.astro',
  green: 'src/components/part07/appD/GreenSpectralExplorer.astro',
  twoN: 'src/components/part07/appD/TwoNPlusOneOrderMap.astro',
};
const content = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
);

assert.match(content.route, /<AppendixDBody\s*\/>/, 'route must render AppendixDBody');
for (const component of [
  'AppendixDContents',
  'AppendixDOrientation',
  'AppendixDPerturbationStatic',
  'AppendixDDynamicGreen',
  'AppendixDTwoNPlusOneReview',
]) {
  assert.match(content.body, new RegExp(`<${component}\\s*/>`), `body must render ${component}`);
}
for (const section of ['D.1', 'D.2', 'D.3', 'D.4', 'D.5', 'D.6']) {
  assert.ok(content.contents.includes(section), `source map must contain ${section}`);
}
for (const marker of [
  'section-d-1',
  'section-d-2',
  'section-d-3',
  'section-d-4',
  'section-d-5',
  'section-d-6',
]) {
  const combined = `${content.perturbation}\n${content.dynamic}\n${content.review}`;
  assert.ok(combined.includes(marker), `content must expose ${marker}`);
}
for (const [container, visual] of [
  ['perturbation', 'PerturbationResponseMap'],
  ['perturbation', 'DysonFeedbackExplorer'],
  ['dynamic', 'CausalOscillatorExplorer'],
  ['dynamic', 'GreenSpectralExplorer'],
  ['review', 'TwoNPlusOneOrderMap'],
]) {
  assert.match(content[container], new RegExp(`<${visual}\\s*/>`), `${visual} must be assembled in ${container}`);
}
const visualContracts = ['map', 'dyson', 'oscillator', 'green', 'twoN']
  .map((key) => (content[key].match(/chapter-visual__contract/g) ?? []).length)
  .reduce((sum, count) => sum + count, 0);
assert.equal(visualContracts, 5, 'five visual contracts must be present');
const combinedText = Object.values(content).join('\n');
assert.doesNotMatch(combinedText, /outline · 正文待填充|TODO/i, 'Appendix D must not retain outline or TODO markers');
assert.ok((combinedText.match(/bilingual-section__zh/g) ?? []).length >= 18, 'substantive Chinese bilingual coverage');
assert.ok((combinedText.match(/bilingual-section__en/g) ?? []).length >= 18, 'substantive English bilingual coverage');

console.log('Part VII Appendix D validation passed: perturbation, Dyson response, causality, spectral weight, 2n+1, and route assembly.');
