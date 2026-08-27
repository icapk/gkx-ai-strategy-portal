import test from 'node:test'
import assert from 'node:assert/strict'
import { initialReadingNotes, readingDocuments } from '../src/readingData.ts'
import {
  READING_WORKSPACE_STORAGE_KEY,
  createDefaultReadingWorkspaceState,
  loadReadingWorkspaceState,
  persistReadingWorkspaceState,
  sanitizeReadingWorkspaceState,
} from '../src/readingWorkspaceStorage.ts'

const createDefaultState = () => createDefaultReadingWorkspaceState(readingDocuments, initialReadingNotes)

const createMemoryStorage = () => {
  const values = new Map<string, string>()
  return {
    values,
    storage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
  }
}

test('默认笔记只归属首篇文献，切换文献不会串入笔记', () => {
  const state = createDefaultState()
  const firstDocumentId = state.documents[0].id
  const secondDocumentId = state.documents[1].id

  assert.ok(state.notes.length > 0)
  assert.ok(state.notes.every((note) => note.documentId === firstDocumentId))
  assert.equal(state.notes.filter((note) => note.documentId === secondDocumentId).length, 0)
})

test('损坏数据会清洗、去重，并移除不存在文献的孤立笔记', () => {
  const state = sanitizeReadingWorkspaceState({
    version: 99,
    folders: ['  我的笔记库  ', '我的笔记库', '', 42],
    documents: [
      { id: 8, title: '  用户文献  ', authors: '', journal: '', year: '', type: 'script', size: '', favorite: 'yes', folder: '我的笔记库' },
      { id: 8, title: '重复编号', type: 'PDF' },
      { id: -1, title: '非法编号' },
    ],
    notes: [
      { id: 1, title: '', excerpt: '  可迁移的旧笔记  ', createdAt: 12, color: 'red' },
      { id: 1, documentId: 8, title: '重复笔记', excerpt: '应被去重', color: '#ffffff' },
      { id: 2, documentId: 999, title: '孤立笔记', excerpt: '应被移除', color: '#ffffff' },
      { id: 3, documentId: 8, title: '空内容', excerpt: '' },
    ],
  }, createDefaultState())

  assert.equal(state.version, 1)
  assert.deepEqual(state.folders, ['我的笔记库'])
  assert.equal(state.documents.length, 1)
  assert.equal(state.documents[0].title, '用户文献')
  assert.equal(state.documents[0].type, 'PDF')
  assert.equal(state.documents[0].favorite, false)
  assert.deepEqual(state.notes.map((note) => [note.documentId, note.id]), [[8, 1]])
  assert.equal(state.notes[0].title, '可迁移的旧笔记')
  assert.equal(state.notes[0].color, '#FFE4BA')
})

test('收藏、文件夹归属和分文献笔记可完整持久化与恢复', () => {
  const { storage } = createMemoryStorage()
  const state = createDefaultState()
  const firstId = state.documents[0].id
  const secondId = state.documents[1].id
  state.documents = state.documents.map((document) => document.id === secondId
    ? { ...document, favorite: true, folder: '固态电池资料' }
    : document)
  state.folders = ['固态电池资料', ...state.folders]
  state.notes = [
    ...state.notes,
    {
      id: 1,
      documentId: secondId,
      title: '界面稳定性',
      excerpt: '第二篇文献的独立笔记',
      createdAt: '2026-08-27',
      color: '#C6EFC1',
      imageDataUrls: ['data:image/png;base64,aGVsbG8='],
    },
  ]

  const saved = persistReadingWorkspaceState(state, storage)
  assert.equal(saved.ok, true)
  const loaded = loadReadingWorkspaceState(createDefaultState(), storage)

  assert.equal(loaded.recovered, false)
  assert.equal(loaded.state.documents.find((document) => document.id === secondId)?.favorite, true)
  assert.equal(loaded.state.documents.find((document) => document.id === secondId)?.folder, '固态电池资料')
  assert.equal(loaded.state.notes.filter((note) => note.documentId === firstId).length, 4)
  assert.deepEqual(loaded.state.notes.filter((note) => note.documentId === secondId).map((note) => note.title), ['界面稳定性'])
  assert.deepEqual(loaded.state.notes.find((note) => note.documentId === secondId)?.imageDataUrls, ['data:image/png;base64,aGVsbG8='])
})

test('笔记图片只保留可持久化的安全 data URL，不保留 blob 临时地址', () => {
  const state = createDefaultState()
  state.notes[0].imageDataUrls = [
    'blob:https://example.test/temporary',
    'javascript:alert(1)',
    'data:image/jpeg;base64,aGVsbG8=',
  ]

  const sanitized = sanitizeReadingWorkspaceState(state)
  assert.deepEqual(sanitized.notes[0].imageDataUrls, ['data:image/jpeg;base64,aGVsbG8='])
})

test('显式删除全部文献后不会被示例数据重新覆盖', () => {
  const { storage } = createMemoryStorage()
  const state = createDefaultState()
  state.documents = []
  state.notes = []

  assert.equal(persistReadingWorkspaceState(state, storage).ok, true)
  const loaded = loadReadingWorkspaceState(createDefaultState(), storage)
  assert.deepEqual(loaded.state.documents, [])
  assert.deepEqual(loaded.state.notes, [])
})

test('无法写入存储时明确返回失败且不产生伪成功数据', () => {
  const state = createDefaultState()
  state.documents[0].favorite = true
  const storage = {
    getItem: () => null,
    setItem: () => { throw new Error('quota exceeded') },
  }

  const result = persistReadingWorkspaceState(state, storage)
  assert.equal(result.ok, false)
  if (!result.ok) assert.match(result.error, /未保存/)
})

test('损坏 JSON 会安全恢复默认状态并标记需要修复', () => {
  const { values, storage } = createMemoryStorage()
  values.set(READING_WORKSPACE_STORAGE_KEY, '{not-json')

  const loaded = loadReadingWorkspaceState(createDefaultState(), storage)
  assert.equal(loaded.recovered, true)
  assert.ok(loaded.state.documents.length > 0)
  assert.match(loaded.error ?? '', /恢复安全默认数据/)
})
