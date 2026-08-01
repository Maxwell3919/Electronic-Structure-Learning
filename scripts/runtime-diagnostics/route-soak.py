#!/usr/bin/env python3
"""Cycle seven routes at least 35 times and force GC after each navigation."""

import os
from runtime_probe import collect, load, new_driver, write_report

ROUTES = (
    "part-01-overview-and-background/chapter-03-theoretical-background/",
    "part-01-overview-and-background/chapter-04-periodic-solids-and-electron-bands/",
    "part-02-density-functional-theory/chapter-07-the-kohn-sham-auxiliary-system/",
    "part-05-properties-of-matter/chapter-20-response-functions-phonons-and-magnons/",
    "part-07-appendices/appendix-j-scattering-and-phase-shifts/",
    "labs/scf-fixed-point-and-mixing/", "theory/atlas/",
)
iterations = int(os.environ.get("RUNTIME_ROUTE_ITERATIONS", "35"))
active = new_driver()
samples = []
try:
    for index in range(iterations):
        route = ROUTES[index % len(ROUTES)]
        navigation_ms = load(active, route)
        sample = collect(active, route, force_gc=True)
        sample.update({"index": index + 1, "navigationMs": navigation_ms})
        samples.append(sample)
        print(f"route {index + 1}/{iterations} {route} {navigation_ms:.0f}ms", flush=True)
        if sample["probe"] and sample["probe"]["toolbarCount"] > 1:
            raise AssertionError(f"duplicate reading toolbar at iteration {index + 1}")
    write_report("route-soak.json", {"scenario": "routes", "iterations": iterations, "samples": samples})
finally:
    active.quit()
