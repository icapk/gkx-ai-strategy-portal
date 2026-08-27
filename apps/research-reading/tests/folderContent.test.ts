import test from 'node:test'
import assert from 'node:assert/strict'
import { loadFolders, persistFolders } from '../src/folderContent.ts'
import type { FolderItem } from '../src/types.ts'

const fallback: FolderItem[] = [{ id: 1, name: '研究项目', count: 1, updatedAt: '2026-08-01 10:00' }]

const memoryStorage = () => {
  const values = new Map<string, string>()
  return {
    values,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value) },
  }
}

test('空文件夹列表可以持久化，不会在刷新后恢复演示数据', () => {
  const storage = memoryStorage()
  assert.deepEqual(persistFolders('personal', [], storage), { ok: true })
  assert.deepEqual(loadFolders('personal', fallback, storage), [])
})

test('文件夹元数据会清洗并保留完整字段', () => {
  const storage = memoryStorage()
  storage.setItem('intelligent-research-portal:folders:v1:personal', JSON.stringify([{
    id: 8,
    name: '  实验数据  ',
    count: -2,
    updatedAt: '2026-08-20 09:00',
    createdAt: '2026-08-01 09:00',
    owner: '张研究员',
    location: '我的空间',
    size: '2.1 MB',
  }]))
  assert.deepEqual(loadFolders('personal', fallback, storage), [{
    id: 8,
    name: '实验数据',
    count: 0,
    updatedAt: '2026-08-20 09:00',
    createdAt: '2026-08-01 09:00',
    owner: '张研究员',
    location: '我的空间',
    size: '2.1 MB',
  }])
})

test('存储失败时返回明确错误且不伪造成功', () => {
  const storage = { getItem: () => null, setItem: () => { throw new Error('quota') } }
  assert.deepEqual(persistFolders('team', fallback, storage), { ok: false, error: '当前浏览器存储空间不足，文件夹操作尚未保存。' })
})

test('同一团队内的规范化同名文件夹会去重，不同团队可保留同名文件夹', () => {
  const storage = memoryStorage()
  storage.setItem('intelligent-research-portal:folders:v1:team', JSON.stringify([
    { id: 1, name: '研究项目', location: 'AI研究团队', count: 0, updatedAt: '' },
    { id: 2, name: '  研究项目  ', location: 'AI研究团队', count: 0, updatedAt: '' },
    { id: 3, name: '研究项目', location: '产品研发部', count: 0, updatedAt: '' },
  ]))
  assert.deepEqual(loadFolders('team', [], storage).map(({ id }) => id), [1, 3])
})
