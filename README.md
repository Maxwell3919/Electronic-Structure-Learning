# Electronic Structure Atlas

Electronic Structure Atlas is a small, public map of electronic-structure theory, research methods, computational tools, and reviewed references.

The production site is a static Plain Astro build. It currently contains the Home page, four subject entrances, twenty-five individually reviewed Theory pages, and a general 404 page. It has no search index, client hydration, packaged fonts, course-progress system, or content-management layer.

## Public routes

- `/`
- `/theory/`
- `/theory/linear-algebra/`
- `/theory/calculus-and-analysis/`
- `/theory/differential-equations/`
- `/theory/fourier-analysis/`
- `/theory/numerical-analysis/`
- `/theory/group-theory-and-symmetry/`
- `/theory/quantum-mechanics/`
- `/theory/atomic-and-molecular-physics/`
- `/theory/solid-state-physics/`
- `/theory/crystallography/`
- `/theory/physical-chemistry/`
- `/theory/quantum-chemistry/`
- `/theory/chemical-bonding-and-molecular-structure/`
- `/theory/many-electron-problem/`
- `/theory/hartree-and-hartree-fock-theory/`
- `/theory/density-functional-theory-foundations/`
- `/theory/kohn-sham-density-functional-theory/`
- `/theory/exchange-correlation-functionals-and-approximations/`
- `/theory/self-consistent-field-methods/`
- `/theory/discretization-and-basis-representations/`
- `/theory/plane-wave-and-real-space-methods/`
- `/theory/localized-orbital-methods/`
- `/theory/pseudopotentials-paw-and-core-valence-treatments/`
- `/theory/brillouin-zone-sampling/`
- `/theory/relativistic-electronic-structure-spin-and-magnetism/`
- `/methods/`
- `/computational-tools/`
- `/reference/`
- `/404.html`

## Local verification

Use Node.js 22.12 or newer.

```bash
npm ci --no-audit --no-fund
npm run check
```

The deployed browser smoke is intentionally separate because it verifies the GitHub Pages base path, final deployment SHA, keyboard access, native MathML, narrow screens, and operation with JavaScript disabled.

## Legacy site

The retired source-aligned course site, its practice cross-reference, interactive components, and validation system remain available only through the annotated tag `legacy/atlas-v3-martin-site-20260802`. See [`docs/legacy-site.md`](docs/legacy-site.md). Old public URLs are not compatibility targets.

## Boundaries

New scientific content is added individually after source and scope review. Topic pages are shaped by the subject rather than forced into one public template. Mathematical notation uses static native MathML with TeX annotations. The Methods entrance is a concise conceptual map; execution, convergence, validation, and provenance workflows remain in DFT Research Workflow. This repository does not store textbook PDFs, licensed software material, credentials, private research notes, or bulk calculation outputs. The current baseline does not implement the planned Talos home-page experience.
