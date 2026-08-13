export type PaperAnchorType = 'paragraph' | 'figure' | 'equation' | 'table';

export type NormalizedBBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PaperAnchor = {
  id: string;
  page: number;
  type: PaperAnchorType;
  bbox: NormalizedBBox;
  sourceText?: string;
  figureId?: string;
};

export type ReadingNoteEntry = {
  anchorId: string;
  text: string;
};

export type PaperReadingNote = {
  id: string;
  anchorIds: string[];
  left: ReadingNoteEntry[];
  right: ReadingNoteEntry[];
};

export type PaperAnnotationDocument = {
  schema_version: 2;
  paper_id: string;
  source_sha256: string;
  coordinate_space: {
    origin: 'top-left';
    units: 'normalized';
    page_width_points: number;
    page_height_points: number;
  };
  anchors: PaperAnchor[];
  readingNotes: PaperReadingNote[];
};
