import type {ReviewPoint} from './researchReview/model.ts'
import type {PrdArea} from './researchReview/prd.ts'
import type {PrototypeFocusLocation,PrototypeTarget} from './prototypeFocus/types.ts'
export const runtime:{namespace:string;storageMode:'browser'|'service';apiBase:string}={namespace:'review-sidebar-demo-v1',storageMode:'browser',apiBase:''}
// Internal research/reading keys identify isolated slots, not required business domains.
export const productLabels={research:'智能科研',reading:'智能阅读'}
export type Product=keyof typeof productLabels
function sample(product:Product){
 const definitions=[['query','内容查询','内容列表','输入关键词查询示例记录。清空后恢复全部记录。'],['create','创建记录','内容列表','输入非空名称后新增记录。取消时不创建任何内容。'],['settings','偏好设置','基础配置','修改显示偏好并保存。未保存的修改不得因为定位而丢失。']]
 const points:ReviewPoint[]=definitions.map(([id,title,parentTitle,requirement],index)=>({id:product+'-'+id,parent:index<2?'content':'settings',parentTitle,group:index<2?0:1,story:0,title,requirement,acceptance:'',baseline:{status:'待定',reason:'示例数据，接入真实业务后逐项核验。',evidence:'不预设真实产品已合规'},priority:'P1'}))
 const areas:PrdArea[]=[{id:'content',title:'内容管理',purpose:'找到并管理工作内容。',layout:'上方查询，下方记录列表。',features:points.slice(0,2).map(p=>({id:'D-'+p.id,title:p.title,parentTitle:'基础操作',priority:'P1',release:'v1.0',purpose:p.requirement,behavior:p.requirement,contract:'',current:'',acceptance:[],compliance:[p.id],rules:[{title:'交互规则',items:[p.requirement,'失败时保留输入，成功后更新列表并明确反馈。']}],links:[{id:p.id,label:p.title}]}))},{id:'settings',title:'偏好设置',purpose:'维护当前使用偏好。',layout:'独立表单，保存与取消。',features:points.slice(2).map(p=>({id:'D-'+p.id,title:p.title,priority:'P2',release:'v1.0',purpose:p.requirement,behavior:p.requirement,contract:'',current:'',acceptance:[],compliance:[p.id],rules:[{title:'交互规则',items:[p.requirement]}],links:[{id:p.id,label:p.title}]}))}]
 const targets:Record<string,PrototypeTarget>={},locations:Record<string,PrototypeFocusLocation>={}
 for(const p of points){targets[p.id]={product,...(product==='research'?{section:'workbench' as const,tab:'recent' as const}:{readingView:'library' as const})};locations[p.id]={navigationTarget:p.id,selectors:[`[data-focus-id="${p.id}"]`],description:p.title}}
 const overview={positioning:'可复制的三模式评审侧边栏示例。右侧仅提供接入用的最小业务页面。',users:'产品、设计、研发与评审参与者。',scenario:'浏览功能规则 → 定位原型 → 编辑或记录注释 → 审核修改。',value:'让需求、页面位置与评审意见建立可追溯关联。',scope:'本模板提供侧栏与定位能力，不携带科研文献、用户资料、真实权限或AI服务。',delivery:'浏览器保存为默认示例；共享服务须由接入项目明确配置。',sourceTitle:'项目需求来源（接入时填写）',sourceUrl:''}
 return {groups:['内容管理','基础配置'],points,areas,targets,locations,overview}
}
export const catalogs={research:sample('research'),reading:sample('reading')}
export function seedSnapshot(product:Product,kind:'prd'|'annotations'){
 if(kind==='annotations')return {schema:1,product,version:product==='research'?'v3-rules':'reading-v1',revision:0,items:[],trash:[],migrations:[]}
 const current=product==='research'?'v3-rules':'reading-v1'
 return {revision:0,book:{schema:1,...(product==='reading'?{module:'reading'}:{}),current,imports:[],revisions:[{id:current,name:'v1.0 接入示例',at:'2026-09-20T00:00:00.000Z',plan:'替换功能目录与定位映射后用于自己的原型；两个模块的名称和数据独立保存。',areas:structuredClone(catalogs[product].areas),changes:[]}]}}
}
