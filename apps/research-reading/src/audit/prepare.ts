import type { PointLocation } from './locations'
import { visibleElements } from './locations'

// Only expand navigation controls; business actions never enter this allowlist.
export function prepareAuditMenus(location: PointLocation | undefined, completed: Set<string>): boolean {
  for (const action of location?.prepare ?? []) {
    if (!action.startsWith('research-') || completed.has(action)) continue
    const [kind, id] = action.split(':')
    const escaped = CSS.escape(id ?? '')
    const selectors: Record<string, string> = {
      'research-document-menu': `[data-document-id="${escaped}"] [data-document-action="more"]`,
      'research-folder-menu': `[data-folder-id="${escaped}"] .folder-more`,
      'research-member-menu': `[data-member-id="${escaped}"] .member-role-wrap > button`,
      'research-candidate-role': `.selected-member-list [data-candidate-id="${escaped}"] .selected-member-role`,
      'research-page-size': '.page-size-trigger',
    }
    const selector = selectors[kind]
    if (!selector) return false
    const button = visibleElements(selector)[0]
    if (!(button instanceof HTMLButtonElement) || button.disabled) return false
    button.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'auto' })
    if (button.getAttribute('aria-expanded') !== 'true') button.click()
    completed.add(action)
    return false
  }
  return true
}
