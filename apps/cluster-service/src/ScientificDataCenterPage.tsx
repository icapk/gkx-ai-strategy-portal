import {
  Activity,
  Atom,
  BookOpen,
  Brain,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Database,
  Dna,
  Globe2,
  GraduationCap,
  Layers3,
  Microscope,
  Network,
  PackageSearch,
  RotateCcw,
  Search,
  Sparkles,
  TableProperties,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import PortalHeader from "./PortalHeader";
import "./scientific-data-center.css";

type TopicId =
  | "navigation"
  | "ophthalmology"
  | "brain-atlas"
  | "engineered-cell"
  | "energy-material"
  | "low-dimensional"
  | "carbon-footprint";

type SectionDefinition = { id: string; label: string };
type TopicDefinition = {
  id: TopicId;
  label: string;
  description: string;
  icon: LucideIcon;
  sections: SectionDefinition[];
  contentTypes: string[];
};

const topicDefinitions: TopicDefinition[] = [
  {
    id: "navigation",
    label: "科学导航",
    description: "科学数据中心全部专题的统一入口与内容索引。",
    icon: Network,
    sections: [
      { id: "science-index", label: "专题索引" },
      { id: "science-notes", label: "数据说明" },
    ],
    contentTypes: ["统一入口", "专题索引"],
  },
  {
    id: "ophthalmology",
    label: "眼科医学专题",
    description: "通过医学知识图谱和课程目录组织眼科专业知识。",
    icon: Microscope,
    sections: [
      { id: "oph-graph", label: "专科医学知识图谱" },
      { id: "oph-courses", label: "优秀课程推荐" },
    ],
    contentTypes: ["知识图谱", "课程资源"],
  },
  {
    id: "brain-atlas",
    label: "脑图谱专题",
    description: "分层呈现脑图谱点、线、面、体及典型数据案例。",
    icon: Brain,
    sections: [
      { id: "brain-visual", label: "点线面体图谱" },
      { id: "brain-cases", label: "图谱数据案例" },
    ],
    contentTypes: ["四态图谱", "多物种案例"],
  },
  {
    id: "engineered-cell",
    label: "工程细胞专题",
    description: "从领域全景、细分方向到论文和关键技术点形成知识入口。",
    icon: Dna,
    sections: [
      { id: "cell-overview", label: "领域全景概览" },
      { id: "cell-columns", label: "细分研究方向" },
      { id: "cell-resources", label: "论文与技术点" },
    ],
    contentTypes: ["领域全景", "四类专栏", "论文与技术"],
  },
  {
    id: "energy-material",
    label: "储能材料专题",
    description: "按材料信息、储能特性和优化方向检索专题数据。",
    icon: Atom,
    sections: [
      { id: "energy-materials", label: "储能材料信息" },
      { id: "energy-papers", label: "优秀论文推荐" },
    ],
    contentTypes: ["材料表格", "论文目录"],
  },
  {
    id: "low-dimensional",
    label: "低维材料专题",
    description: "汇集五类材料数据库并支持筛选与自动分页。",
    icon: Layers3,
    sections: [
      { id: "lowdim-databases", label: "数据库目录" },
      { id: "lowdim-results", label: "材料数据检索" },
    ],
    contentTypes: ["五类数据库", "材料筛选"],
  },
  {
    id: "carbon-footprint",
    label: "碳足迹专题",
    description: "对比代表性经济体和中国省级地区样本的碳排放结构与历年趋势。",
    icon: Globe2,
    sections: [
      { id: "carbon-map", label: "碳足迹地图" },
      { id: "carbon-trend", label: "历年变化趋势" },
    ],
    contentTypes: ["全球与中国", "六类排放维度"],
  },
];

const topicById = new Map<TopicId, TopicDefinition>(topicDefinitions.map((topic) => [topic.id, topic]));

function parseTopicFromUrl(): TopicId {
  const value = new URL(window.location.href).searchParams.get("module") as TopicId | null;
  return value && topicById.has(value) ? value : "navigation";
}

function preferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function DemoBadge({ children = "演示数据" }: { children?: ReactNode }) {
  return <span className="sdc-demo-badge">{children}</span>;
}

function ContentSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="sdc-content-section" aria-labelledby={`${id}-title`}>
      <header className="sdc-content-section-header">
        <div>
          <h3 id={`${id}-title`}>{title}</h3>
          <p>{description}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function EmptyResource({ label = "暂无链接" }: { label?: string }) {
  return <span className="sdc-resource-pending" aria-label={`${label}，当前不可访问`}>{label}</span>;
}

function NavigationContent({ onOpen }: { onOpen: (topicId: TopicId) => void }) {
  return (
    <>
      <ContentSection
        id="science-index"
        title="专题索引"
        description="按专题名称、主要内容与数据形态快速进入对应科学数据服务。"
      >
        <div className="sdc-index-list">
          {topicDefinitions.slice(1).map((topic) => {
            const Icon = topic.icon;
            return (
              <article className="sdc-index-row" key={topic.id}>
                <span className="sdc-index-icon"><Icon size={19} aria-hidden="true" /></span>
                <div className="sdc-index-copy">
                  <h4>{topic.label}</h4>
                  <p>{topic.description}</p>
                </div>
                <div className="sdc-index-types" aria-label={`${topic.label}内容类型`}>
                  {topic.contentTypes.map((item) => <span key={item}>{item}</span>)}
                </div>
                <button type="button" onClick={() => onOpen(topic.id)}>进入专题</button>
              </article>
            );
          })}
        </div>
      </ContentSection>

      <ContentSection
        id="science-notes"
        title="数据说明"
        description="当前页面用于功能结构与交互演示。"
      >
        <div className="sdc-note-strip">
          <Database size={20} aria-hidden="true" />
          <div>
            <strong>演示边界清晰</strong>
            <p>图谱节点、材料记录、排放指标和论文条目均为界面演示数据；没有正式地址的课程、平台与论文入口保持不可点击。</p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

type OphNodeId = "path" | "symptom" | "treatment" | "check" | "department" | "population" | "region";
type OphNode = {
  id: OphNodeId;
  label: string;
  detail: string;
  x: number;
  y: number;
};

const ophthalmologyNodes: OphNode[] = [
  { id: "path", label: "临床路径", detail: "从初诊、鉴别诊断到随访管理的标准化诊疗步骤。", x: 280, y: 44 },
  { id: "symptom", label: "临床表现", detail: "记录视力变化、视野缺损等可观察症状与体征。", x: 445, y: 87 },
  { id: "treatment", label: "治疗方式", detail: "按疾病阶段组织药物、手术及康复管理方式。", x: 494, y: 202 },
  { id: "check", label: "相关检查", detail: "关联支持诊断、分型与疗效评估的检查项目。", x: 418, y: 318 },
  { id: "department", label: "科室", detail: "标明诊疗过程涉及的专科与协同科室。", x: 280, y: 350 },
  { id: "population", label: "易感人群", detail: "按年龄、基础疾病和生活方式梳理风险群体。", x: 128, y: 318 },
  { id: "region", label: "所在区域", detail: "用于关联疾病研究、医疗资源和样本来源区域。", x: 68, y: 202 },
];

type OphDiseaseProfile = { id: string; label: string; summary: string; relations: Record<OphNodeId, string> };
const ophthalmologyDiseases: OphDiseaseProfile[] = [
  { id: "retinal", label: "视网膜疾病", summary: "覆盖糖尿病视网膜病变、黄斑变性与视网膜血管性疾病的筛查、诊断和长期管理。", relations: { path: "眼底筛查、分级诊断、专科转诊、治疗评估与长期随访", symptom: "视力下降、视物变形、中心暗点、飞蚊感", treatment: "抗VEGF治疗、激光治疗、玻璃体手术与康复管理", check: "眼底照相、OCT、OCTA、荧光素眼底血管造影", department: "眼底病专科、内分泌科、影像诊断科", population: "糖尿病患者、老年人群、高度近视人群", region: "华南眼病协作网络、粤港澳大湾区、深圳市" } },
  { id: "glaucoma", label: "青光眼", summary: "围绕眼压、视神经损伤和视野变化组织早期发现、风险分层与终身随访知识。", relations: { path: "风险筛查、眼压复核、视神经评估、分期治疗与视野随访", symptom: "视野缺损、眼胀头痛、虹视、晚期中心视力下降", treatment: "降眼压药物、激光小梁成形、滤过手术与引流装置", check: "眼压、房角镜、视野、视神经OCT与角膜厚度", department: "青光眼专科、急诊眼科、视功能检查室", population: "青光眼家族史人群、高眼压人群、高龄人群", region: "社区筛查网络、区域眼科中心、基层转诊机构" } },
  { id: "cataract", label: "白内障", summary: "以晶状体混浊及视觉质量变化为核心，连接术前评估、手术治疗和术后管理知识。", relations: { path: "视力评估、手术指征判断、人工晶体规划、术后复查", symptom: "渐进性视力下降、眩光、色觉改变、单眼复视", treatment: "超声乳化、人工晶体植入、并发症处理与视力康复", check: "裂隙灯、眼轴测量、角膜曲率、眼底评估", department: "白内障专科、屈光科、麻醉与日间手术中心", population: "老年人群、糖尿病患者、长期激素使用人群", region: "区域防盲体系、基层筛查点、眼科日间手术中心" } },
  { id: "refractive", label: "屈光不正", summary: "连接近视、远视与散光的筛查、屈光矫正、视觉训练和近视防控知识。", relations: { path: "视力筛查、规范验光、矫正方案、进展监测与复查", symptom: "远近视物模糊、视疲劳、眯眼、阅读距离异常", treatment: "框架眼镜、角膜接触镜、屈光手术与近视防控", check: "裸眼视力、散瞳验光、角膜地形图、眼轴长度", department: "视光中心、屈光科、儿童眼科", population: "儿童青少年、长期近距离用眼人群、屈光参差人群", region: "校园筛查网络、社区视光服务、区域近视防控中心" } },
];

type OphCourse = { type: "学习课件" | "专家论坛" | "在线课程"; title: string; description: string; provider: string; format: string; audiences: string[]; href: string; target?: "_top" };
const ophthalmologyCourses: OphCourse[] = [
  { type: "学习课件", title: "眼底影像判读基础与临床路径", description: "从眼底照相、OCT到临床路径，建立影像特征与诊疗决策的对应关系。", provider: "眼科医学教育资源库", format: "24讲 · 图文课件", audiences: ["科研工作者", "高校学生"], href: "../../../education.html?topic=ophthalmology&resource=slides#services", target: "_top" },
  { type: "学习课件", title: "青光眼数据采集与视野评估规范", description: "学习眼压、视野和视神经影像数据的采集、质控与规范表达。", provider: "专科医学课程中心", format: "18讲 · 案例课件", audiences: ["科研工作者", "产业技术人员"], href: "../../../education.html?topic=ophthalmology&resource=slides#services", target: "_top" },
  { type: "专家论坛", title: "眼科多模态数据与精准诊疗论坛", description: "围绕影像、临床文本和随访数据探讨多模态研究与临床转化路径。", provider: "科技信息交流中心", format: "专题论坛 · 90分钟", audiences: ["科研工作者", "高校学生", "产业技术人员"], href: "./index.html?page=information-exchange&embed=portal#ie-events" },
  { type: "专家论坛", title: "AI辅助眼病筛查与真实世界评价", description: "讨论智能筛查产品的评价指标、部署条件、数据偏差与安全边界。", provider: "科技信息交流中心", format: "专家圆桌 · 75分钟", audiences: ["科研工作者", "产业技术人员"], href: "./index.html?page=information-exchange&embed=portal#ie-events" },
  { type: "在线课程", title: "常见眼病筛查与规范化随访", description: "系统学习白内障、青光眼、视网膜疾病与屈光不正的筛查和随访方法。", provider: "未来教育平台", format: "6周 · 在线学习", audiences: ["高校学生", "产业技术人员"], href: "../../../education.html?topic=ophthalmology&resource=course#services", target: "_top" },
  { type: "在线课程", title: "眼科数据治理与质量控制", description: "掌握眼科数据标准、脱敏、标注、质量检查与研究数据管理方法。", provider: "未来教育平台", format: "4周 · 在线学习", audiences: ["科研工作者", "高校学生", "产业技术人员"], href: "../../../education.html?topic=ophthalmology&resource=course#services", target: "_top" },
];

function OphthalmologyContent() {
  const [selectedNode, setSelectedNode] = useState<OphNode>(ophthalmologyNodes[0]);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState(ophthalmologyDiseases[0].id);
  const [audience, setAudience] = useState("全部对象");
  const selectedDisease = ophthalmologyDiseases.find((item) => item.id === selectedDiseaseId) ?? ophthalmologyDiseases[0];
  const visibleCourses = audience === "全部对象" ? ophthalmologyCourses : ophthalmologyCourses.filter((course) => course.audiences.includes(audience));
  return (
    <>
      <ContentSection
        id="oph-graph"
        title="专科医学知识图谱"
        description="以网络图展示眼科疾病与临床路径、临床表现、治疗方式、相关检查、科室、易感人群和所在区域的关联。"
      >
        <div className="sdc-oph-toolbar"><div role="group" aria-label="选择眼科疾病专题"><span>疾病专题</span>{ophthalmologyDiseases.map((item) => <button type="button" className={selectedDisease.id === item.id ? "is-active" : ""} aria-pressed={selectedDisease.id === item.id} onClick={() => setSelectedDiseaseId(item.id)} key={item.id}>{item.label}</button>)}</div><a href="../../../education.html?topic=ophthalmology#services" target="_top">进入眼科医学教育<ChevronRight size={15} aria-hidden="true" /></a></div>
        <div className="sdc-knowledge-layout">
          <div className="sdc-knowledge-canvas" role="group" aria-label={`${selectedDisease.label}专科医学知识图谱`}>
            <svg viewBox="0 0 560 390" aria-hidden="true">
              {ophthalmologyNodes.map((node) => (
                <line key={node.id} x1="280" y1="202" x2={node.x} y2={node.y} />
              ))}
              <circle cx="280" cy="202" r="78" />
            </svg>
            <div className="sdc-knowledge-center"><CircleDot size={23} /><strong>{selectedDisease.label}</strong><small>眼科专科知识中心</small></div>
            {ophthalmologyNodes.map((node) => (
              <button
                type="button"
                className={selectedNode.id === node.id ? "is-active" : ""}
                style={{ "--node-x": `${node.x / 5.6}%`, "--node-y": `${node.y / 3.9}%` } as CSSProperties}
                aria-pressed={selectedNode.id === node.id}
                onClick={() => setSelectedNode(node)}
                key={node.id}
              >
                {node.label}
              </button>
            ))}
          </div>
          <aside className="sdc-node-detail" aria-live="polite">
            <span>当前知识维度</span>
            <h4>{selectedNode.label}</h4>
            <p>{selectedNode.detail}</p>
            <div className="sdc-oph-disease-summary"><strong>{selectedDisease.label}</strong><p>{selectedDisease.summary}</p></div>
            <dl>
              <dt>当前专题</dt>
              <dd>{selectedDisease.label}</dd>
              <dt>关联内容</dt>
              <dd>{selectedDisease.relations[selectedNode.id]}</dd>
              <dt>图谱关系</dt>
              <dd>{selectedDisease.label} → {selectedNode.label}</dd>
            </dl>
          </aside>
        </div>
      </ContentSection>

      <ContentSection
        id="oph-courses"
        title="优秀课程推荐"
        description="面向科研工作者、高校学生和产业技术人员推荐学习课件、专家论坛与在线课程，并链接眼科医学教育功能。"
      >
        <div className="sdc-course-toolbar"><div role="group" aria-label="按适用对象筛选课程"><span>适用对象</span>{["全部对象", "科研工作者", "高校学生", "产业技术人员"].map((item) => <button type="button" className={audience === item ? "is-active" : ""} aria-pressed={audience === item} onClick={() => setAudience(item)} key={item}>{item}</button>)}</div><span>推荐 {visibleCourses.length} 项</span></div>
        <div className="sdc-resource-list sdc-course-list">
          {visibleCourses.map((course) => (
            <article key={course.title}>
              <span className="sdc-resource-type"><GraduationCap size={17} />{course.type}</span>
              <div className="sdc-course-copy"><h4>{course.title}</h4><p>{course.description}</p><div><span>{course.provider}</span><span>{course.format}</span></div><footer>{course.audiences.map((item) => <small key={item}>{item}</small>)}</footer></div>
              <a className="sdc-course-link" href={course.href} target={course.target}>{course.type === "学习课件" ? "进入课件" : course.type === "专家论坛" ? "进入论坛" : "开始学习"}<ChevronRight size={14} aria-hidden="true" /></a>
            </article>
          ))}
        </div>
        <div className="sdc-education-entry"><GraduationCap size={21} aria-hidden="true" /><div><strong>眼科医学教育相关功能</strong><p>进入未来教育服务，继续使用学习任务、课程资源与学习过程支持能力。</p></div><a href="../../../education.html?topic=ophthalmology#services" target="_top">进入教育服务<ChevronRight size={15} aria-hidden="true" /></a></div>
      </ContentSection>
    </>
  );
}

type BrainStageId = "point" | "line" | "surface" | "volume";
const brainStages: { id: BrainStageId; label: string; definition: string; focus: string }[] = [
  { id: "point", label: "点", definition: "点代表神经元，是脑图谱中的最小数据单位。", focus: "观察神经元位置、密度与类型标记" },
  { id: "line", label: "线", definition: "线由神经元的树突与轴突连续表达。", focus: "理解单细胞形态与投射路径" },
  { id: "surface", label: "面", definition: "面代表经过分割与重建的脑区表面。", focus: "查看脑区边界、层级与空间邻接" },
  { id: "volume", label: "体", definition: "多个点、线、面组合形成三维立体图谱。", focus: "在统一空间坐标中综合查看脑结构" },
];

function BrainDiagram({ stage }: { stage: BrainStageId }) {
  const stageDefinition = brainStages.find((item) => item.id === stage) ?? brainStages[0];
  return (
    <svg className={`sdc-brain-diagram is-${stage}`} viewBox="0 0 580 310" role="img" aria-label={`${stageDefinition.label}态脑图谱结构示意：${stageDefinition.definition} 观察重点：${stageDefinition.focus}。`}>
      <path className="sdc-brain-outline" d="M144 230C80 188 91 97 153 73c27-50 116-58 158-20 58-25 132 10 139 69 60 26 60 107-1 130-58 23-116 18-163 28-57 13-103-13-142-50Z" />
      {(stage === "surface" || stage === "volume") && <>
        <path className="sdc-brain-surface surface-one" d="M158 118c42-39 110-43 148-5 33-27 95-10 105 35-43 4-70 17-96 53-38-23-91-31-157-8-22-24-19-51 0-75Z" />
        <path className="sdc-brain-surface surface-two" d="M173 206c48-23 98-14 143 11 26-33 61-48 99-51-5 52-54 76-101 79-47 4-95 17-141-39Z" />
      </>}
      {(stage === "line" || stage === "volume") && <>
        <path className="sdc-neuron-line" d="M145 178C205 139 234 92 282 85s77 58 126 68" />
        <path className="sdc-neuron-line" d="M171 215c58-27 101-23 143-1 39 20 63 8 103-20" />
        <path className="sdc-neuron-line" d="M224 82c12 49 4 85 41 112 32 24 76 34 91 58" />
      </>}
      {(stage === "point" || stage === "volume") && [
        [151, 174], [183, 127], [225, 93], [265, 142], [303, 87], [343, 128], [395, 151], [179, 214], [232, 226], [290, 211], [356, 224], [413, 193],
      ].map(([cx, cy], index) => <circle className="sdc-neuron-point" cx={cx} cy={cy} r={index % 3 === 0 ? 7 : 5} key={`${cx}-${cy}`} />)}
      {stage === "volume" && <>
        <path className="sdc-volume-contour" d="M133 220C91 157 117 97 174 72c58-27 150-31 217 14 67 46 70 126 7 164" />
        <ellipse className="sdc-volume-ring" cx="293" cy="174" rx="165" ry="74" />
      </>}
    </svg>
  );
}

function BrainAtlasContent() {
  const [stage, setStage] = useState<BrainStageId>("point");
  const activeStage = brainStages.find((item) => item.id === stage) ?? brainStages[0];
  const cases = [
    { title: "多物种细胞构筑图谱", species: "小鼠、猕猴、人脑样本", content: "细胞类型、层级结构与脑区对应关系" },
    { title: "脑区立体定位图谱", species: "多物种标准空间", content: "脑区坐标、边界轮廓与空间定位" },
    { title: "脑区联接图谱", species: "神经环路数据", content: "脑区连接方向、强度与投射路径" },
  ];
  return (
    <>
      <ContentSection
        id="brain-visual"
        title="点、线、面、体图谱"
        description="按四种数据表达层级查看脑图谱构成，当前图形为结构演示。"
      >
        <div className="sdc-segmented" role="group" aria-label="脑图谱表达层级">
          {brainStages.map((item) => <button type="button" aria-pressed={stage === item.id} className={stage === item.id ? "is-active" : ""} onClick={() => setStage(item.id)} key={item.id}><strong>{item.label}</strong><span>{item.id === "point" ? "神经元" : item.id === "line" ? "树突与轴突" : item.id === "surface" ? "脑区表面" : "3D立体图谱"}</span></button>)}
        </div>
        <div className="sdc-brain-view">
          <div className="sdc-brain-canvas"><BrainDiagram stage={stage} /><DemoBadge>结构演示</DemoBadge></div>
          <aside>
            <span>当前层级 · {activeStage.label}</span>
            <h4>{activeStage.definition}</h4>
            <p>{activeStage.focus}</p>
            <dl><dt>数据状态</dt><dd>结构演示</dd><dt>交互状态</dt><dd>四态切换可用</dd></dl>
          </aside>
        </div>
      </ContentSection>

      <ContentSection
        id="brain-cases"
        title="图谱数据案例"
        description="展示标书明确的多物种细胞构筑、脑区立体定位与脑区联接图谱。"
      >
        <div className="sdc-case-table">
          <div className="sdc-case-head"><span>图谱案例</span><span>数据范围</span><span>主要内容</span><span>入口状态</span></div>
          {cases.map((item) => <div className="sdc-case-row" key={item.title}><strong>{item.title}</strong><span>{item.species}</span><span>{item.content}</span><EmptyResource label="暂无地址" /></div>)}
        </div>
        <div className="sdc-inline-status"><Database size={18} /><span>脑图谱可视化系统与脑图谱数据共享平台尚未提供正式地址，当前不开放跳转。</span></div>
      </ContentSection>
    </>
  );
}

type CellColumn = {
  id: string;
  label: string;
  feature: string;
  focus: string;
  scenario: string;
};

const cellColumns: CellColumn[] = [
  { id: "mammalian", label: "哺乳动物工程细胞", feature: "面向复杂细胞类型开展定向功能改造。", focus: "CAR-T细胞、干细胞工程化、胰岛细胞功能优化", scenario: "细胞治疗、再生医学与临床转化" },
  { id: "microbial", label: "微生物工程细胞", feature: "以代谢工程重构微生物合成与生产能力。", focus: "大肠杆菌代谢通路、酵母细胞改造、规模化发酵", scenario: "工业生物制造、绿色化工与生物材料" },
  { id: "synthetic", label: "合成细胞", feature: "围绕人工设计构建细胞开展前沿探索。", focus: "人工最小细胞、细胞模拟系统、人工生命系统", scenario: "生命机制研究、功能原型与基础科学验证" },
  { id: "delivery", label: "工程细胞载体与递送", feature: "提升编辑工具导入与工程细胞构建效率。", focus: "病毒载体改造、非病毒递送、体内移植适配", scenario: "基因编辑工具导入、体内递送与精准治疗" },
];

function EngineeredCellContent() {
  const [activeColumn, setActiveColumn] = useState<CellColumn>(cellColumns[0]);
  return (
    <>
      <ContentSection
        id="cell-overview"
        title="领域全景概览"
        description="建立工程细胞的定义、技术演进脉络与当前研究热点。"
      >
        <div className="sdc-cell-definition">
          <Dna size={27} aria-hidden="true" />
          <div><strong>工程细胞</strong><p>通过基因编辑、代谢网络重构等技术手段，定向赋予细胞新功能或优化原有功能的定制化功能性细胞，不等同于自然状态下的细胞类型。</p></div>
        </div>
        <div className="sdc-cell-timeline" aria-label="工程细胞技术演进">
          <article><span>基础探索</span><h4>微生物工程菌</h4><p>围绕代谢通路改造建立早期工程体系。</p></article>
          <i aria-hidden="true" />
          <article><span>应用拓展</span><h4>哺乳动物工程细胞</h4><p>从实验研究走向细胞治疗与再生医学。</p></article>
          <i aria-hidden="true" />
          <article><span>前沿探索</span><h4>合成细胞</h4><p>从精准设计进入人工生命系统构建。</p></article>
        </div>
        <div className="sdc-hotspot-line"><strong>当前研究热点</strong><span>干细胞定向分化工程</span><span>细胞命运重编程</span><span>合成细胞群落构建</span></div>
      </ContentSection>

      <ContentSection
        id="cell-columns"
        title="细分研究方向垂直专栏"
        description="选择专栏查看技术特点、研究重点和应用场景。"
      >
        <div className="sdc-master-detail">
          <div className="sdc-master-list" role="group" aria-label="工程细胞细分研究方向">
            {cellColumns.map((column) => <button type="button" aria-pressed={activeColumn.id === column.id} className={activeColumn.id === column.id ? "is-active" : ""} onClick={() => setActiveColumn(column)} key={column.id}><span>{column.label}</span><ChevronRight size={17} /></button>)}
          </div>
          <article className="sdc-column-detail" aria-live="polite">
            <span>研究方向</span><h4>{activeColumn.label}</h4>
            <dl><div><dt>技术特点</dt><dd>{activeColumn.feature}</dd></div><div><dt>研究重点</dt><dd>{activeColumn.focus}</dd></div><div><dt>应用场景</dt><dd>{activeColumn.scenario}</dd></div></dl>
          </article>
        </div>
      </ContentSection>

      <ContentSection
        id="cell-resources"
        title="优秀论文与关键技术点"
        description="围绕基础研究到临床转化组织论文目录，并拆解关键技术原理与操作要点。"
      >
        <div className="sdc-resource-columns">
          <div><header><BookOpen size={18} /><strong>优秀论文目录</strong><DemoBadge>演示条目</DemoBadge></header><ul><li><span>工程细胞的功能设计与评价框架</span><EmptyResource /></li><li><span>细胞命运重编程的关键调控路径</span><EmptyResource /></li><li><span>非病毒递送系统的工程化策略</span><EmptyResource /></li></ul></div>
          <div><header><Sparkles size={18} /><strong>关键技术点</strong><DemoBadge>演示内容</DemoBadge></header><ul><li><span>编辑工具选择与脱靶风险评估</span><small>比较编辑效率、脱靶位点与细胞毒性</small></li><li><span>细胞功能表型验证与质量控制</span><small>关注功能表达、稳定性和批次一致性</small></li><li><span>递送效率、存活率与安全性平衡</span><small>对比不同载体在体内外场景的适配性</small></li></ul></div>
        </div>
      </ContentSection>
    </>
  );
}

const energyMaterials = [
  { name: "层状氧化物 A-01", system: "钠离子正极", density: "162 Wh/kg", cycle: "2,100 次", sample: "36 组", optimization: "界面包覆", supplier: "星桥材料（演示）" },
  { name: "磷酸盐 B-07", system: "锂离子正极", density: "178 Wh/kg", cycle: "3,400 次", sample: "48 组", optimization: "掺杂改性", supplier: "南湾新材（演示）" },
  { name: "硫化物 C-12", system: "固态电解质", density: "—", cycle: "1,280 次", sample: "25 组", optimization: "空气稳定性", supplier: "清源储能（演示）" },
  { name: "多孔碳 D-03", system: "超级电容", density: "58 Wh/kg", cycle: "20,000 次", sample: "57 组", optimization: "孔径调控", supplier: "澜科碳材（演示）" },
  { name: "硅碳复合 E-09", system: "锂离子负极", density: "390 Wh/kg", cycle: "1,050 次", sample: "41 组", optimization: "体积膨胀控制", supplier: "远澈科技（演示）" },
  { name: "液流电解液 F-15", system: "全钒液流", density: "42 Wh/L", cycle: "15,000 次", sample: "19 组", optimization: "温域拓展", supplier: "深蓝能源（演示）" },
  { name: "聚合物 G-04", system: "固态电解质", density: "—", cycle: "920 次", sample: "31 组", optimization: "离子电导率", supplier: "寰材实验室（演示）" },
  { name: "锰基材料 H-11", system: "水系锌离子", density: "112 Wh/kg", cycle: "4,600 次", sample: "28 组", optimization: "结构稳定性", supplier: "启元材料（演示）" },
];

function Pagination({ page, pageCount, setPage }: { page: number; pageCount: number; setPage: (page: number) => void }) {
  return (
    <nav className="sdc-pagination" aria-label="表格分页">
      <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="上一页"><ChevronLeft size={16} /></button>
      <span>第 {page} / {pageCount} 页</span>
      <button type="button" disabled={page === pageCount} onClick={() => setPage(page + 1)} aria-label="下一页"><ChevronRight size={16} /></button>
    </nav>
  );
}

function EnergyMaterialContent() {
  const pageSize = 4;
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(energyMaterials.length / pageSize);
  const rows = energyMaterials.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      <ContentSection
        id="energy-materials"
        title="储能材料信息"
        description="以表格呈现基本信息、储能特性、统计分析、材料优化和供应商信息。"
      >
        <div className="sdc-table-toolbar"><span><TableProperties size={17} />共 {energyMaterials.length} 条演示记录，{pageSize} 条/页</span><DemoBadge>主体均为虚构演示</DemoBadge></div>
        <div className="sdc-data-table-wrap">
          <table className="sdc-data-table sdc-energy-table">
            <thead><tr><th>基本信息</th><th>材料体系</th><th>储能特性</th><th>统计分析</th><th>材料优化</th><th>供应商</th></tr></thead>
            <tbody>{rows.map((row) => <tr key={row.name}><td><strong>{row.name}</strong><small>材料编号 · 演示</small></td><td>{row.system}</td><td><span>能量密度 {row.density}</span><small>循环寿命 {row.cycle}</small></td><td><span>{row.sample}</span><small>样本记录</small></td><td>{row.optimization}</td><td>{row.supplier}</td></tr>)}</tbody>
          </table>
        </div>
        <Pagination page={page} pageCount={pageCount} setPage={setPage} />
      </ContentSection>

      <ContentSection
        id="energy-papers"
        title="优秀论文推荐"
        description="围绕储能材料性能、优化方法与产业应用组织论文目录。"
      >
        <div className="sdc-paper-list">
          {["固态电解质界面稳定性研究进展", "高比能正极材料的结构调控方法", "储能材料数据驱动筛选框架"].map((paper, index) => <article key={paper}><span>论文推荐 {String(index + 1).padStart(2, "0")}</span><h4>{paper}</h4><p>演示摘要 · 用于展示论文目录与推荐结构。</p><EmptyResource label="暂无全文" /></article>)}
        </div>
      </ContentSection>
    </>
  );
}

const lowDimDatabases = [
  { id: "lowdim", label: "低维材料数据库", description: "二维、纳米线及量子点等材料结构与性质" },
  { id: "organic", label: "有机分子材料数据库", description: "有机功能分子的结构、轨道与光电性质" },
  { id: "electrode", label: "电极和固态电解质材料数据库", description: "电极材料与固态电解质的性能记录" },
  { id: "catalyst", label: "催化材料数据库", description: "催化活性、反应路径与稳定性数据" },
  { id: "mlff", label: "机器学习力场数据库", description: "训练样本、模型类型与预测误差记录" },
] as const;

type LowDimDatabaseId = (typeof lowDimDatabases)[number]["id"];
const lowDimRecords = [
  { database: "lowdim", formula: "MoS₂-L01", structure: "二维层状", property: "带隙 1.82 eV", method: "DFT-PBE", status: "已计算" },
  { database: "lowdim", formula: "WS₂-L02", structure: "二维层状", property: "带隙 1.95 eV", method: "DFT-HSE", status: "已计算" },
  { database: "lowdim", formula: "GNR-L03", structure: "石墨烯纳米带", property: "宽度 2.4 nm", method: "实验汇编", status: "待复核" },
  { database: "lowdim", formula: "BP-L04", structure: "黑磷薄层", property: "带隙 0.86 eV", method: "DFT-HSE", status: "已计算" },
  { database: "organic", formula: "TADF-O11", structure: "给受体分子", property: "ΔEST 0.09 eV", method: "TD-DFT", status: "已计算" },
  { database: "organic", formula: "OFET-O12", structure: "稠环分子", property: "迁移率 2.1", method: "实验汇编", status: "已收录" },
  { database: "organic", formula: "OLED-O13", structure: "共轭分子", property: "发射峰 486 nm", method: "光谱测试", status: "已收录" },
  { database: "organic", formula: "OPV-O14", structure: "稠环受体", property: "吸收峰 742 nm", method: "光谱测试", status: "待复核" },
  { database: "electrode", formula: "LPS-E21", structure: "硫化物晶格", property: "电导率 8.6 mS/cm", method: "阻抗测试", status: "已收录" },
  { database: "electrode", formula: "NVP-E22", structure: "NASICON", property: "容量 118 mAh/g", method: "充放电测试", status: "已收录" },
  { database: "electrode", formula: "SSE-E23", structure: "复合电解质", property: "窗口 4.7 V", method: "实验汇编", status: "待复核" },
  { database: "electrode", formula: "LTO-E24", structure: "尖晶石负极", property: "容量 172 mAh/g", method: "充放电测试", status: "已收录" },
  { database: "catalyst", formula: "FeNC-C31", structure: "单原子位点", property: "过电位 312 mV", method: "电化学测试", status: "已收录" },
  { database: "catalyst", formula: "PtNi-C32", structure: "合金纳米粒子", property: "活性 1.7 A/mg", method: "实验汇编", status: "已收录" },
  { database: "catalyst", formula: "COF-C33", structure: "共价有机框架", property: "选择性 91%", method: "反应测试", status: "待复核" },
  { database: "catalyst", formula: "NiMo-C34", structure: "双金属位点", property: "过电位 176 mV", method: "电化学测试", status: "已收录" },
  { database: "mlff", formula: "MLFF-M41", structure: "图神经网络", property: "能量误差 2.8 meV", method: "训练验证", status: "已训练" },
  { database: "mlff", formula: "GAP-M42", structure: "高斯近似势", property: "力误差 0.06 eV/Å", method: "交叉验证", status: "已训练" },
  { database: "mlff", formula: "DP-M43", structure: "深度势能面", property: "样本 12.4 万", method: "主动学习", status: "训练中" },
  { database: "mlff", formula: "MACE-M44", structure: "等变神经网络", property: "力误差 0.04 eV/Å", method: "交叉验证", status: "已训练" },
] satisfies { database: LowDimDatabaseId; formula: string; structure: string; property: string; method: string; status: string }[];

function LowDimensionalContent() {
  const [database, setDatabase] = useState<LowDimDatabaseId>("lowdim");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const filtered = useMemo(() => lowDimRecords.filter((record) => record.database === database && [record.formula, record.structure, record.property, record.method].some((value) => value.toLowerCase().includes(query.trim().toLowerCase()))), [database, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const selectDatabase = (next: LowDimDatabaseId) => { setDatabase(next); setPage(1); };
  const updateQuery = (next: string) => { setQuery(next); setPage(1); };

  return (
    <>
      <ContentSection
        id="lowdim-databases"
        title="数据库目录"
        description="五类数据库共同构成低维材料专题的数据入口。"
      >
        <div className="sdc-database-directory" role="group" aria-label="低维材料数据库类型">
          {lowDimDatabases.map((item) => <button type="button" aria-pressed={database === item.id} className={database === item.id ? "is-active" : ""} onClick={() => selectDatabase(item.id)} key={item.id}><Database size={17} /><span><strong>{item.label}</strong><small>{item.description}</small></span></button>)}
        </div>
      </ContentSection>

      <ContentSection
        id="lowdim-results"
        title="材料数据检索"
        description="筛选当前数据库中的材料记录，结果自动分页；全部内容均为演示数据。"
      >
        <div className="sdc-search-toolbar">
          <label><Search size={16} aria-hidden="true" /><input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="输入材料编号、结构或性质" aria-label="检索材料数据" /></label>
          <span>{lowDimDatabases.find((item) => item.id === database)?.label}</span>
          <DemoBadge />
        </div>
        {rows.length ? <>
          <div className="sdc-data-table-wrap"><table className="sdc-data-table sdc-lowdim-table"><thead><tr><th>材料编号</th><th>结构类型</th><th>关键性质</th><th>数据方法</th><th>记录状态</th></tr></thead><tbody>{rows.map((row) => <tr key={row.formula}><td><strong>{row.formula}</strong></td><td>{row.structure}</td><td>{row.property}</td><td>{row.method}</td><td><span className="sdc-record-status">{row.status}</span></td></tr>)}</tbody></table></div>
          <Pagination page={page} pageCount={pageCount} setPage={setPage} />
        </> : <div className="sdc-empty-state"><PackageSearch size={28} /><strong>没有匹配的演示记录</strong><p>请调整关键词，或恢复显示当前数据库全部内容。</p><button type="button" onClick={() => updateQuery("")}><RotateCcw size={15} />恢复全部记录</button></div>}
      </ContentSection>
    </>
  );
}

const emissionDimensions = ["电力", "地面运输", "工业", "居民消费", "国内航空", "国际航空"] as const;
type EmissionDimension = (typeof emissionDimensions)[number];
type CarbonScope = "global" | "china";
type CarbonMapEntity = { name: string; x: number; y: number; baseGrade: number };

const trendShape: Record<EmissionDimension, number[]> = {
  电力: [61, 65, 68, 66, 70, 74, 72, 76],
  地面运输: [42, 46, 49, 45, 51, 56, 60, 63],
  工业: [55, 57, 59, 61, 64, 66, 69, 71],
  居民消费: [31, 34, 36, 38, 37, 40, 43, 45],
  国内航空: [18, 21, 24, 17, 23, 27, 30, 33],
  国际航空: [24, 28, 31, 19, 27, 34, 38, 42],
};

function CarbonMap({ scope, dimension }: { scope: CarbonScope; dimension: EmissionDimension }) {
  const dimensionIndex = emissionDimensions.indexOf(dimension);
  const globalLand = [
    "M72 76l70-35 79 19 19 53-39 40-72-5-45-30Z",
    "M191 174l46 18 19 48-28 71-31-24-17-63Z",
    "M296 70l54-18 35 24-11 34-61 5-24-22Z",
    "M305 132l76-9 39 55-36 82-48-8-34-66Z",
    "M380 72l100-27 98 46-29 77-75 13-56-43-41-31Z",
    "M492 228l75-18 42 31-24 42-82-5-26-23Z",
  ];
  const chinaLand = [
    "98,89 207,50 274,86 234,145 126,154 73,124",
    "275,85 380,63 440,113 388,160 289,145 234,145",
    "380,62 472,31 526,65 492,122 439,113",
    "125,155 235,146 285,200 247,270 145,256 87,207",
    "235,146 388,160 393,216 286,224 285,200",
    "389,160 466,131 508,183 472,241 393,216",
    "286,224 393,216 472,241 430,288 325,302 247,270",
  ];
  const globalEntities: CarbonMapEntity[] = [
    { name: "美国", x: 151, y: 106, baseGrade: 5 },
    { name: "巴西", x: 215, y: 236, baseGrade: 3 },
    { name: "欧盟", x: 335, y: 91, baseGrade: 4 },
    { name: "印度", x: 445, y: 178, baseGrade: 4 },
    { name: "中国", x: 500, y: 121, baseGrade: 5 },
    { name: "日本", x: 567, y: 142, baseGrade: 3 },
  ];
  const chinaEntities: CarbonMapEntity[] = [
    { name: "内蒙古", x: 303, y: 101, baseGrade: 4 },
    { name: "北京", x: 400, y: 119, baseGrade: 3 },
    { name: "山东", x: 438, y: 157, baseGrade: 5 },
    { name: "江苏", x: 462, y: 197, baseGrade: 4 },
    { name: "浙江", x: 455, y: 231, baseGrade: 3 },
    { name: "广东", x: 368, y: 279, baseGrade: 4 },
    { name: "四川", x: 203, y: 213, baseGrade: 3 },
    { name: "湖北", x: 334, y: 207, baseGrade: 3 },
  ];
  const entities = scope === "global" ? globalEntities : chinaEntities;
  const gradeOffset = (dimensionIndex % 3) - 1;
  const gradedEntities = entities.map((entity) => ({
    ...entity,
    grade: Math.max(1, Math.min(5, entity.baseGrade + gradeOffset)),
  }));
  const scopeLabel = scope === "global" ? "代表性主要经济体" : "中国代表性省级地区";
  const textEquivalent = gradedEntities.map((entity) => `${entity.name}${entity.grade}级`).join("、");

  return (
    <figure className="sdc-carbon-map">
      <svg
        className="sdc-carbon-map-svg"
        viewBox={scope === "global" ? "0 0 660 340" : "0 0 600 340"}
        role="img"
        aria-label={`${scopeLabel}${dimension}排放演示分级地图：${textEquivalent}。1级较低，5级较高；所有等级均为演示数据。`}
      >
        <g className="sdc-map-land" aria-hidden="true">
          {scope === "global"
            ? globalLand.map((path) => <path d={path} key={path} />)
            : chinaLand.map((points) => <polygon points={points} key={points} />)}
        </g>
        {gradedEntities.map((entity) => (
          <g className={`sdc-map-marker grade-${entity.grade}`} transform={`translate(${entity.x} ${entity.y})`} key={entity.name}>
            <title>{entity.name}，{dimension}排放演示等级 {entity.grade} 级</title>
            <circle r="13" />
            <text className="sdc-map-marker-name" y="-18">{entity.name}</text>
            <text className="sdc-map-marker-grade" y="4">{entity.grade}</text>
          </g>
        ))}
      </svg>
      <figcaption>
        <span>样本点位与等级（1 较低，5 较高）</span>
        <ul>{gradedEntities.map((entity) => <li key={entity.name}><strong>{entity.name}</strong><span>{entity.grade} 级</span></li>)}</ul>
      </figcaption>
    </figure>
  );
}

function TrendChart({ values, years, scope, dimension }: { values: number[]; years: number[]; scope: CarbonScope; dimension: EmissionDimension }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const xAt = (index: number) => values.length > 1 ? 42 + index * (646 / (values.length - 1)) : 365;
  const yAt = (value: number) => 212 - ((value - min) / Math.max(1, max - min)) * 144;
  const points = values.map((value, index) => `${xAt(index)},${yAt(value)}`).join(" ");
  const scopeLabel = scope === "global" ? "代表性主要经济体样本" : "中国代表性省级地区样本";
  const seriesLabel = years.map((year, index) => `${year}年${values[index]}`).join("，");
  return (
    <svg className="sdc-trend-chart" viewBox="0 0 730 255" role="img" aria-label={`${scopeLabel}${dimension}排放历年趋势：${seriesLabel}。单位为演示指数，不代表真实排放结论。`}>
      {[0, 1, 2, 3].map((line) => <line className="grid-line" x1="42" x2="688" y1={68 + line * 48} y2={68 + line * 48} key={line} />)}
      <polyline className="trend-area" points={`42,224 ${points} 688,224`} />
      <polyline className="trend-line" points={points} />
      {values.map((value, index) => <g key={`${years[index]}-${value}`}><circle cx={xAt(index)} cy={yAt(value)} r="4" /><text className="sdc-trend-value" x={xAt(index)} y={yAt(value) - 11}>{value}</text><text x={xAt(index)} y="246">{years[index]}</text></g>)}
    </svg>
  );
}

function CarbonFootprintContent() {
  const [scope, setScope] = useState<CarbonScope>("global");
  const [dimension, setDimension] = useState<EmissionDimension>("电力");
  const [startYear, setStartYear] = useState(2018);
  const [endYear, setEndYear] = useState(2025);
  const allYears = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const years = allYears.filter((year) => year >= startYear && year <= endYear);
  const startIndex = allYears.indexOf(startYear);
  const values = trendShape[dimension].slice(startIndex, startIndex + years.length).map((value) => Math.round(value * (scope === "china" ? 0.43 : 1)));
  const total = values[values.length - 1] ?? 0;

  const updateStart = (year: number) => { setStartYear(year); if (year > endYear) setEndYear(year); };
  const updateEnd = (year: number) => { setEndYear(year); if (year < startYear) setStartYear(year); };

  return (
    <>
      <ContentSection
        id="carbon-map"
        title="碳足迹地图"
        description="选取代表性主要经济体或中国代表性省级地区作为演示样本，以颜色和数字等级共同展示排放差异。"
      >
        <div className="sdc-carbon-controls">
          <div className="sdc-compact-tabs" role="group" aria-label="碳足迹地图范围"><button type="button" aria-pressed={scope === "global"} className={scope === "global" ? "is-active" : ""} onClick={() => setScope("global")}>全球碳足迹</button><button type="button" aria-pressed={scope === "china"} className={scope === "china" ? "is-active" : ""} onClick={() => setScope("china")}>中国碳足迹</button></div>
          <DemoBadge>地图与数据均为演示</DemoBadge>
        </div>
        <div className="sdc-dimension-tabs" role="group" aria-label="碳排放维度">{emissionDimensions.map((item) => <button type="button" aria-pressed={dimension === item} className={dimension === item ? "is-active" : ""} onClick={() => setDimension(item)} key={item}>{item}</button>)}</div>
        <div className="sdc-carbon-dashboard">
          <div className="sdc-map-panel">
            <CarbonMap scope={scope} dimension={dimension} />
            <div className="sdc-map-legend"><span>较低</span>{[1, 2, 3, 4, 5].map((grade) => <i className={`grade-${grade}`} key={grade} />)}<span>较高</span></div>
          </div>
          <aside className="sdc-carbon-summary">
            <span>{scope === "global" ? "6 个经济体样本" : "8 个省级地区样本"}</span>
            <h4>{dimension}排放</h4>
            <strong>{total.toLocaleString()} <small>演示指数</small></strong>
            <dl><div><dt>统计年份</dt><dd>{endYear} 年</dd></div><div><dt>颜色分级</dt><dd>5 级</dd></div><div><dt>数据状态</dt><dd>演示</dd></div></dl>
            <p>实体名称和点位用于说明覆盖口径；等级与指数仅用于展示筛选、地图分级与趋势联动，不代表真实排放结论。</p>
          </aside>
        </div>
      </ContentSection>

      <ContentSection
        id="carbon-trend"
        title="历年变化趋势"
        description="选择年份区间，查看当前区域范围与排放维度的年度变化。"
      >
        <div className="sdc-year-controls">
          <Activity size={18} />
          <strong>{scope === "global" ? "经济体样本" : "省级地区样本"} · {dimension}</strong>
          <label>起始年份<select value={startYear} onChange={(event) => updateStart(Number(event.target.value))}>{allYears.map((year) => <option key={year}>{year}</option>)}</select></label>
          <span>至</span>
          <label>结束年份<select value={endYear} onChange={(event) => updateEnd(Number(event.target.value))}>{allYears.map((year) => <option key={year}>{year}</option>)}</select></label>
        </div>
        <div className="sdc-trend-layout">
          <TrendChart values={values} years={years} scope={scope} dimension={dimension} />
          <div className="sdc-trend-readout"><span>区间变化</span><strong>{values.length > 1 ? `${values[values.length - 1] >= values[0] ? "+" : ""}${(((values[values.length - 1] - values[0]) / values[0]) * 100).toFixed(1)}%` : "—"}</strong><small>{startYear}—{endYear} · 演示计算</small></div>
        </div>
      </ContentSection>
    </>
  );
}

function TopicContent({ topicId, onOpen }: { topicId: TopicId; onOpen: (topicId: TopicId) => void }) {
  switch (topicId) {
    case "navigation": return <NavigationContent onOpen={onOpen} />;
    case "ophthalmology": return <OphthalmologyContent />;
    case "brain-atlas": return <BrainAtlasContent />;
    case "engineered-cell": return <EngineeredCellContent />;
    case "energy-material": return <EnergyMaterialContent />;
    case "low-dimensional": return <LowDimensionalContent />;
    case "carbon-footprint": return <CarbonFootprintContent />;
  }
}

export default function ScientificDataCenterPage() {
  const [activeTopic, setActiveTopic] = useState<TopicId>(() => parseTopicFromUrl());
  const activeDefinition = topicById.get(activeTopic) ?? topicDefinitions[0];
  const [activeAnchor, setActiveAnchor] = useState(activeDefinition.sections[0].id);
  const ActiveIcon = activeDefinition.icon;

  useEffect(() => {
    const canonicalUrl = new URL(window.location.href);
    canonicalUrl.searchParams.set("page", "scientific-data-center");
    canonicalUrl.searchParams.set("module", activeTopic);
    if (!canonicalUrl.hash) canonicalUrl.hash = `sdc-module-${activeTopic}`;
    if (canonicalUrl.href !== window.location.href) window.history.replaceState(window.history.state, "", canonicalUrl);

    const syncRoute = () => {
      const topic = parseTopicFromUrl();
      setActiveTopic(topic);
      const definition = topicById.get(topic) ?? topicDefinitions[0];
      const hashId = window.location.hash.slice(1);
      const nextAnchor = definition.sections.some((section) => section.id === hashId) ? hashId : definition.sections[0].id;
      setActiveAnchor(nextAnchor);
    };
    window.addEventListener("popstate", syncRoute);
    window.addEventListener("hashchange", syncRoute);
    return () => {
      window.removeEventListener("popstate", syncRoute);
      window.removeEventListener("hashchange", syncRoute);
    };
  }, []);

  useEffect(() => {
    setActiveAnchor(activeDefinition.sections[0].id);
    const sections = activeDefinition.sections.map((section) => document.getElementById(section.id)).filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;
    let frame = 0;
    const updateAnchor = () => {
      const current = sections.reduce((selected, section) => section.getBoundingClientRect().top <= 116 ? section : selected, sections[0]);
      setActiveAnchor(current.id);
    };
    const schedule = () => { window.cancelAnimationFrame(frame); frame = window.requestAnimationFrame(updateAnchor); };
    updateAnchor();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [activeDefinition]);

  const openTopic = (topicId: TopicId) => {
    const definition = topicById.get(topicId) ?? topicDefinitions[0];
    const url = new URL(window.location.href);
    url.searchParams.set("page", "scientific-data-center");
    url.searchParams.set("module", topicId);
    url.searchParams.delete("sub");
    url.searchParams.delete("industry");
    url.hash = `sdc-module-${topicId}`;
    window.history.pushState(window.history.state, "", url);
    setActiveTopic(topicId);
    setActiveAnchor(definition.sections[0].id);
    window.requestAnimationFrame(() => document.getElementById("sdc-workspace")?.scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" }));
  };

  const locateSection = (sectionId: string) => {
    setActiveAnchor(sectionId);
    const url = new URL(window.location.href);
    url.hash = sectionId;
    window.history.replaceState(window.history.state, "", url);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" });
  };

  return (
    <main className="sdc-page">
      <PortalHeader currentPage="scientific-data-center" />

      <section id="sdc-top" className="sdc-hero" aria-labelledby="sdc-title">
        <img src="./assets/thinktank-hero-compact.png" alt="" />
        <div className="sdc-hero-inner">
          <div>
            <h1 id="sdc-title">科学数据中心</h1>
            <p>汇集医学、脑图谱、工程细胞、材料与碳足迹专题数据，提供结构清晰的科学导航与可视化入口。</p>
          </div>
          <div className="sdc-hero-index" aria-label="科学数据中心专题范围"><span>7 个专题入口</span><i /><span>图谱 · 数据表 · 空间指标</span></div>
        </div>
      </section>

      <div id="sdc-workspace" className="sdc-shell">
        <nav className="sdc-topic-nav" aria-label="科学数据中心专题目录">
          <header><strong>专题目录</strong><small>7 项科学数据服务</small></header>
          {topicDefinitions.map((topic) => {
            const Icon = topic.icon;
            return <button type="button" className={activeTopic === topic.id ? "is-active" : ""} aria-current={activeTopic === topic.id ? "page" : undefined} onClick={() => openTopic(topic.id)} key={topic.id}><Icon size={17} aria-hidden="true" /><span>{topic.label}</span></button>;
          })}
        </nav>

        <section className="sdc-main-column" id={`sdc-module-${activeTopic}`} aria-labelledby="sdc-topic-title">
          <header className="sdc-topic-heading">
            <span><ActiveIcon size={23} aria-hidden="true" /></span>
            <div><h2 id="sdc-topic-title">{activeDefinition.label}</h2><p>{activeDefinition.description}</p></div>
            <DemoBadge>功能演示</DemoBadge>
          </header>
          <div className="sdc-content-flow" key={activeTopic}><TopicContent topicId={activeTopic} onOpen={openTopic} /></div>
        </section>

        <nav className="sdc-section-locator" aria-label={`${activeDefinition.label}内容定位`}>
          <strong>内容定位</strong>
          {activeDefinition.sections.map((section) => <button type="button" className={activeAnchor === section.id ? "is-active" : ""} aria-current={activeAnchor === section.id ? "location" : undefined} onClick={() => locateSection(section.id)} key={section.id}>{section.label}</button>)}
          <button type="button" className="sdc-back-top" onClick={() => document.getElementById("sdc-top")?.scrollIntoView({ behavior: preferredScrollBehavior() })}>返回顶部</button>
        </nav>

        <footer className="sdc-footer"><div><img src="./assets/gkx-logo.png" alt="" /><span><strong>科学数据中心</strong><small>深圳国际科技信息中心</small></span></div><p>当前页面仅用于标书功能与交互演示；所有数据、对象、图谱关系和统计结果均不代表真实结论。</p></footer>
      </div>
    </main>
  );
}
