import type { ScrollCapability, ZoomCapability } from '@embedpdf/snippet';
import {
  getReadingState,
  openPersonalDatabase,
  saveReadingState,
  type PersonalReadingState,
} from './personal-reader-storage';

type AnnotationController = {
  exportPersonalJson: () => Promise<string>;
  exportPersonalMarkdown: () => Promise<string>;
  importPersonalJson: (value: unknown) => Promise<{ imported: number; skipped: number; conflicts: number }>;
};

type PersonalReaderOptions = {
  readerElement: HTMLElement;
  paperId: string;
  paperTitle: string;
  documentHash: string;
  documentId: string;
  scroll: ScrollCapability;
  zoom: ZoomCapability;
  annotations: Promise<AnnotationController>;
};

const download = (contents: string, type: string, filename: string) => {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};

const safeFilename = (paperId: string, suffix: string) => `${paperId.replace(/[^a-z0-9-]+/gi, '-')}-personal-annotations.${suffix}`;

export const attachPersonalReaderControls = async ({
  readerElement,
  paperId,
  paperTitle,
  documentHash,
  documentId,
  scroll,
  zoom,
  annotations,
}: PersonalReaderOptions) => {
  const database = await openPersonalDatabase();
  const scrollScope = scroll.forDocument(documentId);
  const zoomScope = zoom.forDocument(documentId);
  const stored = await getReadingState(database, documentHash);
  const totalPages = scrollScope.getTotalPages();
  const initialPage = stored && stored.paperId === paperId
    ? Math.min(Math.max(stored.lastPage, 1), totalPages)
    : 1;
  const initialZoom = stored && Number.isFinite(stored.zoom) && stored.zoom >= 0.1 && stored.zoom <= 10
    ? stored.zoom
    : zoomScope.getState().currentZoomLevel;
  let state: PersonalReadingState = {
    documentHash,
    paperId,
    lastPage: initialPage,
    zoom: initialZoom,
    lastOpened: new Date().toISOString(),
    completed: stored?.paperId === paperId ? stored.completed : false,
  };
  let pendingSave: number | undefined;
  const status = document.querySelector<HTMLElement>('[data-reading-progress-status]');
  const completed = document.querySelector<HTMLInputElement>('[data-reading-completed]');
  const actionStatus = document.querySelector<HTMLElement>('[data-personal-action-status]');

  const render = () => {
    readerElement.dataset.readingProgress = state.completed ? 'finished' : state.lastPage > 1 ? 'reading' : 'unread';
    readerElement.dataset.readingPage = String(state.lastPage);
    if (completed) completed.checked = state.completed;
    if (status) status.textContent = `${state.completed ? 'Finished' : state.lastPage > 1 ? 'Reading' : 'Unread'} · page ${state.lastPage} of ${totalPages} · saved only in this browser.`;
  };
  const persist = async () => {
    window.clearTimeout(pendingSave);
    pendingSave = undefined;
    state = { ...state, lastOpened: new Date().toISOString() };
    await saveReadingState(database, state);
    render();
  };
  const schedulePersist = () => {
    window.clearTimeout(pendingSave);
    pendingSave = window.setTimeout(() => { void persist().catch(console.error); }, 350);
  };

  if (stored?.paperId === paperId) {
    if (Math.abs(zoomScope.getState().currentZoomLevel - initialZoom) > 0.001) zoomScope.requestZoom(initialZoom);
    if (initialPage > 1) scrollScope.scrollToPage({ pageNumber: initialPage, behavior: 'instant', alignY: 0 });
  }
  await persist();

  scroll.onScroll((event) => {
    if (event.documentId !== documentId || event.metrics.currentPage === state.lastPage) return;
    state = { ...state, lastPage: event.metrics.currentPage };
    render();
    schedulePersist();
  });
  zoom.onZoomChange((event) => {
    if (event.documentId !== documentId || !Number.isFinite(event.newZoom)) return;
    state = { ...state, zoom: event.newZoom };
    schedulePersist();
  });
  completed?.addEventListener('change', () => {
    state = { ...state, completed: completed.checked };
    render();
    void persist().catch(console.error);
  });

  const runAction = async (action: () => Promise<string>) => {
    if (actionStatus) actionStatus.textContent = 'Working…';
    try {
      if (actionStatus) actionStatus.textContent = await action();
    } catch (error) {
      console.error(error);
      if (actionStatus) actionStatus.textContent = error instanceof Error ? error.message : String(error);
    }
  };
  document.querySelector<HTMLButtonElement>('[data-export-personal-json]')?.addEventListener('click', () => {
    void runAction(async () => {
      const controller = await annotations;
      download(await controller.exportPersonalJson(), 'application/json', safeFilename(paperId, 'json'));
      return 'Personal annotations exported as JSON.';
    });
  });
  document.querySelector<HTMLButtonElement>('[data-export-personal-markdown]')?.addEventListener('click', () => {
    void runAction(async () => {
      const controller = await annotations;
      download(await controller.exportPersonalMarkdown(), 'text/markdown', safeFilename(paperId, 'md'));
      return 'Personal annotations exported as Markdown.';
    });
  });
  const importInput = document.querySelector<HTMLInputElement>('[data-import-personal-json]');
  document.querySelector<HTMLButtonElement>('[data-import-personal-trigger]')?.addEventListener('click', () => importInput?.click());
  importInput?.addEventListener('change', () => {
    const file = importInput.files?.[0];
    if (!file) return;
    void runAction(async () => {
      const controller = await annotations;
      const result = await controller.importPersonalJson(JSON.parse(await file.text()));
      importInput.value = '';
      return `Import complete: ${result.imported} added, ${result.skipped} identical skipped, ${result.conflicts} conflicts left unchanged.`;
    });
  });

  window.addEventListener('pagehide', () => {
    if (pendingSave !== undefined) void persist().catch(console.error);
    database.close();
  }, { once: true });

  return { state, paperTitle };
};
