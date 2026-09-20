import { useEffect, useRef, useState, type PointerEvent } from 'react'

export function useDraggablePanel() {
  const ref = useRef<HTMLElement>(null)
  const [position, setPosition] = useState<{ left: number; top: number }>()
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
  const clamp = (left: number, top: number) => {
    const rect = ref.current?.getBoundingClientRect()
    return { left: Math.max(0, Math.min(left, window.innerWidth - (rect?.width ?? 0))), top: Math.max(0, Math.min(top, window.innerHeight - (rect?.height ?? 0))) }
  }
  useEffect(() => {
    const resize = () => setPosition(p => p && clamp(p.left, p.top))
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])
  return { ref, style: position ? { ...position, right: 'auto', bottom: 'auto' } : undefined, headerProps: {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      if (event.button !== 0 || (event.target as Element).closest('button,input,select,textarea,a')) return
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId)
      drag.current = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top }
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      const origin = drag.current
      if (origin) setPosition(clamp(origin.left + event.clientX - origin.x, origin.top + event.clientY - origin.y))
    },
    onPointerUp: () => { drag.current = null },
    onPointerCancel: () => { drag.current = null },
    onLostPointerCapture: () => { drag.current = null },
  } }
}
