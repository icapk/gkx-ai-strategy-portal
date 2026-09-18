import { prdAreas, legacyPrdAreas, type PrdFeature } from './prd'
import { authoredRules, splitRuleText } from './prdRules'
import type { PrdBook, PrdRevision } from './prdStore'

const baseline=new Map(prdAreas.flatMap(a=>a.features).map(f=>[f.id,f]))
export function structureFeature(feature:PrdFeature):PrdFeature {
 if(feature.rules)return structuredClone(feature)
 const base=baseline.get(feature.id)
 const rules=authoredRules(feature.id)??[{title:'功能规则',items:splitRuleText(feature.behavior)}]
 if(base&&base.behavior!==feature.behavior&&feature.behavior.trim())rules.push({title:'已有编辑补充',items:splitRuleText(feature.behavior)})
 return {...structuredClone(feature),rules}
}
export function upgradeBook(source:PrdBook):PrdBook {
 if(source.revisions.some(v=>v.id==='v3-rules'))return source
 const book=structuredClone(source),previous=book.revisions.find(v=>v.id===book.current)!
 const revision:PrdRevision={...structuredClone(previous),id:'v3-rules',name:'v3.0 逐项规则稿',plan:'按字段与操作逐条说明规则；保留原版本和既有修改。',at:new Date().toISOString(),changes:[],areas:previous.areas.map(a=>({...a,features:a.features.map(structureFeature)}))}
 book.revisions.push(revision);book.current=revision.id
 return book
}
export function hasLocalEdits(book:PrdBook):boolean {
 const revision=book.revisions.find(v=>v.id===book.current)!
 if(book.current==='v1'&&!book.revisions.some(v=>v.changes.length>0))return JSON.stringify(revision.areas)!==JSON.stringify(legacyPrdAreas)
 return book.revisions.some(v=>v.changes.length>0)||!['v1','v2','v3-rules'].includes(book.current)||JSON.stringify(revision.areas.flatMap(a=>a.features).map(f=>[f.id,f.title,f.behavior,f.priority]))!==JSON.stringify(prdAreas.flatMap(a=>a.features).map(f=>[f.id,f.title,f.behavior,f.priority]))
}
// Archive the complete source first. Only non-conflicting feature edits enter the shared current version.
export function importBrowserBook(shared:PrdBook,local:PrdBook,hash:string):{book:PrdBook;conflicts:number} {
 if(shared.imports?.includes(hash))return {book:shared,conflicts:0}
 const next=structuredClone(shared),source=local.revisions.find(v=>v.id===local.current)!
 next.imports=[...(next.imports??[]),hash]
 next.revisions.push(...local.revisions.map(v=>({...structuredClone(v),id:`browser-${hash}-${v.id}`,name:`浏览器备份 · ${v.name}`})))
 const current=next.revisions.find(v=>v.id===next.current)!
 const incoming=source.areas.flatMap(a=>a.features)
 const ids=new Set([...baseline.keys(),...incoming.map(f=>f.id)])
 let conflicts=0
 for(const id of ids){
  const original=baseline.get(id),candidate=incoming.find(f=>f.id===id)
  if(JSON.stringify(original)===JSON.stringify(candidate))continue
  const area=current.areas.find(a=>a.features.some(f=>f.id===id))??current.areas.find(a=>source.areas.find(s=>s.id===a.id)?.features.some(f=>f.id===id))
  if(!area)continue
  const before=area.features.find(f=>f.id===id),after=candidate?structureFeature(candidate):undefined
  if(JSON.stringify(before)===JSON.stringify(after))continue
  if(current.changes.some(c=>c.before?.id===id||c.after?.id===id)){conflicts++;continue}
  const index=area.features.findIndex(f=>f.id===id)
  area.features=area.features.filter(f=>f.id!==id)
  if(after)area.features.splice(index<0?area.features.length:index,0,after)
  current.changes.push({id:crypto.randomUUID(),at:new Date().toISOString(),area:area.id,before,after,reason:'迁移此浏览器的既有PRD修改'})
 }
 return {book:next,conflicts}
}
