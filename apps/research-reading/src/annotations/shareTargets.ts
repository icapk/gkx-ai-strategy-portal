export interface ShareOption { value:string; label:string }
export function groupShareTargets(options:ShareOption[]) {
  const personal:ShareOption[]=[], teams=new Map<string,ShareOption[]>()
  for(const option of options) {
    const root=option.value.split('/')[0]
    if(root==='我的空间')personal.push(option)
    else {const group=teams.get(root)??[];group.push(option);teams.set(root,group)}
  }
  const sort=(items:ShareOption[])=>items.sort((a,b)=>a.value.localeCompare(b.value,'zh-CN',{numeric:true}))
  return {personal:sort(personal),teams:[...teams].map(([name,items])=>({name,items:sort(items)}))}
}
export function shareTargetLabel(value:string) {
  return value==='我的空间'||value.startsWith('我的空间/') ? value.replace(/^我的空间/,'个人空间').replaceAll('/',' / ') : '团队空间 / '+value.replaceAll('/',' / ')
}
