import type { FolderItem } from './types'
export interface RecycledFolder {id:number;scope:'personal'|'team';root:FolderItem;folders:FolderItem[];documentIds:number[];deletedAt:string}
export const folderRecycleKey='research-folder-recycle-v1'
export function loadRecycledFolders():RecycledFolder[] {
 try {const value=JSON.parse(localStorage.getItem(folderRecycleKey)||'[]');return Array.isArray(value)?value.filter(v=>v.root&&Array.isArray(v.folders)&&Array.isArray(v.documentIds)):[]}catch{return []}
}
// A synchronous local transaction rolls metadata back before React publishes changes.
export function folderTransaction(action:()=>void):string {
 const keys=[folderRecycleKey,'intelligent-research-portal:documents:v1','intelligent-research-portal:folders:v1:personal','intelligent-research-portal:folders:v1:team']
 let snapshots:[string,string|null][]=[]
 try{snapshots=keys.map(k=>[k,localStorage.getItem(k)]);action();return ''}catch(e){
  let failed=false
  for(const [key,value] of snapshots){try{if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value)}catch{failed=true}}
  return `${e instanceof Error?e.message:'保存失败'}${failed?'；回滚失败，请刷新并核对数据。':'；未提交本次修改。'}`
 }
}
