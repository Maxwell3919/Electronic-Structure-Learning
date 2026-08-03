# Theory resource review — Batch F · Numerical representations

**Review date:** 2026-08-04  
**Scope:** `discretization-and-basis-representations`, `plane-wave-and-real-space-methods`, `localized-orbital-methods`, and `pseudopotentials-paw-and-core-valence-treatments`.

## Existing coverage and gaps

The four pages already distinguished finite spaces, plane-wave/real-space representations, atom-centred bases, and effective-core data. Their existing routes included Martin’s textbook, code documentation, the SIESTA grid/basis tutorials, FHI-aims documentation, the Quantum ESPRESSO portal, SSSP, and GPAW. The remaining useful gaps were a derivation-led route connecting reciprocal-space discretisation to a finite Kohn–Sham problem, a compact periodic/Bloch route separate from a full code manual, reproducible Gaussian-basis metadata, and a maintained PAW walkthrough that explicitly contrasts PAW and norm-conserving data.

## Accepted resources

| Page | Resource and source | Coverage and intended reader | Added value and limit |
| --- | --- | --- | --- |
| Discretization and basis representations | [DFTK Mathematical Tutorial](https://docs.dftk.org/stable/guide/tutorialmath/) | A maintained, openly rendered DFTK guide for mathematically prepared readers. It exposes the lattice, reciprocal cell, k-point quadrature, plane-wave cutoff, and finite calculation structure. | Adds the missing derivation-to-implementation bridge. It only teaches the DFTK plane-wave route and its small example is not a material convergence study. |
| Plane-wave and real-space methods | [DFTK, “Periodic problems and plane-wave discretisations”](https://docs.dftk.org/dev/guide/periodic_problems/) | A maintained note deriving Bloch blocks, the Brillouin zone, k-point grids, and a cutoff plane-wave basis from a 1D periodic problem. Intended for readers with Fourier-series and linear-algebra preparation. | Adds a compact conceptual bridge before a production-code manual. It does not treat open boundaries, finite differences, or material-specific parameter selection. |
| Localized-orbital methods | [Basis Set Exchange basic usage](https://molssi-bse.github.io/basis_set_exchange/usage.html) | Maintained open documentation from the MolSSI Basis Set Exchange project; shows named basis retrieval, versions, formats, and primary-reference metadata. Intended for readers already able to interpret Gaussian-basis terminology. | Adds reproducibility/provenance for molecular Gaussian data. It is a database interface, not a course on basis convergence or a prescription for solids. |
| Pseudopotentials, PAW, and core–valence treatments | [ABINIT PAW1 tutorial](https://docs.abinit.org/tutorial/paw1/) | Official ABINIT tutorial with visible sections on PAW, norm-conserving comparison, wavefunction and double-grid cutoffs, completeness, and validity. Intended for readers with prior ABINIT/norm-conserving-pseudopotential experience. | Adds an implementation-level PAW route and makes separate PAW numerical controls concrete. It cannot certify a different code, dataset, material, or observable. |

All accepted links were opened at their original project/documentation sources. DFTK identifies its tutorial’s mathematical audience and renders both the theory and runnable example; Basis Set Exchange exposes version/reference retrieval and the open project documentation; SIESTA/FHI-aims and the ABINIT page establish the surrounding code/project identity. The accepted additions are explanatory documentation or code-backed tutorials, not exercise or solution recommendations.

## Deferred or rejected candidates

- DFTK’s **“Comparing discretization techniques”** is technically strong but centres explicit exercises and solutions. It was not added under the current no-exercise scope.
- GPAW’s plane-wave/stress material and SIESTA’s broader tutorial catalogue are valuable but substantially overlap routes already present on these pages; duplicating them would not create a distinct learning role.
- PseudoDojo papers and dataset portals are useful source/benchmark evidence, but the reviewed material did not provide a sufficiently self-contained, maintained learner route beyond the existing SSSP and Quantum ESPRESSO portal entries.
- Unattributed mirrors, upload/download collections, and snippets without an inspectable author, course team, license context, or visible structure were not used.

## Source and license boundaries

No copyrighted body text, figures, datasets, inputs, or output files were copied. The pages link to official, publicly rendered material and state code, version, access, and applicability limits where relevant. A runnable tutorial is not a claim that its defaults or reference result are transferable to a reader’s scientific calculation.

## Remaining gaps

- A clearly attributed Chinese-language explanation of plane-wave cutoff, FFT/density grid, and real-space discretisation remains desirable.
- A maintained open route on finite elements/adaptive real-space electronic structure could complement the present grid and plane-wave focus if it can be checked at source.
- The pages intentionally do not become a library-ranking or parameter-prescription service; system- and observable-specific validation remains outside their scope.
