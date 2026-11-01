# 原官网页脚素材

来源为用户指定的深圳国际科技信息中心官网。2026-11-01 通过公开 HTTPS 读取，原始 PNG 字节直接复制；未重绘、裁切、改色或修改透明通道。

| 文件 | 原始地址 | 固有尺寸 | SHA256 |
| --- | --- | --- | --- |
| `footer-bg.png` | [原官网页脚背景](https://itic-sci.com/static/footer_bg.a42c539d.png) | 3484 × 798 | `7e225de345f1812a23cff09e9e6583d13062e43e463508b56edce01b004f3d42` |
| `brand-logo.png` | [原官网横向标识](https://itic-sci.com/itic/file/assets/logo_lr.png) | 6282 × 865 | `f5f58f1267d1af22176a691332dec0b2832fe851af46070819ba25358991bfb8` |

## 透明素材与显示方式

背景为透明的深圳城市天际线线稿，不含黑色背景。线条调色板的 Alpha 为 6–23/255，约 2.4%–9%；应叠在白色基底上，不再降低整张图片透明度。素材按原官网 2 倍像素尺寸提供，CSS 显示尺寸为 1742 × 399px。

标识为透明底、蓝色机构章与黑色中文名称，适合浅色页脚；不需要滤镜或反色。当前页面使用明确的白底和 `center bottom` 背景位置，保留现有页脚布局。

## 来源 CSS

原官网全局样式：[umi.45db2718.css](https://itic-sci.com/umi.45db2718.css)。已保存的只读来源为 `artifacts/partners-refine-20261101/itic-source/umi.45db2718.css`，页脚规则位于字符偏移 12740 附近：

```css
.itic-portalFooter-normal {
  background: var(--itic-white);
  background: url(static/footer_bg.a42c539d.png) no-repeat 50%;
  background-size: 1742px 399px;
  height: 369px;
}
.itic-portalFooter-normal .itic-portalFooter-logo {
  background: url(https://itic-sci.com/itic/file/assets/logo_lr.png) no-repeat 50%/contain;
  height: 60px;
  width: 294px;
}
```

此处仅复用原始背景和标识，不沿用原官网固定页脚高度或正文结构。标题、正文及辅助字分别适配现站色值 `#28313D`、`#57616F`、`#667085`。
