# Electronic-Structure-Learning

面向电子结构与密度泛函理论学习的结构化、可视化网站。

- 公开站点：<https://maxwell3919.github.io/Electronic-Structure-Learning/>
- 部署身份：<https://maxwell3919.github.io/Electronic-Structure-Learning/deployment-manifest.json>

本项目以原创解释、可检查推导、教学模型、轻量派生数据和明确证据边界组织学习内容，不搬运教材正文或受限制材料。

## 学习系统入口

网站同时支持：

- 开始学习与三条学习路线；
- Martin Part I–VII 理论课程；
- 计划中的计算实验和案例项目；
- 现有及未来交互实验；
- Sholl–Steckel 实践交叉参考；
- Appendices、术语、参数映射、收敛与诊断参考入口。

现有 Martin Part、Chapter、Appendix 和 Sholl–Steckel URL 保持稳定。信息架构见 [`docs/site-information-architecture.md`](docs/site-information-architecture.md)。

## 框架与状态权威

Martin 结构保留 7 Parts、28 Chapters、18 Appendices、46 单元和 315 个目录级定位；Sholl–Steckel 保留 10 个实践单元和 93 个定位。

```text
src/data/martin/index.mjs
src/data/shollSteckelStructure.mjs
src/data/site/contentStatus.mjs
```

前两项定义教材结构；`contentStatus.mjs` 分开记录结构状态、技术验证、科学审查和学习者测试。网站不再用一个含义模糊的 `complete` 代表全部层级。

当前状态由网站首页和“开始学习”页从注册表读取，不在 README 手工维护整章清单。

## 阅读系统与文献层

全部 Martin 与 Sholl–Steckel 单元通过共享 reading frame 获得 Parallel、Focus 和 Atlas 三种阅读画布。左侧导航默认折叠非当前 Part；[完整 Chapter 图谱](https://maxwell3919.github.io/Electronic-Structure-Learning/theory/atlas/) 平铺显示全部单元及相互独立的结构、技术、科学审查和文献状态。

`src/data/site/sourceSemanticStatus.mjs` 区分教材原分节、网站原创解释和补充推导。`src/data/literature/` 是空数据起步的后续文献、主张和讨论基础设施；新论文不会静默覆盖 Martin 教材基线，bibliographic registration 也不表示科学主张已经成立。

## 本地验证

要求 Node.js 22.12 或更高版本。

```bash
npm ci --no-audit --no-fund
npm run check
```

`npm run check` 依次执行 framework、SCF、机器可读 registry 中的 deterministic validators，以及 Astro/MDX/KaTeX 静态构建。浏览器 smoke 清单同样来自 `scripts/test-registry.mjs`，现有测试不得静默丢失。

验证通过只支持各检查明确覆盖的网站结构、有限模型和浏览器行为，不自动构成真实材料计算、科学审查或学习者测试。

## 维护边界

开始修改前阅读 `AGENTS.md` 和 `docs/` 中的架构、内容、来源、版权及可视化契约。仓库与 Pages 均为公开状态；持续性修改使用短期分支和 PR。

真实 DFT raw/restart/WFC、教材 PDF、受限制材料、凭据以及本地参考仓库 clone 不进入本仓库。

## 致谢与设计参考

Electronic-Structure-Learning 是独立开发项目，与下列项目、作者和机构不存在隶属、合作、赞助或背书关系。列出这些项目用于感谢其在科学传播、交互设计、课程组织和 DFT 教学方面提供的公开启发。

除仓库中的具体文件另行记录来源和许可证外，本项目不复制这些项目的正文、插图、品牌资产、课程答案或受版权保护内容。

科学出版与交互设计参考：[Distill](https://distill.pub/)、[Bartosz Ciechanowski](https://ciechanow.ski/)、[Mathigon](https://mathigon.org/)、[Quanta Magazine](https://www.quantamagazine.org/)、[Stripe Press](https://press.stripe.com/)、[Observable](https://observablehq.com/) 和 [The Pudding](https://pudding.cool/)。

DFT 与电子结构教学参考：[DFT_PIB_Code](https://github.com/tjz21/DFT_PIB_Code)、[DFTK.jl](https://github.com/JuliaMolSim/DFTK.jl)、[espresso](https://github.com/pranabdas/espresso)、[QE-SSP](https://github.com/nguyen-group/QE-SSP)、[Density-Functional-Theory](https://github.com/MathWorks-Teaching-Resources/Density-Functional-Theory)、[dft-book](https://github.com/jkitchin/dft-book)、[MSE404-MM](https://github.com/ImperialCollegeLondon/MSE404-MM)、[python_1d_dft](https://github.com/tamuhey/python_1d_dft)、[iDEA](https://github.com/iDEA-org/iDEA)、[iesm-public](https://github.com/lcbc-epfl/iesm-public)、[quantum-mechanics](https://github.com/osscar-org/quantum-mechanics)、[phononwebsite](https://github.com/henriquemiranda/phononwebsite)、[wannier-tutorials](https://github.com/mostofi/wannier-tutorials)、[crystaltoolkit](https://github.com/materialsproject/crystaltoolkit) 和 [aachen_introduction_dftk](https://github.com/mfherbst/aachen_introduction_dftk)。详细边界与启发范围见 [`docs/credits-and-inspiration.md`](docs/credits-and-inspiration.md)。

## Acknowledgements and design references

Electronic-Structure-Learning is an independently developed project. It is not affiliated with, partnered with, sponsored by, or endorsed by any project, author, or institution listed above. They are acknowledged solely for their publicly visible contributions to science communication, interaction design, course organization, and DFT education.

Unless a specific repository file records its source and license separately, this project does not copy their prose, illustrations, brand assets, course answers, or other copyrighted materials.
