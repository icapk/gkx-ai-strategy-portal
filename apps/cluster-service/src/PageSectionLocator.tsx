import { ListTree } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";

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
  activeId,
  anchorId,
  onLocate,
  onTop,
}: {
  items: LocatorItem[];
  topId: string;
  label?: string;
  activeId?: string;
  anchorId?: string;
  onLocate?: (id: string) => void;
  onTop?: () => void;
}) {
  const [observedActiveId, setObservedActiveId] = useState(items[0]?.id ?? topId);
  const [showBackTop, setShowBackTop] = useState(false);
  const [locatorStyle, setLocatorStyle] = useState<Pick<CSSProperties, "position" | "top">>({ position: "absolute", top: 0 });

  useEffect(() => {
    const updateActiveSection = () => {
      const marker = Math.min(220, window.innerHeight * .3);
      const backTopThreshold = Math.min(360, window.innerHeight * .4);
      const stickyTop = 96;
      const anchor = document.getElementById(anchorId ?? items[0]?.id ?? topId);
      const anchorTop = anchor ? anchor.getBoundingClientRect().top + window.scrollY : stickyTop;
      const shouldStick = window.scrollY + stickyTop >= anchorTop;
      let current = items[0]?.id ?? topId;
      for (const item of items) {
        const element = document.getElementById(item.id);
        if (element && element.getBoundingClientRect().top <= marker) current = item.id;
      }
      setObservedActiveId(current);
      setShowBackTop(window.scrollY > backTopThreshold);
      setLocatorStyle((previous) => {
        const next = { position: shouldStick ? "fixed" : "absolute", top: shouldStick ? stickyTop : anchorTop } as const;
        return previous.position === next.position && previous.top === next.top ? previous : next;
      });
    };
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [anchorId, items, topId]);

  const locate = (id: string) => {
    const behavior = preferredScrollBehavior();
    if (id === topId) {
      if (onTop) onTop();
      else window.scrollTo({ top: 0, behavior });
    } else if (onLocate) onLocate(id);
    else document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
    setObservedActiveId(id);
    const url = new URL(window.location.href);
    url.hash = id;
    window.history.replaceState(window.history.state, "", url);
  };

  const currentActiveId = activeId ?? observedActiveId;

  return (
    <nav className="fp-section-locator" aria-label={label} style={locatorStyle}>
      <header><ListTree size={15} aria-hidden="true" /><span>{label}</span></header>
      {items.map((item, index) => (
        <button
          type="button"
          className={currentActiveId === item.id ? "is-active" : ""}
          aria-current={currentActiveId === item.id ? "location" : undefined}
          aria-label={`定位到${item.label}`}
          title={item.label}
          onClick={() => locate(item.id)}
          key={item.id}
        >
          <b>{String(index + 1).padStart(2, "0")}</b><span>{item.label}</span>
        </button>
      ))}
      {showBackTop ? <button type="button" className="fp-locator-top" onClick={() => locate(topId)} title="返回顶部">
        <span>返回顶部</span>
      </button> : null}
    </nav>
  );
}
