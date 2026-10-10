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
  Search,
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
    description: "围绕发展方向、人才需求、经费收益、成果贡献、进度风险与结构规模生成综合预测报告。",
    icon: TrendingUp,
    sections: [
      { id: "tds-forecast-development", label: "发展与方向预测" },
      { id: "tds-forecast-demand", label: "需求预测" },
      { id: "tds-forecast-funding", label: "经费与收益预测" },
      { id: "tds-forecast-outcome", label: "成果与贡献预测" },
      { id: "tds-forecast-progress-risk", label: "进度与风险预测" },
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

type ForecastSubject = "人才对象" | "团队对象" | "机构对象";
type ForecastEntity = {
  name: string;
  mainDirection: string;
  potential: number;
  confidence: number;
  directionCurrent: readonly number[];
  directionGrowth: readonly number[];
  commercialization: readonly number[];
  organization: readonly number[];
};

const forecastDirections = ["基础模型", "多模态智能", "具身智能", "行业智能体"] as const;
const forecastEntities: Record<ForecastSubject, readonly ForecastEntity[]> = {
  人才对象: [
    { name: "李明研究员", mainDirection: "具身智能决策", potential: 88, confidence: 84, directionCurrent: [68, 72, 76, 64], directionGrowth: [3, 4, 5, 4], commercialization: [34, 41, 49, 58, 67, 75, 82], organization: [48, 54, 61, 68, 75, 81, 86] },
    { name: "周岚研究员", mainDirection: "多模态医学智能", potential: 84, confidence: 81, directionCurrent: [64, 78, 61, 66], directionGrowth: [3, 5, 3, 4], commercialization: [32, 39, 46, 54, 62, 70, 77], organization: [46, 52, 58, 65, 72, 78, 83] },
    { name: "陈宇研究员", mainDirection: "行业智能体协同", potential: 81, confidence: 79, directionCurrent: [66, 69, 58, 75], directionGrowth: [3, 4, 3, 5], commercialization: [30, 36, 43, 51, 60, 68, 75], organization: [44, 50, 56, 63, 69, 75, 81] },
  ],
  团队对象: [
    { name: "智能系统研究团队", mainDirection: "具身智能系统", potential: 90, confidence: 86, directionCurrent: [71, 74, 80, 68], directionGrowth: [3, 4, 5, 4], commercialization: [39, 46, 54, 63, 72, 80, 87], organization: [52, 59, 66, 73, 80, 86, 91] },
    { name: "多模态计算团队", mainDirection: "多模态理解与生成", potential: 87, confidence: 85, directionCurrent: [69, 82, 63, 70], directionGrowth: [3, 5, 3, 4], commercialization: [37, 44, 52, 61, 69, 77, 84], organization: [50, 57, 64, 71, 77, 83, 88] },
    { name: "机器人技术团队", mainDirection: "人机协作控制", potential: 85, confidence: 80, directionCurrent: [62, 68, 84, 60], directionGrowth: [3, 4, 5, 3], commercialization: [35, 42, 50, 59, 67, 75, 82], organization: [47, 54, 61, 68, 75, 81, 86] },
  ],
  机构对象: [
    { name: "未来智能研究院", mainDirection: "基础模型与智能体", potential: 92, confidence: 88, directionCurrent: [83, 76, 72, 80], directionGrowth: [4, 4, 4, 5], commercialization: [42, 49, 57, 66, 75, 84, 90], organization: [55, 62, 69, 76, 83, 89, 94] },
    { name: "先进计算中心", mainDirection: "高性能智能计算", potential: 88, confidence: 84, directionCurrent: [86, 70, 65, 68], directionGrowth: [5, 3, 3, 4], commercialization: [38, 45, 53, 62, 71, 79, 86], organization: [53, 60, 67, 74, 81, 87, 92] },
    { name: "智能制造实验室", mainDirection: "工业智能与数字孪生", potential: 86, confidence: 82, directionCurrent: [65, 72, 77, 74], directionGrowth: [3, 4, 5, 4], commercialization: [40, 47, 55, 64, 73, 81, 88], organization: [49, 56, 63, 70, 77, 83, 89] },
  ],
};

function ForecastChart({ values, compare, periods, unit, subject }: { values: readonly number[]; compare: readonly number[]; periods: readonly string[]; unit: string; subject: string }) {
  const max = Math.max(...values, ...compare) * 1.12;
  const step = periods.length > 1 ? 510 / (periods.length - 1) : 0;
  const point = (value: number, index: number) => ({ x: 54 + index * step, y: 214 - value / max * 158 });
  const primary = values.map((value, index) => point(value, index));
  const secondary = compare.map((value, index) => point(value, index));
  const forecastIndex = periods.indexOf("2027");
  const forecastX = forecastIndex >= 0 ? 54 + forecastIndex * step - step / 2 : 565;
  return <svg className="tds-forecast-chart" viewBox="0 0 590 250" role="img" aria-label={`${subject}动态预测图，单位${unit}。${periods[0]}至2026为现状区间，2027至2030为预测区间。`}>
    {[56, 96, 136, 176, 216].map((y) => <line x1="44" x2="565" y1={y} y2={y} key={y} />)}
    <rect className="forecast-zone" x={forecastX} y="38" width={565 - forecastX} height="178" /><text className="zone-label" x={forecastX + 10} y="53">预测区间</text>
    <polyline className="primary" points={primary.map((item) => `${item.x},${item.y}`).join(" ")} /><polyline className="secondary" points={secondary.map((item) => `${item.x},${item.y}`).join(" ")} />
    {primary.map((item, index) => <g key={periods[index]}><circle className="primary-dot" cx={item.x} cy={item.y} r="4" /><circle className="secondary-dot" cx={secondary[index].x} cy={secondary[index].y} r="3.5" /><text className="value" x={item.x} y={item.y - 10}>{values[index]}</text><text x={item.x} y="238">{periods[index]}</text></g>)}
  </svg>;
}

const forecastPeriods = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"] as const;
const forecastRangeStarts: Record<string, number> = { "2024—2030": 0, "2025—2030": 1, "2026—2030": 2 };

function DirectionHeatmap({ entity }: { entity: ForecastEntity }) {
  const columns = ["现状", "2027", "2028", "2029", "2030"];
  return <div className="tds-direction-heatmap" role="img" aria-label={`${entity.name}研究方向现状与未来潜力热力图`}>
    <span className="corner">研究方向</span>{columns.map((column) => <strong key={column}>{column}</strong>)}
    {forecastDirections.map((direction, row) => <div className="row" key={direction}><b>{direction}</b>{columns.map((column, index) => { const score = Math.min(98, entity.directionCurrent[row] + entity.directionGrowth[row] * index); const level = Math.min(4, Math.floor(score / 20)); return <span className={`level-${level}`} aria-label={`${direction} ${column} 潜力 ${score}`} key={column}>{score}</span>; })}</div>)}
  </div>;
}

function TalentStackedAreaChart({ periods, subject, entityIndex }: { periods: readonly string[]; subject: ForecastSubject; entityIndex: number }) {
  const subjectBias = ["人才对象", "团队对象", "机构对象"].indexOf(subject) * 2;
  const leader = periods.map((_, index) => 12 + subjectBias + entityIndex + index * 2);
  const backbone = periods.map((_, index) => 34 + subjectBias + Math.floor(index * 1.5));
  const youth = periods.map((_, index) => 100 - leader[index] - backbone[index]);
  const layers = [{ label: "青年层", values: youth, className: "youth" }, { label: "骨干层", values: backbone, className: "backbone" }, { label: "领军层", values: leader, className: "leader" }];
  const step = periods.length > 1 ? 510 / (periods.length - 1) : 0;
  let cumulative = periods.map(() => 0);
  return <svg className="tds-stacked-area-chart" viewBox="0 0 590 250" role="img" aria-label={`${subject}人才层级面积堆积预测图`}>
    {[55, 95, 135, 175, 215].map((y) => <line x1="44" x2="565" y1={y} y2={y} key={y} />)}
    {layers.map((layer) => { const lower = [...cumulative]; cumulative = cumulative.map((value, index) => value + layer.values[index]); const topPoints = cumulative.map((value, index) => `${54 + index * step},${215 - value * 1.6}`); const lowerPoints = lower.map((value, index) => `${54 + index * step},${215 - value * 1.6}`).reverse(); return <polygon className={layer.className} points={[...topPoints, ...lowerPoints].join(" ")} key={layer.label} />; })}
    {periods.map((period, index) => <text x={54 + index * step} y="238" key={period}>{period}</text>)}
  </svg>;
}

type DemandSeries = { demand: readonly number[]; cultivated: readonly number[]; total: readonly number[] };
type DemandForecastObject = { id: string; name: string; scope: string; focus: string; report: string; series: DemandSeries };

const demandForecastObjects: readonly DemandForecastObject[] = [
  { id: "embodied-intelligence", name: "具身智能产业", scope: "技术领域", focus: "机器人系统、感知决策与场景验证", report: "具身智能进入场景验证和系统集成加速期，新增人才需求高于培养供给，应重点补充机器人系统、控制算法与工程验证人才。", series: { demand: [58, 64, 72, 81, 92, 104, 118], cultivated: [40, 45, 51, 58, 66, 75, 85], total: [124, 136, 150, 166, 184, 204, 226] } },
  { id: "multimodal-intelligence", name: "多模态智能产业", scope: "技术领域", focus: "数据工程、模型训练与行业应用", report: "多模态智能的人才培养能力稳步提升，但行业应用扩张仍带来持续缺口，重点需求集中在数据工程、模型评测与行业解决方案岗位。", series: { demand: [52, 58, 65, 73, 82, 92, 103], cultivated: [39, 44, 50, 57, 64, 72, 81], total: [112, 123, 136, 150, 166, 183, 201] } },
  { id: "synthetic-biology", name: "合成生物产业", scope: "未来产业", focus: "基因工程、生物制造与中试转化", report: "合成生物需求由研发端向中试和产业化环节延伸，培养供给增长较快，但复合型工程人才仍是预测期主要缺口。", series: { demand: [44, 49, 56, 64, 73, 83, 94], cultivated: [34, 38, 43, 49, 56, 68, 77], total: [84, 94, 106, 120, 136, 154, 174] } },
  { id: "quantum-information", name: "量子信息产业", scope: "未来产业", focus: "量子器件、系统工程与精密测控", report: "量子信息人才需求规模相对集中，但专业门槛较高，培养周期较长，应加强量子器件、系统工程与精密测控方向的连续培养。", series: { demand: [31, 35, 40, 46, 53, 61, 70], cultivated: [22, 25, 29, 33, 38, 44, 51], total: [72, 80, 89, 99, 110, 122, 135] } },
];

function DemandSeriesChart({ series, periods, name, scaleMax }: { series: DemandSeries; periods: readonly string[]; name: string; scaleMax: number }) {
  const max = Math.max(scaleMax, 1);
  const step = periods.length > 1 ? 430 / (periods.length - 1) : 0;
  const point = (value: number, index: number) => `${48 + index * step},${210 - value / max * 158}`;
  const forecastIndex = periods.indexOf("2027");
  const forecastX = forecastIndex >= 0 ? 48 + forecastIndex * step - step / 2 : 478;
  return <svg className="tds-demand-chart" viewBox="0 0 500 244" role="img" aria-label={`${name}需求预测。${periods.map((period, index) => `${period}年人才需求${series.demand[index]}人、培养人才数量${series.cultivated[index]}人、需求总量${series.total[index]}人`).join("；")}`}>
    {[0, .25, .5, .75, 1].map((ratio) => { const y = 210 - ratio * 158; return <g key={ratio}><line x1="38" x2="478" y1={y} y2={y}/><text className="axis-label" x="32" y={y + 3}>{Math.round(max * ratio)}</text></g>; })}
    <rect className="forecast-zone" x={forecastX} y="38" width={478 - forecastX} height="178"/><text className="zone-label" x={forecastX + 8} y="52">预测区间</text>
    <polyline className="demand" points={series.demand.map(point).join(" ")}/><polyline className="cultivated" points={series.cultivated.map(point).join(" ")}/><polyline className="total" points={series.total.map(point).join(" ")}/>
    {series.total.map((value, index) => <g key={periods[index]}><circle cx={48 + index * step} cy={210 - value / max * 158} r="3.5"/><text x={48 + index * step} y="235">{periods[index]}</text></g>)}
  </svg>;
}

function DemandComparisonPanel({ entity, periods, rangeStart, roleLabel, scaleMax }: { entity: DemandForecastObject; periods: readonly string[]; rangeStart: number; roleLabel: string; scaleMax: number }) {
  const series = { demand: entity.series.demand.slice(rangeStart), cultivated: entity.series.cultivated.slice(rangeStart), total: entity.series.total.slice(rangeStart) };
  const gap = (series.demand.at(-1) ?? 0) - (series.cultivated.at(-1) ?? 0);
  const endYear = periods.at(-1) ?? "2030";
  return <article className="tds-demand-panel"><header><div><span>{roleLabel} · {entity.scope}</span><strong>{entity.name}</strong><small>{entity.focus}</small></div><em>{endYear} 年预测</em></header><div className="tds-demand-legend"><span><i className="demand"/>人才需求</span><span><i className="cultivated"/>培养人才数量</span><span><i className="total"/>需求总量</span></div><DemandSeriesChart series={series} periods={periods} name={entity.name} scaleMax={scaleMax}/><dl><div><dt>人才需求</dt><dd>{series.demand.at(-1)} 人</dd></div><div><dt>培养人才数量</dt><dd>{series.cultivated.at(-1)} 人</dd></div><div><dt>需求总量</dt><dd>{series.total.at(-1)} 人</dd></div></dl><p className="tds-demand-gap"><span>人才供需缺口</span><strong>{gap} 人</strong></p><div className="tds-demand-reading"><strong>预测解读</strong><p>{entity.report}</p></div></article>;
}

type FundingProject = { id: string; name: string; focus: string; researchFunding: readonly number[]; studyFunding: readonly number[]; revenue: readonly number[]; growth: readonly number[]; report: string };

const fundingProjects: readonly FundingProject[] = [
  { id: "foundation-model", name: "基础模型研发专项", focus: "训练推理、数据治理与评测工具链", researchFunding: [760, 820, 890, 980, 1080, 1190, 1320], studyFunding: [510, 560, 620, 690, 760, 830, 910], revenue: [320, 390, 470, 580, 700, 840, 990], growth: [8.2, 8.8, 9.5, 10.4, 11.2, 12.1, 12.6], report: "投入规模与科创收益同步增长，预测期收益增速高于研究经费增速，重点关注评测工具链和行业适配能力。" },
  { id: "embodied-intelligence", name: "具身智能验证专项", focus: "感知、规划、控制与场景验证", researchFunding: [680, 750, 840, 950, 1080, 1230, 1400], studyFunding: [470, 520, 590, 670, 760, 860, 970], revenue: [250, 310, 390, 500, 640, 800, 980], growth: [7.6, 8.4, 9.6, 11.0, 12.5, 14.2, 15.0], report: "验证环境和系统集成投入占比较高，科创收益在完成样机验证后明显提升，应持续跟踪中试与场景复制进度。" },
  { id: "industry-agent", name: "行业智能体应用专项", focus: "行业知识、工具调用与多智能体协同", researchFunding: [590, 650, 720, 810, 910, 1020, 1140], studyFunding: [410, 450, 500, 560, 630, 700, 780], revenue: [300, 370, 460, 570, 700, 850, 1020], growth: [8.0, 9.1, 10.2, 11.5, 12.8, 14.0, 15.4], report: "行业智能体应用形成较快的收益增长曲线，投入重点由模型能力建设逐步转向场景运营与产品服务。" },
] as const;

type FundingSeries = { researchFunding: number[]; studyFunding: number[]; revenue: number[]; growth: number[] };

function getFundingSeries(project: FundingProject, entity: ForecastEntity): FundingSeries {
  const factor = .92 + (entity.potential - 80) * .012;
  return {
    researchFunding: project.researchFunding.map((value) => Math.round(value * factor)),
    studyFunding: project.studyFunding.map((value) => Math.round(value * factor)),
    revenue: project.revenue.map((value) => Math.round(value * (.9 + (entity.confidence - 75) * .014))),
    growth: project.growth.map((value) => Number((value + (entity.potential - 85) * .16).toFixed(1))),
  };
}

function FundingRevenueChart({ series, periods, name }: { series: FundingSeries; periods: readonly string[]; name: string }) {
  const maxValue = Math.max(...series.researchFunding, ...series.studyFunding, ...series.revenue) * 1.12;
  const step = periods.length > 1 ? 620 / (periods.length - 1) : 0;
  const barWidth = periods.length > 5 ? 8 : 11;
  const forecastIndex = periods.indexOf("2027");
  const forecastX = forecastIndex >= 0 ? 56 + forecastIndex * step - step / 2 : 690;
  const growthPoints = series.growth.map((value, index) => `${56 + index * step},${220 - value * 8}`);
  return <svg className="tds-funding-chart" viewBox="0 0 720 270" role="img" aria-label={`${name}科研经费、研究经费、科创收益和经费增长预测图`}>
    {[60, 100, 140, 180, 220].map((y) => <line x1="42" x2="690" y1={y} y2={y} key={y}/>)}
    <rect className="forecast-zone" x={forecastX} y="38" width={690 - forecastX} height="182"/><text className="zone-label" x={forecastX + 8} y="52">预测区间</text>
    {periods.map((period, index) => { const x = 56 + index * step; const bars = [{ value: series.researchFunding[index], className: "research" }, { value: series.studyFunding[index], className: "study" }, { value: series.revenue[index], className: "revenue" }]; return <g key={period}>{bars.map((bar, barIndex) => { const height = bar.value / maxValue * 150; return <rect className={bar.className} x={x + (barIndex - 1) * (barWidth + 2) - barWidth / 2} y={220 - height} width={barWidth} height={height} key={bar.className}/>; })}<text x={x} y="252">{period}</text></g>; })}
    <polyline className="growth" points={growthPoints.join(" ")}/>{growthPoints.map((point, index) => <circle cx={point.split(",")[0]} cy={point.split(",")[1]} r="3.5" key={periods[index]}/>)}
  </svg>;
}

type OutcomeObjectType = "全部对象" | "研究人才" | "研究团队" | "研究机构" | "科研项目";
type OutcomeForecastObject = {
  id: string;
  type: Exclude<OutcomeObjectType, "全部对象">;
  name: string;
  institution: string;
  accuracy: number;
  researchOutcomes: readonly number[];
  institutionOutcomes: readonly number[];
  contribution: readonly number[];
  report: string;
};

const outcomeForecastObjects: readonly OutcomeForecastObject[] = [
  { id: "outcome-talent", type: "研究人才", name: "林澈研究员", institution: "量子科学研究中心", accuracy: 87, researchOutcomes: [8, 10, 12, 15, 18, 21, 25], institutionOutcomes: [42, 48, 55, 63, 72, 82, 93], contribution: [56, 61, 67, 72, 78, 84, 89], report: "个人科研成果保持稳定增长，对机构关键实验能力和高水平成果产出的贡献预计持续提升。" },
  { id: "outcome-team", type: "研究团队", name: "具身智能研究团队", institution: "未来智能研究院", accuracy: 91, researchOutcomes: [14, 17, 21, 26, 32, 39, 47], institutionOutcomes: [38, 45, 53, 62, 72, 83, 95], contribution: [62, 67, 72, 78, 83, 88, 93], report: "团队成果增长主要由关键技术攻关和场景验证带动，预测期将成为机构成果增量的主要来源。" },
  { id: "outcome-institution", type: "研究机构", name: "未来智能研究院", institution: "深圳未来产业创新体系", accuracy: 89, researchOutcomes: [28, 34, 41, 49, 58, 68, 79], institutionOutcomes: [70, 81, 93, 106, 120, 135, 151], contribution: [68, 72, 76, 81, 85, 89, 92], report: "机构成果产出与产业协同贡献同步上升，建议持续关注高价值专利、标准和联合项目的转化效率。" },
  { id: "outcome-project", type: "科研项目", name: "基础模型关键技术专项", institution: "先进计算中心", accuracy: 85, researchOutcomes: [10, 13, 17, 22, 28, 35, 43], institutionOutcomes: [48, 56, 65, 75, 86, 98, 111], contribution: [60, 65, 70, 76, 81, 86, 90], report: "项目预计形成连续的论文、专利和工程成果，对机构基础模型能力建设和共性技术供给贡献明显。" },
];

function OutcomeContributionChart({ entity, periods, rangeStart }: { entity: OutcomeForecastObject; periods: readonly string[]; rangeStart: number }) {
  const research = entity.researchOutcomes.slice(rangeStart);
  const institution = entity.institutionOutcomes.slice(rangeStart);
  const contribution = entity.contribution.slice(rangeStart);
  const maxOutput = Math.max(...research, ...institution) * 1.12;
  const step = periods.length > 1 ? 620 / (periods.length - 1) : 0;
  const barWidth = periods.length > 5 ? 12 : 16;
  const contributionPoints = contribution.map((value, index) => `${56 + index * step},${220 - value / 100 * 160}`);
  const forecastIndex = periods.indexOf("2027");
  const forecastX = forecastIndex >= 0 ? 56 + forecastIndex * step - step / 2 : 690;
  return <svg className="tds-outcome-chart" viewBox="0 0 720 270" role="img" aria-label={`${entity.name}科研成果、机构成果产出与机构贡献预测；预测准确率${entity.accuracy}%`}>
    {[60, 100, 140, 180, 220].map((y) => <line x1="42" x2="690" y1={y} y2={y} key={y}/>)}
    <rect className="forecast-zone" x={forecastX} y="38" width={690 - forecastX} height="182"/><text className="zone-label" x={forecastX + 8} y="52">预测区间</text>
    {periods.map((period, index) => { const x = 56 + index * step; const researchHeight = research[index] / maxOutput * 150; const institutionHeight = institution[index] / maxOutput * 150; return <g key={period}><rect className="research-outcome" x={x - barWidth - 2} y={220 - researchHeight} width={barWidth} height={researchHeight}/><rect className="institution-outcome" x={x + 2} y={220 - institutionHeight} width={barWidth} height={institutionHeight}/><text x={x} y="252">{period}</text></g>; })}
    <polyline className="contribution" points={contributionPoints.join(" ")}/>{contributionPoints.map((point, index) => <circle cx={point.split(",")[0]} cy={point.split(",")[1]} r="3.5" key={periods[index]}/>) }
  </svg>;
}

type ProgressRiskObject = {
  id: string;
  type: "个人" | "团队" | "机构";
  name: string;
  plan: readonly number[];
  actual: readonly number[];
  riskRows: readonly { label: string; values: readonly number[] }[];
  summary: string;
  recommendation: string;
};

const progressRiskObjects: readonly ProgressRiskObject[] = [
  { id: "progress-person", type: "个人", name: "林澈研究员", plan: [18, 32, 48, 63, 78, 90, 100], actual: [17, 30, 44, 57, 69, 82, 94], riskRows: [{ label: "进度偏差", values: [28, 35, 43, 52, 58] }, { label: "技术风险", values: [24, 31, 38, 44, 49] }, { label: "协作风险", values: [18, 22, 27, 31, 35] }, { label: "资源风险", values: [32, 38, 46, 53, 59] }], summary: "当前进度略低于正常研究进度，主要风险集中在关键实验验证和跨团队资源协调。", recommendation: "建议提前锁定关键实验窗口，并在2028年前补充工程验证与数据支持资源。" },
  { id: "progress-team", type: "团队", name: "具身智能研究团队", plan: [16, 30, 46, 62, 78, 91, 100], actual: [15, 27, 40, 52, 64, 76, 88], riskRows: [{ label: "进度偏差", values: [36, 44, 55, 66, 72] }, { label: "技术风险", values: [31, 39, 48, 57, 64] }, { label: "协作风险", values: [27, 34, 42, 50, 57] }, { label: "资源风险", values: [40, 48, 58, 68, 75] }], summary: "团队实际研究进度与正常进度差距持续扩大，系统集成和场景验证环节存在较高延迟风险。", recommendation: "优先调整跨组依赖任务，增加系统集成人员，并按月复核关键里程碑。" },
  { id: "progress-institution", type: "机构", name: "未来智能研究院", plan: [20, 35, 50, 65, 80, 92, 100], actual: [19, 34, 48, 60, 71, 83, 93], riskRows: [{ label: "进度偏差", values: [22, 29, 37, 46, 53] }, { label: "技术风险", values: [26, 32, 39, 45, 51] }, { label: "协作风险", values: [30, 36, 43, 49, 55] }, { label: "资源风险", values: [28, 35, 42, 48, 54] }], summary: "机构整体进度处于可控区间，跨部门协同和公共平台排期是当前主要风险来源。", recommendation: "建议建立跨部门任务看板，优先协调公共平台容量与重点项目排期。" },
];

function ProgressRiskHeatmap({ entity }: { entity: ProgressRiskObject }) {
  const years = ["2026", "2027", "2028", "2029", "2030"];
  return <div className="tds-risk-heat" role="img" aria-label={`${entity.name}研究风险热力图，颜色由蓝到红表示风险由低到高`}><header><strong>研究风险热力图</strong><small>蓝色低风险 → 红色高风险</small></header><div><span className="tds-risk-heat-head"><b>风险维度</b>{years.map((year) => <em key={year}>{year}</em>)}</span>{entity.riskRows.map((row) => <span key={row.label}><b>{row.label}</b>{row.values.map((value, index) => <em className={`tds-risk-cell level-${Math.min(4, Math.floor(value / 20))}`} aria-label={`${row.label}${years[index]}年风险值${value}`} key={years[index]}>{value}</em>)}</span>)}</div></div>;
}

type StructureMode = "团队人员结构" | "机构部门结构";
type StructureNode = { id: string; label: string; value: string; detail: string; x: number; y: number };

const structureNodes: Record<StructureMode, readonly StructureNode[]> = {
  团队人员结构: [
    { id: "leader", label: "项目负责人", value: "1 人", detail: "负责研究方向、任务拆解和跨组协同。", x: 50, y: 14 },
    { id: "core", label: "核心骨干", value: "6 人", detail: "承担关键技术攻关、方法验证和技术评审。", x: 18, y: 42 },
    { id: "youth", label: "青年研究", value: "12 人", detail: "承担实验设计、数据分析与研究迭代。", x: 82, y: 42 },
    { id: "engineering", label: "工程转化", value: "8 人", detail: "负责原型实现、系统集成和场景验证。", x: 22, y: 78 },
    { id: "support", label: "数据支持", value: "5 人", detail: "负责数据治理、算力调度和评测支撑。", x: 78, y: 78 },
  ],
  机构部门结构: [
    { id: "coordination", label: "战略协调", value: "1 个", detail: "统筹机构发展方向、重大任务与资源配置。", x: 50, y: 14 },
    { id: "basic", label: "基础研究部", value: "3 个单元", detail: "组织基础理论、前沿方法和共性技术研究。", x: 18, y: 42 },
    { id: "development", label: "技术研发部", value: "4 个单元", detail: "承担关键技术攻关、系统研发和工程验证。", x: 82, y: 42 },
    { id: "translation", label: "成果转化部", value: "2 个单元", detail: "连接知识产权、产品孵化与应用场景。", x: 22, y: 78 },
    { id: "platform", label: "公共平台部", value: "3 个平台", detail: "提供数据、算力、实验设施与评测能力。", x: 78, y: 78 },
  ],
};

function StructureNetwork({ mode, targetName, nodes, selectedId, onSelect }: { mode: StructureMode; targetName: string; nodes: readonly StructureNode[]; selectedId: string; onSelect: (id: string) => void }) {
  return <div className="tds-structure-network" role="group" aria-label={`${targetName}${mode}关系网络`}><svg viewBox="0 0 460 290" aria-hidden="true">{nodes.map((node) => <line x1="50%" y1="50%" x2={`${node.x}%`} y2={`${node.y}%`} key={node.id}/>)}</svg><div className="root"><strong>{targetName}</strong><span>{mode}</span></div>{nodes.map((node) => <button type="button" className={selectedId === node.id ? "is-active" : ""} aria-pressed={selectedId === node.id} onClick={() => onSelect(node.id)} style={{ left: `${node.x}%`, top: `${node.y}%` }} key={node.id}><strong>{node.label}</strong><span>{node.value}</span></button>)}</div>;
}

function ScaleAreaChart({ values, compare, periods, targetName, comparisonName }: { values: readonly number[]; compare: readonly number[]; periods: readonly string[]; targetName: string; comparisonName: string }) {
  const max = Math.max(...values, ...compare) * 1.12;
  const step = periods.length > 1 ? 430 / (periods.length - 1) : 0;
  const point = (value: number, index: number) => ({ x: 48 + index * step, y: 210 - value / max * 156 });
  const targetPoints = values.map(point);
  const comparePoints = compare.map(point);
  const targetArea = [`48,216`, ...targetPoints.map((item) => `${item.x},${item.y}`), `${48 + (periods.length - 1) * step},216`].join(" ");
  const compareArea = [`48,216`, ...comparePoints.map((item) => `${item.x},${item.y}`), `${48 + (periods.length - 1) * step},216`].join(" ");
  const forecastIndex = periods.indexOf("2027");
  const forecastX = forecastIndex >= 0 ? 48 + forecastIndex * step - step / 2 : 478;
  return <svg className="tds-scale-area-chart" viewBox="0 0 500 244" role="img" aria-label={`${targetName}与${comparisonName}发展规模面积图`}>
    {[56, 96, 136, 176, 216].map((y) => <line x1="38" x2="478" y1={y} y2={y} key={y}/>)}<rect className="forecast-zone" x={forecastX} y="38" width={478 - forecastX} height="178"/><text className="zone-label" x={forecastX + 8} y="52">预测区间</text><polygon className="comparison-area" points={compareArea}/><polygon className="target-area" points={targetArea}/><polyline className="comparison-line" points={comparePoints.map((item) => `${item.x},${item.y}`).join(" ")}/><polyline className="target-line" points={targetPoints.map((item) => `${item.x},${item.y}`).join(" ")}/>{periods.map((period, index) => <text x={48 + index * step} y="238" key={period}>{period}</text>)}
  </svg>;
}

type DevelopmentView = "研究方向" | "人才层级" | "成果产业化" | "单位发展";
const developmentViews: readonly DevelopmentView[] = ["研究方向", "人才层级", "成果产业化", "单位发展"];

function ForecastContent() {
  const [subject, setSubject] = useState<ForecastSubject>("人才对象");
  const [target, setTarget] = useState(forecastEntities.人才对象[0].name);
  const [comparison, setComparison] = useState(forecastEntities.人才对象[1].name);
  const [range, setRange] = useState("2024—2030");
  const [developmentView, setDevelopmentView] = useState<DevelopmentView>("研究方向");
  const [demandTargetId, setDemandTargetId] = useState(demandForecastObjects[0].id);
  const [demandComparisonId, setDemandComparisonId] = useState(demandForecastObjects[1].id);
  const [demandRange, setDemandRange] = useState("2024—2030");
  const [fundingProjectId, setFundingProjectId] = useState(fundingProjects[0].id);
  const [outcomeType, setOutcomeType] = useState<OutcomeObjectType>("全部对象");
  const [outcomeQuery, setOutcomeQuery] = useState("");
  const [selectedOutcomeId, setSelectedOutcomeId] = useState(outcomeForecastObjects[0].id);
  const [progressType, setProgressType] = useState<ProgressRiskObject["type"]>("个人");
  const [progressTargetId, setProgressTargetId] = useState(progressRiskObjects[0].id);
  const [structureMode, setStructureMode] = useState<StructureMode>("团队人员结构");
  const [structureTarget, setStructureTarget] = useState(forecastEntities.团队对象[0].name);
  const [structureComparison, setStructureComparison] = useState(forecastEntities.团队对象[1].name);
  const [selectedStructureNodeId, setSelectedStructureNodeId] = useState(structureNodes.团队人员结构[0].id);
  const rangeStart = forecastRangeStarts[range];
  const periods = forecastPeriods.slice(rangeStart);
  const subjectEntities = forecastEntities[subject];
  const targetEntity = subjectEntities.find((entity) => entity.name === target) ?? subjectEntities[0];
  const comparisonEntity = subjectEntities.find((entity) => entity.name === comparison) ?? subjectEntities[1];
  const targetIndex = subjectEntities.findIndex((entity) => entity.name === targetEntity.name);
  const demandRangeStart = forecastRangeStarts[demandRange];
  const demandPeriods = forecastPeriods.slice(demandRangeStart);
  const demandTarget = demandForecastObjects.find((item) => item.id === demandTargetId) ?? demandForecastObjects[0];
  const demandComparison = demandForecastObjects.find((item) => item.id === demandComparisonId) ?? demandForecastObjects.find((item) => item.id !== demandTarget.id)!;
  const demandTargetSeries = { demand: demandTarget.series.demand.slice(demandRangeStart), cultivated: demandTarget.series.cultivated.slice(demandRangeStart), total: demandTarget.series.total.slice(demandRangeStart) };
  const demandComparisonSeries = { demand: demandComparison.series.demand.slice(demandRangeStart), cultivated: demandComparison.series.cultivated.slice(demandRangeStart), total: demandComparison.series.total.slice(demandRangeStart) };
  const demandSharedMax = Math.ceil(Math.max(...demandTargetSeries.total, ...demandComparisonSeries.total) * 1.08 / 20) * 20;
  const normalizedOutcomeQuery = outcomeQuery.trim().toLocaleLowerCase("zh-CN");
  const filteredOutcomeObjects = useMemo(() => outcomeForecastObjects.filter((item) => (outcomeType === "全部对象" || item.type === outcomeType) && (!normalizedOutcomeQuery || `${item.name}${item.institution}`.toLocaleLowerCase("zh-CN").includes(normalizedOutcomeQuery))), [outcomeType, normalizedOutcomeQuery]);
  const selectedOutcome = filteredOutcomeObjects.find((item) => item.id === selectedOutcomeId) ?? filteredOutcomeObjects[0];
  const progressObjects = progressRiskObjects.filter((item) => item.type === progressType);
  const progressTarget = progressObjects.find((item) => item.id === progressTargetId) ?? progressObjects[0];
  const progressGap = progressTarget ? (progressTarget.plan.at(-1) ?? 0) - (progressTarget.actual.at(-1) ?? 0) : 0;
  const highestRiskScore = progressTarget ? Math.max(...progressTarget.riskRows.flatMap((row) => row.values)) : 0;
  const progressRiskLevel = highestRiskScore >= 70 ? "高" : highestRiskScore >= 50 ? "中" : "低";
  const fundingProject = fundingProjects.find((project) => project.id === fundingProjectId) ?? fundingProjects[0];
  const targetFunding = getFundingSeries(fundingProject, targetEntity);
  const comparisonFunding = getFundingSeries(fundingProject, comparisonEntity);
  const structureEntities = structureMode === "团队人员结构" ? forecastEntities.团队对象 : forecastEntities.机构对象;
  const structureTargetEntity = structureEntities.find((entity) => entity.name === structureTarget) ?? structureEntities[0];
  const structureComparisonEntity = structureEntities.find((entity) => entity.name === structureComparison) ?? structureEntities[1];
  const currentStructureNodes = structureNodes[structureMode];
  const selectedStructureNode = currentStructureNodes.find((node) => node.id === selectedStructureNodeId) ?? currentStructureNodes[0];
  const chooseSubject = (nextSubject: ForecastSubject) => {
    setSubject(nextSubject);
    setTarget(forecastEntities[nextSubject][0].name);
    setComparison(forecastEntities[nextSubject][1].name);
  };
  const chooseTarget = (nextTarget: string) => {
    setTarget(nextTarget);
    if (nextTarget === comparison) {
      setComparison(subjectEntities.find((item) => item.name !== nextTarget)?.name ?? nextTarget);
    }
  };
  const chooseDevelopmentView = (nextView: DevelopmentView) => {
    setDevelopmentView(nextView);
    if (nextView === "单位发展" && subject !== "机构对象") chooseSubject("机构对象");
  };
  const chooseDemandTarget = (nextTargetId: string) => {
    setDemandTargetId(nextTargetId);
    if (nextTargetId === demandComparisonId) setDemandComparisonId(demandForecastObjects.find((item) => item.id !== nextTargetId)?.id ?? nextTargetId);
  };
  const chooseProgressType = (nextType: ProgressRiskObject["type"]) => {
    setProgressType(nextType);
    setProgressTargetId(progressRiskObjects.find((item) => item.type === nextType)?.id ?? progressRiskObjects[0].id);
  };
  const chooseStructureMode = (nextMode: StructureMode) => {
    const nextEntities = nextMode === "团队人员结构" ? forecastEntities.团队对象 : forecastEntities.机构对象;
    setStructureMode(nextMode);
    setStructureTarget(nextEntities[0].name);
    setStructureComparison(nextEntities[1].name);
    setSelectedStructureNodeId(structureNodes[nextMode][0].id);
  };
  const chooseStructureTarget = (nextTarget: string) => {
    setStructureTarget(nextTarget);
    if (nextTarget === structureComparison) setStructureComparison(structureEntities.find((entity) => entity.name !== nextTarget)?.name ?? nextTarget);
  };
  const fundingComparisonRows = [
    { label: "科研经费", targetValue: targetFunding.researchFunding.at(-1) ?? 0, comparisonValue: comparisonFunding.researchFunding.at(-1) ?? 0, unit: "万元" },
    { label: "研究经费", targetValue: targetFunding.studyFunding.at(-1) ?? 0, comparisonValue: comparisonFunding.studyFunding.at(-1) ?? 0, unit: "万元" },
    { label: "科创收益", targetValue: targetFunding.revenue.at(-1) ?? 0, comparisonValue: comparisonFunding.revenue.at(-1) ?? 0, unit: "万元" },
    { label: "经费增长", targetValue: targetFunding.growth.at(-1) ?? 0, comparisonValue: comparisonFunding.growth.at(-1) ?? 0, unit: "%" },
  ];
  const demandComparisonRows = [
    { label: "人才需求", targetValue: demandTargetSeries.demand.at(-1) ?? 0, comparisonValue: demandComparisonSeries.demand.at(-1) ?? 0 },
    { label: "培养人才数量", targetValue: demandTargetSeries.cultivated.at(-1) ?? 0, comparisonValue: demandComparisonSeries.cultivated.at(-1) ?? 0 },
    { label: "需求总量", targetValue: demandTargetSeries.total.at(-1) ?? 0, comparisonValue: demandComparisonSeries.total.at(-1) ?? 0 },
  ];
  return <>
    <div className="tds-shared-controls"><div><span>预测对象</span>{(Object.keys(forecastEntities) as ForecastSubject[]).map((item) => <button type="button" className={subject === item ? "is-active" : ""} aria-pressed={subject === item} onClick={() => chooseSubject(item)} key={item}>{item}</button>)}</div><label><span>当前对象</span><select value={target} onChange={(event) => chooseTarget(event.target.value)}>{subjectEntities.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label><span>时间范围</span><select value={range} onChange={(event) => setRange(event.target.value)}>{Object.keys(forecastRangeStarts).map((item) => <option key={item}>{item}</option>)}</select></label><label><span>分屏对比</span><select value={comparison} onChange={(event) => setComparison(event.target.value)}>{subjectEntities.filter((item) => item.name !== target).map((item) => <option key={item.name}>{item.name}</option>)}</select></label></div>
    <ContentSection id="tds-forecast-development" title="发展与方向预测" description="以综合预测报告展示人才、团队及机构未来主要发展方向和发展潜力，并结合热力图、折线图与面积堆积图呈现预测结果。" aside={<span className="tds-section-icon"><Radar size={18}/></span>}>
      <section className="tds-comprehensive-report is-inline" aria-labelledby="tds-comprehensive-title"><header><span>综合预测报告</span><h3 id="tds-comprehensive-title">{targetEntity.name}</h3><p>未来主要发展方向为“{targetEntity.mainDirection}”，综合研究方向、人才层级、成果产业化与单位发展趋势形成预测结论。</p></header><dl><div><dt>主要发展方向</dt><dd>{targetEntity.mainDirection}</dd></div><div><dt>发展潜力</dt><dd>{targetEntity.potential}<small>/100</small></dd></div><div><dt>预测置信度</dt><dd>{targetEntity.confidence}%</dd></div><div><dt>预测区间</dt><dd>2027—2030</dd></div></dl></section>
      <div className="tds-development-tabs" role="tablist" aria-label="发展与方向预测内容">{developmentViews.map((item) => <button type="button" role="tab" aria-selected={developmentView === item} className={developmentView === item ? "is-active" : ""} onClick={() => chooseDevelopmentView(item)} key={item}>{item}</button>)}</div>
      <div className="tds-development-workspace" role="tabpanel">
        {developmentView === "研究方向" && <div className="tds-direction-layout"><div className="tds-direction-panel"><header><strong>方向潜力热力图</strong><span>现状 → 未来</span></header><DirectionHeatmap entity={targetEntity}/></div><aside className="tds-forecast-report"><span>方向研判</span><h4>{targetEntity.mainDirection}</h4><p>{targetEntity.name}在预测期的主要潜力集中于{targetEntity.mainDirection}，并与{forecastDirections[targetEntity.directionCurrent.indexOf(Math.max(...targetEntity.directionCurrent))]}现有能力形成承接。</p><dl><div><dt>当前对象</dt><dd>{targetEntity.name}</dd></div><div><dt>对比对象</dt><dd>{comparisonEntity.name}</dd></div><div><dt>潜力指数</dt><dd>{targetEntity.potential}</dd></div></dl></aside></div>}
        {developmentView === "人才层级" && <div className="tds-talent-forecast-layout"><div className="tds-chart-panel"><header><div><strong>人才层级结构</strong><small>占比：%</small></div><span className="tds-stack-legend"><i className="youth"/>青年层<i className="backbone"/>骨干层<i className="leader"/>领军层</span></header><TalentStackedAreaChart periods={periods} subject={subject} entityIndex={targetIndex}/></div><aside className="tds-forecast-report"><span>层级研判</span><h4>{targetEntity.name} · 人才结构</h4><p>预测期内领军与骨干层占比逐步提升，青年层保持稳定补充，整体形成梯度更清晰的人才结构。</p><dl><div><dt>对象类型</dt><dd>{subject}</dd></div><div><dt>观察周期</dt><dd>{range}</dd></div><div><dt>结构趋势</dt><dd>梯度优化</dd></div></dl></aside></div>}
        {developmentView === "成果产业化" && <div className="tds-forecast-layout"><div className="tds-chart-panel"><header><div><strong>成果产业化潜力</strong><small>单位：指数</small></div><span><i className="primary"/>{targetEntity.name}<i className="secondary"/>{comparisonEntity.name}</span></header><ForecastChart values={targetEntity.commercialization.slice(rangeStart)} compare={comparisonEntity.commercialization.slice(rangeStart)} periods={periods} unit="指数" subject={targetEntity.name}/></div><aside className="tds-forecast-report"><span>产业化研判</span><h4>{targetEntity.name}</h4><p>预测期产业化潜力持续上升，建议重点跟踪原型验证、中试衔接与场景应用三个关键阶段。</p><dl><div><dt>现状指数</dt><dd>{targetEntity.commercialization[2]}</dd></div><div><dt>2030 预测</dt><dd>{targetEntity.commercialization.at(-1)}</dd></div><div><dt>发展潜力</dt><dd>{targetEntity.potential}</dd></div></dl></aside></div>}
        {developmentView === "单位发展" && <div className="tds-forecast-layout"><div className="tds-chart-panel"><header><div><strong>单位发展指数</strong><small>单位：指数</small></div><span><i className="primary"/>{targetEntity.name}<i className="secondary"/>{comparisonEntity.name}</span></header><ForecastChart values={targetEntity.organization.slice(rangeStart)} compare={comparisonEntity.organization.slice(rangeStart)} periods={periods} unit="指数" subject={targetEntity.name}/></div><aside className="tds-forecast-report"><span>单位发展研判</span><h4>{targetEntity.mainDirection}</h4><p>综合方向热度、人才层级和成果产业化趋势，{targetEntity.name}在预测期具备持续增长潜力。</p><dl><div><dt>2026 现状</dt><dd>{targetEntity.organization[2]}</dd></div><div><dt>2030 预测</dt><dd>{targetEntity.organization.at(-1)}</dd></div><div><dt>预测置信度</dt><dd>{targetEntity.confidence}%</dd></div></dl></aside></div>}
      </div>
    </ContentSection>
    <ContentSection id="tds-forecast-demand" title="需求预测" description="选择产业人才需求预测对象和对比对象，以左右分屏展示人才需求、培养人才数量与需求总量。" aside={<span className="tds-section-icon"><TrendingUp size={18}/></span>}>
      <div className="tds-demand-toolbar">
        <label><span>当前预测对象</span><select value={demandTargetId} onChange={(event) => chooseDemandTarget(event.target.value)}>{demandForecastObjects.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
        <label><span>对比对象</span><select value={demandComparison.id} onChange={(event) => setDemandComparisonId(event.target.value)}>{demandForecastObjects.filter((item) => item.id !== demandTarget.id).map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
        <label><span>时间范围</span><select value={demandRange} onChange={(event) => setDemandRange(event.target.value)}>{Object.keys(forecastRangeStarts).map((item) => <option key={item}>{item}</option>)}</select></label>
        <div><span>对比口径</span><strong>产业人才供需</strong></div>
      </div>
      <div className="tds-demand-definitions" aria-label="需求预测指标口径"><strong>指标口径</strong><span><b>人才需求</b> 当年新增岗位需求</span><span><b>培养人才数量</b> 当年预计培养供给</span><span><b>需求总量</b> 当年人才岗位需求总规模</span></div>
      <div className="tds-demand-split"><DemandComparisonPanel entity={demandTarget} periods={demandPeriods} rangeStart={demandRangeStart} roleLabel="当前预测对象" scaleMax={demandSharedMax}/><DemandComparisonPanel entity={demandComparison} periods={demandPeriods} rangeStart={demandRangeStart} roleLabel="对比预测对象" scaleMax={demandSharedMax}/></div>
      <div className="tds-demand-comparison" aria-live="polite"><header><strong>{demandPeriods.at(-1)} 年预测结果对比</strong><span>{demandTarget.name} vs {demandComparison.name}</span></header><div className="head"><span>指标</span><span>{demandTarget.name}</span><span>{demandComparison.name}</span><span>差异</span></div>{demandComparisonRows.map((row) => { const difference = row.targetValue - row.comparisonValue; return <div className="row" key={row.label}><strong>{row.label}</strong><span>{row.targetValue} 人</span><span>{row.comparisonValue} 人</span><em className={difference >= 0 ? "positive" : "negative"}>{difference >= 0 ? "+" : ""}{difference} 人</em></div>; })}</div>
    </ContentSection>
    <ContentSection id="tds-forecast-funding" title="经费与收益预测" description="选择具体预测项目，在划定时间范围内查看科研经费、研究经费、科创收益和经费增长预测，并比较不同目标。" aside={<span className="tds-section-icon"><CircleDollarSign size={18}/></span>}><div className="tds-funding-toolbar"><label><span>预测项目</span><select value={fundingProjectId} onChange={(event) => setFundingProjectId(event.target.value)}>{fundingProjects.map((project) => <option value={project.id} key={project.id}>{project.name}</option>)}</select></label><label><span>当前目标</span><select value={target} onChange={(event) => chooseTarget(event.target.value)}>{subjectEntities.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label><span>对比目标</span><select value={comparison} onChange={(event) => setComparison(event.target.value)}>{subjectEntities.filter((item) => item.name !== target).map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label><span>时间范围</span><select value={range} onChange={(event) => setRange(event.target.value)}>{Object.keys(forecastRangeStarts).map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="tds-funding-layout"><div className="tds-chart-panel"><header><div><strong>经费与收益时间序列</strong><small>金额单位：万元</small></div><span className="tds-funding-legend"><i className="research"/>科研经费<i className="study"/>研究经费<i className="revenue"/>科创收益<i className="growth"/>经费增长</span></header><FundingRevenueChart series={{ researchFunding: targetFunding.researchFunding.slice(rangeStart), studyFunding: targetFunding.studyFunding.slice(rangeStart), revenue: targetFunding.revenue.slice(rangeStart), growth: targetFunding.growth.slice(rangeStart) }} periods={periods} name={targetEntity.name}/></div><aside className="tds-funding-report"><span>收益预测报告</span><h4>{fundingProject.name}</h4><small>{fundingProject.focus}</small><p>{fundingProject.report}</p><dl><div><dt>预测对象</dt><dd>{targetEntity.name}</dd></div><div><dt>2030 科创收益</dt><dd>{targetFunding.revenue.at(-1)} 万元</dd></div><div><dt>经费增长预测</dt><dd>{targetFunding.growth.at(-1)}%</dd></div></dl></aside></div><div className="tds-funding-comparison"><header><strong>目标预测结果对比</strong><span>{targetEntity.name} vs {comparisonEntity.name}</span></header><div className="head"><span>指标</span><span>{targetEntity.name}</span><span>{comparisonEntity.name}</span><span>差异</span></div>{fundingComparisonRows.map((row) => <div className="row" key={row.label}><strong>{row.label}</strong><span>{row.targetValue} {row.unit}</span><span>{row.comparisonValue} {row.unit}</span><em className={row.targetValue >= row.comparisonValue ? "positive" : "negative"}>{row.targetValue >= row.comparisonValue ? "+" : ""}{Number((row.targetValue - row.comparisonValue).toFixed(1))} {row.unit === "%" ? "个百分点" : row.unit}</em></div>)}</div></ContentSection>
    <ContentSection id="tds-forecast-outcome" title="成果与贡献预测" description="在权限范围内查询人才、团队、机构及项目的未来科研成果、机构成果产出、机构贡献与预测准确率，为投资和经费分配提供参考。" aside={<span className="tds-section-icon"><BarChart3 size={18}/></span>}>
      <div className="tds-outcome-toolbar">
        <label><span>对象类型</span><select value={outcomeType} onChange={(event) => setOutcomeType(event.target.value as OutcomeObjectType)}>{(["全部对象", "研究人才", "研究团队", "研究机构", "科研项目"] as OutcomeObjectType[]).map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="tds-outcome-search"><span>搜索查询</span><div><Search size={14} aria-hidden="true"/><input type="search" value={outcomeQuery} onChange={(event) => setOutcomeQuery(event.target.value)} placeholder="输入人才、团队、机构或项目"/></div></label>
        <label><span>预测对象</span><select value={selectedOutcome?.id ?? ""} disabled={!selectedOutcome} onChange={(event) => setSelectedOutcomeId(event.target.value)}>{filteredOutcomeObjects.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
        <div className="tds-permission-scope"><span>权限范围</span><strong>机构授权数据</strong></div>
      </div>
      {selectedOutcome ? <div className="tds-outcome-layout"><div className="tds-chart-panel"><header><div><strong>成果产出与贡献趋势</strong><small>成果单位：项 · 贡献单位：指数</small></div><span className="tds-outcome-legend"><i className="research"/>科研成果<i className="institution"/>机构成果产出<i className="contribution"/>机构贡献</span></header><OutcomeContributionChart entity={selectedOutcome} periods={periods} rangeStart={rangeStart}/></div><aside className="tds-outcome-report"><span>成果预测报告</span><h4>{selectedOutcome.name}</h4><p>{selectedOutcome.report}</p><dl><div><dt>对象类型</dt><dd>{selectedOutcome.type}</dd></div><div><dt>所属机构</dt><dd>{selectedOutcome.institution}</dd></div><div><dt>科研成果</dt><dd>{selectedOutcome.researchOutcomes.at(-1)} 项</dd></div><div><dt>机构成果产出</dt><dd>{selectedOutcome.institutionOutcomes.at(-1)} 项</dd></div><div><dt>机构贡献</dt><dd>{selectedOutcome.contribution.at(-1)}</dd></div><div><dt>预测准确率</dt><dd>{selectedOutcome.accuracy}%</dd></div></dl></aside></div> : <p className="tds-outcome-empty">未找到符合当前权限和查询条件的预测对象。</p>}
    </ContentSection>
    <ContentSection id="tds-forecast-progress-risk" title="进度与风险预测" description="展示个人、团队及机构研究进度，比较正常进度与实际进度，并通过蓝至红的热力梯度呈现研究风险。" aside={<span className="tds-section-icon"><AlertTriangle size={18}/></span>}>
      <div className="tds-progress-toolbar"><div><span>对象类型</span>{(["个人", "团队", "机构"] as ProgressRiskObject["type"][]).map((item) => <button type="button" className={progressType === item ? "is-active" : ""} aria-pressed={progressType === item} onClick={() => chooseProgressType(item)} key={item}>{item}</button>)}</div><label><span>预测对象</span><select value={progressTarget?.id ?? ""} onChange={(event) => setProgressTargetId(event.target.value)}>{progressObjects.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><div className={`tds-progress-risk-level is-${progressRiskLevel}`}><span>当前风险</span><strong>{progressRiskLevel}风险</strong></div></div>
      {progressTarget && <div className="tds-progress-layout"><div><div className="tds-chart-panel"><header><div><strong>正常研究进度与实际研究进度</strong><small>单位：完成度 %</small></div><span><i className="primary"/>正常进度<i className="secondary"/>实际进度</span></header><ForecastChart values={progressTarget.plan.slice(rangeStart)} compare={progressTarget.actual.slice(rangeStart)} periods={periods} unit="%" subject={progressTarget.name}/><dl className="tds-progress-metrics"><div><dt>正常进度</dt><dd>{progressTarget.plan.at(-1)}%</dd></div><div><dt>实际进度</dt><dd>{progressTarget.actual.at(-1)}%</dd></div><div><dt>进度差异</dt><dd>{progressGap} 个百分点</dd></div></dl></div><ProgressRiskHeatmap entity={progressTarget}/></div><aside className="tds-risk-report"><span>风险评估报告</span><h4>{progressTarget.name}</h4><p>{progressTarget.summary}</p><dl><div><dt>对象类型</dt><dd>{progressTarget.type}</dd></div><div><dt>最高风险值</dt><dd>{highestRiskScore}</dd></div><div><dt>综合风险等级</dt><dd>{progressRiskLevel}风险</dd></div><div><dt>进度差异</dt><dd>{progressGap} 个百分点</dd></div></dl><div><strong>处置建议</strong><p>{progressTarget.recommendation}</p></div></aside></div>}
    </ContentSection>
    <ContentSection id="tds-forecast-structure" title="结构与规模预测" description="以动态关系网络展示未来团队人员结构或机构部门结构，并用面积图比较重点团队与机构的发展规模。" aside={<span className="tds-section-icon"><GitBranch size={18}/></span>}><div className="tds-structure-toolbar"><div><span>结构类型</span>{(["团队人员结构", "机构部门结构"] as StructureMode[]).map((item) => <button type="button" className={structureMode === item ? "is-active" : ""} aria-pressed={structureMode === item} onClick={() => chooseStructureMode(item)} key={item}>{item}</button>)}</div><label><span>预测主体</span><select value={structureTarget} onChange={(event) => chooseStructureTarget(event.target.value)}>{structureEntities.map((entity) => <option key={entity.name}>{entity.name}</option>)}</select></label><label><span>对比主体</span><select value={structureComparison} onChange={(event) => setStructureComparison(event.target.value)}>{structureEntities.filter((entity) => entity.name !== structureTarget).map((entity) => <option key={entity.name}>{entity.name}</option>)}</select></label></div><div className="tds-structure-scale-layout"><article className="tds-relationship-panel"><header><strong>{structureMode}关系网络</strong><span>节点可选择</span></header><StructureNetwork mode={structureMode} targetName={structureTargetEntity.name} nodes={currentStructureNodes} selectedId={selectedStructureNode.id} onSelect={setSelectedStructureNodeId}/><div className="tds-structure-node-detail" aria-live="polite"><strong>{selectedStructureNode.label}</strong><span>{selectedStructureNode.value}</span><p>{selectedStructureNode.detail}</p></div></article><article className="tds-scale-panel"><header><div><strong>发展规模对比</strong><small>单位：指数</small></div><span><i className="primary"/>{structureTargetEntity.name}<i className="secondary"/>{structureComparisonEntity.name}</span></header><ScaleAreaChart values={structureTargetEntity.organization.slice(rangeStart)} compare={structureComparisonEntity.organization.slice(rangeStart)} periods={periods} targetName={structureTargetEntity.name} comparisonName={structureComparisonEntity.name}/><dl><div><dt>{structureTargetEntity.name}</dt><dd>{structureTargetEntity.organization.at(-1)}</dd></div><div><dt>{structureComparisonEntity.name}</dt><dd>{structureComparisonEntity.organization.at(-1)}</dd></div><div><dt>规模差异</dt><dd>{(structureTargetEntity.organization.at(-1) ?? 0) - (structureComparisonEntity.organization.at(-1) ?? 0)}</dd></div></dl></article></div></ContentSection>
  </>;
}

type AllocationEntity = { id: string; name: string; institution: string; direction: string; allocation: number; priority: "重点倾斜" | "优先支持" | "稳定支持"; reason: string };
type DetailedAllocationCategory = { id: string; label: string; total: number; completion: number; recommendation: string; analysis: string; model: string; entities: readonly AllocationEntity[] };
type DetailedAllocationScope = { id: string; title: string; description: string; entityLabel: "人才" | "团队" | "领域"; entityColumnLabel?: string; institutionLabel?: string; directionLabel?: string; groupSummaryLabel?: string; prioritySummaryLabel?: string; categories: readonly DetailedAllocationCategory[] };

const detailedAllocationScopes: readonly DetailedAllocationScope[] = [
  {
    id: "tds-allocation-people", title: "科技人员资源分配", description: "查看基础研究、技术攻关和海外创新人才的分配建议、重点对象与目标完成程度。", entityLabel: "人才",
    categories: [
      { id: "basic", label: "基础研究人才", total: 88, completion: 84, recommendation: "优先支持长期原创研究、关键科学问题和公共科研能力建设，兼顾方向连续性与跨学科协同。", analysis: "当前方案向量子科学、先进材料和复杂系统方向适度倾斜，同时保留数学交叉研究的稳定支持。", model: "综合研究潜力、持续产出、平台依托和资源边际效益进行分配。", entities: [
        { id: "p-basic-1", name: "林澈研究员", institution: "量子科学研究中心", direction: "量子精密测量", allocation: 28, priority: "重点倾斜", reason: "连续研究积累与关键实验能力匹配度较高。" },
        { id: "p-basic-2", name: "周雨澄研究员", institution: "先进材料研究院", direction: "低维材料", allocation: 24, priority: "重点倾斜", reason: "基础成果与公共实验平台形成稳定协同。" },
        { id: "p-basic-3", name: "陈嘉禾研究员", institution: "理论科学中心", direction: "复杂系统", allocation: 19, priority: "优先支持", reason: "研究方向具备跨学科扩展潜力。" },
        { id: "p-basic-4", name: "许知远研究员", institution: "数学交叉研究中心", direction: "科学计算", allocation: 17, priority: "稳定支持", reason: "为多个研究方向提供共性方法支撑。" },
      ] },
      { id: "technical", label: "技术攻关人才", total: 100, completion: 78, recommendation: "围绕关键技术节点、工程验证和任务交付配置资源，优先保障能够连接研发与应用的核心人才。", analysis: "具身智能、基础模型和多模态方向获得较高配置，工程验证人才保持专项支持。", model: "结合任务优先级、技术成熟度、团队依赖和里程碑完成度进行运筹求解。", entities: [
        { id: "p-tech-1", name: "高屹研究员", institution: "智能制造实验室", direction: "具身智能", allocation: 32, priority: "重点倾斜", reason: "承担关键决策控制任务并连接样机验证。" },
        { id: "p-tech-2", name: "沈璟研究员", institution: "先进计算中心", direction: "基础模型", allocation: 27, priority: "重点倾斜", reason: "训练推理能力是多项任务的共性底座。" },
        { id: "p-tech-3", name: "罗予安研究员", institution: "智能系统研究团队", direction: "多模态智能", allocation: 23, priority: "优先支持", reason: "具备跨模态融合与行业验证能力。" },
        { id: "p-tech-4", name: "韩启辰研究员", institution: "工程验证中心", direction: "工业智能体", allocation: 18, priority: "稳定支持", reason: "支撑产品化测试与应用场景接入。" },
      ] },
      { id: "overseas", label: "海外创新人才", total: 84, completion: 81, recommendation: "重点支持能够补充关键技术能力、带动国际协作并形成稳定机构依托的海外创新人才。", analysis: "资源配置兼顾前沿方向、所属机构承载能力和国际合作网络，重点对象获得更高资源倾斜。", model: "综合人才能力、机构匹配、国际协作强度和回国后任务承接条件进行分配。", entities: [
        { id: "p-overseas-1", name: "顾远研究员", institution: "量子信息联合中心", direction: "量子通信", allocation: 26, priority: "重点倾斜", reason: "补充关键器件与系统验证能力。" },
        { id: "p-overseas-2", name: "唐若宁研究员", institution: "生物制造研究院", direction: "合成生物", allocation: 22, priority: "重点倾斜", reason: "连接工程化研究与国际合作资源。" },
        { id: "p-overseas-3", name: "苏维研究员", institution: "安全智能中心", direction: "可信人工智能", allocation: 20, priority: "优先支持", reason: "加强模型安全与评测能力。" },
        { id: "p-overseas-4", name: "邵清研究员", institution: "空天技术中心", direction: "卫星智能", allocation: 16, priority: "稳定支持", reason: "支撑空天数据分析与场景验证。" },
      ] },
    ],
  },
  {
    id: "tds-allocation-team", title: "团队机构资源分配", description: "查看科研团队、技术创业团队和海外合作团队的资源分配数量、所属机构、重点倾斜与目标完成程度。", entityLabel: "团队",
    categories: [
      { id: "research", label: "科研团队", total: 108, completion: 86, recommendation: "面向科研创新团队，优先保障承担基础能力建设、关键技术攻关和跨机构协同任务的团队。", analysis: "基础模型与多模态团队获得较高资源配置，机器人系统和可信智能团队形成差异化支撑。", model: "依据研究方向重要度、成果连续性、协作网络和资源使用效率进行综合分配。", entities: [
        { id: "t-research-1", name: "基础模型研究团队", institution: "未来智能研究院", direction: "基础模型", allocation: 36, priority: "重点倾斜", reason: "承担共性训练推理能力建设。" },
        { id: "t-research-2", name: "多模态计算团队", institution: "先进计算中心", direction: "多模态智能", allocation: 30, priority: "重点倾斜", reason: "连接视觉、语言和行业数据研究。" },
        { id: "t-research-3", name: "机器人系统团队", institution: "智能制造实验室", direction: "具身智能", allocation: 24, priority: "优先支持", reason: "承担感知控制与样机验证任务。" },
        { id: "t-research-4", name: "可信智能团队", institution: "安全智能中心", direction: "安全评测", allocation: 18, priority: "稳定支持", reason: "提供模型安全与治理支撑。" },
      ] },
      { id: "startup", label: "技术创业团队", total: 98, completion: 82, recommendation: "通过运筹模型求解任务价值、产品成熟度、市场验证和资源约束，向具备工程落地能力的团队倾斜。", analysis: "工业智能体与智能检测团队位于资源优先区，工具链和数据服务团队获得配套支持。", model: "以产品成熟度、场景需求、交付能力和投入产出预期为约束进行运筹模型求解。", entities: [
        { id: "t-startup-1", name: "工业智能体创业团队", institution: "湾区科创孵化中心", direction: "行业智能体", allocation: 31, priority: "重点倾斜", reason: "具备明确应用场景和产品验证计划。" },
        { id: "t-startup-2", name: "智能检测创业团队", institution: "先进制造加速器", direction: "工业视觉", allocation: 27, priority: "重点倾斜", reason: "技术成熟度与产业需求匹配度较高。" },
        { id: "t-startup-3", name: "科研工具链团队", institution: "科技成果转化中心", direction: "研发工具", allocation: 22, priority: "优先支持", reason: "可为多个研发团队提供共性能力。" },
        { id: "t-startup-4", name: "数据智能服务团队", institution: "数字产业创新中心", direction: "数据服务", allocation: 18, priority: "稳定支持", reason: "支撑数据治理与模型运营环节。" },
      ] },
      { id: "international", label: "海外合作团队", total: 94, completion: 79, recommendation: "通过运筹模型统筹合作基础、技术互补、机构承载和任务周期，优先支持能够形成持续联合研究的团队。", analysis: "深港与中欧合作团队获得较高配置，国际联合团队的所属机构和协作任务均纳入分配依据。", model: "以技术互补度、国际合作强度、任务可执行性和成果共享机制为约束进行运筹模型求解。", entities: [
        { id: "t-overseas-1", name: "深港多模态联合团队", institution: "粤港澳联合创新中心", direction: "多模态智能", allocation: 30, priority: "重点倾斜", reason: "合作基础稳定并具备联合数据资源。" },
        { id: "t-overseas-2", name: "中欧智能制造合作团队", institution: "国际智能制造中心", direction: "智能制造", allocation: 26, priority: "重点倾斜", reason: "技术互补与工程验证条件较完整。" },
        { id: "t-overseas-3", name: "国际量子网络团队", institution: "量子信息联合中心", direction: "量子网络", allocation: 21, priority: "优先支持", reason: "承担跨区域系统验证和标准协作。" },
        { id: "t-overseas-4", name: "全球生物计算团队", institution: "生物制造研究院", direction: "生物计算", allocation: 17, priority: "稳定支持", reason: "支撑交叉研究与国际人才协作。" },
      ] },
    ],
  },
  {
    id: "tds-allocation-macro", title: "宏观领域资源分配", description: "查看前沿学科、高新产业和国际合作领域的分配总量、分项数量、重点倾斜与目标完成程度。", entityLabel: "领域", entityColumnLabel: "领域 / 产业", institutionLabel: "分配类型", directionLabel: "重点方向", groupSummaryLabel: "分配类型", prioritySummaryLabel: "重点倾斜领域",
    categories: [
      { id: "frontier", label: "前沿学科领域", total: 126, completion: 83, recommendation: "面向前沿学科和交叉方向配置资源，优先保障具有持续研究基础、关键平台依托和跨学科带动能力的领域。", analysis: "量子信息与脑科学获得重点倾斜，深地深海和可见光通信保持差异化投入，形成基础研究与交叉前沿协同布局。", model: "综合领域前沿度、研究基础、平台承载、交叉带动和长期资源需求进行分配。", entities: [
        { id: "m-frontier-1", name: "量子信息", institution: "基础研究", direction: "量子计算与通信", allocation: 36, priority: "重点倾斜", reason: "关键器件、系统验证和科研平台需求集中。" },
        { id: "m-frontier-2", name: "脑科学与类脑智能", institution: "交叉前沿", direction: "脑机接口与类脑计算", allocation: 32, priority: "重点倾斜", reason: "跨学科协作强度和平台依赖度较高。" },
        { id: "m-frontier-3", name: "深地深海", institution: "战略前沿", direction: "探测设施与数据协同", allocation: 30, priority: "优先支持", reason: "大型设施和长期观测任务需要连续投入。" },
        { id: "m-frontier-4", name: "可见光通信与光计算", institution: "交叉前沿", direction: "光通信与光计算芯片", allocation: 28, priority: "稳定支持", reason: "技术路线清晰并具备跨领域应用潜力。" },
      ] },
      { id: "high-tech", label: "高新产业领域", total: 148, completion: 87, recommendation: "面向国家高新技术产业领域，根据技术攻关、中试验证、公共平台和成果转化需求进行分类配置。", analysis: "新一代信息技术和高端装备制造位于资源优先区，新能源与生物医药按照产业化节点配置专项资源。", model: "结合产业关键性、技术成熟度、公共平台需求、转化周期和投入产出预期进行运筹求解。", entities: [
        { id: "m-high-1", name: "新一代信息技术", institution: "技术攻关", direction: "人工智能与先进计算", allocation: 44, priority: "重点倾斜", reason: "承担数字产业共性技术和关键能力建设。" },
        { id: "m-high-2", name: "高端装备制造", institution: "中试验证", direction: "智能制造与机器人", allocation: 39, priority: "重点倾斜", reason: "工程验证和产业链协同需求较强。" },
        { id: "m-high-3", name: "新能源", institution: "成果转化", direction: "储能与能源系统", allocation: 35, priority: "优先支持", reason: "示范应用和规模化验证处于关键阶段。" },
        { id: "m-high-4", name: "生物医药", institution: "公共平台", direction: "生物制造与技术服务", allocation: 30, priority: "稳定支持", reason: "依托共享平台提升研发和验证效率。" },
      ] },
      { id: "international", label: "国际合作领域", total: 112, completion: 80, recommendation: "通过运筹模型统筹合作基础、前沿方向、机构承载和任务周期，优先支持具备持续联合研究能力的国际合作领域。", analysis: "粤港澳人工智能与中欧智能制造获得较高配置，国际量子网络和全球生物计算形成长期协作支点。", model: "以合作强度、技术互补、任务可执行性、成果共享机制和国际资源撬动能力为约束进行运筹模型求解。", entities: [
        { id: "m-international-1", name: "粤港澳人工智能合作", institution: "联合研究", direction: "多模态与行业智能体", allocation: 34, priority: "重点倾斜", reason: "合作网络稳定并具备数据与场景资源。" },
        { id: "m-international-2", name: "中欧智能制造合作", institution: "联合验证", direction: "智能制造与工业软件", allocation: 30, priority: "重点倾斜", reason: "技术互补和工程验证条件较完整。" },
        { id: "m-international-3", name: "国际量子网络合作", institution: "标准协作", direction: "量子通信与网络验证", allocation: 26, priority: "优先支持", reason: "承担跨区域验证和标准研究任务。" },
        { id: "m-international-4", name: "全球生物计算合作", institution: "人才与项目", direction: "生物计算与数据服务", allocation: 22, priority: "稳定支持", reason: "连接国际人才、算法和生物数据资源。" },
      ] },
    ],
  },
];

function DetailedAllocationSection({ scope }: { scope: DetailedAllocationScope }) {
  const [categoryId, setCategoryId] = useState(scope.categories[0].id);
  const category = scope.categories.find((item) => item.id === categoryId) ?? scope.categories[0];
  const [selectedEntityId, setSelectedEntityId] = useState(category.entities[0].id);
  const selectedEntity = category.entities.find((entity) => entity.id === selectedEntityId) ?? category.entities[0];
  const priorityCount = category.entities.filter((entity) => entity.priority === "重点倾斜").length;
  const institutionCount = new Set(category.entities.map((entity) => entity.institution)).size;
  const maxAllocation = Math.max(...category.entities.map((entity) => entity.allocation));
  const Icon = scope.entityLabel === "人才" ? UsersRound : scope.entityLabel === "团队" ? Workflow : GitBranch;
  const entityColumnLabel = scope.entityColumnLabel ?? scope.entityLabel;
  const institutionLabel = scope.institutionLabel ?? "所属机构";
  const directionLabel = scope.directionLabel ?? "研究方向";
  const groupSummaryLabel = scope.groupSummaryLabel ?? "所属机构";
  const prioritySummaryLabel = scope.prioritySummaryLabel ?? `重点倾斜${scope.entityLabel}`;
  const chooseCategory = (nextId: string) => {
    const nextCategory = scope.categories.find((item) => item.id === nextId) ?? scope.categories[0];
    setCategoryId(nextCategory.id);
    setSelectedEntityId(nextCategory.entities[0].id);
  };

  return <ContentSection id={scope.id} title={scope.title} description={scope.description} aside={<span className="tds-section-icon"><Icon size={18}/></span>}>
    <div className="tds-category-tabs" role="group" aria-label={`${scope.title}分类`}>{scope.categories.map((item) => <button type="button" className={category.id === item.id ? "is-active" : ""} aria-pressed={category.id === item.id} onClick={() => chooseCategory(item.id)} key={item.id}>{item.label}</button>)}</div>
    <div className="tds-allocation-summary-strip"><div><span>资源分配数量</span><strong>{category.total} 点</strong></div><div><span>{prioritySummaryLabel}</span><strong>{priorityCount} 个</strong></div><div><span>{groupSummaryLabel}</span><strong>{institutionCount} {scope.entityLabel === "领域" ? "类" : "家"}</strong></div><div><span>目标完成程度</span><strong>{category.completion}%</strong></div></div>
    <div className="tds-allocation-recommendation"><div><span>资源分配建议</span><p>{category.recommendation}</p></div><small>{category.model}</small></div>
    <div className="tds-detailed-allocation-layout">
      <div className="tds-allocation-table"><header><span>{entityColumnLabel}</span><span>{institutionLabel}</span><span>{directionLabel}</span><span>分配数量</span><span>资源倾斜</span></header><div>{category.entities.map((entity) => <button type="button" className={selectedEntity.id === entity.id ? "is-active" : ""} aria-pressed={selectedEntity.id === entity.id} onClick={() => setSelectedEntityId(entity.id)} key={entity.id}><strong>{entity.name}</strong><span>{entity.institution}</span><span>{entity.direction}</span><span className="allocation"><i><b style={{ width: `${entity.allocation / maxAllocation * 100}%` }}/></i><em>{entity.allocation} 点</em></span><span className={entity.priority === "重点倾斜" ? "priority" : ""}>{entity.priority}</span></button>)}</div></div>
      <aside className="tds-detailed-allocation-analysis"><span>当前{scope.entityLabel}</span><h4>{selectedEntity.name}</h4><dl><div><dt>{institutionLabel}</dt><dd>{selectedEntity.institution}</dd></div><div><dt>{directionLabel}</dt><dd>{selectedEntity.direction}</dd></div><div><dt>分配数量</dt><dd>{selectedEntity.allocation} 点</dd></div><div><dt>资源倾斜</dt><dd>{selectedEntity.priority}</dd></div></dl><div className="completion"><span>目标完成程度</span><strong>{category.completion}%</strong><i><b style={{ width: `${category.completion}%` }}/></i></div><div className="reason"><span>倾斜依据</span><p>{selectedEntity.reason}</p></div><div className="analysis"><span>资源分配方案智能解析</span><p>{category.analysis}</p></div></aside>
    </div>
  </ContentSection>;
}

function AllocationContent() {
  return <>{detailedAllocationScopes.map((scope) => <DetailedAllocationSection scope={scope} key={scope.id}/>)}</>;
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
        <nav className="tds-module-nav" aria-label="科技决策支持功能目录"><header><strong>功能目录</strong><small>4 项决策支持能力</small></header>{moduleDefinitions.map((module) => { const Icon = module.icon; return <button type="button" className={activeModule === module.id ? "is-active" : ""} aria-current={activeModule === module.id ? "page" : undefined} onClick={() => openModule(module.id)} key={module.id}><Icon size={18} /><span><strong>{module.label}</strong><small>{module.sections.length} 个内容区块</small></span></button>; })}<div className="tds-nav-note"><Activity size={14} /><p>支持按对象、时间范围与预测类别查看分析结果。</p></div></nav>
        <section className="tds-main-column" aria-labelledby="tds-module-title"><header className="tds-module-heading"><span><ActiveIcon size={23} /></span><div><h2 id="tds-module-title">{activeDefinition.label}</h2><p>{activeDefinition.description}</p></div>{activeModule === "forecast" ? <DemoBadge>综合预测报告</DemoBadge> : <DemoBadge />}</header><div className="tds-content-flow" key={activeModule}><ModuleContent moduleId={activeModule} /></div></section>
      </div>
    </main>
    <PageSectionLocator items={activeDefinition.sections} topId="tds-top" label="内容定位" />
    <footer className="tds-footer"><div><img src="./assets/gkx-logo.png" alt="" /><span><strong>科技决策支持</strong><small>深圳国际科技信息中心</small></span></div><p>预测结果需结合数据权限、业务规则与专业研判用于辅助决策。</p></footer>
  </div>;
}
