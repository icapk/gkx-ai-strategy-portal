import test from 'node:test'
import assert from 'node:assert/strict'
import {prdDisplayNumbers,matchesPrdFilters} from '../src/researchReview/prdDisplay.ts'
import type {PrdArea,PrdFeature} from '../src/researchReview/prd'
const feature=(id:string,parentTitle?:string):PrdFeature=>({id,parentTitle,title:id,purpose:'',behavior:'',contract:'',current:'',acceptance:[],links:[]})
test('PRD显示编号基于完整目录，不改稳定ID，按主题分层',()=>{
 const areas=[{id:'a',title:'A',purpose:'',layout:'',features:[feature('REQ-A','导入'),feature('REQ-B','导入'),feature('REQ-C','搜索')]},{id:'b',title:'B',purpose:'',layout:'',features:[feature('READ-X')]}] as PrdArea[]
 const numbers=prdDisplayNumbers(areas)
 assert.deepEqual(numbers,{'REQ-A':'1.1.1','REQ-B':'1.1.2','REQ-C':'1.2.1','READ-X':'2.1'})
 assert.equal(numbers[areas[0].features.filter(f=>f.id==='REQ-B')[0].id],'1.1.2')
 assert.equal(areas[0].features[1].id,'REQ-B')
})
test('PRD组合筛选使用旧字段默认值，不写回历史对象',()=>{
 const old=feature('old');const original=JSON.stringify(old)
 assert.equal(matchesPrdFilters(old,{priority:'',emphasis:'false',progress:'待讨论'}),true)
 assert.equal(matchesPrdFilters(old,{priority:'',emphasis:'true',progress:''}),false)
 assert.equal(matchesPrdFilters({...old,priority:'P1',emphasis:true,designProgress:'已完成'},{priority:'P0',emphasis:'true',progress:'已完成'}),false)
 assert.equal(JSON.stringify(old),original)
})
