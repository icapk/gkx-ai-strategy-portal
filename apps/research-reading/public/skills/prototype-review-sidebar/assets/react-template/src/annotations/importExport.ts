import {annotationSources,annotationStatuses,nextAnnotationUpdate,type Annotation,type AnnotationContext,type AnnotationFile,type Product} from './model.ts'
import {resolveLinks} from './relations.ts'
const strings=(x:unknown):x is string[]=>Array.isArray(x)&&x.every(v=>typeof v==='string')
const date=(x:unknown)=>typeof x==='string'&&Number.isFinite(Date.parse(x))
const object=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x)
const only=(x:Record<string,unknown>,keys:string[])=>Object.keys(x).every(key=>keys.includes(key))
const optionalString=(x:unknown,nullable=false)=>x===undefined||typeof x==='string'||nullable&&x===null
const optionalId=(x:unknown)=>x===undefined||x===null||typeof x==='number'&&Number.isSafeInteger(x)&&x>0
const oneOf=(x:unknown,values:unknown[])=>values.includes(x)
export function validAnnotationRestore(value:unknown,product:Product):boolean {
 if(!object(value)||value.schema!==1||value.product!==product||!optionalId(value.documentId))return false
 if(product==='reading'){
  if(!only(value,['schema','product','view','documentId','libraryTab','folder','left','right','library','uploadFolderOpen'])||!oneOf(value.view,['library','upload','reader'])||!optionalString(value.libraryTab)||!optionalString(value.folder)||!oneOf(value.left,[undefined,'outline'])||!oneOf(value.right,[undefined,'notes','figures','references','metadata','graph'])||value.uploadFolderOpen!==undefined&&typeof value.uploadFolderOpen!=='boolean')return false
  if(value.library!==undefined){const library=value.library;if(!object(library)||!only(library,['section','search','page','pageSize'])||!oneOf(library.section,['all','recent','favorites'])||typeof library.search!=='string'||typeof library.page!=='number'||!Number.isSafeInteger(library.page)||library.page<1||typeof library.pageSize!=='number'||!Number.isSafeInteger(library.pageSize)||library.pageSize<1)return false}
  return true
 }
 if(!only(value,['schema','product','section','tab','teamTab','team','folder','documentId','surface','modal','share'])||!oneOf(value.section,['workbench','personal','team','recycle'])||!oneOf(value.tab,['quick','recent','favorites','owned','shared'])||!oneOf(value.teamTab,[undefined,'todo','comments','members'])||!optionalString(value.team,true)||!optionalString(value.folder,true)||!oneOf(value.surface,['workspace','editor','pdf','table','preview','table-hub'])||!oneOf(value.modal,[undefined,null,'search','pdf-import','members','new-folder','new-document','import-document','new-team','invite-member','add-todo','profile-settings','note-detail','note-editor']))return false
 if(value.share!==undefined){const share=value.share;if(!object(share)||!only(share,['kind','id','scope','targetPath','expanded'])||!oneOf(share.kind,['file','folder'])||typeof share.id!=='number'||!Number.isSafeInteger(share.id)||share.id<=0||!oneOf(share.scope,[undefined,'personal','team'])||typeof share.targetPath!=='string'||typeof share.expanded!=='boolean')return false}
 return true
}
export function validAnnotation(value:unknown,product:Product):value is Annotation {
 if(!value||typeof value!=='object')return false
 const a=value as Annotation
 if(!a.id||typeof a.id!=='string'||a.product!==product||typeof a.version!=='string'||!Number.isSafeInteger(a.number)||a.number<1)return false
 if(typeof a.title!=='string'||!a.title.trim()||typeof a.body!=='string'||!a.body.trim()||!annotationStatuses.includes(a.status)||!annotationSources.includes(a.source))return false
 if(!['prototype','compliance','prd'].includes(a.entry)||!date(a.createdAt)||!date(a.updatedAt)||(a.completedAt!==undefined&&!date(a.completedAt)))return false
 if(a.status==='已完结'&&!a.completedAt)return false
 if(![a.directG,a.directD,a.linkedG,a.linkedD].every(strings))return false
 if(a.excludedG!==undefined&&!strings(a.excludedG)||a.excludedD!==undefined&&!strings(a.excludedD))return false
 if(a.directG.some(id=>a.excludedG?.includes(id))||a.directD.some(id=>a.excludedD?.includes(id)))return false
 for(const range of [a.range,a.initialRange]){
  if(!range)continue
  if(range.target?.product!==product||!Array.isArray(range.regions)||range.prepare!==undefined&&!strings(range.prepare))return false
  if(range.pageContext!==undefined&&typeof range.pageContext!=='string')return false
  if(range.restore!==undefined&&!validAnnotationRestore(range.restore,product))return false
  if(range.regions.some(r=>!r||typeof r.selector!=='string'||typeof r.label!=='string'||![r.x,r.y,r.width,r.height].every(Number.isFinite)||r.width<=0||r.height<=0||r.x<0||r.y<0||r.x+r.width>1.000001||r.y+r.height>1.000001))return false
 }
 return true
}
export function parseAnnotationFile(text:string,product:Product):AnnotationFile {
 let value:AnnotationFile
 try{value=JSON.parse(text)}catch{throw Error('注释文件不是有效 JSON，未修改本地记录。')}
 if(value?.product!==product)throw Error('产品不匹配，请在对应产品中导入，未修改本地记录。')
 if(value.schema!==1||typeof value.version!=='string'||!Array.isArray(value.items)||!value.items.every(a=>validAnnotation(a,product)))throw Error('注释文件格式无效，未修改本地记录。')
 if(new Set(value.items.map(a=>a.id)).size!==value.items.length)throw Error('文件包含重复注释 ID，未修改本地记录。')
 return value
}
export function mergeAnnotationFile(items:Annotation[],incoming:AnnotationFile,context:AnnotationContext,now:string):Annotation[] {
 const result=structuredClone(items)
 let nextNumber=Math.max(0,...result.map(a=>a.number))+1
 for(const imported of incoming.items){
  const existing=result.find(a=>a.id===imported.id)
  if(existing){existing.body+='\n\n'+imported.body;existing.source='日常协作';existing.updatedAt=nextAnnotationUpdate(existing.updatedAt,now)}
  else {const added=structuredClone(imported);if(result.some(a=>a.number===added.number))added.number=nextNumber++;else nextNumber=Math.max(nextNumber,added.number+1);added.source='日常协作';Object.assign(added,resolveLinks(added,context));result.push(added)}
 }
 return result
}
