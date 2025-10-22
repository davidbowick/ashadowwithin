"use client";
import React, { useEffect, useRef, useState } from "react";

export default function StickyObserver({ topOffset = 78, children }: { topOffset?: number; children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isStuck, setIsStuck] = useState(false);
  const [rect, setRect] = useState<{ left: number; width: number; height: number } | null>(null);
  const [adjustedTop, setAdjustedTop] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const sentinel = sentinelRef.current;
    if (!container || !sentinel) return;

    // Only enable sticky behavior on desktop-sized viewports.
    const desktopOnly = () => window.innerWidth >= 880;
    if (!desktopOnly()) {
      setIsStuck(false);
      setRect(null);
      return;
    }

    function updateFooterCollision(rLocal?: { left: number; width: number; height: number } | null) {
      const footer = document.querySelector("footer");
      if (!footer) {
        setAdjustedTop(null);
        return;
      }

      // Prefer explicit rect if provided, otherwise measure directly from the DOM.
      let r = rLocal;
      if (!r) {
        const node = containerRef.current;
        if (!node) {
          setAdjustedTop(null);
          return;
        }
        const b = node.getBoundingClientRect();
        r = { left: b.left + window.scrollX, width: b.width, height: b.height };
      }

      const fRect = footer.getBoundingClientRect();
      const margin = 12; // gap between sidebar bottom and footer
      const bottomOfFixed = topOffset + r.height;
      const overlap = bottomOfFixed - fRect.top;
      if (overlap > 0) {
        const newTop = Math.max(0, topOffset - overlap - margin);
        setAdjustedTop(newTop);
      } else {
        setAdjustedTop(null);
      }
    }

    function measure() {
      if (!container) return;
      const r = container.getBoundingClientRect();
      const local = { left: r.left + window.scrollX, width: r.width, height: r.height };
      setRect(local);
      updateFooterCollision(local);
    }

    measure();

  const ro = new ResizeObserver(() => measure());
    ro.observe(container);

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        // If sentinel is not intersecting the root (viewport) then the content has scrolled past it
        const stuck = !e.isIntersecting;
        setIsStuck(stuck);
        if (stuck) {
          // update footer collision when it becomes stuck
          updateFooterCollision();
        } else {
          setAdjustedTop(null);
        }
      },
      { root: null, threshold: 0, rootMargin: `-${topOffset}px 0px 0px 0px` }
    );

    io.observe(sentinel);

  window.addEventListener("scroll", measure, { passive: true });
    // on resize, re-evaluate whether we should enable sticky behavior
    function onResize() {
      if (!desktopOnly()) {
        setIsStuck(false);
        setRect(null);
        return;
      }
      measure();
    }

    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
  ro.disconnect();
  window.removeEventListener("scroll", measure);
  window.removeEventListener("resize", onResize as any);
    };
  }, [topOffset]);

  const fixedStyle: React.CSSProperties | undefined = isStuck && rect ? {
    position: 'fixed',
    top: (adjustedTop != null ? adjustedTop : topOffset),
    left: rect.left,
    width: rect.width,
    zIndex: 60,
  } : undefined;

  return (
    <div>
      {/* sentinel sits where sticky should start */}
      <div ref={sentinelRef} />
      {/* placeholder keeps layout when fixed */}
      <div style={{ height: isStuck && rect ? rect.height : undefined }} />

      <div ref={containerRef} style={fixedStyle}>
        {children}
      </div>
    </div>
  );
}
