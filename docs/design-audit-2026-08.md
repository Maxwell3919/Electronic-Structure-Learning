# Visual-system audit · 2026-08

Baseline: website `main` at `029f038c86208543389a5ff9cd856b3bc9b78752`.
The audit covered the home and start pages, three learning paths, theory, labs,
cases, interactive labs, reference, Part I, Chapters 3 and 4, Appendix J, and
the SCF fixed-point lab. Local benchmark clones were inspected only for public
documentation structure; no project was run and no asset was copied.

## Route observations

| Page type | Sample | Main observation |
| --- | --- | --- |
| Home | `/` | Clear registry-driven order, but the hero repeats Starlight's H1 and eight equal cards flatten hierarchy. |
| Start | `/start-here/` | Status and paths are useful but look like adjacent bordered modules rather than a guided first decision. |
| Learning path | three routes | Milestones are complete without JavaScript; audience, prerequisites, and sequence need a stronger course rhythm and optional local progress. |
| Theory index | `/theory/` | Eight equal cards obscure the distinction between the full map, Parts, and Appendices. |
| Lab/case catalogs | `/labs/`, `/cases/` | Planned boundaries are explicit; repeated cards make the catalogs feel finished although no lesson or case body exists. |
| Interactive index | `/interactive-labs/` | The SCF link is usable but does not yet communicate the interaction sequence or static fallback contract. |
| Reference | `/reference/` | The restrained scope is appropriate; available and planned items need clearer semantic states. |
| Part cover | Part I | Strong bilingual object chain, but no reusable Part cover and several inline layout styles remain. |
| Theory chapter | Chapter 3 | Long bilingual reading is structurally sound; source, derivation, figure, and evidence surfaces share too much card styling. |
| Formula-heavy chapter | Chapter 4 | Formula/table containment works, while wide scientific figures remain constrained to the normal reading column. |
| Appendix | Appendix J | Correctly restrained, but visually indistinguishable from a full theory chapter. |
| Lab | SCF fixed point | The model and `aria-live` readouts are solid; controls, readouts, figure, boundary, and motion controls need a common interaction shell. |

## System findings

| Dimension | Baseline observation | Design-system response |
| --- | --- | --- |
| Information hierarchy | Framework pages render two H1 elements and most destinations receive equal visual weight. | One editorial page hero per framework page; distinguish primary routes, indexes, and secondary references. |
| Reading width | Rendered content is about 777 px at 1440 px; wide figures cannot intentionally break out. | Keep a 46–48 rem reading column and add bounded 72 rem and 88 rem breakout regions. |
| Headings | Starlight and custom heroes compete; many component headings are uniformly bold. | Serif display hierarchy for covers; readable sans-serif body; moderated H2/H3 weight. |
| Bilingual load | Substantive pages may contain 20–30 paired sections; desktop two-column display is dense. | Add `parallel`, `zh`, and `en` modes; no-JS, print, and reader defaults retain both languages. |
| Card density | Home has eight equal cards; theory, labs, cases, and reference repeat bordered surfaces. | Cards remain for routes and milestones; ordinary prose, definitions, derivations, and evidence use rules or side marks. |
| Color | Most shared styles proxy Starlight variables; warnings, evidence, and validation lack a stable project palette. | Introduce paper/ink, indigo, science teal, amber, and failure red semantic tokens with light/dark mappings. |
| Buttons and links | Native controls are keyboard reachable; focus and touch sizing are mostly inherited. | Centralize focus rings, button/link states, minimum target sizing, and form styling. |
| Formulae | KaTeX renders correctly and long displays scroll locally. | Preserve local scrolling and add reading-layout containment; never use color alone for formula status. |
| Figures | Scientific SVGs are responsive but captions, readouts, and evidence boundaries vary by chapter. | Shared wide figure, caption, source, assumption, and evidence components; preserve chapter-specific data encoding. |
| Mobile | The sampled 390 px routes have no page-level overflow. | Preserve single-column fallbacks; margin notes become adjacent blocks and wide regions remain viewport-bounded. |
| Dark mode | Starlight supplies a working theme, but project surfaces have no coherent dark palette. | Define explicit AA-oriented light/dark project tokens and map compatibility variables. |
| No JavaScript | Navigation and bilingual content remain present; interactives retain explanatory prose but some generated tables need JavaScript. | Keep complete static explanations and diagrams; controls enhance rather than gate understanding. |
| Motion | Existing motion is incidental and there is no common pause or reduced-motion contract. | Centralize restrained transitions, `prefers-reduced-motion`, and an explicit motion control for interaction shells. |
| Accessibility | Semantic links, labels, SVG descriptions, and live regions exist; page H1 duplication and color semantics need correction. | Enforce one visible H1, labelled modes/controls, visible focus, text labels, language attributes, and contrast checks. |
| CSS fragmentation | 190 Astro files contain style blocks; three chapter CSS files and repeated body containment rules coexist. | Move high-value layout, typography, surface, figure, and interaction rules into shared layers without mass chapter rewrites. |
| Reuse | Site components are data-driven but visually neutral; chapter wrappers repeat containment CSS. | Add explicit Home, Learning, Theory, Lab/Case, Appendix/Reference contracts and compatibility classes. |

## Baseline measurements

- production build: 79 pages, `33,527,461` bytes in `dist/`;
- largest emitted file: Chapter 3 HTML, `1,389,295` bytes;
- shared/component audit: 190 Astro style blocks, 5 files with inline style
  attributes, 33 hard-coded color literals, and 3 chapter-specific CSS files;
- sampled desktop and 390 px pages: no page-level horizontal overflow;
- current framework pages: two main H1 elements; representative substantive
  Chapter, Appendix, and SCF pages: one main H1.

The redesign will not erase chapter-specific scientific drawing rules in one
pass. It targets shared surfaces, repeated containment, page hierarchy,
bilingual presentation, and representative routes while retaining existing
scientific behavior and validation registrations.

## Reading-layout defect recorded after launch

Atlas and Parallel currently using the same presentation canvas is a design defect
or unfinished implementation. The names promise different reading behavior; identical
computed width, content flow, and visual hierarchy add a meaningless control and
cognitive load. Parallel must serve bilingual prose comparison. Atlas must expose a
wider visual surface while constraining ordinary prose, and must be unavailable on
pages without atlas-capable content. This correction belongs to the reader-interface
PR and does not reopen the Editorial Quantum Atlas brand system.
