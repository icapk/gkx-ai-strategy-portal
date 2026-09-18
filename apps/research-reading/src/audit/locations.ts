import raw from './review/locators.json'
export interface PointLocation {
  navigationTarget: string
  selectors: string[]
  contextOnly: boolean
  description: string
  prepare?: string[]
  prerequisite?: string
  preserveSurface?: boolean
}
export const pointLocations = raw as Record<string, PointLocation>
export function visibleElements(selector: string): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(element => {
    const style = window.getComputedStyle(element)
    return element.getClientRects().length > 0 && !element.closest('[hidden], [inert]') && style.visibility !== 'hidden' && style.display !== 'none'
  })
}
