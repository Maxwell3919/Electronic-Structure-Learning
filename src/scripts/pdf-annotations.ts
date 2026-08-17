import {
  AnnotationPlugin,
  type AnnotationTransferItem,
  type PdfAnnotationFlagName,
  type PdfAnnotationObject,
  type PluginRegistry,
} from '@embedpdf/snippet';
import {
  deletePersonalAnnotationRecord,
  listPersonalAnnotations,
  openPersonalDatabase,
  savePersonalAnnotationRecord,
} from './personal-reader-storage';

type CuratedAnnotationResponse = {
  document_hash: string;
  authority: 'github-curated';
  annotations: Array<{ annotation: PdfAnnotationObject; created_at: string; updated_at?: string }>;
};

type AnnotationLayerOptions = {
  registry: PluginRegistry;
  documentId: string;
  documentHash: string;
  pageCount: number;
  paperId: string;
  paperTitle: string;
  curatedApiUrl: string;
  readerElement: HTMLElement;
  ignoredAnnotationIds?: Iterable<string>;
};

const READ_ONLY_FLAGS: PdfAnnotationFlagName[] = ['readOnly', 'locked', 'lockedContents'];
const TEXT_ANNOTATION_TYPES = new Set([1, 3]);
const PERSONAL_EXPORT_SCHEMA = 1;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PERSONAL_ANNOTATION_TYPES = new Set([1, 3, 9, 10]);

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

const savePersonalAnnotation = async (database: IDBDatabase, documentHash: string, annotation: PdfAnnotationObject) => {
  const clean = personalAnnotation(annotation);
  await savePersonalAnnotationRecord(database, documentHash, clean);
};

const deletePersonalAnnotation = async (database: IDBDatabase, documentHash: string, annotationId: string) => {
  await deletePersonalAnnotationRecord(database, documentHash, annotationId);
};

const stableValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, stableValue(entry)]));
  }
  return value;
};

const stableJson = (value: unknown) => `${JSON.stringify(stableValue(value), null, 2)}\n`;

const validImportedAnnotation = (value: unknown, pageCount: number): value is PdfAnnotationObject => {
  const annotation = value as Partial<PdfAnnotationObject>;
  const rect = annotation.rect as PdfAnnotationObject['rect'] | undefined;
  return Boolean(
    annotation && typeof annotation === 'object'
    && typeof annotation.id === 'string' && UUID.test(annotation.id)
    && Number.isInteger(annotation.pageIndex) && Number(annotation.pageIndex) >= 0 && Number(annotation.pageIndex) < pageCount
    && Number.isInteger(annotation.type) && PERSONAL_ANNOTATION_TYPES.has(Number(annotation.type))
    && rect && typeof rect === 'object'
    && [rect.origin?.x, rect.origin?.y, rect.size?.width, rect.size?.height].every(Number.isFinite)
    && Number(rect.origin?.x) >= 0 && Number(rect.origin?.y) >= 0
    && Number(rect.size?.width) > 0 && Number(rect.size?.height) > 0,
  );
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
  pageCount,
  paperId,
  paperTitle,
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

  // EmbedPDF 2.15 keeps FreeText/Comment keystrokes inside its shadow editor.
  // Persist the visible editor state directly: calling updateAnnotation here
  // rerenders the editor on every key and moves the caret.
  readerElement.addEventListener('input', (event) => {
    if (!database) return;
    const editor = event.composedPath().find((node) => (
      node instanceof HTMLElement && node.getAttribute('contenteditable') === 'true'
    )) as HTMLElement | undefined;
    const selected = scope.getSelectedAnnotations()[0]?.object;
    if (!editor || !selected || !TEXT_ANNOTATION_TYPES.has(selected.type)
      || curatedIds.has(selected.id) || ignoredIds.has(selected.id)) return;
    personalIds.add(selected.id);
    const visibleAnnotation = {
      ...selected,
      contents: editor.innerText.replace(/\u00a0/g, ' '),
    };
    void savePersonalAnnotation(database, documentHash, visibleAnnotation)
      .then(() => setLayerStatus(readerElement, 'personal', 'ready', personalIds.size))
      .catch((error) => { console.error(error); setLayerStatus(readerElement, 'personal', 'error', personalIds.size); });
  }, { capture: true });

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

  const exportPersonalJson = async () => {
    if (!database) throw new Error('Personal annotation storage is unavailable.');
    const records = await listPersonalAnnotations(database, documentHash);
    return stableJson({
      schema_version: PERSONAL_EXPORT_SCHEMA,
      authority: 'browser-personal',
      paper_id: paperId,
      document_sha256: documentHash,
      annotations: records.map((record) => personalAnnotation(record.annotation)),
    });
  };

  const exportPersonalMarkdown = async () => {
    if (!database) throw new Error('Personal annotation storage is unavailable.');
    const records = await listPersonalAnnotations(database, documentHash);
    const lines = [
      `# ${paperTitle} — personal annotations`,
      '',
      `- Paper ID: \`${paperId}\``,
      `- Document SHA-256: \`${documentHash}\``,
      '',
    ];
    if (!records.length) lines.push('_No personal annotations in this browser._', '');
    for (const [index, record] of records.entries()) {
      const contents = typeof record.annotation.contents === 'string' && record.annotation.contents.trim()
        ? record.annotation.contents.trim()
        : '_No text contents._';
      lines.push(`## ${index + 1}. Page ${record.annotation.pageIndex + 1}`, '', contents, '', `Annotation ID: \`${record.annotationId}\``, '');
    }
    return `${lines.join('\n').trimEnd()}\n`;
  };

  const importPersonalJson = async (value: unknown) => {
    if (!database) throw new Error('Personal annotation storage is unavailable.');
    const bundle = value as {
      schema_version?: number;
      authority?: string;
      paper_id?: string;
      document_sha256?: string;
      annotations?: unknown[];
    };
    if (
      bundle.schema_version !== PERSONAL_EXPORT_SCHEMA
      || bundle.authority !== 'browser-personal'
      || bundle.paper_id !== paperId
      || bundle.document_sha256 !== documentHash
      || !Array.isArray(bundle.annotations)
    ) throw new Error('Import identity does not match this paper and document.');
    if (bundle.annotations.length > 5000) throw new Error('Import contains too many annotations.');
    const imported = bundle.annotations.map((annotation) => {
      if (!validImportedAnnotation(annotation, pageCount)) throw new Error('Import contains an invalid or out-of-document annotation.');
      return personalAnnotation(annotation);
    });
    const importIds = new Set<string>();
    for (const annotation of imported) {
      if (importIds.has(annotation.id)) throw new Error(`Import contains duplicate annotation ID ${annotation.id}.`);
      if (curatedIds.has(annotation.id) || ignoredIds.has(annotation.id)) throw new Error(`Import collides with read-only annotation ID ${annotation.id}.`);
      importIds.add(annotation.id);
    }
    const current = new Map((await listPersonalAnnotations(database, documentHash))
      .map((record) => [record.annotationId, record.annotation]));
    const additions: PdfAnnotationObject[] = [];
    let skipped = 0;
    let conflicts = 0;
    for (const annotation of imported) {
      const existing = current.get(annotation.id);
      if (!existing) {
        additions.push(annotation);
      } else if (stableJson(existing) === stableJson(annotation)) {
        skipped += 1;
      } else {
        conflicts += 1;
      }
    }
    for (const annotation of additions) await savePersonalAnnotation(database, documentHash, annotation);
    if (additions.length) scope.importAnnotations(additions.map((annotation) => ({ annotation })));
    for (const annotation of additions) personalIds.add(annotation.id);
    setLayerStatus(readerElement, 'personal', 'ready', personalIds.size);
    return { imported: additions.length, skipped, conflicts };
  };

  window.addEventListener('pagehide', () => database?.close(), { once: true });

  return {
    scope,
    curatedCount: curatedIds.size,
    personalCount: personalIds.size,
    exportPersonalJson,
    exportPersonalMarkdown,
    importPersonalJson,
  };
};
