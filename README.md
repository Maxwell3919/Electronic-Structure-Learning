# Electronic Structure Atlas

电子结构理论、科研方法与计算工具的公开知识地图。

- 公开站点：<https://maxwell3919.github.io/Electronic-Structure-Learning/>
- 部署身份：<https://maxwell3919.github.io/Electronic-Structure-Learning/deployment-manifest.json>

仓库名称和 Pages 路径暂时保持不变；站点内容名称采用 **Electronic Structure Atlas**。仓库 rename 属于单独的高影响操作。

## 信息架构

```text
Home
Theory
Methods
Computational Tools
Reference
```

- **Theory**：数学、物理、化学与电子结构理论；Learning Map 位于本模块。
- **Methods**：结构、电子性质、稳定性、晶格动力学等科研方法，不承担论文精读。
- **Computational Tools**：软件包、程序、工作流、数据库和辅助工具。输入、输出和验收命令归入具体程序页面。
- **Reference**：带有推荐理由、适用范围和知识关联的书籍、网站与官方文档。

架构权威见 [`docs/architecture.md`](docs/architecture.md)。迁移计划见 [`docs/atlas-v3-migration.md`](docs/atlas-v3-migration.md)。

## 现有内容

Martin Part I–VII、Sholl–Steckel、实验、案例和交互页面暂时保留，既有 URL 不在本轮轻量重构中删除。后续由迁移任务逐步重新归类；旧教材目录不再作为新版顶层信息架构。

## 内容边界

本站使用原创表达，不搬运教材正文、论文原文、受限制图表或许可证材料。资源页面不能只堆积链接；方法页面不连接内部论文精读数据库。

文风不要求统一。理论页面可以接近教材，工具页面可以接近手册，方法页面可以接近科学综述，但都应避免机械模板、重复总结和 AI 式空泛表达。

## 独立性与来源边界

Electronic Structure Atlas 是独立开发项目，与所列参考项目、作者和机构不存在隶属、合作、赞助或背书关系。除具体文件另行记录来源和许可证外，本项目不复制其正文、插图、品牌资产、课程答案或其他受版权保护内容。

Electronic Structure Atlas is independently developed and is not affiliated with, partnered with, sponsored by, or endorsed by referenced projects, authors, or institutions. Unless a specific file records its source and license, this project does not copy their prose, illustrations, brand assets, course answers, or other copyrighted materials.

## 本地验证

要求 Node.js 22.12 或更高版本。

```bash
npm ci --no-audit --no-fund
npm run check
```

验证通过只支持对应检查覆盖的网站结构和运行行为，不构成真实材料计算或科学结论验证。

## 维护

修改前读取 `AGENTS.md`、`docs/architecture.md` 和相关 `docs/`。持续性修改使用短期分支和 PR。真实 DFT raw/restart/WFC、教材 PDF、论文批量文件、凭据和私密研究记录不得进入本公开仓库。
