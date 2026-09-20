import test from 'node:test'
import assert from 'node:assert/strict'
import { collaborationArea, upgradeCollaborationBook, applyCollaborationAreas } from '../src/reviewCollaboration.ts'
import { validReadingBook } from '../server/readingPrdValidation.mjs'
import { readingAreas } from '../src/readingReview/catalog.ts'
import type { PrdBook } from '../src/researchReview/prdStore'

test('协作PRD仅增加当前版本，保留用户业务、旧版本及原历史，重复升级不产生记录',()=>{
 const areas=[{id:'user-area',title:'用户章节',purpose:'说明',layout:'布局',features:[{id:'USER-1',title:'用户改名',purpose:'',behavior:'不要覆盖',contract:'',current:'',acceptance:[],links:[],rules:[{title:'用户规则',items:['第一轮分享规则']}]}]}]
 const book:PrdBook={schema:1,current:'live',revisions:[{id:'old',name:'旧版',plan:'',at:'2026-09-01',areas:structuredClone(areas),changes:[]},{id:'live',name:'当前',plan:'用户规划',at:'2026-09-19',areas:structuredClone(areas),changes:[]}]}
 const before=structuredClone(book),next=upgradeCollaborationBook(book,'research')
 assert.deepEqual(book,before);assert.deepEqual(next.revisions[0],before.revisions[0]);assert.deepEqual(next.revisions[1].areas[0],before.revisions[1].areas[0])
 assert.equal(next.current,'live');assert.equal(next.revisions[1].changes.length,8)
 assert.equal(upgradeCollaborationBook(next,'research'),next)
 assert.deepEqual(next.revisions[1].areas[1],collaborationArea('research'))
})
test('两产品协作ID隔离，进度默认待讨论且着重讲解独立；阅读服务器校验新旧字段',()=>{
 const research=collaborationArea('research'),reading=collaborationArea('reading')
 assert.equal(research.features.length,8);assert.ok(research.features.every(f=>f.id.startsWith('REQ-')));assert.ok(reading.features.every(f=>f.id.startsWith('READ-')))
 assert.ok(reading.features.every(f=>f.emphasis===false&&f.designProgress==='待讨论'))
 const book={schema:1,module:'reading',current:'v1',revisions:[{id:'v1',name:'当前',plan:'验证',at:'2026-09-19',areas:structuredClone(readingAreas),changes:[]}]}
 assert.equal(validReadingBook(book),true)
 const feature=book.revisions[0].areas.at(-1)!.features[0];feature.designProgress='已完成';feature.emphasis=true;assert.equal(validReadingBook(book),true)
 Object.assign(feature,{designProgress:'自动完成'});assert.equal(validReadingBook(book),false)
})
test('阅读旧两模式文本仅作已确认替换，不覆盖用户自定义规则或标题',()=>{
 const areas=[{id:'review',title:'评审',purpose:'',layout:'合规审查、PRD两种模式',features:[{...collaborationArea('reading').features[0],id:'READ-REV-01',title:'用户标题',rules:[{title:'用户组',items:['用户添加规则','侧边栏仅包含合规审查模式与 PRD 模式，两产品一致。']}]}]}]
 const next=applyCollaborationAreas(areas,'reading')
 assert.equal(next[0].features[0].title,'用户标题');assert.equal(next[0].features[0].rules![0].items[0],'用户添加规则')
 assert.match(next[0].features[0].rules![0].items[1],/注释模式/);assert.match(next[0].layout,/三种模式/)
 assert.equal(applyCollaborationAreas(next,'reading').length,next.length)
})
