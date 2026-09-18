import { useEffect, useRef, type ReactNode } from 'react'
import { prdAreas, prdOverview, prdVersion, type PrdFeature, type PrdArea } from './prd'
import { featureRules } from './prdRules'

export function PrdPanel({query, view, onViewChange, onClearQuery, onLocate, catalog=prdAreas, versionLabel=prdVersion, featureTools, extraOverview, overview=prdOverview, product='智能科研', source}: {query:string; view:{chapter:string;opened:string[]}; onViewChange:(view:{chapter:string;opened:string[]})=>void; onClearQuery:()=>void; onLocate:(id:string,label:string)=>void;catalog?:PrdArea[];versionLabel?:string;featureTools?:(f:PrdFeature)=>ReactNode;extraOverview?:ReactNode;overview?:typeof prdOverview;product?:string;source?:string}) {
  const {chapter,opened}=view
  const scroll=useRef<HTMLDivElement>(null)
  const normalized=query.trim().toLocaleLowerCase()
  const matches=(feature:PrdFeature)=>JSON.stringify([feature.id,feature.title,feature.priority,featureRules(feature)]).toLocaleLowerCase().includes(normalized)
  const areas=normalized ? catalog.map(area=>({...area,features:area.features.filter(matches)})).filter(area=>area.features.length) : catalog.filter(area=>area.id===chapter)
  useEffect(()=>{if(opened.length)requestAnimationFrame(()=>document.getElementById(`prd-content-${opened.at(-1)}`)?.closest('.prd-feature')?.scrollIntoView({block:'start'}))},[opened])
  const count=areas.reduce((total,area)=>total+area.features.length,0)
  const navigate=(value:string)=>{onViewChange({chapter:value,opened:[]});onClearQuery();if(scroll.current)scroll.current.scrollTop=0}
  const featureView=(feature:PrdFeature)=><section className="prd-feature" key={feature.id}>
    <button className="prd-feature-heading" aria-expanded={!!normalized||opened.includes(feature.id)} aria-controls={`prd-content-${feature.id}`} onClick={()=>onViewChange({chapter,opened:opened.includes(feature.id)?opened.filter(id=>id!==feature.id):[...opened,feature.id]})}><span>{feature.id}</span><strong>{feature.title}</strong><b className={`prd-priority priority-${feature.priority}`}>{feature.priority??'—'}</b><i aria-hidden="true">{normalized||opened.includes(feature.id)?'−':'+'}</i></button>
    {(!!normalized||opened.includes(feature.id))&&<div className="prd-feature-body" id={`prd-content-${feature.id}`}>
      <div className="prd-feature-meta"><b className={`prd-priority priority-${feature.priority}`}>{feature.priority??'未分级'}</b><span>{feature.release??'历史版本'}</span></div>
      {featureRules(feature).map((group,index)=><section className="prd-rule-group" key={index}><h4>{group.title}</h4><ol>{group.items.map((item,i)=><li key={i}>{item}</li>)}</ol></section>)}
      <div className="prd-links" aria-label={`${feature.id} 原型关联`}>{feature.links.map(link=><button key={link.id} title={`定位原型：${link.label}`} onClick={()=>onLocate(`${feature.id}::${link.id}`,link.label)}><img src="/assets/reading/search.svg" alt=""/><span>{link.label}</span></button>)}</div>{featureTools?.(feature)}
    </div>}
  </section>
  return <div className="prd-panel">
    <nav className="prd-navigation" aria-label="PRD章节"><label>功能区域<select aria-label="PRD功能区域" value={chapter} onChange={event=>navigate(event.target.value)}><option value="overview">需求概述</option>{catalog.map(area=><option key={area.id} value={area.id}>{area.title} · {area.features.length}</option>)}</select></label></nav>
    <div className="prd-document" ref={scroll}>
      {normalized?<div className="prd-search-summary"><strong>全文检索 · {count} 项</strong><button onClick={onClearQuery}>清除搜索</button></div>:chapter==='overview'?<>
        <div className="prd-document-meta">PRD / {product}<span>{versionLabel}</span></div>
        <h2>需求概述</h2><p className="prd-lead">{overview.positioning}</p>
        <h3>服务谁，解决什么问题</h3><p>{overview.users}</p><p>{overview.value}</p>
        <h3>典型场景</h3><p>{overview.scenario}</p>{extraOverview}
        <h3>产品结构</h3><div className="prd-area-index">{catalog.map((area,index)=><button key={area.id} onClick={()=>navigate(area.id)}><span>0{index+1}</span><div><strong>{area.title}</strong><p>{area.purpose}</p></div><span aria-hidden="true">›</span></button>)}</div>
        <h3>产品范围</h3><p>{overview.scope}</p>
        <div className="prd-source">{source?<p>{source}</p>:<><span>产品类比依据</span><a href={overview.sourceUrl} target="_blank" rel="noreferrer">{overview.sourceTitle} ↗</a><p>需求依据：智能科研_合规简略版0910.md；页面与交互依据：当前5174原型。回收站等内容为当前设计补充。</p></>}</div>
      </>:null}
      {areas.map(area=><section className="prd-area" key={area.id}>
        <div className="prd-document-meta">{normalized?'检索结果':'功能区域'}<span>{area.features.length} 个设计主题</span></div>
        <h2>{area.title}</h2><p className="prd-lead">{area.purpose}</p>
        {!normalized&&<><h3>页面布局</h3><p>{area.layout}</p></>}
        <div className="prd-feature-list">{area.features.map(featureView)}</div>
      </section>)}
      {normalized&&!count&&<p className="review-empty">没有匹配的需求内容。</p>}
    </div>
  </div>
}
