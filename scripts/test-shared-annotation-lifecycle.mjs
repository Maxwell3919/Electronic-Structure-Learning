import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isFinalizedSharedAnnotation } from '../src/scripts/shared-annotation-lifecycle.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'src/scripts/shared-pdf-annotations.ts');
const source = fs.readFileSync(sourcePath, 'utf8');

assert(!source.includes('setTimeout'), 'shared annotations must not guess text completion with a timer');
assert(source.includes('getAnnotationById'), 'persistence must read the latest annotation object from the live scope');
assert(source.includes("event.type === 'create' && isTextSharedAnnotation"), 'text annotation create events must remain drafts');
assert(source.includes('isFinalizedSharedAnnotation'), 'shared annotation finalization must use the lifecycle policy');
assert(source.includes("state !== 'editing'"), 'text drafts must expose an explicit Save annotation confirmation');
const annotation = (type, contents) => ({ id: '00000000-0000-4000-8000-000000000001', pageIndex: 0, type, contents });
assert.equal(isFinalizedSharedAnnotation('create', annotation(3, '')), false, 'FreeText geometry must remain a draft');
assert.equal(isFinalizedSharedAnnotation('update', annotation(3, 'S')), true, 'a committed editor-close update is a finalization signal');
assert.equal(isFinalizedSharedAnnotation('update', annotation(3, 'Shared annotation acceptance test')), true, 'multi-character FreeText must persist in full');
assert.equal(isFinalizedSharedAnnotation('create', annotation(1, '')), false, 'an empty Sticky Note must remain a draft');
assert.equal(isFinalizedSharedAnnotation('update', annotation(1, 'Shared sticky note acceptance test')), true, 'submitted Sticky Note contents must persist');
assert.equal(isFinalizedSharedAnnotation('create', annotation(9)), true, 'Highlight must persist after its range is complete');
assert.equal(isFinalizedSharedAnnotation('create', annotation(10)), true, 'Underline must persist after its range is complete');
console.log('Shared annotation draft-to-final lifecycle source audit passed.');
