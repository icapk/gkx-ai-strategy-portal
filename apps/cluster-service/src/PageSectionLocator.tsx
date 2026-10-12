import { useEffect, useState } from "react";

type LocatorItem = {
  id: string;
  label: string;
};

function preferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

export default function PageSectionLocator({
  items,
  topId,
  label = "内容定位",
  activeId: controlledActiveId,
  onLocate,
  className = "",
}: {
  items: LocatorItem[];
  topId: string;
  label?: string;
  activeId?: string;
  onLocate?: (id: string) => void;
  className?: string;
}) {
  const [internalActiveId, setInternalActiveId] = useState(items[0]?.id ?? topId);
  const activeId = controlledActiveId ?? internalActiveId;

  useEffect(() => {
    if (controlledActiveId !== undefined) return;
    const updateActiveSection = () => {
      const marker = Math.min(220, window.innerHeight * .3);
      let current = items[0]?.id ?? topId;
      for (const item of items) {
        const element = document.getElementById(item.id);
        if (element && element.getBoundingClientRect().top <= marker) current = item.id;
      }
      setInternalActiveId(current);
    };
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [controlledActiveId, items, topId]);

  const locate = (id: string) => {
    if (id !== topId && onLocate) {
      onLocate(id);
      return;
    }
    const behavior = preferredScrollBehavior();
    if (id === topId) window.scrollTo({ top: 0, behavior });
    else document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
    const url = new URL(window.location.href);
    url.hash = id;
    window.history.replaceState(window.history.state, "", url);
  };

  return (
    <nav className={`fp-section-locator${className ? ` ${className}` : ""}`} aria-label={label}>
      {items.map((item) => (
        <button
          type="button"
          className={activeId === item.id ? "is-active" : ""}
          aria-current={activeId === item.id ? "location" : undefined}
          aria-label={`定位到${item.label}`}
          title={item.label}
          onClick={() => locate(item.id)}
          key={item.id}
        >
          <span>{item.label}</span>
        </button>
      ))}
      <button type="button" className="fp-locator-top" onClick={() => locate(topId)} title="返回顶部">
        <span>返回顶部</span>
      </button>
    </nav>
  );
}
