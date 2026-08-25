import {
  Activity,
  Atom,
  BookOpen,
  Building2,
  ChevronDown,
  CircleAlert,
  GraduationCap,
  MapPin,
  Microscope,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./one-map-module.css";

type OneMapModuleProps = {
  subId: string;
  industry: string;
};

type DistrictName =
  | "南山区"
  | "福田区"
  | "罗湖区"
  | "宝安区"
  | "龙岗区"
  | "光明区"
  | "龙华区"
  | "坪山区"
  | "盐田区"
  | "大鹏新区";

type IndicatorId = "industry" | "technology" | "enterprise" | "talent" | "research";
type LayerId = IndicatorId | "policy";
type EntityType = "重点企业" | "科研机构";

type DistrictDefinition = {
  name: DistrictName;
  path: string;
  center: [number, number];
};

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
  offset: [number, number];
};

type TrendSeries = {
  label: string;
  values: number[];
  color?: string;
};

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

const DISTRICTS: DistrictDefinition[] = [
  { name: "宝安区", path: "M52 48 L157 28 L214 70 L184 133 L93 145 L35 105 Z", center: [118, 89] },
  { name: "光明区", path: "M157 28 L251 38 L272 91 L214 70 Z", center: [220, 55] },
  { name: "龙华区", path: "M214 70 L272 91 L291 154 L222 170 L184 133 Z", center: [238, 124] },
  { name: "南山区", path: "M93 145 L184 133 L222 170 L203 235 L105 249 L57 201 Z", center: [145, 193] },
  { name: "福田区", path: "M203 235 L222 170 L291 154 L325 203 L296 246 Z", center: [263, 211] },
  { name: "罗湖区", path: "M325 203 L291 154 L358 134 L394 183 L375 231 Z", center: [345, 185] },
  { name: "龙岗区", path: "M272 91 L367 62 L459 101 L477 176 L394 183 L358 134 L291 154 Z", center: [382, 119] },
  { name: "坪山区", path: "M477 176 L459 101 L538 126 L556 188 L511 220 Z", center: [506, 168] },
  { name: "盐田区", path: "M375 231 L394 183 L477 176 L511 220 L450 252 Z", center: [442, 216] },
  { name: "大鹏新区", path: "M511 220 L556 188 L617 217 L590 278 L523 292 L450 252 Z", center: [548, 247] },
];

const INDICATORS: { id: IndicatorId; label: string; icon: LucideIcon }[] = [
  { id: "industry", label: "产业指标", icon: Activity },
  { id: "technology", label: "技术指标", icon: Atom },
  { id: "enterprise", label: "企业指标", icon: Building2 },
  { id: "talent", label: "人才指标", icon: Users },
  { id: "research", label: "科研指标", icon: Microscope },
];

const LAYERS: { id: LayerId; label: string; metric: string; unit: string }[] = [
  { id: "industry", label: "产业发展", metric: "产业发展指数", unit: "" },
  { id: "technology", label: "技术分布", metric: "技术活跃指数", unit: "" },
  { id: "enterprise", label: "企业分布", metric: "企业数量", unit: "家" },
  { id: "research", label: "科研机构", metric: "科研机构数量", unit: "家" },
  { id: "talent", label: "人才分布", metric: "人才数量", unit: "人" },
  { id: "policy", label: "政策支持", metric: "政策数量", unit: "条" },
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
  return DISTRICTS.reduce<Record<DistrictName, DistrictMetrics>>((record, district, index) => {
    const districtWeight = [1.1, .86, .74, 1.03, .95, .9, .93, .76, .61, .54][index];
    record[district.name] = {
      industry: Math.round(stableNumber(seed, `${district.name}-industry`, 52, 92) * districtWeight),
      technology: Math.round(stableNumber(seed, `${district.name}-technology`, 49, 96) * districtWeight),
      enterprise: Math.max(8, Math.round(stableNumber(seed, `${district.name}-enterprise`, 26, 116) * districtWeight)),
      talent: Math.max(90, Math.round(stableNumber(seed, `${district.name}-talent`, 180, 920) * districtWeight)),
      research: Math.max(3, Math.round(stableNumber(seed, `${district.name}-research`, 8, 42) * districtWeight)),
      policy: Math.max(4, Math.round(stableNumber(seed, `${district.name}-policy`, 9, 38) * districtWeight)),
    };
    return record;
  }, {} as Record<DistrictName, DistrictMetrics>);
}

function buildEntities(industry: string): MapEntity[] {
  const shortName = industry.length > 6 ? industry.slice(0, 6) : industry;
  return [
    { id: "enterprise-1", type: "重点企业", name: `${shortName}工程技术有限公司（演示）`, district: "南山区", address: "南山区科技园片区（位置示意）", founded: "2018 年", focus: "产品研发、工程验证与场景交付", offset: [18, -16] },
    { id: "enterprise-2", type: "重点企业", name: `${shortName}产业创新有限公司（演示）`, district: "宝安区", address: "宝安区新兴产业片区（位置示意）", founded: "2020 年", focus: "中试放大、生产服务与产业协同", offset: [-19, 17] },
    { id: "enterprise-3", type: "重点企业", name: `鹏城${shortName}科技有限公司（演示）`, district: "龙岗区", address: "龙岗区大运片区（位置示意）", founded: "2017 年", focus: "核心部件、系统集成与应用服务", offset: [18, -17] },
    { id: "enterprise-4", type: "重点企业", name: `深湾${shortName}应用有限公司（演示）`, district: "坪山区", address: "坪山区产业园片区（位置示意）", founded: "2021 年", focus: "产业化验证与规模制造", offset: [18, -16] },
    { id: "research-1", type: "科研机构", name: `${shortName}交叉科学研究中心（演示）`, district: "光明区", address: "光明科学城片区（位置示意）", founded: "2019 年", focus: "基础研究、技术评价与成果转化", offset: [17, 17] },
    { id: "research-2", type: "科研机构", name: `湾区${shortName}技术研究院（演示）`, district: "福田区", address: "福田中心区（位置示意）", founded: "2016 年", focus: "产业战略、共性技术与开放服务", offset: [18, -17] },
    { id: "research-3", type: "科研机构", name: `深圳${shortName}联合实验室（演示）`, district: "龙华区", address: "龙华数字产业片区（位置示意）", founded: "2022 年", focus: "关键技术攻关与工程化验证", offset: [-18, 17] },
    { id: "research-4", type: "科研机构", name: `${shortName}前沿技术中心（演示）`, district: "盐田区", address: "盐田区创新园片区（位置示意）", founded: "2020 年", focus: "前沿研究、人才培养与产业咨询", offset: [17, 17] },
  ];
}

function DemoNotice({ children = "以下为稳定演示数据，不作为正式决策依据" }: { children?: string }) {
  return <span className="om-demo-notice"><CircleAlert size={14} aria-hidden="true" />{children}</span>;
}

function ModuleIntro({ title, description }: { title: string; description: string }) {
  return <header className="om-intro">
    <div><h3>{title}</h3><p>{description}</p></div>
    <DemoNotice />
  </header>;
}

function MetricCard({ label, value, unit, note, icon: Icon }: { label: string; value: string; unit?: string; note: string; icon: LucideIcon }) {
  return <article className="om-metric-card">
    <span className="om-metric-icon"><Icon size={18} aria-hidden="true" /></span>
    <div><span>{label}</span><strong>{value}<small>{unit}</small></strong><p>{note}</p></div>
  </article>;
}

function TrendChart({ title, unit, series }: { title: string; unit: string; series: TrendSeries[] }) {
  const width = 610;
  const height = 224;
  const allValues = series.flatMap((item) => item.values);
  const max = Math.max(...allValues, 1);
  const min = Math.min(...allValues, 0);
  const range = Math.max(max - min, 1);
  const pointsFor = (values: number[]) => values.map((value, index) => ({
    x: 44 + index * ((width - 78) / (YEARS.length - 1)),
    y: 26 + (1 - (value - min) / range) * 132,
  }));
  return <figure className="om-chart om-trend-chart">
    <div className="om-chart-heading"><div><h4>{title}</h4><span>2020—2025</span></div><div className="om-chart-legend">{series.map((item, index) => <span key={item.label}><i style={{ background: item.color ?? (index === 0 ? "var(--tp-data-primary, #1769ff)" : "var(--tp-data-compare, #18a875)") }} />{item.label}</span>)}</div></div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title}：${series.map((item) => `${item.label}${item.values.map((value, index) => `${YEARS[index]}年${value}${unit}`).join("，")}`).join("；")}。演示数据。`}>
      {[26, 59, 92, 125, 158].map((y) => <line key={y} x1="44" x2="576" y1={y} y2={y} />)}
      {series.map((item, seriesIndex) => {
        const points = pointsFor(item.values);
        const color = item.color ?? (seriesIndex === 0 ? "var(--tp-data-primary, #1769ff)" : "var(--tp-data-compare, #18a875)");
        const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
        return <g key={item.label} style={{ color }}><path d={path} />{points.map((point, index) => <circle key={`${item.label}-${YEARS[index]}`} cx={point.x} cy={point.y} r="4" />)}</g>;
      })}
      {YEARS.map((year, index) => <text key={year} x={44 + index * ((width - 78) / (YEARS.length - 1))} y="198" textAnchor="middle">{year}</text>)}
    </svg>
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
    <ol>{items.map((item, index) => <li key={item.label}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.label}</strong><small>虚构样例机构</small></div><b>{item.value.toLocaleString()}<small>{unit}</small></b></li>)}</ol>
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

  if (indicator === "industry") return <>
    <div className="om-metric-grid om-metric-grid-2">
      <MetricCard icon={Activity} label="产业规模" value={industryScale.toFixed(1)} unit="亿元" note="2025 年深圳演示统计" />
      <MetricCard icon={Building2} label="企业机构数量" value={enterpriseCount.toLocaleString()} unit="家" note="2025 年深圳演示统计" />
    </div>
    <div className="om-visual-grid">
      <TrendChart title="产业规模及趋势" unit="亿元" series={[{ label: "产业规模", values: createTrend(seed, "industry-scale-trend", Math.round(industryScale * .54), industryScale) }]} />
      <TrendChart title="企业机构数量及趋势" unit="家" series={[{ label: "企业机构", values: createTrend(seed, "industry-enterprise-trend", Math.round(enterpriseCount * .58), enterpriseCount) }]} />
    </div>
  </>;

  if (indicator === "technology") {
    const institutes = ["深圳未来技术研究院", "鹏城工程联合中心", "湾区科技成果转化中心", "前沿产业技术研究院"].map((label, index) => ({ label: `${label}（演示）`, value: stableNumber(seed, `conversion-${index}`, 18, 68) }));
    return <>
      <div className="om-metric-grid om-metric-grid-3">
        <MetricCard icon={BookOpen} label="论文数量" value={paperCount.toLocaleString()} unit="篇" note="累计演示样本" />
        <MetricCard icon={Atom} label="专利数量" value={patentCount.toLocaleString()} unit="件" note="累计演示样本" />
        <MetricCard icon={Activity} label="技术转化额" value={institutes.reduce((sum, item) => sum + item.value, 0).toLocaleString()} unit="百万元" note="重点专利机构演示统计" />
      </div>
      <div className="om-visual-grid">
        <TrendChart title="论文与专利数量趋势" unit="项" series={[{ label: "论文", values: createTrend(seed, "papers", Math.round(paperCount * .48), paperCount) }, { label: "专利", values: createTrend(seed, "patents", Math.round(patentCount * .45), patentCount) }]} />
        <BarChart title="专利重点机构技术转化额" unit="百万元" items={institutes} />
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
        <BarChart title="企业人数分布" unit="人" items={[{ label: "研发人员", value: stableNumber(seed, "worker-rd", 3600, 6400) }, { label: "工程技术人员", value: stableNumber(seed, "worker-engineer", 2900, 5200) }, { label: "生产与运营人员", value: stableNumber(seed, "worker-production", 2500, 4600) }]} />
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
      <div className="om-stack-charts">
        <BarChart title="科研机构领域统计" unit="家" items={researchDomains} />
        <RankingList title="重点科研机构" unit="示意值" items={institutions} />
      </div>
    </div>
  </>;
}

function StatisticsView({ industry }: { industry: string }) {
  const [indicator, setIndicator] = useState<IndicatorId>("industry");
  return <div className="om-module om-statistics-view">
    <ModuleIntro title="专题产业相关统计" description={`以图表呈现深圳${industry}产业、技术、企业、人才与科研五类指标。`} />
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
    <DemoNotice>名称、地址和信息均为演示</DemoNotice>
  </article>;
}

function MapFigure({
  layer,
  metrics,
  entities,
  selectedDistrict,
  selectedEntity,
  onDistrictChange,
  onEntityChange,
  showAllEntities = false,
}: {
  layer: LayerId;
  metrics: Record<DistrictName, DistrictMetrics>;
  entities: MapEntity[];
  selectedDistrict: DistrictName;
  selectedEntity: MapEntity | null;
  onDistrictChange: (district: DistrictName) => void;
  onEntityChange: (entity: MapEntity) => void;
  showAllEntities?: boolean;
}) {
  const detail = getLayerDetails(layer);
  const values = DISTRICTS.map((district) => metrics[district.name][layer]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const visibleEntities = showAllEntities ? entities : entities.filter((entity) => (layer === "enterprise" ? entity.type === "重点企业" : layer === "research" ? entity.type === "科研机构" : false));
  const keyboardSelect = (event: KeyboardEvent<SVGGElement>, callback: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  };
  return <figure className="om-map-figure">
    <svg viewBox="0 0 650 320" role="group" aria-label={`深圳十个行政区${detail.label}示意地图，可点选行政区`}>
      <title>深圳行政区专题示意图</title>
      <desc>本图不代表真实行政边界，所有指标、位置和对象信息均为演示数据。</desc>
      {DISTRICTS.map((district) => {
        const value = metrics[district.name][layer];
        const level = .2 + (value - min) / Math.max(max - min, 1) * .68;
        return <g className={`om-district ${selectedDistrict === district.name ? "active" : ""}`} role="button" tabIndex={0} aria-label={`选择${district.name}，${detail.metric}${value}${detail.unit}`} aria-pressed={selectedDistrict === district.name} onClick={() => onDistrictChange(district.name)} onKeyDown={(event) => keyboardSelect(event, () => onDistrictChange(district.name))} key={district.name}>
          <path d={district.path} style={{ "--om-level": `${Math.round(level * 100)}%` } as CSSProperties} />
          <text x={district.center[0]} y={district.center[1] - 4} textAnchor="middle">{district.name.replace("新区", "")}</text>
          <text className="om-district-value" x={district.center[0]} y={district.center[1] + 12} textAnchor="middle">{value}{detail.unit}</text>
        </g>;
      })}
      {visibleEntities.map((entity) => {
        const district = DISTRICTS.find((item) => item.name === entity.district)!;
        const x = district.center[0] + entity.offset[0];
        const y = district.center[1] + entity.offset[1];
        return <g className={`om-map-marker ${entity.type === "科研机构" ? "research" : "enterprise"} ${selectedEntity?.id === entity.id ? "active" : ""}`} role="button" tabIndex={0} aria-label={`查看${entity.name}基本信息`} aria-pressed={selectedEntity?.id === entity.id} transform={`translate(${x} ${y})`} onClick={(event) => { event.stopPropagation(); onEntityChange(entity); }} onKeyDown={(event) => keyboardSelect(event, () => onEntityChange(entity))} key={entity.id}>
          <circle className="om-marker-ring" r="10" /><circle r="4" />
        </g>;
      })}
    </svg>
    {visibleEntities.length > 0 && <div className="om-map-marker-legend" aria-label="地图要素图例"><span><i className="enterprise" />重点企业</span><span><i className="research" />科研机构</span></div>}
    <figcaption><span>深圳行政区专题示意 · {detail.label}</span><small>非真实行政边界，颜色仅表示演示指标相对高低</small></figcaption>
  </figure>;
}

function DistrictSummary({ district, industry, metrics, layer }: { district: DistrictName; industry: string; metrics: DistrictMetrics; layer: LayerId }) {
  const detail = getLayerDetails(layer);
  return <aside className="om-district-summary" aria-live="polite">
    <header><span>当前行政区</span><h4>{district}</h4><p>{industry} · {detail.label}</p></header>
    <div className="om-primary-reading"><span>{detail.metric}</span><strong>{metrics[layer].toLocaleString()}<small>{detail.unit}</small></strong></div>
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

function MapIndicatorsView({ industry }: { industry: string }) {
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
    <ModuleIntro title="专题产业相关指标" description={`以空间方式对比深圳十个行政区的${industry}产业发展差异。`} />
    <section className="om-map-panel">
      <header className="om-map-panel-header"><div><h4>深圳产业专题图</h4><p>切换六类专题图层，点选行政区查看对应指标。</p></div><DemoNotice>地图与数据均为演示</DemoNotice></header>
      <LayerTabs value={layer} onChange={changeLayer} />
      <div className="om-map-stage">
        <MapFigure layer={layer} metrics={metrics} entities={entities} selectedDistrict={selectedDistrict} selectedEntity={selectedEntity} onDistrictChange={(district) => { setSelectedDistrict(district); setSelectedEntity(null); }} onEntityChange={selectEntity} />
        <DistrictSummary district={selectedDistrict} industry={industry} metrics={metrics[selectedDistrict]} layer={layer} />
      </div>
      {(layer === "enterprise" || layer === "research") && <div className="om-entity-detail"><EntityDetails entity={selectedEntity} industry={industry} /></div>}
    </section>
  </div>;
}

function SearchResults({ query, entities, selectedEntity, onSelect }: { query: string; entities: MapEntity[]; selectedEntity: MapEntity | null; onSelect: (entity: MapEntity) => void }) {
  const normalized = query.trim().toLowerCase();
  const results = normalized ? entities.filter((entity) => `${entity.name}${entity.type}${entity.district}${entity.address}${entity.focus}`.toLowerCase().includes(normalized)) : entities;
  return <section className="om-search-results" aria-label="地图要素检索结果">
    <header><strong>企业 / 科研机构</strong><span>{results.length} 条演示结果</span></header>
    <div>{results.length ? results.map((entity) => <button type="button" aria-pressed={selectedEntity?.id === entity.id} className={selectedEntity?.id === entity.id ? "active" : ""} onClick={() => onSelect(entity)} key={entity.id}><MapPin size={15} aria-hidden="true" /><span><strong>{entity.name}</strong><small>{entity.type} · {entity.district}</small></span></button>) : <p>未找到匹配的演示企业或科研机构，请更换关键词。</p>}</div>
  </section>;
}

function MapToolsView({ industry }: { industry: string }) {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictName>("南山区");
  const [selectedEntity, setSelectedEntity] = useState<MapEntity | null>(null);
  const [query, setQuery] = useState("");
  const metrics = useMemo(() => buildDistrictMetrics(industry), [industry]);
  const entities = useMemo(() => buildEntities(industry), [industry]);
  const selectEntity = (entity: MapEntity) => {
    setSelectedEntity(entity);
    setSelectedDistrict(entity.district);
  };
  return <div className="om-module om-map-tools-view">
    <ModuleIntro title="地图分析工具" description="支持地图点选或下拉切换行政区，并检索重点企业、科研机构后定位。" />
    <section className="om-map-panel">
      <div className="om-map-tools-bar">
        <label><span>行政区</span><div><select value={selectedDistrict} onChange={(event) => { setSelectedDistrict(event.target.value as DistrictName); setSelectedEntity(null); }} aria-label="选择深圳行政区">{DISTRICTS.map((district) => <option key={district.name}>{district.name}</option>)}</select><ChevronDown size={15} aria-hidden="true" /></div></label>
        <label className="om-map-search"><span>搜索要素定位</span><div><Search size={16} aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入企业、科研机构或行政区关键词" /></div></label>
      </div>
      <div className="om-map-stage">
        <MapFigure layer="industry" metrics={metrics} entities={entities} selectedDistrict={selectedDistrict} selectedEntity={selectedEntity} onDistrictChange={(district) => { setSelectedDistrict(district); setSelectedEntity(null); }} onEntityChange={selectEntity} showAllEntities />
        <DistrictSummary district={selectedDistrict} industry={industry} metrics={metrics[selectedDistrict]} layer="industry" />
      </div>
      <div className="om-tools-lower">
        <SearchResults query={query} entities={entities} selectedEntity={selectedEntity} onSelect={selectEntity} />
        <EntityDetails entity={selectedEntity} industry={industry} />
      </div>
    </section>
  </div>;
}

export function OneMapModule({ subId, industry }: OneMapModuleProps) {
  if (subId === "map-statistics") return <StatisticsView industry={industry} />;
  if (subId === "map-indicators") return <MapIndicatorsView industry={industry} />;
  return <MapToolsView industry={industry} />;
}

export default OneMapModule;
