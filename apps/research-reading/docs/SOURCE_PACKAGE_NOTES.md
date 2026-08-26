# 源码包说明

## 主源码包包含

- `src/` 完整应用源码。
- `public/` 全部静态资源及 IconPark 许可证说明。
- `tests/`、`scripts/`。
- `package.json`、`pnpm-lock.yaml`、pnpm workspace 配置。
- Vite 与 TypeScript 配置。
- README、开发交接和嵌合文档。
- 由打包流程生成的文件清单与构建信息。

## 主源码包排除

- `node_modules/`、`.pnpm-store/`：可由锁文件重建。
- `dist/`：生成文件，单独提供可选预构建包。
- `.openai/hosting.json`：包含当前本地站点项目标识，避免误发布。
- `.env*`、`*.local`、`*.log`、`.DS_Store`。
- 浏览器 `localStorage`、缓存、上传文件和个人运行时数据。
- 旧 ZIP、临时目录和版本控制内部文件。

## 完整性校验

交付目录会同时提供 `SHA256SUMS.txt`。开发方收到文件后可以运行：

```bash
shasum -a 256 -c SHA256SUMS.txt
```

Windows PowerShell 可使用 `Get-FileHash <文件> -Algorithm SHA256` 后与清单比对。

## 可选预构建包

预构建包只用于快速查看当前生产构建结果，不能替代源码。重新嵌合或发布前仍应从主源码包执行 `pnpm install --frozen-lockfile && pnpm check`。
