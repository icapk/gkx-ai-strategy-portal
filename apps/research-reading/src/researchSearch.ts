import type { ResearchDocument, ResearchNote } from './types'
import { minute } from './researchSort.ts'

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
  targetPageNumber?: number
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

const collator = new Intl.Collator('zh-Hans-CN-u-co-pinyin', {numeric:true,sensitivity:'base'})
function compareResults(a:ResearchSearchResult,b:ResearchSearchResult) {
 const time=(r:ResearchSearchResult)=>minute(r.type==='document'?r.document.visitedAt:r.note.updatedAt)
 const created=(r:ResearchSearchResult)=>minute(r.type==='document'?r.document.createdAt:r.note.createdAt)
 const title=(r:ResearchSearchResult)=>r.type==='document'?r.document.title:r.note.title
 const stable=a.type==='document'&&b.type==='document'?a.document.id-b.document.id:a.type==='note'&&b.type==='note'?a.note.id-b.note.id:a.id.localeCompare(b.id)
 return time(b).localeCompare(time(a))||created(b).localeCompare(created(a))||collator.compare(title(a),title(b))||stable
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
 return [
  {label:'标题',value:document.title,weight:360},
  {label:'正文',value:[document.content,document.pdfTextContent,document.blocks?.map(blockSearchText).join(' ')].filter(Boolean).join(' '),weight:220},
 ]
}
function noteFields(note:ResearchNote, _documentTitle:string):SearchField[] {
 return [{label:'标题',value:note.title,weight:360},{label:'正文',value:note.content,weight:220}]
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
    || document.pdfTextContent?.trim()
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
    if (!parentDocument?.pdfArchive || !note.pdfAnnotationId || !note.pageNumber) return []
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

  return [...documentResults, ...noteResults].sort(compareResults)
}

function documentSearchTarget(document: ResearchDocument, terms: string[]) {
  const targetBlockId = document.blocks?.find((block) => (
    terms.some((term) => normalize(blockSearchText(block)).includes(term))
  ))?.id
  const normalizedPages = document.pdfArchive && document.pdfTextContent
    ? document.pdfTextContent.split('\n').map(normalize)
    : []
  let pageIndex = normalizedPages.findIndex((pageText) => terms.every((term) => pageText.includes(term)))
  if (pageIndex < 0) pageIndex = normalizedPages.findIndex((pageText) => terms.some((term) => pageText.includes(term)))
  return {
    targetBlockId,
    targetPageNumber: pageIndex >= 0 ? pageIndex + 1 : undefined,
  }
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
    const snippetSource = documentFields(document).find(f=>f.label==='正文')?.value || match.snippet
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
    if (!parentDocument?.pdfArchive || !note.pdfAnnotationId || !note.pageNumber) return []
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
    Number(second.matchedFields.includes('标题')) - Number(first.matchedFields.includes('标题'))
    || compareResults(first, second)
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
