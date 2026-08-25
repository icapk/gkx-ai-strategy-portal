import { useState, type CSSProperties, type ReactNode } from "react";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RefreshCw,
  Search,
  Star,
  UserRound,
} from "lucide-react";
import PortalHeader from "./PortalHeader";
import PageSectionLocator from "./PageSectionLocator";
import "./figma-think-tank.css";

const assetRoot = "./assets/figma-think-tank";

const reportTitle = "人工智能产业发展方向与关键能力建设研究";
const reportSummary = "研判通用大模型、具身智能和行业智能体的发展态势，提出自主能力与应用生态建设路径";

const reportRows = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  title: reportTitle,
  summary: reportSummary,
  institute: "中国科学院",
  date: "2026-02-14",
}));

const newsRows = [
  "人工智能产业发展方向与关键能力建设研究",
  "智能制造系统优化与智能化转型",
  "区块链技术在供应链管理中的应用研究",
  "可持续发展与绿色科技的未来趋势",
  "量子计算的应用与挑战",
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
    <svg className="ttf-line-chart" viewBox="0 0 820 220" role="img" aria-label="2021至2025年技术发展演示概览：技术总量约为40、45、70、100、110，突破性技术约为30、35、60、90、100。">
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
  const [selectedNode, setSelectedNode] = useState({ title: "人工智能", detail: "3 条关键技术路线 · 9 个细分技术节点" });
  const normalizedQuery = treeQuery.trim();
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
        <MiniSelect label="当前领域" value="人工智能" />
        <label className="ttf-section-search"><input value={treeQuery} onChange={(event) => setTreeQuery(event.target.value)} placeholder="搜索技术分支" aria-label="搜索技术分支"/><Search size={16}/></label>
      </SectionHeading>
      <MetricStrip items={[
        { label: "论文总数", value: "12,345", trend: "15%" },
        { label: "学者数量", value: "3,256", trend: "15%" },
        { label: "企业数量", value: "12,345", trend: "15%" },
        { label: "论文发表环比", value: "+6.2%", danger: true },
      ]} />
      <div className="ttf-tech-overview">
        <article className="fp-card ttf-key-tech">
          <PanelTitle title="近年关键技术" />
          {[
            ["2025年", "通用大模型高效推理"],
            ["2024年", "多模态融合与生成", "具身智能决策控制"],
            ["2023年", "多模态融合与生成", "具身智能决策控制"],
            ["2022年", "多模态融合与生成", "具身智能决策控制"],
            ["2021年", "多模态融合与生成", "具身智能决策控制"],
          ].map(([year,...items])=><div className="ttf-key-year" key={year}><b>{year}</b>{items.map((item)=><span key={item}>{item}</span>)}</div>)}
        </article>
        <div className="ttf-tech-main">
          <article className="fp-card ttf-trend-panel">
            <PanelTitle title="近5年技术发展概览" aside={<span className="ttf-legend"><i className="blue"/>技术总量<i className="green"/>突破性技术</span>} />
            <LineChart />
          </article>
          <article className="fp-card ttf-milestone-panel">
            <PanelTitle title="关键技术发展里程碑轨道" aside="2021年–2025年" />
            <div className="ttf-milestones">
              {[
                ["国产单细胞测序平台发布","华大生命科学研究院","2021年"],
                ["国产单细胞测序平台发布","华大生命科学研究院","2022年"],
                ["首个国产原子治疗系统获批","中科院上海细胞所","2022年"],
              ].map(([title,team,year],index)=><div key={`${title}-${index}`}><article><b>{title}</b><p>{team}</p><span>高影响</span></article><i/><time>{year}</time></div>)}
            </div>
          </article>
        </div>
      </div>
      <article className="fp-card ttf-tree-panel">
        <PanelTitle title="关键技术分枝树" aside="节点可点击 · 内容为近五年演示数据" />
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
              <button type="button" className={`ttf-tree-root${selectedNode.title === "人工智能" ? " is-selected" : ""}`} onClick={() => setSelectedNode({ title: "人工智能", detail: "3 条关键技术路线 · 9 个细分技术节点" })}><small>领域主线</small><b>人工智能</b><span>334,287 篇论文</span><em>{technologyBranches.length} 条路线</em></button>
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

function ReportItem({ compact = false }: { compact?: boolean }) {
  return <article className={`ttf-report-item${compact ? " is-compact" : ""}`}><h4>{reportTitle}</h4><p>{reportSummary}</p><div className="ttf-report-tags"><span>信息电子</span><span>新能源专题库</span></div><footer><span><Building2 size={13}/>中国科学院</span><span><CalendarDays size={13}/>2026-02-14</span></footer></article>;
}

function ReportsSection() {
  const [tab,setTab]=useState<"push"|"cases">("push");
  return <section id="reports" className="ttf-section ttf-reports">
    <SectionHeading title="战略咨询报告" subtitle="总体画像｜发展目标｜具体任务｜保障措施" />
    <div className="ttf-report-workbench">
      <aside className="fp-card ttf-recommend"><h3><Star size={18} fill="#ffaa3a"/>系统推荐</h3>{[1,2,3,4].map((item)=><ReportItem compact key={item}/>)}<button type="button"><RefreshCw size={16}/>换一换</button></aside>
      <article className="fp-card ttf-report-catalog">
        <div className="ttf-report-tabs"><button className={tab==="push"?"active":""} type="button" onClick={()=>setTab("push")}>定向推送</button><button className={tab==="cases"?"active":""} type="button" onClick={()=>setTab("cases")}>成果案例</button></div>
        <div className="ttf-report-filters"><MiniSelect label="领域" value="全部领域"/><MiniSelect label="机构" value="全部机构"/><MiniSelect label="年度" value="全部年度"/><MiniSelect label="专题" value="全部专题"/></div>
        <div className="ttf-report-list">{reportRows.map((item)=><ReportItem key={item.id}/>)}</div>
        <div className="ttf-pagination"><ChevronLeft size={14}/><b>1</b><span>2</span><span>3</span><span>4</span><span>5</span><span>…</span><span>20</span><ChevronRight size={14}/></div>
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
  return <section id="news" className="ttf-section ttf-news">
    <SectionHeading title="人才动态资讯区" subtitle="科技动态与人才信息关联｜定向查询与关注"><MiniSelect label="领域" value="全部"/><MiniSelect value="按热度"/><MiniSelect value="全部"/></SectionHeading>
    <article className="fp-card ttf-news-card">
      <div className="ttf-news-tabs"><button className={tab==="all"?"active":""} type="button" onClick={()=>setTab("all")}>全部资讯</button><button className={tab==="followed"?"active":""} type="button" onClick={()=>setTab("followed")}>我的关注</button></div>
      <div className="ttf-news-list">{newsRows.map((title,index)=><article key={title}><h3>{title}</h3><p>{index===0?reportSummary:"聚焦科技创新与产业发展，梳理最新研究进展、应用场景和人才动态。"}</p><footer><span><Building2 size={13}/>{index%2?"清华大学":"中国科学院"}</span><span><CalendarDays size={13}/>{index?"2025-08-20":"2026-02-14"}</span><span><UserRound size={13}/>{index?"李明":"张志康"}</span></footer><div className="ttf-news-actions"><span><Heart size={14}/>{index<3?"4,000":index===3?"5,000":"6,000"}</span>{index<3?<a href="#news">查看详情</a>:null}</div></article>)}</div>
      <a className="ttf-view-all" href="#news">查看全部</a>
    </article>
  </section>;
}

export default function FigmaThinkTankPage() {
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
