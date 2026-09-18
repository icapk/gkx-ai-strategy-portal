import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReadingDocument } from '../readingData'
import { downloadReadingFile } from '../readingFiles'
import { ANTENNA_ID } from '../antennaPaper'
import './readingLibraryList.css'
import { DocumentLanguageSelect } from './DocumentLanguage'

interface Props {
  initialViewState: LibraryViewState
  onViewStateChange: (state: LibraryViewState) => void
  documents: ReadingDocument[]
  onDocumentsChange: (documents: ReadingDocument[]) => boolean
  selectedDocumentId: number | null
  onSelectDocument: (id: number) => void
  onOpenDocument: (document: ReadingDocument) => void
  onBack: () => void
  onUpload: () => void
  onToast: (message: string) => void
  folders: string[]
  onFoldersChange: (folders: string[]) => boolean
}
export interface LibraryViewState { section:'recent'|'all'|'favorites'; search:string; page:number; pageSize:number }
const sections = [
  { id: 'recent', title: '最近浏览', icon: 'back' },
  { id: 'all', title: '我的文件', icon: 'library-folder-shape' },
  { id: 'favorites', title: '我的收藏', icon: 'star-outline' },
] as const

export function ReadingLibrary({ documents, onDocumentsChange, onOpenDocument, onUpload, onToast, folders, initialViewState, onViewStateChange }: Props) {
  const [section, setSection] = useState(initialViewState.section)
  const [search, setSearch] = useState(initialViewState.search)
  const [page, setPage] = useState(initialViewState.page)
  const [pageSize, setPageSize] = useState(initialViewState.pageSize)
  useEffect(() => onViewStateChange({section,search,page,pageSize}), [section,search,page,pageSize])
  const [pendingDelete, setPendingDelete] = useState<ReadingDocument|null>(null)
  const list = useMemo(() => {
    const term = search.trim().toLocaleLowerCase()
    const result = documents.filter(d => (section !== 'favorites' || d.favorite) && (section !== 'recent' || d.visitedAt) && (!term || `${d.title} ${d.authors} ${d.journal}`.toLocaleLowerCase().includes(term)))
    return section === 'recent' ? result.sort((a,b) => (b.visitedAt ?? '').localeCompare(a.visitedAt ?? '')) : result
  }, [documents, search, section])
  const pageCount = Math.max(1, Math.ceil(list.length / pageSize))
  useEffect(() => setPage(p => Math.min(p, pageCount)), [pageCount])
  const download = (d: ReadingDocument) => {
    if(d.originalFile){void downloadReadingFile(d.id).catch(e=>onToast(String(e)));return}
    const a = document.createElement('a')
    if (d.id === ANTENNA_ID) { a.href = '/antenna/paper.pdf'; a.download = '文件1-论文PDF.pdf'; a.click(); return }
    onToast('当前文献未保存可下载的原始文件，无法下载原件。')
  }
  return <section className="reading-files" aria-label="智能阅读文献库">
    <header className="reading-files-header">
      <button className="reading-files-upload" onClick={onUpload}><img src="/assets/reading/upload.svg" alt=""/>上传文件</button>
      <label className="reading-files-search"><img src="/assets/reading/search.svg" alt=""/><input aria-label="搜索文献" placeholder="搜索文献标题、作者或期刊" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}/>{search && <button aria-label="清空文献搜索" onClick={() => { setSearch(''); setPage(1) }}>×</button>}</label>
    </header>
    <div className="reading-files-body">
      <nav className="reading-files-nav" aria-label="文献模块">{sections.map(s => <button key={s.id} aria-current={section === s.id ? 'page' : undefined} onClick={() => { setSection(s.id); setPage(1) }}><img src={`/assets/reading/${s.icon}.svg`} alt=""/><span>{s.title}</span><small>{documents.filter(d => s.id === 'all' || (s.id === 'favorites' ? d.favorite : d.visitedAt)).length}</small></button>)}</nav>
      <main className="reading-files-main"><div className="reading-files-heading"><h1>{sections.find(s => s.id === section)?.title}</h1><span>{list.length} 个文件</span></div>
        <div className="reading-files-table-scroll"><table aria-label={`${sections.find(s => s.id === section)?.title}文献列表`}><thead><tr><th>名称</th><th>作者</th><th>位置</th><th>{section === 'recent' ? '最近浏览' : '类型'}</th><th>语言</th><th>操作</th></tr></thead><tbody>{list.slice((page-1)*pageSize,page*pageSize).map(d => <tr key={d.id}>
          <td><button className="reading-file-open" title={d.title} onClick={() => onOpenDocument(d)}><img src={`/assets/reading/${d.type === 'PDF' ? 'pdf' : 'docx'}.svg`} alt=""/><span>{d.title}</span></button></td>
          <td title={d.authors||'未提供'}><span className="reading-file-author">{d.authors||'未提供'}</span></td>
          <td><select aria-label={`移动 ${d.title}`} value={d.folder} onChange={e => onDocumentsChange(documents.map(item => item.id === d.id ? {...item,folder:e.target.value} : item))}>{folders.map(f => <option key={f}>{f}</option>)}</select></td>
          <td>{section === 'recent' ? new Date(d.visitedAt!).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}) : d.type}</td>
          <td>{d.type==='PDF'?<DocumentLanguageSelect label={d.title+'语言'} value={d.language} onChange={language=>onDocumentsChange(documents.map(item=>item.id===d.id?{...item,language}:item))}/>: '—'}</td><td><div className="reading-file-actions"><button aria-label={`${d.favorite ? '取消收藏' : '收藏'} ${d.title}`} title={d.favorite ? '取消收藏' : '收藏'} onClick={() => onDocumentsChange(documents.map(item => item.id === d.id ? {...item,favorite:!item.favorite} : item))}><img src={`/assets/reading/${d.favorite ? 'star' : 'star-outline'}.svg`} alt=""/></button><button aria-label={`下载 ${d.title}`} title="下载" onClick={() => download(d)}><img src="/assets/reading/download.svg" alt=""/></button>{section !== 'favorites' && <button aria-label={`${section === 'recent' ? '移除浏览记录' : '删除'} ${d.title}`} title={section === 'recent' ? '移除浏览记录' : '删除'} onClick={() => section === 'recent' ? onDocumentsChange(documents.map(item => item.id===d.id ? {...item,visitedAt:undefined} : item)) : setPendingDelete(d)}>×</button>}</div></td>
        </tr>)}</tbody></table>{!list.length && <div className="reading-files-empty"><p>{search ? '没有匹配的文件' : section === 'recent' ? '暂无浏览记录' : section === 'favorites' ? '暂无收藏文件' : '暂无文件'}</p>{search ? <button onClick={() => {setSearch('');setPage(1)}}>清空搜索</button> : section!=='all' ? <button onClick={() => {setSection('all');setPage(1)}}>查看我的文件</button> : null}</div>}</div>
        <footer className="reading-files-pagination"><button aria-label="上一页" disabled={page<=1} onClick={() => setPage(p => p-1)}>‹</button><span>{page} / {pageCount}</span><button aria-label="下一页" disabled={page>=pageCount} onClick={() => setPage(p => p+1)}>›</button><select aria-label="每页数量" value={pageSize} onChange={e => {setPageSize(Number(e.target.value));setPage(1)}}><option value={10}>10条/页</option><option value={20}>20条/页</option></select></footer>
      </main>
    </div>
    {pendingDelete && createPortal(<div className="review-modal-backdrop"><div className="review-modal reading-delete-dialog" role="dialog" aria-modal="true" aria-label="删除文献" onKeyDown={e => {if(e.key==='Escape')setPendingDelete(null);if(e.key==='Tab'){const buttons=e.currentTarget.querySelectorAll('button');if((e.shiftKey&&document.activeElement===buttons[0])||(!e.shiftKey&&document.activeElement===buttons[1])){e.preventDefault();buttons[e.shiftKey?1:0]?.focus()}}}}><h2>删除文献？</h2><p>{pendingDelete.title}</p><p>此文献及其笔记将从本机阅读库移除。</p><div><button autoFocus onClick={() => setPendingDelete(null)}>取消</button><button onClick={() => {if(onDocumentsChange(documents.filter(d => d.id!==pendingDelete.id)))setPendingDelete(null)}}>删除</button></div></div></div>,document.body)}
  </section>
}
