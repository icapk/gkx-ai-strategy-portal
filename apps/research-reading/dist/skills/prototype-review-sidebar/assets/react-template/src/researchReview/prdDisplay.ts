import type { PrdArea, PrdFeature } from './prd.ts'
import {featureRules} from './prdRules.ts'

/** Display numbers are derived from the full version, never the filtered list. */
export function prdDisplayNumbers(areas: PrdArea[]): Record<string, string> {
  const result: Record<string,string> = {}
  areas.forEach((area, a) => {
    const groups = new Map<string, number>()
    const counts = new Map<string, number>()
    area.features.forEach(feature => {
      const parent = feature.parentTitle || ''
      if (!groups.has(parent)) groups.set(parent, groups.size + 1)
      const index = (counts.get(parent) || 0) + 1
      counts.set(parent, index)
      result[feature.id] = parent ? `${a+1}.${groups.get(parent)}.${index}` : `${a+1}.${index}`
    })
  })
  return result
}
export type PrdFilters = {priority:string; emphasis:string; progress:string}
export function matchesPrdQuery(feature:PrdFeature,query:string,number?:string){
 return JSON.stringify([number,feature.id,feature.title,feature.priority,feature.emphasis?'着重讲解':'',feature.designProgress??'待讨论',featureRules(feature)]).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
}
export function matchesPrdFilters(feature:PrdFeature, filters:PrdFilters) {
  return (!filters.priority || feature.priority===filters.priority)
    && (!filters.emphasis || String(!!feature.emphasis)===filters.emphasis)
    && (!filters.progress || (feature.designProgress??'待讨论')===filters.progress)
}
