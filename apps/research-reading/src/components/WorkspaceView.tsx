import { useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { ResearchDocument, WorkbenchTab } from '../types'
import { DocumentTable } from './DocumentTable'

const tabs: Array<{ id: WorkbenchTab; label: string }> = [
  { id: 'recent', label: '最近浏览' },
  { id: 'favorites', label: '我的收藏' },
  { id: 'owned', label: '归我所有' },
  { id: 'shared', label: '与我共享' },
]

interface WorkspaceViewProps {
  documents: ResearchDocument[]
  tab: WorkbenchTab
  page: number
  onTabChange: (tab: WorkbenchTab) => void
  onPageChange: (page: number) => void
  onToggleFavorite: (id: number) => void
  onDelete: (id: number) => void
  onShare: (id: number) => void
  onRemoveRecent?: (id: number) => void
  onOpenDocument: (documentItem: ResearchDocument) => void
  onOpenDataTableHub: () => void
  dataTableCount: number
  dataRecordCount: number
  highlightedDocumentId?: number | null
}

export function WorkspaceView({
  documents,
  tab,
  page,
  onTabChange,
  onPageChange,
  onToggleFavorite,
  onDelete,
  onShare,
  onRemoveRecent,
  onOpenDocument,
  onOpenDataTableHub,
  dataTableCount,
  dataRecordCount,
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
    <section className="view view--workbench">
      <header className="view-header">
        <h1><span className="title-accent" />工作台</h1>
        <button className="workbench-data-hub-entry" type="button" onClick={onOpenDataTableHub}>
          <img src="/assets/iconpark/grid-nine.svg" alt="" />
          <span><strong>数据表格</strong><small>{dataTableCount} 个表格 · {dataRecordCount} 条记录</small></span>
          <i aria-hidden="true">›</i>
        </button>
      </header>
      <div className="view-body workbench-body">
        <div className="subtabs" role="tablist" aria-label="工作台筛选" aria-orientation="horizontal">
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
        <div
          className="workbench-tabpanel"
          id="workbench-panel"
          role="tabpanel"
          aria-labelledby={`workbench-tab-${tabs[activeTabIndex]?.id ?? tab}`}
        >
          <DocumentTable
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
