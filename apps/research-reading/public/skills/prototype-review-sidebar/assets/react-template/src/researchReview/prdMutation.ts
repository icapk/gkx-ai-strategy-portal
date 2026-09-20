import type {PrdBook} from './prdStore.ts'
import type {PrdFeature} from './prd.ts'
export function reviseFeature(book:PrdBook,area:string,before:PrdFeature|undefined,after:PrdFeature|undefined,reason:string):PrdBook {
 const next=structuredClone(book), revision=next.revisions.find(v=>v.id===next.current)!
 const target=revision.areas.find(a=>a.id===area)!
 if(before)target.features=target.features.filter(f=>f.id!==before.id)
 if(after){const index=before?book.revisions.find(v=>v.id===book.current)!.areas.find(a=>a.id===area)!.features.findIndex(f=>f.id===before.id):target.features.length;target.features.splice(index,0,after)}
 revision.changes.push({id:crypto.randomUUID(),at:new Date().toISOString(),reason,area,before,after})
 return next
}
