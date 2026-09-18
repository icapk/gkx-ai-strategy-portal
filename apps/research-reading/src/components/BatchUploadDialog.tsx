import { useRef, useState } from 'react'
import { Modal } from './Modal'
type Entry = { file: File; status: string; done: boolean }
export function BatchUploadDialog({ onClose, onUpload }: { onClose: () => void; onUpload: (file: File) => Promise<void> }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [busy, setBusy] = useState(false)
  const folderInput = useRef<HTMLInputElement>(null)
  const addFiles = (files: FileList | null) => {
    if (!files) return
    setEntries((current) => [...current, ...Array.from(files).filter((file) => !current.some((item) => (item.file.webkitRelativePath || item.file.name) === (file.webkitRelativePath || file.name) && item.file.size === file.size)).map((file) => ({ file, status: '待上传', done: false }))])
  }
  const submit = async () => {
    if (busy) return
    setBusy(true)
    try { for (let index = 0; index < entries.length; index++) {
      const entry = entries[index]; if (entry.done) continue
      setEntries((items) => items.map((item, i) => i === index ? { ...item, status: '正在上传…' } : item))
      try { await onUpload(entry.file); setEntries((items) => items.map((item, i) => i === index ? { ...item, status: '上传成功', done: true } : item)) }
      catch (error) { setEntries((items) => items.map((item, i) => i === index ? { ...item, status: `失败：${error instanceof Error ? error.message : '保存失败，请重试'}` } : item)) }
    } } finally { setBusy(false) }
  }
  return <Modal title="上传文件或文件夹" auditTarget="research-import" onClose={() => { if (!busy) onClose() }} onSubmit={(event) => { event.preventDefault(); void submit() }} confirmText={busy ? '正在上传…' : '上传 / 重试失败项'} confirmDisabled={busy || entries.length === 0 || entries.every((entry) => entry.done)} cancelText="关闭">
    <p>支持批量选择本地文档，或选择文件夹导入其中全部文件并保留目录层级。可多次选择文件夹；浏览器不提供空文件夹。单文件最大 50 MB，原文件保存在当前浏览器本地。</p>
    <div className="upload-pickers"><label className="button button--secondary">选择文件<input type="file" multiple disabled={busy} onChange={(event) => { addFiles(event.target.files); event.target.value = '' }} /></label><button type="button" className="button button--secondary" disabled={busy} onClick={() => folderInput.current?.click()}>选择文件夹</button><input hidden type="file" multiple ref={(input) => { folderInput.current = input; input?.setAttribute('webkitdirectory', '') }} disabled={busy} onChange={(event) => { addFiles(event.target.files); event.target.value = '' }} /></div>
    <div className="batch-upload-list" aria-live="polite">{entries.map((entry, index) => <div key={`${entry.file.webkitRelativePath || entry.file.name}:${index}`}><span>{entry.file.webkitRelativePath || entry.file.name}</span><span>{entry.status}</span></div>)}</div>
  </Modal>
}
