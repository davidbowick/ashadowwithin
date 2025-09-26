import Image from "next/image";

export default function Header() {
  return (
    <header>
      <h1 className="visually-hidden">A Shadow Within</h1>
      <Image
        src="/a-shadow-within-logo-white.png" // ✅ start with /
        alt="A Shadow Within logo"
        width={285}
        height={83}
        priority
      />
    </header>
  );
}