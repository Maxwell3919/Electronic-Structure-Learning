import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

export default defineConfig({
  integrations: [
    mdx(),
    starlight({
      title: 'Electronic Structure Learning',
      description: '电子结构与密度泛函理论的结构化、可视化学习网站。',
      customCss: ['./src/styles/custom.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Maxwell3919/Electronic-Structure-Learning',
        },
      ],
      sidebar: [
        {
          label: '开始',
          items: [
            { label: '网站首页', link: '/' },
            { label: '阅读方法', link: '/guide/reading-method/' },
            { label: '内容编写规范', link: '/guide/authoring/' },
          ],
        },
        {
          label: 'Part I · 概览与背景',
          autogenerate: { directory: 'part-01-overview-and-background' },
        },
        {
          label: 'Part II · 密度泛函理论',
          autogenerate: { directory: 'part-02-density-functional-theory' },
        },
        {
          label: 'Part III · 原子预备知识',
          autogenerate: { directory: 'part-03-important-preliminaries-on-atoms' },
        },
        {
          label: 'Part IV · 基本求解方法',
          autogenerate: { directory: 'part-04-determination-of-electronic-structure' },
        },
        {
          label: 'Part V · 物质性质',
          autogenerate: { directory: 'part-05-properties-of-matter' },
        },
        {
          label: 'Part VI · 电子结构与拓扑',
          autogenerate: { directory: 'part-06-electronic-structure-and-topology' },
        },
        {
          label: 'Part VII · 附录',
          autogenerate: { directory: 'part-07-appendices' },
        },
      ],
    }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false }]],
  },
});
