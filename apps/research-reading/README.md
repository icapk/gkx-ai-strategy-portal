# 智能科研 / 智能阅读

该目录保留 React + Vite 源码，门户实际内嵌 `dist/index.html`。

```bash
pnpm install --frozen-lockfile
pnpm build
```

入口参数：

- `dist/index.html?view=research`：智能科研
- `dist/index.html?view=reading`：智能阅读

`dist/` 需要随源码一起提交，因为 GitHub Pages 直接从仓库根目录发布。
