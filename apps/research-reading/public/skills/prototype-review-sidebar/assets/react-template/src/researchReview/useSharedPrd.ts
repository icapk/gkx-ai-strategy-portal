import {runtime} from '../sidebar.config.ts'
import {localStorage} from '../storage.ts'
import {reviewRequest as fetch} from '../reviewTransport.ts'
import { useEffect, useRef, useState } from 'react'
import { loadPrdBook, PRD_KEY, type PrdBook } from './prdStore.ts'
import { hasLocalEdits, importBrowserBook, upgradeBook } from './prdMigration.ts'

interface Shared { revision:number; book:PrdBook|null }
const endpoint='/api/research-prd'
export function useSharedPrd() {
 const [loaded]=useState(loadPrdBook),[book,setBook]=useState(()=>upgradeBook(loaded.book))
 const [status,setStatus]=useState('正在连接共享记录'),[notice,setNotice]=useState(loaded.error)
 const shared=useRef<Shared>({revision:-1,book:null}),busy=useRef(false),ready=useRef(false)
 const accept=(value:Shared)=>{
  if(value.book&&value.revision>=shared.current.revision){shared.current=value;setBook(value.book)}
 }
 const put=async(value:PrdBook,revision:number)=>{
  const response=await fetch(endpoint,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({expectedRevision:revision,book:value})})
  const result=await response.json()
  if(response.status===409){accept(result);throw Error('另一窗口已保存新版本。当前输入已保留，请对比最新内容后重试。')}
  if(!response.ok)throw Error(result.error||'共享保存失败')
  accept(result)
 }
 useEffect(()=>{
  let disposed=false
  const initialize=async()=>{
   try{
    const response=await fetch(endpoint,{cache:'no-store'})
    if(!response.ok)throw Error('共享服务暂不可用')
    let value:Shared=await response.json()
    if(disposed)return
    if(!value.book){await put(upgradeBook(loaded.book),value.revision);value=shared.current}
    else if(!value.book.revisions.some(v=>v.id==='v3-rules')){await put(upgradeBook(value.book),value.revision);value=shared.current}
    accept(value)
    const raw=localStorage.getItem(PRD_KEY)
    if(raw&&hasLocalEdits(loaded.book)){
     const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw)))).map(v=>v.toString(16).padStart(2,'0')).join('')
     const imported=importBrowserBook(shared.current.book!,loaded.book,hash)
     if(imported.book!==shared.current.book){
      await put(imported.book,shared.current.revision)
      setNotice(imported.conflicts?`已备份此浏览器旧记录；${imported.conflicts} 个功能存在不同修改，保留在“浏览器备份”版本供对比，未覆盖共享稿。`:'此浏览器既有修改已迁移，原记录与历史备份均已保留。')
     }
    }
    ready.current=true;setStatus('已同步')
   }catch(error){if(!disposed)setStatus(error instanceof Error?error.message:'共享连接失败')}
  }
  void initialize()
  const poll=async()=>{
   if(disposed||busy.current)return
   if(!ready.current){await initialize();return}
   try{
    const response=await fetch(endpoint,{cache:'no-store'})
    if(!response.ok)throw Error()
    const value:Shared=await response.json()
    if(!disposed&&!busy.current){accept(value);setStatus('已同步')}
   }catch{if(!disposed)setStatus('连接中断 · 未保存的输入仍保留')}
  }
  const timer=setInterval(()=>void poll(),1800)
  window.addEventListener('focus',poll)
  return()=>{disposed=true;clearInterval(timer);window.removeEventListener('focus',poll)}
 },[])
 const save=async(next:PrdBook):Promise<boolean>=>{
  if(!ready.current||busy.current){setStatus('连接或保存尚未完成，请稍后重试');return false}
  if(book!==shared.current.book){setStatus('共享版本已变化，请重新核对再保存');return false}
  busy.current=true;setStatus('正在保存')
  try{await put(next,shared.current.revision);setStatus('已同步');return true}
  catch(error){setStatus(error instanceof Error?error.message:'保存失败，输入已保留');return false}
  finally{busy.current=false}
 }
 return {book,save,status:(runtime.storageMode==='browser')?status.replaceAll("共享","本浏览器").replaceAll("服务","存储"):status,notice}
}
