import { useEffect, useMemo, useState } from 'react'
import type { ResearchDocument } from '../types'
import './PdfArchiveTable.css'

interface PdfArchiveTableProps {
  documents: ResearchDocument[]
  onOpen: (documentItem: ResearchDocument) => void
  onDownload: (documentItem: ResearchDocument) => void
  onToggleFavorite: (documentId: number) => void
  onMoveToRecycle: (documentId: number) => void
}

const pageSize = 10

const parsedTimestamp = (documentItem: ResearchDocument) => {
  const value = Date.parse(documentItem.pdfArchive?.parsedAt || '')
  return Number.isFinite(value) ? value : 0
}

export function PdfArchiveTable({
  documents,
  onOpen,
  onDownload,
  onToggleFavorite,
  onMoveToRecycle,
}: PdfArchiveTableProps) {
  const [page, setPage] = useState(1)
  const sortedDocuments = useMemo(
    () => [...documents].sort((left, right) => parsedTimestamp(right) - parsedTimestamp(left) || right.id - left.id),
    [documents],
  )
  const totalPages = Math.max(1, Math.ceil(sortedDocuments.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const visibleDocuments = sortedDocuments.slice((safePage - 1) * pageSize, safePage * pageSize)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  if (!documents.length) {
    return (
      <div className="pdf-archive-empty" role="status">
        <span className="pdf-archive-empty-icon" aria-hidden="true">PDF</span>
        <strong>暂无 PDF 文献存档</strong>
        <p>点击“批量导入 PDF”，在线解析完成后即可在这里阅读、做笔记和导出笔记 PDF。</p>
      </div>
    )
  }

  return (
    <section className="pdf-archive-region" aria-label="PDF 文献存档">
      <div className="pdf-archive-summary" role="status">
        <span>已存档 <strong>{documents.length}</strong> 篇 PDF 文献</span>
        <span>共 <strong>{documents.reduce((total, item) => total + (item.pdfArchive?.annotationCount ?? 0), 0)}</strong> 条阅读笔记</span>
      </div>
      <div className="pdf-archive-scroll">
        <table className="pdf-archive-table">
          <thead>
            <tr><th>文献名称</th><th>解析状态</th><th>页数</th><th>原文件大小</th><th>笔记</th><th>存档时间</th><th>操作</th></tr>
          </thead>
          <tbody>
            {visibleDocuments.map((documentItem) => {
              const archive = documentItem.pdfArchive!
              return (
                <tr key={documentItem.id}>
                  <td data-label="文献名称">
                    <button type="button" className="pdf-archive-title" onClick={() => onOpen(documentItem)} aria-label={`阅读与笔记：${documentItem.title}`}>
                      <span className="pdf-archive-file-icon" aria-hidden="true">PDF</span>
                      <span><strong>{documentItem.title}</strong><small title={archive.originalName}>{archive.originalName}</small></span>
                    </button>
                  </td>
                  <td data-label="解析状态"><span className="pdf-archive-status"><i aria-hidden="true" />在线解析完成 · 已存档</span></td>
                  <td data-label="页数">{archive.pageCount} 页</td>
                  <td data-label="原文件大小">{documentItem.size}</td>
                  <td data-label="笔记">{archive.annotationCount} 条</td>
                  <td data-label="存档时间">{documentItem.updatedAt || documentItem.createdAt}</td>
                  <td data-label="操作">
                    <span className="pdf-archive-actions">
                      <button type="button" onClick={() => onOpen(documentItem)}>阅读与笔记</button>
                      <button type="button" onClick={() => onDownload(documentItem)}>下载原文</button>
                      <button type="button" onClick={() => onToggleFavorite(documentItem.id)}>{documentItem.favorite ? '取消收藏' : '收藏'}</button>
                      <button type="button" className="is-danger" onClick={() => onMoveToRecycle(documentItem.id)}>移入回收站</button>
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <nav className="pdf-archive-pagination" aria-label="PDF 文献存档分页">
          <button type="button" disabled={safePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>上一页</button>
          <span>{safePage} / {totalPages}</span>
          <button type="button" disabled={safePage === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>下一页</button>
        </nav>
      )}
    </section>
  )
}
