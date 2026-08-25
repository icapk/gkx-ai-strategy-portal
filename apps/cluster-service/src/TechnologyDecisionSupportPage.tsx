import {
  Activity,
  AlertTriangle,
  BarChart3,
  ChevronRight,
  CircleDollarSign,
  Database,
  GitBranch,
  Network,
  Radar,
  ShieldAlert,
  TrendingUp,
  UsersRound,
  Workflow,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import PageSectionLocator from "./PageSectionLocator";
import PortalHeader from "./PortalHeader";
import "./technology-decision-support.css";

type ModuleId = "network" | "forecast" | "allocation" | "warning";
type ModuleDefinition = {
  id: ModuleId;
  label: string;
  description: string;
  icon: LucideIcon;
  sections: Array<{ id: string; label: string }>;
};

const moduleDefinitions: ModuleDefinition[] = [
  {
    id: "network",
    label: "科技网络呈现",
    description: "以节点、边和聚类簇群呈现多层科技社会网络与知识关联。",
    icon: Network,
    sections: [
      { id: "tds-network-method", label: "网络构建说明" },
      { id: "tds-network-graph", label: "科技知识超网络" },
      { id: "tds-network-clusters", label: "聚类簇群结果" },
    ],
  },
  {
    id: "forecast",
    label: "动态预测结果",
    description: "面向人才、团队和机构平铺展示六类预测结果与辅助研判说明。",
    icon: TrendingUp,
    sections: [
      { id: "tds-forecast-direction", label: "发展与方向预测" },
      { id: "tds-forecast-demand", label: "需求预测" },
      { id: "tds-forecast-funding", label: "经费与收益预测" },
      { id: "tds-forecast-output", label: "成果与贡献预测" },
      { id: "tds-forecast-risk", label: "进度与风险预测" },
      { id: "tds-forecast-structure", label: "结构与规模预测" },
    ],
  },
  {
    id: "allocation",
    label: "资源分配方案",
    description: "从科技人员、团队机构和宏观领域三个层级查看资源分配结构与目标完成度。",
    icon: CircleDollarSign,
    sections: [
      { id: "tds-allocation-people", label: "科技人员资源分配" },
      { id: "tds-allocation-team", label: "团队机构资源分配" },
      { id: "tds-allocation-macro", label: "宏观领域资源分配" },
    ],
  },
  {
    id: "warning",
    label: "资源使用预警",
    description: "跟踪不同层级的资源使用和产出情况，定位重复投入、利用率和进度风险。",
    icon: ShieldAlert,
    sections: [
      { id: "tds-warning-people", label: "科技人员资源" },
      { id: "tds-warning-team", label: "团队机构资源" },
      { id: "tds-warning-macro", label: "宏观领域资源" },
    ],
  },
];

const moduleById = new Map(moduleDefinitions.map((item) => [item.id, item]));

function parseModule(): ModuleId {
  const value = new URL(window.location.href).searchParams.get("module") as ModuleId | null;
  return value && moduleById.has(value) ? value : "network";
}

function DemoBadge({ children = "演示数据 · 非正式结果" }: { children?: ReactNode }) {
  return <span className="tds-demo-badge">{children}</span>;
}

function ContentSection({ id, title, description, aside, children }: {
  id: string;
  title: string;
  description: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return <section id={id} className="tds-content-section" aria-labelledby={`${id}-title`}>
    <header className="tds-section-header"><div><h3 id={`${id}-title`}>{title}</h3><p>{description}</p></div>{aside}</header>
    {children}
  </section>;
}

type NetworkNode = { id: string; label: string; type: "技术" | "人才" | "团队" | "机构" | "项目"; cluster: 1 | 2; x: number; y: number };
type NetworkEdge = { source: string; target: string; relation: string; strength: number };

const networkNodes: NetworkNode[] = [
  { id: "tech-a", label: "技术主题 A", type: "技术", cluster: 1, x: 154, y: 112 },
  { id: "tech-b", label: "技术主题 B", type: "技术", cluster: 1, x: 286, y: 78 },
  { id: "talent-a", label: "演示人才 A", type: "人才", cluster: 1, x: 244, y: 196 },
  { id: "team-a", label: "演示团队 A", type: "团队", cluster: 1, x: 118, y: 244 },
  { id: "project-a", label: "演示项目 A", type: "项目", cluster: 1, x: 332, y: 272 },
  { id: "tech-c", label: "技术主题 C", type: "技术", cluster: 2, x: 504, y: 94 },
  { id: "tech-d", label: "技术主题 D", type: "技术", cluster: 2, x: 632, y: 132 },
  { id: "talent-b", label: "演示人才 B", type: "人才", cluster: 2, x: 548, y: 214 },
  { id: "org-a", label: "演示机构 A", type: "机构", cluster: 2, x: 674, y: 264 },
  { id: "project-b", label: "演示项目 B", type: "项目", cluster: 2, x: 480, y: 314 },
];

const networkEdges: NetworkEdge[] = [
  { source: "tech-a", target: "tech-b", relation: "知识依赖", strength: 84 },
  { source: "tech-a", target: "talent-a", relation: "研究关联", strength: 72 },
  { source: "talent-a", target: "team-a", relation: "成员关系", strength: 88 },
  { source: "team-a", target: "project-a", relation: "执行关系", strength: 76 },
  { source: "tech-b", target: "project-a", relation: "技术支撑", strength: 63 },
  { source: "tech-c", target: "tech-d", relation: "知识依赖", strength: 81 },
  { source: "tech-c", target: "talent-b", relation: "研究关联", strength: 69 },
  { source: "talent-b", target: "org-a", relation: "所属关系", strength: 91 },
  { source: "org-a", target: "project-b", relation: "组织关系", strength: 74 },
  { source: "tech-d", target: "project-b", relation: "技术支撑", strength: 58 },
  { source: "project-a", target: "tech-c", relation: "跨簇扩散", strength: 52 },
  { source: "talent-a", target: "talent-b", relation: "合作关系", strength: 46 },
];

const networkMethods = [
  { id: "associate", label: "Associate Strength", description: "突出共现强度与直接关联，便于观察紧密合作对象。" },
  { id: "linlog", label: "Linlog / Modularity", description: "增强簇群间距，便于识别网络中的结构社区。" },
  { id: "fractional", label: "Fractionalization", description: "按对象连接规模归一化，减少高频节点的规模偏差。" },
] as const;
type NetworkMethodId = (typeof networkMethods)[number]["id"];

const nodeTone: Record<NetworkNode["type"], string> = { 技术: "#1769d2", 人才: "#2f8b76", 团队: "#7462b5", 机构: "#b36b2d", 项目: "#4e7d9c" };

function NetworkContent() {
  const [methodId, setMethodId] = useState<NetworkMethodId>("associate");
  const [threshold, setThreshold] = useState(40);
  const [zoom, setZoom] = useState(1);
  const [selectedNodeId, setSelectedNodeId] = useState(networkNodes[0].id);
  const methodIndex = networkMethods.findIndex((item) => item.id === methodId);
  const activeMethod = networkMethods[methodIndex];
  const nodeMap = useMemo(() => new Map(networkNodes.map((node, index) => {
    const spread = methodIndex * 12;
    const direction = node.cluster === 1 ? -1 : 1;
    return [node.id, { ...node, x: node.x + direction * spread + (index % 2 ? methodIndex * 3 : 0), y: node.y + ((index % 3) - 1) * methodIndex * 6 }];
  })), [methodIndex]);
  const visibleEdges = networkEdges.filter((edge) => edge.strength >= threshold);
  const selectedNode = nodeMap.get(selectedNodeId) ?? networkNodes[0];
  const relatedEdges = networkEdges.filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id);
  const width = 760 / zoom;
  const height = 390 / zoom;
  const viewBox = `${(760 - width) / 2} ${(390 - height) / 2} ${width} ${height}`;

  const selectNode = (nodeId: string) => setSelectedNodeId(nodeId);

  return <>
    <ContentSection id="tds-network-method" title="网络构建说明" description="清洗节点与边后，以阈值 40、Min cluster size 5 的演示参数呈现三种聚类方法视图。" aside={<DemoBadge>方法视图演示</DemoBadge>}>
      <div className="tds-method-grid">{networkMethods.map((method) => <button type="button" className={methodId === method.id ? "is-active" : ""} aria-pressed={methodId === method.id} onClick={() => setMethodId(method.id)} key={method.id}><GitBranch size={18} /><span><strong>{method.label}</strong><small>{method.description}</small></span><ChevronRight size={16} /></button>)}</div>
      <div className="tds-method-note"><Database size={18} /><p>当前页面切换的是基于同一组演示节点生成的布局视图，不代表模型已在浏览器中重新计算聚类结果。</p></div>
    </ContentSection>

    <ContentSection id="tds-network-graph" title="科技知识超网络" description="点击节点查看一跳关系；调整阈值会过滤弱关联，缩放仅影响当前网络视图。">
      <div className="tds-network-toolbar">
        <label><span>边强度阈值</span><input type="range" min="40" max="80" step="2" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} /><output>{threshold}</output></label>
        <div><button type="button" disabled={zoom <= .8} onClick={() => setZoom((value) => Math.max(.8, Number((value - .1).toFixed(1))))} aria-label="缩小网络"><ZoomOut size={16} /></button><span>{Math.round(zoom * 100)}%</span><button type="button" disabled={zoom >= 1.4} onClick={() => setZoom((value) => Math.min(1.4, Number((value + .1).toFixed(1))))} aria-label="放大网络"><ZoomIn size={16} /></button><button type="button" onClick={() => { setZoom(1); setThreshold(40); }}>复位</button></div>
      </div>
      <div className="tds-network-layout">
        <div className="tds-network-canvas">
          <svg viewBox={viewBox} role="img" aria-label={`科技知识超网络演示，共 ${networkNodes.length} 个节点，当前显示 ${visibleEdges.length} 条强度不低于 ${threshold} 的关系。`}>
            <g>{visibleEdges.map((edge) => {
              const source = nodeMap.get(edge.source)!;
              const target = nodeMap.get(edge.target)!;
              const active = edge.source === selectedNode.id || edge.target === selectedNode.id;
              return <line className={active ? "is-related" : ""} x1={source.x} y1={source.y} x2={target.x} y2={target.y} strokeWidth={1 + edge.strength / 45} key={`${edge.source}-${edge.target}`} />;
            })}</g>
            {Array.from(nodeMap.values()).map((node) => <g className={`tds-network-node${selectedNode.id === node.id ? " is-selected" : ""}`} role="button" tabIndex={0} aria-label={`${node.label}，${node.type}节点，聚类 ${node.cluster}`} onClick={() => selectNode(node.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") selectNode(node.id); }} key={node.id}>
              <circle cx={node.x} cy={node.y} r={node.type === "技术" ? 25 : 21} fill={nodeTone[node.type]} />
              <text className="node-label" x={node.x} y={node.y + 39}>{node.label}</text>
              <text className="node-type" x={node.x} y={node.y + 4}>{node.type}</text>
            </g>)}
          </svg>
          <div className="tds-network-legend">{Object.entries(nodeTone).map(([type, color]) => <span key={type}><i style={{ background: color }} />{type}</span>)}</div>
        </div>
        <aside className="tds-network-detail" aria-live="polite"><span>当前节点</span><h4>{selectedNode.label}</h4><dl><div><dt>对象类型</dt><dd>{selectedNode.type}</dd></div><div><dt>所属簇群</dt><dd>聚类 {selectedNode.cluster}</dd></div><div><dt>一跳关系</dt><dd>{relatedEdges.length} 条</dd></div><div><dt>当前可见</dt><dd>{relatedEdges.filter((edge) => edge.strength >= threshold).length} 条</dd></div></dl><ol>{relatedEdges.slice(0, 5).map((edge) => { const otherId = edge.source === selectedNode.id ? edge.target : edge.source; return <li key={`${edge.source}-${edge.target}`}><span>{nodeMap.get(otherId)?.label}</span><small>{edge.relation} · {edge.strength}</small></li>; })}</ol></aside>
      </div>
    </ContentSection>

    <ContentSection id="tds-network-clusters" title="聚类簇群结果" description="按簇群查看对象组成、内部关系和跨簇连接，数值仅用于演示结构。">
      <div className="tds-cluster-grid">{[1, 2].map((cluster) => {
        const nodes = networkNodes.filter((node) => node.cluster === cluster);
        const innerEdges = networkEdges.filter((edge) => nodes.some((node) => node.id === edge.source) && nodes.some((node) => node.id === edge.target));
        return <article key={cluster}><header><span>聚类 {cluster}</span><strong>{cluster === 1 ? "智能方法与项目执行" : "知识扩散与组织协同"}</strong></header><dl><div><dt>节点</dt><dd>{nodes.length}</dd></div><div><dt>内部关系</dt><dd>{innerEdges.length}</dd></div><div><dt>平均强度</dt><dd>{Math.round(innerEdges.reduce((sum, edge) => sum + edge.strength, 0) / innerEdges.length)}</dd></div></dl><p>{nodes.map((node) => node.label).join("、")}</p></article>;
      })}</div>
    </ContentSection>
  </>;
}

type ForecastDefinition = {
  id: string;
  title: string;
  description: string;
  metric: string;
  unit: string;
  values: readonly number[];
  compare: readonly number[];
  note: string;
  icon: LucideIcon;
  special?: "risk" | "structure";
};

const forecastDefinitions: readonly ForecastDefinition[] = [
  { id: "tds-forecast-direction", title: "发展与方向预测", description: "综合研究方向、人才层级、成果产业化与单位发展潜力。", metric: "发展潜力指数", unit: "指数", values: [48, 54, 61, 68, 75, 81, 86], compare: [45, 50, 57, 63, 69, 74, 78], note: "方向 A 的演示增长斜率较高，可进一步核验关联成果与团队结构。", icon: Radar },
  { id: "tds-forecast-demand", title: "需求预测", description: "按时间序列展示人才需求、培养数量和需求总量变化。", metric: "人才需求量", unit: "人", values: [42, 48, 55, 63, 72, 80, 89], compare: [39, 44, 51, 58, 65, 72, 78], note: "预测期需求增长快于培养数量，演示缺口在 2029 年后扩大。", icon: UsersRound },
  { id: "tds-forecast-funding", title: "经费与收益预测", description: "对科研经费、研究经费、科创收益和经费增长趋势进行对比。", metric: "资源投入指数", unit: "指数", values: [46, 52, 58, 66, 71, 77, 82], compare: [44, 49, 54, 59, 65, 70, 74], note: "投入与收益均为演示指数，不对应真实金额或投资结论。", icon: CircleDollarSign },
  { id: "tds-forecast-output", title: "成果与贡献预测", description: "展示人才、团队、机构和项目的未来成果产出及贡献预测。", metric: "成果产出指数", unit: "指数", values: [38, 45, 52, 62, 70, 79, 87], compare: [41, 47, 53, 59, 65, 70, 76], note: "模型准确率为 82% 的界面演示值，不能作为正式投资与分配依据。", icon: BarChart3 },
  { id: "tds-forecast-risk", title: "进度与风险预测", description: "对比计划与实际进度，并以风险热度辅助识别潜在偏差。", metric: "计划完成度", unit: "%", values: [34, 45, 57, 68, 78, 88, 96], compare: [32, 42, 51, 59, 66, 73, 80], note: "演示对象在预测期出现进度差异，应核验关键节点与资源依赖。", icon: AlertTriangle, special: "risk" },
  { id: "tds-forecast-structure", title: "结构与规模预测", description: "展示未来团队人员结构、机构部门关系与发展规模。", metric: "组织规模指数", unit: "指数", values: [40, 47, 53, 61, 69, 76, 82], compare: [43, 48, 54, 58, 63, 68, 72], note: "结构关系与规模均为匿名演示，用于表达动态关系网络的查看方式。", icon: Workflow, special: "structure" },
];

function ForecastChart({ values, compare, periods, unit, subject }: { values: readonly number[]; compare: readonly number[]; periods: readonly string[]; unit: string; subject: string }) {
  const max = Math.max(...values, ...compare) * 1.12;
  const step = periods.length > 1 ? 510 / (periods.length - 1) : 0;
  const point = (value: number, index: number) => ({ x: 54 + index * step, y: 214 - value / max * 158 });
  const primary = values.map((value, index) => point(value, index));
  const secondary = compare.map((value, index) => point(value, index));
  const forecastIndex = periods.indexOf("2027");
  const forecastX = forecastIndex >= 0 ? 54 + forecastIndex * step - step / 2 : 565;
  return <svg className="tds-forecast-chart" viewBox="0 0 590 250" role="img" aria-label={`${subject}预测演示图，单位${unit}。${periods[0]}至2026为历史演示，2027至2030为预测演示。`}>
    {[56, 96, 136, 176, 216].map((y) => <line x1="44" x2="565" y1={y} y2={y} key={y} />)}
    <rect className="forecast-zone" x={forecastX} y="38" width={565 - forecastX} height="178" /><text className="zone-label" x={forecastX + 10} y="53">预测区间</text>
    <polyline className="primary" points={primary.map((item) => `${item.x},${item.y}`).join(" ")} /><polyline className="secondary" points={secondary.map((item) => `${item.x},${item.y}`).join(" ")} />
    {primary.map((item, index) => <g key={periods[index]}><circle className="primary-dot" cx={item.x} cy={item.y} r="4" /><circle className="secondary-dot" cx={secondary[index].x} cy={secondary[index].y} r="3.5" /><text className="value" x={item.x} y={item.y - 10}>{values[index]}</text><text x={item.x} y="238">{periods[index]}</text></g>)}
  </svg>;
}

const forecastSubjectOptions: Record<string, readonly string[]> = {
  人才对象: ["演示人才 A", "演示人才 B", "演示人才 C"],
  团队对象: ["演示团队 A", "演示团队 B", "演示团队 C"],
  机构对象: ["演示机构 A", "演示机构 B", "演示机构 C"],
};
const forecastPeriods = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"] as const;
const forecastRangeStarts: Record<string, number> = { "2024—2030": 0, "2025—2030": 1, "2026—2030": 2 };

function ForecastContent() {
  const [subject, setSubject] = useState("人才对象");
  const [target, setTarget] = useState("演示人才 A");
  const [comparison, setComparison] = useState("演示人才 B");
  const [range, setRange] = useState("2024—2030");
  const adjustment = ["人才对象", "团队对象", "机构对象"].indexOf(subject) * 3;
  const targetAdjustment = Math.max(0, forecastSubjectOptions[subject].indexOf(target)) * 2;
  const rangeStart = forecastRangeStarts[range];
  const periods = forecastPeriods.slice(rangeStart);
  const historyLabel = periods[0] === "2026" ? "2026" : `${periods[0]}—2026`;
  const chooseSubject = (nextSubject: string) => {
    setSubject(nextSubject);
    setTarget(forecastSubjectOptions[nextSubject][0]);
    setComparison(forecastSubjectOptions[nextSubject][1]);
  };
  const chooseTarget = (nextTarget: string) => {
    setTarget(nextTarget);
    if (nextTarget === comparison) {
      setComparison(forecastSubjectOptions[subject].find((item) => item !== nextTarget) ?? nextTarget);
    }
  };
  return <>
    <div className="tds-shared-controls"><div><span>预测对象</span>{Object.keys(forecastSubjectOptions).map((item) => <button type="button" className={subject === item ? "is-active" : ""} aria-pressed={subject === item} onClick={() => chooseSubject(item)} key={item}>{item}</button>)}</div><label><span>当前对象</span><select value={target} onChange={(event) => chooseTarget(event.target.value)}>{forecastSubjectOptions[subject].map((item) => <option key={item}>{item}</option>)}</select></label><label><span>时间范围</span><select value={range} onChange={(event) => setRange(event.target.value)}>{Object.keys(forecastRangeStarts).map((item) => <option key={item}>{item}</option>)}</select></label><label><span>分屏对比</span><select value={comparison} onChange={(event) => setComparison(event.target.value)}>{forecastSubjectOptions[subject].filter((item) => item !== target).map((item) => <option key={item}>{item}</option>)}</select></label></div>
    {forecastDefinitions.map((definition) => {
      const Icon = definition.icon;
      const values = definition.values.map((value) => value + adjustment + targetAdjustment).slice(rangeStart);
      const compare = definition.compare.map((value) => value + (comparison.endsWith("C") ? 4 : 0)).slice(rangeStart);
      return <ContentSection id={definition.id} title={definition.title} description={definition.description} aside={<span className="tds-section-icon"><Icon size={18} /></span>} key={definition.id}>
        <div className="tds-forecast-layout"><div className="tds-chart-panel"><header><div><strong>{definition.metric}</strong><small>单位：{definition.unit}</small></div><span><i className="primary" />{target}<i className="secondary" />{comparison}</span></header><ForecastChart values={values} compare={compare} periods={periods} unit={definition.unit} subject={target} /></div><aside className="tds-forecast-report"><span>综合预测摘要</span><h4>{target} · {definition.title}</h4><p>{definition.note}</p><dl><div><dt>历史区间</dt><dd>{historyLabel}</dd></div><div><dt>预测区间</dt><dd>2027—2030</dd></div><div><dt>结果性质</dt><dd>演示预测</dd></div></dl></aside></div>
        {definition.special === "risk" ? <div className="tds-risk-heat"><header><strong>进度与风险热力</strong><small>1 低 · 5 高</small></header><div>{["任务节点 1", "任务节点 2", "资源依赖", "成果交付"].map((label, row) => <span key={label}><b>{label}</b>{[0, 1, 2, 3, 4].map((column) => { const level = Math.min(4, (row + column + adjustment) % 5); return <span role="img" className={`tds-risk-cell level-${level}`} aria-label={`${label}，风险等级 ${level + 1}`} key={column}>{level + 1}</span>; })}</span>)}</div></div> : null}
        {definition.special === "structure" ? <div className="tds-structure-preview" aria-label="未来团队结构关系演示"><strong>负责人</strong><i /><span>研究单元 A</span><i /><span>研究单元 B</span><i /><span>成果转化单元</span><small>演示结构关系随预测对象切换</small></div> : null}
      </ContentSection>;
    })}
  </>;
}

type AllocationScope = { id: string; title: string; description: string; categories: string[]; nouns: string[] };
const allocationScopes: AllocationScope[] = [
  { id: "tds-allocation-people", title: "科技人员资源分配", description: "查看基础研究、技术攻关和海外创新人才的资源分配建议与目标完成度。", categories: ["基础研究人才", "技术攻关人才", "海外创新人才"], nouns: ["演示人才 A", "演示人才 B", "演示人才 C", "人才公共支持"] },
  { id: "tds-allocation-team", title: "团队机构资源分配", description: "查看科研团队、技术创业团队和海外合作团队的资源倾斜结构。", categories: ["科研团队", "技术创业团队", "海外合作团队"], nouns: ["演示团队 A", "演示团队 B", "演示团队 C", "团队公共平台"] },
  { id: "tds-allocation-macro", title: "宏观领域资源分配", description: "查看前沿学科、高新产业和国际合作领域的资源分配结构。", categories: ["前沿学科领域", "高新产业领域", "国际合作领域"], nouns: ["演示方向 A", "演示方向 B", "演示方向 C", "领域公共能力"] },
];

function AllocationSection({ scope, scopeIndex }: { scope: AllocationScope; scopeIndex: number }) {
  const [category, setCategory] = useState(scope.categories[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const categoryIndex = scope.categories.indexOf(category);
  const values = [30, 26, 24, 20].map((value, index) => value + (categoryIndex - 1) * (index % 2 ? -2 : 2) + scopeIndex * (index === 3 ? 2 : 0));
  const total = values.reduce((sum, value) => sum + value, 0);
  const normalized = values.map((value) => Math.round(value / total * 100));
  normalized[normalized.length - 1] += 100 - normalized.reduce((sum, value) => sum + value, 0);
  const completion = 76 + scopeIndex * 5 + categoryIndex * 3;
  return <ContentSection id={scope.id} title={scope.title} description={scope.description} aside={<DemoBadge>100 演示资源点</DemoBadge>}>
    <div className="tds-category-tabs" role="group" aria-label={`${scope.title}分类`}>{scope.categories.map((item) => <button type="button" className={category === item ? "is-active" : ""} aria-pressed={category === item} onClick={() => { setCategory(item); setSelectedIndex(0); }} key={item}>{item}</button>)}</div>
    <div className="tds-allocation-layout"><div className="tds-allocation-flow"><header><span><Database size={18} />资源池</span><ChevronRight size={16} /><strong>{category}</strong><ChevronRight size={16} /><span>具体对象</span></header><div className="tds-allocation-items" role="list" aria-label={`${category}资源分配演示：${scope.nouns.map((noun, index) => `${noun} ${normalized[index]}点`).join("，")}`}>{scope.nouns.map((noun, index) => <button type="button" role="listitem" className={selectedIndex === index ? "is-active" : ""} aria-pressed={selectedIndex === index} onClick={() => setSelectedIndex(index)} key={noun}><span>{noun}</span><i><b style={{ width: `${normalized[index]}%` }} /></i><strong>{normalized[index]} 点</strong></button>)}</div></div><aside className="tds-allocation-analysis"><div className="tds-allocation-selected"><span>当前对象</span><b>{scope.nouns[selectedIndex]}</b><em>{normalized[selectedIndex]} 点</em></div><span>目标完成度</span><strong>{completion}%</strong><i><b style={{ width: `${completion}%` }} /></i><h4>方案智能解析（演示）</h4><p>{category}当前以核心对象与公共能力协同配置，优先保障关键任务连续性；分配点数不对应真实金额。</p></aside></div>
  </ContentSection>;
}

function AllocationContent() {
  return <>{allocationScopes.map((scope, index) => <AllocationSection scope={scope} scopeIndex={index} key={scope.id} />)}</>;
}

type WarningScope = { id: string; title: string; description: string; categories: string[]; metric: string };
const warningScopes: WarningScope[] = [
  { id: "tds-warning-people", title: "科技人员资源", description: "按周、月、年跟踪科技人员资源投入精确度、贡献度、重复投入和利用异常。", categories: ["基础研究人才", "技术攻关人才", "海外创新人才"], metric: "资源使用量" },
  { id: "tds-warning-team", title: "团队机构资源", description: "跟踪科研团队、技术创业团队与海外合作团队的产出数量和风险变化。", categories: ["科研团队资源产出", "技术产出", "合作成果"], metric: "资源产出指数" },
  { id: "tds-warning-macro", title: "宏观领域资源", description: "跟踪前沿学科、高新产业和国际合作领域的资金流向、使用进度与利用率。", categories: ["前沿学科领域", "高新产业领域", "国际合作领域"], metric: "资源利用率" },
];

const warningTemplates = [
  { level: "高", reason: "连续两个周期的使用进度低于演示计划", evidence: "计划完成 72%，当前完成 51%", suggestion: "核验关键任务、使用凭证与下一周期计划" },
  { level: "中", reason: "同类资源存在重复投入信号", evidence: "相似用途记录 2 条，重合度 68%", suggestion: "复核用途边界并合并重复支持项" },
  { level: "低", reason: "产出贡献与投入变化出现短期偏离", evidence: "投入增长 12%，产出指数增长 4%", suggestion: "持续观察两个周期后再进行研判" },
] as const;

function UsageChart({ values, metric, cadence }: { values: number[]; metric: string; cadence: string }) {
  const labels = cadence === "周" ? ["W1", "W2", "W3", "W4", "W5", "W6"] : cadence === "月" ? ["1月", "2月", "3月", "4月", "5月", "6月"] : ["2021", "2022", "2023", "2024", "2025", "2026"];
  const points = values.map((value, index) => `${54 + index * 88},${210 - value * 1.55}`).join(" ");
  return <svg className="tds-usage-chart" viewBox="0 0 540 245" role="img" aria-label={`${metric}${cadence}趋势演示：${labels.map((label, index) => `${label} ${values[index]}`).join("，")}`}>
    {[60, 100, 140, 180, 220].map((y) => <line x1="42" x2="520" y1={y} y2={y} key={y} />)}<polyline points={points} />{values.map((value, index) => <g key={labels[index]}><circle cx={54 + index * 88} cy={210 - value * 1.55} r="4" /><text className="value" x={54 + index * 88} y={196 - value * 1.55}>{value}</text><text x={54 + index * 88} y="235">{labels[index]}</text></g>)}
  </svg>;
}

function WarningSection({ scope, scopeIndex }: { scope: WarningScope; scopeIndex: number }) {
  const [category, setCategory] = useState(scope.categories[0]);
  const [cadence, setCadence] = useState("月");
  const [riskLevel, setRiskLevel] = useState("全部");
  const categoryIndex = scope.categories.indexOf(category);
  const warnings = warningTemplates.map((template, index) => ({ ...template, id: `${scopeIndex}-${categoryIndex}-${index}`, target: `${category} · 演示对象 ${String.fromCharCode(65 + index)}` }));
  const filteredWarnings = warnings.filter((warning) => riskLevel === "全部" || warning.level === riskLevel);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedWarning = filteredWarnings[selectedIndex] ?? filteredWarnings[0] ?? null;
  const values = [42, 49, 55, 61, 68, 73].map((value, index) => value + scopeIndex * 4 + categoryIndex * 2 + (cadence === "年" ? index * 2 : cadence === "周" ? index % 2 : 0));

  return <ContentSection id={scope.id} title={scope.title} description={scope.description} aside={<DemoBadge>主动查询界面</DemoBadge>}>
    <div className="tds-warning-controls"><label><span>分类</span><select value={category} onChange={(event) => { setCategory(event.target.value); setSelectedIndex(0); }}>{scope.categories.map((item) => <option key={item}>{item}</option>)}</select></label><div><span>时间单位</span>{["周", "月", "年"].map((item) => <button type="button" className={cadence === item ? "is-active" : ""} aria-pressed={cadence === item} onClick={() => setCadence(item)} key={item}>{item}</button>)}</div><label><span>风险等级</span><select value={riskLevel} onChange={(event) => { setRiskLevel(event.target.value); setSelectedIndex(0); }}><option>全部</option><option>高</option><option>中</option><option>低</option></select></label></div>
    <div className="tds-warning-layout"><div className="tds-usage-panel"><header><strong>{category} · {scope.metric}</strong><span>{cadence}趋势</span></header><UsageChart values={values} metric={scope.metric} cadence={cadence} /><dl><div><dt>投入精确度</dt><dd>{78 + categoryIndex * 3}%</dd></div><div><dt>产出贡献度</dt><dd>{65 + scopeIndex * 6}%</dd></div><div><dt>重复投入率</dt><dd>{8 + categoryIndex * 2}%</dd></div></dl></div><div className="tds-warning-list"><header><strong>异常提示</strong><span>{filteredWarnings.length} 条</span></header>{filteredWarnings.length ? <ol>{filteredWarnings.map((warning, index) => <li key={warning.id}><button type="button" className={selectedWarning?.id === warning.id ? "is-active" : ""} onClick={() => setSelectedIndex(index)}><span className={`risk-${warning.level}`}>{warning.level}风险</span><div><strong>{warning.target}</strong><small>{warning.reason}</small></div><ChevronRight size={15} /></button></li>)}</ol> : <p className="tds-warning-empty">当前筛选条件下无演示预警</p>}</div></div>
    {selectedWarning ? <div className="tds-warning-detail" aria-live="polite"><AlertTriangle size={19} /><div><span>预警依据</span><strong>{selectedWarning.evidence}</strong></div><div><span>核验建议</span><strong>{selectedWarning.suggestion}</strong></div><small>该提示仅用于界面演示，不会发送至外部系统。</small></div> : null}
  </ContentSection>;
}

function WarningContent() {
  return <>{warningScopes.map((scope, index) => <WarningSection scope={scope} scopeIndex={index} key={scope.id} />)}</>;
}

function ModuleContent({ moduleId }: { moduleId: ModuleId }) {
  if (moduleId === "network") return <NetworkContent />;
  if (moduleId === "forecast") return <ForecastContent />;
  if (moduleId === "allocation") return <AllocationContent />;
  return <WarningContent />;
}

export default function TechnologyDecisionSupportPage() {
  const [activeModule, setActiveModule] = useState<ModuleId>(() => parseModule());
  const activeDefinition = moduleById.get(activeModule) ?? moduleDefinitions[0];
  const ActiveIcon = activeDefinition.icon;

  useEffect(() => {
    const handlePopState = () => setActiveModule(parseModule());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openModule = (moduleId: ModuleId) => {
    if (moduleId === activeModule) return;
    const url = new URL(window.location.href);
    url.searchParams.set("page", "technology-decision-support");
    url.searchParams.set("module", moduleId);
    url.hash = "tds-workspace";
    window.history.pushState({}, "", url);
    setActiveModule(moduleId);
    window.requestAnimationFrame(() => document.getElementById("tds-workspace")?.scrollIntoView({ block: "start" }));
  };

  return <div className="tds-page">
    <PortalHeader currentPage="technology-decision-support" />
    <main>
      <section id="tds-top" className="tds-hero" aria-labelledby="tds-title"><img src="./assets/thinktank-hero-compact.png" alt="" /><div className="tds-hero-inner"><div><h1 id="tds-title">科技决策支持</h1><p>以科技网络、动态预测、资源分配与使用预警为主线，将分析结果转化为可查询、可比较、可追踪的决策视图。</p></div><div className="tds-hero-flow"><span><Network size={17} />网络</span><i /><span><TrendingUp size={17} />预测</span><i /><span><CircleDollarSign size={17} />分配</span><i /><span><ShieldAlert size={17} />预警</span></div></div></section>
      <div id="tds-workspace" className="tds-shell">
        <nav className="tds-module-nav" aria-label="科技决策支持功能目录"><header><strong>功能目录</strong><small>4 项决策支持能力</small></header>{moduleDefinitions.map((module) => { const Icon = module.icon; return <button type="button" className={activeModule === module.id ? "is-active" : ""} aria-current={activeModule === module.id ? "page" : undefined} onClick={() => openModule(module.id)} key={module.id}><Icon size={18} /><span><strong>{module.label}</strong><small>{module.sections.length} 个内容区块</small></span></button>; })}<div className="tds-nav-note"><Activity size={14} /><p>全部对象、数值和预测结论均为演示。</p></div></nav>
        <section className="tds-main-column" aria-labelledby="tds-module-title"><header className="tds-module-heading"><span><ActiveIcon size={23} /></span><div><h2 id="tds-module-title">{activeDefinition.label}</h2><p>{activeDefinition.description}</p></div><DemoBadge /></header><div className="tds-content-flow" key={activeModule}><ModuleContent moduleId={activeModule} /></div></section>
      </div>
    </main>
    <PageSectionLocator items={activeDefinition.sections} topId="tds-top" label="内容定位" />
    <footer className="tds-footer"><div><img src="./assets/gkx-logo.png" alt="" /><span><strong>科技决策支持</strong><small>深圳国际科技信息中心</small></span></div><p>本页用于标书功能结构与交互演示，不构成资源分配、投资或风险处置结论。</p></footer>
  </div>;
}
