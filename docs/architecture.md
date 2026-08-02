# Electronic Structure Atlas architecture

Electronic Structure Atlas is a small, static, content-first website. Its public information architecture has five entries:

```text
Home
Theory
Methods
Computational Tools
Reference
```

The implementation uses Plain Astro pages, one shared layout, and one global stylesheet. It has no Starlight layer, content registry, search index, client hydration, packaged fonts, interactive runtime, backend, account system, or database.

## Theory

Theory connects mathematical, physical, chemical, and electronic-structure foundations. Its directory remains organized at two subject levels. Foundational entries are broad course-like domains; Electronic Structure Theory entries are narrower theory and method modules. Their different granularity is intentional.

The reviewed content has developed in eight batches:

1. Linear Algebra, Calculus and Analysis, Numerical Analysis.
2. Quantum Mechanics, Solid-State Physics, Quantum Chemistry.
3. The Many-Electron Problem, Hartree and Hartree–Fock Theory, Density Functional Theory: Foundations.
4. Kohn–Sham Density Functional Theory, Exchange–Correlation Functionals and Approximations, Self-Consistent Field Methods, Discretization and Basis Representations.
5. Differential Equations, Fourier Analysis, Crystallography, Group Theory and Symmetry.
6. Plane-Wave and Real-Space Methods, Pseudopotentials/PAW/Core–Valence Treatments, Brillouin-Zone Sampling, Relativistic Electronic Structure/Spin/Magnetism.
7. Atomic and Molecular Physics, Physical Chemistry, Chemical Bonding and Molecular Structure, Localized-Orbital Methods.
8. Electromagnetism, Statistical Mechanics, Solid-State Chemistry.

The Tier-1 responsibility chain remains explicit:

```text
interacting many-electron problem
→ density-functional foundations
→ auxiliary Kohn–Sham system
→ exchange–correlation approximation
→ nonlinear SCF solution
→ finite numerical representation
```

Tier 2 is not a fixed linear sequence. It now supports three complementary routes.

### Periodic plane-wave and real-space route

```text
Fourier analysis
├── plane-wave basis and FFT grids
└── Brillouin-zone integration

Crystallography and group theory
├── reciprocal cells and k-vector conventions
├── symmetry reduction
└── magnetic and double-group extensions

Discretization
├── plane-wave spectral spaces
├── real-space finite differences / finite elements / multiresolution
└── observable-specific representation convergence

Core treatment
├── frozen-core pseudopotentials
├── ultrasoft augmentation
└── PAW transformation and reconstruction

Relativity and magnetism
├── scalar-relativistic Hamiltonians
├── collinear and noncollinear spin
├── spin–orbit coupling
└── magnetic symmetry and anisotropy
```

### Molecular and localized-orbital route

```text
Quantum mechanics and group theory
├── atomic terms, angular momenta, fields, and spectra
└── molecular rotation, vibration, transitions, and selection rules

Physical chemistry
├── thermodynamic potentials and chemical potentials
├── barriers, rates, and kinetic models
└── spectroscopy and finite-temperature interpretation

Quantum chemistry and chemical bonding
├── molecular Hamiltonians and approximate electronic states
├── orbital, density, symmetry, and energy interpretations
└── method-dependent charges, bond orders, and decompositions

Localized-orbital methods
├── Gaussian, Slater, and numerical atom-centred functions
├── nonorthogonal generalized eigenproblems
├── periodic Bloch sums and tight-binding models
└── basis, grid, Pulay, and BSSE convergence
```

### Fields, finite temperature, and composition route

```text
Electromagnetism
├── Coulomb fields and Poisson equations
├── electrostatic boundaries and references
├── multipoles and polarization
└── dielectric and optical-response foundations

Statistical mechanics
├── ensembles and partition functions
├── Fermi occupations and electronic entropy
├── phonon and finite-temperature free energies
└── fluctuations and response

Solid-state chemistry
├── composition and structure types
├── defects, nonstoichiometry, and doping
├── chemical potentials and competing phases
└── synthesis-aware structure–property interpretation
```

The following responsibilities remain separate:

- A reciprocal-lattice vector in a plane-wave expansion is not a sampled Bloch k point.
- An FFT or real-space grid is not automatically the orbital basis.
- A pseudopotential-library verification result is not a validation of every target compound or observable.
- An SCF integration mesh, a denser NSCF/DOS mesh, and an illustrative band path are different objects.
- Scalar relativity, spin polarization, noncollinearity, and SOC are not interchangeable accuracy levels.
- One converged magnetic branch is not proof of the global magnetic ground state.
- Atomic and molecular spectra require transition operators and state models; they are not recovered from arbitrary ground-state Kohn–Sham eigenvalue differences.
- Electronic total energies, thermodynamic free energies, reaction barriers, rates, and spectra belong to different model layers.
- Orbital pictures, charge partitions, density topology, bond orders, and energy decompositions are distinct interpretation frameworks.
- Empirical tight binding and full self-consistent localized-basis electronic structure may share matrix algebra but do not support the same claims.
- Basis labels and radial cutoffs from different codes are not directly interchangeable; convergence remains system- and observable-specific.
- Electrostatic boundary conditions, Coulomb kernels, potential references, and charged-cell conventions are part of the model.
- Physical electronic temperature, numerical smearing, vibrational free energy, and trajectory sampling are distinct approximations.
- Formal oxidation states, partitioned charges, defect charge states, carrier concentrations, and nominal dopant counts are distinct quantities.
- Zero-temperature energy or convex-hull results do not by themselves establish finite-temperature phase stability or synthesis accessibility.

All reviewed pages share navigation, source discipline, mathematical presentation, and evidence boundaries, but they do not follow a mandatory public section template. Their internal order follows the reasoning structure of each subject.

Mathematics is authored as native MathML inside the static Astro source. Display equations use a shared scroll-contained wrapper, while inline expressions remain part of the prose. Every expression carries a TeX annotation inside MathML `<semantics>` for source readability and downstream reuse. The site does not load MathJax, KaTeX, packaged math fonts, or client-side equation scripts.

Books, course websites, resource evaluations, and detailed concept graphs are added only as separately reviewed content. Broken external resources are removed when their official destination cannot be verified. The Learning Map expresses relationships between detailed concepts and does not prescribe one fixed course sequence.

The relativistic/spin/magnetism page is included because the systematic review identified it as the clearest independent omission. Its minimum content and implementation anchors have been reviewed, but the dedicated second-round textbook/course comparison remains open and is stated on the page rather than hidden.

## Methods and other entrances

Methods provides a concise conceptual map of method families and what scientific problems they address. It does not duplicate operation contracts, executable recipes, convergence workflows, provenance, or reproducibility packaging maintained by DFT Research Workflow.

Computational Tools keeps commands and file semantics inside their software and program context. Reference accepts resources only after source, license, scope, and recommendation reasons are checked.

The site defaults to English and system serif fonts. Pages use white space and typographic hierarchy rather than cards, dashboards, reading modes, status badges, or decorative interaction.

The former source-aligned course, practice cross-reference, learning paths, labs, cases, literature layer, interactive components, and their validation system are not part of the current build. They remain recoverable from Git history and the tag documented in `docs/legacy-site.md`; their former URLs are intentionally unsupported.

Future content is added manually, one reviewed responsibility at a time. A successful build or browser smoke verifies only the declared structural and runtime behavior, not scientific acceptance or learning effectiveness.
