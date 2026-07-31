import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

const createMarkdownProcessor = () =>
  unified({
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false, throwOnError: false }]],
  });

export default defineConfig({
  site: 'https://maxwell3919.github.io',
  base: '/Electronic-Structure-Learning',
  integrations: [
    starlight({
      title: 'Electronic Structure Learning',
      description: '电子结构与密度泛函理论的结构化、可视化学习网站。',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
      },
      editLink: {
        baseUrl:
          'https://github.com/Maxwell3919/Electronic-Structure-Learning/edit/main/',
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        { label: '开始', items: ['start-here', 'reading-system'] },
        {
          label: 'Part I · 概览与背景主题',
          items: [
            {
              autogenerate: { directory: 'part-01-overview-and-background' },
            },
          ],
        },
        {
          label: '交互实验',
          items: [{ autogenerate: { directory: 'labs' } }],
        },
      ],
    }),
    mdx({ processor: createMarkdownProcessor() }),
  ],
  markdown: {
    processor: createMarkdownProcessor(),
  },
});
