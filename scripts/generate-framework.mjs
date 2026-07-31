import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const docsRoot = join(root, 'src', 'content', 'docs');

function write(path, content) {
  const target = join(root, path);
  mkdirSync(join(target, '..'), { recursive: true });
  writeFileSync(target, content, 'utf8');
}

function yamlString(value) {
  return JSON.stringify(value);
}

const { default: martin } = await import('../src/data/martin/index.mjs');
const { default: practice } = await import('../src/data/shollSteckelStructure.mjs');

for (const part of martin.parts) {
  rmSync(join(docsRoot, part.slug), { recursive: true, force: true });
  mkdirSync(join(docsRoot, part.slug), { recursive: true });

  write(
    `src/content/docs/${part.slug}/index.mdx`,
    `---
title: ${yamlString(part.label)}
description: ${yamlString(`${part.titleZh}的完整目录级阅读骨架。`)}
sidebar:
  order: 0
  label: ${yamlString(part.label)}
---

import TrackOverview from '../../../components/TrackOverview.astro';
import catalog from '../../../data/martin/index.mjs';

# ${part.titleZh}

<TrackOverview
  sourceTitle={catalog.source.title}
  sourceRole={catalog.source.role}
  trackLabel={catalog.parts[${part.number - 1}].label}
  trackSlug={catalog.parts[${part.number - 1}].slug}
  units={catalog.parts[${part.number - 1}].units}
  overviewPage={catalog.parts[${part.number - 1}].overview?.page ?? null}
/>
`,
  );

  part.units.forEach((unit, unitIndex) => {
    const unitType = part.number === 7 ? 'Appendix' : 'Chapter';
    write(
      `src/content/docs/${part.slug}/${unit.slug}.mdx`,
      `---
title: ${yamlString(unit.label)}
description: ${yamlString(`Martin ${unitType} ${unit.id} 的目录级阅读骨架；正文待填充。`)}
sidebar:
  order: ${unitIndex + 1}
  label: ${yamlString(unit.label)}
---

import ReadingOutline from '../../../components/ReadingOutline.astro';
import catalog from '../../../data/martin/index.mjs';

<ReadingOutline
  sourceTitle={catalog.source.title}
  sourceAuthor={catalog.source.author}
  sourceRole={catalog.source.role}
  unitLabel={catalog.parts[${part.number - 1}].units[${unitIndex}].label}
  sourcePage={catalog.parts[${part.number - 1}].units[${unitIndex}].page}
  sections={catalog.parts[${part.number - 1}].units[${unitIndex}].sections}
  exercisesPage={catalog.parts[${part.number - 1}].units[${unitIndex}].exercisesPage ?? null}
/>
`,
    );
  });
}

rmSync(join(docsRoot, practice.slug), { recursive: true, force: true });
mkdirSync(join(docsRoot, practice.slug), { recursive: true });

write(
  `src/content/docs/${practice.slug}/index.mdx`,
  `---
title: "实践交叉参考 · Sholl–Steckel"
description: "《Density Functional Theory: A Practical Introduction》的十章实践导航骨架。"
sidebar:
  order: 0
  label: "实践交叉参考 · 总览"
---

import TrackOverview from '../../../components/TrackOverview.astro';
import catalog from '../../../data/shollSteckelStructure.mjs';

# 实践交叉参考

该阅读线用于把 Martin 的理论章节连接到更接近实际计算工作流的主题。它只保留章节、分节和页码定位，不转录教材正文或计算细节。

<TrackOverview
  sourceTitle={catalog.source.title}
  sourceRole={catalog.source.role}
  trackLabel={catalog.label}
  trackSlug={catalog.slug}
  units={catalog.chapters}
/>
`,
);

practice.chapters.forEach((chapter, chapterIndex) => {
  write(
    `src/content/docs/${practice.slug}/${chapter.slug}.mdx`,
    `---
title: ${yamlString(chapter.label)}
description: ${yamlString(`Sholl–Steckel Chapter ${chapter.id} 的实践交叉参考骨架；正文待填充。`)}
sidebar:
  order: ${chapterIndex + 1}
  label: ${yamlString(chapter.label)}
---

import ReadingOutline from '../../../components/ReadingOutline.astro';
import catalog from '../../../data/shollSteckelStructure.mjs';

<ReadingOutline
  sourceTitle={catalog.source.title}
  sourceAuthor={catalog.source.authors.join(' and ')}
  sourceRole={catalog.source.role}
  unitLabel={catalog.chapters[${chapterIndex}].label}
  sourcePage={catalog.chapters[${chapterIndex}].page}
  sections={catalog.chapters[${chapterIndex}].sections}
  meta={catalog.chapters[${chapterIndex}].meta}
/>
`,
  );
});

console.log(
  `Generated framework pages: ${martin.parts.length} Martin part indexes, ${martin.parts.flatMap((part) => part.units).length} Martin units, 1 practice index, ${practice.chapters.length} practice chapters.`,
);
