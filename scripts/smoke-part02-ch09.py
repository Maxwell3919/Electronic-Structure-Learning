#!/usr/bin/env python3
"""Live GitHub Pages smoke test for Martin Part II Chapter 9."""

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


ARTIFACT_DIR = Path(os.environ.get("SMOKE_ARTIFACT_DIR", "artifacts/pages-smoke")) / "chapter-09"
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
BASE_URL = os.environ["PAGES_URL"].rstrip("/") + "/"
EXPECTED_SHA = os.environ["DEPLOYED_SHA"]
PART_PATH = "part-02-density-functional-theory/"
CHAPTER_PATH = PART_PATH + "chapter-09-functionals-for-exchange-and-correlation-ii/"
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
                headers={"User-Agent": "Electronic-Structure-Learning-Part02-Ch09-Smoke/1"},
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


def save_failure_screenshot(driver: webdriver.Chrome, filename: str) -> None:
    try:
        driver.save_screenshot(str(ARTIFACT_DIR / filename))
    except Exception:
        pass


def assert_no_horizontal_overflow(driver: webdriver.Chrome, label: str) -> None:
    dimensions = driver.execute_script(
        "return {scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth};"
    )
    if dimensions["scrollWidth"] > dimensions["innerWidth"] + 2:
        fail(
            f"{label} horizontal overflow: scrollWidth={dimensions['scrollWidth']} "
            f"innerWidth={dimensions['innerWidth']}"
        )


def desktop_and_interaction_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=1440, height=1200)
    try:
        load_with_retry(driver, PART_URL, "Density Functional Theory")
        if "Part II" not in driver.title:
            fail(f"Unexpected Part II title: {driver.title}")
        if grid_column_count(driver, ".bilingual-section__grid") != 2:
            fail("Part II desktop bilingual layout is not two columns")
        driver.save_screenshot(str(ARTIFACT_DIR / "part-02-index-ch09-desktop.png"))

        load_with_retry(driver, CHAPTER_URL, "Functionals for Exchange and Correlation II")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".katex")) > 0
        )
        if "Chapter 9" not in driver.title:
            fail(f"Unexpected Chapter 9 title: {driver.title}")
        if grid_column_count(driver, ".bilingual-section__grid") != 2:
            fail("Chapter 9 desktop bilingual layout is not two columns")

        katex_count = len(driver.find_elements(By.CSS_SELECTOR, ".katex"))
        if katex_count < 180:
            fail(f"Expected at least 180 rendered KaTeX nodes, received {katex_count}")
        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr"))
        if source_rows != 10:
            fail(f"Chapter 9 source map should contain ten rows, received {source_rows}")
        contents_links = driver.find_elements(By.CSS_SELECTOR, ".chapter-contents a")
        if len(contents_links) < 15:
            fail(f"Chapter 9 contents is incomplete: {len(contents_links)} links")
        for link in contents_links:
            href = link.get_attribute("href") or ""
            if "/Electronic-Structure-Learning/" not in href:
                fail(f"Chapter link escaped the Pages base path: {href}")

        omega_slider = driver.find_element(By.CSS_SELECTOR, "[data-rh-omega]")
        hybrid_output = driver.find_element(By.CSS_SELECTOR, "[data-rh-weight]")
        hybrid_before = hybrid_output.text
        focus_for_keyboard(driver, omega_slider)
        omega_slider.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(lambda _: hybrid_output.text != hybrid_before)

        meta_slider = driver.find_element(By.CSS_SELECTOR, "[data-meta-scale]")
        meta_output = driver.find_element(By.CSS_SELECTOR, "[data-meta-alpha]")
        meta_before = meta_output.text
        focus_for_keyboard(driver, meta_slider)
        meta_slider.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(lambda _: meta_output.text != meta_before)

        u_slider = driver.find_element(By.CSS_SELECTOR, "[data-dftu-u]")
        curvature_output = driver.find_element(By.CSS_SELECTOR, "[data-dftu-curvature]")
        curvature_before = curvature_output.text
        focus_for_keyboard(driver, u_slider)
        u_slider.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(lambda _: curvature_output.text != curvature_before)

        alpha_slider = driver.find_element(By.CSS_SELECTOR, "[data-vdw-alpha-a]")
        c6_output = driver.find_element(By.CSS_SELECTOR, "[data-vdw-c6]")
        c6_before = c6_output.text
        focus_for_keyboard(driver, alpha_slider)
        alpha_slider.send_keys(Keys.ARROW_RIGHT)
        WebDriverWait(driver, 10).until(lambda _: c6_output.text != c6_before)

        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        if len(contracts) != 4:
            fail(f"Expected four visualization contracts, received {len(contracts)}")
        if not all(contract.is_displayed() for contract in contracts):
            fail("A Chapter 9 visualization contract is hidden")

        assert_no_horizontal_overflow(driver, "Chapter 9 desktop")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-09-desktop.png"))
        report["desktop"] = {
            "title": driver.title,
            "katex_count": katex_count,
            "source_map_rows": source_rows,
            "contents_links": len(contents_links),
            "visualization_contracts": len(contracts),
            "keyboard_controls": ["range_omega", "meta_alpha", "dftu_u", "vdw_alpha"],
        }

        driver.set_window_size(390, 844)
        driver.refresh()
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".bilingual-section__grid")) > 0
        )
        if grid_column_count(driver, ".bilingual-section__grid") != 1:
            fail("Chapter 9 narrow-screen bilingual layout is not one column")
        assert_no_horizontal_overflow(driver, "Chapter 9 narrow")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-09-narrow.png"))
        report["narrow"] = {"viewport": [390, 844], "bilingual_columns": 1}
    except Exception:
        save_failure_screenshot(driver, "chapter-09-desktop-failure.png")
        raise
    finally:
        driver.quit()


def no_javascript_smoke(report: dict) -> None:
    driver = new_driver(javascript=False, width=1280, height=1000)
    try:
        load_with_retry(driver, CHAPTER_URL, "Original interactive model")
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        if len(contracts) != 4 or not all(item.is_displayed() for item in contracts):
            fail("No-JavaScript page does not retain four visualization contracts")
        static_svgs = driver.find_elements(By.CSS_SELECTOR, "figure.chapter-visual > svg")
        if len(static_svgs) != 4 or not all(item.is_displayed() for item in static_svgs):
            fail(f"Expected four direct static SVG fallbacks, received {len(static_svgs)}")
        if len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr")) != 10:
            fail("No-JavaScript page lost the ten-row source map")
        assert_no_horizontal_overflow(driver, "Chapter 9 no-JavaScript")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-09-no-javascript.png"))
        report["no_javascript"] = {
            "visualization_contracts": len(contracts),
            "direct_static_svg_count": len(static_svgs),
            "source_map_rows": 10,
        }
    except Exception:
        save_failure_screenshot(driver, "chapter-09-no-javascript-failure.png")
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

    report_path = ARTIFACT_DIR / "part02-ch09-report.json"
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
        (ARTIFACT_DIR / "part02-ch09-failure.json").write_text(
            json.dumps(failure, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        print(f"Part II Chapter 9 Pages smoke test failed: {exc}", file=sys.stderr)
        raise
