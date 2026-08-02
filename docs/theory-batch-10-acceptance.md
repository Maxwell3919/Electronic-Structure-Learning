# Theory batch 10 acceptance

Reviewed routes:

- `/theory/probability-and-statistics/`
- `/theory/classical-mechanics/`
- `/theory/thermodynamics/`

## Content acceptance

### Probability and Statistics

- Covers random variables, probability distributions, expectation, variance, conditional probability, finite sampling, correlated samples, Monte Carlo estimators, inference, resampling, benchmark metrics, and uncertainty categories.
- Distinguishes sampling uncertainty, deterministic numerical error, model discrepancy, and experimental uncertainty.
- States that stored trajectory frames need not be statistically independent and that autocorrelation, stationarity, and equilibration affect effective sample size.
- Uses MIT 18.05 as the introductory route and labels MIT 18.175 as an advanced continuation rather than a beginner prerequisite.
- Does not prescribe a universal test, prior, estimator, trajectory length, confidence level, or benchmark metric.

### Classical Mechanics

- Covers generalized coordinates and constraints, Lagrangian and Hamiltonian mechanics, conserved quantities, Born–Oppenheimer nuclear forces, harmonic normal modes, integration error, and ensemble-aware trajectories.
- Distinguishes trajectory stationarity from electronic ground-state minimization and thermodynamic free-energy minimization.
- States that local harmonic curvature, a stable finite-step trajectory, and adequate finite-temperature sampling are separate conclusions.
- Does not treat classical nuclei, the Born–Oppenheimer approximation, one timestep, one thermostat, or one trajectory as universally valid.
- Keeps rigid-body and continuum mechanics outside the core unless a later subject requires them.

### Thermodynamics

- Covers thermodynamic laws, state variables, entropy, Legendre transforms, Helmholtz/Gibbs/grand potentials, chemical potentials, equilibrium, metastability, phase coexistence, convexity, free-energy ingredients, and response derivatives.
- States the controlled variables, reservoirs, composition space, work terms, and allowed phases required for a stability comparison.
- Distinguishes zero-temperature electronic energy, internal energy, Helmholtz free energy, Gibbs free energy, and grand potential.
- Does not identify a negative formation energy or zero-temperature convex-hull result with complete finite-temperature stability, synthesis accessibility, or kinetic reachability.
- Remains separate from the microscopic ensemble responsibility of Statistical Mechanics and the chemical application responsibility of Physical Chemistry.

## Source and copyright acceptance

- Public prose and MathML are original site content.
- No textbook pages, figures, tables, lecture transcripts, screenshots, or exercise solutions are stored.
- External resources point to official MIT OpenCourseWare destinations reviewed for this batch.
- The supplied electronic-structure texts are used only to delimit the normal-mode, force-constant, harmonic, zero-point, and Born–Oppenheimer bridge; their copyrighted text is not reproduced.
- Resource roles and limitations are recorded in `docs/theory-batch-10-sources.md`.

## Technical acceptance

- All three pages are ordinary static Astro pages.
- Every mathematical expression uses native MathML with one TeX annotation inside `<semantics>`.
- Display mathematics uses `.math-display` and remains contained at narrow widths.
- No MathJax, KaTeX, client JavaScript, packaged font, new dependency, CMS, search index, or content registry is introduced.
- The Theory directory, README, AGENTS, architecture, source/build validator, browser smoke, and build budget include the three new routes.
- The production build contains exactly forty-one HTML documents, including thirty-five mathematical Theory pages and the general 404 page.
- Zero JavaScript and zero packaged fonts remain hard requirements.

## Evidence boundary

Passing source validation, Astro checking, production build, internal-link validation, MathML serialization checks, and browser smoke establishes only the covered source and runtime behavior. It does not independently validate every scientific statement, certify a statistical model or estimator, establish trajectory convergence or ergodicity, validate a Born–Oppenheimer surface, determine a complete free energy or phase diagram, prove synthesis accessibility, or measure educational effectiveness.
