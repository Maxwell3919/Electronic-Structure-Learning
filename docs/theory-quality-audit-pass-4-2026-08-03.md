# Theory quality audit — pass 4: Chemistry and finite systems

Review date: 2026-08-03

Website baseline: `c14e343bd2bd8a47f02b8510d77a3a09e5853072`

This document continues the rolling Theory quality audit. It uses the same scientific-correctness, responsibility-boundary, derivation-continuity, mathematical-presentation, evidence, cross-page-coherence, and reader-value criteria. It does not impose one visible page template, equal page length, a completion dashboard, or a fixed chemistry curriculum.

## Scope

The fourth pass reviewed:

- Quantum Chemistry;
- Atomic and Molecular Physics;
- Chemical Bonding and Molecular Structure;
- General Chemistry;
- Inorganic Chemistry;
- Solid-State Chemistry;
- Surface and Interface Chemistry.

The bounded evidence basis was the uploaded Theory systematic-review report, the current public page sources, Richard M. Martin's second-edition electronic-structure text where relevant, and the existing source-review records. The report assigns these pages complementary responsibilities: molecular Hamiltonians and approximation language; states and spectra; bonding interpretations; chemistry-background repair; coordination and d/f-electron interpretation; composition and defects; and surfaces/interfaces. This pass did not perform a new time-bounded network reachability audit of every external resource.

## Findings

### Quantum Chemistry

Status: **Major native-MathML repair completed; scientific responsibility accepted**.

Strengths retained:

- starts from the coupled nuclear–electronic molecular problem and introduces the Born–Oppenheimer hierarchy;
- separates the clamped-nuclei electronic Hamiltonian from nuclear repulsion and nuclear motion;
- connects potential-energy surfaces to structures, normal modes, and reaction paths without equating program termination with a stationary point;
- distinguishes orbitals, Slater determinants, many-electron states, variational searches, mean field, and correlation;
- treats basis-set and interpretation errors as distinct from method truncation.

Finding QC-1: the native MathML placed the electronic-Hamiltonian subscript on an empty node rather than on the hatted Hamiltonian. The visual equation also omitted explicit lower limits for electron and nucleus sums, while the pair sum used a compressed range whose bounds were not fully visible.

Action completed: attached the subscript to the complete hatted Hamiltonian and made all summation domains explicit in both MathML and the TeX annotation.

Finding QC-2: the variational-energy display attached the `trial` label to empty nodes after `E` and `Psi`, so the visual MathML tree did not encode the same mathematical objects as its TeX annotation.

Action completed: attached every `trial` subscript to the corresponding energy or state symbol. The variational statement and scientific scope are unchanged.

### Atomic and Molecular Physics

Status: **Accepted without public-page modification**.

The page already:

- uses hydrogenic states as a reference vocabulary without presenting them as quantitative models for general atoms;
- distinguishes term symbols from single occupation diagrams and identifies alternative coupling schemes;
- separates fine, hyperfine, Zeeman, and Stark structure;
- treats molecular rotation and vibration as additional energy scales with anharmonic and environment boundaries;
- explains selection rules through transition matrix elements while allowing vibronic, relativistic, field, and symmetry-breaking activation;
- states that ground-state Kohn–Sham eigenvalue differences are not generally quantitative excitation energies.

No concrete scientific, responsibility, or MathML defect requiring correction was identified. Collision physics, laser engineering, and molecular dynamics remain outside the page's current responsibility.

### Chemical Bonding and Molecular Structure

Status: **Accepted without public-page modification**.

The page already:

- rejects one universal quantum-mechanical bond observable;
- separates nuclear geometry from electronic stabilization mechanisms;
- treats molecular orbitals as basis- and gauge-dependent representations;
- identifies the overlap metric and analysis convention behind density-matrix populations and bond indices;
- separates electron-density topology, orbital pictures, energy decomposition, formal bond orders, and oxidation states;
- warns against selecting an analysis after seeing a preferred narrative or forcing distinct analyses to agree.

No concrete scientific or MathML defect requiring correction was identified. A later learner test should determine whether examples are needed to show how two valid analyses can answer different questions without contradiction.

### General Chemistry

Status: **Major core-treatment boundary repaired**.

Strengths retained:

- positions General Chemistry as background repair rather than a compulsory full-course prerequisite;
- separates exact composition/charge bookkeeping from formal charges, oxidation states, partial charges, orbital populations, and density partitions;
- treats periodic trends, Lewis structures, acid–base/redox language, equilibrium, and kinetics as bounded interpretive tools;
- links chemical vocabulary to defects, surfaces, electrochemistry, reservoirs, and magnetic initial states without turning the page into a reaction or laboratory course.

Finding GC-1: the page called

```text
Ne = sum_I Z_I - q
```

the exact electron count without stating that the displayed `Z_I` are full nuclear charges in an all-electron formulation. In a pseudopotential or frozen-core PAW calculation, only the dataset's declared valence electrons are optimized explicitly.

Action completed: scoped the equation to the all-electron Hamiltonian, added the valence-only effective-core boundary, and required the dataset lineage and frozen-core partition to remain explicit. The page still separates both electron counts from oxidation-state or partial-charge assignments.

### Inorganic Chemistry

Status: **Minor formal-versus-computed occupation repair completed**.

Strengths retained:

- treats oxidation state as formal bookkeeping rather than integrated charge;
- connects coordination geometry, local symmetry, ligand/crystal fields, spin competition, distortions, magnetism, and spectroscopy;
- limits crystal-field stabilization formulas to an idealized ionic model;
- rejects a Kohn–Sham density of states as a universal simulated spectrum;
- requires several chemically plausible spin, orbital, structural, and magnetic branches.

Finding IC-1: the formal transition-metal d-electron count was written as the approximate relation `n_d approximately g - x`. Under the stated group-number and oxidation-state convention, `g - x` is the formal assignment itself; approximation enters only when that formal count is compared with a real-space or orbital-projected electronic occupation.

Action completed: replaced the formula with `n_d^formal = g - x` and stated explicitly that projected d occupations can be non-integer and method-dependent without invalidating formal charge balance.

The report's unresolved resource gap remains: no single modern, complete, openly accessible inorganic-chemistry course has been established as a sole recommendation.

### Solid-State Chemistry

Status: **Accepted without public-page modification**.

The page already:

- separates chemical formula, structural prototype, actual crystal structure, composition, occupancy, and magnetic state;
- treats coordination and bonding descriptors as chemical models rather than unique observables;
- connects charge neutrality, defects, nonstoichiometry, carriers, and reservoirs;
- presents the charged-defect formation expression with sign, reference, alignment, correction, finite-size, and boundary conventions explicit;
- distinguishes nominal dopant content from free-carrier concentration and a rigid-band model from real substitution;
- limits zero-temperature convex-hull conclusions and acknowledges entropy, pressure, defects, surfaces, metastability, and kinetics.

No concrete scientific or MathML defect requiring correction was identified. The report's second-round modern solid-state-chemistry textbook comparison remains pending.

### Surface and Interface Chemistry

Status: **Minor surface-excess identifiability repair completed**.

Strengths retained:

- defines a surface model through termination, stoichiometry, reconstruction, coverage, environment, cell, charge, and magnetism rather than Miller index alone;
- separates surface energy, adsorption energy, work function, surface states, reconstruction, band alignment, charge redistribution, and interface dipoles;
- states reference and sign conventions and rejects adsorption energy as a barrier, rate, coverage isotherm, or catalytic activity;
- requires vacuum, dipole, slab-thickness, full surface-Brillouin-zone, localization, and electrostatic-reference checks;
- limits charge-density-difference plots and band line plots as evidence.

Finding SI-1: the page correctly limited the `1/(2A)` surface-energy formula to a symmetric slab with equivalent faces, but it did not state what a single asymmetric slab determines. For inequivalent top and bottom surfaces, the total excess generally fixes only the sum of the two surface excesses.

Action completed: added the `gamma_top + gamma_bottom` identifiability boundary and stated that extracting one face energy requires additional reference slabs, symmetry relations, chemical-potential constraints, or another thermodynamic construction.

The report's dedicated surface-science resource review remains open; current Woodruff and ASE entries are a characterization reference and implementation bridge rather than a complete first-principles course.

## Fourth-pass cross-page result

No blocker, broad scientific reversal, or major responsibility collision was found in the chemistry and finite-systems route:

```text
composition and chemical bookkeeping
├── molecular Hamiltonian and approximation hierarchy
│   ├── atomic and molecular states / spectra
│   └── orbital, density, energy, and formal bonding interpretations
├── coordination, d/f counts, spin, and spectroscopy
├── solid composition, defects, carriers, and competing phases
└── surfaces, adsorption, work functions, and interfaces
```

The route now more clearly separates:

- full all-electron count from explicitly optimized valence electrons in an effective-core Hamiltonian;
- formal oxidation and d-electron counts from projected electronic occupations;
- molecular orbitals and determinants from the full many-electron state;
- basis, method, correlation, and interpretation errors;
- a symmetric equivalent-face surface energy from the underdetermined individual energies of an asymmetric slab;
- a chemical model or computed diagnostic from the narrower observable and claim it can support.

## Pending checks

The first four passes do not claim:

- time-bounded external-link reachability for every resource;
- exhaustive comparison of editions, courses, exercises, or regional access conditions;
- completion of the dedicated Inorganic Chemistry, Solid-State Chemistry, or Surface and Interface Chemistry resource comparisons;
- cross-browser verification of every corrected MathML tree;
- assistive-technology conformance;
- learner testing or proof that every page has sufficient depth for every beginner;
- independent numerical reproduction of molecular energies, spectra, bond analyses, defect energetics, surface energies, work functions, or band alignments;
- completion of the full cross-link and prerequisite graph review.

## Next bounded review batches

1. **Advanced response and many body:** Many-Body Physics, Linear Response and Excited States, Many-Body Perturbation Theory and Quasiparticles, Statistical Mechanics, and Thermodynamics.
2. **Foundational support and navigation:** remaining mathematical and physical pages, source reachability, cross-link graph, narrow-screen equation rendering, accessibility, and learner-oriented reading trials.

Each later pass should correct only evidenced defects. The audit must not become a public completion dashboard, a mandatory page template, or a reason to lengthen every subject equally.
