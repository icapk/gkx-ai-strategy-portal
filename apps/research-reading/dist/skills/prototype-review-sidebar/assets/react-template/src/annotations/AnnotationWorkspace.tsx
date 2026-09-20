import {runtime} from '../sidebar.config.ts'
import {displayMinute} from '../displayFormat.ts'
import { annotationUpdateTime, annotationUpdateDay, compareAnnotations } from './presentation.ts'
import {RangeCorrectionEditor} from '../prototypeFocus/RangeCorrectionEditor.tsx'
import {facetCount} from '../facetCounts.ts'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ReviewBottomTools } from '../researchReview/PrdPresentation.tsx'
import { captureAnnotationRestore } from './restoration.ts'
import { annotationSources, annotationStatuses, shanghaiDate, type Annotation, type AnnotationInput } from './model.ts'
import { parseAnnotationFile } from './importExport.ts'
import { AnnotationComposer } from './AnnotationComposer.tsx'
import { AnnotationDrawing, AnnotationOverlay } from './AnnotationOverlay.tsx'
import { captureAnnotationRange, currentAnnotationContext, rangeMatchesContext, rangeFrames, savedRangeMatchesContext } from './location.ts'
import { usePrototypeFocus } from '../prototypeFocus/FocusContext.tsx'
import type { AnnotationRange, AnnotationWorkspaceProps } from './uiTypes.ts'
import './annotations.css'

type Editor = { initial: AnnotationInput; original?: Annotation; range?: AnnotationRange; relationsOnly?: boolean }
export function AnnotationWorkspace({ product, version, features, store, openId, onOpened, createRequest, onCreateHandled, onOpenFeature, pageContext, currentTarget, onGuardChange, query = '' }: AnnotationWorkspaceProps) {
  const [correcting,setCorrecting]=useState<Annotation|null>(null)
  const [showRemoved,setShowRemoved]=useState(false)
  const [sort,setSort]=useState<{key:'updated'|'number';direction:'asc'|'desc'}>({key:'updated',direction:'desc'})
  const editorGuard=useRef<((action:()=>void)=>void)|null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editor, setEditor] = useState<Editor | null>(null), [drawing, setDrawing] = useState(false)
  const [annotating, setAnnotating] = useState(false)
  const [markersVisible, setMarkersVisible] = useState(true)
  const [status, setStatus] = useState(''), [source, setSource] = useState(''), [day, setDay] = useState(''), [relation, setRelation] = useState('')
  const [message, setMessage] = useState(''), [pendingImport, setPendingImport] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const { requestSnapshotFocus, cancelFocus } = usePrototypeFocus()
  const workspaceRef=useRef<HTMLDivElement>(null)
  const listScroll=useRef(0), wasDetail=useRef(false)
  const selected = store.items.find(a => a.id === selectedId)
  useLayoutEffect(()=>{const node=workspaceRef.current;if(!node)return;const detail=!!selected&&!showRemoved;if(detail&&!wasDetail.current)node.scrollTop=0;else if(!detail&&wasDetail.current)node.scrollTop=listScroll.current;wasDetail.current=detail},[selected?.id,showRemoved])
  const context = () => pageContext ?? currentAnnotationContext(product)
  useEffect(() => { if (openId) { setSelectedId(openId); onOpened?.() } }, [openId, onOpened])
  useEffect(() => {
    if (!createRequest) return
    const f = features.find(f => f.kind === createRequest.kind && f.id === createRequest.id)
    const range = f?.range && rangeMatchesContext(f.range, context()) && rangeFrames(f.range).length === f.range.regions.length ? structuredClone(f.range) : undefined
    if (range) { if (!range.pageContext) range.pageContext = context(); range.restore = captureAnnotationRestore(product) }
    if (!range) setMessage('当前页面未显示该功能的完整范围，已保留关联；可先保存，或打开对应页面后重新框选。')
    const initial: AnnotationInput = { title: '', body: '', entry: createRequest.kind, directG: createRequest.kind === 'compliance' ? [createRequest.id] : [], directD: createRequest.kind === 'prd' ? [createRequest.id] : [], source: '我的注释', range }
    setEditor({ initial, range }); onCreateHandled?.()
  }, [createRequest?.key])
  useEffect(() => { if (!editor) onGuardChange?.(null); return () => { if (!editor) onGuardChange?.(null) } }, [editor, onGuardChange])
  useEffect(() => { const unload = (event: BeforeUnloadEvent) => { if (drawing) { event.preventDefault(); event.returnValue = '' } }; window.addEventListener('beforeunload', unload); return () => window.removeEventListener('beforeunload', unload) }, [drawing])
  useEffect(() => { if (!annotating || drawing || editor) return; const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setAnnotating(false) } }; window.addEventListener('keydown', escape, true); return () => window.removeEventListener('keydown', escape, true) }, [annotating, drawing, editor])
  const lastFilters = useRef(JSON.stringify([status, source, day, relation, query]))
  useEffect(() => {
    const key = JSON.stringify([status, source, day, relation, query])
    if (lastFilters.current !== key) { setSelectedId(null); cancelFocus(); lastFilters.current = key }
  }, [status, source, day, relation, query, cancelFocus])
  const [rangeNotes, setRangeNotes] = useState<Record<string, string>>({})
  useEffect(() => {
    let frame = 0
    const update = () => {
      const next = Object.fromEntries(store.items.map(a => [a.id, !a.range?.regions.length ? '未保存范围，暂无法显示标记' : !savedRangeMatchesContext(a.range, context()) ? '范围位于其他页面、文档或浮层，可点击定位' : !rangeFrames(a.range).length ? '当前范围不可见或目标已失效，可尝试定位' : '']))
      setRangeNotes(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next)
      frame = requestAnimationFrame(update)
    }
    update(); return () => cancelAnimationFrame(frame)
  }, [store.items, pageContext, product])
  const dates = [...new Set(store.items.map(annotationUpdateDay))].sort().reverse()
  const needle = query.trim().toLocaleLowerCase()
  const annotationFilters={status,source,day,relation}
  const matchAnnotation=(a:Annotation,f:typeof annotationFilters)=>(!needle || [String(a.number), '#' + a.number, a.id, a.title, a.body].some(value => value.toLocaleLowerCase().includes(needle))) && (!f.relation || store.relationState(a) === f.relation) && (!f.status || a.status === f.status) && (!f.source || a.source === f.source) && (!f.day || annotationUpdateDay(a) === f.day)
  const count=(key:keyof typeof annotationFilters,value:string)=>facetCount(store.items,annotationFilters,key,value,matchAnnotation)
  const shown=store.items.filter(a=>matchAnnotation(a,annotationFilters)).sort((a,b)=>compareAnnotations(a,b,sort.key,sort.direction))
  const edit = (a: Annotation, relationsOnly = false) => { cancelFocus(); setDrawing(false); setEditor({ relationsOnly, original: structuredClone(a), initial: { title: a.title, body: a.body, entry: a.entry, source: a.source, directG: [...a.directG], directD: [...a.directD], linkedG: [...a.linkedG], linkedD: [...a.linkedD], excludedG: a.excludedG?.slice(), excludedD: a.excludedD?.slice(), range: a.range && structuredClone(a.range) }, range: a.range && structuredClone(a.range) }) }
  const remove = async(a:Annotation) => { if(!window.confirm('移除此注释？未保存的编辑将放弃，可在“已移除”中恢复已保存的内容。'))return false;const saved=await store.remove(a.id,a.updatedAt);if(saved){setSelectedId(null);cancelFocus();setMessage('已移除，可从底部“已移除”入口恢复。')}return saved }
  const importText = async (text: string, confirmed = false) => {
    try {
      const file = parseAnnotationFile(text, product)
      if (!confirmed && (file.version !== version || file.items.some(a => a.version !== version))) { setPendingImport(text); return }
      if (await store.importFile(text, confirmed)) { setMessage('导入完成。同 ID 正文已追加，来源改为日常协作。'); setPendingImport(null) }
    } catch (e) { setMessage(e instanceof Error ? e.message : '导入失败。') }
  }
  const open = (id: string) => { setShowRemoved(false); setSelectedId(id); setMessage('') }
  return <div className="annotation-workspace" ref={workspaceRef} onScroll={e=>{if(!selected&&!showRemoved)listScroll.current=e.currentTarget.scrollTop}}>
    <div className="annotation-tools annotation-session-row">
      <button disabled={!store.ready || store.busy} data-focus-id="annotation-create" onClick={() => { const action=()=>{cancelFocus();setEditor(null);setAnnotating(!annotating);setDrawing(!annotating)};if(editorGuard.current){setDrawing(false);editorGuard.current(action)}else action() }}>{annotating ? '退出标注状态' : '进入标注状态'}</button>
      {annotating && <div className="annotation-session-toolbar" role="toolbar" aria-label="持续标注工具条"><button type="button" aria-pressed={!drawing} onClick={() => setDrawing(false)}>操作页面</button><button type="button" aria-pressed={drawing} onClick={() => { cancelFocus(); setDrawing(true) }}>框选</button><button type="button" className="annotation-marker-toggle" aria-label={markersVisible ? '隐藏当前页面的注释绿点' : '显示当前页面的注释绿点'} title={markersVisible ? '隐藏当前页面的注释绿点' : '显示当前页面的注释绿点'} aria-pressed={markersVisible} onClick={() => setMarkersVisible(value => !value)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{markersVisible ? <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></> : <><path d="m3 3 18 18M10.6 5.1A12 12 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3 3.8M6.3 6.3A19 19 0 0 0 2 12s3.5 7 10 7a11 11 0 0 0 5-1.2M10 10a3 3 0 0 0 4 4"/></>}</svg></button></div>}
    </div>
    <p className="annotation-hint">{store.ready ? ((runtime.storageMode==='browser')?'注释仅保存在当前浏览器，不影响其他访客。':'注释由本地服务统一保存，浏览器间自动同步。') : '正在连接并迁移注释，请稍候…'}{annotating && ' Esc取消当前动作'}</p>
    <ReviewBottomTools product={product}><div className="annotation-tools" data-focus-id="annotation-transfer"><button disabled={!store.ready || store.busy} onClick={() => fileInput.current?.click()}>导入注释</button><button onClick={() => { const url = URL.createObjectURL(new Blob([store.exportFile()], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = `${product}-annotations-${shanghaiDate(new Date().toISOString())}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setMessage('已导出当前产品的全部注释。') }}>导出注释</button><button onClick={()=>{setShowRemoved(v=>!v);setSelectedId(null)}}>{showRemoved?'返回注释':'已移除'}（{store.removed.length}）</button><input hidden ref={fileInput} type="file" accept=".json,application/json" aria-label="导入注释文件" onChange={async e => { const file = e.target.files?.[0]; e.target.value = ''; if (file) { try { importText(await file.text()) } catch { setMessage('无法读取文件，原记录未改变。') } } }} /></div></ReviewBottomTools>
    {pendingImport && <div className="annotation-notice" role="alert"><p>文件版本与当前版本不一致，框选可能错位。确认仍要导入？</p><button onClick={() => importText(pendingImport, true)}>确认跨版本导入</button><button onClick={() => setPendingImport(null)}>取消导入</button></div>}
    {(message || store.error) && <p className="annotation-notice" role="status">{store.error || message}</p>}
    {(!selected || showRemoved) && <div className="annotation-filters review-filter-grid" data-focus-id="annotation-filters"><label><strong>处理状态</strong><select value={status} onChange={e => setStatus(e.target.value)}><option value="">全部状态（{count('status','')}）</option>{annotationStatuses.map(s => <option key={s} value={s}>{s}（{count('status',s)}）</option>)}</select></label><label><strong>来源</strong><select value={source} onChange={e => setSource(e.target.value)}><option value="">全部来源（{count('source','')}）</option>{annotationSources.map(s => <option key={s} value={s}>{s}（{count('source',s)}）</option>)}</select></label><label><strong>更新日期</strong><select value={day} onChange={e => setDay(e.target.value)}><option value="">全部日期（{count('day','')}）</option>{dates.map(d => <option key={d} value={d}>{d}（{count('day',d)}）</option>)}</select></label><label><strong>关联状态</strong><select value={relation} onChange={e => setRelation(e.target.value)}><option value="">全部（{count('relation','')}）</option><option value="已关联">已关联（{count('relation','已关联')}）</option><option value="未关联">未关联（{count('relation','未关联')}）</option></select></label></div>}
    <div className="annotation-results-heading"><strong>{showRemoved?'已移除注释':selected ? '注释详情' : '注释列表'}</strong>{selected && !showRemoved && <button className="review-back annotation-back" onClick={() => { setSelectedId(null); cancelFocus() }}>‹ 返回注释列表</button>}{!selected && <><div className="annotation-sort">{(['updated','number'] as const).map(key=><button key={key} aria-pressed={sort.key===key} title={(key==='updated'?'更新日期':'序号')+'排序，点击切换方向'} onClick={()=>setSort(old=>({key,direction:old.key===key?(old.direction==='desc'?'asc':'desc'):(key==='updated'?'desc':'asc')}))}>{key==='updated'?'更新日期':'序号'} {sort.key===key?(sort.direction==='desc'?'↓':'↑'):'↕'}</button>)}</div><span>{showRemoved?store.removed.length:shown.length} 条</span></>}</div>
    {showRemoved ? <div className="annotation-list">{[...store.removed].sort((a,b)=>compareAnnotations(a,b,sort.key,sort.direction)).map(a=><article key={a.id} className="annotation-list-row review-card"><strong>#{a.number} {a.title}</strong><p>{a.body}</p><button disabled={store.busy} onClick={async()=>{if(await store.restore(a.id))setMessage('注释已恢复。')}}>恢复注释</button></article>)}{!store.removed.length&&<p>暂无已移除的注释。</p>}</div> : selected ? <section className="annotation-detail" data-focus-id="annotation-detail"><div className="annotation-detail-heading"><h3>#{selected.number} {selected.title}</h3><button disabled={store.busy} onClick={()=>edit(selected)}>编辑</button></div><div className="annotation-badges"><span data-status={selected.status}>{selected.status}</span><span>{store.relationState(selected)}</span><span>{selected.source}</span></div><p className="annotation-body">{selected.body}</p>
      <h4>关联功能点</h4>{(['compliance', 'prd'] as const).map(kind => { const ids = kind === 'compliance' ? selected.linkedG : selected.linkedD; const direct = kind === 'compliance' ? selected.directG : selected.directD; return <div className="annotation-related" key={kind}><strong>{kind === 'compliance' ? '合规' : 'PRD'}</strong>{ids.map(id => { const f = features.find(f => f.kind === kind && f.id === id); return f ? <button key={id} title={id} onClick={() => onOpenFeature(kind, id)}>{f.displayNumber ?? id} {f.title} · {direct.includes(id) ? '直接关联' : '自动补齐'}</button> : <p key={id}>{id} · 功能点已失效（保留记录）</p> })}{!ids.some(id => features.some(f => f.kind === kind && f.id === id)) && <p>尚未关联{kind === 'compliance' ? '合规点' : '设计点'}</p>}</div> })}
      <details className="annotation-record-info" key={selected.id}><summary>记录信息</summary><dl><dt>稳定 ID</dt><dd className="annotation-id">{selected.id}</dd><dt>创建 / 更新（上海时间）</dt><dd>{displayMinute(selected.createdAt)}<br />{displayMinute(selected.updatedAt)}</dd><dt>所属版本</dt><dd>{selected.version}</dd></dl></details>
    </section> : <div className="annotation-list" data-focus-id="annotation-list">{shown.map(a => <article className="annotation-list-row review-card annotation-aligned-card" key={a.id}><div className="annotation-card-heading"><button className="annotation-card-title" onClick={() => open(a.id)}><b>#{a.number}</b> {a.title}</button><div className="annotation-heading-meta"><time tabIndex={0} dateTime={annotationUpdateTime(a)} title={'最近更新：'+displayMinute(annotationUpdateTime(a))}>{annotationUpdateDay(a).slice(5)}</time><span>{store.relationState(a)}</span></div><div className="review-card-actions"><button disabled={!a.range?.regions.length} onClick={() => a.range && requestSnapshotFocus(a.id, a.title, a.range)}>定位</button><button onClick={() => {cancelFocus();setDrawing(false);setCorrecting(structuredClone(a))}}>框选校正</button><button onClick={() => edit(a)}>编辑</button></div></div><div className="annotation-card-controls"><div className="review-card-meta"><label><span className="annotation-control-label">处理状态</span><select data-status={a.status} disabled={!store.ready || store.busy} aria-label={'注释 '+a.number+' 处理状态'} title="可自由切换处理状态" value={a.status} onChange={e => store.update(a.id, { status: e.target.value as Annotation['status'] }, a.updatedAt)}>{annotationStatuses.map(value => <option key={value} data-status={value}>{value}</option>)}</select></label><label><span className="annotation-control-label">来源</span><select aria-label={'注释 '+a.number+' 来源'} value={a.source} onChange={e => store.update(a.id, { source: e.target.value as Annotation['source'] }, a.updatedAt)}>{annotationSources.map(value => <option key={value}>{value}</option>)}</select></label><button className="annotation-remove" disabled={store.busy} onClick={()=>void remove(a)}>移除</button>{rangeNotes[a.id] && <span tabIndex={0} title={rangeNotes[a.id]}>{!a.range?.regions.length ? '未设置框选' : rangeNotes[a.id].startsWith('范围位于') ? '范围不在当前页面' : '当前范围不可见'}</span>}</div></div></article>)}{!shown.length && <p>暂无符合条件的注释。可以新增框选，或从功能点详情加注释。</p>}</div>}
    {annotating && markersVisible && <AnnotationOverlay items={shown} selectedId={selectedId} pageContext={pageContext} onOpen={open} />}
    {editor && <AnnotationComposer key={editor.original?.id ?? 'new'} initial={editor.initial} range={editor.range} relationContext={store.relationContext} relationsOnly={editor.relationsOnly} features={features} error={store.error} drawing={drawing} onGuardChange={guard=>{editorGuard.current=guard;onGuardChange?.(guard)}} onClose={() => { setEditor(null); if (annotating) setDrawing(true) }} onRedraw={() => setDrawing(true)} onRemove={editor.original?()=>remove(editor.original!):undefined} onSave={async input => { if (editor.original) return store.update(editor.original.id, input, editor.original.updatedAt); const item = await store.create(input); if (item) setSelectedId(item.id); return !!item }} />}

    {correcting&&<RangeCorrectionEditor title={'#'+correcting.number+' · '+correcting.title} product={product} initial={correcting.range} notice={!correcting.initialRange?'旧注释未记录更早范围，以本次校正前保存的范围作为初始范围。':undefined} onClose={()=>setCorrecting(null)} onInitial={()=>{const original=correcting.initialRange??correcting.range;if(!original?.regions.length)throw Error('此注释最初没有保存框选范围。');requestSnapshotFocus(correcting.id,correcting.title,original);return original}} onSave={async range=>{const saved=await store.update(correcting.id,{range},correcting.updatedAt);if(saved){if(range.regions.length)requestSnapshotFocus(correcting.id,correcting.title,range);else cancelFocus()}return saved}}/>}
    {drawing && <AnnotationDrawing onCancel={() => setDrawing(false)} onFinish={box => { const range = captureAnnotationRange(box, product, currentTarget, context()); if (!range) { setMessage('无法保存此处范围，请选择完整位于原型内的区域。'); setDrawing(false); return }; const initial: AnnotationInput = { title: '', body: '', source: '我的注释', entry: 'prototype', directG: [], directD: [], range }; setEditor(previous => previous ? { ...previous, range } : { initial, range }); setDrawing(false) }} />}
  </div>
}

