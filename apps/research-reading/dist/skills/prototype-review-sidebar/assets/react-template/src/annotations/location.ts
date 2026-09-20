import { clippedTargetFrame, type TargetFrame } from '../prototypeFocus/geometry.ts'
import { elementSelector } from '../prototypeFocus/manual.ts'
import type { PrototypeModule, PrototypeTarget } from '../prototypeFocus/types.ts'
import type { AnnotationRange } from './uiTypes.ts'
import { captureAnnotationRestore, equalAnnotationRestore } from './restoration.ts'

export function currentAnnotationContext(product: PrototypeModule): string | undefined {
  return (product === 'reading' ? document.querySelector('#reading-product-panel')?.getAttribute('data-annotation-context') : undefined) ?? document.querySelector(`[data-annotation-product="${product}"]`)?.getAttribute('data-annotation-context') ?? undefined
}
export function rangeFrames(range?: AnnotationRange): TargetFrame[] {
  if (!range) return []
  return range.regions.flatMap(region => {
    try {
      const el = document.querySelector<HTMLElement>(region.selector)
      if (!el || el.closest('.annotation-overlay,.annotation-composer,.reading-review,.prototype-focus-layer')) return []
      const bounds = el.getBoundingClientRect(), clip = clippedTargetFrame(el, el.closest('.modal-backdrop') ? 0 : undefined)
      if (!clip) return []
      const left = Math.max(clip.left, bounds.left + bounds.width * region.x), top = Math.max(clip.top, bounds.top + bounds.height * region.y)
      const right = Math.min(clip.left + clip.width, bounds.left + bounds.width * (region.x + region.width)), bottom = Math.min(clip.top + clip.height, bounds.top + bounds.height * (region.y + region.height))
      return right > left && bottom > top ? [{ left, top, width: right - left, height: bottom - top }] : []
    } catch { return [] }
  })
}
export function rangeMatchesContext(range?: AnnotationRange, pageContext?: string): boolean {
  if (!range || !pageContext) return false
  if (range.pageContext) return range.pageContext === pageContext
  try {
    const current = JSON.parse(pageContext), target = range.target
    const readingView = target.readingView === 'antenna-reader' ? 'reader' : target.readingView
    return (!current.product || current.product === target.product) && (!target.section || target.section === current.section) && (!target.tab || target.tab === current.tab) && (!target.teamTab || target.teamTab === current.teamTab) && (!readingView || readingView === current.view) && (!target.surface || target.surface === current.surface) && (!target.modal || target.modal === current.modal)
  } catch { return false }
}
export function savedRangeMatchesContext(range?: AnnotationRange, pageContext?: string): boolean {
  if (range?.restore) return equalAnnotationRestore(range.restore, captureAnnotationRestore(range.target.product))
  if (!rangeMatchesContext(range, pageContext)) return false
  if (range?.pageContext) return true
  // Old imported snapshots cannot identify the document behind a generic selector.
  try { const current = JSON.parse(pageContext!); return current.documentId == null && current.view !== 'reader' && !['pdf', 'editor', 'table', 'preview'].includes(current.surface) } catch { return false }
}
export function captureAnnotationRange(box: TargetFrame, product: PrototypeModule, target?: PrototypeTarget, pageContext?: string): AnnotationRange | undefined {
  if (box.width < 6 || box.height < 6) return undefined
  const elements = document.elementsFromPoint(box.left + box.width / 2, box.top + box.height / 2).filter(el => !el.closest('.annotation-draw-layer,.annotation-composer,.annotation-overlay,.reading-review,.prototype-focus-layer,.manual-focus-editor'))
  let anchor = elements[0]
  while (anchor && anchor !== document.body && anchor !== document.documentElement) {
    const r = anchor.getBoundingClientRect()
    if (r.left <= box.left && r.top <= box.top && r.right >= box.left + box.width && r.bottom >= box.top + box.height) {
      const focus = anchor.getAttribute('data-focus-id')
      const selector = focus ? `[data-focus-id="${CSS.escape(focus)}"]` : elementSelector(anchor)
      return { restore: captureAnnotationRestore(product), target: target ?? { product }, pageContext: pageContext ?? currentAnnotationContext(product), regions: [{ selector, label: (anchor.getAttribute('aria-label') || anchor.tagName).slice(0, 80), x: (box.left - r.left) / r.width, y: (box.top - r.top) / r.height, width: box.width / r.width, height: box.height / r.height }] }
    }
    anchor = anchor.parentElement as Element
  }
  return undefined
}

