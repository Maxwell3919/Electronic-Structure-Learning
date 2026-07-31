# Architecture

## 1. 当前架构

```text
原创 MDX 学习内容
        │
        ├── Astro / Starlight 导航与静态页面
        ├── KaTeX 公式渲染
        ├── Astro 交互组件
        └── 共享确定性数学内核
                    │
                    ├── Node 验证脚本
                    └── 浏览器交互
                              │
                              ▼
                        静态构建产物
                              │
                              ▼
                   Pages/CDN 公网托管（后续）
```

网站采用静态优先架构。教材式正文在 MDX 中维护，只有确实需要交互的局部组件加载客户端代码。可重复的数学逻辑应尽量从 UI 中拆出，使 Node 验证脚本和浏览器组件使用同一实现。

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

```text
src/content/docs/
├── index.mdx
├── start-here.mdx
├── reading-system.mdx
├── labs/
│   └── scf-fixed-point-and-mixing.mdx
└── part-01-overview-and-background/
    ├── index.mdx
    └── chapter-01-introduction.mdx
```

`templates/chapter-template.mdx` 提供正式章节的最低信息骨架，但不要求正文机械复制一组固定小标题。完整 Martin 课程映射与 Sholl–Steckel 实践交叉索引仍属于后续独立工作。

## 4. 组件与数学内核

公共组件：

- `SourceNote.astro`：来源和定位；
- `DerivationBlock.astro`：推导前提和正文容器；
- `VisualizationPlaceholder.astro`：实现前固定模型、控制量、观察量、验证和边界；
- `SCFIterationVisualizer.astro`：首个可运行交互实验。

SCF 组件不在 UI 中复制数学公式。共享内核位于：

```text
src/lib/scfToyModel.mjs
```

验证脚本直接导入同一内核：

```text
scripts/validate-scf-model.mjs
```

后续组件优先级：

1. 平面波截断能和目标 observable 收敛；
2. k 点采样、能带路径与 DOS；
3. 晶体结构、实空间/倒空间和布里渊区；
4. 声子、振动模和电子—声子耦合数据展示。

## 5. 可视化与数据契约

- `schemas/visualization-spec.schema.json` 约束教学模型、派生数据图和静态示意图的最低元数据；
- `schemas/derived-dft-data.schema.json` 约束进入网站的轻量 DFT 派生数据；
- 解释规则见 `docs/visualization-and-data-contract.md`。

Schema 文件存在只说明契约已定义；在验证器真正执行前，不能声称所有数据文件已经通过 Schema 校验。

## 6. 科学数据流

```text
外部 QE/VASP/其他代码计算
          │
          ▼
解析器读取原始输出
          │
          ▼
校验身份、单位、参考、网格、维度和 provenance
          │
          ▼
生成小型 JSON / CSV / CIF / XYZ
          │
          ▼
网站组件只读展示
```

网页不直接运行生产级 QE、VASP、DFPT 或 EPW 任务。浏览器中的数值模拟仅用于教学模型，必须标明与真实计算之间的差异。

## 7. 暂不引入

在出现明确需求前，不引入：

- 用户账户和数据库；
- 服务端 Python API；
- 网页提交 Slurm 作业；
- 大型对象存储；
- 在线真实 DFT 计算；
- 多框架前端或全站客户端渲染。

这些能力会改变安全、成本和运维边界，必须单独设计和批准。
