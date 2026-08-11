import type { APIRoute } from 'astro';
import { martinParts } from '../reading/books/martin';
import { martinChapterSlugs } from '../reading/books/martin/chapter-content';
import { shollSteckelChapterSlugs } from '../reading/books/sholl-steckel/chapter-content';
import { cohenLouieReadingSlugs } from '../reading/books/cohen-louie';
import { giustinoReadingSlugs } from '../reading/books/giustino';
import { literatureGuides } from '../reading/literature';

const fixedRoutes = [
  '/',
  '/core/',
  '/core/orientation/',
  '/core/part-i/',
  '/core/part-ii/',
  '/core/part-iii/',
  '/core/part-iv/',
  '/core/part-v/',
  '/core/part-vi/',
  '/core/part-vii/',
  '/core/part-viii/',
  '/theory/',
  '/reading/',
  '/reading/books/',
  '/reading/books/martin/',
  '/reading/books/sholl-steckel/',
  '/reading/books/cohen-louie/',
  '/reading/books/giustino/',
  '/reading/literature/',
  '/methods/',
  '/computational-tools/',
  '/reference/',
];

const theoryPages = import.meta.glob('./theory/*/index.astro');
const theoryRoutes = Object.keys(theoryPages).map((path) => `/theory/${path.split('/')[2]}/`);
const martinRoutes = [
  ...martinParts.map((part) => part.route),
  ...martinChapterSlugs.map((slug) => `/reading/books/martin/${slug}/`),
];
const shollSteckelRoutes = shollSteckelChapterSlugs.map((slug) => `/reading/books/sholl-steckel/${slug}/`);
const cohenLouieRoutes = cohenLouieReadingSlugs.map((slug) => `/reading/books/cohen-louie/${slug}/`);
const giustinoRoutes = giustinoReadingSlugs.map((slug) => `/reading/books/giustino/${slug}/`);
const literatureRoutes = literatureGuides.map((record) => record.guideHref).filter((route): route is string => Boolean(route));

export const GET: APIRoute = ({ site }) => {
  const routes = [...new Set([...fixedRoutes, ...literatureRoutes, ...theoryRoutes, ...martinRoutes, ...shollSteckelRoutes, ...cohenLouieRoutes, ...giustinoRoutes])].sort();
  const base = `${import.meta.env.BASE_URL.replace(/^\/|\/$/g, '')}/`;
  const urls = routes.map((route) => `  <url><loc>${new URL(`${base}${route.replace(/^\//, '')}`, site)}</loc></url>`);
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
