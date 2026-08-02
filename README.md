# Electronic Structure Atlas

Electronic Structure Atlas is a small, public map of electronic-structure theory, research methods, computational tools, and reviewed references.

The production site is a static Plain Astro build with six HTML files: Home, four subject entrances, and a general 404 page. It has no search index, client hydration, packaged fonts, course-progress system, or content-management layer.

## Public routes

- `/`
- `/theory/`
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

The deployed browser smoke is intentionally separate because it verifies the GitHub Pages base path, final deployment SHA, keyboard access, narrow screens, and operation with JavaScript disabled.

## Legacy site

The retired Martin-course site, its Sholl–Steckel cross-reference, interactive components, and validation system remain available only through the annotated tag `legacy/atlas-v3-martin-site-20260802`. See [`docs/legacy-site.md`](docs/legacy-site.md). Old public URLs are not compatibility targets.

## Boundaries

New scientific content is added only after human review. This repository does not store textbook PDFs, licensed software material, credentials, private research notes, or bulk calculation outputs. The current baseline does not implement the planned Talos home-page experience.
