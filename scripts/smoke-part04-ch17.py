#!/usr/bin/env python3
"""Live GitHub Pages smoke test for Martin Part IV Chapter 17."""
from __future__ import annotations
import json, os, shutil, sys, time, urllib.error, urllib.request
from pathlib import Path
from urllib.parse import urljoin
from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.ui import WebDriverWait

ARTIFACT_DIR=Path(os.environ.get('SMOKE_ARTIFACT_DIR','artifacts/pages-smoke'));ARTIFACT_DIR.mkdir(parents=True,exist_ok=True)
BASE_URL=os.environ['PAGES_URL'].rstrip('/')+'/'
EXPECTED_SHA=os.environ['DEPLOYED_SHA']
PART_PATH='part-04-determination-of-electronic-structure/'
CHAPTER_PATH=PART_PATH+'chapter-17-augmented-functions-linear-methods/'
PART_URL=urljoin(BASE_URL,PART_PATH);CHAPTER_URL=urljoin(BASE_URL,CHAPTER_PATH);MANIFEST_URL=urljoin(BASE_URL,'deployment-manifest.json')

def fail(message:str)->None: raise AssertionError(message)
def fetch_manifest(attempts:int=30,delay:float=5.0)->dict:
    last=None
    for _ in range(attempts):
        try:
            request=urllib.request.Request(MANIFEST_URL,headers={'User-Agent':'ESL-Part04-Ch17-Smoke/1'})
            with urllib.request.urlopen(request,timeout=20) as response: payload=json.load(response)
            if payload.get('sha')==EXPECTED_SHA:return payload
            last=AssertionError(f"stale manifest: expected {EXPECTED_SHA}, received {payload.get('sha')}")
        except (OSError,ValueError,urllib.error.URLError,AssertionError) as exc:last=exc
        time.sleep(delay)
    raise AssertionError(f'could not obtain current deployment manifest: {last}')
def options(*,javascript:bool,width:int,height:int)->webdriver.ChromeOptions:
    value=webdriver.ChromeOptions()
    for argument in ('--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu',f'--window-size={width},{height}','--force-device-scale-factor=1','--lang=en-GB'):value.add_argument(argument)
    browser=os.environ.get('CHROME_BIN')
    if not browser:
        for candidate in ('google-chrome','google-chrome-stable','chromium','chromium-browser'):
            browser=shutil.which(candidate)
            if browser:break
    if browser:value.binary_location=browser
    if not javascript:value.add_experimental_option('prefs',{'profile.managed_default_content_settings.javascript':2})
    return value
def driver_new(*,javascript:bool,width:int,height:int)->webdriver.Chrome:
    try:driver=webdriver.Chrome(options=options(javascript=javascript,width=width,height=height))
    except WebDriverException as exc:raise AssertionError(f'Unable to start Chrome: {exc}') from exc
    driver.set_page_load_timeout(45);return driver
def load(driver:webdriver.Chrome,url:str,marker:str,attempts:int=12)->None:
    last=None
    for _ in range(attempts):
        try:
            driver.get(url);WebDriverWait(driver,20).until(lambda active:marker in active.page_source);return
        except Exception as exc:last=exc;time.sleep(5)
    raise AssertionError(f'Could not load {url}: {last}')
def columns(driver:webdriver.Chrome,selector:str)->int:
    value=driver.execute_script('return getComputedStyle(arguments[0]).gridTemplateColumns;',driver.find_element(By.CSS_SELECTOR,selector));return len(str(value).split())
def no_overflow(driver:webdriver.Chrome,label:str)->None:
    value=int(driver.execute_script('return document.documentElement.scrollWidth-document.documentElement.clientWidth;'))
    if value>1:fail(f'{label} horizontal overflow: {value}px')
def focus(driver:webdriver.Chrome,element:WebElement)->None:
    driver.execute_script("arguments[0].scrollIntoView({block:'center'});arguments[0].focus({preventScroll:true});",element)
    WebDriverWait(driver,10).until(lambda _:driver.execute_script('return document.activeElement===arguments[0];',element))
def nudge(driver:webdriver.Chrome,control_selector:str,output_selector:str,label:str)->None:
    control=driver.find_element(By.CSS_SELECTOR,control_selector);output=driver.find_element(By.CSS_SELECTOR,output_selector);focus(driver,control)
    before_value=control.get_attribute('value');before_output=output.text;control.send_keys(Keys.ARROW_RIGHT)
    WebDriverWait(driver,10).until(lambda _:control.get_attribute('value')!=before_value)
    WebDriverWait(driver,10).until(lambda _:output.text!=before_output)
    if output.text==before_output:fail(f'keyboard control did not update {label}')
def screenshot(driver:webdriver.Chrome,name:str)->None:
    try:driver.save_screenshot(str(ARTIFACT_DIR/name))
    except Exception:pass

def desktop(report:dict)->None:
    driver=driver_new(javascript=True,width=1440,height=1400)
    try:
        load(driver,PART_URL,'A unified route through the methods')
        if 'Part IV' not in driver.title:fail(f'unexpected Part IV title: {driver.title}')
        if columns(driver,'.bilingual-section__grid')!=2:fail('Part IV desktop layout is not two columns')
        if 'Chapter 16' not in driver.page_source or 'Chapter 17' not in driver.page_source:fail('Part IV index does not expose Chapters 16 and 17')
        no_overflow(driver,'Part IV index');screenshot(driver,'part-04-index-ch17-desktop.png')
        load(driver,CHAPTER_URL,'Beyond Linear Methods: NMTO')
        WebDriverWait(driver,20).until(lambda active:len(active.find_elements(By.CSS_SELECTOR,'.katex'))>0)
        if 'Chapter 17' not in driver.title:fail(f'unexpected Chapter 17 title: {driver.title}')
        if columns(driver,'.bilingual-section__grid')!=2:fail('Chapter 17 desktop layout is not two columns')
        katex=len(driver.find_elements(By.CSS_SELECTOR,'.katex'));rows=len(driver.find_elements(By.CSS_SELECTOR,'.chapter-source-map tbody tr'));links=driver.find_elements(By.CSS_SELECTOR,'.chapter17-contents a')
        if katex<160:fail(f'expected >=160 KaTeX nodes, received {katex}')
        if rows!=10:fail(f'expected 10 source rows, received {rows}')
        if len(links)!=14:fail(f'expected 14 contents links, received {len(links)}')
        for link in links:
            if '/Electronic-Structure-Learning/' not in (link.get_attribute('href') or ''):fail('contents anchor escaped Pages base path')
        contracts=driver.find_elements(By.CSS_SELECTOR,'.chapter-visual__contract');svgs=driver.find_elements(By.CSS_SELECTOR,'.chapter-visual svg')
        if len(contracts)!=5 or not all(item.is_displayed() for item in contracts):fail(f'expected 5 visual contracts, received {len(contracts)}')
        if len(svgs)!=5 or not all(item.is_displayed() for item in svgs):fail(f'expected 5 SVGs, received {len(svgs)}')
        controls=[('[data-lin-delta]','[data-lin-error]','linearization offset'),('[data-ed-energy]','[data-ed-derivative-norm]','energy derivative'),('[data-lapw-energy]','[data-lapw-a]','LAPW reference energy'),('[data-lmto-screening]','[data-lmto-error]','LMTO screening'),('[data-nmto-energy]','[data-nmto-error]','NMTO probe energy')]
        for item in controls:nudge(driver,*item)
        derivative_overlap=abs(float(driver.find_element(By.CSS_SELECTOR,'[data-ed-overlap]').text));lapw_value=abs(float(driver.find_element(By.CSS_SELECTOR,'[data-lapw-value]').text));lapw_slope=abs(float(driver.find_element(By.CSS_SELECTOR,'[data-lapw-slope]').text));nmto_error=float(driver.find_element(By.CSS_SELECTOR,'[data-nmto-error]').text);nmto_pred=float(driver.find_element(By.CSS_SELECTOR,'[data-nmto-predicted]').text)
        if derivative_overlap>1e-6:fail(f'u/u-dot overlap too large: {derivative_overlap}')
        if lapw_value>1e-10 or lapw_slope>1e-10:fail(f'LAPW residuals too large: {lapw_value}, {lapw_slope}')
        if abs(nmto_error-nmto_pred)>1e-10:fail(f'NMTO product mismatch: {nmto_error} versus {nmto_pred}')
        themes={}
        for theme in ('dark','light'):themes[theme]=str(driver.execute_script("document.documentElement.setAttribute('data-theme',arguments[0]);return getComputedStyle(document.documentElement).getPropertyValue('--sl-color-bg').trim();",theme))
        if not all(themes.values()) or themes['dark']==themes['light']:fail('theme tokens are invalid')
        no_overflow(driver,'Chapter 17 desktop');screenshot(driver,'chapter-17-desktop.png')
        report['desktop']={'title':driver.title,'katex_count':katex,'source_map_rows':rows,'contents_links':len(links),'visualization_contracts':len(contracts),'static_svg_count':len(svgs),'keyboard_controls':[item[2] for item in controls],'energy_derivative_overlap':derivative_overlap,'lapw_value_residual':lapw_value,'lapw_slope_residual':lapw_slope,'nmto_error_difference':abs(nmto_error-nmto_pred),'theme_tokens':themes}
        driver.set_window_size(390,844);driver.refresh();WebDriverWait(driver,20).until(lambda active:len(active.find_elements(By.CSS_SELECTOR,'.bilingual-section__grid'))>0)
        if columns(driver,'.bilingual-section__grid')!=1:fail('Chapter 17 narrow layout is not one column')
        no_overflow(driver,'Chapter 17 narrow');screenshot(driver,'chapter-17-narrow.png');report['narrow']={'viewport':[390,844],'bilingual_columns':1}
    except Exception:screenshot(driver,'chapter-17-desktop-failure.png');raise
    finally:driver.quit()
def no_javascript(report:dict)->None:
    driver=driver_new(javascript=False,width=1280,height=1200)
    try:
        load(driver,CHAPTER_URL,'Beyond Linear Methods: NMTO')
        contracts=driver.find_elements(By.CSS_SELECTOR,'.chapter-visual__contract');svgs=driver.find_elements(By.CSS_SELECTOR,'.chapter-visual svg');fallbacks=driver.find_elements(By.XPATH,"//*[contains(text(),'无 JavaScript fallback')]")
        if len(contracts)!=5 or len(svgs)!=5 or len(fallbacks)<5:fail(f'no-JS fallback counts invalid: {len(contracts)}, {len(svgs)}, {len(fallbacks)}')
        if len(driver.find_elements(By.CSS_SELECTOR,'.chapter-source-map tbody tr'))!=10:fail('no-JS source map lost rows')
        no_overflow(driver,'Chapter 17 no-JS');screenshot(driver,'chapter-17-no-javascript.png');report['no_javascript']={'visualization_contracts':len(contracts),'static_svg_count':len(svgs),'source_map_rows':10,'fallback_explanations':len(fallbacks)}
    except Exception:screenshot(driver,'chapter-17-no-javascript-failure.png');raise
    finally:driver.quit()
def main()->int:
    manifest=fetch_manifest()
    if manifest.get('repository')!='Maxwell3919/Electronic-Structure-Learning' or manifest.get('workflow')!='Deploy to GitHub Pages':fail(f'unexpected manifest: {manifest}')
    report={'base_url':BASE_URL,'part_url':PART_URL,'chapter_url':CHAPTER_URL,'manifest_url':MANIFEST_URL,'manifest':manifest};desktop(report);no_javascript(report)
    (ARTIFACT_DIR/'part04-ch17-report.json').write_text(json.dumps(report,indent=2,sort_keys=True)+'\n',encoding='utf-8');print(json.dumps(report,indent=2,sort_keys=True));return 0
if __name__=='__main__':
    try:raise SystemExit(main())
    except Exception as exc:
        (ARTIFACT_DIR/'part04-ch17-failure.json').write_text(json.dumps({'expected_sha':EXPECTED_SHA,'chapter_url':CHAPTER_URL,'error_type':type(exc).__name__,'error':str(exc)},indent=2)+'\n',encoding='utf-8');print(f'Part IV Chapter 17 Pages smoke failed: {exc}',file=sys.stderr);raise
