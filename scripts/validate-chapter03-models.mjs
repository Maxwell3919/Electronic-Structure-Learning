import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  exchangeCorrelationHole,
  holeAnalyticIntegrals,
  normalizedGaussian,
  sampleHole,
  twoLevelAdiabatic,
  twoLevelCanonical,
} from '../src/lib/chapter03Models.mjs';

const close = (actual, expected, tolerance = 1e-10, label = '') => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label || 'value'}: ${actual} != ${expected} within ${tolerance}`,
  );
};
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const uncoupled = twoLevelAdiabatic(2, 0, 1);
close(uncoupled.lowerEnergy, -2, 1e-12, 'uncoupled lower energy');
close(uncoupled.upperEnergy, 2, 1e-12, 'uncoupled upper energy');
close(uncoupled.gap, 4, 1e-12, 'uncoupled gap');
close(uncoupled.lowerState1Weight, 0, 1e-12, 'uncoupled state-1 weight');
close(uncoupled.lowerState2Weight, 1, 1e-12, 'uncoupled state-2 weight');
close(uncoupled.lowerForce, 1, 1e-12, 'uncoupled lower force');

const avoidedCrossing = twoLevelAdiabatic(0, 0.5, 1);
close(avoidedCrossing.lowerEnergy, -0.5, 1e-12, 'crossing lower energy');
close(avoidedCrossing.upperEnergy, 0.5, 1e-12, 'crossing upper energy');
close(avoidedCrossing.gap, 1, 1e-12, 'avoided-crossing gap');
close(avoidedCrossing.lowerState1Weight, 0.5, 1e-12, 'crossing state-1 weight');
close(avoidedCrossing.lowerForce, 0, 1e-12, 'crossing force');

const exactCrossing = twoLevelAdiabatic(0, 0, 1);
assert.equal(exactCrossing.crossingIsDegenerate, true);
close(exactCrossing.gap, 0, 1e-12, 'exact crossing gap');

const zeroTemperature = twoLevelCanonical(1, 0);
close(zeroTemperature.p0, 1, 1e-12, 'zero-T ground probability');
close(zeroTemperature.p1, 0, 1e-12, 'zero-T excited probability');
close(zeroTemperature.purity, 1, 1e-12, 'zero-T purity');
close(zeroTemperature.entropy, 0, 1e-12, 'zero-T entropy');

const thermal = twoLevelCanonical(1.2, 0.8);
close(thermal.p0 + thermal.p1, 1, 1e-12, 'probability normalization');
close(thermal.freeEnergy, thermal.internalEnergy - thermal.temperature * thermal.entropy, 1e-12, 'F=U-TS');
assert.ok(thermal.p0 > thermal.p1, 'ground state must be more probable for positive gap');
assert.ok(thermal.purity < 1 && thermal.purity > 0.5, 'two-level thermal purity must lie in (1/2,1)');

const highTemperature = twoLevelCanonical(1, 1e6);
close(highTemperature.p0, 0.5, 3e-7, 'high-T p0');
close(highTemperature.p1, 0.5, 3e-7, 'high-T p1');
close(highTemperature.entropy, Math.log(2), 1e-10, 'high-T entropy');

const degenerateZeroTemperature = twoLevelCanonical(0, 0);
close(degenerateZeroTemperature.p0, 0.5, 1e-12, 'degenerate zero-T p0');
close(degenerateZeroTemperature.entropy, Math.log(2), 1e-12, 'degenerate zero-T entropy convention');

close(normalizedGaussian(0, 1), 1 / Math.sqrt(2 * Math.PI), 1e-12, 'Gaussian origin');
const atOrigin = exchangeCorrelationHole(0, {
  exchangeWidth: 1,
  correlationAmplitude: 0.4,
  correlationNarrowWidth: 0.5,
  correlationBroadWidth: 2,
});
assert.ok(atOrigin.exchange < 0, 'exchange hole must be negative at origin');
assert.ok(atOrigin.correlation < 0, 'chosen correlation hole must deepen the origin');

const analytic = holeAnalyticIntegrals();
assert.deepEqual(analytic, {
  exchange: -1,
  correlation: 0,
  exchangeCorrelation: -1,
});

const samples = sampleHole(
  {
    exchangeWidth: 1,
    correlationAmplitude: 0.4,
    correlationNarrowWidth: 0.5,
    correlationBroadWidth: 2,
  },
  { minimum: -12, maximum: 12, count: 12001 },
);
const step = samples[1].x - samples[0].x;
const trapezoid = (key) => samples.reduce((sum, point, index) => {
  const weight = index === 0 || index === samples.length - 1 ? 0.5 : 1;
  return sum + weight * point[key] * step;
}, 0);
close(trapezoid('exchange'), -1, 1e-10, 'numeric exchange-hole integral');
close(trapezoid('correlation'), 0, 2e-9, 'numeric correlation-hole integral');
close(trapezoid('exchangeCorrelation'), -1, 2e-9, 'numeric xc-hole integral');

assert.throws(() => twoLevelAdiabatic(0, -1), RangeError);
assert.throws(() => twoLevelCanonical(-1, 1), RangeError);
assert.throws(() => normalizedGaussian(0, 0), RangeError);

const chapterBody = read('src/components/chapter03/Chapter03Body.astro');
assert.match(chapterBody, /Chapter03StressTraceAudit/);
assert.ok(
  chapterBody.indexOf('<ForcesStress />') < chapterBody.indexOf('<StressTraceAudit />')
  && chapterBody.indexOf('<StressTraceAudit />') < chapterBody.indexOf('<GeneralizedForce />'),
  'The stress-trace audit must follow Section 3.3 and precede Section 3.4',
);

const stressAudit = read('src/components/chapter03/Chapter03StressTraceAudit.mdx');
assert.match(stressAudit, /data-ch3-stress-trace-audit/);
assert.match(stressAudit, /data-pressure-trace-factor="-one-third"/);
for (const locator of ['3.23', '3.24', 'G.4']) {
  assert.ok(stressAudit.includes(locator), `Stress audit must identify ${locator}`);
}
assert.ok(stressAudit.includes('-\\frac13'), 'Stress audit must retain P = -(1/3) Tr sigma');
assert.match(stressAudit, /归一化不一致|normalization inconsistency/);
assert.match(stressAudit, /不推断作者|No claim is made/);
assert.match(stressAudit, /压缩应力定义为正值|compressive stress as positive/);

const avoidedExplorer = read('src/components/AvoidedCrossingExplorer.astro');
assert.match(avoidedExplorer, /aria-live="polite" aria-atomic="true" data-ch03-avoided-status/);
for (const marker of ['data-ch03-force-zh', 'data-ch03-force-en', 'data-ch03-weights-zh', 'data-ch03-weights-en']) {
  assert.ok(avoidedExplorer.includes(marker), `Avoided-crossing readout is missing ${marker}`);
}
assert.match(avoidedExplorer, /低能绝热面力/);
assert.match(avoidedExplorer, /Lower-surface force/);

const densityMatrixExplorer = read('src/components/DensityMatrixExplorer.astro');
assert.match(densityMatrixExplorer, /aria-live="polite" aria-atomic="true" data-ch03-dm-status/);
assert.match(densityMatrixExplorer, /data-ch03-dm-summary-zh/);
assert.match(densityMatrixExplorer, /data-ch03-dm-summary-en/);
assert.match(densityMatrixExplorer, /简并子空间等权 Gibbs 极限/);
assert.match(densityMatrixExplorer, /equal-weight Gibbs limit/);

const holeExplorer = read('src/components/ExchangeCorrelationHoleExplorer.astro');
assert.match(holeExplorer, /aria-live="polite" aria-atomic="true" data-ch03-hole-status/);
assert.match(holeExplorer, /data-ch03-hole-interpretation-zh/);
assert.match(holeExplorer, /data-ch03-hole-interpretation-en/);
assert.match(holeExplorer, /关联重排幅度为零/);
assert.match(holeExplorer, /zero correlation amplitude/);

console.log('Chapter 3 validation passed: avoided crossing, density matrix, xc-hole sum rules, hydrostatic stress-trace normalization, and bilingual atomic live-status contracts checked.');
