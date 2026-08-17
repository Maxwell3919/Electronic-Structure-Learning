import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-curated-annotation-test-'));
const recordsRoot = path.join(temp, 'records');
const fixturePdf = (id, contents) => {
  const source_record_path = path.join('literature', id);
  const pdf_path = path.join(source_record_path, `${id}.pdf`);
  const annotation_path = path.join(source_record_path, 'annotations');
  const bytes = Buffer.from(`%PDF-1.4\n% curated fixture ${contents}\n%%EOF\n`);
  fs.mkdirSync(path.join(recordsRoot, annotation_path), { recursive: true });
  fs.writeFileSync(path.join(recordsRoot, pdf_path), bytes);
  fs.writeFileSync(path.join(recordsRoot, source_record_path, `${id}.md`), `# ${id}\n`);
  return {
    paper_id: id, source_record_path, pdf_path, annotation_path,
    document_sha256: createHash('sha256').update(bytes).digest('hex'), pdf_size_bytes: bytes.length,
    page_count: 2, status: 'published', public_pdf_delivery: 'blocked', rights_reviewed: false, rights_evidence: null,
  };
};
const first = fixturePdf('fixture-one', 'one');
const second = fixturePdf('fixture-two', 'two');
const recordsMain = '1'.repeat(40);
const manifestPath = path.join(temp, 'literature-library.json');
const deploymentPath = path.join(temp, 'deployment-manifest.json');
const syncStatusPath = path.join(temp, 'records-sync-status.json');
fs.writeFileSync(manifestPath, JSON.stringify({ records_main_sha: recordsMain, papers: [first, second] }));
fs.writeFileSync(deploymentPath, JSON.stringify({ sha: '2'.repeat(40) }));
fs.writeFileSync(syncStatusPath, JSON.stringify({
  records_local_commit: recordsMain,
  records_origin_main_commit: recordsMain,
  last_successful_sync: '2026-08-17T00:00:00Z',
}));

const annotationDir = path.join(recordsRoot, first.annotation_path);
const highlight = {
  id: '11111111-1111-4111-8111-111111111111', pageIndex: 0, type: 9,
  rect: { origin: { x: 10, y: 20 }, size: { width: 100, height: 12 } },
  segmentRects: [{ origin: { x: 10, y: 20 }, size: { width: 100, height: 12 } }], strokeColor: '#ffff00', opacity: 0.4,
};
const overlap = {
  ...highlight, id: '22222222-2222-4222-8222-222222222222',
  rect: { origin: { x: 60, y: 20 }, size: { width: 100, height: 12 } },
  segmentRects: [{ origin: { x: 60, y: 20 }, size: { width: 100, height: 12 } }],
};
const writeRecord = (annotation, overrides = {}) => {
  const record = {
    schema_version: 1,
    annotation_id: annotation.id,
    document_sha256: first.document_sha256,
    page_index: annotation.pageIndex,
    annotation_payload: annotation,
    created_at: '2026-08-17T00:00:00.000Z',
    ...overrides,
  };
  const file = path.join(annotationDir, `${annotation.id}.json`);
  fs.writeFileSync(file, `${JSON.stringify(record, null, 2)}\n`);
  return file;
};
const firstRecordPath = writeRecord(highlight);
writeRecord(overlap, { created_at: '2026-08-17T00:00:01.000Z' });

const port = 20_000 + (process.pid % 10_000);
const base = `http://127.0.0.1:${port}`;
let child;
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const start = async () => {
  child = spawn(process.execPath, ['services/literature-runtime-server.mjs'], {
    cwd: root,
    env: {
      ...process.env,
      ATLAS_LITERATURE_PORT: String(port),
      ATLAS_LITERATURE_MANIFEST: manifestPath,
      ATLAS_LITERATURE_ROOT: recordsRoot,
      ATLAS_DEPLOYMENT_MANIFEST: deploymentPath,
      ATLAS_RECORDS_SYNC_STATUS: syncStatusPath,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let diagnostics = '';
  child.stdout.on('data', (chunk) => { diagnostics += chunk; });
  child.stderr.on('data', (chunk) => { diagnostics += chunk; });
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`runtime exited during startup: ${diagnostics}`);
    try { if ((await fetch(`${base}/papers/`)).ok) return; } catch { /* wait */ }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`runtime did not start: ${diagnostics}`);
};
const stop = async () => {
  if (!child || child.exitCode !== null) return;
  child.kill('SIGTERM');
  await new Promise((resolve) => child.once('exit', resolve));
};
const json = async (url, options) => {
  const response = await fetch(url, options);
  return { response, body: response.status === 204 ? null : await response.json() };
};

try {
  await start();
  let result = await json(`${base}/papers/`);
  assert(result.response.status === 200 && result.body.published_papers === 2, 'runtime index is unavailable');
  assert(result.body.curated_annotation_store === 'github-records-read-only' && result.body.personal_annotation_store === 'browser-indexeddb', 'annotation authority split is not advertised');

  const endpoint = `${base}/papers/api/annotations/${first.document_sha256}`;
  result = await json(endpoint);
  assert(result.response.status === 200 && result.body.authority === 'github-curated' && result.body.annotations.length === 2, 'curated records did not load');
  const head = await fetch(endpoint, { method: 'HEAD' });
  assert(head.status === 200 && (await head.text()) === '' && head.headers.get('content-length') !== null, 'curated HEAD contract failed');
  for (const method of ['POST', 'PUT', 'DELETE']) {
    const before = fs.readFileSync(firstRecordPath, 'utf8');
    const mutation = await fetch(endpoint, { method, headers: { 'Content-Type': 'application/json' }, body: method === 'DELETE' ? undefined : '{}' });
    assert(mutation.status === 405 && mutation.headers.get('allow') === 'GET, HEAD, OPTIONS', `${method} mutation was not rejected`);
    assert(fs.readFileSync(firstRecordPath, 'utf8') === before, `${method} changed a curated record`);
  }

  const record = JSON.parse(fs.readFileSync(firstRecordPath, 'utf8'));
  record.annotation_payload.contents = 'GitHub curated edit is visible without restart';
  record.updated_at = '2026-08-17T00:01:00.000Z';
  fs.writeFileSync(firstRecordPath, `${JSON.stringify(record, null, 2)}\n`);
  result = await json(endpoint);
  assert(result.body.annotations.some((entry) => entry.annotation.contents === record.annotation_payload.contents), 'repository edit was cached or hidden');

  const duplicate = { ...overlap, id: '33333333-3333-4333-8333-333333333333' };
  const duplicatePath = writeRecord(duplicate);
  assert((await fetch(endpoint)).status === 500, 'duplicate curated content did not fail closed');
  fs.rmSync(duplicatePath);

  const malformedPath = path.join(annotationDir, '44444444-4444-4444-8444-444444444444.json');
  fs.writeFileSync(malformedPath, '{');
  assert((await fetch(endpoint)).status === 500, 'malformed curated JSON did not fail closed');
  fs.rmSync(malformedPath);

  const mismatch = { ...highlight, id: '55555555-5555-4555-8555-555555555555' };
  const mismatchPath = writeRecord(mismatch, { document_sha256: second.document_sha256 });
  assert((await fetch(endpoint)).status === 500, 'curated document hash mismatch did not fail closed');
  fs.rmSync(mismatchPath);

  result = await json(`${base}/papers/health`);
  assert(result.response.status === 200 && result.body.status === 'ok', 'health endpoint is not healthy for aligned commits');
  assert(result.body.atlas_deployed_commit === '2'.repeat(40) && result.body.records_local_commit === recordsMain, 'health commit diagnostics are wrong');
  assert(result.body.records_origin_main_commit === recordsMain && result.body.last_successful_sync === '2026-08-17T00:00:00Z', 'health sync diagnostics are wrong');
  assert(/^[a-f0-9]{64}$/.test(result.body.manifest_sha256) && result.body.manifest_records_main_commit === recordsMain && result.body.published_papers === 2, 'health manifest diagnostics are wrong');
  fs.writeFileSync(syncStatusPath, JSON.stringify({ records_local_commit: recordsMain, records_origin_main_commit: '3'.repeat(40) }));
  assert((await json(`${base}/papers/health`)).body.status === 'degraded', 'health did not expose a GitHub-newer state');

  const pdfBefore = createHash('sha256').update(fs.readFileSync(path.join(recordsRoot, first.pdf_path))).digest('hex');
  assert((await fetch(`${base}/papers/${first.paper_id}.pdf`, { method: 'POST', body: 'forbidden' })).status === 404, 'PDF route accepted a mutation');
  assert(createHash('sha256').update(fs.readFileSync(path.join(recordsRoot, first.pdf_path))).digest('hex') === pdfBefore, 'runtime modified a PDF');

  await stop();
  await start();
  result = await json(endpoint);
  assert(result.response.status === 200 && result.body.annotations.length === 2 && result.body.annotations.some((entry) => entry.annotation.contents === record.annotation_payload.contents), 'curated records did not survive runtime restart');
  console.log('Curated read-only dynamic loading, fault injection, health diagnostics, restart persistence, and Records source-boundary tests passed.');
} finally {
  await stop();
  fs.rmSync(temp, { recursive: true, force: true });
}
