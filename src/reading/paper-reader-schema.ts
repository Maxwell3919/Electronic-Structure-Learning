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
  left: string;
  right: string;
};

export type PaperAnnotationDocument = {
  schema_version: 1;
  paper_id: string;
  source_sha256: string;
  coordinate_space: {
    origin: 'top-left';
    units: 'normalized';
    page_width_points: number;
    page_height_points: number;
  };
  annotations: PaperAnchor[];
};
