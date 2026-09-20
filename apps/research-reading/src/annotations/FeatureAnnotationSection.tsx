import type { Annotation } from './model'
import type { AnnotationKind } from './uiTypes'
import './annotations.css'

export function FeatureAnnotationSection({ kind, id, items, onOpen, onCreate }: { kind: AnnotationKind; id: string; items: Annotation[]; onOpen: (id: string) => void; onCreate: () => void }) {
  const linked = items.filter(a => (kind === 'compliance' ? a.linkedG : a.linkedD).includes(id))
  const active = linked.filter(a => a.status !== '已完结'), completed = linked.filter(a => a.status === '已完结').sort((a, b) => (a.completedAt ?? a.updatedAt).localeCompare(b.completedAt ?? b.updatedAt) || a.id.localeCompare(b.id))
  return <section className="feature-annotations"><div className="annotation-tools"><h3>关联注释</h3><button onClick={onCreate}>加注释</button></div>{active.length ? active.map(a => <button className="annotation-linked-row" key={a.id} onClick={() => onOpen(a.id)}><span>#{a.number} {a.title}</span><small data-status={a.status}>{a.status}</small></button>) : <p>暂无待处理注释</p>}<details className="annotation-revisions"><summary>修订记录 · {completed.length}</summary>{completed.length ? completed.map((a, i) => <details key={a.id}><summary><span>第 {i + 1} 次修订</span><button onClick={e => { e.preventDefault(); e.stopPropagation(); onOpen(a.id) }}>{a.title}</button><time>{new Date(a.completedAt ?? a.updatedAt).toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' })}</time></summary><p className="annotation-body">{a.body}</p></details>) : <p>暂无已完结注释</p>}</details></section>
}
