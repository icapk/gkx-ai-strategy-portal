import type {PrdArea} from './researchReview/prd'
import type {PrdBook} from './researchReview/prdStore'
const menuRule='文件和文件夹更多菜单按可用空间展示完整单行操作名称，加入快速访问、取消快速访问不拆字换行；菜单不越出窗口，窄屏仍可点选。'
const timeRule='所有面向用户的完整时间统一按上海时间展示到分钟（YYYY-MM-DD HH:mm），包括列表、详情、注释、版本历史和悬浮提示；只显示日期的标签仍可保留。底层保留原时间精度用于并发保护和历史，不截断已有记录。'
const sizeRule='文件大小统一使用 MB、保留两位小数；非零且小于0.01 MB显示“<0.01 MB”，未知大小显示“-”，真实零字节显示“0.00 MB”。上传文件以原件字节为依据，在线文档和表格以已保存内容估算；旧零值占位不掩盖实际内容。文件夹在工作台、收藏、个人和团队空间的文档大小列统一显示“-”，不展示容量合计。'
const shareRule='文件与文件夹分享的目标选择分为个人空间、团队空间两组。个人目录按层级缩进；团队按名称分组，可展开或收起根目录和子文件夹。分组标题不可作为目录选中；选中项及完整路径提示明确空间归属。仅列出当前角色可操作的目标，保留原有移动、重名与权限校验。'
export function applyAnnotationFixAreas(areas:PrdArea[]):PrdArea[] {
  return areas.map(a=>({...a,features:a.features.map(f=>{
    const items:string[]=[]
    if(/^(REQ-W[123]-|REQ-P1-01|REQ-T2-)/.test(f.id))items.push(menuRule)
    if(/^(REQ-W[123]-|REQ-P1-01|REQ-P2-0[23]|REQ-P6-01|REQ-T2-)/.test(f.id))items.push(sizeRule)
    if(f.id==='REQ-T2-02')items.push(shareRule)
    if(/^(REQ-W|REQ-P1-01|REQ-P4-07|REQ-P5-0[234]|REQ-P6-01|REQ-B1-01|REQ-COLLAB-0[167])/.test(f.id))items.push(timeRule)
    const rewrite=(text:string)=>text.replace(/文件夹显示有权统计的子内容合计；无法完整统计时显示“—”，不以部分合计伪装完整大小。/g,'文件夹的文档大小列统一显示“-”，不展示容量合计。')
    return {...f,rules:[...(f.rules??[]).filter(r=>r.title!=='2026-09-20 注释确认规则').map(r=>({...r,items:r.items.map(rewrite)})),...(items.length?[{title:'2026-09-20 注释确认规则',items}]:[])]}
  })}))
}
export function upgradeAnnotationFixBook<T extends PrdBook>(book:T):T {
  const marker='research-annotation-four-fixes-20260920'
  if(book.imports?.includes(marker))return book
  const next=structuredClone(book),v=next.revisions.find(v=>v.id===next.current)
  if(!v)throw Error('当前PRD版本不存在')
  const before=new Map(v.areas.flatMap(a=>a.features).map(f=>[f.id,structuredClone(f)]))
  v.areas=applyAnnotationFixAreas(v.areas)
  for(const a of v.areas)for(const f of a.features){const old=before.get(f.id);if(JSON.stringify(old)!==JSON.stringify(f))v.changes.push({id:crypto.randomUUID(),at:new Date().toISOString(),area:a.id,reason:'用户确认四条科研注释：菜单单行、分钟时间、分享目标分组、文件大小与文件夹占位。',before:old,after:structuredClone(f)})}
  next.imports=[...(next.imports??[]),marker];return next
}
