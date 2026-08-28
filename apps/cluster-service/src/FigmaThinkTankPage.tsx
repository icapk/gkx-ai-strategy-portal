import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  Heart,
  ListChecks,
  Minus,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Target,
  UserRound,
} from "lucide-react";
import PortalHeader from "./PortalHeader";
import PageSectionLocator from "./PageSectionLocator";
import "./figma-think-tank.css";

const assetRoot = "./assets/figma-think-tank";

type ConsultingReport = {
  id: string;
  kind: "push" | "case";
  title: string;
  summary: string;
  field: string;
  institution: string;
  year: string;
  topic: string;
  direction: string;
  analysis: string[];
  recommendations: string[];
};

const reportFields = ["全部领域", "机械运输", "信息电子", "化学与化学工程", "能源动力", "土木建筑", "环境与水利", "农业", "医药卫生"] as const;
const reportTopics = ["全部专题", "新能源专题库", "数字基建专题库", "公共卫生专题库", "环境保护专题库", "人工智能专题库"] as const;

const consultingReports: ConsultingReport[] = [
  {
    id: "ai-capability-2026", kind: "push", title: "人工智能产业发展方向与关键能力建设研究", field: "信息电子", institution: "中国科学院", year: "2026", topic: "人工智能专题库",
    summary: "围绕基础模型、多模态智能、具身智能和行业智能体梳理技术演进路径，分析关键能力、产品形态与应用生态。",
    direction: "从通用能力竞争转向行业知识、工具调用与复杂任务协同，模型能力和工程体系同步演进。",
    analysis: ["基础模型训练、推理与评测工具链持续完善", "多模态理解与具身决策成为重点融合方向", "行业智能体加速进入科研、制造与公共服务场景"],
    recommendations: ["建设可复用的行业数据与评测基准", "围绕重点场景组织技术验证和产品迭代", "建立安全治理、版本管理与效果复盘机制"],
  },
  {
    id: "energy-storage-2026", kind: "push", title: "新型储能技术路线与产业协同研究", field: "能源动力", institution: "深圳战略研究中心", year: "2026", topic: "新能源专题库",
    summary: "梳理电化学储能、长时储能与系统集成的发展重点，分析技术成熟度、关键环节和产业协同方向。",
    direction: "储能技术由单一性能提升转向安全、寿命、成本与系统调度能力的综合优化。",
    analysis: ["电化学储能仍是近期工程化重点", "长时储能在多时间尺度调节场景中加快验证", "系统集成和安全管理成为产业链关键能力"],
    recommendations: ["建立分场景的性能与安全评价口径", "加强关键材料、系统集成与运维环节协同", "持续跟踪示范项目运行数据"],
  },
  {
    id: "public-health-2026", kind: "push", title: "公共卫生科技支撑与应急协同研究", field: "医药卫生", institution: "科技治理研究中心", year: "2026", topic: "公共卫生专题库",
    summary: "围绕监测预警、快速检测、资源调度与协同处置，研究公共卫生科技支撑体系的关键能力。",
    direction: "公共卫生技术体系向实时感知、智能研判和跨部门协同演进。",
    analysis: ["监测数据的及时性和一致性影响研判效率", "检测技术与资源调度需要形成闭环", "跨机构协同依赖统一的数据和流程标准"],
    recommendations: ["完善多源监测数据治理机制", "建设应急资源协同调度能力", "强化技术应用的隐私与安全边界"],
  },
  {
    id: "river-ecology-2025", kind: "push", title: "流域生态治理与水资源协同研究", field: "环境与水利", institution: "湾区产业研究院", year: "2025", topic: "环境保护专题库",
    summary: "从水环境监测、污染溯源、生态修复和资源调度角度分析流域协同治理路径。",
    direction: "流域治理由分段管理转向数据贯通、联合研判和系统修复。",
    analysis: ["监测网络需要覆盖关键断面和风险源", "污染溯源依赖多源数据与模型协同", "生态修复成效需进行长期连续评估"],
    recommendations: ["统一流域监测指标与数据接口", "建立跨区域联合研判机制", "形成治理措施与生态成效的追踪关系"],
  },
  {
    id: "intelligent-manufacturing-2025", kind: "case", title: "高端装备智能制造转型成果案例", field: "机械运输", institution: "先进制造研究中心", year: "2025", topic: "数字基建专题库",
    summary: "展示高端装备企业围绕工艺数据、智能排产和设备预测维护形成的数字化转型成果。",
    direction: "制造现场从单点自动化走向数据贯通、柔性协同与全流程优化。",
    analysis: ["工艺参数和设备状态形成统一数据底座", "智能排产连接订单、产能与物料约束", "预测维护降低非计划停机风险"],
    recommendations: ["持续完善设备与工艺数据标准", "建立模型效果与生产指标的联合评估", "分阶段扩展到更多产线和产品类型"],
  },
  {
    id: "green-chemistry-2025", kind: "case", title: "绿色化工与低碳工艺优化成果案例", field: "化学与化学工程", institution: "绿色技术研究院", year: "2025", topic: "环境保护专题库",
    summary: "展示化工流程在能耗监测、过程优化和副产物资源化方面形成的技术成果与应用路径。",
    direction: "化工过程向低碳原料、连续监测和智能优化协同发展。",
    analysis: ["关键工序能耗和排放数据实现连续采集", "过程参数优化兼顾效率、质量与安全", "副产物资源化形成新的工艺协同环节"],
    recommendations: ["完善全流程碳排放核算边界", "加强工艺优化模型的现场验证", "建立资源化成果的长期效果跟踪"],
  },
  {
    id: "resilient-city-2024", kind: "case", title: "韧性城市与新型建筑工业化成果案例", field: "土木建筑", institution: "城市建设研究院", year: "2024", topic: "数字基建专题库",
    summary: "展示城市基础设施感知、建筑工业化和风险预警技术在韧性城市建设中的应用成果。",
    direction: "城市建设从静态交付转向全生命周期感知、评估和协同维护。",
    analysis: ["基础设施运行状态实现分层感知", "工业化建造提升构件和施工信息一致性", "风险预警连接设施状态与应急流程"],
    recommendations: ["统一设施编码和状态数据标准", "加强建造与运维数据衔接", "形成风险预警到处置反馈的闭环"],
  },
  {
    id: "digital-agriculture-2024", kind: "case", title: "数字农业精准生产与服务成果案例", field: "农业", institution: "现代农业研究中心", year: "2024", topic: "数字基建专题库",
    summary: "展示农业感知、智能决策和生产服务协同形成的精准生产成果。",
    direction: "农业生产向环境感知、精准决策和全程服务协同演进。",
    analysis: ["田间感知数据支持生产过程动态调整", "模型建议与农事记录形成验证闭环", "服务平台连接技术、农资和生产主体"],
    recommendations: ["完善农业数据采集与质量检查", "按作物和区域建立差异化模型", "加强技术服务效果的持续评估"],
  },
];

type TalentNewsItem = {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  field: string;
  scholars: string[];
  likes: number;
  valueScore: number;
  details: string[];
};

const talentNewsItems: TalentNewsItem[] = [
  { id: "embodied-intelligence", title: "具身智能青年学者团队完成多场景机器人协同验证", summary: "团队围绕感知、规划、控制与场景适配完成阶段性验证，形成跨学科人才协作和工程验证的新进展。", source: "中国科学院自动化研究所", publishedAt: "2026-08-26", field: "人工智能", scholars: ["张志康", "周岚"], likes: 4286, valueScore: 96, details: ["完成实验室、制造和公共服务三类场景的协同验证。", "研究团队新增机器人系统、控制算法与工程验证方向人才。", "下一阶段将重点推进真实场景稳定性与安全评测。"] },
  { id: "multimodal-medical", title: "多模态医学智能团队发布跨机构联合评测进展", summary: "联合团队完成医学影像、临床文本和结构化数据的多模态评测，进一步明确青年人才培养与交叉合作方向。", source: "清华大学", publishedAt: "2026-08-25", field: "医学智能", scholars: ["李明", "陈宇"], likes: 3752, valueScore: 94, details: ["评测覆盖影像理解、临床问答和辅助决策三类任务。", "项目形成医学、计算机与数据治理人才的协同培养机制。", "后续将继续扩展多中心验证与可解释性评估。"] },
  { id: "quantum-training", title: "量子精密测量青年人才入选联合培养计划", summary: "联合培养计划面向量子器件、精密测控和系统工程方向，推动高校与科研机构共享课程、实验平台和导师资源。", source: "中国科学技术大学", publishedAt: "2026-08-24", field: "量子信息", scholars: ["林澈", "顾远"], likes: 3018, valueScore: 91, details: ["培养计划覆盖基础理论、核心器件和系统验证环节。", "首批培养对象将进入联合实验室开展跨机构课题研究。", "计划同步建立培养质量与科研成果跟踪机制。"] },
  { id: "synthetic-biology", title: "合成生物工程人才团队推进中试平台能力建设", summary: "团队围绕基因工程、生物制造和中试转化补充复合型人才，并完善公共技术平台的项目协同与成果转化能力。", source: "深圳合成生物研究院", publishedAt: "2026-08-22", field: "合成生物", scholars: ["唐若宁", "苏维", "韩启辰"], likes: 2864, valueScore: 89, details: ["中试平台新增工艺开发、质量控制和工程放大岗位。", "人才团队将按项目阶段参与技术验证和产业协同。", "平台同步完善安全规范、数据记录和成果评价机制。"] },
  { id: "aerospace-intelligence", title: "空天智能研究团队完成卫星数据协同试验", summary: "研究团队在多源卫星数据处理、智能识别和任务协同方面取得新进展，形成算法、系统与应用人才协同机制。", source: "北京航空航天大学", publishedAt: "2026-08-20", field: "空天技术", scholars: ["邵清", "罗予安"], likes: 2516, valueScore: 86, details: ["试验验证多源数据接入和任务协同处理能力。", "团队重点补充遥感算法、系统工程和应用验证人才。", "后续将围绕应急保障和环境监测开展联合研究。"] },
  { id: "trusted-ai", title: "可信人工智能人才网络发布安全评测协作共识", summary: "人才网络围绕模型安全、数据治理和效果评测形成协作共识，推动研究机构与产业团队共享方法和评价口径。", source: "中国计算机学会", publishedAt: "2026-08-18", field: "人工智能", scholars: ["沈璟", "陈嘉禾"], likes: 2208, valueScore: 84, details: ["共识明确模型风险、数据风险和应用风险三类评价维度。", "人才网络将持续组织评测工具与典型案例交流。", "后续计划建立跨机构问题反馈和版本复盘机制。"] },
];

const migrationStops = [
  { city: "多伦多", country: "加拿大", date: "2006.09–2008.07", papers: 5 },
  { city: "巴黎", country: "法国", date: "2008.09–2011.07", papers: 9 },
  { city: "北京", country: "中国", date: "2011.09–2014.07", papers: 13 },
  { city: "新加坡", country: "新加坡", date: "2014.09–2017.07", papers: 19 },
  { city: "深圳", country: "中国", date: "2017.09–2020.07", papers: 23 },
  { city: "上海", country: "中国", date: "2020.09–至今", papers: 30 },
];

const technologyBranches = [
  {
    name: "机器学习",
    papers: 3287,
    leaves: [
      { name: "深度学习", papers: 1234, relation: "核心分支" },
      { name: "强化学习", papers: 890, relation: "关联分支" },
      { name: "迁移学习", papers: 654, relation: "延伸分支" },
    ],
  },
  {
    name: "计算机视觉",
    papers: 2168,
    leaves: [
      { name: "目标检测", papers: 890, relation: "核心分支" },
      { name: "图像分割", papers: 654, relation: "关键支撑" },
      { name: "三维视觉", papers: 432, relation: "前沿延伸" },
    ],
  },
  {
    name: "自然语言处理",
    papers: 1986,
    leaves: [
      { name: "知识图谱", papers: 742, relation: "关键支撑" },
      { name: "多模态理解", papers: 698, relation: "交叉融合" },
      { name: "智能体交互", papers: 546, relation: "产品方向" },
    ],
  },
];

type HotTechnology = { name: string; detail: string };
const yearlyTechnologies: Array<{ year: string; items: HotTechnology[] }> = [
  { year: "2025年", items: [{ name: "行业智能体协同", detail: "面向复杂任务编排、工具调用与多智能体协作的技术方向。" }] },
  { year: "2024年", items: [{ name: "具身智能决策控制", detail: "围绕感知、规划、控制闭环与真实环境验证的技术方向。" }] },
  { year: "2023年", items: [{ name: "检索增强生成", detail: "结合领域知识检索、证据引用与生成质量控制的技术方向。" }] },
  { year: "2022年", items: [{ name: "多模态表征学习", detail: "融合文本、图像与结构化数据表征的技术方向。" }] },
  { year: "2021年", items: [{ name: "大规模预训练模型", detail: "以通用语义建模和迁移能力为重点的技术方向。" }] },
];

const technologyMilestones = [
  { id: "m-2021", year: "2021年", technology: "预训练模型工程平台上线", team: "基础模型研发团队", impact: "夯实中文语义建模、训练与评测基础。" },
  { id: "m-2022", year: "2022年", technology: "多模态表征框架完成验证", team: "多模态联合团队", impact: "推动图文理解与生成能力融合。" },
  { id: "m-2023", year: "2023年", technology: "行业知识增强方案形成", team: "知识工程团队", impact: "提升垂直领域检索、问答与证据追溯能力。" },
  { id: "m-2024", year: "2024年", technology: "具身智能决策控制样机", team: "机器人智能团队", impact: "验证感知、规划与控制的闭环协同。" },
  { id: "m-2025", year: "2025年", technology: "行业智能体协同平台发布", team: "智能体工程团队", impact: "支持多智能体任务编排与工具调用。" },
] as const;

const roadmapLevels = [
  {
    id: "goal",
    label: "发展目标",
    title: "形成可持续演进的人工智能技术体系",
    description: "围绕基础能力、前沿方向与行业应用构建可跟踪、可评估的发展目标。",
    icon: Target,
    items: [
      { label: "发展方向", value: "基础模型、多模态智能、具身智能与行业智能体" },
      { label: "能力目标", value: "增强训练推理、知识融合、任务规划与安全评测能力" },
      { label: "成果目标", value: "形成可复用的技术组件、产品原型与评测方法" },
    ],
  },
  {
    id: "task",
    label: "具体任务",
    title: "将关键技术转化为可验证任务与核心产品",
    description: "按技术攻关、产品形成和场景验证组织任务，避免路线只停留在名词清单。",
    icon: ListChecks,
    items: [
      { label: "关键技术", value: "多模态理解、具身智能决策、行业知识增强" },
      { label: "核心产品", value: "基础模型工具链、行业智能体平台、智能评测服务" },
      { label: "验证任务", value: "完成数据准备、原型验证、指标评测与应用反馈闭环" },
    ],
  },
  {
    id: "safeguard",
    label: "保障措施",
    title: "建立数据、人才与治理协同保障",
    description: "用可追溯的数据底座、跨团队协作和安全评测支撑技术路线持续推进。",
    icon: ShieldCheck,
    items: [
      { label: "数据与算力", value: "建立数据质量、授权边界、算力调度和过程记录机制" },
      { label: "人才与协同", value: "组织基础研究、工程研发与行业专家协同验证" },
      { label: "评测与治理", value: "统一指标口径、风险检查、版本管理和阶段复盘" },
    ],
  },
] as const;

const thinkTankLocatorItems = [
  { id: "technology", label: "领域技术路线" },
  { id: "reports", label: "战略咨询报告" },
  { id: "talent", label: "人才分布态势" },
  { id: "mobility", label: "人才流动趋势" },
  { id: "news", label: "人才动态资讯" },
];

function SectionHeading({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  return (
    <header className="fp-section-heading ttf-heading">
      <img src={`${assetRoot}/section-icon.png`} alt="" />
      <div className="fp-section-heading-copy"><h2>{title}</h2><p>{subtitle}</p></div>
      {children ? <div className="fp-section-heading-actions">{children}</div> : null}
    </header>
  );
}

function MiniSelect({ label, value }: { label?: string; value: string }) {
  return <span className="ttf-mini-select">{label ? <small>{label}</small> : null}<b>{value}</b><ChevronDown size={14} /></span>;
}

function PanelTitle({ title, aside }: { title: string; aside?: ReactNode }) {
  return <header className="ttf-panel-title"><h3>{title}</h3>{aside ? <span>{aside}</span> : null}</header>;
}

function MetricStrip({ items }: { items: Array<{ label: string; value: string; trend?: string; danger?: boolean }> }) {
  return <div className="fp-card ttf-metric-strip">{items.map((item) => <div key={item.label}><small>{item.label}</small><span><strong className={item.danger ? "is-danger" : ""}>{item.value}</strong>{item.trend ? <em>▲ {item.trend} 较去年</em> : null}</span></div>)}</div>;
}

function LineChart() {
  return (
    <svg className="ttf-line-chart" viewBox="0 0 820 220" role="img" aria-label="2021至2025年技术发展概览：技术总量约为40、45、70、100、110，突破性技术约为30、35、60、90、100。">
      <defs>
        <linearGradient id="ttf-blue-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#1877ff" stopOpacity=".18"/><stop offset="1" stopColor="#1877ff" stopOpacity="0"/></linearGradient>
        <linearGradient id="ttf-green-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#00bc37" stopOpacity=".15"/><stop offset="1" stopColor="#00bc37" stopOpacity="0"/></linearGradient>
      </defs>
      {[28,68,108,148,188].map((y) => <line key={y} x1="52" y1={y} x2="796" y2={y} stroke="#e5e9ef" strokeDasharray="3 4" />)}
      {[0,30,60,90,120].map((n,index)=><text key={n} x="40" y={192-index*40} textAnchor="end">{n}</text>)}
      {["2021","2022","2023","2024","2025"].map((year,index)=><text key={year} x={70+index*178} y="214" textAnchor="middle">{year}</text>)}
      <path d="M70 135 L248 128 L426 95 L604 55 L782 41 L782 188 L70 188Z" fill="url(#ttf-blue-fill)" />
      <path d="M70 148 L248 141 L426 108 L604 68 L782 55 L782 188 L70 188Z" fill="url(#ttf-green-fill)" />
      <polyline points="70,135 248,128 426,95 604,55 782,41" fill="none" stroke="#1877ff" strokeWidth="3" />
      <polyline points="70,148 248,141 426,108 604,68 782,55" fill="none" stroke="#00bc37" strokeWidth="3" />
      {["70,135","248,128","426,95","604,55","782,41"].map((p)=><circle key={p} cx={p.split(",")[0]} cy={p.split(",")[1]} r="5" fill="#1877ff" />)}
      {["70,148","248,141","426,108","604,68","782,55"].map((p)=><circle key={p} cx={p.split(",")[0]} cy={p.split(",")[1]} r="5" fill="#00bc37" />)}
    </svg>
  );
}

function TechnologySection() {
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(() => new Set(technologyBranches.map((item) => item.name)));
  const [treeScale, setTreeScale] = useState(1);
  const [treeQuery, setTreeQuery] = useState("");
  const [activeRoadmapLevel, setActiveRoadmapLevel] = useState<(typeof roadmapLevels)[number]["id"]>("goal");
  const [selectedHotTechnology, setSelectedHotTechnology] = useState<HotTechnology>(yearlyTechnologies[0].items[0]);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<(typeof technologyMilestones)[number]["id"]>(technologyMilestones[0].id);
  const [selectedNode, setSelectedNode] = useState({ title: "人工智能", detail: "12,345 篇论文 · 3 条关键技术路线 · 9 个细分技术节点" });
  const normalizedQuery = treeQuery.trim();
  const activeRoadmap = roadmapLevels.find((level) => level.id === activeRoadmapLevel) ?? roadmapLevels[0];
  const activeMilestone = technologyMilestones.find((item) => item.id === selectedMilestoneId) ?? technologyMilestones[0];
  const visibleBranches = technologyBranches.map((branch) => {
    if (!normalizedQuery || branch.name.includes(normalizedQuery)) return branch;
    return { ...branch, leaves: branch.leaves.filter((leaf) => `${leaf.name}${leaf.relation}`.includes(normalizedQuery)) };
  }).filter((branch) => !normalizedQuery || branch.name.includes(normalizedQuery) || branch.leaves.length);
  const expandedVisibleCount = visibleBranches.filter((branch) => expandedBranches.has(branch.name)).length;
  const toggleBranch = (branchName: string) => {
    setExpandedBranches((current) => {
      const next = new Set(current);
      if (next.has(branchName)) next.delete(branchName);
      else next.add(branchName);
      return next;
    });
  };
  return (
    <section id="technology" className="ttf-section ttf-tech">
      <SectionHeading title="领域技术路线" subtitle="总体画像｜发展目标｜具体任务｜保障措施">
        <span className="ttf-domain-label"><small>当前领域</small><b>人工智能</b></span>
        <label className="ttf-section-search"><input value={treeQuery} onChange={(event) => setTreeQuery(event.target.value)} placeholder="搜索技术分支" aria-label="搜索技术分支"/><Search size={16}/></label>
      </SectionHeading>
      <article className="fp-card ttf-roadmap-panel">
        <nav className="ttf-roadmap-tabs" role="tablist" aria-label="技术发展路线层级">
          {roadmapLevels.map((level) => {
            const Icon = level.icon;
            const active = level.id === activeRoadmapLevel;
            return <button type="button" role="tab" aria-selected={active} aria-controls="ttf-roadmap-detail" className={active ? "is-active" : ""} onClick={() => setActiveRoadmapLevel(level.id)} key={level.id}><Icon size={17} aria-hidden="true"/><span>{level.label}</span></button>;
          })}
        </nav>
        <div id="ttf-roadmap-detail" className="ttf-roadmap-detail" role="tabpanel" aria-live="polite">
          <header><span>{activeRoadmap.label}</span><h3>{activeRoadmap.title}</h3><p>{activeRoadmap.description}</p></header>
          <dl>{activeRoadmap.items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
        </div>
      </article>
      <MetricStrip items={[
        { label: "论文总数", value: "12,345" },
        { label: "学者数量", value: "3,256" },
        { label: "相关技术企业", value: "426" },
        { label: "论文发表环比", value: "+6.2%", danger: true },
      ]} />
      <div className="ttf-tech-overview">
        <article className="fp-card ttf-key-tech">
          <PanelTitle title="近5年热门关键技术" />
          {yearlyTechnologies.map(({ year, items }) => <div className="ttf-key-year" key={year}><b>{year}</b>{items.map((item) => <button type="button" aria-pressed={selectedHotTechnology.name === item.name} className={selectedHotTechnology.name === item.name ? "is-active" : ""} onClick={() => setSelectedHotTechnology(item)} key={item.name}>{item.name}</button>)}</div>)}
          <div className="ttf-key-detail" aria-live="polite"><strong>{selectedHotTechnology.name}</strong><p>{selectedHotTechnology.detail}</p></div>
        </article>
        <div className="ttf-tech-main">
          <article className="fp-card ttf-trend-panel">
            <PanelTitle title="近5年技术发展概览" aside={<span className="ttf-legend"><i className="blue"/>技术总量<i className="green"/>突破性技术</span>} />
            <LineChart />
          </article>
          <article className="fp-card ttf-milestone-panel">
            <PanelTitle title="关键技术发展里程碑轨道" aside="2021年–2025年" />
            <div className="ttf-milestone-track" role="tablist" aria-label="关键技术里程碑">
              {technologyMilestones.map((item) => <button type="button" role="tab" aria-selected={selectedMilestoneId === item.id} aria-controls="ttf-milestone-detail" className={selectedMilestoneId === item.id ? "is-active" : ""} onClick={() => setSelectedMilestoneId(item.id)} key={item.id}><i/><time>{item.year}</time><span>{item.technology}</span></button>)}
            </div>
            <dl id="ttf-milestone-detail" className="ttf-milestone-detail" role="tabpanel" aria-live="polite"><div><dt>时间节点</dt><dd>{activeMilestone.year}</dd></div><div><dt>技术名称</dt><dd>{activeMilestone.technology}</dd></div><div><dt>发明人或团队</dt><dd>{activeMilestone.team}</dd></div><div><dt>技术影响力</dt><dd>{activeMilestone.impact}</dd></div></dl>
          </article>
        </div>
      </div>
      <article className="fp-card ttf-tree-panel">
        <PanelTitle title="关键技术分枝树" aside="节点可点击" />
        <div className="ttf-tree-toolbar">
          <button type="button" onClick={() => setTreeScale((value) => Math.max(.75, Number((value - .1).toFixed(2))))} disabled={treeScale <= .75} aria-label="缩小技术分枝树"><Minus size={14}/></button>
          <span aria-live="polite">{Math.round(treeScale * 100)}%</span>
          <button type="button" onClick={() => setTreeScale((value) => Math.min(1.25, Number((value + .1).toFixed(2))))} disabled={treeScale >= 1.25} aria-label="放大技术分枝树"><Plus size={14}/></button>
          <button className={expandedVisibleCount === visibleBranches.length && visibleBranches.length ? "active" : ""} type="button" disabled={!visibleBranches.length || expandedVisibleCount === visibleBranches.length} onClick={() => setExpandedBranches(new Set(visibleBranches.map((item) => item.name)))}>全部展开</button>
          <button type="button" disabled={!expandedVisibleCount} onClick={() => setExpandedBranches(new Set())}>全部收起</button>
        </div>
        <div className="ttf-tree-viewport" aria-label="人工智能关键技术分枝树，可滚动查看">
          {visibleBranches.length ? <div className="ttf-tree-sizer" style={{ "--ttf-tree-scale": treeScale } as CSSProperties}>
            <div className="ttf-tree-canvas">
              <button type="button" className={`ttf-tree-root${selectedNode.title === "人工智能" ? " is-selected" : ""}`} onClick={() => setSelectedNode({ title: "人工智能", detail: "12,345 篇论文 · 3 条关键技术路线 · 9 个细分技术节点" })}><small>领域主线</small><b>人工智能</b><span>12,345 篇论文</span><em>{technologyBranches.length} 条路线</em></button>
              <ol className="ttf-tree-branches">{visibleBranches.map((branch) => {
                const expanded = expandedBranches.has(branch.name);
                return <li className={expanded ? "is-expanded" : ""} key={branch.name}>
                  <button type="button" className={`ttf-tree-branch${selectedNode.title === branch.name ? " is-selected" : ""}`} aria-expanded={expanded} onClick={() => { toggleBranch(branch.name); setSelectedNode({ title: branch.name, detail: `${branch.papers.toLocaleString("zh-CN")} 篇论文 · ${branch.leaves.length} 个细分节点` }); }}><b>{branch.name}</b><span>{branch.papers.toLocaleString("zh-CN")} 篇论文</span><em>{branch.leaves.length} 项</em></button>
                  {expanded ? <ol className="ttf-tree-leaves">{branch.leaves.map((leaf) => <li key={leaf.name}><button type="button" className={selectedNode.title === leaf.name ? "is-selected" : ""} onClick={() => setSelectedNode({ title: leaf.name, detail: `${leaf.relation} · ${leaf.papers.toLocaleString("zh-CN")} 篇关联论文` })}><span><b>{leaf.name}</b><small>{leaf.relation}</small></span><em>{leaf.papers.toLocaleString("zh-CN")} 篇</em></button></li>)}</ol> : null}
                </li>;
              })}</ol>
            </div>
          </div> : <div className="ttf-tree-empty" role="status"><strong>未找到匹配的技术分支</strong><button type="button" onClick={() => setTreeQuery("")}>清除搜索</button></div>}
        </div>
        <div className="ttf-tree-detail" aria-live="polite"><strong>{selectedNode.title}</strong><span>{selectedNode.detail}</span><small>点击主干展开或收起细分节点</small></div>
      </article>
    </section>
  );
}

function ReportItem({
  report,
  compact = false,
  expanded = false,
  onToggleSummary,
  onOpen,
}: {
  report: ConsultingReport;
  compact?: boolean;
  expanded?: boolean;
  onToggleSummary?: () => void;
  onOpen: () => void;
}) {
  const summaryId = `report-summary-${report.id}`;
  return <article className={`ttf-report-item${compact ? " is-compact" : ""}`}>
    <header><span>{report.kind === "push" ? "定向推送" : "成果案例"}</span><h4>{report.title}</h4></header>
    <p id={summaryId} className={expanded ? "is-expanded" : ""}>{report.summary}</p>
    <div className="ttf-report-tags"><span>{report.field}</span><span>{report.topic}</span></div>
    <footer><span><Building2 size={13}/>{report.institution}</span><span><CalendarDays size={13}/>{report.year}</span></footer>
    <div className="ttf-report-actions">
      {!compact && onToggleSummary ? <button type="button" aria-expanded={expanded} aria-controls={summaryId} onClick={onToggleSummary}>{expanded ? "收起摘要" : "查看摘要"}</button> : null}
      <button className="is-primary" type="button" onClick={onOpen}>{compact ? "查看报告" : "查看完整报告"}</button>
    </div>
  </article>;
}

function ReportDetailPage({ report }: { report: ConsultingReport }) {
  const catalogUrl = new URL(window.location.href);
  catalogUrl.searchParams.delete("report");
  catalogUrl.hash = "reports";
  return <article className="fp-card ttf-report-detail-page">
    <header className="ttf-report-detail-header">
      <a className="ttf-report-detail-back" href={`${catalogUrl.pathname}${catalogUrl.search}${catalogUrl.hash}`}><ChevronLeft size={16}/><span>返回报告列表</span></a>
      <div><span>{report.kind === "push" ? "战略咨询研究报告" : "战略咨询成果案例"}</span><h3>{report.title}</h3><p>{report.summary}</p></div>
    </header>
    <div className="ttf-report-detail-meta"><span><small>领域分类</small>{report.field}</span><span><small>主题分类</small>{report.topic}</span><span><small>所属机构</small>{report.institution}</span><span><small>发表年度</small>{report.year}</span></div>
    <div className="ttf-report-detail-content">
      <section><h4>成果摘要</h4><p>{report.summary}</p></section>
      <section><h4>技术发展方向</h4><p>{report.direction}</p></section>
      <section><h4>分析内容</h4><ul>{report.analysis.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section><h4>技术建议</h4><ol>{report.recommendations.map((item) => <li key={item}>{item}</li>)}</ol></section>
    </div>
  </article>;
}

function ReportsSection() {
  const [tab, setTab] = useState<"push" | "case">("push");
  const [field, setField] = useState<(typeof reportFields)[number]>("全部领域");
  const [institution, setInstitution] = useState("全部机构");
  const [year, setYear] = useState("全部年度");
  const [topic, setTopic] = useState<(typeof reportTopics)[number]>("全部专题");
  const [query, setQuery] = useState("");
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);
  const [recommendationOffset, setRecommendationOffset] = useState(0);
  const institutions = useMemo(() => ["全部机构", ...Array.from(new Set(consultingReports.map((report) => report.institution)))], []);
  const years = useMemo(() => ["全部年度", ...Array.from(new Set(consultingReports.map((report) => report.year))).sort((a, b) => b.localeCompare(a))], []);
  const pushedReports = consultingReports.filter((report) => report.kind === "push");
  const recommendations = Array.from({ length: Math.min(3, pushedReports.length) }, (_, index) => pushedReports[(recommendationOffset + index) % pushedReports.length]);
  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return consultingReports.filter((report) => {
      const matchesKind = report.kind === tab;
      const matchesField = field === "全部领域" || report.field === field;
      const matchesInstitution = institution === "全部机构" || report.institution === institution;
      const matchesYear = year === "全部年度" || report.year === year;
      const matchesTopic = topic === "全部专题" || report.topic === topic;
      const searchable = `${report.title}${report.summary}${report.direction}${report.analysis.join("")}${report.recommendations.join("")}`.toLocaleLowerCase();
      return matchesKind && matchesField && matchesInstitution && matchesYear && matchesTopic && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [field, institution, query, tab, topic, year]);

  const clearFilters = () => {
    setField("全部领域");
    setInstitution("全部机构");
    setYear("全部年度");
    setTopic("全部专题");
    setQuery("");
  };

  const openReport = (report: ConsultingReport) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", "think-tank");
    url.searchParams.set("report", report.id);
    url.hash = "reports";
    window.location.assign(`${url.pathname}${url.search}${url.hash}`);
  };

  return <section id="reports" className="ttf-section ttf-reports">
    <SectionHeading title="战略咨询报告" subtitle="定向推送｜成果案例｜分类检索｜报告详情" />
    <div className="ttf-report-workbench">
      <aside className="fp-card ttf-recommend">
        <h3><Star size={18} fill="#ffaa3a"/>定向推送</h3>
        <p className="ttf-recommend-context">根据已关注的人工智能、新能源与公共卫生领域匹配报告。</p>
        <div className="ttf-recommend-list">{recommendations.map((report) => <ReportItem report={report} compact onOpen={() => openReport(report)} key={report.id}/>)}</div>
        <button type="button" onClick={() => setRecommendationOffset((value) => (value + 1) % pushedReports.length)}><RefreshCw size={16}/>换一批</button>
      </aside>
      <article className="fp-card ttf-report-catalog">
        <header className="ttf-report-catalog-header"><div className="ttf-report-tabs" role="tablist" aria-label="战略咨询报告类型"><button className={tab==="push"?"active":""} type="button" role="tab" aria-selected={tab === "push"} onClick={()=>{setTab("push");setExpandedSummaryId(null);}}>定向推送</button><button className={tab==="case"?"active":""} type="button" role="tab" aria-selected={tab === "case"} onClick={()=>{setTab("case");setExpandedSummaryId(null);}}>成果案例</button></div><span>共 {filteredReports.length} 项</span></header>
        <div className="ttf-report-search"><Search size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索报告标题、方向或建议" aria-label="搜索战略咨询报告"/></div>
        <div className="ttf-report-filters">
          <label><span>领域分类</span><select value={field} onChange={(event) => setField(event.target.value as (typeof reportFields)[number])}>{reportFields.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>所属机构</span><select value={institution} onChange={(event) => setInstitution(event.target.value)}>{institutions.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>发表年度</span><select value={year} onChange={(event) => setYear(event.target.value)}>{years.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>主题分类</span><select value={topic} onChange={(event) => setTopic(event.target.value as (typeof reportTopics)[number])}>{reportTopics.map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>
        <div className="ttf-report-list">{filteredReports.length ? filteredReports.map((report) => <ReportItem report={report} expanded={expandedSummaryId === report.id} onToggleSummary={() => setExpandedSummaryId((current) => current === report.id ? null : report.id)} onOpen={() => openReport(report)} key={report.id}/>) : <div className="ttf-report-empty"><strong>未找到符合条件的报告</strong><p>请调整领域、机构、年度、专题或搜索关键词。</p><button type="button" onClick={clearFilters}>清除筛选</button></div>}</div>
      </article>
    </div>
  </section>;
}

function RadarChart() {
  return <svg className="ttf-radar" viewBox="0 0 360 330" role="img" aria-label="北京与上海人才影响力六维演示对比：上海在人才储备、成果储备、学术影响力、顶级专家和产业转化维度较高，北京在新兴学者维度较高。">
    {[1,.75,.5,.25].map((scale)=><polygon key={scale} points={`180,${35+(1-scale)*125} ${288-(1-scale)*108},${98+(1-scale)*62} ${288-(1-scale)*108},${222-(1-scale)*62} 180,${285-(1-scale)*125} ${72+(1-scale)*108},${222-(1-scale)*62} ${72+(1-scale)*108},${98+(1-scale)*62}`} fill="none" stroke="#d9e0e8"/>) }
    {["180,35","288,98","288,222","180,285","72,222","72,98"].map((p)=><line key={p} x1="180" y1="160" x2={p.split(",")[0]} y2={p.split(",")[1]} stroke="#e4e8ee"/>)}
    <polygon points="180,62 267,110 255,211 180,268 91,211 87,110" fill="rgba(24,119,255,.11)" stroke="#1877ff" strokeWidth="2"/>
    <polygon points="180,51 280,103 267,215 180,279 83,207 97,118" fill="rgba(0,188,55,.08)" stroke="#00bc37" strokeWidth="2"/>
    {[[180,18,"人才储备"],[310,90,"成果储备"],[310,232,"学术影响力"],[180,318,"顶级专家"],[50,232,"产业转化"],[50,90,"新兴学者"]].map(([x,y,t])=><text key={String(t)} x={Number(x)} y={Number(y)} textAnchor={Number(x)===180?"middle":Number(x)>180?"start":"end"}>{t}</text>)}
  </svg>;
}

function TalentSection() {
  const bars=[12580,10500,8900,6800,5200];
  return <section id="talent" className="ttf-section ttf-talent">
    <SectionHeading title="人才分布态势区" subtitle="人才地理分布｜影响力对比｜热点分析"><MiniSelect label="当前领域" value="人工智能"/></SectionHeading>
    <MetricStrip items={[{label:"人才总数",value:"12,345",trend:"15%"},{label:"成果总数",value:"3,256",trend:"15%"},{label:"环比增加成果数",value:"+1,345",danger:true}]}/>
    <div className="ttf-talent-top">
      <article className="fp-card ttf-city-bars"><PanelTitle title="全国人才分布" aside="TOP 5 城市排名"/><div>{["北京","上海","深圳","杭州","广州"].map((city,index)=><div className="ttf-bar-row" key={city}><span>{city}</span><i><b style={{width:`${bars[index]/140}%`}}/></i></div>)}</div><footer>{["0","3,500","7,000","10,500","14,000"].map(v=><span key={v}>{v}</span>)}</footer></article>
      <article className="fp-card ttf-influence"><PanelTitle title="地区影响力对比"/><div className="ttf-city-selects"><MiniSelect label="城市一" value="北京"/><span>对比</span><MiniSelect label="城市二" value="上海"/></div><RadarChart/><div className="ttf-radar-legend"><span><i className="blue"/>北京</span><span><i className="green"/>上海</span></div></article>
    </div>
    <div className="ttf-talent-bottom">
      <article className="fp-card ttf-wordcloud"><PanelTitle title="科研热点" aside="近5年热词"/><div className="ttf-wordcloud-body"><span className="ttf-cloud-row"><b>具身智能</b><strong>计算机视觉</strong><b>多模态</b></span><span className="ttf-cloud-row"><span>智能体</span><strong>大模型</strong><b>机器学习</b></span><span className="ttf-cloud-row"><em>强化学习</em><strong>自然语言处理</strong></span></div></article>
      <article className="fp-card ttf-institution"><PanelTitle title="人才机构排名-TOP5" aside={<MiniSelect label="所选城市" value="北京"/>}/><ol>{["中国科学院","清华大学","北京大学","中国工程院","北京航空航天大学"].map((name,index)=><li key={name}><b>0{index+1}</b><span>{name}</span></li>)}</ol></article>
    </div>
  </section>;
}

function CareerRadar() {
  const rings = [
    "165,24 280,86 280,168 165,230 50,168 50,86",
    "165,50 251,96 251,158 165,204 79,158 79,96",
    "165,75 223,107 223,148 165,179 107,148 107,107",
    "165,101 194,117 194,137 165,153 136,137 136,117",
  ];
  const axes = [[165,24],[280,86],[280,168],[165,230],[50,168],[50,86]];
  return <svg className="ttf-career-radar" viewBox="0 0 330 250" role="img" aria-label="学术生涯驻点演示分布：加拿大多伦多、法国巴黎、中国北京、美国斯坦福、中国深圳和中国上海六个驻点。">
    {rings.map((points)=><polygon key={points} points={points} fill="none" stroke="#d9e0e8"/>)}
    {axes.map(([x,y])=><line key={`${x}-${y}`} x1="165" y1="127" x2={x} y2={y} stroke="#e5e9ef"/>)}
    <polygon points="165,64 240,102 235,157 165,194 87,157 100,105" fill="rgba(24,119,255,.12)" stroke="#1877ff" strokeWidth="2"/>
    <text x="165" y="15" textAnchor="middle">加拿大·多伦多</text><text x="295" y="83">法国·巴黎</text><text x="295" y="183">中国·北京</text><text x="165" y="248" textAnchor="middle">美国·斯坦福</text><text x="35" y="183" textAnchor="end">中国·深圳</text><text x="35" y="83" textAnchor="end">中国·上海</text>
  </svg>;
}

function MobilitySection() {
  const [activeStop,setActiveStop]=useState(0);
  const stop=migrationStops[activeStop];
  return <section id="mobility" className="ttf-section ttf-mobility">
    <SectionHeading title="人才流动趋势区" subtitle="学者迁徙图｜论文分布图｜学术生涯分布图"><MiniSelect label="研究领域" value="人工智能"/><MiniSelect label="学者" value="张教授"/></SectionHeading>
    <article className="fp-card ttf-mobility-workbench">
      <PanelTitle title="学者迁徙图" aside="5 次迁徙｜6 个驻点"/>
      <div className="ttf-map">
        <img src="./assets/thinktank-world-map.svg" alt="世界地图" />
        <svg viewBox="0 0 1120 410" aria-hidden="true"><path d="M190 145 C300 88 365 98 437 120 S570 145 665 110 S800 130 880 155 S960 170 1010 150"/>{[[190,145],[350,103],[665,110],[820,137],[930,164],[1010,150]].map(([x,y],index)=><g key={`${x}-${y}`}><circle cx={x} cy={y} r="10"/><text x={x} y={y+4} textAnchor="middle">{index+1}</text></g>)}</svg>
        <span className="m1">多伦多</span><span className="m2">巴黎</span><span className="m3">北京</span><span className="m4">新加坡</span><span className="m5">深圳</span><span className="m6">上海</span>
        <div className="ttf-map-legend"><span><i/>迁徙路线</span><span><i/>历史驻点</span><span><i/>当前驻点</span></div>
      </div>
      <div className="ttf-migration-timeline">{migrationStops.map((item,index)=><button className={activeStop===index?"active":""} type="button" onClick={()=>setActiveStop(index)} key={item.city}><i>{index+1}</i><b>{item.city}</b><small>{item.date}</small></button>)}</div>
      <div className="ttf-stop-detail"><strong>{stop.country}·{stop.city}</strong><span><small>所在地址</small>27 King's College Circle, Toronto</span><span><small>迁入时间</small>2006-09</span><span><small>迁出时间</small>2008-07</span><span><small>停留时长</small>1年10个月</span><span><small>地区发表论文数</small><b>{stop.papers}篇</b></span></div>
      <div className="ttf-paper-chart"><PanelTitle title="论文分布图" aside="单位：篇"/><div className="ttf-paper-bars">{migrationStops.map((item,index)=><div key={item.city}><span>{item.papers}</span><i style={{height:`${item.papers*4}px`}}/><small>{2020+index}</small></div>)}</div></div>
      <div className="ttf-career"><PanelTitle title="学术生涯分布图" aside="停留时长"/><div className="ttf-career-layout"><CareerRadar/><div className="ttf-career-shares">{[["加拿大·多伦多","9%"],["法国·巴黎","15%"],["中国·北京","20%"],["美国·斯坦福","21%"],["中国·深圳","18%"],["中国·上海","18%"]].map(([place,share])=><span key={place}><b>{place}</b><em>{share}</em></span>)}</div></div></div>
    </article>
  </section>;
}

function NewsSection() {
  const [tab,setTab]=useState<"all"|"followed">("all");
  const [query,setQuery]=useState("");
  const [field,setField]=useState("全部领域");
  const [sort,setSort]=useState<"latest"|"value"|"popular">("latest");
  const [followedIds,setFollowedIds]=useState<Set<string>>(new Set(["multimodal-medical"]));
  const [likedIds,setLikedIds]=useState<Set<string>>(new Set());
  const [expandedId,setExpandedId]=useState<string|null>(null);
  const fields=useMemo(()=>["全部领域",...Array.from(new Set(talentNewsItems.map((item)=>item.field)))],[ ]);
  const visibleNews=useMemo(()=>{
    const keyword=query.trim().toLocaleLowerCase("zh-CN");
    return talentNewsItems
      .filter((item)=>(tab==="all"||followedIds.has(item.id))&&(field==="全部领域"||item.field===field)&&(!keyword||`${item.title}${item.summary}${item.source}${item.scholars.join("")}`.toLocaleLowerCase("zh-CN").includes(keyword)))
      .sort((left,right)=>sort==="value"?right.valueScore-left.valueScore:sort==="popular"?(right.likes+(likedIds.has(right.id)?1:0))-(left.likes+(likedIds.has(left.id)?1:0)):Date.parse(right.publishedAt)-Date.parse(left.publishedAt));
  },[field,followedIds,likedIds,query,sort,tab]);
  const toggleSet=(setter:typeof setFollowedIds,id:string)=>setter((current)=>{const next=new Set(current);if(next.has(id))next.delete(id);else next.add(id);return next;});
  const clearFilters=()=>{setQuery("");setField("全部领域");setSort("latest");setTab("all");};
  return <section id="news" className="ttf-section ttf-news">
    <SectionHeading title="人才动态资讯区" subtitle="科技资讯与人才信息关联｜定向查询｜关注追踪"><span className="ttf-news-heading-status"><ShieldCheck size={15}/>来源可追溯</span></SectionHeading>
    <article className="fp-card ttf-news-card">
      <div className="ttf-news-tabs"><div role="tablist" aria-label="人才动态资讯范围"><button className={tab==="all"?"active":""} type="button" role="tab" aria-selected={tab==="all"} onClick={()=>setTab("all")}>全部资讯</button><button className={tab==="followed"?"active":""} type="button" role="tab" aria-selected={tab==="followed"} onClick={()=>setTab("followed")}>我的关注 <small>{followedIds.size}</small></button></div><span>当前显示 {visibleNews.length} 条</span></div>
      <div className="ttf-news-toolbar">
        <label className="ttf-news-search"><span>定向查询</span><div><Search size={15}/><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="搜索资讯、来源或相关学者"/></div></label>
        <label><span>领域</span><select value={field} onChange={(event)=>setField(event.target.value)}>{fields.map((item)=><option key={item}>{item}</option>)}</select></label>
        <label><span>排序</span><select value={sort} onChange={(event)=>setSort(event.target.value as typeof sort)}><option value="latest">最新发布</option><option value="value">价值优先</option><option value="popular">关注度优先</option></select></label>
      </div>
      <div className="ttf-news-list">{visibleNews.length?visibleNews.map((item)=>{const liked=likedIds.has(item.id);const followed=followedIds.has(item.id);const expanded=expandedId===item.id;return <article className={expanded?"is-expanded":""} key={item.id}>
        <div className="ttf-news-main"><header><span>{item.field}</span><h3>{item.title}</h3></header><p title={item.summary}>{item.summary}</p><div className="ttf-news-meta"><span><Building2 size={13}/>{item.source}</span><span><CalendarDays size={13}/><time dateTime={item.publishedAt}>{item.publishedAt}</time></span></div><div className="ttf-news-scholars"><UserRound size={13}/><span>相关学者</span>{item.scholars.map((scholar)=><button type="button" onClick={()=>{setQuery(scholar);setTab("all");}} key={scholar}>{scholar}</button>)}</div></div>
        <div className="ttf-news-actions"><button className={liked?"is-active":""} type="button" aria-pressed={liked} onClick={()=>toggleSet(setLikedIds,item.id)}><Heart size={14} fill={liked?"currentColor":"none"}/>{new Intl.NumberFormat("zh-CN").format(item.likes+(liked?1:0))}</button><button className={followed?"is-active":""} type="button" aria-pressed={followed} onClick={()=>toggleSet(setFollowedIds,item.id)}><Star size={14} fill={followed?"currentColor":"none"}/>{followed?"已关注":"关注"}</button><button className="is-detail" type="button" aria-expanded={expanded} onClick={()=>setExpandedId((current)=>current===item.id?null:item.id)}>{expanded?"收起详情":"查看详情"}<ChevronDown size={14}/></button></div>
        {expanded?<div className="ttf-news-detail"><strong>资讯详情</strong><ul>{item.details.map((detail)=><li key={detail}>{detail}</li>)}</ul><span><ShieldCheck size={14}/>来源：{item.source}</span></div>:null}
      </article>}):<div className="ttf-news-empty"><strong>{tab==="followed"?"暂未找到关注资讯":"未找到符合条件的资讯"}</strong><p>{tab==="followed"?"关注人才动态后，可在这里集中查看。":"请调整搜索词、领域或排序条件。"}</p><button type="button" onClick={clearFilters}>查看全部资讯</button></div>}</div>
      <footer className="ttf-news-summary"><span>已汇集 {talentNewsItems.length} 条人才动态</span><span>按发布时间、信息价值与关注度筛选</span></footer>
    </article>
  </section>;
}

export default function FigmaThinkTankPage() {
  const reportId = new URL(window.location.href).searchParams.get("report");
  const report = consultingReports.find((item) => item.id === reportId) ?? null;
  useEffect(() => {
    if (report) document.title = `${report.title} - 战略咨询报告`;
  }, [report]);

  if (report) return <main className="ttf-report-standalone"><PortalHeader currentPage="think-tank"/><div className="ttf-report-standalone-shell"><ReportDetailPage report={report}/></div></main>;

  return <main className="ttf-page">
    <PortalHeader currentPage="think-tank" />
    <section id="top" className="ttf-hero">
      <img src="./assets/thinktank-hero-reference.png" alt="" />
      <div className="ttf-hero-copy"><h1>新型高端智库</h1><p>整合领域技术路线梳理、战略咨询报告、人才分布与流动分析，提供高价值的产业、人才、技术决策参考</p><span>发布话题</span></div>
    </section>
    <div className="ttf-content"><TechnologySection/><ReportsSection/><TalentSection/><MobilitySection/><NewsSection/></div>
    <PageSectionLocator items={thinkTankLocatorItems} topId="top" label="内容定位" />
  </main>;
}
