import type {PrdFeature} from './prd.ts'
export interface PrdRule {title:string;items:string[]}
export const splitRuleText=(text:string)=>text.split(/\n+/).map(s=>s.trim()).filter(Boolean)
export const authoredRules=(_id:string):PrdRule[]|undefined=>undefined
export const featureRules=(feature:PrdFeature):PrdRule[]=>feature.rules??[{title:'功能规则',items:splitRuleText(feature.behavior)}]
