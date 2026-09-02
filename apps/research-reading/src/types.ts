export type Section = 'workbench' | 'personal' | 'team' | 'recycle'

export type WorkbenchTab = 'recent' | 'favorites' | 'owned' | 'shared'

export type TeamPanelTab = 'todo' | 'comments' | 'members'

export type DocumentKind = '在线文档' | '数据表格' | 'PDF文档' | 'Word文档' | 'Excel文档'

export interface PdfArchiveMetadata {
  storageKey: string
  originalName: string
  byteSize: number
  pageCount: number
  annotationCount: number
  parsedAt: string
}

export interface PdfAnnotationRect {
  x: number
  y: number
  width: number
  height: number
}

export interface PdfArchiveAnnotation {
  id: string
  documentId: number
  kind: 'highlight' | 'screenshot'
  pageNumber: number
  quote: string
  imageDataUrl?: string
  imageAssetKey?: string
  note: string
  rects: PdfAnnotationRect[]
  createdAt: string
  updatedAt: string
}

export type DataTableTemplate = 'project-progress' | 'research-data'

export type DataTableColumnType = 'text' | 'number' | 'select' | 'date' | 'percent' | 'file'

export interface DataTableColumn {
  id: string
  name: string
  type: DataTableColumnType
  required: boolean
  options?: string[]
}

export interface ResearchDataRow {
  id: string
  values: Record<string, string>
  updatedAt: string
  updatedBy: string
}

export interface DataTableAttachment {
  id: string
  name: string
  size: number
  mimeType: string
  uploadedAt: string
  uploadedBy: string
  rowCount: number
  source: 'upload' | 'import'
  dataUrl?: string
  previewText?: string
}

export type DataTableShareAccess = 'private' | 'team-view' | 'team-edit'

export interface DataTableShareSettings {
  access: DataTableShareAccess
  collaborators: string[]
  updatedAt: string
  updatedBy: string
}

export interface ResearchDataTable {
  documentId: number
  template: DataTableTemplate
  columns: DataTableColumn[]
  rows: ResearchDataRow[]
  attachments: DataTableAttachment[]
  share: DataTableShareSettings
  createdAt: string
  updatedAt: string
  updatedBy: string
}

export type DocumentTextStyle = 'paragraph' | 'heading-1' | 'heading-2' | 'quote'

export interface DocumentTextBlock {
  id: string
  type: 'text'
  text: string
  style: DocumentTextStyle
  bold: boolean
  italic: boolean
  underline: boolean
}

export interface DocumentListBlock {
  id: string
  type: 'list'
  ordered: boolean
  items: string[]
}

export interface DocumentImageBlock {
  id: string
  type: 'image'
  src: string
  alt: string
  caption: string
}

export interface DocumentFormulaBlock {
  id: string
  type: 'formula'
  latex: string
}

export interface DocumentBookmarkBlock {
  id: string
  type: 'bookmark'
  url: string
  title: string
  description: string
}

export interface DocumentDividerBlock {
  id: string
  type: 'divider'
  style: 'solid' | 'dashed'
}

export type DocumentBlock =
  | DocumentTextBlock
  | DocumentListBlock
  | DocumentImageBlock
  | DocumentFormulaBlock
  | DocumentBookmarkBlock
  | DocumentDividerBlock

export interface ResearchDocument {
  id: number
  title: string
  location: string
  owner: string
  createdAt: string
  visitedAt: string
  updatedAt?: string
  favoritedAt?: string
  recentHiddenAt?: string
  deletedAt?: string
  size: string
  kind: DocumentKind
  favorite: boolean
  owned: boolean
  shared: boolean
  spaceScope?: 'personal' | 'team'
  description?: string
  keywords?: string[]
  content?: string
  blocks?: DocumentBlock[]
  pdfTextContent?: string
  pdfArchive?: PdfArchiveMetadata
}

export interface ResearchNote {
  id: number
  documentId: number
  pdfAnnotationId?: string
  pageNumber?: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

export interface FolderItem {
  id: number
  name: string
  count: number
  updatedAt: string
  createdAt?: string
  owner?: string
  location?: string
  size?: string
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
  | 'profile-settings'
  | 'note-detail'
  | 'note-editor'
  | null
