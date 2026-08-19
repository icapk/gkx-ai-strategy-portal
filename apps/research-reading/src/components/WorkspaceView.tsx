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
}: WorkspaceViewProps) {
  return (
    <section className="view view--workbench">
      <header className="view-header">
        <h1><span className="title-accent" />工作台</h1>
      </header>
      <div className="view-body workbench-body">
        <div className="subtabs" role="tablist" aria-label="工作台筛选">
          {tabs.map((item) => (
            <button
              type="button"
              key={item.id}
              className={tab === item.id ? 'is-active' : ''}
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => onTabChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <DocumentTable
          documents={documents}
          mode="workbench"
          workbenchTab={tab}
          page={page}
          onPageChange={onPageChange}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
          onShare={onShare}
        />
      </div>
    </section>
  )
}

