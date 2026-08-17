#!/usr/bin/env python3
import json
import os
import tempfile
import time
from pathlib import Path
from urllib.parse import urljoin
from urllib.request import urlopen

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait

BASE = os.environ.get("ATLAS_PUBLIC_URL", "http://127.0.0.1:4321/Electronic-Structure-Learning/").rstrip("/") + "/"
ROUTE = "reading/literature/electron-phonon-superconductivity/hbn-sin-superconductivity-cdw/"
UUID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"


def driver(download_dir: str, width: int = 1440, height: int = 1000):
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    if width <= 500:
        options.add_experimental_option("mobileEmulation", {"deviceMetrics": {"width": width, "height": height, "pixelRatio": 1}})
    else:
        options.add_argument(f"--window-size={width},{height}")
    options.add_experimental_option("prefs", {
        "download.default_directory": download_dir,
        "download.prompt_for_download": False,
        "download.directory_upgrade": True,
    })
    instance = webdriver.Chrome(options=options)
    instance.execute_cdp_cmd("Page.setDownloadBehavior", {"behavior": "allow", "downloadPath": download_dir})
    return instance


def wait_reader(browser):
    wait = WebDriverWait(browser, 40)
    wait.until(lambda current: current.find_elements(By.CSS_SELECTOR, ".paper-reader[data-curated-annotation-state='ready']"))
    wait.until(lambda current: current.execute_script(
        "const host=document.querySelector('#pdf-viewer embedpdf-container');"
        "const walk=(root)=>Array.from(root.querySelectorAll('*')).flatMap(n=>[n,...(n.shadowRoot?walk(n.shadowRoot):[])]);"
        "return !!host && walk(host.shadowRoot||host).some(n=>n.tagName==='IMG' && n.naturalWidth>0 && n.naturalHeight>0);"
    ))
    wait.until(lambda current: "saved only in this browser" in current.find_element(By.CSS_SELECTOR, "[data-reading-progress-status]").text)


def canvas_width(browser):
    return browser.execute_script(
        "const host=document.querySelector('#pdf-viewer embedpdf-container');"
        "const walk=(root)=>Array.from(root.querySelectorAll('*')).flatMap(n=>[n,...(n.shadowRoot?walk(n.shadowRoot):[])]);"
        "return Math.max(0,...walk(host.shadowRoot||host).filter(n=>n.tagName==='IMG' && n.naturalWidth>0).map(n=>n.getBoundingClientRect().width));"
    )


def idb(browser, script, *args):
    return browser.execute_async_script(
        "const done=arguments[arguments.length-1],args=Array.from(arguments).slice(0,-1);"
        "const request=indexedDB.open('electronic-structure-atlas-personal-annotations',2);"
        "request.onerror=()=>done({error:String(request.error)});"
        "request.onsuccess=()=>{" + script + "};",
        *args,
    )


def wait_download(directory: Path, suffix: str, count: int = 1):
    deadline = time.time() + 20
    while time.time() < deadline:
        files = sorted(directory.glob(f"*.{suffix}"), key=lambda item: item.stat().st_mtime_ns)
        if len(files) >= count and not list(directory.glob("*.crdownload")):
            return files
        time.sleep(0.15)
    raise AssertionError(f"download did not finish: {suffix} x {count}")


def main():
    with tempfile.TemporaryDirectory(prefix="atlas-reader-browser-") as temporary:
        download_dir = Path(temporary)
        browser = driver(temporary)
        try:
            browser.get(BASE + ROUTE)
            wait_reader(browser)
            reader = browser.find_element(By.CSS_SELECTOR, ".paper-reader")
            paper_id = reader.get_attribute("data-paper-id")
            document_hash = reader.get_attribute("data-source-sha256")
            annotation_url = urljoin(browser.current_url, reader.get_attribute("data-curated-annotations-url"))
            curated_before = int(reader.get_attribute("data-curated-annotation-count"))
            clean = idb(browser,
                "const db=request.result,tx=db.transaction(['annotations','reading-state'],'readwrite');"
                "tx.objectStore('annotations').delete(`${args[0]}:${args[1]}`);tx.objectStore('reading-state').delete(args[0]);"
                "tx.oncomplete=()=>{db.close();done({ok:true});};tx.onerror=()=>done({error:String(tx.error)});",
                document_hash,
                UUID,
            )
            assert clean.get("ok")
            browser.refresh()
            wait_reader(browser)
            reader = browser.find_element(By.CSS_SELECTOR, ".paper-reader")
            payload = json.load(urlopen(annotation_url, timeout=30))
            source = next(item["annotation"] for item in payload["annotations"] if item["annotation"]["type"] == 1)
            personal = {**source, "id": UUID, "contents": "Atlas personal export and restore acceptance test"}
            personal["flags"] = [flag for flag in personal.get("flags", []) if flag not in {"readOnly", "locked", "lockedContents"}]
            bundle = {
                "schema_version": 1,
                "authority": "browser-personal",
                "paper_id": paper_id,
                "document_sha256": document_hash,
                "annotations": [personal],
            }
            import_file = download_dir / "import.json"
            import_file.write_text(json.dumps(bundle), encoding="utf-8")
            browser.find_element(By.CSS_SELECTOR, ".reader-personal-tools summary").click()
            json_button = browser.find_element(By.CSS_SELECTOR, "[data-export-personal-json]")
            browser.execute_script("arguments[0].focus()", json_button)
            json_button.send_keys(Keys.TAB)
            assert browser.switch_to.active_element.get_attribute("data-export-personal-markdown") is not None
            import_input = browser.find_element(By.CSS_SELECTOR, "[data-import-personal-json]")
            import_input.send_keys(str(import_file))
            WebDriverWait(browser, 20).until(lambda current: current.find_element(By.CSS_SELECTOR, "[data-personal-action-status]").text.strip() not in {"", "Working…"})
            import_status = browser.find_element(By.CSS_SELECTOR, "[data-personal-action-status]").text
            assert "1 added" in import_status, import_status
            WebDriverWait(browser, 20).until(lambda current: current.find_element(By.CSS_SELECTOR, ".paper-reader").get_attribute("data-personal-annotation-count") == "1")
            assert int(reader.get_attribute("data-curated-annotation-count")) == curated_before

            browser.find_element(By.CSS_SELECTOR, "[data-export-personal-json]").click()
            first_json = wait_download(download_dir, "json", 2)[-1]
            first_bytes = first_json.read_bytes()
            exported = json.loads(first_bytes)
            assert exported["document_sha256"] == document_hash and exported["annotations"][0]["id"] == UUID
            first_json.rename(download_dir / "first-export.snapshot")
            browser.find_element(By.CSS_SELECTOR, "[data-export-personal-json]").click()
            second_json = wait_download(download_dir, "json", 2)[-1]
            assert second_json.read_bytes() == first_bytes
            browser.find_element(By.CSS_SELECTOR, "[data-export-personal-markdown]").click()
            markdown = wait_download(download_dir, "md")[-1].read_text()
            assert document_hash in markdown and "Atlas personal export and restore acceptance test" in markdown

            browser.find_element(By.CSS_SELECTOR, "[data-reading-completed]").click()
            WebDriverWait(browser, 10).until(lambda current: "Finished" in current.find_element(By.CSS_SELECTOR, "[data-reading-progress-status]").text)
            anchors = browser.find_elements(By.CSS_SELECTOR, ".reading-note-entry")
            target = next((item for item in anchors if "page 2" in item.text.lower() or "page 3" in item.text.lower()), None)
            if target:
                browser.execute_script("arguments[0].click()", target)
                WebDriverWait(browser, 15).until(lambda current: int(current.find_element(By.CSS_SELECTOR, ".paper-reader").get_attribute("data-reading-page") or "1") > 1)
            saved_page = int(browser.find_element(By.CSS_SELECTOR, ".paper-reader").get_attribute("data-reading-page"))
            baseline_width = canvas_width(browser)
            zoom_input = browser.execute_script(
                "return document.querySelector('#pdf-viewer embedpdf-container').shadowRoot.querySelector('input[aria-label=\"Set zoom\"]');"
            )
            zoom_input.clear()
            zoom_input.send_keys("150", Keys.ENTER)
            WebDriverWait(browser, 20).until(lambda current: canvas_width(current) > baseline_width * 1.2)
            zoomed_width = canvas_width(browser)
            time.sleep(0.7)
            stored_zoom = idb(browser,
                "const db=request.result,tx=db.transaction('reading-state','readonly'),get=tx.objectStore('reading-state').get(args[0]);"
                "get.onsuccess=()=>{const value=get.result;db.close();done({zoom:value?.zoom,page:value?.lastPage});};get.onerror=()=>done({error:String(get.error)});",
                document_hash,
            )
            assert stored_zoom.get("zoom", 0) >= 1.45, stored_zoom
            browser.refresh()
            wait_reader(browser)
            assert browser.find_element(By.CSS_SELECTOR, "[data-reading-completed]").is_selected()
            assert int(browser.find_element(By.CSS_SELECTOR, ".paper-reader").get_attribute("data-reading-page")) == saved_page
            time.sleep(2)
            restored_zoom = browser.execute_script(
                "return document.querySelector('#pdf-viewer embedpdf-container').shadowRoot.querySelector('input[aria-label=\"Set zoom\"]').value;"
            )
            assert canvas_width(browser) >= zoomed_width * 0.95 and int(restored_zoom) >= 145, {
                "before": zoomed_width, "after": canvas_width(browser), "zoom": restored_zoom, "stored": stored_zoom,
            }
            assert browser.find_element(By.CSS_SELECTOR, ".paper-reader").get_attribute("data-personal-annotation-count") == "1"

            browser.find_element(By.CSS_SELECTOR, ".reader-personal-tools summary").click()
            import_input = browser.find_element(By.CSS_SELECTOR, "[data-import-personal-json]")
            import_input.send_keys(str(second_json))
            WebDriverWait(browser, 20).until(lambda current: "1 identical skipped" in current.find_element(By.CSS_SELECTOR, "[data-personal-action-status]").text)
            second_json.rename(download_dir / "second-export.snapshot")
            conflict = json.loads(first_bytes)
            conflict["annotations"][0]["contents"] = "Conflicting contents must not overwrite"
            conflict_file = download_dir / "conflict.json"
            conflict_file.write_text(json.dumps(conflict), encoding="utf-8")
            import_input = browser.find_element(By.CSS_SELECTOR, "[data-import-personal-json]")
            import_input.send_keys(str(conflict_file))
            WebDriverWait(browser, 20).until(lambda current: "1 conflicts left unchanged" in current.find_element(By.CSS_SELECTOR, "[data-personal-action-status]").text)
            wrong_identity = json.loads(first_bytes)
            wrong_identity["document_sha256"] = "0" * 64
            wrong_file = download_dir / "wrong-document.json"
            wrong_file.write_text(json.dumps(wrong_identity), encoding="utf-8")
            import_input = browser.find_element(By.CSS_SELECTOR, "[data-import-personal-json]")
            import_input.send_keys(str(wrong_file))
            WebDriverWait(browser, 20).until(lambda current: "does not match this paper and document" in current.find_element(By.CSS_SELECTOR, "[data-personal-action-status]").text)
            browser.find_element(By.CSS_SELECTOR, "[data-export-personal-json]").click()
            latest = json.loads(wait_download(download_dir, "json", 4)[-1].read_text())
            assert latest["annotations"][0]["contents"] == "Atlas personal export and restore acceptance test"

            browser.execute_cdp_cmd("Emulation.setPageScaleFactor", {"pageScaleFactor": 2})
            metrics = browser.execute_script("return {scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth};")
            assert metrics["scroll"] - metrics["client"] <= 1
            assert int(browser.find_element(By.CSS_SELECTOR, ".paper-reader").get_attribute("data-curated-annotation-count")) == curated_before
        finally:
            browser.quit()

        mobile = driver(temporary, width=390, height=844)
        try:
            mobile.get(BASE + ROUTE)
            wait_reader(mobile)
            metrics = mobile.execute_script(
                "const pdf=document.querySelector('.pdf-column').getBoundingClientRect(),rail=document.querySelector('.annotation-left').getBoundingClientRect();"
                "return {viewport:innerWidth,scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,pdfHeight:pdf.height,pdfTop:pdf.top,railTop:rail.top};"
            )
            assert metrics["viewport"] == 390 and metrics["scroll"] - metrics["client"] <= 1 and metrics["pdfHeight"] >= 500 and metrics["pdfTop"] < metrics["railTop"], metrics
            mobile.find_element(By.CSS_SELECTOR, ".reader-personal-tools summary").click()
            mobile.find_element(By.CSS_SELECTOR, "[data-export-personal-json]").send_keys("")
        finally:
            mobile.quit()

    print("Personal Reader browser test passed: deterministic JSON/Markdown export, identity-safe duplicate import, curated isolation, completion/page/zoom restore, 200% zoom, and 390px layout.")


if __name__ == "__main__":
    main()
