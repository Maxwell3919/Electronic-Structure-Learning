# Theory batch 7 source review

Reviewed: 2026-08-03

Scope:

- Atomic and Molecular Physics
- Physical Chemistry
- Chemical Bonding and Molecular Structure
- Localized-Orbital Methods

This record identifies the role and limitations of the sources used to delimit the four public pages. It does not reproduce textbook content, figures, tables, or exercise solutions and does not constitute a complete comparison of every available course or book.

## Planning sources

### Electronic Structure Atlas Theory systematic-review report

Role: classification, dependency, Tier-2 priority, candidate-resource, and scope review.

The report assigns Atomic and Molecular Physics to states and spectra; Physical Chemistry to a thermodynamic, kinetic, quantum, and spectroscopic bridge; Chemical Bonding and Molecular Structure to interpretive orbital/density/symmetry models; and Localized-Orbital Methods to the molecular and atom-centred representation route.

Boundary: the report records that second-round textbook comparison for all Tier-2 and Tier-3 subjects was not exhaustive. The present batch verifies a compact set of anchors rather than claiming a final universal curriculum.

### Richard M. Martin, Electronic Structure, second edition

Official destination: <https://www.cambridge.org/core/books/abs/electronic-structure/localized-orbitals-tightbinding/>

Role: theory spine for localized atomic orbitals, tight-binding formulations, nonorthogonal Hamiltonian and overlap matrices, Gaussian and numerical basis functions, and full self-consistent localized-orbital calculations.

Boundary: publisher access may require purchase or institutional authentication. The site uses original explanatory prose and equations rather than copied chapter text, figures, or exercises. Martin is not used as the sole authority for software-specific basis behavior.

## Atomic and Molecular Physics

### MIT OpenCourseWare 8.421 — Atomic and Optical Physics I

Official destination: <https://ocw.mit.edu/courses/8-421-atomic-and-optical-physics-i-spring-2014/>

Role: graduate open course covering simple atomic electronic structure, fine and hyperfine structure, atoms in electric and magnetic fields, resonance, line shapes, coherence, and atom–light interaction.

Boundary: the course assumes prior quantum mechanics and devotes substantial attention to optical and experimental AMO topics outside this Atlas page. It is not a course on production electronic-structure software, pseudopotential generation, or molecular quantum chemistry.

### Peter F. Bernath — Spectra of Atoms and Molecules, fifth edition

Official destination: <https://academic.oup.com/book/59280>

Role: spectroscopy reference connecting molecular symmetry, atomic spectroscopy, rotational and vibrational spectroscopy, Raman scattering, and electronic spectra.

Boundary: full access is publisher-dependent. The book is used as a reference map, not copied into the site. Spectroscopy assignments remain Hamiltonian-, transition-operator-, environment-, and approximation-dependent.

## Physical Chemistry

### MIT OpenCourseWare 5.60 — Thermodynamics & Kinetics

Official destination: <https://ocw.mit.edu/courses/5-60-thermodynamics-kinetics-spring-2008/>

Role: open undergraduate bridge through chemical thermodynamics, equilibrium, and rates of chemical reactions.

Boundary: it does not provide a complete modern first-principles finite-temperature workflow, defect-correction protocol, electrochemical model, or nonadiabatic rate theory. The page therefore keeps electronic energy, thermodynamic free energy, chemical potential, barrier, and rate as separate model layers.

### MIT OpenCourseWare 5.61 — Physical Chemistry

Official destination: <https://ocw.mit.edu/courses/5-61-physical-chemistry-fall-2017/>

Role: chemistry-centred introduction to quantum mechanics, molecular orbital theory, molecular structure, spectroscopy, and photochemistry.

Boundary: it overlaps with the Quantum Chemistry page but is retained here as an interpretive bridge. It does not establish that ordinary ground-state Kohn–Sham eigenvalue differences are quantitative excitation energies.

## Chemical Bonding and Molecular Structure

### Jochen Autschbach — Quantum Theory for Chemical Applications

Official destination: <https://academic.oup.com/book/43692>

Role: chemistry-centred reference for orbital models, molecular and crystal orbitals, symmetry, electronic structure, response, and relativistic concepts.

Boundary: full access is publisher-dependent. Orbital coefficients and localized pictures are representation-dependent and are not presented as unique observables.

### Richard F. W. Bader — Atoms in Molecules: A Quantum Theory

Official destination: <https://academic.oup.com/book/53229>

Role: density-topological framework for atoms, basins, critical points, and zero-flux surfaces.

Boundary: density topology is one formal interpretation of a stated electron density. It is not used to erase orbital, energetic, spectroscopic, or formal-chemical models, and one topological feature does not settle every bonding or stability question.

## Localized-Orbital Methods

### SIESTA basis-set optimization tutorial

Official destination: <https://docs.siesta-project.org/projects/siesta/en/stable/tutorials/basic/basis-optimization/>

Role: implementation bridge for numerical atomic orbitals, cardinality, polarization, radial confinement, practical optimization, and system-specific basis testing.

Boundary: SIESTA-specific basis names, defaults, confinement parameters, grids, and pseudopotential consistency cannot be transferred directly to other codes. The tutorial explicitly provides one optimization route rather than a universal basis prescription.

### SIESTA basis-set special cases and BSSE tutorial

Official destination: <https://docs.siesta-project.org/projects/siesta/en/stable/tutorials/basic/basis-extra/>

Role: implementation evidence for basis-set superposition error and the difficulty of describing vacuum or diffuse regions with strictly atom-centred finite-support functions.

Boundary: counterpoise-style checks and larger bases diagnose selected errors; they do not validate all representation, geometry, force, or interaction-energy choices.

### FHI-aims manual — specifying the basis

Official destination: <https://fhi-aims.org/uploads/manual/Ch3/S4.html>

Role: implementation reference for numerical atom-centred all-electron basis functions, radial functions, confinement, basis tiers, empty sites, and convergence controls.

Boundary: the manual is version-sensitive. A production calculation must record the FHI-aims release and actual basis definition. Current documentation describes implementation behavior, not independent validation of a basis for every system or observable.

## Cross-source synthesis used by the public pages

The accepted page boundaries are:

- Atomic and Molecular Physics: states, angular momenta, fields, spectra, and selection rules; not collision physics or a replacement for Quantum Chemistry.
- Physical Chemistry: thermodynamic, kinetic, quantum, and spectroscopic model layers; not a claim that electronic total energy is the complete free energy or rate.
- Chemical Bonding and Molecular Structure: complementary orbital, density, symmetry, energy, and formal-chemical interpretations; not one universal bond observable.
- Localized-Orbital Methods: empirical and first-principles localized representations, nonorthogonality, periodic Bloch sums, basis families, Pulay terms, BSSE, and convergence; not a universal zeta level, cutoff, or cross-code basis ranking.

## Verification boundary

Official destinations and high-level source roles were checked on 2026-08-03. This review does not independently verify every statement in the source materials, solve the exercises, establish regional access for every user, compare every edition, or certify any software basis for a specific production calculation.
