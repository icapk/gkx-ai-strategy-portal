import test from 'node:test'
import assert from 'node:assert/strict'
import { initialDocuments, initialResearchNotes } from '../src/data.ts'
import {
  countResearchSearchResults,
  filterResearchSearchResults,
  listResearchContent,
  searchResearchContent,
} from '../src/researchSearch.ts'
import type { ResearchDocument, ResearchNote } from '../src/types.ts'

test('空查询浏览列表与界面计数使用同一份数据', () => {
  const results = listResearchContent(initialDocuments, initialResearchNotes)

  assert.deepEqual(countResearchSearchResults(results), { all: 14, documents: 9, notes: 5 })
  assert.equal(filterResearchSearchResults(results, 'documents').length, 9)
  assert.equal(filterResearchSearchResults(results, 'notes').length, 5)
})

test('默认列表顺序稳定，文档在前、笔记在后', () => {
  const results = listResearchContent(initialDocuments, initialResearchNotes)

  assert.deepEqual(results.map((result) => result.id), [
    'document:1',
    'document:2',
    'document:3',
    'document:4',
    'document:5',
    'document:6',
    'document:7',
    'document:9',
    'document:10',
    'note:1',
    'note:2',
    'note:3',
    'note:4',
    'note:5',
  ])
})

test('孤立笔记不会进入列表或计数', () => {
  const orphanNote: ResearchNote = {
    id: 99,
    documentId: 999,
    title: '孤立笔记',
    content: '不应展示',
    createdAt: '2026-01-01 10:00',
    updatedAt: '2026-01-01 10:00',
    tags: [],
  }
  const results = listResearchContent(initialDocuments, [...initialResearchNotes, orphanNote])

  assert.equal(results.some((result) => result.id === 'note:99'), false)
  assert.deepEqual(countResearchSearchResults(results), { all: 14, documents: 9, notes: 5 })
})

test('文档摘要缺失时稳定回退到位置和所有者', () => {
  const document: ResearchDocument = {
    id: 77,
    title: '无摘要文档',
    location: '我的空间/研究',
    owner: '张三',
    createdAt: '2026-01-01 10:00',
    visitedAt: '2026-01-01 10:00',
    size: '1 KB',
    kind: 'PDF文档',
    favorite: false,
    owned: true,
    shared: false,
  }
  const [result] = listResearchContent([document], [])

  assert.equal(result.snippet, '我的空间/研究 · 张三')
})

test('搜索函数仍保持空查询无命中的清晰语义', () => {
  assert.deepEqual(searchResearchContent(initialDocuments, initialResearchNotes, ''), [])
  assert.deepEqual(searchResearchContent(initialDocuments, initialResearchNotes, '   '), [])
})
