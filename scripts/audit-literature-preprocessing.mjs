import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const recordsRoot = path.resolve(process.env.ATLAS_LITERATURE_ROOT ?? '/home/talos/work/Research-Workflow-Records');
const requireRecords = process.argv.includes('--require-records');
const recordsAvailable = fs.existsSync(recordsRoot) && fs.statSync(recordsRoot).isDirectory();
const queue = JSON.parse(fs.readFileSync(path.join(root, 'src/reading/literature-preprocessing.json'), 'utf8'));
const sources = JSON.parse(fs.readFileSync(path.join(root, 'services/literature-preprocessing-sources.json'), 'utf8'));
const allowedQueueKeys = ['atlas_slug', 'canonical_title', 'paper_id', 'priority', 'records_source_path', 'source_status', 'target_literature_topic'];
const topicIds = new Set([
  'structures-phase-competition', 'electronic-character', 'defects-disorder', 'interfaces-heterostructures',
  'magnetism-correlation', 'lattice-dynamics', 'electron-phonon-superconductivity', 'polarization-response',
  'quasiparticles-excitons', 'transport-scattering', 'quantum-geometry-topology', 'reliability-validation',
]);
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const normalize = (value) => value.normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
const sha256 = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const resolveInsideRecords = (relativePath) => {
  const absolute = path.resolve(recordsRoot, relativePath);
  const relative = path.relative(recordsRoot, absolute);
  assert(relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative), `path escapes Records: ${relativePath}`);
  return absolute;
};

assert(queue.length === 17, `queue must contain 17 papers, found ${queue.length}`);
assert(sources.length === 14, `source whitelist must contain 14 ready PDFs, found ${sources.length}`);
assert(!requireRecords || recordsAvailable, `Records source root is unavailable: ${recordsRoot}`);
assert(new Set(queue.map((entry) => entry.paper_id)).size === queue.length, 'queue contains duplicate paper_id values');
assert(new Set(queue.map((entry) => entry.atlas_slug)).size === queue.length, 'queue contains duplicate atlas_slug values');
assert(new Set(sources.map((entry) => entry.paper_id)).size === sources.length, 'source whitelist contains duplicate paper_id values');

const sourcesById = new Map(sources.map((entry) => [entry.paper_id, entry]));
for (const entry of queue) {
  assert(JSON.stringify(Object.keys(entry).sort()) === JSON.stringify(allowedQueueKeys), `queue fields changed for ${entry.paper_id}`);
  assert(entry.priority === 1 || entry.priority === 2, `invalid priority for ${entry.paper_id}`);
  assert(topicIds.has(entry.target_literature_topic), `invalid target topic for ${entry.paper_id}`);
  assert(entry.paper_id === entry.atlas_slug, `paper_id and atlas_slug diverge for ${entry.paper_id}`);
  const ready = entry.source_status === 'source_ready';
  assert(ready || entry.source_status === 'source_pending', `invalid source status for ${entry.paper_id}`);
  assert(ready ? typeof entry.records_source_path === 'string' : entry.records_source_path === null, `Records path/status mismatch for ${entry.paper_id}`);
  assert(ready === sourcesById.has(entry.paper_id), `runtime source/status mismatch for ${entry.paper_id}`);
  if (!ready) continue;

  const source = sourcesById.get(entry.paper_id);
  assert(source.pdf_path.startsWith(`${entry.records_source_path}/`), `runtime PDF leaves queued source directory for ${entry.paper_id}`);
  if (!recordsAvailable) continue;
  const pdfPath = resolveInsideRecords(source.pdf_path);
  const markdownPath = resolveInsideRecords(source.pdf_path.replace(/\.pdf$/, '.md'));
  assert(fs.existsSync(pdfPath) && fs.statSync(pdfPath).isFile(), `missing canonical PDF for ${entry.paper_id}`);
  assert(fs.existsSync(markdownPath) && fs.statSync(markdownPath).isFile(), `missing canonical Markdown for ${entry.paper_id}`);
  if (!fs.existsSync(pdfPath) || !fs.existsSync(markdownPath)) continue;
  assert(fs.readFileSync(pdfPath).subarray(0, 5).toString() === '%PDF-', `invalid PDF magic for ${entry.paper_id}`);
  assert(sha256(pdfPath) === source.source_sha256, `PDF SHA-256 mismatch for ${entry.paper_id}`);
  const info = execFileSync('pdfinfo', [pdfPath], { encoding: 'utf8' });
  const pages = Number(info.match(/^Pages:\s+(\d+)$/m)?.[1]);
  assert(pages === source.page_count, `page count mismatch for ${entry.paper_id}: ${pages} != ${source.page_count}`);
  const firstPage = normalize(execFileSync('pdftotext', ['-f', '1', '-l', '1', '-layout', pdfPath, '-'], { encoding: 'utf8' }));
  for (const marker of source.identity_markers) assert(firstPage.includes(normalize(marker)), `first-page identity marker missing for ${entry.paper_id}: ${marker}`);

  const markdown = fs.readFileSync(markdownPath, 'utf8');
  for (const match of markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    const raw = match[1].replace(/^<|>$/g, '');
    if (/^(?:https?:|data:)/.test(raw)) continue;
    let decoded = raw.split('#')[0];
    try { decoded = decodeURI(decoded); } catch { /* retain the literal path */ }
    const asset = path.resolve(path.dirname(markdownPath), decoded);
    const fromPackage = path.relative(resolveInsideRecords(entry.records_source_path), asset);
    assert(fromPackage !== '..' && !fromPackage.startsWith(`..${path.sep}`), `Markdown asset escapes package for ${entry.paper_id}: ${raw}`);
    assert(fs.existsSync(asset), `missing Markdown asset for ${entry.paper_id}: ${raw}`);
  }
}

const pending = queue.filter((entry) => entry.source_status === 'source_pending');
assert(pending.length === 3, `expected 3 source_pending papers, found ${pending.length}`);
const prohibited = `${JSON.stringify(queue)}\n${JSON.stringify(sources)}`.toLowerCase();
assert(!prohibited.includes('10.1103/physrevb.109.174507'), 'blocked mismatched ZrNCl DOI entered the queue or runtime');
assert(!prohibited.includes('comparative electron'), 'internal HfX2 problem map entered the external-paper queue or runtime');

if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  papers: queue.length,
  source_ready: queue.length - pending.length,
  source_pending: pending.length,
  runtime_pdf_mappings: sources.length,
  records_source_validation: recordsAvailable ? 'passed' : 'skipped',
  page_counts: Object.fromEntries(sources.map((entry) => [entry.paper_id, entry.page_count])),
}, null, 2));
console.log('Literature preprocessing audit passed.');
