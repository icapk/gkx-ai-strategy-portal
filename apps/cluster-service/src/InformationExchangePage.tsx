import { ChevronLeft } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import PageSectionLocator from "./PageSectionLocator";
import PortalHeader from "./PortalHeader";
import "./information-exchange.css";

const assetRoot = "./assets/figma-information-exchange";

const eventRows = [
  { id: "event-1", title: "2026深圳国际AI创新大赛", type: "赛事", field: "人工智能", summary: "面向全球征集人工智能创新应用项目，聚焦技术验证、产业场景与成果转化。", date: "2026-04-15 至 2026-06-30", location: "深圳市南山区科技园", image: "event-feature-figma.png", status: "报名进行中" },
  { id: "event-2", title: "AI大模型技术与行业应用实践", type: "讲座", field: "人工智能", summary: "围绕模型工程、行业数据治理与智能体应用进行案例讲解和实践交流。", date: "2026-05-22", location: "深圳市福田区", image: "event-practice-figma.png", status: "开放预约" },
  { id: "event-3", title: "数字化转型与企业创新发展沙龙", type: "沙龙", field: "数字化转型", summary: "邀请科研机构、企业与投资机构共同讨论数字化创新路径。", date: "2026-05-08", location: "上海市", image: "event-salon-figma.png", status: "活动结束" },
  { id: "event-4", title: "量子信息产业协同论坛", type: "会议", field: "量子信息", summary: "讨论量子计算、量子通信与测量技术的协同创新和应用机会。", date: "2026-06-18", location: "合肥市", image: "event-ai-competition.png", status: "开放预约" },
  { id: "event-5", title: "合成生物青年学者交流会", type: "沙龙", field: "合成生物", summary: "面向青年科研人员组织研究进展分享与跨机构合作交流。", date: "2026-07-03", location: "深圳市光明区", image: "event-ai-practice.png", status: "即将开放" },
];

type DebateExpert = { name: string; title: string; institution: string };
type DebateRow = { id: string; title: string; summary: string; focus: string; discipline: [string, string, string]; status: "进行中" | "即将开始" | "已结束"; date: string; votes: number; participants: number; experts: DebateExpert[]; organizer?: string; priority?: number };

const debateRows: DebateRow[] = [
  { id: "debate-figma-planning", title: "AI 科研助手应在自动写作中承担多大责任？", summary: "聚焦 AI 科研助手在文献检索、知识组织与自动写作中的能力边界。", focus: "文献检索、证据组织、自动写作与科研诚信", discipline: ["工学类", "计算机科学与技术", "科学智能"], status: "进行中", date: "2026-04-08 ～2026-05-20", votes: 1824, participants: 1268, organizer: "科学智能联合实验室", priority: 1, experts: [{ name: "张伟", title: "教授", institution: "清华大学" }, { name: "林澈", title: "教授", institution: "北京大学" }, { name: "沈璟", title: "顾问", institution: "深圳大学" }] },
  { id: "debate-figma-upcoming", title: "科研数据开放共享应如何划定授权边界？", summary: "讨论科研数据开放、个人信息保护、成果权益和跨机构共享的责任边界。", focus: "使用目的、授权期限、再分发条件与审计追溯", discipline: ["法学类", "法学", "数据权益与科技法"], status: "即将开始", date: "2026-05-10 ～2026-06-20", votes: 1368, participants: 896, organizer: "科技数据治理联合研究组", priority: 2, experts: [{ name: "顾宁", title: "教授", institution: "政法大学" }, { name: "许远", title: "研究", institution: "科技法治" }, { name: "苏维", title: "顾问", institution: "数字权益" }] },
  { id: "debate-figma-ended", title: "大语言模型会重塑科研评价的证据标准吗？", summary: "从证据可追溯性、同行评议与模型辅助判断的角度讨论科研评价边界。", focus: "证据链、同行评议、模型透明度与责任归属", discipline: ["管理学类", "公共管理", "科技评价"], status: "已结束", date: "2026-01-12 ～2026-02-28", votes: 3026, participants: 2314, organizer: "科技治理与评价联合研究中心", priority: 3, experts: [{ name: "邵清", title: "研究", institution: "治理中心" }, { name: "王澄", title: "教授", institution: "浙江大学" }, { name: "林岚", title: "主任", institution: "评估中心" }] },
  { id: "debate-engineering-ai", title: "大语言模型是否会取代传统软件开发？", summary: "讨论大模型对需求分析、代码生成、测试交付和软件工程人才结构的长期影响。", focus: "技术替代边界、软件工程范式、人机协作与开发者能力转型", discipline: ["工学类", "计算机科学与技术", "软件工程"], status: "进行中", date: "2026-08-27", votes: 3286, participants: 2345, experts: [{ name: "张伟", title: "教授", institution: "清华大学" }, { name: "林澈", title: "研究员", institution: "先进计算中心" }, { name: "沈璟", title: "技术总监", institution: "智能软件研究院" }] },
  { id: "debate-education-talent", title: "未来产业人才培养更需要通才还是专才？", summary: "围绕交叉基础、专业深度、项目实践与产业协同讨论未来产业人才培养路径。", focus: "通识基础、专业能力、产教融合与人才评价", discipline: ["教育学类", "教育学", "高等教育学"], status: "即将开始", date: "2026-08-30", votes: 3018, participants: 1680, experts: [{ name: "周岚", title: "教授", institution: "北京大学" }, { name: "陈宇", title: "研究员", institution: "未来教育研究中心" }, { name: "罗予安", title: "产业导师", institution: "湾区科创学院" }] },
  { id: "debate-law-copyright", title: "生成式人工智能作品的著作权应如何界定？", summary: "讨论训练数据、提示设计、模型生成与人工编辑对作品权属和责任认定的影响。", focus: "训练数据授权、创作贡献、平台责任与权利救济", discipline: ["法学类", "法学", "知识产权法"], status: "即将开始", date: "2026-09-02", votes: 2864, participants: 1516, experts: [{ name: "顾宁", title: "教授", institution: "中国政法大学" }, { name: "许知远", title: "研究员", institution: "科技法治研究中心" }, { name: "苏维", title: "高级顾问", institution: "数字权益实验室" }] },
  { id: "debate-medicine-ai", title: "医学人工智能的临床责任应由谁承担？", summary: "从临床决策、产品设计、数据质量和持续监测角度讨论医学人工智能的责任边界。", focus: "临床复核、产品责任、数据偏差与风险监测", discipline: ["医学类", "临床医学", "医学人工智能"], status: "进行中", date: "2026-08-26", votes: 2720, participants: 1468, experts: [{ name: "李明", title: "主任医师", institution: "深圳医学中心" }, { name: "唐若宁", title: "研究员", institution: "医学数据研究院" }, { name: "韩启辰", title: "产品专家", institution: "智能医疗实验室" }] },
  { id: "debate-science-basic", title: "基础科学研究是否应该设置明确的短期应用目标？", summary: "讨论长期探索、公共资助、科研评价和应用预期之间的合理关系。", focus: "原创探索、资源配置、评价周期与社会价值", discipline: ["理学类", "物理学", "基础科学政策"], status: "已结束", date: "2026-08-23", votes: 2486, participants: 1382, experts: [{ name: "陈嘉禾", title: "院士", institution: "理论科学中心" }, { name: "顾远", title: "教授", institution: "中国科学技术大学" }] },
  { id: "debate-economics-productivity", title: "人工智能带来的效率提升会转化为长期生产率吗？", summary: "讨论任务效率、组织流程、岗位结构与生产率统计之间的传导关系。", focus: "生产率测量、组织变革、岗位重构与技能升级", discipline: ["经济学类", "应用经济学", "数字经济"], status: "已结束", date: "2026-08-21", votes: 2324, participants: 1296, experts: [{ name: "宋妍", title: "教授", institution: "复旦大学" }, { name: "高屹", title: "首席经济学家", institution: "数字经济研究院" }] },
  { id: "debate-management-evaluation", title: "科研评价应如何平衡短期成果与长期价值？", summary: "从任务周期、成果质量、团队贡献和长期影响讨论科研评价机制。", focus: "评价周期、代表性成果、团队贡献与长期影响", discipline: ["管理学类", "公共管理", "科技管理"], status: "即将开始", date: "2026-09-05", votes: 2188, participants: 1264, experts: [{ name: "邵清", title: "研究员", institution: "科技治理研究中心" }, { name: "王澄", title: "教授", institution: "浙江大学" }, { name: "林岚", title: "项目主任", institution: "国家科技评估中心" }] },
  { id: "debate-agriculture-ai", title: "智能育种是否会改变传统田间试验的核心地位？", summary: "讨论算法筛选、环境适应性、田间验证和育种经验之间的互补关系。", focus: "智能筛选、田间验证、环境适应性与育种经验", discipline: ["农学类", "作物学", "智能育种"], status: "进行中", date: "2026-08-25", votes: 1976, participants: 1138, experts: [{ name: "何青", title: "研究员", institution: "现代农业研究中心" }, { name: "周雨澄", title: "教授", institution: "中国农业大学" }] },
  { id: "debate-philosophy-agency", title: "人工智能能否成为具有责任的行动主体？", summary: "从意图、因果控制、道德责任与制度安排讨论人工智能主体性的边界。", focus: "行动意图、责任归属、道德判断与制度治理", discipline: ["哲学类", "哲学", "科学技术哲学"], status: "已结束", date: "2026-08-19", votes: 1820, participants: 1026, experts: [{ name: "吴知行", title: "教授", institution: "中国人民大学" }, { name: "顾远", title: "研究员", institution: "智能伦理研究中心" }] },
  { id: "debate-history-digital", title: "数字工具会重塑科技史研究的方法边界吗？", summary: "讨论史料数字化、知识图谱和算法分析对科技史证据与叙事方式的影响。", focus: "史料考证、数字人文、知识关联与历史叙事", discipline: ["历史学类", "中国史", "科技史"], status: "已结束", date: "2026-08-17", votes: 1654, participants: 918, experts: [{ name: "赵启明", title: "教授", institution: "中国科学院大学" }, { name: "林悦", title: "副研究员", institution: "科技史研究所" }] },
  { id: "debate-literature-scifi", title: "科幻文学是在预测未来，还是在塑造未来？", summary: "讨论科幻叙事对技术想象、公共认知和科技创新文化的影响。", focus: "未来想象、科技传播、社会选择与文学表达", discipline: ["文学类", "中国语言文学", "科幻文学"], status: "已结束", date: "2026-08-15", votes: 1498, participants: 846, experts: [{ name: "叶清", title: "教授", institution: "北京师范大学" }, { name: "程星", title: "作家", institution: "科幻创作研究中心" }] },
];

type HotTopicComment = { id: string; author: string; content: string; publishedAt: string };
type HotTopic = {
  id: string;
  title: string;
  discipline: [string, string, string];
  summary: string;
  participants: number;
  commentCount: number;
  latestCommentAt: string;
  comments: HotTopicComment[];
};

const hotTopics: HotTopic[] = [
  { id: "hot-engineering-ai", title: "多模态模型下一阶段会出现哪些关键突破？", discipline: ["工学类", "计算机科学与技术", "人工智能"], summary: "围绕多模态理解、推理、工具使用和具身交互讨论下一阶段技术突破与工程评价方式。", participants: 2345, commentCount: 456, latestCommentAt: "2026-08-26 11:40", comments: [{ id: "ai-c1", author: "算法研究员", content: "下一阶段不仅要比较单项能力，更需要考察跨模态任务中的稳定推理和证据一致性。", publishedAt: "11分钟前" }, { id: "ai-c2", author: "产业工程师", content: "模型进入真实场景后，工具调用成功率和错误恢复能力会成为关键指标。", publishedAt: "26分钟前" }, { id: "ai-c3", author: "高校教师", content: "建议把具身交互与世界模型放到统一评测框架中持续观察。", publishedAt: "48分钟前" }] },
  { id: "hot-law-data", title: "科研数据开放共享应如何划定授权边界？", discipline: ["法学类", "法学", "数据权益与科技法"], summary: "讨论科研数据开放、个人信息保护、成果权益和跨机构共享中的授权范围与责任边界。", participants: 2180, commentCount: 421, latestCommentAt: "2026-08-26 11:15", comments: [{ id: "law-c1", author: "科技法研究者", content: "授权应同时说明使用目的、期限、再分发条件和退出机制，不能只依赖一次性同意。", publishedAt: "36分钟前" }, { id: "law-c2", author: "数据平台主管", content: "建议按公开、受控和敏感三个层级设计访问规则，并保留完整审计记录。", publishedAt: "1小时前" }] },
  { id: "hot-medicine-ai", title: "医学人工智能进入临床应用前还需要跨过哪些门槛？", discipline: ["医学类", "临床医学", "医学人工智能"], summary: "从多中心验证、数据偏差、临床责任和持续监测角度讨论医学人工智能的应用边界。", participants: 2056, commentCount: 398, latestCommentAt: "2026-08-26 10:50", comments: [{ id: "med-c1", author: "临床医生", content: "模型指标不能替代临床流程验证，需要明确适用人群、排除条件和人工复核节点。", publishedAt: "1小时前" }, { id: "med-c2", author: "医学数据研究员", content: "跨中心数据分布差异是必须长期监测的问题，部署后仍需要持续评价。", publishedAt: "2小时前" }, { id: "med-c3", author: "医疗产品经理", content: "产品说明中应清晰呈现模型版本、证据来源和已知限制。", publishedAt: "3小时前" }] },
  { id: "hot-economics-productivity", title: "生成式人工智能将如何改变知识工作生产率？", discipline: ["经济学类", "应用经济学", "数字经济"], summary: "讨论生成式人工智能对知识工作效率、岗位结构、组织协同和生产率统计方法的影响。", participants: 1880, commentCount: 347, latestCommentAt: "2026-08-25 21:30", comments: [{ id: "eco-c1", author: "数字经济研究者", content: "短期效率提升不等于长期生产率改善，还要观察组织流程是否同步变化。", publishedAt: "昨天 21:30" }, { id: "eco-c2", author: "企业研究员", content: "建议区分任务替代、能力增强和新增任务三类影响。", publishedAt: "昨天 20:48" }] },
  { id: "hot-education-generalist", title: "未来产业人才培养更需要通才还是专才？", discipline: ["教育学类", "教育学", "高等教育与人才培养"], summary: "围绕交叉基础、专业深度、项目实践和产业协同讨论未来产业人才培养模式。", participants: 1764, commentCount: 332, latestCommentAt: "2026-08-25 18:45", comments: [{ id: "edu-c1", author: "高校教师", content: "本科阶段应建立跨学科基础，进入项目后再形成面向问题的专业深度。", publishedAt: "昨天 18:45" }, { id: "edu-c2", author: "企业导师", content: "产业项目需要既理解系统又能负责关键技术模块的人才组合。", publishedAt: "昨天 17:20" }] },
  { id: "hot-management-research", title: "科研团队如何在长期探索与阶段交付之间取得平衡？", discipline: ["管理学类", "工商管理", "科技创新管理"], summary: "讨论目标设置、资源配置、里程碑管理和长期原创研究之间的协调机制。", participants: 1652, commentCount: 301, latestCommentAt: "2026-08-25 15:10", comments: [{ id: "mgmt-c1", author: "科研管理者", content: "阶段目标应验证关键假设，而不是把长期研究简单拆成短期成果数量。", publishedAt: "昨天 15:10" }, { id: "mgmt-c2", author: "实验室负责人", content: "需要为高风险方向保留稳定资源，同时建立清晰的复盘和调整机制。", publishedAt: "昨天 14:32" }] },
  { id: "hot-science-quantum", title: "量子计算的实用优势应以什么任务作为判断标准？", discipline: ["理学类", "物理学", "量子信息科学"], summary: "从问题规模、误差控制、经典基线和资源成本角度讨论量子实用优势的评价口径。", participants: 1538, commentCount: 286, latestCommentAt: "2026-08-24 19:20", comments: [{ id: "science-c1", author: "量子研究员", content: "比较必须包含完整的误差修正和数据加载成本，不能只看核心算法步骤。", publishedAt: "2天前" }, { id: "science-c2", author: "计算科学学者", content: "应优先选择经典算法基线清楚、任务价值明确的问题。", publishedAt: "2天前" }] },
  { id: "hot-agriculture-breeding", title: "智能育种平台应如何连接科研数据与田间验证？", discipline: ["农学类", "作物学", "智能育种"], summary: "讨论基因型、表型、环境数据与田间试验之间的数据贯通和验证闭环。", participants: 1396, commentCount: 248, latestCommentAt: "2026-08-24 16:10", comments: [{ id: "agri-c1", author: "作物育种专家", content: "数据平台必须保留试验设计、环境条件和采样批次，否则模型结果难以复现。", publishedAt: "2天前" }, { id: "agri-c2", author: "农业数据工程师", content: "田间反馈应成为下一轮模型训练和材料筛选的直接输入。", publishedAt: "2天前" }] },
  { id: "hot-philosophy-ai", title: "人工智能系统的解释何时才算真正可理解？", discipline: ["哲学类", "哲学", "科学技术哲学"], summary: "从因果解释、用户理解、责任归属和应用情境讨论人工智能可解释性的有效标准。", participants: 1288, commentCount: 226, latestCommentAt: "2026-08-23 20:25", comments: [{ id: "phil-c1", author: "科技哲学学者", content: "解释是否有效取决于使用者需要完成什么判断，而不是解释形式是否足够复杂。", publishedAt: "3天前" }, { id: "phil-c2", author: "模型评测研究员", content: "应分别评估机制解释、证据说明和决策可追溯性。", publishedAt: "3天前" }] },
  { id: "hot-history-archives", title: "数字人文如何重新组织科技史料的研究路径？", discipline: ["历史学类", "中国史", "科技史与数字人文"], summary: "讨论史料数字化、实体关联、时间线分析和算法辅助研究对科技史方法的影响。", participants: 1174, commentCount: 204, latestCommentAt: "2026-08-23 17:40", comments: [{ id: "history-c1", author: "科技史研究者", content: "数字工具应帮助发现史料关系，但不能替代对来源、语境和版本的考证。", publishedAt: "3天前" }, { id: "history-c2", author: "数字人文学者", content: "实体关系图谱最有价值的部分是让研究者回到原始材料继续核验。", publishedAt: "3天前" }] },
  { id: "hot-literature-science", title: "科幻文学如何影响公众对前沿科技的理解？", discipline: ["文学类", "中国语言文学", "科幻文学与科技传播"], summary: "讨论科幻叙事在技术想象、风险认知、科学传播和公共讨论中的作用。", participants: 1096, commentCount: 188, latestCommentAt: "2026-08-22 14:20", comments: [{ id: "literature-c1", author: "文学研究者", content: "科幻作品提供的是问题框架和价值想象，而不是技术发展的线性预言。", publishedAt: "4天前" }, { id: "literature-c2", author: "科学传播作者", content: "好的科技叙事需要同时呈现可能性、限制和社会选择。", publishedAt: "4天前" }] },
];

function topicHeatScore(topic: HotTopic) {
  const maxParticipants = Math.max(...hotTopics.map((item) => item.participants));
  const maxComments = Math.max(...hotTopics.map((item) => item.commentCount));
  const newestComment = Math.max(...hotTopics.map((item) => Date.parse(item.latestCommentAt)));
  const ageDays = Math.max(0, (newestComment - Date.parse(topic.latestCommentAt)) / 86400000);
  const recency = Math.max(0, 1 - ageDays / 30);
  return Math.round((topic.participants / maxParticipants * .45 + topic.commentCount / maxComments * .35 + recency * .2) * 100);
}

function topicDetailHref(topicId: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", "information-exchange");
  url.searchParams.set("topic", topicId);
  url.hash = "ie-topic-detail";
  return `${url.pathname}${url.search}${url.hash}`;
}

const informationLocatorItems = [
  { id: "ie-events", label: "赛事活动" },
  { id: "ie-debates", label: "思辨活动" },
  { id: "ie-hot", label: "热门活动" },
];

function MetricItem({ icon, label, value }: { icon: "calendar" | "expert" | "topic"; label: string; value: string }) {
  return (
    <div className="ie-metric-item">
      <img className="ie-metric-icon" src={`${assetRoot}/metric-${icon}.png`} alt="" />
      <span><small>{label}</small><strong>{value}</strong></span>
    </div>
  );
}

function MetaRow({ date, location }: { date: string; location: string }) {
  return (
    <div className="ie-meta-row">
      <span><img src={`${assetRoot}/event-time.svg`} alt="" />{date}</span>
      <span><img src={`${assetRoot}/event-location.svg`} alt="" />{location}</span>
    </div>
  );
}

function EventTagRow({ first, second }: { first: string; second: string }) {
  return <div className="ie-tags"><span className="fp-tag is-blue">{first}</span><span className="fp-tag">{second}</span></div>;
}

function EventVideoDialog({ event, onClose }: { event: (typeof eventRows)[number]; onClose: () => void }) {
  const [playing, setPlaying] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handleKeyDown = (keyboardEvent: globalThis.KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="ie-video-dialog-backdrop" role="presentation" onMouseDown={(mouseEvent) => { if (mouseEvent.target === mouseEvent.currentTarget) onClose(); }}>
      <section className="ie-video-dialog" role="dialog" aria-modal="true" aria-labelledby="ie-video-dialog-title">
        <header><div><span>赛事视频</span><h3 id="ie-video-dialog-title">{event.title}</h3></div><button ref={closeRef} type="button" aria-label="关闭视频弹窗" onClick={onClose}>×</button></header>
        <div className={`ie-video-player${playing ? " is-playing" : ""}`}>
          <img src={`${assetRoot}/${event.image}`} alt={`${event.title}视频封面`} />
          <span className="ie-video-player-badge">视频预览</span>
          <button className="ie-video-player-toggle" type="button" aria-label={playing ? "暂停视频预览" : "播放视频预览"} aria-pressed={playing} onClick={() => setPlaying((current) => !current)}><span><img src={`${assetRoot}/event-play.svg`} alt="" /></span></button>
          <div className="ie-video-player-controls" aria-hidden="true"><i><b /></i><span>{playing ? "00:24" : "00:00"} / 03:18</span><em>{playing ? "播放中" : "已暂停"}</em></div>
        </div>
        <footer><p>{event.summary}</p><button type="button" onClick={onClose}>关闭</button></footer>
      </section>
    </div>
  );
}

function EventsSection() {
  const [offset, setOffset] = useState(0);
  const [videoPreview, setVideoPreview] = useState<(typeof eventRows)[number] | null>(null);
  const visibleEvents = Array.from({ length: 3 }, (_, index) => eventRows[(offset + index) % eventRows.length]);
  const feature = visibleEvents[0];
  const eventState = (status: string) => status.includes("结束") ? "报名结束" : "报名中";
  const actionLabel = (status: string) => status.includes("结束") ? "报名结束" : "立即报名";
  return (
    <section id="ie-events" className="ie-section ie-events">
      <header className="ie-event-heading"><div><img src={`${assetRoot}/event-section-icon-figma.png`} alt="" /><span><h2>赛事活动</h2><p>科技赛事｜学术讲座｜专业沙龙｜行业会议</p></span></div><i aria-hidden="true" /></header>
      <div className="ie-events-grid">
        <article className="fp-card ie-event-feature">
          <div className="ie-event-image-wrap"><img className="ie-feature-image" src={`${assetRoot}/${feature.image}`} alt={feature.title} /><span className={feature.status.includes("结束") ? "is-ended" : ""}>{eventState(feature.status)}</span></div>
          <div className="ie-event-feature-copy"><div><h3>{feature.title}</h3><EventTagRow first="活动类型" second={feature.field} /></div><div><p>{feature.summary}</p><MetaRow date={feature.date} location={feature.location} /></div></div>
          <i className="ie-event-divider" />
          <button className={`ie-event-action${feature.status.includes("结束") ? " is-disabled" : ""}`} type="button" disabled={feature.status.includes("结束")}>{actionLabel(feature.status)}</button>
        </article>
        <div className="ie-event-side-list">
          {visibleEvents.slice(1).map((event, index) => { const isVideo = index === 0; return <article className={`fp-card ie-event-horizontal${isVideo ? " has-video" : ""}`} key={event.id}>
            <div className={`ie-event-thumb${isVideo ? " is-video" : ""}`}>
              <img className="ie-event-thumb-image" src={`${assetRoot}/${event.image}`} alt={event.title} />
              <b>{eventState(event.status)}</b>
              {isVideo ? <button className="ie-event-video-trigger" type="button" aria-label={`打开${event.title}视频弹窗`} aria-haspopup="dialog" onClick={() => setVideoPreview(event)}>
                <span className="ie-event-video-icon" aria-hidden="true"><img src={`${assetRoot}/event-play.svg`} alt="" /></span>
              </button> : null}
            </div>
            <div className="ie-event-horizontal-copy">
              <div className="ie-event-title-block"><h3>{event.title}</h3><EventTagRow first="活动类型" second={event.field} /></div>
              <div className="ie-event-detail-block"><p>{event.summary}</p><MetaRow date={event.date} location={event.location} /></div>
              <button className={`ie-event-action${event.status.includes("结束") ? " is-disabled" : ""}`} type="button" disabled={event.status.includes("结束")}>{actionLabel(event.status)}</button>
            </div>
          </article>; })}
        </div>
      </div>
      <button className="ie-more-link" type="button" onClick={() => { setVideoPreview(null); setOffset((value) => (value + 3) % eventRows.length); }}>查看更多</button>
      {videoPreview ? <EventVideoDialog event={videoPreview} onClose={() => setVideoPreview(null)} /> : null}
    </section>
  );
}

function ExpertStrip({ experts }: { experts: DebateExpert[] }) {
  return (
    <div className="ie-expert-strip">
      <strong>专家团</strong>
      <div className="ie-experts">
        {experts.slice(0, 3).map((expert, index) => (
          <span className="ie-expert" key={`${expert.name}-${expert.institution}-${index}`}>
            <img src={`${assetRoot}/debate-expert-avatar.png`} alt={`${expert.name}头像`} />
            <span><b>{expert.name}</b><em>｜{expert.title}</em><small>{expert.institution}</small></span>
          </span>
        ))}
      </div>
      <span className="ie-more-experts"><b>+4</b> 位专家</span>
    </div>
  );
}

function DebateSelect({
  label,
  value,
  options,
  onChange,
  className = "",
  chevron = "debate-chevron-down.svg",
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  className?: string;
  chevron?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowDown", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
    }
    if (event.key === "Escape") setOpen(false);
  };

  return (
    <div className={`ie-debate-select${className ? ` ${className}` : ""}${open ? " is-open" : ""}`} ref={rootRef}>
      <button
        ref={triggerRef}
        className="ie-debate-select-trigger"
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{options.find((option) => option.value === value)?.label ?? value}</span>
        <img src={`${assetRoot}/${chevron}`} alt="" />
      </button>
      {open ? <div className="ie-debate-select-menu" id={listboxId} role="listbox" aria-label={label}>
        {options.map((option) => <button
          className={option.value === value ? "is-selected" : ""}
          type="button"
          role="option"
          aria-selected={option.value === value}
          key={option.value}
          onClick={() => {
            onChange(option.value);
            setOpen(false);
            triggerRef.current?.focus();
          }}
        ><span>{option.label}</span><i aria-hidden="true">✓</i></button>)}
      </div> : null}
    </div>
  );
}

function DebateSection() {
  const [statusFilter, setStatusFilter] = useState<"全部状态" | DebateRow["status"]>("全部状态");
  const [expertFilter, setExpertFilter] = useState("全部专家");
  const [visibleCount, setVisibleCount] = useState(3);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const expertNames = useMemo(() => Array.from(new Set(debateRows.flatMap((row) => row.experts.map((expert) => expert.name)))), []);
  const filteredRows = useMemo(() => debateRows
    .filter((row) => statusFilter === "全部状态" || row.status === statusFilter)
    .filter((row) => expertFilter === "全部专家" || row.experts.some((expert) => expert.name === expertFilter))
    .sort((left, right) => (left.priority ?? 99) - (right.priority ?? 99) || right.date.localeCompare(left.date)), [expertFilter, statusFilter]);
  const visibleRows = filteredRows.slice(0, visibleCount);
  const toggleVote = (rowId: string) => setVotedIds((current) => { const next = new Set(current); if (next.has(rowId)) next.delete(rowId); else next.add(rowId); return next; });
  const displayStatus = (status: DebateRow["status"]) => status === "进行中" ? "策划中" : status === "即将开始" ? "待启动" : "已结束";
  const actionLabel = (row: DebateRow, voted: boolean) => row.status === "进行中" ? voted ? "已投票" : "话题投票" : row.status === "即将开始" ? "在线报名" : "专题讨论";
  return (
    <section id="ie-debates" className="ie-section ie-debates">
      <header className="ie-debate-heading">
        <div className="ie-debate-heading-copy">
          <img src={`${assetRoot}/debate-section-icon.png`} alt="" />
          <div><h2>思辨活动</h2><p>用户投票选题｜十一大学科分类｜领域专家观点</p></div>
        </div>
        <div className="ie-debate-filters">
          <DebateSelect label="思辨活动领域专家" value={expertFilter} options={[{ value: "全部专家", label: "全部专家" }, ...expertNames.map((name) => ({ value: name, label: name }))]} onChange={(value) => { setExpertFilter(value); setVisibleCount(3); }} />
          <DebateSelect label="思辨活动状态" value={statusFilter} options={[{ value: "全部状态", label: "全部状态" }, { value: "进行中", label: "策划中" }, { value: "即将开始", label: "待启动" }, { value: "已结束", label: "已结束" }]} onChange={(value) => { setStatusFilter(value as typeof statusFilter); setVisibleCount(3); }} />
        </div>
      </header>
      <div className="ie-debate-list">
        {visibleRows.length ? visibleRows.map((row) => { const voted = votedIds.has(row.id); return (
          <article className="fp-card ie-debate-card" data-status={row.status} key={row.id}>
            <div className="ie-debate-copy">
              <div className="ie-debate-title-row"><h3>{row.title}</h3><span className="ie-debate-status">{displayStatus(row.status)}</span></div>
              <dl className="ie-debate-info">
                <div><dt>主办单位</dt><dd>{row.organizer ?? "深圳国际科技信息中心"}</dd></div>
                <div><dt>活动时间</dt><dd>{row.date}</dd></div>
                <div><dt>参与人数</dt><dd>{row.participants.toLocaleString("zh-CN")}</dd></div>
              </dl>
              <button className={`ie-debate-action${voted ? " is-voted" : ""}`} type="button" aria-pressed={row.status === "进行中" ? voted : undefined} onClick={() => { if (row.status === "进行中") toggleVote(row.id); }}><span>{actionLabel(row, voted)}</span><img src={`${assetRoot}/debate-arrow-right.svg`} alt="" /></button>
            </div>
            <ExpertStrip experts={row.experts} />
          </article>
        ); }) : <div className="ie-debate-empty"><strong>没有匹配的近期思辨活动</strong><p>请调整领域专家或活动状态。</p><button type="button" onClick={() => { setExpertFilter("全部专家"); setStatusFilter("全部状态"); setVisibleCount(3); }}>清除筛选</button></div>}
      </div>
      {visibleCount < filteredRows.length ? <button className="ie-debate-load-more" type="button" onClick={() => setVisibleCount((count) => count + 3)}>加载更多</button> : null}
    </section>
  );
}

function topicViewCount(topic: HotTopic) {
  return topic.participants * 3 + topic.commentCount * 4;
}

function HotCard({ topic }: { topic: HotTopic }) {
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(new Set());
  const toggleCommentLike = (commentId: string) => setLikedCommentIds((current) => { const next = new Set(current); if (next.has(commentId)) next.delete(commentId); else next.add(commentId); return next; });
  const featuredComments = [...topic.comments];
  const fallbackComments = [
    { author: "领域研究者", content: "建议同时呈现关键证据、适用边界和仍需验证的问题，便于社区形成更有效的讨论。", publishedAt: "1小时前" },
    { author: "产业观察员", content: "除了关注技术能力，也需要持续评估真实场景中的稳定性、成本与协作方式。", publishedAt: "2小时前" },
    { author: "社区用户", content: "期待后续补充更多实践案例和可复核的数据，让不同观点能够在同一证据基础上比较。", publishedAt: "3小时前" },
  ];
  while (featuredComments.length < 3) {
    const fallback = fallbackComments[featuredComments.length] ?? fallbackComments[0];
    featuredComments.push({ id: `${topic.id}-featured-${featuredComments.length}`, ...fallback });
  }
  return (
    <article className="fp-card ie-hot-card">
      <div className="ie-hot-overview">
        <div className="ie-hot-title-block">
          <h3><a href={topicDetailHref(topic.id)}>{topic.title}</a></h3>
          <p>{topic.summary}</p>
        </div>
        <div className="ie-hot-facts">
          <div className="ie-tags"><span className="fp-tag is-blue">{topic.discipline[0].replace(/类$/, "")}</span><span className="fp-tag">{topic.discipline[1]}</span><span className="fp-tag">{topic.discipline[2]}</span></div>
          <div className="ie-hot-meta">
            <span><img src={`${assetRoot}/hot-participants.svg`} alt="" />{topic.participants.toLocaleString("zh-CN")} 人参与</span><i>｜</i>
            <span><img src={`${assetRoot}/hot-views.svg`} alt="" />{topicViewCount(topic).toLocaleString("zh-CN")} 浏览</span><i>｜</i>
            <span><img src={`${assetRoot}/hot-comments.svg`} alt="" />{topic.commentCount.toLocaleString("zh-CN")} 评论</span>
          </div>
        </div>
      </div>
      <div className="ie-hot-discussion">
        <i className="ie-hot-divider" />
        <h4><i />精选评论</h4>
        <div className="ie-hot-comment-list">
          {featuredComments.slice(0, 3).map((comment, index) => { const liked = likedCommentIds.has(comment.id); const likeCount = Math.max(32, Math.round(topic.participants * (.14 - index * .025))) + (liked ? 1 : 0); return <div className="ie-hot-comment" key={comment.id}>
            <p>{comment.content}</p>
            <div className="ie-hot-comment-footer">
              <span><img src={`${assetRoot}/hot-comment-avatar-figma.png`} alt="" /><b>{comment.author}</b><small>｜</small><small>{comment.publishedAt}</small></span>
              <button type="button" className={liked ? "is-liked" : ""} aria-pressed={liked} onClick={() => toggleCommentLike(comment.id)}><img src={`${assetRoot}/hot-like.svg`} alt="" />{likeCount.toLocaleString("zh-CN")} 点赞</button>
            </div>
          </div>; })}
        </div>
      </div>
    </article>
  );
}

function HotSection() {
  const [field, setField] = useState("全部学科");
  const [visibleCount, setVisibleCount] = useState(3);
  const filteredRows = useMemo(() => hotTopics.filter((topic) => field === "全部学科" || topic.discipline[0] === field), [field]);
  const rows = filteredRows.slice(0, visibleCount);
  const fieldOptions = [{ value: "全部学科", label: "全部学科领域" }, ...Array.from(new Set(hotTopics.map((topic) => topic.discipline[0]))).map((value) => ({ value, label: value }))];
  return (
    <section id="ie-hot" className="ie-section ie-hot">
      <header className="ie-hot-heading">
        <div className="ie-hot-heading-copy"><span className="ie-hot-heading-icon"><img src={`${assetRoot}/hot-section-icon-figma.png`} alt="" /></span><div><h2>热门活动</h2><p>社区热点话题｜用户讨论｜最新评论</p></div></div>
        <DebateSelect className="ie-hot-field-select" chevron="hot-select-arrow.svg" label="热门话题所属学科" value={field} options={fieldOptions} onChange={(value) => { setField(value); setVisibleCount(3); }} />
      </header>
      <div className="ie-hot-list">{rows.map((topic) => <HotCard topic={topic} key={topic.id} />)}</div>
      {visibleCount < filteredRows.length ? <button className="ie-hot-load-more" type="button" onClick={() => setVisibleCount((count) => count + 3)}>加载更多</button> : null}
    </section>
  );
}

function topicListHref() {
  const url = new URL(window.location.href);
  url.searchParams.set("page", "information-exchange");
  url.searchParams.delete("topic");
  url.hash = "ie-hot";
  return `${url.pathname}${url.search}${url.hash}`;
}

function TopicDetailPage({ topic }: { topic: HotTopic }) {
  return <main className="ie-page ie-topic-detail-page">
    <PortalHeader currentPage="information-exchange" />
    <section id="ie-topic-detail" className="ie-topic-detail-shell">
      <a className="ie-topic-back" href={topicListHref()}><ChevronLeft size={16} aria-hidden="true" />返回热门话题</a>
      <article className="fp-card ie-topic-detail-panel">
        <header><div className="ie-tags"><span className="fp-tag is-blue">{topic.discipline[0]}</span><span className="fp-tag">{topic.discipline[1]}</span><span className="fp-tag">{topic.discipline[2]}</span></div><h1>{topic.title}</h1><p>{topic.summary}</p></header>
        <dl><div><dt>参与人数</dt><dd>{topic.participants.toLocaleString("zh-CN")} 人</dd></div><div><dt>评论总数</dt><dd>{topic.commentCount.toLocaleString("zh-CN")} 条</dd></div><div><dt>最新评论时间</dt><dd>{topic.latestCommentAt}</dd></div><div><dt>综合热度</dt><dd>{topicHeatScore(topic)}</dd></div></dl>
        <section><h2>话题简介</h2><p>{topic.summary} 社区围绕核心问题、实践案例与影响边界展开讨论，相关观点按评论规范审核后展示。</p></section>
        <section><h2>最新评论</h2><div className="ie-topic-detail-comments">{topic.comments.map((comment) => <article key={comment.id}><p>{comment.content}</p><span><img src={`${assetRoot}/expert-avatar.png`} alt="" /><b>{comment.author}</b><small>{comment.publishedAt}</small></span></article>)}</div></section>
      </article>
    </section>
  </main>;
}

export default function InformationExchangePage() {
  const topicId = new URL(window.location.href).searchParams.get("topic");
  const selectedTopic = hotTopics.find((topic) => topic.id === topicId);
  if (selectedTopic) return <TopicDetailPage topic={selectedTopic} />;
  return (
    <main className="ie-page">
      <PortalHeader currentPage="information-exchange" />
      <section id="ie-top" className="ie-hero-stage">
        <img
          className="ie-hero-art"
          src={`${assetRoot}/hero-background.png`}
          alt="科技信息交流：汇聚科技赛事、专家思辨与热门交流活动，打造开放共享的科技交流平台。"
        />
        <div className="ie-metrics">
          <MetricItem icon="calendar" label="累计活动数量" value="3,462" />
          <MetricItem icon="expert" label="参与专家数量" value="2,000,000" />
          <MetricItem icon="topic" label="交流话题数量" value="64,749,912" />
        </div>
      </section>

      <div className="fp-locator-stage">
        <div className="ie-content">
          <EventsSection />
          <DebateSection />
          <HotSection />
        </div>
        <PageSectionLocator items={informationLocatorItems} topId="ie-top" label="内容定位" />
      </div>
    </main>
  );
}
