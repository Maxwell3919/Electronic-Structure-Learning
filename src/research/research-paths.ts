import data from './research-paths.json';

export type ResearchGate = (typeof data.paths)[number]['gates'][number];
export type ResearchPath = (typeof data.paths)[number];

export const researchPaths = data.paths as ResearchPath[];
export const researchPathById = Object.fromEntries(researchPaths.map((path) => [path.id, path])) as Record<string, ResearchPath>;

export function researchPathsForSynthesis(synthesisId: string) {
  return researchPaths.filter((path) => path.synthesis_ids.includes(synthesisId));
}
