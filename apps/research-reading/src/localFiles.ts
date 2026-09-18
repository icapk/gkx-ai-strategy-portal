import type { ResearchDocument } from './types'
const openFiles = () => new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open('research-original-files', 1)
  request.onupgradeneeded = () => request.result.createObjectStore('files')
  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error)
})
export async function saveOriginalFile(id: number, file: File) {
  const db = await openFiles()
  try { await new Promise<void>((resolve, reject) => { const tx = db.transaction('files', 'readwrite'); tx.objectStore('files').put(file, id); tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error) }) } finally { db.close() }
}
export async function deleteOriginalFile(id: number) {
  const db = await openFiles()
  try { await new Promise<void>((resolve, reject) => { const tx = db.transaction('files', 'readwrite'); tx.objectStore('files').delete(id); tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error) }) } finally { db.close() }
}
export async function downloadOriginalFile(item: ResearchDocument) {
  const db = await openFiles()
  try {
    const file = await new Promise<Blob | undefined>((resolve, reject) => { const request = db.transaction('files').objectStore('files').get(item.id); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error) })
    if (!file) throw new Error('原始文件不存在，请重新上传。')
    const url = URL.createObjectURL(file); const link = document.createElement('a'); link.href = url; link.download = item.originalFileName ?? item.title; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  } finally { db.close() }
}
export async function loadOriginalFile(id: number): Promise<Blob> {
  const db = await openFiles()
  try { const file = await new Promise<Blob | undefined>((resolve, reject) => { const request = db.transaction('files').objectStore('files').get(id); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error) }); if (!file) throw new Error('没有可读取的原始文件，请重新上传。'); return file } finally { db.close() }
}
