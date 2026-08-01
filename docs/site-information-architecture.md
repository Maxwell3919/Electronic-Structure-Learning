# Site information architecture

The site supports seven learner-facing entries: start, learning paths, Martin theory, computational labs, case projects, interactive labs, and reference material.

`src/data/site/` is the navigation and status authority. Routes and components consume these modules instead of repeating complete lists. Existing Martin, Appendix, Sholl–Steckel, and SCF-lab URLs remain unchanged.

This layer adds structure only. New chapter text, complete software tutorials, real material results, and final visual design are separate tasks.

