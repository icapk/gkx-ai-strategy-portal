export function validReadingBook(b) {
 if(!b||b.module!=='reading'||b.schema!==1||!Array.isArray(b.revisions)||!b.revisions.length)return false
 const versions=new Set()
 for(const v of b.revisions){
  if(!v||typeof v.id!=='string'||versions.has(v.id)||typeof v.name!=='string'||!v.name.trim()||typeof v.plan!=='string'||typeof v.at!=='string'||!Array.isArray(v.areas)||!Array.isArray(v.changes))return false
  versions.add(v.id)
  const ids=new Set(),areas=new Set()
  for(const a of v.areas){
   if(!a||typeof a.id!=='string'||areas.has(a.id)||typeof a.title!=='string'||typeof a.layout!=='string'||typeof a.purpose!=='string'||!Array.isArray(a.features))return false
   areas.add(a.id)
   for(const f of a.features){
    if(f?.emphasis!==undefined&&typeof f.emphasis!=='boolean'||f?.designProgress!==undefined&&!['待讨论','待完善','已完成'].includes(f.designProgress))return false
    if(!f||!/^READ-[\w-]+$/.test(f.id)||ids.has(f.id)||typeof f.title!=='string'||!f.title.trim()||!['P0','P1','P2'].includes(f.priority)||typeof f.release!=='string'||!Array.isArray(f.compliance)||f.compliance.some(x=>typeof x!=='string'||!/^F\d+(\.\d+)?$/.test(x))||!Array.isArray(f.links)||f.links.some(x=>!x||typeof x.id!=='string'||!/^READ-|^F\d/.test(x.id)||typeof x.label!=='string')||!Array.isArray(f.rules)||!f.rules.length||f.rules.some(g=>!g||typeof g.title!=='string'||!g.title.trim()||!Array.isArray(g.items)||!g.items.length||g.items.some(x=>typeof x!=='string'||!x.trim())))return false
    ids.add(f.id)
    if(f.manual){
     if(f.manual.target?.product!=='reading'||!Array.isArray(f.manual.regions)||f.manual.regions.length>20)return false
     for(const r of f.manual.regions)if(!r||typeof r.selector!=='string'||!r.selector.startsWith('#reading-product-panel')||typeof r.label!=='string'||![r.x,r.y,r.width,r.height].every(Number.isFinite)||r.x<0||r.y<0||r.width<=0||r.height<=0||r.x+r.width>1.00001||r.y+r.height>1.00001)return false
    }
   }
  }
  if(v.changes.some(c=>!c||typeof c.id!=='string'||typeof c.at!=='string'||typeof c.reason!=='string'))return false
 }
 return versions.has(b.current)
}
