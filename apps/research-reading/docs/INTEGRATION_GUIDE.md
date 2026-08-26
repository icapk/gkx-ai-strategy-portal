# 模块嵌合指南

## 推荐接入策略

### 方案 A：整页或微前端接入（优先）

将本项目作为宿主系统中的独立路由、iframe 或微前端运行。这样能最大限度保留现有视觉、键盘交互、历史导航和样式边界，也是返工风险最低的方案。

接入时需要：

1. 为应用分配独立路径或子域。
2. 确保 `public/assets/` 可以从应用资源根路径访问。
3. 将宿主登录用户、团队名称和成员列表映射到当前组件属性。
4. 用宿主 API 替换 `localStorage` 持久化。
5. 将 `#data-tables` 和 `#table=<documentId>` 映射到宿主路由，或保留为应用内部 hash。

### 方案 B：只嵌入数据表格模块

最小功能集合：

- `src/types.ts` 中的数据表格类型。
- `src/dataTableContent.ts`。
- `src/components/DataTableWorkspace.tsx`。
- `src/components/Modal.tsx`。
- `.data-sheet-*`、`.modal-*`、`.button*`、`.field-*`、`.sr-only`、`.icon-plus` 相关样式。
- `public/assets/iconpark/`、`public/assets/document-sheet.svg`、`public/assets/reading/search.svg` 和 Modal 图标。

若还需要“统领聚焦入口”，继续加入：

- `src/components/DataTableHub.tsx`。
- `src/components/WorkspaceView.tsx` 中的入口部分。
- `.data-hub-*` 与 `.workbench-data-hub-entry` 样式。
- `src/App.tsx` 中的打开、关闭、历史状态、保存补偿和失效深链逻辑。

## 组件契约

`DataTableWorkspace` 的宿主需要提供：

- 当前 `ResearchDocument` 与对应 `ResearchDataTable`。
- 当前用户、团队名和协作者候选列表。
- `onSave`：同步返回 `null` 或错误文本；生产环境建议改为异步状态机。
- `onClose`：返回宿主页面。
- `onToast`：展示成功或错误反馈。
- `onNavigationGuardChange`：将编辑器的离开保护注册给宿主路由。

当前 `onSave` 是同步协议。接入远程 API 时不能直接返回 Promise 并立即标记为已保存，应先把组件保存状态改为可等待的异步状态机，再接服务端。

宿主切换数据表格时，组件必须使用稳定且唯一的 `key`：

```tsx
<DataTableWorkspace
  key={`data-table-workspace-${documentItem.id}`}
  documentItem={documentItem}
  table={table}
  currentUser={currentUser}
  teamName={teamName}
  collaboratorOptions={collaborators}
  onSave={saveTable}
  onClose={closeTable}
  onToast={showToast}
  onNavigationGuardChange={registerGuard}
/>
```

## 必须适配的耦合点

### 1. 存储

当前键名：

- `intelligent-research-portal:documents:v1`
- `intelligent-research-portal:data-tables:v1`
- `intelligent-research-portal:user-profile:v1`

同源嵌入前至少修改命名空间，避免和其他实例冲突。正式接入建议抽象为 `DocumentRepository`、`DataTableRepository` 和 `ProfileRepository`，并由后端提供版本号、并发控制和事务/补偿能力。

### 2. 路由历史

当前使用：

- `#data-tables`：数据表格统领列表。
- `#table=<documentId>`：单个表格工作区。
- `history.pushState/back/replaceState`：返回、前进与深链恢复。

如果宿主使用 React Router、Vue Router 或 Next.js，应把这些行为迁移到宿主路由守卫，并继续调用编辑器注册的离开 guard。

### 3. 静态资源

源码中大量资源使用 `/assets/...` 绝对路径。部署在子路径时应采用以下任一策略：

- 保证宿主根路径提供同名 `assets` 目录；或
- 将资源改为 `import`；或
- 统一通过 `import.meta.env.BASE_URL`/资源函数生成 URL。

### 4. 样式

`src/styles.css` 与 `src/reading.css` 包含 `:root`、`body`、通用按钮和表单规则，直接复制可能污染宿主项目。推荐顺序：

1. 第一阶段采用独立路由、Shadow DOM、iframe 或微前端样式隔离。
2. 第二阶段把功能样式挂到 `.research-portal-root` 下。
3. 再将通用按钮、Modal 和字段样式映射到宿主设计系统。

不要只复制页面局部 JSX 而漏掉键盘焦点、`inert`、保存状态和空状态样式。

`DataTableWorkspace` 与 `DataTableHub` 当前是固定定位的全屏工作区；若要嵌入宿主页面的局部卡片，需要先改定位上下文和高度计算。`Modal` 当前使用固定的 `modal-title` ID；宿主可能并存多个 Modal 时建议改为 React `useId()`。

### 5. 服务端能力

从本地原型升级到多人生产版本时，至少补充：

- 身份认证、空间/表格权限与审计日志。
- 文档和表格版本号、乐观锁或实时协同协议。
- 文件对象存储、病毒扫描、类型识别和下载鉴权。
- 全文检索索引与分页 API。
- 分享链接的权限、有效期和撤销机制。
- 导入任务队列以及大文件/大数据量处理。

当前只解析 CSV/TSV。XLSX 仅作为演示文件名或附件记录出现；如宿主要求 Excel 内容解析，需要新增经过安全限制的 XLSX 解析链路和相应测试。

## 推荐迁移顺序

1. 复制类型、`dataTableContent.ts` 和现有测试，先让领域校验通过。
2. 接入 `DataTableWorkspace`、Modal、样式和资源，完成单表编辑闭环。
3. 接入宿主路由守卫和保存 API，验证 Back/Forward 与保存失败。
4. 接入 `DataTableHub` 和工作台入口，完成多表搜索、筛选和管理。
5. 替换本地分享、成员和文件逻辑。
6. 通过验收清单后，再拆分样式或重构组件。

## 嵌合验收清单

- 表格视图和表单视图显示同一筛选结果。
- 切换 Tab 后当前记录和筛选条件保持。
- 新增、编辑、保存、取消、删除和撤销闭环完整。
- 立即返回时已同步保存单元格修改。
- 有记录草稿时 Back/Forward 会确认，取消后草稿仍保留。
- 表格 A 切换到表格 B 不残留 A 的标题、字段或记录。
- 失效 ID 返回列表并显示明确提示。
- 保存失败不会更新成功状态；补偿失败有升级提示。
- 任一子弹窗打开时只暴露一个有效 `dialog`。
- 图标、焦点、触控尺寸和响应式布局符合宿主设计系统。
- `pnpm check` 与宿主端端到端测试全部通过。
