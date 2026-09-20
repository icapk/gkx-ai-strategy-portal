import {reviewRequest as fetch} from '../reviewTransport'
import {useEffect,useRef,useState} from 'react'
import {initialReadingBook,type ReadingBook} from './prdBook'
import {validReadingBook} from '../../server/readingPrdValidation.mjs'
import {migrateReadingBook} from './prdMigration'
import {readingAreas} from './catalog'
type Snapshot={revision:number;book:ReadingBook|null}
const endpoint='/api/reading-prd'
export function useReadingPrd(){
 const [snapshot,setSnapshot]=useState<Snapshot>({revision:0,book:null}),[status,setStatus]=useState('连接阅读PRD共享服务…')
 const latest=useRef(snapshot),busy=useRef(false),alive=useRef(true)
 const accept=(next:Snapshot)=>{if(next.book&&!validReadingBook(next.book))throw Error('共享记录格式异常，未覆盖旧记录');if(next.revision<latest.current.revision)return;latest.current=next;if(alive.current)setSnapshot(next)}
 const save=async(book:ReadingBook,expectedRevision=latest.current.revision)=>{
  if(busy.current){setStatus('正在保存，请稍后再试');return false}
  busy.current=true
  try{
   const res=await fetch(endpoint,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({expectedRevision,book})})
   const next=await res.json()
   if(res.status===409){accept(next);setStatus('保存冲突：共享记录已更新，当前输入仍保留。');return false}
   if(!res.ok)throw Error(next.error||'共享保存失败')
   accept(next);setStatus(`已共享保存 · 修订 ${next.revision}`);return true
  }catch(e){setStatus(`${e instanceof Error?e.message:'共享连接失败'}；输入保留，可重试。`);return false}finally{busy.current=false}
 }
 useEffect(()=>{
  alive.current=true;let running=false
  const pull=async()=>{if(running||busy.current)return;running=true;try{
   const res=await fetch(endpoint,{cache:'no-store'});const next=await res.json();if(!res.ok)throw Error(next.error||'读取失败')
   if(busy.current)return
   accept(next)
   if(!next.book){await save(initialReadingBook(),0)}else {const upgraded=migrateReadingBook(next.book,readingAreas);if(upgraded!==next.book)await save(upgraded,next.revision);else setStatus(`共享已连接 · 修订 ${latest.current.revision}`)}
  }catch(e){if(alive.current)setStatus(`${e instanceof Error?e.message:'服务不可用'}；未覆盖任何记录。`)}finally{running=false}}
  void pull();const timer=setInterval(pull,1800);return()=>{alive.current=false;clearInterval(timer)}
 },[])
 return {book:snapshot.book,revision:snapshot.revision,status:import.meta.env.PROD?status.replaceAll("共享","本浏览器").replaceAll("服务","存储"):status,save}
}
