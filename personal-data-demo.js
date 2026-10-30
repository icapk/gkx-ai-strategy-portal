/* One-time personal mock records drawn from the existing search/recommendation resources. */
(function (global) {
  'use strict';
  const service = global.PortalSearchRecommend;
  const fixture = global.PORTAL_REMEDIATION_FIXTURES;
  const marker = 'personal-center-demo-20261030-v1';
  if (!service || !fixture) return;
  const seeds = fixture.recommendationSeeds || {};
  const catalogue = global.PortalPersonalCatalog || [];
  const resourceId = item => item && (item.portalResourceId || item.portalPaperId || item.id);
  const tags = item => [...new Set([...(item?.domainTags || []), ...(item?.tags || []), ...(item?.topics || []), ...(item?.field ? [item.field] : [])])];
  const meta = (item, type) => item && ({ resourceId: resourceId(item), resourceTitle: item.title || item.name, resourceType: type || item.type, resourceSummary: item.summary || item.abstract || '', domainTags: tags(item) });
  const papers = seeds.PAPER_ITEMS || [];
  const reports = seeds.REPORT_ITEMS || [];
  const courses = seeds.COURSE_ITEMS || [];
  const authors = seeds.AUTHORS || [];
  const conferences = seeds.CONFERENCE_ITEMS || [];
  const news = catalogue.find(item => item.type === '资讯') || (fixture.searchResources || []).find(item => item.type === '资讯');
  const reference = '2026-10-30T10:30:00+08:00';
  const at = (day, time) => '2026-10-' + String(day).padStart(2, '0') + 'T' + time + ':00+08:00';
  const event = (id, eventType, occurredAt, content) => ({ eventId: marker + ':' + id, userId: 'demo-user', eventType, occurredAt, isDemo: true, ...content });
  const viewResources = [[news, '资讯'], [papers[0], '论文'], [reports[0], '报告'], [courses[0], '课程'], [papers[1], '论文'], [reports[1], '报告'], [courses[1], '课程'], [conferences[0], '会议']].filter(([item]) => resourceId(item));
  const favoriteResources = [[papers[0], '论文'], [papers[1], '论文'], [reports[0], '报告'], [courses[0], '课程'], [reports[1], '报告']].filter(([item]) => resourceId(item));
  const events = [
    ...['人工智能', '科学智能体', '量子信息', '固态电池'].map((query, index) => event('search-' + index, 'SEARCH', at(24 + index, '09:20'), { queryId: marker + ':query-' + index, query, mode: '关键词', domainTags: [] })),
    ...viewResources.map(([item, type], index) => event('view-' + index, 'VIEW', at(25 + Math.floor(index / 2), (index % 2 ? '15:10' : '10:25')), meta(item, type))),
    ...favoriteResources.map(([item, type], index) => event('favorite-' + index, 'FAVORITE', at(25 + index, '16:40'), meta(item, type)))
  ];
  const states = {};
  favoriteResources.forEach(([item], index) => { states[resourceId(item)] = { resourceId: resourceId(item), isFavorite: index < 4, domainTags: tags(item), isDemo: true }; });
  if (papers[0]) states[resourceId(papers[0])] = { ...states[resourceId(papers[0])], resourceId: resourceId(papers[0]), rating: 5, domainTags: tags(papers[0]), isDemo: true };
  if (papers[1]) states[resourceId(papers[1])] = { ...states[resourceId(papers[1])], resourceId: resourceId(papers[1]), rating: 4, domainTags: tags(papers[1]), isDemo: true };
  if (reports[0]) states[resourceId(reports[0])] = { ...states[resourceId(reports[0])], resourceId: resourceId(reports[0]), isLiked: true, domainTags: tags(reports[0]), isDemo: true };
  const domain = (fixture.availableTargets || []).find(item => item.kind === 'DOMAIN' && item.targetId === '人工智能');
  const quantum = (fixture.availableTargets || []).find(item => item.kind === 'DOMAIN' && item.targetId === '量子信息');
  const journal = (fixture.availableTargets || []).find(item => item.kind === 'JOURNAL' && item.targetId === papers[0]?.venue);
  const follow = (kind, targetId, label, index, frequency = null) => ({ followId: marker + ':follow-' + index, kind, targetId, label: label || targetId, following: true, everFollowed: true, dismissed: false, sourceQueryId: kind === 'KEYWORD' ? marker + ':query-' + index : null, normalizedKey: kind === 'KEYWORD' ? service.normalizeKeyword(targetId) : null, createdAt: at(24 + index, '09:30'), updatedAt: at(24 + index, '09:30'), version: '1', frequency, readUpdateIds: [], isDemo: true });
  const follows = [follow('KEYWORD', '人工智能', '人工智能', 0, 'daily'), follow('KEYWORD', '科学智能体', '科学智能体', 1, 'weekly')];
  if (domain) follows.push(follow('DOMAIN', domain.targetId, domain.label, 2));
  if (quantum) follows.push(follow('DOMAIN', quantum.targetId, quantum.label, 3));
  if (journal) follows.push(follow('JOURNAL', journal.targetId, journal.label, 4));
  if (authors[0]) follows.push(follow('AUTHOR', authors[0].id, authors[0].name, 5));
  const comments = [
    papers[0] && { commentId: marker + ':comment-approved', paperId: resourceId(papers[0]), authorUserId: 'demo-user', authorDisplayName: 'quan.song（示例）', text: '示例评论：证据定位与人工复核流程清晰，适合进一步对照科研工作流。', status: 'APPROVED', reason: '', createdAt: at(28, '14:15'), updatedAt: at(28, '15:20'), version: 1, clientMutationId: marker + ':comment-mutation-1', isDemo: true },
    papers[1] && { commentId: marker + ':comment-pending', paperId: resourceId(papers[1]), authorUserId: 'demo-user', authorDisplayName: 'quan.song（示例）', text: '示例评论：希望进一步了解跨节点验证中的同步与纠错开销。', status: 'PENDING', reason: '', createdAt: at(30, '09:45'), updatedAt: at(30, '09:45'), version: 1, clientMutationId: marker + ':comment-mutation-2', isDemo: true }
  ].filter(Boolean);
  const payload = { marker, userId: 'demo-user', events, follows, resourceStates: states, comments, notificationEmail: { email: 'researcher@example.com' }, createdAt: reference };
  let pending = false;
  function seed() {
    const state = service.snapshot();
    if (pending || state.userId !== 'demo-user' || typeof service.seedPersonalDemoOnce !== 'function' || state.personalDemoSeed === marker || state.personalDemoSeed?.marker === marker) return;
    pending = true;
    try {
      const result = service.seedPersonalDemoOnce(payload);
      Promise.resolve(result).catch(error => console.warn('个人示例记录未保存：', error.message)).finally(() => { pending = false; });
    } catch (error) { pending = false; console.warn('个人示例记录未保存：', error.message); }
  }
  service.subscribe(seed);
  seed();
})(window);
