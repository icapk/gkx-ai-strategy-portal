import {
  Activity,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Landmark,
  MapPin,
  MapPinned,
  Network,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import "./policy-module.css";

type PolicyModuleProps = {
  subId: string;
  industry: string;
};

type RegionLevel = "province" | "city";
type PolicyMapLevel = "national" | RegionLevel;
type ComparisonMetric = "count" | "years";
type PolicyComparisonItem = { name: string; count: number; years: number };
type ChainStage = "上游基础" | "中游核心" | "下游应用";
type ChainNode = { name: string; count: number; coverage: number; policyDirections: string[] };
type RankingItem = {
  name: string;
  policyCount: number;
  continuity: number;
  coveredNodes: number;
  score: number;
};
type MapDatum = {
  name: string;
  count: number;
  continuity: number;
  x: number;
  y: number;
  labelDx?: number;
  labelDy?: number;
};
type PolicyNewsItem = {
  date: string;
  region: string;
  issuer: string;
  title: string;
  summary: string;
  url?: string;
};
type PolicyNewsScope = "national" | "shenzhen";

const YEARS = ["2020", "2021", "2022", "2023", "2024", "2025"];

const PROVINCES = [
  "广东省", "北京市", "上海市", "江苏省", "浙江省", "山东省", "湖北省", "四川省",
  "安徽省", "福建省", "陕西省", "天津市", "重庆市", "湖南省", "河南省", "河北省",
  "辽宁省", "江西省", "广西壮族自治区", "云南省", "贵州省", "山西省", "吉林省", "黑龙江省",
  "内蒙古自治区", "甘肃省", "海南省", "宁夏回族自治区", "青海省", "新疆维吾尔自治区", "西藏自治区",
];

const CITIES = [
  "深圳市", "北京市", "上海市", "广州市", "杭州市", "苏州市", "南京市", "武汉市", "成都市", "合肥市",
  "西安市", "天津市", "重庆市", "长沙市", "青岛市", "济南市", "厦门市", "福州市", "宁波市", "无锡市",
  "东莞市", "佛山市", "郑州市", "石家庄市", "沈阳市", "长春市", "哈尔滨市", "南昌市", "昆明市", "贵阳市",
];

const MAP_NATIONAL: Omit<MapDatum, "count" | "continuity">[] = [
  { name: "华北", x: 65, y: 28 },
  { name: "东北", x: 83, y: 17 },
  { name: "华东", x: 79, y: 52 },
  { name: "华中", x: 56, y: 56 },
  { name: "华南", x: 64, y: 79 },
  { name: "西南", x: 37, y: 69 },
  { name: "西北", x: 34, y: 35 },
];

const MAP_PROVINCES: Omit<MapDatum, "count" | "continuity">[] = [
  { name: "北京市", x: 82, y: 18 },
  { name: "上海市", x: 92, y: 52, labelDx: 8, labelDy: -5 },
  { name: "广东省", x: 68, y: 84 },
  { name: "江苏省", x: 82, y: 39, labelDx: -7, labelDy: -4 },
  { name: "浙江省", x: 83, y: 67, labelDx: 7, labelDy: 5 },
  { name: "湖北省", x: 54, y: 60 },
  { name: "四川省", x: 36, y: 70 },
  { name: "安徽省", x: 64, y: 45 },
  { name: "山东省", x: 66, y: 25 },
  { name: "陕西省", x: 43, y: 42 },
];

const MAP_CITIES: Omit<MapDatum, "count" | "continuity">[] = [
  { name: "深圳市", x: 72, y: 84, labelDx: 8, labelDy: 4 },
  { name: "北京市", x: 82, y: 18 },
  { name: "上海市", x: 92, y: 52, labelDx: 8, labelDy: -5 },
  { name: "广州市", x: 56, y: 82, labelDx: -7, labelDy: 4 },
  { name: "杭州市", x: 83, y: 70, labelDx: 8, labelDy: 5 },
  { name: "苏州市", x: 79, y: 40, labelDx: -7, labelDy: -5 },
  { name: "武汉市", x: 54, y: 62 },
  { name: "成都市", x: 36, y: 70 },
  { name: "合肥市", x: 65, y: 47 },
  { name: "西安市", x: 43, y: 42 },
];

type ShenzhenDistrictDatum = { name: string; value: number; x: number; y: number };

const SHENZHEN_DISTRICT_META: Omit<ShenzhenDistrictDatum, "value">[] = [
  { name: "南山区", x: 31, y: 65 },
  { name: "福田区", x: 45, y: 61 },
  { name: "宝安区", x: 21, y: 49 },
  { name: "龙岗区", x: 61, y: 36 },
  { name: "龙华区", x: 43, y: 43 },
  { name: "光明区", x: 32, y: 29 },
  { name: "罗湖区", x: 57, y: 58 },
  { name: "坪山区", x: 74, y: 40 },
  { name: "盐田区", x: 70, y: 58 },
  { name: "大鹏新区", x: 87, y: 49 },
];

const CHAIN_NODES: Record<string, [string[], string[], string[]]> = {
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
  "细胞与基因": [
    ["细胞样本与载体", "基因测序设备", "培养基与试剂", "质粒与病毒载体", "自动化制备设备"],
    ["细胞制备", "基因递送与编辑", "质控与中试", "细胞扩增与培养", "冷链与放行"],
    ["肿瘤治疗", "遗传病治疗", "再生医学", "伴随诊断", "细胞存储服务"],
  ],
  空天技术: [
    ["先进材料与元器件", "遥感载荷", "测控与地面设备", "推进与能源系统", "仿真测试设备"],
    ["卫星研制", "火箭与发射服务", "星座运营与数据处理", "总装集成", "在轨测控"],
    ["卫星通信", "遥感应用", "导航与时空服务", "气象与海洋服务", "应急保障"],
  ],
  "脑科学与类脑智能": [
    ["神经影像设备", "脑机接口器件", "神经数据与模型", "植入电极材料", "刺激与记录设备"],
    ["神经机制研究", "脑机交互系统", "类脑芯片与算法", "神经信号解码", "闭环调控平台"],
    ["医疗康复", "智能交互", "教育与认知评估", "辅助沟通", "智能假肢"],
  ],
  深地深海: [
    ["耐压材料与传感器", "探测装备", "海洋与地质数据", "水下通信", "能源与动力系统"],
    ["深海作业系统", "深地勘探工程", "样品与数据分析", "水下导航定位", "长期观测平台"],
    ["资源勘探", "灾害监测", "环境与工程服务", "海洋牧场", "海工运维"],
  ],
  "可见光通信与光计算": [
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

const FALLBACK_CHAIN = CHAIN_NODES.合成生物;

const POLICY_DIRECTION_TEMPLATES: Record<ChainStage, string[]> = {
  上游基础: ["基础研究与研发投入支持", "关键设备与公共平台建设", "标准研制与检测能力提升"],
  中游核心: ["关键技术联合攻关", "中试验证与工程化支持", "知识产权与成果转化"],
  下游应用: ["示范场景开放", "首台套与首批次应用", "市场拓展与产业化支持"],
};

function industrySeed(industry: string) {
  return Array.from(industry).reduce((total, character, index) => total + character.charCodeAt(0) * (index + 3), 17) % 29;
}

function DemoBadge({ children = "演示数据" }: { children?: ReactNode }) {
  return <span className="tpm-demo-badge"><ShieldCheck size={13} aria-hidden="true" />{children}</span>;
}

function Section({ title, description, action, className = "", children }: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return <section className={`tpm-panel ${className}`.trim()}>
    <header className="tpm-panel-header">
      <div><h3>{title}</h3>{description && <p>{description}</p>}</div>
      {action}
    </header>
    <div className="tpm-panel-body">{children}</div>
  </section>;
}

function MetricStrip({ items }: { items: { label: string; value: string; note: string; icon: LucideIcon }[] }) {
  return <dl className="tpm-metric-strip">
    {items.map((item) => {
      const Icon = item.icon;
      return <div key={item.label}>
        <span><Icon size={19} aria-hidden="true" /></span>
        <dt>{item.label}</dt>
        <dd>{item.value}</dd>
        <small>{item.note}</small>
      </div>;
    })}
  </dl>;
}

function SegmentControl({ value, onChange, label }: { value: RegionLevel; onChange: (value: RegionLevel) => void; label: string }) {
  return <div className="tpm-segments" role="group" aria-label={label}>
    <button type="button" className={value === "province" ? "active" : ""} aria-pressed={value === "province"} onClick={() => onChange("province")}>省级</button>
    <button type="button" className={value === "city" ? "active" : ""} aria-pressed={value === "city"} onClick={() => onChange("city")}>城市</button>
  </div>;
}

function MapLevelControl({ value, onChange }: { value: PolicyMapLevel; onChange: (value: PolicyMapLevel) => void }) {
  const options: { value: PolicyMapLevel; label: string }[] = [{ value: "national", label: "全国" }, { value: "province", label: "省级" }, { value: "city", label: "市级" }];
  return <div className="tpm-segments" role="group" aria-label="政策地图层级">{options.map((option) => <button type="button" className={value === option.value ? "active" : ""} aria-pressed={value === option.value} onClick={() => onChange(option.value)} key={option.value}>{option.label}</button>)}</div>;
}

function MultiLineTrend({ series, label }: { series: { label: string; values: number[]; color: string }[]; label: string }) {
  const width = 660;
  const height = 250;
  const plot = { left: 42, right: 638, top: 20, bottom: 196 };
  const max = Math.max(...series.flatMap((item) => item.values), 1);
  const ceiling = Math.ceil(max / 20) * 20;
  const x = (index: number) => plot.left + index * ((plot.right - plot.left) / Math.max(YEARS.length - 1, 1));
  const y = (value: number) => plot.bottom - value / ceiling * (plot.bottom - plot.top);
  return <figure className="tpm-trend">
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${label}；${series.map((item) => `${item.label}：${item.values.join("、")}`).join("；")}`}>
      {[0, .25, .5, .75, 1].map((ratio) => {
        const gridY = plot.bottom - ratio * (plot.bottom - plot.top);
        return <g key={ratio}><line x1={plot.left} x2={plot.right} y1={gridY} y2={gridY} /><text x={plot.left - 9} y={gridY + 4} textAnchor="end">{Math.round(ceiling * ratio)}</text></g>;
      })}
      {series.map((item) => {
        const points = item.values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
        return <g className="tpm-trend-series" style={{ color: item.color }} key={item.label}>
          <polyline points={points} />
          {item.values.map((value, index) => <circle cx={x(index)} cy={y(value)} r="4" key={`${item.label}-${YEARS[index]}`}><title>{item.label} {YEARS[index]}：{value} 条</title></circle>)}
        </g>;
      })}
      {YEARS.map((year, index) => <text className="tpm-year" x={x(index)} y="222" textAnchor="middle" key={year}>{year}</text>)}
    </svg>
    <figcaption>{series.map((item) => <span key={item.label}><i style={{ background: item.color }} />{item.label}</span>)}</figcaption>
  </figure>;
}

function NationalPolicyTrend({ values, industry, scopeLabel = "全国政策" }: { values: number[]; industry: string; scopeLabel?: string }) {
  const [selectedIndex, setSelectedIndex] = useState(values.length - 1);
  const currentValue = values[selectedIndex] ?? values.at(-1) ?? 0;
  const previousValue = selectedIndex > 0 ? values[selectedIndex - 1] : currentValue;
  const growth = previousValue ? Number(((currentValue - previousValue) / previousValue * 100).toFixed(1)) : 0;
  const continuity = [...values].reverse().findIndex((value) => value <= 0);
  const continuityYears = continuity < 0 ? values.length : continuity;
  return <div className="tpm-national-trend">
    <dl className="tpm-national-trend-summary"><div><dt>当前年份</dt><dd>{YEARS[selectedIndex]} 年</dd></div><div><dt>政策数量</dt><dd>{currentValue} 条</dd></div><div><dt>同比变化</dt><dd>{selectedIndex ? `${growth >= 0 ? "+" : ""}${growth}%` : "统计基期"}</dd></div><div><dt>连续发布</dt><dd>{continuityYears} 年</dd></div></dl>
    <MultiLineTrend label={`${industry}${scopeLabel}数量趋势`} series={[{ label: scopeLabel, values, color: "#1769ff" }]} />
    <div className="tpm-year-tabs" role="group" aria-label={`选择${scopeLabel}统计年份`}>{YEARS.map((year, index) => <button type="button" className={selectedIndex === index ? "is-active" : ""} aria-pressed={selectedIndex === index} onClick={() => setSelectedIndex(index)} key={year}><span>{year}</span><strong>{values[index]} 条</strong></button>)}</div>
  </div>;
}

function ComparisonList({ title, items }: { title: string; items: PolicyComparisonItem[] }) {
  const [metric, setMetric] = useState<ComparisonMetric>("count");
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const sorted = useMemo(() => [...items].sort((left, right) => right[metric] - left[metric] || right.count - left.count || left.name.localeCompare(right.name, "zh-CN")), [items, metric]);
  const pageCount = Math.ceil(sorted.length / pageSize);
  const visible = sorted.slice(page * pageSize, (page + 1) * pageSize);
  const maxCount = Math.max(...items.map((item) => item.count), 1);
  const selectMetric = (nextMetric: ComparisonMetric) => { setMetric(nextMetric); setPage(0); };
  return <section className="tpm-comparison-list">
    <header><div><h4>{title}</h4><span>共 {items.length} 个地区</span></div><div className="tpm-comparison-tabs" role="group" aria-label={`${title}排序维度`}><button type="button" aria-pressed={metric === "count"} onClick={() => selectMetric("count")}>政策数量</button><button type="button" aria-pressed={metric === "years"} onClick={() => selectMetric("years")}>连续年数</button></div></header>
    <div className="tpm-comparison-legend"><span>政策数量</span><span>连续发布年数</span></div>
    <ol start={page * pageSize + 1}>{visible.map((item, index) => <li key={item.name}>
      <b>{String(page * pageSize + index + 1).padStart(2, "0")}</b><div><strong>{item.name}</strong><span>{item.count} 条 · 连续 {item.years} 年</span><i className="is-count" aria-hidden="true"><em style={{ "--tpm-comparison-width": `${item.count / maxCount * 100}%` } as CSSProperties} /></i><i className="is-continuity" aria-hidden="true"><em style={{ "--tpm-comparison-width": `${item.years / YEARS.length * 100}%` } as CSSProperties} /></i></div>
    </li>)}</ol>
    <nav className="tpm-comparison-pagination" aria-label={`${title}分页`}><button type="button" aria-label="上一页" disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))}><ChevronLeft size={15} /></button><span>{page * pageSize + 1}—{Math.min((page + 1) * pageSize, items.length)} / {items.length}</span><button type="button" aria-label="下一页" disabled={page >= pageCount - 1} onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))}><ChevronRight size={15} /></button></nav>
  </section>;
}

function buildOverview(industry: string) {
  const seed = industrySeed(industry);
  const national = [46, 54, 63, 75, 88, 102].map((value, index) => value + (seed % 7) + index * (seed % 3));
  const provinces = PROVINCES.map((name, index) => ({ name, count: Math.max(10, 88 - index * 2 + (seed + index * 3) % 8), years: 6 - (seed + index * 2) % 4 }));
  const cities = CITIES.map((name, index) => ({ name, count: Math.max(9, 76 - index * 2 + (seed + index * 5) % 7), years: 6 - (seed + index * 3) % 4 }));
  const nationalTotal = national.reduce((sum, value) => sum + value, 0);
  return {
    national,
    nationalTotal,
    nationalContinuity: [...national].reverse().findIndex((value) => value <= 0) < 0 ? national.length : [...national].reverse().findIndex((value) => value <= 0),
    provincialTotal: provinces.reduce((sum, item) => sum + item.count, 0),
    municipalTotal: cities.reduce((sum, item) => sum + item.count, 0),
    provinces,
    cities,
  };
}

function PolicyOverview({ industry }: { industry: string }) {
  const data = useMemo(() => buildOverview(industry), [industry]);
  return <div className="tpm-stack">
    <MetricStrip items={[
      { label: "全国政策总量", value: `${data.nationalTotal} 条`, note: "2020—2025 累计", icon: Landmark },
      { label: "全国连续发布", value: `${data.nationalContinuity} 年`, note: "统计期内连续发布", icon: CalendarDays },
      { label: "省级政策总量", value: `${data.provincialTotal.toLocaleString()} 条`, note: `${data.provinces.length} 个省级地区`, icon: MapPinned },
      { label: "市级政策总量", value: `${data.municipalTotal.toLocaleString()} 条`, note: `${data.cities.length} 个重点城市`, icon: Building2 },
    ]} />
    <Section title="全国政策统计" description={`${industry} · 展示全国政策年度数量及连续发布情况`}>
      <NationalPolicyTrend values={data.national} industry={industry} />
    </Section>
    <Section title="省级政策统计" description="展示31个省级地区政策数量及2020—2025年连续发布年数对比">
      <ComparisonList title="省级政策数量与连续性" items={data.provinces} />
    </Section>
    <Section title="市级政策统计" description="展示30个重点城市政策数量及2020—2025年连续发布年数对比">
      <ComparisonList title="重点城市政策数量与连续性" items={data.cities} />
    </Section>
  </div>;
}

function distributePolicyTotal(total: number, ratios: number[]) {
  const ratioTotal = ratios.reduce((sum, ratio) => sum + ratio, 0) || 1;
  const rawValues = ratios.map((ratio) => total * ratio / ratioTotal);
  const values = rawValues.map(Math.floor);
  const remaining = total - values.reduce((sum, value) => sum + value, 0);
  const allocationOrder = rawValues
    .map((value, index) => ({ index, remainder: value - values[index] }))
    .sort((left, right) => right.remainder - left.remainder || left.index - right.index);
  allocationOrder.slice(0, remaining).forEach(({ index }) => { values[index] += 1; });
  return values;
}

function makeMapData(industry: string, level: PolicyMapLevel): MapDatum[] {
  const seed = industrySeed(industry);
  const overview = buildOverview(industry);
  if (level === "national") {
    const counts = distributePolicyTotal(overview.provincialTotal, [.17, .1, .24, .14, .15, .12, .08]);
    return MAP_NATIONAL.map((item, index) => ({ ...item, count: counts[index], continuity: 6 - (seed + index) % 3 }));
  }
  const base = level === "province" ? MAP_PROVINCES : MAP_CITIES;
  const source = level === "province" ? overview.provinces : overview.cities;
  return base.map((item) => {
    const statistic = source.find((entry) => entry.name === item.name);
    return { ...item, count: statistic?.count ?? 0, continuity: statistic?.years ?? 0 };
  });
}

function PolicyMap({ industry }: { industry: string }) {
  const [level, setLevel] = useState<PolicyMapLevel>("national");
  const [selectedName, setSelectedName] = useState(MAP_NATIONAL[0].name);
  const data = useMemo(() => makeMapData(industry, level), [industry, level]);
  const selected = data.find((item) => item.name === selectedName) ?? data[0];
  const max = Math.max(...data.map((item) => item.count), 1);
  const ranked = [...data].sort((left, right) => right.count - left.count || right.continuity - left.continuity);
  const selectedRank = ranked.findIndex((item) => item.name === selected.name) + 1;
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const share = total ? (selected.count / total * 100).toFixed(1) : "0.0";
  const changeLevel = (next: PolicyMapLevel) => {
    setLevel(next);
    setSelectedName((next === "national" ? MAP_NATIONAL : next === "province" ? MAP_PROVINCES : MAP_CITIES)[0].name);
  };
  const levelLabel = level === "national" ? "全国区域" : level === "province" ? "省级地区" : "重点城市";
  return <Section
    title={`${industry}${levelLabel}政策发布密度`}
    description="通过地图展示全国区域、省级地区和重点城市的产业政策发布密度"
    action={<MapLevelControl value={level} onChange={changeLevel} />}
    className="tpm-map-panel"
  >
    <div className="tpm-map-layout">
      <div className="tpm-map-canvas">
        <svg viewBox="0 0 660 360" aria-hidden="true" focusable="false">
          <path className="tpm-china-shadow" d="M82 116 126 73l72 1 44-31 63 16 45-23 71 31 71 10 46 42 17 54 47 33-24 41-57 9-21 38-64-8-42 35-74-9-46 20-55-28-58-3-32-39-48-17-5-52-42-25 34-37-17-45Z" />
          <path className="tpm-china-shape" d="M73 106 117 63l72 1 44-31 63 16 45-23 71 31 71 10 46 42 17 54 47 33-24 41-57 9-21 38-64-8-42 35-74-9-46 20-55-28-58-3-32-39-48-17-5-52-42-25 34-37-17-45Z" />
          <path className="tpm-map-river" d="M147 126c92 7 130 68 213 66 62-1 93-47 155-38" />
          <path className="tpm-map-river" d="M230 205c50 1 77 42 129 40 56-2 80-31 127-30" />
        </svg>
        <div className="tpm-map-markers" role="group" aria-label={`${levelLabel}政策密度点位，共 ${data.length} 个`}>
          {data.map((item) => <button
            type="button"
            className={selected.name === item.name ? "active" : ""}
            style={{ left: `${item.x}%`, top: `${item.y}%`, "--tpm-marker-size": `${28 + item.count / max * 12}px`, "--tpm-label-x": `${item.labelDx ?? 0}px`, "--tpm-label-y": `${item.labelDy ?? 0}px` } as CSSProperties}
            aria-pressed={selected.name === item.name}
            aria-label={`${item.name}，政策 ${item.count} 条，连续发布 ${item.continuity} 年`}
            onClick={() => setSelectedName(item.name)}
            key={item.name}
          ><span>{item.count}</span><small>{item.name.replace(/[省市]$/, "")}</small></button>)}
        </div>
        <div className="tpm-map-legend"><span><i className="is-small" /><i className="is-large" />政策数量越高，点位越大</span><small>单位：条</small></div>
      </div>
      <aside className="tpm-map-detail">
        <span>{levelLabel}</span>
        <h4>{selected.name}</h4>
        <dl aria-live="polite"><div><dt>政策数量</dt><dd>{selected.count}<small>条</small></dd></div><div><dt>连续发布</dt><dd>{selected.continuity}<small>年</small></dd></div><div><dt>密度排名</dt><dd>{selectedRank}<small>位</small></dd></div><div><dt>区域占比</dt><dd>{share}<small>%</small></dd></div></dl>
        <p>点位大小表示政策发布数量；选择地图点位或右侧列表可查看对应地区的政策密度与连续性。</p>
        <ol>{ranked.map((item, index) => <li className={selected.name === item.name ? "active" : ""} key={item.name}><button type="button" aria-pressed={selected.name === item.name} onClick={() => setSelectedName(item.name)}><b>{index + 1}</b><span>{item.name}</span><strong>{item.count} 条</strong></button></li>)}</ol>
      </aside>
    </div>
  </Section>;
}

function buildChain(industry: string): Record<ChainStage, ChainNode[]> {
  const seed = industrySeed(industry);
  const stages = CHAIN_NODES[industry] ?? FALLBACK_CHAIN;
  const create = (names: string[], stageIndex: number) => names.map((name, index) => ({
    name,
    count: 19 + stageIndex * 6 + index * 5 + (seed + index * 2) % 8,
    coverage: Math.min(96, 56 + stageIndex * 7 + index * 6 + seed % 9),
    policyDirections: [
      `${name}专项支持`,
      POLICY_DIRECTION_TEMPLATES[["上游基础", "中游核心", "下游应用"][stageIndex] as ChainStage][index % 3],
      POLICY_DIRECTION_TEMPLATES[["上游基础", "中游核心", "下游应用"][stageIndex] as ChainStage][(index + 1) % 3],
    ],
  }));
  return { 上游基础: create(stages[0], 0), 中游核心: create(stages[1], 1), 下游应用: create(stages[2], 2) };
}

function ChainCoverage({ industry, shenzhen = false }: { industry: string; shenzhen?: boolean }) {
  const data = useMemo(() => buildChain(industry), [industry]);
  const ratio = shenzhen ? .54 : 1;
  const [selectedKey, setSelectedKey] = useState("0-0");
  const [selectedStageIndex, selectedNodeIndex] = selectedKey.split("-").map(Number);
  const entries = Object.entries(data) as [ChainStage, ChainNode[]][];
  const selectedStage = entries[selectedStageIndex] ?? entries[0];
  const selectedNode = selectedStage[1][selectedNodeIndex] ?? selectedStage[1][0];
  const selectedCount = Math.max(3, Math.round(selectedNode.count * ratio));
  const selectedCoverage = Math.max(20, Math.round(selectedNode.coverage * (shenzhen ? .78 : 1)));
  return <div className="tpm-chain" aria-label={`${shenzhen ? "深圳" : "全国"}${industry}政策产业链覆盖`}>
    <div className="tpm-chain-legend"><span><i />政策数量</span><span><b />覆盖程度</span><small>同一政策可覆盖多个节点，节点数量不直接相加</small></div>
    {(Object.entries(data) as [ChainStage, ChainNode[]][]).map(([stage, nodes], stageIndex) => <section className={`stage-${stageIndex + 1}`} key={stage}>
      <header><strong>{stage}</strong><span>{stage === "上游基础" ? "要素与支撑" : stage === "中游核心" ? "研发与工程化" : "产品与场景"}</span></header>
      <ol>{nodes.map((node, nodeIndex) => {
        const count = Math.max(3, Math.round(node.count * ratio));
        const coverage = Math.max(20, Math.round(node.coverage * (shenzhen ? .78 : 1)));
        const key = `${stageIndex}-${nodeIndex}`;
        return <li className={selectedKey === key ? "is-selected" : ""} key={node.name}>
          <button type="button" aria-pressed={selectedKey === key} aria-label={`${stage}，${node.name}，${count} 条政策，覆盖程度 ${coverage}%`} onClick={() => setSelectedKey(key)}><div><strong>{node.name}</strong><span>{count} 条政策</span></div><i aria-hidden="true"><b style={{ width: `${coverage}%` }} /></i><small>{coverage}%</small></button>
        </li>;
      })}</ol>
    </section>)}
    <aside className="tpm-chain-selection-detail"><header aria-live="polite"><div><span>{selectedStage[0]}</span><h4>{selectedNode.name}</h4></div><strong>{selectedCoverage}%<small>覆盖程度</small></strong></header><dl><div><dt>相关政策数量</dt><dd>{selectedCount} 条</dd></div><div><dt>覆盖评价口径</dt><dd>政策工具、支持对象、实施环节、资金方式与应用场景</dd></div></dl><section><h5>重点政策方向</h5><ul>{selectedNode.policyDirections.map((direction) => <li key={direction}><ShieldCheck size={14} aria-hidden="true" />{direction}</li>)}</ul></section></aside>
  </div>;
}

function PolicyCoverage({ industry }: { industry: string }) {
  const data = useMemo(() => buildChain(industry), [industry]);
  const nodes = Object.values(data).flat();
  const associationCount = nodes.reduce((sum, node) => sum + node.count, 0);
  const averageCoverage = nodes.length ? Math.round(nodes.reduce((sum, node) => sum + node.coverage, 0) / nodes.length) : 0;
  return <div className="tpm-stack"><MetricStrip items={[
    { label: "产业链阶段", value: `${Object.keys(data).length} 个`, note: "上游、中游、下游", icon: Network },
    { label: "覆盖节点", value: `${nodes.length} 个`, note: `${industry}产业链全景`, icon: MapPinned },
    { label: "政策关联", value: `${associationCount} 条次`, note: "同一政策可关联多节点", icon: Landmark },
    { label: "平均覆盖", value: `${averageCoverage}%`, note: "五类要素综合覆盖", icon: Activity },
  ]} /><Section title={`${industry}政策产业覆盖`} description="结合产业链全景图，展示产业链各节点的相关政策数量与覆盖情况" action={<span className="tpm-panel-action">点击节点查看政策详情</span>}><ChainCoverage industry={industry} /></Section></div>;
}

function makeRanking(industry: string, level: RegionLevel): RankingItem[] {
  const seed = industrySeed(industry);
  const names = level === "province" ? PROVINCES : CITIES;
  const raw = names.map((name, index) => ({
    name,
    policyCount: 31 + ((names.length - index) * 7 + seed * 3 + index * index) % 64,
    continuity: 3 + (seed + index * 3) % 6,
    coveredNodes: 5 + (seed * 2 + index * 5) % 8,
  }));
  const maxCount = Math.max(...raw.map((item) => item.policyCount), 1);
  return raw
    .map((item) => ({ ...item, score: Math.round(item.policyCount / maxCount * 55 + item.continuity / 8 * 25 + item.coveredNodes / 12 * 20) }))
    .sort((a, b) => b.score - a.score || b.policyCount - a.policyCount)
    .map((item) => item);
}

function PolicyRanking({ industry }: { industry: string }) {
  const [level, setLevel] = useState<RegionLevel>("province");
  const [page, setPage] = useState(0);
  const data = useMemo(() => makeRanking(industry, level), [industry, level]);
  const pageSize = 10;
  const pageCount = Math.ceil(data.length / pageSize);
  const visible = data.slice(page * pageSize, (page + 1) * pageSize);
  const changeLevel = (next: RegionLevel) => { setLevel(next); setPage(0); };
  return <Section title={`${industry}政策力度排名`} description="按政策数量、发布连续性与产业链节点覆盖计算演示综合分" action={<SegmentControl value={level} onChange={changeLevel} label="政策力度排名层级" />} className="tpm-ranking-panel">
    <div className="tpm-ranking-note">
      <div><strong>演示计算口径</strong><span>政策数量 55% + 发布连续性 25% + 产业链节点覆盖 20%</span></div>
      <DemoBadge>非正式排名</DemoBadge>
    </div>
    <div className="tpm-table-wrap">
      <table>
        <caption className="tpm-sr-only">{level === "province" ? "省级" : "城市"}政策力度演示排名</caption>
        <thead><tr><th scope="col">排名</th><th scope="col">地区</th><th scope="col">政策数量</th><th scope="col">连续发布</th><th scope="col">覆盖节点</th><th scope="col">综合分</th></tr></thead>
        <tbody>{visible.map((item, index) => <tr key={item.name}>
          <td><b>{String(page * pageSize + index + 1).padStart(2, "0")}</b></td>
          <th scope="row">{item.name}</th>
          <td>{item.policyCount} 条</td>
          <td>{item.continuity} 年</td>
          <td>{item.coveredNodes} 个</td>
          <td><strong>{item.score}</strong><small> / 100</small></td>
        </tr>)}</tbody>
      </table>
    </div>
    <nav className="tpm-pagination" aria-label={`${level === "province" ? "省级" : "城市"}政策力度排名分页`}>
      <button type="button" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}><ChevronLeft size={15} aria-hidden="true" />上一页</button>
      <span aria-live="polite">第 {page + 1} / {pageCount} 页 · {page * pageSize + 1}—{Math.min((page + 1) * pageSize, data.length)} / {data.length}</span>
      <button type="button" disabled={page >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>下一页<ChevronRight size={15} aria-hidden="true" /></button>
    </nav>
  </Section>;
}

function makePolicyNews(industry: string, scope: PolicyNewsScope = "national"): PolicyNewsItem[] {
  const nationalItems: PolicyNewsItem[] = [
    { date: "2026-08-12", region: "全国", issuer: "国家发展和改革委员会", title: `${industry}未来产业项目储备与场景建设政策动态`, summary: "聚焦重大项目储备、场景开放及公共能力建设，持续完善未来产业培育支持体系。", url: "https://www.ndrc.gov.cn/xxgk/zcfb/" },
    { date: "2026-07-18", region: "北京", issuer: "北京市人民政府", title: `${industry}科技成果转化支持政策更新`, summary: "围绕技术转移、成果评价和示范应用，强化科研成果向产业端转化的政策衔接。", url: "https://www.beijing.gov.cn/zhengce/" },
    { date: "2026-06-26", region: "上海", issuer: "上海市人民政府", title: `${industry}产业创新平台建设政策动态`, summary: "支持高水平创新平台、公共技术服务机构和产业协同载体建设。", url: "https://www.shanghai.gov.cn/nw12344/" },
    { date: "2026-05-09", region: "江苏", issuer: "江苏省人民政府", title: `${industry}关键技术与中试验证支持政策更新`, summary: "加强关键技术联合攻关、中试验证平台和产业化项目的政策支持。", url: "https://www.jiangsu.gov.cn/col/col46143/index.html" },
    { date: "2026-03-20", region: "全国", issuer: "科学技术部", title: `${industry}科技计划与创新平台政策动态`, summary: "围绕科技计划、创新平台与科技成果转化发布相关政策信息。", url: "https://www.most.gov.cn/xxgk/xinxifenlei/fdzdgknr/fgzc/" },
  ];
  const shenzhenItems: PolicyNewsItem[] = [
    { date: "2026-08-20", region: "深圳", issuer: "深圳市科技创新局", title: `${industry}关键技术攻关与创新平台支持动态`, summary: "聚焦关键技术攻关、科研平台建设及创新主体培育，发布近期政策服务信息。", url: "https://stic.sz.gov.cn/" },
    { date: "2026-07-05", region: "深圳", issuer: "深圳市发展和改革委员会", title: `${industry}未来产业项目建设政策动态`, summary: "围绕重大项目布局、产业空间和应用场景开放更新相关政策信息。", url: "https://fgw.sz.gov.cn/" },
    { date: "2026-06-12", region: "深圳", issuer: "深圳市工业和信息化局", title: `${industry}产业化与技术改造支持动态`, summary: "面向产业化、技术改造和公共服务平台建设发布申报与实施信息。", url: "https://gxj.sz.gov.cn/" },
    { date: "2026-04-18", region: "深圳", issuer: "深圳市人民政府", title: `${industry}产业集群协同发展政策动态`, summary: "加强产业链协同、创新资源配置和重点项目服务保障。", url: "https://www.sz.gov.cn/cn/xxgk/zfxxgj/zcfg/" },
    { date: "2026-02-28", region: "深圳", issuer: "深圳市科技创新局", title: `${industry}成果转化与人才支持政策动态`, summary: "推动成果转化、技术交易及重点团队人才服务的政策协同。", url: "https://stic.sz.gov.cn/" },
  ];
  return scope === "shenzhen" ? shenzhenItems : nationalItems;
}

function isSafeSourceUrl(url?: string) {
  return Boolean(url && /^https:\/\//i.test(url));
}

function PolicyTimeline({ items }: { items: PolicyNewsItem[] }) {
  const sortedItems = [...items].sort((left, right) => Date.parse(right.date) - Date.parse(left.date));
  if (!sortedItems.length) return <p className="tpm-news-empty">当前范围暂无政策动态。</p>;
  return <ol className="tpm-timeline">
    {sortedItems.map((item, index) => <li key={`${item.date}-${item.title}`}>
      <time dateTime={item.date}>{item.date}</time>
      <span className="tpm-timeline-node" aria-hidden="true">{index + 1}</span>
      <article>
        <header><span>{item.region}</span><small>{item.issuer}</small></header>
        <h4>{item.title}</h4>
        <p>{item.summary}</p>
        {isSafeSourceUrl(item.url)
          ? <a href={item.url} target="_blank" rel="noreferrer noopener" aria-label={`前往${item.issuer}查看《${item.title}》来源信息`}>查看来源网站<ExternalLink size={14} aria-hidden="true" /></a>
          : <span className="tpm-source-disabled" aria-disabled="true">暂无原文链接</span>}
      </article>
    </li>)}
  </ol>;
}

function PolicyNews({ industry }: { industry: string }) {
  const [scope, setScope] = useState<PolicyNewsScope>("national");
  const items = useMemo(() => makePolicyNews(industry, scope), [industry, scope]);
  const sourceCount = new Set(items.map((item) => item.issuer)).size;
  const regionCount = new Set(items.map((item) => item.region)).size;
  return <div className="tpm-stack">
    <MetricStrip items={[
      { label: "最新发布时间", value: items[0]?.date.slice(5) ?? "—", note: items[0]?.date.slice(0, 4) ?? "暂无", icon: CalendarDays },
      { label: "政策动态", value: `${items.length} 条`, note: scope === "national" ? "全国各地" : "深圳", icon: Landmark },
      { label: "覆盖地区", value: `${regionCount} 个`, note: scope === "national" ? "全国及重点地区" : "深圳市", icon: MapPin },
      { label: "来源机构", value: `${sourceCount} 个`, note: "政府政策来源", icon: ExternalLink },
    ]} />
    <Section title={`${industry}最新政策动态`} description={`按时间倒序展示${scope === "national" ? "全国各地" : "深圳"}政策动态，并链接至官方来源网站`} action={<div className="tpm-segments" role="group" aria-label="最新政策动态范围"><button type="button" className={scope === "national" ? "active" : ""} aria-pressed={scope === "national"} onClick={() => setScope("national")}>全国各地</button><button type="button" className={scope === "shenzhen" ? "active" : ""} aria-pressed={scope === "shenzhen"} onClick={() => setScope("shenzhen")}>深圳</button></div>}>
      <PolicyTimeline items={items} />
    </Section>
  </div>;
}

function makeShenzhenDistrictData(industry: string, total: number): ShenzhenDistrictDatum[] {
  const seed = industrySeed(industry);
  const baseRatios = [.2, .16, .14, .13, .1, .09, .07, .05, .035, .025];
  const shiftedRatios = baseRatios.map((ratio, index) => ratio + ((seed + index) % 3 - 1) * .002);
  const ratioTotal = shiftedRatios.reduce((sum, value) => sum + value, 0);
  const counts = distributePolicyTotal(total, shiftedRatios.map((value) => value / ratioTotal));
  return SHENZHEN_DISTRICT_META.map((item, index) => ({ ...item, value: counts[index] }));
}

function PolicyValueBars({ items, selectedName, onSelect, ariaLabel }: { items: { name: string; value: number }[]; selectedName: string; onSelect: (name: string) => void; ariaLabel: string }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return <div className="tpm-district-bars" role="group" aria-label={ariaLabel}>{items.map((item) => <button type="button" className={selectedName === item.name ? "is-active" : ""} aria-pressed={selectedName === item.name} onClick={() => onSelect(item.name)} key={item.name}><span>{item.name}</span><i aria-hidden="true"><b style={{ width: `${item.value / max * 100}%` }} /></i><strong>{item.value} 条</strong></button>)}</div>;
}

function ShenzhenPolicyTypeAnalysis({ items }: { items: { name: string; value: number }[] }) {
  const [selectedName, setSelectedName] = useState(items[0]?.name ?? "");
  const selected = items.find((item) => item.name === selectedName) ?? items[0];
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const share = selected && total ? (selected.value / total * 100).toFixed(1) : "0.0";
  return <div className="tpm-shenzhen-type-analysis"><div className="tpm-shenzhen-selection-summary" aria-live="polite"><span>当前类型</span><strong>{selected.name}</strong><b>{selected.value} 条</b><small>占当年政策数量 {share}%</small></div><PolicyValueBars items={items} selectedName={selected.name} onSelect={setSelectedName} ariaLabel="选择深圳产业政策类型" /></div>;
}

function ShenzhenDistrictDistribution({ industry, total }: { industry: string; total: number }) {
  const data = useMemo(() => makeShenzhenDistrictData(industry, total), [industry, total]);
  const [selectedName, setSelectedName] = useState(data[0]?.name ?? "");
  const selected = data.find((item) => item.name === selectedName) ?? data[0];
  const max = Math.max(...data.map((item) => item.value), 1);
  const share = total ? (selected.value / total * 100).toFixed(1) : "0.0";
  return <div className="tpm-shenzhen-district-layout">
    <figure className="tpm-shenzhen-policy-map" aria-label={`深圳十区${industry}政策发布分布`}>
      <svg viewBox="0 0 100 72" aria-hidden="true"><path d="M8 34 18 20 32 18 43 8 56 14 70 12 90 25 95 38 82 49 68 50 58 61 40 57 27 64 18 52 7 47Z" /><path d="M23 47c16-7 28-4 39-12 8-6 14-13 26-12" /></svg>
      <div className="tpm-shenzhen-policy-markers" role="group" aria-label="深圳各区政策点位">{data.map((item) => <button type="button" className={selected.name === item.name ? "is-active" : ""} aria-pressed={selected.name === item.name} aria-label={`${item.name}，${item.value} 条政策`} onClick={() => setSelectedName(item.name)} style={{ left: `${item.x}%`, top: `${item.y}%`, "--tpm-district-marker-size": `${24 + item.value / max * 12}px` } as CSSProperties} key={item.name}><span>{item.value}</span><small>{item.name.replace(/(?:新区|区)$/, "")}</small></button>)}</div>
      <figcaption>点位大小表示各区政策发布数量</figcaption>
    </figure>
    <section className="tpm-shenzhen-district-detail"><header aria-live="polite"><div><span>当前行政区</span><strong>{selected.name}</strong></div><div><span>政策数量</span><strong>{selected.value} 条</strong></div><small>占深圳当年政策数量 {share}%</small></header><PolicyValueBars items={data} selectedName={selected.name} onSelect={setSelectedName} ariaLabel="选择深圳行政区" /></section>
  </div>;
}

function ShenzhenPolicy({ industry }: { industry: string }) {
  const seed = industrySeed(industry);
  const trend = [18, 23, 29, 36, 44, 53].map((value, index) => value + seed % 5 + index * (seed % 2));
  const currentYearTotal = trend.at(-1)!;
  const policyTotal = trend.reduce((sum, value) => sum + value, 0);
  const typeLabels = ["技术攻关", "平台建设", "成果转化", "产业培育", "人才支持", "应用示范"];
  const typeValues = distributePolicyTotal(currentYearTotal, [.23, .18, .17, .16, .14, .12]);
  const types = typeLabels.map((name, index) => ({ name, value: typeValues[index] }));
  const news = useMemo(() => makePolicyNews(industry, "shenzhen"), [industry]);
  return <div className="tpm-stack tpm-shenzhen-policy">
    <MetricStrip items={[
      { label: "深圳政策总量", value: `${policyTotal} 条`, note: `${industry} · 2020—2025 累计`, icon: Landmark },
      { label: "2025 年政策", value: `${currentYearTotal} 条`, note: `较 2024 年新增 ${currentYearTotal - trend.at(-2)!} 条`, icon: Activity },
      { label: "行政区覆盖", value: "10 区", note: "深圳各行政区", icon: MapPin },
      { label: "产业链覆盖", value: `${(CHAIN_NODES[industry] ?? FALLBACK_CHAIN).flat().length} 节点`, note: "上游、中游、下游", icon: Network },
    ]} />
    <div className="tpm-two-column tpm-shenzhen-overview">
      <Section title="深圳政策数量对比" description={`${industry} · 2020—2025 年政策数量及变化趋势`}>
        <NationalPolicyTrend values={trend} industry={industry} scopeLabel="深圳政策" />
      </Section>
      <Section title="政策支持方向统计" description="按政策支持方向统计深圳产业政策数量">
        <ShenzhenPolicyTypeAnalysis items={types} />
      </Section>
    </div>
    <Section title="深圳政策区域分布" description="通过地图和数量图表展示深圳各区政策发布情况" action={<span className="tpm-panel-action">地图与图表联动</span>}>
      <ShenzhenDistrictDistribution industry={industry} total={currentYearTotal} />
    </Section>
    <Section title="深圳政策产业覆盖" description="结合深圳产业链全景图，展示产业链各节点的政策覆盖情况" action={<span className="tpm-panel-action">点击节点查看政策详情</span>}>
      <ChainCoverage industry={industry} shenzhen />
    </Section>
    <Section title="深圳最新政策" description="按时间倒序展示深圳最新政策文件，并链接至官方来源网站">
      <PolicyTimeline items={news} />
    </Section>
  </div>;
}

export function PolicyModule({ subId, industry }: PolicyModuleProps) {
  return <div className="tpm-root">
    {subId === "policy-overview" && <PolicyOverview industry={industry} />}
    {subId === "policy-map" && <PolicyMap industry={industry} />}
    {subId === "policy-coverage" && <PolicyCoverage industry={industry} />}
    {subId === "policy-ranking" && <PolicyRanking industry={industry} />}
    {subId === "policy-news" && <PolicyNews industry={industry} />}
    {subId === "shenzhen-policy" && <ShenzhenPolicy industry={industry} />}
  </div>;
}
