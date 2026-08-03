# Theory batch 11 acceptance

Reviewed routes:

- `/theory/general-chemistry/`
- `/theory/inorganic-chemistry/`
- `/theory/surface-and-interface-chemistry/`

## Content acceptance

### General Chemistry

- Covers composition, electron counting, periodic trends, bonding vocabulary, formal charge and oxidation state, acid–base and redox language, equilibrium, and kinetics awareness.
- Treats General Chemistry as background repair rather than a compulsory full-course prerequisite for every electronic-structure learner.
- Distinguishes exact total electron count from method-dependent assignment of electrons to atoms, bonds, orbitals, or density basins.
- Does not treat Lewis structures, formal charge, oxidation state, hybridization, or periodic trends as unique quantum-mechanical observables or universal laws.
- Keeps detailed solution chemistry, laboratory practice, and complete kinetics outside the page core.

### Inorganic Chemistry

- Covers formal oxidation states and d counts, coordination geometry, ligand/crystal fields, spin states, magnetism, Jahn–Teller distortions, and spectroscopic interpretation.
- Distinguishes formal electron counting from projected occupations and calculated partial charges.
- States that spin state depends on crystal field, pairing, exchange, covalency, SOC, structure, and method choice; one converged branch is not proof of a global magnetic ground state.
- Does not treat a crystal-field diagram, formal d count, or spin-only moment as a full many-electron solution.
- Records the absence of one sufficiently reviewed complete modern open inorganic-chemistry course rather than hiding the resource gap.

### Surface and Interface Chemistry

- Covers termination, slab geometry, surface energy, adsorption energy, work function, reconstruction, surface states, interface structure, band alignment, dipoles, charge redistribution, and screening.
- States the assumptions behind symmetric-slab surface energies, adsorption references, vacuum potential references, and interface lineup methods.
- Separates surface energy, adsorption energy, activation barrier, rate, coverage, catalytic activity, work function, and band alignment.
- Requires observable-specific convergence in slab thickness, vacuum, lateral cell, k mesh, termination, coverage, relaxation, electrostatics, and references.
- Does not prescribe universal slab dimensions, vacuum, dipole correction, termination, adsorption reference, or band-alignment method.
- Records the absence of one complete stable open theory course for the full page scope.

## Source and copyright acceptance

- Public prose and MathML are original site content.
- No textbook pages, figures, tables, screenshots, lecture transcripts, or exercise solutions are stored.
- External resources point to official MIT OpenCourseWare, Wiley, Cambridge, and ASE destinations reviewed for this batch.
- Paid or institutional resources are labelled accordingly.
- Implementation documentation is used as implementation evidence, not as independent scientific validation.
- Resource roles and limitations are recorded in `docs/theory-batch-11-sources.md`.

## Technical acceptance

- All three pages are ordinary static Astro pages.
- Every mathematical expression uses native MathML with one TeX annotation inside `<semantics>`.
- Display mathematics uses `.math-display` and remains contained at narrow widths.
- No MathJax, KaTeX, client JavaScript, packaged font, new dependency, CMS, search index, or content registry is introduced.
- The Theory directory, README, architecture, source/build validator, browser smoke, and build budget include the three new routes.
- The production build contains exactly forty-four HTML documents, including thirty-eight mathematical Theory pages and the general 404 page.
- Zero JavaScript and zero packaged fonts remain hard requirements.

## Evidence boundary

Passing source validation, Astro checking, production build, internal-link validation, MathML serialization checks, and browser smoke establishes only the covered source and runtime behavior. It does not independently validate every scientific statement, determine a unique oxidation state or bonding model, establish the global magnetic ground state, assign a spectrum, select a physical surface termination, validate an adsorption or band-alignment workflow, establish catalytic activity, or measure educational effectiveness.
