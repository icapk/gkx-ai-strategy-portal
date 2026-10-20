import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
const mapAssetRoot = `${assetRoot}/map`;

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
  {
    id: "trusted-ai-platform-2024", kind: "case", title: "可信人工智能公共服务平台成果案例", field: "信息电子", institution: "智能计算研究院", year: "2024", topic: "人工智能专题库",
    summary: "展示公共服务平台在模型评测、知识增强和应用安全治理方面形成的建设成果。",
    direction: "人工智能平台由单一模型调用转向评测、知识、工具与安全能力的一体化支撑。",
    analysis: ["统一模型接入和任务编排降低重复建设成本", "评测基准覆盖准确性、稳定性与安全性", "知识增强提升专业场景回答的可追溯性"],
    recommendations: ["完善模型版本与评测结果关联机制", "建设重点领域知识更新流程", "建立高风险任务的人工复核边界"],
  },
  {
    id: "distributed-energy-2023", kind: "case", title: "分布式能源协同调度成果案例", field: "能源动力", institution: "新能源系统研究中心", year: "2023", topic: "新能源专题库",
    summary: "展示园区光储充协同、负荷预测与多时间尺度调度形成的示范应用成果。",
    direction: "分布式能源系统向源网荷储协同感知、预测和弹性调度演进。",
    analysis: ["多源设备运行数据实现统一采集", "负荷预测连接电价、天气与生产计划", "储能调度兼顾经济性和设备寿命"],
    recommendations: ["统一设备接入与运行指标口径", "建立预测偏差和调度收益复盘机制", "加强异常工况下的安全控制验证"],
  },
  {
    id: "watershed-monitoring-2023", kind: "case", title: "流域水环境协同监测成果案例", field: "环境与水利", institution: "水环境治理研究中心", year: "2023", topic: "环境保护专题库",
    summary: "展示跨区域监测、污染溯源和治理成效评估形成的流域协同应用成果。",
    direction: "水环境治理由断面监测转向多源感知、污染溯源与治理反馈闭环。",
    analysis: ["关键断面与风险源数据形成统一视图", "溯源模型结合水文、排放和气象信息", "治理措施与水质变化建立追踪关系"],
    recommendations: ["完善跨区域监测数据共享规则", "持续校准污染溯源模型", "建立治理成效的季度评估机制"],
  },
  {
    id: "public-health-response-2022", kind: "case", title: "公共卫生应急协同处置成果案例", field: "医药卫生", institution: "公共卫生创新中心", year: "2022", topic: "公共卫生专题库",
    summary: "展示监测预警、资源调度和跨机构协作在公共卫生应急处置中的应用成果。",
    direction: "公共卫生应急体系向实时监测、智能研判和多部门协同处置演进。",
    analysis: ["多渠道监测信息实现统一汇聚", "风险研判连接事件等级与资源需求", "处置过程形成任务、反馈和复盘闭环"],
    recommendations: ["完善监测指标和事件分级标准", "建设应急资源动态台账", "定期开展跨机构协同演练"],
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
  { city: "多伦多", country: "加拿大", institution: "多伦多大学", date: "2006.09–2008.07", enteredAt: "2006-09", leftAt: "2008-07", duration: "1年10个月", address: "27 King's College Circle, Toronto", papers: 18, marker: [330, 87], label: [266, 62] },
  { city: "巴黎", country: "法国", institution: "巴黎萨克雷大学", date: "2008.09–2011.07", enteredAt: "2008-09", leftAt: "2011-07", duration: "2年10个月", address: "3 Rue Joliot Curie, Paris", papers: 9, marker: [569, 62], label: [586, 82] },
  { city: "北京", country: "中国", institution: "清华大学", date: "2011.09–2014.07", enteredAt: "2011-09", leftAt: "2014-07", duration: "2年10个月", address: "北京市海淀区清华园", papers: 13, marker: [916, 91], label: [866, 62] },
  { city: "斯坦福", country: "美国", institution: "斯坦福大学", date: "2014.09–2017.07", enteredAt: "2014-09", leftAt: "2017-07", duration: "2年10个月", address: "450 Jane Stanford Way, Stanford", papers: 19, marker: [209, 112], label: [227, 133] },
  { city: "深圳", country: "中国", institution: "深圳大学", date: "2017.09–2020.07", enteredAt: "2017-09", leftAt: "2020-07", duration: "2年10个月", address: "深圳市南山区南海大道", papers: 23, marker: [915, 143], label: [936, 162] },
  { city: "上海", country: "中国", institution: "上海交通大学", date: "2020.09–至今", enteredAt: "2020-09", leftAt: "至今", duration: "持续任职", address: "上海市闵行区东川路", papers: 30, marker: [939, 103], label: [966, 72] },
];

const migrationRoutes = [
  { src: "route-1.svg", left: 335, top: 53, width: 229, height: 49 },
  { src: "route-2.svg", left: 574, top: 71, width: 337, height: 49 },
  { src: "route-3.svg", left: 920, top: 80, width: 208, height: 23 },
  { src: "route-4.svg", left: 25, top: 91, width: 187, height: 31 },
  { src: "route-5.svg", left: 920, top: 121, width: 40, height: 34 },
  { src: "route-6.svg", left: 217, top: 115, width: 691, height: 65 },
] as const;

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

const yearlyTechnologies = [
  { year: "2025年", items: ["多模态融合生成", "具身智能决策", "知识图谱推理", "检索增强生成", "智能体协同规划", "大模型低比特量化", "长上下文信息建模", "端侧模型轻量部署"] },
  { year: "2024年", items: ["具身感知建模", "视觉语言对齐", "行业知识增强", "复杂任务规划", "智能体工具调用", "推理加速", "模型安全评测", "多端协同部署"] },
  { year: "2023年", items: ["检索增强生成", "知识密集任务", "多模态理解", "领域微调", "指令学习", "模型幻觉评测", "开源模型适配", "证据引用生成"] },
  { year: "2022年", items: ["多模态表征学习", "对比学习", "图文跨模态检索", "预训练数据治理", "小样本迁移", "模型蒸馏", "分布式训练", "可解释性分析"] },
  { year: "2021年", items: ["大规模预训练模型", "中文语义建模", "自监督学习", "知识图谱构建", "语言模型评测", "领域迁移学习", "深度学习平台", "算力调度系统"] },
] as const;

const technologyMilestones = [
  { id: "m-2021", year: "2021年", technology: "预训练模型工程平台上线", team: "基础模型研发团队", impact: "夯实中文语义建模、训练与评测基础。" },
  { id: "m-2022", year: "2022年", technology: "多模态表征框架完成验证", team: "多模态联合团队", impact: "推动图文理解与生成能力融合。" },
  { id: "m-2023", year: "2023年", technology: "行业知识增强方案形成", team: "知识工程团队", impact: "提升垂直领域检索、问答与证据追溯能力。" },
  { id: "m-2023-rag", year: "2023年", technology: "检索增强生成联合验证", team: "检索与生成联合组", impact: "建立检索、生成与证据引用的联合验证流程。" },
  { id: "m-2024", year: "2024年", technology: "具身智能决策控制样机", team: "机器人智能团队", impact: "验证感知、规划与控制的闭环协同。" },
  { id: "m-2025", year: "2025年", technology: "行业智能体协同平台发布", team: "智能体工程团队", impact: "支持多智能体任务编排与工具调用。" },
  { id: "m-2025-safety", year: "2025年", technology: "智能体安全评测机制上线", team: "智能评测团队", impact: "完善多智能体协作中的安全检查与效果复盘。" },
  { id: "m-2025-multimodal", year: "2025年", technology: "多模态融合生成组件", team: "多模态研发组", impact: "形成图像、文本与结构化数据的协同生成能力。" },
  { id: "m-2025-knowledge", year: "2025年", technology: "知识图谱推理引擎", team: "知识智能团队", impact: "增强领域知识关联、证据追溯与多步推理能力。" },
  { id: "m-2025-quantization", year: "2025年", technology: "大模型低比特量化方案", team: "模型效率团队", impact: "降低推理资源消耗，支持更多应用场景的快速部署。" },
  { id: "m-2025-context", year: "2025年", technology: "长上下文信息建模方法", team: "语言智能团队", impact: "提升长文档理解、跨段关联与复杂任务处理能力。" },
  { id: "m-2025-edge", year: "2025年", technology: "端侧模型轻量部署工具链", team: "端侧智能团队", impact: "支持受限设备上的模型优化、性能评测与稳定运行。" },
  { id: "m-2025-orchestration", year: "2025年", technology: "智能体协同规划引擎", team: "多智能体协同组", impact: "统一多角色任务分解、执行编排与结果校验流程。" },
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

type TrendMetric = "total" | "breakthrough";
type TrendVisibility = Record<TrendMetric, boolean>;

const technologyTrendData = {
  goal: [
    { year: "2021", total: 52, breakthrough: 18 },
    { year: "2022", total: 61, breakthrough: 26 },
    { year: "2023", total: 78, breakthrough: 39 },
    { year: "2024", total: 99, breakthrough: 53 },
    { year: "2025", total: 114, breakthrough: 68 },
  ],
  task: [
    { year: "2021", total: 45, breakthrough: 15 },
    { year: "2022", total: 57, breakthrough: 23 },
    { year: "2023", total: 71, breakthrough: 34 },
    { year: "2024", total: 88, breakthrough: 46 },
    { year: "2025", total: 103, breakthrough: 59 },
  ],
  safeguard: [
    { year: "2021", total: 38, breakthrough: 12 },
    { year: "2022", total: 49, breakthrough: 19 },
    { year: "2023", total: 63, breakthrough: 29 },
    { year: "2024", total: 76, breakthrough: 38 },
    { year: "2025", total: 91, breakthrough: 49 },
  ],
} as const;

const trendMetricLabels: Record<TrendMetric, string> = {
  total: "技术总量",
  breakthrough: "突破性技术",
};

function LineChart({ level = "goal", visibility = { total: true, breakthrough: true } }: { level?: keyof typeof technologyTrendData; visibility?: TrendVisibility }) {
  const [activeIndex, setActiveIndex] = useState(4);
  const data = technologyTrendData[level];
  const width = 1152;
  const height = 168;
  const left = 64;
  const right = 16;
  const top = 8;
  const bottom = 28;
  const maxValue = 120;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const xAt = (index: number) => left + (plotWidth * index) / (data.length - 1);
  const yAt = (value: number) => top + ((maxValue - value) / maxValue) * plotHeight;
  const linePath = (metric: TrendMetric) => data.map((item, index) => `${index ? "L" : "M"} ${xAt(index)} ${yAt(item[metric])}`).join(" ");
  const areaPath = (metric: TrendMetric) => `${linePath(metric)} L ${xAt(data.length - 1)} ${top + plotHeight} L ${xAt(0)} ${top + plotHeight} Z`;
  const activePoint = data[activeIndex];
  const activeX = xAt(activeIndex);
  const activeValues = (["total", "breakthrough"] as const).filter((metric) => visibility[metric]);
  const tooltipTop = Math.max(4, Math.min(...activeValues.map((metric) => yAt(activePoint[metric]))) - 62);

  return (
    <div className="ttf-route-chart" role="group" aria-label="2021至2025年技术发展概览，数值为交互演示数据。">
      <svg className="ttf-route-chart-svg" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        <defs>
          <linearGradient id="ttf-trend-blue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2679fe" stopOpacity=".16" />
            <stop offset="1" stopColor="#165dff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ttf-trend-green" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#00b42a" stopOpacity=".14" />
            <stop offset="1" stopColor="#00b42a" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[120, 90, 60, 30, 0].map((value) => {
          const y = yAt(value);
          return <g key={value}><text className="ttf-route-chart-axis-label" x="32" y={y + 4} textAnchor="end">{value}</text><line className={`ttf-route-chart-grid-line${value === 0 ? " is-baseline" : ""}`} x1={left - 16} x2={width} y1={y} y2={y} /></g>;
        })}
        {visibility.breakthrough ? <path className="ttf-route-chart-area is-green" d={areaPath("breakthrough")} /> : null}
        {visibility.total ? <path className="ttf-route-chart-area is-blue" d={areaPath("total")} /> : null}
        {visibility.total ? <path className="ttf-route-chart-line is-blue" d={linePath("total")} /> : null}
        {visibility.breakthrough ? <path className="ttf-route-chart-line is-green" d={linePath("breakthrough")} /> : null}
        <line className="ttf-route-chart-cursor" x1={activeX} x2={activeX} y1={top} y2={top + plotHeight} />
        {data.map((item, index) => <g key={item.year}>
          {visibility.total ? <circle className={`ttf-route-chart-point is-blue${index === activeIndex ? " is-active" : ""}`} cx={xAt(index)} cy={yAt(item.total)} r={index === activeIndex ? 5 : 4} /> : null}
          {visibility.breakthrough ? <circle className={`ttf-route-chart-point is-green${index === activeIndex ? " is-active" : ""}`} cx={xAt(index)} cy={yAt(item.breakthrough)} r={index === activeIndex ? 5 : 4} /> : null}
          <text className={`ttf-route-chart-year${index === activeIndex ? " is-active" : ""}`} x={xAt(index)} y={height - 4} textAnchor="middle">{item.year}</text>
        </g>)}
      </svg>
      {data.map((item, index) => <button
        type="button"
        className="ttf-route-chart-hit"
        style={{ left: `${(xAt(index) / width) * 100}%` }}
        aria-label={`${item.year}年，技术总量 ${item.total}，突破性技术 ${item.breakthrough}`}
        aria-pressed={activeIndex === index}
        onMouseEnter={() => setActiveIndex(index)}
        onFocus={() => setActiveIndex(index)}
        onClick={() => setActiveIndex(index)}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          setActiveIndex((current) => event.key === "ArrowLeft" ? Math.max(0, current - 1) : Math.min(data.length - 1, current + 1));
        }}
        key={item.year}
      />)}
      <div className="ttf-route-chart-tooltip" style={{ left: `clamp(92px, ${(activeX / width) * 100}%, calc(100% - 92px))`, top: tooltipTop }} aria-live="polite">
        <strong>{activePoint.year}年 <small>演示值</small></strong>
        {activeValues.map((metric) => <span className={`is-${metric}`} key={metric}><i />{trendMetricLabels[metric]}<b>{activePoint[metric]}</b></span>)}
      </div>
    </div>
  );
}

function TechnologySection() {
  const [domain, setDomain] = useState("人工智能领域");
  const [query, setQuery] = useState("");
  const [activeRoadmapLevel, setActiveRoadmapLevel] = useState<(typeof roadmapLevels)[number]["id"]>("goal");
  const [trendVisibility, setTrendVisibility] = useState<TrendVisibility>({ total: true, breakthrough: true });
  const [activeYear, setActiveYear] = useState("2025年");
  const [selectedMilestoneId, setSelectedMilestoneId] = useState("m-2021");
  const [treeScale, setTreeScale] = useState(.64);
  const [expandedTreeBranches, setExpandedTreeBranches] = useState<Set<string>>(() => new Set(technologyBranches.map((branch) => branch.name)));
  const [selectedNodeTitle, setSelectedNodeTitle] = useState("人工智能");
  const normalizedQuery = query.trim();
  const activeYearItems = yearlyTechnologies.find((item) => item.year === activeYear)?.items ?? yearlyTechnologies[0].items;
  const filteredTechnologies = activeYearItems.filter((item) => !normalizedQuery || item.includes(normalizedQuery));
  const visibleBranches = technologyBranches.map((branch) => {
    if (!normalizedQuery || branch.name.includes(normalizedQuery)) return branch;
    return { ...branch, leaves: branch.leaves.filter((leaf) => `${leaf.name}${leaf.relation}`.includes(normalizedQuery)) };
  }).filter((branch) => !normalizedQuery || branch.name.includes(normalizedQuery) || branch.leaves.length);
  const allVisibleBranchesExpanded = Boolean(visibleBranches.length) && visibleBranches.every((branch) => expandedTreeBranches.has(branch.name));
  const selectedBranch = technologyBranches.find((branch) => branch.name === selectedNodeTitle);
  const selectedLeaf = technologyBranches.flatMap((branch) => branch.leaves.map((leaf) => ({ ...leaf, branch: branch.name }))).find((leaf) => leaf.name === selectedNodeTitle);
  const selectedNodeMeta = selectedNodeTitle === "人工智能" ? "334,287 篇论文 · 3 条主分支" : selectedBranch ? `${selectedBranch.papers.toLocaleString("zh-CN")} 篇论文 · ${selectedBranch.leaves.length} 个子技术` : selectedLeaf ? `${selectedLeaf.branch} · ${selectedLeaf.relation} · ${selectedLeaf.papers.toLocaleString("zh-CN")} 篇论文` : "近五年技术数据";
  const toggleTreeBranch = (branchName: string) => setExpandedTreeBranches((current) => {
    const next = new Set(current);
    if (next.has(branchName)) next.delete(branchName);
    else next.add(branchName);
    return next;
  });
  const activeMilestoneIndex = Math.max(0, technologyMilestones.findIndex((item) => item.id === selectedMilestoneId));
  const activeMilestone = technologyMilestones[activeMilestoneIndex];
  const milestoneGroups = Array.from(new Set(technologyMilestones.map((item) => item.year))).map((year) => ({ year, items: technologyMilestones.filter((item) => item.year === year) }));
  const activeMilestoneGroup = milestoneGroups.find((group) => group.year === activeMilestone.year) ?? milestoneGroups[0];
  const toggleTrendMetric = (metric: TrendMetric) => setTrendVisibility((current) => {
    if (current[metric] && Object.values(current).filter(Boolean).length === 1) return current;
    return { ...current, [metric]: !current[metric] };
  });

  return (
    <section id="technology" className="ttf-section ttf-tech ttf-route-section">
      <header className="ttf-route-heading">
        <div className="ttf-route-heading-copy"><img src={`${assetRoot}/technology-route-icon-figma.png`} alt="" /><div><h2>领域技术路线</h2><p>总体画像｜发展目标｜具体任务｜保障措施</p></div></div>
        <div className="ttf-route-filters">
          <label className="ttf-route-select"><select value={domain} onChange={(event) => setDomain(event.target.value)} aria-label="选择技术领域"><option>人工智能领域</option><option>生物医药领域</option><option>新能源领域</option></select><img src={`${assetRoot}/technology-select-arrow.svg`} alt="" /></label>
          <label className="ttf-route-search"><img src={`${assetRoot}/technology-search.svg`} alt="" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索关键词" aria-label="搜索领域技术关键词" /></label>
        </div>
      </header>

      <div className="ttf-route-content">
        <article className="ttf-route-overview">
          <div className="ttf-route-metrics">
            {[{ label: "论文总数", value: "12,345" }, { label: "学者数量", value: "3,256" }, { label: "企业数量", value: "12,345" }, { label: "论文发表环比", value: "+ 6.2%", trend: true }].map((item) => <div key={item.label}><span>{item.label}</span><div className="ttf-route-metric-value"><strong>{item.value}</strong>{item.trend ? <img src={`${assetRoot}/technology-trend-up.svg`} alt="上升" /> : null}</div></div>)}
          </div>
          <div className="ttf-route-trend">
            <header>
              <h3>近五年技术发展概览</h3>
              <div className="ttf-route-legend" aria-label="图表指标显示控制"><button type="button" className={trendVisibility.total ? "" : "is-muted"} aria-pressed={trendVisibility.total} onClick={() => toggleTrendMetric("total")}><img src={`${assetRoot}/technology-legend-blue.svg`} alt="" />技术总量</button><button type="button" className={trendVisibility.breakthrough ? "" : "is-muted"} aria-pressed={trendVisibility.breakthrough} onClick={() => toggleTrendMetric("breakthrough")}><img src={`${assetRoot}/technology-legend-green.svg`} alt="" />突破性技术</button></div>
              <div className="ttf-route-segments" role="tablist" aria-label="技术路线层级">{roadmapLevels.map((level) => <button type="button" role="tab" aria-selected={activeRoadmapLevel === level.id} className={activeRoadmapLevel === level.id ? "is-active" : ""} onClick={() => setActiveRoadmapLevel(level.id)} key={level.id}>{level.label}</button>)}</div>
            </header>
            <LineChart level={activeRoadmapLevel} visibility={trendVisibility} />
          </div>
        </article>

        <article className="ttf-route-insights">
          <section className="ttf-route-key-tech">
            <div className="ttf-route-key-header"><h3>近五年关键技术</h3><div className="ttf-route-year-tabs" role="tablist" aria-label="关键技术年份">{yearlyTechnologies.map((item) => <button type="button" role="tab" aria-selected={activeYear === item.year} className={activeYear === item.year ? "is-active" : ""} onClick={() => setActiveYear(item.year)} key={item.year}>{item.year}</button>)}</div></div>
            <div className="ttf-route-tech-grid" aria-live="polite">{filteredTechnologies.length ? filteredTechnologies.map((item) => <span key={item}>{item}</span>) : <p>未找到匹配的技术关键词</p>}</div>
          </section>
          <section className="ttf-route-milestones">
            <header><h3>关键技术发展里程碑轨道</h3><span>近五年</span></header>
            <div className="ttf-route-milestone-track" role="tablist" aria-label="关键技术发展年份">
              {milestoneGroups.map((group, groupIndex) => <button
                id={`ttf-route-milestone-year-${groupIndex}`}
                type="button"
                role="tab"
                className={activeMilestone.year === group.year ? "is-active" : ""}
                aria-selected={activeMilestone.year === group.year}
                aria-controls="ttf-route-milestone-year-items"
                onClick={() => setSelectedMilestoneId(group.items[0].id)}
                onKeyDown={(event) => {
                  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                  event.preventDefault();
                  const nextIndex = event.key === "ArrowLeft" ? Math.max(0, groupIndex - 1) : Math.min(milestoneGroups.length - 1, groupIndex + 1);
                  setSelectedMilestoneId(milestoneGroups[nextIndex].items[0].id);
                  document.getElementById(`ttf-route-milestone-year-${nextIndex}`)?.focus();
                }}
                key={group.year}
              ><time>{group.year}</time><i aria-hidden="true" /></button>)}
            </div>
            <div id="ttf-route-milestone-year-items" className="ttf-route-milestone-year-items" role="tablist" aria-label={`${activeMilestoneGroup.year}关键技术`}>
              {activeMilestoneGroup.items.map((item) => {
                const index = technologyMilestones.findIndex((milestone) => milestone.id === item.id);
                return <button
                  id={`ttf-route-milestone-${item.id}`}
                  type="button"
                  role="tab"
                  className={selectedMilestoneId === item.id ? "is-active" : ""}
                  aria-selected={selectedMilestoneId === item.id}
                  aria-controls="ttf-route-milestone-detail"
                  aria-label={`${item.year}，${item.technology}，${item.team}`}
                  onClick={() => setSelectedMilestoneId(item.id)}
                  onKeyDown={(event) => {
                    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                    event.preventDefault();
                    const nextIndex = event.key === "ArrowLeft" ? Math.max(0, index - 1) : Math.min(technologyMilestones.length - 1, index + 1);
                    const nextMilestone = technologyMilestones[nextIndex];
                    setSelectedMilestoneId(nextMilestone.id);
                    window.requestAnimationFrame(() => document.getElementById(`ttf-route-milestone-${nextMilestone.id}`)?.focus());
                  }}
                  key={item.id}
                ><strong>{item.technology}</strong></button>;
              })}
            </div>
            <dl id="ttf-route-milestone-detail" className="ttf-route-milestone-detail" role="tabpanel" aria-live="polite">
              <div><dt>时间节点</dt><dd>{activeMilestone.year}</dd></div>
              <div><dt>技术名称</dt><dd>{activeMilestone.technology}</dd></div>
              <div><dt>技术发明人或团队</dt><dd>{activeMilestone.team}</dd></div>
              <div><dt>技术影响力</dt><dd>{activeMilestone.impact}</dd></div>
            </dl>
          </section>
        </article>

        <article className="ttf-route-tree-panel">
          <header><h3>关键技术分枝树</h3><span aria-live="polite">当前：<b>{selectedNodeTitle}</b> · {selectedNodeMeta}</span></header>
          <div className="ttf-route-tree-viewport">
            <div className="ttf-route-tree-toolbar">
              <button type="button" onClick={() => setTreeScale((value) => Math.max(.54, Number((value - .1).toFixed(2))))} disabled={treeScale <= .54} aria-label="缩小技术分枝树">−</button><span>{Math.round(treeScale * 100)}%</span><button type="button" onClick={() => setTreeScale((value) => Math.min(1.04, Number((value + .1).toFixed(2))))} disabled={treeScale >= 1.04} aria-label="放大技术分枝树">+</button><i />
              <button type="button" className={allVisibleBranchesExpanded ? "is-active" : ""} onClick={() => setExpandedTreeBranches(new Set(visibleBranches.map((branch) => branch.name)))} disabled={allVisibleBranchesExpanded || !visibleBranches.length}>全部展开</button><button type="button" onClick={() => setExpandedTreeBranches(new Set())} disabled={!expandedTreeBranches.size}>全部收起</button>
            </div>
            <div className="ttf-route-tree-stage" style={{ "--ttf-route-scale": treeScale, "--ttf-route-factor": treeScale / .64 } as CSSProperties}>
              <button type="button" className={`ttf-route-root${selectedNodeTitle === "人工智能" ? " is-selected" : ""}`} aria-expanded={allVisibleBranchesExpanded} onClick={() => { setSelectedNodeTitle("人工智能"); setExpandedTreeBranches(allVisibleBranchesExpanded ? new Set() : new Set(visibleBranches.map((branch) => branch.name))); }}><strong>人工智能</strong><span>334,287 篇论文</span><em>{technologyBranches.length}项</em>{allVisibleBranchesExpanded ? <ChevronDown size={16} aria-hidden="true" /> : <ChevronRight size={16} aria-hidden="true" />}</button>
              <div className="ttf-route-branches">{visibleBranches.map((branch) => { const expanded = expandedTreeBranches.has(branch.name); return <div className={`ttf-route-branch-group${expanded ? " is-expanded" : ""}`} key={branch.name}>
                <button type="button" className={`ttf-route-branch${selectedNodeTitle === branch.name ? " is-selected" : ""}`} aria-expanded={expanded} onClick={() => { setSelectedNodeTitle(branch.name); toggleTreeBranch(branch.name); }}><strong>{branch.name}</strong><span>{branch.papers.toLocaleString("zh-CN")} 篇论文</span><em>{branch.leaves.length}项</em>{expanded ? <ChevronDown size={16} aria-hidden="true" /> : <ChevronRight size={16} aria-hidden="true" />}</button>
                {expanded ? <div className="ttf-route-leaves">{branch.leaves.map((leaf) => <button type="button" className={selectedNodeTitle === leaf.name ? "is-selected" : ""} aria-pressed={selectedNodeTitle === leaf.name} onClick={() => setSelectedNodeTitle(leaf.name)} key={leaf.name}><strong>{leaf.name}</strong><small>{leaf.relation}</small><span>{leaf.papers.toLocaleString("zh-CN")} 篇论文</span><i aria-hidden="true" /></button>)}</div> : null}
              </div>; })}</div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function LegacyTechnologySection() {
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(() => new Set(technologyBranches.map((item) => item.name)));
  const [treeScale, setTreeScale] = useState(1);
  const [treeQuery, setTreeQuery] = useState("");
  const [activeRoadmapLevel, setActiveRoadmapLevel] = useState<(typeof roadmapLevels)[number]["id"]>("goal");
  const [selectedHotTechnology, setSelectedHotTechnology] = useState<string>(yearlyTechnologies[0].items[0]);
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
          {yearlyTechnologies.map(({ year, items }) => <div className="ttf-key-year" key={year}><b>{year}</b>{items.map((item) => <button type="button" aria-pressed={selectedHotTechnology === item} className={selectedHotTechnology === item ? "is-active" : ""} onClick={() => setSelectedHotTechnology(item)} key={item}>{item}</button>)}</div>)}
          <div className="ttf-key-detail" aria-live="polite"><strong>{selectedHotTechnology}</strong><p>根据当前年份与领域数据生成的技术路线摘要。</p></div>
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

function ArcoFilterSelect({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return <div className="ttf-arco-field">
    <div className={`ttf-arco-select${open ? " is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="ttf-arco-select-trigger"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span>{value}</span><ChevronDown size={16} aria-hidden="true" />
      </button>
      {open ? <div className="ttf-arco-select-menu" role="listbox" aria-label={label}>
        {options.map((option) => <button
          type="button"
          role="option"
          aria-selected={value === option}
          className={value === option ? "is-selected" : ""}
          onClick={() => { onChange(option); setOpen(false); }}
          key={option}
        >{option}</button>)}
      </div> : null}
    </div>
  </div>;
}

function ArcoPagination({ label, current, total, pageSize, onChange }: { label: string; current: number; total: number; pageSize: number; onChange: (page: number) => void }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return <nav className="ttf-news-pagination arco-pagination" aria-label={label}>
    <span className="arco-pagination-total-text">共 {total} 条</span>
    <div className="arco-pagination-list">
      <button className="arco-pagination-item arco-pagination-item-previous" type="button" aria-label="上一页" disabled={current <= 1} onClick={() => onChange(current - 1)}><ChevronLeft size={14} aria-hidden="true" /></button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => <button className={`arco-pagination-item${current === page ? " arco-pagination-item-active" : ""}`} type="button" aria-current={current === page ? "page" : undefined} onClick={() => onChange(page)} key={page}>{page}</button>)}
      <button className="arco-pagination-item arco-pagination-item-next" type="button" aria-label="下一页" disabled={current >= pageCount} onClick={() => onChange(current + 1)}><ChevronRight size={14} aria-hidden="true" /></button>
    </div>
  </nav>;
}

function ReportsSection() {
  const [field, setField] = useState<(typeof reportFields)[number]>("全部领域");
  const [institution, setInstitution] = useState("全部机构");
  const [year, setYear] = useState("全部年度");
  const [topic, setTopic] = useState<(typeof reportTopics)[number]>("全部专题");
  const [query, setQuery] = useState("");
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
  const [recommendationOffset, setRecommendationOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const pushReports = consultingReports.filter((report) => report.kind === "push");
  const caseReports = consultingReports.filter((report) => report.kind === "case");
  const recommendations = Array.from({ length: Math.min(3, pushReports.length) }, (_, index) => pushReports[(recommendationOffset + index) % pushReports.length]);
  const institutions = useMemo(() => ["全部机构", ...Array.from(new Set(caseReports.map((report) => report.institution)))], []);
  const years = useMemo(() => ["全部年度", ...Array.from(new Set(caseReports.map((report) => report.year))).sort((a, b) => b.localeCompare(a))], []);
  const filteredCases = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return consultingReports.filter((report) => {
      if (report.kind !== "case") return false;
      const matchesField = field === "全部领域" || report.field === field;
      const matchesInstitution = institution === "全部机构" || report.institution === institution;
      const matchesYear = year === "全部年度" || report.year === year;
      const matchesTopic = topic === "全部专题" || report.topic === topic;
      const searchable = `${report.title}${report.summary}${report.direction}${report.analysis.join("")}${report.recommendations.join("")}`.toLocaleLowerCase();
      return matchesField && matchesInstitution && matchesYear && matchesTopic && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [field, institution, query, topic, year]);
  const pageCount = Math.max(1, Math.ceil(filteredCases.length / pageSize));
  const activePage = Math.min(currentPage, pageCount);
  const paginatedCases = filteredCases.slice((activePage - 1) * pageSize, activePage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
    setExpandedCaseId(null);
  }, [field, institution, query, topic, year]);

  const openReport = (report: ConsultingReport) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", "think-tank");
    url.searchParams.set("report", report.id);
    url.hash = "reports";
    window.location.assign(`${url.pathname}${url.search}${url.hash}`);
  };
  const clearFilters = () => {
    setField("全部领域");
    setInstitution("全部机构");
    setYear("全部年度");
    setTopic("全部专题");
    setQuery("");
  };

  return <section id="reports" className="ttf-section ttf-reports">
    <SectionHeading title="战略咨询报告" subtitle="领域定向推送｜成果案例分类｜报告详细内容" />
    <div className="ttf-strategy-report-surface">
      <section className="ttf-strategy-push" aria-labelledby="ttf-strategy-push-title">
        <header className="ttf-strategy-subheading"><div><h3 id="ttf-strategy-push-title">定向推送</h3><p>根据用户已关注的领域，推送包含技术发展方向、分析内容与技术建议的研究报告。</p></div><button type="button" onClick={() => setRecommendationOffset((value) => (value + 1) % pushReports.length)}><RefreshCw size={15} aria-hidden="true" />换一批</button></header>
        <div className="ttf-strategy-push-grid">{recommendations.map((report) => <article className="ttf-strategy-push-card" key={report.id}>
          <header><span>匹配关注领域</span><h4>{report.title}</h4></header>
          <p>{report.summary}</p>
          <div className="ttf-strategy-direction"><strong>技术发展方向</strong><span>{report.direction}</span></div>
          <div className="ttf-strategy-report-meta">
            <div className="ttf-strategy-report-tags"><span>{report.field}</span><span>{report.topic}</span></div>
            <div className="ttf-strategy-report-details"><small><Building2 size={13} aria-hidden="true" /><span>{report.institution}</span></small><small><CalendarDays size={13} aria-hidden="true" /><span>{report.year}</span></small></div>
          </div>
          <button type="button" onClick={() => openReport(report)}>查看报告详情<ChevronRight size={15} aria-hidden="true" /></button>
        </article>)}</div>
      </section>

      <section className="ttf-strategy-cases" aria-labelledby="ttf-strategy-cases-title">
        <header className="ttf-strategy-subheading"><div><h3 id="ttf-strategy-cases-title">战略咨询成果案例</h3><p>对已完成成果按领域、标准和专题分类展示；可查看成果摘要与完整详细信息。</p></div><span>注册用户可查看完整报告</span></header>
        <div className="ttf-strategy-filter-panel">
          <label className="ttf-strategy-search"><Search size={16} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索成果标题、技术方向或建议" aria-label="搜索战略咨询成果案例" /></label>
          <div className="ttf-strategy-filters">
            <ArcoFilterSelect label="领域分类" value={field} options={reportFields} onChange={(value) => setField(value as (typeof reportFields)[number])} />
            <ArcoFilterSelect label="所属机构" value={institution} options={institutions} onChange={setInstitution} />
            <ArcoFilterSelect label="发表年度" value={year} options={years} onChange={setYear} />
            <ArcoFilterSelect label="主题分类" value={topic} options={reportTopics} onChange={(value) => setTopic(value as (typeof reportTopics)[number])} />
          </div>
        </div>
        <div className="ttf-strategy-case-list">{paginatedCases.length ? paginatedCases.map((report) => { const expanded = expandedCaseId === report.id; const summaryId = `strategy-case-${report.id}`; return <article className="ttf-strategy-case-row" key={report.id}>
          <div className="ttf-strategy-case-main"><header><span>成果案例</span><h4>{report.title}</h4></header><p>{report.summary}</p><div className="ttf-strategy-case-tags"><span>{report.field}</span><span>{report.topic}</span></div></div>
          <dl><div><dt>所属机构</dt><dd>{report.institution}</dd></div><div><dt>发表年度</dt><dd>{report.year}</dd></div></dl>
          <div className="ttf-strategy-case-actions"><button type="button" aria-expanded={expanded} aria-controls={summaryId} onClick={() => setExpandedCaseId((current) => current === report.id ? null : report.id)}>{expanded ? "收起成果摘要" : "查看成果摘要"}<ChevronDown size={14} aria-hidden="true" /></button><button className="is-primary" type="button" onClick={() => openReport(report)}>查看完整报告</button></div>
          {expanded ? <div className="ttf-strategy-case-summary" id={summaryId}><section><h5>技术发展方向</h5><p>{report.direction}</p></section><section><h5>分析内容</h5><ul>{report.analysis.slice(0, 2).map((item) => <li key={item}>{item}</li>)}</ul></section><section><h5>技术建议</h5><ul>{report.recommendations.slice(0, 2).map((item) => <li key={item}>{item}</li>)}</ul></section></div> : null}
        </article>; }) : <div className="ttf-strategy-empty"><strong>未找到符合条件的成果案例</strong><p>请调整领域、机构、年度、专题或搜索关键词。</p><button type="button" onClick={clearFilters}>清除筛选</button></div>}</div>
        <footer className="ttf-strategy-results">
          <div><span>共 {filteredCases.length} 项成果案例</span>{field !== "全部领域" || institution !== "全部机构" || year !== "全部年度" || topic !== "全部专题" || query ? <button type="button" onClick={clearFilters}>清除筛选</button> : null}</div>
          {filteredCases.length ? <nav className="ttf-strategy-pagination" aria-label="成果案例分页">
            <button type="button" aria-label="上一页" disabled={activePage === 1} onClick={() => { setCurrentPage((page) => Math.max(1, page - 1)); setExpandedCaseId(null); }}><ChevronLeft size={14} aria-hidden="true" /></button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => <button type="button" className={activePage === page ? "is-active" : ""} aria-current={activePage === page ? "page" : undefined} onClick={() => { setCurrentPage(page); setExpandedCaseId(null); }} key={page}>{page}</button>)}
            <button type="button" aria-label="下一页" disabled={activePage === pageCount} onClick={() => { setCurrentPage((page) => Math.min(pageCount, page + 1)); setExpandedCaseId(null); }}><ChevronRight size={14} aria-hidden="true" /></button>
          </nav> : null}
        </footer>
      </section>
    </div>
  </section>;
}

const talentDimensions = ["人才储备", "成果储备", "学术影响力", "顶级专家", "产业转化", "新兴学者"] as const;
type TalentDomain = "人工智能" | "生物医药" | "新能源";
type TalentCity = { name: string; value: number; radar: readonly number[] };
type TalentDomainData = {
  metrics: Array<{ label: string; value: string }>;
  cities: TalentCity[];
  hotspots: Array<{ name: string; heat: number }>;
};

const talentDashboardData: Record<TalentDomain, TalentDomainData> = {
  人工智能: {
    metrics: [{ label: "人才总数", value: "12,345" }, { label: "成果总数", value: "3,256" }, { label: "环比增加成果数", value: "+1,345" }],
    cities: [{ name: "北京", value: 12580, radar: [92,90,95,96,82,86] }, { name: "上海", value: 10500, radar: [88,91,90,89,94,82] }, { name: "深圳", value: 8900, radar: [81,85,84,78,97,90] }, { name: "杭州", value: 6800, radar: [76,82,80,73,88,92] }, { name: "广州", value: 5200, radar: [72,76,79,74,81,78] }],
    hotspots: [{ name: "大模型", heat: 98 }, { name: "具身智能", heat: 91 }, { name: "多模态", heat: 87 }, { name: "智能体", heat: 84 }, { name: "计算机视觉", heat: 78 }, { name: "自然语言处理", heat: 74 }, { name: "强化学习", heat: 68 }, { name: "知识图谱", heat: 63 }],
  },
  生物医药: {
    metrics: [{ label: "人才总数", value: "9,680" }, { label: "成果总数", value: "2,748" }, { label: "环比增加成果数", value: "+986" }],
    cities: [{ name: "上海", value: 9680, radar: [91,94,93,90,92,83] }, { name: "北京", value: 9250, radar: [90,89,95,94,80,82] }, { name: "广州", value: 7360, radar: [78,82,84,79,86,80] }, { name: "深圳", value: 6910, radar: [76,79,78,72,91,86] }, { name: "杭州", value: 5480, radar: [70,76,75,68,82,84] }],
    hotspots: [{ name: "创新药", heat: 96 }, { name: "精准医疗", heat: 90 }, { name: "合成生物", heat: 88 }, { name: "医学影像", heat: 82 }, { name: "基因治疗", heat: 78 }, { name: "生物制造", heat: 73 }, { name: "数字疗法", heat: 67 }, { name: "疫苗研发", heat: 62 }],
  },
  新能源: {
    metrics: [{ label: "人才总数", value: "8,942" }, { label: "成果总数", value: "2,186" }, { label: "环比增加成果数", value: "+812" }],
    cities: [{ name: "深圳", value: 8942, radar: [86,88,82,80,96,89] }, { name: "上海", value: 8260, radar: [84,90,88,85,91,78] }, { name: "北京", value: 7510, radar: [82,83,92,91,76,75] }, { name: "杭州", value: 6240, radar: [74,80,79,72,85,83] }, { name: "广州", value: 5170, radar: [70,74,76,68,82,77] }],
    hotspots: [{ name: "新型储能", heat: 97 }, { name: "动力电池", heat: 92 }, { name: "光伏材料", heat: 86 }, { name: "氢能", heat: 82 }, { name: "智能电网", heat: 79 }, { name: "风电装备", heat: 71 }, { name: "碳管理", heat: 67 }, { name: "能源互联网", heat: 64 }],
  },
};

const talentInstitutionsByCity: Record<string, Array<{ name: string; score: number }>> = {
  北京: [{ name: "中国科学院", score: 98 }, { name: "清华大学", score: 96 }, { name: "北京大学", score: 94 }, { name: "中国工程院", score: 91 }, { name: "北京航空航天大学", score: 88 }],
  上海: [{ name: "上海交通大学", score: 97 }, { name: "复旦大学", score: 95 }, { name: "中国科学院上海分院", score: 92 }, { name: "同济大学", score: 89 }, { name: "华东理工大学", score: 86 }],
  深圳: [{ name: "深圳大学", score: 95 }, { name: "南方科技大学", score: 93 }, { name: "中国科学院深圳先进院", score: 92 }, { name: "鹏城实验室", score: 90 }, { name: "深圳理工大学", score: 86 }],
  杭州: [{ name: "浙江大学", score: 97 }, { name: "之江实验室", score: 92 }, { name: "西湖大学", score: 89 }, { name: "杭州电子科技大学", score: 85 }, { name: "浙江工业大学", score: 82 }],
  广州: [{ name: "中山大学", score: 96 }, { name: "华南理工大学", score: 93 }, { name: "中国科学院广州分院", score: 90 }, { name: "暨南大学", score: 86 }, { name: "广东工业大学", score: 83 }],
};

function radarPoint(index: number, value: number, radius = 112) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / talentDimensions.length;
  const scaledRadius = radius * (value / 100);
  return [180 + Math.cos(angle) * scaledRadius, 160 + Math.sin(angle) * scaledRadius] as const;
}

function RadarChart({ primary, secondary, visible, activeIndex, onActiveIndexChange }: { primary: TalentCity; secondary: TalentCity; visible: { primary: boolean; secondary: boolean }; activeIndex: number | null; onActiveIndexChange: (index: number | null) => void }) {
  const polygon = (values: readonly number[]) => values.map((value,index) => radarPoint(index,value).join(",")).join(" ");
  const ring = (scale: number) => talentDimensions.map((_,index) => radarPoint(index,scale).join(",")).join(" ");
  return <svg className="ttf-radar" viewBox="0 0 360 330" role="img" aria-label={`${primary.name}与${secondary.name}人才影响力六维对比`}>
    {[25,50,75,100].map((value)=><polygon key={value} points={ring(value)} fill="none" stroke="#d9e0e8"/>)}
    {talentDimensions.map((dimension,index)=>{const [x,y]=radarPoint(index,100);return <line key={dimension} x1="180" y1="160" x2={x} y2={y} stroke="#e4e8ee"/>;})}
    {visible.primary?<polygon points={polygon(primary.radar)} fill="rgba(22,93,255,.12)" stroke="#165dff" strokeWidth="2"/>:null}
    {visible.secondary?<polygon points={polygon(secondary.radar)} fill="rgba(0,180,42,.09)" stroke="#00b42a" strokeWidth="2"/>:null}
    {visible.primary?primary.radar.map((value,index)=>{const [x,y]=radarPoint(index,value);return <circle key={`${primary.name}-${talentDimensions[index]}`} cx={x} cy={y} r="3.5" fill="#165dff"><title>{primary.name} · {talentDimensions[index]}：{value}</title></circle>;}):null}
    {visible.secondary?secondary.radar.map((value,index)=>{const [x,y]=radarPoint(index,value);return <circle key={`${secondary.name}-${talentDimensions[index]}`} cx={x} cy={y} r="3.5" fill="#00b42a"><title>{secondary.name} · {talentDimensions[index]}：{value}</title></circle>;}):null}
    {talentDimensions.map((dimension,index)=>{const [x,y]=radarPoint(index,128);return <g className={activeIndex===index?"is-active":""} role="button" tabIndex={0} aria-label={`查看${dimension}对比`} onMouseEnter={()=>onActiveIndexChange(index)} onMouseLeave={()=>onActiveIndexChange(null)} onFocus={()=>onActiveIndexChange(index)} onBlur={()=>onActiveIndexChange(null)} onClick={()=>onActiveIndexChange(index)} onKeyDown={(event)=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();onActiveIndexChange(index);}}} key={dimension}><circle className="ttf-radar-hit" cx={x} cy={y} r="22"/><text x={x} y={y+4} textAnchor={x>190?"start":x<170?"end":"middle"}>{dimension}</text></g>;})}
  </svg>;
}

function TalentSection() {
  const [domain,setDomain]=useState<TalentDomain>("人工智能");
  const [selectedCity,setSelectedCity]=useState("北京");
  const [radarPrimaryCity,setRadarPrimaryCity]=useState("北京");
  const [compareCity,setCompareCity]=useState("上海");
  const [activeHotspot,setActiveHotspot]=useState("大模型");
  const [activeRadarDimension,setActiveRadarDimension]=useState<number | null>(null);
  const [radarVisible,setRadarVisible]=useState({primary:true,secondary:true});
  const data=talentDashboardData[domain];
  const primaryCity=data.cities.find((city)=>city.name===radarPrimaryCity)??data.cities[0];
  const secondaryCity=data.cities.find((city)=>city.name===compareCity)??data.cities[1];
  const maxCityValue=Math.max(...data.cities.map((city)=>city.value));
  const institutions=talentInstitutionsByCity[selectedCity]??talentInstitutionsByCity.北京;
  const cityOptions=data.cities.map((city)=>city.name);

  useEffect(()=>{
    const next=talentDashboardData[domain];
    setSelectedCity(next.cities[0].name);
    setRadarPrimaryCity(next.cities[0].name);
    setCompareCity(next.cities[1].name);
    setActiveHotspot(next.hotspots[0].name);
    setActiveRadarDimension(null);
    setRadarVisible({primary:true,secondary:true});
  },[domain]);

  const selectRadarPrimaryCity=(city:string)=>{
    setRadarPrimaryCity(city);
    if(city===compareCity)setCompareCity(cityOptions.find((item)=>item!==city)??city);
  };

  return <section id="talent" className="ttf-section ttf-talent">
    <SectionHeading title="人才分布态势区" subtitle="人才指数｜全国人才分布｜地区影响力对比｜科研热点｜机构排名"><div className="ttf-talent-domain-control"><span>当前领域</span><ArcoFilterSelect label="当前领域" value={domain} options={Object.keys(talentDashboardData)} onChange={(value)=>setDomain(value as TalentDomain)}/></div></SectionHeading>
    <article className="ttf-talent-panel ttf-talent-index"><PanelTitle title="人才指数" aside="多维度人才统计分析"/><div className="ttf-talent-metrics">{data.metrics.map((item,index)=><div key={item.label}><span>{item.label}</span><strong className={index===2?"is-growth":""}>{item.value}</strong></div>)}</div></article>
    <div className="ttf-talent-primary-grid">
      <article className="ttf-talent-panel ttf-talent-city-panel"><PanelTitle title="全国人才分布" aside="人才最密集 TOP 5 城市"/><div className="ttf-talent-city-bars" role="list" aria-label={`${domain}领域全国人才分布前五城市`}>{data.cities.map((city,index)=><button type="button" role="listitem" className={selectedCity===city.name?"is-active":""} aria-pressed={selectedCity===city.name} onClick={()=>setSelectedCity(city.name)} key={city.name}><b>{String(index+1).padStart(2,"0")}</b><span>{city.name}</span><i><em style={{width:`${Math.round(city.value/maxCityValue*100)}%`}}/></i><strong>{city.value.toLocaleString("zh-CN")}</strong></button>)}</div><p className="ttf-talent-chart-note">点击城市可查看对应城市的人才机构排名。</p></article>
      <article className="ttf-talent-panel ttf-talent-radar-panel"><PanelTitle title="地区影响力对比" aside="六维参考指数"/><div className="ttf-talent-city-selects"><ArcoFilterSelect label="城市一" value={radarPrimaryCity} options={cityOptions} onChange={selectRadarPrimaryCity}/><span>对比</span><ArcoFilterSelect label="城市二" value={compareCity} options={cityOptions} onChange={(value)=>value!==radarPrimaryCity&&setCompareCity(value)}/></div><div className="ttf-talent-radar-stage"><RadarChart primary={primaryCity} secondary={secondaryCity} visible={radarVisible} activeIndex={activeRadarDimension} onActiveIndexChange={setActiveRadarDimension}/>{activeRadarDimension!==null?<div className="ttf-talent-radar-tooltip" aria-live="polite"><strong>{talentDimensions[activeRadarDimension]}</strong><span><i className="is-blue"/>{primaryCity.name}<b>{primaryCity.radar[activeRadarDimension]}</b></span><span><i className="is-green"/>{secondaryCity.name}<b>{secondaryCity.radar[activeRadarDimension]}</b></span></div>:null}</div><div className="ttf-talent-radar-legend"><button type="button" className={radarVisible.primary?"is-active":""} aria-pressed={radarVisible.primary} onClick={()=>setRadarVisible((current)=>({...current,primary:!current.primary}))}><i className="is-blue"/>{primaryCity.name}</button><button type="button" className={radarVisible.secondary?"is-active":""} aria-pressed={radarVisible.secondary} onClick={()=>setRadarVisible((current)=>({...current,secondary:!current.secondary}))}><i className="is-green"/>{secondaryCity.name}</button></div></article>
    </div>
    <div className="ttf-talent-secondary-grid">
      <article className="ttf-talent-panel ttf-talent-hotspot-panel"><PanelTitle title="科研热点" aside="近五年热门研究领域"/><div className="ttf-talent-hotspots" aria-label={`${domain}领域科研热点`}>{data.hotspots.map((item)=><button type="button" className={activeHotspot===item.name?"is-active":""} aria-pressed={activeHotspot===item.name} style={{fontSize:`${13+Math.round((item.heat-60)*.12)}px`}} onClick={()=>setActiveHotspot(item.name)} key={item.name}><span>{item.name}</span><small>{item.heat}</small></button>)}</div></article>
      <article className="ttf-talent-panel ttf-talent-institution-panel"><PanelTitle title="机构排名" aside={`${selectedCity} · 影响力 TOP 5`}/><ol>{institutions.map((item,index)=><li key={item.name}><b>{String(index+1).padStart(2,"0")}</b><span>{item.name}</span><small>影响力 {item.score}</small></li>)}</ol></article>
    </div>
  </section>;
}

const careerShares = [
  { place: "加拿大·多伦多", share: 9 },
  { place: "法国·巴黎", share: 15 },
  { place: "中国·北京", share: 20 },
  { place: "美国·斯坦福", share: 21 },
  { place: "中国·深圳", share: 18 },
  { place: "中国·上海", share: 18 },
] as const;

function careerPoint(index: number, value: number, radius = 92) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / careerShares.length;
  const scaledRadius = radius * (value / 25);
  return [165 + Math.cos(angle) * scaledRadius, 135 + Math.sin(angle) * scaledRadius] as const;
}

function CareerRadar({ activeIndex, onActiveIndexChange }: { activeIndex: number; onActiveIndexChange: (index: number) => void }) {
  const ring = (value: number) => careerShares.map((_,index)=>careerPoint(index,value).join(",")).join(" ");
  const polygon = careerShares.map((item,index)=>careerPoint(index,item.share).join(",")).join(" ");
  return <svg className="ttf-career-radar" viewBox="0 0 330 270" role="img" aria-label="六个学术生涯驻点的停留时长占比雷达图">
    {[6.25,12.5,18.75,25].map((value)=><polygon key={value} points={ring(value)} fill="none" stroke="#d9e0e8"/>)}
    {careerShares.map((item,index)=>{const [x,y]=careerPoint(index,25);return <line key={item.place} x1="165" y1="135" x2={x} y2={y} stroke="#e5e6eb"/>;})}
    <polygon points={polygon} fill="rgba(22,93,255,.12)" stroke="#165dff" strokeWidth="2"/>
    {careerShares.map((item,index)=>{const [x,y]=careerPoint(index,item.share);return <circle key={`${item.place}-point`} cx={x} cy={y} r="3.5" fill="#165dff"><title>{item.place}：{item.share}%</title></circle>;})}
    {careerShares.map((item,index)=>{const [x,y]=careerPoint(index,31);return <g className={activeIndex===index?"is-active":""} role="button" tabIndex={0} aria-label={`查看${item.place}停留时长`} onMouseEnter={()=>onActiveIndexChange(index)} onClick={()=>onActiveIndexChange(index)} onKeyDown={(event)=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();onActiveIndexChange(index);}}} key={`${item.place}-label`}><circle className="ttf-career-radar-hit" cx={x} cy={y} r="24"/><text x={x} y={y+4} textAnchor={x>175?"start":x<155?"end":"middle"}>{item.place}</text></g>;})}
  </svg>;
}

function MobilitySection() {
  const [activeStop,setActiveStop]=useState(0);
  const [activePaperIndex,setActivePaperIndex]=useState(5);
  const [activeCareerIndex,setActiveCareerIndex]=useState(0);
  const stop=migrationStops[activeStop];
  const activePaper=migrationStops[activePaperIndex];
  const activeCareer=careerShares[activeCareerIndex];
  return <section id="mobility" className="ttf-section ttf-mobility">
    <SectionHeading title="人才流动趋势区" subtitle="学者迁徙图｜论文分布图｜学术生涯分布图"><div className="ttf-mobility-heading-controls"><ArcoFilterSelect label="研究领域" value="人工智能" options={["人工智能"]} onChange={()=>undefined}/><ArcoFilterSelect label="学者" value="张教授" options={["张教授"]} onChange={()=>undefined}/></div></SectionHeading>
    <article className="fp-card ttf-mobility-workbench">
      <PanelTitle title="学者迁徙图" aside="5 次迁徙｜6个驻点"/>
      <div className="ttf-map-scroll"><div className="ttf-map">
        <img className="ttf-map-background" src={`${mapAssetRoot}/world-map.svg`} alt="学者全球迁徙路线地图" />
        {migrationRoutes.map((route)=><img className="ttf-map-route" src={`${mapAssetRoot}/${route.src}`} alt="" style={{left:route.left,top:route.top,width:route.width,height:route.height}} key={route.src}/>)}
        {migrationStops.map((item,index)=><div className={`ttf-map-stop${index===activeStop?" is-active":""}${index===migrationStops.length-1?" is-current":""}`} style={{left:item.marker[0],top:item.marker[1]}} key={item.city}>
          <button type="button" aria-label={`查看第${index+1}站${item.city}`} aria-pressed={activeStop===index} onClick={()=>setActiveStop(index)}>
            <img className="is-halo" src={`${mapAssetRoot}/${index===migrationStops.length-1?"marker-current-halo.svg":"marker-halo.svg"}`} alt=""/>
            <img className="is-core" src={`${mapAssetRoot}/${index===activeStop?"marker-active.svg":index===migrationStops.length-1?"marker-green.svg":"marker-blue.svg"}`} alt=""/>
            <span>{index+1}</span>
          </button>
        </div>)}
        {migrationStops.map((item,index)=><button type="button" className={`ttf-map-label${index===activeStop?" is-active":""}${index===migrationStops.length-1?" is-current":""}`} style={{left:item.label[0],top:item.label[1]}} onClick={()=>setActiveStop(index)} key={`${item.city}-label`}>{item.city}</button>)}
        <div className="ttf-map-legend"><span><img src={`${mapAssetRoot}/legend-route.svg`} alt=""/>迁徙路线</span><span><i className="is-history"/>历史驻点</span><span><i className="is-current"/>当前驻点</span></div>
      </div></div>
      <h4 className="ttf-migration-timeline-title">迁徙时间轴</h4>
      <div className="ttf-migration-timeline">{migrationStops.map((item,index)=><button className={activeStop===index?"active":""} type="button" onClick={()=>setActiveStop(index)} key={item.city}><i>{index+1}</i><b>{item.city}</b><small>{item.date}</small></button>)}</div>
      <div className="ttf-stop-detail"><header><strong>{stop.country}·{stop.city}</strong><em>{stop.institution}</em></header><div><span><small>所在地址</small>{stop.address}</span><span><small>迁入时间</small>{stop.enteredAt}</span><span><small>迁出时间</small>{stop.leftAt}</span><span><small>停留时长</small>{stop.duration}</span><span><small>地区发表论文数</small><b>{stop.papers}篇</b></span></div></div>
      <div className="ttf-paper-chart"><PanelTitle title="论文分布数" aside="单位：篇"/><div className="ttf-paper-chart-body"><div className="ttf-paper-y-axis">{[40,30,20,10,0].map((value)=><span key={value}>{value}</span>)}</div><div className="ttf-paper-plot"><div className="ttf-paper-grid">{[40,30,20,10,0].map((value)=><i key={value}/>)}</div><div className="ttf-paper-tooltip" style={{left:`${(activePaperIndex+.5)/migrationStops.length*100}%`}} aria-live="polite"><strong>{2020+activePaperIndex}</strong><span>{activePaper.papers} 篇</span></div><div className="ttf-paper-bars">{migrationStops.map((item,index)=><button type="button" className={activePaperIndex===index?"is-active":""} aria-label={`${2020+index}年发表${item.papers}篇论文`} aria-pressed={activePaperIndex===index} onMouseEnter={()=>setActivePaperIndex(index)} onFocus={()=>setActivePaperIndex(index)} onClick={()=>setActivePaperIndex(index)} key={item.city}><span>{item.papers}</span><i style={{height:`${Math.max(16,item.papers/40*128)}px`}}/><small>{2020+index}</small></button>)}</div></div></div></div>
      <div className="ttf-career"><PanelTitle title="学术生涯分布图" aside="停留时长"/><div className="ttf-career-layout"><div className="ttf-career-radar-stage"><CareerRadar activeIndex={activeCareerIndex} onActiveIndexChange={setActiveCareerIndex}/><div className="ttf-career-radar-tooltip" aria-live="polite"><strong>{activeCareer.place}</strong><span>停留时长占比 <b>{activeCareer.share}%</b></span></div></div><div className="ttf-career-shares">{careerShares.map((item,index)=><button type="button" className={activeCareerIndex===index?"is-active":""} aria-pressed={activeCareerIndex===index} onClick={()=>setActiveCareerIndex(index)} key={item.place}><b>{item.place}</b><em>{item.share}%</em></button>)}</div></div></div>
    </article>
  </section>;
}

function NewsDetailPage({ item }: { item: TalentNewsItem }) {
  const backUrl=new URL(window.location.href);
  backUrl.searchParams.delete("news");
  backUrl.hash="news";
  return <article className="ttf-news-detail-page">
    <header><a href={`${backUrl.pathname}${backUrl.search}${backUrl.hash}`}><ChevronLeft size={16}/>返回资讯列表</a><div><span>{item.field}</span><h2>{item.title}</h2><p>{item.summary}</p></div></header>
    <dl><div><dt>资讯来源</dt><dd>{item.source}</dd></div><div><dt>发表时间</dt><dd><time dateTime={item.publishedAt}>{item.publishedAt}</time></dd></div><div><dt>相关学者</dt><dd>{item.scholars.join("、")}</dd></div><div><dt>信息价值</dt><dd>{item.valueScore}</dd></div></dl>
    <section><h3>资讯详情</h3><ul>{item.details.map((detail)=><li key={detail}>{detail}</li>)}</ul><p><ShieldCheck size={14}/>信息来源：{item.source}</p></section>
  </article>;
}

function NewsSection() {
  const pageSize=10;
  const [tab,setTab]=useState<"all"|"followed">("all");
  const [query,setQuery]=useState("");
  const [field,setField]=useState("全部领域");
  const [sort,setSort]=useState<"最新发布"|"价值优先"|"关注度优先">("最新发布");
  const [followedIds,setFollowedIds]=useState<Set<string>>(new Set(["multimodal-medical"]));
  const [likedIds,setLikedIds]=useState<Set<string>>(new Set());
  const [currentPage,setCurrentPage]=useState(1);
  const fields=useMemo(()=>["全部领域",...Array.from(new Set(talentNewsItems.map((item)=>item.field)))],[ ]);
  const visibleNews=useMemo(()=>{
    const keyword=query.trim().toLocaleLowerCase("zh-CN");
    return talentNewsItems
      .filter((item)=>(tab==="all"||followedIds.has(item.id))&&(field==="全部领域"||item.field===field)&&(!keyword||`${item.title}${item.summary}${item.source}${item.scholars.join("")}`.toLocaleLowerCase("zh-CN").includes(keyword)))
      .sort((left,right)=>sort==="价值优先"?right.valueScore-left.valueScore:sort==="关注度优先"?(right.likes+(likedIds.has(right.id)?1:0))-(left.likes+(likedIds.has(left.id)?1:0)):Date.parse(right.publishedAt)-Date.parse(left.publishedAt));
  },[field,followedIds,likedIds,query,sort,tab]);
  const pageCount=Math.max(1,Math.ceil(visibleNews.length/pageSize));
  const effectivePage=Math.min(currentPage,pageCount);
  const paginatedNews=useMemo(()=>visibleNews.slice((effectivePage-1)*pageSize,effectivePage*pageSize),[effectivePage,visibleNews]);
  useEffect(()=>setCurrentPage((page)=>Math.min(page,pageCount)),[pageCount]);
  const toggleSet=(setter:typeof setFollowedIds,id:string)=>setter((current)=>{const next=new Set(current);if(next.has(id))next.delete(id);else next.add(id);return next;});
  const clearFilters=()=>{setQuery("");setField("全部领域");setSort("最新发布");setTab("all");setCurrentPage(1);};
  const openNews=(item:TalentNewsItem)=>{const url=new URL(window.location.href);url.searchParams.set("page","think-tank");url.searchParams.set("news",item.id);url.hash="news";window.location.assign(`${url.pathname}${url.search}${url.hash}`);};
  return <section id="news" className="ttf-section ttf-news">
    <SectionHeading title="人才动态资讯区" subtitle="最新资讯｜定向查询｜关注追踪｜价值与热度排序"/>
    <article className="ttf-news-card">
      <div className="ttf-news-tabs"><div role="tablist" aria-label="人才动态资讯范围"><button className={tab==="all"?"active":""} type="button" role="tab" aria-selected={tab==="all"} onClick={()=>{setTab("all");setCurrentPage(1);}}>全部资讯</button><button className={tab==="followed"?"active":""} type="button" role="tab" aria-selected={tab==="followed"} onClick={()=>{setTab("followed");setCurrentPage(1);}}>我的关注 <small>{followedIds.size}</small></button></div><span>当前显示 {visibleNews.length} 条</span></div>
      <div className="ttf-news-toolbar">
        <label className="ttf-news-search"><Search size={16}/><input value={query} onChange={(event)=>{setQuery(event.target.value);setCurrentPage(1);}} placeholder="搜索资讯标题、来源或相关学者" aria-label="定向查询人才动态资讯"/></label>
        <ArcoFilterSelect label="领域" value={field} options={fields} onChange={(value)=>{setField(value);setCurrentPage(1);}}/>
        <ArcoFilterSelect label="排序" value={sort} options={["最新发布","价值优先","关注度优先"]} onChange={(value)=>{setSort(value as typeof sort);setCurrentPage(1);}}/>
      </div>
      <div className="ttf-news-list">{visibleNews.length?paginatedNews.map((item)=>{const liked=likedIds.has(item.id);const followed=followedIds.has(item.id);return <article key={item.id}>
        <div className="ttf-news-main"><header><span>{item.field}</span><h3>{item.title}</h3></header><p title={item.summary}>{item.summary}</p><div className="ttf-news-meta"><span><Building2 size={14}/>{item.source}</span><span><CalendarDays size={14}/><time dateTime={item.publishedAt}>{item.publishedAt}</time></span></div><div className="ttf-news-scholars"><UserRound size={14}/><span>相关学者</span>{item.scholars.map((scholar)=><button type="button" onClick={()=>{setQuery(scholar);setTab("all");setCurrentPage(1);}} key={scholar}>{scholar}</button>)}</div></div>
        <div className="ttf-news-actions"><button className={liked?"is-active":""} type="button" aria-pressed={liked} onClick={()=>toggleSet(setLikedIds,item.id)}><Heart size={15} fill={liked?"currentColor":"none"}/>{new Intl.NumberFormat("zh-CN").format(item.likes+(liked?1:0))}</button><button className={followed?"is-active":""} type="button" aria-pressed={followed} onClick={()=>toggleSet(setFollowedIds,item.id)}><Star size={15} fill={followed?"currentColor":"none"}/>{followed?"已关注":"关注"}</button><button className="is-detail" type="button" onClick={()=>openNews(item)}>查看详情<ChevronRight size={14}/></button></div>
      </article>}):<div className="ttf-news-empty"><strong>{tab==="followed"?"暂未找到关注资讯":"未找到符合条件的资讯"}</strong><p>{tab==="followed"?"关注人才动态后，可在这里集中查看。":"请调整搜索词、领域或排序条件。"}</p><button type="button" onClick={clearFilters}>查看全部资讯</button></div>}</div>
      <footer className="ttf-news-summary"><span>支持按发布时间、信息价值与关注度排序</span><ArcoPagination label={`${tab==="all"?"全部资讯":"我的关注"}分页`} current={effectivePage} total={visibleNews.length} pageSize={pageSize} onChange={setCurrentPage}/></footer>
    </article>
  </section>;
}

export default function FigmaThinkTankPage() {
  const currentUrl = new URL(window.location.href);
  const reportId = currentUrl.searchParams.get("report");
  const newsId = currentUrl.searchParams.get("news");
  const report = consultingReports.find((item) => item.id === reportId) ?? null;
  const newsItem = talentNewsItems.find((item) => item.id === newsId) ?? null;
  useEffect(() => {
    if (report) document.title = `${report.title} - 战略咨询报告`;
    else if (newsItem) document.title = `${newsItem.title} - 人才动态资讯`;
  }, [newsItem,report]);

  if (report) return <main className="ttf-report-standalone"><PortalHeader currentPage="think-tank"/><div className="ttf-report-standalone-shell"><ReportDetailPage report={report}/></div></main>;
  if (newsItem) return <main className="ttf-news-standalone"><PortalHeader currentPage="think-tank"/><div className="ttf-news-standalone-shell"><NewsDetailPage item={newsItem}/></div></main>;

  return <main className="ttf-page">
    <PortalHeader currentPage="think-tank" />
    <section id="top" className="ttf-hero">
      <img src="./assets/thinktank-hero-20261013.png" alt="" />
      <div className="ttf-hero-copy"><h1>新型高端智库</h1><p>整合领域技术路线梳理、战略咨询报告、人才分布与流动分析，提供高价值的产业、人才、技术决策参考</p></div>
    </section>
    <div className="fp-locator-stage">
      <div className="ttf-content"><TechnologySection/><ReportsSection/><TalentSection/><MobilitySection/><NewsSection/></div>
      <PageSectionLocator items={thinkTankLocatorItems} topId="top" label="内容定位" />
    </div>
  </main>;
}
