import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  adiabaticSeparationRatio,
  carParrinelloFrequencyModel,
  forceNoiseSequence,
  harmonicExactState,
  simulateVelocityVerlet,
} from '../src/data/part05/ch19TeachingModels.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const nearlyEqual = (actual, expected, tolerance, message) => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${message}: expected ${expected}, received ${actual}`,
  );
};

const exactQuarterPeriod = harmonicExactState({
  omega: 2,
  time: Math.PI / 4,
  x0: 1,
  v0: 0,
});
nearlyEqual(exactQuarterPeriod.position, 0, 1e-12, 'quarter-period position');
nearlyEqual(exactQuarterPeriod.velocity, -2, 1e-12, 'quarter-period velocity');

const onePeriod = 2 * Math.PI;
const coarse = simulateVelocityVerlet({
  omega: 1,
  dt: onePeriod / 40,
  steps: 40,
});
const fine = simulateVelocityVerlet({
  omega: 1,
  dt: onePeriod / 80,
  steps: 80,
});
const errorRatio = coarse.maxPositionError / fine.maxPositionError;
assert.ok(
  errorRatio > 3.8 && errorRatio < 4.2,
  `velocity-Verlet fixed-time error should be second order; ratio=${errorRatio}`,
);
assert.ok(
  fine.maxRelativeEnergyDeviation < coarse.maxRelativeEnergyDeviation,
  'halving the timestep should reduce the maximum harmonic energy deviation',
);
assert.ok(
  fine.stabilityParameter === onePeriod / 80,
  'stability parameter must equal omega * dt for omega=1',
);

const cpBase = carParrinelloFrequencyModel({ gap: 2, fictitiousMass: 100 });
const cpFourMass = carParrinelloFrequencyModel({ gap: 2, fictitiousMass: 400 });
nearlyEqual(cpBase / cpFourMass, 2, 1e-12, 'CP mass scaling');

const separation = adiabaticSeparationRatio({
  gap: 2,
  fictitiousMass: 400,
  ionicFrequency: 0.08,
});
nearlyEqual(separation.electronicFrequency, 0.1, 1e-12, 'electronic model frequency');
nearlyEqual(separation.ratio, 1.25, 1e-12, 'frequency-separation ratio');

const alternating = forceNoiseSequence({ amplitude: 0.03, steps: 100, mode: 'alternating' });
const biased = forceNoiseSequence({ amplitude: 0.03, steps: 100, mode: 'biased' });
nearlyEqual(
  alternating.reduce((sum, value) => sum + value, 0),
  0,
  1e-12,
  'alternating force error should have zero net impulse for an even step count',
);
nearlyEqual(
  biased.reduce((sum, value) => sum + value, 0),
  3,
  1e-12,
  'biased force error should accumulate linearly',
);

const chapterPath = 'src/content/docs/part-05-properties-of-matter/chapter-19-quantum-molecular-dynamics-qmd.mdx';
const chapter = await read(chapterPath);
const componentPaths = [
  'src/components/part05/ch19/Chapter19OrientationAndTerms.mdx',
  'src/components/part05/ch19/Chapter19Forces.mdx',
  'src/components/part05/ch19/Chapter19BOMD.mdx',
  'src/components/part05/ch19/Chapter19CPMD.mdx',
  'src/components/part05/ch19/Chapter19Closing.mdx',
  'src/components/part05/ch19/Chapter19SourceMap.astro',
  'src/components/part05/ch19/BornOppenheimerTrajectory.astro',
  'src/components/part05/ch19/ForceDecompositionDiagram.astro',
  'src/components/part05/ch19/BOMDCPMDFlow.astro',
];
const components = (await Promise.all(componentPaths.map(read))).join('\n');
const publicText = `${chapter}\n${components}`;

for (const sectionId of ['19.1', '19.2', '19.3', '19.4', '19.5', '19.6']) {
  assert.ok(publicText.includes(sectionId), `missing Chapter 19 section ${sectionId}`);
}

for (const requiredTerm of [
  'Born–Oppenheimer',
  'Hellmann–Feynman',
  'Pulay',
  'velocity Verlet',
  'Car–Parrinello',
  'fictitious',
  '平面波',
  'Non-self-consistent',
  '有效样本',
]) {
  assert.ok(publicText.includes(requiredTerm), `missing required term: ${requiredTerm}`);
}

for (const forbiddenPlaceholder of ['正文待填充', 'outline ·', 'TODO', 'TBD']) {
  assert.ok(
    !publicText.includes(forbiddenPlaceholder),
    `Chapter 19 still contains placeholder text: ${forbiddenPlaceholder}`,
  );
}

const bilingualCount = (publicText.match(/<BilingualSection/g) ?? []).length;
assert.ok(bilingualCount >= 12, `expected at least 12 bilingual sections, found ${bilingualCount}`);

for (const visualPath of componentPaths.slice(-3)) {
  const visual = await read(visualPath);
  assert.ok(visual.includes('<noscript>'), `${visualPath} lacks a no-JavaScript fallback`);
  assert.ok(visual.includes('验收'), `${visualPath} lacks a repeatable acceptance condition`);
  assert.ok(visual.includes('边界'), `${visualPath} lacks an applicability boundary`);
}

assert.ok(
  chapter.includes('Chapter19Body') && chapter.includes('Chapter19Contents'),
  'route page must assemble the substantive Chapter 19 body and contents',
);

console.log('Part V Chapter 19 validation passed.');
console.log(`Velocity-Verlet second-order error ratio: ${errorRatio.toFixed(6)}`);
console.log(`Coarse/fine maximum relative energy deviations: ${coarse.maxRelativeEnergyDeviation.toExponential(6)} / ${fine.maxRelativeEnergyDeviation.toExponential(6)}`);
console.log(`Bilingual section count: ${bilingualCount}`);
