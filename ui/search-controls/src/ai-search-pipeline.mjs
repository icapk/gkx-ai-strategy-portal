// Local, deterministic stand-ins for the formal understanding / retrieval /
// ranking services. They only read the supplied prototype paper catalogue.
const conceptRules = [
  { key: 'ai', label: '人工智能', generic: true, aliases: ['人工智能', 'artificial intelligence', 'ai'], terms: ['人工智能', 'AI', 'artificial intelligence', '智能体', '大语言模型', 'deep learning', 'neural networks'] },
  { key: 'llm', label: '大语言模型', aliases: ['大语言模型', '大模型', '语言模型', 'llm'], terms: ['大语言模型', '大模型', '语言模型', 'LLM'] },
  { key: 'agent', label: '智能体', aliases: ['科研智能体', '多智能体', '智能体', 'agents', 'agent'], terms: ['智能体', 'agent'] },
  { key: 'drug', label: '药物发现', aliases: ['drug discovery', '药物发现', '药物'], terms: ['药物', 'drug'] },
  { key: 'target', label: '靶点发现', aliases: ['靶点发现', '靶点', 'target discovery'], terms: ['靶点', 'target'] },
  { key: 'multimodal', label: '多模态', aliases: ['multimodal', '多模态'], terms: ['多模态', 'multimodal'] },
  { key: 'material', label: '材料分析', aliases: ['材料分析', '先进材料', '材料', 'materials', 'material'], terms: ['材料', 'material'] },
  { key: 'battery', label: '固态电池', aliases: ['固态电池', '电池', 'battery'], terms: ['固态电池', '电池', 'battery'] },
  { key: 'graph', label: '知识图谱', aliases: ['知识图谱', 'knowledge graph'], terms: ['知识图谱', 'knowledge graph'] },
  { key: 'evidence', label: '文献证据', aliases: ['文献证据', '证据检索', '证据', 'evidence'], terms: ['证据', 'evidence'] },
  { key: 'traceable', label: '可追溯', aliases: ['可追溯性', '可追溯', '追溯'], terms: ['可追溯', '追溯'] },
  { key: 'literature', label: '文献组织', aliases: ['文献组织', '文献检索', '文献', 'literature'], terms: ['文献', 'literature'] },
  { key: 'learning', label: '深度学习', aliases: ['deep learning', '深度学习', '神经网络', 'neural networks'], terms: ['深度学习', 'deep learning', '神经网络', 'neural networks'] },
  { key: 'interface', label: '界面稳定性', aliases: ['界面稳定性', '界面稳定', '界面'], terms: ['界面', 'interface'] },
  { key: 'modeling', label: '多尺度建模', aliases: ['多尺度建模', '多尺度', '建模'], terms: ['多尺度', '建模', 'modeling'] }
];
const normal = value => String(value || '').normalize('NFKC').toLocaleLowerCase('zh-CN');
const escapePattern = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function termPattern(term) {
  const escaped = escapePattern(normal(term));
  return new RegExp(/^[a-z0-9 ]+$/i.test(term) ? `\\b${escaped}\\b` : escaped, 'giu');
}
const contains = (value, term) => termPattern(term).test(normal(value));
const stopWords = /请问|帮我|给我|介绍一下|介绍|查找|检索|搜索|关于|有关|相关|研究|科研|学术|论文|文献有哪些|有哪些|有什么|哪些|什么|如何|怎样|怎么|是否|可以|能够|进行|实现|组织|应用|进展|方法|方面|情况|内容|线索|方向|中有|在|的|和|与|及|对|中|了|呢|吗|please|find|search|papers?|studies|research|what|which|how|does|can|are|the|in|on|of|for|and/giu;

export function understandPaperQuery(query) {
  const original = String(query || '').trim();
  let remaining = normal(original);
  const concepts = [];
  for (const rule of conceptRules) {
    const hits = rule.aliases.filter(alias => contains(remaining, alias));
    if (!hits.length) continue;
    concepts.push({ key: rule.key, label: rule.label, generic: Boolean(rule.generic), terms: [...rule.terms] });
    hits.sort((a, b) => b.length - a.length).forEach(alias => { remaining = remaining.replace(termPattern(alias), ' '); });
  }
  remaining = remaining.replace(stopWords, ' ');
  const residuals = remaining.match(/[\p{Script=Han}]{2,}|[a-z0-9]+(?:[-.][a-z0-9]+)*/gu) || [];
  residuals.filter(word => word.length > 1).forEach(word => {
    if (!concepts.some(concept => concept.terms.some(term => normal(term) === word))) concepts.push({ key: `literal-${word}`, label: word, generic: false, terms: [word] });
  });
  if (!concepts.length && original && /[\p{L}\p{N}]/u.test(original)) concepts.push({ key: 'literal', label: original, generic: false, terms: [original] });
  return { original, concepts, terms: [...new Set(concepts.flatMap(concept => concept.terms))] };
}

export function normalizePaperCatalog(records) {
  const seen = new Set();
  return (Array.isArray(records) ? records : []).filter(record => record?.type === '论文').map(record => {
    const title = String(record.title || '').trim();
    const id = String(record.paperId || record.id || record.doi || title);
    const dedupeKey = record.paperId || record.doi || normal(title);
    if (!title || seen.has(dedupeKey)) return null;
    seen.add(dedupeKey);
    return { ...record, id, paperId: id, title, type: '论文', summary: String(record.summary || record.abstract || ''),
      tags: Array.isArray(record.tags) ? record.tags : [], date: String(record.date || record.publishedAt || ''),
      year: String(record.year || record.date?.slice(0, 4) || record.publishedAt?.slice(0, 4) || '') };
  }).filter(Boolean);
}

// Ordinary keyword matching; no vectors, model retrieval or hidden topic fallback.
export function retrievePaperCandidates(understanding, catalog) {
  if (!understanding.original || !understanding.terms.length) return [];
  return normalizePaperCatalog(catalog).filter(paper => {
    const text = `${paper.title} ${paper.summary} ${paper.tags.join(' ')}`;
    return understanding.terms.some(term => contains(text, term));
  });
}

// Simulates question-relevance screening using every explicit query concept,
// then title/abstract term coverage. Ties retain the ordinary result order.
export function rankPaperCandidates(understanding, candidates) {
  const required = understanding.concepts;
  return normalizePaperCatalog(candidates).map((paper, index) => {
    const text = `${paper.title} ${paper.summary} ${paper.tags.join(' ')}`;
    const matches = concept => concept.terms.some(term => contains(text, term));
    if (!required.length || !required.every(matches)) return null;
    const score = understanding.concepts.reduce((total, concept) => total
      + (concept.terms.some(term => contains(paper.title, term)) ? 6 : 0)
      + (concept.terms.some(term => contains(paper.summary, term)) ? 3 : 0)
      + (matches(concept) ? 1 : 0), 0);
    return { ...paper, score, catalogOrder: index };
  }).filter(Boolean).sort((a, b) => b.score - a.score || a.catalogOrder - b.catalogOrder)
    .map((paper, index) => ({ ...paper, number: index + 1 }));
}
