#!/usr/bin/env python3
"""Live GitHub Pages smoke test for Martin Part VII Appendix D."""

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
APPENDIX_PATH = PART_PATH + "appendix-d-perturbation-theory-response-functions-and-green-s-functions/"
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
                headers={"User-Agent": "Electronic-Structure-Learning-Part07-AppD-Smoke/1"},
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
        load_with_retry(driver, PART_URL, "Appendix D")
        if "Part VII" not in driver.title:
            fail(f"Unexpected Part VII page title: {driver.title}")
        for label in ("Appendix A", "Appendix B", "Appendix C", "Appendix D"):
            if label not in driver.page_source:
                fail(f"Part VII index does not expose {label}")
        assert_no_page_overflow(driver, "Part VII desktop index")
        driver.save_screenshot(str(ARTIFACT_DIR / "part-07-index-app-d-desktop.png"))

        load_with_retry(driver, APPENDIX_URL, "Kramers")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".katex")) > 0
        )
        title = driver.title
        if "Appendix D" not in title:
            fail(f"Unexpected Appendix D page title: {title}")
        if grid_column_count(driver, ".bilingual-section__grid") != 2:
            fail("Appendix D desktop bilingual layout is not two columns")

        katex_count = len(driver.find_elements(By.CSS_SELECTOR, ".katex"))
        if katex_count < 90:
            fail(f"Expected at least 90 rendered KaTeX expressions, received {katex_count}")
        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr"))
        if source_rows != 7:
            fail(f"Appendix D source map should contain seven rows, received {source_rows}")
        contents_links = driver.find_elements(By.CSS_SELECTOR, ".appendix-contents a")
        if len(contents_links) != 10:
            fail(f"Appendix D contents should contain ten links, received {len(contents_links)}")
        for link in contents_links:
            href = link.get_attribute("href") or ""
            if "/Electronic-Structure-Learning/" not in href:
                fail(f"Appendix D anchor escaped the Pages base path: {href}")

        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        if len(contracts) != 5 or not all(item.is_displayed() for item in contracts):
            fail(f"Appendix D should expose five visualization contracts, received {len(contracts)}")
        svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        if len(svgs) != 5 or not all(item.is_displayed() for item in svgs):
            fail(f"Appendix D should expose five static SVGs, received {len(svgs)}")

        # Dyson keyboard interaction.
        dyson_bare = driver.find_element(By.CSS_SELECTOR, "[data-dyson-bare]")
        dyson_screened = driver.find_element(By.CSS_SELECTOR, "[data-dyson-screened]")
        dyson_before = dyson_screened.text
        focus_for_keyboard(driver, dyson_bare)
        dyson_bare.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(lambda _: dyson_screened.text != dyson_before)

        # Causal oscillator keyboard interaction.
        damping = driver.find_element(By.CSS_SELECTOR, "[data-oscillator-damping]")
        oscillator_imag = driver.find_element(By.CSS_SELECTOR, "[data-oscillator-imag]")
        imag_before = oscillator_imag.text
        focus_for_keyboard(driver, damping)
        damping.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(lambda _: oscillator_imag.text != imag_before)

        # Green spectral keyboard interaction.
        broadening = driver.find_element(By.CSS_SELECTOR, "[data-green-broadening]")
        green_density = driver.find_element(By.CSS_SELECTOR, "[data-green-density]")
        density_before = green_density.text
        focus_for_keyboard(driver, broadening)
        broadening.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(lambda _: green_density.text != density_before)

        # Neighbour navigation must remain under the project base path.
        page_links = driver.find_elements(By.CSS_SELECTOR, "a")
        for slug in (
            "appendix-c-adiabatic-approximation",
            "appendix-e-dielectric-functions-and-optical-properties",
        ):
            matches = [link for link in page_links if slug in (link.get_attribute("href") or "")]
            if not matches:
                fail(f"Appendix D page does not expose navigation containing {slug}")
            if "/Electronic-Structure-Learning/" not in (matches[0].get_attribute("href") or ""):
                fail(f"Neighbour link escaped the Pages base path: {slug}")

        assert_no_page_overflow(driver, "Appendix D desktop")
        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-d-desktop.png"))
        report["desktop"] = {
            "title": title,
            "katex_count": katex_count,
            "source_map_rows": source_rows,
            "contents_links": len(contents_links),
            "visualization_contracts": len(contracts),
            "static_svg_count": len(svgs),
            "keyboard_controls": ["dyson_bare", "oscillator_damping", "green_broadening"],
        }

        driver.set_window_size(390, 844)
        driver.refresh()
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".bilingual-section__grid")) > 0
        )
        if grid_column_count(driver, ".bilingual-section__grid") != 1:
            fail("Appendix D narrow-screen bilingual layout is not a single column")
        assert_no_page_overflow(driver, "Appendix D narrow screen")
        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-d-narrow.png"))
        report["narrow"] = {"viewport": [390, 844], "bilingual_columns": 1}
    except Exception:
        save_failure_screenshot(driver, "appendix-d-desktop-failure.png")
        raise
    finally:
        driver.quit()


def no_javascript_smoke(report: dict) -> None:
    driver = new_driver(javascript=False, width=1280, height=1100)
    try:
        load_with_retry(driver, APPENDIX_URL, "No-JavaScript reference table")
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        if len(contracts) != 5 or not all(item.is_displayed() for item in contracts):
            fail("No-JavaScript Appendix D page lost visualization contracts")
        svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        if len(svgs) != 5 or not all(item.is_displayed() for item in svgs):
            fail("No-JavaScript Appendix D page lost static SVGs")
        if len(driver.find_elements(By.CSS_SELECTOR, ".dyson-explorer__fallback tbody tr")) != 3:
            fail("No-JavaScript Dyson table does not contain three benchmark rows")
        if len(driver.find_elements(By.CSS_SELECTOR, ".oscillator-explorer__fallback tbody tr")) != 3:
            fail("No-JavaScript oscillator table does not contain three benchmark rows")
        if len(driver.find_elements(By.CSS_SELECTOR, ".green-explorer__fallback tbody tr")) != 3:
            fail("No-JavaScript Green table does not contain three benchmark rows")
        if len(driver.find_elements(By.CSS_SELECTOR, ".two-n-map__fallback tbody tr")) != 3:
            fail("No-JavaScript 2n+1 table does not contain three order rows")
        if len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr")) != 7:
            fail("No-JavaScript Appendix D page lost source-map rows")
        if len(driver.find_elements(By.CSS_SELECTOR, ".katex")) < 90:
            fail("No-JavaScript Appendix D page lost rendered mathematics")
        assert_no_page_overflow(driver, "Appendix D no-JavaScript desktop")
        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-d-no-javascript.png"))
        report["no_javascript"] = {
            "visualization_contracts": len(contracts),
            "static_svg_count": len(svgs),
            "source_map_rows": 7,
            "fallback_tables": 4,
        }
    except Exception:
        save_failure_screenshot(driver, "appendix-d-no-javascript-failure.png")
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

    report_path = ARTIFACT_DIR / "part07-app-d-report.json"
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
        (ARTIFACT_DIR / "part07-app-d-failure.json").write_text(
            json.dumps(failure, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        print(f"Part VII Appendix D Pages smoke test failed: {exc}", file=sys.stderr)
        raise
