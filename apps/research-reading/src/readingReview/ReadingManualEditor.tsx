import {useEffect,useState} from 'react'
import {createPortal} from 'react-dom'
import type {PrdFeature} from '../researchReview/prd'
import {elementSelector,type ManualMapping,type ManualRegion} from '../prototypeFocus/manual'
import {readingLocations,readingTargets} from '../prototypeFocus/readingTargets'
import {usePrototypeFocus} from '../prototypeFocus/FocusContext'
import type {PrototypeTarget} from '../prototypeFocus/types'
function visibleContext():PrototypeTarget|undefined{
 if(document.querySelector('#reading-product-panel .reading-files'))return readingTargets['reading-library']
 if(document.querySelector('#reading-product-panel .reading-upload-page'))return readingTargets['reading-upload']
 if(!document.querySelector('#reading-product-panel .antenna-reader'))return undefined
 const title=document.querySelector('.antenna-insights > header strong')?.textContent
 const panels:Record<string,PrototypeTarget['readingRight']>={'笔记':'notes','图表':'figures','引用':'references','元数据':'metadata','图谱':'graph'}
 return {product:'reading',readingView:'antenna-reader',...(document.querySelector('.antenna-outline')?{readingLeft:'outline' as const}:{}),...(title&&panels[title]?{readingRight:panels[title]}:{}),...(title==='图谱'?{readingKnowledgeTab:document.querySelector('.knowledge-tabs [aria-selected=true]')?.textContent as PrototypeTarget['readingKnowledgeTab']}:{}),...(document.querySelector('.antenna-search-panel')?{readingTool:'search' as const}:{})}
}
export function ReadingManualEditor({feature,onClose,onSave}:{feature:PrdFeature;onClose:()=>void;onSave:(mapping:ManualMapping|undefined,reason:string)=>Promise<boolean>}){
 const {requestFocus,cancelFocus}=usePrototypeFocus()
 const [regions,setRegions]=useState<ManualRegion[]>(()=>structuredClone(feature.manual?.regions??[])),[drawing,setDrawing]=useState<number|null>(null),[start,setStart]=useState<{x:number;y:number}|null>(null),[end,setEnd]=useState<{x:number;y:number}|null>(null),[error,setError]=useState(''),[saving,setSaving]=useState(false),[reason,setReason]=useState('校正原型定位区域')
 const link=feature.links[0]?.id,location=readingLocations[link]
 const [target,setTarget]=useState(feature.manual?.target??readingTargets[location?.navigationTarget])
 const changed=JSON.stringify(regions)!==JSON.stringify(feature.manual?.regions??[])
 useEffect(()=>{const unload=(e:BeforeUnloadEvent)=>{if(changed){e.preventDefault();e.returnValue=''}};window.addEventListener('beforeunload',unload);return()=>window.removeEventListener('beforeunload',unload)},[changed])
 const close=()=>{if(!changed||confirm('放弃未保存的人工框选？'))onClose()}
 useEffect(()=>{const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setDrawing(null);setStart(null);setEnd(null)}};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape)},[])
 const save=async()=>{if(!reason.trim()){setError('请填写修改原因');return}if(!target){setError('请先为功能关联原型入口');return}setSaving(true);try{if(await onSave(regions.length?{target,regions}:undefined,reason)){onClose()}else setError('未保存，输入已保留。请核对共享冲突后重试。')}catch(e){setError(String(e))}finally{setSaving(false)}}
 return createPortal(<><aside className="manual-focus-editor reading-manual" aria-label="阅读人工框选"><header><strong>{feature.id} · 人工框选</strong><button aria-label="关闭人工框选" onClick={close}>×</button></header>
 <div className="prd-toolbar"><button onClick={()=>requestFocus(link,feature.title,'reading')}>查看系统建议</button><button disabled={!target} onClick={()=>{cancelFocus();setDrawing(-1);setStart(null)}}>拖画新增区域</button></div>
 <ol>{regions.map((r,i)=><li key={i}><input aria-label={`区域${i+1}名称`} value={r.label} onChange={e=>setRegions(regions.map((a,j)=>j===i?{...a,label:e.target.value}:a))}/><small>{Math.round(r.width*100)}% × {Math.round(r.height*100)}%</small><button onClick={()=>{cancelFocus();setDrawing(i);setStart(null)}}>重画区域 {i+1}</button><button onClick={()=>setRegions(regions.filter((_,j)=>j!==i))}>删除区域 {i+1}</button></li>)}</ol>
 <label>修改原因<input value={reason} onChange={e=>setReason(e.target.value)}/></label>{error&&<p role="alert">{error}</p>}<footer><button onClick={()=>setRegions([])}>恢复系统建议</button><button disabled={saving} onClick={()=>void save()}>保存框选</button></footer></aside>
 {drawing!==null&&<div className="manual-draw-layer" onPointerDown={e=>{if((e.target as Element).closest('button'))return;e.currentTarget.setPointerCapture(e.pointerId);setStart({x:e.clientX,y:e.clientY});setEnd({x:e.clientX,y:e.clientY})}} onPointerMove={e=>{if(start)setEnd({x:e.clientX,y:e.clientY})}} onPointerUp={e=>{
  if(!start)return;const x=Math.min(start.x,e.clientX),y=Math.min(start.y,e.clientY),right=Math.max(start.x,e.clientX),bottom=Math.max(start.y,e.clientY)
  const layer=e.currentTarget;layer.style.pointerEvents='none';let anchor=document.elementFromPoint((x+right)/2,(y+bottom)/2);layer.style.pointerEvents=''
  while(anchor&&anchor.closest('#reading-product-panel')){const b=anchor.getBoundingClientRect();if(b.left<=x&&b.top<=y&&b.right>=right&&b.bottom>=bottom)break;anchor=anchor.parentElement}
  if(!anchor?.closest('#reading-product-panel')||right-x<6||bottom-y<6){setError('请在阅读内容区域内拖画至少6像素的区域。')}else{
   const context=visibleContext()
   if(!context||(regions.length>0&&!(drawing===0&&regions.length===1)&&JSON.stringify(context)!==JSON.stringify(target))){setError('不同页面或面板的区域不能混在一组。请删除旧区域后在当前视图重新框选。');setDrawing(null);setStart(null);setEnd(null);return}
   setTarget(context)
   const stable=anchor.closest('[data-paper-page],.antenna-header,.antenna-toolbar,.antenna-outline,.antenna-insights,.reading-files,.reading-upload-page')
   if(stable)anchor=stable
   const stableClass=['antenna-header','antenna-toolbar','antenna-outline','antenna-insights','reading-files','reading-upload-page'].find(c=>anchor!.classList.contains(c))
   const selector=anchor.hasAttribute('data-paper-page')?`#reading-product-panel [data-paper-page="${anchor.getAttribute('data-paper-page')}"]`:stableClass?`#reading-product-panel .${stableClass}`:elementSelector(anchor)
   const b=anchor.getBoundingClientRect(),r={selector,label:`区域${drawing<0?regions.length+1:drawing+1}`,x:(x-b.left)/b.width,y:(y-b.top)/b.height,width:(right-x)/b.width,height:(bottom-y)/b.height};setRegions(drawing<0?[...regions,r]:regions.map((v,i)=>i===drawing?r:v));setError('')}
  setDrawing(null);setStart(null);setEnd(null)
 }}><button onClick={()=>{setDrawing(null);setStart(null)}}>取消框选</button>{start&&end&&<div className="manual-draw-rect" style={{left:Math.min(start.x,end.x),top:Math.min(start.y,end.y),width:Math.abs(end.x-start.x),height:Math.abs(end.y-start.y)}}/>}</div>}</>,document.body)
}
