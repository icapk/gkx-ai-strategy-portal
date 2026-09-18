import type { ModalKind, Section, TeamPanelTab, WorkbenchTab } from '../types'

export type AuditModule = 'research' | 'reading'
export interface AuditTarget {
  product: AuditModule
  label: string
  section?: Section
  tab?: WorkbenchTab
  teamTab?: TeamPanelTab
  modal?: ModalKind
  view?: 'reader' | 'library' | 'upload'
  left?: 'outline' | 'thumbnails' | 'notes'
  right?: 'ai' | 'charts' | 'references' | 'metadata' | 'graph'
  action?: 'search' | 'note' | 'editor' | 'translation' | 'explanation' | 'colors' | 'screenshot' | 'document-menu' | 'upload-folder'
  documentType?: 'document' | 'sheet'
}

export const targets: Record<string, AuditTarget> = {
  'research-workbench': { product: 'research', section: 'workbench', label: '科研工作台' },
  'research-recent': { product: 'research', section: 'workbench', tab: 'recent', label: '工作台 · 最近浏览' },
  'research-favorites': { product: 'research', section: 'workbench', tab: 'favorites', label: '工作台 · 我的收藏' },
  'research-owned': { product: 'research', section: 'workbench', tab: 'owned', label: '工作台 · 归我所有' },
  'research-shared': { product: 'research', section: 'workbench', tab: 'shared', label: '工作台 · 与我共享' },
  'research-personal': { product: 'research', section: 'personal', label: '我的空间' },
  'research-team': { product: 'research', section: 'team', label: '团队空间' },
  'research-recycle': { product: 'research', section: 'recycle', label: '回收站' },
  'research-profile': { product: 'research', modal: 'profile-settings', label: '个人信息设置' },
  'research-new-folder': { product: 'research', section: 'personal', modal: 'new-folder', label: '新建文件夹' },
  'research-new-document': { product: 'research', section: 'personal', modal: 'new-document', documentType: 'document', label: '新建在线文档' },
  'research-new-sheet': { product: 'research', section: 'personal', modal: 'new-document', documentType: 'sheet', label: '新建在线文档 · 表格类型' },
  'research-import': { product: 'research', section: 'personal', modal: 'import-document', label: '导入文档' },
  'research-new-team': { product: 'research', section: 'team', modal: 'new-team', label: '新建团队空间' },
  'research-invite': { product: 'research', section: 'team', teamTab: 'members', modal: 'invite-member', label: '邀请成员 · 选择成员' },
  'research-members': { product: 'research', section: 'team', teamTab: 'members', label: '团队成员与角色配置' },
  'research-todo': { product: 'research', section: 'team', teamTab: 'todo', label: '团队待办' },
  'research-comments': { product: 'research', section: 'team', teamTab: 'comments', label: '团队评论' },
  'reading-reader': { product: 'reading', view: 'reader', label: '智能阅读器' },
  'reading-header': { product: 'reading', view: 'reader', label: '阅读文档操作栏' },
  'reading-document-menu': { product: 'reading', view: 'reader', action: 'document-menu', label: '切换阅读文档' },
  'reading-paper': { product: 'reading', view: 'reader', label: '文献正文' },
  'reading-footer': { product: 'reading', view: 'reader', label: '阅读页码与缩放' },
  'reading-outline': { product: 'reading', view: 'reader', left: 'outline', label: '文献目录' },
  'reading-thumbnails': { product: 'reading', view: 'reader', left: 'thumbnails', label: '文献缩略图' },
  'reading-notes': { product: 'reading', view: 'reader', left: 'notes', label: '阅读笔记' },
  'reading-editor': { product: 'reading', view: 'reader', left: 'notes', action: 'editor', label: '笔记编辑器' },
  'reading-selection': { product: 'reading', view: 'reader', action: 'note', label: '正文划词标注' },
  'reading-translation': { product: 'reading', view: 'reader', action: 'translation', label: '划词翻译卡片' },
  'reading-explanation': { product: 'reading', view: 'reader', action: 'explanation', label: '划词解释卡片' },
  'reading-colors': { product: 'reading', view: 'reader', action: 'colors', label: '划词背景颜色' },
  'reading-screenshot': { product: 'reading', view: 'reader', action: 'screenshot', label: '阅读截图框选区' },
  'reading-search': { product: 'reading', view: 'reader', action: 'search', label: 'AI检索抽屉' },
  'reading-ai': { product: 'reading', view: 'reader', right: 'ai', label: 'AI解读与问答' },
  'reading-charts': { product: 'reading', view: 'reader', right: 'charts', label: '图表提取' },
  'reading-references': { product: 'reading', view: 'reader', right: 'references', label: '文献解析' },
  'reading-metadata': { product: 'reading', view: 'reader', right: 'metadata', label: '数据提炼' },
  'reading-graph': { product: 'reading', view: 'reader', right: 'graph', label: '图谱关联' },
  'reading-library': { product: 'reading', view: 'library', label: '智能阅读库' },
  'reading-upload': { product: 'reading', view: 'upload', label: '上传文献' },
  'reading-upload-folder': { product: 'reading', view: 'upload', action: 'upload-folder', label: '上传 · 新建笔记库' },
}

export const leafTargets: Record<string, string> = {
  'SRR-034': 'reading-reader', 'SRR-035': 'reading-outline', 'SRR-036': 'reading-references',
  'SRR-037': 'reading-charts', 'SRR-038': 'research-workbench', 'SRR-039': 'research-recent',
  'SRR-040': 'research-favorites', 'SRR-041': 'research-personal', 'SRR-042': 'research-team',
  'SRR-043': 'research-workbench', 'SRR-044': 'reading-editor', 'SRR-045': 'reading-upload',
  'SRR-046': 'research-new-sheet', 'SRR-047': 'research-members', 'SRR-048': 'research-members',
}
