import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import { loadOriginalFile, downloadOriginalFile } from '../localFiles'
import type { ResearchDocument } from '../types'
export type ConvertedContent = { html?: string; rows?: string[][] }
export function LocalFilePreview({ item }: { item: ResearchDocument }) {
 const [content,setContent]=useState<ConvertedContent>({}); const [error,setError]=useState(''); const [loading,setLoading]=useState(true)
 useEffect(()=>{ let active=true; (async()=>{try { const file=await loadOriginalFile(item.id); const ext=(item.originalFileName||item.title).split('.').pop()?.toLowerCase(); let result:ConvertedContent={};
 if (['xlsx','xls','csv','tsv'].includes(ext||'')) {const XLSX=await import('xlsx'); const book=XLSX.read(await file.arrayBuffer(),{type:'array'}); result={rows:XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]],{header:1,defval:'',raw:false}) as string[][]}; if(book.SheetNames.length>1) throw new Error('此文件包含多个工作表，请用本地软件查看，暂不预览以避免遗漏数据。'); if(result.rows!.length>500||result.rows!.some(row=>row.length>30)) throw new Error('文件超出当前在线表格的 500 行、30 列限制，请下载后用本地软件打开。') }
 else if(ext==='docx') { const mammoth=await import('mammoth'); result={html:DOMPurify.sanitize((await mammoth.convertToHtml({arrayBuffer:await file.arrayBuffer()})).value)} }
 else if(['txt','md'].includes(ext||'')) { const text=await file.text(); const node=document.createElement('p'); node.textContent=text; result={html:node.outerHTML} }
 else throw new Error('该格式暂不支持浏览器预览，请下载后用本地软件打开。'); if(active)setContent(result)
 } catch(e){if(active)setError(e instanceof Error?e.message:'文件读取失败')} finally{if(active)setLoading(false)}})(); return()=>{active=false}},[item.id])
 const download=async()=>{try{await downloadOriginalFile(item)}catch(e){setError(e instanceof Error?e.message:'下载失败')}}
 return <div className="local-file-preview"><div className="document-preview-actions"><button type="button" onClick={download}>下载原文件</button><details><summary aria-label="更多文件操作">⋮</summary><button type="button" onClick={download}>下载后用本地软件打开</button></details></div><p>本地上传文件仅供阅读。</p>{loading&&<p role="status">正在读取文件…</p>}{error&&<p role="alert">{error}</p>}<div style={{maxHeight:'65vh',overflow:'auto',whiteSpace:'pre-wrap'}}>{content.html&&<article dangerouslySetInnerHTML={{__html:content.html}}/>}{content.rows&&<table className="document-table"><tbody>{content.rows.map((row,r)=><tr key={r}>{row.map((cell,c)=><td key={c}>{String(cell)}</td>)}</tr>)}</tbody></table>}</div></div>
}
