# 门户发布说明（2026-09-18）

沿用门户工作台两个 iframe 入口。源码从 5174 开发版本迁移，在独立发布副本中添加公开演示快照、首次加载和子路径资源适配。

- 智能科研：`apps/research-reading/dist/index.html?view=research`
- 智能阅读：`apps/research-reading/dist/index.html?view=reading`
- 正式构建：Node.js 24，`npm ci && npm run check`
- 发布源：默认分支根目录；必须同时提交源码、公开资料及 `dist/`。
- 回退基线：`aacd29f6d5b272f9dd4f4b78b11093ccfa15a789`。回退对应发布提交后重新运行 Pages 发布即可恢复旧站点。
- 访客数据为各自浏览器副本，不含生产后端共享服务。PRD 编辑在静态站点保存于本浏览器。

迁移包在写入仓库之前排除了用户指定的不公开文档及关联附件；原始浏览器导出文件仅保存在本机发布目录，未进入仓库。历史 ZIP 与旧校验清单继续作为历史归档。
