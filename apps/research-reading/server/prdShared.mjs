import { mkdirSync, existsSync, readFileSync, writeFileSync, renameSync } from 'node:fs'
import { resolve, join } from 'node:path'
import {validReadingBook} from './readingPrdValidation.mjs'
export function readingPrdShared(){return prdShared({endpoint:'/api/reading-prd',directory:process.env.READING_PRD_SHARED_DIRECTORY||'.local/reading-prd-shared',validate:validReadingBook})}

function validBook(value) {
 if(!value||typeof value!=='object')return false
 const b=value
 if(b.schema!==1||typeof b.current!=='string'||!Array.isArray(b.revisions)||!b.revisions.length)return false
 const ids=new Set()
 for(const v of b.revisions){
  if(!v||typeof v.id!=='string'||ids.has(v.id)||typeof v.name!=='string'||!Array.isArray(v.areas)||!Array.isArray(v.changes))return false
  ids.add(v.id)
  const features=new Set()
  for(const a of v.areas){
   if(!a||typeof a.id!=='string'||!Array.isArray(a.features))return false
   for(const f of a.features){
    if(!f||typeof f.id!=='string'||features.has(f.id)||typeof f.title!=='string'||!Array.isArray(f.links)||!Array.isArray(f.acceptance))return false
    if(f.rules!==undefined&&(!Array.isArray(f.rules)||f.rules.some((r)=>!r||typeof r.title!=='string'||!Array.isArray(r.items)||r.items.some((i)=>typeof i!=='string'))))return false
    features.add(f.id)
   }
  }
 }
 return ids.has(b.current)
}
export function prdShared(options={}) {
 const endpoint=options.endpoint||'/api/research-prd'
 const validate=options.validate||validBook
 const directory=resolve(options.directory||process.env.PRD_SHARED_DIRECTORY||'.local/prd-shared')
 const file=join(directory,'book.json')
 const middleware=async(req,res,next)=>{
  if(req.url?.split('?')[0]!==endpoint){next();return}
  const send=(status,body)=>{res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body))}
  const read=()=>{
   if(!existsSync(file))return {revision:0,book:null}
   const stored=JSON.parse(readFileSync(file,'utf8'))
   if(!Number.isInteger(stored.revision)||!validate(stored.book))throw Error('Invalid stored book')
   return stored
  }
  try{
   if(req.method==='GET'){send(200,read());return}
   if(req.method!=='PUT'){send(405,{error:'不支持的操作'});return}
   const host=req.headers.host??''
   if(!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host)||(req.headers.origin&&req.headers.origin!==`http://${host}`)||!req.headers['content-type']?.startsWith('application/json')){send(403,{error:'仅允许本机同源保存'});return}
   const chunks=[];let size=0
   for await(const chunk of req){const bytes=Buffer.from(chunk);chunks.push(bytes);size+=bytes.length;if(size>16*1024*1024){send(413,{error:'版本记录过大，请先备份并整理'});return}}
   const raw=Buffer.concat(chunks).toString('utf8')
   let data
   try{data=JSON.parse(raw)}catch{send(400,{error:'无效内容'});return}
   if(!validate(data.book)||!Number.isInteger(data.expectedRevision)){send(400,{error:'PRD格式无效'});return}
   const previous=read()
   if(previous.revision!==data.expectedRevision){send(409,previous);return}
   mkdirSync(join(directory,'history'),{recursive:true})
   if(previous.book)writeFileSync(join(directory,'history',`${previous.revision}.json`),JSON.stringify(previous),'utf8')
   const saved={revision:previous.revision+1,book:data.book}
   writeFileSync(file+'.tmp',JSON.stringify(saved),'utf8')
   renameSync(file+'.tmp',file)
   send(200,saved)
  }catch{send(503,{error:'共享记录读写失败，未替换原记录'})}
 }
 return {name:endpoint,configureServer(server){server.middlewares.use(middleware)},configurePreviewServer(server){server.middlewares.use(middleware)}}
}
