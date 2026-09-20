export const RECENT_DOCUMENT_BATCH=20
export function usesWorkbenchLoadMore(mode:string,tab:string):boolean {return mode==='workbench'&&['quick','recent','favorites'].includes(tab)}
export function recentDocumentWindow<T>(items:readonly T[],requested=RECENT_DOCUMENT_BATCH) {
 const limit=Number.isFinite(requested)?Math.max(RECENT_DOCUMENT_BATCH,Math.floor(requested)):RECENT_DOCUMENT_BATCH
 return {items:items.slice(0,limit),hasMore:items.length>limit,nextLimit:limit+RECENT_DOCUMENT_BATCH}
}
export function recentDocumentLimitForIndex(index:number) {return Math.max(RECENT_DOCUMENT_BATCH,Math.ceil((index+1)/RECENT_DOCUMENT_BATCH)*RECENT_DOCUMENT_BATCH)}
