# Content Contract

## 1. Page states

- `outline`: structure, source locator and empty content slots only;
- `draft`: original body exists but one or more source, derivation, visualization or boundary checks remain incomplete;
- `review`: the minimum information structure is present and awaits independent review or learner testing;
- `validated`: explicitly listed checks were actually executed and passed.

A status applies only to its declared object. It does not automatically validate the source, physical model or scientific conclusion.

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
