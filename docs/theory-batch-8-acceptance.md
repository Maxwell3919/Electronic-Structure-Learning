# Theory batch 8 acceptance

Reviewed routes:

- `/theory/electromagnetism/`
- `/theory/statistical-mechanics/`
- `/theory/solid-state-chemistry/`

## Content acceptance

### Electromagnetism

- Covers Poisson equations, Hartree electrostatics, multipoles, polarization, dielectric response, longitudinal/transverse field distinctions, surfaces, interfaces, potential references, and boundary conditions.
- Treats electrostatic boundary conditions, Coulomb kernels, charged-cell conventions, and potential alignment as parts of the physical and numerical model.
- Does not prescribe one universal charged-cell correction, Coulomb truncation, potential reference, or dielectric boundary model.
- Does not equate a static Poisson solution with a complete optical or radiative Maxwell calculation.

### Statistical Mechanics

- Covers ensembles, partition functions, thermodynamic potentials, Fermi–Dirac occupations, electronic entropy, finite-temperature DFT, phonon free energies, and fluctuations.
- Distinguishes physical electronic temperature from numerical smearing and quadrature broadening.
- Keeps electronic, vibrational, configurational, magnetic, and trajectory-sampling approximations separate.
- Does not prescribe one universal occupation scheme, smearing width, harmonic free-energy model, or molecular-dynamics ensemble.

### Solid-State Chemistry

- Covers composition and structure types, coordination, bonding models, nonstoichiometry, charge neutrality, defects, doping, chemical potentials, competing phases, and structure–property interpretation.
- Distinguishes formal oxidation states, partitioned charges, defect charge states, carrier concentrations, and nominal dopant counts.
- States the reservoir, reference, finite-size, correction, structural, and configurational dependence of defect and phase comparisons.
- Does not infer synthesis accessibility from a relaxed structure, or complete phase stability from a negative formation energy or zero-temperature convex hull alone.

## Source and copyright acceptance

- Public prose and MathML are original site content.
- No textbook pages, figures, tables, screenshots, lecture transcripts, or exercise solutions are stored.
- External links point to official MIT OpenCourseWare and APS destinations reviewed for this batch.
- Source roles and limitations are recorded in `docs/theory-batch-8-sources.md`.
- Course and paper availability does not constitute independent validation of a numerical method or material-specific conclusion.

## Technical acceptance

- All three pages are ordinary static Astro pages.
- Every mathematical expression uses native MathML with one TeX annotation inside `<semantics>`.
- Display mathematics uses `.math-display` and remains contained at narrow widths.
- No MathJax, KaTeX, client JavaScript, packaged font, new dependency, CMS, search index, or content registry is introduced.
- The Theory directory, README, architecture, source/build validator, browser smoke, and build budget include the three new routes.
- The production build contains exactly thirty-four HTML documents, including twenty-eight mathematical Theory pages and the general 404 page.
- Zero JavaScript and zero packaged fonts remain hard requirements.

## Evidence boundary

Passing source validation, Astro checking, production build, internal-link validation, MathML serialization checks, and browser smoke establishes only the covered source and runtime behavior. It does not independently validate every scientific statement, select a charged-cell correction or smearing scheme, establish a complete finite-temperature free energy, determine defect concentrations or phase stability, prove synthesis accessibility, or measure educational effectiveness.
