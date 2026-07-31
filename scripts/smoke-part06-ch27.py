#!/usr/bin/env python3
"""Live Pages smoke for Martin Part VI Chapter 27."""
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
from selenium.webdriver.support.ui import WebDriverWait

ART = Path(os.environ.get("SMOKE_ARTIFACT_DIR", "artifacts/pages-smoke"))
ART.mkdir(parents=True, exist_ok=True)
BASE = os.environ["PAGES_URL"].rstrip("/") + "/"
SHA = os.environ["DEPLOYED_SHA"]
PART = urljoin(BASE, "part-06-electronic-structure-and-topology/")
CH = urljoin(PART, "chapter-27-topological-insulators-i-two-dimensions/")
MANIFEST = urljoin(BASE, "deployment-manifest.json")


def fail(message):
    raise AssertionError(message)


def manifest():
    last = None
    for _ in range(30):
        try:
            request = urllib.request.Request(
                MANIFEST,
                headers={"User-Agent": "ESL-Part06-Ch27-Smoke/1"},
            )
            with urllib.request.urlopen(request, timeout=20) as response:
                data = json.load(response)
            if data.get("sha") == SHA:
                return data
            last = AssertionError(
                f"stale manifest: expected {SHA}, got {data.get('sha')}"
            )
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
        (
            shutil.which(name)
            for name in (
                "google-chrome",
                "google-chrome-stable",
                "chromium",
                "chromium-browser",
            )
            if shutil.which(name)
        ),
        None,
    )
    if browser:
        result.binary_location = browser
    if not javascript:
        result.add_experimental_option(
            "prefs", {"profile.managed_default_content_settings.javascript": 2}
        )
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
            WebDriverWait(active, 20).until(
                lambda browser: marker in browser.page_source
            )
            return
        except Exception as exc:
            last = exc
            time.sleep(5)
    fail(f"could not load {url}: {last}")


def set_value(active, element, value):
    active.execute_script(
        """
        const element=arguments[0], value=String(arguments[1]);
        const proto=element instanceof HTMLSelectElement
          ? HTMLSelectElement.prototype
          : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto,'value').set.call(element,value);
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
    difference = active.execute_script(
        "return document.documentElement.scrollWidth-document.documentElement.clientWidth"
    )
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
        load(active, PART, "Chapter 27")
        link = active.find_element(
            By.CSS_SELECTOR, 'a[href*="chapter-27-topological-insulators-i"]'
        )
        if "/Electronic-Structure-Learning/" not in (
            link.get_attribute("href") or ""
        ):
            fail("Part VI Chapter 27 link escaped Pages base")
        no_overflow(active, "Part VI index")

        load(active, CH, "Two Dimensions: sp2 Models")
        WebDriverWait(active, 20).until(
            lambda browser: browser.find_elements(By.CSS_SELECTOR, ".katex")
        )
        if "Chapter 27" not in active.title:
            fail(f"unexpected Chapter 27 title: {active.title}")
        if columns(active, ".bilingual-section__grid") != 2:
            fail("desktop bilingual layout is not two columns")
        no_overflow(active, "Chapter 27 desktop")

        katex = len(active.find_elements(By.CSS_SELECTOR, ".katex"))
        rows = len(
            active.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr")
        )
        contents = active.find_elements(By.CSS_SELECTOR, ".chapter-contents a")
        visuals = active.find_elements(By.CSS_SELECTOR, ".chapter-visual")
        contracts = active.find_elements(
            By.CSS_SELECTOR, ".chapter-visual__contract"
        )
        if katex < 45 or rows != 9 or len(contents) != 16:
            fail(
                f"content contract failed: katex={katex}, rows={rows}, contents={len(contents)}"
            )
        if len(visuals) != 3 or len(contracts) != 3:
            fail(
                f"visual contract failed: visuals={len(visuals)}, contracts={len(contracts)}"
            )
        if not all(element.is_displayed() for element in contracts):
            fail("one or more Chapter 27 evidence contracts are hidden")
        if any(
            "/Electronic-Structure-Learning/" not in (
                element.get_attribute("href") or ""
            )
            for element in contents
        ):
            fail("Chapter 27 contents link escaped Pages base")

        chern = active.find_element(By.CSS_SELECTOR, "[data-chern-mass]")
        xi = chern.find_element(By.CSS_SELECTOR, "[data-cm-xi]")
        cvalue = chern.find_element(By.CSS_SELECTOR, "[data-cm-chern]")
        cstatus = chern.find_element(By.CSS_SELECTOR, "[data-cm-status]")
        cgap = chern.find_element(By.CSS_SELECTOR, "[data-cm-gap]")
        if "C− = -1" not in cvalue.text:
            fail(f"unexpected initial Chern readout: {cvalue.text}")
        set_value(active, xi, 1.5)
        WebDriverWait(active, 10).until(lambda _: "undefined" in cvalue.text)
        if "gap = 0" not in cgap.text or "Bulk gap closed" not in cstatus.text:
            fail(f"Chern transition state stale: {cgap.text}; {cstatus.text}")
        set_value(active, xi, -1)
        WebDriverWait(active, 10).until(lambda _: "C− = 1" in cvalue.text)
        set_value(active, xi, 2)
        WebDriverWait(active, 10).until(lambda _: "C− = 0" in cvalue.text)
        set_value(active, xi, 1)

        kramers = active.find_element(By.CSS_SELECTOR, "[data-kramers-parity]")
        pairs = kramers.find_element(By.CSS_SELECTOR, "[data-kp-pairs]")
        mixing = kramers.find_element(By.CSS_SELECTOR, "[data-kp-mixing]")
        kgap = kramers.find_element(By.CSS_SELECTOR, "[data-kp-gap]")
        kz2 = kramers.find_element(By.CSS_SELECTOR, "[data-kp-z2]")
        kstatus = kramers.find_element(By.CSS_SELECTOR, "[data-kp-status]")
        if not mixing.get_attribute("disabled") or kz2.text != "edge parity ν = 1":
            fail("initial odd Kramers-pair contract failed")
        set_value(active, pairs, 2)
        WebDriverWait(active, 10).until(lambda _: not mixing.get_attribute("disabled"))
        set_value(active, mixing, 0.4)
        WebDriverWait(active, 10).until(lambda _: kgap.text == "TRIM edge gap = 0.80")
        if kz2.text != "edge parity ν = 0" or "opens an edge gap" not in kstatus.text:
            fail(f"even Kramers-pair transition stale: {kz2.text}; {kstatus.text}")
        set_value(active, pairs, 1)

        graphene = active.find_element(By.CSS_SELECTOR, "[data-graphene-zigzag]")
        momentum = graphene.find_element(By.CSS_SELECTOR, "[data-gz-k]")
        gstatus = graphene.find_element(By.CSS_SELECTOR, "[data-gz-status]")
        ghoppings = graphene.find_element(By.CSS_SELECTOR, "[data-gz-hoppings]")
        if "normalizable" not in gstatus.text:
            fail(f"unexpected initial graphene status: {gstatus.text}")
        set_value(active, momentum, 0)
        WebDriverWait(active, 10).until(
            lambda _: "no normalizable" in gstatus.text
        )
        set_value(active, momentum, 1)
        WebDriverWait(active, 10).until(
            lambda _: "normalizable" in gstatus.text and "t₁=0.000" in ghoppings.text
        )
        set_value(active, momentum, 0.85)

        backgrounds = {}
        for theme in ("light", "dark"):
            active.execute_script(
                "document.documentElement.setAttribute('data-theme',arguments[0])",
                theme,
            )
            backgrounds[theme] = active.execute_script(
                "return getComputedStyle(document.body).backgroundColor"
            )
        if backgrounds["light"] == backgrounds["dark"]:
            fail(f"theme backgrounds identical: {backgrounds}")
        search = active.find_elements(
            By.CSS_SELECTOR,
            'button[aria-label*="Search" i],a[aria-label*="Search" i],button[data-open-modal]',
        )
        if not search:
            fail("accessible search control missing")
        screenshot(active, "chapter-27-desktop.png")
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
        WebDriverWait(active, 20).until(
            lambda browser: browser.find_elements(
                By.CSS_SELECTOR, ".bilingual-section__grid"
            )
        )
        if columns(active, ".bilingual-section__grid") != 1:
            fail("mobile bilingual layout did not stack")
        no_overflow(active, "Chapter 27 mobile")
        screenshot(active, "chapter-27-narrow.png")
        report["mobile"] = {"viewport": [390, 844], "bilingual_columns": 1}
    except Exception:
        screenshot(active, "chapter-27-desktop-failure.png")
        raise
    finally:
        active.quit()


def no_javascript(report):
    active = driver(False, 1280, 1000)
    try:
        load(active, CH, "No-JavaScript fallback")
        contracts = active.find_elements(
            By.CSS_SELECTOR, ".chapter-visual__contract"
        )
        svgs = active.find_elements(By.CSS_SELECTOR, ".chapter-visual svg")
        if len(contracts) != 3 or len(svgs) != 3:
            fail(
                f"no-JavaScript visual counts failed: contracts={len(contracts)}, svgs={len(svgs)}"
            )
        if not all(element.is_displayed() for element in contracts + svgs):
            fail("no-JavaScript static visual or contract is hidden")
        if len(active.find_elements(By.CSS_SELECTOR, ".katex")) < 45:
            fail("no-JavaScript formulas missing")
        if "C− = -1" not in active.find_element(
            By.CSS_SELECTOR, "[data-cm-chern]"
        ).text:
            fail("Chern static fallback missing")
        if active.find_element(By.CSS_SELECTOR, "[data-kp-z2]").text != "edge parity ν = 1":
            fail("Kramers parity static fallback missing")
        if "normalizable" not in active.find_element(
            By.CSS_SELECTOR, "[data-gz-status]"
        ).text:
            fail("graphene static fallback missing")
        no_overflow(active, "Chapter 27 no-JavaScript")
        screenshot(active, "chapter-27-no-javascript.png")
        report["no_javascript"] = {
            "contracts": len(contracts),
            "svgs": len(svgs),
        }
    except Exception:
        screenshot(active, "chapter-27-no-javascript-failure.png")
        raise
    finally:
        active.quit()


def main():
    data = manifest()
    if (
        data.get("repository") != "Maxwell3919/Electronic-Structure-Learning"
        or data.get("workflow") != "Deploy to GitHub Pages"
    ):
        fail(f"unexpected deployment manifest: {data}")
    report = {
        "base_url": BASE,
        "part_url": PART,
        "chapter_url": CH,
        "manifest": data,
    }
    desktop(report)
    no_javascript(report)
    (ART / "part06-ch27-report.json").write_text(
        json.dumps(report, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
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
        (ART / "part06-ch27-failure.json").write_text(
            json.dumps(failure, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        print(f"Part VI Chapter 27 Pages smoke failed: {exc}", file=sys.stderr)
        raise
