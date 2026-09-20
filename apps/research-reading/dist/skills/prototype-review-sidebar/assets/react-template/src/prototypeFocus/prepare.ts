// Only explicitly marked view/menu reveal controls may be activated by a focus request.
export function prepareFocus(actions: string[] = []): boolean {
  return actions.every(action => {
    if(action.startsWith('details:')){const element=document.querySelector<HTMLDetailsElement>(action.slice(8));if(!element||element.tagName!=='DETAILS')return false;element.open=true;return true}
    if (!action.startsWith('reveal:')) return false
    const key = action.slice(7)
    const element = document.querySelector<HTMLButtonElement>(`[data-focus-reveal="${CSS.escape(key)}"]`)
    if (!element || element.disabled || !element.getClientRects().length) return false
    if (element.getAttribute('aria-expanded') === 'true') return true
    element.click()
    return element.getAttribute('aria-expanded') === 'true'
  })
}
