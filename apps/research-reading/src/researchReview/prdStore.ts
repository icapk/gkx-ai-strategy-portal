import { legacyPrdAreas, prdAreas, type PrdArea, type PrdFeature } from './prd'
export interface PrdChange { id:string; at:string; reason:string; area:string; before?:PrdFeature; after?:PrdFeature }
export interface PrdRevision { id:string; name:string; plan:string; at:string; areas:PrdArea[]; changes:PrdChange[] }
export interface PrdBook { schema:1; current:string; revisions:PrdRevision[]; imports?:string[] }
export const PRD_KEY='research-prd-book-v2'
export const cloneAreas=(areas:PrdArea[])=>structuredClone(areas)
export function initialPrdBook():PrdBook {
 return {schema:1,current:'v2',revisions:[
  {id:'v1',name:'v1.0 原稿',plan:'历史设计基线 · 18个主题',at:'2026-09-17',areas:cloneAreas(legacyPrdAreas),changes:[]},
  {id:'v2',name:'v2.0 细化评审稿',plan:'本轮：功能细分、优先级、关联、版本与框选校正；优先级为建议值',at:new Date().toISOString(),areas:cloneAreas(prdAreas),changes:[]},
 ]}
}
export function loadPrdBook():{book:PrdBook;error:string} {
 try {
  const raw=localStorage.getItem(PRD_KEY)
  if(!raw)return {book:initialPrdBook(),error:''}
  const book=JSON.parse(raw) as PrdBook
  if(book.schema!==1||!Array.isArray(book.revisions)||!book.revisions.some(v=>v.id===book.current)||book.revisions.some(v=>!Array.isArray(v.areas)||!Array.isArray(v.changes)||v.areas.some(a=>!Array.isArray(a.features)||a.features.some(f=>!f.id||!f.title||!Array.isArray(f.links)||!Array.isArray(f.acceptance)))))throw Error()
  return {book,error:''}
 }catch{return {book:initialPrdBook(),error:'PRD本地记录无法读取，已展示内置基线；未覆盖原记录。'}}
}
export function reviseFeature(book:PrdBook,area:string,before:PrdFeature|undefined,after:PrdFeature|undefined,reason:string):PrdBook {
 const next=structuredClone(book), revision=next.revisions.find(v=>v.id===next.current)!
 const target=revision.areas.find(a=>a.id===area)!
 if(before)target.features=target.features.filter(f=>f.id!==before.id)
 if(after){const index=before?book.revisions.find(v=>v.id===book.current)!.areas.find(a=>a.id===area)!.features.findIndex(f=>f.id===before.id):target.features.length;target.features.splice(index,0,after)}
 revision.changes.push({id:crypto.randomUUID(),at:new Date().toISOString(),reason,area,before,after})
 return next
}
export function comparePrd(before:PrdArea[],after:PrdArea[]) {
 const left=new Map(before.flatMap(a=>a.features).map(f=>[f.id,f])),right=new Map(after.flatMap(a=>a.features).map(f=>[f.id,f]))
 return [...new Set([...left.keys(),...right.keys()])].flatMap(id=>JSON.stringify(left.get(id))===JSON.stringify(right.get(id))?[]:[{id,before:left.get(id),after:right.get(id)}])
}
