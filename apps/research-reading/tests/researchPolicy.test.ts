import test from 'node:test'
import assert from 'node:assert/strict'
import { canChange,moveResearchDocument,recycleExpired } from '../src/researchPolicy.ts'
const teams:any=[{name:'团队',members:[{id:1,role:'可编辑'}]}];const doc:any={id:7,title:'文档',kind:'在线文档',location:'我的空间',content:'visitor',spaceScope:'personal'}
test('分享移动保留编号和内容且拒绝重名与无权限',()=>{const moved=moveResearchDocument(doc,'团队',[doc],teams,'now');assert.equal(moved.id,7);assert.equal(moved.content,'visitor');assert.equal(moved.spaceScope,'team');assert.throws(()=>moveResearchDocument(moved,'我的空间',[moved],teams,'now'),/不能移回/);assert.throws(()=>moveResearchDocument(doc,'团队',[{...doc,id:8,location:'团队'}],teams,'now'));assert.throws(()=>moveResearchDocument(doc,'未知团队',[doc],teams,'now'));assert.equal(canChange('团队',teams,true),false)})
test('回收站三十天边界及异常旧时间',()=>{assert.equal(recycleExpired('2026-08-19 10:00',new Date(2026,8,18,10)),true);assert.equal(recycleExpired('2026-08-19 10:01',new Date(2026,8,18,10)),false);assert.equal(recycleExpired('unknown'),false)})

import { automaticRecycleDue, historicalRecycleDue, retentionLabel } from '../src/researchPolicy.ts'
test('历史资料不自动清理，新删除30天规则，异常日期不误删',()=>{
  const now=new Date('2026-09-19T10:00:00Z'),old={deletedAt:'2026-08-01T10:00:00Z'}
  assert.equal(automaticRecycleDue(old,now),false)
  assert.equal(historicalRecycleDue(old,now),false)
  assert.ok(retentionLabel(old,now).includes('历史资料'))
  assert.equal(automaticRecycleDue({...old,retentionPolicy:'30-days-v1'},now),true)
  assert.equal(automaticRecycleDue({deletedAt:'未知',retentionPolicy:'30-days-v1'},now),false)
  assert.equal(automaticRecycleDue({deletedAt:'2026-08-20T10:00:01Z',retentionPolicy:'30-days-v1'},now),false)
  assert.equal(automaticRecycleDue({deletedAt:'2026-08-20T10:00:00Z',retentionPolicy:'30-days-v1'},now),true)
})
