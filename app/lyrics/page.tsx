// app/lyrics/page.tsx
import { client } from "../lib/sanity";
import { allLyricsQuery } from "../../sanity/queries/lyrics";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "../lib/sanity.image";
import ClientErrorBoundary from "../components/ClientErrorBoundary";
import SortToggleWrapper from "../components/SortToggleWrapper";

export default async function LyricsPage(props: any) {
  const sp = await (props.searchParams as any);
  const sortParamRaw = (sp && (sp.sort as string)) || "date";
  const sortParam = Array.isArray(sortParamRaw)
    ? sortParamRaw[0]
    : sortParamRaw;

  let items: any[] = [];

  try {
    items = await client.fetch(allLyricsQuery);
  } catch (err) {
    console.error("Failed to fetch lyrics from Sanity:", err);
    return (
      <div className={styles.header}>
        <h1>Lyrics</h1>
        <p>Unable to load lyrics right now. Check server logs for details.</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className={styles.container}>
        <h1>Lyrics</h1>
        <p>
          No lyrics found. If you expect lyrics to appear, confirm they exist in
          your Sanity dataset and that the environment variables
          (NEXT_PUBLIC_SANITY_PROJECT_ID / dataset) are correct.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Lyrics</h1>
        {/* client-side sort toggle to avoid full page reload */}
        <div>
          <ClientErrorBoundary>
            <SortToggleWrapper initial={sortParam} />
          </ClientErrorBoundary>
        </div>
      </div>
      <div className={styles.list}>
        {(() => {
          // filter to items that have lyrics
          const filtered = items.filter((it: any) => {
            if (!it) return false;
            const l = it.lyrics;
            if (!l) return false;
            if (typeof l === "string") return l.trim().length > 0;
            if (Array.isArray(l)) return l.length > 0;
            return true;
          });

          if (sortParam === "alpha") {
            // Simple alphabetical listing
            const byTitle = filtered.slice().sort((a: any, b: any) => {
              const A = (a.title || "").toLowerCase();
              const B = (b.title || "").toLowerCase();
              return A < B ? -1 : A > B ? 1 : 0;
            });

            return (
              <ul className={styles.alphaList}>
                {byTitle.map((it: any) => (
                  <li key={it._id} className={styles.item}>
                    <Link
                      href={`/lyrics/${it.slug}`}
                      className={styles.row}
                      aria-label={`${it.title} — view lyrics`}
                    >
                      {it.coverImage ? (
                        <div className={styles.thumbWrap}>
                          <Image
                            src={urlFor(it.coverImage)
                              .width(400)
                              .height(400)
                              .url()}
                            alt={it.title}
                            width={72}
                            height={72}
                            className={styles.thumb}
                          />
                        </div>
                      ) : (
                        <div className={styles.thumbPlaceholder} aria-hidden />
                      )}

                      <div className={styles.info}>
                        <div className={styles.title}>{it.title}</div>
                        <div className={styles.meta} aria-hidden>
                          {it.isInstrumental ? "Instrumental" : ""}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            );
          }

          // group items by year
          const groups: Record<string, any[]> = {};

          filtered.forEach((it: any) => {
            const year = it.releaseDate
              ? new Date(it.releaseDate).getFullYear().toString()
              : "Unknown";
            if (!groups[year]) groups[year] = [];
            groups[year].push(it);
          });

          // order years descending (already sorted by releaseDate desc from GROQ, but ensure keys order)
          const years = Object.keys(groups).sort((a, b) =>
            b === "Unknown" ? -1 : a === "Unknown" ? 1 : Number(b) - Number(a)
          );

          return years.map((yr) => (
            <section key={yr} className={styles.yearSection}>
              <h2 className={styles.yearHeading}>{yr} <span className={styles.yearCount}>({groups[yr].length})</span></h2>
              <ul className={styles.yearList}>
                {groups[yr].map((it: any) => (
                  <li key={it._id} className={styles.item}>
                    <Link
                      href={`/lyrics/${it.slug}`}
                      className={styles.row}
                      aria-label={`${it.title} — view lyrics`}
                    >
                      {it.coverImage ? (
                        <div className={styles.thumbWrap}>
                          <Image
                            src={urlFor(it.coverImage).width(400).height(400).url()}
                            alt={it.title}
                            width={72}
                            height={72}
                            className={styles.thumb}
                            placeholder="blur"
                            blurDataURL={urlFor(it.coverImage).width(20).blur(10).url()}
                          />
                        </div>
                      ) : (
                        <div className={styles.thumbPlaceholder} aria-hidden />
                      )}

                      <div className={styles.info}>
                        <div className={styles.title}>{it.title}</div>
                        <div className={styles.meta} aria-hidden>
                          {it.isInstrumental ? "Instrumental" : ""}
                        </div>
                      </div>

                      {/* hover metadata removed: simplified row */}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ));
        })()}
      </div>
    </div>
  );
}
