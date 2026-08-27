export interface PaperAuthor {
  id: string
  name: string
  affiliationIds: string[]
  email?: string
  corresponding?: boolean
}

export interface PaperAffiliation {
  id: string
  name: string
  address?: string
}

export interface PaperMetadata {
  title: string
  abstract: string
  authors: PaperAuthor[]
  affiliations: PaperAffiliation[]
  keywords: string[]
  publicationDate: string
  journal: string
  doi: string
  researchField: string
}

export type PaperOutlineKind = 'abstract' | 'body' | 'references'

export interface PaperOutlineSection {
  id: string
  title: string
  level: 1 | 2
  kind: PaperOutlineKind
  page: number
  parentId?: string
  excerpt: string
}

export interface PaperCitationAnchor {
  id: string
  referenceId: string
  sectionId: string
  page: number
  marker: string
  context: string
}

export interface PaperReference {
  id: string
  title: string
  authors: string[]
  abstract: string
  publicationDate: string
  journal: string
  doi: string
  citationAnchors: PaperCitationAnchor[]
}

export type PaperFigureKind = 'figure' | 'table'

export interface PaperFigure {
  id: string
  kind: PaperFigureKind
  label: string
  title: string
  caption: string
  page: number
  sectionId: string
  sourceDescription: string
}

export type PaperGraphNodeType =
  | 'paper'
  | 'author'
  | 'institution'
  | 'keyword'
  | 'reference'
  | 'figure'

export interface PaperGraphNode {
  id: string
  type: PaperGraphNodeType
  label: string
  description: string
  keywords: string[]
  sectionId?: string
  page?: number
}

export interface PaperGraphEdge {
  id: string
  source: string
  target: string
  relation: 'authored-by' | 'affiliated-with' | 'has-keyword' | 'cites' | 'contains'
}

export interface PaperKnowledgeGraph {
  nodes: PaperGraphNode[]
  edges: PaperGraphEdge[]
}

export interface PaperAnalysis {
  documentId: number
  metadata: PaperMetadata
  outline: PaperOutlineSection[]
  references: PaperReference[]
  figures: PaperFigure[]
  graph: PaperKnowledgeGraph
}

export type PaperAnalysisSearchKind =
  | 'title'
  | 'abstract'
  | 'keyword'
  | 'author'
  | 'institution'
  | 'graph-node'

export interface PaperAnalysisSearchTarget {
  sectionId?: string
  page?: number
  nodeId?: string
}

export interface PaperAnalysisSearchResult {
  id: string
  kind: PaperAnalysisSearchKind
  label: string
  snippet: string
  score: number
  target: PaperAnalysisSearchTarget
}

const lithiumSulfurAnalysis: PaperAnalysis = {
  documentId: 1,
  metadata: {
    title: '锂硫电池中多硫化物穿梭效应的抑制机制研究：基于功能化碳纳米管界面的储能材料',
    abstract:
      '针对锂硫电池循环过程中多硫化物迁移造成的容量衰减问题，研究构建功能化碳纳米管界面，结合原位表征与理论计算揭示极性位点对多硫化物的吸附和催化转化机制。结果表明，该界面能够兼顾电子传输与化学锚定，显著提升长循环稳定性。',
    authors: [
      {
        id: 'author-liu-jianguo',
        name: '刘建国',
        affiliationIds: ['aff-siat-energy'],
        email: 'jg.liu@siat.ac.cn',
        corresponding: true,
      },
      {
        id: 'author-chen-siyuan',
        name: '陈思远',
        affiliationIds: ['aff-siat-energy', 'aff-szu-materials'],
        email: 'sy.chen@szu.edu.cn',
      },
      {
        id: 'author-wang-lei',
        name: '王磊',
        affiliationIds: ['aff-szu-materials'],
      },
    ],
    affiliations: [
      {
        id: 'aff-siat-energy',
        name: '中国科学院深圳先进技术研究院先进储能材料研究中心',
        address: '广东省深圳市南山区西丽大学城学苑大道1068号',
      },
      {
        id: 'aff-szu-materials',
        name: '深圳大学材料学院',
        address: '广东省深圳市南山区南海大道3688号',
      },
    ],
    keywords: ['锂硫电池', '多硫化物', '穿梭效应', '功能化碳纳米管', '界面吸附'],
    publicationDate: '2023-11-18',
    journal: 'Advanced Energy Materials',
    doi: '10.1002/aenm.202303186',
    researchField: '新能源材料与电化学储能',
  },
  outline: [
    {
      id: 'abstract',
      title: '摘要',
      level: 1,
      kind: 'abstract',
      page: 1,
      excerpt: '构建功能化碳纳米管界面以抑制多硫化物穿梭并促进其可逆转化。',
    },
    {
      id: 'introduction',
      title: '1. 引言',
      level: 1,
      kind: 'body',
      page: 2,
      excerpt: '说明锂硫电池的理论优势、穿梭效应及界面调控研究现状。',
    },
    {
      id: 'methods',
      title: '2. 实验材料与方法',
      level: 1,
      kind: 'body',
      page: 4,
      excerpt: '介绍碳纳米管功能化、材料表征与电化学测试流程。',
    },
    {
      id: 'interface-characterization',
      title: '2.2 界面结构表征',
      level: 2,
      parentId: 'methods',
      kind: 'body',
      page: 5,
      excerpt: '通过原位 XRD 和冷冻电镜分析极性位点及多硫化物演化。',
    },
    {
      id: 'results',
      title: '3. 结果与讨论',
      level: 1,
      kind: 'body',
      page: 7,
      excerpt: '讨论界面吸附能、反应动力学与循环稳定性之间的关系。',
    },
    {
      id: 'conclusion',
      title: '4. 结论',
      level: 1,
      kind: 'body',
      page: 12,
      excerpt: '总结功能化界面的化学锚定和催化转化协同机制。',
    },
    {
      id: 'references',
      title: '参考文献',
      level: 1,
      kind: 'references',
      page: 13,
      excerpt: '列出本文引用的电化学储能与界面材料研究。',
    },
  ],
  references: [
    {
      id: 'ref-li-s-review',
      title: 'Challenges and prospects of lithium–sulfur batteries',
      authors: ['Arumugam Manthiram', 'Yongzhu Fu', 'Sheng-Heng Chung'],
      abstract: '综述锂硫电池中的多硫化物溶解、穿梭效应和电极结构调控策略。',
      publicationDate: '2014-03-14',
      journal: 'Chemical Reviews',
      doi: '10.1021/cr500062v',
      citationAnchors: [
        {
          id: 'anchor-li-s-review-intro',
          referenceId: 'ref-li-s-review',
          sectionId: 'introduction',
          page: 2,
          marker: '[1]',
          context: '可溶性长链多硫化物在正负极之间迁移，是限制锂硫电池寿命的关键问题[1]。',
        },
      ],
    },
    {
      id: 'ref-polar-host',
      title: 'Polar hosts for sulfur cathodes with strong polysulfide anchoring',
      authors: ['Xia Liang', 'Linda F. Nazar'],
      abstract: '研究极性宿主材料对多硫化物的化学吸附作用，并比较不同活性位点的锚定能力。',
      publicationDate: '2016-06-22',
      journal: 'ACS Nano',
      doi: '10.1021/acsnano.6b03254',
      citationAnchors: [
        {
          id: 'anchor-polar-host-results',
          referenceId: 'ref-polar-host',
          sectionId: 'results',
          page: 8,
          marker: '[12]',
          context: '极性官能团可提高长链多硫化物的界面吸附能[12]。',
        },
        {
          id: 'anchor-polar-host-methods',
          referenceId: 'ref-polar-host',
          sectionId: 'interface-characterization',
          page: 6,
          marker: '[12]',
          context: '吸附能的计算模型参考极性宿主材料的界面构型[12]。',
        },
      ],
    },
    {
      id: 'ref-operando-xrd',
      title: 'Operando visualization of sulfur redox pathways',
      authors: ['Ming Zhao', 'Qiang Zhang', 'Jia-Qi Huang'],
      abstract: '利用原位衍射技术追踪硫物种的相变过程，并揭示反应动力学控制步骤。',
      publicationDate: '2021-09-03',
      journal: 'Energy & Environmental Science',
      doi: '10.1039/D1EE01826A',
      citationAnchors: [
        {
          id: 'anchor-operando-methods',
          referenceId: 'ref-operando-xrd',
          sectionId: 'interface-characterization',
          page: 5,
          marker: '[18]',
          context: '原位 XRD 用于识别充放电阶段硫物种的连续演化[18]。',
        },
      ],
    },
  ],
  figures: [
    {
      id: 'figure-interface-mechanism',
      kind: 'figure',
      label: '图 2',
      title: '功能化界面的多硫化物吸附与转化机制',
      caption: '羧基和氨基位点对长链多硫化物产生化学锚定，并缩短其转化路径。',
      page: 6,
      sectionId: 'interface-characterization',
      sourceDescription: '原位表征结果与密度泛函理论计算的组合示意图。',
    },
    {
      id: 'table-cycle-performance',
      kind: 'table',
      label: '表 1',
      title: '不同正极宿主材料的循环性能对比',
      caption: '比较首圈容量、1000 次循环后的容量保持率及平均库仑效率。',
      page: 10,
      sectionId: 'results',
      sourceDescription: '本文实验结果与对照组统计数据。',
    },
  ],
  graph: {
    nodes: [
      {
        id: 'paper-1',
        type: 'paper',
        label: '功能化碳纳米管界面抑制多硫化物穿梭',
        description: '以极性官能团实现化学吸附和快速转化的锂硫电池研究。',
        keywords: ['锂硫电池', '穿梭效应', '储能材料'],
        sectionId: 'abstract',
        page: 1,
      },
      {
        id: 'graph-author-liu',
        type: 'author',
        label: '刘建国',
        description: '通讯作者，研究方向为先进储能材料与电化学界面。',
        keywords: ['研究者', '通讯作者', '储能'],
      },
      {
        id: 'graph-institution-siat',
        type: 'institution',
        label: '先进储能材料研究中心',
        description: '中国科学院深圳先进技术研究院的储能材料研究机构。',
        keywords: ['科研机构', '深圳', '储能材料'],
      },
      {
        id: 'graph-interface-adsorption',
        type: 'keyword',
        label: '界面吸附—催化转化',
        description: '极性位点先锚定多硫化物，再促进其向低阶硫化物可逆转化。',
        keywords: ['界面吸附', '催化', '多硫化物', '语义关联'],
        sectionId: 'results',
        page: 8,
      },
      {
        id: 'graph-ref-polar-host',
        type: 'reference',
        label: 'Polar hosts for sulfur cathodes',
        description: '与本文界面吸附机制直接相关的被引研究。',
        keywords: ['参考文献', '极性宿主'],
        sectionId: 'results',
        page: 8,
      },
      {
        id: 'graph-figure-mechanism',
        type: 'figure',
        label: '图 2 · 界面机制',
        description: '多硫化物吸附与转化机制图。',
        keywords: ['图表', '机制图'],
        sectionId: 'interface-characterization',
        page: 6,
      },
    ],
    edges: [
      { id: 'edge-1-author', source: 'paper-1', target: 'graph-author-liu', relation: 'authored-by' },
      {
        id: 'edge-author-affiliation',
        source: 'graph-author-liu',
        target: 'graph-institution-siat',
        relation: 'affiliated-with',
      },
      {
        id: 'edge-1-keyword',
        source: 'paper-1',
        target: 'graph-interface-adsorption',
        relation: 'has-keyword',
      },
      {
        id: 'edge-1-reference',
        source: 'paper-1',
        target: 'graph-ref-polar-host',
        relation: 'cites',
      },
      {
        id: 'edge-1-figure',
        source: 'paper-1',
        target: 'graph-figure-mechanism',
        relation: 'contains',
      },
    ],
  },
}

const solidElectrolyteAnalysis: PaperAnalysis = {
  documentId: 2,
  metadata: {
    title: '高离子电导率硫化物固态电解质的界面稳定化策略',
    abstract:
      '面向全固态电池中硫化物电解质与高电压正极之间的界面副反应，本研究提出梯度缓冲层与原位钝化协同策略。多尺度表征显示，该策略能够降低界面阻抗增长并保持连续离子通道，为高安全固态电池的工程化提供材料设计依据。',
    authors: [
      {
        id: 'author-zhou-ming',
        name: '周明',
        affiliationIds: ['aff-tsinghua-materials'],
        email: 'ming.zhou@tsinghua.edu.cn',
        corresponding: true,
      },
      {
        id: 'author-li-ruochen',
        name: '李若晨',
        affiliationIds: ['aff-tsinghua-materials', 'aff-battery-lab'],
        email: 'rc.li@szbl.ac.cn',
      },
    ],
    affiliations: [
      {
        id: 'aff-tsinghua-materials',
        name: '清华大学材料学院新型储能材料团队',
        address: '北京市海淀区清华园1号',
      },
      {
        id: 'aff-battery-lab',
        name: '深圳湾实验室先进电池研究所',
        address: '广东省深圳市光明区光侨路高科创新中心',
      },
    ],
    keywords: ['全固态电池', '硫化物电解质', '界面稳定', '梯度缓冲层', '离子电导率'],
    publicationDate: '2024-05-26',
    journal: 'Nature Energy',
    doi: '10.1038/s41560-024-01572-8',
    researchField: '固态电池与离子导体',
  },
  outline: [
    {
      id: 'abstract',
      title: '摘要',
      level: 1,
      kind: 'abstract',
      page: 1,
      excerpt: '以梯度缓冲层和原位钝化提升硫化物固态电解质界面稳定性。',
    },
    {
      id: 'background',
      title: '1. 研究背景',
      level: 1,
      kind: 'body',
      page: 2,
      excerpt: '分析高离子电导率硫化物电解质的界面失效问题。',
    },
    {
      id: 'design',
      title: '2. 梯度界面设计',
      level: 1,
      kind: 'body',
      page: 4,
      excerpt: '说明梯度缓冲层的组分、制备及界面匹配原则。',
    },
    {
      id: 'operando-analysis',
      title: '3. 原位表征与机理',
      level: 1,
      kind: 'body',
      page: 7,
      excerpt: '通过阻抗谱和原位光电子能谱解析界面钝化过程。',
    },
    {
      id: 'device-validation',
      title: '4. 器件验证',
      level: 1,
      kind: 'body',
      page: 10,
      excerpt: '在高面容量软包电池中验证循环稳定性与安全性。',
    },
    {
      id: 'references',
      title: '参考文献',
      level: 1,
      kind: 'references',
      page: 14,
      excerpt: '列出固态电解质、界面涂层和原位表征相关研究。',
    },
  ],
  references: [
    {
      id: 'ref-solid-state-roadmap',
      title: 'Interfaces and interphases in all-solid-state batteries',
      authors: ['Janek Jan', 'Wolfgang G. Zeier'],
      abstract: '系统讨论全固态电池中空间电荷层、化学副反应与机械接触失效。',
      publicationDate: '2023-02-02',
      journal: 'Nature Energy',
      doi: '10.1038/s41560-022-01173-x',
      citationAnchors: [
        {
          id: 'anchor-interface-background',
          referenceId: 'ref-solid-state-roadmap',
          sectionId: 'background',
          page: 2,
          marker: '[3]',
          context: '界面化学稳定性与固—固接触共同决定电池阻抗演化[3]。',
        },
      ],
    },
    {
      id: 'ref-gradient-buffer',
      title: 'Compositionally graded cathode interfaces for sulfide electrolytes',
      authors: ['Aya Kato', 'Hiroshi Saito', 'Minoru Tatsumisago'],
      abstract: '提出成分梯度界面，缓解硫化物电解质与高镍正极之间的化学势突变。',
      publicationDate: '2022-08-19',
      journal: 'Advanced Functional Materials',
      doi: '10.1002/adfm.202204918',
      citationAnchors: [
        {
          id: 'anchor-gradient-design',
          referenceId: 'ref-gradient-buffer',
          sectionId: 'design',
          page: 5,
          marker: '[15]',
          context: '成分梯度可降低界面化学势突变并形成连续离子通道[15]。',
        },
      ],
    },
  ],
  figures: [
    {
      id: 'figure-gradient-interface',
      kind: 'figure',
      label: '图 3',
      title: '梯度缓冲层的结构与离子迁移路径',
      caption: '从高电压正极到硫化物电解质的组分连续变化及计算得到的迁移势垒。',
      page: 6,
      sectionId: 'design',
      sourceDescription: '截面成像、元素分布与离子迁移模拟结果。',
    },
    {
      id: 'figure-impedance',
      kind: 'figure',
      label: '图 5',
      title: '循环过程中的界面阻抗演化',
      caption: '比较未经处理界面与梯度钝化界面在不同循环阶段的阻抗谱。',
      page: 9,
      sectionId: 'operando-analysis',
      sourceDescription: '原位电化学阻抗谱拟合结果。',
    },
    {
      id: 'table-pouch-cell',
      kind: 'table',
      label: '表 2',
      title: '软包电池关键性能参数',
      caption: '列出面容量、能量密度、循环保持率及热失控测试结果。',
      page: 12,
      sectionId: 'device-validation',
      sourceDescription: '三组软包电池的重复实验统计数据。',
    },
  ],
  graph: {
    nodes: [
      {
        id: 'paper-2',
        type: 'paper',
        label: '硫化物固态电解质界面稳定化',
        description: '利用梯度缓冲与原位钝化降低固态电池界面阻抗。',
        keywords: ['固态电池', '硫化物电解质', '界面稳定'],
        sectionId: 'abstract',
        page: 1,
      },
      {
        id: 'graph-author-zhou',
        type: 'author',
        label: '周明',
        description: '通讯作者，研究方向为固态离子学与界面工程。',
        keywords: ['研究者', '固态离子学'],
      },
      {
        id: 'graph-institution-tsinghua',
        type: 'institution',
        label: '清华大学材料学院新型储能材料团队',
        description: '面向高安全电池开展固态电解质与界面研究。',
        keywords: ['高校', '科研机构', '固态电池'],
      },
      {
        id: 'graph-gradient-buffer',
        type: 'keyword',
        label: '梯度缓冲层',
        description: '通过连续组分变化降低化学势差并保持离子传输通道。',
        keywords: ['界面稳定', '离子通道', '语义关联'],
        sectionId: 'design',
        page: 5,
      },
      {
        id: 'graph-ref-interface',
        type: 'reference',
        label: 'Interfaces and interphases in all-solid-state batteries',
        description: '本文界面稳定性设计的理论基础文献。',
        keywords: ['参考文献', '空间电荷层'],
        sectionId: 'background',
        page: 2,
      },
    ],
    edges: [
      { id: 'edge-2-author', source: 'paper-2', target: 'graph-author-zhou', relation: 'authored-by' },
      {
        id: 'edge-2-affiliation',
        source: 'graph-author-zhou',
        target: 'graph-institution-tsinghua',
        relation: 'affiliated-with',
      },
      {
        id: 'edge-2-keyword',
        source: 'paper-2',
        target: 'graph-gradient-buffer',
        relation: 'has-keyword',
      },
      {
        id: 'edge-2-reference',
        source: 'paper-2',
        target: 'graph-ref-interface',
        relation: 'cites',
      },
    ],
  },
}

interface FallbackProfile {
  title: string
  abstract: string
  authors: string[]
  institution: string
  keywords: string[]
  journal: string
  field: string
}

const fallbackProfiles: Record<number, FallbackProfile> = {
  3: {
    title: '一种高比能锂离子电池硅碳复合负极材料及其制备方法',
    abstract: '公开一种兼顾高比容量和循环稳定性的硅碳复合负极结构、制备工艺及电池应用方法。',
    authors: ['王磊', '赵启航'],
    institution: '深圳先进储能技术有限公司',
    keywords: ['硅碳负极', '锂离子电池', '复合材料', '制备方法'],
    journal: '中国发明专利',
    field: '电池材料与制造工艺',
  },
  4: {
    title: '全球储能材料技术趋势与市场格局分析报告（2024年上半年）',
    abstract: '基于论文、专利和产业数据梳理全球储能材料技术路线、区域竞争格局与重点企业动向。',
    authors: ['陈思远', '孙悦'],
    institution: '储能产业研究院',
    keywords: ['储能材料', '技术趋势', '市场格局', '产业分析'],
    journal: '储能产业研究院报告',
    field: '科技情报与产业研究',
  },
  5: {
    title: '面向科研文献的多模态语义检索与知识图谱构建',
    abstract: '融合论文文本、图表和引文网络构建多模态知识图谱，支持可追溯的科研语义检索。',
    authors: ['许文博', '林知夏'],
    institution: '深圳国际科技信息中心智能知识服务实验室',
    keywords: ['语义检索', '知识图谱', '多模态文献', '科研智能'],
    journal: '数据分析与知识发现',
    field: '知识服务与人工智能',
  },
  6: {
    title: '科研阅读中的证据溯源与引文关系发现方法',
    abstract: '提出面向增强阅读的证据定位、引文解析和关系发现流程，提升文献研读的可验证性。',
    authors: ['何清', '唐雨桐', '邹楠'],
    institution: '粤港澳大湾区科技情报联合实验室',
    keywords: ['增强阅读', '证据溯源', '引文解析', '关系发现'],
    journal: '情报学报',
    field: '科技情报与知识组织',
  },
}

function buildFallbackAnalysis(documentId: number, requestedTitle?: string): PaperAnalysis {
  const profile = fallbackProfiles[documentId] ?? {
    title: `科研文献 ${documentId}`,
    abstract: '该文献已完成结构化解析，可从元数据、目录、参考文献、图表和语义关系中继续探索。',
    authors: ['待确认作者'],
    institution: '用户文献库',
    keywords: ['科研文献', '结构化解析', '知识关联'],
    journal: '用户导入文献',
    field: '跨学科研究',
  }
  const title = requestedTitle?.trim() || profile.title
  const authorNodes = profile.authors.map<PaperGraphNode>((author, index) => ({
    id: `graph-${documentId}-author-${index + 1}`,
    type: 'author',
    label: author,
    description: `${title}的作者。`,
    keywords: ['作者', '研究者', profile.field],
  }))

  return {
    documentId,
    metadata: {
      title,
      abstract: profile.abstract,
      authors: profile.authors.map((author, index) => ({
        id: `author-${documentId}-${index + 1}`,
        name: author,
        affiliationIds: [`aff-${documentId}`],
        email: index === 0 ? `author${documentId}@research.example.cn` : undefined,
        corresponding: index === 0,
      })),
      affiliations: [{ id: `aff-${documentId}`, name: profile.institution }],
      keywords: [...profile.keywords],
      publicationDate: documentId % 2 === 0 ? '2024-06-30' : '2024-03-18',
      journal: profile.journal,
      doi: `10.5555/gkx.${String(documentId).padStart(4, '0')}`,
      researchField: profile.field,
    },
    outline: [
      {
        id: 'abstract',
        title: '摘要',
        level: 1,
        kind: 'abstract',
        page: 1,
        excerpt: profile.abstract,
      },
      {
        id: 'introduction',
        title: '1. 研究背景',
        level: 1,
        kind: 'body',
        page: 2,
        excerpt: `梳理${profile.field}的研究问题和已有进展。`,
      },
      {
        id: 'method',
        title: '2. 方法与数据',
        level: 1,
        kind: 'body',
        page: 4,
        excerpt: '说明数据来源、分析方法与可复核的实验流程。',
      },
      {
        id: 'results',
        title: '3. 结果与讨论',
        level: 1,
        kind: 'body',
        page: 7,
        excerpt: '展示主要结果并讨论其适用条件与研究价值。',
      },
      {
        id: 'references',
        title: '参考文献',
        level: 1,
        kind: 'references',
        page: 11,
        excerpt: '列出正文引用且可回溯至引用位置的相关文献。',
      },
    ],
    references: [
      {
        id: `ref-${documentId}-method`,
        title: `${profile.field}中的可复核研究方法`,
        authors: ['赵研', '钱思'],
        abstract: `总结${profile.field}常用的数据、实验和证据验证方法。`,
        publicationDate: '2022-10-12',
        journal: '科研方法与实践',
        doi: `10.5555/method.${documentId}`,
        citationAnchors: [
          {
            id: `anchor-${documentId}-method`,
            referenceId: `ref-${documentId}-method`,
            sectionId: 'method',
            page: 5,
            marker: '[1]',
            context: '本文的数据处理和证据核验流程参照已有的可复核研究框架[1]。',
          },
        ],
      },
      {
        id: `ref-${documentId}-field`,
        title: `${profile.keywords[0]}研究进展`,
        authors: ['吴知行', '郑远'],
        abstract: `回顾${profile.keywords.slice(0, 2).join('与')}的主要进展和开放问题。`,
        publicationDate: '2023-07-08',
        journal: '前沿科学评论',
        doi: `10.5555/review.${documentId}`,
        citationAnchors: [
          {
            id: `anchor-${documentId}-field`,
            referenceId: `ref-${documentId}-field`,
            sectionId: 'introduction',
            page: 2,
            marker: '[2]',
            context: `${profile.keywords[0]}正从单点验证转向系统化研究[2]。`,
          },
        ],
      },
    ],
    figures: [
      {
        id: `figure-${documentId}-framework`,
        kind: 'figure',
        label: '图 1',
        title: `${profile.keywords[0]}研究框架`,
        caption: '从数据输入、方法处理到结论验证的整体流程。',
        page: 4,
        sectionId: 'method',
        sourceDescription: '作者根据研究流程绘制。',
      },
      ...(documentId % 2 === 0
        ? [
            {
              id: `table-${documentId}-evidence`,
              kind: 'table' as const,
              label: '表 1',
              title: '关键证据与结论对应关系',
              caption: '汇总数据来源、分析结果及其支持的研究结论。',
              page: 8,
              sectionId: 'results',
              sourceDescription: '正文分析结果汇总。',
            },
          ]
        : []),
    ],
    graph: {
      nodes: [
        {
          id: `paper-${documentId}`,
          type: 'paper',
          label: title,
          description: profile.abstract,
          keywords: [...profile.keywords],
          sectionId: 'abstract',
          page: 1,
        },
        ...authorNodes,
        {
          id: `graph-${documentId}-institution`,
          type: 'institution',
          label: profile.institution,
          description: `${profile.field}研究机构。`,
          keywords: ['机构', '科研单位', profile.field],
        },
        {
          id: `graph-${documentId}-topic`,
          type: 'keyword',
          label: profile.keywords[0],
          description: `${profile.keywords.join('、')}之间的语义关系。`,
          keywords: [...profile.keywords, '语义关联'],
          sectionId: 'results',
          page: 7,
        },
      ],
      edges: [
        ...authorNodes.map<PaperGraphEdge>((node, index) => ({
          id: `edge-${documentId}-author-${index + 1}`,
          source: `paper-${documentId}`,
          target: node.id,
          relation: 'authored-by',
        })),
        {
          id: `edge-${documentId}-affiliation`,
          source: authorNodes[0].id,
          target: `graph-${documentId}-institution`,
          relation: 'affiliated-with',
        },
        {
          id: `edge-${documentId}-topic`,
          source: `paper-${documentId}`,
          target: `graph-${documentId}-topic`,
          relation: 'has-keyword',
        },
      ],
    },
  }
}

const primaryAnalyses: Record<number, PaperAnalysis> = {
  1: lithiumSulfurAnalysis,
  2: solidElectrolyteAnalysis,
}

function cloneAnalysis(analysis: PaperAnalysis): PaperAnalysis {
  return structuredClone(analysis)
}

/**
 * Returns an isolated analysis snapshot for a reading document. Known documents
 * use curated content; imported documents receive a complete, traceable fallback.
 */
export function getPaperAnalysis(documentId: number, title?: string): PaperAnalysis {
  const analysis = cloneAnalysis(primaryAnalyses[documentId] ?? buildFallbackAnalysis(documentId, title))
  const requestedTitle = title?.trim()

  if (requestedTitle) {
    analysis.metadata.title = requestedTitle
    const paperNode = analysis.graph.nodes.find((node) => node.type === 'paper')
    if (paperNode) paperNode.label = requestedTitle
  }

  return analysis
}

interface SearchCandidate {
  id: string
  kind: PaperAnalysisSearchKind
  label: string
  searchText: string
  snippet: string
  target: PaperAnalysisSearchTarget
  weight: number
}

function normalizeSearchText(value: string): string {
  return value.normalize('NFKC').trim().toLocaleLowerCase('zh-CN')
}

function createSearchCandidates(analysis: PaperAnalysis): SearchCandidate[] {
  const { metadata } = analysis
  const candidates: SearchCandidate[] = [
    {
      id: 'metadata-title',
      kind: 'title',
      label: metadata.title,
      searchText: metadata.title,
      snippet: `${metadata.journal} · ${metadata.publicationDate} · ${metadata.researchField}`,
      target: { sectionId: 'abstract', page: 1 },
      weight: 60,
    },
    {
      id: 'metadata-abstract',
      kind: 'abstract',
      label: '摘要',
      searchText: metadata.abstract,
      snippet: metadata.abstract,
      target: { sectionId: 'abstract', page: 1 },
      weight: 50,
    },
    ...metadata.keywords.map<SearchCandidate>((keyword, index) => ({
      id: `metadata-keyword-${index}`,
      kind: 'keyword',
      label: keyword,
      searchText: `${keyword} ${metadata.researchField}`,
      snippet: `论文关键词 · ${metadata.researchField}`,
      target: { sectionId: 'abstract', page: 1 },
      weight: 46,
    })),
    ...metadata.authors.map<SearchCandidate>((author) => {
      const affiliations = metadata.affiliations
        .filter((affiliation) => author.affiliationIds.includes(affiliation.id))
        .map((affiliation) => affiliation.name)
      return {
        id: `metadata-${author.id}`,
        kind: 'author',
        label: author.name,
        searchText: `${author.name} ${author.email ?? ''} ${affiliations.join(' ')} ${metadata.researchField}`,
        snippet: [affiliations.join('；'), author.email, author.corresponding ? '通讯作者' : '作者']
          .filter(Boolean)
          .join(' · '),
        target: { nodeId: analysis.graph.nodes.find((node) => node.type === 'author' && node.label === author.name)?.id },
        weight: 44,
      }
    }),
    ...metadata.affiliations.map<SearchCandidate>((affiliation) => ({
      id: `metadata-${affiliation.id}`,
      kind: 'institution',
      label: affiliation.name,
      searchText: `${affiliation.name} ${affiliation.address ?? ''} ${metadata.researchField}`,
      snippet: [affiliation.address, metadata.researchField].filter(Boolean).join(' · '),
      target: {
        nodeId: analysis.graph.nodes.find(
          (node) => node.type === 'institution' && normalizeSearchText(affiliation.name).includes(normalizeSearchText(node.label)),
        )?.id,
      },
      weight: 42,
    })),
    ...analysis.graph.nodes.map<SearchCandidate>((node) => ({
      id: `graph-${node.id}`,
      kind: 'graph-node',
      label: node.label,
      searchText: `${node.label} ${node.description} ${node.keywords.join(' ')}`,
      snippet: node.description,
      target: { nodeId: node.id, sectionId: node.sectionId, page: node.page },
      weight: node.type === 'paper' ? 38 : 34,
    })),
  ]

  return candidates
}

/**
 * Searches structured metadata and graph semantics. Every hit includes a target
 * that the reader can use to focus a section, page, or graph node.
 */
export function searchPaperAnalysis(
  analysis: PaperAnalysis,
  query: string,
): PaperAnalysisSearchResult[] {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return []

  const terms = normalizedQuery.split(/\s+/).filter(Boolean)

  return createSearchCandidates(analysis)
    .map((candidate) => {
      const normalizedLabel = normalizeSearchText(candidate.label)
      const normalizedText = normalizeSearchText(candidate.searchText)
      const wholeQueryMatch = normalizedText.includes(normalizedQuery)
      const matchedTerms = terms.filter((term) => normalizedText.includes(term)).length

      if (!wholeQueryMatch && matchedTerms !== terms.length) return null

      const exactLabel = normalizedLabel === normalizedQuery
      const labelContainsQuery = normalizedLabel.includes(normalizedQuery)
      const score = candidate.weight + (exactLabel ? 40 : labelContainsQuery ? 24 : 0) + matchedTerms * 4

      return {
        id: candidate.id,
        kind: candidate.kind,
        label: candidate.label,
        snippet: candidate.snippet,
        score,
        target: candidate.target,
      } satisfies PaperAnalysisSearchResult
    })
    .filter((result): result is PaperAnalysisSearchResult => result !== null)
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id, 'zh-CN'))
}
