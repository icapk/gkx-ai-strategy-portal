import {useState} from 'react'
import {ManualFocusEditor} from './researchReview/ManualFocusEditor'
import type {ReviewPoint} from './researchReview/model'
export function useReviewCatalog(product:'research'|'reading',catalog:ReviewPoint[]){
 const key=product+'-compliance-names-v1';const [names,setNames]=useState<Record<string,string>>(()=>{try{return JSON.parse(localStorage.getItem(key)||'{}').names||{}}catch{return {}}})
 const rename=(id:string,title:string)=>{const value=prompt('编辑功能名称',names[id]||title);if(value===null)return;if(!value.trim()){alert('名称不能为空');return}try{const old=JSON.parse(localStorage.getItem(key)||'{}');const next={...old,names:{...old.names,[id]:value.trim().slice(0,120)},history:[...(old.history||[]),{id,before:names[id]||title,after:value.trim().slice(0,120),at:new Date().toISOString()}]};localStorage.setItem(key,JSON.stringify(next));setNames(next.names)}catch{alert('名称保存失败，原数据未覆盖')}}
 const parents=new Map<number,string[]>();catalog.forEach(p=>{const list=parents.get(p.group)||[];if(!list.includes(p.parent))list.push(p.parent);parents.set(p.group,list)})
 const numbering=(p:ReviewPoint)=>{const parent=(p.group+1)+'.'+((parents.get(p.group)?.indexOf(p.parent)??0)+1);const siblings=catalog.filter(x=>x.parent===p.parent);return siblings.length===1&&!p.id.includes('.')?parent:parent+'.'+(siblings.findIndex(x=>x.id===p.id)+1)}
 return {points:catalog.map(p=>({...p,title:names[p.id]||p.title})),rename,numbering,parentNumber:(p:ReviewPoint)=>(p.group+1)+'.'+((parents.get(p.group)?.indexOf(p.parent)??0)+1)}
}
export function ReviewActions({point,product,onLocate,onRename}:{point:ReviewPoint;product:'research'|'reading';onLocate:()=>void;onRename:()=>void}){
 const [boxing,setBoxing]=useState(false)
 const feature={id:point.id,title:point.title,priority:point.priority,purpose:'',behavior:'',contract:'',current:'',acceptance:[],links:[{id:point.id,label:point.title}]}
 return <><span className="review-feature-actions"><button type="button" onClick={onLocate}>定位</button><button type="button" onClick={()=>{onLocate();setBoxing(true)}}>框选校正</button><button type="button" onClick={onRename}>编辑</button></span>{boxing&&<ManualFocusEditor product={product} feature={feature} onClose={()=>setBoxing(false)}/>}</>
}
