(function (global) {
  "use strict";

  // This controller owns the keyword result surface only. Original nodes are
  // restored, rather than re-created, when another search mode is selected.
  const TYPES = ["论文", "专利", "报告", "人才", "资讯", "会议", "课程", "活动", "练仿真"];
  const isUnconnected = type => type === "专利" || type === "练仿真";
  const LABELS = {
    personNameFilter: "学者姓名", institutionFilter: "机构名称", researchFieldFilter: "研究领域",
    authorFilter: "作者", venueFilter: "会议／期刊", ipcFilter: "IPC 分类",
    applicantFilter: "申请人", inventorFilter: "发明人", applicationStart: "申请时间（起）",
    applicationEnd: "申请时间（止）", publicationStart: "公布时间（起）", publicationEnd: "公布时间（止）",
    reportType: "报告类型", conferenceLocation: "会议地点", conferenceLevel: "会议等级",
    conferenceSubmission: "投稿状态", conferenceStartFrom: "开始时间（起）", conferenceStartTo: "开始时间（止）",
    courseLecturer: "讲师", courseInstitution: "授课机构", courseLevel: "课程等级",
    activityLocation: "活动地点", activityType: "活动类型", activityRegistration: "报名状态",
    activityStartFrom: "开始时间（起）", activityStartTo: "开始时间（止）",
    sources: "来源", domains: "学科领域", publishTime: "时间", dateFrom: "日期（起）", dateTo: "日期（止）"
  };
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
    const model = bridge.model || global.PortalKeywordModel.create({ records, getUserContext: bridge.getUserContext });
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
        : `<input type="${type || "search"}" name="${esc(name)}"${placeholder ? ` placeholder="${esc(placeholder)}"` : ""}>`;
      return `<label><span>${esc(label)}</span>${control}</label>`;
    }
    function checks(name, values) {
      if (!values.length) return `<p class="portal-resource-filter-hint">暂无可用选项</p>`;
      return `<div class="keyword-v1-filter-options">${values.map(value => `<label class="portal-search-filter-option"><input type="checkbox" name="${esc(name)}" value="${esc(value)}"><span>${esc(value)}</span></label>`).join("")}</div>`;
    }
    function buildFilters(state) {
      const type = state.currentType, dictionaries = state.dictionaries || {};
      const domains = dictionaries.domains?.[type] || [];
      const sources = dictionaries.sources?.[type] || [];
      const levels = dictionaries.levels?.[type] || [];
      const signature = JSON.stringify([type, domains, sources, levels, dictionaries.reportTypes || []]);
      if (signature === filterSignature) return;
      filterSignature = signature;
      let html = type === "论文" ? group("搜索范围", ["全部资源", "仅标题", "标题与摘要"].map(scope => `<label class="portal-search-filter-option"><input type="radio" name="resourceScope" value="${esc(scope)}"><span>${esc(scope)}</span></label>`).join("")) : "";
      let professional = "";
      if (type === "人才") {
        professional = field("personNameFilter", "search", null, "学者姓名") + field("institutionFilter", "search", null, "机构名称") + field("researchFieldFilter", null, domains);
      } else if (type === "论文") {
        professional = field("authorFilter", "search", null, "作者姓名") + field("venueFilter", "search", null, "会议或期刊名称");
      } else if (type === "专利") {
        professional = field("ipcFilter", "search", null, "例如 G16B") + field("applicantFilter", "search", null, "申请人名称") + field("inventorFilter", "search", null, "发明人姓名") + field("applicationStart", "date") + field("applicationEnd", "date") + field("publicationStart", "date") + field("publicationEnd", "date");
      } else if (type === "报告") {
        professional = field("reportType", null, dictionaries.reportTypes || []);
      } else if (type === "会议") {
        professional = field("conferenceLocation", "search", null, "会议地点") + field("conferenceLevel", null, levels) + field("conferenceSubmission", null, SUBMISSION) + field("conferenceStartFrom", "date") + field("conferenceStartTo", "date");
      } else if (type === "课程") {
        professional = field("courseLecturer", "search", null, "讲师") + field("courseInstitution", "search", null, "授课机构") + field("courseLevel", null, levels);
      } else if (type === "活动") {
        professional = field("activityLocation", "search", null, "活动地点") + field("activityType", null, ACTIVITY) + field("activityRegistration", null, REGISTRATION) + field("activityStartFrom", "date") + field("activityStartTo", "date");
      }
      const prompt = type === "全部" ? "选择具体资源类型后，展示对应的专业筛选项。" : isUnconnected(type) ? `${type}搜索待接入。` : "";
      if (professional || prompt) html += group("二次筛选", `${prompt ? `<p class="portal-resource-filter-hint">${esc(prompt)}</p>` : ""}<div class="portal-resource-filter">${professional}</div>`, "portal-search-filter-fields");
      if (["论文", "报告", "资讯", "课程"].includes(type)) {
        const title = type === "报告" ? "上传时间" : type === "资讯" || type === "课程" ? "发布时间" : "发表时间";
        html += group(title, ["不限时间", "近一年", "近三年", "近五年", "自定义"].map(value => `<label class="portal-search-filter-option"><input type="radio" name="publishTime" value="${value}"><span>${value}</span></label>`).join("") + `<div class="portal-resource-filter keyword-v1-custom-dates" data-keyword-custom-dates>${field("dateFrom", "date")}${field("dateTo", "date")}</div>`);
      }
      if (type === "人才") {
        html += group("学科领域", `<p class="portal-resource-filter-hint">独立学科字段暂未接入</p>${domains.slice(0, 4).map(value => `<label class="portal-search-filter-option"><input type="checkbox" disabled><span>${esc(value)}</span></label>`).join("")}`);
      } else if (domains.length || type === "全部") {
        html += group("学科领域", checks("domains", domains));
      }
      if (["报告", "资讯"].includes(type)) html += group("来源", checks("sources", sources));
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
        control.disabled = loading || unconnected || unavailable || !state.query;
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
        if (source.status === "loading") entries.push(`<span>${esc(type)}加载中</span>`);
        else if (source.status === "error") entries.push(`<span>${esc(type)}：${esc(source.error || "检索失败")} <button type="button" data-keyword-retry="${esc(type)}">重试</button></span>`);
        else if (source.status === "unsupported") entries.push(`<span>${esc(type)}：${esc(source.error || "不支持该检索条件")}</span>`);
        else if (source.invalidCount > 0) entries.push(`<span>${esc(type)}部分数据异常，已略过无效条目</span>`);
      });
      sourceStatus.innerHTML = entries.join("");
      sourceStatus.hidden = !entries.length;
    }
    function renderTabs(state) {
      bridge.setTypeState?.(state.currentType);
      tabs.querySelectorAll("[data-search-type]").forEach(tab => {
        const type = tab.dataset.searchType, selected = type === state.currentType;
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
      const paper = state.currentType === "论文";
      let title = "未找到相关资源", text = paper ? "可尝试更换关键词或搜索范围。" : "可尝试更换关键词或清除筛选条件。", button = "清除筛选条件";
      let showButton = true;
      emptyAction = "clear";
      if (isUnconnected(state.currentType)) { title = `${state.currentType}待接入`; text = state.currentType === "练仿真" ? "练仿真搜索接口接入后可检索。" : "专利搜索接口接入后可检索并筛选。"; showButton = false; }
      else if (!state.query) { title = "请输入关键词"; text = "输入关键词后开始搜索。"; showButton = false; }
      else if (state.authError) { title = state.authError.message; text = "重新登录后再继续检索。"; showButton = false; }
      else if (source?.status === "unsupported" || (all && !anySuccess && state.unsupportedTypes?.length && !state.loading)) { title = source?.error === "检索能力暂不可用" ? "检索能力暂不可用" : "不支持该检索条件"; text = paper ? "当前资源暂不支持该检索条件，请切换搜索范围。" : "当前资源暂不支持该检索条件，请切换资源类型。"; button = "切换至全部资源"; emptyAction = "scope"; showButton = paper && title !== "检索能力暂不可用"; }
      else if (state.loading && !items.length) { title = "正在检索……"; text = "各类资源正在加载。"; showButton = false; }
      else if (state.failedTypes?.length && (!items.length || view.status === "error")) { title = anySuccess ? "部分资源检索失败" : "搜索失败，请重试"; text = "失败来源未作为零结果统计。"; button = "重试"; emptyAction = "retry"; }
      else if (filterDescriptors(state).length && view.filterMode !== "server") {
        title = all ? "本批暂无符合筛选条件的结果，可清除筛选或翻页" : "本页暂无符合筛选条件的结果，可清除筛选或翻页";
        text = "仅筛选当前已返回数据，其他页可能仍有符合项。";
      } else if ((view.page || 1) > 1 || view.paginationUnknown || (Number.isFinite(view.total) && view.total > 0)) {
        title = all ? "本批暂无结果" : "本页暂无结果";
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
      const disabled = state.loading || !state.query || isUnconnected(state.currentType) || view.status === "unsupported";
      paging.replaceChildren();
      paging.hidden = !state.query || isUnconnected(state.currentType) || (page === 1 && hasMore === false);
      if (paging.hidden) return;
      const make = (label, direction, off) => {
        const button = doc.createElement("button"); button.type = "button";
        button.className = "portal-search-page-button"; button.textContent = label;
        button.dataset.keywordPage = direction; button.disabled = Boolean(off);
        return button;
      };
      const current = doc.createElement("span");
      current.className = "keyword-v1-page-label";
      current.textContent = `第 ${page} ${all ? "批" : "页"}`;
      paging.append(make(all ? "上一批" : "上一页", "previous", disabled || page <= 1), current, make(all ? "下一批" : "下一页", "next", disabled || hasMore === false));
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
      const unit = state.currentType === "全部" ? "批" : "页", page = Number(view.page) || 1;
      range.textContent = unconnected ? `${state.currentType}搜索接口待接入` : !state.query ? "输入关键词后查看资源" : `第 ${page} ${unit} · 本${unit}显示 ${items.length} 条${view.paginationUnknown ? " · 分页状态待确认" : ""}${state.retainedResults || view.retainedResults ? " · 仍显示原查询结果" : ""}`;
      if (state.currentType === "全部" && state.query) range.textContent += " · 已接通资源范围";
      hint.hidden = !state.query || unconnected || view.status === "unsupported";
      hint.textContent = view.filterMode === "server" ? "按当前条件筛选全部结果" : `本${unit}筛选 · 仅筛选当前已返回数据，其他页可能仍有符合项`;
      const fragment = doc.createDocumentFragment();
      items.forEach((record, index) => {
        const absoluteIndex = state.currentType === "全部" ? index : (page - 1) * 10 + index;
        const card = bridge.renderCard(record, index, absoluteIndex);
        if (card) fragment.append(card);
      });
      list.replaceChildren(fragment); list.hidden = !items.length;
      list.setAttribute("aria-busy", String(Boolean(state.loading)));
      renderEmpty(state, items); renderPaging(state);
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
        await model.submit(query, { scope: prior.scope || "全部资源", logic: "AND", type: requestedType });
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
      else if (target.dataset.keywordRemoveFilter) operation = () => model.setFilter(target.dataset.keywordRemoveFilter, ["domains", "sources"].includes(target.dataset.keywordRemoveFilter) ? [] : "");
      else if (target.hasAttribute("data-keyword-clear-filters") || target.id === "portalSearchReset") operation = () => model.clearFilters();
      else if (target.id === "portalEmptyReset") operation = () => {
        if (emptyAction === "scope") return model.setScope("全部资源");
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
