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
type ChainStage = "上游" | "中游" | "下游";
type ChainNode = { name: string; count: number; coverage: number };
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
};
type PolicyNewsItem = {
  date: string;
  region: string;
  issuer: string;
  title: string;
  summary: string;
  url?: string;
};

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

const MAP_PROVINCES: Omit<MapDatum, "count" | "continuity">[] = [
  { name: "北京市", x: 82, y: 18 },
  { name: "上海市", x: 92, y: 52 },
  { name: "广东省", x: 68, y: 84 },
  { name: "江苏省", x: 82, y: 39 },
  { name: "浙江省", x: 83, y: 67 },
  { name: "湖北省", x: 54, y: 60 },
  { name: "四川省", x: 36, y: 70 },
  { name: "安徽省", x: 64, y: 45 },
  { name: "山东省", x: 66, y: 25 },
  { name: "陕西省", x: 43, y: 42 },
];

const MAP_CITIES: Omit<MapDatum, "count" | "continuity">[] = [
  { name: "深圳市", x: 72, y: 84 },
  { name: "北京市", x: 82, y: 18 },
  { name: "上海市", x: 92, y: 52 },
  { name: "广州市", x: 56, y: 82 },
  { name: "杭州市", x: 83, y: 70 },
  { name: "苏州市", x: 79, y: 40 },
  { name: "武汉市", x: 54, y: 62 },
  { name: "成都市", x: 36, y: 70 },
  { name: "合肥市", x: 65, y: 47 },
  { name: "西安市", x: 43, y: 42 },
];

const DISTRICTS = ["南山区", "福田区", "宝安区", "龙岗区", "龙华区", "光明区", "罗湖区", "坪山区", "盐田区", "大鹏新区"];

const CHAIN_NODES: Record<string, [string[], string[], string[]]> = {
  合成生物: [
    ["基因与DNA合成", "酶与蛋白设计", "生物元件库", "实验设备与试剂"],
    ["底盘细胞构建", "生物制造工艺", "发酵与过程控制", "分离纯化与中试"],
    ["生物医药", "食品与农业", "生物材料", "绿色化工与环保"],
  ],
  区块链: [
    ["密码算法", "数据存储", "网络与算力", "安全芯片"],
    ["共识机制", "智能合约", "跨链互操作", "隐私计算"],
    ["金融服务", "政务协同", "供应链溯源", "数字资产服务"],
  ],
  "细胞与基因": [
    ["基因测序", "载体与试剂", "细胞资源库", "实验设备"],
    ["基因编辑", "细胞制备", "工艺开发", "质量检测"],
    ["细胞治疗", "基因治疗", "诊断服务", "再生医学"],
  ],
  空天技术: [
    ["先进材料", "元器件", "推进系统", "测控设备"],
    ["卫星研制", "运载系统", "地面系统", "在轨服务"],
    ["遥感应用", "卫星通信", "导航服务", "低空经济"],
  ],
  "脑科学与类脑智能": [
    ["脑影像设备", "神经芯片", "数据资源", "实验模型"],
    ["脑机接口", "神经调控", "类脑算法", "认知计算"],
    ["医疗康复", "智能交互", "教育应用", "工业智能"],
  ],
  深地深海: [
    ["特种材料", "传感器", "动力系统", "通信设备"],
    ["探测装备", "工程作业", "数据处理", "试验验证"],
    ["资源勘探", "海洋工程", "环境监测", "公共安全"],
  ],
  "可见光通信与光计算": [
    ["光源器件", "光电芯片", "光学材料", "精密制造"],
    ["光通信模组", "光计算架构", "调制与编码", "系统集成"],
    ["高速通信", "算力中心", "智能照明", "工业感知"],
  ],
  量子信息: [
    ["低温设备", "精密测控", "量子材料", "核心器件"],
    ["量子计算", "量子通信", "量子测量", "软件与算法"],
    ["安全通信", "科学计算", "精密检测", "行业解决方案"],
  ],
};

const FALLBACK_CHAIN = CHAIN_NODES.合成生物;

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

function MultiLineTrend({ series, label }: { series: { label: string; values: number[]; color: string }[]; label: string }) {
  const width = 660;
  const height = 250;
  const plot = { left: 42, right: 638, top: 20, bottom: 196 };
  const max = Math.max(...series.flatMap((item) => item.values), 1);
  const ceiling = Math.ceil(max / 20) * 20;
  const x = (index: number) => plot.left + index * ((plot.right - plot.left) / Math.max(YEARS.length - 1, 1));
  const y = (value: number) => plot.bottom - value / ceiling * (plot.bottom - plot.top);
  return <figure className="tpm-trend">
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${label}；${series.map((item) => `${item.label}：${item.values.join("、")}`).join("；")}；均为演示数据`}>
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

function ComparisonList({ title, items }: { title: string; items: { name: string; count: number; years: number }[] }) {
  const max = Math.max(...items.map((item) => item.count), 1);
  return <section className="tpm-comparison-list">
    <h4>{title}</h4>
    <ol>{items.map((item) => <li key={item.name}>
      <div><strong>{item.name}</strong><span>{item.count} 条 · 连续 {item.years} 年</span></div>
      <i aria-hidden="true"><b style={{ width: `${item.count / max * 100}%` }} /></i>
    </li>)}</ol>
  </section>;
}

function buildOverview(industry: string) {
  const seed = industrySeed(industry);
  const national = [46, 54, 63, 75, 88, 102].map((value, index) => value + (seed % 7) + index * (seed % 3));
  const provincial = national.map((value, index) => Math.round(value * .58) + (index % 2) * 2);
  const municipal = national.map((value, index) => Math.round(value * .76) + (index % 3));
  const provinces = PROVINCES.slice(0, 6).map((name, index) => ({ name, count: 74 - index * 6 + seed % 8, years: Math.max(3, 8 - index % 5) }));
  const cities = CITIES.slice(0, 6).map((name, index) => ({ name, count: 62 - index * 5 + seed % 7, years: Math.max(3, 8 - (index + 1) % 5) }));
  return {
    national,
    provincial,
    municipal,
    nationalTotal: 398 + seed * 5,
    provincialTotal: 154 + seed * 3,
    municipalTotal: 236 + seed * 4,
    provinces,
    cities,
  };
}

function PolicyOverview({ industry }: { industry: string }) {
  const data = useMemo(() => buildOverview(industry), [industry]);
  return <div className="tpm-stack">
    <MetricStrip items={[
      { label: "全国政策统计", value: `${data.nationalTotal} 条`, note: "2020—2025 演示汇总", icon: Landmark },
      { label: "省级政策统计", value: `${data.provincialTotal} 条`, note: "31 个省级地区演示样本", icon: MapPinned },
      { label: "市级政策统计", value: `${data.municipalTotal} 条`, note: "重点城市演示样本", icon: Building2 },
      { label: "连续统计周期", value: "6 年", note: "按年度观察政策连续性", icon: CalendarDays },
    ]} />
    <Section title="政策数量与发布连续性" description={`${industry} · 全国、省级与市级年度政策数量对比`} action={<DemoBadge>数量为演示统计</DemoBadge>}>
      <MultiLineTrend label={`${industry}政策数量与连续性`} series={[
        { label: "全国政策", values: data.national, color: "#1769ff" },
        { label: "省级政策", values: data.provincial, color: "#18a999" },
        { label: "市级政策", values: data.municipal, color: "#d88a27" },
      ]} />
    </Section>
    <Section title="省级与重点城市政策连续性对比" description="连续年数用于观察政策发布是否保持稳定，不代表政策实际效果">
      <div className="tpm-two-column">
        <ComparisonList title="省级政策样本" items={data.provinces} />
        <ComparisonList title="重点城市政策样本" items={data.cities} />
      </div>
    </Section>
  </div>;
}

function makeMapData(industry: string, level: RegionLevel): MapDatum[] {
  const seed = industrySeed(industry);
  const base = level === "province" ? MAP_PROVINCES : MAP_CITIES;
  return base.map((item, index) => ({
    ...item,
    count: (level === "province" ? 74 : 62) - index * 4 + (seed + index * 3) % 9,
    continuity: 3 + (seed + index * 2) % 6,
  }));
}

function PolicyMap({ industry }: { industry: string }) {
  const [level, setLevel] = useState<RegionLevel>("province");
  const [selectedName, setSelectedName] = useState(MAP_PROVINCES[0].name);
  const data = useMemo(() => makeMapData(industry, level), [industry, level]);
  const selected = data.find((item) => item.name === selectedName) ?? data[0];
  const max = Math.max(...data.map((item) => item.count), 1);
  const changeLevel = (next: RegionLevel) => {
    setLevel(next);
    setSelectedName((next === "province" ? MAP_PROVINCES : MAP_CITIES)[0].name);
  };
  const levelLabel = level === "province" ? "省级地区" : "重点城市";
  return <Section
    title={`${industry}${levelLabel}政策密度样本图`}
    description={`当前展示 ${data.length} 个${levelLabel}演示点位；完整全国比较由“政策概况统计”和“政策力度排名”承载`}
    action={<SegmentControl value={level} onChange={changeLevel} label="政策地图层级" />}
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
        <div className="tpm-map-markers" aria-label={`${levelLabel}政策密度演示样本点位，共 ${data.length} 个`}>
          {data.map((item) => <button
            type="button"
            className={selected.name === item.name ? "active" : ""}
            style={{ left: `${item.x}%`, top: `${item.y}%`, "--tpm-marker-size": `${30 + item.count / max * 14}px` } as CSSProperties}
            aria-pressed={selected.name === item.name}
            aria-label={`${item.name}演示样本，政策 ${item.count} 条，连续发布 ${item.continuity} 年`}
            onClick={() => setSelectedName(item.name)}
            key={item.name}
          ><span>{item.count}</span><small>{item.name.replace(/[省市]$/, "")}</small></button>)}
        </div>
        <div className="tpm-map-legend"><span>低</span><i /><span>高</span><small>样本政策数量（条）</small></div>
      </div>
      <aside className="tpm-map-detail" aria-live="polite">
        <span>{levelLabel}演示样本</span>
        <h4>{selected.name}</h4>
        <dl><div><dt>政策数量</dt><dd>{selected.count}<small>条</small></dd></div><div><dt>连续发布</dt><dd>{selected.continuity}<small>年</small></dd></div></dl>
        <p>图中仅展示 {data.length} 个重点样本点位，密度与连续性均为演示计算；正式结果需接入完整政策发布与行政区数据。</p>
        <ol>{data.slice(0, 5).map((item, index) => <li className={selected.name === item.name ? "active" : ""} key={item.name}><b>{index + 1}</b><span>{item.name}</span><strong>{item.count} 条</strong></li>)}</ol>
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
  }));
  return { 上游: create(stages[0], 0), 中游: create(stages[1], 1), 下游: create(stages[2], 2) };
}

function ChainCoverage({ industry, shenzhen = false }: { industry: string; shenzhen?: boolean }) {
  const data = useMemo(() => buildChain(industry), [industry]);
  const ratio = shenzhen ? .54 : 1;
  return <div className="tpm-chain" aria-label={`${shenzhen ? "深圳" : "全国"}${industry}政策产业链覆盖`}>
    <div className="tpm-chain-legend"><span><i />政策数量</span><span><b />覆盖程度</span><small>节点可被多项政策覆盖，数据为演示统计</small></div>
    {(Object.entries(data) as [ChainStage, ChainNode[]][]).map(([stage, nodes], stageIndex) => <section className={`stage-${stageIndex + 1}`} key={stage}>
      <header><strong>{stage}</strong><span>{stage === "上游" ? "基础支撑" : stage === "中游" ? "研发与制造" : "应用与服务"}</span></header>
      <ol>{nodes.map((node) => {
        const count = Math.max(3, Math.round(node.count * ratio));
        const coverage = Math.max(20, Math.round(node.coverage * (shenzhen ? .78 : 1)));
        return <li key={node.name}>
          <div><strong>{node.name}</strong><span>{count} 条政策</span></div>
          <i aria-label={`覆盖程度 ${coverage}%`}><b style={{ width: `${coverage}%` }} /></i>
          <small>{coverage}%</small>
        </li>;
      })}</ol>
    </section>)}
  </div>;
}

function PolicyCoverage({ industry }: { industry: string }) {
  return <Section title={`${industry}政策产业覆盖`} description="结合产业链上、中、下游节点，展示政策数量与覆盖程度" action={<DemoBadge>节点关联为演示</DemoBadge>}>
    <ChainCoverage industry={industry} />
  </Section>;
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

function makePolicyNews(industry: string, shenzhen = false): PolicyNewsItem[] {
  const prefix = shenzhen ? "深圳" : "全国";
  return [
    { date: "2026-07-18", region: prefix, issuer: "科技主管部门（演示）", title: `${industry}关键技术联合攻关支持方向发布（演示）`, summary: "围绕产业链关键节点组织联合攻关、测试验证和成果转化支持。" },
    { date: "2026-05-09", region: prefix, issuer: "发展改革部门（演示）", title: `${industry}未来产业培育行动配套措施更新（演示）`, summary: "从空间载体、公共平台与产业协同三个方面形成支持框架。" },
    { date: "2026-02-22", region: prefix, issuer: "工业和信息化部门（演示）", title: `${industry}中试验证与应用示范项目申报说明（演示）`, summary: "面向工程验证和示范应用环节设置申报条件与实施周期。" },
    { date: "2025-11-14", region: prefix, issuer: "产业促进机构（演示）", title: `${industry}成果转化服务政策阶段说明（演示）`, summary: "聚焦知识产权、技术交易和产业化服务的支持衔接。" },
    { date: "2025-08-03", region: prefix, issuer: "人才工作部门（演示）", title: `${industry}重点团队与人才支持事项发布（演示）`, summary: "对重点研发团队和产业人才的支持事项进行演示说明。" },
  ];
}

function isSafeSourceUrl(url?: string) {
  return Boolean(url && /^https:\/\//i.test(url));
}

function PolicyTimeline({ items }: { items: PolicyNewsItem[] }) {
  return <ol className="tpm-timeline">
    {items.map((item, index) => <li key={`${item.date}-${item.title}`}>
      <time dateTime={item.date}>{item.date}</time>
      <span className="tpm-timeline-node" aria-hidden="true">{index + 1}</span>
      <article>
        <header><span>{item.region}</span><small>{item.issuer}</small></header>
        <h4>{item.title}</h4>
        <p>{item.summary}</p>
        {isSafeSourceUrl(item.url)
          ? <a href={item.url} target="_blank" rel="noreferrer">查看原文<ExternalLink size={14} aria-hidden="true" /></a>
          : <span className="tpm-source-disabled" aria-disabled="true">暂无原文链接</span>}
      </article>
    </li>)}
  </ol>;
}

function PolicyNews({ industry }: { industry: string }) {
  const items = useMemo(() => makePolicyNews(industry), [industry]);
  return <Section title={`${industry}最新政策动态`} description="按时间线展示全国各地最新政策动态；仅接入真实源地址后开放原文链接" action={<DemoBadge>政策条目为演示</DemoBadge>}>
    <PolicyTimeline items={items} />
  </Section>;
}

function DistrictBars({ industry }: { industry: string }) {
  const seed = industrySeed(industry);
  const data = DISTRICTS.map((name, index) => ({ name, value: 5 + (seed + index * 7) % 15 })).sort((a, b) => b.value - a.value);
  const max = Math.max(...data.map((item) => item.value), 1);
  return <div className="tpm-district-bars" aria-label={`深圳十区${industry}政策数量`}>
    {data.map((item) => <div key={item.name}><span>{item.name}</span><i><b style={{ width: `${item.value / max * 100}%` }} /></i><strong>{item.value} 条</strong></div>)}
  </div>;
}

function ShenzhenPolicy({ industry }: { industry: string }) {
  const seed = industrySeed(industry);
  const trend = [18, 23, 29, 36, 44, 53].map((value, index) => value + seed % 5 + index * (seed % 2));
  const news = useMemo(() => makePolicyNews(industry, true).slice(0, 4), [industry]);
  return <div className="tpm-stack">
    <MetricStrip items={[
      { label: "深圳政策数量", value: `${trend.at(-1)} 条`, note: `${industry}演示样本`, icon: Landmark },
      { label: "年度新增", value: `${trend.at(-1)! - trend.at(-2)!} 条`, note: "2025 年演示增量", icon: Activity },
      { label: "行政区覆盖", value: "10 区", note: "深圳各行政区", icon: MapPin },
      { label: "产业链覆盖", value: "12 节点", note: "上中下游演示关联", icon: Network },
    ]} />
    <div className="tpm-two-column tpm-shenzhen-overview">
      <Section title="深圳政策数量趋势" description="2020—2025 年政策数量演示统计">
        <MultiLineTrend label={`深圳${industry}政策数量趋势`} series={[{ label: "深圳政策", values: trend, color: "#1769ff" }]} />
      </Section>
      <Section title="深圳政策区域分布" description="十个行政区政策发布数量对比">
        <DistrictBars industry={industry} />
      </Section>
    </div>
    <Section title="深圳政策产业覆盖" description="结合深圳产业链全景，展示各节点的政策覆盖情况" action={<DemoBadge>节点关联为演示</DemoBadge>}>
      <ChainCoverage industry={industry} shenzhen />
    </Section>
    <Section title="深圳最新政策" description="按时间线展示深圳最新政策文件；真实源地址接入前不可点击" action={<DemoBadge>政策条目为演示</DemoBadge>}>
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
