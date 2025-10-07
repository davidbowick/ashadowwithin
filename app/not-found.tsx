import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>
        This page is lost in the shadows...
      </p>
      <Link href="/" className={styles.homeLink}>
        Return to the Light
      </Link>
    </div>
  );
}