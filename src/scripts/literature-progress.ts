import { listReadingStates, openPersonalDatabase } from './personal-reader-storage';

const entries = document.querySelectorAll<HTMLElement>('[data-reading-progress-paper]');

if (entries.length) {
  openPersonalDatabase().then(async (database) => {
    const states = new Map((await listReadingStates(database)).map((state) => [state.paperId, state]));
    for (const entry of entries) {
      const state = states.get(entry.dataset.readingProgressPaper ?? '');
      const label = entry.querySelector<HTMLElement>('[data-reading-progress-label]');
      if (!label || !state) continue;
      label.hidden = false;
      label.textContent = state.completed ? 'Finished' : state.lastPage > 1 ? `Reading · page ${state.lastPage}` : 'Unread';
      entry.dataset.readingProgress = state.completed ? 'finished' : state.lastPage > 1 ? 'reading' : 'unread';
    }
    database.close();
  }).catch(console.error);
}
