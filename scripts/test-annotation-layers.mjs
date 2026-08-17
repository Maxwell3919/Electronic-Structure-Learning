import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(root, 'src/scripts/pdf-annotations.ts'), 'utf8');
const server = fs.readFileSync(path.join(root, 'services/literature-runtime-server.mjs'), 'utf8');

assert(source.includes("const DB_NAME = 'electronic-structure-atlas-personal-annotations'"), 'personal annotations must use a dedicated IndexedDB database');
assert(source.includes("database.transaction(STORE_NAME, 'readwrite', { durability: 'strict' })"), 'personal writes must request strict IndexedDB durability');
assert(source.includes('scope.getAnnotationById(annotationId)?.object'), 'personal updates must persist the latest live annotation object');
assert(source.includes("event.type !== 'update' && !event.committed"), 'in-progress text updates must reach IndexedDB without finalizing or locking the editor');
assert(source.includes("readerElement.addEventListener('input'"), 'shadow text editor input must be mirrored into the annotation model');
assert(source.includes('scope.updateAnnotation(selected.pageIndex, selected.id'), 'text editor mirroring must use the current selected annotation');
assert(source.includes("event.type === 'delete'"), 'personal delete events must remove IndexedDB records');
assert(source.includes('deletePersonalAnnotation(database, documentHash, annotationId)'), 'personal delete is not namespace-scoped');
assert(source.includes('if (curatedIds.has(record.annotationId))'), 'curated IDs must take precedence over colliding local records');
assert(source.includes("authority !== 'github-curated'"), 'curated response authority must be validated');
assert(!source.includes("method: 'POST'") && !source.includes('localStorage'), 'browser must not POST public annotations or use localStorage');
assert(!/token|password|cookie/i.test(source), 'annotation client must not handle credentials or secrets');
assert(!server.includes("method === 'POST'") && !server.includes("method === 'DELETE'"), 'curated runtime contains a mutation route');
console.log('Curated read-only and personal IndexedDB create/update/delete structural audit passed.');
