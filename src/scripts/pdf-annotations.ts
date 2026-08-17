import {
  AnnotationPlugin,
  type AnnotationTransferItem,
  type PdfAnnotationFlagName,
  type PdfAnnotationObject,
  type PluginRegistry,
} from '@embedpdf/snippet';

type CuratedAnnotationResponse = {
  document_hash: string;
  authority: 'github-curated';
  annotations: Array<{ annotation: PdfAnnotationObject; created_at: string; updated_at?: string }>;
};

type AnnotationLayerOptions = {
  registry: PluginRegistry;
  documentId: string;
  documentHash: string;
  curatedApiUrl: string;
  readerElement: HTMLElement;
  ignoredAnnotationIds?: Iterable<string>;
};

type PersonalAnnotationRecord = {
  key: string;
  documentHash: string;
  annotationId: string;
  annotation: PdfAnnotationObject;
  updatedAt: string;
};

const DB_NAME = 'electronic-structure-atlas-personal-annotations';
const DB_VERSION = 1;
const STORE_NAME = 'annotations';
const DOCUMENT_INDEX = 'documentHash';
const READ_ONLY_FLAGS: PdfAnnotationFlagName[] = ['readOnly', 'locked', 'lockedContents'];

const curatedAnnotation = (annotation: PdfAnnotationObject): PdfAnnotationObject => ({
  ...annotation,
  author: undefined,
  flags: [...new Set<PdfAnnotationFlagName>([...(annotation.flags ?? []), ...READ_ONLY_FLAGS])],
});

const personalAnnotation = (annotation: PdfAnnotationObject): PdfAnnotationObject => ({
  ...annotation,
  author: undefined,
  flags: (annotation.flags ?? []).filter((flag) => !READ_ONLY_FLAGS.includes(flag)),
});

const request = <T>(operation: IDBRequest<T>) => new Promise<T>((resolve, reject) => {
  operation.addEventListener('success', () => resolve(operation.result));
  operation.addEventListener('error', () => reject(operation.error ?? new Error('IndexedDB request failed.')));
});

const transactionDone = (transaction: IDBTransaction) => new Promise<void>((resolve, reject) => {
  transaction.addEventListener('complete', () => resolve());
  transaction.addEventListener('abort', () => reject(transaction.error ?? new Error('IndexedDB transaction aborted.')));
  transaction.addEventListener('error', () => reject(transaction.error ?? new Error('IndexedDB transaction failed.')));
});

const openPersonalDatabase = () => new Promise<IDBDatabase>((resolve, reject) => {
  const operation = indexedDB.open(DB_NAME, DB_VERSION);
  operation.addEventListener('upgradeneeded', () => {
    const store = operation.result.createObjectStore(STORE_NAME, { keyPath: 'key' });
    store.createIndex(DOCUMENT_INDEX, DOCUMENT_INDEX, { unique: false });
  });
  operation.addEventListener('success', () => resolve(operation.result));
  operation.addEventListener('error', () => reject(operation.error ?? new Error('IndexedDB is unavailable.')));
});

const listPersonalAnnotations = async (database: IDBDatabase, documentHash: string) => {
  const transaction = database.transaction(STORE_NAME, 'readonly');
  const records = await request(transaction.objectStore(STORE_NAME).index(DOCUMENT_INDEX).getAll(documentHash)) as PersonalAnnotationRecord[];
  await transactionDone(transaction);
  return records.sort((left, right) => left.annotationId.localeCompare(right.annotationId));
};

const savePersonalAnnotation = async (database: IDBDatabase, documentHash: string, annotation: PdfAnnotationObject) => {
  const clean = personalAnnotation(annotation);
  const transaction = database.transaction(STORE_NAME, 'readwrite', { durability: 'strict' });
  transaction.objectStore(STORE_NAME).put({
    key: `${documentHash}:${clean.id}`,
    documentHash,
    annotationId: clean.id,
    annotation: clean,
    updatedAt: new Date().toISOString(),
  } satisfies PersonalAnnotationRecord);
  await transactionDone(transaction);
};

const deletePersonalAnnotation = async (database: IDBDatabase, documentHash: string, annotationId: string) => {
  const transaction = database.transaction(STORE_NAME, 'readwrite', { durability: 'strict' });
  transaction.objectStore(STORE_NAME).delete(`${documentHash}:${annotationId}`);
  await transactionDone(transaction);
};

const setLayerStatus = (
  readerElement: HTMLElement,
  layer: 'curated' | 'personal',
  state: 'loading' | 'ready' | 'error',
  count: number,
) => {
  readerElement.dataset[`${layer}AnnotationState`] = state;
  readerElement.dataset[`${layer}AnnotationCount`] = String(count);
  const status = document.querySelector<HTMLElement>(`[data-${layer}-annotation-status]`);
  if (!status) return;
  status.textContent = state === 'error'
    ? layer === 'curated'
      ? 'Curated annotations are temporarily unavailable; the PDF and personal annotations remain usable.'
      : 'Personal annotations are unavailable in this browser; curated annotations remain readable.'
    : layer === 'curated'
      ? `${count} curated ${count === 1 ? 'annotation' : 'annotations'} · read-only.`
      : `${count} personal ${count === 1 ? 'annotation' : 'annotations'} · stored only in this browser.`;
};

export const annotationViewerConfig = {
  annotations: {
    annotationAuthor: '',
    autoCommit: true,
    deactivateToolAfterCreate: false,
    editAfterCreate: true,
    selectAfterCreate: true,
  },
  disabledCategories: [
    'form', 'redaction', 'insert', 'document-open', 'document-export', 'document-print',
    'annotation-shape', 'annotation-ink', 'annotation-strikeout', 'annotation-squiggly',
    'annotation-insert-text', 'annotation-replace-text', 'annotation-stamp',
    'annotation-signature', 'annotation-attachment',
  ],
};

export const attachAnnotationLayers = async ({
  registry,
  documentId,
  documentHash,
  curatedApiUrl,
  readerElement,
  ignoredAnnotationIds = [],
}: AnnotationLayerOptions) => {
  if (!/^[a-f0-9]{64}$/.test(documentHash)) throw new Error('Invalid annotation document identity.');
  const capability = registry.getPlugin<AnnotationPlugin>('annotation')?.provides?.();
  if (!capability) throw new Error('PDF annotation capability is unavailable.');
  const scope = capability.forDocument(documentId);
  const ignoredIds = new Set(ignoredAnnotationIds);
  const curatedIds = new Set<string>();
  const personalIds = new Set<string>();
  let database: IDBDatabase | null = null;

  setLayerStatus(readerElement, 'curated', 'loading', 0);
  setLayerStatus(readerElement, 'personal', 'loading', 0);

  try {
    const response = await fetch(curatedApiUrl, { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`Curated annotation request failed with HTTP ${response.status}.`);
    const payload = await response.json() as CuratedAnnotationResponse;
    if (payload.document_hash !== documentHash || payload.authority !== 'github-curated' || !Array.isArray(payload.annotations)) {
      throw new Error('Curated annotation response identity mismatch.');
    }
    const imported = payload.annotations.map((entry) => {
      curatedIds.add(entry.annotation.id);
      return { annotation: curatedAnnotation(entry.annotation) } satisfies AnnotationTransferItem;
    });
    if (imported.length) scope.importAnnotations(imported);
    setLayerStatus(readerElement, 'curated', 'ready', curatedIds.size);
  } catch (error) {
    console.error(error);
    setLayerStatus(readerElement, 'curated', 'error', 0);
  }

  try {
    database = await openPersonalDatabase();
    const records = await listPersonalAnnotations(database, documentHash);
    for (const record of records) {
      if (curatedIds.has(record.annotationId)) {
        await deletePersonalAnnotation(database, documentHash, record.annotationId);
        continue;
      }
      personalIds.add(record.annotationId);
    }
    const imported = records
      .filter((record) => personalIds.has(record.annotationId))
      .map((record) => ({ annotation: personalAnnotation(record.annotation) }) satisfies AnnotationTransferItem);
    if (imported.length) scope.importAnnotations(imported);
    setLayerStatus(readerElement, 'personal', 'ready', personalIds.size);
  } catch (error) {
    console.error(error);
    database?.close();
    database = null;
    setLayerStatus(readerElement, 'personal', 'error', 0);
  }

  scope.onAnnotationEvent((event) => {
    if (!database || event.documentId !== documentId || event.type === 'loaded') return;
    // EmbedPDF reports in-progress FreeText/Comment contents as uncommitted update
    // events. Personal records can safely follow those updates because saving them
    // neither ends editing nor locks the annotation. Geometry create/delete events
    // still require their committed form.
    if (event.type !== 'update' && !event.committed) return;
    const annotationId = event.annotation.id;
    if (ignoredIds.has(annotationId) || curatedIds.has(annotationId)) return;
    if (event.type === 'delete') {
      personalIds.delete(annotationId);
      void deletePersonalAnnotation(database, documentHash, annotationId)
        .then(() => setLayerStatus(readerElement, 'personal', 'ready', personalIds.size))
        .catch((error) => { console.error(error); setLayerStatus(readerElement, 'personal', 'error', personalIds.size); });
      return;
    }
    const annotation = scope.getAnnotationById(annotationId)?.object;
    if (!annotation) return;
    personalIds.add(annotationId);
    void savePersonalAnnotation(database, documentHash, annotation)
      .then(() => setLayerStatus(readerElement, 'personal', 'ready', personalIds.size))
      .catch((error) => { console.error(error); setLayerStatus(readerElement, 'personal', 'error', personalIds.size); });
  });

  return { scope, curatedCount: curatedIds.size, personalCount: personalIds.size };
};
