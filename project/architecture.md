# 网站架构

## 权威边界

- GitHub `main`：网站代码、原创正文、组件、数据契约和小型派生数据的版本权威。
- Talos：依赖安装、构建、浏览器检查和部署操作端；其未推送本地状态不自动成为 GitHub 当前状态。
- 计算节点与项目仓库：真实 DFT 输入、raw output、restart、波函数和科学结果的权威。
- 教材 PDF：阅读来源，不进入本仓库，也不作为网站可公开复制的正文。

## 静态数据流

```text
真实计算或教学脚本
        ↓
解析、降采样、字段校验
        ↓
JSON / CSV / CIF + metadata
        ↓
GitHub PR
        ↓
Astro 静态构建
        ↓
Cloudflare / GitHub Pages
```

## 目录职责

- `src/content/docs/`：页面内容和导航。
- `src/components/learning/`：章节元信息、提示框和练习组件。
- `src/components/visualizations/`：交互模型与科学图形。
- `public/data/`：网页加载的小型数据。
- `scripts/`：不依赖外部服务的静态检查。
- `project/`：长期架构、内容和部署合同。

## 暂不进入第一阶段

账户、数据库、评论、服务端 Python、在线提交 QE/VASP、Slurm API、用户上传文件和私有内容授权。出现明确需求后再单独设计后端。
