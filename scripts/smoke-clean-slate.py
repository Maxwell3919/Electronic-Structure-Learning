#!/usr/bin/env python3
import json
import os
import re
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

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = os.environ.get("PAGES_URL", "http://127.0.0.1:4321/Electronic-Structure-Learning/").rstrip("/") + "/"
DEPLOYED_SHA = os.environ.get("DEPLOYED_SHA")
ARTIFACT_DIR = Path(os.environ.get("SMOKE_ARTIFACT_DIR", "artifacts/clean-slate-smoke"))
THEORY_ROUTES = [
    "theory/linear-algebra/", "theory/calculus-and-analysis/", "theory/differential-equations/",
    "theory/fourier-analysis/", "theory/functional-analysis-and-variational-methods/",
    "theory/numerical-analysis/", "theory/probability-and-statistics/",
    "theory/group-theory-and-symmetry/", "theory/classical-mechanics/",
    "theory/electromagnetism/", "theory/quantum-mechanics/", "theory/thermodynamics/",
    "theory/statistical-mechanics/", "theory/atomic-and-molecular-physics/",
    "theory/solid-state-physics/", "theory/crystallography/", "theory/many-body-physics/",
    "theory/general-chemistry/", "theory/physical-chemistry/", "theory/quantum-chemistry/",
    "theory/chemical-bonding-and-molecular-structure/", "theory/inorganic-chemistry/",
    "theory/solid-state-chemistry/", "theory/surface-and-interface-chemistry/",
    "theory/many-electron-problem/", "theory/hartree-and-hartree-fock-theory/",
    "theory/density-functional-theory-foundations/", "theory/kohn-sham-density-functional-theory/",
    "theory/exchange-correlation-functionals-and-approximations/",
    "theory/self-consistent-field-methods/", "theory/discretization-and-basis-representations/",
    "theory/plane-wave-and-real-space-methods/", "theory/localized-orbital-methods/",
    "theory/pseudopotentials-paw-and-core-valence-treatments/", "theory/brillouin-zone-sampling/",
    "theory/relativistic-electronic-structure-spin-and-magnetism/",
    "theory/linear-response-and-excited-states/",
    "theory/many-body-perturbation-theory-and-quasiparticles/",
    "theory/berry-phases-and-electronic-topology/",
]
CORE_ROUTES = ["core/", "core/orientation/", "core/part-i/", "core/part-ii/", "core/part-iii/"]
CORE_MATH_ROUTES = ["core/part-i/", "core/part-ii/", "core/part-iii/"]
CORE_UNPUBLISHED_ROUTES = [f"core/part-{roman}/" for roman in ["iv", "v", "vi", "vii", "viii"]]
MARTIN_PART_ROUTES = [f"reading/books/martin/part-{roman}/" for roman in ["i", "ii", "iii", "iv", "v", "vi", "vii"]]
MARTIN_CHAPTER_ROUTES = [f"reading/books/martin/chapter-{number:02d}/" for number in range(1, 29)]
MARTIN_APPENDIX_ROUTES = [f"reading/books/martin/appendix-{letter}/" for letter in "abcdefghijklmnopqr"]
MARTIN_ALL_UNIT_ROUTES = [*MARTIN_CHAPTER_ROUTES, *MARTIN_APPENDIX_ROUTES]
LOADER_TEXT = (ROOT / "src/reading/books/martin/chapter-content.ts").read_text()
MARTIN_PUBLISHED_UNIT_SLUGS = re.findall(r"'((?:chapter-\d{2}|appendix-[a-r]))'\s*:", LOADER_TEXT)
MARTIN_PUBLISHED_UNIT_ROUTES = [f"reading/books/martin/{slug}/" for slug in MARTIN_PUBLISHED_UNIT_SLUGS]
MARTIN_UNPUBLISHED_UNIT_ROUTES = [route for route in MARTIN_ALL_UNIT_ROUTES if route not in MARTIN_PUBLISHED_UNIT_ROUTES]
PUBLISHED_CHAPTER_ROUTES = [route for route in MARTIN_PUBLISHED_UNIT_ROUTES if "/chapter-" in route]
PUBLISHED_APPENDIX_ROUTES = [route for route in MARTIN_PUBLISHED_UNIT_ROUTES if "/appendix-" in route]
CANONICAL_READING_ROUTES = [
    "reading/", "reading/books/", "reading/books/martin/", *MARTIN_PART_ROUTES, *MARTIN_PUBLISHED_UNIT_ROUTES,
]
COMPATIBILITY_ROUTES = ["reading/martin/"]
CONTENT_ROUTES = [
    "", *CORE_ROUTES, "theory/", *THEORY_ROUTES, *CANONICAL_READING_ROUTES, *COMPATIBILITY_ROUTES,
    "methods/", "computational-tools/", "reference/",
]
representative_units = []
for route in [
    "reading/books/martin/chapter-01/",
    "reading/books/martin/chapter-07/",
    PUBLISHED_CHAPTER_ROUTES[-1] if PUBLISHED_CHAPTER_ROUTES else None,
    PUBLISHED_APPENDIX_ROUTES[0] if PUBLISHED_APPENDIX_ROUTES else None,
    PUBLISHED_APPENDIX_ROUTES[-1] if PUBLISHED_APPENDIX_ROUTES else None,
]:
    if route and route in MARTIN_PUBLISHED_UNIT_ROUTES and route not in representative_units:
        representative_units.append(route)
BROWSER_READING_ROUTES = [
    "reading/", "reading/books/", "reading/books/martin/", *MARTIN_PART_ROUTES, *representative_units,
]
BROWSER_ROUTES = [
    "", *CORE_ROUTES, "theory/", *THEORY_ROUTES, *BROWSER_READING_ROUTES,
    "methods/", "computational-tools/", "reference/", "404.html",
]
LEGACY_ROUTES = ["part-01-overview-and-background/", "learning-paths/", "literature/"]
DEAD_CAMBRIDGE_ID = "8C2B8F7F4C94A903A9018E9D8A42B9A7"


def make_driver(javascript=True, width=1440, height=900):
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    if width <= 500:
        options.add_experimental_option("mobileEmulation", {"deviceMetrics": {"width": width, "height": height, "pixelRatio": 1}})
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
            raise AssertionError(f"viewport is not {expected_width}px in {mode} at {url}: {metrics['viewport']}")
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

        math_count = 0
        if route in THEORY_ROUTES or route in CORE_MATH_ROUTES:
            math_metrics = driver.execute_script(
                "return Array.from(document.querySelectorAll('main math')).map((node) => {"
                "const box=node.getBoundingClientRect();return {width:box.width,height:box.height,"
                "text:(node.textContent||'').trim(),annotation:node.querySelectorAll('annotation[encoding=\"application/x-tex\"]').length};});"
            )
            math_count = len(math_metrics)
            if math_count == 0 or any(item["width"] < 1 or item["height"] < 1 or not item["text"] for item in math_metrics):
                raise AssertionError(f"native MathML is not visibly laid out in {mode}: {url}")
            if any(item["annotation"] != 1 for item in math_metrics):
                raise AssertionError(f"MathML expression lacks one TeX annotation in {mode}: {url}")

        if route in CORE_ROUTES:
            current_links = driver.find_elements(By.CSS_SELECTOR, 'header a[aria-current="page"]')
            if len(current_links) != 1 or current_links[0].text != "Foundations":
                raise AssertionError(f"Core route does not retain the Foundations navigation context in {mode}: {url}")
        if route == "core/":
            for label in [
                "Orientation · What Electronic Structure Explains",
                "Part I · The Quantum Problem of Matter",
                "Part II · Fermions, Mean Fields, and Correlation",
                "Part III · Periodic Matter and Electronic States",
            ]:
                if label not in driver.find_element(By.TAG_NAME, "main").text:
                    raise AssertionError(f"Core landing lacks {label} in {mode}")
        if route == "core/part-i/":
            diagram = driver.find_element(By.CSS_SELECTOR, "figure.energy-curve svg")
            diagram_metrics = driver.execute_script(
                "const svg=arguments[0],main=document.querySelector('main');"
                "const s=svg.getBoundingClientRect(),m=main.getBoundingClientRect();"
                "return {width:s.width,height:s.height,left:s.left,right:s.right,mainLeft:m.left,mainRight:m.right,"
                "title:svg.querySelectorAll('title').length,desc:svg.querySelectorAll('desc').length};",
                diagram,
            )
            if diagram_metrics["width"] < 1 or diagram_metrics["height"] < 1:
                raise AssertionError(f"Core energy diagram is not visible in {mode}")
            if diagram_metrics["left"] < diagram_metrics["mainLeft"] - 1 or diagram_metrics["right"] > diagram_metrics["mainRight"] + 1:
                raise AssertionError(f"Core energy diagram overflows main in {mode}")
            if diagram_metrics["title"] != 1 or diagram_metrics["desc"] != 1:
                raise AssertionError(f"Core energy diagram lacks one title and description in {mode}")
            key_metrics = driver.execute_script(
                "return Array.from(document.querySelectorAll('figure.energy-curve .energy-curve-key dt, figure.energy-curve .energy-curve-key dd')).map((node) => {"
                "const box=node.getBoundingClientRect(),style=getComputedStyle(node);"
                "return {height:box.height,fontSize:parseFloat(style.fontSize),text:(node.textContent||'').trim()};});"
            )
            if len(key_metrics) != 6 or any(item["height"] < 12 or item["fontSize"] < 14 or not item["text"] for item in key_metrics):
                raise AssertionError(f"Core energy diagram key is not legible in {mode}")
        if route == "core/part-iii/":
            diagrams = driver.find_elements(By.CSS_SELECTOR, "figure.core-diagram svg")
            if len(diagrams) != 4:
                raise AssertionError(f"Part III must contain four original diagrams in {mode}")
            for diagram in diagrams:
                diagram_metrics = driver.execute_script(
                    "const svg=arguments[0],main=document.querySelector('main');"
                    "const s=svg.getBoundingClientRect(),m=main.getBoundingClientRect();"
                    "return {width:s.width,height:s.height,left:s.left,right:s.right,mainLeft:m.left,mainRight:m.right,"
                    "title:svg.querySelectorAll('title').length,desc:svg.querySelectorAll('desc').length};",
                    diagram,
                )
                if diagram_metrics["width"] < 1 or diagram_metrics["height"] < 1:
                    raise AssertionError(f"Part III diagram is not visible in {mode}")
                if diagram_metrics["left"] < diagram_metrics["mainLeft"] - 1 or diagram_metrics["right"] > diagram_metrics["mainRight"] + 1:
                    raise AssertionError(f"Part III diagram overflows main in {mode}")
                if diagram_metrics["title"] != 1 or diagram_metrics["desc"] != 1:
                    raise AssertionError(f"Part III diagram lacks one title and description in {mode}")
            diagram_text = driver.execute_script(
                "return Array.from(document.querySelectorAll('figure.core-diagram svg text')).map((node) => {"
                "const box=node.getBoundingClientRect();return {height:box.height,text:(node.textContent||'').trim()};});"
            )
            if not diagram_text or any(item["height"] < 9 or not item["text"] for item in diagram_text):
                raise AssertionError(f"Part III diagram text is not legible in {mode}")
            main_text = driver.find_element(By.TAG_NAME, "main").text
            for marker in ["Sources and further reading", "Translation is unitary", "vanishes, different sites no longer communicate", "whole Brillouin zone"]:
                if marker not in main_text:
                    raise AssertionError(f"Part III lacks equation-pedagogy marker {marker} in {mode}")
            math_typography = driver.execute_script(
                "const display=document.querySelector('.math-display math'),inline=document.querySelector('math.math-inline');"
                "const ds=getComputedStyle(display),is=getComputedStyle(inline);"
                "return {displayLineHeight:ds.lineHeight,displayFont:ds.fontFamily,inlineLineHeight:is.lineHeight,"
                "inlineAlign:is.verticalAlign,sources:document.querySelectorAll('.equation-source, .source-map dt').length};"
            )
            if math_typography["displayLineHeight"] != "normal" or math_typography["inlineLineHeight"] != "normal":
                raise AssertionError(f"Part III native MathML line height is not typography-safe in {mode}")
            if "math" not in math_typography["displayFont"].lower() or math_typography["sources"] < 5:
                raise AssertionError(f"Part III lacks math-font fallback or equation sources in {mode}")

        main_text = driver.find_element(By.TAG_NAME, "main").text
        if route == "reading/books/martin/" and "Read Part I" not in main_text:
            raise AssertionError(f"Martin book page lacks Part links in {mode}")
        if route == "reading/books/martin/part-i/" and "Read Chapter 1" not in main_text:
            raise AssertionError(f"Part I lacks Chapter links in {mode}")
        if route in MARTIN_PUBLISHED_UNIT_ROUTES and "Core Idea." not in main_text:
            raise AssertionError(f"published Martin unit lacks Core Idea in {mode}: {route}")

        for anchor in driver.find_elements(By.CSS_SELECTOR, "header a[href], main a[href]"):
            raw_href = anchor.get_dom_attribute("href") or ""
            raw_parsed = urlparse(raw_href)
            parsed = urlparse(anchor.get_attribute("href"))
            local_reference = not raw_parsed.scheme and not raw_parsed.netloc
            if local_reference and parsed.netloc == urlparse(BASE_URL).netloc and parsed.path and not parsed.path.startswith(expected_base):
                raise AssertionError(f"internal link escapes Pages base: {anchor.get_attribute('href')}")
        checks.append({"route": route or "/", "mode": mode, "math_nodes": math_count, **metrics})
    return checks


def check_compatibility_redirect(driver):
    old_url = urljoin(BASE_URL, "reading/martin/")
    expected_path = urlparse(urljoin(BASE_URL, "reading/books/martin/")).path.rstrip("/")
    driver.get(old_url)
    WebDriverWait(driver, 20).until(lambda current: urlparse(current.current_url).path.rstrip("/") == expected_path)
    return {"from": old_url, "to": driver.current_url}


def check_core_keyboard(driver):
    driver.get(urljoin(BASE_URL, "core/part-i/"))
    driver.find_element(By.TAG_NAME, "body").send_keys(Keys.TAB)
    active = driver.switch_to.active_element
    if active.tag_name != "a" or "Skip to main content" not in active.text:
        raise AssertionError("Core keyboard navigation did not reach the skip link first")
    active.send_keys(Keys.ENTER)
    WebDriverWait(driver, 10).until(lambda current: current.switch_to.active_element.get_attribute("id") == "main-content")
    sequence_link = driver.find_element(By.CSS_SELECTOR, "nav.sequence-nav a")
    for _ in range(80):
        driver.switch_to.active_element.send_keys(Keys.TAB)
        if driver.switch_to.active_element == sequence_link:
            break
    else:
        raise AssertionError("Core sequence link is not reachable in the natural Tab order")
    focus_style = driver.execute_script(
        "const s=getComputedStyle(arguments[0]);return {style:s.outlineStyle,width:s.outlineWidth};",
        sequence_link,
    )
    if focus_style["style"] == "none" or focus_style["width"] == "0px":
        raise AssertionError("Core sequence link has no visible focus outline")
    return True


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
    for route in MARTIN_UNPUBLISHED_UNIT_ROUTES:
        status = http_status(urljoin(BASE_URL, route))
        if status != 404:
            raise AssertionError(f"expected HTTP 404 for unpublished Martin unit {route}; observed {status}")
        report["http"][route] = status
    for route in CORE_UNPUBLISHED_ROUTES:
        status = http_status(urljoin(BASE_URL, route))
        if status != 404:
            raise AssertionError(f"expected HTTP 404 for unpublished Core route {route}; observed {status}")
        report["http"][route] = status
    for route in LEGACY_ROUTES:
        status = http_status(urljoin(BASE_URL, route))
        if status != 404:
            raise AssertionError(f"expected HTTP 404 for legacy route {route}; observed {status}")
        report["http"][route] = status

    desktop = make_driver()
    try:
        report["checks"].extend(inspect(desktop, "desktop"))
        report["compatibility_redirect"] = check_compatibility_redirect(desktop)
        desktop.get(BASE_URL)
        desktop.find_element(By.TAG_NAME, "body").send_keys(Keys.TAB)
        if desktop.execute_script("return document.activeElement.tagName") != "A":
            raise AssertionError("keyboard navigation did not reach a link")
        report["keyboard"] = check_core_keyboard(desktop)
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
        report["compatibility_redirect_no_javascript"] = check_compatibility_redirect(no_javascript)
    finally:
        no_javascript.quit()

    (ARTIFACT_DIR / "clean-slate-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(
        f"Clean-slate browser smoke passed: {len(CONTENT_ROUTES)} published content routes, "
        f"{len(CORE_UNPUBLISHED_ROUTES)} unpublished Core routes confirmed 404, "
        f"{len(MARTIN_UNPUBLISHED_UNIT_ROUTES)} unpublished Martin units confirmed 404, "
        "39 MathML Foundations pages, 3 MathML Core pages, compatibility redirect, desktop, true 390px, keyboard, and no-JavaScript."
    )


if __name__ == "__main__":
    main()
