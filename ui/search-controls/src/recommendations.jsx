import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Button from '@arco-design/web-react/es/Button';
import Tabs from '@arco-design/web-react/es/Tabs';
import Menu from '@arco-design/web-react/es/Menu';
import Dropdown from '@arco-design/web-react/es/Dropdown';
import Checkbox from '@arco-design/web-react/es/Checkbox';
import Switch from '@arco-design/web-react/es/Switch';
import Select from '@arco-design/web-react/es/Select';
import Pagination from '@arco-design/web-react/es/Pagination';
import Tag from '@arco-design/web-react/es/Tag';
import Progress from '@arco-design/web-react/es/Progress';
import Input from '@arco-design/web-react/es/Input';
import Radio from '@arco-design/web-react/es/Radio';
import Empty from '@arco-design/web-react/es/Empty';
import IconFire from '@arco-design/web-react/icon/react-icon/IconFire';
import IconFile from '@arco-design/web-react/icon/react-icon/IconFile';
import IconFilePdf from '@arco-design/web-react/icon/react-icon/IconFilePdf';
import IconDashboard from '@arco-design/web-react/icon/react-icon/IconDashboard';
import IconUserGroup from '@arco-design/web-react/icon/react-icon/IconUserGroup';
import IconTrophy from '@arco-design/web-react/icon/react-icon/IconTrophy';
import IconBook from '@arco-design/web-react/icon/react-icon/IconBook';
import IconCalendar from '@arco-design/web-react/icon/react-icon/IconCalendar';
import IconStar from '@arco-design/web-react/icon/react-icon/IconStar';
import IconStarFill from '@arco-design/web-react/icon/react-icon/IconStarFill';
import IconQuote from '@arco-design/web-react/icon/react-icon/IconQuote';
import IconEdit from '@arco-design/web-react/icon/react-icon/IconEdit';
import IconMessage from '@arco-design/web-react/icon/react-icon/IconMessage';
import IconThumbUp from '@arco-design/web-react/icon/react-icon/IconThumbUp';
import IconThumbUpFill from '@arco-design/web-react/icon/react-icon/IconThumbUpFill';
import IconUserAdd from '@arco-design/web-react/icon/react-icon/IconUserAdd';
import IconSend from '@arco-design/web-react/icon/react-icon/IconSend';
import IconEyeInvisible from '@arco-design/web-react/icon/react-icon/IconEyeInvisible';
import { IconContext } from '@arco-design/web-react/icon/react-icon/context';
import '@arco-design/web-react/es/Button/style/css.js';
import '@arco-design/web-react/es/Tabs/style/css.js';
import '@arco-design/web-react/es/Menu/style/css.js';
import '@arco-design/web-react/es/Dropdown/style/css.js';
import '@arco-design/web-react/es/Checkbox/style/css.js';
import '@arco-design/web-react/es/Switch/style/css.js';
import '@arco-design/web-react/es/Select/style/css.js';
import '@arco-design/web-react/es/Pagination/style/css.js';
import '@arco-design/web-react/es/Tag/style/css.js';
import '@arco-design/web-react/es/Progress/style/css.js';
import '@arco-design/web-react/es/Input/style/css.js';
import '@arco-design/web-react/es/Radio/style/css.js';
import '@arco-design/web-react/es/Empty/style/css.js';
import navigation from './portal-navigation.js';
import { SearchReturn } from './search-return.jsx';

const mount = (node, component) => createRoot(node).render(component);
const sectionLinks = [...document.querySelectorAll('[data-section-link]')];
const categoryIcons = { hot: IconFire, news: IconFile, papers: IconFilePdf, reports: IconDashboard, talent: IconUserGroup, conferences: IconTrophy, courses: IconBook, events: IconCalendar };
// Scope the official icons so Menu's default icon spacing preserves the existing gap.
const categoryIconContext = { prefixCls: 'rec-category' };
const categoryIconStyle = { fill: 'none', stroke: 'currentColor', strokeWidth: 4, strokeLinecap: 'butt', strokeLinejoin: 'miter' };
const paperActionRoles = { detail: 'read', citation: 'cite', rating: 'rate', comments: 'comment' };
const saveActionSelector = '[data-paper-save], [data-report-save], [data-course-save], [data-save-button]';
const resourceActionGroups = '.rec-news-actions, .rec-paper-actions, .rec-report-actions, .rec-conference-actions, .rec-course-actions, .rec-event-actions, .rec-author-update-actions, .rec-follow-actions';
const resourceActionIcons = { read: IconBook, cite: IconQuote, rate: IconEdit, comment: IconMessage, like: IconThumbUp, follow: IconUserAdd, submit: IconSend, register: IconCalendar, dismiss: IconEyeInvisible };
const resourceActionAttributes = [
  ['[data-news-toggle], [data-report-toggle], [data-conference-toggle], [data-course-toggle], [data-event-toggle], [data-author-update-toggle], [data-watch-toggle]', 'read'],
  ['[data-report-like]', 'like'],
  ['[data-author-follow], [data-keyword-follow], [data-follow-button]', 'follow'],
  ['[data-conference-submission]', 'submit'],
  ['[data-event-register]', 'register'],
  ['[data-author-dismiss]', 'dismiss']
];
function isResourceAction(source) {
  return Boolean(source.closest(resourceActionGroups)
    || (source.matches('[data-author-follow]') && source.closest('.rec-talent-card'))
    || (source.matches('[data-author-update-toggle], [data-author-dismiss]') && source.closest('.rec-author-update-card')));
}
function getResourceActionRole(source) {
  if (source.matches(saveActionSelector)) return 'save';
  return paperActionRoles[source.getAttribute('data-paper-action')]
    || resourceActionAttributes.find(([selector]) => source.matches(selector))?.[1];
}
function resourceActionMarkup(source) {
  if (!source.querySelector('svg')) return source.innerHTML;
  const copy = source.cloneNode(true);
  copy.querySelectorAll('svg').forEach(icon => icon.remove());
  return copy.innerHTML;
}
mount(document.getElementById('recSearchReturnMount'), <SearchReturn id="recSearchReturn" onReturn={() => window.PortalRecommendationReturnHome()} />);

function NavigationGroup({ group, utility = false }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = event => { if (event.detail !== group.label) setOpen(false); };
    const escape = event => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('rec-header-menu-open', close);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('rec-header-menu-open', close); document.removeEventListener('keydown', escape); };
  }, [group.label]);
  const changeOpen = value => {
    setOpen(value);
    if (value) document.dispatchEvent(new CustomEvent('rec-header-menu-open', { detail: group.label }));
  };
  const menu = <section className={utility ? 'rec-utility-menu' : 'rec-mega-menu'}>
    {!utility && <h2>{group.label}</h2>}
    <Menu className="rec-portal-dropdown" onClickMenuItem={() => setOpen(false)}>
    {group.items.map((item, index) => <Menu.Item key={`${index}`} disabled={!item.url}>
      {item.url ? <a href={item.url} target={item.url.startsWith('https:') ? '_blank' : undefined} rel="noopener noreferrer">{item.label}</a> : item.label}
    </Menu.Item>)}
  </Menu></section>;
  return <Dropdown trigger={['hover', 'click']} droplist={menu} popupVisible={open} onVisibleChange={changeOpen} position="bl" getPopupContainer={() => document.getElementById('recHeader')} triggerProps={{ className: utility ? 'rec-utility-popup' : 'rec-navigation-popup', autoFitPosition: false, mouseEnterDelay: 80, mouseLeaveDelay: 140 }}>
    <Button type="text" className={utility ? 'rec-workbench-button' : `nav-trigger portal-glass-tab${open ? ' is-open' : ''}`} aria-expanded={open} aria-haspopup="menu">
      {utility && <img src="assets/header-workbench.svg" width="20" height="20" alt="" />}{group.label}
    </Button>
  </Dropdown>;
}

const headerNav = document.getElementById('recMainNav');
headerNav.replaceChildren();
mount(headerNav, <><a className="portal-glass-tab is-current" href="index.html?page=home" aria-current="page">首页</a>{navigation.filter(group => group.label !== '工作台').map(group => <NavigationGroup key={group.label} group={group} />)}</>);
const workbench = document.getElementById('recWorkbench');
mount(workbench, <NavigationGroup utility group={navigation.find(group => group.label === '工作台')} />);

function ContentNavigation() {
  const [active, setActive] = useState(document.querySelector('[data-section-link].is-active')?.dataset.sectionLink || 'hot');
  useEffect(() => {
    const update = event => setActive(event.detail);
    document.addEventListener('rec-section-change', update);
    return () => document.removeEventListener('rec-section-change', update);
  }, []);
  return <Menu selectedKeys={[active]} onClickMenuItem={key => sectionLinks.find(link => link.dataset.sectionLink === key)?.click()}>
    {sectionLinks.map(link => {
      const Icon = categoryIcons[link.dataset.sectionLink] || IconFile;
      return <Menu.Item key={link.dataset.sectionLink}><IconContext.Provider value={categoryIconContext}><Icon style={categoryIconStyle} /></IconContext.Provider>{link.querySelector('span').textContent}</Menu.Item>;
    })}
  </Menu>;
}
mount(document.getElementById('recCategoryMenu'), <ContentNavigation />);

function PageControl({ moduleKey }) {
  const [model, setModel] = useState({ ...window.PortalRecommendationPages.models[moduleKey] });
  useEffect(() => {
    const update = event => { if (event.detail === moduleKey) setModel({ ...window.PortalRecommendationPages.models[moduleKey] }); };
    document.addEventListener('rec-pagination-change', update);
    update({ detail: moduleKey });
    return () => document.removeEventListener('rec-pagination-change', update);
  }, [moduleKey]);
  if (!model.pageSize) return null;
  return <div className="rec-pagination"><span>共 {model.total} 条</span><Pagination total={model.total} current={model.current} pageSize={model.pageSize} sizeCanChange={false} hideOnSinglePage={false} onChange={page => window.PortalRecommendationPages.change(moduleKey, page)} /></div>;
}
for (const moduleKey of ['news', 'papers', 'reports', 'conferences', 'courses', 'events']) {
  const host = document.createElement('div');
  host.dataset.recArco = 'pagination';
  document.getElementById(moduleKey).append(host);
  mount(host, <PageControl moduleKey={moduleKey} />);
}

// Keep the existing data services and event handlers as the single source of truth.
// Visual controls use real Arco components; mutations only update their state.
const controls = new Map();
function mountControl(source, kind, hiddenNode = source) {
  if (controls.has(source)) return;
  const host = document.createElement('span');
  host.dataset.recArco = kind;
  host.className = `rec-arco-${kind}-host`;
  const saveActions = kind === 'button' && source.matches(saveActionSelector) && source.closest(resourceActionGroups);
  if (saveActions) {
    saveActions.append(host);
    const sourceFocus = source.focus.bind(source);
    source.focus = options => {
      const button = host.querySelector('button');
      if (button) button.focus(options);
      else sourceFocus(options);
    };
  } else hiddenNode.after(host);
  hiddenNode.dataset.recLegacyControl = kind;
  if (kind === 'input') {
    source.dataset.recRequired = String(source.required);
    source.required = false;
  }
  const root = createRoot(host);
  controls.set(source, { source, host, root, kind, signature: '' });
}

function Control({ source, kind }) {
  if (kind === 'tag') {
    const accent = /已关注|待审核|即将举行/.test(source.textContent) && !/已截稿|已结束/.test(source.textContent);
    return <Tag className={`rec-status-tag${accent ? ' is-accent' : ''}`}>{source.textContent}</Tag>;
  }
  if (kind === 'progress') {
    return <Progress percent={Number(source.getAttribute('aria-valuenow')) || 0} showText={false} aria-label={source.getAttribute('aria-label')} />;
  }
  if (kind === 'input') {
    const label = source.closest('label');
    const name = source.getAttribute('aria-label') || (label ? [...label.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent.trim()).join(' ') : source.placeholder);
    const Component = source.tagName === 'TEXTAREA' ? Input.TextArea : Input;
    return <Component aria-label={name} type={source.type === 'email' ? 'email' : undefined} placeholder={source.placeholder} value={source.value} disabled={source.disabled} required={source.dataset.recRequired === 'true'} maxLength={source.maxLength > 0 ? source.maxLength : undefined} autoSize={source.tagName === 'TEXTAREA' ? { minRows: 3, maxRows: 8 } : undefined} onChange={value => { source.value = value; source.dispatchEvent(new Event('input', { bubbles: true })); reconcile(); }} />;
  }
  if (kind === 'rating') {
    const radios = [...source.querySelectorAll('input[type="radio"]')];
    return <div className="rec-rating-control"><span>{source.querySelector('legend')?.textContent}</span><Radio.Group value={radios.find(radio => radio.checked)?.value} onChange={value => radios.find(radio => radio.value === value)?.click()}>{radios.map(radio => <Radio key={radio.value} value={radio.value}>{radio.value} 分</Radio>)}</Radio.Group></div>;
  }
  if (kind === 'empty') {
    const recovery = source.querySelector('button');
    return <Empty description={<div className="rec-empty-copy"><strong>{source.querySelector('strong')?.textContent}</strong><p>{source.querySelector('p')?.textContent}</p>{recovery && <Button type="secondary" onClick={() => recovery.click()}>{recovery.textContent}</Button>}</div>} />;
  }
  if (kind === 'tabs') {
    const tabs = [...source.querySelectorAll(':scope > button')];
    return <Tabs activeTab={String(Math.max(0, tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true')))} onChange={key => tabs[Number(key)]?.click()} destroyOnHide>
      {tabs.map((tab, index) => <Tabs.TabPane key={String(index)} title={tab.textContent} disabled={tab.disabled} />)}
    </Tabs>;
  }
  if (kind === 'select') {
    const label = source.closest('label');
    const name = source.getAttribute('aria-label') || (label ? [...label.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent.trim()).join(' ') : source.id === 'recReportRule' ? '报告排序' : '时间范围');
    return <Select aria-label={name} value={source.value} disabled={source.disabled} getPopupContainer={() => source.closest('dialog') || document.body} onChange={value => { source.value = value; source.dispatchEvent(new Event('change', { bubbles: true })); reconcile(); }}>
      {[...source.options].map(option => <Select.Option key={option.value} value={option.value}>{option.text}</Select.Option>)}
    </Select>;
  }
  if (kind === 'check' || kind === 'switch') {
    const label = source.closest('label');
    const text = label?.textContent.trim() || source.getAttribute('aria-label') || '';
    const Component = kind === 'switch' ? Switch : Checkbox;
    return <span className="rec-arco-check-control"><Component aria-label={source.getAttribute('aria-label') || text} checked={source.checked} disabled={source.disabled} onChange={checked => { source.checked = checked; source.dispatchEvent(new Event('change', { bubbles: true })); reconcile(); }}>{kind === 'check' ? text : null}</Component>{kind === 'switch' && <span>{text}</span>}</span>;
  }
  const selected = source.getAttribute('aria-pressed') === 'true';
  const isSaveAction = source.matches(saveActionSelector);
  const saveResource = source.hasAttribute('data-paper-save') ? '文献' : source.hasAttribute('data-report-save') ? '报告' : source.hasAttribute('data-course-save') ? '课程' : '';
  const saveLabel = `${selected ? '取消收藏' : '收藏'}${saveResource}`;
  const SaveIcon = selected ? IconStarFill : IconStar;
  const saveIconStyle = selected ? { ...categoryIconStyle, fill: 'currentColor', stroke: 'none' } : categoryIconStyle;
  const paperActionRole = source.closest('.rec-paper-actions') ? source.hasAttribute('data-paper-save') ? 'save' : paperActionRoles[source.getAttribute('data-paper-action')] : undefined;
  const resourceAction = isResourceAction(source);
  const resourceActionRole = resourceAction ? getResourceActionRole(source) : undefined;
  const ResourceActionIcon = resourceActionRole === 'like' && selected ? IconThumbUpFill : resourceActionIcons[resourceActionRole];
  const resourceActionIconStyle = resourceActionRole === 'like' && selected ? saveIconStyle : categoryIconStyle;
  const isHot = source.classList.contains('rec-hot-card');
  const className = isHot ? source.className : `rec-action-button${selected ? ' is-selected' : ''}${paperActionRole ? ` rec-paper-action rec-paper-action--${paperActionRole}` : ''}${isSaveAction ? ' rec-save-action' : ''}${resourceAction ? ' rec-resource-action' : ''}${resourceActionRole ? ` rec-resource-action--${resourceActionRole}` : ''}`;
  const detailAction = source.matches('[data-conference-toggle], [data-course-toggle], [data-event-toggle], [data-report-toggle], [data-paper-action="detail"]');
  return <Button type={resourceAction ? 'text' : isHot ? 'secondary' : source.type === 'submit' ? 'primary' : detailAction ? 'outline' : 'text'} className={className} disabled={source.disabled} role={source.getAttribute('role') || undefined} aria-label={isSaveAction ? saveLabel : source.getAttribute('aria-label') || undefined} title={isSaveAction ? saveLabel : undefined} aria-pressed={source.hasAttribute('aria-pressed') ? selected : undefined} aria-expanded={source.getAttribute('aria-expanded') || undefined} aria-controls={source.getAttribute('aria-controls') || undefined} aria-selected={source.getAttribute('aria-selected') || undefined} onClick={event => {
    source.click();
    reconcile();
    // Legacy detail handlers may rerender the card. Restore focus to its Arco action.
    const host = event.currentTarget.closest('[data-rec-arco]');
    if (host?.isConnected) event.currentTarget.focus();
  }}>{isSaveAction ? <span><SaveIcon style={saveIconStyle} /></span> : ResourceActionIcon ? <span><ResourceActionIcon style={resourceActionIconStyle} /><span dangerouslySetInnerHTML={{ __html: resourceActionMarkup(source) }} /></span> : <span dangerouslySetInnerHTML={{ __html: source.innerHTML }} />}</Button>;
}

function reconcile() {
  for (const [source, control] of controls) {
    if (!source.isConnected) { control.root.unmount(); control.host.remove(); controls.delete(source); }
  }
  document.querySelectorAll('.rec-panel-tabs').forEach(source => { if (!source.closest('[data-rec-arco]')) mountControl(source, 'tabs'); });
  document.querySelectorAll('.rec-main .rec-tags > span, .rec-main .rec-resource-status, .rec-main .rec-report-audience, .rec-main .rec-author-update-type, .rec-main .rec-follow-badge, .rec-conference-card > header > span, .rec-conference-card > header > em, .rec-event-card > header > span, .rec-event-card > header > em').forEach(source => { if (!source.closest('[data-rec-arco]')) mountControl(source, 'tag'); });
  document.querySelectorAll('.rec-main .rec-chart-track[role="progressbar"]').forEach(source => { if (!source.closest('[data-rec-arco]')) mountControl(source, 'progress'); });
  document.querySelectorAll('.rec-main textarea, .sr-dialog input[type="text"], .sr-dialog input[type="email"], .sr-dialog textarea').forEach(source => { if (!source.closest('[data-rec-arco]')) mountControl(source, 'input'); });
  document.querySelectorAll('.rec-rating-fieldset fieldset').forEach(source => { if (!source.closest('[data-rec-arco]')) mountControl(source, 'rating'); });
  document.querySelectorAll('.rec-main div.rec-empty-state, .rec-main .rec-news-empty').forEach(source => { if (!source.closest('[data-rec-arco]')) mountControl(source, 'empty'); });
  document.querySelectorAll('.rec-main select, .sr-dialog select').forEach(source => { if (!source.closest('[data-rec-arco]')) mountControl(source, 'select'); });
  document.querySelectorAll('.rec-main input[type="checkbox"], .sr-dialog input[type="checkbox"]').forEach(source => {
    if (source.closest('[data-rec-arco]')) return;
    const label = source.closest('label');
    mountControl(source, ['recAutoFollow', 'recNewsHistoryToggle'].includes(source.id) ? 'switch' : 'check', label || source);
  });
  document.querySelectorAll('.rec-main button, .sr-dialog button, .rec-toast button').forEach(source => {
    if (source.closest('[data-rec-arco], .rec-panel-tabs, [data-rec-legacy-control]') || source.matches('.rec-more-link, .rec-news-more')) return;
    mountControl(source, 'button');
  });
  for (const control of controls.values()) {
    const { source, kind, host, root } = control;
    host.hidden = source.hidden || source.style.display === 'none';
    const signature = [source.innerHTML, source.className, source.disabled, source.checked, source.value, source.getAttribute('aria-valuenow'), source.getAttribute('aria-pressed'), source.getAttribute('aria-expanded'), source.getAttribute('aria-selected'), ...[...source.querySelectorAll('button,input[type="radio"]')].map(button => `${button.disabled}:${button.checked}:${button.getAttribute('aria-selected')}`)].join('|');
    if (signature === control.signature) continue;
    control.signature = signature;
    root.render(<Control source={source} kind={kind} />);
  }
}
let scheduled = false;
const observer = new MutationObserver(records => {
  if (scheduled || records.every(record => record.target.nodeType === 1 && record.target.closest('[data-rec-arco]'))) return;
  scheduled = true;
  queueMicrotask(() => { scheduled = false; reconcile(); });
});
reconcile();
observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'disabled', 'hidden', 'aria-selected', 'aria-pressed', 'aria-expanded', 'aria-valuenow'] });
document.addEventListener('change', () => queueMicrotask(reconcile));
