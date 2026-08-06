# Foundations and Guided Reading framework implementation

Date: 2026-08-06

This change implements Stage A of `docs/foundations-guided-reading-plan.md`.

- The public `Theory` label becomes `Foundations` while the established `/theory/` routes remain unchanged.
- The Foundations landing title becomes `How Much Theory Do You Need?` and links onward to structured reading.
- `/reading/` and `/reading/martin/` are added as real static entrances.
- A small source manifest records Martin's seven parts, twenty-eight chapters, and eighteen appendices.
- No empty chapter or appendix routes are published.
- No client JavaScript, new dependency, search layer, CMS, progress system, textbook PDF, extracted full text, or copied figure is added.
- Chapters 1, 7, and 11 remain the first planned full reading pages.

The browser and build contracts are extended to cover the new navigation, two routes, forty-six-unit source spine, exact static page set, GitHub Pages base path, zero client JavaScript, narrow screens, and no-JavaScript operation.
