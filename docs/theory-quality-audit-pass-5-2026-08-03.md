# Theory quality audit — pass 5: Advanced response and many body

Review date: 2026-08-03

Website baseline: `0e8ca0228db7794864edc65a178406f5473ce2be`

This document continues the rolling Theory quality audit. It uses the same scientific-correctness, responsibility-boundary, derivation-continuity, mathematical-presentation, evidence, cross-page-coherence, and reader-value criteria. It does not impose one visible page template, equal page length, a completion dashboard, or a requirement that ordinary ground-state DFT users complete an advanced many-body curriculum.

## Scope

The fifth pass reviewed:

- Many-Body Physics;
- Linear Response and Excited States;
- Many-Body Perturbation Theory and Quasiparticles;
- Statistical Mechanics;
- Thermodynamics.

The bounded evidence basis was the uploaded Theory systematic-review report, the current public page sources, Richard M. Martin's second-edition electronic-structure text where relevant, and the existing page source and acceptance records. The report assigns these pages complementary responsibilities: second quantization and Green functions; response functions, DFPT, and TDDFT; screened self-energy and electron–hole excitations; microscopic ensembles and finite-temperature occupations; and macroscopic potentials and equilibrium constraints.

The systematic report explicitly requires:

- Many-Body Physics to remain an advanced continuation rather than a prerequisite for ordinary Kohn–Sham DFT;
- Statistical Mechanics to include Fermi–Dirac and Bose–Einstein statistics, fluctuations, quantum gases, phase-transition awareness, and the finite-temperature/smearing boundary;
- Thermodynamics to avoid identifying zero-temperature total-energy rankings with complete thermodynamic stability;
- Linear Response and Excited States to separate response derivatives, TDDFT, quasiparticle additions/removals, and BSE excitons.

This pass did not perform a new time-bounded network reachability audit of every external resource.

## Findings

### Many-Body Physics

Status: **Major convention and thermodynamic-limit repair completed**.

Strengths retained:

- keeps The Many-Electron Problem as the problem-definition page and Many-Body Physics as the formal second-quantized framework;
- introduces fermionic anticommutation, one- and two-body Hamiltonians, Green functions, quasiparticles, collective modes, broken symmetry, and advanced diagrammatic continuations;
- distinguishes a Kohn–Sham spectrum from an interacting spectral function;
- states that ordinary ground-state DFT users do not need complete path-integral or renormalization-group training.

Finding MB-1: the Fock-space introduction could be read as saying that physical particle number must vary. Second quantization organizes all particle-number sectors, while a fixed-number electronic problem can remain entirely inside one sector.

Action completed: changed the heading and text to distinguish formal Fock-space organization from physical exchange with a reservoir.

Finding MB-2: the two-body Hamiltonian displayed a factor of one half without defining whether the two-electron matrix elements were unsymmetrized or antisymmetrized. The conventional prefactor depends on that definition.

Action completed: stated that the displayed one-half form uses unsymmetrized matrix elements and that the corresponding antisymmetrized-integral convention uses a one-quarter prefactor with the same creation–annihilation ordering. Mixing the definitions is now identified as changing the Hamiltonian.

Finding MB-3: the real-time Green function used a natural-units prefactor without stating `hbar = 1`, and its pure-state expectation value did not distinguish zero-temperature and finite-temperature formulations.

Action completed: declared the natural-units convention and added the finite-temperature ensemble-trace, Matsubara, and analytic-continuation boundary.

Finding MB-4: the broken-symmetry paragraph referred broadly to long-range order in a “finite-dimensional system,” conflating finite simulation size with spatial dimensionality.

Action completed: separated finite-cell inability to establish spontaneous symmetry breaking in the thermodynamic limit from the distinct effect of fluctuations on long-range order in low-dimensional systems.

### Linear Response and Excited States

Status: **Major response-normalization and kernel-notation repair completed**.

Strengths retained:

- starts from a declared weak perturbation and a response derivative;
- separates finite differences, DFPT, Sternheimer equations, TDDFT, real-time propagation, Casida equations, and frequency-domain solvers;
- distinguishes neutral response from charged quasiparticle addition and removal;
- records perturbation-wavevector, k/q-mesh, local-field, Coulomb, empty-state, broadening, and boundary convergence controls.

Finding LR-1: the retarded Kubo formula omitted the factor `1/hbar`, while the page did not state a natural-units convention or the sign of the perturbation coupling. Response signs depend on that convention.

Action completed: declared `delta H(t) = -f(t) B`, restored the `-i/hbar` Kubo prefactor, and identified the coupling-sign convention as part of the response definition.

Finding LR-2: the TDDFT Dyson equation used the generic symbol `v`, which could be confused with an external or Kohn–Sham potential rather than the Coulomb kernel.

Action completed: renamed it `v_C`, identified it as the Coulomb kernel, and defined the exchange–correlation kernel schematically as the functional derivative of the time-dependent XC potential with respect to density in the declared representation.

### Many-Body Perturbation Theory and Quasiparticles

Status: **Major quasiparticle and BSE approximation-scope repair completed**.

Strengths retained:

- separates the local static Kohn–Sham potential from a nonlocal, frequency-dependent, complex self-energy;
- distinguishes bare and screened Coulomb interactions;
- treats `G0W0`, eigenvalue self-consistency, quasiparticle self-consistency, and fully self-consistent GW as different variants rather than a universal accuracy ladder;
- separates charged quasiparticle gaps from neutral optical excitations and exciton binding;
- names starting-point, empty-state, dielectric, frequency, dimensional Coulomb, k/q, SOC, core, BSE-subspace, and broadening controls.

Finding GW-1: the displayed real quasiparticle-energy correction inserted the generally complex self-energy matrix element without taking its real part. The page mentioned a renormalization factor but did not define it.

Action completed: changed the equation to a real-energy diagonal linearization using the real part of the self-energy correction, added the derivative definition of `Z_n`, and stated that complex-pole or spectral-function calculations retain the imaginary part and lifetime information.

Finding BSE-1: the displayed ordinary eigenvalue problem was presented generically, although it corresponds to a static-kernel resonant or Tamm–Dancoff-type formulation. The full BSE can couple resonant and antiresonant sectors.

Action completed: scoped the equation explicitly and stated that the simplified eigenproblem is not formulation-independent.

### Statistical Mechanics

Status: **Major ensemble, Bose-statistics, and finite-size responsibility gap repaired**.

Strengths retained:

- separates microscopic ensembles from macroscopic thermodynamics;
- connects canonical partition functions, Helmholtz free energy, Fermi occupations, electronic entropy, Mermin DFT, numerical smearing, phonon free energy, and fluctuations;
- avoids treating one smearing width or one harmonic calculation as complete finite-temperature evidence.

Finding SM-1: the page named the grand-canonical ensemble and Mermin DFT but did not show the grand partition function or grand potential.

Action completed: added `Xi = Tr exp[-beta(H - mu N)]` and `Omega = -k_B T ln Xi`, with an explicit reservoir and conserved-quantity boundary.

Finding SM-2: the systematic report assigns both Fermi–Dirac and Bose–Einstein statistics to the page, but only the fermionic occupation was present.

Action completed: added the Bose–Einstein occupation for a zero-chemical-potential mode, explained why equilibrium phonons usually have zero chemical potential, and stated that constrained or conserved bosonic numbers can require a different chemical-potential treatment.

Finding SM-3: phase transitions were mentioned only as a possible failure of the harmonic approximation. The page lacked the distinction between finite-cell rounding and thermodynamic-limit nonanalyticity.

Action completed: added order-parameter, finite-size, correlation-length, equilibration, sampling, and ensemble requirements and rejected one finite-cell peak or abrupt trajectory change as a phase-boundary proof.

Finding SM-4: the Many-Body Physics connection remained future-tense after that page had been published.

Action completed: replaced it with a live internal link and present-tense responsibility statement.

### Thermodynamics

Status: **Minor grand-potential derivation gap repaired**.

Strengths retained:

- begins from variables, constraints, laws, and the fundamental differential relation;
- distinguishes internal energy, Helmholtz, enthalpy, Gibbs, chemical potentials, phase coexistence, metastability, convex hulls, work terms, and response derivatives;
- rejects zero-temperature electronic energy as a complete free energy or synthesis criterion.

Finding TH-1: the page referred to open systems and grand potentials but displayed only Helmholtz, enthalpy, and Gibbs transformations.

Action completed: added `Omega = U - TS - sum_i mu_i N_i = F - sum_i mu_i N_i`, stated its fixed-temperature, fixed-volume, fixed-chemical-potential role, and noted that this thermodynamic symbol is unrelated to Berry curvature despite the shared notation.

## Fifth-pass cross-page result

No blocker, broad scientific reversal, or major responsibility collision was found in the advanced response and many-body route:

```text
microscopic ensembles and interacting states
├── second quantization and Green functions
│   ├── charged addition/removal spectra and quasiparticles
│   └── two-particle response and collective modes
├── weak perturbations and response functions
│   ├── ground-state derivatives / DFPT
│   └── neutral time-dependent response / TDDFT
├── screened self-energy / GW
│   └── electron–hole response / BSE
└── thermodynamic potentials and macroscopic equilibrium
```

The route now more clearly separates:

- Fock-space organization from a physical open-particle reservoir;
- unsymmetrized and antisymmetrized two-electron integral conventions;
- zero-temperature real-time Green functions from finite-temperature traces and Matsubara formulations;
- finite simulation cells from thermodynamic-limit and low-dimensional ordering questions;
- a response function from its perturbation-sign and `hbar` conventions;
- Coulomb kernels from external or effective one-particle potentials;
- real quasiparticle energies from complex poles, lifetimes, and spectral functions;
- resonant/Tamm–Dancoff BSE eigenproblems from the full coupled formulation;
- Fermi occupations, Bose occupations, numerical smearing, and physical finite temperature;
- canonical, grand-canonical, Helmholtz, Gibbs, and grand-potential constraints.

## Pending checks

The first five passes do not claim:

- time-bounded external-link reachability for every resource;
- exhaustive comparison of editions, courses, exercises, or regional access conditions;
- cross-browser verification of every corrected MathML tree;
- assistive-technology conformance;
- learner testing or proof that every page has sufficient depth for every beginner;
- independent numerical reproduction of Green functions, response kernels, GW corrections, BSE excitations, thermal occupations, phase transitions, or free energies;
- completion of the full cross-link and prerequisite graph review.

## Next bounded review batch

The final content-wide pass is **Foundational support and navigation**. It should review:

- Calculus and Analysis;
- Differential Equations;
- Functional Analysis and Variational Methods;
- Numerical Analysis;
- Probability and Statistics;
- Classical Mechanics;
- Electromagnetism;
- Physical Chemistry;
- cross-page prerequisite and onward links;
- time-bounded external-resource reachability;
- narrow-screen MathML rendering and overflow;
- keyboard and no-JavaScript behavior;
- accessibility and learner-testing gaps.

That pass should distinguish deterministic repository checks from browser, accessibility, external-network, and learner evidence. It must not create a public completion dashboard, a mandatory page template, or a large client-side dependency graph.