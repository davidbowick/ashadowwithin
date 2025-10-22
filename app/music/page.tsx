import Image from "next/image";
import Script from "next/script";
import { getReleases } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity.image";  // ✅ now imported from utils
import styles from "./page.module.css";

export default async function MusicPage() {
  const releases = await getReleases();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "A Shadow Within",
    url: "https://ashadowwithin.com",
    album: releases.map((r: any) => ({
      "@type": "MusicAlbum",
      name: r.title,
      url: `https://ashadowwithin.com/music/${r._id}`,
      image: urlFor(r.coverImage).width(1200).url(),
  ...(r.isrc ? { isrcCode: r.isrc } : {}),
      datePublished: r.releaseDate,
      ...(r.tracks && Array.isArray(r.tracks)
        ? { track: r.tracks.map((t: any, i: number) => ({
            "@type": "MusicRecording",
            position: i + 1,
            name: t.title || t.name || t,
            duration: t.duration || undefined,
          })) }
        : {}),
    })),
  };

  return (
    <div className={styles.container}>
      <Script
        id="music-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="center visually-hidden">Music</h1>
      <div className={styles.albumsGrid}>
        {releases.map((release: any, index: number) => (
          <div key={release._id} className={styles.albumCard}>
            <div className={styles.artworkWrapper}>
              <Image
                src={release.coverImage}
                alt={release.title}
                width={400}
                height={400}
                className={styles.artwork}
                fetchPriority={index < 3 ? "high" : "auto"}
                loading={index < 3 ? "eager" : "lazy"}
                placeholder="blur"
                sizes="(max-width: 768px) 100vw, 400px"
                blurDataURL={urlFor(release.coverImage).width(20).blur(10).url()}
              />

              {/* Hover overlay */}
              <div className={styles.overlay}>
                <h3>{release.title}</h3>
                <p className={styles.releaseDate}>
                  {new Date(release.releaseDate).toLocaleDateString()}
                </p>
                <ul className={styles.links}>
                  {(release.links?.spotify || release.spotifyUrl) && (
                    <li>
                      <a href={release.links?.spotify || release.spotifyUrl} target="_blank" rel="noopener noreferrer">
                        Spotify
                      </a>
                    </li>
                  )}
                  {release.links?.appleMusic && (
                    <li>
                      <a href={release.links.appleMusic} target="_blank" rel="noopener noreferrer">
                        Apple Music
                      </a>
                    </li>
                  )}
                  {release.links?.youtube && (
                    <li>
                      <a href={release.links.youtube} target="_blank" rel="noopener noreferrer">
                        YouTube
                      </a>
                    </li>
                  )}
                  {release.links?.bandcamp && (
                    <li>
                      <a href={release.links.bandcamp} target="_blank" rel="noopener noreferrer">
                        Bandcamp
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <h2 className="visually-hidden">{release.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}