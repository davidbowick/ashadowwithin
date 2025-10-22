// app/lyrics/[slug]/page.tsx
import { client } from "../../lib/sanity";
import { lyricsBySlugQuery } from "../../../sanity/queries/lyrics";
import styles from "./page.module.css";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "../../lib/sanity.image";
import {
  SpotifyIcon,
  YouTubeIcon,
  BandcampIcon,
  SoundcloudIcon,
  AppleMusicIcon,
  FacebookIcon,
  TwitterIcon,
  ShopifyIcon,
} from "../../components/SocialLinks";

function blocksToText(blocks: any): string {
  if (!blocks) return "";
  if (typeof blocks === "string") return blocks;
  if (Array.isArray(blocks)) {
    return blocks
      .map((b: any) => (b.children || []).map((c: any) => c.text || "").join(""))
      .join("\n\n");
  }
  return String(blocks);
}

function humanizeLabel(raw?: any) {
  if (!raw) return "";
  // Prefer an explicit label property if an object is passed
  if (typeof raw === "object") {
    if (raw.label) raw = raw.label;
    else if (raw.name) raw = raw.name;
    else if (raw.url) raw = raw.url;
    else raw = String(raw);
  }

  let s = String(raw || "");
  // If it's a URL, prefer hostname segment
  try {
    const u = new URL(s);
    const hostParts = u.hostname.replace(/^www\./, "").split(".");
    // pick the second-to-last segment when possible (foo.spotify.com -> spotify)
    s = hostParts.length >= 2 ? hostParts[hostParts.length - 2] : u.hostname;
  } catch (e) {
    // not a URL — continue
  }

  // replace separators with spaces and split camelCase
  let out = String(s).replace(/[_\-]+/g, " ");
  out = out.replace(/([a-z])([A-Z])/g, "$1 $2");
  out = out.replace(/\s+/g, " ").trim();

  // Title case
  out = out
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
    .join(" ");

  return out;
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    return String(dateStr);
  }
}

export default async function LyricPage({ params }: { params: any }) {
  const { slug } = (await params) as { slug: string };

  const data = await client.fetch(lyricsBySlugQuery, { slug });
  if (!data) return <div>Not found</div>;

  const lyricsText = blocksToText(data.lyrics);
  // support legacy array shape and new single-field shape
  const youtubeUrl = (data.youtubeVideo && String(data.youtubeVideo)) ||
    (data.youtube && String(data.youtube)) ||
    (data.youtubeVideos && data.youtubeVideos[0] && data.youtubeVideos[0].url) || null;

  const pageUrl = `https://ashadowwithin.com/lyrics/${slug}`;
  const imageUrl = data.coverImage ? urlFor(data.coverImage).width(1200).url() : undefined;

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: data.title || undefined,
    url: pageUrl,
    datePublished: data.releaseDate || undefined,
    image: imageUrl || undefined,
    ...(data.isrc ? { isrcCode: data.isrc } : {}),
    byArtist: {
      "@type": "MusicGroup",
      name: (data.artist && data.artist.name) || "A Shadow Within",
    },
    lyrics: {
      "@type": "CreativeWork",
      text: lyricsText || undefined,
    },
  };

  function getIconForUrl(url: string | null) {
    if (!url) return null;
    let hostname = "";
    try {
      hostname = new URL(url).hostname.toLowerCase();
    } catch (e) {
      hostname = url.toLowerCase();
    }

    if (hostname.includes("spotify")) return <SpotifyIcon />;
    if (hostname.includes("youtube") || hostname.includes("youtu.be")) return <YouTubeIcon />;
    if (hostname.includes("bandcamp")) return <BandcampIcon />;
    if (hostname.includes("soundcloud")) return <SoundcloudIcon />;
    if (hostname.includes("apple") || hostname.includes("music")) return <AppleMusicIcon />;

    if (hostname.includes("facebook")) return <FacebookIcon />;
    if (hostname.includes("twitter")) return <TwitterIcon />;
    if (hostname.includes("shopify") || hostname.includes("merch")) return <ShopifyIcon />;

    // fallback to a simple text-based icon (small circle)
    return (
      <svg viewBox="0 0 8 8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <circle cx="4" cy="4" r="3" fill="currentColor" />
      </svg>
    );
  }

  return (
    <article className={styles.container}>
      <Script id="lyrics-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className={styles.backWrap}>
        <Link href="/lyrics" className={styles.backLink}>&larr; Back to Lyrics</Link>
      </div>
      <div className={styles.grid}>
        <main className={styles.main}>
          <h1>{data.title}</h1>
          {data.releaseDate && <p className={styles.meta}>Released: {formatDate(data.releaseDate)}</p>}
          <div className={styles.lyrics} style={{ whiteSpace: "pre-wrap" }}>
            {lyricsText || "(No lyrics)"}
          </div>
          <div className={styles.backWrapBottom}>
            <Link href="/lyrics" className={styles.backLink}>&larr; Back to Lyrics</Link>
          </div>
        </main>

        <aside className={styles.sidebar}>
            <div className={styles.sticky}>
              {data.coverImage && (
                <div className={styles.coverWrap}>
                  <Image
                    src={urlFor(data.coverImage).width(800).height(800).url()}
                    alt={data.title || "Cover"}
                    width={400}
                    height={400}
                    className={styles.cover}
                  />
                </div>
              )}

              {youtubeUrl && (
                <div className={styles.videoWrap}>
                  <iframe
                    width="100%"
                    height="215"
                    src={youtubeUrl.includes("youtube") ? youtubeUrl.replace("watch?v=", "embed/") : youtubeUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              <div className={styles.links}>
                {/* Consolidate spotifyUrl and data.links into a single list with icons */}
                {(() => {
                  const collected: Array<{ url: string; label: string }>
                    = [];

                  const spotifyLink = (data.links && data.links.spotify) || data.spotifyUrl;
                  if (spotifyLink) collected.push({ url: spotifyLink, label: humanizeLabel('spotify') });

                  if (data.links) {
                    if (Array.isArray(data.links)) {
                      data.links.forEach((lnk: any, i: number) => {
                        const url = typeof lnk === "string" ? lnk : lnk && lnk.url;
                        const rawLabel = lnk && (lnk.name || lnk.role) ? (lnk.name || lnk.role) : url;
                        const label = humanizeLabel(rawLabel || url);
                        if (url) collected.push({ url, label });
                      });
                    } else {
                      Object.entries(data.links).forEach(([k, v]: any) => {
                        const url = typeof v === "string" ? v : v && v.url ? v.url : null;
                        const rawLabel = typeof v === "object" && v && v.name ? v.name : k;
                        const label = humanizeLabel(rawLabel || url);
                        if (url) collected.push({ url, label });
                      });
                    }
                  }

                  return collected.length ? (
                    <div>
                      <h4>Links</h4>
                      <ul className={styles.iconList}>
                        {collected.map((lnk, i) => (
                          <li key={`${lnk.url}-${i}`}>
                            <a href={lnk.url} target="_blank" rel="noopener noreferrer" className={styles.linkItem}>
                              <span className={styles.icon} aria-hidden>
                                {getIconForUrl(lnk.url)}
                              </span>
                              <span className={styles.label}>{lnk.label}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null;
                })()}

                {data.credits && (
                  <div>
                    <h4>Credits</h4>
                    <div className={styles.credits}>
                      {typeof data.credits === "string" ? (
                        data.credits
                      ) : Array.isArray(data.credits) ? (
                        <ul>
                          {data.credits.map((c: any) => (
                            <li key={c._key || c.name || JSON.stringify(c)}>
                              {c.name || c.role || c.url ? (
                                <>
                                  {c.url ? (
                                    <a href={c.url} target="_blank" rel="noopener noreferrer">
                                      {c.name || c.role || c.url}
                                    </a>
                                  ) : (
                                    <>{c.name || c.role}</>
                                  )}
                                  {c.role && c.name ? ` — ${c.role}` : c.role && !c.name ? ` — ${c.role}` : ""}
                                </>
                              ) : (
                                JSON.stringify(c)
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        String(data.credits)
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
        </aside>
      </div>
    </article>
  );
}