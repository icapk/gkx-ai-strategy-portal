import {localStorage} from '../storage.ts'
import {reviewRequest as fetch} from '../reviewTransport.ts'
import {useEffect,useRef,useState} from 'react'
import type {Annotation,AnnotationContext,AnnotationInput,AnnotationPatch,Product} from './model.ts'
import {annotationKey,createAnnotation,updateAnnotation} from './store.ts'
import {mergeAnnotationFile,parseAnnotationFile} from './importExport.ts'
import {relationState,resolveLinks} from './relations.ts'
interface SharedSnapshot {schema:1;product:Product;version:string;revision:number;items:Annotation[];trash:Annotation[]}
const empty=(product:Product):SharedSnapshot=>({schema:1,product,version:'',revision:0,items:[],trash:[]})
export function useAnnotations(product:Product,context:AnnotationContext){
 const [snapshot,setSnapshot]=useState(()=>empty(product)),[error,setError]=useState(''),[ready,setReady]=useState(false),[busy,setBusy]=useState(false)
 const latest=useRef(snapshot),saving=useRef(false),generation=useRef(0),contextRef=useRef(context);contextRef.current=context
 const url=`/api/annotations/${product}`
 const accept=(next:SharedSnapshot)=>{if(next.product===product&&next.revision>=latest.current.revision){latest.current=next;setSnapshot(next)}}
 useEffect(()=>{
  const current=++generation.current;let stopped=false,polling=false,initialized=false
  latest.current=empty(product);setSnapshot(latest.current);setReady(false)
  const refresh=async()=>{if(polling||saving.current)return;polling=true;try{
   const firstLoad=!initialized;let response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(10000)}),data=await response.json();if(!response.ok)throw Error(data.error||'无法连接注释存储服务')
   if(!initialized){const legacy=localStorage.getItem(annotationKey(product));if(legacy){response=await fetch(url,{method:'POST',signal:AbortSignal.timeout(10000),headers:{'Content-Type':'application/json'},body:JSON.stringify({legacy})});data=await response.json();if(!response.ok)throw Error(data.error||'注释迁移失败，浏览器原数据已保留')}initialized=true}
   if(!stopped&&generation.current===current){accept(data);setReady(true);if(firstLoad)setError('')}
  }catch(e){if(!stopped)setError(e instanceof Error?e.message:'注释服务不可用，请保留输入后重试')}finally{polling=false}}
  void refresh();const timer=window.setInterval(()=>void refresh(),2000);const focus=()=>void refresh();window.addEventListener('focus',focus)
  return()=>{stopped=true;clearInterval(timer);window.removeEventListener('focus',focus)}
 },[product])
 const commit=async(transform:(value:SharedSnapshot)=>SharedSnapshot)=>{
  if(!ready||saving.current){setError(!ready?'正在连接或迁移注释，请稍后重试':'正在保存，请稍后重试');return false}
  saving.current=true;setBusy(true);const current=generation.current
  try{const base=latest.current,next=transform(structuredClone(base));const response=await fetch(url,{method:'PUT',signal:AbortSignal.timeout(10000),headers:{'Content-Type':'application/json'},body:JSON.stringify({expectedRevision:base.revision,version:contextRef.current.version,items:next.items,trash:next.trash})});const data=await response.json();if(!response.ok){if(data.snapshot&&current===generation.current)accept(data.snapshot);throw Error(data.error||'保存失败，输入已保留')}
   if(current===generation.current){accept(data);setError('')}return true
  }catch(e){setError(e instanceof Error?e.message:'保存失败，输入已保留');return false}finally{saving.current=false;setBusy(false)}
 }
 const contextKey=JSON.stringify(context)
 useEffect(()=>{if(!ready||saving.current)return;const items=latest.current.items.map(a=>{const links=resolveLinks(a,context);return JSON.stringify(links.linkedG)!==JSON.stringify(a.linkedG)||JSON.stringify(links.linkedD)!==JSON.stringify(a.linkedD)?updateAnnotation(a,{},context):a});if(JSON.stringify(items)!==JSON.stringify(latest.current.items))void commit(s=>({...s,items}))},[contextKey,product,ready,snapshot.revision])
 return {items:snapshot.items,removed:snapshot.trash,error,ready,busy,relationContext:context,
  async create(input:AnnotationInput){let item:Annotation|undefined;const saved=await commit(s=>{item=createAnnotation(product,contextRef.current,[...s.items,...s.trash],input);return {...s,items:[...s.items,item]}});return saved?item:undefined},
  async update(id:string,patch:AnnotationPatch,expectedUpdatedAt?:string){return commit(s=>{const item=s.items.find(a=>a.id===id);if(!item)throw Error('注释已被移除或不存在，当前输入已保留');if(expectedUpdatedAt!==undefined&&item.updatedAt!==expectedUpdatedAt)throw Error('此注释已在另一窗口更新，草稿已保留，请核对最新内容');const next=updateAnnotation(item,patch,contextRef.current);return {...s,items:s.items.map(a=>a.id===id?next:a)}})},
  async remove(id:string,expectedUpdatedAt:string){return commit(s=>{const item=s.items.find(a=>a.id===id);if(!item||item.updatedAt!==expectedUpdatedAt)throw Error('注释已发生变化，请核对后再移除');return {...s,items:s.items.filter(a=>a.id!==id),trash:[...s.trash,item]}})},
  async restore(id:string){return commit(s=>{const item=s.trash.find(a=>a.id===id);if(!item)throw Error('此注释已恢复或不存在');return {...s,items:[...s.items,item],trash:s.trash.filter(a=>a.id!==id)}})},
  async importFile(text:string,allowVersionMismatch=false){try{const file=parseAnnotationFile(text,product);if(!allowVersionMismatch&&(file.version!==context.version||file.items.some(a=>a.version!==context.version)))throw Error('版本不匹配，请确认原型位置后再导入');return await commit(s=>{const ids=new Set(s.trash.map(a=>a.id));if(file.items.some(a=>ids.has(a.id)))throw Error('文件含已移除的注释，请先从已移除列表恢复后再导入');const all=mergeAnnotationFile([...s.items,...s.trash],file,contextRef.current,new Date().toISOString());return {...s,items:all.filter(a=>!ids.has(a.id))}})}catch(e){setError(e instanceof Error?e.message:'导入失败');return false}},
  exportFile(){return JSON.stringify({schema:1,product,version:context.version,items:latest.current.items},null,2)},
  relationState(item:Annotation){return relationState(item,context)},
 }
}
export type AnnotationStore=ReturnType<typeof useAnnotations>
