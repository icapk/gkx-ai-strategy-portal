import { ChevronDown, Search } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { buildPortalPageHref, type PortalPage } from "./portalRoutes";

type PortalHeaderProps = {
  currentPage: PortalPage;
};

function HeaderMenu({
  label,
  active,
  children,
}: {
  label: string;
  active?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const popoverId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (event.key === "ArrowDown" && event.target === triggerRef.current) {
      event.preventDefault();
      setOpen(true);
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLAnchorElement>(`#${CSS.escape(popoverId)} a`)?.focus();
      });
    }
  };

  return (
    <div
      className={`fp-header-menu${active ? " is-active" : ""}${open ? " is-open" : ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={(event) => {
        if (event.target instanceof HTMLButtonElement && event.target === triggerRef.current) return;
        setOpen(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={() => setOpen(true)}
      >
        {label}
        <ChevronDown size={14} strokeWidth={1.8} />
      </button>
      <div id={popoverId} className="fp-header-popover" role="group" aria-label={`${label}子菜单`}>
        {children}
      </div>
    </div>
  );
}

export default function PortalHeader({ currentPage }: PortalHeaderProps) {
  const active = currentPage === "information-exchange" || currentPage === "technology-resource-service" || currentPage === "technology-decision-support" || currentPage === "scientific-data-center" ? "science" : "strategy";
  return (
    <header className="fp-site-header">
      <div className="fp-site-header-inner">
        <a className="fp-brand" href={buildPortalPageHref("think-tank")} aria-label="深圳国际科技信息中心首页">
          <img src="./assets/gkx-logo.png" alt="" />
          <strong>深圳国际科技信息中心</strong>
        </a>

        <nav className="fp-main-nav" aria-label="主导航">
          <a href={buildPortalPageHref("think-tank")}>首页</a>
          <HeaderMenu label="科学研究" active={active === "science"}>
            <a href={buildPortalPageHref("information-exchange")} aria-current={currentPage === "information-exchange" ? "page" : undefined}>科技信息交流</a>
            <a href={buildPortalPageHref("technology-resource-service")} aria-current={currentPage === "technology-resource-service" ? "page" : undefined}>科技资源服务</a>
            <a href={buildPortalPageHref("technology-decision-support")} aria-current={currentPage === "technology-decision-support" ? "page" : undefined}>科技决策支持</a>
            <a href={buildPortalPageHref("scientific-data-center")} aria-current={currentPage === "scientific-data-center" ? "page" : undefined}>科学数据中心</a>
          </HeaderMenu>
          <span className="fp-nav-static is-disabled">未来教育</span>
          <HeaderMenu label="战略咨询" active={active === "strategy"}>
            <a href={buildPortalPageHref("think-tank")} aria-current={currentPage === "think-tank" ? "page" : undefined}>新型高端智库</a>
            <a href={buildPortalPageHref("technology-topic-service")} aria-current={currentPage === "technology-topic-service" ? "page" : undefined}>科技专题服务</a>
          </HeaderMenu>
          <span className="fp-nav-static is-disabled">科技评价</span>
        </nav>

        <div className="fp-global-search is-disabled" aria-label="全站搜索未开放">
          <span>AI科研 / AI教育 / AI战略咨询</span>
          <Search size={16} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <span className="fp-header-link is-disabled">应用</span>
        <span className="fp-header-link is-disabled">登录</span>
        <span className="fp-register is-disabled">免费注册</span>
      </div>
    </header>
  );
}
