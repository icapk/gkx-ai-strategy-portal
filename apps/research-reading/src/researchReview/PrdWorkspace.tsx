import {displayMinute} from '../displayFormat'
import {PrdFilterControls,PrdExportButton,ReviewBottomTools} from './PrdPresentation'
import {matchesPrdFilters,prdDisplayNumbers} from './prdDisplay'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { PrdPanel } from './PrdPanel'
import { prdMarkdown, exportPrd, type PrdFeature } from './prd'
import { comparePrd, reviseFeature, type PrdBook } from './prdStore'
import { PrdEditor } from './PrdEditor'
import { ManualFocusEditor } from './ManualFocusEditor'

const labels:Record<string,string>={title:'名称',purpose:'目的',behavior:'流程与交互',contract:'数据与交付规则',current:'现状与待确认',priority:'优先级',release:'计划交付',acceptance:'验收场景',compliance:'合规关联',links:'原型关联',rules:'逐项规则',emphasis:'着重讲解',designProgress:'设计进度'}
function Difference({before,after}:{before?:PrdFeature;after?:PrdFeature}) {
 return <div className="prd-difference">{Object.entries(labels).flatMap(([key,label])=>{
  const a=before?.[key as keyof PrdFeature],b=after?.[key as keyof PrdFeature]
  if(JSON.stringify(a)===JSON.stringify(b))return []
  const format=(value:unknown):string=>value==null?'（无）':Array.isArray(value)?value.map(v=>typeof v==='object'?(v.items?`${v.title}\n${v.items.map((t:string,i:number)=>`${i+1}. ${t}`).join('\n')}`:`${v.id} ${v.label}`):v).join('\n'):String(value)
  return [<section key={key}><h4>{label}</h4><div className="prd-before"><small>修改前</small><p>{format(a)}</p></div><div className="prd-after"><small>修改后</small><p>{format(b)}</p></div></section>]
 })}</div>
}
export function PrdWorkspace({query,view,onViewChange,onClearQuery,onLocate,onCompliance,book,onBookChange,annotationTools}: {
 annotationTools?:(feature:PrdFeature)=>ReactNode;query:string;view:{chapter:string;opened:string[]};onViewChange:(v:{chapter:string;opened:string[]})=>void;onClearQuery:()=>void;onLocate:(id:string,label:string)=>void;onCompliance:(id:string)=>void;book:PrdBook;onBookChange:(book:PrdBook)=>Promise<boolean>
}) {
 const [version,setVersion]=useState(book.current),[filter,setFilter]=useState({priority:'',emphasis:'',progress:''}),[history,setHistory]=useState(false),[compare,setCompare]=useState(book.revisions[0].id)
 const previousCurrent=useRef(book.current)
 useEffect(()=>{const prior=previousCurrent.current;previousCurrent.current=book.current;setVersion(selected=>selected===prior?book.current:selected)},[book.current])
 const [editing,setEditing]=useState<{area:string;before?:PrdFeature;draft:PrdFeature}|null>(null),[boxing,setBoxing]=useState<PrdFeature|null>(null)
 const [newVersion,setNewVersion]=useState(false),[name,setName]=useState(''),[plan,setPlan]=useState(''),[error,setError]=useState('')
 const revision=book.revisions.find(v=>v.id===version)??book.revisions.at(-1)!,editable=revision.id===book.current

 const beginAdd=()=>setEditing({area:view.chapter,draft:{id:`REQ-CUSTOM-${crypto.randomUUID().slice(0,8)}`,title:'',purpose:'',behavior:'',contract:'',current:'新增设计，待评审。',priority:'P1',release:revision.name,acceptance:[],links:[],compliance:[],rules:[{title:'',items:['']}]}})
 const [quickBusy,setQuickBusy]=useState(false)
 const quickLock=useRef(false)
 const quickUpdate=async(f:PrdFeature,patch:Partial<PrdFeature>)=>{if(quickLock.current||!editable)return;quickLock.current=true;setQuickBusy(true);try{const area=revision.areas.find(a=>a.features.some(x=>x.id===f.id))!.id;const next=reviseFeature(book,area,f,{...f,...patch},'卡片快捷修改');if(!await onBookChange(next))setError('修改未保存，请重试；其他窗口可能已更新数据。');else setError('')}catch{setError('保存失败，请重试。')}finally{quickLock.current=false;setQuickBusy(false)}}
 return <div className="prd-panel">
  <ReviewBottomTools product="research" slot="version"><div className="prd-bottom-controls"><label>版本<select aria-label="PRD版本" value={revision.id} onChange={e=>{setVersion(e.target.value);onViewChange({chapter:'overview',opened:[]})}}>{book.revisions.map(v=><option key={v.id} value={v.id}>{v.name}{v.id===book.current?' · 当前':''}</option>)}</select></label></div></ReviewBottomTools><ReviewBottomTools product="research"><div className="prd-bottom-actions">
   {history&&<div className="prd-toolbar"><button onClick={()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(book,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='智能科研-PRD版本与改动记录.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}}>导出版本记录</button></div>}
   <PrdExportButton count={prdMarkdown(revision.areas,revision.name).replace(/\s/g,'').length} onClick={()=>exportPrd(revision.areas,revision.name)}/>
   <div className="prd-toolbar"><button onClick={()=>setHistory(!history)}>{history?'返回需求':'版本与改动记录'}</button><button onClick={()=>setNewVersion(!newVersion)}>创建大版本</button></div>
  </div></ReviewBottomTools>
 {!view.opened.length&&<PrdFilterControls chapter={view.chapter} areas={revision.areas} query={query} filters={filter} onChange={setFilter}/>}
  {error&&<p role="alert">{error}</p>}
  {newVersion&&<form className="prd-version-form" onSubmit={async e=>{e.preventDefault();if(!name.trim()||!plan.trim()){setError('请填写版本名称和规划。');return}if(book.revisions.some(v=>v.name===name.trim())){setError('版本名称已存在。');return}const id=crypto.randomUUID();const next={...book,current:id,revisions:[...book.revisions,{id,name:name.trim(),plan:plan.trim(),at:new Date().toISOString(),areas:structuredClone(revision.areas),changes:[]}]};if(await onBookChange(next)){setVersion(id);setName('');setPlan('');setNewVersion(false);setError('')}}}>
   <h3>从 {revision.name} 创建大版本</h3><label>版本名称<input aria-label="新版本名称" value={name} maxLength={80} onChange={e=>setName(e.target.value)} required/></label><label>版本规划<textarea aria-label="版本规划" value={plan} onChange={e=>setPlan(e.target.value)} required/></label><button type="submit">创建并设为当前版本</button><button type="button" onClick={()=>setNewVersion(false)}>取消</button>
  </form>}
  {history?<div className="prd-document"><h2>版本与改动记录</h2><p>{revision.plan}</p><small>{displayMinute(revision.at)} · 共享版本记录</small><label>对比版本<select aria-label="对比版本" value={compare} onChange={e=>setCompare(e.target.value)}>{book.revisions.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select></label>
   <h3>版本差异</h3>{comparePrd(book.revisions.find(v=>v.id===compare)?.areas??[],revision.areas).map(d=><details className="prd-change" key={d.id}><summary>{!d.before?'新增':!d.after?'删除':'修改'} · {d.id} {d.after?.title??d.before?.title}</summary><Difference {...d}/></details>)}
   {!comparePrd(book.revisions.find(v=>v.id===compare)?.areas??[],revision.areas).length&&<p>两个版本的功能点内容一致。</p>}
   <h3>本版本小修改 · {revision.changes.length}</h3>{[...revision.changes].reverse().map(c=><details className="prd-change" key={c.id}><summary>{c.after?.title??c.before?.title} · {!c.before?'新增':!c.after?'删除':'修改'}</summary><small>{displayMinute(c.at)}</small><p>{c.reason}</p><Difference before={c.before} after={c.after}/></details>)}
  </div>:<>
   {editable&&!view.opened.length&&view.chapter!=='overview'&&<button className="prd-add" onClick={beginAdd}>新增功能点</button>}
   <PrdPanel query={query} view={view} onViewChange={onViewChange} onClearQuery={()=>{onClearQuery();setFilter({priority:'',emphasis:'',progress:''})}} onLocate={onLocate} catalog={view.opened.length?revision.areas:revision.areas.map(a=>({...a,features:a.features.filter(f=>matchesPrdFilters(f,filter))}))} displayNumbers={prdDisplayNumbers(revision.areas)} filtering={!!(filter.priority||filter.emphasis||filter.progress)} versionLabel={revision.name} extraOverview={<><h3>本版规划</h3><p>{revision.plan}</p><p className="prd-current">P0 核心必需 · P1 重要能力 · P2 体验优化。优先级为建议值。</p></>} headingTools={f=><><button onClick={()=>onLocate(`${f.id}::${f.links[0]?.id??''}`,f.title)}>定位</button>{editable&&<button onClick={()=>setBoxing(f)}>框选校正</button>}{editable&&<button onClick={()=>setEditing({area:revision.areas.find(a=>a.features.some(x=>x.id===f.id))!.id,before:f,draft:f})}>编辑</button>}</>} detailTools={f=>editable?<button onClick={()=>setEditing({area:revision.areas.find(a=>a.features.some(x=>x.id===f.id))!.id,before:f,draft:f})}>编辑</button>:<span className="prd-readonly">历史版本 · 只读</span>} cardTools={f=><><label>设计进度<select aria-label={f.title+" 设计进度"} disabled={!editable||quickBusy} data-progress={f.designProgress??"待讨论"} value={f.designProgress??"待讨论"} onChange={e=>void quickUpdate(f,{designProgress:e.target.value as PrdFeature["designProgress"]})}>{["待讨论","待完善","已完成"].map(v=><option key={v}>{v}</option>)}</select></label><label>优先级<select aria-label={f.title+" 优先级"} disabled={!editable||quickBusy} value={f.priority} onChange={e=>void quickUpdate(f,{priority:e.target.value as PrdFeature["priority"]})}>{["P0","P1","P2"].map(v=><option key={v}>{v}</option>)}</select></label><label>着重讲解<select aria-label={f.title+" 着重讲解"} disabled={!editable||quickBusy} value={f.emphasis?"yes":"no"} onChange={e=>void quickUpdate(f,{emphasis:e.target.value==="yes"})}><option value="no">否</option><option value="yes">是</option></select></label></>} featureTools={f=><>{editable&&annotationTools?.(f)}
    <h4>关联合规项</h4><div className="prd-links">{f.compliance?.length?f.compliance.map(id=><button key={id} onClick={()=>onCompliance(id)}>{id} → 合规详情</button>):<span>未关联 · 待核对</span>}</div>
    
    <details className="prd-feature-history"><summary>此功能点的修改记录</summary>{revision.changes.filter(c=>c.before?.id===f.id||c.after?.id===f.id).map(c=><div key={c.id}><p>{displayMinute(c.at)} · {c.reason}</p><Difference before={c.before} after={c.after}/></div>)}</details>
   </>}/>
  </>}
  {editing&&<PrdEditor  onDelete={editing.before?async(reason)=>{const latest=book.revisions.find(v=>v.id===book.current)?.areas.flatMap(a=>a.features).find(f=>f.id===editing.before!.id);if(JSON.stringify(latest)!==JSON.stringify(editing.before))throw Error('内容已被修改，请重新打开后删除。');if(!await onBookChange(reviseFeature(book,editing.area,editing.before,undefined,reason||'删除功能点')))return false;onViewChange({...view,opened:[]});return true}:undefined} feature={editing.draft} onClose={()=>setEditing(null)} onSave={async(f,reason)=>{const latest=book.revisions.find(v=>v.id===book.current)?.areas.flatMap(a=>a.features).find(x=>x.id===editing.before?.id);if(editing.before&&JSON.stringify(latest)!==JSON.stringify(editing.before))throw Error('此功能已被另一窗口修改，未覆盖。请保留当前输入，关闭后查看最新规则再编辑。');return onBookChange(reviseFeature(book,editing.area,editing.before,f,reason))}}/>}
  {boxing&&<ManualFocusEditor feature={boxing} onClose={()=>setBoxing(null)}/>}
 </div>
}
