# Theory batch 6 source review

Reviewed: 3 August 2026

## Scope

This record supports four public Theory pages:

- Plane-Wave and Real-Space Methods
- Pseudopotentials, PAW, and Core–Valence Treatments
- Brillouin-Zone Sampling
- Relativistic Electronic Structure, Spin, and Magnetism

The planning basis is the Electronic Structure Atlas Theory systematic-review report. The report places these topics in Tier 2 because they support periodic-material calculations, numerical implementation, and interpretation. It also identifies relativistic electronic structure, spin, and magnetism as a missing independent responsibility while stating that its dedicated second-round resource review remains incomplete.

No source listed here authorizes reproduction of textbook pages, figures, tables, or exercise solutions.

## Richard M. Martin, *Electronic Structure*, 2nd edition

Official Cambridge destinations used:

- Plane Waves and Grids: Basics: `https://www.cambridge.org/core/books/abs/electronic-structure/plane-waves-and-grids-basics/110C624E4B1F8444BA54006A07171D41`
- Pseudopotentials: `https://www.cambridge.org/core/books/abs/electronic-structure/pseudopotentials/54AAC259A40AFDE3791101FE0DBF83B3`
- Book contents used as the stable Brillouin-zone reference entrance: `https://www.cambridge.org/core/books/abs/electronic-structure/contents/45985954A19E640C6C637C5EA2E174C0`
- Dirac Equation and Spin–Orbit Interaction: `https://www.cambridge.org/core/books/abs/electronic-structure/dirac-equation-and-spinorbit-interaction/AEB751CC64E210E1450E9C40CEAEEDCD`

Role:

- common theoretical spine for reciprocal-space representations, grids, core–valence treatments, Brillouin-zone integration, and relativistic corrections;
- establishes vocabulary and derivational context across the four pages.

Limitations:

- full text can require purchase or institutional access;
- it is not a current software manual;
- it does not provide a universal convergence prescription for a particular material and observable.

## Quantum ESPRESSO

Official destinations used:

- documentation entrance: `https://www.quantum-espresso.org/documentation/`
- pseudopotential portal: `https://pseudopotentials.quantum-espresso.org/`

Role:

- implementation bridge for plane waves, FFT grids, periodic boundary conditions, pseudopotential formats, and reciprocal-space calculation practice.

Limitations:

- documentation and examples are code-specific;
- a listed or supported dataset is not independently validated for every target system;
- suggested cutoffs, meshes, and defaults do not replace observable-specific convergence tests.

## Standard Solid-State Pseudopotentials

Official destination used:

- `https://sssp.materialscloud.org/`

Role:

- supplies a defined verification framework and precision/efficiency views for covered pseudopotential tests;
- demonstrates how library evidence can be made more systematic than an unreviewed file collection.

Limitations:

- a library score or table entry is evidence only for the declared protocol and test set;
- it does not establish transferability to every oxidation state, pressure, magnetic state, response, excitation, or target observable;
- the exact library release, dataset file, and checksum remain required for reproducibility.

## GPAW

Official destinations used:

- basic representations: `https://gpaw.readthedocs.io/documentation/basic.html`
- PAW and algorithm documentation: `https://gpaw.readthedocs.io/algorithms.html`
- spin–orbit and noncollinear documentation: `https://gpaw.readthedocs.io/documentation/soc/soc.html`

Role:

- implementation bridge showing plane-wave, finite-difference, and localized-orbital representations within one PAW code;
- connects PAW reconstruction to smooth numerical representations;
- supplies a current example of spinor and SOC implementation.

Limitations:

- one implementation does not define every real-space, PAW, or relativistic formulation;
- code defaults and examples are not universal scientific recommendations;
- implementation documentation is not a substitute for a complete relativity or magnetism course.

## Bilbao Crystallographic Server

Official destination used:

- k-vector and Brillouin-zone database: `https://www.cryst.ehu.es/cryst/get_kvec.html`

Role:

- reference data for conventional k-vector labels, little groups, metric-dependent Brillouin-zone figures, and symmetry relations.

Limitations:

- it is not a zero-background course;
- it does not select an integration mesh, smearing width, or convergence threshold;
- a conventional path is not a full-zone integration or search.

## SIESTA

Official destination used:

- k-point convergence tutorial: `https://docs.siesta-project.org/projects/siesta/en/stable/tutorials/basic/kpoint-convergence/index.html`

Role:

- implementation bridge for uniform k-point refinement and its effect on calculated quantities.

Limitations:

- example meshes and tolerances are tied to the illustrated calculation;
- a localized-orbital tutorial does not define universal Brillouin-zone practice;
- a denser NSCF or DOS mesh cannot repair an unconverged SCF density.

## Octopus

Official destination used:

- relativistic-correction variable reference: `https://octopus-code.org/documentation/main/variables/hamiltonian/relativisticcorrection/`

Role:

- additional implementation evidence that relativistic Hamiltonian choices are explicit numerical-model decisions.

Limitations:

- this is a variable reference rather than a complete theoretical course;
- implementation availability does not establish suitability for a target observable.

## Unresolved review gap

The following remains open and is stated on the public relativistic/spin/magnetism page:

- a dedicated comparison of modern textbooks and open courses spanning scalar relativity, the Dirac equation, spinors, SOC, collinear and noncollinear magnetism, magnetic symmetry, and magnetic anisotropy;
- evaluation of exercises, solution access, prerequisite clarity, and pedagogical progression for that combined responsibility.

Until that review is complete, Martin plus GPAW and Octopus are treated as theory and implementation anchors, not as a finalized recommended curriculum.
