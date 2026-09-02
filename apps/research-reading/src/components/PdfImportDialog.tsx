import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from 'react'
import type { ResearchDocument } from '../types'
import { Modal } from './Modal'
import './PdfImportDialog.css'

const MAX_BATCH_FILES = 10
const MAX_FILE_BYTES = 50 * 1024 * 1024
const MAX_BATCH_BYTES = 200 * 1024 * 1024

export type PdfImportResult =
  | { ok: true; documentItem: ResearchDocument }
  | { ok: false; error: string }

export interface ExistingPdfFile {
  name: string
  size: number
}

export interface PdfImportDialogProps {
  open: boolean
  onClose: () => void
  onImportFile: (file: File, onProgress: (progress: number) => void) => Promise<PdfImportResult>
  onOpenDocument: (documentId: number) => void
  existingFiles: ExistingPdfFile[]
}

type QueueStatus = 'queued' | 'processing' | 'success' | 'failed'

interface ImportQueueItem {
  id: string
  file: File
  fingerprint: string
  status: QueueStatus
  progress: number
  error?: string
  documentId?: number
  knownArchive?: boolean
}

interface SelectionIssue {
  fileName: string
  message: string
}

let queueSequence = 0

const createQueueId = () => {
  queueSequence += 1
  return `pdf-import-${Date.now().toString(36)}-${queueSequence.toString(36)}`
}

const normalizeFileName = (fileName: string) => fileName.normalize('NFC').trim().toLocaleLowerCase('zh-CN')
const fileFingerprint = ({ name, size }: { name: string; size: number }) => `${normalizeFileName(name)}:${size}`
const isPdfFile = (file: File) => file.type.toLocaleLowerCase() === 'application/pdf' || /\.pdf$/i.test(file.name.trim())
const clampProgress = (progress: number) => Math.min(100, Math.max(0, Math.round(Number.isFinite(progress) ? progress : 0)))

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`
}

const readableImportError = (error: unknown) => {
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : ''
  if (message === 'password-protected') return '文件已加密，请解除密码后重试。'
  if (message === 'invalid-pdf') return '文件内容损坏或不是有效的 PDF。'
  if (/quota|storage|space/i.test(message)) return '存储空间不足，请释放空间后重试。'
  return message.trim().slice(0, 160) || '导入失败，请检查文件后重试。'
}

const statusLabel: Record<QueueStatus, string> = {
  queued: '待导入',
  processing: '在线解析',
  success: '已存档',
  failed: '失败',
}

const processingStage = (progress: number) => {
  if (progress < 25) return '上传校验'
  if (progress < 97) return '在线解析'
  return '写入存档'
}

export function PdfImportDialog({
  open,
  onClose,
  onImportFile,
  onOpenDocument,
  existingFiles,
}: PdfImportDialogProps) {
  const [items, setItems] = useState<ImportQueueItem[]>([])
  const [selectionIssues, setSelectionIssues] = useState<SelectionIssue[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [closeBlocked, setCloseBlocked] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const queueRef = useRef<ImportQueueItem[]>([])
  const processingRef = useRef(false)
  const dragDepthRef = useRef(0)

  const commitItems = (nextItems: ImportQueueItem[]) => {
    queueRef.current = nextItems
    setItems(nextItems)
  }

  const patchItem = (itemId: string, update: (item: ImportQueueItem) => ImportQueueItem) => {
    commitItems(queueRef.current.map((item) => item.id === itemId ? update(item) : item))
  }

  useEffect(() => {
    if (open) return
    queueRef.current = []
    processingRef.current = false
    dragDepthRef.current = 0
    setItems([])
    setSelectionIssues([])
    setIsDragging(false)
    setIsProcessing(false)
    setCloseBlocked(false)
  }, [open])

  useEffect(() => {
    if (!open || !isProcessing) return
    const protectCurrentBatch = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', protectCurrentBatch)
    return () => window.removeEventListener('beforeunload', protectCurrentBatch)
  }, [isProcessing, open])

  const counts = useMemo(() => items.reduce((result, item) => {
    result[item.status] += 1
    return result
  }, { queued: 0, processing: 0, success: 0, failed: 0 }), [items])

  const totalBytes = useMemo(() => items.reduce((total, item) => total + item.file.size, 0), [items])
  const finishedCount = counts.success + counts.failed
  const canAddFiles = !isProcessing && items.length < MAX_BATCH_FILES
  const visibleIssues = selectionIssues.slice(0, 4)

  const addFiles = (fileList: FileList | File[]) => {
    if (processingRef.current) {
      setCloseBlocked(true)
      return
    }
    const incomingFiles = Array.from(fileList)
    if (!incomingFiles.length) return

    const nextItems = [...queueRef.current]
    const archivedFingerprints = new Set(existingFiles.map(fileFingerprint))
    const knownFingerprints = new Set(nextItems.map((item) => item.fingerprint))
    const nextIssues: SelectionIssue[] = []
    let nextTotalBytes = nextItems.reduce((total, item) => total + item.file.size, 0)

    incomingFiles.forEach((file) => {
      const fingerprint = fileFingerprint(file)
      if (!isPdfFile(file)) {
        nextIssues.push({ fileName: file.name, message: '仅支持 PDF 格式。' })
        return
      }
      if (file.size <= 0) {
        nextIssues.push({ fileName: file.name, message: '文件为空，无法导入。' })
        return
      }
      if (file.size > MAX_FILE_BYTES) {
        nextIssues.push({ fileName: file.name, message: '单个文件不能超过 50 MB。' })
        return
      }
      if (knownFingerprints.has(fingerprint)) {
        nextIssues.push({ fileName: file.name, message: '已在本批次或存档中，已跳过。' })
        return
      }
      if (nextItems.length >= MAX_BATCH_FILES) {
        nextIssues.push({ fileName: file.name, message: '单批最多导入 10 个文件。' })
        return
      }
      if (nextTotalBytes + file.size > MAX_BATCH_BYTES) {
        nextIssues.push({ fileName: file.name, message: '加入后批次总大小将超过 200 MB。' })
        return
      }

      knownFingerprints.add(fingerprint)
      nextTotalBytes += file.size
      nextItems.push({
        id: createQueueId(),
        file,
        fingerprint,
        status: 'queued',
        progress: 0,
        knownArchive: archivedFingerprints.has(fingerprint),
      })
    })

    commitItems(nextItems)
    setSelectionIssues(nextIssues)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) addFiles(event.target.files)
    event.target.value = ''
  }

  const handleDragEnter = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    if (!canAddFiles) return
    dragDepthRef.current += 1
    setIsDragging(true)
  }

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    if (canAddFiles) event.dataTransfer.dropEffect = 'copy'
  }

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    if (!canAddFiles) return
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)
    if (dragDepthRef.current === 0) setIsDragging(false)
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    dragDepthRef.current = 0
    setIsDragging(false)
    if (!canAddFiles) return
    addFiles(event.dataTransfer.files)
  }

  const processItems = async (itemIds: string[]) => {
    if (processingRef.current || itemIds.length === 0) return
    processingRef.current = true
    setIsProcessing(true)
    setCloseBlocked(false)
    setSelectionIssues([])

    try {
      for (const itemId of itemIds) {
        const sourceItem = queueRef.current.find((item) => item.id === itemId)
        if (!sourceItem || (sourceItem.status !== 'queued' && sourceItem.status !== 'failed')) continue

        patchItem(itemId, (item) => ({ ...item, status: 'processing', progress: 1, error: undefined }))

        try {
          const result = await onImportFile(sourceItem.file, (progress) => {
            patchItem(itemId, (item) => item.status === 'processing'
              ? { ...item, progress: Math.max(item.progress, clampProgress(progress)) }
              : item)
          })

          if ('error' in result) {
            patchItem(itemId, (item) => ({ ...item, status: 'failed', error: readableImportError(result.error) }))
          } else if (!Number.isInteger(result.documentItem.id) || result.documentItem.id <= 0) {
            patchItem(itemId, (item) => ({ ...item, status: 'failed', error: '导入完成，但未能获取文档信息。' }))
          } else {
            patchItem(itemId, (item) => ({
              ...item,
              status: 'success',
              progress: 100,
              documentId: result.documentItem.id,
              error: undefined,
            }))
          }
        } catch (error) {
          patchItem(itemId, (item) => ({ ...item, status: 'failed', error: readableImportError(error) }))
        }
      }
    } finally {
      processingRef.current = false
      setIsProcessing(false)
      setCloseBlocked(false)
    }
  }

  const removeItem = (itemId: string) => {
    if (processingRef.current) return
    commitItems(queueRef.current.filter((item) => item.id !== itemId))
  }

  const retryItem = (itemId: string) => {
    if (processingRef.current) return
    void processItems([itemId])
  }

  const requestClose = () => {
    if (processingRef.current) {
      setCloseBlocked(true)
      return
    }
    onClose()
  }

  const submitDialog = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (processingRef.current) {
      setCloseBlocked(true)
      return
    }
    const queuedIds = queueRef.current.filter((item) => item.status === 'queued').map((item) => item.id)
    if (queuedIds.length) {
      void processItems(queuedIds)
      return
    }
    requestClose()
  }

  const openImportedDocument = (documentId: number) => {
    if (processingRef.current) return
    onClose()
    onOpenDocument(documentId)
  }

  if (!open) return null

  const confirmText = isProcessing
    ? '正在导入…'
    : counts.queued > 0
      ? `${finishedCount > 0 ? '继续导入' : '开始导入'}（${counts.queued}）`
      : '完成'

  return (
    <Modal
      title="批量导入 PDF 文献"
      onClose={requestClose}
      onSubmit={submitDialog}
      confirmText={confirmText}
      confirmDisabled={isProcessing || items.length === 0}
      cancelText={isProcessing ? '处理中' : '取消'}
      bodyClassName="pdf-import-modal-body"
      wide
    >
      <section className={`pdf-import-dialog${isProcessing ? ' is-processing' : ''}`} aria-label="PDF 文献批量导入">
        <label
          className={`pdf-import-dropzone${isDragging ? ' is-dragging' : ''}${!canAddFiles ? ' is-disabled' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            disabled={!canAddFiles}
            onChange={handleInputChange}
          />
          <span className="pdf-import-dropzone-icon"><img src="/assets/reading/pdf.svg" alt="" /></span>
          <strong>{items.length ? '继续添加 PDF 文献' : '点击或拖拽 PDF 文献到此处'}</strong>
          <small>{isProcessing ? '当前批次处理完成后可继续添加' : `支持多选，还可添加 ${MAX_BATCH_FILES - items.length} 个文件`}</small>
        </label>

        <p className="pdf-import-rules">
          <span>单个不超过 50 MB</span><i aria-hidden="true" /><span>单批不超过 200 MB</span><i aria-hidden="true" /><span>自动跳过重复文件</span>
        </p>

        {selectionIssues.length > 0 && (
          <div className="pdf-import-selection-issues" role="alert">
            <strong>部分文件未加入队列</strong>
            <ul>
              {visibleIssues.map((issue, index) => <li key={`${issue.fileName}-${index}`}><b title={issue.fileName}>{issue.fileName}</b><span>{issue.message}</span></li>)}
            </ul>
            {selectionIssues.length > visibleIssues.length && <small>另有 {selectionIssues.length - visibleIssues.length} 个文件未加入。</small>}
          </div>
        )}

        {items.length > 0 && (
          <section className="pdf-import-queue" aria-labelledby="pdf-import-queue-title">
            <header className="pdf-import-queue-header">
              <div><h3 id="pdf-import-queue-title">文件队列</h3><span>{items.length}/{MAX_BATCH_FILES} 个 · {formatFileSize(totalBytes)}/200 MB</span></div>
              <div className="pdf-import-counts" aria-live="polite">
                <span>待导入 {counts.queued}</span>
                {counts.processing > 0 && <span className="is-processing">在线解析 {counts.processing}</span>}
                {counts.success > 0 && <span className="is-success">已存档 {counts.success}</span>}
                {counts.failed > 0 && <span className="is-failed">失败 {counts.failed}</span>}
              </div>
            </header>

            <div className="pdf-import-list" role="list" aria-live="polite">
              {items.map((item, index) => (
                <article className={`pdf-import-item is-${item.status}`} role="listitem" key={item.id}>
                  <span className="pdf-import-order" aria-label={`队列第 ${index + 1} 项`}>{index + 1}</span>
                  <img className="pdf-import-file-icon" src="/assets/reading/pdf.svg" alt="" />
                  <div className="pdf-import-file-copy">
                    <strong title={item.file.name}>{item.file.name}</strong>
                    <small>{formatFileSize(item.file.size)}{item.status === 'queued' && item.knownArchive ? ' · 已有同名存档，将核对原件并直接关联' : ''}{item.status === 'processing' ? ` · ${processingStage(item.progress)}` : ''}{item.error ? ` · ${item.error}` : ''}</small>
                    {item.status === 'processing' && (
                      <span
                        className="pdf-import-progress"
                        role="progressbar"
                        aria-label={`${item.file.name}${processingStage(item.progress)}进度`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={item.progress}
                      ><i style={{ width: `${item.progress}%` }} /></span>
                    )}
                  </div>
                  <div className="pdf-import-item-actions">
                    <span className={`pdf-import-status is-${item.status}`}>{item.status === 'processing' ? processingStage(item.progress) : statusLabel[item.status]}{item.status === 'processing' ? ` ${item.progress}%` : ''}</span>
                    {item.status === 'success' && item.documentId != null && <button type="button" disabled={isProcessing} onClick={() => openImportedDocument(item.documentId!)}>打开原文</button>}
                    {item.status === 'failed' && <button type="button" disabled={isProcessing} onClick={() => retryItem(item.id)}>重试</button>}
                    {(item.status === 'queued' || item.status === 'failed') && <button type="button" className="is-remove" disabled={isProcessing} onClick={() => removeItem(item.id)}>移除</button>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {closeBlocked && <p className="pdf-import-close-notice" role="status">文件正在按顺序在线解析并写入存档，本批次完成后即可关闭。</p>}

        {!isProcessing && finishedCount > 0 && counts.queued === 0 && (
          <div className={`pdf-import-result-summary${counts.failed > 0 ? ' has-failure' : ''}`} role="status">
            <span className="pdf-import-result-icon" aria-hidden="true" />
            <div>
              <strong>{counts.failed > 0 ? '本批次已完成，部分文件需处理' : '本批次已全部在线解析并存档'}</strong>
              <p>已存档 {counts.success} 个{counts.failed > 0 ? `，失败 ${counts.failed} 个，可在上方单独重试。` : '，可直接打开原文并阅读。'}</p>
            </div>
          </div>
        )}
      </section>
    </Modal>
  )
}
