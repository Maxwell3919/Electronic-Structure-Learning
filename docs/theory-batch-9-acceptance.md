# Theory batch 9 acceptance

Reviewed routes:

- `/theory/functional-analysis-and-variational-methods/`
- `/theory/many-body-physics/`
- `/theory/linear-response-and-excited-states/`
- `/theory/many-body-perturbation-theory-and-quasiparticles/`

## Content acceptance

### Functional Analysis and Variational Methods

- Covers Hilbert spaces, completeness, operator domains, self-adjointness, Rayleigh quotients, Rayleigh–Ritz, constrained stationarity, functional derivatives, weak formulations, and existence/uniqueness distinctions.
- Connects continuum spaces to finite basis and grid approximations without requiring a complete functional-analysis course before ordinary DFT.
- Does not claim that variational convergence of an energy implies monotonic or correct convergence of every density, force, response, or excitation observable.
- Keeps admissible spaces, norms, boundary conditions, operator domains, and discretization explicit.

### Many-Body Physics

- Covers Fock space, fermionic operators, second-quantized Hamiltonians, Green functions, spectral functions, quasiparticles, collective modes, and broken symmetry.
- Remains distinct from The Many-Electron Problem, which defines the original interacting problem rather than the advanced formal framework.
- Does not claim that every interacting spectrum has sharp quasiparticles or that every broken-symmetry stationary solution is the exact phase.
- Does not make full path-integral or renormalization-group training a prerequisite for ordinary ground-state DFT.

### Linear Response and Excited States

- Covers response functions, causality, density response, finite differences, Sternheimer equations, DFPT, TDDFT, real-time propagation, Casida equations, and neutral excitation spectra.
- Separates ground-state derivatives from time-dependent response and separates neutral excitations from charged addition/removal energies.
- Does not equate a Kohn–Sham gap with an optical or quasiparticle gap.
- Keeps perturbation type, response channel, frequency/wavevector, boundary conditions, grids, empty states, broadening, and target observable explicit.

### Many-Body Perturbation Theory and Quasiparticles

- Covers Dyson equations, self-energy, screened interactions, GW, quasiparticle equations, common self-consistency families, BSE electron–hole states, fundamental/optical gaps, and exciton binding.
- States that GW is a family of approximations and that starting-point and self-consistency variants do not form a universal accuracy ladder.
- Separates charged quasiparticle energies from neutral BSE excitations.
- Requires method variant, mean-field starting point, screening, dimensional Coulomb treatment, spin/SOC choices, and observable-specific convergence to accompany scientific claims.

## Source and copyright acceptance

- Public prose and MathML are original site content.
- No textbook or paper text, figures, tables, screenshots, lecture transcripts, or exercise solutions are stored.
- External links point to official MIT OpenCourseWare, Cambridge, APS, Octopus, and BerkeleyGW destinations reviewed for this batch.
- Source roles and limitations are recorded in `docs/theory-batch-9-sources.md`.
- Software tutorials are implementation bridges, not independent scientific validation or universal parameter prescriptions.

## Technical acceptance

- All four pages are ordinary static Astro pages.
- Every mathematical expression uses native MathML with one TeX annotation inside `<semantics>`.
- Display mathematics uses `.math-display` and remains contained at narrow widths.
- No MathJax, KaTeX, client JavaScript, packaged font, new dependency, CMS, search index, or content registry is introduced.
- The Theory directory, README, architecture, source/build validator, browser smoke, and build budget include the four new routes.
- The production build contains exactly thirty-eight HTML documents, including thirty-two mathematical Theory pages and the general 404 page.
- Zero JavaScript and zero packaged fonts remain hard requirements.

## Evidence boundary

Passing source validation, Astro checking, production build, internal-link validation, MathML serialization checks, and browser smoke establishes only the covered source and runtime behavior. It does not independently prove mathematical existence assumptions, validate every scientific statement, establish a converged DFPT/TDDFT/GW/BSE calculation, assign an experimental spectrum, demonstrate a sharp quasiparticle, or measure educational effectiveness.
