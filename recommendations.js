(function () {
  "use strict";

  const MODE_CONFIG = {
    ai: {
      resultMode: "AI 搜索",
      label: "AI搜索",
      placeholder: "用自然语言描述你想找的内容，AI帮你理解搜索意图...",
      guide: "使用人工智能理解你的搜索意图，找到语义相似和深度相关的内容"
    },
    association: {
      resultMode: "关联",
      label: "智能关联",
      placeholder: "输入主题、技术或专家，发现相关成果、人物与研究脉络...",
      guide: "结合主题关系与知识关联，发现相似内容、上下游成果和潜在合作对象"
    },
    fulltext: {
      resultMode: "全文",
      label: "全文检索",
      placeholder: "输入论文、专利、专家或报告中的关键词...",
      guide: "检索题名、摘要与正文内容，并在结果页定位命中片段"
    },
    keyword: {
      resultMode: "关键词",
      label: "关键词检索",
      placeholder: "输入一个或多个关键词，可在结果页继续精确筛选...",
      guide: "支持精确匹配、同义词与中英文扩展，并按资源字段继续筛选"
    }
  };

  const KEYWORD_WATCH_STORAGE_KEY = "gkx-keyword-watches-v1";
  const KEYWORD_WATCH_LIMIT = 8;
  const BASE_MESSAGE_COUNT = 5;
  const NEWS_VIEW_STORAGE_KEY = "gkx-news-browse-records-v1";
  const NEWS_PAGE_SIZE = 4;
  const DEFAULT_NEWS_INTERESTS = ["人工智能", "量子计算"];
  const NEWS_ITEMS = [
    {
      id: "news-ai-research-platform",
      order: 1,
      title: "科研智能体平台进入多任务协作验证阶段",
      summary: "多家科研机构开始验证智能体在文献研读、证据整理与实验协作中的连续任务能力。",
      fullSummary: "多家科研机构开始验证智能体在文献研读、证据整理与实验协作中的连续任务能力，重点评估任务拆解、证据回溯、人工复核和异常中止机制。当前信息用于演示资讯推荐与摘要展开流程，不代表真实统计结论。",
      source: "平台资讯中心（原型）",
      sourceType: "平台专题资讯",
      sourceNote: "原型演示数据；正式上线后将接入可核验的原始来源与采集时间。",
      publishedAt: "2026-08-26T16:30:00+08:00",
      topic: "人工智能",
      tags: ["人工智能", "科学智能体", "大语言模型", "科研工作流"],
      platformViews: 23400,
      isHot: true,
      hotReason: "24 小时热度持续上升"
    },
    {
      id: "news-quantum-error-correction",
      order: 2,
      title: "量子纠错研究聚焦可扩展验证路径",
      summary: "研究团队围绕量子比特稳定性、纠错效率和系统扩展条件开展新一轮实验验证。",
      fullSummary: "研究团队围绕量子比特稳定性、纠错效率和系统扩展条件开展新一轮实验验证，并持续比较不同技术路线在噪声控制、资源开销和可重复性方面的表现。当前信息为功能原型内容。",
      source: "量子科学专题库（原型）",
      sourceType: "专题知识库",
      sourceNote: "由原型专题库生成，用于演示来源披露、发布时间和浏览记录。",
      publishedAt: "2026-08-26T09:10:00+08:00",
      topic: "量子计算",
      tags: ["量子计算", "量子纠错", "量子比特", "量子算法"],
      platformViews: 18620,
      isHot: true,
      hotReason: "本周检索增幅位居前列"
    },
    {
      id: "news-solid-state-interface",
      order: 3,
      title: "固态电池界面材料研究关注长期稳定性",
      summary: "最新讨论从材料计算与实验表征两端观察固态电池界面衰减及安全边界。",
      fullSummary: "最新讨论从材料计算与实验表征两端观察固态电池界面衰减及安全边界，建议结合循环寿命、温度条件与失效证据评估研究结果。当前信息为功能原型内容。",
      source: "材料科学专题库（原型）",
      sourceType: "专题知识库",
      sourceNote: "原型演示数据；不替代正式论文、标准或产业报告。",
      publishedAt: "2026-08-25T14:20:00+08:00",
      topic: "新能源",
      tags: ["固态电池", "界面材料", "电解质", "新能源"],
      platformViews: 12300,
      isHot: false,
      hotReason: ""
    },
    {
      id: "news-crispr-clinical-evidence",
      order: 4,
      title: "基因编辑临床研究强化长期随访要求",
      summary: "相关研究继续关注治疗收益、脱靶风险与长期随访数据之间的证据一致性。",
      fullSummary: "相关研究继续关注治疗收益、脱靶风险与长期随访数据之间的证据一致性，并强调按研究阶段区分实验结论与临床应用边界。当前信息仅用于演示推荐流程。",
      source: "生命科学专题库（原型）",
      sourceType: "专题知识库",
      sourceNote: "原型演示数据；医学相关内容不构成诊疗建议。",
      publishedAt: "2026-08-24T11:40:00+08:00",
      topic: "生物医学",
      tags: ["基因编辑", "CRISPR", "基因治疗", "生物伦理"],
      platformViews: 14780,
      isHot: true,
      hotReason: "跨学科讨论活跃"
    },
    {
      id: "news-ai-literature-evidence",
      order: 5,
      title: "人工智能辅助文献研读强调证据可追溯",
      summary: "科研团队正在完善引用定位、证据分级与人工确认机制，以降低自动摘要误差。",
      fullSummary: "科研团队正在完善引用定位、证据分级与人工确认机制，以降低自动摘要误差；系统输出需同时保留来源片段、版本信息和复核状态。当前信息为功能原型内容。",
      source: "科研工具观察（原型）",
      sourceType: "平台观察资讯",
      sourceNote: "原型演示数据；正式来源将在资讯接口接入后展示。",
      publishedAt: "2026-08-23T15:05:00+08:00",
      topic: "人工智能",
      tags: ["人工智能", "大语言模型", "文献研读", "证据追溯"],
      platformViews: 11650,
      isHot: false,
      hotReason: ""
    },
    {
      id: "news-quantum-network-test",
      order: 6,
      title: "量子网络测试推进跨节点协同验证",
      summary: "研究关注量子通信链路在不同节点条件下的稳定性、同步效率和安全验证。",
      fullSummary: "研究关注量子通信链路在不同节点条件下的稳定性、同步效率和安全验证，并逐步形成覆盖设备、协议和网络调度的联合测试方法。当前信息为功能原型内容。",
      source: "前沿通信观察（原型）",
      sourceType: "领域资讯汇编",
      sourceNote: "原型演示数据；正式上线后提供原文入口与采集校验信息。",
      publishedAt: "2026-08-22T10:25:00+08:00",
      topic: "量子计算",
      tags: ["量子计算", "量子通信", "量子网络", "量子信息"],
      platformViews: 9680,
      isHot: false,
      hotReason: ""
    },
    {
      id: "news-bci-standards",
      order: 7,
      title: "脑机接口研究加强数据治理与评测规范讨论",
      summary: "行业关注信号采集、隐私保护和跨机构评测的一致性，推动研究边界更加清晰。",
      fullSummary: "行业关注信号采集、隐私保护和跨机构评测的一致性，推动研究边界更加清晰；相关结论仍需结合样本规模、设备条件与伦理审查状态判断。当前信息为功能原型内容。",
      source: "未来技术观察（原型）",
      sourceType: "领域资讯汇编",
      sourceNote: "原型演示数据；不代表正式行业标准或监管结论。",
      publishedAt: "2026-08-21T17:15:00+08:00",
      topic: "脑机接口",
      tags: ["脑机接口", "数据治理", "评测规范", "科技伦理"],
      platformViews: 15120,
      isHot: true,
      hotReason: "政策与科研关注同步升温"
    },
    {
      id: "news-carbon-monitoring",
      order: 8,
      title: "碳排放监测研究转向多源数据交叉校验",
      summary: "研究尝试融合遥感、行业统计与现场观测信息，提升区域排放估算的可验证性。",
      fullSummary: "研究尝试融合遥感、行业统计与现场观测信息，提升区域排放估算的可验证性，同时明确数据时效、空间分辨率与模型假设带来的偏差。当前信息为功能原型内容。",
      source: "绿色发展专题库（原型）",
      sourceType: "专题知识库",
      sourceNote: "原型演示数据；正式统计结果应以权威发布为准。",
      publishedAt: "2026-08-20T08:45:00+08:00",
      topic: "碳中和",
      tags: ["碳中和", "碳排放", "遥感监测", "数据校验"],
      platformViews: 8420,
      isHot: false,
      hotReason: ""
    }
  ];
  const KEYWORD_SUGGESTIONS = [
    { keyword: "人工智能", trend: "+28%", followers: 234 },
    { keyword: "量子计算", trend: "+19%", followers: 189 },
    { keyword: "基因编辑", trend: "+17%", followers: 156 },
    { keyword: "固态电池", trend: "+14%", followers: 142 }
  ];
  const KNOWN_KEYWORDS = [
    "人工智能", "科学智能体", "大语言模型", "量子计算", "量子纠缠", "基因编辑", "固态电池",
    "ChatGPT", "CRISPR", "碳中和", "元宇宙", "新能源", "脑机接口", "区块链", "5G通信",
    "深度学习", "纳米材料", "Transformer", "LLM", "GPT-4", "强化学习", "迁移学习"
  ];
  const KEYWORD_RELATIONS = {
    "人工智能": ["大模型", "科研智能体", "机器学习"],
    "科学智能体": ["AI for Science", "科研工作流", "智能协作"],
    "量子计算": ["量子比特", "量子算法", "量子通信"],
    "量子纠缠": ["量子信息", "量子通信", "量子测量"],
    "基因编辑": ["CRISPR", "基因治疗", "生物伦理"],
    "CRISPR": ["基因编辑", "基因治疗", "生命科学"],
    "固态电池": ["界面材料", "电解质", "新能源"],
    "新能源": ["储能", "动力电池", "产业政策"]
  };

  const PROTOTYPE_REFERENCE_TIME = Date.parse("2026-08-27T12:00:00+08:00");
  const PAPER_STORAGE_KEY = "gkx-paper-recommendations-v1";
  const AUTHOR_STORAGE_KEY = "gkx-author-recommendations-v1";
  const REPORT_STORAGE_KEY = "gkx-report-recommendations-v1";
  const COURSE_STORAGE_KEY = "gkx-course-recommendations-v1";
  const EVENT_STORAGE_KEY = "gkx-event-recommendations-v1";
  const MODULE_PAGE_SIZE = 3;

  const AUTHORS = [
    { id: "author-lin", name: "林知远", institution: "鹏城实验室（原型）", field: "科学智能体", direction: "可验证智能科研工作流", hIndex: 42, papers: 86, citations: 12600 },
    { id: "author-zhou", name: "周若澜", institution: "量子科学中心（原型）", field: "量子信息", direction: "量子纠错与网络验证", hIndex: 36, papers: 72, citations: 8900 },
    { id: "author-chen", name: "陈方舟", institution: "先进材料研究院（原型）", field: "新能源材料", direction: "固态电池界面与失效机理", hIndex: 31, papers: 64, citations: 7100 },
    { id: "author-wu", name: "吴清禾", institution: "生命科学研究中心（原型）", field: "基因编辑", direction: "基因治疗证据与长期随访", hIndex: 39, papers: 79, citations: 10400 }
  ];

  const PAPER_ITEMS = [
    {
      id: "paper-agent-evidence", order: 1, title: "Evidence-grounded Scientific Agents for Reproducible Research Workflows",
      authors: ["林知远", "赵明玥", "何远"], authorIds: ["author-lin"], venue: "Scientific Intelligence Review（原型）", year: 2026,
      publishedAt: "2026-08-26T09:00:00+08:00", abstract: "提出面向科研任务的证据定位、人工复核与异常中止闭环，并通过原型任务验证流程可追溯性。",
      tags: ["科学智能体", "证据追溯", "可复现研究"], citations: 128, downloads: 2680, views: 9360, saves: 740, platformRating: 4.8, ratingCount: 326,
      citationKey: "Lin2026EvidenceAgents", volume: "4", issue: "3", pages: "21-38",
      reviewedComments: [{ id: "public-paper-1", author: "已认证研究用户（原型）", text: "方法部分对人工复核节点的描述很清楚。", createdAt: "2026-08-26T15:20:00+08:00" }]
    },
    {
      id: "paper-quantum-network", order: 2, title: "Cross-node Verification for Fault-tolerant Quantum Networks",
      authors: ["周若澜", "李申", "高予"], authorIds: ["author-zhou"], venue: "Quantum Systems Letters（原型）", year: 2026,
      publishedAt: "2026-08-24T14:10:00+08:00", abstract: "比较跨节点链路条件下的同步、纠错与安全验证开销，给出可复现实验配置。",
      tags: ["量子网络", "量子纠错", "容错计算"], citations: 96, downloads: 2140, views: 8420, saves: 680, platformRating: 4.7, ratingCount: 271,
      citationKey: "Zhou2026QuantumNetwork", volume: "12", issue: "2", pages: "67-82", reviewedComments: []
    },
    {
      id: "paper-battery-interface", order: 3, title: "Long-term Interface Stability in Sulfide Solid-state Batteries",
      authors: ["陈方舟", "宋柯", "于然"], authorIds: ["author-chen"], venue: "Advanced Energy Materials Practice（原型）", year: 2026,
      publishedAt: "2026-08-20T10:35:00+08:00", abstract: "从循环寿命和失效表征两端分析硫化物固态电池界面稳定性。",
      tags: ["固态电池", "界面材料", "失效分析"], citations: 173, downloads: 3010, views: 10560, saves: 820, platformRating: 4.6, ratingCount: 298,
      citationKey: "Chen2026SolidState", volume: "9", issue: "8", pages: "114-131", reviewedComments: []
    },
    {
      id: "paper-gene-followup", order: 4, title: "Longitudinal Evidence Assessment for CRISPR Gene Therapy",
      authors: ["吴清禾", "程澄", "M. Evans"], authorIds: ["author-wu"], venue: "Translational Genomics Evidence（原型）", year: 2026,
      publishedAt: "2026-08-12T16:20:00+08:00", abstract: "建立长期随访证据分级框架，区分疗效、脱靶风险与样本偏差。",
      tags: ["CRISPR", "基因治疗", "长期随访"], citations: 214, downloads: 4120, views: 13200, saves: 960, platformRating: 4.9, ratingCount: 451,
      citationKey: "Wu2026CRISPRFollowup", volume: "7", issue: "4", pages: "201-219", reviewedComments: []
    },
    {
      id: "paper-ai-literature", order: 5, title: "Traceable Literature Synthesis with Human-in-the-loop Validation",
      authors: ["林知远", "秦一"], authorIds: ["author-lin"], venue: "Knowledge Engineering Reports（原型）", year: 2026,
      publishedAt: "2026-07-18T11:00:00+08:00", abstract: "研究带来源片段的文献综合与人工确认机制，降低自动摘要中的证据漂移。",
      tags: ["文献研读", "人机协同", "引用定位"], citations: 352, downloads: 5960, views: 18800, saves: 1320, platformRating: 4.8, ratingCount: 528,
      citationKey: "Lin2026TraceableSynthesis", volume: "15", issue: "7", pages: "44-61", reviewedComments: []
    },
    {
      id: "paper-quantum-error", order: 6, title: "Resource-aware Quantum Error Correction under Noisy Operations",
      authors: ["周若澜", "杜衡"], authorIds: ["author-zhou"], venue: "Physical Computing Notes（原型）", year: 2026,
      publishedAt: "2026-05-09T08:45:00+08:00", abstract: "评估不同噪声水平下量子纠错方案的资源开销与可扩展边界。",
      tags: ["量子纠错", "噪声模型", "资源评估"], citations: 486, downloads: 7210, views: 21400, saves: 1810, platformRating: 4.7, ratingCount: 604,
      citationKey: "Zhou2026ResourceQEC", volume: "28", issue: "5", pages: "89-106", reviewedComments: []
    },
    {
      id: "paper-carbon-data", order: 7, title: "Multi-source Cross-validation for Regional Carbon Monitoring",
      authors: ["顾宁", "贺时"], authorIds: [], venue: "Climate Data Methods（原型）", year: 2025,
      publishedAt: "2025-11-21T13:00:00+08:00", abstract: "融合遥感、行业统计与现场观测，分析区域碳排放估算的不确定性。",
      tags: ["碳监测", "多源数据", "不确定性"], citations: 622, downloads: 8640, views: 25700, saves: 2040, platformRating: 4.6, ratingCount: 690,
      citationKey: "Gu2025CarbonValidation", volume: "18", issue: "11", pages: "301-322", reviewedComments: []
    },
    {
      id: "paper-bci-governance", order: 8, title: "A Governance-oriented Benchmark for Brain-computer Interface Data",
      authors: ["方简", "谢宁"], authorIds: [], venue: "Neurotechnology Governance（原型）", year: 2025,
      publishedAt: "2025-06-08T09:30:00+08:00", abstract: "提出覆盖隐私、数据质量和跨机构复核的脑机接口评测框架。",
      tags: ["脑机接口", "数据治理", "评测规范"], citations: 744, downloads: 9320, views: 28600, saves: 2380, platformRating: 4.5, ratingCount: 732,
      citationKey: "Fang2025BCIGovernance", volume: "6", issue: "2", pages: "12-29", reviewedComments: []
    }
  ];

  const AUTHOR_UPDATES = [
    { id: "update-lin-paper", authorId: "author-lin", type: "论文", title: "发布可验证科研智能体工作流研究（原型）", date: "2026-08-26T09:00:00+08:00", detail: "论文记录已进入原型文献库，包含证据追溯与人工复核流程。" },
    { id: "update-zhou-conference", authorId: "author-zhou", type: "会议信息", title: "将在量子信息研讨会报告跨节点验证进展（原型）", date: "2026-08-25T13:20:00+08:00", detail: "会议信息为原型记录，正式议程与入口尚未接入。" },
    { id: "update-lin-preprint", authorId: "author-lin", type: "预印本", title: "更新科研证据综合预印本版本（原型）", date: "2026-08-23T18:10:00+08:00", detail: "本条用于演示预印本版本动态，不提供未经核验的外链。" },
    { id: "update-zhou-career", authorId: "author-zhou", type: "科研经历", title: "新增量子网络联合验证项目经历（原型）", date: "2026-08-19T10:00:00+08:00", detail: "项目经历由原型人才库生成，待正式身份数据接入后核验。" },
    { id: "update-chen-paper", authorId: "author-chen", type: "论文", title: "新增固态电池界面稳定性成果（原型）", date: "2026-08-18T15:00:00+08:00", detail: "成果记录用于演示作者动态推荐。" }
  ];

  const RISING_STARS = [
    { name: "许星澈", institution: "鹏城青年科学家中心（原型）", field: "人工智能", direction: "科研智能体与知识检索", academicAge: 4, activity: 94, papers: 23, citations: 1320, hIndex: 17 },
    { name: "陆明珂", institution: "湾区量子研究院（原型）", field: "量子信息", direction: "量子网络与纠错", academicAge: 5, activity: 89, papers: 19, citations: 980, hIndex: 14 },
    { name: "苏以安", institution: "先进材料联合实验室（原型）", field: "先进材料", direction: "固态电解质界面", academicAge: 3, activity: 87, papers: 16, citations: 740, hIndex: 12 }
  ];

  const REPORT_ITEMS = [
    { id: "report-science-agent", title: "科学智能体协作模式观察（原型报告）", summary: "梳理科研智能体在检索、研读和实验协作环节的应用边界。", source: "平台报告中心（原型）", publishedAt: "2026-08-26T12:00:00+08:00", topics: ["人工智能", "科研工作流"], audiences: ["research", "innovation"], views: 18600, saves: 1420, likes: 980, relevance: 96 },
    { id: "report-quantum-policy", title: "量子信息技术验证路径专题（原型报告）", summary: "比较科研机构和创新主体在量子网络验证中的协同路径。", source: "前沿科技报告库（原型）", publishedAt: "2026-08-25T09:00:00+08:00", topics: ["量子信息", "政策"], audiences: ["government", "research"], views: 15200, saves: 1280, likes: 1120, relevance: 92 },
    { id: "report-battery-industry", title: "固态电池产业与科研进展（原型报告）", summary: "围绕材料体系、验证条件和产业协作进行结构化梳理。", source: "产业情报中心（原型）", publishedAt: "2026-08-24T15:30:00+08:00", topics: ["新能源", "固态电池"], audiences: ["government", "innovation"], views: 21300, saves: 1690, likes: 1380, relevance: 90 },
    { id: "report-biomed-evidence", title: "基因治疗长期证据治理（原型报告）", summary: "总结长期随访、伦理审查和风险沟通中的信息治理重点。", source: "生命科学报告库（原型）", publishedAt: "2026-08-21T11:00:00+08:00", topics: ["基因治疗", "证据治理"], audiences: ["government", "research"], views: 12600, saves: 1040, likes: 760, relevance: 88 },
    { id: "report-carbon-monitor", title: "区域碳监测多源数据方法（原型报告）", summary: "说明遥感与行业统计交叉校验的方法和数据时效边界。", source: "绿色发展报告库（原型）", publishedAt: "2026-08-18T08:30:00+08:00", topics: ["碳中和", "数据治理"], audiences: ["government", "research", "innovation"], views: 24600, saves: 1910, likes: 1520, relevance: 86 },
    { id: "report-bci-standard", title: "脑机接口评测规范研究（原型报告）", summary: "提炼跨机构评测、隐私保护和样本披露要求。", source: "未来技术报告库（原型）", publishedAt: "2026-08-11T16:00:00+08:00", topics: ["脑机接口", "评测规范"], audiences: ["research", "innovation"], views: 10800, saves: 880, likes: 920, relevance: 83 }
  ];

  const CONFERENCE_ITEMS = [
    { id: "conf-ai-science", title: "AI for Science Collaboration Forum 2026（原型）", level: "国际", startAt: "2026-09-12T09:00:00+08:00", endAt: "2026-09-14T18:00:00+08:00", deadlineAt: "2026-08-31T23:59:00+08:00", location: "深圳，中国", topics: ["科学智能体", "AI for Science"], submissions: 1860, attendees: 2400, heat: 92 },
    { id: "conf-quantum-network", title: "Quantum Network Verification Symposium（原型）", level: "国际", startAt: "2026-09-28T09:00:00+08:00", endAt: "2026-09-30T17:00:00+08:00", deadlineAt: "2026-08-20T23:59:00+08:00", location: "北京，中国", topics: ["量子网络", "量子纠错"], submissions: 980, attendees: 1350, heat: 86 },
    { id: "conf-energy-material", title: "Advanced Energy Materials Meeting（原型）", level: "领域顶会", startAt: "2026-10-18T09:00:00+08:00", endAt: "2026-10-21T17:00:00+08:00", deadlineAt: "2026-09-05T23:59:00+08:00", location: "新加坡", topics: ["固态电池", "界面材料"], submissions: 1560, attendees: 2100, heat: 84 },
    { id: "conf-genomics", title: "Translational Genomics Congress（原型）", level: "领域顶会", startAt: "2026-11-06T09:00:00+08:00", endAt: "2026-11-09T17:00:00+08:00", deadlineAt: "2026-08-15T23:59:00+08:00", location: "苏州，中国", topics: ["基因治疗", "长期随访"], submissions: 1220, attendees: 1880, heat: 88 },
    { id: "conf-climate-data", title: "Climate Data Methods Conference（原型）", level: "国际", startAt: "2026-07-10T09:00:00+08:00", endAt: "2026-07-12T17:00:00+08:00", deadlineAt: "2026-04-20T23:59:00+08:00", location: "线上与杭州", topics: ["碳监测", "多源数据"], submissions: 760, attendees: 1600, heat: 78 },
    { id: "conf-neuro-governance", title: "Neurotechnology Governance Workshop（原型）", level: "专题会议", startAt: "2026-06-21T09:00:00+08:00", endAt: "2026-06-22T17:00:00+08:00", deadlineAt: "2026-05-10T23:59:00+08:00", location: "上海，中国", topics: ["脑机接口", "科技伦理"], submissions: 540, attendees: 820, heat: 74 }
  ];

  const COURSE_ITEMS = [
    { id: "course-agent", title: "科学智能体与可验证科研工作流（原型课程）", publishedAt: "2026-08-22T09:00:00+08:00", duration: "8 周", summary: "从任务拆解、知识检索到证据复核，建立可追溯的科研智能体工作流。", match: 96, dimensions: { "搜索关注": 98, "浏览主题": 94, "收藏偏好": 92 }, tags: ["人工智能", "科研工作流"] },
    { id: "course-quantum", title: "量子网络与纠错验证导论（原型课程）", publishedAt: "2026-08-18T09:00:00+08:00", duration: "10 周", summary: "理解量子网络基本结构、噪声模型与纠错验证方法。", match: 91, dimensions: { "搜索关注": 93, "浏览主题": 89, "收藏偏好": 90 }, tags: ["量子计算", "量子网络"] },
    { id: "course-battery", title: "固态电池界面分析实践（原型课程）", publishedAt: "2026-08-10T09:00:00+08:00", duration: "6 周", summary: "结合材料表征与失效案例理解固态电池界面稳定性。", match: 87, dimensions: { "搜索关注": 84, "浏览主题": 91, "收藏偏好": 86 }, tags: ["固态电池", "先进材料"] },
    { id: "course-literature", title: "研究文献证据综合方法（原型课程）", publishedAt: "2026-07-28T09:00:00+08:00", duration: "5 周", summary: "训练问题规范化、来源定位、证据分级和规范引用。", match: 84, dimensions: { "搜索关注": 82, "浏览主题": 88, "收藏偏好": 81 }, tags: ["文献研读", "证据追溯"] },
    { id: "course-carbon", title: "碳监测多源数据分析（原型课程）", publishedAt: "2026-07-09T09:00:00+08:00", duration: "7 周", summary: "学习遥感、行业统计与现场观测数据的交叉校验。", match: 79, dimensions: { "搜索关注": 76, "浏览主题": 83, "收藏偏好": 78 }, tags: ["碳中和", "数据分析"] },
    { id: "course-governance", title: "前沿技术数据治理与伦理（原型课程）", publishedAt: "2026-06-16T09:00:00+08:00", duration: "4 周", summary: "覆盖脑机接口、基因编辑等场景的数据治理与伦理审查边界。", match: 75, dimensions: { "搜索关注": 72, "浏览主题": 79, "收藏偏好": 74 }, tags: ["数据治理", "科技伦理"] }
  ];

  const EVENT_ITEMS = [
    { id: "event-agent-forum", type: "论坛", title: "科学智能体产业协作论坛（原型）", organizer: "深圳科技活动平台（原型）", location: "深圳会展中心", startAt: "2026-09-06T09:00:00+08:00", endAt: "2026-09-06T17:00:00+08:00", registration: "open", themes: ["technology", "人工智能", "科研智能体"], summary: "讨论科学智能体在科研和产业协作中的可信落地路径。", reason: "匹配热点技术“科研智能体”及近期搜索关注", capacity: 500, registered: 342 },
    { id: "event-quantum-salon", type: "沙龙", title: "量子网络技术验证沙龙（原型）", organizer: "量子科学活动平台（原型）", location: "南山科技园", startAt: "2026-09-18T14:00:00+08:00", endAt: "2026-09-18T17:00:00+08:00", registration: "open", themes: ["technology", "量子网络", "产学研"], summary: "交流量子网络跨节点验证、纠错和产业协作进展。", reason: "匹配热点技术“量子网络”与关注领域", capacity: 80, registered: 65 },
    { id: "event-evidence-talk", type: "讲座", title: "科研证据可追溯方法讲座（原型）", organizer: "科研方法活动平台（原型）", location: "线上直播间（入口未接入）", startAt: "2026-08-30T15:00:00+08:00", endAt: "2026-08-30T17:00:00+08:00", registration: "open", themes: ["topic", "证据追溯", "文献研读"], summary: "分享来源定位、证据分级和人工复核的实践方法。", reason: "匹配热点话题“证据可追溯”", capacity: 300, registered: 214 },
    { id: "event-battery-roundtable", type: "圆桌", title: "固态电池界面安全圆桌（原型）", organizer: "先进材料活动平台（原型）", location: "光明科学城", startAt: "2026-10-12T14:00:00+08:00", endAt: "2026-10-12T17:00:00+08:00", registration: "planning", themes: ["topic", "固态电池", "安全边界"], summary: "围绕界面衰减、长期稳定性和评价口径开展讨论。", reason: "匹配热点话题“固态电池安全”", capacity: 120, registered: 0 },
    { id: "event-biomed-review", type: "思辨会", title: "基因治疗长期随访思辨会（原型）", organizer: "生物医药活动平台（原型）", location: "坪山生物医药产业基地", startAt: "2026-07-22T15:00:00+08:00", endAt: "2026-07-22T18:00:00+08:00", registration: "closed", themes: ["topic", "基因治疗", "长期随访"], summary: "讨论长期疗效、风险披露与伦理审查的证据要求。", reason: "往期关注话题记录", capacity: 120, registered: 112, record: "纪要涵盖长期随访指标、风险沟通和数据披露三项议题。原型回放资源尚未接入，当前不可播放。" },
    { id: "event-carbon-forum", type: "论坛", title: "多源碳监测方法论坛（原型）", organizer: "绿色发展活动平台（原型）", location: "福田国际会议中心", startAt: "2026-06-28T09:00:00+08:00", endAt: "2026-06-28T16:00:00+08:00", registration: "closed", themes: ["technology", "topic", "碳监测", "多源数据"], summary: "交流遥感与行业统计交叉校验方法。", reason: "往期热点技术与话题记录", capacity: 240, registered: 226, record: "纪要记录数据时效、空间分辨率和模型假设三类偏差。原型回放资源尚未接入，当前不可播放。" }
  ];

  const modeTabs = Array.from(document.querySelectorAll("[data-rec-search-mode]"));
  const modeSelect = document.getElementById("recSearchModeSelect");
  const searchForm = document.getElementById("recSearchForm");
  const searchInput = document.getElementById("recSearchInput");
  const searchGuide = document.getElementById("recSearchGuide");
  const searchFollowTip = document.getElementById("recSearchFollowTip");
  const mobileMenu = document.getElementById("recMobileMenu");
  const mainNav = document.getElementById("recMainNav");
  const contentNav = document.getElementById("recContentNav");
  const sectionLinks = Array.from(document.querySelectorAll("[data-section-link]"));
  const sections = Array.from(document.querySelectorAll("[data-rec-section]"));
  const toast = document.getElementById("recToast");
  const messageButton = document.getElementById("recMessageButton");
  const messageCount = document.getElementById("recMessageCount");
  const autoFollowCheckbox = document.getElementById("recAutoFollow");
  const keywordFollowStatus = document.getElementById("recAutoFollowHint");
  const keywordFollowGrid = document.getElementById("recKeywordFollowGrid");
  const newsTabs = Array.from(document.querySelectorAll("[data-news-mode]"));
  const newsGrid = document.getElementById("recNewsGrid") || document.querySelector(".rec-news-grid");
  const newsStatus = document.getElementById("recNewsStatus");
  const newsHistoryToggle = document.getElementById("recNewsHistoryToggle");
  const newsClearHistoryButton = document.getElementById("recNewsClearHistory");
  const newsMoreButton = document.getElementById("recNewsMore");
  const paperTabs = Array.from(document.querySelectorAll("[data-paper-mode]"));
  const paperStatus = document.getElementById("recPaperStatus");
  const paperTimeRange = document.getElementById("recPaperTimeRange");
  const paperSavedOnly = document.getElementById("recPaperSavedOnly");
  const paperList = document.getElementById("recPaperList");
  const paperMoreButton = document.getElementById("recPaperMore");
  const reportTabs = Array.from(document.querySelectorAll("[data-report-mode]"));
  const reportStatus = document.getElementById("recReportStatus");
  const reportRule = document.getElementById("recReportRule");
  const reportAudienceFilters = document.getElementById("recReportAudienceFilters");
  const reportGrid = document.getElementById("recReportGrid");
  const reportMoreButton = document.getElementById("recReportMore");
  const talentLibrary = document.getElementById("recTalentLibrary");
  const authorUpdatesStatus = document.getElementById("recAuthorUpdatesStatus");
  const authorUpdates = document.getElementById("recAuthorUpdates");
  const risingStars = document.getElementById("recRisingStars");
  const conferenceTabs = Array.from(document.querySelectorAll("[data-conference-mode]"));
  const conferenceStatus = document.getElementById("recConferenceStatus");
  const conferenceGrid = document.getElementById("recConferenceGrid");
  const conferenceMoreButton = document.getElementById("recConferenceMore");
  const courseStatus = document.getElementById("recCourseStatus");
  const courseGrid = document.getElementById("recCourseGrid");
  const courseMoreButton = document.getElementById("recCourseMore");
  const eventTabs = Array.from(document.querySelectorAll("[data-event-mode]"));
  const eventStatusNode = document.getElementById("recEventStatus");
  const eventGrid = document.getElementById("recEventGrid");
  const eventMoreButton = document.getElementById("recEventMore");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeMode = "ai";
  let toastTimer = 0;
  let prototypeStorageFallbackPending = false;
  let prototypeStorageFallbackTimer = 0;
  let watchState = null;
  let expandedWatchKey = "";
  let expandedUpdateId = "";
  let pendingRemovalKey = "";
  let pendingRemovalTimer = 0;
  let searchNavigationTimer = 0;
  let activeNewsMode = "latest";
  let newsVisibleCount = NEWS_PAGE_SIZE;
  let expandedNewsId = "";
  let newsViewState = null;
  let newsStorageWarningShown = false;
  const newsViewedThisSession = new Set();
  let paperState = null;
  let authorState = null;
  let reportState = null;
  let courseState = null;
  let eventState = null;
  let activePaperMode = "latest";
  let paperVisibleCount = MODULE_PAGE_SIZE;
  let expandedPaperId = "";
  let paperDetailIntent = "detail";
  const paperCitationModes = {};
  let activeReportMode = "latest";
  let activeReportAudience = "government";
  let reportVisibleCount = MODULE_PAGE_SIZE;
  let expandedReportId = "";
  const reportViewedThisSession = new Set();
  let expandedAuthorUpdateId = "";
  let activeConferenceMode = "recent";
  let conferenceVisibleCount = MODULE_PAGE_SIZE;
  let expandedConferenceId = "";
  let courseVisibleCount = MODULE_PAGE_SIZE;
  let expandedCourseId = "";
  let activeEventMode = "combined";
  let eventVisibleCount = MODULE_PAGE_SIZE;
  let expandedEventId = "";
  let expandedEventRecordId = "";

  newsMoreButton?.removeAttribute("data-demo-action");

  function hideToast() {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.hidden = true;
    toast.replaceChildren();
  }

  function showToast(message, action) {
    if (!toast || !message) return;
    if (prototypeStorageFallbackPending) {
      window.clearTimeout(prototypeStorageFallbackTimer);
      prototypeStorageFallbackPending = false;
      message += "；仅本次会话生效，浏览器未允许永久保存";
    }
    window.clearTimeout(toastTimer);
    toast.replaceChildren();

    const messageNode = document.createElement("span");
    messageNode.textContent = message;
    toast.appendChild(messageNode);

    if (action?.label && typeof action.onAction === "function") {
      const actionButton = document.createElement("button");
      actionButton.type = "button";
      actionButton.textContent = action.label;
      actionButton.addEventListener("click", function () {
        hideToast();
        action.onAction();
      }, { once: true });
      toast.appendChild(actionButton);
    }

    toast.hidden = false;
    toastTimer = window.setTimeout(hideToast, action ? 6500 : 2600);
  }

  function createElement(tagName, className, textContent) {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (textContent !== undefined) node.textContent = textContent;
    return node;
  }

  function uniqueValidIds(value, validIds) {
    return Array.from(new Set(Array.isArray(value) ? value.filter(function (id) { return validIds.has(id); }) : []));
  }

  function loadPrototypeState(storageKey, fallbackFactory, sanitize) {
    const fallback = fallbackFactory();
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== 1) return fallback;
      return sanitize(parsed, fallback);
    } catch (_error) {
      showToast("浏览器未允许读取本机功能状态；本次会话仍可使用");
      return fallback;
    }
  }

  function persistPrototypeState(storageKey, nextState, assign, silent) {
    assign(nextState);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextState));
      return true;
    } catch (_error) {
      if (!silent) {
        prototypeStorageFallbackPending = true;
        window.clearTimeout(prototypeStorageFallbackTimer);
        prototypeStorageFallbackTimer = window.setTimeout(function () {
          if (!prototypeStorageFallbackPending) return;
          prototypeStorageFallbackPending = false;
          showToast("操作已在本次会话生效；浏览器未允许永久保存");
        }, 0);
      }
      return false;
    }
  }

  function emptyPaperState() {
    return { version: 1, saved: [], ratings: {}, comments: {} };
  }

  function loadPaperState() {
    const ids = new Set(PAPER_ITEMS.map(function (item) { return item.id; }));
    return loadPrototypeState(PAPER_STORAGE_KEY, emptyPaperState, function (parsed) {
      const ratings = {};
      Object.keys(parsed.ratings || {}).forEach(function (id) {
        const rating = Math.round(Number(parsed.ratings[id]));
        if (ids.has(id) && rating >= 1 && rating <= 5) ratings[id] = rating;
      });
      const comments = {};
      Object.keys(parsed.comments || {}).forEach(function (id) {
        if (!ids.has(id) || !Array.isArray(parsed.comments[id])) return;
        comments[id] = parsed.comments[id].filter(function (comment) {
          return comment && typeof comment.id === "string" && typeof comment.text === "string";
        }).slice(-8).map(function (comment) {
          return {
            id: comment.id.slice(0, 80),
            text: comment.text.trim().slice(0, 300),
            createdAt: Number.isNaN(Date.parse(comment.createdAt)) ? new Date().toISOString() : comment.createdAt,
            status: "pending"
          };
        });
      });
      return { version: 1, saved: uniqueValidIds(parsed.saved, ids), ratings: ratings, comments: comments };
    });
  }

  function savePaperState(nextState, silent) {
    return persistPrototypeState(PAPER_STORAGE_KEY, nextState, function (value) { paperState = value; }, silent);
  }

  function emptyAuthorState() {
    return {
      version: 1,
      authors: {
        "author-lin": { following: true, everFollowed: true, dismissed: false },
        "author-zhou": { following: false, everFollowed: true, dismissed: false },
        "author-chen": { following: false, everFollowed: false, dismissed: false },
        "author-wu": { following: false, everFollowed: false, dismissed: false }
      }
    };
  }

  function loadAuthorState() {
    const fallback = emptyAuthorState();
    return loadPrototypeState(AUTHOR_STORAGE_KEY, emptyAuthorState, function (parsed) {
      const authors = {};
      AUTHORS.forEach(function (author) {
        const stored = parsed.authors?.[author.id];
        const base = fallback.authors[author.id];
        authors[author.id] = stored ? {
          following: stored.following === true,
          everFollowed: stored.everFollowed === true || stored.following === true,
          dismissed: stored.dismissed === true
        } : { ...base };
      });
      return { version: 1, authors: authors };
    });
  }

  function saveAuthorState(nextState, silent) {
    return persistPrototypeState(AUTHOR_STORAGE_KEY, nextState, function (value) { authorState = value; }, silent);
  }

  function emptyReportState() {
    return { version: 1, saved: [], liked: [], viewed: [] };
  }

  function loadReportState() {
    const ids = new Set(REPORT_ITEMS.map(function (item) { return item.id; }));
    return loadPrototypeState(REPORT_STORAGE_KEY, emptyReportState, function (parsed) {
      return {
        version: 1,
        saved: uniqueValidIds(parsed.saved, ids),
        liked: uniqueValidIds(parsed.liked, ids),
        viewed: uniqueValidIds(parsed.viewed, ids)
      };
    });
  }

  function saveReportState(nextState, silent) {
    return persistPrototypeState(REPORT_STORAGE_KEY, nextState, function (value) { reportState = value; }, silent);
  }

  function emptyCourseState() {
    return { version: 1, saved: [] };
  }

  function loadCourseState() {
    const ids = new Set(COURSE_ITEMS.map(function (item) { return item.id; }));
    return loadPrototypeState(COURSE_STORAGE_KEY, emptyCourseState, function (parsed) {
      return { version: 1, saved: uniqueValidIds(parsed.saved, ids) };
    });
  }

  function saveCourseState(nextState, silent) {
    return persistPrototypeState(COURSE_STORAGE_KEY, nextState, function (value) { courseState = value; }, silent);
  }

  function emptyEventState() {
    return { version: 1, registered: [] };
  }

  function loadEventState() {
    const ids = new Set(EVENT_ITEMS.filter(function (item) {
      return item.registration === "open" && Date.parse(item.endAt) > PROTOTYPE_REFERENCE_TIME;
    }).map(function (item) { return item.id; }));
    return loadPrototypeState(EVENT_STORAGE_KEY, emptyEventState, function (parsed) {
      return { version: 1, registered: uniqueValidIds(parsed.registered, ids) };
    });
  }

  function saveEventState(nextState, silent) {
    return persistPrototypeState(EVENT_STORAGE_KEY, nextState, function (value) { eventState = value; }, silent);
  }

  function formatPrototypeDate(value, includeTime) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "时间待核验";
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: includeTime ? "2-digit" : undefined,
      minute: includeTime ? "2-digit" : undefined,
      hour12: false
    }).format(date);
  }

  function formatPrototypeNumber(value) {
    return new Intl.NumberFormat("zh-CN").format(value);
  }

  function replaceModuleStatus(node, heading, detail) {
    if (!node) return;
    node.replaceChildren(createElement("strong", "", heading), createElement("span", "", detail));
  }

  function appendTags(parent, tags) {
    const wrapper = createElement("div", "rec-tags");
    tags.forEach(function (tag) { wrapper.appendChild(createElement("span", "", tag)); });
    parent.appendChild(wrapper);
    return wrapper;
  }

  function createMetricGrid(entries, className) {
    const grid = createElement("dl", "rec-metric-grid" + (className ? " " + className : ""));
    entries.forEach(function (entry) {
      const row = createElement("div");
      row.append(createElement("dt", "", entry[0]), createElement("dd", "", entry[1]));
      grid.appendChild(row);
    });
    return grid;
  }

  function findItem(items, id) {
    return items.find(function (item) { return item.id === id; }) || null;
  }

  function updateMoreButton(button, total, visibleCount, label) {
    if (!button) return;
    const hasMoreThanOnePage = total > MODULE_PAGE_SIZE;
    const showingAll = visibleCount >= total;
    button.hidden = !hasMoreThanOnePage;
    button.disabled = !hasMoreThanOnePage;
    button.textContent = showingAll ? "收起至前 " + MODULE_PAGE_SIZE + " 条" : "查看更多" + label;
    button.setAttribute("aria-expanded", String(hasMoreThanOnePage && showingAll));
  }

  function bindDedicatedTabs(tabs, dataKey, modes, setter) {
    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { setter(tab.dataset[dataKey], false); });
      tab.addEventListener("keydown", function (event) {
        let nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = tabs.length - 1;
        else return;
        event.preventDefault();
        const mode = tabs[nextIndex].dataset[dataKey];
        if (modes.includes(mode)) setter(mode, true);
      });
    });
  }

  function updateDedicatedTabs(tabs, dataKey, mode, panel, prefix, moveFocus) {
    let activeId = "";
    tabs.forEach(function (tab, index) {
      const selected = tab.dataset[dataKey] === mode;
      tab.id = tab.id || prefix + "-tab-" + index;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (panel) tab.setAttribute("aria-controls", panel.id);
      if (selected) activeId = tab.id;
    });
    if (panel) {
      panel.setAttribute("role", "tabpanel");
      if (activeId) panel.setAttribute("aria-labelledby", activeId);
    }
    if (moveFocus) tabs.find(function (tab) { return tab.dataset[dataKey] === mode; })?.focus();
  }

  function focusRenderedControl(container, selector) {
    window.requestAnimationFrame(function () { container?.querySelector(selector)?.focus(); });
  }

  function emptyNewsViewState() {
    return { version: 1, enabled: true, records: {} };
  }

  function notifyNewsStorageFailure() {
    if (newsStorageWarningShown) return;
    newsStorageWarningShown = true;
    showToast("浏览器未允许保存浏览记录；本次会话仍可正常使用");
  }

  function copyNewsRecords(records) {
    return Object.keys(records || {}).reduce(function (result, id) {
      const record = records[id];
      if (record) result[id] = { count: record.count, lastViewedAt: record.lastViewedAt };
      return result;
    }, {});
  }

  function loadNewsViewState() {
    const fallback = emptyNewsViewState();
    try {
      const raw = window.localStorage.getItem(NEWS_VIEW_STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== 1) return fallback;
      const validIds = new Set(NEWS_ITEMS.map(function (item) { return item.id; }));
      const records = Object.keys(parsed.records || {}).reduce(function (result, id) {
        const record = parsed.records[id];
        const count = Math.floor(Number(record?.count));
        if (!validIds.has(id) || !Number.isFinite(count) || count < 1) return result;
        result[id] = {
          count: count,
          lastViewedAt: Number.isNaN(Date.parse(record.lastViewedAt)) ? "" : record.lastViewedAt
        };
        return result;
      }, {});
      return { version: 1, enabled: parsed.enabled !== false, records: records };
    } catch (_error) {
      notifyNewsStorageFailure();
      return fallback;
    }
  }

  function saveNewsViewState(nextState, notifyFailure) {
    newsViewState = nextState;
    try {
      window.localStorage.setItem(NEWS_VIEW_STORAGE_KEY, JSON.stringify(nextState));
      return true;
    } catch (_error) {
      if (notifyFailure !== false) notifyNewsStorageFailure();
      return false;
    }
  }

  function sortNewsByPublishedAt(items) {
    return items.slice().sort(function (left, right) {
      const timeDifference = Date.parse(right.publishedAt) - Date.parse(left.publishedAt);
      return timeDifference || left.order - right.order;
    });
  }

  function getNewsInterestTopics() {
    const topics = [];
    const seen = new Set();
    const storedWatches = watchState?.watches || [];

    DEFAULT_NEWS_INTERESTS.map(function (keyword) {
      return { keyword: keyword, source: "默认关注" };
    }).concat(storedWatches.map(function (watch) {
      return { keyword: watch.keyword, source: "词汇关注" };
    })).forEach(function (interest) {
        const keyword = interest.keyword;
        const normalized = normalizeKeyword(keyword);
        const key = keywordKey(normalized);
        if (!normalized || seen.has(key)) return;
        seen.add(key);
        topics.push({ keyword: normalized, source: interest.source });
      });

    return topics;
  }

  function matchingInterestForNews(item) {
    const searchable = [item.title, item.summary, item.topic].concat(item.tags).join(" ").toLocaleLowerCase("zh-CN");
    return getNewsInterestTopics().find(function (interest) {
      const candidates = [interest.keyword].concat(relatedTagsFor(interest.keyword));
      return candidates.some(function (candidate) {
        const normalizedCandidate = normalizeKeyword(candidate).toLocaleLowerCase("zh-CN");
        return normalizedCandidate && searchable.includes(normalizedCandidate);
      });
    }) || null;
  }

  function getFollowedNews() {
    return sortNewsByPublishedAt(NEWS_ITEMS.filter(function (item) {
      return Boolean(matchingInterestForNews(item));
    }));
  }

  function getNewsItems(mode) {
    if (mode === "hot") {
      return sortNewsByPublishedAt(NEWS_ITEMS.filter(function (item) { return item.isHot; }));
    }
    if (mode === "following") return getFollowedNews();
    return sortNewsByPublishedAt(NEWS_ITEMS);
  }

  function formatNewsPublishedAt(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "时间待核验";
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(date);
  }

  function formatNewsLocalTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "时间待核验";
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(date);
  }

  function createNewsLabeledValue(label, value, className) {
    const wrapper = createElement("span", className || "");
    wrapper.append(
      createElement("span", "rec-news-field-label", label),
      createElement("span", "", value)
    );
    return wrapper;
  }

  function newsRecommendationReason(item) {
    if (activeNewsMode === "hot") return item.hotReason || "近期关注度较高";
    if (activeNewsMode === "following") {
      const interest = matchingInterestForNews(item);
      return interest ? "因关注“" + interest.keyword + "”推荐" : "匹配关注领域";
    }
    return "按发布时间推荐";
  }

  function newsLocalStateText(record) {
    if (!newsViewState?.enabled) {
      return record ? "本机记录已关闭 · 已有 " + record.count + " 次" : "本机记录已关闭";
    }
    return record ? "本机已查看 " + record.count + " 次" : "本机尚未查看";
  }

  function createNewsCard(item, index) {
    const expanded = expandedNewsId === item.id;
    const record = newsViewState?.records[item.id] || null;
    const article = createElement("article", "rec-news-card" + (expanded ? " is-expanded" : ""));
    article.dataset.newsId = item.id;
    article.setAttribute("aria-labelledby", "rec-news-heading-" + item.id);

    const accent = createElement("div", "rec-news-accent", String(index + 1).padStart(2, "0"));
    accent.setAttribute("aria-hidden", "true");
    const content = createElement("div", "rec-news-content");
    const topline = createElement("div", "rec-news-card-topline");
    topline.append(
      createElement("span", "rec-resource-status", "原型资讯"),
      createElement("span", "rec-news-reason", newsRecommendationReason(item))
    );

    const heading = createElement("h3", "", item.title);
    heading.id = "rec-news-heading-" + item.id;

    const summary = createElement("div", "rec-news-summary");
    summary.append(
      createElement("span", "rec-news-field-label", "摘要"),
      createElement("p", "", expanded ? item.fullSummary : item.summary)
    );

    const sourceLine = createElement("div", "rec-news-source-line");
    sourceLine.append(
      createElement("span", "rec-news-field-label", "来源"),
      createElement("span", "", item.source)
    );

    const meta = createElement("div", "rec-news-meta");
    const published = createElement("span");
    published.appendChild(createElement("span", "rec-news-field-label", "发布时间"));
    const time = createElement("time", "", formatNewsPublishedAt(item.publishedAt));
    time.dateTime = item.publishedAt;
    published.appendChild(time);
    meta.append(
      published,
      createNewsLabeledValue("领域", item.topic),
      createNewsLabeledValue("平台浏览量", new Intl.NumberFormat("zh-CN").format(item.platformViews) + " 次"),
      createElement("span", "rec-news-local-state" + (record ? " is-viewed" : ""), newsLocalStateText(record))
    );

    const detailId = "rec-news-detail-" + item.id;
    const actions = createElement("div", "rec-news-actions");
    const toggleButton = createElement("button", "rec-news-toggle", expanded ? "收起完整摘要" : "查看完整摘要");
    toggleButton.type = "button";
    toggleButton.dataset.newsToggle = item.id;
    toggleButton.setAttribute("aria-expanded", String(expanded));
    toggleButton.setAttribute("aria-controls", detailId);
    toggleButton.setAttribute("aria-label", (expanded ? "收起“" : "展开“") + item.title + "”完整摘要与浏览记录");
    actions.appendChild(toggleButton);

    content.append(topline, heading, summary, sourceLine, meta, actions);

    const detail = createElement("div", "rec-news-detail");
    detail.id = detailId;
    detail.hidden = !expanded;
    detail.setAttribute("role", "region");
    detail.setAttribute("aria-labelledby", heading.id);
    detail.append(
      createElement("p", "", "来源类型：" + item.sourceType),
      createElement("p", "", "来源说明：" + item.sourceNote)
    );
    const localHistory = createElement("div", "rec-news-local-history");
    localHistory.appendChild(createElement("strong", "", "本机浏览记录"));
    if (!newsViewState.enabled) {
      localHistory.appendChild(createElement(
        "p",
        "",
        record
          ? "记录功能已关闭；已有 " + record.count + " 次记录，最近查看于 " + formatNewsLocalTime(record.lastViewedAt) + "。"
          : "记录功能已关闭，本次展开不会写入浏览记录。"
      ));
    } else if (record) {
      localHistory.appendChild(createElement(
        "p",
        "",
        "已在本机查看 " + record.count + " 次，最近查看于 " + formatNewsLocalTime(record.lastViewedAt) + "。"
      ));
    } else {
      localHistory.appendChild(createElement("p", "", "尚无本机浏览记录。"));
    }
    localHistory.appendChild(createElement("small", "", "记录仅保存在当前浏览器，不会同步到账号。"));
    detail.appendChild(localHistory);
    content.appendChild(detail);

    article.append(accent, content);
    return article;
  }

  function updateNewsControls(items) {
    if (newsHistoryToggle && newsViewState) newsHistoryToggle.checked = newsViewState.enabled;
    if (newsClearHistoryButton) {
      const hasRecords = Object.keys(newsViewState?.records || {}).length > 0;
      newsClearHistoryButton.hidden = !hasRecords;
      newsClearHistoryButton.disabled = !hasRecords;
    }

    if (newsMoreButton) {
      const hasMoreThanOnePage = items.length > NEWS_PAGE_SIZE;
      const showingAll = newsVisibleCount >= items.length;
      newsMoreButton.hidden = !hasMoreThanOnePage;
      newsMoreButton.textContent = showingAll ? "收起至前 " + NEWS_PAGE_SIZE + " 条" : "查看更多资讯";
      newsMoreButton.setAttribute("aria-expanded", String(hasMoreThanOnePage && showingAll));
    }
  }

  function renderNewsRecommendations() {
    if (!newsGrid || !newsViewState) return;
    const items = getNewsItems(activeNewsMode);
    const visibleItems = items.slice(0, newsVisibleCount);
    newsGrid.setAttribute("aria-busy", "true");
    newsGrid.replaceChildren();

    if (visibleItems.length === 0) {
      const empty = createElement("div", "rec-news-empty");
      empty.append(
        createElement("strong", "", "暂无匹配的关注领域资讯"),
        createElement("p", "", "可以在词汇关注中新增研究主题，系统会据此更新关注领域资讯。")
      );
      const manageButton = createElement("button", "", "管理词汇关注");
      manageButton.type = "button";
      manageButton.dataset.newsManageFollows = "true";
      empty.appendChild(manageButton);
      newsGrid.appendChild(empty);
    } else {
      visibleItems.forEach(function (item, index) {
        newsGrid.appendChild(createNewsCard(item, index));
      });
    }

    if (newsStatus) {
      const modeLabel = ({ latest: "最新资讯", hot: "热门资讯", following: "关注领域资讯" })[activeNewsMode];
      const interestSuffix = activeNewsMode === "following"
        ? " · 关注 " + getNewsInterestTopics().map(function (interest) { return interest.keyword; }).join("、")
        : "";
      newsStatus.replaceChildren(
        createElement("strong", "", modeLabel),
        createElement("span", "", "当前显示 " + visibleItems.length + " / 共 " + items.length + " 条 · 按发布时间倒序" + interestSuffix)
      );
    }

    updateNewsControls(items);
    newsGrid.setAttribute("aria-busy", "false");
  }

  function focusNewsToggle(itemId) {
    window.requestAnimationFrame(function () {
      const button = Array.from(newsGrid?.querySelectorAll("[data-news-toggle]") || []).find(function (node) {
        return node.dataset.newsToggle === itemId;
      });
      button?.focus();
    });
  }

  function recordNewsView(itemId) {
    if (!newsViewState?.enabled) return false;
    const previous = newsViewState.records[itemId] || { count: 0, lastViewedAt: "" };
    const firstViewThisSession = !newsViewedThisSession.has(itemId);
    const nextRecord = {
      count: previous.count + (firstViewThisSession ? 1 : 0),
      lastViewedAt: new Date().toISOString()
    };
    newsViewedThisSession.add(itemId);
    return saveNewsViewState({
      ...newsViewState,
      records: { ...newsViewState.records, [itemId]: nextRecord }
    });
  }

  function restoreNewsViewHistory(snapshot) {
    const currentRecords = newsViewState?.records || {};
    const mergedRecords = copyNewsRecords(snapshot.records);
    Object.keys(currentRecords).forEach(function (id) {
      const current = currentRecords[id];
      const previous = mergedRecords[id];
      if (!previous) {
        mergedRecords[id] = { ...current };
        return;
      }
      mergedRecords[id] = {
        count: previous.count + current.count,
        lastViewedAt: Number.isNaN(Date.parse(previous.lastViewedAt))
          || Date.parse(current.lastViewedAt) > Date.parse(previous.lastViewedAt)
          ? current.lastViewedAt
          : previous.lastViewedAt
      };
    });

    snapshot.viewedIds.forEach(function (id) { newsViewedThisSession.add(id); });
    const persisted = saveNewsViewState({ ...newsViewState, records: mergedRecords }, false);
    renderNewsRecommendations();
    showToast(persisted ? "已恢复本机浏览记录" : "已在本次会话恢复；浏览器未允许永久保存");
  }

  function clearNewsViewHistory() {
    if (!newsViewState || Object.keys(newsViewState.records).length === 0) {
      showToast("暂无可清除的本机浏览记录");
      return;
    }
    const snapshot = {
      records: copyNewsRecords(newsViewState.records),
      viewedIds: Array.from(newsViewedThisSession)
    };
    newsViewedThisSession.clear();
    const persisted = saveNewsViewState({ ...newsViewState, records: {} }, false);
    renderNewsRecommendations();
    showToast(persisted ? "已清除本机浏览记录" : "已在本次会话清除；浏览器未允许永久保存", {
      label: "撤销",
      onAction: function () { restoreNewsViewHistory(snapshot); }
    });
  }

  function setNewsMode(mode, moveFocus) {
    const nextMode = ["latest", "hot", "following"].includes(mode) ? mode : "latest";
    if (activeNewsMode !== nextMode) {
      activeNewsMode = nextMode;
      newsVisibleCount = NEWS_PAGE_SIZE;
      expandedNewsId = "";
    }

    let activeTabId = "";
    newsTabs.forEach(function (tab, index) {
      const selected = tab.dataset.newsMode === nextMode;
      tab.id = tab.id || "rec-news-tab-" + index;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.setAttribute("aria-controls", newsGrid?.id || "recNewsGrid");
      tab.tabIndex = selected ? 0 : -1;
      if (selected) activeTabId = tab.id;
    });
    if (newsGrid) {
      newsGrid.id = newsGrid.id || "recNewsGrid";
      newsGrid.setAttribute("role", "tabpanel");
      if (activeTabId) newsGrid.setAttribute("aria-labelledby", activeTabId);
    }
    renderNewsRecommendations();
    if (moveFocus) newsTabs.find(function (tab) { return tab.dataset.newsMode === nextMode; })?.focus();
  }

  function paperAuthorReason(item) {
    const authorId = item.authorIds.find(function (id) {
      const state = authorState?.authors[id];
      return state && !state.dismissed && (state.following || state.everFollowed);
    });
    if (!authorId) return "";
    const author = AUTHORS.find(function (candidate) { return candidate.id === authorId; });
    const state = authorState.authors[authorId];
    return (state.following ? "因当前关注作者“" : "因曾关注作者“") + author.name + "”推荐";
  }

  function paperHotScore(item) {
    const views = item.views / Math.max.apply(null, PAPER_ITEMS.map(function (paper) { return paper.views; }));
    const saves = item.saves / Math.max.apply(null, PAPER_ITEMS.map(function (paper) { return paper.saves; }));
    const citations = item.citations / Math.max.apply(null, PAPER_ITEMS.map(function (paper) { return paper.citations; }));
    return views * 0.4 + saves * 0.35 + citations * 0.25;
  }

  function getPaperItems() {
    let items = PAPER_ITEMS.slice();
    if (activePaperMode === "following") {
      items = items.filter(function (item) { return Boolean(paperAuthorReason(item)); });
    }
    const range = paperTimeRange?.value || "all";
    const rangeDays = Number(range);
    if (range !== "all" && Number.isFinite(rangeDays)) {
      items = items.filter(function (item) {
        const age = (PROTOTYPE_REFERENCE_TIME - Date.parse(item.publishedAt)) / 86400000;
        return age >= 0 && age <= rangeDays;
      });
    }
    if (paperSavedOnly?.checked) {
      items = items.filter(function (item) { return paperState.saved.includes(item.id); });
    }
    return items.sort(function (left, right) {
      if (activePaperMode === "hot") {
        return paperHotScore(right) - paperHotScore(left) || Date.parse(right.publishedAt) - Date.parse(left.publishedAt);
      }
      return Date.parse(right.publishedAt) - Date.parse(left.publishedAt) || left.order - right.order;
    });
  }

  function paperCitationText(item, mode) {
    if (mode === "bib") {
      return "@article{" + item.citationKey + ",\n"
        + "  title = {" + item.title + "},\n"
        + "  author = {" + item.authors.join(" and ") + "},\n"
        + "  journal = {" + item.venue + "},\n"
        + "  year = {" + item.year + "},\n"
        + "  volume = {" + item.volume + "},\n"
        + "  number = {" + item.issue + "},\n"
        + "  pages = {" + item.pages + "}\n}";
    }
    return item.authors.join(", ") + ". " + item.title + "[J]. " + item.venue + ", "
      + item.year + ", " + item.volume + "(" + item.issue + "): " + item.pages + ".";
  }

  async function copyTextWithFallback(text, container) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      showToast("引用文本已复制");
      return;
    } catch (_error) {
      const fallback = createElement("textarea", "rec-citation-fallback");
      fallback.value = text;
      fallback.setAttribute("aria-label", "引用文本，请手动复制");
      container?.appendChild(fallback);
      fallback.focus();
      fallback.select();
      let copied = false;
      try { copied = document.execCommand("copy"); } catch (_copyError) { copied = false; }
      showToast(copied ? "引用文本已复制" : "自动复制不可用，已选中文本，请手动复制");
    }
  }

  function createPaperCitation(item) {
    const mode = paperCitationModes[item.id] || "bib";
    const panelId = "rec-paper-citation-panel-" + item.id;
    let activeTabId = "";
    const wrapper = createElement("section", "rec-paper-citation");
    wrapper.id = "rec-paper-citation-" + item.id;
    wrapper.setAttribute("aria-label", "规范引用");
    wrapper.appendChild(createElement("h4", "", "规范引用"));
    const tabs = createElement("div", "rec-citation-tabs");
    tabs.setAttribute("role", "tablist");
    [["bib", "BIB · BibTeX"], ["cite", "CITE · GB/T 7714"]].forEach(function (entry) {
      const button = createElement("button", mode === entry[0] ? "is-active" : "", entry[1]);
      button.type = "button";
      button.dataset.paperCitationMode = entry[0];
      button.dataset.paperId = item.id;
      button.id = "rec-paper-citation-tab-" + item.id + "-" + entry[0];
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(mode === entry[0]));
      button.setAttribute("aria-controls", panelId);
      button.tabIndex = mode === entry[0] ? 0 : -1;
      if (mode === entry[0]) activeTabId = button.id;
      tabs.appendChild(button);
    });
    const text = paperCitationText(item, mode);
    const pre = createElement("pre", "rec-paper-citation-text", text);
    pre.id = panelId;
    pre.setAttribute("role", "tabpanel");
    pre.setAttribute("aria-labelledby", activeTabId);
    pre.tabIndex = 0;
    const copy = createElement("button", "", "复制引用文本");
    copy.type = "button";
    copy.dataset.paperCopyCitation = item.id;
    copy.dataset.citationText = text;
    wrapper.append(tabs, pre, copy, createElement("small", "", "本条原型记录没有可核验 DOI，因此引用中不生成 DOI 字段。"));
    return wrapper;
  }

  function createPaperRating(item) {
    const wrapper = createElement("section", "rec-rating-fieldset");
    wrapper.id = "rec-paper-rating-" + item.id;
    wrapper.appendChild(createElement("h4", "", "评分"));
    wrapper.appendChild(createElement("p", "", "平台评分 " + item.platformRating.toFixed(1) + " / 5（" + formatPrototypeNumber(item.ratingCount) + " 人）"));
    const fieldset = createElement("fieldset");
    fieldset.appendChild(createElement("legend", "", "我的评分，与平台评分分开记录"));
    for (let rating = 1; rating <= 5; rating += 1) {
      const label = createElement("label");
      const input = createElement("input");
      input.type = "radio";
      input.name = "paper-rating-" + item.id;
      input.value = String(rating);
      input.dataset.paperRating = item.id;
      input.checked = paperState.ratings[item.id] === rating;
      label.append(input, createElement("span", "", rating + " 分"));
      fieldset.appendChild(label);
    }
    const clear = createElement("button", "", "清除我的评分");
    clear.type = "button";
    clear.dataset.paperClearRating = item.id;
    clear.disabled = !paperState.ratings[item.id];
    wrapper.append(fieldset, clear, createElement("small", "", "评分仅保存在当前浏览器的原型状态中。"));
    return wrapper;
  }

  function createPaperComments(item) {
    const wrapper = createElement("section", "rec-paper-comments");
    wrapper.id = "rec-paper-comments-" + item.id;
    wrapper.appendChild(createElement("h4", "", "评论"));
    const list = createElement("div", "rec-comment-list");
    item.reviewedComments.forEach(function (comment) {
      const article = createElement("article");
      article.append(
        createElement("strong", "", comment.author),
        createElement("span", "rec-moderation-state is-approved", "已审核 · 公开可见"),
        createElement("p", "", comment.text),
        createElement("time", "", formatPrototypeDate(comment.createdAt, true))
      );
      list.appendChild(article);
    });
    (paperState.comments[item.id] || []).forEach(function (comment) {
      const article = createElement("article", "is-own-comment");
      article.append(
        createElement("strong", "", "我的评论"),
        createElement("span", "rec-moderation-state is-pending", "待审核 · 仅本人可见"),
        createElement("p", "", comment.text),
        createElement("time", "", formatPrototypeDate(comment.createdAt, true))
      );
      const withdraw = createElement("button", "", "撤回评论");
      withdraw.type = "button";
      withdraw.dataset.paperWithdrawComment = item.id;
      withdraw.dataset.commentId = comment.id;
      article.appendChild(withdraw);
      list.appendChild(article);
    });
    if (!list.children.length) list.appendChild(createElement("p", "rec-empty-state", "暂无已审核公开评论。"));
    const form = createElement("form", "rec-comment-form");
    form.dataset.paperCommentForm = item.id;
    const label = createElement("label", "", "发表评论（5–300 字）");
    const textarea = createElement("textarea");
    textarea.name = "comment";
    textarea.maxLength = 300;
    textarea.required = true;
    textarea.rows = 3;
    textarea.placeholder = "请围绕文献内容理性交流";
    label.appendChild(textarea);
    const submit = createElement("button", "", "提交审核");
    submit.type = "submit";
    form.append(label, submit, createElement("small", "", "提交后先进入待审核状态，仅你本人可见；不会自动公开。"));
    wrapper.append(list, form);
    return wrapper;
  }

  function createPaperDetail(item) {
    const detail = createElement("div", "rec-paper-detail");
    detail.id = "rec-paper-detail-" + item.id;
    detail.append(
      createElement("h4", "", "文献信息"),
      createElement("p", "", item.abstract),
      createMetricGrid([
        ["完整发布日期", formatPrototypeDate(item.publishedAt, true)],
        ["来源", item.venue],
        ["作者", item.authors.join("、")]
      ])
    );
    detail.append(createPaperCitation(item), createPaperRating(item), createPaperComments(item));
    return detail;
  }

  function createPaperCard(item, index) {
    const expanded = expandedPaperId === item.id;
    const saved = paperState.saved.includes(item.id);
    const article = createElement("article", "rec-paper-card" + (expanded ? " is-expanded" : ""));
    article.dataset.paperId = item.id;
    const rank = createElement("span", "rec-paper-rank", String(index + 1));
    const content = createElement("div", "rec-paper-content");
    const reason = activePaperMode === "hot"
      ? "综合热度 " + Math.round(paperHotScore(item) * 100) + " 分"
      : activePaperMode === "following" ? paperAuthorReason(item) : "按发表时间倒序";
    content.append(
      createElement("span", "rec-recommendation-reason", reason),
      createElement("h3", "", item.title),
      createElement("p", "rec-paper-author", item.authors.join("、")),
      createElement("p", "rec-paper-source", item.venue + " · " + formatPrototypeDate(item.publishedAt, false)),
      createElement("p", "rec-paper-abstract", item.abstract)
    );
    appendTags(content, item.tags);
    content.appendChild(createMetricGrid([
      ["引用", formatPrototypeNumber(item.citations)],
      ["下载", formatPrototypeNumber(item.downloads)],
      ["平台评分", item.platformRating.toFixed(1)]
    ]));
    const actions = createElement("div", "rec-paper-actions");
    [["detail", expanded ? "收起" : "查阅"], ["citation", "引用"], ["rating", "评分"], ["comments", "评论"]].forEach(function (entry) {
      const button = createElement("button", "", entry[1]);
      button.type = "button";
      button.dataset.paperAction = entry[0];
      button.dataset.paperId = item.id;
      if (entry[0] === "detail") button.setAttribute("aria-expanded", String(expanded));
      actions.appendChild(button);
    });
    const save = createElement("button", saved ? "is-saved" : "", saved ? "已收藏" : "收藏");
    save.type = "button";
    save.dataset.paperSave = item.id;
    save.setAttribute("aria-pressed", String(saved));
    actions.insertBefore(save, actions.children[1]);
    content.appendChild(actions);
    if (expanded) content.appendChild(createPaperDetail(item));
    article.append(rank, content);
    return article;
  }

  function renderPapers() {
    if (!paperList || !paperState || !authorState) return;
    const items = getPaperItems();
    const visible = items.slice(0, paperVisibleCount);
    paperList.setAttribute("aria-busy", "true");
    paperList.replaceChildren();
    if (!visible.length) {
      const empty = createElement("div", "rec-empty-state");
      empty.append(
        createElement("strong", "", paperSavedOnly?.checked ? "暂无符合条件的收藏文献" : "暂无符合条件的关注作者文献"),
        createElement("p", "", paperSavedOnly?.checked ? "关闭“只看收藏”或调整时间范围后可恢复列表。" : "可以前往人才库关注作者，或恢复曾关注作者的推荐。")
      );
      const recover = createElement("button", "", paperSavedOnly?.checked ? "显示全部文献" : "前往人才库");
      recover.type = "button";
      recover.dataset.paperRecover = paperSavedOnly?.checked ? "all" : "talent";
      empty.appendChild(recover);
      paperList.appendChild(empty);
    } else {
      visible.forEach(function (item, index) { paperList.appendChild(createPaperCard(item, index)); });
    }
    const modeLabel = ({ latest: "最新文献推荐", hot: "热门文献推荐", following: "关注作者文献推荐" })[activePaperMode];
    const sortLabel = activePaperMode === "hot" ? "按独立综合热度排序" : "按发表时间倒序";
    replaceModuleStatus(paperStatus, modeLabel, "当前显示 " + visible.length + " / 共 " + items.length + " 条 · " + sortLabel);
    updateMoreButton(paperMoreButton, items.length, paperVisibleCount, "文献");
    paperList.setAttribute("aria-busy", "false");
  }

  function setPaperMode(mode, moveFocus) {
    const next = ["latest", "hot", "following"].includes(mode) ? mode : "latest";
    if (next !== activePaperMode) {
      activePaperMode = next;
      paperVisibleCount = MODULE_PAGE_SIZE;
      expandedPaperId = "";
    }
    updateDedicatedTabs(paperTabs, "paperMode", next, paperList, "rec-paper", moveFocus);
    renderPapers();
  }

  function togglePaperSave(id) {
    const saved = paperState.saved.includes(id);
    const nextSaved = saved ? paperState.saved.filter(function (itemId) { return itemId !== id; }) : paperState.saved.concat(id);
    savePaperState({ ...paperState, saved: nextSaved });
    renderPapers();
    showToast(saved ? "已取消收藏文献" : "已收藏文献", {
      label: "撤销",
      onAction: function () {
        savePaperState({
          ...paperState,
          saved: saved ? Array.from(new Set(paperState.saved.concat(id))) : paperState.saved.filter(function (itemId) { return itemId !== id; })
        });
        renderPapers();
      }
    });
  }

  function freshnessScore(value, horizonDays) {
    const age = Math.max(0, (PROTOTYPE_REFERENCE_TIME - Date.parse(value)) / 86400000);
    return Math.max(0, 1 - age / horizonDays);
  }

  function reportPopularityScore(item) {
    const maxViews = Math.max.apply(null, REPORT_ITEMS.map(function (report) { return report.views; }));
    const maxSaves = Math.max.apply(null, REPORT_ITEMS.map(function (report) { return report.saves; }));
    const maxLikes = Math.max.apply(null, REPORT_ITEMS.map(function (report) { return report.likes; }));
    const popularity = item.views / maxViews * 0.4 + item.saves / maxSaves * 0.35 + item.likes / maxLikes * 0.25;
    return popularity * 0.85 + freshnessScore(item.publishedAt, 30) * 0.15;
  }

  function reportCompositeScore(item) {
    return freshnessScore(item.publishedAt, 30) * 0.5
      + reportPopularityScore(item) * 0.35
      + item.relevance / 100 * 0.15;
  }

  function getReportItems() {
    let items = REPORT_ITEMS.slice();
    if (activeReportMode === "exclusive") {
      items = items.filter(function (item) { return item.audiences.includes(activeReportAudience); });
    }
    return items.sort(function (left, right) {
      if (activeReportMode === "hot") {
        return reportPopularityScore(right) - reportPopularityScore(left) || Date.parse(right.publishedAt) - Date.parse(left.publishedAt);
      }
      if ((reportRule?.value || "latest") === "composite") {
        return reportCompositeScore(right) - reportCompositeScore(left) || Date.parse(right.publishedAt) - Date.parse(left.publishedAt);
      }
      return Date.parse(right.publishedAt) - Date.parse(left.publishedAt);
    });
  }

  function reportAudienceLabel(value) {
    return ({ government: "政府单位", research: "科研机构", innovation: "创新主体" })[value] || "普通用户 / 访客";
  }

  function reportReason(item) {
    if (activeReportMode === "hot") {
      return "热度 " + Math.round(reportPopularityScore(item) * 100) + " 分 · 浏览40% + 收藏35% + 点赞25%，并结合时效";
    }
    if (activeReportMode === "exclusive") {
      return "面向“" + reportAudienceLabel(activeReportAudience) + "”的领域专属与最新科技报告";
    }
    if ((reportRule?.value || "latest") === "composite") {
      return "综合优先级 " + Math.round(reportCompositeScore(item) * 100) + " 分 · 时效50% + 热门规则35% + 需求相关15%";
    }
    return "按发布或上传时间倒序";
  }

  function createReportCard(item) {
    const expanded = expandedReportId === item.id;
    const saved = reportState.saved.includes(item.id);
    const liked = reportState.liked.includes(item.id);
    const viewed = reportState.viewed.includes(item.id);
    const article = createElement("article", "rec-report-card" + (expanded ? " is-expanded" : ""));
    article.dataset.reportId = item.id;
    const body = createElement("div");
    body.append(
      createElement("span", "rec-report-audience", activeReportMode === "exclusive" ? reportAudienceLabel(activeReportAudience) : "普通用户 / 访客"),
      createElement("span", "rec-report-reason", reportReason(item)),
      createElement("h3", "", item.title),
      createElement("p", "", item.summary),
      createElement("p", "rec-report-source", "来源：" + item.source)
    );
    appendTags(body, item.topics);
    body.appendChild(createMetricGrid([
      ["发布时间", formatPrototypeDate(item.publishedAt, true)],
      ["平台浏览", formatPrototypeNumber(item.views)],
      ["平台收藏", formatPrototypeNumber(item.saves)],
      ["平台点赞", formatPrototypeNumber(item.likes)]
    ], "rec-report-metrics"));
    const actions = createElement("div", "rec-report-actions");
    const detailButton = createElement("button", "", expanded ? "收起详情" : "查看详情");
    detailButton.type = "button";
    detailButton.dataset.reportToggle = item.id;
    detailButton.setAttribute("aria-expanded", String(expanded));
    const saveButton = createElement("button", saved ? "is-saved" : "", saved ? "已收藏" : "收藏");
    saveButton.type = "button";
    saveButton.dataset.reportSave = item.id;
    saveButton.setAttribute("aria-pressed", String(saved));
    const likeButton = createElement("button", liked ? "is-liked" : "", liked ? "已点赞" : "点赞");
    likeButton.type = "button";
    likeButton.dataset.reportLike = item.id;
    likeButton.setAttribute("aria-pressed", String(liked));
    actions.append(detailButton, saveButton, likeButton);
    body.appendChild(actions);
    if (expanded) {
      const detail = createElement("div", "rec-report-detail");
      detail.id = "rec-report-detail-" + item.id;
      detail.append(
        createElement("h4", "", "报告详情"),
        createElement("p", "", item.summary + " 当前内容为原型摘要，正式上线后将在可核验报告来源接入后展示目录、版本和原文入口。"),
        createMetricGrid([
          ["我的收藏", saved ? "已收藏" : "未收藏"],
          ["我的点赞", liked ? "已点赞" : "未点赞"],
          ["本机查看", viewed ? "已查看" : "首次展开"]
        ])
      );
      body.appendChild(detail);
    }
    article.appendChild(body);
    return article;
  }

  function renderReports() {
    if (!reportGrid || !reportState) return;
    const items = getReportItems();
    const visibleLimit = activeReportMode === "latest" ? MODULE_PAGE_SIZE : reportVisibleCount;
    const visible = items.slice(0, visibleLimit);
    reportGrid.setAttribute("aria-busy", "true");
    reportGrid.replaceChildren();
    if (!visible.length) {
      const empty = createElement("div", "rec-empty-state");
      empty.append(createElement("strong", "", "暂无该身份群体的专属报告"), createElement("p", "", "可以切换其他身份筛选或查看最新报告。"));
      const recover = createElement("button", "", "查看最新报告");
      recover.type = "button";
      recover.dataset.reportRecover = "latest";
      empty.appendChild(recover);
      reportGrid.appendChild(empty);
    } else {
      visible.forEach(function (item) { reportGrid.appendChild(createReportCard(item)); });
    }
    const modeLabel = ({ latest: "最新报告", hot: "热门报告", exclusive: "专属报告" })[activeReportMode];
    const ruleLabel = activeReportMode === "hot" ? "按热度权重与时效排序"
      : activeReportMode === "exclusive" ? "身份筛选：“" + reportAudienceLabel(activeReportAudience) + "”"
        : (reportRule?.value === "composite" ? "按综合优先级" : "按发布时间倒序");
    replaceModuleStatus(reportStatus, modeLabel, "当前显示 " + visible.length + " / 共 " + items.length + " 条 · " + ruleLabel);
    if (reportMoreButton) {
      if (activeReportMode === "latest") {
        reportMoreButton.hidden = true;
        reportMoreButton.disabled = true;
      } else updateMoreButton(reportMoreButton, items.length, reportVisibleCount, "报告");
    }
    reportGrid.setAttribute("aria-busy", "false");
  }

  function setReportMode(mode, moveFocus) {
    const next = ["latest", "hot", "exclusive"].includes(mode) ? mode : "latest";
    if (next !== activeReportMode) {
      activeReportMode = next;
      reportVisibleCount = MODULE_PAGE_SIZE;
      expandedReportId = "";
    }
    if (reportAudienceFilters) reportAudienceFilters.hidden = next !== "exclusive";
    reportAudienceFilters?.querySelectorAll("[data-report-audience]").forEach(function (candidate) {
      const selected = candidate.dataset.reportAudience === activeReportAudience;
      candidate.classList.toggle("is-active", selected);
      candidate.setAttribute("aria-pressed", String(selected));
    });
    updateDedicatedTabs(reportTabs, "reportMode", next, reportGrid, "rec-report", moveFocus);
    renderReports();
  }

  function toggleReportPersonalState(id, key, activeMessage, inactiveMessage) {
    const active = reportState[key].includes(id);
    const next = active ? reportState[key].filter(function (itemId) { return itemId !== id; }) : reportState[key].concat(id);
    saveReportState({ ...reportState, [key]: next });
    renderReports();
    showToast(active ? inactiveMessage : activeMessage, {
      label: "撤销",
      onAction: function () {
        const current = reportState[key];
        const restored = active ? Array.from(new Set(current.concat(id))) : current.filter(function (itemId) { return itemId !== id; });
        saveReportState({ ...reportState, [key]: restored });
        renderReports();
      }
    });
  }

  function authorRecommendationState(authorId) {
    return authorState?.authors[authorId] || { following: false, everFollowed: false, dismissed: false };
  }

  function createTalentCard(author) {
    const state = authorRecommendationState(author.id);
    const article = createElement("article", "rec-talent-card" + (state.following ? " is-following" : ""));
    article.dataset.authorId = author.id;
    const stateLabel = state.following ? "已关注" : state.everFollowed ? (state.dismissed ? "曾关注 · 已停止据此推荐" : "曾关注") : "人才库推荐";
    article.append(
      createElement("span", "rec-recommendation-reason", stateLabel),
      createElement("h4", "", author.name),
      createElement("p", "", author.institution),
      createElement("p", "", "研究领域：" + author.field),
      createElement("p", "", "研究方向：" + author.direction),
      createMetricGrid([
        ["H 指数", String(author.hIndex)],
        ["论文", String(author.papers)],
        ["引用", formatPrototypeNumber(author.citations)]
      ])
    );
    const button = createElement("button", state.following ? "is-following" : "", state.following ? "取消关注" : state.everFollowed ? "重新关注" : "关注作者");
    button.type = "button";
    button.dataset.authorFollow = author.id;
    button.setAttribute("aria-pressed", String(state.following));
    article.appendChild(button);
    return article;
  }

  function activeAuthorUpdates() {
    return AUTHOR_UPDATES.filter(function (update) {
      const state = authorRecommendationState(update.authorId);
      return !state.dismissed && (state.following || state.everFollowed);
    }).sort(function (left, right) { return Date.parse(right.date) - Date.parse(left.date); });
  }

  function createAuthorUpdate(update) {
    const author = AUTHORS.find(function (item) { return item.id === update.authorId; });
    const state = authorRecommendationState(update.authorId);
    const expanded = expandedAuthorUpdateId === update.id;
    const article = createElement("article", "rec-author-update-card" + (expanded ? " is-expanded" : ""));
    article.dataset.authorUpdateId = update.id;
    article.append(
      createElement("span", "rec-author-update-type", update.type),
      createElement("span", "rec-recommendation-reason", state.following ? "因已关注“" + author.name + "”" : "因曾关注“" + author.name + "”"),
      createElement("h4", "", update.title),
      createElement("time", "", formatPrototypeDate(update.date, true))
    );
    const toggle = createElement("button", "", expanded ? "收起动态" : "查看动态");
    toggle.type = "button";
    toggle.dataset.authorUpdateToggle = update.id;
    toggle.setAttribute("aria-expanded", String(expanded));
    article.appendChild(toggle);
    if (!state.following) {
      const dismiss = createElement("button", "", "不再据此推荐");
      dismiss.type = "button";
      dismiss.dataset.authorDismiss = update.authorId;
      article.appendChild(dismiss);
    }
    if (expanded) {
      const detail = createElement("div", "rec-author-update-detail");
      detail.append(
        createElement("p", "", update.detail),
        createElement("small", "", "动态来自本地原型人才库；正式数据接入后将展示可核验来源与时间。")
      );
      article.appendChild(detail);
    }
    return article;
  }

  function createRisingStarCard(star) {
    const article = createElement("article", "rec-rising-star-card");
    article.append(
      createElement("h4", "", star.name),
      createElement("p", "", "学术机构：" + star.institution),
      createElement("p", "rec-rising-field", "研究领域：" + star.field),
      createElement("p", "", "研究方向：" + star.direction),
      createMetricGrid([
        ["学术年龄", star.academicAge + " 年"],
        ["近 3 年活跃度", star.activity + " / 100"],
        ["论文", String(star.papers)],
        ["引用", formatPrototypeNumber(star.citations)],
        ["H 指数", String(star.hIndex)]
      ])
    );
    return article;
  }

  function renderTalentRecommendations() {
    if (!authorState) return;
    if (talentLibrary) {
      talentLibrary.setAttribute("aria-busy", "true");
      talentLibrary.replaceChildren();
      AUTHORS.forEach(function (author) { talentLibrary.appendChild(createTalentCard(author)); });
      talentLibrary.setAttribute("aria-busy", "false");
    }
    const updates = activeAuthorUpdates();
    if (authorUpdates) {
      authorUpdates.setAttribute("aria-busy", "true");
      authorUpdates.replaceChildren();
      if (!updates.length) {
        const empty = createElement("div", "rec-empty-state");
        empty.append(
          createElement("strong", "", "暂无关注作者动态"),
          createElement("p", "", "关注人才库作者后，会在这里按时间倒序展示论文、预印本、会议信息和科研经历。")
        );
        const locate = createElement("button", "", "前往人才库");
        locate.type = "button";
        locate.dataset.authorLocateLibrary = "true";
        empty.appendChild(locate);
        authorUpdates.appendChild(empty);
      } else updates.forEach(function (update) { authorUpdates.appendChild(createAuthorUpdate(update)); });
      authorUpdates.setAttribute("aria-busy", "false");
    }
    replaceModuleStatus(authorUpdatesStatus, "作者动态", "当前 " + updates.length + " 条 · 按动态日期倒序 · 覆盖论文、预印本、会议信息与科研经历");
    if (risingStars) {
      risingStars.setAttribute("aria-busy", "true");
      risingStars.replaceChildren();
      RISING_STARS.forEach(function (star) { risingStars.appendChild(createRisingStarCard(star)); });
      risingStars.setAttribute("aria-busy", "false");
    }
  }

  function setAuthorFollowing(authorId) {
    const previous = { ...authorRecommendationState(authorId) };
    const nextAuthor = previous.following
      ? { following: false, everFollowed: true, dismissed: false }
      : { following: true, everFollowed: true, dismissed: false };
    saveAuthorState({ ...authorState, authors: { ...authorState.authors, [authorId]: nextAuthor } });
    renderTalentRecommendations();
    if (activePaperMode === "following") renderPapers();
    showToast(previous.following ? "已取消关注；仍保留“曾关注”推荐依据" : "已关注作者，相关文献与动态已更新", {
      label: "撤销",
      onAction: function () {
        saveAuthorState({ ...authorState, authors: { ...authorState.authors, [authorId]: previous } });
        renderTalentRecommendations();
        if (activePaperMode === "following") renderPapers();
      }
    });
  }

  function dismissFormerAuthor(authorId) {
    const previous = { ...authorRecommendationState(authorId) };
    const nextAuthor = { ...previous, dismissed: true };
    saveAuthorState({ ...authorState, authors: { ...authorState.authors, [authorId]: nextAuthor } });
    renderTalentRecommendations();
    if (activePaperMode === "following") renderPapers();
    showToast("已停止依据该曾关注作者推荐", {
      label: "撤销",
      onAction: function () {
        saveAuthorState({ ...authorState, authors: { ...authorState.authors, [authorId]: previous } });
        renderTalentRecommendations();
        if (activePaperMode === "following") renderPapers();
      }
    });
  }

  function conferencePopularityScore(item) {
    const maxSubmissions = Math.max.apply(null, CONFERENCE_ITEMS.map(function (entry) { return entry.submissions; }));
    const maxAttendees = Math.max.apply(null, CONFERENCE_ITEMS.map(function (entry) { return entry.attendees; }));
    const popularity = item.submissions / maxSubmissions * 0.35
      + item.attendees / maxAttendees * 0.30
      + item.heat / 100 * 0.35;
    return popularity;
  }

  function conferenceProximityScore(item) {
    const days = Math.abs(Date.parse(item.startAt) - PROTOTYPE_REFERENCE_TIME) / 86400000;
    const proximity = Math.max(0, 1 - days / 150);
    const futureBoost = Date.parse(item.endAt) >= PROTOTYPE_REFERENCE_TIME ? 1 : 0.7;
    return proximity * futureBoost;
  }

  function conferenceScore(item, mode) {
    const proximity = conferenceProximityScore(item);
    const popularity = conferencePopularityScore(item);
    return mode === "hot" ? popularity * 0.7 + proximity * 0.3 : proximity * 0.7 + popularity * 0.3;
  }

  function conferenceStateLabel(item) {
    const start = Date.parse(item.startAt);
    const end = Date.parse(item.endAt);
    if (end < PROTOTYPE_REFERENCE_TIME) return "已结束";
    if (start <= PROTOTYPE_REFERENCE_TIME) return "进行中";
    if (Date.parse(item.deadlineAt) < PROTOTYPE_REFERENCE_TIME) return "即将举行 · 已截稿";
    return "即将举行 · 征稿中";
  }

  function getConferenceItems() {
    return CONFERENCE_ITEMS.slice().sort(function (left, right) {
      return conferenceScore(right, activeConferenceMode) - conferenceScore(left, activeConferenceMode)
        || Date.parse(left.startAt) - Date.parse(right.startAt);
    });
  }

  function createConferenceCard(item) {
    const expanded = expandedConferenceId === item.id;
    const deadlinePassed = Date.parse(item.deadlineAt) < PROTOTYPE_REFERENCE_TIME;
    const ended = Date.parse(item.endAt) < PROTOTYPE_REFERENCE_TIME;
    const score = conferenceScore(item, activeConferenceMode);
    const article = createElement("article", "rec-conference-card" + (expanded ? " is-expanded" : ""));
    article.dataset.conferenceId = item.id;
    const header = createElement("header");
    header.append(createElement("span", "", item.level), createElement("em", "", conferenceStateLabel(item)));
    article.append(
      header,
      createElement("span", "rec-recommendation-reason", activeConferenceMode === "hot"
        ? "热门优先：热门70% + 临近度30%"
        : "最近优先：临近度70% + 热门30%"),
      createElement("h3", "", item.title),
      createElement("p", "", "适用人群：普通用户 / 访客")
    );
    appendTags(article, item.topics);
    article.appendChild(createMetricGrid([
      ["会议时间", formatPrototypeDate(item.startAt, false) + " — " + formatPrototypeDate(item.endAt, false)],
      ["地点", item.location],
      ["截稿", formatPrototypeDate(item.deadlineAt, true)],
      ["推荐分", Math.round(score * 100) + " / 100"]
    ], "rec-conference-metrics"));
    const footer = createElement("footer", "rec-conference-actions");
    const detail = createElement("button", "", expanded ? "收起详情" : "查看详情");
    detail.type = "button";
    detail.dataset.conferenceToggle = item.id;
    detail.setAttribute("aria-expanded", String(expanded));
    const submission = createElement("button", "", deadlinePassed || ended ? "已过截稿" : "查看投稿说明");
    submission.type = "button";
    submission.disabled = deadlinePassed || ended;
    if (!submission.disabled) submission.dataset.conferenceSubmission = item.id;
    footer.append(detail, submission);
    article.appendChild(footer);
    if (expanded) {
      const details = createElement("div", "rec-conference-detail");
      details.id = "rec-conference-detail-" + item.id;
      details.append(
        createElement("h4", "", "评分依据与会议信息"),
        createMetricGrid([
          ["投稿量", formatPrototypeNumber(item.submissions)],
          ["参与人数", formatPrototypeNumber(item.attendees)],
          ["会议热度", item.heat + " / 100"],
          ["临近度", Math.round(conferenceProximityScore(item) * 100) + " / 100"]
        ], "rec-conference-score"),
        createElement("p", "", "热门分 = 投稿量归一化×35% + 参与人数归一化×30% + 会议热度×35%。"),
        createElement("small", "", deadlinePassed
          ? "截稿时间已过，投稿操作已禁用。"
          : "当前仅提供原型投稿说明，尚未接入可核验的官方投稿入口，不会伪装跳转。")
      );
      article.appendChild(details);
    }
    return article;
  }

  function renderConferences() {
    if (!conferenceGrid) return;
    const items = getConferenceItems();
    const visible = items.slice(0, conferenceVisibleCount);
    conferenceGrid.setAttribute("aria-busy", "true");
    conferenceGrid.replaceChildren();
    visible.forEach(function (item) { conferenceGrid.appendChild(createConferenceCard(item)); });
    const label = activeConferenceMode === "hot" ? "热门会议" : "最近会议";
    const formula = activeConferenceMode === "hot" ? "热门70% + 临近度30%" : "临近度70% + 热门30%";
    replaceModuleStatus(conferenceStatus, label, "当前显示 " + visible.length + " / 共 " + items.length + " 条 · " + formula + " · 适用普通用户 / 访客");
    updateMoreButton(conferenceMoreButton, items.length, conferenceVisibleCount, "会议");
    conferenceGrid.setAttribute("aria-busy", "false");
  }

  function setConferenceMode(mode, moveFocus) {
    const next = ["recent", "hot"].includes(mode) ? mode : "recent";
    if (next !== activeConferenceMode) {
      activeConferenceMode = next;
      conferenceVisibleCount = MODULE_PAGE_SIZE;
      expandedConferenceId = "";
    }
    updateDedicatedTabs(conferenceTabs, "conferenceMode", next, conferenceGrid, "rec-conference", moveFocus);
    renderConferences();
  }

  function createCourseChart(item) {
    const chart = createElement("div", "rec-course-chart");
    chart.setAttribute("aria-label", item.title + "行为匹配维度");
    Object.keys(item.dimensions).forEach(function (label) {
      const value = item.dimensions[label];
      const row = createElement("div", "rec-chart-row");
      const name = createElement("span", "", label);
      const track = createElement("div", "rec-chart-track");
      track.setAttribute("role", "progressbar");
      track.setAttribute("aria-label", label + "匹配度");
      track.setAttribute("aria-valuemin", "0");
      track.setAttribute("aria-valuemax", "100");
      track.setAttribute("aria-valuenow", String(value));
      const fill = createElement("span", "rec-chart-fill");
      fill.style.width = value + "%";
      track.appendChild(fill);
      row.append(name, track, createElement("strong", "", value + "%"));
      chart.appendChild(row);
    });
    return chart;
  }

  function createCourseCard(item) {
    const expanded = expandedCourseId === item.id;
    const saved = courseState.saved.includes(item.id);
    const article = createElement("article", "rec-course-card" + (expanded ? " is-expanded" : ""));
    article.dataset.courseId = item.id;
    const body = createElement("div");
    body.append(
      createElement("span", "rec-recommendation-reason", "本机原型行为综合匹配 " + item.match + "%"),
      createElement("h3", "", item.title),
      createElement("p", "", item.summary),
      createElement("strong", "", "课程周期：" + item.duration),
      createElement("time", "", "发布时间：" + formatPrototypeDate(item.publishedAt, false))
    );
    appendTags(body, item.tags);
    body.appendChild(createCourseChart(item));
    const actions = createElement("div", "rec-course-actions");
    const detail = createElement("button", "", expanded ? "收起详情" : "查看课程详情");
    detail.type = "button";
    detail.dataset.courseToggle = item.id;
    detail.setAttribute("aria-expanded", String(expanded));
    const save = createElement("button", saved ? "is-saved" : "", saved ? "已收藏" : "收藏课程");
    save.type = "button";
    save.dataset.courseSave = item.id;
    save.setAttribute("aria-pressed", String(saved));
    actions.append(detail, save);
    body.appendChild(actions);
    if (expanded) {
      const details = createElement("div", "rec-course-detail");
      details.id = "rec-course-detail-" + item.id;
      details.append(
        createElement("h4", "", "课程详情"),
        createMetricGrid([
          ["课程名称", item.title],
          ["发布时间", formatPrototypeDate(item.publishedAt, true)],
          ["课程周期", item.duration]
        ]),
        createElement("p", "", "完整简介：" + item.summary + " 课程将围绕基础概念、案例分析和实践任务逐步展开。"),
        createElement("p", "", "推荐依据：综合当前浏览器中的搜索关注、主题浏览和收藏偏好生成原型匹配分，不代表账号画像或真实算法结论。")
      );
      body.appendChild(details);
    }
    article.appendChild(body);
    return article;
  }

  function renderCourses() {
    if (!courseGrid || !courseState) return;
    const items = COURSE_ITEMS.slice().sort(function (left, right) {
      return right.match - left.match || Date.parse(right.publishedAt) - Date.parse(left.publishedAt);
    });
    const visible = items.slice(0, courseVisibleCount);
    courseGrid.setAttribute("aria-busy", "true");
    courseGrid.replaceChildren();
    visible.forEach(function (item) { courseGrid.appendChild(createCourseCard(item)); });
    replaceModuleStatus(courseStatus, "推荐课程列表", "当前显示 " + visible.length + " / 共 " + items.length + " 门 · 按本机原型行为匹配度排序");
    updateMoreButton(courseMoreButton, items.length, courseVisibleCount, "课程");
    courseGrid.setAttribute("aria-busy", "false");
  }

  function toggleCourseSave(id) {
    const saved = courseState.saved.includes(id);
    const next = saved ? courseState.saved.filter(function (itemId) { return itemId !== id; }) : courseState.saved.concat(id);
    saveCourseState({ ...courseState, saved: next });
    renderCourses();
    showToast(saved ? "已取消收藏课程" : "已收藏课程", {
      label: "撤销",
      onAction: function () {
        const current = courseState.saved;
        const restored = saved ? Array.from(new Set(current.concat(id))) : current.filter(function (itemId) { return itemId !== id; });
        saveCourseState({ ...courseState, saved: restored });
        renderCourses();
      }
    });
  }

  function eventStatus(item) {
    if (Date.parse(item.endAt) < PROTOTYPE_REFERENCE_TIME) return "ended";
    if (item.registration === "planning") return "planning";
    if (Date.parse(item.startAt) <= PROTOTYPE_REFERENCE_TIME) return "ongoing";
    return "upcoming";
  }

  function eventStatusLabel(item) {
    const status = eventStatus(item);
    if (status === "ended") return "已结束 · 有纪要";
    if (status === "planning") return "筹备中";
    if (status === "ongoing") return "进行中";
    return "报名中";
  }

  function eventRecommendationScore(item) {
    const days = Math.max(0, (Date.parse(item.startAt) - PROTOTYPE_REFERENCE_TIME) / 86400000);
    const proximity = Math.max(0, 1 - days / 90);
    const demand = item.capacity ? item.registered / item.capacity : 0;
    const topicBoost = item.themes.includes("technology") && item.themes.includes("topic") ? 1 : 0.85;
    return proximity * 0.45 + Math.min(1, demand) * 0.35 + topicBoost * 0.2;
  }

  function getEventItems() {
    let items = EVENT_ITEMS.slice();
    if (activeEventMode === "archive") {
      items = items.filter(function (item) { return eventStatus(item) === "ended"; });
      return items.sort(function (left, right) { return Date.parse(right.startAt) - Date.parse(left.startAt); });
    }
    items = items.filter(function (item) { return eventStatus(item) !== "ended"; });
    if (activeEventMode === "technology") items = items.filter(function (item) { return item.themes.includes("technology"); });
    if (activeEventMode === "topic") items = items.filter(function (item) { return item.themes.includes("topic"); });
    return items.sort(function (left, right) {
      return eventRecommendationScore(right) - eventRecommendationScore(left)
        || Date.parse(left.startAt) - Date.parse(right.startAt);
    });
  }

  function eventModeReason(item) {
    if (activeEventMode === "archive") return "往期活动记录 · 按活动时间倒序";
    if (activeEventMode === "technology") return "热点技术筛选 · " + item.reason;
    if (activeEventMode === "topic") return "热点话题筛选 · " + item.reason;
    return item.reason + " · 综合临近度、报名热度和主题匹配";
  }

  function createEventCard(item) {
    const expanded = expandedEventId === item.id;
    const recordExpanded = expandedEventRecordId === item.id;
    const registered = eventState.registered.includes(item.id);
    const status = eventStatus(item);
    const canRegister = status === "upcoming" && item.registration === "open";
    const article = createElement("article", "rec-event-card is-" + status + (expanded ? " is-expanded" : ""));
    article.dataset.eventId = item.id;
    const header = createElement("header");
    header.append(createElement("span", "", item.type), createElement("em", "", eventStatusLabel(item)));
    article.append(
      header,
      createElement("span", "rec-event-reason", eventModeReason(item)),
      createElement("h3", "", item.title),
      createElement("p", "", item.summary)
    );
    article.appendChild(createMetricGrid([
      ["主办", item.organizer],
      ["地点", item.location],
      ["时间", formatPrototypeDate(item.startAt, true) + " — " + formatPrototypeDate(item.endAt, true)],
      ["主题", item.themes.filter(function (theme) { return theme !== "technology" && theme !== "topic"; }).join("、")]
    ], "rec-event-theme"));
    const actions = createElement("div", "rec-event-actions");
    const detail = createElement("button", "", expanded ? "收起详情" : "活动详情查看");
    detail.type = "button";
    detail.dataset.eventToggle = item.id;
    detail.setAttribute("aria-expanded", String(expanded));
    const register = createElement("button", registered ? "is-registered" : "", registered ? "已报名 · 取消报名" : canRegister ? "立即报名" : status === "planning" ? "筹备中不可报名" : "往期活动不可报名");
    register.type = "button";
    register.disabled = !canRegister;
    if (canRegister) {
      register.dataset.eventRegister = item.id;
      register.setAttribute("aria-pressed", String(registered));
    }
    actions.append(detail, register);
    article.appendChild(actions);
    if (expanded) {
      const detailPanel = createElement("div", "rec-event-detail");
      detailPanel.id = "rec-event-detail-" + item.id;
      detailPanel.append(
        createElement("h4", "", "活动详情"),
        createElement("p", "", "详情摘要：" + item.summary),
        createElement("p", "", "推荐原因：" + eventModeReason(item)),
        createMetricGrid([
          ["名额", formatPrototypeNumber(item.capacity)],
          ["平台报名数", formatPrototypeNumber(item.registered)],
          ["本机报名状态", registered ? "已报名" : "未报名"]
        ])
      );
      if (item.record) {
        const recordToggle = createElement("button", "", recordExpanded ? "收起论坛 / 沙龙记录" : "查看论坛 / 沙龙记录");
        recordToggle.type = "button";
        recordToggle.dataset.eventRecordToggle = item.id;
        recordToggle.setAttribute("aria-expanded", String(recordExpanded));
        detailPanel.appendChild(recordToggle);
        if (recordExpanded) {
          const records = createElement("div", "rec-event-records");
          records.append(
            createElement("h5", "", "往期活动纪要"),
            createElement("p", "", item.record),
            createElement("small", "", "这是原型纪要和回放状态说明，不是可播放视频，也不提供虚构入口。")
          );
          detailPanel.appendChild(records);
        }
      } else {
        detailPanel.appendChild(createElement("small", "", "活动尚未结束，相关论坛 / 沙龙记录将在活动完成并核验后生成。"));
      }
      article.appendChild(detailPanel);
    }
    return article;
  }

  function renderEvents() {
    if (!eventGrid || !eventState) return;
    const items = getEventItems();
    const visible = items.slice(0, eventVisibleCount);
    eventGrid.setAttribute("aria-busy", "true");
    eventGrid.replaceChildren();
    if (!visible.length) {
      const empty = createElement("div", "rec-empty-state");
      empty.append(createElement("strong", "", "暂无该分类活动"), createElement("p", "", "可切换综合推荐或往期记录查看其他活动。"));
      const recover = createElement("button", "", "查看综合推荐");
      recover.type = "button";
      recover.dataset.eventRecover = "combined";
      empty.appendChild(recover);
      eventGrid.appendChild(empty);
    } else visible.forEach(function (item) { eventGrid.appendChild(createEventCard(item)); });
    const label = ({ combined: "推荐活动列表", technology: "热点技术活动", topic: "热点话题活动", archive: "往期活动记录" })[activeEventMode];
    const sort = activeEventMode === "archive" ? "按活动时间倒序" : "按临近度、报名热度和主题匹配排序";
    replaceModuleStatus(eventStatusNode, label, "当前显示 " + visible.length + " / 共 " + items.length + " 条 · " + sort);
    updateMoreButton(eventMoreButton, items.length, eventVisibleCount, "活动");
    eventGrid.setAttribute("aria-busy", "false");
  }

  function setEventMode(mode, moveFocus) {
    const next = ["combined", "technology", "topic", "archive"].includes(mode) ? mode : "combined";
    if (next !== activeEventMode) {
      activeEventMode = next;
      eventVisibleCount = MODULE_PAGE_SIZE;
      expandedEventId = "";
      expandedEventRecordId = "";
    }
    updateDedicatedTabs(eventTabs, "eventMode", next, eventGrid, "rec-event", moveFocus);
    renderEvents();
  }

  function toggleEventRegistration(id) {
    const item = findItem(EVENT_ITEMS, id);
    if (!item || item.registration !== "open" || eventStatus(item) !== "upcoming") {
      showToast("该活动当前不可报名");
      return;
    }
    const registered = eventState.registered.includes(id);
    const next = registered ? eventState.registered.filter(function (itemId) { return itemId !== id; }) : eventState.registered.concat(id);
    saveEventState({ ...eventState, registered: next });
    renderEvents();
    showToast(registered ? "已取消本机原型报名状态" : "报名状态已同步到本机原型", {
      label: "撤销",
      onAction: function () {
        const current = eventState.registered;
        const restored = registered ? Array.from(new Set(current.concat(id))) : current.filter(function (itemId) { return itemId !== id; });
        saveEventState({ ...eventState, registered: restored });
        renderEvents();
      }
    });
  }

  function emptyWatchState() {
    return { version: 1, autoFollow: true, watches: [] };
  }

  function normalizeKeyword(value) {
    return String(value || "")
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 40);
  }

  function keywordKey(value) {
    return normalizeKeyword(value).toLocaleLowerCase("zh-CN");
  }

  function isUsableKeyword(value) {
    return /[\p{L}\p{N}]/u.test(value);
  }

  function deriveWatchKeyword(query) {
    const normalized = String(query || "").replace(/\s+/g, " ").trim();
    if (!normalized) return "";

    const quoteMatch = normalized.match(/[“\"']([^”\"']{1,40})[”\"']/);
    if (quoteMatch && isUsableKeyword(quoteMatch[1])) return normalizeKeyword(quoteMatch[1]);

    const lowerQuery = normalized.toLocaleLowerCase("zh-CN");
    const known = KNOWN_KEYWORDS
      .filter(function (keyword) { return lowerQuery.includes(keyword.toLocaleLowerCase("zh-CN")); })
      .sort(function (left, right) { return right.length - left.length; })[0];
    if (known) return known;

    const simplified = normalized
      .replace(/^(请|麻烦)?\s*(帮我|为我)?\s*(搜索|查找|检索|查询|了解|看看|关注)\s*/u, "")
      .replace(/^(关于|有关)\s*/u, "")
      .split(/[，,。！？!?；;：:\n]/u)[0];
    return normalizeKeyword(simplified || normalized);
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash >>> 0);
  }

  function relatedTagsFor(keyword) {
    const direct = KEYWORD_RELATIONS[keyword];
    if (direct) return direct.slice();
    const matchingKey = Object.keys(KEYWORD_RELATIONS).find(function (key) {
      return keyword.includes(key) || key.includes(keyword);
    });
    return matchingKey ? KEYWORD_RELATIONS[matchingKey].slice() : ["技术进展", "科研成果", "政策动态"];
  }

  function createKeywordUpdates(keyword, key, createdAt) {
    const createdTime = new Date(createdAt).getTime();
    const offsets = [12 * 60 * 1000, 3 * 60 * 60 * 1000, 26 * 60 * 60 * 1000];
    const records = [
      {
        type: "文献",
        title: "“" + keyword + "”相关文献库新增高关联研究（原型）",
        summary: "系统根据题名、摘要与主题关联生成本条原型提醒，可进入真实文献接口后查看来源与证据。"
      },
      {
        type: "资讯",
        title: "“" + keyword + "”相关政策与产业资讯已更新（原型）",
        summary: "本条用于演示关键词动态触达；正式上线后将展示来源、发布时间和相关度依据。"
      },
      {
        type: "报告",
        title: "“" + keyword + "”趋势监测生成新一期摘要（原型）",
        summary: "原型汇总检索热度与公开趋势信号，不代表真实统计结论。"
      }
    ];

    return records.map(function (record, index) {
      return {
        id: "update-" + hashString(key + createdAt + index).toString(36),
        type: record.type,
        title: record.title,
        summary: record.summary,
        createdAt: new Date(createdTime - offsets[index]).toISOString(),
        read: false
      };
    });
  }

  function createKeywordWatch(keyword, source, mode) {
    const now = new Date().toISOString();
    const key = keywordKey(keyword);
    const seed = hashString(key);
    return {
      id: "watch-" + seed.toString(36) + "-" + Date.now().toString(36),
      key: key,
      keyword: keyword,
      source: source,
      mode: mode,
      createdAt: now,
      updatedAt: now,
      lastSearchedAt: source === "search" ? now : "",
      searchCount: source === "search" ? 1 : 0,
      frequency: "daily",
      tags: relatedTagsFor(keyword),
      metrics: {
        todayNew: 3 + seed % 5,
        weekNew: 12 + seed % 29,
        relatedResources: 32 + seed % 91
      },
      updates: createKeywordUpdates(keyword, key, now)
    };
  }

  function normalizeStoredWatch(item) {
    if (!item || typeof item !== "object") return null;
    const keyword = normalizeKeyword(item.keyword);
    if (!keyword || !isUsableKeyword(keyword)) return null;
    const key = keywordKey(keyword);
    const fallback = createKeywordWatch(keyword, item.source === "search" ? "search" : "manual", item.mode || "ai");
    const updates = Array.isArray(item.updates) ? item.updates.slice(0, 10).map(function (update, index) {
      if (!update || typeof update !== "object") return null;
      const title = String(update.title || "").trim().slice(0, 180);
      if (!title) return null;
      return {
        id: String(update.id || "update-" + hashString(key + index).toString(36)),
        type: String(update.type || "动态").slice(0, 12),
        title: title,
        summary: String(update.summary || "").trim().slice(0, 260),
        createdAt: Number.isNaN(Date.parse(update.createdAt)) ? fallback.createdAt : update.createdAt,
        read: Boolean(update.read)
      };
    }).filter(Boolean) : fallback.updates;

    return {
      ...fallback,
      id: String(item.id || fallback.id),
      key: key,
      keyword: keyword,
      source: item.source === "search" ? "search" : "manual",
      mode: MODE_CONFIG[item.mode] ? item.mode : "ai",
      createdAt: Number.isNaN(Date.parse(item.createdAt)) ? fallback.createdAt : item.createdAt,
      updatedAt: Number.isNaN(Date.parse(item.updatedAt)) ? fallback.updatedAt : item.updatedAt,
      lastSearchedAt: Number.isNaN(Date.parse(item.lastSearchedAt)) ? "" : item.lastSearchedAt,
      searchCount: Math.max(0, Number(item.searchCount) || 0),
      frequency: ["realtime", "daily", "weekly", "page"].includes(item.frequency) ? item.frequency : "daily",
      tags: Array.isArray(item.tags) ? item.tags.map(String).filter(Boolean).slice(0, 4) : fallback.tags,
      metrics: {
        todayNew: Math.max(0, Number(item.metrics?.todayNew) || fallback.metrics.todayNew),
        weekNew: Math.max(0, Number(item.metrics?.weekNew) || fallback.metrics.weekNew),
        relatedResources: Math.max(0, Number(item.metrics?.relatedResources) || fallback.metrics.relatedResources)
      },
      updates: updates
    };
  }

  function loadWatchState() {
    const fallback = emptyWatchState();
    try {
      const raw = window.localStorage.getItem(KEYWORD_WATCH_STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== 1) return fallback;
      const seen = new Set();
      const watches = (Array.isArray(parsed.watches) ? parsed.watches : [])
        .map(normalizeStoredWatch)
        .filter(function (watch) {
          if (!watch || seen.has(watch.key)) return false;
          seen.add(watch.key);
          return true;
        })
        .slice(0, KEYWORD_WATCH_LIMIT);
      return { version: 1, autoFollow: parsed.autoFollow !== false, watches: watches };
    } catch (_error) {
      return fallback;
    }
  }

  function saveWatchState(nextState) {
    try {
      window.localStorage.setItem(KEYWORD_WATCH_STORAGE_KEY, JSON.stringify(nextState));
      watchState = nextState;
      return true;
    } catch (_error) {
      showToast("无法保存词汇关注，请检查浏览器存储权限后重试");
      return false;
    }
  }

  function unreadCountFor(watch) {
    return watch.updates.filter(function (update) { return !update.read; }).length;
  }

  function totalKeywordUnread() {
    return watchState.watches.reduce(function (total, watch) {
      return total + unreadCountFor(watch);
    }, 0);
  }

  function formatRelativeTime(value) {
    const time = Date.parse(value);
    if (Number.isNaN(time)) return "刚刚";
    const minutes = Math.max(0, Math.round((Date.now() - time) / 60000));
    if (minutes < 1) return "刚刚";
    if (minutes < 60) return minutes + " 分钟前";
    const hours = Math.round(minutes / 60);
    if (hours < 24) return hours + " 小时前";
    const days = Math.round(hours / 24);
    if (days < 7) return days + " 天前";
    return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(new Date(time));
  }

  function frequencyLabel(value) {
    return ({ realtime: "重大动态实时推送", daily: "每日站内汇总", weekly: "每周站内汇总", page: "仅在本页查看" })[value] || "每日站内汇总";
  }

  function upsertKeywordWatch(query, source, mode) {
    const keyword = deriveWatchKeyword(query);
    if (!keyword || !isUsableKeyword(keyword)) return { status: "invalid" };
    const key = keywordKey(keyword);
    const existingIndex = watchState.watches.findIndex(function (watch) { return watch.key === key; });
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const existing = watchState.watches[existingIndex];
      const updated = {
        ...existing,
        mode: MODE_CONFIG[mode] ? mode : existing.mode,
        updatedAt: now,
        lastSearchedAt: source === "search" ? now : existing.lastSearchedAt,
        searchCount: source === "search" ? existing.searchCount + 1 : existing.searchCount
      };
      const watches = watchState.watches.slice();
      watches.splice(existingIndex, 1, updated);
      if (!saveWatchState({ ...watchState, watches: watches })) return { status: "error" };
      return { status: "existing", watch: updated };
    }

    if (watchState.watches.length >= KEYWORD_WATCH_LIMIT) return { status: "limit", keyword: keyword };
    const watch = createKeywordWatch(keyword, source, MODE_CONFIG[mode] ? mode : "ai");
    if (!saveWatchState({ ...watchState, watches: [watch].concat(watchState.watches) })) return { status: "error" };
    return { status: "created", watch: watch };
  }

  function updateMessageBadge() {
    const keywordUnread = totalKeywordUnread();
    const total = BASE_MESSAGE_COUNT + keywordUnread;
    if (messageCount) messageCount.textContent = total > 99 ? "99+" : String(total);
    if (messageButton) {
      messageButton.setAttribute(
        "aria-label",
        "消息，" + total + " 条未读，其中 " + keywordUnread + " 条词汇动态"
      );
    }
  }

  function renderWatchStatus() {
    if (!keywordFollowStatus || !watchState) return;
    const count = watchState.watches.length;
    const unread = totalKeywordUnread();
    const title = watchState.autoFollow ? "自动关注已开启" : "自动关注已关闭";
    let detail = "尚未关注词汇，可搜索或从下方推荐词开始。";
    if (count > 0) {
      detail = "已关注 " + count + "/" + KEYWORD_WATCH_LIMIT + " 个词汇";
      detail += unread > 0 ? "，有 " + unread + " 条未读动态。" : "，暂无未读动态。";
    }
    keywordFollowStatus.replaceChildren(createElement("strong", "", title), createElement("span", "", detail));

    if (searchFollowTip) {
      searchFollowTip.textContent = watchState.autoFollow
        ? "📌 搜索提交后会自动建立词汇关注并生成相关动态，可在“热词推荐”中管理。"
        : "📌 搜索词自动关注已关闭；搜索仍会正常进行，也可在“热词推荐”中手动关注。";
    }
  }

  function createSuggestionCard(suggestion) {
    const article = createElement("article", "rec-follow-card");
    article.dataset.keywordSuggestion = suggestion.keyword;
    const heading = createElement("div", "rec-follow-card-heading");
    const keyword = createElement("strong", "", suggestion.keyword);
    keyword.title = suggestion.keyword;
    heading.append(keyword, createElement("span", "", "推荐关注"));
    const meta = createElement("p", "rec-follow-meta", "本周热度 " + suggestion.trend);
    const actions = createElement("div", "rec-follow-actions");
    const followButton = createElement("button", "", "关注 (" + suggestion.followers + ")");
    followButton.type = "button";
    followButton.dataset.keywordFollow = suggestion.keyword;
    followButton.setAttribute("aria-pressed", "false");
    followButton.setAttribute("aria-label", "关注词汇“" + suggestion.keyword + "”");
    actions.appendChild(followButton);
    article.append(heading, meta, actions);
    return article;
  }

  function createUpdateItem(watch, update) {
    const expanded = expandedUpdateId === update.id;
    const item = createElement("li", "rec-follow-update" + (update.read ? "" : " is-unread"));
    const button = createElement("button");
    button.type = "button";
    button.dataset.watchUpdate = watch.key;
    button.dataset.updateId = update.id;
    button.setAttribute("aria-expanded", String(expanded));
    button.setAttribute("aria-label", (update.read ? "查看" : "查看并标记已读") + "：" + update.title);
    button.append(
      createElement("span", "rec-follow-update-type", update.type),
      createElement("strong", "", update.title),
      createElement("time", "", formatRelativeTime(update.createdAt)),
      createElement("span", "rec-follow-update-state", update.read ? "已读" : "未读")
    );
    if (expanded) button.appendChild(createElement("p", "", update.summary || "暂无更多摘要，系统正在持续监测。"));
    item.appendChild(button);
    return item;
  }

  function createWatchCard(watch) {
    const unread = unreadCountFor(watch);
    const expanded = expandedWatchKey === watch.key;
    const article = createElement("article", "rec-follow-card is-following" + (expanded ? " is-expanded" : ""));
    article.dataset.keywordWatchCard = watch.key;

    const heading = createElement("div", "rec-follow-card-heading");
    const keyword = createElement("strong", "", watch.keyword);
    keyword.title = watch.keyword;
    const badge = createElement("span", "rec-follow-badge" + (unread ? "" : " is-read"), unread ? unread + " 条未读" : "已读");
    heading.append(keyword, badge);

    const sourceLabel = watch.source === "search" ? "来自搜索" : "手动关注";
    const meta = createElement(
      "p",
      "rec-follow-meta",
      sourceLabel + " · 今日新增 " + watch.metrics.todayNew + " 条 · " + formatRelativeTime(watch.updatedAt) + "更新"
    );
    const actions = createElement("div", "rec-follow-actions");
    const toggleButton = createElement("button", "is-following", expanded ? "收起动态" : "查看动态");
    const updatesId = "rec-watch-updates-" + watch.id;
    toggleButton.type = "button";
    toggleButton.dataset.watchToggle = watch.key;
    toggleButton.setAttribute("aria-expanded", String(expanded));
    toggleButton.setAttribute("aria-controls", updatesId);
    toggleButton.setAttribute("aria-label", (expanded ? "收起" : "查看") + "“" + watch.keyword + "”相关动态");
    actions.appendChild(toggleButton);

    const updates = createElement("div", "rec-follow-updates");
    updates.id = updatesId;
    updates.hidden = !expanded;
    const updatesHead = createElement("div", "rec-follow-updates-head");
    updatesHead.appendChild(createElement("strong", "", "最新相关动态 · " + frequencyLabel(watch.frequency)));
    const markAllButton = createElement("button", "", unread ? "全部标为已读" : "已全部读取");
    markAllButton.type = "button";
    markAllButton.dataset.markWatchRead = watch.key;
    markAllButton.disabled = unread === 0;
    updatesHead.appendChild(markAllButton);
    updates.appendChild(updatesHead);

    if (watch.updates.length > 0) {
      const list = createElement("ul", "rec-follow-update-list");
      watch.updates.forEach(function (update) { list.appendChild(createUpdateItem(watch, update)); });
      updates.appendChild(list);
    } else {
      updates.appendChild(createElement("div", "rec-follow-empty", "暂无新动态，系统正在持续监测。"));
    }

    const preferences = createElement("div", "rec-follow-preferences");
    const frequencyControl = createElement("label", "", "推送频率");
    const frequencySelect = createElement("select");
    frequencySelect.dataset.watchFrequency = watch.key;
    frequencySelect.setAttribute("aria-label", "“" + watch.keyword + "”推送频率");
    [
      ["realtime", "重大动态实时推送"],
      ["daily", "每日站内汇总"],
      ["weekly", "每周站内汇总"],
      ["page", "仅在本页查看"]
    ].forEach(function (entry) {
      const option = createElement("option", "", entry[1]);
      option.value = entry[0];
      option.selected = watch.frequency === entry[0];
      frequencySelect.appendChild(option);
    });
    frequencyControl.appendChild(frequencySelect);

    const stopButton = createElement(
      "button",
      pendingRemovalKey === watch.key ? "is-confirming" : "",
      pendingRemovalKey === watch.key ? "确认停止关注" : "停止关注"
    );
    stopButton.type = "button";
    stopButton.dataset.stopWatch = watch.key;
    stopButton.setAttribute("aria-label", (pendingRemovalKey === watch.key ? "确认停止关注“" : "停止关注“") + watch.keyword + "”");
    preferences.append(frequencyControl, stopButton);
    updates.appendChild(preferences);

    article.append(heading, meta, actions, updates);
    return article;
  }

  function renderKeywordFollows() {
    if (!keywordFollowGrid || !watchState) return;
    keywordFollowGrid.replaceChildren();

    const watches = watchState.watches.slice().sort(function (left, right) {
      return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
    });

    if (watches.length === 0) {
      const empty = createElement("div", "rec-follow-empty");
      empty.append(
        createElement("strong", "", "还没有关注的词汇"),
        createElement("span", "", "完成一次搜索后会自动建立关注，也可以从推荐词开始。")
      );
      const focusSearchButton = createElement("button", "", "去搜索");
      focusSearchButton.type = "button";
      focusSearchButton.dataset.focusKeywordSearch = "true";
      empty.appendChild(focusSearchButton);
      keywordFollowGrid.appendChild(empty);
    }

    watches.forEach(function (watch) { keywordFollowGrid.appendChild(createWatchCard(watch)); });
    const watchedKeys = new Set(watches.map(function (watch) { return watch.key; }));
    const suggestionSlots = Math.max(0, 4 - watches.length);
    KEYWORD_SUGGESTIONS
      .filter(function (suggestion) { return !watchedKeys.has(keywordKey(suggestion.keyword)); })
      .slice(0, suggestionSlots)
      .forEach(function (suggestion) { keywordFollowGrid.appendChild(createSuggestionCard(suggestion)); });

    if (autoFollowCheckbox) autoFollowCheckbox.checked = watchState.autoFollow;
    renderWatchStatus();
    updateMessageBadge();
    if (activeNewsMode === "following" && newsViewState) renderNewsRecommendations();
  }

  function focusGridControl(attribute, value) {
    window.requestAnimationFrame(function () {
      const candidate = Array.from(keywordFollowGrid?.querySelectorAll("[" + attribute + "]") || []).find(function (node) {
        return node.getAttribute(attribute) === value;
      });
      candidate?.focus();
    });
  }

  function updateWatch(key, updateFunction) {
    const index = watchState.watches.findIndex(function (watch) { return watch.key === key; });
    if (index < 0) return false;
    const nextWatches = watchState.watches.slice();
    nextWatches[index] = updateFunction(watchState.watches[index]);
    return saveWatchState({ ...watchState, watches: nextWatches });
  }

  function markUpdateRead(watchKey, updateId) {
    const nextExpanded = expandedUpdateId === updateId ? "" : updateId;
    const saved = updateWatch(watchKey, function (watch) {
      return {
        ...watch,
        updates: watch.updates.map(function (update) {
          return update.id === updateId ? { ...update, read: true } : update;
        })
      };
    });
    if (!saved) return;
    expandedUpdateId = nextExpanded;
    renderKeywordFollows();
    focusGridControl("data-update-id", updateId);
  }

  function markWatchRead(watchKey) {
    const saved = updateWatch(watchKey, function (watch) {
      return { ...watch, updates: watch.updates.map(function (update) { return { ...update, read: true }; }) };
    });
    if (!saved) return;
    renderKeywordFollows();
    focusGridControl("data-watch-toggle", watchKey);
    showToast("该词汇的动态已全部标为已读");
  }

  function updateWatchFrequency(watchKey, frequency) {
    if (!["realtime", "daily", "weekly", "page"].includes(frequency)) return;
    const saved = updateWatch(watchKey, function (watch) { return { ...watch, frequency: frequency }; });
    if (!saved) return;
    renderKeywordFollows();
    focusGridControl("data-watch-frequency", watchKey);
    showToast("推送频率已更新为“" + frequencyLabel(frequency) + "”");
  }

  function stopWatching(watchKey) {
    if (pendingRemovalKey !== watchKey) {
      window.clearTimeout(pendingRemovalTimer);
      pendingRemovalKey = watchKey;
      renderKeywordFollows();
      focusGridControl("data-stop-watch", watchKey);
      showToast("再次点击“确认停止关注”即可停止后续推送");
      pendingRemovalTimer = window.setTimeout(function () {
        pendingRemovalKey = "";
        renderKeywordFollows();
        focusGridControl("data-stop-watch", watchKey);
      }, 5000);
      return;
    }

    window.clearTimeout(pendingRemovalTimer);
    const removed = watchState.watches.find(function (watch) { return watch.key === watchKey; });
    if (!removed) return;
    const nextWatches = watchState.watches.filter(function (watch) { return watch.key !== watchKey; });
    if (!saveWatchState({ ...watchState, watches: nextWatches })) return;
    pendingRemovalKey = "";
    expandedWatchKey = "";
    expandedUpdateId = "";
    renderKeywordFollows();
    showToast("已停止关注“" + removed.keyword + "”", {
      label: "撤销",
      onAction: function () {
        if (watchState.watches.length >= KEYWORD_WATCH_LIMIT) {
          showToast("关注词已达上限，无法撤销");
          return;
        }
        if (!saveWatchState({ ...watchState, watches: [removed].concat(watchState.watches) })) return;
        expandedWatchKey = removed.key;
        renderKeywordFollows();
        focusGridControl("data-watch-toggle", removed.key);
        showToast("已恢复关注“" + removed.keyword + "”");
      }
    });
  }

  function setSearchMode(mode, shouldFocus) {
    const nextMode = MODE_CONFIG[mode] ? mode : "ai";
    const config = MODE_CONFIG[nextMode];
    activeMode = nextMode;

    let activeTabId = "";
    modeTabs.forEach(function (tab, index) {
      const selected = tab.dataset.recSearchMode === nextMode;
      tab.id = tab.id || "rec-search-mode-tab-" + index;
      tab.setAttribute("aria-controls", "recSearchGuide");
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected) activeTabId = tab.id;
    });

    if (modeSelect) modeSelect.value = nextMode;
    if (searchInput) searchInput.placeholder = config.placeholder;
    if (searchGuide) {
      searchGuide.innerHTML = "<span aria-hidden=\"true\">💡</span><strong>" + config.label + "：</strong>" + config.guide;
      searchGuide.setAttribute("role", "tabpanel");
      searchGuide.setAttribute("aria-labelledby", activeTabId);
    }
    if (shouldFocus && searchInput) searchInput.focus();
  }

  modeTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      setSearchMode(tab.dataset.recSearchMode, false);
    });
    tab.addEventListener("keydown", function (event) {
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % modeTabs.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + modeTabs.length) % modeTabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = modeTabs.length - 1;
      else return;
      event.preventDefault();
      const nextTab = modeTabs[nextIndex];
      setSearchMode(nextTab.dataset.recSearchMode, false);
      nextTab.focus();
    });
  });

  modeSelect?.addEventListener("change", function () {
    setSearchMode(modeSelect.value, true);
  });

  searchForm?.addEventListener("submit", function (event) {
    event.preventDefault();
    const query = searchInput?.value.trim();
    if (!query) {
      showToast("请先输入要检索的内容");
      searchInput?.focus();
      return;
    }
    if (!isUsableKeyword(query)) {
      showToast("检索内容需包含文字或数字，请修改后重试");
      searchInput?.focus();
      return;
    }

    const mode = MODE_CONFIG[activeMode]?.resultMode || "全文";
    const params = new URLSearchParams({ query: query, mode: mode });
    const submitButton = searchForm.querySelector("button[type=\"submit\"]");
    const submitLabel = submitButton?.querySelector("span");
    if (submitButton?.disabled) return;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
    }
    if (submitLabel) submitLabel.textContent = "搜索中";

    let delay = 0;
    if (watchState.autoFollow) {
      const result = upsertKeywordWatch(query, "search", activeMode);
      if (result.status === "created") {
        expandedWatchKey = result.watch.key;
        renderKeywordFollows();
        showToast("已根据搜索自动关注“" + result.watch.keyword + "”，正在生成相关动态");
        delay = 720;
      } else if (result.status === "existing") {
        renderKeywordFollows();
        showToast("已更新“" + result.watch.keyword + "”的搜索关注数据");
        delay = 620;
      } else if (result.status === "limit") {
        showToast("已达到 " + KEYWORD_WATCH_LIMIT + " 个关注上限，本次继续搜索但不新增关注");
        delay = 1000;
      } else if (result.status === "invalid") {
        showToast("未能从本次搜索中识别可关注词汇，本次将继续搜索");
        delay = 900;
      } else if (result.status === "error") {
        delay = 1000;
      }
    }

    window.clearTimeout(searchNavigationTimer);
    searchNavigationTimer = window.setTimeout(function () {
      window.location.href = "index.html?" + params.toString();
    }, delay);
  });

  document.querySelectorAll("[data-hot-query]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (!searchInput) return;
      searchInput.value = button.dataset.hotQuery || button.textContent.trim();
      document.querySelector(".rec-hero")?.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });
      window.setTimeout(function () {
        searchInput.focus();
        searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
      }, prefersReducedMotion.matches ? 0 : 360);
    });
  });

  newsTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      setNewsMode(tab.dataset.newsMode, false);
    });
    tab.addEventListener("keydown", function (event) {
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % newsTabs.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + newsTabs.length) % newsTabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = newsTabs.length - 1;
      else return;
      event.preventDefault();
      setNewsMode(newsTabs[nextIndex].dataset.newsMode, true);
    });
  });

  newsGrid?.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button || !newsGrid.contains(button)) return;

    if (button.dataset.newsToggle) {
      const itemId = button.dataset.newsToggle;
      const opening = expandedNewsId !== itemId;
      expandedNewsId = opening ? itemId : "";
      if (opening) recordNewsView(itemId);
      renderNewsRecommendations();
      focusNewsToggle(itemId);
      return;
    }

    if (button.dataset.newsManageFollows) {
      const target = keywordFollowGrid || document.getElementById("hot");
      target?.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "center"
      });
      window.setTimeout(function () {
        const control = keywordFollowGrid?.querySelector("[data-watch-toggle], [data-keyword-follow], [data-focus-keyword-search]");
        (control || searchInput)?.focus();
      }, prefersReducedMotion.matches ? 0 : 360);
      showToast("请新增或调整词汇关注，关注领域资讯会自动更新");
    }
  });

  newsHistoryToggle?.addEventListener("change", function () {
    if (!newsViewState) return;
    const enabled = newsHistoryToggle.checked;
    const persisted = saveNewsViewState({ ...newsViewState, enabled: enabled }, false);
    renderNewsRecommendations();
    if (persisted) {
      showToast(enabled ? "本机浏览记录已开启" : "本机浏览记录已关闭，后续展开不再记录");
    } else {
      showToast("设置已在本次会话生效；浏览器未允许永久保存");
    }
  });

  newsClearHistoryButton?.addEventListener("click", clearNewsViewHistory);

  newsMoreButton?.addEventListener("click", function () {
    const items = getNewsItems(activeNewsMode);
    if (items.length <= NEWS_PAGE_SIZE) return;
    const showingAll = newsVisibleCount >= items.length;
    newsVisibleCount = showingAll ? NEWS_PAGE_SIZE : Math.min(items.length, newsVisibleCount + NEWS_PAGE_SIZE);
    if (showingAll && !items.slice(0, NEWS_PAGE_SIZE).some(function (item) { return item.id === expandedNewsId; })) {
      expandedNewsId = "";
    }
    renderNewsRecommendations();
    if (showingAll) {
      newsGrid?.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "start" });
    }
  });

  bindDedicatedTabs(paperTabs, "paperMode", ["latest", "hot", "following"], setPaperMode);
  paperTimeRange?.addEventListener("change", function () {
    paperVisibleCount = MODULE_PAGE_SIZE;
    expandedPaperId = "";
    renderPapers();
  });
  paperSavedOnly?.addEventListener("change", function () {
    paperVisibleCount = MODULE_PAGE_SIZE;
    expandedPaperId = "";
    renderPapers();
  });
  paperMoreButton?.addEventListener("click", function () {
    const items = getPaperItems();
    const showingAll = paperVisibleCount >= items.length;
    paperVisibleCount = showingAll ? MODULE_PAGE_SIZE : Math.min(items.length, paperVisibleCount + MODULE_PAGE_SIZE);
    if (showingAll && !items.slice(0, MODULE_PAGE_SIZE).some(function (item) { return item.id === expandedPaperId; })) expandedPaperId = "";
    renderPapers();
  });
  paperList?.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button || !paperList.contains(button)) return;
    if (button.dataset.paperRecover === "all") {
      if (paperSavedOnly) paperSavedOnly.checked = false;
      if (paperTimeRange) paperTimeRange.value = "all";
      renderPapers();
      paperSavedOnly?.focus();
      return;
    }
    if (button.dataset.paperRecover === "talent") {
      talentLibrary?.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "center" });
      window.setTimeout(function () { talentLibrary?.querySelector("[data-author-follow]")?.focus(); }, prefersReducedMotion.matches ? 0 : 360);
      return;
    }
    if (button.dataset.paperSave) {
      const id = button.dataset.paperSave;
      const wasSaved = paperState.saved.includes(id);
      togglePaperSave(id);
      const focusSelector = paperSavedOnly?.checked && wasSaved
        ? "[data-paper-save], [data-paper-recover='all']"
        : "[data-paper-save='" + id + "']";
      focusRenderedControl(paperList, focusSelector);
      return;
    }
    if (button.dataset.paperAction && button.dataset.paperId) {
      const id = button.dataset.paperId;
      const action = button.dataset.paperAction;
      const sameOpenDetail = expandedPaperId === id && action === "detail";
      expandedPaperId = sameOpenDetail ? "" : id;
      paperDetailIntent = action;
      renderPapers();
      if (expandedPaperId) {
        const selectors = {
          detail: "[data-paper-action='detail'][data-paper-id='" + id + "']",
          citation: "#rec-paper-citation-" + id + " [data-paper-citation-mode]",
          rating: "#rec-paper-rating-" + id + " input[type='radio']",
          comments: "#rec-paper-comments-" + id + " textarea"
        };
        focusRenderedControl(paperList, selectors[paperDetailIntent]);
      } else focusRenderedControl(paperList, "[data-paper-action='detail'][data-paper-id='" + id + "']");
      return;
    }
    if (button.dataset.paperCitationMode && button.dataset.paperId) {
      paperCitationModes[button.dataset.paperId] = button.dataset.paperCitationMode;
      renderPapers();
      focusRenderedControl(paperList, "[data-paper-citation-mode='" + button.dataset.paperCitationMode + "'][data-paper-id='" + button.dataset.paperId + "']");
      return;
    }
    if (button.dataset.paperCopyCitation) {
      copyTextWithFallback(button.dataset.citationText || "", button.closest(".rec-paper-citation"));
      return;
    }
    if (button.dataset.paperClearRating) {
      const id = button.dataset.paperClearRating;
      const nextRatings = { ...paperState.ratings };
      delete nextRatings[id];
      savePaperState({ ...paperState, ratings: nextRatings });
      renderPapers();
      showToast("已清除我的评分");
      focusRenderedControl(paperList, "#rec-paper-rating-" + id + " input[type='radio']");
      return;
    }
    if (button.dataset.paperWithdrawComment && button.dataset.commentId) {
      const id = button.dataset.paperWithdrawComment;
      const commentId = button.dataset.commentId;
      const withdrawnComment = (paperState.comments[id] || []).find(function (comment) { return comment.id === commentId; });
      if (!withdrawnComment) return;
      const comments = { ...paperState.comments, [id]: (paperState.comments[id] || []).filter(function (comment) { return comment.id !== commentId; }) };
      savePaperState({ ...paperState, comments: comments });
      renderPapers();
      showToast("待审核评论已撤回", {
        label: "撤销",
        onAction: function () {
          const current = paperState.comments[id] || [];
          const restored = current.some(function (comment) { return comment.id === withdrawnComment.id; })
            ? current
            : current.concat(withdrawnComment).sort(function (left, right) { return Date.parse(left.createdAt) - Date.parse(right.createdAt); });
          savePaperState({ ...paperState, comments: { ...paperState.comments, [id]: restored } });
          renderPapers();
          focusRenderedControl(paperList, "#rec-paper-comments-" + id + " textarea");
        }
      });
      focusRenderedControl(paperList, "#rec-paper-comments-" + id + " textarea");
    }
  });
  paperList?.addEventListener("keydown", function (event) {
    const tab = event.target.closest("button[data-paper-citation-mode][data-paper-id]");
    if (!tab || !paperList.contains(tab)) return;
    const tabs = Array.from(tab.closest(".rec-citation-tabs")?.querySelectorAll("[data-paper-citation-mode]") || []);
    const index = tabs.indexOf(tab);
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    const nextMode = tabs[nextIndex]?.dataset.paperCitationMode;
    if (!nextMode) return;
    paperCitationModes[tab.dataset.paperId] = nextMode;
    renderPapers();
    focusRenderedControl(paperList, "[data-paper-citation-mode='" + nextMode + "'][data-paper-id='" + tab.dataset.paperId + "']");
  });
  paperList?.addEventListener("change", function (event) {
    const input = event.target.closest("input[data-paper-rating]");
    if (!input || !paperList.contains(input)) return;
    const id = input.dataset.paperRating;
    const rating = Number(input.value);
    savePaperState({ ...paperState, ratings: { ...paperState.ratings, [id]: rating } });
    renderPapers();
    showToast("我的评分已更新为 " + rating + " 分");
    focusRenderedControl(paperList, "#rec-paper-rating-" + id + " input[value='" + rating + "']");
  });
  paperList?.addEventListener("submit", function (event) {
    const form = event.target.closest("form[data-paper-comment-form]");
    if (!form || !paperList.contains(form)) return;
    event.preventDefault();
    const id = form.dataset.paperCommentForm;
    const textarea = form.querySelector("textarea[name='comment']");
    const text = textarea?.value.trim() || "";
    if (text.length < 5 || text.length > 300) {
      showToast("评论需为 5–300 字，请修改后再提交");
      textarea?.focus();
      return;
    }
    const comment = { id: "comment-" + Date.now().toString(36), text: text, createdAt: new Date().toISOString(), status: "pending" };
    const nextComments = { ...paperState.comments, [id]: (paperState.comments[id] || []).concat(comment) };
    savePaperState({ ...paperState, comments: nextComments });
    renderPapers();
    showToast("评论已提交审核，仅你本人可见；不会自动公开", {
      label: "撤回",
      onAction: function () {
        const comments = { ...paperState.comments, [id]: (paperState.comments[id] || []).filter(function (item) { return item.id !== comment.id; }) };
        savePaperState({ ...paperState, comments: comments });
        renderPapers();
      }
    });
    focusRenderedControl(paperList, "#rec-paper-comments-" + id + " textarea");
  });

  bindDedicatedTabs(reportTabs, "reportMode", ["latest", "hot", "exclusive"], setReportMode);
  reportRule?.addEventListener("change", function () {
    reportVisibleCount = MODULE_PAGE_SIZE;
    expandedReportId = "";
    renderReports();
  });
  reportAudienceFilters?.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-report-audience]");
    if (!button || !reportAudienceFilters.contains(button)) return;
    activeReportAudience = ["government", "research", "innovation"].includes(button.dataset.reportAudience) ? button.dataset.reportAudience : "government";
    reportAudienceFilters.querySelectorAll("[data-report-audience]").forEach(function (candidate) {
      const selected = candidate.dataset.reportAudience === activeReportAudience;
      candidate.classList.toggle("is-active", selected);
      candidate.setAttribute("aria-pressed", String(selected));
    });
    reportVisibleCount = MODULE_PAGE_SIZE;
    expandedReportId = "";
    renderReports();
  });
  reportMoreButton?.addEventListener("click", function () {
    const items = getReportItems();
    const showingAll = reportVisibleCount >= items.length;
    reportVisibleCount = showingAll ? MODULE_PAGE_SIZE : Math.min(items.length, reportVisibleCount + MODULE_PAGE_SIZE);
    renderReports();
  });
  reportGrid?.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button || !reportGrid.contains(button)) return;
    if (button.dataset.reportRecover) {
      setReportMode("latest", true);
      return;
    }
    if (button.dataset.reportToggle) {
      const id = button.dataset.reportToggle;
      expandedReportId = expandedReportId === id ? "" : id;
      if (expandedReportId && !reportViewedThisSession.has(id)) {
        reportViewedThisSession.add(id);
        if (!reportState.viewed.includes(id)) saveReportState({ ...reportState, viewed: reportState.viewed.concat(id) });
      }
      renderReports();
      focusRenderedControl(reportGrid, "[data-report-toggle='" + id + "']");
      return;
    }
    if (button.dataset.reportSave) {
      toggleReportPersonalState(button.dataset.reportSave, "saved", "已收藏报告", "已取消收藏报告");
      focusRenderedControl(reportGrid, "[data-report-save='" + button.dataset.reportSave + "']");
      return;
    }
    if (button.dataset.reportLike) {
      toggleReportPersonalState(button.dataset.reportLike, "liked", "已点赞报告", "已取消点赞报告");
      focusRenderedControl(reportGrid, "[data-report-like='" + button.dataset.reportLike + "']");
    }
  });

  talentLibrary?.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-author-follow]");
    if (!button || !talentLibrary.contains(button)) return;
    const id = button.dataset.authorFollow;
    setAuthorFollowing(id);
    focusRenderedControl(talentLibrary, "[data-author-follow='" + id + "']");
  });
  authorUpdates?.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button || !authorUpdates.contains(button)) return;
    if (button.dataset.authorLocateLibrary) {
      talentLibrary?.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "center" });
      window.setTimeout(function () { talentLibrary?.querySelector("[data-author-follow]")?.focus(); }, prefersReducedMotion.matches ? 0 : 360);
      return;
    }
    if (button.dataset.authorUpdateToggle) {
      const id = button.dataset.authorUpdateToggle;
      expandedAuthorUpdateId = expandedAuthorUpdateId === id ? "" : id;
      renderTalentRecommendations();
      focusRenderedControl(authorUpdates, "[data-author-update-toggle='" + id + "']");
      return;
    }
    if (button.dataset.authorDismiss) {
      dismissFormerAuthor(button.dataset.authorDismiss);
      focusRenderedControl(authorUpdates, "[data-author-update-toggle]");
    }
  });

  bindDedicatedTabs(conferenceTabs, "conferenceMode", ["recent", "hot"], setConferenceMode);
  conferenceMoreButton?.addEventListener("click", function () {
    const items = getConferenceItems();
    const showingAll = conferenceVisibleCount >= items.length;
    conferenceVisibleCount = showingAll ? MODULE_PAGE_SIZE : Math.min(items.length, conferenceVisibleCount + MODULE_PAGE_SIZE);
    renderConferences();
  });
  conferenceGrid?.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button || !conferenceGrid.contains(button)) return;
    if (button.dataset.conferenceToggle || button.dataset.conferenceSubmission) {
      const id = button.dataset.conferenceToggle || button.dataset.conferenceSubmission;
      expandedConferenceId = button.dataset.conferenceToggle && expandedConferenceId === id ? "" : id;
      renderConferences();
      focusRenderedControl(conferenceGrid, "[data-conference-toggle='" + id + "']");
      if (button.dataset.conferenceSubmission) showToast("当前仅展示投稿说明，未接入真实官方投稿入口");
    }
  });

  courseMoreButton?.addEventListener("click", function () {
    const showingAll = courseVisibleCount >= COURSE_ITEMS.length;
    courseVisibleCount = showingAll ? MODULE_PAGE_SIZE : Math.min(COURSE_ITEMS.length, courseVisibleCount + MODULE_PAGE_SIZE);
    renderCourses();
  });
  courseGrid?.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button || !courseGrid.contains(button)) return;
    if (button.dataset.courseToggle) {
      const id = button.dataset.courseToggle;
      expandedCourseId = expandedCourseId === id ? "" : id;
      renderCourses();
      focusRenderedControl(courseGrid, "[data-course-toggle='" + id + "']");
      return;
    }
    if (button.dataset.courseSave) {
      toggleCourseSave(button.dataset.courseSave);
      focusRenderedControl(courseGrid, "[data-course-save='" + button.dataset.courseSave + "']");
    }
  });

  bindDedicatedTabs(eventTabs, "eventMode", ["combined", "technology", "topic", "archive"], setEventMode);
  eventMoreButton?.addEventListener("click", function () {
    const items = getEventItems();
    const showingAll = eventVisibleCount >= items.length;
    eventVisibleCount = showingAll ? MODULE_PAGE_SIZE : Math.min(items.length, eventVisibleCount + MODULE_PAGE_SIZE);
    renderEvents();
  });
  eventGrid?.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button || !eventGrid.contains(button)) return;
    if (button.dataset.eventRecover) {
      setEventMode(button.dataset.eventRecover, true);
      return;
    }
    if (button.dataset.eventToggle) {
      const id = button.dataset.eventToggle;
      expandedEventId = expandedEventId === id ? "" : id;
      expandedEventRecordId = "";
      renderEvents();
      focusRenderedControl(eventGrid, "[data-event-toggle='" + id + "']");
      return;
    }
    if (button.dataset.eventRecordToggle) {
      const id = button.dataset.eventRecordToggle;
      expandedEventRecordId = expandedEventRecordId === id ? "" : id;
      renderEvents();
      focusRenderedControl(eventGrid, "[data-event-record-toggle='" + id + "']");
      return;
    }
    if (button.dataset.eventRegister) {
      toggleEventRegistration(button.dataset.eventRegister);
      focusRenderedControl(eventGrid, "[data-event-register='" + button.dataset.eventRegister + "']");
    }
  });

  function setActiveSection(sectionId) {
    sectionLinks.forEach(function (link) {
      const selected = link.dataset.sectionLink === sectionId;
      link.classList.toggle("is-active", selected);
      if (selected) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    const activeLink = sectionLinks.find(function (link) {
      return link.dataset.sectionLink === sectionId;
    });
    if (activeLink && contentNav && contentNav.scrollWidth > contentNav.clientWidth) {
      const targetLeft = activeLink.offsetLeft - (contentNav.clientWidth - activeLink.offsetWidth) / 2;
      contentNav.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: prefersReducedMotion.matches ? "auto" : "smooth"
      });
    }
  }

  sectionLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const sectionId = link.dataset.sectionLink;
      const section = document.getElementById(sectionId);
      if (!section) return;
      event.preventDefault();
      setActiveSection(sectionId);
      section.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });
      try {
        window.history.replaceState(null, "", window.location.pathname + window.location.search + "#" + sectionId);
      } catch (_error) {
        // Hash navigation still works when history replacement is unavailable.
      }
    });
  });

  document.querySelectorAll("[data-back-home]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("source") !== "home" || window.history.length <= 1) return;
      event.preventDefault();
      window.history.back();
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
      const scrollAnchor = (parseFloat(window.getComputedStyle(sections[0]).scrollMarginTop) || 118) + 80;
      let activeSection = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= scrollAnchor) activeSection = section;
        else break;
      }
      if (activeSection) setActiveSection(activeSection.id);
    }, {
      rootMargin: "0px 0px -58% 0px",
      threshold: [0.02, 0.16]
    });
    sections.forEach(function (section) { observer.observe(section); });
  }

  function panelContentFor(panel) {
    return panel.querySelector(
      ".rec-news-grid, .rec-paper-list, .rec-report-grid, .rec-conference-grid"
    );
  }

  document.querySelectorAll(".rec-panel-tabs").forEach(function (tablist, tablistIndex) {
    if (tablist.querySelector("[data-news-mode], [data-paper-mode], [data-report-mode], [data-conference-mode], [data-event-mode]")) return;
    const tabs = Array.from(tablist.querySelectorAll("[data-panel-tab]"));
    if (!tabs.length) return;
    const panel = tablist.closest(".rec-panel");
    const content = panelContentFor(panel);
    const originalItems = content ? Array.from(content.children) : [];

    if (content) {
      content.id = content.id || "rec-tabpanel-" + tablistIndex;
      content.setAttribute("role", "tabpanel");
    }

    function selectPanelTab(tab, tabIndex, moveFocus) {
      tabs.forEach(function (candidate, candidateIndex) {
        const selected = candidate === tab;
        candidate.classList.toggle("is-active", selected);
        candidate.setAttribute("aria-selected", String(selected));
        candidate.tabIndex = selected ? 0 : -1;
        candidate.id = candidate.id || "rec-tab-" + tablistIndex + "-" + candidateIndex;
        if (content) candidate.setAttribute("aria-controls", content.id);
      });

      if (content) {
        content.setAttribute("aria-labelledby", tab.id);
        panel.classList.add("is-updating");
        const offset = tabIndex % Math.max(originalItems.length, 1);
        const ordered = originalItems.slice(offset).concat(originalItems.slice(0, offset));
        ordered.forEach(function (item) { content.appendChild(item); });
        window.setTimeout(function () { panel.classList.remove("is-updating"); }, 160);
      }
      if (moveFocus) tab.focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        selectPanelTab(tab, index, false);
      });
      tab.addEventListener("keydown", function (event) {
        let nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = tabs.length - 1;
        else return;
        event.preventDefault();
        selectPanelTab(tabs[nextIndex], nextIndex, true);
      });
    });

    if (tabs[0]) selectPanelTab(tabs[0], 0, false);
  });

  document.querySelectorAll("[data-follow-button]").forEach(function (button) {
    const compact = button.textContent.trim() === "＋";
    button.addEventListener("click", function () {
      const following = !button.classList.contains("is-following");
      button.classList.toggle("is-following", following);
      button.setAttribute("aria-pressed", String(following));
      if (compact) button.textContent = following ? "✓" : "＋";
      else {
        const count = button.querySelector("small")?.textContent || "";
        button.innerHTML = (following ? "已关注 " : "关注 ") + (count ? "<small>" + count + "</small>" : "");
      }
      showToast(following ? "已在本次原型会话中关注" : "已取消本次原型会话中的关注");
    });
  });

  autoFollowCheckbox?.addEventListener("change", function () {
    const nextState = { ...watchState, autoFollow: autoFollowCheckbox.checked };
    if (!saveWatchState(nextState)) {
      autoFollowCheckbox.checked = watchState.autoFollow;
      return;
    }
    renderKeywordFollows();
    showToast(watchState.autoFollow ? "搜索词自动关注已开启" : "搜索词自动关注已关闭");
  });

  keywordFollowGrid?.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button || !keywordFollowGrid.contains(button)) return;

    if (button.dataset.focusKeywordSearch) {
      document.querySelector(".rec-hero")?.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });
      window.setTimeout(function () { searchInput?.focus(); }, prefersReducedMotion.matches ? 0 : 360);
      return;
    }

    if (button.dataset.keywordFollow) {
      const result = upsertKeywordWatch(button.dataset.keywordFollow, "manual", activeMode);
      if (result.status === "created") {
        renderKeywordFollows();
        focusGridControl("data-watch-toggle", result.watch.key);
        showToast("已关注“" + result.watch.keyword + "”，3 条相关动态已生成", {
          label: "查看动态",
          onAction: function () {
            expandedWatchKey = result.watch.key;
            expandedUpdateId = "";
            renderKeywordFollows();
            const card = Array.from(keywordFollowGrid.querySelectorAll("[data-keyword-watch-card]")).find(function (node) {
              return node.dataset.keywordWatchCard === result.watch.key;
            });
            card?.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "center" });
            focusGridControl("data-watch-toggle", result.watch.key);
          }
        });
      } else if (result.status === "existing") {
        expandedWatchKey = result.watch.key;
        renderKeywordFollows();
        focusGridControl("data-watch-toggle", result.watch.key);
        showToast("该词汇已在关注中");
      } else if (result.status === "limit") {
        showToast("最多可同时关注 " + KEYWORD_WATCH_LIMIT + " 个词汇，请先停止一个关注");
      }
      return;
    }

    if (button.dataset.watchToggle) {
      const watchKey = button.dataset.watchToggle;
      expandedWatchKey = expandedWatchKey === watchKey ? "" : watchKey;
      expandedUpdateId = "";
      pendingRemovalKey = "";
      window.clearTimeout(pendingRemovalTimer);
      renderKeywordFollows();
      focusGridControl("data-watch-toggle", watchKey);
      return;
    }

    if (button.dataset.watchUpdate && button.dataset.updateId) {
      markUpdateRead(button.dataset.watchUpdate, button.dataset.updateId);
      return;
    }

    if (button.dataset.markWatchRead) {
      markWatchRead(button.dataset.markWatchRead);
      return;
    }

    if (button.dataset.stopWatch) stopWatching(button.dataset.stopWatch);
  });

  keywordFollowGrid?.addEventListener("change", function (event) {
    const select = event.target.closest("select[data-watch-frequency]");
    if (!select || !keywordFollowGrid.contains(select)) return;
    updateWatchFrequency(select.dataset.watchFrequency, select.value);
  });

  messageButton?.addEventListener("click", function () {
    const unreadWatch = watchState.watches.find(function (watch) { return unreadCountFor(watch) > 0; });
    if (!unreadWatch) {
      showToast("暂无未读词汇动态；完整消息中心将在账号体系接入后开放");
      return;
    }
    expandedWatchKey = unreadWatch.key;
    expandedUpdateId = "";
    renderKeywordFollows();
    const card = Array.from(keywordFollowGrid?.querySelectorAll("[data-keyword-watch-card]") || []).find(function (node) {
      return node.dataset.keywordWatchCard === unreadWatch.key;
    });
    card?.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      block: "center"
    });
    window.setTimeout(function () {
      focusGridControl("data-watch-toggle", unreadWatch.key);
    }, prefersReducedMotion.matches ? 0 : 360);
    showToast("已定位到“" + unreadWatch.keyword + "”未读动态");
  });

  document.querySelectorAll("[data-save-button]").forEach(function (button) {
    const textButton = button.textContent.trim().length > 0;
    button.addEventListener("click", function () {
      const saved = !button.classList.contains("is-saved");
      button.classList.toggle("is-saved", saved);
      button.setAttribute("aria-pressed", String(saved));
      if (textButton) button.textContent = saved ? "已收藏" : "收藏";
      else {
        button.setAttribute("aria-label", saved ? "取消收藏" : "收藏");
        button.title = saved ? "已收藏" : "收藏";
      }
      showToast(saved ? "已在本次原型会话中收藏" : "已取消本次原型会话中的收藏");
    });
  });

  document.querySelectorAll("[data-register-button]").forEach(function (button) {
    button.addEventListener("click", function () {
      const registered = button.getAttribute("aria-pressed") === "true";
      button.setAttribute("aria-pressed", String(!registered));
      button.textContent = registered ? "立即报名" : "已报名";
      button.classList.toggle("is-registered", !registered);
      showToast(registered ? "已取消本次原型会话中的报名" : "报名状态已在原型中更新");
    });
  });

  document.querySelectorAll("[data-demo-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      showToast(button.dataset.demoAction || "此功能为原型演示");
    });
  });

  mobileMenu?.addEventListener("click", function () {
    const open = !mainNav.classList.contains("is-open");
    mainNav.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
  });

  document.addEventListener("click", function (event) {
    if (!mainNav?.classList.contains("is-open")) return;
    if (mainNav.contains(event.target) || mobileMenu?.contains(event.target)) return;
    mainNav.classList.remove("is-open");
    mobileMenu?.setAttribute("aria-expanded", "false");
    mobileMenu?.setAttribute("aria-label", "打开导航");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape" || !mainNav?.classList.contains("is-open")) return;
    mainNav.classList.remove("is-open");
    mobileMenu?.setAttribute("aria-expanded", "false");
    mobileMenu?.setAttribute("aria-label", "打开导航");
    mobileMenu?.focus();
  });

  function initializeFromLocation() {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    if (from === "simulation" && searchInput) {
      searchInput.value = "AI 仿真实验";
      setSearchMode("association", false);
    } else {
      setSearchMode(params.get("mode") || "ai", false);
    }

    const sectionId = window.location.hash.slice(1);
    const target = document.getElementById(sectionId);
    if (target && target.matches("[data-rec-section]")) {
      const alignInitialSection = function () {
        setActiveSection(sectionId);
        const root = document.documentElement;
        const previousInlineBehavior = root.style.scrollBehavior;
        const scrollMargin = parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - scrollMargin;
        root.style.scrollBehavior = "auto";
        window.scrollTo(0, Math.max(0, targetTop));
        root.style.scrollBehavior = previousInlineBehavior;
      };
      window.requestAnimationFrame(alignInitialSection);
      if (document.readyState === "complete") {
        window.setTimeout(alignInitialSection, 60);
      } else {
        window.addEventListener("load", function () {
          window.setTimeout(alignInitialSection, 60);
        }, { once: true });
      }
    } else {
      setActiveSection("hot");
    }
  }

  document.querySelectorAll([
    "[data-news-mode]", "#recNewsHistoryToggle", "#recNewsClearHistory", "#recNewsMore",
    "[data-paper-mode]", "#recPaperTimeRange", "#recPaperSavedOnly", "#recPaperMore",
    "[data-report-mode]", "#recReportRule", "#recReportAudienceFilters button", "#recReportMore",
    "[data-conference-mode]", "#recConferenceMore", "#recCourseMore",
    "[data-event-mode]", "#recEventMore"
  ].join(", ")).forEach(function (control) { control.disabled = false; });

  watchState = loadWatchState();
  newsViewState = loadNewsViewState();
  paperState = loadPaperState();
  authorState = loadAuthorState();
  reportState = loadReportState();
  courseState = loadCourseState();
  eventState = loadEventState();
  renderKeywordFollows();
  setNewsMode("latest", false);
  setPaperMode("latest", false);
  setReportMode("latest", false);
  renderTalentRecommendations();
  setConferenceMode("recent", false);
  renderCourses();
  setEventMode("combined", false);
  initializeFromLocation();

  window.addEventListener("pageshow", function (event) {
    if (!event.persisted) return;
    watchState = loadWatchState();
    newsViewState = loadNewsViewState();
    paperState = loadPaperState();
    authorState = loadAuthorState();
    reportState = loadReportState();
    courseState = loadCourseState();
    eventState = loadEventState();
    renderKeywordFollows();
    setNewsMode(activeNewsMode, false);
    setPaperMode(activePaperMode, false);
    setReportMode(activeReportMode, false);
    renderTalentRecommendations();
    setConferenceMode(activeConferenceMode, false);
    renderCourses();
    setEventMode(activeEventMode, false);
  });
})();
