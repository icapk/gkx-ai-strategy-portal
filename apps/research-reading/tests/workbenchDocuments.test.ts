import test from 'node:test'
import assert from 'node:assert/strict'
import { favoriteDocuments, favoriteTimeLabel, isPersonalDocument, isTeamDocument, parentFolderLabel, recentDocuments } from '../src/workbenchDocuments.ts'
import type { ResearchDocument } from '../src/types.ts'

const documentItem = (id: number, overrides: Partial<ResearchDocument> = {}): ResearchDocument => ({
  id,
  title: `文档 ${id}`,
  location: '我的空间/研究项目',
  owner: '张研究员',
  createdAt: '2026-08-01 09:00',
  visitedAt: '2026-08-20 10:00',
  updatedAt: '2026-08-18 12:00',
  size: '1 KB',
  kind: 'PDF文档',
  favorite: false,
  owned: true,
  shared: false,
  spaceScope: 'personal',
  ...overrides,
})

test('最近浏览按访问时间倒序且移除后再次打开可恢复', () => {
  const documents = [
    documentItem(1, { visitedAt: '2026-08-21 10:00', recentHiddenAt: '2026-08-22 10:00' }),
    documentItem(2, { visitedAt: '2026-08-23 10:00', recentHiddenAt: '2026-08-22 10:00' }),
    documentItem(3, { visitedAt: '2026-08-24 10:00' }),
  ]
  assert.deepEqual(recentDocuments(documents, new Date(2026, 8, 1)).map(({ id }) => id), [3, 2])
})

test('从未打开的导入文档不会伪造最近浏览记录', () => {
  assert.deepEqual(recentDocuments([
    documentItem(1, { visitedAt: '' }),
    documentItem(2, { visitedAt: '损坏时间' }),
  ]), [])
})

test('收藏按真实收藏时间排序并明确标记历史数据', () => {
  const documents = [
    documentItem(1, { favorite: true }),
    documentItem(2, { favorite: true, favoritedAt: '2026-08-25 10:00' }),
    documentItem(3, { favorite: true, favoritedAt: '2026-08-26 10:00' }),
  ]
  assert.deepEqual(favoriteDocuments(documents).map(({ id }) => id), [3, 2, 1])
  assert.equal(favoriteTimeLabel(documents[0]), '—')
})

test('个人空间只接收个人范围文档并正确显示父文件夹', () => {
  assert.equal(isPersonalDocument(documentItem(1)), true)
  assert.equal(isPersonalDocument(documentItem(2, { location: 'AI研究团队/成果', spaceScope: 'team' })), false)
  assert.equal(parentFolderLabel('我的空间/实验数据'), '实验数据')
})

test('团队文档按完整团队根路径隔离，同名文件夹不会串入', () => {
  const first = documentItem(1, { location: 'AI研究团队/研究项目', spaceScope: 'team' })
  const second = documentItem(2, { location: '产品研发部/研究项目', spaceScope: 'team' })
  assert.equal(isTeamDocument(first, 'AI研究团队'), true)
  assert.equal(isTeamDocument(second, 'AI研究团队'), false)
})

test('最近浏览按日历月裁剪、文档去重、同分钟按创建时间和自然标题排序',()=>{const now=new Date(2026,2,31,12);const docs=[documentItem(1,{visitedAt:'2026-02-28 12:00',title:'文档10',createdAt:'2026-01-01 10:00'}),documentItem(2,{visitedAt:'2026-02-28 11:59'}),documentItem(1,{visitedAt:'2026-03-01 10:00',title:'文档10',createdAt:'2026-01-01 10:00'}),documentItem(3,{visitedAt:'2026-03-01 10:00',title:'文档2',createdAt:'2026-01-01 10:00'})];assert.deepEqual(recentDocuments(docs,now).map(d=>d.id),[3,1])})
