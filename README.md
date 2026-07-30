# Electronic Structure Learning

一个以 Richard M. Martin《Electronic Structure: Basic Theory and Practical Methods》（第二版）为主线的电子结构与 DFT 学习网站。

本仓库不是原书数字化副本。它保存原创学习内容、公式推导、可视化组件、小型教学模型和经过压缩的示例数据；教材 PDF、受版权保护的图表、批量原始计算输出、波函数和 restart 文件不进入仓库。

## 当前状态

- 框架阶段：建立 Astro + Starlight + MDX 的静态学习网站。
- 内容骨架：Martin 第二版 6 个正文 Part、28 个正文 Chapter、18 个 Appendix。
- 首个交互原型：第 7 章中的 SCF 固定点与混合教学模型。
- 部署目标：静态构建产物，可接入 Cloudflare 或 GitHub Pages。

## 技术栈

- Astro 7
- Starlight
- MDX
- KaTeX
- TypeScript
- 原生浏览器 JavaScript / SVG 交互

浏览器中的交互模块只承担教学演示和预计算数据浏览，不运行真实 Quantum ESPRESSO、VASP、ABINIT 或 EPW 作业。

## 本地开发

```bash
npm install
npm run validate
npm run check
npm run build
npm run dev
```

首次在 Talos 安装依赖后，应提交生成的 `package-lock.json`，再把 CI 改为 `npm ci`。在锁文件进入仓库前，依赖安装仍不是完全可复现的。

## 内容位置

```text
src/content/docs/        教材式正文与导航
src/components/          可复用学习与可视化组件
public/data/              小型、可审查的网页派生数据
scripts/                  内容与数据契约检查
project/                  架构、写作和部署规范
```

详细规则见 [`AGENTS.md`](AGENTS.md)、[`project/architecture.md`](project/architecture.md) 和 [`project/content-contract.md`](project/content-contract.md)。
