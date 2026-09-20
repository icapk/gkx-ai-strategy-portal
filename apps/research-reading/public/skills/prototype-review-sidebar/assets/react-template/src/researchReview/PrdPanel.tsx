import {matchesPrdQuery} from './prdDisplay.ts'
import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { prdAreas, prdOverview, prdVersion, type PrdFeature, type PrdArea } from './prd.ts'
import { featureRules } from './prdRules.ts'

export function PrdPanel({query, view, onViewChange, onClearQuery, onLocate, catalog=prdAreas, versionLabel=prdVersion, featureTools, headingTools, detailTools, cardTools, extraOverview, overview=prdOverview, product='智能科研', source, displayNumbers={}, filtering=false}: {query:string; view:{chapter:string;opened:string[]}; onViewChange:(view:{chapter:string;opened:string[]})=>void; onClearQuery:()=>void; onLocate:(id:string,label:string)=>void;catalog?:PrdArea[];versionLabel?:string;featureTools?:(f:PrdFeature)=>ReactNode;detailTools?:(f:PrdFeature)=>ReactNode;cardTools?:(f:PrdFeature)=>ReactNode;headingTools?:(f:PrdFeature)=>ReactNode;extraOverview?:ReactNode;overview?:typeof prdOverview;product?:string;source?:string;displayNumbers?:Record<string,string>;filtering?:boolean}) {
  const {chapter,opened}=view
  const scroll=useRef<HTMLDivElement>(null)
  const normalized=query.trim().toLocaleLowerCase()
  const matches=(feature:PrdFeature)=>matchesPrdQuery(feature,query,displayNumbers[feature.id])
  const areas=normalized || filtering ? catalog.filter(area=>chapter==='overview'||area.id===chapter).map(area=>({...area,features:area.features.filter(f=>!normalized||matches(f))})).filter(area=>area.features.length) : catalog.filter(area=>area.id===chapter)
  const selected=catalog.flatMap(a=>a.features).find(f=>f.id===opened.at(-1))
  const listScroll=useRef(0)
  useLayoutEffect(()=>{if(scroll.current)scroll.current.scrollTop=selected?0:listScroll.current},[selected?.id])
  const areaNumber=(id:string)=>catalog.findIndex(area=>area.id===id)+1
  const count=areas.reduce((total,area)=>total+area.features.length,0)
  const navigate=(value:string)=>{onViewChange({chapter:value,opened:[]});if(scroll.current)scroll.current.scrollTop=0}
  const featureView=(feature:PrdFeature)=><section className="prd-feature review-card prd-aligned-card" key={feature.id}>
    <div className="review-feature-title"><button className="review-point-open" onClick={()=>{listScroll.current=scroll.current?.scrollTop??0;onViewChange({chapter,opened:[feature.id]})}}><b title={`稳定 ID：${feature.id}`}>{displayNumbers[feature.id]??feature.id}</b> {feature.title}</button><div className="review-feature-actions">{headingTools?.(feature)}</div></div>
    <div className="review-card-meta prd-card-controls">{cardTools?.(feature)}</div>
  </section>
  if(selected)return <div className="prd-panel"><div className="prd-document prd-standalone-detail" ref={scroll}>
    <div className="compliance-detail-heading"><strong>PRD详情</strong><small>{catalog.find(a=>a.features.some(f=>f.id===selected.id))?.title}{selected.parentTitle?' / '+selected.parentTitle:''}</small><button className="review-back" onClick={()=>onViewChange({chapter,opened:[]})}>‹ 返回功能列表</button></div>
    <div className="review-feature-title"><h2>{displayNumbers[selected.id]??selected.id} {selected.title}</h2>{detailTools?.(selected)}</div>
    <div className="annotation-badges"><span data-progress={selected.designProgress??'待讨论'}>{selected.designProgress??'待讨论'}</span><span>{selected.priority}</span><span>着重讲解：{selected.emphasis?'是':'否'}</span></div>
    <div className="prd-rules-box">{featureRules(selected).map((group,index)=><section className="prd-rule-group" key={index}><h4>{group.title}</h4><ol>{group.items.map((item,i)=><li key={i}>{item}</li>)}</ol></section>)}</div>
    <section className="prd-related-compact"><h3>关联原型</h3><div className="prd-links">{selected.links.length?selected.links.map(link=><button key={link.id} onClick={()=>onLocate(`${selected.id}::${link.id}`,link.label)}>{link.label} →</button>):<span>未关联原型</span>}</div></section>
    {featureTools?.(selected)}
    <details className="annotation-record-info"><summary>记录信息</summary><p>稳定 ID：{selected.id}</p><p>计划交付：{selected.release??'未设置'}</p><p>所属版本：{versionLabel}</p></details>
  </div></div>
  return <div className="prd-panel">
    <nav className="prd-navigation" aria-label="PRD章节"><label>功能区域<select aria-label="PRD功能区域" value={chapter} onChange={event=>navigate(event.target.value)}><option value="overview">需求概述</option>{catalog.map(area=><option key={area.id} value={area.id}>{areaNumber(area.id)}. {area.title} · {area.features.filter(matches).length}</option>)}</select></label></nav>
    <div className="prd-document" ref={scroll}>
      {normalized||filtering?<div className="prd-search-summary"><strong>筛选结果 · {count} 项</strong><button onClick={onClearQuery}>清除搜索</button></div>:chapter==='overview'&&!filtering?<>
        <div className="prd-document-meta">PRD / {product}<span>{versionLabel}</span></div>
        <h2>需求概述</h2><p className="prd-lead">{overview.positioning}</p>
        <h3>服务谁，解决什么问题</h3><p>{overview.users}</p><p>{overview.value}</p>
        <h3>典型场景</h3><p>{overview.scenario}</p>{extraOverview}
        <h3>产品结构</h3><div className="prd-area-index">{catalog.map((area,index)=><button key={area.id} onClick={()=>navigate(area.id)}><span>{index+1}.</span><div><strong>{area.title}</strong><p>{area.purpose}</p></div><span aria-hidden="true">›</span></button>)}</div>
        <h3>产品范围</h3><p>{overview.scope}</p>
        <div className="prd-source">{source?<p>{source}</p>:<><span>产品类比依据</span><a href={overview.sourceUrl} target="_blank" rel="noreferrer">{overview.sourceTitle} ↗</a><p>需求依据：智能科研_合规简略版0910.md；页面与交互依据：当前5174原型。回收站等内容为当前设计补充。</p></>}</div>
      </>:null}
      {areas.map(area=><section className="prd-area" key={area.id}>
        <div className="prd-document-meta">{normalized?'检索结果':'功能区域'}<span>{area.features.length} 个设计主题</span></div>
        <h2>{areaNumber(area.id)}. {area.title}</h2><p className="prd-lead">{area.purpose}</p>
        {!normalized&&<><h3>页面布局</h3><p>{area.layout}</p></>}
        <div className="prd-feature-list">{area.features.map((feature,index)=><div key={feature.id}>{feature.parentTitle&&feature.parentTitle!==area.features[index-1]?.parentTitle&&<h3 className="prd-parent-title">{displayNumbers[feature.id]?.split('.').slice(0,-1).join('.')} {feature.parentTitle}</h3>}{featureView(feature)}</div>)}</div>
      </section>)}
      {(normalized||filtering)&&!count&&<p className="review-empty">没有匹配的需求内容。</p>}
    </div>
  </div>
}

