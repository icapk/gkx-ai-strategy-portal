import {useEffect,useState} from 'react'
import type {ReviewPoint, ReviewRecord} from './researchReview/model'
import {ManualFocusEditor} from './researchReview/ManualFocusEditor'

export function ComplianceEditor({point,record,product,features,linked,onSave,onCancel,onGuard}:{point:ReviewPoint;record:ReviewRecord;product:'research'|'reading';features:{id:string;title:string}[];linked:string[];onSave:(patch:Partial<ReviewRecord>)=>boolean;onCancel:()=>void;onGuard:(guard:null|((action:()=>void)=>void))=>void}){
 const [draft,setDraft]=useState({...record,title:point.title,requirement:point.requirement,acceptance:point.acceptance,relationIds:linked,note:record.note||''})
 const [boxing,setBoxing]=useState(false)
 const [error,setError]=useState('')
 const feature={id:point.id,title:draft.title,priority:draft.priority,purpose:'',behavior:'',contract:'',current:'',acceptance:[],links:[{id:point.id,label:draft.title}]}
 const changed=JSON.stringify(draft)!==JSON.stringify({...record,title:point.title,requirement:point.requirement,acceptance:point.acceptance,relationIds:linked,note:record.note||''})
 useEffect(()=>{onGuard(action=>{if(!changed||confirm('放弃尚未保存的修改？')){onCancel();action()}});const unload=(e:BeforeUnloadEvent)=>{if(changed){e.preventDefault();e.returnValue=''}};window.addEventListener('beforeunload',unload);return()=>{onGuard(null);window.removeEventListener('beforeunload',unload)}},[changed,draft])
 return <div className="review-detail compliance-editor"><div className="compliance-detail-heading"><strong>编辑合规点</strong><button className="review-back" onClick={()=>{if(!changed||confirm('放弃尚未保存的修改？'))onCancel()}}>取消</button></div><form onSubmit={e=>{e.preventDefault();if(!draft.title.trim()){setError('标题不能为空');return}if(!onSave({...draft,title:draft.title.trim(),history:[]}))setError('保存失败，请重试。')}}>
 <label>标题<input required maxLength={120} value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/></label>
 <label>需规摘录<textarea rows={5} value={draft.requirement} onChange={e=>setDraft({...draft,requirement:e.target.value})}/></label>
 <label>验收要求<textarea rows={3} value={draft.acceptance} onChange={e=>setDraft({...draft,acceptance:e.target.value})}/></label>
 <div className="review-status-row"><label>合规状态<select data-status={draft.status} value={draft.status} onChange={e=>setDraft({...draft,status:e.target.value as ReviewRecord['status']})}>{['已合规','待定','不合规'].map(s=><option data-status={s} key={s}>{s}</option>)}</select></label><label>优先级<select value={draft.priority} onChange={e=>setDraft({...draft,priority:e.target.value as ReviewRecord['priority']})}>{['P0','P1','P2'].map(p=><option key={p}>{p}</option>)}</select></label></div>
 <fieldset><legend>关联 PRD 功能点</legend>{features.map(f=><label className="compliance-relation-option" key={f.id}><input type="checkbox" checked={draft.relationIds.includes(f.id)} onChange={e=>setDraft({...draft,relationIds:e.target.checked?[...draft.relationIds,f.id]:draft.relationIds.filter(id=>id!==f.id)})}/>{f.id} {f.title}</label>)}</fieldset>
 <label>备注<textarea rows={3} value={draft.note} onChange={e=>setDraft({...draft,note:e.target.value})}/></label>
 <div className="annotation-tools"><button type="button" onClick={()=>setBoxing(true)}>框选校正</button><button className="review-primary" type="submit">保存</button></div>{error&&<p role="alert">{error}</p>}</form>{boxing&&<ManualFocusEditor product={product} feature={feature} onClose={()=>setBoxing(false)}/>}</div>
}
