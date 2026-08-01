#!/usr/bin/env python3
"""Live GitHub Pages smoke test for Martin Part VII Appendix J."""

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
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.ui import WebDriverWait

ARTIFACT_DIR = Path(os.environ.get("SMOKE_ARTIFACT_DIR", "artifacts/pages-smoke"))
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
BASE_URL = os.environ["PAGES_URL"].rstrip("/") + "/"
EXPECTED_SHA = os.environ["DEPLOYED_SHA"]
PART_PATH = "part-07-appendices/"
APPENDIX_PATH = PART_PATH + "appendix-j-scattering-and-phase-shifts/"
PART_URL = urljoin(BASE_URL, PART_PATH)
APPENDIX_URL = urljoin(BASE_URL, APPENDIX_PATH)
MANIFEST_URL = urljoin(BASE_URL, "deployment-manifest.json")


def fail(message: str) -> None:
    raise AssertionError(message)


def fetch_current_manifest(attempts: int = 30, delay: float = 5.0) -> dict:
    last_error: Exception | None = None
    for _ in range(attempts):
        try:
            request = urllib.request.Request(
                MANIFEST_URL,
                headers={"User-Agent": "Electronic-Structure-Learning-Part07-AppJ-Smoke/1"},
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


def focus_for_keyboard(driver: webdriver.Chrome, element: WebElement) -> None:
    driver.execute_script(
        """
        arguments[0].scrollIntoView({block: 'center', inline: 'nearest'});
        arguments[0].focus({preventScroll: true});
        """,
        element,
    )
    WebDriverWait(driver, 10).until(
        lambda _: driver.execute_script("return document.activeElement === arguments[0];", element)
    )


def grid_column_count(driver: webdriver.Chrome, selector: str) -> int:
    element = driver.find_element(By.CSS_SELECTOR, selector)
    value = driver.execute_script(
        "return window.getComputedStyle(arguments[0]).gridTemplateColumns;",
        element,
    )
    return len([item for item in str(value).split() if item])


def assert_no_page_overflow(driver: webdriver.Chrome, label: str) -> int:
    overflow = int(
        driver.execute_script(
            "return document.documentElement.scrollWidth - document.documentElement.clientWidth;"
        )
    )
    if overflow > 1:
        fail(f"{label} has horizontal page overflow of {overflow}px")
    return overflow


def save_failure_screenshot(driver: webdriver.Chrome, filename: str) -> None:
    try:
        driver.save_screenshot(str(ARTIFACT_DIR / filename))
    except Exception:
        pass


def changed_by_keyboard(
    driver: webdriver.Chrome,
    control_selector: str,
    target_selector: str,
    key: str = Keys.ARROW_RIGHT,
) -> tuple[str, str]:
    control = driver.find_element(By.CSS_SELECTOR, control_selector)
    target = driver.find_element(By.CSS_SELECTOR, target_selector)
    before = target.get_attribute("d") or target.text
    focus_for_keyboard(driver, control)
    control.send_keys(key)
    WebDriverWait(driver, 10).until(
        lambda _: (target.get_attribute("d") or target.text) != before
    )
    after = target.get_attribute("d") or target.text
    return before, after


def desktop_and_interaction_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=1440, height=1400)
    try:
        load_with_retry(driver, PART_URL, "Appendix J")
        if "Part VII" not in driver.title:
            fail(f"Unexpected Part VII page title: {driver.title}")
        for label in (
            "Appendix A", "Appendix B", "Appendix C", "Appendix D", "Appendix E",
            "Appendix F", "Appendix G", "Appendix H", "Appendix I", "Appendix J",
        ):
            if label not in driver.page_source:
                fail(f"Part VII index does not expose {label}")
        index_overflow = assert_no_page_overflow(driver, "Part VII desktop index")
        driver.save_screenshot(str(ARTIFACT_DIR / "part-07-index-app-j-desktop.png"))

        load_with_retry(driver, APPENDIX_URL, "Source-convention audit")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".katex")) > 0
        )
        if "Appendix J" not in driver.title:
            fail(f"Unexpected Appendix J page title: {driver.title}")
        if grid_column_count(driver, ".bilingual-section__grid") != 2:
            fail("Appendix J desktop bilingual layout is not two columns")

        katex_count = len(driver.find_elements(By.CSS_SELECTOR, ".katex"))
        if katex_count < 100:
            fail(f"Expected at least 100 rendered KaTeX nodes, received {katex_count}")
        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr"))
        if source_rows != 4:
            fail(f"Appendix J source map should contain four rows, received {source_rows}")
        contents_links = driver.find_elements(By.CSS_SELECTOR, ".appendix-contents a")
        if len(contents_links) != 8:
            fail(f"Appendix J contents should contain eight links, received {len(contents_links)}")
        for link in contents_links:
            href = link.get_attribute("href") or ""
            if "/Electronic-Structure-Learning/" not in href:
                fail(f"Appendix J anchor escaped the Pages base path: {href}")

        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        if len(contracts) != 4 or not all(item.is_displayed() for item in contracts):
            fail(f"Appendix J should expose four visualization contracts, received {len(contracts)}")
        svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        if len(svgs) != 4 or not all(item.is_displayed() for item in svgs):
            fail(f"Appendix J should expose four static SVGs, received {len(svgs)}")

        changed_by_keyboard(driver, "[data-partial-kr]", "[data-partial-path]")
        changed_by_keyboard(driver, "[data-match-k]", "[data-match-exterior-path]")
        changed_by_keyboard(driver, "[data-cross-k]", "[data-cross-path]")
        changed_by_keyboard(driver, "[data-bound-depth]", "[data-bound-path]")

        page_links = driver.find_elements(By.CSS_SELECTOR, "a")
        for slug in (
            "appendix-i-alternative-force-expressions",
            "appendix-k-useful-relations-and-formulas",
        ):
            matches = [link for link in page_links if slug in (link.get_attribute("href") or "")]
            if not matches:
                fail(f"Appendix J page does not expose navigation containing {slug}")
            href = matches[0].get_attribute("href") or ""
            if "/Electronic-Structure-Learning/" not in href:
                fail(f"Neighbour link escaped the Pages base path: {href}")

        page_overflow = assert_no_page_overflow(driver, "Appendix J desktop page")
        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-j-desktop.png"))
        report["desktop"] = {
            "title": driver.title,
            "katex_nodes": katex_count,
            "source_rows": source_rows,
            "contents_links": len(contents_links),
            "static_svg_count": len(svgs),
            "visualization_contracts": len(contracts),
            "bilingual_columns": 2,
            "page_overflow_px": page_overflow,
            "index_overflow_px": index_overflow,
            "keyboard_controls": [
                "partial_wave_kr",
                "matching_k",
                "cross_section_k",
                "bound_state_depth",
            ],
        }
    except Exception:
        save_failure_screenshot(driver, "appendix-j-desktop-failure.png")
        raise
    finally:
        driver.quit()


def narrow_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=390, height=844)
    try:
        load_with_retry(driver, APPENDIX_URL, "Source-convention audit")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".katex")) > 0
        )
        columns = grid_column_count(driver, ".bilingual-section__grid")
        if columns != 1:
            fail(f"Appendix J narrow bilingual layout should be one column, received {columns}")
        if not driver.find_element(By.CSS_SELECTOR, ".appendix-contents").is_displayed():
            fail("Appendix J contents is hidden on the narrow viewport")
        for selector in (
            "[data-partial-wave-expansion]",
            "[data-phase-shift-matching]",
            "[data-cross-section-explorer]",
            "[data-bound-state-continuation]",
        ):
            if not driver.find_element(By.CSS_SELECTOR, selector).is_displayed():
                fail(f"Appendix J narrow viewport hides {selector}")
        overflow = assert_no_page_overflow(driver, "Appendix J narrow page")
        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-j-narrow.png"))
        report["narrow"] = {
            "viewport": [390, 844],
            "bilingual_columns": columns,
            "page_overflow_px": overflow,
            "visuals_displayed": 4,
        }
    except Exception:
        save_failure_screenshot(driver, "appendix-j-narrow-failure.png")
        raise
    finally:
        driver.quit()


def no_javascript_smoke(report: dict) -> None:
    driver = new_driver(javascript=False, width=1440, height=1400)
    try:
        load_with_retry(driver, APPENDIX_URL, "Source-convention audit")
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        static_svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        fallback_tables = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual table")
        if len(contracts) != 4 or not all(item.is_displayed() for item in contracts):
            fail(f"No-JavaScript Appendix J lost contracts: {len(contracts)}")
        if len(static_svgs) != 4 or not all(item.is_displayed() for item in static_svgs):
            fail(f"No-JavaScript Appendix J lost SVGs: {len(static_svgs)}")
        if len(fallback_tables) != 4 or not all(item.is_displayed() for item in fallback_tables):
            fail(f"No-JavaScript Appendix J should expose four fallback tables, received {len(fallback_tables)}")
        katex_count = len(driver.find_elements(By.CSS_SELECTOR, ".katex"))
        if katex_count < 100:
            fail(f"No-JavaScript Appendix J lost rendered formulas: {katex_count}")
        overflow = assert_no_page_overflow(driver, "Appendix J no-JavaScript page")
        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-j-no-javascript.png"))
        report["no_javascript"] = {
            "katex_nodes": katex_count,
            "visualization_contracts": len(contracts),
            "static_svg_count": len(static_svgs),
            "fallback_tables": len(fallback_tables),
            "page_overflow_px": overflow,
        }
    except Exception:
        save_failure_screenshot(driver, "appendix-j-no-javascript-failure.png")
        raise
    finally:
        driver.quit()


def main() -> int:
    report: dict = {
        "appendix": "J",
        "expected_sha": EXPECTED_SHA,
        "base_url": BASE_URL,
        "appendix_url": APPENDIX_URL,
    }
    try:
        report["manifest"] = fetch_current_manifest()
        desktop_and_interaction_smoke(report)
        narrow_smoke(report)
        no_javascript_smoke(report)
        report["status"] = "passed"
        (ARTIFACT_DIR / "part07-app-j-report.json").write_text(
            json.dumps(report, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        print(
            "Part VII Appendix J Pages smoke passed: exact manifest, source map, four visuals, "
            "keyboard interaction, responsive layout, neighbour links, and no-JavaScript fallbacks."
        )
        return 0
    except Exception as exc:
        report["status"] = "failed"
        report["error"] = str(exc)
        (ARTIFACT_DIR / "part07-app-j-report.json").write_text(
            json.dumps(report, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        print(f"Part VII Appendix J Pages smoke failed: {exc}", file=sys.stderr)
        raise


if __name__ == "__main__":
    raise SystemExit(main())
