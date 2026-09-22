import {displayMinute} from './displayFormat.ts'
import type { ResearchDocument } from './types'

export type ResearchSortKey = 'visitedAt' | 'createdAt' | 'favoritedAt' | 'deletedAt'
const collator = new Intl.Collator('zh-Hans-CN-u-co-pinyin', { numeric: true, sensitivity: 'base' })
export function minute(value?: string) {
 if(!value)return '';const text=displayMinute(value);return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(text)?text:''
}
export function compareResearchDocuments(a: ResearchDocument, b: ResearchDocument, key: ResearchSortKey = 'visitedAt', direction: 'asc' | 'desc' = 'desc') {
  const av = minute(a[key]), bv = minute(b[key])
  // Unknown timestamps stay last in either direction; tie-breaks never reverse.
  if (!av !== !bv) return av ? -1 : 1
  const primary = av.localeCompare(bv) * (direction === 'desc' ? -1 : 1)
  return primary || (key !== 'createdAt' && key !== 'favoritedAt' ? minute(b.createdAt).localeCompare(minute(a.createdAt)) : 0)
    || collator.compare(a.title, b.title) || a.id - b.id
}
