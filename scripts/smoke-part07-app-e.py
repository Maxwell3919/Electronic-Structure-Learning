#!/usr/bin/env python3
"""Live GitHub Pages smoke test for Martin Part VII Appendix E."""

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
APPENDIX_PATH = PART_PATH + "appendix-e-dielectric-functions-and-optical-properties/"
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
                headers={"User-Agent": "Electronic-Structure-Learning-Part07-AppE-Smoke/1"},
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
        load_with_retry(driver, PART_URL, "Appendix E")
        if "Part VII" not in driver.title:
            fail(f"Unexpected Part VII page title: {driver.title}")
        for label in ("Appendix A", "Appendix B", "Appendix C", "Appendix D", "Appendix E"):
            if label not in driver.page_source:
                fail(f"Part VII index does not expose {label}")
        assert_no_page_overflow(driver, "Part VII desktop index")
        driver.save_screenshot(str(ARTIFACT_DIR / "part-07-index-app-e-desktop.png"))

        load_with_retry(driver, APPENDIX_URL, "Lyddane")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".katex")) > 0
        )
        title = driver.title
        if "Appendix E" not in title:
            fail(f"Unexpected Appendix E page title: {title}")
        if grid_column_count(driver, ".bilingual-section__grid") != 2:
            fail("Appendix E desktop bilingual layout is not two columns")

        katex_count = len(driver.find_elements(By.CSS_SELECTOR, ".katex"))
        if katex_count < 80:
            fail(f"Expected at least 80 rendered KaTeX expressions, received {katex_count}")
        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr"))
        if source_rows != 7:
            fail(f"Appendix E source map should contain seven rows, received {source_rows}")
        contents_links = driver.find_elements(By.CSS_SELECTOR, ".appendix-contents a")
        if len(contents_links) != 10:
            fail(f"Appendix E contents should contain ten links, received {len(contents_links)}")
        for link in contents_links:
            href = link.get_attribute("href") or ""
            if "/Electronic-Structure-Learning/" not in href:
                fail(f"Appendix E anchor escaped the Pages base path: {href}")

        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        if len(contracts) != 4 or not all(item.is_displayed() for item in contracts):
            fail(f"Appendix E should expose four visualization contracts, received {len(contracts)}")
        svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        if len(svgs) != 4 or not all(item.is_displayed() for item in svgs):
            fail(f"Appendix E should expose four static SVGs, received {len(svgs)}")

        spectral = driver.find_element(By.CSS_SELECTOR, "[data-spectral-fraction]")
        spectral_path = driver.find_element(By.CSS_SELECTOR, "[data-spectral-path]")
        spectral_before = spectral_path.get_attribute("d")
        focus_for_keyboard(driver, spectral)
        spectral.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(lambda _: spectral_path.get_attribute("d") != spectral_before)

        coupling = driver.find_element(By.CSS_SELECTOR, "[data-local-field-coupling]")
        macro = driver.find_element(By.CSS_SELECTOR, "[data-local-field-macro]")
        macro_before = macro.text
        focus_for_keyboard(driver, coupling)
        coupling.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(lambda _: macro.text != macro_before)

        strength = driver.find_element(By.CSS_SELECTOR, "[data-polar-strength]")
        lo = driver.find_element(By.CSS_SELECTOR, "[data-polar-lo]")
        lo_before = lo.text
        focus_for_keyboard(driver, strength)
        strength.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(lambda _: lo.text != lo_before)

        page_links = driver.find_elements(By.CSS_SELECTOR, "a")
        for slug in (
            "appendix-d-perturbation-theory-response-functions-and-green-s-functions",
            "appendix-f-coulomb-interactions-in-extended-systems",
        ):
            matches = [link for link in page_links if slug in (link.get_attribute("href") or "")]
            if not matches:
                fail(f"Appendix E page does not expose navigation containing {slug}")
            if "/Electronic-Structure-Learning/" not in (matches[0].get_attribute("href") or ""):
                fail(f"Neighbour link escaped the Pages base path: {slug}")

        assert_no_page_overflow(driver, "Appendix E desktop")
        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-e-desktop.png"))
        report["desktop"] = {
            "title": title,
            "katex_count": katex_count,
            "source_map_rows": source_rows,
            "contents_links": len(contents_links),
            "visualization_contracts": len(contracts),
            "static_svg_count": len(svgs),
            "keyboard_controls": ["spectral_fraction", "local_field_coupling", "polar_strength"],
        }

        driver.set_window_size(390, 844)
        driver.refresh()
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".bilingual-section__grid")) > 0
        )
        if grid_column_count(driver, ".bilingual-section__grid") != 1:
            fail("Appendix E narrow-screen bilingual layout is not a single column")
        assert_no_page_overflow(driver, "Appendix E narrow screen")
        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-e-narrow.png"))
        report["narrow"] = {"viewport": [390, 844], "bilingual_columns": 1}
    except Exception:
        save_failure_screenshot(driver, "appendix-e-desktop-failure.png")
        raise
    finally:
        driver.quit()


def no_javascript_smoke(report: dict) -> None:
    driver = new_driver(javascript=False, width=1280, height=1100)
    try:
        load_with_retry(driver, APPENDIX_URL, "No-JavaScript reference table")
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        if len(contracts) != 4 or not all(item.is_displayed() for item in contracts):
            fail("No-JavaScript Appendix E page lost visualization contracts")
        svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        if len(svgs) != 4 or not all(item.is_displayed() for item in svgs):
            fail("No-JavaScript Appendix E page lost static SVGs")
        if len(driver.find_elements(By.CSS_SELECTOR, ".spectral-weight__fallback tbody tr")) != 3:
            fail("No-JavaScript spectral-weight table does not contain three benchmark rows")
        if len(driver.find_elements(By.CSS_SELECTOR, ".local-field-explorer__fallback tbody tr")) != 3:
            fail("No-JavaScript local-field table does not contain three benchmark rows")
        if len(driver.find_elements(By.CSS_SELECTOR, ".polar-mode__fallback tbody tr")) != 3:
            fail("No-JavaScript polar-mode table does not contain three benchmark rows")
        if len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr")) != 7:
            fail("No-JavaScript Appendix E page lost source-map rows")
        if len(driver.find_elements(By.CSS_SELECTOR, ".katex")) < 80:
            fail("No-JavaScript Appendix E page lost rendered mathematics")
        assert_no_page_overflow(driver, "Appendix E no-JavaScript desktop")
        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-e-no-javascript.png"))
        report["no_javascript"] = {
            "visualization_contracts": len(contracts),
            "static_svg_count": len(svgs),
            "source_map_rows": 7,
            "fallback_tables": 3,
        }
    except Exception:
        save_failure_screenshot(driver, "appendix-e-no-javascript-failure.png")
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
        "appendix_url": APPENDIX_URL,
        "manifest_url": MANIFEST_URL,
        "manifest": manifest,
    }
    desktop_and_interaction_smoke(report)
    no_javascript_smoke(report)

    report_path = ARTIFACT_DIR / "part07-app-e-report.json"
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
            "appendix_url": APPENDIX_URL,
            "manifest_url": MANIFEST_URL,
            "expected_sha": EXPECTED_SHA,
            "error_type": type(exc).__name__,
            "error": str(exc),
        }
        (ARTIFACT_DIR / "part07-app-e-failure.json").write_text(
            json.dumps(failure, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        print(f"Part VII Appendix E Pages smoke test failed: {exc}", file=sys.stderr)
        raise
