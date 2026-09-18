import { useEffect, useState } from 'react'
import { usePrototypeFocus } from '../prototypeFocus/FocusContext'
import { Modal } from './Modal'
import type { TeamSpace } from '../teamSpaces'
import type { MemberCandidate } from './MemberPicker'
export function TeamSpaceDialog({ space, candidates, onSave, onClose }: { space: TeamSpace; candidates: MemberCandidate[]; onSave: (space: TeamSpace) => string; onClose: () => void }) {
  const [tab, setTab] = useState<'info' | 'members'>('info')
  const [draft, setDraft] = useState(() => ({ ...space, members: space.members.map((member) => ({ ...member })) }))
  const [candidateId, setCandidateId] = useState('')
  const [error, setError] = useState('')
  const {request, ready} = usePrototypeFocus()
  useEffect(() => {
    if (request?.module !== 'research' || request.target?.surface !== 'members') return
    setTab('members')
    ready(request.sequence)
  }, [request, ready])
  const available = candidates.filter((candidate) => !draft.members.some((member) => member.name === candidate.name)).filter((candidate, index, all) => all.findIndex((other) => other.name === candidate.name) === index)
  return <Modal title="空间管理" onClose={onClose} wide onSubmit={(event) => { event.preventDefault(); setError(onSave({ ...draft, name: draft.name.trim() })) }} confirmText="保存">
    <div className="subtabs" role="tablist" aria-label="空间管理分类">{(['info', 'members'] as const).map((id) => <button type="button" key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'is-active' : ''} onClick={() => setTab(id)}>{id === 'info' ? '基础信息' : '成员管理'}</button>)}</div>
    {error && <p role="alert" className="field-error">{error}</p>}
    {tab === 'info' ? <div role="tabpanel" aria-label="基础信息"><label className="field-label" htmlFor="manage-team-name">空间名称（必填）</label><input id="manage-team-name" className="text-field" value={draft.name} maxLength={30} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /><label className="field-label" htmlFor="manage-team-description">空间简介（选填）</label><textarea id="manage-team-description" className="text-field" rows={3} maxLength={500} placeholder="请输入空间简介" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></div> : <div role="tabpanel" aria-label="成员管理">
      <div className="team-member-add"><select className="text-field" aria-label="选择添加成员" value={candidateId} onChange={(event) => setCandidateId(event.target.value)}><option value="">选择成员</option>{available.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name}（{candidate.email}）</option>)}</select><button className="button button--secondary" type="button" disabled={!candidateId} onClick={() => { const candidate = available.find((item) => item.id === candidateId); if (!candidate) return; setDraft({ ...draft, members: [...draft.members, { id: Math.max(0, ...draft.members.map((member) => member.id)) + 1, name: candidate.name, role: '可查看', initials: candidate.name[0], color: candidate.color, status: '在线', joinedAt: new Date().toISOString().slice(0, 10) }] }); setCandidateId('') }}>添加成员</button></div>
      <div className="team-management-members">{draft.members.map((member) => <div className="team-management-member" key={member.id}><span className="owner-cell"><img src="/assets/avatar-owner.svg" alt="" />{member.name}</span><select aria-label={`${member.name}角色`} value={member.role} onChange={(event) => setDraft({ ...draft, members: draft.members.map((item) => item.id === member.id ? { ...item, role: event.target.value } : item) })}>{['管理员', '可编辑', '可查看'].map((role) => <option key={role}>{role}</option>)}</select><button type="button" className="danger-link" onClick={() => setDraft({ ...draft, members: draft.members.filter((item) => item.id !== member.id) })}>移除</button></div>)}</div>
    </div>}
  </Modal>
}
