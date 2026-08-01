#!/usr/bin/env python3
import json
import os
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urljoin, urlparse
from urllib.request import urlopen

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait


BASE_URL = os.environ.get(
    "PAGES_URL", "https://maxwell3919.github.io/Electronic-Structure-Learning/"
).rstrip("/") + "/"
DEPLOYED_SHA = os.environ.get("DEPLOYED_SHA")
ARTIFACT_DIR = Path(os.environ.get("SMOKE_ARTIFACT_DIR", "artifacts/pages-smoke"))
ROUTES = [
    "",
    "start-here/",
    "learning-paths/",
    "theory/",
    "labs/",
    "cases/",
    "reference/",
    "part-01-overview-and-background/chapter-03-theoretical-background/",
    "part-07-appendices/appendix-a-functional-equations/",
    "labs/scf-fixed-point-and-mixing/",
]


def make_driver(javascript=True, width=1440, height=1000):
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument(f"--window-size={width},{height}")
    if os.environ.get("CHROME_BIN"):
        options.binary_location = os.environ["CHROME_BIN"]
    if not javascript:
        options.add_experimental_option(
            "prefs", {"profile.managed_default_content_settings.javascript": 2}
        )
    return webdriver.Chrome(service=Service(), options=options)


def assert_pages_base(driver):
    base_path = urlparse(BASE_URL).path.rstrip("/") + "/"
    for anchor in driver.find_elements(By.CSS_SELECTOR, "main a[href]"):
        href = anchor.get_attribute("href")
        if not href:
            continue
        parsed = urlparse(href)
        if parsed.scheme in {"http", "https"} and parsed.netloc != urlparse(BASE_URL).netloc:
            continue
        if parsed.scheme in {"mailto", "tel"}:
            continue
        if parsed.path and not parsed.path.startswith(base_path):
            raise AssertionError(f"Internal link escapes Pages base: {href}")


def inspect_routes(driver, mode):
    results = []
    for route in ROUTES:
        url = urljoin(BASE_URL, route)
        driver.get(url)
        WebDriverWait(driver, 20).until(
            lambda current: current.find_elements(By.CSS_SELECTOR, "main")
        )
        metrics = driver.execute_script(
            "return {scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth};"
        )
        overflow = metrics["scroll"] - metrics["client"]
        if overflow > 1:
            raise AssertionError(f"Page-level horizontal overflow ({overflow}px): {url}")
        assert_pages_base(driver)
        results.append({"route": route or "/", "mode": mode, "overflow": overflow})
    return results


def main():
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    manifest_url = urljoin(BASE_URL, "deployment-manifest.json")
    try:
        with urlopen(manifest_url, timeout=30) as response:
            manifest = json.load(response)
    except HTTPError:
        if DEPLOYED_SHA:
            raise
        manifest = None
    if DEPLOYED_SHA and manifest.get("sha") != DEPLOYED_SHA:
        raise AssertionError(
            f"Deployment SHA mismatch: expected {DEPLOYED_SHA}, observed {manifest.get('sha')}"
        )

    report = {"base_url": BASE_URL, "manifest": manifest, "checks": []}

    desktop = make_driver()
    try:
        report["checks"].extend(inspect_routes(desktop, "desktop"))
        desktop.get(BASE_URL)
        body = desktop.find_element(By.TAG_NAME, "body")
        body.send_keys(Keys.TAB)
        focused_tag = desktop.execute_script("return document.activeElement.tagName")
        if focused_tag not in {"A", "BUTTON", "INPUT"}:
            raise AssertionError(f"Keyboard focus did not reach an interactive element: {focused_tag}")
        colors = {}
        for theme in ("light", "dark"):
            desktop.execute_script(
                "document.documentElement.dataset.theme = arguments[0]", theme
            )
            colors[theme] = desktop.execute_script(
                "return getComputedStyle(document.body).backgroundColor"
            )
        if not all(colors.values()):
            raise AssertionError("Theme background could not be resolved")
        report["themes"] = colors
        report["keyboard_focus_tag"] = focused_tag
    finally:
        desktop.quit()

    narrow = make_driver(width=390, height=844)
    try:
        report["checks"].extend(inspect_routes(narrow, "390px"))
    finally:
        narrow.quit()

    no_javascript = make_driver(javascript=False, width=390, height=844)
    try:
        report["checks"].extend(inspect_routes(no_javascript, "no-javascript"))
    finally:
        no_javascript.quit()

    report_path = ARTIFACT_DIR / "site-architecture-report.json"
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    print(
        f"Site architecture browser smoke passed for {len(ROUTES)} routes in desktop, 390px, and no-JavaScript modes."
    )


if __name__ == "__main__":
    main()
