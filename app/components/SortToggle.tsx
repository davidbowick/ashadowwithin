"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import styles from "./SortToggle.module.css";
import React from "react";

export default function SortToggle({ initial = "date" }: { initial?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params?.get("sort") || initial;

  function go(sort: string) {
    const sp = new URLSearchParams(Array.from(params || []) as any);
    if (sort === "date") sp.delete("sort");
    else sp.set("sort", sort);
    const q = sp.toString();
    router.push(`${pathname}${q ? `?${q}` : ""}`);
  }

  return (
    <div className={styles.sortControls} role="tablist" aria-label="Sort lyrics">
      <button
        onClick={() => go("date")}
        className={current === "date" ? styles.activeSort : ""}
        aria-current={current === "date" ? "page" : undefined}
      >
        Sort by date
      </button>
      <span aria-hidden> | </span>
      <button
        onClick={() => go("alpha")}
        className={current === "alpha" ? styles.activeSort : ""}
        aria-current={current === "alpha" ? "page" : undefined}
      >
        Sort A–Z
      </button>
    </div>
  );
}
