import type {
  DocumentBlock,
  DocumentBookmarkBlock,
  DocumentDividerBlock,
  DocumentFormulaBlock,
  DocumentImageBlock,
  DocumentListBlock,
  DocumentTextBlock,
  ResearchDocument,
} from './types'

const STORAGE_KEY = 'intelligent-research-portal:documents:v1'
const STORAGE_VERSION = 1
const MAX_STORAGE_CHARACTERS = 4_200_000
const documentKinds = new Set(['在线文档', '数据表格', 'PDF文档', 'Word文档', 'Excel文档'])
let blockCounter = 0

type DocumentBlockType = DocumentBlock['type']

interface StoredDocuments {
  version: number
  documents: ResearchDocument[]
  recycledDocuments: ResearchDocument[]
  deletedDocumentIds: number[]
}

type StoredDocumentState = Omit<StoredDocuments, 'version'>
type StorageResult = { ok: true } | { ok: false; error: string }

const emptyStoredState = (): StoredDocumentState => ({
  documents: [],
  recycledDocuments: [],
  deletedDocumentIds: [],
})

const nextBlockId = () => {
  blockCounter += 1
  return `block-${Date.now().toString(36)}-${blockCounter.toString(36)}`
}

const cleanString = (value: unknown, maximum = 10_000) => (
  typeof value === 'string' ? value.slice(0, maximum) : ''
)

const cleanBlockId = (value: unknown) => {
  const candidate = cleanString(value, 120).trim()
  return candidate || nextBlockId()
}

const safeImageSource = (value: unknown) => (
  typeof value === 'string' && /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value)
    ? value
    : ''
)

const sanitizeBlock = (value: unknown): DocumentBlock | null => {
  if (!value || typeof value !== 'object') return null
  const block = value as Partial<DocumentBlock> & Record<string, unknown>
  const id = cleanBlockId(block.id)

  if (block.type === 'text') {
    const style = block.style === 'heading-1' || block.style === 'heading-2' || block.style === 'quote'
      ? block.style
      : 'paragraph'
    return {
      id,
      type: 'text',
      text: cleanString(block.text, 20_000),
      style,
      bold: Boolean(block.bold),
      italic: Boolean(block.italic),
      underline: Boolean(block.underline),
    }
  }

  if (block.type === 'list') {
    const items = Array.isArray(block.items)
      ? block.items.slice(0, 100).map((item) => cleanString(item, 1_000))
      : ['']
    return { id, type: 'list', ordered: Boolean(block.ordered), items: items.length ? items : [''] }
  }

  if (block.type === 'image') {
    return {
      id,
      type: 'image',
      src: safeImageSource(block.src),
      alt: cleanString(block.alt, 200),
      caption: cleanString(block.caption, 300),
    }
  }

  if (block.type === 'formula') {
    return { id, type: 'formula', latex: cleanString(block.latex, 2_000) }
  }

  if (block.type === 'bookmark') {
    return {
      id,
      type: 'bookmark',
      url: cleanString(block.url, 2_000),
      title: cleanString(block.title, 200),
      description: cleanString(block.description, 500),
    }
  }

  if (block.type === 'divider') {
    return { id, type: 'divider', style: block.style === 'dashed' ? 'dashed' : 'solid' }
  }

  return null
}

const sanitizeBlocks = (value: unknown): DocumentBlock[] => {
  if (!Array.isArray(value)) return []
  return value.slice(0, 200).map(sanitizeBlock).filter((block): block is DocumentBlock => Boolean(block))
}

const sanitizeDocument = (value: unknown): ResearchDocument | null => {
  if (!value || typeof value !== 'object') return null
  const item = value as Partial<ResearchDocument> & Record<string, unknown>
  // Hide records created by the retired PDF archive feature. Its binary data is
  // left untouched in IndexedDB so rollback does not destroy local source files.
  if (item.pdfArchive && typeof item.pdfArchive === 'object') return null
  if (!Number.isInteger(item.id) || Number(item.id) <= 0) return null
  if (!documentKinds.has(String(item.kind))) return null
  const title = cleanString(item.title, 50).trim()
  if (!title) return null

  return {
    id: Number(item.id),
    title,
    location: cleanString(item.location, 160) || '我的空间/研究',
    owner: cleanString(item.owner, 60) || '未知用户',
    createdAt: cleanString(item.createdAt, 40),
    visitedAt: cleanString(item.visitedAt, 40),
    size: cleanString(item.size, 30) || '0 KB',
    kind: item.kind as ResearchDocument['kind'],
    favorite: Boolean(item.favorite),
    owned: Boolean(item.owned),
    shared: Boolean(item.shared),
    description: cleanString(item.description, 500),
    keywords: Array.isArray(item.keywords)
      ? item.keywords.slice(0, 20).map((keyword) => cleanString(keyword, 60)).filter(Boolean)
      : [],
    content: cleanString(item.content, 120_000),
    blocks: sanitizeBlocks(item.blocks),
  }
}

const uniqueDocuments = (documents: ResearchDocument[]) => {
  const seen = new Set<number>()
  return documents.filter((documentItem) => {
    if (seen.has(documentItem.id)) return false
    seen.add(documentItem.id)
    return true
  })
}

const readStoredState = (): StoredDocumentState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStoredState()
    const parsed = JSON.parse(raw) as Partial<StoredDocuments>
    if (parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.documents)) return emptyStoredState()
    const documents = uniqueDocuments(parsed.documents.map(sanitizeDocument).filter((item): item is ResearchDocument => Boolean(item)))
    const activeIds = new Set(documents.map((item) => item.id))
    const recycledDocuments = uniqueDocuments(
      (Array.isArray(parsed.recycledDocuments) ? parsed.recycledDocuments : [])
        .map(sanitizeDocument)
        .filter((item): item is ResearchDocument => item != null && !activeIds.has(item.id)),
    )
    const recycledIds = new Set(recycledDocuments.map((item) => item.id))
    const deletedDocumentIds = Array.from(new Set(
      (Array.isArray(parsed.deletedDocumentIds) ? parsed.deletedDocumentIds : [])
        .filter((id): id is number => Number.isInteger(id) && id > 0)
        .filter((id) => !activeIds.has(id) && !recycledIds.has(id)),
    ))
    return { documents, recycledDocuments, deletedDocumentIds }
  } catch {
    return emptyStoredState()
  }
}

const writeStoredState = (state: StoredDocumentState): StorageResult => {
  try {
    const serialized = JSON.stringify({ version: STORAGE_VERSION, ...state } satisfies StoredDocuments)
    if (serialized.length > MAX_STORAGE_CHARACTERS) {
      return { ok: false, error: '文档图片占用空间较大，请压缩或删除部分图片后再保存。' }
    }
    window.localStorage.setItem(STORAGE_KEY, serialized)
    return { ok: true }
  } catch {
    return { ok: false, error: '当前浏览器存储空间不足，操作尚未保存。' }
  }
}

export const createDocumentBlock = (type: DocumentBlockType): DocumentBlock => {
  const id = nextBlockId()
  if (type === 'text') {
    return { id, type, text: '', style: 'paragraph', bold: false, italic: false, underline: false }
  }
  if (type === 'list') return { id, type, ordered: false, items: [''] }
  if (type === 'image') return { id, type, src: '', alt: '', caption: '' }
  if (type === 'formula') return { id, type, latex: '' }
  if (type === 'bookmark') return { id, type, url: '', title: '', description: '' }
  return { id, type: 'divider', style: 'solid' }
}

export const cloneDocumentBlocks = (blocks: DocumentBlock[]) => (
  blocks.map((block): DocumentBlock => {
    if (block.type === 'list') return { ...block, items: [...block.items] }
    return { ...block }
  })
)

export const getDocumentBlocks = (documentItem: ResearchDocument): DocumentBlock[] => {
  const stored = sanitizeBlocks(documentItem.blocks)
  if (stored.length) return cloneDocumentBlocks(stored)
  const block = createDocumentBlock('text') as DocumentTextBlock
  block.text = documentItem.content ?? ''
  return [block]
}

export const documentBlocksToText = (blocks: DocumentBlock[]) => blocks.flatMap((block) => {
  if (block.type === 'text') return [block.text]
  if (block.type === 'list') return block.items
  if (block.type === 'image') return [block.alt, block.caption]
  if (block.type === 'formula') return [block.latex]
  if (block.type === 'bookmark') return [block.title, block.description, block.url]
  return []
}).map((part) => part.trim()).filter(Boolean).join('\n')

export const estimateDocumentSize = (blocks: DocumentBlock[]) => {
  const bytes = new Blob([JSON.stringify(blocks)]).size
  if (bytes < 1024) return `${Math.max(1, bytes)} B`
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const normalizeHttpUrl = (rawValue: string) => {
  const trimmed = rawValue.trim()
  if (!trimmed) return null
  try {
    const candidate = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`
    const url = new URL(candidate)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
}

export const loadResearchDocuments = (fallbackDocuments: ResearchDocument[]) => {
  if (typeof window === 'undefined') return fallbackDocuments
  const storedState = readStoredState()
  const excludedIds = new Set([
    ...storedState.recycledDocuments.map((item) => item.id),
    ...storedState.deletedDocumentIds,
  ])
  const fallbackIds = new Set(fallbackDocuments.map((item) => item.id))
  const storedById = new Map(storedState.documents.map((item) => [item.id, item]))
  const restoredNewDocuments = storedState.documents.filter((item) => !fallbackIds.has(item.id) && !excludedIds.has(item.id))
  const mergedFallbacks = fallbackDocuments
    .filter((item) => !excludedIds.has(item.id))
    .map((item) => storedById.get(item.id) ?? item)
  return [...restoredNewDocuments, ...mergedFallbacks]
}

export const loadRecycledResearchDocuments = () => {
  if (typeof window === 'undefined') return []
  return readStoredState().recycledDocuments
}

export const persistResearchDocument = (documentItem: ResearchDocument): StorageResult => {
  const state = readStoredState()
  return writeStoredState({
    documents: [documentItem, ...state.documents.filter((item) => item.id !== documentItem.id)],
    recycledDocuments: state.recycledDocuments.filter((item) => item.id !== documentItem.id),
    deletedDocumentIds: state.deletedDocumentIds.filter((id) => id !== documentItem.id),
  })
}

export const persistRecycledResearchDocument = (documentItem: ResearchDocument): StorageResult => {
  const state = readStoredState()
  return writeStoredState({
    documents: state.documents.filter((item) => item.id !== documentItem.id),
    recycledDocuments: [documentItem, ...state.recycledDocuments.filter((item) => item.id !== documentItem.id)],
    deletedDocumentIds: state.deletedDocumentIds.filter((id) => id !== documentItem.id),
  })
}

export const removePersistedResearchDocument = (documentId: number): StorageResult => {
  const state = readStoredState()
  return writeStoredState({
    documents: state.documents.filter((item) => item.id !== documentId),
    recycledDocuments: state.recycledDocuments.filter((item) => item.id !== documentId),
    deletedDocumentIds: [documentId, ...state.deletedDocumentIds.filter((id) => id !== documentId)],
  })
}

export type {
  DocumentBookmarkBlock,
  DocumentDividerBlock,
  DocumentFormulaBlock,
  DocumentImageBlock,
  DocumentListBlock,
  DocumentTextBlock,
}
