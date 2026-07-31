#!/usr/bin/env python3
"""Live Pages smoke for Martin Part VI Chapter 25."""
from __future__ import annotations
import json, os, re, shutil, sys, time, urllib.error, urllib.request
from pathlib import Path
from urllib.parse import urljoin
from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait

ART = Path(os.environ.get("SMOKE_ARTIFACT_DIR", "artifacts/pages-smoke")); ART.mkdir(parents=True, exist_ok=True)
BASE = os.environ["PAGES_URL"].rstrip("/") + "/"; SHA = os.environ["DEPLOYED_SHA"]
PART = urljoin(BASE, "part-06-electronic-structure-and-topology/")
CH = urljoin(PART, "chapter-25-topology-of-the-electronic-structure-of-a-crystal-introduction/")
MANIFEST = urljoin(BASE, "deployment-manifest.json")

def fail(msg): raise AssertionError(msg)

def manifest():
    last = None
    for _ in range(30):
        try:
            req = urllib.request.Request(MANIFEST, headers={"User-Agent": "ESL-Part06-Smoke/1"})
            with urllib.request.urlopen(req, timeout=20) as response: data = json.load(response)
            if data.get("sha") == SHA: return data
            last = AssertionError(f"stale manifest: expected {SHA}, got {data.get('sha')}")
        except (OSError, ValueError, urllib.error.URLError, AssertionError) as exc: last = exc
        time.sleep(5)
    fail(f"could not obtain current deployment manifest: {last}")

def options(js, width, height):
    opt = webdriver.ChromeOptions()
    for arg in ("--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu", f"--window-size={width},{height}", "--force-device-scale-factor=1", "--lang=en-GB"): opt.add_argument(arg)
    browser = os.environ.get("CHROME_BIN") or next((shutil.which(x) for x in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser") if shutil.which(x)), None)
    if browser: opt.binary_location = browser
    if not js: opt.add_experimental_option("prefs", {"profile.managed_default_content_settings.javascript": 2})
    return opt

def driver(js=True, width=1440, height=1200):
    try: active = webdriver.Chrome(options=options(js, width, height))
    except WebDriverException as exc: fail(f"unable to start Chrome: {exc}")
    active.set_page_load_timeout(45); return active

def load(active, url, marker):
    last = None
    for _ in range(12):
        try:
            active.get(url); WebDriverWait(active, 20).until(lambda d: marker in d.page_source); return
        except Exception as exc: last = exc; time.sleep(5)
    fail(f"could not load {url}: {last}")

def columns(active, selector):
    value = active.execute_script("return getComputedStyle(arguments[0]).gridTemplateColumns", active.find_element(By.CSS_SELECTOR, selector))
    return len([x for x in str(value).split() if x])

def focus(active, element):
    active.execute_script("arguments[0].scrollIntoView({block:'center'});arguments[0].focus({preventScroll:true})", element)
    WebDriverWait(active, 10).until(lambda d: d.execute_script("return document.activeElement===arguments[0]", element))

def set_value(active, element, value):
    active.execute_script("""
      const e=arguments[0],v=String(arguments[1]);
      const p=e instanceof HTMLSelectElement?HTMLSelectElement.prototype:HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(p,'value').set.call(e,v);
      e.dispatchEvent(new Event(e instanceof HTMLSelectElement?'change':'input',{bubbles:true}));
      e.dispatchEvent(new Event('change',{bubbles:true}));
    """, element, value)

def no_overflow(active, label):
    value = active.execute_script("return document.documentElement.scrollWidth-document.documentElement.clientWidth")
    if float(value) > 2: fail(f"{label} horizontal overflow: {value}px")

def complex_value(text):
    values = re.findall(r"[-+]?\d+(?:\.\d+)?", text.replace("−", "-"))
    if len(values) < 2: fail(f"cannot parse Berry invariant: {text}")
    return float(values[-2]), abs(float(values[-1]))

def screenshot(active, name):
    try: active.save_screenshot(str(ART / name))
    except Exception: pass

def desktop(report):
    d = driver()
    try:
        load(d, PART, "Electronic Structure and Topology")
        if "Part VI" not in d.title: fail(f"unexpected Part VI title: {d.title}")
        link = d.find_element(By.CSS_SELECTOR, 'a[href*="chapter-25-topology-of-the-electronic-structure"]')
        if "/Electronic-Structure-Learning/" not in (link.get_attribute("href") or ""): fail("Part VI link escaped Pages base")
        no_overflow(d, "Part VI index"); screenshot(d, "part-06-index-desktop.png")
        load(d, CH, "Topology of What?"); WebDriverWait(d, 20).until(lambda x: x.find_elements(By.CSS_SELECTOR, ".katex"))
        if "Chapter 25" not in d.title or columns(d, ".bilingual-section__grid") != 2: fail("Chapter 25 title or desktop bilingual layout failed")
        no_overflow(d, "Chapter 25 desktop")
        katex = len(d.find_elements(By.CSS_SELECTOR, ".katex")); rows = len(d.find_elements(By.CSS_SELECTOR, ".chapter-source-map tbody tr")); contents = d.find_elements(By.CSS_SELECTOR, ".chapter-contents a")
        if katex < 25 or rows != 10 or len(contents) < 15: fail(f"content contract failed: katex={katex}, rows={rows}, contents={len(contents)}")
        if any("/Electronic-Structure-Learning/" not in (x.get_attribute("href") or "") for x in contents): fail("contents link escaped Pages base")
        if "/Electronic-Structure-Learning/" not in (d.find_element(By.CSS_SELECTOR, 'a[href*="chapter-26-two-band-models"]').get_attribute("href") or ""): fail("Chapter 26 navigation escaped Pages base")
        visuals = d.find_elements(By.CSS_SELECTOR, ".chapter-visual"); contracts = d.find_elements(By.CSS_SELECTOR, ".chapter-visual__contract")
        if len(visuals) != 4 or len(contracts) != 4 or not all(x.is_displayed() for x in contracts): fail("visual or contract count failed")

        gap = d.find_element(By.CSS_SELECTOR, "[data-gap-closing-explorer]"); gslider = gap.find_element(By.CSS_SELECTOR, "[data-gap-mass]"); gstatus = gap.find_element(By.CSS_SELECTOR, "[data-gap-status]"); gout = gap.find_element(By.CSS_SELECTOR, "[data-gap-value]")
        old = gslider.get_attribute("value"); focus(d, gslider); gslider.send_keys(Keys.ARROW_LEFT); WebDriverWait(d, 10).until(lambda _: gslider.get_attribute("value") != old)
        for value in (-1, 1):
            set_value(d, gslider, value); WebDriverWait(d, 10).until(lambda _: "Gap closing" in gstatus.text)
            if not gout.text.endswith("0.0000"): fail(f"gap closure stale at m={value}: {gout.text}")
        set_value(d, gslider, 0); WebDriverWait(d, 10).until(lambda _: "Gapped" in gstatus.text)

        berry = d.find_element(By.CSS_SELECTOR, "[data-berry-gauge-loop]"); wind = berry.find_element(By.CSS_SELECTOR, "[data-berry-winding]"); inv = berry.find_element(By.CSS_SELECTOR, "[data-berry-invariant]")
        before = complex_value(inv.text); focus(d, wind); wind.send_keys(Keys.END); WebDriverWait(d, 10).until(lambda _: wind.get_attribute("value") == "2"); after = complex_value(inv.text)
        if max(abs(before[0]-after[0]), abs(before[1]-after[1])) > 1e-4: fail(f"Berry invariant changed: {before}->{after}")

        chern = d.find_element(By.CSS_SELECTOR, "[data-chern-mesh-explorer]"); mass = chern.find_element(By.CSS_SELECTOR, "[data-chern-mass]"); grid = chern.find_element(By.CSS_SELECTOR, "[data-chern-grid]"); gauge = chern.find_element(By.CSS_SELECTOR, "[data-chern-gauge]"); cval = chern.find_element(By.CSS_SELECTOR, "[data-chern-value]"); raw = chern.find_element(By.CSS_SELECTOR, "[data-chern-raw]")
        old = mass.get_attribute("value"); focus(d, mass); mass.send_keys(Keys.ARROW_RIGHT); WebDriverWait(d, 10).until(lambda _: mass.get_attribute("value") != old)
        for value, expected in ((-3,"C = 0"),(-1,"C = -1"),(1,"C = 1"),(3,"C = 0")):
            set_value(d, mass, value); WebDriverWait(d, 10).until(lambda _, expected=expected: cval.text == expected)
        for value in (-2,0,2):
            set_value(d, mass, value); WebDriverWait(d, 10).until(lambda _: "undefined" in cval.text)
            if "undefined" not in raw.text: fail(f"stale Chern flux at m={value}")
        set_value(d, mass, -1); WebDriverWait(d, 10).until(lambda _: cval.text == "C = -1"); raw0 = raw.text
        focus(d, gauge); gauge.send_keys(Keys.SPACE); WebDriverWait(d, 10).until(lambda _: gauge.is_selected())
        if cval.text != "C = -1" or raw.text != raw0: fail("Chern result changed under gauge")
        focus(d, grid); grid.send_keys(Keys.END); WebDriverWait(d, 10).until(lambda _: grid.get_attribute("value") == "61")
        if cval.text != "C = -1": fail("Chern integer changed under grid refinement")

        backgrounds = {}
        for theme in ("light", "dark"):
            d.execute_script("document.documentElement.setAttribute('data-theme',arguments[0])", theme); backgrounds[theme] = d.execute_script("return getComputedStyle(document.body).backgroundColor")
        if backgrounds["light"] == backgrounds["dark"]: fail(f"theme backgrounds identical: {backgrounds}")
        search = d.find_elements(By.CSS_SELECTOR, 'button[aria-label*="Search" i],a[aria-label*="Search" i],button[data-open-modal]')
        if not search: fail("accessible search control missing")
        screenshot(d, "chapter-25-desktop.png")
        report["desktop"] = {"title": d.title, "katex": katex, "source_rows": rows, "contents": len(contents), "visuals": len(visuals), "contracts": len(contracts), "themes": backgrounds, "search_controls": len(search)}

        d.set_window_size(390,844); d.refresh(); WebDriverWait(d,20).until(lambda x: x.find_elements(By.CSS_SELECTOR,".bilingual-section__grid"))
        if columns(d,".bilingual-section__grid") != 1: fail("mobile bilingual layout did not stack")
        for selector in (".visual-controls--two", ".visual-controls--three"):
            for element in d.find_elements(By.CSS_SELECTOR, selector):
                value = d.execute_script("return getComputedStyle(arguments[0]).gridTemplateColumns", element)
                if len([x for x in str(value).split() if x]) != 1: fail(f"mobile controls did not stack: {selector} {value}")
        no_overflow(d, "Chapter 25 mobile"); screenshot(d,"chapter-25-narrow.png"); report["mobile"]={"viewport":[390,844],"bilingual_columns":1}
    except Exception:
        screenshot(d,"chapter-25-desktop-failure.png"); raise
    finally: d.quit()

def no_js(report):
    d = driver(False,1280,1000)
    try:
        load(d, CH, "Original interactive model"); contracts=d.find_elements(By.CSS_SELECTOR,".chapter-visual__contract"); svgs=d.find_elements(By.CSS_SELECTOR,".chapter-visual svg")
        if len(contracts)!=4 or len(svgs)!=4 or not all(x.is_displayed() for x in contracts+svgs): fail("no-JS static visual contract failed")
        if len(d.find_elements(By.CSS_SELECTOR,".katex"))<25: fail("no-JS formulas missing")
        if "Gapped: an invariant may be defined" not in d.find_element(By.CSS_SELECTOR,"[data-gap-status]").text: fail("gap static fallback missing")
        if d.find_element(By.CSS_SELECTOR,"[data-chern-value]").text!="C = -1": fail("Chern static fallback missing")
        no_overflow(d,"Chapter 25 no-JS"); screenshot(d,"chapter-25-no-javascript.png"); report["no_javascript"]={"contracts":len(contracts),"svgs":len(svgs)}
    except Exception:
        screenshot(d,"chapter-25-no-javascript-failure.png"); raise
    finally: d.quit()

def main():
    data=manifest()
    if data.get("repository")!="Maxwell3919/Electronic-Structure-Learning" or data.get("workflow")!="Deploy to GitHub Pages": fail(f"unexpected deployment manifest: {data}")
    report={"base_url":BASE,"part_url":PART,"chapter_url":CH,"manifest":data}; desktop(report); no_js(report)
    (ART/"part06-ch25-report.json").write_text(json.dumps(report,indent=2,sort_keys=True)+"\n",encoding="utf-8"); print(json.dumps(report,indent=2,sort_keys=True)); return 0

if __name__=="__main__":
    try: raise SystemExit(main())
    except Exception as exc:
        failure={"base_url":BASE,"part_url":PART,"chapter_url":CH,"manifest_url":MANIFEST,"expected_sha":SHA,"error_type":type(exc).__name__,"error":str(exc)}
        (ART/"part06-ch25-failure.json").write_text(json.dumps(failure,indent=2,sort_keys=True)+"\n",encoding="utf-8"); print(f"Part VI Chapter 25 Pages smoke failed: {exc}",file=sys.stderr); raise
