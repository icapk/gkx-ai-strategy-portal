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
import { NoteDetailDialog, NoteEditorDialog } from './components/ResearchNoteDialog'
import { SpaceView } from './components/SpaceView'
import { TeamPanel } from './components/TeamPanel'
import { WorkspaceView } from './components/WorkspaceView'
import { loadUserProfile, saveUserProfile, type UserProfile } from './profile'
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
  createDocumentBlock,
  loadRecycledResearchDocuments,
  loadResearchDocuments,
  persistRecycledResearchDocument,
  persistResearchDocument,
  removePersistedResearchDocument,
} from './documentContent'
import type {
  CommentItem,
  DocumentBlock,
  FolderItem,
  MemberItem,
  ModalKind,
  ResearchDocument,
  ResearchDataTable,
  ResearchNote,
  Section,
  TeamPanelTab,
  DataTableTemplate,
  TodoItem,
  WorkbenchTab,
} from './types'
import './styles.css'
import './reading.css'

const nextId = (items: Array<{ id: number }>) => Math.max(0, ...items.map((item) => item.id)) + 1

const ResearchDocumentEditor = lazy(() => import('./components/ResearchDocumentEditor').then((module) => ({ default: module.ResearchDocumentEditor })))
const DataTableWorkspace = lazy(() => import('./components/DataTableWorkspace').then((module) => ({ default: module.DataTableWorkspace })))

const formatDateTime = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const formatLocalDateTime = () => formatDateTime(new Date())

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
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders)
  const [teamFolders, setTeamFolders] = useState<FolderItem[]>(initialFolders)
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
  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile())
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importFileName, setImportFileName] = useState('')
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
  const highlightTimer = useRef<number | null>(null)
  const teamNameInputRef = useRef<HTMLInputElement | null>(null)
  const newDocumentTitleRef = useRef<HTMLInputElement | null>(null)
  const documentIdCounterRef = useRef(Math.max(0, ...documents.map((item) => item.id), ...recycledDocuments.map((item) => item.id)) + 1)
  const activeDocumentIdRef = useRef(activeDocumentId)
  const dataTableHubOpenRef = useRef(dataTableHubOpen)
  const activeDataTableFromHubRef = useRef(false)
  const dataTableNavigationGuardRef = useRef<(() => boolean) | null>(null)

  activeDocumentIdRef.current = activeDocumentId
  dataTableHubOpenRef.current = dataTableHubOpen

  const registerDataTableNavigationGuard = useCallback((guard: (() => boolean) | null) => {
    dataTableNavigationGuardRef.current = guard
  }, [])

  const showToast = (message: string) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2300)
  }

  useEffect(() => () => {
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
      if (activeProduct !== 'research' || activeDocumentId !== null || dataTableHubOpen || event.defaultPrevented || modal !== null || searchOpen) return
      if (!(event.metaKey || event.ctrlKey) || event.key.toLocaleLowerCase() !== 'k') return
      event.preventDefault()
      setSearchOpen(true)
    }
    window.addEventListener('keydown', openSearchFromKeyboard)
    return () => window.removeEventListener('keydown', openSearchFromKeyboard)
  }, [activeDocumentId, activeProduct, dataTableHubOpen, modal, searchOpen])

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
    if (documentItem.kind !== '在线文档' && documentItem.kind !== '数据表格') {
      showToast('当前文件类型暂不支持在线打开')
      return
    }
    const timestamp = formatLocalDateTime()
    const visitedDocument = { ...documentItem, visitedAt: timestamp }
    persistResearchDocument(visitedDocument)
    setDocuments((current) => current.map((item) => item.id === documentItem.id ? visitedDocument : item))
    setSearchOpen(false)
    setModal(null)
    setActiveDocumentSearchTarget(target ? { ...target, documentId: documentItem.id } : null)
    setActiveDataTableAction(documentItem.kind === '数据表格' ? dataTableAction : undefined)
    if (documentItem.kind === '数据表格') {
      const linkedHistoryState = currentDataTableHistoryState()
      const openedFromHub = historyMode === 'none'
        ? Boolean(linkedHistoryState.fromHub)
        : dataTableHubOpenRef.current
      activeDataTableFromHubRef.current = openedFromHub
      const existingTable = researchDataTables.find((item) => item.documentId === documentItem.id)
      if (!existingTable) {
        const blankTable = createBlankResearchDataTable(documentItem.id, 'project-progress', profile.name, timestamp)
        const tableResult = persistResearchDataTable(blankTable)
        if (!tableResult.ok) {
          showToast(tableResult.error)
          return
        }
        setResearchDataTables((current) => [blankTable, ...current])
      }
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
          showToast('该数据表格已不存在，已返回数据表格列表')
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
      showToast('该表格缺少索引信息，暂时无法打开')
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
    setSearchOpen(false)
    setModal(null)
    setActiveProduct('research')
    setActiveSection('workbench')
    setWorkbenchTab('recent')
    setOpenFolderName(null)
    setPage(1)
    setHighlightedDocumentId(documentItem.id)
    if (highlightTimer.current) window.clearTimeout(highlightTimer.current)
    highlightTimer.current = window.setTimeout(() => setHighlightedDocumentId(null), 2800)
    showToast(`已定位“${documentItem.title}”`)
  }

  const openNoteDetail = (note: ResearchNote) => {
    setSearchOpen(false)
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

  const standardDocuments = useMemo(
    () => documents.filter((documentItem) => documentItem.kind !== '数据表格'),
    [documents],
  )
  const activeDataTableDocuments = useMemo(
    () => documents.filter((documentItem) => documentItem.kind === '数据表格'),
    [documents],
  )
  const hubDataTables = useMemo(() => {
    const activeIds = new Set(activeDataTableDocuments.map((documentItem) => documentItem.id))
    return researchDataTables.filter((table) => activeIds.has(table.documentId))
  }, [activeDataTableDocuments, researchDataTables])

  const visibleDocuments = useMemo(() => {
    if (activeSection !== 'workbench') return standardDocuments
    if (workbenchTab === 'favorites') return standardDocuments.filter((documentItem) => documentItem.favorite)
    if (workbenchTab === 'owned') return standardDocuments.filter((documentItem) => documentItem.owned)
    if (workbenchTab === 'shared') return standardDocuments.filter((documentItem) => documentItem.shared && !documentItem.owned)
    return [...standardDocuments].sort((first, second) => second.visitedAt.localeCompare(first.visitedAt))
  }, [activeSection, standardDocuments, workbenchTab])

  const toggleFavorite = (id: number) => {
    const target = documents.find((doc) => doc.id === id)
    if (!target) return
    const nextDocument = { ...target, favorite: !target.favorite }
    const result = persistResearchDocument(nextDocument)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    setDocuments((current) => current.map((doc) => doc.id === id ? nextDocument : doc))
    showToast('收藏状态已更新')
  }

  const deleteDocument = (id: number) => {
    const target = documents.find((doc) => doc.id === id)
    if (!target) return
    const recycledDocument = { ...target, visitedAt: formatLocalDateTime() }
    const result = persistRecycledResearchDocument(recycledDocument)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    setDocuments((current) => current.filter((doc) => doc.id !== id))
    setRecycledDocuments((current) => [recycledDocument, ...current.filter((doc) => doc.id !== id)])
    showToast(target.kind === '数据表格' ? '数据表格已移入回收站' : '文档已移入回收站')
  }

  const permanentlyDeleteDocument = (id: number) => {
    const target = recycledDocuments.find((doc) => doc.id === id)
    if (!target || !window.confirm(`彻底删除“${target.title}”？该操作无法恢复。`)) return
    const result = removePersistedResearchDocument(id)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    setRecycledDocuments((current) => current.filter((doc) => doc.id !== id))
    setResearchNotes((current) => current.filter((note) => note.documentId !== id))
    if (target.kind === '数据表格') {
      const tableResult = removeResearchDataTable(id)
      if (!tableResult.ok) {
        showToast(`文档已删除，但表格缓存清理失败：${tableResult.error}`)
        return
      }
      setResearchDataTables((current) => current.filter((table) => table.documentId !== id))
    }
    showToast('文档已彻底删除')
  }

  const restoreDocument = (id: number) => {
    const target = recycledDocuments.find((doc) => doc.id === id)
    if (!target) return
    const result = persistResearchDocument(target)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    setRecycledDocuments((current) => current.filter((doc) => doc.id !== id))
    setDocuments((current) => [target, ...current.filter((doc) => doc.id !== id)])
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
        showToast('无法读取数据表格，请先打开表格后重试')
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
        showToast(tableResult.error)
        return
      }
    }
    const result = persistResearchDocument(nextDocument)
    if (!result.ok) {
      const rollbackResult = previousDataTable ? persistResearchDataTable(previousDataTable) : null
      showToast(rollbackResult && !rollbackResult.ok
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
    if (!target) return
    const normalizedTitle = title.normalize('NFC').trim()
    if (!normalizedTitle || Array.from(normalizedTitle).length > 50) {
      showToast('文档名称应为 1 至 50 个字符')
      return
    }
    const nextDocument = { ...target, title: normalizedTitle }
    const result = persistResearchDocument(nextDocument)
    if (!result.ok) {
      showToast(result.error)
      return
    }
    setDocuments((current) => current.map((doc) => doc.id === id ? nextDocument : doc))
    showToast('文档已重命名')
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
    const name = String(form.get('folderName') ?? '').trim()
    if (!name) return
    const setter = activeSection === 'team' ? setTeamFolders : setFolders
    setter((current) => [...current, { id: nextId(current), name, count: 0, updatedAt: '2026-05-08 16:20' }])
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
      size: '0 KB',
      kind: documentType === 'document' ? '在线文档' : '数据表格',
      favorite: false,
      owned: true,
      shared: activeSection === 'team',
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

  const submitImport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!importFileName || isImporting) return
    setImportProgress(55)
    setIsImporting(true)
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
    const setter = activeSection === 'team' ? setTeamFolders : setFolders
    setter((current) => current.map((folder) => folder.id === id ? { ...folder, name } : folder))
    showToast('文件夹已重命名')
  }

  const deleteFolder = (id: number) => {
    const setter = activeSection === 'team' ? setTeamFolders : setFolders
    setter((current) => current.filter((folder) => folder.id !== id))
    showToast('文件夹已删除')
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

  return (
    <main className={`app-stage${activeProduct === 'reading' ? ' app-stage--reading' : ''}`}>
      <div className="ambient ambient--left" aria-hidden="true" />
      <div className="ambient ambient--top" aria-hidden="true" />
      <div className="app-shell" aria-hidden={activeEditingDocument || dataTableHubOpen ? true : undefined} inert={activeEditingDocument || dataTableHubOpen ? true : undefined}>
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
                onDelete={deleteDocument}
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
                documents={standardDocuments}
                openFolderName={openFolderName}
                page={page}
                onPageChange={setPage}
                onOpenFolder={(folder) => setOpenFolderName(folder.name)}
                onRenameFolder={renameFolder}
                onDeleteFolder={deleteFolder}
                onBack={() => setOpenFolderName(null)}
                onNewFolder={() => setModal('new-folder')}
                onNewDocument={openNewDocumentDialog}
                onImportDocument={() => setModal('import-document')}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteDocument}
                onShare={shareDocument}
                onRenameDocument={renameDocument}
                onCreateNote={createDocumentNote}
                onOpenDocument={openDocument}
              />
            )}
            {activeSection === 'team' && (
              <SpaceView
                mode="team"
                teamName={activeTeam}
                folders={createdTeams.includes(activeTeam) ? [] : teamFolders}
                documents={createdTeams.includes(activeTeam) ? [] : standardDocuments}
                openFolderName={openFolderName}
                page={page}
                onPageChange={setPage}
                onOpenFolder={(folder) => setOpenFolderName(folder.name)}
                onRenameFolder={renameFolder}
                onDeleteFolder={deleteFolder}
                onBack={() => setOpenFolderName(null)}
                onNewFolder={() => setModal('new-folder')}
                onNewDocument={openNewDocumentDialog}
                onImportDocument={() => setModal('import-document')}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteDocument}
                onShare={shareDocument}
                onRenameDocument={renameDocument}
                onCreateNote={createDocumentNote}
                onOpenDocument={openDocument}
                emptyTeam={createdTeams.includes(activeTeam)}
              />
            )}
            {activeSection === 'recycle' && (
              <section className="view view--recycle">
                <header className="view-header"><h1><span className="title-accent" />回收站</h1></header>
                <div className="view-body recycle-body">
                  <div className="recycle-note">回收站中的内容将在 30 天后自动清除</div>
                  <DocumentTable
                    documents={recycledDocuments}
                    mode="recycle"
                    page={page}
                    onPageChange={setPage}
                    onToggleFavorite={() => undefined}
                    onDelete={permanentlyDeleteDocument}
                    onShare={() => undefined}
                    onRestore={restoreDocument}
                  />
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
          onMoveToRecycle={(target) => deleteDocument(target.documentId)}
        />
      )}

      {activeEditingDocument?.kind === '在线文档' && (
        <Suspense fallback={<div className="document-editor-loading" role="status"><span /><strong>正在打开文档编辑器…</strong></div>}>
          <ResearchDocumentEditor
            documentItem={activeEditingDocument}
            initialBlockId={activeDocumentSearchTarget?.documentId === activeEditingDocument.id ? activeDocumentSearchTarget.blockId : undefined}
            initialSearchQuery={activeDocumentSearchTarget?.documentId === activeEditingDocument.id ? activeDocumentSearchTarget.query : undefined}
            onClose={closeActiveDocument}
            onSave={saveDocumentContent}
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
          <input className="text-field" id="folder-name" name="folderName" autoFocus maxLength={30} placeholder="请输入" />
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
          onClose={() => { if (!isImporting) setModal(null) }}
          onSubmit={submitImport}
          confirmText="确定"
          confirmDisabled={!importFileName}
        >
          <label className={`upload-zone${importFileName ? ' has-file' : ''}`}>
            <span className="upload-icon" aria-hidden="true" />
            <strong>点击或拖拽文件到此处上传</strong>
            <small>支持Word、Pdf格式文件</small>
            <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setImportFileName(event.target.files?.[0]?.name ?? '')} />
          </label>
          {isImporting && <div className="import-file-list">
            <article className="import-file-row is-progress"><img src="/assets/reading/pdf.svg" alt="" /><div><strong>高离子电导率硫化物固态电解质的界面稳定化策略.pdf</strong><small>共15页｜15.8M</small><span><i style={{ width: `${importProgress}%` }} /></span></div><b>{importProgress}%</b></article>
            <article className="import-file-row"><img src="/assets/reading/docx.svg" alt="" /><div><strong>锂硫电池中多硫化物穿梭效应的抑制机制研究：基...docx</strong><small>共18页｜12.5M</small></div><button type="button" aria-label="移除待导入文档"><span aria-hidden="true" /></button></article>
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

      {toast && <div className="toast" role="status" aria-live="polite"><span className="icon-check" aria-hidden="true" />{toast}</div>}
    </main>
  )
}
