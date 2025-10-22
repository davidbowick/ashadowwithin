"use client";

import dynamic from "next/dynamic";
import React from "react";

const SortToggle = dynamic(() => import("./SortToggle"), {
  ssr: false,
  loading: () => <div style={{ fontStyle: 'italic', color: '#666' }}>Loading sort...</div>,
});

export default function SortToggleWrapper(props: { initial?: string }) {
  return <SortToggle initial={props.initial} />;
}
