export type CohenLouieSectionLink = { id: string; label: string };
export type CohenLouieChapterModule = { default: unknown; sectionLinks?: CohenLouieSectionLink[]; synthesis?: string };

const chapterLoaders: Record<string, () => Promise<CohenLouieChapterModule>> = {
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
  'chapter-11': () => import('./content/chapter-11.astro'),
  'chapter-12': () => import('./content/chapter-12.astro'),
  'chapter-13': () => import('./content/chapter-13.astro'),
  'chapter-14': () => import('./content/chapter-14.astro'),
  'chapter-15': () => import('./content/chapter-15.astro'),
  'chapter-16': () => import('./content/chapter-16.astro'),
};

export const cohenLouieChapterSlugs = Object.keys(chapterLoaders);
export const getCohenLouieChapterContent = async (slug?: string) => {
  const loader = slug ? chapterLoaders[slug] : undefined;
  return loader ? loader() : undefined;
};
