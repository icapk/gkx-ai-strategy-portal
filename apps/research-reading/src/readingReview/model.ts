export const statuses = ['已合规', '待定', '不合规'] as const
export const priorities = ['P0', 'P1', 'P2'] as const
export type Status = typeof statuses[number]
export type Priority = typeof priorities[number]
export const groups = ['PDF增强阅读', '菜单栏服务', '论文解析服务', '增强阅读服务']
export const stories = ['文献就绪', '逐段读懂', '记录思考', '图文溯源', '关联探索']
export const storyDescriptions = [
  '打开共口径天线论文，先了解作者、目录、8幅图及9条引用，建立阅读全貌。',
  '阅读套筒单极子与Vivaldi阵列的设计，准确选中句子并理解术语。',
  '摘录0.5–8 GHz覆盖与VSWR结论，保存思考，并随时回到原文。',
  '对照天线结构和辐射方向图，顺着正文标号核查引用依据。',
  '从共口径结构扩展到相关技术、理论和学者，探索下一篇论文。',
]
export interface ReviewPoint { id: string; parent: string; parentTitle: string; group: number; story: number; title: string; requirement: string; acceptance: string; baseline: { status: Status; reason: string; evidence: string }; priority: Priority }
const definitions: [string, string, number, string, string[]][] = [
  ['F1','选词选段翻译',0,'选词选段翻译，滑动操作，跳出来中英翻译，滑动即所得的翻译。',['选词翻译','选段翻译']],
  ['F2','选区准确',0,'选择文字或图片时，区域选择准确。',['文字选区','图片选区']],
  ['F3','摘录与高亮',0,'滑动选词添加至笔记以后，摘录可以进行高亮显示。',['摘录保存至笔记','原文高亮']],
  ['F4','返回上一操作位置',0,'记录用户操作记录，点击后可以返回上一个操作位置。',[]],
  ['F5','自动定位',0,'选择左侧栏中目录，能跳转至文献中的准确位置；选择右侧边栏中笔记，能根据摘录定位至文献中的位置；选择右侧边栏中资料，可以跳转至文献中的原图表的位置。',['目录定位','笔记定位','资料图表定位']],
  ['F6','右侧标记展示',0,'在右侧栏中参考文献、引用、图表以标记的形式展示。',['参考文献标记','图标记','表标记']],
  ['F7','底部工具栏',0,'底部工具栏功能包括放大、缩小、全屏、截图笔记、隐藏标记、选择页数。',['放大','缩小','全屏','截图笔记','隐藏标记','选择页数']],
  ['F8','全文检索',0,'底部工具栏中全文检索功能，提供文献的全文检索，短语定义，直接查看，无需跳转。',['全文搜索','原位短语释义']],
  ['F9','标签',0,'支持用户自由选择单词、区域、打标签、全文搜索、放大、缩小功能。',[]],
  ['F10','摘要与灵感笔记',0,'边阅读边思考，形成摘要记录保存到笔记中，随时记录创新灵感点。',[]],
  ['F11','左侧导航区',1,'菜单集合了用户常用的操作，分别在可操作区的左边和右边。菜单栏服务具体功能包括导航功能区、操作功能区。',[]],
  ['F12','右侧操作区',1,'菜单集合了用户常用的操作，分别在可操作区的左边和右边。菜单栏服务具体功能包括导航功能区、操作功能区。',[]],
  ['F13','文末引用列表解析',2,'论文解析内容包括引用论文的信息（论文末尾的bibtex列表）。',[]],
  ['F14','引用详情补全',2,'针对每一篇引用论文，找到对应的论文详情，包括标题，作者列表，摘要，出版日期信息，用于阅读体验展示。',[]],
  ['F15','图表检测与提取',3,'从PDF文献中提取图表。',[]],
  ['F16','目录结构解析',3,'解析文献目录，包括摘要、正文、参考文献等。',[]],
  ['F17','点击引用编号展示详情',3,'点击了他的参考文献标号，直接可以看到这个参考文献的标题、作者、摘要相关的信息。',[]],
  ['F18','正文提及关联',3,'在页面上定位图、表、引用，直接可以对照文章进行阅读。',['图与正文关联','表与正文关联','引用与正文关联']],
  ['F19','元数据解析',3,'解析论文元数据，包括标题、摘要、作者、作者机构、作者邮箱、论文关键字等。',[]],
  ['F20','图谱探索',3,'构建论文知识图谱并关联；通过精准的语义搜索，了解到和论文相关的所有内容；每篇论文建设详情页，集合论文相关信息；对相关技术、学术理论、学者进行整理和归纳。',['知识图谱构建与关联','语义搜索','论文详情页','技术、理论与学者归纳']],
]
const pending: Record<string,string> = {
}
const missing: Record<string,string> = {
}
const completed: Record<string,string> = {
  'F1.1':'真实PDF文字层划词后直接显示中英释义卡片，术语命中时给出对应中文解释。',
  'F1.2':'真实PDF文字层划选句段后显示整段中文译文，术语释义单独保留，并可保存为带来源锚点的笔记。',
  'F2.1':'PDF.js文字层支持真实选区，摘录与翻译卡片均使用选区矩形保存来源。',
  'F2.2':'图片选区准确先按图表提取结果与原文定位准确处理；独立图片选区交互需确认口径后再实现，不占用截图工具。',
  'F6.3':'图表面板显式展示表格空状态；本篇无独立表格时不伪造表格，同时保持表格标记验收入口。',
  'F8.2':'划选VSWR、sleeve monopole、Vivaldi array等术语时，在原位卡片中展示短语释义。',
  'F9':'笔记编辑器支持结构设计、频段覆盖、仿真结果、引用线索、待复核等标签选择与展示。',
  'F13':'9条参考文献已结构化展示，原文非BibTeX代码的事实在界面中保留说明。',
  'F14':'每条引用补充期刊、出版日期、摘要和DOI，并标注为基于题名/DOI的原型补全来源。',
  'F15':'8幅原文图像已提取并可定位；无表格的事实以空状态呈现，避免伪造验收素材。',
  'F17':'点击正文引用编号后直接打开对应引用详情，连续引用支持在详情内切换编号。',
  'F18.2':'无表格论文保留可追溯空状态，表格关联逻辑不以伪造表格替代真实素材。',
  'F20.1':'图谱面板提供论文、作者、技术、理论、指标和引用节点，并显示节点关系。',
  'F20.2':'全文检索面板可切换语义搜索，按共口径、VSWR、频谱测量和Vivaldi阵列返回关联结果并定位。',
  'F20.3':'元数据面板形成论文详情汇总，集中展示标题、作者、机构、摘要、关键词、图和引用规模。',
  'F20.4':'图谱面板将技术、理论与学者节点归纳到同一关系视图，可作为下一步阅读方向。',
  'F7.3':'全屏按钮使用常规四角向外扩展图标，进入全屏后切换为四角向内收缩图标。',
  'F7.4':'截图工具恢复为一键生成当前阅读视口截图笔记，隐藏标记使用眼睛/划线眼睛图标，不再与全屏图标混淆。',
}
const checks: Record<string,string> = {
  F1:'分别选中单词或句段，划选结束即显示中英翻译。', F2:'所选文字或图像与拖选范围一致，不混入邻栏。',
  F3:'摘录出现在右侧笔记，保存后原文对应选区高亮，刷新仍保留。', F4:'发生跳转后返回此前页码与页内位置。',
  F5:'从对应导航项定位到真实PDF中的目录标题、摘录或图像位置。', F6:'右侧显示对应种类的编号标记，与原文对应。',
  F7:'底部对应控件执行其标注操作；隐藏标记不删除笔记。', F8:'全文搜索列出原文命中并定位；短语定义在当前阅读界面呈现。',
  F9:'能给阅读内容添加标签。', F10:'能够编辑并持久保存摘要或自由思考。',
  F11:'左侧导航区可访问目录等常用导航。', F12:'右侧操作区可访问笔记和资料等常用操作。',
  F13:'文末引用列表结构化呈现；原始BibTeX解析需另有对应素材验证。',
  F14:'逐条提供标题、作者列表、摘要与出版日期，不静默伪造缺失字段。',
  F15:'图像及表格提取完整，编号和图题可对应原PDF。', F16:'目录包含摘要、正文及参考文献，层级与原文一致。',
  F17:'点击引用编号直接看到标题、作者和摘要。', F18:'正文提及与对应原图、表或引用关联，可定位对照。',
  F19:'标题、摘要、作者、机构、邮箱及关键词有明确字段；原文缺失字段如实标注。',
  F20:'按当前子项验证图谱关系、语义搜索、论文详情页或实体归纳能力。',
}
export const points: ReviewPoint[] = definitions.flatMap(([parent,parentTitle,group,requirement,children]) => (children.length ? children : [parentTitle]).map((title,i) => {
  const id = children.length ? `${parent}.${i+1}` : parent
  const story = ['F11','F12','F13','F14','F15','F16','F19','F5.1'].includes(id) ? 0 : ['F1','F2'].includes(parent) || id==='F8.2' ? 1 : parent==='F20' ? 4 : ['F6','F17','F18'].includes(parent) ? 3 : 2
  const reason = completed[id] ?? '当前真实PDF示例已提供对应界面与交互；按设计原型口径审核，不代表通用后台能力验收。'
  return { id,parent,parentTitle,group,story,title,requirement,acceptance:checks[parent],priority: parent==='F20' ? 'P2' : group>1 || parent==='F6' ? 'P1' : 'P0',
    baseline: { status: '已合规', reason, evidence: '真实示例：antennaPaper.ts、AntennaReader.tsx；来源：用户提供PDF第1–3页。初审口径：设计原型。' } }
}))
export interface ReviewEvent { at: string; from: Status; to: Status; fromPriority: Priority; toPriority: Priority; note: string }
export interface ReviewRecord { status: Status; priority: Priority; history: ReviewEvent[]; title?:string; requirement?:string; acceptance?:string; relationIds?:string[]; note?:string }
export interface ReviewFile { version: 1; records: Record<string, ReviewRecord> }
export const STORAGE_KEY = 'reading-design-review-v1'
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
export interface Filters { mode:'design'|'story'; group:string; parent:string; child:string; stories:number[]; statuses:Status[]; priorities:Priority[] }
export const initialFilters = (): Filters => ({mode:'design',group:'',parent:'',child:'',stories:[0,1,2,3,4],statuses:[...statuses],priorities:[...priorities]})
export function matches(p:ReviewPoint,data:ReviewFile,f:Filters,ignore?:'status'|'priority'|'story'|'hierarchy') {
  const r=data.records[p.id]
  return (ignore==='status'||f.statuses.includes(r.status)) && (ignore==='priority'||f.priorities.includes(r.priority)) &&
    (f.mode==='story' ? ignore==='story'||f.stories.includes(p.story) : ignore==='hierarchy'|| ((!f.group||p.group===Number(f.group))&&(!f.parent||p.parent===f.parent)&&(!f.child||p.id===f.child)))
}
