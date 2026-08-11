# Literature audit · 2026-08-12

This inventory covers the scholarly sources currently represented by the Atlas reference layer and the explicit primary-paper citations in the existing Literature guides. Books, documentation homepages, database homepages, software repositories, and ordinary manuals are excluded from the paper count.

## Authority and classification

`src/reading/literature.ts` is the single public Literature record layer. It derives the current paper-like entries from `src/reference/normalized-works.ts`, adds only the explicitly selected primary sources needed by the Atlas development chain, and joins publication venue/volume/pages or article number from `src/reading/literature-publication.ts`.

Records are deduplicated by normalized DOI. A `LITERATURE_GUIDE` has an independent source route because it is foundational, method-defining, repeatedly used, or an intentional teaching case. A `BIBLIOGRAPHY_REFERENCE` remains a compact source record. `CORE_WITHOUT_GUIDE` means a record explicitly placed in the core-guide inventory has no route; it does not mean every bibliography citation must become a long page.

The guide prose was written from the primary article or official primary record. Metadata was checked against DOI/publisher or journal records; arXiv records retain their arXiv canonical route where no journal record is present. The visual status is conservative: the existing Hohenberg–Kohn and Hedin source figures remain in the shared `SourceVisual` system; theorem-, equation-, and construction-led guides are marked `NO_VISUAL_NEEDED` rather than receiving an invented diagram.

## Counts

The reproducible command is:

```bash
npm run audit:literature
```

It currently reports:

| Metric | Count |
| --- | ---: |
| `TOTAL_PAPER_REFERENCES` | 81 |
| `LITERATURE_GUIDES` | 17 |
| `BIBLIOGRAPHY_ONLY` | 64 |
| `CORE_WITHOUT_GUIDE` | 0 |
| `UNRESOLVED_METADATA` | 0 |
| `DUPLICATE_REFERENCES` | 0 |
| `GUIDES_WITH_SOURCE_VISUAL` | 3 |
| `GUIDES_NO_VISUAL_NEEDED` | 14 |
| `UNRESOLVED_VISUALS` | 0 |

Guide coverage:

| Topic | Guides |
| --- | ---: |
| Foundations of electronic structure | 4 |
| Exchange and correlation | 3 |
| Electronic-structure methods | 2 |
| Response, phonons, and electron–phonon coupling | 1 |
| Many-body and excitations | 3 |
| Wannier, Berry, and topology | 3 |
| Applications and representative systems | 1 |

The separate full-site source-visual audit remains:

```text
TEXT_ONLY_REFERENCE: 0
SVG_SUBSTITUTE: 0
SOURCE_UNRESOLVED: 123 book Figure/Table locator groups
```

The 123 book locator groups are deliberately outside this Literature task and remain fail-closed. They are not counted as Literature metadata or Literature visual debt.
