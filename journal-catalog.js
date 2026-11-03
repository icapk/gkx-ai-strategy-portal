/* Journal directory boundary: demo data until the portal backend connects Deepmodeling. */
(function (global) {
  'use strict';
  const PAGE_SIZE = 10, TIMEOUT_MS = 12000, targets = new Map();
  const normalize = value => String(value || '').normalize('NFKC').toLocaleLowerCase('zh-CN').trim().replace(/\s+/g, ' ');
  const copy = value => JSON.parse(JSON.stringify(value));
  const fail = (code, message) => Object.assign(new Error(message), { code });
  const demoNames = [
    'Applied Materials Discovery', 'Molecular Design Perspectives',
    'Scientific Data Horizons', 'Energy Storage Frontiers',
    'Intelligent Robotics Research', 'Biomedical Systems Review',
    'Sustainable Chemistry Studies', 'Semiconductor Engineering Letters',
    'Marine Science Perspectives', 'Advanced Manufacturing Reports',
    'Computational Biology Notes', 'Optical Systems Research',
    'Digital Agriculture Methods', 'Environmental Monitoring Letters',
    'Neural Computing Perspectives', 'Space Technology Studies'
  ];
  function demoTargets() {
    const legacy = (global.PORTAL_REMEDIATION_FIXTURES?.availableTargets || [])
      .filter(target => target.kind === 'JOURNAL')
      .map(target => ({ ...target, provider: 'LOCAL_MOCK' }));
    return [...legacy, ...demoNames.map((name, index) => ({
      kind: 'JOURNAL', targetId: 'demo-journal-' + (index + 9),
      label: name + '（原型）', provider: 'LOCAL_MOCK'
    }))];
  }
  function remember(items) {
    items.forEach(item => targets.set(item.targetId, copy(item)));
    return items;
  }
  function gatewayUrl(endpoint) {
    let url;
    try { url = new URL(endpoint, global.location.href); }
    catch (_) { throw fail('INVALID_JOURNAL_ENDPOINT', '期刊目录服务地址无效'); }
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== global.location.origin || url.username || url.password || url.hash) {
      throw fail('INVALID_JOURNAL_ENDPOINT', '期刊目录须通过门户同源服务接入');
    }
    return url;
  }
  function validateReply(data, page) {
    if (!data || !Array.isArray(data.items) || !Number.isSafeInteger(data.total) || data.total < 0 ||
      data.page !== page || data.pageSize !== PAGE_SIZE ||
      data.items.length !== Math.min(PAGE_SIZE, Math.max(0, data.total - (page - 1) * PAGE_SIZE))) {
      throw fail('INVALID_JOURNAL_RESPONSE', '期刊目录返回格式无效，请稍后重试');
    }
    const ids = new Set();
    return data.items.map(item => {
      if (!item || typeof item.id !== 'string' || !item.id.trim() || item.id !== item.id.trim() || ids.has(item.id) ||
        typeof item.name !== 'string' || !item.name.trim() ||
        (item.issn != null && typeof item.issn !== 'string') ||
        (item.domains != null && (!Array.isArray(item.domains) || item.domains.some(value => typeof value !== 'string')))) {
        throw fail('INVALID_JOURNAL_RESPONSE', '期刊目录返回格式无效，请稍后重试');
      }
      ids.add(item.id);
      return { kind: 'JOURNAL', targetId: item.id, journalId: item.id, label: item.name.trim(),
        ...(item.issn ? { issn: item.issn } : {}),
        ...(item.domains ? { domains: [...item.domains] } : {}), provider: 'DEEPMODELING' };
    });
  }
  async function search({ query = '', page = 1, pageSize = PAGE_SIZE, signal } = {}) {
    if (!Number.isSafeInteger(page) || page < 1 || pageSize !== PAGE_SIZE) {
      throw fail('INVALID_JOURNAL_PAGE', '期刊目录每页显示10条，请使用有效页码');
    }
    if (signal?.aborted) throw new DOMException('请求已取消', 'AbortError');
    const endpoint = global.PORTAL_JOURNAL_CATALOG_CONFIG?.endpoint;
    if (!endpoint) {
      const keyword = normalize(query);
      const all = demoTargets().filter(item => !keyword || normalize(item.label + ' ' + (item.issn || '')).includes(keyword));
      return { items: remember(all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)), total: all.length,
        page, pageSize: PAGE_SIZE, provider: 'LOCAL_MOCK', executionKind: 'LOCAL_MOCK' };
    }
    const url = gatewayUrl(endpoint), controller = new AbortController();
    url.searchParams.set('q', String(query).trim());
    url.searchParams.set('page', String(page));
    url.searchParams.set('pageSize', String(PAGE_SIZE));
    const abort = () => controller.abort(), timer = setTimeout(abort, TIMEOUT_MS);
    signal?.addEventListener('abort', abort, { once: true });
    try {
      const response = await global.fetch(url.href, { method: 'GET', credentials: 'same-origin',
        headers: { Accept: 'application/json' }, signal: controller.signal });
      if (!response.ok) throw fail('JOURNAL_REQUEST_FAILED', '期刊目录加载失败，请稍后重试');
      const data = await response.json(), items = validateReply(data, page);
      return { items: remember(items), total: data.total, page, pageSize: PAGE_SIZE,
        provider: 'DEEPMODELING', executionKind: 'REMOTE_API' };
    } catch (error) {
      if (signal?.aborted) throw new DOMException('请求已取消', 'AbortError');
      if (controller.signal.aborted) throw fail('JOURNAL_REQUEST_TIMEOUT', '期刊目录加载超时，请重试');
      if (error.code && typeof error.code === 'string') throw error;
      throw fail('JOURNAL_REQUEST_FAILED', '期刊目录加载失败，请稍后重试');
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
    }
  }
  global.PORTAL_JOURNAL_CATALOG = {
    search,
    getTarget(id) { const target = targets.get(id); return target ? copy(target) : null; }
  };
})(window);
