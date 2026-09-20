import type {PrdArea,PrdFeature} from './researchReview/prd'
import type {PrdBook} from './researchReview/prdStore'

export const adjustmentsOneRevision='adjustments-one-20260920'
const updates:Record<string,string[]>={
 '01':['三模式卡片采用统一边距、边框、标题、标签和操作区，以合规卡片为基准。注释模式保留清晰内边距。合规动作称为重命名。','注释卡片显示状态、来源、最近更新日和关联状态；状态及来源可快捷修改，关联项打开关联编辑，日期只读。已完结不重开。'],
 '02':['PRD按完整版本的功能分组显示简洁层级编号，内部稳定ID保持，筛选不重排编号。优先级、着重讲解和设计进度在顶部两列排列并组合过滤。','版本选择、版本与改动记录、创建大版本及统一导出PRD放侧栏底部；导出Markdown与导出PRD合并，字数由悬浮或键盘聚焦提示。演示资料管理在三模式公共底部，管理当前产品。'],
 '03':['原型框选不再计算或推荐疑似关联，不自动预选功能点；用户自行选G/D或保存为未关联。功能详情入口仍直接关联入口对象。','标注状态提供操作页面、绘制范围两种工具，保存后继续绘制可连续新建。Esc先取消拖画或处理编辑草稿，空闲时退出；退出有草稿须确认。'],
 '04':['关联选择为顶部编号/名称搜索及合规、PRD两组多选，显示手选和自动关联来源。仅直接选择扩展一层。','取消G1时若G2仍支持D1则保留G2与D1；直接取消D1时移除D1及导致它被补齐的直接G选择，其他独立选择保持，不递归清空整组。仅当前注释变更，不修改全局映射。','用户明确取消的对象不因刷新或自动补齐复活。普通正文编辑保留历史关联；全局关系减少不静默清除其他注释。'],
 '05':['范围和编号标记采用绿色，只显示符合当前注释列表筛选且属于当前页面、文档、浮层的记录。列表和标记使用同一结果集。','框选时保留分享等弹窗和下拉的展开状态。快照记录页面、对象和受支持的浮层状态，定位先恢复对应界面，再定位保存范围，不执行分享、移动或其他提交。','对象失效、权限不足或业务输入未处理时提示，不打开替代文件。旧快照无恢复信息时仍按原上下文定位；不会随功能点的最新框选变化。'],
 '08':['注释导入、导出入口统一放在侧栏底部；文件格式兼容旧记录与新增的恢复信息。同ID导入继续仅追加正文、改来源和更新时间，不回传范围、关联或状态。'],
}
const replacements:[string,string][]=[
 ['原型框选结束后推荐可更正的候选，没有可靠候选按未关联保存。取消或Esc不保存。','原型框选不识别候选，关联由用户手动选择或保持未关联；取消不保存。'],
 ['候选仅由当前可见区域进行本地几何匹配，不调用模型。唯一高可信结果可预选，多候选由用户确认；没有匹配不阻止保存。','框选位置不用于判定功能关联，不调用模型或几何候选算法。'],
 ['编号红点','编号绿色标记'],['显示红点','显示绿色标记'],['框选快照、红点与定位','框选快照、绿色标记与定位'],
]
function transform(text:string){return replacements.reduce((value,[from,to])=>value.split(from).join(to),text)}
export function applyAdjustmentsOneAreas(areas:PrdArea[],product:'research'|'reading'):PrdArea[]{
 return areas.map(area=>({...area,layout:transform(area.layout),features:area.features.map(original=>{
   const suffix=original.id.match(/^(?:REQ|READ)-COLLAB-(\d+)$/)?.[1]
   if(suffix){const f={...original,title:transform(original.title),purpose:transform(original.purpose),behavior:transform(original.behavior),links:original.links.map(link=>({...link,label:transform(link.label)})),rules:original.rules?.map(g=>({...g,title:transform(g.title),items:g.items.map(transform)}))};if(updates[suffix])f.rules=[...(f.rules??[]).filter(g=>g.title!=='调整建议1：已确认规则'),{title:'调整建议1：已确认规则',items:updates[suffix]}];return f}
   if(product==='research'&&original.id==='REQ-W1-04')return {...original,behavior:'最近浏览默认展示20条，点击加载更多在原列表后追加20条；全部展示后隐藏按钮。其他列表分页不变。',current:'已确认采用加载更多，不再使用最近浏览页码及每页条数切换。',rules:[{title:'加载更多',items:['完整排序后展示首批20条；不足或恰好20条且无剩余数据时不显示加载更多。','每次点击追加20条，已显示结果保持，全部加载后隐藏按钮。','排序改变或离开后重新进入最近浏览时重置为首批；移除记录不重复或漏项。','此变更仅最近浏览，其他科研列表及智能阅读分页不变。']}]}
   return original
 })}))
}
export function upgradeAdjustmentsOneBook<T extends PrdBook>(book:T,product:'research'|'reading'):T{
 if(book.imports?.includes(adjustmentsOneRevision))return book
 const next=structuredClone(book),version=next.revisions.find(v=>v.id===next.current)!
 const before=new Map(version.areas.flatMap(a=>a.features).map(f=>[f.id,structuredClone(f)]))
 version.areas=applyAdjustmentsOneAreas(version.areas,product)
 for(const area of version.areas)for(const feature of area.features){const prior=before.get(feature.id) as PrdFeature|undefined;if(JSON.stringify(prior)!==JSON.stringify(feature))version.changes.push({id:crypto.randomUUID(),at:new Date().toISOString(),area:area.id,reason:'调整建议1：人工关联、持续标注、绿色标记、页面恢复与统一侧栏；科研最近浏览加载更多。',before:prior,after:structuredClone(feature)})}
 next.imports=[...(next.imports??[]),adjustmentsOneRevision]
 return next
}
