import {catalogs} from '../sidebar.config.ts'
import {featureRules,type PrdRule} from './prdRules.ts'
export interface PrdFeature {
  emphasis?: boolean
  designProgress?: '待讨论'|'待完善'|'已完成'
  manual?: import('../prototypeFocus/manual.ts').ManualMapping
  rules?: PrdRule[]
  priority?: 'P0'|'P1'|'P2'
  release?: string
  parentTitle?: string
  compliance?: string[]
  id: string
  title: string
  purpose: string
  behavior: string
  contract: string
  current: string
  acceptance: string[]
  links: {id: string; label: string}[]
}
export interface PrdArea {
  id: string
  title: string
  purpose: string
  layout: string
  features: PrdFeature[]
}

export const prdVersion='v1.0 示例'
export const prdOverview=catalogs.research.overview
export const prdAreas=catalogs.research.areas
export const legacyPrdAreas=prdAreas
export const prdConventions=[]
export function prdMarkdown(areas = prdAreas, version = 'v2.0 细化评审稿') {
  const overview = prdOverview
  return ['# 智能科研 PRD',version,'## 需求概述',overview.positioning,overview.users,overview.scenario,overview.value,'### 产品范围',overview.scope,`参照：[${overview.sourceTitle}](${overview.sourceUrl})`,...areas.flatMap(area=>['## '+area.title,area.purpose,'### 页面布局',area.layout,...area.features.flatMap(feature=>['### '+feature.id+' '+feature.title,'优先级：'+(feature.priority??'未分级')+' · 计划版本：'+(feature.release??'历史原稿'),'着重讲解：'+(feature.emphasis?'是':'否')+' · 设计进度：'+(feature.designProgress??'待讨论'),'合规关联：'+(feature.compliance?.join('、')||'待关联'),...featureRules(feature).flatMap(group=>['#### '+group.title,group.items.map((text,i)=>`${i+1}. ${text}`).join('\n')]),'原型关联：'+feature.links.map(link=>link.id+' '+link.label).join('；')])])].join('\n\n')+'\n'
}
export function exportPrd(areas = prdAreas, version = 'v2.0 细化评审稿') {
  const url=URL.createObjectURL(new Blob([prdMarkdown(areas,version)],{type:'text/markdown;charset=utf-8'}))
  const anchor=document.createElement('a');anchor.href=url;anchor.download='智能科研-PRD-设计评审稿.md';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
}
