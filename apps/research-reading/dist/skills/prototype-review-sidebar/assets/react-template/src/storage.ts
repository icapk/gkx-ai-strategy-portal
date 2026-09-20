import {runtime} from './sidebar.config.ts'
function scoped(getStorage:()=>Storage):Storage {
 const prefix=()=>runtime.namespace+':'
 const keys=()=>Array.from({length:getStorage().length},(_,i)=>getStorage().key(i)!).filter(k=>k.startsWith(prefix()))
 return {get length(){return keys().length},key:index=>keys()[index]?.slice(prefix().length)??null,getItem:key=>getStorage().getItem(prefix()+key),setItem:(key,value)=>getStorage().setItem(prefix()+key,value),removeItem:key=>getStorage().removeItem(prefix()+key),clear:()=>{for(const key of keys())getStorage().removeItem(key)}}
}
export const localStorage=scoped(()=>window.localStorage)
export const sessionStorage=scoped(()=>window.sessionStorage)
