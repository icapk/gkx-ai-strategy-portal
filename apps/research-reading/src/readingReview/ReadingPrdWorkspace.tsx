import {useEffect,useState} from 'react'
import {PrdPanel} from '../researchReview/PrdPanel'
import {PrdEditor} from '../researchReview/PrdEditor'
import {comparePrd,reviseFeature} from '../researchReview/prdStore'
import type {PrdFeature} from '../researchReview/prd'
import {readingOverview} from './catalog'
import {points} from './model'
import {readingLocations} from '../prototypeFocus/readingTargets'
import {installReadingMappings} from '../prototypeFocus/manual'
import {ReadingManualEditor} from './ReadingManualEditor'
import {downloadReading,readingMarkdown,type ReadingBook} from './prdBook'
import '../researchReview/review.css'
import './prd.css'
function rememberedView(){try{const v=JSON.parse(sessionStorage.getItem('reading-prd-view-v1')||'null');return v&&typeof v.chapter==='string'&&Array.isArray(v.opened)&&v.opened.every((x:unknown)=>typeof x==='string')?v:{chapter:'overview',opened:[]}}catch{return {chapter:'overview',opened:[]}}}

export function ReadingDifference({before,after}:{before?:PrdFeature;after?:PrdFeature}){
 const text=(f?:PrdFeature)=>f?[`${f.id} ${f.title}`,`${f.priority} · ${f.release}`,...(f.rules??[]).map(g=>`${g.title}\n${g.items.map((s,i)=>`${i+1}. ${s}`).join('\n')}`),`合规：${f.compliance?.join('、')||'无'}`,`原型：${f.links.map(l=>l.id).join('、')}`,`人工框选：${f.manual?JSON.stringify(f.manual):'系统建议'}`].join('\n\n'):'（无）'
 return <div className="prd-difference"><section><h4>修改前</h4><pre>{text(before)}</pre><h4>修改后</h4><pre>{text(after)}</pre></section></div>
}
export function ReadingPrdWorkspace({book,revisionNumber,save,query,clearQuery,opened,onOpened,onCompliance,onLocate}:{book:ReadingBook;revisionNumber:number;save:(b:ReadingBook,expected:number)=>Promise<boolean>;query:string;clearQuery:()=>void;opened:string|null;onOpened:()=>void;onCompliance:(id:string)=>void;onLocate:(id:string,label:string)=>void}){
 const [version,setVersion]=useState(()=>{try{return sessionStorage.getItem('reading-prd-version-v1')||'current'}catch{return 'current'}}),[view,setView]=useState<{chapter:string;opened:string[]}>(rememberedView),[priority,setPriority]=useState(''),[history,setHistory]=useState(false),[compare,setCompare]=useState(book.current)
 useEffect(()=>{try{sessionStorage.setItem('reading-prd-version-v1',version)}catch{}},[version])
 useEffect(()=>{try{sessionStorage.setItem('reading-prd-view-v1',JSON.stringify(view))}catch{}},[view])
 const [editing,setEditing]=useState<{area:string;feature:PrdFeature;before?:PrdFeature;baseline:number;book:ReadingBook}|null>(null),[boxing,setBoxing]=useState<{feature:PrdFeature;area:string;baseline:number;book:ReadingBook}|null>(null)
 const [creating,setCreating]=useState<{baseline:number;book:ReadingBook}|null>(null),[name,setName]=useState(''),[plan,setPlan]=useState(''),[error,setError]=useState('')
 const revision=book.revisions.find(r=>r.id===(version==='current'?book.current:version))??book.revisions.find(r=>r.id===book.current)!,editable=revision.id===book.current
 useEffect(()=>{if(!opened)return;const v=book.revisions.find(r=>r.id===book.current)!,area=v.areas.find(a=>a.features.some(f=>f.id===opened));if(area){setVersion(v.id);setHistory(false);clearQuery();setPriority('');setView({chapter:area.id,opened:[opened]})}onOpened()},[opened])
 useEffect(()=>{installReadingMappings(Object.fromEntries(revision.areas.flatMap(a=>a.features).filter(f=>f.manual).map(f=>[f.id,f.manual!])));return()=>installReadingMappings({})},[revision])
 const areaOf=(id:string)=>revision.areas.find(a=>a.features.some(f=>f.id===id))!.id
 const begin=(f?:PrdFeature)=>setEditing({area:f?areaOf(f.id):view.chapter,feature:f??{id:`READ-CUSTOM-${crypto.randomUUID().slice(0,8)}`,title:'',priority:'P1',release:revision.name,purpose:'',behavior:'',contract:'',current:'',acceptance:[],rules:[{title:'',items:['']}],links:[],compliance:[]},before:f,baseline:revisionNumber,book:structuredClone(book)})
 const exportVersion=()=>downloadReading(`智能阅读-PRD-${revision.name}.md`,readingMarkdown(revision.areas,revision.name,revision.plan))
 return <div className="prd-panel reading-prd-workspace">
 <nav className="prd-navigation"><label>版本<select aria-label="PRD版本" value={revision.id} onChange={e=>{setVersion(e.target.value);setView({chapter:'overview',opened:[]})}}>{book.revisions.map(v=><option key={v.id} value={v.id}>{v.name}{v.id===book.current?' · 当前':''}</option>)}</select></label>
 <div className="prd-toolbar"><button onClick={()=>setHistory(!history)}>{history?'返回需求':'版本与改动记录'}</button><button onClick={()=>{setCreating({baseline:revisionNumber,book:structuredClone(book)});setName('');setPlan('')}}>创建大版本</button><button onClick={exportVersion}>导出 Markdown</button><span>{readingMarkdown(revision.areas,revision.name,revision.plan).replace(/\s/g,'').length} 字</span></div>
 <label>优先级<select aria-label="PRD优先级筛选" value={priority} onChange={e=>setPriority(e.target.value)}><option value="">全部</option>{['P0','P1','P2'].map(p=><option key={p}>{p}</option>)}</select></label></nav>
 {error&&<p className="reading-prd-error" role="alert">{error}</p>}
 {creating&&<form className="prd-version-form" onSubmit={async e=>{e.preventDefault();if(!name.trim()||!plan.trim())return;if(creating.book.revisions.some(v=>v.name===name.trim())){setError('版本名已存在');return}const id=crypto.randomUUID(),next:ReadingBook={...creating.book,current:id,revisions:[...creating.book.revisions,{...structuredClone(revision),id,name:name.trim(),plan:plan.trim(),at:new Date().toISOString(),changes:[]}]};if(await save(next,creating.baseline)){setVersion(id);setCreating(null);setError('')}else setError('创建未保存，名称和规划保留；请核对共享版本后重新创建。')}}><h3>从 {revision.name} 创建大版本</h3><label>版本名称<input aria-label="新版本名称" required value={name} onChange={e=>setName(e.target.value)}/></label><label>版本规划<textarea aria-label="版本规划" required value={plan} onChange={e=>setPlan(e.target.value)}/></label><button type="button" onClick={()=>{if(!name&&!plan||confirm('放弃未保存的版本规划？'))setCreating(null)}}>取消</button><button type="submit">创建并设为当前版本</button></form>}
 {history?<div className="prd-document"><h2>版本与改动记录</h2><p>{revision.plan}</p><small>{new Date(revision.at).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai'})} · 北京时间</small><button onClick={()=>downloadReading('智能阅读-PRD完整备份.json',JSON.stringify(book,null,2),'application/json')}>导出版本记录</button><label>对比版本<select aria-label="对比版本" value={compare} onChange={e=>setCompare(e.target.value)}>{book.revisions.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select></label><h3>版本差异</h3>{comparePrd(book.revisions.find(v=>v.id===compare)?.areas??[],revision.areas).map(d=><details key={d.id}><summary>{d.id} · {!d.before?'新增':!d.after?'删除':'修改'}</summary><ReadingDifference {...d}/></details>)}<h3>本版本小修改 · {revision.changes.length}</h3>{[...revision.changes].reverse().map(c=><details key={c.id}><summary>{c.after?.title??c.before?.title} · {c.reason}</summary><p>{new Date(c.at).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai'})} · 北京时间</p><ReadingDifference before={c.before} after={c.after}/></details>)}</div>:<>
 {editable&&view.chapter!=='overview'&&<button className="prd-add" onClick={()=>begin()}>新增功能点</button>}
 <PrdPanel product="智能阅读" overview={readingOverview} source="依据：智能阅读需规、用户评审批注及当前5174阅读原型。" query={query} onClearQuery={clearQuery} view={view} onViewChange={setView} onLocate={onLocate} catalog={revision.areas.map(a=>({...a,features:a.features.filter(f=>!priority||f.priority===priority)}))} versionLabel={revision.name} extraOverview={<><h3>本版规划</h3><p>{revision.plan}</p><p>P0 核心必需 · P1 重要能力 · P2 体验优化，均可经评审调整。</p></>} featureTools={f=><><h4>关联合规项</h4><div className="prd-links">{f.compliance?.length?f.compliance.map(id=><button key={id} onClick={()=>onCompliance(id)}>{id} → 合规详情</button>):<span>未关联合规项</span>}</div><div className="prd-toolbar">{editable&&<><button onClick={()=>begin(f)}>编辑需求与关联</button><button onClick={()=>setBoxing({feature:f,area:areaOf(f.id),baseline:revisionNumber,book:structuredClone(book)})}>手动框选 / 校正</button><button onClick={async()=>{const reason=prompt(`删除 ${f.id}？请输入原因，历史保留。`);if(reason?.trim()&&!await save(reviseFeature(book,areaOf(f.id),f,undefined,reason) as ReadingBook,revisionNumber))setError('删除未保存，共享内容已变化或服务不可用。')}}>删除功能点</button></>}</div></>}/>
 </>}
 {editing&&<PrdEditor feature={editing.feature} compliancePoints={points} locations={readingLocations} onClose={()=>setEditing(null)} onSave={async(f,reason)=>{if(!f.links.length)throw Error('请至少关联一个真实原型入口。');if(JSON.stringify(f.links)!==JSON.stringify(editing.before?.links))f={...f,manual:undefined};return save(reviseFeature(editing.book,editing.area,editing.before,f,reason) as ReadingBook,editing.baseline)}}/>}
 {boxing&&<ReadingManualEditor feature={boxing.feature} onClose={()=>setBoxing(null)} onSave={(manual,reason)=>save(reviseFeature(boxing.book,boxing.area,boxing.feature,{...boxing.feature,manual},reason) as ReadingBook,boxing.baseline)}/>}
 </div>
}
