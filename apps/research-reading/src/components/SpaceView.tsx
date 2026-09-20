import {QuickFolderActions} from './QuickFolderActions'
import {CreateActions} from './CreateActions'
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { downloadPdfArchive } from '../pdfArchive'
import type { FolderItem, ResearchDocument } from '../types'
import { DocumentTable } from './DocumentTable'

interface SpaceViewProps {
  onSearchOpen:()=>void
  onShareFolder:(folder:FolderItem)=>void
  onDownloadFolder:(folder:FolderItem)=>void
  onLanguageChange?: (id:number,language:'zh'|'en')=>void
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

const folderUpdatedAt = (folder: FolderItem, documents: ResearchDocument[]) => documents.reduce(
  (latest, documentItem) => {
    const candidate = documentItem.updatedAt ?? documentItem.createdAt
    return candidate > latest ? candidate : latest
  },
  folder.updatedAt,
)

export function SpaceView({
  onSearchOpen,onShareFolder,onDownloadFolder,onLanguageChange,
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
          <CreateActions onNewFolder={onNewFolder} onNewDocument={onNewDocument} onNewTable={onNewTable} onUpload={onImportDocument}/>
          {mode === 'team' && onManageSpace && <button className="button button--secondary" type="button" onClick={onManageSpace}>空间管理 <span className="space-admin-info" title="此功能仅对管理员开放，其他成员不可见。" aria-label="此功能仅对管理员开放，其他成员不可见。">ⓘ</span></button>}
        </div>
        <button className="global-search-trigger" type="button" aria-label="全文搜索笔记和文档" onClick={onSearchOpen}><img src="/assets/reading/search.svg" alt=""/><span>搜索笔记、文档</span><kbd>⌘ K</kbd></button>
        {mode === 'personal' && <div className="space-inline-note" role="note">🔒 个人空间仅你可见；除非主动分享，文件与文件夹不会进入团队空间。</div>}
      </header>
      <div className={`view-body space-body${openFolderName ? ' space-body--folder' : ''}${emptyTeam ? ' space-body--empty' : ''}`}>
        {openFolderName && <nav className="folder-breadcrumb" aria-label="文件夹路径"><button type="button" onClick={onBack}>{label}</button><span>/</span><strong>{openFolderName}</strong></nav>}
        <DocumentTable onLanguageChange={onLanguageChange}
          folderEntries={folders.filter((folder) => (folder.location ?? locationRoot) === `${locationRoot}${openFolderName ? '/' + openFolderName : ''}`).map((folder) => ({
            key: `folder:${mode}:${folder.id}`,
            item: { id: -folder.id, title: folder.name, location: folder.location ?? locationRoot, owner: folder.owner ?? '当前用户', createdAt: folder.createdAt ?? folder.updatedAt, updatedAt: folderUpdatedAt(folder, documents.filter((item) => item.location === `${folder.location ?? locationRoot}/${folder.name}`)), visitedAt: '', size: '-', kind: '在线文档', favorite: false, owned: true, shared: false },
            onOpen: () => onOpenFolder(folder),
            title: renamingFolderId === folder.id ? <form className="document-rename-form" onSubmit={(event) => { event.preventDefault(); finishRename(folder) }}><input ref={renameInputRef} autoFocus aria-label="文件夹新名称" value={renameValue} onChange={(event) => setRenameValue(event.target.value)} /><button type="submit">保存</button><button type="button" onClick={() => cancelRename(folder.id)}>取消</button>{renameError && <span role="alert">{renameError}</span>}</form> : undefined,
            actions: <QuickFolderActions name={folder.name} isFavoriteTab={false} onOpen={()=>onOpenFolder(folder)} pinned={quickAccess.includes(`folder:${mode}:${folder.id}`)} favorite={quickAccess.includes(`favorite-folder:${mode}:${folder.id}`)} onUnpin={()=>onToggleQuickAccess(`folder:${mode}:${folder.id}`)} onFavorite={()=>onToggleQuickAccess(`favorite-folder:${mode}:${folder.id}`)} onShare={()=>onShareFolder(folder)} onDownload={()=>onDownloadFolder(folder)} onDelete={()=>onDeleteFolder(folder.id)}/>,
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
