import queue from './literature-preprocessing.json';

export type LiteraturePreprocessingEntry = {
  paper_id: string;
  canonical_title: string;
  priority: 1 | 2;
  records_source_path: string | null;
  source_status: 'source_ready' | 'source_pending';
  target_literature_topic: string;
  atlas_slug: string;
};

export const literaturePreprocessingQueue = queue as LiteraturePreprocessingEntry[];

// Internal problem map only; this is not an external-paper identity or an Atlas Reader:
// “Comparative Electron–Phonon Screening of Carrier-Doped Monolayer HfX2 (X = Cl, Br, I)”.
// Blocked identity: the reported ZrNCl title must not use DOI 10.1103/PhysRevB.109.174507;
// that DOI identifies a CSeH6/C2TeH8 high-pressure hydride paper.
