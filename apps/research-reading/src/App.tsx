import { PdfDownloadOptions } from './components/PdfDownloadOptions'
import { LocalFilePreview } from './components/LocalFilePreview'
import { TeamSpaceDialog } from './components/TeamSpaceDialog'
import { teamSpacesKey, normalizeRole, validateTeamSpace, type TeamSpace } from './teamSpaces'
import { BatchUploadDialog } from './components/BatchUploadDialog'
import { saveOriginalFile, deleteOriginalFile, downloadOriginalFile } from './localFiles'
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { initialComments, initialDocuments, initialFolders, initialMembers, initialResearchNotes, initialTodos, teamNames as defaultTeamNames } from './data'
import { DocumentTable } from './components/DocumentTable'
import { DataTableHub, type DataTableHubTarget } from './components/DataTableHub'
import { GlobalSearchDialog } from './components/GlobalSearchDialog'
import { MemberPicker, type CandidateRole, type MemberCandidate } from './components/MemberPicker'
import { Modal } from './components/Modal'
import { Sidebar, TopNavigation } from './components/Navigation'
import { ProfileSettingsModal } from './components/ProfileSettingsModal'
import { ReadingWorkspace } from './components/ReadingWorkspace'
import { ReadingReviewSidebar } from './readingReview/ReadingReviewSidebar'
import { ResearchReviewSidebar } from './researchReview/ResearchReviewSidebar'
import { usePrototypeFocus } from './prototypeFocus/FocusContext'
import { ServiceCapabilityPath } from './components/ServiceCapabilityPath'
import { NoteDetailDialog, NoteEditorDialog } from './components/ResearchNoteDialog'
import { SpaceView } from './components/SpaceView'
import { WorkspaceView } from './components/WorkspaceView'
import { useAudit } from './audit/AuditContext'
import { targets } from './audit/targets'
import { loadUserProfile, saveUserProfile, type UserProfile } from './profile'
import { isPersonalDocument, isTeamDocument, favoriteDocuments, parentFolderLabel, recentDocuments } from './workbenchDocuments'
import { loadFolders, persistFolders, type FolderScope } from './folderContent'
import { loadRecycledFolders, folderRecycleKey, folderTransaction, type RecycledFolder } from './folderRecycle'
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

const ResearchDocumentEditor = lazy(() => import('./components/ContinuousDocumentEditor').then((module) => ({ default: module.ContinuousDocumentEditor })))
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
const defaultRoles = (ids: string[]): Record<string, CandidateRole> => Object.fromEntries(ids.map((id) => [id, '可查看']))

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
  const [quickAccess, setQuickAccess] = useState<string[]>(() => {
    try { const value = JSON.parse(localStorage.getItem('research:quick-access:v1') ?? '[]'); return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [] } catch { return [] }
  })
  const toggleQuickAccess = (key: string) => {
    const next = quickAccess.includes(key) ? quickAccess.filter((id) => id !== key) : [...quickAccess, key]
    try { localStorage.setItem('research:quick-access:v1', JSON.stringify(next)); setQuickAccess(next) }
    catch { showError('快速访问保存失败，请检查浏览器存储空间') }
  }
  const [workbenchTab, setWorkbenchTab] = useState<WorkbenchTab>('recent')
  const [teamPanelTab, setTeamPanelTab] = useState<TeamPanelTab>('todo')
  const [documents, setDocuments] = useState<ResearchDocument[]>(() => loadResearchDocuments(initialDocuments))
  const [researchDataTables, setResearchDataTables] = useState<ResearchDataTable[]>(() => loadResearchDataTables(initialResearchDataTables))
  const [researchNotes, setResearchNotes] = useState<ResearchNote[]>(initialResearchNotes)
  const [recycledDocuments, setRecycledDocuments] = useState<ResearchDocument[]>(() => loadRecycledResearchDocuments())
  const [recycledFolders,setRecycledFolders]=useState(loadRecycledFolders)
  const [folders, setFolders] = useState<FolderItem[]>(() => loadFolders('personal', initialFolders))
  const [teamFolders, setTeamFolders] = useState<FolderItem[]>(() => loadFolders('team', initialFolders.map((folder) => ({ ...folder, location: 'AI研究团队' }))))
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos)
  const [comments, setComments] = useState<CommentItem[]>(initialComments)
  const [teamSpaces, setTeamSpaces] = useState<TeamSpace[]>(() => {
    try { const stored = JSON.parse(localStorage.getItem(teamSpacesKey) ?? 'null'); if (Array.isArray(stored) && stored.length && stored.every((space) => typeof space.name === 'string' && Array.isArray(space.members))) return stored.map((space) => ({ ...space, description: space.description ?? '', members: space.members.map((member: MemberItem) => ({ ...member, role: normalizeRole(member.role) })) })) } catch { /* Use initial spaces when storage is unavailable. */ }
    return defaultTeamNames.map((name) => ({ name, description: '', members: initialMembers.map((member) => ({ ...member, name: member.id === 1 ? loadUserProfile().name : member.name, role: normalizeRole(member.role) })) }))
  })
  const teamNames = teamSpaces.map((space) => space.name)
  const canReadDocument=(item:ResearchDocument)=>{
    if(isPersonalDocument(item))return true
    const space=teamSpaces.find(s=>s.name===item.location.split('/')[0])
    return space?space.members.some(m=>m.id===1):item.owned
  }
  const accessibleDocuments=useMemo(()=>documents.filter(canReadDocument),[documents,teamSpaces])
  const [spaceManagementOpen, setSpaceManagementOpen] = useState(false)
  const [teamDescription, setTeamDescription] = useState('')
  const [activeTeam, setActiveTeam] = useState(teamSpaces[0]?.name ?? defaultTeamNames[0])
  const currentSpace = teamSpaces.find((space) => space.name === activeTeam)
  const members = currentSpace?.members ?? []
  const isTeamAdmin = members.some((member) => member.id === 1 && member.role === '管理员')
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
  const [pdfArchiveImportOpen, setPdfArchiveImportOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile())
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [pendingDeletion, setPendingDeletion] = useState<PendingDeletion | null>(null)
  const [pdfDownloadItem, setPdfDownloadItem] = useState<ResearchDocument | null>(null)
  const [previewDocumentId, setPreviewDocumentId] = useState<number | null>(null)
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
  const { request: auditRequest } = useAudit()
  const { request: focusRequest, ready: focusReady, reject: focusReject } = usePrototypeFocus()

  useEffect(() => {
    if (!focusRequest || focusRequest.module !== 'research' || !focusRequest.target) return
    const {sequence, target, location} = focusRequest
    const stop = (message: string) => focusReject(sequence, `${focusRequest.id}：${message}`)
    if (activeProduct === 'reading' && document.documentElement.dataset.readingDraftDirty === 'true') { stop('阅读笔记有未保存内容，请先保存或放弃。'); return }
    const editing = documents.find(item => item.id === activeDocumentId)
    const sameSurface = (target.surface === 'editor' && editing?.kind === '在线文档') || (target.surface === 'table' && editing?.kind === '数据表格') || (target.surface === 'pdf' && activePdfDocumentId !== null)
    if ((activeDocumentId !== null || activePdfDocumentId !== null || dataTableHubOpen || previewDocumentId !== null) && !sameSurface) { stop('请先返回当前文档或表格，保留现有编辑内容后再定位。'); return }
    if ((modal !== null && modal !== target.modal) || (pdfArchiveImportOpen && target.surface !== 'import') || (searchOpen && target.surface !== 'search') || (spaceManagementOpen && target.surface !== 'members') || pendingDeletion || pdfDownloadItem) { stop('当前有已打开的业务窗口，请先处理或关闭后再定位。'); return }
    if ((target.modal === 'invite-member' || target.surface === 'members') && !isTeamAdmin) { stop('当前角色不能管理成员；请由管理员操作。'); return }
    setActiveProduct('research')
    if (location?.preserveSurface) { focusReady(sequence); return }
    if (target.surface === 'editor' || target.surface === 'table') {
      if (!sameSurface) {
        const item = documents.find(item => target.surface === 'editor' ? item.kind === '在线文档' : item.kind === '数据表格' && researchDataTables.some(table => table.documentId === item.id))
        if (!item) { stop(`当前没有可打开的${target.surface === 'editor' ? '在线文档' : '数据表格'}，请先自行创建或导入；定位不会创建示例。`); return }
        setActiveDocumentId(item.id)
      }
    } else if (target.surface === 'pdf') {
      if (!sameSurface) {
        const item = documents.find(item => Boolean(item.pdfArchive))
        if (!item) { stop('当前没有真实 PDF 存档，请先自行导入；定位不会伪造文献。'); return }
        setActivePdfDocumentId(item.id)
      }
    } else if (target.surface === 'import') setPdfArchiveImportOpen(true)
    else if (target.surface === 'search') setSearchOpen(true)
    else if (target.surface === 'members') { setActiveSection('team'); setTeamTreeExpanded(true); setSpaceManagementOpen(true) }
    else {
      if (target.section) { setActiveSection(target.section); setOpenFolderName(null); setPage(1); if (target.section === 'team') setTeamTreeExpanded(true) }
      if (target.tab) setWorkbenchTab(target.tab)
      if (target.teamTab) setTeamPanelTab(target.teamTab)
      if (target.modal && modal === null) setModal(target.modal)
    }
    focusReady(sequence)
  }, [focusRequest, focusReady, focusReject])

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
    if (!auditRequest) return
    const target = targets[auditRequest.targetId]
    if (!target) return

    const readingDraftDirty = document.documentElement.dataset.readingDraftDirty === 'true'
    if (target.product !== activeProduct && activeProduct === 'reading' && readingDraftDirty) {
      return
    }
    if (activeDocumentId !== null || activePdfDocumentId !== null || dataTableHubOpen) {
      return
    }

    setActiveProduct(target.product)
    if (target.product !== 'research' || auditRequest.location?.preserveSurface) return

    if (target.section) {
      setActiveSection(target.section)
      setOpenFolderName(null)
      setPage(1)
      if (target.section === 'team') setTeamTreeExpanded(true)
    }
    if (target.tab) setWorkbenchTab(target.tab)
    if (target.teamTab) setTeamPanelTab(target.teamTab)
    if (target.documentType) setDocumentType(target.documentType)

    if (target.modal) {
      // Never replace an open form: audit navigation must not discard a user's draft.
      if (modal !== null && modal !== target.modal) return
      setSearchOpen(false)
      setModal(target.modal)
      setTeamMemberPickerOpen(false)
    }
  }, [auditRequest])

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
    if(!canReadDocument(documentItem)){showError('当前账号无权访问此文档。');return}
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
        setDataTableHubOpen(false)
        return
      }
      if (match) {
        const linkedDocument = documents.find((item) => item.id === destinationTableId && item.kind === '数据表格')
        if (linkedDocument && activeDocumentIdRef.current !== linkedDocument.id) {
          const openedFromHub = Boolean(currentDataTableHistoryState().fromHub)
          dataTableHubOpenRef.current = openedFromHub
          setDataTableHubOpen(false)
          openDocument(linkedDocument, undefined, undefined, 'none')
        } else if (!linkedDocument) {
          activeDocumentIdRef.current = null
          setActiveDocumentId(null)
          setActiveDocumentSearchTarget(null)
          setActiveDataTableAction(undefined)
          dataTableHubOpenRef.current = true
          setDataTableHubOpen(false)
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
    if (documents.find(item => item.id === activeDocumentId)?.kind === '数据表格' && /^#table=\d+$/.test(window.location.hash)) {
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

  const saveDocumentContent = (value: { title: string; blocks: DocumentBlock[]; content: string; size: string; richHtml?: string }) => {
    if (activeDocumentId == null) return '无法确认当前文档，请返回列表后重试。'
    const target = documents.find((item) => item.id === activeDocumentId)
    if (!target) return '文档已不存在，请返回列表刷新后重试。'
    const timestamp = formatLocalDateTime()
    const nextDocument: ResearchDocument = {
      ...target,
      title: value.title,
      blocks: value.blocks,
      richHtml: value.richHtml,
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

  const openNewDocumentDialog = () => submitNewDocument(undefined, 'document')
  const openNewDataTableDialog = () => submitNewDocument(undefined, 'sheet')

  const openDataTableHub = () => {
    setActiveProduct('research')
    setActiveSection('workbench')
    setOpenFolderName(null)
    setSearchOpen(false)
    setModal(null)
    setDataTableHubOpen(false)
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
    showToast('该PDF笔记或来源文档已不可访问')
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
    if (activeSection !== 'workbench') return accessibleDocuments
    if (workbenchTab === 'quick') return accessibleDocuments.filter((item) => quickAccess.includes(`document:${item.id}`))
    if (workbenchTab === 'favorites') return favoriteDocuments(accessibleDocuments)
    if (workbenchTab === 'owned') return accessibleDocuments.filter((documentItem) => documentItem.owned)
    if (workbenchTab === 'shared') return accessibleDocuments.filter((documentItem) => documentItem.shared && !documentItem.owned)
    return recentDocuments(accessibleDocuments)
  }, [activeSection, accessibleDocuments, workbenchTab, quickAccess])

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

  const permanentlyDeleteDocument = async (id: number, confirmed = false) => {
    const target = recycledDocuments.find((doc) => doc.id === id)
    if (!target || (!confirmed && !window.confirm(`彻底删除“${target.title}”？该操作无法恢复。`))) return false
    const result = removePersistedResearchDocument(id)
    if (!result.ok) {
      showError(result.error)
      return
    }
    if (target.originalFileName) {
      try { await deleteOriginalFile(id) } catch { persistRecycledResearchDocument(target); showError('原文件删除失败，请重试'); return }
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
    if (target.kind === '数据表格') {
      const tableResult = removeResearchDataTable(id)
      if (!tableResult.ok) {
        const rollback=persistRecycledResearchDocument(target)
        showError(`${tableResult.error}${rollback.ok?'；文档保留在回收站，可重试。':'；索引恢复失败，请刷新核对。'}`)
        return
      }
      setResearchDataTables((current) => current.filter((table) => table.documentId !== id))
    }
    setRecycledDocuments((current) => current.filter((doc) => doc.id !== id))
    setResearchNotes((current) => current.filter((note) => note.documentId !== id))
    showToast('文档已彻底删除')
    return true
  }

  const restoreDocument = (id: number) => {
    const target = recycledDocuments.find((doc) => doc.id === id)
    if (!target) return
    const root=target.location.split('/')[0],scope=isPersonalDocument(target)?'personal':'team'
    if(scope==='team'&&!teamSpaces.some(s=>s.name===root&&s.members.some(m=>m.id===1))){showError('原团队已不存在或当前账号无权恢复，内容仍保留在回收站。');return}
    const allFolders=scope==='personal'?folders:teamFolders
    if(target.location!==root&&!allFolders.some(f=>`${f.location??root}/${f.name}`===target.location)){showError('原目录已不存在，请先恢复原文件夹；内容仍保留在回收站。');return}
    if(documents.some(d=>d.location===target.location&&d.title.toLocaleLowerCase()===target.title.toLocaleLowerCase())){showError('原位置存在同名内容，请先重命名冲突内容再恢复。');return}
    const restoredDocument = { ...target, deletedAt: undefined }
    const result = persistResearchDocument(restoredDocument)
    if (!result.ok) {
      showError(result.error)
      return
    }
    setRecycledDocuments((current) => current.filter((doc) => doc.id !== id))
    setDocuments((current) => [restoredDocument, ...current.filter((doc) => doc.id !== id)])
    showToast(`文档已恢复至 ${target.location.replace(/^我的空间/, '个人空间')}`)
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
    if(documentItem.pdfArchive)openDocument(documentItem)
    else showToast('笔记仅支持在PDF阅读页面创建')
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
    const folderLocation = `${scope === 'team' ? activeTeam : '我的空间'}${openFolderName ? '/' + openFolderName : ''}`
    const foldersInScope = current.filter((folder) => (folder.location ?? '我的空间') === folderLocation)
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
      location: folderLocation,
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

  const submitNewDocument = (event?: FormEvent<HTMLFormElement>, directType?: 'document' | 'sheet') => {
    event?.preventDefault()
    const effectiveType = directType ?? documentType
    setNewDocumentStorageError('')
    const title = directType ? (directType === 'sheet' ? '未命名表格' : '未命名文档') : newDocumentTitle.normalize('NFC').trim()
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
      location: !directType && newContentSource === 'data-hub'
        ? '科研数据管理/全部数据表'
        : activeSection === 'team'
        ? `${activeTeam}/${openFolderName ?? '文档'}`
        : `我的空间/${openFolderName ?? '研究'}`,
      owner: profile.name,
      createdAt: timestamp,
      visitedAt: timestamp,
      updatedAt: timestamp,
      size: '0 KB',
      kind: effectiveType === 'document' ? '在线文档' : '数据表格',
      favorite: false,
      owned: true,
      shared: activeSection === 'team',
      spaceScope: activeSection === 'team' || !directType && newContentSource === 'data-hub' ? 'team' : 'personal',
      description: effectiveType === 'document' ? '空白在线文档，尚未添加内容摘要。' : '新建的数据表格。',
      keywords: [],
      content: '',
      blocks: effectiveType === 'document' ? [createDocumentBlock('text')] : undefined,
    }
    const documentResult = persistResearchDocument(createdDocument)
    if (!documentResult.ok) {
      setNewDocumentStorageError(documentResult.error)
      if (directType) showError(documentResult.error)
      return
    }
    let createdDataTable: ResearchDataTable | null = null
    if (createdDocument.kind === '数据表格') {
      createdDataTable = createBlankResearchDataTable(documentId, directType ? 'blank' : dataTableTemplate, profile.name, timestamp)
      if (directType) createdDataTable.rows = Array.from({ length: 10 }, (_, index) => ({ id: `row-${documentId}-${index + 1}`, values: Object.fromEntries(createdDataTable!.columns.map((column) => [column.id, ''])), updatedAt: timestamp, updatedBy: profile.name }))
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
      documentItem.location === targetLocation && documentItem.pdfArchive?.originalName.normalize('NFC').trim().toLocaleLowerCase('zh-CN') === normalizedName
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

  const uploadLocalFile = async (file: File) => {
    if (!/\.(docx?|xlsx?|pdf)$/i.test(file.name)) throw new Error('仅支持 Word、Excel 和 PDF，暂不支持 PPT 及其他格式')
    if (!file.size) throw new Error('文件为空，无法上传')
    if (file.size > 50 * 1024 * 1024) throw new Error('单文件不能超过 50 MB')
    const scope: FolderScope = activeSection === 'team' ? 'team' : 'personal'
    const root = scope === 'team' ? activeTeam : '我的空间'
    const base = `${root}${openFolderName ? '/' + openFolderName : ''}`
    const parts = (file.webkitRelativePath || file.name).split('/').filter(Boolean)
    if (parts.some((part) => part === '.' || part === '..')) throw new Error('文件路径无效')
    const timestamp = formatLocalDateTime()
    const currentFolders = scope === 'team' ? teamFoldersRef.current : foldersRef.current
    const nextFolders = [...currentFolders]
    let location = base
    for (const name of parts.slice(0, -1)) {
      if (!nextFolders.some((folder) => folder.name === name && (folder.location ?? root) === location)) nextFolders.push({ id: nextId(nextFolders), name, location, owner: profile.name, count: 0, createdAt: timestamp, updatedAt: timestamp, size: '0 B' })
      location += '/' + name
    }
    if (nextFolders.length !== currentFolders.length) {
      const result = persistFolders(scope, nextFolders)
      if (!result.ok) throw new Error(result.error)
      if (scope === 'team') { teamFoldersRef.current = nextFolders; setTeamFolders(nextFolders) } else { foldersRef.current = nextFolders; setFolders(nextFolders) }
    }
    if (/\.pdf$/i.test(file.name)) {
      const result = await importPdfFile(file, () => undefined, location, scope)
      if (!result.ok) throw new Error(result.error)
    } else {
      const id = documentIdCounterRef.current++
      const item: ResearchDocument = { id, title: file.name.slice(0, 50), originalFileName: file.name, location, owner: profile.name, createdAt: timestamp, updatedAt: timestamp, visitedAt: '', size: formatFileSize(file.size), kind: /\.docx?$/i.test(file.name) ? 'Word文档' : /\.(xlsx?|csv)$/i.test(file.name) ? 'Excel文档' : '附件', favorite: false, owned: true, shared: scope === 'team', spaceScope: scope, content: /\.(txt|md|csv)$/i.test(file.name) ? (await file.text()).slice(0, 120000) : '' }
      await saveOriginalFile(id, file)
      const result = persistResearchDocument(item)
      if (!result.ok) { await deleteOriginalFile(id); throw new Error(result.error) }
      setDocuments((current) => { const next = [item, ...current]; documentsRef.current = next; return next })
    }
    if (scope === 'team') setCreatedTeams((teams) => teams.filter((name) => name !== activeTeam))
  }
  const openImportDialog = () => setModal('import-document')

  const persistTeamSpaces = (next: TeamSpace[]) => {
    try { localStorage.setItem(teamSpacesKey, JSON.stringify(next)); setTeamSpaces(next); return '' }
    catch { return '空间信息保存失败，请检查浏览器存储空间' }
  }
  const setMembers = (update: (members: MemberItem[]) => MemberItem[]) => {
    if (!isTeamAdmin || !currentSpace) return
    const next = { ...currentSpace, members: update(members) }
    const error = validateTeamSpace(next, teamSpaces.filter((space) => space !== currentSpace)) || persistTeamSpaces(teamSpaces.map((space) => space === currentSpace ? next : space))
    if (error) showError(error)
  }
  const saveManagedSpace = (next: TeamSpace) => {
    if (!isTeamAdmin || !currentSpace) return '仅管理员可管理空间'
    const error = validateTeamSpace(next, teamSpaces.filter((space) => space !== currentSpace))
    if (error) return error
    const relocate = (location: string) => location === activeTeam || location.startsWith(activeTeam + '/') ? next.name + location.slice(activeTeam.length) : location
    const changedDocs = documents.filter((item) => relocate(item.location) !== item.location)
    const changed = persistResearchDocumentsBatch(changedDocs.map((item) => ({ ...item, location: relocate(item.location) })))
    if (!changed.ok) return changed.error
    const nextFolders = teamFolders.map((folder) => ({ ...folder, location: relocate(folder.location ?? activeTeam) }))
    const folderResult = persistFolders('team', nextFolders)
    if (!folderResult.ok) { persistResearchDocumentsBatch(changedDocs); return folderResult.error }
    const saveError = persistTeamSpaces(teamSpaces.map((space) => space === currentSpace ? next : space))
    if (saveError) { persistResearchDocumentsBatch(changedDocs); persistFolders('team', teamFolders); return saveError }
    setDocuments((items) => items.map((item) => ({ ...item, location: relocate(item.location) })))
    setTeamFolders(nextFolders)
    setCreatedTeams((items) => items.map((name) => name === activeTeam ? next.name : name))
    setActiveTeam(next.name); setSpaceManagementOpen(false); showToast('空间管理设置已保存'); return ''
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
    const newSpace: TeamSpace = { name, description: teamDescription.trim(), members: [{ id: 1, name: profile.name, role: '管理员', initials: profile.name[0], color: '#5b8ff9', status: '在线', joinedAt: new Date().toISOString().slice(0, 10) }, ...selectedMembers.filter((candidate) => candidate.name !== profile.name).map((candidate, index) => ({ id: index + 2, name: candidate.name, role: teamInviteRoles[candidate.id] ?? '可查看', initials: candidate.name[0], color: candidate.color, status: '在线' as const, joinedAt: candidate.date }))] }
    const saveError = validateTeamSpace(newSpace, teamSpaces) || persistTeamSpaces([...teamSpaces, newSpace])
    if (saveError) { showError(saveError); return }
    setCreatedTeams((current) => [...current, name])
    setTeamDescription('')
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
    if (!isTeamAdmin) return
    const selected = memberCandidates.filter((candidate) => inviteSelection.includes(candidate.id))
    if (!selected.length) return
    setMembers((current) => [
      ...current,
      ...selected.filter((candidate) => !current.some((member) => member.name === candidate.name)).map((candidate, index): MemberItem => ({
        id: nextId(current) + index,
        name: candidate.name,
        role: inviteRoles[candidate.id] ?? '可查看',
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
    const folderRoot = targetFolder.location ?? (scope === 'team' ? activeTeam : '我的空间')
    if (scope === 'team' && folderRoot !== activeTeam && !folderRoot.startsWith(activeTeam + '/')) {
      showError('该文件夹不属于当前团队，操作已停止')
      return false
    }
    if (current.some((folder) => folder.id !== id && ((folder.location ?? '我的空间') === folderRoot) && folder.name.toLocaleLowerCase() === normalizedName.toLocaleLowerCase())) {
      showError('同一空间内不能使用重复的文件夹名称')
      return false
    }
    const timestamp = formatLocalDateTime()
    const nextFolders = current.map((folder) => folder.id === id
      ? { ...folder, name: normalizedName, updatedAt: timestamp }
      : folder.location?.startsWith(`${folderRoot}/${targetFolder.name}/`) || folder.location === `${folderRoot}/${targetFolder.name}` ? { ...folder, location: `${folderRoot}/${normalizedName}${folder.location.slice(`${folderRoot}/${targetFolder.name}`.length)}` } : folder)
    const affectedDocuments = documents.filter((documentItem) => (
      documentItem.location === `${folderRoot}/${targetFolder.name}` || documentItem.location.startsWith(`${folderRoot}/${targetFolder.name}/`)
    ))
    const nextDocuments = affectedDocuments.map((documentItem) => ({
      ...documentItem,
      location: `${folderRoot}/${normalizedName}${documentItem.location.slice(`${folderRoot}/${targetFolder.name}`.length)}`,
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
    const current=scope==='team'?teamFolders:folders, root=current.find(f=>f.id===id)
    if(!root)return
    const parent=root.location??(scope==='team'?activeTeam:'我的空间'), path=parent+'/'+root.name
    if(scope==='team'&&!isTeamAdmin){showError('当前原型仅允许管理员删除团队文件夹。');return}
    const tree=current.filter(f=>f.id===id||f.location===path||f.location?.startsWith(path+'/'))
    const affected=documents.filter(d=>d.location===path||d.location.startsWith(path+'/'))
    const deletedAt=formatLocalDateTime(),bundle:RecycledFolder={id:Date.now(),scope,root:{...root,location:parent},folders:tree,documentIds:affected.map(d=>d.id),deletedAt}
    const nextFolders=current.filter(f=>!tree.some(t=>t.id===f.id)),nextTrash=[bundle,...recycledFolders]
    const error=folderTransaction(()=>{
      for(const item of affected){const result=persistRecycledResearchDocument({...item,deletedAt});if(!result.ok)throw Error(result.error)}
      const result=persistFolders(scope,nextFolders);if(!result.ok)throw Error(result.error)
      localStorage.setItem(folderRecycleKey,JSON.stringify(nextTrash))
    })
    if(error){showError(error);return}
    if(scope==='team')setTeamFolders(nextFolders);else setFolders(nextFolders)
    setDocuments(items=>items.filter(d=>!bundle.documentIds.includes(d.id)))
    setRecycledDocuments(items=>[...affected.map(d=>({...d,deletedAt})),...items])
    setRecycledFolders(nextTrash);setPendingDeletion(null);setOpenFolderName(null)
    showToast('文件夹及其内容已移入回收站，原目录结构已保留。')
  }

  const restoreFolder = (bundle:RecycledFolder) => {
    const current=bundle.scope==='team'?teamFolders:folders, parent=bundle.root.location!,space=parent.split('/')[0]
    if(bundle.scope==='team'&&!teamSpaces.some(s=>s.name===space&&s.members.some(m=>m.id===1&&m.role==='管理员'))){showError('原团队不存在或当前角色无恢复权限。');return}
    if(parent!==space&&!current.some(f=>(f.location??space)+'/'+f.name===parent)){showError('原父目录不存在，请先恢复父文件夹。');return}
    if(bundle.folders.some(f=>current.some(c=>c.id===f.id||((c.location??space)===(f.location??space)&&c.name.toLowerCase()===f.name.toLowerCase())))){showError('原目录存在同名或同标识文件夹，请先处理冲突。');return}
    const items=recycledDocuments.filter(d=>bundle.documentIds.includes(d.id)).map(d=>({...d,deletedAt:undefined}))
    if(items.some(d=>documents.some(c=>c.location===d.location&&c.title.toLowerCase()===d.title.toLowerCase()))){showError('原目录存在同名文件，请先处理冲突。');return}
    const nextFolders=[...current,...bundle.folders],nextTrash=recycledFolders.filter(f=>f.id!==bundle.id)
    const error=folderTransaction(()=>{
      const saved=persistFolders(bundle.scope,nextFolders);if(!saved.ok)throw Error(saved.error)
      const restored=persistResearchDocumentsBatch(items);if(!restored.ok)throw Error(restored.error)
      localStorage.setItem(folderRecycleKey,JSON.stringify(nextTrash))
    })
    if(error){showError(error);return}
    if(bundle.scope==='team')setTeamFolders(nextFolders);else setFolders(nextFolders)
    setDocuments(list=>[...items,...list]);setRecycledDocuments(list=>list.filter(d=>!bundle.documentIds.includes(d.id)));setRecycledFolders(nextTrash)
    showToast('文件夹及内容已恢复至 '+parent.replace(/^我的空间/,'个人空间'))
  }

  const purgeFolder = async (bundle:RecycledFolder) => {
    if(!window.confirm('彻底删除“'+bundle.root.name+'”及全部内容？此操作不可恢复。'))return
    for(const id of bundle.documentIds){
      const target=loadRecycledResearchDocuments().find(d=>d.id===id)
      if(!target)continue
      if(!(await permanentlyDeleteDocument(id,true)))return
    }
    try{const next=recycledFolders.filter(f=>f.id!==bundle.id);localStorage.setItem(folderRecycleKey,JSON.stringify(next));setRecycledFolders(next);showToast('文件夹已彻底删除')}catch{showError('回收站记录清理失败，请重试。')}
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
    if (documentItem.pdfArchive) { setPdfDownloadItem(documentItem); return }
    if (documentItem.originalFileName) { try { await downloadOriginalFile(documentItem) } catch (error) { showError(error instanceof Error ? error.message : '下载失败') }; return }
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

  return (
    <main className={`app-stage${activeProduct === 'reading' ? ' app-stage--reading' : ' app-stage--research-review'}`}>
      {activeProduct === 'reading' && <ReadingReviewSidebar />}
      {activeProduct === 'research' && <ResearchReviewSidebar />}
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
          onProfileOpen={openProfileSettings}
          profileName={profile.name}
          profileAvatar={profile.avatarDataUrl}
        />
        <div className="workspace-grid">
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
              <WorkspaceView onSearchOpen={openGlobalSearch} onDownloadDocument={item => { void downloadArchivedPdf(item) }}
                documents={visibleDocuments}
                quickFolders={[...folders.map((folder) => ({ ...folder, scope: 'personal' as const })), ...teamFolders.map((folder) => ({ ...folder, scope: 'team' as const }))].filter((folder) => quickAccess.includes(`${workbenchTab === 'favorites' ? 'favorite-folder' : 'folder'}:${folder.scope}:${folder.id}`))}
                onOpenQuickFolder={(folder) => { setActiveSection(folder.scope); if (folder.scope === 'team') { setActiveTeam(folder.location ?? activeTeam); setTeamTreeExpanded(true) }; setOpenFolderName(`${folder.location ?? (folder.scope === 'team' ? activeTeam : '我的空间')}/${folder.name}`.split('/').slice(1).join('/')); setPage(1) }}
                tab={workbenchTab}
                page={page}
                onTabChange={(tab) => { setWorkbenchTab(tab); setPage(1) }}
                onPageChange={setPage}
                quickAccess={quickAccess}
                onToggleQuickAccess={toggleQuickAccess}
                onToggleFavorite={toggleFavorite}
                onDelete={requestDeleteDocument}
                onRemoveRecent={removeFromRecent}
                onShare={shareDocument}
                onOpenDocument={openDocument}
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
                onOpenFolder={(folder) => { const root = '我的空间'; setOpenFolderName(`${folder.location ?? root}/${folder.name}`.slice(root.length + 1)); setPage(1) }}
                onRenameFolder={renameFolder}
                onDeleteFolder={deleteFolder}
                onBack={() => setOpenFolderName(null)}
                onNewFolder={() => setModal('new-folder')}
                onNewDocument={openNewDocumentDialog}
                onNewTable={openNewDataTableDialog}
                onImportDocument={openImportDialog}
                quickAccess={quickAccess}
                onToggleQuickAccess={toggleQuickAccess}
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
                onManageSpace={isTeamAdmin ? () => setSpaceManagementOpen(true) : undefined}
                teamName={activeTeam}
                folders={createdTeams.includes(activeTeam) ? [] : teamFolders.filter((folder) => folder.location === activeTeam || folder.location?.startsWith(activeTeam + '/'))}
                documents={createdTeams.includes(activeTeam) ? [] : teamDocuments}
                openFolderName={openFolderName}
                page={page}
                onPageChange={setPage}
                onOpenFolder={(folder) => { const root = activeSection === 'team' ? activeTeam : '我的空间'; setOpenFolderName(`${folder.location ?? root}/${folder.name}`.slice(root.length + 1)); setPage(1) }}
                onRenameFolder={renameFolder}
                onDeleteFolder={deleteFolder}
                onBack={() => setOpenFolderName(null)}
                onNewFolder={() => setModal('new-folder')}
                onNewDocument={openNewDocumentDialog}
                onNewTable={openNewDataTableDialog}
                onImportDocument={openImportDialog}
                quickAccess={quickAccess}
                onToggleQuickAccess={toggleQuickAccess}
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
              <section data-compliance-target="research-recycle" className="view view--space view--recycle">
                <div className="view-body workbench-body"><div className="recycle-note">回收站中的内容可恢复或彻底删除。</div>
                  <DocumentTable documents={recycledDocuments.filter(d=>!recycledFolders.some(f=>f.documentIds.includes(d.id)))} folderEntries={recycledFolders.map(bundle=>({key:String(bundle.id),item:{id:-bundle.id,title:bundle.root.name,location:bundle.root.location!,owner:bundle.root.owner??'当前用户',createdAt:bundle.root.createdAt??'',visitedAt:'',deletedAt:bundle.deletedAt,size:bundle.root.size??'0 B',kind:'附件',favorite:false,owned:true,shared:false},title:<span>{bundle.root.name}</span>,onOpen:()=>undefined,actions:<><button onClick={()=>restoreFolder(bundle)}>恢复</button><button className="danger-link" onClick={()=>void purgeFolder(bundle)}>彻底删除</button></>}))} mode="recycle" page={page} onPageChange={setPage} onToggleFavorite={() => undefined} onDelete={(id) => { void permanentlyDeleteDocument(id) }} onShare={() => undefined} onRestore={restoreDocument} />
                </div>
              </section>
            )}
          </div>

        </div>
        </>}
      </div>

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
            onDownload={async () => { setPdfDownloadItem(activePdfDocument); return {ok: true as const} }}
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
          documents={accessibleDocuments}
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

      {pdfDownloadItem && <Modal bodyClassName="pdf-download-options" title="下载 PDF" onClose={() => setPdfDownloadItem(null)} hideFooter><PdfDownloadOptions item={pdfDownloadItem} /></Modal>}
      {previewDocument && (
        <Modal title={`查看：${previewDocument.title}`} onClose={() => setPreviewDocumentId(null)} hideFooter wide bodyClassName="document-preview-body">
          <LocalFilePreview item={previewDocument} />
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
              ? '文件夹及其全部子目录和文件将移入回收站，保留原位置与目录结构，可整体恢复。'
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
        <Modal auditTarget="research-new-folder" title="新建文件夹" onClose={() => setModal(null)} onSubmit={submitNewFolder} confirmText="确定">
          <label className="field-label" htmlFor="folder-name"><span className="required-mark">*</span> 文件夹名称：</label>
          <input className="text-field" id="folder-name" name="folderName" autoFocus maxLength={50} placeholder="请输入" />
        </Modal>
      )}

      {activeProduct === 'research' && modal === 'new-document' && (
        <Modal auditTarget={documentType === 'sheet' ? 'research-new-sheet' : 'research-new-document'} title={newContentSource === 'data-hub' ? '新建数据表格' : '新建在线文档'} onClose={() => { setModal(null); setNewDocumentError(''); setNewDocumentStorageError('') }} onSubmit={submitNewDocument} confirmText="创建并编辑">
          {newDocumentStorageError && <p className="field-error" role="alert">{newDocumentStorageError}</p>}
          {newContentSource === 'space' && documentType === 'document' && <>
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

      {activeProduct === 'research' && modal === 'import-document' && <BatchUploadDialog onClose={() => setModal(null)} onUpload={uploadLocalFile} />}

      {activeProduct === 'research' && modal === 'add-todo' && (
        <Modal auditTarget="research-todo" title="添加待办" onClose={() => setModal(null)} onSubmit={submitTodo} confirmText="确定">
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

      {spaceManagementOpen && isTeamAdmin && currentSpace && <TeamSpaceDialog space={currentSpace} candidates={memberCandidates} onSave={saveManagedSpace} onClose={() => setSpaceManagementOpen(false)} />}
      {activeProduct === 'research' && modal === 'new-team' && !teamMemberPickerOpen && (
        <Modal
          auditTarget="research-new-team"
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
          <label className="field-label" htmlFor="team-description">空间简介：</label>
          <textarea id="team-description" className="text-field" rows={3} maxLength={500} value={teamDescription} placeholder="请输入空间简介" onChange={(event) => setTeamDescription(event.target.value)} />
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
          auditTarget="research-new-team"
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
              setTeamInviteDraftRoles((current) => ({ ...current, [id]: current[id] ?? '可查看' }))
            }}
            onRemove={(id) => setTeamInviteDraftSelection((current) => current.filter((item) => item !== id))}
            onRoleChange={(id, role) => setTeamInviteDraftRoles((current) => ({ ...current, [id]: role }))}
          />
        </Modal>
      )}

      {activeProduct === 'research' && modal === 'invite-member' && !teamMemberPickerOpen && (
        <Modal
          auditTarget="research-invite"
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
              setInviteRoles((current) => ({ ...current, [id]: current[id] ?? '可查看' }))
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
