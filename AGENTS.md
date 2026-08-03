# AGENTS.md

This file defines the repository-specific rules for maintainers and automated agents.

## Scope

This repository is the public source for Electronic Structure Atlas. The production site is Plain Astro, fully static, and currently limited to Home, Theory, Methods, Computational Tools, Reference, thirty-eight individually reviewed Theory pages, and a general 404 page.

The retired course site is preserved by Git history and the annotated tag `legacy/atlas-v3-martin-site-20260802`. Its routes, components, data, styles, and validators are not maintained on `main`. New work does not inherit legacy content or URL-compatibility obligations by default.

## Before changing the repository

1. Resolve the current remote `main` SHA and read this file, `README.md`, and the relevant documents.
2. Inspect open issues, pull requests, and task branches.
3. Use a single-purpose short-lived branch and preserve unrelated work.
4. Treat every committed file as public material.

## Architecture

- Keep Astro in static-output mode and preserve the GitHub Pages base path.
- Prefer ordinary `.astro` pages, semantic HTML, and one shared stylesheet.
- Do not add Starlight, a CMS, search, client hydration, page-specific JavaScript, packaged fonts, or a general data registry without a demonstrated current consumer and explicit review.
- Keep navigation usable without JavaScript and on narrow screens.
- Author mathematical notation with native MathML. Every mathematical expression must include a TeX annotation inside `<semantics>`; display equations use the shared `.math-display` wrapper. Do not present equations as code-styled Unicode text, images, or client-rendered MathJax/KaTeX output.
- Keep display mathematics horizontally contained at narrow widths. Internal equation scrolling is acceptable; page-level horizontal overflow is not.
- Do not restore legacy Part, Chapter, Appendix, practice, learning-path, reading-system, lab, case, literature, status, or progress structures merely because they exist in history.

## Content and evidence

- Add content individually after scientific and source review; do not generate bulk filler.
- Do not impose one visible section contract on all Theory pages. Let each subject determine its explanatory order while keeping scope, sources, and limitations explicit.
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
- Keep theory, methods, tools, and references distinct. Methods must not become a paper-reading database or duplicate DFT Research Workflow operation contracts.
- Distinguish program execution, SCF convergence, representation and sampling convergence, observable convergence, and scientific support.
- Use original prose. Do not commit textbook pages, copyrighted figures, licensed software content, large outputs, credentials, private paths, or restricted files.
- Remove or replace dead external resources when the official destination can no longer be verified. Do not preserve a broken link merely because it appeared in an earlier review.

## Verification

Minimum local gate:

```bash
npm ci --no-audit --no-fund
npm run check
git diff --check
```

Changes affecting public behavior also require the clean-slate browser smoke at desktop and 390-pixel widths with JavaScript enabled and disabled. Theory pages containing mathematics must additionally verify visible native MathML, TeX annotations, and no page-level horizontal overflow. A successful build verifies only the covered structure and runtime behavior; it does not constitute scientific review.

## Deployment

GitHub Pages remains at `https://maxwell3919.github.io/Electronic-Structure-Learning/`. Completion claims require a successful exact-`main` deployment manifest and live smoke. Repository rename, visibility, Pages base-path, custom-domain, backend, account, and database changes require separate authorization.
