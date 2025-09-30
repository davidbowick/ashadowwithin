"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function HeaderWrapper() {
  const pathname = usePathname();
  const showHeader = pathname !== "/"; // hide on homepage

  return showHeader ? <Header /> : null;
}