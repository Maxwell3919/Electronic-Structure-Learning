import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const server = fs.readFileSync(path.join(root, 'services/literature-runtime-server.mjs'), 'utf8');
const unit = fs.readFileSync(path.join(root, 'services/talos-atlas-literature.service'), 'utf8');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

assert(!server.includes('node:sqlite') && !server.includes('ATLAS_ANNOTATION_DB'), 'runtime still depends on SQLite');
assert(!server.includes("request.method === 'POST'") && !server.includes("request.method === 'DELETE'") && !server.includes("request.method === 'PUT'"), 'annotation API exposes a mutation method');
assert(server.includes("if (!['GET', 'HEAD'].includes(request.method ?? '')) return notFound"), 'PDF/source routes are not method-gated read-only');
assert(!/readFileSync\(paper\.pdfPath/.test(server) && server.includes('createReadStream(paper.pdfPath'), 'PDF delivery is not pre-indexed filesystem streaming');
assert(unit.includes('ReadOnlyPaths=/home/talos/work/Electronic-Structure-Learning /home/talos/work/Research-Workflow-Records'), 'unit lacks Records read-only baseline');
assert(!unit.includes('ReadWritePaths=') && !unit.includes('annotations.sqlite3'), 'runtime unit retains a filesystem write grant');
if (failures.length) { failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log('Records PDF/MinerU/metadata/curated-annotation read-only runtime boundary audit passed.');
