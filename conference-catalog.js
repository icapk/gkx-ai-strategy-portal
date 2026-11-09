(function () {
  "use strict";

  const items = window.PORTAL_CONFERENCE_SEED?.items || [];
  const ids = new Set(items.map(item => item.id));
  const dayMs = 86400000;
  const visitPrefix = "portal-conference-visit:";
  const guestKey = "portal-conference-guest";
  const stateLabels = { upcoming: "即将举行", ongoing: "进行中", ended: "已结束", unknown: "会期待公布" };

  function localDate(now, timeZone) {
    const parts = new Intl.DateTimeFormat("en", {
      timeZone, year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(now);
    return ["year", "month", "day"].map(type => parts.find(part => part.type === type).value).join("-");
  }

  function status(item, now = Date.now()) {
    if (!item.startDate || !item.endDate || !item.timeZone) return "unknown";
    const today = localDate(now, item.timeZone);
    if (today < item.startDate) return "upcoming";
    return today > item.endDate ? "ended" : "ongoing";
  }

  function formatDates(item) {
    if (!item.startDate || !item.endDate) return "待公布";
    return item.startDate === item.endDate ? item.startDate : item.startDate + " 至 " + item.endDate;
  }

  function participantLabel(item) {
    if (Number.isFinite(item.participantCount)) return item.participantCount.toLocaleString("zh-CN");
    const scope = item.participantCountScope ? "（" + item.participantCountScope + "）" : "";
    if (Number.isFinite(item.participantCountOnsite)) {
      const prefix = item.participantCountOnsiteApproximate ? "约 " : "";
      return prefix + item.participantCountOnsite.toLocaleString("zh-CN") + scope;
    }
    if (!Number.isFinite(item.participantCountLowerBound)) return null;
    const prefix = item.participantCountLowerBoundExclusive ? "超过 " : "至少 ";
    return prefix + item.participantCountLowerBound.toLocaleString("zh-CN") + scope;
  }

  function normalize(value) {
    return String(value || "").normalize("NFKC").toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, " ").trim();
  }

  function matches(item, query) {
    const words = normalize(query).replace(/((?:19|20)\d{2})(?:\s*年)?/g, " $1 ").trim().split(/\s+/).filter(Boolean);
    const searchable = normalize([item.name, item.fullNameEn, item.series, ...item.aliases, ...item.tags].join(" "));
    return words.every(word => {
      if (/^(?:19|20)\d{2}$/.test(word)) return String(item.year) === word;
      if (word === "ai") return searchable.includes("人工智能") || searchable.includes("artificial intelligence") || searchable.split(" ").includes("ai");
      return searchable.includes(word);
    });
  }

  function hasMetrics(item) {
    return [item.submissionCount, item.participantCount, item.heatValue]
      .every(value => Number.isFinite(value) && value >= 0);
  }

  function rank(mode = "recent", combined = false, now = Date.now()) {
    const candidates = items.filter(item => item.inRecommendationCatalog);
    const upcoming = candidates.filter(item => ["ongoing", "upcoming"].includes(status(item, now)));
    if (mode === "recent" && !combined) {
      return upcoming.slice().sort((a, b) =>
        Number(status(b, now) === "ongoing") - Number(status(a, now) === "ongoing")
        || a.startDate.localeCompare(b.startDate) || a.id.localeCompare(b.id)
      ).map(item => ({ item, score: null }));
    }

    const complete = candidates.filter(hasMetrics);
    const eligible = (mode === "recent" ? upcoming.filter(hasMetrics) : complete)
      .filter(item => !combined || status(item, now) !== "unknown");
    if (eligible.length < 3) return [];
    const maxima = ["submissionCount", "participantCount", "heatValue"]
      .map(key => Math.max(1, ...complete.map(item => item[key])));

    return eligible.map(item => {
      const hot = item.submissionCount / maxima[0] * 0.35
        + item.participantCount / maxima[1] * 0.30
        + item.heatValue / maxima[2] * 0.35;
      if (!combined) return { item, score: hot };
      const state = status(item, now);
      const today = localDate(now, item.timeZone);
      const boundary = state === "ended" ? item.endDate : item.startDate;
      const days = state === "ongoing" ? 0 : Math.abs(Date.parse(boundary) - Date.parse(today)) / dayMs;
      const proximity = Math.max(0, 1 - days / 150);
      return { item, score: mode === "hot" ? hot * 0.7 + proximity * 0.3 : proximity * 0.7 + hot * 0.3 };
    }).sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id));
  }

  function recordView(id) {
    if (!ids.has(id)) return;
    try {
      const account = window.PortalSearchRecommend?.snapshot()?.userId;
      let viewer = account && "account:" + account;
      if (!viewer) {
        let guest = localStorage.getItem(guestKey);
        if (!guest) {
          guest = window.crypto?.randomUUID?.() || Date.now() + "-" + Math.random().toString(36).slice(2);
          localStorage.setItem(guestKey, guest);
        }
        viewer = "guest:" + guest;
      }
      const now = Date.now();
      // One local record per conference and viewer, refreshed on each visit.
      const key = visitPrefix + encodeURIComponent(id) + ":" + encodeURIComponent(viewer);
      localStorage.setItem(key, String(now));
      for (let i = localStorage.length - 1; i >= 0; i -= 1) {
        const stored = localStorage.key(i);
        if (stored?.startsWith(visitPrefix) && now - Number(localStorage.getItem(stored)) >= 30 * dayMs) {
          localStorage.removeItem(stored);
        }
      }
    } catch (_) {
      // A blocked browser store does not interrupt opening conference details.
    }
  }

  window.PortalConferenceCatalog = {
    items, matches, status, statusLabel: item => stateLabels[status(item)],
    formatDates, participantLabel, rank, recordView
  };
})();
