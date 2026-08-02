# Theory batch 9 source review

Reviewed: 2026-08-03

Scope:

- Functional Analysis and Variational Methods
- Many-Body Physics
- Linear Response and Excited States
- Many-Body Perturbation Theory and Quasiparticles

This record identifies the role and limitations of the sources used to delimit the four public pages. It does not reproduce textbook or paper text, figures, tables, lecture transcripts, or exercise solutions and does not constitute an exhaustive comparison of the advanced literature.

## Planning sources

### Electronic Structure Atlas Theory systematic-review report

Role: Tier-3 classification, dependency, topic-responsibility, candidate-resource, and scope review.

The report places Functional Analysis and Variational Methods and Many-Body Physics in Tier 3, retains Linear Response and Excited States provisionally as a broad advanced module, and identifies Many-Body Perturbation Theory and Quasiparticles as a clear advanced omission that may initially remain inside Linear Response. It explicitly distinguishes GW quasiparticles from BSE electron–hole excitations and ordinary ground-state Kohn–Sham theory.

Boundary: the report records incomplete second-round comparison for Tier-3 resources. The present batch verifies a compact set of primary and official anchors rather than declaring a final curriculum or universal method ranking.

### Richard M. Martin — Electronic Structure, second edition

Official book destination: <https://www.cambridge.org/core/books/electronic-structure/ED0FF348536BFFE8899627C8F78FEE6A>

Role: Atlas-wide electronic-structure reference. The current batch uses its functional-equation bridge and Chapter 21 treatment of response, TDDFT, and optical properties.

Relevant official destinations:

- Functional equations: <https://www.cambridge.org/core/books/electronic-structure/functional-equations/0E8C4193AC900DD417E2F003DE9FEA0C>
- Excitation spectra and optical properties: <https://www.cambridge.org/core/books/electronic-structure/excitation-spectra-and-optical-properties/E708B2F729C1961D9A9D598FCDBAF656>

Boundary: publisher access may require purchase or institutional authentication. The site uses original explanatory prose and MathML rather than copied chapter text, figures, or exercises.

## Functional Analysis and Variational Methods

### MIT OpenCourseWare 18.102 — Introduction to Functional Analysis

Official destination: <https://ocw.mit.edu/courses/18-102-introduction-to-functional-analysis-spring-2021/>

Role: open course covering normed spaces, completeness, duality, Hilbert spaces, self-adjoint and compact operators, and spectral theory.

Use in this page: operator domains, Hilbert-space structure, convergence, continuum variational principles, and the mathematical background behind finite trial spaces.

Boundary: the course assumes real analysis and extends far beyond the minimum needed for ordinary DFT. The page does not claim that every user must complete a full functional-analysis course before learning Rayleigh–Ritz or Kohn–Sham methods.

## Many-Body Physics

### MIT OpenCourseWare 8.513 — Many-Body Theory for Condensed Matter Systems

Official destination: <https://ocw.mit.edu/courses/8-513-many-body-theory-for-condensed-matter-systems-fall-2004/>

Role: graduate route through second quantization, path integrals, broken symmetry, fluctuations, and interacting condensed-matter systems.

Boundary: it is a formal graduate course with substantial prerequisites. The site uses it to anchor the many-body language, not to make path integrals or renormalization-group methods prerequisites for routine ground-state DFT.

### MIT OpenCourseWare 8.513 — Modern Quantum Many-Body Physics for Condensed Matter Systems

Official destination: <https://ocw.mit.edu/courses/8-513-modern-quantum-many-body-physics-for-condensed-matter-systems-fall-2021/>

Role: advanced continuation emphasizing quasiparticles, interacting phases, topology, and long-range entanglement.

Boundary: this course is specialized and not a general first introduction to electronic structure. Its existence does not imply that every interacting spectrum admits a sharp quasiparticle description.

## Linear Response and Excited States

### Martin — Excitation Spectra and Optical Properties

Official destination: <https://www.cambridge.org/core/books/electronic-structure/excitation-spectra-and-optical-properties/E708B2F729C1961D9A9D598FCDBAF656>

Role: theory spine connecting TDDFT, dielectric response, time propagation, molecular and crystal optics, and limits of the adiabatic approximation.

Boundary: this chapter does not make DFPT, TDDFT, GW, and BSE one method. Charged quasiparticle corrections are separated into the MBPT page.

### Octopus Optical Response tutorials

Official destination: <https://octopus-code.org/documentation/main/tutorial/response/>

Role: implementation bridge for real-time propagation, response convergence, Casida equations, Sternheimer methods, triplet excitations, and symmetry.

Boundary: Octopus documentation describes one implementation. Grid, box, time step, propagation time, damping, response subspace, and convergence values are not universal prescriptions.

## Many-Body Perturbation Theory and Quasiparticles

### Lars Hedin — New Method for Calculating the One-Particle Green's Function

Official destination: <https://journals.aps.org/pr/abstract/10.1103/PhysRev.139.A796>

Role: primary research source for the screened-interaction hierarchy underlying the GW approximation.

Boundary: the paper is not an introductory tutorial. The public page uses original summary language and does not reproduce the paper's derivations or figures. Hedin's formal hierarchy does not select one practical GW starting point or self-consistency scheme.

### BerkeleyGW Tutorial

Official destination: <https://berkeleygw.org/documentation/tutorial/>

Role: software-specific bridge from mean-field input through dielectric screening, GW self-energy, BSE kernels, and optical absorption.

Boundary: BerkeleyGW stages demonstrate that dielectric response, self-energy, and electron–hole calculations are distinct. The tutorial does not supply universal empty-state counts, dielectric cutoffs, k meshes, broadening, Coulomb treatment, or accuracy claims.

## Cross-source synthesis used by the public pages

The accepted page boundaries are:

- Functional Analysis and Variational Methods: continuum spaces, operator domains, Rayleigh–Ritz, constrained stationarity, functional derivatives, weak forms, and existence/convergence distinctions; not a claim that variational energy convergence validates every observable.
- Many-Body Physics: second quantization, Green functions, quasiparticles, collective modes, and broken symmetry; not a duplicate of the many-electron problem-definition page or one production algorithm.
- Linear Response and Excited States: response kernels, finite differences, DFPT, TDDFT, neutral excitations, and spectra; not charged quasiparticle addition/removal energies.
- Many-Body Perturbation Theory and Quasiparticles: Dyson self-energy, screened interaction, GW variants, quasiparticle energies, BSE electron–hole states, and charged/neutral gap distinctions; not a universal correction to every DFT result.

## Verification boundary

Official destinations and high-level source roles were checked on 2026-08-03. This review does not independently reproduce the source derivations, compare every advanced text, verify all exercises or regional access conditions, or validate a particular TDDFT, GW, BSE, response, or variational calculation.
