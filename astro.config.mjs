import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

export default defineConfig({
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
          autogenerate: { directory: 'part-01-overview-and-background' },
        },
      ],
    }),
    mdx(),
  ],
  markdown: {
    processor: unified(),
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false, throwOnError: false }]],
  },
});
