import {mkdirSync,existsSync,readFileSync,writeFileSync,renameSync} from 'node:fs'
import {resolve,join} from 'node:path'
import {createHash,randomUUID} from 'node:crypto'
import {parseAnnotationFile,validAnnotation} from '../src/annotations/importExport.ts'
export const emptyAnnotations=product=>({schema:1,product,version:'',revision:0,items:[],trash:[],migrations:[]})
export function validShared(data,product){
 if(!data||data.schema!==1||data.product!==product||typeof data.version!=='string'||!Number.isSafeInteger(data.revision)||data.revision<0||!Array.isArray(data.items)||!Array.isArray(data.trash)||!Array.isArray(data.migrations)||!data.migrations.every(s=>typeof s==='string'))return false
 const all=[...data.items,...data.trash];return all.every(a=>validAnnotation(a,product))&&new Set(all.map(a=>a.id)).size===all.length&&new Set(all.map(a=>a.number)).size===all.length
}
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().filter(k=>k!=='number').map(k=>[k,canonical(value[k])])):value
export function migrateAnnotations(previous,raw){
 const incoming=parseAnnotationFile(raw,previous.product),hash=createHash('sha256').update(raw).digest('hex')
 if(previous.migrations.includes(hash))return previous
 const next=structuredClone(previous);let number=Math.max(0,...next.items.concat(next.trash).map(a=>a.number))+1
 for(const a of incoming.items){
  if(next.trash.some(t=>t.id===a.id))continue
  const found=next.items.find(t=>t.id===a.id)
  if(found&&JSON.stringify(canonical(found))===JSON.stringify(canonical(a)))continue
  const item=structuredClone(a)
  if(found){item.migrationOriginalId=item.id;item.id=randomUUID();item.title+='（迁移冲突副本）'}
  if(next.items.concat(next.trash).some(t=>t.number===item.number))item.number=number++
  else number=Math.max(number,item.number+1)
  next.items.push(item)
 }
 next.version=next.version||incoming.version;next.migrations.push(hash);return next
}
export function annotationShared(options={}){
 let directory
 const setup=server=>{const port=server.config.server.port;directory=resolve(options.directory||process.env.ANNOTATIONS_SHARED_DIRECTORY||join(server.config.root,'.local',port===5174?'annotations-shared':`annotations-shared-${port}`));mkdirSync(directory,{recursive:true});for(const product of ['research','reading']){const file=join(directory,product+'.json');if(!existsSync(file))writeFileSync(file,JSON.stringify(emptyAnnotations(product),null,2),{encoding:'utf8',flag:'wx'})}server.middlewares.use(middleware)}
 const middleware=async(req,res,next)=>{
  const match=/^\/api\/annotations\/(research|reading)$/.exec(req.url?.split('?')[0]||'');if(!match)return next()
  const product=match[1],file=join(directory,`${product}.json`)
  const send=(status,body)=>{res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body))}
  const read=()=>{if(!existsSync(file))return emptyAnnotations(product);const data=JSON.parse(readFileSync(file,'utf8'));if(!validShared(data,product))throw Error('Invalid saved annotations');return data}
  try{
   const host=req.headers.host??''
   if(!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host)||(req.headers.origin&&req.headers.origin!==`http://${host}`)){send(403,{error:'仅允许本机同源读写注释'});return}
   if(req.method==='GET'){send(200,read());return}
   if(!['PUT','POST'].includes(req.method)||!req.headers['content-type']?.startsWith('application/json')){send(405,{error:'不支持的操作'});return}
   const chunks=[];let size=0;for await(const chunk of req){const b=Buffer.from(chunk);size+=b.length;if(size>16*1024*1024){send(413,{error:'注释文件过大，未保存'});return}chunks.push(b)}
   let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{send(400,{error:'无效JSON'});return}
   const previous=read();let candidate
   if(req.method==='POST'){
    if(typeof body.legacy!=='string'){send(400,{error:'迁移格式无效'});return}
    try{candidate=migrateAnnotations(previous,body.legacy)}catch{send(400,{error:'旧注释数据损坏，原记录已保留，请先处理后重试'});return}
    if(candidate===previous){send(200,previous);return}
    mkdirSync(join(directory,'migration-backups'),{recursive:true});writeFileSync(join(directory,'migration-backups',`${product}-${createHash('sha256').update(body.legacy).digest('hex')}.json`),body.legacy,'utf8')
   }else{
    if(body.expectedRevision!==previous.revision){send(409,{error:'另一浏览器已更新注释，请核对最新记录后重试',snapshot:previous});return}
    candidate={...previous,version:body.version,items:body.items,trash:body.trash}
    if(!validShared(candidate,product)){send(400,{error:'注释数据无效，原记录未改变'});return}
    // Removal must remain recoverable; PUT cannot silently drop an existing stable ID.
    const ids=new Set([...candidate.items,...candidate.trash].map(a=>a.id))
    if([...previous.items,...previous.trash].some(a=>!ids.has(a.id))){send(400,{error:'请移入已移除列表，不允许直接丢弃记录'});return}
   }
   const saved={...candidate,revision:previous.revision+1}
   if(!validShared(saved,product)){send(400,{error:'迁移结果无效'});return}
   mkdirSync(join(directory,'history'),{recursive:true});if(previous.revision)writeFileSync(join(directory,'history',`${product}-${previous.revision}.json`),JSON.stringify(previous,null,2),'utf8')
   const temp=file+'.tmp';writeFileSync(temp,JSON.stringify(saved,null,2),'utf8');renameSync(temp,file);send(200,saved)
  }catch{send(503,{error:'注释文件读写失败，未覆盖原数据。请保留当前输入后重试。'})}
 }
 return {name:'local-shared-annotations',configureServer:setup,configurePreviewServer:setup}
}
