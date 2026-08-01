#!/usr/bin/env python3
"""Repeat language, reading-width, and theme controls 60 times by default."""

import os
import time
from selenium.webdriver.common.by import By
from runtime_probe import collect, load, new_driver, write_report

route = "part-01-overview-and-background/chapter-03-theoretical-background/"
cycles = int(os.environ.get("RUNTIME_MODE_CYCLES", "60"))
active = new_driver(2560, 1440)
samples = []
try:
    load(active, route)
    baseline = collect(active, route, True)
    started = time.perf_counter()
    for index in range(cycles):
        for mode in ("parallel", "zh", "en"):
            active.find_element(By.CSS_SELECTOR, f"[data-bilingual-mode='{mode}']").click()
        for mode in ("focus", "parallel", "atlas"):
            active.find_element(By.CSS_SELECTOR, f"[data-reading-mode='{mode}']").click()
        active.execute_script("document.documentElement.dataset.theme = arguments[0]", "dark" if index % 2 else "light")
        if (index + 1) % 10 == 0:
            sample = collect(active, route, True); sample["cycle"] = index + 1; samples.append(sample)
            print(f"mode cycle {index + 1}/{cycles}", flush=True)
    elapsed_ms = (time.perf_counter() - started) * 1000
    final = collect(active, route, True)
    write_report("mode-toggle-soak.json", {"scenario": "modes", "cycles": cycles, "baseline": baseline, "samples": samples, "final": final, "elapsedMs": elapsed_ms})
finally:
    active.quit()
