import { useMemo, useRef, useState, type FormEvent } from 'react'
import type { ResearchDocument, ResearchNote } from '../types'
import { displayResearchLocation } from '../workbenchDocuments'
import { Modal } from './Modal'

interface NoteDetailDialogProps {
  note: ResearchNote
  documentItem: ResearchDocument
  onClose: () => void
  onEdit: () => void
  onOpenDocument: () => void
}

export function NoteDetailDialog({ note, documentItem, onClose, onEdit, onOpenDocument }: NoteDetailDialogProps) {
  return (
    <Modal
      title="笔记详情"
      onClose={onClose}
      onSubmit={(event) => { event.preventDefault(); onEdit() }}
      cancelText="关闭"
      confirmText="编辑笔记"
      wide
      bodyClassName="research-note-detail-body"
    >
      <section className="research-note-detail" aria-label={note.title}>
        <div className="research-note-heading">
          <span className="research-note-type">笔记</span>
          <h3>{note.title}</h3>
          <p>更新于 {note.updatedAt}</p>
        </div>
        <button className="research-note-source" type="button" onClick={onOpenDocument}>
          <span>来源文档</span>
          <strong>{documentItem.title}</strong>
          <small>{displayResearchLocation(documentItem.location)}</small>
          <i aria-hidden="true" />
        </button>
        <div className="research-note-content">
          <span>笔记内容</span>
          <p>{note.content}</p>
        </div>
        {note.tags.length > 0 && <div className="research-note-tags" aria-label="笔记标签">
          {note.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>}
      </section>
    </Modal>
  )
}

interface NoteEditorDialogProps {
  note?: ResearchNote
  documentItem: ResearchDocument
  onClose: () => void
  onSave: (value: { title: string; content: string; tags: string[] }) => void
}

export function NoteEditorDialog({ note, documentItem, onClose, onSave }: NoteEditorDialogProps) {
  const initial = useMemo(() => ({
    title: note?.title ?? '',
    content: note?.content ?? '',
    tags: note?.tags.join('，') ?? '',
  }), [note])
  const [title, setTitle] = useState(initial.title)
  const [content, setContent] = useState(initial.content)
  const [tags, setTags] = useState(initial.tags)
  const [errors, setErrors] = useState<{ title?: string; content?: string; tags?: string }>({})
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const tagsRef = useRef<HTMLInputElement>(null)
  const isDirty = title !== initial.title || content !== initial.content || tags !== initial.tags

  const requestClose = () => {
    if (isDirty) {
      setConfirmDiscard(true)
      return
    }
    onClose()
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedTitle = title.normalize('NFC').trim()
    const normalizedContent = content.normalize('NFC').trim()
    const normalizedTags = Array.from(new Set(tags
      .split(/[，,]/)
      .map((tag) => tag.normalize('NFC').trim())
      .filter(Boolean)))
    const nextErrors: { title?: string; content?: string; tags?: string } = {}
    if (!normalizedTitle) nextErrors.title = '请输入笔记标题'
    if (!normalizedContent) nextErrors.content = '请输入笔记内容'
    if (normalizedTags.length > 6) nextErrors.tags = '最多添加 6 个标签'
    setErrors(nextErrors)
    if (nextErrors.title) {
      titleRef.current?.focus()
      return
    }
    if (nextErrors.content) {
      contentRef.current?.focus()
      return
    }
    if (nextErrors.tags) {
      tagsRef.current?.focus()
      return
    }
    onSave({ title: normalizedTitle, content: normalizedContent, tags: normalizedTags })
  }

  if (confirmDiscard) {
    return (
      <Modal
        title="放弃未保存的笔记？"
        onClose={() => setConfirmDiscard(false)}
        onSubmit={(event) => { event.preventDefault(); onClose() }}
        cancelText="继续编辑"
        confirmText="放弃修改"
        confirmDanger
      >
        <p className="discard-message">当前笔记还有未保存的修改，放弃后无法恢复。</p>
      </Modal>
    )
  }

  return (
    <Modal
      title={note ? '编辑笔记' : '新建笔记'}
      onClose={requestClose}
      onSubmit={submit}
      confirmText={note ? '保存修改' : '保存笔记'}
      wide
      bodyClassName="research-note-editor-body"
    >
      <div className="research-note-document-context">
        <span>关联文档</span>
        <strong>{documentItem.title}</strong>
        <small>{displayResearchLocation(documentItem.location)}</small>
      </div>
      <label className="field-label" htmlFor="research-note-title"><span className="required-mark">*</span> 笔记标题：</label>
      <input
        ref={titleRef}
        className="text-field"
        id="research-note-title"
        value={title}
        autoFocus
        maxLength={50}
        aria-invalid={Boolean(errors.title)}
        aria-describedby={errors.title ? 'research-note-title-error' : undefined}
        placeholder="请输入笔记标题"
        onChange={(event) => { setTitle(event.target.value); if (errors.title) setErrors((current) => ({ ...current, title: undefined })) }}
      />
      {errors.title && <p className="field-error" id="research-note-title-error">{errors.title}</p>}
      <label className="field-label" htmlFor="research-note-content"><span className="required-mark">*</span> 笔记内容：</label>
      <textarea
        ref={contentRef}
        className="text-field research-note-textarea"
        id="research-note-content"
        value={content}
        maxLength={1000}
        aria-invalid={Boolean(errors.content)}
        aria-describedby={errors.content ? 'research-note-content-error' : 'research-note-content-count'}
        placeholder="记录关键结论、待办或研究想法"
        onChange={(event) => { setContent(event.target.value); if (errors.content) setErrors((current) => ({ ...current, content: undefined })) }}
      />
      <div className="field-meta-row">
        {errors.content ? <p className="field-error" id="research-note-content-error">{errors.content}</p> : <span />}
        <small id="research-note-content-count">{content.length}/1000</small>
      </div>
      <label className="field-label" htmlFor="research-note-tags">标签：</label>
      <input
        ref={tagsRef}
        className="text-field"
        id="research-note-tags"
        value={tags}
        maxLength={80}
        aria-invalid={Boolean(errors.tags)}
        aria-describedby={errors.tags ? 'research-note-tags-error' : 'research-note-tags-help'}
        placeholder="多个标签请用逗号分隔"
        onChange={(event) => { setTags(event.target.value); if (errors.tags) setErrors((current) => ({ ...current, tags: undefined })) }}
      />
      {errors.tags
        ? <p className="field-error" id="research-note-tags-error">{errors.tags}</p>
        : <p className="field-help" id="research-note-tags-help">最多保存 6 个标签，便于后续检索。</p>}
    </Modal>
  )
}
