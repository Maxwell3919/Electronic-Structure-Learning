#!/usr/bin/env python3
"""Live GitHub Pages smoke test for Martin Part VII Appendix I."""

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
APPENDIX_PATH = PART_PATH + "appendix-i-alternative-force-expressions/"
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
                headers={"User-Agent": "Electronic-Structure-Learning-Part07-AppI-Smoke/1"},
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


def assert_no_page_overflow(driver: webdriver.Chrome, label: str) -> None:
    overflow = driver.execute_script(
        "return document.documentElement.scrollWidth - document.documentElement.clientWidth;"
    )
    if int(overflow) > 1:
        fail(f"{label} has horizontal page overflow of {overflow}px")


def save_failure_screenshot(driver: webdriver.Chrome, filename: str) -> None:
    try:
        driver.save_screenshot(str(ARTIFACT_DIR / filename))
    except Exception:
        pass


def desktop_and_interaction_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=1440, height=1400)
    try:
        load_with_retry(driver, PART_URL, "Appendix I")
        if "Part VII" not in driver.title:
            fail(f"Unexpected Part VII page title: {driver.title}")
        for label in (
            "Appendix A", "Appendix B", "Appendix C", "Appendix D", "Appendix E",
            "Appendix F", "Appendix G", "Appendix H", "Appendix I",
        ):
            if label not in driver.page_source:
                fail(f"Part VII index does not expose {label}")
        assert_no_page_overflow(driver, "Part VII desktop index")
        driver.save_screenshot(str(ARTIFACT_DIR / "part-07-index-app-i-desktop.png"))

        load_with_retry(driver, APPENDIX_URL, "generalized-force")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".katex")) > 0
        )
        if "Appendix I" not in driver.title:
            fail(f"Unexpected Appendix I page title: {driver.title}")
        if grid_column_count(driver, ".bilingual-section__grid") != 2:
            fail("Appendix I desktop bilingual layout is not two columns")
        katex_count = len(driver.find_elements(By.CSS_SELECTOR, ".katex"))
        if katex_count < 90:
            fail(f"Expected at least 90 rendered KaTeX expressions, received {katex_count}")
        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr"))
        if source_rows != 6:
            fail(f"Appendix I source map should contain six rows, received {source_rows}")
        contents_links = driver.find_elements(By.CSS_SELECTOR, ".appendix-contents a")
        if len(contents_links) != 9:
            fail(f"Appendix I contents should contain nine links, received {len(contents_links)}")
        for link in contents_links:
            href = link.get_attribute("href") or ""
            if "/Electronic-Structure-Learning/" not in href:
                fail(f"Appendix I anchor escaped the Pages base path: {href}")

        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        if len(contracts) != 4 or not all(item.is_displayed() for item in contracts):
            fail(f"Appendix I should expose four visible contracts, received {len(contracts)}")
        if len(svgs) != 4 or not all(item.is_displayed() for item in svgs):
            fail(f"Appendix I should expose four visible SVGs, received {len(svgs)}")

        path_input = driver.find_element(By.CSS_SELECTOR, "[data-i-path-slope]")
        path_readout = driver.find_element(By.CSS_SELECTOR, "[data-i-path-second]")
        path_before = path_readout.text
        focus_for_keyboard(driver, path_input)
        path_input.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(lambda _: path_readout.text != path_before)

        frozen_input = driver.find_element(By.CSS_SELECTOR, "[data-i-frozen-lambda]")
        frozen_readout = driver.find_element(By.CSS_SELECTOR, "[data-i-relaxation-correction]")
        frozen_before = frozen_readout.text
        focus_for_keyboard(driver, frozen_input)
        frozen_input.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(lambda _: frozen_readout.text != frozen_before)

        pressure_input = driver.find_element(By.CSS_SELECTOR, "[data-i-pressure-volume]")
        pressure_readout = driver.find_element(By.CSS_SELECTOR, "[data-i-pressure-value]")
        pressure_before = pressure_readout.text
        focus_for_keyboard(driver, pressure_input)
        pressure_input.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(lambda _: pressure_readout.text != pressure_before)

        surface_input = driver.find_element(By.CSS_SELECTOR, "[data-i-surface-normal]")
        surface_readout = driver.find_element(By.CSS_SELECTOR, "[data-i-surface-closed-x]")
        surface_before = surface_readout.text
        focus_for_keyboard(driver, surface_input)
        surface_input.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(lambda _: surface_readout.text != surface_before)

        hrefs = [item.get_attribute("href") or "" for item in driver.find_elements(By.CSS_SELECTOR, "a")]
        if not any("appendix-h-energy-and-stress-densities" in href for href in hrefs):
            fail("Appendix I does not expose the Appendix H neighbour link")
        if not any("appendix-j-scattering-and-phase-shifts" in href for href in hrefs):
            fail("Appendix I does not expose the Appendix J neighbour link")
        assert_no_page_overflow(driver, "Appendix I desktop")
        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-i-desktop.png"))
        report["desktop"] = {
            "title": driver.title,
            "katex": katex_count,
            "source_rows": source_rows,
            "contents_links": len(contents_links),
            "contracts": len(contracts),
            "svgs": len(svgs),
            "keyboard_controls": 4,
        }
    except Exception:
        save_failure_screenshot(driver, "appendix-i-desktop-failure.png")
        raise
    finally:
        driver.quit()


def narrow_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=390, height=844)
    try:
        load_with_retry(driver, APPENDIX_URL, "generalized-force")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".katex")) > 0
        )
        if grid_column_count(driver, ".bilingual-section__grid") != 1:
            fail("Appendix I narrow bilingual layout is not one column")
        assert_no_page_overflow(driver, "Appendix I narrow")
        controls = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual input[type='range']")
        if len(controls) < 8 or not all(control.is_displayed() for control in controls):
            fail(f"Appendix I narrow view should expose at least eight visible range controls, received {len(controls)}")
        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-i-narrow.png"))
        report["narrow"] = {"viewport": "390x844", "columns": 1, "controls": len(controls)}
    except Exception:
        save_failure_screenshot(driver, "appendix-i-narrow-failure.png")
        raise
    finally:
        driver.quit()


def no_javascript_smoke(report: dict) -> None:
    driver = new_driver(javascript=False, width=1280, height=1200)
    try:
        load_with_retry(driver, APPENDIX_URL, "generalized-force")
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        fallback_tables = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual table")
        if len(contracts) != 4 or len(svgs) != 4 or len(fallback_tables) != 4:
            fail(
                "Appendix I no-JavaScript contract failed: "
                f"contracts={len(contracts)}, svgs={len(svgs)}, tables={len(fallback_tables)}"
            )
        if not all(item.is_displayed() for item in [*contracts, *svgs, *fallback_tables]):
            fail("One or more Appendix I no-JavaScript fallbacks are hidden")
        assert_no_page_overflow(driver, "Appendix I no-JavaScript")
        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-i-no-javascript.png"))
        report["no_javascript"] = {
            "contracts": len(contracts), "svgs": len(svgs), "fallback_tables": len(fallback_tables)
        }
    except Exception:
        save_failure_screenshot(driver, "appendix-i-no-javascript-failure.png")
        raise
    finally:
        driver.quit()


def main() -> int:
    report: dict = {
        "appendix": "I",
        "base_url": BASE_URL,
        "expected_sha": EXPECTED_SHA,
        "manifest": fetch_current_manifest(),
    }
    try:
        desktop_and_interaction_smoke(report)
        narrow_smoke(report)
        no_javascript_smoke(report)
    except Exception as exc:
        report["status"] = "failure"
        report["error"] = str(exc)
        (ARTIFACT_DIR / "appendix-i-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
        raise
    report["status"] = "success"
    (ARTIFACT_DIR / "appendix-i-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"Appendix I live smoke failed: {exc}", file=sys.stderr)
        raise
