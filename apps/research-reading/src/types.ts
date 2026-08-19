export type Section = 'workbench' | 'personal' | 'team' | 'recycle'

export type WorkbenchTab = 'recent' | 'favorites' | 'owned' | 'shared'

export type TeamPanelTab = 'todo' | 'comments' | 'members'

export type DocumentKind = '在线文档' | 'PDF文档' | 'Word文档' | 'Excel文档'

export interface ResearchDocument {
  id: number
  title: string
  location: string
  owner: string
  createdAt: string
  visitedAt: string
  size: string
  kind: DocumentKind
  favorite: boolean
  owned: boolean
  shared: boolean
}

export interface FolderItem {
  id: number
  name: string
  count: number
  updatedAt: string
}

export interface TodoItem {
  id: number
  title: string
  due: string
  level: 'danger' | 'warning' | 'muted'
  done: boolean
}

export interface CommentItem {
  id: number
  author: string
  content: string
  time: string
  replyTo?: string
  parentCommentId?: number
  attachment?: string
}

export interface MemberItem {
  id: number
  name: string
  role: string
  initials: string
  color: string
  status: '在线' | '离线'
  joinedAt: string
}

export type ModalKind =
  | 'new-folder'
  | 'new-document'
  | 'import-document'
  | 'new-team'
  | 'invite-member'
  | 'add-todo'
  | null
