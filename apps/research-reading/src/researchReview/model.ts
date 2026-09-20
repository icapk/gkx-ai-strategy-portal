export const statuses = ['已合规', '待定', '不合规'] as const
export const priorities = ['P0', 'P1', 'P2'] as const
export type Status = typeof statuses[number]
export type Priority = typeof priorities[number]
export const groups = ['工作台', '基础模块', '文档编辑', '存档管理', '数据表格', '空间管理']
export const stories = ['找回工作内容', '管理个人资料', '阅读与记录', '收集项目数据', '团队协作']
export const storyDescriptions = [
  '从固定文件夹、最近浏览和收藏中找到资料，再通过全文搜索继续工作。',
  '进入个人空间，核对资料信息、编辑内容并设置个人信息。',
  '导入文献，阅读原文，划词或截图记录笔记，并编写和导出研究记录。',
  '用表格和表单收集研究数据及进度，上传数据文件并查看分享结果。',
  '进入团队空间维护文档，由管理员邀请成员、配置角色并验证访问范围。',
]
export interface ReviewPoint { id: string; parent: string; parentTitle: string; group: number; story: number; title: string; requirement: string; acceptance: string; baseline: { status: Status; reason: string; evidence: string }; priority: Priority }
type Check = [title: string, acceptance: string, status: Status, reason: string]
type Definition = [parent: string, title: string, group: number, story: number, requirement: string, evidence: string, checks: Check[]]
const table = 'src/components/DocumentTable.tsx'
const app = 'src/App.tsx'
const editor = 'src/components/ContinuousDocumentEditor.tsx'
const definitions: Definition[] = [
  ['R1','快速访问',0,0,'为用户自己固定的文件夹，点击可快速进去。',app + '；src/components/WorkspaceView.tsx',[
    ['固定文件夹','用户可将指定文件夹加入快速访问并取消固定。','已合规','quickAccess 保存文件夹标识，工作台读取已固定的个人及团队文件夹。'],
    ['打开固定文件夹','点击固定项进入相应空间和文件夹。','已合规','onOpenQuickFolder 设置空间、团队和文件夹路径。'],
  ]],
  ['R2','最近浏览',0,0,'为用户自己最近浏览的文档，方便用户快速找到近期打开过的文档，继续完成工作。列表展示内容包含文档名称、文档大小、最后打开时间、所属父文件夹，点击标题，进入文档详情页。按照时间倒序排列，默认显示20条，点击加载更多按钮，进行分页加载。',table + '；src/workbenchDocuments.ts；' + app,[
    ['记录最近浏览','打开文档后更新最近访问记录。','已合规','打开文档更新 visitedAt，recentDocuments 汇总最近浏览。'],
    ['显示文档名称','最近浏览列表显示文档名称。','已合规','标题列使用 documentItem.title。'],
    ['显示文档大小','最近浏览列表显示文档大小。','已合规','列表使用 sizeInMegabytes 展示大小。'],
    ['显示最后打开时间','展示当前文档最近一次打开时间。','已合规','visitedAt 字段作为访问时间展示和排序依据。'],
    ['显示所属父文件夹','列表可辨识所属父文件夹。','已合规','位置列通过 displayResearchLocation 显示路径。'],
    ['点击标题进入详情','点击不同类型文档标题打开对应详情。','已合规','onOpenDocument 分发至在线编辑器、表格或文件阅读预览。'],
    ['按时间倒序','默认按最后打开时间从新到旧排列。','已合规','默认排序键 visitedAt，方向 desc。'],
    ['默认显示20条','超过20条数据时首屏只展示20条。','已合规','pageSize 初始值为20，列表按页截取。'],
    ['加载更多分页','点击加载更多追加下一批文档。','不合规','当前使用页码、上一页和下一页替换列表；没有需求指定的加载更多追加方式。'],
  ]],
  ['R3','我的收藏',0,0,'为用户自己手动对文档添加到收藏，收藏列表为平铺列表。列表展示内容包括被收藏文档的标题、用户收藏文档的时间、文档类型标识、被收藏文档的大小。',table + '；' + app,[
    ['手动收藏文档','添加收藏后出现在收藏列表，取消后移除。','已合规','toggleFavorite 更新 favorite 与 favoritedAt 并保存。'],
    ['收藏平铺列表','集中平铺展示收藏文档。','已合规','favorites 模式采用统一列表。'],
    ['收藏标题','展示被收藏文档标题。','已合规','收藏表头及标题单元格已提供。'],
    ['收藏时间','显示用户添加收藏的时间。','已合规','使用 favoritedAt 和 favoriteTimeLabel。'],
    ['收藏类型标识','能够辨识被收藏文档类型。','已合规','收藏列表提供类型列及文件图标。'],
    ['收藏文件大小','展示被收藏文档大小。','已合规','收藏列表提供文档大小列。'],
  ]],
  ['R4','个人空间',0,1,'用户私有的文档存储空间，仅本人可见，支持完整的文档管理功能。列表包括文件/文件夹名称、文档类型标识、文档大小、最后修改时间、所属父文件夹、文档创建者姓名、文档创建时间。支持用户对列表中文件进行编辑、删除。',table + '；src/components/SpaceView.tsx；' + app,[
    ['个人空间私有可见','其他账号不可读取个人空间文档。','待定','当前以本机存储和空间分类组织资料，尚无跨账号鉴权证据。'],
    ['文件及文件夹名称','空间列表显示文件和文件夹名称。','已合规','folderEntries 与 documents 合并展示。'],
    ['文档类型标识','空间列表提供类型标识。','已合规','空间表头含类型，文件使用对应类型标签。'],
    ['文档大小','空间列表显示文件大小。','已合规','空间模式有文档大小字段。'],
    ['最后修改时间','编辑保存后更新并展示修改时间。','已合规','空间模式展示 updatedAt，文档保存更新元数据。'],
    ['所属父文件夹','展示资料所在的父文件夹。','已合规','空间模式提供位置列及路径。'],
    ['创建者姓名','显示文档创建者姓名。','已合规','空间模式提供创建者列和 owner。'],
    ['创建时间','展示文档创建时间。','已合规','空间模式提供 createdAt 列。'],
    ['编辑文件','从空间列表打开文件并保存编辑。','待定','在线文档和数据表格可编辑；上传的 Word/Excel 走预览及在线副本转换，原文件编辑范围需确认。'],
    ['删除文件','删除后移出空间并有明确结果。','已合规','删除确认和回收站流程已接入。'],
  ]],
  ['R5','团队空间',0,4,'里面的文档为团队共同维护，空间中成员均可见。',app + '；src/components/SpaceView.tsx',[
    ['团队共同维护','两个成员可维护同一空间文档并看到对方修改。','待定','已有团队空间和共享元数据；本机持久化不能证明多账号同步。'],
    ['团队成员可见','所有空间成员均可看到空间内文档。','待定','已有空间目录展示，仍需多账号可见范围验收。'],
  ]],
  ['R6','通用功能',1,0,'支持用户对笔记、文档信息的全文搜索，对个人信息进行设置。','src/researchSearch.ts；src/components/ProfileSettingsModal.tsx；' + app,[
    ['笔记全文搜索','正文关键词能够命中笔记并打开结果。','已合规','noteFields 检索笔记正文、标题和标签。'],
    ['文档全文搜索','文档正文及信息关键词能够命中并打开结果。','已合规','documentFields 检索正文、元信息和已解析的 PDF 全文。'],
    ['个人信息设置','修改个人信息并保存，在界面更新。','已合规','个人信息设置弹窗和 profile 保存流程已接入。'],
  ]],
  ['R7','富文本编辑',2,2,'可针对不同类型的内容进行编辑与组合。富文本编辑器主要包括：文本、列表、图片、数学公式、网页书签、分割线功能。',editor,[
    ['文本编辑','编辑正文及文本格式，保存后重新打开保留。','已合规','Tiptap 正文编辑支持标题、粗体等格式并保存 richHtml。'],
    ['列表编辑','插入编辑有序或无序列表。','已合规','工具栏提供 toggleBulletList 和 toggleOrderedList。'],
    ['图片编辑','插入图片并保存到文档。','已合规','文件选择及 Image 扩展支持图片写入正文。'],
    ['数学公式','输入数学公式并渲染到正文。','已合规','Mathematics 扩展与 insertInlineMath 已接入。'],
    ['网页书签','插入有标题的网页地址并可访问。','已合规','网页书签入口验证 http/https 并插入带标题链接。'],
    ['分割线','插入分割线以分隔内容。','已合规','工具栏调用 setHorizontalRule。'],
    ['多种内容组合','在同一笔记组合上述内容并保存。','已合规','统一富文本正文支持不同节点组合存储。'],
  ]],
  ['R8','PDF存档与笔记',3,2,'在导入PDF文件后，可以在文件中划词或截图做笔记。PDF文件在线解析，解析成功后，可直接打开PDF文件阅读。同时支持一次上传多个文件，支持笔记页面以PDF形式导出。','src/components/PdfArchiveReader.tsx；src/components/PdfImportDialog.tsx；' + app,[
    ['导入PDF','选择 PDF 文件后导入存档。','已合规','importPdfFile 校验类型、大小并写入存档及文档信息。'],
    ['PDF在线解析','解析 PDF 并报告成功或失败。','已合规','PDF.js 解析页数与文本，具有失败和加密处理。'],
    ['打开PDF阅读','解析成功后打开原文在线阅读。','已合规','PdfArchiveReader 从存档加载和渲染 PDF。'],
    ['划词做笔记','选择原文文字，添加笔记并保存。','已合规','阅读器处理文字选区与 annotation 保存。'],
    ['截图做笔记','截取原文区域，添加笔记并保存。','已合规','阅读器提供截图和标注保存流程。'],
    ['多文件批量上传','一次选择多个文件，逐个反馈导入结果。','已合规','PDF 导入弹窗和批量上传入口已接入逐文件处理。'],
    ['文献存档管理','导入的原文可再次打开、查看和管理。','已合规','原文件及元信息持久化，列表可以重新打开存档。'],
    ['笔记页面导出PDF','将笔记页面输出为可阅读的 PDF 文件。','待定','PDF 阅读器提供笔记 PDF 导出；当前通用在线笔记编辑器没有导出入口，需确认需求是否包含全部笔记页面。'],
  ]],
  ['R9','科研数据表格',4,3,'数据表格可以用于收集、存储、管理科研项目数据和项目进度。方便多人功能上传数据文件，随时查看和分享。通过表格视图、表单视图方式来展示。','src/components/DataTableWorkspace.tsx；src/dataTableContent.ts',[
    ['收集项目数据','新增或导入科研数据记录。','已合规','提供新建记录及 CSV/TSV 导入。'],
    ['存储管理数据','编辑、保存、重新打开和删除数据记录。','已合规','表格行编辑及本机持久化流程已实现。'],
    ['管理项目进度','用字段记录和修改项目进度。','已合规','表格支持项目进度模板与记录编辑。'],
    ['上传数据文件','上传数据文件并导入表格。','已合规','导入处理生成记录并保存导入历史。'],
    ['多人上传','不同成员可向同一表格上传数据并互相看到。','待定','记录上传者及共享权限，但未发现多用户同步服务证据。'],
    ['查看数据','随时重新打开表格查看已保存数据。','已合规','从文档或表格入口加载本机已保存记录。'],
    ['分享数据','分享后其他成员可实际访问相应数据。','待定','分享弹窗保存本地权限；跨账号访问仍需验证。'],
    ['表格视图','用表格形式展示和编辑记录。','已合规','SpreadsheetGrid 已接入表格视图。'],
    ['表单视图','用表单形式查看并提交记录。','已合规','提供表单字段、记录切换及未提交草稿处理。'],
  ]],
  ['R10','成员管理',5,4,'管理员可邀请成员加入空间、从空间移除成员。只有在团队空间内的成员，对空间内文档可见。可进行添加、修改、删除操作。',app + '；src/components/TeamPanel.tsx；src/components/TeamSpaceDialog.tsx',[
    ['邀请添加成员','管理员可选择人员加入当前空间。','已合规','管理员入口和 submitInvite 更新成员列表，当前按本机交互初评。'],
    ['移除成员','管理员可移除指定成员并保存。','已合规','成员移除通过 setMembers 和空间保存校验。'],
    ['修改成员配置','管理员可修改成员角色配置。','已合规','成员列表角色选择和管理弹窗支持修改保存。'],
    ['仅成员可见文档','非成员和移除后的成员无法读取空间文档。','待定','当前本地成员列表不能证明文档读取端鉴权，需非成员账号核验。'],
    ['添加修改删除文档','空间成员按权限维护空间内文档。','待定','团队空间有新建编辑删除入口；不同角色的完整操作权限需验证。'],
  ]],
  ['R11','管理员角色配置',5,4,'只有管理员可设置普通成员为管理员角色和移除管理员角色，且空间最后一个管理员不可移除管理角色和移除空间。',app + '；src/teamSpaces.ts；src/components/TeamPanel.tsx',[
    ['设置管理员','当前管理员可将普通成员设为管理员。','已合规','角色菜单调用 setMembers，保存前检查 isTeamAdmin。'],
    ['移除管理员角色','管理员可移除其他管理员的角色。','已合规','角色菜单提供降级角色选项并保存。'],
    ['仅管理员配置角色','普通成员不能配置管理员角色。','待定','存在 isTeamAdmin 检查，但身份按固定 member.id === 1 判断，仍需真实身份验证。'],
    ['保留最后管理员角色','仅剩一名管理员时禁止降级。','已合规','validateTeamSpace 拒绝不含管理员的成员列表。'],
    ['最后管理员不可移出空间','禁止将空间最后一名管理员移除。','已合规','移除后通过相同校验保证至少一名管理员；“移除空间”按成员退出/移出空间解释。'],
  ]],
]
export const points: ReviewPoint[] = definitions.flatMap(([parent,parentTitle,group,story,requirement,evidence,checks]) =>
  checks.map(([title,acceptance,status,reason],index) => ({
    id: parent + '.' + (index + 1), parent, parentTitle, group, story, title, requirement, acceptance,
    priority: status === '待定' && (parent === 'R4' || group === 5) ? 'P0' : status === '已合规' ? 'P2' : 'P1',
    baseline: {status, reason, evidence: evidence + '。2026-09-10 代码初评；已合规限设计原型，实际服务能力另行验收。'},
  })),
)
export interface ReviewEvent { at: string; from: Status; to: Status; fromPriority: Priority; toPriority: Priority; note: string }
export interface ReviewRecord { status: Status; priority: Priority; history: ReviewEvent[]; title?:string; requirement?:string; acceptance?:string; relationIds?:string[]; note?:string }
export interface ReviewFile { version: 1; records: Record<string, ReviewRecord> }
export const STORAGE_KEY = 'research-compliance-review-v1'
export const freshReview = (): ReviewFile => ({ version:1, records:Object.fromEntries(points.map(p => [p.id,{status:p.baseline.status,priority:p.priority,history:[]}])) })
export function parseReview(value: unknown): ReviewFile {
  if (!value || typeof value !== 'object') throw new Error('文件不是审核记录。')
  const file = value as ReviewFile
  if(file.version!==1 || !file.records || typeof file.records!=='object' || Array.isArray(file.records)) throw new Error('审核文件版本或结构不受支持。')
  const allowed = new Set(points.map(p=>p.id))
  for(const [id,r] of Object.entries(file.records)) {
    if(!allowed.has(id) || !r || !statuses.includes(r.status) || !priorities.includes(r.priority) || !Array.isArray(r.history) || r.history.length>10000) throw new Error(`功能 ${id} 的审核记录无效。`)
    for(const key of ['title','requirement','acceptance','note'] as const) if(r[key]!==undefined&&(typeof r[key]!=='string'||r[key]!.length>10000))throw new Error('编辑内容无效。')
    if(r.relationIds!==undefined&&(!Array.isArray(r.relationIds)||r.relationIds.some(id=>typeof id!=='string')))throw new Error('关联功能点无效。')
    for(const h of r.history) if(!h || !Number.isFinite(Date.parse(h.at)) || !statuses.includes(h.from) || !statuses.includes(h.to) || !priorities.includes(h.fromPriority) || !priorities.includes(h.toPriority) || typeof h.note!=='string' || h.note.length>10000) throw new Error(`功能 ${id} 的历史记录无效。`)
  }
  return {version:1,records:Object.fromEntries(Object.entries(file.records).map(([id,r])=>[id,{...r,history:[]}]))}
}
export function loadReview(): {data:ReviewFile; error:string} {
  try {const raw=localStorage.getItem(STORAGE_KEY); const data=freshReview(); if(!raw)return {data,error:''}; const saved=parseReview(JSON.parse(raw)); const records={...data.records}; for(const [id,record] of Object.entries(saved.records)) records[id]=record; try{localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,records}))}catch{} return { data: {version:1, records}, error:'' }}
  catch {return {data:freshReview(), error:'本地审核记录无法读取，暂显示默认审核状态。'}}
}
export interface Filters { mode:'design'|'story'|'prd'|'annotations'; group:string; parent:string; child:string; stories:number[]; statuses:Status[]; priorities:Priority[] }
export const initialFilters = (): Filters => ({mode:'design',group:'',parent:'',child:'',stories:[0,1,2,3,4],statuses:[...statuses],priorities:[...priorities]})
export function matches(p:ReviewPoint,data:ReviewFile,f:Filters,ignore?:'status'|'priority'|'story'|'hierarchy') {
  const r=data.records[p.id]
  return (ignore==='status'||f.statuses.includes(r.status)) && (ignore==='priority'||f.priorities.includes(r.priority)) &&
    (f.mode==='story' ? ignore==='story'||f.stories.includes(p.story) : ignore==='hierarchy'|| ((!f.group||p.group===Number(f.group))&&(!f.parent||p.parent===f.parent)&&(!f.child||p.id===f.child)))
}
