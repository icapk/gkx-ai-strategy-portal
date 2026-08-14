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

  const modeTabs = Array.from(document.querySelectorAll("[data-rec-search-mode]"));
  const modeSelect = document.getElementById("recSearchModeSelect");
  const searchForm = document.getElementById("recSearchForm");
  const searchInput = document.getElementById("recSearchInput");
  const searchGuide = document.getElementById("recSearchGuide");
  const mobileMenu = document.getElementById("recMobileMenu");
  const mainNav = document.getElementById("recMainNav");
  const contentNav = document.getElementById("recContentNav");
  const sectionLinks = Array.from(document.querySelectorAll("[data-section-link]"));
  const sections = Array.from(document.querySelectorAll("[data-rec-section]"));
  const toast = document.getElementById("recToast");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeMode = "ai";
  let toastTimer = 0;

  function showToast(message) {
    if (!toast || !message) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = window.setTimeout(function () {
      toast.hidden = true;
    }, 2600);
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
    const mode = MODE_CONFIG[activeMode]?.resultMode || "全文";
    const params = new URLSearchParams({ query: query, mode: mode });
    window.location.href = "index.html?" + params.toString();
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

  initializeFromLocation();
})();
