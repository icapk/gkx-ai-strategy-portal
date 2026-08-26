import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { createPortal } from 'react-dom'
import type { ResearchDocument, WorkbenchTab } from '../types'

interface DocumentTableProps {
  documents: ResearchDocument[]
  mode: 'workbench' | 'space' | 'recycle'
  workbenchTab?: WorkbenchTab
  page: number
  onPageChange: (page: number) => void
  onToggleFavorite: (id: number) => void
  onDelete: (id: number) => void
  onShare: (id: number) => void
  onRestore?: (id: number) => void
  onRename?: (id: number, title: string) => void
  onCreateNote?: (documentItem: ResearchDocument) => void
  onOpenDocument?: (documentItem: ResearchDocument) => void
  highlightedDocumentId?: number | null
}

function KindTag({ kind }: { kind: ResearchDocument['kind'] }) {
  const variant = kind === '在线文档' ? 'online' : kind === '数据表格' ? 'sheet' : 'file'
  return <span className={`kind-tag kind-tag--${variant}`}>{kind}</span>
}

const isNativeDocument = (documentItem: ResearchDocument) => (
  documentItem.kind === '在线文档' || documentItem.kind === '数据表格'
)

function Pagination({
  page,
  pageSize,
  totalItems,
  onChange,
  onPageSizeChange,
}: {
  page: number
  pageSize: 10 | 20 | 50
  totalItems: number
  onChange: (page: number) => void
  onPageSizeChange: (size: 10 | 20 | 50) => void
}) {
  const [pageSizeOpen, setPageSizeOpen] = useState(false)
  const pageSizeRef = useRef<HTMLDivElement>(null)
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const firstPage = Math.max(1, Math.min(page - 2, totalPages - 4))
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, index) => firstPage + index)

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!pageSizeRef.current?.contains(event.target as Node)) setPageSizeOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPageSizeOpen(false)
    }
    window.addEventListener('click', close)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('click', close)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  return (
    <div className="pagination" aria-label="分页">
      <button type="button" disabled={page === 1} onClick={() => onChange(Math.max(1, page - 1))} aria-label="上一页">
        <span className="pager-chevron pager-chevron--prev" aria-hidden="true" />
      </button>
      {pageNumbers.map((number) => (
        <button
          type="button"
          key={number}
          className={page === number ? 'is-current' : ''}
          onClick={() => onChange(number)}
          aria-current={page === number ? 'page' : undefined}
        >
          {number}
        </button>
      ))}
      <button type="button" disabled={page === totalPages} onClick={() => onChange(Math.min(totalPages, page + 1))} aria-label="下一页">
        <span className="pager-chevron" aria-hidden="true" />
      </button>
      <div className="page-size" ref={pageSizeRef}>
        <button type="button" className={`page-size-trigger${pageSizeOpen ? ' is-open' : ''}`} aria-haspopup="listbox" aria-expanded={pageSizeOpen} onClick={() => setPageSizeOpen((open) => !open)}><span>{pageSize}条/页</span><span className="page-size-chevron" aria-hidden="true" /></button>
        {pageSizeOpen && <div className="page-size-menu" role="listbox" aria-label="每页显示数量">{([10, 20, 50] as const).map((size) => <button type="button" role="option" aria-selected={pageSize === size} className={pageSize === size ? 'is-active' : ''} key={size} onClick={() => { onPageSizeChange(size); setPageSizeOpen(false) }}>{size}条/页</button>)}</div>}
      </div>
    </div>
  )
}

export function DocumentTable({
  documents,
  mode,
  workbenchTab = 'recent',
  page,
  onPageChange,
  onToggleFavorite,
  onDelete,
  onShare,
  onRestore,
  onRename,
  onCreateNote,
  onOpenDocument,
  highlightedDocumentId = null,
}: DocumentTableProps) {
  const [spaceMenuId, setSpaceMenuId] = useState<number | null>(null)
  const [pageSize, setPageSize] = useState<10 | 20 | 50>(10)
  const [spaceMenuPosition, setSpaceMenuPosition] = useState({ top: 0, left: 0 })
  const [renamingDocumentId, setRenamingDocumentId] = useState<number | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const spaceMenuRef = useRef<HTMLDivElement>(null)
  const tableRegionRef = useRef<HTMLDivElement>(null)
  const isWorkbench = mode === 'workbench'
  const isFavorites = isWorkbench && workbenchTab === 'favorites'
  const isRecycle = mode === 'recycle'
  const columnCount = 4
    + (isWorkbench ? 1 : 0)
    + (!isWorkbench && !isRecycle ? 1 : 0)
    + (isWorkbench ? 1 : 0)
    + (!isFavorites ? 1 : 0)
  const totalPages = Math.max(1, Math.ceil(documents.length / pageSize))
  const paginatedDocuments = documents.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    if (page > totalPages) onPageChange(totalPages)
  }, [onPageChange, page, totalPages])

  useEffect(() => {
    if (spaceMenuId == null) return
    const close = () => setSpaceMenuId(null)
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSpaceMenuId(null)
    }
    const focusTimer = window.setTimeout(() => spaceMenuRef.current?.querySelector<HTMLButtonElement>('button')?.focus(), 0)
    window.addEventListener('click', close)
    window.addEventListener('keydown', closeOnEscape)
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('click', close)
      window.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [spaceMenuId])

  useEffect(() => {
    if (highlightedDocumentId == null) return
    const frame = window.requestAnimationFrame(() => {
      tableRegionRef.current
        ?.querySelector<HTMLElement>(`[data-document-id="${highlightedDocumentId}"]`)
        ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [highlightedDocumentId])

  const openSpaceMenu = (event: ReactMouseEvent<HTMLButtonElement>, documentId: number) => {
    event.stopPropagation()
    if (spaceMenuId === documentId) {
      setSpaceMenuId(null)
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    const menuWidth = 96
    const menuDocument = documents.find((item) => item.id === documentId)
    const menuHeight = menuDocument && isNativeDocument(menuDocument) ? 266 : 224
    const viewportGap = 8
    const left = Math.min(window.innerWidth - menuWidth - viewportGap, Math.max(viewportGap, rect.right - menuWidth))
    const belowTop = rect.bottom + 2
    const top = belowTop + menuHeight <= window.innerHeight - viewportGap
      ? belowTop
      : Math.max(viewportGap, rect.top - menuHeight - 2)
    setSpaceMenuPosition({ top, left })
    setSpaceMenuId(documentId)
  }

  const beginRename = (documentItem: ResearchDocument) => {
    setRenamingDocumentId(documentItem.id)
    setRenameValue(documentItem.title)
    setSpaceMenuId(null)
  }

  const finishRename = (documentItem: ResearchDocument) => {
    const nextTitle = renameValue.trim()
    if (nextTitle && nextTitle !== documentItem.title) onRename?.(documentItem.id, nextTitle)
    setRenamingDocumentId(null)
    setRenameValue('')
  }

  const downloadFallback = (documentItem: ResearchDocument) => {
    const body = `${documentItem.title}\n\n${documentItem.content?.trim() || '暂无正文内容'}\n\n所有者：${documentItem.owner}\n类型：${documentItem.kind}`
    const url = URL.createObjectURL(new Blob([body], { type: 'text/plain;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${documentItem.title}.txt`
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  return (
    <div className="table-region" ref={tableRegionRef}>
      <div className="table-scroll">
        <table className="document-table">
          <thead>
            <tr>
              <th>标题</th>
              {isWorkbench && <th>位置</th>}
              <th>所有者</th>
              {!isWorkbench && !isRecycle && <th>大小</th>}
              {isWorkbench && !isFavorites && <th>创建时间</th>}
              {isFavorites && <th>收藏时间</th>}
              {!isFavorites && <th>{isRecycle ? '删除时间' : '最近访问'}</th>}
              <th>文档属性</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td className="empty-cell" colSpan={columnCount}>
                  <span className="empty-mark">⌁</span>
                  暂无文档
                </td>
              </tr>
            ) : (
              paginatedDocuments.map((doc) => (
                <tr
                  key={doc.id}
                  data-document-id={doc.id}
                  className={highlightedDocumentId === doc.id ? 'is-search-target' : undefined}
                >
                  <td className="title-cell">
                    {renamingDocumentId === doc.id ? (
                      <input
                        className="document-title-rename"
                        value={renameValue}
                        autoFocus
                        maxLength={50}
                        aria-label="文档新名称"
                        onChange={(event) => setRenameValue(event.target.value)}
                        onBlur={() => finishRename(doc)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') finishRename(doc)
                          if (event.key === 'Escape') {
                            setRenamingDocumentId(null)
                            setRenameValue('')
                          }
                        }}
                      />
                    ) : isNativeDocument(doc) && !isRecycle && onOpenDocument ? (
                      <button
                        className={`document-title-link${doc.kind === '数据表格' ? ' document-title-link--sheet' : ''}`}
                        type="button"
                        onClick={() => onOpenDocument(doc)}
                        aria-label={`${doc.kind === '数据表格' ? '打开表格' : '编辑'}“${doc.title}”`}
                      >
                        {doc.kind === '数据表格' && <img className="document-title-sheet-icon" src="/assets/document-sheet.svg" alt="" width="18" height="18" />}
                        {doc.title}
                      </button>
                    ) : doc.title}
                  </td>
                  {isWorkbench && <td>{doc.location}</td>}
                  <td>
                    <span className="owner-cell">
                      <img src="/assets/avatar-owner.svg" alt="" />
                      {doc.owner}
                    </span>
                  </td>
                  {!isWorkbench && !isRecycle && <td>{doc.size}</td>}
                  {isWorkbench && !isFavorites && <td>{doc.createdAt}</td>}
                  {isFavorites && <td>{doc.createdAt}</td>}
                  {!isFavorites && <td>{doc.visitedAt}</td>}
                  <td><KindTag kind={doc.kind} /></td>
                  <td>
                    <span className="row-actions">
                      {isRecycle ? (
                        <>
                          <button type="button" onClick={() => onRestore?.(doc.id)}>恢复</button>
                          <button className="danger-link" type="button" onClick={() => onDelete(doc.id)}>彻底删除</button>
                        </>
                      ) : isWorkbench ? (
                        <>
                          {workbenchTab === 'owned' || workbenchTab === 'shared' ? (
                            <button type="button" onClick={() => onShare(doc.id)}>共享到团队</button>
                          ) : (
                            <button type="button" onClick={() => onToggleFavorite(doc.id)}>
                              {workbenchTab === 'favorites' || doc.favorite ? '取消收藏' : '收藏'}
                            </button>
                          )}
                          <button className="danger-link" type="button" onClick={() => onDelete(doc.id)}>
                            {workbenchTab === 'recent' && doc.id !== 1 ? '从列表移除' : '删除'}
                          </button>
                        </>
                      ) : (
                        <>
                          <button type="button" onClick={() => onShare(doc.id)}>分享</button>
                          <span className="document-space-menu-wrap">
                            <button className="more-button" type="button" aria-label={`${doc.title}更多操作`} aria-haspopup="menu" aria-expanded={spaceMenuId === doc.id} onClick={(event) => openSpaceMenu(event, doc.id)}><span className="more-dots" aria-hidden="true"><i /><i /><i /></span></button>
                          </span>
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={documents.length}
        onChange={onPageChange}
        onPageSizeChange={(size) => { setPageSize(size); onPageChange(1) }}
      />
      {spaceMenuId != null && typeof document !== 'undefined' && createPortal((() => {
        const documentItem = documents.find((item) => item.id === spaceMenuId)
        if (!documentItem) return null
        return (
          <div
            className="document-space-menu"
            ref={spaceMenuRef}
            role="menu"
            aria-label={`${documentItem.title}更多操作`}
            style={{ top: spaceMenuPosition.top, left: spaceMenuPosition.left }}
            onClick={(event) => event.stopPropagation()}
          >
            {isNativeDocument(documentItem) && <button type="button" role="menuitem" onClick={() => { onOpenDocument?.(documentItem); setSpaceMenuId(null) }}>{documentItem.kind === '数据表格' ? '打开表格' : '编辑文档'}</button>}
            <button type="button" role="menuitem" onClick={() => { onCreateNote?.(documentItem); setSpaceMenuId(null) }}>笔记</button>
            <button type="button" role="menuitem" onClick={() => { onToggleFavorite(documentItem.id); setSpaceMenuId(null) }}>{documentItem.favorite ? '取消收藏' : '收藏'}</button>
            <button type="button" role="menuitem" onClick={() => { downloadFallback(documentItem); setSpaceMenuId(null) }}>下载</button>
            <button type="button" role="menuitem" onClick={() => beginRename(documentItem)}>重命名</button>
            <button type="button" role="menuitem" className="danger-link" onClick={() => { onDelete(documentItem.id); setSpaceMenuId(null) }}>删除</button>
          </div>
        )
      })(), document.body)}
    </div>
  )
}
