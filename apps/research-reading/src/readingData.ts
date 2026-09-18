export interface ReadingDocument {
  language?: 'zh' | 'en'
  originalFile?: boolean

  id: number
  title: string
  authors: string
  journal: string
  year: string
  type: 'PDF' | 'Word'
  size: string
  favorite: boolean
  folder: string
  visitedAt?: string
}

export interface ReadingNote {
  pdfAnnotation?: import('./types').PdfArchiveAnnotation
  id: number
  title: string
  excerpt: string
  createdAt: string
  color: string
  tags?: string[]
  imageDataUrls?: string[]
  sourceAnchor?: { page: number; x: number; y: number; width?: number; height?: number }
  sourceRects?: { x: number; y: number; width: number; height: number }[]
}

export const readingDocuments: ReadingDocument[] = [
  {
    id: 1,
    title: '锂硫电池中多硫化物穿梭效应的抑制机制研究：基于功能化碳纳米管界面的储能材料',
    authors: '刘建国、陈思远、王磊',
    journal: 'Advanced Energy Materials',
    year: '2023',
    type: 'Word',
    size: '12.5 MB',
    favorite: false,
    folder: '我的笔记库1',
  },
  {
    id: 2,
    title: '高离子电导率硫化物固态电解质的界面稳定化策略',
    authors: '周明、李若晨',
    journal: 'Nature Energy',
    year: '2024',
    type: 'PDF',
    size: '15.8 MB',
    favorite: true,
    folder: '我的笔记库1',
  },
  {
    id: 3,
    title: '一种高比能锂离子电池硅碳复合负极材料及其制备方法',
    authors: '王磊、赵启航',
    journal: '中国发明专利',
    year: '2024',
    type: 'PDF',
    size: '15.0 MB',
    favorite: false,
    folder: '我的笔记库1',
  },
  {
    id: 4,
    title: '全球储能材料技术趋势与市场格局分析报告(2024年上半年)',
    authors: '陈思远、孙悦',
    journal: '储能产业研究院',
    year: '2023',
    type: 'Word',
    size: '12.5 MB',
    favorite: false,
    folder: '我的笔记库1',
  },
]

export const initialReadingNotes: ReadingNote[] = [
  {
    id: 1,
    title: '多硫化物穿梭效应',
    excerpt: '多硫化物穿梭效应通常出现在锂硫电池中，...',
    createdAt: '',
    color: '#FFE4BA',
  },
  {
    id: 2,
    title: '多硫化物穿梭效应',
    excerpt: '多硫化物穿梭效应通常出现在锂硫电池中，...',
    createdAt: '',
    color: '#FABFBD',
  },
  {
    id: 3,
    title: '多硫化物穿梭效应',
    excerpt: '多硫化物穿梭效应通常出现在锂硫电池中，...',
    createdAt: '',
    color: '#C6EFC1',
  },
  {
    id: 4,
    title: '多硫化物穿梭效应',
    excerpt: '多硫化物穿梭效应通常出现在锂硫电池中，...',
    createdAt: '',
    color: '#DCC9FB',
  },
]

export const outlineGroups = [
  { title: '摘要', children: [] },
  { title: '1.引言', children: ['1.1.研究背景与意义', '1.2.研究现状'] },
  { title: '2.实验材料与方法', children: ['2.1.原料制备', '2.2.表征手段', '2.3.电化学测试'] },
  { title: '3.结果与讨论', children: ['3.1.材料形貌分析', '3.2.储能机制研究', '3.3.电化学性能评估'] },
  { title: '4.结论', children: [] },
  { title: '参考文献', children: [] },
]

export const articleSections = [
  {
    title: '1.引言',
    parts: [
      {
        title: '1.1.研究背景与意义',
        body: '锂硫电池因具有较高的理论比容量和能量密度，被认为是具有应用前景的新一代储能体系。然而，在实际充放电过程中，硫正极会生成可溶性的长链多硫化物 Li₂Sₙ（4≤n≤8），这些多硫化物容易在正负极之间迁移，产生典型的“穿梭效应”。该过程会导致活性物质流失、库仑效率下降、容量快速衰减，并严重影响锂硫电池的循环寿命。',
      },
      {
        title: '1.2.研究现状',
        body: '针对这一问题，本研究以功能化碳纳米管作为正极宿主材料，通过在其表面引入羧基、氨基等官能团，增强其对长链多硫化物的化学吸附能力。研究功能化碳纳米管界面对多硫化物迁移行为的抑制机制，为提升锂硫电池稳定性提供依据。',
      },
    ],
  },
  {
    title: '2.实验材料与方法',
    parts: [
      {
        title: '2.1.原料制备',
        body: '采用酸化处理与表面接枝相结合的方法制备功能化碳纳米管。通过控制反应温度、时间及官能团比例，使材料在保持连续导电网络的同时获得均匀的极性活性位点。',
      },
      {
        title: '2.2.表征手段',
        body: '利用原位 XRD、冷冻电子显微镜与密度泛函理论计算，对多硫化物在充放电过程中的演化和界面吸附行为进行联合分析，实验表征与理论计算结果相互印证。',
      },
      {
        title: '2.3.电化学测试',
        body: '测试结果显示，功能化碳纳米管正极宿主材料相比对照组使比容量提升 186%，并在 1000 次循环后保持 92.3% 的容量，表现出优异的长循环稳定性。',
      },
    ],
  },
  {
    title: '3.结果与讨论',
    parts: [
      {
        title: '3.1.材料形貌分析',
        body: '功能化碳纳米管保留了一维导电网络结构，表面羧基、氨基官能团使其由单纯导电载体转变为兼具导电性和化学吸附能力的功能界面材料。',
      },
      {
        title: '3.2.储能机制研究',
        body: '极性官能团与长链多硫化物之间形成稳定的界面相互作用，使多硫化物更倾向于停留在正极区域，并促进其向低阶硫化锂物种可逆转化。',
      },
      {
        title: '3.3.电化学性能评估',
        body: '功能化界面长期限制多硫化物迁移，降低活性物质损失并减缓电极结构退化，显著改善硫正极反应活性、电荷传输效率和容量保持率。',
      },
    ],
  },
  {
    title: '4.结论',
    parts: [
      {
        title: '',
        body: '本研究系统揭示了功能化碳纳米管界面调控多硫化物吸附与转化的作用机制，为高性能锂硫电池正极宿主材料的设计提供了有效思路。',
      },
    ],
  },
]

// Paragraph-level English renderings keyed by section title, so划词翻译 always has
// a sentence-level result even when the selection matches no term in the glossary.
export const paragraphTranslations: Record<string, string> = {
  摘要: 'To address capacity fading caused by polysulfide migration during lithium-sulfur battery cycling, this work constructs a functionalized carbon nanotube interface and combines in-situ characterization with theoretical calculations to reveal how polar sites adsorb and catalytically convert polysulfides. The results show that the interface balances electron transport and chemical anchoring, markedly improving long-cycle stability.',
  '1.1.研究背景与意义': 'Lithium-sulfur batteries are regarded as a promising next-generation energy storage system owing to their high theoretical specific capacity and energy density. During practical charge and discharge, however, the sulfur cathode generates soluble long-chain polysulfides Li₂Sₙ (4≤n≤8) that migrate between the cathode and anode, producing the well-known shuttle effect. This process causes loss of active material, reduced Coulombic efficiency, rapid capacity decay, and severely shortened cycle life.',
  '1.2.研究现状': 'To address this problem, the present study employs functionalized carbon nanotubes as the cathode host material and introduces carboxyl and amino groups on their surface to strengthen chemical adsorption of long-chain polysulfides. It investigates how the functionalized carbon nanotube interface suppresses polysulfide migration, providing a basis for improving lithium-sulfur battery stability.',
  '2.1.原料制备': 'Functionalized carbon nanotubes were prepared by combining acid treatment with surface grafting. By controlling reaction temperature, duration, and functional group ratio, the material retains a continuous conductive network while acquiring uniformly distributed polar active sites.',
  '2.2.表征手段': 'In-situ XRD, cryogenic electron microscopy, and density functional theory calculations were used to jointly analyze polysulfide evolution during charge and discharge together with interfacial adsorption behavior, with experimental characterization and theoretical calculations corroborating each other.',
  '2.3.电化学测试': 'Testing shows that the functionalized carbon nanotube cathode host raises specific capacity by 186% relative to the control group and retains 92.3% of its capacity after 1000 cycles, demonstrating excellent long-cycle stability.',
  '3.1.材料形貌分析': 'The functionalized carbon nanotubes retain their one-dimensional conductive network, while surface carboxyl and amino groups transform them from a purely conductive support into a functional interface material combining conductivity with chemical adsorption capability.',
  '3.2.储能机制研究': 'Stable interfacial interactions form between the polar functional groups and long-chain polysulfides, keeping polysulfides preferentially within the cathode region and promoting their reversible conversion into lower-order lithium sulfide species.',
  '3.3.电化学性能评估': 'The functionalized interface restricts polysulfide migration over the long term, reducing active material loss and slowing electrode structural degradation, thereby markedly improving the reaction activity, charge transport efficiency, and capacity retention of the sulfur cathode.',
  '4.结论': 'This study systematically reveals the mechanism by which a functionalized carbon nanotube interface regulates polysulfide adsorption and conversion, offering an effective design route for high-performance lithium-sulfur battery cathode host materials.',
}
