import {facetCount} from '../facetCounts.ts'
import {matchesPrdFilters,matchesPrdQuery,prdDisplayNumbers} from './prdDisplay.ts'
import type {PrdArea} from './prd.ts'
import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { PrdFilters } from './prdDisplay.ts'

export function ReviewBottomTools({product,children,slot='actions'}:{product:'research'|'reading';children:ReactNode;slot?:'actions'|'version'}) {
  const [target,setTarget]=useState<HTMLElement|null>(null)
  useEffect(()=>{setTarget(document.getElementById(`${product}-review-${slot==='version'?'version':'tools'}`))},[product,slot])
  return target ? createPortal(children,target) : null
}
export function PrdFilterControls({filters,onChange,areas,query,chapter}:{filters:PrdFilters;onChange:(value:PrdFilters)=>void;areas:PrdArea[];query:string;chapter:string}) {
  const numbers=prdDisplayNumbers(areas),items=areas.filter(a=>chapter==='overview'||a.id===chapter).flatMap(a=>a.features).filter(f=>matchesPrdQuery(f,query,numbers[f.id]))
  const count=(key:keyof PrdFilters,value:string)=>facetCount(items,filters,key,value,matchesPrdFilters)
  return <div className="review-filter-grid prd-filter-controls">
    <label>优先级<select aria-label="PRD优先级筛选" value={filters.priority} onChange={e=>onChange({...filters,priority:e.target.value})}><option value="">全部（{count('priority','')}）</option>{['P0','P1','P2'].map(v=><option key={v} value={v}>{v}（{count('priority',v)}）</option>)}</select></label>
    <label>着重讲解<select aria-label="PRD着重讲解筛选" value={filters.emphasis} onChange={e=>onChange({...filters,emphasis:e.target.value})}><option value="">全部（{count('emphasis','')}）</option><option value="true">是（{count('emphasis','true')}）</option><option value="false">否（{count('emphasis','false')}）</option></select></label>
    <label>设计进度<select aria-label="PRD设计进度筛选" value={filters.progress} onChange={e=>onChange({...filters,progress:e.target.value})}><option value="">全部（{count('progress','')}）</option>{['待讨论','待完善','已完成'].map(v=><option key={v} value={v}>{v}（{count('progress',v)}）</option>)}</select></label>
  </div>
}
export function PrdExportButton({count,onClick}:{count:number;onClick:()=>void}) {
  return <span className="prd-export-hint"><button title={`当前版本约 ${count} 字，导出 Markdown 文件`} onClick={onClick}>导出 PRD</button><span role="tooltip">当前版本约 {count} 字 · Markdown</span></span>
}
