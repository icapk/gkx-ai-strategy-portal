import {useEffect,useState} from 'react'
import {createPortal} from 'react-dom'
import {useDraggablePanel} from './useDraggablePanel'
import {AnnotationDrawing} from '../annotations/AnnotationOverlay'
import {captureAnnotationRange} from '../annotations/location'
import type {AnnotationRange} from '../annotations/uiTypes'

export function RangeCorrectionEditor({title,product,initial,onInitial,onSave,onClose,notice}:{title:string;product:'research'|'reading';initial?:AnnotationRange;onInitial:()=>AnnotationRange|undefined|Promise<AnnotationRange|undefined>;onSave:(range:AnnotationRange)=>boolean|Promise<boolean>;onClose:()=>void;notice?:string}){
 const panel=useDraggablePanel()
 const [draft,setDraft]=useState<AnnotationRange>(()=>structuredClone(initial??{target:{product},regions:[]}))
 const [drawing,setDrawing]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('')
 const dirty=JSON.stringify(draft)!==JSON.stringify(initial??{target:{product},regions:[]})
 const close=()=>{if(!dirty||window.confirm('放弃未保存的框选校正？'))onClose()}
 useEffect(()=>{const unload=(e:BeforeUnloadEvent)=>{if(dirty)e.preventDefault()};window.addEventListener('beforeunload',unload);return()=>window.removeEventListener('beforeunload',unload)},[dirty])
 const save=async()=>{
  if(draft.regions.some(r=>![r.x,r.y,r.width,r.height].every(Number.isFinite)||r.x<0||r.y<0||r.width<=0||r.height<=0||r.x+r.width>1.000001||r.y+r.height>1.000001)){setError('框选需位于识别区域内，宽高必须大于 0。');return}
  setBusy(true);setError('');try{if(await onSave(draft))onClose();else setError('未保存，原记录与当前输入均已保留，请核对后重试。')}catch(e){setError(e instanceof Error?e.message:'保存失败，输入已保留。')}finally{setBusy(false)}
 }
 return createPortal(<>
  <aside ref={panel.ref} style={panel.style} className="manual-focus-editor range-correction-editor" aria-label="框选校正">
   <header {...panel.headerProps}><strong>框选校正</strong><button aria-label="关闭框选校正" disabled={busy} onClick={close}>×</button></header><p>{title}</p>
   <div className="range-correction-actions"><button disabled={busy} onClick={async()=>{setBusy(true);setError('');try{const original=await onInitial();if(original)setDraft(structuredClone(original));else setError('没有可恢复的初始框选范围。')}catch(e){setError(e instanceof Error?e.message:'初始定位失败。')}finally{setBusy(false)}}}>初始定位</button><button disabled={busy} onClick={()=>{setError('');setDrawing(true)}}>定位校正</button><button disabled={busy} onClick={()=>void save()}>保存并定位</button></div>
   {notice&&<small>{notice}</small>}
   <ol>{draft.regions.map((r,i)=><li key={i}><div className="range-correction-row"><strong>范围 {i+1}</strong><button disabled={busy} aria-label={`删除框选${i+1}`} onClick={()=>setDraft(d=>({...d,regions:d.regions.filter((_,j)=>i!==j)}))}>删除</button></div><div className="manual-region-fields">{(['x','y','width','height'] as const).map((key,k)=><label key={key}>{['左边 %','上边 %','宽度 %','高度 %'][k]}<input disabled={busy} aria-label={`框选${i+1}${key}`} type="number" min="0" max="100" step="0.1" value={Number((r[key]*100).toFixed(2))} onChange={e=>setDraft(d=>({...d,regions:d.regions.map((v,j)=>i===j?{...v,[key]:Number(e.target.value)/100}:v)}))}/></label>)}</div></li>)}</ol>
   {!draft.regions.length&&<p>暂无框选范围。可初始定位或重新校正；保存空范围将移除当前框选。</p>}{error&&<p role="alert">{error}</p>}
  </aside>
  {drawing&&<AnnotationDrawing onCancel={()=>setDrawing(false)} onFinish={box=>{const next=captureAnnotationRange(box,product,draft.target);setDrawing(false);if(!next){setError('无法保存此处范围，请在原型内容区域重新框选。');return}setDraft({...next,prepare:next.restore?undefined:draft.prepare})}}/>}
 </>,document.body)
}
