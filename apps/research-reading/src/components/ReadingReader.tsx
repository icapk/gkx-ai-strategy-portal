import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { articleSections, type ReadingDocument, type ReadingNote } from '../readingData'
import {
  getPaperAnalysis,
  searchPaperAnalysis,
  type PaperAnalysis,
  type PaperAnalysisSearchKind,
  type PaperFigure,
  type PaperReference,
} from '../readingAnalysis'
import { Modal } from './Modal'

type LeftPanel = 'outline' | 'thumbnails' | 'notes'
type InsightPanel = 'ai' | 'charts' | 'references' | 'metadata' | 'graph'
type ContextAction = null | 'highlight' | 'translate' | 'explain' | 'screenshot'
type ActiveTool = null | 'search' | 'note' | 'screenshot'
type CropHandle = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
type PageLayout = 'single' | 'double'

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

interface StoredHighlight extends NoteSelection {
  id: string
  color: string
  page: number
}

interface ReaderPosition {
  page: number
  scrollTop: number
  label: string
}

interface ReaderSearchResult {
  id: string
  kind: PaperAnalysisSearchKind | 'full-text'
  label: string
  snippet: string
  page: number
  sectionTitle: string
}

interface LocalLanguageAid {
  translation: string
  definition: string
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
  onNotesChange: (notes: ReadingNote[]) => boolean
  onEditingNoteChange: (editing: boolean, controller?: ReadingDraftController) => void
  onToast: (message: string) => void
}

export interface ReadingDraftController {
  save: () => boolean
  discard: () => void
}

interface ReaderArticleSection {
  title: string
  parts: Array<{ title: string; body: string }>
}

const insightTabs: Array<{ id: InsightPanel; label: string }> = [
  { id: 'ai', label: 'AI解读' },
  { id: 'charts', label: '图表' },
  { id: 'references', label: '参考文献' },
  { id: 'metadata', label: '元数据' },
  { id: 'graph', label: '图谱' },
]

const leftTabs: Array<{ id: LeftPanel; label: string }> = [
  { id: 'outline', label: '目录' },
  { id: 'thumbnails', label: '缩略图' },
  { id: 'notes', label: '笔记' },
]

const highlightColors = ['transparent', '#F2F3F5', '#FABFBD', '#FFE4BA', '#FADC19', '#C6EFC1', '#BDE3FF', '#DCC9FB', '#E5E6EB', '#C9CDD4', '#F76965', '#FF9A2E', '#FADC19', '#62C554', '#7BC0FC', '#B8A1FF']

const zoomPresets = [25, 50, 75, 100] as const

const localTerms: Array<{ matches: string[]; english: string; definition: string }> = [
  {
    matches: ['多硫化物', 'polysulfide'],
    english: 'polysulfide',
    definition: '锂硫电池反应中的含硫中间体；可溶性的长链多硫化物迁移会引发穿梭效应。',
  },
  {
    matches: ['穿梭效应', 'shuttle effect'],
    english: 'polysulfide shuttle effect',
    definition: '可溶性多硫化物在正负极之间往返迁移并发生副反应，造成容量衰减与库仑效率下降。',
  },
  {
    matches: ['功能化碳纳米管', '碳纳米管', 'cnt'],
    english: 'functionalized carbon nanotube (CNT)',
    definition: '经表面官能团改性的碳纳米管，可同时提供导电网络和极性吸附位点。',
  },
  {
    matches: ['原位xrd', 'xrd'],
    english: 'in-situ X-ray diffraction (XRD)',
    definition: '在材料工作过程中实时记录晶相变化的衍射表征方法。',
  },
  {
    matches: ['界面吸附', 'adsorption'],
    english: 'interfacial adsorption',
    definition: '分子或离子在材料界面活性位点富集并产生物理或化学相互作用的过程。',
  },
]

function sectionSlug(sectionTitle: string) {
  return sectionTitle.replace(/[^\d\u4e00-\u9fa5]/g, '')
}

function resolvePaperSection(analysis: PaperAnalysis, sectionId?: string) {
  if (!sectionId || sectionId === 'abstract') return '摘要'
  const parsed = analysis.outline.find((section) => section.id === sectionId)
  const title = parsed?.title ?? sectionId
  if (analysis.documentId !== 1) return title
  if (/^(1\.|introduction|background)/i.test(title)) return '1.1.研究背景与意义'
  if (/界面|表征|operando|characterization/i.test(title)) return '2.2.表征手段'
  if (/^(2\.|method|design)/i.test(title)) return '2.1.原料制备'
  if (/^(3\.|result|device)/i.test(title)) return '3.2.储能机制研究'
  if (/^(4\.|conclusion|reference)/i.test(title)) return '4.结论'
  return '摘要'
}

function pageForSection(analysis: PaperAnalysis, sectionTitle: string) {
  if (sectionTitle === '摘要') return 1
  const exact = analysis.outline.find((section) => section.title === sectionTitle)
  if (exact) return exact.page
  const prefix = sectionTitle.match(/^\d+/)?.[0]
  const parsed = analysis.outline.find((section) => prefix && section.title.startsWith(`${prefix}.`))
  return parsed?.page ?? 1
}

function readerArticleSections(analysis: PaperAnalysis): ReaderArticleSection[] {
  if (analysis.documentId === 1) return articleSections
  const body = analysis.outline.filter((section) => section.kind === 'body')
  return body.filter((section) => section.level === 1).map((section) => {
    const children = body.filter((candidate) => candidate.parentId === section.id)
    return {
      title: section.title,
      parts: children.length > 0
        ? children.map((child) => ({ title: child.title, body: child.excerpt }))
        : [{ title: '', body: section.excerpt }],
    }
  })
}

function noteImageSnapshot(images: string[]) {
  return JSON.stringify(images)
}

function localLanguageAid(text: string): LocalLanguageAid {
  const normalized = text.normalize('NFKC').toLocaleLowerCase('zh-CN')
  const matched = localTerms.filter((term) => term.matches.some((candidate) => normalized.includes(candidate)))
  if (matched.length > 0) {
    return {
      translation: matched.map((term) => term.english).join('；'),
      definition: matched.map((term) => term.definition).join(' '),
    }
  }
  return {
    translation: /[\u4e00-\u9fa5]/.test(text)
      ? '本地词典暂未收录完整句译文，可将选中内容加入笔记后继续人工核对。'
      : '本地词典暂未收录该英文短语，可查看所在段落与论文元数据辅助判断。',
    definition: `已保留原文“${text.slice(0, 80)}${text.length > 80 ? '…' : ''}”，当前仅提供本地辅助释义，不调用外部 AI。`,
  }
}

function noteAnchor(excerpt: string) {
  const match = excerpt.match(/^【(?:截图笔记\s*·\s*)?第(\d+)页\s*·\s*([^】]+)】/)
  return match ? { page: Number(match[1]), sectionTitle: match[2].trim() } : null
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
  const paperAnalysis = useMemo(() => getPaperAnalysis(activeDocumentId, documentTitle), [activeDocumentId, documentTitle])
  const activeArticleSections = useMemo(() => readerArticleSections(paperAnalysis), [paperAnalysis])
  const totalPages = useMemo(() => Math.max(
    18,
    ...paperAnalysis.outline.map((section) => section.page),
    ...paperAnalysis.figures.map((figure) => figure.page),
    ...paperAnalysis.references.flatMap((reference) => reference.citationAnchors.map((anchor) => anchor.page)),
  ), [paperAnalysis])
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
  const [definedResult, setDefinedResult] = useState<number | null>(null)
  const [locatedResult, setLocatedResult] = useState<number | null>(null)
  const [locatedSectionTitle, setLocatedSectionTitle] = useState<string | null>(null)
  const [locationDepth, setLocationDepth] = useState(0)
  const [pageInput, setPageInput] = useState('1')
  const [markersVisible, setMarkersVisible] = useState(true)
  const [pageLayout, setPageLayout] = useState<PageLayout>('single')
  const [highlights, setHighlights] = useState<StoredHighlight[]>([])
  const [selectedReferenceId, setSelectedReferenceId] = useState<string | null>(null)
  const [selectedFigureId, setSelectedFigureId] = useState<string | null>(null)
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiExchange, setAiExchange] = useState<{ question: string; answer: string } | null>(null)
  const [documentMenuOpen, setDocumentMenuOpen] = useState(false)
  const [documentMenuActiveIndex, setDocumentMenuActiveIndex] = useState(0)
  const [pendingDocumentId, setPendingDocumentId] = useState<number | null>(null)
  const [maximized, setMaximized] = useState(false)
  const [noteDetailId, setNoteDetailId] = useState<number | null>(null)
  const [pendingDeleteNoteId, setPendingDeleteNoteId] = useState<number | null>(null)
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
  const [searchModeActiveIndex, setSearchModeActiveIndex] = useState(0)
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
  const searchDrawerRef = useRef<HTMLElement>(null)
  const searchToolRef = useRef<HTMLButtonElement>(null)
  const documentTriggerRef = useRef<HTMLButtonElement>(null)
  const documentMenuRef = useRef<HTMLDivElement>(null)
  const documentMenuItemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const searchModeTriggerRef = useRef<HTMLButtonElement>(null)
  const searchModeItemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const selectionToolRefs = useRef<Array<HTMLButtonElement | null>>([])
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const noteDetailRef = useRef<HTMLElement>(null)
  const noteDetailReturnFocusRef = useRef<HTMLElement | null>(null)
  const cropActionFirstRef = useRef<HTMLButtonElement>(null)
  const leftContentRef = useRef<HTMLDivElement>(null)
  const thumbnailListRef = useRef<HTMLDivElement>(null)
  const leftTabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const rightTabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const locationHistoryRef = useRef<ReaderPosition[]>([])
  const restoredDocumentRef = useRef<number | null>(null)
  const storageHydratingRef = useRef(true)
  const storageHydrationFrameRef = useRef<number | null>(null)
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
  const noteKeyboardReturnFocusRef = useRef<HTMLElement | null>(null)
  const noteDraftBaselineRef = useRef(JSON.stringify({ pending: '', text: '', images: [] as string[] }))
  const uploadedNoteImagesRef = useRef<string[]>([])

  const filteredNotes = useMemo(() => notes.slice(), [notes])
  const detailedNote = notes.find((note) => note.id === noteDetailId)
  const noteDraftDirty = useMemo(() => editingNoteId != null && noteDraftBaselineRef.current !== JSON.stringify({
    pending: pendingAddedNote,
    text: editingNoteText,
    images: uploadedNoteImages,
  }), [editingNoteId, editingNoteText, pendingAddedNote, uploadedNoteImages])
  const selectionAid = useMemo(() => localLanguageAid(noteSelection?.text ?? ''), [noteSelection?.text])
  const currentSectionTitle = useMemo(() => {
    const parsed = paperAnalysis.outline
      .filter((section) => section.page <= page)
      .sort((left, right) => right.page - left.page)[0]
    return resolvePaperSection(paperAnalysis, parsed?.id)
  }, [page, paperAnalysis])

  const searchResults = useMemo<ReaderSearchResult[]>(() => {
    const query = searchedQuery.normalize('NFKC').trim().toLocaleLowerCase('zh-CN')
    if (!query) return []
    const terms = query.split(/\s+/).filter(Boolean)
    const paragraphs = [
      { id: 'abstract', label: '摘要', text: paperAnalysis.metadata.abstract, page: 1, sectionTitle: '摘要' },
      ...activeArticleSections.flatMap((section) => section.parts.map((part) => ({
        id: sectionSlug(part.title || section.title),
        label: part.title || section.title,
        text: part.body,
        page: pageForSection(paperAnalysis, part.title || section.title),
        sectionTitle: part.title || section.title,
      }))),
    ]
    const lexical = paragraphs
      .filter((paragraph) => {
        const haystack = `${paragraph.label} ${paragraph.text}`.normalize('NFKC').toLocaleLowerCase('zh-CN')
        return searchMode === 'AI语义' || searchMode === '智能关联'
          ? terms.every((term) => haystack.includes(term))
          : haystack.includes(query)
      })
      .map<ReaderSearchResult>((paragraph) => ({
        id: `text-${paragraph.id}`,
        kind: 'full-text',
        label: paragraph.label,
        snippet: paragraph.text,
        page: paragraph.page,
        sectionTitle: paragraph.sectionTitle,
      }))
    const structured = searchPaperAnalysis(paperAnalysis, searchedQuery).map<ReaderSearchResult>((result) => ({
      id: result.id,
      kind: result.kind,
      label: result.label,
      snippet: result.snippet,
      page: result.target.page ?? 1,
      sectionTitle: resolvePaperSection(paperAnalysis, result.target.sectionId),
    }))
    const combined = searchMode === '全文搜索' || searchMode === '关键词'
      ? [...lexical, ...structured.filter((result) => result.kind === 'keyword' || result.kind === 'title')]
      : [...structured, ...lexical]
    return combined.filter((result, index, all) => all.findIndex((candidate) => candidate.id === result.id) === index).slice(0, 12)
  }, [activeArticleSections, paperAnalysis, searchMode, searchedQuery])

  useEffect(() => {
    if (editingNoteId != null) window.requestAnimationFrame(() => {
      leftContentRef.current?.scrollTo({ top: 0, behavior: 'auto' })
      noteTextareaRef.current?.focus({ preventScroll: true })
    })
  }, [editingNoteId])

  useEffect(() => {
    if (!searchOpen) return
    window.requestAnimationFrame(() => searchInputRef.current?.focus({ preventScroll: true }))
    const trapSearchFocus = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setSearchOpen(false)
        setActiveTool((current) => current === 'search' ? null : current)
        setSearchModeOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const focusable = Array.from(searchDrawerRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? []).filter((element) => element.offsetParent !== null)
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', trapSearchFocus)
    return () => {
      document.removeEventListener('keydown', trapSearchFocus)
      window.requestAnimationFrame(() => searchToolRef.current?.focus({ preventScroll: true }))
    }
  }, [searchOpen])

  useEffect(() => {
    if (!documentMenuOpen) return
    const currentIndex = Math.max(0, documents.findIndex((document) => document.id === activeDocumentId))
    setDocumentMenuActiveIndex(currentIndex)
    const focusFrame = window.requestAnimationFrame(() => documentMenuItemRefs.current[currentIndex]?.focus({ preventScroll: true }))
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (documentMenuRef.current?.contains(event.target as Node) || documentTriggerRef.current?.contains(event.target as Node)) return
      setDocumentMenuOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setDocumentMenuOpen(false)
      documentTriggerRef.current?.focus({ preventScroll: true })
    }
    document.addEventListener('pointerdown', closeOnOutsidePointer)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [activeDocumentId, documentMenuOpen, documents])

  useEffect(() => {
    if (!detailedNote) return
    const focusFrame = window.requestAnimationFrame(() => noteDetailRef.current?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true }))
    const trapNoteDialogFocus = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setNoteDetailId(null)
        return
      }
      if (event.key !== 'Tab') return
      const focusable = Array.from(noteDetailRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [])
        .filter((element) => element.offsetParent !== null)
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', trapNoteDialogFocus)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', trapNoteDialogFocus)
      window.requestAnimationFrame(() => noteDetailReturnFocusRef.current?.focus({ preventScroll: true }))
    }
  }, [detailedNote])

  useEffect(() => {
    setPageInput(String(page))
  }, [page])

  useEffect(() => {
    storageHydratingRef.current = true
    if (storageHydrationFrameRef.current != null) window.cancelAnimationFrame(storageHydrationFrameRef.current)
    locationHistoryRef.current = []
    setLocationDepth(0)
    setLocatedResult(null)
    setLocatedSectionTitle(null)
    setSelectedReferenceId(null)
    setSelectedFigureId(null)
    restoredDocumentRef.current = activeDocumentId
    try {
      const saved = window.localStorage.getItem(`reading-progress:${activeDocumentId}`)
      if (!saved) {
        setPage(1)
        setPageInput('1')
        zoomValueRef.current = 50
        setZoom(50)
        setMarkersVisible(true)
        setPageLayout('single')
      } else {
        const progress = JSON.parse(saved) as Partial<{ page: number; zoom: number; scrollTop: number; markersVisible: boolean; pageLayout: PageLayout }>
        const restoredPage = Math.min(totalPages, Math.max(1, Number(progress.page) || 1))
        const restoredZoom = Math.min(100, Math.max(25, Number(progress.zoom) || 50))
        setPage(restoredPage)
        setPageInput(String(restoredPage))
        zoomValueRef.current = restoredZoom
        setZoom(restoredZoom)
        setMarkersVisible(progress.markersVisible !== false)
        setPageLayout(progress.pageLayout === 'double' ? 'double' : 'single')
        window.requestAnimationFrame(() => paperScrollRef.current?.scrollTo({ top: Math.max(0, Number(progress.scrollTop) || 0), behavior: 'auto' }))
      }
    } catch {
      setPage(1)
      setPageInput('1')
      zoomValueRef.current = 50
      setZoom(50)
      setMarkersVisible(true)
      setPageLayout('single')
    }

    try {
      const savedHighlights = window.localStorage.getItem(`reading-highlights:${activeDocumentId}`)
      const parsed = savedHighlights ? JSON.parse(savedHighlights) : []
      setHighlights(Array.isArray(parsed) ? parsed.filter((item): item is StoredHighlight => (
        item && typeof item.id === 'string' && typeof item.sectionTitle === 'string' && typeof item.text === 'string'
        && Number.isFinite(item.start) && Number.isFinite(item.end) && typeof item.color === 'string'
      )) : [])
    } catch {
      setHighlights([])
    }
    const restoringDocumentId = activeDocumentId
    storageHydrationFrameRef.current = window.requestAnimationFrame(() => {
      storageHydrationFrameRef.current = null
      if (restoredDocumentRef.current === restoringDocumentId) storageHydratingRef.current = false
    })
  }, [activeDocumentId, totalPages])

  useEffect(() => {
    if (restoredDocumentRef.current !== activeDocumentId || storageHydratingRef.current) return
    try {
      window.localStorage.setItem(`reading-highlights:${activeDocumentId}`, JSON.stringify(highlights))
    } catch {
      // Highlighting remains available for this session if browser storage is unavailable.
    }
  }, [activeDocumentId, highlights])

  useEffect(() => {
    if (restoredDocumentRef.current !== activeDocumentId || storageHydratingRef.current) return
    try {
      const saved = window.localStorage.getItem(`reading-progress:${activeDocumentId}`)
      const current = saved ? JSON.parse(saved) as Record<string, unknown> : {}
      window.localStorage.setItem(`reading-progress:${activeDocumentId}`, JSON.stringify({
        ...current,
        documentId: activeDocumentId,
        page,
        zoom,
        scrollTop: paperScrollRef.current?.scrollTop ?? 0,
        markersVisible,
        pageLayout,
        savedAt: new Date().toISOString(),
      }))
    } catch {
      // Explicit save still reports any storage error to the user.
    }
  }, [activeDocumentId, markersVisible, page, pageLayout, zoom])

  useEffect(() => () => {
    if (screenshotAnimationFrameRef.current != null) window.cancelAnimationFrame(screenshotAnimationFrameRef.current)
    if (pageSyncAnimationFrameRef.current != null) window.cancelAnimationFrame(pageSyncAnimationFrameRef.current)
    if (zoomInputAnimationFrameRef.current != null) window.cancelAnimationFrame(zoomInputAnimationFrameRef.current)
    if (zoomRestoreAnimationFrameRef.current != null) window.cancelAnimationFrame(zoomRestoreAnimationFrameRef.current)
    if (zoomRestoreUnlockAnimationFrameRef.current != null) window.cancelAnimationFrame(zoomRestoreUnlockAnimationFrameRef.current)
    if (storageHydrationFrameRef.current != null) window.cancelAnimationFrame(storageHydrationFrameRef.current)
    uploadedNoteImagesRef.current.filter((url) => url.startsWith('blob:')).forEach((url) => URL.revokeObjectURL(url))
  }, [])

  useEffect(() => {
    const previous = uploadedNoteImagesRef.current
    previous.filter((url) => url.startsWith('blob:') && !uploadedNoteImages.includes(url)).forEach((url) => URL.revokeObjectURL(url))
    uploadedNoteImagesRef.current = uploadedNoteImages
  }, [uploadedNoteImages])

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

  const pushCurrentPosition = (label: string) => {
    const position = { page, scrollTop: paperScrollRef.current?.scrollTop ?? 0, label }
    const last = locationHistoryRef.current.at(-1)
    if (!last || last.page !== position.page || Math.abs(last.scrollTop - position.scrollTop) > 2) {
      locationHistoryRef.current = [...locationHistoryRef.current.slice(-19), position]
      setLocationDepth(locationHistoryRef.current.length)
    }
  }

  const goToPage = (targetPage: number, options?: { sectionTitle?: string; scroll?: boolean; recordHistory?: boolean; label?: string }) => {
    const nextPage = Math.min(totalPages, Math.max(1, targetPage))
    if (options?.recordHistory !== false) pushCurrentPosition(options?.label ?? `第 ${page} 页`)
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

  const commitPageInput = () => {
    const requested = Number.parseInt(pageInput, 10)
    if (!Number.isFinite(requested)) {
      setPageInput(String(page))
      return
    }
    const nextPage = Math.min(totalPages, Math.max(1, requested))
    setPageInput(String(nextPage))
    goToPage(nextPage, { label: '页码跳转前' })
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
    goToPage(pageForSection(paperAnalysis, sectionTitle), { sectionTitle, label: sectionTitle })
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

  const handleLeftTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    const key = event.key
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(key)) return
    event.preventDefault()
    const nextIndex = key === 'Home'
      ? 0
      : key === 'End'
        ? leftTabs.length - 1
        : (index + (key === 'ArrowDown' || key === 'ArrowRight' ? 1 : -1) + leftTabs.length) % leftTabs.length
    selectLeftPanel(leftTabs[nextIndex].id)
    window.requestAnimationFrame(() => leftTabRefs.current[nextIndex]?.focus({ preventScroll: true }))
  }

  const handleRightTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    const key = event.key
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) return
    event.preventDefault()
    const nextIndex = key === 'Home'
      ? 0
      : key === 'End'
        ? insightTabs.length - 1
        : (index + (key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1) + insightTabs.length) % insightTabs.length
    selectInsightPanel(insightTabs[nextIndex].id)
    window.requestAnimationFrame(() => rightTabRefs.current[nextIndex]?.focus({ preventScroll: true }))
  }

  const moveDocumentMenuFocus = (nextIndex: number) => {
    if (documents.length === 0) return
    const normalized = (nextIndex + documents.length) % documents.length
    setDocumentMenuActiveIndex(normalized)
    documentMenuItemRefs.current[normalized]?.focus({ preventScroll: true })
  }

  const handleDocumentMenuKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveDocumentMenuFocus(index + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveDocumentMenuFocus(index - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      moveDocumentMenuFocus(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      moveDocumentMenuFocus(documents.length - 1)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setDocumentMenuOpen(false)
      documentTriggerRef.current?.focus({ preventScroll: true })
    } else if (event.key === 'Tab') {
      setDocumentMenuOpen(false)
    }
  }

  const moveSearchModeFocus = (nextIndex: number) => {
    const modes = ['全文搜索', '智能关联', 'AI语义', '关键词'] as const
    const normalized = (nextIndex + modes.length) % modes.length
    setSearchModeActiveIndex(normalized)
    searchModeItemRefs.current[normalized]?.focus({ preventScroll: true })
  }

  const handleSearchModeKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveSearchModeFocus(index + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveSearchModeFocus(index - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      moveSearchModeFocus(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      moveSearchModeFocus(3)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setSearchModeOpen(false)
      searchModeTriggerRef.current?.focus({ preventScroll: true })
    } else if (event.key === 'Tab') {
      setSearchModeOpen(false)
    }
  }

  const handleSelectionToolbarKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : -1) + 3) % 3
    selectionToolRefs.current[next]?.focus({ preventScroll: true })
  }

  const locateSearchResult = (index: number, result: ReaderSearchResult) => {
    setLocatedResult(index)
    setLocatedSectionTitle(result.sectionTitle)
    goToPage(result.page, { sectionTitle: result.sectionTitle, label: `检索前 · ${result.label}` })
    onToast('已定位到原文出处')
  }

  const returnFromLocation = () => {
    const origin = locationHistoryRef.current.at(-1)
    setLocatedResult(null)
    setLocatedSectionTitle(null)
    if (origin) {
      locationHistoryRef.current = locationHistoryRef.current.slice(0, -1)
      setLocationDepth(locationHistoryRef.current.length)
      goToPage(origin.page, { scroll: false, recordHistory: false })
      paperScrollRef.current?.scrollTo({ top: origin.scrollTop, behavior: 'auto' })
    }
  }

  const submitAiQuestion = () => {
    const question = aiQuestion.trim()
    if (!question) return
    setAiExchange({
      question,
      answer: `根据当前文献《${paperAnalysis.metadata.title}》的本地解析，该问题与${paperAnalysis.metadata.researchField}相关。可重点核对“${paperAnalysis.metadata.keywords.slice(0, 3).join('、')}”及正文中的可追溯引文和图表；当前结论来自已解析的摘要与结构化数据，请结合定位原文复核。`,
    })
    setAiQuestion('')
    onToast('问题已提交')
  }

  const closeSearchDrawer = () => {
    setSearchOpen(false)
    setActiveTool((current) => current === 'search' ? null : current)
    setSearchModeOpen(false)
    setTranslatedResult(null)
    setDefinedResult(null)
    if (locatedResult != null) returnFromLocation()
  }

  const submitSearch = () => {
    const value = searchQuery.trim()
    if (!value) return
    setSearchedQuery(value)
    setTranslatedResult(null)
    setDefinedResult(null)
    setLocatedResult(null)
    setLocatedSectionTitle(null)
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
    setDefinedResult(null)
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

  const createKeyboardScreenshotSelection = () => {
    const bounds = paperScrollRef.current?.getBoundingClientRect()
    if (!bounds) return
    const inset = 28
    setCropRect({
      left: Math.max(0, bounds.left + inset),
      top: Math.max(0, bounds.top + inset),
      width: Math.max(120, bounds.width - inset * 2),
      height: Math.max(90, bounds.height - inset * 2),
    })
    setContextAction('screenshot')
    window.requestAnimationFrame(() => cropActionFirstRef.current?.focus({ preventScroll: true }))
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

  const selectPaperLineWithKeyboard = (event: ReactKeyboardEvent<HTMLParagraphElement>, sectionTitle: string) => {
    if (activeTool !== 'note' || !['Enter', ' '].includes(event.key)) return
    event.preventDefault()
    const text = event.currentTarget.textContent?.trim() ?? ''
    if (!text) return
    noteKeyboardReturnFocusRef.current = event.currentTarget
    placeContextMenu(event.currentTarget.getBoundingClientRect())
    setResultCards({
      translationVisible: false,
      translationExpanded: false,
      explanationVisible: false,
      explanationExpanded: false,
    })
    setNoteSelection({ kind: 'field', sectionTitle, text, start: 0, end: text.length })
    setContextAction('highlight')
    window.requestAnimationFrame(() => contextMenuRef.current?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true }))
  }

  const handleContextMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const buttons = Array.from(contextMenuRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') ?? [])
    const currentIndex = buttons.findIndex((button) => button === document.activeElement)
    if (event.key === 'Escape') {
      event.preventDefault()
      setContextAction(null)
      setColorMenuOpen(false)
      setNoteSelection(null)
      noteKeyboardReturnFocusRef.current?.focus({ preventScroll: true })
      return
    }
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || buttons.length === 0) return
    event.preventDefault()
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? buttons.length - 1
        : (Math.max(0, currentIndex) + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length
    buttons[nextIndex]?.focus({ preventScroll: true })
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
    if (activeTool === 'screenshot') return
    const pointerStart = notePointerStartRef.current
    notePointerStartRef.current = null
    if (activeTool === 'note' && pointerStart?.sectionTitle === sectionTitle && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) >= 4) {
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
    const ranges: Array<Pick<StoredHighlight, 'id' | 'start' | 'end' | 'color' | 'kind'>> = highlights
      .filter((highlight) => highlight.sectionTitle === sectionTitle)
      .map((highlight) => ({ id: highlight.id, start: highlight.start, end: highlight.end, color: highlight.color, kind: highlight.kind }))
    if (noteSelection?.sectionTitle === sectionTitle && contextAction != null && contextAction !== 'screenshot') {
      ranges.push({
        id: 'active-selection',
        start: noteSelection.start,
        end: noteSelection.end,
        color: highlightColors[highlightColorIndex],
        kind: noteSelection.kind,
      })
    }
    if (ranges.length === 0) return text
    const ordered = ranges
      .map((range) => ({ ...range, start: Math.max(0, Math.min(text.length, range.start)), end: Math.max(0, Math.min(text.length, range.end)) }))
      .filter((range) => range.end > range.start)
      .sort((left, right) => left.start - right.start || right.end - left.end)
    const content: ReactNode[] = []
    let cursor = 0
    ordered.forEach((range) => {
      if (range.start < cursor) return
      if (range.start > cursor) content.push(text.slice(cursor, range.start))
      content.push(<mark className={`paper-note-selection is-${range.kind}`} style={{ '--selected-line-color': range.color } as CSSProperties} key={range.id}>{text.slice(range.start, range.end)}</mark>)
      cursor = range.end
    })
    if (cursor < text.length) content.push(text.slice(cursor))
    return <>{content}</>
  }

  const applyHighlightColor = (index: number) => {
    setHighlightColorIndex(index)
    setColorMenuOpen(false)
    if (!noteSelection) return
    const chosenColor = highlightColors[index]
    setHighlights((current) => {
      const withoutSameRange = current.filter((highlight) => !(
        highlight.sectionTitle === noteSelection.sectionTitle
        && highlight.start === noteSelection.start
        && highlight.end === noteSelection.end
      ))
      if (chosenColor === 'transparent') return withoutSameRange
      return [...withoutSameRange, {
        ...noteSelection,
        id: `${activeDocumentId}-${Date.now()}-${noteSelection.start}-${noteSelection.end}`,
        page: pageForSection(paperAnalysis, noteSelection.sectionTitle),
        color: chosenColor,
      }]
    })
    onToast(chosenColor === 'transparent' ? '已移除该处高亮' : '高亮已保存到当前文档')
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

  const beginCropResize = (event: ReactPointerEvent<HTMLButtonElement>, handle: CropHandle) => {
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

  const moveCropResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    updateCropResize(event.clientX, event.clientY)
  }

  const finishCropResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    screenshotResizeRef.current = null
  }

  const resizeCropWithKeyboard = (event: ReactKeyboardEvent<HTMLButtonElement>, handle: CropHandle) => {
    if (!cropRect || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
    event.preventDefault()
    const step = event.shiftKey ? 10 : 2
    const dx = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0
    const dy = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0
    let left = cropRect.left
    let top = cropRect.top
    let right = cropRect.left + cropRect.width
    let bottom = cropRect.top + cropRect.height
    if (handle.includes('w')) left = Math.min(right - 12, Math.max(0, left + dx))
    if (handle.includes('e')) right = Math.max(left + 12, Math.min(window.innerWidth, right + dx))
    if (handle.includes('n')) top = Math.min(bottom - 12, Math.max(0, top + dy))
    if (handle.includes('s')) bottom = Math.max(top + 12, Math.min(window.innerHeight, bottom + dy))
    setCropRect({ left, top, width: right - left, height: bottom - top })
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
    try {
      const blob = await captureViewportCrop(cropRect)
      const imageUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(blob)
      })
      const anchor = `【截图笔记 · 第${page}页 · ${currentSectionTitle}】`
      cancelScreenshot()
      if (editingNoteId == null) noteDraftBaselineRef.current = JSON.stringify({ pending: '', text: '', images: [] })
      setUploadedNoteImages((current) => editingNoteId != null ? [...current, imageUrl].slice(0, 3) : [imageUrl])
      setEditingNoteId((current) => current ?? 0)
      setEditingNoteText('')
      setPendingAddedNote((current) => current.trim() ? current : anchor)
      setNoteEditStage(4)
      setLeftPanel('notes')
      if (leftOverlayLayout) setMobileLeftOpen(true)
      onToast(editingNoteId != null ? '截图已添加到笔记草稿' : '截图已生成，可补充说明后保存')
    } catch (error) {
      console.error('Screenshot generation failed', error)
      onToast('截图生成失败，请重新选择')
    }
  }

  const downloadScreenshot = async () => {
    if (!cropRect) return
    try {
      downloadLocalBlob(await captureViewportCrop(cropRect), `${safeFileName(documentTitle)}-第${page}页截图.png`)
      onToast('截图已下载')
    } catch (error) {
      console.error('Screenshot download failed', error)
      onToast('截图下载失败')
    }
  }

  const startEditingNote = (note: ReadingNote) => {
    const images = note.imageDataUrls?.slice(0, 3) ?? []
    noteDraftBaselineRef.current = JSON.stringify({ pending: note.excerpt, text: '', images })
    setEditingNoteId(note.id)
    setEditingNoteText('')
    setPendingAddedNote(note.excerpt)
    setNoteDetailId(null)
    setLeftPanel('notes')
    if (leftOverlayLayout) setMobileLeftOpen(true)
    setNoteEditStage(4)
    setUploadedNoteImages(images)
    setNoteEditorExpanded(false)
  }

  const openNoteEditor = (source: 'selection' | 'translation' | 'explanation') => {
    const anchor = `【第${page}页 · ${noteSelection?.sectionTitle || currentSectionTitle}】`
    noteDraftBaselineRef.current = JSON.stringify({ pending: '', text: '', images: [] })
    setEditingNoteId(0)
    setEditingNoteText('')
    setPendingAddedNote(`${anchor}\n${source === 'translation' ? selectionAid.translation : source === 'explanation' ? selectionAid.definition : noteSelection?.text ?? ''}`.trim())
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

  function discardEditedNote(announce = true) {
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
    setEditingNoteText('')
    setUploadedNoteImages([])
    noteDraftBaselineRef.current = JSON.stringify({ pending: '', text: '', images: [] })
    if (announce) onToast('已放弃未保存的笔记修改')
  }

  const commitEditedNote = () => {
    if (editingNoteId == null) return true
    const value = editingNoteText.trim() || pendingAddedNote.trim()
    if (!value) {
      onToast('请先输入笔记内容')
      noteTextareaRef.current?.focus({ preventScroll: true })
      return false
    }
    const imageDataUrls = uploadedNoteImages.slice(0, 3)
    const wasNew = editingNoteId === 0
    const didPersist = wasNew
      ? onNotesChange([...notes, {
          id: Math.max(0, ...notes.map((note) => note.id)) + 1,
          title: value.replace(/^【[^】]+】\s*/, '').slice(0, 18) || '阅读笔记',
          excerpt: value,
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
          color: highlightColors[highlightColorIndex],
          ...(imageDataUrls.length > 0 ? { imageDataUrls } : {}),
        }])
      : onNotesChange(notes.map((note) => note.id === editingNoteId ? {
          ...note,
          title: value.replace(/^【[^】]+】\s*/, '').slice(0, 18) || '阅读笔记',
          excerpt: value,
          imageDataUrls: imageDataUrls.length > 0 ? imageDataUrls : undefined,
        } : note))
    if (!didPersist) return false
    discardEditedNote(false)
    onToast(wasNew ? '笔记已保存' : '笔记已更新')
    return true
  }

  const addNoteDraft = () => {
    const value = editingNoteText.trim()
    if (!value) return
    setPendingAddedNote(value)
    setEditingNoteText('')
    setNoteEditStage(4)
  }

  const uploadNoteImages = async (files: FileList | null) => {
    if (!files?.length) return
    const accepted = Array.from(files).filter((file) => file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024).slice(0, 3)
    if (accepted.length === 0) {
      onToast('仅支持单张 2 MB 以内的图片')
      return
    }
    const images = await Promise.all(accepted.map((file) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    }))).catch(() => [])
    if (images.length === 0) {
      onToast('图片读取失败，请重新选择')
      return
    }
    setUploadedNoteImages(images)
    setNoteEditStage((stage) => Math.max(stage, 3))
  }

  useEffect(() => {
    onEditingNoteChange(noteDraftDirty, noteDraftDirty ? { save: commitEditedNote, discard: () => discardEditedNote(false) } : undefined)
    return () => onEditingNoteChange(false)
  }, [noteDraftDirty, onEditingNoteChange])

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
      paperAnalysis.metadata.abstract,
      '',
      ...activeArticleSections.flatMap((section) => [
        section.title,
        ...section.parts.flatMap((part) => [part.title, part.body].filter(Boolean)),
        '',
      ]),
      '参考文献',
      ...paperAnalysis.references.map((reference, index) => `[${index + 1}] ${reference.authors.join(', ')}. ${reference.title}. ${reference.journal}, ${reference.publicationDate}. DOI: ${reference.doi}`),
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
        markersVisible,
        pageLayout,
        savedAt: new Date().toISOString(),
      }))
      onToast('阅读进度已保存')
    } catch {
      onToast('阅读进度保存失败')
    }
  }

  const selectInsightPanel = (panel: InsightPanel) => {
    setRightPanel(panel)
    if (panel === 'charts' && paperAnalysis.figures[0]) {
      setSelectedFigureId(paperAnalysis.figures[0].id)
      goToPage(paperAnalysis.figures[0].page, {
        sectionTitle: resolvePaperSection(paperAnalysis, paperAnalysis.figures[0].sectionId),
        label: '打开图表解析前',
      })
    }
  }

  const requestDocumentSelection = (documentId: number) => {
    if (documentId === activeDocumentId) {
      setDocumentMenuOpen(false)
      documentTriggerRef.current?.focus({ preventScroll: true })
      return
    }
    setDocumentMenuOpen(false)
    if (noteDraftDirty) {
      setPendingDocumentId(documentId)
      return
    }
    onSelectDocument(documentId)
  }

  const finishDraftGuard = (choice: 'save' | 'discard' | 'continue') => {
    const targetDocumentId = pendingDocumentId
    if (choice === 'continue') {
      setPendingDocumentId(null)
      window.requestAnimationFrame(() => noteTextareaRef.current?.focus({ preventScroll: true }))
      return
    }
    if (choice === 'save' && !commitEditedNote()) return
    if (choice === 'discard') discardEditedNote(false)
    setPendingDocumentId(null)
    if (targetDocumentId != null && targetDocumentId > 0) onSelectDocument(targetDocumentId)
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
            ref={documentTriggerRef}
            type="button"
            className="reading-document-title"
            aria-haspopup="menu"
            aria-expanded={documentMenuOpen}
            aria-controls="reading-document-menu"
            onClick={() => setDocumentMenuOpen((open) => !open)}
          >
            <span>{documentTitle}</span><span className={`reading-chevron${documentMenuOpen ? ' is-open' : ''}`} aria-hidden="true" />
          </button>
          {documentMenuOpen && (
            <div ref={documentMenuRef} className="reading-document-menu" id="reading-document-menu" role="menu" aria-label="切换阅读文献">
              {documents.map((readingDocument, index) => (
                <button
                  ref={(node) => { documentMenuItemRefs.current[index] = node }}
                  type="button"
                  role="menuitemradio"
                  aria-checked={readingDocument.id === activeDocumentId}
                  tabIndex={index === documentMenuActiveIndex ? 0 : -1}
                  onFocus={() => setDocumentMenuActiveIndex(index)}
                  onKeyDown={(event) => handleDocumentMenuKeyDown(event, index)}
                  onClick={() => requestDocumentSelection(readingDocument.id)}
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
          <button ref={(node) => { leftTabRefs.current[0] = node }} type="button" id="reading-left-tab-outline" role="tab" aria-controls="reading-left-panel-outline" aria-selected={leftPanel === 'outline'} aria-expanded={leftOverlayLayout ? mobileLeftOpen && leftPanel === 'outline' : undefined} tabIndex={leftPanel === 'outline' ? 0 : -1} className={leftPanel === 'outline' ? 'is-active' : ''} onClick={() => selectLeftPanel('outline')} onKeyDown={(event) => handleLeftTabKeyDown(event, 0)} aria-label="目录">
            <img src={leftPanel === 'outline' ? '/assets/reading/outline.svg' : '/assets/reading/outline-inactive.svg'} alt="" />
          </button>
          <button ref={(node) => { leftTabRefs.current[1] = node }} type="button" id="reading-left-tab-thumbnails" role="tab" aria-controls="reading-left-panel-thumbnails" aria-selected={leftPanel === 'thumbnails'} aria-expanded={leftOverlayLayout ? mobileLeftOpen && leftPanel === 'thumbnails' : undefined} tabIndex={leftPanel === 'thumbnails' ? 0 : -1} className={leftPanel === 'thumbnails' ? 'is-active' : ''} onClick={() => selectLeftPanel('thumbnails')} onKeyDown={(event) => handleLeftTabKeyDown(event, 1)} aria-label="缩略图">
            <img src={leftPanel === 'thumbnails' ? '/assets/reading/thumbnails-active.svg' : '/assets/reading/thumbnails.svg'} alt="" />
          </button>
          <button ref={(node) => { leftTabRefs.current[2] = node }} type="button" id="reading-left-tab-notes" role="tab" aria-controls="reading-left-panel-notes" aria-selected={leftPanel === 'notes'} aria-expanded={leftOverlayLayout ? mobileLeftOpen && leftPanel === 'notes' : undefined} tabIndex={leftPanel === 'notes' ? 0 : -1} className={leftPanel === 'notes' ? 'is-active' : ''} onClick={() => selectLeftPanel('notes')} onKeyDown={(event) => handleLeftTabKeyDown(event, 2)} aria-label="笔记">
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
                    目录解析 · {paperAnalysis.outline.length} 节<span className={`reading-inline-chevron${outlineMainExpanded ? '' : ' is-right'}`} aria-hidden="true" />
                  </button>
                  <div className={`reading-outline-collapse${outlineMainExpanded ? ' is-expanded' : ''}`} id="reading-outline-main-sections" aria-hidden={!outlineMainExpanded} inert={outlineMainExpanded ? undefined : true}>
                    <div>
                      {paperAnalysis.outline.filter((section) => section.kind !== 'references').map((section) => {
                        const target = resolvePaperSection(paperAnalysis, section.id)
                        return <div className="reading-outline-group" key={section.id}>
                          <button type="button" className={section.level === 2 ? 'is-child' : ''} onClick={() => goToPage(section.page, { sectionTitle: target, label: section.title })}>
                            <span>{section.title}</span><small>第{section.page}页</small>
                          </button>
                        </div>
                      })}
                    </div>
                  </div>
                </div>
                <div className="reading-outline-disclosure">
                  <button type="button" className="reading-outline-static is-emphasis" onClick={() => { setRightPanel('references'); const section = paperAnalysis.outline.find((item) => item.kind === 'references'); if (section) goToPage(section.page, { sectionTitle: resolvePaperSection(paperAnalysis, section.id), label: '参考文献' }) }}>
                    参考文献 · {paperAnalysis.references.length} 条<span className="reading-inline-chevron is-right" aria-hidden="true" />
                  </button>
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
                    {noteAnchor(note.excerpt) && <small className="reading-note-anchor">来源：第{noteAnchor(note.excerpt)?.page}页 · {noteAnchor(note.excerpt)?.sectionTitle}</small>}
                    {note.imageDataUrls && note.imageDataUrls.length > 0 && <div className="reading-note-card-images">{note.imageDataUrls.map((src, index) => <img src={src} alt={`笔记附图 ${index + 1}`} key={`${note.id}-${index}`} />)}</div>}
                    <footer><button type="button" onClick={(event) => { noteDetailReturnFocusRef.current = event.currentTarget; setNoteDetailId(note.id) }}>详情</button>{noteAnchor(note.excerpt) && <button type="button" onClick={() => { const anchor = noteAnchor(note.excerpt); if (anchor) goToPage(anchor.page, { sectionTitle: anchor.sectionTitle, label: '笔记定位前' }) }}>定位</button>}<span /> <button type="button" onClick={() => startEditingNote(note)}>编辑</button></footer>
                  </div>
                </article>
              )) : <div className="reading-notes-empty"><div><img src="/assets/reading/notes-empty.svg" alt="" /><span>暂无笔记</span></div><p>请 <button type="button" onClick={activateNoteTool}>唤醒笔记</button> 进行添加</p></div>) : (
                <article className={`reading-note-edit-card${noteEditorExpanded ? ' is-expanded' : ''}`}>
                  <span className="reading-note-color" style={{ background: notes.find((note) => note.id === editingNoteId)?.color ?? '#FFE4BA' }} />
                  <header><strong>{notes.find((note) => note.id === editingNoteId)?.title ?? '新建阅读笔记'}</strong></header>
                  {noteEditStage >= 1 && <div className="reading-note-source">
                    <section><b>来源 / 本地辅助释义：</b><p>{pendingAddedNote}</p></section>
                    {noteEditStage >= 2 && <section><b>说明：</b><p>本地辅助释义不调用外部 AI，请结合所定位的原文段落核对。</p></section>}
                    {noteEditStage >= 3 && uploadedNoteImages.length > 0 && <section><b>图片：</b><div className="reading-note-images">{uploadedNoteImages.map((src, index) => <span className={`reading-note-image-tile reading-note-image-tile--${index + 1}`} key={`${src.slice(0, 48)}-${index}`}><img src={src} alt={`笔记图片 ${index + 1}`} /></span>)}</div></section>}
                    {noteEditStage >= 4 && pendingAddedNote && <section><b>笔记：</b><p className="reading-note-existing">{pendingAddedNote}</p></section>}
                  </div>}
                  <div className="reading-note-compose">
                    <textarea ref={noteTextareaRef} value={editingNoteText} onChange={(event) => setEditingNoteText(event.target.value)} placeholder="输入笔记内容" aria-label="编辑笔记内容" />
                    <input ref={noteImageInputRef} className="reading-note-image-input" type="file" accept="image/*" multiple onChange={(event) => { void uploadNoteImages(event.target.files); event.target.value = '' }} />
                    <div className="reading-note-editor-tools"><span><button type="button" aria-label="翻译笔记" onClick={() => setNoteEditStage((stage) => Math.max(stage, 1))}><img src="/assets/reading/editor-translate.svg" alt="" /></button><button type="button" aria-label="AI 解释笔记" onClick={() => setNoteEditStage((stage) => Math.max(stage, 2))}><img src="/assets/reading/editor-ai.svg" alt="" /></button><button type="button" aria-label="插入笔记图片" onClick={() => noteImageInputRef.current?.click()}><img src="/assets/reading/editor-image.svg" alt="" /></button></span><button type="button" onClick={addNoteDraft}>添加</button></div>
                  </div>
                  <footer><button type="button" onClick={() => noteDraftDirty ? setPendingDocumentId(-1) : discardEditedNote(false)}>取消</button><button type="button" onClick={commitEditedNote}>保存</button></footer>
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
          <div ref={paperZoomStageRef} className={`reading-paper-zoom-stage${pageLayout === 'double' ? ' is-double' : ''}`} style={{ '--paper-scale': zoom / 100, width: (pageLayout === 'double' ? 1640 : 812) * zoom / 100, minHeight: 2246 * zoom / 100 } as CSSProperties}>
          <article
            className="reading-paper"
            ref={paperRef}
          >
            <img className="reading-paper-figma-top" src="/assets/reading/paper-top.png" alt="" />
            <div className="reading-paper-page-number">第 {page} 页 / {totalPages}</div>
            <div className="paper-masthead"><span>{paperAnalysis.metadata.journal}</span><span>DOI: {paperAnalysis.metadata.doi}</span></div>
            <header className="paper-title-block">
              <h1>{paperAnalysis.metadata.title}</h1>
              <p>{paperAnalysis.metadata.authors.map((author) => author.name).join('｜')}</p>
              <small>{paperAnalysis.metadata.affiliations.map((affiliation) => affiliation.name).join('｜')}</small>
            </header>
            <section className="paper-abstract" data-section="摘要">
              <h2>摘要</h2>
              <p
                data-note-selectable="true"
                onMouseDown={(event) => beginPaperRange(event, '摘要')}
                onMouseUp={(event) => selectPaperRange(event, '摘要')}
                onClick={(event) => hitPaperLine(event, '摘要')}
                tabIndex={activeTool === 'note' ? 0 : undefined}
                onKeyDown={(event) => selectPaperLineWithKeyboard(event, '摘要')}
              >{renderSelectableText(paperAnalysis.metadata.abstract, '摘要')}</p>
              {markersVisible && paperAnalysis.references.flatMap((reference) => reference.citationAnchors).filter((anchor) => resolvePaperSection(paperAnalysis, anchor.sectionId) === '摘要').map((anchor) => <button type="button" className="reading-paper-marker is-reference" key={anchor.id} onClick={() => { setSelectedReferenceId(anchor.referenceId); setRightPanel('references'); setMobileInsightsOpen(compactLayout) }}>{anchor.marker} 查看引文</button>)}
            </section>
            <div className="paper-body">
              {activeArticleSections.map((section) => (
                <section data-section={section.title.replace(/[^\d\u4e00-\u9fa5]/g, '')} key={section.title}>
                  <h2>{section.title}</h2>
                  {section.parts.map((part) => (
                    <div data-section={part.title.replace(/[^\d\u4e00-\u9fa5]/g, '')} key={part.title || section.title}>
                      {part.title && <h3>{part.title}</h3>}
                      <p data-note-selectable="true" tabIndex={activeTool === 'note' ? 0 : undefined} onKeyDown={(event) => selectPaperLineWithKeyboard(event, part.title || section.title)} onMouseDown={(event) => beginPaperRange(event, part.title || section.title)} onMouseUp={(event) => selectPaperRange(event, part.title || section.title)} onClick={(event) => hitPaperLine(event, part.title || section.title)} className={[
                        locatedResult != null && (part.title || section.title) === locatedSectionTitle ? 'paper-selected-line is-located' : '',
                      ].filter(Boolean).join(' ')}>{renderSelectableText(part.body, part.title || section.title)}</p>
                      {markersVisible && <div className="reading-paper-markers">
                        {paperAnalysis.references.flatMap((reference) => reference.citationAnchors).filter((anchor) => resolvePaperSection(paperAnalysis, anchor.sectionId) === (part.title || section.title)).map((anchor) => <button type="button" className="reading-paper-marker is-reference" key={anchor.id} onClick={() => { setSelectedReferenceId(anchor.referenceId); setRightPanel('references'); setMobileInsightsOpen(compactLayout) }}>{anchor.marker} 引文</button>)}
                        {paperAnalysis.figures.filter((figure) => resolvePaperSection(paperAnalysis, figure.sectionId) === (part.title || section.title)).map((figure) => <button type="button" className="reading-paper-marker is-figure" key={figure.id} onClick={() => { setSelectedFigureId(figure.id); setRightPanel('charts'); setMobileInsightsOpen(compactLayout) }}>{figure.label} {figure.kind === 'table' ? '表格' : '图表'}</button>)}
                      </div>}
                      {part.title === '2.2.表征手段' && <div className="reading-paper-chart" aria-label="不同循环次数下的比容量对比图">{[42, 64, 78, 61, 72, 88, 66].map((height, index) => <i style={{ height }} className={index === 5 ? 'is-dark' : ''} key={index} />)}<small>图3. 不同循环次数下的比容量对比（mAh g⁻¹）</small></div>}
                    </div>
                  ))}
                </section>
              ))}
            </div>
            <footer className="paper-keywords">关键词：{paperAnalysis.metadata.keywords.join(' · ')}</footer>
          </article>
          {pageLayout === 'double' && <article className="reading-paper reading-paper--companion" aria-label={`第 ${Math.min(totalPages, page + 1)} 页对页预览`}>
            <div className="reading-paper-page-number">第 {Math.min(totalPages, page + 1)} 页 / {totalPages}</div>
            <div className="paper-masthead"><span>{paperAnalysis.metadata.journal}</span><span>对页预览</span></div>
            <header className="paper-title-block"><h1>{paperAnalysis.outline.find((section) => section.page >= page)?.title ?? '研究内容续页'}</h1></header>
            <section className="paper-abstract"><h2>增强阅读提示</h2><p>双页模式已开启。目录、引文与图表定位仍以左页为当前操作页；使用页码输入或翻页按钮可继续浏览。</p></section>
          </article>}
          </div>
        </div>

        <div className="reading-selection-toolbar" role="toolbar" aria-label="划词工具">
          <button ref={(node) => { selectionToolRefs.current[0] = node; searchToolRef.current = node }} type="button" aria-label="AI检索" aria-pressed={activeTool === 'search'} className={activeTool === 'search' ? 'is-active' : ''} onKeyDown={(event) => handleSelectionToolbarKeyDown(event, 0)} onClick={activateSearch}><span className="reading-search-tool-glyph" aria-hidden="true" /></button>
          <span />
          <button ref={(node) => { selectionToolRefs.current[1] = node }} type="button" aria-label="标注与添加笔记" aria-pressed={activeTool === 'note'} className={activeTool === 'note' ? 'is-active' : ''} onKeyDown={(event) => handleSelectionToolbarKeyDown(event, 1)} onClick={activateNoteTool}><span className="reading-note-tool-glyph" aria-hidden="true" /></button>
          <span />
          <button ref={(node) => { selectionToolRefs.current[2] = node }} type="button" aria-label="截图" aria-pressed={activeTool === 'screenshot'} className={activeTool === 'screenshot' ? 'is-active' : ''} onKeyDown={(event) => handleSelectionToolbarKeyDown(event, 2)} onClick={activateScreenshotTool}><span className="reading-camera-tool-glyph" aria-hidden="true" /></button>
        </div>
        {activeTool === 'screenshot' && contextAction !== 'screenshot' && <button type="button" className="reading-screenshot-keyboard-capture" onClick={createKeyboardScreenshotSelection}>截取当前阅读区</button>}

        {activeTool === 'screenshot' && contextAction !== 'screenshot' && screenshotPointer && !screenshotDragStart && (
          <div className="reading-screenshot-crosshair" style={{ left: screenshotPointer.localX, top: screenshotPointer.localY }} aria-hidden="true"><i /><i /><small>坐标　{Math.round(screenshotPointer.clientX)}, {Math.round(screenshotPointer.clientY)}<br />色值　#E5E6EB</small></div>
        )}
        {activeTool === 'screenshot' && screenshotDragStart && cropRect && (
          createPortal(<div className="reading-screenshot-drag-rect" style={{ left: cropRect.left, top: cropRect.top, width: cropRect.width, height: cropRect.height }} aria-hidden="true" />, document.body)
        )}

        {contextAction === 'highlight' && (
          <div ref={contextMenuRef} className="reading-context-menu" role="menu" aria-label="段落标注操作" style={{ left: contextMenuPosition.left, top: contextMenuPosition.top, right: 'auto' }} onKeyDown={handleContextMenuKeyDown} onMouseDown={(event) => event.preventDefault()}>
            <button type="button" onClick={showTranslation}>翻译</button>
            <button type="button" onClick={showExplanation}>解释</button>
            <button type="button" className="reading-context-color" aria-label="选择背景颜色" onClick={() => setColorMenuOpen((open) => !open)}><i style={{ background: highlightColors[highlightColorIndex] }} /><span className={`reading-inline-chevron${colorMenuOpen ? ' is-up' : ''}`} aria-hidden="true" /></button>
            <span />
            <button type="button" className="reading-context-note" aria-label="添加笔记" onClick={startAddingNote}><img src="/assets/reading/note-tool.svg" alt="" /></button>
          </div>
        )}
        {contextAction === 'highlight' && colorMenuOpen && <div className="reading-color-palette" style={{ left: Math.max(8, contextMenuPosition.left - 54), top: contextMenuPosition.top + 32, right: 'auto' }}><strong>背景颜色（自动保存）</strong><div>{highlightColors.map((color, index) => <button type="button" className={highlightColorIndex === index ? 'is-active' : ''} style={{ background: color === 'transparent' ? '#fff' : color }} aria-label={color === 'transparent' ? '移除高亮' : `背景色 ${index + 1}`} onClick={() => applyHighlightColor(index)} key={`${color}-${index}`} />)}</div></div>}
        {(resultCards.translationVisible || resultCards.explanationVisible) && contextAction !== 'highlight' && contextAction !== 'screenshot' && (
          <div className="reading-result-stack">
            {resultCards.translationVisible && (
              <div className={`reading-float-card reading-float-card--translate${resultCards.translationExpanded ? '' : ' reading-float-card--collapsed'}`}>
                <header><strong><span className="reading-result-title-icon" aria-hidden="true" />本地辅助释义</strong><button type="button" className="reading-icon-close" aria-label="关闭本地辅助释义" onClick={() => closeResultCard('translation')} /></header>
                {resultCards.translationExpanded && <><p><b>选中原文：</b>{noteSelection?.text}</p><div className="reading-translation"><b>本地词典：</b>{selectionAid.translation}</div><small className="reading-local-aid-notice">未连接外部翻译服务，结果需结合原文核对。</small></>}
                <footer><button type="button" onClick={() => void copyText(selectionAid.translation, '释义已复制')}>复制释义</button><button type="button" onClick={() => openNoteEditor('translation')}>添加笔记</button><span /><button type="button" className="reading-result-toggle" aria-label={resultCards.translationExpanded ? '收起本地辅助释义' : '展开本地辅助释义'} onClick={() => toggleResultCard('translation')}><img className={resultCards.translationExpanded ? '' : 'is-collapsed'} src="/assets/reading/result-toggle.svg" alt="" /></button></footer>
              </div>
            )}
            {resultCards.explanationVisible && (
              <div className={`reading-float-card reading-float-card--explain${resultCards.explanationExpanded ? '' : ' reading-float-card--collapsed'}`}>
                <header><strong><span className="reading-result-title-icon" aria-hidden="true" />本地概念解释</strong><button type="button" className="reading-icon-close" aria-label="关闭本地概念解释" onClick={() => closeResultCard('explanation')} /></header>
                {resultCards.explanationExpanded && <><p><b>选中原文：</b>{noteSelection?.text}</p><div className="reading-ai-explain"><b>解释：</b>{selectionAid.definition}</div><small className="reading-local-aid-notice">本地辅助释义 · 不调用外部 AI</small></>}
                <footer><button type="button" onClick={() => void copyText(selectionAid.definition, '解释已复制')}>复制解释</button><button type="button" onClick={() => openNoteEditor('explanation')}>添加笔记</button><span /><button type="button" className="reading-result-toggle" aria-label={resultCards.explanationExpanded ? '收起本地概念解释' : '展开本地概念解释'} onClick={() => toggleResultCard('explanation')}><img className={resultCards.explanationExpanded ? '' : 'is-collapsed'} src="/assets/reading/result-toggle.svg" alt="" /></button></footer>
              </div>
            )}
          </div>
        )}
        {contextAction === 'screenshot' && cropRect && (
          createPortal(<div className="reading-screenshot-layer" role="dialog" aria-modal="true" aria-label="调整截图选区"><div className="reading-crop-area" style={{ left: cropRect.left, top: cropRect.top, width: cropRect.width, height: cropRect.height }}>{(['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as CropHandle[]).map((handle) => <button type="button" className={`reading-crop-handle is-${handle}`} aria-label={`调整${handle}方向选区，方向键微调`} onKeyDown={(event) => resizeCropWithKeyboard(event, handle)} onPointerDown={(event) => beginCropResize(event, handle)} onPointerMove={moveCropResize} onPointerUp={finishCropResize} onPointerCancel={finishCropResize} key={handle} />)}<div className={`reading-crop-actions${cropRect.top + cropRect.height + 36 > window.innerHeight ? ' is-above' : ''}`} role="toolbar" aria-label="截图操作"><button ref={cropActionFirstRef} type="button" aria-label="下载截图" onClick={() => void downloadScreenshot()}><img src="/assets/reading/download.svg" alt="" /></button><span /><button type="button" aria-label="取消截图" onClick={cancelScreenshot}><span className="reading-icon-close" /></button><button type="button" aria-label="完成截图" onClick={() => void completeScreenshot()}><img src="/assets/selected-check.svg" alt="" /></button></div></div></div>, document.body)
        )}
      </main>

      {searchOpen && (
        <aside ref={searchDrawerRef} className="reading-search-drawer" role="dialog" aria-modal="true" aria-labelledby="reading-search-title" tabIndex={-1}>
          <header><span id="reading-search-title">AI检索</span><button type="button" className="reading-icon-close" aria-label="关闭 AI 检索抽屉" onClick={closeSearchDrawer} /></header>
          <div className="reading-search-controls">
            <div className="reading-search-mode">
              <button ref={searchModeTriggerRef} type="button" className={searchModeOpen ? 'is-open' : ''} aria-haspopup="menu" aria-expanded={searchModeOpen} onClick={() => { const index = ['全文搜索', '智能关联', 'AI语义', '关键词'].indexOf(searchMode); setSearchModeActiveIndex(index); setSearchModeOpen((open) => !open); window.requestAnimationFrame(() => searchModeItemRefs.current[index]?.focus({ preventScroll: true })) }}>{searchMode}<span className={`reading-inline-chevron${searchModeOpen ? ' is-up' : ''}`} aria-hidden="true" /></button>
              {searchModeOpen && <div className="reading-search-mode-menu" role="menu" aria-label="检索模式">{(['全文搜索', '智能关联', 'AI语义', '关键词'] as const).map((mode, index) => <button ref={(node) => { searchModeItemRefs.current[index] = node }} type="button" role="menuitemradio" aria-checked={searchMode === mode} tabIndex={index === searchModeActiveIndex ? 0 : -1} className={searchMode === mode ? 'is-active' : ''} onFocus={() => setSearchModeActiveIndex(index)} onKeyDown={(event) => handleSearchModeKeyDown(event, index)} onClick={() => { setSearchMode(mode); setSearchModeOpen(false); searchModeTriggerRef.current?.focus({ preventScroll: true }) }} key={mode}>{mode}</button>)}</div>}
            </div>
            <div className="reading-search-input"><input ref={searchInputRef} aria-label="搜索当前文献" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') submitSearch() }} placeholder="请输入" /><button type="button" aria-label="提交检索" disabled={!searchQuery.trim()} onClick={submitSearch}><img src="/assets/reading/search-submit.svg" alt="" /></button></div>
          </div>
          <p className="reading-search-help"><span>i</span><b>{searchMode}：</b>{searchMode === '全文搜索' ? '在整个文档中搜索匹配的关键词，显示所有包含该词的段落' : '根据当前语义在论文中发现相关内容与概念'}</p>
          {!searchedQuery ? <div className="reading-search-empty"><img src="/assets/reading/ai-empty.png" alt="" /><p>支持全文搜索、智能关联、AI语义、关键词四种模式</p></div> : searchResults.length === 0 ? (
            <div className="reading-search-empty" role="status"><img src="/assets/reading/ai-empty.png" alt="" /><p>未找到“{searchedQuery}”，可缩短关键词或切换 AI 语义模式。</p></div>
          ) : <div className="reading-search-results"><h3 role="status">检索 <b>{searchResults.length}</b> 个结果</h3>{searchResults.map((result, index) => {
            const aid = localLanguageAid(`${result.label} ${result.snippet}`)
            return <article className={translatedResult === index || definedResult === index ? 'is-translated' : ''} key={result.id}>
              <header><span /><strong>{result.label}</strong><small>第{result.page}页</small></header>
              <p><mark>{searchedQuery}</mark> · {result.snippet}</p>
              {translatedResult === index && <div className="reading-search-translation"><header><b>本地辅助释义：</b><span><button type="button" onClick={() => void copyText(aid.translation, '释义已复制')}>复制</button><button type="button" className="reading-icon-close" aria-label="关闭释义" onClick={() => setTranslatedResult(null)} /></span></header><p>{aid.translation}</p><small>本地词典结果，不调用外部 AI。</small></div>}
              {definedResult === index && <div className="reading-search-translation"><header><b>概念定义：</b><button type="button" className="reading-icon-close" aria-label="关闭定义" onClick={() => setDefinedResult(null)} /></header><p>{aid.definition}</p><small>本地辅助释义，请结合原文核对。</small></div>}
              <footer><button type="button" aria-expanded={translatedResult === index} onClick={() => { setTranslatedResult((current) => current === index ? null : index); setDefinedResult(null) }}>释义</button><button type="button" aria-expanded={definedResult === index} onClick={() => { setDefinedResult((current) => current === index ? null : index); setTranslatedResult(null) }}>定义</button><span /><button type="button" onClick={() => locateSearchResult(index, result)}>定位</button></footer>
            </article>
          })}</div>}
          {locatedResult != null && <button type="button" className="reading-location-tip" onClick={returnFromLocation}>取消定位，返回原处</button>}
        </aside>
      )}

      {detailedNote && (
        <section ref={noteDetailRef} className="reading-note-detail" role="dialog" aria-modal="true" aria-labelledby="reading-note-detail-title" tabIndex={-1}>
          <header><h2 id="reading-note-detail-title">笔记详情</h2><button type="button" className="reading-icon-close" aria-label="关闭笔记详情" onClick={() => setNoteDetailId(null)} /></header>
          <div className="reading-note-detail-title"><i />{detailedNote.title}</div>
          <dl>
            {noteAnchor(detailedNote.excerpt) && <div><dt>来源</dt><dd>第{noteAnchor(detailedNote.excerpt)?.page}页 · {noteAnchor(detailedNote.excerpt)?.sectionTitle}</dd><button type="button" onClick={() => { const anchor = noteAnchor(detailedNote.excerpt); if (anchor) { setNoteDetailId(null); goToPage(anchor.page, { sectionTitle: anchor.sectionTitle, label: '笔记详情定位前' }) } }}>定位</button></div>}
            <div><dt>笔记</dt><dd className="reading-note-detail-copy">{detailedNote.excerpt}</dd><button type="button" onClick={() => void copyText(detailedNote.excerpt, '笔记已复制')}>复制</button></div>
            {detailedNote.imageDataUrls && detailedNote.imageDataUrls.length > 0 && <div><dt>附图</dt><dd className="reading-note-detail-images">{detailedNote.imageDataUrls.map((src, index) => <img src={src} alt={`笔记附图 ${index + 1}`} key={`${detailedNote.id}-${index}`} />)}</dd><span /></div>}
            <div><dt>保存时间</dt><dd>{detailedNote.createdAt || '历史笔记 · 时间未记录'}</dd><span /></div>
          </dl>
          <footer><button type="button" onClick={() => { setNoteDetailId(null); startEditingNote(detailedNote) }}>编辑</button><button type="button" className="is-danger" onClick={() => setPendingDeleteNoteId(detailedNote.id)}>删除</button></footer>
        </section>
      )}

      <aside className={`reading-right-panel${mobileInsightsOpen ? ' is-mobile-open' : ''}`} aria-hidden={compactLayout && !mobileInsightsOpen} inert={compactLayout && !mobileInsightsOpen ? true : undefined}>
        <button type="button" className="reading-mobile-insight-close reading-icon-close" aria-label="关闭智能解读面板" onClick={() => setMobileInsightsOpen(false)} />
        <div className="reading-insight-tabs" role="tablist" aria-label="智能阅读分析">
          {insightTabs.map((tab, index) => <button ref={(node) => { rightTabRefs.current[index] = node }} type="button" id={`reading-insight-tab-${tab.id}`} role="tab" aria-controls={`reading-insight-panel-${tab.id}`} aria-selected={rightPanel === tab.id} tabIndex={rightPanel === tab.id ? 0 : -1} className={rightPanel === tab.id ? 'is-active' : ''} onClick={() => selectInsightPanel(tab.id)} onKeyDown={(event) => handleRightTabKeyDown(event, index)} key={tab.id}>{tab.label}</button>)}
        </div>
        <div className="reading-insight-content" id={`reading-insight-panel-${rightPanel}`} role="tabpanel" aria-labelledby={`reading-insight-tab-${rightPanel}`}>
          {rightPanel === 'ai' && (
            <div className="reading-ai-panel">
              <article className="reading-insight-card reading-insight-card--summary"><h3>解析摘要</h3><p>{paperAnalysis.metadata.abstract}</p></article>
              <article className="reading-insight-card reading-insight-card--contribution"><h3>核心信息</h3><p>{paperAnalysis.metadata.researchField} · {paperAnalysis.metadata.keywords.join('、')}</p></article>
              <article className="reading-insight-card reading-insight-card--innovation"><h3>关键贡献</h3><ul>{paperAnalysis.outline.filter((section) => section.kind === 'body').slice(0, 3).map((section) => <li key={section.id}>{section.excerpt}</li>)}</ul></article>
              <article className="reading-insight-card reading-insight-card--limit"><h3>核验提示</h3><ul><li>当前解读来自本地结构化解析，请结合定位后的正文、引文与图表复核。</li></ul></article>
              {aiExchange && <article className="reading-ai-exchange" aria-live="polite"><p className="reading-ai-exchange-question">{aiExchange.question}</p><p className="reading-ai-exchange-answer">{aiExchange.answer}</p></article>}
            </div>
          )}
          {rightPanel === 'charts' && <ReadingCharts figures={paperAnalysis.figures} selectedId={selectedFigureId} onSelect={setSelectedFigureId} onExport={exportChart} onLocate={(figure) => goToPage(figure.page, { sectionTitle: resolvePaperSection(paperAnalysis, figure.sectionId), label: `${figure.label}定位前` })} />}
          {rightPanel === 'references' && <ReadingReferences references={paperAnalysis.references} selectedId={selectedReferenceId} onSelect={setSelectedReferenceId} onLocate={(reference, anchorIndex) => { const anchor = reference.citationAnchors[anchorIndex]; if (anchor) goToPage(anchor.page, { sectionTitle: resolvePaperSection(paperAnalysis, anchor.sectionId), label: `${anchor.marker}定位前` }) }} />}
          {rightPanel === 'metadata' && <ReadingMetadata analysis={paperAnalysis} />}
          {rightPanel === 'graph' && <ReadingGraph analysis={paperAnalysis} onLocate={(targetPage, sectionId, label) => goToPage(targetPage, { sectionTitle: resolvePaperSection(paperAnalysis, sectionId), label })} />}
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

      {pendingDocumentId != null && (
        <Modal title="保存笔记草稿？" onClose={() => finishDraftGuard('continue')} hideFooter>
          <div className="reading-draft-guard">
            <p>当前笔记还有未保存的内容或图片。保存后继续，或明确放弃修改。</p>
            <div>
              <button className="button button--secondary" type="button" onClick={() => finishDraftGuard('continue')}>继续编辑</button>
              <button className="button button--danger" type="button" onClick={() => finishDraftGuard('discard')}>放弃修改</button>
              <button className="button button--primary" type="button" onClick={() => finishDraftGuard('save')}>保存并继续</button>
            </div>
          </div>
        </Modal>
      )}

      {pendingDeleteNoteId != null && (
        <Modal
          title="删除笔记"
          confirmText="删除"
          confirmDanger
          onClose={() => setPendingDeleteNoteId(null)}
          onSubmit={(event) => {
            event.preventDefault()
            if (!onNotesChange(notes.filter((note) => note.id !== pendingDeleteNoteId))) return
            setPendingDeleteNoteId(null)
            setNoteDetailId(null)
            onToast('笔记已删除')
          }}
        >
          <p>删除后将同时移除该笔记的正文摘录和附图，此操作无法撤销。</p>
        </Modal>
      )}

      <footer className="reading-footer">
        <div className="reading-page-controls">
          <button type="button" onClick={() => goToPage(1)} aria-label="第一页"><span className="reading-first-page-icon" /></button>
          <button type="button" onClick={() => goToPage(page - 1)} aria-label="上一页"><span className="pager-chevron pager-chevron--prev" /></button>
          <label className="reading-page-input"><span className="sr-only">跳转页码</span><input type="number" min="1" max={totalPages} value={pageInput} onChange={(event) => setPageInput(event.target.value)} onBlur={commitPageInput} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); commitPageInput() } }} aria-label={`跳转页码，共 ${totalPages} 页`} /><b>/{totalPages}</b></label>
          <button type="button" onClick={() => goToPage(page + 1)} aria-label="下一页"><span className="pager-chevron" /></button>
          <button type="button" onClick={() => goToPage(totalPages)} aria-label="最后一页"><span className="reading-last-page-icon" /></button>
          <button type="button" className="reading-back-first" disabled={locationDepth === 0} onClick={returnFromLocation}>返回上一位置{locationDepth > 0 ? ` (${locationDepth})` : ''}</button>
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
          <button className="reading-view-toggle" type="button" aria-pressed={markersVisible} onClick={() => setMarkersVisible((visible) => !visible)}>{markersVisible ? '隐藏标记' : '显示标记'}</button>
          <button className="reading-view-toggle" type="button" aria-pressed={pageLayout === 'double'} onClick={() => setPageLayout((layout) => layout === 'single' ? 'double' : 'single')}>{pageLayout === 'double' ? '双页' : '单页'}</button>
        </div>
      </footer>
    </section>
  )
}

function ReadingCharts({ figures, selectedId, onSelect, onExport, onLocate }: {
  figures: PaperFigure[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onExport: (title: string, index: number) => void
  onLocate: (figure: PaperFigure) => void
}) {
  return <div className="reading-figure-panel"><header><strong>图表提取</strong><span>{figures.length} 项</span></header><div>{figures.map((figure, index) => <article className={selectedId === figure.id ? 'is-selected' : ''} key={figure.id}><div className={`reading-figure-thumb reading-figure-thumb--${index % 3}`}><img src="/assets/reading/chart-exact.png" alt="" /></div><div><strong>{figure.label} · {figure.title}</strong><small>第{figure.page}页 · {figure.kind === 'table' ? '表格' : '图片'}</small>{selectedId === figure.id && <p>{figure.caption}<br />来源：{figure.sourceDescription}</p>}</div><footer><button type="button" onClick={() => { onSelect(figure.id); onLocate(figure) }}>定位</button><button type="button" onClick={() => onExport(`${figure.label}-${figure.title}`, index)}>导出</button></footer></article>)}</div></div>
}

function ReadingReferences({ references, selectedId, onSelect, onLocate }: {
  references: PaperReference[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onLocate: (reference: PaperReference, anchorIndex: number) => void
}) {
  const selected = references.find((reference) => reference.id === selectedId)
  if (selected) return <div className="reading-reference-panel reading-reference-detail"><header><button type="button" className="reading-panel-back" onClick={() => onSelect(null)}>← 返回文献列表</button><span>{selected.citationAnchors.length} 处引用</span></header><article><span>文献详情</span><strong>{selected.title}</strong><dl><div><dt>作者</dt><dd>{selected.authors.join('；')}</dd></div><div><dt>摘要</dt><dd>{selected.abstract}</dd></div><div><dt>期刊 / 日期</dt><dd>{selected.journal} · {selected.publicationDate}</dd></div><div><dt>DOI</dt><dd>{selected.doi}</dd></div></dl><div className="reading-reference-anchors"><b>正文引用位置</b>{selected.citationAnchors.map((anchor, index) => <button type="button" key={anchor.id} onClick={() => onLocate(selected, index)}><span>{anchor.marker} · 第{anchor.page}页</span><small>{anchor.context}</small></button>)}</div></article></div>
  return <div className="reading-reference-panel"><header><strong>文献解析</strong><span>{references.length} 条</span></header><div>{references.map((reference, index) => <article key={reference.id}><span>[{index + 1}] · {reference.citationAnchors.length} 处引用</span><strong>{reference.title}</strong><small>{reference.authors.join('；')} · {reference.journal} · {reference.publicationDate}</small><footer><b>DOI · {reference.doi}</b><button type="button" onClick={() => onSelect(reference.id)}>查看</button></footer></article>)}</div></div>
}

function ReadingMetadata({ analysis }: { analysis: PaperAnalysis }) {
  const { metadata } = analysis
  return <div className="reading-metadata-panel"><header><strong>论文元数据</strong><span>已解析</span></header><section className="reading-metadata-lead"><b>标题</b><p>{metadata.title}</p><b>摘要</b><p>{metadata.abstract}</p></section><dl><div><dt>作者列表</dt><dd className="reading-author-list">{metadata.authors.map((author) => <span key={author.id}><b>{author.name}{author.corresponding ? '（通讯）' : ''}</b><small>{metadata.affiliations.filter((affiliation) => author.affiliationIds.includes(affiliation.id)).map((affiliation) => affiliation.name).join('；') || '机构待确认'}{author.email ? ` · ${author.email}` : ''}</small></span>)}</dd></div><div><dt>作者机构</dt><dd>{metadata.affiliations.map((affiliation) => <span className="reading-metadata-row" key={affiliation.id}>{affiliation.name}{affiliation.address ? ` · ${affiliation.address}` : ''}</span>)}</dd></div><div><dt>关键词</dt><dd className="reading-keyword-list">{metadata.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</dd></div><div><dt>期刊 / 日期</dt><dd>{metadata.journal} · {metadata.publicationDate}</dd></div><div><dt>DOI</dt><dd>{metadata.doi}</dd></div><div><dt>研究领域</dt><dd>{metadata.researchField}</dd></div></dl></div>
}

function ReadingGraph({ analysis, onLocate }: { analysis: PaperAnalysis; onLocate: (page: number, sectionId: string | undefined, label: string) => void }) {
  const [query, setQuery] = useState('')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(analysis.graph.nodes[0]?.id ?? null)
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null)
  useEffect(() => {
    setQuery('')
    setSelectedNodeId(analysis.graph.nodes[0]?.id ?? null)
    setSelectedPaperId(null)
  }, [analysis.documentId, analysis.graph.nodes])
  const matchingNodeIds = useMemo(() => query.trim() ? new Set(searchPaperAnalysis(analysis, query).map((result) => result.target.nodeId).filter(Boolean)) : null, [analysis, query])
  const visibleNodes = analysis.graph.nodes.filter((node) => !matchingNodeIds || matchingNodeIds.has(node.id) || `${node.label} ${node.description} ${node.keywords.join(' ')}`.toLocaleLowerCase('zh-CN').includes(query.trim().toLocaleLowerCase('zh-CN')))
  const selectedNode = analysis.graph.nodes.find((node) => node.id === selectedNodeId)
  const selectedPaper = analysis.references.find((reference) => reference.id === selectedPaperId)
  if (selectedPaper) return <div className="reading-graph-panel reading-related-detail"><header><button type="button" className="reading-panel-back" onClick={() => setSelectedPaperId(null)}>← 返回图谱</button><span>关联论文</span></header><article><strong>{selectedPaper.title}</strong><small>{selectedPaper.authors.join('；')} · {selectedPaper.journal} · {selectedPaper.publicationDate}</small><p>{selectedPaper.abstract}</p><dl><dt>DOI</dt><dd>{selectedPaper.doi}</dd></dl>{selectedPaper.citationAnchors[0] && <button type="button" onClick={() => { const anchor = selectedPaper.citationAnchors[0]; onLocate(anchor.page, anchor.sectionId, '关联论文定位前') }}>定位正文引用</button>}</article></div>
  return <div className="reading-graph-panel"><header><strong>图谱关联</strong><span>{analysis.graph.nodes.length} 节点 · {analysis.graph.edges.length} 关系</span></header><label className="reading-graph-search"><span className="sr-only">搜索图谱节点</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="语义搜索节点、作者或机构" /></label><div className="reading-graph-network" role="group" aria-label="论文知识图谱节点">{visibleNodes.map((node) => <button type="button" aria-pressed={selectedNodeId === node.id} className={`is-${node.type}${selectedNodeId === node.id ? ' is-active' : ''}`} onClick={() => setSelectedNodeId(node.id)} key={node.id}><span>{node.label}</span><small>{node.type}</small></button>)}</div>{visibleNodes.length === 0 && <p className="reading-graph-empty">未找到匹配节点，请缩短检索词。</p>}{selectedNode && <article className="reading-graph-node-detail"><strong>{selectedNode.label}</strong><p>{selectedNode.description}</p><small>{selectedNode.keywords.join(' · ')}</small>{selectedNode.page && <button type="button" onClick={() => onLocate(selectedNode.page ?? 1, selectedNode.sectionId, '图谱节点定位前')}>定位原文</button>}</article>}<div className="reading-related-heading"><strong>关联论文推荐</strong><span>{analysis.references.length} 篇</span></div><div className="reading-related-list">{analysis.references.map((reference) => <article key={reference.id}><strong>{reference.title}</strong><small>{reference.journal} · {reference.publicationDate}</small><footer><b>{reference.authors[0]}</b><button type="button" onClick={() => setSelectedPaperId(reference.id)}>查看</button></footer></article>)}</div></div>
}
