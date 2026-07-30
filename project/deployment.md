# 部署

## 当前模式

网站保持纯静态输出。构建命令为 `npm run build`，产物位于 `dist/`。

## 推荐路径

1. GitHub 保存代码与内容；
2. Talos 运行验证与构建；
3. Cloudflare 从 GitHub 拉取，或由 Talos 上传 `dist/`；
4. 真实 DFT 计算与网站部署分离。

## 第一阶段部署门

- `package-lock.json` 已生成并提交；
- `npm ci`、`npm run validate`、`npm run check`、`npm run build` 通过；
- 首页、一个普通章节和第 7 章交互原型完成浏览器检查；
- 未发布教材 PDF、原书图表、凭据或大型计算文件；
- 明确目标域名和托管平台后再添加平台配置。
