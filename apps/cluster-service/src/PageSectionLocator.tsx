import { ArrowUp, ListTree } from "lucide-react";
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
}: {
  items: LocatorItem[];
  topId: string;
  label?: string;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? topId);

  useEffect(() => {
    const updateActiveSection = () => {
      const marker = Math.min(220, window.innerHeight * .3);
      let current = items[0]?.id ?? topId;
      for (const item of items) {
        const element = document.getElementById(item.id);
        if (element && element.getBoundingClientRect().top <= marker) current = item.id;
      }
      setActiveId(current);
    };
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [items, topId]);

  const locate = (id: string) => {
    const behavior = preferredScrollBehavior();
    if (id === topId) window.scrollTo({ top: 0, behavior });
    else document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
    const url = new URL(window.location.href);
    url.hash = id;
    window.history.replaceState(window.history.state, "", url);
  };

  return (
    <nav className="fp-section-locator" aria-label={label}>
      <header><ListTree size={15} aria-hidden="true" /><span>{label}</span></header>
      {items.map((item, index) => (
        <button
          type="button"
          className={activeId === item.id ? "is-active" : ""}
          aria-current={activeId === item.id ? "location" : undefined}
          aria-label={`定位到${item.label}`}
          title={item.label}
          onClick={() => locate(item.id)}
          key={item.id}
        >
          <b>{String(index + 1).padStart(2, "0")}</b><span>{item.label}</span>
        </button>
      ))}
      <button type="button" className="fp-locator-top" onClick={() => locate(topId)} title="返回顶部">
        <ArrowUp size={14} aria-hidden="true" /><span>返回顶部</span>
      </button>
    </nav>
  );
}
