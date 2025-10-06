"use client";

import { motion } from "framer-motion";
import styles from "./MetalHamburger.module.css";

type MetalHamburgerProps = {
  isOpen: boolean;
  onToggle: () => void;
  size?: number;
  color?: string;
};

export default function MetalHamburger({
  isOpen,
  onToggle,
  size = 40,
  color = "#fff",
}: MetalHamburgerProps) {
  return (
    <button
      onClick={onToggle}
      className={styles.hamburger}
      aria-label="Menu"
      style={{ background: "none", border: "none", cursor: "pointer" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
      >
        <g filter="url(#rough)">
          {/* Top bar */}
          <motion.path
            d="M4 8 H28"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            initial={false}
            animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />
          {/* Middle bar */}
          <motion.path
            d="M4 16 H28"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            initial={false}
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          {/* Bottom bar */}
          <motion.path
            d="M4 24 H28"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            initial={false}
            animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />
        </g>
        <defs>
          <filter id="rough" filterUnits="userSpaceOnUse">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="2"
              numOctaves="2"
              result="turb"
              seed="10"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turb"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </button>
  );
}