export type GiustinoSectionLink = { id: string; label: string };
export type GiustinoUnitModule = { default: unknown; sectionLinks?: GiustinoSectionLink[]; synthesis?: string };

const unitLoaders: Record<string, () => Promise<GiustinoUnitModule>> = {
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
  'appendix-a': () => import('./content/appendix-a.astro'),
  'appendix-b': () => import('./content/appendix-b.astro'),
  'appendix-c': () => import('./content/appendix-c.astro'),
  'appendix-d': () => import('./content/appendix-d.astro'),
  'appendix-e': () => import('./content/appendix-e.astro'),
};

export const giustinoUnitSlugs = Object.keys(unitLoaders);
export const getGiustinoUnitContent = async (slug?: string) => {
  const loader = slug ? unitLoaders[slug] : undefined;
  return loader ? loader() : undefined;
};
