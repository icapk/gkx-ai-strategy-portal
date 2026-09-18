import DOMPurify from 'dompurify'
import { loadResearchDataTables, exportResearchDataTableCsv } from '../dataTableContent'
import { useEffect, useRef, useState, type ReactNode, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { retentionLabel } from '../researchPolicy'
import { DocumentLanguageSelect } from './DocumentLanguage'
import type { ResearchDocument, WorkbenchTab } from '../types'
import { displayResearchLocation, favoriteTimeLabel } from '../workbenchDocuments'
import { compareResearchDocuments, minute } from '../researchSort'

export type FolderTableEntry = { item: ResearchDocument; key: string; onOpen: () => void; actions: ReactNode; title?: ReactNode }
interface DocumentTableProps {
  onLanguageChange?: (id:number, language:'zh'|'en')=>void
  folderEntries?: FolderTableEntry[]
  quickAccess?: string[]
  onToggleQuickAccess?: (key: string) => void
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
  onDownloadDocument?: (documentItem: ResearchDocument) => void
  highlightedDocumentId?: number | null
}

function sizeInMegabytes(item: ResearchDocument) {
  if (item.pdfArchive) return `${(item.pdfArchive.byteSize / 1024 ** 2).toFixed(2)} M`
  const match = item.size.trim().match(/^([\d.]+)\s*(B|K|KB|M|MB|G|GB)$/i)
  if (!match) return '—'
  const unit = match[2].toUpperCase()
  const value = Number(match[1]) * (unit.startsWith('G') ? 1024 : unit.startsWith('M') ? 1 : unit.startsWith('K') ? 1 / 1024 : 1 / 1024 ** 2)
  return `${value > 0 && value < 0.01 ? '<0.01' : value.toFixed(2)} M`
}

function FileIcon({ kind }: { kind: ResearchDocument['kind'] }) {
  const labels: Record<ResearchDocument['kind'], string> = { 'Word文档': 'Word', 'Excel文档': 'Excel', 'PDF文档': 'pdf', '在线文档': '在线文档', '数据表格': '在线表格', '附件': '附件' }
  const fileIcon = kind === 'Word文档' ? '/assets/document-word.svg' : kind === 'Excel文档' ? '/assets/document-sheet.svg' : kind === 'PDF文档' ? '/assets/action-pdf.svg' : null
  return <span className="file-title-icon">{fileIcon ? <img src={fileIcon} width="16" height="16" alt="" /> : <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke={kind === '数据表格' ? '#21854a' : kind === '在线文档' ? '#3475ce' : '#718096'} strokeWidth="1.4" aria-hidden="true"><path d="M4 2h8l4 4v12H4zM12 2v4h4" />{kind === '数据表格' ? <path d="M6 9h8v6H6zM6 12h8M10 9v6" /> : <path d="M7 9h6M7 12h6M7 15h4" />}</svg>}</span>
}

function KindTag({ kind }: { kind: ResearchDocument['kind'] }) {
  const labels: Record<ResearchDocument['kind'], string> = { 'Word文档': 'Word', 'Excel文档': 'Excel', 'PDF文档': 'pdf', '在线文档': '在线文档', '数据表格': '在线表格', '附件': '附件' }
  return <span>{labels[kind]}</span>
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
  if (mode === 'recycle') return { title: '回收站为空', detail: '删除的内容会暂存在这里，并可在保留期内恢复。' }
  if (mode === 'space') return { title: '暂无文档', detail: '可以新建或导入内容，文档会按当前空间归档。' }
  if (workbenchTab === 'quick') return { title: '暂无快速访问文档', detail: '在文档或文件夹的操作栏中选择“加入快速访问”。' }
  if (workbenchTab === 'recent') return { title: '暂无最近浏览', detail: '打开文档后，最近访问记录会自动出现在这里。' }
  if (workbenchTab === 'favorites') return { title: '暂无收藏', detail: '收藏感兴趣的文档，之后可以从这里快速找到。' }
  if (workbenchTab === 'owned') return { title: '暂无归我所有的文档', detail: '新建内容后，会自动归入“归我所有”。' }
  return { title: '暂无分享文档', detail: '团队成员分享给你的内容会显示在这里。' }
}

const openActionLabel = (documentItem: ResearchDocument) => {
  if (documentItem.kind === '在线文档') return `编辑“${documentItem.title}”`
  if (documentItem.kind === '数据表格') return `打开表格“${documentItem.title}”`
  if (documentItem.pdfArchive) return `阅读与笔记“${documentItem.title}”`
  return `预览“${documentItem.title}”`
}

export function DocumentTable({
  onLanguageChange,
  folderEntries = [],
  quickAccess = [], onToggleQuickAccess,
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
  onDownloadDocument,
  highlightedDocumentId = null,
}: DocumentTableProps) {
  const [spaceMenuId, setSpaceMenuId] = useState<number | null>(null)
  const [pageSize, setPageSize] = useState<10 | 20 | 50>(20)
  const [sort, setSort] = useState<{ key: 'createdAt' | 'visitedAt'; direction: 'asc' | 'desc' }>({ key: 'visitedAt', direction: 'desc' })
  const allItems = [...folderEntries.map((entry) => entry.item), ...documents]
  const sortedDocuments = [...allItems].sort((a, b) => compareResearchDocuments(a, b, mode === 'recycle' ? 'deletedAt' : workbenchTab === 'favorites' && mode === 'workbench' ? 'favoritedAt' : sort.key, mode === 'recycle' || workbenchTab === 'favorites' ? 'desc' : sort.direction))
  const sortHeader = (key: 'createdAt' | 'visitedAt', label: string) => <th aria-sort={sort.key === key ? (sort.direction === 'desc' ? 'descending' : 'ascending') : 'none'}><button type="button" className="document-sort" onClick={() => { setSort({ key, direction: sort.key === key && sort.direction === 'desc' ? 'asc' : 'desc' }); onPageChange(1) }}>{label} {sort.key === key ? (sort.direction === 'desc' ? '↓' : '↑') : '↕'}</button></th>
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
  const columnCount = isRecent ? 8 : isFavorites ? 5 : mode === 'space' ? 8 : isRecycle ? 6 : 8
  const totalPages = Math.max(1, Math.ceil(allItems.length / pageSize))
  const visibleDocuments = sortedDocuments.slice((page - 1) * pageSize, page * pageSize)
  const emptyState = emptyCopy(mode, workbenchTab)

  useEffect(() => {
    if (page > totalPages) onPageChange(totalPages)
  }, [isRecent, onPageChange, page, totalPages])


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
    const focusTimer = window.setTimeout(() => spaceMenuRef.current?.querySelector<HTMLButtonElement>('button')?.focus({preventScroll:true}), 0)
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
    const menuWidth = 160
    const menuDocument = documents.find((item) => item.id === documentId)
    const menuHeight = menuDocument && onOpenDocument ? 310 : 268
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
    if (!isNativeDocument(documentItem)) { window.alert('没有可下载的原始文件，请重新上传。'); return }
    const table = documentItem.kind === '数据表格' ? loadResearchDataTables().find(item => item.documentId === documentItem.id) : undefined
    const textNode = document.createElement('p'); textNode.textContent = documentItem.content ?? ''
    const body = table ? exportResearchDataTableCsv(table) : `<!doctype html><meta charset="utf-8"><article>${DOMPurify.sanitize(documentItem.richHtml || textNode.outerHTML)}</article>`
    const url = URL.createObjectURL(new Blob([body], { type: table ? 'text/csv;charset=utf-8' : 'text/html;charset=utf-8' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${documentItem.title}.${table ? 'csv' : 'html'}`
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
          <FileIcon kind={documentItem.kind} />
          {documentItem.title}
          {Boolean(documentItem.pdfArchive?.annotationCount) && <span className="pdf-note-indicator" title="此 PDF 带有标注的笔记可供查看" aria-label="此 PDF 带有标注的笔记可供查看">▤</span>}
        </button>
      )
    }
    return <><FileIcon kind={documentItem.kind} />{documentItem.title}</>
  }

  const renderHeader = () => {

    if (isFavorites) return <><th>标题</th><th>所有者</th><th>收藏时间</th><th>类型</th><th>文档大小</th><th>操作</th></>
    if (mode === 'space') return <><th>名称</th><th>类型</th><th>文档大小</th><th>最后修改</th><th>位置 <span className="location-header-info" tabIndex={0} aria-label="可查看所属父文件夹">i<span className="location-header-tooltip" role="tooltip">可查看所属父文件夹</span></span></th><th>创建者</th>{sortHeader('createdAt', '创建时间')}<th>操作</th></>
    if (isRecycle) return <><th>标题</th><th>所有者</th><th>删除时间</th><th>类型</th><th>原位置</th><th>操作</th></>
    return <><th>标题</th><th>位置 <span className="location-header-info" tabIndex={0} aria-label="可查看所属父文件夹">i<span className="location-header-tooltip" role="tooltip">可查看所属父文件夹</span></span></th><th>所有者</th><th>文档大小</th>{sortHeader('createdAt', '创建时间')}{sortHeader('visitedAt', '最近浏览')}<th>类型</th><th>操作</th></>
  }

  const renderActions = (documentItem: ResearchDocument) => {
    if (isRecycle) {
      return <><button type="button" onClick={() => onRestore?.(documentItem.id)}>恢复</button><button className="danger-link" type="button" onClick={() => onDelete(documentItem.id)}>彻底删除</button></>
    }
    return (
      <>
        {isRecent && onRemoveRecent ? <button type="button" onClick={() => onRemoveRecent(documentItem.id)}>移除</button> : isWorkbench && workbenchTab === 'quick' ? <button type="button" onClick={() => onToggleQuickAccess?.(`document:${documentItem.id}`)}>取消快速访问</button> : isFavorites ? <button data-focus-id="research-favorite" type="button" onClick={() => onToggleFavorite(documentItem.id)}>取消收藏</button> : <button type="button" onClick={() => onShare(documentItem.id)}>分享</button>}
        <span className="document-space-menu-wrap">
          <button data-focus-reveal="research-document-menu" className="more-button" type="button" ref={(node) => { if (node) spaceMenuTriggerRefs.current.set(documentItem.id, node); else spaceMenuTriggerRefs.current.delete(documentItem.id) }} aria-label={`${documentItem.title}更多操作`} aria-haspopup="menu" aria-expanded={spaceMenuId === documentItem.id} onClick={(event) => openSpaceMenu(event, documentItem.id)}><span className="more-dots" aria-hidden="true"><i /><i /><i /></span></button>
        </span>
      </>
    )
  }

  const renderRow = (documentItem: ResearchDocument) => {
    const folder = folderEntries.find((entry) => entry.item.id === documentItem.id)
    if (folder) {
      const title = <td className="title-cell">{folder.title ?? <button type="button" className="document-title-link" onClick={folder.onOpen}>📁 {documentItem.title}</button>}</td>
      const actions = <td><span className="row-actions">{folder.actions}</span></td>
      if(isRecycle)return <>{title}<td>{documentItem.owner}</td><td>{documentItem.deletedAt}<small className="retention-label">{retentionLabel(documentItem)}</small></td><td>文件夹</td><td title={displayResearchLocation(documentItem.location)}>{displayResearchLocation(documentItem.location)}</td>{actions}</>
      if (isFavorites) return <>{title}<td>{documentItem.owner}</td><td>—</td><td>文件夹</td><td>{sizeInMegabytes(documentItem)}</td>{actions}</>
      if (mode === 'space') return <>{title}<td>文件夹</td><td>{sizeInMegabytes(documentItem)}</td><td>{documentItem.updatedAt}</td><td>{displayResearchLocation(documentItem.location)}</td><td><span className="owner-cell"><img src="/assets/avatar-owner.svg" alt="" />{documentItem.owner}</span></td><td>{minute(documentItem.createdAt)||'—'}</td>{actions}</>
      return <>{title}<td>{displayResearchLocation(documentItem.location)}</td><td><span className="owner-cell"><img src="/assets/avatar-owner.svg" alt="" />{documentItem.owner}</span></td><td>{sizeInMegabytes(documentItem)}</td><td>{minute(documentItem.createdAt)||'—'}</td><td>—</td><td>文件夹</td>{actions}</>
    }
    const titleCell = <td className="title-cell">{renderTitle(documentItem)}</td>
    const actionCell = <td><span className="row-actions">{renderActions(documentItem)}</span></td>

    if (isFavorites) return <>{titleCell}<td>{documentItem.owner}</td><td>{favoriteTimeLabel(documentItem)}</td><td><KindTag kind={documentItem.kind} /></td><td>{sizeInMegabytes(documentItem)}</td>{actionCell}</>
    if (mode === 'space') return <>{titleCell}<td><KindTag kind={documentItem.kind} /></td><td>{sizeInMegabytes(documentItem)}</td><td>{documentItem.updatedAt ?? documentItem.createdAt}</td><td title={displayResearchLocation(documentItem.location)}>{displayResearchLocation(documentItem.location)}</td><td><span className="owner-cell"><img src="/assets/avatar-owner.svg" alt="" />{documentItem.owner}</span></td><td>{minute(documentItem.createdAt)||'—'}</td>{actionCell}</>
    if (isRecycle) return <>{titleCell}<td><span className="owner-cell"><img src="/assets/avatar-owner.svg" alt="" />{documentItem.owner}</span></td><td>{documentItem.deletedAt ?? '时间未记录'}<small className="retention-label">{retentionLabel(documentItem)}</small></td><td><KindTag kind={documentItem.kind} /></td><td title={displayResearchLocation(documentItem.location)}>{displayResearchLocation(documentItem.location)}</td>{actionCell}</>
    return <>{titleCell}<td title={displayResearchLocation(documentItem.location)}>{displayResearchLocation(documentItem.location)}</td><td><span className="owner-cell"><img src="/assets/avatar-owner.svg" alt="" />{documentItem.owner}</span></td><td>{sizeInMegabytes(documentItem)}</td><td>{minute(documentItem.createdAt)||'—'}</td><td>{minute(documentItem.visitedAt)||'—'}</td><td><KindTag kind={documentItem.kind} /></td>{actionCell}</>
  }

  return (
    <div className={`table-region table-region--${tableProfile}`} ref={tableRegionRef}>
      <div className="table-scroll">
        <table className={`document-table document-table--${tableProfile}`} aria-label={isRecent ? '最近浏览文档' : isFavorites ? '收藏文档' : mode === 'space' ? '空间文档' : isRecycle ? '回收站内容' : '工作台文档'}>
          <thead><tr>{renderHeader()}<th>语言</th></tr></thead>
          <tbody>
            {allItems.length === 0 ? (
              <tr>
                <td className="empty-cell" colSpan={columnCount+1+(isFavorites?1:0)}>
                  <span className="empty-mark" aria-hidden="true">⌁</span>
                  <strong>{emptyState.title}</strong>
                  <span>{emptyState.detail}</span>
                </td>
              </tr>
            ) : visibleDocuments.map((documentItem) => (
              <tr
                key={documentItem.id}
                data-document-id={documentItem.id}
                data-document-kind={folderEntries.some(entry => entry.item.id === documentItem.id) ? "文件夹" : documentItem.kind}
                className={highlightedDocumentId === documentItem.id ? 'is-search-target' : undefined}
              >
                {renderRow(documentItem)}<td>{documentItem.kind==='PDF文档'&&!folderEntries.some(f=>f.item.id===documentItem.id)?<DocumentLanguageSelect label={documentItem.title+'语言'} value={documentItem.language} disabled={!onLanguageChange||isRecycle} onChange={language=>onLanguageChange?.(documentItem.id,language)}/>: '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {allItems.length > 0 ? (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={allItems.length}
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
            {onOpenDocument && <button type="button" role="menuitem" onClick={() => runSpaceMenuAction(documentItem.id, () => onOpenDocument(documentItem))}>{documentItem.pdfArchive ? '阅读与笔记' : isNativeDocument(documentItem) ? (documentItem.kind === '数据表格' ? '打开表格' : '编辑文档') : '预览文档'}</button>}
            {onCreateNote && documentItem.pdfArchive && <button type="button" role="menuitem" onClick={() => runSpaceMenuAction(documentItem.id, () => onCreateNote(documentItem))}>笔记</button>}
            {onToggleQuickAccess && (workbenchTab === 'quick' || !quickAccess.includes(`document:${documentItem.id}`)) && <button type="button" role="menuitem" onClick={() => runSpaceMenuAction(documentItem.id, () => onToggleQuickAccess(`document:${documentItem.id}`))}>{quickAccess.includes(`document:${documentItem.id}`) ? '取消快速访问' : '加入快速访问'}</button>}
            {!isFavorites && <button data-focus-id="research-favorite" type="button" role="menuitem" onClick={() => runSpaceMenuAction(documentItem.id, () => onToggleFavorite(documentItem.id))}>{documentItem.favorite ? '取消收藏' : '收藏'}</button>}
            {isWorkbench && <button type="button" role="menuitem" onClick={() => runSpaceMenuAction(documentItem.id, () => onShare(documentItem.id))}>分享</button>}
            <button type="button" role="menuitem" onClick={() => runSpaceMenuAction(documentItem.id, () => {
              if ((documentItem.pdfArchive || documentItem.originalFileName) && onDownloadDocument) onDownloadDocument(documentItem)
              else downloadFallback(documentItem)
            })}>{documentItem.pdfArchive ? '下载 PDF' : '下载'}</button>
            {onRename && <button type="button" role="menuitem" onClick={() => beginRename(documentItem)}>重命名</button>}
            <button type="button" role="menuitem" className="danger-link" onClick={() => runSpaceMenuAction(documentItem.id, () => onDelete(documentItem.id))}>删除</button>
          </div>
        )
      })(), document.body)}
    </div>
  )
}
