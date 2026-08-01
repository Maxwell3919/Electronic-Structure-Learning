#!/usr/bin/env python3
"""Live GitHub Pages smoke test for Martin Part VII Appendix K."""

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
MIN_KATEX_COUNT = 50
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
BASE_URL = os.environ["PAGES_URL"].rstrip("/") + "/"
EXPECTED_SHA = os.environ["DEPLOYED_SHA"]
PART_PATH = "part-07-appendices/"
APPENDIX_PATH = PART_PATH + "appendix-k-useful-relations-and-formulas/"
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
                headers={"User-Agent": "Electronic-Structure-Learning-Part07-AppK-Smoke/1"},
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
            "prefs", {"profile.managed_default_content_settings.javascript": 2}
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
        "return window.getComputedStyle(arguments[0]).gridTemplateColumns;", element
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


def keyboard_change(
    driver: webdriver.Chrome,
    control_selector: str,
    target_selector: str,
    key: str = Keys.ARROW_RIGHT,
) -> tuple[str, str]:
    control = driver.find_element(By.CSS_SELECTOR, control_selector)
    target = driver.find_element(By.CSS_SELECTOR, target_selector)
    before = target.get_attribute("d") or target.get_attribute("textContent") or target.text
    focus_for_keyboard(driver, control)
    control.send_keys(key)
    WebDriverWait(driver, 10).until(
        lambda _: (target.get_attribute("d") or target.get_attribute("textContent") or target.text) != before
    )
    after = target.get_attribute("d") or target.get_attribute("textContent") or target.text
    return str(before), str(after)


def assert_neighbour_links(driver: webdriver.Chrome) -> list[str]:
    selectors = (
        'a[href*="appendix-j-scattering-and-phase-shifts"]',
        'a[href*="appendix-l-numerical-methods"]',
    )
    hrefs: list[str] = []
    for selector in selectors:
        links = driver.find_elements(By.CSS_SELECTOR, selector)
        if not links:
            fail(f"Appendix K is missing neighbour link {selector}")
        href = links[0].get_attribute("href") or ""
        if "/Electronic-Structure-Learning/" not in href:
            fail(f"Neighbour link escaped the project base path: {href}")
        hrefs.append(href)
    return hrefs


def desktop_and_interaction_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=1440, height=1400)
    try:
        load_with_retry(driver, PART_URL, "Appendix K")
        if "Part VII" not in driver.title:
            fail(f"Unexpected Part VII title: {driver.title}")
        for label in (
            "Appendix A", "Appendix B", "Appendix C", "Appendix D", "Appendix E",
            "Appendix F", "Appendix G", "Appendix H", "Appendix I", "Appendix J", "Appendix K",
        ):
            if label not in driver.page_source:
                fail(f"Part VII index does not expose {label}")
        index_overflow = assert_no_page_overflow(driver, "Part VII desktop index")
        driver.save_screenshot(str(ARTIFACT_DIR / "part-07-index-app-k-desktop.png"))

        load_with_retry(driver, APPENDIX_URL, "Condon–Shortley")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".katex")) > 0
        )
        if "Appendix K" not in driver.title:
            fail(f"Unexpected Appendix K title: {driver.title}")
        katex_count = len(driver.find_elements(By.CSS_SELECTOR, ".katex"))
        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr"))
        contents_links = len(driver.find_elements(By.CSS_SELECTOR, ".appendix-contents a"))
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        svgs = driver.find_elements(By.CSS_SELECTOR, "figure.chapter-visual svg")
        if katex_count < MIN_KATEX_COUNT:
            fail(f"Appendix K rendered too few KaTeX nodes: {katex_count}")
        if source_rows != 6:
            fail(f"Appendix K source map has {source_rows} rows instead of 6")
        if contents_links != 9:
            fail(f"Appendix K contents has {contents_links} links instead of 9")
        if len(contracts) != 4 or len(svgs) != 4:
            fail(f"Appendix K visual contract/SVG counts are {len(contracts)}/{len(svgs)}")
        if grid_column_count(driver, ".appendix-k-root .bilingual-section__grid") != 2:
            fail("Appendix K desktop bilingual layout is not two columns")
        neighbour_links = assert_neighbour_links(driver)

        keyboard_change(driver, "[data-k-radial-l]", "[data-k-radial-j]")
        keyboard_change(driver, "[data-k-harmonic-phi]", "[data-k-harmonic-real]")
        keyboard_change(driver, "[data-k-coupling-l3]", "[data-k-coupling-gaunt]")
        keyboard_change(driver, "[data-k-cheb-order]", "[data-k-cheb-order-readout]")

        page_overflow = assert_no_page_overflow(driver, "Appendix K desktop page")
        driver.execute_script("window.scrollTo(0, 0);")
        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-k-desktop.png"))
        report["desktop"] = {
            "title": driver.title,
            "katex_count": katex_count,
            "source_map_rows": source_rows,
            "contents_links": contents_links,
            "visualization_contracts": len(contracts),
            "static_svg_count": len(svgs),
            "bilingual_columns": 2,
            "page_overflow_px": page_overflow,
            "index_overflow_px": index_overflow,
            "keyboard_controls": [
                "radial_l", "harmonic_phi", "coupling_l3", "chebyshev_order"
            ],
            "neighbour_links": neighbour_links,
        }
    except Exception:
        save_failure_screenshot(driver, "appendix-k-desktop-failure.png")
        raise
    finally:
        driver.quit()


def narrow_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=390, height=844)
    try:
        load_with_retry(driver, APPENDIX_URL, "Condon–Shortley")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")) == 4
        )
        columns = grid_column_count(driver, ".appendix-k-root .bilingual-section__grid")
        if columns != 1:
            fail(f"Appendix K narrow bilingual layout has {columns} columns")
        visuals = driver.find_elements(By.CSS_SELECTOR, "figure.chapter-visual")
        if len(visuals) != 4 or any(not visual.is_displayed() for visual in visuals):
            fail("Appendix K narrow view lost one or more visualizations")
        overflow = assert_no_page_overflow(driver, "Appendix K narrow page")
        driver.execute_script("window.scrollTo(0, 0);")
        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-k-narrow.png"))
        report["narrow"] = {
            "viewport": [390, 844],
            "bilingual_columns": columns,
            "visualizations": len(visuals),
            "horizontal_overflow_px": overflow,
        }
    except Exception:
        save_failure_screenshot(driver, "appendix-k-narrow-failure.png")
        raise
    finally:
        driver.quit()


def no_javascript_smoke(report: dict) -> None:
    driver = new_driver(javascript=False, width=1440, height=1400)
    try:
        load_with_retry(driver, APPENDIX_URL, "Condon–Shortley")
        katex_count = len(driver.find_elements(By.CSS_SELECTOR, ".katex"))
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        svgs = driver.find_elements(By.CSS_SELECTOR, "figure.chapter-visual svg")
        fallback_tables = driver.find_elements(By.CSS_SELECTOR, "figure.chapter-visual table")
        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr"))
        if katex_count < MIN_KATEX_COUNT:
            fail(f"No-JavaScript Appendix K lost rendered mathematics: {katex_count}")
        if len(contracts) != 4 or len(svgs) != 4 or len(fallback_tables) != 4:
            fail(
                "No-JavaScript Appendix K visual/fallback counts are "
                f"{len(contracts)}/{len(svgs)}/{len(fallback_tables)}"
            )
        if source_rows != 6:
            fail(f"No-JavaScript Appendix K source map has {source_rows} rows")
        assert_neighbour_links(driver)
        overflow = assert_no_page_overflow(driver, "Appendix K no-JavaScript page")
        driver.execute_script("window.scrollTo(0, 0);")
        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-k-no-javascript.png"))
        report["no_javascript"] = {
            "katex_count": katex_count,
            "visualization_contracts": len(contracts),
            "static_svg_count": len(svgs),
            "fallback_tables": len(fallback_tables),
            "source_map_rows": source_rows,
            "horizontal_overflow_px": overflow,
        }
    except Exception:
        save_failure_screenshot(driver, "appendix-k-no-javascript-failure.png")
        raise
    finally:
        driver.quit()


def main() -> int:
    report: dict = {
        "base_url": BASE_URL,
        "appendix_url": APPENDIX_URL,
        "manifest_url": MANIFEST_URL,
        "expected_sha": EXPECTED_SHA,
    }
    try:
        report["manifest"] = fetch_current_manifest()
        desktop_and_interaction_smoke(report)
        narrow_smoke(report)
        no_javascript_smoke(report)
        report["status"] = "passed"
        (ARTIFACT_DIR / "part07-app-k-report.json").write_text(
            json.dumps(report, indent=2, sort_keys=True), encoding="utf-8"
        )
        print(json.dumps(report, indent=2, sort_keys=True))
        return 0
    except Exception as exc:
        report["status"] = "failed"
        report["error"] = str(exc)
        (ARTIFACT_DIR / "part07-app-k-error.json").write_text(
            json.dumps(report, indent=2, sort_keys=True), encoding="utf-8"
        )
        print(f"Part VII Appendix K Pages smoke test failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
