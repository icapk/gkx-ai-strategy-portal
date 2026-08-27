import type { ResearchDocument } from './types'

const isTimestamp = (value?: string) => {
  if (!value || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?$/.test(value)) return false
  return !Number.isNaN(Date.parse(value.replace(' ', 'T')))
}

export const parentFolderLabel = (location: string) => {
  const parts = location.split('/').map((part) => part.trim()).filter(Boolean)
  return parts.at(-1) ?? '未分类'
}

export const isPersonalDocument = (documentItem: ResearchDocument) => (
  documentItem.spaceScope === 'personal'
  || (!documentItem.spaceScope && documentItem.location.startsWith('我的空间/'))
)

export const isTeamDocument = (documentItem: ResearchDocument, teamName: string) => (
  documentItem.spaceScope !== 'personal'
  && documentItem.location.split('/').map((part) => part.trim()).filter(Boolean)[0] === teamName.trim()
)

export const recentDocuments = (documents: ResearchDocument[]) => documents
  .filter((documentItem) => (
    isTimestamp(documentItem.visitedAt)
    && (!documentItem.recentHiddenAt || documentItem.visitedAt > documentItem.recentHiddenAt)
  ))
  .sort((first, second) => second.visitedAt.localeCompare(first.visitedAt) || second.id - first.id)

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
