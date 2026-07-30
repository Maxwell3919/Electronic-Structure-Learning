# Electronic-Structure-Learning

面向电子结构与密度泛函理论学习的结构化、可视化网站。

当前仓库处于工程初始化阶段。第一批内容只建立 Astro/Starlight、MDX、KaTeX、内容契约和 Martin Part I / Chapter 1 阅读入口；尚未填充教材正文，也尚未配置公网部署。

## 项目目标

本项目不是把教材 PDF 搬到网页，而是将以下内容连接成连续的学习系统：

- 原创教材式解释；
- 可检查的公式推导；
- 简化模型和交互可视化；
- 真实 DFT 派生数据示例；
- 参数收敛、方法适用条件和证据边界；
- 练习与学习复盘。

Martin 第 2 版提供电子结构理论主干，Sholl–Steckel 提供实践与数值方法补充。教材和论文均为外部阅读来源，不提交 PDF、扫描页、原图或大段转录。

## 技术栈

- Astro + Starlight：静态教材网站与导航；
- MDX：正文中嵌入学习组件；
- KaTeX：公式渲染；
- TypeScript：交互组件和数据契约；
- GitHub Actions：静态构建检查；
- Cloudflare Pages 或 GitHub Pages：后续单独配置的公网发布目标。

## 当前结构

```text
.
├── AGENTS.md
├── docs/
│   ├── architecture.md
│   ├── content-contract.md
│   └── source-and-copyright-policy.md
├── src/
│   ├── components/
│   │   ├── DerivationBlock.astro
│   │   ├── SourceNote.astro
│   │   └── VisualizationPlaceholder.astro
│   ├── content/docs/
│   │   ├── index.mdx
│   │   ├── start-here.mdx
│   │   ├── reading-system.mdx
│   │   └── part-01-overview-and-background/
│   └── styles/custom.css
└── .github/workflows/ci.yml
```

## 本地运行

要求 Node.js 22.12 或更高版本。

```bash
npm install
npm run dev
```

静态构建：

```bash
npm run build
npm run preview
```

首次实际安装会生成 `package-lock.json`。锁文件应在 Talos 上完成安装与构建验证后提交，不手工伪造。

## 验证状态

当前已完成 GitHub 文件写入和结构回读；实际依赖安装与 `npm run build` 尚需在 Talos 或 GitHub Actions 中执行。未执行前不得把本分支描述为构建通过。

## 维护入口

开始修改前阅读：

1. [`AGENTS.md`](AGENTS.md)
2. [`docs/architecture.md`](docs/architecture.md)
3. [`docs/content-contract.md`](docs/content-contract.md)
4. [`docs/source-and-copyright-policy.md`](docs/source-and-copyright-policy.md)

所有持续性修改使用短期分支和 PR。公网发布、仓库可见性变化和服务端后端属于单独决策。
