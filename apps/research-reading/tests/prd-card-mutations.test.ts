import test from 'node:test'
import assert from 'node:assert/strict'
import {reviseFeature} from '../src/researchReview/prdMutation.ts'
import type {PrdBook} from '../src/researchReview/prdStore'
const initialPrdBook=():PrdBook=>({schema:1,current:'v2',revisions:['v1','v2'].map(id=>({id,name:id,at:'2026-09-20',plan:'',changes:[],areas:[{id:'a',title:'A',purpose:'',layout:'',features:[{id:'F',title:'功能',purpose:'',behavior:'',contract:'',current:'',links:[],acceptance:[]}]}]}))})
test('PRD快捷修改保留正文和旧版本，删除后保留可追溯快照',()=>{
 const book=initialPrdBook(),v=book.revisions.find(v=>v.id===book.current)!,area=v.areas[0],before=area.features[0]
 const edited=reviseFeature(book,area.id,before,{...before,priority:'P2',emphasis:true,designProgress:'已完成'},'卡片快捷修改')
 const after=edited.revisions.find(v=>v.id===edited.current)!.areas[0].features[0]
 assert.equal(after.title,before.title);assert.equal(after.emphasis,true);assert.equal(after.priority,'P2');assert.equal(after.designProgress,'已完成')
 const deleted=reviseFeature(edited,area.id,after,undefined,'删除功能点'),current=deleted.revisions.find(v=>v.id===deleted.current)!
 assert.equal(current.areas[0].features.some(f=>f.id===after.id),false)
 assert.deepEqual(current.changes.at(-1)!.before,after);assert.equal(current.changes.at(-1)!.after,undefined)
 assert.deepEqual(deleted.revisions[0],book.revisions[0]);assert.equal(area.features[0],before)
})
