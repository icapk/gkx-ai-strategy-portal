import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { downloadPdfArchive } from '../pdfArchive'
import type { FolderItem, ResearchDocument } from '../types'
import { DocumentTable } from './DocumentTable'

interface SpaceViewProps {
  onManageSpace?: () => void
  quickAccess: string[]
  onToggleQuickAccess: (key: string) => void
  mode: 'personal' | 'team'
  teamName?: string
  folders: FolderItem[]
  documents: ResearchDocument[]
  openFolderName: string | null
  page: number
  onPageChange: (page: number) => void
  onOpenFolder: (folder: FolderItem) => void
  onRenameFolder: (id: number, name: string) => boolean
  onDeleteFolder: (id: number) => void
  onBack: () => void
  onNewFolder: () => void
  onNewDocument: () => void
  onNewTable: () => void
  onImportDocument: () => void
  onToggleFavorite: (id: number) => void
  onDelete: (id: number) => void
  onShare: (id: number) => void
  onRenameDocument: (id: number, title: string) => boolean
  onCreateNote: (documentItem: ResearchDocument) => void
  onOpenDocument: (documentItem: ResearchDocument) => void
  onDownloadDocument?: (documentItem: ResearchDocument) => void
  emptyTeam?: boolean
}

const downloadArchivedPdf = (documentItem: ResearchDocument) => {
  void downloadPdfArchive(documentItem).then((result) => {
    if (!result.ok) window.alert(result.error)
  }).catch(() => window.alert('PDF 下载失败，请稍后重试。'))
}

const sizeInBytes = (value: string) => {
  const match = value.trim().match(/^([\d.]+)\s*(B|KB|MB|GB)$/i)
  if (!match) return 0
  const amount = Number(match[1])
  const unit = match[2].toUpperCase()
  const multiplier = unit === 'GB' ? 1024 ** 3 : unit === 'MB' ? 1024 ** 2 : unit === 'KB' ? 1024 : 1
  return Number.isFinite(amount) ? amount * multiplier : 0
}

const aggregateSize = (documents: ResearchDocument[]) => {
  const bytes = documents.reduce((total, documentItem) => total + sizeInBytes(documentItem.size), 0)
  if (bytes < 1024) return `${Math.round(bytes)} B`
  if (bytes < 1024 ** 2) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`
}

const folderUpdatedAt = (folder: FolderItem, documents: ResearchDocument[]) => documents.reduce(
  (latest, documentItem) => {
    const candidate = documentItem.updatedAt ?? documentItem.createdAt
    return candidate > latest ? candidate : latest
  },
  folder.updatedAt,
)

export function SpaceView({
  quickAccess, onToggleQuickAccess, onManageSpace,
  mode,
  teamName,
  folders,
  documents,
  openFolderName,
  page,
  onPageChange,
  onOpenFolder,
  onRenameFolder,
  onDeleteFolder,
  onBack,
  onNewFolder,
  onNewDocument, onNewTable,
  onImportDocument,
  onToggleFavorite,
  onDelete,
  onShare,
  onRenameDocument,
  onCreateNote,
  onOpenDocument,
  onDownloadDocument = downloadArchivedPdf,
  emptyTeam = false,
}: SpaceViewProps) {
  const locationRoot = mode === 'personal' ? '我的空间' : teamName ?? 'AI研究团队'
  const label = mode === 'personal' ? '个人空间' : locationRoot
  const [menuFolderId, setMenuFolderId] = useState<number | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ left: number; top: number } | null>(null)
  const [renamingFolderId, setRenamingFolderId] = useState<number | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [renameError, setRenameError] = useState('')
  const menuRef = useRef<HTMLDivElement | null>(null)
  const menuTriggerRefs = useRef(new Map<number, HTMLButtonElement>())
  const renameInputRef = useRef<HTMLInputElement>(null)
  const visibleDocuments = openFolderName
    ? documents.filter((documentItem) => documentItem.location === `${locationRoot}/${openFolderName}`)
    : documents

  const closeFolderMenu = (restoreFocus = false) => {
    const trigger = menuFolderId == null ? null : menuTriggerRefs.current.get(menuFolderId)
    setMenuFolderId(null)
    setMenuPosition(null)
    if (restoreFocus) window.requestAnimationFrame(() => trigger?.focus())
  }

  useEffect(() => {
    if (menuFolderId === null) return
    const trigger = menuTriggerRefs.current.get(menuFolderId)
    const focusTimer = window.setTimeout(() => menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus({preventScroll:true}), 0)
    const closeFromOutside = (event: PointerEvent) => {
      const target = event.target as Node
      if (menuRef.current?.contains(target) || trigger?.contains(target)) return
      closeFolderMenu()
    }
    const closeFromKeyboard = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      closeFolderMenu(true)
    }
    const closeFromViewportChange = () => {
      const rect=trigger?.getBoundingClientRect()
      if(!rect||rect.bottom<0||rect.top>window.innerHeight){closeFolderMenu();return}
      setMenuPosition({left:Math.max(8,Math.min(rect.left,window.innerWidth-188)),top:Math.max(8,Math.min(rect.bottom+10,window.innerHeight-188))})
    }
    document.addEventListener('pointerdown', closeFromOutside, true)
    document.addEventListener('keydown', closeFromKeyboard)
    window.addEventListener('resize', closeFromViewportChange)
    window.addEventListener('scroll', closeFromViewportChange, true)
    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('pointerdown', closeFromOutside, true)
      document.removeEventListener('keydown', closeFromKeyboard)
      window.removeEventListener('resize', closeFromViewportChange)
      window.removeEventListener('scroll', closeFromViewportChange, true)
    }
  }, [menuFolderId])

  const navigateFolderMenu = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not([disabled])'))
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      buttons[(index + direction + buttons.length) % buttons.length]?.focus()
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      buttons[event.key === 'Home' ? 0 : buttons.length - 1]?.focus()
    }
  }

  useEffect(() => {
    setMenuFolderId(null)
    setMenuPosition(null)
  }, [mode, teamName, openFolderName])

  const toggleFolderMenu = (folderId: number, trigger: HTMLButtonElement) => {
    if (menuFolderId === folderId) {
      closeFolderMenu()
      return
    }
    const rect = trigger.getBoundingClientRect()
    const menuWidth = 180
    const menuHeight = 180
    const viewportGap = 8
    const anchorGap = 10
    const left = Math.min(
      Math.max(viewportGap, rect.left),
      Math.max(viewportGap, window.innerWidth - menuWidth - viewportGap),
    )
    const preferredTop = rect.bottom + anchorGap
    const top = preferredTop + menuHeight <= window.innerHeight - viewportGap
      ? preferredTop
      : Math.max(viewportGap, rect.top - anchorGap - menuHeight)
    setMenuPosition({ left, top })
    setMenuFolderId(folderId)
  }

  const finishRename = (folder: FolderItem) => {
    const nextName = renameValue.trim()
    if (!nextName) {
      setRenameError('请输入文件夹名称')
      window.requestAnimationFrame(() => renameInputRef.current?.focus())
      return
    }
    if (nextName !== folder.name && !onRenameFolder(folder.id, nextName)) {
      setRenameError('名称未保存，请根据提示修改后重试')
      window.requestAnimationFrame(() => renameInputRef.current?.focus())
      return
    }
    setRenamingFolderId(null)
    setRenameValue('')
    setRenameError('')
    window.requestAnimationFrame(() => menuTriggerRefs.current.get(folder.id)?.focus())
  }

  const cancelRename = (folderId: number) => {
    setRenamingFolderId(null)
    setRenameValue('')
    setRenameError('')
    window.requestAnimationFrame(() => menuTriggerRefs.current.get(folderId)?.focus())
  }

  return (
    <section data-compliance-target={`research-${mode}`} className={`view view--space${mode === 'team' ? ' view--team' : ''}${emptyTeam ? ' view--empty-team' : ''}`}>
      <header className="view-header view-header--actions space-toolbar">
        <div className="header-actions">
          <details className="create-dropdown"><summary className="button button--primary">新建 ▾</summary><div className="create-dropdown-menu">
            <button type="button" onClick={(event) => { event.currentTarget.closest('details')?.removeAttribute('open'); onNewFolder() }}>新建在线文件夹</button>
            <button type="button" onClick={(event) => { event.currentTarget.closest('details')?.removeAttribute('open'); onNewDocument() }}>新建在线文档</button>
            <button type="button" onClick={(event) => { event.currentTarget.closest('details')?.removeAttribute('open'); onNewTable() }}>新建在线表格</button>
          </div></details>
          <button className="button button--secondary" type="button" onClick={onImportDocument}>上传</button>
          {mode === 'team' && onManageSpace && <button className="button button--secondary" type="button" onClick={onManageSpace}>空间管理 <span className="space-admin-info" title="此功能仅对管理员开放，其他成员不可见。" aria-label="此功能仅对管理员开放，其他成员不可见。">ⓘ</span></button>}
        </div>
        {mode === 'personal' && <div className="space-inline-note" role="note">🔒 个人空间仅你可见；除非主动分享，文件与文件夹不会进入团队空间。</div>}
      </header>
      <div className={`view-body space-body${openFolderName ? ' space-body--folder' : ''}${emptyTeam ? ' space-body--empty' : ''}`}>
        {openFolderName && <nav className="folder-breadcrumb" aria-label="文件夹路径"><button type="button" onClick={onBack}>{label}</button><span>/</span><strong>{openFolderName}</strong></nav>}
        <DocumentTable
          folderEntries={folders.filter((folder) => (folder.location ?? locationRoot) === `${locationRoot}${openFolderName ? '/' + openFolderName : ''}`).map((folder) => ({
            key: `folder:${mode}:${folder.id}`,
            item: { id: -folder.id, title: folder.name, location: folder.location ?? locationRoot, owner: folder.owner ?? '当前用户', createdAt: folder.createdAt ?? folder.updatedAt, updatedAt: folderUpdatedAt(folder, documents.filter((item) => item.location === `${folder.location ?? locationRoot}/${folder.name}`)), visitedAt: '', size: aggregateSize(documents.filter((item) => item.location.startsWith(`${folder.location ?? locationRoot}/${folder.name}/`) || item.location === `${folder.location ?? locationRoot}/${folder.name}`)), kind: '在线文档', favorite: false, owned: true, shared: false },
            onOpen: () => onOpenFolder(folder),
            title: renamingFolderId === folder.id ? <form className="document-rename-form" onSubmit={(event) => { event.preventDefault(); finishRename(folder) }}><input ref={renameInputRef} autoFocus aria-label="文件夹新名称" value={renameValue} onChange={(event) => setRenameValue(event.target.value)} /><button type="submit">保存</button><button type="button" onClick={() => cancelRename(folder.id)}>取消</button>{renameError && <span role="alert">{renameError}</span>}</form> : undefined,
            actions: <><button data-focus-id="research-folder-pin" type="button" onClick={() => onToggleQuickAccess(`folder:${mode}:${folder.id}`)}>{quickAccess.includes(`folder:${mode}:${folder.id}`) ? '从快速访问中移除' : '加入快速访问'}</button><button type="button" onClick={() => onToggleQuickAccess(`favorite-folder:${mode}:${folder.id}`)}>{quickAccess.includes(`favorite-folder:${mode}:${folder.id}`) ? '取消收藏' : '收藏'}</button><button type="button" className="more-button" ref={(node) => { if (node) menuTriggerRefs.current.set(folder.id, node); else menuTriggerRefs.current.delete(folder.id) }} aria-label={`${folder.name}更多操作`} aria-haspopup="menu" aria-expanded={menuFolderId === folder.id} onClick={(event) => toggleFolderMenu(folder.id, event.currentTarget)}><span className="more-dots" aria-hidden="true"><i /><i /><i /></span></button></>,
          }))}
          quickAccess={quickAccess} onToggleQuickAccess={onToggleQuickAccess}
          documents={visibleDocuments} mode="space" page={page} onPageChange={onPageChange}
          onToggleFavorite={onToggleFavorite} onDelete={onDelete} onShare={onShare}
          onRename={onRenameDocument} onCreateNote={onCreateNote} onOpenDocument={onOpenDocument} onDownloadDocument={onDownloadDocument}
        />
      </div>
      {menuFolderId != null && menuPosition && (() => {
        const folder = folders.find((item) => item.id === menuFolderId)
        if (!folder) return null
        return createPortal(
          <div
            ref={menuRef}
            className="folder-menu folder-menu--portal"
            role="menu"
            aria-label={`${folder.name}操作`}
            style={{ left: menuPosition.left, top: menuPosition.top }}
            onKeyDown={navigateFolderMenu}
          >
            <button type="button" role="menuitem" onClick={() => { closeFolderMenu(); onOpenFolder(folder) }}>查看</button>
            <button type="button" role="menuitem" onClick={() => { closeFolderMenu(); onToggleQuickAccess(`folder:${mode}:${folder.id}`) }}>{quickAccess.includes(`folder:${mode}:${folder.id}`) ? '从快速访问中移除' : '加入快速访问'}</button>
            <button type="button" role="menuitem" onClick={() => { closeFolderMenu(); setRenamingFolderId(folder.id); setRenameValue(folder.name); setRenameError('') }}>重命名</button>
            <button type="button" role="menuitem" className="danger-link" onClick={() => {
              closeFolderMenu()
              menuTriggerRefs.current.get(folder.id)?.focus()
              onDeleteFolder(folder.id)
            }}>删除</button>
          </div>,
          document.body,
        )
      })()}
    </section>
  )
}
