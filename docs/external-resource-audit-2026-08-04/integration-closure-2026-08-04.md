# External-resource audit integration closure — 2026-08-04

## Decision rule

The audit backlog is a candidate inventory, not a publication quota. A route was added only when it was currently inspectable, had a page-local teaching role not already supplied by that page, could state access/version/prerequisites, and could preserve an explicit scientific boundary. A candidate was not added merely because its host was absent from the site.

## Cross-section delivery record

| Section | Delivered batch | Public PR and final main SHA | Result |
| --- | --- | --- | --- |
| Computational Tools | Foundation | #226, `3ad33d2b80f57916c6e57d4abe49f5bab0af3a24` | Twenty-two reviewed official routes organized by scientific role. |
| Reference | Foundation | #227, `caac3ea0c11035524e0e83a4c4b296fd6e15dd35` | Open learning, official tutorials, benchmark, and FAIR/provenance routes. |
| Methods | Gateways | #228, `620e9a3d6cf159cec430b5534d03fc178ade9c79` | Seven concise method-family gateways with implementation and convergence limits. |
| Theory: Quantum Chemistry | Gateway | #229, `6c38ea953ee295d1baedf29fa084c6689eac3e70` | eChem notebook spine and MolSSI focused molecular exercises. |
| Theory: Chemical Bonding | Framework | #230, `6f12418fdcb5cce10d8708edcf796b63c0ed919e` | Critic2 as one explicit real-space interpretation framework. |

Each listed batch passed the repository CI, exact-SHA Pages deployment, and live browser smoke before its Research-Ops handoff was merged.

## Theory page disposition manifest

| Page group | Pages inspected | Disposition |
| --- | --- | --- |
| Mathematical foundations | Linear Algebra; Calculus and Analysis; Differential Equations; Fourier Analysis; Functional Analysis and Variational Methods; Numerical Analysis; Probability and Statistics; Group Theory and Symmetry | Retained existing rigorous/open/Chinese routes. Numerical Analysis already includes the audit’s high-return FNC and advanced numerical-methods routes; no duplicate solver or portal list was added. |
| Physical foundations | Classical Mechanics; Electromagnetism; Quantum Mechanics; Thermodynamics; Statistical Mechanics; Atomic and Molecular Physics; Solid-State Physics; Crystallography; Many-Body Physics | Retained complementary course, text, and implementation routes. Candidate databases, simulators, and specialist packages remain page-local only when their distinct observable role is needed. |
| Chemistry foundations | General Chemistry; Physical Chemistry; Quantum Chemistry; Chemical Bonding and Molecular Structure; Inorganic Chemistry; Solid-State Chemistry; Surface and Interface Chemistry | Quantum Chemistry and Chemical Bonding received the two targeted additions above. The other pages already provide distinct conceptual or Chinese routes; unverified portals, duplicate tools, and current inaccessible endpoints were not added. |
| Electronic-structure core | The Many-Electron Problem; Hartree and Hartree–Fock Theory; Density Functional Theory Foundations; Kohn–Sham Density Functional Theory; Exchange–Correlation Functionals and Approximations; Self-Consistent Field Methods | Retained existing formal, code-visible, and accessible routes. SCF already includes DFTK and SIESTA material, so further code manuals would duplicate rather than close a teaching gap. |
| Representation and sampling | Discretization and Basis Representations; Plane-Wave and Real-Space Methods; Localized-Orbital Methods; Pseudopotentials, PAW, and Core–Valence Treatments; Brillouin-Zone Sampling | Retained the already-integrated DFTK, GPAW, SIESTA, DFT-FE, Materials Cloud Wannier90, ABINIT, SSSP, and BZ routes. The pages preserve the separate roles of basis size, grids, band paths, and integration meshes. |
| Advanced electronic structure | Relativistic Electronic Structure, Spin, and Magnetism; Linear Response and Excited States; Many-Body Perturbation Theory and Quasiparticles; Berry Phases and Electronic Topology | Retained current theory spines and bounded implementation routes. Additional specialist codes were not added unless they supplied a missing page-local learning role. |

All thirty-nine Theory pages therefore retain at least one reviewed study route, while their page content keeps theory, implementation, convergence, and scientific support distinct.

## Explicit non-additions

- The Home ecosystem map remains unchanged: the current minimal design does not need a second resource directory.
- CECAM ESL was not safely accessible in the review environment; the reviewed ASE NEB URL returned 404; Bader returned 403; LOBSTER timed out.
- Critic2 stable release is explicitly outdated, so only its current manual/development route is presented with a version-provenance warning.
- Multiple overlapping packages (for example PySCF/Psi4 alternatives, DDEC/Multiwfn alternatives, and specialist solvers) remain deferred where they would duplicate a current route or turn a Theory page into a software directory.
- Databases, benchmarks, workflow platforms, and infrastructure are classified under Computational Tools or Reference rather than duplicated across Theory pages.

## Closure boundary

This document closes the 2026-08-04 audit-integration decision: it does not claim every listed candidate is bad, nor that every public resource was re-validated as a scientific method. It records that every site section and all thirty-nine Theory pages were inspected against the approved backlog, and that the selected additions have been integrated through the required public verification and Research-Ops handoff path. Future additions require a new page-local gap and a fresh primary-destination review.
