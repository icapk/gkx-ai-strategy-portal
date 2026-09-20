import test from 'node:test'
import assert from 'node:assert/strict'
import {applyBrowser16Areas,upgradeBrowser16Book,browser16Revision} from '../src/reviewBrowser16.ts'
import {applyAdjustmentsOneAreas} from '../src/reviewAdjustmentsOne.ts'
import {collaborationArea} from '../src/reviewCollaboration.ts'
import type {PrdBook} from '../src/researchReview/prdStore'
const groupTitle='浏览器16条批注：已确认规则'
function fixture(product:'research'|'reading'):PrdBook {
 const user={...collaborationArea(product).features[0],id:'USER',title:'用户命名',behavior:'用户无关正文',rules:[{title:'用户规则',items:['用户私有规则保留']}],manual:{target:{product},regions:[{selector:'#user',label:'用户框选',x:0,y:0,width:1,height:1}]}}
 const collaboration=collaborationArea(product)
 collaboration.features[0].rules!.push({title:groupTitle,items:['本轮组内用户自定义内容']})
 const areas=applyAdjustmentsOneAreas([{id:'user',title:'用户章节',purpose:'',layout:'用户两列布局',features:[user]},collaboration],product)
 return {schema:1,current:'live',imports:['previous'],revisions:['old','live'].map(id=>({id,name:id,at:'2026-09-20',plan:'保留用户规划',areas:structuredClone(areas),changes:[{id:'old-change',at:'2026-09-19',area:'user',reason:'用户既有修改',before:structuredClone(user),after:structuredClone(user)}]}))}
}
for(const product of ['research','reading'] as const){
 test(`${product}浏览器16升级仅改当前版，保留用户字段、关联、历史且marker幂等`,()=>{
  const book=fixture(product),original=structuredClone(book),next=upgradeBrowser16Book(book,product)
  assert.deepEqual(book,original);assert.deepEqual(next.revisions[0],book.revisions[0]);assert.deepEqual(next.revisions[1].areas[0],book.revisions[1].areas[0])
  assert.deepEqual(next.revisions[1].changes.slice(0,1),book.revisions[1].changes);assert.equal(next.revisions[1].changes.length,7)
  assert.deepEqual(next.imports,['previous',browser16Revision]);assert.equal(upgradeBrowser16Book(next,product),next)
  const originalFeatures=book.revisions[1].areas[1].features,features=next.revisions[1].areas[1].features
  features.forEach((f,i)=>{assert.equal(f.title,originalFeatures[i].title);assert.equal(f.id,originalFeatures[i].id);assert.deepEqual(f.compliance,originalFeatures[i].compliance);assert.deepEqual(f.links.map(l=>l.id),originalFeatures[i].links.map(l=>l.id))})
  assert.ok(features[0].rules!.find(g=>g.title===groupTitle)!.items.includes('本轮组内用户自定义内容'))
 })
 test(`${product}默认重复应用无重复规则且冲突旧说法已替换，导入和状态约束保留`,()=>{
  const areas=fixture(product).revisions[1].areas,next=applyBrowser16Areas(areas,product)
  assert.deepEqual(applyBrowser16Areas(next,product),next)
  assert.deepEqual(applyBrowser16Areas(applyAdjustmentsOneAreas(next,product),product),next)
  const text=JSON.stringify(next[1]);assert.doesNotMatch(text,/不增加关联状态筛选|顶部两列排列|关联项打开关联编辑|仅在当前产品及相符页面、文件上下文显示绿色标记/)
  assert.match(text,/一行三列/);assert.match(text,/仅进入标注状态后/);assert.match(text,/状态选择始终展示/);assert.match(text,/已完结不可重开/);assert.match(text,/同ID每次只在原正文后追加/)
  assert.match(text,/合规审查结果/);assert.match(text,/不提供独立关联按钮/);assert.match(text,/需求概述不占区域编号/)
  next[1].features.forEach(f=>assert.ok((f.rules??[]).filter(g=>g.title===groupTitle).length<=1))
  const book=fixture(product);book.revisions[1].areas=next;book.revisions[1].changes=[]
  assert.equal(upgradeBrowser16Book(book,product).revisions[1].changes.length,0)
 })
}
test('三个工作台分页点同步，阅读及空间不扩展；保留自定义规则和字段',()=>{
 const base=collaborationArea('research').features[0]
 const ids=['REQ-W1-03','REQ-W1-04','REQ-W2-04','REQ-W3-02','REQ-SPACE-01']
 const old=[{id:'workbench',title:'工作台',purpose:'',layout:'列表底部显示分页。',features:ids.map(id=>({...base,id,title:'用户标题'+id,behavior:'完整排序后分页。',current:'用户备注',rules:[{title:'自定义',items:['不要覆盖用户规则']},{title:'旧范围',items:['此变更仅最近浏览，其他科研列表及智能阅读分页不变。']}]}))}]
 const areas=applyBrowser16Areas(old,'research')
 for(const f of areas[0].features.slice(0,4)){assert.match(JSON.stringify(f.rules),/快速访问、最近浏览、我的收藏/);assert.doesNotMatch(JSON.stringify(f),/此变更仅最近浏览/);assert.equal(f.current,'用户备注');assert.deepEqual(f.rules![0],old[0].features[0].rules![0])}
 assert.deepEqual(areas[0].features[4],old[0].features[4]);assert.deepEqual(applyBrowser16Areas(old,'reading'),old)
 assert.deepEqual(applyBrowser16Areas(areas,'research'),areas)
})
test('无当前版明确拒绝且不改输入，不生成marker或历史',()=>{
 const book=fixture('research');book.current='missing';const original=structuredClone(book)
 assert.throws(()=>upgradeBrowser16Book(book,'research'),/找不到当前/);assert.deepEqual(book,original)
})
