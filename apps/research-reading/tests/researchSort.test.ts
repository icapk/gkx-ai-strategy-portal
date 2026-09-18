import test from 'node:test'
import assert from 'node:assert/strict'
import { compareResearchDocuments } from '../src/researchSort.ts'
import type { ResearchDocument } from '../src/types.ts'
const doc=(id:number,title:string,visitedAt:string,createdAt:string,favoritedAt=''):ResearchDocument=>({id,title,visitedAt,createdAt,favoritedAt,kind:'在线文档',location:'我的空间',owner:'我',size:'1 KB',owned:true,favorite:true,shared:false})
test('主排序反转不改变同分钟的创建时间与标题次级顺序',()=>{
 const a=doc(1,'A','2026-09-01 10:30:59','2026-09-02 10:00'),b=doc(2,'B','2026-09-01 10:30:01','2026-09-01 10:00')
 assert.ok(compareResearchDocuments(a,b,'visitedAt','asc')<0)
 assert.ok(compareResearchDocuments(a,b,'visitedAt','desc')<0)
})
test('收藏按收藏时间排序且未知时间始终置后',()=>{
 const a=doc(1,'A','2026-09-03 10:00','2026-09-01 10:00','2026-09-01 10:00'),b=doc(2,'B','','2026-09-01 10:00','2026-09-02 10:00')
 assert.ok(compareResearchDocuments(a,b,'favoritedAt')>0)
 assert.ok(compareResearchDocuments(a,b,'visitedAt','asc')<0)
 assert.ok(compareResearchDocuments(a,b,'visitedAt','desc')<0)
})
