import type { MemberItem } from './types'
import { currentIdentity, type PortalIdentity } from './portalIdentity.ts'
export interface TeamSpace { name: string; description: string; members: MemberItem[]; institutionId?:string }
export const teamSpacesKey = 'research:team-spaces:v1'
export const normalizeRole = (role:string) => ['管理员','管理'].includes(role)?'管理':['编辑者','可编辑','编辑'].includes(role)?'编辑':'查看'
export function validateTeamSpace(space: TeamSpace, others: TeamSpace[], previous?:TeamSpace, actor:PortalIdentity=currentIdentity()) {
  if (!space.name.trim() || space.name.length > 30 || /[/\\]/.test(space.name)) return '空间名称须为 1 至 30 个字符，不能包含路径分隔符'
  if (others.some((item) => item.name.toLocaleLowerCase() === space.name.trim().toLocaleLowerCase())) return '空间名称已存在'
  if(new Set(space.members.map(m=>m.id)).size!==space.members.length)return '同一账号不能重复加入'
  if((space.institutionId??'demo-institution')!==actor.institutionId)return '不能管理其他机构团队'
  if(previous&&space.members.some(m=>m.portalRole!==previous.members.find(p=>p.id===m.id)?.portalRole))return '团队配置不能修改门户角色'
  if(previous?.members.some(m=>m.portalRole==='管理员'&&!space.members.some(n=>n.id===m.id&&normalizeRole(n.role)==='管理')))return '机构管理员的管理权限不可移除'
  if(previous&&actor.role!=='管理员'){
    if(normalizeRole(previous.members.find(m=>m.id===actor.id)?.role??'')!=='管理')return '需要团队管理权限'
    for(const member of previous.members.filter(m=>normalizeRole(m.role)==='管理')){
      if(normalizeRole(space.members.find(m=>m.id===member.id)?.role??'')!=='管理')return '不能移除或降级同级管理者'
    }
  }
  if(!previous&&actor.role!=='管理员'&&!space.members.some(m=>m.id===actor.id&&normalizeRole(m.role)==='管理'))return '创建者须保留管理权限'
  return ''
}
