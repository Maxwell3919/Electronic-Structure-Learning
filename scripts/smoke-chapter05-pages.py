#!/usr/bin/env python3
"""Exact-SHA live GitHub Pages smoke test for Martin Part I Chapter 5."""

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
CHAPTER_PATH = "part-01-overview-and-background/chapter-05-uniform-electron-gas-and-sp-bonded-metals/"
CHAPTER_URL = urljoin(BASE_URL, CHAPTER_PATH)
MANIFEST_URL = urljoin(BASE_URL, "deployment-manifest.json")


def fail(message: str) -> None:
    raise AssertionError(message)


def fetch_json_with_retry(url: str, attempts: int = 30, delay: float = 5.0) -> dict:
    last_error: Exception | None = None
    for _ in range(attempts):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "Electronic-Structure-Learning-Chapter05-Smoke/1"})
            with urllib.request.urlopen(request, timeout=20) as response:
                if response.status != 200:
                    fail(f"Expected HTTP 200 for {url}, received {response.status}")
                payload = json.load(response)
            if payload.get("sha") == EXPECTED_SHA:
                return payload
            last_error = AssertionError(f"Deployment manifest is stale: expected {EXPECTED_SHA}, received {payload.get('sha')}")
        except (OSError, ValueError, urllib.error.URLError, AssertionError) as exc:
            last_error = exc
        time.sleep(delay)
    raise AssertionError(f"Could not obtain current deployment manifest: {last_error}")


def chrome_options(*, javascript: bool, width: int, height: int) -> webdriver.ChromeOptions:
    options = webdriver.ChromeOptions()
    for argument in (
        "--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu",
        f"--window-size={width},{height}", "--force-device-scale-factor=1", "--lang=en-GB",
    ):
        options.add_argument(argument)
    browser = os.environ.get("CHROME_BIN")
    if not browser:
        for candidate in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser"):
            browser = shutil.which(candidate)
            if browser:
                break
    if browser:
        options.binary_location = browser
    if not javascript:
        options.add_experimental_option("prefs", {"profile.managed_default_content_settings.javascript": 2})
    return options


def new_driver(*, javascript: bool, width: int, height: int) -> webdriver.Chrome:
    try:
        driver = webdriver.Chrome(options=chrome_options(javascript=javascript, width=width, height=height))
    except WebDriverException as exc:
        raise AssertionError(f"Unable to start Chrome WebDriver: {exc}") from exc
    driver.set_page_load_timeout(45)
    return driver


def load_with_retry(driver: webdriver.Chrome, marker: str, attempts: int = 12) -> None:
    last_error: Exception | None = None
    for _ in range(attempts):
        try:
            driver.get(CHAPTER_URL)
            WebDriverWait(driver, 20).until(lambda active: marker in active.page_source)
            return
        except Exception as exc:
            last_error = exc
            time.sleep(5)
    raise AssertionError(f"Could not load current page {CHAPTER_URL}: {last_error}")


def grid_column_count(driver: webdriver.Chrome, selector: str) -> int:
    element = driver.find_element(By.CSS_SELECTOR, selector)
    value = driver.execute_script("return window.getComputedStyle(arguments[0]).gridTemplateColumns;", element)
    return len([item for item in str(value).split() if item])


def focus_for_keyboard(driver: webdriver.Chrome, element: WebElement) -> None:
    driver.execute_script("arguments[0].scrollIntoView({block:'center'}); arguments[0].focus({preventScroll:true});", element)
    WebDriverWait(driver, 10).until(lambda _: driver.execute_script("return document.activeElement === arguments[0];", element))


def save_failure_screenshot(driver: webdriver.Chrome, filename: str) -> None:
    try:
        driver.save_screenshot(str(ARTIFACT_DIR / filename))
    except Exception:
        pass


def desktop_and_interaction_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=1440, height=1200)
    try:
        load_with_retry(driver, "Chapter 5")
        WebDriverWait(driver, 20).until(lambda active: len(active.find_elements(By.CSS_SELECTOR, ".chapter05-root .katex")) > 0)
        title = driver.title
        if "Chapter 5" not in title:
            fail(f"Unexpected page title: {title}")
        if grid_column_count(driver, ".chapter05-root .bilingual-section__grid") != 2:
            fail("Desktop Chapter 5 bilingual layout is not two columns")

        katex_count = len(driver.find_elements(By.CSS_SELECTOR, ".chapter05-root .katex"))
        if katex_count < 120:
            fail(f"Expected at least 120 Chapter 5 KaTeX nodes, found {katex_count}")
        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter05-root .chapter-source-map tbody tr"))
        if source_rows != 5:
            fail(f"Chapter 5 source map must contain 5 rows, found {source_rows}")
        contents_links = driver.find_elements(By.CSS_SELECTOR, ".chapter05-root .chapter-contents a")
        if len(contents_links) < 10:
            fail(f"Chapter 5 contents is incomplete: found {len(contents_links)} links")
        for link in contents_links:
            href = link.get_attribute("href") or ""
            if "/Electronic-Structure-Learning/" not in href:
                fail(f"Chapter link escaped the Pages base path: {href}")

        rs_slider = driver.find_element(By.CSS_SELECTOR, "[data-ch05-rs]")
        density = driver.find_element(By.CSS_SELECTOR, "[data-ch05-scale-density]")
        focus_for_keyboard(driver, rs_slider)
        rs_slider.send_keys(Keys.HOME)
        WebDriverWait(driver, 10).until(lambda _: rs_slider.get_attribute("value") == "1")
        dense_text = density.text
        rs_slider.send_keys(Keys.END)
        WebDriverWait(driver, 10).until(lambda _: rs_slider.get_attribute("value") == "8" and density.text != dense_text)

        y_slider = driver.find_element(By.CSS_SELECTOR, "[data-ch05-hole-y]")
        kernel_readout = driver.find_element(By.CSS_SELECTOR, "[data-ch05-hole-kernel-readout]")
        pair_readout = driver.find_element(By.CSS_SELECTOR, "[data-ch05-hole-pair]")
        cursor = driver.find_element(By.CSS_SELECTOR, "[data-ch05-hole-cursor]")
        focus_for_keyboard(driver, y_slider)
        y_slider.send_keys(Keys.HOME)
        WebDriverWait(driver, 10).until(lambda _: y_slider.get_attribute("value") == "0" and "1.0000" in kernel_readout.text and "g↑↑ = 0.0000" in pair_readout.text)
        origin_cursor = cursor.get_attribute("x1")
        y_slider.send_keys(Keys.END)
        WebDriverWait(driver, 10).until(lambda _: y_slider.get_attribute("value") == "18" and cursor.get_attribute("x1") != origin_cursor)

        x_slider = driver.find_element(By.CSS_SELECTOR, "[data-ch05-lindhard-x]")
        lindhard_shape = driver.find_element(By.CSS_SELECTOR, "[data-ch05-lindhard-shape-readout]")
        lindhard_cursor = driver.find_element(By.CSS_SELECTOR, "[data-ch05-lindhard-cursor]")
        focus_for_keyboard(driver, x_slider)
        x_slider.send_keys(Keys.HOME)
        WebDriverWait(driver, 10).until(lambda _: x_slider.get_attribute("value") == "0.02")
        low_shape = lindhard_shape.text
        low_cursor = lindhard_cursor.get_attribute("x1")
        x_slider.send_keys(Keys.END)
        WebDriverWait(driver, 10).until(lambda _: x_slider.get_attribute("value") == "2.5" and lindhard_shape.text != low_shape and lindhard_cursor.get_attribute("x1") != low_cursor)

        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-05-desktop.png"))
        report["desktop"] = {
            "title": title,
            "katex_count": katex_count,
            "source_map_rows": source_rows,
            "contents_links": len(contents_links),
            "keyboard_controls": ["density_radius", "exchange_hole_separation", "lindhard_wavevector"],
        }

        driver.set_window_size(390, 844)
        driver.refresh()
        WebDriverWait(driver, 20).until(lambda active: len(active.find_elements(By.CSS_SELECTOR, ".chapter05-root .bilingual-section__grid")) > 0)
        if grid_column_count(driver, ".chapter05-root .bilingual-section__grid") != 1:
            fail("Narrow-screen Chapter 5 bilingual layout is not one column")
        if grid_column_count(driver, ".chapter05-root .chapter-visual__controls") != 1:
            fail("Narrow-screen Chapter 5 controls are not one column")
        overflow = float(driver.execute_script("return document.documentElement.scrollWidth - window.innerWidth;"))
        if overflow > 1:
            fail(f"Chapter 5 creates narrow-screen horizontal overflow of {overflow}px")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-05-narrow.png"))
        report["narrow"] = {"viewport": [390, 844], "bilingual_columns": 1, "control_columns": 1, "horizontal_overflow_px": overflow}
    except Exception:
        save_failure_screenshot(driver, "chapter-05-desktop-failure.png")
        raise
    finally:
        driver.quit()


def no_javascript_smoke(report: dict) -> None:
    driver = new_driver(javascript=False, width=1280, height=1000)
    try:
        load_with_retry(driver, "Original interactive model")
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter05-root .chapter-visual__contract")
        svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter05-root .chapter-visual svg")
        controls = driver.find_elements(By.CSS_SELECTOR, ".chapter05-root .chapter-visual input[type='range']")
        if len(contracts) != 3 or not all(item.is_displayed() for item in contracts):
            fail(f"Expected three visible Chapter 5 contracts, found {len(contracts)}")
        if len(svgs) != 3 or not all(item.is_displayed() for item in svgs):
            fail(f"Expected three visible Chapter 5 SVGs, found {len(svgs)}")
        if len(controls) != 6:
            fail(f"Expected six native range controls, found {len(controls)}")
        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter05-root .chapter-source-map tbody tr"))
        if source_rows != 5:
            fail("No-JavaScript Chapter 5 page lost source rows")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-05-no-javascript.png"))
        report["no_javascript"] = {"visualization_contracts": 3, "static_svg_count": 3, "native_range_controls": 6, "source_map_rows": source_rows}
    except Exception:
        save_failure_screenshot(driver, "chapter-05-no-javascript-failure.png")
        raise
    finally:
        driver.quit()


def main() -> int:
    manifest = fetch_json_with_retry(MANIFEST_URL)
    if manifest.get("repository") != "Maxwell3919/Electronic-Structure-Learning":
        fail(f"Unexpected manifest repository: {manifest.get('repository')}")
    if manifest.get("workflow") != "Deploy to GitHub Pages":
        fail(f"Unexpected deployment workflow: {manifest.get('workflow')}")
    report: dict = {"base_url": BASE_URL, "chapter_url": CHAPTER_URL, "manifest_url": MANIFEST_URL, "manifest": manifest}
    desktop_and_interaction_smoke(report)
    no_javascript_smoke(report)
    (ARTIFACT_DIR / "chapter-05-report.json").write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        failure = {"base_url": BASE_URL, "chapter_url": CHAPTER_URL, "manifest_url": MANIFEST_URL, "expected_sha": EXPECTED_SHA, "error_type": type(exc).__name__, "error": str(exc)}
        (ARTIFACT_DIR / "chapter-05-failure.json").write_text(json.dumps(failure, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        print(f"Chapter 5 Pages smoke test failed: {exc}", file=sys.stderr)
        raise
