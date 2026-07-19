(() => {
  "use strict";

  const menuButton = document.getElementById("landingMenuButton");
  const navigation = document.getElementById("landingNavigation");
  const infoEntry = document.getElementById("homeInfoEntry");
  const iframeShell = document.getElementById("iframeShell");
  const embeddedSystem = document.getElementById("embeddedSystem");
  const iframeClose = document.getElementById("iframeClose");

  function closeNavigation(restoreFocus = false) {
    if (!navigation || !menuButton) return;
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "打开业务导航");
    if (restoreFocus) menuButton.focus();
  }

  function openNavigation() {
    if (!navigation || !menuButton) return;
    navigation.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "关闭业务导航");
  }

  menuButton?.addEventListener("click", () => {
    if (navigation?.classList.contains("is-open")) closeNavigation();
    else openNavigation();
  });

  navigation?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeNavigation());
  });

  document.addEventListener("pointerdown", (event) => {
    if (!navigation?.classList.contains("is-open")) return;
    if (navigation.contains(event.target) || menuButton?.contains(event.target)) return;
    closeNavigation();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation(true);
  });

  infoEntry?.addEventListener("click", () => {
    if (!iframeShell || !embeddedSystem) return;
    embeddedSystem.src = infoEntry.dataset.embedUrl || "https://skxrules.unicomcn.tech:30999/";
    iframeShell.hidden = false;
    iframeShell.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  iframeClose?.addEventListener("click", () => {
    if (!iframeShell || !embeddedSystem) return;
    iframeShell.hidden = true;
    embeddedSystem.src = "about:blank";
    infoEntry?.focus();
  });
})();
