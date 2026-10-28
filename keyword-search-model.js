(function (root) {
  "use strict";

  const TYPES = ["论文", "专利", "报告", "人才", "资讯", "会议", "课程", "活动", "练仿真"];
  const isUnconnected = type => type === "专利" || type === "练仿真";
  const CONNECTED = TYPES.filter(type => !isUnconnected(type));
  const PAGE_SIZE = 10;
  const segmenter = typeof Intl.Segmenter === "function" ? new Intl.Segmenter("zh-CN", { granularity: "word" }) : null;
  const normalize = value => String(value == null ? "" : value)
    .replace(/[！-～]/g, char => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/\u3000/g, " ").toLowerCase().replace(/\s+/gu, " ").trim();
  const copy = value => JSON.parse(JSON.stringify(value));
  const list = value => Array.isArray(value) ? value.filter(value => value != null && value !== "") : value == null || value === "" ? [] : [value];
  const textList = value => list(value).map(value => typeof value === "object" ? value.name : value).filter(Boolean);

  function parse(input) {
    const query = String(input == null ? "" : input).trim();
    const fail = message => ({ query, fullQuery: "", terms: [], error: { field: "query", message } });
    if (!query) return fail("请输入关键词");
    if ([...query].length > 200) return fail("关键词最多200个字符");
    const syntax = query.replace(/[！-～]/g, char => String.fromCharCode(char.charCodeAt(0) - 0xfee0)).replace(/\u3000/g, " ");
    let closing = "", buffer = "", quoted = false;
    const terms = [];
    const flush = () => { const text = normalize(buffer); if (text) terms.push({ text, phrase: quoted }); buffer = ""; };
    for (const char of syntax) {
      if (closing) {
        if (char === closing) { flush(); closing = ""; quoted = false; }
        else buffer += char;
      } else if (char === '"' || char === "“") {
        flush(); quoted = true; closing = char === "“" ? "”" : '"';
      } else if (char === "”") return fail("精确查找的引号需成对，请补全或删除引号后重试。");
      else if (/\s/u.test(char)) flush();
      else buffer += char;
    }
    if (closing) return fail("精确查找的引号需成对，请补全或删除引号后重试。");
    flush();
    if (!terms.length) return fail("请输入关键词");
    const outer = /^(?:"[^"]*"|“[^”]*”)$/u.test(syntax);
    return { query, fullQuery: normalize(outer ? syntax.slice(1, -1) : syntax), terms, error: null };
  }
  const validate = query => parse(query).error;

  function titleFields(record) {
    if (record.type === "人才") return [];
    return record.type === "会议" ? [record.name || record.title, record.fullNameEn] : [record.title || record.name];
  }
  function fields(record, scope) {
    const titles = titleFields(record);
    if (scope === "仅标题") return titles;
    const summary = record.type === "论文" ? record.abstract : record.summary;
    if (scope === "标题与摘要") return record.type === "人才" ? [] : [...titles, ...(record.type === "会议" ? [] : [summary])];
    switch (record.type) {
      case "论文": return [...titles, record.abstract, ...textList(record.authors), record.source, ...list(record.tags)];
      case "报告": return [...titles, record.summary, record.source, record.reportType, ...list(record.domainTags)];
      case "人才": return [record.name, record.institution, ...list(record.researchFields), ...list(record.researchDirections)];
      case "资讯": return [...titles, record.summary, record.source, ...list(record.domainTags)];
      case "会议": return [...titles, record.location, record.level, ...list(record.tags)];
      case "课程": return [...titles, record.summary, ...textList(record.lecturers), record.institution, record.level, ...list(record.domainTags)];
      case "活动": return [...titles, record.summary, record.organizer, record.location, record.activityType, ...list(record.domainTags), ...list(record.topicTags)];
      default: return [];
    }
  }
  function whole(value, term) {
    const haystack = normalize(value), needle = normalize(term);
    if (!haystack || !needle) return false;
    if (haystack === needle) return true;
    const boundaries = new Set([0, haystack.length]);
    if (segmenter) for (const part of segmenter.segment(haystack)) { boundaries.add(part.index); boundaries.add(part.index + part.segment.length); }
    else for (let index = 0; index <= haystack.length; index++) {
      if (index === 0 || index === haystack.length || !/[a-z0-9_]/iu.test(haystack[index - 1]) || !/[a-z0-9_]/iu.test(haystack[index])) boundaries.add(index);
    }
    for (let index = haystack.indexOf(needle); index >= 0; index = haystack.indexOf(needle, index + 1)) {
      if (boundaries.has(index) && boundaries.has(index + needle.length)) return true;
    }
    return false;
  }
  function match(record, parsed, scope, logic) {
    if (typeof parsed === "string") parsed = parse(parsed);
    if (!parsed || parsed.error || !parsed.terms.length || record.type === "人才" && scope !== "全部资源") return false;
    const allowed = fields(record, scope || "全部资源").filter(value => value != null);
    const values = parsed.terms.map(term => allowed.some(value => whole(value, term.text)));
    return logic === "OR" ? values.some(Boolean) : values.every(Boolean);
  }

  // Explicit IDs are part of this legacy demo fixture definition, not response repair.
  const LEGACY_IDS = ["kw-paper-deep-learning-ai", "kw-paper-scientific-agents", "kw-paper-drug-target", "kw-paper-material-model", "kw-patent-drug-target", "kw-scholar-zhou", "kw-report-ai-2026", "kw-patent-electrolyte", "kw-scholar-lin", "kw-scholar-chen", "kw-news-low-altitude", "kw-project-quantum", "kw-report-future-industries", "kw-news-science-tools"];
  const LEGACY_AUTHORS = [["Yoshua Bengio", "Yann LeCun", "Geoffrey Hinton"], ["陈晓岚", "王祺"], ["李铭", "周明远"], ["原型作者"]];
  function createFixtures(items) {
    return items.filter(item => TYPES.includes(item.type)).map(item => {
      const index = items.indexOf(item), type = item.type;
      const record = { ...item, raw: item, id: item.id || item.portalResourceId || item.portalPaperId || LEGACY_IDS[index] || null };
      record.domainTags = list(item.domainTags || item.tags);
      if (type === "论文") { record.abstract = item.abstract === undefined ? item.summary : item.abstract; record.authors = item.authors || (LEGACY_AUTHORS[index] || []).map(name => ({ name })); record.publishedAt = item.publishedAt || item.date; }
      if (type === "人才") { record.name = item.name || item.personName; record.researchFields = list(item.researchFields || item.tags); record.researchDirections = list(item.researchDirections || String(item.title || "").split(/\s*·\s*/u).slice(1).join(" · ")); }
      if (type === "报告") { record.uploadedAt = item.uploadedAt || item.date; record.reportType = item.reportType || String(item.meta || "").split("·")[0].trim(); }
      if (type === "资讯") record.publishedAt = item.publishedAt || item.date;
      if (["会议", "课程", "活动"].includes(type)) record.name = item.name || item.title;
      return record;
    });
  }

  const ALIASES = { personName: "personNameFilter", institution: "institutionFilter", author: "authorFilter", venue: "venueFilter", ipc: "ipcFilter", applicant: "applicantFilter", inventor: "inventorFilter", applicationFrom: "applicationStart", applicationTo: "applicationEnd", publicationFrom: "publicationStart", publicationTo: "publicationEnd", domainTags: "domains", researchFields: "researchFieldFilter", reportTypes: "reportType", lecturer: "courseLecturer", registrationStatus: "activityRegistration" };
  function normalizedFilters(filters, type) {
    const result = {};
    Object.entries(filters || {}).forEach(([key, value]) => { result[ALIASES[key] || key] = value; });
    if (result.location !== undefined) result[type === "会议" ? "conferenceLocation" : "activityLocation"] = result.location;
    if (result.level !== undefined) result[type === "会议" ? "conferenceLevel" : "courseLevel"] = result.level;
    if (result.submissionStatus !== undefined) result.conferenceSubmission = result.submissionStatus;
    if (result.startFrom !== undefined) result[type === "会议" ? "conferenceStartFrom" : "activityStartFrom"] = result.startFrom;
    if (result.startTo !== undefined) result[type === "会议" ? "conferenceStartTo" : "activityStartTo"] = result.startTo;
    if (result.institutions !== undefined) result.institutionFilter = result.institutions;
    if (result.authorNames !== undefined) result.authorFilter = result.authorNames;
    if (result.lecturerNames !== undefined) result.courseLecturer = result.lecturerNames;
    return result;
  }
  const nonempty = value => list(value).length > 0;
  function day(value) {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return "";
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
    return ["year", "month", "day"].map(type => parts.find(part => part.type === type).value).join("-");
  }
  function filterError(filters) {
    const ranges = [["dateFrom", "dateTo"], ["publishedFrom", "publishedTo"], ["uploadedFrom", "uploadedTo"], ["applicationStart", "applicationEnd"], ["applicationFrom", "applicationTo"], ["publicationStart", "publicationEnd"], ["publicationFrom", "publicationTo"], ["conferenceStartFrom", "conferenceStartTo"], ["activityStartFrom", "activityStartTo"], ["startFrom", "startTo"]];
    for (const [from, to] of ranges) if (filters[from] && filters[to] && String(filters[from]) > String(filters[to])) return { field: from, message: "开始日期不能晚于结束日期" };
    for (const key of ["minHIndex", "maxHIndex"]) if (filters[key] !== "" && filters[key] != null && (!Number.isInteger(Number(filters[key])) || Number(filters[key]) < 0)) return { field: key, message: "H指数须为非负整数" };
    if (nonempty(filters.minHIndex) && nonempty(filters.maxHIndex) && Number(filters.minHIndex) > Number(filters.maxHIndex)) return { field: "minHIndex", message: "H指数下限不能大于上限" };
    return null;
  }
  function filterRecord(record, input, now) {
    const f = normalizedFilters(input, record.type), type = record.type;
    const contains = (actual, value) => !nonempty(value) || list(value).some(needle => list(actual).some(item => normalize(typeof item === "object" ? item.name : item).includes(normalize(needle))));
    const equals = (actual, value) => !nonempty(value) || list(value).some(needle => list(actual).some(item => normalize(item) === normalize(needle)));
    const date = (actual, from, to) => (!from || day(actual) && day(actual) >= from) && (!to || day(actual) && day(actual) <= to);
    if (!equals(record.domainTags || record.tags || record.researchFields, f.domains)) return false;
    if (!equals(record.source, f.sources)) return false;
    let timeField = type === "报告" ? record.uploadedAt : ["论文", "资讯", "课程"].includes(type) ? record.publishedAt : null;
    let from = f.dateFrom || f.publishedFrom || f.uploadedFrom, to = f.dateTo || f.publishedTo || f.uploadedTo;
    const years = { "近一年": 1, "近三年": 3, "近五年": 5 }[f.publishTime];
    if (years) { const today = new Date(now()); today.setUTCFullYear(today.getUTCFullYear() - years); from = day(today.toISOString()); }
    if (!date(timeField, from, to)) return false;
    if (type === "人才") return contains(record.name, f.personNameFilter) && contains(record.institution, f.institutionFilter) && equals(record.researchFields, f.researchFieldFilter) && (!nonempty(f.minHIndex) || Number.isFinite(record.hIndex) && record.hIndex >= Number(f.minHIndex)) && (!nonempty(f.maxHIndex) || Number.isFinite(record.hIndex) && record.hIndex <= Number(f.maxHIndex));
    if (type === "论文") return contains(textList(record.authors), f.authorFilter) && contains(record.source, f.venueFilter);
    if (type === "报告") return equals(record.reportType, f.reportType);
    if (type === "会议") return contains(record.location, f.conferenceLocation) && equals(record.level, f.conferenceLevel) && equals(record.submissionStatus, f.conferenceSubmission) && date(record.startAt, f.conferenceStartFrom, f.conferenceStartTo);
    if (type === "课程") return contains(textList(record.lecturers), f.courseLecturer) && contains(record.institution, f.courseInstitution || f.institutionFilter) && equals(record.level, f.courseLevel);
    if (type === "活动") return contains(record.location, f.activityLocation) && equals(record.activityType || record.kind, f.activityType) && equals(record.registrationStatus, f.activityRegistration) && date(record.startAt, f.activityStartFrom, f.activityStartTo);
    return true;
  }

  function create(options) {
    options = options || {};
    const records = options.records || [], now = options.now || (() => new Date().toISOString());
    const getUserContext = options.getUserContext || (() => "demo-user");
    const capabilities = options.capabilities || {};
    const listeners = new Set(), cache = new Map(), endPages = new Map();
    const contextKey = () => { const value = getUserContext(); return typeof value === "string" ? value : JSON.stringify(value); };
    let userContext = contextKey(), version = 0, query = "", logic = "AND", currentType = "全部", validation = null, authError = null;
    const makeView = type => ({ type, scope: "全部资源", scopeVersion: 0, page: 1, filters: {}, sources: {}, loaded: false, loading: false, requestToken: 0, pendingPage: null, retainedResults: false, error: null, validation: null });
    let views = Object.fromEntries(["全部", ...TYPES].map(type => [type, makeView(type)]));
    const viewScope = view => view.type === "论文" ? view.scope : "全部资源";
    const scopeNamespace = view => view.type === "论文" ? `paper:${view.scopeVersion}` : "shared";
    const cap = type => ({ exact: true, scopes: type === "人才" ? ["全部资源"] : ["全部资源", "仅标题", "标题与摘要"], serverFilters: false, ...capabilities[type] });
    const eligible = (type, view) => !isUnconnected(type) && cap(type).exact && cap(type).scopes.includes(viewScope(view));
    const localMode = view => view.type === "全部" ? !CONNECTED.every(type => !eligible(type, view) || cap(type).serverFilters) : !cap(view.type).serverFilters;
    const sourceKey = (type, page, filters, requestScope, view) => JSON.stringify([userContext, query, requestScope, logic, version, type, page, filters, scopeNamespace(view)]);
    const endKey = (type, filters, requestScope, view) => JSON.stringify([userContext, query, requestScope, logic, version, type, filters, scopeNamespace(view)]);
    const dictionaries = { sources: {}, domains: {}, reportTypes: [], levels: {} };
    const unique = values => [...new Set(values.filter(value => value != null && value !== ""))];
    TYPES.forEach(type => { const items = records.filter(record => record.type === type); dictionaries.sources[type] = unique(items.map(item => item.source)); dictionaries.domains[type] = unique(items.flatMap(item => list(item.domainTags || item.tags || item.researchFields))); dictionaries.levels[type] = unique(items.map(item => item.level)); });
    dictionaries.domains["全部"] = unique(CONNECTED.flatMap(type => dictionaries.domains[type]));
    dictionaries.reportTypes = unique(records.filter(record => record.type === "报告").map(item => item.reportType));

    function mainRecords(request) {
      const parsed = parse(request.query);
      let candidates = records.filter(record => record.type === request.type);
      const exactTitles = candidates.filter(record => titleFields(record).some(title => normalize(title) === parsed.fullQuery));
      candidates = exactTitles.length ? exactTitles : candidates.filter(record => match(record, parsed, request.scope, request.logic));
      if (request.filters && Object.keys(request.filters).length) candidates = candidates.filter(record => filterRecord(record, request.filters, now));
      return candidates;
    }
    async function demoService(request) {
      await new Promise(resolve => setTimeout(resolve, 70 + Math.max(0, TYPES.indexOf(request.type)) * 12));
      const all = mainRecords(request), start = (request.page - 1) * PAGE_SIZE;
      return { requestId: `mock-keyword-${request.queryVersion}-${request.type}-${request.page}`, executionKind: "LOCAL_MOCK", data: { page: request.page, pageSize: PAGE_SIZE, items: all.slice(start, start + PAGE_SIZE), total: all.length, hasMore: start + PAGE_SIZE < all.length } };
    }
    const service = options.service ? typeof options.service === "function" ? options.service : request => options.service.search(request) : demoService;
    function normalizeResponse(response, type, page) {
      if (response && (response.code === "AUTH_REQUIRED" || response.code === "UNAUTHORIZED" || Number(response.code) === 401)) throw Object.assign(new Error(response.message || "请登录"), { code: response.code === "UNAUTHORIZED" ? 401 : response.code, requestId: response.requestId });
      if (response && (response.code === "FORBIDDEN" || Number(response.code) === 403)) throw Object.assign(new Error("无权访问该资源"), { code: 403, requestId: response.requestId });
      const data = response && (response.data || response);
      if (!data || !Array.isArray(data.items)) throw Object.assign(new Error("数据格式异常"), { code: "INVALID_RESPONSE" });
      const valid = [], seen = new Set(); let invalidCount = 0;
      data.items.forEach(item => {
        if (!item || item.id == null || String(item.id).trim() === "" || !String(item.title || item.name || "").trim()) { invalidCount++; return; }
        const key = `${type}:${item.id}`;
        if (seen.has(key)) return;
        seen.add(key); valid.push({ ...item, type, raw: item.raw || item, title: item.title || item.name });
      });
      if (data.items.length && !valid.length) throw Object.assign(new Error("返回数据异常"), { code: "INVALID_RECORDS", requestId: response.requestId });
      const total = Number.isInteger(data.total) && data.total >= 0 ? data.total : null;
      const hasMore = typeof data.hasMore === "boolean" ? data.hasMore : total == null ? null : page * PAGE_SIZE < total;
      return { status: "success", page, rawItems: valid, total, hasMore, paginationUnknown: hasMore == null, error: null, invalidCount, requestId: response.requestId || null };
    }
    function idleSource(type, page, view) { return { status: isUnconnected(type) ? "unconnected" : !eligible(type, view) ? "unsupported" : "idle", page, rawItems: [], displayItems: [], total: null, hasMore: isUnconnected(type) || !eligible(type, view) ? false : null, paginationUnknown: false, error: isUnconnected(type) ? "待接入" : !eligible(type, view) ? cap(type).exact ? "不支持该检索条件" : "检索能力暂不可用" : null }; }
    function materializeSource(source, view) {
      const result = { ...source, rawItems: source.rawItems || [] };
      result.displayItems = result.status === "success" ? localMode(view) ? result.rawItems.filter(record => filterRecord(record, view.filters, now)) : result.rawItems : [];
      return result;
    }
    function totalForView(view) {
      const types = (view.type === "全部" ? TYPES : [view.type]).filter(type => eligible(type, view));
      const sources = types.map(type => view.sources[type]);
      return sources.length && sources.every(source => source && source.status === "success" && source.total != null) ? sources.reduce((sum, source) => sum + source.total, 0) : null;
    }
    function snapshot() {
      const view = views[currentType], scope = viewScope(view), typeList = currentType === "全部" ? TYPES : [currentType];
      const stateSources = Object.fromEntries(typeList.map(type => [type, materializeSource((view.pending && !view.pending.committed ? view.pending.sources[type] : view.failureSources ? view.failureSources[type] : view.sources[type]) || idleSource(type, view.page, view), view)]));
      const resultSources = view.retainedResults || view.pending && !view.pending.committed && view.loaded ? view.sources : stateSources;
      const renderedSources = Object.fromEntries(typeList.map(type => [type, materializeSource(resultSources[type] || idleSource(type, view.page, view), view)]));
      const displayItems = typeList.flatMap(type => renderedSources[type].displayItems), rawItems = typeList.flatMap(type => renderedSources[type].rawItems);
      const activeSources = typeList.filter(type => eligible(type, view)).map(type => renderedSources[type]);
      const total = activeSources.length && activeSources.every(source => source.status === "success" && source.total != null) ? activeSources.reduce((sum, source) => sum + source.total, 0) : null;
      const failedTypes = typeList.filter(type => stateSources[type].status === "error");
      const unsupportedTypes = typeList.filter(type => stateSources[type].status === "unsupported");
      const hasMore = !(view.pending && view.pending.failed) && activeSources.some(source => source.status === "success" && source.hasMore !== false);
      const counts = {};
      TYPES.forEach(type => { const source = currentType === "全部" ? stateSources[type] : type === currentType ? stateSources[type] : views["全部"].sources[type]; counts[type] = source && source.status === "success" ? source.total : null; });
      const allTotal = totalForView(views["全部"]);
      counts["全部"] = allTotal;
      const publicView = { type: view.type, scope, page: view.page, pendingPage: view.pendingPage, filters: copy(view.filters), filterMode: localMode(view) ? "local" : "server", rawItems, displayItems, total, shownCount: displayItems.length, hasMore, paginationUnknown: activeSources.some(source => source.paginationUnknown), status: authError ? "error" : view.loading ? "loading" : view.error && !displayItems.length ? "error" : view.loaded ? "success" : "idle", validation: view.validation, error: authError ? authError.message : view.error, retainedResults: view.retainedResults };
      return { query, scope, logic, currentType, pageSize: PAGE_SIZE, version, loading: view.loading, validation: validation || view.validation, error: authError ? authError.message : view.error, authError, view: publicView, sources: stateSources, views: Object.fromEntries(Object.entries(views).map(([type, value]) => [type, { scope: viewScope(value), page: value.page, filters: copy(value.filters), loaded: value.loaded, total: totalForView(value), filterMode: localMode(value) ? "local" : "server" }])), counts, total, allTotal, displayItems, failedTypes, unsupportedTypes, hasMore, pendingPage: view.pendingPage, retainedPage: view.retainedResults ? view.page : null, retainedResults: view.retainedResults, filterHint: localMode(view) ? `仅筛选当前已返回数据，其他页可能仍有符合项${failedTypes.length ? "；失败来源未参与筛选" : ""}` : "", dictionaries, executionKind: options.service ? "ADAPTER" : "LOCAL_MOCK", tokenizerVersion: "Intl.Segmenter-zh-CN-word-v1" };
    }
    function emit() { const state = snapshot(); listeners.forEach(listener => listener(state)); }
    function resetContexts(clearFilters) { version++; cache.clear(); endPages.clear(); views = Object.fromEntries(Object.entries(views).map(([type, value]) => [type, { ...makeView(type), scope: viewScope(value), scopeVersion: value.scopeVersion, filters: clearFilters ? {} : copy(value.filters) }])); }
    function checkContext() { const next = contextKey(); if (next !== userContext) { userContext = next; authError = null; resetContexts(false); return true; } return false; }
    function loggedIn() {
      if (options.isAuthenticated) return Boolean(options.isAuthenticated());
      const context = getUserContext();
      if (context && typeof context === "object") return Boolean(context.userId);
      return Boolean(context) && !/^(?:anonymous|anon|null|undefined)(?:$|[:\-])/iu.test(String(context));
    }
    function expireAuthentication(error) {
      resetContexts(false);
      authError = { code: error.code || error.status || 401, message: "登录已失效，请重新登录" };
      const view = views[currentType], sourceTypes = currentType === "全部" ? TYPES : [currentType];
      view.sources = Object.fromEntries(sourceTypes.map(type => [type, eligible(type, view) ? { ...idleSource(type, 1, view), status: "error", code: authError.code, error: authError.message } : idleSource(type, 1, view)]));
      view.error = authError.message;
      emit();
    }
    async function load(view, targetPage, onlyType) {
      if (checkContext()) { view = views[view.type]; targetPage = 1; }
      if (authError) { emit(); return snapshot(); }
      if (!query) { emit(); return snapshot(); }
      const ticket = ++view.requestToken, requestVersion = version, requestScope = viewScope(view), requestUser = userContext, typeList = view.type === "全部" ? TYPES : [view.type];
      const prior = { page: view.page, sources: view.sources, loaded: view.loaded };
      const samePageRetry = targetPage === view.page && view.loaded;
      const preservedSources = view.failureSources || view.sources;
      const sources = Object.fromEntries(typeList.map(type => [type, onlyType && type !== onlyType ? preservedSources[type] || idleSource(type, targetPage, view) : idleSource(type, targetPage, view)]));
      const pending = { page: targetPage, sources, committed: samePageRetry };
      view.pending = pending; view.pendingPage = targetPage; view.loading = true; view.error = null; view.retainedResults = false; view.failureSources = null;
      if (samePageRetry) view.sources = sources;
      const sourceFilters = localMode(view) ? {} : copy(view.filters);
      const requestedTypes = typeList.filter(type => (!onlyType || type === onlyType) && eligible(type, view));
      requestedTypes.forEach(type => {
        const end = endPages.get(endKey(type, sourceFilters, requestScope, view));
        sources[type] = end != null && targetPage > end.page ? { ...idleSource(type, targetPage, view), status: "success", total: end.total, hasMore: false, paginationUnknown: false } : { ...idleSource(type, targetPage, view), status: "loading" };
      });
      const attemptedTypes = requestedTypes.filter(type => sources[type].status === "loading");
      emit();
      const valid = () => requestVersion === version && requestUser === contextKey() && views[view.type] === view && viewScope(view) === requestScope && view.requestToken === ticket;
      await Promise.all(requestedTypes.map(async type => {
        if (sources[type].status !== "loading") return;
        const key = sourceKey(type, targetPage, sourceFilters, requestScope, view);
        try {
          let result = cache.get(key);
          if (!result) {
            const response = await service({ type, query, scope: requestScope, logic, page: targetPage, pageSize: PAGE_SIZE, sort: "RELEVANCE", filters: sourceFilters, userContext, queryVersion: requestVersion });
            result = normalizeResponse(response, type, targetPage);
            if (!valid()) return;
            cache.set(key, result);
          }
          if (!valid()) return;
          sources[type] = { ...result };
          if (result.hasMore === false) endPages.set(endKey(type, sourceFilters, requestScope, view), { page: targetPage, total: result.total });
          if (!pending.committed) { view.page = targetPage; view.sources = sources; view.loaded = true; pending.committed = true; }
        } catch (error) {
          if (!valid()) return;
          const code = error.code || error.status || null;
          if ((Number(code) === 401 || code === "AUTH_REQUIRED") && loggedIn()) { expireAuthentication(error); return; }
          const message = Number(code) === 401 || code === "AUTH_REQUIRED" ? "请先登录后搜索" : Number(code) === 403 ? "无权访问该资源" : error.message || "搜索失败，请重试";
          sources[type] = { ...idleSource(type, targetPage, view), status: "error", error: message, code, requestId: error.requestId || null };
        }
        if (valid()) emit();
      }));
      if (!valid()) return snapshot();
      // An exhausted source skipped above did not load this batch. It must not
      // turn failure of every remaining request into a successful batch advance.
      const succeeded = attemptedTypes.some(type => sources[type].status === "success");
      if (!requestedTypes.length || succeeded || samePageRetry) { view.page = targetPage; view.sources = sources; view.loaded = true; }
      else { view.page = prior.page; view.sources = prior.sources; view.loaded = prior.loaded; view.retainedResults = prior.loaded; view.error = "搜索失败，请重试"; }
      view.loading = false; view.pending = null; view.pendingPage = succeeded ? null : targetPage;
      view.lastFailed = Object.fromEntries(typeList.filter(type => sources[type].status === "error").map(type => [type, sources[type]]));
      if (!succeeded && Object.keys(view.lastFailed).length) view.failureSources = sources;
      else view.failureSources = null;
      if (!succeeded && prior.loaded) view.pending = { page: targetPage, sources, committed: false, failed: true };
      emit(); return snapshot();
    }
    const api = {
      submit(input, params) { const parsed = parse(input); validation = parsed.error; if (validation) { emit(); return Promise.resolve(snapshot()); } checkContext(); params = params || {}; const visiblePaperScope = currentType === "论文" && (!params.type || params.type === "论文"); const changed = parsed.query !== query; query = parsed.query; if (visiblePaperScope && ["全部资源", "仅标题", "标题与摘要"].includes(params.scope)) views["论文"].scope = params.scope; if (params.logic) logic = params.logic; if (params.type && ["全部", ...TYPES].includes(params.type)) currentType = params.type; resetContexts(changed); return load(views[currentType], 1); },
      setScope(value) { if (currentType !== "论文" || !["全部资源", "仅标题", "标题与摘要"].includes(value)) return Promise.resolve(snapshot()); checkContext(); const prior = views["论文"]; if (prior.scope === value) return Promise.resolve(snapshot()); prior.requestToken++; const namespace = scopeNamespace(prior); for (const key of cache.keys()) if (JSON.parse(key).at(-1) === namespace) cache.delete(key); for (const key of endPages.keys()) if (JSON.parse(key).at(-1) === namespace) endPages.delete(key); views["论文"] = { ...makeView("论文"), scope: value, scopeVersion: prior.scopeVersion + 1, filters: copy(prior.filters) }; validation = null; return load(views["论文"], 1); },
      setLogic(value) { if (!["AND", "OR"].includes(value) || logic === value) return Promise.resolve(snapshot()); logic = value; validation = null; resetContexts(false); return load(views[currentType], 1); },
      selectType(type) { if (!["全部", ...TYPES].includes(type)) return Promise.resolve(snapshot()); checkContext(); currentType = type; validation = null; const view = views[type]; if (view.loaded || view.loading) { emit(); return Promise.resolve(snapshot()); } return load(view, view.page); },
      setFilter(name, value) { const view = views[currentType], filters = { ...(view.validation && view.validation.values || view.filters), ...(typeof name === "object" ? name : { [name]: value }) }; const error = nonempty(filters.discipline) ? { field: "discipline", message: "当前资源暂不支持该检索条件" } : filterError(filters); view.validation = error ? { ...error, values: copy(filters) } : null; validation = null; if (error) { emit(); return Promise.resolve(snapshot()); } view.filters = filters; if (localMode(view)) { emit(); return Promise.resolve(snapshot()); } view.loaded = false; return load(view, 1); },
      clearFilters() { const view = views[currentType]; view.filters = {}; view.validation = null; validation = null; if (localMode(view)) { emit(); return Promise.resolve(snapshot()); } view.loaded = false; return load(view, 1); },
      page(value) { const view = views[currentType], state = snapshot(); if (view.loading) return Promise.resolve(state); const next = value === "next" ? view.page + 1 : value === "previous" ? view.page - 1 : Number(value); if (!Number.isInteger(next) || next < 1 || next === view.page || next > view.page && !state.hasMore) return Promise.resolve(state); return load(view, next); },
      retry(type) { const view = views[currentType]; if (view.loading || !CONNECTED.includes(type)) return Promise.resolve(snapshot()); const target = view.pendingPage || view.page; return load(view, target, type); },
      subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
      snapshot,
      refreshContext() { const changed = checkContext(); return changed && query ? load(views[currentType], 1) : Promise.resolve(snapshot()); }
    };
    return api;
  }

  root.PortalKeywordModel = Object.freeze({ TYPES: TYPES.slice(), PAGE_SIZE, isUnconnected, normalize, parse, validate, match, createFixtures, create, filterRecord, fields });
})(typeof window !== "undefined" ? window : globalThis);
