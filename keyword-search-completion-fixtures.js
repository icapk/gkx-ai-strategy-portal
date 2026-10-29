(function (root) {
  "use strict";

  // Keyword-only presentation fixtures and explicitly authored AI demo records;
  // these are not a delivered provider response or an API contract.
  const SIMULATIONS = [
    { id: "keyword-sim-number-pairs", name: "生物结构仿真", summary: "通过数字配对与结构交互观察生物体系中的组合规律。", category: "生命科学", domainTags: ["生命科学", "交互实验"], coverUrl: "assets/mastergo-v2/sim-number-pairs.png" },
    { id: "keyword-sim-quantum-coin", name: "量子测量实验", summary: "用量子抛硬币实验理解测量、概率与量子态变化。", category: "量子科学", domainTags: ["量子科学", "概念验证"], coverUrl: "assets/mastergo-v2/sim-quantum-coin.png" },
    { id: "keyword-sim-membrane-transport", name: "材料微观模拟", summary: "观察膜运输过程中的粒子迁移与材料微观行为。", category: "材料科学", domainTags: ["材料科学", "微观模拟"], coverUrl: "assets/mastergo-v2/sim-membrane-transport.png" },
    { id: "keyword-sim-hydrogen-atom", name: "原子光谱分析", summary: "借助氢原子模型理解能级、跃迁与原子光谱。", category: "原子物理", domainTags: ["原子物理", "光谱分析"], coverUrl: "assets/mastergo-v2/sim-hydrogen-atom.png" }
  ];

  function prepare(existingRecords) {
    const source = root.PORTAL_REMEDIATION_FIXTURES || {};
    const seeds = source.recommendationSeeds || {}, domains = source.resourceDomains || {};
    const records = (existingRecords || []).map(item => {
      const record = { ...item };
      // Explicit classifications for these prototype records; unknown provider
      // values are not inferred from a report title or a generic category.
      if (record.type === "报告") {
        if (["kw-report-ai-2026", "search-6"].includes(record.id)) record.reportType = "1";
        if (["kw-report-future-industries", "search-12"].includes(record.id)) record.reportType = "3";
      }
      if (record.type === "论文") record.domainTags = Array.isArray(item.domainTags) ? item.domainTags.slice() : (domains[item.id] || []).slice();
      if (record.type === "会议" && record.status === "原型数据") record.status = ["UPCOMING", "ONGOING", "ENDED"].includes(record.conferenceStatus) ? record.conferenceStatus : null;
      if (record.type === "人才") {
        for (const key of ["hIndex", "paperCount", "citationCount"]) if (record[key] === undefined) record[key] = null;
      }
      return record;
    });
    records.push({
      id: "keyword-report-ai-insight-demo", type: "报告", reportType: "2",
      title: "人工智能科研应用洞察报告（原型示例）",
      summary: "围绕 AI 科研应用的资料整理、证据核对与使用反馈，梳理应用观察方法和后续跟踪重点。",
      source: "原型示例", uploadedAt: "2026-10-30", domainTags: ["人工智能", "科研应用"],
      detailUrl: null, fixtureSource: "LOCAL_PROTOTYPE", accessible: true
    });
    (seeds.PAPER_ITEMS || []).slice(0, 4).forEach(item => {
      records.push({
        id: item.id, type: "论文", title: item.title, abstract: item.abstract,
        authors: (item.authors || []).map(name => ({ name })), source: item.venue,
        publishedAt: item.publishedAt, tags: (item.tags || []).slice(),
        domainTags: (domains[item.id] || []).slice(), detailUrl: null,
        raw: item, fixtureSource: "EXISTING_PROTOTYPE"
      });
    });
    (source.authorCandidates || []).slice(0, 3).forEach(item => {
      records.push({
        id: item.id, type: "人才", name: item.name, title: item.name,
        institution: item.institution, researchFields: item.field ? [item.field] : [],
        researchDirections: item.direction ? [item.direction] : [],
        hIndex: item.hIndex == null ? null : item.hIndex,
        paperCount: item.papers == null ? null : item.papers,
        citationCount: item.citations == null ? null : item.citations,
        detailUrl: null, raw: item, fixtureSource: "EXISTING_PROTOTYPE"
      });
    });
    SIMULATIONS.forEach(item => records.push({ ...item, type: "练仿真", title: item.name, detailUrl: null, launchUrl: null, fixtureSource: "EXISTING_PROTOTYPE" }));
    const aiDemoRecords = (root.PortalAiDemoFixtures?.records || []).map(record => ({ ...record }));
    const seen = new Set();
    const uniqueRecords = [...aiDemoRecords, ...records].filter(item => { const key = `${item.type}:${item.id}`; if (seen.has(key)) return false; seen.add(key); return true; });
    return root.PortalReportFulltextFixtures ? root.PortalReportFulltextFixtures.attach(uniqueRecords) : uniqueRecords;
  }
  root.PortalKeywordCompletionFixtures = Object.freeze({ prepare });
})(typeof window !== "undefined" ? window : globalThis);
