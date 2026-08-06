# Foundations and Guided Reading framework implementation

Date: 2026-08-06

This document records the initial Stage-A implementation. It is a historical snapshot rather than the current route or writing authority. Current decisions are defined in `docs/architecture.md` and `.github/agent-guides/book-guided-reading-style.md`.

The initial change:

- changed the public `Theory` label to `Foundations` while retaining the established `/theory/` routes;
- changed the Foundations landing title to `How Much Theory Do You Need?`;
- added the first static Guided Reading and Martin overview pages;
- added a small source manifest for Martin's seven parts, twenty-eight chapters, and eighteen appendices;
- published no empty chapter or appendix routes;
- added no client JavaScript, new dependency, search layer, CMS, progress system, textbook PDF, extracted full text, or copied figure.

Later on the same date, Guided Reading was reorganized by source type. The canonical Martin route became `/reading/books/martin/`, with `/reading/martin/` retained only as a compatibility redirect. Book content now begins with Chapter 1 and proceeds through Martin in source order; the earlier proposal to begin with Chapters 1, 7, and 11 is no longer active.

Static and live-browser checks cover navigation, the forty-six-unit source spine, the exact page set, GitHub Pages base paths, the compatibility redirect, zero client JavaScript, narrow screens, and operation with JavaScript disabled.
