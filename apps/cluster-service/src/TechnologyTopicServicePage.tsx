import {
  Activity,
  ArrowRight,
  Atom,
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileSearch2,
  FileText,
  Filter,
  Flame,
  Globe2,
  GraduationCap,
  Handshake,
  History,
  Info,
  Landmark,
  Layers3,
  Link2,
  Map as MapIcon,
  MapPin,
  MapPinned,
  Microscope,
  Network,
  Newspaper,
  RotateCcw,
  Search,
  SearchCheck,
  Send,
  ShieldCheck,
  Upload,
  Users,
  X,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import PortalHeader from "./PortalHeader";
import { OneMapModule } from "./topic-modules/OneMapModule";
import { PolicyModule } from "./topic-modules/PolicyModule";
import { ServiceModule } from "./topic-modules/ServiceModule";
import "./technology-topic-service.css";

type ModuleId =
  | "panorama"
  | "frontier"
  | "enterprise"
  | "research"
  | "talent"
  | "service"
  | "policy"
  | "one-map"
  | "reports"
  | "platform"
  | "search";

type SubModule = { id: string; label: string };
type ModuleDefinition = {
  id: ModuleId;
  label: string;
  description: string;
  icon: LucideIcon;
  subs: SubModule[];
};

const industries = [
  "合成生物",
  "区块链",
  "细胞与基因",
  "空天技术",
  "脑科学与类脑智能",
  "深地深海",
  "可见光通信与光计算",
  "量子信息",
] as const;

type Industry = (typeof industries)[number];

const moduleDefinitions: ModuleDefinition[] = [
  {
    id: "panorama",
    label: "专题全景",
    description: "从产业链、产业动态与整体概况理解当前专题。",
    icon: Network,
    subs: [
      { id: "chain", label: "产业链全景" },
      { id: "news", label: "产业资讯" },
      { id: "overview", label: "产业整体概况" },
    ],
  },
  {
    id: "frontier",
    label: "科技前沿",
    description: "沿技术链查看论文、专利与深圳技术布局。",
    icon: Atom,
    subs: [
      { id: "tech-chain", label: "未来产业技术链全景" },
      { id: "tech-overview", label: "未来产业总体技术概况" },
      { id: "shenzhen-tech", label: "深圳技术链现状" },
    ],
  },
  {
    id: "enterprise",
    label: "企业发展",
    description: "观察企业规模、产业链位置与深圳企业分布。",
    icon: Building2,
    subs: [
      { id: "enterprise-overview", label: "企业整体概况" },
      { id: "enterprise-map", label: "重点企业全景图" },
      { id: "star-enterprise", label: "明星企业介绍" },
      { id: "shenzhen-enterprise", label: "深圳企业介绍" },
    ],
  },
  {
    id: "research",
    label: "科研力量",
    description: "呈现科研机构空间分布、领域布局与评价结构。",
    icon: Microscope,
    subs: [
      { id: "research-overview", label: "全球科研机构概况" },
      { id: "leading-research", label: "专题产业领先科研机构" },
      { id: "shenzhen-research", label: "深圳科研机构介绍" },
    ],
  },
  {
    id: "talent",
    label: "领军人才",
    description: "按区域、产业链和技术链查看人才结构。",
    icon: Users,
    subs: [
      { id: "talent-map", label: "重点人才分布" },
      { id: "talent-domain", label: "人才领域分布" },
      { id: "academic-talent", label: "学术人才" },
      { id: "industry-talent", label: "产业人才" },
      { id: "talent-profile", label: "领军人才介绍" },
      { id: "shenzhen-talent", label: "深圳人才介绍" },
    ],
  },
  {
    id: "service",
    label: "专题服务",
    description: "分析产业服务机构的类型、区域与技术能力。",
    icon: Handshake,
    subs: [
      { id: "service-overview", label: "全球服务机构概况" },
      { id: "service-industry", label: "服务机构产业分布" },
      { id: "service-region", label: "服务机构区域分布" },
      { id: "service-capability", label: "服务机构技术能力" },
      { id: "shenzhen-service", label: "深圳产业服务介绍" },
    ],
  },
  {
    id: "policy",
    label: "政策扶持",
    description: "从政策数量、覆盖范围和动态追踪扶持情况。",
    icon: Landmark,
    subs: [
      { id: "policy-overview", label: "政策概况统计" },
      { id: "policy-map", label: "政策地图" },
      { id: "policy-coverage", label: "政策产业覆盖" },
      { id: "policy-ranking", label: "政策力度排名" },
      { id: "policy-news", label: "最新政策动态" },
      { id: "shenzhen-policy", label: "深圳政策对比" },
    ],
  },
  {
    id: "one-map",
    label: "专题一张图",
    description: "以深圳空间分布和行政区指标辅助专题研判。",
    icon: MapPinned,
    subs: [
      { id: "map-statistics", label: "专题产业相关统计" },
      { id: "map-indicators", label: "专题产业相关指标" },
      { id: "map-tools", label: "地图分析工具" },
    ],
  },
  {
    id: "reports",
    label: "专题研究报告",
    description: "按产业、细分领域、时间范围与机构筛选并查看研究报告。",
    icon: FileText,
    subs: [
      { id: "report-catalog", label: "产研报告目录" },
      { id: "report-view", label: "产研报告查看保存" },
    ],
  },
  {
    id: "platform",
    label: "平台介绍",
    description: "了解平台定位、数据情况、公告与反馈渠道。",
    icon: Info,
    subs: [
      { id: "platform-position", label: "平台定位页面" },
      { id: "platform-data", label: "数据情况介绍" },
      { id: "platform-notice", label: "平台通知公告" },
      { id: "platform-feedback", label: "问题咨询反馈" },
    ],
  },
  {
    id: "search",
    label: "全文检索",
    description: "使用模糊或关联搜索跨模块定位信息。",
    icon: FileSearch2,
    subs: [
      { id: "portal-search", label: "门户全文检索查询" },
      { id: "search-results", label: "检索结果展示" },
    ],
  },
];

const moduleById = new globalThis.Map<ModuleId, ModuleDefinition>(moduleDefinitions.map((item) => [item.id, item]));

type TopicRoute = { module: ModuleId; sub: string; industry: Industry };

const defaultTopicRoute: TopicRoute = { module: "panorama", sub: "chain", industry: "合成生物" };

function parseTopicRoute(): TopicRoute {
  const url = new URL(window.location.href);
  const moduleParam = url.searchParams.get("module") as ModuleId | null;
  const module = moduleParam && moduleById.has(moduleParam) ? moduleParam : defaultTopicRoute.module;
  const definition = moduleById.get(module) ?? moduleDefinitions[0];
  const subParam = url.searchParams.get("sub");
  const sub = subParam && definition.subs.some((item) => item.id === subParam) ? subParam : definition.subs[0].id;
  const industryParam = url.searchParams.get("industry") as Industry | null;
  const industry = industryParam && industries.includes(industryParam) ? industryParam : defaultTopicRoute.industry;
  return { module, sub, industry };
}

function buildTopicUrl(route: TopicRoute) {
  const url = new URL(window.location.href);
  url.searchParams.set("module", route.module);
  url.searchParams.set("sub", route.sub);
  url.searchParams.set("industry", route.industry);
  return url;
}

function preferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

type FocusableElement = HTMLElement | SVGElement;
type DialogState = { title: string; label?: string; body: ReactNode; returnFocus?: FocusableElement | null };

function DemoBadge({ children = "演示数据" }: { children?: ReactNode }) {
  return <span className="tp-demo-badge"><CircleAlert size={13} aria-hidden="true" />{children}</span>;
}

function Panel({ title, description, action, className = "", children }: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return <section className={`tp-panel ${className}`.trim()}>
    <header className="tp-panel-header">
      <div><h3>{title}</h3>{description && <p>{description}</p>}</div>
      {action}
    </header>
    <div className="tp-panel-body">{children}</div>
  </section>;
}

function MetricStrip({ items }: { items: { label: string; value: string; note: string; icon: LucideIcon }[] }) {
  return <dl className="tp-metric-strip">
    {items.map((item) => {
      const Icon = item.icon;
      return <div key={item.label}>
        <span className="tp-metric-icon"><Icon size={19} aria-hidden="true" /></span>
        <dt>{item.label}</dt>
        <dd>{item.value}</dd>
        <small>{item.note}</small>
      </div>;
    })}
  </dl>;
}

function TrendFigure({ label, values = [32, 40, 47, 59, 68, 81], color = "#1769ff" }: {
  label: string;
  values?: number[];
  color?: string;
}) {
  const width = 620;
  const height = 190;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const spread = Math.max(max - min, 1);
  const points = values.map((value, index) => ({
    x: 38 + index * ((width - 70) / Math.max(values.length - 1, 1)),
    y: 18 + (1 - (value - min) / spread) * 128,
  }));
  const line = points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  const area = `${line} L${points.at(-1)?.x ?? 0},155 L${points[0]?.x ?? 0},155 Z`;
  const years = ["2020", "2021", "2022", "2023", "2024", "2025"].slice(0, values.length);
  return <figure className="tp-trend-figure">
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${label}：${years.map((year, index) => `${year}年${values[index]}`).join("，")}；演示数据`}>
      {[18, 52, 86, 120, 154].map((y) => <line x1="38" x2="590" y1={y} y2={y} key={y} />)}
      <path className="tp-trend-area" d={area} style={{ color }} />
      <path className="tp-trend-line" d={line} style={{ color }} />
      {points.map((point, index) => <circle cx={point.x} cy={point.y} r="4" style={{ color }} key={`${point.x}-${index}`} />)}
      {years.map((year, index) => <text x={points[index]?.x} y="180" textAnchor="middle" key={year}>{year}</text>)}
    </svg>
    <figcaption><span>{label}</span><DemoBadge /></figcaption>
  </figure>;
}

function BarBreakdown({ items, suffix = "%", domainMax }: { items: { label: string; value: number }[]; suffix?: string; domainMax?: number }) {
  const max = domainMax ?? (suffix === "%" ? 100 : Math.max(...items.map((item) => item.value), 1));
  return <div className="tp-bar-breakdown">
    {items.map((item) => <div className="tp-bar-row" key={item.label}>
      <span>{item.label}</span>
      <div><i style={{ "--tp-bar-width": `${Math.min(100, item.value / max * 100)}%` } as CSSProperties} /></div>
      <strong>{item.value}{suffix}</strong>
    </div>)}
  </div>;
}

function WorldMap({ scope = "全球", label = "区域分布", pins = ["北美", "欧洲", "东亚", "华南"] }: {
  scope?: string;
  label?: string;
  pins?: string[];
}) {
  const positions = [[23, 38], [48, 34], [73, 45], [78, 59]];
  return <figure className="tp-world-map">
    <div className="tp-map-canvas">
      <img src="./assets/thinktank-world-map.svg" alt="" />
      {pins.map((pin, index) => <span className="tp-map-pin" style={{ left: `${positions[index % positions.length][0]}%`, top: `${positions[index % positions.length][1]}%` }} key={pin}><i /><b>{pin}</b></span>)}
    </div>
    <figcaption><span>{scope} · {label}</span><small>位置与密度均为演示示意</small></figcaption>
  </figure>;
}

function RankPreview({ title, kind = "机构", count = 5 }: { title: string; kind?: string; count?: number }) {
  const sampleNames: Record<string, string[]> = {
    机构: ["湾区未来技术研究院", "前沿工程联合实验室", "产业技术协同创新中心", "城市创新技术中心", "开放科学研究中心", "先进技术转化研究院", "工程验证与测试中心", "未来产业观察中心"],
    科研机构: ["前沿科学联合实验室", "先进工程技术研究院", "湾区交叉科学中心", "未来技术创新中心", "产业共性技术实验室", "应用科学研究中心", "工程转化联合中心", "开放研究基础设施中心"],
    服务机构: ["湾区成果转化服务中心", "未来产业公共技术平台", "科技金融协同服务中心", "知识产权运营服务中心", "中试验证公共服务平台", "产业创新孵化中心", "检验检测技术中心", "科技信息咨询中心"],
    学术人才: ["林岚 · 交叉学科研究", "陈启 · 前沿理论研究", "周宁 · 核心技术研究", "许清 · 工程科学研究", "赵辰 · 数据方法研究", "苏研 · 材料技术研究", "梁青 · 系统技术研究", "何川 · 应用基础研究"],
    产业人才: ["顾远 · 技术战略", "沈嘉 · 产品研发", "唐逸 · 工程转化", "陆川 · 产业运营", "孟宁 · 质量体系", "叶舟 · 场景应用", "韩青 · 技术服务", "季衡 · 生态合作"],
    地区: ["广东省", "北京市", "上海市", "江苏省", "浙江省", "湖北省", "四川省", "安徽省"],
  };
  const names = sampleNames[kind] ?? sampleNames.机构;
  return <div className="tp-rank-preview">
    <header><strong>{title}</strong><DemoBadge>演示排序 · 无正式评价口径</DemoBadge></header>
    <ol>
      {Array.from({ length: count }, (_, index) => <li key={index}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <div><strong>{names[index % names.length]}{kind === "地区" ? "（演示样本）" : "（虚构样例）"}</strong><small>{kind === "地区" ? "政策数量、覆盖范围与连续性综合示意" : "名称、类型、领域与成果字段展示"}</small></div>
        <b>{92 - index * 7}<small>示意值</small></b>
      </li>)}
    </ol>
  </div>;
}

function TopicDialog({ dialog, onClose }: { dialog: DialogState; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = dialog.returnFocus ?? document.activeElement as FocusableElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])") ?? [])
        .filter((element) => !element.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.requestAnimationFrame(() => previousFocus?.focus());
    };
  }, [dialog.returnFocus, onClose]);

  return <div className="tp-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
    <section ref={dialogRef} className="tp-dialog" role="dialog" aria-modal="true" aria-labelledby="tp-dialog-title">
      <header>
        <div>{dialog.label && <span>{dialog.label}</span>}<h2 id="tp-dialog-title">{dialog.title}</h2></div>
        <button ref={closeRef} type="button" aria-label="关闭弹窗" onClick={onClose}><X size={20} /></button>
      </header>
      <div className="tp-dialog-content">{dialog.body}</div>
    </section>
  </div>;
}

function SourceLink({ href, children = "查看原始报道" }: { href?: string; children?: ReactNode }) {
  if (!href) return <span className="tp-source-link is-disabled" aria-disabled="true">暂无原文链接</span>;
  return <a className="tp-source-link" href={href} target="_blank" rel="noreferrer">{children}<ExternalLink size={14} aria-hidden="true" /></a>;
}

type ChainNodeDefinition = { name: string; note: string };
type ChainStageData = [ChainNodeDefinition[], ChainNodeDefinition[], ChainNodeDefinition[]];
type ChainCompany = { name: string; region: string; type: "产业企业" | "科研机构" | "产业服务机构" };
type RegionScope = "global" | "national";
type RegionDatum = { name: string; total: number; enterprises: number; institutions: number; x: number; y: number };
type PanoramaProfile = {
  introduction: string;
  boundary: string;
  stage: string;
  shenzhen: string;
  enterpriseCount: number;
  institutionCount: number;
  chain: ChainStageData;
  companies: [string, string, string];
  news: [string, string, string, string];
  globalTotals: [number, number, number, number, number];
  nationalTotals: [number, number, number, number, number];
};

const node = (name: string, note: string): ChainNodeDefinition => ({ name, note });

const panoramaProfiles: Record<Industry, PanoramaProfile> = {
  合成生物: {
    introduction: "合成生物以工程化方法设计、改造生物系统，连接基因设计、底盘细胞、发酵放大与产品制造，是生物制造由实验室走向规模化生产的关键技术路径。",
    boundary: "覆盖生物基原料、设计与编辑工具、底盘细胞构建、发酵工程，以及材料、医药、食品和农业应用。",
    stage: "由技术验证向中试放大与多场景商业化并行推进，工艺稳定性、成本控制和质量体系是主要衔接环节。",
    shenzhen: "演示口径下，深圳侧重基础设施、交叉科研、中试验证与产业孵化的协同布局。",
    enterpriseCount: 128, institutionCount: 46,
    chain: [
      [node("生物基原料", "碳源、氮源与可再生原料"), node("基因合成与测序", "DNA设计、合成与检测"), node("发酵与检测装备", "高通量筛选与过程监测")],
      [node("底盘细胞构建", "细胞工厂设计与适配"), node("基因编辑", "通路设计与精准改造"), node("发酵工艺优化", "参数控制与中试放大")],
      [node("生物基材料", "聚合物与功能材料"), node("医药健康产品", "原料药与生物活性成分"), node("食品与农业", "替代蛋白与绿色投入品")],
    ],
    companies: ["深湾生物制造有限公司", "鹏城底盘细胞技术中心", "湾区绿色生物材料研究院"],
    news: ["合成生物中试验证平台完成首批工艺能力测试", "生物制造关键酶制剂联合攻关项目启动", "生物基材料应用供需对接活动在深圳举行", "国际合成生物标准协作网络发布阶段成果"],
    globalTotals: [38, 24, 10, 8, 7], nationalTotals: [36, 22, 18, 16, 12],
  },
  区块链: {
    introduction: "区块链以分布式账本、密码学和共识机制构建多方可信协作网络，产业链从底层基础设施延伸至智能合约、跨链服务及数据要素应用。",
    boundary: "覆盖密码算法、分布式存储、底层链平台、智能合约、跨链互操作，以及金融、政务、版权和供应链应用。",
    stage: "由单一链上存证转向跨主体协同和数据可信流通，安全合规、性能与互操作能力成为规模应用重点。",
    shenzhen: "演示口径下，深圳形成金融科技、数据要素与供应链场景牵引的应用验证布局。",
    enterpriseCount: 164, institutionCount: 38,
    chain: [
      [node("密码算法", "签名、哈希与隐私保护"), node("分布式存储", "多节点数据与容灾"), node("芯片与基础设施", "可信执行与算力支撑")],
      [node("底层链平台", "共识、账本与节点管理"), node("智能合约与中间件", "业务规则与开发工具"), node("跨链与可信计算", "链间协作与隐私计算")],
      [node("供应链金融", "贸易背景与资产协同"), node("政务与数据要素", "可信共享与授权流通"), node("数字版权服务", "确权、存证与交易")],
    ],
    companies: ["前海可信数据科技有限公司", "湾区分布式技术研究院", "鹏城数据要素服务中心"],
    news: ["可信数据空间试点完成首轮跨主体联调", "区块链与隐私计算联合实验平台开放测试", "供应链协同应用发布新一批场景清单", "跨链互操作技术规范进入验证阶段"],
    globalTotals: [42, 28, 9, 8, 13], nationalTotals: [48, 31, 27, 19, 16],
  },
  细胞与基因: {
    introduction: "细胞与基因产业围绕细胞制备、基因递送与编辑建立研发和生产体系，连接基础研究、临床转化、规模制备及全流程质量控制。",
    boundary: "覆盖细胞样本、载体、测序设备、培养试剂、细胞制备、基因编辑、质控中试和治疗应用。",
    stage: "处于临床验证与生产体系建设并进阶段，递送效率、制备一致性、长期安全性和监管合规是核心环节。",
    shenzhen: "演示口径下，深圳侧重测序能力、临床资源、细胞制备平台与转化医学协同。",
    enterpriseCount: 118, institutionCount: 52,
    chain: [
      [node("细胞样本与载体", "样本库、病毒与非病毒载体"), node("基因测序设备", "测序、分析与诊断工具"), node("培养基与试剂", "细胞扩增与检测耗材")],
      [node("细胞制备", "分选、扩增与自动化生产"), node("基因递送与编辑", "靶点设计与递送系统"), node("质控与中试", "效力、安全与一致性评价")],
      [node("肿瘤治疗", "免疫细胞与联合疗法"), node("遗传病治疗", "基因补偿与精准编辑"), node("再生医学", "组织修复与功能重建")],
    ],
    companies: ["湾区细胞制备技术有限公司", "鹏城基因递送研究中心", "深科转化医学平台"],
    news: ["细胞制备公共平台启动自动化工艺验证", "基因递送材料联合攻关项目发布阶段数据", "转化医学协作网络新增临床研究节点", "细胞产品质量评价方法开展多中心验证"],
    globalTotals: [32, 29, 14, 11, 9], nationalTotals: [28, 24, 22, 15, 13],
  },
  空天技术: {
    introduction: "空天技术涵盖航天器、运载系统、测控网络及空间信息服务，通过先进材料、核心载荷和星座运营连接装备研制与规模化应用。",
    boundary: "覆盖材料元器件、遥感载荷、测控设备、卫星与火箭研制、星座运营，以及通信、遥感和导航服务。",
    stage: "由单星任务向星座化、低成本和服务化演进，批量制造、在轨协同与数据产品化成为产业衔接重点。",
    shenzhen: "演示口径下，深圳侧重卫星制造、空间信息、通信终端及海洋遥感应用协同。",
    enterpriseCount: 142, institutionCount: 44,
    chain: [
      [node("先进材料与元器件", "轻量材料、芯片与电源"), node("遥感载荷", "光学、雷达与数据采集"), node("测控与地面设备", "站网、终端与任务控制")],
      [node("卫星研制", "平台、载荷与总装测试"), node("火箭与发射服务", "运载、发射与任务保障"), node("星座运营与数据处理", "在轨管理与数据生产")],
      [node("卫星通信", "宽带连接与专网服务"), node("遥感应用", "城市、海洋与农业监测"), node("导航与时空服务", "定位、授时与增强服务")],
    ],
    companies: ["湾区商业航天系统有限公司", "鹏城空间信息研究院", "深空测控技术中心"],
    news: ["商业卫星批量测试平台完成系统联调", "空天信息应用场景清单面向产业开放", "遥感数据公共服务能力启动试运行", "星座任务协同技术完成阶段性验证"],
    globalTotals: [35, 31, 12, 8, 10], nationalTotals: [32, 29, 21, 18, 15],
  },
  脑科学与类脑智能: {
    introduction: "脑科学与类脑智能连接神经机制研究、脑机交互、类脑芯片和智能算法，兼具生命科学探索、医疗康复与新型计算范式属性。",
    boundary: "覆盖神经影像、脑机接口器件、神经数据、脑机系统、类脑芯片算法，以及医疗、交互和认知评估应用。",
    stage: "基础机制研究与工程原型并行发展，信号稳定性、长期安全、算法泛化和伦理治理是转化重点。",
    shenzhen: "演示口径下，深圳侧重交叉科研、医疗器械、脑机接口工程和类脑计算协同。",
    enterpriseCount: 96, institutionCount: 61,
    chain: [
      [node("神经影像设备", "成像、刺激与同步采集"), node("脑机接口器件", "电极、传感与低功耗芯片"), node("神经数据与模型", "多模态数据与动物模型")],
      [node("神经机制研究", "感知、认知与运动机制"), node("脑机交互系统", "信号解码与闭环调控"), node("类脑芯片与算法", "脉冲计算与神经形态系统")],
      [node("医疗康复", "辅助诊疗与功能恢复"), node("智能交互", "意图识别与人机协作"), node("教育与认知评估", "学习状态与认知测量")],
    ],
    companies: ["鹏城脑机工程技术有限公司", "湾区神经计算研究中心", "深科智能康复联合实验室"],
    news: ["脑机接口工程验证平台开放首批测试能力", "类脑芯片联合实验室完成原型系统评测", "神经数据治理与共享规范启动讨论", "智能康复场景完成新一轮临床工程联调"],
    globalTotals: [26, 25, 15, 13, 12], nationalTotals: [24, 23, 21, 14, 12],
  },
  深地深海: {
    introduction: "深地深海产业面向极端环境探测、资源认知和工程作业，连接耐压材料、传感装备、作业系统与地质海洋数据服务。",
    boundary: "覆盖耐压材料、传感器、探测装备、作业系统、勘探工程、样品分析，以及资源、灾害和环境服务。",
    stage: "由单设备试验向系统化长期作业演进，可靠性、能源供给、通信导航和多源数据融合是关键。",
    shenzhen: "演示口径下，深圳侧重海洋装备、智能感知、海上试验与数据应用协同。",
    enterpriseCount: 87, institutionCount: 49,
    chain: [
      [node("耐压材料与传感器", "密封、耐腐蚀与环境感知"), node("探测装备", "声学、地震与取样设备"), node("海洋与地质数据", "基础调查与数据底座")],
      [node("深海作业系统", "潜航、机器人与水下作业"), node("深地勘探工程", "钻探、成像与原位测试"), node("样品与数据分析", "实验分析与多源融合")],
      [node("资源勘探", "矿产、能源与生物资源"), node("灾害监测", "地震、滑坡与海啸预警"), node("环境与工程服务", "生态监测与海工保障")],
    ],
    companies: ["南海智能装备有限公司", "鹏城深海技术研究院", "湾区地质数据中心"],
    news: ["深海装备海试基地完成新一轮系统测试", "极端环境传感器联合攻关项目启动", "海洋地质数据服务平台更新专题数据集", "水下机器人协同作业完成场景验证"],
    globalTotals: [22, 18, 12, 9, 8], nationalTotals: [20, 18, 17, 14, 11],
  },
  可见光通信与光计算: {
    introduction: "可见光通信与光计算利用光源、探测器和光学器件承载信息传输与计算，连接核心光电器件、模组芯片、系统算法及场景应用。",
    boundary: "覆盖光源探测器、光学材料、驱动封装、通信模组、光计算芯片、系统算法和行业应用。",
    stage: "由实验原型向专用场景部署推进，器件一致性、链路稳定性、软硬件协同和规模制造是核心。",
    shenzhen: "演示口径下，深圳依托光电器件、通信终端和制造能力探索室内定位、车联网与算力加速应用。",
    enterpriseCount: 105, institutionCount: 33,
    chain: [
      [node("光源与探测器", "LED、激光器与光电探测"), node("光学材料与器件", "波导、调制与耦合器件"), node("驱动与封装设备", "高速驱动、测试与封装")],
      [node("可见光通信模组", "收发模组与链路控制"), node("光计算芯片", "光矩阵与片上计算"), node("系统集成与算法", "编码、调度与软硬协同")],
      [node("室内通信与定位", "高密接入与厘米级定位"), node("数据中心加速", "推理、交换与计算卸载"), node("车联网与工业互联", "安全通信与低时延控制")],
    ],
    companies: ["深光通信技术有限公司", "湾区光计算研究中心", "鹏城光电系统联合实验室"],
    news: ["可见光通信模组完成复杂室内环境联测", "光计算芯片原型开放应用适配验证", "光电器件中试平台新增高速测试能力", "车联网光通信场景启动多方联合测试"],
    globalTotals: [28, 19, 12, 7, 14], nationalTotals: [30, 22, 18, 16, 13],
  },
  量子信息: {
    introduction: "量子信息利用量子叠加、纠缠和精密测量实现新型计算、通信与传感能力，产业链高度依赖专用器件、控制系统与工程环境。",
    boundary: "覆盖低温真空、激光微波、量子材料芯片、计算、通信、精密测量及科研和行业服务。",
    stage: "处于核心器件迭代、系统扩展和应用探索并行阶段，误差控制、系统稳定、工程成本和标准验证是重点。",
    shenzhen: "演示口径下，深圳侧重量子器件、精密测量、通信安全和交叉科研平台布局。",
    enterpriseCount: 73, institutionCount: 58,
    chain: [
      [node("低温与真空设备", "制冷、真空与环境隔离"), node("激光与微波器件", "操控、读出与频率基准"), node("量子材料与芯片", "量子比特与集成器件")],
      [node("量子计算", "处理器、控制与软件栈"), node("量子通信", "密钥分发与量子网络"), node("量子精密测量", "时间、磁场与惯性测量")],
      [node("科研计算服务", "算法验证与云端实验"), node("安全通信", "专网与关键行业防护"), node("传感与导航", "精密探测与自主定位")],
    ],
    companies: ["鹏城量子器件有限公司", "湾区量子信息研究中心", "深科精密测量联合实验室"],
    news: ["量子器件公共测试平台发布首批能力目录", "量子精密测量联合项目完成阶段评审", "量子通信应用验证网新增试验节点", "量子计算软件工具链开放适配测试"],
    globalTotals: [21, 24, 16, 12, 10], nationalTotals: [18, 24, 20, 13, 11],
  },
};

const chainSupplements: Record<Industry, ChainStageData> = {
  合成生物: [
    [node("酶制剂与催化元件", "酶库筛选与定向进化"), node("自动化实验平台", "设计—构建—测试闭环")],
    [node("代谢通路设计", "模型预测与通量优化"), node("分离纯化", "提取、精制与质量控制")],
    [node("生物能源与化学品", "燃料与平台化合物"), node("环境治理", "生物修复与资源循环")],
  ],
  区块链: [
    [node("身份与密钥服务", "身份认证与密钥管理"), node("安全审计工具", "合约检测与风险监测")],
    [node("联盟链治理", "成员准入与治理规则"), node("区块链即服务", "节点托管与开发运维")],
    [node("跨境贸易", "单证协同与贸易核验"), node("可信存证", "电子证据与过程留痕")],
  ],
  细胞与基因: [
    [node("质粒与病毒载体", "载体设计、生产与检测"), node("自动化制备设备", "封闭式培养与灌装设备")],
    [node("细胞扩增与培养", "规模培养与过程控制"), node("冷链与放行", "储运、检测与批次放行")],
    [node("伴随诊断", "分型检测与疗效评估"), node("细胞存储服务", "采集、冻存与质量追踪")],
  ],
  空天技术: [
    [node("推进与能源系统", "推进、电源与热控部件"), node("仿真测试设备", "环境试验与任务仿真")],
    [node("总装集成", "系统装配与整星测试"), node("在轨测控", "遥测、遥控与任务管理")],
    [node("气象与海洋服务", "环境监测与数据产品"), node("应急保障", "灾害评估与通信保障")],
  ],
  脑科学与类脑智能: [
    [node("植入电极材料", "柔性电极与生物相容封装"), node("刺激与记录设备", "神经刺激与高通量记录")],
    [node("神经信号解码", "特征提取与意图识别"), node("闭环调控平台", "实时反馈与参数控制")],
    [node("辅助沟通", "语言与动作意图输出"), node("智能假肢", "神经控制与感觉反馈")],
  ],
  深地深海: [
    [node("水下通信", "声学、光学与组合通信"), node("能源与动力系统", "水下供能与推进装置")],
    [node("水下导航定位", "惯导、声学与协同定位"), node("长期观测平台", "驻留观测与远程运维")],
    [node("海洋牧场", "生态监测与智能养殖"), node("海工运维", "巡检、维修与安全保障")],
  ],
  可见光通信与光计算: [
    [node("高速调制驱动", "调制器与高速驱动电路"), node("光学封装测试", "耦合、封装与性能检测")],
    [node("信道建模与编码", "光信道估计与编码调制"), node("光电协同系统", "光学计算与电子控制协同")],
    [node("低空通信", "无人系统与空地链路"), node("医疗与安全照明", "照明通信与安全感知")],
  ],
  量子信息: [
    [node("单光子探测器", "单光子读出与噪声抑制"), node("控制电子学", "高精度时序与信号控制")],
    [node("量子纠错与控制", "误差抑制与量子门控制"), node("量子网络节点", "纠缠分发与节点协同")],
    [node("金融安全", "密钥服务与安全通信"), node("地质与医学探测", "弱信号与高灵敏测量")],
  ],
};

const chainLaneMeta = [
  { label: "上游基础", role: "要素与支撑", icon: Database, className: "is-upstream" },
  { label: "中游核心", role: "研发与工程化", icon: Activity, className: "is-midstream" },
  { label: "下游应用", role: "产品与场景", icon: BriefcaseBusiness, className: "is-downstream" },
];

const chainLaneGroups = [
  ["基础原料", "工具与设备", "装备设施", "关键资源", "测试标准"],
  ["设计构建", "核心技术", "工程放大", "系统集成", "质量控制"],
  ["产品制造", "行业应用", "产业服务", "终端市场", "场景拓展"],
];

const chainPathRelations = [
  { inbound: "基础要素协同", outbound: "产品转化", upstream: [0, 1], downstream: [0] },
  { inbound: "工具能力支撑", outbound: "行业应用", upstream: [1, 2], downstream: [0, 1] },
  { inbound: "装备设施依赖", outbound: "规模交付", upstream: [0, 2], downstream: [2] },
  { inbound: "关键资源输入", outbound: "服务转化", upstream: [3, 4], downstream: [3] },
  { inbound: "测试标准保障", outbound: "场景落地", upstream: [2, 4], downstream: [3, 4] },
];

function getIndustryChain(industry: Industry, profile: PanoramaProfile): ChainStageData {
  return profile.chain.map((lane, laneIndex) => [...lane, ...chainSupplements[industry][laneIndex]]) as ChainStageData;
}

function getNodeCompanies(industry: Industry, profile: PanoramaProfile, item: ChainNodeDefinition, nodeIndex: number): ChainCompany[] {
  return [
    { name: profile.companies[nodeIndex % profile.companies.length], region: "深圳", type: nodeIndex % 2 ? "科研机构" : "产业企业" },
    { name: `${item.name}联合实验室（演示）`, region: "粤港澳大湾区", type: "科研机构" },
    { name: `${industry}${item.name}协同中心（演示）`, region: "深圳", type: "产业服务机构" },
  ];
}

const regionMeta: Record<RegionScope, { name: string; x: number; y: number }[]> = {
  global: [
    { name: "中国", x: 75, y: 48 }, { name: "美国", x: 22, y: 41 }, { name: "德国", x: 50, y: 35 },
    { name: "英国", x: 45, y: 31 }, { name: "日本", x: 85, y: 47 },
  ],
  national: [
    { name: "深圳", x: 53, y: 70 }, { name: "北京", x: 54, y: 25 }, { name: "上海", x: 69, y: 49 },
    { name: "江苏", x: 65, y: 41 }, { name: "浙江", x: 69, y: 58 },
  ],
};

function createRegionData(profile: PanoramaProfile, scope: RegionScope): RegionDatum[] {
  const totals = scope === "global" ? profile.globalTotals : profile.nationalTotals;
  return regionMeta[scope].map((item, index) => {
    const total = totals[index];
    const enterprises = Math.round(total * .72);
    return { ...item, total, enterprises, institutions: total - enterprises };
  });
}

function LegacyIndustryChain({ industry, openDialog }: { industry: Industry; openDialog: (dialog: DialogState) => void }) {
  const profile = panoramaProfiles[industry];
  const chain = getIndustryChain(industry, profile);
  const rowCount = Math.max(...chain.map((lane) => lane.length));
  const totalNodeCount = chain.reduce((sum, lane) => sum + lane.length, 0);
  const [activeMiddleIndex, setActiveMiddleIndex] = useState(0);
  const activeRelation = chainPathRelations[activeMiddleIndex % chainPathRelations.length];
  const activeMiddleNode = chain[1][activeMiddleIndex];
  useEffect(() => setActiveMiddleIndex(0), [industry]);
  const getNodeRelations = (laneIndex: number, nodeIndex: number) => {
    if (laneIndex === 1) {
      const relation = chainPathRelations[nodeIndex % chainPathRelations.length];
      return {
        previousNodes: relation.upstream.map((index) => chain[0][index]).filter(Boolean),
        nextNodes: relation.downstream.map((index) => chain[2][index]).filter(Boolean),
      };
    }
    if (laneIndex === 0) {
      return {
        previousNodes: [] as ChainNodeDefinition[],
        nextNodes: chainPathRelations.flatMap((relation, index) => relation.upstream.includes(nodeIndex) ? [chain[1][index]] : []).filter(Boolean),
      };
    }
    return {
      previousNodes: chainPathRelations.flatMap((relation, index) => relation.downstream.includes(nodeIndex) ? [chain[1][index]] : []).filter(Boolean),
      nextNodes: [] as ChainNodeDefinition[],
    };
  };
  const openNode = (event: ReactMouseEvent<HTMLButtonElement>, laneIndex: number, item: ChainNodeDefinition, nodeIndex: number) => {
    const { previousNodes, nextNodes } = getNodeRelations(laneIndex, nodeIndex);
    const relation = chainPathRelations[nodeIndex % chainPathRelations.length];
    const companies = getNodeCompanies(industry, profile, item, nodeIndex);
    const group = chainLaneGroups[laneIndex][nodeIndex % chainLaneGroups[laneIndex].length];
    openDialog({
      title: item.name,
      label: `${industry} · ${chainLaneMeta[laneIndex].label}`,
      returnFocus: event.currentTarget,
      body: <div className="tp-dialog-detail tp-chain-dialog-detail">
        <section className="tp-chain-dialog-intro" aria-labelledby="tp-chain-intro-title">
          <h3 id="tp-chain-intro-title">细分产业简介</h3>
          <p>{item.name}属于{industry}产业链的“{group}”环节，重点涉及{item.note}。当前内容用于演示细分产业简介与关联主体的承载方式，正式口径需由产业研究数据审核。</p>
        </section>
        <dl>
          <div><dt>所属环节</dt><dd>{chainLaneMeta[laneIndex].label} · {group}</dd></div>
          <div><dt>主流工艺</dt><dd>{item.note}，以及相关设计、制备、测试与质量控制流程（演示）</dd></div>
          <div><dt>上游依赖</dt><dd>{previousNodes.length ? `${previousNodes.map((nodeItem) => nodeItem.name).join("、")} · ${relation.inbound}` : "基础原料、专业装备与公共能力"}</dd></div>
          <div><dt>下游去向</dt><dd>{nextNodes.length ? `${nextNodes.map((nodeItem) => nodeItem.name).join("、")} · ${relation.outbound}` : "终端客户、行业场景与公共服务"}</dd></div>
          <div><dt>数据来源</dt><dd>产业研究库、企业公开信息与项目资料，当前尚待正式接入</dd></div>
        </dl>
        <h3 className="tp-chain-company-heading">关联企业列表 <small>{companies.length} 家演示主体</small></h3>
        <ul>{companies.map((company) => <li key={company.name}><strong>{company.name}</strong><small>{company.region} · {company.type}</small></li>)}</ul>
        <DemoBadge>名称与关联关系仅用于演示</DemoBadge>
      </div>,
    });
  };
  const renderNode = (item: ChainNodeDefinition | undefined, laneIndex: number, nodeIndex: number) => {
    if (!item) return <span className="tp-chain-node-empty" aria-hidden="true" />;
    const group = chainLaneGroups[laneIndex][nodeIndex % chainLaneGroups[laneIndex].length];
    const companies = getNodeCompanies(industry, profile, item, nodeIndex);
    const { previousNodes, nextNodes } = getNodeRelations(laneIndex, nodeIndex);
    const relationText = `${previousNodes.length ? `上游依赖${previousNodes.map((nodeItem) => nodeItem.name).join("、")}` : "上游基础环节"}；${nextNodes.length ? `下游连接${nextNodes.map((nodeItem) => nodeItem.name).join("、")}` : "下游应用环节"}`;
    const isRelationLinked = laneIndex === 0
      ? activeRelation.upstream.includes(nodeIndex)
      : laneIndex === 1
        ? activeMiddleIndex === nodeIndex
        : activeRelation.downstream.includes(nodeIndex);
    return <button
      className={`tp-chain-node ${chainLaneMeta[laneIndex].className} ${isRelationLinked ? "is-relation-linked" : "is-relation-muted"}`}
      type="button"
      aria-haspopup="dialog"
      aria-current={laneIndex === 1 && activeMiddleIndex === nodeIndex ? "true" : undefined}
      aria-label={`查看细分产业${item.name}的简介与关联企业；${relationText}`}
      onMouseEnter={laneIndex === 1 ? () => setActiveMiddleIndex(nodeIndex) : undefined}
      onFocus={laneIndex === 1 ? () => setActiveMiddleIndex(nodeIndex) : undefined}
      onClick={(event) => openNode(event, laneIndex, item, nodeIndex)}
    >
      <span className="tp-chain-node-meta"><span>{group}</span><small>细分产业</small></span>
      <strong>{item.name}</strong>
      <span className="tp-chain-node-process">关键工艺：{item.note}</span>
      <span className="tp-chain-node-action"><span>查看简介与企业</span><b>{companies.length} 家</b><ChevronRight size={14} aria-hidden="true" /></span>
    </button>;
  };
  const renderRelationBus = (sourceIndices: number[], targetIndices: number[], label: string, ariaLabel: string) => {
    const connectedIndices = [...sourceIndices, ...targetIndices];
    const minIndex = Math.min(...connectedIndices);
    const maxIndex = Math.max(...connectedIndices);
    const getPosition = (index: number) => `${(index + .5) / rowCount * 100}%`;
    return <div
      className="tp-chain-bus"
      role="img"
      aria-label={ariaLabel}
      style={{
        "--tp-bus-left": getPosition(minIndex),
        "--tp-bus-right": `${100 - (maxIndex + .5) / rowCount * 100}%`,
        "--tp-bus-center": getPosition((minIndex + maxIndex) / 2),
      } as CSSProperties}
    >
      {sourceIndices.map((index) => <i className="is-source" style={{ left: getPosition(index) }} aria-hidden="true" key={`source-${index}`} />)}
      {targetIndices.map((index) => <i className="is-target" style={{ left: getPosition(index) }} aria-hidden="true" key={`target-${index}`} />)}
      <span>{label}</span>
    </div>;
  };

  return <Panel title={`${industry}产业链全景`} description="按主流工艺、产业环节与具体依赖关系呈现上下游" action={<DemoBadge>产业链演示</DemoBadge>} className="tp-chain-panel">
    <div className="tp-chain-map-summary">
      <div><span className="tp-chain-summary-icon"><Network size={18} aria-hidden="true" /></span><span><strong>多级依赖关系图</strong><small>多项依赖先汇聚到关系总线，再进入中游核心与下游应用</small></span></div>
      <p><Eye size={15} aria-hidden="true" /><span>点击细分产业查看简介与企业列表</span></p>
    </div>
    <div className="tp-chain-viewport" role="group" aria-label={`${industry}产业链工艺路径图，共${totalNodeCount}个细分产业节点`}>
      <div className="tp-chain-scroll" role="region" aria-label="产业链细分产业路径，可横向滚动查看更多" tabIndex={0}>
        <div className="tp-chain-canvas" style={{ "--tp-chain-path-count": rowCount, minWidth: `${128 + rowCount * 184}px` } as CSSProperties}>
          <aside className="tp-chain-stage-rail" aria-label="产业链环节">
            <div className="tp-chain-rail-heading"><span>产业环节</span><small>聚焦中游查看关系</small></div>
            {chain.map((lane, laneIndex) => {
              const LaneIcon = chainLaneMeta[laneIndex].icon;
              return <div className="tp-chain-stage-rail-group" key={chainLaneMeta[laneIndex].label}>
                <div className={`tp-chain-stage ${chainLaneMeta[laneIndex].className}`}><span><LaneIcon size={17} aria-hidden="true" /></span><div><strong>{chainLaneMeta[laneIndex].label}</strong><small>{chainLaneMeta[laneIndex].role} · {lane.length} 项</small></div></div>
                {laneIndex < 2 && <div className="tp-chain-stage-relation"><span>{laneIndex === 0 ? "依赖输入" : "能力输出"}</span></div>}
              </div>;
            })}
          </aside>
          <div className="tp-chain-graph">
            <header className="tp-chain-focus-heading"><span>当前关系聚焦</span><strong>{activeMiddleNode.name}</strong><small>悬停或键盘聚焦中游节点切换依赖关系</small></header>
            <div className="tp-chain-node-row is-upstream">{chain[0].map((item, index) => <div key={item.name}>{renderNode(item, 0, index)}</div>)}</div>
            {renderRelationBus(
              activeRelation.upstream,
              [activeMiddleIndex],
              `${activeRelation.upstream.length} 项输入 · ${activeRelation.inbound}`,
              `${activeRelation.upstream.map((index) => chain[0][index].name).join("、")}通过${activeRelation.inbound}汇聚至${activeMiddleNode.name}`,
            )}
            <div className="tp-chain-node-row is-midstream">{chain[1].map((item, index) => <div key={item.name}>{renderNode(item, 1, index)}</div>)}</div>
            {renderRelationBus(
              [activeMiddleIndex],
              activeRelation.downstream,
              `${activeRelation.downstream.length} 项输出 · ${activeRelation.outbound}`,
              `${activeMiddleNode.name}通过${activeRelation.outbound}连接${activeRelation.downstream.map((index) => chain[2][index].name).join("、")}`,
            )}
            <div className="tp-chain-node-row is-downstream">{chain[2].map((item, index) => <div key={item.name}>{renderNode(item, 2, index)}</div>)}</div>
          </div>
        </div>
      </div>
    </div>
    <div className="tp-chain-legend"><span><i className="tp-dot-primary" />{totalNodeCount} 个细分产业</span><span><i className="tp-line-sample" />总线汇聚避免多对一交叉线</span><small>固定高度 · 横向滚动查看更多节点 · 关系数据待正式接入</small></div>
  </Panel>;
}

function IndustryChain({ industry, openDialog }: { industry: Industry; openDialog: (dialog: DialogState) => void }) {
  const profile = panoramaProfiles[industry];
  const chain = getIndustryChain(industry, profile);
  const totalNodeCount = chain.reduce((sum, lane) => sum + lane.length, 0);
  const graphWidth = 1480;
  const graphHeight = 560;
  const baseViewWidth = 760;
  const baseViewHeight = 520;
  const nodeWidth = 144;
  const nodeHeight = 96;
  const [graphZoom, setGraphZoom] = useState(1);
  const [graphPan, setGraphPan] = useState({ x: 0, y: 0 });
  const [activeGraphNode, setActiveGraphNode] = useState<string | null>(null);
  const graphDragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    panX: number;
    panY: number;
    scaleX: number;
    scaleY: number;
  } | null>(null);

  useEffect(() => {
    setGraphZoom(1);
    setGraphPan({ x: 0, y: 0 });
    setActiveGraphNode(null);
  }, [industry]);

  const stageLayouts = [
    { cx: 240, cy: 280, r: 220, className: "is-upstream" },
    { cx: 740, cy: 280, r: 220, className: "is-midstream" },
    { cx: 1240, cy: 280, r: 220, className: "is-downstream" },
  ];
  const nodeSlots = [
    [{ x: -70, y: -105 }, { x: 70, y: -105 }, { x: -108, y: 20 }, { x: 108, y: 20 }, { x: 0, y: 130 }],
    [{ x: -70, y: -105 }, { x: 70, y: -105 }, { x: -130, y: 20 }, { x: 130, y: 20 }, { x: 0, y: 130 }],
    [{ x: -70, y: -105 }, { x: 70, y: -105 }, { x: -108, y: 20 }, { x: 108, y: 20 }, { x: 0, y: 130 }],
  ];
  const getNodePosition = (laneIndex: number, nodeIndex: number, count: number) => {
    const layout = stageLayouts[laneIndex];
    if (nodeSlots[laneIndex][nodeIndex]) return { x: layout.cx + nodeSlots[laneIndex][nodeIndex].x, y: layout.cy + nodeSlots[laneIndex][nodeIndex].y };
    const angle = -Math.PI / 2 + nodeIndex / count * Math.PI * 2;
    return { x: layout.cx + Math.cos(angle) * 92, y: layout.cy + Math.sin(angle) * 148 };
  };
  const graphNodes = chain.flatMap((lane, laneIndex) => lane.map((item, nodeIndex) => ({
    key: `${laneIndex}-${nodeIndex}`,
    laneIndex,
    nodeIndex,
    item,
    ...getNodePosition(laneIndex, nodeIndex, lane.length),
  })));
  const graphNodeMap = new Map(graphNodes.map((item) => [item.key, item]));
  const graphEdges = chainPathRelations.flatMap((relation, middleIndex) => [
    ...relation.upstream.map((upstreamIndex) => ({
      key: `up-${upstreamIndex}-${middleIndex}`,
      from: `0-${upstreamIndex}`,
      to: `1-${middleIndex}`,
      label: relation.inbound,
      className: "is-inbound",
    })),
    ...relation.downstream.map((downstreamIndex) => ({
      key: `down-${middleIndex}-${downstreamIndex}`,
      from: `1-${middleIndex}`,
      to: `2-${downstreamIndex}`,
      label: relation.outbound,
      className: "is-outbound",
    })),
  ]);
  const relatedGraphNodes = new Set<string>([activeGraphNode ?? ""]);
  graphEdges.forEach((edge) => {
    if (activeGraphNode && (edge.from === activeGraphNode || edge.to === activeGraphNode)) {
      relatedGraphNodes.add(edge.from);
      relatedGraphNodes.add(edge.to);
    }
  });

  const getNodeRelations = (laneIndex: number, nodeIndex: number) => {
    if (laneIndex === 1) {
      const relation = chainPathRelations[nodeIndex % chainPathRelations.length];
      return {
        previousNodes: relation.upstream.map((index) => chain[0][index]).filter(Boolean),
        nextNodes: relation.downstream.map((index) => chain[2][index]).filter(Boolean),
      };
    }
    if (laneIndex === 0) {
      return {
        previousNodes: [] as ChainNodeDefinition[],
        nextNodes: chainPathRelations.flatMap((relation, index) => relation.upstream.includes(nodeIndex) ? [chain[1][index]] : []).filter(Boolean),
      };
    }
    return {
      previousNodes: chainPathRelations.flatMap((relation, index) => relation.downstream.includes(nodeIndex) ? [chain[1][index]] : []).filter(Boolean),
      nextNodes: [] as ChainNodeDefinition[],
    };
  };
  const openNode = (event: ReactMouseEvent<HTMLButtonElement>, laneIndex: number, item: ChainNodeDefinition, nodeIndex: number) => {
    const { previousNodes, nextNodes } = getNodeRelations(laneIndex, nodeIndex);
    const relation = chainPathRelations[nodeIndex % chainPathRelations.length];
    const companies = getNodeCompanies(industry, profile, item, nodeIndex);
    const group = chainLaneGroups[laneIndex][nodeIndex % chainLaneGroups[laneIndex].length];
    openDialog({
      title: item.name,
      label: `${industry} · ${chainLaneMeta[laneIndex].label}`,
      returnFocus: event.currentTarget,
      body: <div className="tp-dialog-detail tp-chain-dialog-detail">
        <section className="tp-chain-dialog-intro" aria-labelledby="tp-chain-intro-title">
          <h3 id="tp-chain-intro-title">细分产业简介</h3>
          <p>{item.name}属于{industry}产业链的“{group}”环节，重点涉及{item.note}。当前内容用于演示细分产业简介与关联主体的承载方式，正式口径需由产业研究数据审核。</p>
        </section>
        <dl>
          <div><dt>所属环节</dt><dd>{chainLaneMeta[laneIndex].label} · {group}</dd></div>
          <div><dt>主流工艺</dt><dd>{item.note}，以及相关设计、制备、测试与质量控制流程（演示）</dd></div>
          <div><dt>上游依赖</dt><dd>{previousNodes.length ? `${previousNodes.map((nodeItem) => nodeItem.name).join("、")} · ${relation.inbound}` : "基础原料、专业装备与公共能力"}</dd></div>
          <div><dt>下游去向</dt><dd>{nextNodes.length ? `${nextNodes.map((nodeItem) => nodeItem.name).join("、")} · ${relation.outbound}` : "终端客户、行业场景与公共服务"}</dd></div>
          <div><dt>数据来源</dt><dd>产业研究库、企业公开信息与项目资料，当前尚待正式接入</dd></div>
        </dl>
        <h3 className="tp-chain-company-heading">关联企业列表 <small>{companies.length} 家演示主体</small></h3>
        <ul>{companies.map((company) => <li key={company.name}><strong>{company.name}</strong><small>{company.region} · {company.type}</small></li>)}</ul>
        <DemoBadge>名称与关联关系仅用于演示</DemoBadge>
      </div>,
    });
  };
  const getEdgePath = (fromKey: string, toKey: string) => {
    const from = graphNodeMap.get(fromKey);
    const to = graphNodeMap.get(toKey);
    if (!from || !to) return "";
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const xFactor = Math.abs(dx) < .001 ? Number.POSITIVE_INFINITY : nodeWidth / 2 / Math.abs(dx);
    const yFactor = Math.abs(dy) < .001 ? Number.POSITIVE_INFINITY : nodeHeight / 2 / Math.abs(dy);
    const boundaryFactor = Math.min(xFactor, yFactor);
    const startX = from.x + dx * boundaryFactor;
    const startY = from.y + dy * boundaryFactor;
    const endX = to.x - dx * boundaryFactor;
    const endY = to.y - dy * boundaryFactor;
    const bend = Math.max(-18, Math.min(18, dy * .08));
    const controlX1 = startX + (endX - startX) * .42;
    const controlX2 = startX + (endX - startX) * .58;
    return `M ${startX} ${startY} C ${controlX1} ${startY + bend}, ${controlX2} ${endY - bend}, ${endX} ${endY}`;
  };
  const clampPan = (nextPan: { x: number; y: number }, zoom = graphZoom) => {
    const currentViewWidth = baseViewWidth / zoom;
    const currentViewHeight = baseViewHeight / zoom;
    const maxX = Math.max(0, (graphWidth - currentViewWidth) / 2);
    const maxY = Math.max(0, (graphHeight - currentViewHeight) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, nextPan.x)),
      y: Math.max(-maxY, Math.min(maxY, nextPan.y)),
    };
  };
  const updateGraphZoom = (nextZoom: number) => {
    const normalizedZoom = Math.max(.5, Math.min(1.8, Math.round(nextZoom * 100) / 100));
    setGraphZoom(normalizedZoom);
    setGraphPan((current) => clampPan(current, normalizedZoom));
  };
  const handleGraphPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if ((event.target as Element).closest(".tp-chain-network-node")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    graphDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panX: graphPan.x,
      panY: graphPan.y,
      scaleX: baseViewWidth / graphZoom / rect.width,
      scaleY: baseViewHeight / graphZoom / rect.height,
    };
  };
  const handleGraphPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const drag = graphDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setGraphPan(clampPan({
      x: drag.panX - (event.clientX - drag.startX) * drag.scaleX,
      y: drag.panY - (event.clientY - drag.startY) * drag.scaleY,
    }));
  };
  const handleGraphPointerEnd = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (graphDragRef.current?.pointerId === event.pointerId) {
      graphDragRef.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  const viewBoxWidth = baseViewWidth / graphZoom;
  const viewBoxHeight = baseViewHeight / graphZoom;
  const viewBoxX = (graphWidth - viewBoxWidth) / 2 + graphPan.x;
  const viewBoxY = (graphHeight - viewBoxHeight) / 2 + graphPan.y;

  return <Panel title={`${industry}产业链全景`} description="按主流工艺、产业环节与具体依赖关系呈现上下游" action={<DemoBadge>产业链演示</DemoBadge>} className="tp-chain-panel">
    <div className="tp-chain-map-summary">
      <div><span className="tp-chain-summary-icon"><Network size={18} aria-hidden="true" /></span><span><strong>产业链关系网络</strong><small>分组展示上游基础、中游核心与下游应用，箭头表示依赖与转化</small></span></div>
      <p><Eye size={15} aria-hidden="true" /><span>节点展示产业基础信息，点击查看简介与企业列表</span></p>
    </div>
    <div className="tp-chain-network" role="group" aria-label={`${industry}产业链关系网络，共${totalNodeCount}个细分产业节点`}>
      <div className="tp-chain-network-toolbar" role="group" aria-label="关系网络缩放控制">
        <button type="button" aria-label="缩小关系网络" disabled={graphZoom <= .5} onClick={() => updateGraphZoom(graphZoom - .2)}><ZoomOut size={16} /></button>
        <span aria-live="polite">{Math.round(graphZoom * 100)}%</span>
        <button type="button" aria-label="放大关系网络" disabled={graphZoom >= 1.8} onClick={() => updateGraphZoom(graphZoom + .2)}><ZoomIn size={16} /></button>
        <button type="button" aria-label="复位关系网络" onClick={() => { setGraphZoom(1); setGraphPan({ x: 0, y: 0 }); }}><RotateCcw size={15} /></button>
      </div>
      <div className="tp-chain-network-legend" aria-label="产业链颜色图例">
        {chainLaneMeta.map((lane, laneIndex) => <span className={lane.className} key={lane.label}><i />{lane.label}<small>{chain[laneIndex].length}项</small></span>)}
      </div>
      <svg
        className="tp-chain-network-svg"
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`${industry}产业链上中下游节点与依赖关系图`}
        onMouseLeave={() => setActiveGraphNode(null)}
        onPointerDown={handleGraphPointerDown}
        onPointerMove={handleGraphPointerMove}
        onPointerUp={handleGraphPointerEnd}
        onPointerCancel={handleGraphPointerEnd}
      >
        <defs>
          <marker id="tp-chain-network-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 8 4 0 8Z" />
          </marker>
        </defs>
        <g className="tp-chain-network-clusters" aria-hidden="true">
          {stageLayouts.map((layout, laneIndex) => <g className={layout.className} key={layout.className}>
            <circle className="tp-chain-cluster-shape" cx={layout.cx} cy={layout.cy} r={layout.r} />
            <circle cx={layout.cx - 47} cy="52" r="4" />
            <text x={layout.cx - 37} y="56">{chainLaneMeta[laneIndex].label} · {chainLaneMeta[laneIndex].role}</text>
          </g>)}
        </g>
        <g className="tp-chain-network-edges" aria-hidden="true">
          {graphEdges.map((edge) => {
            const isActive = Boolean(activeGraphNode && (edge.from === activeGraphNode || edge.to === activeGraphNode));
            return <path
              className={`${edge.className} ${activeGraphNode ? isActive ? "is-active" : "is-muted" : ""}`}
              d={getEdgePath(edge.from, edge.to)}
              markerEnd="url(#tp-chain-network-arrow)"
              key={edge.key}
            ><title>{edge.label}</title></path>;
          })}
        </g>
        <g className="tp-chain-network-nodes">
          {graphNodes.map((graphNode) => {
            const { previousNodes, nextNodes } = getNodeRelations(graphNode.laneIndex, graphNode.nodeIndex);
            const group = chainLaneGroups[graphNode.laneIndex][graphNode.nodeIndex % chainLaneGroups[graphNode.laneIndex].length];
            const companies = getNodeCompanies(industry, profile, graphNode.item, graphNode.nodeIndex);
            const relationText = `${previousNodes.length ? `上游依赖${previousNodes.map((nodeItem) => nodeItem.name).join("、")}` : "上游基础环节"}；${nextNodes.length ? `下游连接${nextNodes.map((nodeItem) => nodeItem.name).join("、")}` : "下游应用环节"}`;
            const isRelated = !activeGraphNode || relatedGraphNodes.has(graphNode.key);
            return <foreignObject x={graphNode.x - nodeWidth / 2} y={graphNode.y - nodeHeight / 2} width={nodeWidth} height={nodeHeight} key={graphNode.key}>
              <button
                className={`tp-chain-network-node ${chainLaneMeta[graphNode.laneIndex].className} ${activeGraphNode === graphNode.key ? "is-active" : ""} ${isRelated ? "" : "is-muted"}`}
                type="button"
                aria-haspopup="dialog"
                aria-label={`查看细分产业${graphNode.item.name}的简介与关联企业；${relationText}`}
                onMouseEnter={() => setActiveGraphNode(graphNode.key)}
                onFocus={() => setActiveGraphNode(graphNode.key)}
                onBlur={() => setActiveGraphNode(null)}
                onClick={(event) => openNode(event, graphNode.laneIndex, graphNode.item, graphNode.nodeIndex)}
              >
                <span className="tp-chain-network-node-meta"><span>{group}</span><small>细分产业</small></span>
                <strong>{graphNode.item.name}</strong>
                <span className="tp-chain-network-node-process" title={graphNode.item.note}>工艺 · {graphNode.item.note}</span>
                <span className="tp-chain-network-node-footer"><span>关联主体</span><b>{companies.length} 家</b><ChevronRight size={12} aria-hidden="true" /></span>
              </button>
            </foreignObject>;
          })}
        </g>
      </svg>
      <p className="tp-chain-network-hint">按住空白处拖动画布 · 缩小查看全景 · 点击节点查看产业基础信息</p>
    </div>
    <div className="tp-chain-legend"><span><i className="tp-dot-primary" />{totalNodeCount} 个细分产业</span><span><i className="tp-line-sample" />箭头表示工艺依赖与应用转化</span><small>固定高度 · 支持缩放与拖动 · 关系数据待正式接入</small></div>
  </Panel>;
}

function IndustryNews({ industry }: { industry: Industry }) {
  const profile = panoramaProfiles[industry];
  const dates = ["2026-07-18", "2026-05-26", "2026-02-12", "2025-11-08"];
  const regions = ["深圳", "全国", "粤港澳大湾区", "全球"];
  const sources = ["科技主管部门公开信息", "项目申报公开平台", "产业服务机构公开信息", "研究机构公开信息"];
  return <Panel title={`${industry}产业资讯`} description="按事件时间线汇集公开信息；接入真实来源后可追踪至原始报道" action={<DemoBadge>事件内容为演示</DemoBadge>} className="tp-panorama-news-panel">
    <ol className="tp-event-timeline tp-panorama-timeline">
      {profile.news.map((title, index) => <li key={title}>
        <time dateTime={dates[index]}>{dates[index].slice(0, 7)}</time><span className="tp-event-node" aria-hidden="true" />
        <article>
          <div className="tp-news-meta"><span>{regions[index]}</span><small>{sources[index]} · 发布于 {dates[index]}</small></div>
          <h4>{title}</h4>
          <p>围绕{industry}的技术验证、产业协作与应用转化整理事件摘要；正式版本将保留原标题、原文地址与核验时间。</p>
          <footer><small>数据来源：演示样本</small><SourceLink /></footer>
        </article>
      </li>)}
    </ol>
  </Panel>;
}

function RegionDistribution({ industry, profile }: { industry: Industry; profile: PanoramaProfile }) {
  const [scope, setScope] = useState<RegionScope>("global");
  const regions = createRegionData(profile, scope);
  const [selectedRegion, setSelectedRegion] = useState(regions[0].name);
  const selected = regions.find((item) => item.name === selectedRegion) ?? regions[0];
  const max = Math.max(...regions.map((item) => item.total), 1);
  const changeScope = (nextScope: RegionScope) => {
    setScope(nextScope);
    setSelectedRegion(createRegionData(profile, nextScope)[0].name);
  };
  return <Panel title="区域分布" description={`${industry}产业主体的空间布局演示`} action={<div className="tp-inline-tabs" role="group" aria-label="区域分布空间范围">
    <button className={scope === "global" ? "active" : ""} type="button" aria-pressed={scope === "global"} onClick={() => changeScope("global")}>全球</button>
    <button className={scope === "national" ? "active" : ""} type="button" aria-pressed={scope === "national"} onClick={() => changeScope("national")}>全国</button>
  </div>} className="tp-region-panel">
    <div className="tp-region-layout">
      <figure className={`tp-region-map is-${scope}`}>
        <div className="tp-region-map-canvas">
          <img src="./assets/thinktank-world-map.svg" alt="" />
          {regions.map((item) => <button className={selected.name === item.name ? "active" : ""} type="button" style={{ left: `${item.x}%`, top: `${item.y}%` }} aria-pressed={selected.name === item.name} onClick={() => setSelectedRegion(item.name)} key={item.name}><i /><span>{item.name}<b>{item.total}</b></span></button>)}
        </div>
        <figcaption><span>{scope === "global" ? "全球" : "全国"}区域样本点位</span><small>点位与数量均为演示</small></figcaption>
      </figure>
      <div className="tp-region-breakdown">
        <header><div><strong>区域主体分布</strong><small>企业与机构统一口径</small></div><span><b>{selected.total}</b> 个样本主体</span></header>
        <ol>{regions.map((item) => <li className={selected.name === item.name ? "active" : ""} key={item.name}>
          <button type="button" aria-pressed={selected.name === item.name} onClick={() => setSelectedRegion(item.name)}><span>{item.name}</span><strong>{item.total}</strong></button>
          <div><i style={{ width: `${item.total / max * 100}%` }} /></div>
          <small>企业 {item.enterprises} · 机构 {item.institutions}</small>
        </li>)}</ol>
      </div>
    </div>
  </Panel>;
}

function IndustryOverview({ industry }: { industry: Industry }) {
  const profile = panoramaProfiles[industry];
  return <div className="tp-panorama-overview">
    <Panel title={`${industry}产业介绍`} description="产业定义、边界、发展阶段与深圳现状" className="tp-overview-intro">
      <div className="tp-industry-summary">
        <p>{profile.introduction}</p>
        <dl>
          <div><dt>产业边界</dt><dd>{profile.boundary}</dd></div>
          <div><dt>发展阶段</dt><dd>{profile.stage}</dd></div>
          <div><dt>深圳现状</dt><dd>{profile.shenzhen}</dd></div>
        </dl>
      </div>
    </Panel>
    <Panel title="企业机构数量" description="展示进入当前演示统计范围的企业与机构数量" action={<DemoBadge>截至 2026-06 · 演示统计</DemoBadge>} className="tp-overview-count-panel">
      <MetricStrip items={[
        { label: "企业数量", value: `${profile.enterpriseCount} 家`, note: "产业企业样本", icon: Building2 },
        { label: "机构数量", value: `${profile.institutionCount} 家`, note: "科研与产业服务机构样本", icon: Microscope },
      ]} />
    </Panel>
    <RegionDistribution industry={industry} profile={profile} />
  </div>;
}

function PanoramaContent({ subId, industry, openDialog }: { subId: string; industry: Industry; openDialog: (dialog: DialogState) => void }) {
  if (subId === "chain") return <IndustryChain industry={industry} openDialog={openDialog} />;
  if (subId === "news") return <IndustryNews industry={industry} />;
  return <IndustryOverview industry={industry} />;
}

type FrontierScope = "global" | "shenzhen";
type FrontierTechnologyNode = {
  id: string;
  name: string;
  focus: string;
  papers: number;
  patents: number;
  institutions: number;
  shenzhenPapers: number;
  shenzhenPatents: number;
  shenzhenInstitutions: number;
};
type FrontierTechnologyCategory = { id: string; name: string; summary: string; nodes: FrontierTechnologyNode[] };
type FrontierTechnologyStage = { id: string; title: string; role: string; categories: FrontierTechnologyCategory[]; nodes: FrontierTechnologyNode[] };
type RegionCountPoint = { name: string; count: number; x: number; y: number };

const frontierValidationNodes: Record<Industry, ChainNodeDefinition> = {
  合成生物: node("生物制造中试验证", "菌株、工艺与质量体系协同验证"),
  区块链: node("安全与性能验证", "吞吐、隐私、合约与合规测试"),
  细胞与基因: node("临床前与中试验证", "效力、安全与生产一致性评价"),
  空天技术: node("环境与任务验证", "热真空、振动与任务场景试验"),
  脑科学与类脑智能: node("脑机系统工程验证", "长期稳定、闭环控制与安全评价"),
  深地深海: node("极端环境工程试验", "耐压、通信、供能与长期可靠性验证"),
  可见光通信与光计算: node("光链路系统验证", "信道、器件与软硬件协同测试"),
  量子信息: node("量子系统标定验证", "误差、稳定性与系统扩展能力评价"),
};

const frontierStageMeta = [
  { id: "foundation", title: "基础支撑技术", role: "材料、设备与数据基础" },
  { id: "core", title: "关键共性技术", role: "核心原理与工程方法" },
  { id: "translation", title: "应用转化技术", role: "产品、场景与工程验证" },
] as const;

const frontierCategoryMeta = [
  [
    { id: "resources", name: "基础资源与器件", summary: "材料、器件与基础要素" },
    { id: "tools", name: "工具设备与数据", summary: "实验工具、设备与数据底座" },
  ],
  [
    { id: "methods", name: "核心原理与方法", summary: "核心机理、算法与关键方法" },
    { id: "engineering", name: "系统集成与工程", summary: "过程控制、集成与工程优化" },
  ],
  [
    { id: "products", name: "产品与系统转化", summary: "产品化、系统化与规模应用" },
    { id: "validation", name: "场景与工程验证", summary: "场景适配、标准评价与验证" },
  ],
] as const;

const frontierGenericNodes: ChainNodeDefinition[][][] = [
  [
    [node("基础数据标准", "数据口径、接口与参考规范"), node("关键性能测量", "关键参数测量与基准评价")],
    [node("仿真数据平台", "实验数据管理与模型校准"), node("测试评价工具", "性能、可靠性与安全测试"), node("标准参考体系", "术语、接口与测试规范")],
  ],
  [
    [node("核心机理建模", "机理模型、约束与结果校验"), node("关键参数优化", "多目标参数识别与优化")],
    [node("系统集成", "模块、接口与运行环境集成"), node("过程控制", "状态监测、参数调节与异常处置"), node("工程仿真", "系统级仿真与边界条件验证")],
  ],
  [
    [node("产品化设计", "功能、性能与交付形态协同"), node("规模化工艺", "工艺窗口、稳定性与成本优化")],
    [node("场景适配", "应用边界、环境与系统匹配"), node("标准与质量评价", "性能、质量与一致性评价")],
  ],
];

const paperStageBases = [780, 980, 740];
const patentStageBases = [260, 520, 430];

function createFrontierStages(industry: Industry): FrontierTechnologyStage[] {
  const industryIndex = industries.indexOf(industry);
  const profile = panoramaProfiles[industry];
  const technologyGroups: ChainNodeDefinition[][][] = [
    [[...profile.chain[0], ...frontierGenericNodes[0][0]], [...chainSupplements[industry][0], ...frontierGenericNodes[0][1]]],
    [[...profile.chain[1], ...frontierGenericNodes[1][0]], [...chainSupplements[industry][1], ...frontierGenericNodes[1][1]]],
    [[...profile.chain[2], ...frontierGenericNodes[2][0]], [...chainSupplements[industry][2], frontierValidationNodes[industry], ...frontierGenericNodes[2][1]]],
  ];
  return technologyGroups.map((categorySources, stageIndex) => {
    let stageNodeIndex = 0;
    const categories = categorySources.map((source, categoryIndex) => {
      const categoryMeta = frontierCategoryMeta[stageIndex][categoryIndex];
      const nodes = source.map((item, categoryNodeIndex) => {
        const nodeIndex = stageNodeIndex++;
        const papers = paperStageBases[stageIndex] - nodeIndex * 47 + industryIndex * 29 + stageIndex * 17;
        const patents = patentStageBases[stageIndex] - nodeIndex * 23 + industryIndex * 19 + stageIndex * 11;
        const localFactor = .075 + ((industryIndex + stageIndex + nodeIndex) % 4) * .018;
        const institutions = 18 + stageIndex * 7 + nodeIndex * 3 + industryIndex;
        return {
          id: `${frontierStageMeta[stageIndex].id}-${categoryMeta.id}-node-${categoryNodeIndex}`,
          name: item.name,
          focus: item.note,
          papers,
          patents,
          institutions,
          shenzhenPapers: Math.round(papers * localFactor),
          shenzhenPatents: Math.round(patents * (localFactor + .025)),
          shenzhenInstitutions: Math.max(3, Math.round(institutions * (localFactor + .08))),
        };
      });
      return { ...categoryMeta, nodes };
    });
    return { ...frontierStageMeta[stageIndex], categories, nodes: categories.flatMap((category) => category.nodes) };
  });
}

function createTrendSeries(total: number, weights: number[]) {
  let used = 0;
  return weights.map((weight, index) => {
    if (index === weights.length - 1) return Math.max(0, total - used);
    const value = Math.round(total * weight);
    used += value;
    return value;
  });
}

function getFrontierSummary(stages: FrontierTechnologyStage[], industry: Industry) {
  const nodes = stages.flatMap((stage) => stage.nodes);
  const industryIndex = industries.indexOf(industry);
  const papers = 6_556 + industryIndex * 327;
  const patents = 3_267 + industryIndex * 211;
  const institutions = 188 + industryIndex * 7;
  const shenzhenPapers = Math.round(papers * (.092 + industryIndex % 3 * .009));
  const shenzhenPatents = Math.round(patents * (.118 + industryIndex % 4 * .008));
  return {
    nodes,
    papers,
    patents,
    shenzhenPapers,
    shenzhenPatents,
    institutions,
    shenzhenInstitutions: 38 + industryIndex * 2,
  };
}

function createRegionPoints(total: number, kind: "paper" | "patent"): RegionCountPoint[] {
  const ratios = kind === "paper" ? [.34, .24, .18, .14, .1] : [.42, .2, .16, .13, .09];
  const locations = [
    { name: "中国", x: 75, y: 48 },
    { name: "北美", x: 22, y: 40 },
    { name: "欧洲", x: 49, y: 34 },
    { name: "东亚", x: 84, y: 44 },
    { name: "其他地区", x: 57, y: 63 },
  ];
  return locations.map((item, index) => ({ ...item, count: Math.round(total * ratios[index]) }));
}

function QuantifiedWorldMap({ label, unit, points, scopeLabel = "全球演示样本" }: { label: string; unit: string; points: RegionCountPoint[]; scopeLabel?: string }) {
  return <figure className="tp-world-map tp-quantified-map">
    <div className="tp-map-canvas">
      <img src="./assets/thinktank-world-map.svg" alt="" />
      {points.map((point) => <span className="tp-map-pin" style={{ left: `${point.x}%`, top: `${point.y}%` }} key={point.name}><i /><b>{point.name}<small>{point.count.toLocaleString()} {unit}</small></b></span>)}
    </div>
    <figcaption><span>{scopeLabel} · {label}</span><small>区域数量为演示统计</small></figcaption>
  </figure>;
}

function InstitutionPaperRanking({ industry, total }: { industry: Industry; total: number }) {
  const institutions = [
    [`${industry}前沿科学研究院（虚构样例）`, "深圳"],
    [`鹏城${industry}联合实验室（虚构样例）`, "深圳"],
    [`湾区${industry}技术创新中心（虚构样例）`, "广州"],
    ["未来产业交叉研究中心（虚构样例）", "北京"],
    ["先进工程验证研究院（虚构样例）", "上海"],
  ];
  return <div className="tp-frontier-ranking">
    <table>
      <caption className="tp-visually-hidden">按论文演示样本数量排列的机构主体</caption>
      <thead><tr><th>排名</th><th>论文机构主体</th><th>地区</th><th>论文数</th></tr></thead>
      <tbody>{institutions.map(([name, region], index) => <tr key={name}><td>{String(index + 1).padStart(2, "0")}</td><th scope="row">{name}</th><td>{region}</td><td><strong>{Math.round(total * (.082 - index * .009)).toLocaleString()}</strong> 篇</td></tr>)}</tbody>
    </table>
  </div>;
}

function VolumeBarChart({ label, values, labels, unit }: { label: string; values: number[]; labels: string[]; unit: string }) {
  const max = Math.max(...values, 1);
  return <figure className="tp-volume-chart" aria-label={`${label}：${labels.map((item, index) => `${item}${values[index]}${unit}`).join("，")}；演示数据`}>
    <div className="tp-volume-bars">{values.map((value, index) => <div key={labels[index]}><span><i style={{ "--tp-volume-height": `${value / max * 100}%` } as CSSProperties} /><b>{value}</b></span><small>{labels[index]}</small></div>)}</div>
    <figcaption><span>{label}</span><small>演示数据 · 单位：{unit}</small></figcaption>
  </figure>;
}

function ComparisonTrendFigure({ label, globalValues, shenzhenValues, unit }: { label: string; globalValues: number[]; shenzhenValues: number[]; unit: string }) {
  const width = 620;
  const height = 198;
  const max = Math.max(...globalValues, ...shenzhenValues, 1);
  const years = ["2020", "2021", "2022", "2023", "2024", "2025"].slice(0, globalValues.length);
  const pointsFor = (values: number[]) => values.map((value, index) => ({ x: 38 + index * ((width - 70) / Math.max(values.length - 1, 1)), y: 18 + (1 - value / max) * 128 }));
  const pathFor = (values: number[]) => pointsFor(values).map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  const globalPoints = pointsFor(globalValues);
  const shenzhenPoints = pointsFor(shenzhenValues);
  return <figure className="tp-comparison-trend" aria-label={`${label}。全球演示样本：${globalValues.join("、")}${unit}；深圳演示样本：${shenzhenValues.join("、")}${unit}`}>
    <div className="tp-comparison-legend"><span><i className="is-global" />全球演示样本</span><span><i className="is-shenzhen" />深圳演示样本</span></div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-hidden="true">
      {[18, 50, 82, 114, 146].map((y) => <line x1="38" x2="590" y1={y} y2={y} key={y} />)}
      <path className="is-global" d={pathFor(globalValues)} />
      <path className="is-shenzhen" d={pathFor(shenzhenValues)} />
      {globalPoints.map((point, index) => <circle className="is-global" cx={point.x} cy={point.y} r="3.5" key={`g-${index}`} />)}
      {shenzhenPoints.map((point, index) => <circle className="is-shenzhen" cx={point.x} cy={point.y} r="3.5" key={`s-${index}`} />)}
      {years.map((year, index) => <text x={globalPoints[index]?.x} y="185" textAnchor="middle" key={year}>{year}</text>)}
    </svg>
    <figcaption><span>{label}</span><small>年度新增 · 单位：{unit}</small></figcaption>
  </figure>;
}

function TechnologyChain({ industry, scope = "global" }: { industry: Industry; scope?: FrontierScope }) {
  const stages = useMemo(() => createFrontierStages(industry), [industry]);
  const isShenzhen = scope === "shenzhen";
  const allNodes = stages.flatMap((stage) => stage.nodes);
  const nodeCount = allNodes.length;
  const nodeOrder = new Map(allNodes.map((item, index) => [item.id, index + 1]));
  return <Panel
    title={`${isShenzhen ? "深圳" : ""}${industry}技术链全景`}
    description={isShenzhen ? "保持全域技术链拓扑，完整展示深圳本地技术证据" : "按技术发展阶段完整展开全部节点及基础情况"}
    action={<DemoBadge>技术节点与指标均为演示</DemoBadge>}
    className={`tp-frontier-chain-panel ${isShenzhen ? "is-shenzhen" : ""}`}
  >
    <div className="tp-frontier-chain-context"><span>统计周期：2020—2025</span><span>统计范围：{isShenzhen ? "深圳本地机构演示样本" : "全球演示样本"}</span><span>节点口径：论文、专利与机构主体</span></div>
    <div className="tp-tech-chain-roadmap" role="group" aria-label={`${industry}${isShenzhen ? "深圳" : "全球"}技术链，共${nodeCount}个技术节点`}>
      <header><div><strong>三阶段技术路线</strong><span>{stages.length} 个阶段 · {nodeCount} 个节点</span></div><small>全部节点已展开</small></header>
      <div className="tp-tech-stage-list">
        {stages.map((stage, stageIndex) => <section className={`tp-tech-stage-row is-stage-${stageIndex + 1}`} aria-labelledby={`tp-tech-stage-${scope}-${stage.id}`} key={stage.id}>
          <header id={`tp-tech-stage-${scope}-${stage.id}`}><span aria-hidden="true">{String(stageIndex + 1).padStart(2, "0")}</span><div><small>技术阶段 {stageIndex + 1}</small><strong>{stage.title}</strong><p>{stage.role}</p></div><b>{stage.nodes.length} 个技术节点</b></header>
          <ul className="tp-tech-stage-node-grid" aria-label={`${stage.title}技术节点`}>
            {stage.nodes.map((techNode) => <li key={techNode.id}><article className="tp-tech-node-card">
              <header><span>{String(nodeOrder.get(techNode.id)).padStart(2, "0")}</span><strong>{techNode.name}</strong></header>
              <p>{techNode.focus}</p>
              <dl>
                <div><dt>论文</dt><dd>{(isShenzhen ? techNode.shenzhenPapers : techNode.papers).toLocaleString()} 篇</dd></div>
                <div><dt>专利</dt><dd>{(isShenzhen ? techNode.shenzhenPatents : techNode.patents).toLocaleString()} 件</dd></div>
                <div><dt>机构</dt><dd>{isShenzhen ? techNode.shenzhenInstitutions : techNode.institutions} 家</dd></div>
              </dl>
            </article></li>)}
          </ul>
        </section>)}
      </div>
    </div>
  </Panel>;
}

function TechOverview({ industry }: { industry: Industry }) {
  const stages = createFrontierStages(industry);
  const summary = getFrontierSummary(stages, industry);
  const paperSeries = createTrendSeries(summary.papers, [.1, .12, .15, .18, .21, .24]);
  const patentSeries = createTrendSeries(summary.patents, [.08, .11, .14, .18, .22, .27]);
  const newsTotal = Math.round((summary.papers + summary.patents) * .052);
  const newsValues = createTrendSeries(newsTotal, [.12, .14, .15, .17, .19, .23]);
  const paperRegions = createRegionPoints(summary.papers, "paper");
  const patentRegions = createRegionPoints(summary.patents, "patent");
  return <div className="tp-frontier-overview">
    <div className="tp-frontier-scope"><div><strong>{industry}总体技术概况</strong><span>覆盖技术链 {summary.nodes.length} 个节点</span></div><dl><div><dt>统计周期</dt><dd>2020—2025</dd></div><div><dt>统计范围</dt><dd>全球演示样本</dd></div><div><dt>数据状态</dt><dd>演示数据</dd></div></dl></div>
    <MetricStrip items={[
      { label: "论文数量", value: `${summary.papers.toLocaleString()} 篇`, note: `2025 年新增 ${paperSeries.at(-1)?.toLocaleString()} 篇`, icon: BookOpen },
      { label: "专利数量", value: `${summary.patents.toLocaleString()} 件`, note: `2025 年新增 ${patentSeries.at(-1)?.toLocaleString()} 件`, icon: FileText },
      { label: "论文机构主体", value: `${summary.institutions} 家`, note: "按论文样本归并", icon: GraduationCap },
      { label: "技术资讯数量", value: `${newsTotal} 条`, note: "2020—2025 演示", icon: Newspaper },
    ]} />
    <div className="tp-two-column tp-frontier-chart-grid">
      <Panel title="论文数量及新增趋势" description={`${industry} · 年度新增论文样本`} action={<span className="tp-chart-kpi">2025 +{paperSeries.at(-1)?.toLocaleString()} 篇</span>}><TrendFigure label="论文年度新增趋势" values={paperSeries} color="#1769ff" /></Panel>
      <Panel title="专利数量及新增趋势" description={`${industry} · 年度新增专利样本`} action={<span className="tp-chart-kpi is-teal">2025 +{patentSeries.at(-1)?.toLocaleString()} 件</span>}><TrendFigure label="专利年度新增趋势" values={patentSeries} color="#168f83" /></Panel>
    </div>
    <div className="tp-two-column tp-frontier-chart-grid">
      <Panel title="论文区域分布" description="论文发布机构所在区域及数量"><QuantifiedWorldMap label="论文机构区域分布" unit="篇" points={paperRegions} /></Panel>
      <Panel title="专利区域分布" description="专利申请机构所在区域及数量"><BarBreakdown items={patentRegions.map((item) => ({ label: item.name, value: item.count }))} suffix=" 件" /></Panel>
    </div>
    <div className="tp-frontier-evidence-grid">
      <Panel title="论文机构主体" description="按论文演示样本数量排序"><InstitutionPaperRanking industry={industry} total={summary.papers} /></Panel>
      <Panel title="技术最新资讯数量" description="按年度统计与当前技术链相关的资讯条目"><VolumeBarChart label="技术资讯年度数量" values={newsValues} labels={["2020", "2021", "2022", "2023", "2024", "2025"]} unit="条" /></Panel>
    </div>
  </div>;
}

function TechnologyFieldDistribution({ stages }: { stages: FrontierTechnologyStage[] }) {
  const stageGroups = stages.map((stage) => ({
    ...stage,
    categories: stage.categories.map((category) => ({
      ...category,
      shenzhenPapers: category.nodes.reduce((total, techNode) => total + techNode.shenzhenPapers, 0),
      shenzhenPatents: category.nodes.reduce((total, techNode) => total + techNode.shenzhenPatents, 0),
    })),
  }));
  const categories = stageGroups.flatMap((stage) => stage.categories);
  const paperTotal = Math.max(categories.reduce((total, category) => total + category.shenzhenPapers, 0), 1);
  const patentTotal = Math.max(categories.reduce((total, category) => total + category.shenzhenPatents, 0), 1);
  const toShare = (value: number, total: number) => Math.round(value / total * 1000) / 10;

  return <figure className="tp-technology-distribution" aria-label="深圳细分技术领域论文与专利样本分布">
    <figcaption className="tp-distribution-overview">
      <p>领域顺序跟随技术链，条长表示该领域占深圳对应指标样本总量的比例。</p>
      <div><span><i className="is-paper" />论文样本 <strong>{paperTotal.toLocaleString()}</strong> 篇</span><span><i className="is-patent" />专利样本 <strong>{patentTotal.toLocaleString()}</strong> 件</span></div>
    </figcaption>
    <div className="tp-technology-distribution-grid">
      {stageGroups.map((stage, stageIndex) => <section className={`tp-technology-distribution-stage is-stage-${stageIndex + 1}`} aria-labelledby={`tp-field-stage-${stage.id}`} key={stage.id}>
        <header id={`tp-field-stage-${stage.id}`}><div><span>技术阶段 {String(stageIndex + 1).padStart(2, "0")}</span><strong>{stage.title}</strong><small>{stage.role}</small></div><b>{stage.categories.length} 个领域</b></header>
        {stage.categories.length ? <ol>{stage.categories.map((category) => {
          const paperShare = toShare(category.shenzhenPapers, paperTotal);
          const patentShare = toShare(category.shenzhenPatents, patentTotal);
          return <li aria-label={`${category.name}，${category.nodes.length} 个技术节点，深圳论文样本 ${category.shenzhenPapers} 篇，占比 ${paperShare}%，深圳专利样本 ${category.shenzhenPatents} 件，占比 ${patentShare}%`} key={category.id}>
            <header><strong>{category.name}</strong><span>{category.nodes.length} 个技术节点</span></header>
            <dl>
              <div><dt><i className="is-paper" />论文</dt><dd><span><b className="is-paper" style={{ "--tp-distribution-share": `${paperShare}%` } as CSSProperties} /></span><em><strong>{category.shenzhenPapers.toLocaleString()}</strong><small>篇 · {paperShare}%</small></em></dd></div>
              <div><dt><i className="is-patent" />专利</dt><dd><span><b className="is-patent" style={{ "--tp-distribution-share": `${patentShare}%` } as CSSProperties} /></span><em><strong>{category.shenzhenPatents.toLocaleString()}</strong><small>件 · {patentShare}%</small></em></dd></div>
            </dl>
          </li>;
        })}</ol> : <p className="tp-technology-distribution-empty">暂无领域分布数据</p>}
      </section>)}
    </div>
  </figure>;
}

function ShenzhenTechnologyStatus({ industry }: { industry: Industry }) {
  const stages = createFrontierStages(industry);
  const summary = getFrontierSummary(stages, industry);
  const globalPaperSeries = createTrendSeries(summary.papers, [.1, .12, .15, .18, .21, .24]);
  const localPaperSeries = createTrendSeries(summary.shenzhenPapers, [.08, .1, .14, .18, .22, .28]);
  const globalPatentSeries = createTrendSeries(summary.patents, [.08, .11, .14, .18, .22, .27]);
  const localPatentSeries = createTrendSeries(summary.shenzhenPatents, [.07, .1, .13, .18, .23, .29]);
  return <div className="tp-shenzhen-frontier">
    <TechnologyChain industry={industry} scope="shenzhen" />
    <div className="tp-two-column tp-frontier-chart-grid">
      <Panel title="深圳论文数量与全域对比" description={`深圳 ${summary.shenzhenPapers.toLocaleString()} 篇 / 全球演示样本 ${summary.papers.toLocaleString()} 篇`}><ComparisonTrendFigure label="论文年度新增趋势对比" globalValues={globalPaperSeries} shenzhenValues={localPaperSeries} unit="篇" /></Panel>
      <Panel title="深圳专利数量与全域对比" description={`深圳 ${summary.shenzhenPatents.toLocaleString()} 件 / 全球演示样本 ${summary.patents.toLocaleString()} 件`}><ComparisonTrendFigure label="专利年度新增趋势对比" globalValues={globalPatentSeries} shenzhenValues={localPatentSeries} unit="件" /></Panel>
    </div>
    <Panel title="深圳细分技术领域分布" description="结合同一技术链节点展示深圳本地论文与专利样本分布" action={<DemoBadge>分布数量为演示</DemoBadge>}><TechnologyFieldDistribution stages={stages} /></Panel>
  </div>;
}

function FrontierContent({ subId, industry }: { subId: string; industry: Industry }) {
  if (subId === "tech-chain") return <TechnologyChain industry={industry} />;
  if (subId === "tech-overview") return <TechOverview industry={industry} />;
  return <ShenzhenTechnologyStatus industry={industry} />;
}

type EnterpriseTypeLabel = "外企样本" | "高企样本" | "小微样本" | "上市样本";
type EnterpriseRecord = {
  id: string;
  name: string;
  stageIndex: number;
  nodeName: string;
  location: string;
  type: EnterpriseTypeLabel;
  paperKeyword: string;
  patentKeyword: string;
};
type EnterpriseDemoProfile = {
  profile: PanoramaProfile;
  chain: ChainStageData;
  total: number;
  researchers: number;
  trend: number[];
  records: EnterpriseRecord[];
  fieldCounts: number[][];
  scaleRows: { level: string; note: string; values: number[] }[];
  shenzhenTotal: number;
  shenzhenTrend: number[];
  shenzhenScale: { label: string; value: number }[];
  shenzhenFieldCounts: number[][];
  shenzhenRecords: EnterpriseRecord[];
};

const enterpriseTypeLabels: EnterpriseTypeLabel[] = ["外企样本", "高企样本", "小微样本", "上市样本"];
const enterpriseNamePrefixes = ["湾区", "鹏城", "前海", "华新", "科澜"];
const enterpriseLocations = ["中国·深圳", "中国·广州", "中国·上海", "中国·北京", "德国·慕尼黑", "美国·波士顿"];
const shenzhenDistricts = ["南山区", "光明区", "龙岗区", "宝安区", "福田区", "龙华区"];
const enterprisePaperKeywordThemes = ["方法研究", "性能评价", "机理分析", "应用验证", "协同优化"];
const enterprisePatentKeywordThemes = ["核心装置", "工艺系统", "检测组件", "控制方法", "应用终端"];

function createCumulativeTrend(total: number, ratios = [.5, .59, .68, .77, .88, 1]) {
  return ratios.map((ratio, index) => index === ratios.length - 1 ? total : Math.round(total * ratio));
}

function createEnterpriseDemoProfile(industry: Industry): EnterpriseDemoProfile {
  const profile = panoramaProfiles[industry];
  const industryIndex = industries.indexOf(industry);
  const chain = getIndustryChain(industry, profile);
  const total = profile.enterpriseCount;
  const records = chain.flatMap((lane, stageIndex) => lane.map((item, nodeIndex) => {
    const flatIndex = stageIndex * 5 + nodeIndex;
    const stem = item.name.replace(/[^一-龥A-Za-z0-9]/g, "").slice(0, 7);
    return {
      id: `${industryIndex}-${stageIndex}-${nodeIndex}`,
      name: `${enterpriseNamePrefixes[flatIndex % enterpriseNamePrefixes.length]}${stem}科技（虚构）`,
      stageIndex,
      nodeName: item.name,
      location: enterpriseLocations[(flatIndex + industryIndex) % enterpriseLocations.length],
      type: enterpriseTypeLabels[(flatIndex + industryIndex) % enterpriseTypeLabels.length],
      paperKeyword: `${item.name}·${enterprisePaperKeywordThemes[(flatIndex + industryIndex) % enterprisePaperKeywordThemes.length]}`,
      patentKeyword: `${item.name}·${enterprisePatentKeywordThemes[(flatIndex + industryIndex * 2) % enterprisePatentKeywordThemes.length]}`,
    };
  }));
  const fieldCounts = chain.map((lane, stageIndex) => lane.map((_, nodeIndex) => 5 + ((industryIndex * 3 + stageIndex * 5 + nodeIndex * 2) % 12)));
  const shenzhenTotal = Math.round(total * (.29 + industryIndex % 3 * .014));
  const shenzhenFieldCounts = chain.map((lane, stageIndex) => lane.map((_, nodeIndex) => (industryIndex + stageIndex * 2 + nodeIndex) % 6));
  const shenzhenRecords = chain.flatMap((lane, stageIndex) => lane.slice(0, 2).map((item, nodeIndex) => {
    const flatIndex = stageIndex * 2 + nodeIndex;
    const stem = item.name.replace(/[^一-龥A-Za-z0-9]/g, "").slice(0, 7);
    return {
      id: `sz-${industryIndex}-${stageIndex}-${nodeIndex}`,
      name: `深科${stem}产业（虚构）`,
      stageIndex,
      nodeName: item.name,
      location: shenzhenDistricts[(flatIndex + industryIndex) % shenzhenDistricts.length],
      type: enterpriseTypeLabels[(flatIndex + industryIndex + 1) % enterpriseTypeLabels.length],
      paperKeyword: `${item.name}·${enterprisePaperKeywordThemes[(flatIndex + industryIndex) % enterprisePaperKeywordThemes.length]}`,
      patentKeyword: `${item.name}·${enterprisePatentKeywordThemes[(flatIndex + industryIndex * 2) % enterprisePatentKeywordThemes.length]}`,
    };
  }));
  const nationalScale = [
    12 + industryIndex * 2,
    Math.round(total * .42),
    Math.round(total * .38),
    Math.round(total * .16),
  ];
  const large = Math.max(2, Math.round(shenzhenTotal * .14));
  const medium = Math.max(4, Math.round(shenzhenTotal * .29));
  const small = Math.max(5, Math.round(shenzhenTotal * .36));
  return {
    profile,
    chain,
    total,
    researchers: total * (49 + industryIndex * 2) + 240,
    trend: createCumulativeTrend(total),
    records,
    fieldCounts,
    scaleRows: [
      { level: "全国", note: "国家级演示样本", values: nationalScale },
      { level: "广东省", note: "省级演示样本", values: nationalScale.map((value) => Math.max(1, Math.round(value * .46))) },
      { level: "深圳市", note: "市级演示样本", values: nationalScale.map((value) => Math.max(1, Math.round(value * .24))) },
    ],
    shenzhenTotal,
    shenzhenTrend: createCumulativeTrend(shenzhenTotal, [.47, .57, .66, .76, .87, 1]),
    shenzhenScale: [
      { label: "大型企业样本", value: large },
      { label: "中型企业样本", value: medium },
      { label: "小型企业样本", value: small },
      { label: "微型企业样本", value: Math.max(0, shenzhenTotal - large - medium - small) },
    ],
    shenzhenFieldCounts,
    shenzhenRecords,
  };
}

function EnterpriseRegionPanel({ industry, profile }: { industry: Industry; profile: PanoramaProfile }) {
  const [scope, setScope] = useState<RegionScope>("global");
  const points = createRegionData(profile, scope).map((item) => ({ name: item.name, count: item.enterprises, x: item.x, y: item.y }));
  return <Panel title="企业区域分布" description={`${industry}企业重点区域演示样本`} action={<div className="tp-inline-tabs" role="group" aria-label="企业区域统计范围">
    <button className={scope === "global" ? "active" : ""} type="button" aria-pressed={scope === "global"} onClick={() => setScope("global")}>全球</button>
    <button className={scope === "national" ? "active" : ""} type="button" aria-pressed={scope === "national"} onClick={() => setScope("national")}>全国</button>
  </div>}><QuantifiedWorldMap label={`${scope === "global" ? "全球" : "全国"}企业区域分布`} unit="家" points={points} scopeLabel={scope === "global" ? "全球演示样本" : "全国演示样本"} /></Panel>;
}

function EnterpriseDirectory({ records, label, shenzhen = false }: { records: EnterpriseRecord[]; label: string; shenzhen?: boolean }) {
  const pageSize = 8;
  const [expanded, setExpanded] = useState(false);
  const hasMore = records.length > pageSize;
  const visibleRecords = expanded ? records : records.slice(0, pageSize);
  const directoryId = shenzhen ? "tp-shenzhen-enterprise-directory" : "tp-key-enterprise-directory";
  useEffect(() => { setExpanded(false); }, [label]);
  return <div className="tp-enterprise-directory-block">
    <div className="tp-enterprise-directory" id={directoryId}>
      <table>
        <caption className="tp-visually-hidden">{label}</caption>
        <thead><tr><th>企业名称</th><th>产业链节点</th><th>{shenzhen ? "行政区" : "所在地"}</th><th>企业类型</th></tr></thead>
        <tbody>{visibleRecords.map((record) => <tr key={record.id}><th scope="row">{record.name}</th><td>{record.nodeName}</td><td>{record.location}</td><td>{record.type}</td></tr>)}</tbody>
      </table>
    </div>
    {hasMore && <button className={`tp-enterprise-directory-toggle${expanded ? " is-expanded" : ""}`} type="button" aria-expanded={expanded} aria-controls={directoryId} onClick={() => setExpanded((value) => !value)}>
      {expanded ? `收起至前 ${pageSize} 条` : `展开全部 ${records.length} 条`}<ChevronDown size={16} aria-hidden="true" />
    </button>}
  </div>;
}

function EnterpriseScaleMatrix({ rows }: { rows: EnterpriseDemoProfile["scaleRows"] }) {
  const max = Math.max(...rows.flatMap((row) => row.values), 1);
  return <div className="tp-enterprise-scale-matrix">
    <table>
      <caption className="tp-visually-hidden">国家、省、市三级重点企业类型统计</caption>
      <thead><tr><th>统计范围</th>{enterpriseTypeLabels.map((label) => <th key={label}>{label.replace("样本", "")}</th>)}</tr></thead>
      <tbody>{rows.map((row) => <tr key={row.level}><th scope="row"><strong>{row.level}</strong><small>{row.note}</small></th>{row.values.map((value, index) => <td key={enterpriseTypeLabels[index]}><span>{value} 家</span><i><b style={{ "--tp-enterprise-scale-width": `${value / max * 100}%` } as CSSProperties} /></i></td>)}</tr>)}</tbody>
    </table>
    <p>企业类型标签可交叉，各类型不相加为企业总数。</p>
  </div>;
}

function EnterpriseFieldDistribution({ data, shenzhen = false }: { data: EnterpriseDemoProfile; shenzhen?: boolean }) {
  const counts = shenzhen ? data.shenzhenFieldCounts : data.fieldCounts;
  const max = Math.max(...counts.flat(), 1);
  return <div className={`tp-enterprise-field-map${shenzhen ? " is-shenzhen" : ""}`}>
    {data.chain.map((lane, stageIndex) => <section className={chainLaneMeta[stageIndex].className} key={chainLaneMeta[stageIndex].label}>
      <header><div><strong>{chainLaneMeta[stageIndex].label}</strong><small>{chainLaneMeta[stageIndex].role}</small></div><span>{lane.length} 个节点</span></header>
      <ol>{lane.map((item, nodeIndex) => {
        const record = data.records.find((entry) => entry.stageIndex === stageIndex && entry.nodeName === item.name);
        const value = counts[stageIndex][nodeIndex];
        return <li key={item.name}><div><strong>{item.name}</strong><span>{value} 家</span></div><i><b style={{ "--tp-enterprise-field-width": `${value / max * 100}%` } as CSSProperties} /></i>{!shenzhen && record && <dl className="tp-enterprise-field-keywords"><div><dt>论文样例</dt><dd>{record.paperKeyword}</dd></div><div><dt>专利样例</dt><dd>{record.patentKeyword}</dd></div></dl>}</li>;
      })}</ol>
    </section>)}
  </div>;
}

function EnterpriseOverview({ industry }: { industry: Industry }) {
  const data = createEnterpriseDemoProfile(industry);
  return <div className="tp-enterprise-overview">
    <div className="tp-enterprise-scope"><div><strong>{industry}企业发展概况</strong><span>展示企业总量、发展趋势、区域分布与研发岗位规模</span></div><DemoBadge>2020—2025 演示样本</DemoBadge></div>
    <MetricStrip items={[
      { label: "企业总体数量", value: `${data.total.toLocaleString()} 家`, note: `${industry}企业演示样本`, icon: Building2 },
      { label: "企业科研人数", value: `${data.researchers.toLocaleString()} 人`, note: "仅含研发与科研岗位；不含生产、销售等岗位（演示）", icon: Users },
    ]} />
    <div className="tp-two-column tp-enterprise-overview-grid">
      <Panel title="企业总量历年趋势" description={`${industry}企业演示样本，末年与总量一致`}><TrendFigure label="企业总量历年趋势" values={data.trend} /></Panel>
      <EnterpriseRegionPanel industry={industry} profile={data.profile} />
    </div>
  </div>;
}

function KeyEnterprisePanorama({ industry }: { industry: Industry }) {
  const data = createEnterpriseDemoProfile(industry);
  return <div className="tp-key-enterprise-section">
    <Panel title={`${industry}重点企业产业链覆盖与领域关联`} description="按上中下游保留产业链节点顺序，同时展示企业数量与论文、专利关联字段" action={<DemoBadge>{data.chain.flat().length} 个节点 · 关联字段为演示</DemoBadge>}>
      <EnterpriseFieldDistribution data={data} />
    </Panel>
    <Panel title="代表性重点企业样例" description="默认展示 8 条，可展开查看全部企业名称、产业链节点、所在地与类型" action={<DemoBadge>企业名称为虚构样例</DemoBadge>}>
      <EnterpriseDirectory records={data.records} label={`${industry}重点企业基础信息`} />
    </Panel>
    <Panel title="重点企业规模统计" description="外企、高企、小微、上市四类标签的国家、省、市三级对比" action={<DemoBadge>三级统计均为演示</DemoBadge>}>
      <EnterpriseScaleMatrix rows={data.scaleRows} />
    </Panel>
  </div>;
}

function EnterpriseEcosystem({ industry, companyName, openDialog }: { industry: Industry; companyName: string; openDialog: (dialog: DialogState) => void }) {
  const profile = panoramaProfiles[industry];
  const relations = [
    { name: `${profile.chain[0][0].name}联合中心（虚构）`, group: "上游协同", summary: `为${companyName}提供${profile.chain[0][0].note}的联合验证样例。`, outcome: "完成样品与接口规范协同（演示）", x: 16, y: 25 },
    { name: `${profile.chain[0][1].name}供应联盟（虚构）`, group: "上游协同", summary: `聚焦${profile.chain[0][1].note}与核心产品的适配。`, outcome: "形成一项联合适配流程（演示）", x: 16, y: 72 },
    { name: `鹏城${industry}联合实验室（虚构）`, group: "战略伙伴", summary: `围绕${profile.chain[1][0].name}开展联合研发。`, outcome: "完成阶段性方法验证（演示）", x: 38, y: 91 },
    { name: `湾区${industry}产业基金（虚构）`, group: "战略伙伴", summary: "提供产业化孵化与场景资源协同。", outcome: "支持中试与场景对接（演示）", x: 62, y: 91 },
    { name: `${profile.chain[2][0].name}应用中心（虚构）`, group: "下游应用", summary: `在${profile.chain[2][0].name}场景开展产品联调。`, outcome: "完成一轮场景可用性测试（演示）", x: 84, y: 25 },
    { name: `${profile.chain[2][1].name}示范平台（虚构）`, group: "下游应用", summary: `承载${profile.chain[2][1].name}的演示应用与效果评价。`, outcome: "形成场景验证记录（演示）", x: 84, y: 72 },
  ];
  return <div className="tp-enterprise-ecosystem" role="group" aria-label={`${companyName}产业生态演示图谱`}>
    <svg viewBox="0 0 720 360" aria-hidden="true">{relations.map((relation) => <line x1="360" y1="174" x2={relation.x * 7.2} y2={relation.y * 3.6} key={relation.name} />)}</svg>
    <div className="tp-enterprise-ecosystem-core"><Network size={20} aria-hidden="true" /><strong>{companyName}</strong><small>明星企业样例</small></div>
    {relations.map((relation) => <button className={`is-${relation.group === "上游协同" ? "upstream" : relation.group === "下游应用" ? "downstream" : "partner"}`} style={{ "--tp-eco-x": `${relation.x}%`, "--tp-eco-y": `${relation.y}%` } as CSSProperties} type="button" aria-haspopup="dialog" onClick={(event) => openDialog({
      title: relation.name,
      label: `${relation.group} · 演示合作详情`,
      returnFocus: event.currentTarget,
      body: <div className="tp-dialog-detail"><p>{relation.summary}</p><dl><div><dt>关系类型</dt><dd>{relation.group}</dd></div><div><dt>协同成果</dt><dd>{relation.outcome}</dd></div><div><dt>数据状态</dt><dd>演示关系</dd></div></dl><DemoBadge>合作对象与成果均为虚构样例</DemoBadge></div>,
    })} key={relation.name}><span>{relation.group}</span><strong>{relation.name}</strong></button>)}
  </div>;
}

function StarEnterpriseShowcase({ industry, openDialog }: { industry: Industry; openDialog: (dialog: DialogState) => void }) {
  const industryIndex = industries.indexOf(industry);
  const profile = panoramaProfiles[industry];
  const companyName = `${enterpriseNamePrefixes[industryIndex % enterpriseNamePrefixes.length]}${industry}科技（虚构）`;
  const productName = `${profile.chain[2][0].name}核心系统`;
  const [activeFeature, setActiveFeature] = useState<number | null>(0);
  const [teamIndex, setTeamIndex] = useState(0);
  useEffect(() => { setActiveFeature(0); setTeamIndex(0); }, [industry]);
  const features = [
    { title: "核心产品架构", description: `${productName}由数据与资源层、核心能力层和场景应用层组成。`, items: [profile.chain[0][0].name, profile.chain[1][0].name, profile.chain[2][0].name] },
    { title: "功能模块", description: "按产品功能拆分为数据接入、核心处理、质量控制和应用交付。", items: ["数据接入与校验", "核心处理与控制", "质量评价与追溯", "应用交付与运维"] },
    { title: "使用场景", description: `围绕${profile.chain[2][0].name}、${profile.chain[2][1].name}与${profile.chain[2][2].name}展示产品的场景边界。`, items: profile.chain[2].map((item) => item.name) },
    { title: "操作演示视频", description: "展示产品主要操作流程和应用效果。", items: ["产品组件说明", "关键操作流程", "场景效果演示"], mediaPending: true },
    { title: "行业案例", description: "按问题、解决方案、实施过程和应用结果组织案例。", items: [`${profile.chain[2][0].name}应用案例（演示）`, `${profile.chain[2][1].name}联合案例（演示）`] },
  ];
  const teams = [
    { name: "林岚（虚构人物）", role: "首席科学家", expertise: `${industry}技术路线与交叉研究`, achievement: "完成多项关键技术评价与方法验证（演示）", project: `${profile.chain[1][0].name}联合攻关（演示）` },
    { name: "顾远（虚构人物）", role: "产品负责人", expertise: "产品架构、场景规划与产业化验证", achievement: "搭建产品功能与场景交付体系（演示）", project: `${productName}研发项目（演示）` },
    { name: "沈嘉（虚构人物）", role: "工程负责人", expertise: "系统集成、质量控制与工程交付", achievement: "完成中试环境的稳定性验证（演示）", project: `${profile.chain[1][2].name}工程验证（演示）` },
  ];
  const activeTeam = teams[teamIndex];
  return <div className="tp-star-enterprise-section">
    <div className="tp-star-enterprise-summary"><div><span><Building2 size={20} aria-hidden="true" /></span><div><strong>{companyName}</strong><p>{industry}明星企业完整功能样例，不代表真实企业能力或行业结论。</p></div></div><DemoBadge>企业、产品、人物与数据均为虚构演示</DemoBadge></div>
    <Panel title="产品功能全景图" description={`${productName}的架构、功能、场景、演示视频与行业案例`}>
      <div className="tp-product-panorama">{features.map((feature, index) => {
        const active = activeFeature === index;
        const buttonId = `tp-product-feature-${industryIndex}-${index}`;
        const panelId = `tp-product-feature-panel-${industryIndex}-${index}`;
        return <section className={active ? "active" : ""} key={feature.title}>
          <button id={buttonId} type="button" aria-expanded={active} aria-controls={panelId} onClick={() => setActiveFeature((current) => current === index ? null : index)}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{feature.title}</strong><small>{feature.description}</small></div><ChevronDown size={17} aria-hidden="true" /></button>
          {active && <div id={panelId} role="region" aria-labelledby={buttonId}><p>{feature.description}</p><ul>{feature.items.map((item) => <li key={item}><CheckCircle2 size={14} aria-hidden="true" />{item}</li>)}</ul>{feature.mediaPending && <div className="tp-media-placeholder"><Eye size={22} aria-hidden="true" /><strong>操作演示说明</strong><small>当前以使用场景与功能步骤进行展示</small></div>}</div>}
        </section>;
      })}</div>
    </Panel>
    <Panel title="技术优势展示结构" description="以专利数量、研发投入占比和底层架构预留技术优势可视化位置" action={<DemoBadge>指标为虚构演示</DemoBadge>}>
      <div className="tp-tech-advantage-layout"><section><dl><div><dt>专利数量</dt><dd>{68 + industryIndex * 7} 件</dd><small>企业专利演示样本</small></div><div><dt>研发投入占比</dt><dd>{18 + industryIndex % 4 * 2}%</dd><small>年度营收演示口径</small></div></dl><div className="tp-tech-principle"><strong>算法与方法优势</strong><p>以演示指标和能力结构展示技术优势。</p><strong>系统架构优势</strong><p>当前展示资源层—核心能力层—场景层的信息结构。</p></div></section><aside><Layers3 size={28} aria-hidden="true" /><strong>技术原理结构示意</strong><p>以分层结构说明技术原理与能力关系。</p></aside></div>
    </Panel>
    <Panel title="团队实力多维展示" description="展示核心成员的专业领域、行业成就与主导项目" action={<DemoBadge>人物资料为虚构演示</DemoBadge>}>
      <article className="tp-team-card tp-enterprise-team-card"><span><Users size={24} aria-hidden="true" /></span><div aria-live="polite"><small>{teamIndex + 1} / {teams.length} · {activeTeam.role}</small><h4>{activeTeam.name}</h4><dl><div><dt>专业领域</dt><dd>{activeTeam.expertise}</dd></div><div><dt>行业成就</dt><dd>{activeTeam.achievement}</dd></div><div><dt>主导项目</dt><dd>{activeTeam.project}</dd></div></dl><span className="tp-link-pending" aria-disabled="true">演示人物不提供外部履历</span></div><nav aria-label="切换团队成员"><button type="button" disabled={teamIndex === 0} onClick={() => setTeamIndex((value) => Math.max(0, value - 1))} aria-label="上一位成员"><ChevronLeft size={17} /></button><button type="button" disabled={teamIndex === teams.length - 1} onClick={() => setTeamIndex((value) => Math.min(teams.length - 1, value + 1))} aria-label="下一位成员"><ChevronRight size={17} /></button></nav></article>
    </Panel>
    <Panel title="产业生态图谱" description="按上游协同、战略伙伴和下游应用展示合作网络" action={<DemoBadge>点击节点查看演示合作详情</DemoBadge>}>
      <EnterpriseEcosystem industry={industry} companyName={companyName} openDialog={openDialog} />
    </Panel>
  </div>;
}

function ShenzhenEnterpriseStatus({ industry }: { industry: Industry }) {
  const data = createEnterpriseDemoProfile(industry);
  return <div className="tp-shenzhen-enterprise-section">
    <div className="tp-enterprise-scope"><div><strong>深圳{industry}企业发展状况</strong><span>与全域企业共用产业链节点，单独呈现深圳数量、规模与重点企业</span></div><DemoBadge>深圳指标均为演示</DemoBadge></div>
    <MetricStrip items={[
      { label: "深圳企业数量", value: `${data.shenzhenTotal} 家`, note: `${industry}企业演示样本`, icon: Building2 },
      { label: "深圳重点企业", value: `${data.shenzhenRecords.length} 家`, note: "基础信息虚构样例", icon: BriefcaseBusiness },
    ]} />
    <div className="tp-two-column tp-shenzhen-enterprise-grid"><Panel title="数量与趋势" description={`${industry}深圳企业演示样本`}><TrendFigure label="深圳企业历年趋势" values={data.shenzhenTrend} /></Panel><Panel title="规模分布" description="大型、中型、小型、微型演示口径"><BarBreakdown suffix=" 家" items={data.shenzhenScale} /></Panel></div>
    <Panel title="领域分布" description="沿用全域产业链节点与顺序，展示深圳企业数量" action={<DemoBadge>企业可关联多个产业链节点</DemoBadge>}><EnterpriseFieldDistribution data={data} shenzhen /></Panel>
    <Panel title="重点企业" description="展示企业名称、产业链节点、行政区与企业类型" action={<DemoBadge>企业名称为虚构样例</DemoBadge>}><EnterpriseDirectory records={data.shenzhenRecords} label={`深圳${industry}重点企业`} shenzhen /></Panel>
  </div>;
}

function EnterpriseContent({ subId, industry, openDialog }: { subId: string; industry: Industry; openDialog: (dialog: DialogState) => void }) {
  if (subId === "enterprise-overview") return <EnterpriseOverview industry={industry} />;
  if (subId === "enterprise-map") return <KeyEnterprisePanorama industry={industry} />;
  if (subId === "star-enterprise") return <StarEnterpriseShowcase industry={industry} openDialog={openDialog} />;
  return <ShenzhenEnterpriseStatus industry={industry} />;
}

type ResearchRankingMetric = "score" | "papers" | "patents" | "researchers";
type ResearchInstitutionRecord = {
  id: string;
  name: string;
  region: string;
  papers: number;
  patents: number;
  researchers: number;
  score: number;
};
type ResearchDemoProfile = {
  chain: ChainStageData;
  technologyStages: FrontierTechnologyStage[];
  total: number;
  trend: number[];
  nationalTotal: number;
  globalRegions: RegionCountPoint[];
  nationalRegions: RegionCountPoint[];
  chainCounts: number[][];
  technologyCounts: number[][];
  ranking: ResearchInstitutionRecord[];
  shenzhenTotal: number;
  shenzhenTrend: number[];
  districtCounts: { label: string; value: number }[];
  shenzhenChainCounts: number[][];
};

const researchInstitutionBases = [
  "前沿科学联合实验室", "交叉科学研究中心", "先进工程技术研究院", "未来技术创新中心", "产业共性技术实验室",
  "应用科学研究中心", "工程转化联合中心", "开放研究基础设施中心", "数字工程联合实验室", "新材料交叉研究中心",
  "智能系统研究院", "核心器件实验室", "工程验证研究中心", "国际联合创新中心", "产业技术协同研究院",
  "基础科学研究中心", "前沿装置实验室", "成果转化研究院", "区域创新联合中心", "先进测试与评价中心",
] as const;
const researchRegions = ["深圳", "北京", "上海", "广州", "武汉", "南京", "杭州", "成都", "波士顿", "慕尼黑"] as const;
const researchRankingMetricLabels: Record<ResearchRankingMetric, string> = {
  score: "综合评价",
  papers: "论文数量",
  patents: "专利数量",
  researchers: "科研人数",
};

function splitResearchTotal(total: number, ratios: number[]) {
  let used = 0;
  return ratios.map((ratio, index) => {
    if (index === ratios.length - 1) return Math.max(0, total - used);
    const value = Math.round(total * ratio);
    used += value;
    return value;
  });
}

function createResearchRegionPoints(total: number, scope: RegionScope): RegionCountPoint[] {
  const globalMeta = [
    { name: "中国", x: 75, y: 48 }, { name: "北美", x: 22, y: 40 }, { name: "欧洲", x: 49, y: 34 }, { name: "东亚", x: 84, y: 44 }, { name: "其他地区", x: 57, y: 63 },
  ];
  const nationalMeta = [
    { name: "粤港澳", x: 77, y: 55 }, { name: "长三角", x: 80, y: 49 }, { name: "京津冀", x: 78, y: 42 }, { name: "中西部", x: 70, y: 48 }, { name: "其他地区", x: 73, y: 58 },
  ];
  const metadata = scope === "global" ? globalMeta : nationalMeta;
  const values = splitResearchTotal(total, scope === "global" ? [.34, .23, .19, .14, .1] : [.31, .25, .19, .15, .1]);
  return metadata.map((item, index) => ({ ...item, count: values[index] }));
}

function createResearchDemoProfile(industry: Industry): ResearchDemoProfile {
  const industryIndex = industries.indexOf(industry);
  const profile = panoramaProfiles[industry];
  const chain = getIndustryChain(industry, profile);
  const technologyStages = createFrontierStages(industry);
  const frontierSummary = getFrontierSummary(technologyStages, industry);
  const total = frontierSummary.institutions;
  const trend = createCumulativeTrend(total, [.58, .66, .74, .82, .91, 1]);
  const nationalTotal = Math.round(total * (.56 + industryIndex % 3 * .02));
  const chainCounts = chain.map((lane, stageIndex) => lane.map((_, nodeIndex) => 12 + ((industryIndex * 5 + stageIndex * 7 + nodeIndex * 4) % 27)));
  const technologyCounts = technologyStages.map((stage, stageIndex) => stage.categories.map((category, categoryIndex) => {
    const average = category.nodes.reduce((sum, item) => sum + item.institutions, 0) / Math.max(category.nodes.length, 1);
    return Math.round(average + industryIndex + stageIndex * 2 + categoryIndex);
  }));
  const shenzhenTotal = frontierSummary.shenzhenInstitutions;
  const shenzhenTrend = createCumulativeTrend(shenzhenTotal, [.5, .6, .69, .78, .89, 1]);
  const districtValues = splitResearchTotal(shenzhenTotal, [.27, .18, .14, .12, .1, .07, .05, .04, .03]);
  const districtCounts = ["南山区", "光明区", "龙岗区", "宝安区", "福田区", "龙华区", "坪山区", "罗湖区", "盐田区"].map((label, index) => ({ label, value: districtValues[index] }));
  const shenzhenChainCounts = chain.map((lane, stageIndex) => lane.map((_, nodeIndex) => 2 + ((industryIndex + stageIndex * 3 + nodeIndex * 2) % 8)));
  const rawRanking = researchInstitutionBases.map((base, index) => ({
    id: `research-${industryIndex}-${index}`,
    name: `${industry}${base}（虚构）`,
    region: researchRegions[(index + industryIndex) % researchRegions.length],
    papers: Math.max(120, Math.round(frontierSummary.papers * (.082 - index * .0025 + (index % 3) * .001))),
    patents: Math.max(45, Math.round(frontierSummary.patents * (.074 - index * .0023 + (index % 4) * .0008))),
    researchers: Math.max(90, 438 - index * 13 + industryIndex * 8 + index % 4 * 14),
  }));
  const maxPapers = Math.max(...rawRanking.map((item) => item.papers), 1);
  const maxPatents = Math.max(...rawRanking.map((item) => item.patents), 1);
  const maxResearchers = Math.max(...rawRanking.map((item) => item.researchers), 1);
  const ranking = rawRanking.map((item) => ({
    ...item,
    score: Math.round((item.papers / maxPapers + item.patents / maxPatents + item.researchers / maxResearchers) / 3 * 1000) / 10,
  }));
  return {
    chain,
    technologyStages,
    total,
    trend,
    nationalTotal,
    globalRegions: createResearchRegionPoints(total, "global"),
    nationalRegions: createResearchRegionPoints(nationalTotal, "national"),
    chainCounts,
    technologyCounts,
    ranking,
    shenzhenTotal,
    shenzhenTrend,
    districtCounts,
    shenzhenChainCounts,
  };
}

function ResearchRegionPanel({ industry, data }: { industry: Industry; data: ResearchDemoProfile }) {
  const [scope, setScope] = useState<RegionScope>("global");
  const points = scope === "global" ? data.globalRegions : data.nationalRegions;
  return <Panel title="科研机构区域分布" description={`${industry}科研机构所在地演示统计`} action={<div className="tp-inline-tabs" role="group" aria-label="科研机构区域范围">
    <button className={scope === "global" ? "active" : ""} type="button" aria-pressed={scope === "global"} onClick={() => setScope("global")}>全球</button>
    <button className={scope === "national" ? "active" : ""} type="button" aria-pressed={scope === "national"} onClick={() => setScope("national")}>全国</button>
  </div>}><QuantifiedWorldMap label="科研机构区域分布" unit="家" points={points} scopeLabel={scope === "global" ? "全球演示样本" : "全国演示样本"} /></Panel>;
}

function ResearchChainDistribution({ chain, counts, scopeLabel, unit = "家", entityLabel = "机构" }: { chain: ChainStageData; counts: number[][]; scopeLabel: string; unit?: string; entityLabel?: string }) {
  const max = Math.max(...counts.flat(), 1);
  return <figure className="tp-research-field-distribution" aria-label={`${scopeLabel}在产业链各节点的演示分布`}>
    <figcaption><span>节点顺序与产业链全景一致</span><small>{entityLabel}可关联多个节点，各节点不相加为{entityLabel}总数</small></figcaption>
    <div className="tp-research-field-grid">{chain.map((lane, stageIndex) => <section className={chainLaneMeta[stageIndex].className} key={chainLaneMeta[stageIndex].label}>
      <header><div><strong>{chainLaneMeta[stageIndex].label}</strong><small>{chainLaneMeta[stageIndex].role}</small></div><span>{lane.length} 个节点</span></header>
      <ol>{lane.map((item, nodeIndex) => {
        const value = counts[stageIndex][nodeIndex];
        return <li key={item.name}><div><strong>{item.name}</strong><span>{value} {unit}</span></div><p>{item.note}</p><i><b style={{ "--tp-research-field-width": `${value / max * 100}%` } as CSSProperties} /></i></li>;
      })}</ol>
    </section>)}</div>
  </figure>;
}

function ResearchTechnologyDistribution({ stages, counts, scopeLabel = "科研机构", unit = "家", entityLabel = "机构" }: { stages: FrontierTechnologyStage[]; counts: number[][]; scopeLabel?: string; unit?: string; entityLabel?: string }) {
  const max = Math.max(...counts.flat(), 1);
  return <figure className="tp-research-technology-distribution" aria-label={`${scopeLabel}在技术链各领域的演示分布`}>
    <figcaption><span>技术阶段与科技前沿技术链一致</span><small>{entityLabel}可跨技术领域布局</small></figcaption>
    <div>{stages.map((stage, stageIndex) => <section className={`is-stage-${stageIndex + 1}`} key={stage.id}>
      <header><span>{String(stageIndex + 1).padStart(2, "0")}</span><div><strong>{stage.title}</strong><small>{stage.role}</small></div></header>
      <ol>{stage.categories.map((category, categoryIndex) => {
        const value = counts[stageIndex][categoryIndex];
        return <li key={category.id}><div><strong>{category.name}</strong><span>{value} {unit}</span></div><p>{category.summary} · {category.nodes.length} 个技术节点</p><i><b style={{ "--tp-research-field-width": `${value / max * 100}%` } as CSSProperties} /></i></li>;
      })}</ol>
    </section>)}</div>
  </figure>;
}

function ResearchRankingTable({ records }: { records: ResearchInstitutionRecord[] }) {
  const [metric, setMetric] = useState<ResearchRankingMetric>("score");
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const sorted = [...records].sort((a, b) => b[metric] - a[metric]);
  const pageCount = Math.ceil(sorted.length / pageSize);
  const visible = sorted.slice(page * pageSize, (page + 1) * pageSize);
  const selectMetric = (nextMetric: ResearchRankingMetric) => { setMetric(nextMetric); setPage(0); };
  return <div className="tp-research-ranking">
    <div className="tp-research-ranking-toolbar">
      <div className="tp-inline-tabs" role="group" aria-label="领先科研机构排序指标">{(Object.keys(researchRankingMetricLabels) as ResearchRankingMetric[]).map((item) => <button className={metric === item ? "active" : ""} type="button" aria-pressed={metric === item} onClick={() => selectMetric(item)} key={item}>{researchRankingMetricLabels[item]}</button>)}</div>
      <span aria-live="polite">按{researchRankingMetricLabels[metric]}降序 · 第 {page + 1} / {pageCount} 页</span>
    </div>
    <div className="tp-research-ranking-table">
      <table>
        <caption className="tp-visually-hidden">专题产业领先科研机构 Top 20 演示评价表</caption>
        <thead><tr><th>排名</th><th>科研机构</th><th>地区</th><th aria-sort={metric === "papers" ? "descending" : undefined}>论文</th><th aria-sort={metric === "patents" ? "descending" : undefined}>专利</th><th aria-sort={metric === "researchers" ? "descending" : undefined}>科研人数</th><th aria-sort={metric === "score" ? "descending" : undefined}>综合分</th></tr></thead>
        <tbody>{visible.map((record, index) => <tr key={record.id}><td>{String(page * pageSize + index + 1).padStart(2, "0")}</td><th scope="row">{record.name}</th><td>{record.region}</td><td>{record.papers.toLocaleString()} 篇</td><td>{record.patents.toLocaleString()} 件</td><td>{record.researchers.toLocaleString()} 人</td><td><strong>{record.score.toFixed(1)}</strong></td></tr>)}</tbody>
      </table>
    </div>
    <nav className="tp-research-ranking-pagination" aria-label="Top 20 分页"><span>当前显示 {page * pageSize + 1}—{Math.min((page + 1) * pageSize, records.length)} 位，共 {records.length} 位</span><div><button type="button" disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))}><ChevronLeft size={16} />上一页</button><button type="button" disabled={page >= pageCount - 1} onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))}>下一页<ChevronRight size={16} /></button></div></nav>
  </div>;
}

function ResearchOverview({ industry }: { industry: Industry }) {
  const data = createResearchDemoProfile(industry);
  const latestAdded = data.trend.at(-1)! - data.trend.at(-2)!;
  return <div className="tp-research-overview">
    <MetricStrip items={[
      { label: "科研机构数量", value: `${data.total.toLocaleString()} 家`, note: "全球演示机构样本", icon: Microscope },
      { label: "2025 年新增", value: `${latestAdded.toLocaleString()} 家`, note: "演示周期内新增", icon: Activity },
      { label: "产业链节点", value: `${data.chain.flat().length} 个`, note: "与专题全景同序", icon: Network },
      { label: "技术链领域", value: `${data.technologyStages.reduce((sum, stage) => sum + stage.categories.length, 0)} 个`, note: "与科技前沿同序", icon: Atom },
    ]} />
    <div className="tp-two-column tp-research-overview-grid">
      <Panel title="科研机构数量与历史趋势" description={`${industry} · 2020—2025 全球演示样本`}><TrendFigure label="科研机构历年数量" values={data.trend} /></Panel>
      <ResearchRegionPanel industry={industry} data={data} />
    </div>
    <Panel title="科研机构产业领域分布" description="结合产业链全景，展示科研机构在上中下游节点的布局" action={<DemoBadge>节点数量为演示统计</DemoBadge>}><ResearchChainDistribution chain={data.chain} counts={data.chainCounts} scopeLabel="全球科研机构" /></Panel>
    <Panel title="科研机构技术领域分布" description="结合未来产业技术链，展示科研机构在基础、共性与转化技术领域的布局" action={<DemoBadge>领域数量为演示统计</DemoBadge>}><ResearchTechnologyDistribution stages={data.technologyStages} counts={data.technologyCounts} /></Panel>
  </div>;
}

function LeadingResearchInstitutions({ industry }: { industry: Industry }) {
  const data = createResearchDemoProfile(industry);
  return <div className="tp-leading-research">
    <div className="tp-research-evaluation-note"><div><strong>{industry}领先科研机构 Top 20</strong><span>依据论文、专利与科研人数三项演示指标进行评价</span></div><DemoBadge>综合分为三项归一化后等权计算，非正式排名</DemoBadge></div>
    <Panel title="Top 20 评价结果" description="支持按综合评价、论文数量、专利数量或科研人数排序"><ResearchRankingTable records={data.ranking} /></Panel>
  </div>;
}

function ShenzhenResearchInstitutions({ industry }: { industry: Industry }) {
  const data = createResearchDemoProfile(industry);
  const latestAdded = data.shenzhenTrend.at(-1)! - data.shenzhenTrend.at(-2)!;
  return <div className="tp-shenzhen-research">
    <MetricStrip items={[
      { label: "深圳科研机构", value: `${data.shenzhenTotal} 家`, note: `${industry}演示机构样本`, icon: Microscope },
      { label: "2025 年新增", value: `${latestAdded} 家`, note: "演示周期内新增", icon: Activity },
      { label: "行政区覆盖", value: `${data.districtCounts.filter((item) => item.value > 0).length} 个`, note: "深圳行政区演示统计", icon: MapPin },
      { label: "产业链节点", value: `${data.chain.flat().length} 个`, note: "机构可关联多节点", icon: Network },
    ]} />
    <div className="tp-two-column tp-shenzhen-research-grid">
      <Panel title="数量与趋势" description={`${industry} · 2020—2025 深圳演示样本`}><TrendFigure label="深圳科研机构历年数量" values={data.shenzhenTrend} /></Panel>
      <Panel title="区域分布" description="深圳各行政区科研机构演示数量"><BarBreakdown suffix=" 家" items={data.districtCounts} /></Panel>
    </div>
    <Panel title="产业分布" description="结合产业链全景，展示深圳科研机构在产业链节点的布局" action={<DemoBadge>节点数量为演示统计</DemoBadge>}><ResearchChainDistribution chain={data.chain} counts={data.shenzhenChainCounts} scopeLabel="深圳科研机构" /></Panel>
  </div>;
}

function ResearchContent({ subId, industry }: { subId: string; industry: Industry }) {
  if (subId === "research-overview") return <ResearchOverview industry={industry} />;
  if (subId === "leading-research") return <LeadingResearchInstitutions industry={industry} />;
  return <ShenzhenResearchInstitutions industry={industry} />;
}

type TalentKind = "academic" | "industry";
type TalentPerson = {
  id: string;
  kind: TalentKind;
  rank: number;
  name: string;
  birthDate: string;
  nationality: string;
  education: string;
  almaMater: string;
  unit: string;
  specialty: string;
  position?: string;
  achievement: string;
  experience: { period: string; content: string }[];
  researchResults: string[];
  commercialResults: string[];
  honors: string[];
  isShenzhen: boolean;
};
type TalentDemoProfile = {
  total: number;
  nationalTotal: number;
  globalRegions: RegionCountPoint[];
  nationalRegions: RegionCountPoint[];
  chain: ChainStageData;
  chainCounts: number[][];
  technologyStages: FrontierTechnologyStage[];
  technologyCounts: number[][];
  academicPeople: TalentPerson[];
  industryPeople: TalentPerson[];
  shenzhenTotal: number;
  shenzhenTrend: number[];
  shenzhenChainCounts: number[][];
  shenzhenTechnologyCounts: number[][];
  shenzhenPeople: TalentPerson[];
};

const talentNames = [
  "林岚", "陈启", "周宁", "许清", "赵辰", "苏研", "梁青", "何川", "顾远", "沈嘉",
  "唐逸", "陆川", "孟宁", "叶舟", "韩青", "季衡", "罗颖", "郑柏", "冯越", "蒋晗",
  "魏然", "宋宜", "杜衡", "邵真", "曹澜", "袁知", "石璟", "白川", "施行", "秦湛",
] as const;
const talentNationalities = ["中国", "中国", "新加坡", "中国", "加拿大", "德国"] as const;
const talentSchools = ["湾区科技大学", "城市交叉科学大学", "先进工程学院", "国际前沿技术大学", "南方创新大学", "开放科学学院"] as const;
const talentAcademicFields = ["基础理论研究", "交叉方法研究", "关键机理研究", "工程科学研究", "数据方法研究", "系统技术研究"] as const;
const talentIndustryFields = ["技术战略", "产品研发", "工程转化", "产业运营", "质量体系", "场景应用"] as const;
const talentPositions = ["首席科学家", "研发副总裁", "技术总监", "总工程师", "产品平台主管", "产业发展负责人"] as const;
const talentProfileCache = new Map<Industry, TalentDemoProfile>();

function createTalentRegionPoints(total: number, scope: RegionScope): RegionCountPoint[] {
  const metadata = scope === "global"
    ? [{ name: "中国", x: 75, y: 48 }, { name: "北美", x: 22, y: 40 }, { name: "欧洲", x: 49, y: 34 }, { name: "东亚", x: 84, y: 44 }, { name: "其他地区", x: 57, y: 63 }]
    : [{ name: "粤港澳", x: 77, y: 55 }, { name: "长三角", x: 80, y: 49 }, { name: "京津冀", x: 78, y: 42 }, { name: "中西部", x: 70, y: 48 }, { name: "其他地区", x: 73, y: 58 }];
  const values = splitResearchTotal(total, scope === "global" ? [.36, .22, .18, .14, .1] : [.32, .24, .18, .16, .1]);
  return metadata.map((item, index) => ({ ...item, count: values[index] }));
}

function createTalentPeople(industry: Industry, kind: TalentKind): TalentPerson[] {
  const industryIndex = industries.indexOf(industry);
  return talentNames.map((name, index) => {
    const specialty = kind === "academic"
      ? `${industry}${talentAcademicFields[(index + industryIndex) % talentAcademicFields.length]}`
      : `${industry}${talentIndustryFields[(index + industryIndex) % talentIndustryFields.length]}`;
    const isShenzhen = index % 4 === industryIndex % 4;
    const startYear = 2005 + index % 5;
    const unitPrefix = isShenzhen ? "深圳" : ["北京", "上海", "广州", "杭州", "武汉", "成都"][(index + industryIndex) % 6];
    const unit = kind === "academic"
      ? `${unitPrefix}${industry}前沿研究院（虚构）`
      : `${unitPrefix}${industry}科技有限公司（虚构）`;
    const achievement = kind === "academic"
      ? `围绕${specialty}形成系列研究方法，牵头开放验证项目并发表代表性成果（演示）。`
      : `推动${specialty}从技术验证进入工程应用，完成产品化与跨机构协作项目（演示）。`;
    return {
      id: `${kind}-${industryIndex}-${index + 1}`,
      kind,
      rank: index + 1,
      name,
      birthDate: `${1972 + index % 15}-${String(index % 12 + 1).padStart(2, "0")}-${String(index % 26 + 1).padStart(2, "0")}`,
      nationality: talentNationalities[(index + industryIndex) % talentNationalities.length],
      education: kind === "academic" || index % 3 !== 0 ? "博士" : "硕士",
      almaMater: `${talentSchools[(index + industryIndex) % talentSchools.length]}（虚构）`,
      unit,
      specialty,
      position: kind === "industry" ? talentPositions[(index + industryIndex) % talentPositions.length] : undefined,
      achievement,
      experience: [
        { period: `${startYear}—${startYear + 4}`, content: `在${talentSchools[(index + industryIndex) % talentSchools.length]}完成专业学习与研究训练（虚构）` },
        { period: `${startYear + 4}—${startYear + 10}`, content: `参与${industry}关键问题研究及工程验证工作（虚构）` },
        { period: `${startYear + 10}—至今`, content: `在${unit}负责${specialty}与团队建设（虚构）` },
      ],
      researchResults: [achievement, `建立${industry}跨学科协同研究与数据验证方法（演示成果）。`],
      commercialResults: [`推动${industry}关键能力完成中试或场景验证（演示成绩）。`, `组织产业链协作项目并形成可复用实施框架（演示成绩）。`],
      honors: [`2024 年度${industry}交叉创新人才（虚构）`, `2025 年度未来产业协同贡献奖（虚构）`],
      isShenzhen,
    };
  });
}

function createTalentDemoProfile(industry: Industry): TalentDemoProfile {
  const industryIndex = industries.indexOf(industry);
  const panoramaProfile = panoramaProfiles[industry];
  const chain = getIndustryChain(industry, panoramaProfile);
  const technologyStages = createFrontierStages(industry);
  const total = 1680 + industryIndex * 145;
  const nationalTotal = Math.round(total * (.59 + industryIndex % 3 * .025));
  const shenzhenTotal = 192 + industryIndex * 17;
  const chainCounts = chain.map((lane, stageIndex) => lane.map((_, nodeIndex) => 42 + ((industryIndex * 13 + stageIndex * 19 + nodeIndex * 11) % 76)));
  const technologyCounts = technologyStages.map((stage, stageIndex) => stage.categories.map((_, categoryIndex) => 56 + ((industryIndex * 17 + stageIndex * 23 + categoryIndex * 13) % 92)));
  const shenzhenChainCounts = chain.map((lane, stageIndex) => lane.map((_, nodeIndex) => 9 + ((industryIndex * 5 + stageIndex * 7 + nodeIndex * 4) % 24)));
  const shenzhenTechnologyCounts = technologyStages.map((stage, stageIndex) => stage.categories.map((_, categoryIndex) => 13 + ((industryIndex * 7 + stageIndex * 9 + categoryIndex * 5) % 31)));
  const academicPeople = createTalentPeople(industry, "academic");
  const industryPeople = createTalentPeople(industry, "industry");
  return {
    total,
    nationalTotal,
    globalRegions: createTalentRegionPoints(total, "global"),
    nationalRegions: createTalentRegionPoints(nationalTotal, "national"),
    chain,
    chainCounts,
    technologyStages,
    technologyCounts,
    academicPeople,
    industryPeople,
    shenzhenTotal,
    shenzhenTrend: createCumulativeTrend(shenzhenTotal, [.52, .61, .7, .79, .9, 1]),
    shenzhenChainCounts,
    shenzhenTechnologyCounts,
    shenzhenPeople: [...academicPeople.filter((person) => person.isShenzhen).slice(0, 2), ...industryPeople.filter((person) => person.isShenzhen).slice(0, 2)],
  };
}

function getTalentDemoProfile(industry: Industry) {
  const cached = talentProfileCache.get(industry);
  if (cached) return cached;
  const profile = createTalentDemoProfile(industry);
  talentProfileCache.set(industry, profile);
  return profile;
}

function TalentRegionDistribution({ industry, data }: { industry: Industry; data: TalentDemoProfile }) {
  const [scope, setScope] = useState<RegionScope>("global");
  const points = scope === "global" ? data.globalRegions : data.nationalRegions;
  return <div className="tp-talent-stack">
    <MetricStrip items={[
      { label: "全球重点人才样本", value: `${data.total.toLocaleString()} 人`, note: `${industry}演示统计`, icon: Users },
      { label: "全国重点人才样本", value: `${data.nationalTotal.toLocaleString()} 人`, note: "演示统计范围", icon: MapPinned },
      { label: "区域样本", value: `${points.length} 个`, note: scope === "global" ? "全球区域" : "全国区域", icon: Globe2 },
      { label: "统计周期", value: "2025 年", note: "演示截面数据", icon: CalendarDays },
    ]} />
    <Panel title={`${industry}重点人才区域分布`} description="以地图与数量图表展示全球或全国重点人才演示样本" action={<div className="tp-inline-tabs" role="group" aria-label="重点人才区域范围"><button className={scope === "global" ? "active" : ""} type="button" aria-pressed={scope === "global"} onClick={() => setScope("global")}>全球</button><button className={scope === "national" ? "active" : ""} type="button" aria-pressed={scope === "national"} onClick={() => setScope("national")}>全国</button></div>}>
      <div className="tp-talent-region-layout">
        <QuantifiedWorldMap label="重点人才区域分布" unit="人" points={points} scopeLabel={scope === "global" ? "全球演示样本" : "全国演示样本"} />
        <section className="tp-talent-region-summary"><header><strong>区域人才数量</strong><small>一人只按当前工作地计入一个区域</small></header><BarBreakdown suffix=" 人" items={points.map((point) => ({ label: point.name, value: point.count }))} /></section>
      </div>
    </Panel>
  </div>;
}

function TalentDomainDistribution({ industry, data }: { industry: Industry; data: TalentDemoProfile }) {
  return <div className="tp-talent-stack">
    <Panel title="人才产业领域分布" description={`结合${industry}产业链全景，展示上游、中游与下游各节点的人才布局`} action={<DemoBadge>节点人数为演示统计</DemoBadge>}>
      <ResearchChainDistribution chain={data.chain} counts={data.chainCounts} scopeLabel={`${industry}人才`} unit="人" entityLabel="人才" />
    </Panel>
    <Panel title="人才技术领域分布" description="结合未来产业技术链，展示基础支撑、关键共性与应用转化领域的人才布局" action={<DemoBadge>领域人数为演示统计</DemoBadge>}>
      <ResearchTechnologyDistribution stages={data.technologyStages} counts={data.technologyCounts} scopeLabel={`${industry}人才`} unit="人" entityLabel="人才" />
    </Panel>
  </div>;
}

function TalentRanking({ people, kind }: { people: TalentPerson[]; kind: TalentKind }) {
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState(people[0].id);
  const pageSize = 10;
  const pageCount = Math.ceil(people.length / pageSize);
  const visible = people.slice(page * pageSize, (page + 1) * pageSize);
  const selected = people.find((person) => person.id === selectedId) ?? visible[0];
  const changePage = (nextPage: number) => {
    const bounded = Math.max(0, Math.min(pageCount - 1, nextPage));
    setPage(bounded);
    setSelectedId(people[bounded * pageSize].id);
  };
  const fieldLabel = kind === "academic" ? "专业" : "领域";
  const achievementLabel = kind === "academic" ? "重要学术成果" : "重要产业成绩";
  return <div className="tp-talent-ranking">
    <div className="tp-talent-ranking-note"><div><strong>{kind === "academic" ? "学术人才" : "产业人才"} Top 30</strong><span>综合评价指标与权重尚未提供，当前仅演示名单承载、字段与分页方式</span></div><DemoBadge>演示顺序 · 非正式排名</DemoBadge></div>
    <div className="tp-talent-ranking-workbench">
      <section className="tp-talent-ranking-list" aria-label={`${kind === "academic" ? "学术" : "产业"}人才名单`}>
        <header><span>排名与人才</span><small>第 {page + 1} / {pageCount} 页</small></header>
        <ol>{visible.map((person) => <li key={person.id}><button className={selected.id === person.id ? "active" : ""} type="button" aria-pressed={selected.id === person.id} onClick={() => setSelectedId(person.id)}><b>{String(person.rank).padStart(2, "0")}</b><span><strong>{person.name}<small>（虚构）</small></strong><em>{person.specialty}</em></span><i>{person.nationality}<small>{person.education}</small></i><ChevronRight size={15} aria-hidden="true" /></button></li>)}</ol>
        <nav aria-label="Top 30 分页"><button type="button" disabled={page === 0} onClick={() => changePage(page - 1)}><ChevronLeft size={15} />上一页</button><span>{page * pageSize + 1}—{Math.min((page + 1) * pageSize, people.length)} / {people.length}</span><button type="button" disabled={page >= pageCount - 1} onClick={() => changePage(page + 1)}>下一页<ChevronRight size={15} /></button></nav>
      </section>
      <article className="tp-talent-ranking-detail" aria-live="polite">
        <header><span>{String(selected.rank).padStart(2, "0")}</span><div><h4>{selected.name}<small>（虚构人物）</small></h4><p>{selected.specialty}</p></div></header>
        <dl>
          <div><dt>{fieldLabel}</dt><dd>{selected.specialty}</dd></div>
          <div><dt>国籍</dt><dd>{selected.nationality}</dd></div>
          <div><dt>学历</dt><dd>{selected.education}</dd></div>
          <div><dt>{kind === "academic" ? "当前单位" : "单位"}</dt><dd>{selected.unit}</dd></div>
          {kind === "industry" && <div><dt>职位</dt><dd>{selected.position}</dd></div>}
        </dl>
        <section><h5>{achievementLabel}</h5><p>{selected.achievement}</p></section>
      </article>
    </div>
  </div>;
}

function TalentProfileShowcase({ people, label }: { people: TalentPerson[]; label: string }) {
  const [selectedId, setSelectedId] = useState(people[0].id);
  const person = people.find((item) => item.id === selectedId) ?? people[0];
  return <div className="tp-talent-profile">
    <nav className="tp-talent-profile-switcher" aria-label={`${label}切换`}>{people.map((item) => <button className={person.id === item.id ? "active" : ""} type="button" aria-pressed={person.id === item.id} onClick={() => setSelectedId(item.id)} key={item.id}><span>{item.name}</span><small>{item.specialty}</small></button>)}</nav>
    <div className="tp-talent-profile-layout">
      <aside>
        <div className="tp-talent-avatar"><Users size={34} aria-hidden="true" /><small>演示头像</small></div>
        <h4>{person.name}<small>（虚构人物）</small></h4>
        <p>{person.specialty}</p>
        <dl><div><dt>出生日期</dt><dd>{person.birthDate}</dd></div><div><dt>国籍</dt><dd>{person.nationality}</dd></div><div><dt>单位</dt><dd>{person.unit}</dd></div><div><dt>学历</dt><dd>{person.education}</dd></div><div><dt>毕业院校</dt><dd>{person.almaMater}</dd></div></dl>
      </aside>
      <div className="tp-talent-profile-content" aria-live="polite">
        <section className="tp-talent-career"><h4>个人经历简介</h4><ol>{person.experience.map((item) => <li key={item.period}><time>{item.period}</time><span aria-hidden="true" /><p>{item.content}</p></li>)}</ol></section>
        <section className="tp-talent-results"><h4>重大成果介绍</h4><div><article><strong>科研成果</strong><ul>{person.researchResults.map((item) => <li key={item}><CheckCircle2 size={14} aria-hidden="true" />{item}</li>)}</ul></article><article><strong>商业与产业成绩</strong><ul>{person.commercialResults.map((item) => <li key={item}><CheckCircle2 size={14} aria-hidden="true" />{item}</li>)}</ul></article></div></section>
        <section className="tp-talent-honors"><h4>个人荣誉介绍</h4><ul>{person.honors.map((item) => <li key={item}><GraduationCap size={16} aria-hidden="true" /><span>{item}</span></li>)}</ul></section>
      </div>
    </div>
  </div>;
}

function TalentIndustryComparison({ industry }: { industry: Industry }) {
  const values = industries.map((item, index) => ({ label: item, value: 192 + index * 17 }));
  const max = Math.max(...values.map((item) => item.value), 1);
  return <div className="tp-talent-industry-comparison">{values.map((item) => <div className={item.label === industry ? "active" : ""} key={item.label}><span>{item.label}</span><i><b style={{ "--tp-talent-industry-width": `${item.value / max * 100}%` } as CSSProperties} /></i><strong>{item.value} 人</strong></div>)}</div>;
}

function ShenzhenTalentSection({ industry, data }: { industry: Industry; data: TalentDemoProfile }) {
  const latestAdded = data.shenzhenTrend.at(-1)! - data.shenzhenTrend.at(-2)!;
  return <div className="tp-talent-stack">
    <MetricStrip items={[
      { label: "深圳人才数量", value: `${data.shenzhenTotal} 人`, note: `${industry}演示样本`, icon: Users },
      { label: "2025 年新增", value: `${latestAdded} 人`, note: "演示周期内新增", icon: Activity },
      { label: "产业链节点", value: `${data.chain.flat().length} 个`, note: "人才可关联多节点", icon: Network },
      { label: "技术链领域", value: `${data.technologyStages.reduce((sum, stage) => sum + stage.categories.length, 0)} 个`, note: "人才可跨领域布局", icon: Atom },
    ]} />
    <div className="tp-two-column tp-talent-shenzhen-overview"><Panel title="深圳人才数量趋势" description={`${industry} · 2020—2025 演示样本`}><TrendFigure label="深圳人才历年数量" values={data.shenzhenTrend} /></Panel><Panel title="八大未来产业人才数量" description="当前专题产业以蓝色突出"><TalentIndustryComparison industry={industry} /></Panel></div>
    <Panel title="深圳人才产业领域分布" description="结合深圳产业链全景，展示人才在各产业链节点的布局" action={<DemoBadge>节点人数为演示统计</DemoBadge>}><ResearchChainDistribution chain={data.chain} counts={data.shenzhenChainCounts} scopeLabel={`深圳${industry}人才`} unit="人" entityLabel="人才" /></Panel>
    <Panel title="深圳人才技术领域分布" description="结合深圳技术链全景，展示人才在各技术领域的布局" action={<DemoBadge>领域人数为演示统计</DemoBadge>}><ResearchTechnologyDistribution stages={data.technologyStages} counts={data.shenzhenTechnologyCounts} scopeLabel={`深圳${industry}人才`} unit="人" entityLabel="人才" /></Panel>
    <Panel title="深圳重点人才介绍" description="展示基本信息、个人经历、重大成果与个人荣誉" action={<DemoBadge>人物资料为虚构演示</DemoBadge>}><TalentProfileShowcase people={data.shenzhenPeople} label="深圳重点人才" /></Panel>
  </div>;
}

function TalentContent({ subId, industry }: { subId: string; industry: Industry }) {
  const data = getTalentDemoProfile(industry);
  if (subId === "talent-map") return <TalentRegionDistribution industry={industry} data={data} />;
  if (subId === "talent-domain") return <TalentDomainDistribution industry={industry} data={data} />;
  if (subId === "academic-talent") return <Panel title={`${industry}学术人才 Top 30`} description="展示姓名、专业、国籍、学历、当前单位与重要学术成果"><TalentRanking people={data.academicPeople} kind="academic" /></Panel>;
  if (subId === "industry-talent") return <Panel title={`${industry}产业人才 Top 30`} description="展示姓名、领域、国籍、学历、单位、职位与重要产业成绩"><TalentRanking people={data.industryPeople} kind="industry" /></Panel>;
  if (subId === "talent-profile") return <Panel title="领军人才介绍" description="展示基本信息、个人经历、重大成果与个人荣誉" action={<DemoBadge>人物资料为虚构演示</DemoBadge>}><TalentProfileShowcase people={[data.academicPeople[0], data.industryPeople[1], data.academicPeople[2]]} label="领军人才" /></Panel>;
  return <ShenzhenTalentSection industry={industry} data={data} />;
}

function ServiceContent({ subId, industry }: { subId: string; industry: Industry }) {
  if (subId === "service-industry") return <Panel title={`${industry}服务机构产业分布`} description="结合产业链节点展示服务覆盖"><BarBreakdown items={[{ label: "基础材料服务", value: 44 }, { label: "技术研发服务", value: 78 }, { label: "工程验证服务", value: 62 }, { label: "成果转化服务", value: 71 }, { label: "市场服务", value: 53 }]} /></Panel>;
  if (subId === "service-region") return <Panel title="服务机构区域分布" description="全球或全国演示样本"><WorldMap label="服务机构样本分布" /></Panel>;
  if (subId === "service-capability") return <Panel title={`${industry}服务机构技术能力 Top 30 展示结构`} description="固定指标与权重尚未提供，当前不形成正式排名"><RankPreview title="服务机构技术能力评价结构" kind="服务机构" count={8} /></Panel>;
  if (subId === "shenzhen-service") return <>
    <MetricStrip items={[
      { label: "深圳服务机构样本", value: "42 家", note: "演示样本", icon: Handshake },
      { label: "机构类型", value: "6 类", note: "演示分类", icon: Layers3 },
      { label: "产业链覆盖", value: "8 / 9", note: "演示节点", icon: Network },
      { label: "重点机构样本", value: "8 家", note: "演示筛选", icon: ShieldCheck },
    ]} />
    <div className="tp-two-column"><Panel title="深圳服务机构趋势" description="演示样本"><TrendFigure label="深圳服务机构样本" values={[23, 27, 30, 34, 38, 42]} /></Panel><Panel title="机构类型统计" description="演示分类"><BarBreakdown suffix=" 家" items={[{ label: "孵化服务", value: 12 }, { label: "技术服务", value: 10 }, { label: "投融资服务", value: 8 }, { label: "知识产权服务", value: 7 }, { label: "其他", value: 5 }]} /></Panel></div>
    <Panel title="深圳重点产业服务机构" description="名称、成立时间、领导人、人数、营收、规模、服务领域与区域均为演示字段"><RankPreview title="重点服务机构展示结构" kind="服务机构" count={5} /></Panel>
  </>;
  return <>
    <MetricStrip items={[
      { label: "服务机构样本", value: "326 家", note: "全球演示样本", icon: Handshake },
      { label: "机构类型", value: "6 类", note: "演示分类", icon: Layers3 },
      { label: "覆盖区域", value: "16 个", note: "演示样本", icon: Globe2 },
      { label: "统计周期", value: "6 年", note: "2020—2025", icon: CalendarDays },
    ]} />
    <div className="tp-two-column"><Panel title="全球服务机构趋势" description={`${industry}演示样本`}><TrendFigure label="服务机构样本" values={[178, 205, 234, 266, 298, 326]} /></Panel><Panel title="服务机构规模分类" description="演示分类"><BarBreakdown items={[{ label: "大型机构", value: 22 }, { label: "中型机构", value: 43 }, { label: "小微机构", value: 35 }]} /></Panel></div>
  </>;
}

function PolicyContent({ subId, industry }: { subId: string; industry: Industry }) {
  const policyNews = [
    { date: "2026-07", title: "未来产业公共技术平台支持方向发布", region: "深圳", source: "科技主管部门公开信息（演示）" },
    { date: "2026-05", title: "产业关键技术联合攻关计划开放申报", region: "全国", source: "国家政策公开平台（演示）" },
    { date: "2026-02", title: "科技成果转化支持政策完成阶段更新", region: "华南", source: "产业服务平台（演示）" },
    { date: "2025-11", title: "未来产业协同创新政策发布实施说明", region: "全球", source: "研究机构公开信息（演示）" },
  ];
  if (subId === "policy-map") return <Panel title={`${industry}政策地图`} description="全国、省、市各级政策发布密度示意"><WorldMap scope="全国" label="政策发布密度" pins={["京津冀", "长三角", "粤港澳", "成渝"]} /></Panel>;
  if (subId === "policy-coverage") return <Panel title="政策产业覆盖" description="政策条目关联产业链节点"><BarBreakdown suffix=" 条" items={[{ label: "基础材料", value: 32 }, { label: "核心技术", value: 58 }, { label: "工程验证", value: 44 }, { label: "规模制造", value: 39 }, { label: "场景应用", value: 52 }]} /></Panel>;
  if (subId === "policy-ranking") return <Panel title="政策力度排名展示结构" description="标书要求省级与重点城市排序；当前无指标、权重和连续性口径"><RankPreview title="政策力度评价结构" kind="地区" count={8} /></Panel>;
  if (subId === "policy-news") return <Panel title="最新政策动态" description="按时间线展示并追溯至政策或新闻来源" action={<DemoBadge>政策条目为演示</DemoBadge>}>
    <ol className="tp-event-timeline">{policyNews.map((item, index) => <li key={item.title}><time>{item.date}</time><span className="tp-event-node">{index + 1}</span><article><div><span>{item.region}</span><small>{item.source}</small></div><h4>{industry} · {item.title}</h4><SourceLink /></article></li>)}</ol>
  </Panel>;
  if (subId === "shenzhen-policy") return <>
    <div className="tp-two-column"><Panel title="深圳政策数量趋势" description="演示政策样本"><TrendFigure label="深圳政策样本" values={[16, 21, 25, 31, 37, 43]} /></Panel><Panel title="深圳各区政策发布情况" description="演示行政区数据"><BarBreakdown suffix=" 条" items={[{ label: "南山区", value: 12 }, { label: "福田区", value: 9 }, { label: "龙岗区", value: 7 }, { label: "光明区", value: 6 }, { label: "其他区", value: 9 }]} /></Panel></div>
    <Panel title="深圳最新政策文件" description="来源地址为演示跳转"><ol className="tp-compact-list">{["产业关键技术攻关支持文件（演示）", "未来产业空间布局支持文件（演示）", "科技成果转化支持文件（演示）"].map((title) => <li key={title}><FileText size={17} /><span><strong>{title}</strong><small>2026 · 演示发布单位</small></span><SourceLink /></li>)}</ol></Panel>
  </>;
  return <>
    <MetricStrip items={[
      { label: "全国政策样本", value: "386 条", note: "演示统计", icon: Landmark },
      { label: "省级样本", value: "128 条", note: "演示统计", icon: MapIcon },
      { label: "市级样本", value: "214 条", note: "演示统计", icon: MapPin },
      { label: "连续周期", value: "6 年", note: "演示周期", icon: CalendarDays },
    ]} />
    <div className="tp-two-column"><Panel title="政策数量与连续性" description={`${industry}演示政策样本`}><TrendFigure label="政策样本数量" values={[42, 49, 57, 64, 73, 82]} /></Panel><Panel title="省市政策样本对比" description="演示分类"><BarBreakdown suffix=" 条" items={[{ label: "省级样本", value: 58 }, { label: "重点城市样本", value: 47 }, { label: "其他市级样本", value: 32 }]} /></Panel></div>
  </>;
}

type DistrictName = "南山区" | "福田区" | "罗湖区" | "宝安区" | "龙岗区" | "光明区" | "龙华区" | "坪山区" | "盐田区" | "大鹏新区";

const districts: { name: DistrictName; path: string; center: [number, number] }[] = [
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

const mapEntities = [
  { name: "湾区未来科技有限公司（虚构）", type: "重点企业", district: "南山区" as DistrictName, address: "南山区科技园片区（位置示意）" },
  { name: "鹏城交叉科学研究中心（虚构）", type: "科研机构", district: "光明区" as DistrictName, address: "光明科学城片区（位置示意）" },
  { name: "深科工程验证有限公司（虚构）", type: "重点企业", district: "龙岗区" as DistrictName, address: "龙岗大运片区（位置示意）" },
  { name: "湾区产业战略研究院（虚构）", type: "科研机构", district: "福田区" as DistrictName, address: "福田中心区（位置示意）" },
];

const mapLayers = ["产业发展", "技术分布", "企业分布", "科研机构", "人才分布", "政策支持"];

function ShenzhenMapWorkbench({ industry, compact = false, openDialog }: { industry: Industry; compact?: boolean; openDialog: (dialog: DialogState) => void }) {
  const [district, setDistrict] = useState<DistrictName>("南山区");
  const [layer, setLayer] = useState("产业发展");
  const [query, setQuery] = useState("");
  const matchedEntities = mapEntities.filter((entity) => `${entity.name}${entity.type}${entity.district}`.includes(query.trim()));
  const selectedIndex = districts.findIndex((item) => item.name === district);
  const districtSeed = Math.max(selectedIndex, 0) + 1;
  const selectEntity = (entity: (typeof mapEntities)[number]) => {
    setDistrict(entity.district);
    openDialog({
      title: entity.name,
      label: `${entity.type} · ${entity.district}`,
      body: <div className="tp-dialog-detail"><p>{entity.address}</p><dl><div><dt>所属专题</dt><dd>{industry}</dd></div><div><dt>对象类型</dt><dd>{entity.type}</dd></div><div><dt>样例能力</dt><dd>{entity.type === "重点企业" ? "工程验证、产品研发与场景交付" : "基础研究、技术评价与成果转化"}</dd></div></dl><DemoBadge>名称、位置与能力均为虚构样例</DemoBadge></div>,
    });
  };
  return <div className={`tp-map-workbench ${compact ? "tp-map-workbench-compact" : ""}`}>
    <div className="tp-map-toolbar">
      <label><span>行政区</span><select value={district} onChange={(event) => setDistrict(event.target.value as DistrictName)}>{districts.map((item) => <option key={item.name}>{item.name}</option>)}</select><ChevronDown size={15} /></label>
      <div className="tp-layer-tabs" role="group" aria-label="专题图层">{mapLayers.map((item) => <button className={layer === item ? "active" : ""} type="button" aria-pressed={layer === item} onClick={() => setLayer(item)} key={item}>{item}</button>)}</div>
    </div>
    <div className="tp-map-main">
      <figure className="tp-shenzhen-map">
        <svg viewBox="0 0 650 320" role="group" aria-label="深圳行政区示意地图，可选择行政区">
          <title>深圳行政区示意图</title><desc>本图不代表真实行政边界，可选择行政区查看演示指标。</desc>
          {districts.map((item, index) => <g className={district === item.name ? "active" : ""} role="button" tabIndex={0} aria-label={`选择${item.name}`} aria-pressed={district === item.name} onClick={() => setDistrict(item.name)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setDistrict(item.name); } }} key={item.name}>
            <path d={item.path} style={{ "--tp-map-level": .24 + (index % 5) * .09 } as CSSProperties} />
            <text x={item.center[0]} y={item.center[1]} textAnchor="middle">{item.name.replace("新区", "")}</text>
          </g>)}
          {mapEntities.map((entity) => {
            const target = districts.find((item) => item.name === entity.district)!;
            return <g className="tp-map-entity" role="button" tabIndex={0} aria-label={`查看${entity.name}`} onClick={() => selectEntity(entity)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectEntity(entity); } }} transform={`translate(${target.center[0] + 18} ${target.center[1] - 18})`} key={entity.name}><circle r="8" /><circle r="3" /></g>;
          })}
        </svg>
        <figcaption><span>深圳行政区示意地图 · {layer}</span><small>非行政边界，不用于实际空间判断</small></figcaption>
      </figure>
      <aside className="tp-map-side">
        <header><span>当前范围</span><h4>{district}</h4><p>{industry} · {layer}</p></header>
        <dl><div><dt>企业样本</dt><dd>{districtSeed * 7 + 18}<small>家</small></dd></div><div><dt>科研机构样本</dt><dd>{districtSeed * 2 + 5}<small>家</small></dd></div><div><dt>人才样本</dt><dd>{districtSeed * 31 + 120}<small>人</small></dd></div><div><dt>政策样本</dt><dd>{districtSeed + 6}<small>条</small></dd></div></dl>
        <DemoBadge>行政区指标均为演示</DemoBadge>
      </aside>
    </div>
    {!compact && <section className="tp-map-search">
      <label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索重点企业或科研机构" aria-label="搜索地图要素" /></label>
      <div>{(query.trim() ? matchedEntities : mapEntities).map((entity) => <button type="button" onClick={() => selectEntity(entity)} key={entity.name}><MapPin size={15} /><span><strong>{entity.name}</strong><small>{entity.type} · {entity.district}</small></span><ArrowRight size={15} /></button>)}</div>
    </section>}
  </div>;
}

function OneMapContent({ subId, industry, openDialog }: { subId: string; industry: Industry; openDialog: (dialog: DialogState) => void }) {
  if (subId === "map-statistics") return <>
    <MetricStrip items={[
      { label: "产业规模样本", value: "86.4", note: "演示指数", icon: Activity },
      { label: "企业机构样本", value: "128 家", note: "演示统计", icon: Building2 },
      { label: "论文专利样本", value: "9,600 项", note: "演示统计", icon: BookOpen },
      { label: "人才样本", value: "1,280 人", note: "演示统计", icon: Users },
    ]} />
    <div className="tp-two-column"><Panel title="产业与技术指标趋势" description="产业规模、论文与专利演示趋势"><TrendFigure label="产业与技术指标" values={[31, 39, 48, 57, 69, 82]} /></Panel><Panel title="企业、人才与科研结构" description="演示指标分布"><BarBreakdown items={[{ label: "企业数量", value: 78 }, { label: "企业人数", value: 64 }, { label: "重点人才", value: 52 }, { label: "科研机构", value: 59 }]} /></Panel></div>
  </>;
  if (subId === "map-indicators") return <Panel title={`${industry}专题图`} description="切换图层查看深圳各行政区指标渲染对比" action={<DemoBadge>空间与指标均为演示</DemoBadge>}><ShenzhenMapWorkbench industry={industry} compact openDialog={openDialog} /></Panel>;
  return <Panel title="地图分析工具" description="支持行政区点选、下拉切换与重点对象定位" action={<DemoBadge>地图及要素均为演示</DemoBadge>}><ShenzhenMapWorkbench industry={industry} openDialog={openDialog} /></Panel>;
}

type ReportRecord = {
  id: string;
  title: string;
  industry: Industry;
  subfield: string;
  date: string;
  institution: string;
  summary: string;
  scope: string;
  method: string;
  findings: string[];
  recommendations: string[];
};

const reportRecords: ReportRecord[] = [
  { id: "synbio-chassis", title: "底盘细胞工程化能力与产业协同研究（演示报告）", industry: "合成生物", subfield: "底盘细胞", date: "2026-07-18", institution: "湾区未来产业研究中心（虚构）", summary: "围绕底盘细胞设计、工程验证与规模制造，展示产业链和技术链联合研判结构。", scope: "覆盖菌种设计、自动化构建、发酵验证和下游应用四个环节，研究对象与数量均为演示样本。", method: "以演示产业链节点为骨架，综合论文、专利、企业和科研机构四类样例数据进行关联分析。", findings: ["工程验证节点连接技术成果与规模制造，是演示链条中的关键衔接环节。", "样例企业能力主要分布于底盘构建与小试验证，规模化服务环节相对集中。", "论文与专利主题在细胞工厂、代谢通路优化方向表现出较高关联度。"], recommendations: ["建立统一的底盘细胞能力描述字段，支持跨机构检索与比较。", "围绕工程验证节点组织可追溯的技术、企业和服务资源目录。", "正式研判应接入真实数据口径后再形成产业结论。"] },
  { id: "synbio-manufacturing", title: "生物制造中试服务体系观察（演示报告）", industry: "合成生物", subfield: "生物制造", date: "2025-11-26", institution: "城市创新要素实验室（虚构）", summary: "从中试平台、工艺放大和质量验证三个维度呈现生物制造服务体系的分析方式。", scope: "以生物基材料和功能分子两个演示场景为对象，覆盖研发、中试和量产准备阶段。", method: "将服务机构能力标签映射至产业链环节，并使用演示项目记录观察跨环节协同关系。", findings: ["中试条件和质量验证能力决定演示项目从实验室走向制造端的连续性。", "不同应用方向对发酵规模、分离纯化与检测能力的组合要求存在差异。", "样例服务资源在共享规则和能力描述方面仍需要统一表达。"], recommendations: ["按工艺环节建立中试设施与服务能力目录。", "在正式系统中补充产能、设备和质量体系等可核验字段。", "避免在缺少真实项目数据时输出服务能力排名。"] },
  { id: "blockchain-trusted-data", title: "可信数据流通基础设施研究（演示报告）", industry: "区块链", subfield: "可信数据流通", date: "2026-06-28", institution: "前沿科技战略研究室（虚构）", summary: "展示区块链在数据确权、流通记录和协同审计场景中的产业研究框架。", scope: "覆盖可信存证、数据授权、跨主体协同和审计追溯等演示环节。", method: "依据样例应用场景拆解功能节点，并关联技术能力、服务机构和政策条目。", findings: ["可信记录能力需要与身份、授权和审计机制共同形成完整流程。", "演示场景中跨主体规则一致性比单一链上性能更影响业务连续性。", "服务节点集中在平台建设，运营治理能力需要独立描述。"], recommendations: ["统一描述数据对象、授权边界和审计责任。", "为每个应用场景保留技术实现与治理规则两类证据。", "正式应用评价应使用经核验的运行数据。"] },
  { id: "blockchain-privacy", title: "隐私计算协同应用路径分析（演示报告）", industry: "区块链", subfield: "隐私计算", date: "2025-09-12", institution: "交叉科学与技术经济研究院（虚构）", summary: "围绕多方安全计算、联邦学习与可信执行环境，呈现技术组合及应用边界。", scope: "选取科研协作与产业数据协同两个演示场景，关注数据可用不可见的流程设计。", method: "按数据进入、联合计算、结果输出和审计四个阶段组织样例技术节点。", findings: ["不同隐私计算路线对数据规模、实时性和可信假设的要求并不相同。", "样例项目常以组合技术满足安全、性能和治理的多重约束。", "技术指标需要与实际业务约束同时呈现才具备比较意义。"], recommendations: ["按场景记录数据规模、时效和安全假设。", "提供技术组合的适用边界说明而非单一优劣排序。", "接入真实测试结果后再形成路线选择建议。"] },
  { id: "cell-gene-editing", title: "基因编辑工具链与转化环节研究（演示报告）", industry: "细胞与基因", subfield: "基因编辑", date: "2026-04-16", institution: "交叉科学与技术经济研究院（虚构）", summary: "梳理编辑工具、递送系统、效果评价和转化验证之间的演示技术链关系。", scope: "覆盖基础工具、递送载体、脱靶评估和验证服务四类演示节点。", method: "将论文与专利主题映射到技术链，并结合机构能力标签观察成果转化衔接。", findings: ["递送和安全评价是连接编辑工具与应用验证的关键演示节点。", "样例成果在工具研究端较丰富，在标准化评价字段上仍有信息缺口。", "不同应用对象对应的递送路线和评价重点差异明显。"], recommendations: ["按应用对象建立工具、递送和评价的组合视图。", "补充可追溯的实验条件与评价口径。", "正式报告不得以演示关联替代临床或监管结论。"] },
  { id: "cell-therapy", title: "细胞治疗研发与产业化路径观察（演示报告）", industry: "细胞与基因", subfield: "细胞治疗", date: "2024-12-20", institution: "湾区未来产业研究中心（虚构）", summary: "从细胞制备、质量控制、临床转化和供应链保障呈现产业化路径分析结构。", scope: "以免疫细胞与干细胞两个演示方向为对象，覆盖研发至生产准备阶段。", method: "按流程节点汇总样例企业、科研机构、专利和服务能力，观察协作关系。", findings: ["质量控制贯穿样例流程，是研发、生产与转化之间的共同接口。", "冷链、耗材和检测服务构成细胞制备之外的重要保障节点。", "不同细胞类型的工艺和评价要求不能使用同一指标简单比较。"], recommendations: ["建立分细胞类型的流程与能力字段。", "在正式数据中区分研发状态、生产能力与转化进度。", "所有临床相关结论应由合规来源提供并审核。"] },
  { id: "aerospace-commercial", title: "商业航天产业链协同能力研究（演示报告）", industry: "空天技术", subfield: "商业航天", date: "2026-03-08", institution: "湾区未来产业研究中心（虚构）", summary: "围绕卫星研制、发射服务、地面系统和运营应用展示产业链协同分析。", scope: "覆盖总体设计、关键部件、测试验证、发射与运营五类演示环节。", method: "使用演示企业与机构标签建立上下游连接，并按节点统计技术与服务样本。", findings: ["测试验证贯穿研制与发射准备，是演示链条中的高连接度节点。", "样例企业在部件和应用端分布较多，系统级协同需要进一步记录。", "产业链评价需要同时关注交付能力、可靠性与任务经验。"], recommendations: ["统一部件、系统和任务层级的能力描述。", "为关键节点补充供应关系和验证证据。", "正式产业判断需接入真实任务与交付数据。"] },
  { id: "aerospace-satellite", title: "卫星应用场景与数据服务观察（演示报告）", industry: "空天技术", subfield: "卫星应用", date: "2025-07-04", institution: "城市创新要素实验室（虚构）", summary: "以遥感、通信和导航增强为样例，展示卫星数据从获取到行业应用的服务链。", scope: "覆盖数据获取、处理、产品生成、行业交付和持续服务等演示阶段。", method: "按应用场景关联数据产品、算法能力、服务机构与用户需求标签。", findings: ["数据处理与行业知识结合决定演示产品能否形成稳定服务。", "不同场景对时效、精度和覆盖范围的需求差异显著。", "样例资源需要补充数据来源、更新频率和质量说明。"], recommendations: ["按场景明确数据质量、时效和服务边界。", "建立原始数据到应用产品的可追溯关系。", "正式服务能力应以可核验合同或运行记录为依据。"] },
  { id: "brain-interface", title: "脑机接口技术与应用生态研究（演示报告）", industry: "脑科学与类脑智能", subfield: "脑机接口", date: "2026-02-21", institution: "交叉科学与技术经济研究院（虚构）", summary: "聚焦信号采集、编解码、反馈控制和应用验证，呈现技术链与生态协同关系。", scope: "覆盖非侵入式与侵入式两个演示方向，内容不涉及医疗效果判断。", method: "将演示论文、专利、机构和企业映射至技术环节，观察节点连接和主题变化。", findings: ["信号质量与解码算法共同影响演示系统的稳定性和适用场景。", "应用验证需要硬件、算法与领域团队形成持续协同。", "不同技术路线的安全、精度和使用条件不可直接横向替代。"], recommendations: ["按技术路线分别展示采集方式、评价指标和适用边界。", "为应用验证保留数据来源与实验条件说明。", "医疗相关信息必须以合规审核材料为准。"] },
  { id: "brain-inspired", title: "类脑计算软硬件协同趋势观察（演示报告）", industry: "脑科学与类脑智能", subfield: "类脑计算", date: "2024-10-18", institution: "前沿科技战略研究室（虚构）", summary: "从神经形态器件、计算架构、算法模型和应用验证展示技术发展分析框架。", scope: "覆盖感知、计算与控制三个演示应用方向，关注软硬件协同关系。", method: "依据样例技术主题建立分层技术链，并对论文、专利和机构主体进行标签统计。", findings: ["器件、架构和算法之间的协同影响演示技术路线的整体表现。", "样例成果集中于局部能力验证，跨层评价字段仍不完整。", "能效、精度和延迟需要在同一使用场景下解释。"], recommendations: ["构建跨器件、架构和算法的统一指标说明。", "在正式系统中保留测试场景与数据集信息。", "避免脱离应用边界形成性能优劣结论。"] },
  { id: "deepsea-equipment", title: "深海装备技术链与保障体系研究（演示报告）", industry: "深地深海", subfield: "深海装备", date: "2026-01-09", institution: "前沿科技战略研究室（虚构）", summary: "围绕探测载荷、耐压结构、能源通信和海试保障展示装备技术链。", scope: "覆盖观测、采样、作业和保障四类演示任务，不代表真实装备性能。", method: "按任务流程关联技术节点、科研机构、企业与公共试验服务样本。", findings: ["海试与环境验证是连接样机研发和任务应用的重要演示节点。", "能源、通信和耐压能力在多个任务场景中形成共同依赖。", "装备信息需要区分研究样机、工程样机和任务运行状态。"], recommendations: ["按任务类型建立装备能力和验证记录。", "补充试验条件、运行深度等可核验元数据。", "正式性能评价应来源于授权测试记录。"] },
  { id: "deepearth-detection", title: "深地探测设施与数据协同观察（演示报告）", industry: "深地深海", subfield: "深地探测", date: "2025-05-30", institution: "城市创新要素实验室（虚构）", summary: "展示深地观测、实验设施、数据处理和科研协作的资源组织方式。", scope: "覆盖地球物理观测、深部取样、实验模拟和数据计算四类演示资源。", method: "以设施和数据资源为节点，关联样例团队、技术主题和共享服务。", findings: ["大型设施与数据平台共同构成跨团队协作的基础资源。", "样例数据在空间、时间和采集方法上的描述需要保持一致。", "资源共享状态与科研产出不能简单视为直接因果。"], recommendations: ["建立设施、样本和数据集之间的追溯关系。", "按授权范围呈现资源可用状态。", "使用真实项目数据前不输出产出效果判断。"] },
  { id: "vlc-communication", title: "可见光通信系统与场景适配研究（演示报告）", industry: "可见光通信与光计算", subfield: "可见光通信", date: "2025-03-14", institution: "湾区未来产业研究中心（虚构）", summary: "从光源器件、调制接收、网络控制和场景应用展示可见光通信技术链。", scope: "选取室内组网与特定环境通信两个演示场景，关注系统集成约束。", method: "按系统组成关联样例专利、论文、机构与企业能力，并记录场景指标。", findings: ["光源、接收和控制协议之间的匹配影响演示系统整体表现。", "不同场景对照明兼容、遮挡和移动性的要求存在明显差异。", "样例数据需要统一测试距离、环境与吞吐量口径。"], recommendations: ["以应用场景组织器件和系统指标。", "保留测试环境与系统配置以支持结果追溯。", "正式对比应基于同条件的权威测试数据。"] },
  { id: "optical-computing", title: "光计算芯片技术路线观察（演示报告）", industry: "可见光通信与光计算", subfield: "光计算芯片", date: "2024-08-09", institution: "交叉科学与技术经济研究院（虚构）", summary: "围绕光电器件、计算架构、封装测试和软件工具展示技术路线研究框架。", scope: "覆盖矩阵计算与光电融合两个演示方向，关注器件到系统的协同环节。", method: "依据样例论文和专利主题构建技术链，并标注机构与企业的能力位置。", findings: ["器件一致性、封装和控制软件共同影响演示系统的可扩展性。", "不同架构的精度、能效和适用任务需要在同一条件下描述。", "样例成果多位于原理验证阶段，产业化状态字段仍需补充。"], recommendations: ["按器件、芯片、系统和软件分层管理技术信息。", "明确测试任务、精度与功耗等指标口径。", "不以演示样本推导产业成熟度结论。"] },
  { id: "quantum-computing", title: "量子计算软硬件生态发展观察（演示报告）", industry: "量子信息", subfield: "量子计算", date: "2026-05-10", institution: "前沿科技战略研究室（虚构）", summary: "从关键器件、整机系统、开发工具和应用探索四个维度展示专题分析方法。", scope: "覆盖超导与光量子两个演示方向，不对具体路线作性能排名。", method: "将样例论文、专利、企业和科研机构映射至技术层级，观察协作与能力缺口。", findings: ["关键器件、控制系统和软件工具之间存在明显的跨层依赖。", "样例主体在基础研究和工具开发环节形成不同能力组合。", "量子比特规模不能脱离保真度、连接和任务条件单独解释。"], recommendations: ["建立分路线、分层级的技术与主体目录。", "为性能数据保留测试条件和来源信息。", "正式路线研判应由经核验的多指标数据支撑。"] },
  { id: "quantum-communication", title: "量子通信网络与器件协同研究（演示报告）", industry: "量子信息", subfield: "量子通信", date: "2024-06-21", institution: "城市创新要素实验室（虚构）", summary: "梳理量子光源、探测器、密钥系统和网络运维之间的演示产业关系。", scope: "覆盖城域与跨域两个演示网络场景，关注器件、系统和运行服务。", method: "按网络层级组织样例技术节点，并关联企业、机构与政策支持信息。", findings: ["器件稳定性与网络运维共同影响演示系统的持续可用性。", "城域和跨域场景对链路、节点与管理能力的要求不同。", "样例网络信息需要区分试验、示范与常态运行状态。"], recommendations: ["按网络场景建立器件与运行指标。", "保留建设状态、运行周期和数据来源字段。", "未接入真实运行数据前不形成网络能力评价。"] },
];

function downloadDemoReport(report: ReportRecord) {
  const content = [
    `# ${report.title}`,
    "",
    "> 本文件为虚构演示内容，仅用于展示专题研究报告查看与保存流程，不是正式研究成果。",
    "",
    "## 报告信息",
    `- 产业类型：${report.industry}`,
    `- 细分领域：${report.subfield}`,
    `- 发布时间：${report.date}`,
    `- 研究机构：${report.institution}`,
    "",
    "## 报告摘要",
    report.summary,
    "",
    "## 研究范围与方法",
    `${report.scope}\n\n${report.method}`,
    "",
    "## 关键发现",
    ...report.findings.map((item) => `- ${item}`),
    "",
    "## 研究建议",
    ...report.recommendations.map((item) => `- ${item}`),
  ].join("\n");
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${report.title.replace(/[\\/:*?\"<>|]/g, "-")}.md`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

function ReportList({ reports, selectedReportId, onOpen, onDownload }: { reports: ReportRecord[]; selectedReportId: string; onOpen: (report: ReportRecord) => void; onDownload: (report: ReportRecord) => void }) {
  if (!reports.length) return <div className="tp-empty-state"><FileSearch2 size={30} /><strong>未找到匹配的演示报告</strong><p>请调整产业、细分领域、日期范围或研究机构。</p></div>;
  return <ol className="tp-report-list">
    {reports.map((report) => <li className={selectedReportId === report.id ? "is-selected" : ""} key={report.id}>
      <time dateTime={report.date}><span>{report.date.slice(5, 7)}</span><b>{report.date.slice(8, 10)}</b><small>{report.date.slice(0, 4)}</small></time>
      <article><div><span>{report.industry}</span><span>{report.subfield}</span><small>{report.institution}</small></div><h4>{report.title}</h4><p>{report.summary}</p></article>
      <div className="tp-report-actions"><button className="tp-report-open" type="button" aria-current={selectedReportId === report.id ? "true" : undefined} onClick={() => onOpen(report)}><Eye size={16} />{selectedReportId === report.id ? "正在阅读" : "在线查看"}</button><button type="button" onClick={() => onDownload(report)}><Download size={16} />下载演示报告</button></div>
    </li>)}
  </ol>;
}

function ReportReader({ report, onDownload }: { report: ReportRecord; onDownload: (report: ReportRecord) => void }) {
  const sectionIds = {
    summary: `tp-report-${report.id}-summary`,
    scope: `tp-report-${report.id}-scope`,
    findings: `tp-report-${report.id}-findings`,
    recommendations: `tp-report-${report.id}-recommendations`,
  };
  return <article className="tp-report-reader">
    <header className="tp-report-document-header">
      <div><span>{report.industry} · {report.subfield}</span><h4>{report.title}</h4><p>{report.summary}</p></div>
      <DemoBadge>虚构演示内容</DemoBadge>
    </header>
    <dl className="tp-report-metadata"><div><dt>产业类型</dt><dd>{report.industry}</dd></div><div><dt>细分领域</dt><dd>{report.subfield}</dd></div><div><dt>发布时间</dt><dd>{report.date}</dd></div><div><dt>研究机构</dt><dd>{report.institution}</dd></div></dl>
    <div className="tp-report-reading-layout">
      <nav aria-label="报告内容目录"><strong>报告目录</strong><a href={`#${sectionIds.summary}`}>报告摘要</a><a href={`#${sectionIds.scope}`}>研究范围与方法</a><a href={`#${sectionIds.findings}`}>关键发现</a><a href={`#${sectionIds.recommendations}`}>研究建议</a></nav>
      <div className="tp-report-body">
        <section id={sectionIds.summary}><h5>报告摘要</h5><p>{report.summary}</p></section>
        <section id={sectionIds.scope}><h5>研究范围与方法</h5><p>{report.scope}</p><p>{report.method}</p></section>
        <section id={sectionIds.findings}><h5>关键发现</h5><ol>{report.findings.map((item) => <li key={item}>{item}</li>)}</ol></section>
        <section id={sectionIds.recommendations}><h5>研究建议</h5><ol>{report.recommendations.map((item) => <li key={item}>{item}</li>)}</ol></section>
      </div>
    </div>
    <footer><p>页面正文与下载文件使用同一份演示内容。</p><button className="tp-primary-button" type="button" onClick={() => onDownload(report)}><Download size={16} />下载当前演示报告</button></footer>
  </article>;
}

function ReportsContent({ subId, industry, selectedReportId, onSelectReport, showToast }: { subId: string; industry: Industry; selectedReportId: string; onSelectReport: (reportId: string) => void; showToast: (message: string) => void }) {
  const [industryFilter, setIndustryFilter] = useState<string>(industry);
  const [subfield, setSubfield] = useState("全部细分领域");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [institution, setInstitution] = useState("全部机构");
  const institutions = Array.from(new Set(reportRecords.map((item) => item.institution)));
  const subfields = Array.from(new Set(reportRecords.filter((item) => industryFilter === "全部产业" || item.industry === industryFilter).map((item) => item.subfield)));
  const dateRangeError = Boolean(startDate && endDate && startDate > endDate);
  const filtered = dateRangeError ? [] : reportRecords
    .filter((report) => (industryFilter === "全部产业" || report.industry === industryFilter)
      && (subfield === "全部细分领域" || report.subfield === subfield)
      && (!startDate || report.date >= startDate)
      && (!endDate || report.date <= endDate)
      && (institution === "全部机构" || report.institution === institution))
    .sort((left, right) => right.date.localeCompare(left.date));
  const download = (report: ReportRecord) => { downloadDemoReport(report); showToast("演示报告文件已开始下载"); };
  const selectedReport = reportRecords.find((report) => report.id === selectedReportId) ?? reportRecords[0];
  if (subId === "report-view") return <Panel title="产研报告查看保存" description="在线浏览当前报告，并将相同内容下载至本地保存" action={<DemoBadge>演示报告，不是正式成果</DemoBadge>}><ReportReader report={selectedReport} onDownload={download} /></Panel>;
  return <Panel title="产研报告目录" description="按产业类型、细分领域、发布时间范围和研究机构筛选" action={<DemoBadge>目录内容为演示</DemoBadge>}>
    <form className="tp-report-filters" onSubmit={(event) => event.preventDefault()}>
      <label><span>产业类型</span><select value={industryFilter} onChange={(event) => { setIndustryFilter(event.target.value); setSubfield("全部细分领域"); }}><option>全部产业</option>{industries.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></label>
      <label><span>细分领域</span><select value={subfield} onChange={(event) => setSubfield(event.target.value)}><option>全部细分领域</option>{subfields.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></label>
      <label><span>研究机构</span><select value={institution} onChange={(event) => setInstitution(event.target.value)}><option>全部机构</option>{institutions.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></label>
      <label className="tp-report-date-field"><span>开始日期</span><input type="date" value={startDate} max={endDate || undefined} onInput={(event) => setStartDate(event.currentTarget.value)} onChange={(event) => setStartDate(event.target.value)} aria-label="报告发布时间开始日期" /></label>
      <label className="tp-report-date-field"><span>结束日期</span><input type="date" value={endDate} min={startDate || undefined} onInput={(event) => setEndDate(event.currentTarget.value)} onChange={(event) => setEndDate(event.target.value)} aria-label="报告发布时间结束日期" /></label>
      <button type="button" onClick={() => { setIndustryFilter("全部产业"); setSubfield("全部细分领域"); setStartDate(""); setEndDate(""); setInstitution("全部机构"); }}><RotateCcw size={15} />重置筛选</button>
      {dateRangeError && <p className="tp-report-filter-error" role="alert"><CircleAlert size={15} />开始日期不能晚于结束日期，请重新选择。</p>}
    </form>
    <div className="tp-result-summary"><span>当前找到 <strong>{filtered.length}</strong> 份演示报告</span><small>按完整发布日期倒序</small></div>
    <ReportList reports={filtered} selectedReportId={selectedReportId} onOpen={(report) => onSelectReport(report.id)} onDownload={download} />
  </Panel>;
}

type PlatformNoticeType = "维护通知" | "版本介绍" | "运营公告";
type PlatformNoticeRecord = { id: string; type: PlatformNoticeType; date: string; title: string; summary: string; detail: string; scope: string };
type FeedbackAttachment = { id: string; name: string; size: number };
type FeedbackRecord = { id: number; category: string; subject: string; content: string; status: string; date: string; unread: boolean; reply: string; attachments: string[] };

const platformDataVolumes = [
  { label: "产业", value: 29.8 }, { label: "技术", value: 24.6 }, { label: "企业", value: 21.9 }, { label: "科研机构", value: 16.4 },
  { label: "人才", value: 14.7 }, { label: "服务机构", value: 11.8 }, { label: "政策", value: 15.1 }, { label: "研究报告", value: 8.6 },
];

const platformDataFormats = [
  { label: "结构化数据表", value: 32, color: "#1769cc" }, { label: "知识图谱", value: 18, color: "#337fc7" },
  { label: "统计图表", value: 16, color: "#4f92c0" }, { label: "空间地图", value: 14, color: "#62a2b7" },
  { label: "研究报告", value: 12, color: "#7ab2ba" }, { label: "资讯文本", value: 8, color: "#9ac4c2" },
];

const platformNotices: PlatformNoticeRecord[] = [
  { id: "notice-maintenance", type: "维护通知", date: "2026-08-15", title: "专题图谱服务维护说明（演示）", summary: "展示计划维护公告的影响范围、时间和用户操作说明。", detail: "演示维护窗口为 2026-08-20 22:00—23:30，期间产业链与技术链图谱可能短时不可用，其余浏览与检索功能保持开放。", scope: "产业链全景、未来产业技术链全景" },
  { id: "notice-release", type: "版本介绍", date: "2026-08-10", title: "科技专题服务功能更新（演示）", summary: "新增报告细分领域与日期范围筛选，完善在线阅读和保存流程。", detail: "本条用于展示版本公告的内容结构，包括更新范围、操作变化和注意事项，不代表正式版本发布记录。", scope: "专题研究报告、平台介绍" },
  { id: "notice-data", type: "运营公告", date: "2026-08-06", title: "演示数据口径说明", summary: "页面数据、对象、排序和结论均用于功能演示，不构成正式研判。", detail: "产业名称来自已确认范围；数量、机构、人物、公告和报告正文均为虚构演示内容。正式使用时应同步展示来源、统计周期与更新说明。", scope: "科技专题服务全部模块" },
  { id: "notice-guide", type: "运营公告", date: "2026-07-28", title: "专题服务使用指引（演示）", summary: "说明从专题产业选择到模块筛选、内容定位和报告保存的基本路径。", detail: "先在页面顶部选择专题产业，再从左侧功能目录进入业务模块；模块内容在中间平铺展示，可使用右侧定位器快速到达具体区块。", scope: "页面导航与操作" },
];

const defaultFeedbackRecords: FeedbackRecord[] = [
  { id: 1, category: "数据问题", subject: "数据字段说明咨询（演示）", content: "请说明专题指标的统计周期、来源字段和更新时间。", status: "已回复", date: "2026-08-08", unread: true, reply: "演示回复：正式指标将同时展示来源、统计周期与更新时间；当前页面数据均为演示。", attachments: ["指标字段截图.png"] },
  { id: 2, category: "功能建议", subject: "报告筛选方式建议（演示）", content: "建议报告目录支持细分领域和日期范围组合筛选。", status: "已回复", date: "2026-08-02", unread: false, reply: "演示回复：报告目录已增加细分领域与起止日期筛选。", attachments: [] },
];

const feedbackStorageKey = "gkx-platform-feedback-demo-v1";

function formatAttachmentSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function readFeedbackRecords() {
  try {
    const stored = window.sessionStorage.getItem(feedbackStorageKey);
    const parsed = stored ? JSON.parse(stored) : null;
    return Array.isArray(parsed) ? parsed as FeedbackRecord[] : defaultFeedbackRecords;
  } catch {
    return defaultFeedbackRecords;
  }
}

function PlatformDataContent() {
  return <>
    <MetricStrip items={[
      { label: "数据类目", value: "8 类", note: "产业至研究报告", icon: Layers3 },
      { label: "演示数据体量", value: "142.9 万条", note: "非正式统计", icon: Database },
      { label: "内容形式", value: "6 种", note: "数据表、图谱、地图等", icon: BarChart3 },
      { label: "服务模块", value: "11 项", note: "覆盖浏览、分析与反馈", icon: ShieldCheck },
    ]} />
    <div className="tp-platform-data-grid">
      <Panel title="数据类目与体量" description="八类演示数据的样本量级，不代表正式平台存量">
        <figure className="tp-platform-volume-chart" aria-label="八类演示数据体量条形图"><figcaption><span>演示数据样本量</span><small>单位：万条</small></figcaption><ol>{platformDataVolumes.map((item) => <li key={item.label}><span>{item.label}</span><div><i style={{ "--tp-platform-volume": `${item.value / 29.8 * 100}%` } as CSSProperties} /></div><strong>{item.value}</strong></li>)}</ol></figure>
      </Panel>
      <Panel title="数据形式构成" description="同一数据对象可通过多种形式组织与呈现">
        <figure className="tp-platform-format-chart" aria-label="六种数据形式构成图"><div className="tp-platform-format-strip">{platformDataFormats.map((item) => <i title={`${item.label} ${item.value}%`} style={{ "--tp-format-width": `${item.value}%`, "--tp-format-color": item.color } as CSSProperties} key={item.label} />)}</div><figcaption><ul>{platformDataFormats.map((item) => <li key={item.label}><i style={{ "--tp-format-color": item.color } as CSSProperties} /><span>{item.label}</span><strong>{item.value}%</strong></li>)}</ul></figcaption></figure>
      </Panel>
    </div>
    <Panel title="数据服务方式" description="数据类目、内容形式与平台功能之间的服务关系">
      <div className="tp-platform-service-table"><table><thead><tr><th>服务方式</th><th>主要数据</th><th>页面能力</th></tr></thead><tbody><tr><td>专题浏览</td><td>产业、技术、企业、科研、人才</td><td>概况、趋势、分布与图谱</td></tr><tr><td>空间研判</td><td>企业、科研、人才、政策</td><td>专题地图、行政区切换与定位</td></tr><tr><td>研究检索</td><td>资讯、政策、研究报告</td><td>组合筛选、全文检索与在线阅读</td></tr><tr><td>用户协作</td><td>问题、建议、附件与回复</td><td>咨询提交、反馈记录与新回复提醒</td></tr></tbody></table><DemoBadge>内容与体量均为演示</DemoBadge></div>
    </Panel>
  </>;
}

function PlatformNoticeContent() {
  const [noticeFilter, setNoticeFilter] = useState<"全部公告" | PlatformNoticeType>("全部公告");
  const [expandedNoticeId, setExpandedNoticeId] = useState(platformNotices[0].id);
  const visibleNotices = noticeFilter === "全部公告" ? platformNotices : platformNotices.filter((notice) => notice.type === noticeFilter);
  return <Panel title="平台通知公告" description="系统维护、版本介绍等公告由平台运营人员发布" action={<DemoBadge>公告内容为演示</DemoBadge>}>
    <div className="tp-notice-toolbar" role="group" aria-label="公告类型筛选">{(["全部公告", "维护通知", "版本介绍", "运营公告"] as const).map((type) => <button className={noticeFilter === type ? "active" : ""} type="button" aria-pressed={noticeFilter === type} onClick={() => { setNoticeFilter(type); setExpandedNoticeId(""); }} key={type}>{type}<span>{type === "全部公告" ? platformNotices.length : platformNotices.filter((notice) => notice.type === type).length}</span></button>)}</div>
    <ol className="tp-notice-list">{visibleNotices.map((notice) => { const expanded = expandedNoticeId === notice.id; return <li className={expanded ? "is-expanded" : ""} key={notice.id}><button type="button" aria-expanded={expanded} aria-controls={`tp-notice-detail-${notice.id}`} onClick={() => setExpandedNoticeId(expanded ? "" : notice.id)}><time dateTime={notice.date}>{notice.date}</time><span><small>{notice.type}</small><strong>{notice.title}</strong><p>{notice.summary}</p></span><ChevronRight size={17} aria-hidden="true" /></button>{expanded && <div id={`tp-notice-detail-${notice.id}`} className="tp-notice-detail" role="region" aria-label={`${notice.title}详情`}><p>{notice.detail}</p><dl><div><dt>影响范围</dt><dd>{notice.scope}</dd></div><div><dt>公告性质</dt><dd>虚构演示公告</dd></div></dl></div>}</li>; })}</ol>
  </Panel>;
}

function PlatformFeedbackContent({ showToast }: { showToast: (message: string) => void }) {
  const [feedbackCategory, setFeedbackCategory] = useState("数据问题");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<FeedbackAttachment[]>([]);
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackFilter, setFeedbackFilter] = useState<"全部记录" | "新回复">("全部记录");
  const [records, setRecords] = useState<FeedbackRecord[]>(readFeedbackRecords);
  const newReplyCount = records.filter((record) => record.unread).length;
  const visibleRecords = feedbackFilter === "全部记录" ? records : records.filter((record) => record.unread);
  useEffect(() => {
    try { window.sessionStorage.setItem(feedbackStorageKey, JSON.stringify(records)); } catch { /* Session persistence is best-effort. */ }
  }, [records]);
  const handleAttachmentFiles = (files: FileList | null) => {
    const selectedFiles = Array.from(files ?? []);
    if (!selectedFiles.length) return;
    if (attachments.length + selectedFiles.length > 5) {
      setFeedbackError("最多添加 5 个附件，请移除部分文件后重试。");
      return;
    }
    const invalidFile = selectedFiles.find((file) => !(file.type.startsWith("image/") || /\.(pdf|docx?|txt)$/i.test(file.name)));
    if (invalidFile) {
      setFeedbackError(`“${invalidFile.name}”格式不支持，请选择图片、PDF、Word 或 TXT 文件。`);
      return;
    }
    const oversizedFile = selectedFiles.find((file) => file.size > 10 * 1024 * 1024);
    if (oversizedFile) {
      setFeedbackError(`“${oversizedFile.name}”超过 10 MB，请压缩后重试。`);
      return;
    }
    setAttachments((current) => [...current, ...selectedFiles.map((file) => ({ id: `${file.name}-${file.size}-${file.lastModified}`, name: file.name, size: file.size }))].filter((item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index));
    setFeedbackError("");
  };
  const submitFeedback = (event: FormEvent) => {
    event.preventDefault();
    if (!subject.trim() || !content.trim()) {
      setFeedbackError("请填写咨询主题和咨询内容后再提交。");
      return;
    }
    if (content.trim().length < 10) {
      setFeedbackError("咨询内容至少需要 10 个字，请补充问题背景或改进建议。");
      return;
    }
    setRecords((current) => [{ id: Date.now(), category: feedbackCategory, subject: subject.trim(), content: content.trim(), status: "本次会话已记录", date: new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Shanghai" }), unread: false, reply: "", attachments: attachments.map((item) => item.name) }, ...current]);
    setSubject(""); setContent(""); setAttachments([]); setFeedbackError(""); setFeedbackFilter("全部记录");
    showToast("咨询已加入本次演示反馈记录");
  };
  return <div className="tp-feedback-layout">
    <Panel title="问题咨询" description="支持文字、图片及相关附件的演示提交">
      <form className="tp-feedback-form" onSubmit={submitFeedback} noValidate>
        <label><span>问题类型</span><span className="tp-feedback-select"><select value={feedbackCategory} onChange={(event) => setFeedbackCategory(event.target.value)}><option>数据问题</option><option>功能建议</option><option>内容纠错</option><option>其他咨询</option></select><ChevronDown size={15} aria-hidden="true" /></span></label>
        <label><span>咨询主题</span><input value={subject} onChange={(event) => { setSubject(event.target.value); setFeedbackError(""); }} maxLength={60} placeholder="请输入咨询或建议主题" aria-invalid={Boolean(feedbackError && !subject.trim())} aria-describedby={feedbackError ? "tp-feedback-error" : undefined} required /></label>
        <label><span>咨询内容</span><textarea value={content} onChange={(event) => { setContent(event.target.value); setFeedbackError(""); }} maxLength={500} rows={6} placeholder="请描述数据问题、疑问或改进建议" aria-invalid={Boolean(feedbackError && content.trim().length < 10)} aria-describedby={feedbackError ? "tp-feedback-error" : undefined} required /><small>{content.length} / 500</small></label>
        <label className="tp-file-field"><span>图片或附件</span><span className="tp-upload-control"><Upload size={17} />选择文件<input type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" aria-describedby="tp-upload-note" onChange={(event) => { handleAttachmentFiles(event.target.files); event.currentTarget.value = ""; }} /></span><small id="tp-upload-note">支持图片、PDF、Word、TXT；单个不超过 10 MB，最多 5 个。文件仅保留在本次演示会话。</small></label>
        {attachments.length > 0 && <ul className="tp-attachment-list" aria-label="已选择附件">{attachments.map((attachment) => <li key={attachment.id}><FileText size={15} aria-hidden="true" /><span><strong>{attachment.name}</strong><small>{formatAttachmentSize(attachment.size)}</small></span><button type="button" aria-label={`移除附件 ${attachment.name}`} onClick={() => setAttachments((current) => current.filter((item) => item.id !== attachment.id))}><X size={14} /></button></li>)}</ul>}
        {feedbackError && <p id="tp-feedback-error" className="tp-form-error" role="alert"><CircleAlert size={15} />{feedbackError}</p>}
        <button className="tp-primary-button" type="submit"><Send size={16} />提交演示咨询</button>
      </form>
    </Panel>
    <Panel title="反馈记录" description="查看运营回复；新回复以标记提醒" action={<span className="tp-feedback-new-count">{newReplyCount} 条新回复</span>}>
      <div className="tp-feedback-toolbar" role="group" aria-label="反馈记录筛选"><button className={feedbackFilter === "全部记录" ? "active" : ""} type="button" aria-pressed={feedbackFilter === "全部记录"} onClick={() => setFeedbackFilter("全部记录")}>全部记录 <span>{records.length}</span></button><button className={feedbackFilter === "新回复" ? "active" : ""} type="button" aria-pressed={feedbackFilter === "新回复"} onClick={() => setFeedbackFilter("新回复")}>新回复 <span>{newReplyCount}</span></button></div>
      {visibleRecords.length ? <ol className="tp-feedback-records">{visibleRecords.map((record) => <li className={record.unread ? "unread" : ""} key={record.id}><header><div><span>{record.category}</span><strong>{record.subject}</strong>{record.unread && <b>新回复</b>}</div><small>{record.date} · {record.status}</small></header><p>{record.content}</p>{record.attachments.length > 0 && <div className="tp-feedback-attachments"><FileText size={14} aria-hidden="true" /><span>{record.attachments.join("、")}</span></div>}{record.reply ? <blockquote><strong>运营回复（演示）</strong><p>{record.reply}</p></blockquote> : <div className="tp-feedback-pending"><Clock3 size={15} aria-hidden="true" />本次会话记录尚无运营回复</div>}{record.unread && <button type="button" onClick={() => setRecords((current) => current.map((item) => item.id === record.id ? { ...item, unread: false } : item))}><CheckCircle2 size={14} />标记为已读</button>}</li>)}</ol> : <div className="tp-feedback-empty"><CheckCircle2 size={24} /><strong>没有未读的新回复</strong><p>收到新回复后会在这里显示提醒。</p></div>}
    </Panel>
  </div>;
}

function PlatformPositionContent({ onNavigate }: { onNavigate: (module: ModuleId, sub: string) => void }) {
  return <>
    <Panel title="平台定位" description="连接专题产业证据，服务产业研究、信息发现与决策支持" action={<DemoBadge>定位说明</DemoBadge>}>
      <div className="tp-platform-positioning"><section><Landmark size={30} aria-hidden="true" /><div><h4>科技专题服务</h4><p>面向未来产业，把分散的产业、技术与创新要素组织到同一专题上下文中。</p></div><dl><div><dt>服务对象</dt><dd>产业研究者、决策者与科研用户</dd></div><div><dt>核心目标</dt><dd>快速理解、比较、筛选与定位科技信息</dd></div><div><dt>数据范围</dt><dd>全球、全国、深圳及行政区多层级</dd></div></dl></section><div><h4>平台目标</h4><ol><li><Network size={18} /><span><strong>统一组织</strong><small>以产业链和技术链建立信息关联</small></span></li><li><Database size={18} /><span><strong>汇聚证据</strong><small>连接企业、科研、人才、服务、政策与报告</small></span></li><li><MapPinned size={18} /><span><strong>辅助研判</strong><small>通过趋势、图谱与空间指标观察差异</small></span></li></ol></div></div>
      <ol className="tp-platform-value-flow" aria-label="平台服务路径"><li><span>专题产业上下文</span><small>八大未来产业与细分领域</small></li><ArrowRight size={18} aria-hidden="true" /><li><span>多维科技证据</span><small>产业、技术、主体与政策数据</small></li><ArrowRight size={18} aria-hidden="true" /><li><span>可操作的信息服务</span><small>浏览、比较、筛选、定位与反馈</small></li></ol>
    </Panel>
    <Panel title="主要功能与使用方式" description="11 项一级功能均来自标书范围，点击可直接进入对应模块"><div className="tp-function-index">{moduleDefinitions.map((item) => { const Icon = item.icon; return <button type="button" onClick={() => onNavigate(item.id, item.subs[0].id)} key={item.id}><Icon size={16} aria-hidden="true" /><span>{item.label}</span><ChevronRight size={14} aria-hidden="true" /></button>; })}</div><ol className="tp-operation-flow"><li><span>1</span><div><strong>选择专题产业</strong><small>在页面顶部确定当前产业上下文</small></div></li><li><span>2</span><div><strong>进入功能模块</strong><small>从左侧目录选择需要查看的服务</small></div></li><li><span>3</span><div><strong>筛选并定位内容</strong><small>使用区块控件和右侧定位器完成操作</small></div></li></ol></Panel>
  </>;
}

function PlatformContent({ subId, showToast, onNavigate }: { subId: string; showToast: (message: string) => void; onNavigate: (module: ModuleId, sub: string) => void }) {
  if (subId === "platform-data") return <PlatformDataContent />;
  if (subId === "platform-notice") return <PlatformNoticeContent />;
  if (subId === "platform-feedback") return <PlatformFeedbackContent showToast={showToast} />;
  return <PlatformPositionContent onNavigate={onNavigate} />;
}

type SearchRecord = { id: string; module: ModuleId; sub: string; section: string; title: string; content: string };

const searchableRecords: SearchRecord[] = [
  { id: "s1", module: "panorama", sub: "chain", section: "专题全景", title: "产业链全景与细分产业节点", content: "展示上游产业、下游产业、细分产业、主流工艺、产业环节和依赖关系。" },
  { id: "s2", module: "frontier", sub: "tech-overview", section: "科技前沿", title: "未来产业总体技术概况", content: "展示论文数量、专利数量、区域分布、机构主体与技术资讯统计。" },
  { id: "s3", module: "enterprise", sub: "enterprise-map", section: "企业发展", title: "重点企业全景图", content: "按产业分类展示全产业链重点企业、规模类型与领域分布。" },
  { id: "s4", module: "research", sub: "leading-research", section: "科研力量", title: "专题产业领先科研机构", content: "依据论文、专利、人数等指标展示科研机构评价结构。" },
  { id: "s5", module: "talent", sub: "talent-domain", section: "领军人才", title: "人才领域分布", content: "结合产业链及技术链展示产业人才和技术人才分布。" },
  { id: "s6", module: "service", sub: "service-capability", section: "专题服务", title: "服务机构技术能力", content: "按固定指标维度评价各产业服务机构技术能力。" },
  { id: "s7", module: "policy", sub: "policy-coverage", section: "政策扶持", title: "政策产业覆盖", content: "结合产业链展示各产业链节点的政策覆盖情况。" },
  { id: "s8", module: "one-map", sub: "map-tools", section: "专题一张图", title: "地图分析工具", content: "支持行政区边界切换、下拉切换和重点企业科研机构要素定位。" },
  { id: "s9", module: "reports", sub: "report-catalog", section: "专题研究报告", title: "产研报告目录", content: "根据产业类型、发布时间和研究机构对产业报告进行分类筛选。" },
  { id: "s10", module: "platform", sub: "platform-feedback", section: "平台介绍", title: "问题咨询反馈", content: "支持文字、图片和附件咨询，查看运营团队回复与新回复提醒。" },
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightText({ text, query, regexMode }: { text: string; query: string; regexMode: boolean }) {
  if (!query) return <>{text}</>;
  try {
    const source = regexMode ? query : escapeRegExp(query);
    const regex = new RegExp(`(${source})`, "gi");
    return <>{text.split(regex).map((part, index) => regex.test(part) ? <mark key={`${part}-${index}`}>{part}</mark> : <span key={`${part}-${index}`}>{part}</span>)}</>;
  } catch {
    return <>{text}</>;
  }
}

function SearchContent({ subId, onNavigate }: { subId: string; onNavigate: (module: ModuleId, sub: string) => void }) {
  const [query, setQuery] = useState("产业链");
  const [submittedQuery, setSubmittedQuery] = useState("产业链");
  const [mode, setMode] = useState<"fuzzy" | "regex">("fuzzy");
  const [sectionFilter, setSectionFilter] = useState("全部板块");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem("tp-search-history") ?? "[]");
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string").slice(0, 6) : [];
    } catch { return []; }
  });
  useEffect(() => { window.localStorage.setItem("tp-search-history", JSON.stringify(history)); }, [history]);
  const runSearch = (value = query, nextMode = mode) => {
    const normalized = value.trim();
    if (!normalized) { setError("请输入需要检索的关键词或关联表达式。"); return; }
    if (normalized.length > 80) { setError("检索内容请控制在 80 个字符以内。"); return; }
    if (nextMode === "regex") {
      try { new RegExp(normalized, "i"); } catch { setError("关联搜索表达式无法解析，请检查正则语法。"); return; }
    }
    setError(""); setSubmittedQuery(normalized); setQuery(normalized);
    setHistory((current) => [normalized, ...current.filter((item) => item !== normalized)].slice(0, 6));
  };
  const results = useMemo(() => {
    if (!submittedQuery) return searchableRecords;
    try {
      const matcher = mode === "regex" ? new RegExp(submittedQuery, "i") : null;
      return searchableRecords.filter((item) => {
        const haystack = `${item.title}${item.content}${item.section}`;
        const matches = matcher ? matcher.test(haystack) : haystack.toLocaleLowerCase().includes(submittedQuery.toLocaleLowerCase());
        return matches && (sectionFilter === "全部板块" || item.section === sectionFilter);
      });
    } catch { return []; }
  }, [mode, sectionFilter, submittedQuery]);
  const counts = searchableRecords.reduce<Record<string, number>>((acc, item) => { acc[item.section] = (acc[item.section] ?? 0) + Number(results.some((result) => result.id === item.id)); return acc; }, {});
  const searchForm = <>
    <form className="tp-global-search" onSubmit={(event) => { event.preventDefault(); runSearch(); }}>
      <div className="tp-search-mode" role="group" aria-label="检索方式"><button className={mode === "fuzzy" ? "active" : ""} type="button" aria-pressed={mode === "fuzzy"} onClick={() => setMode("fuzzy")}>模糊搜索</button><button className={mode === "regex" ? "active" : ""} type="button" aria-pressed={mode === "regex"} onClick={() => setMode("regex")}>关联搜索</button></div>
      <label><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={mode === "regex" ? "输入正则表达式，如 产业链|技术链" : "输入标题或正文关键词"} aria-label="全文检索关键词" /><button type="submit">开始检索<SearchCheck size={17} /></button></label>
      {error && <p role="alert"><CircleAlert size={15} />{error}</p>}
    </form>
    <div className="tp-search-shortcuts">
      <section><header><History size={15} /><strong>历史搜索</strong>{history.length > 0 && <button type="button" onClick={() => setHistory([])}>清除</button>}</header><div>{history.length ? history.map((item) => <button type="button" onClick={() => runSearch(item)} key={item}>{item}</button>) : <small>暂无本机历史搜索记录</small>}</div></section>
      <section><header><Flame size={15} /><strong>演示热词</strong><DemoBadge>非真实用户统计</DemoBadge></header><div>{["产业链", "技术链", "深圳", "科研机构", "政策", "研究报告"].map((item) => <button type="button" onClick={() => runSearch(item)} key={item}>{item}</button>)}</div></section>
    </div>
  </>;
  if (subId === "portal-search") return <Panel title="门户全文检索查询" description="支持模糊搜索、关联搜索、历史搜索与热词搜索" action={<DemoBadge>检索数据集为演示</DemoBadge>}>{searchForm}</Panel>;
  return <>
    <Panel title="门户全文检索查询" description="修改检索条件后即时更新结果">{searchForm}</Panel>
    <Panel title="检索结果展示" description={`“${submittedQuery}”的演示检索结果`} action={<span className="tp-result-count">共 <strong>{results.length}</strong> 条</span>}>
      <div className="tp-search-results-layout">
        <aside><button className={sectionFilter === "全部板块" ? "active" : ""} type="button" onClick={() => setSectionFilter("全部板块")}><span>全部板块</span><b>{results.length}</b></button>{Array.from(new Set(searchableRecords.map((item) => item.section))).map((section) => <button className={sectionFilter === section ? "active" : ""} type="button" onClick={() => setSectionFilter(section)} key={section}><span>{section}</span><b>{counts[section] ?? 0}</b></button>)}</aside>
        <div>{results.length ? results.map((item) => <article key={item.id}><span>{item.section}</span><h4><HighlightText text={item.title} query={submittedQuery} regexMode={mode === "regex"} /></h4><p><HighlightText text={item.content} query={submittedQuery} regexMode={mode === "regex"} /></p><button type="button" onClick={() => onNavigate(item.module, item.sub)}>前往对应内容<ArrowRight size={15} /></button></article>) : <div className="tp-empty-state"><FileSearch2 size={30} /><strong>未找到匹配内容</strong><p>请尝试更换关键词、检索方式或板块筛选。</p></div>}</div>
      </div>
    </Panel>
  </>;
}

function renderModuleContent({ moduleId, subId, industry, openDialog, showToast, onNavigate, selectedReportId, onSelectReport }: {
  moduleId: ModuleId;
  subId: string;
  industry: Industry;
  openDialog: (dialog: DialogState) => void;
  showToast: (message: string) => void;
  onNavigate: (module: ModuleId, sub: string) => void;
  selectedReportId: string;
  onSelectReport: (reportId: string) => void;
}) {
  switch (moduleId) {
    case "panorama": return <PanoramaContent subId={subId} industry={industry} openDialog={openDialog} />;
    case "frontier": return <FrontierContent subId={subId} industry={industry} />;
    case "enterprise": return <EnterpriseContent subId={subId} industry={industry} openDialog={openDialog} />;
    case "research": return <ResearchContent subId={subId} industry={industry} />;
    case "talent": return <TalentContent subId={subId} industry={industry} />;
    case "service": return <ServiceModule subId={subId} industry={industry} />;
    case "policy": return <PolicyModule subId={subId} industry={industry} />;
    case "one-map": return <OneMapModule subId={subId} industry={industry} />;
    case "reports": return <ReportsContent subId={subId} industry={industry} selectedReportId={selectedReportId} onSelectReport={onSelectReport} showToast={showToast} />;
    case "platform": return <PlatformContent subId={subId} showToast={showToast} onNavigate={onNavigate} />;
    case "search": return <SearchContent subId={subId} onNavigate={onNavigate} />;
  }
}

export default function TechnologyTopicServicePage() {
  const [topicRoute, setTopicRoute] = useState<TopicRoute>(() => parseTopicRoute());
  const { module: activeModule, sub: activeSub, industry } = topicRoute;
  const [selectedReportId, setSelectedReportId] = useState(() => reportRecords.find((report) => report.industry === topicRoute.industry)?.id ?? reportRecords[0].id);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [toast, setToast] = useState("");
  const [activeLocator, setActiveLocator] = useState(activeSub);
  const toastTimer = useRef<number | null>(null);
  const initialSubsectionAligned = useRef(false);
  const activeDefinition = moduleById.get(activeModule) ?? moduleDefinitions[0];
  const ActiveIcon = activeDefinition.icon;
  const moduleContextLabel = activeModule === "platform" ? "门户公共信息" : `${industry}专题`;
  const flatSubItems = activeModule === "search"
    ? [{ ...activeDefinition.subs[0], label: "门户全文检索与结果展示", renderSub: "search-results" }]
    : activeDefinition.subs.map((sub) => ({ ...sub, renderSub: sub.id }));

  useEffect(() => {
    if (activeModule !== "reports") return;
    setSelectedReportId((current) => {
      const selected = reportRecords.find((report) => report.id === current);
      return selected?.industry === industry ? current : reportRecords.find((report) => report.industry === industry)?.id ?? reportRecords[0].id;
    });
  }, [activeModule, industry]);

  useEffect(() => {
    setActiveLocator(activeSub);
    const sections = activeDefinition.subs
      .map((sub) => document.getElementById(`tp-subsection-${sub.id}`))
      .filter((element): element is HTMLElement => Boolean(element));
    if (!sections.length) return;
    let frame = 0;
    const updateLocator = () => {
      const anchor = 120;
      const current = sections.reduce((selected, section) => section.getBoundingClientRect().top <= anchor ? section : selected, sections[0]);
      setActiveLocator(current.id.replace("tp-subsection-", ""));
    };
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateLocator);
    };
    updateLocator();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [activeDefinition, activeModule, activeSub, industry]);

  useEffect(() => {
    if (initialSubsectionAligned.current) return;
    initialSubsectionAligned.current = true;
    if (activeSub === activeDefinition.subs[0]?.id) return;
    const frame = window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      document.getElementById(`tp-subsection-${activeSub}`)?.scrollIntoView({ block: "start" });
    }));
    return () => window.cancelAnimationFrame(frame);
  }, [activeDefinition, activeSub]);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  };

  useEffect(() => {
    const canonicalRoute = parseTopicRoute();
    const canonicalUrl = buildTopicUrl(canonicalRoute);
    if (canonicalUrl.href !== window.location.href) window.history.replaceState(window.history.state, "", canonicalUrl);
    const syncFromUrl = () => {
      const nextRoute = parseTopicRoute();
      setTopicRoute(nextRoute);
      setDialog(null);
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        document.getElementById(`tp-subsection-${nextRoute.sub}`)?.scrollIntoView({ block: "start" });
      }));
    };
    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    const openSearch = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        const next = { industry, module: "search" as ModuleId, sub: "portal-search" };
        const nextUrl = buildTopicUrl(next);
        window.history.pushState(window.history.state, "", nextUrl);
        setTopicRoute(next);
        window.requestAnimationFrame(() => document.getElementById("tp-workspace")?.scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" }));
      }
    };
    window.addEventListener("keydown", openSearch);
    return () => window.removeEventListener("keydown", openSearch);
  }, [industry]);

  const commitTopicRoute = (next: TopicRoute, { replace = false, scroll = false }: { replace?: boolean; scroll?: boolean } = {}) => {
    const nextUrl = buildTopicUrl(next);
    if (nextUrl.href !== window.location.href) {
      if (replace) window.history.replaceState(window.history.state, "", nextUrl);
      else window.history.pushState(window.history.state, "", nextUrl);
    }
    setTopicRoute(next);
    setDialog(null);
    if (scroll) window.requestAnimationFrame(() => document.getElementById("tp-workspace")?.scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" }));
  };

  const selectModule = (moduleId: ModuleId, scroll = false) => {
    const definition = moduleById.get(moduleId) ?? moduleDefinitions[0];
    commitTopicRoute({ industry, module: moduleId, sub: definition.subs[0].id }, { scroll });
  };

  const selectIndustry = (nextIndustry: Industry) => commitTopicRoute({ ...topicRoute, sub: activeLocator, industry: nextIndustry });
  const navigateToContent = (module: ModuleId, sub: string) => {
    commitTopicRoute({ industry, module, sub });
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      document.getElementById(`tp-subsection-${sub}`)?.scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" });
    }));
  };
  const locateSubsection = (sub: string) => {
    setActiveLocator(sub);
    commitTopicRoute({ ...topicRoute, sub }, { replace: true });
    window.requestAnimationFrame(() => document.getElementById(`tp-subsection-${sub}`)?.scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" }));
  };
  const selectReport = (reportId: string) => {
    const report = reportRecords.find((item) => item.id === reportId);
    const nextIndustry = report?.industry ?? industry;
    setSelectedReportId(reportId);
    setActiveLocator("report-view");
    commitTopicRoute({ industry: nextIndustry, module: "reports", sub: "report-view" }, { replace: true });
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => document.getElementById("tp-subsection-report-view")?.scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" })));
  };

  return <main className="tp-page">
    <PortalHeader currentPage="technology-topic-service" />

    <section id="tp-top" className="tp-portal-hero" aria-labelledby="tp-page-title">
      <img className="tp-hero-art" src="./assets/thinktank-hero-compact.png" alt="" />
      <div className="tp-portal-hero-inner">
        <div className="tp-hero-copy">
          <h1 id="tp-page-title">科技专题服务</h1>
          <p>聚焦八大未来产业，汇集产业、技术、企业、科研、人才、服务、政策与空间信息。</p>
          <label className="tp-hero-industry">
            <span>当前专题产业</span>
            <div><select value={industry} onChange={(event) => selectIndustry(event.target.value as Industry)} aria-label="选择专题产业">{industries.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={16} aria-hidden="true" /></div>
            <small>产业名称已确认，页面指标与对象为演示数据</small>
          </label>
        </div>
      </div>
    </section>

    <div id="tp-workspace" className="tp-service-shell">
      <nav className="tp-floating-module-nav" aria-label="科技专题服务一级功能">
        <header><strong>功能目录</strong><small>11 项专题服务</small></header>
        {moduleDefinitions.map((item) => {
          const Icon = item.icon;
          return <button className={activeModule === item.id ? "active" : ""} type="button" aria-current={activeModule === item.id ? "page" : undefined} onClick={() => selectModule(item.id, true)} key={item.id}><Icon size={17} aria-hidden="true" /><span>{item.label}</span></button>;
        })}
      </nav>

      <section className="tp-service-section" aria-labelledby="tp-module-title">
        <header className="tp-section-header">
          <div className="tp-section-heading">
            <span className="tp-section-icon"><ActiveIcon size={22} aria-hidden="true" /></span>
            <div><h2 id="tp-module-title">{activeDefinition.label}</h2><p>{moduleContextLabel}&nbsp;｜&nbsp;{activeDefinition.description}</p></div>
          </div>
          <div className="tp-section-actions"><DemoBadge>演示数据</DemoBadge></div>
        </header>

        <div className="tp-workspace">
          <div id="tp-module-panel" className="tp-module-content tp-module-content-flat" key={`${activeModule}-${industry}`}>
            {flatSubItems.map((sub) => <section id={`tp-subsection-${sub.id}`} className={`tp-flat-subsection${activeLocator === sub.id || activeModule === "search" ? " is-target" : ""}`} aria-labelledby={`tp-subsection-title-${sub.id}`} key={sub.id}>
              <header className="tp-flat-subsection-header"><h3 id={`tp-subsection-title-${sub.id}`}>{sub.label}</h3><span>{moduleContextLabel} · {activeDefinition.label}</span></header>
              {renderModuleContent({ moduleId: activeModule, subId: sub.renderSub, industry, openDialog: setDialog, showToast, onNavigate: navigateToContent, selectedReportId, onSelectReport: selectReport })}
            </section>)}
          </div>
        </div>
      </section>

      {activeDefinition.subs.length > 1 && <nav className="tp-subsection-locator" aria-label={`${activeDefinition.label}内容定位`}>
        <strong>内容定位</strong>
        {activeDefinition.subs.map((sub) => <button className={activeLocator === sub.id ? "active" : ""} type="button" aria-current={activeLocator === sub.id ? "location" : undefined} onClick={() => locateSubsection(sub.id)} key={sub.id}><span>{sub.label}</span></button>)}
      </nav>}

      <footer className="tp-footer"><div><img src="./assets/gkx-logo.png" alt="" /><span><strong>科技专题服务</strong><small>深圳国际科技信息中心</small></span></div><p>当前页面仅用于功能与交互演示，所有数据、排序、对象与结论均不代表真实情况。</p></footer>
    </div>

    {dialog && <TopicDialog dialog={dialog} onClose={() => setDialog(null)} />}
    {toast && <div className="tp-toast" role="status"><CheckCircle2 size={17} />{toast}</div>}
  </main>;
}
