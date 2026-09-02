import katex from 'katex'
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import 'katex/dist/katex.min.css'
import {
  cloneDocumentBlocks,
  createDocumentBlock,
  documentBlocksToText,
  estimateDocumentSize,
  getDocumentBlocks,
  normalizeHttpUrl,
} from '../documentContent'
import type {
  DocumentBlock,
  DocumentBookmarkBlock,
  DocumentFormulaBlock,
  DocumentImageBlock,
  DocumentListBlock,
  DocumentTextBlock,
  ResearchDocument,
} from '../types'
import { displayResearchLocation } from '../workbenchDocuments'
import { Modal } from './Modal'
import { PdfImportDialog, type PdfImportDialogProps, type PdfImportResult } from './PdfImportDialog'

interface ResearchDocumentEditorProps {
  documentItem: ResearchDocument
  initialBlockId?: string
  initialSearchQuery?: string
  pdfDocuments: ResearchDocument[]
  onImportPdfFile: PdfImportDialogProps['onImportFile']
  onOpenPdfDocument: (documentId: number) => void
  onClose: () => void
  onSave: (value: { title: string; blocks: DocumentBlock[]; content: string; size: string }) => string | null
}

type BlockType = DocumentBlock['type']
type BlockErrors = Record<string, string | undefined>

const blockOptions: Array<{ type: BlockType; symbol: string; label: string; description: string }> = [
  { type: 'text', symbol: 'T', label: '文本', description: '段落、标题或引用' },
  { type: 'list', symbol: '≡', label: '列表', description: '有序或无序条目' },
  { type: 'image', symbol: '▧', label: '图片', description: '图片、替代文本与图注' },
  { type: 'formula', symbol: 'ƒx', label: '公式', description: 'LaTeX 数学公式' },
  { type: 'bookmark', symbol: '↗', label: '网页书签', description: '网址、标题与摘要' },
  { type: 'divider', symbol: '—', label: '分割线', description: '划分内容章节' },
]

const blockLabels: Record<BlockType, string> = {
  text: '文本',
  list: '列表',
  image: '图片',
  formula: '数学公式',
  bookmark: '网页书签',
  divider: '分割线',
}

const textStyleLabels: Record<DocumentTextBlock['style'], string> = {
  paragraph: '正文',
  'heading-1': '一级标题',
  'heading-2': '二级标题',
  quote: '引用',
}

const MAX_IMAGE_BYTES = 4 * 1024 * 1024
const MAX_IMAGE_DATA_URL_LENGTH = 1_500_000
const MAX_DOCUMENT_BLOCKS = 200
const MAX_LIST_ITEMS = 100
const MAX_DOCUMENT_TEXT_CHARACTERS = 120_000
const PDF_REFERENCE_ORIGIN = 'https://pdf-archive.local'
let pdfReferenceSequence = 0

interface PdfReferenceMetadata {
  documentId: number
  originalName: string
  pageCount: number
  byteSize: number
  annotationCount: number
}

const getPdfReferenceMetadata = (block: DocumentBlock): PdfReferenceMetadata | null => {
  if (block.type !== 'bookmark') return null
  try {
    const referenceUrl = new URL(block.url)
    const pathMatch = referenceUrl.pathname.match(/^\/document\/(\d+)$/)
    if (referenceUrl.origin !== PDF_REFERENCE_ORIGIN || !pathMatch) return null
    const documentId = Number(pathMatch[1])
    if (!Number.isInteger(documentId) || documentId <= 0) return null
    return {
      documentId,
      originalName: (referenceUrl.searchParams.get('name') || block.title || 'PDF 文献').slice(0, 200),
      pageCount: Math.min(100_000, Math.max(0, Number(referenceUrl.searchParams.get('pages')) || 0)),
      byteSize: Math.min(200 * 1024 * 1024, Math.max(0, Number(referenceUrl.searchParams.get('bytes')) || 0)),
      annotationCount: Math.min(10_000, Math.max(0, Number(referenceUrl.searchParams.get('notes')) || 0)),
    }
  } catch {
    return null
  }
}

const createPdfReferenceBlock = (documentItem: ResearchDocument): DocumentBookmarkBlock => {
  pdfReferenceSequence += 1
  const archive = documentItem.pdfArchive
  const referenceUrl = new URL(`${PDF_REFERENCE_ORIGIN}/document/${documentItem.id}`)
  referenceUrl.searchParams.set('name', archive?.originalName || documentItem.title)
  referenceUrl.searchParams.set('pages', String(archive?.pageCount ?? 0))
  referenceUrl.searchParams.set('bytes', String(archive?.byteSize ?? 0))
  referenceUrl.searchParams.set('notes', String(archive?.annotationCount ?? 0))
  return {
    id: `pdf-reference-${Date.now().toString(36)}-${pdfReferenceSequence.toString(36)}`,
    type: 'bookmark',
    url: referenceUrl.toString(),
    title: documentItem.title,
    description: 'PDF 文献来源已归入存档管理；删除本卡片不会删除存档原文。',
  }
}

const formatPdfFileSize = (bytes: number, fallback: string) => {
  if (!bytes) return fallback || '大小未知'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`
}

const getEditorBlockText = (block: DocumentBlock) => {
  const pdfReference = getPdfReferenceMetadata(block)
  if (pdfReference && block.type === 'bookmark') return block.title || pdfReference.originalName
  return documentBlocksToText([block])
}

const getEditorBlocksText = (blocks: DocumentBlock[]) => blocks
  .map(getEditorBlockText)
  .map((part) => part.trim())
  .filter(Boolean)
  .join('\n')

const getEditorBlockLabel = (block: DocumentBlock) => getPdfReferenceMetadata(block) ? 'PDF 文献来源' : blockLabels[block.type]
const getEditorBlockSymbol = (block: DocumentBlock) => getPdfReferenceMetadata(block)
  ? 'PDF'
  : blockOptions.find((option) => option.type === block.type)?.symbol

const getFormulaHtml = (latex: string) => {
  if (!latex.trim()) return ''
  try {
    return katex.renderToString(latex, {
      displayMode: true,
      throwOnError: true,
      trust: false,
      strict: 'ignore',
    })
  } catch {
    return ''
  }
}

const loadImage = (source: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const image = new Image()
  image.onload = () => resolve(image)
  image.onerror = () => reject(new Error('decode-failed'))
  image.src = source
})

const prepareDocumentImage = async (file: File) => {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('type')
  }
  if (file.size > MAX_IMAGE_BYTES) throw new Error('size')

  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await loadImage(objectUrl)
    const maximumDimension = 1440
    const scale = Math.min(1, maximumDimension / Math.max(image.naturalWidth, image.naturalHeight))
    const width = Math.max(1, Math.round(image.naturalWidth * scale))
    const height = Math.max(1, Math.round(image.naturalHeight * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('process')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.82)
    if (dataUrl.length > MAX_IMAGE_DATA_URL_LENGTH) throw new Error('compressed-size')
    return dataUrl
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function AutoGrowTextarea({ value, onChange, className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const textarea = ref.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.max(textarea.scrollHeight, 72)}px`
  }, [value])

  return <textarea ref={ref} className={className} value={value} onChange={onChange} {...props} />
}

function FormulaPreview({ latex }: { latex: string }) {
  const html = useMemo(() => getFormulaHtml(latex), [latex])
  if (!latex.trim()) return <div className="document-formula-placeholder">输入 LaTeX 后将在此处预览</div>
  if (!html) return <div className="document-formula-placeholder is-error">公式语法无法解析，请检查括号和命令。</div>
  return <div className="document-formula-output" dangerouslySetInnerHTML={{ __html: html }} />
}

function InsertMenu({ onInsert, onClose }: { onInsert: (type: BlockType) => void; onClose: (restoreFocus: boolean) => void }) {
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus()
  }, [])

  useEffect(() => {
    const closeFromOutside = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (!target || menuRef.current?.contains(target) || target.closest('.document-block-insert > button')) return
      onClose(false)
    }
    document.addEventListener('pointerdown', closeFromOutside, true)
    return () => document.removeEventListener('pointerdown', closeFromOutside, true)
  }, [onClose])

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const menuItems = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'))
    if (!menuItems.length) return
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      onClose(true)
      return
    }
    const currentIndex = menuItems.indexOf(document.activeElement as HTMLButtonElement)
    let nextIndex: number | null = null
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % menuItems.length
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = menuItems.length - 1
    if (nextIndex == null) return
    event.preventDefault()
    menuItems[nextIndex]?.focus()
  }

  return (
    <div className="document-insert-menu" role="menu" aria-label="选择内容类型" ref={menuRef} onKeyDown={handleKeyDown} onBlur={(event) => {
      const nextTarget = event.relatedTarget as Element | null
      if (nextTarget && (event.currentTarget.contains(nextTarget) || nextTarget.closest('.document-block-insert > button'))) return
      onClose(false)
    }}>
      <div className="document-insert-menu-heading"><strong>插入内容</strong><button type="button" onClick={() => onClose(true)} aria-label="关闭内容菜单"><span className="icon-close" aria-hidden="true" /></button></div>
      <div className="document-insert-menu-grid">
        {blockOptions.map((option) => (
          <button type="button" role="menuitem" key={option.type} onClick={() => onInsert(option.type)}>
            <span>{option.symbol}</span><div><strong>{option.label}</strong><small>{option.description}</small></div>
          </button>
        ))}
      </div>
    </div>
  )
}

export function ResearchDocumentEditor({
  documentItem,
  initialBlockId,
  initialSearchQuery,
  pdfDocuments,
  onImportPdfFile,
  onOpenPdfDocument,
  onClose,
  onSave,
}: ResearchDocumentEditorProps) {
  const initialBlocksRef = useRef<DocumentBlock[]>(getDocumentBlocks(documentItem))
  const [title, setTitle] = useState(documentItem.title)
  const [blocks, setBlocks] = useState<DocumentBlock[]>(() => cloneDocumentBlocks(initialBlocksRef.current))
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify({ title: documentItem.title, blocks: initialBlocksRef.current }))
  const [activeBlockId, setActiveBlockId] = useState(initialBlocksRef.current[0]?.id ?? null)
  const [insertIndex, setInsertIndex] = useState<number | null>(null)
  const [blockErrors, setBlockErrors] = useState<BlockErrors>({})
  const [titleError, setTitleError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [savedAt, setSavedAt] = useState(documentItem.visitedAt)
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const [removedBlock, setRemovedBlock] = useState<{ block: DocumentBlock; index: number; replacedOnly?: boolean } | null>(null)
  const [notice, setNotice] = useState('')
  const [imageBusy, setImageBusy] = useState<Record<string, boolean>>({})
  const [pdfImportOpen, setPdfImportOpen] = useState(false)
  const editorRef = useRef<HTMLElement | null>(null)
  const titleRef = useRef<HTMLInputElement | null>(null)
  const saveButtonRef = useRef<HTMLButtonElement | null>(null)
  const insertTriggerRefs = useRef<Map<number, HTMLButtonElement>>(new Map())
  const noticeTimerRef = useRef<number | null>(null)
  const blocksRef = useRef(blocks)
  const pdfInsertAfterBlockIdRef = useRef<string | null>(null)

  blocksRef.current = blocks

  const currentSnapshot = useMemo(() => JSON.stringify({ title, blocks }), [title, blocks])
  const dirty = currentSnapshot !== savedSnapshot
  const documentText = useMemo(() => getEditorBlocksText(blocks), [blocks])
  const characterCount = Array.from(documentText.replace(/\s/g, '')).length
  const archivedPdfDocuments = useMemo(
    () => pdfDocuments.filter((item) => item.kind === 'PDF文档' && item.pdfArchive && !item.deletedAt),
    [pdfDocuments],
  )
  const existingPdfFiles = useMemo(() => archivedPdfDocuments.map((item) => ({
    name: item.pdfArchive?.originalName || item.title,
    size: item.pdfArchive?.byteSize || 0,
  })), [archivedPdfDocuments])
  const searchTargetBlockId = useMemo(() => {
    if (initialBlockId) return initialBlockId
    const terms = initialSearchQuery?.trim().toLocaleLowerCase('zh-CN').split(/\s+/).filter(Boolean) ?? []
    if (!terms.length) return undefined
    return blocks.find((block) => {
      const value = getEditorBlockText(block).toLocaleLowerCase('zh-CN')
      return terms.some((term) => value.includes(term))
    })?.id
  }, [blocks, initialBlockId, initialSearchQuery])

  const showNotice = (message: string) => {
    setNotice(message)
    if (noticeTimerRef.current != null) window.clearTimeout(noticeTimerRef.current)
    noticeTimerRef.current = window.setTimeout(() => {
      setNotice('')
      noticeTimerRef.current = null
    }, 2200)
  }

  useEffect(() => () => {
    if (noticeTimerRef.current != null) window.clearTimeout(noticeTimerRef.current)
  }, [])

  useEffect(() => {
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warnBeforeUnload)
    return () => window.removeEventListener('beforeunload', warnBeforeUnload)
  }, [dirty])

  useEffect(() => {
    const saveFromKeyboard = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLocaleLowerCase() !== 's') return
      event.preventDefault()
      saveButtonRef.current?.click()
    }
    window.addEventListener('keydown', saveFromKeyboard)
    return () => window.removeEventListener('keydown', saveFromKeyboard)
  }, [])

  const updateBlock = (blockId: string, updater: (block: DocumentBlock) => DocumentBlock) => {
    setBlocks((current) => current.map((block) => block.id === blockId ? updater(block) : block))
    setSaveError('')
    if (blockErrors[blockId]) setBlockErrors((current) => ({ ...current, [blockId]: undefined }))
  }

  const focusBlock = (blockId: string) => {
    window.requestAnimationFrame(() => {
      const block = editorRef.current?.querySelector<HTMLElement>(`[data-editor-block-id="${blockId}"]`)
      block?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      const primaryTarget = block?.querySelector<HTMLElement>([
        '.document-text-input',
        '.document-list-item input',
        '.document-image-empty input[type="file"]',
        '.document-image-fields input',
        '.document-formula-editor textarea',
        '.document-bookmark-fields input',
        '.document-pdf-reference-open',
        '.document-divider-editor button:not(:disabled)',
      ].join(', '))
      const fallbackTarget = block?.querySelector<HTMLElement>('.document-block-content textarea, .document-block-content input, .document-block-content select, .document-block-content button:not(:disabled)')
      ;(primaryTarget ?? fallbackTarget ?? block)?.focus()
    })
  }

  useEffect(() => {
    if (!searchTargetBlockId || !blocks.some((block) => block.id === searchTargetBlockId)) return
    setActiveBlockId(searchTargetBlockId)
    const animationFrame = window.requestAnimationFrame(() => {
      editorRef.current
        ?.querySelector<HTMLElement>(`[data-editor-block-id="${CSS.escape(searchTargetBlockId)}"]`)
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      showNotice(initialSearchQuery?.trim()
        ? `已定位“${initialSearchQuery.trim().slice(0, 24)}”命中内容`
        : '已定位全文搜索命中内容')
    })
    return () => window.cancelAnimationFrame(animationFrame)
  // The target is an entry instruction; block edits must not repeatedly scroll the page.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTargetBlockId])

  const closeInsertMenu = (index: number) => {
    setInsertIndex(null)
    window.requestAnimationFrame(() => insertTriggerRefs.current.get(index)?.focus())
  }

  const addBlock = (type: BlockType, requestedIndex = insertIndex) => {
    if (blocks.length >= MAX_DOCUMENT_BLOCKS) {
      setInsertIndex(null)
      showNotice(`每篇文档最多可添加 ${MAX_DOCUMENT_BLOCKS} 个内容元素`)
      if (requestedIndex != null) window.requestAnimationFrame(() => insertTriggerRefs.current.get(requestedIndex)?.focus())
      return
    }
    const nextBlock = createDocumentBlock(type)
    const activeIndex = blocks.findIndex((block) => block.id === activeBlockId)
    const targetIndex = requestedIndex == null
      ? (activeIndex >= 0 ? activeIndex + 1 : blocks.length)
      : requestedIndex
    setBlocks((current) => [...current.slice(0, targetIndex), nextBlock, ...current.slice(targetIndex)])
    setActiveBlockId(nextBlock.id)
    setInsertIndex(null)
    setRemovedBlock(null)
    showNotice(`${blockLabels[type]}已插入`)
    focusBlock(nextBlock.id)
  }

  const openPdfImport = () => {
    if (blocksRef.current.length >= MAX_DOCUMENT_BLOCKS) {
      showNotice(`每篇文档最多可添加 ${MAX_DOCUMENT_BLOCKS} 个内容元素，请先删除一个内容元素`)
      return
    }
    pdfInsertAfterBlockIdRef.current = activeBlockId
    setInsertIndex(null)
    setPdfImportOpen(true)
  }

  const closePdfImport = () => {
    setPdfImportOpen(false)
    const latestReferenceId = pdfInsertAfterBlockIdRef.current
    if (latestReferenceId) focusBlock(latestReferenceId)
  }

  const insertPdfReference = (documentItem: ResearchDocument) => {
    const existingReference = blocksRef.current.find((block) => getPdfReferenceMetadata(block)?.documentId === documentItem.id)
    if (existingReference) {
      pdfInsertAfterBlockIdRef.current = existingReference.id
      setActiveBlockId(existingReference.id)
      showNotice('该 PDF 已关联到当前报告')
      return
    }

    const referenceBlock = createPdfReferenceBlock(documentItem)
    const anchorId = pdfInsertAfterBlockIdRef.current
    setBlocks((current) => {
      const anchorIndex = anchorId ? current.findIndex((block) => block.id === anchorId) : -1
      const targetIndex = anchorIndex >= 0 ? anchorIndex + 1 : current.length
      const next = [...current.slice(0, targetIndex), referenceBlock, ...current.slice(targetIndex)]
      blocksRef.current = next
      return next
    })
    pdfInsertAfterBlockIdRef.current = referenceBlock.id
    setActiveBlockId(referenceBlock.id)
    setRemovedBlock(null)
    setSaveError('')
    showNotice(`“${documentItem.title}”已解析、存档并关联到报告`)
  }

  const importPdfAndInsertReference: PdfImportDialogProps['onImportFile'] = async (file, onProgress): Promise<PdfImportResult> => {
    const alreadyLinked = blocksRef.current.some((block) => {
      const reference = getPdfReferenceMetadata(block)
      const archivedDocument = reference
        ? archivedPdfDocuments.find((item) => item.id === reference.documentId)
        : undefined
      return archivedDocument?.pdfArchive?.originalName === file.name
        && archivedDocument.pdfArchive.byteSize === file.size
    })
    if (!alreadyLinked && blocksRef.current.length >= MAX_DOCUMENT_BLOCKS) {
      return { ok: false, error: `当前报告已达到 ${MAX_DOCUMENT_BLOCKS} 个内容元素，无法建立 PDF 来源关联。` }
    }

    const result = await onImportPdfFile(file, onProgress)
    if (!result.ok) return result
    insertPdfReference(result.documentItem)
    return result
  }

  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= blocks.length) return
    setBlocks((current) => {
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    showNotice('内容顺序已调整')
  }

  const removeBlock = (index: number) => {
    const target = blocks[index]
    if (!target) return
    if (blocks.length === 1) {
      const emptyText = createDocumentBlock('text')
      setBlocks([emptyText])
      setActiveBlockId(emptyText.id)
      setRemovedBlock({ block: target, index: 0, replacedOnly: true })
      focusBlock(emptyText.id)
      return
    }
    const nextActive = blocks[index + 1] ?? blocks[index - 1]
    setBlocks((current) => current.filter((block) => block.id !== target.id))
    setRemovedBlock({ block: target, index })
    setActiveBlockId(nextActive?.id ?? null)
    setBlockErrors((current) => ({ ...current, [target.id]: undefined }))
    if (nextActive) focusBlock(nextActive.id)
  }

  const undoRemove = () => {
    if (!removedBlock) return
    const restored = cloneDocumentBlocks([removedBlock.block])[0]
    setBlocks((current) => removedBlock.replacedOnly
      ? [restored]
      : [...current.slice(0, removedBlock.index), restored, ...current.slice(removedBlock.index)])
    setActiveBlockId(restored.id)
    setRemovedBlock(null)
    showNotice('已撤销删除')
    focusBlock(restored.id)
  }

  const requestClose = () => {
    if (dirty) {
      setConfirmDiscard(true)
      return
    }
    onClose()
  }

  const validateAndNormalizeBlocks = () => {
    const errors: BlockErrors = {}
    const normalized = blocks.map((block): DocumentBlock => {
      if (block.type === 'list') {
        const items = block.items.map((item) => item.trim()).filter(Boolean)
        if (block.items.length > MAX_LIST_ITEMS) errors[block.id] = `每个列表最多可包含 ${MAX_LIST_ITEMS} 项。`
        else if (!items.length) errors[block.id] = '请至少填写一个列表项。'
        return { ...block, items: items.length ? items : block.items }
      }
      if (block.type === 'image') {
        if (!block.src) errors[block.id] = '请选择一张图片后再保存。'
        else if (!block.alt.trim()) errors[block.id] = '请填写图片替代文本，便于无障碍阅读。'
        return { ...block, alt: block.alt.trim(), caption: block.caption.trim() }
      }
      if (block.type === 'formula') {
        if (!block.latex.trim()) errors[block.id] = '请输入数学公式。'
        else if (!getFormulaHtml(block.latex)) errors[block.id] = '公式语法无法解析，请检查后再保存。'
        return { ...block, latex: block.latex.trim() }
      }
      if (block.type === 'bookmark') {
        const normalizedUrl = normalizeHttpUrl(block.url)
        if (!normalizedUrl) errors[block.id] = '请输入有效的 HTTP 或 HTTPS 网页地址。'
        const fallbackTitle = normalizedUrl ? new URL(normalizedUrl).hostname : ''
        return {
          ...block,
          url: normalizedUrl ?? block.url.trim(),
          title: block.title.trim() || fallbackTitle,
          description: block.description.trim(),
        }
      }
      if (block.type === 'text') return { ...block, text: block.text.replace(/\s+$/g, '') }
      return block
    })
    return { normalized, errors }
  }

  const saveDocument = () => {
    const normalizedTitle = title.normalize('NFC').trim()
    setSaveError('')
    setTitleError('')
    if (!normalizedTitle) {
      setTitleError('请输入文档标题。')
      titleRef.current?.focus()
      return
    }
    if (blocks.length > MAX_DOCUMENT_BLOCKS) {
      setSaveError(`每篇文档最多可包含 ${MAX_DOCUMENT_BLOCKS} 个内容元素，请删除多余内容后重试。`)
      return
    }

    const { normalized, errors } = validateAndNormalizeBlocks()
    setBlockErrors(errors)
    const firstErrorId = blocks.find((block) => errors[block.id])?.id
    if (firstErrorId) {
      setActiveBlockId(firstErrorId)
      focusBlock(firstErrorId)
      return
    }

    const normalizedContent = getEditorBlocksText(normalized)
    if (normalizedContent.length > MAX_DOCUMENT_TEXT_CHARACTERS) {
      setSaveError(`文档正文不能超过 ${MAX_DOCUMENT_TEXT_CHARACTERS.toLocaleString('zh-CN')} 个字符，请精简内容后重试。`)
      return
    }

    const value = {
      title: normalizedTitle,
      blocks: cloneDocumentBlocks(normalized),
      content: normalizedContent,
      size: estimateDocumentSize(normalized),
    }
    const error = onSave(value)
    if (error) {
      setSaveError(error)
      return
    }
    const nextSnapshot = JSON.stringify({ title: normalizedTitle, blocks: normalized })
    setTitle(normalizedTitle)
    setBlocks(cloneDocumentBlocks(normalized))
    setSavedSnapshot(nextSnapshot)
    setSavedAt(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }))
    setRemovedBlock(null)
    showNotice('文档已保存')
  }

  const handleImageSelection = async (blockId: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setImageBusy((current) => ({ ...current, [blockId]: true }))
    setBlockErrors((current) => ({ ...current, [blockId]: undefined }))
    try {
      const source = await prepareDocumentImage(file)
      updateBlock(blockId, (block) => block.type === 'image'
        ? { ...block, src: source, alt: block.alt || file.name.replace(/\.[^.]+$/, '') }
        : block)
      showNotice('图片已插入并完成压缩')
    } catch (error) {
      const message = error instanceof Error && error.message === 'type'
        ? '仅支持 PNG、JPEG 或 WebP 图片。'
        : error instanceof Error && error.message === 'size'
          ? '图片不能超过 4 MiB。'
          : error instanceof Error && error.message === 'compressed-size'
            ? '图片压缩后仍然过大，请更换尺寸更小的图片。'
            : '无法读取这张图片，请更换后重试。'
      setBlockErrors((current) => ({ ...current, [blockId]: message }))
    } finally {
      setImageBusy((current) => ({ ...current, [blockId]: false }))
    }
  }

  const updateListItem = (block: DocumentListBlock, itemIndex: number, value: string) => {
    updateBlock(block.id, (current) => {
      if (current.type !== 'list') return current
      const items = [...current.items]
      items[itemIndex] = value
      return { ...current, items }
    })
  }

  const insertListItem = (block: DocumentListBlock, itemIndex: number) => {
    if (block.items.length >= MAX_LIST_ITEMS) {
      showNotice(`每个列表最多可添加 ${MAX_LIST_ITEMS} 项`)
      return
    }
    updateBlock(block.id, (current) => {
      if (current.type !== 'list') return current
      const items = [...current.items]
      items.splice(itemIndex + 1, 0, '')
      return { ...current, items }
    })
    window.requestAnimationFrame(() => {
      editorRef.current?.querySelector<HTMLInputElement>(`[data-list-block="${block.id}"][data-list-index="${itemIndex + 1}"]`)?.focus()
    })
  }

  const removeListItem = (block: DocumentListBlock, itemIndex: number) => {
    if (block.items.length <= 1) return
    updateBlock(block.id, (current) => current.type === 'list'
      ? { ...current, items: current.items.filter((_, index) => index !== itemIndex) }
      : current)
    window.requestAnimationFrame(() => {
      editorRef.current?.querySelector<HTMLInputElement>(`[data-list-block="${block.id}"][data-list-index="${Math.max(0, itemIndex - 1)}"]`)?.focus()
    })
  }

  const renderBlockBody = (block: DocumentBlock) => {
    const pdfReference = getPdfReferenceMetadata(block)
    if (pdfReference) {
      const archivedDocument = archivedPdfDocuments.find((item) => item.id === pdfReference.documentId)
      const archive = archivedDocument?.pdfArchive
      const displayTitle = archivedDocument?.title || (block.type === 'bookmark' ? block.title : '') || pdfReference.originalName
      const originalName = archive?.originalName || pdfReference.originalName
      const pageCount = archive?.pageCount || pdfReference.pageCount
      const byteSize = archive?.byteSize || pdfReference.byteSize
      const annotationCount = archive?.annotationCount ?? pdfReference.annotationCount
      const available = Boolean(archive)

      return <section className={`document-pdf-reference${available ? '' : ' is-unavailable'}`} aria-label={`PDF 文献来源：${displayTitle}`}>
        <span className="document-pdf-reference-icon" aria-hidden="true"><b>PDF</b></span>
        <div className="document-pdf-reference-copy">
          <div className="document-pdf-reference-heading">
            <div><strong title={displayTitle}>{displayTitle}</strong><small title={originalName}>{originalName}</small></div>
            <span className={available ? 'is-archived' : 'is-unavailable'}>{available ? '已存档' : '存档不可用'}</span>
          </div>
          <p>{available
            ? '在线解析已完成，可打开原文进行划词标记、截图标记并集中管理笔记。'
            : '当前报告仍保留来源关联，但浏览器中未找到对应存档，可从“PDF文献”重新导入。'}</p>
          <div className="document-pdf-reference-meta" aria-label="PDF 文献信息">
            <span>{pageCount > 0 ? `${pageCount} 页` : '页数未知'}</span>
            <i aria-hidden="true" />
            <span>{formatPdfFileSize(byteSize, archivedDocument?.size || '')}</span>
            <i aria-hidden="true" />
            <span>{annotationCount} 条笔记</span>
          </div>
        </div>
        <div className="document-pdf-reference-actions">
          <button
            className="button button--secondary button--small document-pdf-reference-open"
            type="button"
            disabled={!available}
            onClick={() => onOpenPdfDocument(pdfReference.documentId)}
          >阅读与笔记</button>
          <small>删除卡片不影响存档</small>
        </div>
      </section>
    }

    if (block.type === 'text') {
      return <>
        <div className="document-text-tools" role="group" aria-label="文本样式">
          <select value={block.style} aria-label="文本层级" onChange={(event) => updateBlock(block.id, (current) => current.type === 'text' ? { ...current, style: event.target.value as DocumentTextBlock['style'] } : current)}>
            {Object.entries(textStyleLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
          <button type="button" aria-label="粗体" aria-pressed={block.bold} className={block.bold ? 'is-active' : ''} onClick={() => updateBlock(block.id, (current) => current.type === 'text' ? { ...current, bold: !current.bold } : current)}><b>B</b></button>
          <button type="button" aria-label="斜体" aria-pressed={block.italic} className={block.italic ? 'is-active' : ''} onClick={() => updateBlock(block.id, (current) => current.type === 'text' ? { ...current, italic: !current.italic } : current)}><i>I</i></button>
          <button type="button" aria-label="下划线" aria-pressed={block.underline} className={block.underline ? 'is-active' : ''} onClick={() => updateBlock(block.id, (current) => current.type === 'text' ? { ...current, underline: !current.underline } : current)}><u>U</u></button>
        </div>
        <AutoGrowTextarea
          className={`document-text-input document-text-input--${block.style}${block.bold ? ' is-bold' : ''}${block.italic ? ' is-italic' : ''}${block.underline ? ' is-underline' : ''}`}
          value={block.text}
          maxLength={20_000}
          placeholder={block.style.startsWith('heading') ? '输入章节标题' : block.style === 'quote' ? '输入引用内容' : '开始记录研究内容……'}
          aria-label={`${textStyleLabels[block.style]}内容`}
          onFocus={() => setActiveBlockId(block.id)}
          onChange={(event) => updateBlock(block.id, (current) => current.type === 'text' ? { ...current, text: event.target.value } : current)}
        />
      </>
    }

    if (block.type === 'list') {
      return <>
        <div className="document-list-tools" role="group" aria-label="列表类型">
          <button type="button" className={!block.ordered ? 'is-active' : ''} aria-pressed={!block.ordered} onClick={() => updateBlock(block.id, (current) => current.type === 'list' ? { ...current, ordered: false } : current)}>无序列表</button>
          <button type="button" className={block.ordered ? 'is-active' : ''} aria-pressed={block.ordered} onClick={() => updateBlock(block.id, (current) => current.type === 'list' ? { ...current, ordered: true } : current)}>有序列表</button>
        </div>
        <div className="document-list-editor">
          {block.items.map((item, index) => (
            <div className="document-list-item" key={`${block.id}-${index}`}>
              <span aria-hidden="true">{block.ordered ? `${index + 1}.` : '•'}</span>
              <input
                value={item}
                maxLength={1_000}
                aria-label={`列表第 ${index + 1} 项`}
                data-list-block={block.id}
                data-list-index={index}
                placeholder="输入列表内容，按 Enter 新增下一项"
                onFocus={() => setActiveBlockId(block.id)}
                onChange={(event) => updateListItem(block, index, event.target.value)}
                onKeyDown={(event: ReactKeyboardEvent<HTMLInputElement>) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    insertListItem(block, index)
                  }
                  if (event.key === 'Backspace' && !item && block.items.length > 1) {
                    event.preventDefault()
                    removeListItem(block, index)
                  }
                }}
              />
              <button type="button" aria-label={`删除列表第 ${index + 1} 项`} disabled={block.items.length === 1} onClick={() => removeListItem(block, index)}><span className="icon-close" aria-hidden="true" /></button>
            </div>
          ))}
          <button className="document-list-add" type="button" onClick={() => insertListItem(block, block.items.length - 1)}><span className="icon-plus" aria-hidden="true" />添加一项</button>
        </div>
      </>
    }

    if (block.type === 'image') {
      return <div className="document-image-editor">
        {block.src ? (
          <figure>
            <img src={block.src} alt={block.alt} />
            {block.caption && <figcaption>{block.caption}</figcaption>}
          </figure>
        ) : (
          <label className="document-image-empty">
            <span className="document-image-empty-icon" aria-hidden="true" />
            <strong>{imageBusy[block.id] ? '正在处理图片…' : '选择一张科研图片'}</strong>
            <small>支持 PNG、JPEG、WebP；单张不超过 4 MiB，保存前自动压缩</small>
            <input type="file" accept="image/png,image/jpeg,image/webp" disabled={imageBusy[block.id]} onChange={(event) => void handleImageSelection(block.id, event)} />
          </label>
        )}
        {block.src && <div className="document-image-actions">
          <label className="button button--secondary button--small">替换图片<input type="file" accept="image/png,image/jpeg,image/webp" disabled={imageBusy[block.id]} onChange={(event) => void handleImageSelection(block.id, event)} /></label>
          <button className="button button--secondary button--small" type="button" onClick={() => updateBlock(block.id, (current) => current.type === 'image' ? { ...current, src: '' } : current)}>移除图片</button>
        </div>}
        <div className="document-image-fields">
          <label><span><i className="required-mark">*</i> 替代文本</span><input value={block.alt} maxLength={200} placeholder="简要描述图片内容" onChange={(event) => updateBlock(block.id, (current) => current.type === 'image' ? { ...current, alt: event.target.value } : current)} /></label>
          <label><span>图片说明</span><input value={block.caption} maxLength={300} placeholder="可选：数据来源或图注" onChange={(event) => updateBlock(block.id, (current) => current.type === 'image' ? { ...current, caption: event.target.value } : current)} /></label>
        </div>
      </div>
    }

    if (block.type === 'formula') {
      return <div className="document-formula-editor">
        <label><span>LaTeX 公式</span><textarea value={block.latex} maxLength={2_000} spellCheck={false} placeholder="例如：E = mc^2" onChange={(event) => updateBlock(block.id, (current) => current.type === 'formula' ? { ...current, latex: event.target.value } : current)} /></label>
        <div className="document-formula-preview" aria-label="公式预览"><span>预览</span><FormulaPreview latex={block.latex} /></div>
      </div>
    }

    if (block.type === 'bookmark') {
      const normalizedUrl = normalizeHttpUrl(block.url)
      const host = normalizedUrl ? new URL(normalizedUrl).hostname.replace(/^www\./, '') : ''
      return <div className="document-bookmark-editor">
        <div className="document-bookmark-fields">
          <label><span>网页地址</span><input type="url" value={block.url} maxLength={2_000} placeholder="https://example.org/paper" onBlur={() => {
            if (!normalizedUrl) return
            updateBlock(block.id, (current) => current.type === 'bookmark'
              ? { ...current, url: normalizedUrl }
              : current)
          }} onChange={(event) => updateBlock(block.id, (current) => current.type === 'bookmark' ? { ...current, url: event.target.value } : current)} /></label>
          <label><span>书签标题</span><input value={block.title} maxLength={200} placeholder="输入网页标题" onChange={(event) => updateBlock(block.id, (current) => current.type === 'bookmark' ? { ...current, title: event.target.value } : current)} /></label>
          <label><span>内容摘要</span><textarea value={block.description} maxLength={500} placeholder="可选：说明该网页与研究的关系" onChange={(event) => updateBlock(block.id, (current) => current.type === 'bookmark' ? { ...current, description: event.target.value } : current)} /></label>
        </div>
        <div className={`document-bookmark-preview${normalizedUrl ? '' : ' is-empty'}`}>
          <span className="document-bookmark-mark" aria-hidden="true">↗</span>
          <div><strong>{block.title || host || '网页书签预览'}</strong><p>{block.description || '填写有效网址后，将以卡片形式保存在文档中。'}</p>{host && <small>{host}</small>}</div>
          {normalizedUrl && <a href={normalizedUrl} target="_blank" rel="noreferrer" aria-label={`在新窗口打开 ${block.title || host}`}>打开</a>}
        </div>
      </div>
    }

    return <div className="document-divider-editor">
      <div className={`document-divider-line is-${block.style}`} aria-hidden="true" />
      <div role="group" aria-label="分割线样式">
        <button type="button" className={block.style === 'solid' ? 'is-active' : ''} aria-pressed={block.style === 'solid'} onClick={() => updateBlock(block.id, (current) => current.type === 'divider' ? { ...current, style: 'solid' } : current)}>实线</button>
        <button type="button" className={block.style === 'dashed' ? 'is-active' : ''} aria-pressed={block.style === 'dashed'} onClick={() => updateBlock(block.id, (current) => current.type === 'divider' ? { ...current, style: 'dashed' } : current)}>虚线</button>
      </div>
    </div>
  }

  return (
    <section className="research-document-editor" aria-label={`文档编辑：${title.trim() || '未命名文档'}`} ref={editorRef}>
      <header className="document-editor-header">
        <button className="document-editor-back" type="button" onClick={requestClose}><span aria-hidden="true" />返回</button>
        <div className="document-editor-title-area">
          <div className="document-editor-breadcrumb"><span>基础服务</span><i>/</i><span>智能科研</span><i>/</i><span>{displayResearchLocation(documentItem.location)}</span><i>/</i><strong>文档编辑</strong></div>
          <p className="mobile-capability-context" aria-label="功能路径：基础服务，智能科研，文档编辑"><span>基础服务</span><i>/</i><span>智能科研</span><i>/</i><strong>文档编辑</strong></p>
          <input
            ref={titleRef}
            value={title}
            maxLength={50}
            aria-label="文档标题"
            aria-invalid={Boolean(titleError)}
            aria-describedby={titleError ? 'document-title-editor-error' : undefined}
            onChange={(event) => { setTitle(event.target.value); setTitleError(''); setSaveError('') }}
          />
          {titleError && <small className="document-editor-title-error" id="document-title-editor-error">{titleError}</small>}
        </div>
        <div className="document-editor-save-area">
          <span className={`document-save-state${dirty ? ' is-dirty' : ''}`} aria-live="polite"><i aria-hidden="true" /><b>{dirty ? '未保存' : '已保存'}</b>{!dirty && <em>{savedAt}</em>}</span>
          <button ref={saveButtonRef} className="button button--primary" type="button" onClick={saveDocument} disabled={!dirty || Object.values(imageBusy).some(Boolean)}>保存</button>
        </div>
      </header>

      <div className="document-editor-toolbar" aria-label="插入内容工具栏">
        <div className="document-editor-toolbar-label"><strong>插入内容</strong><span>将添加到当前内容之后</span></div>
        <div className="document-editor-tools">
          {blockOptions.map((option) => <button type="button" key={option.type} onClick={() => addBlock(option.type)} title={option.description}><span>{option.symbol}</span>{option.label}</button>)}
          <button className="document-editor-pdf-tool" type="button" onClick={openPdfImport} title="批量导入、在线解析并存档 PDF 文献"><span>PDF</span>PDF文献</button>
        </div>
        <kbd>{navigator.platform.toLocaleLowerCase().includes('mac') ? '⌘ S' : 'Ctrl S'} 保存</kbd>
      </div>

      <div className="document-editor-scroll">
        <div className="document-editor-meta" aria-label="文档信息">
          <span>所有者：{documentItem.owner}</span><i />
          <span>{blocks.length} 个内容元素</span><i />
          <span>{characterCount} 字</span>
        </div>
        {saveError && <div className="document-editor-save-error" role="alert"><strong>保存失败</strong><span>{saveError}</span><div className="document-editor-save-error-actions"><button type="button" onClick={saveDocument}>重试</button><button type="button" onClick={() => setSaveError('')}>关闭</button></div></div>}
        <main className="document-editor-paper">
          {blocks.map((block, index) => {
            const blockLabel = getEditorBlockLabel(block)
            const isPdfReference = Boolean(getPdfReferenceMetadata(block))
            return <div className="document-editor-block-wrap" key={block.id}>
              <article
                className={`document-editor-block document-editor-block--${isPdfReference ? 'pdf-reference' : block.type}${activeBlockId === block.id ? ' is-active' : ''}${searchTargetBlockId === block.id ? ' is-search-target' : ''}${blockErrors[block.id] ? ' has-error' : ''}`}
                data-editor-block-id={block.id}
                onMouseDown={() => setActiveBlockId(block.id)}
              >
                <header className="document-block-header">
                  <span className="document-block-type"><i className={isPdfReference ? 'is-pdf' : ''} aria-hidden="true">{getEditorBlockSymbol(block)}</i>{blockLabel}</span>
                  <div className="document-block-actions">
                    <button type="button" aria-label="上移内容" disabled={index === 0} onClick={() => moveBlock(index, -1)}><span className="document-block-chevron is-up" aria-hidden="true" /></button>
                    <button type="button" aria-label="下移内容" disabled={index === blocks.length - 1} onClick={() => moveBlock(index, 1)}><span className="document-block-chevron" aria-hidden="true" /></button>
                    <button type="button" className="is-danger" aria-label={`删除${blockLabel}（不会删除存档原文）`} onClick={() => removeBlock(index)}><span className="icon-close" aria-hidden="true" /></button>
                  </div>
                </header>
                <div className="document-block-content">{renderBlockBody(block)}</div>
                {blockErrors[block.id] && <p className="document-block-error" role="alert">{blockErrors[block.id]}</p>}
              </article>
              <div className={`document-block-insert${insertIndex === index + 1 ? ' is-open' : ''}`}>
                <button ref={(node) => { if (node) insertTriggerRefs.current.set(index + 1, node); else insertTriggerRefs.current.delete(index + 1) }} type="button" aria-label={`在${blockLabel}后插入内容`} aria-haspopup="menu" aria-expanded={insertIndex === index + 1} onClick={() => setInsertIndex((current) => current === index + 1 ? null : index + 1)}><span className="icon-plus" aria-hidden="true" /></button>
                {insertIndex === index + 1 && <InsertMenu onInsert={(type) => addBlock(type, index + 1)} onClose={(restoreFocus) => { if (restoreFocus) closeInsertMenu(index + 1); else setInsertIndex(null) }} />}
              </div>
            </div>
          })}
          <footer className="document-editor-paper-footer"><span>文档内容将保存在当前浏览器，可通过全文搜索立即检索。</span></footer>
        </main>
      </div>

      {removedBlock && <div className="document-editor-undo" role="status"><span>已删除{getEditorBlockLabel(removedBlock.block)}{getPdfReferenceMetadata(removedBlock.block) ? '，存档原文仍保留' : ''}</span><button type="button" onClick={undoRemove}>撤销</button><button type="button" aria-label="关闭撤销提示" onClick={() => setRemovedBlock(null)}><span className="icon-close" aria-hidden="true" /></button></div>}
      {notice && <div className="document-editor-notice" role="status" aria-live="polite"><span className="icon-check" aria-hidden="true" />{notice}</div>}

      {confirmDiscard && <Modal
        title="离开文档编辑？"
        onClose={() => setConfirmDiscard(false)}
        onSubmit={(event) => { event.preventDefault(); onClose() }}
        cancelText="继续编辑"
        confirmText="放弃修改"
        confirmDanger
      ><p className="discard-message">当前文档还有未保存的修改，离开后本次修改将无法恢复。</p></Modal>}

      <PdfImportDialog
        open={pdfImportOpen}
        onClose={closePdfImport}
        onImportFile={importPdfAndInsertReference}
        onOpenDocument={onOpenPdfDocument}
        existingFiles={existingPdfFiles}
      />
    </section>
  )
}
