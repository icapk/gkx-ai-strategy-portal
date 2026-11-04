/* Access interactions for the isolated local prototype; no production identity service is called. */
(() => {
  const signedIn = () => Boolean(window.PortalSearchRecommend?.snapshot().userId);
  const protectedUrl = (href) => {
    try {
      const url = new URL(href, window.location.href);
      return url.searchParams.get("cluster") === "think-tank"
        || (url.pathname.includes("/cluster-service/") && (!url.searchParams.get("page") || url.searchParams.get("page") === "think-tank"));
    } catch { return false; }
  };
  const requestLogin = (returnTo = window.location.href) => {
    const url = new URL("prototype-login.html", window.location.href);
    url.searchParams.set("returnTo", returnTo);
    window.location.replace(url.href);
  };
  const syncEntries = () => {
    document.querySelectorAll("[data-think-tank-entry]").forEach((entry) => {
      entry.hidden = !signedIn();
      entry.style.display = signedIn() ? "" : "none";
    });
  };
  window.PortalThinkTankAccess = { signedIn, protectedUrl, requestLogin, syncEntries };
  window.PortalSearchRecommend?.subscribe(syncEntries);
  document.addEventListener("DOMContentLoaded", syncEntries);
  if (protectedUrl(window.location.href) && !signedIn()) requestLogin();
})();
