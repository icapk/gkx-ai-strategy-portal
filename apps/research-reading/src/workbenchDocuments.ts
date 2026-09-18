import { compareResearchDocuments } from './researchSort.ts'
import type { ResearchDocument } from './types'

const isTimestamp = (value?: string) => {
  if (!value || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?$/.test(value)) return false
  return !Number.isNaN(Date.parse(value.replace(' ', 'T')))
}

export const parentFolderLabel = (location: string) => {
  const parts = location.split('/').map((part) => part.trim()).filter(Boolean)
  return parts.at(-1) ?? '未分类'
}

export const displayResearchLocation = (location: string) => {
  if (location === '我的空间') return '个人空间'
  if (location.startsWith('我的空间/')) return `个人空间${location.slice('我的空间'.length)}`
  if (!location.trim()) return '—'
  if (/^(个人空间|团队空间)(\/|$)/.test(location)) return location
  return `团队空间/${location}`
}

export const isPersonalDocument = (documentItem: ResearchDocument) => (
  documentItem.spaceScope === 'personal'
  || (!documentItem.spaceScope && documentItem.location.startsWith('我的空间/'))
)

export const isTeamDocument = (documentItem: ResearchDocument, teamName: string) => (
  documentItem.spaceScope !== 'personal'
  && documentItem.location.split('/').map((part) => part.trim()).filter(Boolean)[0] === teamName.trim()
)

export const recentDocuments = (documents: ResearchDocument[], now = new Date()) => {
 const cutoff = new Date(now);const day=cutoff.getDate();cutoff.setDate(1);cutoff.setMonth(cutoff.getMonth()-1);cutoff.setDate(Math.min(day,new Date(cutoff.getFullYear(),cutoff.getMonth()+1,0).getDate()))
 const latest = new Map<number,ResearchDocument>()
 for(const item of documents){const visited=Date.parse(item.visitedAt.replace(' ','T'));if(!isTimestamp(item.visitedAt)||visited<cutoff.getTime()||visited>now.getTime()||(item.recentHiddenAt&&item.visitedAt<=item.recentHiddenAt))continue;const prior=latest.get(item.id);if(!prior||item.visitedAt>prior.visitedAt)latest.set(item.id,item)}
 return [...latest.values()].sort((a,b)=>compareResearchDocuments(a,b))
}

export const favoriteDocuments = (documents: ResearchDocument[]) => documents
  .filter((documentItem) => documentItem.favorite)
  .sort((first, second) => (
    (isTimestamp(second.favoritedAt) ? second.favoritedAt! : '').localeCompare(isTimestamp(first.favoritedAt) ? first.favoritedAt! : '')
    || second.visitedAt.localeCompare(first.visitedAt)
    || second.id - first.id
  ))

export const favoriteTimeLabel = (documentItem: ResearchDocument) => (
  isTimestamp(documentItem.favoritedAt) ? documentItem.favoritedAt! : '历史收藏 · 时间未记录'
)
