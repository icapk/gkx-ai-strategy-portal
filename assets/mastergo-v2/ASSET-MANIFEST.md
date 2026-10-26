# MasterGo V2 首页素材清单

来源原型：

`https://mastergo.com/prototype/183588821496860?ht=1&hl=1&hn=1&pt=1&flowId=2%3A08194&zs=1&pageId=M&layerId=2%3A08015&shared=true`

## 可复用图片

| 文件 | 尺寸 | 用途 | 原始资源名 |
| --- | ---: | --- | --- |
| `sim-number-pairs.png` | 900 × 591 | 首屏 AI 仿真实例：Number Pairs | `8508888edaedaa257c2d654842480121.png` |
| `sim-quantum-coin.png` | 900 × 591 | 首屏 AI 仿真实例：Quantum Coin Toss | `b7a1b2d42300fbe13b308e19e5f5c5b5.png` |
| `sim-membrane-transport.png` | 900 × 591 | 首屏 AI 仿真实例：Membrane Transport | `912f772848191f02755d82259c1f3d83.png` |
| `sim-hydrogen-atom.png` | 900 × 591 | 首屏 AI 仿真实例：Models of the Hydrogen Atom | `615f98c5d6da489a5405a642c38fefa1.png` |
| `brand-logo-white.png` | 4096 × 563 | 深色页脚中的白色机构标识 | `7b7c18dbfc7b10dd85e6242cb18341e7.png` |

## 视觉参考图

| 文件 | 尺寸 | 用途 |
| --- | ---: | --- |
| `hero-search-reference.jpg` | 1414 × 842 | 搜索型首屏及四张仿真实例卡片的浏览器参考图 |
| `homepage-body-reference.png` | 1215 × 4096 | MasterGo 提供的完整正文扁平参考图；仅用于对照布局、间距、配色和文案，不应直接作为最终网页背景 |

## 无法单独提取、需重新实现的内容

MasterGo 原型把正文主体合并为一张扁平 PNG，没有暴露以下元素的独立图片或 SVG：

- 首屏浅蓝渐变、光晕与装饰曲线；
- 搜索框、快捷标签、发送按钮和小图标；
- 科研干湿闭环的无穷环、节点时间线和说明标签；
- 未来教育板块的控制台插画、课程/智能体/竞赛三组 3D 插画；
- 科技评价的人才图谱插画及功能卡片图标；
- 战略咨询的工作流、功能图标、箭头和报告预览；
- 合作伙伴四张品牌卡片中的独立 Logo；
- 各板块圆角卡片、渐变标题条、分隔线、阴影与背景纹理。

这些视觉应使用 HTML/CSS、默认图标库和现有本地品牌素材重建。页面运行时暴露的 13 个内联 SVG 均属于 MasterGo 查看器控件，不属于门户正文，因此未纳入素材目录。

## 首页三块响应式素材（2026-10-14）

以现有 `figma-loop-infinity.png`、`figma-evaluation-board.png` 和
`figma-strategy-board.png` 为视觉来源。原图保留作对照，网页共用一套 HTML，
不再以桌面整板图片与手机简化组件相互替换。

| 素材 | 尺寸 | 处理与用途 |
| --- | ---: | --- |
| `research-loop-art.webp` | 605 × 280 | 原无穷环保留环带、节点和轮廓，移除内嵌文字；文字由 HTML 定位 |
| `talent-network.webp` | 343 × 206 | 从评价原图右侧裁出人物图谱；桌面置于卡片右侧，手机放到说明下方 |
| `strategy-*-icon.webp` | 70 × 73 | 四个立体图标；卡片标题和说明保留为 HTML |
| `strategy-report-preview.webp` | 421 × 508 | 原报告缩略图；共用同一图片及现有报告入口 |

素材使用无损 WebP，来源为现有单倍像素图，并非新导出的高清矢量图。
报告图片是示例预览，不代表本站执行生成或导出。
提取脚本：`scripts/extract-home-visual-assets.py`（需要 Pillow）。
后续取得原始分层文件或更高分辨率导出时，可替换上述素材，HTML 布局不需重做。
