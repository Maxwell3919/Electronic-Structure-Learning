# Theory quality audit — 2026-08-03

Audit baseline: `c0b22559f170113201e8bf7c1c70e5f7adbbc827`

Scope of this first pass:

- Theory directory and responsibility map;
- Linear Algebra;
- Quantum Mechanics;
- The Many-Electron Problem;
- Density Functional Theory: Foundations;
- Kohn–Sham Density Functional Theory.

This audit is a rolling scientific and editorial review. It does not impose one visible page template. A page can be organized differently from every other page and still pass if its scientific responsibility, mathematical objects, evidence boundaries, and learning route are clear.

## Review dimensions

1. **Scientific correctness** — definitions, equations, assumptions, and interpretation are consistent with the stated theory.
2. **Responsibility boundary** — the page neither omits its core intersection with electronic structure nor absorbs downstream subjects that have their own pages.
3. **Derivation continuity** — symbols are introduced before use, displayed equations match the surrounding claim, and important logical transitions are not hidden.
4. **Mathematical presentation** — native MathML is structurally valid, visually readable, semantically labelled, and accompanied by a TeX annotation.
5. **Evidence and resources** — resource role, access model, limitations, and non-use cases are explicit; link reachability is a separate time-bounded check.
6. **Cross-page coherence** — terminology and links preserve the chain from quantum states to the interacting problem, density-functional foundations, the Kohn–Sham auxiliary system, XC approximation, SCF solution, and numerical representation.
7. **Reader value** — the page explains why the subject matters for electronic structure without becoming a generic course summary or a software recipe.

## Severity

- **Blocker:** scientifically false or unusable public content.
- **Major:** a displayed equation, responsibility boundary, or central inference is materially misleading.
- **Minor:** a localized notation, navigation, resource, or explanatory gap that does not reverse the page's main conclusion.
- **Accepted:** no concrete defect found in the reviewed dimension.
- **Pending:** requires a later source, link, browser, or learner test.

## First-pass findings

### Theory directory

Status: **Accepted with pending relationship review**.

The directory represents all thirty-nine declared subject responsibilities and preserves the four-area classification. It correctly describes the Learning Map as a relationship layer rather than a fixed curriculum. The remaining quality question is not page coverage but whether prerequisites and converging routes are easy to follow across the existing links.

Next action: perform a later cross-link graph review after the first scientific passes. Do not create an independent client-side graph merely to display completion state.

### Linear Algebra

Status: **Minor revision**.

Strengths:

- clearly distinguishes an abstract state from its coordinates;
- connects nonorthogonal bases to the overlap matrix and generalized eigenproblem;
- emphasizes occupied subspaces rather than treating every orbital as unique;
- links the Rayleigh quotient to variational approximation and basis incompleteness.

Finding LA-1: the generalized Hermitian problem is shown, but the conditions that make it well posed are only implicit. For a linearly independent finite basis, the overlap matrix should be Hermitian positive definite, and generalized eigenvectors can be normalized through the `S` metric. This is the missing algebraic bridge to localized-orbital calculations.

Action: add the positive-definite and `S`-orthonormal conditions without expanding the page into a numerical eigensolver tutorial.

### Quantum Mechanics

Status: **Major mathematical-presentation repair; scientific scope accepted**.

Strengths:

- separates the state from wavefunction representations;
- distinguishes eigenvalues from expectation values;
- treats spin as a quantum degree of freedom and introduces tensor products;
- places fermionic antisymmetry before Hartree–Fock and correlation approximations.

Finding QM-1: the displayed expectation-value MathML encodes the state label as a subscript attached to an empty operator node. The intended mathematics is clear in the TeX annotation, but the native MathML tree is malformed and may render inconsistently.

Action: attach the state label to the complete expectation-value expression.

Finding QM-2: the page has suitable upstream content but limited direct internal navigation. Add only high-value links to Linear Algebra and The Many-Electron Problem during a later cross-link pass; this is not a scientific blocker.

### The Many-Electron Problem

Status: **Major mathematical-presentation repair; scientific boundary accepted**.

Strengths:

- defines the clamped-nuclei interacting Hamiltonian before discussing approximation routes;
- explains both coordinate-space and determinant-space growth;
- distinguishes exact antisymmetry from approximate Coulomb treatment;
- explicitly separates exchange, Coulomb/dynamical correlation, static correlation, and convention-dependent “Fermi correlation”;
- separates ground-state and excitation questions.

Finding ME-1: the visual Hamiltonian summation omits `i = 1`, even though the TeX annotation includes it, and places an unnecessary upper limit on the pair sum. The visual and annotated equations should agree.

Finding ME-2: the native MathML for the density places the exponent `2` on each vertical bar rather than on the complete modulus of the wavefunction. The TeX annotation is correct, but the rendered mathematical object is structurally wrong.

Action: normalize both equations while preserving the surrounding exposition.

### Density Functional Theory: Foundations

Status: **Major mathematical-presentation and constraint-notation repair; responsibility boundary accepted**.

Strengths:

- keeps Hohenberg–Kohn/Levy–Lieb foundations separate from the Kohn–Sham construction;
- labels the first theorem as an existence/uniqueness result rather than a reconstruction algorithm;
- distinguishes `N`-representability from ground-state `v`-representability;
- separates exact DFT, approximate functionals, numerical convergence, and excitation interpretation.

Finding DFT-1: the Hamiltonian subscript `v` is attached to an empty MathML node instead of the hatted Hamiltonian.

Finding DFT-2: the minimization label `n → N` is too compressed and can be mistaken for a mapping or limit. The admissible-density constraint should be visible as nonnegativity plus normalization to `N`.

Action: repair the MathML tree and replace the shorthand minimization label with an explicit density-domain constraint. The constrained-search formula remains aligned with Martin's Chapter 6 presentation.

### Kohn–Sham Density Functional Theory

Status: **Minor derivation gap; scientific interpretation accepted**.

Strengths:

- states that the auxiliary system preserves the density, not the interacting wavefunction;
- separates the Kohn–Sham construction from XC approximation and SCF iteration;
- identifies the nonlinear density closure;
- limits the interpretation of orbitals and eigenvalues;
- separates functional, representation, self-consistency, sampling, and boundary errors.

Finding KS-1: the page says correctly that the occupied eigenvalue sum is not the total energy, but does not show the correction relation. Because this distinction is central and often misunderstood, one compact equation should display the Hartree double-counting and XC-potential subtraction.

Finding KS-2: the density expression combines explicit occupations with an “occupied” upper label on the sum. Summing over states with occupation factors is the clearer general notation, especially because the next paragraph discusses fractional occupations.

Action: use `sum_i f_i |phi_i|^2` and add one total-energy identity, with the usual local multiplicative XC-potential scope stated. Generalized Kohn–Sham variants remain outside this page.

## Cross-page result

No first-pass blocker or major responsibility collision was found in the chain

```text
Linear Algebra
→ Quantum Mechanics
→ The Many-Electron Problem
→ DFT Foundations
→ Kohn–Sham DFT
```

The most important current defects are native-MathML structure and one ambiguous density-domain notation. The conceptual separation among interacting theory, density-functional existence results, the Kohn–Sham auxiliary system, XC approximation, and numerical solution is already strong and should not be collapsed during revision.

## Pending checks

The following are deliberately not claimed by this pass:

- time-bounded external-link reachability for every resource on the reviewed pages;
- exhaustive comparison of all editions, courses, exercises, and regional access conditions;
- browser verification of every corrected MathML tree across engines;
- assistive-technology testing;
- learner testing or proof that the current page depth is sufficient for every beginner;
- independent verification of every textbook statement beyond the bounded Martin/report comparison used here.

## Next review batches

1. **DFT computational closure:** XC Functionals, SCF Methods, Discretization and Basis Representations, Plane-Wave and Real-Space Methods, Localized-Orbital Methods, Pseudopotentials/PAW, and Brillouin-Zone Sampling.
2. **Periodic physics:** Solid-State Physics, Crystallography, Fourier Analysis, Group Theory and Symmetry, Relativity/Spin/Magnetism, and Berry Phases/Topology.
3. **Chemistry and finite systems:** Quantum Chemistry, Atomic and Molecular Physics, Chemical Bonding, General/Inorganic/Solid-State Chemistry, and Surface/Interface Chemistry.
4. **Advanced response and many body:** Many-Body Physics, Linear Response and Excited States, MBPT and Quasiparticles, Statistical Mechanics, and Thermodynamics.
5. **Foundational support and navigation:** remaining mathematical/physical pages, source reachability, cross-link graph, narrow-screen equation rendering, accessibility, and learner-oriented reading trials.

Each batch should fix only evidenced defects. The audit must not become a new public page template, completion dashboard, or requirement to lengthen every subject equally.
