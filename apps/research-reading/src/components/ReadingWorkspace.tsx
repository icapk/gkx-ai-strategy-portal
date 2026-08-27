import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { initialReadingNotes, readingDocuments, type ReadingDocument, type ReadingNote } from '../readingData'
import {
  createDefaultReadingWorkspaceState,
  loadReadingWorkspaceState,
  persistReadingWorkspaceState,
  type ReadingWorkspaceState,
} from '../readingWorkspaceStorage'
import { Modal } from './Modal'
import { ReadingLibrary } from './ReadingLibrary'
import { ReadingReader, type ReadingDraftController } from './ReadingReader'

interface ReadingWorkspaceProps {
  onSwitchToResearch: () => void
  onProfileOpen: () => void
  profileName: string
  profileAvatar?: string | null
}

type UploadPhase = 'idle' | 'uploading' | 'parsing' | 'failed'

interface UploadState {
  phase: UploadPhase
  progress: number
  error: string
}

const idleUploadState: UploadState = { phase: 'idle', progress: 0, error: '' }
const maxUploadBytes = 50 * 1024 * 1024

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const uniqueDocumentTitle = (fileName: string, documents: ReadingDocument[]) => {
  const base = fileName.replace(/\.(pdf|docx?)$/i, '').trim() || '未命名文献'
  const titles = new Set(documents.map((document) => document.title.toLocaleLowerCase()))
  if (!titles.has(base.toLocaleLowerCase())) return base
  let suffix = 2
  while (titles.has(`${base} (${suffix})`.toLocaleLowerCase())) suffix += 1
  return `${base} (${suffix})`
}

async function validateUploadFile(file: File): Promise<string | null> {
  const extension = file.name.toLocaleLowerCase().match(/\.(pdf|docx?)$/)?.[1] ?? ''
  if (!['pdf', 'doc', 'docx'].includes(extension)) return '仅支持 PDF、DOC、DOCX 格式，请重新选择文件。'
  if (file.size <= 0) return '文件为空，无法进行解析。'
  if (file.size > maxUploadBytes) return '文件超过 50 MB，请压缩后重试。'

  try {
    const header = new Uint8Array(await file.slice(0, 8).arrayBuffer())
    const isPdf = header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46 && header[4] === 0x2d
    const isZip = header[0] === 0x50 && header[1] === 0x4b
    const isLegacyWord = header[0] === 0xd0 && header[1] === 0xcf && header[2] === 0x11 && header[3] === 0xe0
    if ((extension === 'pdf' && !isPdf) || (extension === 'docx' && !isZip) || (extension === 'doc' && !isLegacyWord)) {
      return '文件结构与扩展名不一致，解析已停止，请检查文件后重试。'
    }
  } catch {
    return '无法读取文件内容，请检查文件权限后重试。'
  }

  return null
}

export function ReadingWorkspace({ onSwitchToResearch, onProfileOpen, profileName, profileAvatar }: ReadingWorkspaceProps) {
  const [initialLoad] = useState(() => loadReadingWorkspaceState(createDefaultReadingWorkspaceState(readingDocuments, initialReadingNotes)))
  const [workspace, setWorkspace] = useState<ReadingWorkspaceState>(initialLoad.state)
  const workspaceRef = useRef(workspace)
  const [view, setView] = useState<'reader' | 'library' | 'upload'>('reader')
  const [activeDocumentId, setActiveDocumentId] = useState(initialLoad.state.documents[0]?.id ?? 0)
  const [librarySelectedDocumentId, setLibrarySelectedDocumentId] = useState<number | null>(initialLoad.state.documents[0]?.id ?? null)
  const [readerEditingNote, setReaderEditingNote] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadFolder, setUploadFolder] = useState(initialLoad.state.folders[0] ?? '我的笔记库1')
  const [uploadFolderOpen, setUploadFolderOpen] = useState(false)
  const [uploadNewFolderOpen, setUploadNewFolderOpen] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>(idleUploadState)
  const [toast, setToast] = useState('')
  const toastTimerRef = useRef<number | null>(null)
  const uploadTimerRef = useRef<number | null>(null)
  const uploadAttemptRef = useRef(0)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const productTabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const uploadFolderControlRef = useRef<HTMLDivElement>(null)
  const uploadFolderTriggerRef = useRef<HTMLButtonElement>(null)
  const uploadFolderOptionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const suppressNextChildToastRef = useRef(false)
  const readerDraftControllerRef = useRef<ReadingDraftController | null>(null)
  const pendingReaderExitRef = useRef<(() => void) | null>(null)
  const [readerExitGuardOpen, setReaderExitGuardOpen] = useState(false)

  const { documents, folders: uploadFolders } = workspace
  const activeDocument = documents.find((document) => document.id === activeDocumentId) ?? documents[0] ?? null
  const activeNotes = activeDocument
    ? workspace.notes.filter((note) => note.documentId === activeDocument.id)
    : []
  const isUploading = uploadState.phase === 'uploading' || uploadState.phase === 'parsing'

  const showToast = (message: string) => {
    if (toastTimerRef.current != null) window.clearTimeout(toastTimerRef.current)
    setToast(message)
    toastTimerRef.current = window.setTimeout(() => {
      setToast('')
      toastTimerRef.current = null
    }, 2200)
  }

  const commitWorkspace = (candidate: ReadingWorkspaceState) => {
    const result = persistReadingWorkspaceState(candidate)
    if (!result.ok) {
      suppressNextChildToastRef.current = true
      window.queueMicrotask(() => {
        suppressNextChildToastRef.current = false
      })
      showToast(result.error)
      return false
    }
    workspaceRef.current = result.state
    setWorkspace(result.state)
    return true
  }

  const clearUploadTimer = () => {
    if (uploadTimerRef.current == null) return
    window.clearInterval(uploadTimerRef.current)
    uploadTimerRef.current = null
  }

  const cancelUpload = (announce = true) => {
    uploadAttemptRef.current += 1
    clearUploadTimer()
    setUploadState(idleUploadState)
    if (announce) showToast('已取消上传，文件未加入阅读库')
  }

  const clearUploadSelection = () => {
    cancelUpload(false)
    setUploadFile(null)
    if (uploadInputRef.current) uploadInputRef.current.value = ''
  }

  const closeUploadFolderMenu = (restoreFocus = false) => {
    setUploadFolderOpen(false)
    if (restoreFocus) window.requestAnimationFrame(() => uploadFolderTriggerRef.current?.focus())
  }

  const focusUploadFolderOption = (index: number) => {
    window.requestAnimationFrame(() => uploadFolderOptionRefs.current[index]?.focus())
  }

  const openUploadFolderMenu = (index = Math.max(0, uploadFolders.indexOf(uploadFolder))) => {
    if (uploadFolders.length === 0) return
    setUploadFolderOpen(true)
    focusUploadFolderOption(Math.min(Math.max(index, 0), uploadFolders.length - 1))
  }

  useEffect(() => () => {
    uploadAttemptRef.current += 1
    if (toastTimerRef.current != null) window.clearTimeout(toastTimerRef.current)
    clearUploadTimer()
  }, [])

  useEffect(() => {
    if (!initialLoad.recovered) return
    const result = persistReadingWorkspaceState(initialLoad.state)
    showToast(result.ok ? '已清理异常的本地阅读数据' : (initialLoad.error ?? result.error))
  }, [initialLoad])

  useEffect(() => {
    if (activeDocument && activeDocument.id === activeDocumentId) return
    setActiveDocumentId(documents[0]?.id ?? 0)
  }, [activeDocument, activeDocumentId, documents])

  useEffect(() => {
    if (librarySelectedDocumentId != null && documents.some((document) => document.id === librarySelectedDocumentId)) return
    setLibrarySelectedDocumentId(documents[0]?.id ?? null)
  }, [documents, librarySelectedDocumentId])

  useEffect(() => {
    if (uploadFolders.includes(uploadFolder)) return
    setUploadFolder(uploadFolders[0] ?? '我的笔记库1')
  }, [uploadFolder, uploadFolders])

  useEffect(() => {
    if (!uploadFolderOpen) return
    const closeFromOutside = (event: PointerEvent) => {
      if (!uploadFolderControlRef.current?.contains(event.target as Node)) closeUploadFolderMenu()
    }
    const closeFromViewportChange = () => closeUploadFolderMenu()
    document.addEventListener('pointerdown', closeFromOutside, true)
    window.addEventListener('resize', closeFromViewportChange)
    window.addEventListener('scroll', closeFromViewportChange, true)
    return () => {
      document.removeEventListener('pointerdown', closeFromOutside, true)
      window.removeEventListener('resize', closeFromViewportChange)
      window.removeEventListener('scroll', closeFromViewportChange, true)
    }
  }, [uploadFolderOpen])

  useEffect(() => {
    if (view === 'upload') return
    setUploadFolderOpen(false)
  }, [view])

  const toggleFavorite = (id: number) => {
    const current = workspaceRef.current
    const target = current.documents.find((document) => document.id === id)
    if (!target) return
    const documentsNext = current.documents.map((document) => document.id === id ? { ...document, favorite: !document.favorite } : document)
    if (commitWorkspace({ ...current, documents: documentsNext })) showToast(target.favorite ? '已取消收藏' : '已收藏到阅读库')
  }

  const updateDocuments = (documentsNext: ReadingDocument[]) => {
    const current = workspaceRef.current
    const favoriteChange = documentsNext.find((document) => {
      const previous = current.documents.find((item) => item.id === document.id)
      return previous && previous.favorite !== document.favorite
    })
    const movedDocument = documentsNext.find((document) => {
      const previous = current.documents.find((item) => item.id === document.id)
      return previous && previous.folder !== document.folder
    })
    const deletedCount = Math.max(0, current.documents.length - documentsNext.length)
    if (!commitWorkspace({ ...current, documents: documentsNext })) return false
    if (favoriteChange) showToast(favoriteChange.favorite ? '已收藏到阅读库' : '已取消收藏')
    else if (movedDocument) showToast(`已移动到“${movedDocument.folder}”`)
    else if (deletedCount > 0) showToast('文献已从阅读库删除')
    return true
  }

  const updateFolders = (foldersNext: string[]) => {
    const current = workspaceRef.current
    const removed = current.folders.filter((folder) => !foldersNext.includes(folder))
    const added = foldersNext.filter((folder) => !current.folders.includes(folder))
    let documentsNext = current.documents
    if (removed.length === 1 && added.length === 1 && foldersNext.length === current.folders.length) {
      documentsNext = current.documents.map((document) => document.folder === removed[0] ? { ...document, folder: added[0] } : document)
    } else if (removed.length > 0) {
      const fallbackFolder = foldersNext[0] ?? '我的笔记库1'
      documentsNext = current.documents.map((document) => removed.includes(document.folder) ? { ...document, folder: fallbackFolder } : document)
    }
    if (!commitWorkspace({ ...current, folders: foldersNext, documents: documentsNext })) return false
    if (removed.includes(uploadFolder)) setUploadFolder(added[0] ?? foldersNext[0] ?? '我的笔记库1')
    return true
  }

  const updateActiveNotes = (notesNext: ReadingNote[]) => {
    if (!activeDocument) return false
    const current = workspaceRef.current
    const otherNotes = current.notes.filter((note) => note.documentId !== activeDocument.id)
    const scopedNotes = notesNext.map((note) => ({ ...note, documentId: activeDocument.id }))
    return commitWorkspace({ ...current, notes: [...otherNotes, ...scopedNotes] })
  }

  const handleChildToast = (message: string) => {
    if (suppressNextChildToastRef.current) {
      suppressNextChildToastRef.current = false
      return
    }
    showToast(message)
  }

  const openDocument = (document: ReadingDocument) => {
    setLibrarySelectedDocumentId(document.id)
    setActiveDocumentId(document.id)
    setView('reader')
  }

  const selectReaderDocument = (documentId: number) => {
    if (!documents.some((document) => document.id === documentId)) return
    setReaderEditingNote(false)
    setLibrarySelectedDocumentId(documentId)
    setActiveDocumentId(documentId)
  }

  const handleReaderEditingNoteChange = useCallback((editing: boolean, controller?: ReadingDraftController) => {
    setReaderEditingNote(editing)
    readerDraftControllerRef.current = editing ? (controller ?? null) : null
  }, [])

  const requestReaderExit = (action: () => void) => {
    if (readerEditingNote && readerDraftControllerRef.current) {
      pendingReaderExitRef.current = action
      setReaderExitGuardOpen(true)
      return
    }
    action()
  }

  const finishReaderExit = (choice: 'save' | 'discard' | 'continue') => {
    if (choice === 'continue') {
      setReaderExitGuardOpen(false)
      pendingReaderExitRef.current = null
      return
    }
    const controller = readerDraftControllerRef.current
    if (choice === 'save' && controller && !controller.save()) return
    if (choice === 'discard') controller?.discard()
    const action = pendingReaderExitRef.current
    readerDraftControllerRef.current = null
    pendingReaderExitRef.current = null
    setReaderEditingNote(false)
    setReaderExitGuardOpen(false)
    window.requestAnimationFrame(() => action?.())
  }

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    cancelUpload(false)
    setUploadFile(event.target.files?.[0] ?? null)
  }

  const startUpload = async () => {
    const file = uploadFile
    if (!file || isUploading) return
    clearUploadTimer()
    const attempt = uploadAttemptRef.current + 1
    uploadAttemptRef.current = attempt
    setUploadFolderOpen(false)
    setUploadState({ phase: 'uploading', progress: 8, error: '' })

    const validationError = await validateUploadFile(file)
    if (uploadAttemptRef.current !== attempt) return
    if (validationError) {
      setUploadState({ phase: 'failed', progress: 0, error: validationError })
      showToast(validationError)
      return
    }

    let progress = 8
    uploadTimerRef.current = window.setInterval(() => {
      if (uploadAttemptRef.current !== attempt) {
        clearUploadTimer()
        return
      }
      progress = Math.min(100, progress + (progress < 68 ? 12 : 8))
      if (progress < 76) {
        setUploadState({ phase: 'uploading', progress, error: '' })
        return
      }
      if (progress < 100) {
        setUploadState({ phase: 'parsing', progress, error: '' })
        return
      }

      clearUploadTimer()
      const current = workspaceRef.current
      const folder = current.folders.includes(uploadFolder) ? uploadFolder : (current.folders[0] ?? '我的笔记库1')
      const documentId = Math.max(0, ...current.documents.map((document) => document.id)) + 1
      const document: ReadingDocument = {
        id: documentId,
        title: uniqueDocumentTitle(file.name, current.documents),
        authors: '作者待补充',
        journal: '用户上传',
        year: String(new Date().getFullYear()),
        type: file.name.toLocaleLowerCase().endsWith('.pdf') ? 'PDF' : 'Word',
        size: formatFileSize(file.size),
        favorite: false,
        folder,
      }
      const foldersNext = current.folders.includes(folder) ? current.folders : [folder, ...current.folders]
      if (!commitWorkspace({ ...current, folders: foldersNext, documents: [...current.documents, document] })) {
        setUploadState({ phase: 'failed', progress: 100, error: '文件解析完成，但保存到阅读库失败。请释放浏览器存储空间后重试。' })
        return
      }
      setActiveDocumentId(documentId)
      setLibrarySelectedDocumentId(documentId)
      setUploadFile(null)
      if (uploadInputRef.current) uploadInputRef.current.value = ''
      setUploadState(idleUploadState)
      setView('library')
      showToast('解析完成，文献已加入阅读库，可立即打开')
    }, 180)
  }

  const submitUpload = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void startUpload()
  }

  const createUploadFolder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('folderName') ?? '').trim()
    if (!name) return
    if (uploadFolders.some((folder) => folder.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      showToast('文件夹名称已存在')
      return
    }
    const current = workspaceRef.current
    if (!commitWorkspace({ ...current, folders: [name, ...current.folders] })) return
    setUploadFolder(name)
    setUploadNewFolderOpen(false)
    showToast(`已新建“${name}”`)
  }

  const openUploadView = () => {
    requestReaderExit(() => {
      cancelUpload(false)
      setUploadFolderOpen(false)
      setView('upload')
    })
  }

  const leaveUploadForLibrary = () => {
    requestReaderExit(() => {
      if (isUploading) cancelUpload(true)
      setUploadFolderOpen(false)
      setView('library')
    })
  }

  const switchToResearch = () => {
    requestReaderExit(() => {
      if (isUploading) cancelUpload(false)
      onSwitchToResearch()
    })
  }

  const handleProductTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const nextIndex = event.key === 'Home' || event.key === 'ArrowLeft' || event.key === 'ArrowUp'
      ? 0
      : event.key === 'End' || event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : index
    productTabRefs.current[nextIndex]?.focus()
    if (nextIndex === 0) switchToResearch()
  }

  const handleUploadFolderTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    if (uploadFolders.length === 0) return
    event.preventDefault()
    const selectedIndex = Math.max(0, uploadFolders.indexOf(uploadFolder))
    if (event.key === 'Home') openUploadFolderMenu(0)
    else if (event.key === 'End') openUploadFolderMenu(uploadFolders.length - 1)
    else if (event.key === 'ArrowDown') openUploadFolderMenu((selectedIndex + 1) % uploadFolders.length)
    else openUploadFolderMenu((selectedIndex - 1 + uploadFolders.length) % uploadFolders.length)
  }

  const handleUploadFolderMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const count = uploadFolders.length
    if (count === 0) return
    const activeIndex = uploadFolderOptionRefs.current.findIndex((option) => option === document.activeElement)
    if (event.key === 'Escape' || event.key === 'Tab') {
      event.preventDefault()
      closeUploadFolderMenu(true)
      return
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    if (event.key === 'Home') focusUploadFolderOption(0)
    else if (event.key === 'End') focusUploadFolderOption(count - 1)
    else if (event.key === 'ArrowDown') focusUploadFolderOption((activeIndex + 1 + count) % count)
    else focusUploadFolderOption((activeIndex - 1 + count) % count)
  }

  const selectUploadFolder = (folder: string) => {
    setUploadFolder(folder)
    closeUploadFolderMenu(true)
  }

  return (
    <>
      <div className="product-row reading-product-row">
        <div className="product-tabs" role="tablist" aria-label="产品切换">
          <button ref={(tab) => { productTabRefs.current[0] = tab }} id="reading-product-tab-research" className="product-tab" type="button" role="tab" aria-selected="false" aria-controls="reading-product-panel" tabIndex={-1} onKeyDown={(event) => handleProductTabKeyDown(event, 0)} onClick={switchToResearch}>智能科研</button>
          <button ref={(tab) => { productTabRefs.current[1] = tab }} id="reading-product-tab-reading" className="product-tab product-tab--active" type="button" role="tab" aria-selected="true" aria-controls="reading-product-panel" tabIndex={0} onKeyDown={(event) => handleProductTabKeyDown(event, 1)}>智能阅读</button>
        </div>
        <div className="reading-product-actions">
          {(view === 'reader' || view === 'upload') && <button className="reading-library-launch" type="button" onClick={leaveUploadForLibrary}>智能阅读库</button>}
          {(view === 'library' || readerEditingNote) && view !== 'upload' && <button className="reading-upload-button" type="button" onClick={openUploadView}><img src="/assets/reading/upload.svg" alt="" />上传文件</button>}
          <button
            className="profile-button"
            type="button"
            aria-label={`打开个人信息设置（${profileName}）`}
            aria-haspopup="dialog"
            onClick={onProfileOpen}
          ><img className={profileAvatar ? 'is-custom-avatar' : undefined} src={profileAvatar || '/assets/avatar-user.svg'} alt="" /></button>
        </div>
      </div>

      <div id="reading-product-panel" className="reading-product-panel" role="tabpanel" aria-labelledby="reading-product-tab-reading">
      {view === 'reader' && activeDocument ? (
        <ReadingReader
          key={activeDocument.id}
          documents={documents}
          activeDocumentId={activeDocument.id}
          documentTitle={activeDocument.title}
          favorite={activeDocument.favorite}
          notes={activeNotes}
          onSelectDocument={selectReaderDocument}
          onFavorite={() => toggleFavorite(activeDocument.id)}
          onNotesChange={updateActiveNotes}
          onEditingNoteChange={handleReaderEditingNoteChange}
          onToast={handleChildToast}
        />
      ) : view === 'library' ? (
        <ReadingLibrary
          documents={documents}
          onDocumentsChange={updateDocuments}
          selectedDocumentId={librarySelectedDocumentId}
          onSelectDocument={setLibrarySelectedDocumentId}
          onOpenDocument={openDocument}
          onBack={() => setView('reader')}
          onUpload={openUploadView}
          onToast={handleChildToast}
          folders={uploadFolders}
          onFoldersChange={updateFolders}
        />
      ) : (
        <section className="reading-upload-page" aria-label="上传文件">
          <h1>智能阅读</h1>
          <p>上传PDF论文、享受智能解析、实时翻译、图表提取、知识图谱等增强阅读体验</p>
          <form onSubmit={submitUpload}>
            <label className={`reading-upload-page-dropzone${uploadFile ? ' has-file' : ''}`}>
              <span><img src="/assets/reading/docx.svg" alt="" /><img src="/assets/reading/pdf.svg" alt="" /></span>
              <strong>{uploadFile?.name || '点击选择文件，支持 Word、PDF 格式'}</strong>
              <input ref={uploadInputRef} type="file" accept=".pdf,.doc,.docx" disabled={isUploading} onChange={handleFile} />
            </label>
            <div className="reading-upload-page-folder"><span>上传至：</span><div ref={uploadFolderControlRef} className="reading-upload-folder-control"><button ref={uploadFolderTriggerRef} type="button" className={uploadFolderOpen ? 'is-open' : ''} aria-label="选择笔记库" aria-haspopup="listbox" aria-controls="reading-upload-folder-list" aria-expanded={uploadFolderOpen} disabled={isUploading} onKeyDown={handleUploadFolderTriggerKeyDown} onClick={() => { if (uploadFolderOpen) closeUploadFolderMenu(); else openUploadFolderMenu() }}><span>{uploadFolder}</span><img src="/assets/direction-down.svg" alt="" /></button>{uploadFolderOpen && <div id="reading-upload-folder-list" className="reading-upload-folder-menu" role="listbox" aria-label="选择上传文件夹" onKeyDown={handleUploadFolderMenuKeyDown}>{uploadFolders.map((folder, index) => <button ref={(option) => { uploadFolderOptionRefs.current[index] = option }} type="button" role="option" aria-selected={uploadFolder === folder} tabIndex={-1} className={uploadFolder === folder ? 'is-active' : ''} key={folder} onClick={() => selectUploadFolder(folder)}>{folder}</button>)}</div>}</div><button className="reading-upload-new-folder" type="button" aria-label="新建文件夹" disabled={isUploading} onClick={() => { closeUploadFolderMenu(); setUploadNewFolderOpen(true) }}><img src="/assets/reading/create-folder.svg" alt="" /></button></div>
            {uploadFile && uploadState.phase === 'idle' && <button className="reading-upload-page-submit reading-primary-button" type="submit">上传文件</button>}
            {isUploading && <><div className="reading-upload-page-progress"><article><img src={uploadFile?.name.toLowerCase().endsWith('.pdf') ? '/assets/reading/pdf.svg' : '/assets/reading/docx.svg'} alt="" /><div><strong>{uploadFile?.name}</strong><small role="status" aria-live="polite" aria-atomic="true">{uploadState.phase === 'parsing' ? '上传完成，正在解析文献结构…' : `正在上传至“${uploadFolder}”`}</small><span role="progressbar" aria-label={`${uploadFile?.name ?? '文件'}上传进度`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={uploadState.progress} aria-valuetext={`${uploadState.progress}%`}><i style={{ width: `${uploadState.progress}%` }} /></span></div><b aria-hidden="true">{uploadState.progress}%</b></article></div><button className="reading-upload-page-submit" type="button" onClick={() => cancelUpload(true)}>取消上传</button></>}
            {uploadState.phase === 'failed' && <><div className="reading-upload-page-progress" role="alert"><article><img src={uploadFile?.name.toLowerCase().endsWith('.pdf') ? '/assets/reading/pdf.svg' : '/assets/reading/docx.svg'} alt="" /><div><strong>{uploadFile?.name || '文件解析失败'}</strong><small>{uploadState.error}</small></div><b>失败</b></article></div>{uploadFile && <button className="reading-upload-page-submit reading-primary-button" type="button" onClick={() => void startUpload()}>重试</button>}<button className="reading-upload-page-submit" type="button" onClick={clearUploadSelection}>取消</button></>}
          </form>
        </section>
      )}
      </div>

      {uploadNewFolderOpen && <Modal title="新建文件夹" onClose={() => setUploadNewFolderOpen(false)} onSubmit={createUploadFolder}><label className="field-label" htmlFor="reading-upload-folder-name"><span className="required-mark">*</span> 文件夹名称：</label><input className="text-field" id="reading-upload-folder-name" name="folderName" autoFocus placeholder="请输入" /></Modal>}
      {readerExitGuardOpen && <Modal title="保存笔记草稿？" onClose={() => finishReaderExit('continue')} hideFooter>
        <div className="reading-draft-guard">
          <p>当前笔记还有未保存的内容或图片。保存后继续，或明确放弃修改。</p>
          <div>
            <button className="button button--secondary" type="button" onClick={() => finishReaderExit('continue')}>继续编辑</button>
            <button className="button button--danger" type="button" onClick={() => finishReaderExit('discard')}>放弃修改</button>
            <button className="button button--primary" type="button" onClick={() => finishReaderExit('save')}>保存并继续</button>
          </div>
        </div>
      </Modal>}
      {toast && <div className="reading-toast" role="status" aria-live="polite">{toast}</div>}
    </>
  )
}
