import type { Section } from '../types'

interface TopNavigationProps {
  activeSection: Section
  onSelect: (section: Section) => void
  onReadingSelect: () => void
  onProfileOpen: () => void
  profileName: string
  profileAvatar?: string | null
}

export function TopNavigation({
  onReadingSelect,
  onProfileOpen,
  profileName,
  profileAvatar,
}: TopNavigationProps) {
  return (
    <>
      <div className="product-row">
        <div className="product-tabs" role="tablist" aria-label="产品切换">
          <button className="product-tab product-tab--active" type="button" role="tab" aria-selected="true">
            智能科研
          </button>
          <span className="prototype-notice">演示模式 · 机构与协作权限为本地模拟</span>
        </div>
        <div className="top-utilities">
          <button
            data-compliance-target="research-profile"
            className="profile-button"
            type="button"
            aria-label={`打开个人信息设置（${profileName}）`}
            aria-haspopup="dialog"
            onClick={onProfileOpen}
          >
            <img className={profileAvatar ? 'is-custom-avatar' : undefined} src={profileAvatar || '/assets/avatar-user.svg'} alt="" />
          </button>
        </div>
      </div>

    </>
  )
}

interface SidebarProps {
  activeSection: Section
  activeTeam: string
  teamNames: string[]
  teamTreeExpanded: boolean
  onSectionSelect: (section: Section) => void
  onTeamTreeToggle: () => void
  onTeamSelect: (team: string) => void
  onNewTeam: () => void
}

const primaryItems: Array<{ section: Section; label: string }> = [
  { section: 'workbench', label: '工作台' },
  { section: 'personal', label: '个人空间' },
  { section: 'team', label: '团队空间' },
  { section: 'recycle', label: '回收站' },
]

export function Sidebar({
  activeSection,
  activeTeam,
  teamNames,
  teamTreeExpanded,
  onSectionSelect,
  onTeamTreeToggle,
  onTeamSelect,
  onNewTeam,
}: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="基础模块">
      <div className="sidebar-scroll">
        {primaryItems.map((item) => (
          <div className="sidebar-group" key={item.section}>
            <div className={item.section === 'team' ? 'sidebar-parent-row' : undefined}>
              <button
                type="button"
                className={`sidebar-item${activeSection === item.section && item.section !== 'team' ? ' is-active' : ''}${activeSection === item.section && item.section === 'team' ? ' is-parent-active' : ''}`}
                onClick={() => item.section === 'team' ? onTeamTreeToggle() : onSectionSelect(item.section)}
                aria-current={activeSection === item.section ? 'page' : undefined}
                aria-expanded={item.section === 'team' ? teamTreeExpanded : undefined}
                aria-controls={item.section === 'team' ? 'team-space-tree' : undefined}
              >
                <span>{item.label}</span>
                {item.section === 'team' && <img className={`sidebar-chevron${teamTreeExpanded ? ' is-open' : ''}`} src="/assets/direction-down.svg" alt="" />}
              </button>
              {item.section === 'team' && <button type="button" className="sidebar-team-add" aria-label="新增团队空间" onClick={onNewTeam}><span aria-hidden="true" /></button>}
            </div>
            {item.section === 'team' && (
              <div
                id="team-space-tree"
                className={`team-tree-disclosure${teamTreeExpanded ? ' is-open' : ''}`}
                aria-hidden={!teamTreeExpanded}
              >
                <div className="team-tree">
                  {teamNames.map((team) => (
                    <button
                      type="button"
                      key={team}
                      tabIndex={teamTreeExpanded ? undefined : -1}
                      className={`sidebar-item sidebar-item--child${activeTeam === team ? ' is-active' : ''}`}
                      onClick={() => onTeamSelect(team)}
                    >
                      {team}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
