import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import FigmaThinkTankPage from "./FigmaThinkTankPage";
import InformationExchangePage from "./InformationExchangePage";
import ScientificDataCenterPage from "./ScientificDataCenterPage";
import TechnologyResourceServicePage from "./TechnologyResourceServicePage";
import TechnologyDecisionSupportPage from "./TechnologyDecisionSupportPage";
import TechnologyTopicServicePage from "./TechnologyTopicServicePage";
import { buildPortalPageHref, isPortalPage, type PortalPage } from "./portalRoutes";
import "./portal-fidelity.css";
import "./technology-topic-service.css";
import "./responsive.css";

function notifyParentRoute() {
  if (window.parent === window) return;
  window.parent.postMessage({ type: "gkx-embedded-route", href: window.location.href }, "*");
}

const originalPushState = window.history.pushState.bind(window.history);
window.history.pushState = (...args) => {
  originalPushState(...args);
  window.queueMicrotask(notifyParentRoute);
};

const originalReplaceState = window.history.replaceState.bind(window.history);
window.history.replaceState = (...args) => {
  originalReplaceState(...args);
  window.queueMicrotask(notifyParentRoute);
};

window.addEventListener("hashchange", notifyParentRoute);
window.addEventListener("popstate", notifyParentRoute);

const searchParams = new URLSearchParams(window.location.search);
const requestedPage = searchParams.get("page");
document.documentElement.classList.toggle("is-portal-embed", searchParams.get("embed") === "portal");
const page: PortalPage = isPortalPage(requestedPage) ? requestedPage : "think-tank";
const pageConfigs = {
  "think-tank": { title: "新型高端智库", component: FigmaThinkTankPage },
  "information-exchange": { title: "科技信息交流", component: InformationExchangePage },
  "technology-resource-service": { title: "科技资源服务", component: TechnologyResourceServicePage },
  "technology-decision-support": { title: "科技决策支持", component: TechnologyDecisionSupportPage },
  "scientific-data-center": { title: "科学数据中心", component: ScientificDataCenterPage },
  "technology-topic-service": { title: "科技专题服务", component: TechnologyTopicServicePage },
} satisfies Record<PortalPage, { title: string; component: typeof FigmaThinkTankPage }>;

if (requestedPage !== page) {
  window.history.replaceState(window.history.state, "", buildPortalPageHref(page));
}

const pageConfig = pageConfigs[page];

document.title = `${pageConfig.title} - 深圳国际科技信息中心`;
const RootPage = pageConfig.component;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootPage />
  </StrictMode>,
);

window.queueMicrotask(notifyParentRoute);
