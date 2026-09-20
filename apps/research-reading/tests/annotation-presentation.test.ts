import test from 'node:test'
import assert from 'node:assert/strict'
import {annotationUpdateDay,compareAnnotations} from '../src/annotations/presentation.ts'
import {facetCount} from '../src/facetCounts.ts'
test('更新日期每条只归属最近更新日，未更新回退创建日，联动计数不使用最大编号',()=>{
 const items=[{number:2,createdAt:'2026-09-18T18:00:00Z',updatedAt:'2026-09-19T18:00:00Z',source:'我的注释'},{number:6,createdAt:'2026-09-18T18:00:00Z',updatedAt:'',source:'日常协作'}]
 assert.deepEqual(items.map(annotationUpdateDay),['2026-09-20','2026-09-19'])
 const filters={day:'',source:''};const match=(a:typeof items[number],f:typeof filters)=>(!f.day||annotationUpdateDay(a)===f.day)&&(!f.source||a.source===f.source)
 assert.equal(facetCount(items,filters,'day','',match),2)
 assert.equal(facetCount(items,filters,'day','2026-09-19',match),1)
 assert.equal(facetCount(items,{...filters,source:'我的注释'},'day','2026-09-19',match),0)
})
test('日期与稳定序号独立正反排序，时间按实际时刻比较',()=>{
 const items=[{number:6,createdAt:'2026-09-20T00:00:00Z',updatedAt:''},{number:2,createdAt:'2026-09-19T00:00:00Z',updatedAt:'2026-09-20T09:00:00+08:00'}]
 const order=(key:'updated'|'number',direction:'asc'|'desc')=>[...items].sort((a,b)=>compareAnnotations(a,b,key,direction)).map(a=>a.number)
 assert.deepEqual(order('updated','desc'),[2,6]);assert.deepEqual(order('updated','asc'),[6,2]);assert.deepEqual(order('number','desc'),[6,2]);assert.deepEqual(order('number','asc'),[2,6]);assert.equal(items[0].number,6)
})
