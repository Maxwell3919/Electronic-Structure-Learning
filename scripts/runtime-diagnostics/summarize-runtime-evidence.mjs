import fs from 'node:fs';
import path from 'node:path';

const directory = process.env.RUNTIME_EVIDENCE_DIR ?? 'artifacts/runtime-evidence';
const output = {};
for (const name of ['browser-probe.json', 'idle-soak.json', 'route-soak.json', 'mode-toggle-soak.json', 'interaction-soak.json']) {
  const file = path.join(directory, name);
  if (!fs.existsSync(file)) continue;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const samples = data.samples ?? Object.values(data.routes ?? {}).flatMap((entry) => entry.samples ?? []);
  const heaps = samples.map((item) => item.heapUsed ?? item.afterLeave?.heapUsed).filter(Number.isFinite);
  const listeners = samples.map((item) => item.probe?.activeListeners ?? item.afterLeave?.probe?.activeListeners).filter(Number.isFinite);
  const documents = samples.map((item) => item.documents ?? item.afterLeave?.documents).filter(Number.isFinite);
  const nodes = samples.map((item) => item.nodes ?? item.afterLeave?.nodes).filter(Number.isFinite);
  const longTasks = samples.map((item) => item.probe?.longTaskCount ?? item.afterLeave?.probe?.longTaskCount).filter(Number.isFinite);
  const errors = samples.flatMap((item) => item.probe?.errors ?? item.afterLeave?.probe?.errors ?? []);
  output[name] = {
    scenario: data.scenario,
    samples: samples.length,
    heapMin: heaps.length ? Math.min(...heaps) : null,
    heapMax: heaps.length ? Math.max(...heaps) : null,
    activeListenerMin: listeners.length ? Math.min(...listeners) : null,
    activeListenerMax: listeners.length ? Math.max(...listeners) : null,
    documentMin: documents.length ? Math.min(...documents) : null,
    documentMax: documents.length ? Math.max(...documents) : null,
    nodeMin: nodes.length ? Math.min(...nodes) : null,
    nodeMax: nodes.length ? Math.max(...nodes) : null,
    longTaskMin: longTasks.length ? Math.min(...longTasks) : null,
    longTaskMax: longTasks.length ? Math.max(...longTasks) : null,
    errorCount: errors.length,
  };
}
console.log(JSON.stringify(output, null, 2));
