import EmbedPDF, {
  ScrollPlugin,
  ScrollStrategy,
} from '@embedpdf/snippet';
import { attachSharedAnnotationLayer, sharedAnnotationViewerConfig } from './shared-pdf-annotations';

const reader = document.querySelector<HTMLElement>('.pre-reading-reader');
const target = document.querySelector<HTMLElement>('#pdf-viewer');

const start = async (readerElement: HTMLElement, viewerTarget: HTMLElement) => {
  const paperId = readerElement.dataset.paperId;
  const documentHash = readerElement.dataset.sourceSha256;
  const pdfUrl = readerElement.dataset.pdfUrl;
  const annotationsApiUrl = readerElement.dataset.sharedAnnotationsUrl;
  if (!paperId || !documentHash || !pdfUrl || !annotationsApiUrl) throw new Error('Missing pre-reading PDF identity mapping.');
  const documentId = `atlas-${paperId}`;
  const viewer = EmbedPDF.init({
    type: 'container',
    target: viewerTarget,
    documentManager: { initialDocuments: [{ url: pdfUrl, documentId }] },
    ...sharedAnnotationViewerConfig,
    scroll: { defaultStrategy: ScrollStrategy.Vertical, defaultPageGap: 18 },
    theme: { preference: 'light' },
    fonts: { ui: null, signature: null },
  });
  const registry = await viewer?.registry;
  if (!registry) throw new Error('PDF viewer registry is unavailable.');
  const scroll = registry.getPlugin<ScrollPlugin>('scroll')?.provides?.();
  if (!scroll) throw new Error('PDF scroll capability is unavailable.');
  scroll.onLayoutReady((event) => {
    if (event.documentId !== documentId || !event.isInitial) return;
    document.querySelector<HTMLElement>('.reader-status')?.remove();
    void attachSharedAnnotationLayer({ registry, documentId, documentHash, apiUrl: annotationsApiUrl, readerElement }).catch((error) => {
      console.error(error);
      readerElement.dataset.sharedAnnotationError = 'true';
      const status = document.querySelector<HTMLElement>('[data-shared-annotation-status]');
      if (status) status.textContent = 'Shared annotations are temporarily unavailable.';
    });
  });
};

if (reader && target) {
  void start(reader, target).catch((error) => {
    console.error(error);
    reader.dataset.readerError = 'true';
    const status = document.querySelector<HTMLElement>('.reader-status');
    if (status) status.textContent = 'The canonical PDF could not be initialized. Use the original PDF link above.';
  });
}
