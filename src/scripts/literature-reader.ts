import EmbedPDF, {
  AnnotationPlugin,
  PdfAnnotationBorderStyle,
  PdfAnnotationSubtype,
  SelectionPlugin,
  ScrollPlugin,
  ScrollStrategy,
  ZoomPlugin,
  type AnnotationTransferItem,
  type PdfSquareAnnoObject,
  type ScrollMetrics,
} from '@embedpdf/snippet';
import { annotationViewerConfig, attachAnnotationLayers } from './pdf-annotations';
import { attachPersonalReaderControls } from './personal-reader-controls';
import type {
  PaperAnchor,
  PaperAnnotationDocument,
  PaperReadingNote,
} from '../reading/paper-reader-schema';

const reader = document.querySelector<HTMLElement>('.paper-reader');
const target = document.querySelector<HTMLElement>('#pdf-viewer');

const attachDebugDiagnostics = (readerElement: HTMLElement) => {
  if (new URLSearchParams(window.location.search).get('debug') !== '1') return;
  const container = document.querySelector<HTMLDetailsElement>('[data-reader-debug]');
  const output = container?.querySelector<HTMLElement>('[data-reader-debug-output]');
  const annotationUrl = readerElement.dataset.curatedAnnotationsUrl;
  if (!container || !output || !annotationUrl) return;
  container.hidden = false;
  const healthUrl = new URL(annotationUrl, window.location.href);
  healthUrl.pathname = healthUrl.pathname.replace(/\/api\/annotations\/[a-f0-9]{64}$/, '/health');
  fetch(healthUrl, { credentials: 'same-origin' })
    .then(async (response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      output.textContent = JSON.stringify(await response.json(), null, 2);
    })
    .catch((error) => { output.textContent = `Diagnostics unavailable: ${String(error)}`; });
};

const isNormalizedBox = (anchor: PaperAnchor) => {
  const { x, y, width, height } = anchor.bbox;
  return [x, y, width, height].every(Number.isFinite)
    && x >= 0 && y >= 0 && width > 0 && height > 0
    && x + width <= 1 && y + height <= 1;
};

const validateDocument = (value: unknown, paperId: string, sourceSha256: string): PaperAnnotationDocument => {
  const annotationDocument = value as Partial<PaperAnnotationDocument>;
  if (
    annotationDocument.schema_version !== 2
    || annotationDocument.paper_id !== paperId
    || annotationDocument.source_sha256 !== sourceSha256
    || annotationDocument.coordinate_space?.origin !== 'top-left'
    || annotationDocument.coordinate_space?.units !== 'normalized'
    || !Number.isFinite(annotationDocument.coordinate_space.page_width_points)
    || !Number.isFinite(annotationDocument.coordinate_space.page_height_points)
    || !Array.isArray(annotationDocument.anchors)
    || annotationDocument.anchors.length === 0
    || !Array.isArray(annotationDocument.readingNotes)
  ) throw new Error('Annotation authority does not match this paper.');

  const ids = new Set<string>();
  for (const anchor of annotationDocument.anchors) {
    if (
      !anchor || typeof anchor.id !== 'string' || ids.has(anchor.id)
      || !Number.isInteger(anchor.page) || anchor.page < 1
      || !['paragraph', 'figure', 'equation', 'table'].includes(anchor.type)
      || !isNormalizedBox(anchor)
    ) throw new Error('Annotation authority contains an invalid anchor.');
    ids.add(anchor.id);
  }
  const noteIds = new Set<string>();
  for (const note of annotationDocument.readingNotes) {
    const entries = [...(note?.left ?? []), ...(note?.right ?? [])];
    if (
      !note || typeof note.id !== 'string' || noteIds.has(note.id)
      || !Array.isArray(note.anchorIds) || note.anchorIds.length === 0
      || note.anchorIds.some((id) => typeof id !== 'string' || !ids.has(id))
      || !Array.isArray(note.left) || !Array.isArray(note.right)
      || entries.some((entry) => (
        !entry || typeof entry.anchorId !== 'string' || !note.anchorIds.includes(entry.anchorId)
        || typeof entry.text !== 'string'
      ))
    ) throw new Error('Annotation authority contains an invalid reading note.');
    noteIds.add(note.id);
  }
  return annotationDocument as PaperAnnotationDocument;
};

const noteLabel = (note: PaperReadingNote, anchorsById: Map<string, PaperAnchor>) => {
  const pages = [...new Set(note.anchorIds.map((id) => anchorsById.get(id)?.page).filter((page): page is number => page !== undefined))];
  const pageText = pages.length === 1 ? `Page ${pages[0]}` : `Pages ${Math.min(...pages)}–${Math.max(...pages)}`;
  return `${pageText} · ${note.anchorIds.length} ${note.anchorIds.length === 1 ? 'anchor' : 'anchors'}`;
};

const renderRail = (
  selector: string,
  notes: PaperReadingNote[],
  anchorsById: Map<string, PaperAnchor>,
  side: 'left' | 'right',
) => {
  const list = document.querySelector<HTMLOListElement>(`${selector} ol`);
  if (!list) throw new Error(`Missing ${side} annotation rail.`);
  const items = notes.map((note) => {
    const item = document.createElement('li');
    const heading = document.createElement('button');
    const body = document.createElement('div');
    heading.type = 'button';
    heading.className = 'reading-note-heading';
    heading.dataset.note = note.id;
    heading.dataset.primaryAnchor = note.anchorIds[0];
    heading.setAttribute('aria-expanded', 'false');
    heading.textContent = noteLabel(note, anchorsById);
    body.className = 'reading-note-body';
    body.dataset.noteBody = note.id;
    for (const entry of note[side]) {
      const anchor = anchorsById.get(entry.anchorId);
      if (!anchor) continue;
      const button = document.createElement('button');
      const label = document.createElement('span');
      button.type = 'button';
      button.className = 'reading-note-entry';
      button.dataset.anchor = anchor.id;
      label.textContent = `${anchor.type} · page ${anchor.page}`;
      button.append(label, document.createTextNode(entry.text));
      body.append(button);
    }
    item.dataset.noteItem = note.id;
    item.append(heading, body);
    return item;
  });
  list.replaceChildren(...items);
};

const createNativeSelectionMirror = (readerElement: HTMLElement) => {
  const mirror = document.createElement('span');
  mirror.className = 'pdf-native-selection';
  mirror.setAttribute('aria-hidden', 'true');
  readerElement.append(mirror);

  const ownsSelection = (selection: Selection | null) => (
    selection !== null
    && selection.rangeCount > 0
    && !selection.isCollapsed
    && selection.anchorNode !== null
    && selection.focusNode !== null
    && mirror.contains(selection.anchorNode)
    && mirror.contains(selection.focusNode)
  );

  document.addEventListener('copy', (event) => {
    const selection = window.getSelection();
    const text = mirror.textContent;
    if (!event.clipboardData || !text || !ownsSelection(selection)) return;
    event.clipboardData.setData('text/plain', text);
    event.preventDefault();
  }, true);

  const clear = () => {
    const selection = window.getSelection();
    if (selection?.anchorNode && mirror.contains(selection.anchorNode)) selection.removeAllRanges();
    mirror.textContent = '';
  };

  const select = (text: string) => {
    if (!text) return clear();
    mirror.textContent = text;
    const range = document.createRange();
    range.selectNodeContents(mirror);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  return { clear, select };
};

const startReader = async (readerElement: HTMLElement, viewerTarget: HTMLElement | null) => {
  const paperId = readerElement.dataset.paperId;
  const paperTitle = readerElement.dataset.paperTitle;
  const sourceSha256 = readerElement.dataset.sourceSha256;
  const pdfUrl = readerElement.dataset.pdfUrl;
  const readingAnalysisUrl = readerElement.dataset.readingAnalysisUrl;
  const curatedAnnotationsUrl = readerElement.dataset.curatedAnnotationsUrl;
  if (!paperId || !paperTitle || !sourceSha256 || !curatedAnnotationsUrl) throw new Error('Missing Literature Reader source mapping.');
  if (!pdfUrl) throw new Error('Missing canonical PDF source mapping.');
  if (!viewerTarget) throw new Error('Missing PDF viewer target.');
  attachDebugDiagnostics(readerElement);
  const documentId = `atlas-${paperId}`;
  const readingAnalysisPromise = readingAnalysisUrl
    ? fetch(readingAnalysisUrl, { credentials: 'same-origin' }).then(async (response) => {
      if (!response.ok) throw new Error(`Reading analysis request failed with HTTP ${response.status}.`);
      return validateDocument(await response.json(), paperId, sourceSha256);
    }).catch((error) => {
      console.error(error);
      readerElement.dataset.readingAnalysisError = 'true';
      const state = document.querySelector<HTMLElement>('[data-reading-analysis-state]');
      if (state) state.textContent = 'Reading analysis is temporarily unavailable; the PDF and annotation layers remain available.';
      return null;
    })
    : Promise.resolve(null);

  // Start the PDF fetch immediately. Curated analysis and annotation layers are
  // runtime companions and must never gate first-page rendering.
  const viewer = EmbedPDF.init({
    type: 'container',
    target: viewerTarget,
    documentManager: { initialDocuments: [{ url: pdfUrl, documentId }] },
    ...annotationViewerConfig,
    scroll: { defaultStrategy: ScrollStrategy.Vertical, defaultPageGap: 18 },
    theme: { preference: 'light' },
    fonts: { ui: null, signature: null },
  });
  const registry = await viewer?.registry;
  if (!registry) throw new Error('PDF viewer registry is unavailable.');
  const scroll = registry.getPlugin<ScrollPlugin>('scroll')?.provides?.();
  const zoom = registry.getPlugin<ZoomPlugin>('zoom')?.provides?.();
  if (!scroll || !zoom) throw new Error('PDF navigation capability is unavailable.');
  const layoutReady = new Promise<void>((resolve) => {
    scroll.onLayoutReady((event) => {
      if (event.documentId !== documentId || !event.isInitial) return;
      document.querySelector<HTMLElement>('.reader-status')?.remove();
      resolve();
    });
  });

  const annotationDocument = await readingAnalysisPromise;
  await layoutReady;
  const uuidById = new Map((annotationDocument?.anchors ?? []).map((anchor, index) => [anchor.id, `10000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`]));
  const ignoredIds = [...uuidById.values()];
  const annotationLayers = attachAnnotationLayers({
    registry,
    documentId,
    documentHash: sourceSha256,
    pageCount: scroll.forDocument(documentId).getTotalPages(),
    paperId,
    paperTitle,
    curatedApiUrl: curatedAnnotationsUrl,
    readerElement,
    ignoredAnnotationIds: ignoredIds,
  });
  annotationLayers.catch((error) => {
    console.error(error);
    readerElement.dataset.annotationLayerError = 'true';
    const status = document.querySelector<HTMLElement>('[data-curated-annotation-status]');
    if (status) status.textContent = 'Annotation layers are temporarily unavailable.';
  });
  void attachPersonalReaderControls({
    readerElement,
    paperId,
    paperTitle,
    documentHash: sourceSha256,
    documentId,
    scroll,
    zoom,
    annotations: annotationLayers,
  }).catch((error) => {
    console.error(error);
    readerElement.dataset.readingProgressError = 'true';
    const status = document.querySelector<HTMLElement>('[data-reading-progress-status]');
    if (status) status.textContent = 'Reading progress is unavailable in this browser.';
  });
  if (!annotationDocument) return;

  const anchors = annotationDocument.anchors;
  const readingNotes = annotationDocument.readingNotes;
  const anchorsById = new Map(anchors.map((anchor) => [anchor.id, anchor]));
  const noteByAnchorId = new Map(readingNotes.flatMap((note) => note.anchorIds.map((anchorId) => [anchorId, note] as const)));
  const pageWidth = annotationDocument.coordinate_space.page_width_points;
  const pageHeight = annotationDocument.coordinate_space.page_height_points;

  renderRail('.annotation-left', readingNotes, anchorsById, 'left');
  renderRail('.annotation-right', readingNotes, anchorsById, 'right');
  const counts = anchors.reduce<Record<string, number>>((result, anchor) => {
    result[anchor.type] = (result[anchor.type] ?? 0) + 1;
    return result;
  }, {});
  const coverage = document.querySelector<HTMLElement>('[data-annotation-coverage]');
  if (coverage) {
    coverage.textContent = `${anchors.length} source-aligned anchors · ${readingNotes.length} grouped reading notes: ${counts.paragraph ?? 0} paragraphs, ${counts.figure ?? 0} figures, ${counts.equation ?? 0} equations, ${counts.table ?? 0} tables.`;
  }

  const setActive = (id: string) => {
    const activeNote = noteByAnchorId.get(id);
    document.querySelectorAll<HTMLElement>('[data-anchor]').forEach((button) => button.classList.toggle('active', button.dataset.anchor === id));
    document.querySelectorAll<HTMLElement>('[data-note-item]').forEach((item) => item.classList.toggle('active', item.dataset.noteItem === activeNote?.id));
    document.querySelectorAll<HTMLButtonElement>('[data-note]').forEach((button) => {
      const isActive = button.dataset.note === activeNote?.id;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-expanded', String(isActive));
    });
    readerElement.dataset.activeAnchor = id;
    if (activeNote) {
      document.querySelector<HTMLElement>(`.annotation-left [data-note-item="${activeNote.id}"]`)?.scrollIntoView({ block: 'nearest' });
      document.querySelector<HTMLElement>(`.annotation-right [data-note-item="${activeNote.id}"]`)?.scrollIntoView({ block: 'nearest' });
    }
  };

  const nearestAnchor = (metrics: ScrollMetrics) => {
    const visible = metrics.pageVisibilityMetrics.find((page) => page.pageNumber === metrics.currentPage);
    if (!visible) return anchors.find((anchor) => anchor.page === metrics.currentPage);
    const viewportCenter = (visible.original.pageY + visible.original.visibleHeight / 2) / pageHeight;
    return anchors
      .filter((anchor) => anchor.page === metrics.currentPage)
      .sort((a, b) => Math.abs(a.bbox.y + a.bbox.height / 2 - viewportCenter) - Math.abs(b.bbox.y + b.bbox.height / 2 - viewportCenter))[0];
  };

  const annotation = registry.getPlugin<AnnotationPlugin>('annotation')?.provides?.();
  const selection = registry.getPlugin<SelectionPlugin>('selection')?.provides?.();
  if (!annotation || !selection) throw new Error('Reading-analysis plugins are unavailable.');
  const annotationScope = annotation.forDocument(documentId);
  const selectionScope = selection.forDocument(documentId);
  const nativeSelection = createNativeSelectionMirror(readerElement);
  let overlaysReady = false;
  let navigationLock = false;
  let navigationSettled: number | undefined;

  const items: AnnotationTransferItem[] = anchors.map((anchor) => {
      const object: PdfSquareAnnoObject = {
        id: uuidById.get(anchor.id)!,
        pageIndex: anchor.page - 1,
        type: PdfAnnotationSubtype.SQUARE,
        rect: {
          origin: { x: anchor.bbox.x * pageWidth, y: anchor.bbox.y * pageHeight },
          size: { width: anchor.bbox.width * pageWidth, height: anchor.bbox.height * pageHeight },
        },
        flags: ['readOnly', 'locked', 'lockedContents'],
        color: '#fff1a8',
        opacity: 0.08,
        strokeColor: '#8a6a19',
        strokeWidth: 0.75,
        strokeStyle: PdfAnnotationBorderStyle.SOLID,
      };
      return { annotation: object };
  });
  annotationScope.importAnnotations(items);
  setActive(anchors[0]?.id ?? '');

  annotationScope.onStateChange(() => {
    overlaysReady = anchors.every((anchor) => annotationScope.getAnnotationById(uuidById.get(anchor.id)!) !== null);
  });

  const activate = (anchor: PaperAnchor, navigate: boolean) => {
    const previousId = readerElement.dataset.activeAnchor;
    const previous = previousId ? anchors.find((item) => item.id === previousId) : undefined;
    if (overlaysReady && previous) annotationScope.updateAnnotation(previous.page - 1, uuidById.get(previous.id)!, { opacity: 0.08, strokeWidth: 0.75 });
    if (overlaysReady) annotationScope.updateAnnotation(anchor.page - 1, uuidById.get(anchor.id)!, { opacity: 0.22, strokeWidth: 2 });
    setActive(anchor.id);
    if (navigate) {
      navigationLock = true;
      scroll.forDocument(documentId).scrollToPage({
        pageNumber: anchor.page,
        pageCoordinates: { x: anchor.bbox.x * pageWidth, y: anchor.bbox.y * pageHeight },
        behavior: 'smooth',
        alignY: 28,
      });
    }
  };

  document.querySelectorAll<HTMLButtonElement>('[data-anchor]').forEach((button) => {
    button.addEventListener('click', () => {
      const anchor = anchors.find((item) => item.id === button.dataset.anchor);
      if (anchor) activate(anchor, true);
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-note]').forEach((button) => {
    button.addEventListener('click', () => {
      const anchor = anchorsById.get(button.dataset.primaryAnchor ?? '');
      if (anchor) activate(anchor, true);
    });
  });

  selectionScope.onSelectionChange((range) => {
    if (!range) nativeSelection.clear();
  });
  selectionScope.onBeginSelection(() => nativeSelection.clear());
  selectionScope.onEndSelection(() => {
    selectionScope.getSelectedText().wait((chunks) => {
      window.requestAnimationFrame(() => nativeSelection.select(chunks.join('\n')));
    }, () => nativeSelection.clear());
  });

  scroll.onScroll((event) => {
    if (event.documentId !== documentId) return;
    if (navigationLock) {
      window.clearTimeout(navigationSettled);
      navigationSettled = window.setTimeout(() => { navigationLock = false; }, 180);
      return;
    }
    const anchor = nearestAnchor(event.metrics);
    if (anchor && readerElement.dataset.activeAnchor !== anchor.id) activate(anchor, false);
  });
};

if (reader) {
  startReader(reader, target).catch((error) => {
    const status = document.querySelector<HTMLElement>('.reader-status');
    if (status) status.textContent = `The Paper Reader could not start: ${error instanceof Error ? error.message : String(error)}`;
  });
}
