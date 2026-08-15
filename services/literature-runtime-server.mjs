import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, statSync, createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const host = '127.0.0.1';
const port = Number(process.env.ATLAS_LITERATURE_PORT ?? 8103);
const recordsRoot = resolve(process.env.ATLAS_LITERATURE_ROOT ?? '/home/talos/work/Research-Workflow-Records');
const databasePath = resolve(process.env.ATLAS_ANNOTATION_DB ?? '/home/talos/.local/share/electronic-structure-atlas/annotations.sqlite3');
const maxAnnotationBytes = 64 * 1024;
const rateLimitWindowMs = 60_000;
const rateLimitMax = 30;
const allowedAnnotationTypes = new Set([1, 3, 9, 10]); // text note, free text, highlight, underline
const allowedOrigins = new Set([
  'http://127.0.0.1:4321',
  'http://localhost:4321',
  'http://127.0.0.1:8101',
  'http://188.255.156.20',
]);

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const sha256File = (file) => sha256(readFileSync(file));
const resolveInsideRoot = (entryPath) => {
  const absolute = resolve(recordsRoot, entryPath);
  const fromRoot = relative(recordsRoot, absolute);
  if (isAbsolute(fromRoot) || fromRoot === '..' || fromRoot.startsWith(`..${sep}`)) throw new Error(`Path escapes literature root: ${entryPath}`);
  return absolute;
};

const library = JSON.parse(readFileSync(new URL('../src/reading/literature-library.json', import.meta.url), 'utf8'));
const publishedEntries = library.papers.filter((entry) => entry.status === 'published');
const papers = new Map(publishedEntries.map((entry) => {
  if (!entry.paper_id || !entry.pdf_path || !/^[a-f0-9]{64}$/.test(entry.document_sha256) || !Number.isInteger(entry.page_count)) {
    throw new Error(`Invalid published literature manifest entry: ${entry.paper_id ?? 'unknown'}`);
  }
  const pdfPath = resolveInsideRoot(entry.pdf_path);
  if (!statSync(pdfPath).isFile()) throw new Error(`Literature source is not a file: ${entry.paper_id}`);
  return [entry.paper_id, {
    paperId: entry.paper_id,
    sourceSha256: entry.document_sha256,
    pageCount: entry.page_count,
    pdfPath,
    verified: false,
  }];
}));
if (papers.size !== publishedEntries.length) throw new Error('Duplicate literature runtime paper ID.');
const papersByHash = new Map([...papers.values()].map((paper) => [paper.sourceSha256, paper]));
if (papersByHash.size !== papers.size) throw new Error('Duplicate canonical PDF hash in literature manifest.');

const annotatedManifest = JSON.parse(readFileSync(resolveInsideRoot('manifests/readers/hbn-sin-superconductivity-cdw.json'), 'utf8'));
const scientificAnnotationsPath = resolveInsideRoot(annotatedManifest.annotations.path);
if (annotatedManifest.paper_id !== 'hbn-sin-superconductivity-cdw' || !statSync(scientificAnnotationsPath).isFile()) {
  throw new Error('Scientific annotation authority mismatch for hbn-sin-superconductivity-cdw.');
}
if (sha256File(scientificAnnotationsPath) !== annotatedManifest.annotations.sha256) {
  throw new Error('Scientific annotation file hash mismatch for hbn-sin-superconductivity-cdw.');
}

mkdirSync(dirname(databasePath), { recursive: true, mode: 0o700 });
const database = new DatabaseSync(databasePath);
database.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS annotations (
    document_hash TEXT NOT NULL,
    annotation_id TEXT NOT NULL,
    page_index INTEGER NOT NULL,
    payload_json TEXT NOT NULL,
    dedupe_key TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (document_hash, annotation_id),
    UNIQUE (document_hash, dedupe_key)
  );
  CREATE INDEX IF NOT EXISTS annotations_document_created
    ON annotations (document_hash, created_at, annotation_id);
`);
const selectAnnotations = database.prepare(`
  SELECT annotation_id, page_index, payload_json, created_at
  FROM annotations WHERE document_hash = ? ORDER BY created_at, annotation_id
`);
const selectById = database.prepare(`
  SELECT annotation_id, page_index, payload_json, created_at
  FROM annotations WHERE document_hash = ? AND annotation_id = ?
`);
const selectByDedupe = database.prepare(`
  SELECT annotation_id, page_index, payload_json, created_at
  FROM annotations WHERE document_hash = ? AND dedupe_key = ?
`);
const insertAnnotation = database.prepare(`
  INSERT INTO annotations (document_hash, annotation_id, page_index, payload_json, dedupe_key, created_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const verifiedHashes = new Set();
const verifyPaper = (paper) => {
  if (verifiedHashes.has(paper.sourceSha256)) return true;
  if (sha256File(paper.pdfPath) !== paper.sourceSha256) return false;
  verifiedHashes.add(paper.sourceSha256);
  paper.verified = true;
  return true;
};

const jsonResponse = (response, status, body, extraHeaders = {}) => {
  const payload = Buffer.from(`${JSON.stringify(body)}\n`);
  response.writeHead(status, {
    'Cache-Control': 'private, no-store',
    'Content-Length': payload.length,
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  });
  response.end(payload);
};
const notFound = (response) => jsonResponse(response, 404, { error: 'not_found' });
const parseStored = (row) => ({ annotation: JSON.parse(row.payload_json), created_at: row.created_at });

const canonicalize = (value, key = '') => {
  if (['id', 'created', 'modified', 'author', 'flags'].includes(key)) return undefined;
  if (Array.isArray(value)) return value.map((item) => canonicalize(item)).filter((item) => item !== undefined);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().flatMap((entryKey) => {
      const entry = canonicalize(value[entryKey], entryKey);
      return entry === undefined ? [] : [[entryKey, entry]];
    }));
  }
  return value;
};
const finiteRect = (rect) => rect && typeof rect === 'object'
  && Number.isFinite(rect.origin?.x) && Number.isFinite(rect.origin?.y)
  && Number.isFinite(rect.size?.width) && Number.isFinite(rect.size?.height)
  && rect.size.width > 0 && rect.size.height > 0;
const validateAnnotation = (value, paper) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'annotation must be an object';
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.id ?? '')) return 'annotation id must be a UUID';
  if (!Number.isInteger(value.pageIndex) || value.pageIndex < 0 || value.pageIndex >= paper.pageCount) return 'annotation pageIndex is outside the document';
  if (!allowedAnnotationTypes.has(value.type)) return 'annotation type is not enabled';
  if (!finiteRect(value.rect)) return 'annotation rect is invalid';
  if (value.contents !== undefined && (typeof value.contents !== 'string' || value.contents.length > 16_384)) return 'annotation contents are invalid';
  if ([9, 10].includes(value.type) && (!Array.isArray(value.segmentRects) || value.segmentRects.length < 1 || value.segmentRects.length > 256 || value.segmentRects.some((rect) => !finiteRect(rect)))) {
    return 'text markup geometry is invalid';
  }
  return null;
};

const rateBuckets = new Map();
const requestKey = (request) => {
  const forwarded = request.headers['x-forwarded-for'];
  return typeof forwarded === 'string' && forwarded ? forwarded.split(',')[0].trim() : request.socket.remoteAddress ?? 'unknown';
};
const rateLimited = (request) => {
  const now = Date.now();
  const key = requestKey(request);
  const bucket = rateBuckets.get(key);
  if (!bucket || now - bucket.startedAt >= rateLimitWindowMs) {
    rateBuckets.set(key, { startedAt: now, count: 1 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > rateLimitMax;
};

const readJsonBody = (request, response, callback) => {
  const declaredLength = Number(request.headers['content-length'] ?? 0);
  if (declaredLength > maxAnnotationBytes) return jsonResponse(response, 413, { error: 'payload_too_large' });
  const chunks = [];
  let size = 0;
  let rejected = false;
  request.on('data', (chunk) => {
    if (rejected) return;
    size += chunk.length;
    if (size > maxAnnotationBytes) {
      rejected = true;
      jsonResponse(response, 413, { error: 'payload_too_large' });
      return;
    }
    chunks.push(chunk);
  });
  request.on('end', () => {
    if (rejected) return;
    try {
      callback(JSON.parse(Buffer.concat(chunks).toString('utf8')));
    } catch {
      jsonResponse(response, 400, { error: 'malformed_json' });
    }
  });
};

const serveSharedAnnotations = (request, response, documentHash, paper) => {
  if (!verifyPaper(paper)) return jsonResponse(response, 409, { error: 'document_identity_mismatch' });
  if (request.method === 'GET' || request.method === 'HEAD') {
    const annotations = selectAnnotations.all(documentHash).map(parseStored);
    if (request.method === 'HEAD') return jsonResponse(response, 200, { document_hash: documentHash, annotations: [] });
    return jsonResponse(response, 200, { document_hash: documentHash, annotations });
  }
  if (request.method !== 'POST') return jsonResponse(response, 405, { error: 'method_not_allowed' }, { Allow: 'GET, HEAD, POST, OPTIONS' });
  if (rateLimited(request)) return jsonResponse(response, 429, { error: 'rate_limited' }, { 'Retry-After': '60' });
  return readJsonBody(request, response, (body) => {
    const annotation = body?.annotation;
    const validationError = validateAnnotation(annotation, paper);
    if (validationError) return jsonResponse(response, 400, { error: 'invalid_annotation', detail: validationError });
    const payloadJson = JSON.stringify(annotation);
    const dedupeKey = sha256(JSON.stringify(canonicalize(annotation)));
    const exactDuplicate = selectByDedupe.get(documentHash, dedupeKey);
    if (exactDuplicate) return jsonResponse(response, 200, { status: 'duplicate', ...parseStored(exactDuplicate) });
    const sameId = selectById.get(documentHash, annotation.id);
    if (sameId) return jsonResponse(response, 409, { error: 'annotation_id_conflict' });
    const createdAt = new Date().toISOString();
    insertAnnotation.run(documentHash, annotation.id, annotation.pageIndex, payloadJson, dedupeKey, createdAt);
    return jsonResponse(response, 201, { status: 'created', annotation, created_at: createdAt });
  });
};

const serveScientificJson = (request, response) => {
  const body = readFileSync(scientificAnnotationsPath);
  response.writeHead(200, {
    'Cache-Control': 'private, no-store',
    'Content-Length': body.length,
    'Content-Type': 'application/json; charset=utf-8',
    ETag: `"sha256-${annotatedManifest.annotations.sha256}"`,
    'X-Content-Type-Options': 'nosniff',
  });
  if (request.method === 'HEAD') response.end(); else response.end(body);
};

const servePdf = (request, response, paper) => {
  if (!verifyPaper(paper)) return jsonResponse(response, 409, { error: 'document_identity_mismatch' });
  const metadata = statSync(paper.pdfPath);
  const commonHeaders = {
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'private, no-store',
    'Content-Disposition': `inline; filename="${paper.paperId}.pdf"`,
    'Content-Type': 'application/pdf',
    ETag: `"sha256-${paper.sourceSha256}"`,
    'X-Content-Type-Options': 'nosniff',
  };
  const range = request.headers.range;
  if (!range) {
    response.writeHead(200, { ...commonHeaders, 'Content-Length': metadata.size });
    if (request.method === 'HEAD') response.end(); else createReadStream(paper.pdfPath).pipe(response);
    return;
  }
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match || (!match[1] && !match[2])) {
    response.writeHead(416, { ...commonHeaders, 'Content-Range': `bytes */${metadata.size}` });
    response.end();
    return;
  }
  const suffixLength = match[1] ? null : Number(match[2]);
  const start = suffixLength === null ? Number(match[1]) : Math.max(metadata.size - suffixLength, 0);
  const end = match[2] && suffixLength === null ? Math.min(Number(match[2]), metadata.size - 1) : metadata.size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end || start >= metadata.size) {
    response.writeHead(416, { ...commonHeaders, 'Content-Range': `bytes */${metadata.size}` });
    response.end();
    return;
  }
  response.writeHead(206, { ...commonHeaders, 'Content-Length': end - start + 1, 'Content-Range': `bytes ${start}-${end}/${metadata.size}` });
  if (request.method === 'HEAD') response.end(); else createReadStream(paper.pdfPath, { start, end }).pipe(response);
};

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://${host}:${port}`);
  const origin = request.headers.origin;
  if (origin && allowedOrigins.has(origin)) response.setHeader('Access-Control-Allow-Origin', origin);
  response.setHeader('Vary', 'Origin');
  if (request.method === 'OPTIONS') {
    if (origin && !allowedOrigins.has(origin)) return notFound(response);
    response.writeHead(204, {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Max-Age': '600',
    });
    return response.end();
  }

  const annotationMatch = /^\/papers\/api\/annotations\/([a-f0-9]{64})$/.exec(url.pathname);
  if (annotationMatch) {
    const paper = papersByHash.get(annotationMatch[1]);
    return paper ? serveSharedAnnotations(request, response, annotationMatch[1], paper) : notFound(response);
  }
  if (!['GET', 'HEAD'].includes(request.method ?? '')) return notFound(response);
  const pdfMatch = /^\/papers\/([^/]+)\.pdf$/.exec(url.pathname);
  if (pdfMatch) {
    const paper = papers.get(decodeURIComponent(pdfMatch[1]));
    return paper ? servePdf(request, response, paper) : notFound(response);
  }
  if (url.pathname === '/papers/hbn-sin-superconductivity-cdw/annotations.json') return serveScientificJson(request, response);
  return notFound(response);
});

const close = () => {
  server.close(() => {
    database.close();
    process.exit(0);
  });
};
process.on('SIGTERM', close);
process.on('SIGINT', close);
server.listen(port, host, () => {
  console.log(`Atlas literature runtime listening on http://${host}:${port} for ${papers.size} published papers; annotations at ${databasePath}`);
});
