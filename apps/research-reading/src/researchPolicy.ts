import type { ResearchDocument } from './types'
import type { TeamSpace } from './teamSpaces'
export const sameName=(a:string,b:string)=>a.normalize('NFC').trim().toLocaleLowerCase()===b.normalize('NFC').trim().toLocaleLowerCase()
export function canChange(location:string,teams:TeamSpace[],admin=false){if(location==='我的空间'||location.startsWith('我的空间/'))return true;const role=teams.find(t=>t.name===location.split('/')[0])?.members.find(m=>m.id===1)?.role;return role==='管理员'||(!admin&&role==='可编辑')}
export function moveResearchDocument(item:ResearchDocument,location:string,documents:ResearchDocument[],teams:TeamSpace[],now:string){if(!canChange(item.location,teams)||!canChange(location,teams))throw Error('当前角色无权移动源文件或写入目标空间');if(item.location===location)throw Error('请选择不同的目标位置');if(documents.some(d=>d.id!==item.id&&d.location===location&&d.kind===item.kind&&sameName(d.title,item.title)))throw Error('目标目录已有同类型同名文件，请先重命名');const personal=location==='我的空间'||location.startsWith('我的空间/');return {...item,location,spaceScope:personal?'personal' as const:'team' as const,shared:!personal,owned:personal,updatedAt:now}}
export function recycleExpired(deletedAt?:string,now=new Date()){if(!deletedAt)return false;const time=Date.parse(deletedAt.replace(' ','T'));return Number.isFinite(time)&&now.getTime()-time>=30*86400000}

export type RetainedItem={deletedAt?:string;retentionPolicy?:'30-days-v1'}
export function automaticRecycleDue(item:RetainedItem,now=new Date()){return recycleExpired(item.deletedAt,now)}
export function historicalRecycleDue(_item:RetainedItem,_now=new Date()){return false // All dated items now share the same retention period.
}
export function retentionLabel(item:RetainedItem,now=new Date()){if(!item.deletedAt)return '删除时间未记录';if(automaticRecycleDue(item,now))return '已到期 · 等待有权限时清理';const time=Date.parse(item.deletedAt.replace(' ','T'));return Number.isFinite(time)?'距自动清理 '+Math.max(0,Math.ceil((time+30*86400000-now.getTime())/86400000))+' 天':'删除时间异常 · 不自动清理'}
