const {chromium}=require('C:/Users/Lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const assert=require('node:assert/strict')
;(async()=>{
 const {points}=await import('../src/researchReview/model.ts')
 const browser=await chromium.launch({channel:'msedge',headless:true})
 try{
  const context=await browser.newContext({viewport:{width:1600,height:1000}})
  const page=await context.newPage(), failures=[]
  const expectedMissing=new Set(['R1.2','R8.3','R8.4','R8.5','R8.7','R8.8'])
  for(const p of points){
   await page.goto('http://127.0.0.1:5174/?view=research')
   await page.getByLabel('搜索功能编号或标题').fill(p.id)
   await page.locator('.research-review .review-point-open').filter({hasText:new RegExp('^'+p.id.replace('.','\\.')+' ')}).click()
   await page.waitForFunction(()=>['focused','context','failed'].includes(document.querySelector('.prototype-focus-layer')?.dataset.phase),{timeout:15000})
   const phase=await page.locator('.prototype-focus-layer').getAttribute('data-phase')
   if(phase==='failed'&&!expectedMissing.has(p.id))failures.push({id:p.id,message:await page.locator('.prototype-focus-feedback').innerText()})
   if(phase==='failed')assert.equal(await page.locator('.prototype-focus-frame').count(),0)
   console.log(p.id,phase)
  }
  console.log('unexpected failures',JSON.stringify(failures));assert.deepEqual(failures,[])
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1})
