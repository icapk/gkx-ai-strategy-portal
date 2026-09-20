import {useState} from 'react'
import {createPortal} from 'react-dom'
import {Modal} from './Modal'

export function SidebarSkillResources(){
 const [open,setOpen]=useState(false)
 return <><button type="button" className="demo-data-control" onClick={()=>setOpen(true)}>侧边栏复用资源</button>{open&&createPortal(<Modal title="侧边栏复用资源" onClose={()=>setOpen(false)} wide hideFooter><iframe title="侧边栏 skill 使用说明与下载" src={`${import.meta.env.BASE_URL}skills/index.html`} style={{width:'100%',height:'65vh',border:0}}/></Modal>,document.body)}</>
}
