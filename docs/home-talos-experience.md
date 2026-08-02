# Home Talos experience

本文件定义首页 Talos 体验的设计边界和未来原型验收条件。它不是实现授权；在独立原型通过本文件的 static-first、可访问性、资源和生命周期门槛前，不向公开首页加入大型 canvas、WebGL、持续动画、全页 hydration 或全局监听器。

## 角色与信息关系

Talos 是知识地图的向导和视觉叙事线索，不是聊天机器人、账户入口或访问内容的门禁。它可以通过视线、位置或短促动作提示 Theory、Methods、Computational Tools、Reference 四个入口之间的关系，但不替用户选择唯一路线，也不宣称评估学习状态。

首页内容围绕 Talos 形成一个可读的空间关系：核心说明回答 Atlas 是什么；四个顶层入口分别占据稳定区域；Learning Map 和现有内容兼容入口位于次级区域。视觉位置可以随 viewport 改变，DOM 顺序与标题层级必须保持语义稳定。Talos 不承载唯一链接、唯一标签、当前状态或必要说明；隐藏图像、停用 CSS、禁用 JavaScript 后，所有信息仍在普通 HTML 中出现。

## Static-first 与降级

服务器输出应先包含一个 `<main>`、明确的页面标题、简介和可聚焦的普通链接。Talos 资源应有恰当的替代文本；如果只是装饰，则使用空 `alt` 并从辅助技术中隐藏。视觉指引不能只依赖颜色、方向或动作。

无 JavaScript 时：

- 顶层入口和简短职责完整可读；
- 页面没有覆盖链接的透明层或空白动画画布；
- Talos 显示为尺寸已知的静态图，或完全省略且不留下布局空洞；
- 入口顺序与站点导航一致，旧内容兼容入口仍可到达。

移动端采用单列内容流。Talos 可以缩小为静态页首标记，不在有限 viewport 中挤压正文或制造横向滚动。窄屏不要求复制桌面空间叙事。

## 交互与辅助技术

键盘顺序遵循 DOM，不以正 `tabindex` 重排。每个入口使用原生 `<a>`；若未来 Talos 本身可操作，则必须有可见焦点、明确的动词标签以及键盘等价操作。鼠标悬停不得成为显示说明的唯一方式。

屏幕阅读器只接收信息结构，不接收每一帧位置变化。动态提示默认不进入 live region；只有用户触发且会改变可用信息的离散结果才可使用克制的 `aria-live`。Talos 不能伪装成对话状态或进度状态。

在 `prefers-reduced-motion: reduce` 下，不播放位移、跟随、漂浮或循环动作；最多允许无插值的状态切换。页面必须在 200% 文本缩放、390 px viewport、light/dark theme 下保持链接可用且无页面级横向滚动。

## 运行生命周期

未来原型默认不需要持续循环。若一次性动作确需 `requestAnimationFrame`，必须在动作结束、页面隐藏、Astro route 交换或组件卸载时取消。`setTimeout`、`setInterval`、`ResizeObserver`、`IntersectionObserver`、`MutationObserver`、媒体查询监听器和 DOM event listener 都必须由组件拥有，并有对称清理路径。

禁止模块加载时注册不可释放的全局监听器。重复进入首页不得累积 timer、RAF、observer、listener、detached node 或 WebGL context。后台 tab 不应继续高频工作；`visibilitychange` 后应暂停非必要动作，并在恢复时重建有限状态而不是补跑全部帧。

## 资源与性能预算

第一版原型只考虑 SVG、CSS 和局部、按需加载的少量脚本。图片需给出来源、作者或生成方式、许可/原创声明和可再分发边界；Talos 的颜色、比例和表情需保持同一角色设定。不得把第三方角色、受版权保护插画或无法说明来源的生成资产混入公开仓库。

未来原型在 PR 中记录改动前后的 fresh production build。建议原型增量门槛如下；它们是待实测的设计预算，不修改现有 `validate-build-budget.mjs` 限制：

- 首页新增压缩 JavaScript 不超过 8 KiB；无交互版本应为 0 KiB；
- Talos 首屏静态资源总传输量不超过 120 KiB；
- 不新增持续网络请求、WebSocket、worker、canvas 或 WebGL；
- 动画主线程任务单次不超过 50 ms，稳定静止后无持续 RAF；
- 资源声明固定宽高或 `aspect-ratio`，避免由 Talos 引起明显布局位移。

如果实测证明预算不足，PR 必须给出基线、实际测量、具体功能收益和仍未放宽的门槛；不能只为让构建通过提高限值。

## 未来原型验收

原型进入公开首页前至少满足：

1. `npm ci --no-audit --no-fund` 与 Node 22.12 下的 `npm run check` 通过，且既有 validator/smoke 未跳过或弱化；
2. HTML-only 截图与 DOM 检查证明四个顶层入口、说明和兼容入口无需 Talos 或 JavaScript 即可访问；
3. Chrome live smoke 覆盖 desktop、390 px、键盘、无 JavaScript、200% 文本缩放和 reduced motion；
4. 键盘焦点顺序、可见焦点、屏幕阅读器名称和标题层级经人工或等价可审阅证据检查；
5. 至少重复进入/离开首页 20 次，并在 10 分钟前台/后台切换 soak 中证明 timer、RAF、observer、listener 与内存没有随循环单调增长；
6. fresh build 记录首页 JavaScript、Talos 资源、总构建大小、最大 asset、asset count 与布局位移，任何预算变化都有理由；
7. 所有 Talos 资源的来源、许可与角色设定可回读；不含私有路径、凭据或受限制材料；
8. exact `main` SHA 的 Pages manifest、workflow build/deploy 和全量 live smoke 均成功。

这些检查只支持首页可访问性、兼容性、性能和生命周期的有限结论，不证明科学内容已经审查，也不证明该视觉叙事改善了学习效果。后者需要单独的用户研究与接受标准。
