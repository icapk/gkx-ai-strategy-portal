import {captureProduct,applyProduct} from './demoBackup'
const database='research-purge-journal-v1'
async function journal(mode:'read'|'write'|'clear',value?:unknown):Promise<any>{
 return new Promise((resolve,reject)=>{const request=indexedDB.open(database,1);request.onupgradeneeded=()=>request.result.createObjectStore('journal');request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result,tx=db.transaction('journal',mode==='read'?'readonly':'readwrite'),store=tx.objectStore('journal');const op=mode==='read'?store.get('pending'):mode==='write'?store.put(value,'pending'):store.delete('pending');let result:unknown;op.onsuccess=()=>{result=op.result};tx.oncomplete=()=>{db.close();resolve(result)};tx.onabort=tx.onerror=()=>{db.close();reject(tx.error)}}})
}
async function recoverPending(){const snapshot=await journal('read');if(snapshot){await applyProduct(snapshot,true);await journal('clear')}}
export async function recoverResearchPurge(){
 const run=async()=>{await recoverPending();localStorage.removeItem('research:purge-busy:v1')}
 if(navigator.locks)return navigator.locks.request('research-purge',run)
 return run()
}
/** Commit UI state only after this resolves. A durable journal also covers reload/crash. */
export async function atomicResearchPurge(action:()=>Promise<void>){
 const run=async()=>{
   localStorage.setItem('research:purge-busy:v1','1')
   try{
     await recoverPending();const snapshot=await captureProduct('research');await journal('write',snapshot)
     try{await action();await journal('clear')}catch(error){
       try{await applyProduct(snapshot,true);await journal('clear')}catch{throw Error('删除未提交，恢复记录已保留。请重新加载完成恢复后再操作。')}
       throw Error('本次删除已回退，资料保持完整。'+String(error))
     }
   }finally{localStorage.removeItem('research:purge-busy:v1')}
 }
 if(navigator.locks)return navigator.locks.request('research-purge',run)
 return run()
}
