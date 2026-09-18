import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { researchLocations, researchTargets } from './researchTargets'
import { readingLocations, readingTargets } from './readingTargets'
import { clippedTargetFrame, sidebarEdge, type TargetFrame } from './geometry'
import { prepareFocus } from './prepare'
import type { PrototypeFocusRequest, PrototypeModule } from './types'
import './focus.css'
import { readManual, readReadingManual } from './manual'

interface FocusApi {
  request: PrototypeFocusRequest | null
  requestFocus: (id: string, label: string, module: PrototypeModule) => void
  ready: (sequence: number) => void
  reject: (sequence: number, message: string) => void
  cancelFocus: () => void
}
const FocusContext = createContext<FocusApi | null>(null)
export function usePrototypeFocus() {
  const value = useContext(FocusContext)
  if (!value) throw new Error('PrototypeFocusProvider is required')
  return value
}

export function PrototypeFocusProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<PrototypeFocusRequest | null>(null)
  const [prepared, setPrepared] = useState(0)
  const [frames, setFrames] = useState<TargetFrame[]>([])
  const [feedback, setFeedback] = useState('')
  const [phase, setPhase] = useState('idle')
  const sequence = useRef(0)
  const active = useRef<PrototypeFocusRequest | null>(null)
  const requestFocus = useCallback((id: string, label: string, module: PrototypeModule) => {
    const [featureId,baseId]=id.split('::')
    const manual=module==='research'?readManual(featureId):readReadingManual(featureId)
    const location = manual?{navigationTarget:'manual',selectors:manual.regions.map(r=>r.selector),description:'人工校正区域',timeoutMs:6000,prepare:manual.prepare}:(module === 'research' ? researchLocations : readingLocations)[baseId??id]
    const target = manual?.target??(location ? (module === 'research' ? researchTargets : readingTargets)[location.navigationTarget] : undefined)
    const next = {id, label, module, location, target, manual, sequence: ++sequence.current}
    active.current = next
    setPrepared(0); setFrames([]); setPhase('preparing'); setFeedback(`${id} ${label}：正在准备对应视图`); setRequest(next)
  }, [])
  const cancelFocus = useCallback(() => { active.current = null; setRequest(null); setPrepared(0); setFrames([]); setFeedback(''); setPhase('idle') }, [])
  const reject = useCallback((seq: number, message: string) => {
    if (active.current?.sequence !== seq) return
    active.current = null; setPrepared(0); setFrames([]); setPhase('failed'); setFeedback(message)
  }, [])
  const ready = useCallback((seq: number) => { if (active.current?.sequence === seq) setPrepared(seq) }, [])

  useEffect(() => {
    const root = document.documentElement
    let raf = 0
    const update = () => { root.style.setProperty('--prototype-review-edge', `${sidebarEdge()}px`); raf = requestAnimationFrame(update) }
    update()
    return () => { cancelAnimationFrame(raf); root.style.removeProperty('--prototype-review-edge') }
  }, [])

  useEffect(() => {
    if (!request || active.current?.sequence !== request.sequence) return
    const {sequence: seq, location} = request
    if (!location?.selectors.length || !request.target) { reject(seq, `${request.id}：暂无可定位的设计目标`); return }
    if (prepared !== seq) {
      const timer = window.setTimeout(() => reject(seq, `${request.id}：视图准备超时，请确认当前文档或先处理未保存内容`), location.timeoutMs ?? 6000)
      return () => clearTimeout(timer)
    }
    let raf = 0, foundAt = 0, lastGeometry = '', scrolled = false, closed = false
    const start = performance.now()
    const observed = new Set<HTMLElement>()
    const observer = new ResizeObserver(() => { lastGeometry = '' })
    const changed = () => { lastGeometry = '' }
    window.addEventListener('scroll', changed, true)
    window.addEventListener('resize', changed)
    const finish = (message: string) => { closed = true; reject(seq, message) }
    const tick = (now: number) => {
      if (closed || active.current?.sequence !== seq) return
      if (foundAt && [...observed].some(element => !element.isConnected)) { finish(`${request.id}：原定位目标已离开当前视图，请重新定位`); return }
      if (new URLSearchParams(locationSearch()).get('view') !== request.module) { cancelFocus(); return }
      try {
        const isPrepared = prepareFocus(location.prepare)
        const groups = location.selectors.map(selector => Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(el => !el.closest(request.module==='reading'&&location.navigationTarget==='reading-review'?'.prototype-focus-layer':'.reading-review,.prototype-focus-layer') && el.getClientRects().length && !el.closest('[inert],[aria-hidden="true"]')))
        const missing = groups.map((items, index) => items.length ? null : index + 1).filter(Boolean)
        if (isPrepared && !missing.length) {
          const elements = Array.from(new Set(groups.flat()))
          if (!scrolled) {
            // Scroll each target's own containers, never activate business controls.
            elements.forEach(el => el.scrollIntoView({block:'nearest', inline:'nearest', behavior:'instant'}))
            scrolled = true
            raf = requestAnimationFrame(tick); return
          }
          const manual=request.manual
          const boxes = manual?manual.regions.map(region=>{
            const el=document.querySelector<HTMLElement>(region.selector)
            if(!el)return null
            const bounds=el.getBoundingClientRect(),clip=clippedTargetFrame(el)
            if(!clip)return null
            const left=Math.max(clip.left,bounds.left+bounds.width*region.x),top=Math.max(clip.top,bounds.top+bounds.height*region.y)
            const right=Math.min(clip.left+clip.width,bounds.left+bounds.width*(region.x+region.width)),bottom=Math.min(clip.top+clip.height,bounds.top+bounds.height*(region.y+region.height))
            return right>left&&bottom>top?{left,top,width:right-left,height:bottom-top}:null
          }):elements.map(el => clippedTargetFrame(el,request.module==='reading'&&location.navigationTarget==='reading-review'?0:undefined))
          if (boxes.every((box): box is TargetFrame => box !== null)) {
            if (!foundAt) { foundAt = now; setPhase(location.contextOnly ? 'context' : 'focused'); setFeedback(`${request.id} ${request.label}：${location.contextOnly ? '相关位置 · ' : ''}${location.description}${location.prerequisite ? '；' + location.prerequisite : ''}`) }
            for (const el of elements) if (!observed.has(el)) { observer.observe(el); observed.add(el) }
            const geometry = JSON.stringify(boxes)
            if (geometry !== lastGeometry) { setFrames(boxes); lastGeometry = geometry }
          } else if (foundAt) { finish(`${request.id}：目标已移出可见范围，请再次点击功能点定位`); return }
        } else if (foundAt) { finish(`${request.id}：目标已隐藏或离开当前视图`); return }
        if (foundAt && now - foundAt >= 6000) { cancelFocus(); return }
        if (!foundAt && now - start > (location.timeoutMs ?? 3500)) {
          finish(`${request.id}：目标未出现或不可见${missing.length ? '（目标 ' + missing.join('、') + '）' : ''}。${location.prerequisite ?? '请确认当前页面具备对应内容。'}`); return
        }
      } catch { finish(`${request.id}：定位配置无法执行，请检查目标映射`); return }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { closed = true; cancelAnimationFrame(raf); observer.disconnect(); window.removeEventListener('scroll', changed, true); window.removeEventListener('resize', changed) }
  }, [request, prepared, reject, cancelFocus])

  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') cancelFocus() }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [cancelFocus])
  return <FocusContext.Provider value={{request, requestFocus, ready, reject, cancelFocus}}>{children}{createPortal(
    <div className="prototype-focus-layer" data-phase={phase} data-sequence={request?.sequence}>
      {frames.map((frame,index) => <div key={index} className="prototype-focus-frame" style={frame} data-context={request?.location?.contextOnly || undefined} />)}
      {feedback && <div className="prototype-focus-feedback" role="status"><span>{feedback}</span><button type="button" aria-label="取消功能定位" onClick={cancelFocus}>×</button></div>}
    </div>, document.body)}</FocusContext.Provider>
}
function locationSearch() { return window.location.search }
