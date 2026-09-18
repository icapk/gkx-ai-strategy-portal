import test from 'node:test'
import assert from 'node:assert/strict'
import { points } from '../src/readingReview/model.ts'
import { readingLocations, readingTargets } from '../src/prototypeFocus/readingTargets.ts'

test('every current reading requirement resolves to a scoped prototype target', () => {
  assert.deepEqual(Object.keys(readingLocations).filter(id=>id.startsWith('F')).sort(), points.map(p => p.id).sort())
  for (const location of Object.values(readingLocations)) {
    assert.equal(readingTargets[location.navigationTarget]?.product, 'reading')
    assert.ok(location.selectors.length)
    assert.ok(location.selectors.every(selector => !['.antenna-reader', '.antenna-body', '.antenna-page', 'body'].includes(selector)))
    if (location.contextOnly) assert.ok(location.prerequisite)
  }
})

test('source navigation covers both source entry and destination; missing tables remain explicit', () => {
  for (const id of ['F5.1', 'F5.2', 'F5.3', 'F18.1', 'F18.3']) assert.equal(readingLocations[id].selectors.length, 2)
  for (const id of ['F6.3', 'F18.2', 'F9']) assert.equal(readingLocations[id].contextOnly, true)
})
