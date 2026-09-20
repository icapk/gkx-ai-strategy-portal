import type { PrdBook } from '../researchReview/prdStore.ts'
import type { PrdArea } from '../researchReview/prd.ts'
import { readingAreas,readingOverview } from './catalog.ts'
import {readingSeedRevision} from './prdMigration.ts'
export type ReadingBook=PrdBook & {module:'reading'}
export function initialReadingBook():ReadingBook{return {schema:1,module:'reading',imports:[readingSeedRevision],current:'reading-v1',revisions:[{id:'reading-v1',name:'v1.0 阅读设计基线',plan:'以现有阅读原型为基线，细化原文、笔记与知识关联；优先级为产品可修改的建议值。',at:'2026-09-17T00:00:00.000Z',areas:structuredClone(readingAreas),changes:[]}]}}
export function readingMarkdown(areas:PrdArea[],name:string,plan:string){return [`# 智能阅读 PRD · ${name}`,readingOverview.positioning,`## 用户与场景`,readingOverview.users,readingOverview.scenario,readingOverview.value,`## 本版规划`,plan,...areas.flatMap(a=>[`## ${a.title}`,a.purpose,`布局：${a.layout}`,...a.features.flatMap(f=>[`### ${f.id} ${f.title}`,`优先级：${f.priority}；计划版本：${f.release}`,`着重讲解：${f.emphasis?'是':'否'}；设计进度：${f.designProgress??'待讨论'}`,...(f.rules??[]).flatMap(g=>[`#### ${g.title}`,...g.items.map((s,i)=>`${i+1}. ${s}`)]),`合规关联：${f.compliance?.join('、')||'未关联'}`,`原型目标：${f.links.map(l=>l.id).join('、')||'未关联'}`,f.manual?`人工框选：${JSON.stringify(f.manual)}`:''])])].join('\n\n')}
export function downloadReading(name:string,text:string,type='text/markdown;charset=utf-8'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
