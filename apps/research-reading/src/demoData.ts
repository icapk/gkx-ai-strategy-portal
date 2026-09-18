// Public demo snapshot. Browser changes stay local and are never overwritten on revisits.
const VERSION = '20260918-5174-public-v1'
const MARKER = 'gkx-public-demo:' + VERSION
const DOCS = 'intelligent-research-portal:documents:v1'
const TABLES = 'intelligent-research-portal:data-tables:v1'
const READING = 'gkx-reading-workspace-v1'
type Value = any
const read = (key: string, fallback: Value) => { const raw = localStorage.getItem(key); return raw == null ? fallback : JSON.parse(raw) }
const request = <T,>(r: IDBRequest<T>) => new Promise<T>((resolve, reject) => { r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error) })
export function mergeDocuments(existing: Value, incoming: Value) {
 const result = structuredClone(existing), ids = new Map<number, number>()
 const all = [...result.documents, ...result.recycledDocuments]
 const used = new Set<number>([...all.map((d: Value) => d.id), ...result.deletedDocumentIds])
 let next = Math.max(1000, ...used)
 for (const section of ['documents', 'recycledDocuments']) for (const source of incoming[section]) {
  const found = all.find((d: Value) => d.id === source.id && d.title === source.title)
  const id = found ? found.id : used.has(source.id) ? ++next : source.id
  ids.set(source.id, id); used.add(id)
  if (!found) { const d = structuredClone(source); d.id = id; if (d.pdfArchive) d.pdfArchive.storageKey = 'pdf-' + id; result[section].push(d); all.push(d) }
 }
 result.deletedDocumentIds = [...new Set([...result.deletedDocumentIds, ...incoming.deletedDocumentIds.filter((id: number) => !used.has(id))])]
 return { result, ids }
}
export async function initializePublicDemo() {
 if (localStorage.getItem(MARKER)) return
 const response = await fetch(import.meta.env.BASE_URL + 'demo/manifest.json')
 if (!response.ok) throw Error('演示资料下载失败')
 const manifest = await response.json()
 if (manifest.version !== VERSION) throw Error('演示资料版本不匹配')
 const source = manifest.local as Record<string,string>
 const empty = {version:1, documents:[], recycledDocuments:[], deletedDocumentIds:[]}
 const {result: documents, ids} = mergeDocuments(read(DOCS, empty), JSON.parse(source[DOCS]))
 const pending: Record<string,string> = {...source, [DOCS]: JSON.stringify(documents)}
 const oldTables = read(TABLES, {version:1,tables:{},deletedDocumentIds:[]})
 for (const table of Object.values(JSON.parse(source[TABLES]).tables) as Value[]) {
  const id = ids.get(table.documentId) ?? table.documentId
  if (!oldTables.tables[id]) oldTables.tables[id] = {...table, documentId:id}
 }
 pending[TABLES] = JSON.stringify(oldTables)
 const incoming = JSON.parse(source[READING]), existing = read(READING, {version:1,documents:[],folders:[],notes:[]}), readingIds = new Map<number,number>()
 let nextReading = Math.max(1000,...existing.documents.map((d: Value)=>d.id),...incoming.documents.map((d: Value)=>d.id))
 for (const d of incoming.documents) { const match = existing.documents.find((x: Value)=>x.id===d.id); const id = match && match.title!==d.title ? ++nextReading : d.id; readingIds.set(d.id,id); if(!match || id!==d.id)existing.documents.push({...d,id}) }
 for (const n of incoming.notes) { const note={...n,documentId:readingIds.get(n.documentId)??n.documentId}; if(!existing.notes.some((x: Value)=>x.id===note.id&&x.documentId===note.documentId))existing.notes.push(note) }
 existing.sampleVersion=1;existing.folders=[...new Set([...existing.folders,...incoming.folders])];pending[READING]=JSON.stringify(existing)
 for (const scope of ['personal','team']) { const key='intelligent-research-portal:folders:v1:'+scope;const folders=read(key,[]);let n=Math.max(1000,...folders.map((f: Value)=>f.id));for(const f of JSON.parse(source[key]))if(!folders.some((x: Value)=>x.name===f.name&&x.location===f.location))folders.push({...f,id:folders.some((x: Value)=>x.id===f.id)?++n:f.id});pending[key]=JSON.stringify(folders) }
 for (const key of Object.keys(pending)) { if ([DOCS,TABLES,READING].includes(key)||key.startsWith('intelligent-research-portal:folders:'))continue; if(key==='research:quick-access:v1'){ const values=JSON.parse(source[key]).map((s: string)=>s.replace(/(\d+)$/,v=>String(ids.get(Number(v))??v)));pending[key]=JSON.stringify([...new Set([...read(key,[]),...values])]) }else if(localStorage.getItem(key)!=null)delete pending[key] }
 const binary = new Map<string,ArrayBuffer>()
 async function decode(v: Value): Promise<Value> { if(v&&v.__kind&&v.path){let data=binary.get(v.path);if(!data){const r=await fetch(import.meta.env.BASE_URL+v.path);if(!r.ok)throw Error('演示附件下载失败');data=await r.arrayBuffer();const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',data))).map(x=>x.toString(16).padStart(2,'0')).join('');if(digest!==v.sha256)throw Error('演示附件校验失败');binary.set(v.path,data)}if(v.__kind==='ArrayBuffer')return data;if(v.__kind==='File')return new File([data],v.name,{type:v.type,lastModified:v.lastModified});return new Blob([data],{type:v.type})}if(Array.isArray(v))return Promise.all(v.map(decode));if(v&&typeof v==='object')return Object.fromEntries(await Promise.all(Object.entries(v).map(async([k,x])=>[k,await decode(x)])));return v }
 const prepared=[]
 for(const db of manifest.databases){const stores=[];for(const store of db.stores){const records=[];for(const r of store.records){const value=await decode(r.value);const original=value.documentId??r.key;const id=ids.get(original)??original;let key=r.key;if(value.documentId!=null){value.documentId=id;if(Array.isArray(value.annotations))value.annotations=value.annotations.map((a: Value)=>({...a,documentId:id,imageAssetKey:a.imageAssetKey?.replace(String(original)+':',String(id)+':')}));if(value.assetKey){value.assetKey=value.assetKey.replace(String(original)+':',String(id)+':');key=value.assetKey}else key=id}else key=id;records.push({key,value})}stores.push({...store,records})}prepared.push({...db,stores})}
 for(const info of prepared){const open=indexedDB.open(info.name,info.version);open.onupgradeneeded=()=>{const db=open.result;for(const s of info.stores){const st=db.objectStoreNames.contains(s.name)?open.transaction!.objectStore(s.name):db.createObjectStore(s.name,{keyPath:s.keyPath,autoIncrement:s.autoIncrement});for(const ix of s.indexes)if(!st.indexNames.contains(ix.name))st.createIndex(ix.name,ix.keyPath,{unique:ix.unique,multiEntry:ix.multiEntry})}};const db=await request(open);try{for(const s of info.stores){const tx=db.transaction(s.name,'readwrite'),store=tx.objectStore(s.name);const done=new Promise<void>((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)});for(const r of s.records){const get=store.getKey(r.key);get.onsuccess=()=>{if(get.result===undefined){if(s.keyPath)store.put(r.value);else store.put(r.value,r.key)}}}await done}}finally{db.close()}}
 const previous=Object.fromEntries(Object.keys(pending).map(k=>[k,localStorage.getItem(k)]))
 try { for(const [key,value] of Object.entries(pending))localStorage.setItem(key,value);localStorage.setItem(MARKER,'ready') }
 catch(e){for(const [key,value]of Object.entries(previous)){if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value)}throw e}
}
