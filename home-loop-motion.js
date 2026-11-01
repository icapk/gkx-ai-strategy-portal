/* Decorative loop motion pauses outside the viewport and follows system preferences. */
(() => {
 'use strict';
 const section = document.querySelector('#mgResearchContent .mg-loop-section');
 const figure = section?.querySelector('.mg-infinity-wrap');
 if (!section || !figure || section.hasAttribute('data-loop-motion-ready')) return;
 const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
 const supportsPath = CSS.supports('offset-path', 'path("M 0 0 L 1 1")');
 let inView = false;
 let pausedByUser = false;
 let observer;
 let sizeObserver;
 section.setAttribute('data-loop-motion-ready', '');
 section.querySelectorAll('.mg-loop-steps li').forEach((step, index) => {
  step.style.setProperty('--loop-step-delay', `${index * 2 - 10}s`);
 });
 const toggle = document.createElement('button');
 toggle.type = 'button';
 toggle.className = 'mg-loop-motion-toggle';
 toggle.textContent = '暂停动效';
 toggle.setAttribute('aria-label', '暂停闭环演示动效');
 figure.append(toggle);
 if (supportsPath) {
  const layer = document.createElement('span');
  layer.className = 'mg-loop-motion';
  layer.setAttribute('aria-hidden', 'true');
  for (let index = 0; index < 3; index += 1) {
   const signal = document.createElement('span');
   signal.className = 'mg-loop-signal';
   const image = document.createElement('img');
   image.src = 'assets/figma-home-modules/loop-pin-blue.svg';
   image.width = 12;
   image.height = 12;
   image.alt = '';
   signal.append(image);
   layer.append(signal);
  }
  figure.insertBefore(layer, figure.querySelector('.mg-loop-center'));
 }
 const resize = () => {
  figure.style.setProperty('--loop-motion-scale', String(figure.getBoundingClientRect().width / 605));
 };
 const sync = () => {
  section.dataset.loopMotion = inView && !document.hidden && !preference.matches && !pausedByUser ? 'running' : 'paused';
  toggle.hidden = preference.matches;
 };
 toggle.addEventListener('click', () => {
  pausedByUser = !pausedByUser;
  toggle.textContent = pausedByUser ? '播放动效' : '暂停动效';
  toggle.setAttribute('aria-label', pausedByUser ? '播放闭环演示动效' : '暂停闭环演示动效');
  sync();
 });
 resize();
 if ('ResizeObserver' in window) {
  sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(figure);
 } else {
  window.addEventListener('resize', resize, { passive: true });
 }
 if ('IntersectionObserver' in window) {
  observer = new IntersectionObserver(([entry]) => {
   inView = entry.isIntersecting;
   sync();
  }, { threshold: .05, rootMargin: '80px 0px' });
  observer.observe(section.querySelector('.mg-loop-visual'));
 } else {
  inView = true;
 }
 document.addEventListener('visibilitychange', sync);
 preference.addEventListener('change', sync);
 sync();
})();
