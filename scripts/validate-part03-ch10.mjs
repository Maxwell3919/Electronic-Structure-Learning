import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const factorial = (n) => {
  let value = 1;
  for (let k = 2; k <= n; k += 1) value *= k;
  return value;
};

const associatedLaguerre = (p, alpha, x) => {
  if (p === 0) return 1;
  if (p === 1) return 1 + alpha - x;
  let lm2 = 1;
  let lm1 = 1 + alpha - x;
  for (let k = 2; k <= p; k += 1) {
    const current = ((2 * k - 1 + alpha - x) * lm1 - (k - 1 + alpha) * lm2) / k;
    lm2 = lm1;
    lm1 = current;
  }
  return lm1;
};

const radialR = (n, l, z, r) => {
  const rho = (2 * z * r) / n;
  const prefactor = Math.pow((2 * z) / n, 1.5)
    * Math.sqrt(factorial(n - l - 1) / (2 * n * factorial(n + l)));
  return prefactor * Math.exp(-rho / 2) * Math.pow(rho, l)
    * associatedLaguerre(n - l - 1, 2 * l + 1, rho);
};

const integrateNorm = (n, l, z) => {
  const rMax = (40 * n) / z;
  const count = 120_000;
  const step = rMax / count;
  let integral = 0;
  let previous = 0;
  for (let index = 0; index <= count; index += 1) {
    const r = index * step;
    const u = r * radialR(n, l, z, r);
    const current = u * u;
    if (index > 0) integral += 0.5 * (previous + current) * step;
    previous = current;
  }
  return integral;
};

const countRadialNodes = (n, l, z) => {
  const rMax = (30 * n) / z;
  const count = 60_000;
  let nodes = 0;
  let previousSign = 0;
  for (let index = 1; index <= count; index += 1) {
    const r = (rMax * index) / count;
    const u = r * radialR(n, l, z, r);
    if (Math.abs(u) < 1e-9) continue;
    const sign = Math.sign(u);
    if (previousSign !== 0 && sign !== previousSign) nodes += 1;
    previousSign = sign;
  }
  return nodes;
};

for (const [n, l, z] of [[1, 0, 1], [2, 0, 1], [2, 1, 2], [3, 0, 1], [3, 1, 3], [3, 2, 1]]) {
  const norm = integrateNorm(n, l, z);
  assert.ok(Math.abs(norm - 1) < 2e-6, `hydrogenic norm failed for n=${n}, l=${l}, Z=${z}: ${norm}`);
  const nodes = countRadialNodes(n, l, z);
  assert.equal(nodes, n - l - 1, `radial node count failed for n=${n}, l=${l}, Z=${z}`);
}

for (let r = 0.25; r <= 8; r += 0.25) {
  assert.equal((0 * (0 + 1)) / (2 * r * r), 0, 'l=0 centrifugal term must vanish');
  for (let l = 0; l < 5; l += 1) {
    const oldValue = (l * (l + 1)) / (2 * r * r);
    const newValue = ((l + 1) * (l + 2)) / (2 * r * r);
    assert.ok(Math.abs((newValue - oldValue) - (l + 1) / (r * r)) < 1e-12, 'centrifugal increment mismatch');
  }
}

// The model coupling xi is an energy multiplying the dimensionless operator
// Lambda_LS = (L dot S) / hbar^2. The angular eigenvalues therefore carry no
// additional units, and the degeneracy-weighted energy trace must vanish.
for (let l = 1; l <= 6; l += 1) {
  const xiEnergy = 0.37;
  const lambdaPlus = l / 2;
  const lambdaMinus = -(l + 1) / 2;
  const ePlus = xiEnergy * lambdaPlus;
  const eMinus = xiEnergy * lambdaMinus;
  const trace = (2 * l + 2) * ePlus + (2 * l) * eMinus;
  assert.ok(Math.abs(trace) < 1e-12, `spin-orbit trace failed for l=${l}`);
  assert.ok(
    Math.abs((ePlus - eMinus) - xiEnergy * (2 * l + 1) / 2) < 1e-12,
    `spin-orbit splitting failed for l=${l}`,
  );
}

const energies = { minus: -98.6, neutral: -100.0, plus: -99.3 };
const ionization = energies.minus - energies.neutral;
const affinity = energies.neutral - energies.plus;
const curvature = energies.plus + energies.minus - 2 * energies.neutral;
assert.ok(Math.abs(ionization - 1.4) < 1e-12);
assert.ok(Math.abs(affinity + 0.7) < 1e-12);
assert.ok(Math.abs(curvature - 2.1) < 1e-12);
for (const shift of [-500, -3.7, 0, 19.2]) {
  const shifted = {
    minus: energies.minus + shift,
    neutral: energies.neutral + shift,
    plus: energies.plus + shift,
  };
  assert.ok(Math.abs((shifted.minus - shifted.neutral) - ionization) < 1e-12);
  assert.ok(Math.abs((shifted.neutral - shifted.plus) - affinity) < 1e-12);
  assert.ok(Math.abs((shifted.plus + shifted.minus - 2 * shifted.neutral) - curvature) < 1e-12);
}

const chapterPath = 'src/content/docs/part-03-important-preliminaries-on-atoms/chapter-10-electronic-structure-of-atoms.mdx';
const chapter = readFileSync(chapterPath, 'utf8');
assert.ok(!chapter.includes('outline · 正文待填充'), 'Chapter 10 still contains the generated outline marker');
assert.ok(!chapter.includes('TODO'), 'Chapter 10 still contains TODO');
assert.match(chapter, /Chapter10Radial/);
assert.match(chapter, /Chapter10SphericalAtom/);
assert.match(chapter, /SpinOrbitConventionAudit/);
assert.match(chapter, /Chapter10RelativityOpenShell/);
assert.match(chapter, /Chapter10EnergeticsASA/);
assert.match(chapter, /Chapter10Review/);

const conventionAudit = readFileSync(
  'src/components/part03/ch10/SpinOrbitConventionAudit.mdx',
  'utf8',
);
assert.match(conventionAudit, /data-spin-orbit-unit-convention/);
assert.match(conventionAudit, /data-normalized-operator="LdotS-over-hbar2"/);
assert.match(conventionAudit, /data-xi-unit="energy"/);
assert.ok(conventionAudit.includes('10.14'), 'Spin-orbit convention audit must identify Martin Eq. (10.14)');
assert.match(conventionAudit, /potential energy|电子势能/);
assert.match(conventionAudit, /energy divided by \$\\hbar\^2\$|能量除以 \$\\hbar\^2\$/);
assert.match(conventionAudit, /cannot be mixed under one operator definition|不能在同一算符定义下混用/);
assert.match(conventionAudit, /SpinOrbitMathScroll/);
assert.equal(
  [...conventionAudit.matchAll(/<SpinOrbitMathScroll\b/g)].length,
  6,
  'The bilingual SOC convention audit must contain six local equation scrollers',
);

const mathScroll = readFileSync(
  'src/components/part03/ch10/SpinOrbitMathScroll.astro',
  'utf8',
);
assert.match(mathScroll, /data-soc-math-scroll/);
assert.match(mathScroll, /role="region"/);
assert.match(mathScroll, /tabindex="0"/);
assert.match(mathScroll, /overflow-x:\s*auto/);
assert.match(mathScroll, /overflow-y:\s*hidden/);
assert.match(mathScroll, /max-width:\s*100%/);
assert.match(mathScroll, /width:\s*max-content/);
assert.match(mathScroll, /min-width:\s*100%/);

const relativity = readFileSync(
  'src/components/part03/ch10/Chapter10RelativityOpenShell.mdx',
  'utf8',
);
assert.match(relativity, /\\hat\\Lambda_\{LS\}/);
assert.match(relativity, /\\frac\{\\mathbf L\\cdot\\mathbf S\}\{\\hbar\^2\}/);
assert.match(relativity, /electron potential energy|电子势能/);
assert.doesNotMatch(
  relativity,
  /represented by ξ_nl L·S|写成 ξ_nl L·S/,
  'Chapter 10 must not assign an energy-valued xi directly to the dimensional L dot S operator',
);

const spinOrbitExplorer = readFileSync(
  'src/components/part03/ch10/SpinOrbitExplorer.astro',
  'utf8',
);
assert.match(spinOrbitExplorer, /data-normalized-operator="LdotS-over-hbar2"/);
assert.match(spinOrbitExplorer, /data-xi-unit="energy"/);
assert.ok(
  spinOrbitExplorer.includes('H_SO(model)=ξ(L·S/ℏ²)'),
  'Spin-orbit explorer must display the normalized model Hamiltonian',
);
assert.ok(spinOrbitExplorer.includes('eV/ℏ²'), 'Spin-orbit explorer must state direct-operator coefficient units');
assert.doesNotMatch(
  spinOrbitExplorer,
  /The model Hamiltonian is H_SO = ξ L·S|模型 Hamiltonian 为 H_SO = ξ L·S/,
  'Spin-orbit explorer retains the dimensionally ambiguous model caption',
);

console.log('Part III Chapter 10 deterministic validation passed: radial models, spin-orbit unit convention, local equation containment, Delta-SCF arithmetic, and route registration.');
