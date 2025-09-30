import Image from "next/image";
import type { Metadata } from "next";
import styles from "./page.module.css";
import Script from "next/script";

const API_KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_ID = "PLd1p8Nn8hHQCkuqbu8NbpD7hZDFrgy1QI";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
};

function cleanTitle(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/^"+|"+$/g, "")
    .replace(/^A Shadow Within\s*[-–—]\s*/i, "")
    .replace(/\(.*?\)/g, "")
    .replace(/["“”]/g, "")
    .trim();
}

async function getVideos(): Promise<Video[]> {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    console.error("Failed to fetch videos", res.statusText);
    return [];
  }

  const data = await res.json();

  if (!data.items) return [];

  return data.items.map((item: any) => {
    const snippet = item.snippet;
    return {
      id: snippet.resourceId.videoId,
      title: cleanTitle(snippet.title),
      thumbnail: `https://img.youtube.com/vi/${snippet.resourceId.videoId}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${snippet.resourceId.videoId}`,
    };
  });
}

/**
 * ✅ SEO metadata — featured video used for OG + Twitter card
 */
export async function generateMetadata(): Promise<Metadata> {
  const videos = await getVideos();
  const featured = videos[0];

  if (!featured) {
    return {
      title: "Videos | A Shadow Within",
      description: "Watch the latest official music videos from A Shadow Within.",
    };
  }

  return {
    title: `${featured.title} | A Shadow Within Videos`,
    description: `Watch "${featured.title}" and more official music videos from A Shadow Within.`,
    openGraph: {
      title: `${featured.title} | A Shadow Within`,
      description: `Watch the latest official video from A Shadow Within: ${featured.title}`,
      url: "https://ashadowwithin.com/videos",
      siteName: "A Shadow Within",
      images: [
        {
          url: featured.thumbnail,
          width: 1280,
          height: 720,
          alt: featured.title,
        },
      ],
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title: `${featured.title} | A Shadow Within`,
      description: `Watch the latest official music video from A Shadow Within: ${featured.title}`,
      images: [featured.thumbnail],
    },
  };
}

export default async function VideoPage() {
  const videos = await getVideos();

  if (!videos.length) {
    return <p className={styles.loading}>No videos found.</p>;
  }

  const [featured, ...rest] = videos;

  return (
    <div className={styles.container}>
      {/* Structured Data */}
      <Script
        id="video-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            // Featured video as a VideoObject
            {
              "@context": "https://schema.org",
              "@type": "VideoObject",
              name: featured.title,
              description: `Watch the latest official video from A Shadow Within: ${featured.title}`,
              thumbnailUrl: featured.thumbnail,
              uploadDate: "2024-09-01", // TODO: replace with actual publish date if available
              embedUrl: `https://www.youtube.com/embed/${featured.id}`,
              contentUrl: featured.url,
              publisher: {
                "@type": "MusicGroup",
                name: "A Shadow Within",
                url: "https://ashadowwithin.com",
              },
            },
            // ItemList of all videos
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: videos.map((v, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: v.url,
                name: v.title,
              })),
            },
          ]),
        }}
      />
      <h2 className="center visually-hidden">Videos</h2>
      {/* Featured video */}
      <section className={styles.featured}>
        <iframe
          src={`https://www.youtube.com/embed/${featured.id}?rel=0&modestbranding=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </section>

      {/* Grid of other videos */}
      <section className={styles.videos}>
        {rest.map((video) => (
          <div key={video.id} className={styles.video}>
            <a href={video.url} target="_blank" rel="noopener noreferrer">
              <Image
                src={video.thumbnail}
                alt={video.title}
                width={480}
                height={270}
                loading="lazy"
              />
              <p className="visually-hidden">{video.title}</p>
            </a>
          </div>
        ))}
      </section>
    </div>
    
  );
  
}