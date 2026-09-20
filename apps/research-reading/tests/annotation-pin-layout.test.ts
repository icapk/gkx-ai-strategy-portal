import test from 'node:test'
import assert from 'node:assert/strict'
import { layoutAnnotationPins } from '../src/annotations/pinLayout.ts'

test('overlapping markers stay separate at the right and bottom edges', () => {
  const pins = layoutAnnotationPins(Array.from({ length: 12 }, () => ({ left: 995, top: 590 })), 1000, 600, 386)
  assert.equal(pins.length, 12)
  for (const [i, pin] of pins.entries()) {
    assert.ok(pin.left >= 386 && pin.left <= 973 && pin.top >= 0 && pin.top <= 573)
    for (const other of pins.slice(0, i)) assert.ok(Math.abs(pin.left - other.left) >= 27 || Math.abs(pin.top - other.top) >= 27)
  }
})

test('nearby distinct anchors cannot collide with shifted earlier markers', () => {
  const pins = layoutAnnotationPins([{ left: 500, top: 200 }, { left: 500, top: 200 }, { left: 472, top: 172 }], 1400, 900, 386)
  assert.equal(new Set(pins.map(p => `${p.left}:${p.top}`)).size, 3)
  for (const [i, p] of pins.entries()) for (const q of pins.slice(0, i)) assert.ok(Math.abs(p.left - q.left) >= 27 || Math.abs(p.top - q.top) >= 27)
})
