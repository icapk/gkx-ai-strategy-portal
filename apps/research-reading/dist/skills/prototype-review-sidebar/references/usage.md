# 使用与接入

## 先直接跑起来

需要 Node.js 24 或更新版本；本包验证使用 Node 24、React 19、Vite 7、TypeScript 5.8。模板无需数据库、账号、GitHub 权限或 AI 服务。

在终端执行（将路径改为自己的技能目录和目标目录）：

```sh
node <技能目录>/scripts/copy-template.mjs --target <新项目目录> --namespace my-prototype-v1
cd <新项目目录>
npm install
npm run dev
```

默认地址 `http://127.0.0.1:5230/?view=research&reviewOpen=1`。阅读槽位使用 `?view=reading&reviewOpen=1`。默认端口刻意避开原项目的 5174；端口被占用会报错，不会偷偷改成另一个端口。可通过 `npm run dev -- --port 5231` 指定其他端口。

首次预览侧栏有三个示例功能，注释为空。右侧仅展示可定位的查询、创建和设置区域；演示记录只保留在本次页面会话。左侧编辑内容按命名空间保存在浏览器，刷新仍在。浏览器和服务模式不自动互相迁移。

## 把示例换成自己的产品

编辑 `src/sidebar.config.ts`：

| 配置 | 用途 |
| --- | --- |
| `runtime.namespace` | 整个项目独有的保存前缀；首次复制确定，正式使用后不要随便改 |
| `runtime.storageMode` | `browser` 默认独立演示；`service` 调用自己的服务 |
| `runtime.apiBase` | 共享服务前缀，通常同源为空；不写任何密钥 |
| `productLabels` | 两个模块的展示名称；内部键保持稳定 |
| `catalogs.*.groups / points` | 合规层级、稳定 ID、需规原文、初始状态 |
| `catalogs.*.areas` | PRD 区域、功能规则、关联、优先级、计划版本 |
| `catalogs.*.targets / locations` | 功能 ID → 导航参数 → 页面选择器 |
| `seedSnapshot` | 新浏览器的 PRD / 注释初始记录；不要塞入个人记录 |

接入时先填一组真实功能，从卡片定位到页面跑通，再补齐目录。示例初始合规状态统一“待定”，需要根据真实实现重新判断。

## 给已有 React 项目接入

复制模板的 `src/` 到独立子目录，如 `src/review-sidebar/`，其中 `main.tsx`、`demo.css` 是独立示例入口，已有项目不必使用。另复制 `server/readingPrdValidation.mjs` 及其类型声明到与 `src` 相邻的 `server` 目录，或同步修改引用路径。更省事的方法是把模板整体放在 `src/review-sidebar-kit/`，从其中 `src/ReviewShell` 引入，保持相对路径不变。

```tsx
import {ReviewShell} from './review-sidebar-kit/src/ReviewShell'

// host 用 useMemo 保持稳定；prepareTarget 的完整例子见 integration.md。
<ReviewShell product="research" host={host} context={pageContext}>
  <ExistingPrototype />
</ReviewShell>
```

`ReviewShell` 只包一层；它提供 Context、侧栏和原型容器。不要在不同目录复制第二份 Context 再混用，否则会出现 Provider 明明在却找不到的错误。

默认含两个模块槽位，可只挂其中一个。要增加第三个模块，必须扩展产品类型、校验、存储、目标注册和界面切换，不能只加一个按钮。本版没有自动生成任意数量模块的能力。

## 常用操作

- 合规：搜索或按层级筛选；在卡片查看状态，进入详情读需规摘录；编辑名称和内容；定位或框选校正。
- PRD：选功能区域或全文搜索；改规则、名称、优先级、设计进度、着重讲解；新增或删除功能；从版本菜单查看历史，导出当前 PRD。
- 注释：进入标注状态，在右侧原型拖框后填写标题、正文；也可从功能详情新增关联注释。状态自由切换，移除后可恢复，支持 JSON 导入导出。
- 更新种子：修改配置后，已有浏览器仍保留旧记录。需要演示新基线时，用“更新评审示例”先下载备份再确认替换；它仅触及本项目命名空间内的评审记录。

## 构建与复制

```sh
npm test
npm run build
npm run preview
```

构建产物在 `dist/`，默认 `base: './'` 支持子目录静态托管。不要用 `file://` 双击页面；通过本地 HTTP 或 HTTPS 服务打开。复制脚本不安装依赖，也不发布网站。发布前还需在目标站点验证资源路径和保存模式。

如需让 Codex 自动发现，将整个 `prototype-review-sidebar` 文件夹放入自己的 `~/.codex/skills/`。技能引用和模板都是相对路径，复制后不依赖作者电脑上的工程目录。
