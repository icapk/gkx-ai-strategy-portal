import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buildKnowledge, searchKnowledge } from '../src/readingKnowledge.ts'
const layout={firstPageBodyY:.23,columnX:.5,references:{page:3,x:.5,y:.408}}
const pages=JSON.parse(readFileSync(new URL('../public/antenna/index.json',import.meta.url),'utf8'))
const authors=['Meilin Wu','Yihong Su','Yu Jian Cheng','Zhiqin Zhao']

test('actual PDF produces evidenced technical entities and four verified authors',()=>{
 const result=buildKnowledge(pages,authors,layout)
 assert.equal(result.entities.filter(e=>e.kind==='学者').length,4)
 for(const id of ['shared','sleeve','vivaldi','polarization','coupling','impedance'])assert.ok(result.entities.some(e=>e.id===id),id)
 assert.ok(result.entities.every(e=>e.evidence.length&&e.evidence.every(s=>s.text&&s.page>0)))
 assert.deepEqual(result,buildKnowledge(pages,authors,layout))
 for(const edge of result.edges.filter(e=>e.relation==='同句出现')){
   const source=result.entities.find(e=>e.id===edge.source)!,target=result.entities.find(e=>e.id===edge.target)!
   assert.ok(edge.evidence.every(e=>source.evidence.some(s=>s.key===e.key)&&target.evidence.some(s=>s.key===e.key)))
 }
})
test('empty or unrelated papers do not receive template entities or unverified authors',()=>{
 assert.deepEqual(buildKnowledge([],authors,layout),{entities:[],edges:[]})
 const words=[{text:'Unrelated topic.',x:.1,y:.3,width:.2,height:.02}]
 assert.equal(buildKnowledge([{page:1,words}],authors,layout).entities.length,0)
})
test('reference-only mentions and different-sentence mentions cannot invent body relations',()=>{
 const word=(text:string,x:number,y:number)=>({text,x,y,width:.1,height:.02})
 const reference=buildKnowledge([{page:3,words:[word('sleeve monopole',.6,.6)]}],[],layout)
 assert.equal(reference.entities.length,0)
 const distinct=buildKnowledge([{page:1,words:[word('sleeve monopole.',.1,.3),word('mutual coupling.',.1,.4)]}],[],layout)
 assert.equal(distinct.entities.length,2)
 assert.ok(!distinct.edges.some(e=>e.relation==='同句出现'))
})
test('search supports normalized English aliases, Chinese terms, names and empty results',()=>{
 const {entities}=buildKnowledge(pages,authors,layout)
 assert.ok(searchKnowledge(entities,'shared-aperture').some(e=>e.id==='shared'))
 assert.ok(searchKnowledge(entities,'共口径').some(e=>e.id==='shared'))
 assert.equal(searchKnowledge(entities,'Yihong')[0].name,'Yihong Su')
 assert.equal(searchKnowledge(entities,'不存在的术语').length,0)
})
