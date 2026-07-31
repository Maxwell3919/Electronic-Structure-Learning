#!/usr/bin/env python3
"""Live GitHub Pages smoke test for the completed Martin Chapter 1 page.

The script is intentionally independent of the Astro build. It checks the
actually deployed site, verifies deployment provenance, exercises native
keyboard controls in a real browser, and verifies the no-JavaScript fallback.
"""

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
CHAPTER_PATH = "part-01-overview-and-background/chapter-01-introduction/"
CHAPTER_URL = urljoin(BASE_URL, CHAPTER_PATH)
MANIFEST_URL = urljoin(BASE_URL, "deployment-manifest.json")


def fail(message: str) -> None:
    raise AssertionError(message)


def fetch_json_with_retry(url: str, attempts: int = 30, delay: float = 5.0) -> dict:
    """Fetch JSON after Pages/CDN propagation, rejecting stale deployments."""
    last_error: Exception | None = None
    for _ in range(attempts):
        try:
            request = urllib.request.Request(
                url,
                headers={"User-Agent": "Electronic-Structure-Learning-Pages-Smoke/1"},
            )
            with urllib.request.urlopen(request, timeout=20) as response:
                if response.status != 200:
                    fail(f"Expected HTTP 200 for {url}, received {response.status}")
                payload = json.load(response)
            if payload.get("sha") == EXPECTED_SHA:
                return payload
            last_error = AssertionError(
                f"Deployment manifest is stale: expected {EXPECTED_SHA}, "
                f"received {payload.get('sha')}"
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
        except Exception as exc:  # Selenium raises several transient subclasses.
            last_error = exc
            time.sleep(5)
    raise AssertionError(f"Could not load current page {url}: {last_error}")


def grid_column_count(driver: webdriver.Chrome, selector: str) -> int:
    element = driver.find_element(By.CSS_SELECTOR, selector)
    value = driver.execute_script(
        "return window.getComputedStyle(arguments[0]).gridTemplateColumns;",
        element,
    )
    columns = [item for item in str(value).split() if item]
    return len(columns)


def focus_for_keyboard(driver: webdriver.Chrome, element: WebElement) -> None:
    """Focus a control without letting the fixed Starlight header intercept a click."""
    driver.execute_script(
        """
        arguments[0].scrollIntoView({block: 'center', inline: 'nearest'});
        arguments[0].focus({preventScroll: true});
        """,
        element,
    )
    WebDriverWait(driver, 10).until(
        lambda _: driver.execute_script(
            "return document.activeElement === arguments[0];",
            element,
        )
    )


def save_failure_screenshot(driver: webdriver.Chrome, filename: str) -> None:
    try:
        driver.save_screenshot(str(ARTIFACT_DIR / filename))
    except Exception:
        pass


def desktop_and_interaction_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=1440, height=1200)
    try:
        load_with_retry(driver, CHAPTER_URL, "Chapter 1")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".katex")) > 0
        )

        title = driver.title
        if "Chapter 1" not in title:
            fail(f"Unexpected page title: {title}")
        if grid_column_count(driver, ".bilingual-section__grid") != 2:
            fail("Desktop bilingual layout is not two columns")
        if len(driver.find_elements(By.CSS_SELECTOR, ".katex")) < 5:
            fail("Expected multiple rendered KaTeX expressions")
        if len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr")) != 8:
            fail("Source map does not contain all eight Martin sections")

        contents_links = driver.find_elements(By.CSS_SELECTOR, ".chapter-contents a")
        if len(contents_links) < 12:
            fail("Explicit chapter contents is incomplete")
        for link in contents_links:
            href = link.get_attribute("href") or ""
            if "/Electronic-Structure-Learning/" not in href:
                fail(f"Chapter link escaped the Pages base path: {href}")

        # Fermi slider: native keyboard input must update both value and curve.
        mu_slider = driver.find_element(By.CSS_SELECTOR, "[data-fermi-mu]")
        fermi_curve = driver.find_element(By.CSS_SELECTOR, "[data-fermi-curve]")
        old_value = mu_slider.get_attribute("value")
        old_curve = fermi_curve.get_attribute("d")
        focus_for_keyboard(driver, mu_slider)
        mu_slider.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(
            lambda _: mu_slider.get_attribute("value") != old_value
            and fermi_curve.get_attribute("d") != old_curve
        )

        # Band filling: keyboard-select N=3 and confirm the physical classification.
        electron_slider = driver.find_element(By.CSS_SELECTOR, "[data-band-electrons]")
        focus_for_keyboard(driver, electron_slider)
        electron_slider.send_keys(Keys.HOME)
        for _ in range(3):
            electron_slider.send_keys(Keys.ARROW_RIGHT)
        classification = driver.find_element(By.CSS_SELECTOR, "[data-band-classification]")
        WebDriverWait(driver, 10).until(
            lambda _: electron_slider.get_attribute("value") == "3"
            and "Partially filled band" in classification.text
        )

        # Timeline: keyboard HOME must hide the late entries; END must reveal them.
        timeline_slider = driver.find_element(By.CSS_SELECTOR, "[data-timeline-year]")
        final_milestone = driver.find_element(By.CSS_SELECTOR, '[data-year="1965"]')
        focus_for_keyboard(driver, timeline_slider)
        timeline_slider.send_keys(Keys.HOME)
        WebDriverWait(driver, 10).until(lambda _: not final_milestone.is_displayed())
        timeline_slider.send_keys(Keys.END)
        WebDriverWait(driver, 10).until(lambda _: final_milestone.is_displayed())

        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-01-desktop.png"))
        report["desktop"] = {
            "title": title,
            "katex_count": len(driver.find_elements(By.CSS_SELECTOR, ".katex")),
            "source_map_rows": len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr")),
            "contents_links": len(contents_links),
            "keyboard_controls": ["fermi_mu", "band_electron_count", "timeline_year"],
        }

        # Responsive layout in the same browser session.
        driver.set_window_size(390, 844)
        driver.refresh()
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".bilingual-section__grid")) > 0
        )
        if grid_column_count(driver, ".bilingual-section__grid") != 1:
            fail("Narrow-screen bilingual layout is not a single column")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-01-narrow.png"))
        report["narrow"] = {"viewport": [390, 844], "bilingual_columns": 1}
    except Exception:
        save_failure_screenshot(driver, "chapter-01-desktop-failure.png")
        raise
    finally:
        driver.quit()


def no_javascript_smoke(report: dict) -> None:
    driver = new_driver(javascript=False, width=1280, height=1000)
    try:
        load_with_retry(driver, CHAPTER_URL, "Original interactive model")
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        if len(contracts) != 3:
            fail("No-JavaScript page does not retain all three visualization contracts")
        if not all(contract.is_displayed() for contract in contracts):
            fail("A no-JavaScript visualization explanation is hidden")

        # The two analytic plots use SVG; the historical visualization is an HTML timeline.
        static_svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        if len(static_svgs) < 2:
            fail("No-JavaScript page does not retain both analytic SVG fallbacks")

        timeline_items = driver.find_elements(By.CSS_SELECTOR, ".chapter-timeline__list [data-year]")
        if len(timeline_items) != 11:
            fail("No-JavaScript timeline does not retain all eleven source milestones")
        if not all(item.is_displayed() for item in timeline_items):
            fail("No-JavaScript timeline hides one or more source milestones")

        final_milestone = driver.find_element(By.CSS_SELECTOR, '[data-year="1965"]')
        if not final_milestone.is_displayed():
            fail("No-JavaScript timeline fallback hides source content")

        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-01-no-javascript.png"))
        report["no_javascript"] = {
            "visualization_contracts": len(contracts),
            "static_svg_count": len(static_svgs),
            "timeline_item_count": len(timeline_items),
            "timeline_fallback_visible": True,
        }
    except Exception:
        save_failure_screenshot(driver, "chapter-01-no-javascript-failure.png")
        raise
    finally:
        driver.quit()


def main() -> int:
    manifest = fetch_json_with_retry(MANIFEST_URL)
    if manifest.get("repository") != "Maxwell3919/Electronic-Structure-Learning":
        fail(f"Unexpected manifest repository: {manifest.get('repository')}")
    if manifest.get("workflow") != "Deploy to GitHub Pages":
        fail(f"Unexpected deployment workflow: {manifest.get('workflow')}")

    report: dict = {
        "base_url": BASE_URL,
        "chapter_url": CHAPTER_URL,
        "manifest_url": MANIFEST_URL,
        "manifest": manifest,
    }
    desktop_and_interaction_smoke(report)
    no_javascript_smoke(report)

    report_path = ARTIFACT_DIR / "report.json"
    report_path.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        failure = {
            "base_url": BASE_URL,
            "chapter_url": CHAPTER_URL,
            "manifest_url": MANIFEST_URL,
            "expected_sha": EXPECTED_SHA,
            "error_type": type(exc).__name__,
            "error": str(exc),
        }
        (ARTIFACT_DIR / "failure.json").write_text(
            json.dumps(failure, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        print(f"Pages smoke test failed: {exc}", file=sys.stderr)
        raise
