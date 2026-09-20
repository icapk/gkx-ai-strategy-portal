import './base.css'
import {useEffect,type ReactNode} from 'react'
import {PrototypeFocusProvider,usePrototypeFocus} from './prototypeFocus/FocusContext.tsx'
import {ResearchReviewSidebar} from './researchReview/ResearchReviewSidebar.tsx'
import {ReadingReviewSidebar} from './readingReview/ReadingReviewSidebar.tsx'
import {registerAnnotationRestorer,type AnnotationRestorer} from './annotations/restoration.ts'
import type {PrototypeFocusRequest} from './prototypeFocus/types.ts'
import type {Product} from './sidebar.config.ts'
import './annotations/annotations.css'
import './reviewUnified.css'
import './shell.css'
export type ReviewHost={
 /** Open a route/tab safely, wait for rendering, return an error instead of discarding a business draft. */
 prepareTarget:(request:PrototypeFocusRequest)=>Promise<string|undefined>|string|undefined
 restorer?:AnnotationRestorer
}
function Connection({product,host}:{product:Product;host:ReviewHost}){
 const {request,ready,reject}=usePrototypeFocus()
 useEffect(()=>host.restorer?registerAnnotationRestorer(product,host.restorer):undefined,[product,host.restorer])
 useEffect(()=>{if(!request)return;let cancelled=false;const r=request;if(r.module!==product){reject(r.sequence,'请先切换到对应产品');return}Promise.resolve().then(()=>host.prepareTarget(r)).then(error=>{if(cancelled)return;if(error)reject(r.sequence,error);else ready(r.sequence)},error=>{if(!cancelled)reject(r.sequence,String(error))});return()=>{cancelled=true}},[request?.sequence,host.prepareTarget,product])
 return null
}
export function ReviewShell({product,host,context,children}:{product:Product;host:ReviewHost;context:string;children:ReactNode}){
 return <PrototypeFocusProvider><div className="review-shell"><Connection product={product} host={host}/>{product==='research'?<ResearchReviewSidebar/>:<ReadingReviewSidebar/>}<main className="review-host" data-annotation-product={product} data-annotation-context={context}>{children}</main></div></PrototypeFocusProvider>
}
