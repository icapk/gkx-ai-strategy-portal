import type { Annotation, AnnotationContext, AnnotationInput, AnnotationPatch, Product } from './model.ts'
import {nextAnnotationUpdate} from './model.ts'
import {parseAnnotationFile,validAnnotation} from './importExport.ts'
import {resolveLinks} from './relations.ts'
export const annotationKey=(product:Product)=>`prototype-annotations-${product}-v1`
export const annotationEvent='prototype-annotations-changed'
export interface AnnotationSnapshot {items:Annotation[];raw:string|null;error:string}
export function readAnnotations(product:Product,storage:Pick<Storage,'getItem'>=localStorage):AnnotationSnapshot {
 try {const raw=storage.getItem(annotationKey(product));return {items:raw?parseAnnotationFile(raw,product).items:[],raw,error:''}}
 catch(error){return {items:[],raw:null,error:error instanceof Error?error.message:'注释记录无法读取；原数据已保留。'}}
}
export function writeAnnotations(product:Product,version:string,items:Annotation[],expectedRaw:string|null,storage:Pick<Storage,'getItem'|'setItem'>=localStorage):string {
 if(storage.getItem(annotationKey(product))!==expectedRaw)throw Error('另一窗口已更新注释，草稿已保留，请核对后重试。')
 if(!items.every(a=>validAnnotation(a,product)))throw Error('注释内容无效，未保存。')
 const raw=JSON.stringify({schema:1,product,version,items})
 storage.setItem(annotationKey(product),raw)
 return raw
}
export function createAnnotation(product:Product,context:AnnotationContext,items:Annotation[],input:AnnotationInput,now=new Date().toISOString()):Annotation {
 const item:Annotation={...structuredClone(input),id:crypto.randomUUID(),number:Math.max(0,...items.map(a=>a.number))+1,product,version:context.version,status:'AI 待做',source:input.source??'我的注释',createdAt:now,updatedAt:now,linkedG:structuredClone(input.linkedG??[]),linkedD:structuredClone(input.linkedD??[])}
 item.initialRange=structuredClone(input.range??{target:{product},regions:[]})
 Object.assign(item,resolveLinks(item,context))
 return item
}
export function updateAnnotation(item:Annotation,patch:AnnotationPatch,context:AnnotationContext,now=new Date().toISOString()):Annotation {
 const next={...structuredClone(item),...structuredClone(patch),updatedAt:nextAnnotationUpdate(item.updatedAt,now)}
 if(Object.prototype.hasOwnProperty.call(patch,'range')&&!next.initialRange)next.initialRange=structuredClone(item.range??{target:{product:item.product},regions:[]})
 if(patch.status && patch.status!=='已完结')delete next.completedAt
 if(patch.status==='已完结'&&item.status!=='已完结')next.completedAt=next.updatedAt
 const changed=(before:string[],after:string[]|undefined)=>after!==undefined&&(new Set(before).size!==new Set(after).size||after.some(id=>!before.includes(id)))
 if((changed(item.directG,patch.directG)||changed(item.directD,patch.directD))&&patch.linkedG===undefined&&patch.linkedD===undefined){next.linkedG=[];next.linkedD=[]}
 Object.assign(next,resolveLinks(next,context))
 return next
}
