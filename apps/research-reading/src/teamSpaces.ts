import type { MemberItem } from './types'
export interface TeamSpace { name: string; description: string; members: MemberItem[] }
export const teamSpacesKey = 'research:team-spaces:v1'
export const normalizeRole = (role: string) => role === '编辑者' ? '可编辑' : role === '查看员' ? '可查看' : role
export function validateTeamSpace(space: TeamSpace, others: TeamSpace[]) {
  if (!space.name.trim() || space.name.length > 30 || /[/\\]/.test(space.name)) return '空间名称须为 1 至 30 个字符，不能包含路径分隔符'
  if (others.some((item) => item.name.toLocaleLowerCase() === space.name.trim().toLocaleLowerCase())) return '空间名称已存在'
  if (!space.members.some((member) => member.role === '管理员')) return '至少保留一名管理员'
  return ''
}
