import {SidebarSkillResources} from './SidebarSkillResources'
import {ReviewDemoControls} from './ReviewDemoControls'
import { createPortal } from 'react-dom'
import { useState } from 'react'
import { captureProduct, prepareLatestDemo, resetProduct } from '../demoBackup'
import type { Product } from '../productStorage'
import { Modal } from './Modal'
export function DemoDataControls({product}:{product:Product}){
 const [open,setOpen]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[confirmed,setConfirmed]=useState(false),[backup,setBackup]=useState<Awaited<ReturnType<typeof captureProduct>>|null>(null);
 const download=async()=>{setBusy(true);setError('');try{const data=await captureProduct(product),url=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=(product==='research'?'科研':'阅读')+'资料备份-'+Date.now()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);setBackup(data);setConfirmed(false)}catch(e){setError(String(e))}finally{setBusy(false)}};
 return <><SidebarSkillResources/><ReviewDemoControls product={product}/><button type="button" className="demo-data-control" onClick={()=>{setOpen(true);setBackup(null);setError('');setConfirmed(false)}}>演示资料管理</button>{open&&createPortal(<Modal bodyClassName="demo-data-body" title="备份与重置演示资料" onClose={()=>{if(!busy)setOpen(false)}} onSubmit={async e=>{e.preventDefault();if(!backup||!confirmed||busy)return;setBusy(true);setError('');try{const latest=await prepareLatestDemo(product);await resetProduct(product,backup,latest);location.reload()}catch(e){setError(String(e));setBusy(false)}}} confirmText="重置为最新演示资料" confirmDisabled={busy||!backup||!confirmed}><p>仅替换当前{product==='research'?'智能科研':'智能阅读'}的文件、笔记、表格与空间资料；另一产品和 PRD 评审内容不变。请先保存编辑中的内容。普通升级会保留你的修改。</p><button type="button" disabled={busy} onClick={()=>void download()}>下载当前资料完整备份</button>{backup&&<label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>我已确认备份文件下载完成，同意替换当前产品资料</label>}{error&&<p role="alert">{error}</p>}</Modal>,document.body)}</>
}
