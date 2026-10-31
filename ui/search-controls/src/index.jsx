import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import Radio from '@arco-design/web-react/es/Radio';
import Checkbox from '@arco-design/web-react/es/Checkbox';
import Tooltip from '@arco-design/web-react/es/Tooltip';
import Switch from '@arco-design/web-react/es/Switch';
import Tag from '@arco-design/web-react/es/Tag';
import Pagination from '@arco-design/web-react/es/Pagination';
import '@arco-design/web-react/es/Radio/style/css.js';
import '@arco-design/web-react/es/Checkbox/style/css.js';
import '@arco-design/web-react/es/Tooltip/style/css.js';
import '@arco-design/web-react/es/Switch/style/css.js';
import '@arco-design/web-react/es/Tag/style/css.js';
import '@arco-design/web-react/es/Pagination/style/css.js';
import { FilterActions, FilterSidebar, FILTER_SCHEMAS } from './sidebar-filters.jsx';
import reportDocuments from './report-preview.json';
import { mountAiSearch } from './ai-search.jsx';
import { SearchReturn } from './search-return.jsx';

let roots;
let handlers;
let filterActionsRoot;

function MatchControls({ model }) {
  return <Radio.Group name="portal-result-match" value={model.matchValue} onChange={value => handlers.onMatchChange(value)}>
    <Radio id="portalResultExact" value="exact">精确查找</Radio>
    <Radio id="portalResultAssociation" value="association" disabled={model.associationDisabled} title={model.associationDisabled ? '全文范围使用精确查找，扩展词仅在正文内匹配' : undefined}>智能关联搜索</Radio>
  </Radio.Group>;
}

function ExpansionControls({ model }) {
  return <>
    <Checkbox id="portalResultExpansionAll" className="portal-result-expansion-all" checked={model.allChecked} indeterminate={model.allIndeterminate} disabled={model.disabled} onChange={checked => handlers.onAllChange(checked)}>词位扩展-全选</Checkbox>
    <Checkbox.Group className="portal-result-expansion-grid" value={model.selectedGroups} disabled={model.disabled} onChange={values => handlers.onGroupsChange(values)}>
      {model.groups.map(group => <Checkbox key={group.key} value={group.key} className="portal-fidelity-expansion-group" indeterminate={group.indeterminate}>{group.label}：{group.terms.join('、')}</Checkbox>)}
    </Checkbox.Group>
  </>;
}

function closeTagProps(label, close) {
  return { role: 'button', tabIndex: 0, 'aria-label': label, onKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); close(); }
  } };
}

function ConditionControls({ model }) {
  const closeIcon = <img src="assets/figma-association-20261030/tag-close.svg" width="14" height="14" alt="" aria-hidden="true" />;
  return <>
    {model.keyword && <Tag className="portal-compact-condition-tag" id="portalCompactKeyword" data-node-id="1265:1122" closable visible closeIcon={closeIcon} onClose={handlers.onKeywordRemove} __closeIconProps={closeTagProps('移除关键词条件', handlers.onKeywordRemove)}>
      <span className="portal-compact-condition-label">关键词 </span>{model.keyword}
    </Tag>}
    {model.resource && <Tag className="portal-compact-condition-tag" id="portalCompactResource" data-node-id="1265:1129" closable visible closeIcon={closeIcon} onClose={handlers.onResourceRemove} __closeIconProps={closeTagProps('移除资源条件', handlers.onResourceRemove)}>
      <span className="portal-compact-condition-label">资源 </span>{model.resource}
    </Tag>}
    {!model.keyword && !model.resource && <p className="portal-compact-empty">暂无检索条件</p>}
  </>;
}

function FilterControls({ model }) {
  const closeIcon = <img src="assets/figma-association-20261030/tag-close.svg" width="14" height="14" alt="" aria-hidden="true" />;
  const labels = { resourceScope: '搜索范围', domains: '领域', reportTypes: '报告类型', matchMode: '匹配方式', publishTime: '发表时间', discipline: '学科领域', source: '来源', accessibleOnly: '访问范围' };
  return <>
    {model.filters.map(filter => {
      const close = () => handlers.onFilterRemove(filter);
      const split = filter.label.indexOf('：');
      const label = labels[filter.key] || (split >= 0 ? filter.label.slice(0, split) : '');
      const value = split >= 0 ? filter.label.slice(split + 1) : filter.label;
      return <Tag key={`${filter.key}:${filter.value || ''}`} className="portal-active-filter-tag portal-compact-condition-tag"
        closable visible closeIcon={closeIcon} onClose={close}
        __closeIconProps={closeTagProps(`移除筛选 ${filter.label}`, close)}>
        <span className="portal-compact-condition-label">{label} </span>{value}
      </Tag>;
    })}
    {model.filters.length > 0 && <button type="button" className="portal-clear-filters" onClick={handlers.onFiltersClear}>清除全部</button>}
  </>;
}

function PreferenceControls({ model }) {
  return <>
    <span>搜索偏好</span>
    <Switch id="portalCompactPreferenceSwitch" data-node-id="1265:1162" aria-label="搜索偏好" checked={model.enabled} onChange={enabled => handlers.onPreferenceChange(enabled)} />
  </>;
}

function ResultPagination({ model }) {
  return <Pagination
    current={model.current}
    pageSize={model.pageSize}
    total={model.total}
    size="default"
    hideOnSinglePage={false}
    sizeCanChange={false}
    showJumper={false}
    onChange={page => handlers.onPageChange(page)}
  />;
}

function PreferenceInfo() {
  const [tipOpen, setTipOpen] = useState(false);
  return <Tooltip
      className="portal-preference-tooltip"
      content={<span id="portalAssociationPreferenceTipText">按近30天记录更新兴趣：搜索 +1，打开结果 +2。关键词相关性优先，兴趣仅辅助排序。</span>}
      trigger={['hover', 'click', 'focus']}
      triggerProps={{ clickToClose: false, containerScrollToClose: true }}
      escToClose
      position="tl"
      style={{ maxWidth: 'min(320px, calc(100vw - 32px))' }}
      popupVisible={tipOpen}
      onVisibleChange={setTipOpen}
    >
      <button
        id="portalAssociationPreferenceInfo"
        type="button"
        className="portal-compact-info"
        aria-label="兴趣更新与排序说明"
        aria-expanded={tipOpen}
        aria-describedby={tipOpen ? 'portalAssociationPreferenceTipText' : undefined}
        onClick={event => event.preventDefault()}
      ><img src="assets/figma-association-20261030/info.svg" width="16" height="16" alt="" aria-hidden="true" /></button>
    </Tooltip>;
}

window.PortalSearchControls = {
  filterSchemas: FILTER_SCHEMAS,
  reportDocuments,
  mountFilterActions() {
    filterActionsRoot = createRoot(document.getElementById('portalFilterActionsMount'));
    flushSync(() => filterActionsRoot.render(<FilterActions />));
  },
  mount(callbacks) {
    handlers = callbacks;
    roots = {
      match: createRoot(document.getElementById('portalResultMatchMount')),
      expansion: createRoot(document.getElementById('portalResultExpansion')),
      preferences: createRoot(document.getElementById('portalAssociationPreferenceMount')),
      conditions: createRoot(document.getElementById('portalAssociationConditionsMount')),
      preferenceInfo: createRoot(document.getElementById('portalAssociationPreferenceInfoMount')),
      pagination: createRoot(document.getElementById('portalSearchPagination')),
      searchReturn: createRoot(document.getElementById('portalSearchReturnMount')),
      filters: createRoot(document.getElementById('portalActiveFilters')),
      sidebar: createRoot(document.getElementById('portalSearchFilters'))
    };
    flushSync(() => roots.searchReturn.render(<SearchReturn onReturn={() => handlers.onSearchReturn()} />));
    mountAiSearch(callbacks);
  },
  update(model) {
    if (!roots) return;
    flushSync(() => {
      roots.match.render(<MatchControls model={model} />);
      roots.expansion.render(<ExpansionControls model={model} />);
    });
  },
  updatePreferences(model) {
    if (!roots) return;
    flushSync(() => {
      roots.preferences.render(<PreferenceControls model={model} />);
      roots.preferenceInfo.render(<PreferenceInfo />);
    });
  },
  updateConditions(model) {
    if (!roots) return;
    flushSync(() => roots.conditions.render(<ConditionControls model={model} />));
  },
  updatePagination(model) {
    if (!roots) return;
    flushSync(() => roots.pagination.render(model.total > 0 ? <ResultPagination model={model} /> : null));
  },
  updateFilters(model) {
    if (!roots) return;
    flushSync(() => roots.filters.render(<FilterControls model={model} />));
  },
  updateSidebar(model) {
    if (!roots) return;
    flushSync(() => {
      roots.sidebar.render(<FilterSidebar model={model} onChange={handlers.onSidebarChange} />);
      filterActionsRoot?.render(<FilterActions disabled={model.resetDisabled} />);
    });
  }
};
