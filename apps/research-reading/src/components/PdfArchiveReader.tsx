import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  getDocument,
  GlobalWorkerOptions,
  PasswordResponses,
  RenderingCancelledException,
  TextLayer,
  type PDFDocumentLoadingTask,
  type PDFDocumentProxy,
  type PDFPageProxy,
  type RenderTask,
} from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { loadPdfAnnotationImage, loadPdfAnnotations, loadPdfArchiveFile } from '../pdfArchive'
import type { PdfArchiveAnnotation, PdfAnnotationRect, ResearchDocument } from '../types'
import './PdfArchiveReader.css'

GlobalWorkerOptions.workerSrc = pdfWorkerUrl

type ReaderTool = 'highlight' | 'screenshot'
type ReaderActionResult = { ok: boolean; error?: string }
type SaveAnnotationsResult =
  | { ok: true; annotations: PdfArchiveAnnotation[] }
  | { ok: false; error: string }

interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

interface PasswordPrompt {
  incorrect: boolean
  submit: (password: string) => void
  cancel: () => void
}

export interface PdfArchiveReaderProps {
  document: ResearchDocument
  initialAnnotationId?: string
  initialPageNumber?: number
  initialSearchQuery?: string
  onClose: () => void
  onSaveAnnotations: (
    next: PdfArchiveAnnotation[],
    previous: PdfArchiveAnnotation[],
  ) => Promise<SaveAnnotationsResult>
  onDownload: () => Promise<ReaderActionResult>
  onExport: (annotations: PdfArchiveAnnotation[]) => Promise<ReaderActionResult>
}

const MAX_QUOTE_LENGTH = 500
const MAX_NOTE_LENGTH = 1_000
const MAX_RECTS = 60
const MAX_SCREENSHOT_EDGE = 1_200
const MAX_SCREENSHOT_BYTES = 1_050_000
const MAX_SCREENSHOT_DATA_URL_LENGTH = 1_500_000
const MIN_CROP_SIZE = 12
const DEFAULT_PAGE_WIDTH = 812

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value))
const roundCoordinate = (value: number) => Math.round(value * 100_000) / 100_000
const normalizedText = (value: string) => value.replace(/\s+/g, ' ').trim()

const createAnnotationId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `pdf-note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const formatTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '刚刚'
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const canvasToBlob = (canvas: HTMLCanvasElement, quality: number) => new Promise<Blob>((resolve, reject) => {
  canvas.toBlob((blob) => {
    if (blob) resolve(blob)
    else reject(new Error('canvas-encode-failed'))
  }, 'image/jpeg', quality)
})

const blobToDataUrl = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
  reader.onerror = () => reject(reader.error ?? new Error('image-read-failed'))
  reader.readAsDataURL(blob)
})

const limitRangeToCharacters = (source: Range, root: HTMLElement, maximum: number) => {
  const limited = source.cloneRange()
  const walker = window.document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let remaining = maximum
  let current = walker.nextNode()

  while (current) {
    const textNode = current as Text
    let intersects = false
    try {
      intersects = source.intersectsNode(textNode)
    } catch {
      intersects = false
    }
    if (intersects) {
      const start = source.startContainer === textNode ? source.startOffset : 0
      const end = source.endContainer === textNode ? source.endOffset : textNode.data.length
      const segmentLength = Math.max(0, end - start)
      if (remaining <= segmentLength) {
        limited.setEnd(textNode, start + remaining)
        return limited
      }
      remaining -= segmentLength
    }
    current = walker.nextNode()
  }
  return limited
}

const normalizedRectsFromRange = (range: Range, pageBounds: DOMRect): PdfAnnotationRect[] => {
  if (pageBounds.width <= 0 || pageBounds.height <= 0) return []
  const seen = new Set<string>()
  const rects: PdfAnnotationRect[] = []

  for (const bounds of Array.from(range.getClientRects())) {
    const left = Math.max(bounds.left, pageBounds.left)
    const top = Math.max(bounds.top, pageBounds.top)
    const right = Math.min(bounds.right, pageBounds.right)
    const bottom = Math.min(bounds.bottom, pageBounds.bottom)
    if (right - left < 1 || bottom - top < 1) continue
    const x = roundCoordinate(clamp((left - pageBounds.left) / pageBounds.width, 0, 1))
    const y = roundCoordinate(clamp((top - pageBounds.top) / pageBounds.height, 0, 1))
    const width = roundCoordinate(clamp((right - left) / pageBounds.width, 0, 1 - x))
    const height = roundCoordinate(clamp((bottom - top) / pageBounds.height, 0, 1 - y))
    const key = `${x}:${y}:${width}:${height}`
    if (seen.has(key)) continue
    seen.add(key)
    rects.push({ x, y, width, height })
    if (rects.length >= MAX_RECTS) break
  }
  return rects
}

const isNodeInside = (container: HTMLElement, node: Node | null) => {
  if (!node) return false
  return node === container || container.contains(node.nodeType === Node.TEXT_NODE ? node.parentNode : node)
}

const screenshotDataUrl = async (
  source: HTMLCanvasElement,
  pageBounds: DOMRect,
  crop: CropRect,
) => {
  if (pageBounds.width <= 0 || pageBounds.height <= 0) throw new Error('page-size-unavailable')
  const sourceX = crop.x * source.width / pageBounds.width
  const sourceY = crop.y * source.height / pageBounds.height
  const sourceWidth = crop.width * source.width / pageBounds.width
  const sourceHeight = crop.height * source.height / pageBounds.height
  if (sourceWidth < 1 || sourceHeight < 1) throw new Error('crop-too-small')

  const maximumEdges = [MAX_SCREENSHOT_EDGE, 960]
  for (const maximumEdge of maximumEdges) {
    const outputScale = Math.min(1, maximumEdge / Math.max(sourceWidth, sourceHeight))
    const output = window.document.createElement('canvas')
    output.width = Math.max(1, Math.round(sourceWidth * outputScale))
    output.height = Math.max(1, Math.round(sourceHeight * outputScale))
    const context = output.getContext('2d')
    if (!context) throw new Error('canvas-unavailable')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, output.width, output.height)
    context.drawImage(
      source,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      output.width,
      output.height,
    )

    for (const quality of [0.86, 0.78, 0.68, 0.58]) {
      const blob = await canvasToBlob(output, quality)
      if (blob.type !== 'image/jpeg' || blob.size > MAX_SCREENSHOT_BYTES) continue
      const dataUrl = await blobToDataUrl(blob)
      if (dataUrl.startsWith('data:image/jpeg;base64,') && dataUrl.length <= MAX_SCREENSHOT_DATA_URL_LENGTH) {
        output.width = 0
        output.height = 0
        return dataUrl
      }
    }
    output.width = 0
    output.height = 0
  }
  throw new Error('screenshot-too-large')
}

export function PdfArchiveReader({
  document: documentItem,
  initialAnnotationId,
  initialPageNumber,
  initialSearchQuery,
  onClose,
  onSaveAnnotations,
  onDownload,
  onExport,
}: PdfArchiveReaderProps) {
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null)
  const [annotations, setAnnotations] = useState<PdfArchiveAnnotation[]>([])
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(documentItem.pdfArchive?.pageCount ?? 0)
  const [zoom, setZoom] = useState(100)
  const [hostWidth, setHostWidth] = useState(0)
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 })
  const [tool, setTool] = useState<ReaderTool>('highlight')
  const [isLoading, setIsLoading] = useState(true)
  const [isRendering, setIsRendering] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [renderError, setRenderError] = useState('')
  const [annotationError, setAnnotationError] = useState('')
  const [hasSelectableText, setHasSelectableText] = useState<boolean | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const [renderRetryToken, setRenderRetryToken] = useState(0)
  const [draft, setDraft] = useState<PdfArchiveAnnotation | null>(null)
  const [draftBaseline, setDraftBaseline] = useState<PdfArchiveAnnotation | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [crop, setCrop] = useState<CropRect | null>(null)
  const [isDraggingCrop, setIsDraggingCrop] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [busyAction, setBusyAction] = useState<'download' | 'export' | null>(null)
  const [mobileNotesOpen, setMobileNotesOpen] = useState(false)
  const [notesAreOverlay, setNotesAreOverlay] = useState(() => (
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(max-width: 1120px)').matches
      : false
  ))
  const [discardPromptOpen, setDiscardPromptOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<PdfArchiveAnnotation | null>(null)
  const [passwordPrompt, setPasswordPrompt] = useState<PasswordPrompt | null>(null)
  const [passwordValue, setPasswordValue] = useState('')
  const [toast, setToast] = useState('')
  const [loadingImageIds, setLoadingImageIds] = useState<Record<string, boolean>>({})

  const loadingTaskRef = useRef<PDFDocumentLoadingTask | null>(null)
  const renderTaskRef = useRef<RenderTask | null>(null)
  const renderedPageRef = useRef<PDFPageProxy | null>(null)
  const textLayerRef = useRef<TextLayer | null>(null)
  const renderSequenceRef = useRef(0)
  const readerRef = useRef<HTMLElement | null>(null)
  const backButtonRef = useRef<HTMLButtonElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const textLayerContainerRef = useRef<HTMLDivElement | null>(null)
  const pageElementRef = useRef<HTMLDivElement | null>(null)
  const viewportHostRef = useRef<HTMLDivElement | null>(null)
  const notesPanelRef = useRef<HTMLElement | null>(null)
  const mobileNotesButtonRef = useRef<HTMLButtonElement | null>(null)
  const cropStartRef = useRef<{ x: number; y: number } | null>(null)
  const highlightStartRef = useRef<{ x: number; y: number } | null>(null)
  const pendingDiscardActionRef = useRef<(() => void) | null>(null)
  const toastTimerRef = useRef<number | null>(null)
  const announcedSearchTargetRef = useRef('')

  const draftDirty = draft != null && (draftBaseline == null || draft.note !== draftBaseline.note)

  const showToast = useCallback((message: string) => {
    setToast(message)
    if (toastTimerRef.current != null) window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => {
      setToast('')
      toastTimerRef.current = null
    }, 2600)
  }, [])

  const clearDraft = useCallback(() => {
    setDraft(null)
    setDraftBaseline(null)
  }, [])

  const runAfterDraftExit = useCallback((action: () => void) => {
    if (isSaving) {
      showToast('笔记正在保存，请稍候。')
      return
    }
    if (!draft) {
      action()
      return
    }
    if (!draftDirty) {
      clearDraft()
      action()
      return
    }
    pendingDiscardActionRef.current = action
    setDiscardPromptOpen(true)
  }, [clearDraft, draft, draftDirty, isSaving, showToast])

  const confirmDiscard = () => {
    if (isSaving) {
      showToast('笔记正在保存，暂时无法放弃草稿。')
      return
    }
    const action = pendingDiscardActionRef.current
    pendingDiscardActionRef.current = null
    setDiscardPromptOpen(false)
    clearDraft()
    action?.()
  }

  useEffect(() => () => {
    if (toastTimerRef.current != null) window.clearTimeout(toastTimerRef.current)
  }, [])

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const focusFrame = window.requestAnimationFrame(() => backButtonRef.current?.focus())
    return () => {
      window.cancelAnimationFrame(focusFrame)
      window.requestAnimationFrame(() => previouslyFocused?.focus())
    }
  }, [])

  useEffect(() => {
    if (!draftDirty && !isSaving) return
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warnBeforeUnload)
    return () => window.removeEventListener('beforeunload', warnBeforeUnload)
  }, [draftDirty, isSaving])

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(max-width: 1120px)')
    const updateMode = () => setNotesAreOverlay(query.matches)
    updateMode()
    query.addEventListener('change', updateMode)
    return () => query.removeEventListener('change', updateMode)
  }, [])

  useEffect(() => {
    if (!notesAreOverlay || !mobileNotesOpen) return
    const frame = window.requestAnimationFrame(() => notesPanelRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [mobileNotesOpen, notesAreOverlay])

  useEffect(() => {
    const host = viewportHostRef.current
    if (!host) return
    const updateWidth = () => setHostWidth((current) => {
      const next = Math.round(host.getBoundingClientRect().width)
      return Math.abs(next - current) > 2 ? next : current
    })
    updateWidth()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateWidth)
    observer?.observe(host)
    window.addEventListener('resize', updateWidth)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', updateWidth)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    let loadingTask: PDFDocumentLoadingTask | null = null
    let passwordCancelled = false

    setIsLoading(true)
    setLoadError('')
    setRenderError('')
    setAnnotationError('')
    setPdfDocument(null)
    setAnnotations([])
    setPage(Math.max(1, Math.round(initialPageNumber ?? 1)))
    setZoom(100)
    setPageCount(documentItem.pdfArchive?.pageCount ?? 0)
    setHasSelectableText(null)
    setCrop(null)
    clearDraft()

    const load = async () => {
      const [fileResult, annotationResult] = await Promise.all([
        loadPdfArchiveFile(documentItem.id),
        loadPdfAnnotations(documentItem.id),
      ])
      if (cancelled) return

      if (annotationResult.ok) {
        setAnnotations(annotationResult.value)
        const locatedAnnotation = annotationResult.value.find((annotation) => annotation.id === initialAnnotationId)
        if (locatedAnnotation) {
          setPage(locatedAnnotation.pageNumber)
          setMobileNotesOpen(true)
        }
      } else setAnnotationError(annotationResult.error)

      if (!fileResult.ok) {
        setLoadError(fileResult.error)
        setIsLoading(false)
        return
      }

      const assetBase = new URL(`${import.meta.env.BASE_URL}pdfjs/`, window.location.href).href
      loadingTask = getDocument({
        data: new Uint8Array(fileResult.value.data),
        cMapUrl: `${assetBase}cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `${assetBase}standard_fonts/`,
        wasmUrl: `${assetBase}wasm/`,
        iccUrl: `${assetBase}iccs/`,
      })
      loadingTaskRef.current = loadingTask
      loadingTask.onPassword = (updatePassword: (password: string) => void, reason: number) => {
        if (cancelled) return
        setPasswordValue('')
        setPasswordPrompt({
          incorrect: reason === PasswordResponses.INCORRECT_PASSWORD,
          submit: (password) => {
            setPasswordPrompt(null)
            updatePassword(password)
          },
          cancel: () => {
            passwordCancelled = true
            setPasswordPrompt(null)
            setLoadError('已取消打开加密 PDF。')
            void loadingTask?.destroy()
          },
        })
      }

      try {
        const loadedDocument = await loadingTask.promise
        if (cancelled) {
          await loadingTask.destroy()
          return
        }
        setPdfDocument(loadedDocument)
        setPageCount(loadedDocument.numPages)
        setPage((current) => clamp(current, 1, loadedDocument.numPages))
      } catch (error) {
        if (!cancelled && !passwordCancelled) {
          console.error('PDF archive loading failed', error)
          setLoadError('PDF 解析失败，文件可能已损坏或使用了不支持的加密方式。')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
      setPasswordPrompt(null)
      if (loadingTaskRef.current === loadingTask) loadingTaskRef.current = null
      if (loadingTask) void loadingTask.destroy().catch(() => undefined)
    }
  }, [clearDraft, documentItem.id, documentItem.pdfArchive?.pageCount, initialAnnotationId, initialPageNumber, reloadToken])

  useEffect(() => {
    const canvas = canvasRef.current
    const textContainer = textLayerContainerRef.current
    const pageElement = pageElementRef.current
    if (!pdfDocument || !canvas || !textContainer || !pageElement) return

    const sequence = ++renderSequenceRef.current
    let disposed = false
    let renderedPage: PDFPageProxy | null = null
    let renderTask: RenderTask | null = null
    let textLayer: TextLayer | null = null

    const render = async () => {
      setIsRendering(true)
      setRenderError('')
      setHasSelectableText(null)
      setCrop(null)
      window.getSelection()?.removeAllRanges()
      try {
        renderedPage = await pdfDocument.getPage(page)
        if (disposed) return
        renderedPageRef.current = renderedPage
        const baseViewport = renderedPage.getViewport({ scale: 1 })
        const availableWidth = Math.max(260, (hostWidth || DEFAULT_PAGE_WIDTH + 64) - (hostWidth <= 680 ? 24 : 64))
        const fitWidth = Math.min(DEFAULT_PAGE_WIDTH, availableWidth)
        const fitScale = fitWidth / baseViewport.width
        const viewport = renderedPage.getViewport({ scale: fitScale * zoom / 100 })
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

        pageElement.style.width = `${viewport.width}px`
        pageElement.style.height = `${viewport.height}px`
        pageElement.style.setProperty('--scale-factor', String(viewport.scale))
        pageElement.style.setProperty('--user-unit', String(viewport.userUnit))
        pageElement.style.setProperty('--total-scale-factor', 'calc(var(--scale-factor) * var(--user-unit))')
        pageElement.style.setProperty('--scale-round-x', '1px')
        pageElement.style.setProperty('--scale-round-y', '1px')
        setPageSize({ width: viewport.width, height: viewport.height })

        canvas.width = Math.max(1, Math.ceil(viewport.width * pixelRatio))
        canvas.height = Math.max(1, Math.ceil(viewport.height * pixelRatio))
        canvas.style.width = `${viewport.width}px`
        canvas.style.height = `${viewport.height}px`
        textContainer.replaceChildren()

        renderTask = renderedPage.render({
          canvas,
          viewport,
          transform: pixelRatio === 1 ? undefined : [pixelRatio, 0, 0, pixelRatio, 0, 0],
        })
        renderTaskRef.current = renderTask
        await renderTask.promise
        if (disposed || sequence !== renderSequenceRef.current) return

        textLayer = new TextLayer({
          textContentSource: renderedPage.streamTextContent({ includeMarkedContent: true }),
          container: textContainer,
          viewport,
        })
        textLayerRef.current = textLayer
        await textLayer.render()
        if (disposed || sequence !== renderSequenceRef.current) return
        if (initialPageNumber === page && initialSearchQuery?.trim()) {
          const terms = Array.from(new Set(initialSearchQuery
            .trim()
            .toLocaleLowerCase('zh-CN')
            .split(/\s+/)
            .filter(Boolean)))
          textContainer.querySelectorAll<HTMLElement>('span').forEach((element) => {
            const value = element.textContent?.toLocaleLowerCase('zh-CN') ?? ''
            if (terms.some((term) => value.includes(term))) element.classList.add('is-search-hit')
          })
          const targetKey = `${documentItem.id}:${page}:${initialSearchQuery}`
          if (announcedSearchTargetRef.current !== targetKey) {
            announcedSearchTargetRef.current = targetKey
            showToast(`已定位“${initialSearchQuery.trim().slice(0, 24)}”所在第 ${page} 页`)
          }
        }
        setHasSelectableText(textLayer.textContentItemsStr.some((item) => item.trim().length > 0))
      } catch (error) {
        if (disposed || error instanceof RenderingCancelledException) return
        console.error('PDF page rendering failed', error)
        setRenderError('当前页面渲染失败，请重试或切换其他页。')
      } finally {
        if (!disposed && sequence === renderSequenceRef.current) setIsRendering(false)
      }
    }

    void render()
    return () => {
      disposed = true
      renderTask?.cancel()
      textLayer?.cancel()
      if (renderTaskRef.current === renderTask) renderTaskRef.current = null
      if (textLayerRef.current === textLayer) textLayerRef.current = null
      const cleanup = () => {
        renderedPage?.cleanup()
        if (renderedPageRef.current === renderedPage) renderedPageRef.current = null
      }
      if (renderTask) void renderTask.promise.catch(() => undefined).finally(cleanup)
      else cleanup()
    }
  }, [documentItem.id, hostWidth, initialPageNumber, initialSearchQuery, page, pdfDocument, renderRetryToken, showToast, zoom])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const reader = readerRef.current
        if (!reader) return
        const nestedDialog = reader.querySelector<HTMLElement>('.pdf-archive-reader__modal-backdrop [role="dialog"]')
        const scope = nestedDialog ?? reader
        const focusable = Array.from(scope.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )).filter((element) => element.offsetParent !== null && !element.closest('[inert]'))
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable.at(-1)!
        if (!scope.contains(document.activeElement)) {
          event.preventDefault()
          ;(event.shiftKey ? last : first).focus()
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
        return
      }
      if (event.key !== 'Escape') return
      if (isSaving) return
      if (passwordPrompt) {
        event.preventDefault()
        passwordPrompt.cancel()
        return
      }
      if (deleteTarget) {
        event.preventDefault()
        setDeleteTarget(null)
        return
      }
      if (discardPromptOpen) {
        event.preventDefault()
        pendingDiscardActionRef.current = null
        setDiscardPromptOpen(false)
        return
      }
      if (crop) {
        event.preventDefault()
        setCrop(null)
        setIsDraggingCrop(false)
        return
      }
      if (mobileNotesOpen) {
        event.preventDefault()
        setMobileNotesOpen(false)
        window.requestAnimationFrame(() => mobileNotesButtonRef.current?.focus())
        return
      }
      event.preventDefault()
      runAfterDraftExit(onClose)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [crop, deleteTarget, discardPromptOpen, isSaving, mobileNotesOpen, onClose, passwordPrompt, runAfterDraftExit])

  const sortedAnnotations = useMemo(() => [...annotations].sort((left, right) => {
    const timeDifference = Date.parse(right.updatedAt) - Date.parse(left.updatedAt)
    return Number.isFinite(timeDifference) && timeDifference !== 0 ? timeDifference : right.pageNumber - left.pageNumber
  }), [annotations])

  const visibleAnnotations = useMemo(() => {
    const current = annotations.filter((annotation) => annotation.pageNumber === page)
    if (draft?.pageNumber === page) {
      return [...current.filter((annotation) => annotation.id !== draft.id), draft]
    }
    return current
  }, [annotations, draft, page])

  const changePage = (nextPage: number) => {
    if (!pageCount) return
    const safePage = clamp(Math.round(nextPage) || 1, 1, pageCount)
    setPage(safePage)
    setCrop(null)
    window.getSelection()?.removeAllRanges()
  }

  const changeTool = (nextTool: ReaderTool) => {
    if (isSaving) {
      showToast('笔记正在保存，请稍候。')
      return
    }
    if (nextTool === tool) return
    runAfterDraftExit(() => {
      setTool(nextTool)
      setCrop(null)
      window.getSelection()?.removeAllRanges()
    })
  }

  const openMobileNotes = () => setMobileNotesOpen(true)

  const closeMobileNotes = () => {
    setMobileNotesOpen(false)
    window.requestAnimationFrame(() => mobileNotesButtonRef.current?.focus())
  }

  const createHighlightDraft = (quote: string, rects: PdfAnnotationRect[], wasTruncated = false) => {
    runAfterDraftExit(() => {
      const timestamp = new Date().toISOString()
      setDraft({
        id: createAnnotationId(),
        documentId: documentItem.id,
        kind: 'highlight',
        pageNumber: page,
        quote,
        note: '',
        rects,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      setDraftBaseline(null)
      setMobileNotesOpen(true)
      if (wasTruncated) showToast('引用较长，已保留前 500 字。')
    })
  }

  const finishTextSelection = () => {
    if (tool !== 'highlight' || isRendering || isSaving || hasSelectableText === false) return false
    const selection = window.getSelection()
    const textContainer = textLayerContainerRef.current
    const pageElement = pageElementRef.current
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed || !textContainer || !pageElement) return false
    const sourceRange = selection.getRangeAt(0)
    if (!isNodeInside(textContainer, sourceRange.startContainer) || !isNodeInside(textContainer, sourceRange.endContainer)) return false
    const wasTruncated = sourceRange.toString().length > MAX_QUOTE_LENGTH
    const range = limitRangeToCharacters(sourceRange, textContainer, MAX_QUOTE_LENGTH)
    const quote = normalizedText(range.toString()).slice(0, MAX_QUOTE_LENGTH)
    const rects = normalizedRectsFromRange(range, pageElement.getBoundingClientRect())
    selection.removeAllRanges()
    if (!quote || !rects.length) return false
    createHighlightDraft(quote, rects, wasTruncated)
    return true
  }

  const finishTextSelectionFallback = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const textContainer = textLayerContainerRef.current
    const pageElement = pageElementRef.current
    if (!textContainer || !pageElement || hasSelectableText === false) return
    const selectionBounds = {
      left: Math.min(start.x, end.x),
      right: Math.max(start.x, end.x),
      top: Math.min(start.y, end.y) - 4,
      bottom: Math.max(start.y, end.y) + 4,
    }
    const spans = Array.from(textContainer.querySelectorAll<HTMLElement>('span'))
      .map((span) => ({ span, bounds: span.getBoundingClientRect() }))
      .filter(({ span, bounds }) => (
        Boolean(span.textContent?.trim())
        && bounds.width > 0
        && bounds.height > 0
        && bounds.right >= selectionBounds.left
        && bounds.left <= selectionBounds.right
        && bounds.bottom >= selectionBounds.top
        && bounds.top <= selectionBounds.bottom
      ))
    if (!spans.length) return
    const rawQuote = normalizedText(spans.map(({ span }) => span.textContent ?? '').join(' '))
    const quote = rawQuote.slice(0, MAX_QUOTE_LENGTH)
    const pageBounds = pageElement.getBoundingClientRect()
    const rects = spans.slice(0, MAX_RECTS).map(({ bounds }) => {
      const x = roundCoordinate(clamp((bounds.left - pageBounds.left) / pageBounds.width, 0, 1))
      const y = roundCoordinate(clamp((bounds.top - pageBounds.top) / pageBounds.height, 0, 1))
      return {
        x,
        y,
        width: roundCoordinate(clamp(bounds.width / pageBounds.width, 0, 1 - x)),
        height: roundCoordinate(clamp(bounds.height / pageBounds.height, 0, 1 - y)),
      }
    }).filter((rect) => rect.width > 0 && rect.height > 0)
    if (quote && rects.length) createHighlightDraft(quote, rects, rawQuote.length > MAX_QUOTE_LENGTH)
  }

  const pointInsidePage = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return {
      x: clamp(event.clientX - bounds.left, 0, bounds.width),
      y: clamp(event.clientY - bounds.top, 0, bounds.height),
    }
  }

  const beginCrop = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (tool !== 'screenshot' || isRendering || isSaving || event.button !== 0 || !event.isPrimary) return
    if ((event.target as Element).closest('.pdf-archive-reader__crop-actions')) return
    event.preventDefault()
    window.getSelection()?.removeAllRanges()
    const point = pointInsidePage(event)
    cropStartRef.current = point
    setCrop({ x: point.x, y: point.y, width: 0, height: 0 })
    setIsDraggingCrop(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const beginPageInteraction = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isSaving) return
    if (tool === 'screenshot') {
      beginCrop(event)
      return
    }
    if (tool === 'highlight' && !isRendering && event.button === 0 && event.isPrimary) {
      highlightStartRef.current = { x: event.clientX, y: event.clientY }
    }
  }

  const moveCrop = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = cropStartRef.current
    if (!start || tool !== 'screenshot') return
    const point = pointInsidePage(event)
    setCrop({
      x: Math.min(start.x, point.x),
      y: Math.min(start.y, point.y),
      width: Math.abs(point.x - start.x),
      height: Math.abs(point.y - start.y),
    })
  }

  const finishCrop = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = cropStartRef.current
    if (!start) return
    const point = pointInsidePage(event)
    const nextCrop = {
      x: Math.min(start.x, point.x),
      y: Math.min(start.y, point.y),
      width: Math.abs(point.x - start.x),
      height: Math.abs(point.y - start.y),
    }
    cropStartRef.current = null
    setIsDraggingCrop(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (nextCrop.width < MIN_CROP_SIZE || nextCrop.height < MIN_CROP_SIZE) {
      setCrop(null)
      showToast('截图区域过小，请重新拖拽选择。')
      return
    }
    setCrop(nextCrop)
  }

  const cancelCropDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    cropStartRef.current = null
    setIsDraggingCrop(false)
    setCrop(null)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const finishPageInteraction = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (tool === 'screenshot') {
      finishCrop(event)
      return
    }
    const start = highlightStartRef.current
    highlightStartRef.current = null
    if (!start) return
    const end = { x: event.clientX, y: event.clientY }
    if (finishTextSelection()) return
    if (Math.hypot(end.x - start.x, end.y - start.y) >= 4) finishTextSelectionFallback(start, end)
  }

  const cancelPageInteraction = (event: ReactPointerEvent<HTMLDivElement>) => {
    highlightStartRef.current = null
    if (tool === 'screenshot') cancelCropDrag(event)
  }

  const captureCrop = async () => {
    const canvas = canvasRef.current
    const pageElement = pageElementRef.current
    if (!canvas || !pageElement || !crop || isCapturing || isSaving) return
    setIsCapturing(true)
    try {
      const pageBounds = pageElement.getBoundingClientRect()
      const imageDataUrl = await screenshotDataUrl(canvas, pageBounds, crop)
      if (imageDataUrl.length > MAX_SCREENSHOT_DATA_URL_LENGTH) throw new Error('screenshot-too-large')
      const timestamp = new Date().toISOString()
      const normalizedRect: PdfAnnotationRect = {
        x: roundCoordinate(clamp(crop.x / pageBounds.width, 0, 1)),
        y: roundCoordinate(clamp(crop.y / pageBounds.height, 0, 1)),
        width: 0,
        height: 0,
      }
      normalizedRect.width = roundCoordinate(clamp(crop.width / pageBounds.width, 0, 1 - normalizedRect.x))
      normalizedRect.height = roundCoordinate(clamp(crop.height / pageBounds.height, 0, 1 - normalizedRect.y))
      setDraft({
        id: createAnnotationId(),
        documentId: documentItem.id,
        kind: 'screenshot',
        pageNumber: page,
        quote: '',
        imageDataUrl,
        note: '',
        rects: [normalizedRect],
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      setDraftBaseline(null)
      setCrop(null)
      setTool('highlight')
      setMobileNotesOpen(true)
      showToast('截图已生成，请补充笔记并保存。')
    } catch (error) {
      console.error('PDF screenshot failed', error)
      showToast('截图过大或生成失败，请缩小范围后重试。')
    } finally {
      setIsCapturing(false)
    }
  }

  const hydrateScreenshot = async (annotation: PdfArchiveAnnotation) => {
    if (annotation.kind !== 'screenshot' || annotation.imageDataUrl) return annotation
    if (!annotation.imageAssetKey) {
      showToast('截图内容已丢失，请重新截取。')
      return null
    }
    setLoadingImageIds((current) => ({ ...current, [annotation.id]: true }))
    try {
      const result = await loadPdfAnnotationImage(documentItem.id, annotation.imageAssetKey)
      if (!result.ok) {
        showToast(result.error)
        return null
      }
      const hydrated = { ...annotation, imageDataUrl: result.value }
      setAnnotations((current) => current.map((item) => item.id === hydrated.id ? hydrated : item))
      return hydrated
    } finally {
      setLoadingImageIds((current) => ({ ...current, [annotation.id]: false }))
    }
  }

  const editAnnotation = (annotation: PdfArchiveAnnotation) => {
    runAfterDraftExit(() => {
      void (async () => {
        const hydrated = await hydrateScreenshot(annotation)
        if (!hydrated) return
        const copy = { ...hydrated, rects: hydrated.rects.map((rect) => ({ ...rect })) }
        setDraft(copy)
        setDraftBaseline(copy)
        changePage(hydrated.pageNumber)
        setMobileNotesOpen(true)
      })()
    })
  }

  const saveDraft = async () => {
    if (!draft || isSaving) return
    const savingDraftId = draft.id
    const savingDraftNote = draft.note
    const previous = annotations
    const timestamp = new Date().toISOString()
    const finalDraft: PdfArchiveAnnotation = {
      ...draft,
      note: draft.note.trim(),
      updatedAt: timestamp,
    }
    const next = previous.some((annotation) => annotation.id === finalDraft.id)
      ? previous.map((annotation) => annotation.id === finalDraft.id ? finalDraft : annotation)
      : [...previous, finalDraft]
    setIsSaving(true)
    try {
      const result = await onSaveAnnotations(next, previous)
      if (!result.ok) {
        showToast(result.error)
        return
      }
      setAnnotations(result.annotations)
      setDraft((current) => current?.id === savingDraftId && current.note === savingDraftNote ? null : current)
      setDraftBaseline((current) => current?.id === savingDraftId ? null : current)
      showToast('笔记已保存。')
    } catch (error) {
      console.error('PDF annotation save failed', error)
      showToast('笔记保存失败，请稍后重试。')
    } finally {
      setIsSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget || isSaving) return
    const target = deleteTarget
    const previous = annotations
    const next = previous.filter((annotation) => annotation.id !== target.id)
    setIsSaving(true)
    try {
      const result = await onSaveAnnotations(next, previous)
      if (!result.ok) {
        showToast(result.error)
        return
      }
      setAnnotations(result.annotations)
      if (draft?.id === target.id) clearDraft()
      setDeleteTarget(null)
      showToast('笔记已删除。')
    } catch (error) {
      console.error('PDF annotation delete failed', error)
      showToast('笔记删除失败，请稍后重试。')
    } finally {
      setIsSaving(false)
    }
  }

  const runDocumentAction = async (action: 'download' | 'export') => {
    if (busyAction || (action === 'export' && isSaving)) return
    setBusyAction(action)
    try {
      const result = action === 'download' ? await onDownload() : await onExport(annotations)
      if (!result.ok) showToast(result.error || `${action === 'download' ? '下载' : '导出'}失败，请稍后重试。`)
      else showToast(action === 'download' ? '原 PDF 已开始下载。' : '笔记 PDF 已生成。')
    } catch (error) {
      console.error(`PDF ${action} failed`, error)
      showToast(`${action === 'download' ? '下载' : '导出'}失败，请稍后重试。`)
    } finally {
      setBusyAction(null)
    }
  }

  const submitPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = passwordValue.trim()
    if (!value || !passwordPrompt) return
    passwordPrompt.submit(value)
  }

  const cropActionStyle = crop && pageSize.width && pageSize.height ? {
    left: clamp(crop.x, 8, Math.max(8, pageSize.width - 176)),
    top: crop.y + crop.height + 8 <= pageSize.height - 38
      ? crop.y + crop.height + 8
      : Math.max(8, crop.y - 38),
  } satisfies CSSProperties : undefined

  return (
    <section ref={readerRef} className="pdf-archive-reader" role="dialog" aria-modal="true" aria-label={`${documentItem.title} PDF 在线阅读器`}>
      <header className="pdf-archive-reader__header">
        <button ref={backButtonRef} className="pdf-archive-reader__back" type="button" aria-label="返回存档列表" disabled={isSaving} onClick={() => runAfterDraftExit(onClose)}>
          <img src="/assets/reading/back.svg" alt="" />
        </button>
        <span className="pdf-archive-reader__file-icon"><img src="/assets/reading/pdf.svg" alt="" /></span>
        <div className="pdf-archive-reader__title">
          <strong title={documentItem.title}>{documentItem.title}</strong>
          <small>已存档 · {documentItem.pdfArchive?.originalName || '本地 PDF'}{pageCount ? ` · ${pageCount} 页` : ''}</small>
        </div>
        <div className="pdf-archive-reader__header-actions">
          <button type="button" disabled={busyAction != null || isLoading} onClick={() => void runDocumentAction('download')}>
            <img src="/assets/reading/download.svg" alt="" />
            <span>{busyAction === 'download' ? '下载中' : '下载原文'}</span>
          </button>
          <button className="is-primary" type="button" title={!annotations.length ? '完成划词或截图笔记后可导出' : undefined} disabled={busyAction != null || isSaving || !annotations.length || draftDirty} onClick={() => void runDocumentAction('export')}>
            <span>{busyAction === 'export' ? '生成中' : '导出笔记 PDF'}</span>
            <i className="pdf-archive-reader__export-icon" aria-hidden="true" />
          </button>
          <button ref={mobileNotesButtonRef} className="pdf-archive-reader__mobile-notes" type="button" aria-expanded={mobileNotesOpen} aria-controls="pdf-archive-notes-panel" onClick={openMobileNotes}>
            笔记 {annotations.length}
          </button>
        </div>
      </header>

      <aside className="pdf-archive-reader__rail" aria-label="PDF 标注工具">
        <button className={tool === 'highlight' ? 'is-active' : ''} type="button" aria-pressed={tool === 'highlight'} disabled={isSaving} onClick={() => changeTool('highlight')}>
          <img src="/assets/reading/note-tool.svg" alt="" />
          <span>划词</span>
        </button>
        <button className={tool === 'screenshot' ? 'is-active' : ''} type="button" aria-pressed={tool === 'screenshot'} disabled={isSaving} onClick={() => changeTool('screenshot')}>
          <img src="/assets/reading/camera-tool.svg" alt="" />
          <span>截图</span>
        </button>
        <button type="button" aria-label={`打开文献笔记，共 ${annotations.length} 条`} onClick={openMobileNotes}>
          <img src="/assets/reading/notes.svg" alt="" />
          <span>{annotations.length}</span>
        </button>
      </aside>

      <main className="pdf-archive-reader__stage" ref={viewportHostRef}>
        {isLoading && (
          <div className="pdf-archive-reader__status" role="status">
            <span className="pdf-archive-reader__spinner" />
            <strong>正在在线解析 PDF</strong>
            <p>文件保留在当前浏览器中，解析完成后即可划词和截图。</p>
          </div>
        )}
        {!isLoading && loadError && (
          <div className="pdf-archive-reader__status is-error" role="alert">
            <span className="pdf-archive-reader__status-icon">!</span>
            <strong>无法打开此 PDF</strong>
            <p>{loadError}</p>
            <div><button type="button" onClick={() => setReloadToken((current) => current + 1)}>重新加载</button><button type="button" onClick={() => runAfterDraftExit(onClose)}>返回列表</button></div>
          </div>
        )}
        {!isLoading && !loadError && (
          <div className="pdf-archive-reader__scroll">
            <div
              className={`pdf-archive-reader__page${tool === 'screenshot' ? ' is-screenshot-tool' : ' is-highlight-tool'}${crop ? ' is-cropping' : ''}`}
              ref={pageElementRef}
              aria-label={`PDF 第 ${page} 页`}
              onPointerDown={beginPageInteraction}
              onPointerMove={moveCrop}
              onPointerUp={finishPageInteraction}
              onPointerCancel={cancelPageInteraction}
            >
              <canvas ref={canvasRef} aria-label={`文献第 ${page} 页图像`} />
              <div className="pdf-archive-reader__annotation-layer" aria-hidden="true">
                {visibleAnnotations.flatMap((annotation) => annotation.rects.map((rect, index) => (
                  <span
                    className={`pdf-archive-reader__annotation is-${annotation.kind}${draft?.id === annotation.id ? ' is-draft' : ''}`}
                    key={`${annotation.id}-${index}`}
                    style={{
                      left: `${rect.x * 100}%`,
                      top: `${rect.y * 100}%`,
                      width: `${rect.width * 100}%`,
                      height: `${rect.height * 100}%`,
                    }}
                  />
                )))}
              </div>
              <div ref={textLayerContainerRef} className="pdf-archive-reader__text-layer" />
              {crop && (
                <>
                  <span
                    className="pdf-archive-reader__crop"
                    style={{ left: crop.x, top: crop.y, width: crop.width, height: crop.height }}
                  />
                  {!isDraggingCrop && cropActionStyle && (
                    <div className="pdf-archive-reader__crop-actions" style={cropActionStyle}>
                      <button type="button" disabled={isCapturing || isSaving} onClick={() => void captureCrop()}>{isCapturing ? '生成中' : '添加到笔记'}</button>
                      <button type="button" disabled={isCapturing} onClick={() => setCrop(null)}>取消</button>
                    </div>
                  )}
                </>
              )}
              {isRendering && <div className="pdf-archive-reader__page-loading"><span className="pdf-archive-reader__spinner" />正在渲染第 {page} 页</div>}
            </div>
            {renderError && <div className="pdf-archive-reader__inline-error" role="alert">{renderError}<button type="button" onClick={() => setRenderRetryToken((current) => current + 1)}>重试</button></div>}
            {!isRendering && hasSelectableText === false && !renderError && (
              <div className="pdf-archive-reader__scan-tip" role="status">本页未检测到可选择文本，可能是扫描件。你仍可使用截图添加笔记。</div>
            )}
          </div>
        )}
      </main>

      {mobileNotesOpen && <button className="pdf-archive-reader__notes-scrim" type="button" aria-label="关闭笔记面板" onClick={closeMobileNotes} />}
      <aside
        id="pdf-archive-notes-panel"
        ref={notesPanelRef}
        className={`pdf-archive-reader__notes${mobileNotesOpen ? ' is-mobile-open' : ''}`}
        aria-label="文献笔记"
        aria-hidden={notesAreOverlay && !mobileNotesOpen}
        inert={notesAreOverlay && !mobileNotesOpen}
        tabIndex={-1}
      >
        <header>
          <div><strong>文献笔记</strong><span>{annotations.length} 条</span></div>
          <button type="button" aria-label="关闭笔记面板" onClick={closeMobileNotes}><span className="pdf-archive-reader__close-icon" /></button>
        </header>
        {annotationError && <div className="pdf-archive-reader__notes-warning" role="alert">{annotationError}</div>}

        {draft && (
          <article className="pdf-archive-reader__editor">
            <header>
              <div><span className={`is-${draft.kind}`}>{draft.kind === 'highlight' ? '划词' : '截图'}</span><strong>{draftBaseline ? '编辑笔记' : '新建笔记'}</strong></div>
              <small>原文第 {draft.pageNumber} 页</small>
            </header>
            {draft.kind === 'highlight' ? <blockquote>{draft.quote}</blockquote> : draft.imageDataUrl ? <img className="pdf-archive-reader__editor-image" src={draft.imageDataUrl} alt={`第 ${draft.pageNumber} 页截图`} /> : null}
            <label htmlFor="pdf-archive-note-draft">笔记内容</label>
            <textarea
              id="pdf-archive-note-draft"
              autoFocus
              maxLength={MAX_NOTE_LENGTH}
              disabled={isSaving}
              value={draft.note}
              placeholder="记录你的理解、结论或待验证问题…"
              onChange={(event) => setDraft((current) => current ? { ...current, note: event.target.value } : current)}
            />
            <div className="pdf-archive-reader__editor-count">{draft.note.length} / {MAX_NOTE_LENGTH}</div>
            <footer>
              <button type="button" disabled={isSaving} onClick={() => runAfterDraftExit(clearDraft)}>取消</button>
              <button className="is-primary" type="button" disabled={isSaving} onClick={() => void saveDraft()}>{isSaving ? '保存中' : '保存笔记'}</button>
            </footer>
          </article>
        )}

        <div className="pdf-archive-reader__note-list">
          {!sortedAnnotations.length && !draft && (
            <div className="pdf-archive-reader__notes-empty">
              <img src="/assets/reading/notes-empty.svg" alt="" />
              <strong>暂无笔记</strong>
              <p>在正文中划词，或使用截图工具标注文献重点。</p>
            </div>
          )}
          {sortedAnnotations.map((annotation) => (
            <article className={`${draft?.id === annotation.id ? 'is-editing ' : ''}${initialAnnotationId === annotation.id ? 'is-located' : ''}`.trim()} key={annotation.id}>
              <header>
                <button type="button" onClick={() => changePage(annotation.pageNumber)}>第 {annotation.pageNumber} 页</button>
                <span className={`is-${annotation.kind}`}>{annotation.kind === 'highlight' ? '划词' : '截图'}</span>
                <time>{formatTime(annotation.updatedAt)}</time>
              </header>
              {annotation.kind === 'highlight' && annotation.quote && <blockquote>{annotation.quote}</blockquote>}
              {annotation.kind === 'screenshot' && (annotation.imageDataUrl
                ? <img src={annotation.imageDataUrl} alt={`第 ${annotation.pageNumber} 页截图笔记`} />
                : <button
                    className="pdf-archive-reader__load-screenshot"
                    type="button"
                    disabled={Boolean(loadingImageIds[annotation.id])}
                    onClick={() => void hydrateScreenshot(annotation)}
                  >{loadingImageIds[annotation.id] ? '正在加载截图…' : '点击预览截图'}</button>)}
              <p className={annotation.note ? '' : 'is-empty'}>{annotation.note || '尚未填写补充说明'}</p>
              <footer>
                <button type="button" disabled={isSaving} onClick={() => editAnnotation(annotation)}>编辑</button>
                <button type="button" disabled={isSaving} onClick={() => setDeleteTarget(annotation)}>删除</button>
              </footer>
            </article>
          ))}
        </div>
      </aside>

      <footer className="pdf-archive-reader__footer">
        <div className="pdf-archive-reader__page-controls">
          <button type="button" aria-label="上一页" disabled={page <= 1 || isLoading} onClick={() => changePage(page - 1)}>‹</button>
          <label><span className="sr-only">当前页</span><input type="number" min={1} max={Math.max(1, pageCount)} value={page} onChange={(event) => changePage(Number(event.target.value))} /></label>
          <span>/ {pageCount || '--'}</span>
          <button type="button" aria-label="下一页" disabled={!pageCount || page >= pageCount || isLoading} onClick={() => changePage(page + 1)}>›</button>
        </div>
        <div className="pdf-archive-reader__tool-hint">
          <img src={tool === 'highlight' ? '/assets/reading/note-tool.svg' : '/assets/reading/camera-tool.svg'} alt="" />
          <span>{tool === 'highlight' ? (hasSelectableText === false ? '本页无文本层，请使用截图' : '拖动选择文字以新建笔记') : '在页面上拖拽选择截图区域'}</span>
        </div>
        <div className="pdf-archive-reader__zoom">
          <button type="button" aria-label="缩小" disabled={zoom <= 50} onClick={() => setZoom((current) => Math.max(50, current - 10))}><img src="/assets/reading/zoom-minus.svg" alt="" /></button>
          <input aria-label="缩放比例" type="range" min={50} max={200} step={10} value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
          <button type="button" aria-label="放大" disabled={zoom >= 200} onClick={() => setZoom((current) => Math.min(200, current + 10))}><img src="/assets/reading/zoom-plus.svg" alt="" /></button>
          <span>{zoom}%</span>
        </div>
      </footer>

      {passwordPrompt && (
        <div className="pdf-archive-reader__modal-backdrop">
          <form className="pdf-archive-reader__modal" role="dialog" aria-modal="true" aria-labelledby="pdf-password-title" onSubmit={submitPassword}>
            <header><strong id="pdf-password-title">输入 PDF 密码</strong></header>
            <p>{passwordPrompt.incorrect ? '密码不正确，请重新输入。' : '该 PDF 已加密，输入密码后继续解析。'}</p>
            <input autoFocus aria-label="PDF 密码" autoComplete="current-password" type="password" value={passwordValue} placeholder="请输入密码" onChange={(event) => setPasswordValue(event.target.value)} />
            <footer><button type="button" onClick={passwordPrompt.cancel}>取消</button><button className="is-primary" type="submit" disabled={!passwordValue.trim()}>继续打开</button></footer>
          </form>
        </div>
      )}

      {discardPromptOpen && (
        <div className="pdf-archive-reader__modal-backdrop">
          <div className="pdf-archive-reader__modal" role="dialog" aria-modal="true" aria-labelledby="pdf-discard-title">
            <header><strong id="pdf-discard-title">笔记尚未保存</strong></header>
            <p>离开后，本次划词、截图或编辑内容将不会保存。</p>
            <footer><button autoFocus type="button" onClick={() => { pendingDiscardActionRef.current = null; setDiscardPromptOpen(false) }}>继续编辑</button><button className="is-danger" type="button" disabled={isSaving} onClick={confirmDiscard}>放弃并离开</button></footer>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="pdf-archive-reader__modal-backdrop">
          <div className="pdf-archive-reader__modal" role="dialog" aria-modal="true" aria-labelledby="pdf-delete-title">
            <header><strong id="pdf-delete-title">删除这条笔记？</strong></header>
            <p>删除后将同时移除对应标注{deleteTarget.kind === 'screenshot' ? '和截图' : ''}，此操作无法撤销。</p>
            <footer><button autoFocus type="button" disabled={isSaving} onClick={() => setDeleteTarget(null)}>取消</button><button className="is-danger" type="button" disabled={isSaving} onClick={() => void confirmDelete()}>{isSaving ? '删除中' : '确认删除'}</button></footer>
          </div>
        </div>
      )}

      {toast && <div className="pdf-archive-reader__toast" role="status" aria-live="polite">{toast}</div>}
    </section>
  )
}

export default PdfArchiveReader
