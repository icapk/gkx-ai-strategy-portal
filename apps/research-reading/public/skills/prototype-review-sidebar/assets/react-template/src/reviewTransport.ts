import {localStorage} from './storage.ts'
import {runtime,seedSnapshot} from './sidebar.config.ts'
import {validAnnotation,parseAnnotationFile} from './annotations/importExport.ts'
import {validReadingBook} from '../server/readingPrdValidation.mjs'
import type {Product} from './annotations/model.ts'

export const reviewKey=(product:Product,kind:'prd'|'annotations')=>kind==='prd'?`gkx-public-demo-prd:${product}-prd`:`gkx-public-demo-annotations:${product}`
export function validReview(value:any,product:Product,kind:'prd'|'annotations'):boolean {
 if(!value||!Number.isSafeInteger(value.revision)||value.revision<0)return false
 if(kind==='annotations'){
  if(value.schema!==1||value.product!==product||typeof value.version!=='string'||!Array.isArray(value.items)||!Array.isArray(value.trash))return false
  const all=[...value.items,...value.trash]
  return all.every(a=>validAnnotation(a,product))&&new Set(all.map(a=>a.id)).size===all.length&&new Set(all.map(a=>a.number)).size===all.length
 }
 if(value.book===null)return true
 if(product==='reading')return validReadingBook(value.book)
 const b=value.book
 return !!b&&b.schema===1&&typeof b.current==='string'&&Array.isArray(b.revisions)&&b.revisions.some((r:any)=>r.id===b.current)&&b.revisions.every((r:any)=>typeof r.id==='string'&&Array.isArray(r.changes)&&Array.isArray(r.areas)&&r.areas.every((a:any)=>Array.isArray(a.features)&&a.features.every((f:any)=>typeof f.id==='string'&&typeof f.title==='string'&&Array.isArray(f.links)&&Array.isArray(f.acceptance))))
}
export async function loadReviewSeed(product:Product,kind:'prd'|'annotations'){return structuredClone(seedSnapshot(product,kind))}
export async function withReviewLock<T>(product:Product,work:()=>Promise<T>):Promise<T>{
 if(!navigator.locks)throw Error('浏览器不支持安全保存，请使用最新版 Edge 或 Chrome')
 return navigator.locks.request(runtime.namespace+':review:'+product,work)
}
export async function reviewRequest(endpoint:string,init?:RequestInit):Promise<Response>{
 if(runtime.storageMode==='service')return globalThis.fetch(runtime.apiBase+endpoint,init)
 const match=/^\/api\/(?:annotations\/(research|reading)|(research|reading)-prd)$/.exec(endpoint)
 if(!match)throw Error('未知评审地址')
 const product=(match[1]||match[2]) as Product,kind=match[1]?'annotations':'prd',key=reviewKey(product,kind)
 try{return await withReviewLock(product,async()=>{
  const raw=localStorage.getItem(key);let current=raw===null?await loadReviewSeed(product,kind):JSON.parse(raw)
  if(!validReview(current,product,kind))throw Error('已保存记录格式异常，原数据已保留，请先备份')
  const method=init?.method||'GET'
  if(method==='GET'){if(raw===null)localStorage.setItem(key,JSON.stringify(current));return Response.json(current)}
  const body=JSON.parse(String(init?.body));let candidate
  if(method==='PUT'){
   if(body.expectedRevision!==current.revision)return Response.json(kind==='prd'?current:{error:'另一窗口已更新注释，请核对后重试',snapshot:current},{status:409})
   candidate=kind==='prd'?{revision:current.revision+1,book:body.book}:{...current,revision:current.revision+1,version:body.version,items:body.items,trash:body.trash}
   if(!validReview(candidate,product,kind))throw Error('记录格式无效，原数据未改变')
   if(kind==='annotations'){const ids=new Set([...candidate.items,...candidate.trash].map((a:any)=>a.id));if([...current.items,...current.trash].some((a:any)=>!ids.has(a.id)))throw Error('请移入已移除列表，不允许直接丢弃记录')}
  }else if(method==='POST'&&kind==='annotations'){
   const incoming=parseAnnotationFile(body.legacy,product),hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(body.legacy)))).map(v=>v.toString(16).padStart(2,'0')).join('')
   if((current.migrations||[]).includes(hash))return Response.json(current)
   candidate=structuredClone(current);let next=Math.max(0,...[...candidate.items,...candidate.trash].map((a:any)=>a.number))+1
   for(const item of incoming.items){if(candidate.trash.some((a:any)=>a.id===item.id))continue;const existing=candidate.items.find((a:any)=>a.id===item.id);if(existing&&JSON.stringify(existing)===JSON.stringify(item))continue;const copy=structuredClone(item);if(existing){copy.id=crypto.randomUUID();copy.title+='（迁移冲突副本）'}if([...candidate.items,...candidate.trash].some((a:any)=>a.number===copy.number))copy.number=next++;else next=Math.max(next,copy.number+1);candidate.items.push(copy)}
   candidate.migrations=[...(current.migrations||[]),hash];candidate.revision++;if(!validReview(candidate,product,kind))throw Error('迁移数据无效，原记录已保留')
  }else throw Error('不支持的保存操作')
  localStorage.setItem(key,JSON.stringify(candidate));return Response.json(candidate)
 })}catch(e){return Response.json({error:e instanceof Error?e.message:'保存失败，原记录已保留'},{status:503})}
}
