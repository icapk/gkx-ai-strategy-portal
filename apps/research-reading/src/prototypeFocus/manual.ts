import type { PrototypeTarget } from './types'
export interface ManualRegion {selector:string;label:string;x:number;y:number;width:number;height:number}
export interface ManualMapping {target:PrototypeTarget;regions:ManualRegion[];prepare?:string[]}
export const MANUAL_KEY='research-prd-manual-regions-v1'
let readingMappings:Record<string,ManualMapping>={}
export function installReadingMappings(value:Record<string,ManualMapping>){readingMappings=value}
export function readReadingManual(id:string){return readingMappings[id]}
export function readManual(id:string):ManualMapping|undefined {
 try {const value=JSON.parse(localStorage.getItem(MANUAL_KEY)||'{}')[id] as ManualMapping;return value?.target?.product==='research'&&Array.isArray(value.regions)&&value.regions.length?value:undefined}catch{return undefined}
}
export function saveManual(id:string,value:ManualMapping|undefined) {
 const raw=localStorage.getItem(MANUAL_KEY),all=raw?JSON.parse(raw):{}
 if(value)all[id]=value;else delete all[id]
 localStorage.setItem(MANUAL_KEY,JSON.stringify(all))
}
export function elementSelector(element:Element):string {
 if(element.id)return '#'+CSS.escape(element.id)
 const focus=element.getAttribute('data-focus-id')
 if(focus)return `[data-focus-id="${CSS.escape(focus)}"]`
 const row=element.getAttribute('data-document-id')
 if(row)return `[data-document-id="${CSS.escape(row)}"]`
 if(element===document.body)return 'body'
 const siblings=element.parentElement?Array.from(element.parentElement.children).filter(e=>e.tagName===element.tagName):[]
 return (element.parentElement?elementSelector(element.parentElement)+' > ':'')+element.tagName.toLowerCase()+`:nth-of-type(${siblings.indexOf(element)+1})`
}
