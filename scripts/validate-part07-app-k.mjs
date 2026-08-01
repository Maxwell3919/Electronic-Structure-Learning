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
  const scale = Math.max(Math.abs(expected), Number.MIN_VALUE);
  close(actual / scale, expected / scale, tolerance, label);
};
const oddDoubleFactorial = (l) => {
  let value = 1;
  for (let n = 1; n <= l; n += 1) value *= 2 * n + 1;
  return value;
};

// K.1: closed forms, recurrence, asymptotics, Wronskian, and Hankel conjugation.
for (const x of [0.3, 0.9, 2.4, 6.1]) {
  close(sphericalBesselJ(0, x), Math.sin(x) / x, 3e-15, `j0(${x})`);
  close(sphericalNeumannN(0, x), -Math.cos(x) / x, 3e-15, `n0(${x})`);
  close(sphericalBesselJ(1, x), Math.sin(x) / x ** 2 - Math.cos(x) / x, 5e-15, `j1(${x})`);
  for (let l = 0; l <= 7; l += 1) {
    close(sphericalBesselJ(l, -x), (-1) ** l * sphericalBesselJ(l, x), 4e-12, `j parity l=${l}`);
  }
}
for (const x of [1.1, 2.4, 6.1]) {
  for (let l = 1; l <= 7; l += 1) {
    close(
      sphericalBesselJ(l + 1, x),
      ((2 * l + 1) / x) * sphericalBesselJ(l, x) - sphericalBesselJ(l - 1, x),
      2e-11,
      `j recurrence l=${l},x=${x}`,
    );
    const wronskian = sphericalBesselJ(l, x) * sphericalDerivative('n', l, x)
      - sphericalDerivative('j', l, x) * sphericalNeumannN(l, x);
    closeRelative(wronskian, 1 / x ** 2, 2e-8, `Wronskian l=${l},x=${x}`);
  }
}
for (const l of [8, 12, 20, 30]) {
  const x = 0.2;
  closeRelative(
    sphericalBesselJ(l, x),
    x ** l / oddDoubleFactorial(l),
    0.006,
    `high-l asymptotic l=${l}`,
  );
}
for (const l of [0, 1, 3]) {
  const h1 = sphericalHankel(l, 2.3, 1);
  const h2 = sphericalHankel(l, 2.3, 2);
  close(h1.re, h2.re, 2e-15, `Hankel real l=${l}`);
  close(h1.im, -h2.im, 2e-15, `Hankel imaginary l=${l}`);
}
assert.throws(() => sphericalNeumannN(0, 0), RangeError);
assert.throws(() => sphericalHankel(0, 1, 3), RangeError);

// K.2-K.3: associated Legendre phases, complex conjugation, and normalized real/complex bases.
for (const x of [-0.75, -0.2, 0.35, 0.8]) {
  close(associatedLegendre(1, 1, x), -Math.sqrt(1 - x ** 2), 3e-14, `P11(${x})`);
  close(associatedLegendre(2, 1, x), -3 * x * Math.sqrt(1 - x ** 2), 5e-14, `P21(${x})`);
  close(legendreP(2, x), 0.5 * (3 * x ** 2 - 1), 3e-14, `P2(${x})`);
  close(associatedLegendre(3, -2, x), associatedLegendre(3, 2, x) / 120, 3e-14, `P3-2(${x})`);
}
for (const [l, m] of [[1, 1], [2, 1], [3, 2], [4, 3]]) {
  const theta = 1.13;
  const phi = 0.71;
  const positive = sphericalHarmonic(l, m, theta, phi);
  const negative = sphericalHarmonic(l, -m, theta, phi);
  close(negative.re, (-1) ** m * positive.re, 3e-14, `Y conjugation real l=${l},m=${m}`);
  close(negative.im, -(((-1) ** m) * positive.im), 3e-14, `Y conjugation imag l=${l},m=${m}`);
  close(sourceRealSphericalHarmonic(l, m, theta, phi, 'cos'), Math.SQRT2 * positive.re, 3e-14, 'real cosine basis');
  close(sourceRealSphericalHarmonic(l, m, theta, phi, 'sin'), Math.SQRT2 * positive.im, 3e-14, 'real sine basis');
}
const integrateSphere = (fn, xPoints = 96, phiPoints = 128) => {
  const dx = 2 / xPoints;
  const dPhi = 2 * Math.PI / phiPoints;
  let sum = 0;
  for (let ix = 0; ix < xPoints; ix += 1) {
    const theta = Math.acos(-1 + (ix + 0.5) * dx);
    for (let ip = 0; ip < phiPoints; ip += 1) sum += fn(theta, (ip + 0.5) * dPhi) * dx * dPhi;
  }
  return sum;
};
for (const [l, m] of [[0, 0], [1, 0], [1, 1], [2, 1], [3, 2]]) {
  close(integrateSphere((theta, phi) => {
    const y = sphericalHarmonic(l, m, theta, phi);
    return y.re ** 2 + y.im ** 2;
  }), 1, 8e-4, `Y norm l=${l},m=${m}`);
}
close(integrateSphere((theta, phi) => {
  const a = sphericalHarmonic(2, 1, theta, phi);
  const b = sphericalHarmonic(3, 1, theta, phi);
  return a.re * b.re + a.im * b.im;
}), 0, 8e-4, 'different-l orthogonality');
for (const [l, m] of [[2, 1], [3, 2]]) {
  const cosine = (theta, phi) => sourceRealSphericalHarmonic(l, m, theta, phi, 'cos');
  const sine = (theta, phi) => sourceRealSphericalHarmonic(l, m, theta, phi, 'sin');
  close(integrateSphere((theta, phi) => cosine(theta, phi) ** 2), 1, 8e-4, `real cosine norm l=${l},m=${m}`);
  close(integrateSphere((theta, phi) => sine(theta, phi) ** 2), 1, 8e-4, `real sine norm l=${l},m=${m}`);
  close(integrateSphere((theta, phi) => cosine(theta, phi) * sine(theta, phi)), 0, 8e-4, `real basis orthogonality l=${l},m=${m}`);
}
const harmonicAudit = harmonicProfile({ l: 3, m: 2, phi: 0.7 });
assert.ok(Math.max(Math.abs(harmonicAudit.conjugationCheck.re), Math.abs(harmonicAudit.conjugationCheck.im)) < 2e-14);
assert.throws(() => associatedLegendre(2, 3, 0.2), RangeError);
assert.throws(() => sourceRealSphericalHarmonic(2, 1, 1, 1, 'bad'), RangeError);

// K.4: exact integer 3j/Gaunt benchmarks, analytic zeros, and Clebsch normalization.
close(wigner3j(1, 1, 0, 0, 0, 0), -1 / Math.sqrt(3), 2e-15, '3j 110');
close(wigner3j(1, 1, 1, 1, 0, -1), -1 / Math.sqrt(6), 2e-15, '3j 111');
close(wigner3j(2, 2, 2, 0, 0, 0), -Math.sqrt(70) / 35, 3e-15, '3j 222');
close(wigner3j(2, 2, 0, 0, 0, 0), 1 / Math.sqrt(5), 2e-15, '3j 220');
close(gauntCoefficient(1, 0, 1, 0, 0, 0), 1 / (2 * Math.sqrt(Math.PI)), 3e-15, 'Gaunt 110');
close(gauntCoefficient(1, 0, 1, 0, 2, 0), Math.sqrt(5) / (5 * Math.sqrt(Math.PI)), 3e-15, 'Gaunt 112');
close(wigner3j(1, 1, 3, 0, 0, 0), 0, 0, 'triangle-forbidden 3j');
close(wigner3j(2, 2, 1, 0, 0, 0), 0, 0, 'odd-parity 3j');
close(gauntCoefficient(2, 1, 2, 0, 2, 0), 0, 0, 'magnetic-sum-forbidden Gaunt');
for (const [j1, j2, J, M] of [[1, 1, 0, 0], [1, 1, 1, 0], [2, 1, 2, 1]]) {
  let norm = 0;
  for (let m1 = -j1; m1 <= j1; m1 += 1) {
    const m2 = M - m1;
    if (Math.abs(m2) <= j2) norm += clebschGordan(j1, m1, j2, m2, J, M) ** 2;
  }
  close(norm, 1, 4e-14, `Clebsch norm ${j1},${j2}->${J},${M}`);
}
for (const l3 of [0, 1, 2, 3, 4, 5]) {
  const audit = angularCouplingAudit({ l1: 2, m1: 0, l2: 2, m2: 0, l3, m3: 0 });
  if (!audit.triangleAllowed || !audit.parityAllowed) close(audit.gaunt, 0, 2e-15, `selection-rule Gaunt l3=${l3}`);
}
assert.throws(() => wigner3j(1, 1, 1, 2, -1, -1), RangeError);

// K.5: recurrence, cosine identity, interval mapping, Clenshaw evaluation, and convergence.
for (const x of [-1, -0.7, 0, 0.4, 1]) {
  close(chebyshevT(0, x), 1, 2e-15, 'T0');
  close(chebyshevT(1, x), x, 2e-15, 'T1');
  close(chebyshevT(2, x), 2 * x ** 2 - 1, 3e-15, 'T2');
  close(chebyshevT(3, x), 4 * x ** 3 - 3 * x, 4e-15, 'T3');
  for (let n = 1; n <= 10; n += 1) {
    close(chebyshevT(n + 1, x), 2 * x * chebyshevT(n, x) - chebyshevT(n - 1, x), 5e-14, `T recurrence n=${n}`);
  }
}
for (const theta of [0.1, 0.7, 1.4, 2.5]) {
  const x = Math.cos(theta);
  for (let n = 0; n <= 12; n += 1) close(chebyshevT(n, x), Math.cos(n * theta), 8e-14, `T cosine n=${n}`);
}
close(mapToChebyshevInterval(-8, -8, 12), -1, 2e-15, 'map lower');
close(mapToChebyshevInterval(12, -8, 12), 1, 2e-15, 'map upper');
close(mapToChebyshevInterval(2, -8, 12), 0, 2e-15, 'map midpoint');
const coefficients = [2, -0.3, 0.7, -0.12, 0.05];
for (const x of [-0.9, -0.2, 0.35, 0.95]) {
  const direct = 0.5 * coefficients[0]
    + coefficients.slice(1).reduce((sum, coefficient, index) => sum + coefficient * chebyshevT(index + 1, x), 0);
  close(evaluateChebyshev(coefficients, x), direct, 3e-15, `Clenshaw x=${x}`);
}
const constant = chebyshevCoefficients(() => 1, 8, 96);
close(constant[0], 2, 3e-14, 'constant c0');
for (let n = 1; n < constant.length; n += 1) close(constant[n], 0, 3e-14, `constant c${n}`);
const errors = [2, 4, 8, 12].map((order) => chebyshevApproximationProfile({ order }).maxChebyshevError);
for (let index = 1; index < errors.length; index += 1) assert.ok(errors[index] < errors[index - 1], 'Chebyshev exp error must decrease');
assert.ok(chebyshevT(20, 1.1) > 10, 'T20 must grow outside [-1,1]');
assert.throws(() => mapToChebyshevInterval(0, 1, 1), RangeError);
assert.throws(() => chebyshevApproximationProfile({ functionName: 'unknown' }), RangeError);

// Actual content and render-tree assembly.
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
assert.match(content.route, /<AppendixKBody\s*\/>/);
assert.match(content.route, /status="appendix-content-complete"/);
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
]) assert.match(content[container], new RegExp(`<${visual}\\s*/>`), `${visual} must be assembled`);
assert.equal(
  ['radialVisual', 'harmonicVisual', 'couplingVisual', 'chebyshevVisual']
    .reduce((sum, key) => sum + (content[key].match(/chapter-visual__contract/g) ?? []).length, 0),
  4,
);
const combined = Object.values(content).join('\n');
assert.doesNotMatch(combined, /目录级阅读骨架|outline · 正文待填充|TODO/i);
assert.ok((combined.match(/bilingual-section__zh/g) ?? []).length >= 22);
assert.ok((combined.match(/bilingual-section__en/g) ?? []).length >= 22);
for (const required of ['Condon–Shortley', 'Clebsch–Gordon', 'Clebsch–Gordan', 'source-specific', '1/√(1−x²)', 'no source figure']) {
  assert.ok(combined.includes(required), `missing convention boundary: ${required}`);
}
assert.ok((content.coupling.match(/<li><strong>/g) ?? []).length >= 10);
assert.match(content.index, /\| J · Scattering and Phase Shifts \| complete and deployed \|/);
assert.match(content.index, /\| K · Useful Relations and Formulas \| content complete;/);
assert.match(content.index, /\| L–R \| outline \|/);

console.log('Part VII Appendix K validation passed: stable radial functions, harmonic conventions and normalization, integer 3j/Gaunt rules, Chebyshev mapping and convergence, and route assembly.');
