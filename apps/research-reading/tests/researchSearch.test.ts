import test from 'node:test'
import assert from 'node:assert/strict'
import { initialDocuments, initialResearchNotes } from '../src/data.ts'
import {
  countResearchSearchResults,
  filterResearchSearchResults,
  listResearchContent,
  searchResearchContent,
} from '../src/researchSearch.ts'
import { compareResearchDocuments } from '../src/researchSort.ts'
import type { ResearchDocument, ResearchNote } from '../src/types.ts'

test('搜索标题命中优先，组内按访问和创建时间而非匹配分数排序',()=>{
 const base={...initialDocuments[0],kind:'在线文档' as const,originalFileName:undefined}
 const docs:ResearchDocument[]=[{...base,id:100,title:'needle',content:'',visitedAt:'2026-09-01 10:00',createdAt:'2026-09-01 09:00'},
 { ...base,id:101,title:'prefix needle suffix',content:'',visitedAt:'2026-09-02 10:00',createdAt:'2026-09-01 09:00'},
 { ...base,id:102,title:'仅正文',content:'needle',visitedAt:'2026-09-03 10:00',createdAt:'2026-09-03 09:00'}]
 assert.deepEqual(searchResearchContent(docs,[],'needle').map(r=>r.documentId),[101,100,102])
})

test('空查询浏览列表与界面计数使用同一份数据', () => {
  const results = listResearchContent(initialDocuments, initialResearchNotes)

  assert.deepEqual(countResearchSearchResults(results), { all: 9, documents: 9, notes: 0 })
  assert.equal(filterResearchSearchResults(results, 'documents').length, 9)
  assert.equal(filterResearchSearchResults(results, 'notes').length, 0)
})

test('默认文档顺序与最近浏览排序一致，不展示非PDF示例笔记',()=>{
 const results=listResearchContent(initialDocuments,initialResearchNotes)
 const sorted=[...initialDocuments].sort(compareResearchDocuments)
 assert.deepEqual(results.map(r=>r.id),sorted.map(d=>'document:'+d.id))
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
  assert.deepEqual(countResearchSearchResults(results), { all: 9, documents: 9, notes: 0 })
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

test('元信息不作为标题正文检索命中', () => {
  const document: ResearchDocument = {
    id: 78,
    title: '空间检索兼容文档',
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

  assert.equal(searchResearchContent([document], [], '个人空间')[0]?.id, undefined)
  assert.equal(searchResearchContent([document], [], '我的空间')[0]?.id, undefined)
})

test('搜索函数仍保持空查询无命中的清晰语义', () => {
  assert.deepEqual(searchResearchContent(initialDocuments, initialResearchNotes, ''), [])
  assert.deepEqual(searchResearchContent(initialDocuments, initialResearchNotes, '   '), [])
})

test('上传PDF正文不纳入搜索，标题仍可搜索', () => {
  const document: ResearchDocument = {
    id: 79,
    title: '已存档文献',
    location: '我的空间/研究',
    owner: '张三',
    createdAt: '2026-09-01 10:00',
    visitedAt: '2026-09-01 10:00',
    size: '2.4 MB',
    kind: 'PDF文档',
    favorite: false,
    owned: true,
    shared: false,
    pdfTextContent: '第一页介绍研究背景。\n本文研究多模态知识蒸馏与小样本分类。',
    pdfArchive: {
      storageKey: 'pdf-79',
      originalName: 'paper.pdf',
      byteSize: 2_400_000,
      pageCount: 18,
      annotationCount: 2,
      parsedAt: '2026-09-01T10:00:00.000Z',
    },
  }

  const [result] = searchResearchContent([document], [], '知识蒸馏')
  assert.equal(result,undefined)
  assert.equal(searchResearchContent([document],[],'已存档文献')[0]?.id,'document:79')
})
