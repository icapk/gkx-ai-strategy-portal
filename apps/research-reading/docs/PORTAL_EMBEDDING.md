# 门户覆盖与运行说明

## 覆盖结论

门户原 `apps/research-reading` 缩减版已由“工作台-需规”的智能科研与智能阅读联合源码覆盖。宿主仍通过同一个 iframe 容器打开应用，因而门户导航、移动端入口、样式隔离和关闭行为无需建立第二套实现。

宿主入口保持不变：

- 智能科研：`apps/research-reading/dist/index.html?view=research`
- 智能阅读：`apps/research-reading/dist/index.html?view=reading`

## 门户专用适配

完整上游源码之外仅保留两项宿主适配：

1. `src/App.tsx` 从 `view=research|reading` 初始化产品，并在应用内切换时同步 URL 与页面标题。
2. `vite.config.ts` 在生产构建阶段把 JavaScript 中的 `/assets/` 公共资源地址改为当前 `dist/` 的相对地址，确保 iframe 从门户子路径加载时不请求站点根目录。

CSS 中由 Vite 生成的 `../assets/` 是相对于 `dist/assets/*.css` 的正确地址，不由该插件二次改写。

## 开发与构建

在本目录执行：

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build:preview
pnpm dev
```

`pnpm check` 会依次运行单元测试、TypeScript 检查和标准压缩生产构建。当前本地门户预览可使用 `pnpm build:preview` 快速刷新便于调试的未压缩 `dist/`；两者使用相同源码、样式和资源适配。

若只需在完整门户中预览，可从仓库根目录启动现有静态服务，然后访问：

- `/apps/research-reading/dist/index.html?view=research`
- `/apps/research-reading/dist/index.html?view=reading`

## 交付物与可追溯性

原始完整源码 ZIP、可选预构建 ZIP、交付说明及上游 SHA-256 文件均原样归档在：

`gkx-ai-strategy-portal/deliverables/research-reading/`

上游包内 `PACKAGE_INFO.md` 与 `PACKAGE_MANIFEST.txt` 的原文副本保存在 `docs/upstream/`。当前根目录的 `PACKAGE_MANIFEST.txt` 对应门户适配后的可编辑源码；门户构建产物另由交付目录中的 `EMBEDDED_BUILD_SHA256SUMS.txt` 校验。

上游预构建包仅用于交付留档和独立参考。它没有门户子路径适配，不能覆盖 live `dist/`。

## 当前边界

- 文档、数据表格与个人设置仍保存在浏览器 `localStorage`；清理站点数据会清除本地修改。
- 上传、分享、团队协作、AI 解释等为可操作原型闭环，不等同于生产后端服务。
- 当前只部署本地可预览版本，未执行新站点发布。
