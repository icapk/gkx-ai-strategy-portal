import test from 'node:test'
import assert from 'node:assert/strict'
import {mkdtempSync,readFileSync,writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {createServer} from 'node:http'
import {annotationShared,emptyAnnotations,migrateAnnotations} from '../server/annotationShared.mjs'
import {createAnnotation} from '../src/annotations/store.ts'
const ctx={version:'v1',complianceIds:[],features:[]}
const item=()=>createAnnotation('research',ctx,[],{title:'测试',body:'正文',entry:'prototype',directG:[],directD:[]})
const raw=a=>JSON.stringify({schema:1,product:'research',version:'v1',items:a})
test('浏览器迁移保留来源，重复幂等，编号碰撞重编号，同ID冲突保留副本，已移除不复活',()=>{
 const a=item(),b={...item(),id:'second'};const first=migrateAnnotations(emptyAnnotations('research'),raw([a]))
 assert.equal(first.items[0].source,'我的注释');assert.strictEqual(migrateAnnotations(first,raw([a])),first)
 const same=migrateAnnotations(first,raw([a,b]));assert.equal(same.items.length,2);assert.equal(same.items[1].number,2)
 const changed=migrateAnnotations(same,raw([{...a,body:'另一版本'}]));assert.equal(changed.items.length,3);assert.equal(changed.items[0].body,'正文');assert.equal(changed.items[2].migrationOriginalId,a.id)
 const removed={...first,items:[],trash:[a]};assert.equal(migrateAnnotations(removed,raw([{...a,body:'旧浏览器修改'}])).items.length,0)
 assert.throws(()=>migrateAnnotations(first,'bad'))
})
test('文件服务：持久化、冲突保护、移除恢复、重启读取、产品隔离、损坏和跨源拒绝',async()=>{
 const directory=mkdtempSync(join(tmpdir(),'annotations-server-'));let handler
 annotationShared({directory}).configureServer({config:{server:{port:5199},root:directory},middlewares:{use:fn=>{handler=fn}}})
 const server=createServer((req,res)=>handler(req,res,()=>{res.statusCode=404;res.end()}));await new Promise(r=>server.listen(0,'127.0.0.1',r))
 const url=`http://127.0.0.1:${server.address().port}/api/annotations/research`
 const req=(method,body,headers={})=>fetch(url,{method,headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)})
 try{
  const a=item();let r=await req('POST',{legacy:raw([a])});assert.equal(r.status,200);let snap=await r.json();assert.equal(snap.revision,1)
  r=await req('PUT',{expectedRevision:0,version:'v1',items:[],trash:[]});assert.equal(r.status,409)
  r=await req('PUT',{expectedRevision:1,version:'v1',items:[],trash:[]});assert.equal(r.status,400)
  r=await req('PUT',{expectedRevision:1,version:'v1',items:[],trash:[a]});assert.equal(r.status,200);snap=await r.json();assert.equal(snap.items.length,0)
  r=await req('POST',{legacy:raw([a])});assert.equal((await r.json()).items.length,0)
  r=await req('PUT',{expectedRevision:2,version:'v1',items:[a],trash:[]});assert.equal(r.status,200)
  assert.equal(JSON.parse(readFileSync(join(directory,'research.json'),'utf8')).items[0].id,a.id)
  const reading=await(await fetch(url.replace('research','reading'))).json();assert.equal(reading.items.length,0)
  r=await req('PUT',{}, {Origin:'http://other.invalid'});assert.equal(r.status,403)
  const before=readFileSync(join(directory,'research.json'),'utf8');r=await req('POST',{legacy:'bad'});assert.equal(r.status,400);assert.equal(readFileSync(join(directory,'research.json'),'utf8'),before)
  writeFileSync(join(directory,'research.json'),'damaged');r=await req('PUT',{expectedRevision:3,version:'v1',items:[a],trash:[]});assert.equal(r.status,503);assert.equal(readFileSync(join(directory,'research.json'),'utf8'),'damaged')
 }finally{await new Promise(r=>server.close(r))}
})
