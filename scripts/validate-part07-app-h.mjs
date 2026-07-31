import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  elfFromKinetic,
  elfFromRatio,
  elfShellProfile,
  periodicEnergyGauge,
  periodicKineticGauge,
  spinThomasFermiKineticDensity,
  stressGaugeAt,
  stressGaugeSurfaceFlux,
} from '../src/data/part07/energyStressDensityModel.mjs';

const close = (actual, expected, tolerance = 1e-12, label = 'value') => {
  assert.ok(Number.isFinite(actual), `${label}: non-finite value ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, received ${actual}`);
};

// Periodic energy-density gauge and explicit boundary term.
for (const gaugeAmplitude of [-0.7, 0, 0.45, 0.8]) {
  const gauge = periodicEnergyGauge({ gaugeAmplitude, points: 4096 });
  close(gauge.totalTransformed, gauge.totalBase, 2e-13, `full-period gauge invariance at lambda=${gaugeAmplitude}`);
  close(gauge.regionShift, gauge.analyticBoundaryShift, 0.002, `subregion endpoint flux at lambda=${gaugeAmplitude}`);
}
const fullRegion = periodicEnergyGauge({
  gaugeAmplitude: 0.7,
  regionStart: 0,
  regionEnd: 2 * Math.PI - 1e-12,
  points: 4096,
});
close(fullRegion.totalTransformed, fullRegion.totalBase, 2e-13, 'full cell total');
assert.ok(Math.abs(fullRegion.regionShift) < 0.002, 'nearly complete periodic region must cancel gauge shift');

// Two kinetic-energy gauges and density-Laplacian identity.
for (const amplitude of [0.15, 0.55, 0.85]) {
  const kinetic = periodicKineticGauge({ amplitude, points: 2048 });
  close(kinetic.orbitalNorm, 1, 2e-14, `orbital norm at a=${amplitude}`);
  close(
    kinetic.integralLaplacianGauge,
    kinetic.integralGradientGauge,
    2e-13,
    `kinetic gauge integrals at a=${amplitude}`,
  );
  close(kinetic.integralDensityLaplacian, 0, 2e-13, `periodic density Laplacian at a=${amplitude}`);
  const identityError = Math.max(...kinetic.gaugeDifference.map(
    (value, index) => Math.abs(value - 0.25 * kinetic.densityLaplacian[index]),
  ));
  assert.ok(identityError < 2e-15, `pointwise kinetic gauge identity at a=${amplitude}: ${identityError}`);
}
assert.throws(
  () => periodicKineticGauge({ amplitude: 1 }),
  RangeError,
  'singular or sign-changing profile amplitude must fail closed',
);

// Divergence-free symmetric stress gauge and complete-cut flux invariance.
for (const gaugeAmplitude of [-1, 0, 0.55, 1.1]) {
  const sample = stressGaugeAt({ x: 0.7, y: 1.1, gaugeAmplitude });
  close(sample.tensor[0][1], sample.tensor[1][0], 1e-15, `stress symmetry at A=${gaugeAmplitude}`);
  close(sample.gaugeDivergence[0], 0, 1e-15, `gauge divergence x at A=${gaugeAmplitude}`);
  close(sample.gaugeDivergence[1], 0, 1e-15, `gauge divergence y at A=${gaugeAmplitude}`);
  const flux = stressGaugeSurfaceFlux({
    surfaceX: 0.83,
    gaugeAmplitude,
    points: 4096,
  });
  close(flux.transformedFlux[0], flux.baseFlux[0], 2e-13, `normal flux at A=${gaugeAmplitude}`);
  close(flux.transformedFlux[1], flux.baseFlux[1], 2e-13, `transverse flux at A=${gaugeAmplitude}`);
  close(flux.baseFlux[0], flux.analyticFlux[0], 2e-13, `analytic base flux at A=${gaugeAmplitude}`);
}

// ELF mapping, one-orbital and homogeneous reference limits.
close(elfFromRatio(0), 1, 1e-15, 'ELF one-orbital ratio limit');
close(elfFromRatio(1), 0.5, 1e-15, 'ELF homogeneous ratio limit');
assert.ok(elfFromRatio(100) < 1.1e-4, 'large excess kinetic ratio must drive ELF toward zero');
const density = 0.2;
const gradient = 0.12;
const weizsacker = gradient ** 2 / (8 * density);
const oneOrbital = elfFromKinetic({
  density,
  densityGradient: gradient,
  positiveKineticDensity: weizsacker,
});
close(oneOrbital.excess, 0, 1e-15, 'one-orbital excess kinetic density');
close(oneOrbital.elf, 1, 1e-15, 'one-orbital ELF');
const tTF = spinThomasFermiKineticDensity({ density });
const homogeneous = elfFromKinetic({
  density,
  densityGradient: 0,
  positiveKineticDensity: tTF,
});
close(homogeneous.ratio, 1, 2e-14, 'homogeneous ELF ratio');
close(homogeneous.elf, 0.5, 2e-14, 'homogeneous ELF');
assert.throws(
  () => elfFromKinetic({ density: 0.2, densityGradient: 1, positiveKineticDensity: 0 }),
  RangeError,
  'negative excess kinetic density beyond tolerance must fail closed',
);
const shell = elfShellProfile({ baselineRatio: 0.7, shellContrast: 2.4, shellWidth: 0.14 });
assert.ok(shell.elf.every((value) => value > 0 && value <= 1), 'ELF profile must remain bounded');
assert.ok(shell.minimumElf < shell.maximumElf, 'shell-boundary ratio peaks must produce ELF contrast');

// Content and actual render-tree assembly.
const paths = {
  route: 'src/content/docs/part-07-appendices/appendix-h-energy-and-stress-densities.mdx',
  index: 'src/content/docs/part-07-appendices/index.mdx',
  body: 'src/components/part07/appH/AppendixHBody.astro',
  contents: 'src/components/part07/appH/AppendixHContents.astro',
  orientation: 'src/components/part07/appH/AppendixHOrientation.mdx',
  energy: 'src/components/part07/appH/AppendixHEnergyDensity.mdx',
  stress: 'src/components/part07/appH/AppendixHStressIntegrated.mdx',
  elfReview: 'src/components/part07/appH/AppendixHElfReview.mdx',
  energyVisual: 'src/components/part07/appH/EnergyGaugeExplorer.astro',
  kineticVisual: 'src/components/part07/appH/KineticGaugeExplorer.astro',
  stressVisual: 'src/components/part07/appH/StressGaugeFluxExplorer.astro',
  elfVisual: 'src/components/part07/appH/ElfExplorer.astro',
};
const content = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
);

assert.match(content.route, /<AppendixHBody\s*\/>/, 'route must render AppendixHBody');
assert.match(content.route, /status="appendix-content-complete"/, 'route status must be content complete');
for (const component of [
  'AppendixHContents',
  'AppendixHOrientation',
  'AppendixHEnergyDensity',
  'AppendixHStressIntegrated',
  'AppendixHElfReview',
]) {
  assert.match(content.body, new RegExp(`<${component}\\s*/>`), `body must render ${component}`);
}
for (const section of ['H.1', 'H.2', 'H.3', 'H.4']) {
  assert.ok(content.contents.includes(section), `source map and navigation must contain ${section}`);
}
const combinedSections = `${content.energy}\n${content.stress}\n${content.elfReview}`;
for (const marker of ['section-h-1', 'section-h-2', 'section-h-3', 'section-h-4', 'review']) {
  assert.ok(combinedSections.includes(marker), `content must expose ${marker}`);
}
for (const [container, visual] of [
  ['orientation', 'EnergyGaugeExplorer'],
  ['energy', 'KineticGaugeExplorer'],
  ['stress', 'StressGaugeFluxExplorer'],
  ['elfReview', 'ElfExplorer'],
]) {
  assert.match(content[container], new RegExp(`<${visual}\\s*/>`), `${visual} must be assembled in ${container}`);
}
const visualContracts = ['energyVisual', 'kineticVisual', 'stressVisual', 'elfVisual']
  .map((key) => (content[key].match(/chapter-visual__contract/g) ?? []).length)
  .reduce((sum, count) => sum + count, 0);
assert.equal(visualContracts, 4, 'four visualization contracts must be present');

const combinedText = Object.values(content).join('\n');
assert.doesNotMatch(combinedText, /目录级阅读骨架|outline · 正文待填充|TODO/i, 'Appendix H must not retain outline or TODO markers');
assert.ok((combinedText.match(/bilingual-section__zh/g) ?? []).length >= 24, 'substantive Chinese bilingual coverage');
assert.ok((combinedText.match(/bilingual-section__en/g) ?? []).length >= 24, 'substantive English bilingual coverage');
for (const required of [
  'normalization/notation mismatch',
  'divergence-free',
  'matched-boundary',
  'one occupied spatial orbital',
  'pseudopotential',
  'source figures',
]) {
  assert.ok(combinedText.includes(required), `required scientific boundary missing: ${required}`);
}
assert.ok((content.elfReview.match(/<li><strong>/g) ?? []).length >= 10, 'ten original exercises must be present');
assert.match(
  content.index,
  /\| H · Energy and Stress Densities \| content complete;/,
  'Part VII index must expose Appendix H content-complete state',
);
assert.match(content.index, /\| I–R \| outline \|/, 'Part VII index must preserve later appendices as outlines');
assert.match(
  content.index,
  /\| G · Stress from Electronic Structure \| complete and deployed \|/,
  'Part VII index must retain Appendix G deployed state',
);

console.log('Part VII Appendix H validation passed: energy and kinetic gauges, stress divergence and flux, ELF limits, source conventions, and route assembly.');
