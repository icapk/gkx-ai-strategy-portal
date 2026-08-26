# 智能科研开发交付物

打包日期：2026-08-26

## 主交付

`intelligent-research-portal-source-20260826.zip`（约 1.5 MB）

完整开发源码包。包含源码、静态资源、测试、构建配置、锁文件、开发交接文档、嵌合指南、模块清单和包内文件哈希；不包含依赖目录、缓存、原站点项目 ID 或浏览器运行数据。

## 可选交付

`intelligent-research-portal-prebuilt-20260826.zip`（约 3.5 MB）

同批源码的 Vite 生产构建结果，仅用于快速预览或静态部署验证，不能替代源码包。

## 校验

在本目录运行：

```bash
shasum -a 256 -c SHA256SUMS.txt
```

## 开发开始方式

```bash
unzip intelligent-research-portal-source-20260826.zip
cd intelligent-research-portal-source-20260826
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm dev
```
