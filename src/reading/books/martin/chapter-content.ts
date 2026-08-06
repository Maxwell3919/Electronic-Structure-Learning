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
