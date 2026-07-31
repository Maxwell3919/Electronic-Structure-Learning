#!/usr/bin/env python3
"""Live GitHub Pages smoke test for Martin Part IV Chapter 15."""

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
PART_PATH = "part-04-determination-of-electronic-structure/"
CHAPTER_PATH = PART_PATH + "chapter-15-localized-orbitals-full-calculations/"
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
                headers={"User-Agent": "Electronic-Structure-Learning-Part04-Ch15-Smoke/1"},
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


def update_range_and_require_change(
    driver: webdriver.Chrome,
    control_selector: str,
    output_selector: str,
    label: str,
) -> None:
    control = driver.find_element(By.CSS_SELECTOR, control_selector)
    output = driver.find_element(By.CSS_SELECTOR, output_selector)
    focus_for_keyboard(driver, control)
    control.send_keys(Keys.HOME)
    WebDriverWait(driver, 10).until(lambda _: control.get_attribute("value") == control.get_attribute("min"))
    first = output.text
    control.send_keys(Keys.END)
    WebDriverWait(driver, 10).until(lambda _: control.get_attribute("value") == control.get_attribute("max"))
    WebDriverWait(driver, 10).until(lambda _: output.text != first)
    if output.text == first:
        fail(f"Keyboard control did not update {label}")


def desktop_and_interaction_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=1440, height=1400)
    try:
        load_with_retry(driver, PART_URL, "A unified route through the methods")
        if "Part IV" not in driver.title:
            fail(f"Unexpected Part IV page title: {driver.title}")
        if grid_column_count(driver, ".bilingual-section__grid") != 2:
            fail("Part IV desktop bilingual layout is not two columns")
        if "Chapter 14" not in driver.page_source or "Chapter 15" not in driver.page_source:
            fail("Part IV index does not expose Chapters 14 and 15")
        assert_no_page_overflow(driver, "Part IV desktop index")
        driver.save_screenshot(str(ARTIFACT_DIR / "part-04-index-ch15-desktop.png"))

        load_with_retry(driver, CHAPTER_URL, "Green’s Function and Recursion Methods")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".katex")) > 0
        )
        title = driver.title
        if "Chapter 15" not in title:
            fail(f"Unexpected Chapter 15 page title: {title}")
        if grid_column_count(driver, ".bilingual-section__grid") != 2:
            fail("Chapter 15 desktop bilingual layout is not two columns")

        katex_count = len(driver.find_elements(By.CSS_SELECTOR, ".katex"))
        if katex_count < 150:
            fail(f"Expected at least 150 rendered KaTeX expressions, received {katex_count}")
        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr"))
        if source_rows != 8:
            fail(f"Chapter 15 source map should contain eight rows, received {source_rows}")
        contents_links = driver.find_elements(By.CSS_SELECTOR, ".chapter15-contents a")
        if len(contents_links) != 12:
            fail(f"Chapter 15 contents should contain twelve links, received {len(contents_links)}")
        for link in contents_links:
            href = link.get_attribute("href") or ""
            if "/Electronic-Structure-Learning/" not in href:
                fail(f"Chapter 15 anchor escaped the Pages base path: {href}")

        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        static_svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        if len(contracts) != 5 or not all(item.is_displayed() for item in contracts):
            fail(f"Chapter 15 must expose five visible visualization contracts, found {len(contracts)}")
        if len(static_svgs) != 5 or not all(item.is_displayed() for item in static_svgs):
            fail(f"Chapter 15 must expose five visible SVGs, found {len(static_svgs)}")

        controls = [
            ("[data-gp-separation]", "[data-gp-prefactor]", "Gaussian separation"),
            ("[data-bc-cutoff]", "[data-bc-tail]", "basis confinement cutoff"),
            ("[data-dm-overlap]", "[data-dm-plain-trace]", "density-matrix overlap"),
            ("[data-pulay-overlap0]", "[data-pulay-overlap]", "moving-basis overlap"),
            ("[data-rec-broadening]", "[data-rec-centre]", "continued-fraction broadening"),
        ]
        for control, output, label in controls:
            update_range_and_require_change(driver, control, output, label)

        electron_count = float(driver.find_element(By.CSS_SELECTOR, "[data-dm-electron-count]").text)
        occupation = float(driver.find_element(By.CSS_SELECTOR, "[data-dm-occupation-output]").text)
        if abs(electron_count - occupation) > 1e-6:
            fail(f"Chapter 15 density-matrix model lost Tr(PS)=occupation: {electron_count} versus {occupation}")

        pulay_error = float(driver.find_element(By.CSS_SELECTOR, "[data-pulay-error]").text)
        if pulay_error > 1e-6:
            fail(f"Chapter 15 analytic/finite-difference force mismatch is too large: {pulay_error}")

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

        assert_no_page_overflow(driver, "Chapter 15 desktop")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-15-desktop.png"))
        report["desktop"] = {
            "title": title,
            "katex_count": katex_count,
            "source_map_rows": source_rows,
            "contents_links": len(contents_links),
            "visualization_contracts": len(contracts),
            "static_svg_count": len(static_svgs),
            "keyboard_controls": [item[2] for item in controls],
            "density_electron_count": electron_count,
            "density_occupation": occupation,
            "pulay_force_difference": pulay_error,
            "theme_tokens": theme_values,
        }

        driver.set_window_size(390, 844)
        driver.refresh()
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".bilingual-section__grid")) > 0
        )
        if grid_column_count(driver, ".bilingual-section__grid") != 1:
            fail("Chapter 15 narrow-screen bilingual layout is not one column")
        assert_no_page_overflow(driver, "Chapter 15 narrow screen")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-15-narrow.png"))
        report["narrow"] = {"viewport": [390, 844], "bilingual_columns": 1}
    except Exception:
        save_failure_screenshot(driver, "chapter-15-desktop-failure.png")
        raise
    finally:
        driver.quit()


def no_javascript_smoke(report: dict) -> None:
    driver = new_driver(javascript=False, width=1280, height=1200)
    try:
        load_with_retry(driver, CHAPTER_URL, "Green’s Function and Recursion Methods")
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        if len(contracts) != 5 or not all(item.is_displayed() for item in contracts):
            fail("No-JavaScript Chapter 15 page lost a visualization contract")
        if len(svgs) != 5 or not all(item.is_displayed() for item in svgs):
            fail("No-JavaScript Chapter 15 page lost a static SVG")
        if len(driver.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr")) != 8:
            fail("No-JavaScript Chapter 15 page lost a source-map row")
        fallbacks = driver.find_elements(By.XPATH, "//*[contains(text(), '无 JavaScript fallback')]")
        if len(fallbacks) < 5:
            fail(f"Chapter 15 should expose five no-JavaScript fallback explanations, found {len(fallbacks)}")
        assert_no_page_overflow(driver, "Chapter 15 no-JavaScript")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-15-no-javascript.png"))
        report["no_javascript"] = {
            "visualization_contracts": len(contracts),
            "static_svg_count": len(svgs),
            "source_map_rows": 8,
            "fallback_explanations": len(fallbacks),
        }
    except Exception:
        save_failure_screenshot(driver, "chapter-15-no-javascript-failure.png")
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

    report_path = ARTIFACT_DIR / "part04-ch15-report.json"
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
        (ARTIFACT_DIR / "part04-ch15-failure.json").write_text(
            json.dumps(failure, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        print(f"Part IV Chapter 15 Pages smoke test failed: {exc}", file=sys.stderr)
        raise
