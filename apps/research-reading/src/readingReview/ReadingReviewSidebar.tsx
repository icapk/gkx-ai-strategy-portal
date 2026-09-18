import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { groups, stories, storyDescriptions, points, statuses, priorities, initialFilters, matches, loadReview, parseReview, STORAGE_KEY, type ReviewFile, type Status, type Priority } from './model'
import './review.css'
import { usePrototypeFocus } from '../prototypeFocus/FocusContext'
import { storySteps } from './storySteps'
import { useReadingPrd } from './useReadingPrd'
import { ReadingPrdWorkspace } from './ReadingPrdWorkspace'

export function ReadingReviewSidebar() {
  const { requestFocus } = usePrototypeFocus()
  const sharedPrd=useReadingPrd()
  const [prdMode,setPrdMode]=useState(()=>new URLSearchParams(location.search).get('review')==='prd')
  const [prdOpened,setPrdOpened]=useState<string|null>(null)
  const modeUrl=(mode:string)=>{const url=new URL(location.href);url.searchParams.set('review',mode);history.replaceState(null,'',url)}
  useEffect(()=>{const restore=()=>{const mode=new URLSearchParams(location.search).get('review');setPrdMode(mode==='prd');if(mode==='story'||mode==='design')setFilters(f=>({...f,mode}))};window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore)},[])
  const openPrd=(id:string)=>protect(()=>{setSelected(null);setPrdMode(true);setPrdOpened(id);setReviewQuery('');modeUrl('prd')})
  const focusPoint=(id:string)=>protect(()=>{const item=points.find(p=>p.id===id);if(!item)return;setLastViewed(id);requestFocus(id,item.title,'reading');if(window.innerWidth<1280)setCollapsed(true)})
  const [loaded] = useState(loadReview)
  const [data,setData]=useState(loaded.data)
  const [filters,setFilters]=useState(()=>({...initialFilters(),mode:new URLSearchParams(location.search).get('review')==='story'?'story' as const:'design' as const}))
  const [collapsed,setCollapsed]=useState(()=>window.innerWidth<1280)
  const [selected,setSelected]=useState<string|null>(null)
  const [lastViewed,setLastViewed]=useState<string|null>(null)
  const [reviewQuery,setReviewQuery]=useState('')
  const [status,setStatus]=useState<Status>('待定')
  const [priority,setPriority]=useState<Priority>('P0')
  const [note,setNote]=useState('')
  const [message,setMessage]=useState(loaded.error)
  const [incoming,setIncoming]=useState<ReviewFile|null>(null)
  const [guard,setGuard]=useState<null|(()=>void)>(null)
  const fileRef=useRef<HTMLInputElement>(null)
  const resultsRef=useRef<HTMLDivElement>(null)
  const resultsScroll=useRef(0)
  const bypass=useRef(false)
  useEffect(()=>{
    if(!guard&&!incoming)return
    const previous=document.activeElement as HTMLElement|null
    const dialog=document.querySelector<HTMLElement>('.review-modal')
    const key=(e:KeyboardEvent)=>{
      if(e.key==='Escape'){e.preventDefault();setGuard(null);setIncoming(null)}
      if(e.key==='Tab'&&dialog){const items=Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled),input,select,textarea'));const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}
    }
    document.addEventListener('keydown',key)
    return()=>{document.removeEventListener('keydown',key);previous?.focus()}
  },[guard,incoming])
  const point=points.find(p=>p.id===selected)
  const current=selected?data.records[selected]:null
  const dirty=!!current && (status!==current.status || priority!==current.priority || !!note.trim())
  const protect=(action:()=>void)=>dirty?setGuard(()=>action):action()
  useEffect(()=>{
    if(!dirty)return
    const unload=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue=''}
    const click=(e:MouseEvent)=>{
      const target=e.target instanceof Element?e.target.closest<HTMLButtonElement>('#reading-product-tab-research'):null
      if(target&&!bypass.current){e.preventDefault();e.stopPropagation();setGuard(()=>()=>{bypass.current=true;target.click();bypass.current=false})}
    }
    window.addEventListener('beforeunload',unload)
    document.addEventListener('click',click,true)
    return()=>{window.removeEventListener('beforeunload',unload);document.removeEventListener('click',click,true)}
  },[dirty])
  const persist=(next:ReviewFile)=>{
    try {localStorage.setItem(STORAGE_KEY,JSON.stringify(next));setData(next);return true}
    catch{setMessage('保存失败：本地存储不可用或空间不足，编辑内容仍保留。');return false}
  }
  const save=()=>{
    if(!selected||!current)return true
    if(!dirty)return true
    const next={version:1 as const,records:{...data.records,[selected]:{status,priority,history:[...current.history,{at:new Date().toISOString(),from:current.status,to:status,fromPriority:current.priority,toPriority:priority,note:note.trim()}]}}}
    if(!persist(next))return false
    setNote('');setMessage('审核记录已保存。')
    if(point&&!matches(point,next,filters)){setSelected(null);setMessage('已保存，该功能已移出当前筛选结果。')}
    return true
  }
  useEffect(()=>{if(selected)return;requestAnimationFrame(()=>{if(resultsRef.current)resultsRef.current.scrollTop=resultsScroll.current})},[selected])
  const select=(id:string)=>protect(()=>{resultsScroll.current=resultsRef.current?.scrollTop??resultsScroll.current;setLastViewed(id);setSelected(id);setStatus(data.records[id].status);setPriority(data.records[id].priority);setNote('')})
  const quickStatus=(id:string,nextStatus:Status)=>{
    const previous=data.records[id]
    if(previous.status===nextStatus)return
    const next:ReviewFile={version:1,records:{...data.records,[id]:{...previous,status:nextStatus,history:[...previous.history,{at:new Date().toISOString(),from:previous.status,to:nextStatus,fromPriority:previous.priority,toPriority:previous.priority,note:''}]}}}
    if(persist(next))setMessage(`${id} 已改为${nextStatus}${matches(points.find(p=>p.id===id)!,next,filters)?'':'，已移出当前筛选结果'}。`)
  }
  const exportFile=()=>{
    const url=URL.createObjectURL(new Blob([JSON.stringify({...data,exportedAt:new Date().toISOString(),catalog:points},null,2)],{type:'application/json'}))
    const a=document.createElement('a');a.href=url;a.download='智能阅读审核记录.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
  }
  const importFile=async(file:File)=>{
    try{if(file.size>10_000_000)throw new Error('文件超过10MB。');setIncoming(parseReview(JSON.parse(await file.text())))}
    catch(e){setMessage(e instanceof Error?e.message:'导入文件无法读取。')}
  }
  const visible=points.filter(p=>matches(p,data,filters))
  const normalizedReviewQuery=reviewQuery.trim().toLowerCase()
  const reviewMatch=(p:typeof points[number])=>!normalizedReviewQuery || `${p.id} ${p.title} ${p.parentTitle}`.toLowerCase().includes(normalizedReviewQuery)
  const visibleResults=visible.filter(reviewMatch)
  const count=(ignore:Parameters<typeof matches>[3],condition:(p:typeof points[number])=>boolean)=>points.filter(p=>matches(p,data,filters,ignore)&&condition(p)).length
  const hierarchyCount=(group:string,parent='',child='')=>count('hierarchy',p=>(!group||p.group===Number(group))&&(!parent||p.parent===parent)&&(!child||p.id===child))
  const parents=points.filter(p=>String(p.group)===filters.group).filter((p,i,a)=>a.findIndex(x=>x.parent===p.parent)===i)
  const children=points.filter(p=>p.parent===filters.parent&&p.id.includes('.'))
  const toggle=<T,>(list:T[],item:T)=>list.includes(item)?list.filter(x=>x!==item):[...list,item]
  const updates=(patch:Partial<typeof filters>)=>protect(()=>{setSelected(null);setNote('');setFilters(f=>({...f,...patch}))})
  const markMatch=(text:string)=>{
    if(!normalizedReviewQuery)return text
    const at=text.toLowerCase().indexOf(normalizedReviewQuery)
    if(at<0)return text
    return <>{text.slice(0,at)}<mark>{text.slice(at,at+reviewQuery.trim().length)}</mark>{text.slice(at+reviewQuery.trim().length)}</>
  }
  const changed=incoming?Object.keys(incoming.records).filter(id=>JSON.stringify(incoming.records[id])!==JSON.stringify(data.records[id])):[]
  return <>
    <aside className={`reading-review ${prdMode?'is-prd':''} ${collapsed?'is-collapsed':''}`} aria-label="智能阅读设计评审">
      {collapsed?<button className="review-expand" title="展开设计评审" aria-label="展开设计评审" onClick={()=>setCollapsed(false)}><img src="/assets/reading/outline.svg" alt=""/><span>设计评审</span></button>:<>
        <header><strong>智能阅读 · 设计评审</strong><button title="收起侧栏" aria-label="收起评审侧栏" onClick={()=>protect(()=>setCollapsed(true))}>‹</button></header>
        <div className="review-top-tools">
          <label className="review-mode-select"><select aria-label="评审模式" value={prdMode?'prd':filters.mode} onChange={e=>{const mode=e.target.value;protect(()=>{setSelected(null);setPrdMode(mode==='prd');setReviewQuery('');modeUrl(mode);if(mode!=='prd')setFilters(f=>({...f,mode:mode as typeof filters.mode}))})}}><option value="design">功能设计模式</option><option value="story">故事线模式</option><option value="prd">PRD模式</option></select></label>
          <label className="review-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg><input aria-label={prdMode?'搜索PRD全文':'搜索功能编号或标题'} value={reviewQuery} onChange={e=>setReviewQuery(e.target.value)} placeholder={prdMode?'搜索编号、标题或规则':'搜索编号或标题'}/></label>
        </div>
        {prdMode?(sharedPrd.book?<ReadingPrdWorkspace book={sharedPrd.book} revisionNumber={sharedPrd.revision} save={sharedPrd.save} query={reviewQuery} clearQuery={()=>setReviewQuery('')} opened={prdOpened} onOpened={()=>setPrdOpened(null)} onCompliance={id=>{setPrdMode(false);modeUrl('design');select(id)}} onLocate={(id,label)=>{requestFocus(id,label,'reading');if(window.innerWidth<1280&&!id.includes('::READ-review'))setCollapsed(true)}}/>:<p role="status">{sharedPrd.status}</p>):point&&current?<div className="review-detail">
          <button className="review-back" onClick={()=>protect(()=>{setSelected(null);setNote('')})}>‹ 返回功能列表</button>
          <small>{groups[point.group]} / {point.parentTitle}</small><h2>{point.id} {point.title}</h2>
          <section><h3>关联PRD功能</h3>{sharedPrd.book?.revisions.find(v=>v.id===sharedPrd.book?.current)?.areas.flatMap(a=>a.features).filter(f=>f.compliance?.includes(point.id)).map(f=><p key={f.id}><button onClick={()=>openPrd(f.id)}>{f.id} · {f.title} →</button></p>)}{!sharedPrd.book?.revisions.find(v=>v.id===sharedPrd.book?.current)?.areas.some(a=>a.features.some(f=>f.compliance?.includes(point.id)))&&<p>暂无关联PRD功能。</p>}</section>
          <section><h3>需规原文</h3><p>{point.requirement}</p><h3>验收要点</h3><p>{point.acceptance}</p><h3>故事线 · {stories[point.story]}</h3><p>{storyDescriptions[point.story]}</p></section>
          <section><h3>AI初审 · {point.baseline.status}</h3><p>{point.baseline.reason}</p><small>{point.baseline.evidence}</small></section>
          <section className="review-edit"><h3>人工复核</h3><label>合规状态<select value={status} onChange={e=>setStatus(e.target.value as Status)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label><label>优先级<select value={priority} onChange={e=>setPriority(e.target.value as Priority)}>{priorities.map(s=><option key={s}>{s}</option>)}</select></label><label>追加备注<textarea maxLength={10000} rows={4} value={note} onChange={e=>setNote(e.target.value)} placeholder="记录修改意见或复核依据"/></label><button className="review-primary" disabled={!dirty} onClick={save}>保存审核</button></section>
          <section><h3>修改记录 · {current.history.length}</h3>{current.history.length===0?<p>暂无人工修改</p>:[...current.history].reverse().map((h,i)=><article className="review-history" key={`${h.at}-${i}`}><small>{new Date(h.at).toLocaleString('zh-CN')}</small><p>{h.from} → {h.to} · {h.fromPriority} → {h.toPriority}</p>{h.note&&<p>{h.note}</p>}</article>)}</section>
        </div>:<>
          <div className="review-filters">
            {filters.mode==='design'?<div className="review-hierarchy">
              <label>一级功能<select aria-label="一级功能" value={filters.group} onChange={e=>updates({group:e.target.value,parent:'',child:''})}><option value="">全部 {hierarchyCount('')}</option>{groups.map((g,i)=><option value={String(i)} key={g}>{g} {hierarchyCount(String(i))}</option>)}</select></label>
              <label>二级功能<select aria-label="二级功能" disabled={!filters.group} value={filters.parent} onChange={e=>updates({parent:e.target.value,child:''})}><option value="">全部 {hierarchyCount(filters.group)}</option>{parents.map(p=><option key={p.parent} value={p.parent}>{p.parent} {p.parentTitle} {hierarchyCount(filters.group,p.parent)}</option>)}</select></label>
              <label>三级功能<select aria-label="三级功能" disabled={!filters.parent||!children.length} value={filters.child} onChange={e=>updates({child:e.target.value})}><option value="">{filters.parent&&!children.length?'无三级功能':'全部'} {hierarchyCount(filters.group,filters.parent)}</option>{children.map(p=><option key={p.id} value={p.id}>{p.id} {p.title} {hierarchyCount(filters.group,filters.parent,p.id)}</option>)}</select></label>
            </div>:<details className="review-story-select"><summary>故事线 · 已选 {filters.stories.length}/5</summary><label><input type="checkbox" checked={filters.stories.length===5} onChange={e=>updates({stories:e.target.checked?[0,1,2,3,4]:[]})}/>全选 {count('story',()=>true)}</label>{stories.map((s,i)=><label key={s}><input type="checkbox" checked={filters.stories.includes(i)} onChange={()=>updates({stories:toggle(filters.stories,i)})}/>{i+1} {s} {count('story',p=>p.story===i)}</label>)}</details>}
            <fieldset><legend>合规状态</legend><label><input type="checkbox" checked={filters.statuses.length===3} onChange={e=>updates({statuses:e.target.checked?[...statuses]:[]})}/>全选 {count('status',()=>true)}</label><div>{statuses.map(s=><label key={s}><input type="checkbox" checked={filters.statuses.includes(s)} onChange={()=>updates({statuses:toggle(filters.statuses,s)})}/>{s} {count('status',p=>data.records[p.id].status===s)}</label>)}</div></fieldset>
            <details className="review-priority-filter"><summary>优先级 · 已选 {filters.priorities.length}/3</summary><label><input type="checkbox" checked={filters.priorities.length===3} onChange={e=>updates({priorities:e.target.checked?[...priorities]:[]})}/>全选 {count('priority',()=>true)}</label><div>{priorities.map(s=><label key={s}><input type="checkbox" checked={filters.priorities.includes(s)} onChange={()=>updates({priorities:toggle(filters.priorities,s)})}/>{s} {count('priority',p=>data.records[p.id].priority===s)}</label>)}</div></details>
          </div>
          <div className="review-result-count"><span>{visibleResults.length} / {points.length} 个功能点</span><button onClick={()=>{setReviewQuery('');updates({...initialFilters(),mode:filters.mode})}}>重置筛选</button></div>
          <div className="review-results" ref={resultsRef}>{(filters.mode==='story'?stories:groups).map((name,i)=>{
            const list=visibleResults.filter(p=>(filters.mode==='story'?p.story:p.group)===i)
            return list.length?<section key={name}><h3>{name} <small>{list.length}</small></h3>
              {filters.mode==='story'&&!normalizedReviewQuery&&<><p className="review-story-copy">{storyDescriptions[i]}</p><ol className="review-story-steps">{storySteps[i].map((step,j)=><li key={j}>{step.map((part,k)=>typeof part==='string'?part:<button key={k} className="review-story-feature" data-status={data.records[part.id].status} title={`${data.records[part.id].status} · 定位原型`} onClick={()=>focusPoint(part.id)}>{part.id} {part.label??points.find(p=>p.id===part.id)!.title}</button>)}</li>)}</ol></>}
              {list.map(p=><article className={`review-point ${lastViewed===p.id?'is-last-viewed':''}`} key={p.id}><button className="review-point-open" onClick={()=>focusPoint(p.id)}><b>{markMatch(p.id)}</b> {markMatch(p.title)}</button><div className="review-point-meta"><select className="review-quick-status" aria-label={`${p.id} 合规状态`} data-status={data.records[p.id].status} value={data.records[p.id].status} onChange={e=>quickStatus(p.id,e.target.value as Status)}>{statuses.map(s=><option key={s}>{s}</option>)}</select><span>{data.records[p.id].priority}</span><button className="review-point-detail" aria-label={`${p.id} 审核详情`} onClick={()=>select(p.id)}>详情 · 备注 {data.records[p.id].history.filter(h=>h.note).length}</button></div></article>)}
            </section>:null
          })}{!visibleResults.length&&<p className="review-empty">没有符合筛选条件的功能点。</p>}</div>
        </>}
        {message&&<div className="review-message" role="status">{message}<button aria-label="关闭提示" onClick={()=>setMessage('')}>×</button></div>}
        {prdMode?<div className="reading-prd-status" role="status">{sharedPrd.status}</div>:<footer><button onClick={()=>protect(exportFile)}><img src="/assets/reading/download.svg" alt=""/>导出</button><button onClick={()=>protect(()=>fileRef.current?.click())}><img src="/assets/reading/upload.svg" alt=""/>导入</button><small>本机保存 · 原型审核</small></footer>}
        <input ref={fileRef} hidden type="file" accept=".json,application/json" onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void importFile(file)}}/>
      </>}
    </aside>
    {guard&&createPortal(<div className="review-modal-backdrop"><div className="review-modal" role="dialog" aria-modal="true" aria-label="保存审核修改"><h2>保存审核修改？</h2><p>当前功能还有未保存的状态、优先级或备注。</p><div><button autoFocus onClick={()=>setGuard(null)}>继续编辑</button><button onClick={()=>{const action=guard;setGuard(null);setNote('');if(current){setStatus(current.status);setPriority(current.priority)}action()}}>放弃修改</button><button className="review-primary" onClick={()=>{if(save()){const action=guard;setGuard(null);action()}}}>保存并继续</button></div></div></div>,document.body)}
    {incoming&&createPortal(<div className="review-modal-backdrop"><div className="review-modal" role="dialog" aria-modal="true" aria-label="导入审核记录">
      <h2>导入审核记录</h2><p>包含 {Object.keys(incoming.records).length} 项，其中 {changed.length} 项与本机不同。匹配项将被覆盖，其他项保留。</p>
      <div className="review-import-diff">{changed.map(id=><article key={id}>
        <p><b>{id}</b> {data.records[id].status} / {data.records[id].priority} → {incoming.records[id].status} / {incoming.records[id].priority}<br/>历史 {data.records[id].history.length} → {incoming.records[id].history.length} 条</p>
        <details><summary>查看历史与备注差异</summary>{(['本机记录','导入记录'] as const).map((name,i)=><section key={name}><h4>{name}</h4>{(i?incoming:data).records[id].history.length===0?<p>暂无修改记录</p>:(i?incoming:data).records[id].history.map((h,j)=><p key={j}>{new Date(h.at).toLocaleString('zh-CN')}<br/>{h.from} → {h.to} · {h.fromPriority} → {h.toPriority}<br/>{h.note||'无备注'}</p>)}</section>)}</details>
      </article>)}</div>
      <button onClick={exportFile}>导出当前备份</button><div><button autoFocus onClick={()=>setIncoming(null)}>取消</button><button className="review-primary" onClick={()=>{if(persist({version:1,records:{...data.records,...incoming.records}})){setIncoming(null);setSelected(null);setMessage('审核记录已导入。')}}}>确认导入</button></div>
    </div></div>,document.body)}
  </>
}
