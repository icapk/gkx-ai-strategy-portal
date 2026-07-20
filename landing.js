(() => {
  "use strict";

  const menuButton = document.getElementById("landingMenuButton");
  const navigation = document.getElementById("landingNavigation");
  const iframeShell = document.getElementById("landingIframeShell");
  const iframe = document.getElementById("landingIframe");
  const iframeClose = document.getElementById("landingIframeClose");

  function closeNavigation() {
    navigation?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }

  menuButton?.addEventListener("click", () => {
    const isOpen = navigation?.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  navigation?.addEventListener("click", closeNavigation);

  function closeIframe() {
    if (!iframeShell || !iframe) return;
    iframeShell.hidden = true;
    iframe.src = "about:blank";
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-embed-url]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!iframeShell || !iframe) return;
      iframe.src = button.dataset.embedUrl;
      iframeShell.hidden = false;
      document.body.style.overflow = "hidden";
      iframeClose?.focus();
    });
  });

  iframeClose?.addEventListener("click", closeIframe);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeNavigation();
    if (iframeShell && !iframeShell.hidden) closeIframe();
  });
})();
