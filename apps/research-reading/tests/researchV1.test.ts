import test from 'node:test'
import assert from 'node:assert/strict'
import {canRead,canChange,teamAccess,moveResearchDocument} from '../src/researchPolicy.ts'
import {validateTeamSpace,normalizeRole} from '../src/teamSpaces.ts'
import {planRestoreParents} from '../src/researchRestore.ts'
const actor={id:1,institutionId:'demo-institution',role:'普通成员' as const}
const member=(id:number,role:string)=>({id,name:'成员'+id,role,initials:'成',color:'#000',status:'在线' as const,joinedAt:''})
const team={name:'研究组',description:'',members:[member(1,'管理'),member(2,'管理'),member(3,'编辑'),member(4,'查看')]}
test('门户管理员跨本机构团队管理，普通成员按团队授权，非成员拒绝',()=>{
 for(const [id,read,write,manage]of [[1,true,true,true],[3,true,true,false],[4,true,false,false],[5,false,false,false]] as const){
   const user={...actor,id};assert.equal(canRead('研究组/目录',[team],user),read);assert.equal(canChange('研究组',[team],false,user),write);assert.equal(canChange('研究组',[team],true,user),manage)
 }
 assert.equal(teamAccess(team,{...actor,id:99,role:'管理员'}),'管理')
 assert.equal(teamAccess({...team,institutionId:'other'},{...actor,role:'管理员'}),null)
 assert.equal(normalizeRole('管理员'),'管理');assert.equal(actor.role,'普通成员')
})
test('同级管理者不可移除或降级，机构管理员可调整，编辑者不能管理',()=>{
 const downgraded={...team,members:team.members.map(m=>m.id===2?{...m,role:'查看'}:m)}
 assert.match(validateTeamSpace(downgraded,[],team,actor),/同级/)
 assert.match(validateTeamSpace({...team,members:team.members.filter(m=>m.id!==1)},[],team,actor),/同级/)
 assert.equal(validateTeamSpace(downgraded,[],team,{...actor,role:'管理员'}),'')
 assert.match(validateTeamSpace(team,[],team,{...actor,id:3}),/管理权限/)
 assert.equal(validateTeamSpace({...team,members:team.members.map(m=>m.id===3?{...m,role:'管理'}:m)},[],team,actor),'')
})
test('恢复缺失父路径，只新增缺少目录，大小写冲突拒绝',()=>{
 const existing:any=[{id:10,name:'项目',location:'研究组'}]
 const added=planRestoreParents('研究组/项目/文献',existing,'成员','2026-09-22 12:00')
 assert.equal(added.length,1);assert.equal(added[0].location,'研究组/项目');assert.equal(added[0].name,'文献')
 assert.equal(existing.length,1)
 assert.throws(()=>planRestoreParents('研究组/A',[{id:1,name:'a',location:'研究组'}] as any,'',''),/冲突/)
 assert.throws(()=>planRestoreParents('研究组/../目录',[],'',''),/无效/)
})
test('分享保留修改时间与关联，拒绝团队移回个人',()=>{
 const doc:any={id:1,title:'稿件',kind:'在线文档',location:'我的空间',updatedAt:'原时间'}
 const moved=moveResearchDocument(doc,'研究组',[doc],[team],'新时间')
 assert.equal(moved.updatedAt,'原时间');assert.equal(moved.id,1)
 assert.throws(()=>moveResearchDocument(moved,'我的空间',[moved],[team],''),/不能移回/)
})
