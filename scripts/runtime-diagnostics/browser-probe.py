#!/usr/bin/env python3
"""Capture a single route after a bounded settle period."""

import os
import time
from runtime_probe import collect, load, new_driver, write_report

route = os.environ.get("RUNTIME_ROUTE", "part-01-overview-and-background/chapter-03-theoretical-background/")
settle = int(os.environ.get("RUNTIME_SETTLE_SECONDS", "10"))
active = new_driver()
try:
    navigation_ms = load(active, route)
    time.sleep(settle)
    report = {"scenario": "browser-probe", "route": route, "navigationMs": navigation_ms, "sample": collect(active, route, True)}
    write_report("browser-probe.json", report)
finally:
    active.quit()
