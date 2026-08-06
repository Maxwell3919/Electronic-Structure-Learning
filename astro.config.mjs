import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://maxwell3919.github.io',
  base: '/Electronic-Structure-Learning',
  output: 'static',
  redirects: {
    '/reading/martin/': '/Electronic-Structure-Learning/reading/books/martin/',
  },
});
