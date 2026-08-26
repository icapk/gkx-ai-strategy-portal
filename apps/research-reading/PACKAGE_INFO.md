# 智能科研与智能阅读门户覆盖版信息

- 覆盖日期：2026-08-26（Asia/Shanghai）
- 宿主：`gkx-ai-strategy-portal`
- 应用目录：`apps/research-reading`
- 包类型：完整、可编辑、可重建的智能科研与智能阅读联合源码
- 上游源码包：`intelligent-research-portal-source-20260826.zip`
- Node 要求：`^20.19.0 || >=22.12.0`
- pnpm：`11.19.0`
- 锁文件：`pnpm-lock.yaml`，lockfileVersion 9
- 演示种子：3 个数据表格、18 条记录、15 条文件记录

## 覆盖后验证

- 上游源码 ZIP、可选预构建 ZIP 的外层 SHA-256 均通过。
- 上游源码 ZIP 的逐文件 `PACKAGE_MANIFEST.txt` 全部通过。
- 17/17 单元测试通过。
- TypeScript 项目检查通过。
- Vite 本地预览构建通过，门户 `dist/` 已刷新。
- `view=research`、`view=reading`、主脚本与阅读图片经本机静态服务检查均返回 HTTP 200。
- 构建 JavaScript 中不存在 `"/assets/` 或 `"../assets/`，公共资源均指向门户子路径内的 `./assets/`。

## 门户适配

- 保留 `?view=research|reading` 初始化、切换同步与页面标题逻辑。
- 保留 Vite JavaScript 公共资源相对路径改写插件。
- 标准压缩构建使用 `pnpm build`；当前可调试本地预览使用 `pnpm build:preview`。
- 原始交付物原样保存在 `gkx-ai-strategy-portal/deliverables/research-reading/`。
- 上游未改动的包信息与包内清单保存在 `docs/upstream/`。

## 安全与可移植处理

- 未包含 `node_modules`、缓存、日志或环境文件。
- 应用目录未新增 `.openai/hosting.json`，因此此次覆盖不会触发新站点发布。
- 未包含浏览器 localStorage 和个人运行时数据。
- 预构建结果作为独立可选包提供，不与源码混在一起。

请从 `README.md` 开始，并阅读 `docs/PORTAL_EMBEDDING.md`。当前根目录的 `PACKAGE_MANIFEST.txt` 对应门户适配后的源码；上游原清单见 `docs/upstream/PACKAGE_MANIFEST.txt`。
