import {
  AnnotationPlugin,
  type AnnotationScope,
  type AnnotationTransferItem,
  type PdfAnnotationFlagName,
  type PdfAnnotationObject,
  type PluginRegistry,
} from '@embedpdf/snippet';

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

const updateStatus = (readerElement: HTMLElement, count: number, state: 'ready' | 'saving' | 'error') => {
  readerElement.dataset.sharedAnnotationCount = String(count);
  readerElement.dataset.sharedAnnotationState = state;
  const status = document.querySelector<HTMLElement>('[data-shared-annotation-status]');
  if (!status) return;
  status.textContent = state === 'error'
    ? 'Shared annotation save failed. The PDF remains readable; retry by adding the annotation again.'
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
    deactivateToolAfterCreate: true,
    editAfterCreate: false,
    selectAfterCreate: false,
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
  const pending = new Map<string, { annotation: PdfAnnotationObject; timer: number }>();

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
      updateStatus(readerElement, persistedIds.size, 'ready');
    } catch (error) {
      console.error(error);
      updateStatus(readerElement, persistedIds.size, 'error');
    }
  };

  scope.onAnnotationEvent((event) => {
    if (event.documentId !== documentId || event.type === 'loaded' || !event.committed) return;
    if (ignoredIds.has(event.annotation.id) || persistedIds.has(event.annotation.id)) return;
    if (event.type === 'delete') {
      const item = pending.get(event.annotation.id);
      if (item) window.clearTimeout(item.timer);
      pending.delete(event.annotation.id);
      return;
    }
    const prior = pending.get(event.annotation.id);
    if (prior) window.clearTimeout(prior.timer);
    const timer = window.setTimeout(() => {
      pending.delete(event.annotation.id);
      void persist(event.annotation);
    }, 500);
    pending.set(event.annotation.id, { annotation: event.annotation, timer });
  });

  return { scope, count: persistedIds.size };
};
