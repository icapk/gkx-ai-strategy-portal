# 接入契约

## 数据与名称

`sidebar.config.ts` 是初始数据入口；模板的 `research`、`reading` 两个槽位共用布局但独立保存。`productLabels` 改导航及侧栏可访问名称；导出文件名和个别历史说明仍保留原产品名称，正式改品牌时可一并修改相应导出函数。不要全仓库替换内部产品 ID。

合规点使用 `id,parent,parentTitle,group,title,requirement,priority,baseline`。`group` 为从 0 开始的一级分组；同一父级使用相同 `parent`。`story`、`acceptance` 是原组件数据结构的兼容字段，模板界面不展示故事线和验收要点；新数据保持 `story:0, acceptance:''` 即可。

PRD 使用 `areas[].features[]`，规则是 `rules: [{title,items:string[]}]`。`compliance` 引用合规稳定 ID；`links` 引用目标映射 ID。显示编号由实际顺序计算，不作为任何对象身份。PRD 与合规名称独立，业务对象也不能靠相同名称认领。

## 定位接入

```tsx
<section data-focus-id="order-create">…真实创建界面…</section>
```

配置一条 `locations['order-create']`，其 `selectors` 为 `[data-focus-id="order-create"]`，`navigationTarget` 指向 `targets` 的稳定键。`targets` 保存要切换的模块、页签或面板参数。现有类型来自原项目；接入不同路由时在适配层把目标键映射到自己的路由，不必先改整套业务类型。

```tsx
const host = useMemo<ReviewHost>(() => ({
  async prepareTarget(request) {
    if (hasUnsavedBusinessDraft()) return '请先保存或取消当前编辑，再定位'
    await openRouteForTarget(request.location?.navigationTarget)
    await waitUntilTargetMounted(request.location?.selectors ?? [])
    return undefined
  },
  restorer: {
    capture: () => captureCurrentPage(),
    restore: async saved => {
      if (!canRestore(saved)) return '原对象已删除或不可访问，未改变当前页面'
      if (hasUnsavedBusinessDraft()) return '请先保存当前草稿'
      await restorePage(saved)
      return undefined
    },
  },
}), [/* 真实适配器依赖 */])
```

上例中的业务函数由宿主实现，不是模板提供的隐藏 API。`prepareTarget` 返回成功后，模板会等待实际元素、计算可见框选并显示失败原因；不要在路由尚未完成时假装准备就绪。`restorer` 的值应符合 `annotations/restoration.ts` 的白名单。扩展新路由类型时同步扩展导入校验，不要允许导入文件携带可执行 JS 或任意点击指令。

`ReviewShell.context` 必须稳定描述产品、页面、文档与关键 Tab，不要用当前时间或可变标题。当前适配器默认科研为 `JSON.stringify({product:'research',section:'workbench',tab:'recent',surface:'workspace'})`，阅读为 `JSON.stringify({product:'reading',view:'library'})`。这些字段须与目标导航匹配；只写自定义 `page` 而不调整 `annotations/location.ts` 的上下文比较，会导致从功能新增注释时丢失初始范围。扩展真实文档路由时同步适配比较与恢复白名单。一个产品同一时刻挂一个 Shell。框选范围按目标元素的相对比例保存，并校验当前上下文；跨文档不能套用旧坐标。

`prepare` 只接受受控的 `reveal:` 与 `details:` 展开动作，且宿主需主动标记 `data-focus-reveal`。不能把提交、删除、上传等按钮配置为定位准备动作。

## 保存模式

所有浏览器 key 经 `src/storage.ts` 加 namespace；PRD／注释保存另用同一 namespace 的 Web Locks 防止并发写入。浏览器模式支持 localhost 和 HTTPS。Web Locks 不可用时会显示保存错误，避免退化成无保护覆盖。宿主不要猴子补丁全局 localStorage。

`runtime.storageMode='browser'` 是可直接运行默认值，开发与构建表现一致，不请求 `/api`。内置种子在 `seedSnapshot`，只在没有本地记录时初始化。已有记录格式错误时不自动恢复出厂。合规提交带当前浏览器快照比较，但不提供实时合规协同推送。

`service` 模式下 PRD／注释请求以下接口；合规记录及合规框选仍在当前浏览器，不要宣称所有评审数据已跨设备共享：

| 接口 | 方法与行为 |
| --- | --- |
| `/api/research-prd`、`/api/reading-prd` | GET 返回 `{revision,book}`；PUT 接收 `{expectedRevision,book}`；冲突 409 返回最新快照 |
| `/api/annotations/research`、`/api/annotations/reading` | GET 返回 schema/product/version/revision/items/trash；PUT 带 expectedRevision；409 返回 `{error,snapshot}` |
| 注释接口 POST | 接收 `{legacy:JSON字符串}`；幂等迁移，不能复活已移除记录 |

随包 `server/prdShared.mjs`、`server/annotationShared.mjs` 是原项目的**本机开发**插件示例，可在 Vite config 中注册。共享目录分别由 `PRD_SHARED_DIRECTORY`、`READING_PRD_SHARED_DIRECTORY`、`ANNOTATIONS_SHARED_DIRECTORY` 指定，测试要用独立空目录。它们只允许本机同源，不可直接当作互联网多用户服务器。真正上线需实现鉴权、授权、事务及存储；不要放开 host 校验来冒充完成服务化。

## 样式与边界

模板仅依赖 React、ReactDOM，不依赖原应用的 PDF、表格、富文本、业务 IndexedDB 或站点后台。`ReviewShell` 会引入必要 CSS；宿主强全局 `button`、`aside`、`input` 规则可能覆盖它，应在接入后实测。示例用的 `demo.css` 不要全局带入业务页面。

目前定位基于同一 document 的 DOM。跨域 iframe、Canvas 内部节点、Shadow DOM 内部区域不能直接由选择器定位；需要宿主额外适配。没有适配就反馈无法定位，不造一个看似正确的矩形。
