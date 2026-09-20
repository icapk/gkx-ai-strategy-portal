import type {PrdFeature} from './prd'
import {usePrototypeFocus} from '../prototypeFocus/FocusContext'
import {readManual,readReadingManual,saveManual} from '../prototypeFocus/manual'
import {researchLocations,researchTargets} from '../prototypeFocus/researchTargets'
import {readingLocations,readingTargets} from '../prototypeFocus/readingTargets'
import {RangeCorrectionEditor} from '../prototypeFocus/RangeCorrectionEditor'
export function ManualFocusEditor({feature,onClose,product='research'}:{feature:PrdFeature;onClose:()=>void;product?:'research'|'reading'}){
 const {requestFocus,cancelFocus}=usePrototypeFocus()
 const base=feature.links[0]?.id,location=(product==='research'?researchLocations:readingLocations)[base]
 const target=location&&(product==='research'?researchTargets:readingTargets)[location.navigationTarget]
 const current=(product==='research'?readManual:readReadingManual)(feature.id)
 const system=target&&location?{target,prepare:location.prepare,regions:location.selectors.map((selector,i)=>({selector,label:'初始范围 '+(i+1),x:0,y:0,width:1,height:1}))}:undefined
 return <RangeCorrectionEditor title={feature.id+' · '+feature.title} product={product} initial={current??system} onClose={onClose}
  onInitial={()=>{if(!system)throw Error('此功能尚未配置初始定位。');requestFocus(base,feature.title,product,true);return system}}
  onSave={range=>{if(!target&&!current)throw Error('此功能尚未配置页面导航目标，请先关联原型入口。');saveManual(feature.id,range,product);if(range.regions.length)requestFocus(feature.id+'::'+base,feature.title,product);else cancelFocus();return true}}/>
}
