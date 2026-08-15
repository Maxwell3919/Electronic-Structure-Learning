import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const recordsRoot = path.resolve(process.env.ATLAS_LITERATURE_ROOT ?? '/home/talos/work/Research-Workflow-Records');
const requireRecords = process.argv.includes('--require-records');
const requireBuilt = process.argv.includes('--built');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src/reading/literature-library.json'), 'utf8'));
const topicIds = new Set([
  'structures-phase-competition', 'electronic-character', 'defects-disorder', 'interfaces-heterostructures',
  'magnetism-correlation', 'lattice-dynamics', 'electron-phonon-superconductivity', 'polarization-response',
  'quasiparticles-excitons', 'transport-scattering', 'quantum-geometry-topology', 'reliability-validation',
]);
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const unique = (items) => new Set(items).size === items.length;
const published = manifest.papers.filter((paper) => paper.status === 'published');
const pending = manifest.papers.filter((paper) => paper.status === 'source_pending');
const mismatched = manifest.papers.filter((paper) => paper.status === 'source_mismatch');
const available = fs.existsSync(recordsRoot) && fs.statSync(recordsRoot).isDirectory();

assert(manifest.schema_version === 1, 'unexpected library manifest schema');
assert(manifest.stats.scanned === 130, `unexpected Records scan count: ${manifest.stats.scanned}`);
assert(manifest.stats.atlas_related === manifest.papers.length, 'Atlas-related count does not match paper entries');
assert(manifest.stats.published === published.length, 'published count does not match paper entries');
assert(manifest.stats.missing_pdf === pending.length, 'missing PDF count does not match source_pending entries');
assert(manifest.stats.deduplicated === manifest.deduplicated_records.length, 'deduplicated count does not match audit records');
assert(manifest.stats.unclassified === 0, 'manifest reports unresolved classification');
assert(manifest.stats.failed === mismatched.length, 'failed count does not match source_mismatch entries');
assert(Array.isArray(manifest.failed_records) && manifest.failed_records.length === mismatched.length, 'failed-record audit does not match source_mismatch entries');
assert(unique(manifest.papers.map((paper) => paper.paper_id)), 'duplicate paper_id');
assert(unique(published.map((paper) => paper.document_sha256)), 'duplicate published PDF hash');
assert(unique(manifest.papers.filter((paper) => paper.doi).map((paper) => paper.doi.toLowerCase())), 'duplicate DOI');
assert(!requireRecords || available, `Records source root unavailable: ${recordsRoot}`);

for (const paper of manifest.papers) {
  assert(typeof paper.title === 'string' && paper.title.length > 5, `invalid title: ${paper.paper_id}`);
  assert(Array.isArray(paper.authors) && paper.authors.length > 0, `missing authors: ${paper.paper_id}`);
  assert(Number.isInteger(paper.year) && paper.year >= 1900 && paper.year <= 2100, `invalid year: ${paper.paper_id}`);
  assert(typeof paper.venue === 'string' && paper.venue.length > 1, `missing venue: ${paper.paper_id}`);
  assert(topicIds.has(paper.primary_category), `invalid category: ${paper.paper_id}`);
  assert(Array.isArray(paper.topic_relations) && paper.topic_relations.includes(paper.primary_category), `invalid topic relations: ${paper.paper_id}`);
  if (paper.status === 'source_pending') {
    assert(!paper.source_record_path && !paper.pdf_path && !paper.document_sha256 && !paper.atlas_route, `pending paper exposes a false Reader: ${paper.paper_id}`);
    continue;
  }
  assert(['published', 'source_mismatch'].includes(paper.status), `invalid source status: ${paper.paper_id}`);
  assert(paper.source_record_path?.startsWith('literature/'), `invalid Records path: ${paper.paper_id}`);
  assert(paper.pdf_path?.startsWith(`${paper.source_record_path}/`), `PDF leaves source package: ${paper.paper_id}`);
  assert(/^[a-f0-9]{64}$/.test(paper.document_sha256), `invalid PDF SHA-256: ${paper.paper_id}`);
  assert(Number.isInteger(paper.page_count) && paper.page_count > 0, `invalid page count: ${paper.paper_id}`);
  if (paper.status === 'published') {
    assert(paper.atlas_route === `/reading/literature/${paper.primary_category}/${paper.paper_id}/`, `route/category mismatch: ${paper.paper_id}`);
  } else {
    assert(!paper.atlas_route && typeof paper.failure_reason === 'string' && paper.failure_reason.length > 10, `mismatched source exposes a false Reader: ${paper.paper_id}`);
  }
  if (!available) continue;
  const pdfPath = path.resolve(recordsRoot, paper.pdf_path);
  const fromRecords = path.relative(recordsRoot, pdfPath);
  assert(fromRecords !== '..' && !fromRecords.startsWith(`..${path.sep}`), `PDF escapes Records: ${paper.paper_id}`);
  assert(fs.existsSync(pdfPath) && fs.statSync(pdfPath).isFile(), `canonical PDF missing: ${paper.paper_id}`);
  if (!fs.existsSync(pdfPath)) continue;
  const hash = createHash('sha256').update(fs.readFileSync(pdfPath)).digest('hex');
  assert(hash === paper.document_sha256, `canonical PDF hash mismatch: ${paper.paper_id}`);
  const pages = Number(execFileSync('pdfinfo', [pdfPath], { encoding: 'utf8' }).match(/^Pages:\s+(\d+)$/m)?.[1]);
  assert(pages === paper.page_count, `canonical PDF page count mismatch: ${paper.paper_id}`);
}

if (requireBuilt) {
  const distRoot = path.join(root, 'dist');
  assert(fs.existsSync(distRoot), 'built site is unavailable');
  for (const paper of manifest.papers) {
    const topicFile = path.join(distRoot, 'reading/literature', paper.primary_category, 'index.html');
    assert(fs.existsSync(topicFile), `built topic route missing: ${paper.primary_category}`);
    if (!fs.existsSync(topicFile)) continue;
    const topicHtml = fs.readFileSync(topicFile, 'utf8');
    if (paper.status === 'published') {
      const publicHref = `/Electronic-Structure-Learning${paper.atlas_route}`;
      assert(topicHtml.includes(`href="${publicHref}"`), `topic href missing: ${paper.paper_id}`);
      const routeFile = path.join(distRoot, paper.atlas_route.replace(/^\//, ''), 'index.html');
      assert(fs.existsSync(routeFile), `built Reader route missing: ${paper.paper_id}`);
      if (fs.existsSync(routeFile)) {
        const routeHtml = fs.readFileSync(routeFile, 'utf8');
        assert(routeHtml.includes(`/papers/${paper.paper_id}.pdf`), `Reader PDF mapping missing: ${paper.paper_id}`);
        assert(routeHtml.includes(paper.document_sha256), `Reader document hash missing: ${paper.paper_id}`);
        assert(!routeHtml.includes('data:video/mp2t'), `Reader script was not bundled: ${paper.paper_id}`);
      }
    } else {
      const officialHref = paper.doi ? `https://doi.org/${paper.doi}` : paper.arxiv ? `https://arxiv.org/abs/${paper.arxiv}` : null;
      assert(officialHref && topicHtml.includes(`href="${officialHref}"`), `pending official href missing: ${paper.paper_id}`);
    }
  }
}

const prohibited = JSON.stringify(manifest).toLowerCase();
assert(!prohibited.includes('10.1103/physrevb.109.174507'), 'blocked mismatched ZrNCl DOI entered the library');
assert(!manifest.papers.some((paper) => paper.title.startsWith('Comparative Electron')), 'internal HfX2 problem map entered the public library');
if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify(manifest.stats, null, 2));
console.log(`Literature library audit passed${available ? ' with Records PDF identity verification' : ''}${requireBuilt ? ' and built-route verification' : ''}.`);
