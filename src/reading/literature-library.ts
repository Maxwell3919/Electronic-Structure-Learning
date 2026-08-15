import manifest from './literature-library.json';

export type LiteratureLibraryPaper = {
  paper_id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  doi: string | null;
  arxiv: string | null;
  source_record_path: string | null;
  pdf_path: string | null;
  document_sha256: string | null;
  page_count: number | null;
  primary_category: string;
  topic_relations: string[];
  atlas_route: string | null;
  status: 'published' | 'source_pending' | 'source_mismatch';
  failure_reason?: string;
  metadata_source: string;
};

export const literatureLibraryManifest = manifest;
export const literatureLibraryPapers = manifest.papers as LiteratureLibraryPaper[];
export const publishedLiteraturePapers = literatureLibraryPapers.filter(
  (paper): paper is LiteratureLibraryPaper & { pdf_path: string; document_sha256: string; page_count: number; atlas_route: string } => paper.status === 'published',
);
export const literatureLibraryPaperById = Object.fromEntries(
  literatureLibraryPapers.map((paper) => [paper.paper_id, paper]),
) as Record<string, LiteratureLibraryPaper>;
