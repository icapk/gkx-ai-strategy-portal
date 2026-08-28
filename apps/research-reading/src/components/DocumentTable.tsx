import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent } from 'react'
import { createPortal } from 'react-dom'
import type { ResearchDocument, WorkbenchTab } from '../types'
import { displayResearchLocation, favoriteTimeLabel, parentFolderLabel } from '../workbenchDocuments'

interface DocumentTableProps {
  documents: ResearchDocument[]
  mode: 'workbench' | 'space' | 'recycle'
  workbenchTab?: WorkbenchTab
  page: number
  onPageChange: (page: number) => void
  onToggleFavorite: (id: number) => void
  onDelete: (id: number) => void
  onShare: (id: number) => void
  onRemoveRecent?: (id: number) => void
  onRestore?: (id: number) => void
  onRename?: (id: number, title: string) => boolean | void
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
  const pageSizeTriggerRef = useRef<HTMLButtonElement>(null)
  const pageSizeOptionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const pageSizes = [10, 20, 50] as const
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const firstPage = Math.max(1, Math.min(page - 2, totalPages - 4))
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, index) => firstPage + index)

  const closePageSize = (restoreFocus = false) => {
    setPageSizeOpen(false)
    if (restoreFocus) window.requestAnimationFrame(() => pageSizeTriggerRef.current?.focus())
  }

  const focusPageSizeOption = (index: number) => {
    window.requestAnimationFrame(() => pageSizeOptionRefs.current[index]?.focus())
  }

  const openPageSize = (index = pageSizes.indexOf(pageSize)) => {
    setPageSizeOpen(true)
    focusPageSizeOption(Math.max(0, index))
  }

  useEffect(() => {
    if (!pageSizeOpen) return
    const closeFromOutside = (event: PointerEvent) => {
      if (!pageSizeRef.current?.contains(event.target as Node)) closePageSize()
    }
    const closeFromViewportChange = () => closePageSize()
    document.addEventListener('pointerdown', closeFromOutside, true)
    window.addEventListener('resize', closeFromViewportChange)
    window.addEventListener('scroll', closeFromViewportChange, true)
    return () => {
      document.removeEventListener('pointerdown', closeFromOutside, true)
      window.removeEventListener('resize', closeFromViewportChange)
      window.removeEventListener('scroll', closeFromViewportChange, true)
    }
  }, [pageSizeOpen])

  const handlePageSizeTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const selectedIndex = Math.max(0, pageSizes.indexOf(pageSize))
    if (event.key === 'Home') openPageSize(0)
    else if (event.key === 'End') openPageSize(pageSizes.length - 1)
    else if (event.key === 'ArrowDown') openPageSize((selectedIndex + 1) % pageSizes.length)
    else openPageSize((selectedIndex - 1 + pageSizes.length) % pageSizes.length)
  }

  const handlePageSizeListKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const activeIndex = pageSizeOptionRefs.current.findIndex((option) => option === document.activeElement)
    if (event.key === 'Escape' || event.key === 'Tab') {
      event.preventDefault()
      closePageSize(true)
      return
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    if (event.key === 'Home') focusPageSizeOption(0)
    else if (event.key === 'End') focusPageSizeOption(pageSizes.length - 1)
    else if (event.key === 'ArrowDown') focusPageSizeOption((activeIndex + 1 + pageSizes.length) % pageSizes.length)
    else focusPageSizeOption((activeIndex - 1 + pageSizes.length) % pageSizes.length)
  }

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
        <button
          ref={pageSizeTriggerRef}
          type="button"
          className={`page-size-trigger${pageSizeOpen ? ' is-open' : ''}`}
          aria-haspopup="listbox"
          aria-controls="document-page-size-list"
          aria-expanded={pageSizeOpen}
          onKeyDown={handlePageSizeTriggerKeyDown}
          onClick={() => {
            if (pageSizeOpen) closePageSize()
            else openPageSize()
          }}
        ><span>{pageSize}条/页</span><span className="page-size-chevron" aria-hidden="true" /></button>
        {pageSizeOpen && <div id="document-page-size-list" className="page-size-menu" role="listbox" aria-label="每页显示数量" onKeyDown={handlePageSizeListKeyDown}>{pageSizes.map((size, index) => <button ref={(option) => { pageSizeOptionRefs.current[index] = option }} type="button" role="option" aria-selected={pageSize === size} tabIndex={-1} className={pageSize === size ? 'is-active' : ''} key={size} onClick={() => { onPageSizeChange(size); closePageSize(true) }}>{size}条/页</button>)}</div>}
      </div>
    </div>
  )
}

const emptyCopy = (mode: DocumentTableProps['mode'], workbenchTab: WorkbenchTab) => {
  if (mode === 'recycle') return { title: '暂无存档内容', detail: '删除的内容会暂存在这里，并可在保留期内恢复。' }
  if (mode === 'space') return { title: '暂无文档', detail: '可以新建或导入内容，文档会按当前空间归档。' }
  if (workbenchTab === 'recent') return { title: '暂无最近浏览', detail: '打开文档后，最近访问记录会自动出现在这里。' }
  if (workbenchTab === 'favorites') return { title: '暂无收藏', detail: '收藏感兴趣的文档，之后可以从这里快速找到。' }
  if (workbenchTab === 'owned') return { title: '暂无归我所有的文档', detail: '新建内容后，会自动归入“归我所有”。' }
  return { title: '暂无共享文档', detail: '团队成员共享给你的内容会显示在这里。' }
}

const openActionLabel = (documentItem: ResearchDocument) => {
  if (documentItem.kind === '在线文档') return `编辑“${documentItem.title}”`
  if (documentItem.kind === '数据表格') return `打开表格“${documentItem.title}”`
  return `预览“${documentItem.title}”`
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
  onRemoveRecent,
  onRestore,
  onRename,
  onCreateNote,
  onOpenDocument,
  highlightedDocumentId = null,
}: DocumentTableProps) {
  const [spaceMenuId, setSpaceMenuId] = useState<number | null>(null)
  const [pageSize, setPageSize] = useState<10 | 20 | 50>(20)
  const [recentVisibleCount, setRecentVisibleCount] = useState(20)
  const [spaceMenuPosition, setSpaceMenuPosition] = useState({ top: 0, left: 0 })
  const [renamingDocumentId, setRenamingDocumentId] = useState<number | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [renameError, setRenameError] = useState('')
  const spaceMenuRef = useRef<HTMLDivElement>(null)
  const spaceMenuTriggerRefs = useRef(new Map<number, HTMLButtonElement>())
  const renameInputRef = useRef<HTMLInputElement>(null)
  const tableRegionRef = useRef<HTMLDivElement>(null)
  const isWorkbench = mode === 'workbench'
  const isRecent = isWorkbench && workbenchTab === 'recent'
  const isFavorites = isWorkbench && workbenchTab === 'favorites'
  const isRecycle = mode === 'recycle'
  const tableProfile = isRecent
    ? 'recent'
    : isFavorites
      ? 'favorites'
      : mode === 'space'
        ? 'space'
        : isRecycle
          ? 'recycle'
          : 'workbench'
  const columnCount = isRecent ? 6 : isFavorites ? 5 : mode === 'space' ? 8 : isRecycle ? 5 : 8
  const totalPages = Math.max(1, Math.ceil(documents.length / pageSize))
  const visibleDocuments = isRecent
    ? documents.slice(0, recentVisibleCount)
    : documents.slice((page - 1) * pageSize, page * pageSize)
  const emptyState = emptyCopy(mode, workbenchTab)

  useEffect(() => {
    if (!isRecent && page > totalPages) onPageChange(totalPages)
  }, [isRecent, onPageChange, page, totalPages])

  useEffect(() => {
    setRecentVisibleCount(20)
  }, [workbenchTab])

  useEffect(() => {
    if (spaceMenuId == null) return
    const trigger = spaceMenuTriggerRefs.current.get(spaceMenuId)
    const closeFromOutside = (event: PointerEvent) => {
      const target = event.target as Node
      if (spaceMenuRef.current?.contains(target) || trigger?.contains(target)) return
      setSpaceMenuId(null)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setSpaceMenuId(null)
        window.requestAnimationFrame(() => trigger?.focus())
      }
    }
    const closeFromViewportChange = () => setSpaceMenuId(null)
    const focusTimer = window.setTimeout(() => spaceMenuRef.current?.querySelector<HTMLButtonElement>('button')?.focus(), 0)
    document.addEventListener('pointerdown', closeFromOutside, true)
    document.addEventListener('keydown', closeOnEscape)
    window.addEventListener('resize', closeFromViewportChange)
    window.addEventListener('scroll', closeFromViewportChange, true)
    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('pointerdown', closeFromOutside, true)
      document.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('resize', closeFromViewportChange)
      window.removeEventListener('scroll', closeFromViewportChange, true)
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
    const menuHeight = menuDocument && onOpenDocument ? 266 : 224
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
    setRenameError('')
    setSpaceMenuId(null)
  }

  const restoreSpaceMenuTrigger = (documentId: number) => {
    const trigger = spaceMenuTriggerRefs.current.get(documentId)
    if (trigger?.isConnected) trigger.focus()
  }

  const runSpaceMenuAction = (documentId: number, action: () => void) => {
    setSpaceMenuId(null)
    restoreSpaceMenuTrigger(documentId)
    action()
  }

  const finishRename = (documentItem: ResearchDocument) => {
    const nextTitle = renameValue.trim()
    if (!nextTitle) {
      setRenameError('请输入文档名称')
      window.requestAnimationFrame(() => renameInputRef.current?.focus())
      return
    }
    if (nextTitle !== documentItem.title && onRename?.(documentItem.id, nextTitle) === false) {
      setRenameError('名称未保存，请根据提示修改后重试')
      window.requestAnimationFrame(() => renameInputRef.current?.focus())
      return
    }
    setRenamingDocumentId(null)
    setRenameValue('')
    setRenameError('')
    window.requestAnimationFrame(() => spaceMenuTriggerRefs.current.get(documentItem.id)?.focus())
  }

  const cancelRename = (documentId: number) => {
    setRenamingDocumentId(null)
    setRenameValue('')
    setRenameError('')
    window.requestAnimationFrame(() => spaceMenuTriggerRefs.current.get(documentId)?.focus())
  }

  const navigateMenu = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not([disabled])'))
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (event.key === 'Tab') {
      event.preventDefault()
      const documentId = spaceMenuId
      setSpaceMenuId(null)
      if (documentId != null) window.requestAnimationFrame(() => restoreSpaceMenuTrigger(documentId))
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      buttons[(index + direction + buttons.length) % buttons.length]?.focus()
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      buttons[event.key === 'Home' ? 0 : buttons.length - 1]?.focus()
    }
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

  const renderTitle = (documentItem: ResearchDocument) => {
    if (renamingDocumentId === documentItem.id) {
      return <form className="document-title-rename-form" onSubmit={(event) => { event.preventDefault(); finishRename(documentItem) }}>
        <input
          ref={renameInputRef}
          className="document-title-rename"
          value={renameValue}
          autoFocus
          maxLength={50}
          aria-label="文档新名称"
          aria-invalid={Boolean(renameError)}
          aria-describedby={renameError ? `document-rename-error-${documentItem.id}` : undefined}
          onChange={(event) => { setRenameValue(event.target.value); if (renameError) setRenameError('') }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              cancelRename(documentItem.id)
            }
          }}
        />
        <button type="submit">保存</button>
        <button type="button" onClick={() => cancelRename(documentItem.id)}>取消</button>
        {renameError && <span className="sr-only" id={`document-rename-error-${documentItem.id}`} role="alert">{renameError}</span>}
      </form>
    }
    if (!isRecycle && onOpenDocument) {
      return (
        <button
          className={`document-title-link${documentItem.kind === '数据表格' ? ' document-title-link--sheet' : ''}`}
          type="button"
          onClick={() => onOpenDocument(documentItem)}
          aria-label={openActionLabel(documentItem)}
        >
          {documentItem.kind === '数据表格' && <img className="document-title-sheet-icon" src="/assets/document-sheet.svg" alt="" width="18" height="18" />}
          {documentItem.title}
        </button>
      )
    }
    return documentItem.title
  }

  const renderHeader = () => {
    if (isRecent) return <><th>标题</th><th>大小</th><th>最后打开</th><th>所属父文件夹</th><th>类型</th><th>操作</th></>
    if (isFavorites) return <><th>标题</th><th>收藏时间</th><th>类型</th><th>大小</th><th>操作</th></>
    if (mode === 'space') return <><th>名称</th><th>类型</th><th>大小</th><th>最后修改</th><th>所属父文件夹</th><th>创建者</th><th>创建时间</th><th>操作</th></>
    if (isRecycle) return <><th>标题</th><th>所有者</th><th>删除时间</th><th>类型</th><th>操作</th></>
    return <><th>标题</th><th>所属父文件夹</th><th>所有者</th><th>大小</th><th>创建时间</th><th>最近访问</th><th>类型</th><th>操作</th></>
  }

  const renderActions = (documentItem: ResearchDocument) => {
    if (isRecycle) {
      return <><button type="button" onClick={() => onRestore?.(documentItem.id)}>恢复</button><button className="danger-link" type="button" onClick={() => onDelete(documentItem.id)}>彻底删除</button></>
    }
    if (isRecent) {
      return <><button type="button" onClick={() => onToggleFavorite(documentItem.id)}>{documentItem.favorite ? '取消收藏' : '收藏'}</button><button type="button" onClick={() => onRemoveRecent?.(documentItem.id)}>从列表移除</button></>
    }
    if (isFavorites) {
      return <button type="button" onClick={() => onToggleFavorite(documentItem.id)}>取消收藏</button>
    }
    if (isWorkbench) {
      return <><button type="button" onClick={() => onShare(documentItem.id)}>共享到团队</button><button className="danger-link" type="button" onClick={() => onDelete(documentItem.id)}>删除</button></>
    }
    return (
      <>
        <button type="button" onClick={() => onShare(documentItem.id)}>分享</button>
        <span className="document-space-menu-wrap">
          <button className="more-button" type="button" ref={(node) => { if (node) spaceMenuTriggerRefs.current.set(documentItem.id, node); else spaceMenuTriggerRefs.current.delete(documentItem.id) }} aria-label={`${documentItem.title}更多操作`} aria-haspopup="menu" aria-expanded={spaceMenuId === documentItem.id} onClick={(event) => openSpaceMenu(event, documentItem.id)}><span className="more-dots" aria-hidden="true"><i /><i /><i /></span></button>
        </span>
      </>
    )
  }

  const renderRow = (documentItem: ResearchDocument) => {
    const titleCell = <td className="title-cell">{renderTitle(documentItem)}</td>
    const actionCell = <td><span className="row-actions">{renderActions(documentItem)}</span></td>
    if (isRecent) return <>{titleCell}<td>{documentItem.size}</td><td>{documentItem.visitedAt}</td><td title={displayResearchLocation(documentItem.location)}>{parentFolderLabel(documentItem.location)}</td><td><KindTag kind={documentItem.kind} /></td>{actionCell}</>
    if (isFavorites) return <>{titleCell}<td>{favoriteTimeLabel(documentItem)}</td><td><KindTag kind={documentItem.kind} /></td><td>{documentItem.size}</td>{actionCell}</>
    if (mode === 'space') return <>{titleCell}<td><KindTag kind={documentItem.kind} /></td><td>{documentItem.size}</td><td>{documentItem.updatedAt ?? documentItem.createdAt}</td><td title={displayResearchLocation(documentItem.location)}>{parentFolderLabel(documentItem.location)}</td><td><span className="owner-cell"><img src="/assets/avatar-owner.svg" alt="" />{documentItem.owner}</span></td><td>{documentItem.createdAt}</td>{actionCell}</>
    if (isRecycle) return <>{titleCell}<td><span className="owner-cell"><img src="/assets/avatar-owner.svg" alt="" />{documentItem.owner}</span></td><td>{documentItem.deletedAt ?? '时间未记录'}</td><td><KindTag kind={documentItem.kind} /></td>{actionCell}</>
    return <>{titleCell}<td title={displayResearchLocation(documentItem.location)}>{parentFolderLabel(documentItem.location)}</td><td><span className="owner-cell"><img src="/assets/avatar-owner.svg" alt="" />{documentItem.owner}</span></td><td>{documentItem.size}</td><td>{documentItem.createdAt}</td><td>{documentItem.visitedAt}</td><td><KindTag kind={documentItem.kind} /></td>{actionCell}</>
  }

  return (
    <div className={`table-region table-region--${tableProfile}`} ref={tableRegionRef}>
      <div className="table-scroll">
        <table className={`document-table document-table--${tableProfile}`} aria-label={isRecent ? '最近浏览文档' : isFavorites ? '收藏文档' : mode === 'space' ? '空间文档' : isRecycle ? '存档管理文档' : '工作台文档'}>
          <thead><tr>{renderHeader()}</tr></thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td className="empty-cell" colSpan={columnCount}>
                  <span className="empty-mark" aria-hidden="true">⌁</span>
                  <strong>{emptyState.title}</strong>
                  <span>{emptyState.detail}</span>
                </td>
              </tr>
            ) : visibleDocuments.map((documentItem) => (
              <tr
                key={documentItem.id}
                data-document-id={documentItem.id}
                className={highlightedDocumentId === documentItem.id ? 'is-search-target' : undefined}
              >
                {renderRow(documentItem)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isRecent && documents.length > 0 ? (
        <div className="recent-list-footer">
          <span role="status" aria-live="polite">已显示 {Math.min(recentVisibleCount, documents.length)} / {documents.length} 条最近浏览</span>
          {recentVisibleCount < documents.length && <button type="button" onClick={() => setRecentVisibleCount((count) => count + 20)}>加载更多</button>}
        </div>
      ) : documents.length > 0 ? (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={documents.length}
          onChange={onPageChange}
          onPageSizeChange={(size) => { setPageSize(size); onPageChange(1) }}
        />
      ) : null}
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
            onKeyDown={navigateMenu}
          >
            {onOpenDocument && <button type="button" role="menuitem" onClick={() => runSpaceMenuAction(documentItem.id, () => onOpenDocument(documentItem))}>{isNativeDocument(documentItem) ? (documentItem.kind === '数据表格' ? '打开表格' : '编辑文档') : '预览文档'}</button>}
            <button type="button" role="menuitem" onClick={() => runSpaceMenuAction(documentItem.id, () => onCreateNote?.(documentItem))}>笔记</button>
            <button type="button" role="menuitem" onClick={() => runSpaceMenuAction(documentItem.id, () => onToggleFavorite(documentItem.id))}>{documentItem.favorite ? '取消收藏' : '收藏'}</button>
            <button type="button" role="menuitem" onClick={() => runSpaceMenuAction(documentItem.id, () => downloadFallback(documentItem))}>下载</button>
            <button type="button" role="menuitem" onClick={() => beginRename(documentItem)}>重命名</button>
            <button type="button" role="menuitem" className="danger-link" onClick={() => runSpaceMenuAction(documentItem.id, () => onDelete(documentItem.id))}>删除</button>
          </div>
        )
      })(), document.body)}
    </div>
  )
}
