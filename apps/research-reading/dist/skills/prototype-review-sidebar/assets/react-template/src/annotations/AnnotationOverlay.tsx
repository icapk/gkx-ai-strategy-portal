import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { layoutAnnotationPins } from './pinLayout.ts'
import type { Annotation } from './model.ts'
import type { TargetFrame } from '../prototypeFocus/geometry.ts'
import { sidebarEdge, sidebarBottom } from '../prototypeFocus/geometry.ts'
import { rangeFrames, currentAnnotationContext, savedRangeMatchesContext } from './location.ts'
import type { AnnotationRange } from './uiTypes.ts'

export function AnnotationOverlay({ items, selectedId, pageContext, onOpen }: { items: Annotation[]; selectedId: string | null; pageContext?: string; onOpen: (id: string) => void }) {
  const [positions, setPositions] = useState<Array<{ item: Annotation; frames: TargetFrame[] }>>([])
  useEffect(() => {
    let raf = 0, previous = ''
    const update = () => {
      const next = items.filter(item => savedRangeMatchesContext(item.range, pageContext ?? currentAnnotationContext(item.product))).map(item => ({ item, frames: rangeFrames(item.range as AnnotationRange) })).filter(p => p.frames.length)
      const key = JSON.stringify(next.map(p => [p.item.id, p.item.number, p.item.title, p.frames]))
      if (key !== previous) { previous = key; setPositions(next) }
      raf = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(raf)
  }, [items, pageContext])
  const pins = layoutAnnotationPins(positions.map(p => ({ ...p.frames[0], top: Math.max(sidebarBottom() + 12, p.frames[0].top) })), window.innerWidth, window.innerHeight, sidebarEdge(), sidebarBottom())
  return createPortal(<div className="annotation-overlay" aria-label="原型注释标记">{positions.map(({ item, frames }, index) => {
    return <div key={item.id}>{selectedId === item.id && frames.map((f, i) => <div className="annotation-range" style={f} key={i} />)}<button className={`annotation-pin ${selectedId === item.id ? 'is-selected' : ''}`} style={pins[index]} title={`注释 ${item.number}：${item.title}`} aria-label={`注释 ${item.number}：${item.title}`} onClick={() => onOpen(item.id)}>{item.number}</button></div>
  })}</div>, document.body)
}

export function AnnotationDrawing({ onFinish, onCancel }: { onFinish: (frame: TargetFrame) => void; onCancel: () => void }) {
  const [start, setStart] = useState<{ x: number; y: number } | null>(null), [end, setEnd] = useState<{ x: number; y: number } | null>(null)
  const [error, setError] = useState('')
  const [insets, setInsets] = useState(() => ({ left: sidebarEdge(), top: sidebarBottom() }))
  useEffect(() => {
    const update = () => setInsets(previous => { const next = { left: sidebarEdge(), top: sidebarBottom() }; return previous.left === next.left && previous.top === next.top ? previous : next })
    const observer = new ResizeObserver(update)
    document.querySelectorAll('.reading-review').forEach(el => observer.observe(el))
    window.addEventListener('resize', update); update()
    return () => { observer.disconnect(); window.removeEventListener('resize', update) }
  }, [])
  useEffect(() => { const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); if (start) { setStart(null); setEnd(null) } else onCancel() } }; window.addEventListener('keydown', escape, true); return () => window.removeEventListener('keydown', escape, true) }, [start, onCancel])
  return createPortal(<div className="annotation-draw-layer" style={insets} tabIndex={0} ref={el => el?.focus()} aria-label="框选注释范围"
    onPointerDown={e => { if ((e.target as Element).closest('button')) return; if (e.clientX < sidebarEdge() || e.clientY < sidebarBottom()) { setError('请在原型内容区框选，避开评审侧栏。'); return }; e.currentTarget.setPointerCapture(e.pointerId); setStart({ x: e.clientX, y: e.clientY }); setEnd({ x: e.clientX, y: e.clientY }) }}
    onPointerMove={e => { if (start) setEnd({ x: e.clientX, y: e.clientY }) }}
    onPointerUp={e => { if (!start) return; const box = { left: Math.min(start.x, e.clientX), top: Math.min(start.y, e.clientY), width: Math.abs(e.clientX - start.x), height: Math.abs(e.clientY - start.y) }; setStart(null); setEnd(null); if (box.width < 6 || box.height < 6 || box.left < sidebarEdge() || box.top < sidebarBottom()) { setError('请在原型区拖画至少 6 像素的范围。'); return }; e.currentTarget.style.pointerEvents = 'none'; onFinish(box); e.currentTarget.style.pointerEvents = '' }}>
    {error && <div className="annotation-draw-help"><p role="alert">{error}</p></div>}
    {start && end && <div className="annotation-range" style={{ left: Math.min(start.x, end.x), top: Math.min(start.y, end.y), width: Math.abs(end.x - start.x), height: Math.abs(end.y - start.y) }} />}
  </div>, document.body)
}

