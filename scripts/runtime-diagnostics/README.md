# Runtime diagnostics

These Selenium/CDP probes are test-only. They inject counters before page scripts run and never enter the production bundle or transmit data.

```bash
PAGES_URL=http://127.0.0.1:4321/Electronic-Structure-Learning/ \
  .venv-pages-smoke/bin/python scripts/runtime-diagnostics/route-soak.py
```

Scenarios:

- `idle-soak.py`: four long pages, 20 minutes by default;
- `route-soak.py`: 35 full navigations across seven representative routes;
- `mode-toggle-soak.py`: 60 language/layout/theme cycles;
- `interaction-soak.py`: 10 SCF interaction-and-leave cycles;
- `browser-probe.py`: one bounded route snapshot;
- `summarize-runtime-evidence.mjs`: compact JSON summary.

Environment controls are `RUNTIME_SOAK_SECONDS`, `RUNTIME_SAMPLE_SECONDS`, `RUNTIME_ROUTE_ITERATIONS`, `RUNTIME_MODE_CYCLES`, `RUNTIME_INTERACTION_CYCLES`, and `RUNTIME_EVIDENCE_DIR`. Raw evidence belongs in CI artifacts; only compact summaries belong in Git.

`Performance.getMetrics`, `Memory.getDOMCounters`, `Runtime.getHeapUsage`, and the injected lifecycle counters are recorded. Detached nodes are reported as `unknown-current-tool` because this setup does not expose a reliable detached-node count without retaining inspection references.
