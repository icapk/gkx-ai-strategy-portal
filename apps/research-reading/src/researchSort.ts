import type { ResearchDocument } from './types'

export type ResearchSortKey = 'visitedAt' | 'createdAt' | 'favoritedAt' | 'deletedAt'
const collator = new Intl.Collator('zh-Hans-CN-u-co-pinyin', { numeric: true, sensitivity: 'base' })
export function minute(value?: string) {
  if(value&&/^\d{4}-\d{2}-\d{2}T/.test(value)){
    const date=new Date(value)
    if(Number.isNaN(date.getTime()))return ''
    const pad=(n:number)=>String(n).padStart(2,'0')
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
  }
  return value && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(value) ? value.slice(0, 16) : ''
}
export function compareResearchDocuments(a: ResearchDocument, b: ResearchDocument, key: ResearchSortKey = 'visitedAt', direction: 'asc' | 'desc' = 'desc') {
  const av = minute(a[key]), bv = minute(b[key])
  // Unknown timestamps stay last in either direction; tie-breaks never reverse.
  if (!av !== !bv) return av ? -1 : 1
  const primary = av.localeCompare(bv) * (direction === 'desc' ? -1 : 1)
  return primary || (key !== 'createdAt' && key !== 'favoritedAt' ? minute(b.createdAt).localeCompare(minute(a.createdAt)) : 0)
    || collator.compare(a.title, b.title) || a.id - b.id
}
