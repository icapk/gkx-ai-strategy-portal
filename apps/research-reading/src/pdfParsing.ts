import {
  getDocument,
  GlobalWorkerOptions,
  InvalidPDFException,
  PasswordException,
  type OnProgressParameters,
} from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = workerUrl

const MAX_INDEXED_TEXT = 100_000
const assetBase = `${import.meta.env.BASE_URL}pdfjs/`

export interface ParsedPdfResult {
  pageCount: number
  textContent: string
}

export async function parsePdfData(data: ArrayBuffer, onProgress: (progress: number) => void): Promise<ParsedPdfResult> {
  const loadingTask = getDocument({
    data: new Uint8Array(data.slice(0)),
    cMapUrl: `${assetBase}cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${assetBase}standard_fonts/`,
    wasmUrl: `${assetBase}wasm/`,
    iccUrl: `${assetBase}iccs/`,
  })
  loadingTask.onProgress = ({ loaded, total }: OnProgressParameters) => {
    if (!total) return
    onProgress(Math.min(24, Math.max(8, Math.round((loaded / total) * 24))))
  }
  try {
    onProgress(8)
    const pdfDocument = await loadingTask.promise
    onProgress(28)
    const textParts: string[] = []
    let textLength = 0
    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
      if (textLength >= MAX_INDEXED_TEXT) break
      const page = await pdfDocument.getPage(pageNumber)
      try {
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item) => 'str' in item ? item.str : '')
          .filter(Boolean)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim()
        const available = Math.max(0, MAX_INDEXED_TEXT - textLength)
        const nextText = pageText.slice(0, available)
        // Keep one segment per parsed page so search hits can map back to a page,
        // including when an earlier page is scanned and has no selectable text.
        textParts.push(nextText)
        textLength += nextText.length + 1
      } finally {
        page.cleanup()
      }
      onProgress(28 + Math.round((pageNumber / pdfDocument.numPages) * 67))
    }
    onProgress(96)
    return {
      pageCount: pdfDocument.numPages,
      textContent: textParts.join('\n').slice(0, MAX_INDEXED_TEXT),
    }
  } catch (error) {
    if (error instanceof PasswordException) throw new Error('password-protected')
    if (error instanceof InvalidPDFException) throw new Error('invalid-pdf')
    throw error
  } finally {
    try {
      await loadingTask.destroy()
    } catch {
      // Cleanup errors must not replace the original parsing result or failure.
    }
  }
}
