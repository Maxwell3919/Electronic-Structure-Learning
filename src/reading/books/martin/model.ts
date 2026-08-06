export interface MartinReadingUnit {
  id: string;
  slug: string;
  kind: 'chapter' | 'appendix';
  number: string;
  title: string;
  route: string;
  contribution: string;
  coreIdea: string;
  overview: string;
  sections: string[];
}

export interface MartinReadingPart {
  id: string;
  slug: string;
  route: string;
  numeral: string;
  title: string;
  summary: string;
  progression: string;
  units: MartinReadingUnit[];
}

export interface MartinUnitContent {
  title: string;
  contribution: string;
  core: string;
  overview: string;
  sections: string[];
}

export const chapter = (number: number, content: MartinUnitContent): MartinReadingUnit => {
  const padded = String(number).padStart(2, '0');
  return {
    id: `martin-ch${padded}`, slug: `chapter-${padded}`, kind: 'chapter', number: String(number),
    title: content.title, route: `/reading/books/martin/chapter-${padded}/`,
    contribution: content.contribution, coreIdea: content.core, overview: content.overview, sections: content.sections,
  };
};

export const appendix = (letter: string, content: MartinUnitContent): MartinReadingUnit => {
  const lower = letter.toLowerCase();
  return {
    id: `martin-app-${lower}`, slug: `appendix-${lower}`, kind: 'appendix', number: letter,
    title: content.title, route: `/reading/books/martin/appendix-${lower}/`,
    contribution: content.contribution, coreIdea: content.core, overview: content.overview, sections: content.sections,
  };
};
