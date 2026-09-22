import test from 'node:test'
import assert from 'node:assert/strict'
import {searchResearchContent} from '../src/researchSearch.ts'
import {initialDocuments} from '../src/data.ts'
import {automaticRecycleDue,retentionLabel} from '../src/researchPolicy.ts'
import {applyBatchAnnotationAreas,upgradeBatchAnnotationBook} from '../src/batchAnnotationRules.ts'
test('搜索仅在线文档检索正文；上传Word/Excel/PDF只按名称，PDF笔记独立检索',()=>{
 const base=initialDocuments[0]
 const kinds=['在线文档','Word文档','Excel文档','PDF文档','数据表格'] as const
 const docs=kinds.map((kind,i)=>({...base,id:100+i,title:'标题-'+i,kind,originalFileName:kind==='在线文档'?undefined:'上传文件',content:'正文唯一词',pdfTextContent:'PDF提取文本',pdfArchive:kind==='PDF文档'?{storageKey:'test',originalName:'test.pdf',byteSize:1,pageCount:1,annotationCount:1,parsedAt:new Date().toISOString()}:undefined}))
 const notes=[{id:1,documentId:103,title:'笔记标题',content:'笔记唯一词',pdfAnnotationId:'n1',pageNumber:1,tags:[],createdAt:'2026-09-20 10:00',updatedAt:'2026-09-20 10:00'}]
 assert.deepEqual(searchResearchContent(docs,notes,'正文唯一词').map(r=>r.documentId),[100])
 assert.equal(searchResearchContent(docs,notes,'PDF提取文本').length,0)
 assert.equal(searchResearchContent(docs,notes,'标题').filter(r=>r.type==='document').length,5)
 assert.equal(searchResearchContent(docs,notes,'笔记唯一词')[0].type,'note')
})
test('回收站仅带策略的新资料按30天判定；历史、未来、无效和缺失日期不清理',()=>{
 const now=new Date('2026-09-20T00:00:00Z')
 for(const retentionPolicy of [undefined,'30-days-v1'] as const){
 assert.equal(automaticRecycleDue({deletedAt:'2026-08-21T00:00:00Z',retentionPolicy},now),retentionPolicy==='30-days-v1')
 assert.equal(automaticRecycleDue({deletedAt:'2026-08-21T00:00:01Z',retentionPolicy},now),false)
 for(const deletedAt of [undefined,'bad','2027-01-01T00:00:00Z'])assert.equal(automaticRecycleDue({deletedAt,retentionPolicy},now),false)
 }
 assert.match(retentionLabel({deletedAt:'2026-08-01T00:00:00Z'},now),/历史资料/)
})
test('PRD仅修改当前版本的相关功能，保留旧版本、其他功能和历史，重复同步幂等',()=>{
 const features=[{id:'REQ-P4-05',title:'网页书签',rules:[{title:'旧规则',items:['旧内容']}]},{id:'untouched',title:'独立功能',rules:[]}]
 const areas:any=[{id:'a',features}];const old:any={id:'old',areas:structuredClone(areas),changes:[]};const current:any={id:'now',areas:structuredClone(areas),changes:[]}
 const book:any={current:'now',revisions:[old,current],imports:[]};const before=structuredClone(book),next=upgradeBatchAnnotationBook(book)
 assert.deepEqual(book,before);assert.deepEqual(next.revisions[0],old);assert.deepEqual(next.revisions[1].areas[0].features[1],features[1]);assert.equal(next.revisions[1].changes.length,1)
 assert.strictEqual(upgradeBatchAnnotationBook(next),next)
 assert.deepEqual(applyBatchAnnotationAreas(next.revisions[1].areas),next.revisions[1].areas)
})
