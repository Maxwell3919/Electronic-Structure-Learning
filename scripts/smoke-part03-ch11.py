#!/usr/bin/env python3
"""Live GitHub Pages smoke test for Martin Part III Chapter 11."""

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
PART_PATH = "part-03-important-preliminaries-on-atoms/"
CHAPTER_PATH = PART_PATH + "chapter-11-pseudopotentials/"
PART_URL = urljoin(BASE_URL, PART_PATH)
CHAPTER_URL = urljoin(BASE_URL, CHAPTER_PATH)
MANIFEST_URL = urljoin(BASE_URL, "deployment-manifest.json")


def fail(message: str) -> None:
    raise AssertionError(message)


def fetch_current_manifest(attempts: int = 30, delay: float = 5.0) -> dict:
    last_error: Exception | None = None
    for _ in range(attempts):
        try:
            request = urllib.request.Request(
                MANIFEST_URL,
                headers={"User-Agent": "Electronic-Structure-Learning-Part03-Ch11-Smoke/1"},
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


def numeric_text(element: WebElement) -> float:
    return float(element.text.strip())


def save_failure_screenshot(driver: webdriver.Chrome, filename: str) -> None:
    try:
        driver.save_screenshot(str(ARTIFACT_DIR / filename))
    except Exception:
        pass


def assert_no_horizontal_overflow(driver: webdriver.Chrome, context: str) -> None:
    width, viewport = driver.execute_script(
        "return [document.documentElement.scrollWidth, window.innerWidth];"
    )
    if width > viewport + 2:
        fail(f"{context} has horizontal overflow: scrollWidth={width}, innerWidth={viewport}")


def desktop_and_interaction_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=1440, height=1200)
    try:
        load_with_retry(driver, PART_URL, "Atoms and Pseudopotentials")
        if "Part III" not in driver.title:
            fail(f"Unexpected Part III page title: {driver.title}")
        if grid_column_count(driver, ".bilingual-section__grid") != 2:
            fail("Part III desktop bilingual layout is not two columns")
        chapter_link = driver.find_element(By.CSS_SELECTOR, 'a[href*="chapter-11-pseudopotentials"]')
        if "/Electronic-Structure-Learning/" not in (chapter_link.get_attribute("href") or ""):
            fail("Chapter 11 link escaped the GitHub Pages base path")
        driver.save_screenshot(str(ARTIFACT_DIR / "part-03-index-ch11-desktop.png"))

        load_with_retry(driver, CHAPTER_URL, "Norm-Conserving Pseudopotentials")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".katex")) > 0
        )
        if "Chapter 11" not in driver.title:
            fail(f"Unexpected Chapter 11 page title: {driver.title}")
        if grid_column_count(driver, ".bilingual-section__grid") != 2:
            fail("Chapter 11 desktop bilingual layout is not two columns")
        assert_no_horizontal_overflow(driver, "Chapter 11 desktop page")

        katex_count = len(driver.find_elements(By.CSS_SELECTOR, ".katex"))
        if katex_count < 70:
            fail(f"Expected at least 70 rendered KaTeX expressions, received {katex_count}")
        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr"))
        if source_rows != 13:
            fail(f"Chapter 11 source map should contain 13 rows, received {source_rows}")
        contents_links = driver.find_elements(By.CSS_SELECTOR, ".chapter-contents a")
        if len(contents_links) < 18:
            fail(f"Chapter 11 contents is incomplete: {len(contents_links)} links")
        for link in contents_links:
            href = link.get_attribute("href") or ""
            if "/Electronic-Structure-Learning/" not in href:
                fail(f"Chapter link escaped the Pages base path: {href}")

        visuals = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual")
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        if len(visuals) != 5 or len(contracts) != 5:
            fail(f"Expected five visuals and contracts, received {len(visuals)} and {len(contracts)}")
        if not all(item.is_displayed() for item in contracts):
            fail("A Chapter 11 visualization contract is hidden")

        wave = driver.find_element(By.CSS_SELECTOR, "[data-pseudo-wave-matching]")
        rc_slider = wave.find_element(By.CSS_SELECTOR, "[data-rc]")
        norm_difference = wave.find_element(By.CSS_SELECTOR, "[data-norm-difference]")
        exterior_difference = wave.find_element(By.CSS_SELECTOR, "[data-exterior-difference]")
        focus_for_keyboard(driver, rc_slider)
        rc_slider.send_keys(Keys.END)
        WebDriverWait(driver, 10).until(lambda _: abs(numeric_text(norm_difference)) < 1e-8)
        if abs(numeric_text(exterior_difference)) > 1e-12:
            fail("Pseudo-wave model lost exact exterior matching")
        norm_select = wave.find_element(By.CSS_SELECTOR, "[data-norm-mode]")
        focus_for_keyboard(driver, norm_select)
        norm_select.send_keys(Keys.END)
        WebDriverWait(driver, 10).until(lambda _: abs(numeric_text(norm_difference)) > 1e-5)
        norm_select.send_keys(Keys.HOME)
        WebDriverWait(driver, 10).until(lambda _: abs(numeric_text(norm_difference)) < 1e-8)

        log_model = driver.find_element(By.CSS_SELECTOR, "[data-log-derivative]")
        energy_slider = log_model.find_element(By.CSS_SELECTOR, "[data-energy]")
        log_difference = log_model.find_element(By.CSS_SELECTOR, "[data-difference]")
        focus_for_keyboard(driver, energy_slider)
        energy_slider.send_keys(Keys.END)
        WebDriverWait(driver, 10).until(lambda _: numeric_text(log_difference) < 1e-8)
        depth_slider = log_model.find_element(By.CSS_SELECTOR, "[data-depth]")
        weak_depth = log_model.find_element(By.CSS_SELECTOR, "[data-weak-depth]")
        weak_before = weak_depth.text
        focus_for_keyboard(driver, depth_slider)
        depth_slider.send_keys(Keys.HOME)
        WebDriverWait(driver, 10).until(lambda _: weak_depth.text != weak_before)
        if numeric_text(log_difference) >= 1e-8:
            fail("Matched square wells do not agree at the reference energy")

        hardness = driver.find_element(By.CSS_SELECTOR, "[data-hardness-explorer]")
        hardness_rc = hardness.find_element(By.CSS_SELECTOR, "[data-rc]")
        q_cut = hardness.find_element(By.CSS_SELECTOR, "[data-q-cut]")
        product = hardness.find_element(By.CSS_SELECTOR, "[data-product]")
        focus_for_keyboard(driver, hardness_rc)
        hardness_rc.send_keys(Keys.HOME)
        q_small_rc = numeric_text(q_cut)
        product_small_rc = numeric_text(product)
        hardness_rc.send_keys(Keys.END)
        WebDriverWait(driver, 10).until(lambda _: numeric_text(q_cut) < q_small_rc)
        if abs(numeric_text(product) - product_small_rc) > 1e-5:
            fail("Hardness model does not preserve rc*qcut at fixed tolerance")

        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-11-desktop.png"))
        report["desktop"] = {
            "title": driver.title,
            "katex_count": katex_count,
            "source_map_rows": source_rows,
            "contents_links": len(contents_links),
            "visuals": len(visuals),
            "visualization_contracts": len(contracts),
            "keyboard_controls": [
                "pseudo_core_radius", "norm_mode", "reference_energy",
                "strong_well_depth", "hardness_core_radius",
            ],
        }

        driver.set_window_size(390, 844)
        driver.refresh()
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".bilingual-section__grid")) > 0
        )
        if grid_column_count(driver, ".bilingual-section__grid") != 1:
            fail("Chapter 11 narrow-screen bilingual layout is not a single column")
        if not driver.find_element(By.CSS_SELECTOR, ".chapter-contents").is_displayed():
            fail("Chapter 11 contents is hidden on the narrow viewport")
        assert_no_horizontal_overflow(driver, "Chapter 11 narrow page")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-11-narrow.png"))
        report["narrow"] = {"viewport": [390, 844], "bilingual_columns": 1}
    except Exception:
        save_failure_screenshot(driver, "chapter-11-desktop-failure.png")
        raise
    finally:
        driver.quit()


def no_javascript_smoke(report: dict) -> None:
    driver = new_driver(javascript=False, width=1280, height=1000)
    try:
        load_with_retry(driver, CHAPTER_URL, "Original teaching model")
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        static_svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        if len(contracts) != 5 or not all(item.is_displayed() for item in contracts):
            fail("No-JavaScript page does not retain all five visualization contracts")
        if len(static_svgs) != 5 or not all(item.is_displayed() for item in static_svgs):
            fail("No-JavaScript page does not retain all five static SVGs")
        if len(driver.find_elements(By.CSS_SELECTOR, "noscript")) < 3:
            fail("Interactive no-JavaScript fallbacks are incomplete")
        if len(driver.find_elements(By.CSS_SELECTOR, ".katex")) < 70:
            fail("No-JavaScript page lost rendered formulas")
        if len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr")) != 13:
            fail("No-JavaScript page lost the thirteen-row source map")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-11-no-javascript.png"))
        report["no_javascript"] = {
            "visualization_contracts": len(contracts),
            "static_svg_count": len(static_svgs),
            "noscript_count": len(driver.find_elements(By.CSS_SELECTOR, "noscript")),
        }
    except Exception:
        save_failure_screenshot(driver, "chapter-11-no-javascript-failure.png")
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
        "chapter_url": CHAPTER_URL,
        "manifest_url": MANIFEST_URL,
        "manifest": manifest,
    }
    desktop_and_interaction_smoke(report)
    no_javascript_smoke(report)

    report_path = ARTIFACT_DIR / "part03-ch11-report.json"
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
        (ARTIFACT_DIR / "part03-ch11-failure.json").write_text(
            json.dumps(failure, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        print(f"Part III Chapter 11 Pages smoke test failed: {exc}", file=sys.stderr)
        raise