(function (global) {
  "use strict";

  // This controller owns the keyword result surface only. Original nodes are
  // restored, rather than re-created, when another search mode is selected.
  const TYPES = ["论文", "专利", "报告", "人才", "资讯", "会议", "课程", "活动", "练仿真"];
  const isUnconnected = type => Boolean(global.PortalKeywordModel?.isUnconnected(type));
  const SECONDARY_TYPES = ["论文", "专利", "人才", "报告"];
  const LABELS = {
    personNameFilter: "学者姓名", institutionFilter: "机构名称", researchFieldFilter: "研究领域",
    authorFilter: "作者", venueFilter: "会议／期刊", ipcFilter: "IPC 分类",
    applicantFilter: "申请人", inventorFilter: "发明人", applicationStart: "申请日期（起）",
    applicationEnd: "申请日期（止）", publicationStart: "公布日期（起）", publicationEnd: "公布日期（止）",
    reportType: "报告类型", reportTypes: "报告类型", conferenceLocation: "会议地点", conferenceLevel: "会议等级",
    conferenceSubmission: "投稿状态", conferenceStartFrom: "开始时间（起）", conferenceStartTo: "开始时间（止）",
    courseLecturer: "讲师", courseInstitution: "授课机构", courseLevel: "课程等级",
    activityLocation: "活动地点", activityType: "活动类型", activityRegistration: "报名状态",
    activityStartFrom: "开始时间（起）", activityStartTo: "开始时间（止）",
    sources: "来源", domains: "领域", publishTime: "时间", dateFrom: "日期（起）", dateTo: "日期（止）", publishedYearFrom: "起始年份", publishedYearTo: "结束年份"
  };
  const typeLabel = type => type === "人才" ? "学者" : type;
  const SUBMISSION = [["OPEN", "征稿中"], ["CLOSED", "已截稿"], ["UNKNOWN", "暂无征稿信息"]];
  const ACTIVITY = [["LECTURE", "讲座"], ["FORUM", "论坛"], ["SALON", "沙龙"], ["DEBATE", "思辨会"], ["OTHER", "其他"]];
  const REGISTRATION = [["NOT_STARTED", "未开始报名"], ["OPEN", "开放报名"], ["FULL", "已满员"], ["CLOSED", "已截止"], ["NOT_REQUIRED", "无需报名"]];
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function create(bridge) {
    if (!global.PortalKeywordModel) throw new Error("Keyword model must load before the UI controller.");
    const doc = global.document;
    const get = id => doc.getElementById(id);
    const form = get("portalSearchFilters"), resultForm = get("portalResultSearchForm");
    const input = get("portalResultSearchInput"), tabs = get("portalSearchTypeTabs");
    const list = get("portalSearchResultList"), empty = get("portalSearchEmpty");
    const heading = get("portalSearchResultCount"), range = get("portalSearchResultRange");
    const paging = get("portalSearchPagination"), chips = get("portalActiveFilters");
    const countBadge = get("portalActiveFilterCount"), surface = get("searchResultsPage");
    const sort = get("portalSearchSort")?.closest("label");
    if (!form || !resultForm || !tabs || !list) throw new Error("Keyword search surface is missing.");
    const originalNodes = Array.from(form.childNodes);
    const originalEmpty = {
      title: empty.querySelector("h2").textContent,
      text: empty.querySelector("p").textContent,
      button: get("portalEmptyReset").textContent,
      buttonHidden: get("portalEmptyReset").hidden
    };
    const originalSortHidden = sort ? sort.hidden : false;
    const optionalQueryControls = [doc.querySelector(".keyword-v1-tools"), doc.querySelector(".keyword-v1-demo-note")]
      .filter(Boolean).map(node => ({ node, parent: node.parentNode, next: node.nextSibling }));
    const records = bridge.records || global.PortalKeywordModel.createFixtures(bridge.items || []);
    const model = bridge.model || global.PortalKeywordModel.create({ records, getUserContext: bridge.getUserContext, associationTerms: bridge.associationTerms, associationInfluence: bridge.associationInfluence, associationPlan: bridge.associationPlan, parseConcepts: bridge.parseConcepts, automaticRules: bridge.automaticRules });
    const hint = doc.createElement("p");
    hint.className = "portal-resource-filter-hint keyword-v1-filter-hint";
    hint.id = "portalKeywordFilterHint";
    const sourceStatus = doc.createElement("div");
    sourceStatus.className = "keyword-v1-source-status";
    sourceStatus.id = "portalKeywordSourceStatus";
    sourceStatus.setAttribute("role", "status");
    sourceStatus.setAttribute("aria-live", "polite");
    chips.after(hint, sourceStatus);
    hint.hidden = sourceStatus.hidden = true;
    let active = false, filterSignature = "", unsubscribe = null, unsubscribeContext = null, submitting = 0;
    let validationFeedback = "";
    let emptyAction = "clear";
    const contextKey = () => { const value = bridge.getUserContext?.(); return typeof value === "string" ? value : JSON.stringify(value); };
    let observedContext = contextKey();

    function isKeyword() { return bridge.getMode() === "关键词"; }
    function setActive(value) {
      value = Boolean(value);
      if (value === active) return;
      active = value;
      surface?.classList.toggle("keyword-search-v1-active", active);
      if (sort) sort.hidden = active ? true : originalSortHidden;
      if (active) {
        optionalQueryControls.forEach(({ node }) => node.remove());
        form.replaceChildren();
        filterSignature = "";
        render();
      } else {
        optionalQueryControls.forEach(({ node, parent, next }) => parent.insertBefore(node, next?.parentNode === parent ? next : null));
        clearValidationFeedback();
        form.replaceChildren(...originalNodes);
        filterSignature = "";
        hint.hidden = sourceStatus.hidden = true;
        sourceStatus.replaceChildren();
        empty.querySelector("h2").textContent = originalEmpty.title;
        empty.querySelector("p").textContent = originalEmpty.text;
        const reset = get("portalEmptyReset");
        reset.textContent = originalEmpty.button;
        reset.hidden = originalEmpty.buttonHidden;
        delete reset.dataset.keywordEmptyAction;
        form.removeAttribute("aria-busy");
      }
    }

    function group(title, content, className) {
      return `<fieldset class="portal-search-filter-group ${className || ""}"><legend class="portal-search-filter-heading">${esc(title)}</legend>${content}</fieldset>`;
    }
    function field(name, type, options, placeholder) {
      const label = LABELS[name] || name;
      const control = options
        ? `<select name="${esc(name)}"><option value="">全部</option>${options.map(o => {
          const pair = Array.isArray(o) ? o : [o, o];
          return `<option value="${esc(pair[0])}">${esc(pair[1])}</option>`;
        }).join("")}</select>`
        : `<input type="${type || "search"}" name="${esc(name)}"${["publishedYearFrom", "publishedYearTo"].includes(name) ? ' inputmode="numeric" maxlength="4" pattern="[0-9]{4}"' : ""}${placeholder ? ` placeholder="${esc(placeholder)}"` : ""}>`;
      return `<label><span>${esc(label)}</span>${control}</label>`;
    }
    function checks(name, values) {
      if (!values.length) return `<p class="portal-resource-filter-hint">暂无可用选项</p>`;
      return `<div class="keyword-v1-filter-options">${values.map(value => {
        const [code, label] = Array.isArray(value) ? value : [value, value];
        return `<label class="portal-search-filter-option"><input type="checkbox" name="${esc(name)}" value="${esc(code)}"><span>${esc(label)}</span></label>`;
      }).join("")}</div>`;
    }
    function buildFilters(state) {
      const type = state.currentType, rows = state.view?.rawItems || [], filters = state.view?.filters || {};
      const selected = type === "人才" ? [filters.researchFieldFilter] : filters.domains || [];
      const domains = [...new Set([...rows.flatMap(row => type === "人才" ? row.researchFields || [] : row.domainTags || []), ...selected].filter(value => value != null && value !== ""))];
      const signature = JSON.stringify([type, ["论文", "人才"].includes(type) ? domains : []]);
      if (signature === filterSignature) return;
      filterSignature = signature;
      const scopes = type === "论文" ? ["标题和摘要", "标题", "摘要"] : type === "报告" ? ["标题和摘要", "标题", "摘要", "全文检索"] : [];
      let html = scopes.length ? group("搜索范围", scopes.map(scope => `<label class="portal-search-filter-option"><input type="radio" name="resourceScope" value="${esc(scope)}"><span>${esc(scope)}</span></label>`).join("")) : "";
      let professional = "";
      if (type === "人才") {
        professional = field("personNameFilter", "search", null, "学者姓名") + field("institutionFilter", "search", null, "机构名称") + field("researchFieldFilter", null, domains);
      } else if (type === "论文") {
        professional = field("authorFilter", "search", null, "作者姓名") + field("venueFilter", "search", null, "会议或期刊名称");
      } else if (type === "专利") {
        professional = field("ipcFilter", "search", null, "例如 G16B") + field("applicantFilter", "search", null, "申请人名称") + field("inventorFilter", "search", null, "发明人姓名") + field("applicationStart", "date") + field("applicationEnd", "date") + field("publicationStart", "date") + field("publicationEnd", "date");
      } else if (type === "报告") {
        professional = `<div class="keyword-report-type-filter" role="group" aria-label="报告类型"><span class="keyword-report-type-label">报告类型</span>${checks("reportTypes", global.PortalKeywordModel.REPORT_TYPES)}</div>`;
      }
      if (professional) html += group("二次筛选", type === "报告" ? professional : `<div class="portal-resource-filter">${professional}</div>`, type === "报告" ? "" : "portal-search-filter-fields");
      else html += '<p class="portal-resource-filter-hint keyword-v1-no-filters">选择论文、专利、学者或报告，可使用二次筛选。</p>';
      if (type === "论文") {
        html += group("发表时间", `<div class="portal-resource-filter">${field("publishedYearFrom", "text", null, "YYYY")}${field("publishedYearTo", "text", null, "YYYY")}</div>`, "portal-search-filter-fields");
      }
      if (type === "论文") {
        html += group("领域", checks("domains", domains));
      }
      form.innerHTML = html;
    }

    function valueForFilter(filters, name) {
      if (name === "publishTime") return filters[name] || "不限时间";
      return filters[name] == null ? "" : filters[name];
    }
    function clearValidationFeedback() {
      if (!validationFeedback) return;
      const feedbackNode = get("portalSearchFeedback");
      if (!feedbackNode || feedbackNode.textContent === validationFeedback) bridge.feedback?.("");
      validationFeedback = "";
    }
    function syncFilters(state) {
      const view = state.view || {};
      const type = state.currentType;
      const source = state.sources?.[type];
      const loading = type === "全部" ? Boolean(state.loading) : source?.status === "loading";
      const unconnected = isUnconnected(type);
      const unavailable = source?.status === "unsupported";
      const validation = state.validation || view.validation;
      // Invalid input is a draft. Keep the entire draft visible while the list,
      // chips and counts continue to use the last valid view.filters snapshot.
      const draft = validation?.values;
      const filters = draft || view.filters || {};
      form.setAttribute("aria-busy", String(loading));
      form.querySelectorAll("input, select").forEach(control => {
        if (!control.name) return;
        if (control.name === "resourceScope") {
          control.checked = state.scope === control.value;
          control.disabled = unconnected || (type === "人才" && control.value !== "全部资源");
          control.closest("label")?.classList.toggle("is-disabled", control.disabled);
          return;
        }
        const value = valueForFilter(filters, control.name);
        if (control.type === "checkbox") control.checked = Array.isArray(value) && value.includes(control.value);
        else if (control.type === "radio") control.checked = control.value === value;
        else if ((draft || doc.activeElement !== control) && control.value !== String(value)) control.value = String(value);
        control.disabled = loading && control.name !== "reportTypes" || unconnected || unavailable || !state.query;
        control.closest("label")?.classList.toggle("is-disabled", control.disabled);
      });
      const custom = form.querySelector("[data-keyword-custom-dates]");
      if (custom) custom.hidden = filters.publishTime !== "自定义";
      if (validation?.message) {
        validationFeedback = validation.message;
        bridge.feedback?.(validation.message, "error");
      } else clearValidationFeedback();
    }

    function filterDescriptors(state) {
      const filters = state.view?.filters || {};
      return Object.entries(filters).filter(([name, value]) => name !== "publishTime" || value !== "不限时间").filter(([, value]) => Array.isArray(value) ? value.length : value !== "" && value != null).map(([name, value]) => {
        let display = Array.isArray(value) ? value.join("、") : value;
        if (name === "reportTypes") display = (Array.isArray(value) ? value : [value]).map(global.PortalKeywordModel.reportTypeLabel).join("、");
        const control = form.elements.namedItem(name);
        if (control?.tagName === "SELECT") display = control.selectedOptions[0]?.textContent || display;
        return { name, label: `${LABELS[name] || name}：${display}` };
      });
    }
    function renderChips(state) {
      const descriptors = filterDescriptors(state);
      chips.hidden = !descriptors.length;
      chips.innerHTML = descriptors.map(item => `<button type="button" data-keyword-remove-filter="${esc(item.name)}" aria-label="移除筛选 ${esc(item.label)}"><span>${esc(item.label)}</span><b aria-hidden="true">×</b></button>`).join("") + (descriptors.length ? '<button type="button" class="portal-clear-filters" data-keyword-clear-filters>清除全部</button>' : "");
      if (countBadge) { countBadge.hidden = !descriptors.length; countBadge.textContent = String(descriptors.length); }
    }
    function renderCard(record, absoluteIndex, query, scope) {
      const type = record.type, raw = record.raw || record;
      const values = value => (Array.isArray(value) ? value : value == null ? [] : [value]).filter(value => value != null && value !== "");
      const names = value => values(value).map(item => typeof item === "object" ? item.name : item).filter(Boolean).join(" · ");
      const text = value => Array.isArray(value) ? names(value) : value == null ? "" : String(value);
      const present = value => value != null && String(value).trim() !== "";
      const link = value => {
        if (!present(value)) return "";
        try { const url = new URL(String(value), doc.baseURI); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; }
        catch { return ""; }
      };
      const date = value => /^\d{4}(?:-\d{2}(?:-\d{2})?)?/.exec(String(value || ""))?.[0] || "";
      const moment = value => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(String(value || "")) ? String(value).slice(0, 16).replace("T", " ") : date(value);
      const interval = (from, to) => [moment(from), moment(to)].filter(Boolean).join(" — ");
      const title = text(type === "人才" ? record.name : record.name || record.title);
      const parsed = global.PortalKeywordModel.parse(query);
      const terms = parsed.error ? [] : [...new Set([...parsed.terms.map(term => term.text), ...(record.searchHighlightTerms || [])])].filter(Boolean).sort((a, b) => b.length - a.length);
      const pattern = terms.length ? new RegExp(terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "giu") : null;
      const highlight = value => {
        const source = text(value);
        if (!pattern) return esc(source);
        let result = "", offset = 0;
        for (const match of source.matchAll(pattern)) {
          result += esc(source.slice(offset, match.index)) + `<mark>${esc(match[0])}</mark>`;
          offset = match.index + match[0].length;
        }
        return result + esc(source.slice(offset));
      };
      const rows = [], more = [];
      const row = (label, value, target = rows) => { if (present(value)) target.push([label, text(value)]); };
      const enumLabel = (choices, value) => choices.find(pair => pair[0] === value)?.[1] || value;
      let summary = "", dateLabel = "", dateValue = "", tags = [];
      if (type === "论文") {
        row("作者", names(record.authors)); row("期刊／会议", record.source);
        summary = record.abstract; dateLabel = "发表时间"; dateValue = date(record.publishedAt); tags = values(record.tags);
      } else if (type === "专利") {
        row("IPC", names(record.ipc)); row("申请人", names(record.applicant)); row("发明人", names(record.inventor));
        row("申请日期", date(record.applicationDate)); row("公布日期", date(record.publicationDate));
        summary = record.abstract ?? record.summary; tags = values(record.tags);
      } else if (type === "报告") {
        row("来源", record.source); row("报告类型", global.PortalKeywordModel.reportTypeLabel(record.reportType));
        summary = record.summary; dateLabel = "上传时间"; dateValue = date(record.uploadedAt); tags = values(record.domainTags);
      } else if (type === "人才") {
        row("机构", record.institution); row("研究方向", names(record.researchDirections)); row("研究领域", names(record.researchFields));
        row("H指数", record.hIndex); row("论文数", record.paperCount); row("引用数", record.citationCount);
      } else if (type === "资讯") {
        row("来源", record.source); summary = record.summary;
        dateLabel = "发布时间"; dateValue = date(record.publishedAt); tags = values(record.domainTags);
      } else if (type === "会议") {
        row("会议时间", interval(record.startAt, record.endAt)); row("地点", record.location); row("等级", record.level);
        row("投稿状态", enumLabel(SUBMISSION, record.submissionStatus));
        row("会议状态", enumLabel([["UPCOMING", "未开始"], ["ONGOING", "进行中"], ["ENDED", "已结束"]], record.status));
        row("投稿截止时间", moment(record.submissionDeadline), more); tags = values(record.tags);
      } else if (type === "课程") {
        row("讲师", names(record.lecturers)); row("授课机构", record.institution); row("课程等级", record.level); row("课程周期", record.durationText);
        summary = record.summary; dateLabel = "发布时间"; dateValue = date(record.publishedAt); tags = values(record.domainTags);
      } else if (type === "活动") {
        row("主办单位", record.organizer); row("活动地点", record.location); row("活动时间", interval(record.startAt, record.endAt));
        row("活动类型", enumLabel(ACTIVITY, record.activityType || (raw.type !== "活动" ? raw.type : "")));
        row("报名状态", enumLabel(REGISTRATION, record.registrationStatus)); summary = record.summary;
        tags = [...new Set([...values(record.domainTags), ...values(record.topicTags)])];
      } else if (type === "练仿真") {
        row("分类", names(record.category || record.categories)); summary = record.summary;
        tags = values(record.domainTags); row("分类", names(record.category || record.categories), more); row("领域", names(record.domainTags), more);
      }
      const detailUrl = link(record.detailUrl), launchUrl = link(record.launchUrl), coverUrl = type === "练仿真" ? link(record.coverUrl) : "";
      const metadata = items => items.length ? `<dl class="portal-result-metadata">${items.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl>` : "";
      const article = doc.createElement("article");
      article.className = "portal-search-card";
      article.dataset.type = type; article.dataset.resultId = `${type}:${record.id}`; article.__personalResource = record;
      const detailId = `keyword-detail-${type}-${String(record.id).replace(/[^a-z0-9_-]/giu, "-")}`;
      const hasInlineDetail = type === "练仿真" || more.length > 0;
      const detailControl = detailUrl ? `<a class="portal-search-card-action is-primary" data-result-detail-link href="${esc(detailUrl)}" target="_blank" rel="noopener noreferrer">查看${type === "论文" ? "论文" : "资源"}详情 ↗</a>` : "";
      const launchControl = type === "练仿真" ? launchUrl
        ? `<a class="portal-search-card-action is-primary" data-keyword-launch href="${esc(launchUrl)}" target="_blank" rel="noopener noreferrer">开始仿真 ↗</a>`
        : '<button class="portal-search-card-action" type="button" disabled title="暂无可用启动入口">开始仿真</button><span class="keyword-v1-entry-unavailable">暂无可用启动入口</span>' : "";
      const fulltext = type === "报告" && scope === "全文检索";
      const hits = fulltext ? record.fulltextHits || [] : [];
      const hitButton = (hit, index) => `<li><button type="button" class="keyword-report-hit" data-report-hit="${index}" aria-label="定位第 ${esc(hit.pageNumber)} 页：${esc(hit.sentence)}"><span class="keyword-report-hit-page">第 ${esc(hit.pageNumber)} 页</span><span class="keyword-report-hit-sentence">${highlight(hit.sentence)}</span><span class="keyword-report-hit-open" aria-hidden="true">定位全文 ↗</span></button></li>`;
      const hitMarkup = fulltext ? `<section class="keyword-report-hits" aria-label="全文命中内容"><div class="keyword-report-hits-heading"><strong>全文命中 ${hits.length} 处</strong>${record.document?.sourceKind === "LOCAL_PROTOTYPE" ? '<span>原型示例正文（非报告原文）</span>' : ""}</div><ul>${hits.slice(0, 3).map(hitButton).join("")}</ul>${hits.length > 3 ? `<details class="keyword-report-more"><summary>展开其余 ${hits.length - 3} 处命中</summary><ul>${hits.slice(3).map((hit, index) => hitButton(hit, index + 3)).join("")}</ul></details>` : ""}</section>` : "";
      article.innerHTML = `<div class="portal-result-rail"><span class="portal-result-type-icon" data-result-type="${esc(type)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"></path></svg></span><span class="portal-result-index">${String(absoluteIndex + 1).padStart(2, "0")}</span></div>
        <div class="portal-result-content"><div class="portal-result-kicker"><span>${esc(typeLabel(type))}</span>${dateValue ? `<time>${esc(dateLabel)} ${esc(dateValue)}</time>` : ""}</div>
          ${coverUrl ? `<img class="keyword-v1-simulation-cover" src="${esc(coverUrl)}" alt="${esc(title)}封面" loading="lazy">` : ""}
          <h3 class="portal-search-card-title">${detailUrl ? `<a class="portal-result-detail-link" data-result-detail-link href="${esc(detailUrl)}" target="_blank" rel="noopener noreferrer">${highlight(title)}<span class="portal-title-external-mark" aria-hidden="true">↗</span><small>新标签页</small></a>` : `<span>${highlight(title)}</span>`}</h3>
          ${metadata(rows)}${!fulltext && present(summary) ? `<p class="portal-search-card-summary">${highlight(summary)}</p>` : ""}${hitMarkup}
          <div class="portal-result-bottomline"><div class="portal-search-card-tags">${tags.slice(0, 3).map(value => `<span class="portal-search-card-tag">${esc(value)}</span>`).join("")}</div><div class="portal-search-card-actions">
          ${hasInlineDetail ? `<button class="portal-search-card-action" type="button" data-keyword-detail aria-expanded="false" aria-controls="${esc(detailId)}">${type === "练仿真" ? "查看实验详情" : "展开信息"}</button>` : ""}${detailControl}${launchControl}</div></div>
          ${hasInlineDetail ? `<section class="portal-entity-detail" id="${esc(detailId)}" hidden><h4>${esc(title)}</h4>${metadata(more)}${type === "练仿真" && present(summary) ? `<p>${esc(summary)}</p>` : ""}</section>` : ""}</div>`;
      const toggle = article.querySelector("[data-keyword-detail]");
      toggle?.addEventListener("click", () => {
        const detail = article.querySelector(".portal-entity-detail"); detail.hidden = !detail.hidden;
        toggle.setAttribute("aria-expanded", String(!detail.hidden));
        toggle.textContent = detail.hidden ? type === "练仿真" ? "查看实验详情" : "展开信息" : "收起详情";
      });
      article.querySelectorAll("[data-report-hit]").forEach(button => button.addEventListener("click", () => {
        const opened = global.PortalReportReader?.open({ record, hitIndex: Number(button.dataset.reportHit), query, highlightTerms: record.searchHighlightTerms, trigger: button });
        if (!opened) bridge.feedback?.("该内容暂无法定位，请重新检索后重试。", "error");
      }));
      return article;
    }
    function sourceMessage(state) {
      const types = state.currentType === "全部" ? TYPES : [state.currentType];
      const entries = [];
      if (isUnconnected(state.currentType)) {
        sourceStatus.replaceChildren();
        sourceStatus.hidden = true;
        return;
      }
      if (state.authError) {
        sourceStatus.textContent = state.authError.message;
        sourceStatus.hidden = false;
        return;
      }
      types.forEach(type => {
        const source = state.sources?.[type];
        if (!source) return;
        if (source.status === "loading") entries.push(`<span>${esc(typeLabel(type))}加载中</span>`);
        else if (source.status === "error") entries.push(`<span>${esc(typeLabel(type))}：${esc(source.error || "检索失败")} <button type="button" data-keyword-retry="${esc(type)}">重试</button></span>`);
        else if (source.status === "unsupported") entries.push(`<span>${esc(typeLabel(type))}：${esc(source.error || "不支持该检索条件")}</span>`);
        else if (source.invalidCount > 0) entries.push(`<span>${esc(typeLabel(type))}部分数据异常，已略过无效条目</span>`);
      });
      sourceStatus.innerHTML = entries.join("");
      sourceStatus.hidden = !entries.length;
    }
    function renderTabs(state) {
      bridge.setTypeState?.(state.currentType);
      tabs.querySelectorAll("[data-search-type]").forEach(tab => {
        const type = tab.dataset.searchType, selected = type === state.currentType;
        const label = tab.querySelector("span");
        if (label) label.textContent = typeLabel(type);
        tab.classList.toggle("is-active", selected);
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        const counter = tab.querySelector("[data-search-type-count]");
        const source = state.sources?.[type];
        const value = type === "全部" ? state.allTotal : state.counts?.[type];
        if (counter) counter.textContent = isUnconnected(type) ? "待接入" : source?.status === "unsupported" ? "不支持" : Number.isFinite(value) ? String(value) : "—";
      });
      bridge.setLogicState?.(state.logic);
      doc.querySelectorAll(".keyword-v1-tools [data-keyword-logic]").forEach(button => {
        const selected = button.dataset.keywordLogic === state.logic;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
    }
    function renderEmpty(state, items) {
      const view = state.view || {}, all = state.currentType === "全部";
      const source = state.sources?.[state.currentType];
      const sourceStates = Object.values(state.sources || {});
      const anySuccess = sourceStates.some(value => value.status === "success");
      const paper = state.currentType === "论文", scoped = paper || state.currentType === "报告";
      let title = "未找到相关资源", text = state.currentType === "报告" ? "可尝试更换关键词、搜索范围或清除筛选条件。" : scoped ? "可尝试更换关键词或搜索范围。" : "可尝试更换关键词或清除筛选条件。", button = "清除筛选条件";
      let showButton = SECONDARY_TYPES.includes(state.currentType) && filterDescriptors(state).length > 0;
      emptyAction = "clear";
      if (isUnconnected(state.currentType)) { title = `${typeLabel(state.currentType)}待接入`; text = state.currentType === "练仿真" ? "练仿真搜索接口接入后可检索。" : "专利搜索接口接入后可检索并筛选。"; showButton = false; }
      else if (!state.query) { title = "请输入关键词"; text = "输入关键词后开始搜索。"; showButton = false; }
      else if (state.associationEmpty) { title = "请重新输入关键词"; text = "关键词已全部取消，请在上方输入关键词后搜索。"; showButton = false; }
      else if (state.authError) { title = state.authError.message; text = "重新登录后再继续检索。"; showButton = false; }
      else if (source?.status === "unsupported" || (all && !anySuccess && state.unsupportedTypes?.length && !state.loading)) { title = source?.error === "检索能力暂不可用" ? "检索能力暂不可用" : "不支持该检索条件"; text = scoped ? "当前资源暂不支持该检索条件，请切换搜索范围。" : "当前资源暂不支持该检索条件，请切换资源类型。"; button = "切换至标题和摘要"; emptyAction = "scope"; showButton = scoped && title !== "检索能力暂不可用"; }
      else if (state.loading && !items.length) { title = "正在检索……"; text = "各类资源正在加载。"; showButton = false; }
      else if (state.failedTypes?.length && (!items.length || view.status === "error")) { title = anySuccess ? "部分资源检索失败" : "搜索失败，请重试"; text = "失败来源未作为零结果统计。"; button = "重试"; emptyAction = "retry"; }
      else if (filterDescriptors(state).length && view.filterMode !== "server") {
        title = "本页暂无符合筛选条件的结果，可清除筛选或翻页";
        text = "仅筛选当前已返回数据，其他页可能仍有符合项。";
      } else if ((view.page || 1) > 1 || view.paginationUnknown || (Number.isFinite(view.total) && view.total > 0)) {
        title = "本页暂无结果";
        text = "可继续翻页或调整筛选条件。";
      }
      empty.hidden = items.length > 0;
      empty.querySelector("h2").textContent = title;
      empty.querySelector("p").textContent = text;
      const reset = get("portalEmptyReset");
      reset.textContent = button; reset.hidden = !showButton; reset.dataset.keywordEmptyAction = emptyAction;
    }
    function renderPaging(state) {
      const view = state.view || {}, all = state.currentType === "全部", page = Number(view.page) || 1;
      const hasMore = view.hasMore ?? state.hasMore;
      const disabled = state.loading || !state.query || state.associationEmpty || isUnconnected(state.currentType) || view.status === "unsupported";
      paging.replaceChildren();
      paging.hidden = !state.query || state.associationEmpty || isUnconnected(state.currentType) || (page === 1 && hasMore === false);
      if (paging.hidden) return;
      const make = (label, direction, off) => {
        const button = doc.createElement("button"); button.type = "button";
        button.className = "portal-search-page-button"; button.textContent = label;
        button.dataset.keywordPage = direction; button.disabled = Boolean(off);
        return button;
      };
      const current = doc.createElement("span");
      current.className = "keyword-v1-page-label";
      current.textContent = `第 ${page} 页`;
      paging.append(make("上一页", "previous", disabled || page <= 1), current, make("下一页", "next", disabled || hasMore === false));
    }
    function render() {
      if (!isKeyword()) { if (active) setActive(false); return false; }
      if (!active) { setActive(true); return true; }
      const state = model.snapshot(), view = state.view || {}, unconnected = isUnconnected(state.currentType);
      const items = unconnected ? [] : state.displayItems || view.displayItems || [];
      buildFilters(state); syncFilters(state); renderTabs(state); renderChips(state); sourceMessage(state);
      const total = view.total;
      if (unconnected) heading.textContent = "待接入";
      else if (!state.query) heading.textContent = "搜索结果";
      else if (state.authError) heading.textContent = state.authError.message;
      else if (state.sources?.[state.currentType]?.status === "unsupported") heading.textContent = "不支持该检索条件";
      else heading.textContent = Number.isFinite(total) ? `${total} 条结果` : state.loading ? "检索中" : "结果总数未知";
      const page = Number(view.page) || 1;
      range.textContent = unconnected ? `${typeLabel(state.currentType)}搜索接口待接入` : state.associationEmpty ? "请在上方输入关键词重新搜索" : !state.query ? "输入关键词后查看资源" : `第 ${page} 页 · 本页显示 ${items.length} 条${view.paginationUnknown ? " · 分页状态待确认" : ""}${state.retainedResults || view.retainedResults ? " · 仍显示原查询结果" : ""}`;
      hint.hidden = !state.query || !SECONDARY_TYPES.includes(state.currentType) || unconnected || view.status === "unsupported";
      hint.textContent = view.filterMode === "server" ? "按当前条件筛选全部结果" : "本页筛选 · 仅筛选当前已返回数据，其他页可能仍有符合项";
      const fragment = doc.createDocumentFragment();
      items.forEach((record, index) => {
        const absoluteIndex = Number.isFinite(view.startIndex) ? view.startIndex + index : (page - 1) * 10 + index;
        const card = renderCard(record, absoluteIndex, state.query, state.scope);
        if (card) fragment.append(card);
      });
      list.replaceChildren(fragment); list.hidden = !items.length;
      list.setAttribute("aria-busy", String(Boolean(state.loading)));
      renderEmpty(state, items); renderPaging(state);
      bridge.onRender?.(state);
      return true;
    }

    function reportError(error) { bridge.feedback?.(error?.message || "搜索失败，请重试", "error"); }
    function action(result) { Promise.resolve(result).catch(reportError); }
    async function submit(query, options) {
      options = options || {};
      query = String(query == null ? "" : query).trim();
      const validation = global.PortalKeywordModel.validate(query);
      if (validation) { bridge.feedback?.(validation.message, "error"); (options.focusTarget || input)?.focus(); return false; }
      const ticket = ++submitting, context = contextKey();
      bridge.setCommitted?.(query, options);
      bridge.showSearch?.();
      setActive(true);
      bridge.feedback?.("");
      const prior = model.snapshot();
      const requestedType = options.resourceType || options.type || prior.currentType || bridge.getType?.() || "全部";
      try {
        await model.submit(query, { scope: options.scope || (requestedType === prior.currentType ? prior.scope : undefined) || "全部资源", logic: "AND", type: requestedType, disabledAutomaticRuleGroups: options.disabledAutomaticRuleGroups, associationQuery: options.associationQuery, associationConditions: options.associationConditions });
        const current = model.snapshot();
        if (ticket === submitting && context === contextKey() && current.query === query && options.trackSearch !== false) bridge.onSubmit?.(query, options, current.displayItems || []);
        return true;
      } catch (error) { reportError(error); return false; }
    }
    function onSubmit(event) {
      if (!active || !isKeyword() || event.target !== resultForm) return;
      event.preventDefault(); event.stopImmediatePropagation(); action(submit(input.value, { preserveDraft: true }));
    }
    function onChange(event) {
      if (!active || !isKeyword() || !form.contains(event.target)) return;
      const control = event.target;
      if (!control.name || control.disabled) return;
      event.stopImmediatePropagation();
      if (control.name === "resourceScope") { action(model.setScope(control.value)); return; }
      if (event.type === "input" && control.type !== "search") return;
      if (event.type === "change" && control.type === "search") return;
      if (control.type === "checkbox") {
        action(model.setFilter(control.name, Array.from(form.querySelectorAll(`input[name="${control.name}"]:checked`)).map(node => node.value)));
      } else if (control.name === "publishTime" && control.value !== "自定义") action(model.setFilter({ publishTime: control.value, dateFrom: "", dateTo: "" }));
      else action(model.setFilter(control.name, control.value));
    }
    function onClick(event) {
      if (!active || !isKeyword()) return;
      const target = event.target.closest("button");
      if (!target) return;
      const typeTab = target.closest("[data-search-type]");
      const logic = target.closest(".keyword-v1-tools [data-keyword-logic]");
      let operation = null;
      if (typeTab && tabs.contains(typeTab)) operation = () => model.selectType(typeTab.dataset.searchType);
      else if (logic) operation = () => model.setLogic(logic.dataset.keywordLogic);
      else if (target.dataset.keywordPage) operation = () => model.page(target.dataset.keywordPage);
      else if (target.dataset.keywordRetry) operation = () => model.retry(target.dataset.keywordRetry);
      else if (target.dataset.keywordRemoveFilter) operation = () => model.setFilter(target.dataset.keywordRemoveFilter, ["domains", "sources", "reportTypes"].includes(target.dataset.keywordRemoveFilter) ? [] : "");
      else if (target.hasAttribute("data-keyword-clear-filters") || target.id === "portalSearchReset") operation = () => model.clearFilters();
      else if (target.id === "portalEmptyReset") operation = () => {
        if (emptyAction === "scope") return model.setScope("标题和摘要");
        if (emptyAction === "retry") return Promise.all((model.snapshot().failedTypes || []).map(type => model.retry(type)));
        return model.clearFilters();
      };
      if (!operation) return;
      event.preventDefault(); event.stopImmediatePropagation(); action(operation());
    }
    doc.addEventListener("submit", onSubmit, true);
    doc.addEventListener("change", onChange, true);
    doc.addEventListener("input", onChange, true);
    doc.addEventListener("click", onClick, true);
    unsubscribe = model.subscribe(() => { if (active && isKeyword()) render(); });
    unsubscribeContext = global.PortalSearchRecommend?.subscribe?.(() => {
      const next = contextKey();
      if (next === observedContext) return;
      observedContext = next;
      submitting += 1;
      action(model.refreshContext());
    });
    const api = { submit, render, setActive, model, setType: type => model.selectType(type), snapshot: () => model.snapshot(), destroy() {
      setActive(false); unsubscribe?.(); unsubscribeContext?.();
      doc.removeEventListener("submit", onSubmit, true); doc.removeEventListener("change", onChange, true);
      doc.removeEventListener("input", onChange, true); doc.removeEventListener("click", onClick, true);
      hint.remove(); sourceStatus.remove();
    } };
    return api;
  }
  global.PortalKeywordUI = Object.freeze({ create });
})(typeof window !== "undefined" ? window : globalThis);
