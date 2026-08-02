# Atlas v3 inventory

盘点基线：`Maxwell3919/Electronic-Structure-Learning@1ff77175092f12e7a48966fa2809e686a4cc4703`，观察时间 `2026-08-02 17:24 +08:00`。

本清单是迁移决策索引，不是删除授权。`src/data/atlas/migration/inventory.mjs` 保存可执行覆盖规则；`scripts/validate-atlas-v3-inventory.mjs` 枚举全部公开路由源、data registry、component、CSS、script、workflow，以及 `astro.config.mjs`、`package.json`，要求每个对象恰好命中一条规则。规则按实际 import、registry、sidebar、validator 和 workflow 消费关系划分，不以目录名直接推断可删除性。

分类含义：

- `RETAIN`：职责与 v3 一致，保留权威或技术能力。
- `MIGRATE`：对象有保留价值，但需要接入 v3 目标分类或数据驱动入口。
- `MERGE`：职责与另一对象重叠；未来只保留一个权威页面或共享实现，旧 URL 仍兼容。
- `REMOVE_CANDIDATE`：仅是候选。完成引用、重定向、兼容期、validator、Pages 和明确授权门槛前不得删除。
- `UNRESOLVED`：证据不足；当前没有对象被静默放入此类。

## 路由与导航

| 规则 | 当前路径 | 当前职责 | 消费者 | 稳定公开 URL | 验证 | Atlas v3 目标 | 分类 | 判断依据 | 前置条件 |
|---|---|---|---|---|---|---|---|---|---|
| `route-home` | `src/content/docs/index.mdx` | Atlas 首页 | Starlight 首页与主导航 | `/` | site architecture、build budget | Home | RETAIN | 已是 v3 入口；Talos 互动未实施 | 互动设计单独验收 |
| `route-v3-theory-entry` | `src/content/docs/theory/{index,mathematical-foundations,physical-foundations,chemical-foundations,electronic-structure,learning-map}/index.mdx` | 课程级 Theory 与 Learning Map | `astro.config.mjs`、首页、Theory 内链 | 对应 6 个 URL | site architecture、Atlas model | 数据驱动 Theory | RETAIN | 已由最小模型渲染课程入口和代表性关系 | 专项来源核验后再扩展 |
| `route-v3-methods-tools` | `src/content/docs/{methods,computational-tools}/index.mdx` | 方法分类与工具层级入口 | sidebar、首页 | `/methods/`、`/computational-tools/` | site architecture、Atlas model | 数据驱动分类与代表性层级 | RETAIN | 已接入注册表和引用检查 | 正文按主题后续单独调研 |
| `route-reference-entry` | `src/content/docs/reference/index.mdx` | Reference 入口与兼容锚点 | sidebar、旧正文 links | `/reference/` | site architecture、built-link checks、Atlas model | 数据驱动 Reference | RETAIN | 已接入资源契约，未填充未经核验条目 | provenance 与许可逐条通过后收录 |
| `route-reference-support` | `src/content/docs/reference/{design-system,terminology-and-symbols}.mdx` | 设计 specimen、术语索引 | 专用 validators | 2 个 URL | design/terminology gates | Reference 内部索引 | RETAIN | 各有独立职责 | 保持专用门槛 |
| `route-theory-legacy-maps` | `src/content/docs/{book-map,theory/atlas/index}.mdx` | 旧课程地图与阅读地图 | BookMap、reading frame、旧链接 | `/book-map/`、`/theory/atlas/` | reading-frame + smoke | Learning Map 兼容视图 | MERGE | 地图职责相邻，旧 smoke 仍活跃 | 新 static-first map、兼容 URL、原 smoke |
| `route-martin` | `src/content/docs/part-01-*` … `part-07-*` | 7 Part index + 46 单元正文 | Martin catalog、contentStatus、unitCatalog、45 validators/43 smokes 中的单元门槛 | 53 个 URL | framework、source semantics、reading frame、per-unit | Theory/Methods 的参考内容 | MIGRATE | 内容有价值，教材目录不等于知识分类 | 逐单元 mapping；不批量改写；URL/anchor/gates 保留 |
| `route-sholl-steckel` | `src/content/docs/practice-sholl-steckel/**` | 10 章实践交叉参考 + index | Sholl catalog、contentStatus、reading frame | 11 个 URL | framework、reading-frame | Methods/Reference 交叉定位 | MIGRATE | 可作来源定位，不作 Methods 分类权威 | 逐章 mapping、版权边界、URL 保留 |
| `route-learning-paths` | `src/content/docs/learning-paths/**` | 3 条固定路线 + index | learningPaths、learning components、site validator | 4 个 URL | site architecture | Learning Map 多入口关系 | REMOVE_CANDIDATE | 固定路线与 v3 graph 职责冲突 | 引用清单、重定向、兼容期、validator/smoke、Pages、用户授权 |
| `route-labs-cases` | `src/content/docs/{labs,cases,interactive-labs}/**` | planned catalogs 与 SCF 实验 | labs/cases data、SCF/runtime gates、sidebar | 5 个 URL | site architecture、SCF、runtime smoke | Methods/Tools 关联案例 | MIGRATE | SCF 有价值，其余需逐项判定 | 唯一归属、no-JS/lifecycle、planned 边界 |
| `route-literature` | `src/content/docs/literature/**` | 空的 literature 安全骨架 | literature data/components/validator | 5 个 URL | literature-layer | 外部 Literature/Research 系统 | REMOVE_CANDIDATE | v3 Methods 禁止 claim ledger | 引用清单、重定向、兼容期、validator/smoke、Pages、用户授权 |
| `route-reading-start` | `src/content/docs/{reading-system,start-here}.mdx` | 阅读模式说明与旧起点 | reading components、旧链接 | 2 个 URL | reading frame、site architecture | 单一兼容说明 | MERGE | 管理语义应收敛但 URL 被引用 | 引用核验、权威说明、URL 兼容 |

`astro.config.mjs` 当前主导航已经是 Home / Theory / Methods / Computational Tools / Reference；Martin、Sholl、labs、cases、interactive-labs 仍位于“现有内容 · 迁移中”。Literature、learning-paths、reading-system 等路由存在但未进入新版顶层入口。所有 93 个内容源均产生或支撑稳定公开 URL，本轮不删除、重定向或改名。

当前覆盖统计：842 个对象，其中 93 routes、72 data registries、554 components、15 CSS、49 validators、43 browser smokes、8 runtime tools、2 workflows、4 orchestration scripts 与 2 configuration files。按逐文件规则归类为 `RETAIN 201`、`MIGRATE 568`、`MERGE 49`、`REMOVE_CANDIDATE 24`、`UNRESOLVED 0`。

## 数据注册表

| 规则 | 当前路径 | 当前职责 | 消费者 | 稳定公开 URL | 验证 | Atlas v3 目标 | 分类 | 判断依据 | 前置条件 |
|---|---|---|---|---|---|---|---|---|---|
| `data-atlas-migration` | `src/data/atlas/migration/*.mjs` | 本清单规则 | inventory validator、迁移文档 | 不适用 | inventory validator | `atlas/migration` | RETAIN | 使覆盖可执行 | 保持简洁 |
| `data-atlas-model` | `src/data/atlas/{index,theory,learning-map,methods,computational-tools,references}.mjs` | Atlas v3 最小静态模型 | 新版入口与 model validator | 不适用 | Atlas model validator | `src/data/atlas` | RETAIN | 集中稳定 ID、关系与引用边界 | 不复制课程目录、不演化为 CMS |
| `data-martin` | `src/data/martin/*.mjs`、`shollSteckelStructure.mjs` | 46+10 单元、页码、section locator | generator/framework、unitCatalog、BookMap、status | 间接支撑 64 个 URL | framework/source semantics | 原结构权威 + v3 mapping | RETAIN | 不能把整书目录复制进课程 registry | mapping 只引用稳定 ID |
| `data-teaching-models` | `src/data/part02/**` … `part07/**` | 章节可视化模型与小型派生数据 | 专题 components/validators | 间接支撑单元 URL | per-unit validators | 随权威主题迁移 | MIGRATE | 目标取决于科学映射 | provenance、输入输出、边界与 validator 保留 |
| `data-site-legacy` | `src/data/site/*.mjs` | 导航、路线、labs/cases、status、reference、术语、source semantics | pages/components/test registry/validators | 间接 | site/design/source gates | Atlas registry 或 migration compatibility | MERGE | 一个目录混合结构和管理职责 | 逐消费者迁移，证据边界保留 |
| `data-literature` | `src/data/literature/*.mjs` | 空 literature registry 与 enums | literature layer | 间接支撑 5 个 URL | literature validator | 外部系统 | REMOVE_CANDIDATE | 不属于新版 Methods | 引用清单、重定向、兼容期、validator/smoke、Pages、用户授权 |

## 组件、交互组件与阅读画布

| 规则 | 当前路径 | 当前职责 | 消费者 | 稳定公开 URL | 验证 | Atlas v3 目标 | 分类 | 判断依据 | 前置条件 |
|---|---|---|---|---|---|---|---|---|---|
| `component-shared-root` | `src/components/*.{astro,mdx}` | 共享 callout/source/map 与早期 explorer 混合层 | routes 与 chapter components | 间接 | unit/model/runtime gates | 通用原语或主题交互 | MERGE | 同层职责混合但实际被引用 | import graph、no-JS、科学边界 |
| `component-atlas` | `src/components/atlas/**` | 数据驱动目录与 static-first Learning Map | Theory、Methods、Tools、Reference | 间接 | Atlas model/site gates | v3 共享呈现层 | RETAIN | 注册表单一维护、无 JS 可读 | keyboard、narrow、reduced motion、no-JS |
| `component-chapter-content` | `src/components/chapter01` … `chapter05`、`part02` … `part07` | Martin 正文组装、推导、图与交互 | 对应 46 单元 route | 间接 | per-unit validators/smokes | v3 主题或兼容 route | MIGRATE | 有内容价值，不可按目录批量移动 | 逐单元 mapping、URL/anchor/gates |
| `component-framework` | `src/components/{design,interaction,overrides,reading,site,theory}/**` | 共享设计、static-first interaction、Starlight override、reading canvas | config、顶层页、单元页 | 间接 | design/runtime/reading gates | v3 共享呈现层 | RETAIN | 提供可访问性与生命周期基础 | no-JS、keyboard、reduced motion、lifecycle |
| `component-learning` | `src/components/learning/**` | 旧目标、进度、checkpoint、路线 UI | learning routes/framework | 间接 | design/site gates | 仅留必要 prerequisite/link 原语 | MERGE | v3 不强制课程进度模板 | 逐 import 核验与语义等价 |
| `component-literature` | `src/components/literature/**` | 空 literature 展示层 | 5 个 literature route | 间接 | literature validator | 外部系统 | REMOVE_CANDIDATE | 不属于新版 Methods | 引用清单、重定向、兼容期、validator/smoke、Pages、用户授权 |

交互对象不是由文件名中的 `Explorer` 自动判定价值。现有交互由 unit route、model data、deterministic validator、browser smoke 和 runtime lifecycle 共同约束；迁移前必须沿 import 链确认具体消费者。无 JavaScript 文本、键盘行为和 reduced-motion 规则仍是保留门槛。

## CSS

| 规则 | 当前路径 | 当前职责 | 消费者 | 稳定公开 URL | 验证 | Atlas v3 目标 | 分类 | 判断依据 | 前置条件 |
|---|---|---|---|---|---|---|---|---|---|
| `style-foundation` | `src/styles/{tokens,themes,reset-overrides,typography,layout,reading,components,figures,motion,custom,compatibility}.css` | 全站 token、排版、画布、组件、动效与兼容 | `astro.config.mjs customCss`、全部路由 | 不适用 | design、visual、runtime/narrow smoke | v3 shared CSS | RETAIN | 已被全局 gates 覆盖 | 保持 token/focus/print/reduced-motion |
| `style-learning` | `src/styles/learning.css` | learning/progress UI | 全局 CSS + learning components | 不适用 | design/site | 必要关系样式并入 shared | MERGE | 状态 UI 不应侵入正文 | selector 消费者与视觉回归 |
| `style-chapter` | `src/styles/chapter02.css`、`chapter04.css`、`chapter05.css` | 早期章节专属补丁 | 全局 CSS + 对应 chapter | 不适用 | chapter narrow/no-JS smoke | 局部主题样式或 shared figures/layout | MERGE | 当前全局加载但不可直接删 | selector 引用与对应 smoke |

## 验证脚本、browser smoke 与 workflows

| 规则 | 当前路径 | 当前职责 | 消费者 | 稳定公开 URL | 验证 | Atlas v3 目标 | 分类 | 判断依据 | 前置条件 |
|---|---|---|---|---|---|---|---|---|---|
| `script-framework-tools` | generator、`test-registry.mjs`、registered runner、smoke lister | 结构生成与测试注册 | package/CI/Pages | 不适用 | 自身由 CI 使用 | v3 orchestration | RETAIN | 单一测试入口 | registry 完整 |
| `script-validators` | `scripts/validate-*.mjs` | 结构、模型、链接、runtime、budget 门槛 | test registry、`npm run check` | 不适用 | Node 22.12 CI | 保留并增加 Atlas gates | RETAIN | 不得静默弱化 | 全部注册、fresh pass |
| `script-browser-smokes` | `scripts/smoke*.py` | live desktop/narrow/keyboard/no-JS smoke | test registry、deploy | 对应 live routes | Pages workflow | 旧 route 回归 + v3 smoke | RETAIN | exact-SHA 验收组成 | registry 完整、读失败日志 |
| `script-runtime-tools` | `scripts/runtime-diagnostics/**` | idle/interaction/route soak 与证据汇总 | runtime 诊断 | 不适用 | runtime lifecycle | 未来交互验收工具 | RETAIN | 首页/图交互需要生命周期证据 | 不把短 probe 当长期稳定性 |
| `workflow-ci` | `.github/workflows/ci.yml` | PR Node 22.12、lockfile、Python syntax、check | PR | 不适用 | GitHub Actions | v3 PR gate | RETAIN | 当前最低门槛 | 不跳过 |
| `workflow-pages` | `.github/workflows/deploy.yml` | exact-SHA manifest、deploy、live smoke/status | main push | 公开站点 | GitHub Actions | v3 public acceptance | RETAIN | build/deploy/smoke 分别可观察 | exact SHA 回读 |
| `config-astro` | `astro.config.mjs` | Pages base、导航、MDX/KaTeX、CSS/override | Astro 全站 | 决定全部 route | build + site gates | v3 navigation composition | MIGRATE | sidebar 仍硬编码；base 必须不变 | data-driven 后最小改动、URL 兼容 |
| `config-package` | `package.json` | Node、lockfile scripts、dependencies | local/CI/Pages | 不适用 | npm ci + check | v3 validation commands | RETAIN | 跨环境契约 | Node 22.12 fresh run |

## 旧结构收敛边界

- Martin：保留 53 个公开路由与 46 单元内容，新增逐单元 mapping 后才能决定某段内容是参考、拆分、重写、来源定位或不迁移。
- Sholl–Steckel：保留 11 个路由，作为 Methods/Reference 的实践交叉参考；不复制教材正文。
- Labs/Cases/Interactive Labs：保持 URL；SCF 实验保留技术门槛，其余 planned 条目不能因目录存在而称为完成。
- Learning Paths：候选收敛到 Learning Map，但本轮不删除 4 个 URL。
- Literature：不接入 Methods；5 个空安全页暂时兼容保留。
- Atlas/Parallel/Focus、content status 与 reading frame：属于现有阅读技术/证据层，不作为 v3 正文分类；迁移时必须保留其仍被 validator/smoke 使用的语义。

所有 `REMOVE_CANDIDATE` 都必须先完成逐路由引用清单、重定向、兼容期、validator 与 browser smoke 更新、exact-main Pages 验收，并取得批量删除旧公开页面的明确授权。本清单本身不满足这些前置条件。
