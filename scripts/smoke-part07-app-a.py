#!/usr/bin/env python3
"""Live GitHub Pages smoke test for Martin Part VII Appendix A."""

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
APPENDIX_PATH = PART_PATH + "appendix-a-functional-equations/"
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
                headers={"User-Agent": "Electronic-Structure-Learning-Part07-Smoke/1"},
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


def grid_column_count(driver: webdriver.Chrome, selector: str) -> int:
    element = driver.find_element(By.CSS_SELECTOR, selector)
    value = driver.execute_script(
        "return window.getComputedStyle(arguments[0]).gridTemplateColumns;",
        element,
    )
    return len([item for item in str(value).split() if item])


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
        load_with_retry(driver, PART_URL, "Current status")
        if "Part VII" not in driver.title:
            fail(f"Unexpected Part VII page title: {driver.title}")
        if "Appendix A" not in driver.page_source or "Appendix B" not in driver.page_source:
            fail("Part VII index does not expose Appendix navigation")
        assert_no_page_overflow(driver, "Part VII desktop index")
        driver.save_screenshot(str(ARTIFACT_DIR / "part-07-index-desktop.png"))

        load_with_retry(driver, APPENDIX_URL, "directional variation")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".katex")) > 0
        )
        title = driver.title
        if "Appendix A" not in title:
            fail(f"Unexpected Appendix A page title: {title}")
        if grid_column_count(driver, ".bilingual-section__grid") != 2:
            fail("Appendix A desktop bilingual layout is not two columns")

        katex_count = len(driver.find_elements(By.CSS_SELECTOR, ".katex"))
        if katex_count < 45:
            fail(f"Expected at least 45 rendered KaTeX expressions, received {katex_count}")
        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr"))
        if source_rows != 3:
            fail(f"Appendix A source map should contain three rows, received {source_rows}")
        contents_links = driver.find_elements(By.CSS_SELECTOR, ".appendix-contents a")
        if len(contents_links) != 10:
            fail(f"Appendix A contents should contain ten links, received {len(contents_links)}")
        for link in contents_links:
            href = link.get_attribute("href") or ""
            if "/Electronic-Structure-Learning/" not in href:
                fail(f"Appendix anchor escaped the Pages base path: {href}")

        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        if len(contracts) != 3 or not all(item.is_displayed() for item in contracts):
            fail("Appendix A does not expose all three visualization contracts")
        static_svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        if len(static_svgs) != 3 or not all(item.is_displayed() for item in static_svgs):
            fail("Appendix A does not expose all three static SVGs")

        slider = driver.find_element(By.CSS_SELECTOR, "[data-variation-epsilon]")
        epsilon_output = driver.find_element(By.CSS_SELECTOR, "[data-variation-epsilon-output]")
        functional_output = driver.find_element(By.CSS_SELECTOR, "[data-variation-functional]")
        curve = driver.find_element(By.CSS_SELECTOR, "[data-variation-curve]")
        path_before = curve.get_attribute("d")
        value_before = functional_output.text
        focus_for_keyboard(driver, slider)
        slider.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(lambda _: functional_output.text != value_before)
        if curve.get_attribute("d") == path_before:
            fail("Directional-variation keyboard input did not update the curve")
        if epsilon_output.text != "0.01":
            fail(f"Unexpected epsilon output after keyboard step: {epsilon_output.text}")

        # Confirm both Starlight themes resolve different background tokens.
        theme_values: dict[str, str] = {}
        for theme in ("dark", "light"):
            value = driver.execute_script(
                """
                document.documentElement.setAttribute('data-theme', arguments[0]);
                return getComputedStyle(document.documentElement).getPropertyValue('--sl-color-bg').trim();
                """,
                theme,
            )
            if not value:
                fail(f"Theme {theme} does not resolve --sl-color-bg")
            theme_values[theme] = str(value)
        if theme_values["dark"] == theme_values["light"]:
            fail("Dark and light themes resolve the same background token")

        appendix_b_links = [
            link for link in driver.find_elements(By.CSS_SELECTOR, "a")
            if "appendix-b-lsda-and-gga-functionals" in (link.get_attribute("href") or "")
        ]
        if not appendix_b_links:
            fail("Appendix A page does not expose navigation to Appendix B")

        assert_no_page_overflow(driver, "Appendix A desktop")
        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-a-desktop.png"))
        report["desktop"] = {
            "title": title,
            "katex_count": katex_count,
            "source_map_rows": source_rows,
            "contents_links": len(contents_links),
            "visualization_contracts": len(contracts),
            "static_svg_count": len(static_svgs),
            "keyboard_control": "direction_parameter",
            "theme_tokens": theme_values,
        }

        driver.set_window_size(390, 844)
        driver.refresh()
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".bilingual-section__grid")) > 0
        )
        if grid_column_count(driver, ".bilingual-section__grid") != 1:
            fail("Appendix A narrow-screen bilingual layout is not a single column")
        assert_no_page_overflow(driver, "Appendix A narrow screen")
        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-a-narrow.png"))
        report["narrow"] = {"viewport": [390, 844], "bilingual_columns": 1}
    except Exception:
        save_failure_screenshot(driver, "appendix-a-desktop-failure.png")
        raise
    finally:
        driver.quit()


def no_javascript_smoke(report: dict) -> None:
    driver = new_driver(javascript=False, width=1280, height=1100)
    try:
        load_with_retry(driver, APPENDIX_URL, "No-JavaScript reference table")
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        if len(contracts) != 3 or not all(item.is_displayed() for item in contracts):
            fail("No-JavaScript Appendix A page lost a visualization contract")
        static_svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        if len(static_svgs) != 3 or not all(item.is_displayed() for item in static_svgs):
            fail("No-JavaScript Appendix A page lost a static SVG")
        fallback_rows = driver.find_elements(By.CSS_SELECTOR, ".variation-explorer__fallback tbody tr")
        if len(fallback_rows) != 3:
            fail(f"Expected three no-JavaScript benchmark rows, received {len(fallback_rows)}")
        if len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr")) != 3:
            fail("No-JavaScript Appendix A page lost the source map")
        if len(driver.find_elements(By.CSS_SELECTOR, ".katex")) < 45:
            fail("No-JavaScript Appendix A page lost rendered mathematics")
        assert_no_page_overflow(driver, "Appendix A no-JavaScript desktop")

        driver.save_screenshot(str(ARTIFACT_DIR / "appendix-a-no-javascript.png"))
        report["no_javascript"] = {
            "visualization_contracts": len(contracts),
            "static_svg_count": len(static_svgs),
            "fallback_rows": len(fallback_rows),
            "source_map_rows": 3,
        }
    except Exception:
        save_failure_screenshot(driver, "appendix-a-no-javascript-failure.png")
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

    report_path = ARTIFACT_DIR / "part07-app-a-report.json"
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
        (ARTIFACT_DIR / "part07-app-a-failure.json").write_text(
            json.dumps(failure, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        print(f"Part VII Appendix A Pages smoke test failed: {exc}", file=sys.stderr)
        raise
