"use client";

import React, { useRef, useEffect } from "react";
import { applyGlitch } from "@/lib/glitch"; // we'll put the logic here

type GlitchProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Glitch({ children, className = "" }: GlitchProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const cleanup = applyGlitch(ref.current, {
        subtle: true, // baseline effect
        hoverBoost: true, // amplify on hover/focus
      });
      return cleanup;
    }
  }, []);

  return (
    <div ref={ref} className={`glitch-wrapper ${className}`}>
      {children}
    </div>
  );
}