import type {PrdFeature} from '../researchReview/prd'
import type {ManualMapping} from '../prototypeFocus/manual'
import {readingLocations,readingTargets} from '../prototypeFocus/readingTargets'
import {RangeCorrectionEditor} from '../prototypeFocus/RangeCorrectionEditor'
import {usePrototypeFocus} from '../prototypeFocus/FocusContext'
export function ReadingManualEditor({feature,onClose,onSave}:{feature:PrdFeature;onClose:()=>void;onSave:(mapping:ManualMapping|undefined,reason:string)=>Promise<boolean>}){
 const {requestFocus,cancelFocus}=usePrototypeFocus(),base=feature.links[0]?.id,location=readingLocations[base],target=location&&readingTargets[location.navigationTarget]
 const prefix=(selector:string)=>selector.startsWith('#reading-product-panel')?selector:'#reading-product-panel '+selector
 const system=target&&location?{target,prepare:location.prepare,regions:location.selectors.map((selector,i)=>({selector:prefix(selector),label:'初始范围 '+(i+1),x:0,y:0,width:1,height:1}))}:undefined
 return <RangeCorrectionEditor title={feature.id+' · '+feature.title} product="reading" initial={feature.manual??system} onClose={onClose}
  onInitial={()=>{if(!system)throw Error('此功能尚未配置初始定位。');requestFocus(base,feature.title,'reading',true);return system}}
  onSave={async range=>{const mapping={...range,regions:range.regions.map(r=>({...r,selector:prefix(r.selector)}))};const saved=await onSave(mapping,'校正原型定位区域');if(saved){if(mapping.regions.length)requestAnimationFrame(()=>requestFocus(feature.id+'::'+base,feature.title,'reading'));else cancelFocus()}return saved}}/>
}
