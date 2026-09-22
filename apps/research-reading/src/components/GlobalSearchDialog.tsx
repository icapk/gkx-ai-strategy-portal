import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { FolderItem, ResearchDocument, ResearchNote } from '../types'
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
import { minute } from '../researchSort'
import { Modal } from './Modal'

interface GlobalSearchDialogProps {
  folders: (FolderItem & {scope:"personal"|"team"})[]
  onOpenFolder:(folder:FolderItem & {scope:"personal"|"team"})=>void
  documents: ResearchDocument[]
  notes: ResearchNote[]
  onClose: () => void
  onOpenDocument: (document: ResearchDocument, target?: { blockId?: string; query?: string; pageNumber?: number }) => void
  onLocateDocument: (document: ResearchDocument) => void
  onOpenNote: (note: ResearchNote) => void
}

const searchResultsPageSize = 10

const documentResultIcons: Record<ResearchDocument['kind'], string> = {
  附件: '/assets/action-word.svg',
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
        <span><b>最后打开时间：</b>{minute(result.document.visitedAt)||"—"}</span>
        <span><b>创建者：</b><HighlightedText text={result.document.owner} terms={terms} /></span>
        <span><b>创建时间：</b><HighlightedText text={minute(result.document.createdAt)||'—'} terms={terms} /></span>
      </div>
    )
  }

  return (
    <div className="global-search-result-metadata" aria-label="笔记信息">
      <span><b>所属文档：</b><HighlightedText text={result.documentTitle} terms={terms} /></span>
      <span><b>创建时间：</b>{minute(result.note.createdAt)||"—"}</span>
      <span><b>更新时间：</b><HighlightedText text={minute(result.note.updatedAt)||"—"} terms={terms} /></span>
    </div>
  )
}

function ResultIcon({ result }: { result: ResearchSearchResult }) {
  if(result.type==='document'&&result.document.id<0)return <span className="global-search-result-icon" aria-label="文件夹">📁</span>
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
  if(result.document.id<0)return '打开文件夹'
  if (result.document.kind === '数据表格') return '打开表格'
  if (result.document.pdfArchive) return result.targetPageNumber ? '打开并定位' : '打开阅读'
  if (result.document.kind !== '在线文档') return '定位文档'
  return result.targetBlockId || result.matchedFields.includes('正文') ? '打开并定位' : '打开文档'
}

export function GlobalSearchDialog({
  documents,
  folders, onOpenFolder,
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
  const inputRef = useRef<HTMLInputElement>(null)
  const resultListRef = useRef<HTMLDivElement>(null)

  const searchDocuments=useMemo(()=>[...documents,...folders.map((folder,index):ResearchDocument=>({id:-index-1,title:folder.name,location:folder.location??'我的空间',owner:folder.owner??'',kind:'附件',size:'-',createdAt:folder.createdAt??'',visitedAt:folder.visitedAt??'',favorite:false,owned:folder.scope==='personal',shared:folder.scope==='team'}))],[documents,folders])
  const hasSubmittedQuery = Boolean(submittedQuery)
  const allResults = useMemo(() => (
    hasSubmittedQuery
      ? searchResearchContent(searchDocuments, notes, submittedQuery)
      : listResearchContent(searchDocuments, notes)
  ), [searchDocuments, hasSubmittedQuery, notes, submittedQuery])
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

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => window.cancelAnimationFrame(animationFrame)
  }, [])

  useEffect(() => {
    if (resultPage > totalResultPages) setResultPage(totalResultPages)
  }, [resultPage, totalResultPages])

  const runSearch = (query: string) => {
    const value = query.trim()
    if (!value) {setSubmittedQuery('');setResultPage(1);return}
    setDraftQuery(value)
    setSubmittedQuery(value)
    setResultPage(1)
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

  const openResult = (result: ResearchSearchResult) => {
    if(result.type==='document'&&result.document.id<0){const folder=folders[-result.document.id-1];if(folder)onOpenFolder(folder);onClose();return}
    if (result.type === 'document') {
      if (result.document.kind === '在线文档' || result.document.kind === '数据表格' || result.document.pdfArchive) {
        onOpenDocument(result.document, {
          blockId: result.targetBlockId,
          query: submittedQuery || undefined,
          pageNumber: result.targetPageNumber,
        })
      } else onLocateDocument(result.document)
    } else onOpenNote(result.note)
    onClose()
  }

  const changeResultPage = (nextPage: number) => {
    setResultPage(Math.max(1, Math.min(totalResultPages, nextPage)))
    window.requestAnimationFrame(() => { if (resultListRef.current) resultListRef.current.scrollTop = 0 })
  }

  return createPortal(
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
              placeholder="输入文档或PDF笔记的标题、正文关键词"
              autoComplete="off"
              onChange={(event) => {setDraftQuery(event.target.value);if(!event.target.value.trim()){setSubmittedQuery('');setResultPage(1)}}}
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

        <p className="search-boundary">搜索范围包括在线文档的名称和内容、在线文件夹名称、上传文件夹/文档名称、PDF的笔记标题和内容，不支持搜索上传文档的正文内容。</p>
        {visibleResults.length === 0 ? (
          <section className="global-search-empty" role="status">
            <h3>{hasSubmittedQuery ? '未找到匹配内容' : '暂无可浏览内容'}</h3>
            <p>{hasSubmittedQuery ? '尝试更换关键词或切换搜索范围。' : '新建文档或笔记后，将在这里统一展示。'}</p>
          </section>
        ) : (
          <section className="global-search-results" aria-label={hasSubmittedQuery ? '搜索结果' : '科研内容列表'}>

            <div className="global-search-result-list" ref={resultListRef}>
              {paginatedResults.map((result) => {
                const title = result.type === 'document' ? result.document.title : result.note.title
                const actionLabel = resultActionLabel(result)

                return (
                <article className={`global-search-result global-search-result--${result.type}`} key={result.id}>
                  <ResultIcon result={result} />
                  <div className="global-search-result-main">
                    <header className="global-search-result-header">
                      <h3 title={title}><button type="button" onClick={()=>openResult(result)}><HighlightedText text={title} terms={terms} /></button></h3>

                    </header>
                    <ResultMetadata result={result} terms={terms} />
                    {result.type==="document"&&<div className="global-search-result-metadata" title={displayResearchLocation(result.document.location)}>位置：{displayResearchLocation(result.document.location)}</div>}
                    {hasSubmittedQuery && result.matchedFields.includes("正文") && <div className="global-search-result-match">
                      <span>{hasSubmittedQuery ? `命中：${result.matchedFields.join('、')}` : result.type === 'document' ? '文档摘要' : '笔记摘要'}</span>
                      <p><HighlightedText text={result.snippet} terms={terms} /></p>
                    </div>}
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
    </Modal>, document.body
  )
}
