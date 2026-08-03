# Theory quality audit — 2026-08-03

Audit baseline: `c0b22559f170113201e8bf7c1c70e5f7adbbc827`

Scope of the first pass:

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

Next action: perform a later cross-link graph review after the scientific passes. Do not create an independent client-side graph merely to display completion state.

### Linear Algebra

Status: **Minor revision completed**.

Strengths:

- clearly distinguishes an abstract state from its coordinates;
- connects nonorthogonal bases to the overlap matrix and generalized eigenproblem;
- emphasizes occupied subspaces rather than treating every orbital as unique;
- links the Rayleigh quotient to variational approximation and basis incompleteness.

Finding LA-1: the generalized Hermitian problem was shown, but the conditions that make it well posed were only implicit. For a linearly independent finite basis, the overlap matrix should be Hermitian positive definite, and generalized eigenvectors can be normalized through the `S` metric.

Action completed: added the positive-definite and `S`-orthonormal conditions without expanding the page into a numerical eigensolver tutorial.

### Quantum Mechanics

Status: **Major mathematical-presentation repair completed; scientific scope accepted**.

Strengths:

- separates the state from wavefunction representations;
- distinguishes eigenvalues from expectation values;
- treats spin as a quantum degree of freedom and introduces tensor products;
- places fermionic antisymmetry before Hartree–Fock and correlation approximations.

Finding QM-1: the displayed expectation-value MathML encoded the state label as a subscript attached to an empty operator node. The intended mathematics was clear in the TeX annotation, but the native MathML tree was malformed.

Action completed: attached the state label to the complete expectation-value expression.

Finding QM-2: the page has suitable upstream content but limited direct internal navigation. Add only high-value links to Linear Algebra and The Many-Electron Problem during a later cross-link pass; this is not a scientific blocker.

### The Many-Electron Problem

Status: **Major mathematical-presentation repairs completed; scientific boundary accepted**.

Strengths:

- defines the clamped-nuclei interacting Hamiltonian before discussing approximation routes;
- explains both coordinate-space and determinant-space growth;
- distinguishes exact antisymmetry from approximate Coulomb treatment;
- explicitly separates exchange, Coulomb/dynamical correlation, static correlation, and convention-dependent “Fermi correlation”;
- separates ground-state and excitation questions.

Finding ME-1: the visual Hamiltonian summation omitted `i = 1`, even though the TeX annotation included it, and placed an unnecessary upper limit on the pair sum.

Finding ME-2: the native MathML for the density placed the exponent `2` on each vertical bar rather than on the complete modulus of the wavefunction.

Actions completed: normalized both equations while preserving the surrounding exposition.

### Density Functional Theory: Foundations

Status: **Major mathematical-presentation and constraint-notation repairs completed; responsibility boundary accepted**.

Strengths:

- keeps Hohenberg–Kohn/Levy–Lieb foundations separate from the Kohn–Sham construction;
- labels the first theorem as an existence/uniqueness result rather than a reconstruction algorithm;
- distinguishes `N`-representability from ground-state `v`-representability;
- separates exact DFT, approximate functionals, numerical convergence, and excitation interpretation.

Finding DFT-1: the Hamiltonian subscript `v` was attached to an empty MathML node instead of the hatted Hamiltonian.

Finding DFT-2: the minimization label `n → N` was too compressed and could be mistaken for a mapping or limit.

Actions completed: repaired the MathML tree and replaced the shorthand minimization label with explicit nonnegativity and particle-number constraints, while preserving representability as a further domain condition.

### Kohn–Sham Density Functional Theory

Status: **Minor derivation gap repaired; scientific interpretation accepted**.

Strengths:

- states that the auxiliary system preserves the density, not the interacting wavefunction;
- separates the Kohn–Sham construction from XC approximation and SCF iteration;
- identifies the nonlinear density closure;
- limits the interpretation of orbitals and eigenvalues;
- separates functional, representation, self-consistency, sampling, and boundary errors.

Finding KS-1: the page said correctly that the occupied eigenvalue sum is not the total energy, but did not show the correction relation.

Finding KS-2: the density expression combined explicit occupations with an “occupied” upper label on the sum.

Actions completed: used an occupation-weighted sum over states and added the ordinary local multiplicative Kohn–Sham total-energy identity, including nucleus–nucleus and generalized-Kohn–Sham boundaries.

## First-pass cross-page result

No blocker or major responsibility collision was found in the chain

```text
Linear Algebra
→ Quantum Mechanics
→ The Many-Electron Problem
→ DFT Foundations
→ Kohn–Sham DFT
```

The strongest existing quality is the separation among interacting theory, density-functional existence results, the Kohn–Sham auxiliary system, XC approximation, nonlinear SCF solution, and numerical representation. The first-pass defects were localized mathematical-presentation and derivation-continuity issues rather than a need to rewrite the route.

## Second-pass scope — DFT computational closure

The second pass reviewed:

- Exchange–Correlation Functionals and Approximations;
- Self-Consistent Field Methods;
- Discretization and Basis Representations;
- Plane-Wave and Real-Space Methods;
- Localized-Orbital Methods;
- Pseudopotentials, PAW, and Core–Valence Treatments;
- Brillouin-Zone Sampling.

The scope follows the Theory systematic-review report, which requires the route to distinguish functional approximation, nonlinear solution, finite representation, core treatment, and reciprocal-space integration. The pages were compared with the relevant Martin second-edition discussions and their existing source-review boundaries. This pass did not perform a time-bounded network reachability audit of every external resource.

## Second-pass findings

### Exchange–Correlation Functionals and Approximations

Status: **Major derivation and implementation-scope repair completed**.

Strengths:

- distinguishes the exact XC remainder from practical approximations;
- organizes LDA, GGA, meta-GGA, hybrid, nonlocal-correlation, and dispersion-related families without treating Jacob’s ladder as an accuracy ranking;
- discusses exact constraints, self-interaction/delocalization error, static correlation, derivative discontinuity, density-driven error, and observable-specific validation;
- records implementation identifiers and pseudopotential/PAW lineage as part of reproducibility.

Finding XC-1: the earlier equation wrote interacting kinetic and electron-interaction pieces as separate density functionals `T[n]` and `Vee[n]` without defining the constrained-search convention. The exact and unambiguous Kohn–Sham partition is `Exc[n] = F[n] - Ts[n] - EH[n]`.

Finding XC-2: the functional-derivative section could be read as implying that every meta-GGA or hybrid enters through one multiplicative local `vxc`. Orbital-dependent forms are commonly implemented through generalized Kohn–Sham differential or nonlocal operators.

Actions completed: replaced the decomposition with the Levy–Lieb/Kohn–Sham partition and stated the ordinary-KS versus generalized-KS implementation boundary.

### Self-Consistent Field Methods

Status: **Major cross-page notation repair completed**.

Strengths:

- treats SCF as a nonlinear fixed-point algorithm rather than a physical theory;
- distinguishes residuals, mixing, preconditioning, occupations, charge sloshing, metastable branches, and target-observable convergence;
- clearly separates program completion, SCF convergence, numerical observable convergence, and scientific support.

Finding SCF-1: the fixed-point map reused `F[n]`, already reserved across the DFT pages for the universal internal functional. This created an avoidable cross-page notation collision.

Finding SCF-2: a small fixed-point residual was correctly bounded, but the page did not explicitly state that it is not generally the gradient of the total energy or a direct estimate of energy error.

Actions completed: renamed the SCF map `𝓜[n]`, explicitly distinguished it from the universal DFT functional, and clarified residual interpretation.

### Discretization and Basis Representations

Status: **Accepted without public-page modification**.

The page already separates orbital bases, quadrature, grids, boundary conditions, core treatment, finite cells, and Brillouin-zone sampling. It correctly treats plane waves, localized functions, finite differences, finite elements, and adaptive representations as different families; distinguishes basis, quadrature, and grid; records Pulay, aliasing, egg-box, boundary, and unbalanced-comparison errors; and attaches convergence to the target observable.

No concrete scientific or MathML defect requiring correction was identified in this pass. Cross-link density and browser accessibility remain later audit questions.

### Plane-Wave and Real-Space Methods

Status: **Minor representation-convergence gap repaired**.

Strengths:

- distinguishes reciprocal vectors, Bloch k points, plane-wave cutoffs, FFT grids, and Brillouin-zone meshes;
- treats real-space methods as a family rather than a synonym for finite differences;
- separates electrostatic boundary conditions and Poisson conventions from mere solver termination;
- records aliasing, egg-box, image-interaction, reflection, and grid-consistency errors.

Finding PW-1: the page did not state that changing cell volume or shape at a fixed kinetic-energy cutoff changes the finite plane-wave set. This is essential for stress, equation-of-state, and cell-optimization convergence.

Action completed: added the fixed-cutoff cell-change mechanism and the resulting Pulay-like stress boundary, without implying that plane waves move with individual atoms.

### Localized-Orbital Methods

Status: **Major responsibility gap repaired**.

Strengths:

- distinguishes empirical tight binding from self-consistent first-principles localized-basis calculations;
- covers nonorthogonal generalized eigenproblems, Bloch sums, Gaussian/Slater/numerical basis families, BSSE, Pulay terms, and locality;
- rejects cross-code equivalence of zeta labels, radial cutoffs, and basis tiers.

Finding LO-1: the systematic report explicitly assigns Wannier functions as a cross-responsibility between Localized-Orbital Methods and Berry Phases/Topology, but the page previously mentioned only “Wannier-like” locality. It did not distinguish atom-centred basis functions, canonical eigenstates, and Wannier transforms of selected Bloch subspaces.

Action completed: added a compact Wannier construction, gauge/subspace/window/disentanglement dependencies, interpolation-validation boundary, and link to the Berry/topology page. The page now also records possible topological obstruction to a symmetry-preserving localized representation.

### Pseudopotentials, PAW, and Core–Valence Treatments

Status: **Accepted without public-page modification**.

The page already distinguishes frozen-core approximation, scattering transferability, norm conservation, nonlocal projectors, ultrasoft augmentation, PAW transformation, semicore choices, relativistic dataset lineage, verification, numerical convergence, and scientific validation. It also states that PAW reconstruction does not mean all electrons were variationally optimized and that a library benchmark cannot validate every target system or observable.

No concrete scientific or MathML defect requiring correction was identified in this pass. Dataset-link reachability and current-version review remain separate maintenance tasks.

### Brillouin-Zone Sampling

Status: **Minor terminology repair completed**.

Strengths:

- treats k-point selection as numerical quadrature rather than band-path drawing;
- distinguishes full and irreducible meshes, offsets, symmetry, metals, smearing, tetrahedra, SCF/NSCF/DOS meshes, and illustrative paths;
- rejects a smooth high-symmetry path as evidence of a global gap, Fermi surface, or converged integral.

Finding BZ-1: the page called a k-dependent integrand `A(k)` a “cell-periodic quantity.” Cell periodicity is a real-space property of functions such as the periodic Bloch factor; it is not the correct generic description of a function on the Brillouin zone.

Action completed: replaced the phrase with “k-dependent Brillouin-zone integrand or observable contribution” and clarified that weight normalization depends on whether the expression is an average, full integral, or irreducible-zone sum.

## Second-pass cross-page result

No blocker, broad scientific reversal, or major responsibility collision was found in the computational-closure route:

```text
XC approximation
→ SCF fixed-point solution
→ finite discretization
├── plane-wave / real-space representation
├── localized-orbital representation
└── pseudopotential / PAW core treatment
→ Brillouin-zone integration
```

The route now more clearly separates:

- the universal DFT functional from the SCF map;
- ordinary multiplicative Kohn–Sham potentials from generalized-Kohn–Sham operators;
- plane-wave basis convergence from cell-dependent stress errors;
- atom-centred basis functions from Wannier representations;
- real-space periodicity from k-space integration;
- core-dataset verification from material-specific validation.

## Pending checks

The following remain outside the claims of the first two passes:

- time-bounded external-link reachability for every resource on the reviewed pages;
- exhaustive comparison of all editions, courses, exercises, and regional access conditions;
- rendered correction verification across multiple browser engines;
- assistive-technology testing;
- learner testing or proof that the current page depth is sufficient for every beginner;
- independent numerical reproduction of functional, SCF, basis, dataset, or k-point claims;
- complete cross-link and prerequisite-graph review.

## Next review batches

1. **Periodic physics:** Solid-State Physics, Crystallography, Fourier Analysis, Group Theory and Symmetry, Relativity/Spin/Magnetism, and Berry Phases/Topology.
2. **Chemistry and finite systems:** Quantum Chemistry, Atomic and Molecular Physics, Chemical Bonding, General/Inorganic/Solid-State Chemistry, and Surface/Interface Chemistry.
3. **Advanced response and many body:** Many-Body Physics, Linear Response and Excited States, MBPT and Quasiparticles, Statistical Mechanics, and Thermodynamics.
4. **Foundational support and navigation:** remaining mathematical/physical pages, source reachability, cross-link graph, narrow-screen equation rendering, accessibility, and learner-oriented reading trials.

Each batch should fix only evidenced defects. The audit must not become a new public page template, completion dashboard, or requirement to lengthen every subject equally.
