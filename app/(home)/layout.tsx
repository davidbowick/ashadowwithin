// app/(home)/layout.tsx
export { metadata } from "../layout"; // reuse global metadata

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}