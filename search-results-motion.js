/* Shared-element movement and interruptible result updates for the portal search surface. */
(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
  let surfaceAnimations = [];
  let surfaceCleanups = [];
  let surfaceGeneration = 0;
  let contentAnimations = [];
  let pendingContent = null;
  let drawerAnimation = null;
  let drawerElement = null;
  let announcementAnimation = null;
  let announcementCleanup = null;
  let workspaceAnimation = null;
  let workspaceCleanup = null;
  let recommendationGeneration = 0;
  let recommendationAnimations = [];
  let recommendationCommit = null;
  let recommendationCleanup = null;

  function stopRecommendations(commitPending = true) {
    recommendationGeneration += 1;
    recommendationAnimations.forEach(animation => animation.cancel());
    recommendationAnimations = [];
    recommendationCleanup?.();
    recommendationCleanup = null;
    const commit = recommendationCommit;
    recommendationCommit = null;
    if (commitPending) commit?.();
  }

  function changeRecommendations(node, commit, options = {}) {
    const from = getComputedStyle(node);
    const opacity = from.opacity;
    const transform = from.transform;
    const height = node.getBoundingClientRect().height;
    stopRecommendations(false);
    if (options.animate === false || reduced.matches || !visible(node)) { commit(); return; }
    const generation = recommendationGeneration;
    const original = { height: node.style.height, overflow: node.style.overflow, willChange: node.style.willChange, pointerEvents: node.style.pointerEvents, inert: node.inert, busy: node.getAttribute('aria-busy') };
    recommendationCleanup = () => {
      Object.assign(node.style, { height: original.height, overflow: original.overflow, willChange: original.willChange, pointerEvents: original.pointerEvents });
      node.inert = original.inert;
      if (original.busy === null) node.removeAttribute('aria-busy'); else node.setAttribute('aria-busy', original.busy);
    };
    recommendationCommit = commit;
    Object.assign(node.style, { height: `${height}px`, overflow: 'hidden', willChange: 'opacity,transform,height', pointerEvents: 'none' });
    node.inert = true; node.setAttribute('aria-busy', 'true');
    const exit = node.animate([{ opacity, transform }, { opacity: 0, transform: 'translateY(-4px)' }], { duration: 100, easing: ease, fill: 'both' });
    recommendationAnimations = [exit];
    exit.finished.then(() => {
      if (generation !== recommendationGeneration) return;
      commit(); recommendationCommit = null;
      node.style.height = original.height;
      const nextHeight = node.getBoundingClientRect().height;
      node.style.height = `${height}px`;
      const enter = node.animate([
        { opacity: 0, transform: 'translateY(8px)', height: `${height}px` },
        { opacity: 1, transform: 'none', height: `${nextHeight}px` }
      ], { duration: 240, easing: ease, fill: 'both' });
      // Replace the exit effect only after the incoming effect is installed.
      recommendationAnimations = [enter]; exit.cancel();
      enter.finished.then(() => { if (generation === recommendationGeneration) stopRecommendations(); }).catch(() => {});
    }).catch(() => {});
  }

  const visible = (node) => Boolean(node && node.getClientRects().length);
  const rect = (node) => {
    const bounds = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    const fontSize = parseFloat(style.fontSize) || 14;
    let textBounds = bounds;
    if (node.matches('h1,p')) {
      const range = document.createRange();
      range.selectNodeContents(node);
      const measured = range.getBoundingClientRect();
      if (measured.width) textBounds = measured;
    }
    return { left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height, baseTransform: style.transform === 'none' ? '' : style.transform, backgroundColor: style.backgroundColor, borderRadius: style.borderRadius, borderColor: style.borderColor, fontSize, lineHeight: parseFloat(style.lineHeight) || fontSize * 1.5, fontWeight: style.fontWeight, letterSpacing: style.letterSpacing,
      text: { left: textBounds.left, top: textBounds.top, width: textBounds.width, height: textBounds.height } };
  };
  function stopContent() {
    contentAnimations.forEach((animation) => animation.cancel());
    contentAnimations = [];
  }
  function stopSurface() {
    stopRecommendations();
    surfaceGeneration += 1;
    workspaceAnimation?.cancel();
    workspaceAnimation = null;
    workspaceCleanup?.();
    workspaceCleanup = null;
    drawerAnimation?.cancel();
    drawerAnimation = null;
    drawerElement?.classList.remove("is-closing");
    surfaceAnimations.forEach((animation) => animation.cancel());
    surfaceAnimations = [];
    surfaceCleanups.splice(0).reverse().forEach((cleanup) => cleanup());
    document.body.classList.remove("portal-surface-transition");
  }
  function targets(name) {
    return name === "home"
      ? [document.querySelector(".mg-hero-heading h1"), document.querySelector(".mg-hero-heading > p"), document.getElementById("mgHeroSearchForm")]
      : [document.getElementById("searchResultsTitle"), document.querySelector(".portal-search-lead"), document.querySelector(".portal-result-query")];
  }
  function animateSurface(node, frames, options) {
    const animation = node.animate(frames, options);
    surfaceAnimations.push(animation);
    return animation;
  }
  function prepareWorkspace(targets, generation) {
    const nodes = (Array.isArray(targets) ? targets : [targets]).filter(visible);
    if (!nodes.length) return null;
    const originals = nodes.map(node => ({ node, opacity: node.style.opacity, transform: node.style.transform, baseTransform: rect(node).baseTransform,
      pointerEvents: node.style.pointerEvents, inert: node.inert, hidden: node.getAttribute('aria-hidden'), phase: node.getAttribute('data-results-phase') }));
    const cleanup = () => originals.forEach(original => {
      const node = original.node;
      Object.assign(node.style, { opacity: original.opacity, transform: original.transform, pointerEvents: original.pointerEvents });
      node.inert = original.inert;
      if (original.hidden === null) node.removeAttribute('aria-hidden'); else node.setAttribute('aria-hidden', original.hidden);
      if (original.phase === null) node.removeAttribute('data-results-phase'); else node.setAttribute('data-results-phase', original.phase);
    });
    originals.forEach(({ node, baseTransform }) => {
      Object.assign(node.style, { opacity: '0', transform: `${baseTransform} translateY(8px)`, pointerEvents: 'none' });
      node.inert = true; node.setAttribute('aria-hidden', 'true'); node.dataset.resultsPhase = 'waiting';
    });
    workspaceCleanup = cleanup;
    return () => {
      if (generation !== surfaceGeneration || !nodes.every(visible)) return;
      document.dispatchEvent(new Event('portal-search-workspace-reveal'));
      const animations = originals.map(({ node, baseTransform }) => {
        node.dataset.resultsPhase = 'revealing';
        return node.animate([{ opacity: 0, transform: `${baseTransform} translateY(8px)` }, { opacity: 1, transform: baseTransform || 'none' }], { delay: 140, duration: 260, easing: ease, fill: 'both' });
      });
      const group = { cancel: () => animations.forEach(animation => animation.cancel()) };
      workspaceAnimation = group;
      revealResultCards();
      Promise.all(animations.map(animation => animation.finished.catch(() => {}))).then(() => {
        if (workspaceAnimation !== group) return;
        group.cancel(); cleanup(); workspaceAnimation = null; workspaceCleanup = null; layoutChanged();
      });
    };
  }
  function revealSearchHeading(node, exitAnimations, generation) {
    // Keep labels at their final font size; the composer carries continuity.
    const enter = animateSurface(node, [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'none' }
    ], { duration: 240, easing: ease, fill: 'both' });
    enter.pause();
    enter.currentTime = 0;
    Promise.all(exitAnimations.map(animation => animation.finished.catch(() => {}))).then(() => {
      if (generation === surfaceGeneration) enter.play();
    });
  }
  function announcementState(node, open, options = {}) {
    if (!node) return;
    const wasVisible = visible(node);
    const opacity = wasVisible ? getComputedStyle(node).opacity : '0';
    if (node.dataset.announcementOpen === String(open) && announcementAnimation && options.animate !== false && !reduced.matches) return;
    announcementAnimation?.cancel();
    announcementAnimation = null;
    announcementCleanup?.();
    announcementCleanup = null;
    node.dataset.announcementOpen = String(open);
    const animate = options.animate !== false && !reduced.matches && document.readyState !== 'loading';
    if (!animate || (!open && !wasVisible) || (open && wasVisible && opacity === '1')) {
      node.hidden = !open;
      return;
    }
    const originalStyle = node.getAttribute('style');
    const originalHidden = node.getAttribute('aria-hidden');
    const originalInert = node.inert;
    node.hidden = false;
    const cleanup = () => {
      if (originalStyle === null) node.removeAttribute('style');
      else node.setAttribute('style', originalStyle);
      if (originalHidden === null) node.removeAttribute('aria-hidden');
      else node.setAttribute('aria-hidden', originalHidden);
      node.inert = originalInert;
      delete node.dataset.announcementLeaving;
    };
    announcementCleanup = cleanup;
    if (!open) {
      const bounds = node.getBoundingClientRect();
      // Leave normal flow immediately so shared elements measure their final
      // geometry; the original announcement then fades in its existing place.
      Object.assign(node.style, {
        position: 'fixed', left: `${bounds.left}px`, top: `${bounds.top}px`,
        width: `${bounds.width}px`, height: `${bounds.height}px`,
        margin: '0', pointerEvents: 'none'
      });
      node.dataset.announcementLeaving = 'true';
      node.setAttribute('aria-hidden', 'true');
      node.inert = true;
    }
    const animation = node.animate([{ opacity: wasVisible ? opacity : 0 }, { opacity: open ? 1 : 0 }], {
      duration: open ? 440 : 360, easing: 'cubic-bezier(0.42,0,0.58,1)', fill: 'both'
    });
    announcementAnimation = animation;
    animation.finished.then(() => {
      if (announcementAnimation !== animation) return;
      node.hidden = !open;
      animation.cancel();
      cleanup();
      announcementAnimation = null;
      announcementCleanup = null;
    }).catch(() => {});
  }
  function fadeHomeText(node, duration = 320, captured = null) {
    if (!visible(node)) return;
    const bounds = captured?.bounds || node.getBoundingClientRect();
    const style = captured?.style || getComputedStyle(node);
    const parent = node.parentNode, next = node.nextSibling;
    const original = node.getAttribute('style'), hidden = node.getAttribute('aria-hidden');
    let restored = false;
    const restore = () => {
      if (restored) return; restored = true;
      parent.insertBefore(node, next);
      if (original === null) node.removeAttribute('style'); else node.setAttribute('style', original);
      if (hidden === null) node.removeAttribute('aria-hidden'); else node.setAttribute('aria-hidden', hidden);
    };
    Object.assign(node.style, { position: 'fixed', left: `${bounds.left}px`, top: `${bounds.top}px`,
      width: `${bounds.width}px`, height: `${bounds.height}px`, margin: '0', transform: 'none', zIndex: '100', pointerEvents: 'none',
      fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight, lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing, color: style.color, textAlign: style.textAlign });
    node.setAttribute('aria-hidden', 'true'); document.body.append(node); surfaceCleanups.push(restore);
    const animation = animateSurface(node, [{ opacity: style.opacity }, { opacity: 0 }], { duration, easing: ease, fill: 'forwards' });
    animation.finished.then(restore).catch(() => {});
    return animation;
  }
  function fadeReturnIconOut(node, opacity) {
    if (!visible(node)) return;
    const bounds = node.getBoundingClientRect();
    const parent = node.parentNode;
    const next = node.nextSibling;
    const originalStyle = node.getAttribute('style');
    const originalHidden = node.getAttribute('aria-hidden');
    const originalInert = node.inert;
    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      parent.insertBefore(node, next);
      if (originalStyle === null) node.removeAttribute('style');
      else node.setAttribute('style', originalStyle);
      if (originalHidden === null) node.removeAttribute('aria-hidden');
      else node.setAttribute('aria-hidden', originalHidden);
      node.inert = originalInert;
    };
    // Keep the actual icon visible while its search-page parent becomes hidden.
    // No copied icon, text or controls are introduced during the return motion.
    Object.assign(node.style, {
      position: 'fixed', left: `${bounds.left}px`, top: `${bounds.top}px`,
      width: `${bounds.width}px`, height: `${bounds.height}px`,
      margin: '0', zIndex: '100', pointerEvents: 'none'
    });
    node.setAttribute('aria-hidden', 'true');
    node.inert = true;
    document.body.append(node);
    surfaceCleanups.push(restore);
    const animation = animateSurface(node, [{ opacity }, { opacity: 0 }], {
      duration: 280, easing: 'cubic-bezier(0.42,0,0.58,1)', fill: 'forwards'
    });
    animation.finished.then(restore).catch(() => {});
  }
  function switchSurface(name, options, apply) {
    const home = document.getElementById('homeContent');
    const search = document.getElementById('searchResultsPage');
    const previous = !home.hidden ? 'home' : !search.hidden ? 'search' : 'other';
    const pair = (previous === 'home' && name === 'search') || (previous === 'search' && name === 'home');
    if (previous === name) {
      const moving = surfaceAnimations.some(animation=>animation.playState==='running');
      // A new query can update the waiting results without cutting the header
      // animation short and exposing the lower area before it is ready.
      if (moving && !workspaceCleanup) stopSurface();
      apply(name, moving && workspaceCleanup ? {...options,deferTransitionFocus:true} : options);
      if (name === 'search') requestAnimationFrame(() => document.dispatchEvent(new Event('portal-search-workspace-reveal')));
      return;
    }
    const returnIcon = document.getElementById('portalSearchReturn');
    const returnOpacity = visible(returnIcon) ? getComputedStyle(returnIcon).opacity : '1';
    stopSurface();stopContent();pendingContent=null;
    document.dispatchEvent(new Event('portal-search-transition-start'));
    const before=targets(previous).map(node=>visible(node)?rect(node):null);
    if(!pair||reduced.matches||document.readyState==='loading'||!before[2]){
      apply(name,options);
      if (name === 'search') requestAnimationFrame(() => document.dispatchEvent(new Event('portal-search-workspace-reveal')));
      return;
    }
    const generation=surfaceGeneration;
    const initialFocus=document.activeElement;
    if (name === 'home') {
      fadeReturnIconOut(returnIcon, returnOpacity);
      apply(name,{...options,deferTransitionFocus:true});
      document.body.dataset.portalMotionEngine='home-entrance';
      window.PortalHomeEntrance?.({ focusTarget: options.focusTarget, variant: 'return' });
      Promise.all(surfaceAnimations.map(animation=>animation.finished.catch(()=>{}))).then(()=>{
        if(generation!==surfaceGeneration)return;
        surfaceAnimations.forEach(animation=>animation.cancel());
        surfaceAnimations=[];
        surfaceCleanups.splice(0).reverse().forEach(cleanup=>cleanup());
      });
      return;
    }
    // Measure both lines before detaching either, so their fade stays exactly
    // where the homepage was painted rather than changing the second line's y.
    const titleSources = [document.querySelector('.mg-hero-heading h1'), document.querySelector('.mg-hero-heading > p')]
          .filter(visible).map(node => {
            const computed = getComputedStyle(node);
            return { node, bounds: node.getBoundingClientRect(), style: Object.fromEntries(
              ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'color', 'textAlign', 'opacity']
                .map(key => [key, computed[key]])) };
          });
    const titleExit = titleSources.map(source => fadeHomeText(source.node, 160, source));
    apply(name,{...options,deferTransitionFocus:true});
    document.body.classList.add('portal-surface-transition');
    document.body.dataset.portalMotionEngine='always-visible-single-layer';
    const ai = search.classList.contains('is-ai');
    const revealWorkspace = prepareWorkspace(ai
      ? [document.getElementById('portalAiConversation'), document.getElementById('portalAiCitations')]
      : document.querySelector('.portal-search-layout'), generation);
    const incoming=targets(name);
    if (name === 'search' && visible(returnIcon)) {
      animateSurface(returnIcon, [{ opacity: 0 }, { opacity: 1 }], {
        delay: 100, duration: 220, easing: ease, fill: 'backwards'
      });
    }
    incoming.forEach((node,index)=>{
      const start=before[index];if(!start||!visible(node))return;
      const end=rect(node);
      if(index<2) revealSearchHeading(node, titleExit, generation);
      else if (ai && window.matchMedia('(min-width: 901px)').matches) {
        // Fit the actual composer width and height instead of scaling its text.
        // Its grid row is bottom-anchored, so compensate for the height fit.
        // Keep the destination's white border: the borderless home form's
        // computed borderColor is its dark currentColor, not a visible stroke.
        animateSurface(node, [
          { width: `${start.width}px`, height: `${start.height}px`, backgroundColor: start.backgroundColor, borderRadius: start.borderRadius, transform: `${end.baseTransform} translate(${start.left-end.left}px,${start.top-end.top+start.height-end.height}px)` },
          { width: `${end.width}px`, height: `${end.height}px`, backgroundColor: end.backgroundColor, borderRadius: end.borderRadius, transform: end.baseTransform || 'none' }
        ], { duration: 520, easing: ease, fill: 'both' });
      } else animateSurface(node,[
        {transform:`translate(${start.left-end.left}px,${start.top-end.top}px)`},
        {transform:'none'}
      ],{duration:520,easing: ease});
    });
    // Acknowledge the query and reveal results while the composer is moving.
    revealWorkspace?.();
    Promise.all(surfaceAnimations.map(animation=>animation.finished.catch(()=>{}))).then(()=>{
      if(generation!==surfaceGeneration)return;
      surfaceAnimations.forEach(animation=>animation.cancel());surfaceAnimations=[];
      surfaceCleanups.splice(0).reverse().forEach(cleanup=>cleanup());
      document.body.classList.remove('portal-surface-transition');
      const focus=document.activeElement;
      if(options.focusTarget&&visible(options.focusTarget)&&(focus===document.body||focus===initialFocus||focus===options.focusTarget))options.focusTarget.focus({preventScroll:true});
      layoutChanged();
    });
  }
  function captureContent() {
    const content = document.getElementById("portalResultsContent");
    if (reduced.matches || !visible(content) || workspaceCleanup) return null;
    if (document.body.classList.contains("portal-surface-transition")) stopSurface();
    stopContent();
    return { visible: true };
  }
  function beforeModeChange() { pendingContent = captureContent(); }
  function prepareResults() {
    const snapshot = pendingContent || captureContent();
    pendingContent = null;
    return snapshot;
  }
  function animateResults(snapshot) {
    if (!snapshot || workspaceCleanup) return;
    revealResultCards();
  }
  function revealResultCards() {
    const list = document.getElementById('portalSearchResultList');
    if (reduced.matches || !visible(list)) return;
    stopContent();
    contentAnimations = [...list.children].map((card,index) => card.animate([
      { opacity: 0.72, transform: 'translateY(4px)' },
      { opacity: 1, transform: 'none' }
    ], { duration: 260, delay: Math.min(index * 35, 70), easing: ease, fill: 'both' }));
    contentAnimations.forEach(animation => animation.finished.then(() => {
      animation.cancel();
      contentAnimations = contentAnimations.filter(current => current !== animation);
    }).catch(() => {}));
  }
  function reveal(node) {
    if (reduced.matches || !visible(node)) return;
    node.animate([{ opacity: 0, transform: "translateY(4px)" }, { opacity: 1, transform: "none" }], { duration: 220, easing: ease });
  }
  function layoutChanged() {
    const layout = document.querySelector(".portal-search-layout");
    const results = document.querySelector(".portal-search-results");
    if (!layout || !visible(results) || window.matchMedia("(max-width: 720px)").matches) {
      layout?.classList.remove("is-docked");
      return;
    }
    const sidebar = document.getElementById("portalSearchSidebar");
    const top = parseFloat(getComputedStyle(sidebar).top) || 0;
    layout.classList.toggle("is-docked", results.getBoundingClientRect().top <= top + 1);
  }
  window.addEventListener("scroll", layoutChanged, { passive: true });
  window.addEventListener("load", layoutChanged);
  if (typeof ResizeObserver === "function") {
    const query = document.querySelector(".portal-result-query");
    if (query) new ResizeObserver(() => {
      const page = document.getElementById('searchResultsPage');
      if (page.classList.contains('is-ai') && visible(query)) page.style.setProperty('--portal-ai-composer-height', `${query.getBoundingClientRect().height}px`);
      requestAnimationFrame(layoutChanged);
    }).observe(query);
  }
  function drawerState(node, open, wasOpen) {
    drawerAnimation?.cancel();
    drawerAnimation = null;
    node.classList.remove("is-closing");
    const mobile = window.matchMedia("(max-width: 720px)").matches;
    node.inert = mobile && !open;
    drawerElement = node;
    if (!mobile || reduced.matches || (!open && !wasOpen)) return;
    if (!open) node.classList.add("is-closing");
    const animation = node.animate(open
      ? [{ opacity: 0, transform: "translateX(-12px)" }, { opacity: 1, transform: "none" }]
      : [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(-8px)" }],
      { duration: open ? 220 : 180, easing: ease, fill: "backwards" });
    drawerAnimation = animation;
    animation.finished.then(() => {
      if (drawerAnimation !== animation) return;
      node.classList.remove("is-closing");
      drawerAnimation = null;
    }).catch(() => {});
  }
  window.addEventListener("resize", () => {
    stopSurface(); stopContent(); pendingContent = null;
    if (announcementAnimation) {
      const announcement = document.getElementById('announcementBar');
      announcementState(announcement, announcement.dataset.announcementOpen === 'true', { animate: false });
    }
    layoutChanged();
    drawerAnimation?.cancel(); drawerAnimation = null;
    if (drawerElement) {
      drawerElement.classList.remove("is-closing");
      drawerElement.inert = window.matchMedia("(max-width: 720px)").matches && !drawerElement.classList.contains("is-open");
    }
  });
  reduced.addEventListener("change", () => {
    if (!reduced.matches) return;
    stopSurface(); stopContent(); pendingContent = null;
    if (announcementAnimation) {
      const announcement = document.getElementById('announcementBar');
      announcementState(announcement, announcement.dataset.announcementOpen === 'true', { animate: false });
    }
    drawerAnimation?.cancel(); drawerAnimation = null;
    drawerElement?.classList.remove("is-closing");
  });
  window.PortalSearchMotion = { switchSurface, beforeModeChange, prepareResults, animateResults, reveal, drawerState, announcementState, layoutChanged, changeRecommendations };
})();
