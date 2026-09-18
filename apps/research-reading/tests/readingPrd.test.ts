import test from 'node:test'
import assert from 'node:assert/strict'
import {readingAreas} from '../src/readingReview/catalog.ts'
import {validReadingBook} from '../server/readingPrdValidation.mjs'
import {readingLocations,readingTargets} from '../src/prototypeFocus/readingTargets.ts'
import {points,loadReview,STORAGE_KEY} from '../src/readingReview/model.ts'
import {migrateReadingBook} from '../src/readingReview/prdMigration.ts'
const book=()=>({schema:1,module:'reading',current:'v1',revisions:[{id:'v1',name:'阅读v1',plan:'验证',at:'2026-09-17',areas:structuredClone(readingAreas),changes:[]}]})
test('reading catalog has independent IDs, priorities, rules and exact links',()=>{
 const leaves=readingAreas.flatMap(a=>a.features)
 assert.ok(leaves.length>=40)
 assert.equal(new Set(leaves.map(f=>f.id)).size,leaves.length)
 for(const f of leaves){assert.ok(f.priority);assert.ok(f.links.length);assert.ok(f.rules?.every(g=>g.items.length));assert.ok(!JSON.stringify(f.rules).match(/数据与交付规则|现状与待确认|验收场景/))}
 assert.ok(validReadingBook(book()))
 for(const f of leaves){for(const id of f.compliance??[])assert.ok(points.some(p=>p.id===id));for(const link of f.links)assert.equal(readingTargets[readingLocations[link.id]?.navigationTarget]?.product,'reading')}
})
test('loading review never replaces a user status with the baseline',()=>{
 const old=globalThis.localStorage
 const record={status:'不合规',priority:'P2',history:[]}
 Object.defineProperty(globalThis,'localStorage',{value:{getItem:(key:string)=>key===STORAGE_KEY?JSON.stringify({version:1,records:{'F1.1':record}}):null},configurable:true})
 try{assert.deepEqual(loadReview().data.records['F1.1'],record)}finally{Object.defineProperty(globalThis,'localStorage',{value:old,configurable:true})}
})
test('pre-release migration is idempotent and preserves user changes',()=>{
 const b=book() as import('../src/readingReview/prdBook').ReadingBook
 const f=b.revisions[0].areas[0].features.find(f=>f.id==='READ-LIB-06')!;f.rules=[{title:'用户规则',items:['用户已经编辑，不要覆盖']}]
 const updated=migrateReadingBook(b,readingAreas)
 assert.deepEqual(updated.revisions[0].areas[0].features.find(f=>f.id==='READ-LIB-06')!.rules,f.rules)
 assert.equal(migrateReadingBook(updated,readingAreas),updated)
 assert.equal(b.imports,undefined)
})
test('reading storage rejects research book, duplicated IDs and invalid manual geometry',()=>{
 const b=book();assert.equal(validReadingBook({...b,module:'research'}),false)
 b.revisions[0].areas[0].features.push(b.revisions[0].areas[0].features[0]);assert.equal(validReadingBook(b),false)
 const c=book();c.revisions[0].areas[0].features[0].manual={target:{product:'reading'},regions:[{selector:'#reading-product-panel',label:'区域',x:.9,y:0,width:.5,height:.5}]};assert.equal(validReadingBook(c),false)
 c.revisions[0].areas[0].features[0].manual!.regions[0].width=.1;assert.equal(validReadingBook(c),true)
 c.revisions[0].areas[0].features[0].manual!.target.product='research';assert.equal(validReadingBook(c),false)
})
