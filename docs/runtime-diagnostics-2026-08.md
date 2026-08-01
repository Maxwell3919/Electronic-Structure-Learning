# Runtime diagnosis · 2026-08

Baseline: website `main` at `1f3df00ba6d2b2249542c96ab989a675e04f0bbe`.
Chrome/Selenium probes ran against the production build on Talos. Raw JSON remains
an uncommitted test artifact; this file records the bounded findings.

## Reproduction result

The reported fully unresponsive tab was **not reproduced by idle time alone**.
Four representative long pages remained responsive for 20 minutes. Across each
page, forced-GC heap changed by only 22–24 KB, active listener counts did not change,
active timers and RAF stayed at zero, no new long task appeared after load, and no
console or ResizeObserver-loop error accumulated.

A severe responsiveness cost **was reproduced** when dense long pages were combined
with repeated display-mode changes:

- Chapter 3 rendered 35,499 document elements (48,892 process-visible nodes after
  load), dominated by server-rendered KaTeX markup.
- Thirty-five navigations over seven distinct routes reached a bounded plateau of
  15 process documents, 184,992 nodes, and 2,015 JS event listeners by route seven;
  those values remained stable through navigation 35. This is browser history/BFCache
  retention, not evidence of linear application-listener leakage.
- Sixty language/layout/theme cycles took 42.3 seconds and accumulated 298 new long
  tasks (23.2 seconds). The toolbar count stayed one, active listeners stayed 293,
  and active timer/RAF counts stayed zero.
- Ten SCF interaction-and-leave cycles created no active timer or RAF. Process-wide
  retained-document counters reached the same bounded history plateau.

Detached nodes are **unknown/current tool cannot directly measure them reliably**.

## Root cause and repair

The evidence narrows the failure to render-work amplification: dense KaTeX DOM,
multiple retained heavy history documents, and root-level display changes forcing
style/layout/paint work across off-screen bilingual sections. No permanent project
timer, RAF loop, or linearly accumulating mode listener was found.

The repair keeps the full static DOM and all formulas. Off-screen bilingual sections
now use `content-visibility: auto` with an intrinsic-size fallback; print restores
`content-visibility: visible`. The reading-layout controller also gained an explicit
idempotent listener guard.

With the same 60-cycle probe, elapsed time fell to 22.6 seconds and no new long task
occurred after initial load. Average navigation time fell from 815 to 431 ms for
Chapter 3, 695 to 391 ms for Chapter 4, 603 to 420 ms for Chapter 20, and 379 to
157 ms for Appendix J. SCF Lab and Theory Atlas timings were unchanged within noise.

## Boundary

This repair does not reduce the static DOM stored for a long chapter, disable browser
history, change KaTeX output, or claim that every possible user freeze is eliminated.
It removes the reproducible main-thread amplification and adds regression probes.
Future reports should retain the distinction between bounded browser retention and
an application lifecycle leak.
