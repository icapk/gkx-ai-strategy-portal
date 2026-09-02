import test from 'node:test'
import assert from 'node:assert/strict'
import { canReconcilePdfArchiveStorage, loadResearchDocuments, persistResearchDocument } from '../src/documentContent.ts'
import type { ResearchDocument } from '../src/types.ts'

test('PDF 在线解析索引与存档元数据可完整持久化', () => {
  const memory = new Map<string, string>()
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      localStorage: {
        getItem: (key: string) => memory.get(key) ?? null,
        setItem: (key: string, value: string) => { memory.set(key, value) },
      },
    },
  })

  try {
    assert.equal(canReconcilePdfArchiveStorage(), false)
    const documentItem: ResearchDocument = {
      id: 501,
      title: '多模态知识蒸馏',
      location: '我的空间/研究',
      owner: '张三',
      createdAt: '2026-09-01 10:00:00',
      visitedAt: '2026-09-01 10:00:00',
      updatedAt: '2026-09-01 10:00:00',
      size: '2.4 MB',
      kind: 'PDF文档',
      favorite: false,
      owned: true,
      shared: false,
      spaceScope: 'personal',
      pdfTextContent: '在线解析后的 PDF 全文索引。',
      pdfArchive: {
        storageKey: 'pdf-501',
        originalName: 'multimodal-paper.pdf',
        byteSize: 2_400_000,
        pageCount: 18,
        annotationCount: 3,
        parsedAt: '2026-09-01T10:00:00.000Z',
      },
    }

    assert.deepEqual(persistResearchDocument(documentItem), { ok: true })
    assert.equal(canReconcilePdfArchiveStorage(), true)
    const [restored] = loadResearchDocuments([])
    assert.equal(restored.pdfTextContent, documentItem.pdfTextContent)
    assert.deepEqual(restored.pdfArchive, documentItem.pdfArchive)
    const storageKey = Array.from(memory.keys())[0]!
    memory.set(storageKey, '{not-valid-json')
    assert.equal(canReconcilePdfArchiveStorage(), false)
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow)
    else Reflect.deleteProperty(globalThis, 'window')
  }
})
