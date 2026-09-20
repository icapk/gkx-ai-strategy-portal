import test from 'node:test'
import assert from 'node:assert/strict'
import {initialDocuments} from '../src/data.ts'
import {listResearchContent,searchResearchContent} from '../src/researchSearch.ts'
import {displayResearchLocation} from '../src/workbenchDocuments.ts'
import type {ResearchDocument,ResearchNote} from '../src/types.ts'
const pdf:ResearchDocument={...initialDocuments[0],id:400,kind:'PDF文档',title:'资料',content:'needle',visitedAt:'2026-09-01 10:00',createdAt:'2026-09-01 09:00',pdfArchive:{storageKey:'pdf-400',originalName:'p.pdf',byteSize:100,pageCount:2,annotationCount:1,parsedAt:'2026-09-01T01:00:00Z'}}
const note:ResearchNote={id:1,documentId:400,pdfAnnotationId:'note-1',pageNumber:2,title:'needle 笔记',content:'needle',tags:[],createdAt:'2026-09-01 09:00',updatedAt:'2026-09-02 10:00'}
test('位置展示补全根类型且不改变存储路径',()=>{
 assert.equal(displayResearchLocation('AI研究团队/管理'),'团队空间/AI研究团队/管理')
 assert.equal(displayResearchLocation('我的空间/管理'),'个人空间/管理')
 assert.equal(displayResearchLocation('团队空间/团队/管理'),'团队空间/团队/管理')
})
test('笔记用自身更新时间参与混排，创建时间与文档直接比较',()=>{
 const doc={...pdf,id:401,title:'needle 文档',visitedAt:'2026-09-02 10:00',createdAt:'2026-09-01 10:00'}
 assert.deepEqual(listResearchContent([pdf,doc],[note]).map(r=>r.id),['document:401','note:1','document:400'])
 assert.deepEqual(searchResearchContent([pdf,doc],[note],'needle').map(r=>r.id),['document:401','note:1'])
})
test('标题优先不受正文命中文档的较新时间影响，全部关键词必须命中',()=>{
 const doc={...pdf,kind:'在线文档' as const,visitedAt:'2026-09-03 10:00'}
 assert.deepEqual(searchResearchContent([doc],[note],'needle').map(r=>r.id),['note:1','document:400'])
 assert.equal(searchResearchContent([doc],[note],'needle missing').length,0)
})
test('非PDF、无定位信息及孤立笔记不作为PDF阅读笔记展示',()=>{
 assert.equal(listResearchContent([pdf],[{...note,pdfAnnotationId:undefined}]).length,1)
 assert.equal(listResearchContent([{...pdf,pdfArchive:undefined}],[note]).length,1)
 assert.equal(searchResearchContent([],[note],'needle').length,0)
})
