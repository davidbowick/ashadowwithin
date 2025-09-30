// scripts/downloadSpotifyCovers.ts
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // load env vars

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const artistId = process.env.SPOTIFY_ARTIST_ID || "30i42tQw7YOSEFgbPBYEqW"; // fallback: A Shadow Within
const outputDir = path.join(process.cwd(), "spotify_covers");

// --- 1. Get Spotify token ---
async function getSpotifyToken(): Promise<string> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`Failed to get token: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

// --- 2. Download album covers ---
async function downloadCovers() {
  if (!clientId || !clientSecret) {
    console.error("❌ Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env.local");
    return;
  }

  const token = await getSpotifyToken();

  const albumsUrl = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=single,album&limit=50`;
  const albumsRes = await fetch(albumsUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!albumsRes.ok) {
    throw new Error(`Failed to fetch albums: ${albumsRes.status} ${albumsRes.statusText}`);
  }

  const albumsData = (await albumsRes.json()) as any;
  console.log("📀 Spotify albums response:", JSON.stringify(albumsData, null, 2));

  if (!albumsData.items || albumsData.items.length === 0) {
    console.error("⚠️ No albums returned. Check SPOTIFY_ARTIST_ID or API token permissions.");
    return;
  }

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  for (const album of albumsData.items) {
    const image = album.images?.[0];
    if (!image) {
      console.log(`No image for album: ${album.name}`);
      continue;
    }

    const filename = `${album.name.replace(/[^a-z0-9]/gi, "_")}.jpg`;
    const filePath = path.join(outputDir, filename);

    const imgRes = await fetch(image.url);
    if (!imgRes.ok) {
      console.error(`❌ Failed to fetch image for ${album.name}: ${imgRes.statusText}`);
      continue;
    }

    const buffer = await imgRes.buffer();
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Downloaded ${album.name} -> ${filePath}`);
  }
}

downloadCovers().catch((err) => {
  console.error("❌ Error in downloadCovers:", err);
});