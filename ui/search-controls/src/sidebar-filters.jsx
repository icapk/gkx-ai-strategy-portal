import React from 'react';
import Radio from '@arco-design/web-react/es/Radio';
import Checkbox from '@arco-design/web-react/es/Checkbox';
import Input from '@arco-design/web-react/es/Input';
import Select from '@arco-design/web-react/es/Select';
import DatePicker from '@arco-design/web-react/es/DatePicker';
import Button from '@arco-design/web-react/es/Button';
import '@arco-design/web-react/es/Input/style/css.js';
import '@arco-design/web-react/es/Select/style/css.js';
import '@arco-design/web-react/es/DatePicker/style/css.js';
import '@arco-design/web-react/es/Button/style/css.js';

const text = (key, label, placeholder) => ({ key, label, placeholder, kind: 'text' });
const date = (key, label, pair, edge, kind = 'date') => ({ key, label, pair, edge, kind });
const scope = options => ({ title: '搜索范围', fields: [{ key: 'resourceScope', label: '搜索范围', kind: 'radio', options }] });
export const FILTER_SCHEMAS = {
  '论文': [
    scope(['标题和摘要', '标题', '摘要']),
    { title: '二次筛选', fields: [text('authorFilter', '作者', '作者姓名'), text('venueFilter', '会议／期刊', '会议或期刊名称')] },
    { title: '发表时间', fields: [date('publishedYearFrom', '起始年份', 'publishedYearTo', 'from', 'year'), date('publishedYearTo', '结束年份', 'publishedYearFrom', 'to', 'year')] },
    { title: '领域', fields: [{ key: 'domains', label: '领域', kind: 'checkbox', options: ['人工智能', '科研智能体', '先进材料', '生命科学'] }] }
  ],
  '专利': [{ title: '二次筛选', fields: [
    text('ipcFilter', 'IPC 分类', '例如 G16B'), text('applicantFilter', '申请人', '申请人名称'), text('inventorFilter', '发明人', '发明人姓名'),
    date('applicationStart', '申请日期（起）', 'applicationEnd', 'from'), date('applicationEnd', '申请日期（止）', 'applicationStart', 'to'),
    date('publicationStart', '公布日期（起）', 'publicationEnd', 'from'), date('publicationEnd', '公布日期（止）', 'publicationStart', 'to')
  ] }],
  '报告': [
    scope(['标题和摘要', '标题', '摘要', '全文检索']),
    { title: '二次筛选', fields: [{ key: 'reportTypes', label: '报告类型', kind: 'checkbox', options: [{ label: '研究报告', value: '1' }, { label: '洞察报告', value: '2' }, { label: '战略咨询报告', value: '3' }] }] }
  ],
  '人才': [{ title: '二次筛选', fields: [text('personNameFilter', '学者姓名', '学者姓名'), text('institutionFilter', '机构名称', '机构名称'), { key: 'researchFieldFilter', label: '研究领域', kind: 'select' }] }]
};

export function FilterActions({ disabled = true }) {
  return <>
    <Button type="text" size="small" className="portal-search-reset" id="portalSearchReset" disabled={disabled}>重置</Button>
    <Button type="text" size="small" shape="square" className="portal-filter-close" id="portalFilterClose" aria-label="关闭筛选">
      <img src="assets/figma-search-20261030/clear.svg" width="16" height="16" alt="" aria-hidden="true" />
    </Button>
  </>;
}

export function FilterSidebar({ model, onChange }) {
  const schema = FILTER_SCHEMAS[model.type] || [];
  const fields = schema.flatMap(group => group.fields);
  const bridge = fields.flatMap(field => {
    const value = model.values[field.key];
    return (Array.isArray(value) ? value : [value ?? '']).map((entry, index) => <input key={`${field.key}-${index}`} type="hidden" name={field.key} value={entry} />);
  });
  const control = field => {
    const id = `portal-filter-${field.key}`;
    const value = model.values[field.key];
    const change = next => onChange(field.key, next ?? '');
    if (field.kind === 'radio') return <Radio.Group name={`portal-sidebar-${field.key}`} value={value} onChange={change}>
      {field.options.map(option => <Radio key={option} value={option}>{option}</Radio>)}
    </Radio.Group>;
    if (field.kind === 'checkbox') return <Checkbox.Group value={value} onChange={change}>
      {field.options.map(option => {
        const label = typeof option === 'string' ? option : option.label;
        const key = typeof option === 'string' ? option : option.value;
        return <Checkbox key={key} value={key}>{label}</Checkbox>;
      })}
    </Checkbox.Group>;
    if (field.kind === 'select') return <Select id={id} aria-label={field.label} aria-labelledby={`${id}-label`} size="small"
      value={value || ''} options={[{ label: '全部', value: '' }, ...model.researchOptions.map(option => ({ label: option, value: option }))]}
      showSearch allowClear onChange={change} />;
    if (field.kind === 'year' || field.kind === 'date') {
      const Picker = field.kind === 'year' ? DatePicker.YearPicker : DatePicker;
      const format = field.kind === 'year' ? 'YYYY' : 'YYYY-MM-DD';
      const paired = model.values[field.pair];
      return <Picker value={value || undefined} format={format} placeholder={field.kind === 'year' ? 'YYYY' : '选择日期'} size="small" allowClear
        inputProps={{ id, 'aria-label': field.label, 'aria-labelledby': `${id}-label` }}
        disabledDate={date => Boolean(paired) && (field.edge === 'from' ? date.format(format) > paired : date.format(format) < paired)} onChange={change} />;
    }
    return <Input id={id} aria-label={field.label} aria-labelledby={`${id}-label`} size="small" value={value} placeholder={field.placeholder} allowClear onChange={change} />;
  };
  return <>
    {schema.map(group => <fieldset className="portal-search-filter-group" key={`${model.type}-${group.title}`}>
      <legend className="portal-search-filter-heading">{group.title}</legend>
      <div className="portal-resource-filter">
        {group.fields.map(field => {
          const hideLabel = field.kind === 'radio' || (field.kind === 'checkbox' && field.label === group.title);
          return <div className="portal-resource-field" key={field.key}>
            {!hideLabel && <label id={`portal-filter-${field.key}-label`} htmlFor={`portal-filter-${field.key}`}>{field.label}</label>}
            {control(field)}
          </div>;
        })}
      </div>
    </fieldset>)}
    {bridge}
  </>;
}
