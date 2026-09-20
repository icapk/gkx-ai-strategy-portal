import { useEffect, useId, useRef } from 'react'
import './annotations.css'
import {groupShareTargets,shareTargetLabel} from './shareTargets'

export interface ShareTargetSelectProps {
  value: string; onChange: (value: string) => void
  options: { value: string; label: string }[]
  expanded: boolean; onExpandedChange: (expanded: boolean) => void; label?: string
}
export function ShareTargetSelect({ value, onChange, options, expanded, onExpandedChange, label = '目标空间 / 文件夹' }: ShareTargetSelectProps) {
  const root = useRef<HTMLDivElement>(null), listId = useId()
  const groups=groupShareTargets(options)
  const optionButton=(o:{value:string;label:string})=><button key={o.value} type="button" role="option" title={shareTargetLabel(o.value)} aria-label={shareTargetLabel(o.value)} aria-selected={o.value===value} style={{paddingLeft:12+Math.max(0,o.value.split('/').length-1)*16}} onClick={()=>{onChange(o.value);onExpandedChange(false)}}>{o.value.includes('/')?'📁 '+o.value.split('/').at(-1):'根目录'}</button>
  useEffect(() => {
    const outside = (e: PointerEvent) => {
      if ((e.target as Element).closest('.annotation-session-toolbar,.annotation-draw-layer,.annotation-dialog-backdrop,.annotation-overlay,.modal-footer,.modal-close,[data-focus-id^="annotation-create"]')) return
      if (!root.current?.contains(e.target as Node)) onExpandedChange(false)
    }
    if (expanded) document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [expanded, onExpandedChange])
  return <div className="annotation-share-select" ref={root} data-focus-id="share-target-select">
    <span className="annotation-share-label">{label}</span>
    <button type="button" role="combobox" aria-label={label} aria-controls={listId} aria-expanded={expanded} aria-haspopup="listbox" onClick={() => onExpandedChange(!expanded)} onKeyDown={e => { if (e.key === 'ArrowDown') { e.preventDefault(); onExpandedChange(true) }; if (e.key === 'Escape') { e.stopPropagation(); onExpandedChange(false) } }}>{shareTargetLabel(value)}<span aria-hidden="true"> ▾</span></button>
    {expanded && <div id={listId} role="listbox" aria-label={label} className="annotation-share-options" data-focus-id="share-target-options" onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();onExpandedChange(false);root.current?.querySelector<HTMLButtonElement>('[role="combobox"]')?.focus()}}}>
      <div role="group" aria-label="个人空间"><strong className="share-space-heading">个人空间</strong>{groups.personal.length?groups.personal.map(optionButton):<p className="share-empty">暂无可选目录</p>}</div>
      <div role="group" aria-label="团队空间"><strong className="share-space-heading">团队空间</strong>{groups.teams.length?groups.teams.map(team=><details key={team.name} open={value===team.name||value.startsWith(team.name+'/')}><summary>{team.name}</summary><div role="group" aria-label={team.name}>{team.items.map(optionButton)}</div></details>):<p className="share-empty">暂无可选团队</p>}</div>
    </div>}
  </div>
}
