import type { Annotation, AnnotationBindings, AnnotationContext } from './model.ts'
const unique=(values:string[])=>[...new Set(values)]
export function resolveLinks(item:AnnotationBindings,context:AnnotationContext) {
 const linkedG=unique([...item.linkedG,...item.directG,...context.features.filter(f=>item.directD.includes(f.id)).flatMap(f=>f.compliance??[])]).filter(id=>!item.excludedG?.includes(id))
 const linkedD=unique([...item.linkedD,...item.directD,...context.features.filter(f=>f.compliance?.some(id=>item.directG.includes(id))).map(f=>f.id)]).filter(id=>!item.excludedD?.includes(id))
 return {linkedG,linkedD}
}
export type AnnotationRelationKind='compliance'|'prd'
export function annotationRelationSources(item:AnnotationBindings,context:AnnotationContext,kind:AnnotationRelationKind,id:string) {
 const direct=(kind==='compliance'?item.directG:item.directD).includes(id)
 const automaticFrom:{kind:AnnotationRelationKind;id:string}[]=kind==='compliance'
  ?context.features.filter(f=>item.directD.includes(f.id)&&f.compliance?.includes(id)).map(f=>({kind:'prd',id:f.id}))
  :context.features.filter(f=>f.id===id).flatMap(f=>unique(f.compliance??[]).filter(g=>item.directG.includes(g)).map(g=>({kind:'compliance',id:g})))
 const historical=(kind==='compliance'?item.linkedG:item.linkedD).includes(id)&&!direct&&!automaticFrom.length
 return {direct,automaticFrom,historical}
}
/** Change only this annotation's choices. Automatic results never become expansion roots. */
export function setAnnotationRelation(item:AnnotationBindings,context:AnnotationContext,kind:AnnotationRelationKind,id:string,selected:boolean):AnnotationBindings {
 const next:AnnotationBindings={directG:unique(item.directG),directD:unique(item.directD),...resolveLinks(item,context),excludedG:[...(item.excludedG??[])],excludedD:[...(item.excludedD??[])]}
 const direct=kind==='compliance'?'directG':'directD',excluded=kind==='compliance'?'excludedG':'excludedD'
 if(selected){
  next[direct]=unique([...next[direct],id]);next[excluded]=next[excluded]!.filter(value=>value!==id)
  // An explicit new selection also accepts its currently mapped opposite side.
  const opposite=kind==='compliance'?'excludedD':'excludedG'
  const mapped=kind==='compliance'?context.features.filter(f=>f.compliance?.includes(id)).map(f=>f.id):context.features.filter(f=>f.id===id).flatMap(f=>f.compliance??[])
  next[opposite]=next[opposite]!.filter(value=>!mapped.includes(value))
 }else{
  const before:AnnotationBindings=structuredClone(next)
  next[direct]=next[direct].filter(value=>value!==id)
  // Cancel the direct roots responsible for this automatic item, not their neighbours recursively.
  for(const source of annotationRelationSources(before,context,kind,id).automaticFrom){const field=source.kind==='compliance'?'directG':'directD';next[field]=next[field].filter(value=>value!==source.id)}
  next[excluded]=unique([...next[excluded]!,id])
  for(const side of ['compliance','prd'] as const){
   const field=side==='compliance'?'linkedG':'linkedD'
   next[field]=next[field].filter(value=>{
    if(side===kind&&value===id)return false
    const was=annotationRelationSources(before,context,side,value),now=annotationRelationSources(next,context,side,value)
    return now.direct||now.automaticFrom.length>0||(!was.direct&&!was.automaticFrom.length)
   })
  }
 }
 return {...next,...resolveLinks(next,context)}
}
export function relationState(item:Pick<Annotation,'linkedG'|'linkedD'>,context:AnnotationContext):'已关联'|'未关联' {
 return item.linkedG.some(id=>context.complianceIds.includes(id))||item.linkedD.some(id=>context.features.some(f=>f.id===id))?'已关联':'未关联'
}
