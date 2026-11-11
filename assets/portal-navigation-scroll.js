(() => {
  "use strict";

  const tabSelector = ".nav-trigger, .portal-glass-tab";
  const selectedSelector = '[aria-current="page"], [aria-selected="true"], .is-active, .is-current';
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function enhanceNavigation(nav) {
    if (nav.parentElement.classList.contains("portal-nav-scroll")) return;
    const shell = document.createElement("div");
    shell.className = "portal-nav-scroll";
    nav.before(shell);
    shell.append(nav);
    const desktop = window.matchMedia(nav.closest(".lp-header") ? "(min-width: 841px)" : "(min-width: 1280px)");
    let layoutFrame = 0;
    let edgeFrame = 0;
    let lastSelected = null;
    let lastWidth = 0;
    let resizeNeedsSelection = true;
    let keyboardPaging = false;

    function makeButton(direction, label) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "portal-nav-scroll-button";
      button.dataset.direction = direction;
      button.setAttribute("aria-label", label);
      if (nav.id) button.setAttribute("aria-controls", nav.id);
      button.hidden = true;
      const chevron = document.createElement("span");
      chevron.className = "portal-nav-scroll-chevron";
      chevron.setAttribute("aria-hidden", "true");
      button.append(chevron);
      button.addEventListener("click", event => {
        keyboardPaging = event.detail === 0;
        // Arrow paging should not leave a hovered submenu open behind it.
        shell.dispatchEvent(new CustomEvent("portal-navigation-scroll", { bubbles: true }));
        nav.scrollBy({ left: nav.clientWidth * (direction === "left" ? -2 / 3 : 2 / 3), behavior: reducedMotion.matches ? "instant" : "smooth" });
      });
      shell.append(button);
      return button;
    }

    const previous = makeButton("left", "向左滚动导航");
    const next = makeButton("right", "向右滚动导航");
    if (nav.id === "recMainNav") shell.addEventListener("portal-navigation-scroll", () => {
      document.dispatchEvent(new CustomEvent("rec-header-menu-open", { detail: null }));
    });

    function updateEdges() {
      edgeFrame = 0;
      const max = nav.scrollWidth - nav.clientWidth;
      const left = desktop.matches && max > 1 && nav.scrollLeft > 1;
      const right = desktop.matches && max > 1 && nav.scrollLeft < max - 1;
      shell.dataset.canScrollLeft = String(left);
      shell.dataset.canScrollRight = String(right);
      previous.hidden = !left;
      next.hidden = !right;
      // Keep keyboard focus in the navigation when a paging button disappears.
      if ((previous.hidden && document.activeElement === previous) || (next.hidden && document.activeElement === next)) {
        const visible = Array.from(nav.querySelectorAll(tabSelector)).find(tab => {
          const bounds = tab.getBoundingClientRect();
          const viewport = nav.getBoundingClientRect();
          return bounds.left >= viewport.left + (left ? 64 : 40) && bounds.right <= viewport.right - (right ? 64 : 40);
        });
        if (keyboardPaging) visible?.focus({ preventScroll: true });
        else document.activeElement.blur();
      }
    }

    function reveal(tab, center = false) {
      if (!desktop.matches || !shell.classList.contains("is-overflowing") || !tab) return;
      const bounds = tab.getBoundingClientRect();
      const viewport = nav.getBoundingClientRect();
      const max = nav.scrollWidth - nav.clientWidth;
      const leftInset = nav.scrollLeft > 1 ? 64 : 40;
      const rightInset = nav.scrollLeft < max - 1 ? 64 : 40;
      const fullyVisible = bounds.left >= viewport.left + leftInset && bounds.right <= viewport.right - rightInset;
      if (fullyVisible && !center) return;
      // Scroll only this navigation; scrollIntoView would also move the page.
      const target = nav.scrollLeft + (bounds.left + bounds.right - viewport.left - viewport.right) / 2;
      nav.scrollTo({ left: target, behavior: reducedMotion.matches ? "instant" : "smooth" });
    }

    function updateLayout() {
      layoutFrame = 0;
      shell.classList.toggle("is-desktop", desktop.matches);
      const width = nav.clientWidth;
      const naturalWidth = nav.scrollWidth - (shell.classList.contains("is-overflowing") ? 80 : 0);
      shell.classList.toggle("is-overflowing", desktop.matches && naturalWidth > width + 1);
      const selected = nav.querySelector(selectedSelector);
      if (selected !== lastSelected || resizeNeedsSelection || width !== lastWidth) reveal(selected);
      lastSelected = selected;
      lastWidth = width;
      resizeNeedsSelection = false;
      updateEdges();
    }

    function scheduleLayout() {
      if (!layoutFrame) layoutFrame = requestAnimationFrame(updateLayout);
    }

    nav.addEventListener("scroll", () => {
      if (!edgeFrame) edgeFrame = requestAnimationFrame(updateEdges);
    }, { passive: true });
    nav.addEventListener("wheel", event => {
      if (!desktop.matches || !shell.classList.contains("is-overflowing") || event.ctrlKey) return;
      shell.dispatchEvent(new CustomEvent("portal-navigation-scroll", { bubbles: true }));
      // Native horizontal trackpad scrolling stays native. Translate a regular wheel.
      if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      const units = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? nav.clientWidth : 1;
      const delta = event.deltaY * units;
      const max = nav.scrollWidth - nav.clientWidth;
      if ((delta < 0 && nav.scrollLeft <= 1) || (delta > 0 && nav.scrollLeft >= max - 1)) return;
      event.preventDefault();
      nav.scrollLeft += delta;
    }, { passive: false });
    nav.addEventListener("focusin", event => {
      const tab = event.target.closest(tabSelector);
      if (tab) reveal(tab);
    });
    nav.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
      const tab = event.target.closest(tabSelector);
      if (!tab) return;
      const tabs = Array.from(nav.querySelectorAll(tabSelector)).filter(item => !item.disabled && item.getClientRects().length);
      const index = tabs.indexOf(tab);
      const target = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : Math.max(0, Math.min(tabs.length - 1, index + (event.key === "ArrowLeft" ? -1 : 1)));
      event.preventDefault();
      tabs[target]?.focus({ preventScroll: true });
    });

    const resizeObserver = new ResizeObserver(scheduleLayout);
    resizeObserver.observe(nav);
    function observeTabs() {
      resizeObserver.disconnect();
      resizeObserver.observe(nav);
      nav.querySelectorAll(tabSelector).forEach(tab => resizeObserver.observe(tab));
    }
    const mutations = new MutationObserver(records => {
      if (records.some(record => record.type === "childList")) observeTabs();
      for (const record of records) {
        if (record.type !== "attributes" || !record.target.matches(tabSelector)) continue;
        const selected = record.target.matches(selectedSelector);
        const wasSelected = record.attributeName === "class" && /(?:^|\s)is-(?:active|current)(?:\s|$)/.test(record.oldValue || "");
        if (selected && (record.attributeName !== "class" || !wasSelected)) reveal(record.target, true);
      }
      scheduleLayout();
    });
    mutations.observe(nav, { childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ["class", "aria-current", "aria-selected"] });
    desktop.addEventListener("change", () => { resizeNeedsSelection = true; scheduleLayout(); });
    window.addEventListener("pageshow", () => { resizeNeedsSelection = true; scheduleLayout(); });
    document.fonts?.ready.then(scheduleLayout);
    observeTabs();
    updateLayout();
  }

  function initialize() {
    document.querySelectorAll("#desktopNav, #recMainNav, #landingNavigation").forEach(enhanceNavigation);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
