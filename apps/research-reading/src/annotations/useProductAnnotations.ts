import {prdDisplayNumbers} from '../researchReview/prdDisplay'
import { useRef, useState } from 'react'
import type { PrdBook } from '../researchReview/prdStore'
import { researchLocations, researchTargets } from '../prototypeFocus/researchTargets'
import { readingLocations, readingTargets } from '../prototypeFocus/readingTargets'
import { readManual, readReadingManual, type ManualMapping } from '../prototypeFocus/manual'
import type { PrototypeModule } from '../prototypeFocus/types'
import { useAnnotations } from './useAnnotations'
import type { AnnotationCreateRequest, AnnotationFeature } from './uiTypes'

export function useProductAnnotations(product:PrototypeModule,book:PrdBook|null,points:{id:string;title:string}[]) {
  const revision=book?.revisions.find(v=>v.id===book.current)
  const features=revision?.areas.flatMap(a=>a.features)??[]
  const numbers=prdDisplayNumbers(revision?.areas??[])
  const version=book?.current??''
  const store=useAnnotations(product,{version,complianceIds:points.map(p=>p.id),features})
  const locations=product==='research'?researchLocations:readingLocations
  const targets=product==='research'?researchTargets:readingTargets
  const systemRange=(id:string):ManualMapping|undefined=>{
    const location=locations[id],target=location&&targets[location.navigationTarget]
    return location&&target?{target:structuredClone(target),prepare:location.prepare?.slice(),regions:location.selectors.map(selector=>({selector,label:location.description,x:0,y:0,width:1,height:1}))}:undefined
  }
  const catalog:AnnotationFeature[]=[
    ...points.map(p=>({kind:'compliance' as const,id:p.id,title:p.title,range:structuredClone((product==='research'?readManual(p.id):readReadingManual(p.id))??systemRange(p.id))})),
    ...features.map(f=>({kind:'prd' as const,id:f.id,title:f.title,displayNumber:numbers[f.id],range:structuredClone((product==='research'?readManual(f.id):undefined)??f.manual??systemRange(f.links[0]?.id??''))})),
  ]
  const [openId,setOpenId]=useState<string|null>(null)
  const [createRequest,setCreateRequest]=useState<AnnotationCreateRequest|null>(null)
  const leaveGuard=useRef<null|((action:()=>void)=>void)>(null)
  return {store,version,catalog,openId,setOpenId,createRequest,setCreateRequest,leaveGuard}
}


