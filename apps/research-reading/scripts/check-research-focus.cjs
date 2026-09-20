const {chromium} = require('C:/Users/Lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const assert = require('node:assert/strict')
;(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true})
 try{
  const context=await browser.newContext({viewport:{width:1600,height:1000}})
  const page=await context.newPage(), errors=[]
  page.on('pageerror',error=>errors.push(error.message))
  const goto=()=>page.goto('http://127.0.0.1:5174/?view=research')
  const click=async id=>{await page.getByLabel('搜索功能编号或标题').fill(id);await page.locator('.research-review .review-point-open').filter({hasText: new RegExp('^'+id.replace('.','\\.')+' ')}).click()}
  const settle=async()=>{await page.waitForFunction(()=>['focused','context','failed'].includes(document.querySelector('.prototype-focus-layer')?.dataset.phase),{timeout:15000});return page.locator('.prototype-focus-layer').getAttribute('data-phase')}
  const successes=['R1.1','R2.3','R2.9','R3.4','R4.5','R4.9','R4.10','R6.1','R6.3','R7.2','R7.4','R8.1','R9.8','R9.9','R10.3','R11.1']
  for(const id of successes){
   await goto();await click(id);const phase=await settle();console.log(id,phase,await page.locator('.prototype-focus-feedback').innerText());
   assert.notEqual(phase,'failed',id)
   assert.ok(await page.locator('.prototype-focus-frame').count()>0)
   const edge=(await page.locator('.research-review').boundingBox()).x+(await page.locator('.research-review').boundingBox()).width
   for(const frame of await page.locator('.prototype-focus-frame').all()){const b=await frame.boundingBox();assert.ok(b.x>=edge-1);assert.ok(b.x+b.width<=1601)}
   if(['R2.3','R7.2','R9.9','R11.1'].includes(id))await page.screenshot({path:'.local/focus-'+id+'.png'})
  }
  await goto();await click('R2.3');await settle();assert.equal(await page.locator('.prototype-focus-frame').count(),2)
  const seq=await page.locator('.prototype-focus-layer').getAttribute('data-sequence');await click('R2.3');await settle();assert.notEqual(await page.locator('.prototype-focus-layer').getAttribute('data-sequence'),seq)
  await page.getByLabel('R2.3 合规状态',{exact:true}).selectOption('待定');assert.equal(await page.locator('.prototype-focus-layer').getAttribute('data-sequence'),String(Number(seq)+1))
  await page.getByLabel('R2.3 审核详情',{exact:true}).click();await page.getByLabel('追加备注').fill('keep draft')
  await page.locator('.review-detail h2 button').click();await page.getByRole('button',{name:'继续编辑',exact:true}).click();assert.equal(await page.getByLabel('追加备注').inputValue(),'keep draft')
  await goto();await click('R7.1');await settle();await page.getByRole('textbox',{name:'文档正文',exact:true}).fill('unsaved business draft')
  await click('R2.2');assert.equal(await settle(),'failed');assert.match(await page.locator('.continuous-paper').innerText(),/unsaved business draft/)
  page.on('dialog',dialog=>dialog.accept());await goto();await click('R8.3');console.log('PDF prerequisite',await settle(),await page.locator('.prototype-focus-feedback').innerText())
  const mobile=await context.newPage();await mobile.setViewportSize({width:390,height:844});await mobile.goto('http://127.0.0.1:5174/?view=research');await mobile.getByRole('button',{name:'展开合规评审',exact:true}).click();await mobile.getByLabel('搜索功能编号或标题').fill('R2.3');await mobile.locator('.review-point-open').click();await mobile.waitForFunction(()=>['focused','failed'].includes(document.querySelector('.prototype-focus-layer')?.dataset.phase));assert.match(await mobile.locator('.research-review').getAttribute('class'),/is-collapsed/);await mobile.screenshot({path:'.local/focus-mobile.png'})
  assert.deepEqual(errors,[]);console.log('PASS core focus checks; inspect any per-point failed results above')
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1})
