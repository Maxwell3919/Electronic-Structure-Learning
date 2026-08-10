export type ShollSteckelSectionLink = {
  id: string;
  label: string;
};

export type ShollSteckelChapterModule = {
  default: unknown;
  sectionLinks?: ShollSteckelSectionLink[];
  synthesis?: string;
};

const chapterLoaders: Record<string, () => Promise<ShollSteckelChapterModule>> = {
  'chapter-01': () => import('./content/chapter-01.astro'),
  'chapter-02': () => import('./content/chapter-02.astro'),
  'chapter-03': () => import('./content/chapter-03.astro'),
  'chapter-04': () => import('./content/chapter-04.astro'),
  'chapter-05': () => import('./content/chapter-05.astro'),
  'chapter-06': () => import('./content/chapter-06.astro'),
  'chapter-07': () => import('./content/chapter-07.astro'),
  'chapter-08': () => import('./content/chapter-08.astro'),
  'chapter-09': () => import('./content/chapter-09.astro'),
  'chapter-10': () => import('./content/chapter-10.astro'),
};

export const shollSteckelChapterSlugs = Object.keys(chapterLoaders);

export const getShollSteckelChapterContent = async (slug?: string) => {
  const loader = slug ? chapterLoaders[slug] : undefined;
  return loader ? loader() : undefined;
};
