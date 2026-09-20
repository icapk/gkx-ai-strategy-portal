import {localStorage} from '../storage.ts'
import {catalogs} from '../sidebar.config.ts'
export const statuses = ['已合规', '待定', '不合规'] as const
export const priorities = ['P0', 'P1', 'P2'] as const
export type Status = typeof statuses[number]
export type Priority = typeof priorities[number]
export interface ReviewPoint { id: string; parent: string; parentTitle: string; group: number; story: number; title: string; requirement: string; acceptance: string; baseline: { status: Status; reason: string; evidence: string }; priority: Priority }
export const groups=catalogs.research.groups
export const points:ReviewPoint[]=catalogs.research.points
export interface ReviewEvent { at: string; from: Status; to: Status; fromPriority: Priority; toPriority: Priority; note: string }
export interface ReviewRecord { status: Status; priority: Priority; history: ReviewEvent[]; title?:string; requirement?:string; acceptance?:string; relationIds?:string[]; note?:string }
export interface ReviewFile { version: 1; records: Record<string, ReviewRecord> }
export const STORAGE_KEY = 'research-compliance-review-v1'
export const freshReview = (): ReviewFile => ({ version:1, records:Object.fromEntries(points.map(p => [p.id,{status:p.baseline.status,priority:p.priority,history:[]}])) })
export function parseReview(value: unknown): ReviewFile {
  if (!value || typeof value !== 'object') throw new Error('文件不是审核记录。')
  const file = value as ReviewFile
  if(file.version!==1 || !file.records || typeof file.records!=='object' || Array.isArray(file.records)) throw new Error('审核文件版本或结构不受支持。')
  const allowed = new Set(points.map(p=>p.id))
  for(const [id,r] of Object.entries(file.records)) {
    if(!allowed.has(id) || !r || !statuses.includes(r.status) || !priorities.includes(r.priority) || !Array.isArray(r.history) || r.history.length>10000) throw new Error(`功能 ${id} 的审核记录无效。`)
    for(const key of ['title','requirement','acceptance','note'] as const) if(r[key]!==undefined&&(typeof r[key]!=='string'||r[key]!.length>10000))throw new Error('编辑内容无效。')
    if(r.relationIds!==undefined&&(!Array.isArray(r.relationIds)||r.relationIds.some(id=>typeof id!=='string')))throw new Error('关联功能点无效。')
    for(const h of r.history) if(!h || !Number.isFinite(Date.parse(h.at)) || !statuses.includes(h.from) || !statuses.includes(h.to) || !priorities.includes(h.fromPriority) || !priorities.includes(h.toPriority) || typeof h.note!=='string' || h.note.length>10000) throw new Error(`功能 ${id} 的历史记录无效。`)
  }
  return {version:1,records:Object.fromEntries(Object.entries(file.records).map(([id,r])=>[id,{...r,history:[]}]))}
}
export function loadReview(): {data:ReviewFile; error:string} {
  try {const raw=localStorage.getItem(STORAGE_KEY); const data=freshReview(); if(!raw)return {data,error:''}; const saved=parseReview(JSON.parse(raw)); const records={...data.records}; for(const [id,record] of Object.entries(saved.records)) records[id]=record; try{localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,records}))}catch{} return { data: {version:1, records}, error:'' }}
  catch {return {data:freshReview(), error:'本地审核记录无法读取，暂显示默认审核状态。'}}
}
export interface Filters { mode:'design'|'prd'|'annotations'; group:string; parent:string; child:string; stories:number[]; statuses:Status[]; priorities:Priority[] }
export const initialFilters = (): Filters => ({mode:'design',group:'',parent:'',child:'',stories:[0,1,2,3,4],statuses:[...statuses],priorities:[...priorities]})
export function matches(p:ReviewPoint,data:ReviewFile,f:Filters,ignore?:'status'|'priority'|'hierarchy') {
  const r=data.records[p.id]
  return (ignore==='status'||f.statuses.includes(r.status)) && (ignore==='priority'||f.priorities.includes(r.priority)) &&
    ignore==='hierarchy'|| ((!f.group||p.group===Number(f.group))&&(!f.parent||p.parent===f.parent)&&(!f.child||p.id===f.child))
}
