import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Handshake,
  Layers3,
  MapPin,
  Network,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import "./service-module.css";

type ServiceModuleProps = {
  subId: string;
  industry: string;
};

type MetricItem = {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
};

type DistributionItem = {
  label: string;
  value: number;
};

type RegionScope = "global" | "national";

type RegionItem = {
  name: string;
  count: number;
  x: number;
  y: number;
  labelDx?: number;
  labelDy?: number;
  textAnchor?: "start" | "middle" | "end";
};

type CapabilityInstitution = {
  id: number;
  rank: number;
  name: string;
  type: string;
  city: string;
  focus: string;
  score: number;
  metrics: [number, number, number, number];
};

type CapabilitySortKey = "score" | "metric-0" | "metric-1" | "metric-2" | "metric-3";

type ShenzhenInstitution = {
  id: string;
  name: string;
  founded: string;
  leader: string;
  people: string;
  revenue: string;
  scale: string;
  fields: string[];
  regions: string[];
  summary: string;
};

const INDUSTRIES = [
  "合成生物",
  "区块链",
  "细胞与基因",
  "空天技术",
  "脑科学与类脑智能",
  "深地深海",
  "可见光通信与光计算",
  "量子信息",
];

const INDUSTRY_CHAIN_NODES: Record<string, [string[], string[], string[]]> = {
  合成生物: [
    ["生物基原料", "基因合成与测序", "发酵与检测装备", "酶制剂与催化元件", "自动化实验平台"],
    ["底盘细胞构建", "基因编辑", "发酵工艺优化", "代谢通路设计", "分离纯化"],
    ["生物基材料", "医药健康产品", "食品与农业", "生物能源与化学品", "环境治理"],
  ],
  区块链: [
    ["密码算法", "分布式存储", "芯片与基础设施", "身份与密钥服务", "安全审计工具"],
    ["底层链平台", "智能合约与中间件", "跨链与可信计算", "联盟链治理", "区块链即服务"],
    ["供应链金融", "政务与数据要素", "数字版权服务", "跨境贸易", "可信存证"],
  ],
  细胞与基因: [
    ["细胞样本与载体", "基因测序设备", "培养基与试剂", "质粒与病毒载体", "自动化制备设备"],
    ["细胞制备", "基因递送与编辑", "质控与中试", "细胞扩增与培养", "冷链与放行"],
    ["肿瘤治疗", "遗传病治疗", "再生医学", "伴随诊断", "细胞存储服务"],
  ],
  空天技术: [
    ["先进材料与元器件", "遥感载荷", "测控与地面设备", "推进与能源系统", "仿真测试设备"],
    ["卫星研制", "火箭与发射服务", "星座运营与数据处理", "总装集成", "在轨测控"],
    ["卫星通信", "遥感应用", "导航与时空服务", "气象与海洋服务", "应急保障"],
  ],
  脑科学与类脑智能: [
    ["神经影像设备", "脑机接口器件", "神经数据与模型", "植入电极材料", "刺激与记录设备"],
    ["神经机制研究", "脑机交互系统", "类脑芯片与算法", "神经信号解码", "闭环调控平台"],
    ["医疗康复", "智能交互", "教育与认知评估", "辅助沟通", "智能假肢"],
  ],
  深地深海: [
    ["耐压材料与传感器", "探测装备", "海洋与地质数据", "水下通信", "能源与动力系统"],
    ["深海作业系统", "深地勘探工程", "样品与数据分析", "水下导航定位", "长期观测平台"],
    ["资源勘探", "灾害监测", "环境与工程服务", "海洋牧场", "海工运维"],
  ],
  可见光通信与光计算: [
    ["光源与探测器", "光学材料与器件", "驱动与封装设备", "高速调制驱动", "光学封装测试"],
    ["可见光通信模组", "光计算芯片", "系统集成与算法", "信道建模与编码", "光电协同系统"],
    ["室内通信与定位", "数据中心加速", "车联网与工业互联", "低空通信", "医疗与安全照明"],
  ],
  量子信息: [
    ["低温与真空设备", "激光与微波器件", "量子材料与芯片", "单光子探测器", "控制电子学"],
    ["量子计算", "量子通信", "量子精密测量", "量子纠错与控制", "量子网络节点"],
    ["科研计算服务", "安全通信", "传感与导航", "金融安全", "地质与医学探测"],
  ],
};

const STAGE_META = [
  { label: "上游基础", note: "要素与支撑", className: "is-upstream" },
  { label: "中游核心", note: "研发与工程化", className: "is-midstream" },
  { label: "下游应用", note: "产品与场景", className: "is-downstream" },
];

const SERVICE_CONTENTS = [
  ["供应组织与质量检验", "设备共享与计量校准", "标准咨询与合规辅导", "资源对接与采购协同"],
  ["联合研发与技术咨询", "中试验证与工程放大", "知识产权与成果转化", "测试认证与质量体系"],
  ["场景开放与供需对接", "投融资与产业孵化", "市场拓展与品牌服务", "政策申报与落地辅导"],
];

const CAPABILITY_NAMES = [
  "湾区先进技术协同中心",
  "鹏城产业验证服务院",
  "深科成果转化促进中心",
  "前海科技金融服务中心",
  "光明中试工程服务院",
  "南山知识产权运营中心",
  "龙岗产业技术服务站",
  "河套联合研发促进中心",
  "湾区标准与质量研究中心",
  "鹏城检验检测公共平台",
  "深湾未来产业孵化中心",
  "前沿技术评价服务院",
  "大湾区工程咨询中心",
  "深科产业情报服务中心",
  "鹏城创新资源配置中心",
  "湾区产业人才服务院",
  "深南技术交易促进中心",
  "光明科技设施共享中心",
  "前海跨境创新服务站",
  "龙华先进制造服务中心",
  "宝安技术改造促进院",
  "坪山成果熟化服务中心",
  "盐田产业协作服务站",
  "大鹏科技场景促进中心",
  "罗湖科技商务服务中心",
  "福田创新政策服务中心",
  "深港技术协同服务院",
  "湾区创业孵化联合体",
  "鹏城产业标准促进中心",
  "深圳未来技术服务联盟",
];

const REGION_META: Record<RegionScope, Omit<RegionItem, "count">[]> = {
  global: [
    { name: "中国", x: 73, y: 47, labelDx: -4, labelDy: -7, textAnchor: "end" },
    { name: "亚洲其他", x: 83, y: 57, labelDx: 4, labelDy: 8, textAnchor: "start" },
    { name: "北美", x: 20, y: 42 },
    { name: "欧洲", x: 49, y: 34 },
    { name: "大洋洲", x: 86, y: 76 },
    { name: "其他地区", x: 55, y: 68 },
  ],
  national: [
    { name: "广东", x: 63, y: 73, labelDx: 4, labelDy: 8, textAnchor: "start" },
    { name: "北京", x: 62, y: 32, labelDx: 0, labelDy: -7 },
    { name: "上海", x: 79, y: 52, labelDx: 5, labelDy: -4, textAnchor: "start" },
    { name: "江苏", x: 71, y: 45, labelDx: -5, labelDy: -7, textAnchor: "end" },
    { name: "浙江", x: 75, y: 61, labelDx: 5, labelDy: 8, textAnchor: "start" },
    { name: "湖北", x: 56, y: 56, labelDx: -5, labelDy: 8, textAnchor: "end" },
    { name: "四川", x: 40, y: 58, labelDx: -4, labelDy: -7, textAnchor: "end" },
    { name: "陕西", x: 50, y: 42, labelDx: -5, labelDy: -7, textAnchor: "end" },
  ],
};

const REGION_RATIOS: Record<RegionScope, number[]> = {
  global: [.35, .15, .18, .16, .1, .06],
  national: [.22, .18, .15, .13, .11, .09, .07, .05],
};

const SHENZHEN_DISTRICTS: DistributionItem[] = [
  { label: "南山区", value: 28 },
  { label: "福田区", value: 19 },
  { label: "宝安区", value: 17 },
  { label: "龙岗区", value: 16 },
  { label: "光明区", value: 14 },
  { label: "龙华区", value: 12 },
  { label: "坪山区", value: 9 },
  { label: "罗湖区", value: 7 },
  { label: "盐田区", value: 5 },
  { label: "大鹏新区", value: 4 },
];

const SHENZHEN_INSTITUTIONS: ShenzhenInstitution[] = [
  {
    id: "future-service",
    name: "鹏城未来产业公共服务中心",
    founded: "2018 年（演示）",
    leader: "周岚（虚构）",
    people: "186 人（演示）",
    revenue: "2.8 亿元（演示）",
    scale: "中型服务机构（演示分类）",
    fields: ["中试验证", "成果转化", "标准咨询"],
    regions: ["深圳", "东莞", "香港"],
    summary: "面向未来产业提供工程验证、成果熟化与供需协同服务的虚构机构样本。",
  },
  {
    id: "bay-tech",
    name: "湾区产业技术协同服务院",
    founded: "2020 年（演示）",
    leader: "陈启（虚构）",
    people: "142 人（演示）",
    revenue: "1.9 亿元（演示）",
    scale: "中型服务机构（演示分类）",
    fields: ["联合研发", "技术评价", "检验检测"],
    regions: ["深圳", "广州", "珠海"],
    summary: "围绕产业链共性技术组织联合研发和检测评价的虚构机构样本。",
  },
  {
    id: "deep-incubator",
    name: "深科成果熟化与孵化中心",
    founded: "2017 年（演示）",
    leader: "林澄（虚构）",
    people: "96 人（演示）",
    revenue: "1.2 亿元（演示）",
    scale: "小型服务机构（演示分类）",
    fields: ["产业孵化", "科技金融", "知识产权"],
    regions: ["南山区", "光明区", "福田区"],
    summary: "提供早期项目筛选、科技金融和知识产权运营的虚构机构样本。",
  },
  {
    id: "sz-standard",
    name: "深圳前沿标准与质量服务中心",
    founded: "2021 年（演示）",
    leader: "许研（虚构）",
    people: "74 人（演示）",
    revenue: "0.8 亿元（演示）",
    scale: "小型服务机构（演示分类）",
    fields: ["标准研制", "质量体系", "认证辅导"],
    regions: ["深圳", "佛山", "惠州"],
    summary: "针对新兴技术产品提供标准研制与质量体系辅导的虚构机构样本。",
  },
];

function industryIndex(industry: string) {
  const index = INDUSTRIES.indexOf(industry);
  return index < 0 ? 0 : index;
}

function DemoBadge({ children }: { children: ReactNode }) {
  return <span className="tp-sm-demo-badge"><ShieldCheck size={13} aria-hidden="true" />{children}</span>;
}

function DemoName({ children }: { children: ReactNode }) {
  return <span className="tp-sm-demo-name"><span>{children}</span><small>虚构</small></span>;
}

function Panel({ title, description, action, className = "", children }: {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return <section className={`tp-sm-panel ${className}`.trim()}>
    <header className="tp-sm-panel-header">
      <div><h3>{title}</h3><p>{description}</p></div>
      {action}
    </header>
    <div className="tp-sm-panel-body">{children}</div>
  </section>;
}

function MetricBand({ items }: { items: MetricItem[] }) {
  return <dl className="tp-sm-metric-band">
    {items.map(({ label, value, note, icon: Icon }) => <div key={label}>
      <Icon size={19} aria-hidden="true" />
      <dt>{label}</dt>
      <dd>{value}</dd>
      <small>{note}</small>
    </div>)}
  </dl>;
}

function TrendChart({ values, label }: { values: number[]; label: string }) {
  const years = [2020, 2021, 2022, 2023, 2024, 2025];
  const max = Math.max(...values);
  const range = Math.max(max, 1);
  const points = values.map((value, index) => ({
    x: 38 + index * 92,
    y: 151 - (value / range) * 105,
    value,
  }));
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  const seriesLabel = years.map((year, index) => `${year}年${values[index]}家`).join("，");
  return <figure className="tp-sm-trend">
    <svg viewBox="0 0 540 190" role="img" aria-label={`${label}：${seriesLabel}。`}>
      {[46, 81, 116, 151].map((y) => <line key={y} x1="38" x2="500" y1={y} y2={y} />)}
      <path className="tp-sm-trend-area" d={`${path} L500 151 L38 151 Z`} />
      <path className="tp-sm-trend-line" d={path} />
      {points.map((point, index) => <g key={years[index]}>
        <circle cx={point.x} cy={point.y} r="4" />
        <text className="tp-sm-trend-value" x={point.x} y={point.y - 11}>{point.value}</text>
        <text className="tp-sm-trend-year" x={point.x} y="176">{years[index]}</text>
      </g>)}
    </svg>
    <figcaption>单位：家</figcaption>
  </figure>;
}

function DistributionBars({ items, suffix = "家", compact = false }: {
  items: DistributionItem[];
  suffix?: string;
  compact?: boolean;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return <div className={`tp-sm-bars ${compact ? "is-compact" : ""}`}>
    {items.map((item) => <div key={item.label}>
      <span>{item.label}</span>
      <i aria-hidden="true"><b style={{ "--tp-sm-bar-width": `${item.value / max * 100}%` } as CSSProperties} /></i>
      <strong>{item.value} {suffix}</strong>
    </div>)}
  </div>;
}

function TrendAnalysis({ values, label }: { values: number[]; label: string }) {
  const years = [2020, 2021, 2022, 2023, 2024, 2025].slice(0, values.length);
  const [selectedIndex, setSelectedIndex] = useState(values.length - 1);
  const currentValue = values[selectedIndex] ?? values.at(-1) ?? 0;
  const previousValue = selectedIndex > 0 ? values[selectedIndex - 1] : currentValue;
  const growth = previousValue ? Number(((currentValue - previousValue) / previousValue * 100).toFixed(1)) : 0;
  return <div className="tp-sm-trend-analysis">
    <div className="tp-sm-analysis-summary"><div><span>当前年份</span><strong>{years[selectedIndex]} 年</strong></div><div><span>服务机构数量</span><strong>{currentValue} 家</strong></div><small>{selectedIndex ? `同比 ${growth >= 0 ? "+" : ""}${growth}%` : "统计基期"}</small></div>
    <TrendChart values={values} label={label} />
    <div className="tp-sm-year-tabs" role="group" aria-label="选择全球服务机构统计年份">{years.map((year, index) => <button type="button" className={selectedIndex === index ? "is-active" : ""} aria-pressed={selectedIndex === index} onClick={() => setSelectedIndex(index)} key={year}><span>{year}</span><strong>{values[index]} 家</strong></button>)}</div>
  </div>;
}

function DistributionAnalysis({ items, ariaLabel, compact = false, selectedLabel, selectionLabel = "当前分类", onSelect }: { items: DistributionItem[]; ariaLabel: string; compact?: boolean; selectedLabel?: string; selectionLabel?: string; onSelect?: (label: string) => void }) {
  const [internalSelectedLabel, setInternalSelectedLabel] = useState(items[0]?.label ?? "");
  const activeLabel = selectedLabel ?? internalSelectedLabel;
  const selected = items.find((item) => item.label === activeLabel) ?? items[0];
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const max = Math.max(...items.map((item) => item.value), 1);
  const share = selected && total ? (selected.value / total * 100).toFixed(1) : "0.0";
  const chooseItem = (label: string) => { setInternalSelectedLabel(label); onSelect?.(label); };
  return <div className={`tp-sm-distribution-analysis${compact ? " is-compact" : ""}`}>
    {selected ? <div className="tp-sm-analysis-summary" aria-live="polite"><div><span>{selectionLabel}</span><strong>{selected.label}</strong></div><div><span>机构数量</span><strong>{selected.value} 家</strong></div><small>占服务机构总量 {share}%</small></div> : null}
    <div className="tp-sm-distribution-selector" role="group" aria-label={ariaLabel}>{items.map((item) => <button type="button" className={selected?.label === item.label ? "is-active" : ""} aria-pressed={selected?.label === item.label} onClick={() => chooseItem(item.label)} key={item.label}><span>{item.label}</span><i aria-hidden="true"><b style={{ "--tp-sm-bar-width": `${item.value / max * 100}%` } as CSSProperties} /></i><strong>{item.value} 家</strong></button>)}</div>
  </div>;
}

function splitOverviewTotal(total: number, ratios: number[]) {
  let used = 0;
  return ratios.map((ratio, index) => {
    if (index === ratios.length - 1) return Math.max(0, total - used);
    const value = Math.round(total * ratio);
    used += value;
    return value;
  });
}

function overviewData(industry: string) {
  const offset = industryIndex(industry) * 13;
  const total = 326 + offset;
  const typeValues = splitOverviewTotal(total, [.23, .19, .18, .16, .13, .11]);
  return {
    total,
    trend: [178, 205, 234, 266, 298, 326].map((value, index) => value + Math.round(offset * (index + 1) / 6)),
    types: [
      { label: "技术研发服务", value: typeValues[0] },
      { label: "检验检测服务", value: typeValues[1] },
      { label: "成果转化服务", value: typeValues[2] },
      { label: "产业孵化服务", value: typeValues[3] },
      { label: "科技金融服务", value: typeValues[4] },
      { label: "知识产权服务", value: typeValues[5] },
    ],
    scales: [
      { label: "大型机构", value: Math.round(total * .18) },
      { label: "中型机构", value: Math.round(total * .41) },
      { label: "小微机构", value: total - Math.round(total * .18) - Math.round(total * .41) },
    ],
  };
}

function ServiceOverview({ industry }: { industry: string }) {
  const data = overviewData(industry);
  const latestAdded = data.trend.at(-1)! - data.trend.at(-2)!;
  return <div className="tp-sm-stack">
    <MetricBand items={[
      { label: "服务机构总量", value: `${data.total} 家`, note: `${industry} · 2025 年`, icon: Handshake },
      { label: "2025 年新增", value: `${latestAdded} 家`, note: "较 2024 年", icon: Globe2 },
      { label: "机构类型", value: "6 类", note: "按主要服务能力分类", icon: Layers3 },
      { label: "规模层级", value: "3 档", note: "大型、中型和小微", icon: Building2 },
    ]} />
    <div className="tp-sm-overview-grid">
      <Panel title="服务机构数量分析" description={`${industry} · 全球服务机构总体数量及 2020—2025 年趋势`}><TrendAnalysis values={data.trend} label={`${industry}全球服务机构数量趋势`} /></Panel>
      <Panel title="服务机构类型分析" description="按机构主要服务能力分类统计"><DistributionAnalysis items={data.types} ariaLabel="选择全球服务机构类型" compact /></Panel>
    </div>
    <Panel title="服务机构规模分析" description="大型、中型和小微机构的数量与占比分布">
      <div className="tp-sm-scale-layout">
        <DistributionAnalysis items={data.scales} ariaLabel="选择全球服务机构规模" />
        <dl className="tp-sm-scale-summary">
          {data.scales.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{Math.round(item.value / data.total * 100)}%</dd></div>)}
        </dl>
      </div>
    </Panel>
  </div>;
}

function serviceNodeCount(industry: string, stageIndex: number, nodeIndex: number) {
  return 12 + industryIndex(industry) * 2 + stageIndex * 7 + nodeIndex * 3;
}

function ServiceIndustryDistribution({ industry, compact = false }: { industry: string; compact?: boolean }) {
  const chain = INDUSTRY_CHAIN_NODES[industry] ?? INDUSTRY_CHAIN_NODES.合成生物;
  const [selectedKey, setSelectedKey] = useState("0-0");
  const [stageIndex, nodeIndex] = selectedKey.split("-").map(Number);
  const nodeName = chain[stageIndex]?.[nodeIndex] ?? chain[0][0];
  const stageServices = SERVICE_CONTENTS[stageIndex] ?? SERVICE_CONTENTS[0];
  const services = [
    `${nodeName}技术咨询与方案设计`,
    stageServices[nodeIndex % stageServices.length],
    stageServices[(nodeIndex + 1) % stageServices.length],
    stageServices[(nodeIndex + 2) % stageServices.length],
  ];
  const count = serviceNodeCount(industry, stageIndex, nodeIndex);
  const maxCount = Math.max(...chain.flatMap((stage, laneIndex) => stage.map((_, itemIndex) => serviceNodeCount(industry, laneIndex, itemIndex))), 1);
  const institutionSamples = [
    `${nodeName}协同服务中心`,
    `${nodeName}公共技术平台`,
  ];
  return <div className={`tp-sm-chain ${compact ? "is-compact" : ""}`}>
    <div className="tp-sm-chain-lanes" role="group" aria-label={`${industry}服务机构产业链节点分布`}>
      {chain.map((stage, laneIndex) => <section className={STAGE_META[laneIndex].className} key={STAGE_META[laneIndex].label}>
        <header><strong>{STAGE_META[laneIndex].label}</strong><span>{STAGE_META[laneIndex].note}</span></header>
        <div>
          {stage.map((name, itemIndex) => {
            const key = `${laneIndex}-${itemIndex}`;
            const itemCount = serviceNodeCount(industry, laneIndex, itemIndex);
            return <button key={name} type="button" aria-pressed={selectedKey === key} aria-label={`${STAGE_META[laneIndex].label}，${name}，${itemCount} 家服务机构`} onClick={() => setSelectedKey(key)}>
              <span>{name}</span><small>{itemCount} 家服务机构</small><i aria-hidden="true"><b style={{ "--tp-sm-node-width": `${itemCount / maxCount * 100}%` } as CSSProperties} /></i>
            </button>;
          })}
        </div>
      </section>)}
    </div>
    <aside className="tp-sm-chain-detail">
      <header className="tp-sm-chain-status" aria-live="polite"><div><span>{STAGE_META[stageIndex].label}</span><h4>{nodeName}</h4></div><strong>{count}<small>家服务机构</small></strong></header>
      <p>服务机构围绕该产业节点提供研发协同、工程验证、成果转化及资源对接等支持。</p>
      <div className="tp-sm-chain-detail-grid">
        <section><h5>主要服务内容</h5><ul>{services.map((service) => <li key={service}><Wrench size={13} aria-hidden="true" />{service}</li>)}</ul></section>
        <section><h5>关联服务机构</h5><ul>{institutionSamples.map((name) => <li key={name}><Building2 size={13} aria-hidden="true" /><span>{name}</span></li>)}</ul></section>
      </div>
    </aside>
  </div>;
}

function ServiceIndustry({ industry }: { industry: string }) {
  const chain = INDUSTRY_CHAIN_NODES[industry] ?? INDUSTRY_CHAIN_NODES.合成生物;
  const nodeCount = chain.flat().length;
  const associationCount = chain.reduce((sum, stage, stageIndex) => sum + stage.reduce((stageSum, _, nodeIndex) => stageSum + serviceNodeCount(industry, stageIndex, nodeIndex), 0), 0);
  return <div className="tp-sm-stack">
    <MetricBand items={[
      { label: "产业链阶段", value: `${chain.length} 个`, note: "上游、中游、下游", icon: Network },
      { label: "产业链节点", value: `${nodeCount} 个`, note: `${industry}产业链全景`, icon: Layers3 },
      { label: "节点机构关联", value: `${associationCount} 家次`, note: "同一机构可关联多个节点", icon: Building2 },
      { label: "服务事项", value: `${SERVICE_CONTENTS.flat().length} 项`, note: "覆盖研发、验证与转化", icon: Wrench },
    ]} />
    <div className="tp-sm-module-note"><Network size={18} aria-hidden="true" /><p>产业链按照上游基础、中游核心、下游应用组织。选择任一节点可查看机构数量、主要服务内容和关联服务机构；同一机构可服务多个节点，节点关联量不直接相加为机构总量。</p></div>
    <Panel title={`${industry}服务机构产业分布`} description="结合产业链全景图，展示服务机构在各产业链节点上的服务分布情况" action={<span className="tp-sm-panel-action">点击节点查看详情</span>}>
      <ServiceIndustryDistribution industry={industry} />
    </Panel>
  </div>;
}

function serviceRegionData(industry: string, scope: RegionScope): RegionItem[] {
  const globalTotal = overviewData(industry).total;
  const total = scope === "global" ? globalTotal : Math.round(globalTotal * .61);
  const counts = splitOverviewTotal(total, REGION_RATIOS[scope]);
  return REGION_META[scope].map((item, index) => ({ ...item, count: counts[index] }));
}

function RegionMap({ scope, items, selectedName, onSelect }: { scope: RegionScope; items: RegionItem[]; selectedName: string; onSelect: (item: RegionItem) => void }) {
  const scopeLabel = scope === "global" ? "全球" : "全国";
  const seriesLabel = items.map((item) => `${item.name}${item.count}家`).join("，");
  return <figure className={`tp-sm-region-map is-${scope}`} role="group" aria-label={`${scopeLabel}服务机构区域分布：${seriesLabel}。`}>
    <svg viewBox="0 0 100 88" role="group" aria-label={`${scopeLabel}服务机构地图点位`} focusable="false">
      {scope === "global" ? <g className="tp-sm-land" aria-hidden="true">
        <path d="M6 24L15 13 29 16 35 25 29 34 19 36 13 45 7 38Z" />
        <path d="M26 48L35 48 40 59 35 77 29 68Z" />
        <path d="M43 20L54 14 61 20 58 30 66 35 63 48 54 45 49 34 41 30Z" />
        <path d="M60 19L78 14 94 24 90 37 79 41 73 53 62 47 66 35 58 30Z" />
        <path d="M79 64L91 61 97 72 91 80 79 77 74 69Z" />
      </g> : <g className="tp-sm-land" aria-hidden="true">
        <path d="M18 24L31 14 48 17 57 23 68 21 85 31 91 43 83 52 76 51 70 64 57 72 45 69 35 76 29 65 18 59 10 46Z" />
        <path d="M80 55L86 58 84 65 79 62Z" />
      </g>}
      {items.map((item) => <g className={`tp-sm-map-point${selectedName === item.name ? " is-selected" : ""}`} role="button" tabIndex={selectedName === item.name ? 0 : -1} aria-pressed={selectedName === item.name} aria-label={`${item.name}，${item.count} 家服务机构`} onClick={() => onSelect(item)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(item); } }} key={item.name} transform={`translate(${item.x} ${item.y})`}>
        <circle className="tp-sm-map-pulse" r={4 + Math.min(item.count / 120, 2.2)} />
        <circle r="2.3" />
        <text x={item.labelDx ?? 0} y={item.labelDy ?? -6} textAnchor={item.textAnchor ?? "middle"}>{item.name}</text>
      </g>)}
    </svg>
    <figcaption><span><i />机构数量越高，标记范围越大</span><small>点击地图或右侧图表查看区域详情</small></figcaption>
  </figure>;
}

function ServiceRegion({ industry }: { industry: string }) {
  const [scope, setScope] = useState<RegionScope>("global");
  const items = serviceRegionData(industry, scope);
  const [selectedName, setSelectedName] = useState(items[0]?.name ?? "");
  const selected = items.find((item) => item.name === selectedName) ?? items[0];
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const share = selected && total ? (selected.count / total * 100).toFixed(1) : "0.0";
  const chooseScope = (nextScope: RegionScope) => {
    const nextItems = serviceRegionData(industry, nextScope);
    setScope(nextScope);
    setSelectedName(nextItems[0]?.name ?? "");
  };
  const distributionItems = items.map(({ name, count }) => ({ label: name, value: count }));
  return <div className="tp-sm-stack">
    <Panel title="服务机构区域分布" description={`${industry} · 通过地图和数量图表展示全球或全国区域分布`} action={<span className="tp-sm-panel-action">地图与图表联动</span>}>
      <div className="tp-sm-region-toolbar">
        <div role="group" aria-label="区域统计范围">
          <button type="button" aria-pressed={scope === "global"} onClick={() => chooseScope("global")}><Globe2 size={15} aria-hidden="true" />全球分布</button>
          <button type="button" aria-pressed={scope === "national"} onClick={() => chooseScope("national")}><MapPin size={15} aria-hidden="true" />全国分布</button>
        </div>
        <p aria-live="polite"><span>{scope === "global" ? "全球服务机构" : "全国服务机构"}</span><strong>{total} 家</strong><small>当前区域：{selected?.name} · {selected?.count} 家 · {share}%</small></p>
      </div>
      <div className="tp-sm-region-layout">
        <RegionMap scope={scope} items={items} selectedName={selected?.name ?? ""} onSelect={(item) => setSelectedName(item.name)} />
        <section className="tp-sm-region-ranking" aria-label="区域服务机构数量图表"><DistributionAnalysis items={distributionItems} ariaLabel="选择服务机构区域" compact selectedLabel={selected?.name} selectionLabel="当前区域" onSelect={setSelectedName} /></section>
      </div>
    </Panel>
  </div>;
}

function capabilityData(industry: string): CapabilityInstitution[] {
  const focusNodes = INDUSTRY_CHAIN_NODES[industry]?.flat() ?? INDUSTRY_CHAIN_NODES.合成生物.flat();
  const types = ["公共技术服务", "成果转化服务", "检验检测服务", "产业孵化服务", "科技金融服务"];
  const cities = ["深圳", "北京", "上海", "广州", "苏州", "杭州", "武汉", "成都"];
  const offset = industryIndex(industry);
  return CAPABILITY_NAMES.map((name, index) => {
    const metrics: [number, number, number, number] = [
      96 - (index * 3 + offset) % 22,
      94 - (index * 5 + offset) % 21,
      92 - (index * 4 + offset) % 24,
      90 - (index * 7 + offset) % 23,
    ];
    const score = Math.round(metrics.reduce((sum, value, metricIndex) => sum + value * CAPABILITY_METRICS[metricIndex].weight / 100, 0) * 10) / 10;
    return { id: index + 1, rank: 0, name, type: types[index % types.length], city: cities[index % cities.length], focus: focusNodes[index % focusNodes.length], score, metrics };
  }).sort((a, b) => b.score - a.score || a.id - b.id).map((item, index) => ({ ...item, rank: index + 1 }));
}

const CAPABILITY_METRICS = [
  { key: "metric-0" as const, label: "技术资源", weight: 32, description: "技术设施、专家与数据资源" },
  { key: "metric-1" as const, label: "工程验证", weight: 28, description: "中试、测试与工程化能力" },
  { key: "metric-2" as const, label: "成果转化", weight: 24, description: "技术交易、孵化与产业落地" },
  { key: "metric-3" as const, label: "服务覆盖", weight: 16, description: "服务节点、区域与产业覆盖" },
];

function CapabilityDetail({ item, industry, rank, sortLabel }: { item: CapabilityInstitution; industry: string; rank: number; sortLabel: string }) {
  return <article className="tp-sm-capability-detail">
    <header aria-live="polite"><div><span>当前选择 · 第 {rank} 位</span><h4>{item.name}</h4></div><strong>{item.score.toFixed(1)}<small>综合评分</small></strong></header>
    <dl>
      <div><dt>机构类型</dt><dd>{item.type}</dd></div>
      <div><dt>所在城市</dt><dd>{item.city}</dd></div>
      <div><dt>重点服务领域</dt><dd>{industry} · {item.focus}</dd></div>
      <div><dt>当前排序依据</dt><dd>{sortLabel}</dd></div>
    </dl>
    <section><h5>固定评价指标</h5>{CAPABILITY_METRICS.map((metric, index) => <div className="tp-sm-score-row" key={metric.label}>
      <span>{metric.label}<small>权重 {metric.weight}%</small></span>
      <i aria-hidden="true"><b style={{ "--tp-sm-score-width": `${item.metrics[index]}%` } as CSSProperties} /></i>
      <strong>{item.metrics[index]}</strong>
    </div>)}</section>
    <p>综合评分按固定权重计算：技术资源 32%、工程验证 28%、成果转化 24%、服务覆盖 16%。</p>
  </article>;
}

function ServiceCapability({ industry }: { industry: string }) {
  const institutions = useMemo(() => capabilityData(industry), [industry]);
  const [sortKey, setSortKey] = useState<CapabilitySortKey>("score");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(institutions[0].id);
  const pageSize = 10;
  const metricIndex = sortKey === "score" ? -1 : Number(sortKey.slice(-1));
  const sortLabel = sortKey === "score" ? "综合评分" : CAPABILITY_METRICS[metricIndex].label;
  const sortedInstitutions = useMemo(() => [...institutions].sort((left, right) => {
    const leftValue = sortKey === "score" ? left.score : left.metrics[metricIndex];
    const rightValue = sortKey === "score" ? right.score : right.metrics[metricIndex];
    return rightValue - leftValue || right.score - left.score || left.id - right.id;
  }), [institutions, metricIndex, sortKey]);
  const pageCount = Math.ceil(sortedInstitutions.length / pageSize);
  const visible = sortedInstitutions.slice((page - 1) * pageSize, page * pageSize);
  const selected = sortedInstitutions.find((item) => item.id === selectedId) ?? visible[0];
  const selectedRank = sortedInstitutions.findIndex((item) => item.id === selected.id) + 1;
  useEffect(() => { setPage(1); setSelectedId(sortedInstitutions[0]?.id ?? 1); }, [industry, sortKey, sortedInstitutions]);
  const goToPage = (nextPage: number) => {
    const safePage = Math.min(Math.max(nextPage, 1), pageCount);
    setPage(safePage);
    setSelectedId(sortedInstitutions[(safePage - 1) * pageSize].id);
  };
  return <div className="tp-sm-stack">
    <MetricBand items={[
      { label: "评价机构", value: `${institutions.length} 家`, note: `${industry}服务机构`, icon: Building2 },
      { label: "固定指标", value: `${CAPABILITY_METRICS.length} 项`, note: "统一评价维度", icon: Layers3 },
      { label: "评分满分", value: "100 分", note: "固定权重加权", icon: ShieldCheck },
      { label: "榜单分页", value: `${pageCount} 页`, note: `每页 ${pageSize} 家`, icon: Network },
    ]} />
    <div className="tp-sm-capability-method"><header><div><strong>固定指标评价模型</strong><span>综合评分由四项指标按固定权重计算</span></div><b>权重合计 100%</b></header><dl>{CAPABILITY_METRICS.map((metric) => <div key={metric.key}><dt>{metric.label}<strong>{metric.weight}%</strong></dt><dd>{metric.description}</dd></div>)}</dl></div>
    <Panel title={`${industry}服务机构技术能力 Top 30`} description="按固定指标综合评价；可切换排序维度并查看机构指标详情" action={<span className="tp-sm-panel-action">固定指标加权评分</span>}>
      <div className="tp-sm-capability-toolbar"><span>排序维度</span><div role="group" aria-label="服务机构技术能力排序维度"><button type="button" aria-pressed={sortKey === "score"} onClick={() => setSortKey("score")}>综合评分</button>{CAPABILITY_METRICS.map((metric) => <button type="button" aria-pressed={sortKey === metric.key} onClick={() => setSortKey(metric.key)} key={metric.key}>{metric.label}</button>)}</div><small>当前按{sortLabel}降序</small></div>
      <div className="tp-sm-capability-layout">
        <div className="tp-sm-capability-list">
          <header><span>位次 / 机构</span><span>{sortLabel}</span></header>
          <ol start={(page - 1) * pageSize + 1}>
            {visible.map((item, index) => <li key={item.id}>
              <button type="button" aria-pressed={selected.id === item.id} onClick={() => setSelectedId(item.id)}>
                <b>{String((page - 1) * pageSize + index + 1).padStart(2, "0")}</b>
                <span><strong>{item.name}</strong><small>{item.type} · {item.city}</small></span>
                <strong>{sortKey === "score" ? item.score.toFixed(1) : item.metrics[metricIndex]}</strong>
              </button>
            </li>)}
          </ol>
          <nav className="tp-sm-pagination" aria-label="技术能力 Top30 分页">
            <button type="button" aria-label="上一页" disabled={page === 1} onClick={() => goToPage(page - 1)}><ChevronLeft size={15} /></button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} type="button" aria-label={`第 ${pageNumber} 页`} aria-current={page === pageNumber ? "page" : undefined} onClick={() => goToPage(pageNumber)}>{pageNumber}</button>)}
            <button type="button" aria-label="下一页" disabled={page === pageCount} onClick={() => goToPage(page + 1)}><ChevronRight size={15} /></button>
          </nav>
        </div>
        <CapabilityDetail item={selected} industry={industry} rank={selectedRank} sortLabel={sortLabel} />
      </div>
    </Panel>
  </div>;
}

function ShenzhenInstitutionDetail({ item }: { item: ShenzhenInstitution }) {
  return <article className="tp-sm-shenzhen-detail" aria-live="polite">
    <header><div><span>重点产业服务机构</span><h4><DemoName>{item.name}</DemoName></h4></div><Building2 size={24} aria-hidden="true" /></header>
    <p>{item.summary}</p>
    <dl>
      <div><dt>成立时间</dt><dd>{item.founded}</dd></div>
      <div><dt>主要领导人</dt><dd>{item.leader}</dd></div>
      <div><dt>当前人数</dt><dd>{item.people}</dd></div>
      <div><dt>当前营收</dt><dd>{item.revenue}</dd></div>
      <div className="is-wide"><dt>机构规模</dt><dd>{item.scale}</dd></div>
      <div className="is-wide"><dt>业务服务领域</dt><dd>{item.fields.join("、")}</dd></div>
      <div className="is-wide"><dt>业务分布区域</dt><dd>{item.regions.join("、")}</dd></div>
    </dl>
  </article>;
}

function ShenzhenService({ industry }: { industry: string }) {
  const offset = industryIndex(industry) * 3;
  const total = 118 + offset;
  const trend = [72, 81, 89, 98, 107, 118].map((value, index) => value + Math.round(offset * (index + 1) / 6));
  const types = [
    { label: "技术研发服务", value: 29 + offset % 5 },
    { label: "检验检测服务", value: 24 + offset % 4 },
    { label: "成果转化服务", value: 22 + offset % 3 },
    { label: "产业孵化服务", value: 19 + offset % 4 },
    { label: "科技金融服务", value: 15 + offset % 3 },
    { label: "知识产权服务", value: 9 + offset % 2 },
  ];
  const [selectedId, setSelectedId] = useState(SHENZHEN_INSTITUTIONS[0].id);
  const selected = SHENZHEN_INSTITUTIONS.find((item) => item.id === selectedId) ?? SHENZHEN_INSTITUTIONS[0];
  const districtLabel = SHENZHEN_DISTRICTS.map((item) => `${item.label}${item.value}家`).join("，");
  return <div className="tp-sm-stack">
    <div className="tp-sm-module-note"><MapPin size={18} aria-hidden="true" /><p>深圳产业服务数据、机构名称、领导人、营收及业务范围均为虚构演示，用于验证标书字段和交互结构。</p></div>
    <MetricBand items={[
      { label: "深圳服务机构", value: `${total} 家`, note: `${industry}演示样本`, icon: Handshake },
      { label: "机构类型", value: "6 类", note: "按主要服务能力分类", icon: Layers3 },
      { label: "产业节点", value: "12 个", note: "覆盖上中下游", icon: Network },
      { label: "行政区", value: "10 个", note: "深圳全域演示分布", icon: MapPin },
    ]} />
    <div className="tp-sm-shenzhen-overview">
      <Panel title="产业服务机构数量" description="深圳服务机构六年数量变化趋势"><TrendChart values={trend} label={`深圳${industry}服务机构数量趋势`} /></Panel>
      <Panel title="产业机构类型统计" description="按主要服务能力统计机构数量"><DistributionBars items={types} compact /></Panel>
    </div>
    <Panel title="产业机构产业领域分布" description="结合深圳产业链全景，展示服务机构在各节点的服务分布" action={<DemoBadge>节点主体为虚构演示</DemoBadge>}>
      <ServiceIndustryDistribution industry={industry} compact />
    </Panel>
    <Panel title="产业机构区域分布" description="深圳 10 个行政区服务机构数量演示统计" action={<DemoBadge>10 区完整展示</DemoBadge>}>
      <div className="tp-sm-district-layout">
        <div className="tp-sm-district-map" role="img" aria-label={`深圳十区服务机构数量演示分布：${districtLabel}。区域位置为示意。`}>
          <MapPin size={26} aria-hidden="true" /><strong>深圳 10 区</strong><span>{SHENZHEN_DISTRICTS.reduce((sum, item) => sum + item.value, 0)} 家演示样本</span><small>区域位置为示意，右侧展示完整数量</small>
        </div>
        <DistributionBars items={SHENZHEN_DISTRICTS} suffix="" compact />
      </div>
    </Panel>
    <Panel title="重点产业服务机构" description="展示机构概况、当前规模、业务服务领域和业务分布区域" action={<DemoBadge>机构与字段均为虚构</DemoBadge>}>
      <div className="tp-sm-institution-master-detail">
        <nav aria-label="重点产业服务机构选择">
          {SHENZHEN_INSTITUTIONS.map((item) => <button key={item.id} type="button" aria-pressed={selected.id === item.id} onClick={() => setSelectedId(item.id)}>
            <DemoName>{item.name}</DemoName><small>{item.fields[0]} · {item.scale.replace("（演示分类）", "")}</small>
          </button>)}
        </nav>
        <ShenzhenInstitutionDetail item={selected} />
      </div>
    </Panel>
  </div>;
}

export function ServiceModule({ subId, industry }: ServiceModuleProps) {
  return <div className="tp-service-module">
    {subId === "service-overview" && <ServiceOverview industry={industry} />}
    {subId === "service-industry" && <ServiceIndustry industry={industry} />}
    {subId === "service-region" && <ServiceRegion industry={industry} />}
    {subId === "service-capability" && <ServiceCapability industry={industry} />}
    {subId === "shenzhen-service" && <ShenzhenService industry={industry} />}
  </div>;
}
