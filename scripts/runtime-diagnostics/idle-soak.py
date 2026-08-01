#!/usr/bin/env python3
"""Idle four representative long pages concurrently for 20 minutes by default."""

import os
import time
from runtime_probe import collect, load, new_driver, write_report

ROUTES = (
    "part-01-overview-and-background/chapter-03-theoretical-background/",
    "part-01-overview-and-background/chapter-04-periodic-solids-and-electron-bands/",
    "part-05-properties-of-matter/chapter-20-response-functions-phonons-and-magnons/",
    "part-07-appendices/appendix-j-scattering-and-phase-shifts/",
)
duration = int(os.environ.get("RUNTIME_SOAK_SECONDS", "1200"))
sample_seconds = int(os.environ.get("RUNTIME_SAMPLE_SECONDS", "60"))
drivers = []
report = {"scenario": "idle", "durationSeconds": duration, "sampleSeconds": sample_seconds, "routes": {}}
try:
    for route in ROUTES:
        active = new_driver()
        drivers.append((route, active))
        report["routes"][route] = {"navigationMs": load(active, route), "samples": []}
    started = time.monotonic()
    while True:
        elapsed = time.monotonic() - started
        for route, active in drivers:
            report["routes"][route]["samples"].append(collect(active, route, force_gc=True))
        print(f"idle sample elapsed={elapsed:.1f}s", flush=True)
        if elapsed >= duration:
            break
        time.sleep(min(sample_seconds, max(0, duration - elapsed)))
    write_report("idle-soak.json", report)
finally:
    for _, active in drivers:
        active.quit()
