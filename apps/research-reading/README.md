# 智能科研与智能阅读工作台（门户覆盖版）

这是一个可本地运行、可继续编辑的 React + TypeScript 联合工作台，包含智能科研与智能阅读两套完整交互。智能科研覆盖内容检索、个人设置、科研笔记文档编辑，以及科研数据表格的集中管理、双视图、导入导出和分享；智能阅读覆盖文献库、上传、阅读器、检索、翻译、AI 解释、图表提取、截图、收藏和笔记闭环。

当前交付是开发源码与本地预览，不包含线上站点发布、真实后端、真实账号鉴权或团队通知服务。

## 门户入口

本目录已经覆盖门户原有的缩减版，同时保留宿主菜单约定：

- `dist/index.html?view=research`：智能科研
- `dist/index.html?view=reading`：智能阅读

两个入口共用同一份源码、数据模型和设计规范。应用内切换产品时会同步更新 `view` 参数；Vite 构建保留门户子目录资源适配，不能用上游预构建包直接替换本目录的 `dist/`。

## 运行环境

- Node.js `^20.19.0` 或 `>=22.12.0`
- pnpm `11.19.0`
- 现代 Chromium、Safari 或 Firefox 浏览器

## 快速启动

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

打开 <http://127.0.0.1:5173/>。

## 开发检查

```bash
# 单元测试 + TypeScript + 生产构建
pnpm check

# 仅运行测试
pnpm test

# 生成 dist/
pnpm build

# 生成适合本地门户预览、便于调试的未压缩 dist/
pnpm build:preview

# 预览生产构建，默认 http://127.0.0.1:4173/
pnpm preview:dist
```

`pnpm preview:check` 用于检查已经运行在 `127.0.0.1:5173` 的 Vite 热更新预览；请先运行 `pnpm dev`。

`build` 与 `build:preview` 使用相同源码和资源适配；前者用于发布前的标准压缩构建，后者用于当前本地门户预览与对话修改。

## 主要目录

| 路径 | 用途 |
| --- | --- |
| `src/App.tsx` | 页面状态、路由历史、保存补偿与各功能入口编排 |
| `src/components/` | 门户、全文搜索、文档编辑、数据表格等交互组件 |
| `src/dataTableContent.ts` | 数据表格领域模型、校验、导入导出、演示数据与本地持久化 |
| `src/documentContent.ts` | 科研文档内容持久化与结构清洗 |
| `src/researchSearch.ts` | 文档、笔记和数据表格的统一全文检索 |
| `src/types.ts` | 共享 TypeScript 类型 |
| `public/assets/` | 页面图标、图片和阅读器资源 |
| `tests/` | 数据表格与全文检索单元测试 |
| `scripts/check-local-preview.mjs` | 本地热更新预览契约检查 |
| `integration/data-table-module.manifest.json` | 数据表格嵌合所需文件、资源与宿主不变量的机器可读清单 |

## 本地数据说明

当前原型使用浏览器 `localStorage` 保存文档、数据表格和个人设置。源码自带 3 个数据表格、18 条记录和 15 条文件记录的非零演示种子数据。

浏览器中后续创建或修改的运行时数据不会自动写回源码，也不会被收入开发源码包。若需要迁移真实运行数据，应单独实现经过脱敏的数据导出流程。

## 嵌合到其他项目

优先阅读：

- [门户覆盖与运行说明](docs/PORTAL_EMBEDDING.md)
- [开发交接说明](docs/DEVELOPER_HANDOFF.md)
- [模块嵌合指南](docs/INTEGRATION_GUIDE.md)
- [源码包说明](docs/SOURCE_PACKAGE_NOTES.md)

## 资源与授权

IconPark 图标的来源与许可证说明保存在 `public/assets/iconpark/NOTICE.md`。

本仓库未声明独立的项目源码许可证。交付给开发团队用于当前项目开发不代表自动获得对外再分发权；外部发布前请由项目负责人确认应用代码以及 Figma、PNG、SVG 等素材的使用授权。
