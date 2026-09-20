import {StrictMode,useMemo,useState} from 'react'
import {createRoot} from 'react-dom/client'
import {ReviewShell,type ReviewHost} from './ReviewShell.tsx'
import {catalogs,productLabels,type Product} from './sidebar.config.ts'
import './demo.css'
function Demo(){
 const product:Product=new URLSearchParams(location.search).get('view')==='reading'?'reading':'research'
 const [query,setQuery]=useState(''),[name,setName]=useState(''),[records,setRecords]=useState(['需求评审记录','设计讨论摘要']),[compact,setCompact]=useState(false),[saved,setSaved]=useState(false)
 const host=useMemo<ReviewHost>(()=>({prepareTarget:()=>undefined,restorer:{capture:()=>product==='research'?{schema:1,product,section:'workbench',tab:'recent',surface:'workspace'}:{schema:1,product,view:'library'},restore:state=>state.product!==product?'请先切换到正确产品':undefined}}),[product])
 return <ReviewShell product={product} host={host} context={JSON.stringify(product==='research'?{product,section:'workbench',tab:'recent',surface:'workspace'}:{product,view:'library'})}><header className="demo-header"><h1>{productLabels[product]} · 侧边栏接入示例</h1><p>左侧是真实可编辑的评审组件。右侧是最小示例，不会读取原项目资料。业务示例刷新会重置，侧栏修改会保留。</p></header><section data-focus-id={product+'-query'}><h2>内容查询</h2><label>搜索示例记录<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="输入关键词"/></label><ul>{records.filter(r=>r.includes(query)).map((r,i)=><li key={i} style={{padding:compact?'4px':'12px'}}>{r}</li>)}</ul>{!records.some(r=>r.includes(query))&&<p>没有匹配的记录</p>}</section><section data-focus-id={product+'-create'}><h2>创建记录</h2><form onSubmit={e=>{e.preventDefault();if(name.trim()){setRecords(r=>[...r,name.trim()]);setName('')}}}><label>记录名称<input required value={name} onChange={e=>setName(e.target.value)}/></label><button>创建</button><button type="button" onClick={()=>setName('')}>取消</button></form></section><section data-focus-id={product+'-settings'}><h2>偏好设置</h2><label><input type="checkbox" checked={compact} onChange={e=>{setCompact(e.target.checked);setSaved(false)}}/>紧凑显示</label><button onClick={()=>setSaved(true)}>保存偏好</button>{saved&&<p role="status">已保存（本次演示会话）</p>}</section><p>示例功能：{catalogs[product].points.length} 项。可直接尝试定位、框选校正、编辑、导出与注释。</p></ReviewShell>
}
createRoot(document.getElementById('root')!).render(<StrictMode><Demo/></StrictMode>)
