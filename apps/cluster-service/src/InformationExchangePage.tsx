import {
  ArrowDownUp,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  MessageCircle,
  Play,
  ThumbsUp,
  Users,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import PageSectionLocator from "./PageSectionLocator";
import PortalHeader from "./PortalHeader";
import "./information-exchange.css";

const assetRoot = "./assets/figma-information-exchange";

const eventRows = [
  { id: "event-1", title: "2026深圳国际AI创新大赛", type: "赛事", field: "人工智能", summary: "面向全球征集人工智能创新应用项目，聚焦技术验证、产业场景与成果转化。", date: "2026-04-15 至 2026-06-30", location: "深圳市南山区科技园", image: "event-ai-competition.png", status: "报名进行中" },
  { id: "event-2", title: "AI大模型技术与行业应用实践", type: "讲座", field: "人工智能", summary: "围绕模型工程、行业数据治理与智能体应用进行案例讲解和实践交流。", date: "2026-05-22", location: "深圳市福田区", image: "event-ai-practice.png", status: "开放预约" },
  { id: "event-3", title: "数字化转型与企业创新发展沙龙", type: "沙龙", field: "数字化转型", summary: "邀请科研机构、企业与投资机构共同讨论数字化创新路径。", date: "2026-05-08", location: "上海市", image: "event-digital-salon.png", status: "活动结束" },
  { id: "event-4", title: "量子信息产业协同论坛", type: "会议", field: "量子信息", summary: "讨论量子计算、量子通信与测量技术的协同创新和应用机会。", date: "2026-06-18", location: "合肥市", image: "event-ai-competition.png", status: "开放预约" },
  { id: "event-5", title: "合成生物青年学者交流会", type: "沙龙", field: "合成生物", summary: "面向青年科研人员组织研究进展分享与跨机构合作交流。", date: "2026-07-03", location: "深圳市光明区", image: "event-ai-practice.png", status: "即将开放" },
];

const debateRows = [
  { id: "debate-1", title: "大语言模型是否会取代传统软件开发？", status: "进行中", extra: "+4", active: true, participants: 2345 },
  { id: "debate-2", title: "具身智能会优先在哪些产业规模落地？", status: "即将开始", extra: "+1", active: false, participants: 1680 },
  { id: "debate-3", title: "科研评价应如何平衡短期成果与长期价值？", status: "即将开始", extra: "+2", active: false, participants: 1264 },
];

const hotTopics = [
  { id: "hot-1", title: "多模态模型下一阶段会出现哪些关键突破？", field: "人工智能", participants: 2345, views: 8967, comments: 456, date: "2026-08-16" },
  { id: "hot-2", title: "科研数据开放共享应如何划定授权边界？", field: "科研数据", participants: 1982, views: 7420, comments: 382, date: "2026-08-15" },
  { id: "hot-3", title: "未来产业的人才培养更需要通才还是专才？", field: "人才发展", participants: 1638, views: 6150, comments: 318, date: "2026-08-14" },
];

const informationLocatorItems = [
  { id: "ie-events", label: "赛事活动" },
  { id: "ie-debates", label: "思辨活动" },
  { id: "ie-hot", label: "热门活动" },
];

function SectionHeading({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <header className="fp-section-heading">
      <img src={`${assetRoot}/${icon}`} alt="" />
      <div className="fp-section-heading-copy">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {children ? <div className="fp-section-heading-actions">{children}</div> : null}
    </header>
  );
}

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
      <span><CalendarDays size={14} />{date}</span>
      <span><MapPin size={14} />{location}</span>
    </div>
  );
}

function EventTagRow({ first, second }: { first: string; second: string }) {
  return <div className="ie-tags"><span className="fp-tag is-blue">{first}</span><span className="fp-tag">{second}</span></div>;
}

function EventsSection() {
  const [offset, setOffset] = useState(0);
  const [selectedEventId, setSelectedEventId] = useState(eventRows[0].id);
  const visibleEvents = Array.from({ length: 3 }, (_, index) => eventRows[(offset + index) % eventRows.length]);
  const selectedEvent = eventRows.find((item) => item.id === selectedEventId) ?? visibleEvents[0];
  const feature = visibleEvents[0];
  return (
    <section id="ie-events" className="ie-section ie-events">
      <SectionHeading icon="section-events.png" title="赛事活动" subtitle="科技赛事｜学术讲座｜专业沙龙｜行业会议">
        <button className="ie-circle-control" type="button" onClick={() => setOffset((value) => (value - 1 + eventRows.length) % eventRows.length)} aria-label="上一组赛事活动"><ChevronLeft size={20} /></button>
        <button className="ie-circle-control" type="button" onClick={() => setOffset((value) => (value + 1) % eventRows.length)} aria-label="下一组赛事活动"><ChevronRight size={20} /></button>
      </SectionHeading>
      <div className="ie-events-grid">
        <article className="fp-card ie-event-feature">
          <img className="ie-feature-image" src={`${assetRoot}/${feature.image}`} alt={feature.title} />
          <h3>{feature.title}</h3>
          <EventTagRow first={feature.type} second={feature.field} />
          <p>{feature.summary}</p>
          <MetaRow date={feature.date} location={feature.location} />
          <button className="ie-event-action" type="button" onClick={() => setSelectedEventId(feature.id)}>查看活动</button>
        </article>
        <div className="ie-event-side-list">
          {visibleEvents.slice(1).map((event, index) => <article className="fp-card ie-event-horizontal" key={event.id}>
            <div className={`ie-event-thumb${index === 0 ? " is-video" : ""}`}>
              <img src={`${assetRoot}/${event.image}`} alt={event.title} />
              {index === 0 ? <span aria-hidden="true"><Play size={24} fill="currentColor" /></span> : null}
            </div>
            <div className="ie-event-horizontal-copy">
              <h3>{event.title}</h3>
              <EventTagRow first={event.type} second={event.field} />
              <p>{event.summary}</p>
              <MetaRow date={event.date} location={event.location} />
              <button className="ie-event-action" type="button" onClick={() => setSelectedEventId(event.id)}>查看活动</button>
            </div>
          </article>)}
        </div>
      </div>
      <div className="ie-event-detail" aria-live="polite"><div><small>当前活动</small><strong>{selectedEvent.title}</strong><span>{selectedEvent.date} · {selectedEvent.location}</span></div><p>{selectedEvent.summary}</p><b>{selectedEvent.status}</b></div>
      <button className="ie-more-link" type="button" onClick={() => setOffset((value) => (value + 3) % eventRows.length)}>换一组活动</button>
    </section>
  );
}

function ExpertStrip({ extra }: { extra: string }) {
  return (
    <div className="ie-expert-strip">
      <strong>参与专家</strong>
      <div className="ie-experts">
        {[1, 2, 3].map((item) => (
          <span className="ie-expert" key={item}>
            <img src={`${assetRoot}/expert-avatar.png`} alt="张伟教授" />
            <span><b>张伟</b><em>｜教授</em><small>清华大学</small></span>
          </span>
        ))}
      </div>
      <span className="ie-more-experts"><b>{extra}</b> 位专家</span>
    </div>
  );
}

function DebateSection() {
  const [filter, setFilter] = useState<"all" | "live" | "upcoming">("all");
  const [expandedId, setExpandedId] = useState<string | null>(debateRows[0].id);
  const visibleRows = debateRows.filter((row) => filter === "all" || (filter === "live" ? row.active : !row.active));
  return (
    <section id="ie-debates" className="ie-section ie-debates">
      <SectionHeading icon="section-debate.png" title="思辨活动" subtitle="学术思辨交流｜专家观点｜前沿话题讨论">
        <label className="ie-select"><select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} aria-label="思辨活动状态"><option value="all">全部状态</option><option value="live">进行中</option><option value="upcoming">即将开始</option></select></label>
      </SectionHeading>
      <div className="ie-debate-list">
        {visibleRows.map((row) => (
          <article className={`fp-card ie-debate-card${expandedId === row.id ? " is-expanded" : ""}`} key={row.id}>
            <div className="ie-debate-copy">
              <h3>{row.title}</h3>
              <p>探讨大语言模型等AI技术软件开发范式的影响，分析技术趋势、产业变革与人才发展新机遇</p>
              <div className="ie-tags"><span className="fp-tag is-blue">工学</span><span className="fp-tag">计算机科学</span><span className="fp-tag">人工智能</span></div>
              <div className="ie-debate-meta"><span><CalendarDays size={14} />2026-03-15</span><i /><span><Users size={14} />{row.participants.toLocaleString("zh-CN")} 人参与</span><i /><span><Eye size={14} />8,967 浏览</span><i /><span><MessageCircle size={14} />456 评论</span></div>
            </div>
            <ExpertStrip extra={row.extra} />
            <div className="ie-debate-state"><span className={row.active ? "is-live" : ""}>{row.status}</span><button type="button" aria-expanded={expandedId === row.id} onClick={() => setExpandedId((current) => current === row.id ? null : row.id)}>{expandedId === row.id ? "收起详情" : "查看详情"}</button></div>
            {expandedId === row.id ? <div className="ie-debate-detail"><strong>讨论焦点</strong><span>技术边界、产业影响、人才结构与治理规则</span><p>当前展示议题介绍、参与专家与交流数据。用户可通过状态筛选快速定位正在进行或即将开始的活动。</p></div> : null}
          </article>
        ))}
      </div>
      <p className="ie-list-summary" role="status">当前显示 {visibleRows.length} 场思辨活动</p>
    </section>
  );
}

function HotCard({ topic }: { topic: (typeof hotTopics)[number] }) {
  const [liked, setLiked] = useState(false);
  return (
    <article className="fp-card ie-hot-card">
      <header>
        <div>
          <h3>{topic.title}</h3>
          <p>围绕前沿趋势、实践路径与影响边界展开讨论，汇集专家观点和社区反馈。</p>
          <div className="ie-tags"><span className="fp-tag is-blue">{topic.field}</span><span className="fp-tag">前沿讨论</span><span className="fp-tag">科技交流</span></div>
        </div>
        <div className="ie-hot-meta"><span><Users size={14} />{topic.participants.toLocaleString("zh-CN")} 人参与</span><i /><span><Eye size={14} />{topic.views.toLocaleString("zh-CN")} 浏览</span><i /><span><MessageCircle size={14} />{topic.comments} 评论</span></div>
      </header>
      <div className="ie-comments-title">精选评论</div>
      <div className="ie-comment-list">
        {[1, 2, 3].map((item) => <div className="ie-comment" key={item}>
          <p>期待推理能力的提升，希望能更好地解决复杂逻辑问题</p>
          <span><img src={`${assetRoot}/expert-avatar.png`} alt="" /><b>技术极客</b><small>｜2分钟前</small></span>
          <button type="button" className={liked ? "is-liked" : ""} aria-pressed={liked} onClick={() => setLiked((value) => !value)}><ThumbsUp size={13} />{liked ? "已点赞" : "点赞"}</button>
        </div>)}
      </div>
    </article>
  );
}

function HotSection() {
  const [field, setField] = useState("全部");
  const [sort, setSort] = useState<"hot" | "latest">("hot");
  const [visibleCount, setVisibleCount] = useState(2);
  const rows = useMemo(() => hotTopics
    .filter((topic) => field === "全部" || topic.field === field)
    .sort((left, right) => sort === "hot" ? right.participants - left.participants : right.date.localeCompare(left.date)), [field, sort]);
  const visibleRows = rows.slice(0, visibleCount);
  return (
    <section id="ie-hot" className="ie-section ie-hot">
      <SectionHeading icon="section-hot.png" title="热门活动" subtitle="社区热点话题｜用户讨论｜最新评论">
        <label className="ie-select"><select value={field} onChange={(event) => { setField(event.target.value); setVisibleCount(2); }} aria-label="热门活动领域"><option>全部</option>{Array.from(new Set(hotTopics.map((topic) => topic.field))).map((value) => <option key={value}>{value}</option>)}</select></label>
        <label className="ie-select ie-sort-select"><ArrowDownUp size={15} aria-hidden="true" /><select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} aria-label="热门活动排序"><option value="hot">按热度</option><option value="latest">按时间</option></select></label>
      </SectionHeading>
      <div className="ie-hot-list">{visibleRows.map((topic) => <HotCard topic={topic} key={topic.id} />)}</div>
      {visibleCount < rows.length ? <button className="ie-more-link" type="button" onClick={() => setVisibleCount(rows.length)}>加载更多</button> : <p className="ie-list-summary" role="status">已显示全部 {rows.length} 个热门话题</p>}
    </section>
  );
}

export default function InformationExchangePage() {
  return (
    <main className="ie-page">
      <PortalHeader currentPage="information-exchange" />
      <section id="ie-top" className="ie-hero-stage">
        <img className="ie-hero-art" src={`${assetRoot}/hero-background.png`} alt="" />
        <div className="ie-hero-copy">
          <h1>科技信息交流</h1>
          <p>汇聚科技赛事、专家思辨与热门交流活动<br />打造开放共享的科技交流平台。</p>
          <button className="ie-topic-cta" type="button" onClick={() => document.getElementById("ie-hot")?.scrollIntoView({ behavior: "smooth" })}>参与热门话题</button>
        </div>
        <div className="ie-metrics">
          <MetricItem icon="calendar" label="累计活动数量" value="3,462" />
          <MetricItem icon="expert" label="参与专家数量" value="2,000,000" />
          <MetricItem icon="topic" label="交流话题数量" value="64,749,912" />
        </div>
      </section>

      <div className="ie-content">
        <EventsSection />
        <DebateSection />
        <HotSection />
      </div>

      <PageSectionLocator items={informationLocatorItems} topId="ie-top" label="内容定位" />
    </main>
  );
}
