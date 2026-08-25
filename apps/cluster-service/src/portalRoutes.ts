export type PortalPage = "think-tank" | "information-exchange" | "technology-resource-service" | "technology-decision-support" | "scientific-data-center" | "technology-topic-service";

const portalHashes: Record<PortalPage, string> = {
  "think-tank": "top",
  "information-exchange": "ie-top",
  "technology-resource-service": "trs-top",
  "technology-decision-support": "tds-top",
  "scientific-data-center": "sdc-top",
  "technology-topic-service": "tp-top",
};

export function isPortalPage(value: string | null): value is PortalPage {
  return value === "think-tank" || value === "information-exchange" || value === "technology-resource-service" || value === "technology-decision-support" || value === "scientific-data-center" || value === "technology-topic-service";
}

export function buildPortalPageHref(target: PortalPage, source = window.location.href) {
  const url = new URL(source);
  url.search = "";
  url.searchParams.set("page", target);
  url.hash = portalHashes[target];
  return `${url.pathname}${url.search}${url.hash}`;
}
