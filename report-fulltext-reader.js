(function (global) {
  "use strict";

  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  let dialog = null, state = null;

  function highlight(value, query) {
    const parsed = global.PortalKeywordModel?.parse(query);
    const terms = parsed && !parsed.error ? parsed.terms.map(term => term.text) : String(query || "").trim().split(/\s+/u);
    const needles = [...new Set(terms.filter(Boolean))].sort((a, b) => b.length - a.length);
    if (!needles.length) return esc(value);
    const pattern = new RegExp(needles.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "giu");
    const source = String(value == null ? "" : value);
    let markup = "", offset = 0;
    for (const match of source.matchAll(pattern)) {
      markup += esc(source.slice(offset, match.index)) + `<mark>${esc(match[0])}</mark>`;
      offset = match.index + match[0].length;
    }
    return markup + esc(source.slice(offset));
  }

  function ensureDialog() {
    if (dialog) return;
    dialog = document.createElement("div");
    dialog.id = "portalReportReader";
    dialog.className = "report-fulltext-reader";
    dialog.hidden = true;
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "reportFulltextTitle");
    dialog.setAttribute("aria-describedby", "reportFulltextNotice");
    dialog.innerHTML = `<div class="report-fulltext-backdrop" data-report-reader-close></div>
      <section class="report-fulltext-panel">
        <header class="report-fulltext-header">
          <div><p class="report-fulltext-eyebrow">报告全文</p><h2 id="reportFulltextTitle"></h2><p id="reportFulltextNotice" class="report-fulltext-notice"></p></div>
          <button class="report-fulltext-close" type="button" data-report-reader-close aria-label="关闭报告全文">×</button>
        </header>
        <div class="report-fulltext-toolbar">
          <div class="report-fulltext-match-nav"><button type="button" data-report-reader-prev>上一处</button><strong id="reportFulltextMatchStatus" role="status" aria-live="polite"></strong><button type="button" data-report-reader-next>下一处</button></div>
          <label class="report-fulltext-page-control">页码 <select id="reportFulltextPageSelect" aria-label="报告页码"></select><span id="reportFulltextPageCount"></span></label>
        </div>
        <p class="report-fulltext-error" id="reportFulltextError" role="alert" hidden></p>
        <div class="report-fulltext-workspace">
          <aside class="report-fulltext-sidebar" aria-label="全文命中位置"><h3>检索词关联句</h3><p id="reportFulltextQuery" class="report-fulltext-query"></p><ol id="reportFulltextHitList"></ol></aside>
          <div class="report-fulltext-pages" id="reportFulltextPages" aria-label="报告完整正文" tabindex="0"></div>
        </div>
      </section>`;
    document.body.append(dialog);
    dialog.addEventListener("click", event => {
      if (event.target.closest("[data-report-reader-close]")) return close();
      const hit = event.target.closest("[data-report-reader-hit]");
      if (hit) return selectHit(Number(hit.dataset.reportReaderHit));
      if (event.target.closest("[data-report-reader-prev]")) return selectHit(state.selected - 1);
      if (event.target.closest("[data-report-reader-next]")) return selectHit(state.selected + 1);
    });
    dialog.querySelector("#reportFulltextPageSelect").addEventListener("change", event => {
      const index = state?.pages.findIndex(page => String(page.pageNumber) === event.target.value);
      if (index == null || index < 0) return;
      dialog.querySelector(`#report-fulltext-page-${index}`)?.scrollIntoView({ block: "start", behavior: "auto" });
    });
    dialog.querySelector("#reportFulltextPages").addEventListener("scroll", () => {
      if (!state || state.scrollFrame) return;
      state.scrollFrame = global.requestAnimationFrame(() => {
        if (!state) return;
        state.scrollFrame = null;
        const container = dialog.querySelector("#reportFulltextPages");
        const top = container.getBoundingClientRect().top;
        const pages = [...container.querySelectorAll(".report-fulltext-paper")];
        const current = pages.find(page => page.getBoundingClientRect().bottom > top + 60);
        if (current) dialog.querySelector("#reportFulltextPageSelect").value = current.dataset.reportPage;
      });
    }, { passive: true });
    document.addEventListener("keydown", event => {
      if (!state || dialog.hidden) return;
      if (event.key === "Escape") { event.preventDefault(); event.stopImmediatePropagation(); close(); return; }
      if (event.key !== "Tab") return;
      const controls = [...dialog.querySelectorAll('button:not(:disabled), select:not(:disabled), [tabindex="0"]')].filter(node => !node.hidden && node.getClientRects().length);
      if (!controls.length) return;
      const first = controls[0], last = controls[controls.length - 1], current = document.activeElement;
      if (event.shiftKey && (current === first || !controls.includes(current))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (current === last || !dialog.contains(current))) { event.preventDefault(); first.focus(); }
    }, true);
    document.addEventListener("focusin", event => {
      if (state && !dialog.hidden && !dialog.contains(event.target)) dialog.querySelector(".report-fulltext-close").focus({ preventScroll: true });
    });
  }

  function selectHit(index) {
    if (!state?.hits.length || !Number.isInteger(index) || index < 0 || index >= state.hits.length) return;
    state.selected = index;
    const selected = state.hits[index];
    dialog.querySelector("#reportFulltextMatchStatus").textContent = `第 ${index + 1} / ${state.hits.length} 处命中`;
    dialog.querySelector("[data-report-reader-prev]").disabled = index === 0;
    dialog.querySelector("[data-report-reader-next]").disabled = index === state.hits.length - 1;
    dialog.querySelector("#reportFulltextPageSelect").value = String(selected.hit.pageNumber);
    dialog.querySelectorAll("[data-report-reader-hit]").forEach((button, position) => {
      button.classList.toggle("is-active", position === index);
      if (position === index) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
    dialog.querySelectorAll(".report-fulltext-paragraph.is-selected").forEach(node => node.classList.remove("is-selected"));
    const target = dialog.querySelector(`#report-fulltext-paragraph-${selected.pageIndex}-${selected.paragraphIndex}`);
    if (!target) return;
    target.classList.add("is-selected");
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "center", behavior: "auto" });
  }

  function open(options) {
    ensureDialog();
    if (state) close(false);
    const { record, query = "", trigger = document.activeElement } = options || {};
    const source = record?.document;
    const object = value => value != null && typeof value === "object" && !Array.isArray(value);
    const aliases = Array.isArray(source?.resourceIdAliases) ? source.resourceIdAliases : [];
    const resourceMatches = object(source) && record?.id != null && (source.resourceId === record.id || aliases.includes(record.id));
    let invalidParts = 0;
    const pageNumbers = new Set();
    const pages = (resourceMatches && Array.isArray(source.pages) ? source.pages : []).map(page => {
      if (!object(page) || !Number.isInteger(page.pageNumber) || page.pageNumber < 1 || pageNumbers.has(page.pageNumber) || !Array.isArray(page.paragraphs)) { invalidParts++; return null; }
      pageNumbers.add(page.pageNumber);
      const paragraphIds = new Set();
      const paragraphs = page.paragraphs.filter(paragraph => {
        if (!object(paragraph) || typeof paragraph.text !== "string") { invalidParts++; return false; }
        const id = paragraph.paragraphId || paragraph.id;
        if (typeof id !== "string" || !id || paragraphIds.has(id)) { invalidParts++; return false; }
        paragraphIds.add(id);
        return true;
      });
      return { ...page, paragraphs };
    }).filter(Boolean);
    const documentId = source?.documentId || source?.id, documentVersion = source?.documentVersion || source?.version;
    const rawHits = Array.isArray(record?.fulltextHits) ? record.fulltextHits : [];
    const hits = rawHits.map((hit, originalIndex) => {
      if (!resourceMatches || !object(hit) || !documentId || !documentVersion || hit.documentId !== documentId || hit.documentVersion !== documentVersion || typeof hit.sentence !== "string" || !hit.sentence.trim()) return null;
      const pageIndex = pages.findIndex(page => page.pageNumber === hit.pageNumber);
      if (pageIndex < 0) return null;
      const paragraphIndex = pages[pageIndex].paragraphs.findIndex(paragraph => (paragraph.paragraphId || paragraph.id) === hit.paragraphId && String(paragraph.text || "").includes(String(hit.sentence || "")));
      return paragraphIndex < 0 ? null : { hit, pageIndex, paragraphIndex, originalIndex };
    }).filter(Boolean);
    state = { record, pages, hits, selected: -1, trigger, originalOverflow: document.body.style.overflow, scrollFrame: null };
    dialog.querySelector("#reportFulltextTitle").textContent = (resourceMatches ? source.title : record?.title) || "报告全文";
    dialog.querySelector("#reportFulltextNotice").textContent = source?.sourceKind === "LOCAL_PROTOTYPE" ? "原型示例正文 · 用于演示检索与定位，非真实报告全文" : source?.notice || "";
    dialog.querySelector("#reportFulltextQuery").textContent = query ? `检索词：${query}` : "";
    dialog.querySelector("#reportFulltextPageCount").textContent = pages.length ? `共 ${pages.length} 页` : "";
    dialog.querySelector("#reportFulltextPageSelect").innerHTML = pages.map(page => `<option value="${esc(page.pageNumber)}">第 ${esc(page.pageNumber)} 页</option>`).join("");
    dialog.querySelector("#reportFulltextPageSelect").disabled = !pages.length;
    dialog.querySelector("#reportFulltextPages").innerHTML = pages.map((page, pageIndex) => `<article class="report-fulltext-paper" id="report-fulltext-page-${pageIndex}" data-report-page="${esc(page.pageNumber)}" aria-label="报告第 ${esc(page.pageNumber)} 页"><header><span>${esc(source.title || record.title)}</span><strong>第 ${esc(page.pageNumber)} 页</strong></header>${page.heading || page.title ? `<h3>${esc(page.heading || page.title)}</h3>` : ""}${page.paragraphs.map((paragraph, paragraphIndex) => `<p class="report-fulltext-paragraph" id="report-fulltext-paragraph-${pageIndex}-${paragraphIndex}" tabindex="-1" data-paragraph-id="${esc(paragraph.paragraphId || paragraph.id)}">${highlight(paragraph.text, query)}</p>`).join("")}<footer>${esc(page.pageNumber)}</footer></article>`).join("");
    dialog.querySelector("#reportFulltextHitList").innerHTML = hits.map(({ hit }, index) => `<li><button type="button" data-report-reader-hit="${index}"><span class="report-fulltext-hit-page">第 ${esc(hit.pageNumber)} 页</span><span>${highlight(hit.sentence, query)}</span></button></li>`).join("") || '<li class="report-fulltext-no-hits">暂无可定位的命中句</li>';
    const error = dialog.querySelector("#reportFulltextError");
    error.hidden = !invalidParts && hits.length === rawHits.length && hits.length > 0;
    error.textContent = source && !resourceMatches ? "报告与正文的资源标识不一致，已停止展示与定位。" : !pages.length ? "未取得报告正文，暂时无法定位。" : !hits.length ? "未取得与当前文档版本一致的定位信息，请返回结果列表重新检索。" : invalidParts ? "部分正文数据异常，已跳过异常内容；当前仅展示可核验的正文与定位位置。" : "部分命中位置与当前文档不一致，仅展示已核验的定位位置。";
    dialog.hidden = false;
    document.body.style.overflow = "hidden";
    const requested = Number.isInteger(options?.hitIndex) ? options.hitIndex : 0;
    const targetIndex = hits.findIndex(hit => hit.originalIndex === requested);
    if (targetIndex >= 0) selectHit(targetIndex);
    else {
      if (hits.length) { error.hidden = false; error.textContent = "所选内容的定位信息与当前文档不一致，请重新选择关联句。"; }
      dialog.querySelector("#reportFulltextMatchStatus").textContent = "暂无可定位命中";
      dialog.querySelector("[data-report-reader-prev]").disabled = true;
      dialog.querySelector("[data-report-reader-next]").disabled = true;
      dialog.querySelector(".report-fulltext-close").focus({ preventScroll: true });
    }
    return true;
  }

  function close(restoreFocus = true) {
    if (!state) return;
    const previous = state;
    if (previous.scrollFrame) global.cancelAnimationFrame(previous.scrollFrame);
    state = null;
    dialog.hidden = true;
    document.body.style.overflow = previous.originalOverflow;
    if (restoreFocus && previous.trigger?.isConnected) previous.trigger.focus({ preventScroll: true });
  }

  global.PortalReportReader = Object.freeze({ open, close });
})(typeof window !== "undefined" ? window : globalThis);
