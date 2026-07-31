#!/usr/bin/env python3
"""Live Pages smoke for Martin Part VI Chapter 26."""
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
from selenium.webdriver.support.ui import WebDriverWait

ART = Path(os.environ.get("SMOKE_ARTIFACT_DIR", "artifacts/pages-smoke"))
ART.mkdir(parents=True, exist_ok=True)
BASE = os.environ["PAGES_URL"].rstrip("/") + "/"
SHA = os.environ["DEPLOYED_SHA"]
PART = urljoin(BASE, "part-06-electronic-structure-and-topology/")
CH = urljoin(PART, "chapter-26-two-band-models-berry-phase-winding-and-topology/")
MANIFEST = urljoin(BASE, "deployment-manifest.json")


def fail(message):
    raise AssertionError(message)


def manifest():
    last = None
    for _ in range(30):
        try:
            request = urllib.request.Request(MANIFEST, headers={"User-Agent": "ESL-Part06-Ch26-Smoke/1"})
            with urllib.request.urlopen(request, timeout=20) as response:
                data = json.load(response)
            if data.get("sha") == SHA:
                return data
            last = AssertionError(f"stale manifest: expected {SHA}, got {data.get('sha')}")
        except (OSError, ValueError, urllib.error.URLError, AssertionError) as exc:
            last = exc
        time.sleep(5)
    fail(f"could not obtain current deployment manifest: {last}")


def options(javascript, width, height):
    result = webdriver.ChromeOptions()
    for argument in (
        "--headless=new",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        f"--window-size={width},{height}",
        "--force-device-scale-factor=1",
        "--lang=en-GB",
    ):
        result.add_argument(argument)
    browser = os.environ.get("CHROME_BIN") or next(
        (shutil.which(name) for name in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser") if shutil.which(name)),
        None,
    )
    if browser:
        result.binary_location = browser
    if not javascript:
        result.add_experimental_option("prefs", {"profile.managed_default_content_settings.javascript": 2})
    return result


def driver(javascript=True, width=1440, height=1200):
    try:
        active = webdriver.Chrome(options=options(javascript, width, height))
    except WebDriverException as exc:
        fail(f"unable to start Chrome: {exc}")
    active.set_page_load_timeout(45)
    return active


def load(active, url, marker):
    last = None
    for _ in range(12):
        try:
            active.get(url)
            WebDriverWait(active, 20).until(lambda browser: marker in browser.page_source)
            return
        except Exception as exc:
            last = exc
            time.sleep(5)
    fail(f"could not load {url}: {last}")


def set_value(active, element, value):
    active.execute_script(
        """
        const element=arguments[0], value=String(arguments[1]);
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(element,value);
        element.dispatchEvent(new Event('input',{bubbles:true}));
        element.dispatchEvent(new Event('change',{bubbles:true}));
        """,
        element,
        value,
    )


def columns(active, selector):
    value = active.execute_script(
        "return getComputedStyle(arguments[0]).gridTemplateColumns",
        active.find_element(By.CSS_SELECTOR, selector),
    )
    return len([entry for entry in str(value).split() if entry])


def no_overflow(active, label):
    difference = active.execute_script("return document.documentElement.scrollWidth-document.documentElement.clientWidth")
    if float(difference) > 2:
        fail(f"{label} horizontal overflow: {difference}px")


def screenshot(active, name):
    try:
        active.save_screenshot(str(ART / name))
    except Exception:
        pass


def desktop(report):
    active = driver()
    try:
        load(active, PART, "Chapter 26")
        link = active.find_element(By.CSS_SELECTOR, 'a[href*="chapter-26-two-band-models"]')
        if "/Electronic-Structure-Learning/" not in (link.get_attribute("href") or ""):
            fail("Part VI Chapter 26 link escaped Pages base")
        no_overflow(active, "Part VI index")

        load(active, CH, "General Formulation for Two Bands")
        WebDriverWait(active, 20).until(lambda browser: browser.find_elements(By.CSS_SELECTOR, ".katex"))
        if "Chapter 26" not in active.title:
            fail(f"unexpected Chapter 26 title: {active.title}")
        if columns(active, ".bilingual-section__grid") != 2:
            fail("desktop bilingual layout is not two columns")
        no_overflow(active, "Chapter 26 desktop")

        katex = len(active.find_elements(By.CSS_SELECTOR, ".katex"))
        rows = len(active.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr"))
        contents = active.find_elements(By.CSS_SELECTOR, ".chapter-contents a")
        visuals = active.find_elements(By.CSS_SELECTOR, ".chapter-visual")
        contracts = active.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        if katex < 45 or rows != 7 or len(contents) != 15:
            fail(f"content contract failed: katex={katex}, rows={rows}, contents={len(contents)}")
        if len(visuals) != 3 or len(contracts) != 3 or not all(element.is_displayed() for element in contracts):
            fail(f"visual contract failed: visuals={len(visuals)}, contracts={len(contracts)}")
        if any("/Electronic-Structure-Learning/" not in (element.get_attribute("href") or "") for element in contents):
            fail("Chapter 26 contents link escaped Pages base")

        sphere = active.find_element(By.CSS_SELECTOR, "[data-two-band-sphere]")
        radius = sphere.find_element(By.CSS_SELECTOR, "[data-tbs-radius]")
        gap = sphere.find_element(By.CSS_SELECTOR, "[data-tbs-gap]")
        sphere_status = sphere.find_element(By.CSS_SELECTOR, "[data-tbs-status]")
        radius.send_keys(Keys.ARROW_LEFT)
        set_value(active, radius, 0)
        WebDriverWait(active, 10).until(lambda _: "Gap closed" in sphere_status.text)
        if gap.text != "gap = 0.00":
            fail(f"sphere gap readout stale: {gap.text}")
        set_value(active, radius, 1)
        WebDriverWait(active, 10).until(lambda _: "Gapped" in sphere_status.text)

        winding = active.find_element(By.CSS_SELECTOR, "[data-winding-edge]")
        t1 = winding.find_element(By.CSS_SELECTOR, "[data-we-t1]")
        winding_value = winding.find_element(By.CSS_SELECTOR, "[data-we-winding]")
        winding_status = winding.find_element(By.CSS_SELECTOR, "[data-we-status]")
        if winding_value.text != "winding = 1":
            fail(f"unexpected initial winding: {winding_value.text}")
        set_value(active, t1, 1)
        WebDriverWait(active, 10).until(lambda _: "undefined" in winding_value.text)
        if "Bulk gap closed" not in winding_status.text:
            fail(f"winding gap-closing status stale: {winding_status.text}")
        set_value(active, t1, 1.2)
        WebDriverWait(active, 10).until(lambda _: winding_value.text == "winding = 0")
        if "not enclosed" not in winding_status.text:
            fail(f"trivial winding status stale: {winding_status.text}")
        set_value(active, t1, 0.55)

        pump = active.find_element(By.CSS_SELECTOR, "[data-pump-explorer]")
        centre = pump.find_element(By.CSS_SELECTOR, "[data-pump-center]")
        chern = pump.find_element(By.CSS_SELECTOR, "[data-pump-chern]")
        shift = pump.find_element(By.CSS_SELECTOR, "[data-pump-shift]")
        pump_status = pump.find_element(By.CSS_SELECTOR, "[data-pump-status]")
        if chern.text != "lower-band C = 1" or "1.000" not in shift.text:
            fail(f"unexpected initial pump state: {chern.text}; {shift.text}")
        set_value(active, centre, 2)
        WebDriverWait(active, 10).until(lambda _: chern.text == "lower-band C = 0")
        if "no net singular charge" not in pump_status.text:
            fail(f"trivial pump status stale: {pump_status.text}")
        set_value(active, centre, 1.65)
        WebDriverWait(active, 10).until(lambda _: "undefined" in chern.text)
        if "crosses a band degeneracy" not in pump_status.text:
            fail(f"critical pump status stale: {pump_status.text}")
        set_value(active, centre, 1)
        WebDriverWait(active, 10).until(lambda _: chern.text == "lower-band C = 1")

        backgrounds = {}
        for theme in ("light", "dark"):
            active.execute_script("document.documentElement.setAttribute('data-theme',arguments[0])", theme)
            backgrounds[theme] = active.execute_script("return getComputedStyle(document.body).backgroundColor")
        if backgrounds["light"] == backgrounds["dark"]:
            fail(f"theme backgrounds identical: {backgrounds}")
        search = active.find_elements(By.CSS_SELECTOR, 'button[aria-label*="Search" i],a[aria-label*="Search" i],button[data-open-modal]')
        if not search:
            fail("accessible search control missing")

        screenshot(active, "chapter-26-desktop.png")
        report["desktop"] = {
            "title": active.title,
            "katex": katex,
            "source_rows": rows,
            "contents": len(contents),
            "visuals": len(visuals),
            "contracts": len(contracts),
            "themes": backgrounds,
            "search_controls": len(search),
        }

        active.set_window_size(390, 844)
        active.refresh()
        WebDriverWait(active, 20).until(lambda browser: browser.find_elements(By.CSS_SELECTOR, ".bilingual-section__grid"))
        if columns(active, ".bilingual-section__grid") != 1:
            fail("mobile bilingual layout did not stack")
        for element in active.find_elements(By.CSS_SELECTOR, ".chapter-visual__controls"):
            if columns(active, ".chapter-visual__controls") != 1:
                fail("mobile visual controls did not stack")
        no_overflow(active, "Chapter 26 mobile")
        screenshot(active, "chapter-26-narrow.png")
        report["mobile"] = {"viewport": [390, 844], "bilingual_columns": 1}
    except Exception:
        screenshot(active, "chapter-26-desktop-failure.png")
        raise
    finally:
        active.quit()


def no_javascript(report):
    active = driver(False, 1280, 1000)
    try:
        load(active, CH, "Original interactive model")
        contracts = active.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        svgs = active.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        if len(contracts) != 3 or len(svgs) != 3 or not all(element.is_displayed() for element in contracts + svgs):
            fail("no-JavaScript static visual contract failed")
        if len(active.find_elements(By.CSS_SELECTOR, ".katex")) < 45:
            fail("no-JavaScript formulas missing")
        if "Gapped" not in active.find_element(By.CSS_SELECTOR, "[data-tbs-status]").text:
            fail("sphere static fallback missing")
        if active.find_element(By.CSS_SELECTOR, "[data-we-winding]").text != "winding = 1":
            fail("winding static fallback missing")
        if active.find_element(By.CSS_SELECTOR, "[data-pump-chern]").text != "lower-band C = 1":
            fail("pump static fallback missing")
        no_overflow(active, "Chapter 26 no-JavaScript")
        screenshot(active, "chapter-26-no-javascript.png")
        report["no_javascript"] = {"contracts": len(contracts), "svgs": len(svgs)}
    except Exception:
        screenshot(active, "chapter-26-no-javascript-failure.png")
        raise
    finally:
        active.quit()


def main():
    data = manifest()
    if data.get("repository") != "Maxwell3919/Electronic-Structure-Learning" or data.get("workflow") != "Deploy to GitHub Pages":
        fail(f"unexpected deployment manifest: {data}")
    report = {"base_url": BASE, "part_url": PART, "chapter_url": CH, "manifest": data}
    desktop(report)
    no_javascript(report)
    (ART / "part06-ch26-report.json").write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        failure = {
            "base_url": BASE,
            "part_url": PART,
            "chapter_url": CH,
            "manifest_url": MANIFEST,
            "expected_sha": SHA,
            "error_type": type(exc).__name__,
            "error": str(exc),
        }
        (ART / "part06-ch26-failure.json").write_text(json.dumps(failure, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        print(f"Part VI Chapter 26 Pages smoke failed: {exc}", file=sys.stderr)
        raise
