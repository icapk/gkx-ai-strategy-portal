/* Keep the content grid centred on the requested viewport, even with a reserved scrollbar. */
(() => {
  const root = document.getElementById('mgResearchContent');
  if (!root) return;
  const syncViewport = () => root.style.setProperty('--research-viewport-width', `${window.innerWidth}px`);
  syncViewport();
  window.addEventListener('resize', syncViewport, { passive: true });
})();
