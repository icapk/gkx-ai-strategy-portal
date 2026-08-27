# 门户智能科研与智能阅读覆盖交付

门户运行版更新日期：2026-08-27（Asia/Shanghai）

本目录保存“工作台-需规”联合源码的原始交付物，以及从门户适配源码重新构建的运行版校验文件。

## 原始交付物

- `intelligent-research-portal-source-20260826.zip`：完整开发源码包
- `intelligent-research-portal-prebuilt-20260826.zip`：可选上游预构建包，仅供参考
- `DELIVERY_INDEX.md`：上游交付说明
- `SHA256SUMS.txt`：上述两个 ZIP 的原始 SHA-256

原始文件均保持不变，可在本目录运行：

```bash
shasum -a 256 -c SHA256SUMS.txt
```

## 门户运行版

门户不直接使用可选预构建 ZIP。实际运行版由 `apps/research-reading/` 的覆盖源码加上 `?view=` 与子路径资源适配后重新生成。

- `EMBEDDED_BUILD_SHA256SUMS.txt`：门户 `dist/` 全部文件的 SHA-256 清单
- `EMBEDDED_SOURCE_SHA256SUMS.txt`：门户可编辑源码、配置、测试和文档的 SHA-256 清单（排除 `node_modules/` 与 `dist/`）

在仓库根目录可分别校验门户运行版构建与源码：

```bash
shasum -a 256 -c deliverables/research-reading/EMBEDDED_BUILD_SHA256SUMS.txt
shasum -a 256 -c deliverables/research-reading/EMBEDDED_SOURCE_SHA256SUMS.txt
```

线上入口：<https://icapk.github.io/gkx-ai-strategy-portal/>

源码与嵌合细节见 `apps/research-reading/docs/PORTAL_EMBEDDING.md`。
