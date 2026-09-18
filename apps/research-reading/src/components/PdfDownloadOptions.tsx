import { useState } from 'react'
import type { ResearchDocument } from '../types'
import { downloadAnnotatedPdf, downloadPdfArchive, exportPdfNotes, loadPdfAnnotations } from '../pdfArchive'
export function PdfDownloadOptions({item}:{item:ResearchDocument}) {
 const [busy,setBusy]=useState(false);const [error,setError]=useState('')
 const run=async(kind:string)=>{setBusy(true);setError('');try {let result;if(kind==='original')result=await downloadPdfArchive(item);else if(kind==='annotated')result=await downloadAnnotatedPdf(item);else{const notes=await loadPdfAnnotations(item.id);result=notes.ok?await exportPdfNotes(item,notes.value):notes}if(!result.ok)setError(result.error)}catch{setError('下载失败，请重试')}finally{setBusy(false)}}
 return <div><p>选择下载内容。带笔记版本保留原 PDF 页面，并附加标注及笔记页。</p><div className="document-preview-actions"><button type="button" disabled={busy} onClick={()=>run('original')}>原 PDF</button><button type="button" disabled={busy||!item.pdfArchive?.annotationCount} onClick={()=>run('annotated')}>带笔记的 PDF</button><button type="button" disabled={busy||!item.pdfArchive?.annotationCount} onClick={()=>run('notes')}>仅下载笔记 PDF</button></div>{busy&&<p role="status">正在生成下载文件…</p>}{error&&<p role="alert">{error}</p>}</div>
}
