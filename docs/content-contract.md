# Content Contract

## 1. Content states

`src/data/site/contentStatus.mjs` records four independent dimensions for every Martin and Sholl–Steckel unit:

- structural: `outline`, `draft`, `content-complete`;
- technical: `not-registered`, `registered`, `validated`;
- scientific review: `not-reviewed`, `review-needed`, `reviewed`;
- learner testing: `not-tested`, `planned`, `tested`.

These dimensions must not be collapsed into one `complete` label. A deterministic validator supports only its declared implementation checks; it does not automatically validate the source, physical model, scientific conclusion or learner outcome.

## 2. Framework-generated outline pages

The complete framework contains 46 Martin chapter/appendix pages and 10 Sholl–Steckel practical-reference pages.

An outline page may contain only:

- bibliographic identity;
- chapter/appendix number and title;
- printed start page;
- directory-listed section titles and page locators;
- generic slots for future original content.

It must not contain copied textbook prose, scans, figures, exercise text or answers.

The machine-readable catalogs are:

```text
src/data/martin/index.mjs
src/data/shollSteckelStructure.mjs
```

Changes to unit count, numbering, title, source page or slug must update the catalog and pass `npm run validate:framework`.

## 3. Minimum elements for substantive pages

When an outline is expanded, the resulting page must cover, in continuous readable prose where appropriate:

- learning question and prerequisites;
- source locator;
- physical objects, symbols, units and boundary conditions;
- definitions, exact relations, assumptions, approximations and numerical discretization;
- visualization/data specification and repeatable acceptance criteria;
- program completion, self-consistency, target-observable convergence, method applicability and scientific acceptance as separate gates;
- exercises or reflection tasks that require explanation, comparison, checking or reproduction.

## 4. Evidence language

Use evidence labels when they affect a decision:

- `【来源记录】`
- `【来源主张】`
- `【推断连接】`
- `【假设补全】`
- `【未知/待验证】`
- `【已独立验证】`

Do not describe a source claim or a teaching model as independent validation.

## 5. Writing form

The information requirements above do not require mechanical repetition of many short headings. A finished chapter should read as a coherent textbook unit, while still making source, assumptions, numerical conditions and evidence boundaries easy to locate.
