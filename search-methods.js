(function (root) {
  "use strict";
  const GROUPS = [["automatic", "自动扩展"], ["translation", "自动翻译"], ["broader", "上位词扩展"], ["narrower", "下位词扩展"]];
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
  const norm = value => String(value || "").normalize("NFKC").replace(/\s+/gu, " ").trim();
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  function parseConcepts(input) {
    const value = norm(input).split(/("[^"]*"|“[^”]*”|'[^']*')/u).map(part => /^["“']/u.test(part) ? part
      : part.replace(/\b(?:ai agents?|artificial intelligence|large language model|solid[- ]state batter(?:y|ies)|drug targets?)\b/giu, phrase => '"' + phrase + '"')).join("");
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
      .replace(/(多智能体|科研智能体|智能体|人工智能|固态电池|安全性|大语言模型|大模型|低空经济|机器人|药物|靶点)/gu, " $1 ")
      .replace(/\s+的\s+/gu, " ");
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
      <label><input type="radio" name="keywordSearchMethod" value="association">智能关联搜索</label>
      <label><input type="radio" name="keywordSearchMethod" value="expansion">词位扩展</label></fieldset>
      <div id="searchAutomaticRules" class="search-automatic-rules" role="list" aria-label="已应用扩展规则" hidden></div>
      <div id="searchAssociationTools" class="search-method-body" hidden><p id="searchAssociationNotice" class="search-method-note" hidden></p>
        <details id="searchAssociationDetails"><summary>检索条件</summary><form id="searchAssociationForm" class="search-association-form">
          <label for="searchAssociationQuery">检索词</label><input id="searchAssociationQuery" type="text" maxlength="200"><button type="submit">应用</button><button type="button" data-plan-reset>恢复原词</button>
          <code id="searchAssociationExpression"></code><p class="search-method-note">关联条件由本地词表生成，实际检索保留当前资源类型和筛选。</p><p id="searchAssociationError" class="search-method-error" role="status"></p></form></details>
        <details id="searchPreferenceDetails"><summary>搜索偏好</summary><div class="search-preference-body">
          <label><input id="searchPreferenceEnabled" type="checkbox">开启搜索偏好</label><p class="search-method-note">仅在本机记录近30天的搜索和打开行为，用于后续关联排序；关闭后停止记录和使用。</p>
          <p id="searchPreferenceIntent" class="search-method-note"></p><div id="searchPreferenceInterests"></div><details><summary>行为记录 <span id="searchPreferenceEventCount">0</span></summary><ul id="searchPreferenceEvents"></ul></details>
          <button type="button" id="searchPreferenceClear">清除用户模型</button><p id="searchPreferenceStatus" class="search-method-note" role="status"></p></div></details></div>
      <div id="searchExpansionTools" class="search-method-body" hidden><p class="search-method-note">原型词表候选，选择后参与检索，取消后撤回。</p>
        <div id="searchExpansionGroups" class="search-expansion-groups"></div><div id="searchExpansionSelected" class="search-expansion-selected"></div></div>`;
    doc.querySelector(".portal-search-toolbar").append(node);
    const get = id => doc.getElementById(id);
    let state = model.snapshot(), options = [], planKey = "", selectionKey = "", prefsContext = "", prefs;
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
      return [...values.values()].map(item => ({ ...item, score: Math.max(0, item.searches + 2 * item.opens + (Number(current.corrections[item.topic]) || 0)) }))
        .sort((a, b) => b.score - a.score || a.topic.localeCompare(b.topic));
    }
    function renderPreferences() {
      const current = ensurePrefs(), rows = interests();
      get("searchPreferenceEnabled").checked = current.enabled;
      get("searchPreferenceEventCount").textContent = String(current.events.length);
      const latest = current.events.at(-1);
      get("searchPreferenceIntent").textContent = latest ? "最近意图：查找" + (latest.resourceType === "全部" ? "跨类型资源" : latest.resourceType || "相关资源") : "";
      get("searchPreferenceClear").disabled = !current.events.length && !Object.keys(current.corrections).length;
      get("searchPreferenceInterests").innerHTML = rows.length ? `<table><thead><tr><th>兴趣主题</th><th>搜索 / 打开</th><th>兴趣分</th><th>调整</th></tr></thead><tbody>${rows.slice(0, 8).map((item, index) =>
        `<tr><td>${esc(item.topic)}</td><td>${item.searches} / ${item.opens}</td><td>${item.score}</td><td><button type="button" data-interest-index="${index}" data-interest-action="boost" ${current.enabled ? "" : "disabled"}>提高此类</button><button type="button" data-interest-index="${index}" data-interest-action="reduce" ${current.enabled ? "" : "disabled"}>减少此类</button><button type="button" data-interest-index="${index}" data-interest-action="restore" ${current.enabled ? "" : "disabled"}>恢复自动</button></td></tr>`).join("")}</tbody></table>` : '<p class="search-method-note">暂无行为记录；开启后实际搜索或打开结果才会建立模型。</p>';
      get("searchPreferenceEvents").innerHTML = [...current.events].reverse().slice(0, 20).map(event => `<li>${esc(new Date(event.at).toLocaleString("zh-CN"))} · ${event.type === "search" ? "搜索" : "打开"} · ${esc(event.label)} · ${esc(event.topic)} · ${esc(event.resourceType || "相关资源")}</li>`).join("");
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
      if (!ensurePrefs().enabled || !state.query) return;
      const effectiveQuery = state.searchMethod === "association" ? state.associationPlan?.query || state.associationQuery || state.query : state.query;
      const topicSource = record ? [record.title, record.name, record.abstract, record.summary, ...(record.domainTags || []), ...(record.tags || [])].filter(Boolean).join(" ") : effectiveQuery;
      const topic = bridge.topic?.(topicSource) || norm(topicSource).slice(0, 20);
      prefs.events.push({ type, topic, query: state.query, resourceType: record?.type || state.currentType, label: norm(label).slice(0, 200), at: now() });
      savePrefs(); renderPreferences();
    }
    function render(next) {
      state = next || model.snapshot(); node.hidden = bridge.getMode() !== "关键词";
      const method = state.searchMethod || "exact", bodyOnly = state.scope === "全文检索";
      const appliedRules = method === "exact" ? state.automaticRules || [] : [];
      get("searchAutomaticRules").hidden = !appliedRules.length;
      const shownRules = new Map();
      appliedRules.forEach(rule => { const key = rule.group + ":" + rule.concept; const item = shownRules.get(key) || { ...rule, words: [] }; item.words.push(rule.text); shownRules.set(key, item); });
      get("searchAutomaticRules").innerHTML = [...shownRules.values()].map(rule => `<span role="listitem" data-auto-rule-type="${esc(rule.group)}" title="原关键词：${esc(rule.concept)}">${esc(GROUPS.find(([group]) => group === rule.group)?.[1] || rule.group)}：${esc(rule.words.join("、"))}</span>`).join("");
      node.querySelectorAll("input[name=keywordSearchMethod]").forEach(input => {
        input.checked = input.value === method;
        input.disabled = bodyOnly && input.value !== "exact";
        input.closest("label").title = input.disabled ? "全文范围使用精确查找，扩展词仅在正文内匹配" : "";
      });
      get("searchAssociationTools").hidden = method !== "association";
      get("searchExpansionTools").hidden = method !== "expansion";
      if (method === "association") {
        const key = state.query + "\0" + state.associationQuery;
        const plan = state.associationPlan || analyze(state.associationQuery || state.query);
        if (key !== planKey) { get("searchAssociationQuery").value = plan.query; planKey = key; }
        const parsed = parseConcepts(plan.query);
        get("searchAssociationExpression").textContent = parsed.error ? "输入检索词后生成条件" : parsed.terms.map(term => {
          const terms = [...new Set([term.text, ...(bridge.associationTerms?.(term.text) || [])])];
          return "(" + terms.map(value => '"' + value.replace(/"/g, "") + '"').join(" OR ") + ")";
        }).join(" AND ");
        const active = [];
        if (plan.resourceType) active.push("资源：" + (state.currentType === "全部" ? plan.resourceType : state.currentType));
        if (plan.filters?.publishedYearFrom && state.currentType === "论文") active.push("年份：" + (state.view.filters.publishedYearFrom || "不限") + "—" + (state.view.filters.publishedYearTo || "不限"));
        const warnings = [...(plan.warnings || [])];
        if (plan.filters?.publishedYearFrom && state.currentType !== "论文") warnings.push("当前资源暂不支持年份条件，请切换论文或调整检索条件。");
        if (plan.resourceType && state.currentType !== "全部" && plan.resourceType !== state.currentType) warnings.push("提问中的资源类型与当前选择不同，按当前资源类型检索。");
        get("searchAssociationNotice").textContent = [...active, ...warnings].join("；");
        get("searchAssociationNotice").hidden = !active.length && !warnings.length;
        get("searchAssociationError").textContent = state.validation?.message || "";
        renderPreferences();
      }
      if (method === "expansion") {
        const key = state.query + JSON.stringify(state.expansionTerms);
        if (key !== selectionKey) {
          const focused = node.contains(doc.activeElement) && doc.activeElement?.dataset?.expansionText
            ? { concept: doc.activeElement.dataset.expansionConcept, text: doc.activeElement.dataset.expansionText } : null;
          options = candidates(state.query); selectionKey = key;
          const selected = value => state.expansionTerms.some(term => norm(term.concept).toLowerCase() === norm(value.concept).toLowerCase() && norm(term.text).toLowerCase() === norm(value.text).toLowerCase());
          get("searchExpansionGroups").innerHTML = GROUPS.map(([group, label]) => {
            const terms = options.map((value, index) => ({ ...value, index })).filter(value => value.group === group);
            return `<section><h3>${label}${group === "narrower" ? '<small title="需规原文截断，当前按更具体概念演示">规则待确认</small>' : ""}</h3><div>${terms.length ? terms.map(value => `<button type="button" data-expansion-index="${value.index}" data-expansion-concept="${esc(value.concept)}" data-expansion-text="${esc(value.text)}" aria-pressed="${selected(value)}" title="扩展概念：${esc(value.concept)}">${selected(value) ? "✓ " : "+ "}${esc(value.text)}</button>`).join("") : '<span class="search-method-note">暂无可用候选</span>'}</div></section>`;
          }).join("");
          get("searchExpansionSelected").innerHTML = state.expansionTerms.length ? '<span>已采用</span>' + state.expansionTerms.map((value, index) => `<button type="button" data-remove-expansion="${index}" data-expansion-concept="${esc(value.concept)}" data-expansion-text="${esc(value.text)}" aria-label="撤回${esc(value.text)}">${esc(value.text)} ×</button>`).join("") : '<span class="search-method-note">未选择扩展词，按原词检索。</span>';
          if (focused) Array.from(get("searchExpansionGroups").querySelectorAll("button")).find(button => button.dataset.expansionConcept === focused.concept && button.dataset.expansionText === focused.text)?.focus({ preventScroll: true });
        }
      }
    }
    const action = promise => Promise.resolve(promise).catch(error => bridge.feedback?.(error.message || "操作失败，请重试", "error"));
    node.addEventListener("change", event => {
      if (event.target.name === "keywordSearchMethod") action(model.setSearchMethod(event.target.value));
      if (event.target.id === "searchPreferenceEnabled") {
        ensurePrefs().enabled = event.target.checked; savePrefs(); renderPreferences();
        get("searchPreferenceStatus").textContent = prefs.enabled ? "已开启，后续实际操作将记入模型。" : "已暂停记录和排序影响，已有模型已保留。";
        action(model.refreshRanking());
      }
    });
    get("searchAssociationForm").addEventListener("submit", event => {
      event.preventDefault(); event.stopPropagation(); action(model.setAssociationQuery(norm(get("searchAssociationQuery").value)));
    });
    node.addEventListener("click", event => {
      const button = event.target.closest("button"); if (!button) return;
      if (button.hasAttribute("data-plan-reset")) action(model.setAssociationQuery(state.query));
      if (button.dataset.expansionIndex != null) {
        const value = options[Number(button.dataset.expansionIndex)]; if (!value) return;
        const existing = state.expansionTerms.some(term => norm(term.concept) === norm(value.concept) && norm(term.text) === norm(value.text));
        action(model.setExpansionTerms(existing ? state.expansionTerms.filter(term => norm(term.concept) !== norm(value.concept) || norm(term.text) !== norm(value.text)) : [...state.expansionTerms, value]));
      }
      if (button.dataset.removeExpansion != null) action(model.setExpansionTerms(state.expansionTerms.filter((_, index) => index !== Number(button.dataset.removeExpansion))));
      if (button.dataset.interestAction) {
        const item = interests()[Number(button.dataset.interestIndex)]; if (!item || !prefs.enabled) return;
        const direction = button.dataset.interestAction;
        if (direction === "restore") delete prefs.corrections[item.topic];
        else prefs.corrections[item.topic] = (Number(prefs.corrections[item.topic]) || 0) + (direction === "boost" ? 2 : -2);
        savePrefs(); renderPreferences(); action(model.refreshRanking());
      }
      if (button.id === "searchPreferenceClear") { prefs = fresh(); savePrefs(); renderPreferences(); get("searchPreferenceStatus").textContent = "已清除用户模型并关闭搜索偏好。"; action(model.refreshRanking()); }
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
    return { render, influence, recordSearch(query, options) { if (options?.trackSearch !== false) recordBehavior("search", query); } };
  }
  root.PortalSearchMethods = Object.freeze({ create, candidates, automaticRules, analyze, parseConcepts, normalizeQuery: norm, GROUPS });
})(typeof window !== "undefined" ? window : globalThis);
