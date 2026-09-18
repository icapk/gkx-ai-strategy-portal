import type {ReadingBook} from './prdBook'
import type {PrdArea} from '../researchReview/prd'
export const readingSeedRevision='reading-prd-20260917-final'
// Upgrade only the exact pre-release fields, never a user's edited rules or links.
export function migrateReadingBook(book:ReadingBook,catalog:PrdArea[]):ReadingBook {
 if(book.imports?.includes(readingSeedRevision))return book
 const next=structuredClone(book),version=next.revisions.find(v=>v.id===next.current)!
 const oldRules=[{title:'字段与展示',items:['下载指向原文件；移除作用于所选文献，不是删除当前目录。']},{title:'操作与边界',items:['移除前明确确认，取消不变更；不能宣称存在阅读回收站。','有真实原件时才可下载；文件不可用显示错误，不生成伪造PDF。']}]
 for(const area of version.areas)for(const f of area.features){
  const seed=catalog.flatMap(a=>a.features).find(s=>s.id===f.id);if(!seed)continue
  const before=structuredClone(f)
  if(f.id==='READ-LIB-06'&&JSON.stringify(f.rules)===JSON.stringify(oldRules))f.rules=structuredClone(seed.rules)
  if(['READ-REV-02','READ-REV-03','READ-REV-04'].includes(f.id)&&f.links.length===1&&f.links[0].id==='READ-review')f.links=structuredClone(seed.links)
  if(JSON.stringify(before)!==JSON.stringify(f))version.changes.push({id:crypto.randomUUID(),at:new Date().toISOString(),reason:'本轮阅读PRD校核：明确文献移除范围和独立评审入口；只升级未改动的预发布字段。',area:area.id,before,after:structuredClone(f)})
 }
 next.imports=[...(next.imports??[]),readingSeedRevision]
 return next
}
