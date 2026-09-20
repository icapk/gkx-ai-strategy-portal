import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { annotationSources, type AnnotationInput, type AnnotationBindings, type AnnotationContext } from './model.ts'
import { annotationRelationSources, resolveLinks, setAnnotationRelation } from './relations.ts'
import type { AnnotationFeature, AnnotationRange } from './uiTypes.ts'

export function AnnotationComposer({ initial, features, relationContext, relationsOnly, onRemove, onSave, onClose, onRedraw, range, error, drawing, onGuardChange }: {
  initial: AnnotationInput; features: AnnotationFeature[]; relationContext: AnnotationContext; relationsOnly?: boolean; range?: AnnotationRange
  onSave: (input: AnnotationInput) => boolean | Promise<boolean>; onRemove?:()=>Promise<boolean>; onClose: () => void; onRedraw: () => void; error?: string
  drawing?: boolean; onGuardChange?: (guard: ((action: () => void) => void) | null) => void
}) {
  const [draft, setDraft] = useState<AnnotationInput>(() => structuredClone(initial)), [query, setQuery] = useState(''), [savingError, setSavingError] = useState('')
  const [bindings, setBindings] = useState<AnnotationBindings>(() => { const value = { directG: [...initial.directG], directD: [...initial.directD], linkedG: [...(initial.linkedG ?? [])], linkedD: [...(initial.linkedD ?? [])], excludedG: initial.excludedG, excludedD: initial.excludedD }; return { ...value, ...resolveLinks(value, relationContext) } })
  const [bindingsChanged, setBindingsChanged] = useState(false)
  const [saving,setSaving]=useState(false)
  const [expanded, setExpanded] = useState({ compliance: !!relationsOnly, prd: !!relationsOnly })
  const bindingsRef = useRef<HTMLElement>(null)
  useEffect(() => { if (relationsOnly) bindingsRef.current?.scrollIntoView({ block: 'nearest' }) }, [relationsOnly])
  const previousFocus = useRef(document.activeElement as HTMLElement | null)
  const [pendingLeave, setPendingLeave] = useState<(() => void) | null>(null)
  useEffect(() => () => previousFocus.current?.focus(), [])
  const dirty = bindingsChanged || JSON.stringify(draft) !== JSON.stringify(initial) || JSON.stringify(range) !== JSON.stringify(initial.range)
  const guard = (action: () => void) => { if (dirty) setPendingLeave(() => action); else action() }
  const close = () => {if(!saving)guard(onClose)}
  useEffect(() => { onGuardChange?.(guard); return () => onGuardChange?.(null) }, [dirty, onGuardChange])
  useEffect(() => {
    const unload = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = '' } }
    window.addEventListener('beforeunload', unload)
    return () => window.removeEventListener('beforeunload', unload)
  }, [dirty])
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (document.querySelector('.annotation-draw-layer')) return
      if (e.key === 'Tab') {
        const nodes = [...document.querySelectorAll<HTMLElement>(pendingLeave ? '.annotation-confirm button' : '.annotation-composer button:not(:disabled),.annotation-composer input,.annotation-composer textarea,.annotation-composer select')]
        if (e.shiftKey && document.activeElement === nodes[0]) { e.preventDefault(); nodes.at(-1)?.focus() }
        else if (!e.shiftKey && document.activeElement === nodes.at(-1)) { e.preventDefault(); nodes[0]?.focus() }
      }
    }
    window.addEventListener('keydown', key)
    return () => { window.removeEventListener('keydown', key) }
  })
  const toggle = (feature: AnnotationFeature) => {
    const selected = (feature.kind === 'compliance' ? bindings.linkedG : bindings.linkedD).includes(feature.id)
    setBindings(value => setAnnotationRelation(value, relationContext, feature.kind, feature.id, !selected))
    setBindingsChanged(true)
  }
  const matches = features.filter(f => `${f.id} ${f.title}`.toLowerCase().includes(query.toLowerCase()))
  return createPortal(<div className="annotation-dialog-backdrop" style={drawing ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}><form className="annotation-composer" role="dialog" aria-modal="true" aria-label="编辑注释" onKeyDown={e => { if (e.key === 'Escape' && !drawing) { e.preventDefault(); e.stopPropagation(); if (pendingLeave) setPendingLeave(null); else close() } }} onSubmit={async e => { e.preventDefault(); if(saving)return; if (!draft.title.trim() || !draft.body.trim()) { setSavingError('请填写标题和正文。'); return }; setSaving(true);try { if (await onSave({ ...draft, ...(bindingsChanged ? bindings : {}), range, title: draft.title.trim(), body: draft.body.trim() })) onClose() } catch (err) { setSavingError(err instanceof Error ? err.message : '保存失败，内容已保留。') } finally {setSaving(false)} }}>
    <header><h2>编辑注释</h2><button type="button" aria-label="关闭注释编辑" disabled={saving} onClick={close}>×</button></header>
    <label>标题<input disabled={saving} autoFocus required value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></label>
    <label>正文<textarea disabled={saving} required rows={6} value={draft.body} onChange={e => setDraft({ ...draft, body: e.target.value })} placeholder="写下修改建议、补充意见或处理结论" /></label>
    <label>来源<select disabled={saving} value={draft.source ?? '我的注释'} onChange={e => setDraft({ ...draft, source: e.target.value as AnnotationInput['source'] })}>{annotationSources.map(s => <option key={s}>{s}</option>)}</select></label>
    <div className="annotation-tools"><span>{range?.regions.length ? `已保存 ${range.regions.length} 个框选区域` : '尚无框选范围，可先保存注释'}</span><button type="button" disabled={saving} onClick={onRedraw}>重新框选</button></div>
    <section ref={bindingsRef} className="annotation-bindings"><h3>关联功能点</h3><input aria-label="查找关联功能点" placeholder="搜索功能编号或名称" value={query} onChange={e => setQuery(e.target.value)} /><div className="annotation-binding-columns">{(['compliance', 'prd'] as const).map(kind => {
      const ids = kind === 'compliance' ? bindings.linkedG : bindings.linkedD
      return <div key={kind}><button type="button" className="annotation-binding-toggle" aria-expanded={expanded[kind]} onClick={() => setExpanded(old => ({ ...old, [kind]: !old[kind] }))}>{kind === 'compliance' ? '合规功能点' : 'PRD 功能点'} · 已选 {ids.length} ▾</button>
      <div className="annotation-selected-relations">{ids.map(id => { const feature = features.find(f => f.kind === kind && f.id === id); const sources = annotationRelationSources(bindings, relationContext, kind, id); const description = [sources.direct ? '直接选择' : '', sources.automaticFrom.length ? `由 ${sources.automaticFrom.map(s => features.find(f => f.kind === s.kind && f.id === s.id)?.displayNumber ?? s.id).join('、')} 补齐` : '', sources.historical ? '历史关联' : ''].filter(Boolean).join('；'); return <span key={id} title={`${id} · ${description}`}>{feature?.displayNumber ?? id} {feature?.title ?? '失效功能点'}<small>{description}</small><button type="button" aria-label={`取消关联 ${id}`} onClick={() => { setBindings(value => setAnnotationRelation(value, relationContext, kind, id, false)); setBindingsChanged(true) }}>×</button></span> })}</div>
      {(expanded[kind] || query) && <div className="annotation-binding-options" aria-label={kind === 'compliance' ? '合规多选列表' : 'PRD多选列表'}>{matches.filter(f => f.kind === kind).map(f => <label key={f.id}><input type="checkbox" checked={ids.includes(f.id)} onChange={() => toggle(f)} /><span title={f.id}>{f.displayNumber ?? f.id} {f.title}</span></label>)}{!matches.some(f => f.kind === kind) && <p>没有匹配的功能点</p>}</div>}</div>
    })}</div></section>
    <p className="annotation-hint">框选不猜测关联。手选后只补齐直接一层；取消自动项会同时取消使其出现的直接选择，只影响这条注释。</p>
    {(error || savingError) && <p role="alert">{savingError || error}</p>}
    <footer>{onRemove&&<button type="button" className="annotation-remove" disabled={saving} onClick={async()=>{setSaving(true);try{if(await onRemove())onClose()}finally{setSaving(false)}}}>移除注释</button>}<button type="button" disabled={saving} onClick={close}>取消</button><button type="submit" disabled={saving}>{saving?'保存中…':'保存注释'}</button></footer>
    {pendingLeave && <div className="annotation-confirm-backdrop"><section className="annotation-confirm" role="alertdialog" aria-modal="true" aria-label="放弃尚未保存的注释内容"><h3>放弃尚未保存的注释内容？</h3><p>继续编辑会保留当前草稿；放弃修改后将离开编辑。</p><div className="annotation-tools"><button autoFocus type="button" onClick={() => setPendingLeave(null)}>继续编辑</button><button type="button" onClick={() => { const action = pendingLeave; setPendingLeave(null); action() }}>放弃修改</button></div></section></div>}
  </form></div>, document.body)
}


