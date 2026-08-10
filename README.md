# Electronic Structure Atlas

Electronic Structure Atlas is a small, public map of electronic-structure foundations, continuous Core reading, guided reading, research methods, computational tools, and reviewed references.

The production site is a static Plain Astro build. It contains the Home page, a continuous Core opening sequence, thirty-nine individually reviewed Foundations pages, source-aligned Guided Reading pages, other research entrances, and a general 404 page. It has no search index, client hydration, packaged fonts, course-progress system, or content-management layer.

## Public routes

- `/`
- `/core/`
- `/core/orientation/`
- `/core/part-i/`
- `/core/part-ii/`
- `/theory/` — publicly presented as **Foundations** while existing routes are retained
- `/theory/linear-algebra/`
- `/theory/calculus-and-analysis/`
- `/theory/differential-equations/`
- `/theory/fourier-analysis/`
- `/theory/functional-analysis-and-variational-methods/`
- `/theory/numerical-analysis/`
- `/theory/probability-and-statistics/`
- `/theory/group-theory-and-symmetry/`
- `/theory/classical-mechanics/`
- `/theory/electromagnetism/`
- `/theory/quantum-mechanics/`
- `/theory/thermodynamics/`
- `/theory/statistical-mechanics/`
- `/theory/atomic-and-molecular-physics/`
- `/theory/solid-state-physics/`
- `/theory/crystallography/`
- `/theory/many-body-physics/`
- `/theory/general-chemistry/`
- `/theory/physical-chemistry/`
- `/theory/quantum-chemistry/`
- `/theory/chemical-bonding-and-molecular-structure/`
- `/theory/inorganic-chemistry/`
- `/theory/solid-state-chemistry/`
- `/theory/surface-and-interface-chemistry/`
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
- `/theory/linear-response-and-excited-states/`
- `/theory/many-body-perturbation-theory-and-quasiparticles/`
- `/theory/berry-phases-and-electronic-topology/`
- `/reading/`
- `/reading/books/`
- `/reading/books/martin/`
- `/reading/martin/` — compatibility redirect to the canonical Martin route
- `/methods/`
- `/computational-tools/`
- `/reference/`
- `/404.html`

## Core, Foundations, and Guided Reading

Core is the Atlas's own continuous explanation of electronic structure. The opening sequence establishes why electronic structure matters, defines the coupled electron–nuclear problem, and develops fermionic mean-field and correlation language. It does not follow one source's chapter order and does not publish empty routes for later Parts.

Foundations is the knowledge, prerequisite, relationship, and reviewed-resource map. The first implementation phase changes the public label and landing-page role without breaking the established `/theory/` routes.

Guided Reading supplies continuous source-aligned narratives and is organized by source type. Books live under `/reading/books/`; lecture routes will be added only when a complete reviewed guide exists.

The first book route follows Richard M. Martin's *Electronic Structure: Basic Theory and Practical Methods*, second edition, as twenty-eight chapters and eighteen appendices. The route overview exposes this forty-six-unit source spine without publishing empty chapter pages. Content begins with Chapter 1 and proceeds through the book in order; appendices are added when the main sequence first needs them.

The guide uses original prose and original or openly licensed diagrams. Textbook PDFs, complete extracted textbook text, copied figures, and page scans are not stored or published.

## Internal writing guidance

Book-guide writing guidance for maintainers and automated agents is stored at:

```text
.github/agent-guides/book-guided-reading-style.md
```

It is not rendered or linked from the public website. The repository is public, so the file remains visible to anyone browsing GitHub.

## Local verification

Use Node.js 22.12 or newer.

```bash
npm ci --no-audit --no-fund
npm run check
```

The deployed browser smoke is intentionally separate because it verifies the GitHub Pages base path, final deployment SHA, keyboard access, native MathML, narrow screens, configured redirects, and operation with JavaScript disabled.

## Legacy site

The retired source-aligned course site, its practice cross-reference, interactive components, and validation system remain available only through the annotated tag `legacy/atlas-v3-martin-site-20260802`. See [`docs/legacy-site.md`](docs/legacy-site.md). The current Guided Reading framework is a clean static implementation and does not restore that legacy course system. Old public URLs are not compatibility targets unless an explicit redirect is configured.

## Boundaries

New scientific content is added individually after source and scope review. Core uses multi-source synthesis and original prose; Foundations pages repair prerequisites without being forced into one public template. Mathematical notation uses static native MathML with TeX annotations. Guided Reading preserves a reviewed source sequence but links to Foundations instead of duplicating its concept explanations or course inventories. The Methods entrance is a concise conceptual map; execution, convergence, validation, and provenance workflows remain in DFT Research Workflow. This repository does not store textbook PDFs, extracted full texts, licensed software material, credentials, private research notes, or bulk calculation outputs.
