(() => {
  'use strict';
  const service = window.PortalSearchRecommend;
  if (!service) return;
  const trigger = document.getElementById('personalRecTrigger');
  const menu = document.getElementById('personalRecMenu');
  const logout = document.getElementById('personalRecLogout');
  const paint = () => {
    const signedIn = !!service.snapshot().userId;
    document.querySelectorAll('[data-personal-trigger-label]').forEach(n => n.textContent = signedIn ? 'quan…' : '访客');
    document.querySelectorAll('[data-personal-account-name]').forEach(n => n.textContent = signedIn ? 'quan.song@aminer.cn' : '个人中心');
    document.querySelectorAll('[data-personal-account-email]').forEach(n => n.textContent = signedIn ? 'quan.song@aminer.cn' : '登录后查看个人记录');
    document.querySelectorAll('.personal-logout').forEach(n => n.textContent = signedIn ? '退出登录' : '登录演示账号');
  };
  const close = (focus = false) => { if (!menu) return; menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); if (focus) trigger.focus(); };
  trigger?.addEventListener('click', () => { const open = menu.hidden; menu.hidden = !open; trigger.setAttribute('aria-expanded', String(open)); });
  trigger?.addEventListener('keydown', e => { if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return; e.preventDefault(); menu.hidden = false; trigger.setAttribute('aria-expanded', 'true'); const items = [...menu.querySelectorAll('[role=menuitem]')]; items[e.key === 'ArrowUp' ? items.length - 1 : 0].focus(); });
  menu?.addEventListener('keydown', e => { if (e.key === 'Escape') {close(true); return;} if (!['ArrowUp','ArrowDown','Home','End'].includes(e.key)) return; e.preventDefault(); const items = [...menu.querySelectorAll('[role=menuitem]')], at = items.indexOf(document.activeElement); items[e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (at + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); });
  menu?.addEventListener('focusout', () => setTimeout(() => { if (!menu.contains(document.activeElement) && document.activeElement !== trigger) close(); }, 0));
  document.addEventListener('click', e => { if (menu && !e.target.closest('.personal-rec-entry')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu && !menu.hidden) close(true); });
  logout?.addEventListener('click', async () => { try { await service.setDemoIdentity({userId:service.snapshot().userId ? null : 'demo-user',audience:'research'}); close(true); } catch(error) { window.alert(error.message || '账号状态未更新，请重试'); } });
  service.subscribe(paint);
  document.addEventListener('click', event => {
    const control = event.target.closest('[data-result-detail-link],[data-entity-detail],[data-keyword-detail],[data-report-hit]');
    const item = control?.closest('.portal-search-card')?.__personalResource;
    if (!item || !service.snapshot().userId) return;
    if ((control.hasAttribute('data-entity-detail') || control.hasAttribute('data-keyword-detail')) && control.getAttribute('aria-expanded') !== 'true') return;
    const resourceId = item.portalResourceId || item.portalPaperId || item.id;
    if (!resourceId) return;
    service.recordBehavior({eventType:'VIEW',resourceId,resourceTitle:item.title || item.name,resourceType:item.type,resourceSummary:item.summary || item.abstract || '',domainTags:item.domainTags || item.tags || []}).catch(() => {});
  });
  paint();
})();
