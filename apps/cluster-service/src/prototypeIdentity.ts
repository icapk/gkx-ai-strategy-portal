import { useEffect, useState } from "react";

const SESSION_KEY = "gkx-search-recommend-shared-v20261025";

type PrototypeService = {
  snapshot: () => { userId?: string | null };
  subscribe: (listener: () => void) => () => void;
  setDemoIdentity: (identity: { userId: string | null; audience: string }) => Promise<unknown>;
};

type PrototypeWindow = Window & { PortalSearchRecommend?: PrototypeService };

function getService(): PrototypeService | undefined {
  try {
    if (window.parent !== window) {
      const parentService = (window.parent as PrototypeWindow).PortalSearchRecommend;
      if (parentService) return parentService;
    }
  } catch { /* The local preview can also be opened outside its portal frame. */ }
  return (window as PrototypeWindow).PortalSearchRecommend;
}

function readUserId(): string | null {
  const service = getService();
  if (service) return service.snapshot().userId || null;
  try {
    const snapshot = JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null");
    return typeof snapshot?.userId === "string" && snapshot.userId ? snapshot.userId : null;
  } catch { return null; }
}

export function usePrototypeIdentity(): string | null {
  const [userId, setUserId] = useState(readUserId);
  useEffect(() => {
    const sync = () => setUserId(readUserId());
    const unsubscribe = getService()?.subscribe(sync);
    window.addEventListener("storage", sync);
    sync();
    return () => {
      unsubscribe?.();
      window.removeEventListener("storage", sync);
    };
  }, []);
  return userId;
}

export function requestPrototypeLogin(): void {
  const login = new URL("../../../prototype-login.html", window.location.href);
  let returnTo = window.location.href;
  try {
    if (window.parent !== window) returnTo = window.parent.location.href;
  } catch { /* Keep the directly accessible route as the return destination. */ }
  login.searchParams.set("returnTo", returnTo);
  if (window.parent !== window) window.top?.location.assign(login.href);
  else window.location.replace(login.href);
}

export async function signOutPrototype(): Promise<void> {
  await getService()?.setDemoIdentity({ userId: null, audience: "research" });
  window.location.assign(new URL("../../../index.html", window.location.href).href);
}
