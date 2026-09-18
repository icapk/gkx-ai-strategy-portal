import { Fragment, useMemo, useState } from 'react'
import { useAudit } from './AuditContext'
import { countPoints, filterLeaf, labels, leaves, statuses, toggleStatus, type Counts, type Leaf, type Point, type Status } from './model'
import type { AuditModule } from './targets'
import requirementReviews from './requirementReviews.json'
import progress from './review/progress.json'
import { pointLocations } from './locations'

function Highlight({ text, query }: { text: string; query: string }) {
  const term = query.trim().toLocaleLowerCase()
  if (!term) return <>{text}</>
  const parts = []
  let cursor = 0
  let found = text.toLocaleLowerCase().indexOf(term)
  while (found !== -1) {
    parts.push(<Fragment key={cursor}>{text.slice(cursor, found)}<mark>{text.slice(found, found + term.length)}</mark></Fragment>)
    cursor = found + term.length
    found = text.toLocaleLowerCase().indexOf(term, cursor)
  }
  return <>{parts}{text.slice(cursor)}</>
}

export function StatusFilterBar({ counts, value, onChange, compact = false, scope }: { counts: Counts; value: Status[]; onChange: (value: Status[]) => void; compact?: boolean; scope: string }) {
  return <div className={`audit-status-filters${compact ? ' audit-status-filters--compact' : ''}`} role="group" aria-label={`${scope}状态筛选`}>
    {(['all', ...statuses] as const).map(status => <button key={status} type="button" className={`audit-status audit-status--${status}`} title={`${labels[status]} ${counts[status]}`} aria-label={`${scope} ${labels[status]} ${counts[status]}`} aria-pressed={status === 'all' ? !value.length : value.includes(status)} disabled={!counts[status]} onClick={event => { event.stopPropagation(); onChange(toggleStatus(value, status)) }}>
      {!compact && <span>{labels[status]}</span>}<b>{counts[status]}</b>
    </button>)}
  </div>
}

function Fold({ name, open, onToggle }: { name: string; open: boolean; onToggle: () => void }) {
  return <button type="button" className="audit-fold" aria-label={`${open ? '收起' : '展开'}${name}`} aria-expanded={open} onClick={event => { event.stopPropagation(); onToggle() }}><span className={open ? 'is-open' : ''} aria-hidden="true">›</span></button>
}

interface ModuleState { query: string; global: Status[]; level4: Status[]; branches: Record<string, Status[]>; closed: Record<string, boolean> }
const initialState = (): ModuleState => ({ query: '', global: [], level4: [], branches: {}, closed: {} })

export function ComplianceAuditSidebar() {
  const [module, setModule] = useState<AuditModule>('research')
  const [collapsed, setCollapsed] = useState(() => new URLSearchParams(window.location.search).get('audit') === 'independent')
  const [states, setStates] = useState<Record<AuditModule, ModuleState>>({ research: initialState(), reading: initialState() })
  const { navigate } = useAudit()
  const locate: typeof navigate = (targetId, label, missing, location, pointCode) => {
    navigate(targetId, label, missing, location, pointCode)
    if (window.matchMedia('(max-width: 700px)').matches) setCollapsed(true)
  }
  const state = states[module]
  const moduleName = module === 'research' ? '智能科研' : '智能阅读'
  const moduleLeaves = useMemo(() => leaves.filter(leaf => leaf.module === module), [module])
  const groups = useMemo(() => [...new Set(moduleLeaves.map(leaf => leaf.level5))].map(name => ({ name, leaves: moduleLeaves.filter(leaf => leaf.level5 === name) })), [moduleLeaves])
  const counts = countPoints(moduleLeaves.flatMap(leaf => leaf.points))
  const update = (patch: Partial<ModuleState>, expand = false) => setStates(current => ({ ...current, [module]: { ...current[module], ...patch, ...(expand ? { closed: {} } : {}) } }))
  const fold = (key: string) => update({ closed: { ...state.closed, [key]: !state.closed[key] } })
  const visible = (leaf: Leaf) => filterLeaf(leaf, state.global, state.level4, state.branches[leaf.level5] ?? [], state.query)
  const visibleCount = moduleLeaves.reduce((sum, leaf) => sum + visible(leaf).length, 0)
  const reviewProgress = progress as Record<string, { state: string }>
  const pointLink = (point: Point) => locate(point.assessment.targetId, `${point.code} ${point.title.split('：')[0]}`, point.assessment.status === 'noncompliant', pointLocations[point.code], point.code)
  const switchModule = (next: AuditModule) => { setModule(next); navigate(next === 'research' ? 'research-workbench' : 'reading-reader', next === 'research' ? '智能科研' : '智能阅读') }
  return <aside className={`audit-sidebar${collapsed ? ' is-collapsed' : ''}`} aria-label="合规审查">
    {collapsed ? <div className="audit-rail"><button type="button" aria-label="展开合规审查侧栏" onClick={() => setCollapsed(false)}>»</button><span>合规审核</span></div> : <>
      <header className="audit-sidebar-heading"><div><strong>合规审查</strong><span>需求与当前原型对照</span></div><button type="button" aria-label="收起合规审查侧栏" onClick={() => setCollapsed(true)}>«</button></header>
      <div className="audit-version-notice" role="note"><strong>历史审查基线</strong><span>以下结论适用于旧版原型；线上新版尚未逐项复验。</span></div>
      <div className="audit-controls">
        <div className="audit-search"><input aria-label="搜索审核功能" placeholder="搜索编号、功能、页面或需规" value={state.query} onChange={event => update({ query: event.target.value }, true)} />{state.query && <button type="button" aria-label="清空审核搜索" onClick={() => update({ query: '' }, true)}>×</button>}</div>
        <div className="audit-modules" role="group" aria-label="审核模块">{(['research', 'reading'] as const).map(item => <button type="button" key={item} aria-pressed={item === module} onClick={() => switchModule(item)}>{item === 'research' ? '智能科研' : '智能阅读'}<b>{countPoints(leaves.filter(leaf => leaf.module === item).flatMap(leaf => leaf.points)).all}</b></button>)}</div>
        <StatusFilterBar scope="全局" counts={counts} value={state.global} onChange={global => update({ global }, true)} />
        <div className="audit-result-summary"><span>显示 {visibleCount} / {counts.all} 个功能点</span><button type="button" onClick={() => update(initialState())}>重置筛选</button></div>
      </div>
      <div className="audit-tree" aria-label={`${moduleName}审核目录`}>
        <div className="audit-level4 audit-heading-row">
          <Fold name={moduleName} open={!state.closed.level4} onToggle={() => fold('level4')} />
          <button className="audit-heading-link" type="button" onClick={() => locate(module === 'research' ? 'research-workbench' : 'reading-reader', moduleName)}><Highlight text={moduleName} query={state.query} /></button>
          <StatusFilterBar compact scope="四级" counts={counts} value={state.level4} onChange={level4 => update({ level4 }, true)} />
        </div>
        {!state.closed.level4 && groups.map(group => {
          const children = group.leaves.map(leaf => ({ leaf, points: visible(leaf) })).filter(child => child.points.length)
          if (!children.length) return null
          return <section className="audit-level5" key={group.name} data-audit-level5={group.name}>
            <div className="audit-heading-row">
              <Fold name={group.name} open={!state.closed[group.name]} onToggle={() => fold(group.name)} />
              <button className="audit-heading-link" type="button" onClick={() => locate(group.leaves[0].targetId, group.name)}><Highlight text={group.name} query={state.query} /></button>
              <StatusFilterBar compact scope={group.name} counts={countPoints(group.leaves.flatMap(leaf => leaf.points))} value={state.branches[group.name] ?? []} onChange={value => update({ branches: { ...state.branches, [group.name]: value } }, true)} />
            </div>
            {!state.closed[group.name] && children.map(({ leaf, points }) => <section className="audit-level6" key={leaf.id} data-audit-leaf={leaf.id}>
              <div className="audit-heading-row"><Fold name={`${leaf.id}六级功能`} open={!state.closed[leaf.id]} onToggle={() => fold(leaf.id)} /><button className="audit-heading-link" type="button" onClick={() => locate(leaf.targetId, `${leaf.level5} / ${leaf.level6}`)}><Highlight text={leaf.level6 === '/' ? '通用功能（六级：/）' : leaf.level6} query={state.query} /></button></div>
              {!state.closed[leaf.id] && <div className="audit-leaf-body">
                {leaf.pages.map(page => <button className="audit-page-link" type="button" key={page} onClick={() => locate(leaf.targetId, page)}>页面 · <Highlight text={page} query={state.query} /></button>)}
                <p className="audit-requirement"><b>需规描述</b><Highlight text={leaf.requirement} query={state.query} /></p>
                <p className="audit-requirement-review"><b>需规整体核查</b>{requirementReviews[leaf.id as keyof typeof requirementReviews]}</p>
                <div className="audit-points-heading"><Fold name={`${leaf.id}功能点列表`} open={!state.closed[`${leaf.id}-points`]} onToggle={() => fold(`${leaf.id}-points`)} /><span>功能点列表 · {points.length}</span></div>
                {!state.closed[`${leaf.id}-points`] && <ul className="audit-points">{points.map(point => <li key={point.code} data-audit-code={point.code} data-audit-status={point.assessment.status}>
                  <button className={`audit-point audit-point--${point.assessment.status}`} type="button" onClick={() => pointLink(point)}><span className="audit-point-meta"><b>{labels[point.assessment.status]}</b><span><Highlight text={point.code} query={state.query} /></span></span><span className="audit-point-title"><Highlight text={point.title} query={state.query} /></span></button>
                  <small className="audit-review-state">{reviewProgress[point.code]?.state === 'verified' ? '独立复审 · 已复验' : reviewProgress[point.code]?.state === 'applied' ? '独立复审 · 待复验' : '旧结论 · 尚未独立复审'}</small>
                  <p className="audit-reason">{point.assessment.reason}</p><small className="audit-evidence">证据：{point.assessment.evidence} · 需求表第 {point.sourceRow} 行</small>
                </li>)}</ul>}
              </div>}
            </section>)}
          </section>
        })}
        {!visibleCount && <div className="audit-empty">没有匹配的功能点。<button type="button" onClick={() => update(initialState())}>清除全部筛选</button></div>}
      </div>
      <footer className="audit-sidebar-footer">旧版审查记录 · 新版定位仅供复核，不代表重新验收</footer>
    </>}
  </aside>
}

