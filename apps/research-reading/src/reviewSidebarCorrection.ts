import type {PrdArea} from './researchReview/prd'
import type {PrdBook} from './researchReview/prdStore'
export const sidebarCorrectionRevision='sidebar-counts-correction-20260920'
const rules=[
 '三模式的筛选选项均显示实时数量：合规和PRD统计功能点，注释统计注释。计算某选项时替换该维度条件，保留其余筛选和搜索；功能区域参与联动，编号不随筛选变化。',
 '合规功能点、完整设计功能点和注释卡片均提供框选校正。面板顶部仅初始定位、定位校正、保存并定位三个操作；移除载入系统框选及恢复系统定位。',
 '初始定位打开原页面并显示最原始范围：功能点使用系统初始映射，注释使用创建时独立保存的初始快照。旧注释无初始快照时明确提示，以第一次校正前的已存范围为基线；原来无范围不伪造初始范围。初始定位不自动覆盖已保存校正。',
 '定位校正重新绘制一次并替换当前草稿范围；保留左边%、上边%、宽度%、高度%四项数值和逐框删除。保存并定位成功后应用范围，失败保留输入；删除全部并保存表示空范围，不自动恢复系统范围。',
]
export function applySidebarCorrectionAreas(areas:PrdArea[]):PrdArea[]{return areas.map(a=>({...a,features:a.features.map(f=>{
 if(!/-(COLLAB)-(01|02|05)$/.test(f.id))return f
 return {...f,rules:[...(f.rules??[]).filter(g=>g.title!=='筛选计数与统一框选校正'),{title:'筛选计数与统一框选校正',items:rules}]}
})}))}
export function upgradeSidebarCorrectionBook<T extends PrdBook>(book:T):T{
 if(book.imports?.includes(sidebarCorrectionRevision))return book
 const next=structuredClone(book),v=next.revisions.find(v=>v.id===next.current)
 if(!v)throw Error('当前版本不存在')
 const before=new Map(v.areas.flatMap(a=>a.features).map(f=>[f.id,structuredClone(f)]))
 v.areas=applySidebarCorrectionAreas(v.areas)
 for(const a of v.areas)for(const f of a.features){const prior=before.get(f.id);if(JSON.stringify(prior)!==JSON.stringify(f))v.changes.push({id:crypto.randomUUID(),at:new Date().toISOString(),area:a.id,reason:'确认三模式筛选联动计数及三类卡片统一框选校正。',before:prior,after:structuredClone(f)})}
 next.imports=[...(next.imports??[]),sidebarCorrectionRevision];return next
}
