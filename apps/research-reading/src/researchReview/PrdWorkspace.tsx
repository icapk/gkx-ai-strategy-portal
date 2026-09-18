import { useEffect, useRef, useState } from 'react'
import { PrdPanel } from './PrdPanel'
import { prdMarkdown, exportPrd, type PrdFeature } from './prd'
import { comparePrd, reviseFeature, type PrdBook } from './prdStore'
import { PrdEditor } from './PrdEditor'
import { ManualFocusEditor } from './ManualFocusEditor'

const labels:Record<string,string>={title:'名称',purpose:'目的',behavior:'流程与交互',contract:'数据与交付规则',current:'现状与待确认',priority:'优先级',release:'计划交付',acceptance:'验收场景',compliance:'合规关联',links:'原型关联',rules:'逐项规则'}
function Difference({before,after}:{before?:PrdFeature;after?:PrdFeature}) {
 return <div className="prd-difference">{Object.entries(labels).flatMap(([key,label])=>{
  const a=before?.[key as keyof PrdFeature],b=after?.[key as keyof PrdFeature]
  if(JSON.stringify(a)===JSON.stringify(b))return []
  const format=(value:unknown):string=>value==null?'（无）':Array.isArray(value)?value.map(v=>typeof v==='object'?(v.items?`${v.title}\n${v.items.map((t:string,i:number)=>`${i+1}. ${t}`).join('\n')}`:`${v.id} ${v.label}`):v).join('\n'):String(value)
  return [<section key={key}><h4>{label}</h4><div className="prd-before"><small>修改前</small><p>{format(a)}</p></div><div className="prd-after"><small>修改后</small><p>{format(b)}</p></div></section>]
 })}</div>
}
export function PrdWorkspace({query,view,onViewChange,onClearQuery,onLocate,onCompliance,book,onBookChange}: {
 query:string;view:{chapter:string;opened:string[]};onViewChange:(v:{chapter:string;opened:string[]})=>void;onClearQuery:()=>void;onLocate:(id:string,label:string)=>void;onCompliance:(id:string)=>void;book:PrdBook;onBookChange:(book:PrdBook)=>Promise<boolean>
}) {
 const [version,setVersion]=useState(book.current),[priority,setPriority]=useState(''),[history,setHistory]=useState(false),[compare,setCompare]=useState(book.revisions[0].id)
 const previousCurrent=useRef(book.current)
 useEffect(()=>{const prior=previousCurrent.current;previousCurrent.current=book.current;setVersion(selected=>selected===prior?book.current:selected)},[book.current])
 const [editing,setEditing]=useState<{area:string;before?:PrdFeature;draft:PrdFeature}|null>(null),[boxing,setBoxing]=useState<PrdFeature|null>(null)
 const [newVersion,setNewVersion]=useState(false),[name,setName]=useState(''),[plan,setPlan]=useState(''),[error,setError]=useState('')
 const revision=book.revisions.find(v=>v.id===version)??book.revisions.at(-1)!,editable=revision.id===book.current
 useEffect(()=>{if(view.opened.length)setVersion(book.current)},[view.opened,book.current])
 const beginAdd=()=>setEditing({area:view.chapter,draft:{id:`REQ-CUSTOM-${crypto.randomUUID().slice(0,8)}`,title:'',purpose:'',behavior:'',contract:'',current:'新增设计，待评审。',priority:'P1',release:revision.name,acceptance:[],links:[],compliance:[],rules:[{title:'',items:['']}]}})
 return <div className="prd-panel">
  <nav className="prd-navigation"><label>版本<select aria-label="PRD版本" value={revision.id} onChange={e=>{setVersion(e.target.value);onViewChange({chapter:'overview',opened:[]})}}>{book.revisions.map(v=><option key={v.id} value={v.id}>{v.name}{v.id===book.current?' · 当前':''}</option>)}</select></label>
   {history&&<div className="prd-toolbar"><button onClick={()=>exportPrd(revision.areas,revision.name)}>导出此版本</button><button onClick={()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(book,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='智能科研-PRD版本与改动记录.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}}>导出版本记录</button></div>}
   <div className="prd-toolbar"><button onClick={()=>exportPrd(revision.areas,revision.name)}>导出 Markdown</button><span>{prdMarkdown(revision.areas,revision.name).replace(/\s/g,'').length} 字</span></div>
   <div className="prd-toolbar"><button onClick={()=>setHistory(!history)}>{history?'返回需求':'版本与改动记录'}</button><button onClick={()=>setNewVersion(!newVersion)}>创建大版本</button></div>
   <label>优先级<select aria-label="PRD优先级筛选" value={priority} onChange={e=>setPriority(e.target.value)}><option value="">全部</option>{['P0','P1','P2'].map(p=><option key={p}>{p}</option>)}</select></label>
  </nav>
  {error&&<p role="alert">{error}</p>}
  {newVersion&&<form className="prd-version-form" onSubmit={async e=>{e.preventDefault();if(!name.trim()||!plan.trim()){setError('请填写版本名称和规划。');return}if(book.revisions.some(v=>v.name===name.trim())){setError('版本名称已存在。');return}const id=crypto.randomUUID();const next={...book,current:id,revisions:[...book.revisions,{id,name:name.trim(),plan:plan.trim(),at:new Date().toISOString(),areas:structuredClone(revision.areas),changes:[]}]};if(await onBookChange(next)){setVersion(id);setName('');setPlan('');setNewVersion(false);setError('')}}}>
   <h3>从 {revision.name} 创建大版本</h3><label>版本名称<input aria-label="新版本名称" value={name} maxLength={80} onChange={e=>setName(e.target.value)} required/></label><label>版本规划<textarea aria-label="版本规划" value={plan} onChange={e=>setPlan(e.target.value)} required/></label><button type="submit">创建并设为当前版本</button><button type="button" onClick={()=>setNewVersion(false)}>取消</button>
  </form>}
  {history?<div className="prd-document"><h2>版本与改动记录</h2><p>{revision.plan}</p><small>{revision.at} · 共享版本记录</small><label>对比版本<select aria-label="对比版本" value={compare} onChange={e=>setCompare(e.target.value)}>{book.revisions.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select></label>
   <h3>版本差异</h3>{comparePrd(book.revisions.find(v=>v.id===compare)?.areas??[],revision.areas).map(d=><details className="prd-change" key={d.id}><summary>{!d.before?'新增':!d.after?'删除':'修改'} · {d.id} {d.after?.title??d.before?.title}</summary><Difference {...d}/></details>)}
   {!comparePrd(book.revisions.find(v=>v.id===compare)?.areas??[],revision.areas).length&&<p>两个版本的功能点内容一致。</p>}
   <h3>本版本小修改 · {revision.changes.length}</h3>{[...revision.changes].reverse().map(c=><details className="prd-change" key={c.id}><summary>{c.after?.title??c.before?.title} · {!c.before?'新增':!c.after?'删除':'修改'}</summary><small>{new Date(c.at).toLocaleString('zh-CN')}</small><p>{c.reason}</p><Difference before={c.before} after={c.after}/></details>)}
  </div>:<>
   {editable&&view.chapter!=='overview'&&<button className="prd-add" onClick={beginAdd}>新增功能点</button>}
   <PrdPanel query={query} view={view} onViewChange={onViewChange} onClearQuery={onClearQuery} onLocate={onLocate} catalog={revision.areas.map(a=>({...a,features:a.features.filter(f=>!priority||f.priority===priority)}))} versionLabel={revision.name} extraOverview={<><h3>本版规划</h3><p>{revision.plan}</p><p className="prd-current">P0 核心必需 · P1 重要能力 · P2 体验优化。优先级为建议值。</p></>} featureTools={f=><>
    <small>计划交付：{f.release??'原稿'} · {f.parentTitle}</small><h4>关联合规项</h4><div className="prd-links">{f.compliance?.length?f.compliance.map(id=><button key={id} onClick={()=>onCompliance(id)}>{id} → 合规详情</button>):<span>未关联 · 待核对</span>}</div>
    <div className="prd-toolbar"><button onClick={()=>setBoxing(f)}>手动框选 / 校正</button>{editable&&<><button onClick={()=>setEditing({area:revision.areas.find(a=>a.features.some(x=>x.id===f.id))!.id,before:f,draft:f})}>编辑需求与关联</button><button onClick={()=>{const reason=window.prompt(`删除“${f.title}”？请输入原因，历史仍保留。`);if(reason?.trim())onBookChange(reviseFeature(book,revision.areas.find(a=>a.features.some(x=>x.id===f.id))!.id,f,undefined,reason.trim()))}}>删除功能点</button></>}</div>
    {!!revision.changes.filter(c=>c.before?.id===f.id||c.after?.id===f.id).length&&<details><summary>此功能修改历史</summary>{revision.changes.filter(c=>c.before?.id===f.id||c.after?.id===f.id).map(c=><div key={c.id}><p>{c.at} · {c.reason}</p><Difference before={c.before} after={c.after}/></div>)}</details>}
   </>}/>
  </>}
  {editing&&<PrdEditor feature={editing.draft} onClose={()=>setEditing(null)} onSave={async(f,reason)=>{const latest=book.revisions.find(v=>v.id===book.current)?.areas.flatMap(a=>a.features).find(x=>x.id===editing.before?.id);if(editing.before&&JSON.stringify(latest)!==JSON.stringify(editing.before))throw Error('此功能已被另一窗口修改，未覆盖。请保留当前输入，关闭后查看最新规则再编辑。');return onBookChange(reviseFeature(book,editing.area,editing.before,f,reason))}}/>}
  {boxing&&<ManualFocusEditor feature={boxing} onClose={()=>setBoxing(null)}/>}
 </div>
}
