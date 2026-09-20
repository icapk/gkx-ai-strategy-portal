import { useEffect, useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { TableKit } from '@tiptap/extension-table'
import Mathematics from '@tiptap/extension-mathematics'
import DOMPurify from 'dompurify'
import 'katex/dist/katex.min.css'
import type { DocumentBlock, ResearchDocument } from '../types'
import { getDocumentBlocks } from '../documentContent'
import './ContinuousEditor.css'
const escape = (text: string) => text.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!))
export function legacyDocumentHtml(item: ResearchDocument) {
  if (item.richHtml) return DOMPurify.sanitize(item.richHtml, { ADD_ATTR: ['data-type', 'data-latex'] })
  return getDocumentBlocks(item).map((block) => {
    if (block.type === 'text') { const tag = block.style === 'heading-1' ? 'h1' : block.style === 'heading-2' ? 'h2' : block.style === 'quote' ? 'blockquote' : 'p'; let value = escape(block.text).replace(/\n/g, '<br>'); if (block.bold) value = `<strong>${value}</strong>`; if (block.italic) value = `<em>${value}</em>`; if (block.underline) value = `<u>${value}</u>`; return `<${tag}>${value}</${tag}>` }
    if (block.type === 'list') return `<${block.ordered ? 'ol' : 'ul'}>${block.items.map((item) => `<li><p>${escape(item)}</p></li>`).join('')}</${block.ordered ? 'ol' : 'ul'}>`
    if (block.type === 'image') return `<img src="${escape(block.src)}" alt="${escape(block.alt)}"><p>${escape(block.caption)}</p>`
    if (block.type === 'formula') return `<span data-type="inline-math" data-latex="${escape(block.latex)}"></span>`
    if (block.type === 'bookmark') return `<p><a href="${escape(block.url)}">${escape(block.title || block.url)}</a></p><p>${escape(block.description)}</p>`
    return '<hr>'
  }).join('') || '<p></p>'
}
interface Props {
  documentItem: ResearchDocument
  onClose: () => void
  onSave: (value: { title: string; blocks: DocumentBlock[]; content: string; size: string; richHtml?: string }) => string | null
  [key: string]: unknown
}
export function ContinuousDocumentEditor({ documentItem, onClose, onSave }: Props) {
  const [title, setTitle] = useState(documentItem.title)
  const [dirty, setDirty] = useState(false)
  const [message, setMessage] = useState('')
  const [linkDraft,setLinkDraft]=useState<{from:number;to:number;label:string;url:string}|null>(null)
  const [linkError,setLinkError]=useState('')
  const uploadRef = useRef<HTMLInputElement>(null)
  const editor = useEditor({ shouldRerenderOnTransaction: true, extensions: [StarterKit.configure({link:{openOnClick:false,autolink:false,HTMLAttributes:{target:"_blank",rel:"noopener noreferrer"}}}), Image.configure({ allowBase64: true }), TableKit.configure({ table: { resizable: true } }), Mathematics], content: legacyDocumentHtml(documentItem), onUpdate: () => setDirty(true), editorProps: { attributes: { 'aria-label': '文档正文', role: 'textbox', 'aria-multiline': 'true' } } }, [documentItem.id])
  const save = () => {
    if (!editor) return
    if (!title.trim()) { setMessage('请输入文档标题'); return }
    const richHtml = DOMPurify.sanitize(editor.getHTML(), { ADD_ATTR: ['data-type', 'data-latex'] })
    if (richHtml.length > 3_000_000) { setMessage('文档内容过大，请减少图片后保存'); return }
    const content = editor.getText()
    const error = onSave({ title: title.trim(), richHtml, content, blocks: documentItem.blocks ?? [], size: `${(new Blob([richHtml]).size / 1024).toFixed(1)} KB` })
    setMessage(error ?? '已保存'); if (!error) setDirty(false)
  }
  const saveRef = useRef(save); saveRef.current = save
  useEffect(()=>{if(!dirty)return;const timer=window.setTimeout(()=>saveRef.current(),850);return()=>window.clearTimeout(timer)},[dirty,title,editor?.getHTML()])
  useEffect(() => {
    const key = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); saveRef.current() } }
    const unload = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault() }
    window.addEventListener('keydown', key); window.addEventListener('beforeunload', unload)
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('beforeunload', unload) }
  }, [dirty])
  if (!editor) return <div role="status">正在打开文档…</div>
  const editLink=()=>{if(editor.isActive('link'))editor.chain().focus().extendMarkRange('link').run();const {from,to}=editor.state.selection;setLinkError('');setLinkDraft({from,to,label:editor.state.doc.textBetween(from,to),url:editor.getAttributes('link').href??''})}
  const saveLink=()=>{if(!linkDraft)return;let href;try{const url=new URL(linkDraft.url.trim());if(!['http:','https:'].includes(url.protocol))throw Error();href=url.href}catch{setLinkError('请输入有效的 http 或 https 网页地址');return}const label=linkDraft.label.trim()||href;const previous=editor.state.doc.textBetween(linkDraft.from,linkDraft.to);const chain=editor.chain().focus().setTextSelection({from:linkDraft.from,to:linkDraft.to});if(previous===label&&linkDraft.from!==linkDraft.to)chain.setLink({href,target:'_blank',rel:'noopener noreferrer'}).run();else chain.insertContent({type:'text',text:label,marks:[{type:'link',attrs:{href,target:'_blank',rel:'noopener noreferrer'}}]}).run();setLinkDraft(null)}
  const control = (label: string, run: () => void, active = false, disabled = false) => <button type="button" data-focus-id={`editor-${label}`} disabled={disabled} aria-pressed={active} onMouseDown={(event) => event.preventDefault()} onClick={run}>{label}</button>
  return <section className="continuous-editor" aria-label={`文档编辑：${title}`}>
    <header data-business-dirty={dirty}><button type="button" onClick={() => { if (!dirty || window.confirm('有未保存修改，确定离开？')) onClose() }}>返回</button><input aria-label="文档标题" value={title} maxLength={50} onChange={(event) => { setTitle(event.target.value); setDirty(true) }} /><span role="status">{dirty ? '未保存' : '已保存'}</span><button type="button" onClick={save}>保存</button></header>
    <div className="continuous-toolbar" role="toolbar" aria-label="文档编辑工具">
      <div className="editor-tool-group" role="group" aria-label="撤销与重做"><div>{control('撤销', () => editor.chain().focus().undo().run(),false,!editor.can().undo())}{control('重做', () => editor.chain().focus().redo().run(),false,!editor.can().redo())}</div><small>编辑</small></div>
      <div className="editor-tool-group" role="group" aria-label="文字格式"><div>
      <select aria-label="文本样式" onChange={(event) => { const value = Number(event.target.value); if (value) editor.chain().focus().toggleHeading({ level: value as 1 | 2 | 3 }).run(); else editor.chain().focus().setParagraph().run() }}><option value="0">正文</option><option value="1">标题 1</option><option value="2">标题 2</option><option value="3">标题 3</option></select>
      {control('粗体', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}{control('斜体', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}{control('下划线', () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'))}{control('删除线', () => editor.chain().focus().toggleStrike().run())}
      </div><small>文字格式</small></div><div className="editor-tool-group" role="group" aria-label="段落与列表"><div>{control('无序列表', () => editor.chain().focus().toggleBulletList().run())}{control('有序列表', () => editor.chain().focus().toggleOrderedList().run())}{control('引用', () => editor.chain().focus().toggleBlockquote().run())}
      </div><small>段落</small></div><div className="editor-tool-group" role="group" aria-label="插入内容"><div>{control('表格', () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}
      {control('图片', () => uploadRef.current?.click())}
      {control('数学公式', () => { const latex = window.prompt('输入 LaTeX 数学公式', 'E=mc^2'); if (latex) editor.chain().focus().insertInlineMath({ latex }).run() })}
      {control('网页书签', editLink,editor.isActive('link'))}
      {control('分割线', () => editor.chain().focus().setHorizontalRule().run())}{control('清除格式', () => editor.chain().focus().unsetAllMarks().clearNodes().run())}
</div><small>插入</small></div>
      {editor.isActive('link')&&<div className="editor-tool-group" role="group" aria-label="链接操作"><div><a href={editor.getAttributes('link').href} target="_blank" rel="noopener noreferrer">打开链接</a>{control('编辑链接',editLink)}{control('移除链接',()=>editor.chain().focus().extendMarkRange('link').unsetLink().run())}</div><small>超链接</small></div>}
      {editor.isActive('table') && <>{control('插入行', () => editor.chain().focus().addRowAfter().run())}{control('插入列', () => editor.chain().focus().addColumnAfter().run())}{control('删除行', () => editor.chain().focus().deleteRow().run())}{control('删除列', () => editor.chain().focus().deleteColumn().run())}{control('删除表格', () => editor.chain().focus().deleteTable().run())}</>}
      <input hidden ref={uploadRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={async (event) => { const file = event.target.files?.[0]; event.target.value = ''; if (!file) return; if (file.size > 1024 * 1024) { setMessage('图片不能超过 1 MB'); return }; const reader = new FileReader(); reader.onload = () => editor.chain().focus().setImage({ src: String(reader.result), alt: file.name }).run(); reader.readAsDataURL(file) }} />
    </div>
    {linkDraft&&<div className="editor-link-dialog" role="dialog" aria-modal="true" aria-label="编辑超链接"><form onSubmit={e=>{e.preventDefault();saveLink()}}><h3>超链接</h3><label>显示文字<input autoFocus value={linkDraft.label} onChange={e=>setLinkDraft({...linkDraft,label:e.target.value})}/></label><label>网址<input placeholder="https://" value={linkDraft.url} onChange={e=>setLinkDraft({...linkDraft,url:e.target.value})}/></label>{linkError&&<p role="alert">{linkError}</p>}<div><button type="button" onClick={()=>setLinkDraft(null)}>取消</button><button type="submit">保存链接</button></div></form></div>}
    {message && <div className="continuous-message" role="status">{message}</div>}
    <div className="continuous-paper-scroll" onClick={event=>{const a=(event.target as HTMLElement).closest('a');if(!a)return;event.preventDefault();const pos=editor.view.posAtDOM(a,0);editor.chain().focus().setTextSelection(pos).extendMarkRange('link').run()}}><EditorContent editor={editor} className="continuous-paper" /></div>
    <footer>{editor.getText().length} 字 · Ctrl+S 保存</footer>
  </section>
}
