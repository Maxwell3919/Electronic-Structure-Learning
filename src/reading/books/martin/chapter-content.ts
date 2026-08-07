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
