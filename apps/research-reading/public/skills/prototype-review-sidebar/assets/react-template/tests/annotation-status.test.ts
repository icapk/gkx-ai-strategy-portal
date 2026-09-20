import test from 'node:test'
import assert from 'node:assert/strict'
import {mkdtempSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {createServer} from 'node:http'
import {annotationShared} from '../server/annotationShared.mjs'
import {createAnnotation,updateAnnotation} from '../src/annotations/store.ts'
import {annotationStatuses} from '../src/annotations/model.ts'
import {parseAnnotationFile,mergeAnnotationFile} from '../src/annotations/importExport.ts'
const ctx={version:'v1',complianceIds:[],features:[]}
test('科研和阅读所有12种状态切换均持久化，暂缓可导入、移除恢复，保护原正文及范围',async()=>{
 const directory=mkdtempSync(join(tmpdir(),'annotation-status-'));let handler
 const setup=()=>annotationShared({directory}).configureServer({config:{server:{port:5199},root:directory},middlewares:{use:fn=>{handler=fn}}})
 setup()
 const server=createServer((req,res)=>handler(req,res,()=>{res.statusCode=404;res.end()}))
 await new Promise(r=>server.listen(0,'127.0.0.1',r))
 try{
  for(const product of ['research','reading']){
   const url=`http://127.0.0.1:${server.address().port}/api/annotations/${product}`
   let snap=await(await fetch(url)).json()
   const save=async(items,trash=[])=>{const r=await fetch(url,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({expectedRevision:snap.revision,version:'v1',items,trash})});assert.equal(r.status,200);snap=await r.json();return snap}
   const original=createAnnotation(product,ctx,[],{title:'状态验证',body:'原始内容',entry:'prototype',directG:[],directD:[],range:{target:{product},regions:[{selector:'.test',label:'原始范围',x:0,y:0,width:.2,height:.2}]}})
   assert.equal(original.status,'AI 待做')
   let current=original, count=0
   await save([current])
   for(const from of annotationStatuses)for(const to of annotationStatuses){
    if(from===to)continue
    current=updateAnnotation(current,{status:from},ctx);await save([current])
    current=updateAnnotation(current,{status:to},ctx);await save([current])
    setup() // Reopen persistence, rather than trusting the PUT response.
    const loaded=(await(await fetch(url)).json()).items[0]
    assert.deepEqual(loaded,current)
    assert.equal(loaded.title,original.title);assert.equal(loaded.body,original.body)
    assert.deepEqual(loaded.range,original.range);assert.deepEqual(loaded.directG,original.directG)
    assert.equal(loaded.completedAt,to==='已完结'?loaded.updatedAt:undefined)
    count++
   }
   assert.equal(count,12)
   current=updateAnnotation(current,{status:'暂缓处理'},ctx);await save([current])
   const file=parseAnnotationFile(JSON.stringify({schema:1,product,version:'v1',items:[current]}),product)
   assert.equal(mergeAnnotationFile([],file,ctx)[0].status,'暂缓处理')
   await save([],[current]);assert.equal(snap.trash[0].status,'暂缓处理')
   await save([snap.trash[0]]);assert.equal(snap.items[0].status,'暂缓处理')
   const done=updateAnnotation(current,{status:'已完结'},ctx)
   const reopened=updateAnnotation(done,{status:'暂缓处理'},ctx)
   const redone=updateAnnotation(reopened,{status:'已完结'},ctx)
   assert.ok(Date.parse(redone.completedAt)>Date.parse(done.completedAt))
   assert.equal(updateAnnotation(redone,{body:'补充正文'},ctx).completedAt,redone.completedAt)
  }
 }finally{await new Promise(r=>server.close(r))}
})
