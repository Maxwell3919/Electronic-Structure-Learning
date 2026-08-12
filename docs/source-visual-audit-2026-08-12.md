# Source-visual audit · 2026-08-12

The audit covers all Astro route files below `src/pages/reading/` and `src/pages/theory/`, all 73 book content files below `src/reading/books/*/content/`, plus the four active book source-reading manifests. It checks source-media manifest records, local asset existence and SHA-256 values, explicit `SourceVisual` placements, legacy source-specific SVG calls, concrete book Figure/Table locators, book-body references cross-bound to those locators, canonical book-source provenance, and literature visual status.

## Current inventory

| Classification | Count | Boundary |
| --- | ---: | --- |
| `REAL_PRESENT` | 24 placements / 20 unique assets | A rights-safe source visual is recorded in the shared media manifest and displayed on the site. The five Giustino images form two book locator groups. |
| `SOURCE_CITED` | 123 book locator groups | The original Figure/Table is precisely identified and linked to the authoritative book record, but Atlas does not republish the source image. |
| `TEXT_ONLY_REFERENCE` | 0 | No scanned non-dynamic page leaves a concrete visual reference without a matching source-reading record. |
| `SVG_SUBSTITUTE` | 0 | No source-specific redraw is presented as the original source object. |
| `SOURCE_UNRESOLVED` | 0 | A Figure/Table locator now fails the audit if it lacks authoritative canonical-source provenance or otherwise cannot be resolved to a source record. |
| `NO_VISUAL_NEEDED` | 14 literature records | These literature entries are argument/equation-led records for which the audit does not require a source visual. |

The 125 book Figure/Table locator groups are distributed as follows: Cohen & Louie 35, Giustino 25, Martin 37, and Sholl & Steckel 28. Two Giustino Chapter 1 locator groups have five source-linked crops from the official Oxford University Press preview (`REAL_PRESENT`). The remaining 123 groups are `SOURCE_CITED`: their precise locator and authoritative book record are public, while the copyrighted source image itself is not republished merely to satisfy the audit.

Giustino Figure 1.7 illustrates the distinction. The inspected official preview does not provide a recoverable standalone copy, so Atlas links the original Figure 1.7 citation and does not redraw or republish it. That is `SOURCE_CITED`, not `SOURCE_UNRESOLVED`.

The audit also finds 19 concrete Figure/Table references in book-body content. Every one is cross-bound to a matching source-reading locator and therefore resolves to either `REAL_PRESENT` or `SOURCE_CITED`; none remains unclassified or source-unresolved.

All republished scientific visual records remain in `src/reading/source-media.ts`. Each such asset records source type, title, authors, publication or publisher, year, figure/table identifier, page where applicable, source and retrieval URLs, local asset path, retrieval date, usage page, SHA-256, and a rights note. Exact crops are not presented as open-licensed material.

The provenance audit is part of the standard site gate:

```bash
npm run check
```

For the standalone JSON report:

```bash
npm run audit:source-visuals -- --json
```
