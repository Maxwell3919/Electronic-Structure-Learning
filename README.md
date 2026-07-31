# Electronic-Structure-Learning

面向电子结构与密度泛函理论学习的结构化、可视化网站。

公开站点：

```text
https://maxwell3919.github.io/Electronic-Structure-Learning/
```

已完成章节：

```text
https://maxwell3919.github.io/Electronic-Structure-Learning/part-01-overview-and-background/chapter-01-introduction/
```

当前 Pages 部署来源记录：

```text
https://maxwell3919.github.io/Electronic-Structure-Learning/deployment-manifest.json
```

本项目不搬运教材正文，而是把原创解释、可检查推导、交互教学模型、轻量 DFT 派生数据、数值边界和练习组织为连续学习系统。

## 当前框架

主理论线以 Richard M. Martin 的 *Electronic Structure: Basic Theory and Practical Methods*, 2nd edition 为结构来源：

- 7 个 Part；
- 28 个编号章节；
- Appendix A–R，共 18 个附录；
- 46 个章节/附录页面；
- 315 个目录级分节定位。

实践交叉参考以 Sholl–Steckel 的 *Density Functional Theory: A Practical Introduction* 为结构来源：

- 10 个实践章节页面；
- 93 个目录级分节/小节定位。

## 内容状态

- Martin Part I, Chapter 1 · Introduction：已完成中英文对照正文、补充推导、原创交互可视化、练习和来源边界，并通过站点构建检查。
- 其余 Martin 章节、附录和 Sholl–Steckel 实践章节：当前仍为 `outline`，只含标题、页码、结构导航和后续内容插槽。

任何章节的 `complete` 状态只说明网站内容、来源定位和构建门槛已经完成，不自动验证其中涉及的真实材料、计算方法或科学结论。

## 结构权威

```text
src/data/martin/index.mjs
src/data/shollSteckelStructure.mjs
```

页面从上述目录读取结构信息，避免在 56 个单元页面中重复维护分节列表。

主要内容目录：

```text
src/content/docs/
├── book-map.mdx
├── part-01-overview-and-background/
├── part-02-density-functional-theory/
├── part-03-important-preliminaries-on-atoms/
├── part-04-determination-of-electronic-structure/
├── part-05-properties-of-matter/
├── part-06-electronic-structure-and-topology/
├── part-07-appendices/
├── practice-sholl-steckel/
└── labs/
```

## 本地验证

要求 Node.js 22.12 或更高版本。

```bash
npm ci --no-audit --no-fund
npm run check
```

`npm run check` 依次执行：

1. 完整框架计数、文件、slug 和页码一致性验证；
2. SCF 教学模型的五个确定性情形；
3. Astro 静态构建。

框架验证通过只说明导航骨架与目录数据一致，不证明正文、公式、可视化或科学结论正确。

## 维护入口

开始修改前阅读：

1. [`AGENTS.md`](AGENTS.md)
2. [`docs/architecture.md`](docs/architecture.md)
3. [`docs/content-contract.md`](docs/content-contract.md)
4. [`docs/framework-map.md`](docs/framework-map.md)
5. [`docs/visualization-and-data-contract.md`](docs/visualization-and-data-contract.md)
6. [`docs/source-and-copyright-policy.md`](docs/source-and-copyright-policy.md)

所有持续性修改使用短期分支和 PR。仓库与 Pages 均为公开状态，任何提交必须满足公开发布与版权边界。
