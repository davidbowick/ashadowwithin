export { metadata } from "../layout"; // optional; you can also remove this line and parent metadata will still apply

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}