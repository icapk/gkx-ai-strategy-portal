const {chromium}=require('C:/Users/Lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const {spawn}=require('node:child_process')
const path=require('node:path')
const assert=require('node:assert/strict')
const {mkdirSync}=require('node:fs')
const root=path.resolve(__dirname,'..'),port=5185,url='http://127.0.0.1:'+port
const store=path.join(root,'.local','sync-test-'+Date.now())
let server,browser
const delay=ms=>new Promise(r=>setTimeout(r,ms))
const get=async()=>{const r=await fetch(url+'/api/research-prd');assert.equal(r.status,200);return r.json()}
async function start(){
 server=spawn(process.execPath,[path.join(root,'node_modules/vite/bin/vite.js'),'--port',String(port),'--strictPort'],{cwd:root,env:{...process.env,PRD_SHARED_DIRECTORY:store},windowsHide:true,stdio:'pipe'})
 let log='';server.stdout.on('data',d=>log+=d);server.stderr.on('data',d=>log+=d)
 for(let i=0;i<100;i++){if(server.exitCode!==null)throw Error(log);try{await get();return}catch{}await delay(200)}
 throw Error('Server startup timeout '+log)
}
async function stop(){if(server&&server.exitCode===null){const done=new Promise(r=>server.once('exit',r));server.kill();await done}}
async function open(page){
 await page.goto(url+'/?view=research&review=prd')
 await page.getByText('已同步',{exact:true}).waitFor()
 await page.getByLabel('PRD功能区域').selectOption('workbench')
 await page.locator('.prd-feature-heading').first().click()
}
async function edit(page,text){
 await page.getByRole('button',{name:'编辑需求与关联',exact:true}).click()
 await page.getByLabel('规则1条目',{exact:true}).fill(text)
 await page.getByLabel('本次修改说明').fill('独立浏览器同步验证')
}
;(async()=>{
 try{
  await start()
  browser=await chromium.launch({channel:'msedge',headless:true})
  const a=await browser.newPage({viewport:{width:1601,height:831}}),b=await browser.newPage({viewport:{width:1601,height:831}}),errors=[]
  a.on('pageerror',e=>errors.push(e.message));b.on('pageerror',e=>errors.push(e.message))
  await open(a);await open(b)
  const baseline=await get(),v=baseline.book.revisions.find(v=>v.id===baseline.book.current)
  assert.equal(v.areas.flatMap(a=>a.features).length,57)
  assert.ok(v.areas.flatMap(a=>a.features).every(f=>f.rules.length&&f.priority))
  assert.ok(!JSON.stringify(baseline.book).includes('\ufffd'),'Chinese text must survive chunked UTF-8 transport')
  for(const heading of ['数据与交付规则','现状与待确认','验收场景'])assert.equal(await a.locator('.prd-feature-body').getByRole('heading',{name:heading,exact:true}).count(),0)
  await a.locator('.prd-rule-group').filter({has:a.getByRole('heading',{name:'位置',exact:true})}).getByText(/团队空间 \/ 团队名称/).waitFor()
  await edit(a,'测试甲：字段规则第一条\n测试甲：字段规则第二条')
  await a.getByRole('button',{name:'保存小修改',exact:true}).click()
  await a.getByRole('dialog',{name:'编辑PRD功能点'}).waitFor({state:'hidden'})
  await b.getByText('测试甲：字段规则第一条',{exact:true}).waitFor()
  await edit(b,'测试乙：保留冲突输入')
  await edit(a,'测试甲：第二次保存')
  await a.getByRole('button',{name:'保存小修改',exact:true}).click()
  await a.getByRole('dialog',{name:'编辑PRD功能点'}).waitFor({state:'hidden'})
  await delay(2200)
  await b.getByRole('button',{name:'保存小修改',exact:true}).click()
  await b.getByRole('alert').filter({hasText:'此功能已被另一窗口修改'}).waitFor()
  assert.equal(await b.getByLabel('规则1条目',{exact:true}).inputValue(),'测试乙：保留冲突输入')
  b.once('dialog',d=>d.accept());await b.getByRole('button',{name:'取消',exact:true}).click()
  // Legacy external-browser edits are migrated, never replaced by the baseline.
  const local={schema:1,current:'v2',revisions:structuredClone(baseline.book.revisions.filter(v=>v.id==='v1'||v.id==='v2'))}
  const old=local.revisions.find(v=>v.id==='v2')
  const f=old.areas[0].features.find(f=>f.id==='REQ-W1-02')
  const before=structuredClone(f);f.behavior='用户已有修改：时间精确到分钟。'
  old.changes.push({id:'legacy-edit',at:new Date().toISOString(),area:'workbench',before,after:structuredClone(f),reason:'原浏览器编辑'})
  const c=await browser.newPage({viewport:{width:1601,height:831}})
  await c.addInitScript(book=>localStorage.setItem('research-prd-book-v2',JSON.stringify(book)),local)
  await open(c)
  await c.getByText('此浏览器既有修改已迁移，原记录与历史备份均已保留。',{exact:true}).waitFor()
  const migrated=await get(),current=migrated.book.revisions.find(v=>v.id===migrated.book.current)
  assert.ok(current.areas[0].features.find(f=>f.id==='REQ-W1-02').rules.some(g=>g.items.includes('用户已有修改：时间精确到分钟。')))
  assert.equal(current.areas[0].features.find(f=>f.id==='REQ-W1-01').rules[0].items[0],'测试甲：第二次保存')
  assert.ok(migrated.book.revisions.some(v=>v.name.startsWith('浏览器备份')))
  await c.reload();await c.getByText('已同步',{exact:true}).waitFor();await delay(500)
  assert.equal((await get()).revision,migrated.revision)
  const rejected=await fetch(url+'/api/research-prd',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({expectedRevision:0,book:migrated.book})})
  assert.equal(rejected.status,409)
  const forbidden=await fetch(url+'/api/research-prd',{method:'PUT',headers:{'Content-Type':'application/json',Origin:'https://untrusted.invalid'},body:JSON.stringify({expectedRevision:migrated.revision,book:migrated.book})})
  assert.equal(forbidden.status,403)
  // Render a real field list, then check export uses the same point-by-point content.
  await a.getByLabel('PRD功能区域').selectOption('personal')
  await a.locator('.prd-feature-heading').first().click()
  mkdirSync(path.join(root,'.local','screenshots'),{recursive:true})
  await a.screenshot({path:path.join(root,'.local/screenshots/prd-rules-desktop.png')})
  const downloadPromise=a.waitForEvent('download');await a.getByRole('button',{name:'导出 PRD',exact:true}).click()
  const download=await downloadPromise
  const {readFileSync}=require('node:fs'),markdown=readFileSync(await download.path(),'utf8')
  assert.ok(markdown.includes('#### 位置'))
  for(const banned of ['**数据与交付规则**','**现状与待确认**','**验收场景**'])assert.ok(!markdown.includes(banned))
  await a.setViewportSize({width:390,height:844})
  await a.screenshot({path:path.join(root,'.local/screenshots/prd-rules-mobile.png')})
  const bounds=await a.locator('.research-review').boundingBox()
  assert.ok(bounds.width<=390)
  assert.deepEqual(errors,[])
  await browser.close();browser=null
  await stop();await start()
  assert.equal((await get()).revision,migrated.revision)
  console.log('PASS: 57 structured features, two independent browsers, conflict protection, legacy migration, deduplication, CAS, origin checks, export, responsive screenshots and restart persistence.')
 }finally{if(browser)await browser.close();await stop()}
})().catch(e=>{console.error(e);process.exitCode=1})
