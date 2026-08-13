import EmbedPDF, {
  AnnotationPlugin,
  LockModeType,
  PdfAnnotationBorderStyle,
  PdfAnnotationSubtype,
  ScrollPlugin,
  ScrollStrategy,
  type AnnotationTransferItem,
  type PdfSquareAnnoObject,
  type ScrollMetrics,
} from '@embedpdf/snippet';
import type { PaperAnchor, PaperAnnotationDocument } from '../reading/paper-reader-schema';

const reader = document.querySelector<HTMLElement>('.paper-reader');
const target = document.querySelector<HTMLElement>('#pdf-viewer');

const isNormalizedBox = (anchor: PaperAnchor) => {
  const { x, y, width, height } = anchor.bbox;
  return [x, y, width, height].every(Number.isFinite)
    && x >= 0 && y >= 0 && width > 0 && height > 0
    && x + width <= 1 && y + height <= 1;
};

const validateDocument = (value: unknown, paperId: string, sourceSha256: string): PaperAnnotationDocument => {
  const annotationDocument = value as Partial<PaperAnnotationDocument>;
  if (
    annotationDocument.schema_version !== 1
    || annotationDocument.paper_id !== paperId
    || annotationDocument.source_sha256 !== sourceSha256
    || annotationDocument.coordinate_space?.origin !== 'top-left'
    || annotationDocument.coordinate_space?.units !== 'normalized'
    || !Number.isFinite(annotationDocument.coordinate_space.page_width_points)
    || !Number.isFinite(annotationDocument.coordinate_space.page_height_points)
    || !Array.isArray(annotationDocument.annotations)
    || annotationDocument.annotations.length === 0
  ) throw new Error('Annotation authority does not match this paper.');

  const ids = new Set<string>();
  for (const anchor of annotationDocument.annotations) {
    if (
      !anchor || typeof anchor.id !== 'string' || ids.has(anchor.id)
      || !Number.isInteger(anchor.page) || anchor.page < 1
      || !['paragraph', 'figure', 'equation', 'table'].includes(anchor.type)
      || !isNormalizedBox(anchor)
      || typeof anchor.left !== 'string' || typeof anchor.right !== 'string'
    ) throw new Error('Annotation authority contains an invalid anchor.');
    ids.add(anchor.id);
  }
  return annotationDocument as PaperAnnotationDocument;
};

const renderRail = (selector: string, anchors: PaperAnchor[], side: 'left' | 'right') => {
  const list = document.querySelector<HTMLOListElement>(`${selector} ol`);
  if (!list) throw new Error(`Missing ${side} annotation rail.`);
  const items = anchors.map((anchor) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    const label = document.createElement('span');
    button.type = 'button';
    button.dataset.anchor = anchor.id;
    label.textContent = `${anchor.type} · page ${anchor.page}`;
    button.append(label, document.createTextNode(anchor[side]));
    item.append(button);
    return item;
  });
  list.replaceChildren(...items);
};

const startReader = async (readerElement: HTMLElement, viewerTarget: HTMLElement) => {
  const paperId = readerElement.dataset.paperId;
  const sourceSha256 = readerElement.dataset.sourceSha256;
  const pdfUrl = readerElement.dataset.pdfUrl;
  const annotationsUrl = readerElement.dataset.annotationsUrl;
  if (!paperId || !sourceSha256 || !pdfUrl || !annotationsUrl) throw new Error('Missing Paper Reader source mapping.');

  const response = await fetch(annotationsUrl, { credentials: 'same-origin' });
  if (!response.ok) throw new Error(`Annotation request failed with HTTP ${response.status}.`);
  const annotationDocument = validateDocument(await response.json(), paperId, sourceSha256);
  const anchors = annotationDocument.annotations;
  const pageWidth = annotationDocument.coordinate_space.page_width_points;
  const pageHeight = annotationDocument.coordinate_space.page_height_points;

  renderRail('.annotation-left', anchors, 'left');
  renderRail('.annotation-right', anchors, 'right');
  const counts = anchors.reduce<Record<string, number>>((result, anchor) => {
    result[anchor.type] = (result[anchor.type] ?? 0) + 1;
    return result;
  }, {});
  const coverage = document.querySelector<HTMLElement>('[data-annotation-coverage]');
  if (coverage) {
    coverage.textContent = `${anchors.length} source-aligned anchors: ${counts.paragraph ?? 0} paragraphs, ${counts.figure ?? 0} figures, ${counts.equation ?? 0} equations, ${counts.table ?? 0} tables.`;
  }

  const uuidById = new Map(anchors.map((anchor, index) => [anchor.id, `10000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`]));
  const viewer = EmbedPDF.init({
    type: 'container',
    target: viewerTarget,
    documentManager: { initialDocuments: [{ url: pdfUrl, documentId: 'pilot-paper' }] },
    disabledCategories: ['annotation', 'form', 'redaction', 'insert', 'document-open', 'document-export', 'document-print'],
    scroll: { defaultStrategy: ScrollStrategy.Vertical, defaultPageGap: 18 },
    theme: { preference: 'light' },
  });

  const setActive = (id: string) => {
    document.querySelectorAll<HTMLElement>('[data-anchor]').forEach((button) => button.classList.toggle('active', button.dataset.anchor === id));
    readerElement.dataset.activeAnchor = id;
    document.querySelector<HTMLElement>(`.annotation-left [data-anchor="${id}"]`)?.scrollIntoView({ block: 'nearest' });
    document.querySelector<HTMLElement>(`.annotation-right [data-anchor="${id}"]`)?.scrollIntoView({ block: 'nearest' });
  };

  const nearestAnchor = (metrics: ScrollMetrics) => {
    const visible = metrics.pageVisibilityMetrics.find((page) => page.pageNumber === metrics.currentPage);
    if (!visible) return anchors.find((anchor) => anchor.page === metrics.currentPage);
    const viewportCenter = (visible.original.pageY + visible.original.visibleHeight / 2) / pageHeight;
    return anchors
      .filter((anchor) => anchor.page === metrics.currentPage)
      .sort((a, b) => Math.abs(a.bbox.y + a.bbox.height / 2 - viewportCenter) - Math.abs(b.bbox.y + b.bbox.height / 2 - viewportCenter))[0];
  };

  const registry = await viewer?.registry;
  if (!registry) throw new Error('PDF viewer registry is unavailable.');
  const scroll = registry.getPlugin<ScrollPlugin>('scroll')?.provides?.();
  const annotation = registry.getPlugin<AnnotationPlugin>('annotation')?.provides?.();
  if (!scroll || !annotation) throw new Error('Required PDF viewer plugins are unavailable.');
  const annotationScope = annotation.forDocument('pilot-paper');
  let overlaysReady = false;
  let navigationLock = false;
  let navigationSettled: number | undefined;

  scroll.onLayoutReady((event) => {
    if (event.documentId !== 'pilot-paper' || !event.isInitial) return;
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
    annotationScope.setLocked({ type: LockModeType.All });
    document.querySelector<HTMLElement>('.reader-status')?.remove();
    setActive(anchors[0]?.id ?? '');
  });

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
      scroll.forDocument('pilot-paper').scrollToPage({
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

  scroll.onScroll((event) => {
    if (event.documentId !== 'pilot-paper') return;
    if (navigationLock) {
      window.clearTimeout(navigationSettled);
      navigationSettled = window.setTimeout(() => { navigationLock = false; }, 180);
      return;
    }
    const anchor = nearestAnchor(event.metrics);
    if (anchor && readerElement.dataset.activeAnchor !== anchor.id) activate(anchor, false);
  });
};

if (reader && target) {
  startReader(reader, target).catch((error) => {
    const status = document.querySelector<HTMLElement>('.reader-status');
    if (status) status.textContent = `The Paper Reader could not start: ${error instanceof Error ? error.message : String(error)}`;
  });
}
