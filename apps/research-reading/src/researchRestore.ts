import type {FolderItem} from './types'
import {sameName} from './researchPolicy.ts'
/** Reconstruct only missing parents; never overwrite an existing folder. */
export function planRestoreParents(location:string,folders:FolderItem[],owner:string,now:string){
 const parts=location.split('/');if(parts.some(p=>!p||p==='.'||p==='..'||p.includes('\\')))throw Error('恢复路径无效')
 let nextId=Math.max(Date.now(),...folders.map(f=>f.id))+1,parent=parts[0];const created:FolderItem[]=[]
 for(const name of parts.slice(1)){
  const matches=folders.filter(f=>f.location===parent&&sameName(f.name,name))
  if(matches.length>1||matches.some(f=>f.name!==name))throw Error('恢复路径存在同名目录冲突')
  if(!matches.length)created.push({id:nextId++,name,location:parent,owner,count:0,createdAt:now,updatedAt:now,size:'-'})
  parent+='/'+name
 }
 return created
}
