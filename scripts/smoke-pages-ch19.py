#!/usr/bin/env python3
"""Live GitHub Pages smoke test for Martin Part V Chapter 19.

This script checks the deployed Part V index and Chapter 19 route independently
of the Astro build. It verifies responsive bilingual layout, source coverage,
KaTeX rendering, keyboard-operable teaching controls, no-JavaScript fallbacks,
and the exact deployed commit manifest.
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


ARTIFACT_DIR = Path(os.environ.get("SMOKE_ARTIFACT_DIR", "artifacts/pages-smoke")) / "chapter-19"
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

BASE_URL = os.environ["PAGES_URL"].rstrip("/") + "/"
EXPECTED_SHA = os.environ["DEPLOYED_SHA"]
PART_PATH = "part-05-properties-of-matter/"
CHAPTER_PATH = "part-05-properties-of-matter/chapter-19-quantum-molecular-dynamics-qmd/"
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
                headers={"User-Agent": "Electronic-Structure-Learning-Ch19-Smoke/1"},
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


def part_index_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=1280, height=1000)
    try:
        load_with_retry(driver, PART_URL, "Part V")
        if "Part V" not in driver.title:
            fail(f"Unexpected Part V index title: {driver.title}")
        if len(driver.find_elements(By.CSS_SELECTOR, ".part05-chain span")) != 5:
            fail("Part V dependency chain does not contain five declared stages")
        chapter_links = driver.find_elements(
            By.CSS_SELECTOR,
            'a[href*="chapter-19-quantum-molecular-dynamics-qmd"]',
        )
        if not chapter_links:
            fail("Part V index lacks a Chapter 19 link")
        href = chapter_links[0].get_attribute("href") or ""
        if "/Electronic-Structure-Learning/" not in href:
            fail(f"Chapter 19 link escaped the Pages base path: {href}")
        assert_no_page_overflow(driver, "Part V index")
        driver.save_screenshot(str(ARTIFACT_DIR / "part-05-index.png"))
        report["part_index"] = {
            "dependency_stages": 5,
            "chapter_19_link": href,
        }
    except Exception:
        save_failure_screenshot(driver, "part-05-index-failure.png")
        raise
    finally:
        driver.quit()


def desktop_and_interaction_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=1440, height=1200)
    try:
        load_with_retry(driver, CHAPTER_URL, "Chapter 19")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".katex")) > 0
        )

        title = driver.title
        if "Chapter 19" not in title:
            fail(f"Unexpected Chapter 19 title: {title}")
        if grid_column_count(driver, ".bilingual-section__grid") != 2:
            fail("Chapter 19 desktop bilingual layout is not two columns")
        katex_count = len(driver.find_elements(By.CSS_SELECTOR, ".katex"))
        if katex_count < 20:
            fail(f"Expected at least 20 rendered KaTeX expressions, found {katex_count}")
        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr"))
        if source_rows != 6:
            fail(f"Chapter 19 source map must contain six sections, found {source_rows}")
        contents_links = driver.find_elements(By.CSS_SELECTOR, ".chapter19-contents a")
        if len(contents_links) != 10:
            fail(f"Chapter 19 contents must contain ten links, found {len(contents_links)}")

        dt_slider = driver.find_element(By.CSS_SELECTOR, "#ch19-bo-trajectory [data-dt]")
        numeric_curve = driver.find_element(By.CSS_SELECTOR, "#ch19-bo-trajectory [data-numeric]")
        error_output = driver.find_element(By.CSS_SELECTOR, "#ch19-bo-trajectory [data-error]")
        old_dt = dt_slider.get_attribute("value")
        old_points = numeric_curve.get_attribute("points")
        old_error = error_output.text
        focus_for_keyboard(driver, dt_slider)
        dt_slider.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(
            lambda _: dt_slider.get_attribute("value") != old_dt
            and numeric_curve.get_attribute("points") != old_points
            and error_output.text != old_error
        )

        basis_select = driver.find_element(
            By.CSS_SELECTOR,
            "#ch19-force-decomposition [data-basis]",
        )
        pulay_branch = driver.find_element(
            By.CSS_SELECTOR,
            '#ch19-force-decomposition [data-branch="pulay"]',
        )
        focus_for_keyboard(driver, basis_select)
        basis_select.send_keys(Keys.HOME)
        WebDriverWait(driver, 10).until(
            lambda _: "branch--inactive" in (pulay_branch.get_attribute("class") or "")
        )
        basis_select.send_keys(Keys.END)
        WebDriverWait(driver, 10).until(
            lambda _: "branch--inactive" not in (pulay_branch.get_attribute("class") or "")
        )

        mass_slider = driver.find_element(By.CSS_SELECTOR, "#ch19-bomd-cpmd-flow [data-mass]")
        electronic_output = driver.find_element(
            By.CSS_SELECTOR,
            "#ch19-bomd-cpmd-flow [data-electronic-output]",
        )
        ratio_output = driver.find_element(
            By.CSS_SELECTOR,
            "#ch19-bomd-cpmd-flow [data-ratio]",
        )
        old_mass = mass_slider.get_attribute("value")
        old_frequency = electronic_output.text
        old_ratio = ratio_output.text
        focus_for_keyboard(driver, mass_slider)
        mass_slider.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(
            lambda _: mass_slider.get_attribute("value") != old_mass
            and electronic_output.text != old_frequency
            and ratio_output.text != old_ratio
        )

        assert_no_page_overflow(driver, "Chapter 19 desktop")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-19-desktop.png"))
        report["desktop"] = {
            "title": title,
            "katex_count": katex_count,
            "source_map_rows": source_rows,
            "contents_links": len(contents_links),
            "keyboard_controls": ["verlet_timestep", "basis_selector", "cp_fictitious_mass"],
        }

        driver.set_window_size(390, 844)
        driver.refresh()
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".bilingual-section__grid")) > 0
        )
        if grid_column_count(driver, ".bilingual-section__grid") != 1:
            fail("Chapter 19 narrow bilingual layout is not a single column")
        assert_no_page_overflow(driver, "Chapter 19 narrow")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-19-narrow.png"))
        report["narrow"] = {"viewport": [390, 844], "bilingual_columns": 1}
    except Exception:
        save_failure_screenshot(driver, "chapter-19-desktop-failure.png")
        raise
    finally:
        driver.quit()


def no_javascript_smoke(report: dict) -> None:
    driver = new_driver(javascript=False, width=1280, height=1000)
    try:
        load_with_retry(driver, CHAPTER_URL, "No-JavaScript fallback")
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        if len(contracts) != 3:
            fail(f"Chapter 19 must retain three visualization contracts, found {len(contracts)}")
        if not all(contract.is_displayed() for contract in contracts):
            fail("A Chapter 19 no-JavaScript visualization contract is hidden")

        figures = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual")
        if len(figures) != 3:
            fail(f"Chapter 19 must retain three teaching figures, found {len(figures)}")
        if not all(figure.is_displayed() for figure in figures):
            fail("A Chapter 19 no-JavaScript teaching figure is hidden")

        fallback_text = driver.find_elements(By.XPATH, "//*[contains(text(), '无 JavaScript fallback')]")
        if len(fallback_text) < 3:
            fail("Chapter 19 does not expose all three no-JavaScript fallback explanations")

        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr"))
        if source_rows != 6:
            fail("No-JavaScript Chapter 19 source map lost one or more sections")
        assert_no_page_overflow(driver, "Chapter 19 no-JavaScript")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-19-no-javascript.png"))
        report["no_javascript"] = {
            "visualization_contracts": len(contracts),
            "teaching_figures": len(figures),
            "fallback_explanations": len(fallback_text),
            "source_map_rows": source_rows,
        }
    except Exception:
        save_failure_screenshot(driver, "chapter-19-no-javascript-failure.png")
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
        print(f"Chapter 19 Pages smoke test failed: {exc}", file=sys.stderr)
        raise
