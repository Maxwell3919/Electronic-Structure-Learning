import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  compositeGaugeRotation,
  hybridCenter,
  sampleEntangledWindow,
  sampleGaugeWannier,
  sampleInterpolationError,
  twoLevelEntangledPoint,
} from '../src/data/part05/ch23WannierModels.mjs';
import { sampleSpinorOverlapLoop } from '../src/data/part05/ch23OverlapModels.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const near = (actual, expected, tolerance, message) => {
  assert(Number.isFinite(actual), `${message}: actual is not finite`);
  assert(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} vs ${expected}`);
};

const checks = [];
const check = (name, fn) => {
  fn();
  checks.push(name);
};

check('single-band gauge translation and localization', () => {
  for (const shift of [-3, 0, 2, 4]) {
    const result = sampleGaugeWannier({ kPoints: 41, phaseShift: shift, phaseRipple: 0 });
    near(result.center, shift, 1e-12, `integer gauge centre ${shift}`);
    near(result.spread, 0, 1e-12, `integer gauge spread ${shift}`);
    near(result.norm, 1, 1e-15, `integer gauge norm ${shift}`);
    assert(result.peakCell === shift, `integer gauge peak cell ${shift}`);
  }

  const smooth = sampleGaugeWannier({ kPoints: 81, phaseShift: 2, phaseRipple: 1.1 });
  assert(smooth.spread > 0.1, 'smooth nonlinear gauge should create real-space tails');
  near(smooth.center, 2, 1e-10, 'smooth periodic gauge centre branch');
  near(smooth.norm, 1, 1e-15, 'smooth gauge norm');

  const referenceBand = sampleGaugeWannier({ kPoints: 41, phaseShift: 0, phaseRipple: 0 }).band;
  const shiftedBand = sampleGaugeWannier({ kPoints: 41, phaseShift: 3, phaseRipple: 1 }).band;
  assert(
    referenceBand.every((point, index) => Math.abs(point.energy - shiftedBand[index].energy) < 1e-15),
    'gauge changes must not change band energies',
  );
});

check('composite-subspace projector invariance', () => {
  const atomic = compositeGaugeRotation({ theta: 0, separation: 0.7 });
  near(atomic.centers[0], 0, 1e-15, 'atomic frame centre 1');
  near(atomic.centers[1], 0.7, 1e-15, 'atomic frame centre 2');
  near(atomic.totalSpread, 0, 1e-15, 'atomic frame spread');

  for (const theta of [0.2, 0.7, Math.PI / 4, 1.2]) {
    const result = compositeGaugeRotation({ theta, separation: 0.7 });
    near(result.projector[0][0], 1, 1e-14, 'projector 00');
    near(result.projector[1][1], 1, 1e-14, 'projector 11');
    near(result.projector[0][1], 0, 1e-14, 'projector 01');
    near(result.projector[1][0], 0, 1e-14, 'projector 10');
    near(result.centerSum, 0.7, 1e-14, 'centre sum invariant');
    assert(result.totalSpread >= -1e-15, 'composite spread non-negative');
  }

  const mixed = compositeGaugeRotation({ theta: Math.PI / 4, separation: 0.7 });
  near(mixed.centers[0], 0.35, 1e-14, 'maximally mixed centre 1');
  near(mixed.centers[1], 0.35, 1e-14, 'maximally mixed centre 2');
  assert(mixed.totalSpread > 0, 'mixed frame must have finite spread');
});

check('discrete-overlap gauge and branch behavior', () => {
  const base = sampleSpinorOverlapLoop({
    kPoints: 32,
    polarAngle: 1.1,
    physicalWinding: 1,
    gaugeWinding: 0,
  });
  const gauge = sampleSpinorOverlapLoop({
    kPoints: 32,
    polarAngle: 1.1,
    physicalWinding: 1,
    gaugeWinding: 2,
  });
  near(gauge.centerModulo, base.centerModulo, 1e-12, 'principal centre gauge invariance');
  near(gauge.invariantMetric, base.invariantMetric, 1e-12, 'overlap metric gauge invariance');
  near(gauge.minOverlap, base.minOverlap, 1e-12, 'overlap magnitude gauge invariance');
  near(gauge.centerUnwrapped - base.centerUnwrapped, -2, 1e-12, 'integer centre branch shift');

  const coarse = sampleSpinorOverlapLoop({ kPoints: 16, polarAngle: 1.1 });
  const fine = sampleSpinorOverlapLoop({ kPoints: 128, polarAngle: 1.1 });
  assert(fine.minOverlap > coarse.minOverlap, 'neighbor overlap approaches one on mesh refinement');
  assert(fine.invariantMetric < coarse.invariantMetric, 'discrete metric decreases on mesh refinement');
});

check('entangled-window candidate-space fidelity', () => {
  const full = sampleEntangledWindow({ coupling: 0.12, outerMin: -2, outerMax: 2, points: 161 });
  near(full.minFidelity, 1, 1e-14, 'complete candidate-space minimum fidelity');
  near(full.meanFidelity, 1, 1e-14, 'complete candidate-space mean fidelity');
  assert(full.missingPoints === 0, 'complete candidate space has no missing points');

  const narrow = sampleEntangledWindow({ coupling: 0.12, outerMin: -0.5, outerMax: 0.5, points: 161 });
  assert(narrow.minFidelity < 0.8, 'narrow window loses target character');
  assert(narrow.missingPoints > 0, 'narrow window has incomplete k points');

  const point = twoLevelEntangledPoint({ k: Math.PI / 2, coupling: 0.2, outerMin: -2, outerMax: 2 });
  near(point.fidelity, 1, 1e-14, 'two-eigenstate completeness');
  near(
    point.states.reduce((sum, state) => sum + state.targetWeight, 0),
    1,
    1e-14,
    'target-weight sum',
  );
});

check('real-space hopping interpolation limits', () => {
  const exact = sampleInterpolationError({ cutoff: 12, maxRange: 12, decayLength: 1.8, points: 401 });
  near(exact.maxError, 0, 1e-14, 'full-range maximum error');
  near(exact.rmsError, 0, 1e-14, 'full-range RMS error');

  const errors = [1, 2, 3, 5, 8, 12].map((cutoff) =>
    sampleInterpolationError({ cutoff, maxRange: 12, decayLength: 1.8, points: 401 }).maxError,
  );
  assert(
    errors.every((value, index) => index === 0 || value <= errors[index - 1] + 1e-12),
    'maximum interpolation error must not increase with cutoff for this model',
  );

  const shortRange = sampleInterpolationError({ cutoff: 3, maxRange: 12, decayLength: 0.8, points: 401 });
  const longRange = sampleInterpolationError({ cutoff: 3, maxRange: 12, decayLength: 3.5, points: 401 });
  assert(longRange.maxError > shortRange.maxError, 'longer decay length requires a larger cutoff');
  assert(longRange.rmsError > shortRange.rmsError, 'longer decay length increases RMS truncation error');
});

check('hybrid-centre lattice branch', () => {
  const trivial0 = hybridCenter({ transverseMomentum: 0, baseCenter: 0.35, modulation: 0.18, winding: 0 });
  const trivial2pi = hybridCenter({ transverseMomentum: 2 * Math.PI, baseCenter: 0.35, modulation: 0.18, winding: 0 });
  near(trivial0.wrapped, trivial2pi.wrapped, 1e-14, 'zero-winding closed loop');

  const winding0 = hybridCenter({ transverseMomentum: 0, baseCenter: 0.35, modulation: 0.18, winding: 1 });
  const winding2pi = hybridCenter({ transverseMomentum: 2 * Math.PI, baseCenter: 0.35, modulation: 0.18, winding: 1 });
  near(winding0.wrapped, winding2pi.wrapped, 1e-14, 'wrapped centre closes modulo lattice');
  near(winding2pi.unwrapped - winding0.unwrapped, 1, 1e-14, 'unwrapped centre changes one lattice branch');
});

check('chapter content completeness and hygiene', () => {
  const routePath = 'src/content/docs/part-05-properties-of-matter/chapter-23-wannier-functions.mdx';
  const bodyPath = 'src/components/part05/ch23/Chapter23Body.astro';
  const contentsPath = 'src/components/part05/ch23/Chapter23Contents.astro';
  const sourceMapPath = 'src/components/part05/ch23/Chapter23SourceMap.astro';
  const contentPaths = [
    'src/components/part05/ch23/Chapter23OrientationAndTerms.mdx',
    'src/components/part05/ch23/Chapter23DefinitionsProjected.mdx',
    'src/components/part05/ch23/Chapter23Localization.mdx',
    'src/components/part05/ch23/Chapter23NonorthogonalEntangled.mdx',
    'src/components/part05/ch23/Chapter23HybridApplications.mdx',
    'src/components/part05/ch23/Chapter23Closing.mdx',
  ];
  const visualPaths = [
    'src/components/part05/ch23/GaugeLocalizationExplorer.astro',
    'src/components/part05/ch23/CompositeGaugeExplorer.astro',
    'src/components/part05/ch23/OverlapBranchExplorer.astro',
    'src/components/part05/ch23/DisentanglementWindowExplorer.astro',
    'src/components/part05/ch23/InterpolationLocalityExplorer.astro',
  ];

  const route = read(routePath);
  const body = read(bodyPath);
  const contents = read(contentsPath);
  const sourceMap = read(sourceMapPath);
  const content = contentPaths.map(read).join('\n');
  const visuals = visualPaths.map(read);
  const corpus = [route, body, contents, sourceMap, content, ...visuals].join('\n');

  assert(route.includes('<SourceNote'), 'route SourceNote');
  assert(route.includes('<Chapter23Contents />') && route.includes('<Chapter23Body />'), 'route assembly');
  assert(!route.includes('<ReadingOutline'), 'outline component must be removed');
  assert(!route.includes('正文待填充'), 'outline placeholder must be removed');

  for (let section = 1; section <= 7; section += 1) {
    assert(content.includes(`id=\"section-23-${section}\"`), `missing section 23.${section}`);
    assert(sourceMap.includes(`'23.${section}'`), `source map missing 23.${section}`);
  }
  assert((contents.match(/\['[^']+',/g) ?? []).length === 13, 'contents link count');
  assert((content.match(/<BilingualSection/g) ?? []).length >= 20, 'bilingual section count');
  assert(content.includes('原创练习') && content.includes('Original Exercises'), 'original exercises');
  for (const required of [
    'band subspace', 'gauge/frame', 'spread', 'Nonorthogonal', 'outer window', 'frozen window',
    'Hybrid Wannier', 'interpolation', 'matrix elements', 'topological', '不能', 'not',
  ]) assert(corpus.includes(required), `missing content boundary: ${required}`);

  for (const visualPath of visualPaths) {
    const visual = read(visualPath);
    assert(visual.includes('<figure class=\"chapter-visual'), `${visualPath}: figure class`);
    assert(visual.includes('chapter-visual__contract'), `${visualPath}: model contract`);
    assert(visual.includes('<noscript>'), `${visualPath}: no-JS fallback`);
    assert(visual.includes('无 JavaScript fallback'), `${visualPath}: bilingual fallback label`);
    assert(visual.includes('<input'), `${visualPath}: keyboard-operable input`);
    assert(visual.includes('role=\"img\"'), `${visualPath}: accessible SVG role`);
  }

  const controlCharacters = corpus.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g) ?? [];
  assert(controlCharacters.length === 0, `forbidden control characters: ${controlCharacters.length}`);
  assert(!/\bTODO\b|\bTBD\b|lorem ipsum/i.test(corpus), 'unfinished placeholders');
  assert(!/POTCAR|WAVECAR|CHGCAR|BEGIN PRIVATE KEY|ghp_[A-Za-z0-9]/.test(corpus), 'restricted or secret material');
});

console.log(`Chapter 23 validation passed (${checks.length} checks):`);
for (const name of checks) console.log(`  - ${name}`);
