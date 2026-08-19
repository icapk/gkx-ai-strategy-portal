import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { initialComments, initialDocuments, initialFolders, initialMembers, initialTodos, teamNames as defaultTeamNames } from './data'
import { DocumentTable } from './components/DocumentTable'
import { MemberPicker, type CandidateRole, type MemberCandidate } from './components/MemberPicker'
import { Modal } from './components/Modal'
import { Sidebar, TopNavigation } from './components/Navigation'
import { ReadingWorkspace } from './components/ReadingWorkspace'
import { SpaceView } from './components/SpaceView'
import { TeamPanel } from './components/TeamPanel'
import { WorkspaceView } from './components/WorkspaceView'
import type {
  CommentItem,
  FolderItem,
  MemberItem,
  ModalKind,
  ResearchDocument,
  Section,
  TeamPanelTab,
  TodoItem,
  WorkbenchTab,
} from './types'
import './styles.css'
import './reading.css'

const nextId = (items: Array<{ id: number }>) => Math.max(0, ...items.map((item) => item.id)) + 1

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

const getInitialProduct = (): 'research' | 'reading' => (
  new URLSearchParams(window.location.search).get('view') === 'reading' ? 'reading' : 'research'
)

export default function App() {
  const [activeProduct, setActiveProduct] = useState<'research' | 'reading'>(getInitialProduct)
  const [activeSection, setActiveSection] = useState<Section>('workbench')
  const [teamTreeExpanded, setTeamTreeExpanded] = useState(false)
  const [workbenchTab, setWorkbenchTab] = useState<WorkbenchTab>('recent')
  const [teamPanelTab, setTeamPanelTab] = useState<TeamPanelTab>('todo')
  const [documents, setDocuments] = useState<ResearchDocument[]>(initialDocuments)
  const [recycledDocuments, setRecycledDocuments] = useState<ResearchDocument[]>([])
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders)
  const [teamFolders, setTeamFolders] = useState<FolderItem[]>(initialFolders)
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos)
  const [comments, setComments] = useState<CommentItem[]>(initialComments)
  const [members, setMembers] = useState<MemberItem[]>(initialMembers)
  const [teamNames, setTeamNames] = useState(defaultTeamNames)
  const [activeTeam, setActiveTeam] = useState(defaultTeamNames[0])
  const [openFolderName, setOpenFolderName] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalKind>(null)
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importFileName, setImportFileName] = useState('')
  const [documentType, setDocumentType] = useState<'document' | 'sheet'>('document')
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
  const teamNameInputRef = useRef<HTMLInputElement | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2300)
  }

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('view', activeProduct)
    window.history.replaceState(window.history.state, '', url)
    document.title = activeProduct === 'reading' ? '智能阅读' : '智能科研'
  }, [activeProduct])

  const selectSection = (section: Section) => {
    setActiveSection(section)
    if (section === 'team') setTeamTreeExpanded(true)
    setOpenFolderName(null)
    setPage(1)
  }

  const toggleTeamTree = () => {
    if (activeSection !== 'team') {
      selectSection('team')
      return
    }
    setTeamTreeExpanded((expanded) => !expanded)
  }

  const visibleDocuments = useMemo(() => {
    if (activeSection !== 'workbench') return documents
    return documents
  }, [activeSection, documents, workbenchTab])

  const toggleFavorite = (id: number) => {
    setDocuments((current) => current.map((doc) => doc.id === id ? { ...doc, favorite: !doc.favorite } : doc))
    showToast('收藏状态已更新')
  }

  const deleteDocument = (id: number) => {
    const target = documents.find((doc) => doc.id === id)
    if (!target) return
    setDocuments((current) => current.filter((doc) => doc.id !== id))
    setRecycledDocuments((current) => [{ ...target, visitedAt: '2026-05-08 16:30' }, ...current])
    showToast('文档已移入回收站')
  }

  const permanentlyDeleteDocument = (id: number) => {
    setRecycledDocuments((current) => current.filter((doc) => doc.id !== id))
    showToast('文档已彻底删除')
  }

  const restoreDocument = (id: number) => {
    const target = recycledDocuments.find((doc) => doc.id === id)
    if (!target) return
    setRecycledDocuments((current) => current.filter((doc) => doc.id !== id))
    setDocuments((current) => [target, ...current])
    showToast('文档已恢复')
  }

  const shareDocument = (id: number) => {
    setDocuments((current) => current.map((doc) => doc.id === id ? { ...doc, shared: true } : doc))
    showToast(`已共享到${activeTeam}`)
  }

  const renameDocument = (id: number, title: string) => {
    setDocuments((current) => current.map((doc) => doc.id === id ? { ...doc, title } : doc))
    showToast('文档已重命名')
  }

  const createDocumentNote = (documentItem: ResearchDocument) => {
    showToast(`已为“${documentItem.title}”新建笔记`)
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
      author: '张三',
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
    const form = new FormData(event.currentTarget)
    const title = String(form.get('documentTitle') ?? '').trim()
    if (!title) return
    setDocuments((current) => [
      {
        id: nextId(current),
        title,
        location: activeSection === 'team' ? `${activeTeam}/文档` : '我的空间/研究',
        owner: '张三',
        createdAt: '2026-05-08 16:20',
        visitedAt: '2026-05-08 16:20',
        size: '0 KB',
        kind: documentType === 'document' ? '在线文档' : 'Excel文档',
        favorite: false,
        owned: true,
        shared: activeSection === 'team',
      },
      ...current,
    ])
    if (activeSection === 'team') setCreatedTeams((current) => current.filter((team) => team !== activeTeam))
    setModal(null)
    showToast(`在线文档“${title}”创建成功`)
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

  return (
    <main className={`app-stage${activeProduct === 'reading' ? ' app-stage--reading' : ''}`}>
      <div className="ambient ambient--left" aria-hidden="true" />
      <div className="ambient ambient--top" aria-hidden="true" />
      <div className="app-shell">
        {activeProduct === 'reading' ? (
          <ReadingWorkspace onSwitchToResearch={() => setActiveProduct('research')} />
        ) : <>
        <TopNavigation activeSection={activeSection} onSelect={selectSection} onReadingSelect={() => { setModal(null); setActiveProduct('reading') }} />
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
              />
            )}
            {activeSection === 'personal' && (
              <SpaceView
                mode="personal"
                folders={folders}
                documents={documents}
                openFolderName={openFolderName}
                page={page}
                onPageChange={setPage}
                onOpenFolder={(folder) => setOpenFolderName(folder.name)}
                onRenameFolder={renameFolder}
                onDeleteFolder={deleteFolder}
                onBack={() => setOpenFolderName(null)}
                onNewFolder={() => setModal('new-folder')}
                onNewDocument={() => setModal('new-document')}
                onImportDocument={() => setModal('import-document')}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteDocument}
                onShare={shareDocument}
                onRenameDocument={renameDocument}
                onCreateNote={createDocumentNote}
              />
            )}
            {activeSection === 'team' && (
              <SpaceView
                mode="team"
                teamName={activeTeam}
                folders={createdTeams.includes(activeTeam) ? [] : teamFolders}
                documents={createdTeams.includes(activeTeam) ? [] : documents}
                openFolderName={openFolderName}
                page={page}
                onPageChange={setPage}
                onOpenFolder={(folder) => setOpenFolderName(folder.name)}
                onRenameFolder={renameFolder}
                onDeleteFolder={deleteFolder}
                onBack={() => setOpenFolderName(null)}
                onNewFolder={() => setModal('new-folder')}
                onNewDocument={() => setModal('new-document')}
                onImportDocument={() => setModal('import-document')}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteDocument}
                onShare={shareDocument}
                onRenameDocument={renameDocument}
                onCreateNote={createDocumentNote}
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

      {activeProduct === 'research' && modal === 'new-folder' && (
        <Modal title="新建文件夹" onClose={() => setModal(null)} onSubmit={submitNewFolder} confirmText="确定">
          <label className="field-label" htmlFor="folder-name"><span className="required-mark">*</span> 文件夹名称：</label>
          <input className="text-field" id="folder-name" name="folderName" autoFocus maxLength={30} placeholder="请输入" />
        </Modal>
      )}

      {activeProduct === 'research' && modal === 'new-document' && (
        <Modal title="新建在线文档" onClose={() => setModal(null)} onSubmit={submitNewDocument} confirmText="确定">
          <label className="field-label"><span className="required-mark">*</span> 文档类型：</label>
          <div className="document-type-list" role="radiogroup" aria-label="文档类型">
            <button type="button" role="radio" aria-checked={documentType === 'document'} className={documentType === 'document' ? 'is-selected' : ''} onClick={() => setDocumentType('document')}>
              <img className="document-type-icon" src="/assets/document-word.svg" alt="" /><span><strong>文档</strong><small>创建富文本编辑文档</small></span>{documentType === 'document' && <img className="document-type-check" src="/assets/selected-check.svg" alt="" />}
            </button>
            <button type="button" role="radio" aria-checked={documentType === 'sheet'} className={documentType === 'sheet' ? 'is-selected' : ''} onClick={() => setDocumentType('sheet')}>
              <img className="document-type-icon" src="/assets/document-sheet.svg" alt="" /><span><strong>表格</strong><small>创建数据表格</small></span>{documentType === 'sheet' && <img className="document-type-check" src="/assets/selected-check.svg" alt="" />}
            </button>
          </div>
          <label className="field-label" htmlFor="document-title"><span className="required-mark">*</span> 文档名称：</label>
          <input className="text-field" id="document-title" name="documentTitle" maxLength={50} placeholder="请输入" />
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

      {activeProduct === 'research' && toast && <div className="sr-only" role="status">{toast}</div>}
    </main>
  )
}
