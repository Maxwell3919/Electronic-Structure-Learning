import type { APIRoute } from 'astro';
import { martinParts } from '../reading/books/martin';
import { martinChapterSlugs } from '../reading/books/martin/chapter-content';

const fixedRoutes = [
  '/',
  '/core/',
  '/core/orientation/',
  '/core/part-i/',
  '/core/part-ii/',
  '/core/part-iii/',
  '/theory/',
  '/reading/',
  '/reading/books/',
  '/reading/books/martin/',
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

export const GET: APIRoute = ({ site }) => {
  const routes = [...new Set([...fixedRoutes, ...theoryRoutes, ...martinRoutes])].sort();
  const base = `${import.meta.env.BASE_URL.replace(/^\/|\/$/g, '')}/`;
  const urls = routes.map((route) => `  <url><loc>${new URL(`${base}${route.replace(/^\//, '')}`, site)}</loc></url>`);
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
