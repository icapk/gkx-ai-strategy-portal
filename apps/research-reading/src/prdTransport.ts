export const prdModeLabel = import.meta.env.PROD ? '本浏览器演示' : '共享'
export async function prdRequest(endpoint: string, init?: RequestInit): Promise<Response> {
 if (!import.meta.env.PROD) return fetch(endpoint, init)
 const key = 'gkx-public-demo-prd:' + endpoint.split('/').pop()
 const raw = localStorage.getItem(key)
 let current = raw ? JSON.parse(raw) : {revision:0,book:null}
 if (!raw) { const response=await fetch(import.meta.env.BASE_URL+'demo/'+endpoint.split('/').pop()+'.json');if(response.ok)current=await response.json() }
 if (init?.method==='PUT') { const body=JSON.parse(String(init.body));if(body.expectedRevision!==current.revision)return Response.json(current,{status:409});current={revision:current.revision+1,book:body.book};localStorage.setItem(key,JSON.stringify(current)) }
 return Response.json(current)
}
