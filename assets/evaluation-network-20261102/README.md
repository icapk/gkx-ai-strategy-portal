# 人才图谱浅蓝关系网

- 用途：AI 科技评价「人才图谱」卡右侧的独立装饰图；不包含 UI、文字、卡片或人物图标。
- 工具：内置 `image_gen`，`transparent_background: true`；以用户批准的 UI 图为风格与构图参考，重新生成关系网。
- 参考：用户确认的 UI 预览 `exec-ba5a5da1-11d2-479c-b317-e7f7e45b338c.png`。
- 生成源：内置 Image Gen 结果 `exec-78b82645-5454-4998-933c-598120060a57.png`（2026-11-02）。
- 文件：`talent-network.png`，真实尺寸 **1942 × 809**（约 **2.4005:1**），8-bit RGBA PNG。
- 原生 Alpha 范围 0–255：1,453,321 完全透明像素、117,176 半透明像素、581 不透明像素，共 1,571,078 像素。左侧留空、右侧较密、右下裁切延伸。
- SHA256：`eeadb08e8dc29911c33e092a327043a21e6e252c2fc4cfee69c9a5db429e20b9`。
- 原文件逐字节复制；没有裁切、重采样、调色、Alpha 修复、拼图或其他后处理。透明预览可能显示深底，最终轻线效果需在页面浅色卡片底上验收。

## 最终生成提示词

```text
Use case: stylized-concept. Generate ONE clean flat raster network illustration with genuine transparent alpha, wide horizontal canvas 1536x640 (2.4:1).
Input reference is ONLY a style/composition guide: the simple pale blue graph on the right side of the top talent card. Create a NEW pristine graph drawing; do NOT crop the screenshot or remove a screenshot background. Exclude the entire UI.
Only 25 tiny pale-blue circular nodes plus 3 slightly larger nodes connected by very thin SINGLE straight strokes forming open irregular triangles. Draw each connection as exactly one clean hairline, not doubled outlines. Solid clean pale ice-blue strokes #C4DFFF, small dots #B4D4FF, three medium dots #94BEF5. Deliberate regularity of fine stroke width, sharp clean antialiasing, no distressed texture or speckling.
Composition: network occupies the right two-thirds, becoming denser at the far right. The left third is empty transparent space; the few leftmost dots and links are extra pale to fade away. Several links continue off the RIGHT and BOTTOM image edges and a few edge nodes are partially cropped. Match the reference's very restrained flat scientific network. No enclosing geometry.
ABSOLUTELY NO white/card/page background, no gradient wash, no haze or fog, no blue/cyan/white fringe pixels or rough chalk lines, no glow, shadows, blur, 3D, people, pictograms, icons, text, numbers, frame, decoration or watermark. ONLY crisp small circles and SINGLE hairline links on empty transparent canvas.
```

## 面形人才版本

- 文件：`talent-network-solid.png`；生产使用此面形版本；原版 talent-network.png 保留原样。
- 按用户最新要求，三个主人才节点由线性人形改成**浅蓝实心圆头与实心肩部剪影**，节点底为极浅蓝白；其余关系连接继续使用淡细线，不将整个网络改成面块。
- 编辑目标：中间预览结果 `exec-52b3a43f-9bb5-40ad-a558-247ad4d84b9f`。工具为内置 Image Gen，`transparent_background: true`；本轮仅生成一次，没有程序图像编辑或后处理。
- 原生生成结果 ID：`exec-b48df983-ac26-47b9-8170-761ac7ba668a`（2026-11-02）。
- 真实尺寸：**1944 × 809**；8-bit RGBA，原生 Alpha 0–255。完全透明 1,440,249 像素，半透明 127,944 像素，不透明 4,503 像素。
- SHA256：`9e5614f9be0105c9c518ffcdd5c4f9d4b5d137ace6ce9980a56c55272cfc4ee8`。
- 原字节复制；无裁切、重采样、调色、Alpha 修复或拼图。主页面白卡上检查最终轻淡效果；未改页面代码。

### 面形人才版本最终提示词

```text
Use case: precise-object-edit. Edit this exact transparent network image in place, preserving its1942x809 wide2.4:1 composition and graph.
The user now specifically requires FILLED SHAPES rather than outline-only people. Modify ONLY the THREE existing person-symbol nodes: replace each thin-line head/shoulder drawing with a clearly SOLID FILLED abstract human bust glyph. Each person consists of one filled circular head and one filled broad rounded shoulder/bust shape below it, separated by a tiny clear gap. NO hollow head, NO outline-only shoulders. The person itself must be made of visible flat filled areas.
Use low-saturation pale blue around #96BCEB for the SOLID glyph, slightly darker than its very pale blue-white or transparent circular node base. A light base tint such as #F0F7FF is allowed; no dark gray/navy or thick saturated circular plaque. Preserve the same small diameter around60px at original resolution (20–24px when displayed730px wide). Glyph about36–40px tall, simple crisp silhouette, no outline required around filled shapes. No face, eyes, hair, clothes, gender detail, realistic human, 3D, thick glass, gloss, gradients, highlights, glow or shadows.
Keep every other part of the reference unchanged: all thin pale blue relationship CONNECTION LINES remain thin line art, existing small dot nodes, node centers, density increasing rightward, large empty transparent left, and cropped continuations beyond RIGHT and BOTTOM edges. The requested solid treatment applies ONLY to the three PERSON GLYPHS, not to the whole network.
No new circles, icons, cards, text, labels, frame, page background or decorative objects. Genuine transparent PNG alpha background preserved. Return this single edited asset, not a UI mockup.
```

## 人物节点强调版（最终生成结果）

- 文件：`talent-network-solid-emphasis.png`。
- 编辑源：`talent-network-solid.png`；该源文件按原字节保留。
- 最终生成结果 ID：`exec-7a8ec373-931e-4453-9da0-49f5639ae8b7`（2026-11-02），内置 Image Gen，`transparent_background: true`；本轮仅生成一次。
- 生成指令：仅强调现有 3 个主人才节点，圆形节点目标约 96px、实心人物目标约 62px，人物采用低饱和稍深蓝 `#5389CC`；保留淡细关系连接、左透明留白及右下边缘延伸，不增加节点、文字、发光或阴影。
- 真实输出尺寸：**1945 × 809**，8-bit RGBA，原生 Alpha 0–255；原字节复制，无程序图像编辑或后处理。
- SHA256：`5aa50ce65ab90016ea8b4209cdd918354b041bf6c69b04960e07766c346d54c7`。
