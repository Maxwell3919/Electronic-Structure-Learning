import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  angularCouplingAudit,
  associatedLegendre,
  chebyshevApproximationProfile,
  chebyshevCoefficients,
  chebyshevT,
  clebschGordan,
  evaluateChebyshev,
  gauntCoefficient,
  harmonicProfile,
  legendreP,
  mapToChebyshevInterval,
  sourceRealSphericalHarmonic,
  sphericalBesselJ,
  sphericalDerivative,
  sphericalHankel,
  sphericalHarmonic,
  sphericalNeumannN,
  wigner3j,
} from '../src/data/part07/usefulRelationsModel.mjs';

const close = (actual, expected, tolerance = 1e-11, label = 'value') => {
  assert.ok(Number.isFinite(actual), `${label}: non-finite value ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, received ${actual}`);
};
const closeRelative = (actual, expected, tolerance, label) => {
  assert.ok(Number.isFinite(actual), `${label}: non-finite value ${actual}`);
  const scale = Math.max(Math.abs(expected), Number.MIN_VALUE);
  assert.ok(Math.abs(actual - expected) <= tolerance * scale, `${label}: expected ${expected}, received ${actual}`);
};
const oddDoubleFactorial = (l) => {
  let result = 1;
  for (let n = 1; n <= l; n += 1) result *= 2 * n + 1;
  return result;
};

// K.1 spherical functions: closed forms, parity, recurrence, asymptotics, Wronskian, and Hankel conjugation.
for (const x of [0.3, 0.9, 2.4, 6.1]) {
  close(sphericalBesselJ(0, x), Math.sin(x) / x, 3e-15, `j0 at ${x}`);
  close(sphericalNeumannN(0, x), -Math.cos(x) / x, 3e-15, `n0 at ${x}`);
  close(sphericalBesselJ(1, x), Math.sin(x) / x ** 2 - Math.cos(x) / x, 5e-15, `j1 at ${x}`);
  for (let l = 0; l <= 7; l += 1) {
    close(sphericalBesselJ(l, -x), (-1) ** l * sphericalBesselJ(l, x), 4e-12, `j parity l=${l}, x=${x}`);
  }
}
for (const x of [1.1, 2.4, 6.1]) {
  for (let l = 1; l <= 7; l += 1) {
    const recurrence = ((2 * l + 1) / x) * sphericalBesselJ(l, x) - sphericalBesselJ(l - 1, x);
    close(recurrence, sphericalBesselJ(l + 1, x), 2e-11, `j recurrence l=${l}, x=${x}`);
    const derivative = sphericalBesselJ(l - 1, x) - ((l + 1) / x) * sphericalBesselJ(l, x);
    close(derivative, sphericalDerivative('j', l, x), 2e-13, `j derivative l=${l}, x=${x}`);
    const wronskian = sphericalBesselJ(l, x) * sphericalDerivative('n', l, x)
      - sphericalDerivative('j', l, x) * sphericalNeumannN(l, x);
    closeRelative(wronskian, 1 / x ** 2, 2e-8, `Wronskian l=${l}, x=${x}`);
  }
}
for (const l of [8, 12, 20, 30]) {
  const x = 0.2;
  const expected = x ** l / oddDoubleFactorial(l);
  closeRelative(sphericalBesselJ(l, x), expected, 0.006, `high-l small-x asymptotic l=${l}`);
}
for (const l of [0, 1, 3]) {
  const h1 = sphericalHankel(l, 2.3, 1);
  const h2 = sphericalHankel(l, 2.3, 2);
  close(h1.re, h2.re, 2e-15, `Hankel real conjugation l=${l}`);
  close(h1.im, -h2.im, 2e-15, `Hankel imaginary conjugation l=${l}`);
}
assert.throws(() => sphericalNeumannN(0, 0), RangeError, 'n_l origin singularity must fail closed');
assert.throws(() => sphericalHankel(0, 1, 3), RangeError, 'unsupported Hankel kind must fail closed');

// K.2-K.3 associated Legendre and harmonic phase/normalization conventions.
for (const x of [-0.75, -0.2, 0.35, 0.8]) {
  close(associatedLegendre(1, 1, x), -Math.sqrt(1 - x ** 2), 3e-14, `P11 at ${x}`);
  close(associatedLegendre(2, 1, x), -3 * x * Math.sqrt(1 - x ** 2), 5e-14, `P21 at ${x}`);
  close(legendreP(2, x), 0.5 * (3 * x ** 2 - 1), 3e-14, `P2 at ${x}`);
  close(
    associatedLegendre(3, -2, x),
    associatedLegendre(3, 2, x) / 120,
    3e-14,
    `negative-m associated Legendre at ${x}`,
  );
}
for (const [l, m] of [[1, 1], [2, 1], [3, 2], [4, 3]]) {
  const theta = 1.13;
  const phi = 0.71;
  const positive = sphericalHarmonic(l, m, theta, phi);
  const negative = sphericalHarmonic(l, -m, theta, phi);
  close(negative.re, (-1) ** m * positive.re, 3e-14, `Y negative-m real l=${l},m=${m}`);
  close(negative.im, -(((-1) ** m) * positive.im), 3e-14, `Y negative-m imag l=${l},m=${m}`);
  close(sourceRealSphericalHarmonic(l, m, theta, phi, 'cos'), Math.SQRT2 * positive.re, 3e-14, 'real cosine channel');
  close(sourceRealSphericalHarmonic(l, m, theta, phi, 'sin'), Math.SQRT2 * positive.im, 3e-14, 'real sine channel');
}

const integrateSphere = (fn, xPoints = 96, phiPoints = 128) => {
  let sum = 0;
  const dx = 2 / xPoints;
  const dPhi = 2 * Math.PI / phiPoints;
  for (let ix = 0; ix < xPoints; ix += 1) {
    const x = -1 + (ix + 0.5) * dx;
    const theta = Math.acos(x);
    for (let ip = 0; ip < phiPoints; ip += 1) {
      const phi = (ip + 0.5) * dPhi;
      sum += fn(theta, phi) * dx * dPhi;
    }
  }
  return sum;
};
for (const [l, m] of [[0, 0], [1, 0], [1, 1], [2, 1], [3, 2]]) {
  const norm = integrateSphere((theta, phi) => {
    const y = sphericalHarmonic(l, m, theta, phi);
    return y.re ** 2 + y.im ** 2;
  });
  close(norm, 1, 7e-4, `harmonic norm l=${l},m=${m}`);
}
const cross = integrateSphere((theta, phi) => {
  const a = sphericalHarmonic(2, 1, theta, phi);
  const b = sphericalHarmonic(3, 1, theta, phi);
  return a.re * b.re + a.im * b.im;
});
close(cross, 0, 8e-4, 'different-l harmonic orthogonality');
for (const [l, m] of [[2, 1], [3, 2]]) {
  const cosNorm = integrateSphere((theta, phi) => sourceRealSphericalHarmonic(l, m, theta, phi, 'cos') ** 2);
  const sinNorm = integrateSphere((theta, phi) => sourceRealSphericalHarmonic(l, m, theta, phi, 'sin') ** 2);
  const realCross = integrateSphere((theta, phi) => (
    sourceRealSphericalHarmonic(l, m, theta, phi, 'cos')
    * sourceRealSphericalHarmonic(l, m, theta, phi, 'sin')
  ));
  close(cosNorm, 1, 8e-4, `real cosine norm l=${l},m=${m}`);
  close(sinNorm, 1, 8e-4, `real sine norm l=${l},m=${m}`);
  close(realCross, 0, 8e-4, `real channel orthogonality l=${l},m=${m}`);
}
const profile = harmonicProfile({ l: 3, m: 2, phi: 0.7 });
assert.ok(Math.max(Math.abs(profile.conjugationCheck.re), Math.abs(profile.conjugationCheck.im)) < 2e-14, 'harmonic profile conjugation check');
assert.throws(() => associatedLegendre(2, 3, 0.2), RangeError, '|m|>l must fail closed');
assert.throws(() => sourceRealSphericalHarmonic(2, 1, 1, 1, 'bad'), RangeError, 'unknown real-basis channel must fail closed');

// K.4 exact integer 3j, Clebsch-Gordan normalization, Gaunt values, and analytic zeros.
close(wigner3j(1, 1, 0, 0, 0, 0), -1 / Math.sqrt(3), 2e-15, '3j 110');
close(wigner3j(1, 1, 1, 1, 0, -1), -1 / Math.sqrt(6), 2e-15, '3j 111');
close(wigner3j(2, 2, 2, 0, 0, 0), -Math.sqrt(70) / 35, 3e-15, '3j 222');
close(wigner3j(2, 2, 0, 0, 0, 0), 1 / Math.sqrt(5), 2e-15, '3j 220');
close(gauntCoefficient(1, 0, 1, 0, 0, 0), 1 / (2 * Math.sqrt(Math.PI)), 3e-15, 'Gaunt 110');
close(gauntCoefficient(1, 0, 1, 0, 2, 0), Math.sqrt(5) / (5 * Math.sqrt(Math.PI)), 3e-15, 'Gaunt 112');
assert.equal(wigner3j(1, 1, 3, 0, 0, 0), 0, 'triangle-forbidden 3j must be zero');
assert.equal(wigner3j(2, 2, 1, 0, 0, 0), 0, 'odd-parity zero-m 3j must be zero');
assert.equal(gauntCoefficient(2, 1, 2, 0, 2, 0), 0, 'magnetic-sum-forbidden Gaunt must be zero');
for (const [j1, j2, J, M] of [[1, 1, 0, 0], [1, 1, 1, 0], [2, 1, 2, 1]]) {
  let norm = 0;
  for (let m1 = -j1; m1 <= j1; m1 += 1) {
    const m2 = M - m1;
    if (Math.abs(m2) <= j2) norm += clebschGordan(j1, m1, j2, m2, J, M) ** 2;
  }
  close(norm, 1, 4e-14, `Clebsch normalization j1=${j1},j2=${j2},J=${J},M=${M}`);
}
for (const l3 of [0, 1, 2, 3, 4, 5]) {
  const audit = angularCouplingAudit({ l1: 2, m1: 0, l2: 2, m2: 0, l3, m3: 0 });
  if (!audit.triangleAllowed || !audit.parityAllowed) close(audit.gaunt, 0, 2e-15, `selection-rule Gaunt l3=${l3}`);
}
assert.throws(() => wigner3j(1, 1, 1, 2, -1, -1), RangeError, 'invalid magnetic quantum number must fail closed');

// K.5 Chebyshev recurrence, cosine identity, interval mapping, Clenshaw, and convergence.
for (const x of [-1, -0.7, 0, 0.4, 1]) {
  close(chebyshevT(0, x), 1, 2e-15, 'T0');
  close(chebyshevT(1, x), x, 2e-15, 'T1');
  close(chebyshevT(2, x), 2 * x ** 2 - 1, 3e-15, 'T2');
  close(chebyshevT(3, x), 4 * x ** 3 - 3 * x, 4e-15, 'T3');
  for (let n = 1; n <= 10; n += 1) {
    close(chebyshevT(n + 1, x), 2 * x * chebyshevT(n, x) - chebyshevT(n - 1, x), 5e-14, `Chebyshev recurrence n=${n}`);
  }
}
for (const theta of [0.1, 0.7, 1.4, 2.5]) {
  const x = Math.cos(theta);
  for (let n = 0; n <= 12; n += 1) close(chebyshevT(n, x), Math.cos(n * theta), 8e-14, `cosine identity n=${n}`);
}
close(mapToChebyshevInterval(-8, -8, 12), -1, 2e-15, 'interval lower endpoint');
close(mapToChebyshevInterval(12, -8, 12), 1, 2e-15, 'interval upper endpoint');
close(mapToChebyshevInterval(2, -8, 12), 0, 2e-15, 'interval midpoint');
const polynomialCoefficients = [2, -0.3, 0.7, -0.12, 0.05];
for (const x of [-0.9, -0.2, 0.35, 0.95]) {
  const direct = 0.5 * polynomialCoefficients[0]
    + polynomialCoefficients.slice(1).reduce((sum, coefficient, index) => sum + coefficient * chebyshevT(index + 1, x), 0);
  close(evaluateChebyshev(polynomialCoefficients, x), direct, 3e-15, `Clenshaw direct agreement x=${x}`);
}
const constantCoefficients = chebyshevCoefficients(() => 1, 8, 96);
close(constantCoefficients[0], 2, 3e-14, 'constant Chebyshev c0');
for (let n = 1; n < constantCoefficients.length; n += 1) close(constantCoefficients[n], 0, 3e-14, `constant coefficient n=${n}`);
const expErrors = [2, 4, 8, 12].map((order) => chebyshevApproximationProfile({ order, intervalMin: -1, intervalMax: 1 }).maxChebyshevError);
for (let index = 1; index < expErrors.length; index += 1) assert.ok(expErrors[index] < expErrors[index - 1], 'smooth-function Chebyshev error must decrease with order');
assert.ok(chebyshevT(20, 1.1) > 10, 'Chebyshev polynomial must grow outside [-1,1]');
assert.throws(() => mapToChebyshevInterval(0, 1, 1), RangeError, 'degenerate interval must fail closed');
assert.throws(() => chebyshevApproximationProfile({ functionName: 'unknown' }), RangeError, 'unknown target function must fail closed');

// Content and actual render-tree assembly.
const paths = {
  route: 'src/content/docs/part-07-appendices/appendix-k-useful-relations-and-formulas.mdx',
  index: 'src/content/docs/part-07-appendices/index.mdx',
  body: 'src/components/part07/appK/AppendixKBody.astro',
  contents: 'src/components/part07/appK/AppendixKContents.astro',
  orientation: 'src/components/part07/appK/AppendixKOrientation.mdx',
  functions: 'src/components/part07/appK/AppendixKFunctionsHarmonics.mdx',
  coupling: 'src/components/part07/appK/AppendixKCouplingChebyshevReview.mdx',
  radialVisual: 'src/components/part07/appK/RadialFunctionsExplorer.astro',
  harmonicVisual: 'src/components/part07/appK/HarmonicConventionExplorer.astro',
  couplingVisual: 'src/components/part07/appK/AngularCouplingExplorer.astro',
  chebyshevVisual: 'src/components/part07/appK/ChebyshevApproximationExplorer.astro',
};
const content = Object.fromEntries(
  await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path, 'utf8')])),
);
assert.match(content.route, /<AppendixKBody\s*\/>/, 'Appendix K route must render AppendixKBody');
assert.match(content.route, /status="appendix-content-complete"/, 'Appendix K route status must be content complete');
for (const component of ['AppendixKContents', 'AppendixKOrientation', 'AppendixKFunctionsHarmonics', 'AppendixKCouplingChebyshevReview']) {
  assert.match(content.body, new RegExp(`<${component}\\s*/>`), `body must render ${component}`);
}
for (const section of ['K.1', 'K.2', 'K.3', 'K.4', 'K.5']) assert.ok(content.contents.includes(section), `source map must contain ${section}`);
for (const marker of ['section-k-1', 'section-k-2', 'section-k-3', 'section-k-4', 'section-k-5', 'review']) {
  assert.ok(Object.values(content).join('\n').includes(marker), `Appendix K must expose ${marker}`);
}
for (const [container, visual] of [
  ['functions', 'RadialFunctionsExplorer'],
  ['functions', 'HarmonicConventionExplorer'],
  ['coupling', 'AngularCouplingExplorer'],
  ['coupling', 'ChebyshevApproximationExplorer'],
]) assert.match(content[container], new RegExp(`<${visual}\\s*/>`), `${visual} must be assembled in ${container}`);
const visualContracts = ['radialVisual', 'harmonicVisual', 'couplingVisual', 'chebyshevVisual']
  .map((key) => (content[key].match(/chapter-visual__contract/g) ?? []).length)
  .reduce((sum, count) => sum + count, 0);
assert.equal(visualContracts, 4, 'four visualization contracts must be present');
const combined = Object.values(content).join('\n');
assert.doesNotMatch(combined, /目录级阅读骨架|outline · 正文待填充|TODO/i, 'Appendix K must not retain outline or TODO markers');
assert.ok((combined.match(/bilingual-section__zh/g) ?? []).length >= 22, 'substantive Chinese bilingual coverage');
assert.ok((combined.match(/bilingual-section__en/g) ?? []).length >= 22, 'substantive English bilingual coverage');
for (const required of ['Condon–Shortley', 'Clebsch–Gordon', 'Clebsch–Gordan', 'source-specific', '1/√(1−x²)', 'no source figure']) {
  assert.ok(combined.includes(required), `required Appendix K convention boundary missing: ${required}`);
}
assert.ok((content.coupling.match(/<li><strong>/g) ?? []).length >= 10, 'ten original exercises must be present');
assert.match(content.index, /\| J · Scattering and Phase Shifts \| complete and deployed \|/, 'Part VII index must retain Appendix J deployed state');
assert.match(content.index, /\| K · Useful Relations and Formulas \| content complete;/, 'Part VII index must expose Appendix K content-complete state');
assert.match(content.index, /\| L–R \| outline \|/, 'Part VII index must preserve L–R as outlines');

console.log('Part VII Appendix K validation passed: stable radial functions, harmonic conventions and normalization, integer 3j/Gaunt rules, Chebyshev mapping and convergence, and route assembly.');
