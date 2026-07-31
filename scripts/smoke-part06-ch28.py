#!/usr/bin/env python3
"""Live Pages smoke for Martin Part VI Chapter 28."""
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
CH = urljoin(PART, "chapter-28-topological-insulators-ii-three-dimensions/")
MANIFEST = urljoin(BASE, "deployment-manifest.json")


def fail(message):
    raise AssertionError(message)


def manifest():
    last = None
    for _ in range(30):
        try:
            request = urllib.request.Request(
                MANIFEST,
                headers={"User-Agent": "ESL-Part06-Ch28-Smoke/1"},
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
        element.dispatchEvent(new Event(element instanceof HTMLSelectElement?'change':'input',{bubbles:true}));
        element.dispatchEvent(new Event('change',{bubbles:true}));
        """,
        element,
        value,
    )


def set_checked(active, element, checked):
    active.execute_script(
        """
        const element=arguments[0], checked=Boolean(arguments[1]);
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'checked')
          .set.call(element,checked);
        element.dispatchEvent(new Event('change',{bubbles:true}));
        """,
        element,
        checked,
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
        load(active, PART, "Chapter 28")
        link = active.find_element(
            By.CSS_SELECTOR, 'a[href*="chapter-28-topological-insulators-ii"]'
        )
        if "/Electronic-Structure-Learning/" not in (
            link.get_attribute("href") or ""
        ):
            fail("Part VI Chapter 28 link escaped Pages base")
        no_overflow(active, "Part VI index")

        load(active, CH, "Weak and Strong Topological Insulators")
        WebDriverWait(active, 20).until(
            lambda browser: browser.find_elements(By.CSS_SELECTOR, ".katex")
        )
        if "Chapter 28" not in active.title:
            fail(f"unexpected Chapter 28 title: {active.title}")
        if columns(active, ".bilingual-section__grid") != 2:
            fail("desktop bilingual layout is not two columns")
        no_overflow(active, "Chapter 28 desktop")

        katex = len(active.find_elements(By.CSS_SELECTOR, ".katex"))
        rows = len(
            active.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr")
        )
        contents = active.find_elements(By.CSS_SELECTOR, ".chapter-contents a")
        visuals = active.find_elements(By.CSS_SELECTOR, ".chapter-visual")
        contracts = active.find_elements(
            By.CSS_SELECTOR, ".chapter-visual__contract"
        )
        if katex < 80 or rows != 5 or len(contents) != 14:
            fail(
                f"content contract failed: katex={katex}, rows={rows}, contents={len(contents)}"
            )
        if len(visuals) != 4 or len(contracts) != 4:
            fail(
                f"visual contract failed: visuals={len(visuals)}, contracts={len(contracts)}"
            )
        if not all(element.is_displayed() for element in contracts):
            fail("one or more Chapter 28 evidence contracts are hidden")
        if any(
            "/Electronic-Structure-Learning/" not in (
                element.get_attribute("href") or ""
            )
            for element in contents
        ):
            fail("Chapter 28 contents link escaped Pages base")

        indices = active.find_element(By.CSS_SELECTOR, "[data-weak-strong]")
        parity_inputs = indices.find_elements(By.CSS_SELECTOR, "[data-ws-parity]")
        index_readout = indices.find_element(By.CSS_SELECTOR, "[data-ws-index]")
        status_readout = indices.find_element(By.CSS_SELECTOR, "[data-ws-status]")
        if len(parity_inputs) != 8 or "(1;000)" not in index_readout.text:
            fail(f"initial 3D Z2 contract failed: count={len(parity_inputs)}, {index_readout.text}")
        set_checked(active, parity_inputs[0], False)
        WebDriverWait(active, 10).until(lambda _: "(0;000)" in index_readout.text)
        if "Trivial" not in status_readout.text:
            fail(f"trivial parity transition stale: {status_readout.text}")
        set_checked(active, parity_inputs[0], True)
        set_checked(active, parity_inputs[4], True)
        WebDriverWait(active, 10).until(lambda _: "(0;001)" in index_readout.text)
        if "Weak phase" not in status_readout.text:
            fail(f"weak parity transition stale: {status_readout.text}")
        set_checked(active, parity_inputs[4], False)

        wall = active.find_element(By.CSS_SELECTOR, "[data-surface-domain-wall]")
        bulk = wall.find_element(By.CSS_SELECTOR, "[data-dw-bulk]")
        surface = wall.find_element(By.CSS_SELECTOR, "[data-dw-surface]")
        sign = wall.find_element(By.CSS_SELECTOR, "[data-dw-sign]")
        gap = wall.find_element(By.CSS_SELECTOR, "[data-dw-gap]")
        wall_status = wall.find_element(By.CSS_SELECTOR, "[data-dw-status]")
        if "yes" not in sign.text or "0.00" not in gap.text:
            fail(f"initial domain-wall contract failed: {sign.text}; {gap.text}")
        set_value(active, bulk, 1)
        WebDriverWait(active, 10).until(lambda _: "no" in sign.text)
        if "no protected" not in wall_status.text:
            fail(f"same-sign domain-wall state stale: {wall_status.text}")
        set_value(active, bulk, -1)
        set_value(active, surface, 0.4)
        WebDriverWait(active, 10).until(lambda _: "0.80" in gap.text)
        if "opens a gap" not in wall_status.text:
            fail(f"surface-mass state stale: {wall_status.text}")
        set_value(active, surface, 0)

        transition = active.find_element(By.CSS_SELECTOR, "[data-dirac-weyl]")
        mass = transition.find_element(By.CSS_SELECTOR, "[data-dw-mass]")
        field = transition.find_element(By.CSS_SELECTOR, "[data-dw-zeeman]")
        phase = transition.find_element(By.CSS_SELECTOR, "[data-dwt-phase]")
        nodes = transition.find_element(By.CSS_SELECTOR, "[data-dwt-nodes]")
        transition_status = transition.find_element(By.CSS_SELECTOR, "[data-dwt-status]")
        if phase.text != "phase = weyl" or "±0.714" not in nodes.text:
            fail(f"initial Weyl contract failed: {phase.text}; {nodes.text}")
        set_value(active, field, 0.4)
        WebDriverWait(active, 10).until(lambda _: phase.text == "phase = gapped")
        if "gapped by" not in transition_status.text:
            fail(f"gapped Dirac state stale: {transition_status.text}")
        set_value(active, field, 0.7)
        WebDriverWait(active, 10).until(lambda _: phase.text == "phase = critical")
        if "closes" not in transition_status.text:
            fail(f"critical Dirac state stale: {transition_status.text}")
        set_value(active, field, 1)
        set_value(active, mass, 0.7)
        WebDriverWait(active, 10).until(lambda _: phase.text == "phase = weyl")

        arc = active.find_element(By.CSS_SELECTOR, "[data-fermi-arc-slice]")
        slice_input = arc.find_element(By.CSS_SELECTOR, "[data-fa-slice]")
        energy_input = arc.find_element(By.CSS_SELECTOR, "[data-fa-energy]")
        chern = arc.find_element(By.CSS_SELECTOR, "[data-fa-chern]")
        point = arc.find_element(By.CSS_SELECTOR, "[data-fa-point]")
        arc_status = arc.find_element(By.CSS_SELECTOR, "[data-fa-status]")
        if chern.text != "slice Chern number = 1":
            fail(f"initial slice-Chern contract failed: {chern.text}")
        set_value(active, slice_input, 1.2)
        WebDriverWait(active, 10).until(lambda _: chern.text == "slice Chern number = 0")
        if "none" not in point.text or "Chern-trivial" not in arc_status.text:
            fail(f"outer slice state stale: {point.text}; {arc_status.text}")
        set_value(active, slice_input, 0)
        set_value(active, energy_input, 0.3)
        WebDriverWait(active, 10).until(
            lambda _: "ky=0.30" in point.text and chern.text == "slice Chern number = 1"
        )
        set_value(active, energy_input, 0)

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
        screenshot(active, "chapter-28-desktop.png")
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
        no_overflow(active, "Chapter 28 mobile")
        screenshot(active, "chapter-28-narrow.png")
        report["mobile"] = {"viewport": [390, 844], "bilingual_columns": 1}
    except Exception:
        screenshot(active, "chapter-28-desktop-failure.png")
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
        if len(contracts) != 4 or len(svgs) != 4:
            fail(
                f"no-JavaScript visual counts failed: contracts={len(contracts)}, svgs={len(svgs)}"
            )
        if not all(element.is_displayed() for element in contracts + svgs):
            fail("no-JavaScript static visual or contract is hidden")
        if len(active.find_elements(By.CSS_SELECTOR, ".katex")) < 80:
            fail("no-JavaScript formulas missing")
        if "(1;000)" not in active.find_element(
            By.CSS_SELECTOR, "[data-ws-index]"
        ).text:
            fail("3D Z2 static fallback missing")
        if "yes" not in active.find_element(By.CSS_SELECTOR, "[data-dw-sign]").text:
            fail("domain-wall static fallback missing")
        if active.find_element(By.CSS_SELECTOR, "[data-dwt-phase]").text != "phase = Weyl":
            fail("Weyl-transition static fallback missing")
        if active.find_element(By.CSS_SELECTOR, "[data-fa-chern]").text != "slice Chern number = 1":
            fail("Fermi-arc static fallback missing")
        no_overflow(active, "Chapter 28 no-JavaScript")
        screenshot(active, "chapter-28-no-javascript.png")
        report["no_javascript"] = {
            "contracts": len(contracts),
            "svgs": len(svgs),
        }
    except Exception:
        screenshot(active, "chapter-28-no-javascript-failure.png")
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
    (ART / "part06-ch28-report.json").write_text(
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
        (ART / "part06-ch28-failure.json").write_text(
            json.dumps(failure, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        print(f"Part VI Chapter 28 Pages smoke failed: {exc}", file=sys.stderr)
        raise
