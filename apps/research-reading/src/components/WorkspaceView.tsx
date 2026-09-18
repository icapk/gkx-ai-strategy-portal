import { useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { FolderItem, ResearchDocument, WorkbenchTab } from '../types'
import { DocumentTable } from './DocumentTable'
import { QuickFolderActions } from './QuickFolderActions'

const tabs: Array<{ id: WorkbenchTab; label: string }> = [
  { id: 'quick', label: '快速访问' },
  { id: 'recent', label: '最近浏览' },
  { id: 'favorites', label: '我的收藏' },
]

interface WorkspaceViewProps {
  onLanguageChange?: (id:number,language:'zh'|'en')=>void
  onNew: () => void
  onNewTable: () => void
  onUpload: () => void
  onSearchOpen: () => void
  quickAccess: string[]
  onToggleQuickAccess: (key: string) => void
  quickFolders: (FolderItem & { scope: 'personal' | 'team' })[]
  onOpenQuickFolder: (folder: FolderItem & { scope: 'personal' | 'team' }) => void
  documents: ResearchDocument[]
  tab: WorkbenchTab
  page: number
  onTabChange: (tab: WorkbenchTab) => void
  onPageChange: (page: number) => void
  onToggleFavorite: (id: number) => void
  onDelete: (id: number) => void
  onShare: (id: number) => void
  onRemoveRecent?: (id: number) => void
  onDownloadDocument: (documentItem: ResearchDocument) => void
  onOpenDocument: (documentItem: ResearchDocument) => void
  highlightedDocumentId?: number | null
}

export function WorkspaceView({
  onLanguageChange,
  onNew, onNewTable, onUpload,
  onSearchOpen,
  quickAccess, onToggleQuickAccess, quickFolders, onOpenQuickFolder,
  documents,
  tab,
  page,
  onTabChange,
  onPageChange,
  onToggleFavorite,
  onDelete,
  onShare,
  onRemoveRecent,
  onDownloadDocument,
  onOpenDocument,
  highlightedDocumentId,
}: WorkspaceViewProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeTabIndex = tabs.findIndex((item) => item.id === tab)

  const selectTabAt = (index: number) => {
    const nextIndex = (index + tabs.length) % tabs.length
    const nextTab = tabs[nextIndex]
    onTabChange(nextTab.id)
    tabRefs.current[nextIndex]?.focus()
  }

  const handleTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      selectTabAt(index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      selectTabAt(index - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      selectTabAt(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      selectTabAt(tabs.length - 1)
    }
  }

  return (
    <section data-compliance-target="research-workbench" className="view view--workbench">
      <div data-compliance-target={`research-${tab}`} className="view-body workbench-body">
        <div className="workbench-create"><button onClick={onNew}>新建文档</button><button onClick={onNewTable}>新建表格</button><button onClick={onUpload}>上传文件</button><span>保存至个人空间；最近浏览保留一个月。</span></div><div className="workbench-controls"><div className="subtabs" role="tablist" aria-label="工作台筛选" aria-orientation="horizontal">
          {tabs.map((item, index) => (
            <button
              type="button"
              key={item.id}
              id={`workbench-tab-${item.id}`}
              ref={(node) => { tabRefs.current[index] = node }}
              className={tab === item.id ? 'is-active' : ''}
              role="tab"
              aria-selected={tab === item.id}
              aria-controls="workbench-panel"
              tabIndex={tab === item.id ? 0 : -1}
              onClick={() => onTabChange(item.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button className="global-search-trigger" type="button" aria-label="全文搜索笔记和文档" aria-haspopup="dialog" aria-keyshortcuts="Meta+K Control+K" onClick={onSearchOpen}><img src="/assets/reading/search.svg" alt=""/><span>搜索笔记、文档</span><kbd>⌘ K</kbd></button>
        </div>
        <div
          className="workbench-tabpanel"
          id="workbench-panel"
          role="tabpanel"
          aria-labelledby={`workbench-tab-${tabs[activeTabIndex]?.id ?? tab}`}
        >
          <DocumentTable onLanguageChange={onLanguageChange} onDownloadDocument={onDownloadDocument}
            folderEntries={tab === 'quick' || tab === 'favorites' ? quickFolders.map((folder) => ({ key: `folder:${folder.scope}:${folder.id}`, item: { id: -(folder.id * 2 + (folder.scope === 'team' ? 1 : 0)), title: folder.name, location: folder.location ?? '我的空间', owner: folder.owner ?? '当前用户', createdAt: folder.createdAt ?? folder.updatedAt, updatedAt: folder.updatedAt, visitedAt: '', size: folder.size ?? '0 B', kind: '在线文档', favorite: false, owned: true, shared: false }, onOpen: () => onOpenQuickFolder(folder), actions: <QuickFolderActions name={folder.name} isFavoriteTab={tab==='favorites'} favorite={quickAccess.includes(`favorite-folder:${folder.scope}:${folder.id}`)} onOpen={()=>onOpenQuickFolder(folder)} onUnpin={()=>onToggleQuickAccess(`folder:${folder.scope}:${folder.id}`)} onFavorite={()=>onToggleQuickAccess(`favorite-folder:${folder.scope}:${folder.id}`)}/> })) : []}
            quickAccess={quickAccess}
            onToggleQuickAccess={onToggleQuickAccess}
            documents={documents}
            mode="workbench"
            workbenchTab={tab}
            page={page}
            onPageChange={onPageChange}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDelete}
            onShare={onShare}
            onRemoveRecent={onRemoveRecent}
            onOpenDocument={onOpenDocument}
            highlightedDocumentId={highlightedDocumentId}
          />
        </div>
      </div>
    </section>
  )
}
