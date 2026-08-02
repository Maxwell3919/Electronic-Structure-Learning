# Electronic Structure Atlas architecture

Electronic Structure Atlas is a small, static, content-first website. Its public information architecture has five entries:

```text
Home
Theory
Methods
Computational Tools
Reference
```

The implementation uses Plain Astro pages, one shared layout, and one global stylesheet. It has no Starlight layer, content registry, search index, client hydration, packaged fonts, interactive runtime, backend, account system, or database.

Theory will eventually connect mathematical, physical, chemical, and electronic-structure foundations. Its Learning Map remains a short textual responsibility until individual relationships have been reviewed. Methods discusses scientific methods rather than paper-reading records. Computational Tools keeps commands and file semantics inside their software and program context. Reference accepts resources only after source, license, scope, and recommendation reasons are checked.

The site defaults to English and system serif fonts. Pages use white space and typographic hierarchy rather than cards, dashboards, reading modes, status badges, or decorative interaction.

The former Martin course, Sholl–Steckel cross-reference, learning paths, labs, cases, literature layer, interactive components, and their validation system are not part of the current build. They remain recoverable from Git history and the tag documented in `docs/legacy-site.md`; their former URLs are intentionally unsupported.

Future content is added manually, one reviewed responsibility at a time. A successful build or browser smoke verifies only the declared structural and runtime behavior, not scientific acceptance or learning effectiveness.
