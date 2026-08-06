# Electronic Structure Atlas architecture

Electronic Structure Atlas is a small, static, content-first website for understanding electronic structure and entering practical research. It separates the knowledge a reader may need, continuous reading routes through important sources, conceptual method families, software context, and reviewed references.

The public information architecture is:

```text
Home
Foundations
Guided Reading
Methods
Computational Tools
Reference
```

The implementation uses Plain Astro pages, one shared layout, and one global stylesheet. It has no Starlight layer, general content registry, search index, client hydration, packaged fonts, interactive runtime, backend, account system, or database.

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

Guided Reading provides continuous explanations organized around a particular book, lecture series, or other coherent source. It is used when a branching knowledge map cannot supply the narrative needed to understand why one idea leads to the next.

The root is organized by source type rather than by individual author:

```text
Guided Reading
├── Books
│   └── Martin · Electronic Structure
└── Lectures
    └── added only when a complete reviewed route exists
```

The current canonical routes are:

```text
/reading/
/reading/books/
/reading/books/martin/
```

The former `/reading/martin/` route remains only as a compatibility redirect to `/reading/books/martin/`. It is not the canonical location of the Martin guide.

A Lectures landing page is not published until at least one lecture route has enough reviewed content to justify it. Empty categories and empty chapter pages are not exposed merely to display a future plan.

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

### Lectures

A lecture guide follows the same source-fidelity and modern-context principles, but its structure is based on the actual lecture sequence rather than being forced into book chapters. A lecture route may combine adjacent sessions when they form one argument and should link to the corresponding Foundations and book-guide pages instead of repeating them.

Lecture routes are added only after the source, access, authorship, sequence, and technical scope have been reviewed.

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

Original diagrams are preferred. Openly licensed external figures may be used only when the license, source, and purpose are recorded. Textbook extraction may be used privately as a reading aid, but it is not public site content or route authority.

## Routes and source data

The established Foundations routes remain under `/theory/` during the current phase. A future move to `/foundations/` requires a complete internal-link inventory, configured redirects, sitemap updates, exact-main deployment verification, and live browser smoke.

Guided Reading uses small source-specific manifests under `src/reading/`. These manifests may record order, identifiers, titles, routes, and reviewed cross-links. They do not form a general content-management system and do not contain copied source text.

The Martin manifest is grouped beneath Books:

```text
src/reading/books/martin.ts
```

Future source manifests should follow the same hierarchy rather than accumulating unrelated sources in the Guided Reading root.

## Visual and technical character

The site remains English-first, fully static, white-background, system-serif, and readable without JavaScript. It uses typographic hierarchy and white space rather than cards, dashboards, progress indicators, reading modes, or decorative interaction.

Every public behavior change must preserve:

- correct GitHub Pages base paths;
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
