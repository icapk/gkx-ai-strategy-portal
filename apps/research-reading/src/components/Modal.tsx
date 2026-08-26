import { useEffect, useRef, type FormEvent, type ReactNode } from 'react'

interface ModalProps {
  title: string
  children: ReactNode
  onClose: () => void
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  confirmText?: string
  confirmDisabled?: boolean
  wide?: boolean
  tall?: boolean
  extraWide?: boolean
  hideFooter?: boolean
  cancelText?: string
  confirmDanger?: boolean
  bodyClassName?: string
}

export function Modal({
  title,
  children,
  onClose,
  onSubmit,
  confirmText = '确定',
  confirmDisabled = false,
  wide = false,
  tall = false,
  extraWide = false,
  hideFooter = false,
  cancelText = '取消',
  confirmDanger = false,
  bodyClassName = '',
}: ModalProps) {
  const dialogRef = useRef<HTMLFormElement | null>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const focusFrame = window.requestAnimationFrame(() => {
      const dialog = dialogRef.current
      if (!dialog || dialog.contains(document.activeElement)) return
      const preferred = dialog.querySelector<HTMLElement>(
        'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]):not(.modal-close)',
      )
      const fallback = dialog.querySelector<HTMLElement>('button:not([disabled])')
      ;(preferred ?? fallback ?? dialog).focus()
    })
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? []).filter((element) => element.offsetParent !== null)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      window.removeEventListener('keydown', onKeyDown)
      window.requestAnimationFrame(() => previouslyFocused?.focus())
    }
  }, [title])

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <form
        ref={dialogRef}
        className={`modal-card${wide ? ' modal-card--wide' : ''}${extraWide ? ' modal-card--extra-wide' : ''}${tall ? ' modal-card--tall' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
        onSubmit={onSubmit}
      >
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button modal-close" type="button" aria-label="关闭" onClick={onClose}>
            <img src="/assets/figma/modal-close.svg" alt="" />
          </button>
        </header>
        <div className={`modal-body${bodyClassName ? ` ${bodyClassName}` : ''}`}>{children}</div>
        {!hideFooter && <footer className="modal-footer">
          <button className="button button--secondary" type="button" onClick={onClose}>
            {cancelText}
          </button>
          <button className={`button ${confirmDanger ? 'button--danger' : 'button--primary'}`} type="submit" disabled={confirmDisabled}>
            {confirmText}
          </button>
        </footer>}
      </form>
    </div>
  )
}
