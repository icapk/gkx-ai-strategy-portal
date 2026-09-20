import {test} from 'node:test'
import assert from 'node:assert/strict'
import * as research from '../src/researchReview/model.ts'
import * as reading from '../src/readingReview/model.ts'
for(const model of [research,reading])test(model.STORAGE_KEY+' clears old history and preserves edited content',()=>{
 const file=model.freshReview(),id=Object.keys(file.records)[0]
 Object.assign(file.records[id],{title:'新标题',requirement:'新正文',relationIds:['example'],note:'当前备注',history:[{at:new Date().toISOString(),from:'已合规',to:'待定',fromPriority:'P0',toPriority:'P1',note:'删除此旧记录'}]})
 const cleaned=model.parseReview(file)
 assert.deepEqual(cleaned.records[id].history,[])
 assert.equal(cleaned.records[id].title,'新标题')
 assert.deepEqual(cleaned.records[id].relationIds,['example'])
 let saved='';const original=globalThis.localStorage
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:()=>JSON.stringify(file),setItem:(_k:string,v:string)=>{saved=v}}})
 try{assert.equal(model.loadReview().data.records[id].title,'新标题');assert.deepEqual(JSON.parse(saved).records[id].history,[])}finally{Object.defineProperty(globalThis,'localStorage',{configurable:true,value:original})}
})
