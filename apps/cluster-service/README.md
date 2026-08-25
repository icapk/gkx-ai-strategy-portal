# 国科信门户专题服务

从 `hungezu/gkx-technology-topic-service` 移植的 Vite + React 应用，包含六个已打通的门户页面：

- 科技信息交流
- 科技资源服务
- 科技决策支持
- 科学数据中心
- 新型高端智库
- 科技专题服务

当前业务数据均为界面与交互演示数据，不代表真实统计结论。

## 本地运行

```bash
pnpm install
pnpm dev
```

默认访问 `http://127.0.0.1:5173/`。可通过公共页头在六个页面间切换，也可直接访问：

- `/?page=information-exchange#ie-top`
- `/?page=technology-resource-service#trs-top`
- `/?page=technology-decision-support#tds-top`
- `/?page=scientific-data-center#sdc-top`
- `/?page=think-tank#top`
- `/?page=technology-topic-service&module=panorama&sub=chain&industry=合成生物#tp-top`

## 门户集成

目标门户从 `apps/cluster-service/dist/index.html` 加载页面。追加 `embed=portal` 时隐藏应用自身的重复顶栏，例如：

- `dist/index.html?page=information-exchange&embed=portal#ie-top`
- `dist/index.html?page=think-tank&embed=portal#top`

`dist/` 是门户发布所需产物，需要随源码一并保留。

## 构建验证

```bash
pnpm build
pnpm preview
```
