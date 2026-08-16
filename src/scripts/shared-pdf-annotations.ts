import {
  AnnotationPlugin,
  type AnnotationScope,
  type AnnotationTransferItem,
  type PdfAnnotationFlagName,
  type PdfAnnotationObject,
  type PluginRegistry,
} from '@embedpdf/snippet';
import { isFinalizedSharedAnnotation, isTextSharedAnnotation } from './shared-annotation-lifecycle';

type SharedAnnotationResponse = {
  document_hash: string;
  annotations: Array<{ annotation: PdfAnnotationObject; created_at: string }>;
};

type SharedAnnotationOptions = {
  registry: PluginRegistry;
  documentId: string;
  documentHash: string;
  apiUrl: string;
  readerElement: HTMLElement;
  ignoredAnnotationIds?: Iterable<string>;
};

const readOnlyAnnotation = (annotation: PdfAnnotationObject): PdfAnnotationObject => ({
  ...annotation,
  author: undefined,
  flags: [...new Set<PdfAnnotationFlagName>([...(annotation.flags ?? []), 'readOnly', 'locked', 'lockedContents'])],
});

const updateStatus = (readerElement: HTMLElement, count: number, state: 'ready' | 'editing' | 'saving' | 'error') => {
  readerElement.dataset.sharedAnnotationCount = String(count);
  readerElement.dataset.sharedAnnotationState = state;
  const status = document.querySelector<HTMLElement>('[data-shared-annotation-status]');
  const saveButton = document.querySelector<HTMLButtonElement>('[data-save-shared-annotation]');
  if (saveButton) saveButton.hidden = state !== 'editing';
  if (!status) return;
  status.textContent = state === 'error'
    ? 'Shared annotation save failed. The PDF remains readable; retry by adding the annotation again.'
    : state === 'editing'
      ? 'Finish the text or comment to save this shared annotation.'
      : state === 'saving'
      ? 'Saving to the global anonymous annotation layer…'
      : `Global anonymous annotation layer · ${count} ${count === 1 ? 'annotation' : 'annotations'} loaded.`;
};

const lockPersistedAnnotation = (scope: AnnotationScope, annotation: PdfAnnotationObject) => {
  scope.syncAnnotationObject(annotation.id, { flags: readOnlyAnnotation(annotation).flags, author: undefined });
  scope.deselectAnnotation();
};

export const sharedAnnotationViewerConfig = {
  annotations: {
    annotationAuthor: '',
    autoCommit: true,
    deactivateToolAfterCreate: false,
    editAfterCreate: true,
    selectAfterCreate: true,
  },
  disabledCategories: [
    'form',
    'redaction',
    'insert',
    'document-open',
    'document-export',
    'document-print',
    'annotation-shape',
    'annotation-ink',
    'annotation-strikeout',
    'annotation-squiggly',
    'annotation-insert-text',
    'annotation-replace-text',
    'annotation-stamp',
    'annotation-signature',
    'annotation-attachment',
  ],
};

export const attachSharedAnnotationLayer = async ({
  registry,
  documentId,
  documentHash,
  apiUrl,
  readerElement,
  ignoredAnnotationIds = [],
}: SharedAnnotationOptions) => {
  if (!/^[a-f0-9]{64}$/.test(documentHash)) throw new Error('Invalid shared annotation document identity.');
  const capability = registry.getPlugin<AnnotationPlugin>('annotation')?.provides?.();
  if (!capability) throw new Error('PDF annotation capability is unavailable.');
  const scope = capability.forDocument(documentId);
  const ignoredIds = new Set(ignoredAnnotationIds);
  const persistedIds = new Set<string>();
  const savingIds = new Set<string>();
  const textDraftIds = new Set<string>();
  const saveButton = document.querySelector<HTMLButtonElement>('[data-save-shared-annotation]');

  const findEditable = (root: Document | ShadowRoot): HTMLElement | null => {
    const direct = root.querySelector<HTMLElement>('[contenteditable="true"]');
    if (direct) return direct;
    for (const element of root.querySelectorAll<HTMLElement>('*')) {
      if (element.shadowRoot) {
        const nested = findEditable(element.shadowRoot);
        if (nested) return nested;
      }
    }
    return null;
  };

  saveButton?.addEventListener('click', () => {
    const selectedId = scope.getSelectedAnnotations()[0]?.object.id;
    const annotationId = selectedId && textDraftIds.has(selectedId) ? selectedId : [...textDraftIds].at(-1);
    if (!annotationId) return;
    const annotation = scope.getAnnotationById(annotationId)?.object;
    const editor = findEditable(document);
    if (!annotation || !editor) return;
    scope.updateAnnotation(annotation.pageIndex, annotation.id, { contents: editor.innerText.replace(/\u00a0/g, ' ') });
  });

  const response = await fetch(apiUrl, { credentials: 'same-origin' });
  if (!response.ok) throw new Error(`Shared annotation request failed with HTTP ${response.status}.`);
  const payload = await response.json() as SharedAnnotationResponse;
  if (payload.document_hash !== documentHash || !Array.isArray(payload.annotations)) throw new Error('Shared annotation response identity mismatch.');
  const imported: AnnotationTransferItem[] = payload.annotations.map((entry) => {
    persistedIds.add(entry.annotation.id);
    return { annotation: readOnlyAnnotation(entry.annotation) };
  });
  if (imported.length) scope.importAnnotations(imported);
  updateStatus(readerElement, persistedIds.size, 'ready');

  const persist = async (annotation: PdfAnnotationObject) => {
    if (savingIds.has(annotation.id)) return;
    savingIds.add(annotation.id);
    updateStatus(readerElement, persistedIds.size, 'saving');
    try {
      const saveResponse = await fetch(apiUrl, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ annotation: { ...annotation, author: undefined } }),
      });
      if (!saveResponse.ok) throw new Error(`Shared annotation save failed with HTTP ${saveResponse.status}.`);
      const saved = await saveResponse.json() as { annotation: PdfAnnotationObject; status: 'created' | 'duplicate' };
      if (!saved.annotation?.id) throw new Error('Shared annotation save response is invalid.');
      if (saved.annotation.id !== annotation.id) {
        scope.purgeAnnotation(annotation.pageIndex, annotation.id);
        if (!persistedIds.has(saved.annotation.id)) scope.importAnnotations([{ annotation: readOnlyAnnotation(saved.annotation) }]);
      } else {
        lockPersistedAnnotation(scope, annotation);
      }
      persistedIds.add(saved.annotation.id);
      textDraftIds.delete(annotation.id);
      updateStatus(readerElement, persistedIds.size, 'ready');
    } catch (error) {
      console.error(error);
      updateStatus(readerElement, persistedIds.size, 'error');
    } finally {
      savingIds.delete(annotation.id);
    }
  };

  scope.onAnnotationEvent((event) => {
    if (event.documentId !== documentId || event.type === 'loaded' || !event.committed) return;
    if (ignoredIds.has(event.annotation.id) || persistedIds.has(event.annotation.id)) return;
    if (event.type === 'delete') {
      textDraftIds.delete(event.annotation.id);
      return;
    }
    const annotation = scope.getAnnotationById(event.annotation.id)?.object;
    if (!annotation) return;
    if (event.type === 'create' && isTextSharedAnnotation(annotation)) {
      textDraftIds.add(annotation.id);
      updateStatus(readerElement, persistedIds.size, 'editing');
      return;
    }
    if (isFinalizedSharedAnnotation(event.type, annotation)) void persist(annotation);
  });

  return { scope, count: persistedIds.size };
};
