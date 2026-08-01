#!/usr/bin/env python3
"""Ultra-wide, semantic-reading, and literature-layer browser acceptance."""

import json
import os
import shutil
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urljoin
from urllib.request import urlopen

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait

BASE = os.environ.get("PAGES_URL", "http://127.0.0.1:4321/Electronic-Structure-Learning/").rstrip("/") + "/"
EXPECTED_SHA = os.environ.get("DEPLOYED_SHA")
ARTIFACT_DIR = Path(os.environ.get("SMOKE_ARTIFACT_DIR", "artifacts/pages-smoke"))
VIEWPORTS = ((2560, 1440), (1920, 1080), (1440, 1000), (1024, 900), (768, 1024), (390, 844))
CORE_ROUTES = (
    "theory/", "theory/atlas/",
    "part-01-overview-and-background/chapter-03-theoretical-background/",
    "part-01-overview-and-background/chapter-04-periodic-solids-and-electron-bands/",
    "part-07-appendices/appendix-j-scattering-and-phase-shifts/",
    "practice-sholl-steckel/chapter-01-what-is-density-functional-theory/",
    "labs/scf-fixed-point-and-mixing/", "literature/",
)
COVERAGE_ROUTES = (
    "", "theory/", "theory/atlas/",
    "part-01-overview-and-background/", "part-02-density-functional-theory/",
    "part-03-important-preliminaries-on-atoms/", "part-04-determination-of-electronic-structure/",
    "part-05-properties-of-matter/", "part-06-electronic-structure-and-topology/", "part-07-appendices/",
    "part-02-density-functional-theory/chapter-07-the-kohn-sham-auxiliary-system/",
    "part-03-important-preliminaries-on-atoms/chapter-11-pseudopotentials/",
    "part-05-properties-of-matter/chapter-20-response-functions-phonons-and-magnons/",
    "part-05-properties-of-matter/chapter-23-wannier-functions/",
    "part-06-electronic-structure-and-topology/chapter-28-topological-insulators-ii-three-dimensions/",
    "part-07-appendices/appendix-a-functional-equations/",
    "literature/topics/", "literature/reading-queue/", "literature/claims/", "literature/discussions/",
)


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


def page_overflow(active):
    return active.execute_script("return document.documentElement.scrollWidth - document.documentElement.clientWidth")


def inspect(active, route, width, height):
    active.set_window_size(width, height)
    active.get(urljoin(BASE, route))
    wait_main(active)
    overflow = page_overflow(active)
    if overflow > 2:
        raise AssertionError(f"Page overflow {overflow}px at {width}x{height}: {route or '/'}")
    title = [item for item in active.find_elements(By.CSS_SELECTOR, "main h1") if item.is_displayed()]
    if len(title) != 1:
        raise AssertionError(f"Expected one visible page H1 at {route or '/'}; found {len(title)}")
    return {"route": route or "/", "viewport": [width, height], "overflow": overflow}


def ultra_wide_checks(active):
    route = "part-01-overview-and-background/chapter-03-theoretical-background/"
    active.set_window_size(2560, 1440)
    active.get(urljoin(BASE, route))
    wait_main(active)
    canvas = active.find_element(By.CSS_SELECTOR, ".main-pane main .content-panel:nth-of-type(2) .sl-container").rect["width"]
    columns = active.find_elements(By.CSS_SELECTOR, ".bilingual-section__zh, .bilingual-section__en")
    visible_columns = [item.rect["width"] for item in columns if item.is_displayed()][:2]
    left = active.find_element(By.CSS_SELECTOR, ".sidebar-pane").rect["width"]
    right = active.find_element(By.CSS_SELECTOR, ".right-sidebar-container").rect["width"]
    if canvas < 1120:
        raise AssertionError(f"Parallel canvas is too narrow at 2560px: {canvas}")
    if len(visible_columns) < 2 or min(visible_columns) < 430:
        raise AssertionError(f"Parallel bilingual columns are too narrow: {visible_columns}")
    if not 240 <= left <= 300:
        raise AssertionError(f"Left navigation width outside contract: {left}")
    if not 190 <= right <= 270:
        raise AssertionError(f"Right semantic TOC width outside contract: {right}")
    if not active.find_elements(By.CSS_SELECTOR, "[data-toc-layer='textbook-baseline']"):
        raise AssertionError("Semantic textbook TOC layer is missing")
    return {"canvas": canvas, "columns": visible_columns, "left": left, "right": right}


def mode_checks(active):
    route = "part-01-overview-and-background/chapter-03-theoretical-background/"
    active.set_window_size(2560, 1440)
    active.get(urljoin(BASE, route))
    wait_main(active)
    focus = active.find_element(By.CSS_SELECTOR, "button[data-reading-mode='focus']")
    focus.click()
    WebDriverWait(active, 5).until(lambda current: current.execute_script("return document.documentElement.dataset.eslReading") == "focus")
    focus_width = active.find_element(By.CSS_SELECTOR, ".main-pane main .content-panel:nth-of-type(2) .sl-container").rect["width"]
    atlas = active.find_element(By.CSS_SELECTOR, "button[data-reading-mode='atlas']")
    atlas.click()
    atlas_width = active.find_element(By.CSS_SELECTOR, ".main-pane main .content-panel:nth-of-type(2) .sl-container").rect["width"]
    active.refresh()
    wait_main(active)
    if active.execute_script("return document.documentElement.dataset.eslReading") != "atlas":
        raise AssertionError("Reading-mode persistence failed")
    if focus_width > 900 or atlas_width < 1120:
        raise AssertionError(f"Focus/Atlas widths outside contract: {focus_width}/{atlas_width}")
    zh = active.find_element(By.CSS_SELECTOR, "button[data-bilingual-mode='zh']")
    zh.click()
    if any(item.is_displayed() for item in active.find_elements(By.CSS_SELECTOR, ".bilingual-section__en")):
        raise AssertionError("Chinese-first mode did not hide English presentation")
    active.refresh()
    wait_main(active)
    if active.execute_script("return document.documentElement.dataset.eslBilingual") != "zh":
        raise AssertionError("Bilingual-mode persistence failed")
    return {"focus": focus_width, "atlas": atlas_width}


def no_javascript_checks():
    active = driver(False, 390, 844)
    try:
        for route in ("theory/atlas/", "part-01-overview-and-background/chapter-03-theoretical-background/", "literature/"):
            active.get(urljoin(BASE, route))
            wait_main(active)
            if page_overflow(active) > 2:
                raise AssertionError(f"No-JavaScript overflow: {route}")
        active.get(urljoin(BASE, "part-01-overview-and-background/chapter-03-theoretical-background/"))
        wait_main(active)
        if not all(item.is_displayed() for item in active.find_elements(By.CSS_SELECTOR, ".bilingual-section__zh, .bilingual-section__en")):
            raise AssertionError("No-JavaScript mode does not retain both languages")
        if any(item.is_displayed() for item in active.find_elements(By.CSS_SELECTOR, ".esl-reading-toolbar")):
            raise AssertionError("No-JavaScript mode exposes inactive display controls")
    finally:
        active.quit()


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
        raise AssertionError(f"Deployment manifest mismatch: {manifest}")
    with urlopen(urljoin(BASE, "pagefind/pagefind.js"), timeout=30) as response:
        if response.status != 200:
            raise AssertionError("Pagefind resource is unavailable")

    report = {"base": BASE, "manifest": manifest, "checks": []}
    active = driver()
    try:
        for width, height in VIEWPORTS:
            for route in CORE_ROUTES:
                report["checks"].append(inspect(active, route, width, height))
        for route in COVERAGE_ROUTES:
            report["checks"].append(inspect(active, route, 1440, 1000))
        report["ultra_wide"] = ultra_wide_checks(active)
        report["modes"] = mode_checks(active)
        active.set_window_size(390, 844)
        active.get(urljoin(BASE, "theory/atlas/"))
        wait_main(active)
        active.save_screenshot(str(ARTIFACT_DIR / "theory-atlas-390.png"))
        active.find_element(By.TAG_NAME, "body").send_keys(Keys.TAB)
        if active.switch_to.active_element.tag_name == "body":
            raise AssertionError("Keyboard focus did not enter an interactive control")
    finally:
        active.quit()
    no_javascript_checks()
    (ARTIFACT_DIR / "full-width-reading-report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Full-width reading smoke passed: six viewports, semantic TOC, language/width persistence, no-JavaScript, keyboard, and Pagefind.")


if __name__ == "__main__":
    main()
