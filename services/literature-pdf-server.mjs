import { createHash } from 'node:crypto';
import { createReadStream, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';

const host = '127.0.0.1';
const port = Number(process.env.ATLAS_PDF_PORT ?? 8103);
const route = '/papers/hbn-sin-superconductivity-cdw.pdf';
const source = process.env.ATLAS_PILOT_PDF_SOURCE;
const expectedSha256 = '7b66fdf0f4b4688f3633bd43ce908289923da5ab79c928fcd4964ebb7e8fbdaf';
const allowedOrigins = new Set([
  'http://127.0.0.1:4321',
  'http://localhost:4321',
  'http://127.0.0.1:8101',
]);

if (!source) throw new Error('ATLAS_PILOT_PDF_SOURCE is required.');
const metadata = statSync(source);
if (!metadata.isFile()) throw new Error('The configured PDF source is not a file.');
const sha256 = createHash('sha256').update(readFileSync(source)).digest('hex');
if (sha256 !== expectedSha256) throw new Error(`Pilot PDF hash mismatch: ${sha256}`);

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://${host}:${port}`);
  const origin = request.headers.origin;
  if (origin && allowedOrigins.has(origin)) response.setHeader('Access-Control-Allow-Origin', origin);
  response.setHeader('Vary', 'Origin');

  if (request.method === 'OPTIONS') {
    response.writeHead(204, { 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS', 'Access-Control-Allow-Headers': 'Range' });
    response.end();
    return;
  }
  if ((request.method !== 'GET' && request.method !== 'HEAD') || url.pathname !== route) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found\n');
    return;
  }

  const commonHeaders = {
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'private, no-store',
    'Content-Disposition': 'inline; filename="hbn-sin-superconductivity-cdw.pdf"',
    'Content-Type': 'application/pdf',
    ETag: `"sha256-${sha256}"`,
    'X-Content-Type-Options': 'nosniff',
  };
  const range = request.headers.range;
  if (!range) {
    response.writeHead(200, { ...commonHeaders, 'Content-Length': metadata.size });
    if (request.method === 'HEAD') response.end();
    else createReadStream(source).pipe(response);
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
  response.writeHead(206, {
    ...commonHeaders,
    'Content-Length': end - start + 1,
    'Content-Range': `bytes ${start}-${end}/${metadata.size}`,
  });
  if (request.method === 'HEAD') response.end();
  else createReadStream(source, { start, end }).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Atlas literature PDF service listening on http://${host}:${port}${route}`);
});
