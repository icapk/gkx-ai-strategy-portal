export interface TargetFrame { left: number; top: number; width: number; height: number }

export function sidebarEdge() {
  return Math.max(0, ...Array.from(document.querySelectorAll<HTMLElement>('.reading-review')).filter(el => el.getClientRects().length).map(el => { const rect = el.getBoundingClientRect(); return rect.width >= window.innerWidth - 40 && rect.height < window.innerHeight * .55 ? 0 : rect.right }))
}

export function sidebarBottom() {
  return Math.max(0, ...Array.from(document.querySelectorAll<HTMLElement>('.reading-review')).filter(el => el.getClientRects().length).map(el => { const rect = el.getBoundingClientRect(); return rect.width >= window.innerWidth - 40 && rect.height < window.innerHeight * .55 ? rect.bottom : 0 }))
}

export function clippedTargetFrame(element: HTMLElement, minimumLeft = sidebarEdge()): TargetFrame | null {
  if (!element.isConnected || element.closest('[inert],[aria-hidden="true"]')) return null
  const bounds = element.getBoundingClientRect()
  const ownStyle = getComputedStyle(element)
  if (ownStyle.visibility === 'hidden' || ownStyle.display === 'none' || ownStyle.opacity === '0') return null
  let left = Math.max(minimumLeft, bounds.left), top = Math.max(sidebarBottom(), bounds.top)
  let right = Math.min(window.innerWidth, bounds.right), bottom = Math.min(window.innerHeight, bounds.bottom)
  let fixed = ownStyle.position === 'fixed'
  for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
    const style = getComputedStyle(parent)
    if (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0') return null
    const fixedRoot = style.transform !== 'none' || style.perspective !== 'none' || style.filter !== 'none' || (style.backdropFilter && style.backdropFilter !== 'none') || /paint|layout|strict|content/.test(style.contain) || /transform|perspective|filter/.test(style.willChange)
    if (fixed && !fixedRoot) continue
    fixed = false
    const rect = parent.getBoundingClientRect()
    if (/(auto|scroll|hidden|clip)/.test(style.overflowX)) { left = Math.max(left, rect.left); right = Math.min(right, rect.right) }
    if (/(auto|scroll|hidden|clip)/.test(style.overflowY)) { top = Math.max(top, rect.top); bottom = Math.min(bottom, rect.bottom) }
    if (style.position === 'fixed') fixed = true
  }
  // Clip content beneath an overlapping sticky table header without clipping the header itself.
  const table = element.closest('table')
  const header = table?.querySelector('thead')
  if (header && !header.contains(element) && /sticky|fixed/.test(getComputedStyle(header).position)) top = Math.max(top, header.getBoundingClientRect().bottom)
  return right > left + 1 && bottom > top + 1 ? {left, top, width:right-left, height:bottom-top} : null
}
