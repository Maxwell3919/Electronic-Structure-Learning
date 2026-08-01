# Architecture

## 1. Static-first structure

```text
Machine-readable source maps and site registries
        │
        ├── Martin: 7 Parts / 46 units
        ├── Sholl–Steckel: 10 practice units
        ├── navigation, paths, status, labs, cases, reference
        ├── 46-unit source-semantic audit and terminology registry
        └── empty-first literature, claim, queue, and discussion contracts
                    │
                    ▼
          MDX route skeletons
                    │
        ├── directory-level page locators
        ├── reusable outline components
        ├── future original explanations
        └── interactive teaching components
                    │
                    ▼
       deterministic Node validation
                    │
                    ▼
             Astro static build
                    │
                    ▼
         GitHub Pages public deployment
```

The site remains static-first. MDX stores learning pages; small client-side components are used only where interaction has a clear teaching purpose.

## 2. Content layers

```text
src/data/
├── martin/
│   ├── index.mjs
│   └── part01.mjs … part07.mjs
├── shollSteckelStructure.mjs
└── site/
    ├── navigation.mjs
    ├── learningPaths.mjs
    ├── contentStatus.mjs
    ├── labs.mjs
    ├── cases.mjs
    ├── referenceSections.mjs
    ├── sourceSemanticStatus.mjs
    └── terminology.mjs

src/data/literature/
├── registry.mjs
├── topics.mjs
├── readingQueue.mjs
├── claimLedger.mjs
├── discussions.mjs
└── schema.mjs

src/content/docs/
├── index.mdx
├── start-here.mdx
├── reading-system.mdx
├── book-map.mdx
├── learning-paths/
├── theory/
├── labs/
├── cases/
├── interactive-labs/
├── reference/
├── literature/
├── part-01-overview-and-background/
├── part-02-density-functional-theory/
├── part-03-important-preliminaries-on-atoms/
├── part-04-determination-of-electronic-structure/
├── part-05-properties-of-matter/
├── part-06-electronic-structure-and-topology/
├── part-07-appendices/
├── practice-sholl-steckel/
└── labs/
```

The Martin and Sholl–Steckel modules remain the source-structure authority. `src/data/site/` supplies learner-facing navigation and four-dimensional content status. Framework routes stay thin and data-driven.

## 3. Authority boundary

| Object | Authority |
|---|---|
| Site code, structure catalogs, and original learning content | This repository `main` |
| Deployed public site | GitHub Pages deployment record |
| Textbook body | Lawfully obtained external copy; never stored here |
| Private reflection | Learning-Records/future Record |
| Raw DFT output and restart data | Project repositories or calculation hosts |
| Small publishable derived data | This repository only after provenance and redistribution checks |

## 4. Components

- `ReadingOutline.astro`: unit-level source, page and section skeleton;
- `TrackOverview.astro`: Part or practical-track navigation;
- `BookMap.astro`: complete course map;
- `SourceNote.astro`: source identity and status;
- `DerivationBlock.astro`: assumptions and derivation container;
- `VisualizationPlaceholder.astro`: pre-implementation visualization contract;
- `SCFIterationVisualizer.astro`: existing affine fixed-point teaching experiment.
- `src/components/site/`: neutral learning-path, catalog, status and navigation interfaces.
- `src/components/reading/`: route-aware unit frame, source header, display toolbar, semantic contents and literature bridge;
- `src/components/overrides/`: Starlight integration shared by all routes;
- `src/components/theory/`: static-first complete Theory Atlas;
- `src/components/literature/`: bibliography, claim and discussion presentation contracts.

## 5. Validation

- `scripts/validate-framework.mjs`: structural counts, files, slugs and page ordering;
- `scripts/validate-scf-model.mjs`: five deterministic teaching-model regimes;
- `scripts/test-registry.mjs`: stable validator and browser-smoke registration;
- `scripts/validate-site-architecture.mjs`: routes, statuses, references and publication boundaries;
- `scripts/run-registered-validators.mjs`: fail-closed deterministic registry runner;
- `scripts/validate-unit-reading-frame.mjs`: all-unit and built-HTML reading-frame audit;
- `scripts/validate-source-semantics.mjs`: catalog/source-layer and bounded heading audit;
- `scripts/validate-terminology.mjs`: terminology registry contract;
- `scripts/validate-literature-layer.mjs`: empty-first literature schema and route checks;
- `scripts/validate-runtime-lifecycle.mjs`: timer, RAF, observer, global-listener, and idempotent-controller ownership checks;
- `scripts/runtime-diagnostics/`: test-only Chrome/CDP idle, route, mode, and interaction probes; never imported by production source;
- `npm run build`: MDX imports, routes, formulas and static-site output.

These gates do not validate future scientific explanations or real DFT calculations.

## 6. Scientific data flow

```text
QE / VASP / other external calculation
        -> parser
        -> identity, unit, reference, grid and provenance checks
        -> small JSON / CSV / CIF / XYZ derivative
        -> read-only website visualization
```

The browser does not run production QE, VASP, DFPT or EPW jobs.

## 7. Deferred capabilities

The current framework does not introduce accounts, databases, a Python backend, Slurm submission, large-object storage, or online production DFT calculations.
