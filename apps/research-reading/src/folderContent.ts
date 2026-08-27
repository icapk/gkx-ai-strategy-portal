import type { FolderItem } from './types'

const STORAGE_PREFIX = 'intelligent-research-portal:folders:v1:'
export type FolderScope = 'personal' | 'team'
export type FolderStorageResult = { ok: true } | { ok: false; error: string }

interface StorageLike {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

const browserStorage = (): StorageLike | null => {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

const sanitizeFolders = (value: unknown): FolderItem[] => {
  if (!Array.isArray(value)) return []
  const ids = new Set<number>()
  const names = new Set<string>()
  return value.flatMap((raw) => {
    if (!raw || typeof raw !== 'object') return []
    const item = raw as Partial<FolderItem>
    if (!Number.isInteger(item.id) || Number(item.id) <= 0 || ids.has(Number(item.id))) return []
    const name = typeof item.name === 'string' ? item.name.normalize('NFC').trim().slice(0, 50) : ''
    if (!name) return []
    const location = typeof item.location === 'string' ? item.location.normalize('NFC').trim().slice(0, 160) : undefined
    const nameKey = `${location ?? 'personal'}:${name.toLocaleLowerCase()}`
    if (names.has(nameKey)) return []
    ids.add(Number(item.id))
    names.add(nameKey)
    return [{
      id: Number(item.id),
      name,
      count: Number.isFinite(item.count) ? Math.max(0, Math.floor(Number(item.count))) : 0,
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt.slice(0, 40) : '',
      createdAt: typeof item.createdAt === 'string' ? item.createdAt.slice(0, 40) : undefined,
      owner: typeof item.owner === 'string' ? item.owner.slice(0, 60) : undefined,
      location,
      size: typeof item.size === 'string' ? item.size.slice(0, 30) : undefined,
    }]
  })
}

export const loadFolders = (scope: FolderScope, fallback: FolderItem[], storage: StorageLike | null = browserStorage()) => {
  if (!storage) return fallback
  try {
    const raw = storage.getItem(`${STORAGE_PREFIX}${scope}`)
    if (!raw) return fallback
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return fallback
    return sanitizeFolders(parsed)
  } catch {
    return fallback
  }
}

export const persistFolders = (scope: FolderScope, folders: FolderItem[], storage: StorageLike | null = browserStorage()): FolderStorageResult => {
  if (!storage) return { ok: false, error: '浏览器存储不可用，文件夹操作尚未保存。' }
  try {
    storage.setItem(`${STORAGE_PREFIX}${scope}`, JSON.stringify(folders))
    return { ok: true }
  } catch {
    return { ok: false, error: '当前浏览器存储空间不足，文件夹操作尚未保存。' }
  }
}
