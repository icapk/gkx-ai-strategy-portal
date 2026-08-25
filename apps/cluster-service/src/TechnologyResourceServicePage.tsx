import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Braces,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Database,
  FileCheck2,
  FileText,
  FolderTree,
  Gauge,
  GitBranch,
  KeyRound,
  Layers3,
  Library,
  Link2,
  Network,
  Radar,
  Search,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  UsersRound,
  Workflow,
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
import "./technology-resource-service.css";

type ModuleId = "intel" | "evaluation" | "mining";
type SectionDefinition = { id: string; label: string };
type ModuleDefinition = {
  id: ModuleId;
  label: string;
  description: string;
  icon: LucideIcon;
  sections: SectionDefinition[];
};

const moduleDefinitions: ModuleDefinition[] = [
  {
    id: "intel",
    label: "科技情报资源",
    description: "以数据湖为基座，统一组织科技情报目录、专题知识服务和数据获取服务。",
    icon: Library,
    sections: [
      { id: "trs-intel-foundation", label: "资源服务底座" },
      { id: "trs-intel-directory", label: "情报资源目录" },
      { id: "trs-intel-knowledge", label: "知识服务配置" },
      { id: "trs-intel-access", label: "数据与目录服务" },
    ],
  },
  {
    id: "evaluation",
    label: "科技资源效果判定",
    description: "围绕科技活动布局与产出效果，提供量化评估框架和辅助研判视图。",
    icon: FileCheck2,
    sections: [
      { id: "trs-eval-analysis", label: "布局与产出分析" },
      { id: "trs-eval-comparison", label: "对象对比" },
      { id: "trs-eval-framework", label: "判定体系说明" },
    ],
  },
  {
    id: "mining",
    label: "创新资源要素挖掘",
    description: "分析创新要素生长趋势与对象关联，辅助项目监控、风险预警和要素定位。",
    icon: Radar,
    sections: [
      { id: "trs-mining-growth", label: "生长趋势预测" },
      { id: "trs-mining-network", label: "科技对象关联" },
      { id: "trs-mining-projects", label: "项目监控与预警" },
    ],
  },
];

const moduleById = new Map<ModuleId, ModuleDefinition>(
  moduleDefinitions.map((module) => [module.id, module]),
);

function parseModuleFromUrl(): ModuleId {
  const value = new URL(window.location.href).searchParams.get("module") as ModuleId | null;
  return value && moduleById.has(value) ? value : "intel";
}

function preferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function DemoBadge({ children = "演示数据" }: { children?: ReactNode }) {
  return <span className="trs-demo-badge">{children}</span>;
}

function ContentSection({
  id,
  title,
  description,
  aside,
  children,
}: {
  id: string;
  title: string;
  description: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="trs-content-section" aria-labelledby={`${id}-title`}>
      <header className="trs-content-section-header">
        <div>
          <h3 id={`${id}-title`}>{title}</h3>
          <p>{description}</p>
        </div>
        {aside}
      </header>
      {children}
    </section>
  );
}

const resourceTypes = ["全部", "数据集", "论文", "专利", "报告", "获奖", "专家学者"] as const;
type ResourceType = (typeof resourceTypes)[number];
type ResourceItem = {
  id: string;
  type: Exclude<ResourceType, "全部">;
  title: string;
  topic: string;
  year: string;
  source: string;
  format: string;
  summary: string;
  tags: string[];
};

const resourceItems: ResourceItem[] = [
  { id: "R-013", type: "数据集", title: "未来产业科研数据集目录样本", topic: "科技管理", year: "2025", source: "数据集目录样本", format: "CSV / 元数据", summary: "用于演示数据集题名、时间范围、格式、授权边界和关联专题的统一查看方式。", tags: ["数据集", "授权访问"] },
  { id: "R-014", type: "数据集", title: "工程细胞实验数据集目录样本", topic: "工程细胞", year: "2024", source: "专题数据样本", format: "JSON / 元数据", summary: "展示专题数据集的目录发现与相似资源推荐，不包含真实实验记录。", tags: ["工程细胞", "资源推荐"] },
  { id: "R-001", type: "论文", title: "合成生物制造路径与关键技术综述", topic: "合成生物", year: "2025", source: "专题遴选样本", format: "PDF / 元数据", summary: "用于演示论文题录、摘要、主题分类和关联对象的统一组织方式。", tags: ["工程技术", "生物制造"] },
  { id: "R-002", type: "专利", title: "细胞工厂代谢调控方法与装置", topic: "工程细胞", year: "2024", source: "专利目录样本", format: "结构化元数据", summary: "展示专利基础信息、技术分类和专题标签，不代表真实授权或法律状态。", tags: ["生命科学", "代谢工程"] },
  { id: "R-003", type: "报告", title: "低维材料创新资源观察（演示）", topic: "低维材料", year: "2025", source: "专题报告样本", format: "PDF / 图表", summary: "面向专题研究场景组织的报告目录样本，内容与结论均为演示。", tags: ["材料科学", "趋势观察"] },
  { id: "R-004", type: "获奖", title: "储能材料技术成果条目 A", topic: "储能材料", year: "2023", source: "成果目录样本", format: "结构化元数据", summary: "用于展示科技成果获奖信息的目录字段与关联方式，不对应真实奖项。", tags: ["新能源", "成果转化"] },
  { id: "R-005", type: "专家学者", title: "脑科学领域专家档案 A", topic: "脑科学", year: "2025", source: "专家库样本", format: "人物元数据", summary: "用于演示研究方向、机构和成果关联字段，不对应真实人物。", tags: ["脑图谱", "神经科学"] },
  { id: "R-006", type: "论文", title: "多模态眼科数据治理方法研究", topic: "眼科医学", year: "2024", source: "论文目录样本", format: "PDF / 元数据", summary: "展示科研论文与医学专题、数据格式及应用场景的分类关系。", tags: ["医药卫生", "数据治理"] },
  { id: "R-007", type: "专利", title: "固态电解质界面优化方法", topic: "储能材料", year: "2025", source: "专利目录样本", format: "结构化元数据", summary: "用于界面筛选和详情联动的稳定示例条目。", tags: ["材料科学", "固态电解质"] },
  { id: "R-008", type: "报告", title: "区域创新资源协同配置观察（演示）", topic: "科技管理", year: "2024", source: "研究报告样本", format: "PDF / 数据表", summary: "演示区域资源布局、产出和协同关系的专题报告目录。", tags: ["科技管理", "资源配置"] },
  { id: "R-009", type: "获奖", title: "光计算关键器件成果条目 B", topic: "光计算", year: "2024", source: "成果目录样本", format: "结构化元数据", summary: "仅用于展示获奖成果的主题遴选与目录管理字段。", tags: ["信息技术", "光计算"] },
  { id: "R-010", type: "专家学者", title: "量子信息领域专家档案 B", topic: "量子信息", year: "2025", source: "专家库样本", format: "人物元数据", summary: "演示专家与论文、专利、项目之间的对象关联。", tags: ["量子信息", "科技人才"] },
  { id: "R-011", type: "论文", title: "碳足迹时空数据分析框架", topic: "碳足迹", year: "2023", source: "论文目录样本", format: "PDF / 元数据", summary: "用于展示论文资源的专题分类、时间筛选和详情字段。", tags: ["环境科学", "时空分析"] },
  { id: "R-012", type: "报告", title: "未来产业技术关联图谱方法说明", topic: "科技前沿", year: "2025", source: "方法报告样本", format: "PDF / 图谱", summary: "用于演示专题科技情报资源目录和知识图谱关联能力。", tags: ["交叉前沿", "知识图谱"] },
];

const knowledgeClasses = [
  { id: "basic", label: "基础科学", count: 3, children: ["生命科学", "物理科学", "化学科学"], note: "用于组织基础研究论文、学者与知识节点。" },
  { id: "engineering", label: "工程技术", count: 3, children: ["生物制造", "材料工程", "信息技术"], note: "用于组织专利、工程方法和成果转化信息。" },
  { id: "medical", label: "医药卫生", count: 3, children: ["眼科医学", "脑科学", "临床数据"], note: "用于组织医学专题数据、论文与专家资源。" },
  { id: "cross", label: "交叉前沿", count: 3, children: ["量子信息", "光计算", "碳足迹"], note: "用于跨学科专题遴选和科技对象关联。" },
];

const scenarioDefinitions = [
  { id: "research", label: "科研发现", description: "面向研究人员配置专题检索、关联发现与资源推荐。", tags: ["题录检索", "主题聚合", "关联发现", "资源推荐"] },
  { id: "decision", label: "决策研判", description: "面向决策研究配置专题目录、趋势观察与证据汇集。", tags: ["专题目录", "趋势观察", "证据汇集", "对象追溯"] },
  { id: "management", label: "数据管理", description: "面向数据管理者配置元数据治理、授权范围与目录维护。", tags: ["元数据治理", "目录维护", "授权范围", "质量检查"] },
];

function IntelligenceContent() {
  const [resourceType, setResourceType] = useState<ResourceType>("全部");
  const [topic, setTopic] = useState("全部专题");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(resourceItems[0].id);
  const [knowledgeClass, setKnowledgeClass] = useState(knowledgeClasses[0].id);
  const [scenario, setScenario] = useState(scenarioDefinitions[0].id);
  const [selectedTags, setSelectedTags] = useState<string[]>(scenarioDefinitions[0].tags.slice(0, 2));
  const pageSize = 4;

  const topics = useMemo(
    () => ["全部专题", ...Array.from(new Set(resourceItems.map((item) => item.topic)))],
    [],
  );
  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return resourceItems.filter((item) => {
      const matchesType = resourceType === "全部" || item.type === resourceType;
      const matchesTopic = topic === "全部专题" || item.topic === topic;
      const haystack = `${item.title}${item.summary}${item.tags.join("")}`.toLowerCase();
      return matchesType && matchesTopic && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [query, resourceType, topic]);
  const totalPages = Math.max(1, Math.ceil(filteredResources.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleResources = filteredResources.slice((safePage - 1) * pageSize, safePage * pageSize);
  const selectedResource = visibleResources.find((item) => item.id === selectedId) ?? visibleResources[0] ?? null;
  const recommendedResources = selectedResource
    ? resourceItems
      .filter((item) => item.id !== selectedResource.id)
      .map((item) => ({
        item,
        score: (item.topic === selectedResource.topic ? 4 : 0)
          + item.tags.filter((tag) => selectedResource.tags.includes(tag)).length * 2
          + (item.type === selectedResource.type ? 1 : 0)
          + (item.year === selectedResource.year ? .25 : 0),
      }))
      .filter(({ score }) => score > 0)
      .sort((left, right) => right.score - left.score || right.item.year.localeCompare(left.item.year))
      .slice(0, 2)
      .map(({ item }) => item)
    : [];
  const activeClass = knowledgeClasses.find((item) => item.id === knowledgeClass) ?? knowledgeClasses[0];
  const activeScenario = scenarioDefinitions.find((item) => item.id === scenario) ?? scenarioDefinitions[0];

  const resetPage = () => setPage(1);
  const selectScenario = (scenarioId: string) => {
    const next = scenarioDefinitions.find((item) => item.id === scenarioId) ?? scenarioDefinitions[0];
    setScenario(next.id);
    setSelectedTags(next.tags.slice(0, 2));
  };
  const toggleTag = (tag: string) => {
    setSelectedTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);
  };

  return (
    <>
      <ContentSection
        id="trs-intel-foundation"
        title="资源服务底座"
        description="科学资源服务以数据湖承接多源数据，并贯穿汇交、治理、授权、发现、协作与复用的科学数据生命周期。"
        aside={<DemoBadge>定位说明</DemoBadge>}
      >
        <div className="trs-lifecycle" aria-label="科学数据生命周期">
          {["数据汇交", "元数据治理", "授权访问", "发现与共享", "协作复用"].map((item, index) => (
            <div key={item}>
              <span>{index + 1}</span>
              <strong>{item}</strong>
              {index < 4 ? <ArrowRight size={15} aria-hidden="true" /> : null}
            </div>
          ))}
        </div>
        <div className="trs-foundation-grid">
          <article>
            <Database size={20} aria-hidden="true" />
            <div><strong>统一数据湖与源数据管理</strong><p>支持科研数据集、题录、对象关系和源数据的统一管理，并保留授权访问控制边界。</p></div>
          </article>
          <article>
            <Server size={20} aria-hidden="true" />
            <div><strong>外部资源集成</strong><p>可对接外部数据库、网络服务与计算机集群；当前页面不连接真实服务。</p></div>
          </article>
          <article>
            <Braces size={20} aria-hidden="true" />
            <div><strong>多格式与工具适配</strong><p>面向表格、文档、结构化元数据、图谱与计算结果提供统一目录和发现入口。</p></div>
          </article>
          <article>
            <UsersRound size={20} aria-hidden="true" />
            <div><strong>共享协作与行业咨询</strong><p>支持围绕数据集和科技情报开展协作与咨询；当前咨询受理、消息和反馈流程均待正式接入。</p></div>
          </article>
        </div>
      </ContentSection>

      <ContentSection
        id="trs-intel-directory"
        title="科技情报资源目录"
        description="按数据集、论文、专利、报告、获奖和专家学者六类资源筛选目录；选择条目可查看稳定演示详情。"
        aside={<DemoBadge />}
      >
        <div className="trs-filter-stack">
          <div className="trs-type-tabs" role="group" aria-label="资源类型筛选">
            {resourceTypes.map((type) => (
              <button
                type="button"
                className={resourceType === type ? "is-active" : ""}
                aria-pressed={resourceType === type}
                onClick={() => { setResourceType(type); resetPage(); }}
                key={type}
              >{type}</button>
            ))}
          </div>
          <div className="trs-directory-toolbar">
            <label className="trs-search-field">
              <Search size={15} aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => { setQuery(event.target.value); resetPage(); }}
                aria-label="检索资源名称或标签"
                placeholder="检索资源名称或标签"
              />
            </label>
            <label className="trs-select-field">
              <span>专题</span>
              <select value={topic} onChange={(event) => { setTopic(event.target.value); resetPage(); }} aria-label="按专题筛选">
                {topics.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <span className="trs-result-count">找到 {filteredResources.length} 条演示记录</span>
          </div>
        </div>

        {visibleResources.length ? (
          <div className="trs-directory-layout">
            <div className="trs-resource-list" role="group" aria-label="科技情报资源目录">
              {visibleResources.map((item) => (
                <button
                  type="button"
                  className={selectedResource?.id === item.id ? "is-active" : ""}
                  aria-pressed={selectedResource?.id === item.id}
                  onClick={() => setSelectedId(item.id)}
                  key={item.id}
                >
                  <span className="trs-resource-type">{item.type}</span>
                  <span className="trs-resource-copy"><strong>{item.title}</strong><small>{item.topic} · {item.year} · {item.format}</small></span>
                  <ChevronRight size={15} aria-hidden="true" />
                </button>
              ))}
              <div className="trs-pagination" aria-label="资源目录分页">
                <button type="button" onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage === 1} aria-label="上一页"><ChevronLeft size={15} /></button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button type="button" className={safePage === pageNumber ? "is-active" : ""} aria-current={safePage === pageNumber ? "page" : undefined} onClick={() => setPage(pageNumber)} key={pageNumber}>{pageNumber}</button>
                ))}
                <button type="button" onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage === totalPages} aria-label="下一页"><ChevronRight size={15} /></button>
              </div>
            </div>
            <aside className="trs-resource-detail" aria-live="polite">
              {selectedResource ? (
                <>
                  <span>当前目录条目 · {selectedResource.id}</span>
                  <h4>{selectedResource.title}</h4>
                  <p>{selectedResource.summary}</p>
                  <dl>
                    <div><dt>资源类型</dt><dd>{selectedResource.type}</dd></div>
                    <div><dt>专题分类</dt><dd>{selectedResource.topic}</dd></div>
                    <div><dt>目录来源</dt><dd>{selectedResource.source}</dd></div>
                    <div><dt>可用状态</dt><dd>{selectedResource.type === "数据集" ? "可查看演示元数据，文件待授权" : "仅展示元数据"}</dd></div>
                  </dl>
                  <div className="trs-detail-tags">{selectedResource.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <div className="trs-resource-recommendation">
                    <header><BookOpen size={14} /><div><strong>相似资源推荐（演示）</strong><p>依据资源类型、专题、标签与年份计算目录关联，不使用真实用户画像。</p></div></header>
                    <ul>{recommendedResources.map((item) => <li key={item.id}><span>{item.type}</span><div><strong>{item.title}</strong><small>{item.topic} · {item.year}</small></div></li>)}</ul>
                    <small>仅展示目录关联结果，不提供详情跳转。</small>
                  </div>
                  <p className="trs-detail-boundary"><ShieldCheck size={14} />当前目录仅展示元数据，不提供下载与授权操作。</p>
                </>
              ) : null}
            </aside>
          </div>
        ) : (
          <div className="trs-empty-state"><Search size={24} /><strong>没有匹配的演示记录</strong><p>请调整资源类型、专题或关键词。</p><button type="button" onClick={() => { setResourceType("全部"); setTopic("全部专题"); setQuery(""); setPage(1); }}>清除筛选</button></div>
        )}
      </ContentSection>

      <ContentSection
        id="trs-intel-knowledge"
        title="知识分类与专题知识服务"
        description="通过精细化知识分类和专题数据遴选，为不同服务场景配置标签化知识服务。"
      >
        <div className="trs-knowledge-layout">
          <div className="trs-classification-panel">
            <header><FolderTree size={17} /><strong>知识分类</strong><small>演示分类</small></header>
            {knowledgeClasses.map((item) => (
              <button type="button" className={knowledgeClass === item.id ? "is-active" : ""} aria-pressed={knowledgeClass === item.id} onClick={() => setKnowledgeClass(item.id)} key={item.id}>
                <span><strong>{item.label}</strong><small>{item.children.join(" · ")}</small></span>
                <em>{item.count} 类</em>
              </button>
            ))}
          </div>
          <div className="trs-class-detail" aria-live="polite">
            <span>当前分类</span>
            <h4>{activeClass.label}</h4>
            <p>{activeClass.note}</p>
            <div>{activeClass.children.map((child) => <span key={child}>{child}</span>)}</div>
            <small>当前分类与专题遴选规则均为演示。</small>
          </div>
        </div>

        <div className="trs-scenario-config">
          <header>
            <div><SlidersHorizontal size={17} /><strong>服务场景配置</strong></div>
            <DemoBadge>配置演示</DemoBadge>
          </header>
          <div className="trs-scenario-tabs" role="group" aria-label="服务场景选择">
            {scenarioDefinitions.map((item) => <button type="button" className={scenario === item.id ? "is-active" : ""} aria-pressed={scenario === item.id} onClick={() => selectScenario(item.id)} key={item.id}>{item.label}</button>)}
          </div>
          <p>{activeScenario.description}</p>
          <div className="trs-config-tags" role="group" aria-label={`${activeScenario.label}服务标签`}>
            {activeScenario.tags.map((tag) => <button type="button" aria-pressed={selectedTags.includes(tag)} className={selectedTags.includes(tag) ? "is-active" : ""} onClick={() => toggleTag(tag)} key={tag}><CheckCircle2 size={13} />{tag}</button>)}
          </div>
          <div className="trs-config-summary"><span>已选 {selectedTags.length} 项服务标签</span><strong>{selectedTags.length ? selectedTags.join("、") : "尚未选择标签"}</strong><small>配置仅作用于当前演示界面，不会保存或发起外部服务。</small></div>
        </div>
      </ContentSection>

      <ContentSection
        id="trs-intel-access"
        title="数据获取与专题目录管理服务"
        description="展示 API 数据获取与专题科技情报资源目录管理的能力范围。"
      >
        <div className="trs-access-grid">
          <article className="trs-api-panel">
            <header><Braces size={18} /><div><strong>API 数据获取服务</strong><small>面向专题目录和元数据的标准化获取能力</small></div><span>能力说明</span></header>
            <div className="trs-api-placeholder"><code>GET /api/v1/topic-resources</code><em>示意路径</em></div>
            <ul><li><KeyRound size={14} />按用户与应用生成访问密钥</li><li><ShieldCheck size={14} />按角色、用途与数据级别控制权限</li><li><Database size={14} />响应字段遵循资源目录元数据规范</li></ul>
          </article>
          <article className="trs-catalog-panel">
            <header><FolderTree size={18} /><div><strong>专题资源目录管理</strong><small>目录治理能力说明</small></div></header>
            <dl>
              <div><dt>目录编目</dt><dd>主题分类、字段规范与来源登记</dd><span>能力说明</span></div>
              <div><dt>专题遴选</dt><dd>按服务场景组合资源与标签</dd><span>规则说明</span></div>
              <div><dt>质量治理</dt><dd>完整性、重复项与更新状态检查</dd><span>治理流程</span></div>
              <div><dt>授权范围</dt><dd>按用户、角色和用途配置访问边界</dd><span>访问控制</span></div>
            </dl>
          </article>
        </div>
      </ContentSection>
    </>
  );
}

const evaluationScopes = ["全市科技活动", "资助项目群", "专题领域"] as const;
const evaluationMetrics = ["综合研判", "资源布局", "产出质量", "协同转化"] as const;

const criteria = [
  { id: "layout", label: "资源布局", weight: "30%", definition: "观察科技资源在对象范围内的覆盖、结构与配置关系。", evidence: "项目、机构、人才与平台的结构化汇总字段" },
  { id: "output", label: "产出质量", weight: "30%", definition: "观察论文、专利、报告与成果等产出的数量结构和质量信号。", evidence: "产出目录、同行评价与成果关联字段" },
  { id: "coordination", label: "协同程度", weight: "20%", definition: "观察跨机构、跨区域及产学研对象之间的协作关系。", evidence: "合作对象、共同产出与关联网络字段" },
  { id: "translation", label: "转化效能", weight: "20%", definition: "观察科技活动产出向应用、服务或后续项目的衔接情况。", evidence: "成果应用、后续项目和转化过程字段" },
];

function EvaluationTrendChart({
  values,
  scope,
  metric,
}: {
  values: number[];
  scope: (typeof evaluationScopes)[number];
  metric: (typeof evaluationMetrics)[number];
}) {
  const points = values.map((value, index) => `${56 + index * 82},${210 - (value - 50) * 3.2}`).join(" ");
  const area = `56,230 ${points} ${56 + (values.length - 1) * 82},230`;
  const accessibleSummary = values
    .map((value, index) => `${2020 + index}年 ${value.toFixed(1)}分`)
    .join("，");
  return (
    <svg
      className="trs-eval-chart"
      viewBox="0 0 590 260"
      role="img"
      aria-label={`${scope}的${metric}趋势演示：${accessibleSummary}。数值均为非正式演示。`}
    >
      {[70, 110, 150, 190, 230].map((y) => <line x1="44" x2="558" y1={y} y2={y} key={y} />)}
      <polygon points={area} />
      <polyline points={points} />
      {values.map((value, index) => <g key={index}><circle cx={56 + index * 82} cy={210 - (value - 50) * 3.2} r="4" /><text x={56 + index * 82} y="248">{2020 + index}</text><text className="value" x={56 + index * 82} y={198 - (value - 50) * 3.2}>{value.toFixed(1)}</text></g>)}
    </svg>
  );
}

function EvaluationContent() {
  const [scope, setScope] = useState<(typeof evaluationScopes)[number]>(evaluationScopes[0]);
  const [metric, setMetric] = useState<(typeof evaluationMetrics)[number]>(evaluationMetrics[0]);
  const [criterionId, setCriterionId] = useState(criteria[0].id);
  const scopeIndex = evaluationScopes.indexOf(scope);
  const metricIndex = evaluationMetrics.indexOf(metric);
  const trendValues = useMemo(
    () => [62.4, 64.8, 67.1, 68.6, 71.2, 73.5, 75.1].map((value, index) => Number((value + scopeIndex * 1.4 + metricIndex * .9 + (index % 2 ? .3 : 0)).toFixed(1))),
    [metricIndex, scopeIndex],
  );
  const demonstrationScore = trendValues[trendValues.length - 1];
  const comparisons = [
    { label: scopeIndex === 2 ? "专题样本 A" : "对象样本 A", value: 78 + metricIndex },
    { label: scopeIndex === 2 ? "专题样本 B" : "对象样本 B", value: 70 + scopeIndex * 2 },
    { label: scopeIndex === 2 ? "专题样本 C" : "对象样本 C", value: 65 + metricIndex * 2 },
    { label: scopeIndex === 2 ? "专题样本 D" : "对象样本 D", value: 59 + scopeIndex },
  ];
  const activeCriterion = criteria.find((item) => item.id === criterionId) ?? criteria[0];

  return (
    <>
      <ContentSection
        id="trs-eval-analysis"
        title="科技活动布局与产出效果分析"
        description="切换对象范围与指标观察演示趋势。分值仅用于表达功能，不构成正式评价、排名或政策结论。"
        aside={<DemoBadge>非正式判定</DemoBadge>}
      >
        <div className="trs-eval-controls">
          <div><span>对象范围</span><div className="trs-control-tabs" role="group" aria-label="判定对象范围">{evaluationScopes.map((item) => <button type="button" className={scope === item ? "is-active" : ""} aria-pressed={scope === item} onClick={() => setScope(item)} key={item}>{item}</button>)}</div></div>
          <label><span>分析指标</span><select value={metric} onChange={(event) => setMetric(event.target.value as (typeof evaluationMetrics)[number])}>{evaluationMetrics.map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>
        <div className="trs-eval-layout">
          <div className="trs-eval-chart-panel">
            <header><div><Activity size={17} /><strong>{scope} · {metric}趋势</strong></div><span>2020—2026 · 演示</span></header>
            <EvaluationTrendChart values={trendValues} scope={scope} metric={metric} />
          </div>
          <aside className="trs-score-readout">
            <span>{metric === "综合研判" ? "当前演示综合值" : `当前${metric}演示值`}</span>
            <strong>{demonstrationScore.toFixed(1)}<small>/ 100</small></strong>
            <p>根据当前演示数据与选择项即时计算，仅用于说明量化评估界面。</p>
            <dl><div><dt>对象范围</dt><dd>{scope}</dd></div><div><dt>分析指标</dt><dd>{metric}</dd></div><div><dt>判定性质</dt><dd>非正式判定</dd></div></dl>
          </aside>
        </div>
      </ContentSection>

      <ContentSection
        id="trs-eval-comparison"
        title="资源对象对比"
        description="在同一演示口径下比较不同对象的布局或产出表现，辅助识别结构差异，不提供真实排名。"
      >
        <div className="trs-comparison-layout">
          <div
            className="trs-comparison-bars"
            role="img"
            aria-label={`${scope}的${metric}对象对比演示：${comparisons.map((item) => `${item.label} ${item.value}分`).join("，")}。`}
          >
            {comparisons.map((item) => <div key={item.label}><span>{item.label}</span><i><b style={{ "--bar-value": `${item.value}%` } as CSSProperties} /></i><strong>{item.value}</strong></div>)}
          </div>
          <div className="trs-comparison-note"><Gauge size={22} /><strong>对比口径说明</strong><p>当前展示 {scope} 下的 {metric} 演示值。正式使用时需统一数据周期、对象边界、缺失值处理与指标权重。</p><span>对象名称与数值均为演示</span></div>
        </div>
      </ContentSection>

      <ContentSection
        id="trs-eval-framework"
        title="科技资源判定体系"
        description="将布局、产出、协同与转化组织为可解释的演示指标框架，为后续量化评估和专家研判提供说明。"
        aside={<DemoBadge>演示权重</DemoBadge>}
      >
        <div className="trs-criteria-tabs" role="group" aria-label="评价指标说明选择">
          {criteria.map((item) => <button type="button" className={criterionId === item.id ? "is-active" : ""} aria-pressed={criterionId === item.id} onClick={() => setCriterionId(item.id)} key={item.id}><span>{item.label}</span><strong>{item.weight}</strong></button>)}
        </div>
        <div className="trs-criterion-detail" aria-live="polite">
          <div><span>当前指标说明</span><h4>{activeCriterion.label}</h4><p>{activeCriterion.definition}</p></div>
          <dl><div><dt>演示权重</dt><dd>{activeCriterion.weight}</dd></div><div><dt>参考证据</dt><dd>{activeCriterion.evidence}</dd></div><div><dt>正式应用前提</dt><dd>指标口径、数据质量与专家规则均需确认</dd></div></dl>
        </div>
        <div className="trs-evaluation-boundary"><AlertTriangle size={17} /><p><strong>使用边界：</strong>本模块只演示分析、评估与研判流程，不输出任何机构、项目或区域的真实判定结论。</p></div>
      </ContentSection>
    </>
  );
}

const miningLevels = ["城市", "行政区", "机构"] as const;
const miningElements = ["人才", "技术", "平台", "资本"] as const;

type FactorNode = { id: string; label: string; type: string; detail: string; signal: string; x: number; y: number };
const factorNodes: FactorNode[] = [
  { id: "talent", label: "人才集聚", type: "人才", detail: "观察核心人才、团队与跨机构流动形成的生长信号。", signal: "团队协同与持续投入", x: 90, y: 78 },
  { id: "technology", label: "关键技术", type: "技术", detail: "观察专利、论文与技术路线之间的持续关联。", signal: "连续产出与技术迭代", x: 298, y: 48 },
  { id: "platform", label: "科研平台", type: "平台", detail: "观察设施、实验平台与共享服务对创新活动的支撑。", signal: "平台开放与资源承载", x: 506, y: 82 },
  { id: "project", label: "项目活动", type: "项目", detail: "观察审核、执行、节点进度与阶段产出的连续状态。", signal: "里程碑完成与异常变化", x: 530, y: 250 },
  { id: "capital", label: "资金支持", type: "资本", detail: "观察科技资源投入结构和后续支持的衔接情况。", signal: "投入连续性与配置匹配", x: 302, y: 302 },
  { id: "output", label: "成果产出", type: "成果", detail: "观察论文、专利、报告与应用成果之间的组合关系。", signal: "高质量产出与应用衔接", x: 76, y: 244 },
];

type FactorRelation = { from: string; to: string; label: string; evidence: string };
const factorRelations: FactorRelation[] = [
  { from: "talent", to: "technology", label: "人才能力支撑", evidence: "团队方向与技术产出标签的演示共现" },
  { from: "technology", to: "platform", label: "技术依托平台", evidence: "技术路线与科研平台能力的演示关联" },
  { from: "platform", to: "project", label: "平台承载项目", evidence: "平台资源与项目执行节点的演示关联" },
  { from: "capital", to: "project", label: "资金支持项目", evidence: "投入批次与项目阶段的演示关联" },
  { from: "project", to: "output", label: "项目形成成果", evidence: "项目里程碑与成果登记的演示关联" },
  { from: "talent", to: "output", label: "人才关联成果", evidence: "人员角色与成果署名字段的演示关联" },
  { from: "output", to: "technology", label: "成果反馈技术", evidence: "成果关键词与技术路线的演示关联" },
];

type RiskProject = {
  id: string;
  name: string;
  stage: string;
  progress: number;
  risk: "低" | "中" | "高";
  warning: string;
  factorId: string;
  next: string;
};
const riskProjects: RiskProject[] = [
  { id: "P-A", name: "示例项目 A", stage: "执行监控", progress: 72, risk: "中", warning: "阶段成果登记晚于演示计划", factorId: "output", next: "核验阶段成果与时间节点" },
  { id: "P-B", name: "示例项目 B", stage: "项目审核", progress: 28, risk: "低", warning: "未发现显著演示风险", factorId: "talent", next: "复核团队与任务匹配关系" },
  { id: "P-C", name: "示例项目 C", stage: "进度分析", progress: 46, risk: "高", warning: "关键技术节点存在连续偏差", factorId: "technology", next: "核验技术路线与节点依赖" },
  { id: "P-D", name: "示例项目 D", stage: "执行监控", progress: 84, risk: "中", warning: "平台资源预约出现演示冲突", factorId: "platform", next: "确认平台资源协调计划" },
];

function GrowthTrendChart({
  levelIndex,
  elementIndex,
  level,
  element,
}: {
  levelIndex: number;
  elementIndex: number;
  level: (typeof miningLevels)[number];
  element: (typeof miningElements)[number];
}) {
  const values = [42, 48, 51, 57, 64, 70, 75, 79, 83].map((value, index) => value + levelIndex * 3 + elementIndex * 2 + (index % 3 === 0 ? 1 : 0));
  const points = values.map((value, index) => ({ x: 52 + index * 65, y: 226 - (value - 35) * 3 }));
  const actualPoints = points.slice(0, 6).map((point) => `${point.x},${point.y}`).join(" ");
  const forecastPoints = points.slice(5).map((point) => `${point.x},${point.y}`).join(" ");
  const accessibleSummary = values
    .map((value, index) => `${2019 + index}年 ${value}${index > 5 ? "（预测）" : ""}`)
    .join("，");
  return (
    <svg
      className="trs-growth-chart"
      viewBox="0 0 620 270"
      role="img"
      aria-label={`${level}层级的${element}创新资源生长趋势演示：${accessibleSummary}。2019至2024年为历史演示段，2025至2027年为预测演示段。`}
    >
      {[60, 105, 150, 195, 240].map((y, index) => <g key={y}><line x1="40" x2="590" y1={y} y2={y} /><text className="axis-label" x="30" y={y + 4}>{90 - index * 15}</text></g>)}
      <text className="axis-unit" x="40" y="22">生长指数</text>
      <line className="forecast-divider" x1={points[5].x} x2={points[5].x} y1="36" y2="240" />
      <text className="forecast-label" x={points[5].x + 10} y="50">预测区间</text>
      <polyline className="actual" points={actualPoints} />
      <polyline className="forecast" points={forecastPoints} />
      {points.map((point, index) => <g key={index}><circle className={index > 5 ? "is-forecast" : ""} cx={point.x} cy={point.y} r="4" /><text className="point-value" x={point.x} y={point.y - 10}>{values[index]}</text><text x={point.x} y="258">{2019 + index}</text></g>)}
    </svg>
  );
}

function MiningContent() {
  const [level, setLevel] = useState<(typeof miningLevels)[number]>(miningLevels[0]);
  const [element, setElement] = useState<(typeof miningElements)[number]>(miningElements[0]);
  const [selectedFactorId, setSelectedFactorId] = useState(factorNodes[0].id);
  const [riskFilter, setRiskFilter] = useState("全部风险");
  const [selectedProjectId, setSelectedProjectId] = useState(riskProjects[0].id);
  const levelIndex = miningLevels.indexOf(level);
  const elementIndex = miningElements.indexOf(element);
  const selectedFactor = factorNodes.find((item) => item.id === selectedFactorId) ?? factorNodes[0];
  const filteredProjects = riskProjects.filter((project) => riskFilter === "全部风险" || `${project.risk}风险` === riskFilter);
  const selectedProject = filteredProjects.find((project) => project.id === selectedProjectId) ?? filteredProjects[0] ?? null;
  const selectedFactorRelations = factorRelations.filter((relation) => relation.from === selectedFactor.id || relation.to === selectedFactor.id);

  const selectProject = (project: RiskProject) => {
    setSelectedProjectId(project.id);
    setSelectedFactorId(project.factorId);
  };

  const selectRiskFilter = (nextFilter: string) => {
    const nextProjects = riskProjects.filter((project) => nextFilter === "全部风险" || `${project.risk}风险` === nextFilter);
    const nextProject = nextProjects[0] ?? null;
    setRiskFilter(nextFilter);
    setSelectedProjectId(nextProject?.id ?? "");
    if (nextProject) setSelectedFactorId(nextProject.factorId);
  };

  return (
    <>
      <ContentSection
        id="trs-mining-growth"
        title="创新资源生长趋势与预测"
        description="按城市、行政区和机构层级切换创新要素，区分历史趋势与预测段；所有曲线均为演示。"
        aside={<DemoBadge />}
      >
        <div className="trs-mining-controls">
          <div><span>分析层级</span><div className="trs-control-tabs" role="group" aria-label="创新资源分析层级">{miningLevels.map((item) => <button type="button" className={level === item ? "is-active" : ""} aria-pressed={level === item} onClick={() => setLevel(item)} key={item}>{item}</button>)}</div></div>
          <div><span>生长要素</span><div className="trs-control-tabs" role="group" aria-label="创新资源生长要素">{miningElements.map((item) => <button type="button" className={element === item ? "is-active" : ""} aria-pressed={element === item} onClick={() => setElement(item)} key={item}>{item}</button>)}</div></div>
        </div>
        <div className="trs-growth-layout">
          <div className="trs-growth-panel">
            <header><div><Activity size={17} /><strong>{level}层级 · {element}要素</strong></div><span><i />历史趋势 <i />预测段</span></header>
            <GrowthTrendChart levelIndex={levelIndex} elementIndex={elementIndex} level={level} element={element} />
          </div>
          <aside className="trs-growth-note"><Target size={22} /><strong>趋势解释</strong><p>预测段用于演示趋势分析服务的呈现方式，不代表对任何区域、机构或资源要素的真实预测。</p><dl><div><dt>分析层级</dt><dd>{level}</dd></div><div><dt>当前要素</dt><dd>{element}</dd></div><div><dt>预测方法</dt><dd>演示拟合</dd></div></dl></aside>
        </div>
      </ContentSection>

      <ContentSection
        id="trs-mining-network"
        title="科技对象关联挖掘"
        description="关联人才、技术、平台、项目、资金与成果对象；选择节点可查看其在创新生长中的信号说明。"
        aside={<DemoBadge>关联演示</DemoBadge>}
      >
        <div className="trs-network-layout">
          <div className="trs-network-visual">
            <div className="trs-network-canvas" role="group" aria-label="科技对象关联网络演示">
              <svg viewBox="0 0 600 350" preserveAspectRatio="none" aria-hidden="true">
                {factorNodes.map((node) => <line className="is-hub-link" x1="300" y1="176" x2={node.x} y2={node.y} key={`hub-${node.id}`} />)}
                {factorRelations.map((relation) => {
                  const fromNode = factorNodes.find((node) => node.id === relation.from);
                  const toNode = factorNodes.find((node) => node.id === relation.to);
                  if (!fromNode || !toNode) return null;
                  const isActive = relation.from === selectedFactorId || relation.to === selectedFactorId;
                  return <line className={`is-object-link${isActive ? " is-active" : ""}`} x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} key={`${relation.from}-${relation.to}`} />;
                })}
                <circle cx="300" cy="176" r="82" />
              </svg>
              <div className="trs-network-center"><Network size={24} /><strong>创新活动</strong><small>对象归集中心</small></div>
              {factorNodes.map((node) => <button type="button" className={selectedFactorId === node.id ? "is-active" : ""} aria-pressed={selectedFactorId === node.id} onClick={() => setSelectedFactorId(node.id)} style={{ "--node-x": `${node.x / 6}%`, "--node-y": `${node.y / 3.5}%` } as CSSProperties} key={node.id}><span>{node.label}</span><small>{node.type}</small></button>)}
            </div>
            <div className="trs-network-legend" aria-hidden="true"><span><i className="is-object" />对象间关联</span><span><i />活动归集</span></div>
          </div>
          <aside className="trs-factor-detail" aria-live="polite">
            <span>当前关键要素</span>
            <h4>{selectedFactor.label}</h4>
            <p>{selectedFactor.detail}</p>
            <dl><div><dt>对象类型</dt><dd>{selectedFactor.type}</dd></div><div><dt>定位信号</dt><dd>{selectedFactor.signal}</dd></div><div><dt>数据性质</dt><dd>演示关联</dd></div></dl>
            <div className="trs-factor-relations"><strong>对象间关联路径</strong>{selectedFactorRelations.map((relation) => {
              const relatedId = relation.from === selectedFactor.id ? relation.to : relation.from;
              const relatedNode = factorNodes.find((node) => node.id === relatedId);
              return <div key={`${relation.from}-${relation.to}`}><span>{relation.label} · {relatedNode?.label}</span><small>{relation.evidence}</small></div>;
            })}</div>
            <small><Link2 size={13} />下方项目风险列表可联动定位关联要素。</small>
          </aside>
        </div>
      </ContentSection>

      <ContentSection
        id="trs-mining-projects"
        title="项目审核、执行监控与风险预警"
        description="汇集项目阶段、进度、风险信号和关联要素，支持从项目风险回溯关键创新生长要素。"
        aside={<DemoBadge>项目均为演示</DemoBadge>}
      >
        <div className="trs-project-toolbar">
          <div><Workflow size={17} /><span>项目状态联动</span></div>
          <label><span>风险筛选</span><select value={riskFilter} onChange={(event) => selectRiskFilter(event.target.value)}><option>全部风险</option><option>低风险</option><option>中风险</option><option>高风险</option></select></label>
        </div>
        <div className="trs-project-layout">
          <div className="trs-risk-list" role="group" aria-label="项目风险演示列表">
            <div className="trs-risk-head"><span>项目 / 阶段</span><span>进度</span><span>风险</span></div>
            {filteredProjects.map((project) => (
              <button type="button" className={selectedProject?.id === project.id ? "is-active" : ""} aria-pressed={selectedProject?.id === project.id} onClick={() => selectProject(project)} key={project.id}>
                <span><strong>{project.name}</strong><small>{project.stage}</small></span>
                <span className="trs-progress-cell"><i><b style={{ "--progress": `${project.progress}%` } as CSSProperties} /></i><em>{project.progress}%</em></span>
                <span className={`trs-risk-badge is-${project.risk === "低" ? "low" : project.risk === "中" ? "medium" : "high"}`}>{project.risk}风险</span>
              </button>
            ))}
            {!filteredProjects.length ? <div className="trs-inline-empty">当前筛选条件下暂无演示项目</div> : null}
          </div>
          <aside className="trs-project-detail" aria-live="polite">
            {selectedProject ? (
              <>
                <span>当前项目 · {selectedProject.id}</span>
                <h4>{selectedProject.name}</h4>
                <div className={`trs-project-warning is-${selectedProject.risk === "低" ? "low" : selectedProject.risk === "中" ? "medium" : "high"}`}><AlertTriangle size={16} /><p><strong>{selectedProject.risk}风险信号</strong>{selectedProject.warning}</p></div>
                <dl><div><dt>当前阶段</dt><dd>{selectedProject.stage}</dd></div><div><dt>进度分析</dt><dd>演示完成度 {selectedProject.progress}%</dd></div><div><dt>关联要素</dt><dd>{factorNodes.find((item) => item.id === selectedProject.factorId)?.label}</dd></div><div><dt>建议核验</dt><dd>{selectedProject.next}</dd></div></dl>
              </>
            ) : <div className="trs-detail-empty">请选择一项演示项目查看风险说明。</div>}
          </aside>
        </div>
      </ContentSection>
    </>
  );
}

function ModuleContent({ moduleId }: { moduleId: ModuleId }) {
  switch (moduleId) {
    case "intel": return <IntelligenceContent />;
    case "evaluation": return <EvaluationContent />;
    case "mining": return <MiningContent />;
  }
}

export default function TechnologyResourceServicePage() {
  const [activeModule, setActiveModule] = useState<ModuleId>(() => parseModuleFromUrl());
  const activeDefinition = moduleById.get(activeModule) ?? moduleDefinitions[0];
  const [activeAnchor, setActiveAnchor] = useState(activeDefinition.sections[0].id);
  const ActiveIcon = activeDefinition.icon;

  useEffect(() => {
    const canonicalUrl = new URL(window.location.href);
    canonicalUrl.searchParams.set("page", "technology-resource-service");
    canonicalUrl.searchParams.set("module", activeModule);
    if (!canonicalUrl.hash) canonicalUrl.hash = activeDefinition.sections[0].id;
    if (canonicalUrl.href !== window.location.href) window.history.replaceState(window.history.state, "", canonicalUrl);

    const syncRoute = () => {
      const nextModule = parseModuleFromUrl();
      const definition = moduleById.get(nextModule) ?? moduleDefinitions[0];
      const hashId = window.location.hash.slice(1);
      setActiveModule(nextModule);
      setActiveAnchor(definition.sections.some((section) => section.id === hashId) ? hashId : definition.sections[0].id);
    };
    window.addEventListener("popstate", syncRoute);
    window.addEventListener("hashchange", syncRoute);
    return () => {
      window.removeEventListener("popstate", syncRoute);
      window.removeEventListener("hashchange", syncRoute);
    };
  }, [activeDefinition.sections, activeModule]);

  useEffect(() => {
    setActiveAnchor(activeDefinition.sections[0].id);
    const sections = activeDefinition.sections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;
    let frame = 0;
    const updateAnchor = () => {
      const current = sections.reduce(
        (selected, section) => section.getBoundingClientRect().top <= 112 ? section : selected,
        sections[0],
      );
      setActiveAnchor(current.id);
    };
    const schedule = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateAnchor);
    };
    updateAnchor();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [activeDefinition]);

  const openModule = (moduleId: ModuleId) => {
    const definition = moduleById.get(moduleId) ?? moduleDefinitions[0];
    const url = new URL(window.location.href);
    url.searchParams.set("page", "technology-resource-service");
    url.searchParams.set("module", moduleId);
    url.searchParams.delete("sub");
    url.searchParams.delete("industry");
    url.hash = definition.sections[0].id;
    window.history.pushState(window.history.state, "", url);
    setActiveModule(moduleId);
    setActiveAnchor(definition.sections[0].id);
    window.requestAnimationFrame(() => document.getElementById("trs-workspace")?.scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" }));
  };

  const locateSection = (sectionId: string) => {
    setActiveAnchor(sectionId);
    const url = new URL(window.location.href);
    url.hash = sectionId;
    window.history.replaceState(window.history.state, "", url);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" });
  };

  return (
    <div className="trs-page">
      <PortalHeader currentPage="technology-resource-service" />

      <main>
      <section id="trs-top" className="trs-hero" aria-labelledby="trs-title">
        <img src="./assets/thinktank-hero-compact.png" alt="" />
        <div className="trs-hero-inner">
          <div className="trs-hero-copy">
            <h1 id="trs-title">科技资源服务</h1>
            <p>面向科研工作者、数据管理者和数据使用者，提供科技情报资源组织、科技资源效果研判与创新要素挖掘的一体化服务入口。</p>
          </div>
          <div className="trs-hero-flow" aria-label="科技资源服务链路">
            <span><Database size={17} />数据汇聚</span><i /><span><BookOpen size={17} />知识组织</span><i /><span><Radar size={17} />分析研判</span>
          </div>
        </div>
      </section>

      <div id="trs-workspace" className="trs-shell">
        <nav className="trs-module-nav" aria-label="科技资源服务功能目录">
          <header><strong>功能目录</strong><small>3 项科技资源服务</small></header>
          {moduleDefinitions.map((module) => {
            const Icon = module.icon;
            return (
              <button type="button" className={activeModule === module.id ? "is-active" : ""} aria-current={activeModule === module.id ? "page" : undefined} onClick={() => openModule(module.id)} key={module.id}>
                <Icon size={18} aria-hidden="true" /><span><strong>{module.label}</strong><small>{module.id === "intel" ? "目录 · 知识 · API" : module.id === "evaluation" ? "布局 · 产出 · 判定" : "趋势 · 关联 · 预警"}</small></span>
              </button>
            );
          })}
          <div className="trs-nav-note"><CircleDot size={14} /><p>页面数据为演示样本。</p></div>
        </nav>

        <section className="trs-main-column" aria-labelledby="trs-module-title">
          <header className="trs-module-heading">
            <span><ActiveIcon size={24} aria-hidden="true" /></span>
            <div><h2 id="trs-module-title">{activeDefinition.label}</h2><p>{activeDefinition.description}</p></div>
            <DemoBadge>功能演示</DemoBadge>
          </header>
          <div className="trs-content-flow" key={activeModule}><ModuleContent moduleId={activeModule} /></div>
        </section>

        <nav className="trs-section-locator" aria-label={`${activeDefinition.label}内容定位`}>
          <strong>内容定位</strong>
          {activeDefinition.sections.map((section) => <button type="button" className={activeAnchor === section.id ? "is-active" : ""} aria-current={activeAnchor === section.id ? "location" : undefined} onClick={() => locateSection(section.id)} key={section.id}>{section.label}</button>)}
          <button type="button" className="trs-back-top" onClick={() => document.getElementById("trs-top")?.scrollIntoView({ behavior: preferredScrollBehavior() })}>返回顶部</button>
        </nav>

        <footer className="trs-footer">
          <div><img src="./assets/gkx-logo.png" alt="" /><span><strong>科技资源服务</strong><small>深圳国际科技信息中心</small></span></div>
          <p>页面用于标书功能与交互演示。资源条目、评价分值、趋势预测、对象关联和项目风险均不代表真实数据或正式结论。</p>
        </footer>
      </div>
      </main>
    </div>
  );
}
