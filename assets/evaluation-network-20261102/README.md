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
