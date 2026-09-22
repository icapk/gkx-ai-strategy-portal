import type { ResearchDocument } from './types'
import { normalizeRole, type TeamSpace } from './teamSpaces.ts'
import { currentIdentity, type PortalIdentity } from './portalIdentity.ts'
export const sameName=(a:string,b:string)=>a.normalize('NFC').trim().toLocaleLowerCase()===b.normalize('NFC').trim().toLocaleLowerCase()
export const isPersonalLocation=(location:string)=>location==='我的空间'||location.startsWith('我的空间/')
export function teamAccess(team:TeamSpace|undefined,actor:PortalIdentity=currentIdentity()) {
 if(!team||(team.institutionId??'demo-institution')!==actor.institutionId)return null
 if(actor.role==='管理员')return '管理'
 const member=team.members.find(m=>m.id===actor.id)
 return member?normalizeRole(member.role):null
}
export function canRead(location:string,teams:TeamSpace[],actor=currentIdentity()){return isPersonalLocation(location)||!!teamAccess(teams.find(t=>t.name===location.split('/')[0]),actor)}
export function canChange(location:string,teams:TeamSpace[],managementOnly=false,actor=currentIdentity()){
 if(isPersonalLocation(location))return true
 const access=teamAccess(teams.find(t=>t.name===location.split('/')[0]),actor)
 return access==='管理'||(!managementOnly&&access==='编辑')
}
export function moveResearchDocument(item:ResearchDocument,location:string,documents:ResearchDocument[],teams:TeamSpace[],_now:string){
 if(!canChange(item.location,teams)||!canChange(location,teams))throw Error('当前权限不允许移动源文件或写入目标空间')
 if(!isPersonalLocation(item.location)&&isPersonalLocation(location))throw Error('团队资料不能移回个人空间')
 if(item.location===location)throw Error('请选择不同的目标位置')
 if(documents.some(d=>d.id!==item.id&&d.location===location&&d.kind===item.kind&&sameName(d.title,item.title)))throw Error('目标目录已有同类型同名文件，请先重命名')
 const personal=isPersonalLocation(location)
 return {...item,location,spaceScope:personal?'personal' as const:'team' as const,shared:!personal,owned:personal}
}
export function recycleExpired(deletedAt?:string,now=new Date()){if(!deletedAt)return false;const time=Date.parse(deletedAt.replace(' ','T'));return Number.isFinite(time)&&now.getTime()-time>=30*86400000}
export type RetainedItem={deletedAt?:string;retentionPolicy?:'30-days-v1'}
export function automaticRecycleDue(item:RetainedItem,now=new Date()){return item.retentionPolicy==='30-days-v1'&&recycleExpired(item.deletedAt,now)}
export function historicalRecycleDue(_item:RetainedItem,_now=new Date()){return false}
export function retentionLabel(item:RetainedItem,now=new Date()){if(!item.retentionPolicy)return '历史资料 · 不自动清理';if(!item.deletedAt)return '删除时间未记录';if(automaticRecycleDue(item,now))return '已到期 · 等待有权限时清理';const time=Date.parse(item.deletedAt.replace(' ','T'));return Number.isFinite(time)?'距自动清理 '+Math.max(0,Math.ceil((time+30*86400000-now.getTime())/86400000))+' 天':'删除时间异常 · 不自动清理'}
