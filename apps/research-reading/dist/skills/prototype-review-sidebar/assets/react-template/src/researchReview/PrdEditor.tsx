import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { points } from './model.ts'
import type { PrdFeature } from './prd.ts'
import { featureRules } from './prdRules.ts'
import { researchLocations } from '../prototypeFocus/researchTargets.ts'

export function PrdEditor({feature,onClose,onSave,onDelete,compliancePoints=points,locations=researchLocations}:{feature:PrdFeature;onClose:()=>void;onDelete?:(reason:string)=>Promise<boolean>;onSave:(feature:PrdFeature,reason:string)=>Promise<boolean>;compliancePoints?:{id:string;title:string}[];locations?:Record<string,{description:string}>}) {
 const [draft,setDraft]=useState(()=>({...structuredClone(feature),rules:featureRules(feature)})),[reason,setReason]=useState(''),[error,setError]=useState(''),[saving,setSaving]=useState(false)
 const [deleting,setDeleting]=useState(false),[deleteReason,setDeleteReason]=useState('')
 const root=useRef<HTMLFormElement>(null)
 const dirty=JSON.stringify(draft)!==JSON.stringify(feature)||!!reason
 const close=()=>{if(!dirty||window.confirm('放弃未保存的PRD修改？'))onClose()}
 useEffect(()=>{
  const previous=document.activeElement as HTMLElement;root.current?.querySelector<HTMLInputElement>('input')?.focus()
  return()=>previous?.focus()
 },[])
 useEffect(()=>{
  const unload=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue=''}}
  window.addEventListener('beforeunload',unload)
  return()=>window.removeEventListener('beforeunload',unload)
 },[dirty])
 return createPortal(<div className="prd-modal-backdrop"><form className="prd-editor" ref={root} role="dialog" aria-modal="true" aria-label="编辑PRD功能点" onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();close()}if(e.key==='Tab'){const nodes=Array.from(root.current!.querySelectorAll<HTMLElement>('input,textarea,select,button'));if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes.at(-1)?.focus()}else if(!e.shiftKey&&document.activeElement===nodes.at(-1)){e.preventDefault();nodes[0]?.focus()}}}} onSubmit={async e=>{e.preventDefault();if(saving)return;if(!draft.title.trim()||!draft.rules.length||draft.rules.some(g=>!g.title.trim()||!g.items.some(t=>t.trim()))||!reason.trim()){setError('请填写名称、规则条目和修改说明。');return}setSaving(true);try{if(await onSave({...draft,title:draft.title.trim(),rules:draft.rules.map(g=>({title:g.title.trim(),items:g.items.map(t=>t.trim()).filter(Boolean)}))},reason.trim()))onClose();else setError('未保存：请检查共享连接；若另一窗口已修改同一功能，请保留当前输入并与最新版本比较。')}catch(error){setError(error instanceof Error?error.message:'保存失败，输入已保留')}finally{setSaving(false)}}}>
  <h2>{feature.id} · 功能设计</h2>
  <label>功能名称<input value={draft.title} maxLength={150} onChange={e=>setDraft({...draft,title:e.target.value})}/></label>
  <div className="prd-form-row"><label>着重讲解<select aria-label="着重讲解" value={draft.emphasis?'yes':'no'} onChange={e=>setDraft({...draft,emphasis:e.target.value==='yes'})}><option value="no">否</option><option value="yes">是</option></select></label><label>设计进度<select aria-label="设计进度" value={draft.designProgress??'待讨论'} onChange={e=>setDraft({...draft,designProgress:e.target.value as PrdFeature['designProgress']})}>{['待讨论','待完善','已完成'].map(p=><option key={p}>{p}</option>)}</select></label></div>
  <div className="prd-form-row"><label>优先级<select aria-label="功能优先级" value={draft.priority??'P1'} onChange={e=>setDraft({...draft,priority:e.target.value as PrdFeature['priority']})}>{['P0','P1','P2'].map(p=><option key={p}>{p}</option>)}</select></label><label>计划交付版本<input value={draft.release??''} onChange={e=>setDraft({...draft,release:e.target.value})}/></label></div>
  {draft.rules.map((group,index)=><fieldset key={index}><legend>规则 {index+1}</legend><label>字段或操作名称<input aria-label={`规则${index+1}名称`} value={group.title} onChange={e=>setDraft({...draft,rules:draft.rules.map((g,i)=>i===index?{...g,title:e.target.value}:g)})}/></label><label>规则条目<textarea aria-label={`规则${index+1}条目`} rows={Math.min(8,Math.max(3,group.items.length*2))} value={group.items.join('\n')} onChange={e=>setDraft({...draft,rules:draft.rules.map((g,i)=>i===index?{...g,items:e.target.value.split('\n')}:g)})}/></label><button type="button" onClick={()=>setDraft({...draft,rules:draft.rules.filter((_,i)=>i!==index)})}>删除此组规则</button></fieldset>)}
  <button type="button" onClick={()=>setDraft({...draft,rules:[...draft.rules,{title:'',items:['']}]})}>添加字段或操作</button>
  <label>原型导航入口<select aria-label="原型导航入口" value={draft.links[0]?.id??''} onChange={e=>setDraft({...draft,links:e.target.value?[{id:e.target.value,label:draft.title||'定位原型'}]:[]})}><option value="">暂不关联</option>{Object.entries(locations).map(([id,l])=><option key={id} value={id}>{id} · {l.description}</option>)}</select></label>
  <fieldset><legend>关联合规项</legend><div className="prd-associations">{compliancePoints.map(p=><label key={p.id}><input type="checkbox" checked={draft.compliance?.includes(p.id)??false} onChange={e=>setDraft({...draft,compliance:e.target.checked?[...(draft.compliance??[]),p.id]:(draft.compliance??[]).filter(id=>id!==p.id)})}/>{p.id} {p.title}</label>)}</div></fieldset>
  <label>本次修改说明<textarea value={reason} required rows={2} onChange={e=>setReason(e.target.value)}/></label>
  {error&&<p role="alert">{error}</p>}{onDelete&&<section className="prd-delete-section">{deleting?<><p>删除后将从当前版本移除，仍可在版本与改动记录中查看。</p><label>删除原因（选填）<textarea value={deleteReason} onChange={e=>setDeleteReason(e.target.value)}/></label><button type="button" disabled={saving} onClick={()=>setDeleting(false)}>取消删除</button><button type="button" disabled={saving} onClick={async()=>{setSaving(true);try{if(await onDelete(deleteReason.trim()))onClose();else setError('删除未保存，请核对共享版本后重试。')}catch(e){setError(e instanceof Error?e.message:'删除失败')}finally{setSaving(false)}}}>确认删除</button></>:<button type="button" disabled={saving} onClick={()=>setDeleting(true)}>删除功能点</button>}</section>}<footer><button type="button" disabled={saving} onClick={close}>取消</button><button type="submit" disabled={saving}>{saving?'正在保存':'保存小修改'}</button></footer>
 </form></div>,document.body)
}
