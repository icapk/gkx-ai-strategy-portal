import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import type { ReadingDocument } from '../readingData'

interface ReadingLibraryProps {
  documents: ReadingDocument[]
  onDocumentsChange: (documents: ReadingDocument[]) => boolean
  selectedDocumentId: number | null
  onSelectDocument: (documentId: number) => void
  onOpenDocument: (document: ReadingDocument) => void
  onBack: () => void
  onUpload: () => void
  onToast: (message: string) => void
  folders: string[]
  onFoldersChange: (folders: string[]) => boolean
}

type LibrarySection = 'all' | 'favorites'
type LibraryFilter = '全部' | '论文' | '专利' | '报告'

const documentMeta: Record<number, { date: string; uploadedAt: string; editedAt: string; tag: Exclude<LibraryFilter, '全部'> }> = {
  1: { date: '2026.07.09', uploadedAt: '2026-07-09T10:00:00', editedAt: '2026-07-10T15:30:00', tag: '论文' },
  2: { date: '2026.07.08', uploadedAt: '2026-07-08T10:00:00', editedAt: '2026-07-11T09:20:00', tag: '专利' },
  3: { date: '2026.07.07', uploadedAt: '2026-07-07T10:00:00', editedAt: '2026-07-09T16:10:00', tag: '报告' },
  4: { date: '2026.07.06', uploadedAt: '2026-07-06T10:00:00', editedAt: '2026-07-12T11:45:00', tag: '论文' },
}

const libraryTagClass: Record<Exclude<LibraryFilter, '全部'>, string> = {
  论文: 'paper',
  专利: 'patent',
  报告: 'report',
}

const trapDialogFocus = (event: ReactKeyboardEvent<HTMLElement>) => {
  if (event.key !== 'Tab') return
  const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'))
  if (focusable.length === 0) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

interface OverflowLabelProps {
  text: string
  className?: string
}

interface TooltipPosition {
  top: number
  left: number
  maxWidth: number
  above: boolean
}

function OverflowLabel({ text, className = '' }: OverflowLabelProps) {
  const labelRef = useRef<HTMLSpanElement>(null)
  const [tooltip, setTooltip] = useState<TooltipPosition | null>(null)

  const hideTooltip = () => setTooltip(null)
  const showTooltip = () => {
    const label = labelRef.current
    if (!label || label.scrollWidth <= label.clientWidth + 1) return
    const rect = label.getBoundingClientRect()
    const maxWidth = Math.min(360, Math.max(180, Math.ceil(text.length * 14)))
    const left = Math.min(Math.max(12, rect.left), Math.max(12, window.innerWidth - maxWidth - 12))
    const above = rect.bottom + 64 > window.innerHeight
    setTooltip({ top: above ? rect.top - 8 : rect.bottom + 8, left, maxWidth, above })
  }

  useEffect(() => {
    const label = labelRef.current
    const owner = label?.closest('button')
    if (!label || !owner) return
    owner.addEventListener('focus', showTooltip)
    owner.addEventListener('blur', hideTooltip)
    window.addEventListener('resize', hideTooltip)
    window.addEventListener('scroll', hideTooltip, true)
    const observer = new ResizeObserver(() => {
      if (label.scrollWidth <= label.clientWidth + 1) hideTooltip()
    })
    observer.observe(label)
    return () => {
      owner.removeEventListener('focus', showTooltip)
      owner.removeEventListener('blur', hideTooltip)
      window.removeEventListener('resize', hideTooltip)
      window.removeEventListener('scroll', hideTooltip, true)
      observer.disconnect()
    }
  }, [text])

  return (
    <>
      <span ref={labelRef} className={`reading-overflow-label${className ? ` ${className}` : ''}`} onPointerEnter={showTooltip} onPointerLeave={hideTooltip}>{text}</span>
      {tooltip && createPortal(
        <span
          className={`reading-field-tooltip${tooltip.above ? ' is-above' : ''}`}
          role="tooltip"
          style={{ top: tooltip.top, left: tooltip.left, maxWidth: tooltip.maxWidth }}
        >
          {text}
        </span>,
        document.body,
      )}
    </>
  )
}

export function ReadingLibrary({
  documents,
  onDocumentsChange,
  selectedDocumentId,
  onSelectDocument,
  onOpenDocument,
  onBack,
  onUpload,
  onToast,
  folders,
  onFoldersChange,
}: ReadingLibraryProps) {
  const [section, setSection] = useState<LibrarySection>('all')
  const [filter, setFilter] = useState<LibraryFilter>('全部')
  const [filterOpen, setFilterOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [sortMode, setSortMode] = useState<'最近上传' | '最后编辑'>('最近上传')
  const [sortOpen, setSortOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<10 | 20>(10)
  const [pageSizeOpen, setPageSizeOpen] = useState(false)
  const [activeFolder, setActiveFolder] = useState('我的笔记库1')
  const [expandedFolder, setExpandedFolder] = useState('我的笔记库1')
  const [newFolderOpen, setNewFolderOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderError, setNewFolderError] = useState('')
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null)
  const [renameFolderValue, setRenameFolderValue] = useState('')
  const [menuDocumentId, setMenuDocumentId] = useState<number | null>(null)
  const [moveDocumentId, setMoveDocumentId] = useState<number | null>(null)
  const [moveTarget, setMoveTarget] = useState('我的笔记库1')
  const [moveSearch, setMoveSearch] = useState('')
  const [moveTab, setMoveTab] = useState<'全部' | '收藏'>('全部')
  const libraryRef = useRef<HTMLElement>(null)
  const newFolderInputRef = useRef<HTMLInputElement>(null)
  const newFolderCancelledRef = useRef(false)
  const newFolderCommittedRef = useRef(false)
  const sortTriggerRef = useRef<HTMLButtonElement>(null)
  const sortOptionRefs = useRef<Array<HTMLButtonElement | null>>([])

  const focusNewFolderInput = (select = false) => {
    window.requestAnimationFrame(() => {
      newFolderInputRef.current?.focus()
      if (select) newFolderInputRef.current?.select()
    })
  }

  const startNewFolder = () => {
    if (section !== 'all') return
    if (newFolderOpen) {
      focusNewFolderInput()
      return
    }
    newFolderCancelledRef.current = false
    newFolderCommittedRef.current = false
    setNewFolderName('')
    setNewFolderError('')
    setRenamingFolder(null)
    setNewFolderOpen(true)
  }

  const cancelNewFolder = () => {
    newFolderCancelledRef.current = true
    setNewFolderOpen(false)
    setNewFolderName('')
    setNewFolderError('')
  }

  const closeSortMenu = (restoreFocus = false) => {
    setSortOpen(false)
    if (restoreFocus) window.requestAnimationFrame(() => sortTriggerRef.current?.focus())
  }

  const focusSortOption = (index: number) => {
    window.requestAnimationFrame(() => sortOptionRefs.current[index]?.focus())
  }

  useEffect(() => {
    const closeMenus = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!libraryRef.current?.contains(target)) {
        setFilterOpen(false)
        setSortOpen(false)
        setPageSizeOpen(false)
        setMenuDocumentId(null)
        return
      }
      if (!target.closest('.reading-library-filter-wrap') && !target.closest('.reading-library-sort-wrap') && !target.closest('.reading-library-page-size-wrap') && !target.closest('.reading-library-card-menu-wrap')) {
        setFilterOpen(false)
        setSortOpen(false)
        setPageSizeOpen(false)
        setMenuDocumentId(null)
      }
    }
    window.addEventListener('click', closeMenus)
    return () => window.removeEventListener('click', closeMenus)
  }, [])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setFilterOpen(false)
      if (sortOpen) closeSortMenu(true)
      setPageSizeOpen(false)
      setMenuDocumentId(null)
      setMoveDocumentId(null)
      if (newFolderOpen) cancelNewFolder()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [newFolderOpen, sortOpen])

  const visibleDocuments = useMemo(() => {
    let list = section === 'favorites' ? documents.filter((document) => document.favorite) : documents
    if (filter !== '全部') list = list.filter((document) => (documentMeta[document.id]?.tag ?? '论文') === filter)
    const keyword = search.trim().toLowerCase()
    if (keyword) list = list.filter((document) => `${document.title}${document.authors}${document.journal}`.toLowerCase().includes(keyword))
    const field = sortMode === '最近上传' ? 'uploadedAt' : 'editedAt'
    return list.slice().sort((first, second) => {
      const firstValue = documentMeta[first.id]?.[field] ?? ''
      const secondValue = documentMeta[second.id]?.[field] ?? ''
      return secondValue.localeCompare(firstValue) || first.title.localeCompare(second.title, 'zh-CN')
    })
  }, [documents, filter, search, section, sortMode])

  const toggleFavorite = (documentId: number) => {
    onDocumentsChange(documents.map((document) => document.id === documentId ? { ...document, favorite: !document.favorite } : document))
  }

  const commitNewFolder = (origin: 'enter' | 'blur') => {
    if (newFolderCancelledRef.current || newFolderCommittedRef.current) return
    const name = newFolderName.trim()
    if (!name) {
      if (origin === 'enter') {
        setNewFolderError('请输入文件夹名称')
        focusNewFolderInput()
      } else {
        cancelNewFolder()
      }
      return
    }
    if (folders.some((folder) => folder.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      setNewFolderError('文件夹名称已存在')
      onToast('文件夹名称已存在')
      focusNewFolderInput(true)
      return
    }
    if (!onFoldersChange([name, ...folders])) {
      focusNewFolderInput()
      return
    }
    newFolderCommittedRef.current = true
    setNewFolderName('')
    setNewFolderError('')
    setNewFolderOpen(false)
    onToast(`已新建“${name}”`)
  }

  const commitFolderRename = () => {
    if (renamingFolder == null) return
    const value = renameFolderValue.trim()
    if (value && value !== renamingFolder) {
      if (!onFoldersChange(folders.map((folder) => folder === renamingFolder ? value : folder))) return
      if (activeFolder === renamingFolder) setActiveFolder(value)
      if (expandedFolder === renamingFolder) setExpandedFolder(value)
    }
    setRenamingFolder(null)
    setRenameFolderValue('')
  }

  const confirmMove = () => {
    if (moveDocumentId == null) return
    if (!onDocumentsChange(documents.map((document) => document.id === moveDocumentId ? { ...document, folder: moveTarget } : document))) return
    setMoveDocumentId(null)
    setActiveFolder(moveTarget)
  }

  const downloadDocument = (documentItem: ReadingDocument) => {
    const body = [
      documentItem.title,
      `作者：${documentItem.authors}`,
      `来源：${documentItem.journal}（${documentItem.year}）`,
      `文件类型：${documentItem.type}`,
    ].join('\n')
    const url = URL.createObjectURL(new Blob([body], { type: 'text/plain;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${documentItem.title}.txt`
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  const folderDocuments = documents.filter((document) => document.folder === activeFolder).slice(0, 4)

  const selectLibraryDocument = (documentItem: ReadingDocument) => {
    setFilter('全部')
    setSearch('')
    setPage(1)
    onSelectDocument(documentItem.id)
    window.requestAnimationFrame(() => {
      window.document.getElementById(`reading-library-card-${documentItem.id}`)?.scrollIntoView({ block: 'nearest' })
    })
  }

  const selectSortMode = (mode: '最近上传' | '最后编辑') => {
    setSortMode(mode)
    closeSortMenu(true)
  }

  const handleSortTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    setSortOpen(true)
    focusSortOption(event.key === 'ArrowDown' ? 0 : 1)
  }

  const handleSortMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const activeIndex = sortOptionRefs.current.findIndex((option) => option === document.activeElement)
    if (event.key === 'Escape') {
      event.preventDefault()
      closeSortMenu(true)
      return
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    if (event.key === 'Home') focusSortOption(0)
    else if (event.key === 'End') focusSortOption(1)
    else focusSortOption(event.key === 'ArrowDown' ? (activeIndex + 1 + 2) % 2 : (activeIndex - 1 + 2) % 2)
  }

  return (
    <section className="reading-library-frame" ref={libraryRef} aria-label="智能阅读库">
      <header className="reading-library-header">
        <div><button type="button" aria-label="返回阅读" onClick={onBack}><img className="reading-library-back" src="/assets/reading/back.svg" alt="" /></button><h1>智能阅读库</h1></div>
        <label className="reading-library-search"><img src="/assets/reading/search.svg" alt="" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索文献标题、作者或期刊" aria-label="搜索智能阅读库" /></label>
      </header>

      <aside className="reading-library-sidebar">
        <div className="reading-library-rail" role="tablist" aria-label="阅读库分类">
          <button type="button" role="tab" aria-selected={section === 'all'} className={section === 'all' ? 'is-active' : ''} onClick={() => setSection('all')} aria-label="全部笔记"><img src="/assets/reading/library-note.svg" alt="" /></button>
          <button type="button" role="tab" aria-selected={section === 'favorites'} className={section === 'favorites' ? 'is-active' : ''} onClick={() => setSection('favorites')} aria-label="我的收藏"><img src="/assets/reading/library-favorite.svg" alt="" /></button>
        </div>
        <div className="reading-library-tree">
          <div className="reading-library-tree-heading"><h2>{section === 'favorites' ? '收藏' : '笔记'}</h2>{section === 'all' && <button type="button" aria-label="新建文件夹" aria-expanded={newFolderOpen} onClick={startNewFolder}><img src="/assets/reading/create-folder.svg" alt="" /></button>}</div>
          {section === 'all' ? (
            <div className="reading-folder-tree">
              {newFolderOpen && <><div className={`reading-new-folder-row${newFolderError ? ' has-error' : ''}`}><img className="reading-folder-chevron is-collapsed" src="/assets/reading/library-folder.svg" alt="" /><img className="reading-folder-icon" src="/assets/reading/library-folder-shape.svg" alt="" /><input ref={newFolderInputRef} value={newFolderName} maxLength={30} aria-label="新文件夹名称" aria-invalid={Boolean(newFolderError)} aria-describedby={newFolderError ? 'reading-new-folder-error' : undefined} onChange={(event) => { setNewFolderName(event.target.value); if (newFolderError) setNewFolderError('') }} onKeyDown={(event) => { if (event.nativeEvent.isComposing) return; if (event.key === 'Enter') { event.preventDefault(); commitNewFolder('enter') } else if (event.key === 'Escape') { event.preventDefault(); cancelNewFolder() } }} onBlur={() => commitNewFolder('blur')} autoFocus /></div>{newFolderError && <span className="sr-only" role="alert" id="reading-new-folder-error">{newFolderError}</span>}</>}
              {folders.map((folder) => (
                <div key={folder}>
                  {renamingFolder === folder ? <div className="reading-new-folder-row is-renaming"><img className={`reading-folder-chevron${expandedFolder === folder ? '' : ' is-collapsed'}`} src="/assets/reading/library-folder.svg" alt="" /><input value={renameFolderValue} onChange={(event) => setRenameFolderValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') commitFolderRename(); if (event.key === 'Escape') setRenamingFolder(null) }} onBlur={commitFolderRename} autoFocus /></div> : <button
                    type="button"
                    className={`reading-folder-row${activeFolder === folder ? ' is-active' : ''}`}
                    aria-expanded={expandedFolder === folder}
                    aria-label={folder}
                    onClick={() => {
                      setActiveFolder(folder)
                      setExpandedFolder((current) => current === folder ? '' : folder)
                    }}
                  ><img className={`reading-folder-chevron${expandedFolder === folder ? '' : ' is-collapsed'}`} src="/assets/reading/library-folder.svg" alt="" /><img className="reading-folder-icon" src="/assets/reading/library-folder-shape.svg" alt="" /><OverflowLabel text={folder} /></button>}
                  {expandedFolder === folder && <div className="reading-folder-docs">{folderDocuments.map((document) => {
                    const selected = document.id === selectedDocumentId
                    return <button type="button" aria-label={document.title} aria-current={selected ? 'true' : undefined} aria-controls={`reading-library-card-${document.id}`} className={selected ? 'is-active' : ''} key={document.id} onClick={() => selectLibraryDocument(document)}><img src={selected ? '/assets/reading/notes-active.svg' : '/assets/reading/notes.svg'} alt="" /><OverflowLabel text={document.title} /></button>
                  })}</div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="reading-folder-tree">
              {['我的收藏1', '我的收藏2'].map((folder, index) => <div key={folder}><button type="button" aria-label={folder} className={`reading-folder-row${index === 0 ? ' is-active' : ''}`}><img className={`reading-folder-chevron${index === 0 ? '' : ' is-collapsed'}`} src="/assets/reading/library-folder.svg" alt="" /><img className="reading-folder-icon" src="/assets/reading/library-folder-shape.svg" alt="" /><OverflowLabel text={folder} /></button>{index === 0 && <div className="reading-folder-docs">{documents.filter((document) => document.favorite).map((document) => {
                const selected = document.id === selectedDocumentId
                return <button type="button" aria-label={document.title} aria-current={selected ? 'true' : undefined} aria-controls={`reading-library-card-${document.id}`} className={selected ? 'is-active' : ''} key={document.id} onClick={() => selectLibraryDocument(document)}><img src={selected ? '/assets/reading/notes-active.svg' : '/assets/reading/notes.svg'} alt="" /><OverflowLabel text={document.title} /></button>
              })}</div>}</div>)}
            </div>
          )}
        </div>
      </aside>

      <main className="reading-library-main">
        <div className="reading-library-toolbar">
          <div className="reading-library-filter-wrap">
            <button type="button" className={filterOpen ? 'is-open' : ''} onClick={(event) => { event.stopPropagation(); setSortOpen(false); setPageSizeOpen(false); setFilterOpen((open) => !open) }}>{filter}<img className={filterOpen ? 'is-open' : ''} src="/assets/direction-down.svg" alt="" /></button>
            {filterOpen && <div className="reading-library-filter-menu" role="menu">{(['全部', '论文', '专利', '报告'] as LibraryFilter[]).map((item) => <button type="button" role="menuitem" className={filter === item ? 'is-active' : ''} key={item} onClick={() => { setFilter(item); setFilterOpen(false) }}>{item}</button>)}</div>}
          </div>
          <div className="reading-library-sort-wrap">
            <button ref={sortTriggerRef} type="button" className={`reading-library-sort${sortOpen ? ' is-open' : ''}`} aria-haspopup="listbox" aria-expanded={sortOpen} aria-controls="reading-library-sort-list" onKeyDown={handleSortTriggerKeyDown} onClick={(event) => { event.stopPropagation(); setFilterOpen(false); setPageSizeOpen(false); if (sortOpen) closeSortMenu(); else setSortOpen(true) }}><span>排序</span><i /><b className="reading-library-sort-value">{sortMode}</b><img className={sortOpen ? 'is-open' : ''} src="/assets/reading/sort-chevron.svg" alt="" /></button>
            {sortOpen && <div id="reading-library-sort-list" className="reading-library-sort-menu" role="listbox" aria-label="选择排序方式" onKeyDown={handleSortMenuKeyDown}>{(['最近上传', '最后编辑'] as const).map((mode, index) => <button ref={(option) => { sortOptionRefs.current[index] = option }} type="button" role="option" aria-selected={sortMode === mode} className={sortMode === mode ? 'is-active' : ''} key={mode} onClick={() => selectSortMode(mode)}>{mode}</button>)}</div>}
          </div>
        </div>

        <div className="reading-library-card-grid">
          {visibleDocuments.map((document) => {
            const meta = documentMeta[document.id] ?? { date: '2026.07.10', uploadedAt: '2026-07-10T10:00:00', editedAt: '2026-07-10T10:00:00', tag: '论文' as const }
            const selected = document.id === selectedDocumentId
            return <article id={`reading-library-card-${document.id}`} className={`reading-library-card${selected ? ' is-selected' : ''}`} aria-current={selected ? 'true' : undefined} key={document.id}>
              <img className="reading-library-file-icon" src={document.type === 'PDF' ? '/assets/reading/pdf.svg' : '/assets/reading/docx.svg'} alt="" />
              <div className="reading-library-card-body">
                <h3 className="reading-library-card-title">{document.title}</h3>
                <div className="reading-library-card-meta">
                  <button type="button" className={`reading-library-star${document.favorite ? ' is-active' : ''}`} aria-label={document.favorite ? '取消收藏' : '收藏'} onClick={() => toggleFavorite(document.id)}><img src={document.favorite ? '/assets/reading/star.svg' : '/assets/reading/star-outline.svg'} alt="" /></button>
                  <span className={`reading-library-tag reading-library-tag--${libraryTagClass[meta.tag]}`}>{meta.tag}</span><span>{meta.date}</span><span>{document.size.replace(' ', '')}</span>
                  <span className="reading-library-card-spacer" />
                  <button type="button" className="reading-library-edit" aria-label={`编辑${document.title}`} onClick={() => onOpenDocument(document)}>编辑</button>
                  <div className="reading-library-card-menu-wrap">
                    <button type="button" aria-label={`${document.title}更多操作`} onClick={(event) => { event.stopPropagation(); setMenuDocumentId((current) => current === document.id ? null : document.id) }}><span className="reading-more-dots" aria-hidden="true" /></button>
                    {menuDocumentId === document.id && <div className="reading-library-more-menu" role="menu"><button type="button" role="menuitem" onClick={() => { setMoveDocumentId(document.id); setMoveTarget(document.folder); setMenuDocumentId(null) }}>移动</button><button type="button" role="menuitem" onClick={() => { setMenuDocumentId(null); downloadDocument(document) }}>下载</button><button type="button" role="menuitem" onClick={() => { onDocumentsChange(documents.filter((item) => item.id !== document.id)); setMenuDocumentId(null) }}>删除</button></div>}
                  </div>
                </div>
              </div>
            </article>
          })}
          {visibleDocuments.length === 0 && <div className="reading-library-empty"><img src="/assets/reading/notes-empty.svg" alt="" /><h3>暂无文献</h3><p>上传文件或切换筛选条件查看内容</p><button type="button" onClick={onUpload}>上传文件</button></div>}
        </div>

        <div className="reading-library-pagination">
          <button type="button" disabled={page === 1} aria-label="上一页" onClick={() => setPage((current) => Math.max(1, current - 1))}><span className="reading-page-chevron is-prev" /></button>
          {[1, 2, 3, 4, 5].map((number) => <button type="button" className={page === number ? 'is-active' : ''} aria-current={page === number ? 'page' : undefined} key={number} onClick={() => setPage(number)}>{number}</button>)}
          <button type="button" disabled={page === 5} aria-label="下一页" onClick={() => setPage((current) => Math.min(5, current + 1))}><span className="reading-page-chevron" /></button>
          <div className="reading-library-page-size-wrap">
            <button type="button" className={`reading-page-size-trigger${pageSizeOpen ? ' is-open' : ''}`} aria-haspopup="listbox" aria-expanded={pageSizeOpen} onClick={() => setPageSizeOpen((open) => !open)}><span>{pageSize}条/页</span><span className="reading-page-size-chevron" aria-hidden="true" /></button>
            {pageSizeOpen && <div className="reading-page-size-menu" role="listbox" aria-label="每页显示数量">{([10, 20] as const).map((size) => <button type="button" role="option" aria-selected={pageSize === size} className={pageSize === size ? 'is-active' : ''} key={size} onClick={() => { setPageSize(size); setPage(1); setPageSizeOpen(false) }}>{size}条/页</button>)}</div>}
          </div>
        </div>
      </main>

      {moveDocumentId != null && <div className="reading-library-overlay"><section className="reading-move-modal" role="dialog" aria-modal="true" aria-labelledby="reading-move-title" onKeyDown={trapDialogFocus}><header><h2 id="reading-move-title">移动笔记</h2><button type="button" className="reading-dialog-close" aria-label="关闭移动笔记" onClick={() => setMoveDocumentId(null)} /></header><input className="reading-move-search" value={moveSearch} onChange={(event) => setMoveSearch(event.target.value)} placeholder="搜索" autoFocus /><div className="reading-move-tabs"><button type="button" className={moveTab === '全部' ? 'is-active' : ''} onClick={() => setMoveTab('全部')}>全部</button><button type="button" className={moveTab === '收藏' ? 'is-active' : ''} onClick={() => setMoveTab('收藏')}>收藏</button></div><div className="reading-move-folders">{folders.filter((folder) => folder.includes(moveSearch.trim())).map((folder) => <button type="button" className={moveTarget === folder ? 'is-active' : ''} onClick={() => setMoveTarget(folder)} key={folder}><span className="reading-folder-shape" aria-hidden="true" />{folder}{moveTarget === folder && <img src="/assets/selected-check.svg" alt="" />}</button>)}</div><footer><button type="button" onClick={() => setMoveDocumentId(null)}>取消</button><button type="button" className="reading-primary-button" onClick={confirmMove}>移动</button></footer></section></div>}
    </section>
  )
}
