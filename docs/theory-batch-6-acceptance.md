# Theory batch 6 acceptance boundary

Reviewed: 3 August 2026

## Accepted public routes

- `/theory/plane-wave-and-real-space-methods/`
- `/theory/pseudopotentials-paw-and-core-valence-treatments/`
- `/theory/brillouin-zone-sampling/`
- `/theory/relativistic-electronic-structure-spin-and-magnetism/`

The four pages begin the periodic plane-wave branch of Tier 2. They are related but retain separate responsibilities.

## Required distinctions

### Representation

- Plane-wave reciprocal vectors are basis labels, not sampled Bloch k points.
- Wavefunction cutoff, density or augmentation cutoff, FFT grid, domain size, and boundary condition are distinct numerical controls.
- “Real-space method” includes finite differences, finite elements, multiresolution approaches, and other formulations; it is not synonymous with finite differences.
- A stable total energy does not establish convergence of forces, stress, energy differences, phonons, or response quantities.

### Core treatment

- Norm-conserving, ultrasoft, and PAW constructions have different overlap, augmentation, and cutoff consequences.
- A library verification protocol does not independently validate a dataset for every system and observable.
- Semicore partition, projector completeness, ghost states, relativistic generation, dataset version, and checksum remain part of the method record.
- An all-electron reconstruction in PAW does not imply that all core electrons were variationally relaxed in the material.

### Brillouin-zone integration

- SCF integration meshes, NSCF or DOS meshes, and illustrative high-symmetry band paths are different objects.
- A band path is neither a Brillouin-zone quadrature nor a full-zone search for extrema or pockets.
- Primitive-cell and supercell meshes cannot be compared by integer dimensions alone.
- Symmetry reduction is valid only for the actual Hamiltonian, structure, magnetic state, SOC setting, and external fields.
- Mesh and smearing convergence are attached to the target observable.

### Relativity, spin, and magnetism

- Nonrelativistic, scalar-relativistic, and fully relativistic treatments are distinct.
- Spin-unpolarized, collinear spin-polarized, noncollinear, constrained, and SOC-coupled calculations answer different model questions.
- A nonrelativistic core dataset cannot be made fully relativistic by a runtime option.
- One converged magnetic branch does not establish the global magnetic ground state.
- Projected atomic moments depend on the partition definition.
- Magnetic anisotropy is a small energy difference and requires numerical uncertainty below the claimed ordering.

## Static implementation requirements

- Plain Astro static output remains unchanged.
- Every mathematical expression uses native MathML and exactly one TeX annotation inside `<semantics>`.
- Display mathematics uses the shared `.math-display` wrapper and must not cause page-level horizontal overflow.
- No client JavaScript, MathJax, KaTeX, packaged font, CMS, search index, or general content registry is introduced.
- The Theory directory links all accepted routes and retains the previous anchors.
- Source and production-build validators cover the exact static route set.

## Evidence boundary

A passing source check, Astro check, production build, link check, MathML check, and browser smoke can establish only the behavior explicitly covered by those checks. It does not:

- prove every mathematical or physical statement;
- select a universal cutoff, grid, vacuum, dataset, k mesh, smearing width, or magnetic protocol;
- verify pseudopotential transferability for an unstated system;
- establish observable convergence;
- certify the global magnetic ground state;
- complete the dedicated second-round resource review for relativistic electronic structure, spin, and magnetism;
- establish scientific support for a research claim.

The relativistic/spin/magnetism page must continue to expose its unresolved curriculum-review gap until a dedicated comparison is completed.
