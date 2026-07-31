#!/usr/bin/env python3
"""Live GitHub Pages smoke test for Martin Part III Chapter 10."""

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
CHAPTER_PATH = PART_PATH + "chapter-10-electronic-structure-of-atoms/"
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
                headers={"User-Agent": "Electronic-Structure-Learning-Part03-Smoke/1"},
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


def assert_soc_unit_convention(driver: webdriver.Chrome, context: str) -> tuple[WebElement, WebElement]:
    audits = driver.find_elements(By.CSS_SELECTOR, "[data-spin-orbit-unit-convention]")
    if len(audits) != 1:
        fail(f"{context} should contain exactly one spin-orbit unit audit, received {len(audits)}")
    audit = audits[0]
    if not audit.is_displayed():
        fail(f"{context} hides the spin-orbit unit audit")
    if audit.get_attribute("data-normalized-operator") != "LdotS-over-hbar2":
        fail(f"{context} spin-orbit audit lost the normalized operator declaration")
    if audit.get_attribute("data-xi-unit") != "energy":
        fail(f"{context} spin-orbit audit lost the xi energy-unit declaration")
    text = " ".join(audit.text.split())
    if "10.14" not in text:
        fail(f"{context} spin-orbit audit is missing Martin Eq. (10.14)")
    if "potential energy" not in text and "电子势能" not in text:
        fail(f"{context} spin-orbit audit is missing the potential-energy convention")

    model = driver.find_element(By.CSS_SELECTOR, "[data-spin-orbit]")
    if model.get_attribute("data-normalized-operator") != "LdotS-over-hbar2":
        fail(f"{context} spin-orbit model does not use L dot S over hbar squared")
    if model.get_attribute("data-xi-unit") != "energy":
        fail(f"{context} spin-orbit model does not declare xi as an energy")
    return audit, model


def desktop_and_interaction_smoke(report: dict) -> None:
    driver = new_driver(javascript=True, width=1440, height=1200)
    try:
        load_with_retry(driver, PART_URL, "Atoms and Pseudopotentials")
        if "Part III" not in driver.title:
            fail(f"Unexpected Part III page title: {driver.title}")
        if grid_column_count(driver, ".bilingual-section__grid") != 2:
            fail("Part III desktop bilingual layout is not two columns")
        part_chapter_link = driver.find_element(
            By.CSS_SELECTOR,
            'a[href*="chapter-10-electronic-structure-of-atoms"]',
        )
        if "/Electronic-Structure-Learning/" not in (part_chapter_link.get_attribute("href") or ""):
            fail("Part III chapter link escaped the GitHub Pages base path")
        driver.save_screenshot(str(ARTIFACT_DIR / "part-03-index-desktop.png"))

        load_with_retry(driver, CHAPTER_URL, "One-Electron Radial Schrödinger Equation")
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".katex")) > 0
        )
        if "Chapter 10" not in driver.title:
            fail(f"Unexpected Chapter 10 page title: {driver.title}")
        if grid_column_count(driver, ".bilingual-section__grid") != 2:
            fail("Chapter 10 desktop bilingual layout is not two columns")

        katex_count = len(driver.find_elements(By.CSS_SELECTOR, ".katex"))
        if katex_count < 35:
            fail(f"Expected at least 35 rendered KaTeX expressions, received {katex_count}")
        contents_links = driver.find_elements(By.CSS_SELECTOR, ".chapter-contents a")
        if len(contents_links) < 13:
            fail(f"Chapter 10 contents is incomplete: {len(contents_links)} links")
        for link in contents_links:
            href = link.get_attribute("href") or ""
            if "/Electronic-Structure-Learning/" not in href:
                fail(f"Chapter link escaped the Pages base path: {href}")

        soc_audit, _ = assert_soc_unit_convention(driver, "Chapter 10 desktop page")
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'center', inline: 'nearest'});",
            soc_audit,
        )
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-10-soc-unit-audit-desktop.png"))

        visuals = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual")
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        if len(visuals) != 6 or len(contracts) != 6:
            fail(f"Expected six visuals and contracts, received {len(visuals)} and {len(contracts)}")
        if not all(item.is_displayed() for item in contracts):
            fail("A Chapter 10 visualization contract is hidden")

        potential = driver.find_element(By.CSS_SELECTOR, "[data-radial-potential]")
        l_slider = potential.find_element(By.CSS_SELECTOR, "[data-l]")
        vl_output = potential.find_element(By.CSS_SELECTOR, "[data-vl]")
        focus_for_keyboard(driver, l_slider)
        l_slider.send_keys(Keys.HOME)
        WebDriverWait(driver, 10).until(lambda _: vl_output.text == "0.000")
        z_slider = potential.find_element(By.CSS_SELECTOR, "[data-z]")
        vc_output = potential.find_element(By.CSS_SELECTOR, "[data-vc]")
        vc_before = vc_output.text
        focus_for_keyboard(driver, z_slider)
        z_slider.send_keys(Keys.END)
        WebDriverWait(driver, 10).until(lambda _: vc_output.text != vc_before)

        hydrogenic = driver.find_element(By.CSS_SELECTOR, "[data-hydrogenic-radial]")
        state_select = hydrogenic.find_element(By.CSS_SELECTOR, "[data-state]")
        state_readout = hydrogenic.find_element(By.CSS_SELECTOR, "[data-state-readout]")
        focus_for_keyboard(driver, state_select)
        state_select.send_keys(Keys.END)
        WebDriverWait(driver, 10).until(lambda _: state_readout.text == "3d")
        if hydrogenic.find_element(By.CSS_SELECTOR, "[data-nodes]").text != "0":
            fail("Hydrogenic 3d node count is not zero")
        h_z_slider = hydrogenic.find_element(By.CSS_SELECTOR, "[data-z]")
        energy_output = hydrogenic.find_element(By.CSS_SELECTOR, "[data-energy]")
        energy_before = energy_output.text
        focus_for_keyboard(driver, h_z_slider)
        h_z_slider.send_keys(Keys.END)
        WebDriverWait(driver, 10).until(lambda _: energy_output.text != energy_before)

        soc = driver.find_element(By.CSS_SELECTOR, "[data-spin-orbit]")
        soc_l = soc.find_element(By.CSS_SELECTOR, "[data-l]")
        trace_output = soc.find_element(By.CSS_SELECTOR, "[data-trace]")
        focus_for_keyboard(driver, soc_l)
        soc_l.send_keys(Keys.END)
        WebDriverWait(driver, 10).until(lambda _: trace_output.text == "0.000000")
        soc_xi = soc.find_element(By.CSS_SELECTOR, "[data-xi]")
        focus_for_keyboard(driver, soc_xi)
        soc_xi.send_keys(Keys.HOME)
        WebDriverWait(driver, 10).until(lambda _: trace_output.text == "0.000000")

        delta = driver.find_element(By.CSS_SELECTOR, "[data-delta-scf]")
        minus_input = delta.find_element(By.CSS_SELECTOR, "[data-minus]")
        i_output = delta.find_element(By.CSS_SELECTOR, "[data-i]")
        i_before = i_output.text
        focus_for_keyboard(driver, minus_input)
        minus_input.send_keys(Keys.CONTROL, "a")
        minus_input.send_keys("-98.0")
        WebDriverWait(driver, 10).until(lambda _: i_output.text != i_before)

        driver.execute_script("window.scrollTo(0, 0);")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-10-desktop.png"))
        report["desktop"] = {
            "title": driver.title,
            "katex_count": katex_count,
            "contents_links": len(contents_links),
            "visuals": len(visuals),
            "visualization_contracts": len(contracts),
            "spin_orbit_unit_convention": {
                "displayed": True,
                "normalized_operator": "LdotS-over-hbar2",
                "xi_unit": "energy",
                "martin_equation": "10.14",
                "potential_energy_convention": True,
            },
            "keyboard_controls": [
                "radial_l", "radial_z", "hydrogenic_state", "hydrogenic_z",
                "soc_l", "soc_xi", "delta_energy",
            ],
        }

        driver.set_window_size(390, 844)
        driver.refresh()
        WebDriverWait(driver, 20).until(
            lambda active: len(active.find_elements(By.CSS_SELECTOR, ".bilingual-section__grid")) > 0
        )
        if grid_column_count(driver, ".bilingual-section__grid") != 1:
            fail("Chapter 10 narrow-screen bilingual layout is not a single column")
        if not driver.find_element(By.CSS_SELECTOR, ".chapter-contents").is_displayed():
            fail("Chapter 10 contents is hidden on the narrow viewport")
        narrow_audit, _ = assert_soc_unit_convention(driver, "Chapter 10 narrow page")
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'center', inline: 'nearest'});",
            narrow_audit,
        )
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-10-soc-unit-audit-narrow.png"))
        driver.execute_script("window.scrollTo(0, 0);")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-10-narrow.png"))
        report["narrow"] = {
            "viewport": [390, 844],
            "bilingual_columns": 1,
            "spin_orbit_unit_convention": True,
        }
    except Exception:
        save_failure_screenshot(driver, "chapter-10-desktop-failure.png")
        raise
    finally:
        driver.quit()


def no_javascript_smoke(report: dict) -> None:
    driver = new_driver(javascript=False, width=1280, height=1000)
    try:
        load_with_retry(driver, CHAPTER_URL, "Original teaching model")
        contracts = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        static_svgs = driver.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        if len(contracts) != 6 or not all(item.is_displayed() for item in contracts):
            fail("No-JavaScript page does not retain all six visualization contracts")
        if len(static_svgs) != 6 or not all(item.is_displayed() for item in static_svgs):
            fail("No-JavaScript page does not retain all six static SVGs")
        if len(driver.find_elements(By.CSS_SELECTOR, "noscript")) < 4:
            fail("No-JavaScript fallbacks are incomplete")
        if len(driver.find_elements(By.CSS_SELECTOR, ".katex")) < 35:
            fail("No-JavaScript page lost rendered formulas")
        no_js_audit, _ = assert_soc_unit_convention(driver, "Chapter 10 no-JavaScript page")
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'center', inline: 'nearest'});",
            no_js_audit,
        )
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-10-soc-unit-audit-no-javascript.png"))
        driver.execute_script("window.scrollTo(0, 0);")
        driver.save_screenshot(str(ARTIFACT_DIR / "chapter-10-no-javascript.png"))
        report["no_javascript"] = {
            "visualization_contracts": len(contracts),
            "static_svg_count": len(static_svgs),
            "spin_orbit_unit_convention": True,
        }
    except Exception:
        save_failure_screenshot(driver, "chapter-10-no-javascript-failure.png")
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

    report_path = ARTIFACT_DIR / "part03-ch10-report.json"
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
        (ARTIFACT_DIR / "part03-ch10-failure.json").write_text(
            json.dumps(failure, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        print(f"Part III Chapter 10 Pages smoke test failed: {exc}", file=sys.stderr)
        raise
