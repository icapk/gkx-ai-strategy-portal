import type { ReadingDocument, ReadingNote } from './readingData'

export const READING_WORKSPACE_STORAGE_KEY = 'gkx-reading-workspace-v1'

const MAX_DOCUMENTS = 200
const MAX_FOLDERS = 80
const MAX_NOTES = 2_000
const MAX_NOTE_IMAGES = 3
const MAX_NOTE_IMAGE_DATA_URL_LENGTH = 4_000_000

interface StorageLike {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

export interface PersistedReadingNote extends ReadingNote {
  documentId: number
}

export interface ReadingWorkspaceState {
  version: 1
  documents: ReadingDocument[]
  folders: string[]
  notes: PersistedReadingNote[]
}

export interface ReadingWorkspaceLoadResult {
  state: ReadingWorkspaceState
  recovered: boolean
  error?: string
}

export type ReadingWorkspacePersistResult =
  | { ok: true; state: ReadingWorkspaceState }
  | { ok: false; error: string }

const cleanText = (value: unknown, maxLength: number, fallback = '') => {
  if (typeof value !== 'string') return fallback
  const text = value.trim().slice(0, maxLength)
  return text || fallback
}

const cleanPositiveInteger = (value: unknown) => {
  const number = typeof value === 'number' ? value : Number.NaN
  return Number.isSafeInteger(number) && number > 0 ? number : null
}

const uniqueStrings = (values: unknown[], maxLength: number, limit: number) => {
  const result: string[] = []
  const seen = new Set<string>()
  for (const value of values) {
    const text = cleanText(value, maxLength)
    const key = text.toLocaleLowerCase()
    if (!text || seen.has(key)) continue
    seen.add(key)
    result.push(text)
    if (result.length >= limit) break
  }
  return result
}

const defaultFolders = ['我的笔记库1', '我的笔记库2', '我的笔记库3', '我的笔记库4']

const cloneState = (state: ReadingWorkspaceState): ReadingWorkspaceState => ({
  version: 1,
  documents: state.documents.map((document) => ({ ...document })),
  folders: state.folders.slice(),
  notes: state.notes.map((note) => ({ ...note, imageDataUrls: note.imageDataUrls?.slice() })),
})

export function createDefaultReadingWorkspaceState(
  documents: ReadingDocument[],
  notes: ReadingNote[],
  folders: string[] = defaultFolders,
): ReadingWorkspaceState {
  const documentId = documents[0]?.id ?? 1
  return {
    version: 1,
    documents: documents.map((document) => ({ ...document })),
    folders: folders.slice(),
    notes: notes.map((note) => ({ ...note, documentId })),
  }
}

function sanitizeDocument(value: unknown): ReadingDocument | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Partial<ReadingDocument>
  const id = cleanPositiveInteger(candidate.id)
  const title = cleanText(candidate.title, 240)
  if (id == null || !title) return null

  return {
    id,
    title,
    authors: cleanText(candidate.authors, 180, '作者待补充'),
    journal: cleanText(candidate.journal, 160, '用户上传'),
    year: cleanText(candidate.year, 12, String(new Date().getFullYear())),
    type: candidate.type === 'Word' ? 'Word' : 'PDF',
    size: cleanText(candidate.size, 32, '大小待解析'),
    favorite: candidate.favorite === true,
    folder: cleanText(candidate.folder, 60, '我的笔记库1'),
  }
}

function sanitizeNote(value: unknown, fallbackDocumentId: number | null): PersistedReadingNote | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Partial<PersistedReadingNote>
  const id = cleanPositiveInteger(candidate.id)
  const documentId = cleanPositiveInteger(candidate.documentId) ?? fallbackDocumentId
  const excerpt = cleanText(candidate.excerpt, 10_000)
  if (id == null || documentId == null || !excerpt) return null
  const color = typeof candidate.color === 'string' && /^#[\da-f]{6}$/i.test(candidate.color)
    ? candidate.color.toUpperCase()
    : '#FFE4BA'
  const imageDataUrls = Array.isArray(candidate.imageDataUrls)
    ? candidate.imageDataUrls
      .filter((image): image is string => (
        typeof image === 'string'
        && image.length <= MAX_NOTE_IMAGE_DATA_URL_LENGTH
        && /^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(image)
      ))
      .slice(0, MAX_NOTE_IMAGES)
    : []

  return {
    id,
    documentId,
    title: cleanText(candidate.title, 120, excerpt.slice(0, 18)),
    excerpt,
    createdAt: cleanText(candidate.createdAt, 64),
    color,
    ...(imageDataUrls.length > 0 ? { imageDataUrls } : {}),
  }
}

export function sanitizeReadingWorkspaceState(value: unknown, fallbackState?: ReadingWorkspaceState): ReadingWorkspaceState {
  const defaults = fallbackState
    ? cloneState(fallbackState)
    : { version: 1 as const, documents: [], folders: defaultFolders.slice(), notes: [] }
  if (!value || typeof value !== 'object') return defaults
  const candidate = value as Partial<ReadingWorkspaceState>

  const documentValues = Array.isArray(candidate.documents) ? candidate.documents.slice(0, MAX_DOCUMENTS) : null
  const documents: ReadingDocument[] = []
  const documentIds = new Set<number>()
  if (documentValues) {
    for (const value of documentValues) {
      const document = sanitizeDocument(value)
      if (!document || documentIds.has(document.id)) continue
      documentIds.add(document.id)
      documents.push(document)
    }
  }
  const sanitizedDocuments = documentValues == null || (documentValues.length > 0 && documents.length === 0)
    ? defaults.documents
    : documents
  const sanitizedDocumentIds = new Set(sanitizedDocuments.map((document) => document.id))

  const folderValues = Array.isArray(candidate.folders) ? candidate.folders : []
  const folders = uniqueStrings(folderValues, 60, MAX_FOLDERS)
  for (const document of sanitizedDocuments) {
    if (folders.some((folder) => folder.toLocaleLowerCase() === document.folder.toLocaleLowerCase())) continue
    if (folders.length < MAX_FOLDERS) folders.push(document.folder)
    else document.folder = folders[0] ?? '我的笔记库1'
  }
  if (folders.length === 0) folders.push(...defaults.folders)

  const firstDocumentId = sanitizedDocuments[0]?.id ?? null
  const noteValues = Array.isArray(candidate.notes) ? candidate.notes.slice(0, MAX_NOTES) : defaults.notes
  const notes: PersistedReadingNote[] = []
  const noteKeys = new Set<string>()
  for (const value of noteValues) {
    const note = sanitizeNote(value, firstDocumentId)
    if (!note || !sanitizedDocumentIds.has(note.documentId)) continue
    const key = `${note.documentId}:${note.id}`
    if (noteKeys.has(key)) continue
    noteKeys.add(key)
    notes.push(note)
  }

  return { version: 1, documents: sanitizedDocuments, folders, notes }
}

function browserStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function loadReadingWorkspaceState(
  fallbackState: ReadingWorkspaceState,
  storage: StorageLike | null = browserStorage(),
): ReadingWorkspaceLoadResult {
  const fallback = cloneState(fallbackState)
  if (!storage) return { state: fallback, recovered: false }
  try {
    const serialized = storage.getItem(READING_WORKSPACE_STORAGE_KEY)
    if (serialized == null) return { state: fallback, recovered: false }
    const parsed: unknown = JSON.parse(serialized)
    const state = sanitizeReadingWorkspaceState(parsed, fallback)
    return {
      state,
      recovered: JSON.stringify(parsed) !== JSON.stringify(state),
    }
  } catch {
    return {
      state: fallback,
      recovered: true,
      error: '本地阅读数据无法读取，已恢复安全默认数据。',
    }
  }
}

export function persistReadingWorkspaceState(
  candidate: ReadingWorkspaceState,
  storage: StorageLike | null = browserStorage(),
): ReadingWorkspacePersistResult {
  if (!storage) return { ok: false, error: '浏览器存储不可用，本次修改未保存。' }
  try {
    const state = sanitizeReadingWorkspaceState(candidate)
    storage.setItem(READING_WORKSPACE_STORAGE_KEY, JSON.stringify(state))
    return { ok: true, state }
  } catch {
    return { ok: false, error: '本地存储空间不足或不可用，本次修改未保存。' }
  }
}
