# Electronic-Structure-Learning

面向电子结构与密度泛函理论学习的结构化、可视化网站。

公开站点：

```text
https://maxwell3919.github.io/Electronic-Structure-Learning/
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

当前已合并到 `main` 的 substantive 单元包括：

- Part I · [Chapter 1 · Introduction](https://maxwell3919.github.io/Electronic-Structure-Learning/part-01-overview-and-background/chapter-01-introduction/)
- Part I · [Chapter 2 · Overview](https://maxwell3919.github.io/Electronic-Structure-Learning/part-01-overview-and-background/chapter-02-overview/)
- Part I · [Chapter 3 · Theoretical Background](https://maxwell3919.github.io/Electronic-Structure-Learning/part-01-overview-and-background/chapter-03-theoretical-background/)
- Part II · [Chapter 6 · Density Functional Theory: Foundations](https://maxwell3919.github.io/Electronic-Structure-Learning/part-02-density-functional-theory/chapter-06-density-functional-theory-foundations/)
- Part II · [Chapter 7 · The Kohn–Sham Auxiliary System](https://maxwell3919.github.io/Electronic-Structure-Learning/part-02-density-functional-theory/chapter-07-the-kohn-sham-auxiliary-system/)
- Part II · [Chapter 8 · Functionals for Exchange and Correlation I](https://maxwell3919.github.io/Electronic-Structure-Learning/part-02-density-functional-theory/chapter-08-functionals-for-exchange-and-correlation-i/)
- Part III · [Chapter 10 · Electronic Structure of Atoms](https://maxwell3919.github.io/Electronic-Structure-Learning/part-03-important-preliminaries-on-atoms/chapter-10-electronic-structure-of-atoms/)
- Part IV · [Chapter 12 · Plane Waves and Grids: Basics](https://maxwell3919.github.io/Electronic-Structure-Learning/part-04-determination-of-electronic-structure/chapter-12-plane-waves-and-grids-basics/)
- Part V · [Chapter 19 · Quantum Molecular Dynamics (QMD)](https://maxwell3919.github.io/Electronic-Structure-Learning/part-05-properties-of-matter/chapter-19-quantum-molecular-dynamics-qmd/)
- Part VI · [Chapter 25 · Topology of the Electronic Structure of a Crystal: Introduction](https://maxwell3919.github.io/Electronic-Structure-Learning/part-06-electronic-structure-and-topology/chapter-25-topology-of-the-electronic-structure-of-a-crystal-introduction/)
- Part VII · [Appendix A · Functional Equations](https://maxwell3919.github.io/Electronic-Structure-Learning/part-07-appendices/appendix-a-functional-equations/)

其他页面仍处于 `outline` 或独立 PR 编写状态。每个 substantive 单元包含其适用范围内的双语正文、推导、来源定位、原创练习或教学可视化，并通过相应的静态构建与 chapter-local validation 门槛。

任何单元的 `complete` 状态只说明网站内容、来源定位、声明的教学模型和部署门槛已经完成，不自动验证其中涉及的真实材料、计算方法或科学结论。

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
2. SCF 教学模型的确定性验证；
3. 所有已注册 substantive 单元的 chapter-local deterministic validators；
4. Astro/MDX/KaTeX 静态构建。

部署 workflow 还会在实际 GitHub Pages URL 上运行 exact-SHA Chrome smoke，覆盖已注册页面的桌面、窄屏、键盘交互和无 JavaScript fallback。任何验证通过都只支持其声明的内容与网站行为，不证明真实材料计算或科学主张正确。

## 维护入口

开始修改前阅读：

1. [`AGENTS.md`](AGENTS.md)
2. [`docs/architecture.md`](docs/architecture.md)
3. [`docs/content-contract.md`](docs/content-contract.md)
4. [`docs/framework-map.md`](docs/framework-map.md)
5. [`docs/visualization-and-data-contract.md`](docs/visualization-and-data-contract.md)
6. [`docs/source-and-copyright-policy.md`](docs/source-and-copyright-policy.md)

所有持续性修改使用短期分支和 PR。仓库与 Pages 均为公开状态，任何提交必须满足公开发布与版权边界。
