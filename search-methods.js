(function (root) {
  "use strict";
  const GROUPS = [["automatic", "词位扩展-自动扩展"], ["translation", "词位扩展-自动翻译"], ["broader", "词位扩展-上位词扩展"], ["narrower", "词位扩展-下位词扩展"]];
  // Prototype terminology examples. These are not an external model response.
  const DICTIONARY = [
    { pattern: /智能体|\bagents?\b/iu, automatic: ["智能代理", "多智能体"], translation: ["智能体"], broader: ["人工智能"], narrower: ["科研智能体", "自主智能体"] },
    { pattern: /人工智能|^ai$|\bartificial intelligence\b/iu, automatic: ["人工智能", "生成式AI", "机器智能"], translation: ["人工智能"], broader: ["计算机科学"], narrower: ["神经网络", "智能体", "机器学习", "大语言模型"] },
    { pattern: /大模型|语言模型|^llm$|\blarge language model\b/iu, automatic: ["基础模型", "预训练模型"], translation: ["大语言模型"], broader: ["人工智能"], narrower: ["多模态大模型", "行业大模型"] },
    { pattern: /固态电池|\bsolid[- ]state batter(?:y|ies)\b/iu, automatic: ["全固态电池", "固态储能电池"], translation: ["固态电池"], broader: ["储能电池"], narrower: ["硫化物固态电池", "氧化物固态电池"] },
    { pattern: /电池|\bbattery\b/iu, automatic: ["储能电池"], translation: ["电池"], broader: ["储能技术"], narrower: ["固态电池", "锂离子电池"] },
    { pattern: /药物|\bdrug\b/iu, automatic: ["药物发现", "药物研发"], translation: ["药物"], broader: ["生物医药"], narrower: ["小分子药物", "抗体药物"] },
    { pattern: /靶点|\btarget\b/iu, automatic: ["靶点识别", "靶点发现"], translation: ["靶点"], broader: ["药物研发"], narrower: ["靶点优先级排序", "蛋白靶点"] },
    { pattern: /低空经济|\blow.altitude economy\b/iu, automatic: ["低空产业", "低空应用"], translation: ["低空经济"], broader: ["航空经济"], narrower: ["低空物流", "城市空中交通"] },
    { pattern: /机器人|\brobot\b/iu, automatic: ["机器人学习", "具身智能"], translation: ["机器人"], broader: ["智能装备"], narrower: ["人形机器人", "工业机器人"] }
  ];
  const typeLabel = type => type === "人才" ? "学者" : type;
  const norm = value => String(value || "").normalize("NFKC").replace(/\s+/gu, " ").trim();
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const ASSOCIATION_TERMS = [
    ["人工智能", "AI", "artificial intelligence"],
    ["大语言模型", "大模型", "语言模型", "LLM", "large language model"],
    ["智能体", "智能代理", "AI agent", "agent"],
    ["固态电池", "全固态电池", "solid-state battery"],
    ["药物发现", "药物研发", "drug discovery"],
    ["靶点", "药物靶点", "drug target"],
    ["低空经济", "低空产业"],
    ["机器人", "机器人学习"]
  ];
  const associationGroup = value => ASSOCIATION_TERMS.find(group => group.some(term => norm(term).toLowerCase() === norm(value).toLowerCase()));
  const associationTerms = value => (associationGroup(value) || []).filter(term => norm(term).toLowerCase() !== norm(value).toLowerCase());
  function parseConcepts(input) {
    const value = norm(input).split(/("[^"]*"|“[^”]*”|'[^']*')/u).map(part => /^["“']/u.test(part) ? part
      : part.replace(/\b(?:ai agents?|artificial intelligence|large language model|solid[- ]state batter(?:y|ies)|drug targets?|drug discovery)\b/giu, phrase => '"' + phrase + '"')).join("");
    return root.PortalKeywordModel.parse(value);
  }
  function analyze(input) {
    let query = norm(input), resourceType = "", filters = {}, warnings = [];
    if (/["“”']/u.test(query)) return { query, resourceType, filters, warnings };
    const types = [...new Set((query.match(/论文|专利|报告|专家|学者|人才|资讯|会议|课程|活动|仿真实验/gu) || []).map(value => /专家|学者/.test(value) ? "人才" : value === "仿真实验" ? "练仿真" : value))];
    if (types.length === 1) resourceType = types[0];
    if (types.length > 1) warnings.push("检测到多种资源，请通过资源类型分别查看。");
    const range = query.match(/(20\d{2})年?\s*(?:至|到|—|-)\s*(20\d{2})年?/u);
    const recent = query.match(/(?:最近|近)([一二三四五六七八九十\d]+)年/u);
    const number = value => ({ 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 })[value] || Number(value);
    if (range) { filters = { publishedYearFrom: range[1], publishedYearTo: range[2] }; query = query.replace(range[0], " "); }
    else if (recent && number(recent[1]) >= 1 && number(recent[1]) <= 30) {
      const year = new Date().getFullYear(); filters = { publishedYearFrom: String(year - number(recent[1]) + 1), publishedYearTo: String(year) }; query = query.replace(recent[0], " ");
    }
    else if (recent) warnings.push("暂不支持该时间表达，请通过年份筛选设置。");
    else {
      const year = query.match(/(20\d{2})年/u);
      if (year) { filters = { publishedYearFrom: year[1], publishedYearTo: year[1] }; query = query.replace(year[0], " "); }
    }
    if (filters.publishedYearFrom > filters.publishedYearTo) warnings.push("起始年份不能晚于结束年份，请修改检索条件。");
    query = query.replace(/^(?:(?:请|帮我|帮忙|我想|我要|查找|搜索|检索|寻找|找|查询|关于|有关|给我|看一下)\s*)+/u, "")
      .replace(/论文|专利|报告|专家|学者|人才|资讯|会议|课程|活动|仿真实验/gu, " ")
      .replace(/相关的?|研究进展|进展|有哪些|是什么|[?？。]/gu, " ")
      .replace(/(多智能体|科研智能体|智能体|人工智能|全固态电池|固态电池|安全性|大语言模型|大模型|低空经济|机器人学习|机器人|药物发现|药物研发|药物靶点|药物|靶点)/gu, " $1 ")
      .replace(/(?:^|\s)的(?=\s|$)/gu, " ");
    const unsupported = norm(input).match(/SCI|核心期刊|一区|二区|被引\d+|排名前\d+/giu);
    if (unsupported) warnings.push("暂不支持自动执行“" + unsupported.join("、") + "”条件，请调整检索条件。");
    query = norm(query).replace(/^[与和、\s]+|[与和、\s]+$/gu, "");
    return { query: query || norm(input), resourceType, filters, warnings };
  }
  function candidates(query) {
    const parsed = parseConcepts(query);
    if (parsed.error) return [];
    const seen = new Set(), result = [];
    parsed.terms.forEach(({ text: concept }) => {
      const entry = DICTIONARY.find(value => value.pattern.test(concept));
      if (!entry) return;
      GROUPS.forEach(([group]) => (entry[group] || []).forEach(text => {
        const key = (group + ":" + concept + ":" + text).toLowerCase();
        if (norm(concept).toLowerCase() === norm(text).toLowerCase() || seen.has(key)) return;
        seen.add(key); result.push({ concept, text, group });
      }));
    });
    return result;
  }
  function automaticRules(query) {
    const values = candidates(query), counts = new Map();
    return values.filter(value => {
      const key = value.group + ":" + value.concept.toLowerCase();
      const limit = value.group === "narrower" && /^(?:ai|artificial intelligence|人工智能)$/iu.test(value.concept) ? 2 : 1;
      const count = counts.get(key) || 0;
      counts.set(key, count + 1);
      return count < limit;
    }).sort((a, b) => ["automatic", "broader", "narrower", "translation"].indexOf(a.group) - ["automatic", "broader", "narrower", "translation"].indexOf(b.group));
  }
  function create(bridge) {
    const doc = root.document, model = bridge.controller.model;
    const node = doc.createElement("section"); node.id = "searchMethodTools"; node.className = "search-method-tools";
    node.innerHTML = `<fieldset class="search-method-choice"><legend class="sr-only">关键词检索方式</legend>
      <label><input type="radio" name="keywordSearchMethod" value="exact" checked>精确查找</label>
      <label><input type="radio" name="keywordSearchMethod" value="association">智能关联搜索</label></fieldset>
      <div id="searchAutomaticRules" class="search-automatic-rules" role="list" aria-label="词位扩展规则开关" hidden></div>
      <div id="searchAssociationTools" class="search-method-body" hidden>
        <section class="search-association-plan" aria-labelledby="searchAssociationHeading">
          <div class="search-association-heading"><h3 id="searchAssociationHeading">已理解的检索条件（用户搜索）</h3></div>
          <div id="searchAssociationSummary" class="search-association-summary" aria-live="polite"></div>
          <p id="searchAssociationRelated" class="search-association-related"></p><p id="searchAssociationNotice" class="search-method-note" hidden></p>
          <p id="searchAssociationError" class="search-method-error" role="status"></p>
        </section>
        <details id="searchPreferenceDetails" class="search-preference-details"><summary>搜索偏好（行为分析/信息处理） <span id="searchPreferenceSummary"></span></summary><div class="search-preference-body">
          <div class="search-preference-controls"><label><input id="searchPreferenceEnabled" type="checkbox">开启搜索偏好</label><button type="button" id="searchPreferenceClear">清除偏好</button></div>
          <p class="search-method-note">按近30天记录更新兴趣：搜索 +1，打开结果 +2。关键词相关性优先，兴趣仅辅助排序。当前原型记录保存在本机。</p>
          <h4 id="searchPreferenceModelHeading" class="search-preference-model-title">用户模型</h4>
          <p id="searchPreferenceIntent" class="search-method-note"></p><div id="searchPreferenceInterests" class="search-preference-interests" aria-live="polite"></div>
          <p id="searchPreferenceStatus" class="search-method-note" role="status"></p></div></details></div>`;
    doc.querySelector(".portal-search-toolbar").append(node);
    const get = id => doc.getElementById(id);
    let state = model.snapshot(), prefsContext = "", prefs;
    const context = () => String(bridge.getUserId?.() || "anonymous");
    const now = () => Date.now();
    const fresh = () => ({ version: 1, enabled: false, events: [], corrections: {} });
    function ensurePrefs() {
      const next = context();
      if (next !== prefsContext || !prefs) {
        prefsContext = next; prefs = fresh();
        try { const saved = JSON.parse(root.localStorage.getItem("gkx-search-preferences-v2:" + next) || "null");
          if (saved?.version === 1 && Array.isArray(saved.events)) prefs = { ...fresh(), ...saved, corrections: saved.corrections || {} };
        } catch (_) { /* An unavailable local store does not block search. */ }
      }
      prefs.events = prefs.events.filter(event => event && ["search", "open"].includes(event.type) && typeof event.topic === "string"
        && Number.isFinite(event.at) && event.at <= now() && event.at >= now() - 30 * 86400000).slice(-500);
      return prefs;
    }
    function savePrefs() {
      try { root.localStorage.setItem("gkx-search-preferences-v2:" + prefsContext, JSON.stringify(prefs)); }
      catch (_) { get("searchPreferenceStatus").textContent = "本次模型仅在当前页面有效，浏览器未能保存。"; }
    }
    function interests() {
      const current = ensurePrefs(), values = new Map();
      current.events.forEach(event => {
        const item = values.get(event.topic) || { topic: event.topic, searches: 0, opens: 0 };
        if (event.type === "search") item.searches++; else item.opens++;
        values.set(event.topic, item);
      });
      return [...values.values()].map(item => ({ ...item, score: item.searches + 2 * item.opens }))
        .sort((a, b) => b.score - a.score || a.topic.localeCompare(b.topic));
    }
    function renderPreferences() {
      const current = ensurePrefs(), rows = interests();
      get("searchPreferenceEnabled").checked = current.enabled;
      get("searchPreferenceSummary").textContent = current.enabled ? `已开启 · ${rows.length} 个兴趣主题` : "未开启";
      const latest = current.events.at(-1);
      const topicLabel = topic => topic === "AI for Science" ? "人工智能" : topic;
      get("searchPreferenceIntent").textContent = latest ? `最近关注：${topicLabel(latest.topic)}；${latest.type === "search" ? "搜索 +1" : "打开结果 +2"}` : "";
      get("searchPreferenceClear").disabled = !current.events.length;
      get("searchPreferenceInterests").innerHTML = rows.length ? rows.slice(0, 8).map(item => `<span title="搜索 ${item.searches} 次，打开 ${item.opens} 次">${esc(topicLabel(item.topic))}<strong>${item.score} 分</strong></span>`).join("") : `<p class="search-method-note">${current.enabled ? "暂无兴趣记录，搜索或打开结果后自动更新。" : "开启后，根据搜索和打开记录优先展示你关注的相关内容。"}</p>`;
    }
    function influence(record) {
      if (!ensurePrefs().enabled) return {};
      const fields = [record.title, record.name, record.abstract, record.summary, ...(record.tags || []), ...(record.domainTags || []), ...(record.researchFields || []), ...(record.researchDirections || [])].join(" ").toLowerCase();
      const matched = interests().filter(item => [...(bridge.topicAliases?.(item.topic) || [item.topic]), ...(item.topic === "AI for Science" ? ["AI"] : [])].some(term => {
        const text = String(term).toLowerCase();
        return /[a-z]/u.test(text) ? new RegExp("\\b" + text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "iu").test(fields) : fields.includes(text);
      }));
      return { bonus: matched.length ? Math.min(10, matched[0].score) : 0 };
    }
    function recordBehavior(type, label, record) {
      if (!ensurePrefs().enabled || !state.query) return false;
      const effectiveQuery = state.searchMethod === "association" ? state.associationPlan?.query ?? state.query : state.query;
      if (!effectiveQuery) return false;
      const topicSource = record ? [record.title, record.name, record.abstract, record.summary, ...(record.domainTags || []), ...(record.tags || [])].filter(Boolean).join(" ") : effectiveQuery;
      const topic = bridge.topic?.(topicSource) || norm(topicSource).slice(0, 20);
      prefs.events.push({ type, topic, query: state.query, resourceType: record?.type || state.currentType, label: norm(label).slice(0, 200), at: now() });
      savePrefs(); renderPreferences(); return true;
    }
    function render(next) {
      state = next || model.snapshot(); node.hidden = bridge.getMode() !== "关键词";
      const method = state.searchMethod || "exact", bodyOnly = state.scope === "全文检索";
      const availableRules = method === "exact" ? state.availableAutomaticRules || [] : [];
      const activeControl = doc.activeElement;
      const focusedRule = get("searchAutomaticRules").contains(activeControl)
        ? activeControl.hasAttribute("data-auto-rule-group") ? { group: activeControl.dataset.autoRuleGroup, concept: activeControl.dataset.autoRuleConcept }
          : activeControl.hasAttribute("data-auto-rules-toggle-all") ? { all: true } : null : null;
      get("searchAutomaticRules").hidden = !availableRules.length;
      const shownRules = new Map();
      availableRules.forEach(rule => { const key = rule.group + ":" + rule.concept; const item = shownRules.get(key) || { ...rule, words: [] }; item.words.push(rule.text); shownRules.set(key, item); });
      const anyEnabled = availableRules.some(rule => rule.enabled !== false);
      get("searchAutomaticRules").innerHTML = [...shownRules.values()].map(rule => `<span role="listitem"><label title="原关键词：${esc(rule.concept)}"><input type="checkbox" data-auto-rule-group="${esc(rule.group)}" data-auto-rule-concept="${esc(rule.concept)}" ${rule.enabled !== false ? "checked" : ""}><span>${esc(GROUPS.find(([group]) => group === rule.group)?.[1] || rule.group)}：${esc(rule.words.join("、"))}</span></label></span>`).join("")
        + (availableRules.length ? `<button type="button" data-auto-rules-toggle-all>${anyEnabled ? "全部关闭" : "全部开启"}</button>` : "");
      if (focusedRule) (focusedRule.all ? get("searchAutomaticRules").querySelector("[data-auto-rules-toggle-all]")
        : Array.from(get("searchAutomaticRules").querySelectorAll("input")).find(input => input.dataset.autoRuleGroup === focusedRule.group && input.dataset.autoRuleConcept === focusedRule.concept))?.focus({ preventScroll: true });
      node.querySelectorAll("input[name=keywordSearchMethod]").forEach(input => {
        input.checked = input.value === method;
        input.disabled = bodyOnly && input.value !== "exact";
        input.closest("label").title = input.disabled ? "全文范围使用精确查找，扩展词仅在正文内匹配" : "";
      });
      get("searchAssociationTools").hidden = method !== "association";
      if (method === "association") {
        const plan = state.associationPlan || analyze(state.associationQuery || state.query);
        const parsed = parseConcepts(plan.query);
        const filters = state.currentType === "论文" ? state.view.filters || {} : plan.filters || {};
        const yearParts = [];
        if (filters.publishedYearFrom || filters.publishedYearTo) yearParts.push(`${filters.publishedYearFrom || "不限"}—${filters.publishedYearTo || "不限"}`);
        if (filters.dateFrom || filters.dateTo || filters.publishedFrom || filters.publishedTo) yearParts.push(`${filters.dateFrom || filters.publishedFrom || "不限"}—${filters.dateTo || filters.publishedTo || "不限"}`);
        if (filters.publishTime && !["不限", "不限时间", "自定义"].includes(filters.publishTime)) yearParts.push(filters.publishTime);
        const years = yearParts.join(" · ");
        const disabled = state.loading ? "disabled" : "";
        const keywordChips = parsed.terms.map(term => {
          const label = associationGroup(term.text)?.[0] || term.text;
          return `<span class="search-association-chip">关键词<strong>${esc(label)}</strong><button type="button" data-remove-association-keyword="${esc(term.text)}" aria-label="取消关键词 ${esc(label)}" title="取消关键词" ${disabled}>×</button></span>`;
        }).join("");
        const resourceChip = state.currentType !== "全部" ? `<span class="search-association-chip">资源<strong>${esc(typeLabel(state.currentType))}</strong><button type="button" data-clear-association-resource aria-label="取消资源类型 ${esc(typeLabel(state.currentType))}" title="取消资源条件" ${disabled}>×</button></span>` : "";
        const yearChip = years ? `<span class="search-association-chip">${state.currentType === "论文" ? "年份" : "年份（未生效）"}<strong>${esc(years)}</strong><button type="button" data-clear-association-years aria-label="取消年份条件 ${esc(years)}" title="取消年份条件" ${disabled}>×</button></span>` : "";
        const scopeChip = ["标题", "摘要"].includes(state.scope) ? `<span class="search-association-chip">搜索范围<strong>${esc(state.scope)}</strong><button type="button" data-clear-association-scope aria-label="取消搜索范围 ${esc(state.scope)}" title="恢复默认搜索范围" ${disabled}>×</button></span>` : "";
        get("searchAssociationSummary").innerHTML = (keywordChips || '<span class="search-method-note">关键词已全部取消，请在上方输入关键词重新搜索。</span>')
          + resourceChip + yearChip + scopeChip;
        const related = [...new Set(parsed.terms.flatMap(term => [term.text, ...(bridge.associationTerms?.(term.text) || [])]))];
        get("searchAssociationRelated").textContent = related.length > parsed.terms.length ? `关联检索：${related.join("、")}` : "按当前关键词查找相关资源。";
        get("searchAssociationRelated").hidden = !parsed.terms.length;
        const warnings = state.associationEmpty ? [] : [...(plan.warnings || [])];
        if (!state.associationEmpty && plan.filters?.publishedYearFrom && state.currentType !== "论文") warnings.push("当前资源暂不支持年份条件，请切换论文或调整检索条件。");
        if (!state.associationEmpty && plan.resourceType && state.currentType !== "全部" && plan.resourceType !== state.currentType) warnings.push("提问中的资源类型与当前选择不同，按当前资源类型检索。");
        get("searchAssociationNotice").textContent = warnings.join("；");
        get("searchAssociationNotice").hidden = !warnings.length;
        get("searchAssociationError").textContent = state.associationEmpty ? "" : state.validation?.message || "";
        renderPreferences();
      }
    }
    const action = promise => Promise.resolve(promise).catch(error => bridge.feedback?.(error.message || "操作失败，请重试", "error"));
    function refreshAfterSearch(recorded) {
      if (recorded && state.searchMethod === "association") return model.refreshRanking();
    }
    async function removeAssociationCondition(button) {
      const original = state.query;
      const next = button.hasAttribute("data-remove-association-keyword")
        ? await model.removeAssociationKeyword(button.dataset.removeAssociationKeyword)
        : button.hasAttribute("data-clear-association-years") ? await model.clearAssociationYears()
          : button.hasAttribute("data-clear-association-scope") ? await model.setScope("标题和摘要")
            : await model.clearAssociationResource();
      if (next.query !== original) return;
      const target = get("searchAssociationSummary").querySelector("button:not(:disabled)") || get("portalResultSearchInput");
      target?.focus({ preventScroll: true });
    }
    node.addEventListener("change", event => {
      if (event.target.hasAttribute("data-auto-rule-group")) action(model.setAutomaticRuleEnabled(event.target.dataset.autoRuleGroup, event.target.dataset.autoRuleConcept, event.target.checked));
      if (event.target.name === "keywordSearchMethod") action(model.setSearchMethod(event.target.value));
      if (event.target.id === "searchPreferenceEnabled") {
        ensurePrefs().enabled = event.target.checked; savePrefs(); renderPreferences();
        get("searchPreferenceStatus").textContent = prefs.enabled ? "已开启，后续搜索和打开结果会自动更新兴趣。" : "已关闭，停止记录并恢复普通关联排序；已有偏好保留。";
        action(model.refreshRanking());
      }
    });
    node.addEventListener("click", event => {
      const button = event.target.closest("button"); if (!button) return;
      if (button.hasAttribute("data-auto-rules-toggle-all")) action(model.setAllAutomaticRulesEnabled(!state.availableAutomaticRules.some(rule => rule.enabled !== false)));
      if (button.hasAttribute("data-remove-association-keyword") || button.hasAttribute("data-clear-association-resource") || button.hasAttribute("data-clear-association-years") || button.hasAttribute("data-clear-association-scope")) action(removeAssociationCondition(button));
      if (button.id === "searchPreferenceClear") { prefs = fresh(); savePrefs(); renderPreferences(); get("searchPreferenceStatus").textContent = "已清除兴趣记录并关闭搜索偏好。"; action(model.refreshRanking()); }
    });
    doc.getElementById("portalSearchResultList").addEventListener("click", event => {
      if (bridge.getMode() !== "关键词") return;
      const control = event.target.closest("a[data-result-detail-link],button[data-report-hit],button[data-keyword-detail]");
      if (!control || control.hasAttribute("data-keyword-detail") && control.getAttribute("aria-expanded") === "true") return;
      const card = control.closest("article"); if (!card) return;
      const record = state.displayItems.find(item => card.dataset.resultId === `${item.type}:${item.id}`);
      if (record) recordBehavior("open", record.title || record.name, record);
    }, true);
    render(state);
    return { render, influence, recordSearch(query, options) { if (options?.trackSearch !== false) action(refreshAfterSearch(recordBehavior("search", query))); } };
  }
  root.PortalSearchMethods = Object.freeze({ create, candidates, automaticRules, analyze, parseConcepts, associationTerms, normalizeQuery: norm, GROUPS });
})(typeof window !== "undefined" ? window : globalThis);
