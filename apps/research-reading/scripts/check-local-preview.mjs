const previewBaseUrl = process.env.LOCAL_PREVIEW_URL ?? 'http://127.0.0.1:5173/'
const previewId = 'portal-draft-intelligent-research'
const requestId = Date.now().toString(36)

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function fetchPreview(pathname) {
  const url = new URL(pathname, previewBaseUrl)
  url.searchParams.set('__preview_check', requestId)
  const response = await fetch(url, {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache' },
    signal: AbortSignal.timeout(5_000),
  })
  assert(response.ok, `预览请求失败：${response.status} ${url}`)
  return { response, text: await response.text(), url }
}

try {
  const page = await fetchPreview('/')
  assert(page.text.includes(`name="codex-preview-id" content="${previewId}"`), '当前端口不是「智能科研」工作区预览')
  assert(page.text.includes('/@vite/client'), '当前地址不是 Vite 可编辑热更新预览')
  assert((page.response.headers.get('cache-control') ?? '').includes('no-store'), '预览未启用 no-store，存在旧资源缓存风险')

  const dialogSource = await fetchPreview('/src/components/GlobalSearchDialog.tsx')
  assert(dialogSource.text.includes('listResearchContent'), '预览未加载“首开浏览列表”版本')
  assert(dialogSource.text.includes('科研内容列表'), '预览中缺少默认一级列表契约')

  const styles = await fetchPreview('/src/styles.css')
  assert(styles.text.includes('.global-search-result-icon'), '预览中缺少新版结果卡片样式')
  assert(styles.text.includes('.data-sheet-record-details'), '预览中缺少表单视图只读字段样式')
  assert(styles.text.includes('.data-hub-table-scroll'), '预览中缺少扁平数据表格管理列表样式')
  assert(!styles.text.includes('.data-sheet-visual-insights'), '预览仍在加载已回滚的表单图表样式')

  const dataTableWorkspace = await fetchPreview('/src/components/DataTableWorkspace.tsx')
  assert(dataTableWorkspace.text.includes('表格视图') && dataTableWorkspace.text.includes('表单视图'), '预览中缺少数据表格双视图 Tab')
  assert(dataTableWorkspace.text.includes('data-sheet-record-details'), '预览未加载同一数据源的只读表单详情')
  assert(dataTableWorkspace.text.includes('attemptWorkspaceLeave') && dataTableWorkspace.text.includes('onNavigationGuardChange'), '预览未加载未保存数据导航保护')
  assert(dataTableWorkspace.text.includes('没有符合条件的记录') && dataTableWorkspace.text.includes('清除筛选'), '预览未加载表格筛选空状态闭环')
  assert(dataTableWorkspace.text.includes('role: nestedModalOpen ? void 0 : "dialog"'), '预览未隔离编辑器内的模态语义层级')
  assert(!dataTableWorkspace.text.includes('负责人负载'), '预览仍在加载已回滚的负责人图表')

  const dataTableHub = await fetchPreview('/src/components/DataTableHub.tsx')
  assert(dataTableHub.text.includes('data-hub-table-scroll'), '预览未加载数据表格统领清单')
  assert(dataTableHub.text.includes('inert: suspended ? true'), '预览未加载弹窗后台隔离')
  assert(!dataTableHub.text.includes('data-hub-stats'), '预览仍在加载已回滚的 KPI 看板')

  const appSource = await fetchPreview('/src/App.tsx')
  assert(appSource.text.includes('dataTableNavigationGuardRef'), '预览未接入浏览器返回/前进导航保护')
  assert(appSource.text.includes('data-table-workspace-'), '预览未隔离不同数据表格的编辑状态')
  assert(appSource.text.includes('该数据表格已不存在，已返回数据表格列表'), '预览未处理失效数据表格深链')

  const shareIcon = await fetchPreview('/assets/iconpark/share.svg')
  assert(shareIcon.text.includes('fill="none"'), '预览未加载统一线型分享图标')

  console.log(`预览检查通过：${new URL(previewBaseUrl).origin}`)
  console.log(`站点标识：${previewId}；热更新、无缓存、双视图和线型图标均已就绪。`)
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
