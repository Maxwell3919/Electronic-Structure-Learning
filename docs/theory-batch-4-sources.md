# Theory batch 4 source review

Reviewed: 2 August 2026

Scope: Kohn–Sham Density Functional Theory; Exchange–Correlation Functionals and Approximations; Self-Consistent Field Methods; Discretization and Basis Representations.

## Governing scope

The content boundary follows the reviewed Electronic Structure Atlas Theory report and Richard M. Martin, *Electronic Structure: Basic Theory and Practical Methods*, 2nd edition:

```text
DFT foundations
→ Kohn–Sham auxiliary system
→ exchange–correlation approximation
→ nonlinear self-consistent solution
→ finite numerical representation
```

The four responsibilities are kept separate. The site does not use software defaults as theory, does not treat Kohn–Sham eigenvalues as a general quasiparticle spectrum, and does not equate SCF convergence with representation or scientific convergence.

## Reviewed sources

### Martin, *Electronic Structure*, 2nd edition

Official contents and chapter landing pages were checked through Cambridge Core.

Role:

- common theoretical spine;
- separation of general DFT foundations from the Kohn–Sham auxiliary system;
- exchange–correlation theory and approximation families;
- iterative solution of Kohn–Sham equations;
- comparison of plane-wave, localized, real-space, and augmented representations.

Boundary:

- commercial or institutionally accessed full text;
- not a software parameter reference;
- this repository stores no textbook pages, figures, or exercise solutions.

### Kohn and Sham, 1965

Official APS DOI landing page: `10.1103/PhysRev.140.A1133`.

Role:

- primary historical source for the auxiliary noninteracting construction and self-consistent equations.

Boundary:

- not a modern numerical tutorial;
- historical notation and scope require modern context.

### Libxc

Official project landing page, functional catalogue, and manual were checked.

Role:

- implementation identifiers and functional families;
- references, ingredients, derivative availability, and reproducibility metadata;
- distinction among similarly named variants.

Boundary:

- implementation availability does not establish scientific suitability;
- the catalogue is not a ranking of functionals;
- a functional label alone may not specify dispersion, exact exchange, pseudopotential lineage, or code-specific details.

### SIESTA documentation and tutorials

The stable SCF-cycle tutorial, first-encounter tutorial, and real-space-grid convergence tutorial were checked.

Role:

- explicit density–Hamiltonian–solution–new-density SCF loop;
- linear, Pulay, and Broyden mixing examples;
- separation of localized basis quality, real-space mesh, eigensolver, and SCF controls;
- grid convergence and egg-box effects.

Boundary:

- parameter names, units, residual definitions, and default values are SIESTA-specific;
- examples do not provide transferable universal thresholds;
- software completion and SCF convergence do not establish observable convergence.

### GPAW documentation

The basic documentation comparing plane-wave, localized atomic-orbital, and finite-difference modes was checked.

Role:

- representation comparison within one PAW framework;
- demonstration that the physical problem can be held broadly fixed while the numerical representation changes.

Boundary:

- one-code examples do not independently establish cross-code agreement;
- each representation requires its own convergence study;
- PAW and core-treatment choices remain additional approximation layers.

## Public-page claims supported by this review

The reviewed sources support the following page responsibilities:

- Kohn–Sham theory reproduces the interacting ground-state density through an auxiliary noninteracting system, not the interacting wavefunction.
- Exchange–correlation contains the kinetic and interaction contributions omitted by the noninteracting kinetic and classical Hartree terms.
- Practical XC functionals differ by ingredients, constraints, nonlocality, fitted information, implementation, and failure mechanisms; there is no universal material-type lookup table that selects a best functional.
- SCF is a nonlinear fixed-point problem involving residuals, mixing, preconditioning, occupations, and potentially multiple converged branches.
- Program termination, SCF convergence, representation convergence, target-observable convergence, and scientific support are different evidence gates.
- Basis functions, quadrature, real-space grids, boundary conditions, core treatment, finite cells, and Brillouin-zone sampling are distinct numerical layers.
- Representation convergence must be tested against the target observable rather than inferred from a code default or one scalar energy change.

## What was not independently established

This review does not independently validate every mathematical statement, benchmark any functional, reproduce a code calculation, prove educational effectiveness, or establish that any universal cutoff, basis, mixing, smearing, or residual threshold is appropriate.
