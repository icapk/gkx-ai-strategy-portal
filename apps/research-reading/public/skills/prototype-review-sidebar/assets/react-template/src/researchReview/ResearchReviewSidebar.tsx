import {productLabels} from '../sidebar.config.ts'
import {localStorage} from '../storage.ts'
import {ComplianceEditor} from '../ComplianceEditor.tsx'
import {DemoDataControls} from '../components/DemoDataControls.tsx'
import {useProductAnnotations} from '../annotations/useProductAnnotations.ts'
import {AnnotationWorkspace} from '../annotations/AnnotationWorkspace.tsx'
import {FeatureAnnotationSection} from '../annotations/FeatureAnnotationSection.tsx'
import {ReviewActions,useReviewCatalog} from '../reviewControls.tsx'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { groups, points as catalogPoints, statuses, priorities, initialFilters, matches, loadReview, parseReview, STORAGE_KEY, type ReviewFile, type Status, type Priority } from './model.ts'
import '../readingReview/review.css'
import './review.css'
import { usePrototypeFocus } from '../prototypeFocus/FocusContext.tsx'
import { PrdWorkspace } from './PrdWorkspace.tsx'
import { useSharedPrd } from './useSharedPrd.ts'

export function ResearchReviewSidebar() {
  const {points:basePoints,numbering,parentNumber}=useReviewCatalog('research',catalogPoints)
  const { requestFocus, cancelFocus, request:reviewFocusRequest } = usePrototypeFocus()
  const [loaded] = useState(loadReview)
  const [data,setData]=useState(loaded.data)
  const savedReview=useRef(localStorage.getItem(STORAGE_KEY))
  const points=basePoints.map(p=>({...p,title:data.records[p.id]?.title??p.title,requirement:data.records[p.id]?.requirement??p.requirement,acceptance:data.records[p.id]?.acceptance??p.acceptance}))
  const [editing,setEditing]=useState<string|null>(null)
  const editGuard=useRef<null|((action:()=>void)=>void)>(null)
  const [filters,setFilters]=useState<ReturnType<typeof initialFilters>>(()=>({...initialFilters(),mode:new URLSearchParams(window.location.search).get('review')==='annotations'?'annotations':new URLSearchParams(window.location.search).get('review')==='prd'?'prd':'design'}))
  const [prdQuery,setPrdQuery]=useState('')
  const [prdView,setPrdView]=useState({chapter:'overview',opened:[] as string[]})
  const {book:prdBook,save:savePrdBook,status:prdStatus,notice:prdNotice}=useSharedPrd()
  const annotations=useProductAnnotations('research',prdBook,points)
  const [collapsed,setCollapsed]=useState(()=>new URLSearchParams(location.search).get('reviewOpen')!=='1'&&window.innerWidth<1280)
  const [selected,setSelected]=useState<string|null>(null)
  const [lastViewed,setLastViewed]=useState<string|null>(null)
  const [reviewQuery,setReviewQuery]=useState('')
  const [annotationQuery,setAnnotationQuery]=useState('')
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
  const protect=(action:()=>void)=>{if(editGuard.current){editGuard.current(action);return}const proceed=()=>{dirty?setGuard(()=>action):action()};if(annotations.leaveGuard.current)annotations.leaveGuard.current(proceed);else proceed()}
  const modeUrl=(mode:string)=>{const url=new URL(location.href);url.searchParams.set('review',mode);history.replaceState(null,'',url)}
  useEffect(()=>{const mode=reviewFocusRequest?.target?.reviewMode;if(mode&&reviewFocusRequest?.module==='research')protect(()=>{setCollapsed(false);setFilters(f=>({...f,mode}));modeUrl(mode)})},[reviewFocusRequest?.sequence])
  const openAnnotation=(id:string)=>protect(()=>{setSelected(null);setNote('');annotations.setOpenId(id);setFilters(f=>({...f,mode:'annotations'}));modeUrl('annotations')})
  const createAnnotation=(kind:'compliance'|'prd',id:string)=>protect(()=>{setSelected(null);setNote('');annotations.setCreateRequest({key:Date.now(),kind,id});setFilters(f=>({...f,mode:'annotations'}));modeUrl('annotations')})
  const openAnnotationFeature=(kind:'compliance'|'prd',id:string)=>protect(()=>{if(kind==='compliance'){if(!data.records[id]){setMessage('该功能点已不存在');return}setReviewQuery('');setFilters({...initialFilters(),mode:'design'});modeUrl('design');select(id)}else{const area=prdBook.revisions.find(v=>v.id===prdBook.current)?.areas.find(a=>a.features.some(f=>f.id===id));if(!area){setMessage('该功能点已不存在');return}setSelected(null);setNote('');setPrdQuery('');setPrdView({chapter:area.id,opened:[id]});setFilters(f=>({...f,mode:'prd'}));modeUrl('prd')}})
  useEffect(()=>{const restore=()=>{const mode=new URLSearchParams(location.search).get('review');protect(()=>setFilters(f=>({...f,mode:mode==='prd'?'prd':mode==='annotations'?'annotations':'design'})))};window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore)})
  useEffect(()=>{
    if(!dirty)return
    const unload=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue=''}
    const click=(e:MouseEvent)=>{
      const target=e.target instanceof Element?e.target.closest<HTMLButtonElement>('.product-tabs button[role="tab"][aria-selected="false"]'):null
      if(target&&!bypass.current){e.preventDefault();e.stopPropagation();setGuard(()=>()=>{bypass.current=true;target.click();bypass.current=false})}
    }
    window.addEventListener('beforeunload',unload)
    document.addEventListener('click',click,true)
    return()=>{window.removeEventListener('beforeunload',unload);document.removeEventListener('click',click,true)}
  },[dirty])
  const persist=(next:ReviewFile)=>{
    try {if(loaded.error)throw Error('损坏记录不能覆盖');if(localStorage.getItem(STORAGE_KEY)!==savedReview.current){setMessage('另一窗口已更新审核记录，请导出草稿并刷新后核对。');return false}next={...next,records:Object.fromEntries(Object.entries(next.records).map(([id,r])=>[id,{...r,history:[]}]))};localStorage.setItem(STORAGE_KEY,JSON.stringify(next));savedReview.current=JSON.stringify(next);setData(next);return true}
    catch{setMessage('保存失败：本地存储不可用或空间不足，编辑内容仍保留。');return false}
  }
  const save=()=>{
    if(!selected||!current)return true
    if(!dirty)return true
    const next={version:1 as const,records:{...data.records,[selected]:{status,priority,history:[]}}}
    if(!persist(next))return false
    setNote('');setMessage('审核记录已保存。')
    if(point&&!matches(point,next,filters)){setSelected(null);setMessage('已保存，该功能已移出当前筛选结果。')}
    return true
  }
  useEffect(()=>{if(selected)return;requestAnimationFrame(()=>{if(resultsRef.current)resultsRef.current.scrollTop=resultsScroll.current})},[selected])
  const select=(id:string)=>protect(()=>{resultsScroll.current=resultsRef.current?.scrollTop??resultsScroll.current;setLastViewed(id);setSelected(id);setStatus(data.records[id].status);setPriority(data.records[id].priority);setNote('')})
  const locate=(id:string)=>protect(()=>{const p=points.find(p=>p.id===id);if(!p)return;setLastViewed(id);if(window.innerWidth<1280)setCollapsed(true);requestFocus(id,p.title,'research')})
  const quickStatus=(id:string,nextStatus:Status)=>{
    const previous=data.records[id]
    if(previous.status===nextStatus)return
    const next:ReviewFile={version:1,records:{...data.records,[id]:{...previous,status:nextStatus,history:[]}}}
    if(persist(next))setMessage(`${id} 已改为${nextStatus}${matches(points.find(p=>p.id===id)!,next,filters)?'':'，已移出当前筛选结果'}。`)
  }
  const exportFile=()=>{
    const url=URL.createObjectURL(new Blob([JSON.stringify({...data,exportedAt:new Date().toISOString(),catalog:points},null,2)],{type:'application/json'}))
    const a=document.createElement('a');a.href=url;a.download='智能科研审核记录.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
  }
  const importFile=async(file:File)=>{
    try{if(file.size>10_000_000)throw new Error('文件超过10MB。');setIncoming(parseReview(JSON.parse(await file.text())))}
    catch(e){setMessage(e instanceof Error?e.message:'导入文件无法读取。')}
  }
  const visible=points.filter(p=>matches(p,data,filters))
  const normalizedReviewQuery=reviewQuery.trim().toLowerCase()
  const reviewMatch=(p:typeof points[number])=>!normalizedReviewQuery || `${numbering(p)} ${p.title} ${p.parentTitle}`.toLowerCase().includes(normalizedReviewQuery)
  const visibleResults=visible.filter(reviewMatch)
  const count=(ignore:Parameters<typeof matches>[3],condition:(p:typeof points[number])=>boolean)=>points.filter(p=>matches(p,data,filters,ignore)&&reviewMatch(p)&&condition(p)).length
  const hierarchyCount=(group:string,parent=filters.parent,child=filters.child)=>count('hierarchy',p=>(!group||p.group===Number(group))&&(!parent||p.parent===parent)&&(!child||p.id===child))
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
    <aside className={`reading-review research-review ${filters.mode==='prd'||filters.mode==='annotations'?'is-prd':''} ${collapsed?'is-collapsed':''}`} aria-label={productLabels.research+'评审'}>
      {collapsed?<button className="review-expand" title="展开评审" aria-label="展开评审" onClick={()=>setCollapsed(false)}><img src="/assets/reading/outline.svg" alt=""/><span>评审</span></button>:<>
        <header><nav className="review-product-switch" aria-label="切换产品"><button aria-pressed={true} onClick={()=>protect(()=>{const url=new URL(location.href);url.searchParams.set("view","research");url.searchParams.set("reviewOpen","1");location.assign(url.href)})}>{productLabels.research}</button><button aria-pressed={false} onClick={()=>protect(()=>{const url=new URL(location.href);url.searchParams.set("view","reading");url.searchParams.set("reviewOpen","1");location.assign(url.href)})}>{productLabels.reading}</button></nav><button title="收起侧栏" aria-label="收起评审侧栏" onClick={()=>protect(()=>setCollapsed(true))}>‹</button></header>
        <div className="review-top-tools">
          <label className="review-mode-select"><select aria-label="评审模式" value={filters.mode} onChange={e=>{const mode=e.target.value as typeof filters.mode;protect(()=>{cancelFocus();setSelected(null);setNote('');setFilters(f=>({...f,mode}));const url=new URL(location.href);url.searchParams.set('review',mode);history.replaceState(null,'',url)})}}><option value="design">合规审查模式</option><option value="prd">PRD模式</option><option value="annotations">注释模式</option></select></label>
          <label className="review-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg><input aria-label={filters.mode==='annotations'?'搜索注释':filters.mode==='prd'?'搜索PRD全文':'搜索功能编号或标题'} value={filters.mode==='annotations'?annotationQuery:filters.mode==='prd'?prdQuery:reviewQuery} onChange={e=>filters.mode==='annotations'?setAnnotationQuery(e.target.value):filters.mode==='prd'?setPrdQuery(e.target.value):setReviewQuery(e.target.value)} placeholder={filters.mode==='annotations'?'搜索编号、标题或正文':filters.mode==='prd'?'搜索需求、规则或状态':'搜索编号或标题'}/></label>
        </div>
        {editing&&points.find(p=>p.id===editing)?<ComplianceEditor onGuard={guard=>{editGuard.current=guard}} key={editing} point={points.find(p=>p.id===editing)!} record={data.records[editing]} product="research" features={prdBook?.revisions.find(v=>v.id===prdBook?.current)?.areas.flatMap(a=>a.features)||[]} linked={data.records[editing].relationIds??(prdBook?.revisions.find(v=>v.id===prdBook?.current)?.areas.flatMap(a=>a.features).filter(f=>f.compliance?.includes(editing)).map(f=>f.id)||[])} onCancel={()=>{editGuard.current=null;setEditing(null)}} onSave={patch=>{if(!persist({version:1,records:{...data.records,[editing]:{...data.records[editing],...patch,history:[]}}}))return false;setSelected(editing);setStatus((patch.status??data.records[editing].status));setPriority(patch.priority??data.records[editing].priority);editGuard.current=null;setEditing(null);return true}}/>:filters.mode==='annotations'?<AnnotationWorkspace query={annotationQuery} product="research" version={annotations.version} features={annotations.catalog} store={annotations.store} openId={annotations.openId} onOpened={()=>annotations.setOpenId(null)} createRequest={annotations.createRequest} onCreateHandled={()=>annotations.setCreateRequest(null)} onOpenFeature={openAnnotationFeature} onGuardChange={guard=>{annotations.leaveGuard.current=guard}}/>:filters.mode==='prd'?<PrdWorkspace annotationTools={f=><FeatureAnnotationSection kind="prd" id={f.id} items={annotations.store.items} onOpen={openAnnotation} onCreate={()=>createAnnotation('prd',f.id)}/>} book={prdBook} onBookChange={savePrdBook} query={prdQuery} view={prdView} onViewChange={setPrdView} onClearQuery={()=>setPrdQuery('')} onCompliance={id=>{if(!data.records[id]){setMessage('该合规项已不存在，请修改关联。');return}setFilters({...initialFilters(),mode:'design'});modeUrl('design');select(id)}} onLocate={(id,label)=>protect(()=>{if(window.innerWidth<1280)setCollapsed(true);requestFocus(id,label,'research')})}/>:point&&current?<div className="review-detail">
          <div className="compliance-detail-heading"><strong>合规详情</strong><small>{groups[point.group]} / {point.parentTitle}</small><button className="review-back" onClick={()=>protect(()=>{setSelected(null);setNote('')})}>‹ 返回功能列表</button></div>
          <div className="review-feature-title"><h2>{numbering(point)} {point.title}</h2><ReviewActions point={point} product="research" onLocate={()=>locate(point.id)} onRename={()=>protect(()=>setEditing(point.id))}/></div>
          <div className="annotation-badges"><span data-status={current.status}>{current.status}</span><span>{current.priority}</span></div><section className="compliance-body"><h3>需规摘录</h3><p>{point.requirement}</p></section>
          <section className="compliance-related"><h3>关联功能点</h3>{prdBook.revisions.find(v=>v.id===prdBook.current)!.areas.flatMap(area=>area.features.filter(f=>(current.relationIds?current.relationIds.includes(f.id):f.compliance?.includes(point.id))).map(f=><button className="prd-related" key={f.id} onClick={()=>protect(()=>{setSelected(null);setNote('');setPrdQuery('');setPrdView({chapter:area.id,opened:[f.id]});setFilters(s=>({...s,mode:'prd'}));modeUrl('prd')})}>{f.id} {f.title} →</button>))}{!prdBook.revisions.find(v=>v.id===prdBook.current)!.areas.some(a=>a.features.some(f=>(current.relationIds?current.relationIds.includes(f.id):f.compliance?.includes(point.id))))&&<p>当前版本未关联 · 待核对</p>}</section>
          <FeatureAnnotationSection kind="compliance" id={point.id} items={annotations.store.items} onOpen={openAnnotation} onCreate={()=>createAnnotation('compliance',point.id)}/>
          
        </div>:<>
          <div className="review-filters">
            <div className="review-hierarchy">
              <label>一级功能<select aria-label="一级功能" value={filters.group} onChange={e=>updates({group:e.target.value,parent:'',child:''})}><option value="">全部 {hierarchyCount('')}</option>{groups.map((g,i)=><option value={String(i)} key={g}>{i+1}. {g} {hierarchyCount(String(i))}</option>)}</select></label>
              <label>二级功能<select aria-label="二级功能" disabled={!filters.group} value={filters.parent} onChange={e=>updates({parent:e.target.value,child:''})}><option value="">全部 {hierarchyCount(filters.group,'')}</option>{parents.map(p=><option key={p.parent} value={p.parent}>{parentNumber(p)} {p.parentTitle} {hierarchyCount(filters.group,p.parent)}</option>)}</select></label>
              <label>三级功能<select aria-label="三级功能" disabled={!filters.parent||!children.length} value={filters.child} onChange={e=>updates({child:e.target.value})}><option value="">{filters.parent&&!children.length?'无三级功能':'全部'} {hierarchyCount(filters.group,filters.parent,'')}</option>{children.map(p=><option key={p.id} value={p.id}>{numbering(p)} {p.title} {hierarchyCount(filters.group,filters.parent,p.id)}</option>)}</select></label>
            </div>
            <div className="review-status-inline" role="group" aria-label="合规状态"><strong>合规状态</strong><label><input type="checkbox" checked={filters.statuses.length===3} onChange={e=>updates({statuses:e.target.checked?[...statuses]:[]})}/>全选 {count('status',()=>true)}</label><div>{statuses.map(s=><label key={s}><input type="checkbox" checked={filters.statuses.includes(s)} onChange={()=>updates({statuses:toggle(filters.statuses,s)})}/>{s} {count('status',p=>data.records[p.id].status===s)}</label>)}</div></div>
            <div className="review-status-inline review-priority-inline" role="group" aria-label="优先级"><strong>优先级</strong><label><input type="checkbox" checked={filters.priorities.length===3} onChange={e=>updates({priorities:e.target.checked?[...priorities]:[]})}/>全选 {count('priority',()=>true)}</label><div>{priorities.map(s=><label key={s}><input type="checkbox" checked={filters.priorities.includes(s)} onChange={()=>updates({priorities:toggle(filters.priorities,s)})}/>{s} {count('priority',p=>data.records[p.id].priority===s)}</label>)}</div></div>
          </div>
          <div className="review-results" ref={resultsRef}>{groups.map((name,i)=>{
            const list=visibleResults.filter(p=>p.group===i)
            return list.length?<section key={name}><h3>{i+1}. {name} <small>{list.length}</small></h3>
              {list.map(p=><article className={`review-point ${lastViewed===p.id?'is-last-viewed':''}`} key={p.id}><div className="review-feature-title"><button className="review-point-open" onClick={()=>select(p.id)}><b>{markMatch(numbering(p))}</b> {markMatch(p.title)}</button><ReviewActions point={p} product="research" onLocate={()=>locate(p.id)} onRename={()=>protect(()=>setEditing(p.id))}/></div><div className="review-point-meta"><select className="review-quick-status" aria-label={numbering(p)+' 合规状态'} data-status={data.records[p.id].status} value={data.records[p.id].status} onChange={e=>quickStatus(p.id,e.target.value as Status)}>{statuses.map(s=><option data-status={s} key={s}>{s}</option>)}</select><span>{data.records[p.id].priority}</span><button className="review-point-detail" aria-label={numbering(p)+' 审核详情'} onClick={()=>select(p.id)}>详情</button></div></article>)}
            </section>:null
          })}{!visibleResults.length&&<p className="review-empty">没有符合筛选条件的功能点。</p>}</div>
        </>}
        {prdNotice&&filters.mode==='prd'&&<div className="review-message" role="status">{prdNotice}</div>}
        {message&&<div className="review-message" role="status">{message}<button aria-label="关闭提示" onClick={()=>setMessage('')}>×</button></div>}
        <div className="review-bottom-tools"><div id="research-review-version"/><div className="review-bottom-action-row">{filters.mode==='design'&&<><button onClick={()=>protect(exportFile)}>导出合规审查结果</button><button onClick={()=>protect(()=>fileRef.current?.click())}>导入合规审查结果</button></>}<div id="research-review-tools"/><DemoDataControls product="research"/></div></div>
        <input ref={fileRef} hidden type="file" accept=".json,application/json" onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void importFile(file)}}/>
      </>}
    </aside>
    {guard&&createPortal(<div className="review-modal-backdrop"><div className="review-modal" role="dialog" aria-modal="true" aria-label="保存审核修改"><h2>保存审核修改？</h2><p>当前功能还有未保存的状态、优先级或备注。</p><div><button autoFocus onClick={()=>setGuard(null)}>继续编辑</button><button onClick={()=>{const action=guard;setGuard(null);setNote('');if(current){setStatus(current.status);setPriority(current.priority)}action()}}>放弃修改</button><button className="review-primary" onClick={()=>{if(save()){const action=guard;setGuard(null);action()}}}>保存并继续</button></div></div></div>,document.body)}
    {incoming&&createPortal(<div className="review-modal-backdrop"><div className="review-modal" role="dialog" aria-modal="true" aria-label="导入审核记录">
      <h2>导入审核记录</h2><p>包含 {Object.keys(incoming.records).length} 项，其中 {changed.length} 项与本机不同。匹配项将被覆盖，其他项保留。</p>
      <div className="review-import-diff">{changed.map(id=><article key={id}>
        <p><b>{id}</b> {data.records[id].status} / {data.records[id].priority} → {incoming.records[id].status} / {incoming.records[id].priority}</p>
        
      </article>)}</div>
      <button onClick={exportFile}>导出当前备份</button><div><button autoFocus onClick={()=>setIncoming(null)}>取消</button><button className="review-primary" onClick={()=>{if(persist({version:1,records:{...data.records,...incoming.records}})){setIncoming(null);setSelected(null);setMessage('审核记录已导入。')}}}>确认导入</button></div>
    </div></div>,document.body)}
  </>
}

