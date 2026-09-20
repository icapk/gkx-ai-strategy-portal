/** Keep every marker independently clickable, including near viewport edges. */
export function layoutAnnotationPins(anchors: Array<{ left: number; top: number }>, width: number, height: number, minimumLeft = 0, minimumTop = 0) {
  const pins: Array<{ left: number; top: number }> = []
  const maxLeft = Math.max(0, width - 27), maxTop = Math.max(0, height - 27)
  const minLeft = Math.min(maxLeft, Math.max(0, minimumLeft))
  const minTop = Math.min(maxTop, Math.max(0, minimumTop))
  const fits = (left: number, top: number) => pins.every(p => Math.abs(p.left - left) >= 27 || Math.abs(p.top - top) >= 27)
  for (const anchor of anchors) {
    const origin = { left: Math.max(minLeft, Math.min(maxLeft, anchor.left)), top: Math.max(minTop, Math.min(maxTop, anchor.top - 12)) }
    let chosen = origin
    let found = fits(origin.left, origin.top)
    const radius = Math.ceil(Math.max(width, height) / 28)
    for (let ring = 1; ring <= radius && !found; ring++) {
      for (let y = -ring; y <= ring && !found; y++) for (let x = -ring; x <= ring && !found; x++) {
        if (Math.max(Math.abs(x), Math.abs(y)) !== ring) continue
        const left = origin.left + x * 28, top = origin.top + y * 28
        if (left < minLeft || left > maxLeft || top < minTop || top > maxTop || !fits(left, top)) continue
        chosen = { left, top }; found = true
      }
    }
    pins.push(chosen)
  }
  return pins
}
