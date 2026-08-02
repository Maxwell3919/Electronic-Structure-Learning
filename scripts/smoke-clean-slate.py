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

BASE_URL = os.environ.get("PAGES_URL", "http://127.0.0.1:4321/Electronic-Structure-Learning/").rstrip("/") + "/"
DEPLOYED_SHA = os.environ.get("DEPLOYED_SHA")
ARTIFACT_DIR = Path(os.environ.get("SMOKE_ARTIFACT_DIR", "artifacts/clean-slate-smoke"))
THEORY_ROUTES = [
    "theory/linear-algebra/",
    "theory/calculus-and-analysis/",
    "theory/numerical-analysis/",
    "theory/quantum-mechanics/",
    "theory/solid-state-physics/",
    "theory/quantum-chemistry/",
    "theory/many-electron-problem/",
    "theory/hartree-and-hartree-fock-theory/",
    "theory/density-functional-theory-foundations/",
    "theory/kohn-sham-density-functional-theory/",
    "theory/exchange-correlation-functionals-and-approximations/",
    "theory/self-consistent-field-methods/",
    "theory/discretization-and-basis-representations/",
]
CONTENT_ROUTES = [
    "", "theory/", *THEORY_ROUTES, "methods/", "computational-tools/", "reference/",
]
BROWSER_ROUTES = [*CONTENT_ROUTES, "404.html"]
LEGACY_ROUTES = ["part-01-overview-and-background/", "learning-paths/", "literature/"]
DEAD_CAMBRIDGE_ID = "8C2B8F7F4C94A903A9018E9D8A42B9A7"


def make_driver(javascript=True, width=1440, height=900):
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    if width <= 500:
        options.add_experimental_option(
            "mobileEmulation",
            {"deviceMetrics": {"width": width, "height": height, "pixelRatio": 1}},
        )
    else:
        options.add_argument(f"--window-size={width},{height}")
    if os.environ.get("CHROME_BIN"):
        options.binary_location = os.environ["CHROME_BIN"]
    if not javascript:
        options.add_experimental_option("prefs", {"profile.managed_default_content_settings.javascript": 2})
    return webdriver.Chrome(service=Service(), options=options)


def http_status(url):
    try:
        with urlopen(url, timeout=30) as response:
            return response.status
    except HTTPError as error:
        return error.code


def inspect(driver, mode, expected_width=None):
    checks = []
    expected_base = urlparse(BASE_URL).path.rstrip("/") + "/"
    for route in BROWSER_ROUTES:
        url = urljoin(BASE_URL, route)
        driver.get(url)
        WebDriverWait(driver, 20).until(lambda current: current.find_elements(By.CSS_SELECTOR, "main"))
        metrics = driver.execute_script(
            "return {scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,"
            "viewport:window.innerWidth,bg:getComputedStyle(document.body).backgroundColor,"
            "font:getComputedStyle(document.body).fontFamily,scripts:document.scripts.length};"
        )
        if expected_width is not None and metrics["viewport"] != expected_width:
            raise AssertionError(f"viewport is not {expected_width}px in {mode}: {metrics['viewport']}")
        if metrics["scroll"] - metrics["client"] > 1:
            raise AssertionError(f"horizontal overflow in {mode}: {url}")
        if metrics["bg"] not in {"rgb(255, 255, 255)", "rgba(255, 255, 255, 1)"}:
            raise AssertionError(f"body is not white in {mode}: {metrics['bg']}")
        if "serif" not in metrics["font"].lower():
            raise AssertionError(f"body does not use the serif stack in {mode}: {metrics['font']}")
        if metrics["scripts"] != 0:
            raise AssertionError(f"client scripts found in {mode}: {url}")
        if driver.find_elements(By.CSS_SELECTOR, '[class*="card"], [class*="status"], [class*="progress"], [class*="dashboard"]'):
            raise AssertionError(f"legacy UI marker found in {mode}: {url}")
        if DEAD_CAMBRIDGE_ID in driver.page_source:
            raise AssertionError(f"dead Cambridge resource remains in {mode}: {url}")
        if driver.find_elements(By.CSS_SELECTOR, "main .equation"):
            raise AssertionError(f"removed code-style equation block remains in {mode}: {url}")

        math_count = 0
        if route in THEORY_ROUTES:
            math_metrics = driver.execute_script(
                "return Array.from(document.querySelectorAll('main math')).map((node) => {"
                "const box=node.getBoundingClientRect();"
                "return {width:box.width,height:box.height,text:(node.textContent||'').trim(),"
                "annotation:node.querySelectorAll('annotation[encoding=\"application/x-tex\"]').length};});"
            )
            math_count = len(math_metrics)
            if math_count == 0:
                raise AssertionError(f"native MathML missing in {mode}: {url}")
            if any(item["width"] < 1 or item["height"] < 1 or not item["text"] for item in math_metrics):
                raise AssertionError(f"MathML is not visibly laid out in {mode}: {url}")
            if any(item["annotation"] != 1 for item in math_metrics):
                raise AssertionError(f"MathML expression lacks one TeX annotation in {mode}: {url}")
            if not driver.find_elements(By.CSS_SELECTOR, "main .math-display math[display='block']"):
                raise AssertionError(f"display MathML missing in {mode}: {url}")

        for anchor in driver.find_elements(By.CSS_SELECTOR, "header a[href], main a[href]"):
            parsed = urlparse(anchor.get_attribute("href"))
            if parsed.netloc == urlparse(BASE_URL).netloc and parsed.path and not parsed.path.startswith(expected_base):
                raise AssertionError(f"internal link escapes Pages base: {anchor.get_attribute('href')}")
        checks.append({"route": route or "/", "mode": mode, "math_nodes": math_count, **metrics})
    return checks


def main():
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    report = {"base_url": BASE_URL, "checks": [], "http": {}}
    manifest_url = urljoin(BASE_URL, "deployment-manifest.json")
    if DEPLOYED_SHA:
        with urlopen(manifest_url, timeout=30) as response:
            manifest = json.load(response)
        if manifest.get("sha") != DEPLOYED_SHA:
            raise AssertionError(f"deployment SHA mismatch: {manifest.get('sha')} != {DEPLOYED_SHA}")
        report["manifest"] = manifest

    for route in CONTENT_ROUTES:
        status = http_status(urljoin(BASE_URL, route))
        if status != 200:
            raise AssertionError(f"expected HTTP 200 for {route or '/'}; observed {status}")
        report["http"][route or "/"] = status
    if http_status(urljoin(BASE_URL, "404.html")) != 200:
        raise AssertionError("direct 404 document is not HTTP 200")
    for route in LEGACY_ROUTES:
        status = http_status(urljoin(BASE_URL, route))
        if status != 404:
            raise AssertionError(f"expected HTTP 404 for legacy route {route}; observed {status}")
        report["http"][route] = status

    desktop = make_driver()
    try:
        report["checks"].extend(inspect(desktop, "desktop"))
        desktop.get(BASE_URL)
        desktop.find_element(By.TAG_NAME, "body").send_keys(Keys.TAB)
        if desktop.execute_script("return document.activeElement.tagName") != "A":
            raise AssertionError("keyboard navigation did not reach a link")
        report["keyboard"] = True
    finally:
        desktop.quit()

    narrow = make_driver(width=390, height=844)
    try:
        report["checks"].extend(inspect(narrow, "390px", expected_width=390))
    finally:
        narrow.quit()

    no_javascript = make_driver(javascript=False, width=390, height=844)
    try:
        report["checks"].extend(inspect(no_javascript, "no-javascript", expected_width=390))
    finally:
        no_javascript.quit()

    (ARTIFACT_DIR / "clean-slate-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print("Clean-slate browser smoke passed: eighteen content routes, thirteen MathML pages, direct 404, three legacy 404s, desktop, true 390px, keyboard, and no-JavaScript.")


if __name__ == "__main__":
    main()
