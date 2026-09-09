(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const version = '20260909-system-docs';
  const storageKey = 'gkx.document-center.favorites.v1';
  const legacyIds = ['start', 'overview', 'quickstart', 'navigation', 'search', 'services', 'messages', 'account', 'faq'];
  const markdownCache = new Map();
  let docs = [], currentDoc, currentMarkdown = '', headings = [];
  let favoriteIds = new Set(), favoritesOnly = false, searchTerm = '', toastTimer;
  let requestId = 0, controller;

  function toast(message) {
    clearTimeout(toastTimer);
    $('toast').textContent = message;
    $('toast').hidden = false;
    toastTimer = setTimeout(() => $('toast').hidden = true, 3000);
  }

  function setBusy(busy) {
    $('article').setAttribute('aria-busy', String(busy));
    ['downloadMarkdown', 'printDocument', 'shareButton', 'favoriteButton'].forEach(id => $(id).disabled = busy || !currentMarkdown);
  }

  function showStatus(message, retry = false) {
    $('documentStatus').hidden = false;
    $('documentStatus').innerHTML = `${escape(message)}${retry ? '<button id="retryDocument" type="button">重新加载</button>' : ''}`;
    $('retryDocument')?.addEventListener('click', () => docs.length ? route(true) : loadCatalog());
  }

  function renderNavigation() {
    const visible = docs.filter(doc => (!favoritesOnly || favoriteIds.has(doc.id)) && doc.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()));
    $('docNavigation').innerHTML = visible.map(doc => `<a class="nav-link ${doc.id === currentDoc?.id ? 'active' : ''}" href="#${doc.id}" ${doc.id === currentDoc?.id ? 'aria-current="page"' : ''}>${escape(doc.title)}</a>`).join('') || `<div class="empty-state"><p>${favoritesOnly ? (searchTerm ? '收藏中没有匹配的系统文档' : '还没有收藏文档<br>点击正文上方的星形按钮添加') : '没有找到匹配的系统'}</p><button type="button" id="resetNavigation">查看全部系统</button></div>`;
    $('resetNavigation')?.addEventListener('click', resetNavigation);
    $('searchStatus').hidden = !searchTerm && !favoritesOnly;
    $('searchStatus').textContent = `${favoritesOnly ? '我的收藏' : '搜索结果'} · ${visible.length} 个系统`;
    $('clearSearch').hidden = !searchTerm;
    $('myFavorites').setAttribute('aria-pressed', String(favoritesOnly));
  }

  function resetNavigation() {
    favoritesOnly = false;
    searchTerm = '';
    $('directorySearch').value = '';
    renderNavigation();
  }

  function updateFavorite() {
    const saved = favoriteIds.has(currentDoc?.id);
    $('favoriteButton').setAttribute('aria-pressed', String(saved));
    $('favoriteButton').title = saved ? '取消收藏' : '收藏文档';
    $('favoriteButton').setAttribute('aria-label', $('favoriteButton').title);
  }

  function updateToc(id) {
    $('pageToc').querySelectorAll('a').forEach(link => {
      const active = link.dataset.section === id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function renderMarkdown(markdown, doc) {
    $('articleContent').innerHTML = DOMPurify.sanitize(marked.parse(markdown, { gfm: true }), { USE_PROFILES: { html: true } });
    const firstHeading = $('articleContent').querySelector('h1');
    if (firstHeading?.textContent.trim() === doc.title) firstHeading.remove();
    const usedIds = new Map();
    headings = [...$('articleContent').querySelectorAll('h2,h3,h4')].map(node => {
      const base = node.textContent.trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s+/g, '-') || 'section';
      const count = usedIds.get(base) || 0;
      usedIds.set(base, count + 1);
      const id = count ? `${base}-${count}` : base;
      node.id = `${doc.id}-${id}`;
      return { id, title: node.textContent, level: node.tagName, node };
    });
    $('articleContent').querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        let anchor;
        try { anchor = decodeURIComponent(href.slice(1)); } catch { return; }
        const heading = headings.find(item => item.id === anchor);
        if (heading) link.setAttribute('href', `#${doc.id}/${encodeURIComponent(heading.id)}`);
      } else {
        link.target = '_top';
        link.rel = 'noopener';
      }
    });
    const tocHeadings = headings.filter(item => item.level === 'H2');
    $('pageToc').innerHTML = tocHeadings.map(item => `<a href="#${doc.id}/${encodeURIComponent(item.id)}" data-section="${escape(item.id)}">${escape(item.title)}</a>`).join('');
    document.querySelector('.toc').hidden = !tocHeadings.length;
  }

  function scrollToSection(sectionId) {
    requestAnimationFrame(() => {
      const heading = headings.find(item => item.id === sectionId);
      if (heading) {
        heading.node.scrollIntoView();
        const index = headings.indexOf(heading);
        updateToc(headings.slice(0, index + 1).filter(item => item.level === 'H2').at(-1)?.id);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
        updateToc(headings.find(item => item.level === 'H2')?.id);
      }
    });
  }

  async function route(force = false) {
    if (!docs.length) return;
    if (location.hash === '#article' && currentMarkdown) { $('article').focus(); return; }
    const [rawId, rawSection] = location.hash.slice(1).split('/');
    const id = legacyIds.includes(rawId) ? 'portal' : rawId;
    const doc = docs.find(item => item.id === id) || docs[0];
    let sectionId = '';
    try { sectionId = decodeURIComponent(rawSection || ''); } catch {}
    if (currentDoc?.id === doc.id && currentMarkdown && !force) { scrollToSection(sectionId); return; }
    const token = ++requestId;
    controller?.abort();
    controller = new AbortController();
    currentDoc = doc;
    currentMarkdown = '';
    headings = [];
    $('articleContent').replaceChildren();
    $('pageToc').replaceChildren();
    document.querySelector('.toc').hidden = true;
    $('documentTitle').textContent = doc.title;
    $('documentUpdated').textContent = `最近更新时间：${doc.updated}`;
    document.title = `${doc.title} - 文档中心 · 智慧服务门户`;
    $('breadcrumb').innerHTML = `<a href="#portal">文档中心</a><span aria-hidden="true">/</span><span class="current" aria-current="page">${escape(doc.title)}</span>`;
    const index = docs.indexOf(doc), prev = docs[index - 1], next = docs[index + 1];
    $('nextDocs').innerHTML = `${prev ? `<a href="#${prev.id}"><span>上一篇</span>← ${escape(prev.title)}</a>` : ''}${next ? `<a href="#${next.id}"><span>下一篇</span>${escape(next.title)} →</a>` : ''}`;
    $('sharePanel').hidden = true;
    $('shareButton').setAttribute('aria-expanded', 'false');
    updateFavorite();
    renderNavigation();
    setBusy(true);
    showStatus('正在加载文档…');
    window.scrollTo({ top: 0, behavior: 'instant' });
    try {
      let markdown = markdownCache.get(doc.id);
      if (!markdown || force) {
        const response = await fetch(`${doc.path}?v=${version}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Document unavailable');
        markdown = await response.text();
        if (!markdown.trim()) throw new Error('Empty document');
      }
      if (token !== requestId) return;
      renderMarkdown(markdown, doc);
      markdownCache.set(doc.id, markdown);
      currentMarkdown = markdown;
      $('documentStatus').hidden = true;
      setBusy(false);
      scrollToSection(sectionId);
    } catch (error) {
      if (token !== requestId || error.name === 'AbortError') return;
      setBusy(false);
      showStatus('文档暂时无法加载，请重试。', true);
    }
  }

  async function loadCatalog() {
    setBusy(true);
    showStatus('正在加载文档…');
    try {
      const response = await fetch(`docs/systems/manifest.json?v=${version}`);
      if (!response.ok) throw new Error('Catalog unavailable');
      const catalog = await response.json();
      if (!Array.isArray(catalog) || !catalog.length || catalog.some(doc => !/^[a-z0-9-]+$/.test(doc.id) || typeof doc.title !== 'string' || !/^docs\/systems\/[a-z0-9-]+\.md$/.test(doc.path))) throw new Error('Invalid catalog');
      docs = catalog;
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (Array.isArray(saved)) favoriteIds = new Set(saved.map(id => legacyIds.includes(id) ? 'portal' : id).filter(id => docs.some(doc => doc.id === id)));
      } catch {}
      await route();
    } catch {
      setBusy(false);
      showStatus('系统目录暂时无法加载，请重试。', true);
    }
  }

  $('directorySearch').addEventListener('input', event => { searchTerm = event.target.value.trim(); renderNavigation(); });
  $('clearSearch').addEventListener('click', () => { searchTerm = ''; $('directorySearch').value = ''; renderNavigation(); $('directorySearch').focus(); });
  $('myFavorites').addEventListener('click', () => { favoritesOnly = !favoritesOnly; renderNavigation(); });
  $('favoriteButton').addEventListener('click', () => {
    const next = new Set(favoriteIds);
    if (next.has(currentDoc.id)) next.delete(currentDoc.id); else next.add(currentDoc.id);
    try {
      localStorage.setItem(storageKey, JSON.stringify([...next]));
      favoriteIds = next;
      updateFavorite();
      renderNavigation();
      toast(next.has(currentDoc.id) ? '已收藏到当前浏览器' : '已取消收藏');
    } catch { toast('浏览器未能保存收藏，请检查网站存储设置'); }
  });
  $('printDocument').addEventListener('click', () => window.print());
  $('downloadMarkdown').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentDoc.title}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $('shareButton').addEventListener('click', async () => {
    const opening = $('sharePanel').hidden;
    $('sharePanel').hidden = !opening;
    $('shareButton').setAttribute('aria-expanded', String(opening));
    if (!opening) return;
    const url = new URL(location.href);
    url.hash = currentDoc.id;
    $('shareUrl').value = url.href;
    $('shareHint').textContent = '选择链接后复制，分享当前文档。';
    try { await navigator.clipboard.writeText(url.href); $('shareHint').textContent = '链接已复制。'; }
    catch { $('shareUrl').focus(); $('shareUrl').select(); }
  });
  document.addEventListener('click', event => {
    if (!$('sharePanel').contains(event.target) && !$('shareButton').contains(event.target)) { $('sharePanel').hidden = true; $('shareButton').setAttribute('aria-expanded', 'false'); }
    const link = event.target.closest('a[href^="#"]');
    if (link && link.getAttribute('href') === location.hash) { event.preventDefault(); route(); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !$('sharePanel').hidden) { $('sharePanel').hidden = true; $('shareButton').setAttribute('aria-expanded', 'false'); $('shareButton').focus(); }
  });
  $('backTop').addEventListener('click', () => {
    if (!currentDoc) return;
    history.replaceState(null, '', `#${currentDoc.id}`);
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
  let scrollScheduled = false;
  window.addEventListener('scroll', () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      scrollScheduled = false;
      const tocHeadings = headings.filter(item => item.level === 'H2');
      const atBottom = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3;
      const current = atBottom ? tocHeadings.at(-1) : tocHeadings.filter(item => item.node.getBoundingClientRect().top <= 110).pop() || tocHeadings[0];
      if (current) updateToc(current.id);
    });
  }, { passive: true });
  window.addEventListener('hashchange', () => route());
  loadCatalog();
})();
