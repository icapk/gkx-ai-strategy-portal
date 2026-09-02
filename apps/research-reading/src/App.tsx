import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { initialComments, initialDocuments, initialFolders, initialMembers, initialResearchNotes, initialTodos, teamNames as defaultTeamNames } from './data'
import { DocumentTable } from './components/DocumentTable'
import { DataTableHub, type DataTableHubTarget } from './components/DataTableHub'
import { GlobalSearchDialog } from './components/GlobalSearchDialog'
import { MemberPicker, type CandidateRole, type MemberCandidate } from './components/MemberPicker'
import { Modal } from './components/Modal'
import { Sidebar, TopNavigation } from './components/Navigation'
import { ProfileSettingsModal } from './components/ProfileSettingsModal'
import { PdfArchiveTable } from './components/PdfArchiveTable'
import { ReadingWorkspace } from './components/ReadingWorkspace'
import { ServiceCapabilityPath } from './components/ServiceCapabilityPath'
import { NoteDetailDialog, NoteEditorDialog } from './components/ResearchNoteDialog'
import { SpaceView } from './components/SpaceView'
import { TeamPanel } from './components/TeamPanel'
import { WorkspaceView } from './components/WorkspaceView'
import { loadUserProfile, saveUserProfile, type UserProfile } from './profile'
import { isPersonalDocument, isTeamDocument, favoriteDocuments, parentFolderLabel, recentDocuments } from './workbenchDocuments'
import { loadFolders, persistFolders, type FolderScope } from './folderContent'
import {
  createBlankResearchDataTable,
  estimateResearchDataTableSize,
  getResearchDataTableSearchText,
  initialResearchDataTables,
  loadResearchDataTables,
  persistResearchDataTable,
  removeResearchDataTable,
} from './dataTableContent'
import {
  canReconcilePdfArchiveStorage,
  createDocumentBlock,
  loadRecycledResearchDocuments,
  loadResearchDocuments,
  persistRecycledResearchDocument,
  persistResearchDocument,
  persistResearchDocumentsBatch,
  removePersistedResearchDocument,
} from './documentContent'
import {
  deletePdfArchive,
  downloadPdfArchive,
  exportPdfNotes,
  hasPdfArchiveFile,
  loadPdfAnnotations,
  pdfArchiveStorageKey,
  reconcilePdfArchiveStorage,
  savePdfAnnotations,
  savePdfArchiveFile,
} from './pdfArchive'
import { parsePdfData } from './pdfParsing'
import type {
  CommentItem,
  DocumentBlock,
  FolderItem,
  MemberItem,
  ModalKind,
  ResearchDocument,
  ResearchDataTable,
  ResearchNote,
  PdfArchiveAnnotation,
  Section,
  TeamPanelTab,
  DataTableTemplate,
  TodoItem,
  WorkbenchTab,
} from './types'
import './styles.css'
import './reading.css'

const nextId = (items: Array<{ id: number }>) => Math.max(0, ...items.map((item) => item.id)) + 1

const pdfAnnotationToResearchNote = (
  annotation: PdfArchiveAnnotation,
  documentId: number,
  id: number,
): ResearchNote => ({
  id,
  documentId,
  pdfAnnotationId: annotation.id,
  pageNumber: annotation.pageNumber,
  title: `第 ${annotation.pageNumber} 页 · ${annotation.kind === 'highlight' ? '划词笔记' : '截图笔记'}`,
  content: [annotation.quote, annotation.note].map((value) => value.trim()).filter(Boolean).join('\n\n') || 'PDF 页面标注',
  createdAt: annotation.createdAt,
  updatedAt: annotation.updatedAt,
  tags: ['PDF笔记', annotation.kind === 'highlight' ? '划词标注' : '截图标注'],
})

const ResearchDocumentEditor = lazy(() => import('./components/ResearchDocumentEditor').then((module) => ({ default: module.ResearchDocumentEditor })))
const DataTableWorkspace = lazy(() => import('./components/DataTableWorkspace').then((module) => ({ default: module.DataTableWorkspace })))
const PdfArchiveReader = lazy(() => import('./components/PdfArchiveReader').then((module) => ({ default: module.PdfArchiveReader })))
const PdfImportDialog = lazy(() => import('./components/PdfImportDialog').then((module) => ({ default: module.PdfImportDialog })))

const formatDateTime = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const formatLocalDateTime = () => formatDateTime(new Date())
const formatFileSize = (bytes: number) => bytes < 1024 * 1024
  ? `${Math.max(1, Math.round(bytes / 1024))} KB`
  : `${(bytes / (1024 * 1024)).toFixed(1)} MB`

const readablePdfImportError = (error: unknown) => {
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : ''
  if (message === 'password-protected') return '该 PDF 已加密，请解除密码后重新导入。'
  if (message === 'invalid-pdf') return '文件内容损坏或不是有效的 PDF。'
  if (message === 'document-id-conflict') return '存档编号冲突，请重新选择文件后再试。'
  return message.trim().slice(0, 180) || 'PDF 在线解析失败，请检查文件后重试。'
}

interface ToastState {
  message: string
  tone: 'success' | 'error'
  actionLabel?: string
  onAction?: () => void
}

type PendingDeletion =
  | { type: 'document'; id: number }
  | { type: 'folder'; id: number; scope: FolderScope }

type ArchiveTab = 'documents' | 'recycle'

const memberCandidates: MemberCandidate[] = [
  { id: 'member-zhang-1', name: '张三', email: 'zhangsan@example.com', date: '2025-12-05', color: '#3e84f5' },
  { id: 'member-li-1', name: '李四', email: 'lisi@example.com', date: '2025-12-05', color: '#17b981' },
  { id: 'member-wang-1', name: '王五', email: 'wangwu@example.com', date: '2025-12-02', color: '#8b5ef5' },
  { id: 'member-zhao-1', name: '赵六', email: 'zhaoliu@example.com', date: '2025-12-02', color: '#f49e14' },
  { id: 'member-sun-1', name: '孙七', email: 'sunqi@example.com', date: '2025-12-01', color: '#ee4546' },
  { id: 'member-zhang-2', name: '张三', email: 'zhangsan@example.com', date: '2025-11-28', color: '#3e84f5' },
  { id: 'member-li-2', name: '李四', email: 'lisi@example.com', date: '2025-11-26', color: '#17b981' },
  { id: 'member-wang-2', name: '王五', email: 'wangwu@example.com', date: '2025-12-01', color: '#8b5ef5' },
  { id: 'member-zhao-2', name: '赵六', email: 'zhaoliu@example.com', date: '2025-11-22', color: '#f49e14' },
  { id: 'member-sun-2', name: '孙七', email: 'sunqi@example.com', date: '2025-11-20', color: '#ee4546' },
]

const defaultInviteSelection = ['member-zhang-1', 'member-li-1', 'member-zhao-1', 'member-sun-1', 'member-wang-2']
const defaultRoles = (ids: string[]): Record<string, CandidateRole> => Object.fromEntries(ids.map((id) => [id, '查看员']))

interface DocumentSearchTarget {
  blockId?: string
  query?: string
  pageNumber?: number
  annotationId?: string
}

interface DataTableHistoryState {
  researchPortalSurface?: 'data-table-hub' | 'data-table'
  fromHub?: boolean
  hubEntry?: boolean
}

const currentDataTableHistoryState = (): DataTableHistoryState => {
  const state = window.history.state
  return state && typeof state === 'object' ? state as DataTableHistoryState : {}
}

const dataTableHistoryState = (value: DataTableHistoryState) => ({
  ...currentDataTableHistoryState(),
  ...value,
})

const getInitialProduct = (): 'research' | 'reading' => (
  new URLSearchParams(window.location.search).get('view') === 'reading' ? 'reading' : 'research'
)

export default function App() {
  const [activeProduct, setActiveProduct] = useState<'research' | 'reading'>(getInitialProduct)
  const [activeSection, setActiveSection] = useState<Section>('workbench')
  const [teamTreeExpanded, setTeamTreeExpanded] = useState(false)
  const [workbenchTab, setWorkbenchTab] = useState<WorkbenchTab>('recent')
  const [teamPanelTab, setTeamPanelTab] = useState<TeamPanelTab>('todo')
  const [documents, setDocuments] = useState<ResearchDocument[]>(() => loadResearchDocuments(initialDocuments))
  const [researchDataTables, setResearchDataTables] = useState<ResearchDataTable[]>(() => loadResearchDataTables(initialResearchDataTables))
  const [researchNotes, setResearchNotes] = useState<ResearchNote[]>(initialResearchNotes)
  const [recycledDocuments, setRecycledDocuments] = useState<ResearchDocument[]>(() => loadRecycledResearchDocuments())
  const [folders, setFolders] = useState<FolderItem[]>(() => loadFolders('personal', initialFolders))
  const [teamFolders, setTeamFolders] = useState<FolderItem[]>(() => loadFolders('team', initialFolders.map((folder) => ({ ...folder, location: 'AI研究团队' }))))
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos)
  const [comments, setComments] = useState<CommentItem[]>(initialComments)
  const [members, setMembers] = useState<MemberItem[]>(initialMembers)
  const [teamNames, setTeamNames] = useState(defaultTeamNames)
  const [activeTeam, setActiveTeam] = useState(defaultTeamNames[0])
  const [openFolderName, setOpenFolderName] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalKind>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [highlightedDocumentId, setHighlightedDocumentId] = useState<number | null>(null)
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null)
  const [noteDocumentId, setNoteDocumentId] = useState<number | null>(null)
  const [activeDocumentId, setActiveDocumentId] = useState<number | null>(null)
  const [dataTableHubOpen, setDataTableHubOpen] = useState(false)
  const [activeDataTableAction, setActiveDataTableAction] = useState<'import' | 'share' | 'files' | undefined>()
  const [activeDocumentSearchTarget, setActiveDocumentSearchTarget] = useState<(DocumentSearchTarget & { documentId: number }) | null>(null)
  const [activePdfDocumentId, setActivePdfDocumentId] = useState<number | null>(null)
  const [activePdfSearchTarget, setActivePdfSearchTarget] = useState<(DocumentSearchTarget & { documentId: number }) | null>(null)
  const [archiveTab, setArchiveTab] = useState<ArchiveTab>('documents')
  const [pdfArchiveImportOpen, setPdfArchiveImportOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile())
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [pendingDeletion, setPendingDeletion] = useState<PendingDeletion | null>(null)
  const [previewDocumentId, setPreviewDocumentId] = useState<number | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importFileName, setImportFileName] = useState('')
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importError, setImportError] = useState('')
  const [documentType, setDocumentType] = useState<'document' | 'sheet'>('document')
  const [newContentSource, setNewContentSource] = useState<'space' | 'data-hub'>('space')
  const [dataTableTemplate, setDataTableTemplate] = useState<DataTableTemplate>('project-progress')
  const [newDocumentTitle, setNewDocumentTitle] = useState('')
  const [newDocumentError, setNewDocumentError] = useState('')
  const [newDocumentStorageError, setNewDocumentStorageError] = useState('')
  const [inviteSelection, setInviteSelection] = useState<string[]>(defaultInviteSelection)
  const [inviteRoles, setInviteRoles] = useState<Record<string, CandidateRole>>(() => defaultRoles(defaultInviteSelection))
  const [teamName, setTeamName] = useState('')
  const [teamInviteSelection, setTeamInviteSelection] = useState<string[]>([])
  const [teamInviteRoles, setTeamInviteRoles] = useState<Record<string, CandidateRole>>({})
  const [teamInviteDraftSelection, setTeamInviteDraftSelection] = useState<string[]>([])
  const [teamInviteDraftRoles, setTeamInviteDraftRoles] = useState<Record<string, CandidateRole>>({})
  const [teamMemberPickerOpen, setTeamMemberPickerOpen] = useState(false)
  const [memberSearch, setMemberSearch] = useState('')
  const [createdTeams, setCreatedTeams] = useState<string[]>([])
  const toastTimer = useRef<number | null>(null)
  const importAttemptRef = useRef(0)
  const highlightTimer = useRef<number | null>(null)
  const teamNameInputRef = useRef<HTMLInputElement | null>(null)
  const newDocumentTitleRef = useRef<HTMLInputElement | null>(null)
  const documentIdCounterRef = useRef(Math.max(0, ...documents.map((item) => item.id), ...recycledDocuments.map((item) => item.id)) + 1)
  const activeDocumentIdRef = useRef(activeDocumentId)
  const documentsRef = useRef(documents)
  const foldersRef = useRef(folders)
  const teamFoldersRef = useRef(teamFolders)
  const dataTableHubOpenRef = useRef(dataTableHubOpen)
  const activeDataTableFromHubRef = useRef(false)
  const dataTableNavigationGuardRef = useRef<(() => boolean) | null>(null)
  const pdfNoteLoadGenerationRef = useRef(0)

  activeDocumentIdRef.current = activeDocumentId
  documentsRef.current = documents
  foldersRef.current = folders
  teamFoldersRef.current = teamFolders
  dataTableHubOpenRef.current = dataTableHubOpen

  const registerDataTableNavigationGuard = useCallback((guard: (() => boolean) | null) => {
    dataTableNavigationGuardRef.current = guard
  }, [])

  const showToast = (message: string, action?: { label: string; run: () => void }, tone: ToastState['tone'] = 'success') => {
    setToast({ message, tone, actionLabel: action?.label, onAction: action?.run })
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), action ? 5600 : 2300)
  }
  const showError = (message: string) => showToast(message, undefined, 'error')

  useEffect(() => () => {
    importAttemptRef.current += 1
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    if (highlightTimer.current) window.clearTimeout(highlightTimer.current)
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('view', activeProduct)
    window.history.replaceState(window.history.state, '', url)
    document.title = activeProduct === 'reading' ? '智能阅读' : '智能科研'
  }, [activeProduct])

  useEffect(() => {
    const openSearchFromKeyboard = (event: KeyboardEvent) => {
      if (activeProduct !== 'research' || activeDocumentId !== null || activePdfDocumentId !== null || dataTableHubOpen || event.defaultPrevented || modal !== null || pdfArchiveImportOpen || searchOpen) return
      if (!(event.metaKey || event.ctrlKey) || event.key.toLocaleLowerCase() !== 'k') return
      event.preventDefault()
      setSearchOpen(true)
    }
    window.addEventListener('keydown', openSearchFromKeyboard)
    return () => window.removeEventListener('keydown', openSearchFromKeyboard)
  }, [activeDocumentId, activePdfDocumentId, activeProduct, dataTableHubOpen, modal, pdfArchiveImportOpen, searchOpen])

  const selectSection = (section: Section) => {
    setActiveSection(section)
    if (section === 'team') setTeamTreeExpanded(true)
    setOpenFolderName(null)
    setPage(1)
  }

  const openGlobalSearch = () => {
    setModal(null)
    setSearchOpen(true)
  }

  const openProfileSettings = () => {
    setSearchOpen(false)
    setModal('profile-settings')
  }

  const openDocument = (
    documentItem: ResearchDocument,
    target?: DocumentSearchTarget,
    dataTableAction?: 'import' | 'share' | 'files',
    historyMode: 'push' | 'none' = 'push',
  ) => {
    const timestamp = formatLocalDateTime()
    if (documentItem.kind === '数据表格') {
      const existingTable = researchDataTables.find((item) => item.documentId === documentItem.id)
      if (!existingTable) {
        const blankTable = createBlankResearchDataTable(documentItem.id, 'project-progress', profile.name, timestamp)
        const tableResult = persistResearchDataTable(blankTable)
        if (!tableResult.ok) {
          showError(tableResult.error)
          return
        }
        setResearchDataTables((current) => [blankTable, ...current])
      }
    }
    const visitedDocument = { ...documentItem, visitedAt: timestamp, recentHiddenAt: undefined }
    const visitResult = persistResearchDocument(visitedDocument)
    if (!visitResult.ok) showError(`${visitResult.error} 文件仍可查看，但本次访问不会进入最近浏览。`)
    else setDocuments((current) => current.map((item) => item.id === documentItem.id ? visitedDocument : item))
    setSearchOpen(false)
    setModal(null)
    if (documentItem.kind === 'PDF文档' && documentItem.pdfArchive) {
      setPreviewDocumentId(null)
      setActivePdfSearchTarget(target ? { ...target, documentId: documentItem.id } : null)
      setActivePdfDocumentId(documentItem.id)
      return
    }
    if (documentItem.kind !== '在线文档' && documentItem.kind !== '数据表格') {
      setPreviewDocumentId(documentItem.id)
      return
    }
    setPreviewDocumentId(null)
    setActiveDocumentSearchTarget(target ? { ...target, documentId: documentItem.id } : null)
    setActiveDataTableAction(documentItem.kind === '数据表格' ? dataTableAction : undefined)
    if (documentItem.kind === '数据表格') {
      const linkedHistoryState = currentDataTableHistoryState()
      const openedFromHub = historyMode === 'none'
        ? Boolean(linkedHistoryState.fromHub)
        : dataTableHubOpenRef.current
      activeDataTableFromHubRef.current = openedFromHub
      const tableHash = `#table=${documentItem.id}`
      if (historyMode === 'push' && window.location.hash !== tableHash) {
        window.history.pushState(
          dataTableHistoryState({ researchPortalSurface: 'data-table', fromHub: openedFromHub, hubEntry: false }),
          '',
          `${window.location.pathname}${window.location.search}${tableHash}`,
        )
      }
    }
    activeDocumentIdRef.current = documentItem.id
    setActiveDocumentId(documentItem.id)
  }

  useEffect(() => {
    const syncLinkedDataTableSurface = () => {
      const match = window.location.hash.match(/^#table=(\d+)$/)
      const destinationTableId = match ? Number(match[1]) : null
      const currentDocumentId = activeDocumentIdRef.current
      const currentDocument = documents.find((item) => item.id === currentDocumentId)
      const leavingCurrentTable = currentDocument?.kind === '数据表格'
        && destinationTableId !== currentDocumentId

      if (leavingCurrentTable && dataTableNavigationGuardRef.current) {
        if (!dataTableNavigationGuardRef.current()) {
          window.history.pushState(
            dataTableHistoryState({
              researchPortalSurface: 'data-table',
              fromHub: activeDataTableFromHubRef.current,
              hubEntry: false,
            }),
            '',
            `${window.location.pathname}${window.location.search}#table=${currentDocumentId}`,
          )
          return
        }
        // popstate and hashchange can fire for the same traversal. Disable the
        // accepted guard synchronously so the second event cannot prompt twice.
        dataTableNavigationGuardRef.current = null
      }

      if (window.location.hash === '#data-tables') {
        setActiveProduct('research')
        setActiveSection('workbench')
        activeDocumentIdRef.current = null
        setActiveDocumentId(null)
        setActiveDocumentSearchTarget(null)
        setActiveDataTableAction(undefined)
        dataTableHubOpenRef.current = true
        setDataTableHubOpen(true)
        return
      }
      if (match) {
        const linkedDocument = documents.find((item) => item.id === destinationTableId && item.kind === '数据表格')
        if (linkedDocument && activeDocumentIdRef.current !== linkedDocument.id) {
          const openedFromHub = Boolean(currentDataTableHistoryState().fromHub)
          dataTableHubOpenRef.current = openedFromHub
          setDataTableHubOpen(openedFromHub)
          openDocument(linkedDocument, undefined, undefined, 'none')
        } else if (!linkedDocument) {
          activeDocumentIdRef.current = null
          setActiveDocumentId(null)
          setActiveDocumentSearchTarget(null)
          setActiveDataTableAction(undefined)
          dataTableHubOpenRef.current = true
          setDataTableHubOpen(true)
          window.history.replaceState(
            dataTableHistoryState({ researchPortalSurface: 'data-table-hub', fromHub: false, hubEntry: false }),
            '',
            `${window.location.pathname}${window.location.search}#data-tables`,
          )
          showError('该数据表格已不存在，已返回数据表格列表')
        }
        return
      }
      const activeDocument = documents.find((item) => item.id === activeDocumentIdRef.current)
      if (activeDocument?.kind === '数据表格') {
        activeDocumentIdRef.current = null
        setActiveDocumentId(null)
        setActiveDocumentSearchTarget(null)
        setActiveDataTableAction(undefined)
      }
      dataTableHubOpenRef.current = false
      setDataTableHubOpen(false)
    }
    syncLinkedDataTableSurface()
    window.addEventListener('hashchange', syncLinkedDataTableSurface)
    window.addEventListener('popstate', syncLinkedDataTableSurface)
    return () => {
      window.removeEventListener('hashchange', syncLinkedDataTableSurface)
      window.removeEventListener('popstate', syncLinkedDataTableSurface)
    }
  }, [documents, profile.name, researchDataTables])

  const closeActiveDocument = () => {
    dataTableNavigationGuardRef.current = null
    if (/^#table=\d+$/.test(window.location.hash)) {
      const historyState = currentDataTableHistoryState()
      if (historyState.researchPortalSurface === 'data-table') {
        window.history.back()
        return
      } else {
        window.history.replaceState(
          dataTableHubOpen ? dataTableHistoryState({ researchPortalSurface: 'data-table-hub', fromHub: false, hubEntry: false }) : null,
          '',
          `${window.location.pathname}${window.location.search}${dataTableHubOpen ? '#data-tables' : ''}`,
        )
      }
    }
    activeDocumentIdRef.current = null
    setActiveDocumentId(null)
    setActiveDocumentSearchTarget(null)
    setActiveDataTableAction(undefined)
  }

  const closePdfDocument = () => {
    setActivePdfDocumentId(null)
    setActivePdfSearchTarget(null)
  }

  useEffect(() => {
    if (activePdfDocumentId == null) return
    const isAvailable = documents.some((documentItem) => documentItem.id === activePdfDocumentId && Boolean(documentItem.pdfArchive))
    if (!isAvailable) {
      setActivePdfDocumentId(null)
      setActivePdfSearchTarget(null)
    }
  }, [activePdfDocumentId, documents])

  const saveDocumentContent = (value: { title: string; blocks: DocumentBlock[]; content: string; size: string }) => {
    if (activeDocumentId == null) return '无法确认当前文档，请返回列表后重试。'
    const target = documents.find((item) => item.id === activeDocumentId)
    if (!target) return '文档已不存在，请返回列表刷新后重试。'
    const timestamp = formatLocalDateTime()
    const nextDocument: ResearchDocument = {
      ...target,
      title: value.title,
      blocks: value.blocks,
      content: value.content,
      size: value.size,
      visitedAt: timestamp,
      updatedAt: timestamp,
      description: value.content.trim()
        ? value.content.trim().replace(/\s+/g, ' ').slice(0, 120)
        : '空白在线文档，尚未添加内容摘要。',
    }
    const result = persistResearchDocument(nextDocument)
    if (!result.ok) return result.error
    setDocuments((current) => current.map((item) => item.id === activeDocumentId ? nextDocument : item))
    return null
  }

  const saveDataTableContent = (value: { title: string; table: ResearchDataTable }) => {
    if (activeDocumentId == null) return '无法确认当前数据表格，请返回列表后重试。'
    const target = documents.find((item) => item.id === activeDocumentId)
    if (!target || target.kind !== '数据表格') return '数据表格已不存在，请返回列表刷新后重试。'
    if (value.table.documentId !== target.id) return '检测到表格与文档不匹配，已阻止保存，请返回列表后重新打开。'
    const previousTable = researchDataTables.find((item) => item.documentId === target.id)
    const tableResult = persistResearchDataTable(value.table)
    if (!tableResult.ok) return tableResult.error
    const timestamp = formatLocalDateTime()
    const searchText = getResearchDataTableSearchText(value.table)
    const nextDocument: ResearchDocument = {
      ...target,
      title: value.title,
      visitedAt: timestamp,
      updatedAt: timestamp,
      size: estimateResearchDataTableSize(value.table),
      shared: value.table.share.access !== 'private',
      description: value.table.rows.length
        ? `包含 ${value.table.rows.length} 条科研记录、${value.table.columns.length} 个字段和 ${value.table.attachments.length} 个数据文件。`
        : '空白数据表格，尚未添加科研记录。',
      content: searchText.slice(0, 80_000),
      keywords: Array.from(new Set([
        '数据表格',
        value.table.template === 'project-progress' ? '项目进度' : '科研数据',
        ...value.table.columns.map((column) => column.name),
      ])).slice(0, 24),
    }
    const documentResult = persistResearchDocument(nextDocument)
    if (!documentResult.ok) {
      const rollbackResult = previousTable
        ? persistResearchDataTable(previousTable)
        : removeResearchDataTable(value.table.documentId)
      return rollbackResult.ok
        ? `${documentResult.error} 表格数据已回滚，可修正后重试。`
        : `${documentResult.error} 表格索引同步失败，请先导出备份后再刷新。`
    }
    setResearchDataTables((current) => [
      value.table,
      ...current.filter((item) => item.documentId !== value.table.documentId),
    ])
    setDocuments((current) => current.map((item) => item.id === activeDocumentId ? nextDocument : item))
    return null
  }

  const openNewDocumentDialog = () => {
    setNewContentSource('space')
    setDocumentType('document')
    setDataTableTemplate('project-progress')
    setNewDocumentTitle('')
    setNewDocumentError('')
    setNewDocumentStorageError('')
    setModal('new-document')
  }

  const openNewDataTableDialog = () => {
    setNewContentSource('data-hub')
    setDocumentType('sheet')
    setDataTableTemplate('project-progress')
    setNewDocumentTitle('')
    setNewDocumentError('')
    setNewDocumentStorageError('')
    setModal('new-document')
  }

  const openDataTableHub = () => {
    setActiveProduct('research')
    setActiveSection('workbench')
    setOpenFolderName(null)
    setSearchOpen(false)
    setModal(null)
    setDataTableHubOpen(true)
    if (window.location.hash !== '#data-tables') {
      window.history.pushState(
        dataTableHistoryState({ researchPortalSurface: 'data-table-hub', fromHub: false, hubEntry: true }),
        '',
        `${window.location.pathname}${window.location.search}#data-tables`,
      )
    }
  }

  const closeDataTableHub = () => {
    setDataTableHubOpen(false)
    if (window.location.hash === '#data-tables') {
      if (currentDataTableHistoryState().hubEntry) {
        window.history.back()
      } else {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
      }
    }
  }

  const openHubTable = (target: DataTableHubTarget, action?: 'import' | 'share' | 'files') => {
    if (!target.documentItem) {
      showError('该表格缺少索引信息，暂时无法打开')
      return
    }
    openDocument(target.documentItem, undefined, action)
  }

  const locateDocument = (documentItem: ResearchDocument) => {
    if (documentItem.kind === '数据表格') {
      openDataTableHub()
      showToast(`已在科研数据管理中定位“${documentItem.title}”`)
      return
    }
    let locateStorageWarning = ''
    setSearchOpen(false)
    setModal(null)
    setActiveProduct('research')
    setActiveSection('workbench')
    setWorkbenchTab('recent')
    if (documentItem.recentHiddenAt) {
      const locatedDocument = { ...documentItem, recentHiddenAt: undefined }
      const result = persistResearchDocument(locatedDocument)
      if (result.ok) setDocuments((current) => current.map((item) => item.id === documentItem.id ? locatedDocument : item))
      else locateStorageWarning = result.error
    }
    setOpenFolderName(null)
    setPage(1)
    setHighlightedDocumentId(documentItem.id)
    if (highlightTimer.current) window.clearTimeout(highlightTimer.current)
    highlightTimer.current = window.setTimeout(() => setHighlightedDocumentId(null), 2800)
    if (locateStorageWarning) showError(`已定位“${documentItem.title}”，但${locateStorageWarning}`)
    else showToast(`已定位“${documentItem.title}”`)
  }

  const openNoteDetail = (note: ResearchNote) => {
    setSearchOpen(false)
    if (note.pdfAnnotationId) {
      const parentDocument = documentsRef.current.find((documentItem) => documentItem.id === note.documentId && Boolean(documentItem.pdfArchive))
      if (parentDocument) {
        openDocument(parentDocument, {
          annotationId: note.pdfAnnotationId,
          pageNumber: note.pageNumber,
          query: note.content,
        })
        return
      }
    }
    setActiveNoteId(note.id)
    setNoteDocumentId(note.documentId)
    setModal('note-detail')
  }

  const saveProfile = (nextProfile: UserProfile) => {
    const result = saveUserProfile(nextProfile)
    if (!result.ok) return result.error
    setProfile(nextProfile)
    setModal(null)
    showToast('个人信息已保存')
    return null
  }

  const toggleTeamTree = () => {
    if (activeSection !== 'team') {
      selectSection('team')
      return
    }
    setTeamTreeExpanded((expanded) => !expanded)
  }

  const personalDocuments = useMemo(
    () => documents.filter(isPersonalDocument),
    [documents],
  )
  const teamDocuments = useMemo(
    () => documents.filter((documentItem) => isTeamDocument(documentItem, activeTeam)),
    [activeTeam, documents],
  )
  const activeDataTableDocuments = useMemo(
    () => documents.filter((documentItem) => documentItem.kind === '数据表格'),
    [documents],
  )
  const archivedPdfDocuments = useMemo(
    () => documents.filter((documentItem) => documentItem.kind === 'PDF文档' && Boolean(documentItem.pdfArchive)),
    [documents],
  )
  const archivedPdfDocumentIdsKey = useMemo(
    () => archivedPdfDocuments.map((documentItem) => documentItem.id).sort((left, right) => left - right).join(','),
    [archivedPdfDocuments],
  )
  const knownPdfDocumentIdsKey = useMemo(
    () => [...documents, ...recycledDocuments]
      .filter((documentItem) => documentItem.kind === 'PDF文档' && Boolean(documentItem.pdfArchive))
      .map((documentItem) => documentItem.id)
      .sort((left, right) => left - right)
      .join(','),
    [documents, recycledDocuments],
  )
  const existingPdfFiles = useMemo(
    () => [...documents, ...recycledDocuments].flatMap((documentItem) => documentItem.pdfArchive
      ? [{ name: documentItem.pdfArchive.originalName, size: documentItem.pdfArchive.byteSize }]
      : []),
    [documents, recycledDocuments],
  )

  useEffect(() => {
    if (!canReconcilePdfArchiveStorage()) return
    const knownIds = knownPdfDocumentIdsKey.split(',').map(Number).filter((id) => Number.isInteger(id) && id > 0)
    void reconcilePdfArchiveStorage(knownIds)
  }, [knownPdfDocumentIdsKey])

  useEffect(() => {
    let cancelled = false
    const generation = ++pdfNoteLoadGenerationRef.current
    const documentIds = archivedPdfDocumentIdsKey.split(',').map(Number).filter((id) => Number.isInteger(id) && id > 0)
    void Promise.all(documentIds.map(async (documentId) => ({
      documentId,
      result: await loadPdfAnnotations(documentId),
    }))).then((loadedDocuments) => {
      if (cancelled || generation !== pdfNoteLoadGenerationRef.current) return
      const activeDocumentIds = new Set(documentIds)
      const successfullyLoadedIds = new Set(loadedDocuments.filter(({ result }) => result.ok).map(({ documentId }) => documentId))
      setResearchNotes((current) => {
        const existingByAnnotation = new Map(current
          .filter((note) => note.pdfAnnotationId)
          .map((note) => [`${note.documentId}:${note.pdfAnnotationId}`, note]))
        const retained = current.filter((note) => {
          if (!note.pdfAnnotationId) return true
          if (!activeDocumentIds.has(note.documentId)) return false
          return !successfullyLoadedIds.has(note.documentId)
        })
        let nextNoteId = nextId(current)
        const restoredNotes = loadedDocuments.flatMap(({ documentId, result }) => {
          if (!result.ok) return []
          return result.value.map((annotation) => {
            const existing = existingByAnnotation.get(`${documentId}:${annotation.id}`)
            return pdfAnnotationToResearchNote(annotation, documentId, existing?.id ?? nextNoteId++)
          })
        })
        return [...restoredNotes, ...retained]
      })
    })
    return () => { cancelled = true }
  }, [archivedPdfDocumentIdsKey])

  const hubDataTables = useMemo(() => {
    const activeIds = new Set(activeDataTableDocuments.map((documentItem) => documentItem.id))
    return researchDataTables.filter((table) => activeIds.has(table.documentId))
  }, [activeDataTableDocuments, researchDataTables])

  const visibleDocuments = useMemo(() => {
    if (activeSection !== 'workbench') return documents
    if (workbenchTab === 'favorites') return favoriteDocuments(documents)
    if (workbenchTab === 'owned') return documents.filter((documentItem) => documentItem.owned)
    if (workbenchTab === 'shared') return documents.filter((documentItem) => documentItem.shared && !documentItem.owned)
    return recentDocuments(documents)
  }, [activeSection, documents, workbenchTab])

  const toggleFavorite = (id: number) => {
    const target = documents.find((doc) => doc.id === id)
    if (!target) return
    const timestamp = formatLocalDateTime()
    const nextDocument = {
      ...target,
      favorite: !target.favorite,
      favoritedAt: target.favorite ? undefined : timestamp,
    }
    const result = persistResearchDocument(nextDocument)
    if (!result.ok) {
      showError(result.error)
      return
    }
    setDocuments((current) => current.map((doc) => doc.id === id ? nextDocument : doc))
    showToast(nextDocument.favorite ? '已加入我的收藏' : '已取消收藏', {
      label: '撤销',
      run: () => {
        const rollback = persistResearchDocument(target)
        if (!rollback.ok) {
          showError(rollback.error)
          return
        }
        setDocuments((current) => current.map((doc) => doc.id === id ? target : doc))
        showToast('收藏状态已恢复')
      },
    })
  }

  const removeFromRecent = (id: number) => {
    const target = documents.find((doc) => doc.id === id)
    if (!target) return
    const nextDocument = { ...target, recentHiddenAt: formatLocalDateTime() }
    const result = persistResearchDocument(nextDocument)
    if (!result.ok) {
      showError(result.error)
      return
    }
    setDocuments((current) => current.map((doc) => doc.id === id ? nextDocument : doc))
    showToast(`已从最近浏览移除“${target.title}”`, {
      label: '撤销',
      run: () => {
        const rollback = persistResearchDocument(target)
        if (!rollback.ok) {
          showError(rollback.error)
          return
        }
        setDocuments((current) => current.map((doc) => doc.id === id ? target : doc))
        showToast('已恢复到最近浏览')
      },
    })
  }

  const requestDeleteDocument = (id: number) => setPendingDeletion({ type: 'document', id })

  const moveDocumentToRecycle = (id: number) => {
    const target = documents.find((doc) => doc.id === id)
    if (!target) return
    const recycledDocument = { ...target, deletedAt: formatLocalDateTime() }
    const result = persistRecycledResearchDocument(recycledDocument)
    if (!result.ok) {
      showError(result.error)
      return
    }
    setDocuments((current) => current.filter((doc) => doc.id !== id))
    setRecycledDocuments((current) => [recycledDocument, ...current.filter((doc) => doc.id !== id)])
    setPendingDeletion(null)
    showToast(target.kind === '数据表格' ? '数据表格已移入回收站' : '文档已移入回收站', {
      label: '撤销',
      run: () => {
        const rollback = persistResearchDocument(target)
        if (!rollback.ok) {
          showError(rollback.error)
          return
        }
        setRecycledDocuments((current) => current.filter((doc) => doc.id !== id))
        setDocuments((current) => [target, ...current.filter((doc) => doc.id !== id)])
        showToast('已从回收站恢复')
      },
    })
  }

  const permanentlyDeleteDocument = async (id: number) => {
    const target = recycledDocuments.find((doc) => doc.id === id)
    if (!target || !window.confirm(`彻底删除“${target.title}”？该操作无法恢复。`)) return
    const result = removePersistedResearchDocument(id)
    if (!result.ok) {
      showError(result.error)
      return
    }
    if (target.pdfArchive) {
      const archiveResult = await deletePdfArchive(id)
      if (!archiveResult.ok) {
        const rollback = persistRecycledResearchDocument(target)
        showError(rollback.ok
          ? `${archiveResult.error} 文献仍保留在回收站，可稍后重试。`
          : `${archiveResult.error} 回收站索引恢复也失败，请刷新页面核对。`)
        return
      }
    }
    setRecycledDocuments((current) => current.filter((doc) => doc.id !== id))
    setResearchNotes((current) => current.filter((note) => note.documentId !== id))
    if (target.kind === '数据表格') {
      const tableResult = removeResearchDataTable(id)
      if (!tableResult.ok) {
        showError(`文档已删除，但表格缓存清理失败：${tableResult.error}`)
        return
      }
      setResearchDataTables((current) => current.filter((table) => table.documentId !== id))
    }
    showToast('文档已彻底删除')
  }

  const restoreDocument = (id: number) => {
    const target = recycledDocuments.find((doc) => doc.id === id)
    if (!target) return
    const restoredDocument = { ...target, deletedAt: undefined }
    const result = persistResearchDocument(restoredDocument)
    if (!result.ok) {
      showError(result.error)
      return
    }
    setRecycledDocuments((current) => current.filter((doc) => doc.id !== id))
    setDocuments((current) => [restoredDocument, ...current.filter((doc) => doc.id !== id)])
    showToast('文档已恢复')
  }

  const shareDocument = (id: number) => {
    const target = documents.find((doc) => doc.id === id)
    if (!target) return
    const nextDocument = { ...target, shared: true }
    let nextDataTable: ResearchDataTable | undefined
    let previousDataTable: ResearchDataTable | undefined
    if (target.kind === '数据表格') {
      previousDataTable = researchDataTables.find((table) => table.documentId === id)
      if (!previousDataTable) {
        showError('无法读取数据表格，请先打开表格后重试')
        return
      }
      const timestamp = formatLocalDateTime()
      const fallbackCollaborators = members.map((member) => member.name).filter((name) => name !== profile.name)
      nextDataTable = {
        ...previousDataTable,
        share: {
          access: previousDataTable.share.access === 'private' ? 'team-view' : previousDataTable.share.access,
          collaborators: previousDataTable.share.collaborators.length
            ? previousDataTable.share.collaborators
            : fallbackCollaborators,
          updatedAt: timestamp,
          updatedBy: profile.name,
        },
        updatedAt: timestamp,
        updatedBy: profile.name,
      }
      const tableResult = persistResearchDataTable(nextDataTable)
      if (!tableResult.ok) {
        showError(tableResult.error)
        return
      }
    }
    const result = persistResearchDocument(nextDocument)
    if (!result.ok) {
      const rollbackResult = previousDataTable ? persistResearchDataTable(previousDataTable) : null
      showError(rollbackResult && !rollbackResult.ok
        ? `${result.error} 表格共享状态回滚失败，请打开表格核对权限。`
        : result.error)
      return
    }
    if (nextDataTable) {
      setResearchDataTables((current) => current.map((table) => table.documentId === id ? nextDataTable! : table))
    }
    setDocuments((current) => current.map((doc) => doc.id === id ? nextDocument : doc))
    showToast(`已共享到${activeTeam}`)
  }

  const renameDocument = (id: number, title: string) => {
    const target = documents.find((doc) => doc.id === id)
    if (!target) return false
    const normalizedTitle = title.normalize('NFC').trim()
    if (!normalizedTitle || Array.from(normalizedTitle).length > 50) {
      showError('文档名称应为 1 至 50 个字符')
      return false
    }
    const nextDocument = { ...target, title: normalizedTitle, updatedAt: formatLocalDateTime() }
    const result = persistResearchDocument(nextDocument)
    if (!result.ok) {
      showError(result.error)
      return false
    }
    setDocuments((current) => current.map((doc) => doc.id === id ? nextDocument : doc))
    showToast('文档已重命名')
    return true
  }

  const createDocumentNote = (documentItem: ResearchDocument) => {
    setActiveNoteId(null)
    setNoteDocumentId(documentItem.id)
    setModal('note-editor')
  }

  const saveResearchNote = (value: { title: string; content: string; tags: string[] }) => {
    if (noteDocumentId == null) return
    const timestamp = formatLocalDateTime()
    const noteId = activeNoteId ?? nextId(researchNotes)
    setResearchNotes((current) => activeNoteId == null
      ? [{ id: noteId, documentId: noteDocumentId, createdAt: timestamp, updatedAt: timestamp, ...value }, ...current]
      : current.map((note) => note.id === activeNoteId ? { ...note, ...value, updatedAt: timestamp } : note))
    setActiveNoteId(noteId)
    setModal('note-detail')
    showToast(activeNoteId == null ? '笔记已保存，可通过全文搜索找到' : '笔记修改已保存')
  }

  const submitTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const title = String(form.get('todoTitle') ?? '').trim()
    const due = String(form.get('todoDue') ?? '')
    const level = String(form.get('todoLevel') ?? 'warning') as TodoItem['level']
    if (!title || !due) return
    setTodos((current) => [...current, { id: nextId(current), title, due, level, done: false }])
    setModal(null)
    showToast('待办已添加')
  }

  const addComment = (content: string, attachment?: string, replyTo?: string, parentCommentId?: number) => {
    setComments((current) => [...current, {
      id: nextId(current),
      author: profile.name,
      content,
      time: '刚刚',
      attachment,
      replyTo,
      parentCommentId,
    }])
    showToast('评论发送成功')
  }

  const submitNewFolder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('folderName') ?? '').normalize('NFC').trim()
    if (!name) return
    const scope: FolderScope = activeSection === 'team' ? 'team' : 'personal'
    const current = scope === 'team' ? teamFolders : folders
    const foldersInScope = scope === 'team'
      ? current.filter((folder) => folder.location === activeTeam)
      : current
    if (foldersInScope.some((folder) => folder.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      showError('同一空间内不能创建同名文件夹')
      return
    }
    const timestamp = formatLocalDateTime()
    const nextFolders = [...current, {
      id: nextId(current),
      name,
      count: 0,
      updatedAt: timestamp,
      createdAt: timestamp,
      owner: profile.name,
      location: scope === 'team' ? activeTeam : '我的空间',
      size: '0 KB',
    }]
    const result = persistFolders(scope, nextFolders)
    if (!result.ok) {
      showError(result.error)
      return
    }
    if (scope === 'team') setTeamFolders(nextFolders)
    else setFolders(nextFolders)
    if (activeSection === 'team') setCreatedTeams((current) => current.filter((team) => team !== activeTeam))
    setModal(null)
    showToast(`文件夹“${name}”创建成功`)
  }

  const submitNewDocument = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNewDocumentStorageError('')
    const title = newDocumentTitle.normalize('NFC').trim()
    if (!title) {
      setNewDocumentError('请输入文档名称。')
      newDocumentTitleRef.current?.focus()
      return
    }
    const timestamp = formatLocalDateTime()
    const documentId = documentIdCounterRef.current
    documentIdCounterRef.current += 1
    const createdDocument: ResearchDocument = {
      id: documentId,
      title,
      location: newContentSource === 'data-hub'
        ? '科研数据管理/全部数据表'
        : activeSection === 'team'
        ? `${activeTeam}/${openFolderName ?? '文档'}`
        : `我的空间/${openFolderName ?? '研究'}`,
      owner: profile.name,
      createdAt: timestamp,
      visitedAt: timestamp,
      updatedAt: timestamp,
      size: '0 KB',
      kind: documentType === 'document' ? '在线文档' : '数据表格',
      favorite: false,
      owned: true,
      shared: activeSection === 'team',
      spaceScope: activeSection === 'team' || newContentSource === 'data-hub' ? 'team' : 'personal',
      description: documentType === 'document' ? '空白在线文档，尚未添加内容摘要。' : '新建的数据表格。',
      keywords: [],
      content: '',
      blocks: documentType === 'document' ? [createDocumentBlock('text')] : undefined,
    }
    const documentResult = persistResearchDocument(createdDocument)
    if (!documentResult.ok) {
      setNewDocumentStorageError(documentResult.error)
      return
    }
    let createdDataTable: ResearchDataTable | null = null
    if (createdDocument.kind === '数据表格') {
      createdDataTable = createBlankResearchDataTable(documentId, dataTableTemplate, profile.name, timestamp)
      if (activeSection === 'team') {
        createdDataTable = {
          ...createdDataTable,
          share: {
            access: 'team-edit',
            collaborators: members.map((member) => member.name).filter((name) => name !== profile.name),
            updatedAt: timestamp,
            updatedBy: profile.name,
          },
        }
      }
      const tableResult = persistResearchDataTable(createdDataTable)
      if (!tableResult.ok) {
        const rollbackResult = removePersistedResearchDocument(documentId)
        setNewDocumentStorageError(rollbackResult.ok
          ? tableResult.error
          : `${tableResult.error} 新建文档索引清理失败，请返回列表刷新后重试。`)
        return
      }
      setResearchDataTables((current) => [createdDataTable!, ...current])
    }
    setDocuments((current) => [createdDocument, ...current])
    if (activeSection === 'team') setCreatedTeams((current) => current.filter((team) => team !== activeTeam))
    setModal(null)
    setNewDocumentTitle('')
    setNewDocumentError('')
    setNewDocumentStorageError('')
    setActiveDocumentId(createdDocument.id)
    if (createdDocument.kind === '数据表格') {
      window.history.pushState(
        dataTableHistoryState({ researchPortalSurface: 'data-table', fromHub: dataTableHubOpen }),
        '',
        `${window.location.pathname}${window.location.search}#table=${createdDocument.id}`,
      )
      showToast(`数据表格“${title}”已创建，已进入编辑`)
    } else showToast(`在线文档“${title}”已创建`)
  }

  const importPdfFile = async (
    file: File,
    onProgress: (progress: number) => void,
    targetLocation = '我的空间/文献存档',
    targetScope: 'personal' | 'team' = 'personal',
  ) => {
    if (!/\.pdf$/i.test(file.name.trim())) return { ok: false as const, error: '仅支持导入 PDF 文件。' }
    if (file.size <= 0) return { ok: false as const, error: '文件为空，无法导入。' }
    if (file.size > 50 * 1024 * 1024) return { ok: false as const, error: '单个 PDF 不能超过 50 MB。' }
    const normalizedName = file.name.normalize('NFC').trim().toLocaleLowerCase('zh-CN')
    const matchesFile = (documentItem: ResearchDocument) => (
      documentItem.pdfArchive?.originalName.normalize('NFC').trim().toLocaleLowerCase('zh-CN') === normalizedName
      && documentItem.pdfArchive.byteSize === file.size
    )
    const recycledDuplicate = recycledDocuments.find(matchesFile)
    if (recycledDuplicate) return { ok: false as const, error: '同名且大小相同的 PDF 已在回收站，请先恢复或彻底删除后再导入。' }
    const activeDuplicate = documentsRef.current.find(matchesFile)
    if (activeDuplicate) {
      onProgress(4)
      if (await hasPdfArchiveFile(activeDuplicate.id)) {
        onProgress(100)
        return { ok: true as const, documentItem: activeDuplicate }
      }
    }

    try {
      onProgress(2)
      const data = await file.arrayBuffer()
      onProgress(6)
      const parsed = await parsePdfData(data, onProgress)
      const id = activeDuplicate?.id ?? documentIdCounterRef.current
      if (!activeDuplicate) documentIdCounterRef.current += 1
      const timestamp = formatLocalDateTime()
      const archivedDocument: ResearchDocument = {
        ...(activeDuplicate ?? {
          id,
          title: file.name.replace(/\.pdf$/i, '').normalize('NFC').trim().slice(0, 50) || `PDF 文献 ${id}`,
          location: targetLocation,
          owner: profile.name,
          createdAt: timestamp,
          visitedAt: '',
          kind: 'PDF文档' as const,
          favorite: false,
          owned: true,
          shared: targetScope === 'team',
          spaceScope: targetScope,
        }),
        id,
        updatedAt: timestamp,
        size: formatFileSize(file.size),
        kind: 'PDF文档',
        description: `已在线解析并存档的 PDF 文献，共 ${parsed.pageCount} 页；可打开原文进行划词、截图和笔记整理。`,
        keywords: ['PDF文献', '文献存档', '在线解析'],
        content: '',
        pdfTextContent: parsed.textContent,
        pdfArchive: {
          storageKey: pdfArchiveStorageKey(id),
          originalName: file.name.normalize('NFC').trim().slice(0, 200),
          byteSize: file.size,
          pageCount: parsed.pageCount,
          annotationCount: activeDuplicate?.pdfArchive?.annotationCount ?? 0,
          parsedAt: new Date().toISOString(),
        },
      }
      onProgress(97)
      const archiveResult = await savePdfArchiveFile(id, file, data)
      if (!archiveResult.ok) return { ok: false as const, error: readablePdfImportError(archiveResult.error) }
      onProgress(99)
      const documentResult = persistResearchDocument(archivedDocument)
      if (!documentResult.ok) {
        if (activeDuplicate) {
          onProgress(100)
          return { ok: true as const, documentItem: activeDuplicate }
        }
        const rollback = await deletePdfArchive(id)
        return {
          ok: false as const,
          error: rollback.ok
            ? documentResult.error
            : `${documentResult.error} 已写入的 PDF 存档清理失败，请刷新后重试。`,
        }
      }
      setDocuments((current) => {
        const next = [archivedDocument, ...current.filter((documentItem) => documentItem.id !== id)]
        documentsRef.current = next
        return next
      })
      onProgress(100)
      return { ok: true as const, documentItem: archivedDocument }
    } catch (error) {
      return { ok: false as const, error: readablePdfImportError(error) }
    }
  }

  const submitImport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!importFile || isImporting) return
    const extension = importFile.name.toLocaleLowerCase().match(/\.(pdf|docx?)$/)?.[1]
    if (!extension) {
      setImportError('仅支持 PDF、DOC、DOCX 格式。')
      return
    }
    if (importFile.size <= 0 || importFile.size > 50 * 1024 * 1024) {
      setImportError(importFile.size <= 0 ? '文件为空，无法导入。' : '文件超过 50 MB，请压缩后重试。')
      return
    }
    const attempt = importAttemptRef.current + 1
    importAttemptRef.current = attempt
    setImportError('')
    setImportProgress(extension === 'pdf' ? 2 : 18)
    setIsImporting(true)
    if (extension === 'pdf') {
      const targetLocation = activeSection === 'team'
        ? `${activeTeam}/${openFolderName ?? '文档'}`
        : `我的空间/${openFolderName ?? '文献存档'}`
      const result = await importPdfFile(
        importFile,
        (progress) => { if (importAttemptRef.current === attempt) setImportProgress(progress) },
        targetLocation,
        activeSection === 'team' ? 'team' : 'personal',
      )
      if (importAttemptRef.current !== attempt) return
      if (!result.ok) {
        setImportError(result.error)
        setIsImporting(false)
        return
      }
      setIsImporting(false)
      setImportProgress(0)
      setImportFile(null)
      setImportFileName('')
      setModal(null)
      showToast(`“${result.documentItem.title}”已在线解析并存入文献存档`)
      return
    }
    for (const progress of [48, 78, 100]) {
      await new Promise((resolve) => window.setTimeout(resolve, 180))
      if (importAttemptRef.current !== attempt) return
      setImportProgress(progress)
    }
    const timestamp = formatLocalDateTime()
    const id = documentIdCounterRef.current
    documentIdCounterRef.current += 1
    const importedDocument: ResearchDocument = {
      id,
      title: importFile.name.replace(/\.(pdf|docx?)$/i, '').normalize('NFC').trim().slice(0, 50) || `导入文档 ${id}`,
      location: activeSection === 'team'
        ? `${activeTeam}/${openFolderName ?? '文档'}`
        : `我的空间/${openFolderName ?? '未分类'}`,
      owner: profile.name,
      createdAt: timestamp,
      visitedAt: '',
      updatedAt: timestamp,
      size: formatFileSize(importFile.size),
      kind: 'Word文档',
      favorite: false,
      owned: true,
      shared: activeSection === 'team',
      spaceScope: activeSection === 'team' ? 'team' : 'personal',
      description: '用户导入的科研文档，可在空间中预览元数据、收藏、分享、重命名或移入回收站。',
      keywords: ['导入文档'],
      content: '',
    }
    const result = persistResearchDocument(importedDocument)
    if (!result.ok) {
      setImportError(result.error)
      setIsImporting(false)
      return
    }
    setDocuments((current) => [importedDocument, ...current])
    setIsImporting(false)
    setImportProgress(0)
    setImportFile(null)
    setImportFileName('')
    setModal(null)
    showToast(`“${importedDocument.title}”已导入到${activeSection === 'team' ? activeTeam : '个人空间'}`)
  }

  const openImportDialog = () => {
    importAttemptRef.current += 1
    setImportFile(null)
    setImportFileName('')
    setImportError('')
    setImportProgress(0)
    setIsImporting(false)
    setModal('import-document')
  }

  const cancelImport = () => {
    importAttemptRef.current += 1
    setIsImporting(false)
    setImportProgress(0)
    setImportError('')
    setModal(null)
  }

  const submitNewTeam = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = teamName.trim()
    if (!name) {
      teamNameInputRef.current?.focus()
      return
    }
    if (!teamInviteSelection.length) {
      setTeamInviteDraftSelection([])
      setTeamInviteDraftRoles({})
      setMemberSearch('')
      setTeamMemberPickerOpen(true)
      return
    }
    const selectedMembers = memberCandidates.filter((candidate) => teamInviteSelection.includes(candidate.id))
    setTeamNames((current) => [...current, name])
    setCreatedTeams((current) => [...current, name])
    setMembers(selectedMembers.map((candidate, index) => ({
      id: index + 1,
      name: candidate.name,
      role: teamInviteRoles[candidate.id] ?? '查看员',
      initials: candidate.name.slice(0, 1),
      color: candidate.color,
      status: '在线',
      joinedAt: candidate.date,
    })))
    setActiveTeam(name)
    setActiveSection('team')
    setTeamPanelTab('members')
    setTeamName('')
    setTeamInviteSelection([])
    setTeamInviteRoles({})
    setTeamMemberPickerOpen(false)
    setModal(null)
    showToast(`团队空间“${name}”创建成功`)
  }

  const openTeamMemberPicker = () => {
    setTeamInviteDraftSelection(teamInviteSelection)
    setTeamInviteDraftRoles(teamInviteRoles)
    setMemberSearch('')
    setTeamMemberPickerOpen(true)
  }

  const cancelTeamMemberPicker = () => {
    setTeamMemberPickerOpen(false)
    setMemberSearch('')
  }

  const submitTeamMemberPicker = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTeamInviteSelection(teamInviteDraftSelection)
    setTeamInviteRoles(teamInviteDraftRoles)
    setTeamMemberPickerOpen(false)
    setMemberSearch('')
  }

  const submitInvite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const selected = memberCandidates.filter((candidate) => inviteSelection.includes(candidate.id))
    if (!selected.length) return
    setMembers((current) => [
      ...current,
      ...selected.filter((candidate) => !current.some((member) => member.name === candidate.name)).map((candidate, index): MemberItem => ({
        id: nextId(current) + index,
        name: candidate.name,
        role: inviteRoles[candidate.id] ?? '查看员',
        initials: candidate.name.slice(0, 1),
        color: candidate.color,
        status: '在线',
        joinedAt: candidate.date,
      })),
    ])
    setModal(null)
    setTeamPanelTab('members')
    showToast(`已邀请 ${selected.length} 位成员`)
  }

  const renameFolder = (id: number, name: string) => {
    const scope: FolderScope = activeSection === 'team' ? 'team' : 'personal'
    const current = scope === 'team' ? teamFolders : folders
    const normalizedName = name.normalize('NFC').trim()
    if (!normalizedName || Array.from(normalizedName).length > 50) {
      showError('文件夹名称应为 1 至 50 个字符')
      return false
    }
    const targetFolder = current.find((folder) => folder.id === id)
    if (!targetFolder) return false
    const folderRoot = scope === 'team' ? (targetFolder.location ?? activeTeam) : '我的空间'
    if (scope === 'team' && folderRoot !== activeTeam) {
      showError('该文件夹不属于当前团队，操作已停止')
      return false
    }
    if (current.some((folder) => folder.id !== id && (scope === 'personal' || folder.location === folderRoot) && folder.name.toLocaleLowerCase() === normalizedName.toLocaleLowerCase())) {
      showError('同一空间内不能使用重复的文件夹名称')
      return false
    }
    const timestamp = formatLocalDateTime()
    const nextFolders = current.map((folder) => folder.id === id
      ? { ...folder, name: normalizedName, updatedAt: timestamp }
      : folder)
    const affectedDocuments = documents.filter((documentItem) => (
      documentItem.location === `${folderRoot}/${targetFolder.name}`
    ))
    const nextDocuments = affectedDocuments.map((documentItem) => ({
      ...documentItem,
      location: `${documentItem.location.split('/').slice(0, -1).join('/')}/${normalizedName}`,
      updatedAt: timestamp,
    }))
    const documentResult = persistResearchDocumentsBatch(nextDocuments)
    if (!documentResult.ok) {
      showError(documentResult.error)
      return false
    }
    const result = persistFolders(scope, nextFolders)
    if (!result.ok) {
      const rollback = persistResearchDocumentsBatch(affectedDocuments)
      showError(rollback.ok ? result.error : `${result.error} 文档位置回滚也失败，请刷新后核对。`)
      return false
    }
    const nextDocumentById = new Map(nextDocuments.map((documentItem) => [documentItem.id, documentItem]))
    setDocuments((items) => items.map((documentItem) => nextDocumentById.get(documentItem.id) ?? documentItem))
    if (scope === 'team') setTeamFolders(nextFolders)
    else setFolders(nextFolders)
    showToast('文件夹已重命名')
    return true
  }

  const deleteFolder = (id: number) => {
    setPendingDeletion({ type: 'folder', id, scope: activeSection === 'team' ? 'team' : 'personal' })
  }

  const confirmFolderDeletion = (id: number, scope: FolderScope) => {
    const current = scope === 'team' ? teamFolders : folders
    const target = current.find((folder) => folder.id === id)
    if (!target) {
      setPendingDeletion(null)
      return
    }
    const folderRoot = scope === 'team' ? (target.location ?? activeTeam) : '我的空间'
    if (scope === 'team' && folderRoot !== activeTeam) {
      showError('该文件夹不属于当前团队，操作已停止')
      setPendingDeletion(null)
      return
    }
    const nextFolders = current.filter((folder) => folder.id !== id)
    const originalFolderIndex = current.findIndex((folder) => folder.id === id)
    const timestamp = formatLocalDateTime()
    const affectedDocuments = documents.filter((documentItem) => (
      documentItem.location === `${folderRoot}/${target.name}`
    ))
    const relocatedDocuments = affectedDocuments.map((documentItem) => ({
      ...documentItem,
      location: `${documentItem.location.split('/').slice(0, -1).join('/')}/未分类`,
      updatedAt: timestamp,
    }))
    const documentResult = persistResearchDocumentsBatch(relocatedDocuments)
    if (!documentResult.ok) {
      showError(documentResult.error)
      return
    }
    const result = persistFolders(scope, nextFolders)
    if (!result.ok) {
      const rollback = persistResearchDocumentsBatch(affectedDocuments)
      showError(rollback.ok ? result.error : `${result.error} 文档位置回滚也失败，请刷新后核对。`)
      return
    }
    const relocatedById = new Map(relocatedDocuments.map((documentItem) => [documentItem.id, documentItem]))
    setDocuments((items) => items.map((documentItem) => relocatedById.get(documentItem.id) ?? documentItem))
    if (scope === 'team') setTeamFolders(nextFolders)
    else setFolders(nextFolders)
    setPendingDeletion(null)
    showToast(`文件夹“${target.name}”已删除`, {
      label: '撤销',
      run: () => {
        const currentFolders = scope === 'team' ? teamFoldersRef.current : foldersRef.current
        if (currentFolders.some((folder) => folder.id === target.id)) {
          showError('同一文件夹已恢复，无需重复撤销。')
          return
        }
        if (currentFolders.some((folder) => folder.location === target.location && folder.name.toLocaleLowerCase() === target.name.toLocaleLowerCase())) {
          showError('当前已存在同名文件夹，无法自动撤销；请先重命名冲突文件夹。')
          return
        }
        const restored = [...currentFolders]
        restored.splice(Math.min(originalFolderIndex, restored.length), 0, target)
        const originalLocationById = new Map(affectedDocuments.map((documentItem) => [documentItem.id, documentItem.location]))
        const restoredDocuments = documentsRef.current
          .filter((documentItem) => originalLocationById.has(documentItem.id))
          .map((documentItem) => ({ ...documentItem, location: originalLocationById.get(documentItem.id)! }))
        const documentRollback = persistResearchDocumentsBatch(restoredDocuments)
        if (!documentRollback.ok) {
          showError(`${documentRollback.error} 文件夹恢复尚未完成。`)
          return
        }
        const rollback = persistFolders(scope, restored)
        if (!rollback.ok) {
          const relocatedLocationById = new Map(relocatedDocuments.map((documentItem) => [documentItem.id, documentItem.location]))
          const positionRollback = persistResearchDocumentsBatch(restoredDocuments.map((documentItem) => ({
            ...documentItem,
            location: relocatedLocationById.get(documentItem.id) ?? documentItem.location,
          })))
          showError(positionRollback.ok ? rollback.error : `${rollback.error} 文档位置回滚也失败，请刷新后核对。`)
          return
        }
        if (scope === 'team') setTeamFolders(restored)
        else setFolders(restored)
        const restoredById = new Map(restoredDocuments.map((documentItem) => [documentItem.id, documentItem]))
        setDocuments((items) => items.map((documentItem) => restoredById.get(documentItem.id) ?? documentItem))
        showToast('文件夹已恢复')
      },
    })
  }

  const activeResearchNote = activeNoteId == null
    ? undefined
    : researchNotes.find((note) => note.id === activeNoteId)
  const noteDocument = noteDocumentId == null
    ? undefined
    : documents.find((documentItem) => documentItem.id === noteDocumentId)
  const activeEditingDocument = activeDocumentId == null
    ? undefined
    : documents.find((documentItem) => documentItem.id === activeDocumentId)
  const activeEditingDataTable = activeEditingDocument?.kind === '数据表格'
    ? researchDataTables.find((table) => table.documentId === activeEditingDocument.id)
    : undefined
  const activePdfDocument = activePdfDocumentId == null
    ? undefined
    : documents.find((documentItem) => documentItem.id === activePdfDocumentId && Boolean(documentItem.pdfArchive))
  const previewDocument = previewDocumentId == null
    ? undefined
    : documents.find((documentItem) => documentItem.id === previewDocumentId)
  const pendingDeletionTarget = pendingDeletion?.type === 'document'
    ? documents.find((documentItem) => documentItem.id === pendingDeletion.id)
    : pendingDeletion?.type === 'folder'
    ? (pendingDeletion.scope === 'team' ? teamFolders : folders).find((folder) => folder.id === pendingDeletion.id)
    : undefined

  const openPdfDocumentById = (documentId: number) => {
    const documentItem = documentsRef.current.find((item) => item.id === documentId && Boolean(item.pdfArchive))
    if (!documentItem) {
      showError('该 PDF 文献已不存在或尚未完成存档。')
      return
    }
    openDocument(documentItem)
  }

  const downloadArchivedPdf = async (documentItem: ResearchDocument) => {
    const result = await downloadPdfArchive(documentItem)
    if (!result.ok) showError(result.error)
  }

  const saveActivePdfAnnotations = async (
    nextAnnotations: PdfArchiveAnnotation[],
    previousAnnotations: PdfArchiveAnnotation[],
  ) => {
    if (!activePdfDocument?.pdfArchive) return { ok: false as const, error: '当前 PDF 文献已关闭，请重新打开后保存。' }
    pdfNoteLoadGenerationRef.current += 1
    const documentId = activePdfDocument.id
    const annotationResult = await savePdfAnnotations(documentId, nextAnnotations, previousAnnotations)
    if (!annotationResult.ok) return annotationResult
    const currentDocument = documentsRef.current.find((item) => item.id === documentId)
    if (!currentDocument?.pdfArchive) {
      await savePdfAnnotations(documentId, previousAnnotations, annotationResult.value)
      return { ok: false as const, error: '文献存档索引已不存在，请返回列表后重新打开。' }
    }
    const updatedDocument: ResearchDocument = {
      ...currentDocument,
      updatedAt: formatLocalDateTime(),
      pdfArchive: {
        ...currentDocument.pdfArchive,
        annotationCount: annotationResult.value.length,
      },
    }
    const documentResult = persistResearchDocument(updatedDocument)
    if (!documentResult.ok) {
      const rollback = await savePdfAnnotations(documentId, previousAnnotations, annotationResult.value)
      return {
        ok: false as const,
        error: rollback.ok
          ? documentResult.error
          : `${documentResult.error} 笔记数据回滚失败，请关闭阅读器后重新打开核对。`,
      }
    }
    setDocuments((current) => {
      const updated = current.map((item) => item.id === documentId ? updatedDocument : item)
      documentsRef.current = updated
      return updated
    })
    setResearchNotes((current) => {
      const existingByAnnotationId = new Map(current
        .filter((note) => note.documentId === documentId && note.pdfAnnotationId)
        .map((note) => [note.pdfAnnotationId!, note]))
      const unrelatedNotes = current.filter((note) => note.documentId !== documentId || !note.pdfAnnotationId)
      let nextNoteId = nextId(current)
      const pdfNotes: ResearchNote[] = annotationResult.value.map((annotation) => {
        const existing = existingByAnnotationId.get(annotation.id)
        return pdfAnnotationToResearchNote(annotation, documentId, existing?.id ?? nextNoteId++)
      })
      return [...pdfNotes, ...unrelatedNotes]
    })
    return { ok: true as const, annotations: annotationResult.value }
  }

  const selectArchiveTab = (nextTab: ArchiveTab) => {
    setArchiveTab(nextTab)
    setPage(1)
  }

  const handleArchiveTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, tab: ArchiveTab) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const tabs: ArchiveTab[] = ['documents', 'recycle']
    const currentIndex = tabs.indexOf(tab)
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabs.length - 1
        : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
    const nextTab = tabs[nextIndex]
    selectArchiveTab(nextTab)
    window.requestAnimationFrame(() => document.getElementById(`archive-tab-${nextTab}`)?.focus())
  }

  return (
    <main className={`app-stage${activeProduct === 'reading' ? ' app-stage--reading' : ''}`}>
      <div className="ambient ambient--left" aria-hidden="true" />
      <div className="ambient ambient--top" aria-hidden="true" />
      <div className="app-shell" aria-hidden={activeEditingDocument || activePdfDocumentId !== null || dataTableHubOpen ? true : undefined} inert={activeEditingDocument || activePdfDocumentId !== null || dataTableHubOpen ? true : undefined}>
        {activeProduct === 'reading' ? (
          <ReadingWorkspace
            onSwitchToResearch={() => setActiveProduct('research')}
            onProfileOpen={openProfileSettings}
            profileName={profile.name}
            profileAvatar={profile.avatarDataUrl}
          />
        ) : <>
        <TopNavigation
          activeSection={activeSection}
          onSelect={selectSection}
          onReadingSelect={() => { setModal(null); setSearchOpen(false); setActiveProduct('reading') }}
          onSearchOpen={openGlobalSearch}
          onProfileOpen={openProfileSettings}
          profileName={profile.name}
          profileAvatar={profile.avatarDataUrl}
        />
        <ServiceCapabilityPath product="research" items={['基础服务', '智能科研']} />
        <div className={`workspace-grid${activeSection === 'team' ? ' workspace-grid--team' : ''}`}>
          <Sidebar
            activeSection={activeSection}
            activeTeam={activeTeam}
            teamNames={teamNames}
            teamTreeExpanded={teamTreeExpanded}
            onSectionSelect={selectSection}
            onTeamTreeToggle={toggleTeamTree}
            onTeamSelect={(team) => { setActiveTeam(team); setTeamTreeExpanded(true); setOpenFolderName(null) }}
            onNewTeam={() => {
              setTeamName('')
              setTeamInviteSelection([])
              setTeamInviteRoles({})
              setTeamMemberPickerOpen(false)
              setModal('new-team')
            }}
          />
          <div className="main-pane">
            {activeSection === 'workbench' && (
              <WorkspaceView
                documents={visibleDocuments}
                tab={workbenchTab}
                page={page}
                onTabChange={(tab) => { setWorkbenchTab(tab); setPage(1) }}
                onPageChange={setPage}
                onToggleFavorite={toggleFavorite}
                onDelete={requestDeleteDocument}
                onRemoveRecent={removeFromRecent}
                onShare={shareDocument}
                onOpenDocument={openDocument}
                onOpenDataTableHub={openDataTableHub}
                dataTableCount={hubDataTables.length}
                dataRecordCount={hubDataTables.reduce((total, table) => total + table.rows.length, 0)}
                highlightedDocumentId={highlightedDocumentId}
              />
            )}
            {activeSection === 'personal' && (
              <SpaceView
                mode="personal"
                folders={folders}
                documents={personalDocuments}
                openFolderName={openFolderName}
                page={page}
                onPageChange={setPage}
                onOpenFolder={(folder) => setOpenFolderName(folder.name)}
                onRenameFolder={renameFolder}
                onDeleteFolder={deleteFolder}
                onBack={() => setOpenFolderName(null)}
                onNewFolder={() => setModal('new-folder')}
                onNewDocument={openNewDocumentDialog}
                onImportDocument={openImportDialog}
                onToggleFavorite={toggleFavorite}
                onDelete={requestDeleteDocument}
                onShare={shareDocument}
                onRenameDocument={renameDocument}
                onCreateNote={createDocumentNote}
                onOpenDocument={openDocument}
                onDownloadDocument={(documentItem) => { void downloadArchivedPdf(documentItem) }}
              />
            )}
            {activeSection === 'team' && (
              <SpaceView
                mode="team"
                teamName={activeTeam}
                folders={createdTeams.includes(activeTeam) ? [] : teamFolders.filter((folder) => folder.location === activeTeam)}
                documents={createdTeams.includes(activeTeam) ? [] : teamDocuments}
                openFolderName={openFolderName}
                page={page}
                onPageChange={setPage}
                onOpenFolder={(folder) => setOpenFolderName(folder.name)}
                onRenameFolder={renameFolder}
                onDeleteFolder={deleteFolder}
                onBack={() => setOpenFolderName(null)}
                onNewFolder={() => setModal('new-folder')}
                onNewDocument={openNewDocumentDialog}
                onImportDocument={openImportDialog}
                onToggleFavorite={toggleFavorite}
                onDelete={requestDeleteDocument}
                onShare={shareDocument}
                onRenameDocument={renameDocument}
                onCreateNote={createDocumentNote}
                onOpenDocument={openDocument}
                onDownloadDocument={(documentItem) => { void downloadArchivedPdf(documentItem) }}
                emptyTeam={createdTeams.includes(activeTeam)}
              />
            )}
            {activeSection === 'recycle' && (
              <section className="view view--space view--recycle">
                <header className="view-header">
                  <h1><span className="title-accent" />存档管理</h1>
                  {archiveTab === 'documents' && (
                    <div className="header-actions">
                      <button className="button button--primary" type="button" onClick={() => setPdfArchiveImportOpen(true)}>
                        <span className="button-plus" aria-hidden="true">＋</span>批量导入 PDF
                      </button>
                    </div>
                  )}
                </header>
                <div className="view-body workbench-body">
                  <div className="subtabs" role="tablist" aria-label="存档管理分类">
                    <button
                      id="archive-tab-documents"
                      type="button"
                      className={archiveTab === 'documents' ? 'is-active' : ''}
                      role="tab"
                      aria-selected={archiveTab === 'documents'}
                      aria-controls="archive-panel"
                      tabIndex={archiveTab === 'documents' ? 0 : -1}
                      onClick={() => selectArchiveTab('documents')}
                      onKeyDown={(event) => handleArchiveTabKeyDown(event, 'documents')}
                    >文献存档 <span aria-label={`${archivedPdfDocuments.length} 篇`}>（{archivedPdfDocuments.length}）</span></button>
                    <button
                      id="archive-tab-recycle"
                      type="button"
                      className={archiveTab === 'recycle' ? 'is-active' : ''}
                      role="tab"
                      aria-selected={archiveTab === 'recycle'}
                      aria-controls="archive-panel"
                      tabIndex={archiveTab === 'recycle' ? 0 : -1}
                      onClick={() => selectArchiveTab('recycle')}
                      onKeyDown={(event) => handleArchiveTabKeyDown(event, 'recycle')}
                    >回收站 <span aria-label={`${recycledDocuments.length} 项`}>（{recycledDocuments.length}）</span></button>
                  </div>
                  <div id="archive-panel" role="tabpanel" aria-labelledby={`archive-tab-${archiveTab}`} style={{ display: 'flex', minHeight: 0, flex: '1 1 auto', flexDirection: 'column' }}>
                    {archiveTab === 'documents' ? <>
                      <div className="recycle-note" style={{ color: '#165dff', background: '#f2f7ff' }}>
                        PDF 导入后会在线解析并自动存档；打开原文可进行划词、截图和笔记，笔记可导出为 PDF。
                      </div>
                      <PdfArchiveTable
                        documents={archivedPdfDocuments}
                        onOpen={openDocument}
                        onDownload={(documentItem) => { void downloadArchivedPdf(documentItem) }}
                        onToggleFavorite={toggleFavorite}
                        onMoveToRecycle={requestDeleteDocument}
                      />
                    </> : <>
                      <div className="recycle-note">回收站中的内容可恢复或彻底删除；PDF 原件将在彻底删除前保留。</div>
                      <DocumentTable
                        documents={recycledDocuments}
                        mode="recycle"
                        page={page}
                        onPageChange={setPage}
                        onToggleFavorite={() => undefined}
                        onDelete={(id) => { void permanentlyDeleteDocument(id) }}
                        onShare={() => undefined}
                        onRestore={restoreDocument}
                      />
                    </>}
                  </div>
                </div>
              </section>
            )}
          </div>
          {activeSection === 'team' && (
            <TeamPanel
              tab={teamPanelTab}
              todos={todos}
              comments={comments}
              members={members}
              onTabChange={setTeamPanelTab}
              onToggleTodo={(id) => setTodos((current) => current.map((todo) => todo.id === id ? { ...todo, done: !todo.done } : todo))}
              onDeleteTodo={(id) => setTodos((current) => current.filter((todo) => todo.id !== id))}
              onAddTodoRequest={() => setModal('add-todo')}
              onAddComment={addComment}
              onInvite={() => {
                setInviteSelection(defaultInviteSelection)
                setInviteRoles(defaultRoles(defaultInviteSelection))
                setMemberSearch('')
                setModal('invite-member')
              }}
              onMemberRoleChange={(id, role) => setMembers((current) => current.map((member) => member.id === id ? { ...member, role } : member))}
              onRemoveMember={(id) => setMembers((current) => current.filter((member) => member.id !== id))}
            />
          )}
        </div>
        </>}
      </div>

      {dataTableHubOpen && !activeEditingDocument && (
        <DataTableHub
          documents={activeDataTableDocuments}
          tables={hubDataTables}
          currentUser={profile.name}
          suspended={modal !== null}
          onClose={closeDataTableHub}
          onOpenTable={(target) => openHubTable(target)}
          onCreateTable={openNewDataTableDialog}
          onImportToTable={(target) => openHubTable(target, 'import')}
          onShareTable={(target) => openHubTable(target, 'share')}
          onMoveToRecycle={(target) => requestDeleteDocument(target.documentId)}
        />
      )}

      {activeEditingDocument?.kind === '在线文档' && (
        <div className="document-editor-host" aria-hidden={activePdfDocument ? true : undefined} inert={activePdfDocument ? true : undefined}>
          <Suspense fallback={<div className="document-editor-loading" role="status"><span /><strong>正在打开文档编辑器…</strong></div>}>
            <ResearchDocumentEditor
              documentItem={activeEditingDocument}
              pdfDocuments={archivedPdfDocuments}
              initialBlockId={activeDocumentSearchTarget?.documentId === activeEditingDocument.id ? activeDocumentSearchTarget.blockId : undefined}
              initialSearchQuery={activeDocumentSearchTarget?.documentId === activeEditingDocument.id ? activeDocumentSearchTarget.query : undefined}
              onClose={closeActiveDocument}
              onSave={saveDocumentContent}
              onImportPdfFile={(file, onProgress) => importPdfFile(
                file,
                onProgress,
                activeEditingDocument.location,
                activeEditingDocument.spaceScope ?? (activeEditingDocument.location.startsWith('我的空间/') ? 'personal' : 'team'),
              )}
              onOpenPdfDocument={openPdfDocumentById}
            />
          </Suspense>
        </div>
      )}

      {activePdfDocument && (
        <Suspense fallback={<div className="document-editor-loading" role="status"><span /><strong>正在打开 PDF 文献…</strong></div>}>
          <PdfArchiveReader
            key={`pdf-archive-reader-${activePdfDocument.id}`}
            document={activePdfDocument}
            initialAnnotationId={activePdfSearchTarget?.documentId === activePdfDocument.id ? activePdfSearchTarget.annotationId : undefined}
            initialPageNumber={activePdfSearchTarget?.documentId === activePdfDocument.id ? activePdfSearchTarget.pageNumber : undefined}
            initialSearchQuery={activePdfSearchTarget?.documentId === activePdfDocument.id ? activePdfSearchTarget.query : undefined}
            onClose={closePdfDocument}
            onSaveAnnotations={saveActivePdfAnnotations}
            onDownload={() => downloadPdfArchive(activePdfDocument)}
            onExport={(annotations) => exportPdfNotes(activePdfDocument, annotations)}
          />
        </Suspense>
      )}

      {activeEditingDocument?.kind === '数据表格' && activeEditingDataTable && (
        <Suspense fallback={<div className="document-editor-loading" role="status"><span /><strong>正在打开数据表格…</strong></div>}>
          <DataTableWorkspace
            key={`data-table-workspace-${activeEditingDocument.id}`}
            documentItem={activeEditingDocument}
            table={activeEditingDataTable}
            currentUser={profile.name}
            teamName={activeTeam}
            collaboratorOptions={Array.from(new Set([
              ...activeEditingDataTable.share.collaborators,
              ...members.map((member) => member.name),
            ].filter((name) => name !== profile.name)))}
            initialSearchQuery={activeDocumentSearchTarget?.documentId === activeEditingDocument.id ? activeDocumentSearchTarget.query : undefined}
            initialAction={activeDataTableAction}
            onClose={closeActiveDocument}
            onSave={saveDataTableContent}
            onToast={showToast}
            onNavigationGuardChange={registerDataTableNavigationGuard}
          />
        </Suspense>
      )}

      {searchOpen && (
        <GlobalSearchDialog
          documents={documents}
          notes={researchNotes}
          onClose={() => setSearchOpen(false)}
          onOpenDocument={openDocument}
          onLocateDocument={locateDocument}
          onOpenNote={openNoteDetail}
        />
      )}

      {pdfArchiveImportOpen && (
        <Suspense fallback={<div className="document-editor-loading" role="status"><span /><strong>正在打开 PDF 导入工具…</strong></div>}>
          <PdfImportDialog
            open
            existingFiles={existingPdfFiles}
            onClose={() => setPdfArchiveImportOpen(false)}
            onImportFile={(file, onProgress) => importPdfFile(file, onProgress, '我的空间/文献存档', 'personal')}
            onOpenDocument={(documentId) => {
              setPdfArchiveImportOpen(false)
              openPdfDocumentById(documentId)
            }}
          />
        </Suspense>
      )}

      {previewDocument && (
        <Modal title={`查看：${previewDocument.title}`} onClose={() => setPreviewDocumentId(null)} hideFooter wide bodyClassName="document-preview-body">
          <div className="document-preview-summary">
            <span className="document-preview-kind">{previewDocument.kind}</span>
            <p>{previewDocument.description || '该文件暂无摘要。'}</p>
          </div>
          <dl className="document-preview-metadata">
            <div><dt>所属父文件夹</dt><dd>{previewDocument.location.split('/').filter(Boolean).at(-1) ?? '未分类'}</dd></div>
            <div><dt>文件大小</dt><dd>{previewDocument.size}</dd></div>
            <div><dt>创建者</dt><dd>{previewDocument.owner}</dd></div>
            <div><dt>创建时间</dt><dd>{previewDocument.createdAt}</dd></div>
            <div><dt>最后修改</dt><dd>{previewDocument.updatedAt ?? previewDocument.createdAt}</dd></div>
            <div><dt>最后打开</dt><dd>{previewDocument.visitedAt}</dd></div>
          </dl>
          <div className="document-preview-actions">
            <button type="button" className="button button--secondary" onClick={() => toggleFavorite(previewDocument.id)}>{previewDocument.favorite ? '取消收藏' : '收藏'}</button>
            <button type="button" className="button button--primary" onClick={() => setPreviewDocumentId(null)}>关闭</button>
          </div>
        </Modal>
      )}

      {activeProduct === 'research' && pendingDeletion && pendingDeletionTarget && (
        <Modal
          title={pendingDeletion.type === 'folder' ? '删除文件夹' : '移入回收站'}
          onClose={() => setPendingDeletion(null)}
          onSubmit={(event) => {
            event.preventDefault()
            if (pendingDeletion.type === 'folder') confirmFolderDeletion(pendingDeletion.id, pendingDeletion.scope)
            else moveDocumentToRecycle(pendingDeletion.id)
          }}
          confirmText={pendingDeletion.type === 'folder' ? '删除文件夹' : '移入回收站'}
          confirmDanger
        >
          <div className="delete-confirm-copy">
            <strong>确定处理“{'name' in pendingDeletionTarget ? pendingDeletionTarget.name : pendingDeletionTarget.title}”吗？</strong>
            <p>{pendingDeletion.type === 'folder'
              ? `仅删除当前文件夹入口；文件仍保留在${pendingDeletion.scope === 'team' ? '当前团队' : '个人空间'}文档列表，可继续访问。操作完成后可撤销。`
              : '文档将移入回收站，可在回收站恢复；本次操作完成后也可立即撤销。'}</p>
          </div>
        </Modal>
      )}

      {modal === 'profile-settings' && (
        <ProfileSettingsModal
          profile={profile}
          onClose={() => setModal(null)}
          onSave={saveProfile}
        />
      )}

      {modal === 'note-detail' && activeResearchNote && noteDocument && (
        <NoteDetailDialog
          note={activeResearchNote}
          documentItem={noteDocument}
          onClose={() => setModal(null)}
          onEdit={() => setModal('note-editor')}
          onOpenDocument={() => openDocument(noteDocument)}
        />
      )}

      {modal === 'note-editor' && noteDocument && (
        <NoteEditorDialog
          note={activeResearchNote}
          documentItem={noteDocument}
          onClose={() => setModal(activeResearchNote ? 'note-detail' : null)}
          onSave={saveResearchNote}
        />
      )}

      {activeProduct === 'research' && modal === 'new-folder' && (
        <Modal title="新建文件夹" onClose={() => setModal(null)} onSubmit={submitNewFolder} confirmText="确定">
          <label className="field-label" htmlFor="folder-name"><span className="required-mark">*</span> 文件夹名称：</label>
          <input className="text-field" id="folder-name" name="folderName" autoFocus maxLength={50} placeholder="请输入" />
        </Modal>
      )}

      {activeProduct === 'research' && modal === 'new-document' && (
        <Modal title={newContentSource === 'data-hub' ? '新建数据表格' : '新建在线文档'} onClose={() => { setModal(null); setNewDocumentError(''); setNewDocumentStorageError('') }} onSubmit={submitNewDocument} confirmText="创建并编辑">
          {newDocumentStorageError && <p className="field-error" role="alert">{newDocumentStorageError}</p>}
          {newContentSource === 'space' && <>
            <label className="field-label">内容类型：</label>
            <div className="document-type-list" aria-label="在线文档类型">
              <button type="button" className="is-selected" aria-pressed="true">
                <img className="document-type-icon" src="/assets/document-word.svg" alt="" /><span><strong>在线文档</strong><small>创建支持富文本编辑的科研笔记文档</small></span><img className="document-type-check" src="/assets/selected-check.svg" alt="" />
              </button>
            </div>
          </>}
          {newContentSource === 'data-hub' && <div className="data-sheet-modal-intro"><strong>统一纳入科研数据管理</strong><span>创建后可集中管理记录、导入文件和共享权限。</span></div>}
          {documentType === 'sheet' && <>
            <label className="field-label">数据表格模板：</label>
            <div className="data-sheet-template-options" role="radiogroup" aria-label="数据表格模板">
              <button type="button" role="radio" aria-checked={dataTableTemplate === 'project-progress'} className={dataTableTemplate === 'project-progress' ? 'is-selected' : ''} onClick={() => setDataTableTemplate('project-progress')}><img className="data-sheet-template-icon" src="/assets/iconpark/grid-nine.svg" alt="" /><strong>项目进度管理</strong><small>任务、负责人、状态、进度和截止时间</small></button>
              <button type="button" role="radio" aria-checked={dataTableTemplate === 'research-data'} className={dataTableTemplate === 'research-data' ? 'is-selected' : ''} onClick={() => setDataTableTemplate('research-data')}><img className="data-sheet-template-icon" src="/assets/iconpark/form-one.svg" alt="" /><strong>科研数据收集</strong><small>样本、类型、结果、单位和采集时间</small></button>
            </div>
          </>}
          <label className="field-label" htmlFor="document-title"><span className="required-mark">*</span> {documentType === 'sheet' ? '表格名称' : '文档名称'}：</label>
          <input
            ref={newDocumentTitleRef}
            className="text-field"
            id="document-title"
            name="documentTitle"
            value={newDocumentTitle}
            autoFocus
            maxLength={50}
            aria-invalid={Boolean(newDocumentError)}
            aria-describedby={newDocumentError ? 'new-document-title-error' : undefined}
            placeholder="请输入"
            onChange={(event) => { setNewDocumentTitle(event.target.value); setNewDocumentError(''); setNewDocumentStorageError('') }}
          />
          {newDocumentError && <p className="field-error" id="new-document-title-error">{newDocumentError}</p>}
        </Modal>
      )}

      {activeProduct === 'research' && modal === 'import-document' && (
        <Modal
          title="导入文档"
          onClose={cancelImport}
          onSubmit={submitImport}
          confirmText={isImporting ? '正在导入…' : '开始导入'}
          confirmDisabled={!importFile || isImporting}
        >
          {importError && <p className="field-error" role="alert">{importError}</p>}
          <label className={`upload-zone${importFileName ? ' has-file' : ''}`}>
            <span className="upload-icon" aria-hidden="true" />
            <strong>{importFileName || '点击选择需要导入的文件'}</strong>
            <small>支持 PDF、DOC、DOCX，单文件不超过 50 MB</small>
            <input type="file" accept=".pdf,.doc,.docx" disabled={isImporting} onChange={(event) => {
              const file = event.target.files?.[0] ?? null
              setImportFile(file)
              setImportFileName(file?.name ?? '')
              setImportError('')
            }} />
          </label>
          {isImporting && <div className="import-file-list">
            <article className="import-file-row is-progress"><img src={importFileName.toLocaleLowerCase().endsWith('.pdf') ? '/assets/reading/pdf.svg' : '/assets/reading/docx.svg'} alt="" /><div><strong>{importFileName}</strong><small>{importProgress < 78 ? '正在上传并校验文件…' : '正在生成文档索引…'}</small><span><i style={{ width: `${importProgress}%` }} /></span></div><b>{importProgress}%</b></article>
          </div>}
        </Modal>
      )}

      {activeProduct === 'research' && modal === 'add-todo' && (
        <Modal title="添加待办" onClose={() => setModal(null)} onSubmit={submitTodo} confirmText="确定">
          <label className="field-label" htmlFor="todo-level"><span className="required-mark">*</span> 紧急程度：</label>
          <select className="text-field" id="todo-level" name="todoLevel" defaultValue="warning">
            <option value="danger">高</option>
            <option value="warning">中</option>
            <option value="muted">低</option>
          </select>
          <label className="field-label" htmlFor="todo-title"><span className="required-mark">*</span> 待办事项：</label>
          <input className="text-field" id="todo-title" name="todoTitle" defaultValue="完成固态电解质论文初稿" />
          <label className="field-label" htmlFor="todo-due"><span className="required-mark">*</span> 截止时间：</label>
          <input className="text-field" id="todo-due" name="todoDue" type="date" defaultValue="2024-06-28" />
        </Modal>
      )}

      {activeProduct === 'research' && modal === 'new-team' && !teamMemberPickerOpen && (
        <Modal
          title="新建团队空间"
          onClose={() => { setTeamMemberPickerOpen(false); setModal(null) }}
          onSubmit={submitNewTeam}
          confirmText="确定"
        >
          <label className="field-label" htmlFor="team-name"><span className="required-mark">*</span> 空间名称：</label>
          <input
            className="text-field"
            id="team-name"
            ref={teamNameInputRef}
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
            autoFocus
            maxLength={30}
            placeholder="请输入"
          />
          <label className="field-label" id="team-invite-label"><span className="required-mark">*</span> 邀请成员：</label>
          <div className="invite-compound" id="team-invite" role="group" aria-labelledby="team-invite-label">
            <div className="invite-compound-content">
              {teamInviteSelection.length === 0
                ? <span className="invite-placeholder">请输入</span>
                : memberCandidates.filter((candidate) => teamInviteSelection.includes(candidate.id)).map((candidate) => (
                  <span className="invite-chip" key={candidate.id}>
                    <i style={{ background: candidate.color }}>{candidate.name[0]}</i>
                    <b>{candidate.name}</b>
                  </span>
                ))}
            </div>
            <button type="button" aria-label="选择邀请成员" onClick={openTeamMemberPicker}>
              <img src="/assets/figma/add-member.svg" alt="" />
            </button>
          </div>
        </Modal>
      )}

      {activeProduct === 'research' && modal === 'new-team' && teamMemberPickerOpen && (
        <Modal
          title="选择成员"
          onClose={cancelTeamMemberPicker}
          onSubmit={submitTeamMemberPicker}
          confirmText="确定"
          confirmDisabled={teamInviteDraftSelection.length === 0}
          wide
          tall
        >
          <MemberPicker
            candidates={memberCandidates}
            selectedIds={teamInviteDraftSelection}
            roles={teamInviteDraftRoles}
            search={memberSearch}
            onSearchChange={setMemberSearch}
            onToggle={(id) => {
              setTeamInviteDraftSelection((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
              setTeamInviteDraftRoles((current) => ({ ...current, [id]: current[id] ?? '查看员' }))
            }}
            onRemove={(id) => setTeamInviteDraftSelection((current) => current.filter((item) => item !== id))}
            onRoleChange={(id, role) => setTeamInviteDraftRoles((current) => ({ ...current, [id]: role }))}
          />
        </Modal>
      )}

      {activeProduct === 'research' && modal === 'invite-member' && !teamMemberPickerOpen && (
        <Modal
          title="选择成员"
          onClose={() => setModal(null)}
          onSubmit={submitInvite}
          confirmText="确定"
          confirmDisabled={inviteSelection.length === 0}
          wide
          tall
        >
          <MemberPicker
            candidates={memberCandidates}
            selectedIds={inviteSelection}
            roles={inviteRoles}
            search={memberSearch}
            onSearchChange={setMemberSearch}
            onToggle={(id) => {
              setInviteSelection((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
              setInviteRoles((current) => ({ ...current, [id]: current[id] ?? '查看员' }))
            }}
            onRemove={(id) => setInviteSelection((current) => current.filter((item) => item !== id))}
            onRoleChange={(id, role) => setInviteRoles((current) => ({ ...current, [id]: role }))}
          />
        </Modal>
      )}

      {toast && <div className={`toast toast--${toast.tone}`} role={toast.tone === 'error' ? 'alert' : 'status'} aria-live={toast.tone === 'error' ? 'assertive' : 'polite'}>
        <span className={toast.tone === 'error' ? 'toast-error-icon' : 'icon-check'} aria-hidden="true">{toast.tone === 'error' ? '!' : ''}</span>
        <span className="toast-message">{toast.message}</span>
        {toast.onAction && <button type="button" className="toast-action" onClick={() => {
          const action = toast.onAction
          setToast(null)
          action?.()
        }}>{toast.actionLabel ?? '撤销'}</button>}
      </div>}
    </main>
  )
}
