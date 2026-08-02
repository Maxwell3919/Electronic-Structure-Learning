# Theory batch 7 acceptance

Reviewed routes:

- `/theory/atomic-and-molecular-physics/`
- `/theory/physical-chemistry/`
- `/theory/chemical-bonding-and-molecular-structure/`
- `/theory/localized-orbital-methods/`

## Content acceptance

The batch is acceptable only if all four pages preserve the following boundaries.

### Atomic and Molecular Physics

- Treats hydrogenic states, angular momentum coupling, term symbols, fine/hyperfine structure, external fields, molecular rotation/vibration, transition amplitudes, and selection rules.
- Connects atomic reference states to pseudopotential/core treatment, spectroscopy, SOC, and projected angular-momentum analysis.
- Does not substitute for Quantum Chemistry, collision physics, laser engineering, or production pseudopotential generation.
- Does not present arbitrary ground-state Kohn–Sham eigenvalue differences as general excitation energies.

### Physical Chemistry

- Separates electronic total energy, enthalpy, free energy, chemical potential, equilibrium constant, barrier, rate, and spectrum.
- States the ensemble, reservoir, standard-state, finite-temperature, and kinetic-model dependence of chemical conclusions.
- Does not equate a zero-temperature DFT energy ordering with complete thermodynamic stability.
- Does not equate a minimum-energy path with a measured rate.

### Chemical Bonding and Molecular Structure

- Treats orbitals, density matrices, density topology, energy decomposition, symmetry, formal bond orders, and oxidation states as distinct interpretive frameworks.
- States basis, localization, partition, fragment, reference-state, and method dependence where relevant.
- Does not define one universal bond observable or force multiple analyses to agree.
- Does not treat orbital plots, partial charges, or bond indices as method-independent measured quantities.

### Localized-Orbital Methods

- Distinguishes empirical tight-binding models from first-principles localized-basis calculations.
- Covers atom-centred basis expansion, nonorthogonal generalized eigenproblems, periodic Bloch sums, Gaussian/Slater/numerical basis families, basis convergence, BSSE, Pulay terms, and locality.
- Does not prescribe a universal zeta level, cutoff radius, basis tier, or cross-code basis ranking.
- Keeps basis, integration grid, Brillouin-zone sampling, core treatment, and target-observable convergence separate.

## Source and copyright acceptance

- Public prose and MathML are original site content.
- No textbook pages, figures, tables, screenshots, or exercise solutions are stored.
- External links point to official MIT OpenCourseWare, Oxford Academic, Cambridge, SIESTA, or FHI-aims destinations reviewed for this batch.
- Publisher resources are labelled as access-dependent where applicable.
- Software documentation is used as implementation evidence, not as independent scientific validation.

## Technical acceptance

- All four pages are ordinary static Astro pages.
- Every mathematical expression uses native MathML with one TeX annotation inside `<semantics>`.
- Display mathematics uses `.math-display` and remains contained at narrow widths.
- No MathJax, KaTeX, client JavaScript, packaged font, new dependency, CMS, search index, or content registry is introduced.
- The Theory directory, README, architecture, source validator, build validator, browser smoke, and build budget include the four new routes.
- The production build contains exactly thirty-one HTML documents, including twenty-five mathematical Theory pages and the general 404 page.
- Zero JavaScript and zero packaged fonts remain hard build-budget requirements.

## Evidence boundary

Passing source validation, Astro checking, production build, internal-link validation, MathML serialization checks, and browser smoke establishes only the covered source and runtime behavior. It does not independently validate every scientific statement, assign a molecular spectrum, determine a unique chemical bond, establish a finite-temperature phase diagram, certify a localized basis for a specific material, or measure learning effectiveness.
