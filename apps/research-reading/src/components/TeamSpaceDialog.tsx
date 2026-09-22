import {currentIdentity} from '../portalIdentity'
import {normalizeRole} from '../teamSpaces'
import { useEffect, useState } from 'react'
import { usePrototypeFocus } from '../prototypeFocus/FocusContext'
import { Modal } from './Modal'
import type { TeamSpace } from '../teamSpaces'
import { MemberPicker, type CandidateRole, type MemberCandidate } from './MemberPicker'
export function TeamSpaceDialog({ space, candidates, onSave, onClose }: { space: TeamSpace; candidates: MemberCandidate[]; onSave: (space: TeamSpace) => string; onClose: () => void }) {
  const [tab, setTab] = useState<'info' | 'members'>('info')
  const [draft, setDraft] = useState(() => ({ ...space, members: space.members.map((member) => ({ ...member })) }))
  const [picking,setPicking]=useState(false),[selection,setSelection]=useState<string[]>([]),[roles,setRoles]=useState<Record<string,CandidateRole>>({}),[search,setSearch]=useState('')
  const [error, setError] = useState('')
  const {request, ready} = usePrototypeFocus()
  useEffect(() => {
    if (request?.module !== 'research' || request.target?.surface !== 'members') return
    setTab('members')
    ready(request.sequence)
  }, [request, ready])
  const protectedMember=(id:number)=>space.members.some(m=>m.id===id&&(m.portalRole==='管理员'||(currentIdentity().role!=='管理员'&&normalizeRole(m.role)==='管理')))
  const available = candidates.filter((candidate) => !draft.members.some((member) => member.id === candidate.accountId)).filter((candidate, index, all) => all.findIndex((other) => other.name === candidate.name) === index)
  return <>{!picking&&<Modal title="空间管理" onClose={onClose} wide onSubmit={(event) => { event.preventDefault(); setError(onSave({ ...draft, name: draft.name.trim() })) }} confirmText="保存">
    <div className="subtabs" role="tablist" aria-label="空间管理分类">{(['info', 'members'] as const).map((id) => <button type="button" key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'is-active' : ''} onClick={() => setTab(id)}>{id === 'info' ? '基础信息' : '成员管理'}</button>)}</div>
    {error && <p role="alert" className="field-error">{error}</p>}
    {tab === 'info' ? <div role="tabpanel" aria-label="基础信息"><label className="field-label" htmlFor="manage-team-name">空间名称（必填）</label><input id="manage-team-name" className="text-field" value={draft.name} maxLength={30} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /><label className="field-label" htmlFor="manage-team-description">空间简介（选填）</label><textarea id="manage-team-description" className="text-field" rows={3} maxLength={500} placeholder="请输入空间简介" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></div> : <div role="tabpanel" aria-label="成员管理">
      <button type="button" className="button button--secondary" onClick={()=>{setSelection([]);setSearch('');setRoles({});setPicking(true)}}>添加成员</button>
      <div className="team-management-members">{draft.members.map((member) => <div className="team-management-member" key={member.id}><span className="owner-cell"><img src="/assets/avatar-owner.svg" alt="" /><span>{member.name}<small className="member-email">{candidates.find(c=>c.name===member.name)?.email??member.email??''}</small></span></span><span>{member.id===currentIdentity().id?currentIdentity().role:(member.portalRole??'普通成员')}</span><select disabled={protectedMember(member.id)} aria-label={`${member.name}操作权限`} value={member.role} onChange={(event) => setDraft({ ...draft, members: draft.members.map((item) => item.id === member.id ? { ...item, role: event.target.value } : item) })}>{['管理', '编辑', '查看'].map((role) => <option key={role}>{role}</option>)}</select><button disabled={protectedMember(member.id)} type="button" className="danger-link" onClick={() => setDraft({ ...draft, members: draft.members.filter((item) => item.id !== member.id) })}>移除</button></div>)}</div>
    </div>}
  </Modal>}{picking&&<Modal title="添加团队成员" wide onClose={()=>setPicking(false)} confirmText="加入成员列表" onSubmit={event=>{event.preventDefault();const chosen=available.filter(c=>selection.includes(c.id));setDraft({...draft,members:[...draft.members,...chosen.map((c,i)=>({id:c.accountId??Math.max(0,...draft.members.map(m=>m.id))+i+1,name:c.name,email:c.email,role:roles[c.id]||'查看',initials:c.name[0],color:c.color,status:'在线' as const,joinedAt:new Date().toISOString().slice(0,10)}))]});setPicking(false)}}><p>左侧只显示尚未加入本空间的人员；选择后可在右侧设置操作权限。加入列表后，点击空间管理“保存”生效。</p><MemberPicker candidates={available} selectedIds={selection} roles={roles} search={search} onSearchChange={setSearch} onToggle={id=>setSelection(ids=>ids.includes(id)?ids.filter(x=>x!==id):[...ids,id])} onRemove={id=>setSelection(ids=>ids.filter(x=>x!==id))} onRoleChange={(id,role)=>setRoles({...roles,[id]:role})}/></Modal>}</>
}
