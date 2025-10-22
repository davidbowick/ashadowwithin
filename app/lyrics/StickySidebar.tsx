"use client";
import React, { useEffect, useRef, useState } from "react";

export default function StickySidebar({ children, topOffset = 78 }: { children: React.ReactNode; topOffset?: number }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [styles, setStyles] = useState<React.CSSProperties | undefined>(undefined);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    function getRect() {
      const node = wrapperRef.current;
      return node ? node.getBoundingClientRect() : null;
    }

    function onResize() {
      const r = getRect();
      if (!r) return;
      if (isStuck) {
        setStyles({ position: "fixed", top: `${topOffset}px`, left: `${r.left}px`, width: `${r.width}px` });
      }
    }

    function onScroll() {
      const r = getRect();
      if (!r) return;
      const viewportTop = window.scrollY || window.pageYOffset;
      const elTop = r.top + viewportTop;
      if (viewportTop + topOffset > elTop) {
        if (!isStuck) setIsStuck(true);
        setStyles({ position: "fixed", top: `${topOffset}px`, left: `${r.left}px`, width: `${r.width}px`, zIndex: 50 });
      } else {
        if (isStuck) setIsStuck(false);
        setStyles(undefined);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // initial measure
    onResize();
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [topOffset, isStuck]);

  return (
    <div ref={wrapperRef} style={styles}>
      {children}
    </div>
  );
}
