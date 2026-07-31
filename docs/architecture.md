# Architecture

## 1. Static-first structure

```text
Machine-readable source maps
        │
        ├── Martin: 7 Parts / 46 units
        └── Sholl–Steckel: 10 practice units
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
└── shollSteckelStructure.mjs

src/content/docs/
├── index.mdx
├── start-here.mdx
├── reading-system.mdx
├── book-map.mdx
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

The JavaScript data modules are the structural authority. Unit pages are intentionally thin route files that resolve their source metadata from a catalog and render `ReadingOutline.astro`.

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

## 5. Validation

- `scripts/validate-framework.mjs`: structural counts, files, slugs and page ordering;
- `scripts/validate-scf-model.mjs`: five deterministic teaching-model regimes;
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
