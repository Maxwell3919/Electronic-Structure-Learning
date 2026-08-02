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
  collapsed: true,
  items: [{ autogenerate: { directory } }],
});

export default defineConfig({
  site: 'https://maxwell3919.github.io',
  base: '/Electronic-Structure-Learning',
  integrations: [
    starlight({
      title: 'Electronic Structure Atlas',
      description: '电子结构理论、科研方法与计算工具的知识地图。',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
      },
      editLink: {
        baseUrl:
          'https://github.com/Maxwell3919/Electronic-Structure-Learning/edit/main/',
      },
      components: {
        PageFrame: './src/components/overrides/PageFrame.astro',
        PageTitle: './src/components/overrides/PageTitle.astro',
        TableOfContents: './src/components/overrides/TableOfContents.astro',
        TwoColumnContent: './src/components/overrides/TwoColumnContent.astro',
        Footer: './src/components/overrides/Footer.astro',
      },
      customCss: [
        './src/styles/tokens.css',
        './src/styles/themes.css',
        './src/styles/reset-overrides.css',
        './src/styles/typography.css',
        './src/styles/layout.css',
        './src/styles/reading.css',
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
          label: '入口',
          items: [{ label: '首页', link: '/' }],
        },
        {
          label: '理论',
          items: [
            'theory',
            'theory/mathematical-foundations',
            'theory/physical-foundations',
            'theory/chemical-foundations',
            'theory/electronic-structure',
            'theory/learning-map',
          ],
        },
        { label: '方法', items: ['methods'] },
        { label: '计算工具', items: ['computational-tools'] },
        { label: '参考', items: ['reference'] },
        {
          label: '现有内容 · 迁移中',
          collapsed: true,
          items: [
            'start-here',
            { label: '旧课程地图', link: '/book-map/' },
            part('Part I · Overview and Background', 'part-01-overview-and-background'),
            part('Part II · Density Functional Theory', 'part-02-density-functional-theory'),
            part('Part III · Atoms and Pseudopotentials', 'part-03-important-preliminaries-on-atoms'),
            part('Part IV · Electronic-Structure Methods', 'part-04-determination-of-electronic-structure'),
            part('Part V · Properties of Matter', 'part-05-properties-of-matter'),
            part('Part VI · Electronic Structure and Topology', 'part-06-electronic-structure-and-topology'),
            part('Part VII · Appendices', 'part-07-appendices'),
            'labs',
            'cases',
            'interactive-labs',
            part('Sholl–Steckel 交叉参考', 'practice-sholl-steckel'),
          ],
        },
      ],
    }),
    mdx({ processor: createMarkdownProcessor() }),
  ],
  markdown: {
    processor: createMarkdownProcessor(),
  },
});
