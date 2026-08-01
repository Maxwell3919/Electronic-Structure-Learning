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

const part = (label, directory) => ({
  label,
  items: [{ autogenerate: { directory } }],
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
      customCss: [
        './src/styles/tokens.css',
        './src/styles/themes.css',
        './src/styles/reset-overrides.css',
        './src/styles/typography.css',
        './src/styles/layout.css',
        './src/styles/components.css',
        './src/styles/learning.css',
        './src/styles/figures.css',
        './src/styles/motion.css',
        './src/styles/custom.css',
        './src/styles/chapter02.css',
        './src/styles/chapter04.css',
        './src/styles/chapter05.css',
        './src/styles/compatibility.css',
      ],
      sidebar: [
        {
          label: '开始',
          items: [
            { label: '首页', link: '/' },
            'start-here',
            { autogenerate: { directory: 'learning-paths' } },
          ],
        },
        {
          label: '理论课程',
          items: [
            'theory',
            'book-map',
            part('Part I · Overview and Background', 'part-01-overview-and-background'),
            part('Part II · Density Functional Theory', 'part-02-density-functional-theory'),
            part('Part III · Atoms and Pseudopotentials', 'part-03-important-preliminaries-on-atoms'),
            part('Part IV · Electronic-Structure Methods', 'part-04-determination-of-electronic-structure'),
            part('Part V · Properties of Matter', 'part-05-properties-of-matter'),
            part('Part VI · Electronic Structure and Topology', 'part-06-electronic-structure-and-topology'),
            part('Part VII · Appendices', 'part-07-appendices'),
          ],
        },
        { label: '计算实验', items: ['labs'] },
        { label: '案例项目', items: ['cases'] },
        {
          label: '交互实验室',
          items: ['interactive-labs', 'labs/scf-fixed-point-and-mixing'],
        },
        part('实践交叉参考 · Sholl–Steckel', 'practice-sholl-steckel'),
        { label: '参考手册', items: ['reference'] },
      ],
    }),
    mdx({ processor: createMarkdownProcessor() }),
  ],
  markdown: {
    processor: createMarkdownProcessor(),
  },
});
