import conceptMap from './literature-concept-map.json';
import { literatureLibraryPaperById } from './literature-library';

export type LiteratureConcept = (typeof conceptMap.concepts)[number];

export const literatureConceptMap = conceptMap;
export const literatureConcepts = conceptMap.concepts as LiteratureConcept[];
export const literatureConceptById = Object.fromEntries(
  literatureConcepts.map((concept) => [concept.id, concept]),
) as Record<string, LiteratureConcept>;

const conceptIdsByPaper = new Map(
  conceptMap.papers.map((paper) => [paper.paper_id, paper.concept_ids]),
);

export function conceptsForPaper(paperId: string) {
  return (conceptIdsByPaper.get(paperId) ?? [])
    .map((id) => literatureConceptById[id])
    .filter(Boolean)
    .sort((a, b) => a.paper_count - b.paper_count || a.title.localeCompare(b.title));
}

export function conceptPapers(concept: LiteratureConcept) {
  return concept.papers.map((id) => literatureLibraryPaperById[id]).filter(Boolean);
}
