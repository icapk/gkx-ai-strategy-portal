(function (root) {
  "use strict";

  // Authored sample data for inspecting search presentation. No record below
  // describes a verified publication, person, institution, event or live service.
  const fixtureSource = "LOCAL_PROTOTYPE";
  const source = "AI 原型示例库";
  const common = { fixtureSource, executionKind: "LOCAL_MOCK", source, detailUrl: null, accessible: true };
  const records = [];

  const papers = [
    {
      title: "AI 科研智能体的证据检索与核对方法（示例）",
      abstract: "讨论 AI 科研智能体如何组织文献检索、来源记录与结论核对，形成可追溯的研究工作流程。",
      authors: [{ name: "示例作者甲" }, { name: "示例作者乙" }],
      source: "AI 原型示例期刊 A", publishedAt: "2026-10-08", domainTags: ["人工智能", "科研智能体"], tags: ["AI", "证据检索", "可追溯性"]
    },
    {
      title: "AI 多模态模型在材料分析中的应用观察（示例）",
      abstract: "以 AI 多模态材料分析为主题，比较图像、文本和结构化资料的组织方式与核对流程。",
      authors: [{ name: "示例作者丙" }], source: "AI 原型示例期刊 B", publishedAt: "2025-06-16",
      domainTags: ["人工智能", "先进材料"], tags: ["AI", "多模态", "材料分析"]
    },
    {
      title: "AI 药物发现中的知识图谱与候选排序（示例）",
      abstract: "围绕 AI 药物发现的资料整合与候选排序，介绍知识图谱、证据检索和人工复核的衔接方式。",
      authors: [{ name: "示例作者甲" }, { name: "示例作者丁" }], source: "AI 原型示例期刊 C", publishedAt: "2024-09-20",
      domainTags: ["人工智能", "生命科学"], tags: ["AI", "知识图谱", "药物发现"]
    }
  ];
  papers.forEach((item, index) => records.push({ ...common, type: "论文", id: `ai-demo-paper-${index + 1}`, ...item }));

  const patents = [
    {
      title: "一种 AI 科研文献证据关联方法（示例）",
      abstract: "提供一种 AI 科研资料关联的示例方案，将检索词、来源片段与核对记录组织为可追踪的证据链。",
      ipc: ["G06F"], applicant: ["AI 示例研究机构甲"], inventor: ["示例发明人甲", "示例发明人乙"],
      applicationDate: "2025-11-12", publicationDate: "2026-10-12", domainTags: ["人工智能", "信息检索"], tags: ["AI", "证据关联"]
    },
    {
      title: "一种 AI 多模态材料图像分析装置（示例）",
      abstract: "围绕 AI 材料图像分析，展示图像特征、文本说明与结构化实验记录的关联处理思路。",
      ipc: ["G06V"], applicant: ["AI 示例材料实验室"], inventor: ["示例发明人丙"],
      applicationDate: "2025-04-18", publicationDate: "2026-06-26", domainTags: ["人工智能", "先进材料"], tags: ["AI", "多模态分析"]
    },
    {
      title: "一种 AI 药物靶点候选排序方法（示例）",
      abstract: "以 AI 药物靶点候选排序为场景，展示多来源生物医学资料的召回、解释和核对流程。",
      ipc: ["G16B"], applicant: ["AI 示例生命科学中心"], inventor: ["示例发明人丁", "示例发明人乙"],
      applicationDate: "2024-08-09", publicationDate: "2025-12-19", domainTags: ["人工智能", "生命科学"], tags: ["AI", "药物靶点"]
    }
  ];
  patents.forEach((item, index) => records.push({ ...common, type: "专利", id: `ai-demo-patent-${index + 1}`, ...item, summary: item.abstract }));

  function reportDocument(record, chapters) {
    const documentId = `${record.id}-document`;
    return {
      documentId, documentVersion: "ai-demo-20261030-v1", resourceId: record.id,
      title: record.title, sourceKind: fixtureSource, access: "PUBLIC_DEMO",
      notice: "AI 搜索效果演示用示例正文，非真实报告全文；页码仅对应本示例文档。",
      pageCount: chapters.length,
      pages: chapters.map(([heading, paragraphs], pageIndex) => ({
        pageNumber: pageIndex + 1, heading,
        paragraphs: paragraphs.map((text, paragraphIndex) => ({ paragraphId: `${documentId}-p${pageIndex + 1}-${paragraphIndex + 1}`, text }))
      }))
    };
  }
  const reports = [
    {
      title: "AI 科研创新技术研究报告（示例）", reportType: "1", uploadedAt: "2026-10-21",
      summary: "梳理 AI 科研智能体、多模态模型与知识检索的研究主题，并记录各方向的资料来源和待核对问题。",
      domainTags: ["人工智能", "科技研究"],
      chapters: [
        ["研究范围与资料组织", ["AI 科研创新研究按技术主题、资料来源和使用场景组织内容，便于读者比较不同方向的信息。", "研究资料中的结论应保留原始出处，相关术语与来源片段分开记录。"]],
        ["证据核对与后续研究", ["AI 科研智能体的结果需要结合来源资料逐项核对，关键结论应能回到对应的证据位置。", "研究过程中发现的分歧和资料缺口应进入后续核对清单，获得新证据后再调整判断。"]]
      ]
    },
    {
      title: "AI 科研应用趋势洞察报告（示例）", reportType: "2", uploadedAt: "2026-10-23",
      summary: "围绕 AI 在资料整理、研究辅助与实验记录中的应用，观察任务流程、使用反馈及后续改进问题。",
      domainTags: ["人工智能", "科研应用"],
      chapters: [
        ["应用观察的任务范围", ["AI 科研应用可以从资料整理、信息检索和实验记录等任务开始观察，记录每项任务的输入与输出。", "不同研究任务的资料范围与核对方式不同，使用反馈应保留具体任务背景。"]],
        ["使用反馈与可追溯性", ["AI 辅助生成的归纳内容应关联原始资料，可追溯性需要通过具体来源和内容位置核对。", "后续观察将使用问题、资料缺口和待核对结论汇成清单，形成持续更新的研究记录。"]]
      ]
    },
    {
      title: "AI 产业布局战略咨询报告（示例）", reportType: "3", uploadedAt: "2026-10-25",
      summary: "以 AI 产业布局为主题，结合技术链、人才资源与应用场景资料，形成可供比较的观察维度和行动条件。",
      domainTags: ["人工智能", "战略咨询"],
      chapters: [
        ["布局议题与分析维度", ["AI 产业布局分析从技术链、人才资源、供给条件和应用场景等维度组织资料。", "每个观察维度分别记录已有证据与待确认问题，使不同布局方向具备可比较的依据。"]],
        ["行动条件与持续跟踪", ["AI 相关行动建议需要对应具体目标和可用资源，尚未确认的条件应在执行前继续核对。", "持续跟踪按信息日期保存历次判断与修订依据，避免把早期观察直接等同于最终结论。"]]
      ]
    }
  ];
  reports.forEach(({ chapters, ...item }, index) => {
    const record = { ...common, type: "报告", id: `ai-demo-report-${index + 1}`, ...item };
    record.document = reportDocument(record, chapters);
    records.push(record);
  });

  const scholars = [
    { name: "示例研究员甲（示例）", institution: "AI 示例科研机构甲", researchDirections: ["AI 科研智能体", "证据检索"], researchFields: ["人工智能", "信息检索"], hIndex: 12, paperCount: 24, citationCount: 360 },
    { name: "示例研究员乙（示例）", institution: "AI 示例材料实验室", researchDirections: ["AI 多模态材料分析", "材料知识组织"], researchFields: ["人工智能", "先进材料"], hIndex: 8, paperCount: 16, citationCount: 180 },
    { name: "示例研究员丙（示例）", institution: "AI 示例生命科学中心", researchDirections: ["AI 药物发现", "生物医学知识图谱"], researchFields: ["人工智能", "生命科学"], hIndex: 15, paperCount: 32, citationCount: 520 }
  ];
  scholars.forEach((item, index) => records.push({ ...common, type: "人才", id: `ai-demo-scholar-${index + 1}`, title: item.name, ...item }));

  const news = [
    { title: "AI 科研工具与资料检索专题更新（示例）", summary: "汇集 AI 科研资料整理、证据检索和研究记录相关的示例主题，展示资讯摘要与来源信息。", publishedAt: "2026-10-28", source: "AI 示例资讯频道甲", domainTags: ["人工智能", "科研工具"] },
    { title: "AI 多模态材料研究观察简讯（示例）", summary: "围绕 AI 多模态材料研究，整理图像分析、文本资料和实验记录关联的观察线索。", publishedAt: "2026-10-24", source: "AI 示例资讯频道乙", domainTags: ["人工智能", "先进材料"] },
    { title: "AI 生物医学知识检索专题动态（示例）", summary: "以 AI 生物医学知识检索为主题，介绍资料来源、主题词和证据核对清单的组织方式。", publishedAt: "2026-10-20", source: "AI 示例资讯频道丙", domainTags: ["人工智能", "生命科学"] }
  ];
  news.forEach((item, index) => records.push({ ...common, type: "资讯", id: `ai-demo-news-${index + 1}`, ...item }));

  const conferences = [
    { name: "AI 科研智能体学术交流会（示例）", fullNameEn: "AI Research Agents Conference Demo", location: "线上会场（示例）", level: "国际", startAt: "2026-11-18T09:00:00+08:00", endAt: "2026-11-19T17:00:00+08:00", submissionStatus: "OPEN", submissionDeadline: "2026-11-05T18:00:00+08:00", status: "UPCOMING", tags: ["AI", "科研智能体"] },
    { name: "AI 多模态材料分析研讨会（示例）", fullNameEn: "AI Multimodal Materials Symposium Demo", location: "材料研究示例会场", level: "国内", startAt: "2026-11-06T09:30:00+08:00", endAt: "2026-11-06T17:30:00+08:00", submissionStatus: "CLOSED", submissionDeadline: "2026-10-20T18:00:00+08:00", status: "UPCOMING", tags: ["AI", "先进材料"] },
    { name: "AI 生物医学知识图谱会议（示例）", fullNameEn: "AI Biomedical Knowledge Conference Demo", location: "生命科学示例会场", level: "国际", startAt: "2026-10-12T09:00:00+08:00", endAt: "2026-10-13T17:00:00+08:00", submissionStatus: "UNKNOWN", submissionDeadline: null, status: "ENDED", tags: ["AI", "知识图谱"] }
  ];
  conferences.forEach((item, index) => records.push({ ...common, type: "会议", id: `ai-demo-conference-${index + 1}`, title: item.name, ...item }));

  const courses = [
    { name: "AI 科研检索与证据核对入门（示例）", summary: "以 AI 科研检索任务为例，学习资料组织、检索表达与证据核对的基本方法。", lecturers: [{ name: "示例讲师甲" }], institution: "AI 示例教学机构甲", level: "入门", durationText: "4 课时（示例）", publishedAt: "2026-10-16", domainTags: ["人工智能", "信息检索"] },
    { name: "AI 多模态材料分析实践（示例）", summary: "围绕 AI 多模态材料分析，练习图像、文本和结构化记录的关联整理。", lecturers: [{ name: "示例讲师乙" }], institution: "AI 示例教学机构乙", level: "进阶", durationText: "8 课时（示例）", publishedAt: "2026-10-18", domainTags: ["人工智能", "先进材料"] },
    { name: "AI 药物发现知识图谱课程（示例）", summary: "通过 AI 药物发现的示例任务，学习知识图谱资料整合、候选解释和人工核对。", lecturers: [{ name: "示例讲师丙" }, { name: "示例讲师甲" }], institution: "AI 示例教学机构丙", level: "进阶", durationText: "6 课时（示例）", publishedAt: "2026-10-22", domainTags: ["人工智能", "生命科学"] }
  ];
  courses.forEach((item, index) => records.push({ ...common, type: "课程", id: `ai-demo-course-${index + 1}`, title: item.name, ...item }));

  const activities = [
    { name: "AI 科研智能体专题讲座（示例）", summary: "围绕 AI 科研智能体的检索、记录与证据核对，开展研究方法交流。", organizer: "AI 示例交流中心甲", location: "线上活动室（示例）", startAt: "2026-11-10T14:00:00+08:00", endAt: "2026-11-10T16:00:00+08:00", activityType: "LECTURE", registrationStatus: "OPEN", domainTags: ["人工智能"], topicTags: ["AI", "科研智能体"] },
    { name: "AI 多模态材料研究论坛（示例）", summary: "以 AI 材料研究资料为主题，交流多模态分析任务中的来源核对与过程记录。", organizer: "AI 示例交流中心乙", location: "材料研究示例会场", startAt: "2026-11-20T09:00:00+08:00", endAt: "2026-11-20T17:00:00+08:00", activityType: "FORUM", registrationStatus: "NOT_STARTED", domainTags: ["人工智能", "先进材料"], topicTags: ["AI", "多模态"] },
    { name: "AI 生物医学知识交流沙龙（示例）", summary: "以 AI 生物医学知识检索为主题，讨论资料整合、来源记录与待核对问题。", organizer: "AI 示例交流中心丙", location: "生命科学示例活动室", startAt: "2026-10-18T14:00:00+08:00", endAt: "2026-10-18T17:00:00+08:00", activityType: "SALON", registrationStatus: "CLOSED", domainTags: ["人工智能", "生命科学"], topicTags: ["AI", "生物医学"] }
  ];
  activities.forEach((item, index) => records.push({ ...common, type: "活动", id: `ai-demo-activity-${index + 1}`, title: item.name, ...item }));

  const simulations = [
    { name: "AI 辅助生物结构仿真（示例）", summary: "围绕 AI 生物结构分析的示例主题，展示结构观察、参数比较与研究记录入口。", category: "生命科学", domainTags: ["人工智能", "生命科学"], coverUrl: "assets/mastergo-v2/sim-number-pairs.png" },
    { name: "AI 辅助材料微观模拟（示例）", summary: "围绕 AI 材料分析的示例主题，观察微观行为、比较材料参数并整理记录。", category: "材料科学", domainTags: ["人工智能", "先进材料"], coverUrl: "assets/mastergo-v2/sim-membrane-transport.png" },
    { name: "AI 辅助量子测量实验（示例）", summary: "围绕 AI 与量子测量的示例主题，展示测量、概率和实验记录的观察入口。", category: "量子科学", domainTags: ["人工智能", "量子科学"], coverUrl: "assets/mastergo-v2/sim-quantum-coin.png" }
  ];
  simulations.forEach((item, index) => records.push({ ...common, type: "练仿真", id: `ai-demo-simulation-${index + 1}`, title: item.name, launchUrl: null, ...item }));

  function freeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }
  root.PortalAiDemoFixtures = Object.freeze({
    version: "20261030-ai-demo-v1", executionKind: "LOCAL_MOCK",
    records: freeze(records),
    reportDocuments: freeze(records.filter(record => record.type === "报告").map(record => record.document))
  });
})(typeof window !== "undefined" ? window : globalThis);
