#!/usr/bin/env python3
"""Responsive, bilingual, accessible smoke for Editorial Quantum Atlas."""

import json
import os
import shutil
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urljoin, urlparse
from urllib.request import urlopen

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait


BASE = os.environ.get(
    "PAGES_URL", "https://maxwell3919.github.io/Electronic-Structure-Learning/"
).rstrip("/") + "/"
EXPECTED_SHA = os.environ.get("DEPLOYED_SHA")
ARTIFACT_DIR = Path(os.environ.get("SMOKE_ARTIFACT_DIR", "artifacts/pages-smoke"))
ROUTES = (
    "", "start-here/", "learning-paths/", "learning-paths/dft-foundations/", "theory/",
    "part-01-overview-and-background/",
    "part-01-overview-and-background/chapter-03-theoretical-background/",
    "part-07-appendices/appendix-j-scattering-and-phase-shifts/",
    "labs/", "cases/", "interactive-labs/", "labs/scf-fixed-point-and-mixing/",
    "reference/", "reference/design-system/",
)
VIEWPORTS = ((1440, 1000), (1024, 900), (768, 1024), (390, 844))


def options(javascript=True, width=1440, height=1000):
    result = Options()
    for argument in (
        "--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu",
        f"--window-size={width},{height}", "--force-device-scale-factor=1", "--lang=en-GB",
    ):
        result.add_argument(argument)
    browser = os.environ.get("CHROME_BIN")
    if not browser:
        for candidate in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser"):
            browser = shutil.which(candidate)
            if browser:
                break
    if browser:
        result.binary_location = browser
    if not javascript:
        result.add_experimental_option("prefs", {"profile.managed_default_content_settings.javascript": 2})
    return result


def driver(javascript=True, width=1440, height=1000):
    return webdriver.Chrome(options=options(javascript, width, height))


def wait_main(active):
    WebDriverWait(active, 20).until(lambda current: current.find_elements(By.CSS_SELECTOR, "main"))


def assert_base_links(active):
    base_path = urlparse(BASE).path.rstrip("/") + "/"
    base_host = urlparse(BASE).netloc
    for anchor in active.find_elements(By.CSS_SELECTOR, "main a[href]"):
        target = urlparse(anchor.get_attribute("href") or "")
        if target.scheme in {"mailto", "tel"} or (target.netloc and target.netloc != base_host):
            continue
        if target.path and not target.path.startswith(base_path):
            raise AssertionError(f"Internal link escapes Pages base: {target.geturl()}")


def inspect_route(active, route, width, height, theme):
    active.get(urljoin(BASE, route))
    wait_main(active)
    active.execute_script("document.documentElement.dataset.theme = arguments[0]", theme)
    metrics = active.execute_script(
        "return {scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth}"
    )
    overflow = metrics["scroll"] - metrics["client"]
    if overflow > 1:
        raise AssertionError(f"Page overflow {overflow}px at {width}x{height}: {route or '/'}")
    headings = active.find_elements(By.CSS_SELECTOR, "main h1")
    visible_headings = [heading for heading in headings if heading.is_displayed()]
    if len(visible_headings) != 1:
        raise AssertionError(f"Expected one visible H1, observed {len(visible_headings)}: {route or '/'}")
    for heading in visible_headings:
        clipped = active.execute_script("return arguments[0].scrollWidth-arguments[0].clientWidth", heading)
        if clipped > 1:
            raise AssertionError(f"Clipped H1 at {width}px: {route or '/'}")
    site_title = active.find_element(By.CSS_SELECTOR, ".site-title span")
    title_clip = active.execute_script("return arguments[0].scrollWidth-arguments[0].clientWidth", site_title)
    if title_clip > 1:
        raise AssertionError(f"Clipped site title at {width}px: {route or '/'}")
    assert_base_links(active)
    return {"route": route or "/", "viewport": [width, height], "theme": theme, "overflow": overflow}


def bilingual_checks(active):
    active.get(urljoin(BASE, "part-01-overview-and-background/chapter-03-theoretical-background/"))
    wait_main(active)
    controls = active.find_elements(By.CSS_SELECTOR, ".esl-bilingual-control[data-active='true']")
    if len(controls) != 1:
        raise AssertionError(f"Expected one active bilingual control, observed {len(controls)}")
    control = controls[0]
    for mode, hidden_selector, visible_selector in (
        ("zh", ".bilingual-section__en", ".bilingual-section__zh"),
        ("en", ".bilingual-section__zh", ".bilingual-section__en"),
        ("parallel", None, ".bilingual-section__en"),
    ):
        control.find_element(By.CSS_SELECTOR, f"[data-bilingual-mode='{mode}']").click()
        WebDriverWait(active, 5).until(
            lambda current: current.execute_script("return document.documentElement.dataset.eslBilingual") == mode
        )
        if hidden_selector and any(item.is_displayed() for item in active.find_elements(By.CSS_SELECTOR, hidden_selector)):
            raise AssertionError(f"{mode} mode did not visually hide {hidden_selector}")
        if not any(item.is_displayed() for item in active.find_elements(By.CSS_SELECTOR, visible_selector)):
            raise AssertionError(f"{mode} mode hid required region {visible_selector}")
    if active.execute_script("return localStorage.getItem('esl-bilingual-mode')") != "parallel":
        raise AssertionError("Bilingual preference was not persisted locally")
    if any(item.get_attribute("lang") != "en" for item in active.find_elements(By.CSS_SELECTOR, ".bilingual-section__en")):
        raise AssertionError("English bilingual regions do not all declare lang=en")


def interaction_and_motion_checks(active):
    active.execute_cdp_cmd("Emulation.setEmulatedMedia", {"features": [{"name": "prefers-reduced-motion", "value": "reduce"}]})
    active.get(urljoin(BASE, "reference/design-system/"))
    wait_main(active)
    if not active.execute_script("return matchMedia('(prefers-reduced-motion: reduce)').matches"):
        raise AssertionError("Reduced-motion emulation did not activate")
    motion = active.find_element(By.CSS_SELECTOR, "[data-motion-control]")
    motion.click()
    if motion.get_attribute("aria-pressed") != "true":
        raise AssertionError("Motion control did not expose its paused state")
    readout = active.find_element(By.CSS_SELECTOR, ".esl-interaction-readout")
    if readout.get_attribute("aria-live") != "polite":
        raise AssertionError("Interaction readout lacks polite aria-live")


def keyboard_and_search_checks(active):
    active.get(BASE)
    wait_main(active)
    active.find_element(By.TAG_NAME, "body").send_keys(Keys.TAB)
    focused = active.execute_script("return document.activeElement")
    if focused.tag_name not in {"a", "button", "input", "select"}:
        raise AssertionError(f"Keyboard focus did not reach a control: {focused.tag_name}")
    focus_style = active.execute_script("return getComputedStyle(document.activeElement).outlineStyle")
    if focus_style == "none":
        raise AssertionError("Focused control has no visible outline")
    search_button = WebDriverWait(active, 20).until(
        lambda current: current.find_element(By.CSS_SELECTOR, "button[data-open-modal]:not([disabled])")
    )
    search_button.click()
    search = WebDriverWait(active, 20).until(
        lambda current: current.find_element(By.CSS_SELECTOR, ".pagefind-ui__search-input")
    )
    search.send_keys("SCF")
    WebDriverWait(active, 20).until(lambda current: current.find_elements(By.CSS_SELECTOR, ".pagefind-ui__result-link"))


def no_javascript_checks():
    active = driver(False, 390, 844)
    checks = []
    try:
        for route in ROUTES:
            active.get(urljoin(BASE, route))
            wait_main(active)
            width = active.execute_script("return document.documentElement.scrollWidth-window.innerWidth")
            if width > 1:
                raise AssertionError(f"No-JavaScript overflow {width}px: {route or '/'}")
            assert_base_links(active)
            checks.append({"route": route or "/", "no_javascript": True, "overflow": width})
        active.get(urljoin(BASE, "part-01-overview-and-background/chapter-03-theoretical-background/"))
        wait_main(active)
        if not all(item.is_displayed() for item in active.find_elements(By.CSS_SELECTOR, ".bilingual-section__zh, .bilingual-section__en")):
            raise AssertionError("No-JavaScript mode does not show both languages")
        if any(item.is_displayed() for item in active.find_elements(By.CSS_SELECTOR, ".esl-bilingual-control")):
            raise AssertionError("No-JavaScript mode exposes an inactive bilingual control")
        active.get(urljoin(BASE, "reference/design-system/"))
        wait_main(active)
        note = active.find_element(By.CSS_SELECTOR, ".esl-margin-note")
        if note.value_of_css_property("position") not in {"static", "relative"}:
            raise AssertionError("Narrow margin note did not return to document flow")
    finally:
        active.quit()
    return checks


def main():
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = None
    try:
        with urlopen(urljoin(BASE, "deployment-manifest.json"), timeout=30) as response:
            manifest = json.load(response)
    except HTTPError:
        if EXPECTED_SHA:
            raise
    if EXPECTED_SHA and (not manifest or manifest.get("sha") != EXPECTED_SHA):
        raise AssertionError(f"Deployment manifest SHA mismatch: expected {EXPECTED_SHA}, got {manifest}")

    report = {"base_url": BASE, "manifest": manifest, "checks": []}
    active = driver()
    try:
        for width, height in VIEWPORTS:
            active.set_window_size(width, height)
            for index, route in enumerate(ROUTES):
                report["checks"].append(inspect_route(active, route, width, height, "light" if index % 2 == 0 else "dark"))
        bilingual_checks(active)
        interaction_and_motion_checks(active)
        keyboard_and_search_checks(active)
        active.set_window_size(390, 844)
        active.get(urljoin(BASE, "reference/design-system/"))
        wait_main(active)
        active.save_screenshot(str(ARTIFACT_DIR / "editorial-quantum-atlas-390.png"))
    finally:
        active.quit()
    report["checks"].extend(no_javascript_checks())
    report_path = ARTIFACT_DIR / "site-visual-system-report.json"
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Visual-system smoke passed: {len(ROUTES)} routes, 4 viewports, light/dark, no-JavaScript, bilingual, reduced motion, keyboard, and Pagefind.")


if __name__ == "__main__":
    main()
