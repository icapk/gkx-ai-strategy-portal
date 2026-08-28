import type { ResearchDocument, ResearchNote } from './types'

export type ResearchSearchScope = 'all' | 'documents' | 'notes'

interface SearchField {
  label: string
  value: string
  weight: number
}

interface SearchResultBase {
  id: string
  documentId: number
  documentTitle: string
  matchedFields: string[]
  score: number
  sourceIndex: number
  snippet: string
  targetBlockId?: string
}

export interface DocumentSearchResult extends SearchResultBase {
  type: 'document'
  document: ResearchDocument
}

export interface NoteSearchResult extends SearchResultBase {
  type: 'note'
  note: ResearchNote
}

export type ResearchSearchResult = DocumentSearchResult | NoteSearchResult

export interface ResearchSearchCounts {
  all: number
  documents: number
  notes: number
}

const kindOrder: Record<ResearchSearchResult['type'], number> = {
  document: 0,
  note: 1,
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase('zh-CN')
}

export function getResearchSearchTerms(query: string) {
  return Array.from(new Set(query.trim().split(/\s+/).map(normalize).filter(Boolean)))
}

function fieldMatchScore(field: SearchField, term: string) {
  const normalizedValue = normalize(field.value)
  if (!normalizedValue.includes(term)) return 0
  if (normalizedValue === term) return field.weight + 80
  if (normalizedValue.startsWith(term)) return field.weight + 40
  return field.weight
}

function evaluateFields(fields: SearchField[], query: string) {
  const terms = getResearchSearchTerms(query)
  if (terms.length === 0) return null

  const matchedFields = new Set<string>()
  let score = 0

  for (const term of terms) {
    let bestScore = 0
    for (const field of fields) {
      const nextScore = fieldMatchScore(field, term)
      if (nextScore > 0) matchedFields.add(field.label)
      bestScore = Math.max(bestScore, nextScore)
    }
    if (bestScore === 0) return null
    score += bestScore
  }

  const normalizedQuery = normalize(query)
  if (normalizedQuery.includes(' ') && fields.some((field) => normalize(field.value).includes(normalizedQuery))) {
    score += 100
  }

  const bestField = fields
    .filter((field) => terms.some((term) => normalize(field.value).includes(term)))
    .sort((first, second) => second.weight - first.weight)[0]

  return {
    matchedFields: Array.from(matchedFields),
    score,
    snippet: bestField?.value ?? '',
  }
}

export function makeResearchSearchSnippet(text: string, terms: string[], maximumLength = 148) {
  if (text.length <= maximumLength) return text
  const normalizedText = text.toLocaleLowerCase('zh-CN')
  const matchIndex = terms.reduce((closest, term) => {
    const index = normalizedText.indexOf(term)
    if (index < 0) return closest
    return closest < 0 ? index : Math.min(closest, index)
  }, -1)
  if (matchIndex < 0) return `${text.slice(0, maximumLength).trimEnd()}…`

  const contextBefore = Math.floor(maximumLength * 0.35)
  const start = Math.max(0, matchIndex - contextBefore)
  const end = Math.min(text.length, start + maximumLength)
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`
}

function documentFields(document: ResearchDocument): SearchField[] {
  const displayLocation = document.location === '我的空间'
    ? '个人空间'
    : document.location.startsWith('我的空间/')
      ? `个人空间${document.location.slice('我的空间'.length)}`
      : document.location
  return [
    { label: '标题', value: document.title, weight: 360 },
    { label: '描述', value: document.description ?? '', weight: 230 },
    { label: '正文', value: document.content ?? '', weight: 220 },
    ...(document.keywords ?? []).map((keyword) => ({ label: '关键词', value: keyword, weight: 280 })),
    { label: '位置', value: document.location, weight: 160 },
    ...(displayLocation === document.location ? [] : [{ label: '位置', value: displayLocation, weight: 160 }]),
    { label: '所有者', value: document.owner, weight: 150 },
    { label: '类型', value: document.kind, weight: 130 },
    { label: '创建时间', value: document.createdAt, weight: 80 },
    { label: '最近访问', value: document.visitedAt, weight: 80 },
    { label: '大小', value: document.size, weight: 60 },
  ]
}

function noteFields(note: ResearchNote, documentTitle: string): SearchField[] {
  return [
    { label: '标题', value: note.title, weight: 340 },
    { label: '正文', value: note.content, weight: 240 },
    ...note.tags.map((tag) => ({ label: '标签', value: tag, weight: 290 })),
    { label: '所属文档', value: documentTitle, weight: 120 },
    { label: '创建时间', value: note.createdAt, weight: 70 },
    { label: '更新时间', value: note.updatedAt, weight: 80 },
  ]
}

function blockSearchText(block: NonNullable<ResearchDocument['blocks']>[number]) {
  if (block.type === 'text') return block.text
  if (block.type === 'list') return block.items.join(' ')
  if (block.type === 'image') return `${block.alt} ${block.caption}`
  if (block.type === 'formula') return block.latex
  if (block.type === 'bookmark') return `${block.title} ${block.description} ${block.url}`
  return ''
}

function documentBrowseSnippet(document: ResearchDocument) {
  const blockContent = document.blocks?.map(blockSearchText).filter(Boolean).join(' ')
  return document.description?.trim()
    || document.content?.trim()
    || blockContent?.trim()
    || `${document.location} · ${document.owner}`
}

export function listResearchContent(
  documents: ResearchDocument[],
  notes: ResearchNote[],
): ResearchSearchResult[] {
  const documentsById = new Map(documents.map((document) => [document.id, document]))
  const documentResults: DocumentSearchResult[] = documents.map((document, sourceIndex) => ({
    id: `document:${document.id}`,
    type: 'document',
    documentId: document.id,
    documentTitle: document.title,
    document,
    matchedFields: [],
    score: 0,
    sourceIndex,
    snippet: makeResearchSearchSnippet(documentBrowseSnippet(document), []),
  }))
  const noteResults: NoteSearchResult[] = notes.flatMap((note, sourceIndex) => {
    const parentDocument = documentsById.get(note.documentId)
    if (!parentDocument) return []
    return [{
      id: `note:${note.id}`,
      type: 'note',
      documentId: note.documentId,
      documentTitle: parentDocument.title,
      note,
      matchedFields: [],
      score: 0,
      sourceIndex,
      snippet: makeResearchSearchSnippet(note.content.trim() || `来自「${parentDocument.title}」的笔记`, []),
    }]
  })

  return [...documentResults, ...noteResults].sort((first, second) => (
    kindOrder[first.type] - kindOrder[second.type]
    || first.sourceIndex - second.sourceIndex
    || first.id.localeCompare(second.id)
  ))
}

function documentSearchTarget(document: ResearchDocument, terms: string[]) {
  const targetBlockId = document.blocks?.find((block) => (
    terms.some((term) => normalize(blockSearchText(block)).includes(term))
  ))?.id
  return { targetBlockId }
}

export function searchResearchContent(
  documents: ResearchDocument[],
  notes: ResearchNote[],
  query: string,
): ResearchSearchResult[] {
  const terms = getResearchSearchTerms(query)
  if (terms.length === 0) return []

  const documentsById = new Map(documents.map((document) => [document.id, document]))
  const documentResults: DocumentSearchResult[] = documents.flatMap((document, sourceIndex) => {
    const match = evaluateFields(documentFields(document), query)
    if (!match) return []
    const snippetSource = document.description && terms.some((term) => normalize(document.description ?? '').includes(term))
      ? document.description
      : match.snippet
    const target = documentSearchTarget(document, terms)
    return [{
      id: `document:${document.id}`,
      type: 'document',
      documentId: document.id,
      documentTitle: document.title,
      document,
      matchedFields: match.matchedFields,
      score: match.score,
      sourceIndex,
      snippet: makeResearchSearchSnippet(snippetSource, terms),
      ...target,
    }]
  })

  const noteResults: NoteSearchResult[] = notes.flatMap((note, sourceIndex) => {
    const parentDocument = documentsById.get(note.documentId)
    if (!parentDocument) return []
    const documentTitle = parentDocument.title
    const match = evaluateFields(noteFields(note, documentTitle), query)
    if (!match) return []
    const snippetSource = terms.some((term) => normalize(note.content).includes(term)) ? note.content : match.snippet
    return [{
      id: `note:${note.id}`,
      type: 'note',
      documentId: note.documentId,
      documentTitle,
      note,
      matchedFields: match.matchedFields,
      score: match.score,
      sourceIndex,
      snippet: makeResearchSearchSnippet(snippetSource, terms),
    }]
  })

  return [...documentResults, ...noteResults].sort((first, second) => (
    second.score - first.score
    || kindOrder[first.type] - kindOrder[second.type]
    || first.sourceIndex - second.sourceIndex
    || first.id.localeCompare(second.id)
  ))
}

export function countResearchSearchResults(results: ResearchSearchResult[]): ResearchSearchCounts {
  const documents = results.filter((result) => result.type === 'document').length
  const notes = results.length - documents
  return { all: results.length, documents, notes }
}

export function filterResearchSearchResults(results: ResearchSearchResult[], scope: ResearchSearchScope) {
  if (scope === 'all') return results
  const type = scope === 'documents' ? 'document' : 'note'
  return results.filter((result) => result.type === type)
}
