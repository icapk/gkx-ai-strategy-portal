import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Building2,
  CalendarRange,
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
};

type CapabilityInstitution = {
  id: number;
  name: string;
  type: string;
  city: string;
  focus: string;
  score: number;
  metrics: [number, number, number, number];
};

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
    ["生物基原料", "基因合成与测序", "发酵与检测装备", "菌种与酶制剂"],
    ["底盘细胞构建", "基因编辑", "发酵工艺优化", "中试放大与质控"],
    ["生物基材料", "医药健康产品", "食品与农业", "绿色化学品"],
  ],
  区块链: [
    ["密码算法", "分布式存储", "可信硬件", "网络与算力设施"],
    ["底层链平台", "智能合约与中间件", "跨链互操作", "隐私计算"],
    ["供应链金融", "政务与数据要素", "数字版权", "产业协同"],
  ],
  细胞与基因: [
    ["细胞样本与载体", "基因测序设备", "培养基与试剂", "实验耗材"],
    ["细胞制备", "基因递送与编辑", "质量控制", "临床前验证"],
    ["肿瘤治疗", "遗传病治疗", "再生医学", "精准诊断"],
  ],
  空天技术: [
    ["先进材料", "核心元器件", "航电与动力", "地面测控设施"],
    ["飞行器总体设计", "载荷与系统集成", "试验验证", "测运控服务"],
    ["遥感应用", "卫星通信", "低空服务", "空间信息服务"],
  ],
  脑科学与类脑智能: [
    ["神经电极材料", "脑成像设备", "实验模型", "信号采集芯片"],
    ["神经信号解码", "脑机接口系统", "类脑算法", "闭环调控"],
    ["康复医疗", "辅助沟通", "智能假肢", "类脑计算应用"],
  ],
  深地深海: [
    ["耐压材料", "水下通信", "能源与动力", "传感与探测设备"],
    ["水下导航定位", "长期观测平台", "深海作业系统", "样品分析"],
    ["海洋牧场", "资源勘探", "海工运维", "生态监测"],
  ],
  可见光通信与光计算: [
    ["光源与探测器", "高速调制器", "光学材料", "封装测试设备"],
    ["信道建模与编码", "光电协同系统", "光计算芯片", "系统集成验证"],
    ["室内通信", "低空通信", "数据中心", "医疗与安全照明"],
  ],
  量子信息: [
    ["量子材料", "单光子探测器", "低温设备", "控制电子学"],
    ["量子纠错与控制", "量子网络节点", "量子测量", "系统标定"],
    ["金融安全", "政务通信", "精密测量", "地质与医学探测"],
  ],
};

const STAGE_META = [
  { label: "上游支撑", note: "资源、器件与基础设施", className: "is-upstream" },
  { label: "中游服务", note: "研发、验证与工程化", className: "is-midstream" },
  { label: "下游赋能", note: "产品、场景与市场服务", className: "is-downstream" },
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

const REGION_DATA: Record<RegionScope, RegionItem[]> = {
  global: [
    { name: "中国", count: 326, x: 73, y: 47 },
    { name: "北美", count: 218, x: 20, y: 42 },
    { name: "欧洲", count: 184, x: 49, y: 34 },
    { name: "东亚", count: 127, x: 82, y: 43 },
    { name: "东南亚", count: 86, x: 77, y: 63 },
    { name: "大洋洲", count: 58, x: 86, y: 78 },
  ],
  national: [
    { name: "广东", count: 126, x: 63, y: 73 },
    { name: "北京", count: 104, x: 62, y: 32 },
    { name: "上海", count: 92, x: 77, y: 52 },
    { name: "江苏", count: 81, x: 72, y: 47 },
    { name: "浙江", count: 74, x: 74, y: 59 },
    { name: "湖北", count: 59, x: 57, y: 56 },
    { name: "四川", count: 48, x: 40, y: 58 },
    { name: "陕西", count: 42, x: 50, y: 42 },
  ],
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
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const points = values.map((value, index) => ({
    x: 38 + index * 92,
    y: 151 - ((value - min) / range) * 105,
    value,
  }));
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  const seriesLabel = years.map((year, index) => `${year}年${values[index]}家`).join("，");
  return <figure className="tp-sm-trend">
    <svg viewBox="0 0 540 190" role="img" aria-label={`${label}：${seriesLabel}。数值为演示统计。`}>
      {[46, 81, 116, 151].map((y) => <line key={y} x1="38" x2="500" y1={y} y2={y} />)}
      <path className="tp-sm-trend-area" d={`${path} L500 151 L38 151 Z`} />
      <path className="tp-sm-trend-line" d={path} />
      {points.map((point, index) => <g key={years[index]}>
        <circle cx={point.x} cy={point.y} r="4" />
        <text className="tp-sm-trend-value" x={point.x} y={point.y - 11}>{point.value}</text>
        <text className="tp-sm-trend-year" x={point.x} y="176">{years[index]}</text>
      </g>)}
    </svg>
    <figcaption>单位：家 · 数值为演示统计</figcaption>
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

function overviewData(industry: string) {
  const offset = industryIndex(industry) * 13;
  const total = 326 + offset;
  return {
    total,
    trend: [178, 205, 234, 266, 298, 326].map((value, index) => value + Math.round(offset * (index + 1) / 6)),
    types: [
      { label: "技术研发服务", value: 76 + offset % 9 },
      { label: "检验检测服务", value: 62 + offset % 7 },
      { label: "成果转化服务", value: 58 + offset % 8 },
      { label: "产业孵化服务", value: 51 + offset % 6 },
      { label: "科技金融服务", value: 43 + offset % 5 },
      { label: "知识产权服务", value: 36 + offset % 4 },
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
  return <div className="tp-sm-stack">
    <div className="tp-sm-module-note"><Handshake size={18} aria-hidden="true" /><p>本页展示服务机构数量、类型和规模的完整分析结构；所有机构主体与统计均为虚构演示，不代表真实产业结论。</p></div>
    <MetricBand items={[
      { label: "服务机构总量", value: `${data.total} 家`, note: `${industry}全球演示样本`, icon: Handshake },
      { label: "机构类型", value: "6 类", note: "按主要服务能力分类", icon: Layers3 },
      { label: "大型机构", value: `${data.scales[0].value} 家`, note: "演示规模口径", icon: Building2 },
      { label: "统计周期", value: "6 年", note: "2020—2025", icon: CalendarRange },
    ]} />
    <div className="tp-sm-overview-grid">
      <Panel title="服务机构数量分析" description={`${industry} · 全球服务机构六年数量趋势`}><TrendChart values={data.trend} label={`${industry}全球服务机构数量趋势`} /></Panel>
      <Panel title="服务机构类型分析" description="按机构主要服务能力进行演示分类"><DistributionBars items={data.types} compact /></Panel>
    </div>
    <Panel title="服务机构规模分析" description="大型、中型和小微机构的数量分布；规模划分为演示口径">
      <div className="tp-sm-scale-layout">
        <DistributionBars items={data.scales} />
        <dl className="tp-sm-scale-summary">
          {data.scales.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{Math.round(item.value / data.total * 100)}%</dd></div>)}
        </dl>
      </div>
    </Panel>
  </div>;
}

function ServiceIndustryDistribution({ industry, compact = false }: { industry: string; compact?: boolean }) {
  const chain = INDUSTRY_CHAIN_NODES[industry] ?? INDUSTRY_CHAIN_NODES.合成生物;
  const [selectedKey, setSelectedKey] = useState("0-0");
  const [stageIndex, nodeIndex] = selectedKey.split("-").map(Number);
  const nodeName = chain[stageIndex]?.[nodeIndex] ?? chain[0][0];
  const services = SERVICE_CONTENTS[stageIndex] ?? SERVICE_CONTENTS[0];
  const count = 12 + industryIndex(industry) * 2 + stageIndex * 7 + nodeIndex * 3;
  const institutionSamples = [
    `${nodeName}协同服务中心`,
    `${nodeName}公共技术平台`,
  ];
  return <div className={`tp-sm-chain ${compact ? "is-compact" : ""}`}>
    <div className="tp-sm-chain-lanes" aria-label={`${industry}服务机构产业链节点分布`}>
      {chain.map((stage, laneIndex) => <section className={STAGE_META[laneIndex].className} key={STAGE_META[laneIndex].label}>
        <header><strong>{STAGE_META[laneIndex].label}</strong><span>{STAGE_META[laneIndex].note}</span></header>
        <div>
          {stage.map((name, itemIndex) => {
            const key = `${laneIndex}-${itemIndex}`;
            const itemCount = 12 + industryIndex(industry) * 2 + laneIndex * 7 + itemIndex * 3;
            return <button key={name} type="button" aria-pressed={selectedKey === key} onClick={() => setSelectedKey(key)}>
              <span>{name}</span><small>{itemCount} 家服务机构</small>
            </button>;
          })}
        </div>
      </section>)}
    </div>
    <aside className="tp-sm-chain-detail" aria-live="polite">
      <header><div><span>{STAGE_META[stageIndex].label}</span><h4>{nodeName}</h4></div><strong>{count}<small>家 · 演示</small></strong></header>
      <p>服务机构围绕该产业节点提供研发协同、工程验证、成果转化及资源对接等支持。</p>
      <div className="tp-sm-chain-detail-grid">
        <section><h5>主要服务内容</h5><ul>{services.map((service) => <li key={service}><Wrench size={13} aria-hidden="true" />{service}</li>)}</ul></section>
        <section><h5>关联机构样本</h5><ul>{institutionSamples.map((name) => <li key={name}><Building2 size={13} aria-hidden="true" /><DemoName>{name}</DemoName></li>)}</ul></section>
      </div>
    </aside>
  </div>;
}

function ServiceIndustry({ industry }: { industry: string }) {
  return <div className="tp-sm-stack">
    <div className="tp-sm-module-note"><Network size={18} aria-hidden="true" /><p>产业链按照上游支撑、中游服务、下游赋能组织多个语义节点。选择节点可查看服务内容和虚构机构样本。</p></div>
    <Panel title={`${industry}服务机构产业分布`} description="结合产业链全景，展示服务机构在各节点上的服务分布" action={<DemoBadge>节点数量为演示统计</DemoBadge>}>
      <ServiceIndustryDistribution industry={industry} />
    </Panel>
  </div>;
}

function RegionMap({ scope, items }: { scope: RegionScope; items: RegionItem[] }) {
  const scopeLabel = scope === "global" ? "全球" : "全国";
  const seriesLabel = items.map((item) => `${item.name}${item.count}家`).join("，");
  return <figure className={`tp-sm-region-map is-${scope}`} role="img" aria-label={`${scopeLabel}服务机构区域分布演示：${seriesLabel}。地图轮廓、点位与数量均为演示。`}>
    <svg viewBox="0 0 100 88" aria-hidden="true" focusable="false">
      {scope === "global" ? <g className="tp-sm-land">
        <path d="M6 24L15 13 29 16 35 25 29 34 19 36 13 45 7 38Z" />
        <path d="M26 48L35 48 40 59 35 77 29 68Z" />
        <path d="M43 20L54 14 61 20 58 30 66 35 63 48 54 45 49 34 41 30Z" />
        <path d="M60 19L78 14 94 24 90 37 79 41 73 53 62 47 66 35 58 30Z" />
        <path d="M79 64L91 61 97 72 91 80 79 77 74 69Z" />
      </g> : <g className="tp-sm-land">
        <path d="M18 24L31 14 48 17 57 23 68 21 85 31 91 43 83 52 76 51 70 64 57 72 45 69 35 76 29 65 18 59 10 46Z" />
        <path d="M80 55L86 58 84 65 79 62Z" />
      </g>}
      {items.map((item) => <g className="tp-sm-map-point" key={item.name} transform={`translate(${item.x} ${item.y})`}>
        <circle className="tp-sm-map-pulse" r={4 + Math.min(item.count / 120, 2.2)} />
        <circle r="2.3" />
        <text y="-6">{item.name}</text>
      </g>)}
    </svg>
    <figcaption><span><i />机构数量越高，标记范围越大</span><small>地图轮廓与点位均为演示示意</small></figcaption>
  </figure>;
}

function ServiceRegion({ industry }: { industry: string }) {
  const [scope, setScope] = useState<RegionScope>("global");
  const items = REGION_DATA[scope];
  const total = items.reduce((sum, item) => sum + item.count, 0);
  return <div className="tp-sm-stack">
    <Panel title="服务机构区域分布" description={`${industry} · 通过地图和数量图表查看全球或全国区域分布`} action={<DemoBadge>区域与数量均为演示</DemoBadge>}>
      <div className="tp-sm-region-toolbar" aria-label="区域统计范围">
        <div>
          <button type="button" aria-pressed={scope === "global"} onClick={() => setScope("global")}><Globe2 size={15} aria-hidden="true" />全球分布</button>
          <button type="button" aria-pressed={scope === "national"} onClick={() => setScope("national")}><MapPin size={15} aria-hidden="true" />全国分布</button>
        </div>
        <p><span>{scope === "global" ? "全球演示样本" : "全国演示样本"}</span><strong>{total} 家</strong></p>
      </div>
      <div className="tp-sm-region-layout" aria-live="polite">
        <RegionMap scope={scope} items={items} />
        <section className="tp-sm-region-ranking"><header><strong>区域机构数量</strong><small>单位：家</small></header><DistributionBars items={items.map(({ name, count }) => ({ label: name, value: count }))} suffix="" compact /></section>
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
    const score = Math.round(metrics[0] * .32 + metrics[1] * .28 + metrics[2] * .24 + metrics[3] * .16);
    return { id: index + 1, name, type: types[index % types.length], city: cities[index % cities.length], focus: focusNodes[index % focusNodes.length], score, metrics };
  }).sort((a, b) => b.score - a.score || a.id - b.id).map((item, index) => ({ ...item, id: index + 1 }));
}

const CAPABILITY_METRICS = [
  { label: "技术资源", weight: "32%" },
  { label: "工程验证", weight: "28%" },
  { label: "成果转化", weight: "24%" },
  { label: "服务覆盖", weight: "16%" },
];

function CapabilityDetail({ item, industry }: { item: CapabilityInstitution; industry: string }) {
  return <article className="tp-sm-capability-detail" aria-live="polite">
    <header><div><span>当前选择 · 第 {item.id} 位</span><h4><DemoName>{item.name}</DemoName></h4></div><strong>{item.score}<small>演示综合分</small></strong></header>
    <dl>
      <div><dt>机构类型</dt><dd>{item.type}</dd></div>
      <div><dt>所在城市</dt><dd>{item.city}</dd></div>
      <div><dt>重点服务领域</dt><dd>{industry} · {item.focus}</dd></div>
    </dl>
    <section><h5>固定演示指标</h5>{CAPABILITY_METRICS.map((metric, index) => <div className="tp-sm-score-row" key={metric.label}>
      <span>{metric.label}<small>权重 {metric.weight}</small></span>
      <i aria-hidden="true"><b style={{ "--tp-sm-score-width": `${item.metrics[index]}%` } as CSSProperties} /></i>
      <strong>{item.metrics[index]}</strong>
    </div>)}</section>
    <p>当前排序仅用于展示 Top30、分页和指标详情结构，不构成正式评价或推荐。</p>
  </article>;
}

function ServiceCapability({ industry }: { industry: string }) {
  const institutions = useMemo(() => capabilityData(industry), [industry]);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(institutions[0].id);
  const pageSize = 10;
  const pageCount = Math.ceil(institutions.length / pageSize);
  const visible = institutions.slice((page - 1) * pageSize, page * pageSize);
  const selected = institutions.find((item) => item.id === selectedId) ?? visible[0];
  const goToPage = (nextPage: number) => {
    const safePage = Math.min(Math.max(nextPage, 1), pageCount);
    setPage(safePage);
    setSelectedId(institutions[(safePage - 1) * pageSize].id);
  };
  return <div className="tp-sm-stack">
    <div className="tp-sm-module-note is-warning"><ShieldCheck size={18} aria-hidden="true" /><p>30 家机构名称均为虚构，技术能力排序为非正式演示。固定演示指标及权重：技术资源 32%、工程验证 28%、成果转化 24%、服务覆盖 16%。</p></div>
    <Panel title={`${industry}服务机构技术能力 Top30`} description="每页 10 条；选择机构查看固定指标分值与演示权重" action={<DemoBadge>非正式排名</DemoBadge>}>
      <div className="tp-sm-capability-layout">
        <div className="tp-sm-capability-list">
          <header><span>位次 / 机构</span><span>演示分</span></header>
          <ol start={(page - 1) * pageSize + 1}>
            {visible.map((item) => <li key={item.id}>
              <button type="button" aria-pressed={selected.id === item.id} onClick={() => setSelectedId(item.id)}>
                <b>{String(item.id).padStart(2, "0")}</b>
                <span><DemoName>{item.name}</DemoName><small>{item.type} · {item.city}</small></span>
                <strong>{item.score}</strong>
              </button>
            </li>)}
          </ol>
          <nav className="tp-sm-pagination" aria-label="技术能力 Top30 分页">
            <button type="button" aria-label="上一页" disabled={page === 1} onClick={() => goToPage(page - 1)}><ChevronLeft size={15} /></button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} type="button" aria-label={`第 ${pageNumber} 页`} aria-pressed={page === pageNumber} onClick={() => goToPage(pageNumber)}>{pageNumber}</button>)}
            <button type="button" aria-label="下一页" disabled={page === pageCount} onClick={() => goToPage(page + 1)}><ChevronRight size={15} /></button>
          </nav>
        </div>
        <CapabilityDetail item={selected} industry={industry} />
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
