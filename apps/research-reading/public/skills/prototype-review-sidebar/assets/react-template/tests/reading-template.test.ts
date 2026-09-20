import test from 'node:test'
import assert from 'node:assert/strict'
import {seedSnapshot} from '../src/sidebar.config.ts'
import {validReadingBook} from '../server/readingPrdValidation.mjs'

test('portable reading seed accepts generic IDs and host selectors', () => {
  const {book}: any = seedSnapshot('reading', 'prd')
  assert.equal(validReadingBook(book), true)
  book.revisions[0].areas[0].features[0].manual = {
    target: {product: 'reading', readingView: 'library'},
    regions: [{selector: '[data-focus-id="reading-query"]', label: 'Query', x: 0, y: 0, width: 1, height: 1}],
  }
  assert.equal(validReadingBook(book), true)
  book.revisions[0].areas[0].features[0].manual.regions[0].width = 2
  assert.equal(validReadingBook(book), false)
})

test('portable reading validation still rejects damaged records', () => {
  const {book}: any = seedSnapshot('reading', 'prd')
  const features = book.revisions[0].areas[0].features
  features.push(structuredClone(features[0]))
  assert.equal(validReadingBook(book), false)
  features.pop()
  features[0].rules = []
  assert.equal(validReadingBook(book), false)
})
