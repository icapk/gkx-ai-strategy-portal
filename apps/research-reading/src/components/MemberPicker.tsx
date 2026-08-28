import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'

export type CandidateRole = '查看员' | '编辑者' | '管理员'

export interface MemberCandidate {
  id: string
  name: string
  email: string
  date: string
  color: string
}

interface MemberPickerProps {
  candidates: MemberCandidate[]
  selectedIds: string[]
  roles: Record<string, CandidateRole>
  search: string
  onSearchChange: (value: string) => void
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onRoleChange: (id: string, role: CandidateRole) => void
}

const roleOptions: CandidateRole[] = ['管理员', '编辑者', '查看员']
const roleMenuHeight = 104

export function MemberPicker({
  candidates,
  selectedIds,
  roles,
  search,
  onSearchChange,
  onToggle,
  onRemove,
  onRoleChange,
}: MemberPickerProps) {
  const [openRoleId, setOpenRoleId] = useState<string | null>(null)
  const [roleMenuPlacement, setRoleMenuPlacement] = useState<'up' | 'down'>('down')
  const roleTriggerRefs = useRef(new Map<string, HTMLButtonElement>())
  const roleMenuRef = useRef<HTMLSpanElement | null>(null)
  const normalizedSearch = search.trim().toLocaleLowerCase()
  const filteredCandidates = useMemo(() => candidates.filter((candidate) => (
    !normalizedSearch
    || candidate.name.toLocaleLowerCase().includes(normalizedSearch)
    || candidate.email.toLocaleLowerCase().includes(normalizedSearch)
  )), [candidates, normalizedSearch])
  const selectedCandidates = candidates.filter((candidate) => selectedIds.includes(candidate.id))

  useEffect(() => {
    if (openRoleId == null) return
    const closeRoleMenu = () => setOpenRoleId(null)
    window.addEventListener('click', closeRoleMenu)
    return () => window.removeEventListener('click', closeRoleMenu)
  }, [openRoleId])

  useEffect(() => {
    if (openRoleId == null || selectedIds.includes(openRoleId)) return
    setOpenRoleId(null)
  }, [openRoleId, selectedIds])

  useEffect(() => {
    if (openRoleId == null) return
    const currentRole = roles[openRoleId] ?? '查看员'
    const currentOption = roleMenuRef.current?.querySelector<HTMLButtonElement>(`button[data-role="${currentRole}"]`)
    currentOption?.focus()
  }, [openRoleId, roles])

  const closeRoleMenu = (restoreFocus = false) => {
    const trigger = openRoleId == null ? null : roleTriggerRefs.current.get(openRoleId)
    setOpenRoleId(null)
    if (restoreFocus) window.requestAnimationFrame(() => trigger?.focus())
  }

  const openRoleMenu = (id: string, trigger: HTMLButtonElement) => {
    const list = trigger.closest('.selected-member-list')
    const listRect = list?.getBoundingClientRect()
    const triggerRect = trigger.getBoundingClientRect()
    const availableBelow = listRect ? listRect.bottom - triggerRect.bottom : roleMenuHeight
    const availableAbove = listRect ? triggerRect.top - listRect.top : 0
    setRoleMenuPlacement(availableBelow < roleMenuHeight && availableAbove > availableBelow ? 'up' : 'down')
    setOpenRoleId(id)
  }

  const handleRoleMenuKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    const options = Array.from(roleMenuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [])
    const currentIndex = options.indexOf(document.activeElement as HTMLButtonElement)
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      closeRoleMenu(true)
      return
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) || options.length === 0) return
    event.preventDefault()
    event.stopPropagation()
    if (event.key === 'Home') options[0]?.focus()
    else if (event.key === 'End') options.at(-1)?.focus()
    else {
      const direction = event.key === 'ArrowDown' ? 1 : -1
      const nextIndex = (Math.max(currentIndex, 0) + direction + options.length) % options.length
      options[nextIndex]?.focus()
    }
  }

  return (
    <div className="member-selector" aria-label="成员选择区域">
      <section className="member-selector-column member-selector-candidates" aria-label="全部成员">
        <input
          className="text-field member-search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return
            event.preventDefault()
            event.stopPropagation()
          }}
          placeholder="请输入"
          aria-label="搜索成员"
          autoFocus
        />
        <h3>全部成员·80人</h3>
        <div className="candidate-list" role="list">
          {filteredCandidates.map((candidate) => {
            const selected = selectedIds.includes(candidate.id)
            return (
              <button
                className={`candidate-row${selected ? ' is-selected' : ''}`}
                type="button"
                role="checkbox"
                aria-checked={selected}
                key={candidate.id}
                onClick={() => onToggle(candidate.id)}
              >
                <span className="member-checkbox" aria-hidden="true">
                  {selected && <img src="/assets/figma/checkbox-check.svg" alt="" />}
                </span>
                <span className="member-avatar" style={{ background: candidate.color }}>{candidate.name[0]}</span>
                <span className="member-identity"><strong>{candidate.name}</strong><small>{candidate.email}</small></span>
              </button>
            )
          })}
        </div>
      </section>
      <section className="member-selector-column member-selector-selected" aria-label="已选成员">
        <h3>已选：<b>{selectedCandidates.length}</b> 人</h3>
        <div className="selected-member-list" role="list">
          {selectedCandidates.map((candidate) => {
            const role = roles[candidate.id] ?? '查看员'
            return (
              <article key={candidate.id} role="listitem">
                <span className="member-avatar" style={{ background: candidate.color }}>{candidate.name[0]}</span>
                <span className="member-identity"><strong>{candidate.name}</strong><small>{candidate.email}</small></span>
                <span className="selected-member-controls">
                  <button className="selected-member-remove" type="button" aria-label={`移除${candidate.name}`} onClick={() => onRemove(candidate.id)}>
                    <img src="/assets/figma/modal-close.svg" alt="" />
                  </button>
                  <span className="selected-member-role-wrap">
                    <button
                      className="selected-member-role"
                      type="button"
                      aria-label={`${candidate.name}管理员角色配置，当前${role}`}
                      aria-expanded={openRoleId === candidate.id}
                      aria-haspopup="menu"
                      aria-controls={`member-role-menu-${candidate.id}`}
                      ref={(node) => {
                        if (node) roleTriggerRefs.current.set(candidate.id, node)
                        else roleTriggerRefs.current.delete(candidate.id)
                      }}
                      onClick={(event) => {
                        event.stopPropagation()
                        if (openRoleId === candidate.id) closeRoleMenu()
                        else openRoleMenu(candidate.id, event.currentTarget)
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape' && openRoleId === candidate.id) {
                          event.preventDefault()
                          event.stopPropagation()
                          closeRoleMenu(true)
                        } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                          event.preventDefault()
                          event.stopPropagation()
                          openRoleMenu(candidate.id, event.currentTarget)
                        }
                      }}
                    >
                      <span className="selected-member-role-label">{role}</span>
                      <span className="selected-member-role-chevron" aria-hidden="true">
                        <img src="/assets/figma/role-chevron.svg" alt="" />
                      </span>
                    </button>
                    {openRoleId === candidate.id && (
                      <span
                        className={`selected-member-role-menu${roleMenuPlacement === 'up' ? ' is-up' : ''}`}
                        id={`member-role-menu-${candidate.id}`}
                        ref={roleMenuRef}
                        role="menu"
                        aria-label={`管理员角色配置：${candidate.name}`}
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={handleRoleMenuKeyDown}
                      >
                        {roleOptions.map((option) => (
                          <button
                            type="button"
                            role="menuitemradio"
                            aria-checked={role === option}
                            data-role={option}
                            className={role === option ? 'is-current' : ''}
                            key={option}
                            onClick={() => {
                              onRoleChange(candidate.id, option)
                              closeRoleMenu(true)
                            }}
                          >{option}</button>
                        ))}
                      </span>
                    )}
                  </span>
                </span>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
