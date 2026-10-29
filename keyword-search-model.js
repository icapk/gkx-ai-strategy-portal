(function (root) {
  "use strict";

  const TYPES = ["论文", "专利", "报告", "人才", "资讯", "会议", "课程", "活动", "练仿真"];
  const ALL_TYPES = TYPES.filter(type => type !== "练仿真");
  // This prototype shows the delivered design. It does not claim a live API connection.
  const isUnconnected = () => false;
  const CONNECTED = TYPES.slice();
  const PAGE_SIZE = 10;
  const PAPER_SCOPES = ["标题和摘要", "标题", "摘要"];
  const REPORT_SCOPES = ["标题和摘要", "标题", "摘要", "全文检索"];
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
    if (record.type === "报告" && scope === "全文检索") return documentParagraphs(record).map(value => value.paragraph.text);
    const titles = titleFields(record);
    if (scope === "标题") return titles;
    const summary = record.type === "论文" ? record.abstract : record.summary;
    if (scope === "摘要") return record.type === "人才" || record.type === "会议" ? [] : [summary];
    if (scope === "标题和摘要") return record.type === "人才" ? [] : [...titles, ...(record.type === "会议" ? [] : [summary])];
    switch (record.type) {
      case "论文": return [...titles, record.abstract];
      case "专利": return [...titles, record.abstract ?? record.summary, ...list(record.ipc), ...textList(record.applicant), ...textList(record.inventor), ...list(record.tags)];
      case "练仿真": return [...titles, record.summary, ...list(record.category || record.categories), ...list(record.domainTags)];
      case "报告": return [...titles, record.summary, record.source, record.reportType, ...list(record.domainTags)];
      case "人才": return [record.name, record.institution, ...list(record.researchFields), ...list(record.researchDirections)];
      case "资讯": return [...titles, record.summary, record.source, ...list(record.domainTags)];
      case "会议": return [...titles, record.location, record.level, ...list(record.tags)];
      case "课程": return [...titles, record.summary, ...textList(record.lecturers), record.institution, record.level, ...list(record.domainTags)];
      case "活动": return [...titles, record.summary, record.organizer, record.location, record.activityType, ({ LECTURE: "讲座", FORUM: "论坛", SALON: "沙龙", DEBATE: "思辨会", OTHER: "其他" })[record.activityType], ...list(record.domainTags), ...list(record.topicTags)];
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
  // Only the separately declared prototype documents supply full text. Legacy
  // metadata, tags and the old matches[] demonstration are never a fallback.
  function documentParagraphs(record) {
    const document = record && record.document;
    if (record?.type !== "报告" || document?.sourceKind !== "LOCAL_PROTOTYPE" || !document.documentId || !document.documentVersion || !Array.isArray(document.pages)) return [];
    const resourceIds = [document.resourceId, ...(Array.isArray(document.resourceIdAliases) ? document.resourceIdAliases : [])].filter(id => typeof id === "string" && id.trim());
    if (!resourceIds.includes(record.id)) return [];
    return document.pages.flatMap(page => page && Number.isInteger(page.pageNumber) && page.pageNumber > 0 && Array.isArray(page.paragraphs)
      ? page.paragraphs.filter(paragraph => paragraph && typeof paragraph.paragraphId === "string" && paragraph.paragraphId.trim() && typeof paragraph.text === "string").map(paragraph => ({ document, page, paragraph })) : []);
  }
  function fulltextHits(record, input) {
    const parsed = typeof input === "string" ? parse(input) : input;
    if (!parsed || parsed.error || !parsed.terms.length) return [];
    return documentParagraphs(record).flatMap(({ document, page, paragraph }) => {
      const sentences = paragraph.text.match(/[^。！？!?]+[。！？!?]?/gu) || [paragraph.text];
      return sentences.map(sentence => sentence.trim()).filter(sentence => sentence && parsed.terms.some(term => whole(sentence, term.text))).map(sentence => ({
        documentId: document.documentId, documentVersion: document.documentVersion, version: document.documentVersion,
        pageNumber: page.pageNumber, paragraphId: paragraph.paragraphId, sentence
      }));
    });
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
    const records = items.filter(item => TYPES.includes(item.type)).map(item => {
      const index = items.indexOf(item), type = item.type;
      const record = { ...item, raw: item, id: item.id || item.portalResourceId || item.portalPaperId || LEGACY_IDS[index] || null };
      record.domainTags = list(type === "论文" ? item.domainTags : item.domainTags || item.tags);
      if (type === "论文") { record.abstract = item.abstract === undefined ? item.summary : item.abstract; record.authors = item.authors || (LEGACY_AUTHORS[index] || []).map(name => ({ name })); record.publishedAt = item.publishedAt || item.date; }
      if (type === "人才") { record.name = item.name || item.personName; record.researchFields = list(item.researchFields || item.tags); record.researchDirections = list(item.researchDirections || String(item.title || "").split(/\s*·\s*/u).slice(1).join(" · ")); }
      if (type === "报告") { record.uploadedAt = item.uploadedAt || item.date; record.reportType = item.reportType || String(item.meta || "").split("·")[0].trim(); }
      if (type === "资讯") record.publishedAt = item.publishedAt || item.date;
      if (["会议", "课程", "活动"].includes(type)) record.name = item.name || item.title;
      return record;
    });
    return root.PortalReportFulltextFixtures ? root.PortalReportFulltextFixtures.attach(records) : records;
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
    for (const key of ["publishedYearFrom", "publishedYearTo"]) if (nonempty(filters[key]) && !/^[1-9]\d{3}$/.test(String(filters[key]))) return { field: key, message: "请输入4位年份" };
    if (nonempty(filters.publishedYearFrom) && nonempty(filters.publishedYearTo) && Number(filters.publishedYearFrom) > Number(filters.publishedYearTo)) return { field: "publishedYearFrom", message: "起始年份不能晚于结束年份" };
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
    if (!equals(type === "论文" ? record.domainTags : record.domainTags || record.tags || record.researchFields, f.domains)) return false;
    if (!equals(record.source, f.sources)) return false;
    let timeField = type === "报告" ? record.uploadedAt : ["论文", "资讯", "课程"].includes(type) ? record.publishedAt : null;
    let from = f.dateFrom || f.publishedFrom || f.uploadedFrom, to = f.dateTo || f.publishedTo || f.uploadedTo;
    const years = { "近一年": 1, "近三年": 3, "近五年": 5 }[f.publishTime];
    if (years) { const today = new Date(now()); today.setUTCFullYear(today.getUTCFullYear() - years); from = day(today.toISOString()); }
    if (!date(timeField, from, to)) return false;
    if (type === "人才") return contains(record.name, f.personNameFilter) && contains(record.institution, f.institutionFilter) && equals(record.researchFields, f.researchFieldFilter) && (!nonempty(f.minHIndex) || Number.isFinite(record.hIndex) && record.hIndex >= Number(f.minHIndex)) && (!nonempty(f.maxHIndex) || Number.isFinite(record.hIndex) && record.hIndex <= Number(f.maxHIndex));
    if (type === "论文") {
      const publishedYear = /^([1-9]\d{3})(?:-|$)/.exec(String(record.publishedAt || ""));
      const year = publishedYear ? Number(publishedYear[1]) : null;
      if (nonempty(f.publishedYearFrom) && (year == null || year < Number(f.publishedYearFrom))) return false;
      if (nonempty(f.publishedYearTo) && (year == null || year > Number(f.publishedYearTo))) return false;
      return contains(textList(record.authors), f.authorFilter) && contains(record.source, f.venueFilter);
    }
    if (type === "专利") return contains(record.ipc, f.ipcFilter) && contains(record.applicant, f.applicantFilter) && contains(record.inventor, f.inventorFilter) && date(record.applicationDate, f.applicationStart, f.applicationEnd) && date(record.publicationDate, f.publicationStart, f.publicationEnd);
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
    const capabilities = options.capabilities || {}, listeners = new Set(), cache = new Map();
    const contextKey = () => { const value = getUserContext(); return typeof value === "string" ? value : JSON.stringify(value); };
    const FILTER_TYPES = ["论文", "专利", "人才"];
    let userContext = contextKey(), version = 0, query = "", logic = "AND", currentType = "全部", validation = null, authError = null;
    const scopedTypes = { "论文": PAPER_SCOPES, "报告": REPORT_SCOPES };
    const makeView = type => ({ type, scope: scopedTypes[type] ? scopedTypes[type][0] : "全部资源", page: 1, filters: {}, sources: {}, loaded: false, loading: false, requestToken: 0, pendingPage: null, retainedResults: false, error: null, validation: null });
    let views = Object.fromEntries(["全部", ...TYPES].map(type => [type, makeView(type)]));
    const viewScope = view => scopedTypes[view.type] ? view.scope : "全部资源";
    const requestScope = (type, view) => scopedTypes[type] ? view.type === type ? view.scope : type === "报告" ? "全部资源" : scopedTypes[type][0] : "全部资源";
    const sourceTypes = view => view.type === "全部" ? ALL_TYPES : [view.type];
    const cap = type => ({ exact: true, scopes: type === "报告" ? [...REPORT_SCOPES, "全部资源"] : scopedTypes[type] || ["全部资源"], ...capabilities[type] });
    const eligible = (type, view) => cap(type).exact && cap(type).scopes.includes(requestScope(type, view));
    const unique = values => [...new Set(values.filter(value => value != null && value !== ""))];
    function mainRecords(request) {
      const parsed = parse(request.query);
      let candidates = records.filter(record => record.type === request.type && match(record, parsed, request.scope, request.logic));
      if (request.type === "报告" && request.scope === "全文检索") return candidates.map(record => ({ ...record, fulltextHits: fulltextHits(record, parsed) })).filter(record => record.fulltextHits.length);
      // Exact titles come first; other matching records remain in the result set.
      if (request.scope !== "摘要") candidates = candidates.map((record, index) => ({ record, index, exact: titleFields(record).some(title => normalize(title) === parsed.fullQuery) })).sort((a, b) => Number(b.exact) - Number(a.exact) || a.index - b.index).map(value => value.record);
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
        if (!item || item.id == null || String(item.id).trim() === "" || !String(type === "人才" ? item.name || "" : item.title || item.name || "").trim()) { invalidCount++; return; }
        const key = `${type}:${item.id}`;
        if (seen.has(key)) return;
        seen.add(key);
        valid.push({ ...item, activityType: type === "活动" ? item.activityType || (!TYPES.includes(item.type) ? item.type : item.kind) : item.activityType, type, raw: item.raw || item, title: item.title || item.name });
      });
      if (data.items.length && !valid.length) throw Object.assign(new Error("返回数据异常"), { code: "INVALID_RECORDS", requestId: response.requestId });
      const total = Number.isInteger(data.total) && data.total >= 0 ? data.total : null;
      const hasMore = typeof data.hasMore === "boolean" ? data.hasMore : total == null ? null : page * PAGE_SIZE < total;
      return { status: "success", page, rawItems: valid, total, hasMore, paginationUnknown: hasMore == null, error: null, invalidCount, requestId: response.requestId || null };
    }
    function idleSource(type, page, view) {
      const supported = eligible(type, view);
      return { status: supported ? "idle" : "unsupported", page, rawItems: [], total: null, hasMore: supported ? null : false, paginationUnknown: false, error: supported ? null : cap(type).exact ? "不支持该检索条件" : "检索能力暂不可用" };
    }
    function distinct(items) {
      const seen = new Set();
      return items.filter(item => { const key = `${item.type}:${item.id}`; if (seen.has(key)) return false; seen.add(key); return true; });
    }
    function aggregate(sources) {
      const queues = Object.fromEntries(ALL_TYPES.map(type => [type, distinct(sources[type]?.rawItems || [])]));
      const positions = Object.fromEntries(ALL_TYPES.map(type => [type, 0])), result = [];
      while (result.length < 100) {
        let progress = false;
        for (const type of ALL_TYPES) {
          if (positions[type] >= queues[type].length) continue;
          result.push(queues[type][positions[type]++]); progress = true;
          if (result.length === 100) break;
        }
        if (!progress) break;
      }
      ALL_TYPES.forEach(type => result.push(...queues[type].slice(positions[type])));
      return result;
    }
    function totalForView(view) {
      const types = sourceTypes(view);
      if (!types.length || types.some(type => !eligible(type, view))) return null;
      const sources = types.map(type => view.sources[type]);
      return sources.every(source => source?.status === "success" && source.total != null) ? sources.reduce((sum, source) => sum + source.total, 0) : null;
    }
    function snapshot() {
      const view = views[currentType], typeList = sourceTypes(view), statusSources = view.pendingSources || view.sources, stateSources = Object.fromEntries(typeList.map(type => [type, statusSources[type] || idleSource(type, view.page, view)]));
      const ordered = currentType === "全部" ? aggregate(view.sources) : distinct(view.sources[currentType]?.rawItems || []);
      const startIndex = (view.page - 1) * PAGE_SIZE;
      const rawItems = currentType === "全部" ? ordered.slice(startIndex, startIndex + PAGE_SIZE) : ordered;
      const displayItems = FILTER_TYPES.includes(currentType) ? rawItems.filter(record => filterRecord(record, view.filters, now)) : rawItems;
      const total = totalForView(view), allTotal = totalForView(views["全部"]), failedTypes = typeList.filter(type => stateSources[type].status === "error");
      const unsupportedTypes = typeList.filter(type => stateSources[type].status === "unsupported");
      const activeSources = typeList.filter(type => eligible(type, view)).map(type => stateSources[type]);
      const hasMore = view.retainedResults ? false : currentType === "全部" ? ordered.length > startIndex + PAGE_SIZE : stateSources[currentType]?.hasMore !== false;
      const counts = {};
      TYPES.forEach(type => {
        const source = currentType === type ? view.sources[type] : views["全部"].sources[type] || views[type].sources[type];
        counts[type] = source?.status === "success" ? source.total : null;
      });
      counts["全部"] = allTotal;
      const dictionaries = { sources: {}, domains: {}, levels: {}, reportTypes: [] };
      dictionaries.sources[currentType] = unique(rawItems.map(item => item.source));
      dictionaries.domains[currentType] = unique(rawItems.flatMap(item => list(currentType === "论文" ? item.domainTags : currentType === "人才" ? item.researchFields : [])));
      const filterMode = FILTER_TYPES.includes(currentType) ? "local" : "none";
      const publicView = { type: view.type, scope: viewScope(view), page: view.page, startIndex, pendingPage: view.pendingPage, filters: copy(view.filters), filterMode, rawItems, displayItems, total, shownCount: displayItems.length, hasMore, paginationUnknown: activeSources.some(source => source.paginationUnknown), status: authError ? "error" : view.loading ? "loading" : view.error && !displayItems.length ? "error" : view.loaded ? "success" : "idle", validation: view.validation, error: authError ? authError.message : view.error, retainedResults: view.retainedResults };
      return { query, scope: viewScope(view), logic, currentType, pageSize: PAGE_SIZE, version, loading: view.loading, validation: validation || view.validation, error: authError ? authError.message : view.error, authError, view: publicView, sources: stateSources, views: Object.fromEntries(Object.entries(views).map(([type, value]) => [type, { scope: viewScope(value), page: value.page, filters: copy(value.filters), loaded: value.loaded, total: totalForView(value), filterMode: FILTER_TYPES.includes(type) ? "local" : "none" }])), counts, total, allTotal, displayItems, failedTypes, unsupportedTypes, hasMore, pendingPage: view.pendingPage, retainedPage: view.retainedResults ? view.page : null, retainedResults: view.retainedResults, filterHint: filterMode === "local" ? "仅筛选当前已返回数据，其他页可能仍有符合项" : "", dictionaries, executionKind: options.service ? "ADAPTER" : "LOCAL_MOCK", tokenizerVersion: "Intl.Segmenter-zh-CN-word-v1" };
    }
    function emit() { const state = snapshot(); listeners.forEach(listener => listener(state)); }
    function resetContexts(clearFilters) {
      version++; cache.clear();
      views = Object.fromEntries(Object.entries(views).map(([type, value]) => [type, { ...makeView(type), scope: viewScope(value), filters: clearFilters ? {} : copy(value.filters) }]));
    }
    function checkContext() { const next = contextKey(); if (next !== userContext) { userContext = next; authError = null; resetContexts(false); return true; } return false; }
    function loggedIn() {
      if (options.isAuthenticated) return Boolean(options.isAuthenticated());
      const context = getUserContext();
      return context && typeof context === "object" ? Boolean(context.userId) : Boolean(context) && !/^(?:anonymous|anon|null|undefined)(?:$|[:\-])/iu.test(String(context));
    }
    function expireAuthentication(error) {
      resetContexts(false); authError = { code: error.code || error.status || 401, message: "登录已失效，请重新登录" };
      const view = views[currentType]; view.error = authError.message;
      sourceTypes(view).forEach(type => { view.sources[type] = { ...idleSource(type, 1, view), status: "error", code: authError.code, error: authError.message }; }); emit();
    }
    async function fetchPage(type, page, view, valid) {
      const scope = requestScope(type, view), key = JSON.stringify([userContext, query, scope, logic, type, page]);
      if (cache.has(key)) return copy(cache.get(key));
      const response = await service({ type, query, scope, logic, page, pageSize: PAGE_SIZE, sort: "RELEVANCE", filters: {}, userContext, queryVersion: version });
      const result = normalizeResponse(response, type, page);
      if (valid()) cache.set(key, result);
      return result;
    }
    async function load(view, targetPage, onlyType) {
      if (checkContext()) { view = views[view.type]; targetPage = 1; }
      if (authError || !query) { emit(); return snapshot(); }
      // Once all sources settle, ordinary list pagination only changes the global slice.
      if (view.type === "全部" && view.loaded && !onlyType) { view.page = targetPage; view.pendingPage = null; emit(); return snapshot(); }
      const ticket = ++view.requestToken, requestedVersion = version, requestedUser = userContext, scope = viewScope(view);
      const prior = { page: view.page, sources: view.sources, loaded: view.loaded };
      const types = sourceTypes(view), requested = types.filter(type => (!onlyType || type === onlyType) && eligible(type, view));
      const sources = Object.fromEntries(types.map(type => [type, onlyType && type !== onlyType ? view.sources[type] || idleSource(type, targetPage, view) : idleSource(type, targetPage, view)]));
      requested.forEach(type => { sources[type] = { ...sources[type], status: "loading" }; });
      view.loading = true; view.pendingPage = targetPage; view.error = null; view.retainedResults = false; view.pendingSources = sources;
      if (!prior.loaded) view.sources = sources;
      const valid = () => requestedVersion === version && requestedUser === contextKey() && views[view.type] === view && viewScope(view) === scope && view.requestToken === ticket;
      emit();
      let succeeded = 0;
      await Promise.all(requested.map(async type => {
        let collected = [], invalidCount = 0, page = view.type === "全部" ? 1 : targetPage, latest = null;
        try {
          do {
            latest = await fetchPage(type, page, view, valid);
            if (!valid()) return;
            const previousLength = collected.length;
            collected = distinct([...collected, ...latest.rawItems]); invalidCount += latest.invalidCount || 0;
            if (view.type !== "全部" || latest.hasMore !== true) break;
            if (collected.length === previousLength) throw Object.assign(new Error("分页数据未前进，请重试"), { code: "INVALID_PAGINATION" });
            page++;
          } while (true);
          if (!valid()) return;
          sources[type] = { ...latest, page: targetPage, rawItems: collected, invalidCount, hasMore: view.type === "全部" ? false : latest.hasMore };
          succeeded++;
        } catch (error) {
          if (!valid()) return;
          const code = error.code || error.status || null;
          if ((Number(code) === 401 || code === "AUTH_REQUIRED") && loggedIn()) { expireAuthentication(error); return; }
          const message = Number(code) === 401 || code === "AUTH_REQUIRED" ? "请先登录后搜索" : Number(code) === 403 ? "无权访问该资源" : error.message || "搜索失败，请重试";
          sources[type] = { ...idleSource(type, targetPage, view), status: "error", rawItems: collected, total: null, error: message, code, requestId: error.requestId || null };
        }
      }));
      if (!valid()) return snapshot();
      if (succeeded || !requested.length || onlyType && prior.loaded) { view.page = targetPage; view.sources = sources; view.loaded = true; }
      else { view.page = prior.page; view.sources = prior.loaded ? prior.sources : sources; view.loaded = prior.loaded; view.retainedResults = prior.loaded; view.error = "搜索失败，请重试"; }
      view.loading = false; view.pendingSources = null; view.pendingPage = succeeded || !requested.length ? null : targetPage;
      // All failures retain the old list but expose the new failures for retry.
      if (!succeeded && prior.loaded && !onlyType) Object.keys(sources).forEach(type => { if (sources[type].status === "error") view.sources[type] = { ...sources[type], rawItems: prior.sources[type]?.rawItems || [] }; });
      emit(); return snapshot();
    }
    const api = {
      submit(input, params) {
        const parsed = parse(input); validation = parsed.error;
        if (validation) { emit(); return Promise.resolve(snapshot()); }
        checkContext(); params = params || {};
        const changed = parsed.query !== query; query = parsed.query;
        const targetType = params.type || currentType;
        if (scopedTypes[targetType]?.includes(params.scope)) views[targetType].scope = params.scope;
        if (params.type && ["全部", ...TYPES].includes(params.type)) currentType = params.type;
        logic = "AND"; resetContexts(changed); return load(views[currentType], 1);
      },
      setScope(value) {
        if (!scopedTypes[currentType]?.includes(value) || views[currentType].scope === value) return Promise.resolve(snapshot());
        checkContext(); const prior = views[currentType]; prior.requestToken++;
        views[currentType] = { ...makeView(currentType), scope: value, filters: copy(prior.filters) }; validation = null; return load(views[currentType], 1);
      },
      setLogic(value) { if (value !== "AND") return Promise.resolve(snapshot()); return Promise.resolve(snapshot()); },
      selectType(type) { if (!["全部", ...TYPES].includes(type)) return Promise.resolve(snapshot()); checkContext(); currentType = type; validation = null; const view = views[type]; if (view.loaded || view.loading) { emit(); return Promise.resolve(snapshot()); } return load(view, view.page); },
      setFilter(name, value) {
        if (!FILTER_TYPES.includes(currentType)) return Promise.resolve(snapshot());
        const view = views[currentType], filters = { ...(view.validation?.values || view.filters), ...(typeof name === "object" ? name : { [name]: value }) };
        const error = filterError(filters); view.validation = error ? { ...error, values: copy(filters) } : null; validation = null;
        if (!error) view.filters = filters;
        emit(); return Promise.resolve(snapshot());
      },
      clearFilters() { const view = views[currentType]; view.filters = {}; view.validation = null; validation = null; emit(); return Promise.resolve(snapshot()); },
      page(value) { const view = views[currentType], state = snapshot(); if (view.loading) return Promise.resolve(state); const next = value === "next" ? view.page + 1 : value === "previous" ? view.page - 1 : Number(value); if (!Number.isInteger(next) || next < 1 || next === view.page || next > view.page && !state.hasMore) return Promise.resolve(state); return load(view, next); },
      retry(type) { const view = views[currentType]; if (view.loading || !sourceTypes(view).includes(type)) return Promise.resolve(snapshot()); const target = view.pendingPage || view.page; return load(view, target, type); },
      subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }, snapshot,
      refreshContext() { const changed = checkContext(); return changed && query ? load(views[currentType], 1) : Promise.resolve(snapshot()); }
    };
    return api;
  }

  root.PortalKeywordModel = Object.freeze({ TYPES: TYPES.slice(), ALL_TYPES: ALL_TYPES.slice(), PAPER_SCOPES: PAPER_SCOPES.slice(), REPORT_SCOPES: REPORT_SCOPES.slice(), PAGE_SIZE, isUnconnected, normalize, parse, validate, match, fulltextHits, createFixtures, create, filterRecord, fields });
})(typeof window !== "undefined" ? window : globalThis);
