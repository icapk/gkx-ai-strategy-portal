import type { ManualMapping } from '../prototypeFocus/manual'
import type { AnnotationRestoreState } from './restoration'
export type Product = 'research' | 'reading'
export const annotationStatuses = ['AI 待做', '暂缓处理', '待审核', '已完结'] as const
export const annotationSources = ['产品内审', '技术评审', '日常协作', '我的注释'] as const
export type AnnotationStatus = typeof annotationStatuses[number]
export type AnnotationSource = typeof annotationSources[number]
export type AnnotationRange = ManualMapping & {pageContext?:string;restore?:AnnotationRestoreState}
export interface AnnotationBindings {
 directG:string[]; directD:string[]; linkedG:string[]; linkedD:string[]
 excludedG?:string[]; excludedD?:string[]
}
export interface Annotation extends AnnotationBindings {
 id:string; number:number; product:Product; version:string; title:string; body:string
 status:AnnotationStatus; source:AnnotationSource; createdAt:string; updatedAt:string; completedAt?:string
 initialRange?:AnnotationRange; range?:AnnotationRange; entry:'prototype'|'compliance'|'prd'
}
export interface AnnotationContext {version:string;complianceIds:string[];features:{id:string;compliance?:string[]}[]}
export type AnnotationInput = Pick<Annotation,'title'|'body'|'entry'|'directG'|'directD'> & Partial<Pick<Annotation,'source'|'range'|'linkedG'|'linkedD'|'excludedG'|'excludedD'>>
export type AnnotationPatch = Partial<Pick<Annotation,'title'|'body'|'status'|'source'|'range'> & AnnotationBindings>
export interface AnnotationFile {schema:1;product:Product;version:string;items:Annotation[]}
// updatedAt also serves as the editor's optimistic concurrency baseline.
export function nextAnnotationUpdate(previous:string,now:string):string {return Date.parse(now)>Date.parse(previous)?now:new Date(Date.parse(previous)+1).toISOString()}
export function shanghaiDate(value:string):string {return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value))}
