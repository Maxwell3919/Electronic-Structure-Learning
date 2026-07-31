#!/usr/bin/env python3
"""Live GitHub Pages smoke test for the completed Martin Part II index."""

from __future__ import annotations

import json
import os
import shutil
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urljoin

from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.ui import WebDriverWait


ARTIFACT_DIR = Path(os.environ.get("SMOKE_ARTIFACT_DIR", "artifacts/pages-smoke"))
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
BASE_URL = os.environ["PAGES_URL"].rstrip("/") + "/"
EXPECTED_SHA = os.environ["DEPLOYED_SHA"]
PART_PATH = "part-02-density-functional-theory/"
PART_URL = urljoin(BASE_URL, PART_PATH)
MANIFEST_URL = urljoin(BASE_URL, "deployment-manifest.json")

EXPECTED_MARKERS = (
    "Cross-chapter object chain",
    "Notation and evidence handoff",
    "Reading order for choosing an approximation",
    "Judgment checklist after Part II",
)
EXPECTED_CHAPTER_PATHS = (
    "chapter-06-density-functional-theory-foundations/",
    "chapter-07-the-kohn-sham-auxiliary-system/",
    "chapter-08-functionals-for-exchange-and-correlation-i/",
    "chapter-09-functionals-for-exchange-and-correlation-ii/",
)


def fail(message: str) -> None:
    raise AssertionError(message)


def fetch_current_manifest(attempts: int = 30, delay: float = 5.0) -> dict:
    last_error: Exception | None = None
    for _ in range(attempts):
        try:
            request = urllib.request.Request(
                MANIFEST_URL,
                headers={"User-Agent": "Electronic-Structure-Learning-Part02-Index-Smoke/1"},
            )
            with urllib.request.urlopen(request, timeout=20) as response:
                if response.status != 200:
                    fail(f"Expected HTTP 200 for manifest, received {response.status}")
                payload = json.load(response)
            if payload.get("sha") == EXPECTED_SHA:
                return payload
            last_error = AssertionError(
                f"Deployment manifest is stale: expected {EXPECTED_SHA}, received {payload.get('sha')}"
            )
        except (OSError, ValueError, urllib.error.URLError, AssertionError) as exc:
            last_error = exc
        time.sleep(delay)
    raise AssertionError(f"Could not obtain current deployment manifest: {last_error}")


def chrome_options(*, javascript: bool, width: int, height: int) -> webdriver.ChromeOptions:
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument(f"--window-size={width},{height}")
    options.add_argument("--force-device-scale-factor=1")
    options.add_argument("--lang=en-GB")

    browser = os.environ.get("CHROME_BIN")
    if not browser:
        for candidate in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser"):
            browser = shutil.which(candidate)
            if browser:
                break
    if browser:
        options.binary_location = browser
    if not javascript:
        options.add_experimental_option(
            "prefs",
            {"profile.managed_default_content_settings.javascript": 2},
        )
    return options


def new_driver(*, javascript: bool, width: int, height: int) -> webdriver.Chrome:
    try:
        driver = webdriver.Chrome(options=chrome_options(javascript=javascript, width=width, height=height))
    except WebDriverException as exc:
        raise AssertionError(f"Unable to start Chrome WebDriver: {exc}") from exc
    driver.set_page_load_timeout(45)
    return driver


def load_with_retry(driver: webdriver.Chrome, url: str, marker: str, attempts: int = 12) -> None:
    last_error: Exception | None = None
    for _ in range(attempts):
        try:
            driver.get(url)
            WebDriverWait(driver, 20).until(lambda active: marker in active.page_source)
            return
        except Exception as exc:
            last_error = exc
            time.sleep(5)
    raise AssertionError(f"Could not load current page {url}: {last_error}")


def grid_column_count(driver: webdriver.Chrome, element: WebElement) -> int:
    value = driver.execute_script(
        "return window.getComputedStyle(arguments[0]).gridTemplateColumns;",
        element,
    )
    return len([item for item in str(value).split() if item])


def save_failure_screenshot(driver: webdriver.Chrome, filename: str) -> None:
    try:
        driver.save_screenshot(str(ARTIFACT_DIR / filename))
    except Exception:
        pass


def inspect_index(driver: webdriver.Chrome, *, expected_columns: int) -> dict:
    if "Part II" not in driver.title:
        fail(f"Unexpected Part II page title: {driver.title}")

    for marker in EXPECTED_MARKERS:
        if marker not in driver.page_source:
            fail(f"Part II synthesis marker is missing: {marker}")

    grids = driver.find_elements(By.CSS_SELECTOR, ".bilingual-section__grid")
    if len(grids) != 5:
        fail(f"Expected five Part II bilingual sections, received {len(grids)}")
    if not all(item.is_displayed() for item in grids):
        fail("A Part II bilingual synthesis section is hidden")

    columns = [grid_column_count(driver, item) for item in grids]
    if columns != [expected_columns] * len(grids):
        fail(f"Unexpected Part II bilingual grid columns: {columns}")

    anchors = driver.find_elements(By.CSS_SELECTOR, "a[href]")
    hrefs = [item.get_attribute("href") or "" for item in anchors]
    chapter_link_counts: dict[str, int] = {}
    for chapter_path in EXPECTED_CHAPTER_PATHS:
        matches = [href for href in hrefs if chapter_path in href]
        if len(matches) < 2:
            fail(f"Expected bilingual direct links to {chapter_path}, received {len(matches)}")
        if not all("/Electronic-Structure-Learning/" in href for href in matches):
            fail(f"A Part II chapter link escaped the Pages base path: {matches}")
        chapter_link_counts[chapter_path] = len(matches)

    object_chains = driver.find_elements(By.CSS_SELECTOR, "pre code")
    if len(object_chains) != 2 or not all(item.is_displayed() for item in object_chains):
        fail("Part II should retain two visible bilingual static object chains")

    overflow = float(
        driver.execute_script(
            "return document.documentElement.scrollWidth - window.innerWidth;"
        )
    )

    return {
        "title": driver.title,
        "bilingual_sections": len(grids),
        "grid_columns": columns,
        "chapter_link_counts": chapter_link_counts,
        "object_chains": len(object_chains),
        "horizontal_overflow_px": overflow,
    }


def desktop_and_narrow_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=1440, height=1200)
    try:
        load_with_retry(driver, PART_URL, EXPECTED_MARKERS[0])
        report["desktop"] = inspect_index(driver, expected_columns=2)
        driver.save_screenshot(str(ARTIFACT_DIR / "part-02-index-synthesis-desktop.png"))

        driver.set_window_size(390, 844)
        driver.refresh()
        WebDriverWait(driver, 20).until(
            lambda active: EXPECTED_MARKERS[-1] in active.page_source
        )
        narrow = inspect_index(driver, expected_columns=1)
        if narrow["horizontal_overflow_px"] > 1:
            fail(
                "Part II synthesis overflows the 390px viewport by "
                f"{narrow['horizontal_overflow_px']}px"
            )
        narrow["viewport"] = [390, 844]
        report["narrow"] = narrow
        driver.save_screenshot(str(ARTIFACT_DIR / "part-02-index-synthesis-narrow.png"))
    except Exception:
        save_failure_screenshot(driver, "part-02-index-synthesis-browser-failure.png")
        raise
    finally:
        driver.quit()


def no_javascript_smoke(report: dict) -> None:
    driver = new_driver(javascript=False, width=1280, height=1000)
    try:
        load_with_retry(driver, PART_URL, EXPECTED_MARKERS[0])
        report["no_javascript"] = inspect_index(driver, expected_columns=2)
        driver.save_screenshot(str(ARTIFACT_DIR / "part-02-index-synthesis-no-javascript.png"))
    except Exception:
        save_failure_screenshot(driver, "part-02-index-synthesis-no-javascript-failure.png")
        raise
    finally:
        driver.quit()


def main() -> int:
    manifest = fetch_current_manifest()
    if manifest.get("repository") != "Maxwell3919/Electronic-Structure-Learning":
        fail(f"Unexpected manifest repository: {manifest.get('repository')}")
    if manifest.get("workflow") != "Deploy to GitHub Pages":
        fail(f"Unexpected deployment workflow: {manifest.get('workflow')}")

    report: dict = {
        "base_url": BASE_URL,
        "part_url": PART_URL,
        "manifest_url": MANIFEST_URL,
        "manifest": manifest,
        "expected_markers": list(EXPECTED_MARKERS),
    }
    desktop_and_narrow_smoke(report)
    no_javascript_smoke(report)

    report_path = ARTIFACT_DIR / "part02-index-report.json"
    report_path.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        failure = {
            "base_url": BASE_URL,
            "part_url": PART_URL,
            "manifest_url": MANIFEST_URL,
            "expected_sha": EXPECTED_SHA,
            "error_type": type(exc).__name__,
            "error": str(exc),
        }
        (ARTIFACT_DIR / "part02-index-failure.json").write_text(
            json.dumps(failure, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        print(f"Part II index Pages smoke test failed: {exc}", file=sys.stderr)
        raise
