# Foundations and Guided Reading plan

Status: adopted architecture decision, 2026-08-06

This document records the planned expansion of Electronic Structure Atlas. It changes the public role of the current `Theory` entrance and adds a Martin-guided reading layer. It does not by itself change deployed routes or pages.

## Public information architecture

The planned top-level navigation is:

```text
Home
Foundations
Guided Reading
Methods
Computational Tools
Reference
```

The responsibilities remain separate:

```text
Foundations
= what knowledge is needed, how it is connected, and where to learn it

Guided Reading
= continuous explanations organized around a reviewed source sequence

Methods
= what major electronic-structure method families solve and where they apply

Computational Tools
= software, program, and data-service context

DFT Research Workflow
= execution, convergence, validation, evidence, and reproducibility
```

The intended learner path is:

```text
Foundations
→ identify and repair prerequisite gaps
→ Guided Reading
→ build a continuous electronic-structure narrative
→ Methods
→ compare approximations and solution families
→ Computational Tools / DFT Research Workflow
→ implement, converge, validate, and report calculations
```

## Foundations

`Foundations` replaces `Theory` as the public navigation label because the existing section is primarily a knowledge map. It connects mathematics, physics, chemistry, numerical analysis, electronic-structure concepts, recommended courses, books, and external learning routes. It is not a single linear theory course or a textbook-equivalent treatment.

Recommended presentation:

```text
Navigation label: Foundations
Landing-page title: How Much Theory Do You Need?
```

The landing page helps readers identify prerequisite gaps, understand dependency and branching relationships, choose suitable learning resources, and continue into a structured reading route.

The thirty-nine reviewed pages remain the canonical subject map. Their scientific boundaries, source review, native MathML rules, and resource-selection discipline remain unchanged. The rename must not flatten the intentional difference between broad prerequisite domains and narrower electronic-structure modules.

At the end of the Foundations landing page, add:

```text
Continue with structured reading
→ Martin · Electronic Structure
```

## Guided Reading

`Guided Reading` is a new top-level entrance for continuous, source-aligned reading routes. It supplies sequence and narrative without creating a second theory taxonomy.

The first route is:

```text
Richard M. Martin
Electronic Structure: Basic Theory and Practical Methods, 2nd ed.
```

The route follows the source order:

1. Overview and Background Topics — 5 chapters
2. Density Functional Theory — 4 chapters
3. Important Preliminaries on Atoms — 2 chapters
4. Determination of Electronic Structure — 7 chapters
5. From Electronic Structure to Properties of Matter — 6 chapters
6. Electronic Structure and Topology — 4 chapters
7. Appendices — 18 units

This gives 28 chapters and 18 appendices, or 46 stable reading units.

### Role of the Martin route

Each chapter should explain:

- the motivating problem;
- why the argument appears at this point in the book;
- the decisive concepts and equations;
- physical meaning and assumptions;
- connections to later methods and observables;
- ideas that remain standard in current research;
- later developments needed to enter modern literature;
- scope and evidence boundaries.

The route must not reproduce Martin's text, figures, or page-by-page exposition. It uses original prose, original or openly licensed diagrams, and reviewed references.

### Relationship to Foundations

```text
Foundations
= concept map, prerequisite map, reviewed learning routes

Martin Guided Reading
= motivation, sequence, argument, chapter synthesis, modern connection
```

Martin pages link to the relevant Foundations pages instead of duplicating their complete concept explanations or course inventories. A new Foundations page is created only when a crosswalk reveals a genuine missing responsibility.

### Stable source spine and modern overlay

Each chapter separates:

```text
Stable source spine
= enduring problem, argument, formalism, and physical interpretation

Modern research overlay
= later developments, current usage, unresolved limits, and dated references
```

The modern overlay carries a review date and is updated only when a development materially changes conceptual understanding, method selection, interpretation, or evidence requirements.

Historical material is retained when it explains a conceptual transition. Secondary chronology is compressed into a causal timeline. Editorial depth is determined by prerequisite necessity, current research relevance, misuse risk, and evidence maturity—not merely by age or novelty.

### Chapter responsibilities

The visible order may vary, but every chapter covers:

1. Core Question
2. Position in the Book and Field
3. Essential Narrative
4. Decisive Formalism
5. Physical Meaning and Assumptions
6. Research Relevance
7. Modern Extension
8. Limits and Open Boundaries
9. Continue: Foundations, Methods, Tools, Workflow, and Sources

This is a responsibility contract, not a decorative template. Empty headings, repeated boilerplate, progress badges, source-page markers, and authoring prompts do not appear in the public reading experience.

## Source model and routes

The stable source skeleton defines chapter order and labels. Website content uses a small manifest rather than inferring structure from extracted textbook Markdown.

Recommended identifiers:

```text
martin-ch01 ... martin-ch28
martin-app-a ... martin-app-r
```

Recommended routes:

```text
/reading/
/reading/martin/
/reading/martin/part-i/
/reading/martin/chapter-01/
/reading/martin/appendix-a/
```

Recommended internal record:

```yaml
id: martin-ch07
part: 2
chapter: 7
title: The Kohn-Sham Auxiliary System
route: /reading/martin/chapter-07/
source_edition: 2
source_year: 2020
foundations_links: []
methods_links: []
tools_links: []
workflow_links: []
modern_reviewed_at: null
```

The manifest stores order, labels, cross-links, and review metadata. It is not a general CMS and does not contain textbook text.

## Route migration

The rename is staged to protect existing links.

Phase 1:

- change the visible label from `Theory` to `Foundations`;
- change the landing title to `How Much Theory Do You Need?`;
- retain the existing `/theory/` routes;
- add `/reading/` and `/reading/martin/`.

Phase 2, after link inventory and deployment verification:

- introduce `/foundations/` as the canonical route;
- redirect `/theory/` and its topic routes;
- update internal links, sitemap, documentation, and browser-smoke coverage;
- retain redirects rather than breaking reviewed public pages.

The Martin route is not nested under `/theory/`, because the knowledge map and source-aligned narrative are separate responsibilities.

## Methods and DFT Research Workflow

Methods remains a concise conceptual comparison of method families. It does not absorb executable recipes, convergence gates, software procedures, provenance, or reproducibility packaging.

At the end of Methods, keep:

```text
Continue with practical research execution
→ DFT Research Workflow
```

Guided Reading links to Methods when a chapter introduces or compares a method family. It links to DFT Research Workflow only when the reader is ready to move from theory to a validated computational operation. Electronic Structure Atlas does not duplicate workflow operation contracts.

## Storage, copyright, and maintenance

Repository capacity is not the present constraint. Maintenance cost and binary history are the controlling concerns.

Do not commit:

- textbook PDFs;
- complete extracted textbook Markdown;
- copied textbook figures or page scans;
- bulk calculation outputs;
- videos or large binary teaching packages;
- repeated exports of the same image at multiple revisions.

Prefer static prose, native MathML, compact original SVG diagrams, and compressed WebP/PNG only when raster content is necessary. Generated figures retain their source or generation procedure. Binary replacements are minimized because Git retains historical versions.

Operating budgets:

- keep the source repository and deployed site comfortably below 100 MiB;
- keep ordinary figures below roughly 300 KiB unless scientifically justified;
- add no large dependency, client runtime, search index, CMS, or packaged font for Guided Reading;
- review modern overlays independently from stable prose so routine updates do not reopen every chapter.

These are maintenance budgets, not GitHub hard limits.

## Implementation sequence

### Stage A — information architecture

- integrate this decision into the main architecture document;
- implement the visible Foundations rename while preserving current routes;
- add a minimal Guided Reading landing page and Martin overview;
- add the 46-unit manifest without publishing empty chapter pages.

### Stage B — three gold-standard pages

Build and review:

- Chapter 1, for historical compression and causal timelines;
- Chapter 7, for central formalism, interpretation, and misuse boundaries;
- Chapter 11, for the theory-to-practical-method bridge.

These pages define the editorial and visual standard before wider expansion.

### Stage C — crosswalk

Map every Martin chapter and section to Foundations, Methods, Computational Tools, DFT Research Workflow, reviewed references, and genuine gaps. Do not create canonical pages merely to mirror the table of contents.

### Stage D — sequential build

Proceed from Chapter 1 through Chapter 28. Add appendices as just-in-time reference tools. Every unit requires source review, original writing, link validation, mathematical-rendering checks, and a bounded modern overlay.

## Non-goals

This expansion does not restore the retired legacy course site, progress system, practice layer, status fields, or interactive runtime. It does not make Martin the sole taxonomy of electronic structure, present the book as sufficient preparation for all frontier research, or convert the Atlas into a textbook-reproduction site.

The governing principle is:

> Keep Foundations as the knowledge map, use Martin to provide continuous reading, keep Methods concise, and send execution and validation to DFT Research Workflow.
