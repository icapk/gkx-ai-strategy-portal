import {exportOnlineFile,downloadBlob} from '../researchExport'
import {displayMinute,documentSizeLabel} from '../displayFormat'
import DOMPurify from 'dompurify'
import { loadResearchDataTables, exportResearchDataTableCsv } from '../dataTableContent'
import { useEffect, useRef, useState, type ReactNode, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent } from 'react'
import { createPortal } from 'react-dom'

import type { ResearchDocument, WorkbenchTab } from '../types'
import { displayResearchLocation, favoriteTimeLabel } from '../workbenchDocuments'
import { compareResearchDocuments, minute } from '../researchSort'
import { recentDocumentWindow, recentDocumentLimitForIndex, RECENT_DOCUMENT_BATCH, usesWorkbenchLoadMore } from '../recentDocuments'

export type FolderTableEntry = { item: ResearchDocument; key: string; onOpen: () => void; actions: ReactNode; title?: ReactNode }
interface DocumentTableProps {
  canEdit?:(item:ResearchDocument)=>boolean
  showDeletedBy?:boolean
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
  recentResetKey?: string | number
}

function sizeInMegabytes(item: ResearchDocument) {
  return documentSizeLabel(item, item.kind==='数据表格'?loadResearchDataTables().find(t=>t.documentId===item.id):undefined)
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
  canEdit=()=>true, showDeletedBy=false,
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

  onRestore,
  onRename,
  onCreateNote,
  onOpenDocument,
  onDownloadDocument,
  highlightedDocumentId = null,
  recentResetKey = '',
}: DocumentTableProps) {
  const [spaceMenuId, setSpaceMenuId] = useState<number | null>(null)
  const [pageSize, setPageSize] = useState<10 | 20 | 50>(20)
  const [sort, setSort] = useState<{ key: 'createdAt' | 'visitedAt'; direction: 'asc' | 'desc' }>({ key: mode==='space'?'createdAt':'visitedAt', direction: 'desc' })
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
  const usesLoadMore = usesWorkbenchLoadMore(mode,workbenchTab)
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
  const columnCount = isRecycle?(showDeletedBy?7:6):isRecent||isFavorites?7:8
  const totalPages = Math.max(1, Math.ceil(allItems.length / pageSize))
  const recentKey=JSON.stringify([mode,workbenchTab,sort.key,sort.direction,recentResetKey])
  const [recentState,setRecentState]=useState({key:recentKey,limit:RECENT_DOCUMENT_BATCH})
  const recentLimit=recentState.key===recentKey?recentState.limit:RECENT_DOCUMENT_BATCH
  const recentWindow=recentDocumentWindow(sortedDocuments,recentLimit)
  const visibleDocuments = usesLoadMore?recentWindow.items:sortedDocuments.slice((page - 1) * pageSize, page * pageSize)
  const emptyState = emptyCopy(mode, workbenchTab)

  useEffect(()=>{setRecentState({key:recentKey,limit:RECENT_DOCUMENT_BATCH})},[recentKey])
  useEffect(()=>{
    if(!usesLoadMore||highlightedDocumentId==null)return
    const index=sortedDocuments.findIndex(item=>item.id===highlightedDocumentId)
    if(index>=0)setRecentState(state=>({key:recentKey,limit:Math.max(state.key===recentKey?state.limit:RECENT_DOCUMENT_BATCH,recentDocumentLimitForIndex(index))}))
  },[highlightedDocumentId,usesLoadMore])

  useEffect(() => {
    if (!usesLoadMore && page > totalPages) onPageChange(totalPages)
  }, [usesLoadMore, onPageChange, page, totalPages])


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
    const closeFromViewportChange = () => {
      const rect=trigger?.getBoundingClientRect()
      if(!rect||rect.bottom<0||rect.top>window.innerHeight){setSpaceMenuId(null);return}
      setSpaceMenuPosition({left:Math.max(8,Math.min(rect.right-180,window.innerWidth-188)),top:Math.max(8,Math.min(rect.bottom+4,window.innerHeight-240))})
    }
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
  }, [highlightedDocumentId,visibleDocuments.length])

  const openSpaceMenu = (event: ReactMouseEvent<HTMLButtonElement>, documentId: number) => {
    event.stopPropagation()
    if (spaceMenuId === documentId) {
      setSpaceMenuId(null)
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    const menuWidth = 170
    const menuHeight = (2 + (onRename ? 1 : 0) + (onToggleQuickAccess ? 1 : 0)) * 46 + 18
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

  const downloadFallback=async(item:ResearchDocument)=>{try{const file=await exportOnlineFile(item,loadResearchDataTables().find(t=>t.documentId===item.id));downloadBlob(file.name,file.data)}catch(error){window.alert('导出失败：'+String(error))}}

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
        <button type="submit" aria-label="保存" title="保存">✓</button>
        <button type="button" aria-label="取消" title="取消" onClick={() => cancelRename(documentItem.id)}>×</button>
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

  const renderHeader=()=> <><th>文档名称</th><th>文档类型</th><th>{isRecycle?'原位置':'位置'}</th>{!isRecycle&&<th>创建者</th>}<th>文档大小</th>{isRecycle?<><th>删除时间</th>{showDeletedBy&&<th>删除者</th>}</>:isFavorites?<th>收藏时间</th>:isRecent?sortHeader('visitedAt','最后打开时间'):<>{sortHeader('createdAt','创建时间')}<th>最后修改时间</th></>}<th>操作</th></>

  const renderActions = (documentItem: ResearchDocument) => {
    if (isRecycle) {
      return <><button type="button" onClick={() => onRestore?.(documentItem.id)}>恢复</button><button disabled={!canEdit(documentItem)} className="danger-link" type="button" onClick={() => onDelete(documentItem.id)}>彻底删除</button></>
    }
    return (
      <>
        <button disabled={!canEdit(documentItem)} type="button" onClick={() => onShare(documentItem.id)}>分享</button><button data-focus-id="research-download" type="button" onClick={()=>{if(onDownloadDocument)onDownloadDocument(documentItem);else downloadFallback(documentItem)}}>下载</button>
        <span className="document-space-menu-wrap">
          <button data-focus-reveal="research-document-menu" className="more-button" type="button" ref={(node) => { if (node) spaceMenuTriggerRefs.current.set(documentItem.id, node); else spaceMenuTriggerRefs.current.delete(documentItem.id) }} aria-label={`${documentItem.title}更多操作`} aria-haspopup="menu" aria-expanded={spaceMenuId === documentItem.id} onClick={(event) => openSpaceMenu(event, documentItem.id)}><span className="more-dots" aria-hidden="true"><i /><i /><i /></span></button>
        </span>
      </>
    )
  }

  const renderRow=(item:ResearchDocument)=>{
    const folder=folderEntries.find(entry=>entry.item.id===item.id)
    const person=(name?:string)=>name?<span className="owner-cell"><img src="/assets/avatar-owner.svg" alt=""/>{name}</span>:'-'
    return <><td className="title-cell">{folder?(folder.title??<button type="button" className="document-title-link" onClick={folder.onOpen}>📁 {item.title}</button>):renderTitle(item)}</td><td>{folder?'文件夹':<KindTag kind={item.kind}/>}</td><td title={displayResearchLocation(isRecycle?item.originalLocation??item.location:item.location)}>{displayResearchLocation(isRecycle?item.originalLocation??item.location:item.location)}</td>{!isRecycle&&<td>{person(item.owner)}</td>}<td>{folder?'-':sizeInMegabytes(item)}</td>{isRecycle?<><td>{displayMinute(item.deletedAt)}</td>{showDeletedBy&&<td>{person(item.deletedBy)}</td>}</>:isFavorites?<td>{favoriteTimeLabel(item)}</td>:isRecent?<td>{displayMinute(item.visitedAt)}</td>:<><td>{displayMinute(item.createdAt)}</td><td>{displayMinute(item.updatedAt)}</td></>}<td><span className="row-actions">{folder?folder.actions:renderActions(item)}</span></td></>
  }

  return (
    <div className={`table-region table-region--${tableProfile}`} ref={tableRegionRef}>
      <div className="table-scroll">
        <table data-deleted-by={isRecycle && showDeletedBy ? "true" : undefined} className={`document-table document-table--${tableProfile}`} aria-label={isRecent ? '最近浏览文档' : isFavorites ? '收藏文档' : mode === 'space' ? '空间文档' : isRecycle ? '回收站内容' : '工作台文档'}>
          <thead><tr>{renderHeader()}</tr></thead>
          <tbody>
            {allItems.length === 0 ? (
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
                data-document-kind={folderEntries.some(entry => entry.item.id === documentItem.id) ? "文件夹" : documentItem.kind}
                className={highlightedDocumentId === documentItem.id ? 'is-search-target' : undefined}
              >
                {renderRow(documentItem)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {usesLoadMore ? (recentWindow.hasMore ? <div className="pagination" aria-label={`${workbenchTab==='quick'?'快速访问':workbenchTab==='favorites'?'我的收藏':'最近浏览'}加载更多`}><button type="button" data-focus-id={`research-${workbenchTab}-load-more`} onClick={()=>setRecentState({key:recentKey,limit:recentWindow.nextLimit})}>加载更多</button><span aria-live="polite">已显示 {visibleDocuments.length} / {allItems.length} 条</span></div> : null) : allItems.length > 0 ? (
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
            {onToggleQuickAccess && <button type="button" role="menuitem" onClick={() => runSpaceMenuAction(documentItem.id, () => onToggleQuickAccess(`document:${documentItem.id}`))}>{quickAccess.includes(`document:${documentItem.id}`) ? '取消快速访问' : '加入快速访问'}</button>}
            {<button data-focus-id="research-favorite" type="button" role="menuitem" onClick={() => runSpaceMenuAction(documentItem.id, () => onToggleFavorite(documentItem.id))}>{documentItem.favorite ? '取消收藏' : '收藏'}</button>}
            {onRename&&<button disabled={!canEdit(documentItem)} type="button" role="menuitem" onClick={()=>runSpaceMenuAction(documentItem.id,()=>{setRenamingDocumentId(documentItem.id);setRenameValue(documentItem.title);setRenameError('')})}>重命名</button>}<button disabled={!canEdit(documentItem)} type="button" role="menuitem" className="danger-link" onClick={() => runSpaceMenuAction(documentItem.id, () => onDelete(documentItem.id))}>删除</button>
          </div>
        )
      })(), document.body)}
    </div>
  )
}
