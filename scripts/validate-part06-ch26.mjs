import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  analyticTwoSiteGap,
  pumpCriticalDistance,
  pumpWannierFlow,
  samplePumpTopology,
  sampledTwoSiteGap,
  sshEdgeProfile,
  sshWinding,
  twoBandState,
  twoSiteSpectrum,
  wrapAngle,
} from '../src/data/part06/ch26TeachingModels.mjs';

const tolerance = 1e-10;

function close(actual, expected, limit = tolerance, message = '') {
  assert.ok(
    Math.abs(actual - expected) <= limit,
    `${message || 'value mismatch'}: ${actual} vs ${expected} (limit ${limit})`,
  );
}

// General two-band decomposition: direction fixes projectors, radius fixes the gap,
// and d0 shifts both energies without changing the splitting.
const reference = twoBandState(Math.PI / 3, Math.PI / 4, 1.25, 0);
const shifted = twoBandState(Math.PI / 3, Math.PI / 4, 1.25, -0.6);
close(Math.hypot(reference.unit.x, reference.unit.y, reference.unit.z), 1);
close(reference.gap, 2.5);
close(shifted.gap, reference.gap);
close(shifted.lower - reference.lower, -0.6);
close(shifted.upper - reference.upper, -0.6);
close(shifted.unit.x, reference.unit.x);
close(shifted.unit.y, reference.unit.y);
close(shifted.unit.z, reference.unit.z);
const closing = twoBandState(0.4, -0.8, 0, 2);
assert.equal(closing.closed, true);
assert.equal(closing.unit, null);
close(closing.lower, 2);
close(closing.upper, 2);
assert.throws(() => twoBandState(0, 0, -1), RangeError);
close(wrapAngle(3 * Math.PI), -Math.PI);

// Two-site spectrum and the analytic direct-gap formula.
for (const [t1, t2, delta] of [
  [0.55, 1, 0],
  [1.2, 0.4, 0.3],
  [-0.7, 1.1, 0.2],
  [1, 1, 0],
]) {
  const analytic = analyticTwoSiteGap(t1, t2, delta);
  const sampled = sampledTwoSiteGap(t1, t2, delta, 4001);
  assert.ok(
    Math.abs(sampled.gap - analytic) < 2e-3,
    `sampled two-site gap mismatch for (${t1}, ${t2}, ${delta}): ${sampled.gap} vs ${analytic}`,
  );
}
const spectrum = twoSiteSpectrum(Math.PI, 0.55, 1, 0.2, 0.3);
close(spectrum.dx, -0.45);
close(spectrum.dy, 0, 1e-12);
close(spectrum.dz, 0.2);
close(spectrum.upper - spectrum.lower, spectrum.gap);

// Symmetry-qualified SSH winding and the analytic semi-infinite end state.
assert.deepEqual(sshWinding(0.5, 1), {
  winding: 1,
  berryPhase: Math.PI,
  gapClosed: false,
});
assert.deepEqual(sshWinding(1, 0.5), {
  winding: 0,
  berryPhase: 0,
  gapClosed: false,
});
assert.deepEqual(sshWinding(1, 1), {
  winding: null,
  berryPhase: null,
  gapClosed: true,
});
const localized = sshEdgeProfile(0.5, 1, 24);
assert.equal(localized.normalizable, true);
close(localized.ratio, -0.5);
close(localized.localizationLength, 1 / Math.log(2));
close(localized.amplitudes.reduce((sum, value) => sum + value * value, 0), 1, 1e-12);
for (let index = 0; index < localized.amplitudes.length - 1; index += 1) {
  close(localized.amplitudes[index + 1] / localized.amplitudes[index], -0.5, 1e-12);
}
assert.equal(sshEdgeProfile(1, 0.5, 12).normalizable, false);
assert.equal(sshEdgeProfile(0.5, 0, 12).normalizable, false);

// Pump topology: one enclosed singularity gives lower-band C=+1 in the declared
// orientation, no enclosed net charge gives C=0, and a cycle through a degeneracy
// is rejected analytically rather than being missed by a finite mesh.
for (const mesh of [15, 21, 31, 41]) {
  const topological = samplePumpTopology(1, 0.65, 1, 1, mesh);
  assert.equal(topological.gapClosed, false);
  assert.equal(topological.mappingDegree, -1);
  assert.equal(topological.lowerBandChern, 1);
  assert.ok(topological.minimumGap > 1.2);
  assert.ok(Math.abs(topological.residual) < 1e-8);

  const trivial = samplePumpTopology(2, 0.65, 1, 1, mesh);
  assert.equal(trivial.gapClosed, false);
  assert.equal(trivial.mappingDegree, 0);
  assert.equal(trivial.lowerBandChern, 0);
  assert.ok(trivial.minimumGap > 0.65);
  assert.ok(Math.abs(trivial.residual) < 1e-8);
}
close(pumpCriticalDistance(0.35, 0.65, 1), 0, 1e-12);
close(pumpCriticalDistance(1.65, 0.65, 1), 0, 1e-12);
for (const center of [0.35, 1.65]) {
  const result = samplePumpTopology(center, 0.65, 1, 1, 31);
  assert.equal(result.gapClosed, true);
  assert.equal(result.minimumGap, 0);
  assert.equal(result.mappingDegree, null);
  assert.equal(result.lowerBandChern, null);
  assert.throws(() => pumpWannierFlow(center, 0.65, 1, 1), RangeError);
}

const quantizedFlow = pumpWannierFlow(1, 0.65, 1, 1, 65, 181);
const trivialFlow = pumpWannierFlow(2, 0.65, 1, 1, 65, 181);
close(quantizedFlow.netShift, 1, 1e-8);
close(trivialFlow.netShift, 0, 1e-8);
assert.equal(quantizedFlow.centers.length, 65);
assert.equal(trivialFlow.centers.length, 65);

// Static chapter-contract checks: all Martin sections are present, three original
// model figures retain explicit contracts, and the multiband nanoribbon boundary is stated.
const contentFiles = [
  '../src/components/part06/ch26/Chapter26TwoBandFoundations.mdx',
  '../src/components/part06/ch26/Chapter26ShockleyAndWinding.mdx',
  '../src/components/part06/ch26/Chapter26ChernPumpAndNanoribbons.mdx',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));
const chapterText = contentFiles.join('\n');
for (const section of ['26.1', '26.2', '26.3', '26.4', '26.5', '26.6', '26.7']) {
  assert.ok(chapterText.includes(section), `Chapter 26 section ${section} is missing`);
}
assert.ok(chapterText.includes('完整 occupied manifold'));
assert.ok(chapterText.includes('full occupied manifold'));
assert.ok(chapterText.includes('【版权边界】'));

for (const visual of [
  '../src/components/part06/ch26/TwoBandSphereExplorer.astro',
  '../src/components/part06/ch26/WindingEdgeExplorer.astro',
  '../src/components/part06/ch26/ThoulessPumpExplorer.astro',
]) {
  const source = readFileSync(new URL(visual, import.meta.url), 'utf8');
  assert.ok(source.includes('chapter-visual__contract'), `${visual} lacks an evidence contract`);
  assert.ok(source.includes('<noscript>'), `${visual} lacks a no-JavaScript fallback`);
  assert.ok(source.includes('<svg'), `${visual} lacks a static SVG`);
}

console.log('Part VI Chapter 26 teaching-model validation passed.');
console.log('Checked two-band spectra/projectors, analytic gaps, SSH winding and edge decay, pump Chern number, Wannier flow, gap-closing rejection, and static evidence contracts.');
