# Complete Learning Framework

## Scope

The website framework follows two source layers:

1. Richard M. Martin, *Electronic Structure: Basic Theory and Practical Methods*, 2nd edition:
   - 7 Parts;
   - 28 numbered chapters;
   - 18 appendices, A–R;
   - 46 total chapter/appendix pages;
   - 315 directory-level section locators.
2. David S. Sholl and Janice A. Steckel, *Density Functional Theory: A Practical Introduction*:
   - 10 practical-reference chapter pages;
   - 93 numbered section/subsection locators.

The Martin structure is the primary theory spine. Sholl–Steckel is an auxiliary practical cross-reference, not a replacement course hierarchy.

## Current content state

Every generated unit is `outline` only. The framework stores:

- source bibliographic identity;
- Part/chapter/appendix numbering;
- directory titles;
- printed-page locators;
- empty content slots for later original writing.

It does not store textbook prose, scans, figures, exercise text, answers, or other copyrighted body content.

## Authoritative files

```text
src/data/martin/index.mjs
src/data/shollSteckelStructure.mjs
```

These catalogs are the machine-readable structural authority. Content pages resolve their unit metadata from the catalogs rather than duplicating section lists.

Generated navigation lives under:

```text
src/content/docs/
├── part-01-overview-and-background/
├── part-02-density-functional-theory/
├── part-03-important-preliminaries-on-atoms/
├── part-04-determination-of-electronic-structure/
├── part-05-properties-of-matter/
├── part-06-electronic-structure-and-topology/
├── part-07-appendices/
└── practice-sholl-steckel/
```

## Validation

```bash
npm run validate:framework
```

The validator checks:

- exact Part and unit counts;
- 28 chapter / 18 appendix split;
- exact page-file existence;
- unique slugs;
- source-page monotonicity;
- 315 Martin and 93 Sholl–Steckel section locators.

This validation proves only structural consistency of the framework. It does not validate future explanations, formulas, visualizations, numerical methods, or scientific claims.
