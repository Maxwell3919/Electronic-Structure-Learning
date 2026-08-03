# Theory quality audit — pass 6: Foundational support and navigation

Review date: 2026-08-03

Website baseline: `0089fa44a1e5fff65f5b469c744ce458177b472b`

This document closes the first content-wide rolling Theory audit. It uses the same scientific-correctness, responsibility-boundary, derivation-continuity, mathematical-presentation, evidence, cross-page-coherence, and reader-value criteria as passes 1–5. It does not impose one visible page template, equal page length, a completion dashboard, or a large client-side prerequisite graph.

## Scope

The sixth pass reviewed:

- Calculus and Analysis;
- Differential Equations;
- Functional Analysis and Variational Methods;
- Numerical Analysis;
- Probability and Statistics;
- Classical Mechanics;
- Electromagnetism;
- Physical Chemistry;
- prerequisite and onward-link coherence in those pages;
- the current external resource destinations listed by those pages;
- shared keyboard-navigation and source-level accessibility structure;
- the distinction among deterministic repository evidence, browser evidence, accessibility evidence, and learner evidence.

The bounded scientific basis was the uploaded Theory systematic-review report, the current public Astro sources, existing page source and acceptance records, and the electronic-structure texts already used by the Atlas. External destinations were checked through their current official publisher, author, society, or MIT OpenCourseWare endpoints on 2026-08-03.

## Findings

### Calculus and Analysis

Status: **Accepted without public-page modification**.

The page already:

- separates computational calculus from proof-oriented real analysis;
- connects derivatives to controlled response and stationary points without equating stationarity with a minimum;
- separates mathematical integrals from quadrature, reciprocal-space sums, basis contractions, and grids;
- limits Taylor and perturbation expansions through regularity, scale, convergence, and truncation conditions;
- distinguishes pointwise and uniform convergence and warns against unproved interchange of limits, derivatives, and integrals;
- places functional derivatives, variational spaces, and weak convergence downstream rather than making them first-entry prerequisites.

No concrete scientific or native-MathML defect requiring correction was found. The page remains intentionally split between a beginner repair route and an advanced analysis continuation.

### Differential Equations

Status: **Accepted without public-page modification; PDE resource gap retained**.

The page already:

- treats an operator, domain, coefficients, regularity, initial/boundary conditions, normalization, and asymptotic behavior as one continuous problem;
- separates initial-value, boundary-value, spectral, Poisson, Sturm–Liouville, Green-function, and weak-form responsibilities;
- states that Green functions depend on boundary, causal, or radiation conditions;
- distinguishes the continuous model, discrete representation, and algebraic solver result;
- prevents a small matrix residual from being promoted into evidence that the intended continuum problem was solved.

No concrete scientific or MathML defect requiring correction was found. The systematic report's unresolved need for a fully reviewed open PDE route remains explicit; the current author-hosted ODE text and broad mathematical-methods reference do not pretend to fill that entire role.

### Functional Analysis and Variational Methods

Status: **Major admissible-domain and spectral-infimum repair completed**.

Finding FA-1: the Rayleigh quotient was introduced for a “normalized trial state outside the null space.” A Rayleigh quotient requires a nonzero trial state in the relevant operator or quadratic-form domain; “outside the null space” is neither the general condition nor a substitute for domain membership.

Action completed: the page now uses a nonzero admissible trial state and distinguishes the operator domain from the quadratic-form domain.

Finding FA-2: the page said minimizing the quotient gives the ground-state energy under suitable conditions, but did not distinguish the bottom of the spectrum from an attained ground-state eigenvalue.

Action completed: the page now states that the infimum gives the bottom of the spectrum for a self-adjoint semibounded Hamiltonian, while a ground-state eigenvalue exists only when the infimum is attained by an admissible state.

The existing boundaries among energy upper bounds, observable convergence, functional differentiability, representability, weak formulations, compactness, and discrete convergence remain intact.

### Numerical Analysis

Status: **Major conditioning-scope and notation repair completed**.

Finding NA-1: the displayed perturbation bound contained only a right-hand-side perturbation but the surrounding prose described input perturbations generally. The one-term bound is not a complete simultaneous matrix-and-right-hand-side perturbation result.

Action completed: the equation is now scoped to a fixed nonsingular matrix with a small perturbation only in the right-hand side. The page separately states that perturbing the matrix introduces an additional relative matrix-error term and requires the perturbed system to remain nonsingular.

Finding NA-2: the nonlinear fixed-point example used `F[n]`, colliding with the universal density functional used elsewhere in the Atlas.

Action completed: the map is now `M[n]` in script notation, with an explicit statement that it is not the universal density functional `F[n]`.

The page continues to separate model, discretization, algebraic/iterative, and floating-point error; conditioning from stability; solver convergence from observable convergence; and numerical convergence from scientific support.

### Probability and Statistics

Status: **Major native-MathML and correlated-sampling repair completed**.

Finding PS-1: the variance expression placed the square exponent on an empty MathML node rather than on the full centered random variable. The TeX annotation was correct, but the visual MathML tree was not.

Action completed: the exponent now applies to the complete `(X - E[X])` expression.

Finding PS-2: the page defined one convention for integrated autocorrelation time but did not connect it quantitatively to effective sample size or warn that other conventions absorb the factor of two.

Action completed: the page now displays `N_eff approximately N/(2 tau_int)` for its declared convention, records the alternate convention, and states that finite data require a controlled summation window or truncation rule.

Sampling uncertainty remains separate from deterministic numerical error, model discrepancy, and experimental uncertainty.

### Classical Mechanics

Status: **Major action-integral MathML repair completed**.

Finding CM-1: the displayed action placed `t_0` and `t_1` beside the integral rather than attaching them as lower and upper limits in the native MathML tree.

Action completed: the limits are attached to the integral operator, and Hamilton's principle now states that the varied endpoint configurations are fixed.

The page continues to distinguish trajectory stationarity, electronic-energy minimization, thermodynamic equilibrium, Born–Oppenheimer forces, normal-mode curvature, finite-step integration, thermostat sampling, and transport dynamics.

### Electromagnetism

Status: **Navigation repair completed; scientific responsibility accepted**.

The electrostatic, Hartree, multipole, polarization, dielectric, longitudinal/transverse, surface-reference, charged-cell, and boundary-condition content was accepted without scientific correction.

Finding EM-1: the connections section still said that Linear Response and Berry-phase pages “will” treat dielectric response and polarization even though both pages are already published.

Action completed: the stale future-tense statement was replaced by live internal links to Linear Response and Excited States and Berry Phases and Electronic Topology, with their separate responsibilities stated.

### Physical Chemistry

Status: **Accepted without public-page modification**.

The page already:

- separates electronic energy, enthalpy, entropy, free energy, chemical potentials, equilibrium constants, barriers, rates, and spectra;
- requires standard states, activities, pressure/concentration conventions, reservoirs, and ensembles;
- prevents a static minimum-energy path from being interpreted as a complete rate calculation;
- prevents Kohn–Sham eigenvalue matching from being treated as a complete spectroscopic assignment;
- organizes the electronic, nuclear, thermodynamic, kinetic, and spectroscopic model layers without duplicating their dedicated pages.

No concrete scientific or MathML defect requiring correction was identified.

## Cross-page navigation result

The eight-page support route is coherent as a branching dependency structure:

```text
calculus and limits
├── differential equations and continuous operators
│   ├── electromagnetism and Poisson problems
│   └── weak formulations
├── functional analysis and variational spaces
│   └── finite trial spaces and DFT constrained variation
└── numerical analysis
    ├── conditioning / stability / solver error
    └── deterministic convergence boundaries

classical trajectories
├── probability and correlated sampling
├── statistical mechanics
└── physical chemistry / thermodynamics / kinetics
```

The exact-route build validator already checks that every internal link resolves inside the GitHub Pages base path. This pass additionally removed the identified stale future-tense navigation. It does not claim that every possible prerequisite edge should become a visible hyperlink; the Atlas remains a readable subject map rather than a graph database.

## External resource reachability snapshot

The following seventeen distinct destinations listed by the reviewed pages were checked on 2026-08-03:

1. MIT OpenCourseWare 18.01SC — reachable.
2. MIT OpenCourseWare 18.100A — reachable.
3. Springer, Abbott, *Understanding Analysis* — reachable publisher landing page; paid or institutional access remains.
4. Gerald Teschl, *Ordinary Differential Equations and Dynamical Systems* PDF — reachable author-hosted PDF.
5. Cambridge, Riley–Hobson–Bence, *Mathematical Methods for Physics and Engineering* — reachable publisher landing page.
6. MIT OpenCourseWare 18.330 — reachable.
7. MIT OpenCourseWare 18.102 — reachable.
8. Cambridge, Martin, Appendix A “Functional Equations” — official chapter destination remains discoverable; publisher access is restricted. A direct audit fetch returned a cache miss, so this is recorded as official-destination discovery rather than independent full-page retrieval.
9. MIT OpenCourseWare 18.335J — reachable.
10. SIAM, Trefethen and Bau, *Numerical Linear Algebra* — reachable publisher landing page; paid or institutional access remains.
11. MIT OpenCourseWare 18.05 — reachable.
12. MIT OpenCourseWare 18.175 — reachable.
13. MIT OpenCourseWare 8.01SC — reachable.
14. MIT OpenCourseWare 8.223 — reachable.
15. MIT OpenCourseWare 8.02 — reachable.
16. MIT OpenCourseWare 5.60 — reachable.
17. MIT OpenCourseWare 5.61 — reachable.

No confirmed 404 was found in this bounded set. Reachability is a dated network observation, not a guarantee of permanent availability, regional access, full-text permission, exercise-solution rights, or pedagogical suitability.

## Shared navigation and accessibility result

The shared layout already used English language metadata, semantic `header`, labelled primary `nav`, `main`, and `footer` landmarks, visible focus outlines, responsive typography, and native MathML with textual `aria-label` values.

Finding A11Y-1: keyboard users had no direct mechanism to bypass repeated site navigation.

Action completed: added a static “Skip to main content” link, a focusable main-content target, and a visible-on-focus style. No JavaScript, hydration, packaged font, or new dependency was introduced.

This is a source-level accessibility improvement, not a Web Content Accessibility Guidelines conformance claim. Screen-reader speech quality for MathML, high-contrast modes, browser zoom, switch access, cognitive load, and assistive-technology interoperability still require dedicated testing.

## Evidence classes after the six passes

### Deterministic repository evidence

Covered by the existing source and production-build gates:

- exact public route set;
- Astro parsing and static production build;
- every Theory expression using native MathML with one TeX annotation;
- internal links remaining under the Pages base path;
- zero client JavaScript;
- zero packaged fonts;
- reviewed build budget;
- no return of the retired course/runtime architecture.

### Browser evidence

The repository contains a desktop, true-390-pixel, keyboard, no-JavaScript, MathML-visibility, horizontal-overflow, direct-404, and legacy-route smoke script. This final pass does not claim that the script ran against the exact final GitHub Pages deployment, because an exact-final-SHA deployment manifest and live browser run were not obtained through the available execution path.

### Accessibility evidence

Only source-level semantics, focus styling, and the new bypass link are confirmed. Formal accessibility conformance and assistive-technology behavior remain unverified.

### Learner evidence

No structured beginner reading trial, comprehension test, navigation study, or comparison against a control curriculum has been performed. The audit can establish scientific and editorial boundaries; it cannot prove that a complete beginner will learn efficiently from every page.

## Content-wide conclusion

Across six bounded passes, all thirty-nine Theory pages have now been included in the rolling scientific/editorial review. No blocker, broad scientific reversal, or reason to rebuild the Theory architecture was found. The accepted corrections were local and evidence-driven: mathematical-tree repairs, convention declarations, approximation-scope boundaries, cross-page responsibility repairs, and one shared keyboard-navigation improvement.

This closes the first content-wide quality-audit cycle. Remaining work is no longer an undifferentiated request to “review all Theory content.” It consists of separately evidenced maintenance and validation tasks:

- exact-final-SHA GitHub Pages deployment and live browser smoke;
- cross-browser and assistive-technology MathML testing;
- structured beginner learner trials;
- periodic external-link maintenance;
- the previously recorded specialist resource comparisons for relativity/magnetism, inorganic chemistry, solid-state chemistry, and surface/interface science;
- independent numerical reproduction where a page later makes a system-specific scientific claim.

Future edits should remain issue-driven. The audit must not become a public completion dashboard, a mandatory page contract, or a reason to lengthen every page equally.
