import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { targets } from './targets'
import { visibleElements, type PointLocation } from './locations'
import { clippedTargetFrame } from './geometry'
import { prepareAuditMenus } from './prepare'

export interface AuditRequest { targetId: string; label: string; sequence: number; missing?: boolean; location?: PointLocation; pointCode?: string }
interface AuditContextValue { request: AuditRequest | null; navigate: (targetId: string, label: string, missing?: boolean, location?: PointLocation, pointCode?: string) => void }
const AuditContext = createContext<AuditContextValue>({ request: null, navigate: () => {} })
export const useAudit = () => useContext(AuditContext)
interface Frame { left: number; top: number; width: number; height: number }

export function AuditProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<AuditRequest | null>(null)
  const [feedback, setFeedback] = useState('选择审核目录中的功能，定位到原型对应区域')
  const [frames, setFrames] = useState<Frame[]>([])
  const serial = useRef(0)
  useEffect(() => {
    if (!request) return
    let frame = 0, timer = 0, cancelled = false
    let elements: HTMLElement[] = []
    let resize: ResizeObserver | undefined
    let lastFrames = ''
    const selectors = request.location?.selectors ?? [`[data-compliance-target="${request.targetId}"]`]
    const started = performance.now()
    const prepared = new Set<string>()
    setFrames([])
    setFeedback(`正在定位 · ${request.label}`)
    const context = request.location?.contextOnly ?? request.missing
    const successFeedback = `${context ? request.missing ? '功能缺失，以下为相关位置' : '相关操作位置（条件待验证）' : '对应功能'} · ${request.label} · ${request.location?.description ?? targets[request.targetId].label} · 已标注`
    const fail = () => setFeedback(`未能显示具体目标 · ${request.label} · ${request.location?.prerequisite ?? '当前数据或界面状态不满足定位条件'}；未使用整页替代`)
    const framesForElements = () => {
      const minimumLeft = document.querySelector('.audit-sidebar')?.getBoundingClientRect().right ?? 0
      return elements.filter(e => e.isConnected && e.getClientRects().length && !e.closest('[hidden], [inert]') && getComputedStyle(e).visibility !== 'hidden' && selectors.some(selector => e.matches(selector))).map(e => clippedTargetFrame(e, minimumLeft)).filter((rect): rect is Frame => rect !== null)
    }
    const measure = () => {
      if (cancelled) return
      if (selectors.some(selector => !elements.some(element => element.matches(selector) && visibleElements(selector).includes(element)))) {
        window.cancelAnimationFrame(frame)
        window.clearTimeout(timer)
        stopMarking()
        setFrames([])
        setFeedback(`目标已隐藏或发生变化 · ${request.label}，请在对应结果出现后重新定位`)
        cancelled = true
        return
      }
      const nextFrames = framesForElements()
      const signature = JSON.stringify(nextFrames)
      if (signature !== lastFrames) {
        lastFrames = signature
        setFrames(nextFrames)
        setFeedback(nextFrames.length ? successFeedback : `目标已移出可见范围 · ${request.label}，滚动回对应位置可继续查看标注`)
      }
    }
    const track = () => { measure(); if (!cancelled) frame = window.requestAnimationFrame(track) }
    const stopMarking = () => {
      elements.forEach(e => e.classList.remove('audit-target-highlight'))
      resize?.disconnect()
      window.removeEventListener('scroll', measure, true)
      window.removeEventListener('resize', measure)
    }
    const find = () => {
      if (cancelled) return
      if (request.pointCode && !request.location) {
        setFeedback(`精细定位尚未复审 · ${request.label}，已切换相关页面`)
        return
      }
      if (!prepareAuditMenus(request.location, prepared)) {
        if (performance.now() - started < 3500) frame = window.requestAnimationFrame(find)
        else fail()
        return
      }
      let groups: HTMLElement[][]
      try { groups = selectors.map(visibleElements) } catch {
        setFeedback(`定位配置无效 · ${request.label}`); return
      }
      if (groups.length && groups.every(group => group.length)) {
        elements = [...new Set(groups.flat())]
        let attempts = 0
        const reveal = () => {
          if (cancelled) return
          // Wait for the destination's own layout/scroll effects before revealing audit targets.
          groups.forEach(group => group[0].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'auto' }))
          frame = window.requestAnimationFrame(() => {
            if (cancelled) return
            if (!framesForElements().length) {
              if (++attempts < 3) frame = window.requestAnimationFrame(reveal)
              else fail()
              return
            }
            elements.forEach(e => e.classList.add('audit-target-highlight'))
            measure()
            if (cancelled) return
            frame = window.requestAnimationFrame(track)
            resize = new ResizeObserver(measure)
            elements.forEach(e => resize?.observe(e))
            window.addEventListener('scroll', measure, true)
            window.addEventListener('resize', measure)
            timer = window.setTimeout(() => { cancelled = true; window.cancelAnimationFrame(frame); stopMarking(); setFrames([]) }, 4200)
          })
        }
        frame = window.requestAnimationFrame(() => { frame = window.requestAnimationFrame(reveal) })
      } else if (performance.now() - started < 3500) {
        frame = window.requestAnimationFrame(find)
      } else {
        fail()
      }
    }
    frame = window.requestAnimationFrame(() => { frame = window.requestAnimationFrame(find) })
    return () => {
      cancelled = true; window.cancelAnimationFrame(frame); window.clearTimeout(timer); stopMarking()
    }
  }, [request])
  return <AuditContext.Provider value={{ request, navigate: (targetId, label, missing, location, pointCode) => {
    const destination = location?.navigationTarget ?? targetId
    if (!targets[destination]) { setFeedback(`目标未配置 · ${label}`); return }
    setRequest({ targetId: destination, label, missing, location, pointCode, sequence: ++serial.current })
  } }}>
    {children}
    <div className="audit-location-feedback" role="status" aria-live="polite" title={feedback}>{feedback}</div>
    {createPortal(<div className="audit-highlight-layer" aria-hidden="true">{frames.map((rect, index) => <div className="audit-highlight-frame" key={index} style={rect} />)}</div>, document.body)}
  </AuditContext.Provider>
}
