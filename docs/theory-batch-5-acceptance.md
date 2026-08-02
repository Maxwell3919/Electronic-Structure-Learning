# Theory batch 5 acceptance boundary

Batch routes:

- `/theory/differential-equations/`
- `/theory/fourier-analysis/`
- `/theory/crystallography/`
- `/theory/group-theory-and-symmetry/`

## Content acceptance

The batch is acceptable for merge when:

- Differential Equations distinguishes differential expressions, operator domains, initial or boundary conditions, continuous models, discretizations, and algebraic solver results.
- Fourier Analysis distinguishes transform conventions, reciprocal-lattice components, Bloch wavevectors, sampling, DFT/FFT algorithms, and aliasing.
- Crystallography distinguishes lattices from bases, primitive from conventional cells, fractional from Cartesian coordinates, space groups from settings, and standardized structures from source provenance.
- Group Theory and Symmetry distinguishes abstract groups, representations, irreducible sectors, point/space/little groups, selection rules, double or magnetic extensions, and imposed versus broken symmetry.
- Each page preserves its own explanatory order rather than adopting a mandatory public section contract.
- Resource roles and unresolved review gaps match `docs/theory-batch-5-sources.md`.

## Structural acceptance

The source and production-build gates must establish:

- exactly twenty-three static HTML documents, including seventeen reviewed Theory topic pages;
- all Theory mathematics serialized as native MathML;
- one TeX annotation inside `<semantics>` for every mathematical expression;
- no client JavaScript, hydration directive, packaged font, MathJax, or KaTeX;
- no page-level horizontal overflow in the covered browser smoke;
- internal routes remain within the GitHub Pages base path;
- the removed Cambridge Linear Algebra resource identifier does not reappear;
- build-budget growth is limited to reviewed static content.

## Evidence boundary

Passing Astro checks, source validators, production build, and browser smoke establishes only the covered source structure and rendering behavior. It does not independently validate every mathematical claim, certify a crystallographic structure, choose a symmetry tolerance, prove a Fourier cutoff or grid sufficient, establish PDE well-posedness for an unstated model, or demonstrate scientific convergence of an observable.
