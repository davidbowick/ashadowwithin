// app/(home)/layout.tsx
export { metadata } from "../layout"; // reuse global metadata
import HomeReveal from "./HomeReveal";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <HomeReveal>{children}</HomeReveal>;
}