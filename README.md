# Electronic-Structure-Learning

面向电子结构与密度泛函理论学习的结构化、可视化网站。

本项目不是把教材 PDF 搬到网页，而是把原创教材式解释、可检查的公式推导、交互教学模型、真实 DFT 派生数据、数值边界和练习连接成连续的学习系统。

Martin 第 2 版提供电子结构理论主干，Sholl–Steckel 提供实践与数值方法补充。教材和论文是外部阅读来源；仓库不保存 PDF、扫描页、原图或大段转录。

## 当前状态

- Astro + Starlight + MDX + KaTeX 工程基线已建立；
- Part I / Chapter 1 目前只有阅读骨架，不是完整教材正文；
- 首个交互实验是“SCF 固定点与线性 mixing”；
- SCF 页面使用原创单标量仿射模型，不代表真实材料或具体 DFT 程序；
- 公网部署、域名和后端尚未配置。

## 技术栈

- Astro + Starlight：静态教材网站与导航；
- MDX + KaTeX：正文、公式和局部组件；
- Astro/TypeScript/ES modules：交互组件与共享数学内核；
- JSON Schema：可视化规格和 DFT 派生数据契约；
- GitHub Actions：锁定依赖、确定性模型检查和静态构建；
- Cloudflare Pages 或 GitHub Pages：后续单独配置的公网发布目标。

## 主要结构

```text
.
├── AGENTS.md
├── docs/
│   ├── architecture.md
│   ├── content-contract.md
│   ├── source-and-copyright-policy.md
│   └── visualization-and-data-contract.md
├── schemas/
│   ├── derived-dft-data.schema.json
│   └── visualization-spec.schema.json
├── scripts/
│   └── validate-scf-model.mjs
├── templates/
│   └── chapter-template.mdx
├── src/
│   ├── components/
│   │   ├── DerivationBlock.astro
│   │   ├── SCFIterationVisualizer.astro
│   │   ├── SourceNote.astro
│   │   └── VisualizationPlaceholder.astro
│   ├── content/docs/
│   │   ├── labs/scf-fixed-point-and-mixing.mdx
│   │   └── part-01-overview-and-background/
│   ├── lib/scfToyModel.mjs
│   └── styles/custom.css
└── .github/workflows/ci.yml
```

## 本地运行

要求 Node.js 22.12 或更高版本。

```bash
npm ci --no-audit --no-fund
npm run dev
```

完整检查：

```bash
npm run check
```

该命令依次执行：

1. `scripts/validate-scf-model.mjs` 的五个确定性模型检查；
2. Astro 静态构建。

## 验证边界

`npm run check` 通过只能说明：共享 SCF 数学内核满足已声明的五个仿射模型情形，并且网站可以在声明的 Node 环境完成静态构建。它不能证明真实 Kohn–Sham SCF、任何具体 mixing 实现、DFT 参数收敛或材料科学结论正确。

## 维护入口

开始修改前阅读：

1. [`AGENTS.md`](AGENTS.md)
2. [`docs/architecture.md`](docs/architecture.md)
3. [`docs/content-contract.md`](docs/content-contract.md)
4. [`docs/visualization-and-data-contract.md`](docs/visualization-and-data-contract.md)
5. [`docs/source-and-copyright-policy.md`](docs/source-and-copyright-policy.md)

所有持续性修改使用短期分支和 PR。公网发布、仓库可见性变化和服务端后端属于单独决策。
