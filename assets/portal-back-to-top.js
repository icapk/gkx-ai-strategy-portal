/*
 * IconToTop geometry: @arco-design/web-react 2.66.18.
 * MIT License
 * Copyright (c) 2021 Bytedance, Inc. and its affiliates.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(() => {
  'use strict';

  const buttonId = 'portalBackTop';
  const pathname = window.location.pathname.toLowerCase();
  const page = pathname.slice(pathname.lastIndexOf('/') + 1);
  const publicPages = new Set(['', 'index.html', 'recommendations.html', 'ai-research.html', 'strategy.html', 'education.html', 'evaluation.html', 'personal-center.html', 'personal-center-2.html', 'document-center.html']);
  if (window.self !== window.top || pathname.includes('/apps/') || !publicPages.has(page) || document.getElementById(buttonId)) return;

  function initialize() {
    if (!document.body || document.getElementById(buttonId)) return;

    const button = document.createElement('button');
    button.id = buttonId;
    button.className = 'portal-back-top';
    button.type = 'button';
    button.hidden = true;
    button.setAttribute('aria-label', '返回顶部');
    button.title = '返回顶部';
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="4" aria-hidden="true" focusable="false"><path d="M43 7H5M24 20v23M24 13.96 30.453 21H17.546L24 13.96Zm.736-.804Z"/><path fill="currentColor" stroke="none" d="m24 14-6 7h12l-6-7Z"/></svg>';
    document.body.append(button);

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const blockedSelectors = [
      '#iframeShell', '#landingIframeShell', '#qaPage', '.portal-search-page.is-ai',
      '#mobileDrawer', '#landingNavigation.is-open', '#recMainNav.is-open',
      '.portal-search-sidebar.is-open', '#portalMessageCenter', '#portalTicketService',
      'dialog[open]', '[role="dialog"][aria-modal="true"]'
    ].join(',');
    const brandSelectors = '#siteHeader #brandHome, #siteHeader a.brand-home, #recHeader a.rec-brand, .lp-header a.lp-brand, .pc-site-header a.pc-brand';
    let frame = 0;
    let smoothScrolling = false;

    function scrollTop() {
      return window.scrollY || document.scrollingElement?.scrollTop || 0;
    }

    function isVisible(node) {
      if (!node.isConnected || !node.getClientRects().length || node.closest('[inert]')) return false;
      const style = window.getComputedStyle(node);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.visibility !== 'collapse';
    }

    function isBlocked() {
      const overflowY = window.getComputedStyle(document.body).overflowY;
      if (overflowY === 'hidden' || overflowY === 'clip') return true;
      return [...document.querySelectorAll(blockedSelectors)].some(isVisible);
    }

    function stopSmoothScroll() {
      if (!smoothScrolling) return;
      smoothScrolling = false;
      window.scrollTo({ top: scrollTop(), behavior: 'instant' });
    }

    function update() {
      frame = 0;
      const blocked = isBlocked();
      const top = scrollTop();
      if (top <= 0) smoothScrolling = false;
      if (blocked) stopSmoothScroll();
      const visible = top > 480 && !blocked;
      if (!visible && !blocked && document.activeElement === button) return;
      button.hidden = !visible;
    }

    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    function focusTop() {
      const brand = [...document.querySelectorAll(brandSelectors)].find(isVisible);
      const heading = brand || [...document.querySelectorAll('main h1, main h2, h1, main, [role="main"]')].find(isVisible);
      if (!heading) return;
      const previousTabIndex = heading.getAttribute('tabindex');
      const needsTabIndex = !heading.matches('a[href], button, input, select, textarea, [tabindex]');
      const restoreTabIndex = () => {
        if (!needsTabIndex || heading.getAttribute('tabindex') !== '-1') return;
        if (previousTabIndex === null) heading.removeAttribute('tabindex');
        else heading.setAttribute('tabindex', previousTabIndex);
      };
      if (needsTabIndex) {
        heading.setAttribute('tabindex', '-1');
        heading.addEventListener('blur', restoreTabIndex, { once: true });
      }
      try {
        heading.focus({ preventScroll: true });
      } catch (_) {
        restoreTabIndex();
      }
      if (document.activeElement !== heading) restoreTabIndex();
    }

    button.addEventListener('click', () => {
      if (isBlocked()) return;
      focusTop();
      smoothScrolling = !motionPreference.matches && scrollTop() > 0;
      window.scrollTo({ top: 0, behavior: motionPreference.matches ? 'instant' : 'smooth' });
      scheduleUpdate();
    });
    button.addEventListener('blur', scheduleUpdate);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('pageshow', scheduleUpdate);

    const motionChanged = () => {
      if (motionPreference.matches) stopSmoothScroll();
      scheduleUpdate();
    };
    if (motionPreference.addEventListener) motionPreference.addEventListener('change', motionChanged);
    else motionPreference.addListener(motionChanged);

    const bodyObserver = new MutationObserver(scheduleUpdate);
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
    const stateObserver = new MutationObserver(records => {
      if (records.some(record => record.target !== button && !button.contains(record.target))) scheduleUpdate();
    });
    stateObserver.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'open', 'aria-expanded', 'aria-hidden'] });
    update();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
