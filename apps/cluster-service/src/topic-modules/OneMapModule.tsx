import {
  Activity,
  Atom,
  BookOpen,
  Building2,
  CircleAlert,
  GraduationCap,
  MapPin,
  Microscope,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";
import { lazy, Suspense, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { TopicOutlineInput, TopicOutlineSelect } from "../TopicControls";
import { SHENZHEN_DISTRICTS, type ShenzhenDistrictName, type ShenzhenMapMarker } from "./shenzhenMapData";
import "./one-map-module.css";

const ShenzhenGeoMap = lazy(() => import("./ShenzhenGeoMap"));

type OneMapModuleProps = {
  subId: string;
  industry: string;
  industries?: readonly string[];
  onIndustryChange?: (industry: string) => void;
};

type DistrictName = ShenzhenDistrictName;

type IndicatorId = "industry" | "technology" | "enterprise" | "talent" | "research";
type LayerId = IndicatorId | "policy";
type EntityType = "重点企业" | "科研机构";

type DistrictMetrics = {
  industry: number;
  technology: number;
  enterprise: number;
  talent: number;
  research: number;
  policy: number;
};

type MapEntity = {
  id: string;
  type: EntityType;
  name: string;
  district: DistrictName;
  address: string;
  founded: string;
  focus: string;
  coordinate: [number, number];
};

type TrendSeries = {
  label: string;
  values: number[];
  color?: string;
  unit?: string;
};

const YEARS = [2021, 2022, 2023, 2024, 2025];

const DEFAULT_INDUSTRIES = [
  "合成生物",
  "区块链",
  "细胞与基因",
  "空天技术",
  "脑科学与类脑智能",
  "深地深海",
  "可见光通信与光计算",
  "量子信息",
] as const;

const INDICATORS: { id: IndicatorId; label: string; icon: LucideIcon }[] = [
  { id: "industry", label: "产业指标", icon: Activity },
  { id: "technology", label: "技术指标", icon: Atom },
  { id: "enterprise", label: "企业指标", icon: Building2 },
  { id: "talent", label: "人才指标", icon: Users },
  { id: "research", label: "科研指标", icon: Microscope },
];

const LAYERS: { id: LayerId; label: string; metric: string; unit: string }[] = [
  { id: "industry", label: "产业发展专题图", metric: "产业发展指数", unit: "" },
  { id: "technology", label: "技术分布专题图", metric: "技术活跃指数", unit: "" },
  { id: "enterprise", label: "企业分布专题图", metric: "企业数量", unit: "家" },
  { id: "research", label: "科研机构专题图", metric: "科研机构数量", unit: "家" },
  { id: "talent", label: "人才分布专题图", metric: "人才数量", unit: "人" },
  { id: "policy", label: "政策支持专题图", metric: "政策数量", unit: "条" },
];

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableNumber(seed: number, salt: string, min: number, max: number) {
  let value = hashString(`${seed}:${salt}`);
  value ^= value >>> 16;
  value = Math.imul(value, 2246822507);
  value ^= value >>> 13;
  const ratio = (value >>> 0) / 4294967295;
  return Math.round(min + (max - min) * ratio);
}

function createTrend(seed: number, salt: string, start: number, end: number) {
  return YEARS.map((_, index) => {
    if (index === 0) return start;
    if (index === YEARS.length - 1) return end;
    const progress = index / (YEARS.length - 1);
    const baseline = start + (end - start) * progress;
    const variation = stableNumber(seed, `${salt}-${index}`, -3, 3) / 100;
    return Math.max(start, Math.round(baseline * (1 + variation)));
  });
}

function buildDistrictMetrics(industry: string) {
  const seed = hashString(industry);
  return SHENZHEN_DISTRICTS.reduce<Record<DistrictName, DistrictMetrics>>((record, district, index) => {
    const districtWeight = [1.1, .86, .74, 1.03, .95, .9, .93, .76, .61][index];
    record[district] = {
      industry: Math.round(stableNumber(seed, `${district}-industry`, 52, 92) * districtWeight),
      technology: Math.round(stableNumber(seed, `${district}-technology`, 49, 96) * districtWeight),
      enterprise: Math.max(8, Math.round(stableNumber(seed, `${district}-enterprise`, 26, 116) * districtWeight)),
      talent: Math.max(90, Math.round(stableNumber(seed, `${district}-talent`, 180, 920) * districtWeight)),
      research: Math.max(3, Math.round(stableNumber(seed, `${district}-research`, 8, 42) * districtWeight)),
      policy: Math.max(4, Math.round(stableNumber(seed, `${district}-policy`, 9, 38) * districtWeight)),
    };
    return record;
  }, {} as Record<DistrictName, DistrictMetrics>);
}

function buildEntities(industry: string): MapEntity[] {
  const shortName = industry.length > 6 ? industry.slice(0, 6) : industry;
  return [
    { id: "enterprise-1", type: "重点企业", name: `${shortName}工程技术有限公司`, district: "南山区", address: "南山区科技园片区", founded: "2018 年", focus: "产品研发、工程验证与场景交付", coordinate: [113.946, 22.54] },
    { id: "enterprise-2", type: "重点企业", name: `${shortName}产业创新有限公司`, district: "宝安区", address: "宝安区新兴产业片区", founded: "2020 年", focus: "中试放大、生产服务与产业协同", coordinate: [113.884, 22.578] },
    { id: "enterprise-3", type: "重点企业", name: `鹏城${shortName}科技有限公司`, district: "龙岗区", address: "龙岗区大运片区", founded: "2017 年", focus: "核心部件、系统集成与应用服务", coordinate: [114.223, 22.692] },
    { id: "enterprise-4", type: "重点企业", name: `深湾${shortName}应用有限公司`, district: "坪山区", address: "坪山区产业园片区", founded: "2021 年", focus: "产业化验证与规模制造", coordinate: [114.351, 22.691] },
    { id: "research-1", type: "科研机构", name: `${shortName}交叉科学研究中心`, district: "光明区", address: "光明科学城片区", founded: "2019 年", focus: "基础研究、技术评价与成果转化", coordinate: [113.938, 22.749] },
    { id: "research-2", type: "科研机构", name: `湾区${shortName}技术研究院`, district: "福田区", address: "福田中心区", founded: "2016 年", focus: "产业战略、共性技术与开放服务", coordinate: [114.055, 22.541] },
    { id: "research-3", type: "科研机构", name: `深圳${shortName}联合实验室`, district: "龙华区", address: "龙华数字产业片区", founded: "2022 年", focus: "关键技术攻关与工程化验证", coordinate: [114.042, 22.659] },
    { id: "research-4", type: "科研机构", name: `${shortName}前沿技术中心`, district: "盐田区", address: "盐田区创新园片区", founded: "2020 年", focus: "前沿研究、人才培养与产业咨询", coordinate: [114.237, 22.558] },
  ];
}

function DemoNotice({ children = "以下为稳定演示数据，不作为正式决策依据" }: { children?: string }) {
  return <span className="om-demo-notice"><CircleAlert size={14} aria-hidden="true" />{children}</span>;
}

function ModuleIntro({ title, description, action, showNotice = true }: { title: string; description: string; action?: ReactNode; showNotice?: boolean }) {
  return <header className="om-intro">
    <div><h3>{title}</h3><p>{description}</p></div>
    {action ?? (showNotice ? <DemoNotice /> : null)}
  </header>;
}

function IndustrySelect({ industry, industries, onChange }: { industry: string; industries: readonly string[]; onChange?: (industry: string) => void }) {
  return <label className="om-industry-select">
    <span className="om-visually-hidden">选择专题产业</span>
    <TopicOutlineSelect ariaLabel="选择专题产业" value={industry} options={industries} onChange={onChange} disabled={!onChange} />
  </label>;
}

function MetricCard({ label, value, unit, note, icon: Icon }: { label: string; value: string; unit?: string; note: string; icon: LucideIcon }) {
  const figmaIcon = label === "产业规模"
    ? "./assets/figma-topic-one-map/metric-industry.png"
    : label === "企业机构数量"
      ? "./assets/figma-topic-one-map/metric-enterprise.png"
      : null;
  return <article className="om-metric-card">
    <span className={`om-metric-icon${figmaIcon ? " has-figma-asset" : ""}`}>{figmaIcon ? <img src={figmaIcon} alt="" /> : <Icon size={18} aria-hidden="true" />}</span>
    <div><span>{label}{unit && <small>（{unit}）</small>}</span><strong>{value}</strong><p>{note}</p></div>
  </article>;
}

function TrendChart({ title, unit, series }: { title: string; unit: string; series: TrendSeries[] }) {
  const [activeSeries, setActiveSeries] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lockedIndex, setLockedIndex] = useState<number | null>(null);
  const [width, setWidth] = useState(1078);
  const chartRef = useRef<SVGSVGElement | null>(null);
  const gradientId = useId().replace(/:/g, "");
  const height = 168;
  const currentSeries = series[Math.min(activeSeries, series.length - 1)];
  const currentUnit = currentSeries.unit ?? unit;
  const chartMax = Math.max(120, Math.ceil(Math.max(...currentSeries.values, 1) / 30) * 30);
  const xStart = 64;
  const xEnd = width - 40;
  const yTop = 9;
  const yBottom = 139;
  const points = currentSeries.values.map((value, index) => ({
    x: xStart + index * ((xEnd - xStart) / Math.max(YEARS.length - 1, 1)),
    y: yTop + (1 - value / chartMax) * (yBottom - yTop),
  }));
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const areaPath = `${path} L${points[points.length - 1].x},${yBottom} L${points[0].x},${yBottom} Z`;
  const yTicks = [chartMax, chartMax * .75, chartMax * .5, chartMax * .25, 0];
  const activePointIndex = lockedIndex ?? hoveredIndex;
  const activePoint = activePointIndex === null ? null : points[activePointIndex];
  const activeYear = activePointIndex === null ? null : YEARS[activePointIndex];
  const activeValue = activePointIndex === null ? null : currentSeries.values[activePointIndex];
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const updateWidth = () => {
      const nextWidth = Math.max(320, Math.round(chart.getBoundingClientRect().width));
      setWidth((current) => Math.abs(current - nextWidth) > 1 ? nextWidth : current);
    };
    updateWidth();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }
    const observer = new ResizeObserver(updateWidth);
    observer.observe(chart);
    return () => observer.disconnect();
  }, []);
  const setNearestPoint = (clientX: number, target: SVGSVGElement) => {
    if (lockedIndex !== null) return;
    const rect = target.getBoundingClientRect();
    const svgX = (clientX - rect.left) / Math.max(rect.width, 1) * width;
    const nearestIndex = points.reduce((nearest, point, index) => Math.abs(point.x - svgX) < Math.abs(points[nearest].x - svgX) ? index : nearest, 0);
    setHoveredIndex(nearestIndex);
  };
  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => setNearestPoint(event.clientX, event.currentTarget);
  const handleKeyDown = (event: ReactKeyboardEvent<SVGSVGElement>) => {
    const currentIndex = activePointIndex ?? 0;
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = Math.min(YEARS.length - 1, currentIndex + 1);
    else if (event.key === "ArrowLeft") nextIndex = Math.max(0, currentIndex - 1);
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = YEARS.length - 1;
    else if (event.key === "Escape") {
      setLockedIndex(null);
      setHoveredIndex(null);
      return;
    } else return;
    event.preventDefault();
    setLockedIndex(nextIndex);
    setHoveredIndex(nextIndex);
  };
  const selectSeries = (index: number) => {
    setActiveSeries(index);
    setHoveredIndex(null);
    setLockedIndex(null);
  };
  const tooltipWidth = 176;
  const tooltipHeight = 48;
  const tooltipX = activePoint ? Math.min(Math.max(activePoint.x - tooltipWidth / 2, 48), width - tooltipWidth - 12) : 0;
  const tooltipY = activePoint ? Math.max(3, activePoint.y - tooltipHeight - 10) : 0;
  return <figure className="om-chart om-trend-chart">
    <div className="om-chart-heading"><div><h4>{title}</h4></div><div className="om-chart-legend" role="group" aria-label={`${title}指标切换`}>{series.map((item, index) => <button className={activeSeries === index ? "active" : ""} type="button" aria-pressed={activeSeries === index} onClick={() => selectSeries(index)} key={item.label}>{item.label}</button>)}</div></div>
    <svg ref={chartRef} viewBox={`0 0 ${width} ${height}`} role="group" tabIndex={0} aria-label={`${title}：${currentSeries.label}${currentSeries.values.map((value, index) => `${YEARS[index]}年${value}${currentUnit}`).join("，")}。使用左右方向键切换年份，按 Escape 取消锁定。`} onFocus={() => { if (activePointIndex === null) setHoveredIndex(0); }} onBlur={() => { if (lockedIndex === null) setHoveredIndex(null); }} onPointerMove={handlePointerMove} onPointerLeave={() => { if (lockedIndex === null) setHoveredIndex(null); }} onKeyDown={handleKeyDown}>
      <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#165dff" stopOpacity=".14" /><stop offset="1" stopColor="#165dff" stopOpacity="0" /></linearGradient></defs>
      {yTicks.map((tick, index) => {
        const y = yTop + index * ((yBottom - yTop) / 4);
        return <g key={tick}><text x="32" y={y + 4} textAnchor="end">{Math.round(tick)}</text><line x1="48" x2={width} y1={y} y2={y} /></g>;
      })}
      <rect className="om-trend-hit-area" x="48" y="0" width={Math.max(0, width - 48)} height={height} />
      <path className="om-trend-area" d={areaPath} style={{ fill: `url(#${gradientId})` }} />
      <path className="om-trend-line" d={path} />
      {activePoint && <line className="om-trend-guide" x1={activePoint.x} x2={activePoint.x} y1={yTop} y2={yBottom} />}
      {points.map((point, index) => <circle className={`om-trend-point${activePointIndex === index ? " active" : ""}${lockedIndex === index ? " locked" : ""}`} key={`${currentSeries.label}-${YEARS[index]}`} cx={point.x} cy={point.y} r="4" onClick={() => { setLockedIndex((current) => current === index ? null : index); setHoveredIndex(index); }} />)}
      {YEARS.map((year, index) => <text key={year} x={points[index].x} y="164" textAnchor="middle">{year}</text>)}
      {activePoint && activeYear !== null && activeValue !== null && <g className="om-trend-tooltip" transform={`translate(${tooltipX} ${tooltipY})`}>
        <rect width={tooltipWidth} height={tooltipHeight} rx="5" />
        <text x="12" y="19"><tspan className="om-trend-tooltip-year">{activeYear} 年</tspan><tspan x="12" dy="19">{currentSeries.label}：{activeValue.toLocaleString()}{currentUnit}</tspan></text>
      </g>}
    </svg>
    <span className="om-visually-hidden" aria-live="polite">{activeYear !== null && activeValue !== null ? `${activeYear}年，${currentSeries.label}${activeValue}${currentUnit}${lockedIndex !== null ? "，已锁定" : ""}` : ""}</span>
  </figure>;
}

function BarChart({ title, unit, items }: { title: string; unit: string; items: { label: string; value: number }[] }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return <section className="om-chart om-bar-chart" aria-label={`${title}，演示数据`}>
    <div className="om-chart-heading"><div><h4>{title}</h4><span>按当前产业口径统计</span></div></div>
    <div className="om-bars">{items.map((item) => <div key={item.label}>
      <header><span>{item.label}</span><strong>{item.value.toLocaleString()}<small>{unit}</small></strong></header>
      <div><i style={{ width: `${Math.max(7, item.value / max * 100)}%` }} /></div>
    </div>)}</div>
  </section>;
}

function RankingList({ title, items, unit }: { title: string; items: { label: string; value: number }[]; unit: string }) {
  return <section className="om-chart om-ranking" aria-label={`${title}，演示数据`}>
    <div className="om-chart-heading"><div><h4>{title}</h4><span>仅展示统计结果，不构成正式排名</span></div></div>
    <ol>{items.map((item, index) => <li key={item.label}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.label}</strong></div><b><small>{unit}</small><span>{item.value.toLocaleString()}</span></b></li>)}</ol>
  </section>;
}

function StatisticsContent({ industry, indicator }: { industry: string; indicator: IndicatorId }) {
  const seed = hashString(industry);
  const industryScale = stableNumber(seed, "industry-scale", 72, 126);
  const enterpriseCount = stableNumber(seed, "enterprise-count", 138, 268);
  const paperCount = stableNumber(seed, "paper-count", 3200, 6800);
  const patentCount = stableNumber(seed, "patent-count", 1760, 4200);
  const talentCount = stableNumber(seed, "talent-count", 1900, 4600);
  const researchCount = stableNumber(seed, "research-count", 46, 98);
  const employeeBandWeights = [
    { label: "50 人以下", weight: stableNumber(seed, "employee-band-under-50", 34, 46) },
    { label: "50–199 人", weight: stableNumber(seed, "employee-band-50-199", 24, 34) },
    { label: "200–499 人", weight: stableNumber(seed, "employee-band-200-499", 14, 24) },
    { label: "500 人以上", weight: stableNumber(seed, "employee-band-500-plus", 7, 15) },
  ];
  const employeeBandWeightTotal = employeeBandWeights.reduce((sum, item) => sum + item.weight, 0);
  let assignedEnterpriseCount = 0;
  const enterpriseHeadcountDistribution = employeeBandWeights.map((item, index) => {
    const value = index === employeeBandWeights.length - 1
      ? enterpriseCount - assignedEnterpriseCount
      : Math.round(enterpriseCount * item.weight / employeeBandWeightTotal);
    assignedEnterpriseCount += value;
    return { label: item.label, value };
  });

  if (indicator === "industry") return <>
    <div className="om-metric-grid om-metric-grid-2">
      <MetricCard icon={Activity} label="产业规模" value={industryScale.toFixed(1)} unit="亿元" note="2025 年深圳演示统计" />
      <MetricCard icon={Building2} label="企业机构数量" value={enterpriseCount.toLocaleString()} unit="家" note="2025 年深圳演示统计" />
    </div>
    <div className="om-visual-grid">
      <TrendChart title="产业指标趋势" unit="亿元" series={[
        { label: "产业规模", values: industry === "合成生物" ? [40, 47, 70, 98, 112] : createTrend(seed, "industry-scale-trend", Math.round(industryScale * .54), industryScale) },
        { label: "企业机构数量", unit: "家", values: createTrend(seed, "industry-enterprise-trend", Math.round(enterpriseCount * .58), enterpriseCount) },
      ]} />
    </div>
  </>;

  if (indicator === "technology") {
    const institutes = ["深圳未来技术研究院", "鹏城工程联合中心", "湾区科技成果转化中心", "前沿产业技术研究院"].map((label, index) => ({ label: `${label}（演示）`, value: stableNumber(seed, `conversion-${index}`, 18, 68) }));
    return <>
      <div className="om-metric-grid om-metric-grid-3">
        <MetricCard icon={BookOpen} label="论文数量" value={paperCount.toLocaleString()} unit="篇" note="累计演示样本" />
        <MetricCard icon={Atom} label="专利数量" value={patentCount.toLocaleString()} unit="件" note="累计演示样本" />
        <MetricCard icon={Activity} label="技术转化额" value={institutes.reduce((sum, item) => sum + item.value, 0).toLocaleString()} unit="百万元" note="重点机构专利技术转化额" />
      </div>
      <div className="om-visual-grid">
        <TrendChart title="论文与专利数量趋势" unit="项" series={[{ label: "论文", unit: "篇", values: createTrend(seed, "papers", Math.round(paperCount * .48), paperCount) }, { label: "专利", unit: "件", values: createTrend(seed, "patents", Math.round(patentCount * .45), patentCount) }]} />
        <BarChart title="重点机构专利技术转化额" unit="百万元" items={institutes} />
      </div>
    </>;
  }

  if (indicator === "enterprise") return <>
    <div className="om-metric-grid om-metric-grid-3">
      <MetricCard icon={Building2} label="企业数量" value={enterpriseCount.toLocaleString()} unit="家" note="2025 年深圳演示统计" />
      <MetricCard icon={Activity} label="中大型企业占比" value={`${stableNumber(seed, "large-company-share", 28, 46)}`} unit="%" note="演示规模分类" />
      <MetricCard icon={Users} label="企业从业人数" value={stableNumber(seed, "enterprise-workers", 9400, 17800).toLocaleString()} unit="人" note="演示人数分布口径" />
    </div>
    <div className="om-visual-grid">
      <TrendChart title="企业数量及趋势" unit="家" series={[{ label: "企业数量", values: createTrend(seed, "enterprise-trend", Math.round(enterpriseCount * .55), enterpriseCount) }]} />
      <div className="om-stack-charts">
        <BarChart title="企业规模分布" unit="家" items={[{ label: "大型企业", value: stableNumber(seed, "company-large", 18, 36) }, { label: "中型企业", value: stableNumber(seed, "company-medium", 42, 74) }, { label: "小型企业", value: stableNumber(seed, "company-small", 58, 102) }, { label: "微型企业", value: stableNumber(seed, "company-micro", 24, 52) }]} />
        <BarChart title="企业人数分布" unit="家" items={enterpriseHeadcountDistribution} />
      </div>
    </div>
  </>;

  if (indicator === "talent") {
    const keyTalent = stableNumber(seed, "key-talent", 126, 286);
    return <>
      <div className="om-metric-grid om-metric-grid-3">
        <MetricCard icon={Users} label="人才数量" value={talentCount.toLocaleString()} unit="人" note="当前产业演示统计" />
        <MetricCard icon={GraduationCap} label="硕博人才占比" value={stableNumber(seed, "graduate-share", 54, 78).toString()} unit="%" note="演示学历结构" />
        <MetricCard icon={Activity} label="重点人才" value={keyTalent.toLocaleString()} unit="人" note="演示评价样本" />
      </div>
      <div className="om-visual-grid">
        <TrendChart title="人才与重点人才数量趋势" unit="人" series={[{ label: "人才数量", values: createTrend(seed, "talent-trend", Math.round(talentCount * .56), talentCount) }, { label: "重点人才", values: createTrend(seed, "key-talent-trend", Math.round(keyTalent * .51), keyTalent) }]} />
        <BarChart title="人才学历分布" unit="人" items={[{ label: "博士研究生", value: stableNumber(seed, "education-doctor", 640, 1180) }, { label: "硕士研究生", value: stableNumber(seed, "education-master", 1080, 1860) }, { label: "本科", value: stableNumber(seed, "education-bachelor", 520, 960) }, { label: "其他", value: stableNumber(seed, "education-other", 120, 360) }]} />
      </div>
    </>;
  }

  const researchDomains = ["基础研究", "核心技术", "工程验证", "产业应用"].map((label, index) => ({ label, value: stableNumber(seed, `research-domain-${index}`, 9, 34) }));
  const institutions = ["鹏城交叉科学中心", "深圳前沿技术研究院", "湾区产业联合实验室", "未来工程技术中心"].map((label, index) => ({ label: `${label}（演示）`, value: stableNumber(seed, `research-institution-${index}`, 42, 92) }));
  return <>
    <div className="om-metric-grid om-metric-grid-2">
      <MetricCard icon={Microscope} label="科研机构数量" value={researchCount.toLocaleString()} unit="家" note="2025 年深圳演示统计" />
      <MetricCard icon={Activity} label="重点科研机构" value={institutions.length.toString()} unit="家" note="页面演示样本数量" />
    </div>
    <div className="om-visual-grid">
      <TrendChart title="科研机构数量及趋势" unit="家" series={[{ label: "科研机构", values: createTrend(seed, "research-trend", Math.round(researchCount * .62), researchCount) }]} />
      <div className="om-stack-charts om-research-stack">
        <BarChart title="科研机构领域统计" unit="家" items={researchDomains} />
        <RankingList title="重点科研机构" unit="综合指数" items={institutions} />
      </div>
    </div>
  </>;
}

function StatisticsView({ industry, industries, onIndustryChange }: { industry: string; industries: readonly string[]; onIndustryChange?: (industry: string) => void }) {
  const [indicator, setIndicator] = useState<IndicatorId>("industry");
  return <div className="om-module om-statistics-view">
    <ModuleIntro title="专题产业相关统计" description={`以图表呈现深圳${industry}产业、技术、企业、人才与科研五类指标。`} action={<IndustrySelect industry={industry} industries={industries} onChange={onIndustryChange} />} />
    <div className="om-indicator-tabs" role="tablist" aria-label="五类专题统计指标">
      {INDICATORS.map((item) => {
        const Icon = item.icon;
        return <button id={`om-tab-${item.id}`} role="tab" type="button" aria-selected={indicator === item.id} aria-controls="om-statistics-panel" className={indicator === item.id ? "active" : ""} onClick={() => setIndicator(item.id)} key={item.id}><Icon size={16} aria-hidden="true" /><span>{item.label}</span></button>;
      })}
    </div>
    <section id="om-statistics-panel" role="tabpanel" aria-labelledby={`om-tab-${indicator}`} className="om-statistics-panel">
      <StatisticsContent industry={industry} indicator={indicator} />
    </section>
  </div>;
}

function getLayerDetails(layer: LayerId) {
  return LAYERS.find((item) => item.id === layer) ?? LAYERS[0];
}

function EntityDetails({ entity, industry }: { entity: MapEntity | null; industry: string }) {
  if (!entity) return <div className="om-entity-empty"><MapPin size={22} aria-hidden="true" /><strong>选择地图要素查看基本信息</strong><p>企业和科研机构图层中的定位点均可点击。</p></div>;
  return <article className="om-entity-card" aria-live="polite">
    <header><span>{entity.type}</span><strong>{entity.name}</strong></header>
    <dl>
      <div><dt>所在行政区</dt><dd>{entity.district}</dd></div>
      <div><dt>地址</dt><dd>{entity.address}</dd></div>
      <div><dt>成立时间</dt><dd>{entity.founded}</dd></div>
      <div><dt>所属产业</dt><dd>{industry}</dd></div>
      <div><dt>业务 / 研究方向</dt><dd>{entity.focus}</dd></div>
    </dl>
    <DemoNotice>对象名称、地址与信息为示意数据</DemoNotice>
  </article>;
}

function MapFigure({
  layer,
  metrics,
  entities = [],
  selectedDistrict,
  selectedEntity,
  onDistrictChange,
  onEntityChange,
  showAllEntities = false,
  showValues = true,
}: {
  layer: LayerId;
  metrics: Record<DistrictName, DistrictMetrics>;
  entities?: MapEntity[];
  selectedDistrict: DistrictName;
  selectedEntity: MapEntity | null;
  onDistrictChange: (district: DistrictName) => void;
  onEntityChange?: (entity: MapEntity) => void;
  showAllEntities?: boolean;
  showValues?: boolean;
}) {
  const detail = getLayerDetails(layer);
  const values = SHENZHEN_DISTRICTS.reduce<Record<DistrictName, number>>((record, district) => {
    record[district] = metrics[district][layer];
    return record;
  }, {} as Record<DistrictName, number>);
  const visibleEntities = showAllEntities
    ? entities
    : entities.filter((entity) => layer === "enterprise" ? entity.type === "重点企业" : layer === "research" ? entity.type === "科研机构" : false);
  const markers: ShenzhenMapMarker[] = visibleEntities.map((entity) => ({
    id: entity.id,
    name: entity.name,
    type: entity.type,
    district: entity.district,
    coordinate: entity.coordinate,
  }));
  return <Suspense fallback={<div className="om-map-loading" role="status">正在加载深圳行政区地图…</div>}>
    <ShenzhenGeoMap
      ariaLabel={`深圳九个行政区${detail.label}地图`}
      values={values}
      selectedDistrict={selectedDistrict}
      onDistrictChange={onDistrictChange}
      metricLabel={detail.metric}
      unit={detail.unit}
      showValues={showValues}
      markers={markers}
      selectedMarkerId={selectedEntity?.id}
      onMarkerSelect={(marker) => {
        const entity = entities.find((item) => item.id === marker.id);
        if (entity) onEntityChange?.(entity);
      }}
    />
  </Suspense>;
}

function DistrictSummary({ district, industry, metrics, layer }: { district: DistrictName; industry: string; metrics: DistrictMetrics; layer: LayerId }) {
  const detail = getLayerDetails(layer);
  return <aside className="om-district-summary" aria-live="polite">
    <header><span>当前行政区</span><h4>{district}</h4><p>{industry} · {detail.label}</p></header>
    <div className="om-primary-reading"><span>{industry}·{detail.metric}</span><strong>{metrics[layer].toLocaleString()}<small>{detail.unit}</small></strong></div>
    <dl>
      <div><dt>企业</dt><dd>{metrics.enterprise}<small>家</small></dd></div>
      <div><dt>科研机构</dt><dd>{metrics.research}<small>家</small></dd></div>
      <div><dt>人才</dt><dd>{metrics.talent.toLocaleString()}<small>人</small></dd></div>
      <div><dt>政策</dt><dd>{metrics.policy}<small>条</small></dd></div>
    </dl>
    <DemoNotice>行政区指标为演示</DemoNotice>
  </aside>;
}

function LayerTabs({ value, onChange }: { value: LayerId; onChange: (value: LayerId) => void }) {
  return <div className="om-layer-tabs" role="group" aria-label="专题产业相关指标图层">
    {LAYERS.map((layer) => <button type="button" aria-pressed={value === layer.id} className={value === layer.id ? "active" : ""} onClick={() => onChange(layer.id)} key={layer.id}>{layer.label}</button>)}
  </div>;
}

function MapIndicatorsView({ industry, industries, onIndustryChange }: { industry: string; industries: readonly string[]; onIndustryChange?: (industry: string) => void }) {
  const [layer, setLayer] = useState<LayerId>("industry");
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictName>("南山区");
  const [selectedEntity, setSelectedEntity] = useState<MapEntity | null>(null);
  const metrics = useMemo(() => buildDistrictMetrics(industry), [industry]);
  const entities = useMemo(() => buildEntities(industry), [industry]);
  const changeLayer = (nextLayer: LayerId) => {
    setLayer(nextLayer);
    setSelectedEntity(null);
  };
  const selectEntity = (entity: MapEntity) => {
    setSelectedEntity(entity);
    setSelectedDistrict(entity.district);
  };
  return <div className="om-module om-map-view">
    <ModuleIntro title="专题产业相关指标" description={`以空间方式对比深圳九个正式行政区的${industry}产业发展差异。`} action={<IndustrySelect industry={industry} industries={industries} onChange={onIndustryChange} />} />
    <section className="om-map-panel">
      <header className="om-map-panel-header"><div><h4>深圳产业专题图</h4><p>切换六类专题图层，点选行政区查看对应指标。</p></div><DemoNotice>地图与数据均为演示</DemoNotice></header>
      <LayerTabs value={layer} onChange={changeLayer} />
      <div className="om-map-stage">
        <MapFigure layer={layer} metrics={metrics} entities={entities} selectedDistrict={selectedDistrict} selectedEntity={selectedEntity} onDistrictChange={(district) => { setSelectedDistrict(district); setSelectedEntity(null); }} onEntityChange={selectEntity} />
        <DistrictSummary district={selectedDistrict} industry={industry} metrics={metrics[selectedDistrict]} layer={layer} />
      </div>
      {(layer === "enterprise" || layer === "research") && selectedEntity && <div className="om-entity-detail"><EntityDetails entity={selectedEntity} industry={industry} /></div>}
    </section>
  </div>;
}

function SearchResults({ query, entities, selectedEntity, onSelect }: { query: string; entities: MapEntity[]; selectedEntity: MapEntity | null; onSelect: (entity: MapEntity) => void }) {
  const normalized = query.trim().toLowerCase();
  const results = normalized ? entities.filter((entity) => `${entity.name}${entity.type}${entity.district}${entity.address}${entity.focus}`.toLowerCase().includes(normalized)) : entities;
  return <section className="om-search-results" aria-label="地图要素检索结果">
    <header><strong>企业 / 科研机构</strong><span>{results.length} 条结果</span></header>
    <div>{results.length ? results.map((entity) => <button type="button" aria-pressed={selectedEntity?.id === entity.id} className={selectedEntity?.id === entity.id ? "active" : ""} onClick={() => onSelect(entity)} key={entity.id}>
      <span className={`om-result-type ${entity.type === "重点企业" ? "is-enterprise" : "is-research"}`}>{entity.type}</span>
      <strong className="om-result-name">{entity.name}</strong>
      <span className="om-result-district">{entity.district}</span>
      <span className="om-result-locate"><MapPin size={14} aria-hidden="true" />定位</span>
    </button>) : <p>未找到匹配的企业或科研机构，请更换关键词。</p>}</div>
  </section>;
}

function IndustryStatisticsList({ industries, district }: { industries: readonly string[]; district: DistrictName }) {
  const districtSeed = hashString(district);
  const rows = industries.map((item) => ({ label: item, value: stableNumber(districtSeed, `${item}-industry-index`, 48, 96) }));
  return <aside className="om-industry-statistics" aria-label={`${district}各项产业统计指标`}>
    <header><div><i aria-hidden="true" /><strong>各项产业统计指标</strong></div><span>共 {industries.length} 项</span></header>
    <div className="om-industry-statistics-columns" aria-hidden="true"><span>产业方向</span><span>指标值</span></div>
    <dl>{rows.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
  </aside>;
}

function MapToolsView({ industry, industries }: { industry: string; industries: readonly string[] }) {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictName>("南山区");
  const [selectedEntity, setSelectedEntity] = useState<MapEntity | null>(null);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const metrics = useMemo(() => buildDistrictMetrics(industry), [industry]);
  const entities = useMemo(() => buildEntities(industry), [industry]);
  const searchResults = useMemo(() => {
    const normalized = submittedQuery.trim().toLocaleLowerCase();
    if (!normalized) return entities;
    return entities.filter((entity) => `${entity.name}${entity.type}${entity.district}${entity.address}${entity.focus}`.toLocaleLowerCase().includes(normalized));
  }, [entities, submittedQuery]);
  const selectEntity = (entity: MapEntity) => {
    setSelectedEntity(entity);
    setSelectedDistrict(entity.district);
  };
  const changeDistrict = (district: DistrictName) => {
    setSelectedDistrict(district);
    setSelectedEntity(null);
    setQuery("");
    setSubmittedQuery("");
  };
  const locateQuery = () => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) {
      setSubmittedQuery("");
      return;
    }
    setSubmittedQuery(normalized);
    const district = SHENZHEN_DISTRICTS.find((item) => item.toLocaleLowerCase().includes(normalized));
    if (district) {
      setSelectedDistrict(district);
      setSelectedEntity(null);
      return;
    }
    const matchedEntities = entities.filter((item) => `${item.name}${item.type}${item.district}${item.address}${item.focus}`.toLocaleLowerCase().includes(normalized));
    if (matchedEntities.length) {
      selectEntity(matchedEntities[0]);
      return;
    }
    setSelectedEntity(null);
  };
  const resetQuery = () => {
    setQuery("");
    setSubmittedQuery("");
    setSelectedDistrict("南山区");
    setSelectedEntity(null);
  };
  return <div className="om-module om-map-tools-view">
    <ModuleIntro title="地图分析工具" description="支持地图点选或下拉切换行政区，并检索重点企业、科研机构后定位。" showNotice={false} />
    <section className="om-map-panel">
      <div className="om-map-tools-bar">
        <label><span className="om-visually-hidden">行政区</span><div><TopicOutlineSelect ariaLabel="选择深圳行政区" value={selectedDistrict} options={SHENZHEN_DISTRICTS} onChange={changeDistrict} /></div></label>
        <label className="om-map-search"><span className="om-visually-hidden">搜索要素定位</span><div><TopicOutlineInput ariaLabel="搜索重点企业或科研机构" value={query} maxLength={80} onChange={setQuery} onPressEnter={(event) => { event.preventDefault(); locateQuery(); }} placeholder="输入企业、科研机构关键词查询" /></div></label>
        <div className="om-map-query-actions"><button type="button" onClick={locateQuery}>查询</button><button type="button" onClick={resetQuery}>重置</button></div>
      </div>
      <div className="om-map-stage">
        <MapFigure layer="industry" metrics={metrics} entities={submittedQuery ? searchResults : []} selectedDistrict={selectedDistrict} selectedEntity={selectedEntity} onDistrictChange={changeDistrict} onEntityChange={selectEntity} showAllEntities showValues={false} />
        <IndustryStatisticsList industries={industries} district={selectedDistrict} />
      </div>
      <div className="om-tools-lower">
        <SearchResults query={submittedQuery} entities={entities} selectedEntity={selectedEntity} onSelect={selectEntity} />
      </div>
      <p className="om-map-data-disclaimer">对象名称、统计值与位置坐标为示意数据，不作为实际决策依据。</p>
    </section>
  </div>;
}

export function OneMapModule({ subId, industry, industries = DEFAULT_INDUSTRIES, onIndustryChange }: OneMapModuleProps) {
  if (subId === "map-statistics") return <StatisticsView industry={industry} industries={industries} onIndustryChange={onIndustryChange} />;
  if (subId === "map-indicators") return <MapIndicatorsView industry={industry} industries={industries} onIndustryChange={onIndustryChange} />;
  return <MapToolsView industry={industry} industries={industries} />;
}

export default OneMapModule;
