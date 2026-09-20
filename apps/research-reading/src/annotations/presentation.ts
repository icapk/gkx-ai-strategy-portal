import { shanghaiDate, type Annotation } from './model.ts'
type DatedAnnotation=Pick<Annotation,'createdAt'|'updatedAt'|'number'>
export const annotationUpdateTime=(a:DatedAnnotation)=>a.updatedAt||a.createdAt
export const annotationUpdateDay=(a:DatedAnnotation)=>shanghaiDate(annotationUpdateTime(a))
export function compareAnnotations(a:DatedAnnotation,b:DatedAnnotation,key:'updated'|'number',direction:'asc'|'desc'){
 const order=key==='number'?a.number-b.number:Date.parse(annotationUpdateTime(a))-Date.parse(annotationUpdateTime(b))||a.number-b.number
 return direction==='asc'?order:-order
}
