#!/usr/bin/env python3
"""Shared Chrome/CDP instrumentation for ESL runtime diagnostics."""

import json
import os
import shutil
import time
from pathlib import Path
from urllib.parse import urljoin

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

BASE = os.environ.get("PAGES_URL", "http://127.0.0.1:4321/Electronic-Structure-Learning/").rstrip("/") + "/"
EVIDENCE_DIR = Path(os.environ.get("RUNTIME_EVIDENCE_DIR", "artifacts/runtime-evidence"))

INSTRUMENTATION = r"""
(() => {
  if (globalThis.__eslRuntimeProbe) return;
  const state = {
    listenersAdded: 0, listenersRemoved: 0, listeners: [],
    timeoutsCreated: 0, timeoutsCleared: 0, timeouts: new Map(),
    intervalsCreated: 0, intervalsCleared: 0, intervals: new Map(),
    rafCreated: 0, rafCancelled: 0, raf: new Map(),
    observersCreated: { intersection: 0, resize: 0, mutation: 0 },
    observersDisconnected: { intersection: 0, resize: 0, mutation: 0 },
    longTasks: [], errors: [],
  };
  const owner = () => {
    const lines = String(new Error().stack || '').split('\n').slice(3);
    return lines.find((line) => !line.includes('__eslRuntimeProbe') && !line.includes('runtime_probe'))?.trim() || 'unknown';
  };
  const countsBy = (items, field = 'owner') => Object.fromEntries(
    [...[...items].reduce((counts, item) => counts.set(item[field] || 'unknown', (counts.get(item[field] || 'unknown') || 0) + 1), new Map())]
      .sort((left, right) => right[1] - left[1]).slice(0, 20)
  );
  const capture = (options) => typeof options === 'boolean' ? options : Boolean(options && options.capture);
  const add = EventTarget.prototype.addEventListener;
  const remove = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (listener) {
      state.listenersAdded += 1;
      state.listeners.push({ target: this, type, listener, capture: capture(options), owner: owner() });
    }
    return add.call(this, type, listener, options);
  };
  EventTarget.prototype.removeEventListener = function(type, listener, options) {
    const index = state.listeners.findIndex((item) => item.target === this && item.type === type && item.listener === listener && item.capture === capture(options));
    if (index >= 0) { state.listeners.splice(index, 1); state.listenersRemoved += 1; }
    return remove.call(this, type, listener, options);
  };
  const nativeTimeout = globalThis.setTimeout.bind(globalThis);
  const nativeClearTimeout = globalThis.clearTimeout.bind(globalThis);
  globalThis.setTimeout = (callback, delay, ...args) => {
    let id;
    const wrapped = (...inner) => { state.timeouts.delete(id); return typeof callback === 'function' ? callback(...inner) : (0, eval)(callback); };
    id = nativeTimeout(wrapped, delay, ...args); state.timeoutsCreated += 1; state.timeouts.set(id, { owner: owner() }); return id;
  };
  globalThis.clearTimeout = (id) => { if (state.timeouts.delete(id)) state.timeoutsCleared += 1; return nativeClearTimeout(id); };
  const nativeInterval = globalThis.setInterval.bind(globalThis);
  const nativeClearInterval = globalThis.clearInterval.bind(globalThis);
  globalThis.setInterval = (callback, delay, ...args) => { const id = nativeInterval(callback, delay, ...args); state.intervalsCreated += 1; state.intervals.set(id, { owner: owner() }); return id; };
  globalThis.clearInterval = (id) => { if (state.intervals.delete(id)) state.intervalsCleared += 1; return nativeClearInterval(id); };
  const nativeRaf = globalThis.requestAnimationFrame.bind(globalThis);
  const nativeCancelRaf = globalThis.cancelAnimationFrame.bind(globalThis);
  globalThis.requestAnimationFrame = (callback) => { let id; id = nativeRaf((time) => { state.raf.delete(id); callback(time); }); state.rafCreated += 1; state.raf.set(id, { owner: owner() }); return id; };
  globalThis.cancelAnimationFrame = (id) => { if (state.raf.delete(id)) state.rafCancelled += 1; return nativeCancelRaf(id); };
  const wrapObserver = (name, key) => {
    const Native = globalThis[name]; if (!Native) return;
    globalThis[name] = class extends Native {
      constructor(...args) { super(...args); state.observersCreated[key] += 1; this.__eslDisconnected = false; }
      disconnect() { if (!this.__eslDisconnected) { state.observersDisconnected[key] += 1; this.__eslDisconnected = true; } return super.disconnect(); }
    };
  };
  wrapObserver('IntersectionObserver', 'intersection');
  wrapObserver('ResizeObserver', 'resize');
  wrapObserver('MutationObserver', 'mutation');
  if (globalThis.PerformanceObserver?.supportedEntryTypes?.includes('longtask')) {
    const observer = new PerformanceObserver((list) => list.getEntries().forEach((entry) => state.longTasks.push({ start: entry.startTime, duration: entry.duration })));
    observer.observe({ type: 'longtask', buffered: true });
  }
  add.call(globalThis, 'error', (event) => state.errors.push(String(event.message || event.error || 'error')));
  add.call(globalThis, 'unhandledrejection', (event) => state.errors.push(String(event.reason || 'unhandled rejection')));
  globalThis.__eslRuntimeProbe = {
    snapshot() {
      const activeObservers = Object.fromEntries(Object.keys(state.observersCreated).map((key) => [key, state.observersCreated[key] - state.observersDisconnected[key]]));
      return {
        listenersAdded: state.listenersAdded, listenersRemoved: state.listenersRemoved, activeListeners: state.listeners.length,
        activeListenerOwners: countsBy(state.listeners),
        timeoutsCreated: state.timeoutsCreated, timeoutsCleared: state.timeoutsCleared, activeTimeouts: state.timeouts.size,
        activeTimeoutOwners: countsBy(state.timeouts.values()),
        intervalsCreated: state.intervalsCreated, intervalsCleared: state.intervalsCleared, activeIntervals: state.intervals.size,
        activeIntervalOwners: countsBy(state.intervals.values()),
        rafCreated: state.rafCreated, rafCancelled: state.rafCancelled, activeRaf: state.raf.size,
        activeRafOwners: countsBy(state.raf.values()),
        observersCreated: {...state.observersCreated}, observersDisconnected: {...state.observersDisconnected}, activeObservers,
        longTaskCount: state.longTasks.length, longTaskDuration: state.longTasks.reduce((sum, item) => sum + item.duration, 0),
        errors: [...state.errors], toolbarCount: document.querySelectorAll('[data-reading-toolbar]').length,
        nodeCount: document.getElementsByTagName('*').length, href: location.href,
      };
    }
  };
})();
"""


def chrome_options(width=1440, height=1000):
    options = Options()
    for argument in (
        "--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu",
        "--enable-precise-memory-info", "--js-flags=--expose-gc",
        f"--window-size={width},{height}", "--force-device-scale-factor=1",
    ):
        options.add_argument(argument)
    options.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    browser = os.environ.get("CHROME_BIN")
    if not browser:
        for candidate in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser"):
            browser = shutil.which(candidate)
            if browser:
                break
    if browser:
        options.binary_location = browser
    return options


def new_driver(width=1440, height=1000):
    active = webdriver.Chrome(options=chrome_options(width, height))
    active.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {"source": INSTRUMENTATION})
    active.execute_cdp_cmd("Performance.enable", {})
    return active


def load(active, route):
    started = time.perf_counter()
    active.get(urljoin(BASE, route))
    WebDriverWait(active, 30).until(lambda current: current.find_elements(By.CSS_SELECTOR, "main"))
    WebDriverWait(active, 30).until(lambda current: current.execute_script("return document.readyState") == "complete")
    return (time.perf_counter() - started) * 1000


def collect(active, route, force_gc=False):
    if force_gc:
        active.execute_cdp_cmd("HeapProfiler.collectGarbage", {})
    performance = active.execute_cdp_cmd("Performance.getMetrics", {}).get("metrics", [])
    metrics = {item["name"]: item["value"] for item in performance}
    heap = active.execute_cdp_cmd("Runtime.getHeapUsage", {})
    dom = active.execute_cdp_cmd("Memory.getDOMCounters", {})
    probe = active.execute_script("return globalThis.__eslRuntimeProbe?.snapshot() || null")
    logs = active.get_log("browser")
    return {
        "at": time.time(), "route": route, "probe": probe,
        "heapUsed": heap.get("usedSize"), "heapTotal": heap.get("totalSize"),
        "documents": dom.get("documents"), "nodes": dom.get("nodes"), "jsEventListeners": dom.get("jsEventListeners"),
        "layoutCount": metrics.get("LayoutCount"), "recalcStyleCount": metrics.get("RecalcStyleCount"),
        "scriptDuration": metrics.get("ScriptDuration"), "taskDuration": metrics.get("TaskDuration"),
        "browserLogs": [{"level": item.get("level"), "message": item.get("message")} for item in logs],
        "detachedNodes": "unknown-current-tool",
    }


def write_report(name, payload):
    EVIDENCE_DIR.mkdir(parents=True, exist_ok=True)
    target = EVIDENCE_DIR / name
    target.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(target)
    return target
