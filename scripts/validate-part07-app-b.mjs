import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  appendixBModel,
  pbeExchangeEnhancement,
  pzCorrelationDerivative,
  pzCorrelationEnergy,
  pzCorrelationPotential,
  reducedExchangeGradient,
  samplePbeEnhancement,
  spinExchangeFactor,
} from '../src/data/part07/lsdaGgaModel.mjs';

const close = (actual, expected, tolerance = 1e-12, label = 'value') => {
  assert.ok(Number.isFinite(actual), `${label}: non-finite value ${actual}`);
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected}, received ${actual}`,
  );
};

// Exact exchange spin-scaling limits and symmetry.
close(spinExchangeFactor(0), 1, 1e-15, 'unpolarized spin factor');
close(spinExchangeFactor(1), 2 ** (1 / 3), 1e-14, 'fully polarized spin factor');
close(spinExchangeFactor(-1), 2 ** (1 / 3), 1e-14, 'negative full polarization');
for (const zeta of [0.1, 0.25, 0.6, 0.9]) {
  close(spinExchangeFactor(zeta), spinExchangeFactor(-zeta), 1e-14, `spin symmetry zeta=${zeta}`);
}

// PBE exchange limits, monotonicity and small-gradient coefficient.
close(pbeExchangeEnhancement(0), 1, 1e-15, 'PBE local limit');
const small = 1e-4;
close(
  (pbeExchangeEnhancement(small) - 1) / small ** 2,
  appendixBModel.pbeMu,
  2e-8,
  'PBE small-gradient coefficient',
);
const saturation = 1 + appendixBModel.pbeKappa;
assert.ok(
  Math.abs(pbeExchangeEnhancement(1e6) - saturation) < 1e-10,
  'PBE large-gradient saturation',
);
let previous = pbeExchangeEnhancement(0);
for (const { s, enhancement } of samplePbeEnhancement({ maxS: 8, count: 401 })) {
  assert.ok(enhancement >= previous - 1e-14, `PBE enhancement is not monotone at s=${s}`);
  assert.ok(enhancement <= saturation + 1e-14, `PBE enhancement exceeds 1+kappa at s=${s}`);
  previous = enhancement;
}

// Reduced-gradient dimensional structure for a fixed numerical atomic-unit example.
const density = 0.08;
const gradientMagnitude = 0.012;
const kF = (3 * Math.PI ** 2 * density) ** (1 / 3);
close(
  reducedExchangeGradient({ density, gradientMagnitude }),
  gradientMagnitude / (2 * kF * density),
  1e-15,
  'reduced exchange gradient',
);

// PZ analytic derivatives and correlation potential against independent finite differences.
const nFromRs = (rs) => 3 / (4 * Math.PI * rs ** 3);
const rsFromN = (n) => (3 / (4 * Math.PI * n)) ** (1 / 3);
for (const rs of [0.2, 0.5, 2, 5]) {
  const hRs = 1e-6 * rs;
  const numericalDerivative =
    (pzCorrelationEnergy(rs + hRs) - pzCorrelationEnergy(rs - hRs)) / (2 * hRs);
  close(
    pzCorrelationDerivative(rs),
    numericalDerivative,
    3e-8,
    `PZ d epsilon/drs at rs=${rs}`,
  );

  const n = nFromRs(rs);
  const hN = 1e-6 * n;
  const energyDensity = (trialN) => trialN * pzCorrelationEnergy(rsFromN(trialN));
  const numericalPotential = (energyDensity(n + hN) - energyDensity(n - hN)) / (2 * hN);
  close(
    pzCorrelationPotential(rs),
    numericalPotential,
    4e-8,
    `PZ potential at rs=${rs}`,
  );
}

// Printed rounded coefficients have a small branch mismatch at rs=1; preserve it as a documented boundary.
const pzLeftAtOne = -0.0480 - 0.0116;
const pzRightAtOne = -0.1423 / (1 + 1.0529 + 0.3334);
close(pzLeftAtOne, -0.0596, 1e-15, 'PZ left branch at rs=1');
assert.ok(
  Math.abs(pzRightAtOne - pzLeftAtOne) > 3e-5
    && Math.abs(pzRightAtOne - pzLeftAtOne) < 3.3e-5,
  'PZ printed-coefficient branch mismatch changed unexpectedly',
);

// Failure behavior must be fail-closed.
assert.throws(() => spinExchangeFactor(1.01), RangeError);
assert.throws(() => pbeExchangeEnhancement(-0.1), RangeError);
assert.throws(() => reducedExchangeGradient({ density: 0, gradientMagnitude: 1 }), RangeError);
assert.throws(() => pzCorrelationEnergy(0), RangeError);
assert.throws(() => samplePbeEnhancement({ count: 1 }), RangeError);
assert.throws(() => pbeExchangeEnhancement(Number.NaN), TypeError);

// Content contract: all source sections and visual contracts are present in the assembled files.
const files = await Promise.all([
  readFile('src/components/part07/appB/AppendixBContents.astro', 'utf8'),
  readFile('src/components/part07/appB/AppendixBOrientation.mdx', 'utf8'),
  readFile('src/components/part07/appB/AppendixBLSDA.mdx', 'utf8'),
  readFile('src/components/part07/appB/AppendixBGgaPbe.mdx', 'utf8'),
  readFile('src/components/part07/appB/AppendixBReview.mdx', 'utf8'),
  readFile('src/components/part07/appB/DensityIngredientHierarchy.astro', 'utf8'),
  readFile('src/components/part07/appB/SpinInterpolationExplorer.astro', 'utf8'),
  readFile('src/components/part07/appB/PBEEnhancementExplorer.astro', 'utf8'),
]);
const combined = files.join('\n');
for (const marker of ['section-b-1', 'section-b-2', 'section-b-3', 'pbe-limits', 'cross-references', 'review']) {
  assert.ok(combined.includes(marker), `missing Appendix B marker: ${marker}`);
}
assert.equal(
  (combined.match(/chapter-visual__contract/g) ?? []).length,
  3,
  'Appendix B must expose three visualization contracts',
);
assert.ok(!combined.includes('outline · 正文待填充'), 'Appendix B still contains an outline placeholder');

console.log('Part VII Appendix B validation passed: spin scaling, PBE limits, PZ derivatives, failures, and content contracts.');
