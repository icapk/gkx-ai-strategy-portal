(function () {
  'use strict';
  const SR = window.PortalSearchRecommend;
  const byId = id => document.getElementById(id);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const paths = {
    history:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
    favorites:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>',
    searches:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
    follows:'<path d="M6 17h12l-1.5-2.5V10a4.5 4.5 0 0 0-9 0v4.5ZM10 21h4M12 3V2"/>',
    reviews:'<path d="M4 4h16v12H9l-5 4Z"/><path d="M8 8h8M8 12h5"/>',
    notifications:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>'
  };
  const sections = {
    history:{title:'浏览历史',description:'按最近浏览时间查看曾打开的内容。',empty:'还没有浏览记录',hint:'在搜索结果或智能推荐中打开内容后，可在这里再次找到。'},
    favorites:{title:'收藏记录',description:'管理当前收藏，也可回看已记录的收藏历史。',empty:'还没有收藏内容',hint:'收藏感兴趣的论文、报告或课程，方便下次继续查看。'},
    searches:{title:'搜索历史',description:'回顾检索过的主题，继续此前的探索。',empty:'还没有搜索记录',hint:'从门户首页发起检索后，你的搜索词将显示在这里。'},
    follows:{title:'我的关注',description:'集中查看关注的词汇、领域、期刊与作者。',empty:'还没有关注对象',hint:'在智能推荐中关注词汇、领域、期刊或作者，持续发现相关内容。'},
    reviews:{title:'我的评价',description:'查看自己的评分、点赞和评论状态。',empty:'还没有评价记录',hint:'你对内容的评分、点赞和评论会汇集在这里。'},
    notifications:{title:'通知设置',description:'设置接收邮箱，管理每周文献推荐。'}
  };
  const icon = key => '<svg viewBox="0 0 24 24" aria-hidden="true">'+paths[key]+'</svg>';
  const kindNames = {KEYWORD:'词汇',DOMAIN:'领域',JOURNAL:'期刊',AUTHOR:'作者'};
  const typeNames = {PAPER:'论文',NEWS:'资讯',REPORT:'报告',COURSE:'课程',SCHOLAR:'人才',PATENT:'专利',CONFERENCE:'会议',ACTIVITY:'活动'};
  let current = sections[location.hash.slice(1)] ? location.hash.slice(1) : 'history';
  let query = '', type = '', favoritesMode = 'current', weekly = null, dirty = false, saving = false, renderedUser = undefined, toastTimer;
  const catalogue = new Map();
  function indexResources() {
    const F=window.PORTAL_REMEDIATION_FIXTURES||{};
    const list=[...(F.searchResources||[]),...Object.values(F.recommendationSeeds||{}).flat(),...(window.PortalPersonalCatalog||[])];
    for(const resource of list){if(!resource||typeof resource!=='object')continue;const id=resource.portalPaperId||resource.portalResourceId||resource.id;if(!id)continue;const old=catalogue.get(String(id))||{};catalogue.set(String(id),{...old,...resource,id:String(id),type:typeNames[resource.type]||resource.type||old.type||'资源'});if(resource.id)catalogue.set(String(resource.id),{...old,...resource,id:String(resource.id),type:typeNames[resource.type]||resource.type||old.type||'资源'})}
  }
  indexResources();
  function snapshot(){const s=SR.snapshot();return s.userId?s:{...s,events:[],follows:[],resourceStates:{},comments:[]}}
  function resource(id,evidence){const known=catalogue.get(String(id));if(known)return known;const event=evidence?.resourceTitle?evidence:[...(snapshot().events||[])].reverse().find(e=>e.resourceId===id&&e.resourceTitle);return {id:String(id||''),title:event?.resourceTitle||'资源 '+String(id||''),type:typeNames[event?.resourceType]||event?.resourceType||'资源',summary:event?.resourceSummary||'该资源的详情暂不可用，已保留原始记录。',tags:event?.domainTags||[]}}
  function dates(value){if(!value||!Number.isFinite(Date.parse(value)))return ['时间未记录',''];const d=new Date(value);return [d.toLocaleDateString('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).replaceAll('/','-'),d.toLocaleTimeString('zh-CN',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit'})]}
  function dateHTML(value,label){const [date,time]=dates(value);return escape(date)+'<span>'+escape(label||(time?time:''))+'</span>'}
  function toast(message){clearTimeout(toastTimer);byId('pcToast').textContent=message;byId('pcToast').hidden=false;toastTimer=setTimeout(()=>byId('pcToast').hidden=true,3600)}
  function ownEvents(s,eventType){return (s.events||[]).filter(e=>e.eventType===eventType&&(!e.userId||e.userId===s.userId)).sort((a,b)=>String(b.occurredAt||'').localeCompare(String(a.occurredAt||'')))}
  function counts(s){return {history:ownEvents(s,'VIEW').length,favorites:Object.values(s.resourceStates||{}).filter(x=>x.isFavorite).length,searches:ownEvents(s,'SEARCH').length,follows:(s.follows||[]).filter(x=>x.following).length,reviews:Object.values(s.resourceStates||{}).filter(x=>x.rating||x.isLiked).length+(s.comments||[]).filter(x=>x.authorUserId===s.userId&&x.status!=='WITHDRAWN').length}}
  function tagsHTML(tags,limit=4){return [...new Set((tags||[]).filter(x=>typeof x==='string'))].slice(0,limit).map(x=>'<span class="pc-tag">'+escape(x)+'</span>').join('')}
  function renderOverview(s){
    const stats=counts(s);byId('pcStats').innerHTML=[['history','浏览记录'],['favorites','我的收藏'],['follows','我的关注'],['searches','搜索记录']].map(([key,label])=>'<div class="pc-stat"><strong>'+stats[key]+'</strong><span>'+label+'</span></div>').join('');
    const demo=s.userId==='demo-user';byId('pcAccountName').textContent=!s.userId?'未登录':demo?'quan.song':s.userId;byId('pcAccountEmail').textContent=demo?'quan.song@aminer.cn':'';byId('pcAccountHint').textContent=s.userId?(s.personalDemoSeed?'个人账号 · 示例个人记录':'个人账号 · 原型展示'):'登录后可管理个人记录';
    byId('pcNavigation').innerHTML=Object.entries(sections).map(([key,section])=>'<a class="pc-nav-item'+(current===key?' is-active':'')+'" href="#'+key+'"'+(current===key?' aria-current="page"':'')+'>'+icon(key)+'<span>'+section.title+'</span>'+(key==='notifications'?'':'<small>'+stats[key]+'</small>')+'</a>').join('');
    const weights=s.userId?SR.profile().weights:{};const interests=Object.entries(weights||{}).filter(([,w])=>w>0).sort((a,b)=>b[1]-a[1]).slice(0,6);byId('pcInterestTags').innerHTML=interests.length?tagsHTML(interests.map(([label])=>label),6):'<span class="pc-no-interest">暂无兴趣记录</span>';
  }
  function rowsFor(s){
    if(current==='history')return ownEvents(s,'VIEW').map(e=>({id:e.resourceId,resource:resource(e.resourceId,e),time:e.occurredAt,tags:e.domainTags,mode:'view'}));
    if(current==='searches')return ownEvents(s,'SEARCH').map(e=>({id:e.eventId,resource:{title:e.query||'检索词未记录',type:'搜索'},query:e.query,time:e.occurredAt,tags:e.domainTags,mode:'search',searchMode:e.mode||e.searchMode}));
    if(current==='favorites'){
      const events=ownEvents(s,'FAVORITE');
      if(favoritesMode==='history')return events.map(e=>({id:e.resourceId,resource:resource(e.resourceId,e),time:e.occurredAt,tags:e.domainTags,mode:'favorite-history',favorite:!!s.resourceStates[e.resourceId]?.isFavorite}));
      return Object.entries(s.resourceStates||{}).filter(([,v])=>v.isFavorite).map(([id,v])=>({id,resource:resource(id),time:events.find(e=>e.resourceId===id)?.occurredAt,tags:v.domainTags,mode:'favorite',favorite:true})).sort((a,b)=>String(b.time||'').localeCompare(String(a.time||'')));
    }
    if(current==='follows')return (s.follows||[]).filter(f=>f.following).sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||''))).map(f=>({id:f.followId,resource:{title:f.kind==='AUTHOR'?(catalogue.get(String(f.targetId))?.name||catalogue.get(String(f.targetId))?.title||f.label||f.targetId):(f.label||f.targetId),type:kindNames[f.kind]||'关注'},time:f.updatedAt||f.createdAt,mode:'follow',follow:f}));
    if(current==='reviews')return [...Object.entries(s.resourceStates||{}).filter(([,v])=>v.rating||v.isLiked).map(([id,v])=>({id,resource:resource(id),mode:'rating',rating:v.rating,liked:v.isLiked})),...(s.comments||[]).filter(c=>c.authorUserId===s.userId&&c.status!=='WITHDRAWN').map(c=>({id:c.paperId,resource:resource(c.paperId),mode:'comment',time:c.updatedAt||c.createdAt,comment:c}))].sort((a,b)=>String(b.time||'').localeCompare(String(a.time||'')));
    return [];
  }
  function emptyHTML(filtered){const section=sections[current];return '<div class="pc-empty"><div class="pc-empty-icon">'+icon(current)+'</div><h3>'+escape(filtered?'没有找到匹配的记录':section.empty)+'</h3><p>'+escape(filtered?'尝试更换搜索词或筛选条件。':section.hint)+'</p>'+(!filtered?'<a href="'+(current==='searches'?'index.html?page=home':'recommendations.html')+'" target="_top">'+(current==='searches'?'前往搜索':'前往智能推荐')+' <span aria-hidden="true">↗</span></a>':'')+'</div>'}
  function rowHTML(row,index){
    const item=row.resource;let meta=item.source||item.venue||'';let action='<button type="button" data-detail="'+index+'">查看详情</button>';let content='';
    if(row.mode==='search'){meta=(row.searchMode?'检索方式：'+row.searchMode+' · ':'')+'搜索词';action=row.query?'<a href="index.html?query='+encodeURIComponent(row.query)+'" target="_top">再次搜索</a>':'';}
    if(row.mode==='follow'){const frequency={realtime:'实时',daily:'每日',weekly:'每周',page:'仅站内'};meta=row.follow.kind==='KEYWORD'?'更新频率：'+(frequency[row.follow.frequency]||'未设置'):'已关注'+(kindNames[row.follow.kind]||'');action='<button type="button" class="pc-mute-action" data-unfollow="'+index+'">取消关注</button>';}
    if(row.mode==='favorite'||row.mode==='favorite-history'){content='<div class="pc-tags"><span class="pc-status-tag'+(row.favorite?' approved':'')+'">'+(row.favorite?'当前已收藏':'当前未收藏')+'</span></div>';if(row.favorite)action+='<button type="button" class="pc-mute-action" data-unfavorite="'+index+'">取消收藏</button>';}
    if(row.mode==='rating'){content='<div class="pc-tags">'+(row.rating?'<span class="pc-rating" aria-label="评分'+row.rating+'分">'+'★'.repeat(row.rating)+'<span style="color:#dfe3e9">'+'★'.repeat(5-row.rating)+'</span></span>':'')+(row.liked?'<span class="pc-status-tag approved">已点赞</span>':'')+'</div>';}
    if(row.mode==='comment'){const statuses={PENDING:'待审核',APPROVED:'审核通过',RETURNED:'退回修改',REJECTED:'未通过',WITHDRAWN:'已撤回'};content='<p class="pc-record-comment">'+escape(row.comment.text)+'</p><div class="pc-tags"><span class="pc-status-tag '+escape(String(row.comment.status||'').toLowerCase())+'">'+escape(statuses[row.comment.status]||'状态未记录')+'</span></div>'+(row.comment.reason?'<p class="pc-record-meta">审核意见：'+escape(row.comment.reason)+'</p>':'');}
    return '<article class="pc-record"><div class="pc-record-main"><div class="pc-resource-heading"><span class="pc-resource-type">'+escape(item.type)+'</span>'+(row.mode==='search'||row.mode==='follow'?'<span class="pc-resource-title">'+escape(item.title)+'</span>':'<button class="pc-resource-title" type="button" data-detail="'+index+'">'+escape(item.title)+'</button>')+'</div>'+(meta?'<p class="pc-record-meta">'+escape(meta)+'</p>':'')+(row.tags?.length?'<div class="pc-tags">'+tagsHTML(row.tags)+'</div>':'')+content+'</div><div class="pc-record-time">'+(row.mode==='rating'?'':dateHTML(row.time))+'</div><div class="pc-record-actions">'+action+'</div></article>';
  }
  let visibleRows=[];
  function renderRecords(s){
    const section=sections[current];byId('pcPanelTitle').textContent=section.title;byId('pcPanelDescription').textContent=section.description;const isSettings=current==='notifications';byId('pcToolbar').hidden=isSettings;byId('pcRecords').hidden=isSettings;byId('pcNotificationForm').hidden=!isSettings;byId('pcPanelTotal').hidden=isSettings;if(isSettings)return;
    const allRows=rowsFor(s),types=[...new Set(allRows.map(r=>r.resource.type))].sort();if(type&&!types.includes(type))type='';byId('pcTypeFilter').innerHTML='<option value="">全部类型</option>'+types.map(t=>'<option value="'+escape(t)+'"'+(type===t?' selected':'')+'>'+escape(t)+'</option>').join('');byId('pcTypeFilter').hidden=current==='searches';byId('pcFavoritesMode').hidden=current!=='favorites';
    const needle=query.trim().toLocaleLowerCase('zh-CN');visibleRows=allRows.filter(row=>(!type||row.resource.type===type)&&(!needle||[row.resource.title,row.resource.source,row.comment?.text,...(row.tags||[])].filter(Boolean).join(' ').toLocaleLowerCase('zh-CN').includes(needle)));
    byId('pcPanelTotal').textContent='共 '+visibleRows.length+' 条';byId('pcRecords').innerHTML=visibleRows.length?'<div class="pc-table-head"><span>'+(current==='searches'?'检索内容':current==='follows'?'关注对象':'内容')+'</span><span>'+(current==='history'?'浏览时间':current==='favorites'?'收藏时间':current==='searches'?'搜索时间':current==='follows'?'更新时间':'评论时间')+'</span><span>操作</span></div>'+visibleRows.map(rowHTML).join(''):emptyHTML(!!needle||!!type);
  }
  function formStatus(message,error=false,warning=false){byId('pcFormStatus').textContent=message;byId('pcFormStatus').className=error?'is-error':warning?'is-warning':''}
  function updateEmailSummary(s){const w=s.weeklyEmail||{};byId('pcEmailSummary').textContent=w.email?(w.enabled?'当前已启用每周推荐，接收邮箱：':'每周推荐已关闭，已保存邮箱：')+w.email:'尚未设置通知邮箱，暂不接收每周推荐。'}
  function syncEmail(s){
    updateEmailSummary(s);
    if(renderedUser!==s.userId){dirty=false;weekly=null;byId('pcEmail').value='';byId('pcWeekly').checked=false;formStatus('');}
    if(!dirty&&!saving){weekly={...(s.weeklyEmail||{email:null,enabled:false,version:1})};byId('pcEmail').value=weekly.email||'';byId('pcWeekly').checked=!!weekly.enabled;}
    renderedUser=s.userId;byId('pcSaveEmail').disabled=saving||!s.userId;byId('pcEmail').disabled=saving||!s.userId;byId('pcWeekly').disabled=saving||!s.userId;
  }
  function repaint(){const s=snapshot();renderOverview(s);renderRecords(s);syncEmail(s)}
  function navigate(){const next=location.hash.slice(1);current=sections[next]?next:'history';query='';type='';byId('pcSearch').value='';repaint();}
  async function openDetail(row){
    const item=row.resource;byId('pcDetailType').textContent=item.type;byId('pcDetailTitle').textContent=item.title;byId('pcDetailMeta').textContent=[item.source||item.venue,item.author,item.publishedAt?dates(item.publishedAt)[0]:''].filter(Boolean).join(' · ');byId('pcDetailSummary').textContent=item.summary||item.abstract||item.detail||'该资源的详情暂不可用，已保留原始记录。';byId('pcDetailTags').innerHTML=tagsHTML(item.tags||item.domainTags||[]);
    const source=byId('pcSourceLink');let url=null;try{const candidate=new URL(item.detailUrl,location.href);if(item.detailUrl&&item.detailUrl!=='#'&&['https:','http:'].includes(candidate.protocol))url=candidate.href}catch(_){}source.hidden=!url;if(url)source.href=url;else source.removeAttribute('href');byId('pcResourceDialog').showModal();
    try{if(snapshot().userId)await SR.recordBehavior({eventType:'VIEW',resourceId:row.id,domainTags:item.domainTags||item.tags||[]});}catch(error){toast('详情已打开；浏览记录未保存：'+error.message)}
  }
  byId('pcRecords').addEventListener('click',async event=>{
    const button=event.target.closest('[data-detail],[data-unfavorite],[data-unfollow]');if(!button)return;const index=Number(button.dataset.detail??button.dataset.unfavorite??button.dataset.unfollow),row=visibleRows[index];if(!row)return;
    if(button.hasAttribute('data-detail')){await openDetail(row);return}
    button.disabled=true;
    try{if(button.hasAttribute('data-unfavorite')){await SR.setResourceState({resourceId:row.id,isFavorite:false});toast(SR.snapshot().persistent?'已取消收藏':'已在本次会话取消收藏，浏览器未允许永久保存')}else{const f=row.follow;await SR.setFollow({kind:f.kind,targetId:f.targetId,followId:f.followId,following:false,version:SR.followsVersion(),userContextVersion:SR.userContextVersion()});toast('已取消关注')}}catch(error){toast(error.message||'操作未保存，请稍后重试');button.disabled=false}
  });
  byId('pcSearch').addEventListener('input',event=>{query=event.target.value;renderRecords(snapshot())});
  byId('pcTypeFilter').addEventListener('change',event=>{type=event.target.value;renderRecords(snapshot())});
  byId('pcFavoritesMode').addEventListener('change',event=>{favoritesMode=event.target.value;query='';type='';byId('pcSearch').value='';renderRecords(snapshot())});
  for(const id of ['pcEmail','pcWeekly'])byId(id).addEventListener('input',()=>{dirty=true;byId('pcEmail').removeAttribute('aria-invalid');formStatus('有未保存的更改',false,true)});
  byId('pcNotificationForm').addEventListener('submit',async event=>{
    event.preventDefault();if(saving)return;const email=byId('pcEmail').value.trim(),enabled=byId('pcWeekly').checked;
    if((email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))||(enabled&&!email)){byId('pcEmail').setAttribute('aria-invalid','true');formStatus(enabled&&!email?'请填写通知邮箱后开启每周推荐。':'请输入有效的邮箱地址。',true);byId('pcEmail').focus();return}
    const userContext=SR.userContextVersion();saving=true;byId('pcSaveEmail').disabled=true;byId('pcSaveEmail').textContent='保存中…';syncEmail(snapshot());formStatus('');
    try{
      if(!weekly)weekly=await SR.getWeeklyEmail();
      if(userContext!==SR.userContextVersion())throw new Error('账号已变化，请重新打开通知设置。');
      weekly=await SR.saveWeeklyEmail({email:email||null,enabled,version:weekly.version});dirty=false;byId('pcEmail').removeAttribute('aria-invalid');formStatus(SR.snapshot().persistent?'设置已保存。':'已在本次会话保存，浏览器未允许永久保存。',false,!SR.snapshot().persistent);
    }catch(error){formStatus('保存失败：'+(error.message||'请稍后重试。'),true);if(error.code==='STALE_VERSION'){weekly={...snapshot().weeklyEmail};formStatus('邮箱配置已在其他页面更新，请核对当前输入后再次保存。',true)}}
    finally{saving=false;byId('pcSaveEmail').textContent='保存设置';repaint()}
  });
  for(const id of ['pcCloseDetail','pcDialogDone'])byId(id).addEventListener('click',()=>byId('pcResourceDialog').close());
  byId('pcResourceDialog').addEventListener('click',event=>{if(event.target===event.currentTarget){const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.currentTarget.close()}});
  window.addEventListener('hashchange',navigate);SR.subscribe(repaint);repaint();
  SR.getWeeklyEmail().then(value=>{if(!dirty){weekly=value;syncEmail(snapshot())}}).catch(error=>formStatus('通知设置加载失败：'+error.message,true));
})();
