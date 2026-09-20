/** Count an alternative in one facet while retaining all other constraints. */
export function facetCount<T,F extends Record<string,string>>(items:T[],filters:F,key:keyof F,value:string,matches:(item:T,filters:F)=>boolean){
 return items.filter(item=>matches(item,{...filters,[key]:value})).length
}
