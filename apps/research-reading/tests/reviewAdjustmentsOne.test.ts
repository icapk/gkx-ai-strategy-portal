import {applySidebarCorrectionAreas} from '../src/reviewSidebarCorrection.ts'
import test from 'node:test'
import assert from 'node:assert/strict'
import {applyAdjustmentsOneAreas,upgradeAdjustmentsOneBook,adjustmentsOneRevision} from '../src/reviewAdjustmentsOne.ts'
import {collaborationArea} from '../src/reviewCollaboration.ts'
import {applyBrowser16Areas} from '../src/reviewBrowser16.ts'
import type {PrdArea} from '../src/researchReview/prd'
import type {PrdBook} from '../src/researchReview/prdStore'

function fixture(product:'research'|'reading'):PrdBook {
 const feature={...collaborationArea(product).features[0],id:'USER-PRIVATE',title:'用户名称',behavior:'第一轮分享规则保持',manual:{target:{product},regions:[{selector:'#user',label:'用户区域',x:0,y:0,width:1,height:1}]}}
 const areas:PrdArea[]=[{id:'user',title:'用户业务',purpose:'不覆盖',layout:'自定义布局',features:[feature]},collaborationArea(product)]
 const revisions=['old','live'].map(id=>({id,name:id,plan:'用户规划',at:'2026-09-19',areas:structuredClone(areas),changes:[{id:'existing-change',at:'2026-09-19',area:'user',reason:'用户既有编辑',before:structuredClone(feature),after:structuredClone(feature)}]}))
 return {schema:1,current:'live',imports:['existing-import'],revisions}
}
for(const product of ['research','reading'] as const){
 test(`${product}调整首次升级仅当前版本，旧版、既有历史及用户业务保持`,()=>{
  const before=fixture(product),original=structuredClone(before),next=upgradeAdjustmentsOneBook(before,product)
  assert.deepEqual(before,original);assert.equal(next.current,before.current);assert.deepEqual(next.revisions[0],before.revisions[0])
  assert.deepEqual(next.revisions[1].areas[0],before.revisions[1].areas[0]);assert.deepEqual(next.revisions[1].changes.slice(0,1),before.revisions[1].changes)
  assert.deepEqual(next.imports,['existing-import',adjustmentsOneRevision]);assert.equal(next.revisions[1].changes.length,7)
  assert.equal(upgradeAdjustmentsOneBook(next,product),next)
 })
 test(`${product}默认转换幂等，无红点或旧候选规则残留，稳定ID与绑定不变`,()=>{
  const original=[collaborationArea(product)],next=applyAdjustmentsOneAreas(original,product)
  assert.deepEqual(applyAdjustmentsOneAreas(next,product),next)
  assert.deepEqual(next[0].features.map(f=>({id:f.id,compliance:f.compliance,links:f.links.map(l=>l.id)})),original[0].features.map(f=>({id:f.id,compliance:f.compliance,links:f.links.map(l=>l.id)})))
  assert.doesNotMatch(JSON.stringify(next),/红点|原型框选结束后推荐可更正的候选|唯一高可信结果可预选/)
  for(const f of next[0].features)assert.ok((f.rules??[]).filter(g=>g.title==='调整建议1：已确认规则').length<=1)
  const book=fixture(product);book.revisions[1].areas=next;book.revisions[1].changes=[]
  assert.equal(upgradeAdjustmentsOneBook(book,product).revisions[1].changes.length,0)
 })
}
test('仅科研最近浏览切20+20，阅读与其他分页、用户名称和稳定ID不改',()=>{
 const base=collaborationArea('research').features[0]
 const recent={...base,id:'REQ-W1-04',title:'用户自定义最近浏览名称',behavior:'旧页码规则',current:'待确认',rules:[{title:'分页',items:['每页20条，页码切换']}],links:[{id:'W1-04',label:'最近浏览'}]}
 const other={...recent,id:'OTHER-PAGING',title:'其他列表'}
 const areas=[{id:'workbench',title:'工作台',purpose:'',layout:'',features:[recent,other]}]
 const next=applyAdjustmentsOneAreas(areas,'research')
 assert.match(next[0].features[0].behavior,/追加20条/);assert.equal(next[0].features[0].title,recent.title);assert.deepEqual(next[0].features[0].links,recent.links)
 assert.deepEqual(next[0].features[1],other);assert.deepEqual(applyAdjustmentsOneAreas(areas,'reading'),areas)
 assert.deepEqual(applyAdjustmentsOneAreas(next,'research'),next)
})
test('阅读真实默认seed按完整迁移链重复转换不加规则、不降级新需求',async()=>{
 const {readingAreas}=await import('../src/readingReview/catalog.ts')
 const reapplied=applySidebarCorrectionAreas(applyBrowser16Areas(applyAdjustmentsOneAreas(readingAreas,'reading'),'reading'))
 assert.deepEqual(reapplied,readingAreas)
 const collaboration=readingAreas.find(a=>a.id==='annotation-collaboration')
 assert.ok(collaboration);assert.doesNotMatch(JSON.stringify(collaboration),/红点|原型框选结束后推荐可更正的候选|唯一高可信结果可预选/)
 assert.doesNotMatch(JSON.stringify(collaboration),/不增加关联状态筛选|顶部两列排列|关联项打开关联编辑/)
})
