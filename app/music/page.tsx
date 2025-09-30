import { getArtistAlbums } from "@/lib/spotify";
import styles from "./page.module.css";

const ARTIST_ID = process.env.SPOTIFY_ARTIST_ID || "30i42tQw7YOSEFgbPBYEqW";

export default async function MusicPage() {
  const albums = await getArtistAlbums(ARTIST_ID);

  return (
    <div>
      <h1 className="center visually-hidden">Music</h1>
      <div className={styles.albumsGrid}>
        {albums.map((album: any) => (
          <div key={album.id} className={styles.albumCard}>
            <img src={album.images[0]?.url} alt={album.name} />
            <h2>{album.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}