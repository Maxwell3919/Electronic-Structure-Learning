#!/usr/bin/env python3
"""Live GitHub Pages smoke test for Martin Part I Chapter 2."""

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
CHAPTER_PATH = "part-01-overview-and-background/chapter-02-overview/"
CHAPTER_URL = urljoin(BASE_URL, CHAPTER_PATH)
MANIFEST_URL = urljoin(BASE_URL, "deployment-manifest.json")


def fail(message: str) -> None:
    raise AssertionError(message)


def fetch_json_with_retry(url: str, attempts: int = 30, delay: float = 5.0) -> dict:
    last_error: Exception | None = None
    for _ in range(attempts):
        try:
            request = urllib.request.Request(
                url,
                headers={"User-Agent": "Electronic-Structure-Learning-Chapter02-Smoke/1"},
            )
            with urllib.request.urlopen(request, timeout=20) as response:
                if response.status != 200:
                    fail(f"Expected HTTP 200 for {url}, received {response.status}")
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


def save_failure_screenshot(driver: webdriver.Chrome, filename: str) -> None:
    try:
        driver.save_screenshot(str(ARTIFACT_DIR / filename))
    except Exception:
        pass


def desktop_and_interaction_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=1440, height=1200)
    try:
        load_with_retry(driver, CHAPTER_URL, "Chapter 2")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".katex")) > 0
        )

        title = driver.title
        if "Chapter 2" not in title:
            fail(f"Unexpected page title: {title}")
        if grid_column_count(driver, ".bilingual-section__grid") != 2:
            fail("Desktop bilingual layout is not two columns")

        katex_count = len(driver.find_elements(By.CSS_SELECTOR, ".katex"))
        if katex_count < 15:
            fail(f"Expected at least 15 rendered KaTeX expressions, found {katex_count}")

        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr"))
        if source_rows != 17:
            fail(f"Source map must contain 17 Martin sections, found {source_rows}")

        contents_links = driver.find_elements(By.CSS_SELECTOR, ".chapter-contents a")
        if len(contents_links) < 21:
            fail("Explicit Chapter 2 contents is incomplete")
        for link in contents_links:
            href = link.get_attribute("href") or ""
            if "/Electronic-Structure-Learning/" not in href:
                fail(f"Chapter link escaped the Pages base path: {href}")

        # EOS model: keyboard HOME gives P=0 and phase A; END gives high P and phase B.
        pressure_slider = driver.find_element(By.CSS_SELECTOR, "[data-eos-pressure]")
        stable_phase = driver.find_element(By.CSS_SELECTOR, "[data-eos-stable]")
        focus_for_keyboard(driver, pressure_slider)
        pressure_slider.send_keys(Keys.HOME)
        WebDriverWait(driver, 10).until(
            lambda _: pressure_slider.get_attribute("value") == "0" and "Stable phase: A" in stable_phase.text
        )
        pressure_slider.send_keys(Keys.END)
        WebDriverWait(driver, 10).until(
            lambda _: pressure_slider.get_attribute("value") == "0.3" and "Stable phase: B" in stable_phase.text
        )

        # Gap hierarchy: a keyboard change must update the displayed result and bar width.
        ks_slider = driver.find_element(By.CSS_SELECTOR, "[data-gap-ks]")
        gap_equation = driver.find_element(By.CSS_SELECTOR, "[data-gap-equation]")
        ks_bar = driver.find_element(By.CSS_SELECTOR, "[data-gap-ks-bar]")
        old_equation = gap_equation.text
        old_width = ks_bar.get_attribute("width")
        focus_for_keyboard(driver, ks_slider)
        ks_slider.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(
            lambda _: gap_equation.text != old_equation and ks_bar.get_attribute("width") != old_width
        )

        # Property router: keyboard END selects topology and only that card is active.
        route_select = driver.find_element(By.CSS_SELECTOR, "[data-property-select]")
        focus_for_keyboard(driver, route_select)
        route_select.send_keys(Keys.END)
        topology_card = driver.find_element(By.CSS_SELECTOR, '[data-property-card="topology"]')
        WebDriverWait(driver, 10).until(
            lambda _: route_select.get_attribute("value") == "topology"
            and "property-router__card--active" in (topology_card.get_attribute("class") or "")
        )
        active_cards = driver.find_elements(By.CSS_SELECTOR, ".property-router__card--active")
        if len(active_cards) != 1:
            fail(f"Expected one active property card, found {len(active_cards)}")

        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-02-desktop.png"))
        report["desktop"] = {
            "title": title,
            "katex_count": katex_count,
            "source_map_rows": source_rows,
            "contents_links": len(contents_links),
            "keyboard_controls": ["eos_pressure", "ks_gap", "property_route"],
        }

        driver.set_window_size(390, 844)
        driver.refresh()
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".bilingual-section__grid")) > 0
        )
        if grid_column_count(driver, ".bilingual-section__grid") != 1:
            fail("Narrow-screen bilingual layout is not a single column")
        if grid_column_count(driver, ".property-router__grid") != 1:
            fail("Narrow-screen property router is not a single column")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-02-narrow.png"))
        report["narrow"] = {
            "viewport": [390, 844],
            "bilingual_columns": 1,
            "property_router_columns": 1,
        }
    except Exception:
        save_failure_screenshot(driver, "chapter-02-desktop-failure.png")
        raise
    finally:
        driver.quit()


def no_javascript_smoke(report: dict) -> None:
    driver = new_driver(javascript=False, width=1280, height=1000)
    try:
        load_with_retry(driver, CHAPTER_URL, "Original teaching model")
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        if len(contracts) != 3:
            fail(f"Expected three Chapter 2 visualization contracts, found {len(contracts)}")
        if not all(contract.is_displayed() for contract in contracts):
            fail("A Chapter 2 no-JavaScript visualization explanation is hidden")

        static_svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        if len(static_svgs) != 2:
            fail(f"Expected two analytic SVG fallbacks, found {len(static_svgs)}")

        route_cards = driver.find_elements(By.CSS_SELECTOR, ".property-router__card")
        if len(route_cards) != 5:
            fail(f"Expected five property-route cards, found {len(route_cards)}")
        if not all(card.is_displayed() for card in route_cards):
            fail("A no-JavaScript property-route card is hidden")

        if len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr")) != 17:
            fail("No-JavaScript page lost one or more source-map sections")

        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-02-no-javascript.png"))
        report["no_javascript"] = {
            "visualization_contracts": len(contracts),
            "static_svg_count": len(static_svgs),
            "property_route_cards": len(route_cards),
            "source_map_rows": 17,
        }
    except Exception:
        save_failure_screenshot(driver, "chapter-02-no-javascript-failure.png")
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

    report_path = ARTIFACT_DIR / "chapter-02-report.json"
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
        (ARTIFACT_DIR / "chapter-02-failure.json").write_text(
            json.dumps(failure, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        print(f"Chapter 2 Pages smoke test failed: {exc}", file=sys.stderr)
        raise
