import { spawn } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-pdf-test-'));
const recordsRoot = path.join(temp, 'records');
const packagePath = path.join('literature', 'pdf-fixture');
const pdfPath = path.join(packagePath, 'pdf-fixture.pdf');
const prefix = Buffer.from('%PDF-1.7\n');
const bytes = Buffer.concat([prefix, randomBytes(4 * 1024 * 1024), Buffer.from('\n%%EOF\n')]);
fs.mkdirSync(path.join(recordsRoot, packagePath), { recursive: true });
fs.writeFileSync(path.join(recordsRoot, pdfPath), bytes);
const hash = createHash('sha256').update(bytes).digest('hex');
const blockedBytes = Buffer.from('%PDF-1.7\n% rights-blocked fixture\n%%EOF\n');
const blockedPdfPath = path.join(packagePath, 'blocked-fixture.pdf');
fs.writeFileSync(path.join(recordsRoot, blockedPdfPath), blockedBytes);
const blockedHash = createHash('sha256').update(blockedBytes).digest('hex');
const manifestPath = path.join(temp, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify({ papers: [{
  paper_id: 'pdf-fixture', source_record_path: packagePath, pdf_path: pdfPath,
  annotation_path: path.join(packagePath, 'annotations'), document_sha256: hash,
  pdf_size_bytes: bytes.length, page_count: 1, status: 'published',
  public_pdf_delivery: 'allowed', rights_reviewed: true, rights_evidence: { license_url: 'https://creativecommons.org/licenses/by/4.0/' },
}, {
  paper_id: 'blocked-fixture', source_record_path: packagePath, pdf_path: blockedPdfPath,
  annotation_path: path.join(packagePath, 'annotations-blocked'), document_sha256: blockedHash,
  pdf_size_bytes: blockedBytes.length, page_count: 1, status: 'published',
  public_pdf_delivery: 'blocked', rights_reviewed: false, rights_evidence: null,
}] }));
const port = 30_000 + (process.pid % 10_000);
const url = `http://127.0.0.1:${port}/papers/pdf-fixture.pdf`;
let diagnostics = '';
const child = spawn(process.execPath, ['services/literature-runtime-server.mjs'], {
  cwd: root,
  env: { ...process.env, ATLAS_LITERATURE_PORT: String(port), ATLAS_LITERATURE_MANIFEST: manifestPath, ATLAS_LITERATURE_ROOT: recordsRoot, ATLAS_RECORDS_SYNC_LOCK: path.join(temp, 'state', 'lock.d') },
  stdio: ['ignore', 'pipe', 'pipe'],
});
child.stdout.on('data', (chunk) => { diagnostics += chunk; });
child.stderr.on('data', (chunk) => { diagnostics += chunk; });
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const stop = async () => { if (child.exitCode === null) { child.kill('SIGTERM'); await new Promise((resolve) => child.once('exit', resolve)); } };

try {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`runtime exited: ${diagnostics}`);
    try { if ((await fetch(`http://127.0.0.1:${port}/papers/`)).ok) break; } catch { /* wait */ }
    await new Promise((resolve) => setTimeout(resolve, 50));
    if (attempt === 99) throw new Error(`runtime did not start: ${diagnostics}`);
  }
  const head = await fetch(url, { method: 'HEAD' });
  assert(head.status === 200 && Number(head.headers.get('content-length')) === bytes.length, 'HEAD status/length is wrong');
  assert(head.headers.get('accept-ranges') === 'bytes' && head.headers.get('content-type') === 'application/pdf', 'HEAD PDF headers are wrong');
  assert(head.headers.get('etag') === `"sha256-${hash}"` && head.headers.get('x-atlas-pdf-identity') === 'preindexed-sha256', 'HEAD ETag/preindexed identity is wrong');
  assert((await head.arrayBuffer()).byteLength === 0, 'HEAD transferred a response body');

  const ranges = [[0, 65535], [Math.floor(bytes.length / 2), Math.floor(bytes.length / 2) + 65535], [bytes.length - 65536, bytes.length - 1]];
  for (const [start, end] of ranges) {
    const response = await fetch(url, { headers: { Range: `bytes=${start}-${end}` } });
    const body = Buffer.from(await response.arrayBuffer());
    assert(response.status === 206, 'Range did not return 206');
    assert(response.headers.get('content-range') === `bytes ${start}-${end}/${bytes.length}`, 'Content-Range is wrong');
    assert(Number(response.headers.get('content-length')) === end - start + 1, 'Range Content-Length is wrong');
    assert(body.equals(bytes.subarray(start, end + 1)), 'Range body bytes are wrong');
  }
  const suffix = await fetch(url, { headers: { Range: 'bytes=-1024' } });
  assert(suffix.status === 206 && Buffer.from(await suffix.arrayBuffer()).equals(bytes.subarray(-1024)), 'suffix Range is wrong');
  assert((await fetch(url, { headers: { Range: `bytes=${bytes.length}-` } })).status === 416, 'unsatisfiable Range did not return 416');

  const parallel = await Promise.all(Array.from({ length: 12 }, (_, index) => {
    const start = index * 8192;
    return fetch(url, { headers: { Range: `bytes=${start}-${start + 8191}` } }).then(async (response) => ({ response, body: Buffer.from(await response.arrayBuffer()), start }));
  }));
  assert(parallel.every(({ response, body, start }) => response.status === 206 && body.equals(bytes.subarray(start, start + 8192))), 'parallel Range delivery failed');

  const full = Buffer.from(await (await fetch(url)).arrayBuffer());
  assert(full.length === bytes.length && createHash('sha256').update(full).digest('hex') === hash, 'full PDF SHA/length mismatch');
  assert((await fetch(`http://127.0.0.1:${port}/papers/blocked-fixture.pdf`)).status === 404, 'rights-blocked PDF bytes were publicly delivered');
  const source = fs.readFileSync(path.join(root, 'services/literature-runtime-server.mjs'), 'utf8');
  assert(!/readFileSync\(paper\.pdfPath/.test(source) && !/sha256File/.test(source), 'PDF hot path still reads/hashes the full file');
  console.log('PDF delivery tests passed: allowed HEAD/full/Range are exact and a rights-blocked PDF returns 404.');
} finally {
  await stop();
  fs.rmSync(temp, { recursive: true, force: true });
}
