import test from 'node:test'
import assert from 'node:assert/strict'
import {facetCount} from '../src/facetCounts.ts'
import {createAnnotation,updateAnnotation} from '../src/annotations/store.ts'
import {mergeAnnotationFile,parseAnnotationFile} from '../src/annotations/importExport.ts'
import {validReadingBook} from '../server/readingPrdValidation.mjs'
import {readingAreas} from '../src/readingReview/catalog.ts'
const context={version:'v1',complianceIds:[],features:[]}
const range={target:{product:'research' as const},regions:[{selector:'.x',label:'x',x:0,y:0,width:0.5,height:0.5}]}
test('筛选计数替换自身维度，同时保留其他条件和搜索范围',()=>{
 const items=[{status:'todo',source:'mine',text:'a'},{status:'review',source:'mine',text:'a'},{status:'todo',source:'other',text:'b'}]
 const filters={status:'todo',source:'mine'}
 const matches=(i:typeof items[number],f:typeof filters)=>(!f.status||f.status===i.status)&&(!f.source||f.source===i.source)
 assert.equal(facetCount(items,filters,'status','',matches),2)
 assert.equal(facetCount(items,filters,'status','review',matches),1)
 assert.equal(facetCount(items,filters,'source','other',matches),1)
 assert.equal(facetCount(items.filter(i=>i.text==='a'),filters,'source','other',matches),0)
 assert.deepEqual(filters,{status:'todo',source:'mine'})
})
test('新注释最初范围独立保存，多次校正、删除及同ID导入均不改变',()=>{
 const item=createAnnotation('research',context,[],{title:'原始',body:'正文',entry:'prototype',directG:[],directD:[],range})
 const changed=updateAnnotation(item,{range:{...range,regions:[{...range.regions[0],width:0.2}]}},context)
 const deleted=updateAnnotation(changed,{range:{...range,regions:[]}},context)
 assert.equal(changed.range?.regions[0].width,0.2);assert.deepEqual(deleted.range?.regions,[])
 assert.deepEqual(deleted.initialRange,range);assert.deepEqual(item.range,range)
 const imported=mergeAnnotationFile([deleted],{schema:1,product:'research',version:'v1',items:[item]},context)
 assert.deepEqual(imported[0].initialRange,range);assert.deepEqual(imported[0].range?.regions,[])
 assert.throws(()=>parseAnnotationFile(JSON.stringify({schema:1,product:'research',version:'v1',items:[{...item,initialRange:{...range,regions:[{...range.regions[0],width:2}]}}]}),'research'))
})
test('旧注释首次校正冻结之前范围，无范围新注释不会伪造初始范围',()=>{
 const item=createAnnotation('research',context,[],{title:'旧',body:'正文',entry:'prototype',directG:[],directD:[],range});delete item.initialRange
 const changed=updateAnnotation(item,{range:{...range,regions:[]}},context)
 assert.deepEqual(changed.initialRange,range)
 const empty=createAnnotation('research',context,[],{title:'空',body:'正文',entry:'prototype',directG:[],directD:[]})
 assert.deepEqual(updateAnnotation(empty,{range},context).initialRange?.regions,[])
})
test('阅读允许显式删除全部人工范围，仍拒绝越界范围',()=>{
 const areas=structuredClone(readingAreas);areas[0].features[0].manual={target:{product:'reading'},regions:[]}
 const book={schema:1,module:'reading',current:'v1',revisions:[{id:'v1',name:'v1',plan:'',at:'2026-09-20',areas,changes:[]}]}
 assert.equal(validReadingBook(book),true)
 areas[0].features[0].manual.regions=[{...range.regions[0],selector:'#reading-product-panel .x',width:2}]
 assert.equal(validReadingBook(book),false)
})
