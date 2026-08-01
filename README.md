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
