# Runtime performance contract

The site is static by default. A long theory page may contain a large server-rendered
KaTeX tree, but an idle page must not perform continuous application work.

## Required lifecycle

- Initialization is idempotent: a component does not duplicate controls, listeners,
  observers, timers, or animation loops.
- A timer, observer, global listener, or animation frame has an explicit owner and
  cleanup path. Prefer local listeners and `AbortController` for shared ownership.
- Idle means idle: no polling, permanent RAF, repeated layout scan, or off-screen
  redraw is allowed without a documented exception.
- Long bilingual sections retain complete static HTML but may use standards-based
  rendering containment while off screen. Print always restores full rendering.
- Runtime instrumentation is test-only, stores no user input, sends no telemetry,
  and is excluded from production source and bundles.

## Acceptance

Local acceptance uses a 20-minute idle soak, 35 route navigations, at least 50 mode
cycles, and ten SCF interaction-and-leave cycles. CI and live Pages use a shorter
sentinel; it does not replace the full local soak. Reports distinguish current-page
counters from process-wide Chrome counters and do not call BFCache retention a leak
unless growth remains unbounded after the route set stabilizes.

Detached-node counts are `unknown-current-tool` until a reliable measurement is
available. File presence, a static validator, or a successful build alone does not
establish runtime stability.
