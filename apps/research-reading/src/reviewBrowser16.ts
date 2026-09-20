import type { PrdArea, PrdFeature } from './researchReview/prd'
import type { PrdBook } from './researchReview/prdStore'

export const browser16Revision='browser16-confirmed-20260920'
const groupTitle='浏览器16条批注：已确认规则'
type Product='research'|'reading'
const updates:Record<string,string[]>={
 '01':[
  '注释模式在模式选择附近提供搜索，匹配编号、稳定ID、标题和正文；与处理状态、来源、日期、关联状态共同过滤。关联状态提供全部、已关联、未关联；至少一个有效G或D即为已关联。清空搜索保留其他筛选，无结果时显示提示。',
  '注释卡片参照合规卡片的标题、边距、标签和操作密度。关联状态只作文字或标签，关联修改统一进入编辑，不提供独立关联按钮；保留定位、编辑及状态、来源快捷操作。',
  '更新时间优先紧凑显示于标题右侧，不独占底部一整行；长标题保持可读，时间只读，悬浮或聚焦可查看完整更新时间。'],
 '02':[
  'PRD区域下拉和区域标题按完整版本实际顺序显示1、2等一级编号，与下级功能点前缀一致；需求概述不占区域编号。搜索与筛选不重排，内部稳定ID、关联和历史不变。',
  '优先级、着重讲解、设计进度在侧栏顶部一行三列显示，保留标签、选项和组合筛选能力，实际侧栏宽度内可读可操作。',
  '导出PRD、版本与改动记录、创建大版本与演示资料管理位于同一底部操作行；版本选择下拉可在其上方。保留导出字数的悬浮或键盘聚焦提示，历史及创建版本规则不变。'],
 '03':[
  '标注入口、操作页面、绘制范围、退出及必要提示统一放在评审侧栏；不保留覆盖原型的持续标注浮条，分享等业务弹窗内不插入标注当前界面按钮。业务弹窗打开时侧栏控制仍可操作。',
  '操作页面中展开弹窗或下拉后，经侧栏切换绘制范围及拖画全过程保持目标展开。保存后继续标注，取消或退出后恢复正常业务交互；不提交选项、不执行分享或移动。'],
 '05':[
  '仅进入标注状态后显示当前页面、具体文档和浮层内符合搜索及筛选且范围有效的绿色标记；仅切到注释模式不显示，退出标注即隐藏。列表与标记使用同一结果集。',
  '同一界面多个标记完整可发现、可操作，重叠位置须避免互相遮盖。无范围或目标失效的注释保留在列表并说明原因，不把其他文档注释画在当前文件上。',
  '合规和PRD框选校正浮框可通过标题区域拖动，按钮和绘制不误触拖动；限制在可找回的视口范围内。移动不修改已保存范围，两产品均适用。'],
 '06':[
  '处理状态选择始终展示AI待做、待审核、已完结三态，卡片与编辑同类入口一致；当前不可流转的选项仍可见，置灰并说明原因。',
  '保留AI待做→待审核→已完结、待审核可退回AI待做、已完结不可重开。完整展示选项不允许跳过审核，正文和原有处理记录保留。'],
 '08':[
  '注释模式底部同一操作行放导入注释、导出注释、演示资料管理；不额外保留重复入口，同ID追加正文及产品隔离、保存失败保护保持。',
  '合规模式底部同一操作行放导入合规审查结果、导出合规审查结果、演示资料管理；移除原位置重复按钮，本地保存提示不挤占操作行。管理对象仍是当前产品。'],
}
const replacements:[string,string][]=[
 ['关联状态单独展示，不增加关联状态筛选。','关联状态单独展示，并提供全部、已关联、未关联筛选。'],
 ['不额外增加关联状态筛选','增加关联状态筛选'],
 ['关联项打开关联编辑','关联状态以文字或标签展示，关联修改统一进入编辑'],
 ['优先级、着重讲解和设计进度在顶部两列排列并组合过滤。','优先级、着重讲解和设计进度在顶部一行三列排列并组合过滤。'],
 ['版本选择、版本与改动记录、创建大版本及统一导出PRD放侧栏底部；','版本选择可在底部操作行上方，版本与改动记录、创建大版本及统一导出PRD与演示资料管理在底部同排；'],
 ['注释导入、导出入口统一放在侧栏底部；','注释导入、导出入口与演示资料管理统一放在侧栏底部同一操作行；'],
 ['原型内容区通过编号绿色标记显示注释位置。','进入标注状态后，原型内容区通过符合搜索筛选及当前界面上下文的编号绿色标记显示注释位置；退出即隐藏。'],
 ['仅在当前产品及相符页面、文件上下文显示绿色标记。','仅在标注状态中按当前产品及相符页面、文件上下文显示绿色标记。'],
 ['范围和编号标记采用绿色，只显示符合当前注释列表筛选且属于当前页面、文档、浮层的记录。','范围和编号标记采用绿色，进入标注状态后才显示符合当前搜索和注释列表筛选且属于当前页面、文档、浮层的记录，退出标注后隐藏。'],
]
const paginationIds=new Set(['REQ-W1-03','REQ-W1-04','REQ-W2-04','REQ-W3-02'])
const paginationRules=[
 '科研工作台快速访问、最近浏览、我的收藏均首批20条，每次加载更多追加20条；先对完整结果按各Tab原规则排序，再分批显示。无剩余结果时隐藏按钮，不同时提供页码和每页条数切换。',
 '切换Tab、改变排序或离开后重新进入均回到首批；追加保留已显示条目，混合文件夹与文档不重复遗漏，移除记录后按当前完整结果取前缀。',
 '仅统一加载方式，保留三Tab各自字段、排序、内容及操作差异；最近浏览的移除不扩展到其他Tab。个人空间、团队空间、回收站和智能阅读列表不变。',
]
const paginationReplacements:[string,string][]=[
 ['最近浏览默认展示20条，点击加载更多在原列表后追加20条；全部展示后隐藏按钮。其他列表分页不变。','科研工作台快速访问、最近浏览、我的收藏默认各展示20条，点击加载更多在原列表后追加20条；全部展示后隐藏按钮。空间、回收站和阅读列表分页不变。'],
 ['此变更仅最近浏览，其他科研列表及智能阅读分页不变。','此变更适用于科研工作台快速访问、最近浏览、我的收藏；空间、回收站及智能阅读分页不变。'],
 ['不再使用最近浏览页码及每页条数切换。','三个工作台Tab均不再使用页码及每页条数切换。'],
 ['完整排序后分页。','完整排序后按20条分批显示。'],
 ['改变排序后回到第一页；','改变排序后回到首批20条；'],
 ['排序改变或离开后重新进入最近浏览时重置为首批；','切换Tab、排序改变或离开后重新进入工作台时重置为首批；'],
]
function replace(text:string,pairs:[string,string][]) {return pairs.reduce((value,[from,to])=>value.split(from).join(to),text)}
function transformFeature(feature:PrdFeature,pairs:[string,string][]):PrdFeature {
 return {...feature,purpose:replace(feature.purpose,pairs),behavior:replace(feature.behavior,pairs),contract:replace(feature.contract,pairs),current:replace(feature.current,pairs),acceptance:feature.acceptance.map(text=>replace(text,pairs)),links:feature.links.map(link=>({...link,label:replace(link.label,pairs)})),rules:feature.rules?.map(group=>({...group,items:group.items.map(text=>replace(text,pairs))}))}
}
function addRules(feature:PrdFeature,items:string[]):PrdFeature {
 // Preserve custom additions even if they use this release's rule-group title.
 const groups=feature.rules??[],existing=groups.filter(g=>g.title===groupTitle).flatMap(g=>g.items)
 return {...feature,rules:[...groups.filter(g=>g.title!==groupTitle),{title:groupTitle,items:[...new Set([...existing,...items])]}]}
}
export function applyBrowser16Areas(areas:PrdArea[],product:Product):PrdArea[] {
 const prefix=product==='research'?'REQ':'READ'
 return areas.map(area=>{
  const layout=area.id==='annotation-collaboration'?replace(area.layout,replacements):product==='research'&&area.id==='workbench'?area.layout.replace('底部显示分页。','底部按当前Tab提供加载更多。'):area.layout
  return {...area,layout,features:area.features.map(feature=>{
   const suffix=feature.id.startsWith(`${prefix}-COLLAB-`)?feature.id.slice(`${prefix}-COLLAB-`.length):''
   if(suffix){const next=transformFeature(feature,replacements);return updates[suffix]?addRules(next,updates[suffix]):next}
   if(product==='research'&&paginationIds.has(feature.id))return addRules(transformFeature(feature,paginationReplacements),paginationRules)
   return feature
  })}
 })
}
export function upgradeBrowser16Book<T extends PrdBook>(book:T,product:Product):T {
 if(book.imports?.includes(browser16Revision))return book
 const next=structuredClone(book),version=next.revisions.find(v=>v.id===next.current)
 if(!version)throw Error('找不到当前PRD版本，未执行浏览器批注升级。')
 const before=new Map(version.areas.flatMap(a=>a.features).map(f=>[f.id,structuredClone(f)]))
 version.areas=applyBrowser16Areas(version.areas,product)
 for(const area of version.areas)for(const feature of area.features){const prior=before.get(feature.id);if(JSON.stringify(prior)!==JSON.stringify(feature))version.changes.push({id:crypto.randomUUID(),at:new Date().toISOString(),area:area.id,reason:'已确认浏览器16条批注：工作台三Tab加载更多、侧栏筛选和底部工具、标注状态与完整三态展示。',before:prior,after:structuredClone(feature)})}
 next.imports=[...(next.imports??[]),browser16Revision]
 return next
}
