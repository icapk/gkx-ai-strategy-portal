import test from 'node:test'
import assert from 'node:assert/strict'
import { rangeMatchesContext, savedRangeMatchesContext } from '../src/annotations/location.ts'
import type { AnnotationRange } from '../src/annotations/uiTypes.ts'
import { equalAnnotationRestore, registerAnnotationRestorer, restoreAnnotationState, type AnnotationRestoreState } from '../src/annotations/restoration.ts'

test('阅读reader规范化，团队Tab与产品上下文不串', () => {
  const reading: AnnotationRange = { target: { product: 'reading', readingView: 'antenna-reader' }, regions: [] }
  assert.equal(rangeMatchesContext(reading, JSON.stringify({ product: 'reading', view: 'reader' })), true)
  assert.equal(rangeMatchesContext(reading, JSON.stringify({ product: 'reading', view: 'library' })), false)
  const team = { target: { product: 'research', section: 'team', teamTab: 'documents' }, regions: [] } as AnnotationRange
  assert.equal(rangeMatchesContext(team, JSON.stringify({ product: 'research', section: 'team', teamTab: 'members' })), false)
  assert.equal(rangeMatchesContext(reading, JSON.stringify({ product: 'research', view: 'reader' })), false)
})
test('历史快照严格隔离文档；缺上下文不能套用当前文档', () => {
  const context = JSON.stringify({ product: 'reading', view: 'reader', documentId: 'a' })
  const range: AnnotationRange = { target: { product: 'reading' }, regions: [], pageContext: context }
  assert.equal(savedRangeMatchesContext(range, context), true)
  assert.equal(savedRangeMatchesContext(range, JSON.stringify({ product: 'reading', view: 'reader', documentId: 'b' })), false)
  assert.equal(savedRangeMatchesContext({ ...range, pageContext: undefined }, context), false)
})
test('新恢复上下文忽略JSON字段顺序但区分文件与展开态', () => {
  const a: AnnotationRestoreState = { schema: 1, product: 'research', section: 'workbench', tab: 'recent', surface: 'workspace', share: { kind: 'file', id: 1, targetPath: '我的空间', expanded: true } }
  const reordered = { surface: 'workspace', tab: 'recent', section: 'workbench', product: 'research', schema: 1, share: { expanded: true, targetPath: '我的空间', id: 1, kind: 'file' } } as AnnotationRestoreState
  assert.equal(equalAnnotationRestore(a, reordered), true)
  assert.equal(equalAnnotationRestore(a, { ...a, share: { ...a.share!, expanded: false } }), false)
  assert.equal(equalAnnotationRestore(a, { ...a, share: { ...a.share!, id: 2 } }), false)
})
test('恢复适配器返回阻断原因，调用使用副本且卸载后不可恢复', async () => {
  const state: AnnotationRestoreState = { schema: 1, product: 'reading', view: 'reader', documentId: 7 }
  const remove = registerAnnotationRestorer('reading', { capture: () => state, restore: incoming => { incoming.documentId = 9; return '请先保存当前草稿' } })
  assert.equal(await restoreAnnotationState(state), '请先保存当前草稿')
  assert.equal(state.documentId, 7)
  remove()
  assert.match((await restoreAnnotationState(state))!, /尚未准备好/)
})
