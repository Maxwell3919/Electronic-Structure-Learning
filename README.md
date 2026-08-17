# Electronic Structure Atlas

Electronic Structure Atlas is a small, public map of electronic-structure foundations, continuous Core reading, guided reading, research methods, computational tools, and reviewed references.

The production site uses a static Plain Astro presentation build plus a narrow Literature runtime on Talos, exposed through Newt at `http://188.255.156.20/Electronic-Structure-Learning/`. The static layer contains the Home page, a continuous Core opening sequence, thirty-nine individually reviewed Foundations pages, source-aligned Guided Reading pages, other research entrances, and a general 404 page. The runtime streams pre-indexed canonical Records PDFs and reads GitHub-authoritative curated annotation files. Personal annotations stay editable in the browser's IndexedDB; the runtime exposes no annotation mutation API and is not a content-management layer.

GitHub is the source and version-control authority. GitHub Pages is retired and forbidden as a deployment target; CI validates source changes but never publishes the site. Production acceptance is always performed against the Newt/Talos endpoint above.

Literature pages and PDF delivery are separate decisions. A citation route and original curated notes may remain public, while the runtime serves PDF bytes only when the exact canonical SHA-256 has a reviewed `allowed` decision in Records `manifests/literature-public-delivery.json`. Missing, unknown, mismatched, or unreviewed rights evidence is blocked by default; this technical firewall is not a legal conclusion and does not delete the private canonical research copy.

## Public routes

- `/`
- `/core/`
- `/core/orientation/`
- `/core/part-i/`
- `/core/part-ii/`
- `/core/part-iii/`
- `/core/part-iv/`
- `/core/part-v/`
- `/core/part-vi/`
- `/core/part-vii/`
- `/core/part-viii/`
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
- `/reading/books/sholl-steckel/`
- `/reading/books/cohen-louie/`
- `/reading/books/giustino/`
- `/reading/literature/`
- `/reading/literature/hohenberg-kohn-1964/`
- `/reading/literature/kohn-sham-1965/`
- `/reading/literature/levy-1979/`
- `/reading/literature/hedin-1965/`
- `/reading/martin/` — compatibility redirect to the canonical Martin route
- `/methods/`
- `/computational-tools/`
- `/reference/`
- `/404.html`

## Core, Foundations, and Guided Reading

Core is the Atlas's own continuous explanation of electronic structure. The published sequence establishes why electronic structure matters, defines the coupled electron–nuclear problem, develops fermionic mean-field and correlation language, shows how periodicity organizes one-particle states, explains the density-functional and Kohn–Sham bridge, follows the equations into finite computation, and then distinguishes ground-state properties, response, lattice dynamics, charged excitations, neutral excitations, and spectra. It does not follow one source's chapter order. Its landing page provides concise exits to advanced branches without creating empty routes.

Foundations is the knowledge, prerequisite, relationship, and reviewed-resource map. The first implementation phase changes the public label and landing-page role without breaking the established `/theory/` routes.

Guided Reading supplies source-aligned routes and is organized by source type. Books live under `/reading/books/`. Literature uses twelve research-topic entrances; each topic is a restrained paper index, and an individually integrated Paper Reader keeps the original PDF central while binding reviewed notes to page evidence.

The completed Books collection follows four distinct sources without merging their arguments: Martin's theory-to-method spine, Sholl and Steckel's practical plane-wave DFT sequence, Cohen and Louie's condensed-matter progression, and Giustino's route between formal DFT, calculated properties, and experiment. Each guide publishes only completed source-aligned units and keeps its own chapter order.

The guide uses original prose and follows a source-visual-first rule. When a real source figure or table materially supports the explanation, the site may publish an exact, tightly cropped source-linked excerpt with its source, page or figure identifier, retrieval record, hash, usage pages, and rights note in `src/reading/source-media.ts`. Full textbook PDFs, complete extracted textbook text, and page scans are not stored or published; a catalog cover or source excerpt is not treated as an open-licence claim.

## Internal writing guidance

Book-guide writing guidance for maintainers and automated agents is stored at:

```text
.github/agent-guides/book-guided-reading-style.md
```

The one-paper-at-a-time source, scientific-reading, evidence-integration, and release
contract for Literature is stored at:

```text
.github/agent-guides/literature-ingestion-contract.md
```

It is not rendered or linked from the public website. The repository is public, so the file remains visible to anyone browsing GitHub.

## Local verification

Use Node.js 22.12 or newer.

```bash
npm ci --no-audit --no-fund
npm run check
```

The deployed browser smoke is intentionally separate because it verifies the Talos → Newt production route, final deployment SHA, PDF Reader behavior, keyboard access, native MathML, narrow screens, configured redirects, and operation with JavaScript disabled. Set `ATLAS_PUBLIC_URL` when exercising a deployed site. GitHub Pages is retired, receives no deployment, and must not be used as a fallback smoke target.

## Legacy site

The retired source-aligned course site, its practice cross-reference, interactive components, and validation system remain available only through the annotated tag `legacy/atlas-v3-martin-site-20260802`. See [`docs/legacy-site.md`](docs/legacy-site.md). The current Guided Reading framework is a clean static implementation and does not restore that legacy course system. Old public URLs are not compatibility targets unless an explicit redirect is configured.

## Boundaries

New scientific content is added individually after source and scope review. Core uses multi-source synthesis and original prose; Foundations pages repair prerequisites without being forced into one public template. Mathematical notation uses static native MathML with TeX annotations. Guided Reading preserves a reviewed source sequence but links to Foundations instead of duplicating its concept explanations or course inventories. The Methods entrance is a concise conceptual map; execution, convergence, validation, and provenance workflows remain in DFT Research Workflow. This repository does not store textbook PDFs, extracted full texts, licensed software material, credentials, private research notes, or bulk calculation outputs.
