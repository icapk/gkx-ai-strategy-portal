import test from 'node:test'
import assert from 'node:assert/strict'
import {setAnnotationRelation,annotationRelationSources,resolveLinks} from '../src/annotations/relations.ts'
import {createAnnotation,updateAnnotation} from '../src/annotations/store.ts'
import {parseAnnotationFile,mergeAnnotationFile,validAnnotationRestore} from '../src/annotations/importExport.ts'
import type {AnnotationBindings,AnnotationContext,AnnotationFile} from '../src/annotations/model.ts'
const context:AnnotationContext={version:'v1',complianceIds:['G1','G2','G3'],features:[{id:'D1',compliance:['G1','G2']},{id:'D2',compliance:['G1']},{id:'D3',compliance:['G3']}]}
const empty=():AnnotationBindings=>({directG:[],directD:[],linkedG:[],linkedD:[]})
const select=(state:AnnotationBindings,kind:'compliance'|'prd',id:string,selected=true)=>setAnnotationRelation(state,context,kind,id,selected)
test('多对多取消G1保留G2支持的D1，移除失去来源的D2；不改全局映射',()=>{
 const original=JSON.stringify(context),state=select(select(empty(),'compliance','G1'),'compliance','G2'),before=structuredClone(state)
 const next=select(state,'compliance','G1',false)
 assert.deepEqual(next.directG,['G2']);assert.deepEqual(next.linkedG,['G2']);assert.deepEqual(next.linkedD,['D1'])
 assert.deepEqual(state,before);assert.equal(JSON.stringify(context),original)
})
test('取消自动D1同时取消导致它补齐的G选择，独立D3和一层G3保留',()=>{
 const state=select(select(select(select(empty(),'compliance','G1'),'compliance','G2'),'prd','D1'),'prd','D3')
 const next=select(state,'prd','D1',false)
 assert.deepEqual(next.directG,[]);assert.deepEqual(next.directD,['D3']);assert.deepEqual(next.linkedG,['G3']);assert.deepEqual(next.linkedD,['D3'])
 assert.ok(next.excludedD?.includes('D1'))
})
test('只取消源G1时D1若独立手选会作为G1来源同步取消，其他独立选择仍保留',()=>{
 const state=select(select(select(empty(),'compliance','G1'),'prd','D1'),'prd','D3')
 const next=select(state,'compliance','G1',false)
 assert.deepEqual(next.directD,['D3']);assert.deepEqual(next.linkedG,['G3']);assert.deepEqual(next.linkedD,['D3'])
})
test('支持来源区分直接、自动、旧历史；失效历史可明确取消，不猜来源',()=>{
 const state=select(select(empty(),'compliance','G1'),'prd','D1')
 assert.deepEqual(annotationRelationSources(state,context,'prd','D1'),{direct:true,automaticFrom:[{kind:'compliance',id:'G1'}],historical:false})
 const legacy={...state,linkedD:[...state.linkedD,'old-D']}
 assert.deepEqual(annotationRelationSources(legacy,context,'prd','old-D'),{direct:false,automaticFrom:[],historical:true})
 assert.ok(select(legacy,'prd','D3').linkedD.includes('old-D'))
 assert.ok(!select(legacy,'prd','old-D',false).linkedD.includes('old-D'))
})
test('取消项经过保存、导出导入和后续补齐不复活，明确重新选择可恢复',()=>{
 const state=select(select(empty(),'compliance','G1'),'prd','D1',false)
 const item=createAnnotation('research',context,[],{title:'关联调整',body:'说明',entry:'prototype',...state},'2026-09-20T01:00:00Z')
 const file=parseAnnotationFile(JSON.stringify({schema:1,product:'research',version:'v1',items:[item]}),'research')
 const imported=mergeAnnotationFile([],file,context,'2026-09-20T02:00:00Z')[0]
 assert.ok(!resolveLinks(imported,context).linkedD.includes('D1'))
 const next=updateAnnotation(imported,{body:'仅正文'},context);assert.ok(!next.linkedD.includes('D1'))
 const restored=select(next,'compliance','G1');assert.ok(restored.linkedD.includes('D1'));assert.ok(!restored.excludedD?.includes('D1'))
})
test('完整bindings保存取消结果；同ID导入不覆盖本地取消、状态或绑定',()=>{
 const state=select(select(empty(),'compliance','G1'),'compliance','G2')
 const item=createAnnotation('research',context,[],{title:'测试',body:'原文',entry:'prototype',...state})
 const canceled=updateAnnotation(item,select(item,'prd','D1',false),context)
 const file:AnnotationFile={schema:1,product:'research',version:'v1',items:[{...item,body:'导入',status:'待审核'}]}
 const next=mergeAnnotationFile([canceled],file,context,'2026-09-21T00:00:00Z')[0]
 assert.equal(next.body,'原文\n\n导入');assert.equal(next.source,'日常协作');assert.equal(next.status,canceled.status)
 assert.deepEqual(next.excludedD,canceled.excludedD);assert.deepEqual(next.linkedD,canceled.linkedD);assert.deepEqual(next.directG,canceled.directG)
})
test('旧数据无取消字段继续解析且普通正文保留映射减少后的历史关联',()=>{
 const item=createAnnotation('research',context,[],{title:'旧条目',body:'原文',entry:'compliance',directG:['G1'],directD:[]})
 assert.equal(item.excludedG,undefined)
 const loaded=parseAnnotationFile(JSON.stringify({schema:1,product:'research',version:'v1',items:[item]}),'research').items[0]
 const reduced={...context,features:context.features.map(f=>({...f,compliance:[]}))}
 assert.deepEqual(updateAnnotation(loaded,{body:'正文编辑',directG:['G1'],directD:[]},reduced).linkedD,item.linkedD)
 const invalid={...item,excludedG:'G1'}
 assert.throws(()=>parseAnnotationFile(JSON.stringify({schema:1,product:'research',version:'v1',items:[invalid]}),'research'),/格式/)
})
test('页面恢复只接受两产品白名单状态，拒绝执行字段、跨产品和非法枚举',()=>{
 const research={schema:1,product:'research',section:'personal',tab:'recent',surface:'workspace',share:{kind:'file',id:1,targetPath:'我的空间',expanded:true}}
 const reading={schema:1,product:'reading',view:'reader',documentId:2,left:'outline',right:'notes'}
 assert.equal(validAnnotationRestore(research,'research'),true);assert.equal(validAnnotationRestore(reading,'reading'),true)
 for(const state of [{...research,execute:'submit'},{...research,modal:'share-and-submit'},{...research,documentId:-1},{...research,share:{...research.share,action:'move'}},{...research,share:{...research.share,expanded:'yes'}},reading])assert.equal(validAnnotationRestore(state,'research'),false)
 assert.equal(validAnnotationRestore({...reading,right:'execute'},'reading'),false)
 assert.equal(validAnnotationRestore({...research,modal:'new-folder'},'research'),true)
 assert.equal(validAnnotationRestore({...reading,library:{section:'recent',search:'keyword',page:2,pageSize:20},uploadFolderOpen:true},'reading'),true)
 for(const library of [{section:'recent',search:'',page:0,pageSize:20},{section:'recent',search:'',page:1,pageSize:-1},{section:'recent',search:'',page:1,pageSize:20,execute:'submit'}])assert.equal(validAnnotationRestore({...reading,library},'reading'),false)
 const item=createAnnotation('research',context,[],{title:'恢复',body:'正文',entry:'prototype',directG:[],directD:[]})
 const file={schema:1,product:'research',version:'v1',items:[{...item,range:{target:{product:'research'},regions:[],restore:research}}]}
 assert.equal(parseAnnotationFile(JSON.stringify(file),'research').items.length,1)
 assert.throws(()=>parseAnnotationFile(JSON.stringify({...file,items:[{...file.items[0],range:{...file.items[0].range,restore:reading}}]}),'research'),/格式/)
})
