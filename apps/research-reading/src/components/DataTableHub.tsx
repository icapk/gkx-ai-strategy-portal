import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { getResearchDataTableSearchText } from '../dataTableContent'
import type { ResearchDataTable, ResearchDocument } from '../types'
import { Modal } from './Modal'

type DataHubScope = 'all' | ResearchDataTable['template']
type DataHubStatus = '未开始' | '进行中' | '有风险' | '已完成' | '持续更新'

export interface DataTableHubTarget {
  documentId: number
  documentItem?: ResearchDocument
  table: ResearchDataTable
}

export interface DataTableHubProps {
  documents: ResearchDocument[]
  tables: ResearchDataTable[]
  currentUser: string
  suspended?: boolean
  onClose: () => void
  onOpenTable: (target: DataTableHubTarget) => void
  onCreateTable: () => void
  onImportToTable: (target: DataTableHubTarget) => void
  onShareTable: (target: DataTableHubTarget) => void
  onMoveToRecycle: (target: DataTableHubTarget) => void
}

interface DataHubTableItem extends DataTableHubTarget {
  title: string
  location: string
  owner: string
  searchText: string
  status: DataHubStatus
}

const scopeOptions: Array<{ value: DataHubScope; label: string }> = [
  { value: 'all', label: '全部表格' },
  { value: 'project-progress', label: '项目进度' },
  { value: 'research-data', label: '科研数据' },
]

const statusOptions: Array<'全部状态' | DataHubStatus> = [
  '全部状态',
  '有风险',
  '进行中',
  '持续更新',
  '已完成',
  '未开始',
]

const accessLabels: Record<ResearchDataTable['share']['access'], string> = {
  private: '仅自己可见',
  'team-view': '团队可查看',
  'team-edit': '团队可编辑',
}

const normalizedValue = (value: string) => value.normalize('NFC').trim().toLocaleLowerCase('zh-CN')
const shortDateTime = (value: string) => value.length >= 16 ? value.slice(0, 16) : value
const isCompletedStatus = (value: string) => /完成|已归档|结项/.test(value)
const isRiskStatus = (value: string) => /风险|阻塞|延期|失败/.test(value)
const isNotStartedStatus = (value: string) => /未开始|待开始|待处理/.test(value)

const getTableStatus = (table: ResearchDataTable): DataHubStatus => {
  if (!table.rows.length) return '未开始'
  if (table.template === 'research-data') return '持续更新'
  const statusColumn = table.columns.find((column) => column.type === 'select' && /状态|阶段/.test(column.name))
  if (!statusColumn) return '进行中'
  const statuses = table.rows.map((row) => row.values[statusColumn.id]?.trim() ?? '')
  if (statuses.some(isRiskStatus)) return '有风险'
  if (statuses.every(isCompletedStatus)) return '已完成'
  if (statuses.every((value) => !value || isNotStartedStatus(value))) return '未开始'
  return '进行中'
}

const getStatusClass = (status: DataHubStatus) => {
  if (status === '有风险') return 'risk'
  if (status === '已完成') return 'success'
  if (status === '未开始') return 'idle'
  if (status === '持续更新') return 'updating'
  return 'active'
}

export function DataTableHub({
  documents,
  tables,
  suspended = false,
  onClose,
  onOpenTable,
  onCreateTable,
  onImportToTable,
  onShareTable,
  onMoveToRecycle,
}: DataTableHubProps) {
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState<DataHubScope>('all')
  const [statusFilter, setStatusFilter] = useState<'全部状态' | DataHubStatus>('全部状态')
  const [recycleTarget, setRecycleTarget] = useState<DataHubTableItem | null>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const backButtonRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const menuTriggerRefs = useRef(new Map<number, HTMLButtonElement>())
  const openMenuIdRef = useRef(openMenuId)
  const onCloseRef = useRef(onClose)
  openMenuIdRef.current = openMenuId
  onCloseRef.current = onClose

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const frame = window.requestAnimationFrame(() => backButtonRef.current?.focus())
    const closeMenu = (restoreTriggerFocus: boolean) => {
      const menuId = openMenuIdRef.current
      if (menuId == null) return false
      setOpenMenuId(null)
      if (restoreTriggerFocus) window.requestAnimationFrame(() => menuTriggerRefs.current.get(menuId)?.focus())
      return true
    }
    const closeMenuFromOutside = (event: PointerEvent) => {
      const menuId = openMenuIdRef.current
      if (menuId == null) return
      const target = event.target as Node
      if (menuRef.current?.contains(target) || menuTriggerRefs.current.get(menuId)?.contains(target)) return
      closeMenu(false)
    }
    const closeMenuFromFocusChange = (event: FocusEvent) => {
      const menuId = openMenuIdRef.current
      if (menuId == null) return
      const target = event.target as Node
      if (menuRef.current?.contains(target) || menuTriggerRefs.current.get(menuId)?.contains(target)) return
      closeMenu(false)
    }
    const closeFromKeyboard = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      if (closeMenu(true)) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      if (document.querySelector('.modal-backdrop, .data-sheet-workspace')) return
      event.preventDefault()
      onCloseRef.current()
    }
    document.addEventListener('pointerdown', closeMenuFromOutside, true)
    document.addEventListener('focusin', closeMenuFromFocusChange)
    window.addEventListener('keydown', closeFromKeyboard)
    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('pointerdown', closeMenuFromOutside, true)
      document.removeEventListener('focusin', closeMenuFromFocusChange)
      window.removeEventListener('keydown', closeFromKeyboard)
      window.requestAnimationFrame(() => previouslyFocused?.focus())
    }
  }, [])

  useEffect(() => {
    if (openMenuId == null) return
    const frame = window.requestAnimationFrame(() => menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [openMenuId])

  const documentById = useMemo(
    () => new Map(documents.map((documentItem) => [documentItem.id, documentItem])),
    [documents],
  )

  const items = useMemo<DataHubTableItem[]>(() => tables.map((table) => {
    const documentItem = documentById.get(table.documentId)
    const title = documentItem?.title || `数据表格 #${table.documentId}`
    const location = documentItem?.location || '未关联空间'
    const owner = documentItem?.owner || table.updatedBy || '未知用户'
    return {
      documentId: table.documentId,
      documentItem,
      table,
      title,
      location,
      owner,
      status: getTableStatus(table),
      searchText: normalizedValue([title, location, owner, getResearchDataTableSearchText(table)].join(' ')),
    }
  }).sort((first, second) => (
    second.table.updatedAt.localeCompare(first.table.updatedAt, 'zh-CN')
    || first.title.localeCompare(second.title, 'zh-CN')
  )), [documentById, tables])

  const scopeCounts = useMemo(() => ({
    all: items.length,
    'project-progress': items.filter((item) => item.table.template === 'project-progress').length,
    'research-data': items.filter((item) => item.table.template === 'research-data').length,
  }), [items])

  const normalizedQuery = normalizedValue(query)
  const visibleItems = useMemo(() => items.filter((item) => {
    const matchesQuery = !normalizedQuery || item.searchText.includes(normalizedQuery)
    const matchesScope = scope === 'all' || item.table.template === scope
    const matchesStatus = statusFilter === '全部状态' || item.status === statusFilter
    return matchesQuery && matchesScope && matchesStatus
  }), [items, normalizedQuery, scope, statusFilter])

  useEffect(() => {
    if (openMenuId != null && !visibleItems.some((item) => item.documentId === openMenuId)) setOpenMenuId(null)
  }, [openMenuId, visibleItems])

  const clearFilters = () => {
    setQuery('')
    setScope('all')
    setStatusFilter('全部状态')
  }

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    const menuItems = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)'))
    if (!menuItems.length) return
    event.preventDefault()
    const currentIndex = menuItems.indexOf(document.activeElement as HTMLButtonElement)
    if (event.key === 'Home') menuItems[0].focus()
    else if (event.key === 'End') menuItems.at(-1)?.focus()
    else if (event.key === 'ArrowDown') menuItems[(currentIndex + 1 + menuItems.length) % menuItems.length].focus()
    else menuItems[(currentIndex - 1 + menuItems.length) % menuItems.length].focus()
  }

  const runMenuAction = (action: () => void) => {
    setOpenMenuId(null)
    action()
  }

  const confirmRecycle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!recycleTarget) return
    const target = recycleTarget
    setRecycleTarget(null)
    onMoveToRecycle(target)
  }

  const hubInert = recycleTarget ? true : undefined
  const hubDialogSuppressed = suspended || Boolean(recycleTarget)

  return (
    <section
      className="data-hub"
      role={hubDialogSuppressed ? undefined : 'dialog'}
      aria-modal={hubDialogSuppressed ? undefined : true}
      aria-labelledby={hubDialogSuppressed ? undefined : 'data-hub-title'}
      aria-hidden={suspended ? true : undefined}
      inert={suspended ? true : undefined}
    >
      <header className="data-hub-header" aria-hidden={hubInert} inert={hubInert}>
        <div className="data-hub-heading">
          <button ref={backButtonRef} className="data-hub-back" type="button" onClick={onClose}>
            <img src="/assets/iconpark/left.svg" alt="" />返回
          </button>
          <div><p className="data-hub-breadcrumb">工作台&nbsp;&nbsp;/&nbsp;&nbsp;数据表格</p><h1 id="data-hub-title">数据表格</h1></div>
        </div>
        <button className="button button--primary" type="button" onClick={onCreateTable}><span className="icon-plus" aria-hidden="true" />新建数据表格</button>
      </header>

      <div className="data-hub-body" aria-hidden={hubInert} inert={hubInert}>
        <section className="data-hub-library" aria-labelledby="data-hub-library-title">
          <header className="data-hub-section-header">
            <div><h2 id="data-hub-library-title">科研数据管理</h2><p>集中查看和管理科研项目数据、项目进度、导入文件与共享权限</p></div>
            <span>共 {items.length} 个表格</span>
          </header>

          <div className="data-hub-controls">
            <label className="data-hub-search">
              <span className="sr-only">搜索数据表格</span><img src="/assets/reading/search.svg" alt="" />
              <input type="search" value={query} maxLength={100} placeholder="搜索表格、记录、文件或成员" onChange={(event) => setQuery(event.target.value)} />
              {query && <button type="button" onClick={() => setQuery('')}>清空</button>}
            </label>
            <select aria-label="筛选项目状态" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}>
              {statusOptions.map((option) => <option value={option} key={option}>{option}</option>)}
            </select>
          </div>

          <div className="data-hub-scopes" role="group" aria-label="数据表格类型">
            {scopeOptions.map((option) => (
              <button className={scope === option.value ? 'is-active' : ''} type="button" aria-pressed={scope === option.value} onClick={() => setScope(option.value)} key={option.value}>
                {option.label}<span>{scopeCounts[option.value]}</span>
              </button>
            ))}
            <p role="status" aria-live="polite">当前显示 {visibleItems.length} 个数据表格</p>
          </div>

          {visibleItems.length ? (
            <div className="data-hub-table-scroll">
              <table className="data-hub-table">
                <thead><tr><th>名称</th><th>类型</th><th>状态</th><th>数据规模</th><th>共享权限</th><th>最近更新</th><th>操作</th></tr></thead>
                <tbody>{visibleItems.map((item) => (
                  <tr key={item.documentId}>
                    <td data-label="名称"><div className="data-hub-name-cell"><span aria-hidden="true"><img src="/assets/iconpark/grid-nine.svg" alt="" /></span><div><button type="button" onClick={() => onOpenTable(item)}>{item.title}</button><small>{item.location}</small></div></div></td>
                    <td data-label="类型">{item.table.template === 'project-progress' ? '项目进度' : '科研数据'}</td>
                    <td data-label="状态"><span className={`data-hub-status data-hub-status--${getStatusClass(item.status)}`}>{item.status}</span></td>
                    <td data-label="数据规模"><span>{item.table.rows.length} 条记录</span><small>{item.table.attachments.length} 个文件</small></td>
                    <td data-label="共享权限">{accessLabels[item.table.share.access]}</td>
                    <td data-label="最近更新"><time dateTime={item.table.updatedAt}>{shortDateTime(item.table.updatedAt)}</time><small>{item.table.updatedBy}</small></td>
                    <td data-label="操作">
                      <div className="data-hub-table-actions">
                        <button type="button" onClick={() => onOpenTable(item)}>打开</button>
                        <button type="button" onClick={() => onImportToTable(item)}>导入</button>
                        <div className="data-hub-more">
                          <button
                            ref={(node) => { if (node) menuTriggerRefs.current.set(item.documentId, node); else menuTriggerRefs.current.delete(item.documentId) }}
                            className="data-hub-more-trigger"
                            type="button"
                            aria-label={`${item.title}更多操作`}
                            aria-haspopup="menu"
                            aria-expanded={openMenuId === item.documentId}
                            aria-controls={`data-hub-menu-${item.documentId}`}
                            onClick={() => setOpenMenuId((current) => current === item.documentId ? null : item.documentId)}
                          ><img src="/assets/iconpark/more.svg" alt="" /></button>
                          {openMenuId === item.documentId && (
                            <div ref={menuRef} className="data-hub-more-menu" id={`data-hub-menu-${item.documentId}`} role="menu" aria-label={`${item.title}操作`} onKeyDown={handleMenuKeyDown}>
                              <button type="button" role="menuitem" onClick={() => runMenuAction(() => onShareTable(item))}><img src="/assets/iconpark/share.svg" alt="" />分享与权限</button>
                              <button className="danger-link" type="button" role="menuitem" onClick={() => runMenuAction(() => setRecycleTarget(item))}>移入回收站</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          ) : (
            <div className="data-hub-empty" role="status">
              <img src="/assets/iconpark/grid-nine.svg" alt="" />
              <h3>{items.length ? '未找到匹配的数据表格' : '还没有数据表格'}</h3>
              <p>{items.length ? '请更换搜索词或调整类型、状态筛选条件。' : '新建第一个表格，开始管理科研数据和项目进度。'}</p>
              <div>{items.length ? <button className="button button--secondary" type="button" onClick={clearFilters}>重置筛选</button> : null}<button className="button button--primary" type="button" onClick={onCreateTable}>新建数据表格</button></div>
            </div>
          )}
        </section>
      </div>

      {recycleTarget && (
        <Modal title="移入回收站" onClose={() => setRecycleTarget(null)} onSubmit={confirmRecycle} confirmText="移入回收站" confirmDanger>
          <div className="data-hub-recycle-confirm"><p>确定将“{recycleTarget.title}”移入回收站吗？</p><small>表格、记录和文件将一并移入回收站，之后可以从回收站恢复。</small></div>
        </Modal>
      )}
    </section>
  )
}
