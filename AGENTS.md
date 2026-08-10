# AGENTS.md

This file defines the repository-specific rules for maintainers and automated agents.

## Scope

This repository is the public source for Electronic Structure Atlas. The production site is Plain Astro, fully static, and currently organized as Home, Core, Foundations, Guided Reading, Methods, Computational Tools, Reference, thirty-nine individually reviewed Foundations pages, and source-aligned Guided Reading pages. Core is the continuous teaching route; Foundations is its peer prerequisite-repair map. The established Foundations routes remain under `/theory/` during the first migration phase.

Guided Reading is grouped by source type. Book guides live below `/reading/books/`; literature guides live as flat source routes below `/reading/literature/`. Martin is the first book route at `/reading/books/martin/`. The former `/reading/martin/` path is compatibility-only and must not become the canonical content location. A source route is added only after a real reviewed guide exists.

The retired course site is preserved by Git history and the annotated tag `legacy/atlas-v3-martin-site-20260802`. Its routes, components, data, styles, and validators are not maintained on `main`. The current Guided Reading framework is a clean implementation and does not inherit legacy progress, practice, status, or URL-compatibility obligations beyond explicitly configured redirects.

## Before changing the repository

1. Resolve the current remote `main` SHA and read this file, `README.md`, and the relevant documents.
2. Inspect open issues, pull requests, and task branches.
3. Use a single-purpose short-lived branch and preserve unrelated work.
4. Treat every committed file as public material.
5. Before creating or revising a book guide, read `.github/agent-guides/book-guided-reading-style.md`, `docs/architecture.md`, and the relevant source chapter.

## Architecture

- Keep Astro in static-output mode and preserve the GitHub Pages base path.
- Prefer ordinary `.astro` pages, semantic HTML, and one shared stylesheet.
- Do not add Starlight, a CMS, search, client hydration, page-specific JavaScript, packaged fonts, or a general data registry without a demonstrated current consumer and explicit review.
- Keep navigation usable without JavaScript and on narrow screens.
- Author mathematical notation with native MathML. Every mathematical expression must include a TeX annotation inside `<semantics>`; display equations use the shared `.math-display` wrapper. Do not present equations as code-styled Unicode text, images, or client-rendered MathJax/KaTeX output.
- Keep display mathematics horizontally contained at narrow widths. Internal equation scrolling is acceptable; page-level horizontal overflow is not.
- Foundations remains the knowledge, prerequisite, relationship, and reviewed-resource map. Do not turn it into one mandatory course or flatten broad subjects and focused electronic-structure modules into one granularity.
- Guided Reading is grouped by source type. Book and literature sources must not accumulate directly in the `/reading/` root.
- Guided Reading may use small source-specific manifests with real public consumers. Do not publish empty chapter pages, progress badges, source-page markers, authoring prompts, or a general reading-management system.
- Do not restore legacy Part, Chapter, Appendix, practice, learning-path, lab, case, literature, status, or progress structures merely because they exist in history. Source-aligned identifiers are permitted only when a current guide uses them.

## Content and evidence

- Add content individually after scientific and source review; do not generate bulk filler.
- Use original prose for Guided Reading. Preserve the source sequence while separating the source-aligned explanation from later developments and present limitations.
- For book pages, use the original chapter title, open with one useful Core Idea sentence, follow the source's natural logic, and retain only the concepts, necessary contributors, physical meaning, assumptions, and decisive formulas needed to reconstruct the argument.
- Compress secondary history into causal timelines when useful. Give more depth to ideas that remain foundational, active, frequently misused, or directly relevant to present research.
- Do not expand a topic merely because it is modern. Expand it when understanding it changes how a researcher formulates, computes, validates, or interprets an electronic-structure problem.
- Avoid administrative wording such as `contract`, `protocol`, `compliance`, `acceptance gate`, or `status` in public reading prose.
- Link to Foundations instead of duplicating its complete concept explanations or course inventories. Link to Methods, Computational Tools, or DFT Research Workflow only when the source reaches those layers.
- Do not impose one visible section pattern on all Foundations pages. Let each subject determine its explanatory order while keeping scope, sources, and limitations explicit.
- Keep DFT foundations, Kohn–Sham construction, XC approximation, SCF solution, and numerical representation as distinct responsibilities. Do not merge them into a generic “DFT” page.
- Keep reciprocal-space vectors, plane-wave basis size, FFT grids, and Brillouin-zone sampling distinct. Do not present a band path as a BZ integration mesh or full-zone search.
- Treat pseudopotential and PAW datasets as versioned scientific inputs. Library verification does not replace system- and observable-specific validation.
- Distinguish scalar relativity, collinear spin polarization, noncollinear magnetism, and spin–orbit coupling. A converged magnetic branch is not proof of a global magnetic ground state.
- Keep Atomic and Molecular Physics focused on states, spectra, fields, and selection rules. It must not replace Quantum Chemistry or imply that ground-state Kohn–Sham eigenvalue differences are general excitation energies.
- Keep electronic total energies, finite-temperature free energies, chemical potentials, barriers, rates, and spectra as distinct model layers. Numerical convergence of one layer does not validate the others.
- Treat orbitals, charge partitions, bond orders, energy decompositions, oxidation states, and density topology as explicitly named interpretation frameworks rather than one universal bonding observable.
- Distinguish empirical tight binding from first-principles localized-basis calculations. Localized-basis labels, cutoff radii, zeta levels, auxiliary bases, grids, and convergence criteria are code- and observable-specific.
- Treat electrostatic boundary conditions, potential references, Coulomb kernels, multipole corrections, and charged-cell conventions as part of the physical model. A static Poisson solution is not a full optical Maxwell calculation.
- Keep physical electronic temperature, numerical smearing, vibrational free energy, thermodynamic ensemble, and finite trajectory sampling distinct. Convergence of one does not validate the others.
- Keep formal oxidation states, partitioned charges, defect charge states, carrier concentrations, and nominal dopant counts distinct. Zero-temperature formation energies do not by themselves establish finite-temperature phase stability or synthesis accessibility.
- Keep continuum operator domains, admissible spaces, boundary conditions, and finite discretizations explicit. A variational energy bound does not establish monotonic or correct convergence of every observable.
- Keep The Many-Electron Problem as the problem-definition page and Many-Body Physics as the formal second-quantized/Green-function framework. Do not merge them because both concern interacting electrons.
- Keep ground-state derivatives, DFPT, TDDFT, GW quasiparticles, and BSE electron–hole excitations distinct. Similar matrix forms or spectra do not make their physical objects interchangeable.
- Distinguish charged addition/removal gaps, neutral optical excitations, exciton binding, and Kohn–Sham eigenvalue gaps. Every GW claim must name its starting point, self-consistency variant, screening model, dimensional Coulomb treatment, and relevant convergence controls.
- Distinguish sampling uncertainty, deterministic numerical error, model discrepancy, and experimental uncertainty. Repeated or statistically precise calculations do not validate an approximation stack.
- Treat correlated trajectories through equilibration, autocorrelation, effective sample size, and stationarity checks; the number of stored frames is not automatically the number of independent samples.
- Keep electronic forces, classical nuclear dynamics, harmonic normal modes, and thermodynamic equilibrium as separate responsibilities. A stable trajectory or positive local curvature does not prove global or finite-temperature stability.
- Keep internal energy, Helmholtz free energy, Gibbs free energy, grand potential, and zero-temperature electronic energy distinct. State the controlled variables, reservoirs, allowed phases, and omitted entropy terms before making stability claims.
- Keep exact total electron count separate from formal charge, oxidation state, partial charge, density-basin charge, and projected orbital occupation. Chemical bookkeeping models do not become unique quantum observables.
- Treat crystal-field diagrams, formal d/f counts, and spin-only moments as interpretive models. Test chemically plausible structural, spin, orbital, and magnetic branches rather than treating one converged initialization as global evidence.
- Treat surface termination, stoichiometry, reconstruction, adsorbate coverage, slab geometry, electrostatic reference, and chemical reservoirs as parts of the physical system. Surface and adsorption energies are reference-dependent quantities.
- Keep surface energy, adsorption energy, activation barrier, rate, coverage, catalytic activity, work function, and band alignment distinct. Each requires its own observable-specific convergence and reference checks.
- Distinguish gauge-dependent connections and phase conventions from gauge-invariant curvature, projectors, closed-loop quantities, and stated observables. Never present a raw Bloch-state phase as a physical measurement.
- At degeneracies or within composite occupied manifolds, formulate claims through the occupied subspace, projector, non-Abelian connection, or Wilson loop rather than arbitrary energy-ordered band labels.
- Do not infer topology from band inversion, one symmetry indicator, one edge crossing, or one Wannier interpolation alone. State the invariant, protecting symmetry, gap, filling, selected subspace, spin/SOC/magnetic model, and dimensional setting.
- Converge topology claims with respect to k-space meshes, loop discretization, subspace and disentanglement windows, structural and Hamiltonian choices, and boundary size/termination when boundary spectra are used.
- Keep Foundations, Guided Reading, Methods, Computational Tools, and Reference distinct. Methods must not become a paper-reading database or duplicate DFT Research Workflow operation pages.
- Distinguish program execution, SCF convergence, representation and sampling convergence, observable convergence, and scientific support.
- Use original prose. Do not commit textbook pages, complete extracted textbook text, copyrighted figures, licensed software content, large outputs, credentials, private paths, or restricted files.
- Remove or replace dead external resources when the official destination can no longer be verified. Do not preserve a broken link merely because it appeared in an earlier review.

## Verification

Minimum local gate:

```bash
npm ci --no-audit --no-fund
npm run check
git diff --check
```

Changes affecting public behavior also require the clean-slate browser smoke at desktop and 390-pixel widths with JavaScript enabled and disabled. Foundations and book-guide pages containing mathematics must additionally verify visible native MathML, TeX annotations, and no page-level horizontal overflow. A successful build verifies only the covered structure and runtime behavior; it does not constitute scientific review.

## Deployment

GitHub Pages remains at `https://maxwell3919.github.io/Electronic-Structure-Learning/`. Completion claims require a successful exact-`main` deployment manifest and live smoke. Repository rename, visibility, Pages base-path, custom-domain, backend, account, and database changes require separate authorization.
