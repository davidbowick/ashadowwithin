"use client";
import { useEffect } from "react";
import { glitchify } from "@/lib/glitch";

export function useGlitch(ref: React.RefObject<HTMLElement>, options = {}) {
  useEffect(() => {
    if (ref.current) {
      const controller = glitchify(ref.current, options);
      return () => controller.destroy();
    }
  }, [ref, options]);
}