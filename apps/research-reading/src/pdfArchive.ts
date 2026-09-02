import type { PdfArchiveAnnotation, PdfAnnotationRect, ResearchDocument } from './types'

const DATABASE_NAME = 'intelligent-research-portal:pdf-archive'
const DATABASE_VERSION = 2
const FILE_STORE = 'files'
const ANNOTATION_STORE = 'annotations'
const IMAGE_STORE = 'annotationImages'
const MAX_ANNOTATIONS = 100
const MAX_SCREENSHOT_DATA_URL_LENGTH = 1_500_000
const ORPHAN_ARCHIVE_GRACE_MS = 24 * 60 * 60 * 1_000
const encoder = new TextEncoder()

interface PdfFileRecord {
  documentId: number
  name: string
  type: string
  size: number
  data: ArrayBuffer
  updatedAt: string
}

interface PdfAnnotationRecord {
  documentId: number
  annotations: PdfArchiveAnnotation[]
}

interface PdfAnnotationImageRecord {
  assetKey: string
  documentId: number
  blob: Blob
}

type ArchiveResult<T = undefined> = { ok: true; value: T } | { ok: false; error: string }

let databasePromise: Promise<IDBDatabase> | null = null

const openDatabase = () => {
  if (databasePromise) return databasePromise
  databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('indexeddb-unavailable'))
      return
    }
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(FILE_STORE)) database.createObjectStore(FILE_STORE, { keyPath: 'documentId' })
      if (!database.objectStoreNames.contains(ANNOTATION_STORE)) database.createObjectStore(ANNOTATION_STORE, { keyPath: 'documentId' })
      const imageStore = database.objectStoreNames.contains(IMAGE_STORE)
        ? request.transaction!.objectStore(IMAGE_STORE)
        : database.createObjectStore(IMAGE_STORE, { keyPath: 'assetKey' })
      if (!imageStore.indexNames.contains('documentId')) imageStore.createIndex('documentId', 'documentId', { unique: false })
    }
    request.onsuccess = () => {
      const database = request.result
      database.onversionchange = () => {
        database.close()
        databasePromise = null
      }
      resolve(database)
    }
    request.onerror = () => reject(request.error ?? new Error('indexeddb-open-failed'))
    request.onblocked = () => reject(new Error('indexeddb-blocked'))
  }).catch((error) => {
    databasePromise = null
    throw error
  })
  return databasePromise
}

const waitForTransaction = (transaction: IDBTransaction) => new Promise<void>((resolve, reject) => {
  transaction.oncomplete = () => resolve()
  transaction.onerror = () => reject(transaction.error ?? new Error('indexeddb-transaction-failed'))
  transaction.onabort = () => reject(transaction.error ?? new Error('indexeddb-transaction-aborted'))
})

const waitForRequest = <T,>(request: IDBRequest<T>) => new Promise<T>((resolve, reject) => {
  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error ?? new Error('indexeddb-request-failed'))
})

const cleanText = (value: unknown, maximum: number) => typeof value === 'string' ? value.slice(0, maximum) : ''
const cleanNumber = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? value : 0

const sanitizeRect = (value: unknown): PdfAnnotationRect | null => {
  if (!value || typeof value !== 'object') return null
  const rect = value as Partial<PdfAnnotationRect>
  const x = Math.min(1, Math.max(0, cleanNumber(rect.x)))
  const y = Math.min(1, Math.max(0, cleanNumber(rect.y)))
  const width = Math.min(1 - x, Math.max(0, cleanNumber(rect.width)))
  const height = Math.min(1 - y, Math.max(0, cleanNumber(rect.height)))
  if (width <= 0 || height <= 0) return null
  return { x, y, width, height }
}

const sanitizeAnnotation = (value: unknown, documentId: number): PdfArchiveAnnotation | null => {
  if (!value || typeof value !== 'object') return null
  const annotation = value as Partial<PdfArchiveAnnotation>
  if (annotation.kind !== 'highlight' && annotation.kind !== 'screenshot') return null
  const pageNumber = Number(annotation.pageNumber)
  if (!Number.isInteger(pageNumber) || pageNumber <= 0) return null
  const id = cleanText(annotation.id, 120).trim()
  if (!id) return null
  const imageDataUrl = cleanText(annotation.imageDataUrl, MAX_SCREENSHOT_DATA_URL_LENGTH)
  return {
    id,
    documentId,
    kind: annotation.kind,
    pageNumber,
    quote: cleanText(annotation.quote, 500),
    imageDataUrl: /^data:image\/(?:jpeg|png|webp);base64,/i.test(imageDataUrl) ? imageDataUrl : undefined,
    imageAssetKey: cleanText(annotation.imageAssetKey, 180).trim() || undefined,
    note: cleanText(annotation.note, 1_000),
    rects: Array.isArray(annotation.rects)
      ? annotation.rects.slice(0, 60).map(sanitizeRect).filter((rect): rect is PdfAnnotationRect => rect != null)
      : [],
    createdAt: cleanText(annotation.createdAt, 40),
    updatedAt: cleanText(annotation.updatedAt, 40),
  }
}

export const pdfArchiveStorageKey = (documentId: number) => `pdf-${documentId}`

export async function savePdfArchiveFile(documentId: number, file: File, data: ArrayBuffer): Promise<ArchiveResult> {
  try {
    const database = await openDatabase()
    const transaction = database.transaction(FILE_STORE, 'readwrite')
    const request = transaction.objectStore(FILE_STORE).add({
      documentId,
      name: file.name.slice(0, 200),
      type: 'application/pdf',
      size: file.size,
      data,
      updatedAt: new Date().toISOString(),
    } satisfies PdfFileRecord)
    await waitForRequest(request)
    await waitForTransaction(transaction)
    return { ok: true, value: undefined }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'ConstraintError') {
      return { ok: false, error: 'document-id-conflict' }
    }
    return { ok: false, error: '浏览器无法保存该 PDF，请检查可用存储空间后重试。' }
  }
}

export async function loadPdfArchiveFile(documentId: number): Promise<ArchiveResult<PdfFileRecord>> {
  try {
    const database = await openDatabase()
    const transaction = database.transaction(FILE_STORE, 'readonly')
    const record = await waitForRequest(transaction.objectStore(FILE_STORE).get(documentId)) as PdfFileRecord | undefined
    if (!record?.data) return { ok: false, error: '未找到 PDF 原文件，请重新导入后再阅读。' }
    return { ok: true, value: record }
  } catch {
    return { ok: false, error: '无法读取本地 PDF 存档，请刷新页面后重试。' }
  }
}

export async function hasPdfArchiveFile(documentId: number): Promise<boolean> {
  if (!Number.isInteger(documentId) || documentId <= 0) return false
  try {
    const database = await openDatabase()
    const transaction = database.transaction(FILE_STORE, 'readonly')
    const key = await waitForRequest(transaction.objectStore(FILE_STORE).getKey(documentId))
    return key !== undefined
  } catch {
    return false
  }
}

export async function reconcilePdfArchiveStorage(knownDocumentIds: number[]): Promise<void> {
  try {
    const knownIds = new Set(knownDocumentIds.filter((id) => Number.isInteger(id) && id > 0))
    const database = await openDatabase()
    const keyTransaction = database.transaction(FILE_STORE, 'readonly')
    const storedKeys = await waitForRequest(keyTransaction.objectStore(FILE_STORE).getAllKeys())
    const unknownIds = storedKeys
      .map((key) => Number(key))
      .filter((id) => Number.isInteger(id) && id > 0 && !knownIds.has(id))
    if (!unknownIds.length) return

    // Only hydrate records whose keys are absent from metadata. This avoids
    // cloning every known PDF ArrayBuffer during routine startup checks.
    const scanTransaction = database.transaction(FILE_STORE, 'readonly')
    const scanStore = scanTransaction.objectStore(FILE_STORE)
    const unknownRecords = await Promise.all(unknownIds.map((documentId) => (
      waitForRequest(scanStore.get(documentId)) as Promise<PdfFileRecord | undefined>
    )))
    const cutoff = Date.now() - ORPHAN_ARCHIVE_GRACE_MS
    const expiredIds = unknownRecords.flatMap((record) => {
      if (!record || knownIds.has(record.documentId)) return []
      const updatedAt = Date.parse(record.updatedAt)
      return Number.isFinite(updatedAt) && updatedAt < cutoff ? [record.documentId] : []
    })
    if (!expiredIds.length) return

    const imageReadTransaction = database.transaction(IMAGE_STORE, 'readonly')
    const imageIndex = imageReadTransaction.objectStore(IMAGE_STORE).index('documentId')
    const imageKeysByDocument = await Promise.all(expiredIds.map(async (documentId) => ({
      documentId,
      keys: await waitForRequest(imageIndex.getAllKeys(documentId)),
    })))

    const cleanupTransaction = database.transaction([FILE_STORE, ANNOTATION_STORE, IMAGE_STORE], 'readwrite')
    const fileStore = cleanupTransaction.objectStore(FILE_STORE)
    const annotationStore = cleanupTransaction.objectStore(ANNOTATION_STORE)
    const imageStore = cleanupTransaction.objectStore(IMAGE_STORE)
    imageKeysByDocument.forEach(({ documentId, keys }) => {
      // Keep a defensive guard beside the destructive writes: caller-known IDs
      // always win over orphan cleanup.
      if (knownIds.has(documentId)) return
      fileStore.delete(documentId)
      annotationStore.delete(documentId)
      keys.forEach((key) => imageStore.delete(key))
    })
    await waitForTransaction(cleanupTransaction)
  } catch {
    // Reconciliation is best effort and must never prevent the workspace from loading.
  }
}

const dataUrlToBlob = (dataUrl: string) => {
  const [header, payload = ''] = dataUrl.split(',')
  const mimeType = /data:([^;]+)/.exec(header)?.[1] ?? 'image/jpeg'
  const binary = atob(payload)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return new Blob([bytes], { type: mimeType })
}

const blobToDataUrl = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
  reader.onerror = () => reject(reader.error ?? new Error('image-read-failed'))
  reader.readAsDataURL(blob)
})

const annotationSnapshot = (annotations: PdfArchiveAnnotation[], documentId: number) => JSON.stringify(
  annotations
    .map((annotation) => sanitizeAnnotation(annotation, documentId))
    .filter((annotation): annotation is PdfArchiveAnnotation => annotation != null)
    .map(({ imageDataUrl: _imageDataUrl, ...annotation }) => annotation)
    .sort((left, right) => left.id.localeCompare(right.id)),
)

export async function savePdfAnnotations(
  documentId: number,
  annotations: PdfArchiveAnnotation[],
  baseAnnotations: PdfArchiveAnnotation[],
): Promise<ArchiveResult<PdfArchiveAnnotation[]>> {
  if (annotations.length > MAX_ANNOTATIONS) {
    return { ok: false, error: `每篇文献最多可保存 ${MAX_ANNOTATIONS} 条笔记。` }
  }
  const oversizedScreenshot = annotations.find((annotation) => (annotation.imageDataUrl?.length ?? 0) > MAX_SCREENSHOT_DATA_URL_LENGTH)
  if (oversizedScreenshot) return { ok: false, error: '截图范围过大，请缩小截图区域后重试。' }
  const missingScreenshot = annotations.find((annotation) => annotation.kind === 'screenshot' && !annotation.imageDataUrl && !annotation.imageAssetKey)
  if (missingScreenshot) return { ok: false, error: '截图内容已丢失，请重新截取后再保存。' }
  try {
    const database = await openDatabase()
    const transaction = database.transaction([ANNOTATION_STORE, IMAGE_STORE], 'readwrite')
    const transactionCompletion = waitForTransaction(transaction)
    const annotationStore = transaction.objectStore(ANNOTATION_STORE)
    const imageStore = transaction.objectStore(IMAGE_STORE)
    const [currentRecord, existingKeys] = await Promise.all([
      waitForRequest(annotationStore.get(documentId)) as Promise<PdfAnnotationRecord | undefined>,
      waitForRequest(imageStore.index('documentId').getAllKeys(documentId)),
    ])
    const currentAnnotations = (currentRecord?.annotations ?? [])
      .map((annotation) => sanitizeAnnotation(annotation, documentId))
      .filter((annotation): annotation is PdfArchiveAnnotation => annotation != null)
    if (annotationSnapshot(currentAnnotations, documentId) !== annotationSnapshot(baseAnnotations, documentId)) {
      transaction.abort()
      await transactionCompletion.catch(() => undefined)
      return { ok: false, error: '文献笔记已在其他页面更新。请关闭阅读器后重新打开，再继续编辑。' }
    }
    const existingImageKeys = new Set(existingKeys.map((key) => String(key)))
    const runtimeAnnotations = annotations.map((annotation) => ({
      ...annotation,
      imageAssetKey: annotation.kind === 'screenshot'
        ? annotation.imageAssetKey || `${documentId}:${annotation.id}`
        : undefined,
    }))
    const safeAnnotations = runtimeAnnotations
      .map((annotation) => sanitizeAnnotation(annotation, documentId))
      .filter((annotation): annotation is PdfArchiveAnnotation => annotation != null)
    const activeImageKeys = new Set(safeAnnotations.map((annotation) => annotation.imageAssetKey).filter(Boolean))
    runtimeAnnotations.forEach((annotation) => {
      if (annotation.kind !== 'screenshot' || !annotation.imageDataUrl) return
      const assetKey = annotation.imageAssetKey || `${documentId}:${annotation.id}`
      if (existingImageKeys.has(assetKey)) return
      imageStore.put({
        assetKey,
        documentId,
        blob: dataUrlToBlob(annotation.imageDataUrl),
      } satisfies PdfAnnotationImageRecord)
    })
    existingKeys.forEach((key) => {
      if (!activeImageKeys.has(String(key))) imageStore.delete(key)
    })
    annotationStore.put({
      documentId,
      annotations: safeAnnotations.map((annotation) => ({ ...annotation, imageDataUrl: undefined })),
    } satisfies PdfAnnotationRecord)
    await transactionCompletion
    return { ok: true, value: safeAnnotations }
  } catch {
    return { ok: false, error: '笔记未能保存，请释放浏览器存储空间后重试。' }
  }
}

export async function loadPdfAnnotations(documentId: number): Promise<ArchiveResult<PdfArchiveAnnotation[]>> {
  try {
    const database = await openDatabase()
    const transaction = database.transaction(ANNOTATION_STORE, 'readonly')
    const record = await waitForRequest(transaction.objectStore(ANNOTATION_STORE).get(documentId)) as PdfAnnotationRecord | undefined
    const annotations = (record?.annotations ?? [])
      .map((annotation) => sanitizeAnnotation(annotation, documentId))
      .filter((annotation): annotation is PdfArchiveAnnotation => annotation != null)
    return { ok: true, value: annotations }
  } catch {
    return { ok: false, error: '无法读取文献笔记，请刷新页面后重试。' }
  }
}

export async function loadPdfAnnotationImage(documentId: number, assetKey: string): Promise<ArchiveResult<string>> {
  try {
    const database = await openDatabase()
    const transaction = database.transaction(IMAGE_STORE, 'readonly')
    const record = await waitForRequest(transaction.objectStore(IMAGE_STORE).get(assetKey)) as PdfAnnotationImageRecord | undefined
    if (!record?.blob || record.documentId !== documentId) return { ok: false, error: '截图内容已丢失，请重新截取。' }
    return { ok: true, value: await blobToDataUrl(record.blob) }
  } catch {
    return { ok: false, error: '截图读取失败，请稍后重试。' }
  }
}

export async function deletePdfArchive(documentId: number): Promise<ArchiveResult> {
  try {
    const database = await openDatabase()
    const imageReadTransaction = database.transaction(IMAGE_STORE, 'readonly')
    const imageKeys = await waitForRequest(imageReadTransaction.objectStore(IMAGE_STORE).index('documentId').getAllKeys(documentId))
    const transaction = database.transaction([FILE_STORE, ANNOTATION_STORE, IMAGE_STORE], 'readwrite')
    transaction.objectStore(FILE_STORE).delete(documentId)
    transaction.objectStore(ANNOTATION_STORE).delete(documentId)
    imageKeys.forEach((key) => transaction.objectStore(IMAGE_STORE).delete(key))
    await waitForTransaction(transaction)
    return { ok: true, value: undefined }
  } catch {
    return { ok: false, error: '本地 PDF 文件清理失败，可稍后刷新后重试。' }
  }
}

export async function downloadPdfArchive(documentItem: ResearchDocument): Promise<ArchiveResult> {
  const result = await loadPdfArchiveFile(documentItem.id)
  if (!result.ok) return result
  const objectUrl = URL.createObjectURL(new Blob([result.value.data], { type: 'application/pdf' }))
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = documentItem.pdfArchive?.originalName || `${documentItem.title}.pdf`
  anchor.hidden = true
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000)
  return { ok: true, value: undefined }
}

const wrapText = (context: CanvasRenderingContext2D, text: string, maximumWidth: number) => {
  const lines: string[] = []
  const paragraphs = text.replace(/\r/g, '').split('\n')
  paragraphs.forEach((paragraph, paragraphIndex) => {
    let line = ''
    Array.from(paragraph || ' ').forEach((character) => {
      const candidate = `${line}${character}`
      if (line && context.measureText(candidate).width > maximumWidth) {
        lines.push(line)
        line = character
      } else {
        line = candidate
      }
    })
    if (line.trim() || !paragraph.trim()) lines.push(line.trimEnd())
    if (paragraphIndex < paragraphs.length - 1 && paragraph.trim()) lines.push('')
  })
  return lines
}

const drawWrappedText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maximumWidth: number,
  lineHeight: number,
  maximumLines = 40,
) => {
  const lines = wrapText(context, text, maximumWidth)
  lines.slice(0, maximumLines).forEach((line, index) => context.fillText(line, x, y + index * lineHeight))
  if (lines.length > maximumLines) context.fillText('…', x, y + (maximumLines - 1) * lineHeight)
  return y + Math.min(lines.length, maximumLines) * lineHeight
}

const loadImage = (source: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const image = new Image()
  image.onload = () => resolve(image)
  image.onerror = () => reject(new Error('image-load-failed'))
  image.src = source
})

const createPageCanvas = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1240
  canvas.height = 1754
  const context = canvas.getContext('2d')
  if (!context) throw new Error('canvas-unavailable')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  return { canvas, context }
}

const drawPageFrame = (context: CanvasRenderingContext2D, documentTitle: string, label: string, pageIndex: number, pageTotal: number) => {
  context.fillStyle = '#165dff'
  context.fillRect(0, 0, 16, 1754)
  context.fillStyle = '#1d2129'
  context.font = '600 34px "PingFang SC", "Microsoft YaHei", sans-serif'
  context.fillText(documentTitle.slice(0, 32), 86, 92)
  context.fillStyle = '#86909c'
  context.font = '24px "PingFang SC", "Microsoft YaHei", sans-serif'
  context.fillText(label, 86, 136)
  context.strokeStyle = '#e5e6eb'
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(86, 172)
  context.lineTo(1154, 172)
  context.stroke()
  context.fillStyle = '#86909c'
  context.font = '22px "PingFang SC", "Microsoft YaHei", sans-serif'
  const pageLabel = pageTotal > 0 ? `第 ${pageIndex} / ${pageTotal} 页` : `笔记页 ${pageIndex}`
  context.fillText(pageLabel, pageTotal > 0 ? 1008 : 1044, 1692)
}

const renderCoverPage = (documentItem: ResearchDocument, annotations: PdfArchiveAnnotation[]) => {
  const { canvas, context } = createPageCanvas()
  context.fillStyle = '#f4f8ff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#165dff'
  context.fillRect(88, 136, 82, 10)
  context.font = '600 52px "PingFang SC", "Microsoft YaHei", sans-serif'
  context.fillStyle = '#1d2129'
  let y = drawWrappedText(context, documentItem.title, 88, 245, 1050, 74, 4)
  context.font = '28px "PingFang SC", "Microsoft YaHei", sans-serif'
  context.fillStyle = '#4e5969'
  context.fillText('文献阅读笔记', 88, y + 52)
  y += 120
  context.fillStyle = '#ffffff'
  context.fillRect(88, y, 1064, 250)
  context.fillStyle = '#165dff'
  context.font = '600 64px "PingFang SC", "Microsoft YaHei", sans-serif'
  context.fillText(String(annotations.length), 132, y + 102)
  context.fillStyle = '#4e5969'
  context.font = '26px "PingFang SC", "Microsoft YaHei", sans-serif'
  context.fillText('条文献笔记', 132, y + 154)
  context.fillText(`划词 ${annotations.filter((item) => item.kind === 'highlight').length} 条`, 420, y + 102)
  context.fillText(`截图 ${annotations.filter((item) => item.kind === 'screenshot').length} 条`, 420, y + 154)
  context.fillText(`原文 ${documentItem.pdfArchive?.pageCount ?? 0} 页`, 770, y + 102)
  context.fillText(`导出于 ${new Date().toLocaleDateString('zh-CN')}`, 770, y + 154)
  context.fillStyle = '#86909c'
  context.font = '23px "PingFang SC", "Microsoft YaHei", sans-serif'
  context.fillText('智能科研 · 存档管理', 88, 1642)
  return canvas
}

const renderAnnotationPages = async (
  documentItem: ResearchDocument,
  annotation: PdfArchiveAnnotation,
  firstPageIndex: number,
) => {
  const canvases: HTMLCanvasElement[] = []
  const createAnnotationCanvas = (continuation = false) => {
    const page = createPageCanvas()
    drawPageFrame(
      page.context,
      documentItem.title,
      `${annotation.kind === 'highlight' ? '划词笔记' : '截图笔记'} · 原文第 ${annotation.pageNumber} 页${continuation ? ' · 续' : ''}`,
      firstPageIndex + canvases.length,
      0,
    )
    canvases.push(page.canvas)
    return page
  }
  let { context } = createAnnotationCanvas()
  let y = 230
  if (annotation.kind === 'screenshot') {
    if (!annotation.imageDataUrl) throw new Error('screenshot-image-missing')
    try {
      const image = await loadImage(annotation.imageDataUrl)
      const scale = Math.min(1068 / image.naturalWidth, 360 / image.naturalHeight, 1)
      const width = Math.max(1, Math.round(image.naturalWidth * scale))
      const height = Math.max(1, Math.round(image.naturalHeight * scale))
      context.fillStyle = '#f7f8fa'
      context.fillRect(86, y, 1068, height + 32)
      context.drawImage(image, 102, y + 16, width, height)
      y += height + 78
    } catch {
      throw new Error('screenshot-image-decode-failed')
    }
  }
  if (annotation.quote) {
    context.font = '22px "PingFang SC", "Microsoft YaHei", sans-serif'
    const quoteLines = wrapText(context, annotation.quote, 984)
    const boxHeight = Math.max(92, quoteLines.length * 34 + 46)
    context.fillStyle = '#f2f7ff'
    context.fillRect(86, y, 1068, boxHeight)
    context.fillStyle = '#165dff'
    context.fillRect(86, y, 8, boxHeight)
    context.fillStyle = '#4e5969'
    drawWrappedText(context, annotation.quote, 122, y + 44, 984, 34, 100)
    y += boxHeight + 58
  }
  context.fillStyle = '#1d2129'
  context.font = '22px "PingFang SC", "Microsoft YaHei", sans-serif'
  const noteLines = wrapText(context, annotation.note || '未填写补充说明', 1068)
  let lineIndex = 0
  let continuation = false
  while (lineIndex < noteLines.length) {
    if (y > 1510) {
      ;({ context } = createAnnotationCanvas(true))
      y = 230
      continuation = true
    }
    context.fillStyle = '#1d2129'
    context.font = '600 28px "PingFang SC", "Microsoft YaHei", sans-serif'
    context.fillText(continuation ? '笔记（续）' : '笔记', 86, y)
    context.font = '22px "PingFang SC", "Microsoft YaHei", sans-serif'
    context.fillStyle = '#4e5969'
    const availableLines = Math.max(1, Math.floor((1600 - (y + 54)) / 34))
    const pageLines = noteLines.slice(lineIndex, lineIndex + availableLines)
    pageLines.forEach((line, index) => context.fillText(line, 86, y + 54 + index * 34))
    lineIndex += pageLines.length
    if (lineIndex < noteLines.length) {
      ;({ context } = createAnnotationCanvas(true))
      y = 230
      continuation = true
    }
  }
  canvases.forEach((pageCanvas) => {
    const pageContext = pageCanvas.getContext('2d')
    if (!pageContext) return
    pageContext.fillStyle = '#86909c'
    pageContext.font = '22px "PingFang SC", "Microsoft YaHei", sans-serif'
    pageContext.fillText(`更新于 ${annotation.updatedAt}`, 86, 1692)
  })
  return canvases
}

const canvasToJpeg = (canvas: HTMLCanvasElement) => {
  const base64 = canvas.toDataURL('image/jpeg', 0.86).split(',')[1] ?? ''
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return bytes
}

const concatenateBytes = (chunks: Uint8Array[]) => {
  const length = chunks.reduce((total, chunk) => total + chunk.length, 0)
  const combined = new Uint8Array(length)
  let offset = 0
  chunks.forEach((chunk) => {
    combined.set(chunk, offset)
    offset += chunk.length
  })
  return combined
}

interface ExportPageImage {
  bytes: Uint8Array
  width: number
  height: number
}

const createPdfFromImages = (pages: ExportPageImage[]) => {
  const objects = new Map<number, Uint8Array>()
  const pageIds = pages.map((_, index) => 3 + index * 3)
  objects.set(1, encoder.encode('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n'))
  objects.set(2, encoder.encode(`2 0 obj\n<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>\nendobj\n`))
  pages.forEach((page, index) => {
    const pageId = pageIds[index]
    const imageId = pageId + 1
    const contentId = pageId + 2
    const jpeg = page.bytes
    const image = concatenateBytes([
      encoder.encode(`${imageId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`),
      jpeg,
      encoder.encode('\nendstream\nendobj\n'),
    ])
    const content = encoder.encode('q\n595 0 0 842 0 0 cm\n/Im0 Do\nQ\n')
    objects.set(pageId, encoder.encode(`${pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>\nendobj\n`))
    objects.set(imageId, image)
    objects.set(contentId, concatenateBytes([
      encoder.encode(`${contentId} 0 obj\n<< /Length ${content.length} >>\nstream\n`),
      content,
      encoder.encode('endstream\nendobj\n'),
    ]))
  })

  const objectCount = 2 + pages.length * 3
  const chunks: Uint8Array[] = [encoder.encode('%PDF-1.4\n')]
  const offsets = new Array<number>(objectCount + 1).fill(0)
  let length = chunks[0].length
  for (let id = 1; id <= objectCount; id += 1) {
    const object = objects.get(id)
    if (!object) throw new Error('pdf-object-missing')
    offsets[id] = length
    chunks.push(object)
    length += object.length
  }
  const xrefOffset = length
  const xref = [
    'xref',
    `0 ${objectCount + 1}`,
    '0000000000 65535 f ',
    ...offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n `),
    'trailer',
    `<< /Size ${objectCount + 1} /Root 1 0 R >>`,
    'startxref',
    String(xrefOffset),
    '%%EOF',
  ].join('\n')
  chunks.push(encoder.encode(xref))
  return new Blob(chunks, { type: 'application/pdf' })
}

export async function exportPdfNotes(documentItem: ResearchDocument, annotations: PdfArchiveAnnotation[]): Promise<ArchiveResult> {
  if (!annotations.length) return { ok: false, error: '当前文献还没有笔记，请先完成划词或截图笔记。' }
  try {
    await document.fonts?.ready
    const pages: ExportPageImage[] = []
    const cover = renderCoverPage(documentItem, annotations)
    pages.push({ bytes: canvasToJpeg(cover), width: cover.width, height: cover.height })
    cover.width = 0
    cover.height = 0
    for (let index = 0; index < annotations.length; index += 1) {
      let annotation = annotations[index]
      if (annotation.kind === 'screenshot' && !annotation.imageDataUrl) {
        if (!annotation.imageAssetKey) {
          return { ok: false, error: `第 ${annotation.pageNumber} 页截图内容已丢失，请重新截取后再导出。` }
        }
        const imageResult = await loadPdfAnnotationImage(documentItem.id, annotation.imageAssetKey)
        if (!imageResult.ok) {
          return { ok: false, error: `第 ${annotation.pageNumber} 页截图读取失败，请恢复截图后再导出。` }
        }
        annotation = { ...annotation, imageDataUrl: imageResult.value }
      }
      const canvases = await renderAnnotationPages(documentItem, annotation, pages.length + 1)
      canvases.forEach((canvas) => {
        pages.push({ bytes: canvasToJpeg(canvas), width: canvas.width, height: canvas.height })
        canvas.width = 0
        canvas.height = 0
      })
    }
    const pdf = createPdfFromImages(pages)
    const objectUrl = URL.createObjectURL(pdf)
    const anchor = document.createElement('a')
    anchor.href = objectUrl
    anchor.download = `${documentItem.title.replace(/[\\/:*?"<>|]/g, '_')}-文献笔记.pdf`
    anchor.hidden = true
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000)
    return { ok: true, value: undefined }
  } catch (error) {
    if (error instanceof Error && (error.message === 'screenshot-image-missing' || error.message === 'screenshot-image-decode-failed')) {
      return { ok: false, error: '笔记中的截图内容已损坏，导出已停止；请删除并重新截取后再试。' }
    }
    return { ok: false, error: '笔记 PDF 生成失败，请减少截图数量后重试。' }
  }
}
