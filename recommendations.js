(function () {
  "use strict";

  const MODE_CONFIG = {
    ai: {
      resultMode: "AI 搜索",
      label: "AI搜索",
      placeholder: "用自然语言描述你想找的内容，AI帮你理解搜索意图...",
      guide: "使用人工智能理解你的搜索意图，找到语义相似和深度相关的内容"
    },
    association: {
      resultMode: "关联",
      label: "智能关联",
      placeholder: "输入主题、技术或专家，发现相关成果、人物与研究脉络...",
      guide: "结合主题关系与知识关联，发现相似内容、上下游成果和潜在合作对象"
    },
    fulltext: {
      resultMode: "全文",
      label: "全文检索",
      placeholder: "输入论文、专利、专家或报告中的关键词...",
      guide: "检索题名、摘要与正文内容，并在结果页定位命中片段"
    },
    keyword: {
      resultMode: "关键词",
      label: "关键词检索",
      placeholder: "输入一个或多个关键词，可在结果页继续精确筛选...",
      guide: "支持精确匹配、同义词与中英文扩展，并按资源字段继续筛选"
    }
  };

  const KEYWORD_WATCH_STORAGE_KEY = "gkx-keyword-watches-v1";
  const KEYWORD_WATCH_LIMIT = 8;
  const BASE_MESSAGE_COUNT = 5;
  const KEYWORD_SUGGESTIONS = [
    { keyword: "人工智能", trend: "+28%", followers: 234 },
    { keyword: "量子计算", trend: "+19%", followers: 189 },
    { keyword: "基因编辑", trend: "+17%", followers: 156 },
    { keyword: "固态电池", trend: "+14%", followers: 142 }
  ];
  const KNOWN_KEYWORDS = [
    "人工智能", "科学智能体", "大语言模型", "量子计算", "量子纠缠", "基因编辑", "固态电池",
    "ChatGPT", "CRISPR", "碳中和", "元宇宙", "新能源", "脑机接口", "区块链", "5G通信",
    "深度学习", "纳米材料", "Transformer", "LLM", "GPT-4", "强化学习", "迁移学习"
  ];
  const KEYWORD_RELATIONS = {
    "人工智能": ["大模型", "科研智能体", "机器学习"],
    "科学智能体": ["AI for Science", "科研工作流", "智能协作"],
    "量子计算": ["量子比特", "量子算法", "量子通信"],
    "量子纠缠": ["量子信息", "量子通信", "量子测量"],
    "基因编辑": ["CRISPR", "基因治疗", "生物伦理"],
    "CRISPR": ["基因编辑", "基因治疗", "生命科学"],
    "固态电池": ["界面材料", "电解质", "新能源"],
    "新能源": ["储能", "动力电池", "产业政策"]
  };

  const modeTabs = Array.from(document.querySelectorAll("[data-rec-search-mode]"));
  const modeSelect = document.getElementById("recSearchModeSelect");
  const searchForm = document.getElementById("recSearchForm");
  const searchInput = document.getElementById("recSearchInput");
  const searchGuide = document.getElementById("recSearchGuide");
  const searchFollowTip = document.getElementById("recSearchFollowTip");
  const mobileMenu = document.getElementById("recMobileMenu");
  const mainNav = document.getElementById("recMainNav");
  const contentNav = document.getElementById("recContentNav");
  const sectionLinks = Array.from(document.querySelectorAll("[data-section-link]"));
  const sections = Array.from(document.querySelectorAll("[data-rec-section]"));
  const toast = document.getElementById("recToast");
  const messageButton = document.getElementById("recMessageButton");
  const messageCount = document.getElementById("recMessageCount");
  const autoFollowCheckbox = document.getElementById("recAutoFollow");
  const keywordFollowStatus = document.getElementById("recAutoFollowHint");
  const keywordFollowGrid = document.getElementById("recKeywordFollowGrid");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeMode = "ai";
  let toastTimer = 0;
  let watchState = null;
  let expandedWatchKey = "";
  let expandedUpdateId = "";
  let pendingRemovalKey = "";
  let pendingRemovalTimer = 0;
  let searchNavigationTimer = 0;

  function hideToast() {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.hidden = true;
    toast.replaceChildren();
  }

  function showToast(message, action) {
    if (!toast || !message) return;
    window.clearTimeout(toastTimer);
    toast.replaceChildren();

    const messageNode = document.createElement("span");
    messageNode.textContent = message;
    toast.appendChild(messageNode);

    if (action?.label && typeof action.onAction === "function") {
      const actionButton = document.createElement("button");
      actionButton.type = "button";
      actionButton.textContent = action.label;
      actionButton.addEventListener("click", function () {
        hideToast();
        action.onAction();
      }, { once: true });
      toast.appendChild(actionButton);
    }

    toast.hidden = false;
    toastTimer = window.setTimeout(hideToast, action ? 6500 : 2600);
  }

  function createElement(tagName, className, textContent) {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (textContent !== undefined) node.textContent = textContent;
    return node;
  }

  function emptyWatchState() {
    return { version: 1, autoFollow: true, watches: [] };
  }

  function normalizeKeyword(value) {
    return String(value || "")
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 40);
  }

  function keywordKey(value) {
    return normalizeKeyword(value).toLocaleLowerCase("zh-CN");
  }

  function isUsableKeyword(value) {
    return /[\p{L}\p{N}]/u.test(value);
  }

  function deriveWatchKeyword(query) {
    const normalized = String(query || "").replace(/\s+/g, " ").trim();
    if (!normalized) return "";

    const quoteMatch = normalized.match(/[“\"']([^”\"']{1,40})[”\"']/);
    if (quoteMatch && isUsableKeyword(quoteMatch[1])) return normalizeKeyword(quoteMatch[1]);

    const lowerQuery = normalized.toLocaleLowerCase("zh-CN");
    const known = KNOWN_KEYWORDS
      .filter(function (keyword) { return lowerQuery.includes(keyword.toLocaleLowerCase("zh-CN")); })
      .sort(function (left, right) { return right.length - left.length; })[0];
    if (known) return known;

    const simplified = normalized
      .replace(/^(请|麻烦)?\s*(帮我|为我)?\s*(搜索|查找|检索|查询|了解|看看|关注)\s*/u, "")
      .replace(/^(关于|有关)\s*/u, "")
      .split(/[，,。！？!?；;：:\n]/u)[0];
    return normalizeKeyword(simplified || normalized);
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash >>> 0);
  }

  function relatedTagsFor(keyword) {
    const direct = KEYWORD_RELATIONS[keyword];
    if (direct) return direct.slice();
    const matchingKey = Object.keys(KEYWORD_RELATIONS).find(function (key) {
      return keyword.includes(key) || key.includes(keyword);
    });
    return matchingKey ? KEYWORD_RELATIONS[matchingKey].slice() : ["技术进展", "科研成果", "政策动态"];
  }

  function createKeywordUpdates(keyword, key, createdAt) {
    const createdTime = new Date(createdAt).getTime();
    const offsets = [12 * 60 * 1000, 3 * 60 * 60 * 1000, 26 * 60 * 60 * 1000];
    const records = [
      {
        type: "文献",
        title: "“" + keyword + "”相关文献库新增高关联研究（原型）",
        summary: "系统根据题名、摘要与主题关联生成本条原型提醒，可进入真实文献接口后查看来源与证据。"
      },
      {
        type: "资讯",
        title: "“" + keyword + "”相关政策与产业资讯已更新（原型）",
        summary: "本条用于演示关键词动态触达；正式上线后将展示来源、发布时间和相关度依据。"
      },
      {
        type: "报告",
        title: "“" + keyword + "”趋势监测生成新一期摘要（原型）",
        summary: "原型汇总检索热度与公开趋势信号，不代表真实统计结论。"
      }
    ];

    return records.map(function (record, index) {
      return {
        id: "update-" + hashString(key + createdAt + index).toString(36),
        type: record.type,
        title: record.title,
        summary: record.summary,
        createdAt: new Date(createdTime - offsets[index]).toISOString(),
        read: false
      };
    });
  }

  function createKeywordWatch(keyword, source, mode) {
    const now = new Date().toISOString();
    const key = keywordKey(keyword);
    const seed = hashString(key);
    return {
      id: "watch-" + seed.toString(36) + "-" + Date.now().toString(36),
      key: key,
      keyword: keyword,
      source: source,
      mode: mode,
      createdAt: now,
      updatedAt: now,
      lastSearchedAt: source === "search" ? now : "",
      searchCount: source === "search" ? 1 : 0,
      frequency: "daily",
      tags: relatedTagsFor(keyword),
      metrics: {
        todayNew: 3 + seed % 5,
        weekNew: 12 + seed % 29,
        relatedResources: 32 + seed % 91
      },
      updates: createKeywordUpdates(keyword, key, now)
    };
  }

  function normalizeStoredWatch(item) {
    if (!item || typeof item !== "object") return null;
    const keyword = normalizeKeyword(item.keyword);
    if (!keyword || !isUsableKeyword(keyword)) return null;
    const key = keywordKey(keyword);
    const fallback = createKeywordWatch(keyword, item.source === "search" ? "search" : "manual", item.mode || "ai");
    const updates = Array.isArray(item.updates) ? item.updates.slice(0, 10).map(function (update, index) {
      if (!update || typeof update !== "object") return null;
      const title = String(update.title || "").trim().slice(0, 180);
      if (!title) return null;
      return {
        id: String(update.id || "update-" + hashString(key + index).toString(36)),
        type: String(update.type || "动态").slice(0, 12),
        title: title,
        summary: String(update.summary || "").trim().slice(0, 260),
        createdAt: Number.isNaN(Date.parse(update.createdAt)) ? fallback.createdAt : update.createdAt,
        read: Boolean(update.read)
      };
    }).filter(Boolean) : fallback.updates;

    return {
      ...fallback,
      id: String(item.id || fallback.id),
      key: key,
      keyword: keyword,
      source: item.source === "search" ? "search" : "manual",
      mode: MODE_CONFIG[item.mode] ? item.mode : "ai",
      createdAt: Number.isNaN(Date.parse(item.createdAt)) ? fallback.createdAt : item.createdAt,
      updatedAt: Number.isNaN(Date.parse(item.updatedAt)) ? fallback.updatedAt : item.updatedAt,
      lastSearchedAt: Number.isNaN(Date.parse(item.lastSearchedAt)) ? "" : item.lastSearchedAt,
      searchCount: Math.max(0, Number(item.searchCount) || 0),
      frequency: ["realtime", "daily", "weekly", "page"].includes(item.frequency) ? item.frequency : "daily",
      tags: Array.isArray(item.tags) ? item.tags.map(String).filter(Boolean).slice(0, 4) : fallback.tags,
      metrics: {
        todayNew: Math.max(0, Number(item.metrics?.todayNew) || fallback.metrics.todayNew),
        weekNew: Math.max(0, Number(item.metrics?.weekNew) || fallback.metrics.weekNew),
        relatedResources: Math.max(0, Number(item.metrics?.relatedResources) || fallback.metrics.relatedResources)
      },
      updates: updates
    };
  }

  function loadWatchState() {
    const fallback = emptyWatchState();
    try {
      const raw = window.localStorage.getItem(KEYWORD_WATCH_STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== 1) return fallback;
      const seen = new Set();
      const watches = (Array.isArray(parsed.watches) ? parsed.watches : [])
        .map(normalizeStoredWatch)
        .filter(function (watch) {
          if (!watch || seen.has(watch.key)) return false;
          seen.add(watch.key);
          return true;
        })
        .slice(0, KEYWORD_WATCH_LIMIT);
      return { version: 1, autoFollow: parsed.autoFollow !== false, watches: watches };
    } catch (_error) {
      return fallback;
    }
  }

  function saveWatchState(nextState) {
    try {
      window.localStorage.setItem(KEYWORD_WATCH_STORAGE_KEY, JSON.stringify(nextState));
      watchState = nextState;
      return true;
    } catch (_error) {
      showToast("无法保存词汇关注，请检查浏览器存储权限后重试");
      return false;
    }
  }

  function unreadCountFor(watch) {
    return watch.updates.filter(function (update) { return !update.read; }).length;
  }

  function totalKeywordUnread() {
    return watchState.watches.reduce(function (total, watch) {
      return total + unreadCountFor(watch);
    }, 0);
  }

  function formatRelativeTime(value) {
    const time = Date.parse(value);
    if (Number.isNaN(time)) return "刚刚";
    const minutes = Math.max(0, Math.round((Date.now() - time) / 60000));
    if (minutes < 1) return "刚刚";
    if (minutes < 60) return minutes + " 分钟前";
    const hours = Math.round(minutes / 60);
    if (hours < 24) return hours + " 小时前";
    const days = Math.round(hours / 24);
    if (days < 7) return days + " 天前";
    return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(new Date(time));
  }

  function frequencyLabel(value) {
    return ({ realtime: "重大动态实时推送", daily: "每日站内汇总", weekly: "每周站内汇总", page: "仅在本页查看" })[value] || "每日站内汇总";
  }

  function upsertKeywordWatch(query, source, mode) {
    const keyword = deriveWatchKeyword(query);
    if (!keyword || !isUsableKeyword(keyword)) return { status: "invalid" };
    const key = keywordKey(keyword);
    const existingIndex = watchState.watches.findIndex(function (watch) { return watch.key === key; });
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const existing = watchState.watches[existingIndex];
      const updated = {
        ...existing,
        mode: MODE_CONFIG[mode] ? mode : existing.mode,
        updatedAt: now,
        lastSearchedAt: source === "search" ? now : existing.lastSearchedAt,
        searchCount: source === "search" ? existing.searchCount + 1 : existing.searchCount
      };
      const watches = watchState.watches.slice();
      watches.splice(existingIndex, 1, updated);
      if (!saveWatchState({ ...watchState, watches: watches })) return { status: "error" };
      return { status: "existing", watch: updated };
    }

    if (watchState.watches.length >= KEYWORD_WATCH_LIMIT) return { status: "limit", keyword: keyword };
    const watch = createKeywordWatch(keyword, source, MODE_CONFIG[mode] ? mode : "ai");
    if (!saveWatchState({ ...watchState, watches: [watch].concat(watchState.watches) })) return { status: "error" };
    return { status: "created", watch: watch };
  }

  function updateMessageBadge() {
    const keywordUnread = totalKeywordUnread();
    const total = BASE_MESSAGE_COUNT + keywordUnread;
    if (messageCount) messageCount.textContent = total > 99 ? "99+" : String(total);
    if (messageButton) {
      messageButton.setAttribute(
        "aria-label",
        "消息，" + total + " 条未读，其中 " + keywordUnread + " 条词汇动态"
      );
    }
  }

  function renderWatchStatus() {
    if (!keywordFollowStatus || !watchState) return;
    const count = watchState.watches.length;
    const unread = totalKeywordUnread();
    const title = watchState.autoFollow ? "自动关注已开启" : "自动关注已关闭";
    let detail = "尚未关注词汇，可搜索或从下方推荐词开始。";
    if (count > 0) {
      detail = "已关注 " + count + "/" + KEYWORD_WATCH_LIMIT + " 个词汇";
      detail += unread > 0 ? "，有 " + unread + " 条未读动态。" : "，暂无未读动态。";
    }
    keywordFollowStatus.replaceChildren(createElement("strong", "", title), createElement("span", "", detail));

    if (searchFollowTip) {
      searchFollowTip.textContent = watchState.autoFollow
        ? "📌 搜索提交后会自动建立词汇关注并生成相关动态，可在“热词推荐”中管理。"
        : "📌 搜索词自动关注已关闭；搜索仍会正常进行，也可在“热词推荐”中手动关注。";
    }
  }

  function createSuggestionCard(suggestion) {
    const article = createElement("article", "rec-follow-card");
    article.dataset.keywordSuggestion = suggestion.keyword;
    const heading = createElement("div", "rec-follow-card-heading");
    const keyword = createElement("strong", "", suggestion.keyword);
    keyword.title = suggestion.keyword;
    heading.append(keyword, createElement("span", "", "推荐关注"));
    const meta = createElement("p", "rec-follow-meta", "本周热度 " + suggestion.trend);
    const actions = createElement("div", "rec-follow-actions");
    const followButton = createElement("button", "", "关注 (" + suggestion.followers + ")");
    followButton.type = "button";
    followButton.dataset.keywordFollow = suggestion.keyword;
    followButton.setAttribute("aria-pressed", "false");
    followButton.setAttribute("aria-label", "关注词汇“" + suggestion.keyword + "”");
    actions.appendChild(followButton);
    article.append(heading, meta, actions);
    return article;
  }

  function createUpdateItem(watch, update) {
    const expanded = expandedUpdateId === update.id;
    const item = createElement("li", "rec-follow-update" + (update.read ? "" : " is-unread"));
    const button = createElement("button");
    button.type = "button";
    button.dataset.watchUpdate = watch.key;
    button.dataset.updateId = update.id;
    button.setAttribute("aria-expanded", String(expanded));
    button.setAttribute("aria-label", (update.read ? "查看" : "查看并标记已读") + "：" + update.title);
    button.append(
      createElement("span", "rec-follow-update-type", update.type),
      createElement("strong", "", update.title),
      createElement("time", "", formatRelativeTime(update.createdAt)),
      createElement("span", "rec-follow-update-state", update.read ? "已读" : "未读")
    );
    if (expanded) button.appendChild(createElement("p", "", update.summary || "暂无更多摘要，系统正在持续监测。"));
    item.appendChild(button);
    return item;
  }

  function createWatchCard(watch) {
    const unread = unreadCountFor(watch);
    const expanded = expandedWatchKey === watch.key;
    const article = createElement("article", "rec-follow-card is-following" + (expanded ? " is-expanded" : ""));
    article.dataset.keywordWatchCard = watch.key;

    const heading = createElement("div", "rec-follow-card-heading");
    const keyword = createElement("strong", "", watch.keyword);
    keyword.title = watch.keyword;
    const badge = createElement("span", "rec-follow-badge" + (unread ? "" : " is-read"), unread ? unread + " 条未读" : "已读");
    heading.append(keyword, badge);

    const sourceLabel = watch.source === "search" ? "来自搜索" : "手动关注";
    const meta = createElement(
      "p",
      "rec-follow-meta",
      sourceLabel + " · 今日新增 " + watch.metrics.todayNew + " 条 · " + formatRelativeTime(watch.updatedAt) + "更新"
    );
    const actions = createElement("div", "rec-follow-actions");
    const toggleButton = createElement("button", "is-following", expanded ? "收起动态" : "查看动态");
    const updatesId = "rec-watch-updates-" + watch.id;
    toggleButton.type = "button";
    toggleButton.dataset.watchToggle = watch.key;
    toggleButton.setAttribute("aria-expanded", String(expanded));
    toggleButton.setAttribute("aria-controls", updatesId);
    toggleButton.setAttribute("aria-label", (expanded ? "收起" : "查看") + "“" + watch.keyword + "”相关动态");
    actions.appendChild(toggleButton);

    const updates = createElement("div", "rec-follow-updates");
    updates.id = updatesId;
    updates.hidden = !expanded;
    const updatesHead = createElement("div", "rec-follow-updates-head");
    updatesHead.appendChild(createElement("strong", "", "最新相关动态 · " + frequencyLabel(watch.frequency)));
    const markAllButton = createElement("button", "", unread ? "全部标为已读" : "已全部读取");
    markAllButton.type = "button";
    markAllButton.dataset.markWatchRead = watch.key;
    markAllButton.disabled = unread === 0;
    updatesHead.appendChild(markAllButton);
    updates.appendChild(updatesHead);

    if (watch.updates.length > 0) {
      const list = createElement("ul", "rec-follow-update-list");
      watch.updates.forEach(function (update) { list.appendChild(createUpdateItem(watch, update)); });
      updates.appendChild(list);
    } else {
      updates.appendChild(createElement("div", "rec-follow-empty", "暂无新动态，系统正在持续监测。"));
    }

    const preferences = createElement("div", "rec-follow-preferences");
    const frequencyControl = createElement("label", "", "推送频率");
    const frequencySelect = createElement("select");
    frequencySelect.dataset.watchFrequency = watch.key;
    frequencySelect.setAttribute("aria-label", "“" + watch.keyword + "”推送频率");
    [
      ["realtime", "重大动态实时推送"],
      ["daily", "每日站内汇总"],
      ["weekly", "每周站内汇总"],
      ["page", "仅在本页查看"]
    ].forEach(function (entry) {
      const option = createElement("option", "", entry[1]);
      option.value = entry[0];
      option.selected = watch.frequency === entry[0];
      frequencySelect.appendChild(option);
    });
    frequencyControl.appendChild(frequencySelect);

    const stopButton = createElement(
      "button",
      pendingRemovalKey === watch.key ? "is-confirming" : "",
      pendingRemovalKey === watch.key ? "确认停止关注" : "停止关注"
    );
    stopButton.type = "button";
    stopButton.dataset.stopWatch = watch.key;
    stopButton.setAttribute("aria-label", (pendingRemovalKey === watch.key ? "确认停止关注“" : "停止关注“") + watch.keyword + "”");
    preferences.append(frequencyControl, stopButton);
    updates.appendChild(preferences);

    article.append(heading, meta, actions, updates);
    return article;
  }

  function renderKeywordFollows() {
    if (!keywordFollowGrid || !watchState) return;
    keywordFollowGrid.replaceChildren();

    const watches = watchState.watches.slice().sort(function (left, right) {
      return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
    });

    if (watches.length === 0) {
      const empty = createElement("div", "rec-follow-empty");
      empty.append(
        createElement("strong", "", "还没有关注的词汇"),
        createElement("span", "", "完成一次搜索后会自动建立关注，也可以从推荐词开始。")
      );
      const focusSearchButton = createElement("button", "", "去搜索");
      focusSearchButton.type = "button";
      focusSearchButton.dataset.focusKeywordSearch = "true";
      empty.appendChild(focusSearchButton);
      keywordFollowGrid.appendChild(empty);
    }

    watches.forEach(function (watch) { keywordFollowGrid.appendChild(createWatchCard(watch)); });
    const watchedKeys = new Set(watches.map(function (watch) { return watch.key; }));
    const suggestionSlots = Math.max(0, 4 - watches.length);
    KEYWORD_SUGGESTIONS
      .filter(function (suggestion) { return !watchedKeys.has(keywordKey(suggestion.keyword)); })
      .slice(0, suggestionSlots)
      .forEach(function (suggestion) { keywordFollowGrid.appendChild(createSuggestionCard(suggestion)); });

    if (autoFollowCheckbox) autoFollowCheckbox.checked = watchState.autoFollow;
    renderWatchStatus();
    updateMessageBadge();
  }

  function focusGridControl(attribute, value) {
    window.requestAnimationFrame(function () {
      const candidate = Array.from(keywordFollowGrid?.querySelectorAll("[" + attribute + "]") || []).find(function (node) {
        return node.getAttribute(attribute) === value;
      });
      candidate?.focus();
    });
  }

  function updateWatch(key, updateFunction) {
    const index = watchState.watches.findIndex(function (watch) { return watch.key === key; });
    if (index < 0) return false;
    const nextWatches = watchState.watches.slice();
    nextWatches[index] = updateFunction(watchState.watches[index]);
    return saveWatchState({ ...watchState, watches: nextWatches });
  }

  function markUpdateRead(watchKey, updateId) {
    const nextExpanded = expandedUpdateId === updateId ? "" : updateId;
    const saved = updateWatch(watchKey, function (watch) {
      return {
        ...watch,
        updates: watch.updates.map(function (update) {
          return update.id === updateId ? { ...update, read: true } : update;
        })
      };
    });
    if (!saved) return;
    expandedUpdateId = nextExpanded;
    renderKeywordFollows();
    focusGridControl("data-update-id", updateId);
  }

  function markWatchRead(watchKey) {
    const saved = updateWatch(watchKey, function (watch) {
      return { ...watch, updates: watch.updates.map(function (update) { return { ...update, read: true }; }) };
    });
    if (!saved) return;
    renderKeywordFollows();
    focusGridControl("data-watch-toggle", watchKey);
    showToast("该词汇的动态已全部标为已读");
  }

  function updateWatchFrequency(watchKey, frequency) {
    if (!["realtime", "daily", "weekly", "page"].includes(frequency)) return;
    const saved = updateWatch(watchKey, function (watch) { return { ...watch, frequency: frequency }; });
    if (!saved) return;
    renderKeywordFollows();
    focusGridControl("data-watch-frequency", watchKey);
    showToast("推送频率已更新为“" + frequencyLabel(frequency) + "”");
  }

  function stopWatching(watchKey) {
    if (pendingRemovalKey !== watchKey) {
      window.clearTimeout(pendingRemovalTimer);
      pendingRemovalKey = watchKey;
      renderKeywordFollows();
      focusGridControl("data-stop-watch", watchKey);
      showToast("再次点击“确认停止关注”即可停止后续推送");
      pendingRemovalTimer = window.setTimeout(function () {
        pendingRemovalKey = "";
        renderKeywordFollows();
        focusGridControl("data-stop-watch", watchKey);
      }, 5000);
      return;
    }

    window.clearTimeout(pendingRemovalTimer);
    const removed = watchState.watches.find(function (watch) { return watch.key === watchKey; });
    if (!removed) return;
    const nextWatches = watchState.watches.filter(function (watch) { return watch.key !== watchKey; });
    if (!saveWatchState({ ...watchState, watches: nextWatches })) return;
    pendingRemovalKey = "";
    expandedWatchKey = "";
    expandedUpdateId = "";
    renderKeywordFollows();
    showToast("已停止关注“" + removed.keyword + "”", {
      label: "撤销",
      onAction: function () {
        if (watchState.watches.length >= KEYWORD_WATCH_LIMIT) {
          showToast("关注词已达上限，无法撤销");
          return;
        }
        if (!saveWatchState({ ...watchState, watches: [removed].concat(watchState.watches) })) return;
        expandedWatchKey = removed.key;
        renderKeywordFollows();
        focusGridControl("data-watch-toggle", removed.key);
        showToast("已恢复关注“" + removed.keyword + "”");
      }
    });
  }

  function setSearchMode(mode, shouldFocus) {
    const nextMode = MODE_CONFIG[mode] ? mode : "ai";
    const config = MODE_CONFIG[nextMode];
    activeMode = nextMode;

    let activeTabId = "";
    modeTabs.forEach(function (tab, index) {
      const selected = tab.dataset.recSearchMode === nextMode;
      tab.id = tab.id || "rec-search-mode-tab-" + index;
      tab.setAttribute("aria-controls", "recSearchGuide");
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected) activeTabId = tab.id;
    });

    if (modeSelect) modeSelect.value = nextMode;
    if (searchInput) searchInput.placeholder = config.placeholder;
    if (searchGuide) {
      searchGuide.innerHTML = "<span aria-hidden=\"true\">💡</span><strong>" + config.label + "：</strong>" + config.guide;
      searchGuide.setAttribute("role", "tabpanel");
      searchGuide.setAttribute("aria-labelledby", activeTabId);
    }
    if (shouldFocus && searchInput) searchInput.focus();
  }

  modeTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      setSearchMode(tab.dataset.recSearchMode, false);
    });
    tab.addEventListener("keydown", function (event) {
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % modeTabs.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + modeTabs.length) % modeTabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = modeTabs.length - 1;
      else return;
      event.preventDefault();
      const nextTab = modeTabs[nextIndex];
      setSearchMode(nextTab.dataset.recSearchMode, false);
      nextTab.focus();
    });
  });

  modeSelect?.addEventListener("change", function () {
    setSearchMode(modeSelect.value, true);
  });

  searchForm?.addEventListener("submit", function (event) {
    event.preventDefault();
    const query = searchInput?.value.trim();
    if (!query) {
      showToast("请先输入要检索的内容");
      searchInput?.focus();
      return;
    }
    if (!isUsableKeyword(query)) {
      showToast("检索内容需包含文字或数字，请修改后重试");
      searchInput?.focus();
      return;
    }

    const mode = MODE_CONFIG[activeMode]?.resultMode || "全文";
    const params = new URLSearchParams({ query: query, mode: mode });
    const submitButton = searchForm.querySelector("button[type=\"submit\"]");
    const submitLabel = submitButton?.querySelector("span");
    if (submitButton?.disabled) return;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
    }
    if (submitLabel) submitLabel.textContent = "搜索中";

    let delay = 0;
    if (watchState.autoFollow) {
      const result = upsertKeywordWatch(query, "search", activeMode);
      if (result.status === "created") {
        expandedWatchKey = result.watch.key;
        renderKeywordFollows();
        showToast("已根据搜索自动关注“" + result.watch.keyword + "”，正在生成相关动态");
        delay = 720;
      } else if (result.status === "existing") {
        renderKeywordFollows();
        showToast("已更新“" + result.watch.keyword + "”的搜索关注数据");
        delay = 620;
      } else if (result.status === "limit") {
        showToast("已达到 " + KEYWORD_WATCH_LIMIT + " 个关注上限，本次继续搜索但不新增关注");
        delay = 1000;
      } else if (result.status === "invalid") {
        showToast("未能从本次搜索中识别可关注词汇，本次将继续搜索");
        delay = 900;
      } else if (result.status === "error") {
        delay = 1000;
      }
    }

    window.clearTimeout(searchNavigationTimer);
    searchNavigationTimer = window.setTimeout(function () {
      window.location.href = "index.html?" + params.toString();
    }, delay);
  });

  document.querySelectorAll("[data-hot-query]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (!searchInput) return;
      searchInput.value = button.dataset.hotQuery || button.textContent.trim();
      document.querySelector(".rec-hero")?.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });
      window.setTimeout(function () {
        searchInput.focus();
        searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
      }, prefersReducedMotion.matches ? 0 : 360);
    });
  });

  function setActiveSection(sectionId) {
    sectionLinks.forEach(function (link) {
      const selected = link.dataset.sectionLink === sectionId;
      link.classList.toggle("is-active", selected);
      if (selected) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    const activeLink = sectionLinks.find(function (link) {
      return link.dataset.sectionLink === sectionId;
    });
    if (activeLink && contentNav && contentNav.scrollWidth > contentNav.clientWidth) {
      const targetLeft = activeLink.offsetLeft - (contentNav.clientWidth - activeLink.offsetWidth) / 2;
      contentNav.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: prefersReducedMotion.matches ? "auto" : "smooth"
      });
    }
  }

  sectionLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const sectionId = link.dataset.sectionLink;
      const section = document.getElementById(sectionId);
      if (!section) return;
      event.preventDefault();
      setActiveSection(sectionId);
      section.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });
      try {
        window.history.replaceState(null, "", window.location.pathname + window.location.search + "#" + sectionId);
      } catch (_error) {
        // Hash navigation still works when history replacement is unavailable.
      }
    });
  });

  document.querySelectorAll("[data-back-home]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("source") !== "home" || window.history.length <= 1) return;
      event.preventDefault();
      window.history.back();
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
      const scrollAnchor = (parseFloat(window.getComputedStyle(sections[0]).scrollMarginTop) || 118) + 80;
      let activeSection = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= scrollAnchor) activeSection = section;
        else break;
      }
      if (activeSection) setActiveSection(activeSection.id);
    }, {
      rootMargin: "0px 0px -58% 0px",
      threshold: [0.02, 0.16]
    });
    sections.forEach(function (section) { observer.observe(section); });
  }

  function panelContentFor(panel) {
    return panel.querySelector(
      ".rec-news-grid, .rec-paper-list, .rec-report-grid, .rec-conference-grid"
    );
  }

  document.querySelectorAll(".rec-panel-tabs").forEach(function (tablist, tablistIndex) {
    const tabs = Array.from(tablist.querySelectorAll("[data-panel-tab]"));
    const panel = tablist.closest(".rec-panel");
    const content = panelContentFor(panel);
    const originalItems = content ? Array.from(content.children) : [];

    if (content) {
      content.id = content.id || "rec-tabpanel-" + tablistIndex;
      content.setAttribute("role", "tabpanel");
    }

    function selectPanelTab(tab, tabIndex, moveFocus) {
      tabs.forEach(function (candidate, candidateIndex) {
        const selected = candidate === tab;
        candidate.classList.toggle("is-active", selected);
        candidate.setAttribute("aria-selected", String(selected));
        candidate.tabIndex = selected ? 0 : -1;
        candidate.id = candidate.id || "rec-tab-" + tablistIndex + "-" + candidateIndex;
        if (content) candidate.setAttribute("aria-controls", content.id);
      });

      if (content) {
        content.setAttribute("aria-labelledby", tab.id);
        panel.classList.add("is-updating");
        const offset = tabIndex % Math.max(originalItems.length, 1);
        const ordered = originalItems.slice(offset).concat(originalItems.slice(0, offset));
        ordered.forEach(function (item) { content.appendChild(item); });
        window.setTimeout(function () { panel.classList.remove("is-updating"); }, 160);
      }
      if (moveFocus) tab.focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        selectPanelTab(tab, index, false);
      });
      tab.addEventListener("keydown", function (event) {
        let nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = tabs.length - 1;
        else return;
        event.preventDefault();
        selectPanelTab(tabs[nextIndex], nextIndex, true);
      });
    });

    if (tabs[0]) selectPanelTab(tabs[0], 0, false);
  });

  document.querySelectorAll("[data-follow-button]").forEach(function (button) {
    const compact = button.textContent.trim() === "＋";
    button.addEventListener("click", function () {
      const following = !button.classList.contains("is-following");
      button.classList.toggle("is-following", following);
      button.setAttribute("aria-pressed", String(following));
      if (compact) button.textContent = following ? "✓" : "＋";
      else {
        const count = button.querySelector("small")?.textContent || "";
        button.innerHTML = (following ? "已关注 " : "关注 ") + (count ? "<small>" + count + "</small>" : "");
      }
      showToast(following ? "已在本次原型会话中关注" : "已取消本次原型会话中的关注");
    });
  });

  autoFollowCheckbox?.addEventListener("change", function () {
    const nextState = { ...watchState, autoFollow: autoFollowCheckbox.checked };
    if (!saveWatchState(nextState)) {
      autoFollowCheckbox.checked = watchState.autoFollow;
      return;
    }
    renderKeywordFollows();
    showToast(watchState.autoFollow ? "搜索词自动关注已开启" : "搜索词自动关注已关闭");
  });

  keywordFollowGrid?.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button || !keywordFollowGrid.contains(button)) return;

    if (button.dataset.focusKeywordSearch) {
      document.querySelector(".rec-hero")?.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });
      window.setTimeout(function () { searchInput?.focus(); }, prefersReducedMotion.matches ? 0 : 360);
      return;
    }

    if (button.dataset.keywordFollow) {
      const result = upsertKeywordWatch(button.dataset.keywordFollow, "manual", activeMode);
      if (result.status === "created") {
        renderKeywordFollows();
        focusGridControl("data-watch-toggle", result.watch.key);
        showToast("已关注“" + result.watch.keyword + "”，3 条相关动态已生成", {
          label: "查看动态",
          onAction: function () {
            expandedWatchKey = result.watch.key;
            expandedUpdateId = "";
            renderKeywordFollows();
            const card = Array.from(keywordFollowGrid.querySelectorAll("[data-keyword-watch-card]")).find(function (node) {
              return node.dataset.keywordWatchCard === result.watch.key;
            });
            card?.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "center" });
            focusGridControl("data-watch-toggle", result.watch.key);
          }
        });
      } else if (result.status === "existing") {
        expandedWatchKey = result.watch.key;
        renderKeywordFollows();
        focusGridControl("data-watch-toggle", result.watch.key);
        showToast("该词汇已在关注中");
      } else if (result.status === "limit") {
        showToast("最多可同时关注 " + KEYWORD_WATCH_LIMIT + " 个词汇，请先停止一个关注");
      }
      return;
    }

    if (button.dataset.watchToggle) {
      const watchKey = button.dataset.watchToggle;
      expandedWatchKey = expandedWatchKey === watchKey ? "" : watchKey;
      expandedUpdateId = "";
      pendingRemovalKey = "";
      window.clearTimeout(pendingRemovalTimer);
      renderKeywordFollows();
      focusGridControl("data-watch-toggle", watchKey);
      return;
    }

    if (button.dataset.watchUpdate && button.dataset.updateId) {
      markUpdateRead(button.dataset.watchUpdate, button.dataset.updateId);
      return;
    }

    if (button.dataset.markWatchRead) {
      markWatchRead(button.dataset.markWatchRead);
      return;
    }

    if (button.dataset.stopWatch) stopWatching(button.dataset.stopWatch);
  });

  keywordFollowGrid?.addEventListener("change", function (event) {
    const select = event.target.closest("select[data-watch-frequency]");
    if (!select || !keywordFollowGrid.contains(select)) return;
    updateWatchFrequency(select.dataset.watchFrequency, select.value);
  });

  messageButton?.addEventListener("click", function () {
    const unreadWatch = watchState.watches.find(function (watch) { return unreadCountFor(watch) > 0; });
    if (!unreadWatch) {
      showToast("暂无未读词汇动态；完整消息中心将在账号体系接入后开放");
      return;
    }
    expandedWatchKey = unreadWatch.key;
    expandedUpdateId = "";
    renderKeywordFollows();
    const card = Array.from(keywordFollowGrid?.querySelectorAll("[data-keyword-watch-card]") || []).find(function (node) {
      return node.dataset.keywordWatchCard === unreadWatch.key;
    });
    card?.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      block: "center"
    });
    window.setTimeout(function () {
      focusGridControl("data-watch-toggle", unreadWatch.key);
    }, prefersReducedMotion.matches ? 0 : 360);
    showToast("已定位到“" + unreadWatch.keyword + "”未读动态");
  });

  document.querySelectorAll("[data-save-button]").forEach(function (button) {
    const textButton = button.textContent.trim().length > 0;
    button.addEventListener("click", function () {
      const saved = !button.classList.contains("is-saved");
      button.classList.toggle("is-saved", saved);
      button.setAttribute("aria-pressed", String(saved));
      if (textButton) button.textContent = saved ? "已收藏" : "收藏";
      else {
        button.setAttribute("aria-label", saved ? "取消收藏" : "收藏");
        button.title = saved ? "已收藏" : "收藏";
      }
      showToast(saved ? "已在本次原型会话中收藏" : "已取消本次原型会话中的收藏");
    });
  });

  document.querySelectorAll("[data-register-button]").forEach(function (button) {
    button.addEventListener("click", function () {
      const registered = button.getAttribute("aria-pressed") === "true";
      button.setAttribute("aria-pressed", String(!registered));
      button.textContent = registered ? "立即报名" : "已报名";
      button.classList.toggle("is-registered", !registered);
      showToast(registered ? "已取消本次原型会话中的报名" : "报名状态已在原型中更新");
    });
  });

  document.querySelectorAll("[data-demo-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      showToast(button.dataset.demoAction || "此功能为原型演示");
    });
  });

  mobileMenu?.addEventListener("click", function () {
    const open = !mainNav.classList.contains("is-open");
    mainNav.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
  });

  document.addEventListener("click", function (event) {
    if (!mainNav?.classList.contains("is-open")) return;
    if (mainNav.contains(event.target) || mobileMenu?.contains(event.target)) return;
    mainNav.classList.remove("is-open");
    mobileMenu?.setAttribute("aria-expanded", "false");
    mobileMenu?.setAttribute("aria-label", "打开导航");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape" || !mainNav?.classList.contains("is-open")) return;
    mainNav.classList.remove("is-open");
    mobileMenu?.setAttribute("aria-expanded", "false");
    mobileMenu?.setAttribute("aria-label", "打开导航");
    mobileMenu?.focus();
  });

  function initializeFromLocation() {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    if (from === "simulation" && searchInput) {
      searchInput.value = "AI 仿真实验";
      setSearchMode("association", false);
    } else {
      setSearchMode(params.get("mode") || "ai", false);
    }

    const sectionId = window.location.hash.slice(1);
    const target = document.getElementById(sectionId);
    if (target && target.matches("[data-rec-section]")) {
      const alignInitialSection = function () {
        setActiveSection(sectionId);
        const root = document.documentElement;
        const previousInlineBehavior = root.style.scrollBehavior;
        const scrollMargin = parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - scrollMargin;
        root.style.scrollBehavior = "auto";
        window.scrollTo(0, Math.max(0, targetTop));
        root.style.scrollBehavior = previousInlineBehavior;
      };
      window.requestAnimationFrame(alignInitialSection);
      if (document.readyState === "complete") {
        window.setTimeout(alignInitialSection, 60);
      } else {
        window.addEventListener("load", function () {
          window.setTimeout(alignInitialSection, 60);
        }, { once: true });
      }
    } else {
      setActiveSection("hot");
    }
  }

  watchState = loadWatchState();
  renderKeywordFollows();
  initializeFromLocation();

  window.addEventListener("pageshow", function (event) {
    if (!event.persisted) return;
    watchState = loadWatchState();
    renderKeywordFollows();
  });
})();
