import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  compareQuadraticPhases,
  gapHierarchy,
  minimizeQuadraticEnthalpy,
  propertyRoutes,
  quadraticPhaseEnergy,
} from '../src/lib/chapter02Models.mjs';

const close = (actual, expected, tolerance = 1e-10) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
};
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const phaseA = { equilibriumVolume: 20, curvature: 0.5, offset: 0 };
const phaseB = { equilibriumVolume: 16, curvature: 0.5, offset: 0.2 };

close(quadraticPhaseEnergy(20, phaseA), 0);
close(quadraticPhaseEnergy(18, phaseA), 1);

const zeroPressureA = minimizeQuadraticEnthalpy(0, phaseA);
close(zeroPressureA.volume, 20);
close(zeroPressureA.enthalpy, 0);

assert.equal(compareQuadraticPhases(0, phaseA, phaseB).stablePhase, 'A');
assert.equal(compareQuadraticPhases(0.2, phaseA, phaseB).stablePhase, 'B');

const equalOffsetLarge = { equilibriumVolume: 20, curvature: 1, offset: 0 };
const equalOffsetDense = { equilibriumVolume: 16, curvature: 1, offset: 0 };
assert.equal(compareQuadraticPhases(0, equalOffsetLarge, equalOffsetDense).stablePhase, 'coexistence');
assert.equal(compareQuadraticPhases(0.1, equalOffsetLarge, equalOffsetDense).stablePhase, 'B');

const gaps = gapHierarchy({ ksGap: 1.1, derivativeCorrection: 0.7, excitonBinding: 0.3 });
close(gaps.fundamentalGap, 1.8);
close(gaps.opticalGap, 1.5);
assert.equal(gaps.bindingClamped, false);

const clamped = gapHierarchy({ ksGap: 0.2, derivativeCorrection: 0.1, excitonBinding: 0.5 });
close(clamped.opticalGap, 0);
assert.equal(clamped.bindingClamped, true);

assert.deepEqual(Object.keys(propertyRoutes), [
  'structure',
  'phonon',
  'quasiparticle',
  'optical',
  'topology',
]);
for (const [routeId, route] of Object.entries(propertyRoutes)) {
  for (const key of ['labelZh', 'labelEn', 'objectZh', 'objectEn', 'methodZh', 'methodEn', 'boundaryZh', 'boundaryEn']) {
    assert.equal(typeof route[key], 'string', `${routeId}.${key} must be a string`);
    assert.ok(route[key].length > 0, `${routeId}.${key} must not be empty`);
  }
}

const magnetism = read('src/components/chapter02/Chapter02MagnetismElasticity.mdx');
assert.match(magnetism, /Chapter02StonerConventionAudit/);
assert.ok(
  magnetism.indexOf('<StonerConventionAudit />') < magnetism.indexOf('Supplemental derivation: Stoner susceptibility'),
  'The source-convention audit must appear immediately before the Stoner derivation',
);
assert.match(magnetism, /m=\\chi_0 h_{\\mathrm{eff}}/);
assert.match(magnetism, /h_{\\mathrm{eff}}=h_{\\mathrm{ext}}\+I m/);
assert.match(magnetism, /\\chi_h\\equiv\\frac{m}{h_{\\mathrm{ext}}}/);
assert.doesNotMatch(magnetism, /m=\\chi_0 V_m/, 'The corrected derivation must not reuse the ambiguous signed potential');
assert.match(magnetism, /同一自旋计数、磁矩和场单位|one matched convention/);

const stonerAudit = read('src/components/chapter02/Chapter02StonerConventionAudit.mdx');
assert.match(stonerAudit, /data-ch2-stoner-convention-audit/);
for (const equation of ['2.2', '2.3', 'D.11']) {
  assert.ok(stonerAudit.includes(equation), `Stoner audit must identify Eq. (${equation})`);
}
assert.ok(stonerAudit.includes('h=-V_m'), 'Stoner audit must define the sign map h = -V_m');
assert.ok(stonerAudit.includes('I_h=-I_{V_m}'), 'Stoner audit must transform the kernel together with the field');
assert.ok(stonerAudit.includes('m=-\\delta E/\\delta V_m'), 'Stoner audit must retain Martin’s conjugate-potential definition');
assert.match(stonerAudit, /source-convention ambiguity|来源约定审计/);
assert.match(stonerAudit, /confirmed erratum|已确认勘误/);
assert.match(stonerAudit, /per-spin or two-spin DOS|单自旋或双自旋 DOS/);
assert.match(stonerAudit, /comparable only after|才可比较/);
assert.match(stonerAudit, /does not alter the Stoner mean-field conclusion|不改变 Stoner 平均场/);

const gapExplorer = read('src/components/GapHierarchyExplorer.astro');
assert.match(gapExplorer, /aria-live="polite" aria-atomic="true"/);
assert.match(gapExplorer, /data-gap-note-zh/);
assert.match(gapExplorer, /data-gap-note-en/);
assert.match(gapExplorer, /data-gap-regime="physical"/);
assert.match(gapExplorer, /outside-model-regime/);
assert.match(gapExplorer, /零值只是绘图截断/);
assert.match(gapExplorer, /zero is only a plotting clamp/);
assert.doesNotMatch(gapExplorer, /lang="en" data-gap-note>/, 'The live status must not remain English-only');

console.log('Chapter 2 validation passed: EOS competition, gap hierarchy, 5 property routes, corrected Stoner source-field/DOS conventions, and bilingual live-status accessibility checked.');
