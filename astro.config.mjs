import { defineConfig } from 'astro/config';

const base = '/Electronic-Structure-Learning';
const logicalRedirects = {
  '/reading/martin/': '/reading/books/martin/',
};
const deployedRedirects = Object.fromEntries(
  Object.entries(logicalRedirects).map(([source, target]) => [source, `${base}${target}`]),
);

export default defineConfig({
  site: 'http://188.255.156.20',
  base,
  output: 'static',
  redirects: deployedRedirects,
});
