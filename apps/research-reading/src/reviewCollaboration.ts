import type { PrdArea, PrdFeature } from './researchReview/prd'
import type { PrdBook } from './researchReview/prdStore'

export const collaborationRevision='annotations-local-20260919'
type Product='research'|'reading'
const definitions:[string,string,string[]][]=[
 ['模式与注释列表','list',[
  '合规审查、PRD、注释为三个并列模式，两产品同类交互一致，数据各自独立；模式可从URL恢复，保留未保存输入的离开保护。',
  '注释按最近更新时间倒序显示，同时间按稳定编号排序。筛选处理状态、来源、日期；日期采用上海时区的创建日或最近更新日，没有注释的日期不显示。关联状态单独展示，不增加关联状态筛选。']],
 ['着重讲解与设计进度','progress',[
  '着重讲解为独立的是/否字段；设计进度为待讨论、待完善、已完成。旧数据缺字段显示否、待讨论，不批量改写历史。',
  '方案已定但需调整时退回待完善；方案需要重议时退回待讨论。修改沿用PRD保存、冲突保护及历史，注释状态不自动改变设计进度或合规判定。']],
 ['三入口创建注释','create',[
  '从注释模式框选、合规详情、PRD详情创建同一种注释。填写标题与正文，来源默认我的注释，处理状态默认AI待做。',
  '从功能详情创建时直接绑定该功能并沿用当时范围；无另一端或无定位范围也可保存并提示。原型框选结束后推荐可更正的候选，没有可靠候选按未关联保存。取消或Esc不保存。']],
 ['功能点关联与一层补绑','relations',[
  '合规点G与设计点D为多对多关系。注释分别保存直接绑定和自动补绑对象，仅从直接绑定对象向另一端扩一层，不把补绑结果继续当起点。',
  '直接对象新增关系后补齐新增另一端；关系减少不静默删除历史关联。功能点失效时保留引用和提示，但不计为有效关联。至少一个有效G或D为已关联，两端均无有效对象为未关联。']],
 ['框选快照、红点与定位','location',[
  '注释自己的手动范围优先，否则复制入口对象当时范围；后续功能框选校正不自动改变旧注释。编号红点点击显示范围与正文，允许主动重新定位。',
  '仅在当前产品及相符页面、文件上下文显示红点。滚动和窗口改变后重算位置，目标缺失说明原因，不套用其他文件或功能最新范围。',
  '候选仅由当前可见区域进行本地几何匹配，不调用模型。唯一高可信结果可预选，多候选由用户确认；没有匹配不阻止保存。']],
 ['注释处理与人工审核','workflow',[
  '处理状态仅AI待做、待审核、已完结。用户在页面外安排AI先理解并复述，确认后同时改PRD与原型，完成后在当前验收浏览器把对应条目改为待审核。',
  '审核通过进入已完结，审核不通过补充正文并退回AI待做。已完结为终态，不新增重开。采纳、撤回、决定不修改等结论只写正文，不增加态度字段或其他状态。',
  '页面不连接实时模型；注释浏览器存储不等于跨浏览器共享，不能通过导入文件回传同ID注释的处理状态。']],
 ['关联注释与修订记录','history',[
  '合规和PRD功能详情列出未完结关联注释及已完结修订记录；未关联注释仍保留在注释列表。',
  '修订区块默认整体折叠，按完结时间排列、显示第几次修订、注释标题及日期；展开读正文，点击标题到注释详情，再由关联链接返回功能点。',
  '完结表示意见处理结束，不保证发生代码修改；不另设修订列表页，不改变原有PRD修改历史。']],
 ['注释文件导入导出','exchange',[
  '注释保存稳定主键，按产品分区存于浏览器。导出文件用于交换，导入来源统一日常协作，不保留原评审来源。',
  '新ID导入为新条目，显示编号冲突时重新分配但保留ID。同ID每次只在原正文后追加导入正文、改来源和更新时间；标题、处理状态、范围、关联等业务字段保留本地。重复导入相同正文仍追加。',
  '产品不符拒绝导入；版本不符提示取消或继续，继续不自动修复坐标。文件损坏、存储不足或保存失败不覆盖已有数据，输入保留并显示失败。']],
]
export function collaborationArea(product:Product):PrdArea {
 return {id:'annotation-collaboration',title:'注释与评审协作',purpose:'在原型中记录修改建议，关联设计与合规功能点，配合页面外AI任务及人工审核。',layout:'左侧模式选择进入注释；列表筛选、详情和创建共用侧栏，原型内容区通过编号红点显示注释位置。',features:definitions.map(([title,target,items],i):PrdFeature=>({id:`${product==='reading'?'READ':'REQ'}-COLLAB-${String(i+1).padStart(2,'0')}`,title,priority:i===3||i===5||i===7?'P0':'P1',release:'第二轮本地协作改造',emphasis:false,designProgress:'待讨论',purpose:items[0],behavior:items.join(' '),contract:'',current:'',acceptance:[],rules:[{title,items}],compliance:[],links:[{id:`${product==='reading'?'READ':'REVIEW'}-annotation-${target}`,label:title}]}))}
}
export function applyCollaborationAreas(areas:PrdArea[],product:Product):PrdArea[] {
 const result=areas.map(a=>a.id==='review'?{...a,layout:a.layout.replace('合规审查、PRD两种模式','合规审查、PRD、注释三种模式'),features:a.features.map(f=>{
  if(f.id!=='READ-REV-01')return f
  const transform=(text:string)=>text.replace('侧边栏仅包含合规审查模式与 PRD 模式','侧边栏包含合规审查模式、PRD 模式与注释模式')
  return {...f,behavior:transform(f.behavior),rules:f.rules?.map(g=>({...g,items:g.items.map(transform)}))}
 })}:a)
 return result.some(a=>a.id==='annotation-collaboration')?result:[...result,collaborationArea(product)]
}
export function upgradeCollaborationBook<T extends PrdBook>(book:T,product:Product):T {
 if(book.imports?.includes(collaborationRevision))return book
 const next=structuredClone(book),revision=next.revisions.find(v=>v.id===next.current)!
 const before=new Map(revision.areas.flatMap(a=>a.features).map(f=>[f.id,structuredClone(f)]))
 revision.areas=applyCollaborationAreas(revision.areas,product)
 for(const area of revision.areas)for(const feature of area.features){const prior=before.get(feature.id);if(JSON.stringify(prior)!==JSON.stringify(feature))revision.changes.push({id:crypto.randomUUID(),at:new Date().toISOString(),area:area.id,reason:'第二轮已确认注释协作设计：新增三模式、关联和人工审核规则；保留既有业务及历史。',before:prior,after:structuredClone(feature)})}
 next.imports=[...(next.imports??[]),collaborationRevision]
 return next
}
