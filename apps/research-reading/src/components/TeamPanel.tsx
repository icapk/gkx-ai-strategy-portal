import { useEffect, useMemo, useRef, useState } from 'react'
import type { CommentItem, MemberItem, TeamPanelTab, TodoItem } from '../types'

interface TeamPanelProps {
  tab: TeamPanelTab
  todos: TodoItem[]
  comments: CommentItem[]
  members: MemberItem[]
  onTabChange: (tab: TeamPanelTab) => void
  onToggleTodo: (id: number) => void
  onDeleteTodo: (id: number) => void
  onAddTodoRequest: () => void
  onAddComment: (content: string, attachment?: string, replyTo?: string, parentCommentId?: number) => void
  onInvite: () => void
  onMemberRoleChange: (id: number, role: MemberItem['role']) => void
  onRemoveMember: (id: number) => void
}

const tabs: Array<{ id: TeamPanelTab; label: string }> = [
  { id: 'todo', label: '待办' },
  { id: 'comments', label: '评论' },
  { id: 'members', label: '成员' },
]

type CommentRange = 'week' | 'month' | 'quarter' | 'all'

const commentRanges: Array<{ id: CommentRange; label: string; days: number }> = [
  { id: 'week', label: '最近1周', days: 7 },
  { id: 'month', label: '最近1月', days: 31 },
  { id: 'quarter', label: '最近3月', days: 93 },
  { id: 'all', label: '全部评论', days: Number.POSITIVE_INFINITY },
]

function commentAgeInDays(time: string) {
  if (time === '刚刚') return 0
  if (time === '昨天') return 1
  const amount = Number.parseInt(time, 10)
  if (!Number.isFinite(amount)) return 0
  if (time.includes('分钟') || time.includes('小时')) return amount / 24
  if (time.includes('周')) return amount * 7
  if (time.includes('月')) return amount * 30
  return amount
}

export function TeamPanel({
  tab,
  todos,
  comments,
  members,
  onTabChange,
  onToggleTodo,
  onDeleteTodo,
  onAddTodoRequest,
  onAddComment,
  onInvite,
  onMemberRoleChange,
  onRemoveMember,
}: TeamPanelProps) {
  const [comment, setComment] = useState('')
  const [attachment, setAttachment] = useState('')
  const [replyToId, setReplyToId] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [commentRange, setCommentRange] = useState<CommentRange>('month')
  const [commentRangeOpen, setCommentRangeOpen] = useState(false)
  const [roleMenuMemberId, setRoleMenuMemberId] = useState<number | null>(null)
  const commentRangeRef = useRef<HTMLDivElement>(null)
  const completedCount = todos.filter((item) => item.done).length
  const selectedCommentRange = commentRanges.find((item) => item.id === commentRange) ?? commentRanges[1]
  const visibleComments = useMemo(() => comments
    .filter((item) => item.parentCommentId == null && commentAgeInDays(item.time) <= selectedCommentRange.days)
    .sort((first, second) => commentAgeInDays(first.time) - commentAgeInDays(second.time)), [comments, selectedCommentRange.days])

  useEffect(() => {
    if (roleMenuMemberId == null) return
    const close = () => setRoleMenuMemberId(null)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [roleMenuMemberId])

  useEffect(() => {
    if (!commentRangeOpen) return
    const closeOnPointerDown = (event: PointerEvent) => {
      if (!commentRangeRef.current?.contains(event.target as Node)) setCommentRangeOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCommentRangeOpen(false)
    }
    window.addEventListener('pointerdown', closeOnPointerDown)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('pointerdown', closeOnPointerDown)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [commentRangeOpen])

  const submitComment = () => {
    if (!comment.trim() && !attachment) return
    onAddComment(comment.trim() || '已上传附件', attachment || undefined)
    setComment('')
    setAttachment('')
  }

  const submitReply = (item: CommentItem) => {
    const value = replyText.trim()
    if (!value) return
    onAddComment(value, undefined, item.author, item.id)
    setReplyToId(null)
    setReplyText('')
  }

  return (
    <aside className="team-panel" aria-label="团队协作面板">
      <div className="team-panel-tabs" role="tablist">
        {tabs.map((item) => (
          <button
            type="button"
            role="tab"
            key={item.id}
            className={tab === item.id ? 'is-active' : ''}
            aria-selected={tab === item.id}
            onClick={() => onTabChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'todo' && (
        <div className="panel-content todo-panel">
          <div className="panel-heading-row">
            <strong>待办事项·{todos.length}项</strong>
            <button className="quiet-select" type="button">最近1月<img src="/assets/direction-down.svg" alt="" /></button>
          </div>
          <div className="todo-list">
            {todos.map((todo) => (
              <article className={`todo-item${todo.done ? ' is-done' : ''}`} key={todo.id}>
                <div className="todo-title"><span className={`priority-dot priority-dot--${todo.level}`} />{todo.title}</div>
                <div className="todo-meta">
                  <span>截止：{todo.due}</span>
                  <span className="todo-actions">
                    {todo.done ? <span className="todo-complete-label">已完成</span> : <><button type="button" aria-label="删除待办" onClick={() => onDeleteTodo(todo.id)}><span className="icon-close" aria-hidden="true" /></button><button type="button" aria-label="完成待办" onClick={() => onToggleTodo(todo.id)}><span className="icon-check" aria-hidden="true" /></button></>}
                  </span>
                </div>
              </article>
            ))}
          </div>
          <div className="todo-summary">
            <span>已完成 {completedCount}/{todos.length} 项</span>
            <button type="button" onClick={onAddTodoRequest}><span className="icon-plus" aria-hidden="true" />添加</button>
            <div className="progress-track"><span style={{ width: `${todos.length ? (completedCount / todos.length) * 100 : 0}%` }} /></div>
          </div>
        </div>
      )}

      {tab === 'comments' && (
        <div className="panel-content comments-panel">
          <div className="panel-heading-row">
            <strong className="panel-title">近期评论·{visibleComments.length}条</strong>
            <div className="comment-range" ref={commentRangeRef}>
              <button
                className="comment-range-trigger"
                type="button"
                aria-haspopup="menu"
                aria-expanded={commentRangeOpen}
                onClick={() => setCommentRangeOpen((open) => !open)}
              >
                {selectedCommentRange.label}
                <span className={`comment-range-chevron${commentRangeOpen ? ' is-open' : ''}`} aria-hidden="true">
                  <img src="/assets/figma/comment-filter-chevron.svg" alt="" />
                </span>
              </button>
              {commentRangeOpen && (
                <div className="comment-range-menu" role="menu" aria-label="评论时间范围">
                  {commentRanges.map((range) => (
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={range.id === commentRange}
                      className={range.id === commentRange ? 'is-selected' : ''}
                      key={range.id}
                      onClick={() => { setCommentRange(range.id); setCommentRangeOpen(false) }}
                    >{range.label}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="comment-list">
            {visibleComments.map((item) => {
              const replyCount = comments.filter((commentItem) => commentItem.parentCommentId === item.id).length
              return (
              <article className="comment-item" key={item.id}>
                <div className="comment-head">
                  <div className="comment-avatar">{item.author.slice(0, 1)}</div>
                  <div className="comment-identity">
                    <div className="comment-author">{item.author}</div>
                    <time>{item.time}</time>
                  </div>
                  <button type="button" className="comment-reply-trigger" onClick={() => { setReplyToId(item.id); setReplyText('') }}>
                    <img src="/assets/figma/comment-reply.svg" alt="" />回复
                  </button>
                </div>
                <p>{item.content}</p>
                {item.attachment && <button type="button" className="attachment-chip"><img src="/assets/figma/comment-attachment.svg" alt="" />{item.attachment}</button>}
                {replyCount > 0 && <button className="comment-replies-count" type="button">{replyCount}条回复<img src="/assets/figma/comment-filter-chevron.svg" alt="" /></button>}
                {replyToId === item.id && (
                  <div className="comment-inline-reply">
                    <textarea value={replyText} onChange={(event) => setReplyText(event.target.value)} autoFocus aria-label={`回复${item.author}`} placeholder="回复" />
                    <div><button type="button" onClick={() => { setReplyToId(null); setReplyText('') }}>取消</button><i aria-hidden="true" /><button type="button" disabled={!replyText.trim()} onClick={() => submitReply(item)}>确定</button></div>
                  </div>
                )}
              </article>
            )})}
          </div>
          <div className="comment-composer">
            <div className="comment-editor-box">
              <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="添加评论..." />
              {attachment && <span className="attachment-preview"><i>PDF</i><b>{attachment}</b><button type="button" aria-label="移除附件" onClick={() => setAttachment('')}><span aria-hidden="true" /></button></span>}
              <div className="comment-tools">
                <label className="upload-link" aria-label="添加附件"><img src="/assets/figma/comment-composer-attachment.svg" alt="" /><input type="file" onChange={(event) => setAttachment(event.target.files?.[0]?.name ?? '')} /></label>
              </div>
            </div>
            <button className="button button--primary comment-send" type="button" onClick={submitComment}>发送评论</button>
          </div>
        </div>
      )}

      {tab === 'members' && (
        <div className="panel-content members-panel">
          <div className="panel-heading-row">
            <strong>团队成员·{members.length}人</strong>
            <button type="button" className="primary-link" onClick={onInvite}><img src="/assets/figma/invite-member.svg" alt="" />邀请</button>
          </div>
          <div className="member-list">
            {members.map((member) => (
              <article className="member-item" key={member.id}>
                <span className="member-avatar member-avatar--status" style={{ background: member.color }}>{member.initials}<i className={member.status === '在线' ? 'is-online' : ''} /></span>
                <span><strong>{member.name}</strong><small>{member.status}</small></span>
                <span className="member-role-wrap">
                  <button
                    type="button"
                    className={`role-badge role-badge--${member.role === '管理员' ? 'admin' : member.role === '编辑者' ? 'editor' : 'viewer'}`}
                    aria-label={`${member.name}权限设置`}
                    aria-expanded={roleMenuMemberId === member.id}
                    disabled={member.role === '管理员'}
                    onClick={(event) => { event.stopPropagation(); setRoleMenuMemberId((current) => current === member.id ? null : member.id) }}
                  >{member.role}{member.role !== '管理员' && <img src="/assets/direction-down.svg" alt="" />}</button>
                  {roleMenuMemberId === member.id && (
                    <div className="member-role-menu" role="menu" onClick={(event) => event.stopPropagation()}>
                      <button type="button" role="menuitem" onClick={() => { onMemberRoleChange(member.id, '管理员'); setRoleMenuMemberId(null) }}>管理员</button>
                      <button type="button" role="menuitem" className={member.role === '编辑者' ? 'is-current' : ''} onClick={() => { onMemberRoleChange(member.id, '编辑者'); setRoleMenuMemberId(null) }}>编辑者</button>
                      <button type="button" role="menuitem" className={member.role === '查看员' ? 'is-current' : ''} onClick={() => { onMemberRoleChange(member.id, '查看员'); setRoleMenuMemberId(null) }}>查看员</button>
                      <button type="button" role="menuitem" className="is-danger" onClick={() => { onRemoveMember(member.id); setRoleMenuMemberId(null) }}>可移除</button>
                    </div>
                  )}
                  <small className="member-joined-at">{member.joinedAt}</small>
                </span>
              </article>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
