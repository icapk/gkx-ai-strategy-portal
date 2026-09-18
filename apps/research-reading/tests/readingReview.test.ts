import test from 'node:test'
import assert from 'node:assert/strict'
import { points, freshReview, parseReview, initialFilters, matches } from '../src/readingReview/model.ts'
import { sanitizeReadingWorkspaceState, createDefaultReadingWorkspaceState } from '../src/readingWorkspaceStorage.ts'
import { storySteps } from '../src/readingReview/storySteps.ts'

test('story walkthroughs reference every leaf in the correct story',()=>{
  storySteps.forEach((steps,story)=>{
    const ids=new Set(steps.flat().filter(part=>typeof part!=='string').map(part=>part.id))
    assert.deepEqual([...ids].sort(),points.filter(p=>p.story===story).map(p=>p.id).sort())
  })
})

test('recent visits and sample migration marker survive storage',()=>{
  const state=createDefaultReadingWorkspaceState([{id:1,title:'Test',authors:'A',journal:'J',year:'2026',type:'PDF',size:'1',favorite:false,folder:'f',visitedAt:'2026-09-09T09:00:00.000Z'}],[])
  state.sampleVersion=1
  const result=sanitizeReadingWorkspaceState(JSON.parse(JSON.stringify(state)))
  assert.equal(result.documents[0].visitedAt,state.documents[0].visitedAt)
  assert.equal(result.sampleVersion,1)
  assert.equal(sanitizeReadingWorkspaceState({...result,documents:[]}).sampleVersion,1)
})

test('38 unique leaf requirements have complete, exclusive story coverage',()=>{
  assert.equal(points.length,38)
  assert.equal(new Set(points.map(p=>p.id)).size,38)
  assert.deepEqual([0,1,2,3,4].map(s=>points.filter(p=>p.story===s).length),[8,5,14,7,4])
  assert.deepEqual([0,1,2,3].map(g=>points.filter(p=>p.group===g).length),[23,2,2,11])
  assert.ok(points.every(p=>p.requirement&&p.acceptance&&p.baseline.reason))
})
test('filters intersect across dimensions, facets exclude themselves, deselect all is empty',()=>{
  const data=freshReview(),f=initialFilters()
  f.group='0';f.parent='F5';f.child='F5.2'
  assert.deepEqual(points.filter(p=>matches(p,data,f)).map(p=>p.id),['F5.2'])
  f.statuses=[]
  assert.equal(points.filter(p=>matches(p,data,f)).length,0)
  assert.equal(points.filter(p=>matches(p,data,f,'status')).length,1)
  f.mode='story';f.stories=[4];f.statuses=['已合规'];f.priorities=['P2']
  assert.equal(points.filter(p=>matches(p,data,f)).length,4)
  f.priorities=['P0'];assert.equal(points.filter(p=>matches(p,data,f)).length,0)
})
test('review import accepts partial ID records and rejects incompatible or corrupt input',()=>{
  const data=freshReview()
  assert.deepEqual(parseReview(data),data)
  assert.equal(Object.keys(parseReview({version:1,records:{F4:data.records.F4}}).records).length,1)
  for(const invalid of [null,{version:2,records:{}},{version:1,records:{F99:data.records.F4}},{version:1,records:{F4:{...data.records.F4,status:'完成'}}},{version:1,records:{F4:{...data.records.F4,history:[{note:'bad'}]}}}]) assert.throws(()=>parseReview(invalid))
})
test('PDF anchors survive storage while unrelated notes remain scoped to their document',()=>{
  const state=createDefaultReadingWorkspaceState([{id:1,title:'Existing',authors:'a',journal:'j',year:'2024',type:'PDF',size:'1',favorite:false,folder:'f'},{id:2,title:'New',authors:'a',journal:'j',year:'2024',type:'PDF',size:'1',favorite:false,folder:'f'}],[])
  state.notes=[{id:1,documentId:1,title:'Old',excerpt:'untouched',createdAt:'',color:'#FFE4BA'},{id:2,documentId:2,title:'New',excerpt:'quote',createdAt:'',color:'#FFE4BA',sourceAnchor:{page:3,x:.2,y:.4},sourceRects:[{x:.2,y:.4,width:.3,height:.02}]}]
  const result=sanitizeReadingWorkspaceState(JSON.parse(JSON.stringify(state)))
  assert.equal(result.notes[0].documentId,1)
  assert.equal(result.notes[0].excerpt,'untouched')
  assert.deepEqual(result.notes[1].sourceAnchor,{page:3,x:.2,y:.4})
  assert.equal(result.notes[1].sourceRects?.length,1)
})
