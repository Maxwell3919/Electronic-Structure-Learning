import { createHash } from 'node:crypto';
import {
  closeSync, createReadStream, existsSync, lstatSync, openSync, readFileSync,
  readdirSync, readSync, statSync,
} from 'node:fs';
import { createServer } from 'node:http';
import { isAbsolute, relative, resolve, sep } from 'node:path';

const host = '127.0.0.1';
const port = Number(process.env.ATLAS_LITERATURE_PORT ?? 8103);
const recordsRoot = resolve(process.env.ATLAS_LITERATURE_ROOT ?? '/home/talos/work/Research-Workflow-Records');
const libraryManifestPath = resolve(process.env.ATLAS_LITERATURE_MANIFEST ?? new URL('../src/reading/literature-library.json', import.meta.url).pathname);
const deploymentManifestPath = resolve(process.env.ATLAS_DEPLOYMENT_MANIFEST ?? new URL('../dist/deployment-manifest.json', import.meta.url).pathname);
const syncStatusPath = resolve(process.env.ATLAS_RECORDS_SYNC_STATUS ?? '/home/talos/.local/state/electronic-structure-atlas/records-sync-status.json');
const maxAnnotationBytes = 64 * 1024;
const allowedAnnotationTypes = new Set([1, 3, 9, 10]);
const allowedOrigins = new Set(['http://127.0.0.1:4321', 'http://localhost:4321', 'http://127.0.0.1:8101', 'http://188.255.156.20']);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const resolveInside = (root, entryPath) => {
  const absolute = resolve(root, entryPath);
  const fromRoot = relative(root, absolute);
  if (isAbsolute(fromRoot) || fromRoot === '..' || fromRoot.startsWith(`..${sep}`)) throw new Error(`Path escapes root: ${entryPath}`);
  return absolute;
};
const readPdfMagic = (file) => {
  const fd = openSync(file, 'r');
  try {
    const bytes = Buffer.alloc(5);
    return readSync(fd, bytes, 0, bytes.length, 0) === bytes.length && bytes.toString() === '%PDF-';
  } finally { closeSync(fd); }
};

const libraryBytes = readFileSync(libraryManifestPath);
const library = JSON.parse(libraryBytes);
const manifestSha256 = sha256(libraryBytes);
const publishedEntries = library.papers.filter((entry) => entry.status === 'published');
const papers = new Map(publishedEntries.map((entry) => {
  if (!entry.paper_id || !entry.pdf_path || !entry.source_record_path || !/^[a-f0-9]{64}$/.test(entry.document_sha256)
    || !Number.isInteger(entry.page_count) || !Number.isInteger(entry.pdf_size_bytes) || entry.pdf_size_bytes < 5) {
    throw new Error(`Invalid published literature manifest entry: ${entry.paper_id ?? 'unknown'}`);
  }
  const packagePath = resolveInside(recordsRoot, entry.source_record_path);
  const pdfPath = resolveInside(packagePath, relative(entry.source_record_path, entry.pdf_path));
  const annotationPath = entry.annotation_path ?? `${entry.source_record_path}/annotations`;
  const annotationDir = resolveInside(packagePath, relative(entry.source_record_path, annotationPath));
  const analysisPath = entry.reading_analysis_path ? resolveInside(recordsRoot, entry.reading_analysis_path) : null;
  const analysisSha256 = entry.reading_analysis_sha256 ?? null;
  const metadata = statSync(pdfPath);
  if (!metadata.isFile() || metadata.size !== entry.pdf_size_bytes || !readPdfMagic(pdfPath)) throw new Error(`Pre-indexed PDF metadata mismatch: ${entry.paper_id}`);
  if ((analysisPath === null) !== (analysisSha256 === null)
    || (analysisPath && (!/^[a-f0-9]{64}$/.test(analysisSha256) || !statSync(analysisPath).isFile() || sha256(readFileSync(analysisPath)) !== analysisSha256))) {
    throw new Error(`Pre-indexed reading analysis mismatch: ${entry.paper_id}`);
  }
  if (!['allowed', 'blocked'].includes(entry.public_pdf_delivery) || typeof entry.rights_reviewed !== 'boolean') {
    throw new Error(`Missing public-delivery decision: ${entry.paper_id}`);
  }
  if (entry.public_pdf_delivery === 'allowed' && (!entry.rights_reviewed || !entry.rights_evidence?.license_url)) {
    throw new Error(`Unsafe public-delivery decision: ${entry.paper_id}`);
  }
  return [entry.paper_id, {
    paperId: entry.paper_id, sourceSha256: entry.document_sha256, pageCount: entry.page_count,
    pdfSize: entry.pdf_size_bytes, pdfPath, annotationDir, analysisPath, analysisSha256,
    publicPdfDelivery: entry.public_pdf_delivery, rightsEvidence: entry.rights_evidence,
  }];
}));
if (papers.size !== publishedEntries.length) throw new Error('Duplicate literature runtime paper ID.');
const papersByHash = new Map([...papers.values()].map((paper) => [paper.sourceSha256, paper]));
if (papersByHash.size !== papers.size) throw new Error('Duplicate canonical PDF hash in literature manifest.');
const publicPapers = new Map([...papers].filter(([, paper]) => paper.publicPdfDelivery === 'allowed'));

const jsonResponse = (request, response, status, body, extraHeaders = {}) => {
  const payload = Buffer.from(`${JSON.stringify(body)}\n`);
  response.writeHead(status, {
    'Cache-Control': 'private, no-store', 'Content-Length': payload.length,
    'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff', ...extraHeaders,
  });
  if (request.method === 'HEAD') response.end(); else response.end(payload);
};
const notFound = (request, response) => jsonResponse(request, response, 404, { error: 'not_found' });
const canonicalize = (value, key = '') => {
  if (['id', 'created', 'modified', 'author', 'flags'].includes(key)) return undefined;
  if (Array.isArray(value)) return value.map((item) => canonicalize(item)).filter((item) => item !== undefined);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().flatMap((entryKey) => {
    const entry = canonicalize(value[entryKey], entryKey);
    return entry === undefined ? [] : [[entryKey, entry]];
  }));
  return value;
};
const finiteRect = (rect) => rect && typeof rect === 'object'
  && Number.isFinite(rect.origin?.x) && Number.isFinite(rect.origin?.y)
  && Number.isFinite(rect.size?.width) && Number.isFinite(rect.size?.height)
  && rect.size.width > 0 && rect.size.height > 0;
const validateAnnotation = (value, paper) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'annotation must be an object';
  if (!uuid.test(value.id ?? '')) return 'annotation id must be a lowercase UUID';
  if (!Number.isInteger(value.pageIndex) || value.pageIndex < 0 || value.pageIndex >= paper.pageCount) return 'annotation pageIndex is outside the document';
  if (!allowedAnnotationTypes.has(value.type)) return 'annotation type is not enabled';
  if (!finiteRect(value.rect)) return 'annotation rect is invalid';
  if (value.contents !== undefined && (typeof value.contents !== 'string' || value.contents.length > 16_384)) return 'annotation contents are invalid';
  if ([9, 10].includes(value.type) && (!Array.isArray(value.segmentRects) || value.segmentRects.length < 1 || value.segmentRects.length > 256 || value.segmentRects.some((rect) => !finiteRect(rect)))) return 'text markup geometry is invalid';
  const encoded = JSON.stringify(value).toLowerCase();
  for (const prohibited of ['user_id', 'username', 'avatar', 'account', 'ip_address']) if (encoded.includes(`"${prohibited}"`)) return `identity field ${prohibited} is prohibited`;
  return null;
};
const validateRecord = (record, paper, filename) => {
  if (!record || record.schema_version !== 1 || record.annotation_id !== filename.replace(/\.json$/, '')
    || record.document_sha256 !== paper.sourceSha256 || record.page_index !== record.annotation_payload?.pageIndex
    || record.annotation_id !== record.annotation_payload?.id || !Number.isFinite(Date.parse(record.created_at))) return 'annotation record identity mismatch';
  if (record.updated_at !== undefined && (!Number.isFinite(Date.parse(record.updated_at)) || Date.parse(record.updated_at) < Date.parse(record.created_at))) return 'annotation record updated_at is invalid';
  return validateAnnotation(record.annotation_payload, paper);
};
const readAnnotationRecords = (paper) => {
  if (!existsSync(paper.annotationDir)) return [];
  const results = [];
  const deduped = new Set();
  for (const filename of readdirSync(paper.annotationDir).filter((name) => uuid.test(name.replace(/\.json$/, '')) && name.endsWith('.json')).sort()) {
    const file = resolveInside(paper.annotationDir, filename);
    const metadata = lstatSync(file);
    if (!metadata.isFile() || metadata.isSymbolicLink() || metadata.size > maxAnnotationBytes) throw new Error(`Unsafe annotation record: ${filename}`);
    const record = JSON.parse(readFileSync(file, 'utf8'));
    const error = validateRecord(record, paper, filename);
    if (error) throw new Error(`${filename}: ${error}`);
    const dedupeKey = sha256(JSON.stringify(canonicalize(record.annotation_payload)));
    if (deduped.has(dedupeKey)) throw new Error(`Duplicate curated annotation content: ${filename}`);
    deduped.add(dedupeKey);
    results.push({ record, dedupeKey });
  }
  return results.sort((a, b) => a.record.created_at.localeCompare(b.record.created_at) || a.record.annotation_id.localeCompare(b.record.annotation_id));
};

const serveCuratedAnnotations = (request, response, documentHash, paper) => {
  if (!['GET', 'HEAD'].includes(request.method ?? '')) return jsonResponse(request, response, 405, { error: 'method_not_allowed' }, { Allow: 'GET, HEAD, OPTIONS' });
  try {
    const annotations = readAnnotationRecords(paper).map(({ record }) => ({ annotation: record.annotation_payload, created_at: record.created_at, ...(record.updated_at ? { updated_at: record.updated_at } : {}) }));
    return jsonResponse(request, response, 200, { document_hash: documentHash, authority: 'github-curated', annotations: request.method === 'HEAD' ? [] : annotations });
  } catch { return jsonResponse(request, response, 500, { error: 'curated_annotation_store_invalid' }); }
};

const readJsonFile = (file) => {
  try { return JSON.parse(readFileSync(file, 'utf8')); } catch { return null; }
};
const serveHealth = (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method ?? '')) return jsonResponse(request, response, 405, { error: 'method_not_allowed' }, { Allow: 'GET, HEAD, OPTIONS' });
  const deployment = readJsonFile(deploymentManifestPath);
  const sync = readJsonFile(syncStatusPath);
  const localCommit = sync?.records_local_commit ?? null;
  const originCommit = sync?.records_origin_main_commit ?? null;
  return jsonResponse(request, response, 200, {
    service: 'electronic-structure-atlas-literature',
    status: localCommit && localCommit === originCommit ? 'ok' : 'degraded',
    atlas_deployed_commit: deployment?.sha ?? null,
    records_local_commit: localCommit,
    records_origin_main_commit: originCommit,
    last_successful_sync: sync?.last_successful_sync ?? null,
    manifest_sha256: manifestSha256,
    manifest_records_main_commit: library.records_main_sha ?? null,
    published_papers: papers.size,
    public_pdf_papers: publicPapers.size,
    withheld_pdf_papers: papers.size - publicPapers.size,
    curated_annotations: 'github-read-only',
    personal_annotations: 'browser-indexeddb',
  });
};

const serveReadingAnalysis = (request, response, paper) => {
  if (!paper.analysisPath || !paper.analysisSha256) return notFound(request, response);
  const body = readFileSync(paper.analysisPath);
  response.writeHead(200, { 'Cache-Control': 'private, no-store', 'Content-Length': body.length, 'Content-Type': 'application/json; charset=utf-8', ETag: `"sha256-${paper.analysisSha256}"`, 'X-Content-Type-Options': 'nosniff' });
  if (request.method === 'HEAD') response.end(); else response.end(body);
};
const servePdf = (request, response, paper) => {
  const commonHeaders = {
    'Accept-Ranges': 'bytes', 'Cache-Control': 'private, no-store',
    'Content-Disposition': `inline; filename="${paper.paperId}.pdf"`, 'Content-Type': 'application/pdf',
    ETag: `"sha256-${paper.sourceSha256}"`, 'X-Atlas-PDF-Identity': 'preindexed-sha256', 'X-Content-Type-Options': 'nosniff',
  };
  const range = request.headers.range;
  if (!range) {
    response.writeHead(200, { ...commonHeaders, 'Content-Length': paper.pdfSize });
    if (request.method === 'HEAD') response.end(); else createReadStream(paper.pdfPath).pipe(response);
    return;
  }
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match || (!match[1] && !match[2])) { response.writeHead(416, { ...commonHeaders, 'Content-Range': `bytes */${paper.pdfSize}` }); response.end(); return; }
  const suffixLength = match[1] ? null : Number(match[2]);
  const start = suffixLength === null ? Number(match[1]) : Math.max(paper.pdfSize - suffixLength, 0);
  const end = match[2] && suffixLength === null ? Math.min(Number(match[2]), paper.pdfSize - 1) : paper.pdfSize - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end || start >= paper.pdfSize) {
    response.writeHead(416, { ...commonHeaders, 'Content-Range': `bytes */${paper.pdfSize}` }); response.end(); return;
  }
  response.writeHead(206, { ...commonHeaders, 'Content-Length': end - start + 1, 'Content-Range': `bytes ${start}-${end}/${paper.pdfSize}` });
  if (request.method === 'HEAD') response.end(); else createReadStream(paper.pdfPath, { start, end }).pipe(response);
};

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://${host}:${port}`), origin = request.headers.origin;
  if (origin && allowedOrigins.has(origin)) response.setHeader('Access-Control-Allow-Origin', origin);
  response.setHeader('Vary', 'Origin');
  if (request.method === 'OPTIONS') {
    if (origin && !allowedOrigins.has(origin)) return notFound(request, response);
    response.writeHead(204, { 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS', 'Access-Control-Max-Age': '600' }); return response.end();
  }
  if (url.pathname === '/papers/health') return serveHealth(request, response);
  if (url.pathname === '/papers/' && ['GET', 'HEAD'].includes(request.method ?? '')) return jsonResponse(request, response, 200, {
    service: 'electronic-structure-atlas-literature', published_papers: papers.size, public_pdf_papers: publicPapers.size, withheld_pdf_papers: papers.size - publicPapers.size, pdf_identity: 'preindexed-sha256-plus-rights-gate', curated_annotation_store: 'github-records-read-only', personal_annotation_store: 'browser-indexeddb', annotation_api: '/papers/api/annotations/{document_sha256}', health: '/papers/health',
  });
  const annotationMatch = /^\/papers\/api\/annotations\/([a-f0-9]{64})$/.exec(url.pathname);
  if (annotationMatch) { const paper = papersByHash.get(annotationMatch[1]); return paper ? serveCuratedAnnotations(request, response, annotationMatch[1], paper) : notFound(request, response); }
  if (!['GET', 'HEAD'].includes(request.method ?? '')) return notFound(request, response);
  const pdfMatch = /^\/papers\/([^/]+)\.pdf$/.exec(url.pathname);
  if (pdfMatch) { const paper = publicPapers.get(decodeURIComponent(pdfMatch[1])); return paper ? servePdf(request, response, paper) : notFound(request, response); }
  const analysisMatch = /^\/papers\/([^/]+)\/reading-analysis\.json$/.exec(url.pathname);
  if (analysisMatch) { const paper = papers.get(decodeURIComponent(analysisMatch[1])); return paper ? serveReadingAnalysis(request, response, paper) : notFound(request, response); }
  return notFound(request, response);
});

const close = () => server.close(() => process.exit(0));
process.on('SIGTERM', close);
process.on('SIGINT', close);
server.listen(port, host, () => console.log(`Atlas literature runtime listening on http://${host}:${port} for ${papers.size} indexed papers and ${publicPapers.size} rights-cleared public PDFs; curated annotations are read-only Records data`));
