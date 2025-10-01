import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import { NAV_ITEMS } from "./navItems";
import SocialLinks from "./SocialLinks";
import SignupForm from "./SignupForm";
import { getBio } from "@/lib/sanity";

export default async function Footer() {
  const bio = await getBio();
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Column 1: Band info */}
        <div className={styles.col}>
          <Image
            src="/a-shadow-within-logo-white.png"
            alt="A Shadow Within logo"
            width={160}
            height={50}
            priority
          />
          <p className={styles.tagline}>
            {bio?.shortBio}
          </p>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} A Shadow Within. All rights reserved.
          </p>
        </div>

        {/* Column 2: Navigation */}
        <div className={styles.col}>
          <h3>Explore</h3>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Social + Newsletter */}
        <div className={styles.col}>
          <h3>Connect</h3>
          <SocialLinks size="sm" extraClass={styles.footerSocials} />

          <SignupForm />
        </div>
      </div>
    </footer>
  );
}