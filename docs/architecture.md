# Electronic Structure Atlas architecture

Electronic Structure Atlas is a small, static, content-first website for understanding electronic structure and entering practical research. It separates the Atlas's own continuous Core argument, prerequisite repair, source-aligned reading, conceptual method families, software context, and reviewed references.

The public information architecture is:

```text
Home
Core
Foundations
Guided Reading
Methods
Computational Tools
Reference
```

Core and Foundations are peer learning entrances. Core is the primary continuous teaching route; Foundations repairs prerequisite gaps without becoming a parent container for Core. The established `/theory/` paths remain unchanged.

The presentation implementation uses Plain Astro pages, one shared layout, and one global stylesheet. Literature metadata is a generated deployment index scanned from the Talos mirror of `Research-Workflow-Records`. A narrow loopback runtime streams the pre-indexed canonical PDF bytes and reads curated annotations from one Git-friendly JSON record per annotation in the source paper package. Those curated records are read-only in Atlas and follow `Research-Workflow-Records@main`; editable personal annotations remain in each browser's IndexedDB. It has no public annotation write API, Starlight layer, general CMS, search index, account system, user profile, social layer, Redis, CRDT, or annotation database.

Annotation changes are runtime data: GET reads the current paper-package `annotations/` directory and POST creates one validated record atomically. They do not trigger Astro reindex/build/deploy or service restart. PDF/MinerU/metadata changes remain GitHub-authoritative Records assets; after Records synchronization, those inventory changes require index regeneration and an Atlas static deployment.

## Core

Core is the Atlas's source-independent, multi-source synthesis. It follows physical and conceptual dependencies rather than a book, software workflow, or list of properties. The published opening sequence is:

```text
What Electronic Structure Explains
→ The Quantum Problem of Matter
→ Fermions, Mean Fields, and Correlation
→ Periodic Matter and Electronic States
→ Density Functional Theory
→ From Equations to Computation
→ Ground-State Properties and Structure
→ Response and Lattice Dynamics
→ Excitations and Spectra
```

The Core landing page also names advanced exits for spin and spin–orbit physics, Wannier/Berry/topological objects, stronger correlation, defects and interfaces, electron–phonon downstream theories, and finite-temperature or coupled dynamics. These are concise responsibility boundaries, not empty course routes. A branch receives a new route only when reviewed content exists. Core remains readable without leaving the sequence; links to Foundations supply optional prerequisite depth, links to Guided Reading offer a source-specific alternative, and DFT Research Workflow begins when the task becomes execution, convergence, validation, or evidence.

Core uses ordinary Astro pages, native MathML, semantic HTML figures, and small inline SVGs only when a spatial relationship cannot be explained as clearly in prose. It has no client-side quiz, progress, course registry, or copied source figure.

## Foundations

Foundations is the public name of the knowledge, prerequisite, relationship, and reviewed-resource map currently served from `/theory/`. The route remains unchanged during the first migration phase so the thirty-nine reviewed pages and existing links are not broken.

Foundations answers four questions:

```text
What knowledge may be needed?
How are the subjects connected?
Which gap is blocking the reader now?
Where can that gap be repaired?
```

It is not one mandatory curriculum. Broad prerequisite domains and focused electronic-structure topics intentionally have different levels of granularity. Readers should begin research before completing every page and return to Foundations when a specific concept becomes a real obstacle.

The central electronic-structure chain remains explicit:

```text
interacting many-electron problem
→ density-functional foundations
→ auxiliary Kohn–Sham system
→ exchange–correlation approximation
→ nonlinear self-consistent solution
→ finite numerical representation
```

Other routes branch through periodic systems, localized orbitals, chemistry, finite temperature, response, many-body theory, Berry phases, and topology. Foundations keeps those relationships visible without forcing them into a single textbook order.

All mathematical expressions use static native MathML with TeX annotations. The pages share source discipline and scientific boundaries, but their internal organization follows the needs of each subject rather than one visible template.

## Guided Reading

Guided Reading provides continuous explanations organized around a particular book or research paper. It is used when a branching knowledge map cannot supply the narrative needed to understand why one idea leads to the next.

The root is organized by source type rather than by individual author:

```text
Guided Reading
├── Books
│   ├── Martin · Electronic Structure
│   ├── Sholl & Steckel · Density Functional Theory: A Practical Introduction
│   ├── Cohen & Louie · Fundamentals of Condensed Matter Physics
│   └── Giustino · Materials Modelling Using Density Functional Theory
└── Literature
    └── Research Topic Map
        └── Literature Routes
            └── Individual Papers
```

The current canonical routes are:

```text
/reading/
/reading/books/
/reading/books/martin/
/reading/books/sholl-steckel/
/reading/books/cohen-louie/
/reading/books/giustino/
/reading/literature/
/reading/literature/structures-phase-competition/
/reading/literature/electronic-character/
/reading/literature/defects-disorder/
/reading/literature/interfaces-heterostructures/
/reading/literature/magnetism-correlation/
/reading/literature/lattice-dynamics/
/reading/literature/electron-phonon-superconductivity/
/reading/literature/polarization-response/
/reading/literature/quasiparticles-excitons/
/reading/literature/transport-scattering/
/reading/literature/quantum-geometry-topology/
/reading/literature/reliability-validation/
```

The former `/reading/martin/` route remains only as a compatibility redirect to `/reading/books/martin/`. It is not the canonical location of the Martin guide.

Books and Literature are peer source-type landings. Literature is organized as a research-question map: each topic can later gain individually planned Literature Routes, and each route can then introduce the papers that carry a necessary research move. Empty paper pages are not exposed merely to display a future plan.

### Books

A book guide preserves the source's chapter order and reasoning structure while making the explanation shorter, clearer, and more useful for present research. It does not reproduce the book, replace prerequisite courses, or turn every chapter into the same visible template.

Each completed chapter follows these principles:

- The page title uses the original chapter title.
- A one-sentence **Core Idea** states what the chapter is trying to establish.
- The body follows the source's natural sequence and is divided into as many themes as the argument requires.
- Each theme retains only the key concepts, necessary contributors, physical meaning, and decisive formulas.
- Adjacent minor sections may be merged when they form one continuous argument, but the source's causal order is not rearranged.
- Simple original diagrams are added only when they clarify development, causality, hierarchy, geometry, or the flow from one model to another.
- Repeated explanations are replaced by links to Foundations or earlier guide pages.
- Public prose avoids administrative language such as “contract,” “protocol,” “compliance,” “acceptance gate,” or “status” when describing how a reader should learn.

The guide should remain substantially shorter than the source. Its purpose is to help the reader reconstruct and understand the argument, not to preserve every derivation, citation, historical detail, or example.

### Historical material

Historical discussion is retained when it explains a conceptual transition. Secondary biography, priority disputes, institutional history, and long lists of names are compressed.

A useful historical sequence is:

```text
observation or conceptual difficulty
→ new physical idea
→ calculable formulation
→ influence on present methods
```

A timeline is appropriate when chronology itself makes the development easier to see. The timeline must still show why each step changed the physics.

### Present research depth

Age alone does not determine how much space a topic receives. More detail is given when a concept:

- is required by later chapters;
- remains part of current calculations or interpretation;
- is a direct ancestor of an active method;
- has a limited domain that researchers often misuse;
- changes how a problem is formulated, computed, validated, or interpreted.

A method that is mainly historical may still need careful explanation if modern methods inherit its central idea. A modern topic is not expanded merely because it is recent.

### Formulas

A formula is retained when it does at least one of the following:

1. defines an object used repeatedly later;
2. completes the chapter's decisive conceptual step;
3. makes an approximation or validity condition explicit;
4. connects directly to a quantity used in electronic-structure research.

Intermediate algebra, immediately recoverable mathematical steps, several equivalent forms with no added physical meaning, and formulas used only for secondary examples are normally omitted.

The surrounding prose should make clear what the expression means, why it matters physically, and under which assumptions it is valid. These explanations are integrated naturally rather than repeated under fixed labels.

### Source-aligned explanation and later developments

The source's argument is written first. Later developments are then added only when they directly change the reader's understanding of the chapter, its present use, or its limitations.

Modern material may explain:

- how the theory is used today;
- which extensions became important after the source was written;
- which interpretation is now known to require more care;
- what further literature is needed for a specialized research direction.

Source-derived explanation and later additions must remain distinguishable. A modern extension must not be written as though it appeared in the original source.

The aim is not to claim that one guide reaches every frontier. A completed route should allow the reader to locate a modern paper within the field, recognize the assumptions behind its methods, and identify the additional theory needed for that particular research problem.

### Literature

A literature guide follows the paper’s own scientific question, argument, decisive equations, figures or tables, evidence, and limits. Foundational papers distinguish what the source proved from later reformulations. Method and application papers additionally reconstruct what the authors reported about the physical model, approximation, representation, sampling, calculated objects, and post-processing without inventing unreported settings or rerunning the calculation.

Literature routes remain flat below `/reading/literature/`. Source-role labels may appear on the page, but no public disciplinary directory tree is imposed.

## Martin · Electronic Structure

Richard M. Martin's *Electronic Structure: Basic Theory and Practical Methods*, second edition, is the first book route. It remains one source-aligned reading path, not the taxonomy of the whole Atlas.

The route contains:

```text
6 main parts
28 chapters
18 appendices
46 stable reading units in total
```

The site follows Martin from Chapter 1 through Chapter 28 in order. Appendices are added when the main reading sequence first needs them. The reading unit list is stored in a small static manifest and does not contain extracted textbook text.

The chapter sequence is not given uniform depth. Historical transitions are compressed where possible; the many-electron problem, density-functional theory, Kohn–Sham theory, exchange–correlation approximations, numerical representations, response, excited states, Wannier functions, Berry phases, and topology receive the depth required by present research use and common interpretation errors.

Martin pages link back to Foundations for prerequisite repair and forward to Methods or DFT Research Workflow when the discussion reaches method selection or practical execution.

### Martin reading-page hierarchy

The Martin route uses three public reading levels. Sections inside a chapter remain part of the chapter page and do not become additional routes.

```text
Martin book page
→ Part page
→ Chapter or Appendix page
→ sections inside that page
```

The hierarchy is designed so that every level answers a different question:

```text
Book page
= What role does each Part play in the book?

Part page
= How do the chapters in this Part build one argument?

Chapter page
= What concepts, equations, assumptions, and physical conclusions does the chapter establish?
```

The three levels must not repeat the same summary at increasing length. The book page describes the role of a Part in the whole source; the Part page explains the progression among its chapters; the Chapter page carries the actual scientific explanation.

#### Martin book page

The canonical book landing page is:

```text
/reading/books/martin/
```

The source spine on this page is organized by Part rather than presented as one uninterrupted chapter list. Each Part entry contains:

- the original Part number and title;
- a concise introduction strongly aligned with Martin's description and chapter sequence;
- the main problem or conceptual transition developed in that Part;
- the chapter titles contained in the Part;
- one clear link to the Part page.

The Part introduction should explain why that Part exists and how it prepares the next stage of the book. It should not summarize each chapter in detail.

The preferred link text is specific and descriptive:

```text
Read Part I →
Read Part II →
```

Generic phrases such as `Click here`, `Read more`, or `Open` without a named destination are avoided.

#### Part pages

The canonical route pattern is:

```text
/reading/books/martin/part-i/
/reading/books/martin/part-ii/
...
/reading/books/martin/part-vii/
```

Parts I–VI cover the six main parts of the book. Part VII represents the appendices as the source spine currently groups them.

Each Part page contains:

- the original Part number and title;
- a Part-level introduction explaining its place in the book;
- a concise account of the causal or conceptual progression across the included chapters;
- one entry for every chapter in that Part;
- a source-aligned chapter summary beneath each chapter title;
- one link from each chapter entry to the completed Chapter page.

The chapter summaries on a Part page explain why each chapter appears at that point and what it contributes to the Part. They remain shorter than the Chapter page and avoid reproducing formulas or extended derivations unless a single relation is indispensable for understanding the Part-level progression.

The preferred link text names the destination:

```text
Read Chapter 1 →
Read Chapter 2 →
```

Part VII uses the same structure for appendices:

```text
Read Appendix A →
Read Appendix B →
```

Part pages may include simple previous-Part and next-Part navigation. They do not contain progress bars, completion states, reading dashboards, or empty placeholders.

#### Chapter and Appendix pages

The canonical route patterns are:

```text
/reading/books/martin/chapter-01/
/reading/books/martin/chapter-02/
...
/reading/books/martin/chapter-28/

/reading/books/martin/appendix-a/
...
/reading/books/martin/appendix-r/
```

A Chapter or Appendix page is the smallest independent reading page in the Martin guide. Its internal sections are headings within the same page. Section titles do not receive separate public routes or repeated blue links.

A Chapter page begins with the original chapter title and a one-sentence **Core Idea**, then follows the source's own reasoning through the number of themes naturally required. It applies the book-writing guidance already defined in this document and `.github/agent-guides/book-guided-reading-style.md`.

A completed Chapter page may include:

- source-aligned thematic sections;
- necessary historical compression;
- decisive formulas with physical meaning and assumptions;
- a simple original diagram when sequence, causality, hierarchy, or geometry is otherwise difficult to see;
- a clearly separated modern perspective when it directly affects present research;
- a short synthesis when it helps connect to the next chapter.

It does not add separate `Read Section` links or split the source into a page for every subsection. Previous-Chapter and next-Chapter navigation may appear at the end of the page to support continuous reading.

Appendix pages follow the same principle but retain their tool-like role. They are written when the main chapter sequence first requires them rather than being published as empty routes in advance.

#### Breadcrumbs and navigation

Public pages use breadcrumbs that reflect the actual source hierarchy:

```text
Guided Reading / Books / Martin / Part I / Chapter 1
```

The Martin book page links to Part pages. Part pages link to Chapter or Appendix pages. Chapter and Appendix pages do not create another navigational layer for internal sections.

A route is published only when its page has reviewed explanatory content. A list of future units may remain in the source manifest, but the public site does not create empty Part, Chapter, Appendix, or section pages merely to display the eventual structure.

## Internal book-writing guidance

The detailed writing guidance used by maintainers and automated agents is stored at:

```text
.github/agent-guides/book-guided-reading-style.md
```

This file is not rendered or linked from the public website. Because the project repository is public, it is still accessible to someone browsing GitHub; “internal” here means repository guidance rather than private information.

Before creating or revising a book-guide page, an agent must read that file together with `AGENTS.md`, this architecture document, the relevant source chapter, and the current page being edited.

## Methods and Computational Tools

Methods provides a concise conceptual map of method families and the scientific questions they address. It does not duplicate executable operations, convergence studies, provenance, or reproducibility procedures maintained by DFT Research Workflow.

Computational Tools keeps software commands, input semantics, programs, databases, and supporting utilities in their proper implementation context. A code tutorial does not establish the validity of a physical approximation or the reliability of a result for a new system.

Guided Reading links to Methods when a source introduces or compares a method family. It links to Computational Tools or DFT Research Workflow only when the reader is ready to move from theory to implementation.

## Reference

Reference collects books, courses, websites, repositories, and other resources only after their authorship, access, scope, role, and limitations have been reviewed. It is not a bulk link directory.

Resources used inside Foundations or Guided Reading should have a clear reason for inclusion. Popularity, institutional branding, citation count, or software availability is not sufficient by itself.

## Source and copyright boundaries

All public explanations use original prose. The repository does not store or publish:

- textbook PDFs;
- complete extracted textbook text;
- copied textbook figures or page scans;
- licensed software documentation copied in bulk;
- private notes, credentials, or restricted files;
- large raw calculation outputs or restart data.

Original diagrams are still appropriate for abstractions that have no single fixed source visual. When a page specifically discusses a real source figure, table, structure, spectrum, or calculation, a tightly cropped source-linked visual may be used when a reliable source asset is available and its figure/table identifier, page, retrieval record, hash, usage pages, and rights note are recorded in the shared media manifest. This does not assert an open licence or authorize publishing full textbook PDFs, complete extracted text, or page scans.

## Routes and source data

The established Foundations routes remain under `/theory/` during the current phase. A future move to `/foundations/` requires a complete internal-link inventory, configured redirects, sitemap updates, exact-main deployment verification, and live browser smoke.

Guided Reading uses small source-specific manifests under `src/reading/`. These manifests may record order, identifiers, titles, routes, and reviewed cross-links. They do not form a general content-management system and do not contain copied source text.

The Martin manifest is grouped beneath Books:

```text
src/reading/books/martin.ts
```

Future source manifests should follow the same hierarchy rather than accumulating unrelated sources in the Guided Reading root.

The current additional book manifests follow the same source-specific pattern:

```text
src/reading/books/sholl-steckel.ts
src/reading/books/cohen-louie.ts
src/reading/books/giustino.ts
```

## Visual and technical character

The site remains English-first, fully static, white-background, system-serif, and readable without JavaScript. It uses typographic hierarchy and white space rather than cards, dashboards, progress indicators, reading modes, or decorative interaction.

Every public behavior change must preserve:

- correct deployment-prefix paths for the Newt/Talos production route;
- keyboard navigation;
- readable 390-pixel layouts;
- no page-level horizontal overflow;
- no client JavaScript;
- native MathML with TeX annotations;
- the declared static page and build-size limits.

A successful build verifies structure and rendering only. It does not establish scientific accuracy or learning effectiveness.

## Content development

Guide content is added sequentially from the beginning of each source. For Martin, work begins with Chapter 1 and continues through the book in order. Each chapter is reviewed against the source before publication, then checked for unnecessary repetition, formula selection, historical compression, modern relevance, internal links, mathematical rendering, and copyright boundaries.

The governing editorial question is:

> Does this addition materially improve how a researcher understands, formulates, computes, validates, or interprets an electronic-structure problem?

Content that does not pass that test is shortened, linked elsewhere, or omitted.
