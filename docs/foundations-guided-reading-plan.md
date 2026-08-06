# Foundations and Guided Reading plan

Status: incorporated into the current architecture on 2026-08-06.

The original Stage-A planning document has been superseded by [`docs/architecture.md`](architecture.md), which now defines the current public hierarchy, source boundaries, route structure, and content-development order.

Current decisions include:

- `Foundations` remains the knowledge, prerequisite, relationship, and reviewed-resource map served from `/theory/` during the current migration phase.
- `Guided Reading` is organized by source type rather than placing individual authors in its root.
- Book guides live under `/reading/books/`.
- Martin's canonical route is `/reading/books/martin/`; `/reading/martin/` is compatibility-only.
- Future lecture guides will be added only after a complete reviewed route exists.
- Martin content begins with Chapter 1 and proceeds through the book in source order.
- Detailed book-writing guidance is stored in `.github/agent-guides/book-guided-reading-style.md` and is not rendered on the public website.

The earlier proposal to build Chapters 1, 7, and 11 first is no longer the active content order. Git history retains the previous plan for reference.
