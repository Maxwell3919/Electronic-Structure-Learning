import { defineConfig } from 'astro/config';

const base = '/Electronic-Structure-Learning';
const logicalRedirects = {
  '/reading/martin/': '/reading/books/martin/',
};
const pagesRedirects = Object.fromEntries(
  Object.entries(logicalRedirects).map(([source, target]) => [source, `${base}${target}`]),
);

export default defineConfig({
  site: 'https://maxwell3919.github.io',
  base,
  output: 'static',
  redirects: pagesRedirects,
});
