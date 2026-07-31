#!/usr/bin/env python3
"""Exact-SHA Pages smoke for the completed Part I synthesis index."""

import json
import os
import shutil
import time
import urllib.request
from pathlib import Path
from urllib.parse import urljoin

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

BASE = os.environ["PAGES_URL"].rstrip("/") + "/"
EXPECTED_SHA = os.environ["DEPLOYED_SHA"]
PART_URL = urljoin(BASE, "part-01-overview-and-background/")
MANIFEST_URL = urljoin(BASE, "deployment-manifest.json")
ARTIFACT_DIR = Path(os.environ.get("SMOKE_ARTIFACT_DIR", "artifacts/pages-smoke"))
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
MARKERS = (
    "Object chain across the five chapters",
    "Handoff of notation and representations",
    "Bridge into Part II",
    "Judgment checklist after Part I",
)
CHAPTERS = (
    "chapter-01-introduction/",
    "chapter-02-overview/",
    "chapter-03-theoretical-background/",
    "chapter-04-periodic-solids-and-electron-bands/",
    "chapter-05-uniform-electron-gas-and-sp-bonded-metals/",
)


def manifest():
    last = None
    for _ in range(30):
        try:
            request = urllib.request.Request(MANIFEST_URL, headers={"User-Agent": "ESL-Part01-Smoke/1"})
            with urllib.request.urlopen(request, timeout=20) as response:
                payload = json.load(response)
            if payload.get("sha") == EXPECTED_SHA:
                return payload
            last = f"stale manifest {payload.get('sha')}"
        except Exception as exc:
            last = str(exc)
        time.sleep(5)
    raise AssertionError(last)


def options(javascript, width, height):
    result = webdriver.ChromeOptions()
    for item in (
        "--headless=new", "--no-sandbox", "--disable-dev-shm-usage",
        "--disable-gpu", f"--window-size={width},{height}",
        "--force-device-scale-factor=1", "--lang=en-GB",
    ):
        result.add_argument(item)
    browser = os.environ.get("CHROME_BIN")
    if not browser:
        for candidate in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser"):
            browser = shutil.which(candidate)
            if browser:
                break
    if browser:
        result.binary_location = browser
    if not javascript:
        result.add_experimental_option("prefs", {"profile.managed_default_content_settings.javascript": 2})
    return result


def columns(driver, element):
    value = driver.execute_script("return getComputedStyle(arguments[0]).gridTemplateColumns", element)
    return len([item for item in str(value).split() if item])


def inspect(driver, expected_columns):
    WebDriverWait(driver, 20).until(lambda active: MARKERS[0] in active.page_source)
    assert "Part I" in driver.title
    for marker in MARKERS:
        assert marker in driver.page_source, marker
    grids = driver.find_elements(By.CSS_SELECTOR, ".bilingual-section__grid")
    assert len(grids) == 5
    assert all(item.is_displayed() for item in grids)
    observed_columns = [columns(driver, item) for item in grids]
    assert observed_columns == [expected_columns] * 5, observed_columns
    hrefs = [item.get_attribute("href") or "" for item in driver.find_elements(By.CSS_SELECTOR, "a[href]")]
    counts = {}
    for chapter in CHAPTERS:
        matches = [href for href in hrefs if chapter in href]
        assert len(matches) >= 2, (chapter, matches)
        assert all("/Electronic-Structure-Learning/" in href for href in matches)
        counts[chapter] = len(matches)
    chains = driver.find_elements(By.CSS_SELECTOR, "pre code")
    assert len(chains) == 2 and all(item.is_displayed() for item in chains)
    overflow = float(driver.execute_script("return document.documentElement.scrollWidth-window.innerWidth"))
    return {
        "title": driver.title,
        "bilingual_sections": len(grids),
        "grid_columns": observed_columns,
        "chapter_link_counts": counts,
        "object_chains": len(chains),
        "horizontal_overflow_px": overflow,
    }


def browser_checks(javascript, report_key):
    driver = webdriver.Chrome(options=options(javascript, 1440 if javascript else 1280, 1200 if javascript else 1000))
    try:
        driver.get(PART_URL)
        report = inspect(driver, 2)
        driver.save_screenshot(str(ARTIFACT_DIR / f"part-01-index-{report_key}.png"))
        if javascript:
            driver.set_window_size(390, 844)
            driver.refresh()
            narrow = inspect(driver, 1)
            assert narrow["horizontal_overflow_px"] <= 1, narrow
            narrow["viewport"] = [390, 844]
            driver.save_screenshot(str(ARTIFACT_DIR / "part-01-index-narrow.png"))
            return {"desktop": report, "narrow": narrow}
        return {"no_javascript": report}
    finally:
        driver.quit()


def main():
    deployed = manifest()
    assert deployed.get("repository") == "Maxwell3919/Electronic-Structure-Learning"
    assert deployed.get("workflow") == "Deploy to GitHub Pages"
    report = {"manifest": deployed, "part_url": PART_URL}
    report.update(browser_checks(True, "desktop"))
    report.update(browser_checks(False, "no-javascript"))
    (ARTIFACT_DIR / "part01-index-report.json").write_text(
        json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    print(json.dumps(report, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
