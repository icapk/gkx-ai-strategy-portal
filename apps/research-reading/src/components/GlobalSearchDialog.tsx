import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import type { ResearchDocument, ResearchNote } from '../types'
import {
  countResearchSearchResults,
  filterResearchSearchResults,
  getResearchSearchTerms,
  listResearchContent,
  searchResearchContent,
  type ResearchSearchResult,
  type ResearchSearchScope,
} from '../researchSearch'
import { displayResearchLocation } from '../workbenchDocuments'
import { Modal } from './Modal'

interface GlobalSearchDialogProps {
  documents: ResearchDocument[]
  notes: ResearchNote[]
  onClose: () => void
  onOpenDocument: (document: ResearchDocument, target?: { blockId?: string; query?: string }) => void
  onLocateDocument: (document: ResearchDocument) => void
  onOpenNote: (note: ResearchNote) => void
}

const recentSearchesStorageKey = 'intelligent-research-portal:recent-searches:v1'
const maximumRecentSearches = 6
const searchResultsPageSize = 10

const documentResultIcons: Record<ResearchDocument['kind'], string> = {
  在线文档: '/assets/document-word.svg',
  数据表格: '/assets/document-sheet.svg',
  PDF文档: '/assets/action-pdf.svg',
  Word文档: '/assets/action-word.svg',
  Excel文档: '/assets/document-sheet.svg',
}

const scopeOptions: Array<{ value: ResearchSearchScope; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'documents', label: '文档' },
  { value: 'notes', label: '笔记' },
]

function loadRecentSearches() {
  try {
    const stored = window.localStorage.getItem(recentSearchesStorageKey)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return Array.from(new Set(parsed.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean))).slice(0, maximumRecentSearches)
  } catch {
    return []
  }
}

function saveRecentSearches(searches: string[]) {
  try {
    window.localStorage.setItem(recentSearchesStorageKey, JSON.stringify(searches))
  } catch {
    // Search remains usable when storage is unavailable or full.
  }
}

function HighlightedText({ text, terms }: { text: string; terms: string[] }) {
  if (!text || terms.length === 0) return <>{text}</>

  const normalizedText = text.toLocaleLowerCase('zh-CN')
  const parts: ReactNode[] = []
  let cursor = 0

  while (cursor < text.length) {
    let matchStart = -1
    let matchTerm = ''
    for (const term of terms) {
      const index = normalizedText.indexOf(term, cursor)
      if (index < 0) continue
      if (matchStart < 0 || index < matchStart || (index === matchStart && term.length > matchTerm.length)) {
        matchStart = index
        matchTerm = term
      }
    }

    if (matchStart < 0) {
      parts.push(text.slice(cursor))
      break
    }
    if (matchStart > cursor) parts.push(text.slice(cursor, matchStart))
    const matchEnd = matchStart + matchTerm.length
    parts.push(<mark className="global-search-highlight" key={`${matchStart}-${matchEnd}`}>{text.slice(matchStart, matchEnd)}</mark>)
    cursor = matchEnd
  }

  return <>{parts}</>
}

function ResultMetadata({ result, terms }: { result: ResearchSearchResult; terms: string[] }) {
  if (result.type === 'document') {
    return (
      <div className="global-search-result-metadata" aria-label="文档信息">
        <span><b>文档类型：</b><HighlightedText text={result.document.kind} terms={terms} /></span>
        <span><b>所有者：</b><HighlightedText text={result.document.owner} terms={terms} /></span>
        <span><b>创建时间：</b><HighlightedText text={result.document.createdAt} terms={terms} /></span>
        <span><b>文件大小：</b><HighlightedText text={result.document.size} terms={terms} /></span>
      </div>
    )
  }

  return (
    <div className="global-search-result-metadata" aria-label="笔记信息">
      <span><b>信息类型：</b>笔记</span>
      <span><b>所属文档：</b><HighlightedText text={result.documentTitle} terms={terms} /></span>
      <span><b>更新时间：</b><HighlightedText text={result.note.updatedAt} terms={terms} /></span>
    </div>
  )
}

function ResultTags({ result, terms }: { result: ResearchSearchResult; terms: string[] }) {
  const tags = result.type === 'document' ? result.document.keywords ?? [] : result.note.tags
  if (tags.length === 0) return null
  const visibleTags = tags.slice(0, 3)
  const remainingTagCount = tags.length - visibleTags.length
  return (
    <div className="global-search-result-tags" aria-label={result.type === 'document' ? '文档关键词' : '笔记标签'}>
      {visibleTags.map((tag, index) => <span title={tag} key={`${tag}-${index}`}><HighlightedText text={tag} terms={terms} /></span>)}
      {remainingTagCount > 0 && <span className="global-search-result-tag-count" title={`另有 ${remainingTagCount} 个标签`}>+{remainingTagCount}</span>}
    </div>
  )
}

function ResultIcon({ result }: { result: ResearchSearchResult }) {
  if (result.type === 'note') {
    return <span className="global-search-result-icon global-search-result-icon--note" aria-hidden="true"><i /></span>
  }
  return (
    <span className={`global-search-result-icon global-search-result-icon--${result.document.kind === '在线文档' ? 'online' : result.document.kind === '数据表格' ? 'sheet' : 'file'}`} aria-hidden="true">
      <img src={documentResultIcons[result.document.kind]} alt="" />
    </span>
  )
}

function resultActionLabel(result: ResearchSearchResult) {
  if (result.type === 'note') return '查看笔记'
  if (result.document.kind === '数据表格') return '打开表格'
  if (result.document.kind !== '在线文档') return '定位文档'
  return result.targetBlockId || result.matchedFields.includes('正文') ? '打开并定位' : '打开文档'
}

export function GlobalSearchDialog({
  documents,
  notes,
  onClose,
  onOpenDocument,
  onLocateDocument,
  onOpenNote,
}: GlobalSearchDialogProps) {
  const [draftQuery, setDraftQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [scope, setScope] = useState<ResearchSearchScope>('all')
  const [resultPage, setResultPage] = useState(1)
  const [recentSearches, setRecentSearches] = useState(loadRecentSearches)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultListRef = useRef<HTMLDivElement>(null)

  const hasSubmittedQuery = Boolean(submittedQuery)
  const allResults = useMemo(() => (
    hasSubmittedQuery
      ? searchResearchContent(documents, notes, submittedQuery)
      : listResearchContent(documents, notes)
  ), [documents, hasSubmittedQuery, notes, submittedQuery])
  const counts = useMemo(() => countResearchSearchResults(allResults), [allResults])
  const visibleResults = useMemo(() => filterResearchSearchResults(allResults, scope), [allResults, scope])
  const terms = useMemo(() => getResearchSearchTerms(submittedQuery), [submittedQuery])
  const totalResultPages = Math.max(1, Math.ceil(visibleResults.length / searchResultsPageSize))
  const paginatedResults = useMemo(
    () => visibleResults.slice((resultPage - 1) * searchResultsPageSize, resultPage * searchResultsPageSize),
    [resultPage, visibleResults],
  )
  const resultPageNumbers = useMemo(() => {
    const firstPage = Math.max(1, Math.min(resultPage - 2, totalResultPages - 4))
    return Array.from({ length: Math.min(5, totalResultPages) }, (_, index) => firstPage + index)
  }, [resultPage, totalResultPages])
  const currentScopeLabel = scope === 'documents' ? '全部文档' : scope === 'notes' ? '全部笔记' : '全部科研内容'

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => window.cancelAnimationFrame(animationFrame)
  }, [])

  useEffect(() => {
    if (resultPage > totalResultPages) setResultPage(totalResultPages)
  }, [resultPage, totalResultPages])

  const rememberSearch = (query: string) => {
    const next = [query, ...recentSearches.filter((item) => item.toLocaleLowerCase('zh-CN') !== query.toLocaleLowerCase('zh-CN'))].slice(0, maximumRecentSearches)
    setRecentSearches(next)
    saveRecentSearches(next)
  }

  const runSearch = (query: string) => {
    const value = query.trim()
    if (!value) return
    setDraftQuery(value)
    setSubmittedQuery(value)
    setResultPage(1)
    rememberSearch(value)
  }

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    runSearch(draftQuery)
  }

  const clearSearch = () => {
    setDraftQuery('')
    setSubmittedQuery('')
    setScope('all')
    setResultPage(1)
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    try {
      window.localStorage.removeItem(recentSearchesStorageKey)
    } catch {
      // Ignore storage failures; the in-memory list is already cleared.
    }
  }

  const openResult = (result: ResearchSearchResult) => {
    if (result.type === 'document') {
      if (result.document.kind === '在线文档' || result.document.kind === '数据表格') {
        onOpenDocument(result.document, {
          blockId: result.targetBlockId,
          query: submittedQuery || undefined,
        })
      } else onLocateDocument(result.document)
    } else onOpenNote(result.note)
    onClose()
  }

  const changeResultPage = (nextPage: number) => {
    setResultPage(Math.max(1, Math.min(totalResultPages, nextPage)))
    window.requestAnimationFrame(() => { if (resultListRef.current) resultListRef.current.scrollTop = 0 })
  }

  return (
    <Modal
      title="全文搜索"
      onClose={onClose}
      onSubmit={submitSearch}
      extraWide
      tall
      hideFooter
      bodyClassName="global-search-body"
    >
      <div className="global-search-layout">
        <div className="global-search-controls">
          <label className="global-search-input-wrap">
            <span className="global-search-input-label">搜索科研文档和笔记</span>
            <input
              ref={inputRef}
              className="global-search-input"
              type="search"
              value={draftQuery}
              maxLength={100}
              placeholder="输入标题、关键词、文档信息或笔记内容"
              autoComplete="off"
              onChange={(event) => setDraftQuery(event.target.value)}
            />
          </label>
          {(draftQuery || submittedQuery) && <button className="global-search-clear" type="button" onClick={clearSearch} aria-label="清空搜索">清空</button>}
          <button className="global-search-submit" type="submit" disabled={!draftQuery.trim()}>搜索</button>
        </div>

        <div className="global-search-scopes" role="group" aria-label="搜索范围">
          {scopeOptions.map((option) => (
            <button
              className={`global-search-scope${scope === option.value ? ' global-search-scope--active' : ''}`}
              type="button"
              aria-pressed={scope === option.value}
              onClick={() => { setScope(option.value); setResultPage(1) }}
              key={option.value}
            >
              {option.label}<span>{counts[option.value]}</span>
            </button>
          ))}
        </div>

        {visibleResults.length === 0 ? (
          <section className="global-search-empty" role="status">
            <h3>{hasSubmittedQuery ? '未找到匹配内容' : '暂无可浏览内容'}</h3>
            <p>{hasSubmittedQuery ? '尝试更换关键词或切换搜索范围。' : '新建文档或笔记后，将在这里统一展示。'}</p>
          </section>
        ) : (
          <section className="global-search-results" aria-label={hasSubmittedQuery ? '搜索结果' : '科研内容列表'}>
            <div className="global-search-summary" role="status" aria-live="polite">
              <span>{hasSubmittedQuery ? '找到' : currentScopeLabel} <b>{visibleResults.length}</b> 条{hasSubmittedQuery ? '结果' : ''}</span>
              <small>{hasSubmittedQuery ? `搜索“${submittedQuery}”` : '打开即可浏览，输入关键词可全文检索'}</small>
            </div>
            {!hasSubmittedQuery && recentSearches.length > 0 && (
              <div className="global-search-recent-inline" aria-label="最近搜索">
                <span>最近搜索</span>
                <div>
                  {recentSearches.slice(0, 3).map((query) => <button type="button" onClick={() => runSearch(query)} key={query}>{query}</button>)}
                </div>
                <button className="global-search-recent-clear" type="button" onClick={clearRecentSearches}>清除</button>
              </div>
            )}
            <div className="global-search-result-list" ref={resultListRef}>
              {paginatedResults.map((result) => {
                const title = result.type === 'document' ? result.document.title : result.note.title
                const actionLabel = resultActionLabel(result)
                const displayTerms = terms.map(displayResearchLocation)
                return (
                <article className={`global-search-result global-search-result--${result.type}`} key={result.id}>
                  <ResultIcon result={result} />
                  <div className="global-search-result-main">
                    <header className="global-search-result-header">
                      <h3 title={title}><HighlightedText text={title} terms={terms} /></h3>
                      <ResultTags result={result} terms={terms} />
                    </header>
                    <ResultMetadata result={result} terms={terms} />
                    <div className="global-search-result-match">
                      <span>{hasSubmittedQuery ? `命中：${result.matchedFields.join('、')}` : result.type === 'document' ? '文档摘要' : '笔记摘要'}</span>
                      <p><HighlightedText text={displayResearchLocation(result.snippet)} terms={displayTerms} /></p>
                    </div>
                  </div>
                  <button
                    className={`global-search-result-action${result.type === 'note' || (result.type === 'document' && (result.document.kind === '在线文档' || result.document.kind === '数据表格')) ? ' global-search-result-action--primary' : ''}`}
                    type="button"
                    aria-label={`${actionLabel}“${title}”`}
                    onClick={() => openResult(result)}
                  >
                    {actionLabel}
                  </button>
                </article>
                )
              })}
            </div>
            <nav className="global-search-pagination" aria-label="搜索结果分页">
              <button type="button" disabled={resultPage === 1} aria-label="上一页" onClick={() => changeResultPage(resultPage - 1)}><span className="pager-chevron pager-chevron--prev" aria-hidden="true" /></button>
              {resultPageNumbers.map((pageNumber) => (
                <button
                  type="button"
                  className={resultPage === pageNumber ? 'is-current' : ''}
                  aria-current={resultPage === pageNumber ? 'page' : undefined}
                  onClick={() => changeResultPage(pageNumber)}
                  key={pageNumber}
                >{pageNumber}</button>
              ))}
              <button type="button" disabled={resultPage === totalResultPages} aria-label="下一页" onClick={() => changeResultPage(resultPage + 1)}><span className="pager-chevron" aria-hidden="true" /></button>
              <span className="global-search-page-size">{searchResultsPageSize}条/页</span>
            </nav>
          </section>
        )}
      </div>
    </Modal>
  )
}
