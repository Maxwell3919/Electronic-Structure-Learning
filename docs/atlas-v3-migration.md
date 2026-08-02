# Atlas v3 migration

`docs/architecture.md` 是新版信息架构权威。本文件只记录迁移顺序和边界。

## Foundation data boundary

Atlas v3 的静态数据入口位于 `src/data/atlas/`。`theory.mjs` 只保存学科、课程级入口与有限电子结构主题；`learning-map.mjs` 单独保存可分叉、汇合和多入口的节点与边；`methods.mjs` 排除论文 ID、精读笔记和 claim ledger；`computational-tools.mjs` 区分 package、program、workflow、visualization、database 与 auxiliary；`references.mjs` 只有在来源、许可、推荐理由和适用范围逐条核验后才收录资源。

页面通过这些注册表渲染现有路由中的入口与锚点。它没有引入 CMS、后端或私有研究数据，也没有改变 GitHub Pages base path。Martin 46 单元的初始映射仅为来源定位，全部保留 `specialist-review-required`，不把教材目录直接升级为 Theory 分类。

## 本轮轻量调整

- 更新站点显示名称与顶层导航；
- 建立 Theory、Methods、Computational Tools 和 Reference 入口；
- 将 Learning Map 放入 Theory；
- 保留现有 Martin、Sholl–Steckel、实验、案例和交互 URL；
- 不实现 Talos 首页交互；
- 不批量迁移或重写正文。

## Talos 后续任务

### 1. 盘点

生成现有路由、数据注册表、组件和验证脚本清单。标明每项是保留、迁移、合并、废弃候选还是待判断。不要仅凭目录名自动删除内容。

### 2. Theory

按课程级建立数学、物理、化学入口。每门课程页面只规划：

- 推荐书籍与网站；
- 推荐理由；
- 资源共同覆盖的必要概念图谱；
- 与电子结构理论的连接。

详细资源选择需要后续专项调研，不得用未经核验的批量列表填充。

### 3. Learning Map

先设计节点、边、来源和版本的数据模型，再制作可视化。知识关系允许分叉、汇合和多个入口。不要把地图降格为线性课程进度表。

### 4. Methods

迁移并补充科研方法页面，但不接入论文精读、文献主张或私有研究记录。相同方法只保留一个权威页面，其他位置使用链接。

### 5. Computational Tools

按软件包、具体程序、工作流、数据库和辅助工具组织。输入、输出、检查命令和错误模式必须位于对应程序环境内。快速命令应注明检查对象、判据、误判和不能支持的结论。

### 6. 旧架构收敛

待新版入口和内容模型稳定后，再逐步移除学习路线、状态展示、旧导航和文献层的公开入口。删除前检查现有链接、验证脚本和 Pages 路由；需要重定向时先建立重定向。

### 7. Home

Talos 奶牛猫互动首页单独设计。开始编码前先确定视觉稿、无 JavaScript fallback、键盘访问、移动端行为、资源预算和长时间运行测试。它应承担导航与视觉叙事，不承载唯一的科学信息。

## 验收

每个迁移 PR 保持单一职责，并运行 `npm run check`。结构、构建或浏览器检查通过不等于内容已经完成科学审查。
