import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { articleSections, outlineGroups, type ReadingDocument, type ReadingNote } from '../readingData'

type LeftPanel = 'outline' | 'thumbnails' | 'notes'
type InsightPanel = 'ai' | 'charts' | 'references' | 'metadata' | 'graph'
type ContextAction = null | 'highlight' | 'translate' | 'explain' | 'screenshot'
type ActiveTool = null | 'search' | 'note' | 'screenshot'
type CropHandle = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'

interface ReadingResultCards {
  translationVisible: boolean
  translationExpanded: boolean
  explanationVisible: boolean
  explanationExpanded: boolean
}

interface NoteSelection {
  kind: 'field' | 'range'
  sectionTitle: string
  text: string
  start: number
  end: number
}

interface CropRect {
  left: number
  top: number
  width: number
  height: number
}

interface ScreenshotPointer {
  clientX: number
  clientY: number
  localX: number
  localY: number
}

interface ReadingReaderProps {
  documents: ReadingDocument[]
  activeDocumentId: number
  documentTitle: string
  favorite: boolean
  notes: ReadingNote[]
  onSelectDocument: (documentId: number) => void
  onFavorite: () => void
  onNotesChange: (notes: ReadingNote[]) => void
  onEditingNoteChange: (editing: boolean) => void
  onToast: (message: string) => void
}

const insightTabs: Array<{ id: InsightPanel; label: string }> = [
  { id: 'ai', label: 'AI解读' },
  { id: 'charts', label: '图表' },
  { id: 'references', label: '参考文献' },
  { id: 'metadata', label: '元数据' },
  { id: 'graph', label: '图谱' },
]

const highlightColors = ['transparent', '#F2F3F5', '#FABFBD', '#FFE4BA', '#FADC19', '#C6EFC1', '#BDE3FF', '#DCC9FB', '#E5E6EB', '#C9CDD4', '#F76965', '#FF9A2E', '#FADC19', '#62C554', '#7BC0FC', '#B8A1FF']

const aiSearchResults = [
  { page: 1, text: '最佳性能的模型也通过注意力机制连接编码器和解码器，我们提出了一种新的简单网络架构' },
  { page: 5, text: 'Transformer模型架构完全基于注意力机制，完全摒弃了递归和卷积' },
  { page: 6, text: '我们在模型中以三种不同的方式使用多头注意力' },
  { page: 8, text: '我们的实验表明，基于注意力的方法优于之前最先进的模型' },
]

const aiSearchTargetSections = ['1.1.研究背景与意义', '2.1.原料制备', '2.2.表征手段', '3.1.材料形貌分析']

const totalPages = 24
const zoomPresets = [25, 50, 75, 100] as const
const translatedExcerpt = 'Lithium-sulfur batteries are considered to be a promising new generation of energy storage systems due to their high theoretical specific capacity and energy density. However, during the actual charging and discharging process'
const explainedExcerpt = '多硫化物穿梭效应是指锂硫电池充放电过程中，可溶性锂多硫化物在正负极之间反复迁移并发生副反应的现象。它会造成活性硫流失、锂负极腐蚀、容量衰减、库伦效率降低和自放电加剧，是限制锂硫电池商业化应用的核心问题之一。'
const expandedNoteExcerpt = '多硫化物穿梭效应通常出现在锂硫电池中，是锂硫电池容量衰减、库伦效率低、自放电严重的重要原因之一。在放电阶段，正极硫被还原生成可溶性多硫化锂，这些中间产物溶入电解液后，在浓度梯度和电场作用下向锂负极迁移。到达负极后，它们可能与金属锂发生副反应，被进一步还原成短链多硫化物甚至 Li₂S / Li₂S₂，并沉积...全部'
const articleAbstract = '本研究系统性探究了功能化碳纳米管界面对锂硫电池中多硫化物穿梭效应的抑制机理。通过原位X射线衍射（in-situ XRD）、冷冻电子显微镜（cryo-EM）等先进表征手段，结合密度泛函理论（DFT）计算，揭示了碳纳米管表面羧基、氨基官能团与长链多硫化物（Li₂Sₙ，4≤n≤8）之间的化学吸附机制。实验结果表明，所制备的功能化碳纳米管正极宿主材料相比对照组使比容量提升186%，1000次循环后容量保持率达92.3%，展示了优异的长循环稳定性。'
const searchTranslation = 'ThiosulfateThe model with the best performance also connects the encoder and decoder through an attention mechanism, and we propose a new simple network architecture. shuttle effect'

function sectionSlug(sectionTitle: string) {
  return sectionTitle.replace(/[^\d\u4e00-\u9fa5]/g, '')
}

function safeFileName(value: string) {
  return value.replace(/[\\/:*?"<>|]/g, '-').slice(0, 80)
}

function downloadLocalBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

async function captureViewportCrop(rect: CropRect) {
  const width = Math.max(1, Math.round(rect.width))
  const height = Math.max(1, Math.round(rect.height))
  const scale = Math.min(2, window.devicePixelRatio || 1)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas unavailable')
  context.scale(scale, scale)
  context.translate(-rect.left, -rect.top)
  context.beginPath()
  context.rect(rect.left, rect.top, width, height)
  context.clip()
  const excludedSelector = '.reading-screenshot-layer, .reading-screenshot-drag-rect, .reading-screenshot-crosshair, .reading-selection-toolbar'
  const elements = Array.from(document.body.querySelectorAll<HTMLElement>('*'))
  for (const element of elements) {
    if (element.matches(excludedSelector) || element.closest(excludedSelector)) continue
    const bounds = element.getBoundingClientRect()
    if (bounds.right <= rect.left || bounds.left >= rect.left + width || bounds.bottom <= rect.top || bounds.top >= rect.top + height || bounds.width === 0 || bounds.height === 0) continue
    const style = window.getComputedStyle(element)
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) continue
    context.globalAlpha = Number(style.opacity) || 1
    if (style.backgroundColor !== 'transparent' && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
      context.fillStyle = style.backgroundColor
      context.fillRect(bounds.left, bounds.top, bounds.width, bounds.height)
    }
    const borderSides = [
      ['top', bounds.left, bounds.top, bounds.right, bounds.top],
      ['right', bounds.right, bounds.top, bounds.right, bounds.bottom],
      ['bottom', bounds.left, bounds.bottom, bounds.right, bounds.bottom],
      ['left', bounds.left, bounds.top, bounds.left, bounds.bottom],
    ] as const
    borderSides.forEach(([side, x1, y1, x2, y2]) => {
      const borderWidth = Number.parseFloat(style[`border${side[0].toUpperCase()}${side.slice(1)}Width` as keyof CSSStyleDeclaration] as string)
      const borderColor = style[`border${side[0].toUpperCase()}${side.slice(1)}Color` as keyof CSSStyleDeclaration] as string
      if (!borderWidth || borderColor === 'transparent' || borderColor === 'rgba(0, 0, 0, 0)') return
      context.strokeStyle = borderColor
      context.lineWidth = borderWidth
      context.beginPath()
      context.moveTo(x1, y1)
      context.lineTo(x2, y2)
      context.stroke()
    })
    if (element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0) {
      try {
        context.drawImage(element, bounds.left, bounds.top, bounds.width, bounds.height)
      } catch {
        // The remaining DOM and text are still captured if an optional image cannot be drawn.
      }
    }
    for (const node of Array.from(element.childNodes)) {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue
      const lineGroups = new Map<number, { text: string; left: number; bottom: number; height: number }>()
      for (let index = 0; index < node.textContent.length; index += 1) {
        const character = node.textContent[index]
        const range = document.createRange()
        range.setStart(node, index)
        range.setEnd(node, index + 1)
        const characterBounds = range.getBoundingClientRect()
        if (characterBounds.width === 0 && !character.trim()) continue
        const lineKey = Math.round(characterBounds.top * 2) / 2
        const line = lineGroups.get(lineKey)
        if (line) line.text += character
        else lineGroups.set(lineKey, { text: character, left: characterBounds.left, bottom: characterBounds.bottom, height: characterBounds.height })
      }
      context.fillStyle = style.color
      context.textBaseline = 'alphabetic'
      lineGroups.forEach((line) => {
        context.font = `${style.fontWeight} ${Math.max(1, line.height)}px ${style.fontFamily}`
        context.fillText(line.text, line.left, line.bottom - Math.max(1, line.height * 0.12))
      })
    }
  }
  context.globalAlpha = 1
  return await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Unable to encode screenshot')), 'image/png'))
}

export function ReadingReader({
  documents,
  activeDocumentId,
  documentTitle,
  favorite,
  notes,
  onSelectDocument,
  onFavorite,
  onNotesChange,
  onEditingNoteChange,
  onToast,
}: ReadingReaderProps) {
  const [leftPanel, setLeftPanel] = useState<LeftPanel>('outline')
  const [outlineMainExpanded, setOutlineMainExpanded] = useState(true)
  const [rightPanel, setRightPanel] = useState<InsightPanel>('ai')
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(50)
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false)
  const [zoomMenuActiveIndex, setZoomMenuActiveIndex] = useState(1)
  const [zoomDragging, setZoomDragging] = useState(false)
  const [thumbnailZoom, setThumbnailZoom] = useState(25)
  const [contextAction, setContextAction] = useState<ContextAction>(null)
  const [resultCards, setResultCards] = useState<ReadingResultCards>({
    translationVisible: false,
    translationExpanded: false,
    explanationVisible: false,
    explanationExpanded: false,
  })
  const [highlightColorIndex, setHighlightColorIndex] = useState(3)
  const [colorMenuOpen, setColorMenuOpen] = useState(false)
  const [activeTool, setActiveTool] = useState<ActiveTool>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchMode, setSearchMode] = useState<'全文搜索' | '智能关联' | 'AI语义' | '关键词'>('全文搜索')
  const [searchModeOpen, setSearchModeOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchedQuery, setSearchedQuery] = useState('')
  const [translatedResult, setTranslatedResult] = useState<number | null>(null)
  const [locatedResult, setLocatedResult] = useState<number | null>(null)
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiExchange, setAiExchange] = useState<{ question: string; answer: string } | null>(null)
  const [documentMenuOpen, setDocumentMenuOpen] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [noteDetailId, setNoteDetailId] = useState<number | null>(null)
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [noteEditStage, setNoteEditStage] = useState(0)
  const [noteEditorExpanded, setNoteEditorExpanded] = useState(false)
  const [editingNoteText, setEditingNoteText] = useState('')
  const [pendingAddedNote, setPendingAddedNote] = useState('')
  const [uploadedNoteImages, setUploadedNoteImages] = useState<string[]>([])
  const [noteSelection, setNoteSelection] = useState<NoteSelection | null>(null)
  const [contextMenuPosition, setContextMenuPosition] = useState({ left: 8, top: 8 })
  const [screenshotPointer, setScreenshotPointer] = useState<ScreenshotPointer | null>(null)
  const [screenshotDragStart, setScreenshotDragStart] = useState<{ x: number; y: number } | null>(null)
  const [cropRect, setCropRect] = useState<CropRect | null>(null)
  const [mobileInsightsOpen, setMobileInsightsOpen] = useState(false)
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false)
  const [compactLayout, setCompactLayout] = useState(() => window.matchMedia('(max-width: 1180px)').matches)
  const [leftOverlayLayout, setLeftOverlayLayout] = useState(() => window.matchMedia('(max-width: 900px)').matches)
  const paperRef = useRef<HTMLElement>(null)
  const paperScrollRef = useRef<HTMLDivElement>(null)
  const paperZoomStageRef = useRef<HTMLDivElement>(null)
  const readingFrameRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLElement>(null)
  const noteImageInputRef = useRef<HTMLInputElement>(null)
  const noteTextareaRef = useRef<HTMLTextAreaElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const leftContentRef = useRef<HTMLDivElement>(null)
  const thumbnailListRef = useRef<HTMLDivElement>(null)
  const locationOriginRef = useRef<{ page: number; scrollTop: number } | null>(null)
  const screenshotDragStartRef = useRef<{ x: number; y: number } | null>(null)
  const screenshotPendingPointRef = useRef<ScreenshotPointer | null>(null)
  const screenshotAnimationFrameRef = useRef<number | null>(null)
  const pageSyncAnimationFrameRef = useRef<number | null>(null)
  const zoomInputAnimationFrameRef = useRef<number | null>(null)
  const zoomRestoreAnimationFrameRef = useRef<number | null>(null)
  const zoomRestoreUnlockAnimationFrameRef = useRef<number | null>(null)
  const zoomTransactionRef = useRef(0)
  const zoomValueRef = useRef(50)
  const zoomPointerIdRef = useRef<number | null>(null)
  const zoomSelectorRef = useRef<HTMLDivElement>(null)
  const zoomTriggerRef = useRef<HTMLButtonElement>(null)
  const zoomOptionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const pendingZoomRef = useRef<number | null>(null)
  const suppressPageSyncRef = useRef(false)
  const fullscreenFallbackRef = useRef(false)
  const screenshotResizeRef = useRef<{ handle: CropHandle; startX: number; startY: number; rect: CropRect } | null>(null)
  const noteRangeHandledRef = useRef(false)
  const notePointerStartRef = useRef<{ sectionTitle: string; index: number; x: number; y: number } | null>(null)

  const pageLabel = `${page}/${totalPages}`
  const filteredNotes = useMemo(() => notes.slice(), [notes])
  const detailedNote = notes.find((note) => note.id === noteDetailId)

  useEffect(() => {
    onEditingNoteChange(editingNoteId != null)
    if (editingNoteId != null) window.requestAnimationFrame(() => {
      leftContentRef.current?.scrollTo({ top: 0, behavior: 'auto' })
      noteTextareaRef.current?.focus({ preventScroll: true })
    })
  }, [editingNoteId, onEditingNoteChange])

  useEffect(() => {
    if (!searchOpen) return
    window.requestAnimationFrame(() => searchInputRef.current?.focus({ preventScroll: true }))
  }, [searchOpen])

  useEffect(() => () => {
    if (screenshotAnimationFrameRef.current != null) window.cancelAnimationFrame(screenshotAnimationFrameRef.current)
    if (pageSyncAnimationFrameRef.current != null) window.cancelAnimationFrame(pageSyncAnimationFrameRef.current)
    if (zoomInputAnimationFrameRef.current != null) window.cancelAnimationFrame(zoomInputAnimationFrameRef.current)
    if (zoomRestoreAnimationFrameRef.current != null) window.cancelAnimationFrame(zoomRestoreAnimationFrameRef.current)
    if (zoomRestoreUnlockAnimationFrameRef.current != null) window.cancelAnimationFrame(zoomRestoreUnlockAnimationFrameRef.current)
  }, [])

  useEffect(() => {
    const syncFullscreenState = () => {
      if (document.fullscreenElement === readingFrameRef.current) {
        fullscreenFallbackRef.current = false
        setMaximized(true)
      } else if (!fullscreenFallbackRef.current) {
        setMaximized(false)
      }
    }
    const closeFallbackFullscreen = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !fullscreenFallbackRef.current) return
      fullscreenFallbackRef.current = false
      setMaximized(false)
    }
    document.addEventListener('fullscreenchange', syncFullscreenState)
    document.addEventListener('keydown', closeFallbackFullscreen)
    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreenState)
      document.removeEventListener('keydown', closeFallbackFullscreen)
    }
  }, [])

  useEffect(() => {
    if (leftPanel !== 'thumbnails') return
    window.requestAnimationFrame(() => {
      thumbnailListRef.current?.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({ block: 'nearest', behavior: 'auto' })
    })
  }, [leftPanel, page])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1180px)')
    const syncLayout = () => {
      setCompactLayout(query.matches)
      if (!query.matches) setMobileInsightsOpen(false)
    }
    query.addEventListener('change', syncLayout)
    return () => query.removeEventListener('change', syncLayout)
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 900px)')
    const syncLayout = () => {
      setLeftOverlayLayout(query.matches)
      if (!query.matches) setMobileLeftOpen(false)
    }
    query.addEventListener('change', syncLayout)
    return () => query.removeEventListener('change', syncLayout)
  }, [])

  const scrollPaperToSection = (sectionTitle: string, behavior: ScrollBehavior = 'auto') => {
    const scroller = paperScrollRef.current
    const target = paperRef.current?.querySelector<HTMLElement>(`[data-section="${sectionSlug(sectionTitle)}"]`)
    if (!scroller || !target) return
    const top = scroller.scrollTop + target.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 72
    scroller.scrollTo({ top: Math.max(0, top), behavior })
  }

  const goToPage = (targetPage: number, options?: { sectionTitle?: string; scroll?: boolean }) => {
    const nextPage = Math.min(totalPages, Math.max(1, targetPage))
    setPage(nextPage)
    if (options?.scroll === false) return
    window.requestAnimationFrame(() => {
      if (options?.sectionTitle) {
        scrollPaperToSection(options.sectionTitle)
        return
      }
      const scroller = paperScrollRef.current
      if (!scroller) return
      const availableScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight)
      const pageProgress = (nextPage - 1) / (totalPages - 1)
      scroller.scrollTo({ top: availableScroll * pageProgress, behavior: 'auto' })
    })
  }

  const closeZoomMenu = (restoreFocus = false) => {
    setZoomMenuOpen(false)
    if (restoreFocus) window.requestAnimationFrame(() => zoomTriggerRef.current?.focus({ preventScroll: true }))
  }

  const openZoomMenu = () => {
    const exactIndex = zoomPresets.findIndex((preset) => preset === zoomValueRef.current)
    const nearestIndex = zoomPresets.reduce((bestIndex, preset, index) => (
      Math.abs(preset - zoomValueRef.current) < Math.abs(zoomPresets[bestIndex] - zoomValueRef.current) ? index : bestIndex
    ), 0)
    setZoomMenuActiveIndex(exactIndex >= 0 ? exactIndex : nearestIndex)
    setZoomMenuOpen(true)
  }

  const moveZoomMenuFocus = (nextIndex: number) => {
    const normalizedIndex = (nextIndex + zoomPresets.length) % zoomPresets.length
    setZoomMenuActiveIndex(normalizedIndex)
    zoomOptionRefs.current[normalizedIndex]?.focus({ preventScroll: true })
  }

  const applyZoom = (requestedZoom: number) => {
    const nextZoom = Math.min(100, Math.max(25, Math.round(requestedZoom / 5) * 5))
    closeZoomMenu()
    if (nextZoom === zoomValueRef.current) return
    const scroller = paperScrollRef.current
    const stage = paperZoomStageRef.current
    const scrollerBounds = scroller?.getBoundingClientRect()
    const stageBounds = stage?.getBoundingClientRect()
    const renderedScale = stageBounds && stageBounds.width > 0 ? stageBounds.width / 812 : zoomValueRef.current / 100
    const viewportCenterX = scrollerBounds ? scrollerBounds.left + scrollerBounds.width / 2 : 0
    const viewportCenterY = scrollerBounds ? scrollerBounds.top + scrollerBounds.height / 2 : 0
    const paperAnchorX = stageBounds ? (viewportCenterX - stageBounds.left) / renderedScale : 406
    const paperAnchorY = stageBounds ? (viewportCenterY - stageBounds.top) / renderedScale : 0
    const transaction = zoomTransactionRef.current + 1
    zoomTransactionRef.current = transaction
    suppressPageSyncRef.current = true
    zoomValueRef.current = nextZoom
    setZoom(nextZoom)
    if (zoomRestoreAnimationFrameRef.current != null) window.cancelAnimationFrame(zoomRestoreAnimationFrameRef.current)
    if (zoomRestoreUnlockAnimationFrameRef.current != null) window.cancelAnimationFrame(zoomRestoreUnlockAnimationFrameRef.current)
    zoomRestoreAnimationFrameRef.current = window.requestAnimationFrame(() => {
      zoomRestoreAnimationFrameRef.current = null
      if (transaction !== zoomTransactionRef.current) return
      const updatedScroller = paperScrollRef.current
      const updatedStageBounds = paperZoomStageRef.current?.getBoundingClientRect()
      const updatedScrollerBounds = updatedScroller?.getBoundingClientRect()
      if (updatedScroller && updatedStageBounds && updatedScrollerBounds) {
        const updatedScale = updatedStageBounds.width > 0 ? updatedStageBounds.width / 812 : nextZoom / 100
        const updatedCenterX = updatedScrollerBounds.left + updatedScrollerBounds.width / 2
        const updatedCenterY = updatedScrollerBounds.top + updatedScrollerBounds.height / 2
        const horizontalDelta = updatedStageBounds.left + paperAnchorX * updatedScale - updatedCenterX
        const verticalDelta = updatedStageBounds.top + paperAnchorY * updatedScale - updatedCenterY
        updatedScroller.scrollLeft = Math.min(
          Math.max(0, updatedScroller.scrollWidth - updatedScroller.clientWidth),
          Math.max(0, updatedScroller.scrollLeft + horizontalDelta),
        )
        updatedScroller.scrollTop = Math.min(
          Math.max(0, updatedScroller.scrollHeight - updatedScroller.clientHeight),
          Math.max(0, updatedScroller.scrollTop + verticalDelta),
        )
      }
      zoomRestoreUnlockAnimationFrameRef.current = window.requestAnimationFrame(() => {
        zoomRestoreUnlockAnimationFrameRef.current = null
        if (transaction !== zoomTransactionRef.current) return
        suppressPageSyncRef.current = false
      })
    })
  }

  const scheduleZoom = (requestedZoom: number) => {
    pendingZoomRef.current = requestedZoom
    if (zoomInputAnimationFrameRef.current != null) return
    zoomInputAnimationFrameRef.current = window.requestAnimationFrame(() => {
      zoomInputAnimationFrameRef.current = null
      if (pendingZoomRef.current != null) applyZoom(pendingZoomRef.current)
      pendingZoomRef.current = null
    })
  }

  const selectZoomPreset = (preset: number, restoreFocus = true) => {
    applyZoom(preset)
    closeZoomMenu(restoreFocus)
  }

  const handleZoomTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!zoomMenuOpen) openZoomMenu()
      window.requestAnimationFrame(() => zoomOptionRefs.current[zoomMenuActiveIndex]?.focus({ preventScroll: true }))
      return
    }
    if (event.key === 'Escape' && zoomMenuOpen) {
      event.preventDefault()
      closeZoomMenu(true)
    }
  }

  const handleZoomOptionKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveZoomMenuFocus(index + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveZoomMenuFocus(index - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      moveZoomMenuFocus(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      moveZoomMenuFocus(zoomPresets.length - 1)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectZoomPreset(zoomPresets[index])
    } else if (event.key === 'Tab') {
      setZoomMenuOpen(false)
    }
  }

  const updateZoomFromPointer = (clientX: number, target: HTMLElement) => {
    const bounds = target.getBoundingClientRect()
    if (bounds.width <= 0) return
    const visualPercent = ((clientX - bounds.left) / bounds.width) * 100
    scheduleZoom(visualPercent)
  }

  const handleZoomRangePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    closeZoomMenu()
    zoomPointerIdRef.current = event.pointerId
    event.currentTarget.setPointerCapture(event.pointerId)
    setZoomDragging(true)
    updateZoomFromPointer(event.clientX, event.currentTarget)
  }

  const handleZoomRangePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (zoomPointerIdRef.current !== event.pointerId) return
    updateZoomFromPointer(event.clientX, event.currentTarget)
  }

  const finishZoomRangePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (zoomPointerIdRef.current !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    zoomPointerIdRef.current = null
    setZoomDragging(false)
  }

  const handleZoomRangeKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const keySteps: Partial<Record<string, number>> = {
      ArrowLeft: -5,
      ArrowDown: -5,
      ArrowRight: 5,
      ArrowUp: 5,
      PageDown: -10,
      PageUp: 10,
    }
    if (event.key in keySteps) {
      event.preventDefault()
      applyZoom(zoomValueRef.current + (keySteps[event.key] ?? 0))
    } else if (event.key === 'Home') {
      event.preventDefault()
      applyZoom(25)
    } else if (event.key === 'End') {
      event.preventDefault()
      applyZoom(100)
    }
  }

  useEffect(() => {
    if (!zoomMenuOpen) return
    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (!zoomSelectorRef.current?.contains(event.target as Node)) setZoomMenuOpen(false)
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      closeZoomMenu(true)
    }
    document.addEventListener('pointerdown', handleOutsidePointerDown)
    document.addEventListener('keydown', handleEscape)
    window.requestAnimationFrame(() => zoomOptionRefs.current[zoomMenuActiveIndex]?.focus({ preventScroll: true }))
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [zoomMenuActiveIndex, zoomMenuOpen])

  const syncPageFromPaperScroll = () => {
    if (suppressPageSyncRef.current) return
    if (contextAction === 'highlight') {
      setContextAction(null)
      setColorMenuOpen(false)
    }
    if (pageSyncAnimationFrameRef.current != null) return
    pageSyncAnimationFrameRef.current = window.requestAnimationFrame(() => {
      pageSyncAnimationFrameRef.current = null
      const scroller = paperScrollRef.current
      if (!scroller) return
      const availableScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight)
      const nextPage = availableScroll === 0 ? 1 : Math.round((scroller.scrollTop / availableScroll) * (totalPages - 1)) + 1
      setPage((current) => current === nextPage ? current : nextPage)
    })
  }

  const toggleReaderFullscreen = async () => {
    const frame = readingFrameRef.current
    if (!frame) return
    if (fullscreenFallbackRef.current) {
      fullscreenFallbackRef.current = false
      setMaximized(false)
      return
    }
    if (!frame.requestFullscreen) {
      fullscreenFallbackRef.current = true
      setMaximized(true)
      return
    }
    try {
      if (document.fullscreenElement === frame) await document.exitFullscreen()
      else await frame.requestFullscreen()
    } catch {
      fullscreenFallbackRef.current = true
      setMaximized(true)
    }
  }

  const jumpToSection = (sectionTitle: string) => {
    scrollPaperToSection(sectionTitle)
  }

  const selectLeftPanel = (panel: LeftPanel) => {
    if (panel !== 'notes') setNoteEditorExpanded(false)
    if (leftOverlayLayout) {
      const willClose = panel === leftPanel && mobileLeftOpen
      setMobileLeftOpen(!willClose)
      setMobileInsightsOpen(false)
      if (willClose) setNoteEditorExpanded(false)
    }
    setLeftPanel(panel)
  }

  const locateSearchResult = (index: number, targetPage: number) => {
    const scroller = paperScrollRef.current
    const sectionTitle = aiSearchTargetSections[index]
    if (!locationOriginRef.current) {
      locationOriginRef.current = { page, scrollTop: scroller?.scrollTop ?? 0 }
    }
    setLocatedResult(index)
    goToPage(targetPage, { sectionTitle })
    onToast('已定位到原文出处')
  }

  const returnFromLocation = () => {
    const origin = locationOriginRef.current
    setLocatedResult(null)
    if (origin) {
      goToPage(origin.page, { scroll: false })
      paperScrollRef.current?.scrollTo({ top: origin.scrollTop, behavior: 'auto' })
    }
    locationOriginRef.current = null
  }

  const submitAiQuestion = () => {
    const question = aiQuestion.trim()
    if (!question) return
    setAiExchange({
      question,
      answer: '功能化碳纳米管通过表面羧基、氨基对多硫化物进行多位点化学锚定，降低穿梭迁移并改善循环稳定性；论文以原位XRD、冷冻电镜和DFT计算共同验证了这一机制。',
    })
    setAiQuestion('')
    onToast('问题已提交')
  }

  const closeSearchDrawer = () => {
    setSearchOpen(false)
    setActiveTool((current) => current === 'search' ? null : current)
    setSearchModeOpen(false)
    setTranslatedResult(null)
    returnFromLocation()
  }

  const submitSearch = () => {
    const value = searchQuery.trim()
    if (!value) return
    setSearchedQuery(value)
  }

  const resetToolSurfaces = () => {
    setContextAction(null)
    setResultCards({
      translationVisible: false,
      translationExpanded: false,
      explanationVisible: false,
      explanationExpanded: false,
    })
    setColorMenuOpen(false)
    setNoteSelection(null)
    setScreenshotDragStart(null)
    setScreenshotPointer(null)
    setCropRect(null)
    setSearchModeOpen(false)
    setTranslatedResult(null)
    setSearchOpen(false)
    screenshotDragStartRef.current = null
    screenshotPendingPointRef.current = null
    screenshotResizeRef.current = null
    noteRangeHandledRef.current = false
    notePointerStartRef.current = null
    window.getSelection()?.removeAllRanges()
    if (screenshotAnimationFrameRef.current != null) {
      window.cancelAnimationFrame(screenshotAnimationFrameRef.current)
      screenshotAnimationFrameRef.current = null
    }
    if (locatedResult != null) returnFromLocation()
  }

  const activateSearch = () => {
    if (searchOpen) {
      closeSearchDrawer()
      return
    }
    resetToolSurfaces()
    setActiveTool('search')
    setSearchOpen(true)
  }

  const activateNoteTool = () => {
    if (activeTool === 'note') {
      resetToolSurfaces()
      setActiveTool(null)
      return
    }
    resetToolSurfaces()
    setActiveTool('note')
    setLeftPanel('notes')
    if (leftOverlayLayout) {
      setMobileLeftOpen(true)
      setMobileInsightsOpen(false)
    }
  }

  const activateScreenshotTool = () => {
    if (activeTool === 'screenshot') {
      resetToolSurfaces()
      setActiveTool(null)
      return
    }
    resetToolSurfaces()
    window.getSelection()?.removeAllRanges()
    setActiveTool('screenshot')
  }

  const placeContextMenu = (bounds: DOMRect) => {
    const canvasBounds = canvasRef.current?.getBoundingClientRect()
    if (!canvasBounds) return
    const menuWidth = 156
    const menuHeight = 28
    setContextMenuPosition({
      left: Math.max(8, Math.min(canvasBounds.width - menuWidth - 8, bounds.left - canvasBounds.left)),
      top: Math.max(8, Math.min(canvasBounds.height - menuHeight - 8, bounds.top - canvasBounds.top - menuHeight - 8)),
    })
  }

  const hitPaperLine = (event: ReactMouseEvent<HTMLParagraphElement>, sectionTitle: string) => {
    if (activeTool !== 'note') return
    if (noteRangeHandledRef.current) {
      noteRangeHandledRef.current = false
      return
    }
    const browserSelection = window.getSelection()
    if (browserSelection && !browserSelection.isCollapsed && browserSelection.toString().trim()) return
    const text = event.currentTarget.textContent?.trim() ?? ''
    window.getSelection()?.removeAllRanges()
    placeContextMenu(event.currentTarget.getBoundingClientRect())
    setResultCards({
      translationVisible: false,
      translationExpanded: false,
      explanationVisible: false,
      explanationExpanded: false,
    })
    setNoteSelection({ kind: 'field', sectionTitle, text, start: 0, end: text.length })
    setContextAction('highlight')
  }

  const textIndexAtPoint = (target: HTMLParagraphElement, clientX: number, clientY: number) => {
    const documentWithCaret = document as Document & { caretRangeFromPoint?: (x: number, y: number) => Range | null }
    const caretPosition = document.caretPositionFromPoint?.(clientX, clientY)
    const caretRange = caretPosition ? null : documentWithCaret.caretRangeFromPoint?.(clientX, clientY)
    const node = caretPosition?.offsetNode ?? caretRange?.startContainer
    const offset = caretPosition?.offset ?? caretRange?.startOffset
    if (!node || offset == null || !target.contains(node)) return null
    const prefix = document.createRange()
    prefix.selectNodeContents(target)
    prefix.setEnd(node, offset)
    return prefix.toString().length
  }

  const beginPaperRange = (event: ReactMouseEvent<HTMLParagraphElement>, sectionTitle: string) => {
    noteRangeHandledRef.current = false
    notePointerStartRef.current = null
    if (activeTool !== 'note' || event.button !== 0) return
    const index = textIndexAtPoint(event.currentTarget, event.clientX, event.clientY)
    if (index == null) return
    event.preventDefault()
    window.getSelection()?.removeAllRanges()
    notePointerStartRef.current = { sectionTitle, index, x: event.clientX, y: event.clientY }
  }

  const selectPaperRange = (event: ReactMouseEvent<HTMLParagraphElement>, sectionTitle: string) => {
    if (activeTool !== 'note') return
    const pointerStart = notePointerStartRef.current
    notePointerStartRef.current = null
    if (pointerStart?.sectionTitle === sectionTitle && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) >= 4) {
      const endIndex = textIndexAtPoint(event.currentTarget, event.clientX, event.clientY)
      const fullText = event.currentTarget.textContent ?? ''
      if (endIndex != null && endIndex !== pointerStart.index) {
        const start = Math.min(pointerStart.index, endIndex)
        const end = Math.max(pointerStart.index, endIndex)
        noteRangeHandledRef.current = true
        setResultCards({
          translationVisible: false,
          translationExpanded: false,
          explanationVisible: false,
          explanationExpanded: false,
        })
        setNoteSelection({ kind: 'range', sectionTitle, text: fullText.slice(start, end), start, end })
        const bounds = event.currentTarget.getBoundingClientRect()
        placeContextMenu(new DOMRect(event.clientX, Math.min(event.clientY, bounds.bottom), 0, 0))
        setContextAction('highlight')
        return
      }
    }
    const browserSelection = window.getSelection()
    if (!browserSelection || browserSelection.isCollapsed || browserSelection.rangeCount === 0) return
    const anchorNode = browserSelection.anchorNode
    const focusNode = browserSelection.focusNode
    if (!anchorNode || !focusNode || !event.currentTarget.contains(anchorNode) || !event.currentTarget.contains(focusNode)) return
    const selectedText = browserSelection.toString()
    if (!selectedText.trim()) return
    const indexAt = (node: Node, offset: number) => {
      const prefix = document.createRange()
      prefix.selectNodeContents(event.currentTarget)
      prefix.setEnd(node, offset)
      return prefix.toString().length
    }
    const anchorIndex = indexAt(anchorNode, browserSelection.anchorOffset)
    const focusIndex = indexAt(focusNode, browserSelection.focusOffset)
    const start = Math.min(anchorIndex, focusIndex)
    const end = Math.max(anchorIndex, focusIndex)
    const bounds = browserSelection.getRangeAt(0).getBoundingClientRect()
    noteRangeHandledRef.current = true
    setResultCards({
      translationVisible: false,
      translationExpanded: false,
      explanationVisible: false,
      explanationExpanded: false,
    })
    setNoteSelection({ kind: 'range', sectionTitle, text: selectedText, start, end })
    placeContextMenu(bounds)
    setContextAction('highlight')
    window.requestAnimationFrame(() => window.getSelection()?.removeAllRanges())
  }

  const renderSelectableText = (text: string, sectionTitle: string) => {
    const selectionActive = noteSelection?.sectionTitle === sectionTitle && contextAction != null && contextAction !== 'screenshot'
    if (!selectionActive || !noteSelection) return text
    const start = Math.max(0, Math.min(text.length, noteSelection.start))
    const end = Math.max(start, Math.min(text.length, noteSelection.end))
    return <>{text.slice(0, start)}<mark className={`paper-note-selection is-${noteSelection.kind}`} style={{ '--selected-line-color': highlightColors[highlightColorIndex] } as CSSProperties}>{text.slice(start, end)}</mark>{text.slice(end)}</>
  }

  const screenshotPoint = (event: ReactPointerEvent<HTMLElement>): ScreenshotPointer => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return {
      clientX: event.clientX,
      clientY: event.clientY,
      localX: Math.max(0, Math.min(bounds.width - 148, event.clientX - bounds.left)),
      localY: Math.max(0, Math.min(bounds.height - 168, event.clientY - bounds.top)),
    }
  }

  const beginScreenshotDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (activeTool !== 'screenshot' || contextAction === 'screenshot') return
    if (event.button !== 0 || !event.isPrimary) return
    if ((event.target as Element).closest('button, input, textarea, .reading-selection-toolbar')) return
    event.preventDefault()
    window.getSelection()?.removeAllRanges()
    const point = screenshotPoint(event)
    event.currentTarget.setPointerCapture(event.pointerId)
    setScreenshotPointer(point)
    screenshotDragStartRef.current = { x: point.clientX, y: point.clientY }
    setScreenshotDragStart({ x: point.clientX, y: point.clientY })
    setCropRect({ left: point.clientX, top: point.clientY, width: 0, height: 0 })
  }

  const moveScreenshotPointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (activeTool !== 'screenshot' || contextAction === 'screenshot') return
    event.preventDefault()
    const point = screenshotPoint(event)
    screenshotPendingPointRef.current = point
    if (screenshotAnimationFrameRef.current != null) return
    screenshotAnimationFrameRef.current = window.requestAnimationFrame(() => {
      screenshotAnimationFrameRef.current = null
      const nextPoint = screenshotPendingPointRef.current
      if (!nextPoint) return
      setScreenshotPointer(nextPoint)
      const start = screenshotDragStartRef.current
      if (!start) return
      setCropRect({
        left: Math.min(start.x, nextPoint.clientX),
        top: Math.min(start.y, nextPoint.clientY),
        width: Math.abs(nextPoint.clientX - start.x),
        height: Math.abs(nextPoint.clientY - start.y),
      })
    })
  }

  const finishScreenshotDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const dragStart = screenshotDragStartRef.current
    if (activeTool !== 'screenshot' || !dragStart) return
    event.preventDefault()
    window.getSelection()?.removeAllRanges()
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (screenshotAnimationFrameRef.current != null) {
      window.cancelAnimationFrame(screenshotAnimationFrameRef.current)
      screenshotAnimationFrameRef.current = null
    }
    const point = screenshotPoint(event)
    const finalRect = {
      left: Math.min(dragStart.x, point.clientX),
      top: Math.min(dragStart.y, point.clientY),
      width: Math.abs(point.clientX - dragStart.x),
      height: Math.abs(point.clientY - dragStart.y),
    }
    screenshotDragStartRef.current = null
    screenshotPendingPointRef.current = point
    setCropRect(finalRect)
    setScreenshotDragStart(null)
    if (finalRect.width >= 12 && finalRect.height >= 12) setContextAction('screenshot')
    else setCropRect(null)
  }

  const beginCropResize = (event: ReactPointerEvent<HTMLSpanElement>, handle: CropHandle) => {
    if (!cropRect) return
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    screenshotResizeRef.current = { handle, startX: event.clientX, startY: event.clientY, rect: cropRect }
  }

  const updateCropResize = (clientX: number, clientY: number) => {
    const resize = screenshotResizeRef.current
    if (!resize) return
    const dx = clientX - resize.startX
    const dy = clientY - resize.startY
    let left = resize.rect.left
    let top = resize.rect.top
    let right = resize.rect.left + resize.rect.width
    let bottom = resize.rect.top + resize.rect.height
    if (resize.handle.includes('w')) left = Math.min(right - 12, Math.max(0, left + dx))
    if (resize.handle.includes('e')) right = Math.max(left + 12, Math.min(window.innerWidth, right + dx))
    if (resize.handle.includes('n')) top = Math.min(bottom - 12, Math.max(0, top + dy))
    if (resize.handle.includes('s')) bottom = Math.max(top + 12, Math.min(window.innerHeight, bottom + dy))
    setCropRect({ left, top, width: right - left, height: bottom - top })
  }

  const moveCropResize = (event: ReactPointerEvent<HTMLSpanElement>) => {
    event.preventDefault()
    updateCropResize(event.clientX, event.clientY)
  }

  const finishCropResize = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    screenshotResizeRef.current = null
  }

  useEffect(() => {
    if (contextAction !== 'screenshot') return
    const moveResize = (event: PointerEvent) => updateCropResize(event.clientX, event.clientY)
    const stopResize = () => { screenshotResizeRef.current = null }
    window.addEventListener('pointermove', moveResize)
    window.addEventListener('pointerup', stopResize)
    window.addEventListener('pointercancel', stopResize)
    return () => {
      window.removeEventListener('pointermove', moveResize)
      window.removeEventListener('pointerup', stopResize)
      window.removeEventListener('pointercancel', stopResize)
    }
  }, [contextAction])

  const cancelScreenshotDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (screenshotAnimationFrameRef.current != null) {
      window.cancelAnimationFrame(screenshotAnimationFrameRef.current)
      screenshotAnimationFrameRef.current = null
    }
    screenshotDragStartRef.current = null
    screenshotPendingPointRef.current = null
    setScreenshotDragStart(null)
    setScreenshotPointer(null)
    setCropRect(null)
  }

  const cancelScreenshot = () => {
    setContextAction(null)
    setActiveTool(null)
    setScreenshotDragStart(null)
    setScreenshotPointer(null)
    setCropRect(null)
    screenshotDragStartRef.current = null
    screenshotPendingPointRef.current = null
    screenshotResizeRef.current = null
    window.getSelection()?.removeAllRanges()
    if (screenshotAnimationFrameRef.current != null) {
      window.cancelAnimationFrame(screenshotAnimationFrameRef.current)
      screenshotAnimationFrameRef.current = null
    }
  }

  const completeScreenshot = async () => {
    if (!cropRect) return
    const addedToNote = editingNoteId != null
    if (addedToNote) {
      try {
        const blob = await captureViewportCrop(cropRect)
        const imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result))
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(blob)
        })
        setUploadedNoteImages((current) => [...current, imageUrl])
        setNoteEditStage((stage) => Math.max(stage, 3))
      } catch (error) {
        console.error('Screenshot generation failed', error)
        onToast('截图生成失败，请重新选择')
        return
      }
    }
    cancelScreenshot()
    onToast(addedToNote ? '截图已添加到笔记' : '截图已完成')
  }

  const downloadScreenshot = async () => {
    if (!cropRect) return
    try {
      downloadLocalBlob(await captureViewportCrop(cropRect), '科研阅读截图.png')
      onToast('截图已下载')
    } catch (error) {
      console.error('Screenshot download failed', error)
      onToast('截图下载失败')
    }
  }

  const startEditingNote = (note: ReadingNote) => {
    setEditingNoteId(note.id)
    setEditingNoteText('')
    setPendingAddedNote(note.excerpt)
    setNoteDetailId(null)
    setLeftPanel('notes')
    if (leftOverlayLayout) setMobileLeftOpen(true)
    setNoteEditStage(4)
    setUploadedNoteImages([])
    setNoteEditorExpanded(false)
  }

  const openNoteEditor = (source: 'selection' | 'translation' | 'explanation') => {
    setEditingNoteId(0)
    setEditingNoteText('')
    setPendingAddedNote(source === 'translation' ? translatedExcerpt : source === 'explanation' ? explainedExcerpt : noteSelection?.text ?? '')
    setNoteEditStage(source === 'translation' ? 1 : source === 'explanation' ? 2 : 0)
    setUploadedNoteImages([])
    setNoteEditorExpanded(false)
    setLeftPanel('notes')
    if (leftOverlayLayout) setMobileLeftOpen(true)
    setContextAction(null)
    setResultCards({
      translationVisible: false,
      translationExpanded: false,
      explanationVisible: false,
      explanationExpanded: false,
    })
    setActiveTool(null)
    setNoteSelection(null)
    window.getSelection()?.removeAllRanges()
    setColorMenuOpen(false)
  }

  const startAddingNote = () => openNoteEditor('selection')

  const commitEditedNote = () => {
    if (editingNoteId == null) return
    const value = editingNoteText.trim() || pendingAddedNote.trim()
    if (!value) return
    if (editingNoteId === 0) {
      onNotesChange([...notes, { id: Math.max(0, ...notes.map((note) => note.id)) + 1, title: value.slice(0, 18), excerpt: value, createdAt: '', color: highlightColors[highlightColorIndex] }])
    } else {
      onNotesChange(notes.map((note) => note.id === editingNoteId ? { ...note, title: value.slice(0, 18), excerpt: value, createdAt: '' } : note))
    }
    setEditingNoteId(null)
    setContextAction(null)
    setResultCards({
      translationVisible: false,
      translationExpanded: false,
      explanationVisible: false,
      explanationExpanded: false,
    })
    setActiveTool(null)
    setNoteSelection(null)
    setNoteEditStage(0)
    setNoteEditorExpanded(false)
    setPendingAddedNote('')
    onToast('笔记已更新')
  }

  const addNoteDraft = () => {
    const value = editingNoteText.trim()
    if (!value) return
    setPendingAddedNote(value)
    setEditingNoteText('')
    setNoteEditStage(4)
  }

  const uploadNoteImages = (files: FileList | null) => {
    if (!files?.length) return
    setUploadedNoteImages(Array.from(files).slice(0, 3).map((file) => URL.createObjectURL(file)))
    setNoteEditStage((stage) => Math.max(stage, 3))
  }

  const copyText = async (text: string, successMessage: string) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable')
      await navigator.clipboard.writeText(text)
      onToast(successMessage)
    } catch {
      onToast('复制失败，请手动复制')
    }
  }

  const showTranslation = () => {
    setColorMenuOpen(false)
    setContextAction('translate')
    setResultCards({
      translationVisible: true,
      translationExpanded: true,
      explanationVisible: false,
      explanationExpanded: false,
    })
  }

  const showExplanation = () => {
    setColorMenuOpen(false)
    setContextAction('explain')
    setResultCards({
      translationVisible: true,
      translationExpanded: false,
      explanationVisible: true,
      explanationExpanded: true,
    })
  }

  const closeResultCard = (card: 'translation' | 'explanation') => {
    setResultCards((current) => {
      const next = card === 'translation'
        ? { ...current, translationVisible: false, translationExpanded: false, explanationExpanded: current.explanationVisible }
        : { ...current, explanationVisible: false, explanationExpanded: false, translationExpanded: current.translationVisible }
      if (!next.translationVisible && !next.explanationVisible) {
        setContextAction(null)
        setNoteSelection(null)
      } else {
        setContextAction(next.explanationVisible ? 'explain' : 'translate')
      }
      return next
    })
  }

  const toggleResultCard = (card: 'translation' | 'explanation') => {
    setResultCards((current) => {
      if (card === 'translation') {
        const expanding = !current.translationExpanded
        return {
          ...current,
          translationExpanded: expanding,
          explanationExpanded: current.explanationVisible ? !expanding : false,
        }
      }
      const expanding = !current.explanationExpanded
      return {
        ...current,
        explanationExpanded: expanding,
        translationExpanded: current.translationVisible ? !expanding : false,
      }
    })
  }

  const downloadDocument = () => {
    const documentText = [
      documentTitle,
      '',
      '摘要',
      '本研究系统性探究了功能化碳纳米管界面对锂硫电池中多硫化物穿梭效应的抑制机理。',
      '',
      ...articleSections.flatMap((section) => [
        section.title,
        ...section.parts.flatMap((part) => [part.title, part.body].filter(Boolean)),
        '',
      ]),
    ].join('\n')
    downloadLocalBlob(new Blob([documentText], { type: 'text/plain;charset=utf-8' }), `${safeFileName(documentTitle)}.txt`)
    onToast('文档已下载')
  }

  const exportChart = (title: string, index: number) => {
    const escapedTitle = title
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
    const bars = [108, 176, 132, 224, 188].map((height, barIndex) => (
      `<rect x="${74 + barIndex * 82}" y="${310 - height}" width="48" height="${height}" rx="8" fill="${barIndex === index % 5 ? '#4f67ff' : '#9da9ff'}"/>`
    )).join('')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="360" viewBox="0 0 560 360"><rect width="560" height="360" fill="#fff"/><text x="32" y="46" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#1f2430">${escapedTitle}</text><line x1="54" y1="310" x2="520" y2="310" stroke="#dfe3ec" stroke-width="2"/>${bars}<text x="32" y="340" font-family="Arial, sans-serif" font-size="13" fill="#747b8c">智能阅读 · 图表提取</text></svg>`
    downloadLocalBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), `${safeFileName(title)}.svg`)
    onToast('图表已导出')
  }

  const saveReadingProgress = () => {
    try {
      window.localStorage.setItem(`reading-progress:${activeDocumentId}`, JSON.stringify({
        documentId: activeDocumentId,
        page,
        zoom,
        scrollTop: paperScrollRef.current?.scrollTop ?? 0,
        savedAt: new Date().toISOString(),
      }))
      onToast('阅读进度已保存')
    } catch {
      onToast('阅读进度保存失败')
    }
  }

  const selectInsightPanel = (panel: InsightPanel) => {
    setRightPanel(panel)
    if (panel === 'charts') goToPage(3, { sectionTitle: '2.2.表征手段' })
  }

  useEffect(() => {
    const closeTemporaryUi = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      const hasTemporaryUi = Boolean(
        contextAction
        || colorMenuOpen
        || activeTool
        || documentMenuOpen
        || noteDetailId != null
        || searchOpen
        || searchModeOpen
        || translatedResult != null
        || locatedResult != null
        || mobileInsightsOpen
        || mobileLeftOpen
        || noteEditorExpanded,
      )
      if (!hasTemporaryUi) return
      event.preventDefault()
      setContextAction(null)
      setResultCards({
        translationVisible: false,
        translationExpanded: false,
        explanationVisible: false,
        explanationExpanded: false,
      })
      setColorMenuOpen(false)
      setActiveTool(null)
      setNoteSelection(null)
      window.getSelection()?.removeAllRanges()
      setScreenshotDragStart(null)
      setScreenshotPointer(null)
      setCropRect(null)
      setDocumentMenuOpen(false)
      setNoteDetailId(null)
      setSearchModeOpen(false)
      setTranslatedResult(null)
      setMobileInsightsOpen(false)
      setMobileLeftOpen(false)
      setNoteEditorExpanded(false)
      if (searchOpen || locatedResult != null) closeSearchDrawer()
    }
    document.addEventListener('keydown', closeTemporaryUi)
    return () => document.removeEventListener('keydown', closeTemporaryUi)
  }, [activeTool, colorMenuOpen, contextAction, documentMenuOpen, locatedResult, mobileInsightsOpen, mobileLeftOpen, noteDetailId, noteEditorExpanded, searchModeOpen, searchOpen, translatedResult])

  return (
    <section ref={readingFrameRef} className={`reading-frame${maximized ? ' reading-frame--maximized' : ''}${editingNoteId != null && leftPanel === 'notes' && noteEditorExpanded ? ' reading-frame--notes-expanded' : ''}${activeTool === 'screenshot' ? ' reading-frame--screenshot-armed' : ''}`} aria-label="智能阅读器">
      <header className="reading-document-header">
        <div className="reading-document-picker">
          <button
            type="button"
            className="reading-document-title"
            aria-expanded={documentMenuOpen}
            aria-controls="reading-document-menu"
            onClick={() => setDocumentMenuOpen((open) => !open)}
          >
            <span>{documentTitle}</span><span className={`reading-chevron${documentMenuOpen ? ' is-open' : ''}`} aria-hidden="true" />
          </button>
          {documentMenuOpen && (
            <div className="reading-document-menu" id="reading-document-menu" role="menu">
              {documents.map((readingDocument) => (
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={readingDocument.id === activeDocumentId}
                  onClick={() => {
                    onSelectDocument(readingDocument.id)
                    setDocumentMenuOpen(false)
                  }}
                  key={readingDocument.id}
                >
                  {readingDocument.title}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="reading-document-actions">
          <button type="button" className={favorite ? 'is-active' : ''} onClick={onFavorite}>
            <img src="/assets/reading/favorite.svg" alt="" />{favorite ? '已收藏' : '收藏'}
          </button>
          <button type="button" onClick={() => void copyText(window.location.href, '分享链接已复制')}><img src="/assets/reading/share.svg" alt="" />分享</button>
          <button type="button" onClick={downloadDocument}><img src="/assets/reading/download.svg" alt="" />下载</button>
          <button type="button" className="reading-primary-button" onClick={saveReadingProgress}>保存</button>
        </div>
        <button type="button" className="reading-mobile-insight-button" onClick={() => setMobileInsightsOpen(true)}>AI解读</button>
      </header>

      <aside className={`reading-left-panel${mobileLeftOpen ? ' is-mobile-open' : ''}`}>
        <div className="reading-left-rail" role="tablist" aria-label="阅读辅助栏">
          <button type="button" id="reading-left-tab-outline" role="tab" aria-controls="reading-left-panel-outline" aria-selected={leftPanel === 'outline'} aria-expanded={leftOverlayLayout ? mobileLeftOpen && leftPanel === 'outline' : undefined} tabIndex={leftPanel === 'outline' ? 0 : -1} className={leftPanel === 'outline' ? 'is-active' : ''} onClick={() => selectLeftPanel('outline')} aria-label="目录">
            <img src={leftPanel === 'outline' ? '/assets/reading/outline.svg' : '/assets/reading/outline-inactive.svg'} alt="" />
          </button>
          <button type="button" id="reading-left-tab-thumbnails" role="tab" aria-controls="reading-left-panel-thumbnails" aria-selected={leftPanel === 'thumbnails'} aria-expanded={leftOverlayLayout ? mobileLeftOpen && leftPanel === 'thumbnails' : undefined} tabIndex={leftPanel === 'thumbnails' ? 0 : -1} className={leftPanel === 'thumbnails' ? 'is-active' : ''} onClick={() => selectLeftPanel('thumbnails')} aria-label="缩略图">
            <img src={leftPanel === 'thumbnails' ? '/assets/reading/thumbnails-active.svg' : '/assets/reading/thumbnails.svg'} alt="" />
          </button>
          <button type="button" id="reading-left-tab-notes" role="tab" aria-controls="reading-left-panel-notes" aria-selected={leftPanel === 'notes'} aria-expanded={leftOverlayLayout ? mobileLeftOpen && leftPanel === 'notes' : undefined} tabIndex={leftPanel === 'notes' ? 0 : -1} className={leftPanel === 'notes' ? 'is-active' : ''} onClick={() => selectLeftPanel('notes')} aria-label="笔记">
            <img src={leftPanel === 'notes' ? '/assets/reading/notes-active.svg' : '/assets/reading/notes.svg'} alt="" />
          </button>
        </div>
        <div className={`reading-left-content${leftPanel === 'thumbnails' ? ' is-thumbnails' : ''}`} ref={leftContentRef}>
          {leftPanel === 'outline' && (
            <div className="reading-outline" id="reading-left-panel-outline" role="tabpanel" aria-labelledby="reading-left-tab-outline">
              <h2>目录</h2>
              <div className="reading-outline-list">
                <div className="reading-outline-disclosure">
                  <button
                    type="button"
                    className="is-emphasis"
                    aria-expanded={outlineMainExpanded}
                    aria-controls="reading-outline-main-sections"
                    onClick={() => setOutlineMainExpanded((expanded) => !expanded)}
                  >
                    摘要<span className={`reading-inline-chevron${outlineMainExpanded ? '' : ' is-right'}`} aria-hidden="true" />
                  </button>
                  <div className={`reading-outline-collapse${outlineMainExpanded ? ' is-expanded' : ''}`} id="reading-outline-main-sections" aria-hidden={!outlineMainExpanded} inert={outlineMainExpanded ? undefined : true}>
                    <div>
                      {outlineGroups.slice(1, -1).map((group) => (
                        <div className="reading-outline-group" key={group.title}>
                          <button type="button" onClick={() => jumpToSection(group.title)}>{group.title}</button>
                          {group.children.map((child) => <button type="button" className="is-child" key={child} onClick={() => jumpToSection(child)}>{child}</button>)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="reading-outline-disclosure">
                  <div className="reading-outline-static is-emphasis">
                    参考文献<span className="reading-inline-chevron is-right" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          )}
          {leftPanel === 'thumbnails' && (
            <div className="reading-thumbnails" id="reading-left-panel-thumbnails" role="tabpanel" aria-labelledby="reading-left-tab-thumbnails">
              <div className="reading-thumbnail-tools" aria-label="缩略图大小">
                <button type="button" aria-label="缩小缩略图" disabled={thumbnailZoom === 25} onClick={() => setThumbnailZoom((current) => Math.max(25, current - 25))}><img src="/assets/reading/thumbnail-zoom-out.svg" alt="" /></button>
                <input type="range" min="25" max="100" step="25" value={thumbnailZoom} aria-label="缩略图大小" onChange={(event) => setThumbnailZoom(Number(event.target.value))} style={{ '--thumbnail-progress': `${(thumbnailZoom - 25) / 75 * 100}%` } as CSSProperties} />
                <button type="button" aria-label="放大缩略图" disabled={thumbnailZoom === 100} onClick={() => setThumbnailZoom((current) => Math.min(100, current + 25))}><img src="/assets/reading/thumbnail-zoom-in.svg" alt="" /></button>
              </div>
              <div
                className="reading-thumbnail-list"
                ref={thumbnailListRef}
                style={{
                  '--thumbnail-preview-width': `${thumbnailZoom * 1.28}px`,
                  '--thumbnail-card-width': `${48 + thumbnailZoom * 1.28}px`,
                  '--thumbnail-card-height': `${44 + thumbnailZoom * 1.28 * 2246 / 812}px`,
                } as CSSProperties}
              >
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
                  <button type="button" aria-current={page === item ? 'page' : undefined} key={item} onClick={() => goToPage(item)}>
                    <span className="thumbnail-paper"><img src="/assets/reading/paper-thumbnail.png" alt="" /></span><span>第{item}页</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {leftPanel === 'notes' && (
            <div className="reading-notes" id="reading-left-panel-notes" role="tabpanel" aria-labelledby="reading-left-tab-notes">
              <div className="reading-panel-heading"><h2>笔记</h2><button type="button" aria-label="添加笔记" onClick={startAddingNote}><span className="icon-plus" aria-hidden="true" /></button></div>
              {editingNoteId == null ? (filteredNotes.length > 0 ? filteredNotes.map((note) => (
                <article className={`reading-note-card${noteDetailId === note.id ? ' is-active' : ''}`} key={note.id}>
                  <span className="reading-note-color" style={{ background: note.color }} />
                  <div className="reading-note-card-content">
                    <strong><i />{note.title}</strong>
                    <div className="reading-note-label"><b>笔记：</b><button type="button" aria-label="复制笔记" onClick={() => void copyText(note.excerpt, '笔记已复制')}><img src="/assets/reading/copy.svg" alt="" /></button></div>
                    <div className="reading-note-excerpt">{note.excerpt}</div>
                    <footer><button type="button" onClick={() => setNoteDetailId(note.id)}>详情</button><span /> <button type="button" onClick={() => startEditingNote(note)}>编辑</button></footer>
                  </div>
                </article>
              )) : <div className="reading-notes-empty"><div><img src="/assets/reading/notes-empty.svg" alt="" /><span>暂无笔记</span></div><p>请 <button type="button" onClick={activateNoteTool}>唤醒笔记</button> 进行添加</p></div>) : (
                <article className={`reading-note-edit-card${noteEditorExpanded ? ' is-expanded' : ''}`}>
                  <span className="reading-note-color" style={{ background: notes.find((note) => note.id === editingNoteId)?.color ?? '#FFE4BA' }} />
                  <header><strong>{notes.find((note) => note.id === editingNoteId)?.title ?? '多硫化物穿梭效应'}</strong></header>
                  {noteEditStage >= 1 && <div className="reading-note-source">
                    <section><b>英译：</b><p>Thiosulfate shuttle effect</p></section>
                    {noteEditStage >= 2 && <section><b>解释：</b><p>{explainedExcerpt}</p></section>}
                    {noteEditStage >= 3 && <section><b>图片：</b><div className="reading-note-images">{(uploadedNoteImages.length ? uploadedNoteImages : ['/assets/reading/note-image-1.png', '/assets/reading/note-image-2.png', '/assets/reading/note-image-3.png']).map((src, index) => <span className={`reading-note-image-tile reading-note-image-tile--${index + 1}`} key={src}><img src={src} alt={`笔记图片 ${index + 1}`} /></span>)}</div></section>}
                    {noteEditStage >= 4 && <section><b>笔记：</b><p className="reading-note-existing">{pendingAddedNote || expandedNoteExcerpt}</p></section>}
                  </div>}
                  <div className="reading-note-compose">
                    <textarea ref={noteTextareaRef} value={editingNoteText} onChange={(event) => setEditingNoteText(event.target.value)} placeholder="输入笔记内容" aria-label="编辑笔记内容" />
                    <input ref={noteImageInputRef} className="reading-note-image-input" type="file" accept="image/*" multiple onChange={(event) => { uploadNoteImages(event.target.files); event.target.value = '' }} />
                    <div className="reading-note-editor-tools"><span><button type="button" aria-label="翻译笔记" onClick={() => setNoteEditStage((stage) => Math.max(stage, 1))}><img src="/assets/reading/editor-translate.svg" alt="" /></button><button type="button" aria-label="AI 解释笔记" onClick={() => setNoteEditStage((stage) => Math.max(stage, 2))}><img src="/assets/reading/editor-ai.svg" alt="" /></button><button type="button" aria-label="插入笔记图片" onClick={() => noteImageInputRef.current?.click()}><img src="/assets/reading/editor-image.svg" alt="" /></button></span><button type="button" onClick={addNoteDraft}>添加</button></div>
                  </div>
                  <footer><button type="button" onClick={() => { setEditingNoteId(null); setNoteEditorExpanded(false); setContextAction(null); setActiveTool(null); setNoteSelection(null); setNoteEditStage(0); setPendingAddedNote('') }}>取消</button><button type="button" onClick={commitEditedNote}>保存</button></footer>
                </article>
              )}
            </div>
          )}
        </div>
      </aside>

      {editingNoteId != null && leftPanel === 'notes' && (
        <button type="button" className={`reading-note-panel-handle${noteEditorExpanded ? ' is-expanded' : ''}`} aria-label={noteEditorExpanded ? '收起笔记区域' : '拓展笔记区域'} aria-expanded={noteEditorExpanded} onClick={() => { setMobileInsightsOpen(false); if (leftOverlayLayout) setMobileLeftOpen(true); setNoteEditorExpanded((expanded) => !expanded) }}><img src="/assets/reading/note-expand.svg" alt="" /></button>
      )}

      <main className={`reading-canvas${activeTool === 'note' ? ' is-note-tool-active' : ''}${activeTool === 'screenshot' ? ' is-screenshot-tool-active' : ''}`} ref={canvasRef} onPointerDown={beginScreenshotDrag} onPointerMove={moveScreenshotPointer} onPointerUp={finishScreenshotDrag} onPointerCancel={cancelScreenshotDrag}>
        <div className="reading-paper-scroll" ref={paperScrollRef} onScroll={syncPageFromPaperScroll}>
          <div ref={paperZoomStageRef} className="reading-paper-zoom-stage" style={{ '--paper-scale': zoom / 100, width: 812 * zoom / 100, minHeight: 2246 * zoom / 100 } as CSSProperties}>
          <article
            className="reading-paper"
            ref={paperRef}
          >
            <img className="reading-paper-figma-top" src="/assets/reading/paper-top.png" alt="" />
            <div className="reading-paper-page-number">第 {Math.min(page, 18)} 页 / 18</div>
            <div className="paper-masthead"><span>Advanced Energy Materials</span><span>DOI: 10.1002/aenm.202301847</span></div>
            <header className="paper-title-block">
              <h1>锂硫电池中多硫化物穿梭效应的抑制机制研究：<br />基于功能化碳纳米管界面的储能材料</h1>
              <p>刘建国｜陈思远｜王磊</p>
              <small>南方科技大学材料科学与工程系｜中科院深圳先进院</small>
            </header>
            <section className="paper-abstract" data-section="摘要">
              <h2>摘要</h2>
              <p
                data-note-selectable="true"
                onMouseDown={(event) => beginPaperRange(event, '摘要')}
                onMouseUp={(event) => selectPaperRange(event, '摘要')}
                onClick={(event) => hitPaperLine(event, '摘要')}
              >{renderSelectableText(articleAbstract, '摘要')}</p>
            </section>
            <div className="paper-body">
              {articleSections.map((section) => (
                <section data-section={section.title.replace(/[^\d\u4e00-\u9fa5]/g, '')} key={section.title}>
                  <h2>{section.title}</h2>
                  {section.parts.map((part) => (
                    <div data-section={part.title.replace(/[^\d\u4e00-\u9fa5]/g, '')} key={part.title || section.title}>
                      {part.title && <h3>{part.title}</h3>}
                      <p data-note-selectable="true" onMouseDown={(event) => beginPaperRange(event, part.title)} onMouseUp={(event) => selectPaperRange(event, part.title)} onClick={(event) => hitPaperLine(event, part.title)} className={[
                        locatedResult != null && part.title === aiSearchTargetSections[locatedResult] ? 'paper-selected-line is-located' : '',
                      ].filter(Boolean).join(' ')}>{renderSelectableText(part.body, part.title)}</p>
                      {part.title === '2.2.表征手段' && <div className="reading-paper-chart" aria-label="不同循环次数下的比容量对比图">{[42, 64, 78, 61, 72, 88, 66].map((height, index) => <i style={{ height }} className={index === 5 ? 'is-dark' : ''} key={index} />)}<small>图3. 不同循环次数下的比容量对比（mAh g⁻¹）</small></div>}
                    </div>
                  ))}
                </section>
              ))}
            </div>
            <footer className="paper-keywords">关键词：储能材料 · 锂硫电池 · 碳纳米管 · 多硫化物 · 穿梭效应</footer>
          </article>
          </div>
        </div>

        <div className="reading-selection-toolbar" role="toolbar" aria-label="划词工具">
          <button type="button" aria-label="AI检索" aria-pressed={activeTool === 'search'} className={activeTool === 'search' ? 'is-active' : ''} onClick={activateSearch}><span className="reading-search-tool-glyph" aria-hidden="true" /></button>
          <span />
          <button type="button" aria-label="标注与添加笔记" aria-pressed={activeTool === 'note'} className={activeTool === 'note' ? 'is-active' : ''} onClick={activateNoteTool}><span className="reading-note-tool-glyph" aria-hidden="true" /></button>
          <span />
          <button type="button" aria-label="截图" aria-pressed={activeTool === 'screenshot'} className={activeTool === 'screenshot' ? 'is-active' : ''} onClick={activateScreenshotTool}><span className="reading-camera-tool-glyph" aria-hidden="true" /></button>
        </div>

        {activeTool === 'screenshot' && contextAction !== 'screenshot' && screenshotPointer && !screenshotDragStart && (
          <div className="reading-screenshot-crosshair" style={{ left: screenshotPointer.localX, top: screenshotPointer.localY }} aria-hidden="true"><i /><i /><small>坐标　{Math.round(screenshotPointer.clientX)}, {Math.round(screenshotPointer.clientY)}<br />色值　#E5E6EB</small></div>
        )}
        {activeTool === 'screenshot' && screenshotDragStart && cropRect && (
          createPortal(<div className="reading-screenshot-drag-rect" style={{ left: cropRect.left, top: cropRect.top, width: cropRect.width, height: cropRect.height }} aria-hidden="true" />, document.body)
        )}

        {contextAction === 'highlight' && (
          <div className="reading-context-menu" style={{ left: contextMenuPosition.left, top: contextMenuPosition.top, right: 'auto' }} onMouseDown={(event) => event.preventDefault()}>
            <button type="button" onClick={showTranslation}>翻译</button>
            <button type="button" onClick={showExplanation}>解释</button>
            <button type="button" className="reading-context-color" aria-label="选择背景颜色" onClick={() => setColorMenuOpen((open) => !open)}><i style={{ background: highlightColors[highlightColorIndex] }} /><span className={`reading-inline-chevron${colorMenuOpen ? ' is-up' : ''}`} aria-hidden="true" /></button>
            <span />
            <button type="button" className="reading-context-note" aria-label="添加笔记" onClick={startAddingNote}><img src="/assets/reading/note-tool.svg" alt="" /></button>
          </div>
        )}
        {contextAction === 'highlight' && colorMenuOpen && <div className="reading-color-palette" style={{ left: Math.max(8, contextMenuPosition.left - 54), top: contextMenuPosition.top + 32, right: 'auto' }}><strong>背景颜色</strong><div>{highlightColors.map((color, index) => <button type="button" className={highlightColorIndex === index ? 'is-active' : ''} style={{ background: color === 'transparent' ? '#fff' : color }} aria-label={`背景色 ${index + 1}`} onClick={() => { setHighlightColorIndex(index); setColorMenuOpen(false) }} key={`${color}-${index}`} />)}</div></div>}
        {(resultCards.translationVisible || resultCards.explanationVisible) && contextAction !== 'highlight' && contextAction !== 'screenshot' && (
          <div className="reading-result-stack">
            {resultCards.translationVisible && (
              <div className={`reading-float-card reading-float-card--translate${resultCards.translationExpanded ? '' : ' reading-float-card--collapsed'}`}>
                <header><strong><span className="reading-result-title-icon" aria-hidden="true" />实时翻译</strong><button type="button" className="reading-icon-close" aria-label="关闭实时翻译" onClick={() => closeResultCard('translation')} /></header>
                {resultCards.translationExpanded && <><p><b>原文：</b>锂硫电池因具有较高的理论比容量和能量密度，被认为是具有应用前景的新一代储能体系。然而，在实际充放电过程</p><div className="reading-translation"><b>译文：</b>{translatedExcerpt}</div></>}
                <footer><button type="button" onClick={() => void copyText(translatedExcerpt, '译文已复制')}>复制译文</button><button type="button" onClick={() => openNoteEditor('translation')}>添加笔记</button><span /><button type="button" className="reading-result-toggle" aria-label={resultCards.translationExpanded ? '收起实时翻译' : '展开实时翻译'} onClick={() => toggleResultCard('translation')}><img className={resultCards.translationExpanded ? '' : 'is-collapsed'} src="/assets/reading/result-toggle.svg" alt="" /></button></footer>
              </div>
            )}
            {resultCards.explanationVisible && (
              <div className={`reading-float-card reading-float-card--explain${resultCards.explanationExpanded ? '' : ' reading-float-card--collapsed'}`}>
                <header><strong><span className="reading-result-title-icon" aria-hidden="true" />AI解释</strong><button type="button" className="reading-icon-close" aria-label="关闭 AI 解释" onClick={() => closeResultCard('explanation')} /></header>
                {resultCards.explanationExpanded && <><p><b>原文：</b>锂硫电池因具有较高的理论比容量和能量密度，被认为是具有应用前景的新一代储能体系。</p><div className="reading-ai-explain"><b>解释：</b>{explainedExcerpt}</div></>}
                <footer><button type="button" onClick={() => void copyText(explainedExcerpt, '解释已复制')}>复制解释</button><button type="button" onClick={() => openNoteEditor('explanation')}>添加笔记</button><span /><button type="button" className="reading-result-toggle" aria-label={resultCards.explanationExpanded ? '收起 AI 解释' : '展开 AI 解释'} onClick={() => toggleResultCard('explanation')}><img className={resultCards.explanationExpanded ? '' : 'is-collapsed'} src="/assets/reading/result-toggle.svg" alt="" /></button></footer>
              </div>
            )}
          </div>
        )}
        {contextAction === 'screenshot' && cropRect && (
          createPortal(<div className="reading-screenshot-layer"><div className="reading-crop-area" style={{ left: cropRect.left, top: cropRect.top, width: cropRect.width, height: cropRect.height }}>{(['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as CropHandle[]).map((handle) => <span className={`reading-crop-handle is-${handle}`} aria-hidden="true" onPointerDown={(event) => beginCropResize(event, handle)} onPointerMove={moveCropResize} onPointerUp={finishCropResize} onPointerCancel={finishCropResize} key={handle} />)}<div className={`reading-crop-actions${cropRect.top + cropRect.height + 36 > window.innerHeight ? ' is-above' : ''}`}><button type="button" aria-label="下载截图" onClick={() => void downloadScreenshot()}><img src="/assets/reading/download.svg" alt="" /></button><span /><button type="button" aria-label="取消截图" onClick={cancelScreenshot}><span className="reading-icon-close" /></button><button type="button" aria-label="完成截图" onClick={() => void completeScreenshot()}><img src="/assets/selected-check.svg" alt="" /></button></div></div></div>, document.body)
        )}
      </main>

      {searchOpen && (
        <aside className="reading-search-drawer" aria-label="AI检索">
          <header><span>AI检索</span><button type="button" className="reading-icon-close" aria-label="关闭 AI 检索抽屉" onClick={closeSearchDrawer} /></header>
          <div className="reading-search-controls">
            <div className="reading-search-mode">
              <button type="button" className={searchModeOpen ? 'is-open' : ''} onClick={() => setSearchModeOpen((open) => !open)}>{searchMode}<span className={`reading-inline-chevron${searchModeOpen ? ' is-up' : ''}`} aria-hidden="true" /></button>
              {searchModeOpen && <div className="reading-search-mode-menu">{(['全文搜索', '智能关联', 'AI语义', '关键词'] as const).map((mode) => <button type="button" className={searchMode === mode ? 'is-active' : ''} onClick={() => { setSearchMode(mode); setSearchModeOpen(false) }} key={mode}>{mode}</button>)}</div>}
            </div>
            <div className="reading-search-input"><input ref={searchInputRef} value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') submitSearch() }} placeholder="请输入" /><button type="button" aria-label="提交检索" disabled={!searchQuery.trim()} onClick={submitSearch}><img src="/assets/reading/search-submit.svg" alt="" /></button></div>
          </div>
          <p className="reading-search-help"><span>i</span><b>{searchMode}：</b>{searchMode === '全文搜索' ? '在整个文档中搜索匹配的关键词，显示所有包含该词的段落' : '根据当前语义在论文中发现相关内容与概念'}</p>
          {!searchedQuery ? <div className="reading-search-empty"><img src="/assets/reading/ai-empty.png" alt="" /><p>支持全文搜索、智能关联、AI语义、关键词四种模式</p></div> : (
            <div className="reading-search-results"><h3>检索 <b>4</b> 个结果</h3>{aiSearchResults.map((result, index) => <article className={translatedResult === index ? 'is-translated' : ''} key={result.page}><header><span /><strong>结果 {index + 1}/4</strong><small>第{result.page}页</small></header><p>{result.text.split('注意力').map((part, partIndex, parts) => <span key={`${part}-${partIndex}`}>{part}{partIndex < parts.length - 1 && <mark>注意力</mark>}</span>)}</p>{translatedResult === index && <div className="reading-search-translation"><header><b>英译：</b><span><button type="button" onClick={() => void copyText(searchTranslation, '英译已复制')}>复制</button><button type="button" className="reading-icon-close" aria-label="关闭英译" onClick={() => setTranslatedResult(null)} /></span></header><p>{searchTranslation}</p></div>}<footer><button type="button" onClick={() => setTranslatedResult((current) => current === index ? null : index)}>翻译</button><span /> <button type="button" onClick={() => locateSearchResult(index, result.page)}>定位</button></footer></article>)}</div>
          )}
          {locatedResult != null && <button type="button" className="reading-location-tip" onClick={returnFromLocation}>取消定位，返回原处</button>}
        </aside>
      )}

      {detailedNote && (
        <section className="reading-note-detail" role="dialog" aria-modal="false" aria-labelledby="reading-note-detail-title">
          <header><h2 id="reading-note-detail-title">笔记详情</h2><button type="button" className="reading-icon-close" aria-label="关闭笔记详情" onClick={() => setNoteDetailId(null)} /></header>
          <div className="reading-note-detail-title"><i />{detailedNote.title}</div>
          <dl>
            <div><dt>英译</dt><dd>Thiosulfate shuttle effect</dd><button type="button" onClick={() => void copyText('Thiosulfate shuttle effect', '英译已复制')}>复制</button></div>
            <div><dt>解释</dt><dd>{explainedExcerpt}</dd><button type="button" onClick={() => void copyText(explainedExcerpt, '解释已复制')}>复制</button></div>
            <div><dt>图片</dt><dd className="reading-note-detail-images"><img src="/assets/reading/note-image-1.png" alt="实验表征图" /><img src="/assets/reading/note-image-2.png" alt="材料形貌图" /><img src="/assets/reading/note-image-3.png" alt="论文示意图" /></dd></div>
            <div><dt>笔记</dt><dd className="reading-note-detail-copy">{detailedNote.excerpt} 多硫化物穿梭效应通常出现在锂硫电池中，功能化界面能够通过多位点锚定提升稳定性。<button type="button" onClick={() => onToast('已展开完整笔记')}>全部</button></dd></div>
          </dl>
          <footer><button type="button" onClick={() => { setNoteDetailId(null); startEditingNote(detailedNote) }}>编辑</button><button type="button" className="is-danger" onClick={() => { onNotesChange(notes.filter((note) => note.id !== detailedNote.id)); setNoteDetailId(null); onToast('笔记已删除') }}>删除</button></footer>
        </section>
      )}

      <aside className={`reading-right-panel${mobileInsightsOpen ? ' is-mobile-open' : ''}`} aria-hidden={compactLayout && !mobileInsightsOpen} inert={compactLayout && !mobileInsightsOpen ? true : undefined}>
        <button type="button" className="reading-mobile-insight-close reading-icon-close" aria-label="关闭智能解读面板" onClick={() => setMobileInsightsOpen(false)} />
        <div className="reading-insight-tabs" role="tablist" aria-label="智能阅读分析">
          {insightTabs.map((tab) => <button type="button" id={`reading-insight-tab-${tab.id}`} role="tab" aria-controls={`reading-insight-panel-${tab.id}`} aria-selected={rightPanel === tab.id} tabIndex={rightPanel === tab.id ? 0 : -1} className={rightPanel === tab.id ? 'is-active' : ''} onClick={() => selectInsightPanel(tab.id)} key={tab.id}>{tab.label}</button>)}
        </div>
        <div className="reading-insight-content" id={`reading-insight-panel-${rightPanel}`} role="tabpanel" aria-labelledby={`reading-insight-tab-${rightPanel}`}>
          {rightPanel === 'ai' && (
            <div className="reading-ai-panel">
              <article className="reading-insight-card reading-insight-card--summary"><h3>AI总结</h3><p>功能化碳纳米管通过表面羧基、氨基对多硫化物的化学吸附，有效抑制锂硫电池穿梭效应，从而显著提升电池容量和长循环稳定性</p></article>
              <article className="reading-insight-card reading-insight-card--contribution"><h3>核心贡献</h3><p>本文首次系统揭示了功能化CNT表面官能团与多硫化物的化学吸附机理，提出了基于多位点锚定的穿梭抑制策略，实现了186%的比容量提升</p></article>
              <article className="reading-insight-card reading-insight-card--innovation"><h3>创新点</h3><ul><li>原位XRD追踪充放电过程中多硫化物演化</li><li>DFT计算揭示化学吸附能垒</li><li>1000次长循环验证稳定性</li></ul></article>
              <article className="reading-insight-card reading-insight-card--limit"><h3>研究局限</h3><ul><li>原位XRD追踪充放电过程中多硫化物演化</li></ul></article>
              {aiExchange && <article className="reading-ai-exchange" aria-live="polite"><p className="reading-ai-exchange-question">{aiExchange.question}</p><p className="reading-ai-exchange-answer">{aiExchange.answer}</p></article>}
            </div>
          )}
          {rightPanel === 'charts' && <ReadingCharts onExport={exportChart} />}
          {rightPanel === 'references' && <ReadingReferences onView={() => onToast('已打开参考文献详情')} />}
          {rightPanel === 'metadata' && <ReadingMetadata />}
          {rightPanel === 'graph' && <ReadingGraph onView={() => onToast('已打开关联论文详情')} />}
        </div>
        {rightPanel === 'ai' && (
          <div className="reading-ai-question">
            <label htmlFor="reading-ai-question"><img src="/assets/reading/ai.svg" alt="" />AI问答</label>
            <div>
              <input
                id="reading-ai-question"
                value={aiQuestion}
                onChange={(event) => setAiQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.nativeEvent.isComposing) submitAiQuestion()
                }}
                placeholder="向AI提问关于这篇论文..."
              />
              {aiQuestion.trim() && (
                <button type="button" aria-label="提交问题" onClick={submitAiQuestion}>
                  <span className="reading-submit-arrow" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        )}
      </aside>

      <footer className="reading-footer">
        <div className="reading-page-controls">
          <button type="button" onClick={() => goToPage(1)} aria-label="第一页"><span className="reading-first-page-icon" /></button>
          <button type="button" onClick={() => goToPage(page - 1)} aria-label="上一页"><span className="pager-chevron pager-chevron--prev" /></button>
          <span>{pageLabel}</span>
          <button type="button" onClick={() => goToPage(page + 1)} aria-label="下一页"><span className="pager-chevron" /></button>
          <button type="button" onClick={() => goToPage(totalPages)} aria-label="最后一页"><span className="reading-last-page-icon" /></button>
          <button type="button" className="reading-back-first" onClick={() => goToPage(1)}>回到第1页</button>
        </div>
        <div className="reading-zoom-controls">
          <div className="reading-zoom-selector" ref={zoomSelectorRef}>
            <button
              ref={zoomTriggerRef}
              type="button"
              className={`reading-zoom-trigger${zoomMenuOpen ? ' is-open' : ''}${zoom === 100 ? ' is-wide-value' : ''}`}
              aria-label={`缩放比例，当前 ${zoom}%`}
              aria-haspopup="listbox"
              aria-expanded={zoomMenuOpen}
              aria-controls="reading-zoom-menu"
              onClick={() => zoomMenuOpen ? closeZoomMenu() : openZoomMenu()}
              onKeyDown={handleZoomTriggerKeyDown}
            >
              <span>{zoom}%</span>
              <i className="reading-zoom-trigger-chevron" aria-hidden="true">
                <img src="./assets/reading/zoom-chevron-vector.svg" alt="" />
              </i>
            </button>
            {zoomMenuOpen && (
              <div className="reading-zoom-menu" id="reading-zoom-menu" role="listbox" aria-label="选择缩放比例">
                {zoomPresets.map((preset, index) => (
                  <button
                    ref={(node) => { zoomOptionRefs.current[index] = node }}
                    type="button"
                    role="option"
                    aria-selected={zoom === preset}
                    className={zoom === preset ? 'is-active' : ''}
                    tabIndex={index === zoomMenuActiveIndex ? 0 : -1}
                    key={preset}
                    onFocus={() => setZoomMenuActiveIndex(index)}
                    onClick={() => selectZoomPreset(preset, false)}
                    onKeyDown={(event) => handleZoomOptionKeyDown(event, index)}
                  >
                    {preset}%
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="reading-zoom-slider">
            <button className="reading-zoom-step" type="button" aria-label="缩小" disabled={zoom === 25} onClick={() => applyZoom(zoom - 5)}>
              <img src="./assets/reading/zoom-minus.svg" alt="" />
            </button>
            <div
              className={`reading-zoom-range${zoomDragging ? ' is-dragging' : ''}`}
              role="slider"
              tabIndex={0}
              aria-label="页面缩放"
              aria-valuemin={25}
              aria-valuemax={100}
              aria-valuenow={zoom}
              aria-valuetext={`${zoom}%`}
              style={{ '--zoom-progress': `${zoom}%` } as CSSProperties}
              onPointerDown={handleZoomRangePointerDown}
              onPointerMove={handleZoomRangePointerMove}
              onPointerUp={finishZoomRangePointer}
              onPointerCancel={finishZoomRangePointer}
              onKeyDown={handleZoomRangeKeyDown}
              onBlur={() => setZoomDragging(false)}
            >
              <span className="reading-zoom-track" aria-hidden="true" />
              <span className="reading-zoom-progress" aria-hidden="true" />
              <span className="reading-zoom-thumb" aria-hidden="true"><img src="./assets/reading/zoom-thumb.svg" alt="" /></span>
            </div>
            <button className="reading-zoom-step" type="button" aria-label="放大" disabled={zoom === 100} onClick={() => applyZoom(zoom + 5)}>
              <img src="./assets/reading/zoom-plus.svg" alt="" />
            </button>
          </div>
          <button className="reading-fullscreen-button" type="button" aria-label={maximized ? '退出全屏' : '全屏'} onClick={() => void toggleReaderFullscreen()}><img src="./assets/reading/zoom-fullscreen.svg" alt="" /></button>
        </div>
      </footer>
    </section>
  )
}

function ReadingCharts({ onExport }: { onExport: (title: string, index: number) => void }) {
  const charts = [
    ['图1. F-CNT SEM形貌图', '第1页'],
    ['图2. XPS表征图谱', '第1页'],
    ['图3. 循环性能曲线', '第3页'],
    ['图4. 倍率性能对比', '第4页'],
    ['图5. DFT计算结果', '第5页'],
  ]
  return <div className="reading-figure-panel"><header><strong>图表提取</strong><span>5 张</span></header><div>{charts.map(([title, page], index) => <article key={title}><div className={`reading-figure-thumb reading-figure-thumb--${index % 3}`}><img src="/assets/reading/chart-exact.png" alt={title} /></div><div><strong>{title}</strong><small>{page}</small></div><button type="button" onClick={() => onExport(title, index)}>导出</button></article>)}</div></div>
}

function ReadingReferences({ onView }: { onView: () => void }) {
  const references = [
    ['Sulfide solid electrolytes for all...', 'Nature Energy ｜ 2023'],
    ['硅碳负极材料的研究进展', '化学学报 ｜ 2024'],
    ['Sulfide solid electrolytes for all...', 'Nature Energy ｜ 2023'],
    ['硅碳负极材料的研究进展', '化学学报 ｜ 2024'],
    ['Sulfide solid electrolytes for all...', 'Nature Energy ｜ 2023'],
  ]
  return <div className="reading-reference-panel"><header><strong>文献解析</strong><span>32 条</span></header><div>{references.map(([title, detail], index) => <article key={`${title}-${index}`}><span>[{index + 1}]</span><strong>{title}</strong><small>{detail}</small><footer><b>被引用·58</b><button type="button" onClick={onView}>查看</button></footer></article>)}</div></div>
}

function ReadingMetadata() {
  return <div className="reading-metadata-panel"><header><strong>数据提炼</strong><span>9 条</span></header><dl><div><dt>期刊</dt><dd>Advanced Energy Materials</dd></div><div><dt>影响因子</dt><dd>27.8（2023）</dd></div><div><dt>发表年份</dt><dd>2024</dd></div><div><dt>DOI</dt><dd>10.1002/aenm.202301847</dd></div><div><dt>被引次数</dt><dd>47</dd></div><div><dt>访问类型</dt><dd>开放获取（OA）</dd></div><div><dt>语言</dt><dd>英文</dd></div><div><dt>页数</dt><dd>18页</dd></div><div><dt>数据共享</dt><dd>GitHub:github.com/liulab</dd></div></dl></div>
}

function ReadingGraph({ onView }: { onView: () => void }) {
  const recommendations = [['MXene基复合材料在锂硫电池中...', 'Adv Energy Mater ｜ 2023'], ['固态电解质界面工程与锂金属负...', 'Nature Energy ｜ 2024'], ['钠离子电池层状氧化物正极材料...', 'Energy Environ Sci ｜ 2025']]
  return <div className="reading-graph-panel"><header><strong>图谱关联</strong><span>4 个</span></header><div className="reading-graph"><svg viewBox="0 0 236 137" role="img" aria-label="论文知识图谱"><line x1="118" y1="68" x2="38" y2="30" /><line x1="118" y1="68" x2="198" y2="30" /><line x1="118" y1="68" x2="38" y2="108" /><line x1="118" y1="68" x2="198" y2="108" /><g className="node-main"><circle cx="118" cy="68" r="20" /><text x="118" y="72">CNT</text></g><g className="node-cyan"><circle cx="38" cy="30" r="16" /><text x="38" y="34">锂硫</text></g><g className="node-blue"><circle cx="198" cy="30" r="16" /><text x="198" y="34">锂金属</text></g><g className="node-pink"><circle cx="38" cy="108" r="16" /><text x="38" y="112">多硫化物</text></g><g className="node-yellow"><circle cx="198" cy="108" r="16" /><text x="198" y="112">储能</text></g></svg></div><div className="reading-related-heading"><strong>关联论文推荐</strong><span>4 篇</span></div><div className="reading-related-list">{recommendations.map(([title, detail]) => <article key={title}><strong>{title}</strong><small>{detail}</small><footer><b>被引用·58</b><button type="button" onClick={onView}>查看</button></footer></article>)}</div></div>
}
