(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const version = '20260909-doc-cleanup';
  const legacyIds = ['start', 'overview', 'quickstart', 'navigation', 'search', 'services', 'messages', 'account', 'faq'];
  const markdownCache = new Map();
  let docs = [], currentDoc, currentMarkdown = '', headings = [];
  let searchTerm = '';
  let requestId = 0, controller;

  function setBusy(busy) {
    $('article').setAttribute('aria-busy', String(busy));
  }

  function showStatus(message, retry = false) {
    $('documentStatus').hidden = false;
    $('documentStatus').innerHTML = `${escape(message)}${retry ? '<button id="retryDocument" type="button">重新加载</button>' : ''}`;
    $('retryDocument')?.addEventListener('click', () => docs.length ? route(true) : loadCatalog());
  }

  function renderNavigation() {
    const visible = docs.filter(doc => doc.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()));
    $('docNavigation').innerHTML = visible.map(doc => `<a class="nav-link ${doc.id === currentDoc?.id ? 'active' : ''}" href="#${doc.id}" ${doc.id === currentDoc?.id ? 'aria-current="page"' : ''}>${escape(doc.title)}</a>`).join('') || `<div class="empty-state"><p>没有找到匹配的系统</p><button type="button" id="resetNavigation">查看全部系统</button></div>`;
    $('resetNavigation')?.addEventListener('click', resetNavigation);
    $('searchStatus').hidden = !searchTerm;
    $('searchStatus').textContent = `搜索结果 · ${visible.length} 个系统`;
    $('clearSearch').hidden = !searchTerm;
  }

  function resetNavigation() {
    searchTerm = '';
    $('directorySearch').value = '';
    renderNavigation();
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
      return { id, node };
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

  }

  function scrollToSection(sectionId) {
    requestAnimationFrame(() => {
      const heading = headings.find(item => item.id === sectionId);
      if (heading) {
        heading.node.scrollIntoView();
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
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
    $('documentTitle').textContent = doc.title;
    $('documentUpdated').textContent = `最近更新时间：${doc.updated}`;
    document.title = `${doc.title} - 文档中心 · 智慧服务门户`;
    const index = docs.indexOf(doc), prev = docs[index - 1], next = docs[index + 1];
    $('nextDocs').innerHTML = `${prev ? `<a href="#${prev.id}"><span>上一篇</span>← ${escape(prev.title)}</a>` : ''}${next ? `<a href="#${next.id}"><span>下一篇</span>${escape(next.title)} →</a>` : ''}`;
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
      await route();
    } catch {
      setBusy(false);
      showStatus('系统目录暂时无法加载，请重试。', true);
    }
  }

  $('directorySearch').addEventListener('input', event => { searchTerm = event.target.value.trim(); renderNavigation(); });
  $('clearSearch').addEventListener('click', () => { searchTerm = ''; $('directorySearch').value = ''; renderNavigation(); $('directorySearch').focus(); });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link && link.getAttribute('href') === location.hash) { event.preventDefault(); route(); }
  });
  window.addEventListener('hashchange', () => route());
  loadCatalog();
})();
