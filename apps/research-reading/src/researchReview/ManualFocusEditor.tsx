import { useState, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import type { PrdFeature } from './prd'
import { usePrototypeFocus } from '../prototypeFocus/FocusContext'
import { elementSelector, readManual, saveManual, type ManualRegion } from '../prototypeFocus/manual'
import { researchLocations, researchTargets } from '../prototypeFocus/researchTargets'

export function ManualFocusEditor({feature,onClose}:{feature:PrdFeature;onClose:()=>void}) {
 const {request,requestFocus}=usePrototypeFocus()
 const [regions,setRegions]=useState<ManualRegion[]>(()=>readManual(feature.id)?.regions??[]),[drawing,setDrawing]=useState(false),[error,setError]=useState('')
 const [start,setStart]=useState<{x:number;y:number}|null>(null),[end,setEnd]=useState<{x:number;y:number}|null>(null)
 const base=feature.links[0]?.id,location=researchLocations[base],target=readManual(feature.id)?.target??(location&&researchTargets[location.navigationTarget])
 const begin=(e:PointerEvent<HTMLDivElement>)=>{e.currentTarget.setPointerCapture(e.pointerId);setStart({x:e.clientX,y:e.clientY});setEnd({x:e.clientX,y:e.clientY})}
 const finish=(e:PointerEvent<HTMLDivElement>)=>{
  if(!start)return
  const left=Math.min(start.x,e.clientX),top=Math.min(start.y,e.clientY),width=Math.abs(start.x-e.clientX),height=Math.abs(start.y-e.clientY)
  setDrawing(false);setStart(null);setEnd(null)
  if(width<6||height<6){setError('框选范围太小，请重新框选。');return}
  const candidates=document.elementsFromPoint(left+width/2,top+height/2).filter(el=>!el.closest('.manual-focus-editor,.manual-draw-layer,.reading-review,.prototype-focus-layer')&&el!==document.documentElement&&el!==document.body)
  const anchor=candidates.find(el=>{const r=el.getBoundingClientRect();return r.left<=left+2&&r.top<=top+2&&r.right>=left+width-2&&r.bottom>=top+height-2})
  if(!anchor){setError('未识别到完整承载区域，请避开侧栏并在同一页面区域重新框选。');return}
  const r=anchor.getBoundingClientRect()
  setRegions(list=>[...list,{selector:elementSelector(anchor),label:(anchor.getAttribute('aria-label')||anchor.textContent||anchor.tagName).trim().slice(0,60),x:(left-r.left)/r.width,y:(top-r.top)/r.height,width:width/r.width,height:height/r.height}]);setError('')
 }
 const navigate=()=>{if(base)requestFocus(base,feature.title,'research');else setError('新增功能暂未配置导航目标，请先关联有定位的合规项。')}
 const adopt=()=>{
  const selectors=location?.selectors??[]
  const found=selectors.flatMap(selector=>Array.from(document.querySelectorAll(selector)).filter(el=>el.getClientRects().length).map(el=>({selector:elementSelector(el),label:(el.getAttribute('aria-label')||el.textContent||el.tagName).trim().slice(0,60),x:0,y:0,width:1,height:1})))
  if(!found.length){setError('对应页面尚未就绪，请先点击“打开对应页面”。');return}
  setRegions(found);setError('')
 }
 return createPortal(<>
  <aside className="manual-focus-editor" aria-label="手动框选校正"><header><strong>{feature.id} · 框选校正</strong><button aria-label="关闭框选校正" onClick={onClose}>×</button></header><p>{feature.title}</p>
   <div className="prd-toolbar"><button onClick={navigate}>打开对应页面</button><button onClick={adopt}>载入AI框选</button><button onClick={()=>{setDrawing(true);setError('')}}>新增框选</button></div>
   <ol>{regions.map((r,i)=><li key={i}><strong>{i+1}. {r.label}</strong><button aria-label={`删除框选${i+1}`} onClick={()=>setRegions(list=>list.filter((_,j)=>j!==i))}>删除</button><div className="manual-region-fields">{(['x','y','width','height'] as const).map((key,k)=><label key={key}>{['左边%','上边%','宽度%','高度%'][k]}<input aria-label={`框选${i+1}${key}`} type="number" min="0" max="100" step="1" value={Math.round(r[key]*100)} onChange={e=>setRegions(list=>list.map((v,j)=>i===j?{...v,[key]:Math.min(1,Math.max(0,Number(e.target.value)/100))}:v))}/></label>)}</div></li>)}</ol>
   {error&&<p role="alert">{error}</p>}<footer><button onClick={()=>{try{if(regions.some(r=>r.width<=0||r.height<=0||r.x+r.width>1.01||r.y+r.height>1.01)){setError('框选需位于识别区域内，宽高必须大于0。');return}const navigation=target??request?.target;if(!navigation){setError('请先打开对应页面建立导航目标。');return}saveManual(feature.id,regions.length?{target:navigation,regions,prepare:location?.prepare}:undefined);requestFocus(`${feature.id}::${base??''}`,feature.title,'research');onClose()}catch{setError('保存失败，本地记录未被覆盖，请检查浏览器存储。')}}}>保存并定位</button><button onClick={()=>{if(window.confirm('删除人工校正并恢复AI定位？')){try{saveManual(feature.id,undefined);onClose()}catch{setError('恢复失败，请重试。')}}}}>恢复AI定位</button></footer>
  </aside>
  {drawing&&<div className="manual-draw-layer" onPointerDown={begin} onPointerMove={e=>{if(start)setEnd({x:e.clientX,y:e.clientY})}} onPointerUp={finish} onKeyDown={e=>{if(e.key==='Escape')setDrawing(false)}} tabIndex={0} ref={el=>el?.focus()}><button onPointerDown={e=>e.stopPropagation()} onClick={()=>setDrawing(false)}>取消框选</button>{start&&end&&<div className="manual-draw-rect" style={{left:Math.min(start.x,end.x),top:Math.min(start.y,end.y),width:Math.abs(start.x-end.x),height:Math.abs(start.y-end.y)}}/>}</div>}
 </>,document.body)
}
