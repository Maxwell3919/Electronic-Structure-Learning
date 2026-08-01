#!/usr/bin/env python3
"""Exact-SHA live GitHub Pages smoke test for Martin Part I Chapter 3."""

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
CHAPTER_PATH = "part-01-overview-and-background/chapter-03-theoretical-background/"
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
                headers={"User-Agent": "Electronic-Structure-Learning-Chapter03-Smoke/1"},
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


def assert_stress_audit(driver: webdriver.Chrome, context: str) -> WebElement:
    audits = driver.find_elements(By.CSS_SELECTOR, "[data-ch3-stress-trace-audit]")
    if len(audits) != 1:
        fail(f"{context} should contain one stress-trace audit, found {len(audits)}")
    audit = audits[0]
    if not audit.is_displayed():
        fail(f"{context} hides the stress-trace audit")
    if audit.get_attribute("data-pressure-trace-factor") != "-one-third":
        fail(f"{context} lost the pressure-trace factor")
    if audit.get_attribute("data-source-locators") != "3.23,3.24,G.4":
        fail(f"{context} lost the source locators")
    text = " ".join(audit.text.split())
    for marker in ("3.23", "3.24", "G.4"):
        if marker not in text:
            fail(f"{context} stress audit is missing {marker}")
    if "normalization inconsistency" not in text and "归一化不一致" not in text:
        fail(f"{context} stress audit does not label the source inconsistency")
    return audit


def assert_atomic_bilingual_status(driver: webdriver.Chrome, selector: str, zh_selector: str, en_selector: str, context: str) -> tuple[WebElement, WebElement, WebElement]:
    status = driver.find_element(By.CSS_SELECTOR, selector)
    if status.get_attribute("aria-live") != "polite":
        fail(f"{context} is not a polite live region")
    if status.get_attribute("aria-atomic") != "true":
        fail(f"{context} is not atomic")
    zh = driver.find_element(By.CSS_SELECTOR, zh_selector)
    en = driver.find_element(By.CSS_SELECTOR, en_selector)
    if not zh.is_displayed() or not en.is_displayed():
        fail(f"{context} hides one bilingual status line")
    if en.get_attribute("lang") != "en":
        fail(f"{context} English status lacks lang=en")
    return status, zh, en


def desktop_and_interaction_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=1440, height=1200)
    try:
        load_with_retry(driver, CHAPTER_URL, "Chapter 3")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".katex")) > 0
        )

        title = driver.title
        if "Chapter 3" not in title:
            fail(f"Unexpected page title: {title}")
        if grid_column_count(driver, ".chapter03-root .bilingual-section__grid") != 2:
            fail("Desktop Chapter 3 bilingual layout is not two columns")

        katex_count = len(driver.find_elements(By.CSS_SELECTOR, ".chapter03-root .katex"))
        if katex_count < 30:
            fail(f"Expected at least 30 rendered Chapter 3 KaTeX expressions, found {katex_count}")

        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter03-root .chapter-source-map tbody tr"))
        if source_rows != 7:
            fail(f"Chapter 3 source map must contain 7 Martin sections, found {source_rows}")

        contents_links = driver.find_elements(By.CSS_SELECTOR, ".chapter03-root .chapter-contents a")
        if len(contents_links) < 12:
            fail(f"Explicit Chapter 3 contents is incomplete: found {len(contents_links)} links")
        for link in contents_links:
            href = link.get_attribute("href") or ""
            if "/Electronic-Structure-Learning/" not in href:
                fail(f"Chapter link escaped the Pages base path: {href}")

        stress_audit = assert_stress_audit(driver, "Chapter 3 desktop page")
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'center', inline: 'nearest'});",
            stress_audit,
        )
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-03-stress-trace-audit-desktop.png"))

        _, force_zh, force_en = assert_atomic_bilingual_status(
            driver,
            "[data-ch03-avoided-status]",
            "[data-ch03-force-zh]",
            "[data-ch03-force-en]",
            "avoided-crossing status",
        )
        coupling = driver.find_element(By.CSS_SELECTOR, "[data-ch03-coupling]")
        energies = driver.find_element(By.CSS_SELECTOR, "[data-ch03-energies]")
        upper_curve = driver.find_element(By.CSS_SELECTOR, "[data-ch03-upper-curve]")
        focus_for_keyboard(driver, coupling)
        coupling.send_keys(Keys.HOME)
        WebDriverWait(driver, 10).until(lambda _: coupling.get_attribute("value") == "0")
        uncoupled_text = energies.text
        uncoupled_curve = upper_curve.get_attribute("d")
        coupling.send_keys(Keys.END)
        WebDriverWait(driver, 10).until(
            lambda _: coupling.get_attribute("value") == "1.5"
            and energies.text != uncoupled_text
            and upper_curve.get_attribute("d") != uncoupled_curve
            and "低能绝热面力" in force_zh.text
            and "Lower-surface force" in force_en.text
        )

        _, dm_summary_zh, dm_summary_en = assert_atomic_bilingual_status(
            driver,
            "[data-ch03-dm-status]",
            "[data-ch03-dm-summary-zh]",
            "[data-ch03-dm-summary-en]",
            "density-matrix status",
        )
        temperature = driver.find_element(By.CSS_SELECTOR, "[data-ch03-dm-temperature]")
        probabilities = driver.find_element(By.CSS_SELECTOR, "[data-ch03-dm-probabilities]")
        purity = driver.find_element(By.CSS_SELECTOR, "[data-ch03-dm-purity]")
        focus_for_keyboard(driver, temperature)
        temperature.send_keys(Keys.HOME)
        WebDriverWait(driver, 10).until(
            lambda _: temperature.get_attribute("value") == "0"
            and "p0 = 1.000" in probabilities.text
            and "1.000" in purity.text
            and "零温非简并极限" in dm_summary_zh.text
            and "Zero-temperature nondegenerate limit" in dm_summary_en.text
        )
        pure_text = purity.text
        temperature.send_keys(Keys.END)
        WebDriverWait(driver, 10).until(
            lambda _: temperature.get_attribute("value") == "3"
            and purity.text != pure_text
            and "p1 = 0.000" not in probabilities.text
            and "热混合态" in dm_summary_zh.text
            and "thermally mixed" in dm_summary_en.text
        )

        _, hole_interpretation_zh, hole_interpretation_en = assert_atomic_bilingual_status(
            driver,
            "[data-ch03-hole-status]",
            "[data-ch03-hole-interpretation-zh]",
            "[data-ch03-hole-interpretation-en]",
            "exchange-correlation-hole status",
        )
        amplitude = driver.find_element(By.CSS_SELECTOR, "[data-ch03-hole-amplitude]")
        origin = driver.find_element(By.CSS_SELECTOR, "[data-ch03-hole-origin]")
        correlation_curve = driver.find_element(By.CSS_SELECTOR, "[data-ch03-hole-correlation]")
        integrals = driver.find_element(By.CSS_SELECTOR, "[data-ch03-hole-integrals]")
        focus_for_keyboard(driver, amplitude)
        amplitude.send_keys(Keys.HOME)
        WebDriverWait(driver, 10).until(
            lambda _: amplitude.get_attribute("value") == "0"
            and "nc = 0.000" in origin.text
            and "关联重排幅度为零" in hole_interpretation_zh.text
            and "zero correlation amplitude" in hole_interpretation_en.text
        )
        zero_curve = correlation_curve.get_attribute("d")
        amplitude.send_keys(Keys.END)
        WebDriverWait(driver, 10).until(
            lambda _: amplitude.get_attribute("value") == "0.8"
            and "nc = 0.000" not in origin.text
            and correlation_curve.get_attribute("d") != zero_curve
            and "加深短程耗尽" in hole_interpretation_zh.text
            and "deepens the short-range depletion" in hole_interpretation_en.text
        )
        if "Ix = -1; Ic = 0; Ixc = -1" not in integrals.text:
            fail(f"Unexpected hole-integral declaration: {integrals.text}")

        driver.execute_script("window.scrollTo(0, 0);")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-03-desktop.png"))
        report["desktop"] = {
            "title": title,
            "katex_count": katex_count,
            "source_map_rows": source_rows,
            "contents_links": len(contents_links),
            "stress_trace_audit": {
                "displayed": True,
                "pressure_trace_factor": "-one-third",
                "source_locators": ["3.23", "3.24", "G.4"],
            },
            "bilingual_atomic_statuses": ["avoided_crossing", "density_matrix", "xc_hole"],
            "keyboard_controls": ["avoided_crossing_coupling", "density_matrix_temperature", "hole_amplitude"],
        }

        driver.set_window_size(390, 844)
        driver.refresh()
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".chapter03-root .bilingual-section__grid")) > 0
        )
        if grid_column_count(driver, ".chapter03-root .bilingual-section__grid") != 1:
            fail("Narrow-screen Chapter 3 bilingual layout is not one column")
        narrow_audit = assert_stress_audit(driver, "Chapter 3 narrow page")
        for selector in (
            "[data-ch03-force-zh]", "[data-ch03-force-en]",
            "[data-ch03-dm-summary-zh]", "[data-ch03-dm-summary-en]",
            "[data-ch03-hole-interpretation-zh]", "[data-ch03-hole-interpretation-en]",
        ):
            if not driver.find_element(By.CSS_SELECTOR, selector).is_displayed():
                fail(f"Narrow Chapter 3 page hides {selector}")
        overflow = driver.execute_script(
            "return document.documentElement.scrollWidth - window.innerWidth;"
        )
        if float(overflow) > 1:
            fail(f"Chapter 3 creates narrow-screen horizontal overflow of {overflow}px")
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'center', inline: 'nearest'});",
            narrow_audit,
        )
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-03-stress-trace-audit-narrow.png"))
        driver.execute_script("window.scrollTo(0, 0);")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-03-narrow.png"))
        report["narrow"] = {
            "viewport": [390, 844],
            "bilingual_columns": 1,
            "horizontal_overflow_px": float(overflow),
            "stress_trace_audit": True,
            "bilingual_atomic_statuses": 3,
        }
    except Exception:
        save_failure_screenshot(driver, "chapter-03-desktop-failure.png")
        raise
    finally:
        driver.quit()


def no_javascript_smoke(report: dict) -> None:
    driver = new_driver(javascript=False, width=1280, height=1000)
    try:
        load_with_retry(driver, CHAPTER_URL, "Original interactive model")
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter03-root .chapter-visual__contract")
        if len(contracts) != 3:
            fail(f"Expected three Chapter 3 visualization contracts, found {len(contracts)}")
        if not all(contract.is_displayed() for contract in contracts):
            fail("A Chapter 3 no-JavaScript visualization explanation is hidden")

        svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter03-root .chapter-visual svg")
        if len(svgs) != 3:
            fail(f"Expected three Chapter 3 static SVG fallbacks, found {len(svgs)}")
        if not all(svg.is_displayed() for svg in svgs):
            fail("A Chapter 3 static SVG fallback is hidden without JavaScript")

        controls = driver.find_elements(By.CSS_SELECTOR, ".chapter03-root .chapter-visual input[type='range']")
        if len(controls) != 6:
            fail(f"Expected six native range controls, found {len(controls)}")

        source_rows = len(driver.find_elements(By.CSS_SELECTOR, ".chapter03-root .chapter-source-map tbody tr"))
        if source_rows != 7:
            fail("No-JavaScript Chapter 3 page lost source-map sections")

        no_js_audit = assert_stress_audit(driver, "Chapter 3 no-JavaScript page")
        for status, zh, en, context in (
            ("[data-ch03-avoided-status]", "[data-ch03-force-zh]", "[data-ch03-force-en]", "no-JavaScript avoided-crossing status"),
            ("[data-ch03-dm-status]", "[data-ch03-dm-summary-zh]", "[data-ch03-dm-summary-en]", "no-JavaScript density-matrix status"),
            ("[data-ch03-hole-status]", "[data-ch03-hole-interpretation-zh]", "[data-ch03-hole-interpretation-en]", "no-JavaScript xc-hole status"),
        ):
            assert_atomic_bilingual_status(driver, status, zh, en, context)

        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'center', inline: 'nearest'});",
            no_js_audit,
        )
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-03-stress-trace-audit-no-javascript.png"))
        driver.execute_script("window.scrollTo(0, 0);")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-03-no-javascript.png"))
        report["no_javascript"] = {
            "visualization_contracts": len(contracts),
            "static_svg_count": len(svgs),
            "native_range_controls": len(controls),
            "source_map_rows": source_rows,
            "stress_trace_audit": True,
            "bilingual_atomic_statuses": 3,
        }
    except Exception:
        save_failure_screenshot(driver, "chapter-03-no-javascript-failure.png")
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

    report_path = ARTIFACT_DIR / "chapter-03-report.json"
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
        (ARTIFACT_DIR / "chapter-03-failure.json").write_text(
            json.dumps(failure, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        print(f"Chapter 3 Pages smoke test failed: {exc}", file=sys.stderr)
        raise
