# Architecture

## 1. 当前架构

```text
原创 MDX 学习内容
        │
        ├── Astro / Starlight 导航与静态页面
        ├── KaTeX 公式渲染
        └── Astro / TypeScript 交互组件
                    │
                    ▼
              静态构建产物
                    │
                    ▼
         Pages/CDN 公网托管（后续）
```

网站采用静态优先架构。教材式正文在 MDX 中维护，只有确实需要交互的局部组件加载客户端代码。

## 2. 权威边界

| 对象 | 权威位置 |
|---|---|
| 网站代码与原创正文 | 本仓库 `main` |
| 教材原文 | 合法获得的外部阅读副本，不进入本仓库 |
| 真实 DFT 输入、raw 输出与 restart | 对应项目仓库或计算主机 |
| 可公开展示的小型派生数据 | 本仓库 `public/` 或未来明确的数据托管位置 |
| 公网发布状态 | 部署平台的实际构建与发布记录 |

本仓库中的数据副本不会自动替代项目现场或计算主机上的科学权威。

## 3. 内容层

当前内容入口位于：

```text
src/content/docs/
├── index.mdx
├── start-here.mdx
├── reading-system.mdx
└── part-01-overview-and-background/
    ├── index.mdx
    └── chapter-01-introduction.mdx
```

第一阶段只验证 Part I 与 Chapter 1。完整 Martin 7 Part / 46 单元映射，以及 Sholl–Steckel 实践交叉索引，应在后续独立 PR 中加入。

## 4. 组件层

初始公共组件：

- `SourceNote.astro`：来源和定位；
- `DerivationBlock.astro`：推导前提和正文容器；
- `VisualizationPlaceholder.astro`：在实现前固定模型、控制量、观察量、验证和边界。

后续组件优先级：

1. SCF 固定点与 mixing 可视化；
2. 平面波截断能和目标 observable 收敛；
3. k 点采样、能带路径与 DOS；
4. 晶体结构、实空间/倒空间和布里渊区；
5. 声子、振动模和电子—声子耦合数据展示。

## 5. 科学数据流

```text
外部 QE/VASP/其他代码计算
          │
          ▼
解析器读取原始输出
          │
          ▼
校验单位、参考、网格、维度和 provenance
          │
          ▼
生成小型 JSON / CSV / CIF / XYZ
          │
          ▼
网站组件只读展示
```

网页不直接运行生产级 QE、VASP、DFPT 或 EPW 任务。浏览器中的数值模拟仅用于教学模型，必须标明与真实计算之间的差异。

## 6. 暂不引入

在出现明确需求前，不引入：

- 用户账户和数据库；
- 服务端 Python API；
- 网页提交 Slurm 作业；
- 大型对象存储；
- 在线真实 DFT 计算；
- 多框架前端或全站客户端渲染。

这些能力会改变安全、成本和运维边界，必须单独设计和批准。
