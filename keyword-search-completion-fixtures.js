(function (root) {
  "use strict";

  // Keyword-only presentation fixtures. These reuse existing prototype content;
  // they are not examples of a delivered provider response or an API contract.
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
      if (record.type === "论文") record.domainTags = Array.isArray(item.domainTags) ? item.domainTags.slice() : (domains[item.id] || []).slice();
      if (record.type === "会议" && record.status === "原型数据") record.status = ["UPCOMING", "ONGOING", "ENDED"].includes(record.conferenceStatus) ? record.conferenceStatus : null;
      if (record.type === "人才") {
        for (const key of ["hIndex", "paperCount", "citationCount"]) if (record[key] === undefined) record[key] = null;
      }
      return record;
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
    const seen = new Set();
    return records.filter(item => { const key = `${item.type}:${item.id}`; if (seen.has(key)) return false; seen.add(key); return true; });
  }
  root.PortalKeywordCompletionFixtures = Object.freeze({ prepare });
})(typeof window !== "undefined" ? window : globalThis);
