#!/usr/bin/env python3
"""Operate the SCF controls, leave the page, and repeat ten times."""

import os
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from runtime_probe import collect, load, new_driver, write_report

lab = "labs/scf-fixed-point-and-mixing/"
chapter = "part-01-overview-and-background/chapter-03-theoretical-background/"
cycles = int(os.environ.get("RUNTIME_INTERACTION_CYCLES", "10"))
active = new_driver()
samples = []
try:
    for index in range(cycles):
        load(active, lab)
        for preset in ("stable", "oscillatory", "divergent"):
            active.find_element(By.CSS_SELECTOR, f"[data-preset='{preset}']").click()
        slider = active.find_element(By.CSS_SELECTOR, "[data-slope]")
        slider.send_keys(Keys.ARROW_RIGHT, Keys.ARROW_LEFT)
        lab_sample = collect(active, lab, True)
        load(active, chapter)
        chapter_sample = collect(active, chapter, True)
        samples.append({"cycle": index + 1, "lab": lab_sample, "afterLeave": chapter_sample})
        print(f"interaction cycle {index + 1}/{cycles}", flush=True)
    write_report("interaction-soak.json", {"scenario": "interaction", "cycles": cycles, "samples": samples})
finally:
    active.quit()
