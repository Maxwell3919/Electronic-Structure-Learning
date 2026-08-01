#!/usr/bin/env python3
"""Short live acceptance for navigation and mode-controller stability."""

import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "runtime-diagnostics"))
from runtime_probe import collect, load, new_driver  # noqa: E402

routes = (
    "part-01-overview-and-background/chapter-03-theoretical-background/",
    "part-01-overview-and-background/chapter-04-periodic-solids-and-electron-bands/",
    "labs/scf-fixed-point-and-mixing/",
    "theory/atlas/",
)
active = new_driver(1920, 1080)
samples = []
try:
    for index in range(12):
        route = routes[index % len(routes)]
        load(active, route)
        sample = collect(active, route, force_gc=True)
        samples.append(sample)
        probe = sample["probe"]
        if probe["activeRaf"] != 0 or probe["activeIntervals"] != 0 or probe["activeTimeouts"] != 0:
            raise AssertionError(f"non-idle lifecycle state on {route}: {probe}")
        if probe["toolbarCount"] != 1:
            raise AssertionError(f"reading toolbar duplicated on {route}")

    load(active, routes[0])
    baseline = collect(active, routes[0], force_gc=True)
    for _ in range(10):
        for selector in (
            "[data-bilingual-mode='parallel']", "[data-bilingual-mode='zh']", "[data-bilingual-mode='en']",
            "[data-reading-mode='focus']", "[data-reading-mode='parallel']", "[data-reading-mode='atlas']",
        ):
            active.find_element("css selector", selector).click()
    final = collect(active, routes[0], force_gc=True)
    for field in ("activeListeners", "activeRaf", "activeTimeouts", "activeIntervals"):
        if final["probe"][field] != baseline["probe"][field]:
            raise AssertionError(f"{field} changed across mode toggles")
    if final["probe"]["toolbarCount"] != 1:
        raise AssertionError("reading toolbar duplicated during mode toggles")

    output = Path(os.environ.get("SMOKE_ARTIFACT_DIR", "artifacts/pages-smoke"))
    output.mkdir(parents=True, exist_ok=True)
    (output / "runtime-soak.json").write_text(json.dumps({
        "routes": len(samples),
        "baseline": baseline,
        "final": final,
        "detachedNodes": "unknown-current-tool",
    }, indent=2) + "\n", encoding="utf-8")
    print("Runtime soak smoke passed: 12 navigations and 10 mode cycles.")
finally:
    active.quit()
