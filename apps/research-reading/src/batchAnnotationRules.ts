import type {PrdArea} from './researchReview/prd'
import type {PrdBook} from './researchReview/prdStore'
const updates:Record<string,string[]>={
 'REQ-W4-01':['搜索范围包括在线文档的名称和内容、在线文件夹名称、上传文件夹/文档名称、PDF的笔记标题和内容，不支持搜索上传文档的正文内容。','工作台、个人空间和团队空间的搜索入口统一位于新建/上传操作行右侧；窄屏允许换行。','不提供最近搜索及清除历史功能；清空当前搜索框保留。'],
 'REQ-W4-03':['笔记搜索结果的字段依次展示所属文档、创建时间、更新时间。','文件夹按名称检索，打开后进入对应空间的原目录；只展示当前账号可访问的目录。'],
 'REQ-W5-01':['姓名和所属机构为必填的只读身份字段；个人信息页不得修改，保存其他字段不覆盖身份。','邮箱为选填；未填写时成员列表显示为空，填写或清空后展示同步更新，不生成占位邮箱。'],
 'REQ-P3-01':['支持Word（doc/docx）、Excel（xls/xlsx）、PDF；每批最多20个文件，单文件最大50MB，保留类型和大小校验及失败反馈。','上传提示删除“原件保存在当前浏览器”；其余文件格式、批量数量、大小与重名提示保留。'],
 'REQ-P3-02':['文件夹上传保留层级；同名文件覆盖前确认，取消不写入本批；覆盖保留编号和笔记，逐项失败反馈并可重试。','选择文件与选择文件夹使用一致的尺寸、边框、字体、背景及悬停和禁用样式；所有上传入口保持一致。'],
 'REQ-P4-01':['文档工具栏按编辑、文字格式、段落、插入分组，按钮尺寸统一，明确选中与禁用状态，窄屏可换行。','斜体作用于选中文字或后续输入，再次点击取消；中文正文支持合成斜体，保存重开保留格式。'],
 'REQ-P4-05':['网页书签按超链接提供：选中文字添加链接，未选文字时输入显示文字和网址；支持编辑、打开与移除。','网址仅接受http/https；打开使用新标签页。移除链接保留文字；取消不改变正文，保存后重开仍可使用。','不自动抓取网页摘要或生成网页预览卡片。'],
 'REQ-P6-01':['表格编辑顶部不展示文件路径，保留标题、返回和保存状态。','表格编辑不提供导入数据、导出CSV入口；已有记录、历史附件和空间列表下载保留。'],
 'REQ-P6-02':['本轮移除表格编辑中的数据导入功能，包括工具栏、空状态和继续导入入口。既有表格记录和历史附件仍保留。'],
 'REQ-T1-01':['默认加入当前机构全员，可手动移除和本空间无关的机构人员。创建者为管理员，其他成员默认可查看；管理员可在空间管理中移除成员或调整角色。'],
 'REQ-T3-01':['仅管理员可添加成员；选择弹窗左侧只列未加入的机构成员，右侧列已选成员并可设置管理员/可查看/可编辑。取消不保存，确认后统一提交空间设置。','成员未设置邮箱时显示空白；填写后才显示实际邮箱，不生成占位值。成员去重不以可空邮箱作为身份。'],
 'REQ-B1-01':['移入回收站保留文档ID、正文、原文件、删除时间与原位置；正常列表和搜索隐藏已删除项。','删除资料统一保留30天，到期在应用打开或运行时自动清理，关闭期间的到期项下次打开补清理。'],
 'REQ-B3-01':['手动彻底删除仍需确认，取消不改变数据；30天到期项自动清理，无需逐条确认。','清理原文件、PDF标注、笔记与表格数据，失败保留可重试记录，并提示错误。'],
 'REQ-B1-02':['已删除资料仅保留30天，超过30天将自动清理过期文件。','新旧资料统一按有效删除时间计算；页面打开或运行时执行清理，关闭浏览器期间到期的资料在下次打开时补清理。无效或缺失删除时间不误删。','只清理当前账号有权限处理的资料；清理原文件、关联笔记和表格数据。失败保留可重试记录，不假报成功。']
}
export function applyBatchAnnotationAreas(areas:PrdArea[]):PrdArea[]{return areas.map(a=>({...a,features:a.features.map(f=>{
 const items=updates[f.id];if(!items)return f
 const rules=items.map((text,i)=>({title:i===0?'功能规则':'交互规则 '+i,items:[text]}))
 // Replace only current affected rules; revision history is kept separately.
 return {...f,...(f.id==='REQ-P6-02'?{title:'表格数据录入边界'}:{}),behavior:items.join('\n'),contract:'',current:'',acceptance:[],rules}
})}))}
export function upgradeBatchAnnotationBook<T extends PrdBook>(book:T):T{
 const marker='research-annotations-7-21-20260920';if(book.imports?.includes(marker))return book
 const next=structuredClone(book),v=next.revisions.find(r=>r.id===next.current);if(!v)throw Error('当前版本不存在')
 const before=new Map(v.areas.flatMap(a=>a.features).map(f=>[f.id,structuredClone(f)]));v.areas=applyBatchAnnotationAreas(v.areas)
 for(const a of v.areas)for(const f of a.features){const old=before.get(f.id);if(JSON.stringify(old)!==JSON.stringify(f))v.changes.push({id:crypto.randomUUID(),at:new Date().toISOString(),area:a.id,reason:'用户确认科研注释 #7–#21 的修改。',before:old,after:structuredClone(f)})}
 next.imports=[...(next.imports??[]),marker];return next
}
