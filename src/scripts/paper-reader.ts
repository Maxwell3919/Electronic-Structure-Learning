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
import type { PaperAnchor } from '../reading/pilot-annotations';

const pageWidth = 589.5;
const pageHeight = 792;
const reader = document.querySelector<HTMLElement>('.paper-reader');
const target = document.querySelector<HTMLElement>('#pdf-viewer');
const data = document.querySelector<HTMLScriptElement>('#pilot-annotations');

if (reader && target && data) {
  const anchors = JSON.parse(data.textContent ?? '[]') as PaperAnchor[];
  const pdfUrl = reader.dataset.pdfUrl;
  if (!pdfUrl) throw new Error('Missing pilot PDF URL.');
  const uuidById = new Map(anchors.map((anchor, index) => [anchor.id, `10000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`]));
  const viewer = EmbedPDF.init({
    type: 'container',
    target,
    documentManager: { initialDocuments: [{ url: pdfUrl, documentId: 'pilot-paper' }] },
    disabledCategories: ['annotation', 'form', 'redaction', 'insert', 'document-open', 'document-export', 'document-print'],
    scroll: { defaultStrategy: ScrollStrategy.Vertical, defaultPageGap: 18 },
    theme: { preference: 'light' },
  });

  const setActive = (id: string) => {
    document.querySelectorAll<HTMLElement>('[data-anchor]').forEach((button) => button.classList.toggle('active', button.dataset.anchor === id));
    reader.dataset.activeAnchor = id;
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

  viewer?.registry.then((registry) => {
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
      const previousId = reader.dataset.activeAnchor;
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
      if (anchor && reader.dataset.activeAnchor !== anchor.id) activate(anchor, false);
    });
  }).catch((error) => {
    const status = document.querySelector<HTMLElement>('.reader-status');
    if (status) status.textContent = `The PDF viewer could not start: ${error instanceof Error ? error.message : String(error)}`;
  });
}
