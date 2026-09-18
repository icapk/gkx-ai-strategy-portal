export interface TargetFrame { left: number; top: number; width: number; height: number }

// Fixed-position descendants escape ordinary overflow ancestors above their fixed root.
// A transformed/contained ancestor instead establishes their containing block.
export function clippedTargetFrame(element: HTMLElement, minimumLeft: number): TargetFrame | null {
  const bounds = element.getBoundingClientRect()
  let left = Math.max(minimumLeft, bounds.left), top = Math.max(34, bounds.top)
  let right = Math.min(window.innerWidth, bounds.right), bottom = Math.min(window.innerHeight, bounds.bottom)
  let fixed = getComputedStyle(element).position === 'fixed'
  for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
    const style = getComputedStyle(parent)
    const fixedContainingBlock = style.transform !== 'none' || style.perspective !== 'none' || style.filter !== 'none' || (style.backdropFilter && style.backdropFilter !== 'none') || /paint|layout|strict|content/.test(style.contain) || /transform|perspective|filter/.test(style.willChange)
    if (fixed && !fixedContainingBlock) continue
    fixed = false
    const rect = parent.getBoundingClientRect()
    if (/(auto|scroll|hidden|clip)/.test(style.overflowX)) { left = Math.max(left, rect.left); right = Math.min(right, rect.right) }
    if (/(auto|scroll|hidden|clip)/.test(style.overflowY)) { top = Math.max(top, rect.top); bottom = Math.min(bottom, rect.bottom) }
    if (style.position === 'fixed') fixed = true
  }
  return right > left && bottom > top ? {left,top,width:right-left,height:bottom-top} : null
}
