"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function HomeReveal({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 30, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: reduce ? 0 : 0.9, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}