import { createHash } from 'node:crypto';
import { createReadStream, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { isAbsolute, relative, resolve, sep } from 'node:path';

const host = '127.0.0.1';
const port = Number(process.env.ATLAS_LITERATURE_PORT ?? 8103);
const recordsRoot = resolve(process.env.ATLAS_LITERATURE_ROOT ?? '/home/talos/work/Research-Workflow-Records');
const annotatedWhitelist = [{
  paperId: 'hbn-sin-superconductivity-cdw',
  doi: '10.1103/jmys-zkgs',
  sourceSha256: '7b66fdf0f4b4688f3633bd43ce908289923da5ab79c928fcd4964ebb7e8fbdaf',
  manifestPath: 'manifests/readers/hbn-sin-superconductivity-cdw.json',
}];

const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const resolveInsideRoot = (path) => {
  const absolute = resolve(recordsRoot, path);
  const fromRoot = relative(recordsRoot, absolute);
  if (isAbsolute(fromRoot) || fromRoot === '..' || fromRoot.startsWith(`..${sep}`)) throw new Error(`Path escapes literature root: ${path}`);
  return absolute;
};

const annotatedPapers = annotatedWhitelist.map((entry) => {
  const manifestPath = resolveInsideRoot(entry.manifestPath);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.paper_id !== entry.paperId || manifest.doi !== entry.doi || manifest.pdf?.sha256 !== entry.sourceSha256) {
    throw new Error(`Literature manifest identity mismatch: ${entry.paperId}`);
  }
  const pdfPath = resolveInsideRoot(manifest.pdf.path);
  const annotationsPath = resolveInsideRoot(manifest.annotations.path);
  if (!statSync(pdfPath).isFile() || !statSync(annotationsPath).isFile()) throw new Error(`Literature source is not a file: ${entry.paperId}`);
  if (sha256(pdfPath) !== manifest.pdf.sha256) throw new Error(`PDF hash mismatch: ${entry.paperId}`);
  if (sha256(annotationsPath) !== manifest.annotations.sha256) throw new Error(`Annotation hash mismatch: ${entry.paperId}`);
  const annotations = JSON.parse(readFileSync(annotationsPath, 'utf8'));
  if (annotations.paper_id !== entry.paperId || annotations.source_sha256 !== entry.sourceSha256) {
    throw new Error(`Annotation identity mismatch: ${entry.paperId}`);
  }
  return [entry.paperId, { ...entry, manifest, pdfPath, annotationsPath }];
});

const preprocessingWhitelist = JSON.parse(readFileSync(new URL('./literature-preprocessing-sources.json', import.meta.url), 'utf8'));
const preprocessingPapers = preprocessingWhitelist.map((entry) => {
  const paperId = entry.paper_id;
  const pdfPath = resolveInsideRoot(entry.pdf_path);
  if (!paperId || !entry.doi || !entry.source_sha256 || !statSync(pdfPath).isFile()) {
    throw new Error(`Invalid preprocessing literature mapping: ${paperId ?? 'unknown'}`);
  }
  if (sha256(pdfPath) !== entry.source_sha256) throw new Error(`PDF hash mismatch: ${paperId}`);
  return [paperId, {
    paperId,
    doi: entry.doi,
    sourceSha256: entry.source_sha256,
    pdfPath,
  }];
});

const papers = new Map([...annotatedPapers, ...preprocessingPapers]);
if (papers.size !== annotatedPapers.length + preprocessingPapers.length) throw new Error('Duplicate literature runtime paper ID.');

const allowedOrigins = new Set(['http://127.0.0.1:4321', 'http://localhost:4321', 'http://127.0.0.1:8101']);

const notFound = (response) => {
  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
  response.end('Not found\n');
};

const serveJson = (request, response, paper) => {
  if (!paper.annotationsPath) return notFound(response);
  const body = readFileSync(paper.annotationsPath);
  response.writeHead(200, {
    'Cache-Control': 'private, no-store',
    'Content-Length': body.length,
    'Content-Type': 'application/json; charset=utf-8',
    ETag: `"sha256-${paper.manifest.annotations.sha256}"`,
    'X-Content-Type-Options': 'nosniff',
  });
  if (request.method === 'HEAD') response.end(); else response.end(body);
};

const servePdf = (request, response, paper) => {
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
  if (request.method !== 'GET' && request.method !== 'HEAD') return notFound(response);

  for (const [paperId, paper] of papers) {
    if (url.pathname === `/papers/${paperId}.pdf`) return servePdf(request, response, paper);
    if (url.pathname === `/papers/${paperId}/annotations.json`) return serveJson(request, response, paper);
  }
  return notFound(response);
});

server.listen(port, host, () => {
  console.log(`Atlas literature runtime listening on http://${host}:${port} for ${papers.size} whitelisted papers`);
});
