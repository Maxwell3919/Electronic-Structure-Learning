export type MartinChapterSectionLink = {
  id: string;
  label: string;
};

export type MartinChapterModule = {
  default: unknown;
  sectionLinks?: MartinChapterSectionLink[];
  modernPerspective?: string[];
  synthesis?: string;
};

export type MartinChapterLoader = () => Promise<MartinChapterModule>;

const chapterLoaders: Record<string, MartinChapterLoader> = {
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
  'chapter-17': () => import('./content/chapter-17.astro'),
  'chapter-18': () => import('./content/chapter-18.astro'),
};

export const martinChapterSlugs = Object.keys(chapterLoaders);

export const getMartinChapter = (slug?: string): MartinChapterLoader | undefined =>
  slug ? chapterLoaders[slug] : undefined;

export const getMartinChapterContent = async (slug?: string): Promise<MartinChapterModule | undefined> => {
  const loader = getMartinChapter(slug);
  if (!loader) {
    return undefined;
  }

  return loader();
};
