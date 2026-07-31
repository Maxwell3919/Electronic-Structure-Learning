#!/usr/bin/env python3
"""Live GitHub Pages smoke test for Martin Part V Chapter 20."""

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


ARTIFACT_DIR = Path(os.environ.get("SMOKE_ARTIFACT_DIR", "artifacts/pages-smoke")) / "chapter-20"
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

BASE_URL = os.environ["PAGES_URL"].rstrip("/") + "/"
EXPECTED_SHA = os.environ["DEPLOYED_SHA"]
PART_PATH = "part-05-properties-of-matter/"
CHAPTER_PATH = "part-05-properties-of-matter/chapter-20-response-functions-phonons-and-magnons/"
PART_URL = urljoin(BASE_URL, PART_PATH)
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
                headers={"User-Agent": "Electronic-Structure-Learning-Ch20-Smoke/1"},
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
        driver = webdriver.Chrome(
            options=chrome_options(javascript=javascript, width=width, height=height)
        )
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


def assert_no_page_overflow(driver: webdriver.Chrome, label: str) -> None:
    scroll_width, inner_width = driver.execute_script(
        "return [document.documentElement.scrollWidth, window.innerWidth];"
    )
    if scroll_width > inner_width + 2:
        fail(f"{label} has horizontal page overflow: {scroll_width}px > {inner_width}px")


def move_slider_and_expect_change(
    driver: webdriver.Chrome,
    input_selector: str,
    output_selector: str,
) -> None:
    control = driver.find_element(By.CSS_SELECTOR, input_selector)
    output = driver.find_element(By.CSS_SELECTOR, output_selector)
    old_value = control.get_attribute("value")
    old_output = output.text
    focus_for_keyboard(driver, control)
    control.send_keys(Keys.ARROW_RIGHT)
    WebDriverWait(driver, 10).until(
        lambda _: control.get_attribute("value") != old_value and output.text != old_output
    )


def part_index_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=1280, height=1000)
    try:
        load_with_retry(driver, PART_URL, "Part V")
        if "Part V" not in driver.title:
            fail(f"Unexpected Part V index title: {driver.title}")
        if len(driver.find_elements(By.CSS_SELECTOR, ".part05-chain span")) != 5:
            fail("Part V dependency chain does not contain five declared stages")
        links = driver.find_elements(
            By.CSS_SELECTOR,
            'a[href*="chapter-20-response-functions-phonons-and-magnons"]',
        )
        if not links:
            fail("Part V index lacks a Chapter 20 link")
        href = links[0].get_attribute("href") or ""
        if "/Electronic-Structure-Learning/" not in href:
            fail(f"Chapter 20 link escaped the Pages base path: {href}")
        assert_no_page_overflow(driver, "Part V index")
        driver.save_screenshot(str(ARTIFACT_DIR / "part-05-index.png"))
        report["part_index"] = {"dependency_stages": 5, "chapter_20_link": href}
    except Exception:
        save_failure_screenshot(driver, "part-05-index-failure.png")
        raise
    finally:
        driver.quit()


def desktop_and_interaction_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=1440, height=1200)
    try:
        load_with_retry(driver, CHAPTER_URL, "Chapter 20")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".katex")) > 0
        )
        if "Chapter 20" not in driver.title:
            fail(f"Unexpected Chapter 20 title: {driver.title}")
        if grid_column_count(driver, ".bilingual-section__grid") != 2:
            fail("Chapter 20 desktop bilingual layout is not two columns")

        katex_count = len(driver.find_elements(By.CSS_SELECTOR, ".katex"))
        if katex_count < 35:
            fail(f"Expected at least 35 rendered KaTeX expressions, found {katex_count}")
        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr"))
        if source_rows != 9:
            fail(f"Chapter 20 source map must contain nine sections, found {source_rows}")
        contents_links = driver.find_elements(By.CSS_SELECTOR, ".chapter20-contents a")
        if len(contents_links) != 13:
            fail(f"Chapter 20 contents must contain thirteen links, found {len(contents_links)}")

        move_slider_and_expect_change(
            driver,
            "#ch20-chain-dispersion [data-mass-ratio]",
            "#ch20-chain-dispersion [data-optical-output]",
        )
        move_slider_and_expect_change(
            driver,
            "#ch20-frozen-curvature [data-displacement]",
            "#ch20-frozen-curvature [data-error]",
        )
        move_slider_and_expect_change(
            driver,
            "#ch20-sternheimer-response [data-gap]",
            "#ch20-sternheimer-response [data-sum-amplitude]",
        )
        move_slider_and_expect_change(
            driver,
            "#ch20-loto-explorer [data-charge]",
            "#ch20-loto-explorer [data-lo]",
        )
        move_slider_and_expect_change(
            driver,
            "#ch20-eliashberg-spectrum [data-scale]",
            "#ch20-eliashberg-spectrum [data-lambda]",
        )

        assert_no_page_overflow(driver, "Chapter 20 desktop")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-20-desktop.png"))
        report["desktop"] = {
            "title": driver.title,
            "katex_count": katex_count,
            "source_map_rows": source_rows,
            "contents_links": len(contents_links),
            "keyboard_controls": [
                "mass_ratio",
                "frozen_displacement",
                "sternheimer_gap",
                "effective_charge",
                "eliashberg_weight_scale",
            ],
        }

        driver.set_window_size(390, 844)
        driver.refresh()
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".bilingual-section__grid")) > 0
        )
        if grid_column_count(driver, ".bilingual-section__grid") != 1:
            fail("Chapter 20 narrow bilingual layout is not a single column")
        assert_no_page_overflow(driver, "Chapter 20 narrow")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-20-narrow.png"))
        report["narrow"] = {"viewport": [390, 844], "bilingual_columns": 1}
    except Exception:
        save_failure_screenshot(driver, "chapter-20-desktop-failure.png")
        raise
    finally:
        driver.quit()


def no_javascript_smoke(report: dict) -> None:
    driver = new_driver(javascript=False, width=1280, height=1000)
    try:
        load_with_retry(driver, CHAPTER_URL, "No-JavaScript fallback")
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        figures = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual")
        fallbacks = driver.find_elements(By.XPATH, "//*[contains(text(), '无 JavaScript fallback')]")
        if len(contracts) != 5:
            fail(f"Chapter 20 must retain five visualization contracts, found {len(contracts)}")
        if len(figures) != 5:
            fail(f"Chapter 20 must retain five teaching figures, found {len(figures)}")
        if len(fallbacks) < 5:
            fail(f"Chapter 20 must expose five no-JavaScript explanations, found {len(fallbacks)}")
        if not all(item.is_displayed() for item in contracts + figures):
            fail("A Chapter 20 no-JavaScript figure or contract is hidden")
        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr"))
        if source_rows != 9:
            fail("No-JavaScript Chapter 20 source map lost one or more sections")
        assert_no_page_overflow(driver, "Chapter 20 no-JavaScript")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-20-no-javascript.png"))
        report["no_javascript"] = {
            "visualization_contracts": len(contracts),
            "teaching_figures": len(figures),
            "fallback_explanations": len(fallbacks),
            "source_map_rows": source_rows,
        }
    except Exception:
        save_failure_screenshot(driver, "chapter-20-no-javascript-failure.png")
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
        "part_url": PART_URL,
        "chapter_url": CHAPTER_URL,
        "manifest_url": MANIFEST_URL,
        "manifest": manifest,
    }
    part_index_smoke(report)
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
            "part_url": PART_URL,
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
        print(f"Chapter 20 Pages smoke test failed: {exc}", file=sys.stderr)
        raise
