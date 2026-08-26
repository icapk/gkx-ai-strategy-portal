import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { initialReadingNotes, readingDocuments, type ReadingDocument } from '../readingData'
import { Modal } from './Modal'
import { ReadingLibrary } from './ReadingLibrary'
import { ReadingReader } from './ReadingReader'

interface ReadingWorkspaceProps {
  onSwitchToResearch: () => void
  onProfileOpen: () => void
  profileName: string
  profileAvatar?: string | null
}

export function ReadingWorkspace({ onSwitchToResearch, onProfileOpen, profileName, profileAvatar }: ReadingWorkspaceProps) {
  const [view, setView] = useState<'reader' | 'library' | 'upload'>('reader')
  const [documents, setDocuments] = useState(readingDocuments)
  const [activeDocumentId, setActiveDocumentId] = useState(1)
  const [librarySelectedDocumentId, setLibrarySelectedDocumentId] = useState<number | null>(1)
  const [notes, setNotes] = useState(initialReadingNotes)
  const [readerEditingNote, setReaderEditingNote] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadFolder, setUploadFolder] = useState('我的笔记库1')
  const [uploadFolderOpen, setUploadFolderOpen] = useState(false)
  const [uploadFolders, setUploadFolders] = useState(['我的笔记库1', '我的笔记库2', '我的笔记库3', '我的笔记库4'])
  const [uploadNewFolderOpen, setUploadNewFolderOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimerRef = useRef<number | null>(null)

  const activeDocument = documents.find((document) => document.id === activeDocumentId) ?? documents[0]

  const showToast = (message: string) => {
    if (toastTimerRef.current != null) window.clearTimeout(toastTimerRef.current)
    setToast(message)
    toastTimerRef.current = window.setTimeout(() => {
      setToast('')
      toastTimerRef.current = null
    }, 2200)
  }

  useEffect(() => () => {
    if (toastTimerRef.current != null) window.clearTimeout(toastTimerRef.current)
  }, [])

  useEffect(() => {
    if (librarySelectedDocumentId != null && documents.some((document) => document.id === librarySelectedDocumentId)) return
    setLibrarySelectedDocumentId(documents[0]?.id ?? null)
  }, [documents, librarySelectedDocumentId])

  const toggleFavorite = (id: number) => {
    setDocuments((current) => current.map((document) => document.id === id ? { ...document, favorite: !document.favorite } : document))
    showToast('收藏状态已更新')
  }

  const openDocument = (document: ReadingDocument) => {
    setLibrarySelectedDocumentId(document.id)
    setActiveDocumentId(document.id)
    setView('reader')
  }

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    setUploadFile(event.target.files?.[0] ?? null)
  }

  const submitUpload = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!uploadFile) return
    if (isUploading) return
    setIsUploading(true)
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
    setUploadFolders((current) => [name, ...current])
    setUploadFolder(name)
    setUploadNewFolderOpen(false)
    showToast(`已新建“${name}”`)
  }

  return (
    <>
      <div className="product-row reading-product-row">
        <div className="product-tabs" role="tablist" aria-label="产品切换">
          <button className="product-tab" type="button" role="tab" aria-selected="false" onClick={onSwitchToResearch}>智能科研</button>
          <button className="product-tab product-tab--active" type="button" role="tab" aria-selected="true">智能阅读</button>
        </div>
        <div className="reading-product-actions">
          {(view === 'reader' || view === 'upload') && <button className="reading-library-launch" type="button" onClick={() => setView('library')}>智能阅读库</button>}
          {(view === 'library' || readerEditingNote) && view !== 'upload' && <button className="reading-upload-button" type="button" onClick={() => { setUploadFolderOpen(false); setIsUploading(false); setView('upload') }}><img src="/assets/reading/upload.svg" alt="" />上传文件</button>}
          <button
            className="profile-button"
            type="button"
            aria-label={`打开个人信息设置（${profileName}）`}
            aria-haspopup="dialog"
            onClick={onProfileOpen}
          ><img className={profileAvatar ? 'is-custom-avatar' : undefined} src={profileAvatar || '/assets/avatar-user.svg'} alt="" /></button>
        </div>
      </div>

      {view === 'reader' ? (
        <ReadingReader
          documents={documents}
          activeDocumentId={activeDocument.id}
          documentTitle={activeDocument.title}
          favorite={activeDocument.favorite}
          notes={notes}
          onSelectDocument={setActiveDocumentId}
          onFavorite={() => toggleFavorite(activeDocument.id)}
          onNotesChange={setNotes}
          onEditingNoteChange={setReaderEditingNote}
          onToast={showToast}
        />
      ) : view === 'library' ? (
        <ReadingLibrary
          documents={documents}
          onDocumentsChange={setDocuments}
          selectedDocumentId={librarySelectedDocumentId}
          onSelectDocument={setLibrarySelectedDocumentId}
          onOpenDocument={openDocument}
          onBack={() => setView('reader')}
          onUpload={() => { setUploadFolderOpen(false); setIsUploading(false); setView('upload') }}
          onToast={showToast}
          folders={uploadFolders}
          onFoldersChange={setUploadFolders}
        />
      ) : (
        <section className="reading-upload-page" aria-label="上传文件">
          <h1>智能阅读</h1>
          <p>上传PDF论文、享受智能解析、实时翻译、图表提取、知识图谱等增强阅读体验</p>
          <form onSubmit={submitUpload}>
            <label className={`reading-upload-page-dropzone${uploadFile ? ' has-file' : ''}`}>
              <span><img src="/assets/reading/docx.svg" alt="" /><img src="/assets/reading/pdf.svg" alt="" /></span>
              <strong>{uploadFile?.name || '点击或拖拽上传文件，支持Word、Pdf格式'}</strong>
              <input type="file" accept=".pdf,.doc,.docx" disabled={isUploading} onChange={handleFile} />
            </label>
            <div className="reading-upload-page-folder"><span>上传至：</span><div className="reading-upload-folder-control"><button type="button" className={uploadFolderOpen ? 'is-open' : ''} aria-label="选择笔记库" aria-expanded={uploadFolderOpen} onClick={() => setUploadFolderOpen((open) => !open)}><span>{uploadFolder}</span><img src="/assets/direction-down.svg" alt="" /></button>{uploadFolderOpen && <div className="reading-upload-folder-menu">{uploadFolders.map((folder) => <button type="button" className={uploadFolder === folder ? 'is-active' : ''} key={folder} onClick={() => { setUploadFolder(folder); setUploadFolderOpen(false) }}>{folder}</button>)}</div>}</div><button className="reading-upload-new-folder" type="button" aria-label="新建文件夹" onClick={() => setUploadNewFolderOpen(true)}><img src="/assets/reading/create-folder.svg" alt="" /></button></div>
            {uploadFile && !isUploading && <button className="reading-upload-page-submit reading-primary-button" type="submit">上传文件</button>}
            {isUploading && <div className="reading-upload-page-progress"><article><img src={uploadFile?.name.toLowerCase().endsWith('.docx') ? '/assets/reading/docx.svg' : '/assets/reading/pdf.svg'} alt="" /><div><strong>{uploadFile?.name}</strong><small>共15页｜15.8M</small><span><i /></span></div><b>55%</b></article><article><img src="/assets/reading/docx.svg" alt="" /><div><strong>锂硫电池中多硫化物穿梭效应的抑制机制研究：基...docx</strong><small>共18页｜12.5M</small></div></article></div>}
          </form>
        </section>
      )}

      {uploadNewFolderOpen && <Modal title="新建文件夹" onClose={() => setUploadNewFolderOpen(false)} onSubmit={createUploadFolder}><label className="field-label" htmlFor="reading-upload-folder-name"><span className="required-mark">*</span> 文件夹名称：</label><input className="text-field" id="reading-upload-folder-name" name="folderName" autoFocus placeholder="请输入" /></Modal>}
      {toast && <div className="reading-toast" role="status" aria-live="polite">{toast}</div>}
    </>
  )
}
