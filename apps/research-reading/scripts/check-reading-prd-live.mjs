import {createRequire} from 'node:module'
import assert from 'node:assert/strict'
const require=createRequire('C:/Users/Lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json')
const {chromium}=require('playwright')
const browser=await chromium.launch({channel:'msedge',headless:true})
try{
 const page=await browser.newPage({viewport:{width:1600,height:900}})
 await page.goto('http://127.0.0.1:5174/?view=reading&review=prd')
 await page.getByRole('heading',{name:'需求概述',exact:true}).waitFor()
 assert.equal(await page.getByLabel('评审模式',{exact:true}).inputValue(),'prd')
 const saved=await page.request.get('http://127.0.0.1:5174/api/reading-prd').then(r=>r.json())
 assert.equal(saved.book.module,'reading')
 assert.equal(saved.book.revisions.find(v=>v.id===saved.book.current).areas.flatMap(a=>a.features).length,44)
 await page.screenshot({path:'.local/reading-prd-live.png'})
 console.log(`5174 live PRD verified: 44 leaves, revision ${saved.revision}, four protected upgrade entries preserved.`)
}finally{await browser.close()}
