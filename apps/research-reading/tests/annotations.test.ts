import test from 'node:test'
import assert from 'node:assert/strict'
import {createAnnotation,updateAnnotation,readAnnotations,writeAnnotations,annotationKey} from '../src/annotations/store.ts'
import {resolveLinks,relationState} from '../src/annotations/relations.ts'
import {mergeAnnotationFile,parseAnnotationFile} from '../src/annotations/importExport.ts'
import {shanghaiDate,type AnnotationContext,type AnnotationFile} from '../src/annotations/model.ts'
const context:AnnotationContext={version:'v1',complianceIds:['G1','G2'],features:[{id:'D1',compliance:['G1']},{id:'D2',compliance:['G1','G2']},{id:'D3',compliance:['G2']}]}
const now='2026-09-19T01:00:00.000Z'
const sample=()=>createAnnotation('research',context,[],{title:'建议',body:'正文',entry:'compliance',directG:['G1'],directD:[]},now)
test('关联补齐一层，不通过自动关联D2扩散G2或D3；新直接关系可补齐',()=>{
 const item=sample();assert.deepEqual(item.linkedG,['G1']);assert.deepEqual(item.linkedD,['D1','D2'])
 const next=resolveLinks(item,{...context,features:[...context.features,{id:'D4',compliance:['G1']}]})
 assert.deepEqual(next.linkedD,['D1','D2','D4']);assert.deepEqual(next.linkedG,['G1'])
 assert.equal(relationState(item,{...context,complianceIds:[],features:[]}),'未关联')
 assert.equal(relationState({...item,linkedD:[]},context),'已关联')
})
test('无关联可创建；修改直接关联会重新计算；已完结可重开',()=>{
 const item=sample();const unlinked=updateAnnotation(item,{directG:[],directD:[]},context,now)
 assert.equal(relationState(unlinked,context),'未关联');assert.equal(unlinked.status,'AI 待做')
 assert.equal(updateAnnotation(unlinked,{status:'已完结'},context,now).status,'已完结')
 const done=updateAnnotation(updateAnnotation(unlinked,{status:'待审核'},context,now),{status:'已完结'},context,now)
 assert.equal(done.completedAt,done.updatedAt);assert.equal(updateAnnotation(done,{status:'AI 待做'},context).status,'AI 待做');assert.equal(updateAnnotation(done,{status:'AI 待做'},context).completedAt,undefined)
 assert.equal(updateAnnotation(done,{body:'后续说明'},context).status,'已完结')
})
test('同主键重复导入每次追加，仅正文来源更新时间变化',()=>{
 const item=sample(), imported={...item,title:'不同标题',body:'外部正文',status:'待审核' as const,directG:['G2'],linkedG:['G2'],number:88}
 const file:AnnotationFile={schema:1,product:'research',version:'v1',items:[imported]}
 const next=mergeAnnotationFile([item],file,context,'2026-09-20T01:00:00Z')
 assert.equal(next.length,1);assert.equal(next[0].body,'正文\n\n外部正文');assert.equal(next[0].source,'日常协作')
 assert.deepEqual({...next[0],body:item.body,source:item.source,updatedAt:item.updatedAt},item)
 assert.equal(mergeAnnotationFile(next,file,context,now)[0].body,'正文\n\n外部正文\n\n外部正文')
})
test('导入跨产品、非法格式及重复主键阻止；新主键重编号保留ID',()=>{
 const item=sample(), file:AnnotationFile={schema:1,product:'research',version:'v1',items:[item]}
 assert.throws(()=>parseAnnotationFile(JSON.stringify(file),'reading'),/产品不匹配/)
 assert.throws(()=>parseAnnotationFile(JSON.stringify({...file,items:[item,item]}),'research'),/重复/)
 assert.throws(()=>parseAnnotationFile(JSON.stringify({...file,items:[{...item,updatedAt:'bad'}]}),'research'),/格式/)
 assert.throws(()=>parseAnnotationFile(JSON.stringify({...file,items:[{...item,range:{target:{product:'research'},regions:[{selector:'.x',label:'x',x:-1,y:0,width:0.1,height:0.1}]}}]}),'research'),/格式/)
 const imported={...item,id:'new'};const merged=mergeAnnotationFile([item],{...file,items:[imported]},context,now)
 assert.equal(merged[1].id,'new');assert.equal(merged[1].number,2)
})
test('原型范围保存快照；创建日与更新日按上海时区',()=>{
 const range={target:{product:'research' as const},regions:[{selector:'.x',label:'区域',x:0,y:0,width:0.2,height:0.3}]}
 const item=createAnnotation('research',context,[],{title:'建议',body:'正文',entry:'prototype',directG:[],directD:[],range},now)
 range.regions[0].x=0.5;assert.equal(item.range?.regions[0].x,0)
 assert.equal(shanghaiDate('2026-09-18T16:00:00Z'),'2026-09-19')
})
test('持久化产品隔离、陈旧版本拒写、损坏与容量失败不覆盖',()=>{
 const data=new Map<string,string>(),storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v)}}
 const raw=writeAnnotations('research','v1',[sample()],null,storage)
 assert.equal(readAnnotations('research',storage).items.length,1);assert.equal(readAnnotations('reading',storage).items.length,0)
 assert.throws(()=>writeAnnotations('research','v1',[],null,storage),/另一窗口/);assert.equal(data.get(annotationKey('research')),raw)
 const failing={...storage,setItem:()=>{throw Error('QuotaExceededError')}}
 assert.throws(()=>writeAnnotations('research','v1',[],raw,failing),/Quota/);assert.equal(data.get(annotationKey('research')),raw)
 data.set(annotationKey('research'),'broken');assert.ok(readAnnotations('research',storage).error);assert.equal(data.get(annotationKey('research')),'broken')
})
test('直接D起点与多个起点仅一层展开，并去重',()=>{
 const fromD=createAnnotation('research',context,[],{title:'D意见',body:'正文',entry:'prd',directG:[],directD:['D1']},now)
 assert.deepEqual(fromD.linkedD,['D1']);assert.deepEqual(fromD.linkedG,['G1'])
 const multiple=createAnnotation('research',context,[],{title:'多点',body:'正文',entry:'prototype',directG:['G1'],directD:['D2','D2']},now)
 assert.deepEqual(multiple.linkedG,['G1','G2']);assert.deepEqual(multiple.linkedD,['D2','D1'])
 assert.ok(!multiple.linkedD.includes('D3'))
})
test('新增关系补齐，关系解除不悄悄删除原关联；失效ID不算已关联',()=>{
 const item=sample(),empty={...context,features:context.features.map(f=>({...f,compliance:[]}))}
 assert.deepEqual(resolveLinks(item,empty),{linkedG:item.linkedG,linkedD:item.linkedD})
 const missing={...item,directG:['missing'],directD:[],linkedG:['missing'],linkedD:['removed']}
 assert.equal(relationState(missing,context),'未关联')
 const manuallyUnbound=updateAnnotation(item,{directG:[],directD:[]},context,now)
 assert.deepEqual(manuallyUnbound.linkedG,[]);assert.deepEqual(manuallyUnbound.linkedD,[])
})
test('已完结记录导入正文不改状态、完结时间、范围或直接绑定',()=>{
 const original=updateAnnotation(updateAnnotation(sample(),{status:'待审核'},context,now),{status:'已完结'},context,now)
 const imported={...sample(),id:original.id,body:'外部意见',source:'技术评审' as const}
 const merged=mergeAnnotationFile([original],{schema:1,product:'research',version:'v1',items:[imported]},context,'2026-09-20T01:00:00Z')
 assert.equal(merged[0].status,'已完结');assert.equal(merged[0].completedAt,original.completedAt)
 assert.equal(merged[0].body,'正文\n\n外部意见');assert.deepEqual(merged[0].directG,original.directG)
 assert.equal(original.body,'正文');assert.equal(imported.source,'技术评审')
})
test('失败保存不污染调用方内存或原存储；状态更新不改变原对象',()=>{
 const original=sample(),originalText=JSON.stringify(original)
 const next=updateAnnotation(original,{body:'新草稿'},context,now)
 const storage={getItem:()=>null,setItem:()=>{throw Error('容量不足')}}
 assert.throws(()=>writeAnnotations('research','v1',[next],null,storage),/容量不足/)
 assert.equal(JSON.stringify(original),originalText);assert.equal(next.body,'新草稿')
 assert.equal(updateAnnotation(original,{status:'已完结'},context,now).status,'已完结')
 assert.equal(JSON.stringify(original),originalText)
})
test('同批新ID重复编号全部重新分配而ID保持稳定',()=>{
 const first=sample(),second={...sample(),id:'second'},third={...sample(),id:'third'}
 const merged=mergeAnnotationFile([first],{schema:1,product:'research',version:'v1',items:[second,third]},context,now)
 assert.deepEqual(merged.map(a=>a.number),[1,2,3]);assert.deepEqual(merged.map(a=>a.id),[first.id,'second','third'])
 assert.equal(second.number,1);assert.equal(third.number,1)
})
test('编辑器回传相同直接关联时，正文保存不删除历史补绑',()=>{
 const item=sample(),reduced={...context,features:context.features.map(f=>({...f,compliance:[]}))}
 const next=updateAnnotation(item,{body:'补充说明',directG:[...item.directG],directD:[...item.directD]},reduced,now)
 assert.deepEqual(next.linkedG,item.linkedG);assert.deepEqual(next.linkedD,item.linkedD)
 const multi={...item,directG:['G1','G2'],linkedG:['G1','G2'],linkedD:['D1','D2','D3']}
 const reordered=updateAnnotation(multi,{directG:['G2','G1','G1'],directD:[]},reduced,now)
 assert.deepEqual(reordered.linkedD,multi.linkedD)
})
test('同毫秒连续编辑、导入和时钟回拨仍更新草稿冲突基线',()=>{
 const item=sample(),first=updateAnnotation(item,{body:'第一次编辑'},context,now)
 const second=updateAnnotation(first,{body:'第二次编辑'},context,now)
 assert.ok(Date.parse(first.updatedAt)>Date.parse(item.updatedAt));assert.ok(Date.parse(second.updatedAt)>Date.parse(first.updatedAt))
 const incoming:AnnotationFile={schema:1,product:'research',version:'v1',items:[item]}
 const merged=mergeAnnotationFile([second],incoming,context,'2026-09-18T01:00:00Z')
 assert.ok(Date.parse(merged[0].updatedAt)>Date.parse(second.updatedAt))
 assert.equal(merged[0].createdAt,item.createdAt)
})
test('自动新增关联推进更新基线，原范围与终态完结日期保留',()=>{
 const done=updateAnnotation(updateAnnotation(sample(),{status:'待审核'},context,now),{status:'已完结'},context,now)
 const grown={...context,features:[...context.features,{id:'D4',compliance:['G1']}]}
 const next=updateAnnotation(done,{},grown,now)
 assert.ok(next.linkedD.includes('D4'));assert.ok(Date.parse(next.updatedAt)>Date.parse(done.updatedAt))
 assert.equal(next.status,'已完结');assert.equal(next.completedAt,done.completedAt)
 assert.equal(done.linkedD.includes('D4'),false)
})
test('审核退回仅改处理状态，完结后修改正文保留完结日期',()=>{
 const review=updateAnnotation(sample(),{status:'待审核'},context,now)
 const returned=updateAnnotation(review,{status:'AI 待做',body:'审核未通过，请补充'},context,now)
 assert.equal(returned.status,'AI 待做');assert.equal(returned.completedAt,undefined)
 const done=updateAnnotation(review,{status:'已完结'},context,now)
 const note=updateAnnotation(done,{body:'补充撤回原因',status:'已完结'},context,now)
 assert.equal(note.completedAt,done.completedAt);assert.equal(updateAnnotation(done,{status:'待审核'},context,now).status,'待审核');assert.equal(updateAnnotation(done,{status:'待审核'},context,now).completedAt,undefined)
})
test('非法范围与混合产品整批拒绝，失败保存不覆盖有效存储',()=>{
 const item=sample(),file:AnnotationFile={schema:1,product:'research',version:'v1',items:[item]}
 for(const range of [
  {target:{product:'reading'},regions:[]},
  {target:{product:'research'},regions:[{selector:'.x',label:'区域',x:0,y:0,width:0,height:0.5}]},
  {target:{product:'research'},regions:[{selector:'.x',label:'区域',x:0.8,y:0,width:0.5,height:0.5}]},
  {target:{product:'research'},regions:[],prepare:[1]},
  {target:{product:'research'},regions:[],pageContext:123},
 ])assert.throws(()=>parseAnnotationFile(JSON.stringify({...file,items:[{...item,range}]}),'research'),/格式/)
 assert.throws(()=>parseAnnotationFile(JSON.stringify({...file,items:[item,{...item,id:'reading-item',product:'reading'}]}),'research'),/格式/)
 const data=new Map<string,string>(),storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v)}}
 const raw=writeAnnotations('research','v1',[item],null,storage)
 assert.throws(()=>writeAnnotations('research','v1',[{...item,title:' '}],raw,storage),/无效/)
 assert.equal(data.get(annotationKey('research')),raw)
})
test('阅读独立导入保留稳定ID和范围快照，重新定位不改原对象',()=>{
 const range={target:{product:'reading' as const,readingView:'antenna-reader' as const},pageContext:'document:reading-a',regions:[{selector:'#reading-product-panel',label:'原文',x:0.1,y:0.2,width:0.3,height:0.4}]}
 const item=createAnnotation('reading',context,[],{title:'阅读意见',body:'正文',entry:'prototype',directG:[],directD:[],range},now)
 const file=parseAnnotationFile(JSON.stringify({schema:1,product:'reading',version:'v1',items:[item]}),'reading')
 const merged=mergeAnnotationFile([],file,context,now)
 assert.equal(merged[0].id,item.id);assert.equal(merged[0].source,'日常协作');assert.deepEqual(merged[0].range,item.range)
 const newRange=structuredClone(range);newRange.regions[0].x=0.4
 const relocated=updateAnnotation(merged[0],{range:newRange},context,now);newRange.regions[0].x=0.6
 assert.equal(relocated.range?.regions[0].x,0.4);assert.equal(item.range?.regions[0].x,0.1);assert.equal(merged[0].range?.regions[0].x,0.1)
})
