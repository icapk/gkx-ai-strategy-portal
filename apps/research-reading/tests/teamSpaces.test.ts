import test from 'node:test'
import assert from 'node:assert/strict'
import { validateTeamSpace, normalizeRole } from '../src/teamSpaces.ts'
import type { TeamSpace } from '../src/teamSpaces.ts'
const space: TeamSpace = { name: '研究组', description: '', members: [{ id: 1, name: '测试管理员', role: '管理员', initials: '测', color: '#000', status: '在线', joinedAt: '2026-09-09' }] }
test('空间允许空简介，但拒绝空名称、路径名称和重名', () => {
  assert.equal(validateTeamSpace(space, []), '')
  assert.ok(validateTeamSpace({ ...space, name: ' ' }, []))
  assert.ok(validateTeamSpace({ ...space, name: '组/子组' }, []))
  assert.ok(validateTeamSpace(space, [space]))
})
test('移除或降级最后一名管理员不能保存，保留其他管理员时允许', () => {
  assert.ok(validateTeamSpace({ ...space, members: [] }, []))
  assert.ok(validateTeamSpace({ ...space, members: [{ ...space.members[0], role: '可查看' }] }, []))
  assert.equal(validateTeamSpace({ ...space, members: [{ ...space.members[0], role: '可查看' }, { ...space.members[0], id: 2 }] }, []), '')
})
test('历史角色名称迁移为新文案', () => {
  assert.equal(normalizeRole('编辑者'), '可编辑')
  assert.equal(normalizeRole('查看员'), '可查看')
  assert.equal(normalizeRole('管理员'), '管理员')
})
