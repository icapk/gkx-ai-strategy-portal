import test from 'node:test'
import assert from 'node:assert/strict'
import {displayMinute,displayBytes,documentSizeLabel} from '../src/displayFormat.ts'
import {groupShareTargets,shareTargetLabel} from '../src/annotations/shareTargets.ts'
import type {ResearchDocument,ResearchDataTable} from '../src/types.ts'
test('time display drops seconds without changing source and uses Shanghai for ISO',()=>{
 const timestamp='2026-09-20T05:09:25.545Z'
 assert.equal(displayMinute(timestamp),'2026-09-20 13:09')
 assert.equal(timestamp,'2026-09-20T05:09:25.545Z')
 assert.equal(displayMinute('2026-09-20 13:09:25'),'2026-09-20 13:09')
 assert.equal(displayMinute('2026/9/20 9:09:25'),'2026-09-20 09:09')
 assert.equal(displayMinute(undefined),'—')
})
test('nonzero small files, zero and unknown are distinct; native content supersedes stale zero',()=>{
 assert.equal(displayBytes(12),'<0.01 MB');assert.equal(displayBytes(0),'0.00 MB');assert.equal(displayBytes(null),'-');assert.equal(displayBytes(1024**2),'1.00 MB')
 const doc={kind:'在线文档',size:'0 KB',content:'非空内容'} as ResearchDocument
 assert.equal(documentSizeLabel(doc),'<0.01 MB');assert.equal(doc.size,'0 KB')
 assert.equal(documentSizeLabel({...doc,kind:'PDF文档',pdfArchive:{byteSize:500} as ResearchDocument['pdfArchive']}),'<0.01 MB')
 assert.equal(documentSizeLabel({...doc,kind:'Word文档',size:'未知'}),'-')
 assert.equal(documentSizeLabel({...doc,kind:'数据表格'}, {rows:[{values:{a:'数据'}}]} as unknown as ResearchDataTable),'<0.01 MB')
})
test('share grouping keeps same-named folders in distinct spaces, no invented targets',()=>{
 const options=['我的空间','我的空间/资料','A团队','A团队/资料','B团队/资料'].map(value=>({value,label:value}))
 const g=groupShareTargets(options)
 assert.equal(g.personal.length,2);assert.deepEqual(g.teams.map(t=>t.name),['A团队','B团队'])
 assert.equal(shareTargetLabel('A团队/资料'),'团队空间 / A团队 / 资料')
 assert.equal(shareTargetLabel('我的空间/资料'),'个人空间 / 资料')
 assert.equal(g.personal.length+g.teams.flatMap(t=>t.items).length,options.length)
})
