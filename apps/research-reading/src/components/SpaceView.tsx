import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { FolderItem, ResearchDocument } from '../types'
import { DocumentTable } from './DocumentTable'

interface SpaceViewProps {
  mode: 'personal' | 'team'
  teamName?: string
  folders: FolderItem[]
  documents: ResearchDocument[]
  openFolderName: string | null
  page: number
  onPageChange: (page: number) => void
  onOpenFolder: (folder: FolderItem) => void
  onRenameFolder: (id: number, name: string) => void
  onDeleteFolder: (id: number) => void
  onBack: () => void
  onNewFolder: () => void
  onNewDocument: () => void
  onImportDocument: () => void
  onToggleFavorite: (id: number) => void
  onDelete: (id: number) => void
  onShare: (id: number) => void
  onRenameDocument: (id: number, title: string) => void
  onCreateNote: (documentItem: ResearchDocument) => void
  emptyTeam?: boolean
}

export function SpaceView({
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
  onNewDocument,
  onImportDocument,
  onToggleFavorite,
  onDelete,
  onShare,
  onRenameDocument,
  onCreateNote,
  emptyTeam = false,
}: SpaceViewProps) {
  const label = mode === 'personal' ? '我的空间' : teamName ?? 'AI研究团队'
  const [menuFolderId, setMenuFolderId] = useState<number | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ left: number; top: number } | null>(null)
  const [renamingFolderId, setRenamingFolderId] = useState<number | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const menuRef = useRef<HTMLDivElement | null>(null)
  const menuTriggerRefs = useRef(new Map<number, HTMLButtonElement>())

  const closeFolderMenu = (restoreFocus = false) => {
    const trigger = menuFolderId == null ? null : menuTriggerRefs.current.get(menuFolderId)
    setMenuFolderId(null)
    setMenuPosition(null)
    if (restoreFocus) window.requestAnimationFrame(() => trigger?.focus())
  }

  useEffect(() => {
    if (menuFolderId === null) return
    const trigger = menuTriggerRefs.current.get(menuFolderId)
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
    const closeFromViewportChange = () => closeFolderMenu()
    document.addEventListener('pointerdown', closeFromOutside, true)
    document.addEventListener('keydown', closeFromKeyboard)
    window.addEventListener('resize', closeFromViewportChange)
    window.addEventListener('scroll', closeFromViewportChange, true)
    return () => {
      document.removeEventListener('pointerdown', closeFromOutside, true)
      document.removeEventListener('keydown', closeFromKeyboard)
      window.removeEventListener('resize', closeFromViewportChange)
      window.removeEventListener('scroll', closeFromViewportChange, true)
    }
  }, [menuFolderId])

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
    const menuWidth = 94
    const menuHeight = 140
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
    if (nextName && nextName !== folder.name) onRenameFolder(folder.id, nextName)
    setRenamingFolderId(null)
    setRenameValue('')
  }

  return (
    <section className={`view view--space${mode === 'team' ? ' view--team' : ''}${emptyTeam ? ' view--empty-team' : ''}`}>
      <header className="view-header view-header--actions">
        <h1>
          <span className="title-accent" />
          {mode === 'team' ? (
            <span className="breadcrumb"><span>团队空间</span><span>/</span><strong>{label}</strong></span>
          ) : label}
        </h1>
        <div className="header-actions">
          <button className="button button--secondary" type="button" onClick={onImportDocument}>导入文档</button>
          <button className="button button--secondary" type="button" onClick={onNewDocument}>新建在线文档</button>
          <button className="button button--primary" type="button" onClick={onNewFolder}><span className="button-plus icon-plus" aria-hidden="true" />新建文件夹</button>
        </div>
      </header>
      <div className={`view-body space-body${openFolderName ? ' space-body--folder' : ''}${emptyTeam ? ' space-body--empty' : ''}`}>
        {emptyTeam ? (
          <div className="empty-team-view">
            <div className="empty-team-actions">
              <button type="button" onClick={onImportDocument}><span className="empty-action-icon"><img src="/assets/action-pdf.svg" alt="" /></span><span><strong>导入</strong><small>导入PDF文档</small></span></button>
              <button type="button" onClick={onNewDocument}><span className="empty-action-icon"><img src="/assets/action-word.svg" alt="" /></span><span><strong>新建</strong><small>新建在线文档</small></span></button>
              <button type="button" onClick={onNewFolder}><span className="empty-action-icon"><img src="/assets/action-folder.svg" alt="" /></span><span><strong>添加</strong><small>添加文件夹</small></span></button>
              <button type="button"><span className="empty-action-icon"><img src="/assets/action-manage.svg" alt="" /></span><span><strong>管理</strong><small>管理团队空间</small></span></button>
            </div>
            <div className="empty-state">
              <img src="/assets/empty-team.svg" alt="" />
              <p>这里暂无数据，点击上面按钮增添内容</p>
            </div>
          </div>
        ) : !openFolderName ? (
          <section className="folder-section" aria-labelledby="folder-title">
            <h2 id="folder-title">文件夹</h2>
            <div className="folder-grid">
              {folders.map((folder) => (
                <article className={`folder-card${menuFolderId === folder.id ? ' is-selected' : ''}`} key={folder.id}>
                  {renamingFolderId === folder.id ? (
                    <div className="folder-open">
                      <img src={folder.id % 2 === 0 ? '/assets/folder-data.svg' : '/assets/folder-research.svg'} alt="" />
                      <input
                        className="folder-rename-input"
                        autoFocus
                        value={renameValue}
                        aria-label="文件夹新名称"
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => setRenameValue(event.target.value)}
                        onBlur={() => finishRename(folder)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') finishRename(folder)
                          if (event.key === 'Escape') setRenamingFolderId(null)
                        }}
                      />
                    </div>
                  ) : (
                    <button className="folder-open" type="button" onClick={() => onOpenFolder(folder)}>
                      <img src={folder.id % 2 === 0 ? '/assets/folder-data.svg' : '/assets/folder-research.svg'} alt="" />
                      <span className="folder-copy">
                        <strong>{folder.name}</strong>
                        <small>{folder.count} 个项目&nbsp; 更新于 {folder.updatedAt}</small>
                      </span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="folder-more"
                    ref={(node) => {
                      if (node) menuTriggerRefs.current.set(folder.id, node)
                      else menuTriggerRefs.current.delete(folder.id)
                    }}
                    aria-label={`${folder.name}更多操作`}
                    aria-haspopup="menu"
                    aria-expanded={menuFolderId === folder.id}
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleFolderMenu(folder.id, event.currentTarget)
                    }}
                  ><span className="more-dots" aria-hidden="true"><i /><i /><i /></span></button>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <nav className="folder-breadcrumb" aria-label="文件夹路径">
            <button type="button" onClick={onBack}>文件夹</button><span>/</span><button type="button" onClick={onBack}>{openFolderName}</button><span>/</span><strong>文档</strong>
          </nav>
        )}
        {!emptyTeam && <section className="documents-section" aria-labelledby="documents-title">
          {!openFolderName && <h2 id="documents-title">文档</h2>}
          <DocumentTable
            documents={documents}
            mode="space"
            page={page}
            onPageChange={onPageChange}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDelete}
            onShare={onShare}
            onRename={onRenameDocument}
            onCreateNote={onCreateNote}
          />
        </section>}
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
          >
            <button type="button" role="menuitem" onClick={() => { closeFolderMenu(); onOpenFolder(folder) }}>查看</button>
            <button type="button" role="menuitem" onClick={() => { closeFolderMenu(); setRenamingFolderId(folder.id); setRenameValue(folder.name) }}>重命名</button>
            <button type="button" role="menuitem" className="danger-link" onClick={() => { closeFolderMenu(); onDeleteFolder(folder.id) }}>删除</button>
          </div>,
          document.body,
        )
      })()}
    </section>
  )
}
