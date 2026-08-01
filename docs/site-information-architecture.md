# Site information architecture

The site supports seven learner-facing entries: start, learning paths, Martin theory, computational labs, case projects, interactive labs, and reference material.

`src/data/site/` is the navigation and status authority. Routes and components consume these modules instead of repeating complete lists. Existing Martin, Appendix, Sholl–Steckel, and SCF-lab URLs remain unchanged.

This layer adds structure only. New chapter text, complete software tutorials, real material results, and final visual design are separate tasks.

Theory navigation exposes Part I–VII and keeps inactive Part groups collapsed. `/theory/atlas/` is the complete, searchable flat inventory for 28 Chapters and 18 Appendices; it replaces permanent expansion of all unit links in the left rail.

The independent `/literature/` layer contains topics, reading queue, claim ledger, and discussions routes. It is an infrastructure boundary, not a completed paper database, and does not alter existing Martin, Appendix, practice, or Lab URLs.
