import { useEffect, useMemo, useState } from 'react'
import type { PaperAnchor } from '../antennaPaper'
import { buildKnowledge, searchKnowledge, type KnowledgePage, type KnowledgeKind } from '../readingKnowledge'
import './antennaKnowledge.css'

export function KnowledgeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 18V5a3 3 0 0 0-5.8-1A4 4 0 0 0 3 10.5a4 4 0 0 0 .5 7.5A4 4 0 0 0 12 18Z"/><path d="M12 18V5a3 3 0 0 1 5.8-1 4 4 0 0 1 3.2 6.5 4 4 0 0 1-.5 7.5A4 4 0 0 1 12 18Z"/><path d="M8 8c-2 0-3-1-3-2M16 8c2 0 3-1 3-2M8 12c0 2-1 3-3 3M16 12c0 2 1 3 3 3M8 18c0-2 2-3 4-3M16 18c0-2-2-3-4-3"/></svg>
}


const tabs=['知识图谱','技术','学术理论','学者'] as const
type Tab=typeof tabs[number]
export function AntennaKnowledge({locate,pages,authors,focusId,focusSequence,focusTab}:{locate:(anchor:PaperAnchor)=>void;pages:KnowledgePage[];authors:string[];focusId?:string;focusSequence?:number;focusTab?:Tab}) {
  const [tab,setTab]=useState<Tab>('知识图谱')
  const [query,setQuery]=useState('')
  const [selected,setSelected]=useState('')
  const graph=useMemo(()=>buildKnowledge(pages,authors,{firstPageBodyY:.23,columnX:.5,references:{page:3,x:.5,y:.408}}),[pages,authors])
  useEffect(()=>{if(focusId==='F20.1'||focusId==='F20.4'){setTab('知识图谱');setQuery('')}},[focusId,focusSequence])
  useEffect(()=>{if(focusTab){setTab(focusTab);setQuery('');setSelected('')}},[focusTab,focusSequence])
  const matched=searchKnowledge(graph.entities,query)
  const filtered=matched.filter(entity=>tab==='知识图谱'||entity.kind===tab)
  const active=filtered.find(entity=>entity.id===selected)??filtered[0]
  const groups=tabs.slice(1) as KnowledgeKind[]
  const nodes=groups.flatMap(kind=>filtered.filter(entity=>entity.kind===kind))
  const positions=new Map(nodes.map((node,i)=>[node.id,{x:i%2?310:110,y:132+Math.floor(i/2)*92}]))
  const graphHeight=Math.max(210,180+Math.ceil(nodes.length/2)*92)
  const related=active?graph.edges.filter(edge=>edge.relation==='同句出现'&&(edge.source===active.id||edge.target===active.id)):[]
  const switchTab=(name:Tab)=>{setTab(name);setSelected('')}
  return <div className="antenna-graph knowledge-panel">
    <div className="knowledge-tabs" role="tablist" aria-label="论文知识视图">{tabs.map(name=><button key={name} role="tab" aria-selected={tab===name} onClick={()=>switchTab(name)}>{name}</button>)}</div>
    <label className="knowledge-search"><img src="/assets/reading/search.svg" alt=""/><input aria-label="搜索论文关联知识" value={query} onChange={e=>{setQuery(e.target.value);setSelected('')}} placeholder="搜索名称、别名或原文"/>{query&&<button aria-label="清除知识搜索" onClick={()=>setQuery('')}>×</button>}</label>
    <small className="knowledge-scope">当前论文 · {graph.entities.filter(e=>e.kind==='技术').length} 项技术 · {graph.entities.filter(e=>e.kind==='学术理论').length} 项理论与原理 · {graph.entities.filter(e=>e.kind==='学者').length} 位学者</small>
    {!pages.length?<p role="status">正在读取论文文本…</p>:!filtered.length?<p className="knowledge-empty">{query?'未找到匹配内容。':'当前论文未识别到此类信息。'}</p>:<>
      {tab==='知识图谱'?<section className="knowledge-network">
        <svg className="antenna-graph-scene knowledge-scene" style={{aspectRatio:`420 / ${graphHeight}`}} viewBox={`0 0 420 ${graphHeight}`} aria-label="论文知识关系图">
          <g className="knowledge-paper-node"><rect x="150" y="18" width="120" height="36" rx="5"/><text x="210" y="40">当前论文</text></g>
          {nodes.map(node=>{const p=positions.get(node.id)!;return <g key={node.id}><path d={`M210 54 V${p.y-33} H${p.x} V${p.y-20}`}/><text x={p.x} y={p.y-27}>{node.kind==='学者'?'署名作者':'正文提及'}</text></g>})}
          {related.map(edge=>{const a=positions.get(edge.source),b=positions.get(edge.target);return a&&b?<path key={edge.source+edge.target} className="knowledge-cooccurrence" d={`M${a.x} ${a.y+20} Q210 ${(a.y+b.y)/2} ${b.x} ${b.y-20}`}><title>同句出现</title></path>:null})}
          {nodes.map(node=>{const p=positions.get(node.id)!;return <g key={node.id} role="button" tabIndex={0} aria-label={`查看${node.name}`} aria-pressed={active?.id===node.id} onClick={()=>setSelected(node.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(node.id)}}} className={`antenna-graph-node knowledge-node knowledge-kind-${groups.indexOf(node.kind)} ${active?.id===node.id?'is-selected':''}`}><rect x={p.x-85} y={p.y-20} width="170" height="40" rx="5"/><text x={p.x} y={p.y+4}>{node.name}</text></g>})}
        </svg>
        <div className="knowledge-legend">{groups.map((kind,i)=><span key={kind}><i className={`kind-${i}`}/>{kind}</span>)}<span>虚线：同句出现</span></div>
      </section>:<section className="knowledge-results" aria-label={`${tab}整理`}>
        <header className="knowledge-category-heading"><strong>{tab==='学术理论'?'理论与原理':tab==='学者'?'本文署名作者':'正文涉及技术'}</strong><small>{filtered.length} 项</small></header>
        {filtered.map(entity=><button key={entity.id} aria-pressed={active?.id===entity.id} onClick={()=>setSelected(entity.id)}><strong>{entity.name}</strong>{entity.english&&<span>{entity.english}</span>}<span>{entity.kind==='学者'?'署名已核对':entity.definition}</span><small>{entity.kind==='学者'?'首页署名':`${entity.evidence.length} 处证据 · 第 ${[...new Set(entity.evidence.map(e=>e.page))].join('、')} 页`}</small></button>)}
      </section>}
      {active&&<article className="knowledge-detail">
        <small>{active.kind} · {active.kind==='学者'?'结构化作者信息':'术语词表匹配'}</small><h3>{active.name}</h3>
        {active.kind!=='学者'&&<><h4>概念说明</h4><p>{active.definition}</p><small>来源：受控术语词表</small></>}
        {active.kind==='学者'&&<><h4>本文关联</h4><p>当前论文署名作者；与下列作者共同署名。</p><div className="knowledge-author-links">{graph.entities.filter(e=>e.kind==='学者'&&e.id!==active.id).map(author=><button key={author.id} onClick={()=>{setQuery('');setSelected(author.id)}}>{author.name}</button>)}</div><p className="knowledge-scope">研究专长、个人履历：未收录</p></>}
        {related.length>0&&<><h4>关联{active.kind==='技术'?'理论与原理':'技术'}</h4>{related.map(edge=>{const other=graph.entities.find(e=>e.id===(edge.source===active.id?edge.target:edge.source))!;return <button className="knowledge-related" key={other.id} onClick={()=>{setTab(other.kind);setSelected(other.id);setQuery('')}}><span>{other.name}</span><small>同句出现 · {edge.evidence.length} 处 →</small></button>})}</>}
        <h4>{active.kind==='学者'?'署名依据':'原文证据'}</h4>
        {active.evidence.slice(0,3).map(e=><div className="knowledge-evidence" key={e.key}><blockquote>{e.text}</blockquote><button className="knowledge-source" onClick={()=>locate(e)}>定位原文 · 第 {e.page} 页 →</button></div>)}
        {active.evidence.length>3&&<details><summary>其余 {active.evidence.length-3} 处证据</summary>{active.evidence.slice(3).map(e=><div className="knowledge-evidence" key={e.key}><blockquote>{e.text}</blockquote><button className="knowledge-source" onClick={()=>locate(e)}>定位原文 · 第 {e.page} 页 →</button></div>)}</details>}
      </article>}
    </>}
  </div>
}
