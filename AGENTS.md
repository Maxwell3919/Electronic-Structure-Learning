# AGENTS.md

This file defines the repository-specific rules for maintainers and automated agents.

## Scope

This repository is the public source for Electronic Structure Atlas. The production site is Plain Astro, fully static, and currently limited to Home, Theory, Methods, Computational Tools, Reference, seventeen individually reviewed Theory pages, and a general 404 page.

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
- Keep a continuous differential equation distinct from its domain and boundary conditions, its finite discretization, and the algebraic solver result.
- Keep Fourier coefficients, reciprocal-lattice vectors, Bloch wavevectors, FFT grids, and Brillouin-zone sampling as distinct objects.
- Keep crystallographic geometry and classification distinct from the representation theory describing how symmetry acts on states, operators, modes, and tensors.
- Keep theory, methods, tools, and references distinct. Methods must not become a paper-reading database.
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
