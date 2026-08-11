# Source-visual audit · 2026-08-12

The audit covers all Astro pages below `src/pages/reading/` and `src/pages/theory/`, plus the four active book source-reading manifests. It checks source-visual manifest records, local asset existence and SHA-256 values, explicit `SourceVisual` placements, legacy source-specific SVG calls, concrete book Figure/Table locators, and literature visual status.

## Current inventory

| Classification | Count | Boundary |
| --- | ---: | --- |
| `REAL_PRESENT` | 24 placements / 20 unique assets | 14 paper figures, 5 Giustino book figures, and 1 official DFTK calculation figure; book and paper placements are source-linked in the shared manifest. |
| `TEXT_ONLY_REFERENCE` | 0 | No scanned non-dynamic page leaves a concrete visual reference without either a real visual or an explicit unresolved source record. |
| `SVG_SUBSTITUTE` | 0 | The former source-specific `SourceVisual` SVG kinds are no longer used. Conceptual diagrams outside that source-visual path are not counted as source substitutions. |
| `SOURCE_UNRESOLVED` | 123 | Concrete book Figure/Table locator groups without a reliable source asset in the inspected local or official source material. |
| `NO_VISUAL_NEEDED` | 2 | Kohn–Sham (1965) and Levy (1979) literature guides are equation/argument-led and have no necessary paper visual identified. |

The 125 book locator groups are distributed as follows: Cohen & Louie 35, Giustino 25, Martin 37, and Sholl & Steckel 28. Giustino Chapter 1 has source-linked crops for Figures 1.2–1.6 from the official Oxford University Press preview; Figure 1.7 remains explicitly unresolved because that preview does not contain a recoverable standalone copy.

All visual records are in `src/reading/source-media.ts`. Each scientific asset records source type, title, authors, publication or publisher, year, figure/table identifier, page where applicable, source and retrieval URLs, local asset path, retrieval date, usage page, SHA-256, and a rights note. Exact crops are not presented as open-licensed material.

Run the audit with:

```bash
node scripts/audit-source-visuals.mjs
```
