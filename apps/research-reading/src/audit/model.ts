import raw from './requirements.json'
import assessments from './assessments.json'
import { leafTargets, targets, type AuditModule } from './targets'

export type Status = 'compliant' | 'pending' | 'noncompliant'
export const statuses: Status[] = ['compliant', 'pending', 'noncompliant']
export const labels = { all: '全部', compliant: '已合规', pending: '待定', noncompliant: '不合规' }
export interface Assessment { status: Status; reason: string; targetId: string; evidence: string }
export interface Point { code: string; title: string; sourceText: string; sourceRow: number; sourceNumber: number; assessment: Assessment }
export interface Leaf { id: string; module: AuditModule; level4: string; level5: string; level6: string; requirement: string; pages: string[]; points: Point[]; targetId: string }
const assessmentMap = assessments as Record<string, Assessment>
export const leaves: Leaf[] = raw.leaves.map(leaf => ({ ...leaf, module: leaf.module as AuditModule, targetId: leafTargets[leaf.id], points: leaf.points.map(point => {
  const found = assessmentMap[point.code]
  const assessment = found && targets[found.targetId] && found.evidence ? found : {
    status: 'noncompliant' as const, reason: '缺少可核验的审核证据，定位到所属页面供复核。', evidence: '无可核验记录', targetId: leafTargets[leaf.id],
  }
  return { ...point, assessment }
}) }))
export type Counts = Record<Status | 'all', number>
export const countPoints = (points: Point[]): Counts => points.reduce((counts, point) => {
  counts.all++; counts[point.assessment.status]++; return counts
}, { all: 0, compliant: 0, pending: 0, noncompliant: 0 })
export const toggleStatus = (selected: Status[], status: Status | 'all'): Status[] => status === 'all' ? [] : selected.includes(status) ? selected.filter(item => item !== status) : [...selected, status]
export const allows = (selected: Status[], status: Status) => !selected.length || selected.includes(status)
export function filterLeaf(leaf: Leaf, global: Status[], level4: Status[], level5: Status[], search: string): Point[] {
  const term = search.trim().toLocaleLowerCase()
  const parentMatch = [leaf.level4, leaf.level5, leaf.level6, leaf.requirement, ...leaf.pages].some(text => text.toLocaleLowerCase().includes(term))
  return leaf.points.filter(point => allows(global, point.assessment.status) && allows(level4, point.assessment.status) && allows(level5, point.assessment.status) && (!term || parentMatch || `${point.code} ${point.title}`.toLocaleLowerCase().includes(term)))
}
