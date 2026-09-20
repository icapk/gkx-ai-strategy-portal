import test from 'node:test'
import assert from 'node:assert/strict'
import {recentDocumentWindow,recentDocumentLimitForIndex,usesWorkbenchLoadMore} from '../src/recentDocuments.ts'
test('最近浏览0/不足20/恰好20没有加载更多，21条按20+1追加',()=>{
 for(const size of [0,1,19,20]){const result=recentDocumentWindow(Array.from({length:size},(_,i)=>i));assert.equal(result.items.length,size);assert.equal(result.hasMore,false)}
 const items=Array.from({length:21},(_,i)=>i),first=recentDocumentWindow(items),next=recentDocumentWindow(items,first.nextLimit)
 assert.equal(first.items.length,20);assert.equal(first.hasMore,true);assert.deepEqual(next.items,items);assert.equal(next.hasMore,false)
})
test('多批按20累加，旧条目顺序保留；新范围默认重置20',()=>{
 const items=Array.from({length:61},(_,i)=>i),first=recentDocumentWindow(items),second=recentDocumentWindow(items,first.nextLimit),third=recentDocumentWindow(items,second.nextLimit),last=recentDocumentWindow(items,third.nextLimit)
 assert.deepEqual([first.items.length,second.items.length,third.items.length,last.items.length],[20,40,60,61])
 assert.deepEqual(second.items.slice(0,20),first.items);assert.equal(last.hasMore,false)
 assert.equal(recentDocumentWindow([...items].reverse()).items.length,20);assert.equal(recentDocumentWindow(items.filter(i=>i%2===0)).items.length,20)
})
test('定位目标扩到所在批次，不使用页码替换之前的条目',()=>{
 assert.deepEqual([-1,0,19,20,39,40].map(recentDocumentLimitForIndex),[20,20,20,40,40,60])
 const items=Array.from({length:45},(_,i)=>i),result=recentDocumentWindow(items,recentDocumentLimitForIndex(42))
 assert.deepEqual(result.items,items);assert.equal(result.hasMore,false)
})
test('仅科研工作台quick/recent/favorites统一加载更多，其他列表保持分页',()=>{
 for(const tab of ['quick','recent','favorites'])assert.equal(usesWorkbenchLoadMore('workbench',tab),true)
 for(const mode of ['space','recycle','reading'])for(const tab of ['quick','recent','favorites'])assert.equal(usesWorkbenchLoadMore(mode,tab),false)
 for(const tab of ['owned','shared'])assert.equal(usesWorkbenchLoadMore('workbench',tab),false)
})
test('工作台文件夹与文档混合结果跨批追加不重排、不遗漏，删除后按当前完整结果取前缀',()=>{
 const items=Array.from({length:45},(_,i)=>({id:i%2===0?-i-1:i+1,kind:i%2===0?'folder':'document'}))
 const before=structuredClone(items),first=recentDocumentWindow(items),second=recentDocumentWindow(items,first.nextLimit),last=recentDocumentWindow(items,second.nextLimit)
 assert.deepEqual(second.items.slice(0,20),first.items);assert.deepEqual(last.items,items);assert.equal(new Set(last.items.map(i=>i.id)).size,45)
 const remaining=items.filter((_,index)=>index!==3),afterRemoval=recentDocumentWindow(remaining,second.nextLimit)
 assert.deepEqual(afterRemoval.items,remaining);assert.equal(afterRemoval.hasMore,false);assert.deepEqual(items,before)
})
