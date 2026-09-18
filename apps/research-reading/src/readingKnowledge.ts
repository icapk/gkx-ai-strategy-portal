export interface KnowledgeWord { text:string; x:number; y:number; width:number; height:number }
export interface KnowledgePage { page:number; words:KnowledgeWord[] }
export interface KnowledgeEvidence { text:string; page:number; x:number; y:number; width:number; height:number; key:string }
export type KnowledgeKind = '技术' | '学术理论' | '学者'
export interface KnowledgeEntity { id:string; kind:KnowledgeKind; name:string; english:string; aliases:string[]; definition:string; evidence:KnowledgeEvidence[] }
export interface KnowledgeEdge { source:string; target:string; relation:'正文提及'|'署名作者'|'同句出现'; evidence:KnowledgeEvidence[] }
export interface KnowledgeResult { entities:KnowledgeEntity[]; edges:KnowledgeEdge[] }

// Controlled domain vocabulary: definitions are editorial data, never generated from the paper.
const vocabulary = [
  {id:'shared',kind:'技术',name:'共口径设计',english:'Shared-aperture design',aliases:['shared aperture','共口径'],definition:'多个辐射结构共用物理口径的设计方法。'},
  {id:'sleeve',kind:'技术',name:'套筒单极子',english:'Sleeve monopole',aliases:['sleeve monopole','套筒单极子'],definition:'带套筒结构的单极子天线。'},
  {id:'vivaldi',kind:'技术',name:'Vivaldi 阵列',english:'Vivaldi array',aliases:['vivaldi array','vivaldi antenna array','vivaldi阵列'],definition:'由 Vivaldi 辐射单元组成的天线阵列。'},
  {id:'polarization',kind:'学术理论',name:'电磁波极化',english:'Polarization',aliases:['polarization','polarized','极化'],definition:'描述电磁波电场方向及其随时间变化的基础概念。'},
  {id:'coupling',kind:'学术理论',name:'互耦',english:'Mutual coupling',aliases:['mutual coupling','互耦'],definition:'描述多个辐射结构之间电磁相互作用的概念。'},
  {id:'impedance',kind:'学术理论',name:'阻抗匹配',english:'Impedance matching',aliases:['impedance matching','impedance bandwidth','阻抗匹配'],definition:'研究馈电端口与天线阻抗适配的原理，关联反射和带宽表现。'},
] satisfies Array<Omit<KnowledgeEntity,'evidence'>>

const normalize=(value:string)=>value.toLowerCase().normalize('NFKC').replace(/[‐‑–—−-]/g,' ').replace(/\s+/g,' ').trim()
function includesTerm(text:string,term:string) {
  const normalized=normalize(text), needle=normalize(term)
  if(/[\u3400-\u9fff]/.test(needle))return normalized.includes(needle)
  return new RegExp(`(?:^|[^a-z])${needle.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}(?=$|[^a-z])`,'i').test(normalized)
}

// The parser supplies layout zones. Avoid joining two columns or treating references as body claims.
export interface KnowledgeLayout { firstPageBodyY:number; columnX:number; references?:{page:number;x:number;y:number} }
export function buildKnowledge(pages:KnowledgePage[],authors:string[],layout:KnowledgeLayout):KnowledgeResult {
  const snippets:KnowledgeEvidence[]=[]
  for(const page of pages){
    const body=page.words.filter(w=>!(page.page===1&&w.y<layout.firstPageBodyY)&&!(layout.references&&page.page===layout.references.page&&w.x>=layout.references.x&&w.y>=layout.references.y))
    for(const side of [0,1]){
      const sorted=body.filter(w=>(w.x<layout.columnX?0:1)===side).sort((a,b)=>a.y-b.y||a.x-b.x)
      const lines:KnowledgeWord[][]=[]
      for(const word of sorted){const last=lines.at(-1);if(last&&Math.abs(last[0].y-word.y)<.006)last.push(word);else lines.push([word])}
      const words=lines.flatMap(line=>line.sort((a,b)=>a.x-b.x))
      let sentence:KnowledgeWord[]=[]
      const flush=()=>{if(!sentence.length)return;const text=sentence.map(w=>w.text).join(' ');const first=sentence[0];snippets.push({text,page:page.page,x:first.x,y:first.y,width:first.width,height:first.height,key:`${page.page}:${side}:${snippets.length}`});sentence=[]}
      for(const word of words){sentence.push(word);if(/[.!?]$/.test(word.text)||sentence.length>=100)flush()}
      flush()
    }
  }
  const entities:KnowledgeEntity[]=vocabulary.flatMap(term=>{
    const evidence=snippets.filter(snippet=>term.aliases.some(alias=>includesTerm(snippet.text,alias)))
    return evidence.length?[{...term,evidence}]:[]
  })
  const headerWords=pages.find(page=>page.page===1)?.words.filter(w=>w.y<layout.firstPageBodyY)??[]
  const header=normalize(headerWords.map(w=>w.text.replace(/[0-9,;*]+/g,'')).join(' '))
  for(const author of [...new Set(authors.map(name=>name.trim()).filter(Boolean))]){
    const tokens=normalize(author).split(/\s+/)
    if(!tokens.every(token=>includesTerm(header,token)))continue
    const word=headerWords.find(w=>normalize(w.text)===tokens[0])
    if(!word)continue
    entities.push({id:`author-${normalize(author).replace(/\s+/g,'-')}`,kind:'学者',name:author,english:'',aliases:[author],definition:'当前论文署名作者；不推断研究专长或个人学术履历。',evidence:[{text:author,page:1,x:word.x,y:word.y,width:word.width,height:word.height,key:`author:${author}`}]})
  }
  const edges:KnowledgeEdge[]=entities.map(entity=>({source:'paper',target:entity.id,relation:entity.kind==='学者'?'署名作者':'正文提及',evidence:entity.evidence}))
  for(const technology of entities.filter(entity=>entity.kind==='技术'))for(const theory of entities.filter(entity=>entity.kind==='学术理论')){
    const evidence=technology.evidence.filter(a=>theory.evidence.some(b=>b.key===a.key))
    if(evidence.length)edges.push({source:technology.id,target:theory.id,relation:'同句出现',evidence})
  }
  return {entities,edges}
}

export function searchKnowledge(entities:KnowledgeEntity[],query:string) {
  const q=normalize(query)
  if(!q)return entities
  return entities.filter(entity=>[entity.name,entity.english,...entity.aliases].filter(Boolean).some(term=>includesTerm(q,term)||normalize(term).includes(q))||entity.evidence.some(e=>normalize(e.text).includes(q)))
}
