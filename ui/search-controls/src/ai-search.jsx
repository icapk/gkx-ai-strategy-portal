import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync, createPortal } from 'react-dom';
import Collapse from '@arco-design/web-react/es/Collapse';
import Button from '@arco-design/web-react/es/Button';
import Input from '@arco-design/web-react/es/Input';
import Tag from '@arco-design/web-react/es/Tag';
import Pagination from '@arco-design/web-react/es/Pagination';
import Drawer from '@arco-design/web-react/es/Drawer';
import IconLoading from '@arco-design/web-react/icon/react-icon/IconLoading';
import IconCheck from '@arco-design/web-react/icon/react-icon/IconCheck';
import IconCopy from '@arco-design/web-react/icon/react-icon/IconCopy';
import '@arco-design/web-react/es/Collapse/style/css.js';
import '@arco-design/web-react/es/Drawer/style/css.js';
import demoSources from './ai-demo-sources.json';
import { normalizePaperCatalog, understandPaperQuery, retrievePaperCandidates, rankPaperCandidates } from './ai-search-pipeline.mjs';

// Interaction references: Vercel AI Elements reasoning and chain-of-thought.
// Workflow descriptions and research samples are prototype data, not model reasoning.
const topics = [
  { key: 'evidence', name: '科研证据检索与核对', test: /证据|可追溯|科研智能体|文献/,
    conclusion: '将检索、来源记录和结论核对串成可追溯流程，是这组资料共同关注的方向。',
    paper: '论文侧重文献检索、来源记录与结论核对的工作流程。' },
  { key: 'material', name: '多模态材料分析', test: /多模态|材料|电池/,
    conclusion: '材料分析中的共同线索，是联合组织图像、文本和结构化实验资料。',
    paper: '论文比较图像、文本和结构化资料的组织与核对方式。' },
  { key: 'drug', name: '药物发现与候选排序', test: /药物|靶点|生物医学/,
    conclusion: '药物发现资料主要围绕知识整合、候选排序和后续核对展开。',
    paper: '论文介绍知识图谱、证据检索和人工复核的衔接。' },
  { key: 'related', name: '相关研究' }
];
const topicFor = source => {
  const demoTopic = /^ai-demo-paper-([1-3])$/.exec(source.id);
  return demoTopic ? topics[Number(demoTopic[1]) - 1].key
    : topics.find(topic => topic.test?.test(`${source.title} ${source.summary}`))?.key || 'related';
};
function sections() {
  return topics.map(topic => ({ ...topic, sources: state.sources.filter(source => topicFor(source) === topic.key) })).filter(topic => topic.sources.length);
}
const questions = ['AI在药物靶点发现中有哪些研究？', 'AI在多模态材料分析中有哪些应用？', '科研智能体如何组织文献证据？'];
const initialState = () => ({ query: '', draft: '', catalog: [], understanding: null, candidates: [], sources: [], step: -1, phase: 'idle', ready: false, chunks: 0,
  open: false, manualOpen: false, sourcePage: 1, expanded: new Set(), focused: '', copied: false,
  error: '', awaiting: false, running: false, startedAt: 0, elapsed: 0, mobileSourcesOpen: false,
  layout: 'settled', sourcesVisible: false, failedStep: null, emptyAfter: null });
let state = initialState();
let roots;
let callbacks;
let generation = 0;
let timers = new Set();
let focusTicket = 0;
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
function stopTimers() { generation += 1; timers.forEach(clearTimeout); timers.clear(); }
function later(ms, action) {
  const version = generation;
  const timer = setTimeout(() => { timers.delete(timer); if (version === generation && pageVisible()) action(); }, ms);
  timers.add(timer);
}
function sourcePageSize() {
  if (state.expanded.size) return 1;
  if (mobile()) return window.innerHeight < 700 ? 1 : 2;
  if (window.innerHeight < 650) return 1;
  if (window.innerHeight < 800) return 2;
  return 3;
}
function cite(id) {
  state.expanded = new Set([id]); state.sourcePage = Math.floor(state.sources.findIndex(source => source.id === id) / sourcePageSize()) + 1; state.focused = id;
  state.mobileSourcesOpen = mobile() && state.sourcesVisible; renderSources();
  requestAnimationFrame(() => {
    const card = document.getElementById(`portal-ai-source-${id}`);
    if (state.sourcesVisible) card?.focus({ preventScroll: true });
  });
  const ticket = ++focusTicket;
  later(1400, () => { if (ticket === focusTicket) { state.focused = ''; renderSources(); } });
}
function Citation({ source }) {
  return <Button type="text" size="mini" className="portal-ai-citation" aria-label={`查看引用${source.number}：${source.title}`} onClick={() => cite(source.id)}>{source.number}</Button>;
}
function Citations({ sources }) { return sources.map(source => <Citation key={source.id} source={source} />); }
function stepStatus(index) {
  if (state.failedStep === index) return '未完成';
  if (state.emptyAfter !== null && index > state.emptyAfter || state.failedStep !== null && index > state.failedStep) return '未执行';
  if (state.step > index) return '已完成';
  return state.running && state.step === index ? '进行中' : '等待中';
}
function groupStatus(steps, statusFor = stepStatus) {
  const statuses = steps.map(statusFor);
  if (statuses.includes('未完成')) return '未完成';
  if (statuses.every(status => status === '已完成')) return '已完成';
  if (statuses.includes('进行中')) return '进行中';
  if (statuses.every(status => status === '未执行')) return '未执行';
  return statuses.includes('未执行') ? '部分执行' : '等待中';
}
// Retain the original three visible steps. The ordinary retrieval and later
// relevance screening both belong to the existing "精准匹配" display step.
function displayStepStatus(index) {
  if (index === 1 && state.emptyAfter === 1) return '已完成';
  return groupStatus([[0], [1, 2], [3]][index]);
}
function Process() {
  const complete = state.step >= 4 && state.failedStep === null && state.emptyAfter === null;
  const displayStep = state.step < 0 ? -1 : state.step === 0 ? 0 : state.step < 3 ? 1 : state.step === 3 ? 2 : 3;
  const labels = ['语义检索 · 深度解析中', '语义检索 · 正在匹配资料', 'AI解读 · 整理核心要点'];
  const summary = state.failedStep !== null ? '处理暂未完成' : state.emptyAfter === 1 ? '未检索到匹配论文' : state.emptyAfter === 2 ? '没有符合问题的论文，未生成AI解析' : complete ? '已完成语义检索与AI解读' : labels[displayStep] || '正在准备检索';
  const descriptions = ['运用自然语言处理（NLP）与机器学习技术，深度解析用户查询语义', displayStepStatus(1) === '已完成' ? '已完成学术文献匹配' : '正在匹配最具价值的学术文献', ''];
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
          <div className="portal-ai-group-heading"><span className="portal-ai-group-number">{groupIndex + 1}</span><h3>{group.title}</h3><span>{groupStatus(group.steps, displayStepStatus)}</span></div>
          <ol>{group.steps.map(index => {
            const status = displayStepStatus(index);
            const done = status === '已完成';
            const active = status === '进行中';
            return <li className={`portal-ai-step${active ? ' is-active' : ''}${done ? ' is-complete' : ''}`} key={index}>
              <span className="portal-ai-step-marker" aria-hidden="true">{done ? <IconCheck /> : active ? <IconLoading /> : <span />}</span>
              <div><strong>{stepNames[index]}</strong>{descriptions[index] && <p>{status === '未执行' ? '本次未执行此步骤' : descriptions[index]}</p>}</div>
              <span className="portal-ai-step-status">{status}</span>
            </li>;
          })}</ol>
        </li>)}
      </ol>
    </Collapse.Item>
  </Collapse>;
}
function Answer() {
  const groups = sections();
  if (state.failedStep !== null) return <div className="portal-ai-answer-empty"><h2>{state.failedStep < 2 ? '检索暂未完成' : 'AI解析暂未完成'}</h2><p>{state.failedStep < 2 ? '请稍后重试。' : '已保留本次检索论文，可继续查看右侧来源或重试解析。'}</p><Button type="secondary" size="small" onClick={retryProcessing}>{state.failedStep < 2 ? '重试检索' : '重试解析'}</Button></div>;
  if (!state.chunks) return <div className="portal-ai-answer-skeleton" role="status" aria-label="正在整理相关资料"><i /><i /><i /><p>正在整理与你的问题相关的资料</p></div>;
  if (!state.sources.length) return <div className="portal-ai-answer-empty"><h2>暂无可引用的论文</h2><p>可尝试更换主题词，或减少问题中的限定条件后重新检索。</p></div>;
  return <div className="portal-ai-answer-content" id="portalAiAnswerContent" aria-busy={state.phase !== 'done'}>
    <section className="portal-ai-answer-block" key="intro"><p>围绕你的问题，当前资料可归纳为{groups.map(group => `“${group.name}”`).join('、')}等线索。下面结合论文研究，整理它们关注的问题和相互关系。</p></section>
    {state.chunks >= 2 && <section className="portal-ai-answer-block" key="conclusions"><h2>一、结论概览</h2><ol>{groups.map(group => <li key={group.key}><strong>{group.name}：</strong>{group.conclusion && group.sources.every(source => source.id.startsWith('ai-demo-')) ? group.conclusion : group.sources[0].summary || '暂无摘要，需打开来源核对。'}<Citations sources={group.sources} /></li>)}</ol></section>}
    {state.chunks >= 3 && <section className="portal-ai-answer-block" key="comparison"><h2>二、论文的主要线索</h2><div className="portal-ai-table-wrap"><table><thead><tr><th>研究方向</th><th>论文研究</th></tr></thead><tbody>{groups.map(group => <tr key={group.key}><th scope="row">{group.name}</th><td>{group.paper && group.sources.every(source => source.id.startsWith('ai-demo-')) ? group.paper : group.sources[0].summary || '暂无摘要，需打开来源核对。'}<Citations sources={group.sources} /></td></tr>)}</tbody></table></div></section>}
    {state.chunks >= 4 && <section className="portal-ai-answer-block" key="next"><h2>三、如何结合这些资料继续研究</h2>{groups.map(group => <p key={group.key}><strong>{group.name}。</strong>可进入原始来源继续核对研究方法、数据条件和适用范围。<Citations sources={group.sources} /></p>)}<p className="portal-ai-reading-note">本次引用 {state.sources.length} 篇论文，解读依据为摘要，不代表已阅读全文；研究结论及验证情况需回到来源核对。</p></section>}
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
      state.sourcePage = Math.floor(state.sources.findIndex(item => item.id === source.id) / sourcePageSize()) + 1;
      renderSources();
    }}>{source.title}</Button>
    <p className="portal-ai-source-meta">{source.meta}</p><p className="portal-ai-source-summary">{source.summary}</p>
    {expanded && <div className="portal-ai-source-detail" id={`portal-ai-source-detail-${source.id}`}><strong>摘要依据</strong><p>{source.summary || '暂无摘要'}</p><span>发表日期：{source.date || '暂无日期'}</span>{source.url && <a href={source.url} target="_blank" rel="noopener noreferrer">打开来源</a>}</div>}
  </article>;
}
function SourceContents() {
  const sources = state.ready ? state.sources : [];
  const pageSize = sourcePageSize();
  state.sourcePage = Math.min(state.sourcePage, Math.max(1, Math.ceil(sources.length / pageSize)));
  const paged = sources.slice((state.sourcePage - 1) * pageSize, state.sourcePage * pageSize);
  return <>
    <header className="portal-ai-sources-header"><h2>引用结果</h2><span>{sources.length} 条</span>{mobile() && <Button type="text" size="small" onClick={() => { state.mobileSourcesOpen = false; renderSources(); }}>关闭</Button>}</header>
    <div className="portal-ai-source-list">{state.failedStep !== null && state.failedStep < 2 ? <p className="portal-ai-no-sources">论文检索暂未完成，请重试。</p> : !state.ready ? <div className="portal-ai-citation-skeleton"><i /><i /><i /><p>检索完成后显示引用来源</p></div> : sources.length ? paged.map(source => <SourceCard key={source.id} source={source} />) : <p className="portal-ai-no-sources">暂无论文引用来源</p>}</div>
    {state.ready && sources.length > 0 && <div className="portal-ai-source-pagination"><Pagination current={state.sourcePage} pageSize={pageSize} total={sources.length} size="default" simple={mobile()} hideOnSinglePage={false} onChange={page => { state.sourcePage = page; state.focused = ''; renderSources(); }} /></div>}
  </>;
}
function Sources() {
  if (!mobile()) return <SourceContents />;
  return <>
    {createPortal(state.sourcesVisible && state.ready && <Button type="text" size="small" className="portal-ai-mobile-citations" onClick={() => { state.mobileSourcesOpen = true; renderSources(); }}>引用 {state.sources.length}</Button>, document.getElementById('portalAiMobileSourcesMount'))}
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
function failProcessing(step) {
  state.failedStep = step;
  state.running = false;
  state.phase = 'error';
  if (step >= 2) {
    // Keep ordinary results if later AI processing fails. Their order is the
    // retrieval order, not a claimed successful AI relevance ranking.
    if (step === 2) state.sources = state.candidates.map((paper, index) => ({ ...paper, number: index + 1 }));
    state.ready = true;
  }
  render();
}
function finishEmpty(step) {
  state.emptyAfter = step; state.step = step + 1;
  state.sources = []; state.ready = true; state.chunks = 4;
  state.phase = 'done'; state.running = false;
  state.elapsed = Math.ceil((Date.now() - state.startedAt) / 1000);
  render();
}
function runPipelineStep(step) {
  state.step = step;
  state.running = true;
  try {
    if (step === 0) state.understanding = understandPaperQuery(state.query);
    if (step === 1) {
      state.candidates = retrievePaperCandidates(state.understanding, state.catalog);
      if (!state.candidates.length) { finishEmpty(step); return; }
    }
    if (step === 2) {
      state.sources = rankPaperCandidates(state.understanding, state.candidates);
      state.ready = true;
      if (!state.sources.length) { finishEmpty(step); return; }
    }
    if (step === 3) {
      state.phase = 'writing';
      if (!state.manualOpen) state.open = false;
    }
  } catch {
    failProcessing(step);
    return;
  }
  render();
  if (step < 3) {
    if (reduced()) runPipelineStep(step + 1);
    else later(360, () => runPipelineStep(step + 1));
    return;
  }
  const finish = () => {
    state.step = 4; state.chunks = 4; state.phase = 'done'; state.running = false;
    state.elapsed = Math.ceil((Date.now() - state.startedAt) / 1000); render();
  };
  if (reduced()) { finish(); return; }
  [80, 300, 520, 740].forEach((time, index) => later(time, () => { state.chunks = index + 1; render(); }));
  later(820, finish);
}
function retryProcessing() {
  const step = state.failedStep;
  if (step === null) return;
  stopTimers();
  state.failedStep = null; state.chunks = 0; state.sourcePage = 1; state.expanded.clear(); state.focused = '';
  state.phase = 'processing'; state.startedAt = Date.now();
  runPipelineStep(step);
}
window.PortalAiSearch = {
  prepare(query, catalog = []) {
    stopTimers();
    const initial = document.getElementById('searchResultsPage').hidden;
    // Existing demo papers form part of the local catalogue. They go through
    // the same query matching and ranking as every supplied paper; no query
    // may replace the search result with a preselected topic fixture.
    state = { ...initialState(), query, draft: initial ? query : '', catalog: normalizePaperCatalog([...catalog, ...demoSources]), phase: 'waiting', awaiting: true, sourcesVisible: true };
    render(); document.getElementById('portalAiConversation').scrollTop = 0;
  },
  begin() {
    if (!state.awaiting || !pageVisible()) return;
    const entering = document.body.classList.contains('portal-surface-transition');
    const submittedDraft = state.draft;
    state.awaiting = false; if (!entering) state.draft = '';
    state.startedAt = Date.now(); state.phase = 'processing';
    if (entering) later(520, () => {
      // Clear only the submitted draft; preserve a new query typed mid-motion.
      if (state.draft === submittedDraft) { state.draft = ''; renderComposer(); }
    });
    if (reduced()) state.draft = '';
    // Each stage computes the next state from this query and its local paper
    // snapshot. Timings visualize the prototype, not real service latency.
    runPipelineStep(0);
  },
  cancel() { stopTimers(); state.awaiting = false; state.running = false; state.mobileSourcesOpen = false; state.sourcesVisible = false; render(); },
};
document.addEventListener('portal-search-workspace-reveal', () => window.PortalAiSearch.begin());

const pauseAiMotion = () => document.documentElement.toggleAttribute('data-ai-motion-paused', document.hidden);
document.addEventListener('visibilitychange', pauseAiMotion);
pauseAiMotion();

window.addEventListener('resize', () => renderSources());
