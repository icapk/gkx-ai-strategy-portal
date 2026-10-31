import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync, createPortal } from 'react-dom';
import Collapse from '@arco-design/web-react/es/Collapse';
import Button from '@arco-design/web-react/es/Button';
import Input from '@arco-design/web-react/es/Input';
import Radio from '@arco-design/web-react/es/Radio';
import Tag from '@arco-design/web-react/es/Tag';
import Pagination from '@arco-design/web-react/es/Pagination';
import Drawer from '@arco-design/web-react/es/Drawer';
import IconLoading from '@arco-design/web-react/icon/react-icon/IconLoading';
import IconCheck from '@arco-design/web-react/icon/react-icon/IconCheck';
import IconCopy from '@arco-design/web-react/icon/react-icon/IconCopy';
import '@arco-design/web-react/es/Collapse/style/css.js';
import '@arco-design/web-react/es/Drawer/style/css.js';
import demoSources from './ai-demo-sources.json';

// Interaction references: Vercel AI Elements reasoning and chain-of-thought.
// Workflow descriptions and research samples are prototype data, not model reasoning.
const topics = [
  { key: 'evidence', name: '科研证据检索与核对', test: /证据|可追溯|科研智能体|文献/,
    conclusion: '将检索、来源记录和结论核对串成可追溯流程，是这组资料共同关注的方向。',
    paper: '论文侧重文献检索、来源记录与结论核对的工作流程。',
    patent: '专利方案侧重把检索词、来源片段与核对记录关联为证据链。',
    next: '二者可对照阅读：前者说明研究流程，后者展示资料关联的技术方案。' },
  { key: 'material', name: '多模态材料分析', test: /多模态|材料|电池/,
    conclusion: '材料分析中的共同线索，是联合组织图像、文本和结构化实验资料。',
    paper: '论文比较图像、文本和结构化资料的组织与核对方式。',
    patent: '专利方案展示材料图像特征、文本说明和实验记录的关联处理。',
    next: '两类资料都涉及多模态信息组织，可进一步核对其数据条件与处理流程。' },
  { key: 'drug', name: '药物发现与候选排序', test: /药物|靶点|生物医学/,
    conclusion: '药物发现资料主要围绕知识整合、候选排序和后续核对展开。',
    paper: '论文介绍知识图谱、证据检索和人工复核的衔接。',
    patent: '专利方案展示多来源生物医学资料的召回、解释及核对流程。',
    next: '论文和专利分别提供研究方法与方案线索；摘要没有提供真实候选的验证结果。' }
];
const questions = ['AI在药物靶点发现中有哪些研究与专利线索？', 'AI在多模态材料分析中有哪些应用？', '科研智能体如何组织文献证据？'];
const topicFor = source => source.id.startsWith('ai-demo-')
  ? topics[Number(source.id.at(-1)) - 1].key
  : topics.find(topic => topic.test.test(`${source.title} ${source.summary}`))?.key || 'evidence';
const initialState = () => ({ query: '', draft: '', sources: [], step: -1, phase: 'idle', ready: false, chunks: 0,
  open: true, manualOpen: false, filter: '全部', sourcePage: 1, expanded: new Set(), focused: '', copied: false,
  error: '', awaiting: false, running: false, startedAt: 0, elapsed: 0, mobileSourcesOpen: false,
  layout: 'centered', sourcesVisible: false });
let state = initialState();
let roots;
let callbacks;
let generation = 0;
let timers = new Set();
let focusTicket = 0;
let shiftCleanup;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = () => window.innerWidth <= 900;
const pageVisible = () => !document.getElementById('searchResultsPage').hidden && document.getElementById('searchResultsPage').classList.contains('is-ai');
function syncLayout() {
  const page = document.getElementById('searchResultsPage');
  page.dataset.aiStage = state.layout;
  page.dataset.aiSources = String(state.sourcesVisible);
  const sources = document.getElementById('portalAiCitations');
  sources.inert = !mobile() && !state.sourcesVisible;
  sources.setAttribute('aria-hidden', String(!mobile() && !state.sourcesVisible));
}
function render() {
  if (!roots) return;
  syncLayout();
  flushSync(() => {
    roots.conversation.render(<Conversation />);
    roots.composer.render(<Composer />);
    roots.sources.render(<Sources />);
  });
}
function renderComposer() { if (roots) flushSync(() => roots.composer.render(<Composer />)); }
function renderSources() { if (roots) { syncLayout(); flushSync(() => roots.sources.render(<Sources />)); } }
function stopTimers() { generation += 1; timers.forEach(clearTimeout); timers.clear(); shiftCleanup?.(); shiftCleanup = null; }
function later(ms, action) {
  const version = generation;
  const timer = setTimeout(() => { timers.delete(timer); if (version === generation && pageVisible()) action(); }, ms);
  timers.add(timer);
}
function makeSources(query, fallback) {
  const matched = topics.filter(topic => topic.test.test(query));
  const useDemo = matched.length || /^ai$/i.test(query.trim()) || /人工智能/.test(query);
  const sources = useDemo ? demoSources.filter(source => !matched.length || matched.some(topic => topic.key === topicFor(source))) : fallback;
  return sources.map((source, index) => ({ ...source, number: index + 1, topic: topicFor(source) }));
}
function sections() {
  return topics.map(topic => ({ ...topic, sources: state.sources.filter(source => source.topic === topic.key) })).filter(topic => topic.sources.length);
}
function sourcePageSize() {
  if (state.expanded.size) return 1;
  if (mobile()) return window.innerHeight < 700 ? 1 : 2;
  if (window.innerHeight < 650) return 1;
  if (window.innerHeight < 800) return 2;
  return 3;
}
function cite(id) {
  state.filter = '全部'; state.expanded = new Set([id]); state.sourcePage = Math.floor(state.sources.findIndex(source => source.id === id) / sourcePageSize()) + 1; state.focused = id;
  state.mobileSourcesOpen = mobile() && state.sourcesVisible; renderSources();
  requestAnimationFrame(() => {
    const card = document.getElementById(`portal-ai-source-${id}`);
    if (state.sourcesVisible) card?.focus({ preventScroll: true });
  });
  const ticket = ++focusTicket;
  later(1400, () => { if (ticket === focusTicket) { state.focused = ''; renderSources(); } });
}
// Keep the same conversation and composer nodes throughout the sequence.
// References become interactive only after the actual slide has finished.
function revealSources() {
  state.layout = 'settled'; state.sourcesVisible = true;
  state.mobileSourcesOpen = mobile() && Boolean(state.focused);
  renderSources();
}
function settleConversation() {
  if (state.layout === 'settled' || reduced() || mobile()) { revealSources(); return; }
  const version = generation;
  const conversation = document.getElementById('portalAiConversation');
  const finish = () => {
    if (generation !== version || !pageVisible()) return;
    shiftCleanup?.(); shiftCleanup = null; revealSources();
  };
  const onEnd = event => { if (event.target === conversation && event.propertyName === 'transform') finish(); };
  conversation.addEventListener('transitionend', onEnd);
  shiftCleanup = () => conversation.removeEventListener('transitionend', onEnd);
  state.layout = 'shifting'; syncLayout();
  // Also settle if a resize or interrupted transition suppresses transitionend.
  later(760, finish);
}
function Citation({ source }) {
  return <Button type="text" size="mini" className="portal-ai-citation" aria-label={`查看引用${source.number}：${source.title}`} onClick={() => cite(source.id)}>{source.number}</Button>;
}
function Citations({ sources }) { return sources.map(source => <Citation key={source.id} source={source} />); }
function Process() {
  const complete = state.step >= 3;
  const labels = ['语义检索 · 深度解析中', '语义检索 · 正在匹配资料', 'AI解读 · 整理核心要点'];
  const summary = complete ? '已完成语义检索与AI解读' : labels[state.step] || '正在准备检索';
  const descriptions = ['运用自然语言处理（NLP）与机器学习技术，深度解析用户查询语义', state.step >= 2 ? '已完成学术文献匹配' : '正在匹配最具价值的学术文献', ''];
  const stepNames = ['深度解析', '精准匹配', '自动提取论文核心要点'];
  return <Collapse bordered={false} lazyload={false} destroyOnHide={false} expandIconPosition="right"
    className="portal-ai-process" activeKey={state.open ? ['process'] : []}
    onChange={(_, keys) => { state.open = keys.includes('process'); state.manualOpen = true; render(); }}>
    <Collapse.Item name="process" header={<div className="portal-ai-process-heading">
      {complete ? <IconCheck className="portal-ai-process-complete" /> : state.running ? <IconLoading className="portal-ai-process-loading" /> : <span className="portal-ai-pending-dot" />}
      <span className="portal-ai-process-summary" aria-live="polite">{summary}</span>

    </div>}>
      <ol className="portal-ai-process-groups" aria-label="检索与解读过程">
        {[{ title: '语义检索', steps: [0, 1] }, { title: 'AI解读', steps: [2] }].map((group, groupIndex) => <li key={group.title}>
          <div className="portal-ai-group-heading"><span className="portal-ai-group-number">{groupIndex + 1}</span><h3>{group.title}</h3><span>{state.step > group.steps.at(-1) ? '已完成' : state.running && group.steps.includes(state.step) ? '进行中' : '等待中'}</span></div>
          <ol>{group.steps.map(index => {
            const done = state.step > index;
            const active = state.running && state.step === index;
            return <li className={`portal-ai-step${active ? ' is-active' : ''}${done ? ' is-complete' : ''}`} key={index}>
              <span className="portal-ai-step-marker" aria-hidden="true">{done ? <IconCheck /> : active ? <IconLoading /> : <span />}</span>
              <div><strong>{stepNames[index]}</strong>{descriptions[index] && <p>{descriptions[index]}</p>}</div>
              <span className="portal-ai-step-status">{done ? '已完成' : active ? '进行中' : '等待中'}</span>
            </li>;
          })}</ol>
        </li>)}
      </ol>
    </Collapse.Item>
  </Collapse>;
}
function Answer() {
  const groups = sections();
  if (!state.chunks) return <div className="portal-ai-answer-skeleton" role="status" aria-label="正在整理相关资料"><i /><i /><i /><p>正在整理与你的问题相关的资料</p></div>;
  if (!state.sources.length) return <div className="portal-ai-answer-empty"><h2>暂无可引用的论文或专利资料</h2><p>可尝试更换主题词，或减少问题中的限定条件后重新检索。</p></div>;
  return <div className="portal-ai-answer-content" id="portalAiAnswerContent" aria-busy={state.phase !== 'done'}>
    <section className="portal-ai-answer-block" key="intro"><p>围绕你的问题，当前资料可归纳为{groups.map(group => `“${group.name}”`).join('、')}等线索。下面结合论文研究与专利方案，整理它们关注的问题和相互关系。</p></section>
    {state.chunks >= 2 && <section className="portal-ai-answer-block" key="conclusions"><h2>一、结论概览</h2><ol>{groups.map(group => <li key={group.key}><strong>{group.name}：</strong>{group.sources.every(source => source.id.startsWith('ai-demo-')) ? group.conclusion : group.sources[0].summary}<Citations sources={group.sources} /></li>)}</ol></section>}
    {state.chunks >= 3 && <section className="portal-ai-answer-block" key="comparison"><h2>二、论文与专利的主要线索</h2><div className="portal-ai-table-wrap"><table><thead><tr><th>研究方向</th><th>论文研究</th><th>专利方案</th></tr></thead><tbody>{groups.map(group => <tr key={group.key}><th scope="row">{group.name}</th>{['论文', '专利'].map(type => {
      const items = group.sources.filter(source => source.type === type);
      const description = !items.length ? '暂无对应资料' : items.every(source => source.id.startsWith('ai-demo-')) ? (type === '论文' ? group.paper : group.patent) : items[0].summary;
      return <td key={type}>{description}<Citations sources={items} /></td>;
    })}</tr>)}</tbody></table></div></section>}
    {state.chunks >= 4 && <section className="portal-ai-answer-block" key="next"><h2>三、如何结合这些资料继续研究</h2>{groups.map(group => <p key={group.key}><strong>{group.name}。</strong>{new Set(group.sources.map(source => source.type)).size > 1 ? group.next : '可进入原始来源继续核对研究方法、数据条件和适用范围。'}<Citations sources={group.sources} /></p>)}<p className="portal-ai-reading-note">本次引用 {state.sources.filter(source => source.type === '论文').length} 篇论文、{state.sources.filter(source => source.type === '专利').length} 项专利，解读依据为摘要。专利方案用于了解技术思路，不能据此认定方案效果已经验证。</p></section>}
  </div>;
}
async function copyAnswer() {
  const content = document.getElementById('portalAiAnswerContent')?.innerText || '';
  const version = generation;
  try { await navigator.clipboard.writeText(content); if (version !== generation) return; state.copied = true; render(); later(1400, () => { state.copied = false; render(); }); }
  catch { state.error = '暂时无法复制，请选择回答文字进行复制。'; render(); }
}
function Conversation() {
  return <>
    <div className="portal-ai-user-message" role="group" aria-label="用户消息"><p id="portalAiQuestion">{state.query}</p></div>
    <Process />
    <Answer />
    {state.phase === 'done' && state.sources.length > 0 && <div className="portal-ai-answer-actions portal-ai-answer-block">
      <Button type="text" size="small" icon={<IconCopy />} onClick={copyAnswer}>{state.copied ? '已复制' : '复制回答'}</Button>
      <span role="status">{state.copied ? '回答已复制到剪贴板' : ''}</span>
    </div>}
    {state.phase === 'done' && <div className="portal-ai-followups portal-ai-answer-block" aria-label="继续研究">
      {['聚焦药物靶点发现', '聚焦多模态材料分析', '聚焦科研证据检索'].map((label, index) => <Button key={label} type="secondary" size="small" onClick={() => submit(questions[index])}>{label}</Button>)}
    </div>}
  </>;
}
function SourceCard({ source }) {
  const expanded = state.expanded.has(source.id);
  return <article className={`portal-ai-source-card${state.focused === source.id ? ' is-focused' : ''}`} id={`portal-ai-source-${source.id}`} tabIndex={-1} aria-label={`${source.number} ${source.type} ${source.title}`}>
    <div className="portal-ai-source-kicker"><span>{source.number}</span><Tag className="portal-ai-source-type">{source.type}</Tag><time>{source.year}</time></div>
    <Button type="text" className="portal-ai-source-title" aria-expanded={expanded} aria-controls={`portal-ai-source-detail-${source.id}`} onClick={() => {
      expanded ? state.expanded.clear() : state.expanded = new Set([source.id]);
      const filtered = state.filter === '全部' ? state.sources : state.sources.filter(item => item.type === state.filter);
      state.sourcePage = Math.floor(filtered.findIndex(item => item.id === source.id) / sourcePageSize()) + 1;
      renderSources();
    }}>{source.title}</Button>
    <p className="portal-ai-source-meta">{source.meta}</p><p className="portal-ai-source-summary">{source.summary}</p>
    {expanded && <div className="portal-ai-source-detail" id={`portal-ai-source-detail-${source.id}`}><strong>摘要依据</strong><p>{source.summary}</p><span>{source.type === '论文' ? '发表日期' : '公布日期'}：{source.date}</span>{source.url && <a href={source.url} target="_blank" rel="noopener noreferrer">打开来源</a>}</div>}
  </article>;
}
function SourceContents() {
  const sources = state.ready ? state.sources : [];
  const filtered = state.filter === '全部' ? sources : sources.filter(source => source.type === state.filter);
  const pageSize = sourcePageSize();
  state.sourcePage = Math.min(state.sourcePage, Math.max(1, Math.ceil(filtered.length / pageSize)));
  const paged = filtered.slice((state.sourcePage - 1) * pageSize, state.sourcePage * pageSize);
  return <>
    <header className="portal-ai-sources-header"><h2>引用结果</h2><span>{sources.length} 条</span>{mobile() && <Button type="text" size="small" onClick={() => { state.mobileSourcesOpen = false; renderSources(); }}>关闭</Button>}</header>
    <div className="portal-ai-source-filters"><Radio.Group name="portal-ai-citation-type" type="button" mode="fill" size="mini" value={state.filter} onChange={value => { state.filter = value; state.sourcePage = 1; state.expanded.clear(); renderSources(); }}>
      {['全部', '论文', '专利'].map(type => <Radio value={type} key={type}>{type} <span>{type === '全部' ? sources.length : sources.filter(source => source.type === type).length}</span></Radio>)}
    </Radio.Group></div>
    <div className="portal-ai-source-list">{!state.ready ? <div className="portal-ai-citation-skeleton"><i /><i /><i /><p>检索完成后显示引用来源</p></div> : filtered.length ? paged.map(source => <SourceCard key={source.id} source={source} />) : <p className="portal-ai-no-sources">暂无{state.filter === '全部' ? '' : state.filter}引用来源</p>}</div>
    {state.ready && filtered.length > 0 && <div className="portal-ai-source-pagination"><Pagination current={state.sourcePage} pageSize={pageSize} total={filtered.length} size="default" simple={mobile()} hideOnSinglePage={false} onChange={page => { state.sourcePage = page; state.focused = ''; renderSources(); }} /></div>}
  </>;
}
function Sources() {
  if (!mobile()) return <SourceContents />;
  return <>
    {createPortal(state.sourcesVisible && <Button type="text" size="small" className="portal-ai-mobile-citations" onClick={() => { state.mobileSourcesOpen = true; renderSources(); }}>引用 {state.sources.length}</Button>, document.getElementById('portalAiMobileSourcesMount'))}
    <Drawer visible={state.mobileSourcesOpen && state.sourcesVisible && pageVisible()} placement="right" width="min(100vw, 420px)" title={null} footer={null} closable={false} escToExit
      className="portal-ai-sources-drawer" bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      onCancel={() => { state.mobileSourcesOpen = false; renderSources(); }}>
      <SourceContents />
    </Drawer>
  </>;
}
function submit(query) {
  if (!query.trim()) { state.error = '请输入研究问题'; render(); return; }
  if (!/[\p{L}\p{N}]/u.test(query)) { state.error = '请输入包含文字或数字的研究问题'; render(); return; }
  callbacks.onAiSubmit(query.trim());
}
function Composer() {
  const hasText = Boolean(state.draft.trim());
  const busy = state.awaiting || state.running;
  return <>
    <form className="portal-ai-composer" onSubmit={event => { event.preventDefault(); submit(state.draft); }}>
      <label className="sr-only" htmlFor="portalAiQuery">输入研究问题</label>
      <Input.TextArea id="portalAiQuery" value={state.draft} autoSize={false} rows={1} placeholder="请输入想要检索的问题…" status={state.error ? 'error' : undefined}
        aria-describedby="portalAiComposerError" onChange={value => { state.draft = value; state.error = ''; renderComposer(); }}
        onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing && !event.nativeEvent.isComposing) { event.preventDefault(); submit(state.draft); } }} />
      <p className="portal-ai-composer-error" id="portalAiComposerError" role="alert" hidden={!state.error}>{state.error}</p>
      <Button className={`portal-ai-send${busy ? ' is-processing' : ''}`} type="text" shape="circle" htmlType="submit" disabled={!hasText}
        aria-busy={busy} aria-label={busy ? (hasText ? '发送新问题（当前回答生成中）' : 'AI正在生成回答') : '发送研究问题'}>
        {busy ? <IconLoading className="portal-ai-send-loading" aria-hidden="true" /> : <img src={`assets/figma-home-20261029/${hasText ? 'send-active' : 'send'}.svg`} width="32" height="32" alt="" aria-hidden="true" />}
      </Button>
    </form>
  </>;
}
export function mountAiSearch(handlers) {
  callbacks = handlers;
  roots = { conversation: createRoot(document.getElementById('portalAiConversation')), composer: createRoot(document.getElementById('portalAiComposerMount')), sources: createRoot(document.getElementById('portalAiCitations')) };
  render();
}
window.PortalAiSearch = {
  prepare(query, fallback = []) {
    stopTimers();
    const initial = document.getElementById('searchResultsPage').hidden;
    const layout = initial ? 'centered' : state.layout;
    state = { ...initialState(), query, draft: initial ? query : '', sources: makeSources(query, fallback), phase: 'waiting', awaiting: true, layout };
    render(); document.getElementById('portalAiConversation').scrollTop = 0;
  },
  begin() {
    if (!state.awaiting || !pageVisible()) return;
    state.awaiting = false; state.draft = ''; state.step = 0; state.running = true; state.startedAt = Date.now(); state.phase = 'processing'; render();
    if (reduced()) { state.step = 3; state.ready = true; state.running = false; state.chunks = 4; state.phase = 'done'; state.open = false; render(); revealSources(); return; }
    later(650, () => { state.step = 1; render(); });
    later(1450, () => { state.step = 2; state.ready = true; render(); });
    later(2250, () => { state.step = 3; state.phase = 'writing'; render(); });
    [2500, 2720, 2940, 3160].forEach((time, index) => later(time, () => { state.chunks = index + 1; render(); }));
    later(3250, () => { if (!state.manualOpen) { state.open = false; render(); } });
    later(3300, () => { state.phase = 'done'; state.running = false; state.elapsed = Math.ceil((Date.now() - state.startedAt) / 1000); render(); });
    // Wait for the final content entrance and process collapse before sliding.
    later(3600, settleConversation);
  },
  cancel() { stopTimers(); state.awaiting = false; state.running = false; state.mobileSourcesOpen = false; state.layout = 'centered'; state.sourcesVisible = false; render(); },
};
document.addEventListener('portal-search-workspace-reveal', () => window.PortalAiSearch.begin());

const pauseAiMotion = () => document.documentElement.toggleAttribute('data-ai-motion-paused', document.hidden);
document.addEventListener('visibilitychange', pauseAiMotion);
pauseAiMotion();

window.addEventListener('resize', () => renderSources());
