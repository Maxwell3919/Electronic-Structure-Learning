import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-annotation-test-'));
const recordsRoot = path.join(temp, 'records');
const stateRoot = path.join(temp, 'state');
const fixturePdf = (id, contents) => {
  const source_record_path = path.join('literature', id);
  const pdf_path = path.join(source_record_path, `${id}.pdf`);
  const annotation_path = path.join(source_record_path, 'annotations');
  const bytes = Buffer.from(`%PDF-1.4\n% annotation fixture ${contents}\n%%EOF\n`);
  fs.mkdirSync(path.join(recordsRoot, source_record_path), { recursive: true });
  fs.writeFileSync(path.join(recordsRoot, pdf_path), bytes);
  fs.writeFileSync(path.join(recordsRoot, source_record_path, `${id}.md`), `# ${id}\n`);
  return {
    paper_id: id, source_record_path, pdf_path, annotation_path,
    document_sha256: createHash('sha256').update(bytes).digest('hex'), pdf_size_bytes: bytes.length,
    page_count: 2, status: 'published',
  };
};
const first = fixturePdf('fixture-one', 'one');
const second = fixturePdf('fixture-two', 'two');
const manifestPath = path.join(temp, 'literature-library.json');
fs.writeFileSync(manifestPath, JSON.stringify({ papers: [first, second] }));
const port = 20_000 + (process.pid % 10_000);
const base = `http://127.0.0.1:${port}/papers/api/annotations/`;
let child;

const start = async () => {
  child = spawn(process.execPath, ['services/literature-runtime-server.mjs'], {
    cwd: root,
    env: {
      ...process.env, ATLAS_LITERATURE_PORT: String(port), ATLAS_LITERATURE_MANIFEST: manifestPath,
      ATLAS_LITERATURE_ROOT: recordsRoot, ATLAS_RECORDS_SYNC_LOCK: path.join(stateRoot, 'records-sync.lock.d'),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let diagnostics = '';
  child.stdout.on('data', (chunk) => { diagnostics += chunk; });
  child.stderr.on('data', (chunk) => { diagnostics += chunk; });
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`runtime exited during startup: ${diagnostics}`);
    try { if ((await fetch(`${base}${first.document_sha256}`)).ok) return; } catch { /* wait */ }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`runtime did not start: ${diagnostics}`);
};
const stop = async () => {
  if (!child || child.exitCode !== null) return;
  child.kill('SIGTERM');
  await new Promise((resolve) => child.once('exit', resolve));
};
const request = async (url, options) => {
  const response = await fetch(url, options);
  const body = await response.json();
  return { status: response.status, body };
};
const post = (hash, annotation, extra = {}) => request(`${base}${hash}`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...(extra.headers ?? {}) }, body: JSON.stringify({ annotation }), ...extra,
});
const assert = (condition, message) => { if (!condition) throw new Error(message); };
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

try {
  await start();
  let result = await request(`http://127.0.0.1:${port}/papers/`);
  assert(result.status === 200 && result.body.published_papers === 2 && result.body.pdf_identity === 'preindexed-sha256' && result.body.annotation_store === 'records-files', 'runtime service index is unavailable');
  result = await request(`${base}${first.document_sha256}`);
  assert(result.status === 200 && result.body.annotations.length === 0, 'empty document did not load');
  assert((await post(first.document_sha256, highlight)).status === 201, 'annotation was not created');
  const annotationDir = path.join(recordsRoot, first.annotation_path);
  const storedPath = path.join(annotationDir, `${highlight.id}.json`);
  const stored = JSON.parse(fs.readFileSync(storedPath, 'utf8'));
  assert(stored.schema_version === 1 && stored.document_sha256 === first.document_sha256 && stored.annotation_payload.id === highlight.id, 'stored record schema/identity is invalid');
  assert(!fs.readdirSync(annotationDir).some((name) => name.endsWith('.tmp')), 'atomic write left a temporary file');
  result = await post(first.document_sha256, { ...highlight, id: '33333333-3333-4333-8333-333333333333' });
  assert(result.status === 200 && result.body.status === 'duplicate', 'exact duplicate was not idempotently deduplicated');
  assert((await post(first.document_sha256, overlap)).status === 201, 'overlapping distinct annotation was rejected');
  result = await request(`${base}${second.document_sha256}`);
  assert(result.status === 200 && result.body.annotations.length === 0, 'annotation leaked into a different PDF namespace');
  assert((await request(`${base}${'0'.repeat(64)}`)).status === 404, 'unknown PDF namespace was accepted');
  assert((await post(first.document_sha256, { ...highlight, id: '44444444-4444-4444-8444-444444444444', pageIndex: first.page_count })).status === 400, 'invalid page was accepted');
  result = await request(`${base}${first.document_sha256}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert(result.status === 400, 'malformed JSON was accepted');
  result = await request(`${base}${first.document_sha256}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ annotation: { ...highlight, contents: 'x'.repeat(70_000) } }) });
  assert(result.status === 413, 'oversize payload was accepted');
  assert((await post(first.document_sha256, { ...highlight, rect: { origin: { x: 11, y: 20 }, size: { width: 100, height: 12 } } })).status === 409, 'same annotation ID with changed payload was accepted');

  stored.annotation_payload.contents = 'repository edit is visible without restart';
  stored.updated_at = new Date().toISOString();
  fs.writeFileSync(storedPath, `${JSON.stringify(stored, null, 2)}\n`);
  result = await request(`${base}${first.document_sha256}`);
  assert(result.body.annotations.some((entry) => entry.annotation.contents === stored.annotation_payload.contents), 'runtime did not dynamically read a repository annotation edit');

  fs.mkdirSync(path.join(stateRoot, 'records-sync.lock.d'));
  assert((await post(second.document_sha256, { ...highlight, id: '55555555-5555-4555-8555-555555555555' })).status === 503, 'POST ignored the Records synchronization lock');
  fs.rmdirSync(path.join(stateRoot, 'records-sync.lock.d'));

  const pdfBefore = createHash('sha256').update(fs.readFileSync(path.join(recordsRoot, first.pdf_path))).digest('hex');
  const metadataPath = path.join(recordsRoot, first.source_record_path, 'fixture-one.md');
  const metadataBefore = fs.readFileSync(metadataPath, 'utf8');
  assert((await fetch(`http://127.0.0.1:${port}/papers/${first.paper_id}.pdf`, { method: 'POST', body: 'forbidden' })).status === 404, 'PDF route accepted a write method');
  assert(createHash('sha256').update(fs.readFileSync(path.join(recordsRoot, first.pdf_path))).digest('hex') === pdfBefore && fs.readFileSync(metadataPath, 'utf8') === metadataBefore, 'API modified a Records source asset');

  await stop();
  await start();
  result = await request(`${base}${first.document_sha256}`);
  assert(result.status === 200 && result.body.annotations.length === 2 && result.body.annotations.some((entry) => entry.annotation.contents === stored.annotation_payload.contents), 'annotations did not survive runtime restart');
  let limited = false;
  for (let index = 0; index < 31; index += 1) {
    const response = await post(first.document_sha256, { ...highlight, id: `${String(index).padStart(8, '0')}-1111-4111-8111-111111111111`, pageIndex: first.page_count });
    if (response.status === 429) limited = true;
  }
  assert(limited, 'POST rate limit did not activate');
  const frontend = [fs.readFileSync(path.join(root, 'src/scripts/shared-pdf-annotations.ts'), 'utf8'), fs.readFileSync(path.join(root, 'src/pages/reading/literature/[topic]/[paper].astro'), 'utf8')].join('\n').toLowerCase();
  for (const prohibited of ['login', 'logout', 'avatar', 'reaction', 'vote', 'my annotation']) assert(!frontend.includes(prohibited), `public annotation UI contains prohibited feature: ${prohibited}`);
  console.log('Records-file annotation dynamic read, atomic persistence, overlap, dedupe, isolation, validation, restart, sync-lock, rate-limit, and read-only source-boundary tests passed.');
} finally {
  await stop();
  fs.rmSync(temp, { recursive: true, force: true });
}
